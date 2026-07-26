-- ============================================================
-- Migration 0015: Storage de imagens (produtos e questões)
-- ============================================================
-- Aplicar ANTES do deploy desta entrega.
--
-- Diagnóstico que motivou esta migration: a coluna products.image_url
-- existe desde a 0001, mas nunca houve bucket de Storage, policies de
-- upload nem campo de imagem no formulário do admin — o recurso nunca
-- existiu de ponta a ponta.
--
-- Cria:
--   1. Bucket 'product-images': leitura pública, escrita só admin
--   2. Bucket 'question-images': leitura pública, escrita admin/professor
--      (professores criam questões)
--   3. Limites nos buckets: 2 MB por arquivo; apenas jpg/png/webp
--   4. Coluna questions.image_url (imagem do enunciado)
-- ============================================================

-- 1/2. Buckets (públicos para leitura; escrita controlada por policy)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-images', 'product-images', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE
  SET public = true,
      file_size_limit = 2097152,
      allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('question-images', 'question-images', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE
  SET public = true,
      file_size_limit = 2097152,
      allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Helper: admin OU professor (autores de questões)
CREATE OR REPLACE FUNCTION public.is_admin_or_professor()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'professor')
  );
$$;

-- Policies de storage.objects
DROP POLICY IF EXISTS "product images leitura publica" ON storage.objects;
CREATE POLICY "product images leitura publica"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "product images upload admin" ON storage.objects;
CREATE POLICY "product images upload admin"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "product images update admin" ON storage.objects;
CREATE POLICY "product images update admin"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "product images delete admin" ON storage.objects;
CREATE POLICY "product images delete admin"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "question images leitura publica" ON storage.objects;
CREATE POLICY "question images leitura publica"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'question-images');

DROP POLICY IF EXISTS "question images upload autores" ON storage.objects;
CREATE POLICY "question images upload autores"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'question-images' AND public.is_admin_or_professor());

DROP POLICY IF EXISTS "question images update autores" ON storage.objects;
CREATE POLICY "question images update autores"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'question-images' AND public.is_admin_or_professor());

DROP POLICY IF EXISTS "question images delete autores" ON storage.objects;
CREATE POLICY "question images delete autores"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'question-images' AND public.is_admin_or_professor());

-- 4. Imagem no enunciado da questão
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS image_url text;
