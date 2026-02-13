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

-- ============================================
-- PAYMENT PROVIDERS TABLES
-- ============================================

-- Provider Credentials (encrypted)
create table if not exists public.provider_credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  provider text not null check (provider in ('stripe', 'mercadopago', 'kirvano', 'asaas', 'gerencianet', 'pagarme', 'pushinpay')),
  api_key_encrypted text not null,
  secret_key_encrypted text not null,
  is_active boolean default true,
  environment text default 'sandbox' check (environment in ('sandbox', 'production')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, provider, environment)
);

-- Payment Links Generated
create table if not exists public.payment_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  provider text not null,
  amount numeric not null,
  description text,
  payment_url text not null,
  external_id text, -- ID do link no provedor externo
  status text default 'active' check (status in ('active', 'paid', 'expired', 'cancelled')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone
);

-- Enable RLS
alter table public.checkouts enable row level security;
alter table public.products enable row level security;
alter table public.transactions enable row level security;
alter table public.provider_credentials enable row level security;
alter table public.payment_links enable row level security;

-- Drop old policies if they exist
drop policy if exists "Enable all access for all users" on public.checkouts;
drop policy if exists "Enable all access for all users" on public.products;

-- ============================================
-- RLS POLICIES - Checkouts
-- ============================================

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

-- ============================================
-- RLS POLICIES - Products
-- ============================================

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

-- ============================================
-- RLS POLICIES - Transactions
-- ============================================

create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - Provider Credentials
-- ============================================

create policy "Users can view their own credentials"
  on public.provider_credentials for select
  using (auth.uid() = user_id);

create policy "Users can insert their own credentials"
  on public.provider_credentials for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own credentials"
  on public.provider_credentials for update
  using (auth.uid() = user_id);

create policy "Users can delete their own credentials"
  on public.provider_credentials for delete
  using (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - Payment Links
-- ============================================

create policy "Users can view their own payment links"
  on public.payment_links for select
  using (auth.uid() = user_id);

create policy "Users can insert their own payment links"
  on public.payment_links for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own payment links"
  on public.payment_links for update
  using (auth.uid() = user_id);

-- ============================================
-- INDEXES
-- ============================================

create index if not exists checkouts_user_id_idx on public.checkouts (user_id);
create index if not exists checkouts_slug_idx on public.checkouts (slug);
create index if not exists products_user_id_idx on public.products (user_id);
create index if not exists products_checkout_id_idx on public.products (checkout_id);
create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_product_id_idx on public.transactions (product_id);
create index if not exists provider_credentials_user_id_idx on public.provider_credentials (user_id);
create index if not exists provider_credentials_provider_idx on public.provider_credentials (provider);
create index if not exists payment_links_user_id_idx on public.payment_links (user_id);
create index if not exists payment_links_status_idx on public.payment_links (status);

-- ============================================
-- MIGRATION (se você já executou o script anterior)
-- ============================================

-- Adicionar coluna user_id às tabelas existentes
-- alter table public.checkouts add column if not exists user_id uuid references auth.users(id) on delete cascade;
-- alter table public.products add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Se você já tem dados, precisará atualizar user_id manualmente ou deletar os dados antigos:
-- delete from public.products;
-- delete from public.checkouts;
