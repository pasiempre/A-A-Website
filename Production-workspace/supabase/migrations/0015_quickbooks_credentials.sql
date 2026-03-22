-- Migration: 0015_quickbooks_credentials.sql
-- Purpose: Secure storage for QuickBooks OAuth tokens with application-layer encryption
-- Depends on: 0014_assignment_notification_log.sql

-- QuickBooks OAuth credential storage
-- access_token and refresh_token are AES-256-GCM encrypted at the application layer
CREATE TABLE IF NOT EXISTS quickbooks_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  realm_id TEXT NOT NULL UNIQUE,
  company_name TEXT,

  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT NOT NULL,

  access_token_expires_at TIMESTAMPTZ NOT NULL,
  refresh_token_expires_at TIMESTAMPTZ NOT NULL,

  scope TEXT NOT NULL DEFAULT 'com.intuit.quickbooks.accounting',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  last_sync_error TEXT,

  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qb_credentials_realm_active
  ON quickbooks_credentials (realm_id) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_qb_credentials_token_expiry
  ON quickbooks_credentials (access_token_expires_at) WHERE is_active = true;

CREATE OR REPLACE FUNCTION update_qb_credentials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_qb_credentials_updated_at ON quickbooks_credentials;
CREATE TRIGGER trg_qb_credentials_updated_at
  BEFORE UPDATE ON quickbooks_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_qb_credentials_updated_at();

ALTER TABLE quickbooks_credentials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_role_full_access ON quickbooks_credentials;
CREATE POLICY service_role_full_access
  ON quickbooks_credentials
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    DROP POLICY IF EXISTS admin_read_metadata ON quickbooks_credentials;
    CREATE POLICY admin_read_metadata
      ON quickbooks_credentials
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS quickbooks_sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'queued',
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  next_retry_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_qb_sync_queue_status
  ON quickbooks_sync_queue (status, next_retry_at)
  WHERE status IN ('queued', 'retrying');

ALTER TABLE quickbooks_sync_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_role_sync_queue ON quickbooks_sync_queue;
CREATE POLICY service_role_sync_queue
  ON quickbooks_sync_queue
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS financial_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_revenue NUMERIC(12,2) DEFAULT 0,
  outstanding_invoices NUMERIC(12,2) DEFAULT 0,
  overdue_invoices NUMERIC(12,2) DEFAULT 0,
  paid_invoices NUMERIC(12,2) DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'manual',
  source_payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(period_start, period_end, source)
);

ALTER TABLE financial_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_role_financial_snapshots ON financial_snapshots;
CREATE POLICY service_role_financial_snapshots
  ON financial_snapshots
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    DROP POLICY IF EXISTS admin_read_financial_snapshots ON financial_snapshots;
    CREATE POLICY admin_read_financial_snapshots
      ON financial_snapshots
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;