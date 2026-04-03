# Current State Gap Report

Last updated: 2026-04-03
Scope: Active execution state vs Master Spec 4.0 and active checklist

## Snapshot

- Build health: green (`npx tsc --noEmit`, `npm run lint`, `npm run build` pass in [Production-workspace](Production-workspace)).
- Migration state: remote is synced through `0024` (verified via `npx supabase migration list`; `0020` is applied remotely).
- P0 correction pass: §14 correction targets are now present in code (F-02, F-03, F-05, F-01, F-12, F-17).
- F-07 foundations: `npm run preflight:f07` PASS + `npm run smoke:f07` PASS (8/8).
- Launch gates: still blocked by credential/device validation and owner-run production parity tasks.

## Feature Mapping (Active)

| Feature | Spec Target | Implementation Evidence | Status | Gap |
|---|---|---|---|---|
| F-04 Quick Quote templates | P0 operations | [Production-workspace/src/components/admin/QuoteTemplateManagerClient.tsx](Production-workspace/src/components/admin/QuoteTemplateManagerClient.tsx), [Production-workspace/supabase/migrations/0021_quote_templates.sql](Production-workspace/supabase/migrations/0021_quote_templates.sql) | Implemented | Credential-gated production validation still pending |
| F-06 One-tap dispatch | P1 operations | [Production-workspace/src/app/api/quote-create-job/route.ts](Production-workspace/src/app/api/quote-create-job/route.ts) | Implemented | Real-world runbook evidence pending |
| F-07 Post-job chain | P1 operations | [Production-workspace/src/lib/post-job-sequence.ts](Production-workspace/src/lib/post-job-sequence.ts), [Production-workspace/src/lib/post-job-settings.ts](Production-workspace/src/lib/post-job-settings.ts), [Production-workspace/src/app/api/post-job-sequence/route.ts](Production-workspace/src/app/api/post-job-sequence/route.ts), [Production-workspace/src/app/api/post-job-scheduler/route.ts](Production-workspace/src/app/api/post-job-scheduler/route.ts), [Production-workspace/src/app/api/post-job-rating/route.ts](Production-workspace/src/app/api/post-job-rating/route.ts), [Production-workspace/src/app/api/post-job-settings/route.ts](Production-workspace/src/app/api/post-job-settings/route.ts), [Production-workspace/src/components/admin/PostJobAutomationSettingsClient.tsx](Production-workspace/src/components/admin/PostJobAutomationSettingsClient.tsx), [Production-workspace/src/app/api/completion-report/route.ts](Production-workspace/src/app/api/completion-report/route.ts), [Production-workspace/supabase/migrations/0022_post_job_sequence_and_payments.sql](Production-workspace/supabase/migrations/0022_post_job_sequence_and_payments.sql), [Production-workspace/supabase/migrations/0023_post_job_automation_settings.sql](Production-workspace/supabase/migrations/0023_post_job_automation_settings.sql) | In progress | Live credentialed E2E proof |
| F-22 Service-area route depth | P0 conversion | [Production-workspace/src/app/(public)/service-area/[slug]/page.tsx](Production-workspace/src/app/(public)/service-area/[slug]/page.tsx), [Production-workspace/src/lib/service-areas.ts](Production-workspace/src/lib/service-areas.ts) | Implemented | Content QA and conversion metric verification pending |
| F-23 Objection modules | P0 conversion | [Production-workspace/src/lib/service-faqs.ts](Production-workspace/src/lib/service-faqs.ts), [Production-workspace/src/app/(public)/services/post-construction-cleaning/page.tsx](Production-workspace/src/app/(public)/services/post-construction-cleaning/page.tsx) | Implemented | Content freshness and offer testing pending |
| F-24 Pricing/SLA guidance | P0 conversion | [Production-workspace/src/lib/service-pricing.ts](Production-workspace/src/lib/service-pricing.ts), [Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx](Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx) | Implemented | Business-owner pricing confirmation and periodic calibration pending |

## P0 Correction Verification (Section 14 Targets)

| Feature | Target Correction | Verification Evidence | Status |
|---|---|---|---|
| F-02 | Lead acknowledgment email body alignment | [Production-workspace/src/app/api/quote-request/route.ts](Production-workspace/src/app/api/quote-request/route.ts) | Verified in code |
| F-03 | 1h/4h/24h message alignment + no secondary admin complexity | [Production-workspace/src/app/api/lead-followup/route.ts](Production-workspace/src/app/api/lead-followup/route.ts) | Verified in code |
| F-05 | Sidebar grouping (Daily Work / Business / Settings) | [Production-workspace/src/components/admin/AdminSidebarNav.tsx](Production-workspace/src/components/admin/AdminSidebarNav.tsx) | Verified in code |
| F-01 | Morning Briefing sections and action modules | [Production-workspace/src/components/admin/OverviewDashboard.tsx](Production-workspace/src/components/admin/OverviewDashboard.tsx) | Verified in code |
| F-12 | Job-day timeline UI above assignment cards | [Production-workspace/src/components/employee/EmployeeTicketsClient.tsx](Production-workspace/src/components/employee/EmployeeTicketsClient.tsx) | Verified in code |
| F-17 | 4-step confirmation process + while-you-wait CTAs | [Production-workspace/src/app/quote/success/page.tsx](Production-workspace/src/app/quote/success/page.tsx) | Verified in code |
| Migration 0020 | Lead lifecycle schema dependency | [Production-workspace/supabase/migrations/0020_lead_lifecycle_fields.sql](Production-workspace/supabase/migrations/0020_lead_lifecycle_fields.sql) + remote migration list | Applied remotely |

## Gap Detail — F-07

### Landed

1. Data model and indexes exist for post-job sequencing and payment metadata.
2. Chain bootstrap starts from completion-report QA-approved auto path.
3. Manual admin trigger endpoint exists.
4. Scheduled executor route exists for rating/review/payment steps.
5. Inbound rating webhook exists for 1-5 parsing and branch behavior.

### Remaining

1. Execute credential-gated acceptance run with evidence artifacts (Twilio send/delivery, inbound parse, scheduler due-step execution).
2. Attach captured evidence and timestamps to [blueprint/active/EXECUTION-CHECKLIST.md](blueprint/active/EXECUTION-CHECKLIST.md) for closure review.

## Launch-Gate Impact

1. Pass 1 (stability/security): still blocked by owner actions (Upstash token rotation + Vercel env parity).
2. Pass 2 (credential validation): still blocked; no real-device proof logged yet for Twilio/Sentry/QuickBooks/Upstash scenarios.
3. Pass 3 (policy finalization): partially complete; user manual verification remains unresolved in checklist.

## Recommended Next Sequence

1. Record today’s verification evidence in [Production-workspace/docs/evidence/f07-evidence-template.md](Production-workspace/docs/evidence/f07-evidence-template.md) and cross-link it in [blueprint/active/EXECUTION-CHECKLIST.md](blueprint/active/EXECUTION-CHECKLIST.md).
2. Run full R-01 provider/device validation (Twilio, Sentry, QuickBooks, Upstash) with timestamps and screenshots.
3. Close owner-run Pass 1 items (Upstash revocation + Vercel env parity confirmation).
4. Start F-08 only after F-07 acceptance criteria are evidence-backed.
