-- Phase 1 completion pass: quote delivery/response, assignment notification state,
-- hiring intake, and persistent first-run completion tracking.

alter table public.profiles
  add column if not exists first_run_completed_at timestamptz;

alter table public.quotes
  add column if not exists public_token text,
  add column if not exists recipient_email text,
  add column if not exists delivery_status text not null default 'pending'
    check (delivery_status in ('pending', 'sent', 'share_link_only', 'failed')),
  add column if not exists delivery_error text,
  add column if not exists accepted_at timestamptz,
  add column if not exists declined_at timestamptz,
  add column if not exists accepted_by_name text,
  add column if not exists accepted_by_email text,
  add column if not exists response_notes text,
  add column if not exists pdf_generated_at timestamptz;

create unique index if not exists idx_quotes_public_token_unique
  on public.quotes(public_token)
  where public_token is not null;

create index if not exists idx_quotes_delivery_status_created
  on public.quotes(delivery_status, created_at desc);

alter table public.job_assignments
  add column if not exists notification_status text not null default 'pending'
    check (notification_status in ('pending', 'queued', 'sent', 'failed', 'skipped')),
  add column if not exists notification_error text,
  add column if not exists notified_at timestamptz;

create index if not exists idx_job_assignments_notification_status
  on public.job_assignments(notification_status, assigned_at desc);

create table if not exists public.employment_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  preferred_language text not null default 'es',
  city text,
  experience_years integer,
  has_transportation boolean,
  is_eligible_to_work boolean,
  availability_text text,
  notes text,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'contacted', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_employment_applications_status_created
  on public.employment_applications(status, created_at desc);

drop trigger if exists trg_employment_applications_updated_at on public.employment_applications;
create trigger trg_employment_applications_updated_at
before update on public.employment_applications
for each row execute function public.set_updated_at();

alter table public.employment_applications enable row level security;

create policy if not exists "admin_all_employment_applications"
on public.employment_applications for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy if not exists "public_insert_employment_applications"
on public.employment_applications for insert
with check (true);
