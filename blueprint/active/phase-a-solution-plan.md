# Phase A — Proposed Solution Plan
Date: 2026-05-07
Status: AWAITING APPROVAL — no code changes pending

## Top 3 Launch-Blocking Risks
1. TCPA consent/STOP gap: public forms trigger SMS without consent ledger, dispatch enforcement, or STOP processing.
2. Quote-to-job race: `/api/quote-create-job` can double-create jobs without a database uniqueness guard on `jobs.quote_id`.
3. Unauthenticated SMS route: `/api/lead-message` uses service-role access and sends SMS without route-level admin authorization.

## Summary
- Total findings in ledger (P0/P1/P2/P3): P0 4 / P1 24 / P2 17 / P3 3
- New findings from Batches 9–12: P0 1 / P1 7 / P2 2 / P3 0
- Proposed PR batches: 8

Counts above are Phase A planning classifications for open, partial, and runtime-pending ledger items. Resolved rows are excluded.

## PR Batch Plan

### PR-1: Protected SMS Route + Fail-Closed Auth [Severity: P0]
**Findings addressed:** Batch 5 A01, Batch 5 A05/A07, Flow 5 auth boundary, `/api/lead-message` unauthenticated SMS.

**Files touched (proposed):**
- `Production-workspace/src/app/api/lead-message/route.ts:14-50`
- `Production-workspace/src/lib/middleware/auth.ts:77-84`
- `Production-workspace/src/lib/security-headers.ts:11-25`
- `Production-workspace/next.config.ts:9-41`

**Schema migrations (proposed):** None.

**New env vars introduced:** None.

**Rollback strategy:** Revert the route-auth and middleware/header changes together. This returns current behavior, so rollback should only be used if admin quick-message sending becomes unusable and a temporary manual SMS workflow is accepted.

**Verification steps:**
- From `admin-employee-e2e-test-guide.md`, run admin lead quick-message as an admin and confirm success.
- Call `/api/lead-message` without an admin session and confirm 401/403 before any SMS send.
- Temporarily simulate missing Supabase public env in a protected-route check and confirm protected auth fails closed.
- Verify response headers no longer expose `X-Powered-By`.

**Effort:** 1h

**Open product decisions:**
- None. This is security behavior, not a product choice.

**Diff sketch (no actual edits):**
- `lead-message/route.ts:14` — import `authorizeAdmin`.
- `lead-message/route.ts:14-50` — require admin authorization before service-role lookup or `sendSms`.
- `middleware/auth.ts:77-84` — return denied auth context when protected-route auth env is missing.
- `next.config.ts:9-41` — add `poweredByHeader: false`.

### PR-2: TCPA Consent Ledger + STOP Enforcement [Severity: P0]
**Findings addressed:** Batch 6 TCPA consent capture, not-a-condition clause, consent columns, dispatch enforcement, STOP processing, privacy-policy drift, sender identification, marketing/transactional classification.

**Files touched (proposed):**
- `Production-workspace/src/components/public/variant-a/QuoteSection.tsx:175-277`
- `Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx:150-174`
- `Production-workspace/src/app/(public)/contact/ContactPageClient.tsx:87-99`
- `Production-workspace/src/app/api/quote-request/route.ts:300-520`
- `Production-workspace/src/lib/notifications.ts:164-225` and `510-560`
- `Production-workspace/src/app/api/post-job-rating/route.ts:116-181`
- `Production-workspace/src/app/(public)/privacy/page.tsx:648-652`

**Schema migrations (proposed):** `0027_tcpa_sms_consent_and_opt_outs.sql` after current repo migration `0026_ticket_create_atomic.sql`.

**New env vars introduced:** None required for code. Confirm Twilio webhook URL/config outside code.

**Rollback strategy:** Roll back form-required consent first only if public form conversion breaks; keep dispatch opt-out enforcement if the migration has already shipped. If the full PR is reverted, immediately disable customer-facing SMS sends because privacy copy and STOP behavior would again be out of sync.

**Verification steps:**
- Submit quote/contact forms with consent unchecked and verify selected owner behavior.
- Submit with consent checked and verify consent timestamp, method, source form, and text version persist.
- Send inbound `STOP` through signed Twilio webhook path and verify opt-out persists.
- Try customer-facing SMS to opted-out number and verify suppression.
- Re-read privacy copy and verify it no longer promises behavior before code supports it.

**Effort:** 1d

**Open product decisions:**
- Should unchecked TCPA consent block form submission, or allow submission but suppress SMS?
- Which messages are transactional-only for launch, and should post-job review reminders be treated as marketing-like?

**Diff sketch (no actual edits):**
- `QuoteSection.tsx:175-277` — add unchecked SMS consent checkbox and required disclosure near phone submit.
- `ContactPageClient.tsx:87-99` — add matching consent capture for phone-collecting contact flow.
- `quote-request/route.ts:300-520` — persist consent fields and suppress customer/admin SMS when consent policy requires it.
- `notifications.ts:164-225` — route customer SMS through consent/opt-out checks before Twilio.
- `post-job-rating/route.ts:116-181` — branch inbound STOP/UNSUBSCRIBE before rating parsing.
- `privacy/page.tsx:648-652` — align STOP/privacy copy with implemented behavior.

### PR-3: Quote Acceptance and Job Creation Idempotency [Severity: P0]
**Findings addressed:** IDEMP-1, IDEMP-4, Flow 2 quote lifecycle.

**Files touched (proposed):**
- `Production-workspace/src/app/api/quote-create-job/route.ts:111-213`
- `Production-workspace/src/app/api/quote-response/route.ts:39-58`
- `Production-workspace/src/components/admin/LeadPipelineClient.tsx:540-582`

**Schema migrations (proposed):** `0028_unique_jobs_quote_id.sql`.

**New env vars introduced:** None.

**Rollback strategy:** Revert route conflict-handling code first. If the unique index has shipped and conflicts with existing duplicate data, clean duplicate rows before reverting the migration; do not drop the index casually after launch because it is the real data-integrity guard.

**Verification steps:**
- Double-click "create job" from an accepted quote and verify a single job.
- Fire two concurrent `/api/quote-create-job` requests with the same quote and verify one row plus idempotent response.
- Submit simultaneous accept/decline token responses and verify the first final state wins.
- Run accepted-quote-to-job browser path from `admin-employee-e2e-test-guide.md`.

**Effort:** 2h

**Open product decisions:**
- Quote token expiry TTL: 7, 14, or 30 days?
- Should accepted quotes automatically create jobs, or remain manual admin conversion for launch?

**Diff sketch (no actual edits):**
- `quote-create-job/route.ts:121-126` — retain existing check but rely on DB uniqueness for races.
- `quote-create-job/route.ts:198-213` — catch duplicate-key conflict and return existing job as success.
- `quote-response/route.ts:46-58` — make update conditional on non-final status and return current final status when conflict loses.
- `LeadPipelineClient.tsx:540-582` — keep UI busy-state behavior; handle idempotent existing-job response explicitly.

### PR-4: Runtime Schema Closure Pack [Severity: P1]
**Findings addressed:** SB-6 runtime proof, C-40 runtime proof, #1047 attempts/attempt_count, CRON_NOT_WIRED.

**Files touched (proposed):**
- `Production-workspace/src/app/api/notification-dispatch/route.ts:14-23` and `99-151`
- `Production-workspace/src/lib/notifications.ts:435-460`
- `Production-workspace/vercel.json` new file if cron is repo-owned
- `blueprint/active/admin-employee-e2e-test-guide.md` evidence-step additions

**Schema migrations (proposed):** `0029_notification_attempts_canonical.sql`.

**New env vars introduced:** None.

**Rollback strategy:** Keep schema migration forward-only if it only normalizes retry columns without data loss. If cron wiring causes duplicate sends, disable the schedule while retaining notification code and dedup protections.

**Verification steps:**
- Apply/confirm SB-6 migration on target DB and prove user metadata cannot create admin role.
- Seed Employee A/B multi-assignee data and prove C-40 read/update isolation.
- Force a notification retry and capture row proof using the canonical `attempts` column.
- Verify Vercel cron or documented external scheduler triggers `/api/lead-followup` and `/api/notification-dispatch`.

**Effort:** 1d

**Open product decisions:**
- Is cron wiring repo-owned via `vercel.json`, or managed externally in deployment configuration?

**Diff sketch (no actual edits):**
- `notification-dispatch/route.ts:14-23` — read only canonical retry column after migration.
- `notifications.ts:435-460` — write only canonical retry column.
- `vercel.json` — add minimal cron entries if deployment config is intended to live in repo.

### PR-5: Paid API and Storage Cost Ceilings [Severity: P1]
**Findings addressed:** COST-1, COST-2, COST-3, COST-4, A04 degraded rate-limit telemetry.

**Files touched (proposed):**
- `Production-workspace/src/app/api/ai-assistant/route.ts:133-208`
- `Production-workspace/src/app/api/quote-request/route.ts:430-455` and `462-469`
- `Production-workspace/src/lib/notifications.ts:164-225`
- `Production-workspace/src/lib/resilient-email.ts:97-125`
- `Production-workspace/src/components/employee/EmployeeTicketsClient.tsx:180-185` and `227-232`
- `Production-workspace/src/lib/client-photo.ts:1-14`

**Schema migrations (proposed):** `0030_usage_counters.sql` if counters are persisted in Supabase instead of Upstash.

**New env vars introduced:** `AI_ASSISTANT_DAILY_REQUEST_LIMIT`, `AI_ASSISTANT_MONTHLY_USD_LIMIT`, `SMS_DAILY_SEND_LIMIT`, `EMAIL_DAILY_SEND_LIMIT`, `EMPLOYEE_DAILY_UPLOAD_LIMIT`.

**Rollback strategy:** Feature-limit checks should fail soft by disabling paid sends/AI responses with user-safe messages. If limits are too strict, raise env values without reverting code.

**Verification steps:**
- Exhaust AI assistant daily/session budget and verify a friendly non-provider fallback.
- Exhaust SMS daily ceiling and verify no Twilio call is made.
- Exhaust employee daily upload cap and verify existing uploaded photos remain accessible.
- Confirm rate-limit degraded mode creates visible server telemetry in production mode.

**Effort:** 1d

**Open product decisions:**
- What daily/monthly dollar ceiling is acceptable for AI, SMS, email, and storage before launch?

**Diff sketch (no actual edits):**
- `ai-assistant/route.ts:133-208` — check per-session/per-day/month counters before Anthropic call.
- `notifications.ts:164-225` — check SMS ceiling before Twilio call.
- `EmployeeTicketsClient.tsx:180-185` — move critical upload guard to server/policy-backed path or add enforced upload API.

### PR-6: Business Timezone Normalization [Severity: P1]
**Findings addressed:** TZ-1, TZ-3, TCPA quiet-hours timezone follow-up.

**Files touched (proposed):**
- `Production-workspace/src/components/admin/SchedulingAndAvailabilityClient.tsx:130-156`, `207-209`, `635-665`
- `Production-workspace/src/app/api/lead-followup/route.ts:99-111` and `257-285`
- `Production-workspace/src/lib/notifications.ts:316-352`

**Schema migrations (proposed):** None.

**New env vars introduced:** `BUSINESS_TIMEZONE=America/Chicago`.

**Rollback strategy:** Keep the env default at `America/Chicago`. If date rendering regresses, revert scheduling UI helper changes while retaining cron timezone gating because cron UTC drift is the larger launch risk.

**Verification steps:**
- Test scheduling at UTC boundary for a Central Time date and verify jobs stay on intended day.
- Trigger lead-followup dry run around business-hour boundary and verify Central Time gating.
- Verify quiet-hours defaults remain Austin/Central for launch.

**Effort:** 2h

**Open product decisions:**
- Is Austin/Central Time the only launch timezone, or should job/customer timezone be captured now?

**Diff sketch (no actual edits):**
- `SchedulingAndAvailabilityClient.tsx:130-156` — replace browser/UTC split date keys with business-timezone day keys.
- `lead-followup/route.ts:103-111` — compute business hours in `BUSINESS_TIMEZONE`.

### PR-7: Employee Completion State Guard + Before-Photo Decision [Severity: P1]
**Findings addressed:** NO_BEFORE_PHOTOS, IDEMP-2, Flow 3 employee execution, Flow 4 QA/completion report expectation.

**Files touched (proposed):**
- `Production-workspace/src/components/employee/EmployeeAssignmentCard.tsx:153-166`
- `Production-workspace/src/components/employee/EmployeeTicketsClient.tsx:386-430`, `672-714`
- `Production-workspace/src/components/employee/EmployeePhotoUpload.tsx:1-40`
- `Production-workspace/src/app/api/completion-report/route.ts:374-420`

**Schema migrations (proposed):** None if using existing `job_photos.photo_type` values from `0018_core_schema_bootstrap.sql`; otherwise `0031_job_photo_requirements.sql` only if enforcing DB-level requirements.

**New env vars introduced:** None.

**Rollback strategy:** Keep completion state transition guard separate from before-photo requirement. If before-photo requirement blocks field work, disable only the requirement while retaining valid state progression.

**Verification steps:**
- As employee, try assigned -> complete with incomplete checklist and verify blocked behavior.
- Complete checklist and before-photo flow according to owner decision, then verify completion report includes expected proof.
- Run employee A/B isolation path from `admin-employee-e2e-test-guide.md`.

**Effort:** 1d

**Open product decisions:**
- Is before-photo capture required to start a job, required before completion, or optional?
- Is checklist completion required before marking a job complete?

**Diff sketch (no actual edits):**
- `EmployeeAssignmentCard.tsx:153-166` — disable or hide invalid next states.
- `EmployeeTicketsClient.tsx:386-430` — enforce transition guard before Supabase update and completion-report call.
- `EmployeeTicketsClient.tsx:704-714` — add before-photo capture if required for launch.

### PR-8: Public Claim and Sensitive-Data Truthfulness [Severity: P1]
**Findings addressed:** SB-2, SB-3, ACCESS_CREDENTIAL_AUTO_PURGE, FTC/DTPA privacy drift, WCAG gold/lang/carousel/skip-link disabled-state subset.

**Files touched (proposed):**
- `Production-workspace/src/components/public/variant-a/TestimonialSection.tsx:17-54`
- `Production-workspace/src/app/(public)/page.tsx:55-75`
- `Production-workspace/src/lib/company.ts:8-13`
- `Production-workspace/src/components/admin/TicketManagementClient.tsx:514-522`
- `Production-workspace/src/app/(public)/privacy/page.tsx:428-687`
- `Production-workspace/src/app/layout.tsx:50-56`
- `Production-workspace/src/components/public/variant-a/TestimonialSection.tsx:146-212`

**Schema migrations (proposed):** `0032_access_instructions.sql` only if owner chooses dedicated encrypted/expiring access instructions instead of removing the prompt.

**New env vars introduced:** `ACCESS_INSTRUCTIONS_ENCRYPTION_KEY` only if encrypted storage is chosen.

**Rollback strategy:** Reverting public-copy changes is low technical risk but can reintroduce FTC/DTPA drift. Keep any removal of fabricated/named testimonials even if other copy refinements are reverted.

**Verification steps:**
- Confirm no named testimonial/review structured data remains unless owner supplies real proof.
- Confirm hardcoded stats are owner-approved and framed as claims, or removed until proof exists.
- Confirm admin ticket form no longer encourages lockbox/alarm codes in generic scope notes.
- Spot-check skip link focus and testimonial carousel live-region behavior.

**Effort:** 1d

**Open product decisions:**
- Keep testimonials only with real customer approval, replace with anonymous project proof, or remove for launch?
- Are `15+ years`, `500+ projects`, `1hr`, and `100%` owner-approved factual claims?
- Should access credentials use a dedicated encrypted column, or should the product remove the prompt and tell admins to share verbally?

**Diff sketch (no actual edits):**
- `TestimonialSection.tsx:17-54` — remove fabricated named testimonials or replace with owner-provided proof.
- `page.tsx:55-75` — remove matching fabricated review structured data.
- `company.ts:8-13` — remove or reframe unverified metrics.
- `TicketManagementClient.tsx:514-522` — remove lockbox/alarm wording from generic scope placeholder.
- `layout.tsx:50-56` — make skip target focusable.

## Deferred P2/P3 Backlog
- Performance static/server-component cleanup for above-fold public sections: deferred to post-launch backlog.
- Austin-local service-page body copy and service-card specificity: deferred to post-launch backlog unless SEO is promoted.
- WCAG contrast/lang/carousel/disabled-state polish beyond small PR-8 inclusions: deferred to post-launch backlog.
- Dynamic careers listings, employee tiers, seeds/demo data, realtime messaging, marketing-email unsubscribe model, security_events table, CSP, server-side upload MIME validation, and PWA/offline deeper audit: deferred to post-launch backlog.
- Vertical triggers for HIPAA/EPA/tax handling remain P3 triggered items until the business actually serves those regulated scenarios in production data.

## Open Questions Requiring Owner Decision (Before Phase C)
1. TCPA consent: should the checkbox block form submission if unchecked, or allow form submission but suppress SMS? — affects PR-2. Default if no answer: allow submission but suppress SMS.
2. Quote token expiry: what TTL should public quote links use, 7d, 14d, or 30d? — affects PR-3. Default if no answer: 14 days.
3. Before-photo capture: required to start job, required before completion, or optional? — affects PR-7. Default if no answer: required before completion.
4. Checklist completion: must all checklist items be complete before an employee can mark the assignment complete? — affects PR-7. Default if no answer: yes.
5. Realtime messaging: pre-launch P1 or post-launch upgrade? — affects deferred backlog. Default if no answer: post-launch.
6. Admin MFA: hard-required for launch or opt-in? — affects PR-1 follow-up scope. Default if no answer: hard-required for admin accounts before public launch.
7. Access credentials: dedicated encrypted/expiring field, or remove the prompt and tell admins to share verbally? — affects PR-8. Default if no answer: remove prompt for launch.
8. Public proof claims: can the owner verify the named testimonials and `15+ years` / `500+ projects` / `100%` claims? — affects PR-8. Default if no answer: remove named testimonials and soften hard metrics.
9. Cron ownership: should cron schedules live in repo `vercel.json`, or are they managed in deployment settings outside the repo? — affects PR-4. Default if no answer: add repo `vercel.json`.
10. Cost ceilings: what daily/monthly spend limits should apply to AI, SMS, email, and storage? — affects PR-5. Default if no answer: conservative launch caps with admin-visible failure states.
