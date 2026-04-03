-- Post-job automation runtime settings (admin-managed)

create table if not exists public.automation_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_automation_settings_updated_at
  on public.automation_settings(updated_at desc);

drop trigger if exists trg_automation_settings_updated_at on public.automation_settings;
create trigger trg_automation_settings_updated_at
before update on public.automation_settings
for each row execute function public.set_updated_at();

alter table public.automation_settings enable row level security;

drop policy if exists "admin_all_automation_settings" on public.automation_settings;
create policy "admin_all_automation_settings"
on public.automation_settings for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

insert into public.automation_settings (key, value)
values (
  'post_job',
  jsonb_build_object(
    'review_url', null,
    'rating_request_delay_hours', 24,
    'review_reminder_delay_hours', 48,
    'payment_reminder_delay_hours', 72,
    'low_rating_threshold', 3
  )
)
on conflict (key) do nothing;
