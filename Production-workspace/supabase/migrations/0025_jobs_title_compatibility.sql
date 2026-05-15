-- Compatibility migration: ensure jobs.title exists for runtime/API parity

alter table public.jobs
  add column if not exists title text;

update public.jobs
set title = coalesce(nullif(title, ''), nullif(service_type, ''), 'Cleaning Job')
where title is null or title = '';

alter table public.jobs
  alter column title set default 'Cleaning Job';
