-- IMPORTANTE: Execute este script no Supabase SQL Editor
-- Se você já executou o script anterior, execute apenas a seção "MIGRATION" abaixo

-- ============================================
-- SCRIPT COMPLETO (para novos projetos)
-- ============================================

-- Create Checkouts Table
create table if not exists public.checkouts (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  slug text not null,
  settings jsonb not null default '{}'::jsonb,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, slug)
);

-- Create Products Table
create table if not exists public.products (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric not null,
  image text,
  checkout_id text references public.checkouts(id) on delete set null,
  sales integer default 0,
  status text check (status in ('active', 'inactive')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Transactions Table (para rastrear vendas reais)
create table if not exists public.transactions (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id text references public.products(id) on delete set null,
  checkout_id text references public.checkouts(id) on delete set null,
  customer_name text,
  customer_email text,
  amount numeric not null,
  status text check (status in ('paid', 'pending', 'expired', 'refunded')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.checkouts enable row level security;
alter table public.products enable row level security;
alter table public.transactions enable row level security;

-- Drop old policies if they exist
drop policy if exists "Enable all access for all users" on public.checkouts;
drop policy if exists "Enable all access for all users" on public.products;

-- Create RLS Policies - Users can only see their own data
create policy "Users can view their own checkouts"
  on public.checkouts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own checkouts"
  on public.checkouts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own checkouts"
  on public.checkouts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own checkouts"
  on public.checkouts for delete
  using (auth.uid() = user_id);

create policy "Users can view their own products"
  on public.products for select
  using (auth.uid() = user_id);

create policy "Users can insert their own products"
  on public.products for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own products"
  on public.products for update
  using (auth.uid() = user_id);

create policy "Users can delete their own products"
  on public.products for delete
  using (auth.uid() = user_id);

create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

-- Indexes
create index if not exists checkouts_user_id_idx on public.checkouts (user_id);
create index if not exists checkouts_slug_idx on public.checkouts (slug);
create index if not exists products_user_id_idx on public.products (user_id);
create index if not exists products_checkout_id_idx on public.products (checkout_id);
create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_product_id_idx on public.transactions (product_id);

-- ============================================
-- MIGRATION (se você já executou o script anterior)
-- ============================================

-- Adicionar coluna user_id às tabelas existentes
-- alter table public.checkouts add column if not exists user_id uuid references auth.users(id) on delete cascade;
-- alter table public.products add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Se você já tem dados, precisará atualizar user_id manualmente ou deletar os dados antigos:
-- delete from public.products;
-- delete from public.checkouts;
