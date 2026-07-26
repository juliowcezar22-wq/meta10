-- ============================================================
-- Migration 0016: Busca e navegação da loja
-- ============================================================
-- Aplicar ANTES do deploy desta entrega.
--
-- O que faz:
--   1. products.subject_id -> assunto (tabela subjects), para o filtro
--      "Assunto" dependente da disciplina
--   2. products.promo_price -> preço promocional opcional (mostrado com
--      preço cheio riscado + % de desconto nos cards)
--   3. Tipo de material 'questoes' passa a ser aceito em products
--      (apostilas/listas de questões vendidas avulsas; o Banco de
--      Questões por plano segue separado e intacto)
--   4. Índices para os filtros + pg_trgm para busca parcial por texto
--      em nome e descrição
-- ============================================================

-- 1. Assunto do produto
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS subject_id uuid REFERENCES public.subjects(id) ON DELETE SET NULL;

-- 2. Preço promocional (NULL = sem promoção; deve ser menor que o cheio)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS promo_price numeric(10,2);

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS chk_products_promo_price;
ALTER TABLE public.products
  ADD CONSTRAINT chk_products_promo_price
  CHECK (promo_price IS NULL OR (promo_price > 0 AND promo_price < price));

-- 3. Novo tipo de material aceito
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS chk_products_material_type;
ALTER TABLE public.products
  ADD CONSTRAINT chk_products_material_type
  CHECK (material_type IS NULL OR material_type IN ('questoes', 'atividade_pdf', 'resumo', 'mapa_mental', 'jogo'));

-- 4. Índices de filtro e busca
CREATE INDEX IF NOT EXISTS idx_products_subject_id ON public.products(subject_id);
CREATE INDEX IF NOT EXISTS idx_products_active_created ON public.products(is_active, created_at DESC);
-- (idx_products_material_subject já existe desde a 0013)

-- Busca parcial (ilike '%termo%') com trigram
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_products_name_trgm
  ON public.products USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_description_trgm
  ON public.products USING gin (description gin_trgm_ops);
