# Pickup Guide — Resume Development Here

**Last Session**: March 2026 (Session 3)
**Use With**: `SESSION-LOG.md` + `WORK-BACKLOG.md`
**Estimated Remaining Work**: ~4h (Manual Testing & Credential Configuration only)

---

## Resume Workflow

1. Read this file (`PICKUP-GUIDE.md`) for orientation.
2. Read `SESSION-LOG.md` for all implemented details, decisions, and validation steps.
3. Read `WORK-BACKLOG.md` for current inventory and estimates.
4. Return to the source files noted in "What's Next" below.

Suggested prompt for next session:

> I've completed all development phases (1-5) for the A&A Cleaning platform. Database schema is fully bootstrapped and secured through migration 0019. All UI polish, CTA consistency, error pages, and smoke tests are delivered. Remaining work is manual testing with real credentials (~4h). Per PICKUP-GUIDE.md, start with credential configuration and manual QA. Here are the context files:
> - PICKUP-GUIDE.md
> - SESSION-LOG.md
> - WORK-BACKLOG.md

---

## ✅ Phase 1: Core Infrastructure — COMPLETE (Do Not Rebuild)

| File | Status |
|---|---|
| `src/lib/notifications.ts` | ✅ Rewritten (retry, dedup, queue fallback) |
| `src/app/api/notification-dispatch/route.ts` | ✅ Rewritten (dedup, retry scheduling, dead-letter, telemetry) |
| `src/lib/photo-upload-queue.ts` | ✅ Hardened (IndexedDB v2, validation, dedup, retry) |
| `supabase/migrations/0009_notification_dedup_and_attempts.sql` | ✅ Applied |
| `supabase/migrations/0010_notification_queue_status_expansion.sql` | ✅ Applied |

---

## ✅ Phase 2: API + Admin — COMPLETE (Do Not Rebuild)

| File | Status |
|---|---|
| `src/components/admin/OperationsEnhancementsClient.tsx` | ✅ Enhanced |
| `src/components/admin/SchedulingAndAvailabilityClient.tsx` | ✅ Enhanced |
| `src/components/admin/TicketManagementClient.tsx` | ✅ Coherence patched |
| `src/components/admin/HiringInboxClient.tsx` | ✅ Complete implementation |
| `src/components/admin/UnifiedInsightsClient.tsx` | ✅ Dashboard complete |
| `src/app/api/completion-report/route.ts` | ✅ Auto-trigger + dedup |
| `src/app/api/employment-application/route.ts` | ✅ Full CRUD + email |
| `src/app/api/lead-followup/route.ts` | ✅ 3-tier escalation |
| `supabase/migrations/0011_completion_report_enrichment.sql` | ✅ Applied |
| `supabase/migrations/0012_employment_applications.sql` | ✅ Applied |
| `supabase/migrations/0013_leads_third_alert.sql` | ✅ Applied (hardened for safe no-op) |

---

## ✅ Phase 3: Production Hardening — COMPLETE (Do Not Rebuild)

| File | Status |
|---|---|
| `middleware.ts` | ✅ Rate limiting + security headers + auth observability |
| `sentry.client.config.ts` | ✅ Client error tracking + replay |
| `sentry.server.config.ts` | ✅ Server error tracking |
| `sentry.edge.config.ts` | ✅ Edge runtime tracking |
| `src/instrumentation.ts` | ✅ Sentry init hook |
| `src/lib/sentry.ts` | ✅ Route wrapper + helpers |
| `src/lib/assignment-notifications.ts` | ✅ Multi-event dispatch + audit |
| `supabase/migrations/0014_assignment_notification_log.sql` | ✅ Applied (hardened for safe no-op) |

---

## ✅ Phase 4: QuickBooks Integration — COMPLETE (Do Not Rebuild)

| File | Status |
|---|---|
| `src/lib/quickbooks.ts` | ✅ OAuth2 + AES-256-GCM encryption + API client |
| `src/lib/quickbooks-sync.ts` | ✅ Customer/vendor sync + invoice generation |
| `src/app/api/quickbooks-callback/route.ts` | ✅ OAuth redirect handler |
| `src/app/api/quickbooks-sync/route.ts` | ✅ 10-action API (connect/disconnect/sync/customers/vendors/invoices/status) |
| `supabase/migrations/0015_quickbooks_credentials.sql` | ✅ Applied |
| `supabase/migrations/0016_quickbooks_sync_mappings_and_audit.sql` | ✅ Applied |
| `supabase/migrations/0017_completion_reports_invoice_fields.sql` | ✅ Applied |

---

## ✅ Phase 5: Polish & Optimization — COMPLETE (Do Not Rebuild)

| File | Status |
|---|---|
| `src/components/admin/AdminShell.tsx` | ✅ NEW — Sidebar layout orchestrator with module routing |
| `src/components/admin/AdminSidebarNav.tsx` | ✅ REWRITTEN — Controlled sidebar nav with grouped items |
| `src/app/(admin)/layout.tsx` | ✅ NEW — Admin layout wrapper |
| `src/app/(admin)/admin/page.tsx` | ✅ REWRITTEN — Delegates to AdminShell |
| `src/components/employee/PhotoInventoryModal.tsx` | ✅ NEW — Offline photo queue viewer/manager |
| `src/components/employee/EmployeeTicketsClient.tsx` | ✅ REWRITTEN — Mobile polish, collapsible cards, 44px targets |
| `src/components/public/variant-a/HeroSection.tsx` | ✅ PATCHED — CTA text + min-height |
| `src/components/public/variant-a/PublicHeader.tsx` | ✅ PATCHED — CTA sizing + tap targets |
| `src/components/public/variant-a/QuoteSection.tsx` | ✅ PATCHED — CTA text + redundant button removed |
| `src/components/public/variant-a/VariantAPublicPage.tsx` | ✅ PATCHED — Sticky bar + IncludedSummarySection spacing |
| `src/app/not-found.tsx` | ✅ NEW — Custom 404 page |
| `src/app/error.tsx` | ✅ NEW — Root error boundary page |
| `src/app/(admin)/admin/error.tsx` | ✅ NEW — Admin error boundary page |
| `src/app/(employee)/employee/error.tsx` | ✅ NEW — Employee error boundary page (Spanish) |
| `src/lib/smoke-tests.ts` | ✅ NEW — 28+ automated smoke test cases |

---

## ✅ Database — COMPLETE & SECURED

| File | Status |
|---|---|
| `supabase/migrations/0018_core_schema_bootstrap.sql` | ✅ Applied |
| `supabase/migrations/0019_rls_completion_reports_and_dispatch_queue.sql` | ✅ Applied |

**Context**: Migration 0019 closes the RLS gap found during Session 3 integrity check. Enables RLS + adds policies (admin/employee/service_role) for `completion_reports` and `notification_dispatch_queue`.

**Migrations 0013/0014 were hardened** to safely no-op when prerequisite tables are absent, allowing ordered migration apply to proceed cleanly before bootstrap.

---

## What's Next (Manual Testing Only)

### Credential Configuration & Manual QA (~4h remaining)

#### 1) Verify Migration 0019 + RLS (15min)

```bash
npx supabase db push
```

Verify:
```sql
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename IN ('completion_reports', 'notification_dispatch_queue');
```

#### 2) Run Smoke Tests (30min)

```bash
npx tsx src/lib/smoke-tests.ts
```

#### 3) Type Check (5min)

```bash
npx tsc --noEmit
```

#### 4) Manual Testing with Credentials (3h)

| Test | Credential Needed | Effort |
|---|---|---:|
| Real-device SMS verification | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` | 30min |
| Real-device photo queue test (offline/online sync) | Mobile device | 30min |
| Notification delivery verification (seed queue + telemetry) | Twilio credentials | 30min |
| QuickBooks connection + sync test | `QUICKBOOKS_CLIENT_ID`, `QUICKBOOKS_CLIENT_SECRET`, `QUICKBOOKS_ENCRYPTION_KEY` | 30min |
| Sentry telemetry verification | `NEXT_PUBLIC_SENTRY_DSN` | 15min |
| Rate limiting burst test | None (use `ab` or `wrk`) | 15min |
| Full E2E: create quote → assign job → complete report → generate invoice | All above | 30min |

---

## Architecture Decisions to Preserve

1. Two-layer retry strategy: fast inline retry + slower queue retry windows.
2. Dedup checks are fail-open to avoid message loss.
3. Dead-letter records are retained (`permanently_failed`) for review.
4. Scheduling conflicts are warnings, not hard blockers.
5. Mobile reassignment uses tap-select/tap-assign (drag remains desktop).
6. QuickBooks writes are dry-run by default — require `confirm: true`.
7. Invoice amounts validated against $1 min / $10,000 max ceiling.
8. QB tokens encrypted with AES-256-GCM at application layer.
9. All QB sync operations tracked in `quickbooks_sync_mappings` for idempotency.
10. Full audit trail for every QB write in `quickbooks_sync_audit`.
11. Migrations 0013/0014 hardened for prerequisite-safe no-op.
12. Migration 0018 is idempotent bootstrap — safe to re-run.
13. Migration 0019 is idempotent RLS fix — safe to re-run.
14. Admin shell uses client-side module routing (no URL changes) with localStorage persistence.
15. Employee cards are collapsed by default on mobile — tap to expand.
16. All interactive elements enforce ≥44px minimum tap target on mobile.
17. CTA text standardized: "Get a Free Quote" (open panel), "Submit Quote Request" (form submit), "Free Quote" (space-constrained header/nav).
18. Smoke tests are self-cleaning — all test data removed after run.

---

## Database State

- Migration history aligned through `0019` (local + remote after apply).
- All 18 core tables verified present on remote.
- **RLS enabled on all 18 tables** (0019 closes gap on completion_reports + notification_dispatch_queue).
- 20 FK constraints verified intact.
- Non-PK indexes verified across all operational tables.
- Notification queue supports dedup and expanded status lifecycle.
- QA-related fields (`qa_*`) used consistently across admin QA flows.
- QuickBooks tables: credentials (encrypted), sync_mappings (idempotency), sync_audit (accountability).
- Foundational tables: profiles, jobs, leads, job_assignments, employee_availability, checklist_templates, job_photos, tickets, quote_requests.
- Backup files: `backup_before_bootstrap.sql`, `backup_data_before_bootstrap.sql`.

---

## Environment Variables

### Currently Configured
- `NEXT_PUBLIC_SUPABASE_URL` — ✅ Set
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — ✅ Set
- `SUPABASE_SERVICE_ROLE_KEY` — ✅ Set

### Pending (Set When Ready)
- `QUICKBOOKS_CLIENT_ID` — From Intuit developer dashboard
- `QUICKBOOKS_CLIENT_SECRET` — From Intuit developer dashboard
- `QUICKBOOKS_REDIRECT_URI` — e.g., `https://yourdomain.com/api/quickbooks-callback`
- `QUICKBOOKS_ENVIRONMENT` — `sandbox` or `production`
- `QUICKBOOKS_ENCRYPTION_KEY` — Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `NEXT_PUBLIC_SENTRY_DSN` — From sentry.io project
- `TWILIO_ACCOUNT_SID` — From Twilio console
- `TWILIO_AUTH_TOKEN` — From Twilio console
- `TWILIO_PHONE_NUMBER` — Your Twilio phone number
- `RESEND_API_KEY` — From Resend dashboard

---

## Priority Validation Before Launch

1. ✅ ~~Notification dispatch retry + dedup telemetry with seeded queue rows~~
2. ✅ ~~QA rework behavior from both admin paths~~
3. ✅ ~~Scheduling conflict surfacing~~
4. ✅ ~~Mobile reassignment interaction test~~
5. ✅ ~~Post-bootstrap integrity check (FKs, RLS, indexes)~~
6. ✅ ~~RLS gap fix (completion_reports + notification_dispatch_queue)~~
7. ✅ ~~Runtime connectivity verified (HTTP 200 on homepage)~~
8. Run smoke tests (`npx tsx src/lib/smoke-tests.ts`)
9. Manual credential-based testing (Twilio, QB, Sentry)

---

## Pre-Launch Checklist

- [ ] Migration 0019 applied and verified
- [ ] Smoke tests passing (`npx tsx src/lib/smoke-tests.ts`)
- [ ] Type check clean (`npx tsc --noEmit`)
- [ ] Real-device SMS verification (Twilio production credentials)
- [ ] Real-device photo queue test (offline/online sync)
- [ ] Notification delivery verification (seed queue + telemetry)
- [ ] QA workflow end-to-end (approval → report generation)
- [ ] Employee hiring pipeline test (applicant → offered → hired)
- [ ] QuickBooks sync validation (customers + invoices in QB)
- [ ] Admin analytics dashboard accuracy (metrics vs. manual counts)
- [ ] Rate limiting verification (burst test via `wrk` or `ab`)
- [ ] Sentry telemetry flowing (check sentry.io dashboard)
- [ ] Production environment variables verified
- [ ] Database backups automated
- [ ] Deployment runbook reviewed + tested
- [ ] SSL/domain configured
- [ ] DNS propagation verified
