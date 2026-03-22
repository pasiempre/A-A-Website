-- Migration: 0017_completion_reports_invoice_fields.sql
-- Purpose: Add QB invoice tracking fields to completion_reports
-- Depends on: 0016_quickbooks_sync_mappings_and_audit.sql

ALTER TABLE completion_reports
  ADD COLUMN IF NOT EXISTS qb_invoice_id TEXT,
  ADD COLUMN IF NOT EXISTS qb_invoice_number TEXT,
  ADD COLUMN IF NOT EXISTS invoiced_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'completion_reports'
    AND column_name = 'line_items'
  ) THEN
    ALTER TABLE completion_reports ADD COLUMN line_items JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'completion_reports'
    AND column_name = 'total_amount'
  ) THEN
    ALTER TABLE completion_reports ADD COLUMN total_amount NUMERIC(12,2) DEFAULT 0;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_completion_reports_uninvoiced
  ON completion_reports (created_at)
  WHERE qb_invoice_id IS NULL
    AND total_amount IS NOT NULL
    AND total_amount > 0;

CREATE INDEX IF NOT EXISTS idx_completion_reports_qb_invoice
  ON completion_reports (qb_invoice_id)
  WHERE qb_invoice_id IS NOT NULL;