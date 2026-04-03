-- Migration 2 extension: F-07/F-08 foundations (post-job sequence + payment tracking)

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table public.jobs
  add column if not exists payment_status text not null default 'pending'
    check (payment_status in ('pending', 'invoiced', 'paid', 'overdue')),
  add column if not exists payment_amount numeric(12,2),
  add column if not exists payment_method text,
  add column if not exists paid_at timestamptz;

create index if not exists idx_jobs_payment_status
  on public.jobs(payment_status, completed_at desc);

create index if not exists idx_jobs_paid_at
  on public.jobs(paid_at desc)
  where paid_at is not null;

create table if not exists public.post_job_sequence (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references public.jobs(id) on delete cascade,
  status text not null default 'active'
    check (status in ('active', 'completed', 'paused', 'cancelled')),
  next_step text not null default 'customer_completion_email',

  started_at timestamptz not null default now(),
  approval_at timestamptz,

  admin_notified_at timestamptz,
  customer_notified_at timestamptz,

  rating_request_due_at timestamptz,
  rating_requested_at timestamptz,
  rating_value smallint check (rating_value between 1 and 5),
  rating_received_at timestamptz,

  low_rating_alerted_at timestamptz,
  review_invite_sent_at timestamptz,
  review_reminder_due_at timestamptz,
  review_reminder_sent_at timestamptz,

  payment_reminder_due_at timestamptz,
  payment_reminder_sent_at timestamptz,

  last_error text,
  context jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_post_job_sequence_status_step
  on public.post_job_sequence(status, next_step, updated_at desc);

create index if not exists idx_post_job_sequence_due_rating
  on public.post_job_sequence(rating_request_due_at)
  where rating_requested_at is null and status = 'active';

create index if not exists idx_post_job_sequence_due_payment
  on public.post_job_sequence(payment_reminder_due_at)
  where payment_reminder_sent_at is null and status = 'active';

create index if not exists idx_post_job_sequence_due_review_reminder
  on public.post_job_sequence(review_reminder_due_at)
  where review_reminder_sent_at is null and status = 'active';

drop trigger if exists trg_post_job_sequence_updated_at on public.post_job_sequence;
create trigger trg_post_job_sequence_updated_at
before update on public.post_job_sequence
for each row execute function public.set_updated_at();

alter table public.post_job_sequence enable row level security;

drop policy if exists "admin_all_post_job_sequence" on public.post_job_sequence;
create policy "admin_all_post_job_sequence"
on public.post_job_sequence for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');
