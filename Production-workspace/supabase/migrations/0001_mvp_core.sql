-- Sprint 1 MVP core schema for A&A Cleaning
-- Run with Supabase SQL editor or supabase migrations.

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'employee');
  end if;

  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type public.lead_status as enum ('new', 'qualified', 'quoted', 'won', 'lost');
  end if;

  if not exists (select 1 from pg_type where typname = 'job_status') then
    create type public.job_status as enum ('scheduled', 'en_route', 'in_progress', 'completed', 'blocked');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role public.app_role not null default 'employee',
  locale text not null default 'es',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_name text,
  email text,
  phone text,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_name text,
  phone text not null,
  email text,
  service_type text,
  timeline text,
  description text,
  status public.lead_status not null default 'new',
  source text not null default 'web_quote_form',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  subtotal numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  quote_id uuid references public.quotes(id) on delete set null,
  title text not null,
  address text not null,
  contact_name text,
  contact_phone text,
  scope text,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  status public.job_status not null default 'scheduled',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_assignments (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  employee_id uuid not null references public.profiles(id) on delete cascade,
  assigned_by uuid references public.profiles(id),
  assigned_at timestamptz not null default now(),
  unique (job_id, employee_id)
);

create table if not exists public.job_photos (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  employee_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  taken_at timestamptz,
  latitude double precision,
  longitude double precision,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_leads_status_created_at on public.leads(status, created_at desc);
create index if not exists idx_jobs_status_scheduled_start on public.jobs(status, scheduled_start);
create index if not exists idx_job_assignments_employee_id on public.job_assignments(employee_id);
create index if not exists idx_job_photos_job_id on public.job_photos(job_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_clients_updated_at on public.clients;
create trigger trg_clients_updated_at before update on public.clients
for each row execute function public.set_updated_at();

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists trg_quotes_updated_at on public.quotes;
create trigger trg_quotes_updated_at before update on public.quotes
for each row execute function public.set_updated_at();

drop trigger if exists trg_jobs_updated_at on public.jobs;
create trigger trg_jobs_updated_at before update on public.jobs
for each row execute function public.set_updated_at();

create or replace function public.current_user_role()
returns public.app_role
language sql
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.leads enable row level security;
alter table public.quotes enable row level security;
alter table public.jobs enable row level security;
alter table public.job_assignments enable row level security;
alter table public.job_photos enable row level security;

-- Profiles
create policy "profiles_select_self_or_admin"
on public.profiles for select
using (auth.uid() = id or public.current_user_role() = 'admin');

create policy "profiles_update_self_or_admin"
on public.profiles for update
using (auth.uid() = id or public.current_user_role() = 'admin')
with check (auth.uid() = id or public.current_user_role() = 'admin');

create policy "profiles_insert_self_or_admin"
on public.profiles for insert
with check (auth.uid() = id or public.current_user_role() = 'admin');

-- Admin-only core entities
create policy "admin_all_clients"
on public.clients for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "admin_all_leads"
on public.leads for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "public_insert_leads"
on public.leads for insert
with check (true);

create policy "admin_all_quotes"
on public.quotes for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "admin_all_jobs"
on public.jobs for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "admin_all_assignments"
on public.job_assignments for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

-- Employees can read assignments/jobs they are assigned to
create policy "employee_select_assigned_jobs"
on public.jobs for select
using (
  public.current_user_role() = 'admin'
  or exists (
    select 1
    from public.job_assignments ja
    where ja.job_id = jobs.id and ja.employee_id = auth.uid()
  )
);

create policy "employee_select_own_assignments"
on public.job_assignments for select
using (public.current_user_role() = 'admin' or employee_id = auth.uid());

-- Employees can update status on assigned jobs
create policy "employee_update_assigned_jobs"
on public.jobs for update
using (
  public.current_user_role() = 'admin'
  or exists (
    select 1
    from public.job_assignments ja
    where ja.job_id = jobs.id and ja.employee_id = auth.uid()
  )
)
with check (
  public.current_user_role() = 'admin'
  or exists (
    select 1
    from public.job_assignments ja
    where ja.job_id = jobs.id and ja.employee_id = auth.uid()
  )
);

-- Photos: admin sees all, employee can insert/select their own on assigned jobs
create policy "job_photos_select_admin_or_owner"
on public.job_photos for select
using (
  public.current_user_role() = 'admin'
  or employee_id = auth.uid()
);

create policy "job_photos_insert_admin_or_owner"
on public.job_photos for insert
with check (
  public.current_user_role() = 'admin'
  or (
    employee_id = auth.uid()
    and exists (
      select 1
      from public.job_assignments ja
      where ja.job_id = job_photos.job_id and ja.employee_id = auth.uid()
    )
  )
);

-- Storage buckets (idempotent)
insert into storage.buckets (id, name, public)
values ('job-photos', 'job-photos', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('job-photos-spike', 'job-photos-spike', false)
on conflict (id) do nothing;

-- Storage policies
create policy "storage_admin_all_job_photos"
on storage.objects for all
using (
  bucket_id in ('job-photos', 'job-photos-spike')
  and public.current_user_role() = 'admin'
)
with check (
  bucket_id in ('job-photos', 'job-photos-spike')
  and public.current_user_role() = 'admin'
);

create policy "storage_employee_insert_job_photos"
on storage.objects for insert
with check (
  bucket_id in ('job-photos', 'job-photos-spike')
  and (public.current_user_role() = 'employee' or public.current_user_role() = 'admin')
);

create policy "storage_employee_select_job_photos"
on storage.objects for select
using (
  bucket_id in ('job-photos', 'job-photos-spike')
  and (public.current_user_role() = 'employee' or public.current_user_role() = 'admin')
);
