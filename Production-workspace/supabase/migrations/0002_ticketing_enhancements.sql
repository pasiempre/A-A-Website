-- Sprint 1 ticketing enhancements (mobile-first operations baseline)

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'clean_type') then
    create type public.clean_type as enum (
      'post_construction',
      'final_clean',
      'rough_clean',
      'move_in_out',
      'window',
      'power_wash',
      'commercial',
      'general',
      'custom'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'job_priority') then
    create type public.job_priority as enum ('normal', 'urgent', 'rush');
  end if;

  if not exists (select 1 from pg_type where typname = 'qa_status') then
    create type public.qa_status as enum ('pending', 'approved', 'flagged', 'needs_rework');
  end if;

  if not exists (select 1 from pg_type where typname = 'assignment_role') then
    create type public.assignment_role as enum ('lead', 'member');
  end if;

  if not exists (select 1 from pg_type where typname = 'assignment_status') then
    create type public.assignment_status as enum ('assigned', 'en_route', 'in_progress', 'complete');
  end if;

  if not exists (select 1 from pg_type where typname = 'issue_status') then
    create type public.issue_status as enum ('open', 'acknowledged', 'resolved');
  end if;
end $$;

alter table public.jobs
  add column if not exists clean_type public.clean_type not null default 'general',
  add column if not exists priority public.job_priority not null default 'normal',
  add column if not exists qa_status public.qa_status not null default 'pending',
  add column if not exists qa_notes text,
  add column if not exists qa_reviewed_by uuid references public.profiles(id),
  add column if not exists qa_reviewed_at timestamptz,
  add column if not exists areas text[] not null default '{}',
  add column if not exists assigned_week_start date,
  add column if not exists duplicate_source_job_id uuid references public.jobs(id);

alter table public.job_assignments
  add column if not exists role public.assignment_role not null default 'member',
  add column if not exists status public.assignment_status not null default 'assigned',
  add column if not exists started_at timestamptz,
  add column if not exists completed_at timestamptz;

create table if not exists public.issue_reports (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  reported_by uuid not null references public.profiles(id) on delete cascade,
  description text not null,
  photo_path text,
  status public.issue_status not null default 'open',
  resolution_notes text,
  resolved_by uuid references public.profiles(id),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_jobs_clean_type_status on public.jobs(clean_type, status);
create index if not exists idx_jobs_week_priority on public.jobs(assigned_week_start, priority);
create index if not exists idx_jobs_duplicate_source on public.jobs(duplicate_source_job_id);
create index if not exists idx_job_assignments_status on public.job_assignments(employee_id, status);
create index if not exists idx_issue_reports_job_status on public.issue_reports(job_id, status);

-- Ensure one lead assignment max per job
create unique index if not exists idx_job_assignments_single_lead
  on public.job_assignments(job_id)
  where role = 'lead';

drop trigger if exists trg_issue_reports_updated_at on public.issue_reports;
create trigger trg_issue_reports_updated_at before update on public.issue_reports
for each row execute function public.set_updated_at();

alter table public.issue_reports enable row level security;

-- Admin full access
create policy if not exists "admin_all_issue_reports"
on public.issue_reports for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

-- Employees can read issues for jobs assigned to them
create policy if not exists "employee_select_assigned_issues"
on public.issue_reports for select
using (
  public.current_user_role() = 'admin'
  or exists (
    select 1
    from public.job_assignments ja
    where ja.job_id = issue_reports.job_id and ja.employee_id = auth.uid()
  )
);

-- Employees can create issues only on assigned jobs
create policy if not exists "employee_insert_assigned_issues"
on public.issue_reports for insert
with check (
  public.current_user_role() = 'admin'
  or (
    reported_by = auth.uid()
    and exists (
      select 1
      from public.job_assignments ja
      where ja.job_id = issue_reports.job_id and ja.employee_id = auth.uid()
    )
  )
);

-- Employees can update only their own open issues (limited collaboration)
create policy if not exists "employee_update_own_issues"
on public.issue_reports for update
using (
  public.current_user_role() = 'admin'
  or (reported_by = auth.uid() and status <> 'resolved')
)
with check (
  public.current_user_role() = 'admin'
  or (reported_by = auth.uid())
);

-- Prevent non-admin delete operations
create policy if not exists "admin_delete_issue_reports_only"
on public.issue_reports for delete
using (public.current_user_role() = 'admin');
