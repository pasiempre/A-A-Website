-- Completion report enrichment
-- Adds metadata columns used by completion-report API resilience + history UX

create extension if not exists "pgcrypto";

create table if not exists public.completion_reports (
  id uuid primary key default gen_random_uuid(),
  job_id uuid,
  created_by uuid,
  recipient_email text,
  status text not null default 'generated',
  report_payload jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

do $$
begin
  if to_regclass('public.jobs') is not null then
    begin
      alter table public.completion_reports
        add constraint completion_reports_job_id_fkey
        foreign key (job_id) references public.jobs(id) on delete cascade;
    exception
      when duplicate_object then null;
    end;
  end if;

  if to_regclass('public.profiles') is not null then
    begin
      alter table public.completion_reports
        add constraint completion_reports_created_by_fkey
        foreign key (created_by) references public.profiles(id);
    exception
      when duplicate_object then null;
    end;
  end if;
end $$;

alter table public.completion_reports
  add column if not exists cc_emails text[],
  add column if not exists auto_triggered boolean not null default false,
  add column if not exists report_html text,
  add column if not exists email_error text;

do $$
begin
  if to_regclass('public.jobs') is not null then
    alter table public.jobs
      add column if not exists last_completion_report_id uuid,
      add column if not exists last_completion_report_at timestamptz;

    begin
      alter table public.jobs
        add constraint jobs_last_completion_report_id_fkey
        foreign key (last_completion_report_id)
        references public.completion_reports(id)
        on delete set null;
    exception
      when duplicate_object then null;
    end;
  end if;
end $$;

create index if not exists idx_completion_reports_job_auto_created
  on public.completion_reports(job_id, auto_triggered, created_at desc);

do $$
begin
  if to_regclass('public.jobs') is not null then
    create index if not exists idx_jobs_last_completion_report
      on public.jobs(last_completion_report_id, last_completion_report_at desc);
  end if;
end $$;
