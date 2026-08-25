# RUNBOOK — Aplicação manual das migrations 0011 → 0017 (6 migrations)

**Para ser seguido no SQL Editor do Supabase (Dashboard → SQL Editor → New query).**
Ordem obrigatória: **0011 → 0012 → 0013 → 0015 → 0016 → 0017**. Aplique uma por vez, rode a verificação, e só então passe para a próxima.

> As migrations **0010 e 0014 NÃO entram nesta rodada** — ver seção final "NÃO EXECUTAR".

> **Deploy:** aplique 0011→0016 antes do push; a **0017 é a única que entra logo DEPOIS do deploy concluir** (ela é incompatível com o código antigo que ainda estiver no ar).

---

## 0. Pré-requisitos (faça antes de qualquer SQL)

- [ ] **Confirme a janela de backup do seu plano:** Dashboard do projeto → **Settings → Database → Backups**. Ali aparece o plano e a retenção (plano Pro: backups diários com 7 dias de retenção; plano Free: sem backups automáticos — nesse caso o backup manual abaixo é obrigatório).
- [ ] **Backup manual antes de começar** (qualquer uma das opções):
  - **Opção A (Dashboard):** Settings → Database → Backups → *Download* do backup mais recente, se disponível.
  - **Opção B (sem CLI):** No SQL Editor, rode `SELECT * FROM <tabela>` e use o botão **Export CSV** para cada tabela crítica: `users`, `subscriptions`, `plans`, `standalone_answers`, `materials`, `products`, `questions`, `attempts`, `question_lists`.
  - **Opção C (com CLI instalada):** `supabase db dump -f backup_pre_0011.sql --linked`.
- [ ] Confirme que está no projeto certo: o nome do projeto é **Meta10** (ref `aohzpfzzmbqtqziugpsj`).
- [ ] Não faça o deploy do código antes de terminar as migrations 0011→0016 (o código novo depende delas); a 0017 vai logo após o deploy.

---

## 1. Migration 0011 — Planos Gratuito/Mensal/Anual

**O que faz:** cria o plano Gratuito no catálogo, marca o Semestral como não-ofertado (sem apagar nada), faz todo cadastro novo nascer no Gratuito, dá o Gratuito aos alunos existentes sem assinatura, e libera a leitura do Banco de Questões para qualquer usuário logado (o limite do Gratuito é aplicado pela aplicação).

**Cole e execute** o conteúdo integral do arquivo `supabase/migrations/0011_plans_restructure.sql`:

```sql
ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

UPDATE public.plans SET is_active = false WHERE name = 'Semestral';

INSERT INTO public.plans (name, duration_months)
SELECT 'Gratuito', 0
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'Gratuito');

ALTER TABLE public.subscriptions
  ALTER COLUMN expires_at DROP NOT NULL;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  is_seed_admin boolean;
  free_plan_id uuid;
begin
  is_seed_admin := new.email = current_setting('app.admin_seed_email', true);

  insert into public.users (id, email, nome, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    case when is_seed_admin then 'admin'::user_role else 'aluno'::user_role end
  );

  if not is_seed_admin then
    select id into free_plan_id from public.plans where name = 'Gratuito' limit 1;
    if free_plan_id is not null then
      insert into public.subscriptions (user_id, plan_id, status, expires_at)
      values (new.id, free_plan_id, 'active', null);
    end if;
  end if;

  return new;
end;
$$;

INSERT INTO public.subscriptions (user_id, plan_id, status, expires_at)
SELECT u.id,
       (SELECT id FROM public.plans WHERE name = 'Gratuito' LIMIT 1),
       'active',
       NULL
FROM public.users u
WHERE u.role = 'aluno'
  AND NOT EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.user_id = u.id AND s.status = 'active'
  );

DROP POLICY IF EXISTS "Alunos com assinatura ativa veem questões" ON public.questions;

CREATE POLICY "Usuários autenticados veem questões"
  ON public.questions FOR SELECT
  USING (auth.uid() IS NOT NULL);
```

**Verificação pós-aplicação** (rode logo em seguida):

```sql
SELECT name, duration_months, is_active FROM public.plans ORDER BY duration_months;
-- SUCESSO = 4 linhas: Gratuito(0, true), Mensal(1, true), Semestral(6, FALSE), Anual(12, true)

SELECT count(*) AS alunos_sem_assinatura_ativa
FROM public.users u
WHERE u.role = 'aluno'
  AND NOT EXISTS (SELECT 1 FROM public.subscriptions s WHERE s.user_id = u.id AND s.status = 'active');
-- SUCESSO = 0

SELECT prosrc LIKE '%Gratuito%' AS trigger_atualizado FROM pg_proc WHERE proname = 'handle_new_user';
-- SUCESSO = true
```

**Se falhar** — rollback completo da 0011:

```sql
DROP POLICY IF EXISTS "Usuários autenticados veem questões" ON public.questions;
CREATE POLICY "Alunos com assinatura ativa veem questões" ON public.questions FOR SELECT USING (
  exists (select 1 from public.subscriptions where user_id = auth.uid() and status = 'active' and expires_at > now())
  or public.is_admin()
);
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  is_seed_admin boolean;
begin
  is_seed_admin := new.email = current_setting('app.admin_seed_email', true);
  insert into public.users (id, email, nome, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'nome', ''),
    case when is_seed_admin then 'admin'::user_role else 'aluno'::user_role end);
  return new;
end; $$;
DELETE FROM public.subscriptions
WHERE expires_at IS NULL AND plan_id = (SELECT id FROM public.plans WHERE name = 'Gratuito');
ALTER TABLE public.subscriptions ALTER COLUMN expires_at SET NOT NULL;
DELETE FROM public.plans WHERE name = 'Gratuito';
ALTER TABLE public.plans DROP COLUMN IF EXISTS is_active;
```

**Telas que passam a funcionar:** cadastro novo caindo no Gratuito; seletor de plano do "Gerenciar Acesso" (com a opção Gratuito); Banco de Questões visível para aluno sem assinatura paga.

---

## 1b. Migration 0012 — Assinaturas de equipe → Gratuito

**O que faz:** converte as 4 assinaturas Mensal existentes para o plano Gratuito, sem apagar nada e registrando no log. Decisão da cliente em 27/07/2026: nenhuma é pagante — são a conta-aluno de teste da Emília (dona da plataforma; sua conta principal `me.avelar@hotmail.com` é admin), os professores Bruna e Ruan, e a conta-aluno de teste do Ruan.

**Cole e execute** o conteúdo integral de `supabase/migrations/0012_fix_wrongly_paid_users.sql` (é um único comando `WITH ... UPDATE ... INSERT` — copie o arquivo inteiro).

**Verificação:**

```sql
SELECT count(*) AS assinaturas_pagas_ativas
FROM public.subscriptions s JOIN public.plans p ON p.id = s.plan_id
WHERE s.status = 'active' AND p.duration_months > 0;
-- SUCESSO = 0

SELECT count(*) AS logs_da_conversao FROM public.subscription_logs WHERE notes LIKE 'Migration 0012%';
-- SUCESSO = 4
```

**Se falhar** — rollback (recoloca as 4 no Mensal com vencimento em 1 ano, como estavam):

```sql
UPDATE public.subscriptions s
SET plan_id = (SELECT id FROM public.plans WHERE name = 'Mensal' LIMIT 1),
    expires_at = now() + interval '1 year'
FROM public.subscription_logs l
WHERE l.user_id = s.user_id AND l.notes LIKE 'Migration 0012%' AND s.status = 'active';
DELETE FROM public.subscription_logs WHERE notes LIKE 'Migration 0012%';
```

**Telas que passam a refletir:** coluna "Plano Atual" do admin (todos como Gratuito), badge do dashboard dessas contas, lista "Alunos Ativos" (fica vazia até existir pagante real).

---

## 2. Migration 0013 — Categorização de produtos

**O que faz:** dá à loja os campos "tipo de material" e "disciplina" nos produtos e grava no banco a regra de que material de estudo nunca pode ser gratuito.

**Cole e execute** (`supabase/migrations/0013_products_material_type.sql`):

```sql
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS material_type text,
  ADD COLUMN IF NOT EXISTS subject text;

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS chk_products_material_type;
ALTER TABLE public.products
  ADD CONSTRAINT chk_products_material_type
  CHECK (material_type IS NULL OR material_type IN ('atividade_pdf', 'resumo', 'mapa_mental', 'jogo'));

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_subject_fkey;
ALTER TABLE public.products
  ADD CONSTRAINT products_subject_fkey
  FOREIGN KEY (subject) REFERENCES public.disciplines(slug) ON DELETE SET NULL;

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS chk_products_material_paid;
ALTER TABLE public.products
  ADD CONSTRAINT chk_products_material_paid
  CHECK (material_type IS NULL OR tipo = 'pago');

CREATE INDEX IF NOT EXISTS idx_products_material_subject
  ON public.products(material_type, subject);
```

**Verificação:**

```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'products' AND column_name IN ('material_type', 'subject');
-- SUCESSO = 2 linhas (material_type e subject)

SELECT conname FROM pg_constraint
WHERE conname IN ('chk_products_material_type', 'chk_products_material_paid', 'products_subject_fkey');
-- SUCESSO = 3 linhas
```

**Se falhar** — rollback:

```sql
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS chk_products_material_paid;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS chk_products_material_type;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_subject_fkey;
DROP INDEX IF EXISTS idx_products_material_subject;
ALTER TABLE public.products DROP COLUMN IF EXISTS material_type, DROP COLUMN IF EXISTS subject;
```

**Telas que passam a funcionar:** cadastro/edição de produto no admin com "Tipo de Material" e "Disciplina" salvando de verdade.

---

## 3. Migration 0015 — Storage de imagens

**O que faz:** cria os dois cofres de imagens (produtos e questões) com leitura pública e escrita restrita (admin; questões também professor), com limite de 2 MB e apenas jpg/png/webp, e a coluna de imagem no enunciado das questões.

**Cole e execute** o conteúdo integral de `supabase/migrations/0015_storage_images.sql` (SQL longo — abra o arquivo no repositório e copie tudo; ele cria: 2 buckets, a função `is_admin_or_professor()`, 8 policies de storage e a coluna `questions.image_url`).

**Verificação:**

```sql
SELECT id, public, file_size_limit FROM storage.buckets ORDER BY id;
-- SUCESSO = 2 linhas: product-images e question-images, public=true, 2097152

SELECT count(*) AS policies_de_imagem FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname ILIKE '%images%';
-- SUCESSO = 8

SELECT column_name FROM information_schema.columns
WHERE table_name = 'questions' AND column_name = 'image_url';
-- SUCESSO = 1 linha
```

**Se falhar** — rollback (só funciona enquanto os buckets estiverem vazios):

```sql
DROP POLICY IF EXISTS "product images leitura publica" ON storage.objects;
DROP POLICY IF EXISTS "product images upload admin" ON storage.objects;
DROP POLICY IF EXISTS "product images update admin" ON storage.objects;
DROP POLICY IF EXISTS "product images delete admin" ON storage.objects;
DROP POLICY IF EXISTS "question images leitura publica" ON storage.objects;
DROP POLICY IF EXISTS "question images upload autores" ON storage.objects;
DROP POLICY IF EXISTS "question images update autores" ON storage.objects;
DROP POLICY IF EXISTS "question images delete autores" ON storage.objects;
DELETE FROM storage.buckets WHERE id IN ('product-images', 'question-images');
DROP FUNCTION IF EXISTS public.is_admin_or_professor();
ALTER TABLE public.questions DROP COLUMN IF EXISTS image_url;
```

**Telas que passam a funcionar:** upload de imagem no admin de produtos e no formulário de questões; imagem do enunciado na resolução do aluno.

---

## 4. Migration 0016 — Busca da loja

**O que faz:** adiciona assunto e preço promocional aos produtos e cria os índices que fazem a busca por texto e os filtros serem rápidos.

**Cole e execute** (`supabase/migrations/0016_store_search.sql`):

```sql
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS subject_id uuid REFERENCES public.subjects(id) ON DELETE SET NULL;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS promo_price numeric(10,2);

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS chk_products_promo_price;
ALTER TABLE public.products
  ADD CONSTRAINT chk_products_promo_price
  CHECK (promo_price IS NULL OR (promo_price > 0 AND promo_price < price));

CREATE INDEX IF NOT EXISTS idx_products_subject_id ON public.products(subject_id);
CREATE INDEX IF NOT EXISTS idx_products_active_created ON public.products(is_active, created_at DESC);

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_products_name_trgm
  ON public.products USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_description_trgm
  ON public.products USING gin (description gin_trgm_ops);
```

**Verificação:**

```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'products' AND column_name IN ('subject_id', 'promo_price');
-- SUCESSO = 2 linhas

SELECT count(*) AS indices_da_loja FROM pg_indexes
WHERE tablename = 'products' AND indexname LIKE 'idx_products%';
-- SUCESSO = 5 (material_subject, subject_id, active_created, name_trgm, description_trgm)

SELECT extname FROM pg_extension WHERE extname = 'pg_trgm';
-- SUCESSO = 1 linha
```

**Se falhar** — rollback (a extensão pg_trgm pode ficar, é inofensiva):

```sql
DROP INDEX IF EXISTS idx_products_subject_id;
DROP INDEX IF EXISTS idx_products_active_created;
DROP INDEX IF EXISTS idx_products_name_trgm;
DROP INDEX IF EXISTS idx_products_description_trgm;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS chk_products_promo_price;
ALTER TABLE public.products DROP COLUMN IF EXISTS subject_id, DROP COLUMN IF EXISTS promo_price;
```

**Telas que passam a funcionar:** filtros completos da loja (assunto), preço promocional nos cards, campo de assunto e promoção no admin de produtos.

---

## 5. Migration 0017 — Refazer questões e estatísticas

**O que faz:** permite ao aluno refazer questões guardando cada tentativa no histórico, e cria as funções que calculam as estatísticas (suas e de todos os alunos) direto no banco.

**Cole e execute** o conteúdo integral de `supabase/migrations/0017_question_attempts_stats.sql` (abra o arquivo no repositório e copie tudo; ele remove a trava de "1 resposta por questão", cria um índice e 3 funções: `get_question_stats`, `get_my_question_stats`, `count_my_answered_questions`).

**Verificação:**

```sql
SELECT conname FROM pg_constraint WHERE conname = 'standalone_answers_user_id_question_id_key';
-- SUCESSO = 0 linhas (a trava foi removida)

SELECT proname FROM pg_proc
WHERE proname IN ('get_question_stats', 'get_my_question_stats', 'count_my_answered_questions');
-- SUCESSO = 3 linhas

SELECT * FROM public.get_question_stats() LIMIT 3;
-- SUCESSO = retorna linhas com question_id, total_attempts, correct_pct etc. (há 23 respostas no banco)
```

**Se falhar** — rollback (ATENÇÃO: só é possível enquanto nenhum aluno tiver refeito questão; ver "ponto de não retorno"):

```sql
DROP FUNCTION IF EXISTS public.get_question_stats(uuid[]);
DROP FUNCTION IF EXISTS public.get_my_question_stats(uuid[]);
DROP FUNCTION IF EXISTS public.count_my_answered_questions();
DROP INDEX IF EXISTS idx_standalone_user_question;
ALTER TABLE public.standalone_answers
  ADD CONSTRAINT standalone_answers_user_id_question_id_key UNIQUE (user_id, question_id);
-- Se este último comando der erro de duplicidade, é porque já existem
-- múltiplas tentativas — o rollback não é mais possível sem apagar histórico.
```

**Telas que passam a funcionar:** botão Refazer (listagem e resolução), estatísticas por questão para o aluno, coluna "Desempenho" no admin, limite do Gratuito contando questões distintas.

---

## Ponto de não retorno

| O quê | Por quê |
|---|---|
| **0017 depois do primeiro "Refazer"** | Assim que um aluno refizer uma questão, existem 2+ registros do mesmo par aluno+questão. A trava de unicidade não pode ser recriada sem **apagar histórico de tentativas**. Este é o único rollback que expira de verdade. |
| **0015 depois do primeiro upload** | Apagar os buckets apaga os arquivos enviados. Rollback limpo só com buckets vazios. |
| **0012** | Rollback disponível (ver seção 1b) enquanto os logs da conversão existirem. |
| **0011 (parcialmente)** | O rollback acima remove as assinaturas Gratuito criadas por backfill/trigger. Funciona enquanto for possível distinguir essas assinaturas (`expires_at IS NULL` + plano Gratuito) — o que continua verdadeiro ao longo do tempo, mas cada dia de operação mistura mais dados novos ao estado antigo. |
| 0013 e 0016 | Rollback simples (colunas novas, sem dados críticos) — perde apenas o que o admin tiver preenchido nos campos novos. |

---

## ⛔ NÃO EXECUTAR NESTA RODADA

| Migration | Motivo (1 linha) |
|---|---|
| `0010_drop_simulados.sql` | Apaga as tabelas de simulado (2 listas, 9 tentativas de alunos) — aguarda sua aprovação explícita e backup. |
| `0014_materials_to_products.sql` | **OBSOLETA.** A cliente decidiu migrar aos poucos pelo botão "Enviar para a Loja" do admin; o arquivo fica só como referência. |

*(Os dois arquivos estão 100% comentados — colar e executar por engano não faz nada, mas não conte com isso: simplesmente não os abra nesta rodada.)*
