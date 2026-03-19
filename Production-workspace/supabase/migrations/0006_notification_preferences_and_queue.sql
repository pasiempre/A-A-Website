-- Phase 2: notification preferences + queued dispatch

alter table public.profiles
  add column if not exists notification_preferences jsonb not null default jsonb_build_object(
    'quiet_hours_start', '21:00',
    'quiet_hours_end', '07:00',
    'batch_job_notifications', true,
    'sms_enabled', true,
    'email_enabled', false,
    'notification_summary_time', '06:00',
    'timezone', 'America/Chicago'
  );

create table if not exists public.notification_dispatch_queue (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  to_phone text not null,
  body text not null,
  send_after timestamptz not null,
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed')),
  queued_reason text,
  context jsonb not null default '{}'::jsonb,
  provider_sid text,
  sent_at timestamptz,
  error_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_notification_dispatch_queue_status_send_after
  on public.notification_dispatch_queue(status, send_after);

drop trigger if exists trg_notification_dispatch_queue_updated_at on public.notification_dispatch_queue;
create trigger trg_notification_dispatch_queue_updated_at
before update on public.notification_dispatch_queue
for each row execute function public.set_updated_at();

alter table public.notification_dispatch_queue enable row level security;

create policy if not exists "admin_all_notification_dispatch_queue"
on public.notification_dispatch_queue for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');