-- Migration: 0016_quickbooks_sync_mappings_and_audit.sql
-- Purpose: Sync mapping table (idempotency) + audit log for all QB write operations
-- Depends on: 0015_quickbooks_credentials.sql

CREATE TABLE IF NOT EXISTS quickbooks_sync_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  local_id TEXT NOT NULL,
  qb_id TEXT NOT NULL,
  qb_sync_token TEXT NOT NULL DEFAULT '0',
  sync_hash TEXT NOT NULL DEFAULT '',
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(entity_type, local_id)
);

CREATE INDEX IF NOT EXISTS idx_qb_sync_mappings_qb_id
  ON quickbooks_sync_mappings (entity_type, qb_id);

CREATE INDEX IF NOT EXISTS idx_qb_sync_mappings_entity_type
  ON quickbooks_sync_mappings (entity_type);

ALTER TABLE quickbooks_sync_mappings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_role_sync_mappings ON quickbooks_sync_mappings;
CREATE POLICY service_role_sync_mappings
  ON quickbooks_sync_mappings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    DROP POLICY IF EXISTS admin_read_sync_mappings ON quickbooks_sync_mappings;
    CREATE POLICY admin_read_sync_mappings
      ON quickbooks_sync_mappings
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

CREATE TABLE IF NOT EXISTS quickbooks_sync_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  qb_id TEXT,
  request_payload JSONB DEFAULT '{}'::jsonb,
  response_payload JSONB DEFAULT '{}'::jsonb,
  error TEXT,
  triggered_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qb_audit_entity
  ON quickbooks_sync_audit (entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_qb_audit_created
  ON quickbooks_sync_audit (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_qb_audit_errors
  ON quickbooks_sync_audit (created_at DESC)
  WHERE error IS NOT NULL;

ALTER TABLE quickbooks_sync_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_role_sync_audit ON quickbooks_sync_audit;
CREATE POLICY service_role_sync_audit
  ON quickbooks_sync_audit
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    DROP POLICY IF EXISTS admin_read_sync_audit ON quickbooks_sync_audit;
    CREATE POLICY admin_read_sync_audit
      ON quickbooks_sync_audit
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

CREATE OR REPLACE FUNCTION prune_qb_sync_audit()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM quickbooks_sync_audit
  WHERE created_at < now() - INTERVAL '90 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;