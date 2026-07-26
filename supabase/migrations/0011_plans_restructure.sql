-- ============================================================
-- Migration 0011: Reestruturação de planos (Gratuito/Mensal/Anual)
-- ============================================================
-- Aplicar ANTES de fazer deploy do código desta entrega:
-- o admin passa a listar planos por `is_active` e o seletor
-- precisa da linha 'Gratuito'.
--
-- O que faz:
--   1. plans.is_active (Semestral deixa de ser ofertado, sem apagar
--      a linha — assinaturas semestrais existentes são honradas até
--      expirarem e continuam válidas via FK)
--   2. Linha 'Gratuito' (duration_months = 0) no catálogo
--   3. subscriptions.expires_at passa a aceitar NULL (Gratuito não expira)
--   4. handle_new_user canônico: cadastro novo = perfil 'aluno' +
--      assinatura Gratuito ativa (nunca plano pago). Isto também
--      SOBRESCREVE qualquer versão adulterada do trigger que esteja
--      criando assinatura Mensal no cadastro (causa raiz suspeita —
--      essa lógica não existe em nenhuma migration versionada).
--   5. Backfill: alunos sem assinatura ativa ganham assinatura Gratuito
--   6. RLS de questions: leitura para qualquer usuário autenticado
--      (o limite do plano Gratuito é aplicado na aplicação —
--      FREE_PLAN_QUESTION_LIMIT em src/lib/plans.ts)
--
-- Obs: as políticas de materials (pagos p/ assinantes) não mudam aqui.
-- Uma assinatura Gratuito (expires_at NULL) NÃO passa nos filtros
-- `expires_at > now()`, portanto não concede acesso a conteúdo pago.
-- ============================================================

-- 1. Catálogo: flag de oferta
ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

UPDATE public.plans SET is_active = false WHERE name = 'Semestral';

-- 2. Plano Gratuito
INSERT INTO public.plans (name, duration_months)
SELECT 'Gratuito', 0
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'Gratuito');

-- 3. Gratuito não tem data de fim
ALTER TABLE public.subscriptions
  ALTER COLUMN expires_at DROP NOT NULL;

-- 4. Trigger canônico de cadastro: perfil + assinatura Gratuito ativa
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

  -- Todo cadastro novo entra no plano Gratuito, ativo e sem expiração
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

-- 5. Backfill: alunos existentes sem assinatura ativa -> Gratuito
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

-- 6. Banco de Questões acessível a todo usuário autenticado
--    (limite do Gratuito é responsabilidade da aplicação)
DROP POLICY IF EXISTS "Alunos com assinatura ativa veem questões" ON public.questions;

CREATE POLICY "Usuários autenticados veem questões"
  ON public.questions FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- Verificação pós-aplicação (rodar no SQL Editor):
--   SELECT name, duration_months, is_active FROM public.plans ORDER BY duration_months;
--   -- esperado: Gratuito(0, true), Mensal(1, true), Semestral(6, false), Anual(12, true)
--   SELECT count(*) FROM public.users u WHERE u.role='aluno'
--     AND NOT EXISTS (SELECT 1 FROM public.subscriptions s WHERE s.user_id=u.id AND s.status='active');
--   -- esperado: 0
-- ============================================================
