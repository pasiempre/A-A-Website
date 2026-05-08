-- 0028_restore_schema_parity_for_launch.sql
-- Purpose: repair restored/partial Supabase databases to the schema shape expected
-- by the current app before launch E2E seeding.
--
-- This is intentionally a forward, idempotent migration. The project has both an
-- early MVP migration history and a later remote-repair bootstrap history. Current
-- restored DBs follow the later profiles.role TEXT shape, so this migration avoids
-- depending on the older public.app_role enum for profile roles.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'clean_type') THEN
    CREATE TYPE public.clean_type AS ENUM (
      'post_construction',
      'final_clean',
      'rough_clean',
      'move_in_out',
      'window',
      'power_wash',
      'commercial',
      'general',
      'custom'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_priority') THEN
    CREATE TYPE public.job_priority AS ENUM ('normal', 'urgent', 'rush');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'qa_status') THEN
    CREATE TYPE public.qa_status AS ENUM ('pending', 'approved', 'flagged', 'needs_rework');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assignment_role') THEN
    CREATE TYPE public.assignment_role AS ENUM ('lead', 'member');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assignment_status') THEN
    CREATE TYPE public.assignment_status AS ENUM ('assigned', 'en_route', 'in_progress', 'complete');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'issue_status') THEN
    CREATE TYPE public.issue_status AS ENUM ('open', 'acknowledged', 'resolved');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT role::text
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
$$;

CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company_name text,
  email text,
  phone text,
  notes text,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS timeline text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS converted_client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS square_footage_estimate integer,
  ADD COLUMN IF NOT EXISTS site_ready boolean,
  ADD COLUMN IF NOT EXISTS first_alert_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS second_alert_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS third_alert_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS contacted_at timestamptz,
  ADD COLUMN IF NOT EXISTS converted_at timestamptz;

CREATE TABLE IF NOT EXISTS public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  quote_number text,
  status text NOT NULL DEFAULT 'draft',
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  notes text,
  site_address text,
  scope_description text,
  valid_until date,
  sent_at timestamptz,
  viewed_at timestamptz,
  responded_at timestamptz,
  quickbooks_estimate_id text,
  public_token text,
  recipient_email text,
  delivery_status text NOT NULL DEFAULT 'pending'
    CHECK (delivery_status IN ('pending', 'sent', 'share_link_only', 'failed')),
  delivery_error text,
  accepted_at timestamptz,
  declined_at timestamptz,
  accepted_by_name text,
  accepted_by_email text,
  response_notes text,
  pdf_generated_at timestamptz,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS quote_number text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS subtotal numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS site_address text,
  ADD COLUMN IF NOT EXISTS scope_description text,
  ADD COLUMN IF NOT EXISTS valid_until date,
  ADD COLUMN IF NOT EXISTS sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS viewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS responded_at timestamptz,
  ADD COLUMN IF NOT EXISTS quickbooks_estimate_id text,
  ADD COLUMN IF NOT EXISTS public_token text,
  ADD COLUMN IF NOT EXISTS recipient_email text,
  ADD COLUMN IF NOT EXISTS delivery_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS delivery_error text,
  ADD COLUMN IF NOT EXISTS accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS declined_at timestamptz,
  ADD COLUMN IF NOT EXISTS accepted_by_name text,
  ADD COLUMN IF NOT EXISTS accepted_by_email text,
  ADD COLUMN IF NOT EXISTS response_notes text,
  ADD COLUMN IF NOT EXISTS pdf_generated_at timestamptz,
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS idx_quotes_quote_number_unique
  ON public.quotes(quote_number)
  WHERE quote_number IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_quotes_public_token_unique
  ON public.quotes(public_token)
  WHERE public_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_quotes_lead_status_created
  ON public.quotes(lead_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.quote_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric(12,2) NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'flat',
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  line_total numeric(12,2) NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS quote_id uuid REFERENCES public.quotes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS contact_name text,
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS scope text,
  ADD COLUMN IF NOT EXISTS scheduled_start timestamptz,
  ADD COLUMN IF NOT EXISTS scheduled_end timestamptz,
  ADD COLUMN IF NOT EXISTS clean_type public.clean_type NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS priority public.job_priority NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS qa_notes text,
  ADD COLUMN IF NOT EXISTS qa_reviewed_by uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS qa_reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS areas text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS assigned_week_start date,
  ADD COLUMN IF NOT EXISTS duplicate_source_job_id uuid REFERENCES public.jobs(id),
  ADD COLUMN IF NOT EXISTS checklist_template_id uuid,
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'jobs_checklist_template_id_fkey'
  ) AND to_regclass('public.checklist_templates') IS NOT NULL THEN
    ALTER TABLE public.jobs
      ADD CONSTRAINT jobs_checklist_template_id_fkey
      FOREIGN KEY (checklist_template_id)
      REFERENCES public.checklist_templates(id)
      ON DELETE SET NULL;
  END IF;
END $$;

ALTER TABLE public.job_assignments
  ADD COLUMN IF NOT EXISTS assigned_by uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS assigned_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS role public.assignment_role NOT NULL DEFAULT 'member',
  ADD COLUMN IF NOT EXISTS status public.assignment_status NOT NULL DEFAULT 'assigned',
  ADD COLUMN IF NOT EXISTS started_at timestamptz,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS notification_status text NOT NULL DEFAULT 'pending'
    CHECK (notification_status IN ('pending', 'queued', 'sent', 'failed', 'skipped')),
  ADD COLUMN IF NOT EXISTS notification_error text,
  ADD COLUMN IF NOT EXISTS notified_at timestamptz;

CREATE TABLE IF NOT EXISTS public.checklist_template_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES public.checklist_templates(id) ON DELETE CASCADE,
  item_text text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.job_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  item_text text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  completed_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, item_text)
);

CREATE TABLE IF NOT EXISTS public.job_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message_text text NOT NULL,
  photo_path text,
  is_internal boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.issue_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  reported_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  description text NOT NULL,
  photo_path text,
  status public.issue_status NOT NULL DEFAULT 'open',
  resolution_notes text,
  resolved_by uuid REFERENCES public.profiles(id),
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.completion_reports
  ADD COLUMN IF NOT EXISTS invoice_status text,
  ADD COLUMN IF NOT EXISTS qb_invoice_id text,
  ADD COLUMN IF NOT EXISTS qb_invoice_number text,
  ADD COLUMN IF NOT EXISTS invoiced_at timestamptz,
  ADD COLUMN IF NOT EXISTS line_items jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS total_amount numeric(12,2) DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.supplies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('chemical', 'tool', 'consumable')),
  unit text NOT NULL,
  current_stock numeric(12,2) NOT NULL DEFAULT 0,
  reorder_threshold numeric(12,2) NOT NULL DEFAULT 0,
  cost_per_unit numeric(12,2) NOT NULL DEFAULT 0,
  preferred_vendor text,
  purchase_link text,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.supply_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  supply_id uuid REFERENCES public.supplies(id) ON DELETE SET NULL,
  quantity_needed numeric(12,2) NOT NULL,
  site_address text,
  urgency text NOT NULL DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent')),
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'delivered', 'rejected')),
  notes text,
  reviewed_by uuid REFERENCES public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quickbooks_invoice_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quickbooks_invoice_id text NOT NULL UNIQUE,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  job_id uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  status text NOT NULL,
  amount_total numeric(14,2) NOT NULL DEFAULT 0,
  amount_due numeric(14,2) NOT NULL DEFAULT 0,
  issue_date date,
  due_date date,
  paid_at timestamptz,
  raw_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clients_company_name ON public.clients(company_name);
CREATE INDEX IF NOT EXISTS idx_quote_line_items_quote_sort ON public.quote_line_items(quote_id, sort_order, created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_status_scheduled_start ON public.jobs(status, scheduled_start);
CREATE INDEX IF NOT EXISTS idx_jobs_clean_type_status ON public.jobs(clean_type, status);
CREATE INDEX IF NOT EXISTS idx_jobs_week_priority ON public.jobs(assigned_week_start, priority);
CREATE INDEX IF NOT EXISTS idx_job_assignments_employee_id ON public.job_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_job_assignments_notification_status ON public.job_assignments(notification_status, assigned_at DESC);
CREATE INDEX IF NOT EXISTS idx_checklist_template_items_template ON public.checklist_template_items(template_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_job_checklist_items_job ON public.job_checklist_items(job_id, sort_order, is_completed);
CREATE INDEX IF NOT EXISTS idx_job_messages_job_created ON public.job_messages(job_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issue_reports_job_status ON public.issue_reports(job_id, status);
CREATE INDEX IF NOT EXISTS idx_supplies_active_category ON public.supplies(is_active, category);
CREATE INDEX IF NOT EXISTS idx_supply_requests_status_created ON public.supply_requests(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quickbooks_invoice_cache_status_due ON public.quickbooks_invoice_cache(status, due_date);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_template_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quickbooks_invoice_cache ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  policy_table text;
  policy_name text;
BEGIN
  FOREACH policy_table IN ARRAY ARRAY[
    'clients',
    'quotes',
    'quote_line_items',
    'checklist_template_items',
    'job_checklist_items',
    'job_messages',
    'issue_reports',
    'supplies',
    'supply_requests',
    'quickbooks_invoice_cache'
  ]
  LOOP
    policy_name := 'admin_all_' || policy_table;
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = policy_table
        AND policyname = policy_name
    ) THEN
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.current_user_role() IN (''admin'', ''owner'')) WITH CHECK (public.current_user_role() IN (''admin'', ''owner''))',
        policy_name,
        policy_table
      );
    END IF;
  END LOOP;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'supplies'
      AND policyname = 'employee_select_supplies'
  ) THEN
    CREATE POLICY employee_select_supplies
      ON public.supplies FOR SELECT TO authenticated
      USING (is_active = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'supply_requests'
      AND policyname = 'employee_insert_own_supply_requests'
  ) THEN
    CREATE POLICY employee_insert_own_supply_requests
      ON public.supply_requests FOR INSERT TO authenticated
      WITH CHECK (requested_by = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'supply_requests'
      AND policyname = 'employee_select_own_supply_requests'
  ) THEN
    CREATE POLICY employee_select_own_supply_requests
      ON public.supply_requests FOR SELECT TO authenticated
      USING (requested_by = auth.uid());
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public)
VALUES ('job-photos', 'job-photos', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('job-photos-spike', 'job-photos-spike', false)
ON CONFLICT (id) DO NOTHING;

NOTIFY pgrst, 'reload schema';
