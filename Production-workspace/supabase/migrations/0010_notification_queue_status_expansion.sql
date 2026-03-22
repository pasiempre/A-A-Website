-- Expand allowed status values for notification_dispatch_queue to support
-- dedup and dead-letter outcomes used by the dispatch API.

ALTER TABLE public.notification_dispatch_queue
  DROP CONSTRAINT IF EXISTS notification_dispatch_queue_status_check;

ALTER TABLE public.notification_dispatch_queue
  ADD CONSTRAINT notification_dispatch_queue_status_check
  CHECK (
    status IN (
      'queued',
      'pending',
      'sent',
      'failed',
      'permanently_failed',
      'deduped'
    )
  );
