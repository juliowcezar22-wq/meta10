-- Migration 0009: Dynamic Disciplines

CREATE TABLE IF NOT EXISTS public.disciplines (
    slug text PRIMARY KEY,
    name text NOT NULL,
    icon text,
    color text,
    order_index int DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.disciplines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "disciplines_read_all" ON public.disciplines FOR SELECT USING (true);
CREATE POLICY "disciplines_admin_write" ON public.disciplines FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Seed initial 10 disciplines
INSERT INTO public.disciplines (slug, name, icon, color, order_index) VALUES
('matematica', 'Matemática', 'Calculator', 'bg-blue-500', 1),
('portugues', 'Português', 'BookOpen', 'bg-red-500', 2),
('historia', 'História', 'Library', 'bg-amber-600', 3),
('geografia', 'Geografia', 'Globe', 'bg-emerald-600', 4),
('ciencias', 'Ciências', 'Atom', 'bg-teal-500', 5),
('ingles', 'Inglês', 'Languages', 'bg-indigo-500', 6),
('fisica', 'Física', 'Milestone', 'bg-cyan-600', 7),
('quimica', 'Química', 'FlaskConical', 'bg-violet-500', 8),
('biologia', 'Biologia', 'Dna', 'bg-green-600', 9),
('outros', 'Outros', 'Binary', 'bg-slate-500', 10)
ON CONFLICT (slug) DO NOTHING;

-- Verification DO block as requested by the user
DO $$
DECLARE
  invalid_questions int;
  invalid_lists int;
  invalid_materials int;
  invalid_subjects int;
BEGIN
  SELECT COUNT(*) INTO invalid_questions FROM public.questions WHERE subject NOT IN (SELECT slug FROM public.disciplines);
  IF invalid_questions > 0 THEN RAISE EXCEPTION 'Existem % registros em questions com subject inválido', invalid_questions; END IF;

  SELECT COUNT(*) INTO invalid_lists FROM public.question_lists WHERE subject NOT IN (SELECT slug FROM public.disciplines);
  IF invalid_lists > 0 THEN RAISE EXCEPTION 'Existem % registros em question_lists com subject inválido', invalid_lists; END IF;

  SELECT COUNT(*) INTO invalid_materials FROM public.materials WHERE subject NOT IN (SELECT slug FROM public.disciplines);
  IF invalid_materials > 0 THEN RAISE EXCEPTION 'Existem % registros em materials com subject inválido', invalid_materials; END IF;

  SELECT COUNT(*) INTO invalid_subjects FROM public.subjects WHERE discipline NOT IN (SELECT slug FROM public.disciplines);
  IF invalid_subjects > 0 THEN RAISE EXCEPTION 'Existem % registros em subjects com discipline inválido', invalid_subjects; END IF;
END $$;

-- Drop constraints
ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS questions_subject_check;
ALTER TABLE public.question_lists DROP CONSTRAINT IF EXISTS question_lists_subject_check;
ALTER TABLE public.materials DROP CONSTRAINT IF EXISTS materials_subject_check;

-- Add Foreign Keys
ALTER TABLE public.questions 
  ADD CONSTRAINT questions_subject_fkey 
  FOREIGN KEY (subject) REFERENCES public.disciplines(slug) 
  ON DELETE RESTRICT;

ALTER TABLE public.question_lists 
  ADD CONSTRAINT question_lists_subject_fkey 
  FOREIGN KEY (subject) REFERENCES public.disciplines(slug) 
  ON DELETE RESTRICT;

ALTER TABLE public.materials 
  ADD CONSTRAINT materials_subject_fkey 
  FOREIGN KEY (subject) REFERENCES public.disciplines(slug) 
  ON DELETE RESTRICT;

ALTER TABLE public.subjects 
  ADD CONSTRAINT subjects_discipline_fkey 
  FOREIGN KEY (discipline) REFERENCES public.disciplines(slug) 
  ON DELETE RESTRICT;
