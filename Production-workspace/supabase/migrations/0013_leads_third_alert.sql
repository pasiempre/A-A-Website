-- Migration: 0013_leads_third_alert
-- Purpose: Support 24h escalation tier in lead follow-up alerts
-- Depends on: 0012_employment_applications

DO $$
BEGIN
  IF to_regclass('public.leads') IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'leads' AND column_name = 'third_alert_sent_at'
    ) THEN
      ALTER TABLE leads ADD COLUMN third_alert_sent_at timestamptz;
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.leads') IS NOT NULL THEN
    CREATE INDEX IF NOT EXISTS idx_leads_third_alert_pending
      ON leads (status, third_alert_sent_at, created_at)
      WHERE status = 'new' AND third_alert_sent_at IS NULL;

    CREATE INDEX IF NOT EXISTS idx_leads_first_alert_pending
      ON leads (status, first_alert_sent_at, created_at)
      WHERE status = 'new' AND first_alert_sent_at IS NULL;

    CREATE INDEX IF NOT EXISTS idx_leads_second_alert_pending
      ON leads (status, second_alert_sent_at, created_at)
      WHERE status = 'new' AND second_alert_sent_at IS NULL;
  END IF;
END $$;
