-- WELTRIQ Supabase Schema & Media Bucket Setup
-- Copy and run this entire script once in Supabase Dashboard -> SQL Editor

-- 1. Metadata flags (tracks one-time initial seeding)
create table if not exists public.app_meta (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2. Blog Articles & Guides
create table if not exists public.blogs (
  id text primary key,
  title text not null,
  slug text not null unique,
  excerpt text not null,
  cover_image text not null,
  cover_image_alt text,
  content text not null,
  category text not null,
  tags jsonb not null default '[]'::jsonb,
  status text not null default 'published' check (status in ('draft', 'published')),
  author jsonb,
  reading_time_minutes integer not null default 1,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blogs_status_published_at on public.blogs (status, published_at desc);

-- 3. Roofing Services
create table if not exists public.services (
  id text primary key,
  number text not null,
  title text not null,
  description text not null,
  image text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_services_number on public.services (number asc);

-- 4. Customer Leads & Enquiries
create table if not exists public.leads (
  id text primary key,
  name text not null,
  phone text not null,
  district text default 'Kerala',
  service text default 'Roofing Consultation',
  message text default '',
  source text not null default 'Contact Form',
  status text not null default 'new' check (status in ('new', 'contacted', 'inspection_scheduled', 'completed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_leads_created_at on public.leads (created_at desc);

-- 5. Company Info (Single row id = 'default')
create table if not exists public.company_info (
  id text primary key default 'default',
  company_name text not null,
  tagline text not null default '',
  address text not null,
  city text not null,
  district text not null,
  state text not null,
  pincode text not null,
  phone text not null,
  phone_secondary text not null default '',
  email text not null,
  whatsapp text not null,
  whatsapp_number text,
  whatsapp_default_message text not null,
  working_hours text not null,
  map_embed_url text default '',
  map_directions_url text not null,
  website text not null,
  updated_at timestamptz not null default now()
);

-- 6. Admin Security (Single row id = 'admin')
create table if not exists public.admin_security (
  id text primary key default 'admin',
  username text not null,
  password_hash text not null,
  salt text not null,
  updated_at timestamptz not null default now()
);

-- Protect all tables via Row Level Security (server uses SUPABASE_SERVICE_ROLE_KEY)
alter table public.app_meta enable row level security;
alter table public.blogs enable row level security;
alter table public.services enable row level security;
alter table public.leads enable row level security;
alter table public.company_info enable row level security;
alter table public.admin_security enable row level security;

-- 7. Public Storage Bucket for Blog & Service Images
insert into storage.buckets (id, name, public)
values ('weltriq-media', 'weltriq-media', true)
on conflict (id) do update set public = true;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read weltriq-media'
  ) then
    create policy "Public read weltriq-media"
      on storage.objects for select
      using (bucket_id = 'weltriq-media');
  end if;
end $$;
