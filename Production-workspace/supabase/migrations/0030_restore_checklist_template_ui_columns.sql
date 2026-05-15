-- Migration: 0030_restore_checklist_template_ui_columns.sql
-- Purpose: Restore checklist template columns used by the admin Review & Approve UI.
-- Context: Restored databases that bootstrapped from 0018 have service_type/items but
--          may be missing the earlier Phase 2 locale/description columns.

ALTER TABLE public.checklist_templates
  ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'es',
  ADD COLUMN IF NOT EXISTS description text;

UPDATE public.checklist_templates
SET locale = 'es'
WHERE locale IS NULL;

NOTIFY pgrst, 'reload schema';
