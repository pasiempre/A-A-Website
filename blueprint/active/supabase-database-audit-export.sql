-- Supabase database audit export
-- Run this in the Supabase SQL Editor for project ktqufntwzeumhcnjiqcd.
-- It is read-only and returns one JSON object with schema, RLS, functions,
-- indexes, constraints, triggers, enum values, storage buckets, and row estimates.
--
-- Copy the JSON result back into Codex for a deeper database quality review.

with
tables as (
  select
    n.nspname as schema_name,
    c.relname as table_name,
    c.relkind,
    c.relrowsecurity as rls_enabled,
    c.relforcerowsecurity as rls_forced,
    coalesce(s.n_live_tup, 0) as estimated_live_rows,
    obj_description(c.oid, 'pg_class') as comment
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  left join pg_stat_all_tables s on s.relid = c.oid
  where n.nspname in ('public', 'auth', 'storage')
    and c.relkind in ('r', 'p', 'v', 'm')
),
columns as (
  select
    table_schema,
    table_name,
    column_name,
    ordinal_position,
    data_type,
    udt_schema,
    udt_name,
    is_nullable,
    column_default,
    character_maximum_length,
    numeric_precision,
    numeric_scale
  from information_schema.columns
  where table_schema in ('public', 'auth', 'storage')
),
constraints as (
  select
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_schema as foreign_table_schema,
    ccu.table_name as foreign_table_name,
    ccu.column_name as foreign_column_name
  from information_schema.table_constraints tc
  left join information_schema.key_column_usage kcu
    on kcu.constraint_schema = tc.constraint_schema
   and kcu.constraint_name = tc.constraint_name
  left join information_schema.constraint_column_usage ccu
    on ccu.constraint_schema = tc.constraint_schema
   and ccu.constraint_name = tc.constraint_name
  where tc.table_schema in ('public', 'auth', 'storage')
),
indexes as (
  select
    schemaname,
    tablename,
    indexname,
    indexdef
  from pg_indexes
  where schemaname in ('public', 'auth', 'storage')
),
policies as (
  select
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
  from pg_policies
  where schemaname in ('public', 'auth', 'storage')
),
functions as (
  select
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as identity_arguments,
    pg_get_function_result(p.oid) as result_type,
    l.lanname as language,
    p.prosecdef as security_definer,
    p.provolatile as volatility,
    pg_get_functiondef(p.oid) as definition
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  join pg_language l on l.oid = p.prolang
  where n.nspname in ('public', 'auth', 'storage')
),
triggers as (
  select
    event_object_schema as table_schema,
    event_object_table as table_name,
    trigger_name,
    action_timing,
    event_manipulation,
    action_statement
  from information_schema.triggers
  where event_object_schema in ('public', 'auth', 'storage')
),
enums as (
  select
    n.nspname as schema_name,
    t.typname as enum_name,
    e.enumlabel as enum_value,
    e.enumsortorder
  from pg_type t
  join pg_enum e on e.enumtypid = t.oid
  join pg_namespace n on n.oid = t.typnamespace
  where n.nspname in ('public', 'auth', 'storage')
),
extensions as (
  select
    extname,
    extversion,
    n.nspname as schema_name
  from pg_extension e
  join pg_namespace n on n.oid = e.extnamespace
),
storage_buckets as (
  select
    id,
    name,
    owner,
    public,
    file_size_limit,
    allowed_mime_types,
    created_at,
    updated_at
  from storage.buckets
)
select jsonb_pretty(
  jsonb_build_object(
    'exported_at', now(),
    'project_ref', 'ktqufntwzeumhcnjiqcd',
    'tables', (select coalesce(jsonb_agg(to_jsonb(t) order by schema_name, table_name), '[]'::jsonb) from tables t),
    'columns', (select coalesce(jsonb_agg(to_jsonb(c) order by table_schema, table_name, ordinal_position), '[]'::jsonb) from columns c),
    'constraints', (select coalesce(jsonb_agg(to_jsonb(c) order by table_schema, table_name, constraint_name, column_name), '[]'::jsonb) from constraints c),
    'indexes', (select coalesce(jsonb_agg(to_jsonb(i) order by schemaname, tablename, indexname), '[]'::jsonb) from indexes i),
    'policies', (select coalesce(jsonb_agg(to_jsonb(p) order by schemaname, tablename, policyname), '[]'::jsonb) from policies p),
    'functions', (select coalesce(jsonb_agg(to_jsonb(f) order by schema_name, function_name, identity_arguments), '[]'::jsonb) from functions f),
    'triggers', (select coalesce(jsonb_agg(to_jsonb(t) order by table_schema, table_name, trigger_name), '[]'::jsonb) from triggers t),
    'enums', (select coalesce(jsonb_agg(to_jsonb(e) order by schema_name, enum_name, enumsortorder), '[]'::jsonb) from enums e),
    'extensions', (select coalesce(jsonb_agg(to_jsonb(e) order by extname), '[]'::jsonb) from extensions e),
    'storage_buckets', (select coalesce(jsonb_agg(to_jsonb(b) order by id), '[]'::jsonb) from storage_buckets b)
  )
) as database_audit_export;
