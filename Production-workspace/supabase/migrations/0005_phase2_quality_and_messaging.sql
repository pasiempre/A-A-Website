-- Phase 2 foundations: job messaging, checklists, completion reports, lead qualification fields

create extension if not exists "pgcrypto";

alter table public.leads
  add column if not exists square_footage_estimate integer,
  add column if not exists site_ready boolean;

create table if not exists public.checklist_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  locale text not null default 'es',
  description text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.checklist_template_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.checklist_templates(id) on delete cascade,
  item_text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.jobs
  add column if not exists checklist_template_id uuid references public.checklist_templates(id) on delete set null;

create table if not exists public.job_checklist_items (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  item_text text not null,
  sort_order integer not null default 0,
  is_completed boolean not null default false,
  completed_at timestamptz,
  completed_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (job_id, item_text)
);

create table if not exists public.job_messages (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  message_text text not null,
  photo_path text,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.completion_reports (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  created_by uuid references public.profiles(id),
  recipient_email text,
  status text not null default 'generated',
  report_payload jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_checklist_template_items_template
  on public.checklist_template_items(template_id, sort_order);

create index if not exists idx_job_checklist_items_job
  on public.job_checklist_items(job_id, sort_order, is_completed);

create index if not exists idx_job_messages_job_created
  on public.job_messages(job_id, created_at desc);

create index if not exists idx_completion_reports_job_created
  on public.completion_reports(job_id, created_at desc);

drop trigger if exists trg_checklist_templates_updated_at on public.checklist_templates;
create trigger trg_checklist_templates_updated_at before update on public.checklist_templates
for each row execute function public.set_updated_at();

alter table public.checklist_templates enable row level security;
alter table public.checklist_template_items enable row level security;
alter table public.job_checklist_items enable row level security;
alter table public.job_messages enable row level security;
alter table public.completion_reports enable row level security;

create policy if not exists "admin_all_checklist_templates"
on public.checklist_templates for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy if not exists "admin_all_checklist_template_items"
on public.checklist_template_items for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy if not exists "admin_all_job_checklist_items"
on public.job_checklist_items for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy if not exists "employee_select_assigned_job_checklist_items"
on public.job_checklist_items for select
using (
  public.current_user_role() = 'admin'
  or exists (
    select 1
    from public.job_assignments ja
    where ja.job_id = job_checklist_items.job_id and ja.employee_id = auth.uid()
  )
);

create policy if not exists "employee_update_assigned_job_checklist_items"
on public.job_checklist_items for update
using (
  public.current_user_role() = 'admin'
  or exists (
    select 1
    from public.job_assignments ja
    where ja.job_id = job_checklist_items.job_id and ja.employee_id = auth.uid()
  )
)
with check (
  public.current_user_role() = 'admin'
  or exists (
    select 1
    from public.job_assignments ja
    where ja.job_id = job_checklist_items.job_id and ja.employee_id = auth.uid()
  )
);

create policy if not exists "admin_all_job_messages"
on public.job_messages for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy if not exists "employee_select_assigned_job_messages"
on public.job_messages for select
using (
  public.current_user_role() = 'admin'
  or exists (
    select 1
    from public.job_assignments ja
    where ja.job_id = job_messages.job_id and ja.employee_id = auth.uid()
  )
);

create policy if not exists "employee_insert_assigned_job_messages"
on public.job_messages for insert
with check (
  public.current_user_role() = 'admin'
  or (
    sender_id = auth.uid()
    and exists (
      select 1
      from public.job_assignments ja
      where ja.job_id = job_messages.job_id and ja.employee_id = auth.uid()
    )
  )
);

create policy if not exists "admin_all_completion_reports"
on public.completion_reports for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');