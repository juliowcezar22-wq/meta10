-- ============================================================
-- BLOCO 1: TIPOS E ENUMS
-- ============================================================
do $$ begin
    create type difficulty_level as enum ('facil', 'medio', 'dificil');
exception when duplicate_object then null; end $$;

-- ============================================================
-- BLOCO 2: questions
-- ============================================================
create table public.questions (
  id uuid default gen_random_uuid() primary key,
  enunciado text not null,
  alternativa_a text not null,
  alternativa_b text not null,
  alternativa_c text not null,
  alternativa_d text not null,
  alternativa_e text not null,
  gabarito text not null check (gabarito in ('a','b','c','d','e')),
  comentario text,
  subject text not null check (subject in ('matematica','portugues','historia','geografia','ciencias','ingles','fisica','quimica','biologia','outros')),
  difficulty difficulty_level default 'medio' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.questions enable row level security;
create trigger update_questions_modtime before update on public.questions for each row execute procedure update_updated_at_column();

create policy "Alunos com assinatura ativa veem questões" on public.questions for select using (
  exists (select 1 from public.subscriptions where user_id = auth.uid() and status = 'active' and expires_at > now())
  or public.is_admin()
);
create policy "Apenas admin gerencia questões" on public.questions for all using (public.is_admin());

-- ============================================================
-- BLOCO 3: simulados
-- ============================================================
create table public.simulados (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  subject text not null check (subject in ('matematica','portugues','historia','geografia','ciencias','ingles','fisica','quimica','biologia','outros')),
  duration_minutes int not null check (duration_minutes > 0),
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.simulados enable row level security;
create trigger update_simulados_modtime before update on public.simulados for each row execute procedure update_updated_at_column();

create policy "Alunos com assinatura veem simulados ativos" on public.simulados for select using (
  is_active = true and (
    exists (select 1 from public.subscriptions where user_id = auth.uid() and status = 'active' and expires_at > now())
    or public.is_admin()
  )
);
create policy "Apenas admin gerencia simulados" on public.simulados for all using (public.is_admin());

-- ============================================================
-- BLOCO 4: simulado_questions (relação)
-- ============================================================
create table public.simulado_questions (
  id uuid default gen_random_uuid() primary key,
  simulado_id uuid references public.simulados(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete restrict not null,
  ordem int not null,
  unique(simulado_id, question_id),
  unique(simulado_id, ordem)
);
alter table public.simulado_questions enable row level security;

create policy "Quem vê o simulado vê as relações" on public.simulado_questions for select using (
  exists (select 1 from public.simulados where id = simulado_id)
);
create policy "Apenas admin gerencia relações" on public.simulado_questions for all using (public.is_admin());

-- ============================================================
-- BLOCO 5: quiz_attempts
-- ============================================================
create table public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  simulado_id uuid references public.simulados(id) on delete cascade not null,
  started_at timestamptz default now() not null,
  finished_at timestamptz,
  answers jsonb not null default '{}'::jsonb,
  score int,
  total_questions int,
  created_at timestamptz default now() not null
);
alter table public.quiz_attempts enable row level security;
create index idx_quiz_attempts_user on public.quiz_attempts(user_id);
create index idx_quiz_attempts_simulado on public.quiz_attempts(simulado_id);

create policy "Aluno vê suas próprias tentativas" on public.quiz_attempts for select using (auth.uid() = user_id);
create policy "Aluno cria suas próprias tentativas" on public.quiz_attempts for insert with check (auth.uid() = user_id);
create policy "Aluno atualiza suas próprias tentativas" on public.quiz_attempts for update using (auth.uid() = user_id);
create policy "Admin vê todas as tentativas" on public.quiz_attempts for select using (public.is_admin());
