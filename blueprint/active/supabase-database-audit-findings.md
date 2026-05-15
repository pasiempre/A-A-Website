# Supabase Database Audit Findings

Date: 2026-05-08  
Source: `/Users/hc/Downloads/Supabase Schema Policy Checks.csv`  
Project ref: `ktqufntwzeumhcnjiqcd`

## Summary

The live database export contains 32 public tables, 455 public columns, 67 public RLS policies, 116 public indexes, 373 public constraints, 8 public functions, 6 public enum types, and 2 storage buckets.

All public tables have RLS enabled. The core launch schema is mostly present, including the restored runtime columns on `profiles`, `employee_availability`, and the ticket creation RPC support.

## High Priority Findings

### 1. Employee job visibility still fails for assignment-created jobs

Live policy `jobs_assigned_read` only allows employee reads when `jobs.assigned_to = auth.uid()`. Newer flows assign workers through `job_assignments`.

Validated with E2E employee A: assigned jobs created through `job_assignments` returned `jobs: null` when `jobs.assigned_to` was not populated, including:

- Quote-created job `41ca167d-ab6b-4d62-b611-262797486ec4`
- Manual ADM-020 ticket `9df92b47-6773-4d63-840b-568741456203`

Impact: employee portal can list the assignment but cannot render the job details for these launch-critical jobs.

Local fix staged:

- `Production-workspace/supabase/migrations/0036_harden_employee_rls_and_photo_uploads.sql`

### 2. `profiles_self_update` can allow role escalation if table update grants are available

Policy:

```sql
profiles_self_update
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid())
```

This row-level check does not restrict columns. If authenticated users have update privileges on `profiles`, a user can attempt to update sensitive columns such as `role` or `is_active` on their own row.

Impact: possible privilege escalation from employee to admin/owner.

Local fix staged:

- Drop `profiles_self_update`.
- Keep admin updates through `profiles_admin_all`.
- Add a narrow RPC later if employee self-service profile editing is needed.

### 3. Employee photo upload code drifted from live `job_photos` schema

Live `job_photos` columns include:

- `assignment_id`
- `uploaded_by`
- `file_name`
- `file_size`
- `mime_type`
- `photo_type`
- `caption`

Employee upload code was inserting old columns:

- `employee_id`
- `taken_at`
- `latitude`
- `longitude`
- `notes`
- `photo_type = 'completion'`

Impact: completion photo upload would fail against the live schema.

Local code fix applied:

- `Production-workspace/src/components/employee/EmployeeTicketsClient.tsx`

The insert now uses `assignment_id`, `uploaded_by`, file metadata, `photo_type = 'after'`, and `caption`.

### 4. Storage object policies are missing from the live export

The live export returned no `storage.objects` policies, despite `job-photos` and `job-photos-spike` buckets existing.

Impact: browser-side employee photo uploads to the private `job-photos` bucket are likely blocked unless policies exist outside the export or uploads go through service-role server APIs.

Local fix staged:

- `0036_harden_employee_rls_and_photo_uploads.sql` restores authenticated admin policies and assignment-scoped employee insert/select policies for `job-photos`.

## Medium Priority Findings

### 5. Several admin policies use `TO public`

Examples:

- `automation_settings`
- `post_job_sequence`
- `quote_templates`

The policy predicates call `current_user_role() = 'admin'`, so anon users should not pass, but `TO authenticated` is clearer and reduces policy surface.

Also, these policies check only `admin`, while many other policies allow `admin` or `owner`. If an `owner` role is used, these modules may behave inconsistently.

### 6. Some foreign key columns are not indexed

The highest-impact missing indexes are on columns likely used for joins/filters:

- `jobs.client_id`
- `jobs.quote_id`
- `jobs.created_by`
- `jobs.checklist_template_id`
- `quotes.client_id`
- `quotes.created_by`
- `supply_requests.requested_by`
- `supply_requests.supply_id`
- `quickbooks_invoice_cache.client_id`
- `quickbooks_invoice_cache.job_id`

Current row counts are tiny, so this is not a launch blocker, but it will matter as operational data grows.

### 7. `job_assignments` employee self-update is broad

Employees can update their own assignment rows. RLS checks only `employee_id = auth.uid()`, not which columns change.

Impact: employees may be able to mutate fields beyond the intended status lifecycle if table grants permit it.

Recommendation: replace broad direct updates with a narrow RPC for assignment status transitions, or use column privileges.

## Low Priority / Follow-Up

1. Consider normalizing role/status text fields to enums where app behavior is stable.
2. Add check-constraint definitions to the export script for deeper future review.
3. Add grants/privileges to the export script; RLS alone does not show column-level update risk.
4. Review whether `job-photos-spike` is still needed before launch.

## Verification

Post-apply verification:

1. `0036_harden_employee_rls_and_photo_uploads.sql` was applied successfully in Supabase SQL Editor.
2. Authenticated E2E employee A can now read joined job details for quote-created job `41ca167d-ab6b-4d62-b611-262797486ec4` and manual ADM-020 job `9df92b47-6773-4d63-840b-568741456203`.
3. Employee A self-update attempt to set `profiles.role = 'admin'` returned no updated rows, and service-role verification confirmed the role remained `employee`.
4. Employee A storage upload to assigned job path in `job-photos` succeeded. The temporary smoke object was removed after the test.

Local lint passed:

```text
npm run lint
```
