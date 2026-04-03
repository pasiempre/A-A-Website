-- Migration 1: Lead Lifecycle Fields (F-01, F-03, F-12)

-- 1. Add fields to leads table for F-03 (Lead aging) and tracking
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz DEFAULT NULL,
ADD COLUMN IF NOT EXISTS followup_reminder_count integer DEFAULT 0;

-- 2. Add scheduled_start to job_assignments (F-12)
-- Note: jobs table has scheduled_date and scheduled_time, 
-- but F-12 specifies putting it on assignments for better operational sorting.
ALTER TABLE public.job_assignments
ADD COLUMN IF NOT EXISTS scheduled_start timestamptz DEFAULT NULL;

-- 3. Ensure source field exists (already in DB-SCHEMA-SUMMARY.md, but being safe)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='source') THEN
    ALTER TABLE public.leads ADD COLUMN source text DEFAULT NULL;
  END IF;
END $$;

-- 4. Enable RLS on the new columns if necessary (usually inherited)
-- No additional RLS policies needed for simple column additions.
