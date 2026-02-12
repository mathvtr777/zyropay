-- Create Checkouts Table
create table public.checkouts (
  id text primary key default gen_random_uuid()::text, -- Using text to match existing ID format if possible, but gen_random_uuid is better. We'll cast to text.
  name text not null,
  slug text not null unique,
  settings jsonb not null default '{}'::jsonb,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Products Table
create table public.products (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  description text,
  price numeric not null,
  image text,
  checkout_id text references public.checkouts(id) on delete set null,
  sales integer default 0,
  status text check (status in ('active', 'inactive')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.checkouts enable row level security;
alter table public.products enable row level security;

-- Create Policies (Public access for now as per "priva" nature, or authenticated?)
-- For this demo/MVP, we'll allow public read/write to make it work quickly without auth setup.
-- Ideally, this should be restricted to authenticated users.

create policy "Enable all access for all users" on public.checkouts
  for all using (true) with check (true);

create policy "Enable all access for all users" on public.products
  for all using (true) with check (true);

-- Indexes
create index checkouts_slug_idx on public.checkouts (slug);
create index products_checkout_id_idx on public.products (checkout_id);
