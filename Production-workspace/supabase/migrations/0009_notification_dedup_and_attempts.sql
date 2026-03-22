-- Add dedup and retry tracking to notification_dispatch_queue
-- This migration is defensive: if an environment is missing the queue table,
-- it creates it first so the column/index changes can still apply.

CREATE TABLE IF NOT EXISTS public.notification_dispatch_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid,
  to_phone text NOT NULL,
  body text NOT NULL,
  send_after timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'pending', 'sent', 'failed')),
  queued_reason text,
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  provider_sid text,
  sent_at timestamptz,
  error_text text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL
    AND NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'notification_dispatch_queue_profile_id_fkey'
    )
  THEN
    ALTER TABLE public.notification_dispatch_queue
      ADD CONSTRAINT notification_dispatch_queue_profile_id_fkey
      FOREIGN KEY (profile_id)
      REFERENCES public.profiles(id)
      ON DELETE SET NULL;
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_notification_dispatch_queue_status_send_after
  ON public.notification_dispatch_queue(status, send_after);

ALTER TABLE public.notification_dispatch_queue
  ADD COLUMN IF NOT EXISTS dedup_key text,
  ADD COLUMN IF NOT EXISTS attempts integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_notification_dispatch_queue_dedup
  ON public.notification_dispatch_queue (dedup_key, created_at)
  WHERE status IN ('sent', 'queued', 'pending');
