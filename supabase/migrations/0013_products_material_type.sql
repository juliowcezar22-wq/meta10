-- ============================================================
-- Migration 0013: Categorização de produtos da loja
-- ============================================================
-- Aplicar ANTES do deploy desta entrega (a loja filtra por estas
-- colunas e o admin de produtos passa a preenchê-las).
--
-- Contexto do novo modelo de negócio:
--   Atividades em PDF, Resumos, Mapas Mentais e Jogos Pedagógicos
--   deixam de ser conteúdo liberado por plano/gratuito e passam a
--   ser produtos vendidos avulsos na loja. Estas colunas permitem
--   filtrar a loja por tipo de material e por disciplina, e o CHECK
--   garante no banco que nenhum material desses tipos seja gratuito.
--
-- Esta migration NÃO move dados de `materials` para `products`;
-- isso depende da decisão sobre unificar as telas do admin
-- (ver migration 0014, comentada).
-- ============================================================

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS material_type text,
  ADD COLUMN IF NOT EXISTS subject text;

-- Valores válidos do tipo de material (NULL = produto geral da loja)
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS chk_products_material_type;
ALTER TABLE public.products
  ADD CONSTRAINT chk_products_material_type
  CHECK (material_type IS NULL OR material_type IN ('atividade_pdf', 'resumo', 'mapa_mental', 'jogo'));

-- Disciplina referencia o catálogo dinâmico
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_subject_fkey;
ALTER TABLE public.products
  ADD CONSTRAINT products_subject_fkey
  FOREIGN KEY (subject) REFERENCES public.disciplines(slug) ON DELETE SET NULL;

-- Regra de negócio no banco: material desses 4 tipos nunca é gratuito
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS chk_products_material_paid;
ALTER TABLE public.products
  ADD CONSTRAINT chk_products_material_paid
  CHECK (material_type IS NULL OR tipo = 'pago');

CREATE INDEX IF NOT EXISTS idx_products_material_subject
  ON public.products(material_type, subject);
