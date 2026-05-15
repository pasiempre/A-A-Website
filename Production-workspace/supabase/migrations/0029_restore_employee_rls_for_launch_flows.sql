-- Migration: 0029_restore_employee_rls_for_launch_flows.sql
-- Purpose: Restore employee browser-client RLS paths required by the launch E2E guide.
-- Context: 0028 restored admin/service-role coverage for launch tables, but employee
--          checklist, message, issue, and inventory usage flows write directly through
--          the browser Supabase client and need assigned-job scoped policies.

ALTER TABLE public.job_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_reports ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'job_checklist_items'
      AND policyname = 'employee_select_assigned_job_checklist_items'
  ) THEN
    CREATE POLICY employee_select_assigned_job_checklist_items
      ON public.job_checklist_items
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.job_assignments ja
          WHERE ja.job_id = job_checklist_items.job_id
            AND ja.employee_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'job_checklist_items'
      AND policyname = 'employee_update_assigned_job_checklist_items'
  ) THEN
    CREATE POLICY employee_update_assigned_job_checklist_items
      ON public.job_checklist_items
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.job_assignments ja
          WHERE ja.job_id = job_checklist_items.job_id
            AND ja.employee_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.job_assignments ja
          WHERE ja.job_id = job_checklist_items.job_id
            AND ja.employee_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'job_messages'
      AND policyname = 'employee_select_assigned_job_messages'
  ) THEN
    CREATE POLICY employee_select_assigned_job_messages
      ON public.job_messages
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.job_assignments ja
          WHERE ja.job_id = job_messages.job_id
            AND ja.employee_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'job_messages'
      AND policyname = 'employee_insert_assigned_job_messages'
  ) THEN
    CREATE POLICY employee_insert_assigned_job_messages
      ON public.job_messages
      FOR INSERT
      TO authenticated
      WITH CHECK (
        sender_id = auth.uid()
        AND EXISTS (
          SELECT 1
          FROM public.job_assignments ja
          WHERE ja.job_id = job_messages.job_id
            AND ja.employee_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'issue_reports'
      AND policyname = 'employee_select_assigned_issue_reports'
  ) THEN
    CREATE POLICY employee_select_assigned_issue_reports
      ON public.issue_reports
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.job_assignments ja
          WHERE ja.job_id = issue_reports.job_id
            AND ja.employee_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'issue_reports'
      AND policyname = 'employee_insert_assigned_issue_reports'
  ) THEN
    CREATE POLICY employee_insert_assigned_issue_reports
      ON public.issue_reports
      FOR INSERT
      TO authenticated
      WITH CHECK (
        reported_by = auth.uid()
        AND EXISTS (
          SELECT 1
          FROM public.job_assignments ja
          WHERE ja.job_id = issue_reports.job_id
            AND ja.employee_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.supply_usage_logs') IS NULL THEN
    CREATE TABLE public.supply_usage_logs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      job_id uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
      supply_id uuid NOT NULL REFERENCES public.supplies(id) ON DELETE CASCADE,
      quantity_used numeric(12,2) NOT NULL,
      logged_by uuid REFERENCES public.profiles(id),
      logged_at timestamptz NOT NULL DEFAULT now(),
      notes text
    );
  END IF;
END $$;

ALTER TABLE public.supply_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_supply_usage_logs_supply_logged
  ON public.supply_usage_logs(supply_id, logged_at DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'supply_usage_logs'
      AND policyname = 'admin_all_supply_usage_logs'
  ) THEN
    CREATE POLICY admin_all_supply_usage_logs
      ON public.supply_usage_logs
      FOR ALL
      TO authenticated
      USING (public.current_user_role() IN ('admin', 'owner'))
      WITH CHECK (public.current_user_role() IN ('admin', 'owner'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'supply_usage_logs'
      AND policyname = 'employee_insert_supply_usage_logs'
  ) THEN
    CREATE POLICY employee_insert_supply_usage_logs
      ON public.supply_usage_logs
      FOR INSERT
      TO authenticated
      WITH CHECK (
        logged_by = auth.uid()
        AND (
          job_id IS NULL
          OR EXISTS (
            SELECT 1
            FROM public.job_assignments ja
            WHERE ja.job_id = supply_usage_logs.job_id
              AND ja.employee_id = auth.uid()
          )
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'supply_usage_logs'
      AND policyname = 'employee_select_own_supply_usage_logs'
  ) THEN
    CREATE POLICY employee_select_own_supply_usage_logs
      ON public.supply_usage_logs
      FOR SELECT
      TO authenticated
      USING (logged_by = auth.uid());
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
