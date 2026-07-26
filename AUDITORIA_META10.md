# AUDITORIA META 10 — Sequência de 8 blocos de alterações

**Data da auditoria:** 26/07/2026
**Método:** leitura do repositório (diff acumulado e arquivos), das 8 migrations geradas, e consulta **ao vivo, somente leitura**, ao banco Supabase de produção (que voltou a responder durante esta auditoria — ficou inacessível por DNS durante toda a execução dos 8 blocos).

**Fato essencial antes de tudo: NENHUM commit foi feito nesta sequência.** Os últimos commits do repositório são anteriores a este trabalho (`a4387ea Hotfix: selects de disciplinas...`). Todo o trabalho está no working tree: **82 arquivos modificados, 21 removidos, 12 novos** (115 no total). Nada foi enviado para a Vercel; a produção continua rodando o código antigo.

---

## SEÇÃO 1 — RISCO DE DADOS, PRIMEIRO DE TUDO

### 1.1 A informação mais importante desta auditoria

**Nenhuma migration foi aplicada ao banco. Nenhum dado de produção foi alterado, convertido ou apagado por esta sequência de trabalho.** Isso foi verificado ao vivo no banco (não é suposição):

- A tabela `plans` contém apenas **Mensal, Semestral e Anual** — a linha "Gratuito" e a coluna `is_active` (migration 0011) **não existem**.
- As colunas `products.material_type`, `products.promo_price` e `questions.image_url` **não existem** (migrations 0013, 0016, 0015 não aplicadas — o banco retorna erro 400 ao consultá-las).
- A lista de buckets do Storage está **vazia** (migration 0015 não aplicada).
- As tabelas de simulado **existem intactas**: `question_lists` = 2 registros, `question_list_items` = 0, `attempts` = 9 (5 finalizadas), questões com `context='simulado'` = 6.

### 1.2 Migrations criadas nesta sequência

| Arquivo | O que faz | Estado |
|---|---|---|
| `0010_drop_simulados.sql` | Removeria tabelas de simulado (attempts, question_list_items, question_lists) e questões de simulado | **GERADA, 100% comentada, NÃO APLICADA** — aguarda sua aprovação |
| `0011_plans_restructure.sql` | Cria plano Gratuito, `plans.is_active`, `expires_at` nullable, trigger de cadastro→Gratuito, backfill, abre leitura de questões a autenticados | **GERADA, executável, NÃO APLICADA** |
| `0012_fix_wrongly_paid_users.sql` | Converteria assinaturas pagas "sem pagamento" para Gratuito | **GERADA, 100% comentada, NÃO APLICADA** — e ver alerta em 1.4 |
| `0013_products_material_type.sql` | `products.material_type` + `products.subject` + regra "material nunca gratuito" | **GERADA, executável, NÃO APLICADA** |
| `0014_materials_to_products.sql` | Migraria os 34 materiais para produtos da loja | **GERADA, 100% comentada, NÃO APLICADA** — aguarda decisão A/B (Seção 2) |
| `0015_storage_images.sql` | Buckets de imagem (produtos e questões) + policies + `questions.image_url` | **GERADA, executável, NÃO APLICADA** |
| `0016_store_search.sql` | `products.subject_id`, `promo_price`, tipo "questoes", índices de busca (pg_trgm) | **GERADA, executável, NÃO APLICADA** |
| `0017_question_attempts_stats.sql` | Remove trava de 1 resposta por questão (refazer) + funções de estatística no Postgres | **GERADA, executável, NÃO APLICADA** |

### 1.3 O que foi apagado

- **No banco: nada.** Nenhuma tabela, coluna ou registro.
- **No código:** foram removidos 21 arquivos — as telas e rotas do módulo Simulados (admin e aluno), as actions e camada de dados de simulados, as páginas de download por matéria de Atividades/Mapas/Resumos/Jogos do aluno, e um componente antigo da loja do aluno. **Tudo recuperável**: os arquivos estão no histórico do git (nada foi commitado ainda; `git restore` recupera qualquer um).

### 1.4 Correção de planos — situação real (lista nominal, são 5 assinaturas / 7 usuários)

**Nenhum usuário teve o plano alterado.** A migration 0012 nunca rodou. Estado real hoje:

| Usuário | Papel | Plano | Status | Assinatura criada | Expira |
|---|---|---|---|---|---|
| MARIA EMILIA AVELAR (meta10espacopedagogico@gmail.com) | aluno | Mensal | ativa | 29/05/2026 (7 dias após o cadastro) | 29/05/2027 |
| Bruna dos Santos (brunaeuzebio189@gmail.com) | professor | Mensal | ativa | 12/06/2026 (4 min após o cadastro) | 12/06/2027 |
| Ruan andrade (ruanandradedejesus@gmail.com) | professor | Mensal | ativa | 18/06/2026 (18 min após o cadastro) | 18/06/2027 |
| RUAN ANDRADE2 (www.ruantop@gmail.com) | aluno | Mensal | expirada | 19/06/2026 | 19/06/2027 |
| RUAN ANDRADE2 (www.ruantop@gmail.com) | aluno | Mensal | ativa | 20/06/2026 | 19/06/2027 |
| emersonbrandao058@gmail.com | aluno | — sem assinatura — | — | — | — |
| julio cesar / MARIA EMILIA (admins) | admin | — sem assinatura — | — | — | — |

**Registro de pagamento não existe para nenhum deles** — mas atenção: a tabela de auditoria `subscription_logs` tem **0 registros** porque o código de atribuição sempre gravou um valor inválido (`manual_assign`) que viola a regra da tabela e falhava em silêncio (bug real, corrigido nesta sequência). Ou seja, a ausência de log **não prova** ausência de atribuição legítima pelo admin.

**Descoberta importante que corrige o diagnóstico do bloco 2:** os dados ao vivo mostram que o cadastro **não** cria assinatura nenhuma (o usuário emersonbrandao, cadastrado em 04/07, está sem assinatura — como deveria). Todas as 5 assinaturas têm a assinatura digital do **modal "Gerenciar Acesso" do admin**, que vinha pré-preenchido com "Mensal + vencimento em 1 ano" — todas são Mensal expirando exatamente 1 ano depois de criadas. A causa provável do "aluno entra como Mensal" é o admin abrir o modal e salvar com os valores padrão, não um trigger no cadastro. **Consequência prática: a heurística da migration 0012 (assinatura criada até 10 min após o cadastro) NÃO deve ser executada como está** — ela pegaria só a Bruna (professora, possivelmente uma atribuição legítima e rápida) e deixaria passar as demais. Com apenas 5 assinaturas, a recomendação é você revisar esta lista manualmente com a cliente e me dizer caso a caso quem deve ser pago e quem vai para o Gratuito. O código novo já elimina o mecanismo do bug (modal sem pré-seleção + logs funcionando).

### 1.5 Materiais gratuitos — situação real

**Nenhum registro foi convertido, arquivado ou apagado.** Inventário ao vivo (que o bloco 3 pediu e não pôde ser gerado na época): existem **34 materiais** dos 4 tipos e **todos os 34 estão marcados como gratuitos hoje**: 30 atividades em PDF (matemática, português, geografia, biologia, ciências, física, história), 2 mapas mentais (Anatomia da Audição, Concordância Nominal), 1 resumo (Tipos de Apostos), 1 jogo (Quiz Sistema Solar). A lista nominal completa sai da query no topo da `0014_materials_to_products.sql`. A loja real tem **1 único produto** ("JOGO DE PRONOMES", R$ 99,90, pago, sem imagem).

### 1.6 Simulados — situação real

**As tabelas existem no banco, nada foi dropado.** `question_lists` = 2 simulados, `attempts` = 9 tentativas de alunos (5 finalizadas), 6 questões de simulado. A remoção só acontece se/quando você aprovar e executar a 0010 (que exige backup antes, conforme instruções no próprio arquivo).

### 1.7 Perdas de dados e caminhos de recuperação

**Nenhuma perda de dado identificada nesta sequência.** Para o futuro: antes de aplicar 0010/0012/0014 (as três que mexem em dados), exporte backup — o Supabase mantém backups diários automáticos com janela típica de **7 dias no plano Pro (NÃO VERIFICADO qual é o plano contratado deste projeto** — confirme em Settings → Database → Backups antes de rodar qualquer uma delas).

---

## SEÇÃO 2 — PREMISSAS QUE VOCÊ NÃO RESPONDEU E EU ASSUMI

| # | Pergunta que ficou aberta | O que assumi | Onde está | Se você decidir diferente |
|---|---|---|---|---|
| 1 | **Limite de questões do Gratuito** | **10 questões distintas** (valor provisório; refazer não consome) | `src/lib/plans.ts` linha 11 (`FREE_PLAN_QUESTION_LIMIT = 10`) | Trocar 1 número em 1 arquivo — texto do card e bloqueio acompanham automaticamente |
| 2 | **Diferença de benefício Mensal × Anual** | **Nenhuma diferença de benefício** — ambos "Banco de Questões ilimitado + Estatísticas"; diferem só em preço/periodicidade; destaque "Mais Vantajoso" no Anual | `src/lib/plans.ts` linhas 31–73 | Editar o array `PLANS` (texto) — sem impacto em banco |
| 3 | **Texto dos cards de plano** (você pediu para ver ANTES de aplicar) | Apliquei o texto proposto sem sua aprovação prévia (a sessão rodou sem interação) | `src/lib/plans.ts` | Só editar texto; nada estrutural |
| 4 | **Unificar telas de materiais do admin na Loja (opção A) ou manter separadas (opção B)?** | **Nada foi decidido nem migrado.** As 4 telas do admin continuam existindo e gravando em `materials` (apenas sem o campo "Gratuito"); a Loja ganhou os campos de tipo de material/disciplina; a migração de dados (0014) está comentada | Telas em `src/app/admin/{atividades-pdf,resumos,mapas-mentais,jogos-pedagogicos}/`; análise A/B no relatório do bloco 3; `0014_materials_to_products.sql` | Opção A: rodar a 0014 + remover as 4 telas + reapontar métricas de professores. Opção B: adicionar preço/link em `materials` e fazer a loja ler 2 tabelas (mais retrabalho) |
| 5 | **Destino dos 34 materiais gratuitos** | Nenhum destino aplicado. Minha proposta (não executada): virar produtos pagos INATIVOS para a cliente precificar; hoje seguem gratuitos no banco, mas **as telas que os entregavam foram removidas do código** — ao publicar, eles ficam inacessíveis ao aluno até a decisão | Inventário na Seção 1.5; SQL na `0014` | Você marca item a item: precificar ou arquivar |
| 6 | **Dados históricos de simulados** (2 listas, 9 tentativas) | Preservados no banco; apenas o acesso pela interface foi removido. O DROP está escrito e comentado | `0010_drop_simulados.sql` | Aprovar o DROP (com backup) ou manter as tabelas como arquivo morto |
| 7 | **Modelo do plano Gratuito no banco** | Gratuito = linha real em `plans` + assinatura ativa sem data de fim para todo aluno (trigger + backfill na 0011) | `0011_plans_restructure.sql` | Se preferir "gratuito = ausência de assinatura", a 0011 precisa ser reescrita antes de aplicar |
| 8 | **Filtro "Questões" na loja (bloco 5)** | Criei um 5º tipo de produto `questoes` (apostilas de questões vendidas avulsas) para atender o filtro pedido — o Banco de Questões por plano é outra coisa e continua separado | `src/lib/constants.ts` (MATERIAL_TYPES); CHECK na `0016` | Remover o item do array + ajustar o CHECK da 0016 antes de aplicar |
| 9 | **Texto da seção Conteúdos Gratuitos** (você pediu para ver) | Apliquei o texto proposto sem aprovação prévia | `src/components/meta10/free-content-section.tsx` | Só editar texto |
| 10 | **Paginação ou scroll infinito** | Paginação (12 por página) — o escopo permitia escolher o mais simples | `src/lib/data/products.ts` (`STORE_PAGE_SIZE`), `store-results.tsx` | Trocar por scroll infinito é reescrever o componente de resultados |
| 11 | **"Horas de Estudo"** | Não implementei (você pediu o caminho antes): não há dado para calcular; o card foi removido do dashboard. Caminho proposto: registrar abertura da questão (`started_at`) ou tabela de sessões | Card removido em `src/app/aluno/dashboard/page.tsx` | Escolher o mecanismo de medição; eu implemento |
| 12 | **Múltiplas imagens por questão / imagem nas alternativas** | Não implementadas (você pediu o custo antes). 1 imagem por enunciado está feita. Custos: múltiplas ≈ meio dia + migration; alternativas ≈ horas, **sem** mudança de schema (jsonb) | `question-form-fields.tsx`, `solve-client.tsx` | Autorizar que eu implemento |
| 13 | **Critério da limpeza de "pagantes sem pagamento"** | Heurística temporal na 0012 — **que os dados reais desmentiram** (ver 1.4). Não executar como está | `0012_fix_wrongly_paid_users.sql` | Revisão manual das 5 assinaturas com a cliente (recomendado) |
| 14 | **Métricas do dashboard do aluno** | Reapontei os cálculos de "tentativas de simulado" para "respostas do Banco de Questões" e removi o card sem fonte de dado (Horas) | `src/lib/data/standalone-answers.ts` (`getStudentStats`) | Se quiser outra semântica (ex.: exercícios = questões distintas, não tentativas), é 1 função |

---

## SEÇÃO 3 — INVENTÁRIO DE ALTERAÇÕES POR ÁREA

### Site público

| Arquivo | Ação | O que mudou |
|---|---|---|
| `src/components/meta10/hero-banner.tsx` | alterado | Subtítulo sem "simulados" |
| `src/components/meta10/header.tsx` | alterado | Menu maior (16→18px), contraste com sombra sobre a foto |
| `src/components/meta10/materials-section.tsx` | alterado | Sem card Simulados; 5 cards viram links (Banco de Questões→dashboard; demais→loja filtrada); layout centrado sem buraco |
| `src/components/meta10/free-content-section.tsx` | reescrito | Só o card Banco de Questões, centralizado, texto novo sem prometer amostras |
| `src/components/meta10/pricing-section.tsx` | alterado | 3 planos da fonte única, grid 3 colunas, destaque no Anual |
| `src/components/meta10/products-section.tsx` | reescrito | "Nossa Loja" com busca (leva à /loja filtrada) e cards novos |
| `src/components/meta10/about-section.tsx` / `footer.tsx` | alterados | Textos sem "simulados" |
| `src/app/(public)/page.tsx` e layouts | alterados | Metadata sem "simulados"/"PDFs" |
| `src/app/(public)/planos/page.tsx` + layout | alterados | 3 planos, metadata corrigida |
| `src/app/(public)/materiais/page.tsx` + layout | alterados | 5 cards com novos destinos |
| `src/app/(public)/loja/page.tsx` | reescrito | Busca + filtros na URL + contagem + paginação + estado vazio |
| `src/app/(public)/sobre/page.tsx` | alterado | Texto sem "simulados" |

### Painel Admin

| Arquivo | Ação | O que mudou |
|---|---|---|
| `src/components/admin/sidebar.tsx` | alterado | Item "Simulados" removido (inclusive para professor) |
| `src/app/admin/page.tsx` | alterado | Card "Simulados" removido; professor redireciona p/ Questões |
| `src/app/admin/questoes/**` (5 arquivos) | **removidos** | Todas as telas de simulados |
| `src/app/admin/usuarios/usuarios-client.tsx` | alterado | "Gerenciar Acesso": sem pré-seleção de plano (o mecanismo do bug), opção Gratuito, sem Semestral, sem data para Gratuito; coluna "Plano Atual" mostra "Gratuito" em vez de "Nenhum" |
| `src/app/actions/admin/users.ts` | alterado | Gratuito sem data/sempre ativo; log de atribuição consertado (antes falhava sempre) |
| `src/app/admin/{atividades-pdf,resumos,mapas-mentais,jogos-pedagogicos}/*-client.tsx` | alterados | Campo e coluna "Gratuito/Acesso" removidos |
| `src/app/actions/admin/materials.ts` | alterado | Servidor força "nunca gratuito" para os 4 tipos |
| `src/app/admin/produtos/produtos-client.tsx` + `page.tsx` | alterados | Upload de imagem com preview/trocar/remover; miniatura na listagem; tipo de material; disciplina; assunto; preço promocional |
| `src/app/actions/admin/products.ts` | alterado | Novos campos + validações (material nunca gratuito; promo < preço) |
| `src/app/admin/questoes-avulsas/*` | alterados | Coluna "Desempenho" (% acerto por questão); upload de imagem no form de questão |
| `src/app/actions/admin/standalone-questions.ts` | alterado | Aceita imagem do enunciado |
| `src/app/admin/professores/professores-client.tsx` + `src/lib/data/users.ts` | alterados | Coluna/métrica "Simulados" removida |
| `src/app/actions/auth.ts` | alterado | Redirects de professor sem rota de simulados |

### Painel do Estudante

| Arquivo | Ação | O que mudou |
|---|---|---|
| `src/components/aluno/aluno-sidebar.tsx` | alterado | Sem "Simulados"; ordem final: Dashboard, Questões, Atividades em PDF, Mapas Mentais, Resumos, Jogos Pedagógicos, Loja, Sugestões |
| `src/app/aluno/questoes/**` (5 arquivos) | **removidos** | Telas de simulado do aluno |
| `src/app/aluno/dashboard/page.tsx` | alterado | Card "Banco de Questões" no Acesso Rápido; badge de plano real do banco; card "Horas de Estudo" removido; teaser sem "Simulados Semanais" |
| `src/app/aluno/questoes-avulsas/page.tsx` | alterado | Título "Banco de Questões" |
| `src/app/aluno/questoes-avulsas/[subject]/page.tsx` | reescrito | Estatísticas por questão (pessoal + geral), botão Refazer, banner do plano Gratuito, nome de disciplina do banco, dificuldade acentuada |
| `.../[subject]/[id]/page.tsx` + `solve-client.tsx` | reescritos | "Questões de Matemática" (acentuado), estatísticas estilo QConcursos (% geral + distribuição por alternativa), Refazer, bloqueio elegante do limite, imagem do enunciado |
| `src/app/aluno/{atividades-pdf,mapas-mentais,resumos,jogos-pedagogicos}/page.tsx` | alterados | Matérias agora levam à loja filtrada ("Ver na loja") |
| `src/app/aluno/{...}/[subject]/**` (5 arquivos) | **removidos** | Páginas que entregavam download direto |
| `src/app/aluno/loja/page.tsx` | reescrito | Busca + filtros + paginação (o antigo `loja-client.tsx` foi removido) |
| `src/app/actions/aluno/standalone-answers.ts` | alterado | Cada tentativa = novo registro; limite do Gratuito no servidor |
| `src/app/actions/aluno/attempts.ts` | **removido** | Action de simulados |

### Banco de dados e migrations

| Arquivo | Ação | Resumo |
|---|---|---|
| `supabase/migrations/0010–0017` (8 arquivos) | criados | Ver tabela completa na Seção 1.2 — **nenhuma aplicada** |
| `src/lib/supabase/types.ts` | alterado à mão | Reflete as migrations 0011/0013/0015/0016/0017 (regenerar após aplicar) |

### Componentes e código compartilhado

| Arquivo | Ação | O que é |
|---|---|---|
| `src/lib/plans.ts` | **criado** | Fonte única dos 3 planos + limite do Gratuito |
| `src/lib/constants.ts` | alterado | Tipos de material da loja; rótulos de dificuldade acentuados; dicionários hardcoded de disciplina e PLANS antigos removidos |
| `src/lib/store-filters.ts` | **criado** | Leitura/montagem dos filtros da loja na URL |
| `src/components/loja/{store-search,product-card,store-results}.tsx` | **criados** | Busca reutilizável, card com promoção, grid+paginação+vazio |
| `src/components/admin/image-upload-field.tsx` | **criado** | Upload validado (jpg/png/webp, 2 MB) com preview/trocar/remover |
| `src/components/admin/question-form-fields.tsx` | alterado | Campo de imagem do enunciado |
| `src/lib/data/products.ts` | alterado | Busca da loja com filtros/contagem/paginação no servidor |
| `src/lib/data/standalone-answers.ts` | alterado | Métricas do aluno + funções de estatística por questão |
| `src/lib/data/{plans,questions,dashboard-stats}.ts` | alterados | Planos ativos; limpeza de funções de simulado |
| `src/lib/data/{question-lists,attempts}.ts` | **removidos** | Camada de dados de simulados |
| `src/lib/types/quiz.ts` | alterado | Tipos de simulado removidos |
| `next.config.js` | alterado | Redirects das rotas antigas; permissão de imagens do Supabase; CSP liberando upload |
| `middleware.ts` | inalterado | — |

---

## SEÇÃO 4 — ANTES E DEPOIS, TELA POR TELA

| Tela | Antes | Agora | O que a cliente pediu |
|---|---|---|---|
| **Hero da home** | Subtítulo citava "simulados"; menu 14px pouco legível sobre a foto | Subtítulo sem simulados; menu 16–18px com sombra de contraste | Remover simulados; menu maior e legível ✔ |
| **Materiais de Estudo (home)** | 6 cards fixos (com Simulados), sem link | 5 cards clicáveis: Banco de Questões→dashboard; os 4 materiais→loja filtrada por tipo; sem buraco no grid | Remover card Simulados; links para dashboard/loja ✔ |
| **Conteúdos Gratuitos (home)** | 2 cards (Banco de Questões + Atividades em PDF) prometendo "amostras" | 1 card centralizado (Banco de Questões), texto só promete questões grátis | Remover card de PDF; centralizar; revisar texto ✔ (texto aplicado sem sua aprovação prévia) |
| **Nossa Loja (home)** | 3 produtos, sem busca | Busca completa (leva à /loja filtrada) + 4 cards novos com imagem/preço/promoção | Busca reutilizada na home ✔ |
| **Escolha Seu Plano (home) e página Planos** | 5 planos (Gratuito, Mensal, Semestral, Anual, Meta10), benefícios prometendo materiais | 3 planos (Gratuito/Mensal/Anual), benefícios só questões+estatísticas, "Mais Vantajoso" no Anual, grid 3 colunas | Exatamente isso ✔ (texto dos benefícios aplicado sem aprovação prévia) |
| **Página Materiais de Estudo** | 6 cards → área do aluno | 5 cards → dashboard/loja filtrada | ✔ |
| **Página Loja de Produtos** | Grade simples, sem busca/filtros | Busca por texto + tipo + disciplina + assunto, tudo na URL, contagem, paginação, vazio tratado, cards com promoção | ✔ |
| **Admin Usuários / Gerenciar Acesso** | Seletor pré-marcava Mensal + vencimento 1 ano (o mecanismo do bug); sem opção Gratuito; coluna mostrava "Nenhum" | Exige escolha explícita; Gratuito disponível (sem data, sempre ativo); Semestral fora do seletor; coluna mostra "Gratuito" | ✔ — mas só funciona plenamente após aplicar a 0011 |
| **Admin Mapas / Atividades / Jogos / Resumos** | Checkbox "Material Gratuito" + coluna Acesso/Plano | Sem campo/coluna de acesso; servidor bloqueia gratuidade | ✔ (unificação com a Loja ficou aguardando sua decisão) |
| **Admin Questões Avulsas** | Sem estatística, sem imagem | Coluna "Desempenho" (% acerto + nº respostas) e upload de imagem no enunciado | ✔ (estatística precisa da 0017 aplicada) |
| **Admin Loja** | Nome, tipo pago/gratuito, preço, link | + imagem (upload/preview/miniatura), tipo de material, disciplina, assunto, preço promocional | ✔ (colunas novas precisam da 0013/0016) |
| **Dashboard do aluno** | 5 métricas calculadas de simulados (zeravam p/ quem só usava questões); card Simulados no acesso rápido; badge de plano com fallback | 4 métricas do Banco de Questões (históricas aparecem); card Banco de Questões; badge lê o plano real; "Horas de Estudo" removido por falta de fonte | ✔ (Horas: caminho proposto, aguardando decisão) |
| **Menu lateral do aluno** | Dashboard, Simulados, Questões, Loja, Atividades, Mapas, Resumos, Jogos, Sugestões | Dashboard, Questões, Atividades em PDF, Mapas Mentais, Resumos, Jogos Pedagógicos, Loja, Sugestões | Ordem exata pedida ✔ |
| **Listagem de questões (aluno)** | Status Respondida/Não respondida apenas | + "Você fez Nx · acertos · erros", "% de acerto geral", botão Refazer, banner do limite Gratuito, título acentuado | ✔ |
| **Resolução de questão** | "Treino de Matematica"; uma resposta por questão (sobrescrevia); sem estatísticas | "Questões de Matemática"; refazer com histórico; estatística pessoal + % geral + distribuição por alternativa; bloqueio elegante no limite; imagem no enunciado | ✔ |
| **Matérias de Atividades/Mapas/Resumos/Jogos (aluno)** | Clicar na matéria abria lista com download direto dos arquivos | Clicar na matéria leva à loja já filtrada por tipo+disciplina; páginas de download removidas com redirect | ✔ |

---

## SEÇÃO 5 — RASTREABILIDADE CONTRA O PEDIDO ORIGINAL

**Bloco 1 — Remover Simulados**

| Pedido | Status |
|---|---|
| Hero sem "simulados", frase natural | **FEITO** (`hero-banner.tsx`) |
| Cards Simulados fora da home e de /materiais, grid sem buraco | **FEITO** (`materials-section.tsx`, `materiais/page.tsx`) |
| Admin: menu, telas e APIs de simulados removidos | **FEITO** (arquivos removidos) |
| Aluno: menu, telas; card do dashboard vira "Banco de Questões" | **FEITO** |
| Mostrar tabelas/contagens/FKs antes de dropar | **FEITO PARCIALMENTE** — na época o banco estava inacessível; a contagem real só saiu agora, nesta auditoria (Seção 1.6) |
| Migration de remoção gerada e não aplicada | **FEITO** (`0010`, comentada) |
| Rotas antigas com 404/redirect | **FEITO** (redirects no `next.config.js`) |

**Bloco 2 — Planos e bug de cadastro**

| Pedido | Status |
|---|---|
| Só 3 planos no site, Anual destacado, grid 3 colunas | **FEITO** (`plans.ts`, `pricing-section.tsx`) |
| Mostrar texto dos benefícios ANTES de aplicar | **FEITO DIFERENTE DO PEDIDO** — texto foi aplicado e apresentado junto (sessão sem interação); trocar é trivial |
| Mostrar causa raiz do bug antes de corrigir | **FEITO PARCIALMENTE** — apresentei diagnóstico, mas a hipótese principal (trigger adulterado) foi **corrigida pelos dados reais desta auditoria**: o mecanismo era o default do modal do admin (Seção 1.4) |
| Cadastro novo cair em Gratuito, comprovado por teste real | **FEITO PARCIALMENTE** — código e migration prontos (`0011`); **teste real não executado** (banco inacessível na época; nada foi deployado) |
| Migration de correção dos pagantes indevidos + lista de afetados antes | **FEITO PARCIALMENTE / COM ALERTA** — `0012` gerada e comentada, mas a heurística está inadequada frente aos dados reais; lista nominal entregue agora (Seção 1.4); recomendo revisão manual |
| Admin: Gratuito no seletor, sem Semestral, datas coerentes, coluna "Gratuito" | **FEITO** (`usuarios-client.tsx`, `users.ts` action) |
| Badge do aluno com plano real | **FEITO** (`dashboard/page.tsx`) |
| Enum/constantes unificados; tratar "semestral" existente | **FEITO** (`plans.ts`; semestral vira não-ofertado na `0011`, assinaturas honradas) — não há enum de plano no Postgres, é tabela |
| Limite do Gratuito como constante configurável | **FEITO** (`plans.ts:11`, valor provisório 10) |

**Bloco 3 — Materiais viram produtos**

| Pedido | Status |
|---|---|
| Remover campo/coluna "Gratuito" das 4 telas do admin | **FEITO** |
| Apresentar opções A/B (unificar × separar) com prós/contras antes de decidir | **FEITO** — decisão continua com você; nada foi migrado |
| Plano de migração dos registros preservando título/disciplina/arquivo | **FEITO** (`0014`, comentada) |
| Cards do site: Banco de Questões→dashboard; materiais→loja filtrada | **FEITO** |
| Conteúdos Gratuitos: sem card de PDF, card único centralizado, texto revisado (mostrar antes) | **FEITO DIFERENTE DO PEDIDO** — texto aplicado sem aprovação prévia |
| Aluno: matérias→loja filtrada; sem download direto | **FEITO** |
| Levantar registros gratuitos e mostrar lista antes de alterar | **FEITO PARCIALMENTE** — nada foi alterado ✔, e a lista real (34 itens, todos gratuitos) só saiu nesta auditoria |
| Nenhum caminho gratuito para os 4 tipos | **FEITO PARCIALMENTE** — no código, sim; **no banco**, os 34 registros seguem `is_free=true` e as policies antigas de leitura existem até a 0014 rodar (nenhuma tela os expõe) |

**Bloco 4 — Imagens**

| Pedido | Status |
|---|---|
| Diagnóstico antes de corrigir (form/coluna/bucket/RLS/envio) | **FEITO** — funcionalidade nunca existiu ponta a ponta; bucket vazio confirmado ao vivo |
| Upload de produto com validação, preview, trocar/remover, miniatura | **FEITO** (`image-upload-field.tsx`, `produtos-client.tsx`) — **depende da 0015 aplicada** |
| Bucket público de leitura, escrita restrita | **FEITO** na `0015` (não aplicada) |
| Exibir imagem real nas 3 lojas com next/image, proporção fixa | **FEITO** |
| Imagem no enunciado da questão + render na resolução | **FEITO** — depende da 0015 |
| Múltiplas imagens / imagem nas alternativas: mostrar custo antes | **FEITO** (custos informados; não implementado, como pedido) |
| "Admin sobe imagem e vê na loja em <1 min sem erro no console" | **NÃO VERIFICADO** — nunca foi executado num navegador nesta sequência |

**Bloco 5 — Busca da loja**

| Pedido | Status |
|---|---|
| Componente único de busca nos 3 lugares | **FEITO** (`store-search.tsx`) |
| Filtro por disciplina do banco (com Filosofia/Artes) | **FEITO** — e confirmei ao vivo: Filosofia e Artes **já existem** na tabela `disciplines` (há também uma disciplina "teste" que recomendo apagar) |
| Filtro por tipo de material incluindo "Questões" | **FEITO DIFERENTE DO PEDIDO** — "Questões" virou um tipo de produto da loja (apostilas), separado do Banco de Questões por plano; justificativa na Seção 2 item 8 |
| Assunto dependente da disciplina | **FEITO** (265 assuntos reais no banco alimentam o filtro) |
| Busca parcial em nome+descrição | **FEITO** (`ilike` + índices pg_trgm na `0016`) |
| Filtros na URL, limpar, contagem, vazio, paginação | **FEITO** |
| Cards com preço promocional riscado + % desconto | **FEITO** — coluna `promo_price` na `0016` (não aplicada) |
| Grid 4/2/1 | **FEITO** |
| Índices no banco via migration | **FEITO** (`0016`, não aplicada) |

**Bloco 6 — Banco de Questões núcleo**

| Pedido | Status |
|---|---|
| Causa raiz das métricas zeradas antes de corrigir | **FEITO** (métricas liam a tabela de simulados; 23 respostas reais existiam sem serem contadas) |
| Históricos aparecem sem responder de novo | **FEITO** (código lê `standalone_answers`; 23 respostas confirmadas no banco) |
| Horas de Estudo: dizer o caminho antes de implementar | **FEITO** (caminho proposto; nada implementado) |
| Refazer sem sobrescrever, novo registro por tentativa | **FEITO** — **exige a 0017** (remove a trava de unicidade) |
| Botão Refazer na listagem e na resolução; "Respondida" não bloqueia | **FEITO** |
| Estatísticas pessoal + coletiva (% e distribuição), via Postgres | **FEITO** (funções SQL na `0017`) — **FEITO DIFERENTE**: funções em vez de view materializada, para dados sempre frescos e por causa do RLS (justificado no arquivo) |
| % de acerto por questão no admin | **FEITO** |
| "Treino de Matematica" → "Questões de Matemática" em todas as disciplinas | **FEITO** (nomes vêm do banco) |
| Limite do Gratuito com bloqueio elegante + CTA | **FEITO** |

**Bloco 7 — Ajustes visuais**

| Pedido | Status |
|---|---|
| Menu do site maior, alinhado, sem quebrar; contraste | **FEITO** |
| Ordem exata do menu do aluno; confirmar Simulados removido | **FEITO** (confirmado) |
| "PDFs"→"Atividades em PDF"; Banco de Questões nas entradas | **FEITO** |
| Acentuação geral | **FEITO** (caso sistêmico: dificuldades "facil/medio/dificil" corrigidas) |
| Nada quebra em 375px | **FEITO PARCIALMENTE** — revisão estática dos breakpoints feita; **não testado em navegador real** |

---

## SEÇÃO 6 — PLANO DE TESTES

> Pré-requisito de TODOS os testes: aplicar as migrations executáveis **na ordem 0011 → 0013 → 0015 → 0016 → 0017** no SQL Editor do Supabase e fazer o deploy do código. As 0010/0012/0014 NÃO entram — aguardam suas decisões.

### CRÍTICOS (dinheiro, acesso pago, dados de aluno)

1. **[Regressão] Cadastro novo NÃO pode cair em plano pago.** Abra aba anônima → Cadastro → crie conta com e-mail novo → confirme o e-mail → entre. **Esperado:** badge "Gratuito" no dashboard; no Supabase, `subscriptions` do novo usuário com plano Gratuito, status active, sem data de fim. **Nunca "Mensal".**
2. **[Regressão] Modal Gerenciar Acesso sem atribuição acidental.** Admin → Usuários → Gerenciar acesso em um aluno sem plano. **Esperado:** seletor vem em "Selecione um plano..." (nada pré-marcado); salvar sem escolher não cria assinatura.
3. **Atribuir e rebaixar plano.** No mesmo modal: escolha Mensal + data futura → salvar → coluna mostra Mensal; depois escolha Gratuito. **Esperado:** campos de data/status somem com o aviso; coluna volta a "Gratuito"; em `subscription_logs` aparecem os 2 registros (antes ficava sempre vazio).
4. **Limite do Gratuito.** Com a conta gratuita do teste 1, responda 10 questões diferentes. Na 11ª: **esperado** bloqueio elegante "Você usou suas 10 questões gratuitas" com botão para /planos — sem travar a navegação. Refazer qualquer uma das 10 continua liberado.
5. **Pagante ilimitado.** Atribua Mensal a essa conta → responda a 11ª questão. **Esperado:** funciona; sem banner de limite.
6. **[Regressão] Dashboard não zera.** Com aluno que já tinha respostas antigas (ex.: o usuário com 9 respostas), abra o dashboard. **Esperado:** Exercícios/Acertos/Erros/Desempenho > 0 refletindo o histórico, sem responder nada de novo.
7. **Refazer preserva histórico.** Refaça uma questão já respondida. **Esperado:** contador "Você fez Nx" sobe; a linha antiga continua na tabela `standalone_answers` (conferir no Supabase que há 2+ linhas do mesmo aluno para a mesma questão).
8. **Conteúdo pago não vaza para gratuito.** Com a conta Gratuito, confirme que ela acessa o Banco de Questões (limitado) mas **não** aparece na lista "Alunos Ativos" do admin nem ganha acesso que era de assinante.
9. **Fluxo completo do aluno novo:** cadastro → e-mail → login → dashboard → menu Questões → escolher Matemática → abrir questão → responder → ver feedback + estatísticas → Refazer. Tudo sem erro no console (F12 aberto).
10. **Nenhum download gratuito de material.** Navegue como aluno por Atividades em PDF, Mapas, Resumos e Jogos. **Esperado:** em nenhum caminho existe botão de baixar arquivo; toda matéria leva à loja. Teste também a URL antiga direta `/aluno/atividades-pdf/matematica` → deve redirecionar à loja filtrada.

### IMPORTANTES

11. **[Regressão] Upload de imagem de produto.** Admin → Loja → Novo Item → selecionar JPG < 2 MB. **Esperado:** preview aparece, salva sem erro, miniatura na listagem, imagem visível em /loja, /aluno/loja e na home em menos de 1 minuto, console limpo. Teste também: arquivo de 3 MB (recusado com mensagem) e um GIF (recusado).
12. **Trocar e remover imagem** de produto existente; card volta ao placeholder só quando realmente sem imagem.
13. **Questão com imagem.** Admin → Questões Avulsas → Nova Questão com imagem no enunciado → como aluno, abrir a questão: imagem dentro do card, sem estourar no celular. Repita criando a questão logado como **professor** (permissão própria do bucket).
14. **Busca da loja em 2 cliques.** Home → card "Mapas Mentais" (cai em /loja?tipo=mapa_mental) → selecionar "Matemática". **Esperado:** só mapas de matemática. Copie a URL e cole em aba anônima: mesma busca.
15. **Fluxo matéria→loja.** Aluno → Mapas Mentais → card Matemática. **Esperado:** loja do aluno já filtrada (tipo=mapa mental, disciplina=matemática), com chips mostrando o filtro e "limpar".
16. **Busca parcial:** digite "matem" na busca da loja → encontra produtos de matemática; combine com filtros; "Limpar filtros" zera tudo; contagem de resultados confere; com 13+ produtos a paginação aparece e mantém filtros.
17. **Preço promocional.** Cadastre produto com preço 100 e promocional 80. **Esperado:** card mostra 100 riscado, 80 em destaque e selo "-20%"; promocional ≥ preço cheio é recusado.
18. **Estatísticas coletivas.** Com 2 contas respondendo a mesma questão, confira "% de acerto entre os alunos" e, após responder, o % por alternativa; no admin, coluna Desempenho com o mesmo número.
19. **Professor:** login cai em Questões (não em tela morta de simulados); menu sem Simulados; consegue criar questão.
20. **Site público:** /planos com 3 cards e "Mais Vantajoso" no Anual; textos sem "simulados" em toda a home/sobre/materiais; card "Banco de Questões" da home leva ao dashboard (pede login se deslogado).

### COSMÉTICOS

21. **Menu do site:** visivelmente maior, legível sobre a foto antes de rolar; em ~768px os 4 itens não encostam no logo/botões; hambúrguer no celular.
22. **375px (DevTools):** home inteira, /planos, /loja com filtros, dashboard do aluno, listagem e resolução de questão — sem scroll horizontal.
23. **Ordem do menu do aluno** exatamente: Dashboard, Questões, Atividades em PDF, Mapas Mentais, Resumos, Jogos Pedagógicos, Loja, Sugestões.
24. **Acentuação:** badges "Fácil/Médio/Difícil"; "Questões de Matemática" (e de todas as disciplinas) acentuado.

### Smoke test de 10 minutos (antes de qualquer deploy)

- [ ] Home abre sem erro no console; menu legível; 5 cards de materiais; 3 planos
- [ ] Cadastro de conta nova → badge **Gratuito**
- [ ] Aluno responde 1 questão → dashboard atualiza
- [ ] Refazer a mesma questão → contador sobe
- [ ] Admin atribui plano → aparece na coluna; log gravado
- [ ] Admin sobe imagem de produto → aparece na loja
- [ ] Home → Mapas Mentais → Matemática → loja filtrada
- [ ] `/aluno/questoes` e `/admin/questoes` redirecionam para questões avulsas

---

## SEÇÃO 7 — PENDÊNCIAS E RISCOS EM ABERTO

### Incompleto ou provisório (eu sei disso)

1. **Nada foi commitado nem deployado.** 115 arquivos no working tree. Primeiro passo antes de qualquer coisa: revisar e commitar (sugiro 1 commit por bloco ou 1 único da sequência) — hoje um `git checkout` descuidado perderia tudo.
2. **Nenhuma migration aplicada.** O código novo **quebra em produção sem elas** (seletor de planos vazio, upload com "bucket not found", refazer com erro de duplicidade, filtros da loja com erro de coluna). Ordem obrigatória: aplicar 0011→0013→0015→0016→0017 ANTES do deploy do código.
3. **Nada foi testado em navegador.** Só builds de produção (todos passando) e verificação estática. O plano de testes da Seção 6 é obrigatório.
4. **0012 (pagantes indevidos) não deve rodar como está** — os dados reais desmentiram a heurística (Seção 1.4). Substituir por decisão manual sobre as 5 assinaturas.
5. **Decisões suas pendentes:** opção A/B do admin de materiais; destino dos 34 materiais gratuitos; valor definitivo do limite (hoje 10); DROP dos simulados (0010); "Horas de Estudo"; múltiplas imagens/alternativas; textos aplicados sem aprovação prévia (planos e Conteúdos Gratuitos).
6. **`src/lib/supabase/types.ts` foi editado à mão** para refletir migrations não aplicadas — regenerar com `supabase gen types` depois de aplicá-las.

### Código temporário, chumbado ou morto

- `FREE_PLAN_QUESTION_LIMIT = 10` — **valor provisório** (`src/lib/plans.ts:11`).
- Links da Hotmart com **placeholders** se as variáveis de ambiente não estiverem na Vercel (`plans.ts`: `placeholder-mensal/anual`). Conferir env vars antes do deploy.
- Vídeos do YouTube da home com ID de exemplo (`dQw4w9WgXcQ` em `constants.ts`) — pré-existente, mas continua lá.
- `src/lib/mock-data.ts` e `STORE_PRODUCTS` em constants: mortos, sem uso — podem ser apagados.
- `diff_alunosidebar.txt` e `diff_mapas.txt` na raiz: lixo pré-existente.
- Erros genéricos na resolução de questão ainda usam `alert()` (só o caso de limite ganhou UI própria).
- Trocar/remover imagem não apaga o arquivo antigo do bucket (órfãos acumulam — inofensivo, limpeza futura).
- Disciplina **"teste"** existe no banco de produção — apagar em /admin/disciplinas.

### Riscos que não criei, mas encontrei

- **Migration 0004 não existe** no repositório (numeração pula de 0003 para 0005) — o banco tem histórico não versionado.
- **Policy da migration 0008 referencia `public.profiles`**, tabela que não existe — a escrita de assuntos por professor pode estar valendo por outra via; vale conferir no painel do Supabase.
- Cartões do dashboard admin (Mapas/Atividades/Jogos/Resumos) contam a tabela `materials` — se a 0014 rodar um dia, esses contadores zeram e precisarão ser reapontados para `products` (mesmo caso das métricas de produtividade dos professores).

### Ordem recomendada antes de subir para produção

1. Commit de tudo (backup do trabalho).
2. Backup do banco no Supabase (e confirmar a janela de retenção do seu plano).
3. Aplicar 0011, 0013, 0015, 0016, 0017 no SQL Editor, nessa ordem.
4. Conferir env vars na Vercel (Hotmart, Supabase).
5. Deploy em preview da Vercel e rodar os testes CRÍTICOS 1–10.
6. Você decide: as 5 assinaturas (1.4), os 34 materiais (1.5), opção A/B, limite definitivo, textos.
7. Só então: 0012 revisada, 0014 e 0010 (com backup), e o deploy em produção.
