-- Restore runtime columns expected by the admin scheduling, notification,
-- and first-run configuration screens.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notification_preferences jsonb NOT NULL DEFAULT jsonb_build_object(
    'quiet_hours_start', '21:00',
    'quiet_hours_end', '07:00',
    'batch_job_notifications', true,
    'sms_enabled', true,
    'email_enabled', false,
    'notification_summary_time', '06:00',
    'timezone', 'America/Chicago'
  ),
  ADD COLUMN IF NOT EXISTS first_run_completed_at timestamptz;

ALTER TABLE public.employee_availability
  ADD COLUMN IF NOT EXISTS starts_at timestamptz,
  ADD COLUMN IF NOT EXISTS ends_at timestamptz,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'available',
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

UPDATE public.employee_availability
SET
  starts_at = ((date::text || ' ' || start_time::text)::timestamp AT TIME ZONE 'America/Chicago'),
  ends_at = ((date::text || ' ' || end_time::text)::timestamp AT TIME ZONE 'America/Chicago'),
  status = CASE
    WHEN type IN ('available', 'unavailable') THEN type
    WHEN type IN ('time_off', 'sick') THEN 'unavailable'
    ELSE 'available'
  END
WHERE starts_at IS NULL
  AND ends_at IS NULL
  AND date IS NOT NULL
  AND start_time IS NOT NULL
  AND end_time IS NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'employee_availability_status_check'
      AND conrelid = 'public.employee_availability'::regclass
  ) THEN
    ALTER TABLE public.employee_availability
      ADD CONSTRAINT employee_availability_status_check
      CHECK (status IN ('available', 'unavailable', 'limited'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_employee_availability_employee_time
  ON public.employee_availability(employee_id, starts_at, ends_at);

DROP TRIGGER IF EXISTS trg_employee_availability_updated_at ON public.employee_availability;
CREATE TRIGGER trg_employee_availability_updated_at
  BEFORE UPDATE ON public.employee_availability
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

NOTIFY pgrst, 'reload schema';
