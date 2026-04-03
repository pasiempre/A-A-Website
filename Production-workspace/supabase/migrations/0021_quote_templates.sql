-- Migration 2 (partial): Quote templates for F-04 Quick Quote Templates

create or replace function public.current_user_role()
returns text
language sql
stable
as $$
  select role::text
  from public.profiles
  where id = auth.uid()
  limit 1;
$$;

create table if not exists public.quote_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  service_type text not null,
  default_line_items jsonb not null default '[]'::jsonb,
  base_price numeric(12,2) not null default 0,
  pricing_model text not null default 'flat' check (pricing_model in ('flat', 'per_sqft', 'per_unit', 'per_hour')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_quote_templates_service_type
  on public.quote_templates(service_type, created_at desc);

alter table public.quote_templates enable row level security;

drop policy if exists "admin_all_quote_templates" on public.quote_templates;
create policy "admin_all_quote_templates"
on public.quote_templates for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

-- Seed baseline templates only when table is empty.
insert into public.quote_templates (name, service_type, default_line_items, base_price, pricing_model)
select
  seed.name,
  seed.service_type,
  seed.default_line_items,
  seed.base_price,
  seed.pricing_model
from (
  values
    (
      'Standard Office Clean',
      'commercial_cleaning',
      '[{"description":"Standard office clean","quantity":1,"unit":"flat","unit_price":325}]'::jsonb,
      325,
      'flat'
    ),
    (
      'Post-Construction Per Sq Ft',
      'post_construction_cleaning',
      '[{"description":"Post-construction cleaning","quantity":1200,"unit":"sqft","unit_price":0.22}]'::jsonb,
      264,
      'per_sqft'
    ),
    (
      'Commercial Deep Clean',
      'commercial_cleaning',
      '[{"description":"Commercial deep clean","quantity":1,"unit":"flat","unit_price":650}]'::jsonb,
      650,
      'flat'
    ),
    (
      'Recurring Weekly Package',
      'commercial_cleaning',
      '[{"description":"Recurring weekly cleaning","quantity":1,"unit":"unit","unit_price":450}]'::jsonb,
      450,
      'per_unit'
    )
) as seed(name, service_type, default_line_items, base_price, pricing_model)
where not exists (select 1 from public.quote_templates limit 1);
