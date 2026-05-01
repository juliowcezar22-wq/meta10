-- ============================================================
-- PARTE 1: EXTENSIONS, ENUMS E FUNÇÕES BASE
-- ============================================================
-- Execute este bloco PRIMEIRO. Validação esperada:
-- "Success. No rows returned"
-- ============================================================

-- Habilitar a extensão pgcrypto para UUIDs
create extension if not exists "pgcrypto";

-- Enum para roles
do $$ begin
    create type user_role as enum ('aluno', 'admin', 'professor');
exception
    when duplicate_object then null;
end $$;

-- Função Security Definer para Bypass RLS sem recursão
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
$$;

-- Trigger update_updated_at function global
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- ============================================================
-- PARTE 2: TABELA users + TRIGGER handle_new_user
-- ============================================================

create table public.users (
  id uuid references auth.users not null primary key,
  nome text not null,
  email text not null unique,
  role user_role default 'aluno' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.users enable row level security;
create index if not exists idx_users_email on public.users(email);

create trigger update_users_modtime
  before update on public.users
  for each row execute procedure update_updated_at_column();

-- Trigger de sincronização do auth.users -> public.users e seed admin
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  is_seed_admin boolean;
begin
  is_seed_admin := new.email = current_setting('app.admin_seed_email', true);

  insert into public.users (id, email, nome, role)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'nome', ''), 
    case when is_seed_admin then 'admin'::user_role else 'aluno'::user_role end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- PARTE 3: POLICIES RLS DE users
-- ============================================================

create policy "Usuários podem ver seu próprio perfil" 
  on public.users for select 
  using (auth.uid() = id);

create policy "Admins podem ver todos os usuários" 
  on public.users for select 
  using (public.is_admin());

create policy "Usuários podem atualizar seu próprio perfil" 
  on public.users for update 
  using (auth.uid() = id);

create policy "Admins podem atualizar todos os usuários" 
  on public.users for update 
  using (public.is_admin());

-- ============================================================
-- PARTE 4: TABELA plans + POLICIES + INSERT BASE
-- ============================================================

create table public.plans (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  duration_months int not null,
  created_at timestamptz default now() not null
);

alter table public.plans enable row level security;

create policy "Todos podem ver os planos" 
  on public.plans for select 
  using (true);

create policy "Somente admin gerencia planos" 
  on public.plans for all 
  using (public.is_admin());

insert into public.plans (name, duration_months) 
values 
  ('Mensal', 1), 
  ('Semestral', 6), 
  ('Anual', 12);

-- ============================================================
-- PARTE 5: TABELA subscriptions + ÍNDICES + TRIGGER + POLICIES
-- ============================================================

create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  plan_id uuid references public.plans(id) not null,
  status text not null default 'active' check (status in ('active', 'cancelled', 'expired')),
  expires_at timestamptz not null,
  cancelled_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.subscriptions enable row level security;

create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create unique index if not exists idx_active_subscription_per_user on public.subscriptions(user_id) where status = 'active';

create trigger update_subscriptions_modtime 
  before update on public.subscriptions 
  for each row execute procedure update_updated_at_column();

create policy "Usuário vê sua própria assinatura" 
  on public.subscriptions for select 
  using (auth.uid() = user_id);

create policy "Admin gerencia assinaturas" 
  on public.subscriptions for all 
  using (public.is_admin());

-- ============================================================
-- PARTE 6: TABELA subscription_logs + POLICIES
-- ============================================================

create table public.subscription_logs (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references public.users(id) not null,
  user_id uuid references public.users(id) not null,
  action text not null check (action in ('created', 'updated', 'cancelled', 'extended')),
  plan_id uuid references public.plans(id),
  previous_expires_at timestamptz,
  new_expires_at timestamptz,
  notes text,
  created_at timestamptz default now() not null
);

alter table public.subscription_logs enable row level security;

create policy "Apenas admin acessa logs de assinatura" 
  on public.subscription_logs for all 
  using (public.is_admin());

-- ============================================================
-- PARTE 7: TABELA materials + TRIGGER + POLICIES
-- ============================================================

create table public.materials (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  type text not null check (type in ('video', 'pdf', 'audio', 'link', 'mapa_mental', 'resumo')),
  subject text check (subject in ('matematica', 'portugues', 'historia', 'geografia', 'ciencias', 'ingles', 'fisica', 'quimica', 'biologia', 'outros')),
  file_url text not null,
  is_free boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.materials enable row level security;

create trigger update_materials_modtime 
  before update on public.materials 
  for each row execute procedure update_updated_at_column();

create policy "Materiais grátis são visíveis a todos logados" 
  on public.materials for select 
  using (is_free = true and auth.uid() is not null);

create policy "Materiais pagos apenas para assinantes ativos ou admins" 
  on public.materials for select 
  using (
    is_free = false and (
      exists (select 1 from public.subscriptions where user_id = auth.uid() and status = 'active' and expires_at > now())
      or public.is_admin()
    )
  );

create policy "Apenas admin gerencia materiais" 
  on public.materials for all 
  using (public.is_admin());

-- ============================================================
-- PARTE 8: TABELA products + TRIGGER + POLICIES
-- ============================================================

create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10,2) not null,
  hotmart_link text not null,
  image_url text,
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.products enable row level security;

create trigger update_products_modtime 
  before update on public.products 
  for each row execute procedure update_updated_at_column();

create policy "Todos veem produtos ativos" 
  on public.products for select 
  using (is_active = true);

create policy "Apenas admin gerencia produtos" 
  on public.products for all 
  using (public.is_admin());

-- ============================================================
-- PARTE 9: TABELA testimonials + TRIGGER + POLICIES
-- ============================================================

create table public.testimonials (
  id uuid default gen_random_uuid() primary key,
  author_name text not null,
  text text not null,
  avatar_url text,
  rating int default 5 not null check (rating >= 1 and rating <= 5),
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.testimonials enable row level security;

create trigger update_testimonials_modtime 
  before update on public.testimonials 
  for each row execute procedure update_updated_at_column();

create policy "Todos veem depoimentos ativos" 
  on public.testimonials for select 
  using (is_active = true);

create policy "Apenas admin gerencia depoimentos" 
  on public.testimonials for all 
  using (public.is_admin());

-- ============================================================
-- PARTE 10: TABELA messages + TRIGGER + POLICIES
-- ============================================================

create table public.messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.messages enable row level security;

create trigger update_messages_modtime 
  before update on public.messages 
  for each row execute procedure update_updated_at_column();

create policy "Qualquer pessoa pode inserir mensagens" 
  on public.messages for insert 
  with check (true);

create policy "Apenas admin pode ler e gerenciar mensagens" 
  on public.messages for select 
  using (public.is_admin());

create policy "Apenas admin pode atualizar/deletar mensagens" 
  on public.messages for update 
  using (public.is_admin());
