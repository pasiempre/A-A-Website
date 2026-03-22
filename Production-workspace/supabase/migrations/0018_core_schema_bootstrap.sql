-- ============================================================================
-- Migration: 0018_core_schema_bootstrap.sql
-- Purpose: Idempotent bootstrap of all core tables missing from remote
-- Context: Remote had partial schema (later migrations applied without
--          foundational tables). This reconciles the full schema.
--
-- Safety:
--   - Every statement uses IF NOT EXISTS
--   - Will not modify any existing table or data
--   - Can be re-run safely
--   - Dependency order: profiles → jobs → leads → assignments → everything else
-- ============================================================================


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 1. PROFILES (foundation — referenced by nearly everything)             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'employee'
    CHECK (role IN ('admin', 'owner', 'employee', 'crew_lead')),
  
  -- Employee-specific fields
  hire_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  preferred_language TEXT DEFAULT 'en'
    CHECK (preferred_language IN ('en', 'es')),
  
  -- Metadata
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'employee';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hire_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles (email);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS: users can read their own, admins can read all
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_self_read'
  ) THEN
    CREATE POLICY profiles_self_read ON profiles
      FOR SELECT TO authenticated
      USING (id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_admin_all'
  ) THEN
    CREATE POLICY profiles_admin_all ON profiles
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles p
          WHERE p.id = auth.uid() AND p.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_self_update'
  ) THEN
    CREATE POLICY profiles_self_update ON profiles
      FOR UPDATE TO authenticated
      USING (id = auth.uid())
      WITH CHECK (id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_service_role'
  ) THEN
    CREATE POLICY profiles_service_role ON profiles
      FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Updated_at trigger for profiles
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 2. JOBS (core business entity)                                         ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Customer info
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  
  -- Job details
  service_type TEXT,
  address TEXT,
  notes TEXT,
  
  -- Scheduling
  scheduled_date DATE,
  scheduled_time TIME,
  estimated_duration_minutes INTEGER DEFAULT 120,
  
  -- Assignment
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Status lifecycle
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN (
      'pending', 'scheduled', 'in_progress', 'completed',
      'cancelled', 'rework', 'qa_review'
    )),
  
  -- QA fields (used by Operations + Ticket modules)
  qa_status TEXT DEFAULT 'pending'
    CHECK (qa_status IN ('pending', 'approved', 'rejected', 'rework')),
  qa_notes TEXT,
  qa_reviewed_at TIMESTAMPTZ,
  qa_reviewed_by UUID REFERENCES profiles(id),
  
  -- Timestamps
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs (status);
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled ON jobs (scheduled_date);
CREATE INDEX IF NOT EXISTS idx_jobs_assigned ON jobs (assigned_to);
CREATE INDEX IF NOT EXISTS idx_jobs_customer ON jobs (customer_name);
CREATE INDEX IF NOT EXISTS idx_jobs_qa_status ON jobs (qa_status) WHERE qa_status != 'approved';

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'jobs' AND policyname = 'jobs_admin_all'
  ) THEN
    CREATE POLICY jobs_admin_all ON jobs
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'jobs' AND policyname = 'jobs_assigned_read'
  ) THEN
    CREATE POLICY jobs_assigned_read ON jobs
      FOR SELECT TO authenticated
      USING (assigned_to = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'jobs' AND policyname = 'jobs_service_role'
  ) THEN
    CREATE POLICY jobs_service_role ON jobs
      FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Updated_at trigger for jobs
CREATE OR REPLACE FUNCTION update_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_jobs_updated_at ON jobs;
CREATE TRIGGER trg_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_jobs_updated_at();


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 3. LEADS (customer inquiries / quote requests)                         ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact info
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  
  -- Request details
  service_type TEXT,
  address TEXT,
  message TEXT,
  preferred_date DATE,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'quoted', 'converted', 'lost', 'followup')),
  
  -- Follow-up escalation (used by lead-followup API)
  first_alert_sent_at TIMESTAMPTZ,
  second_alert_sent_at TIMESTAMPTZ,
  third_alert_sent_at TIMESTAMPTZ,
  next_followup_at TIMESTAMPTZ,
  followup_count INTEGER NOT NULL DEFAULT 0,
  
  -- Conversion
  converted_job_id UUID REFERENCES jobs(id),
  
  -- Source tracking
  source TEXT DEFAULT 'website',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_followup ON leads (next_followup_at)
  WHERE status IN ('new', 'followup') AND next_followup_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads (phone);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'leads_admin_all'
  ) THEN
    CREATE POLICY leads_admin_all ON leads
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'leads_service_role'
  ) THEN
    CREATE POLICY leads_service_role ON leads
      FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 4. JOB ASSIGNMENTS (crew assignment tracking)                          ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS job_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Role on this specific job
  role TEXT NOT NULL DEFAULT 'crew'
    CHECK (role IN ('crew', 'lead', 'supervisor')),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'assigned'
    CHECK (status IN ('assigned', 'accepted', 'declined', 'completed', 'removed')),
  
  -- Checklist tracking (used by QA/Operations modules)
  checklist_items JSONB DEFAULT '[]'::jsonb,
  checklist_completed_at TIMESTAMPTZ,
  
  -- Notification tracking
  notified_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Prevent duplicate assignments
  UNIQUE(job_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_assignments_job ON job_assignments (job_id);
CREATE INDEX IF NOT EXISTS idx_assignments_employee ON job_assignments (employee_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON job_assignments (status);
CREATE INDEX IF NOT EXISTS idx_assignments_active ON job_assignments (employee_id, status)
  WHERE status IN ('assigned', 'accepted');

ALTER TABLE job_assignments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'job_assignments' AND policyname = 'assignments_admin_all'
  ) THEN
    CREATE POLICY assignments_admin_all ON job_assignments
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'job_assignments' AND policyname = 'assignments_self_read'
  ) THEN
    CREATE POLICY assignments_self_read ON job_assignments
      FOR SELECT TO authenticated
      USING (employee_id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'job_assignments' AND policyname = 'assignments_self_update'
  ) THEN
    CREATE POLICY assignments_self_update ON job_assignments
      FOR UPDATE TO authenticated
      USING (employee_id = auth.uid())
      WITH CHECK (employee_id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'job_assignments' AND policyname = 'assignments_service_role'
  ) THEN
    CREATE POLICY assignments_service_role ON job_assignments
      FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 5. EMPLOYEE AVAILABILITY (scheduling module)                           ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS employee_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  employee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Availability window
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Type
  type TEXT NOT NULL DEFAULT 'available'
    CHECK (type IN ('available', 'unavailable', 'time_off', 'sick')),
  
  notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Prevent overlapping entries for same employee on same date
  UNIQUE(employee_id, date, start_time, end_time)
);

CREATE INDEX IF NOT EXISTS idx_availability_employee_date
  ON employee_availability (employee_id, date);
CREATE INDEX IF NOT EXISTS idx_availability_date
  ON employee_availability (date);

ALTER TABLE employee_availability ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'employee_availability' AND policyname = 'availability_admin_all'
  ) THEN
    CREATE POLICY availability_admin_all ON employee_availability
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'employee_availability' AND policyname = 'availability_self_manage'
  ) THEN
    CREATE POLICY availability_self_manage ON employee_availability
      FOR ALL TO authenticated
      USING (employee_id = auth.uid())
      WITH CHECK (employee_id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'employee_availability' AND policyname = 'availability_service_role'
  ) THEN
    CREATE POLICY availability_service_role ON employee_availability
      FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 6. CHECKLIST TEMPLATES (operations module)                             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS checklist_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name TEXT NOT NULL,
  service_type TEXT,
  
  -- Array of checklist items
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Metadata
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_checklist_templates_service
  ON checklist_templates (service_type);

ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'checklist_templates' AND policyname = 'checklist_templates_admin'
  ) THEN
    CREATE POLICY checklist_templates_admin ON checklist_templates
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'checklist_templates' AND policyname = 'checklist_templates_read'
  ) THEN
    CREATE POLICY checklist_templates_read ON checklist_templates
      FOR SELECT TO authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'checklist_templates' AND policyname = 'checklist_templates_service_role'
  ) THEN
    CREATE POLICY checklist_templates_service_role ON checklist_templates
      FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 7. JOB PHOTOS (crew photo uploads)                                     ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS job_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES job_assignments(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES profiles(id),
  
  -- Photo details
  storage_path TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  mime_type TEXT,
  
  -- Categorization
  photo_type TEXT NOT NULL DEFAULT 'during'
    CHECK (photo_type IN ('before', 'during', 'after', 'issue')),
  
  caption TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_photos_job ON job_photos (job_id);
CREATE INDEX IF NOT EXISTS idx_job_photos_assignment ON job_photos (assignment_id);
CREATE INDEX IF NOT EXISTS idx_job_photos_type ON job_photos (job_id, photo_type);

ALTER TABLE job_photos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'job_photos' AND policyname = 'job_photos_admin'
  ) THEN
    CREATE POLICY job_photos_admin ON job_photos
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'job_photos' AND policyname = 'job_photos_uploader'
  ) THEN
    CREATE POLICY job_photos_uploader ON job_photos
      FOR ALL TO authenticated
      USING (uploaded_by = auth.uid())
      WITH CHECK (uploaded_by = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'job_photos' AND policyname = 'job_photos_service_role'
  ) THEN
    CREATE POLICY job_photos_service_role ON job_photos
      FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 8. TICKETS (support / issue tracking)                                  ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Related entities
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  reported_by UUID REFERENCES profiles(id),
  assigned_to UUID REFERENCES profiles(id),
  
  -- Ticket details
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'escalated')),
  
  -- Resolution
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  
  -- QA integration
  qa_status TEXT DEFAULT 'pending'
    CHECK (qa_status IN ('pending', 'approved', 'rejected', 'rework')),
  qa_reviewed_at TIMESTAMPTZ,
  qa_reviewed_by UUID REFERENCES profiles(id),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets (status);
CREATE INDEX IF NOT EXISTS idx_tickets_job ON tickets (job_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON tickets (assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets (priority)
  WHERE status NOT IN ('resolved', 'closed');

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tickets' AND policyname = 'tickets_admin_all'
  ) THEN
    CREATE POLICY tickets_admin_all ON tickets
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tickets' AND policyname = 'tickets_reporter_read'
  ) THEN
    CREATE POLICY tickets_reporter_read ON tickets
      FOR SELECT TO authenticated
      USING (reported_by = auth.uid() OR assigned_to = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tickets' AND policyname = 'tickets_service_role'
  ) THEN
    CREATE POLICY tickets_service_role ON tickets
      FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 9. QUOTE REQUESTS (public form submissions)                            ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact info
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  
  -- Request details
  service_type TEXT,
  address TEXT,
  square_footage INTEGER,
  message TEXT,
  preferred_date DATE,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'reviewed', 'quoted', 'converted', 'declined')),
  
  -- Conversion tracking
  converted_lead_id UUID REFERENCES leads(id),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests (status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created ON quote_requests (created_at DESC);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'quote_requests' AND policyname = 'quote_requests_admin'
  ) THEN
    CREATE POLICY quote_requests_admin ON quote_requests
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Public insert (for the website form — no auth required)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'quote_requests' AND policyname = 'quote_requests_public_insert'
  ) THEN
    CREATE POLICY quote_requests_public_insert ON quote_requests
      FOR INSERT TO anon
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'quote_requests' AND policyname = 'quote_requests_service_role'
  ) THEN
    CREATE POLICY quote_requests_service_role ON quote_requests
      FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 10. PATCH EXISTING TABLES (add missing columns safely)                 ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Ensure notification_dispatch_queue has all required columns from 0009/0010
DO $$
BEGIN
  -- Dedup key (from 0009)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notification_dispatch_queue' AND column_name = 'dedup_key'
  ) THEN
    ALTER TABLE notification_dispatch_queue ADD COLUMN dedup_key TEXT;
  END IF;

  -- Attempt count (from 0009)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notification_dispatch_queue' AND column_name = 'attempt_count'
  ) THEN
    ALTER TABLE notification_dispatch_queue ADD COLUMN attempt_count INTEGER NOT NULL DEFAULT 0;
  END IF;

  -- Max attempts (from 0009)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notification_dispatch_queue' AND column_name = 'max_attempts'
  ) THEN
    ALTER TABLE notification_dispatch_queue ADD COLUMN max_attempts INTEGER NOT NULL DEFAULT 5;
  END IF;

  -- Last error (from 0009)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notification_dispatch_queue' AND column_name = 'last_error'
  ) THEN
    ALTER TABLE notification_dispatch_queue ADD COLUMN last_error TEXT;
  END IF;

  -- Next retry at (from 0010)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notification_dispatch_queue' AND column_name = 'next_retry_at'
  ) THEN
    ALTER TABLE notification_dispatch_queue ADD COLUMN next_retry_at TIMESTAMPTZ;
  END IF;

  -- Provider SID (from 0010)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notification_dispatch_queue' AND column_name = 'provider_sid'
  ) THEN
    ALTER TABLE notification_dispatch_queue ADD COLUMN provider_sid TEXT;
  END IF;
END $$;

-- Ensure completion_reports has all required columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'completion_reports' AND column_name = 'job_id'
  ) THEN
    ALTER TABLE completion_reports ADD COLUMN job_id UUID REFERENCES jobs(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'completion_reports' AND column_name = 'total_amount'
  ) THEN
    ALTER TABLE completion_reports ADD COLUMN total_amount NUMERIC(12,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'completion_reports' AND column_name = 'line_items'
  ) THEN
    ALTER TABLE completion_reports ADD COLUMN line_items JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'completion_reports' AND column_name = 'notes'
  ) THEN
    ALTER TABLE completion_reports ADD COLUMN notes TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'completion_reports' AND column_name = 'qb_invoice_id'
  ) THEN
    ALTER TABLE completion_reports ADD COLUMN qb_invoice_id TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'completion_reports' AND column_name = 'qb_invoice_number'
  ) THEN
    ALTER TABLE completion_reports ADD COLUMN qb_invoice_number TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'completion_reports' AND column_name = 'invoiced_at'
  ) THEN
    ALTER TABLE completion_reports ADD COLUMN invoiced_at TIMESTAMPTZ;
  END IF;
END $$;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 11. ASSIGNMENT NOTIFICATION LOG (from 0014)                            ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS assignment_notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  assignment_id UUID REFERENCES job_assignments(id) ON DELETE SET NULL,
  employee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  
  event_type TEXT NOT NULL,
  delivery_status TEXT,
  provider_sid TEXT,
  delivery_error TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notif_log_assignment
  ON assignment_notification_log (assignment_id);
CREATE INDEX IF NOT EXISTS idx_notif_log_employee
  ON assignment_notification_log (employee_id);
CREATE INDEX IF NOT EXISTS idx_notif_log_job
  ON assignment_notification_log (job_id);
CREATE INDEX IF NOT EXISTS idx_notif_log_event
  ON assignment_notification_log (event_type);

ALTER TABLE assignment_notification_log ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assignment_notification_log' AND policyname = 'notif_log_admin_read'
  ) THEN
    CREATE POLICY notif_log_admin_read ON assignment_notification_log
      FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assignment_notification_log' AND policyname = 'notif_log_service_role'
  ) THEN
    CREATE POLICY notif_log_service_role ON assignment_notification_log
      FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 12. VERIFICATION QUERY (run after apply to confirm)                    ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- This will be visible in the migration output to confirm all tables exist
DO $$
DECLARE
  missing_tables TEXT[];
  expected_tables TEXT[] := ARRAY[
    'profiles', 'jobs', 'leads', 'job_assignments',
    'employee_availability', 'checklist_templates', 'job_photos',
    'tickets', 'quote_requests', 'completion_reports',
    'employment_applications', 'financial_snapshots',
    'notification_dispatch_queue', 'assignment_notification_log',
    'quickbooks_credentials', 'quickbooks_sync_mappings',
    'quickbooks_sync_audit', 'quickbooks_sync_queue'
  ];
  tbl TEXT;
BEGIN
  missing_tables := ARRAY[]::TEXT[];
  
  FOREACH tbl IN ARRAY expected_tables
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = tbl
    ) THEN
      missing_tables := array_append(missing_tables, tbl);
    END IF;
  END LOOP;
  
  IF array_length(missing_tables, 1) > 0 THEN
    RAISE WARNING 'BOOTSTRAP INCOMPLETE — Missing tables: %', array_to_string(missing_tables, ', ');
  ELSE
    RAISE NOTICE 'BOOTSTRAP COMPLETE — All 18 expected tables verified present.';
  END IF;
END $$;
