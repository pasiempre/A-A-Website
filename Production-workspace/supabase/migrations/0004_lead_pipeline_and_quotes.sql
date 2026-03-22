-- Phase 1 lead pipeline + quote workflow enhancements

create extension if not exists "pgcrypto";

do $$
begin
  if exists (select 1 from pg_type where typname = 'lead_status') then
    begin
      alter type public.lead_status add value if not exists 'contacted';
    exception when duplicate_object then null;
    end;

    begin
      alter type public.lead_status add value if not exists 'site_visit_scheduled';
    exception when duplicate_object then null;
    end;

    begin
      alter type public.lead_status add value if not exists 'dormant';
    exception when duplicate_object then null;
    end;
  end if;
end $$;

alter table public.leads
  add column if not exists notes text,
  add column if not exists contacted_at timestamptz,
  add column if not exists first_alert_sent_at timestamptz,
  add column if not exists second_alert_sent_at timestamptz,
  add column if not exists converted_client_id uuid references public.clients(id) on delete set null;

create index if not exists idx_leads_status_created_alerts
  on public.leads(status, created_at desc, first_alert_sent_at, second_alert_sent_at);

alter table public.quotes
  add column if not exists quote_number text,
  add column if not exists status text not null default 'draft',
  add column if not exists site_address text,
  add column if not exists scope_description text,
  add column if not exists valid_until date,
  add column if not exists tax_amount numeric(12,2) not null default 0,
  add column if not exists sent_at timestamptz,
  add column if not exists viewed_at timestamptz,
  add column if not exists responded_at timestamptz,
  add column if not exists quickbooks_estimate_id text;

create unique index if not exists idx_quotes_quote_number_unique
  on public.quotes(quote_number)
  where quote_number is not null;

create index if not exists idx_quotes_lead_status_created
  on public.quotes(lead_id, status, created_at desc);

create table if not exists public.quote_line_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit text not null default 'flat',
  unit_price numeric(12,2) not null default 0,
  line_total numeric(12,2) not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_quote_line_items_quote_sort
  on public.quote_line_items(quote_id, sort_order, created_at);

alter table public.quote_line_items enable row level security;

create policy "admin_all_quote_line_items"
on public.quote_line_items for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');