-- Sprint 1 completion/rework + conversion event instrumentation

create extension if not exists "pgcrypto";

create table if not exists public.conversion_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  page_path text,
  source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_conversion_events_event_created
  on public.conversion_events(event_name, created_at desc);

alter table public.conversion_events enable row level security;

create policy if not exists "public_insert_conversion_events"
on public.conversion_events for insert
with check (true);

create policy if not exists "admin_read_conversion_events"
on public.conversion_events for select
using (public.current_user_role() = 'admin');

-- completion photo type support
alter table public.job_photos
  add column if not exists photo_type text not null default 'completion';

create index if not exists idx_job_photos_photo_type
  on public.job_photos(photo_type);
