-- ============================================================
-- BLOCO 1: TIPOS E ENUMS
-- ============================================================
do $$ begin
    create type difficulty_level as enum ('facil', 'medio', 'dificil');
exception when duplicate_object then null; end $$;

-- ============================================================
-- BLOCO 2: question_lists
-- ============================================================
create table public.question_lists (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  subject text not null check (subject in ('matematica','portugues','historia','geografia','ciencias','ingles','fisica','quimica','biologia','outros')),
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.question_lists enable row level security;
create trigger update_question_lists_modtime before update on public.question_lists for each row execute procedure update_updated_at_column();

create policy "Alunos com assinatura veem question_lists ativos" on public.question_lists for select using (
  is_active = true and (
    exists (select 1 from public.subscriptions where user_id = auth.uid() and status = 'active' and expires_at > now())
    or public.is_admin()
  )
);
create policy "Apenas admin gerencia question_lists" on public.question_lists for all using (public.is_admin());

-- ============================================================
-- BLOCO 3: questions
-- ============================================================
create table public.questions (
  id uuid default gen_random_uuid() primary key,
  list_id uuid references public.question_lists(id) on delete cascade not null,
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
-- BLOCO 4: question_list_items (relação)
-- ============================================================
create table public.question_list_items (
  id uuid default gen_random_uuid() primary key,
  list_id uuid references public.question_lists(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete restrict not null,
  ordem int not null,
  unique(list_id, question_id),
  unique(list_id, ordem)
);
alter table public.question_list_items enable row level security;

create policy "Quem vê a question list vê as relações" on public.question_list_items for select using (
  exists (select 1 from public.question_lists where id = list_id)
);
create policy "Apenas admin gerencia relações" on public.question_list_items for all using (public.is_admin());

-- ============================================================
-- BLOCO 5: attempts
-- ============================================================
create table public.attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  list_id uuid references public.question_lists(id) on delete cascade not null,
  started_at timestamptz default now() not null,
  finished_at timestamptz,
  answers jsonb not null default '{}'::jsonb,
  score int,
  total_questions int,
  created_at timestamptz default now() not null
);
alter table public.attempts enable row level security;
create index idx_attempts_user on public.attempts(user_id);
create index idx_attempts_list on public.attempts(list_id);

create policy "Aluno vê suas próprias tentativas" on public.attempts for select using (auth.uid() = user_id);
create policy "Aluno cria suas próprias tentativas" on public.attempts for insert with check (auth.uid() = user_id);
create policy "Aluno atualiza suas próprias tentativas" on public.attempts for update using (auth.uid() = user_id);
create policy "Admin vê todas as tentativas" on public.attempts for select using (public.is_admin());
