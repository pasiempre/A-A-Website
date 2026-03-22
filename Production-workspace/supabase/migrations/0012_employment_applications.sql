-- Migration: 0012_employment_applications
-- Purpose: Employment applications schema expansion for hiring pipeline
-- Also finalizes completion-report policy/comment deltas while preserving existing 0011 history

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- completion_reports deltas (follow-up to 0011)
-- ---------------------------------------------------------------------------

do $$
begin
  if to_regclass('public.completion_reports') is not null then
    comment on column public.completion_reports.status is
      'Report lifecycle: generated | sent | email_failed';

    if to_regclass('public.profiles') is not null and not exists (
      select 1 from pg_policies
      where schemaname = 'public'
        and tablename = 'completion_reports'
        and policyname = 'admin_read_completion_reports'
    ) then
      create policy admin_read_completion_reports
      on public.completion_reports for select
      using (
        exists (
          select 1 from public.profiles
          where profiles.id = auth.uid() and profiles.role = 'admin'
        )
      );
    end if;

    if to_regclass('public.profiles') is not null and not exists (
      select 1 from pg_policies
      where schemaname = 'public'
        and tablename = 'completion_reports'
        and policyname = 'admin_insert_completion_reports'
    ) then
      create policy admin_insert_completion_reports
      on public.completion_reports for insert
      with check (
        exists (
          select 1 from public.profiles
          where profiles.id = auth.uid() and profiles.role = 'admin'
        )
      );
    end if;

    create index if not exists idx_completion_reports_status
      on public.completion_reports(status);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- employment_applications table create/expand
-- ---------------------------------------------------------------------------

create table if not exists public.employment_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  address text,
  city text,
  state text,
  zip text,
  is_authorized_to_work boolean not null default false,
  has_transportation boolean not null default false,
  has_drivers_license boolean not null default false,
  consent_to_background_check boolean not null default false,
  years_experience integer default 0,
  experience_description text,
  specialties jsonb default '[]'::jsonb,
  available_days jsonb default '[]'::jsonb,
  preferred_start_date timestamptz,
  is_full_time boolean default false,
  "references" jsonb default '[]'::jsonb,
  how_did_you_hear text,
  additional_notes text,
  status text not null default 'new',
  admin_notes text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  admin_notified boolean default false,
  confirmation_sent boolean default false,
  admin_email_error text,
  confirmation_email_error text,
  source_ip text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.employment_applications
  add column if not exists email text,
  add column if not exists address text,
  add column if not exists state text,
  add column if not exists zip text,
  add column if not exists is_authorized_to_work boolean,
  add column if not exists has_drivers_license boolean,
  add column if not exists consent_to_background_check boolean,
  add column if not exists experience_description text,
  add column if not exists specialties jsonb default '[]'::jsonb,
  add column if not exists available_days jsonb default '[]'::jsonb,
  add column if not exists preferred_start_date timestamptz,
  add column if not exists is_full_time boolean,
  add column if not exists "references" jsonb default '[]'::jsonb,
  add column if not exists how_did_you_hear text,
  add column if not exists additional_notes text,
  add column if not exists admin_notes text,
  add column if not exists reviewed_by uuid,
  add column if not exists reviewed_at timestamptz,
  add column if not exists admin_notified boolean default false,
  add column if not exists confirmation_sent boolean default false,
  add column if not exists admin_email_error text,
  add column if not exists confirmation_email_error text,
  add column if not exists source_ip text,
  add column if not exists submitted_at timestamptz default now();

do $$
begin
  if to_regclass('public.profiles') is not null then
    begin
      alter table public.employment_applications
        add constraint employment_applications_reviewed_by_fkey
        foreign key (reviewed_by) references public.profiles(id);
    exception
      when duplicate_object then null;
    end;
  end if;
end $$;

-- Ensure status lifecycle supports hiring inbox workflow
alter table public.employment_applications
  drop constraint if exists employment_applications_status_check;

alter table public.employment_applications
  add constraint employment_applications_status_check
  check (
    status in (
      'new',
      'reviewed',
      'interview_scheduled',
      'interviewed',
      'hired',
      'rejected',
      'withdrawn'
    )
  );

-- Fill new NOT NULL email for older rows if needed
update public.employment_applications
set email = coalesce(nullif(trim(email), ''), concat('unknown+', id::text, '@invalid.local'))
where email is null or trim(email) = '';

alter table public.employment_applications
  alter column email set not null;

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index if not exists idx_employment_applications_email_created
  on public.employment_applications(email, created_at desc);

create index if not exists idx_employment_applications_status_submitted
  on public.employment_applications(status, submitted_at desc);

create index if not exists idx_employment_applications_reviewed_by
  on public.employment_applications(reviewed_by)
  where reviewed_by is not null;

-- ---------------------------------------------------------------------------
-- Trigger: updated_at maintenance
-- ---------------------------------------------------------------------------

drop trigger if exists trg_employment_applications_updated_at on public.employment_applications;
do $$
begin
  if to_regprocedure('public.set_updated_at()') is not null then
    create trigger trg_employment_applications_updated_at
      before update on public.employment_applications
      for each row execute function public.set_updated_at();
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.employment_applications enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'employment_applications'
      and policyname = 'public_insert_applications'
  ) then
    create policy public_insert_applications
    on public.employment_applications for insert
    with check (true);
  end if;
end $$;

do $$
begin
  if to_regclass('public.profiles') is not null and not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'employment_applications'
      and policyname = 'admin_read_applications'
  ) then
    create policy admin_read_applications
    on public.employment_applications for select
    using (
      exists (
        select 1 from public.profiles
        where profiles.id = auth.uid() and profiles.role = 'admin'
      )
    );
  end if;
end $$;

do $$
begin
  if to_regclass('public.profiles') is not null and not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'employment_applications'
      and policyname = 'admin_update_applications'
  ) then
    create policy admin_update_applications
    on public.employment_applications for update
    using (
      exists (
        select 1 from public.profiles
        where profiles.id = auth.uid() and profiles.role = 'admin'
      )
    )
    with check (
      exists (
        select 1 from public.profiles
        where profiles.id = auth.uid() and profiles.role = 'admin'
      )
    );
  end if;
end $$;

comment on column public.employment_applications.status is
  'Hiring pipeline: new → reviewed → interview_scheduled → interviewed → hired | rejected | withdrawn';
