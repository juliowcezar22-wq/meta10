-- ============================================================
-- FASE 3.1: Redesign do sistema de questões
-- ATENÇÃO: apaga questões, simulados e tentativas de teste
-- ============================================================

-- 1. LIMPEZA dos dados de teste (ordem respeitando FKs)
DELETE FROM public.attempts;
DELETE FROM public.questions;
DELETE FROM public.question_lists;

-- 2. NOVO: tipo de questão e contexto
-- question_type: multipla_escolha ou verdadeiro_falso
-- context: simulado (dentro de lista) ou avulsa (solta)

ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS question_type text NOT NULL DEFAULT 'multipla_escolha'
    CHECK (question_type IN ('multipla_escolha', 'verdadeiro_falso')),
  ADD COLUMN IF NOT EXISTS context text NOT NULL DEFAULT 'simulado'
    CHECK (context IN ('simulado', 'avulsa')),
  ADD COLUMN IF NOT EXISTS alternatives jsonb;

-- 3. list_id agora pode ser NULL (questões avulsas não têm lista)
ALTER TABLE public.questions
  ALTER COLUMN list_id DROP NOT NULL;

-- 4. Remover colunas antigas de alternativas fixas (a-e)
-- Agora as alternativas vivem no campo jsonb 'alternatives'
ALTER TABLE public.questions
  DROP COLUMN IF EXISTS alternativa_a,
  DROP COLUMN IF EXISTS alternativa_b,
  DROP COLUMN IF EXISTS alternativa_c,
  DROP COLUMN IF EXISTS alternativa_d,
  DROP COLUMN IF EXISTS alternativa_e;

-- gabarito (text, já existe) passa a aceitar:
--   - multipla_escolha: 'a','b','c','d','e'
--   - verdadeiro_falso: 'verdadeiro','falso'
-- Não precisa alterar a coluna, só a semântica.

-- 5. Constraint: questão avulsa não tem list_id; de simulado tem
ALTER TABLE public.questions
  ADD CONSTRAINT chk_context_list CHECK (
    (context = 'avulsa' AND list_id IS NULL) OR
    (context = 'simulado' AND list_id IS NOT NULL)
  );

-- 6. NOVA TABELA: respostas de questões avulsas
CREATE TABLE public.standalone_answers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  answer text NOT NULL,
  is_correct boolean NOT NULL,
  answered_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, question_id)
);

ALTER TABLE public.standalone_answers ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_standalone_user ON public.standalone_answers(user_id);
CREATE INDEX idx_standalone_question ON public.standalone_answers(question_id);

-- RLS standalone_answers
CREATE POLICY "Aluno vê suas respostas avulsas"
  ON public.standalone_answers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Aluno cria suas respostas avulsas"
  ON public.standalone_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Aluno atualiza suas respostas avulsas"
  ON public.standalone_answers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admin vê todas as respostas avulsas"
  ON public.standalone_answers FOR SELECT
  USING (public.is_admin());

-- 7. Index para filtrar questões por contexto e matéria
CREATE INDEX IF NOT EXISTS idx_questions_context_subject 
  ON public.questions(context, subject);
