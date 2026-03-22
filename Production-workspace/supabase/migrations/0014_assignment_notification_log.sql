-- Migration: 0014_assignment_notification_log
-- Purpose: Audit assignment notification events and delivery outcomes
-- Depends on: 0013_leads_third_alert

DO $$
BEGIN
  IF to_regclass('public.job_assignments') IS NOT NULL
    AND to_regclass('public.profiles') IS NOT NULL
    AND to_regclass('public.jobs') IS NOT NULL THEN
    CREATE TABLE IF NOT EXISTS assignment_notification_log (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      assignment_id uuid NOT NULL REFERENCES job_assignments(id) ON DELETE CASCADE,
      employee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      event_type text NOT NULL CHECK (event_type IN ('assigned', 'rescheduled', 'substituted', 'cancelled')),
      delivery_status text NOT NULL CHECK (delivery_status IN ('sent', 'queued', 'failed')),
      provider_sid text,
      delivery_error text,
      details jsonb,
      sent_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_assignment_notification_log_assignment
      ON assignment_notification_log (assignment_id, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_assignment_notification_log_employee
      ON assignment_notification_log (employee_id, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_assignment_notification_log_job
      ON assignment_notification_log (job_id, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_assignment_notification_log_event_status
      ON assignment_notification_log (event_type, delivery_status, created_at DESC);

    ALTER TABLE assignment_notification_log ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.assignment_notification_log') IS NOT NULL
    AND NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'assignment_notification_log'
      AND policyname = 'assignment_notification_log_admin_read'
  ) THEN
    CREATE POLICY assignment_notification_log_admin_read
      ON assignment_notification_log
      FOR SELECT
      TO authenticated
      USING (coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false));
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.assignment_notification_log') IS NOT NULL
    AND NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'assignment_notification_log'
      AND policyname = 'assignment_notification_log_service_write'
  ) THEN
    CREATE POLICY assignment_notification_log_service_write
      ON assignment_notification_log
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
