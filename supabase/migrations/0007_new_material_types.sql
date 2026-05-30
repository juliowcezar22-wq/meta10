-- Migration para adicionar novos tipos de materiais na tabela materials
-- Tipos adicionados: 'atividade_pdf' e 'jogo'

-- Como a constraint de check padrão no Supabase se chama <tabela>_<coluna>_check (ou algo que foi gerado no create original), 
-- o ideal é dropar qualquer constraint atual de type e adicionar a nova.

DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Busca o nome da constraint de check da coluna 'type' da tabela 'materials'
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.materials'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%type%';

    -- Se encontrou a constraint, faz o drop
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.materials DROP CONSTRAINT ' || constraint_name;
    END IF;

    -- Cria a nova constraint com os valores antigos e os novos ('atividade_pdf', 'jogo')
    ALTER TABLE public.materials 
    ADD CONSTRAINT materials_type_check 
    CHECK (type IN ('video', 'pdf', 'audio', 'link', 'mapa_mental', 'resumo', 'atividade_pdf', 'jogo'));
END $$;
