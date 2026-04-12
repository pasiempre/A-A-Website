# Feedback 3.0 Validation Evidence

Date: 2026-04-11
Scope: Validation evidence for implemented feedback3.0 items
Status: Partial validation complete (code + static checks), live-env validation pending

## 1) Evidence Summary

Validated now:
- Code implementation for all critical/high/strategic feedback3.0 backlog items.
- File-scoped diagnostics and lint checks on modified files.
- Static evidence that required analytics events and resilient token logic are present.

Still pending (requires runtime environment):
- Live user-journey execution evidence (browser walkthrough).
- Live analytics sink verification in deployed environment.
- Paid-channel destination verification against ad platform requirements.

## 2) Validation Matrix

### 2.1 Conversion Path

Requirement:
- hero/open quote -> Step 1 -> optional Step 2 (empty allowed) -> success

Status:
- Implemented and statically validated

Evidence:
- Client skip logic for empty Step 2 payload exists in `src/components/public/variant-a/useQuoteForm.ts` (`shouldSkipStep2Submit`).
- Server no-op success exists in `src/app/api/quote-request/route.ts` (`updated: false, skipped: true` on empty update payload).

Runtime check still needed:
- Execute end-to-end browser run and capture event/network output for one success path with empty Step 2.

### 2.2 Analytics Path

Requirement:
- conversion events emitted once per successful journey
- success-page confirmation event observed
- paid-channel conversion instrumentation validated in environment

Status:
- Implemented and statically validated; environment confirmation pending

Evidence:
- `quote_confirmation_viewed` and `paid_channel_conversion` exist in `src/app/quote/success/page.tsx`.
- `quote_step2_skipped` and `quote_step2_completed` exist in `src/components/public/variant-a/useQuoteForm.ts`.
- `quote_step2_back_clicked` and `quote_spanish_handoff_clicked` exist in `src/components/public/variant-a/FloatingQuotePanel.tsx`.

Runtime check still needed:
- Validate single-fire behavior in browser session and verify analytics ingestion.
- Validate paid-channel fields satisfy downstream ad platform mapping.

### 2.3 API Resilience Path

Requirement:
- enrichment token flow works across realistic serverless lifecycle patterns
- no-op Step 2 payload returns success and does not regress data integrity

Status:
- Implemented and statically validated; load/lifecycle runtime proof pending

Evidence:
- In-memory token map removed from quote-request path.
- Signed token strategy present in `src/app/api/quote-request/route.ts`:
  - `signTokenPayload`
  - `validateEnrichmentToken`
  - HMAC + timing-safe compare (`createHmac`, `timingSafeEqual`)
- Empty Step 2 payload returns success with explicit no-op indicator.

Runtime check still needed:
- Execute repeated step2 submits across separate function invocations and confirm acceptance/rejection behavior and DB integrity.

### 2.4 UX Checks

Requirement:
- service prefill reflects current CTA context on each open
- keyboard navigation and focus behavior are stable on mobile
- bilingual handoff path is visible and functional

Status:
- Implemented and statically validated; device runtime pass pending

Evidence:
- Prefill refresh logic in `src/components/public/variant-a/FloatingQuotePanel.tsx` updates when open context changes.
- Keyboard ergonomics and focus-centering behavior implemented in `src/components/public/variant-a/FloatingQuotePanel.tsx`.
- Bilingual handoff implemented in quote panel and contact page.

Runtime check still needed:
- Validate on mobile Safari/Chrome with software keyboard and touch interactions.

## 3) Tooling Evidence

Checks run:
- `npx eslint 'src/components/public/PublicChrome.tsx' 'src/components/public/variant-a/useQuoteForm.ts'`
- `npx eslint 'src/components/public/PublicChrome.tsx' 'src/components/public/variant-a/FloatingQuotePanel.tsx' 'src/app/(public)/contact/page.tsx' 'src/app/(public)/page.tsx' 'src/components/public/variant-a/AuthorityBar.tsx'`

Result:
- Passed for scoped modified files.

## 4) Remaining Close-Out Tasks

1. Run a manual browser evidence pass and save screenshots/network notes for conversion path.
2. Validate production analytics ingestion for success and paid-channel events.
3. Validate ad platform mapping/acceptance for paid conversion signal payload.
4. Confirm API resilience under realistic serverless invocation patterns.

## 5) Runtime Artifact Intake Template (Pass 5+)

Use this section to paste verification outputs and promote conditional findings to Resolved (Verified).

Status legend:
- Pending Artifact
- Artifact Captured
- Promoted to Resolved (Verified)

### 5.1 Promotion Tracker

| Item | Current Status | Required Artifact(s) | Artifact Link / Paste Location | Promotion Status |
|---|---|---|---|---|
| C-44 (`quote_templates`) | Resolved (Verified) | table exists + policy exists + CRUD smoke | Section 5.2 + 5.3 | Promoted to Resolved (Verified) |
| C-66 (`automation_settings`) | Resolved (Verified) | table exists + policy exists + GET/PATCH smoke | Section 5.2 + 5.4 | Promoted to Resolved (Verified) |
| C-41 (`scheduled_date` / `scheduled_time`) | Resolved (Conditional) | column check + admin query success | Section 5.2 + 5.5 | Artifact Captured (column check); admin runtime proof pending |
| C-42 (`checklist_completed_at`) | Resolved (Conditional) | column check + completion write/read proof | Section 5.2 + 5.5 | Artifact Captured (column check); write/read runtime proof pending |
| C-40 (multi-crew RLS) | Partial | policy dump + multi-employee read proof | Section 5.2 + 5.6 | Artifact Captured (policy confirms gap); runtime proof pending (no job rows available) |
| #1047 (`attempts` vs `attempt_count`) | Open (Verified) | schema introspection + dispatch retry smoke | Section 5.2 + 5.7 | Artifact Captured (dual-column collision + defaults confirmed); dispatch runtime row proof pending |
| SB-6 signup role escalation | Open (Verified) | migration/code fix evidence + exploit regression test | Section 5.8 | Artifact Captured (function/trigger confirm vulnerable role source active); regression test pending |

### 5.2 SQL Artifact Paste Block

Paste output for:
1. table existence checks
2. column existence checks
3. policy checks

```text
[paste SQL output here]

Artifact intake (2026-04-12) — policy check output:

| schemaname | tablename                   | policyname                    |
| ---------- | --------------------------- | ----------------------------- |
| public     | automation_settings         | admin_all_automation_settings |
| public     | job_assignments             | assignments_admin_all         |
| public     | job_assignments             | assignments_self_read         |
| public     | job_assignments             | assignments_self_update       |
| public     | job_assignments             | assignments_service_role      |
| public     | jobs                        | jobs_admin_all                |
| public     | jobs                        | jobs_assigned_read            |
| public     | jobs                        | jobs_service_role             |
| public     | notification_dispatch_queue | ndq_admin_all                 |
| public     | notification_dispatch_queue | ndq_employee_read_own         |
| public     | notification_dispatch_queue | ndq_service_role_all          |
| public     | quote_templates             | admin_all_quote_templates     |

Interpretation notes:
- Policy artifacts are now captured for `quote_templates`, `automation_settings`, `jobs`, `job_assignments`, and `notification_dispatch_queue`.
- This does not yet satisfy table-existence checks, column introspection checks, or runtime smoke requirements.

Artifact intake (2026-04-12) — table existence output:

| quote_templates_table | automation_settings_table | service_requests_table |
| --------------------- | ------------------------- | ---------------------- |
| quote_templates       | automation_settings       | null                   |

Artifact intake (2026-04-12) — column existence output:

| table_name                  | column_name            | data_type                |
| --------------------------- | ---------------------- | ------------------------ |
| job_assignments             | checklist_completed_at | timestamp with time zone |
| jobs                        | scheduled_date         | date                     |
| jobs                        | scheduled_time         | time without time zone   |
| notification_dispatch_queue | attempt_count          | integer                  |
| notification_dispatch_queue | attempts               | integer                  |

Artifact intake (2026-04-12) — expanded policy output highlights:
- `jobs_assigned_read` qual is `(assigned_to = auth.uid())`, which confirms non-primary assignment visibility risk remains open (C-40).
- `automation_settings` and `quote_templates` admin policies are present.

Artifact intake (2026-04-12) — auth trigger/function output:
- `public.handle_new_user` currently sources role from `NEW.raw_user_meta_data->>'role'`.
- trigger `on_auth_user_created` is active on `auth.users` and executes `handle_new_user()`.

Interpretation update:
- Table and column existence artifacts are now captured for C-44/C-66/C-41/C-42.
- `service_requests` table remains absent in target DB snapshot.
- SB-6 remains open and validated as vulnerable in current DB function definition.
- Runtime smokes (Sections 5.3-5.7) are still required for promotion to Resolved (Verified).
```

### 5.3 Quote Templates Runtime Smoke

Expected path:
1. list templates
2. create template
3. update template
4. delete template

Evidence:
```text
Blocked by schema mismatch in target DB while executing smoke queries:

Error:
ERROR: 42703: column "is_active" does not exist
LINE 1: select id, name, service_type, is_active, created_at ...

Interpretation:
- `quote_templates` table exists, but current target column contract differs from expected query shape.
- Runtime CRUD smoke is pending exact column introspection.

Update (2026-04-12): schema introspection captured and blocker is now query-shape resolved.
- Confirmed columns: `id`, `name`, `service_type`, `default_line_items`, `base_price`, `pricing_model`, `created_by`, `created_at`, `updated_at`.
- Confirmed PK: `quote_templates_pkey (id)`.
- Confirmed row_count: 4.
- Pending: execute corrected transactional CRUD smoke using real column contract.

Runtime smoke output (2026-04-12):

| id                                   | name                 |
| ------------------------------------ | -------------------- |
| 543d1628-8d62-44d9-b8da-128fef6bee2c | pass7_smoke_template |

Promotion rationale:
- CRUD path executed with transactional rollback and returned row artifact.
- Combined with table/policy artifacts in Section 5.2, C-44 is promoted to Resolved (Verified).
```

### 5.4 Automation Settings Runtime Smoke

Expected path:
1. GET /api/post-job-settings
2. PATCH one setting
3. GET confirms persisted value

Evidence:
```text
Blocked by schema mismatch in target DB while executing smoke queries:

Error:
ERROR: 42703: column "setting_key" does not exist
LINE 3: select setting_key, setting_value, updated_at ...

Interpretation:
- `automation_settings` table exists, but current target column contract differs from expected query shape.
- Runtime GET/PATCH smoke is pending exact column introspection.

Update (2026-04-12): schema introspection captured and blocker is now query-shape resolved.
- Confirmed columns: `key`, `value`, `updated_by`, `created_at`, `updated_at`.
- Confirmed PK: `automation_settings_pkey (key)`.
- Confirmed row_count: 1.
- Sample row captured for key `post_job`.
- Pending: execute corrected GET/PATCH transactional smoke using `key`/`value` contract.

Runtime smoke output (2026-04-12):

| key                 | value             | updated_at                    |
| ------------------- | ----------------- | ----------------------------- |
| pass7_smoke_setting | {"enabled":false} | 2026-04-12 06:40:50.486252+00 |

Promotion rationale:
- GET/PATCH-style transactional smoke returned updated row artifact.
- Combined with table/policy artifacts in Section 5.2, C-66 is promoted to Resolved (Verified).
```

### 5.5 Jobs/Assignments Column Runtime Checks

Expected validations:
1. `scheduled_date` + `scheduled_time` surfaced in admin path
2. `checklist_completed_at` write/read on completion path

Evidence:
```text
[paste API/browser output and notes here]
```

### 5.6 Multi-Crew RLS Verification

Expected validation:
1. create one job
2. assign 2+ employees
3. each non-primary assignee can read job details in employee portal

Evidence:
```text
Policy artifact output:

| schemaname | tablename       | policyname            | cmd    | roles           | qual                                                                                                                                       | with_check |
| ---------- | --------------- | --------------------- | ------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| public     | job_assignments | assignments_admin_all | ALL    | {authenticated} | (EXISTS ( SELECT 1 FROM profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'owner'::text]))))) | null       |
| public     | job_assignments | assignments_self_read | SELECT | {authenticated} | (employee_id = auth.uid())                                                                                                                 | null       |
| public     | jobs            | jobs_assigned_read    | SELECT | {authenticated} | (assigned_to = auth.uid())                                                                                                                 | null       |

Runtime readiness check:
- jobs sample query returned: Success. No rows returned.

Interpretation:
- Policy confirms non-primary assignment visibility gap remains open (`jobs_assigned_read` scoped to `assigned_to` only).
- Runtime multi-crew portal proof is blocked until at least one test job + multi-assignee dataset exists.

Additional blocker (2026-04-12):
- Supabase Auth user creation from dashboard currently fails with `POST /auth/v1/admin/users` status `500`.
- Log metadata shows invalid temp key context (`sb.apikey.error = invalid`, prefix `sb_temp_Jc`) with `x_sb_error_code = unexpected_failure`.
- This blocks creation of Employee A/B test auth identities, and therefore blocks runtime C-40 portal validation until Auth admin-user creation is restored.
```

### 5.7 Notification Queue Attempt Naming Verification

Expected validation:
1. schema shows intended canonical column (`attempts` or `attempt_count`)
2. dispatch route updates same canonical column
3. queue row reflects retries without column mismatch

Evidence:
```text
Schema artifact output:

| column_name   | data_type | is_nullable | column_default |
| ------------- | --------- | ----------- | -------------- |
| attempt_count | integer   | NO          | 0              |
| attempts      | integer   | NO          | 0              |

Queue snapshot output:
- query succeeded, no rows returned.

Interpretation:
- Dual-column collision (`attempts` + `attempt_count`) is confirmed active in target schema.
- Runtime retry-path proof cannot be completed until queue has at least one row processed by dispatch.
```

### 5.8 Signup Privilege Escalation Regression

Expected validation:
1. fix applied to role source (app metadata path)
2. attempted signup with `data.role='admin'` does not elevate role

Evidence:
```text
Function artifact output:

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
$function$

Trigger artifact output:

| trigger_name         | table_name | trigger_def                                                                                                    |
| -------------------- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| on_auth_user_created | auth.users | CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user() |

Interpretation:
- Vulnerable role source path remains active (`raw_user_meta_data->>'role'`).
- Regression test remains pending until function is changed to app metadata path and exploit attempt is re-run.
```

### 5.9 Validation Closeout Snapshot (Pass 8)

Status at closeout:
- Promoted to Resolved (Verified): C-44, C-66
- Validated-open (execution required): C-40, #1047, SB-6, success-page nav contrast parity

External/runtime blockers recorded:
- Supabase Auth admin user creation currently failing (`POST /auth/v1/admin/users` -> `500`, `x_sb_error_code=unexpected_failure`) preventing Employee A/B identity setup for C-40 runtime proof.
- No queue rows available in `notification_dispatch_queue` during validation window, preventing retry-path runtime evidence for #1047.

Validation program note:
- Validation passes are complete; remaining work is implementation/environment unblock, not evidence-model uncertainty.
