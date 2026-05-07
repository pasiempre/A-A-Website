# Admin and Employee E2E Test Guide

Date: 2026-04-13  
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
2. jobs
3. job_assignments
4. quotes
5. checklist_templates and checklist_template_items
6. issue_reports
7. job_messages
8. supplies
9. supply_requests
10. notification_dispatch_queue
11. automation_settings

## 4. Preflight Verification (Run Before UI)

## 4.1 SQL preflight pack

Run this full pack and paste raw output into evidence.

```sql
-- A. Required table existence
select
   to_regclass('public.leads') as leads,
   to_regclass('public.jobs') as jobs,
   to_regclass('public.job_assignments') as job_assignments,
   to_regclass('public.quotes') as quotes,
   to_regclass('public.checklist_templates') as checklist_templates,
   to_regclass('public.checklist_template_items') as checklist_template_items,
   to_regclass('public.issue_reports') as issue_reports,
   to_regclass('public.job_messages') as job_messages,
   to_regclass('public.supplies') as supplies,
   to_regclass('public.supply_requests') as supply_requests,
   to_regclass('public.quickbooks_invoice_cache') as quickbooks_invoice_cache,
   to_regclass('public.notification_dispatch_queue') as notification_dispatch_queue,
   to_regclass('public.automation_settings') as automation_settings,
   to_regclass('public.completion_reports') as completion_reports;

-- B. Relation-critical columns
select table_name, column_name
from information_schema.columns
where table_schema = 'public'
   and (
      (table_name = 'jobs' and column_name in ('id', 'assigned_to', 'client_id', 'scheduled_start', 'scheduled_date', 'scheduled_time', 'last_completion_report_id', 'last_completion_report_at'))
      or (table_name = 'job_assignments' and column_name in ('id', 'job_id', 'employee_id', 'status', 'checklist_completed_at'))
      or (table_name = 'leads' and column_name in ('id', 'status', 'service_type', 'created_at'))
      or (table_name = 'quotes' and column_name in ('id', 'lead_id', 'status', 'total', 'created_at'))
      or (table_name = 'issue_reports' and column_name in ('id', 'job_id', 'status', 'created_at'))
      or (table_name = 'job_messages' and column_name in ('id', 'job_id', 'message_text', 'created_at'))
      or (table_name = 'completion_reports' and column_name in ('id', 'job_id', 'created_by', 'status', 'created_at'))
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
      'job_checklist_items',
      'completion_reports',
      'notification_dispatch_queue',
      'automation_settings',
      'quote_templates',
      'supplies',
      'supply_requests'
   )
order by tablename, policyname;
```

## 4.2 Seed health quick checks

```sql
select
   (select count(*) from leads) as leads_count,
   (select count(*) from jobs) as jobs_count,
   (select count(*) from job_assignments) as assignments_count,
   (select count(*) from quotes) as quotes_count,
   (select count(*) from checklist_templates) as templates_count,
   (select count(*) from issue_reports) as issues_count,
   (select count(*) from job_messages) as messages_count,
   (select count(*) from supplies) as supplies_count,
   (select count(*) from supply_requests) as supply_requests_count,
   (select count(*) from notification_dispatch_queue) as notification_queue_count,
   (select count(*) from automation_settings) as automation_settings_count;
```

What to look for:
1. Any null table in Section 4.1A is a hard blocker.
2. Any missing required column in Section 4.1B is a migration/schema blocker.
3. Any missing policy rows in Section 4.1C is an auth/RLS blocker.
4. Zero counts in Section 4.2 are soft blockers if that data type is needed for the module under test.

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

## 6.2 Leads and quotes pipeline

Test ID: ADM-010  
Goal: validate lead status, quote generation, quote send, and quote-to-job transition.

Steps:
1. Open lead board and pick one lead in new or contacted.
2. Change status to qualified.
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
select id, lead_id, status, created_at from quotes order by created_at desc limit 5;
select id, title, created_at from jobs order by created_at desc limit 5;
```

Failure signatures:
1. 400 with relation errors around leads or quotes indicates relation normalization gap.
2. Status changed in UI but not DB indicates silent mutation failure.

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
select id, title, status, qa_status from jobs where id = '<JOB_ID>';
select id, job_id, employee_id, status from job_assignments where job_id = '<JOB_ID>';
select id, job_id, item_text, is_completed from job_checklist_items where job_id = '<JOB_ID>' order by sort_order;
```

Failure signatures:
1. Job created but no assignment/checklist indicates transaction boundary regression.
2. needs_rework resets all completion evidence unexpectedly indicates QA data-loss bug.

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
