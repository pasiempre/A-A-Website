-- ============================================================
-- Migration 0019: Enable RLS + policies for completion_reports
-- and notification_dispatch_queue
-- ============================================================

-- 1) completion_reports
ALTER TABLE public.completion_reports ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'completion_reports'
      AND policyname = 'completion_reports_admin_all'
  ) THEN
    CREATE POLICY completion_reports_admin_all
      ON public.completion_reports
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'owner')
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'owner')
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'completion_reports'
      AND policyname = 'completion_reports_employee_read_own'
  ) THEN
    CREATE POLICY completion_reports_employee_read_own
      ON public.completion_reports
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.job_assignments ja
          WHERE ja.job_id = completion_reports.job_id
            AND ja.employee_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'completion_reports'
      AND policyname = 'completion_reports_service_role_all'
  ) THEN
    CREATE POLICY completion_reports_service_role_all
      ON public.completion_reports
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;


-- 2) notification_dispatch_queue
ALTER TABLE public.notification_dispatch_queue ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'notification_dispatch_queue'
      AND policyname = 'ndq_admin_all'
  ) THEN
    CREATE POLICY ndq_admin_all
      ON public.notification_dispatch_queue
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'owner')
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'owner')
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'notification_dispatch_queue'
      AND policyname = 'ndq_employee_read_own'
  ) THEN
    CREATE POLICY ndq_employee_read_own
      ON public.notification_dispatch_queue
      FOR SELECT
      TO authenticated
      USING (profile_id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'notification_dispatch_queue'
      AND policyname = 'ndq_service_role_all'
  ) THEN
    CREATE POLICY ndq_service_role_all
      ON public.notification_dispatch_queue
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;


-- 3) verification
DO $$
DECLARE
  _tables_without_rls TEXT[];
BEGIN
  SELECT array_agg(tablename::text)
  INTO _tables_without_rls
  FROM pg_tables
  WHERE schemaname = 'public'
    AND rowsecurity = false;

  IF _tables_without_rls IS NOT NULL AND array_length(_tables_without_rls, 1) > 0 THEN
    RAISE WARNING '[0019] Tables still without RLS: %', array_to_string(_tables_without_rls, ', ');
  ELSE
    RAISE NOTICE '[0019] ✓ All public tables have RLS enabled.';
  END IF;
END $$;
