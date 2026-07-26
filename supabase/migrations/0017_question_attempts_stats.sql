-- ============================================================
-- Migration 0017: Banco de Questões como núcleo
--   - múltiplas tentativas por questão (refazer preserva histórico)
--   - estatísticas por questão calculadas no Postgres
-- ============================================================
-- Aplicar ANTES do deploy desta entrega.
--
-- Contexto (Parte A do bloco): as métricas do dashboard zeravam porque
-- eram calculadas sobre a tabela `attempts` (tentativas de SIMULADO,
-- módulo extinto no bloco 1) — as respostas do Banco de Questões sempre
-- foram gravadas em `standalone_answers`, que nunca era lida. O código
-- já lê standalone_answers; esta migration habilita o refazer e move a
-- agregação de estatísticas para o banco.
--
-- Escolha técnica: funções SQL (STABLE) em vez de view materializada —
-- estatísticas ficam sempre frescas sem job de refresh, e SECURITY
-- DEFINER permite agregar respostas de todos os alunos sem expor
-- linhas individuais (o RLS de standalone_answers restringe SELECT às
-- próprias respostas).
-- ============================================================

-- 1. Refazer: uma linha POR TENTATIVA (histórico preservado)
ALTER TABLE public.standalone_answers
  DROP CONSTRAINT IF EXISTS standalone_answers_user_id_question_id_key;

CREATE INDEX IF NOT EXISTS idx_standalone_user_question
  ON public.standalone_answers(user_id, question_id, answered_at DESC);

-- 2. Estatística coletiva por questão (modelo QConcursos):
--    % de acerto geral + distribuição de escolhas por alternativa
CREATE OR REPLACE FUNCTION public.get_question_stats(p_question_ids uuid[] DEFAULT NULL)
RETURNS TABLE (
  question_id uuid,
  total_attempts bigint,
  total_users bigint,
  correct_attempts bigint,
  correct_pct numeric,
  answer_distribution jsonb
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT
    sa.question_id,
    count(*) AS total_attempts,
    count(DISTINCT sa.user_id) AS total_users,
    count(*) FILTER (WHERE sa.is_correct) AS correct_attempts,
    round(100.0 * count(*) FILTER (WHERE sa.is_correct) / count(*), 1) AS correct_pct,
    (
      SELECT jsonb_object_agg(d.answer, d.cnt)
      FROM (
        SELECT sa2.answer, count(*) AS cnt
        FROM public.standalone_answers sa2
        WHERE sa2.question_id = sa.question_id
        GROUP BY sa2.answer
      ) d
    ) AS answer_distribution
  FROM public.standalone_answers sa
  WHERE p_question_ids IS NULL OR sa.question_id = ANY(p_question_ids)
  GROUP BY sa.question_id;
$$;

-- 3. Minhas estatísticas por questão (apenas do usuário logado)
CREATE OR REPLACE FUNCTION public.get_my_question_stats(p_question_ids uuid[] DEFAULT NULL)
RETURNS TABLE (
  question_id uuid,
  attempts bigint,
  correct bigint,
  wrong bigint,
  last_answer text,
  last_is_correct boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT
    sa.question_id,
    count(*) AS attempts,
    count(*) FILTER (WHERE sa.is_correct) AS correct,
    count(*) FILTER (WHERE NOT sa.is_correct) AS wrong,
    (array_agg(sa.answer ORDER BY sa.answered_at DESC))[1] AS last_answer,
    (array_agg(sa.is_correct ORDER BY sa.answered_at DESC))[1] AS last_is_correct
  FROM public.standalone_answers sa
  WHERE sa.user_id = auth.uid()
    AND (p_question_ids IS NULL OR sa.question_id = ANY(p_question_ids))
  GROUP BY sa.question_id;
$$;

-- 4. Questões distintas já respondidas pelo usuário
--    (base do limite do plano Gratuito: refazer não consome o limite)
CREATE OR REPLACE FUNCTION public.count_my_answered_questions()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT count(DISTINCT question_id)::int
  FROM public.standalone_answers
  WHERE user_id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.get_question_stats(uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_question_stats(uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.count_my_answered_questions() TO authenticated;
