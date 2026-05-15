# Admin and Employee E2E Test Guide

Date: 2026-05-07  
Status: Active  
Owner: Product + Engineering

## 1. Purpose

This guide is the execution playbook for validating admin and employee workflows against the target Supabase environment.

Primary goals:
1. Confirm core workflows work end-to-end (UI -> API -> DB persistence).
2. Detect schema drift early (missing tables, missing columns, broken relations).
3. Detect auth and RLS mismatches early (401, 403, silent write failures).
4. Capture reproducible evidence to classify failures as code, migration, seed-data, or environment issues.

## 2. How To Use This Guide

Run this guide in order.

1. Complete preflight checks in Sections 3 and 4.
2. Execute admin tests (Section 6) and employee tests (Section 7).
3. Run direct API checks (Section 8).
4. For every failure, follow triage in Section 9 and capture evidence in Section 10.
5. Determine release readiness using Section 11 exit criteria.

## 3. Prerequisites

## 3.1 Environment prerequisites

1. App and API environment variables are configured and valid.
2. Migrations are applied to target DB in order.
3. At least one admin and two employee identities exist (or can be seeded).
4. Access to browser devtools network tab and server logs is available.
5. Access to run SQL queries in target DB is available.

## 3.2 Data prerequisites

Seed minimum entities before UI testing:
1. leads
2. clients
3. quotes and quote_line_items
4. jobs
5. job_assignments
6. checklist_templates and checklist_template_items
7. job_checklist_items
8. issue_reports
9. job_messages
10. job_photos storage bucket and table
11. supplies
12. supply_requests
13. notification_dispatch_queue
14. completion_reports
15. post_job_sequence
16. automation_settings

Launch seed identities:
1. Admin: `e2e.admin@aanda-cleaning.test`
2. Employee A: `e2e.employee.a@aanda-cleaning.test`
3. Employee B: `e2e.employee.b@aanda-cleaning.test`
4. Shared test password: `AaCleaningE2E!2026`

## 4. Preflight Verification (Run Before UI)

## 4.1 SQL preflight pack

Run this full pack and paste raw output into evidence.

```sql
-- A. Required table existence
select
   to_regclass('public.leads') as leads,
   to_regclass('public.clients') as clients,
   to_regclass('public.jobs') as jobs,
   to_regclass('public.job_assignments') as job_assignments,
   to_regclass('public.quotes') as quotes,
   to_regclass('public.quote_line_items') as quote_line_items,
   to_regclass('public.checklist_templates') as checklist_templates,
   to_regclass('public.checklist_template_items') as checklist_template_items,
   to_regclass('public.job_checklist_items') as job_checklist_items,
   to_regclass('public.issue_reports') as issue_reports,
   to_regclass('public.job_messages') as job_messages,
   to_regclass('public.job_photos') as job_photos,
   to_regclass('public.supplies') as supplies,
   to_regclass('public.supply_requests') as supply_requests,
   to_regclass('public.quickbooks_invoice_cache') as quickbooks_invoice_cache,
   to_regclass('public.notification_dispatch_queue') as notification_dispatch_queue,
   to_regclass('public.post_job_sequence') as post_job_sequence,
   to_regclass('public.automation_settings') as automation_settings,
   to_regclass('public.completion_reports') as completion_reports;

-- B. Relation-critical columns
select table_name, column_name
from information_schema.columns
where table_schema = 'public'
   and (
      (table_name = 'jobs' and column_name in ('id', 'title', 'customer_name', 'status', 'qa_status', 'assigned_to', 'client_id', 'quote_id', 'clean_type', 'priority', 'scheduled_start', 'scheduled_date', 'scheduled_time', 'last_completion_report_id', 'last_completion_report_at'))
      or (table_name = 'job_assignments' and column_name in ('id', 'job_id', 'employee_id', 'role', 'status', 'scheduled_start', 'started_at', 'completed_at', 'notification_status', 'checklist_completed_at'))
      or (table_name = 'leads' and column_name in ('id', 'status', 'service_type', 'created_at', 'converted_client_id'))
      or (table_name = 'clients' and column_name in ('id', 'name', 'email', 'created_at'))
      or (table_name = 'quotes' and column_name in ('id', 'lead_id', 'client_id', 'status', 'total', 'public_token', 'accepted_at', 'created_at'))
      or (table_name = 'quote_line_items' and column_name in ('id', 'quote_id', 'description', 'line_total'))
      or (table_name = 'issue_reports' and column_name in ('id', 'job_id', 'status', 'created_at'))
      or (table_name = 'job_messages' and column_name in ('id', 'job_id', 'message_text', 'created_at'))
      or (table_name = 'job_photos' and column_name in ('id', 'job_id', 'employee_id', 'storage_path', 'photo_type', 'created_at'))
      or (table_name = 'completion_reports' and column_name in ('id', 'job_id', 'created_by', 'status', 'created_at'))
      or (table_name = 'post_job_sequence' and column_name in ('id', 'job_id', 'status', 'next_step', 'created_at'))
      or (table_name = 'notification_dispatch_queue' and column_name in ('id', 'status', 'attempts', 'attempt_count', 'created_at'))
   )
order by table_name, column_name;

-- C. Key policies
select schemaname, tablename, policyname
from pg_policies
where schemaname = 'public'
   and tablename in (
      'profiles',
      'jobs',
      'job_assignments',
      'job_photos',
      'job_checklist_items',
      'job_messages',
      'issue_reports',
      'completion_reports',
      'notification_dispatch_queue',
      'automation_settings',
      'quote_templates',
      'supplies',
      'supply_requests'
   )
order by tablename, policyname;

-- D. Storage buckets required for photo flows
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id in ('job-photos', 'job-photos-spike')
order by id;

-- E. Launch test identities
select
   u.email,
   p.role,
   p.full_name,
   p.is_active
from auth.users u
left join public.profiles p on p.id = u.id
where u.email in (
   'e2e.admin@aanda-cleaning.test',
   'e2e.employee.a@aanda-cleaning.test',
   'e2e.employee.b@aanda-cleaning.test'
)
order by u.email;
```

## 4.2 Seed health quick checks

```sql
select
   (select count(*) from leads) as leads_count,
   (select count(*) from clients) as clients_count,
   (select count(*) from jobs) as jobs_count,
   (select count(*) from job_assignments) as assignments_count,
   (select count(*) from quotes) as quotes_count,
   (select count(*) from quote_line_items) as quote_line_items_count,
   (select count(*) from checklist_templates) as templates_count,
   (select count(*) from checklist_template_items) as template_items_count,
   (select count(*) from job_checklist_items) as job_checklist_items_count,
   (select count(*) from issue_reports) as issues_count,
   (select count(*) from job_messages) as messages_count,
   (select count(*) from job_photos) as photos_count,
   (select count(*) from supplies) as supplies_count,
   (select count(*) from supply_requests) as supply_requests_count,
   (select count(*) from notification_dispatch_queue) as notification_queue_count,
   (select count(*) from completion_reports) as completion_reports_count,
   (select count(*) from post_job_sequence) as post_job_sequence_count,
   (select count(*) from automation_settings) as automation_settings_count;
```

What to look for:
1. Any null table in Section 4.1A is a hard blocker.
2. Any missing required column in Section 4.1B is a migration/schema blocker.
3. Any missing policy rows in Section 4.1C is an auth/RLS blocker.
4. Missing `job-photos` bucket in Section 4.1D blocks employee photo testing.
5. Missing test identity/profile rows in Section 4.1E blocks role-based UI testing.
6. Zero counts in Section 4.2 are soft blockers if that data type is needed for the module under test.
7. `job_photos` may be zero before manual photo-upload testing; the table and `job-photos` storage bucket are the hard requirements.

## 5. Test Execution Rules

Use this format for every case:
1. Test ID: AREA-###
2. Role: admin or employee
3. Preconditions
4. Steps
5. Expected UI result
6. Expected network result
7. Expected DB result
8. Failure signature

Severity labels:
1. Blocker: prevents core flow from completing.
2. High: flow completes but data integrity or auth correctness is compromised.
3. Medium: non-critical behavior mismatch.
4. Low: cosmetic or minor UX mismatch.

## 6. Admin Test Suite

## 6.1 Admin auth and navigation

Test ID: ADM-001  
Goal: verify admin shell and module loading are healthy.

Steps:
1. Login as admin and open admin home.
2. Open each module from sidebar: Leads and Quotes, Jobs, Dispatch, Scheduling, Review and Approve, Insights, Hiring, Notifications, Inventory, Configuration.

Expected:
1. No auth/session warning banners.
2. No white screen after module switches.
3. Network has no burst of 400/404 on module load.

Failure signatures:
1. 401 on initial module fetches indicates session/auth mismatch.
2. 400 relation errors indicate schema cache or relation query mismatch.
3. 404 on table paths indicates migration/deployment drift.

Result 2026-05-07:
1. Passed. Logout redirected to `/auth/admin`, admin login reached dashboard, and every sidebar module loaded without console or network errors.
2. Non-blocking UX/accessibility finding: browser Issues panel reported form controls without `id` or `name` attributes across admin resources. Classification: Low. This can affect autofill and form accessibility hygiene, but it does not block E2E flow execution.

## 6.2 Leads and quotes pipeline

Test ID: ADM-010  
Goal: validate lead status, quote generation, quote send, and quote-to-job transition.

Steps:
1. Open lead board and pick one lead in new or contacted.
2. Change status to contacted or follow-up.
3. Open quote flow, review quote, send quote.
4. Convert lead to client.
5. Create job from accepted quote.

Expected UI:
1. Status change toast/message appears.
2. Quote creation returns quote number or share URL.
3. Create-job action succeeds and shows job id/result.

Expected network:
1. PATCH/UPDATE lead status returns 200.
2. Quote send/create route returns 200 or 201.
3. Quote-create-job route returns 200 or 201.

Expected DB checks:
```sql
select id, status, updated_at from leads order by updated_at desc limit 5;
select id, lead_id, client_id, status, total, created_at from quotes order by created_at desc limit 5;
select id, title, customer_name, status, client_id, quote_id, created_at from jobs order by created_at desc limit 5;
```

Failure signatures:
1. 400 with relation errors around leads or quotes indicates relation normalization gap.
2. Status changed in UI but not DB indicates silent mutation failure.

Result 2026-05-08:
1. Partial pass. Lead status update from `new` to `contacted` moved the lead into the Contacted view and persisted across refresh/module state.
2. Partial pass. Convert to Client succeeded and the UI showed "Lead converted to client."
3. Finding: Quick Response attempted all template options and `/api/lead-message` returned 500. Root cause: local Twilio env vars are empty, and the route returned a generic server error instead of an explicit delivery-configuration failure. Classification: Medium for launch testing; P1 before real customer SMS use.
4. Finding: Confirm & Send also failed when external delivery was unconfigured. Classification: Medium for launch testing; must be retested with Resend/Twilio configured or with explicit share-link-only behavior accepted.
5. Patch applied locally: `/api/lead-message` now requires admin auth and returns 503/502 for SMS delivery failures; `/api/quote-send` now creates the quote and records `delivery_status='failed'` with a clear Resend configuration message instead of throwing after quote creation when Resend env vars are missing.
6. Retest pass. Quote `Q-2026-499692` was created with a share link, customer-facing `/quote/[token]` page loaded, customer accepted the quote, and admin lead moved to `converted` with quote status `accepted`.
7. Finding fixed locally: quote page initially displayed missing lead contact details because Supabase returned `leads` as an object relation instead of an array. Quote page now normalizes relation shape before rendering.
8. UX patch applied locally: lead cards now display `Text:` and `Email:` explicitly; quick SMS action is labeled `Text Response`; quote confirmation button now distinguishes `Create & Email Quote` from `Create Share Link`.
9. Retest pass. `Create Job from Quote` returned 200 and created job `41ca167d-ab6b-4d62-b611-262797486ec4` for quote `Q-2026-499692`. Job appeared in Scheduling.
10. Finding: create-job success feedback was easy to miss and lead card still looked actionable after job creation. Patched locally to retain created job id on the lead card and replace the button with a "Job created" state.
11. Finding: quote-created job had `customer_name = null`; Jobs/Dispatch/Scheduling did not consistently select/display customer context. Patched locally so future quote-created jobs store `customer_name`, and admin job surfaces prefer customer name with title as secondary context.

## 6.3 Ticket creation and QA

Test ID: ADM-020  
Goal: validate ticket-create atomic path and QA transitions.

Steps:
1. Create ticket with worker + checklist template.
2. Confirm assignment and checklist rows were created.
3. Duplicate ticket.
4. Save QA review for approved and needs_rework paths.

Expected:
1. Ticket create returns success with job id.
2. Checklist and assignment records exist for that job.
3. QA updates persist without destructive data loss.

Expected DB checks:
```sql
-- Replace with created job id
select id, title, customer_name, status, qa_status from jobs where id = '<JOB_ID>';
select id, job_id, employee_id, role, status, notification_status from job_assignments where job_id = '<JOB_ID>';
select id, job_id, item_text, is_completed from job_checklist_items where job_id = '<JOB_ID>' order by sort_order;
```

Failure signatures:
1. Job created but no assignment/checklist indicates transaction boundary regression.
2. needs_rework resets all completion evidence unexpectedly indicates QA data-loss bug.

Result 2026-05-08:
1. Supabase MCP was registered in `codex mcp list`, but no Supabase MCP tools/resources were exposed in the session. Live checks were run with the configured Supabase service-role env instead.
2. Pass for live atomic RPC path after migration `0035_remove_ticket_create_job_status_enum_cast.sql`: `admin_create_ticket_atomic` created job `9df92b47-6773-4d63-840b-568741456203`.
3. Verified job row: title `E2E Manual Ticket ADM-020 2026-05-08T22:46:06.068Z`, address `123 Manual E2E Way, Austin, TX`, status `scheduled`, qa_status `pending`, clean_type `commercial`, priority `normal`.
4. Verified assignment row: `eebff3d8-34a0-4ad8-97ba-85ca56f03fbc`, employee `566b66d5-6cf9-4287-8e30-6ef3f44e9e0a`, role `lead`, status `assigned`, notification_status `pending`.
5. Verified three checklist rows were created from `E2E Standard Clean Checklist`: `Confirm site access`, `Clean main areas`, and `Upload completion photo`.
6. Remaining ADM-020 coverage: hard-refresh admin UI and retest browser `/api/ticket-create`, duplicate ticket, and QA approved/needs_rework save paths.

Result 2026-05-11:
1. Browser retest pass. Admin manual ticket creation showed "Ticket created successfully", created a visible Ticket Board row, and did not show a `/api/ticket-create` failure.
2. Browser duplicate pass. Duplicate action created a new ticket card titled `E2E Manual (Copy)` and did not visibly corrupt the original ticket.
3. Browser QA partial pass. Saving QA as `approved` persisted enough to show last-reviewed timestamp and approved status on the ticket card.
4. UX/product finding: address field accepted `test address` with no validation. Add address validation and ideally Google Places autocomplete before launch, with manual override for unusual job sites.
5. UX/product finding: tickets/jobs need a human-readable reference number. Creation confirmation should say something like `Job #4736 has been created`, and Ticket Board/Scheduling/Dispatch/employee views should display the same number.
6. UX/product finding: Ticket Board cards should show scheduled job date/time or assigned week. Current card makes it hard to tell when the job happens.
7. UX/product finding: assignment display falls back to truncated worker id (`566b66d5`) instead of worker name. Ticket Board should show `E2E Employee A` or the employee full name.
8. UX/product finding: duplicated tickets need clearer visual treatment, such as copied-from reference, muted duplicate badge, or color/status coordination so the owner can distinguish original versus duplicate quickly.
9. UX/product finding: QA save lacks clear confirmation. Add success toast/state animation and make approved/needs_rework visually obvious beyond only the last-reviewed timestamp.
10. Remaining ADM-020 coverage: verify the exact new browser-created job, assignment, and checklist rows by SQL/service-role query if the created job id can be identified; test `needs_rework` path on separate ticket or duplicate.

## 6.4 Operations and checklist templates

Test ID: ADM-030  
Goal: validate operations module relation integrity and checklist actions.

Steps:
1. Load operations module.
2. Create template and template items.
3. Apply template to a job.
4. Toggle checklist item completion.
5. Send job message.

Expected:
1. No relation errors for jobs to job_messages or jobs to issue_reports.
2. Checklist changes persist.
3. Messages persist and are visible after reload.

Failure signatures:
1. 400 relation errors for jobs joins indicate schema cache mismatch or brittle select shape.

Result 2026-05-11:
1. Browser pass. Operations & QA Review loaded, checklist template creation worked, checklist toggles worked, Send Report worked, and Send Message worked.
2. Product clarity finding: `Send Report` and `Send Message` are not self-explanatory enough. The guide and UI need to clarify that Send Report is the QA/completion report workflow, while Send Message is a job/site message thread action. Confirm recipient/audience and delivery channel in the UI.
3. UX/state finding: after refreshing, `Clear all checklist items` appeared again even though checklist items were completed. Review checklist completion state, refresh hydration, and whether the clear-all action should show only when there are completed items, editable items, or admin reset permissions.
4. UX finding: top success banner `Job message sent.` did not fade or clear after success. Make transient success messages dismissible and auto-clear after a short delay.
5. UX/product finding: success messages should include the human-readable job/ticket reference once implemented, for example `Message sent for Job #4736`.
6. Remaining ADM-030 coverage: verify persisted `job_messages`, `completion_reports`, and checklist rows by database query for the tested job.

## 6.5 Insights and exports

Test ID: ADM-040  
Goal: ensure insights module loads and computes trends from real data without hard failure.

Steps:
1. Load insights module.
2. Switch tabs and time range.
3. Export CSV.

Expected:
1. Module renders without fatal errors.
2. Trend values render and change with range when data differs.
3. Export action returns file or success response.

Failure signatures:
1. Degraded warnings with 400 or 404 indicate unresolved source-query dependencies.
2. All trends fixed at static values indicates stale placeholder logic.

Result 2026-05-11:
1. Browser pass. Insights loaded and appeared to update counts from current data; no hard failure observed.
2. Product gap: insight metric cards are not clickable, so the owner cannot drill into the jobs/leads/issues/applications that make up a number.
3. Product gap: Insights needs more visual analysis: charts, trend lines, breakdowns, and status/category distributions instead of only static metric boxes.
4. Product gap: drill-down should reuse ticket/card layouts where useful, so clicking Jobs, Active Jobs, QA Approval Rate, Open Issues, Low Stock, etc. opens the underlying records.
5. Remaining ADM-040 coverage: test Export CSV and confirm it contains current filtered data.

## 6.6 Notification center and dispatch

Test ID: ADM-050  
Goal: validate queue visibility, dispatch run behavior, and post-job settings auth path.

Steps:
1. Open notification center.
2. Refresh queue list.
3. Run dispatch from admin UI.
4. Open configuration and load post-job settings.

Expected:
1. Queue load returns 200.
2. Dispatch action is authorized for admin path.
3. Post-job settings GET and PATCH are authorized for admin.

Failure signatures:
1. 401 on dispatch run indicates cron/admin auth mismatch.
2. 401 on post-job settings indicates role/session mismatch.

Result 2026-05-11:
1. Browser pass. Notification Center loaded, queue list displayed, and Run Dispatch completed with `Processed 1, sent 0, failed 1`.
2. Expected local/config caveat: failed delivery is still expected until Twilio/Resend credentials and real recipient test contacts are fully refreshed and verified.
3. Launch verification requirement: notification dispatch must be tested on real devices/inboxes before sign-off, including the owner phone/email, the operator/admin phone/email, and at least two additional test users.
4. UX/product finding: Notification Center should make delivery status easier to understand, including queued/sent/failed summary counts, last attempt time, provider error, next retry time, and the exact job/ticket reference.
5. UX/product finding: retry actions should clearly state what will happen and whether quiet hours will be respected or bypassed.
6. UX/product finding: preferences should explain the difference between SMS enabled, Email enabled, and Batch job notifications in plain language.
7. Console finding: `/admin?module=notifications` showed a hydration mismatch where the server rendered Dashboard Overview but the client selected Job Management/Notifications from saved state. Patched locally in `AdminShell` so localStorage module/sidebar state is applied after hydration instead of during initial render.
8. Console note: `Could not establish connection. Receiving end does not exist.` is likely from a browser extension/devtool channel and is not currently classified as an app blocker unless it reproduces in a clean browser profile.
9. Vercel production env validation 2026-05-11: Supabase service-role check passed, Twilio account auth passed, and Resend API key authenticated, but delivery env is not launch-ready. Missing app-expected `TWILIO_FROM_NUMBER`, missing `RESEND_FROM_EMAIL`, malformed Upstash REST URL/token values, missing `NEXT_PUBLIC_APP_URL`, and optional `ADMIN_ALERT_PHONE`.
10. Env validation helper added locally: `Production-workspace/scripts/validate-env.mjs`. Re-run after Vercel env fixes with `node --env-file=.env.vercel.production.local scripts/validate-env.mjs`.

## 6.7 Scheduling and availability

Test ID: ADM-060  
Goal: validate overlap detection and availability blocks.

Steps:
1. Create unavailability block for employee A covering a known job window.
2. Attempt to assign employee A in overlapping window.
3. Attempt assignment in non-overlapping window.

Expected:
1. Overlap/unavailable case is blocked with clear message.
2. Non-overlap case succeeds.

Failure signatures:
1. All employees shown as available at all times indicates availability query mismatch.

## 6.8 Inventory management

Test ID: ADM-070  
Goal: validate supplies and supply requests surfaces.

Steps:
1. Create supply item.
2. Create supply request.
3. Approve request.
4. Reject another request.

Expected:
1. No 404 for supplies or supply_requests.
2. Request state updates persist.

## 7. Employee Test Suite

## 7.1 Employee access and assignment visibility

Test ID: EMP-001

Steps:
1. Login as employee A.
2. Open employee portal.
3. Verify only assigned jobs are shown.

Expected:
1. No access to admin-only content.
2. Assigned jobs visible with required details.

## 7.2 Employee checklist, issue, photo, completion

Test ID: EMP-010

Steps:
1. Open assigned job.
2. Complete at least one checklist item.
3. Submit issue report with description and optional photo.
4. Upload completion photo.
5. Mark assignment complete.

Expected network:
1. Checklist update returns 200.
2. Issue insert returns 200 or 201.
3. Photo upload and metadata insert return success.
4. Completion report API call returns 200 or 201, or 409 if dedup guard triggered.

Expected DB checks:
```sql
select id, job_id, is_completed, completed_at from job_checklist_items where job_id = '<JOB_ID>';
select id, job_id, description, status, created_at from issue_reports where job_id = '<JOB_ID>' order by created_at desc;
select id, job_id, storage_path, photo_type, created_at from job_photos where job_id = '<JOB_ID>' order by created_at desc;
select id, job_id, created_by, status, created_at from completion_reports where job_id = '<JOB_ID>' order by created_at desc;
```

Failure signatures:
1. UI appears successful but DB has no row indicates silent RLS denial or swallowed error.
2. 403 from completion-report for assigned employee indicates ownership/role regression.

## 7.3 Multi-crew runtime proof

Test ID: EMP-020

Steps:
1. Assign employee A and employee B to the same job.
2. Login as employee A and verify visibility.
3. Login as employee B and verify visibility.

Expected:
1. Both assigned employees can read same job details.

Failure signature:
1. One employee sees null or missing job indicates C-40 policy gap still active.

Result 2026-05-08:
1. Failed for assignment-created jobs. Authenticated E2E employee A could read assignment rows, but joined `jobs` returned `null` for quote-created job `41ca167d-ab6b-4d62-b611-262797486ec4` and manual ADM-020 job `9df92b47-6773-4d63-840b-568741456203`.
2. Root cause: live `jobs_assigned_read` policy still reads through `jobs.assigned_to = auth.uid()`, while current launch flows assign workers through `job_assignments`.
3. Local fix staged in `0036_harden_employee_rls_and_photo_uploads.sql`; apply it before continuing EMP-001/EMP-010/EMP-020 browser testing.

Result 2026-05-08 after applying `0036_harden_employee_rls_and_photo_uploads.sql`:
1. Retest pass. Authenticated E2E employee A can now read joined job details for quote-created job `41ca167d-ab6b-4d62-b611-262797486ec4` and manual ADM-020 job `9df92b47-6773-4d63-840b-568741456203`.
2. Security smoke pass. Employee A self-update attempt to set `profiles.role = 'admin'` returned no updated rows, and service-role verification confirmed the role remained `employee`.
3. Storage smoke pass. Employee A could upload to `job-photos/completion/9df92b47-6773-4d63-840b-568741456203/...` after the storage policy fix. Temporary smoke object was removed after the test.

## 8. Direct API Validation

Use authenticated sessions where required and capture status/body for each route.

Routes to test:
1. POST /api/ticket-create
2. POST /api/quote-send
3. POST /api/quote-create-job
4. POST /api/notification-dispatch
5. GET /api/post-job-settings
6. PATCH /api/post-job-settings
7. POST /api/conversion-event
8. POST /api/lead-message
9. POST /api/completion-report
10. POST /api/employment-application

What to look for:
1. Authenticated admin calls should not return unexpected 401.
2. Employee calls should enforce role boundaries with explicit 403 where expected.
3. Validation errors should return 400 with actionable message.
4. Server errors should return 500 with loggable message.

## 9. Failure Triage Workflow

## 9.1 Error class mapping

1. 400 errors
    - Typical causes: bad select shape, missing relation metadata, unknown columns.
    - First checks: relation in select, schema cache, column existence query.
2. 401 errors
    - Typical causes: missing session, stale cookie, auth-mode mismatch.
    - First checks: session cookie present, route auth policy, user role in profiles.
3. 403 errors
    - Typical causes: role mismatch or RLS policy blocks.
    - First checks: profile role, assignment ownership logic, table policies.
4. 404 errors
    - Typical causes: missing table/view/function in target DB.
    - First checks: to_regclass table checks and migration application state.
5. 500 errors
    - Typical causes: route exceptions, RPC failures, insert/update failures.
    - First checks: server logs, payload validity, dependent table existence.

## 9.2 Root-cause classification

Classify each failure as one of:
1. Code defect
2. Migration/schema defect
3. Seed-data deficiency
4. Environment/config defect
5. External transient dependency

## 10. Evidence Capture Template

For every failure, capture all fields below.

1. Test case ID
2. Timestamp and timezone
3. Role and user id
4. Module or route
5. Step number where failure occurred
6. Request method and URL
7. Response status and body
8. Screenshot
9. Console excerpt
10. SQL evidence used
11. Classification
12. Proposed owner and fix path

Use this markdown block for each failure:

```markdown
### Failure Record: <TEST_ID>
- Timestamp:
- Role/User:
- Module/Route:
- Step:
- Request:
- Response:
- UI observation:
- Console observation:
- SQL evidence:
- Classification: code | migration | seed | env | external
- Owner:
- Next action:
```

## 11. Exit Criteria

Release readiness requires all of the following:

1. No unresolved blocker failures in admin or employee core flows.
2. No unresolved 400 or 404 in core module load paths.
3. Admin dispatch and post-job settings paths are authorized and operational.
4. Employee completion flow writes checklist, issue/photo, and completion-report evidence successfully.
5. Multi-crew visibility is runtime-verified with two assigned employees.
6. Evidence is attached for every high/critical finding still open.

## 12. Suggested Execution Cadence

1. Run preflight once per environment before test cycle.
2. Run core admin and employee smoke daily in active stabilization.
3. Re-run full suite after any migration deployment.
4. Re-run targeted suites after each high-priority fix batch.
