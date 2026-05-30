CREATE TABLE IF NOT EXISTS public.subjects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    discipline text NOT NULL,
    name text NOT NULL,
    created_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subjects_read_all" ON public.subjects FOR SELECT 
    TO authenticated USING (true);

CREATE POLICY "subjects_admin_write" ON public.subjects FOR ALL 
    TO authenticated 
    USING (
        EXISTS(SELECT 1 FROM public.profiles 
               WHERE id = auth.uid() 
               AND role IN ('admin', 'professor'))
    );

CREATE INDEX IF NOT EXISTS idx_subjects_discipline ON public.subjects(discipline);

ALTER TABLE public.questions 
    ADD COLUMN IF NOT EXISTS subject_id uuid REFERENCES public.subjects(id) ON DELETE SET NULL;

ALTER TABLE public.question_lists 
    ADD COLUMN IF NOT EXISTS subject_id uuid REFERENCES public.subjects(id) ON DELETE SET NULL;

ALTER TABLE public.questions 
    ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.question_lists 
    ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.materials 
    ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
