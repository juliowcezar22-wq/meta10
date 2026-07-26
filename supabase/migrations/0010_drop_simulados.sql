-- ============================================================
-- Migration 0010: REMOÇÃO DO MÓDULO DE SIMULADOS
-- ============================================================
-- STATUS: *** NÃO APLICAR — AGUARDANDO APROVAÇÃO ***
-- Todo o SQL executável abaixo está comentado de propósito.
-- A aplicação já foi atualizada para não acessar mais estas
-- tabelas; elas permanecem intactas até esta migration ser
-- aprovada, descomentada e aplicada.
--
-- Tabelas envolvidas (schema real, migrations 0002/0006/0008):
--   - question_lists       (os "simulados")
--   - question_list_items  (FK -> question_lists, FK -> questions)
--   - attempts             (FK -> question_lists, FK -> users)
--   - questions            (parcial: apenas linhas com context = 'simulado';
--                           FK list_id -> question_lists)
--
-- FKs que apontam para as tabelas removidas:
--   question_list_items.list_id  -> question_lists(id) ON DELETE CASCADE
--   question_list_items.question_id -> questions(id)   ON DELETE RESTRICT
--   attempts.list_id             -> question_lists(id) ON DELETE CASCADE
--   questions.list_id            -> question_lists(id) (nullable)
--
-- O que NÃO é removido:
--   - questions com context = 'avulsa' (Banco de Questões)
--   - standalone_answers (respostas do Banco de Questões)
--   - a coluna questions.context (o código filtra por context = 'avulsa')
--
-- ANTES DE APLICAR, conferir volumes no SQL Editor:
--   SELECT 'question_lists' AS tabela, count(*) FROM public.question_lists
--   UNION ALL SELECT 'question_list_items', count(*) FROM public.question_list_items
--   UNION ALL SELECT 'attempts', count(*) FROM public.attempts
--   UNION ALL SELECT 'questions (simulado)', count(*) FROM public.questions WHERE context = 'simulado';
--
-- Recomendação: exportar backup (pg_dump ou CSV via dashboard) das
-- quatro consultas acima antes de executar.
-- ============================================================

-- 1. Tentativas de simulado (histórico dos alunos)
-- DROP TABLE IF EXISTS public.attempts;

-- 2. Relação lista <-> questão (FK ON DELETE RESTRICT em questions
--    exige remover esta tabela antes de deletar as questões de simulado)
-- DROP TABLE IF EXISTS public.question_list_items;

-- 3. Questões que pertenciam a simulados (o Banco de Questões,
--    context = 'avulsa', permanece intacto)
-- DELETE FROM public.questions WHERE context = 'simulado';

-- 4. Constraint e coluna que amarravam questions a simulados
-- ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS chk_context_list;
-- ALTER TABLE public.questions DROP COLUMN IF EXISTS list_id;

-- 5. As listas de simulado em si
-- DROP TABLE IF EXISTS public.question_lists;

-- 6. Garantir que novas questões nasçam como avulsas
-- ALTER TABLE public.questions ALTER COLUMN context SET DEFAULT 'avulsa';

-- Pós-aplicação: regenerar src/lib/supabase/types.ts
-- (supabase gen types typescript) para remover os tipos das tabelas dropadas.
