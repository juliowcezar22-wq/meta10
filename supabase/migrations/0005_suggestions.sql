-- Tabela de sugestões gerais da plataforma
-- Alunos enviam, admin visualiza

CREATE TABLE public.suggestions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 2000),
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_suggestions_user ON public.suggestions(user_id);
CREATE INDEX idx_suggestions_created ON public.suggestions(created_at DESC);

-- Policies RLS
-- Aluno: vê apenas as próprias sugestões
CREATE POLICY "Aluno vê suas próprias sugestões"
  ON public.suggestions FOR SELECT
  USING (auth.uid() = user_id);

-- Aluno: cria sugestões em nome próprio
CREATE POLICY "Aluno cria sugestões em nome próprio"
  ON public.suggestions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin: vê todas as sugestões
CREATE POLICY "Admin vê todas as sugestões"
  ON public.suggestions FOR SELECT
  USING (public.is_admin());

-- Admin: pode excluir sugestões (gestão de spam)
CREATE POLICY "Admin pode excluir sugestões"
  ON public.suggestions FOR DELETE
  USING (public.is_admin());
