-- Phase 4/5 foundations: financial snapshots, scheduling, inventory, AI assistant scaffolding

create extension if not exists "pgcrypto";

create table if not exists public.financial_snapshots (
  id uuid primary key default gen_random_uuid(),
  period_start date not null,
  period_end date not null,
  total_revenue numeric(14,2) not null default 0,
  outstanding_invoices numeric(14,2) not null default 0,
  overdue_invoices numeric(14,2) not null default 0,
  paid_invoices numeric(14,2) not null default 0,
  expense_total numeric(14,2) not null default 0,
  cash_in numeric(14,2) not null default 0,
  cash_out numeric(14,2) not null default 0,
  avg_days_to_payment numeric(10,2),
  source text not null default 'manual',
  source_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (period_start, period_end, source)
);

create table if not exists public.quickbooks_sync_queue (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'queued' check (status in ('queued', 'processing', 'completed', 'failed')),
  attempts integer not null default 0,
  next_retry_at timestamptz,
  last_error text,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quickbooks_invoice_cache (
  id uuid primary key default gen_random_uuid(),
  quickbooks_invoice_id text not null unique,
  client_id uuid references public.clients(id) on delete set null,
  job_id uuid references public.jobs(id) on delete set null,
  status text not null,
  amount_total numeric(14,2) not null default 0,
  amount_due numeric(14,2) not null default 0,
  issue_date date,
  due_date date,
  paid_at timestamptz,
  raw_payload jsonb not null default '{}'::jsonb,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.employee_availability (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.profiles(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null check (status in ('available', 'unavailable', 'limited')),
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_reassignment_history (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  from_employee_id uuid references public.profiles(id) on delete set null,
  to_employee_id uuid references public.profiles(id) on delete set null,
  reassigned_by uuid references public.profiles(id),
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.supplies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('chemical', 'tool', 'consumable')),
  unit text not null,
  current_stock numeric(12,2) not null default 0,
  reorder_threshold numeric(12,2) not null default 0,
  cost_per_unit numeric(12,2) not null default 0,
  preferred_vendor text,
  purchase_link text,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supply_usage_logs (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete set null,
  supply_id uuid not null references public.supplies(id) on delete cascade,
  quantity_used numeric(12,2) not null,
  logged_by uuid references public.profiles(id),
  logged_at timestamptz not null default now(),
  notes text
);

create table if not exists public.supply_requests (
  id uuid primary key default gen_random_uuid(),
  requested_by uuid not null references public.profiles(id) on delete cascade,
  supply_id uuid references public.supplies(id) on delete set null,
  quantity_needed numeric(12,2) not null,
  site_address text,
  urgency text not null default 'normal' check (urgency in ('normal', 'urgent')),
  status text not null default 'requested' check (status in ('requested', 'approved', 'delivered', 'rejected')),
  notes text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_type text not null check (user_type in ('public', 'employee', 'admin', 'client')),
  started_by uuid references public.profiles(id) on delete set null,
  locale text not null default 'en',
  lead_id uuid references public.leads(id) on delete set null,
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.ai_chat_sessions(id) on delete cascade,
  role text not null check (role in ('system', 'user', 'assistant')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_financial_snapshots_period on public.financial_snapshots(period_start desc, period_end desc);
create index if not exists idx_quickbooks_sync_queue_status_retry on public.quickbooks_sync_queue(status, next_retry_at);
create index if not exists idx_quickbooks_invoice_cache_status_due on public.quickbooks_invoice_cache(status, due_date);
create index if not exists idx_employee_availability_employee_time on public.employee_availability(employee_id, starts_at, ends_at);
create index if not exists idx_job_reassignment_history_job on public.job_reassignment_history(job_id, created_at desc);
create index if not exists idx_supplies_category_active on public.supplies(category, is_active);
create index if not exists idx_supply_usage_logs_supply_logged on public.supply_usage_logs(supply_id, logged_at desc);
create index if not exists idx_supply_requests_status_created on public.supply_requests(status, created_at desc);
create index if not exists idx_ai_chat_messages_session_created on public.ai_chat_messages(session_id, created_at);

drop trigger if exists trg_quickbooks_sync_queue_updated_at on public.quickbooks_sync_queue;
create trigger trg_quickbooks_sync_queue_updated_at before update on public.quickbooks_sync_queue
for each row execute function public.set_updated_at();

drop trigger if exists trg_quickbooks_invoice_cache_updated_at on public.quickbooks_invoice_cache;
create trigger trg_quickbooks_invoice_cache_updated_at before update on public.quickbooks_invoice_cache
for each row execute function public.set_updated_at();

drop trigger if exists trg_employee_availability_updated_at on public.employee_availability;
create trigger trg_employee_availability_updated_at before update on public.employee_availability
for each row execute function public.set_updated_at();

drop trigger if exists trg_supplies_updated_at on public.supplies;
create trigger trg_supplies_updated_at before update on public.supplies
for each row execute function public.set_updated_at();

drop trigger if exists trg_supply_requests_updated_at on public.supply_requests;
create trigger trg_supply_requests_updated_at before update on public.supply_requests
for each row execute function public.set_updated_at();

drop trigger if exists trg_ai_chat_sessions_updated_at on public.ai_chat_sessions;
create trigger trg_ai_chat_sessions_updated_at before update on public.ai_chat_sessions
for each row execute function public.set_updated_at();

alter table public.financial_snapshots enable row level security;
alter table public.quickbooks_sync_queue enable row level security;
alter table public.quickbooks_invoice_cache enable row level security;
alter table public.employee_availability enable row level security;
alter table public.job_reassignment_history enable row level security;
alter table public.supplies enable row level security;
alter table public.supply_usage_logs enable row level security;
alter table public.supply_requests enable row level security;
alter table public.ai_chat_sessions enable row level security;
alter table public.ai_chat_messages enable row level security;

create policy "admin_all_financial_snapshots"
on public.financial_snapshots for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "admin_all_quickbooks_sync_queue"
on public.quickbooks_sync_queue for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "admin_all_quickbooks_invoice_cache"
on public.quickbooks_invoice_cache for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "admin_all_employee_availability"
on public.employee_availability for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "employee_select_own_availability"
on public.employee_availability for select
using (employee_id = auth.uid() or public.current_user_role() = 'admin');

create policy "admin_all_job_reassignment_history"
on public.job_reassignment_history for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "admin_all_supplies"
on public.supplies for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "employee_select_supplies"
on public.supplies for select
using (is_active = true or public.current_user_role() = 'admin');

create policy "admin_all_supply_usage_logs"
on public.supply_usage_logs for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "employee_insert_supply_usage_logs"
on public.supply_usage_logs for insert
with check (
  public.current_user_role() = 'admin'
  or logged_by = auth.uid()
);

create policy "employee_select_own_supply_usage_logs"
on public.supply_usage_logs for select
using (public.current_user_role() = 'admin' or logged_by = auth.uid());

create policy "admin_all_supply_requests"
on public.supply_requests for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "employee_insert_own_supply_requests"
on public.supply_requests for insert
with check (
  public.current_user_role() = 'admin'
  or requested_by = auth.uid()
);

create policy "employee_select_own_supply_requests"
on public.supply_requests for select
using (public.current_user_role() = 'admin' or requested_by = auth.uid());

create policy "admin_all_ai_chat_sessions"
on public.ai_chat_sessions for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "public_insert_ai_chat_sessions"
on public.ai_chat_sessions for insert
with check (user_type = 'public' or public.current_user_role() = 'admin');

create policy "admin_all_ai_chat_messages"
on public.ai_chat_messages for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "public_insert_ai_chat_messages"
on public.ai_chat_messages for insert
with check (
  exists (
    select 1
    from public.ai_chat_sessions s
    where s.id = ai_chat_messages.session_id
      and (s.user_type = 'public' or public.current_user_role() = 'admin')
  )
);