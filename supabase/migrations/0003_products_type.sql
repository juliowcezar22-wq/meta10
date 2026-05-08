-- Adicionar tipo de produto (gratuito ou pago) e arquivo_url para gratuitos
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS tipo text NOT NULL DEFAULT 'pago' 
    CHECK (tipo IN ('gratuito', 'pago')),
  ADD COLUMN IF NOT EXISTS arquivo_url text;

-- hotmart_link pode ser nullable agora (já existia, manter)
ALTER TABLE public.products
  ALTER COLUMN hotmart_link DROP NOT NULL;
