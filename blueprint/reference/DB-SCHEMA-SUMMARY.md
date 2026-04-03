# Database Schema Summary

**Last Updated**: March 20, 2026  
**Database**: Supabase PostgreSQL  
**Migrations Applied**: 10 (see `supabase/migrations/`)  
**Row Level Security**: Enabled for all tables

Session context references: `SESSION-LOG.md`, `PICKUP-GUIDE.md`

---

## Core Tables

### profiles
Stores admin and employee user profiles linked to Supabase Auth.

```sql
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  role app_role NOT NULL DEFAULT 'employee',  -- 'admin' | 'employee'
  locale text NOT NULL DEFAULT 'es',          -- 'es' | 'en'
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

**Key Points**:
- Linked to Supabase `auth.users` table
- `role` determines dashboard access (middleware uses this)
- `locale` defaults to Spanish (`es`) for employees
- Deleted when user account deleted

**RLS**: 
- Employees can view only their own profile
- Admins can view all profiles

---

### clients
Companies/individuals who have active jobs.

```sql
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company_name text,
  email text,
  phone text,
  notes text,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

**Key Points**:
- Created when a lead is converted to a job
- Can have multiple jobs
- `created_by` tracks which admin added them
- Can include company info for commercial clients

---

### leads
Incoming inquiries from quote form (not yet converted to jobs).

```sql
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company_name text,
  phone text NOT NULL,
  email text,
  service_type text,
  timeline text,
  description text,
  status lead_status NOT NULL DEFAULT 'new',  -- 'new' | 'qualified' | 'quoted' | 'won' | 'lost'
  source text NOT NULL DEFAULT 'web_quote_form',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

**Key Points**:
- Created from `/api/quote-request` endpoint (public quote form)
- `status` flow: new → qualified (admin called) → quoted (sent price) → won/lost
- `service_type` examples: "post-construction", "commercial", "move-in-move-out"
- Admin follows up at 1h and 4h after creation (see `lead-followup` API)

---

### quotes
Price quotes sent to leads.

```sql
CREATE TABLE public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  notes text,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

**Key Points**:
- One quote per lead initially (can have multiple if re-bidding)
- `subtotal` and `total` stored as decimal (supports currency)
- Quote PDF generated on-demand via `/api/quote-send`
- Linked to client after lead converts

---

### jobs
Scheduled cleaning work (one job = one service visit).

```sql
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  quote_id uuid REFERENCES public.quotes(id) ON DELETE SET NULL,
  title text NOT NULL,
  address text NOT NULL,
  contact_name text,
  contact_phone text,
  scope text,  -- Service details (e.g., "2-bed apt, carpet clean, hardwood buff")
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  status job_status NOT NULL DEFAULT 'scheduled',  -- 'scheduled' | 'en_route' | 'in_progress' | 'completed' | 'blocked'
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

**Key Points**:
- Created via `/api/quote-create-job` (admin converts quote → job)
- `status` flow: scheduled → en_route → in_progress → completed
- Can be blocked (emergency stop, rescheduling, etc.)
- `scheduled_start` and `scheduled_end` define job window

---

### job_assignments
Links employees (crew) to jobs.

```sql
CREATE TABLE public.job_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES public.profiles(id),
  assigned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, employee_id)  -- One assignment per employee per job
);
```

**Key Points**:
- Many-to-many relationship (one job → many employees)
- `UNIQUE(job_id, employee_id)` prevents duplicate assignments
- When row inserted, `/api/assignment-notify` sends SMS to crew
- `assigned_by` tracks which admin made assignment

---

### job_photos
Before/after photos crew uploads for completed jobs (stored in Supabase Storage).

```sql
CREATE TABLE public.job_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  storage_path text NOT NULL,  -- Full path in Supabase Storage
  -- Additional columns in actual schema (size, mime_type, etc. from migrations)
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

**Key Points**:
- Photos uploaded via employee portal (IndexedDB queue if offline)
- `storage_path` points to Supabase Storage bucket (e.g., `jobs/job-id/photo-uuid.jpg`)
- Linked to both job and employee (who uploaded)
- Completion reports include these photos

---

## Supporting Tables (From Migrations 2+)

### notification_dispatch_queue
Queued SMS/email notifications with retry and dedup support.

**Columns**:
- `id` — UUID primary key
- `profile_id` — FK to profiles (nullable, for employee-targeted messages)
- `to_phone` — Recipient phone number
- `body` — Message text
- `status` — 'queued' | 'sent' | 'failed' | 'permanently_failed' | 'deduped'
- `dedup_key` — SHA-256 hash of (recipient + body) for duplicate detection
- `attempts` — Number of send attempts made (integer, default 0)
- `send_after` — Earliest time to attempt delivery (used for quiet hours + retry backoff)
- `sent_at` — When successfully delivered
- `provider_sid` — Twilio message SID on success
- `error_text` — Last error message on failure
- `queued_reason` — Why queued: 'quiet_hours', 'send_failed_transient', etc.
- `context` — JSONB with caller metadata (job_id, assignment_id, type)
- `created_at`, `updated_at` — Timestamps

**Indexes**:
- `idx_notification_dispatch_queue_dedup` — Partial index on (`dedup_key`, `created_at`) for dedup query acceleration

**Usage**:
- Written by: `notifications.ts` (quiet hours queue + failure fallback)
- Read/updated by: `notification-dispatch/route.ts` (batch processor)
- Retry: Exponential backoff (5m → 10m → 20m → 40m), max 5 attempts
- Dead letter: Items exceeding max attempts marked `permanently_failed` for admin review

---

### lead_follow_ups
Scheduled follow-up reminders for uncalled leads.

**Purpose**: Trigger SMS/email reminders at 1h and 4h after lead creation.

**Columns** (approximate):
- `id` — UUID
- `lead_id` — FK to leads table
- `scheduled_at` — When to send reminder (1h, 4h after creation)
- `sent_at` — When actually sent
- `type` — 'sms' | 'email'

**Usage**:
- `/api/lead-followup` runs periodically (cron job)
- Sends reminder to admin if lead not yet qualified

---

### job_checklists & checklist_items
Phase 2 feature: QA review checklists (actively used).

**Purpose**: Track pre-job and post-job quality checks.

**Status**: Implemented in admin flows; checklist items are actively managed in Operations and coherently reset in TicketManagement rework paths.

---

### employment_applications
Stores job applications from public careers page.

**Purpose**: HR review for crew hiring.

**Columns** (approximate):
- `id` — UUID
- `name`, `phone`, `email` — Applicant info
- `experience` — Previous experience
- `availability` — When can start
- `status` — 'submitted' | 'reviewed' | 'rejected' | 'hired'

---

## Enums (Custom Types)

### app_role
```sql
CREATE TYPE app_role AS ENUM ('admin', 'employee');
```

Used in `profiles.role` to determine dashboard access.

### lead_status
```sql
CREATE TYPE lead_status AS ENUM ('new', 'qualified', 'quoted', 'won', 'lost');
```

Lead lifecycle: new → qualified → quoted → won/lost

### job_status
```sql
CREATE TYPE job_status AS ENUM ('scheduled', 'en_route', 'in_progress', 'completed', 'blocked');
```

Job lifecycle: scheduled → en_route → in_progress → completed

---

## Relationships Diagram

```
profiles (admin/employee users)
├── ↓ created_by
├─→ clients
│   ├─→ jobs
│   │   ├─→ job_assignments (→ employee_id links back to profiles)
│   │   ├─→ job_photos (→ employee_id links back to profiles)
│   │   └─→ quotes
│   │
├─→ leads
│   ├─→ quotes
│   │   └─→ jobs (created via quote)
│   └─→ lead_follow_ups

Async Tables:
├─→ notification_dispatch_queue (SMS/email dispatch queue)
├─→ employment_applications (careers form submissions)
└─→ job_checklists (phase 2, QA reviews)
```

---

## Row Level Security (RLS) Overview

All tables have RLS enabled. Example policies:

```sql
-- Employees can only see jobs assigned to them
CREATE POLICY "employees_see_assigned_jobs" ON jobs
  USING (
    auth.uid() = (
      SELECT employee_id FROM job_assignments 
      WHERE job_id = id LIMIT 1
    )
  );

-- Admins see everything
CREATE POLICY "admins_see_all" ON jobs
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
```

**Key**: Policies automatically filter data returned by queries (no need for manual WHERE clauses).

---

## Migrations Applied

| # | File | Purpose |
|---|------|---------|
| 1 | `0001_mvp_core.sql` | Base tables (profiles, clients, leads, quotes, jobs, assignments) |
| 2 | `0002_ticketing_enhancements.sql` | Job photos, status tracking |
| 3 | `0003_ops_and_conversion.sql` | Ops fields, conversion tracking |
| 4 | `0004_lead_pipeline_and_quotes.sql` | Lead funnel, quote management |
| 5 | `0005_phase2_quality_and_messaging.sql` | QA checklists, messaging tables |
| 6 | `0006_notification_preferences_and_queue.sql` | Notification queue, preferences |
| 7 | `0007_phase4_phase5_foundations.sql` | Analytics, inventory prep |
| 8 | `0008_quote_delivery_and_hiring.sql` | Quote delivery, hiring/applications |
| 9 | `0009_notification_dedup_and_attempts.sql` | Notification dedup and attempt tracking |
| 10 | `0010_notification_queue_status_expansion.sql` | Expanded dispatch status lifecycle |

**To apply**: Migrations auto-apply via Supabase CLI or dashboard.

---

## Data Insert Examples

### Creating a Lead (from public form)

```sql
INSERT INTO leads (name, phone, email, service_type, description, status, source)
VALUES (
  'John Smith',
  '+15551234567',
  'john@example.com',
  'post-construction-cleaning',
  '2br apt after reno',
  'new',
  'web_quote_form'
)
RETURNING id;
```

### Converting Lead to Client + Job

```sql
-- 1. Create client
INSERT INTO clients (name, phone, email, created_by)
VALUES ('John Smith Residential', '+15551234567', 'john@example.com', admin_uuid)
RETURNING id;

-- 2. Create job
INSERT INTO jobs (client_id, title, address, scheduled_start, scheduled_end, scope, created_by)
VALUES (client_id, 'Post-Reno Clean - 2br', '123 Main St, Austin TX 78704', '2024-03-25 09:00', '2024-03-25 14:00', 'Full clean after drywall', admin_uuid)
RETURNING id;

-- 3. Assign crew
INSERT INTO job_assignments (job_id, employee_id, assigned_by)
VALUES (job_id, employee_uuid, admin_uuid);

-- Assignment notification auto-triggers via trigger or API call
```

---

## Connection String

In production, Supabase provides connection string:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
```

Used by:
- `src/lib/supabase/server.ts` (server-side API queries)
- `src/lib/supabase/admin.ts` (admin operations)

---

## Performance Notes

- Indexes auto-created on FK columns (job_id, employee_id, etc.)
- RLS policies execute for every query (slight overhead but necessary)
- Large tables (notification_queue) may need partitioning in Phase 4+

---

**See Also**:
- [CONFIG-ESSENTIALS.md](CONFIG-ESSENTIALS.md) — Environment variables to connect
- [API-CONTRACTS.md](API-CONTRACTS.md) — Endpoints that read/write these tables
- [VERIFICATION-CHECKLIST.md](VERIFICATION-CHECKLIST.md) — How to test data integrity
