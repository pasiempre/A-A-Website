can you do a start to finish pass through of my current project?

## Investigation Update — 2026-04-30

Status: Active, but this document has meaningful drift from the current working tree. Treat the mission below as the audit frame, not as fully current ground truth. The next Codex pass should validate one claim at a time and update this document as evidence changes.

Current impression:
- The document is strong as a launch-readiness audit prompt: it focuses Codex on the 5 real production flows, file:line evidence, silent failures, RLS/security, proof automation, and launch-risk synthesis.
- It is too internally accreted for direct execution: the original output contract is followed by later OWASP, TCPA, CAN-SPAM, token, MFA, and compliance requirements that are not cleanly integrated into the section order.
- Several "known gaps" are stale in the current repo, so Codex must not blindly report them as findings.
- The highest-value next step is to convert this from a one-shot mega-prompt into a batch validation ledger: Build/Auth/Env first, then P0 flows, then OWASP/TCPA/compliance, then content/proof automation.

Validated current-state corrections:

| Prior claim in this document | Current repo evidence | Status update |
| --- | --- | --- |
| Next.js 14 App Router | `Production-workspace/package.json` uses `next` `^16.1.7`, React `^19.2.4`. | Update audit baseline to Next.js 16 + React 19. |
| `TS_BUILD_BLOCKER`: `src/app/layout.tsx` CSS import path blocks every page | `npm run build` passed on 2026-04-30 using Next 16.1.7. The first sandboxed build failed because Turbopack could not bind an internal worker port; rerunning outside sandbox passed. | Mark resolved/not currently reproducible. Keep note that sandboxed builds may need escalation. |
| `HONEYPOT_GAP`: quote section has no honeypot | `QuoteSection.tsx` lines 136-146, `FloatingQuotePanel.tsx` lines 150-174, and `ContactPageClient.tsx` lines 43-57 include hidden `website` honeypot fields; `/api/quote-request` lines 179-182 accepts and silently discards bot submissions. | Mark resolved in current code. |
| `WCAG_SLIDER_KEYBOARD`: before/after slider is drag/touch only | `BeforeAfterSlider.tsx` lines 277-290 define `role="slider"`, `tabIndex={0}`, ARIA values, and Arrow/Home/End keyboard handling. | Mark resolved in current code. |
| SB-1: real phone number must be on public pages | `src/lib/company.ts` lines 1-4 sets `(512) 825-2212` / `+15128252212`; public surfaces import and render `tel:` links broadly, including `HeroSection.tsx`, service pages, footer, header, contact, careers, privacy, and terms. | Mark mostly resolved; next pass should spot-check rendered output, not re-open as a generic gap. |
| `CRON_NOT_WIRED`: no `vercel.json` cron triggers | `find Production-workspace -maxdepth 2 -name vercel.json` returned no file; `/api/lead-followup` and `/api/notification-dispatch` still exist. | Still valid unless deployment platform config exists outside repo. |
| `#1047`: `attempts` vs `attempt_count` collision | Code reads/writes `attempts` in `src/lib/notifications.ts` and `src/app/api/notification-dispatch/route.ts`; migrations still include both `attempts` (`0009`) and `attempt_count` (`0018`). | Still valid; needs schema reconciliation and runtime retry proof. |
| `APPLICATION_SOURCE_FIELD`: application form has "How did you hear about us?" | DB/API support exists: `employment_applications.how_did_you_hear` in migration `0012`, API body `howDidYouHear`, insert mapping. UI form does not render or submit that field. | Valid drift, but narrower than stated: schema/API yes, public form no. |
| `CAREERS_NO_DYNAMIC_LISTINGS` | Careers route is static copy plus `EmploymentApplicationForm`; no dynamic job listing fetch/render path. | Still valid. |
| `TIER_FIELD_ABSENT` | No obvious employee tier/level column on `profiles` in migration search. | Future schema consideration only, not Stage 1 blocker. |
| `SOURCE_MAPS_PROD` / `POWERED_BY_HEADER` | `next.config.ts` does not set `productionBrowserSourceMaps` or `poweredByHeader: false`. Source maps default to off, but `X-Powered-By` likely remains default-on unless Next 16 behavior differs. | Verify in deployed headers; add `poweredByHeader: false` as a low-risk hardening task if absent. |

Still-open items that remain high priority for the next validation batch:
- SB-2: hardcoded/fabricated testimonials remain in `TestimonialSection.tsx` and homepage structured data. Owner has deferred replacement until real testimonials exist; report as content/proof risk, not a surprise code defect.
- SB-3: `COMPANY_STATS` remains hardcoded in `src/lib/company.ts` lines 8-13. That may be acceptable as a launch placeholder, but it is not live proof automation.
- NO_BEFORE_PHOTOS: employee completion flow still needs a focused validation pass for before-photo capture vs completion-only photo upload.
- MESSAGING_NOT_REALTIME: employee message refresh appears manual/poll-style; no Supabase Realtime usage found in employee components.
- TCPA consent/STOP handling: public forms collect phone numbers, but this pass did not find explicit unchecked SMS consent checkboxes or inbound STOP webhook handling. This needs a dedicated compliance pass before automated SMS scale-up.
- Access credentials: still needs a focused search for alarm/gate/lockbox code storage, encryption, purge, and audit logging.
- Admin MFA: no validation yet that admin Supabase Auth requires TOTP/MFA. Treat as a P1 verification item from this document, not as proven implemented.

Recommended document cleanup:
1. Move all known-gap bullets into a `Validation Ledger` with `Current status`, `Evidence`, and `Next action`.
2. Split the OWASP/TCPA/CAN-SPAM block into separate required sections in the output contract instead of appending them after Section H.
3. Change "DO NOT REDISCOVER" to "DO NOT ASSUME; validate current code and update status."
4. Add a rule that any item proven resolved should be marked `Resolved (Code)` or `Resolved (Build Verified)` with date and command evidence.
5. Keep the one-document output requirement only for the final report; use batch notes during investigation so the audit does not become too broad to finish.

## Verification Ledger

Status key:
- `Resolved (Build Verified)`: current code passed a command-level check.
- `Resolved (Code)`: current code contains a direct implementation; runtime/browser proof may still be useful.
- `Verified Open`: current code still has the gap.
- `Partial`: some implementation exists, but the claim is only partly satisfied.
- `Runtime Pending`: code artifacts exist, but target database/deployment/runtime proof is still required.

### Batch 1 — Section 2.2 Known Gaps

Date: 2026-04-30

| ID | Status | Evidence | Next action |
| --- | --- | --- | --- |
| TS_BUILD_BLOCKER | Resolved (Build Verified) | `npm run build` in `Production-workspace` passed on 2026-04-30 with Next.js 16.1.7. Initial sandbox run failed because Turbopack could not bind an internal worker port; escalated run passed. `src/app/layout.tsx:2` still imports `@/styles/globals.css`, but it is not currently a build blocker. | Do not reopen unless a normal build reproduces a CSS path error. |
| SB-1 real phone + `tel:` links | Resolved (Code) | Canonical phone constants are live in `src/lib/company.ts:1-4`; public surfaces broadly import `COMPANY_PHONE_E164` and render `tel:` links, including hero, header, footer, service pages, contact, careers, privacy, terms, FAQ, service-area, and industry pages. | Browser spot-check key public pages during final QA. |
| SB-2 testimonial authenticity | Verified Open | Testimonials remain hardcoded in `src/components/public/variant-a/TestimonialSection.tsx:17-54`; homepage review structured data duplicates those names/quotes in `src/app/(public)/page.tsx:55-75`. | Keep as content/proof risk until real testimonials are supplied or section is reframed as unattributed sample/case proof. |
| SB-3 hardcoded company stats | Verified Open | `COMPANY_STATS` remains hardcoded in `src/lib/company.ts:8-13` (`500+`, `15+`, `1hr`, `100%`) and is not DB-backed proof automation. | Either replace with verified owner-approved claims or wire to real operational metrics later. |
| HONEYPOT_GAP | Resolved (Code) | Hidden `website` honeypots exist in `QuoteSection.tsx:136-146`, `FloatingQuotePanel.tsx:150-174`, and `ContactPageClient.tsx:43-57`; `/api/quote-request` silently accepts/discards filled honeypot submissions at `src/app/api/quote-request/route.ts:179-182`. | Keep; no action unless adding TCPA consent fields to same forms. |
| SERVICE_PAGE_GENERIC | Partial | `src/data/services.ts:18-86` service-card copy remains generic and not Austin-specific. Service detail pages have Austin in metadata, and post-construction has body copy at `post-construction-cleaning/page.tsx:101`; commercial/final/move/windows pages mostly use Austin in title/meta/alt but not main visible body copy (`commercial-cleaning/page.tsx:98-146`, `final-clean/page.tsx:98-146`, `move-in-move-out-cleaning/page.tsx:98-146`, `windows-power-wash/page.tsx:98-146`). | Add natural Austin/Central Texas/local buyer context to visible body copy for the four generic detail pages and optionally service-card descriptions. |
| NO_BEFORE_PHOTOS | Verified Open | Employee upload path is completion-only: `uploadCompletionAsset` writes storage under `completion/...` and inserts `photo_type: "completion"` in `EmployeeTicketsClient.tsx:166-205`; UI renders only `EmployeePhotoUpload` for completion photos at `EmployeeTicketsClient.tsx:704-714`. Schema supports richer types in later bootstrap (`job_photos.photo_type` check includes `before`, `during`, `after`, `issue` at `0018_core_schema_bootstrap.sql:578-579`), but UI does not capture before photos. | Add before-photo capture step or explicitly defer as proof-automation gap. |
| NO_SEED_SCRIPT | Verified Open | `supabase/` contains migrations and temp metadata only; no seed file/script found. Existing inserts are config/template migrations such as storage buckets, automation settings, and quote templates, not end-to-end admin demo/test data. | Add a controlled seed/demo script or keep first-run wizard as the intended setup path and update docs accordingly. |
| MESSAGING_NOT_REALTIME | Verified Open | Employee assignments select joined `job_messages` at `EmployeeTicketsClient.tsx:304`; new messages insert at `EmployeeTicketsClient.tsx:473`; refresh is manual via `loadAssignments` button at `EmployeeTicketsClient.tsx:644-650`. No `channel()`, `postgres_changes`, or Supabase Realtime subscription found in employee messaging components. | Decide whether realtime is pre-launch necessary; otherwise document as post-launch reliability/UX upgrade. |
| CRON_NOT_WIRED | Verified Open | `/api/lead-followup` and `/api/notification-dispatch` exist, but `find Production-workspace -maxdepth 2 -name vercel.json` returned no file. | Add `vercel.json` cron configuration or document external scheduler if managed outside repo. |
| WCAG_GOLD_CONTRAST | Verified Open | Gold token is `#C9A94E` in `tailwind.config.js:16-17` and `src/styles/globals.css:9`; normal-size gold text is used on dark and light surfaces, e.g. `ServiceAreaSection.tsx:180`, `CareersSection.tsx:67`, `FooterSection.tsx:18`, `services/page.tsx:170`, `contact/page.tsx:272`. | Replace normal-size gold text with accessible token variants; keep gold for large/decorative/icon accents where contrast is acceptable. |
| WCAG_SLIDER_KEYBOARD | Resolved (Code) | `BeforeAfterSlider.tsx:277-290` defines `role="slider"`, `tabIndex={0}`, ARIA values, and Arrow/Home/End keyboard behavior. | Browser test keyboard behavior during final accessibility QA. |
| WCAG_LANG_ES | Verified Open | Root remains `<html lang="en">` at `src/app/layout.tsx:47`; Spanish/bilingual strings appear without scoped `lang="es"`, including employee UI and employment form text (`EmploymentApplicationForm.tsx:86-204`, `EmployeeMessageThread.tsx:63`, `EmployeeIssueReport.tsx:45`, `AIQuoteAssistant.tsx:32`). | Add `lang="es"` around Spanish-only strings/sections or separate bilingual labels carefully. |
| WCAG_CAROUSEL_LIVE | Verified Open | Testimonial carousel section/container lacks `aria-live`; current relevant markup is `TestimonialSection.tsx:146-212`. | Add polite live region to the changing testimonial content, respecting reduced motion/pause behavior. |
| SKIP_LINK_TABINDEX | Verified Open | Skip link targets `#main-content` in `src/app/layout.tsx:50-56`, but target is `<div id="main-content">` without `tabIndex={-1}` at line 56. | Add `tabIndex={-1}` to the target wrapper or move the id to a focusable main element. |
| DISABLED_BUTTON_OPACITY | Verified Open | Many disabled states still use opacity-only classes, e.g. `EmployeePhotoUpload.tsx:33`, `EmploymentApplicationForm.tsx:203`, `QuoteResponseClient.tsx:106/114`, `NotificationCenterClient.tsx:283/305`, `LeadPipelineClient.tsx:718/760/969/1119`, `InventoryManagementClient.tsx:333/514/524/534`, and more. | Replace repeated disabled opacity styles with explicit disabled color tokens/component classes. |

### Batch 2 — Sections 2.3 and 2.4 Runtime/Env Risks

Date: 2026-04-30

#### Section 2.3 Runtime Risks

| ID | Status | Evidence | Next action |
| --- | --- | --- | --- |
| SB-6 signup role escalation | Runtime Pending | Code/migration evidence is improved: `handle_new_user()` reads role from `raw_app_meta_data` in `supabase/migrations/0018_core_schema_bootstrap.sql:108-122` and `0024_fix_handle_new_user_role_source.sql:4-22`. `solutioning-guide.md:179` and `:386` still mark this `Partial` pending target DB migration/runtime exploit-regression proof. | Apply/confirm migration on target Supabase DB and capture proof that user-controlled `raw_user_meta_data.role` cannot create an admin profile. |
| C-40 multi-crew RLS | Runtime Pending | Assignment RLS allows employee self-read/update by `employee_id = auth.uid()` in `0018_core_schema_bootstrap.sql:393-407`; baseline job policy in `0001_mvp_core.sql:204-218` permits jobs with matching assignment rows. Evidence log still says runtime proof is blocked/pending (`feedback3.0-validation-evidence-2026-04-11.md:126`, `:299-304`). | Seed Employee A/B + multi-assignee job data and verify each employee can see only intended assignment/job surfaces in the live app. |
| #1047 attempts vs `attempt_count` | Verified Open | Runtime code selects/updates `attempts` in `src/app/api/notification-dispatch/route.ts:14-23`, `:99-151`, and `:310-314`; notification queue insertion writes `attempts` in `src/lib/notifications.ts:435-460`. Migrations still introduce both `attempts` (`0009_notification_dedup_and_attempts.sql:44`) and `attempt_count` (`0018_core_schema_bootstrap.sql:807-817`). `solutioning-guide.md:265` marks this `Verified Open`. | Reconcile schema to one canonical retry column and capture a dispatch retry row proof after migration. |

#### Section 2.4 Environment Configuration Audit

| Env var(s) | Status | Current behavior | Evidence | Next action |
| --- | --- | --- | --- | --- |
| `ADMIN_ALERT_PHONE` | Partial | Startup validation warns only as "recommended"; quote submission falls back to first admin profile phone and silently skips admin SMS if neither exists. Lead-followup reports a skipped reason when no admin phone exists. | `src/lib/env.ts:121-125`; `src/app/api/quote-request/route.ts:410-446`; `src/app/api/lead-followup/route.ts:298-308`. | For quote requests, log a warning or surface telemetry when no admin alert destination exists. Consider making this required for production. |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` | Resolved (Code) | Included in required server startup validation; `sendSms` returns structured config failure instead of crashing; upstream callers generally warn or return structured errors. | `src/lib/env.ts:48-61`, `:152-159`; `src/lib/notifications.ts:164-176`; quote ack failure warning at `quote-request/route.ts:451-459`. | Runtime test with Twilio intentionally absent/present before launch. |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Resolved (Code) / Partial by route | Included in required startup validation. Shared resilient email path fails loudly via `requireServerEnv`; completion-report and employment routes return structured "Email not configured" results without crashing. | `src/lib/env.ts:48-61`; `src/lib/resilient-email.ts:105-108`; `completion-report/route.ts:82-89`; `employment-application/route.ts:310-317`. | Prefer shared resilient email helper everywhere so missing-env behavior is consistent and logged. |
| `CRON_SECRET` | Resolved (Code) | Included in required startup validation; cron auth fails closed and logs when missing. | `src/lib/env.ts:48-61`; `src/lib/cron-auth.ts:12-23`; middleware invokes validation at `middleware.ts:13-14`. | Add repo-level `vercel.json` cron wiring; env handling itself is acceptable. |
| `ENRICHMENT_TOKEN_SECRET` | Resolved (Code) | Included in required startup validation; quote route uses `requireServerEnv` and returns 500 with logged config error if absent. | `src/lib/env.ts:48-61`; `src/app/api/quote-request/route.ts:67-69`, `:184-195`. | Runtime test quote step-1/step-2 token path. |
| `NEXT_PUBLIC_APP_URL` / site URL | Verified Open | `NEXT_PUBLIC_APP_URL` is not required by `getPublicEnv`; `getSiteUrl()` actually prefers `NEXT_PUBLIC_SITE_URL` and silently falls back to `http://localhost:3000`; post-job settings can fall back to `https://example.com`. This can generate wrong production links without a warning. | `src/lib/env.ts:19-23`; `src/lib/site.ts:1-12`; `src/lib/post-job-settings.ts:19-24`. | Standardize on one public site URL env var, validate it in production, and warn/fail when it falls back to localhost/example. |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Partial | `getPublicEnv()` throws if missing, protecting most Supabase clients. `conversion-event` bypasses that helper and returns `{ ok: true }` silently if either is missing, dropping analytics without a log. | `src/lib/env.ts:19-34`; `src/lib/supabase/client.ts:5-7`; `src/lib/supabase/server.ts:6-10`; `src/app/api/conversion-event/route.ts:22-27`. | Update conversion-event route to use central env helper or at least log/telemetry on missing env. |
| `SUPABASE_SERVICE_ROLE_KEY` | Resolved (Code) | Included in required startup validation and required by `createAdminClient()` through `requireServerEnv`; missing key throws instead of silently disabling admin/server writes. | `src/lib/env.ts:48-61`; `src/lib/supabase/admin.ts:5-14`. | Runtime smoke against target deployment env. |

### Batch 3 — Section 5 P0 Critical Flow Verdicts

Date: 2026-04-30

| Flow | Verdict | Evidence | Blocker / next action |
| --- | --- | --- | --- |
| Flow 1 — Public site to admin pipeline | PARTIAL | Public forms call `/api/quote-request` through `useQuoteForm.ts:186-346`; route validates, dedups, inserts `leads`, dispatches admin SMS, and sends submitter SMS/email at `quote-request/route.ts:300-520`; admin lead board renders leads in `LeadPipelineClient.tsx:630-714`; conversion events are client-side at `useQuoteForm.ts:221-304` and insert via `conversion-event/route.ts:31-42`. | Admin SMS can silently skip if no `ADMIN_ALERT_PHONE` or admin profile phone (`quote-request/route.ts:418-446`), and conversion tracking silently returns success if Supabase public env is missing (`conversion-event/route.ts:22-27`). Add warning/telemetry and run live form-to-admin test. |
| Flow 2 — Quote lifecycle | PARTIAL | Admin quote creation calls `/api/quote-send` in `LeadPipelineClient.tsx:425-488`; API creates quote, line item, token, PDF/email/share link at `quote-send/route.ts:34-216`; public token page loads without session by `public_token` at `quote/[token]/page.tsx:11-29`; client response posts to `/api/quote-response` at `QuoteResponseClient.tsx:18-46` and updates quote/lead status at `quote-response/route.ts:13-76`; admin job creation from accepted quote calls `/api/quote-create-job` at `LeadPipelineClient.tsx:540-582`, with API job/client/assignment creation at `quote-create-job/route.ts:93-260`. | Job creation is manual admin action after acceptance, not automatic; public quote token has no expiry/single-use enforcement beyond status idempotence; runtime proof pending. Verify accepted-quote-to-job in browser and decide whether manual job creation is acceptable for launch. |
| Flow 3 — Employee execution | PARTIAL | Assignment notification path exists in `assignment-notifications.ts:160-220`; employee page renders portal at `src/app/(employee)/employee/page.tsx:19-29`; employee assignment query filters by current user at `EmployeeTicketsClient.tsx:290-307`; status updates and completion-triggered report call are at `EmployeeTicketsClient.tsx:386-430`; checklist persists via Supabase updates at `EmployeeTicketsClient.tsx:433-454`; message insert/refetch is at `EmployeeTicketsClient.tsx:456-487`; issue reporting and offline photo queue exist at `EmployeeTicketsClient.tsx:489-550`; completion photo upload/offline queue at `EmployeeTicketsClient.tsx:552-607`. | Employee A/B runtime isolation remains pending under C-40; photos are completion/issue only, not before-photo proof; messages are refetch/manual, not realtime. Run employee E2E with two identities and add before-photo capture if proof automation remains pre-launch scope. |
| Flow 4 — QA + completion report | PARTIAL | Admin QA approval can auto-trigger completion report at `TicketManagementClient.tsx:336-360` and `OperationsEnhancementsClient.tsx:501-530`; completion-report API enforces admin/employee role and employee assignment ownership at `completion-report/route.ts:274-322`, gathers assignments/issues/photos/checklist at `:374-420`, persists report at `:465-480`, updates job at `:494-504`, logs telemetry at `:520-552`; post-job sequence starts only when `autoTriggered && qaApproved` at `:506-518`; sequence sends customer completion email if client email exists at `post-job-sequence.ts:187-242`. | The auto-trigger path does not send the actual completion report email to the client unless recipients are supplied; it starts the post-job sequence/customer completion notice. Manual admin report emailing exists in `OperationsEnhancementsClient.tsx:549-580`. Clarify product expectation: completion-report email vs post-job completion notice, then run QA-approved job test. |
| Flow 5 — Authentication boundaries | PARTIAL | Middleware protects `/admin`, `/employee`, `/auth`, and `/api` at `middleware.ts:112-118`; admin route requires `context.role === "admin"` at `src/lib/middleware/auth.ts:124-143`; employee route allows employee or admin at `:150-172`; API `authorizeAdmin()` verifies Supabase user and profile role at `src/lib/auth.ts:43-73`; quote token page intentionally bypasses session by `public_token` at `quote/[token]/page.tsx:15-24`; service-role key is centralized server-side through `createAdminClient()` and `requireServerEnv` at `src/lib/supabase/admin.ts:5-14`. | Middleware auth fails open if Supabase public env is missing (`src/lib/middleware/auth.ts:77-84`); employee cross-assignment runtime proof is still pending (C-40); public quote tokens are bearer tokens with no expiry. Tighten fail-open behavior and capture runtime auth/RLS evidence. |

### Batch 4 — Later Explicit Bullets and Security Hardening Checks

Date: 2026-04-30

| ID | Status | Evidence | Next action |
| --- | --- | --- | --- |
| CAREERS_NO_DYNAMIC_LISTINGS | Verified Open | Careers page is static copy plus one application form; role/process cards are hardcoded in `src/app/(public)/careers/page.tsx:86-132`, and no job-listing fetch/render path was found. | Add a lightweight open-roles data source if dynamic hiring listings are needed for launch; otherwise mark intentionally static. |
| APPLICATION_SOURCE_FIELD | Partial | Schema/API support exists: `howDidYouHear?: string` in `src/app/api/employment-application/route.ts:29`, insert mapping to `how_did_you_hear` at `:473`, and DB column in `supabase/migrations/0012_employment_applications.sql:78` / `:108`. Public UI does not render or submit it: `EmploymentApplicationForm.tsx:33-44` POST body omits source, and fields at `:83-198` include no source input. | Add "How did you hear about us?" to the public form or remove stale schema/API support until needed. |
| TIER_FIELD_ABSENT | Verified Open | Profiles schema has role/language/active fields but no employee tier/level: baseline `profiles` in `0001_mvp_core.sql:21-29`; bootstrap `profiles` in `0018_core_schema_bootstrap.sql:19-38`. | Treat as future scheduling/quality rubric work, not a Stage 1 blocker unless pricing/crew assignment logic depends on tiers. |
| MARKETING_VS_TRANSACTIONAL_EMAIL | Resolved (Code) / Scope Note | Email sends found are transactional: quote send (`quote-send/route.ts:165`), lead acknowledgment/dead-letter (`quote-request/route.ts:465-503`), employment application notifications (`employment-application/route.ts:310-365`), completion report (`completion-report/route.ts:82-137`), and post-job completion notice (`post-job-sequence.ts:211-216`). No newsletter/bulk marketing send path was found. | If marketing email is added later, add unsubscribe and physical mailing address requirements before sending. Current code should keep privacy copy aligned with transactional-only behavior. |
| META_PIXEL_ID / marketing pixels | Resolved (Code) | Search found no `META_PIXEL`, `NEXT_PUBLIC_META_PIXEL_ID`, or pixel implementation outside this document. Attribution tracking is UTM/click-id capture and first-party conversion insertion, not Meta Pixel. | No pixel compliance action unless a pixel is added later. |
| SOURCE_MAPS_PROD | Resolved (Default) / Deploy Verify | `next.config.ts:9-41` does not enable `productionBrowserSourceMaps`; Next production browser source maps are off by default. | Verify deployed static assets do not expose source maps during launch QA. |
| POWERED_BY_HEADER | Verified Open | `next.config.ts:9-41` does not set `poweredByHeader: false`, so `X-Powered-By` may remain enabled depending on current Next runtime behavior. | Add `poweredByHeader: false` as low-risk hardening and verify response headers in deployment. |
| ADMIN_AUTH_NO_MFA | Verified Open | Admin login uses password auth only at `src/app/(auth)/auth/admin/AdminAuthClient.tsx:29`; repository search found no MFA/TOTP/factor/AAL enforcement. | Decide whether admin MFA is pre-launch P1; if yes, enforce Supabase MFA/AAL for admin sessions. |
| SECURITY_EVENTS_TABLE | Verified Open | Search found no `security_events` table or implementation in `src/` or migrations. | Add only if needed for launch audit trails; otherwise record as post-launch security observability work. |
| ACCESS_CREDENTIAL_AUTO_PURGE | Verified Open / Product Risk | No dedicated encrypted access-credential table or purge job was found. Ticket creation still invites plaintext entry of sensitive access details in scope notes (`TicketManagementClient.tsx:514-522`, placeholder includes "lockbox"). Generic `jobs.scope` exists in `0001_mvp_core.sql:78`. | Avoid storing lockbox/alarm/gate codes in scope notes. Add a dedicated encrypted/expiring access-instructions field or remove that prompt before launch. |
| PUBLIC_TOKEN_ENTROPY | Resolved (Code) | Quote public tokens are generated from UUID v4 without hyphens at `quote-send/route.ts:88-90` (32 hex chars, about 122 bits entropy). Enrichment tokens use HMAC-protected payloads with TTL in `quote-request/route.ts:46-83`. | Keep; separately address quote-token expiry/single-use if product risk warrants it. |
| QUICKBOOKS_WEBHOOK_VERIFIER_TOKEN | Not Applicable / Verified Absent | Search found no QuickBooks webhook route or Intuit signature/verifier-token implementation. Existing QuickBooks code appears to cover OAuth/sync, not inbound webhooks. | If inbound QuickBooks webhooks are added, require signature/verifier validation then. |
| NEXT_PUBLIC secret exposure | Resolved (Code) / Env Review | `NEXT_PUBLIC_*` vars in `.env.example` are Supabase URL/anon key, app URL, employee-inventory flag, and dev-preview flag; secret-like vars remain server-only (`SUPABASE_SERVICE_ROLE_KEY`, Twilio, Resend, QuickBooks secrets, Upstash token, Anthropic key). | Keep reviewing deployment env names; never prefix secret tokens/keys with `NEXT_PUBLIC_`. |

### Batch 5 — OWASP Top 10 Static Sweep

Date: 2026-04-30

| OWASP category | Verdict | Evidence | Required action |
| --- | --- | --- | --- |
| A01 Broken Access Control | FAIL | Most admin APIs use `authorizeAdmin()` (`src/lib/auth.ts:43-73`) and cron routes use `authorizeCronRequest()` (`lead-followup/route.ts:234-245`, `post-job-scheduler/route.ts:46-50`). One admin-triggered route is exposed: `/api/lead-message` is called by the admin lead UI (`LeadPipelineClient.tsx:232`) but the route itself creates a service-role client and sends SMS without `authorizeAdmin()` at `src/app/api/lead-message/route.ts:14-50`. Middleware only rate-limits `/api/*`; it does not authenticate API routes. | Add `authorizeAdmin()` to `/api/lead-message` before any DB lookup/SMS send. Then search all API routes for service-role writes without auth again. |
| A02 Cryptographic Failures | PARTIAL | QuickBooks OAuth tokens are encrypted with AES-256-GCM and random IVs in `src/lib/quickbooks.ts:89-112`, with env validation for a 32-byte hex key. No dedicated encrypted storage/purge path exists for building access credentials, and ticket scope notes can invite plaintext lockbox details (`TicketManagementClient.tsx:514-522`). | Keep QuickBooks implementation; remove plaintext lockbox prompt or add encrypted expiring access-instructions storage. |
| A03 Injection | PARTIAL | Supabase query paths use structured query builders, not handwritten SQL. Public quote email content escapes key fields via `sanitize()` before interpolation (`quote-request/route.ts:360-363`, `:423`). Employment application fields are sanitized before DB/email use (`employment-application/route.ts:81`, `:439-475`). Structured-data `dangerouslySetInnerHTML` calls serialize static/data objects with `JSON.stringify`, not raw user HTML. | Still review `completion-report` and employment email templates for all interpolated DB fields before launch; no direct SQL injection path found in static review. |
| A04 Insecure Design | PARTIAL | Quote response uses bearer `public_token` only (`quote-response/route.ts:21-33`), and accepted/declined quotes become idempotent only after status changes (`:39-57`). Token entropy is acceptable, but tokens lack expiry/single-use semantics beyond status. Rate limiting exists globally, but Upstash outage/missing config degrades allow-all (`rate-limit.ts:83-107`). | Decide whether quote expiry is a launch requirement; add telemetry/warnings for degraded rate limiting in production and consider fail-closed for sensitive routes. |
| A05 Security Misconfiguration | PARTIAL | Middleware applies `nosniff`, `DENY` frame policy, referrer policy, permissions policy, and production HSTS (`security-headers.ts:11-25`). Missing hardening remains: no CSP in that helper, `next.config.ts:9-41` lacks `poweredByHeader: false`, and middleware auth fails open if Supabase public env vars are missing (`middleware/auth.ts:77-84`). | Add `poweredByHeader: false`, consider a CSP compatible with current inline JSON-LD/scripts, and fail closed for protected route auth-env misconfiguration. |
| A06 Vulnerable Components | FAIL | `npm audit --audit-level=high --omit=dev` completed with 6 vulnerabilities: 2 high (`next` Server Components DoS, `picomatch` glob issues) and 4 moderate (`brace-expansion`, `postcss`, `uuid` via Sentry webpack plugin). `package.json` currently pins `next` `^16.1.7`, `postcss` `^8.5.8`, and `@sentry/nextjs` `^10.45.0`. | Run `npm audit fix`, review lockfile/package changes, rebuild, and retest. Treat the Next DoS advisory as P1 before public launch. |
| A07 Identification & Authentication Failures | PARTIAL | Admin login is password-only (`AdminAuthClient.tsx:29`) with no MFA/TOTP/AAL enforcement found. Route-level admin checks exist in shared API helper (`auth.ts:43-73`) and middleware (`middleware/auth.ts:124-143`), but `/api/lead-message` bypasses route auth. | Fix `/api/lead-message`; decide on Supabase MFA enforcement for admin sessions. |
| A08 Software & Data Integrity Failures | PARTIAL | Twilio inbound post-job rating webhook verifies `x-twilio-signature` by default and rejects missing/invalid signatures (`post-job-rating/route.ts:132-160`), with an explicit `TWILIO_ALLOW_UNSIGNED_WEBHOOK` escape hatch. QuickBooks inbound webhooks are absent, so verifier-token concern is not applicable yet. Uploads compress to JPEG and force `contentType: "image/jpeg"` (`EmployeeTicketsClient.tsx:180-185`, `:227-232`), but validation is client-side only. | Ensure `TWILIO_ALLOW_UNSIGNED_WEBHOOK` is never enabled in production. Consider server-side upload validation or storage policies that reject non-image/excessive objects. |
| A09 Security Logging & Monitoring Failures | PARTIAL | Middleware logs request status/rate-limit/auth-failure context (`middleware.ts:65-103`), rate-limit degraded mode emits warning and Sentry fallback telemetry (`rate-limit.ts:83-93`), and post-job/notification paths log some telemetry. There is no `security_events` table and no special audit trail for access credentials because no dedicated credential store exists. | Add security-event logging only for high-value events first: admin auth failures, protected API authorization failures, rate-limit degraded production mode, and any future access credential reads/writes. |
| A10 SSRF | PASS / Low Exposure | Static review found external `fetch()` calls target fixed provider URLs: Anthropic (`ai-assistant/route.ts:85-100`), Twilio (`notifications.ts:186-187`), Resend (`resilient-email.ts:59`, `:114`), and QuickBooks fixed API endpoints (`quickbooks.ts:7-16`, downstream requests). No user-supplied URL fetch path or remote photo ingestion path was found. | Re-check if AI/browser-assistant features later accept URLs or if upload-from-URL is added. |

### Batch 6 — TCPA / CAN-SPAM / Privacy-Policy Static Sweep

Date: 2026-04-30

| Compliance item | Verdict | Evidence | Required action |
| --- | --- | --- | --- |
| TCPA consent capture | FAIL | Public quote/contact forms collect required phone numbers (`QuoteSection.tsx:175-189`, `ContactPageClient.tsx:87-99`) and submit them via `useQuoteForm.ts:203-212` / `:320-344`. No unchecked consent checkbox or exact consent language is rendered; quote section only says "We never share your information" at `QuoteSection.tsx:277`. Employment form has a broad "consent to be contacted" line at `EmploymentApplicationForm.tsx:207-208`, not SMS-specific TCPA language. | Add unchecked consent checkbox + exact SMS disclosure to every phone-collecting form that can trigger outbound SMS, or stop sending SMS from those submissions until consent is captured. |
| TCPA "not a condition of purchase" clause | FAIL | No form text matching the required "This consent is not a condition of purchasing any service" clause was found. Privacy page mentions STOP and transactional SMS, but not this clause at the form point of capture. | Add the clause to the consent label on quote/contact forms and persist the accepted version. |
| TCPA consent columns | FAIL | Search found no `consent_given`, `consent_timestamp`, `consent_method`, `sms_consent`, `opt_out`, or equivalent columns in migrations/source. Current tables store phone numbers without a consent ledger. | Add consent fields to `leads`/clients/post-job contact records, including timestamp, method, text version, source form, and IP/user-agent if retained. |
| TCPA consent enforcement on dispatch | FAIL | `sendSms()` sends to any provided number with no consent/opt-out check (`notifications.ts:164-225`). `dispatchSmsWithQuietHours()` checks preferences, dedup, and quiet hours (`notifications.ts:510-560`) but not contact consent or opt-out. Direct admin quick-message route sends SMS through `sendSms()` at `lead-message/route.ts:40`. | Centralize SMS dispatch behind consent/opt-out enforcement; remove direct `sendSms()` use for customer-facing sends. |
| TCPA STOP processing | FAIL | The only inbound Twilio webhook found is post-job rating parsing (`post-job-rating/route.ts:116-181`), which treats inbound text as a 1-5 rating or clarification flow. No STOP/UNSUBSCRIBE handling updates an opt-out field because no opt-out field exists. Privacy page claims users can reply STOP at `privacy/page.tsx:648-652`, creating doc-vs-code drift. | Add signed inbound SMS STOP handler, persist opt-outs, and have all outbound SMS paths suppress opted-out numbers. Update privacy copy only after code exists. |
| TCPA sender identification in SMS | PARTIAL | Most SMS templates identify A&A in the body: quote acknowledgment at `quote-request/route.ts:450`, admin quick-message templates at `lead-message/route.ts:5-11`, assignment notifications through assignment message builder, and post-job rating request says "Thanks for choosing A&A Cleaning" at `post-job-scheduler/route.ts:145-149`. They do not consistently start with a standardized `A&A Cleaning:` prefix or include STOP language. | Standardize customer-facing SMS templates with business name and required STOP/rates language where appropriate. |
| TCPA quiet hours by recipient TZ | PARTIAL | Quiet-hours engine supports time zones (`NotificationPreferences.timezone` at `notifications.ts:21-29`; default `America/Chicago` at `:54-62`; DST-aware calculation at `:316-352`). Customer post-job sends do not load a recipient-specific timezone and rely on default preferences in scheduler calls (`post-job-scheduler/route.ts:145-155`, `:207-215`). | For launch in Austin/Central Texas this is probably acceptable, but store/use recipient timezone if serving outside Central Time or if TCPA scope tightens. |
| TCPA marketing/transactional classification | PARTIAL | SMS sends are operational/transactional in intent, but classification is in ad hoc context strings (`post_job_rating_request`, `post_job_review_reminder`, etc.) rather than an enforced `transactional`/`marketing` field. Post-job review reminder (`post-job-scheduler/route.ts:207-215`) is the closest re-engagement-style message and should be explicitly classified. | Add message classification metadata and block marketing sends without consent. |
| CAN-SPAM physical address in marketing email | PASS / Not Applicable Today | Email paths found are transactional: quote email, lead acknowledgment/dead-letter, employment application notification/confirmation, completion report, and post-job completion notice. No bulk/marketing email path found. | If marketing email is added, include physical postal address/footer before launch. |
| CAN-SPAM unsubscribe link functional | PASS / Not Applicable Today | No marketing email template or unsubscribe route was found. Transactional emails are currently not subject to the same marketing unsubscribe footer requirement. | Add unsubscribe table/route before any marketing or re-engagement email campaign. |
| CAN-SPAM email classification | PARTIAL | Email template calls use tags like `lead_ack_email`, `lead_ack_dead_letter`, and `post_job_completion`, but there is no explicit `transactional`/`marketing` classification model. | Add classification metadata to email helper payloads if future marketing email is planned. |
| FTC/DTPA privacy-policy drift | PARTIAL | Privacy page accurately says no Google Analytics/Facebook Pixel at `privacy/page.tsx:428` and no third-party advertising cookies at `:683-687`, matching the code search. It overstates SMS opt-out behavior by saying users can reply STOP at `:648-652` while no STOP processing exists. | Update privacy copy or implement STOP handling before public launch; do not claim behavior that is not implemented. |

### Batch 7 — Active-Folder Consolidation Map

Date: 2026-04-30

Purpose: keep the rest of `blueprint/active` usable without letting stale historical claims override current code evidence.

| Document | Current role | Consolidation action |
| --- | --- | --- |
| `things-for-codex-to-do.md` | Current investigation ledger and launch-readiness audit frame. | Treat this file as the live evidence ledger for the current pass. Continue adding batch results here until the initial audit is complete. |
| `solutioning-guide.md` | Fix-first control plane dated 2026-04-12. It already warns that prior "resolved" claims are proposal-level until matched to current-file evidence. | Keep as the canonical fix/control-plane doc, but update it after this ledger stabilizes. Key stale item: SB-1 is now resolved in code; new item: `/api/lead-message` unauthenticated SMS send must be added. |
| `master-rework-doc-2.0.md` | Historical validation control plane for the earlier 1,060-issue review. | Do not use as current ground truth without revalidation. It is still valuable for runtime proof gates: C-40, SB-6, #1047, quote_templates, automation_settings. |
| `feedback3.0-validation-evidence-2026-04-11.md` | Evidence log from a prior runtime/static validation pass. | Keep as artifact history. Current pass confirms #1047 remains open and C-40/SB-6 remain runtime-pending. |
| `admin-employee-e2e-test-guide.md` | Execution playbook for browser/API/DB validation. | Use after source-level fixes/triage to capture runtime proof. Add `/api/lead-message` auth regression test and TCPA/STOP tests if those features are implemented. |
| `blueprint.md` | As-built product/architecture reference dated 2026-04-13. | Keep as product map, not defect status. Update only after major implemented changes materially alter routes/data flows. |
| `bring-it-to-an-a.md` | Upgrade roadmap independent from fix-first work. | Keep separate. Do not promote upgrades like realtime, command palette, safety modules, or SEO polish ahead of P0/P1 compliance/security closure. |
| `blueprint-feedback.md` | Large companion addendum with safety/compliance/security/AI implementation guidance. | Mine for requirements, but condense into live actionable items. Current pass confirms its TCPA/STOP/MFA/security-events/access-credential warnings are still relevant; many implementation confidence estimates are planning guidance, not evidence. |
| `solutioning-implementation-lock-manifest.md` | Lock manifest to prevent drift on high-risk surfaces. | Review after selecting implementation tasks; add locks for `/api/lead-message`, SMS consent/STOP, notification dispatch retry column, and access credential handling if work begins. |

Recommended next consolidation order:
1. Finish the current ledger's remaining implementation-selection pass.
2. Promote validated findings into `solutioning-guide.md` as the fix-first backlog.
3. Keep `bring-it-to-an-a.md` for post-stabilization upgrades only.
4. Use `admin-employee-e2e-test-guide.md` to capture runtime proof before marking any runtime-pending item closed.

### Batch 8 — Active Doc Reconciliation

Date: 2026-05-07

Scope: focused reconciliation against active docs only. The ledger above remains the current evidence baseline. Items below are reconciliation notes, not code revalidation results.

File: `blueprint-feedback.md`
Status: Items to migrate
Drift entries:
- `blueprint-feedback.md:2917` says the employment form collects 20+ fields and includes transportation, work authorization, specialties, available days, references, and background-check consent. Current ledger Batch 4 narrows the application-source issue and Batch 6 notes weaker consent language; this historical claim should not override current form evidence.
- `blueprint-feedback.md:3141-3143` and `7073-7078` list TCPA consent, consent columns, opt-out instruction, and STOP processing as required checklist items. These align with Batch 6 FAIL findings and should be migrated into the solution plan.
- `blueprint-feedback.md:809-833`, `6485-6497`, and `7005-7008` flag access credential purge/encryption/audit logging and privacy-policy truthfulness. These align with Batch 4 access-credential risk, Batch 5 A02/A09, and Batch 6 FTC drift.
- `blueprint-feedback.md:6991-7007` adds legal weight to SB-2 testimonial authenticity and SB-3 unverified metrics. This aligns with Batch 1; no new ledger item needed.
- `blueprint-feedback.md:7315`, `7336-7338`, `7356-7360`, and `7415` are implementation-confidence notes for MFA, security_events, TCPA consent, and STOP processing. These are planning inputs, not evidence.
New findings to add to ledger:
- None for Batches 1-7. TCPA/STOP, access credential handling, MFA, security events, fake testimonials, hardcoded stats, and privacy drift are already represented.
Items to migrate to archive:
- Historical implementation confidence tables and broad framework material after their actionable requirements are captured in `phase-a-solution-plan.md`.
- Long launch-timeline narrative sections that duplicate the active solution plan.

File: `bring-it-to-an-a.md`
Status: Aligned with ledger
Drift entries:
- `bring-it-to-an-a.md:15-32` explicitly separates `Fix-Aligned`, `Upgrade`, and `Net-New` work; it does not make the upgrade roadmap canonical over the fix ledger.
- `bring-it-to-an-a.md:4000-4102` treats realtime subscriptions as an upgrade; this aligns with Batch 1/3 message-realtime findings and should remain post-launch unless owner promotes it.
- `bring-it-to-an-a.md:5080` and `5622` surface performance optimization, which is now covered by Batch 9 below.
New findings to add to ledger:
- None from this document. No hidden pre-launch P0/P1 was found that is not already represented as a validated gap or planning lens.
Items to migrate to archive:
- Keep active as upgrade backlog. Do not archive yet.

File: `solutioning-guide.md`
Status: Drift found
Drift entries:
- `solutioning-guide.md:174-179` marks SB-1/SB-3/SB-4/SB-5 as `Resolved (Code)` and SB-6 as `Partial`. Batch 1 confirms SB-1 phone is resolved and Batch 2 confirms SB-6 runtime-pending, but Batch 1 still treats `COMPANY_STATS` as hardcoded/unverified proof rather than fully closed. Treat SB-3 status as terminology drift: years consistency may be resolved, proof automation/stat authenticity is not.
- `solutioning-guide.md:245` marks C-70 notification-dispatch auth mismatch as `Resolved (Code)`. The ledger does not currently rely on this older C-70 status; keep it out of launch-blocker counts unless separately revalidated in a future code pass.
- `solutioning-guide.md:260-265` says C-44/C-66 are runtime verified, C-40 partial, and #1047 verified open. This aligns with Batch 2 and Batch 8 references; C-44/C-66 should not be reopened.
- `solutioning-guide.md:316-321` lists duplicate employment email implementation, queue retry semantics, notification relation normalization, normalizeRelation reuse, and divergent auth strategy. Current ledger covers duplicate email behavior partially under env/email consistency, #1047 retry columns, and A01 `/api/lead-message`; do not expand these without a new validation pass.
New findings to add to ledger:
- Ledger Drift: SB-3 naming mismatch. Solutioning guide's "years consistency" closure is narrower than ledger's "hardcoded company stats/proof automation" open item.
Items to migrate to archive:
- Stale resolved/open tables should remain available but should be superseded by this ledger and the future solution plan.

File: `master-rework-doc-2.0.md`
Status: Items to migrate
Drift entries:
- `master-rework-doc-2.0.md:43`, `245-263`, `733`, `825`, and `994-1035` identify SB-6 role escalation and its runtime proof gate. This aligns with Batch 2 runtime-pending.
- `master-rework-doc-2.0.md:58`, `208`, `735`, `857`, `993`, and `1033` identify C-40 multi-crew RLS as partial/open pending runtime proof. This aligns with Batch 2.
- `master-rework-doc-2.0.md:578`, `618-629`, `734`, `858`, `991`, `998`, and `1034` identify #1047 `attempts`/`attempt_count` as open. This aligns with Batch 2.
- `master-rework-doc-2.0.md:72-73`, `146-183`, `971-982`, `1010-1011`, and `1029-1031` show `quote_templates` and `automation_settings` promotion to runtime verified after evidence intake. This should be preserved as resolved runtime evidence, not reopened.
- `master-rework-doc-2.0.md:761-766` contains stale older SB-1/SB-4/SB-5 source-status claims that current ledger supersedes.
New findings to add to ledger:
- None. Use this document only for SB-6, C-40, #1047, C-44, and C-66 runtime-gate history as requested.
Items to migrate to archive:
- Historical raw issue tables and superseded status rows after the solution plan captures current open work.

File: `feedback3.0-validation-evidence-2026-04-11.md`
Status: Aligned with ledger
Drift entries:
- `feedback3.0-validation-evidence-2026-04-11.md:122-128` promotes C-44/C-66 and keeps C-40, #1047, and SB-6 open/pending. This aligns with Batch 2.
- `feedback3.0-validation-evidence-2026-04-11.md:174-179`, `188-189`, `299-328`, and `373-378` confirm the specific runtime blockers: C-40 needs test identities/data, #1047 needs queue row proof and column reconciliation, SB-6 needs post-fix regression proof.
New findings to add to ledger:
- None.
Items to migrate to archive:
- Keep active until runtime proof is captured, then archive with evidence package.

### Batch 9 — Performance / Core Web Vitals

Date: 2026-05-07

| ID | Status | Evidence | Next action |
| --- | --- | --- | --- |
| PERF-1-HERO-LCP-IMAGE | Resolved (Code) | `Production-workspace/src/components/public/variant-a/HeroSection.tsx:130-139` uses `next/image` with `fill`, `priority`, `quality={68}`, and `sizes="100vw"` for the homepage hero image. | Keep as-is. Do not run Lighthouse in Phase A per boundary. |
| PERF-2-IMAGE-SECTIONS | Resolved (Code) | `BeforeAfterSlider.tsx:221-247` uses `next/image` with `fill`, `quality={80}`, responsive `sizes`, and priority only for the first active pair. `ServiceSpreadSection.tsx:73-80` and `300-306` use `next/image` with responsive `sizes`. `TestimonialSection.tsx` and `AuthorityBar.tsx` render no bitmap images. | Keep image optimization pattern; defer detailed LCP validation to post-approval browser proof. |
| PERF-3-DYNAMIC-HEAVY-PUBLIC-WIDGETS | Resolved (Code) | `VariantAPublicPage.tsx:25-40` dynamically imports `BeforeAfterSlider`, `TestimonialSection`, `QuoteSection`, and `ExitIntentOverlay` (`ssr:false` for exit intent). `PublicChrome.tsx:31-42` dynamically imports `FloatingQuotePanel`, `AIQuoteAssistant`, and `ScrollToTopButton` with `ssr:false`. `rg` found Anthropic usage only in `/api/ai-assistant`, not in public client bundles. | Keep dynamic boundaries. No P1 LCP risk found from the requested widgets. |
| PERF-4-HOMEPAGE-CLIENT-BUNDLE | Partial | `VariantAPublicPage.tsx:1` is a client component and synchronously renders above-fold `HeroSection`, `AuthorityBar`, `ServiceSpreadSection`, `OfferAndIndustrySection`, and `TimelineSection` at `VariantAPublicPage.tsx:47-52`. `HeroSection.tsx:1`, `AuthorityBar.tsx:1`, and `ServiceSpreadSection.tsx:1` are all client components; no charting/date/Anthropic SDK client import was found, but several above-fold sections still ship hydration JS. | P2. Post-launch backlog: consider making static above-fold public sections server components where analytics/open-quote callbacks do not require client state. |
| PERF-5-FONT-LOADING | Resolved (Code) | `layout.tsx:1-7` imports metadata/globals only; `layout.tsx:45-58` applies no raw font `<link>`. `globals.css:20-22` uses Tailwind defaults; `rg` found no `next/font`, Google font stylesheet, or raw font preconnect. | No action. System/default font loading creates no raw external-font render blocker. |

### Batch 10 — Cost-Control / Abuse Economics

Date: 2026-05-07

| ID | Status | Evidence | Next action |
| --- | --- | --- | --- |
| COST-1-AI-ASSISTANT-SPEND-CAP | Verified Open | `/api/ai-assistant` is public and rate-limited by IP at `ai-assistant:${ip}` using the strict tier (`route.ts:133-140`; `rate-limit.ts:16-24` = 5 requests/hour). The Anthropic request caps each response at `max_tokens: 220` (`route.ts:94-99`), but no per-session token cap, daily per-IP cap, or monthly spend ceiling was found. | P1. Add app-level session/day/month counters before relying on this public paid route. |
| COST-2-TWILIO-VOLUME-CEILING | Verified Open | Public quote submission sends lead acknowledgment SMS with retry at `quote-request/route.ts:448-455`; admin lead alert SMS is dispatched in the same route at `quote-request/route.ts:430-441`. The shared notification layer dedupes identical recipient/body pairs for 5 minutes (`notifications.ts:71-72`), but no daily/monthly Twilio send ceiling was found beyond route-level rate limiting. | P1. Add an outbound SMS volume ceiling and a safe failure mode for public-triggered SMS. |
| COST-3-RESEND-VOLUME-CEILING | Verified Open | Public quote submission sends acknowledgment email when an email is present (`quote-request/route.ts:462-469`). `resilient-email.ts:97-125` sends through Resend with retry behavior, but no daily send ceiling was found. | P2. Defer to post-launch backlog unless owner expects high public traffic before launch. |
| COST-4-STORAGE-UPLOAD-CAPS | Partial | Client-side photo validation caps files at 10MB in `client-photo.ts:1-14`, and employee uploads go directly to Supabase Storage from the client in `EmployeeTicketsClient.tsx:180-185` / `227-232`. No server-side photo size enforcement or per-employee daily upload cap was found. | P1. Add storage policy/server-side guardrails or an upload API with per-user/day caps before broad employee rollout. |

### Batch 11 — Idempotency / Concurrency

Date: 2026-05-07

| ID | Status | Evidence | Next action |
| --- | --- | --- | --- |
| IDEMP-1-QUOTE-CREATE-JOB-RACE | Verified Open | `LeadPipelineClient.tsx:540-582` calls `/api/quote-create-job`. The route has an in-process idempotency guard (`quote-create-job/route.ts:111-116`) and checks for an existing `jobs.quote_id` before insert (`121-126`), then inserts a job with `quote_id: quote.id` (`198-213`). Migrations show `jobs.quote_id` exists (`0001_mvp_core.sql:73`) but no unique index/constraint on `jobs(quote_id)` was found. Parallel requests on separate instances can pass the precheck and double-insert. | P0. Add a DB-level unique constraint/index for non-null `jobs.quote_id` and make the route handle conflict as idempotent success. Proposed next migration: `0027_unique_jobs_quote_id.sql` because migrations currently run through `0026_ticket_create_atomic.sql`. |
| IDEMP-2-EMPLOYEE-STATUS-BYPASS | Verified Open | `EmployeeAssignmentCard.tsx:153-166` exposes a status `<select>` with all assignment states. `ASSIGNMENT_STATUS_OPTIONS` includes direct `"complete"` at `ticketing.ts:27-31`. `EmployeeTicketsClient.tsx:386-400` writes the selected status directly to `job_assignments`; `407-417` triggers completion report generation when status is complete. Checklist counts are displayed/passed at `EmployeeTicketsClient.tsx:672-696`, but they are not enforced before completion. | P1. Add a targeted state-transition guard and decide whether completion requires checklist and before-photo evidence. |
| IDEMP-3-ASSIGNMENT-NOTIFY-DEDUP | Resolved (Code) | `assignment-notify/route.ts:33-38` uses an idempotency guard for assignment notification; the notification layer also dedupes identical recipient/body pairs for 5 minutes at `notifications.ts:71-72`. | Keep as-is; runtime cron double-fire proof can be captured with admin E2E evidence. |
| IDEMP-4-QUOTE-RESPONSE-RACE | Partial | `/api/quote-response` returns existing final status on replay (`quote-response/route.ts:39-40`), but the update uses only `.eq("id", quote.id)` at `46-58` after the initial read. A simultaneous accept/decline pair can both read a non-final quote and the later update can win. | P1. Make the update conditional on a non-final status and return the winning final state. |

### Batch 12 — Time-Zone Correctness

Date: 2026-05-07

| ID | Status | Evidence | Next action |
| --- | --- | --- | --- |
| TZ-1-SCHEDULING-TODAY-BROWSER-TZ | Verified Open | `SchedulingAndAvailabilityClient.tsx:130-132` computes `today` with `new Date()` in the browser. Initial week/day state also uses browser time at `207-209`, and the "this week" action resets from browser time at `635-638`. Day keys are generated with `toISOString().split("T")[0]` at `145` and `156`, which can shift dates at UTC boundaries. Job grouping uses `new Date(job.scheduled_start)` and local `isSameDay` at `661-665`. | P1. Normalize schedule day math to the business timezone (`America/Chicago`) or an explicit configured business timezone. |
| TZ-2-AUTHORITY-RESPONSE-METRIC | Resolved (Code) | Requested "response-time metric" is not currently rendered by `AuthorityBar.tsx`; the active stats are Years, Projects, On-Time, and Licensed (`AuthorityBar.tsx:15-24`, `111-130`). `COMPANY_STATS.responseTarget` exists at `company.ts:8-13` but is not used by AuthorityBar. | No time-zone action. Keep SB-3 proof/stat-authenticity finding separate. |
| TZ-3-LEAD-FOLLOWUP-CRON-TZ | Partial | Lead thresholds use UTC-safe ISO comparisons against `created_at` (`lead-followup/route.ts:99-101`, `317-345`), which is appropriate for elapsed-hour math. Business-hours gating uses server-local `new Date().getHours()/getDay()` at `103-111`; on Vercel this is typically UTC, while the user-facing reason says Mon-Sat 7AM-9PM at `280-285`. | P1. Use an explicit business timezone for cron business-hours gating; keep elapsed-hour threshold math as ISO/timestamptz. |

# Codex Review Mission: A&A Cleaning Production-workspace

You are a senior staff engineer performing a comprehensive start-to-finish 
audit of a Next.js + Supabase platform for A&A Cleaning Services, a 
commercial cleaning company in Austin, TX. Your output will directly drive 
the final 28-day push to production launch.

---

## 1. WHO YOU ARE

You are reviewing as: a senior staff engineer with experience in Next.js 16 
App Router, React 19, Supabase + RLS, production SaaS for SMBs, accessibility (WCAG 
2.1 AA), and pre-launch hardening. You think in terms of: blast radius, 
silent failure modes, doc-vs-code drift, and "what breaks first under real 
load."

You are NOT reviewing as: a generic best-practices linter, an enterprise 
architect, or a code stylist.

---

## 2. PROJECT GROUND TRUTH (DO NOT REDISCOVER)

This codebase has been audited. The following is established fact. Do not 
spend cycles re-flagging these as gaps — they are intentional or already 
known.

### 2.1 What is genuinely production-grade (don't flag as missing):
- 26-table Supabase schema with comprehensive enums, indexes on all 
  high-traffic query paths, and RLS policies on every sensitive table
- All 10 admin modules execute real Supabase queries (not shells)
- Notification system: quiet-hours queueing, exponential backoff (3 retries 
  max), deduplication, tiered lead alerts (1h/4h/24h), permanent vs 
  transient error classification
- First-party analytics writing to `conversion_events` table via 
  `/api/conversion-event` (no GA4 dependency for core tracking)
- Spanish-first employee portal with bilingual employment application
- API security: Upstash rate limiting (5/hr strict tier on quote/AI/apps), 
  session+role verification on all authed routes, graceful degradation when 
  Upstash unconfigured, env validation on startup
- Accessibility infrastructure: skip link, useFocusTrap hook deployed across 
  modals, StatusAnnouncer for aria-live, focus-visible rings, native form 
  elements, reduced-motion support, 44px touch targets

### 2.2 Known gaps to VALIDATE (not rediscover):
For each of these, confirm they still exist in the code and report 
file:line. If any have been resolved since the prior audit, note that.

- **TS_BUILD_BLOCKER**: previously claimed `src/app/layout.tsx` line 2 CSS import path 
  resolution error blocking every page. 2026-04-30 update: `npm run build` passes outside the sandbox; do not report as open unless reproduced.
- **SB-1**: real phone number must be on every public page with `tel:` link. 2026-04-30 update: canonical phone constants and broad `tel:` usage are present; spot-check rendered pages before reopening.
- **SB-2**: testimonials in code are fabricated — verify location and 
  identify all hardcoded testimonial data
- **SB-3**: `src/lib/company.ts` `COMPANY_STATS` is hardcoded (15+ years, 
  500+ projects, 100% on-time) — not connected to DB
- **HONEYPOT_GAP**: previously claimed blueprint §3.2 item 8 had no implemented
  "anti-spam honeypot". 2026-04-30 update: quote, floating quote, and contact forms include hidden `website` fields and `/api/quote-request` silently discards filled honeypot submissions.
- **SERVICE_PAGE_GENERIC**: `src/data/services.ts` has Austin only in 
  `<title>` metadata, not in body copy of any service detail page
- **NO_BEFORE_PHOTOS**: employee portal photo upload only captures 
  completion (after) photos. No before-photo capture step.
- **NO_SEED_SCRIPT**: nothing in `supabase/` populates test data. Every 
  admin module renders empty on first load.
- **MESSAGING_NOT_REALTIME**: job messages use poll/refetch, not Supabase 
  Realtime
- **CRON_NOT_WIRED**: `/api/lead-followup` and `/api/notification-dispatch` 
  routes exist with full logic but `vercel.json` has no cron triggers — 
  silently disabled
- **WCAG_GOLD_CONTRAST**: gold `#C9A94E` text fails 4.5:1 on white (3.2:1) 
  and navy (3.8:1) — affects any normal-size text using `cta-gold`, 
  `text-gold`, or token references
- **WCAG_SLIDER_KEYBOARD**: previously claimed `BeforeAfterSlider.tsx` was drag/touch only. 2026-04-30 update: slider has keyboard support (`ArrowLeft`, `ArrowRight`, `Home`, `End`) and ARIA slider attributes; do not report as open unless regression is found.
- **WCAG_LANG_ES**: Spanish content sections lack `lang="es"` attribute 
  (root html stays `lang="en"`)
- **WCAG_CAROUSEL_LIVE**: `TestimonialSection.tsx` testimonial container 
  lacks `aria-live="polite"`
- **SKIP_LINK_TABINDEX**: `<div id="main-content">` in `layout.tsx` lacks 
  `tabindex="-1"`, breaking programmatic focus on skip activation
- **DISABLED_BUTTON_OPACITY**: disabled buttons use `opacity-60` instead of 
  explicit accessible color tokens

### 2.3 Open runtime risks per blueprint §11:
- **SB-6**: role escalation runtime exploit-regression validation pending
- **C-40**: multi-crew RLS runtime validation pending
- **#1047**: retry-path runtime proof and `attempts` vs `attempt_count` 
  column reconciliation pending

These are tracked in `blueprint/active/solutioning-guide.md`. If you find 
new evidence relating to any of them in the code, report it.

### 2.4 Required env vars (silent-failure set):
Missing any of these does NOT throw — features just silently disable. 
Verify the code's handling of each is graceful (logs warning, doesn't 
crash) and flag any where missing-env causes silent failure without a 
log:
- `ADMIN_ALERT_PHONE` (CRITICAL — disables ALL lead notifications)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `CRON_SECRET`, `ENRICHMENT_TOKEN_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `SUPABASE_*` (URL, anon key, service role)

---

## 3. BUSINESS CONTEXT (THIS CHANGES WHAT "GOOD" MEANS)

### 3.1 Stage:
**Stage 1 startup, pre-launch.** Target: 0–20 jobs/month from website, 
1–3 crews, June 2026 launch (~4 weeks out). Solo developer + AI assistance. 
Owner is non-technical.

### 3.2 Strategic positioning:
This site is a **subcontractor → prime contractor flip vehicle**. Today, 
the owner gets work distributed by larger companies who take a margin. The 
website's job is to flip that — GCs, property managers, restaurant groups, 
medical offices, event venues, and facility managers must find and hire 
her directly.

**Target buyers:** GCs, property managers, restaurant groups, medical 
offices, event venues, building owners, facility managers.
**Anti-targets:** residential homeowners, generic janitorial commodity 
buyers.

### 3.3 The proof-automation thesis (cross-cutting concern):
Per addendum §51–52, the platform's job is to **generate marketing 
evidence as a byproduct of operations**. Every job completed → before/
after photos, testimonials, verified metrics, response-time proof, QA 
pass rates → all flow back into public site credibility.

When you review code, ask: does this support the proof-automation pipeline? 
Is the data needed for live authority-bar metrics queryable? Are 
testimonials capturable? Are completion photos promote-able to portfolio?

### 3.4 The employee-portal-as-leverage thesis:
Per addendum §51.4, the employee portal is not a "nice feature" — it is 
the mechanism that lets the owner step off the front lines. **Every gap 
in the employee portal escalates in priority** because it directly 
determines whether the owner can scale beyond personal site presence.

### 3.5 Calibrated grading baseline:
Third-party honest assessment ranks this codebase at 7.5/10 overall, with: 
DB 9, Security 8, Architecture 8, Notifications 8, Employee Portal 8, A11y 
8, Admin 7, Public UX 7 (content gap), SEO 6 (content gap), Integrations 6 
(config gap).

This means: **do not flood the report with low-severity polish.** The 
remaining gap to launch is configuration, testing, content, and adoption — 
not code quality. Findings should match this calibration.

---

## 4. REVIEW LENSES (use ALL of these)

For every finding, identify which lens(es) it falls under:

1. **Build/Compile** — does the code compile and run? (TS_BUILD_BLOCKER)
2. **Security & RLS** — auth boundaries, RLS coverage, secret handling, 
   credential storage, SSRF/XSS/CSRF, Supabase service-role usage, token 
   validation
3. **Data integrity** — schema vs code drift, FK/index gaps, enum 
   mismatches, race conditions, idempotency
4. **Silent-failure modes** — missing env vars that disable features 
   without logging, dropped errors, unhandled promise rejections, swallowed 
   exceptions
5. **The 5 P0 critical flows** (see §5 below) — does the code support 
   each end-to-end?
6. **Strategic-fit** — does the code/copy support sub→prime positioning? 
   Any residential/maid-service framing to flag?
7. **Proof-automation** — before/after photos, testimonial capture, 
   live metrics, portfolio-promote flow
8. **Employee-portal leverage** — gaps that force the owner to stay 
   on-site
9. **WCAG 2.1 AA** — only flag NEW findings beyond §2.2 list
10. **SEO** — only flag NEW findings beyond known content gap
11. **Doc-vs-code drift** — places where blueprint claims something the 
    code doesn't deliver (or vice versa)
12. **Texas regulatory** — sales tax on cleaning services (taxable in 
    TX), COI handling, access-credential security per addendum §30.3 
    (most sensitive operational data — encryption, auto-purge, audit log)

---

## 5. THE 5 P0 CRITICAL FLOWS

Trace each of these end-to-end through the code and confirm:
- Every step has an implementation
- Every step has error handling
- Every step has notification/observability
- RLS prevents cross-tenant leakage at every step

**Flow 1 — Public site → admin pipeline:**
Quote form submission → `/api/quote-request` → `leads` table INSERT → 
admin SMS via Twilio (or queue if quiet hours) → submitter ack email via 
Resend → conversion_event written → admin pipeline shows lead.

**Flow 2 — Quote lifecycle:**
Admin creates quote with line items → `/api/quote-send` → token-bearing 
email to client → `/quote/[token]` page → client accepts → 
`/api/quote-create-job` → job record created → admin sees converted lead.

**Flow 3 — Employee execution:**
Job assigned → SMS to employee → employee logs into `/employee` → sees 
ONLY their assignments → status progression (assigned → en_route → 
in_progress → complete) → checklist completion (Spanish, persists on 
refresh) → photo upload (offline queue if no signal) → issue report → 
message thread.

**Flow 4 — QA + completion report:**
Admin reviews completed job → approves/rejects QA → `/api/completion-
report` → client receives report email → post-job sequence triggers 
(rating request → review request).

**Flow 5 — Authentication boundaries:**
- Employee cannot access `/admin` routes
- Employee A cannot see Employee B's assignments
- Unauthenticated cannot access either dashboard
- Token-based quote review works without session
- Service-role key never reaches client bundle

For each flow, output: `PASS / PARTIAL / FAIL` with file:line evidence.

---

## 6. SEVERITY RUBRIC

Use these and ONLY these severity levels. Match the calibration in §3.5 — 
this is a 7.5/10 codebase, not a death-march cleanup.

- **P0 — Launch blocker.** Breaks one of the 5 P0 flows, exposes data, 
  or prevents build. Must fix before June launch.
- **P1 — Critical pre-launch.** Silent failure, security edge case, 
  WCAG AA violation, doc-vs-code drift on a public-facing claim. Should 
  fix in the 28-day window.
- **P2 — Post-launch week 1–4.** Quality issue that doesn't block 
  launch but affects real-usage reliability or owner adoption.
- **P3 — Backlog / triggered.** Real issue but matches an "on-deck" or 
  "archive" trigger from addendum §18 — flag and forget unless trigger 
  fires.

**Severity discipline:**
- DO NOT flag missing OSHA logs, fleet management, multi-location 
  support, NPS, etc. as P0/P1. Per addendum §18.3 these are archive-
  tier (Stage 1 doesn't need them).
- DO NOT flag "no automated test suite" as P0. Manual testing is the 
  Day 2–3 plan.
- DO escalate any RLS gap, any silent-env-failure, any WCAG-AA-scannable 
  violation, any SB-1/SB-2/SB-3 leakage to public-facing surface.

---

## 7. OUTPUT CONTRACT

Produce ONE document with these sections, in this order. Be terse. No 
filler. No restating my prompt back to me.

### Section A — Executive Summary (≤200 words)
Top 5 launch-blocking findings, the 5 P0 flow verdicts, and one paragraph 
calibrating overall production-readiness vs the 7.5/10 baseline.

### Section B — 5 P0 Flow Verdicts
One row per flow:
| Flow | Verdict | Evidence (file:line) | Blocker if any |

### Section C — Findings Table
One row per finding. Sort by severity (P0 first), then by lens.

| ID | Severity | Lens(es) | File:Line | Finding | Suggested Fix | Effort |

Effort scale: `15m`, `1h`, `2h`, `1d`, `2-3d`, `1w+`.

ID format: `F-001`, `F-002`, etc. Use these exact prefixes if applicable: 
`F-RLS-`, `F-ENV-`, `F-A11Y-`, `F-DRIFT-`, `F-PROOF-`, `F-PORTAL-`, 
`F-TX-`.

### Section D — Doc-vs-Code Drift Map
Table of every place where `blueprint.md` or addendum claims something 
the code does not implement (or implements differently). Beyond the 
known list in §2.2.

| Doc Reference | Doc Claim | Code Reality | Action |

### Section E — Environment Configuration Audit
For each env var in §2.4, report: where it's read, what disables silently 
if missing, whether the silent-failure path logs a warning. Flag any 
that fail silently with no log.

### Section F — Anti-Pattern Watch (very short)
Up to 5 patterns you noticed that, if they spread, would degrade the 
codebase. Cite one example file:line each.

### Section G — What I Did NOT Review
Be honest. List any code paths, modules, or concerns you could not access 
or did not have time to evaluate. This is more valuable than fake 
completeness.

### Section H — Synthesis: 28-Day Launch Risk Assessment
≤300 words. Given the existing 28-day plan (Day 1 infra → Day 2-3 testing 
→ Day 4-5 fixes → Day 6 mom convo → Day 7-12 content → Day 13-14 
external setup → Day 15-20 hardening → Day 21-28 launch), what are the 
top 3 risks to hitting the June launch, and what's the highest-leverage 
intervention for each?

---

## 8. ANTI-PATTERNS IN YOUR OWN OUTPUT

Do NOT do any of these:
- Do NOT recommend adding test frameworks, CI/CD, monitoring stacks, 
  or observability platforms unless they fix a P0/P1 finding
- Do NOT recommend Section 15–48 expansion items (OSHA, fleet, NPS, 
  multi-location, etc.) unless they are safety/security/data-integrity 
  critical at Stage 1
- Do NOT generic-best-practice. Every finding must cite file:line.
- Do NOT re-find issues already listed in §2.2 — validate them, don't 
  rediscover them
- Do NOT recommend rewrites. The codebase is 7.5/10. Suggest targeted 
  fixes.
- Do NOT pad. If Section X has 3 findings, write 3 rows. Not 30.
- Do NOT skip Section G. "What I didn't review" is a feature, not a 
  bug.

---

## 9. PASS STRATEGY

Recommended order of operations for your review:
1. Start with `supabase/migrations/` — establish schema ground truth
2. Then `middleware.ts` + `src/lib/env.ts` + `src/lib/company.ts` — 
   establish auth + config baseline
3. Then walk the 5 P0 flows through the API routes in 
   `src/app/api/` and surface them across the three UIs
4. Then RLS audit per table — confirm every sensitive table has RLS, 
   confirm policies match the auth assumptions in the API routes
5. Then env-var silent-failure audit
6. Then drift audit against the blueprint claims in §2.2
7. Then a quick spot-check of the WCAG known-list to confirm they 
   still exist
8. Then synthesize Sections A and H last

- **CAREERS_NO_DYNAMIC_LISTINGS**: per addendum §73.2, the careers page 
  has no dynamic job posting display. Application form exists; job 
  listings shown to candidates do not. Confirm and report file:line.
- **APPLICATION_SOURCE_FIELD**: addendum §71.4 claims employment 
  application form already has a "How did you hear about us?" field. 
  Verify in `src/components/public/EmploymentApplicationForm.tsx` and 
  the corresponding Supabase column. If missing, flag as drift.
- **TIER_FIELD_ABSENT**: addendum §71.1 calls for a `tier` or `level` 
  column on `profiles` for employees (Tier 1/2/3). Confirm whether 
  this exists in `supabase/migrations/`. If absent, this is fine for 
  Stage 1 — note only as a future schema consideration, not a finding.
- **MARKETING_VS_TRANSACTIONAL_EMAIL**: existing Resend usage is 
  transactional only (acks, quote sends, completion reports). Verify 
  no current code path uses Resend for bulk/marketing email without 
  CAN-SPAM-required physical address footer + unsubscribe link. If a 
  marketing path exists, flag it under the Compliance lens.

- `META_PIXEL_ID` / `NEXT_PUBLIC_META_PIXEL_ID` (if present in code): 
  flag presence. Pixel deployment is planned per addendum §69.1 but 
  must include consent/privacy considerations — see new OWASP lens 
  in §4.

13. **OWASP Top 10 (2021) coverage** — perform a structured sweep 
    against each category. Cite file:line for any finding. Do NOT 
    flag absence as P0 if the platform's threat model doesn't 
    warrant it (e.g., A10 SSRF on a no-fetch surface). DO flag any 
    actual exposure.

    - **A01 Broken Access Control** — every API route + every RLS 
      policy. Owner of a row vs reader of a row. Token-bearing routes 
      (`/quote/[token]`, completion-report tokens, enrichment tokens) 
      — verify token signing + expiration + scope. Confirm no 
      `service_role` Supabase client reaches the browser bundle. 
      Confirm middleware enforces role gating before the page renders.
      Cross-reference open issues SB-6 (role escalation) and C-40 
      (multi-crew RLS).

    - **A02 Cryptographic Failures** — at-rest encryption for: 
      QuickBooks OAuth tokens (claimed encrypted — verify), building 
      access credentials (per addendum §30.3 must be column-encrypted, 
      not plaintext in `notes`), employee PII (SSN if stored), session 
      cookies (httpOnly, secure, sameSite). TLS enforced on every 
      external surface. No secrets in client bundles, error messages, 
      or logs.

    - **A03 Injection** — every Supabase query path: confirm 
      parameterized queries / `.eq()` / `.match()` everywhere, no 
      string-concatenated SQL, no raw `rpc` calls accepting unvalidated 
      input. Every API route that takes user input: confirm Zod or 
      equivalent validation BEFORE the DB call. SMS/email template 
      rendering: confirm no unescaped user input in HTML emails (XSS 
      via email). AI assistant route: confirm prompt-injection 
      mitigations on user-controlled text feeding into Anthropic/
      OpenAI calls.

    - **A04 Insecure Design** — quote tokens, enrichment tokens, 
      magic-link patterns: are tokens single-use or reusable? 
      time-bound? bound to the specific resource? Lead-followup 
      cron: rate-limited so a flood of leads can't trigger SMS 
      bills? Quote acceptance: idempotent, or could a replay 
      double-create a job? Application form rate-limited 
      separately from quote requests (different abuse profile)?

    - **A05 Security Misconfiguration** — `next.config.js` security 
      headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, 
      Permissions-Policy). Supabase RLS enabled on EVERY table 
      (not just sensitive ones — check for any table with RLS off). 
      CORS posture on API routes. Verbose error stacks reaching 
      production responses. `.env.local` or `.env.example` in git. 
      Sentry DSN scrubbing PII before send.

    - **A06 Vulnerable & Outdated Components** — any `package.json` 
      pin to a known-vulnerable version. `npm audit` style flags 
      (high/critical only — don't list every transitive low). 
      Supabase JS client version, Next.js version, Twilio SDK 
      version: any with known CVEs in the pinned range.

    - **A07 Identification & Authentication Failures** — admin and 
      employee auth flows. Password reset (if exists): rate-limited, 
      single-use, time-bound. Session timeout policy. Brute-force 
      protection on `/auth/admin` and `/auth/employee` (Upstash 
      tier?). Account enumeration via timing or error messages 
      ("user not found" vs "wrong password").

    - **A08 Software & Data Integrity Failures** — webhook receivers 
      (Twilio status callbacks, Resend webhooks if used, QuickBooks 
      callbacks): signature verification on every one. CRON_SECRET 
      enforced on `/api/lead-followup` and `/api/notification-
      dispatch` headers. Supabase Storage uploads: MIME validation, 
      size limits, no executable types. Photo uploads (employee 
      portal): server-side re-validation, not just client-side 
      compression.

    - **A09 Security Logging & Monitoring Failures** — auth failures 
      logged? RLS policy violations logged (or just silently denied)? 
      Token-bearing route abuse (invalid tokens) logged with rate-
      limiting? Sentry actively capturing in production (per audit 
      this is "configured but unverified")? Building access 
      credential views logged per addendum §30.3 audit requirement?

    - **A10 SSRF** — any code path that fetches a URL provided by 
      the user? AI assistant: confirm it's not fetching arbitrary 
      URLs at user request. Photo uploads: any URL-based ingestion 
      path? QuickBooks callback: confirm redirect URI is allowlisted, 
      not echoed from request.

**OWASP severity calibration:**
- Any A01 (Broken Access Control) finding affecting cross-tenant 
  data leakage = P0
- Any A02 (Crypto) finding on building access credentials, OAuth 
  tokens, or employee SSN = P0  
- Any A03 (Injection) confirmed exploitable = P0
- A05 missing CSP / security headers = P1 (not P0; site already 
  has rate limiting + RLS)
- A06 high/critical CVE in a runtime-reachable code path = P1
- A09 missing audit log on access credentials = P1 (per addendum 
  §30.3 this is required)
- A07 brute-force protection gap on auth = P1
- All other OWASP findings default to P2 unless they cascade
- Do NOT flag "no WAF" or "no DAST in CI" as findings — that's 
  Stage 1 calibration noise

### Section G2 — OWASP Top 10 Coverage Matrix

| Category | Status | Evidence (file:line or "see F-NNN") | Notes |
|---|---|---|---|
| A01 Broken Access Control | PASS / PARTIAL / FAIL | | |
| A02 Cryptographic Failures | | | |
| A03 Injection | | | |
| A04 Insecure Design | | | |
| A05 Security Misconfiguration | | | |
| A06 Vulnerable Components | | | |
| A07 AuthN Failures | | | |
| A08 Data Integrity Failures | | | |
| A09 Logging & Monitoring | | | |
| A10 SSRF | | | |

For any FAIL or PARTIAL row, the row must reference a finding ID 
from Section C. Do not introduce new findings inside this matrix — 
this is a coverage view, not a findings view.

- Do NOT generate a generic OWASP checklist with "consider 
  implementing X." For each OWASP category you must either cite 
  evidence of coverage (file:line) or cite a specific finding. 
  "Recommend a CSP" without showing what's currently in 
  `next.config.js` is not acceptable.

6.5. After the env-var silent-failure audit and before the drift 
     audit, perform the OWASP A01-A10 sweep. Treat A01, A02, and 
     A03 as the highest-priority categories given this platform's 
     data sensitivity (client PII, employee PII, building access 
     codes per addendum §30.3, QuickBooks OAuth tokens). For A04 
     specifically, focus on the token-bearing flows: 
     `/quote/[token]`, completion report links, enrichment tokens, 
     and any magic-link patterns.

- **TCPA_CONSENT_CHECKBOX**: per addendum §2.2, every form that collects 
  a phone number for SMS contact requires an unchecked-by-default consent 
  checkbox with specific disclosure language. Verify presence on:
  `QuoteSection.tsx`, `FloatingQuotePanel.tsx`, `AIQuoteAssistant.tsx`, 
  contact form, employment application form. Flag any phone-collecting 
  form lacking this.
- **TCPA_CONSENT_COLUMNS**: verify `leads` (and any other contact-bearing 
  table) has `consent_given`, `consent_timestamp`, `consent_method` 
  columns or equivalent. If missing, flag P1.
- **TCPA_STOP_PROCESSING**: verify a Twilio inbound-SMS webhook exists 
  that processes `STOP` replies, sets an opt-out flag on the contact 
  record, and that all outbound SMS dispatch paths check this flag 
  before sending. If outbound dispatch does not check opt-out status 
  before send, this is P0 (each non-compliant message = \$500-\$1,500 
  exposure).
- **TCPA_SENDER_ID**: verify every outbound SMS template begins with 
  business identification (e.g., "A&A Cleaning: ..."). Flag templates 
  missing this prefix.
- **TCPA_QUIET_HOURS_TZ**: notification system has quiet-hours queueing 
  but TCPA quiet hours are 8am-9pm in the **recipient's** local time 
  zone, not Central Time. Verify the queue logic uses recipient TZ or 
  flag as a calibration gap.
- **TCPA_MARKETING_CLASSIFICATION**: verify every outbound SMS template 
  is classified in code as `transactional` or `marketing`. Marketing 
  sends must be blocked when `consent_given = false`. Transactional 
  (job confirmations, schedule updates for an existing engagement) 
  may proceed under the established business relationship.
- **CANSPAM_PHYSICAL_ADDRESS**: every marketing email template (lead 
  follow-up, post-job nurture, newsletters per addendum §40, §67) 
  must include a physical postal address in the footer. Verify in 
  Resend templates.
- **CANSPAM_UNSUBSCRIBE_LINK**: verify unsubscribe link is present in 
  all marketing email templates and that clicking it actually 
  flips an opt-out flag (does not just go to a confirmation page 
  with no DB write). Transactional emails (quote delivery, completion 
  reports) are exempt.
- **CANSPAM_EMAIL_CLASSIFICATION**: same as TCPA classification — 
  every email template tagged `transactional` or `marketing` in code, 
  with consent enforcement on marketing.
- **PUBLIC_TOKEN_ENTROPY**: locate the generation site for `public_token` 
  on quotes (and any other unauthenticated token: completion-report 
  tokens, enrichment tokens, magic-link tokens if any). Verify each is 
  generated via `crypto.randomUUID()`, `crypto.randomBytes(32)`, or 
  equivalent. Flag any token that is sequential, short (<32 chars), 
  predictable, or generated via `Math.random()`.
- **MASS_ASSIGNMENT_ADMIN_ROUTES**: every admin POST/PATCH API route 
  (e.g., updates to `profiles`, `leads`, `quotes`, `jobs`) must 
  whitelist accepted fields rather than spread the request body into 
  the DB call. Specifically verify: an employee cannot submit 
  `{"role": "admin"}` in any update payload and have it persist. An 
  admin PATCH cannot inadvertently allow a client to escalate their 
  own permissions via a quote-response payload.
- **SOURCE_MAPS_PROD**: verify `next.config.js` does not emit source 
  maps to production builds (`productionBrowserSourceMaps: false` or 
  default). Source maps in production expose the full code structure 
  to anyone with browser devtools.
- **POWERED_BY_HEADER**: verify `next.config.js` has `poweredBy: false`. 
  Default Next.js exposes the `X-Powered-By: Next.js` header which is 
  fingerprinting/recon material.
- **ACCESS_CREDENTIAL_AUTO_PURGE**: per addendum §30.3 + §3.4 of the 
  security addendum, building access codes (alarm codes, gate codes, 
  lockbox codes) must auto-purge 30 days after job completion. 
  Verify whether such cleanup exists (likely a scheduled job or DB 
  trigger). If access codes are stored in `notes` field as plaintext 
  with no purge mechanism, flag as P1 — this is the highest-blast-
  radius data in the system.
- **SECURITY_EVENTS_TABLE**: addendum recommends a `security_events` 
  table for failed-login, rate-limit-hit, unauthorized-access, 
  admin-data-modification, and access-credential-view events. Confirm 
  whether this exists. If absent: P2 for now (not a launch blocker, 
  but flag for post-launch month 2-3 per §17.2 of security addendum).
- **ADMIN_AUTH_NO_MFA**: Supabase Auth supports TOTP MFA. Confirm 
  whether MFA is required (or even available) on admin accounts. 
  If admin accounts can authenticate with password only, flag P1 — 
  per the addendum this is the single highest-ROI security 
  improvement available.

- `TWILIO_INBOUND_WEBHOOK_*` (any secret used to verify Twilio's 
  signed inbound SMS callbacks for STOP processing) — if STOP 
  processing exists but webhook is unsigned, that's a finding under 
  A08.
- `QUICKBOOKS_WEBHOOK_VERIFIER_TOKEN` (or equivalent) — verify the 
  QuickBooks callback route validates webhook signatures. If the 
  callback accepts unsigned requests, flag under A08.
- Confirm no `NEXT_PUBLIC_*`-prefixed env var contains a secret. 
  Anything `NEXT_PUBLIC_*` is exposed in the client bundle. 
  Specifically verify: `SUPABASE_SERVICE_ROLE_KEY`, 
  `RESEND_API_KEY`, `TWILIO_AUTH_TOKEN`, `ANTHROPIC_API_KEY`, 
  `OPENAI_API_KEY`, `ENRICHMENT_TOKEN_SECRET`, `CRON_SECRET` are 
  NEVER `NEXT_PUBLIC_`-prefixed. If any are, flag P0.

14. **Regulatory Compliance (TCPA / CAN-SPAM / Texas §521.053)** — 
    distinct from OWASP because the threat model is regulatory, not 
    technical. The platform sends automated SMS and email at scale 
    per addendum §22, §40, §67, with 15-20 automated touchpoints per 
    client lifecycle. Penalties:
    
    - TCPA: \$500-\$1,500 PER non-compliant SMS. Private right of 
      action. Serial plaintiffs exist who submit forms specifically 
      to generate violations.
    - CAN-SPAM: up to \$51,744 per non-compliant marketing email.
    - Texas §521.053: 60-day breach notification; AG notification 
      if 250+ Texas residents affected.
    
    For each compliance category, verify:
    - **Consent capture**: form-level consent before phone/email is 
      stored for marketing use; consent record (timestamp + method + 
      exact language shown) preserved in DB.
    - **Consent enforcement**: outbound dispatch checks consent flag 
      before marketing send; transactional sends correctly classified 
      and exempt.
    - **Opt-out mechanism**: STOP for SMS, unsubscribe link for email; 
      both wire back to a DB flag that subsequent sends honor.
    - **Disclosure requirements**: CAN-SPAM physical address in 
      marketing email footer; TCPA business identification in SMS; 
      "consent is not a condition of purchase" language on consent 
      checkbox.
    - **Quiet hours alignment**: 8am-9pm recipient local time for 
      marketing SMS, not just sender's CT.
    
    Do NOT scope this lens to mean "general legal advice" — only flag 
    findings that are concrete code/schema/template gaps with named 
    statute exposure.

**Flow 5 (Authentication boundaries) — expanded IDOR matrix:**

In addition to the existing flow checks, perform the following 
horizontal-access tests by tracing the code (not by running). For 
each row, identify the API route + RLS policy that enforces 
isolation, and report PASS / PARTIAL / FAIL with file:line:

| Resource | Test | Expected enforcement |
|---|---|---|
| `jobs` | Employee A reads Employee B's job by ID | RLS on `jobs` joined to `job_assignments` filtering by auth uid |
| `leads` | Employee reads any lead | RLS denies — leads are admin-only |
| `quotes` | Employee reads any quote | RLS denies — quotes are admin-only |
| `clients` | Employee reads client records | RLS denies or scoped to assigned-job clients only |
| `job_messages` | Employee A reads messages on Employee B's job | RLS scoped to assignment |
| `job_photos` | Employee A views Employee B's uploaded photos | Storage bucket RLS + DB RLS |
| `issue_reports` | Employee A reads Employee B's reports | RLS scoped to assignment |
| `checklist_items` | Employee A modifies Employee B's checklist completion | RLS scoped to assignment |
| `profiles` | Employee A reads Employee B's profile (incl. pay rate) | RLS denies — profiles admin-only or own-only |
| `employment_applications` | Employee reads applications | RLS denies — admin-only |
| `quotes.public_token` route `/quote/[token]` | Random / brute-forced token gains access | Token entropy >= 128 bits; rate limit on token endpoint |
| Admin write routes (POST `/api/quote-create-job`, PATCH `/api/leads/[id]`, etc.) | Employee session calls admin route | Middleware role check returns 403 BEFORE the handler runs |

If RLS is the only enforcement and middleware does not also gate by 
role, that's not necessarily a finding — but flag it if a defense-
in-depth gap exists where a misconfigured RLS would silently allow 
access.

**Compliance severity calibration:**
- Missing TCPA consent checkbox on any phone-collecting form = P0 
  (every non-compliant SMS is \$500-\$1,500 exposure; volume 
  multiplies fast)
- Outbound SMS dispatch path that does not check opt-out flag = P0
- Missing CAN-SPAM physical address in marketing email footer = P1
- Marketing email template with no unsubscribe link = P1
- Transactional/marketing classification missing in code = P1 
  (the absence prevents safe enforcement)
- Quiet-hours misaligned with recipient TZ = P2 (technical TCPA 
  edge case, but not the main exposure vector)
- Missing security_events table = P2
- Missing admin MFA = P1
- Source maps in production = P1
- `poweredBy` header enabled = P3
- `NEXT_PUBLIC_*` containing a secret = P0
- Access credentials in plaintext `notes` with no purge = P1 
  (P0 if the platform is also storing them for many clients today; 
  P1 if seed/early data only)

### Section G3 — Compliance Posture Matrix

| Regulation | Status | Evidence (file:line or "see F-NNN") | Notes |
|---|---|---|---|
| TCPA — consent capture | PASS / PARTIAL / FAIL | | |
| TCPA — consent enforcement on dispatch | | | |
| TCPA — STOP processing | | | |
| TCPA — sender identification in SMS | | | |
| TCPA — quiet hours by recipient TZ | | | |
| TCPA — marketing/transactional classification | | | |
| CAN-SPAM — physical address in marketing email | | | |
| CAN-SPAM — unsubscribe link functional | | | |
| CAN-SPAM — marketing/transactional classification | | | |
| Texas §521.053 — breach notification readiness | DOCS / N/A | | This is policy, not code — mark N/A unless you find a code path that would impede notification (e.g., no audit log of what data was accessed) |

Same rule as G2: any FAIL/PARTIAL row references a finding ID 
from Section C. No new findings introduced inside the matrix.

- Do NOT recommend "implement a SOC 2 program" or any enterprise 
  compliance framework. The platform is Stage 1 / pre-launch. Only 
  flag concrete code/schema/template gaps with named statutes 
  (TCPA, CAN-SPAM, Texas §521.053).
- Do NOT recommend purchasing security tooling (WAFs, DAST scanners, 
  Snyk Enterprise, etc.) unless the absence of free-tier alternatives 
  (Dependabot, npm audit, axe-core) is the gap.
- Do NOT recommend implementing a full security_events / audit-trail 
  system as P0. It's P2. Flag it once, with effort estimate, and move 
  on.
- Do NOT confuse transactional vs marketing in your own findings. A 
  job-completion email to the client who hired you is transactional 
  and exempt from CAN-SPAM marketing requirements. A "we miss you" 
  re-engagement email to the same person 90 days later IS marketing 
  and IS regulated.

6.7. After the OWASP sweep (step 6.5) and before the drift audit, 
     perform the Compliance sweep (lens #14). Trace every outbound 
     SMS and email template to its dispatch site, verify consent 
     enforcement, and verify the consent-capture mechanism on the 
     corresponding form. Use addendum §22, §40, §67 as the inventory 
     of intended communications — many of these are not yet 
     implemented; for each NOT implemented, do not flag (it doesn't 
     exist yet so it cannot be non-compliant). Only flag what's 
     wired up today and is non-compliant in current code.

     - **TCPA_CONSENT_LANGUAGE_EXACT**: per addendum §2.2, the consent 
  checkbox text must be substantively equivalent to: "I agree to 
  receive text messages from A&A Cleaning Services regarding my 
  service request and related updates. Message frequency varies. 
  Reply STOP to unsubscribe at any time. Message and data rates may 
  apply. This consent is not a condition of purchasing any service." 
  The final sentence is legally required — TCPA prohibits making 
  consent a condition of purchase. Verify presence verbatim or 
  substantively equivalent on every phone-collecting form. Flag 
  P0 if the "not a condition of purchasing" clause is missing.

- **PRIVACY_POLICY_DRIFT**: per addendum §4.7, the website privacy 
  policy creates an FTC-enforceable commitment. If the policy 
  promises encryption of data that is in fact stored in plaintext 
  (e.g., access codes in `notes`), or promises practices the code 
  doesn't perform, that is a deceptive practice under FTC Section 
  5 and Texas DTPA. Read `src/app/(public)/privacy/page.tsx` and 
  cross-check every affirmative claim against the code. Flag any 
  drift as P1.

- **PUBLIC_CLAIMS_DRIFT**: per addendum §4.8 (Texas DTPA), specific 
  numeric claims on public-facing pages create enforceable 
  commitments. Identify any claim like "respond within X hours", 
  "100% satisfaction", "every job passes formal QA inspection", 
  and verify the platform actually tracks/enforces what is claimed. 
  This overlaps SB-3 (authority bar metrics) but extends to body 
  copy. Flag any unverifiable claim as P1.

- **HIPAA_PHOTO_SCOPE**: per addendum §4.6, if the platform supports 
  medical-facility cleaning (currently aspirational per §51.2), 
  completion photos that capture patient information visible on 
  desks/screens/walls = HIPAA exposure. Verify whether the photo 
  upload UI in the employee portal has any guidance, restriction, 
  or category-tagging mechanism for medical sites. If medical is 
  not yet a service vertical in production data, this is a P3 / 
  triggered finding (note for activation when medical clients 
  appear). Do not escalate above P3 today.

  14. **Regulatory Compliance (TCPA / CAN-SPAM / Texas §521.053 / FTC 
    Section 5 / Texas DTPA)** — distinct from OWASP because the 
    threat model is regulatory, not technical. [...existing text...]
    
    **Additional FTC/DTPA scope:** the website privacy policy and 
    every public-facing service claim is an enforceable commitment 
    under FTC Section 5 (federal, civil penalty up to \$51,744 per 
    fake review post-2023 Final Rule) and Texas DTPA (state, treble 
    damages + attorney fees on knowing violations). For each 
    affirmative claim on the public site (security/encryption 
    claims in privacy policy, response-time SLAs, satisfaction 
    guarantees, QA process descriptions, authority-bar metrics), 
    verify the code actually delivers what is claimed. SB-2 
    (fabricated testimonials) and SB-3 (unverified metrics) are 
    not just credibility issues — they are FTC/DTPA exposure.

    15. **Vertical-Specific Regulatory Triggers** — flag any code path 
    that, if exercised in a regulated vertical, would create 
    compliance exposure. Currently relevant:
    
    - **HIPAA (medical facility cleaning)**: photo capture in the 
      employee portal has no scope-restriction mechanism. If a 
      medical client is added, completion photos could capture 
      PHI. Flag the absence of medical-job photo guidance as P3 
      / triggered (activates when first medical client signs).
    - **EPA RRP (pre-1978 building cleaning)**: no certification 
      tracking exists. Flag as P3 / triggered.
    - **Texas sales tax on cleaning services**: invoice/quote 
      generation must apply 8.25% to taxable services. If the 
      platform generates invoice line items that sync to 
      QuickBooks, verify tax handling. If QB owns tax 
      calculation entirely, note that and move on.
    
    Do NOT flag any of these as P0/P1 unless code today is actively 
    in a regulated vertical. This lens exists so future feature 
    work doesn't re-discover the regulatory landscape from scratch.

    **FTC / DTPA severity calibration:**
- Privacy policy promises encryption of data that is actually 
  stored in plaintext = P1 (deceptive practice exposure)
- Authority bar / homepage metric is hardcoded and demonstrably 
  false (e.g., "500+ projects" when DB has <50 jobs) = P1 
  (already tracked as SB-3, elevated severity here)
- Specific SLA claim ("respond within 4 hours") on public site 
  with no platform mechanism to track or enforce it = P1
- Fabricated testimonials with named people = P0 (FTC Final Rule 
  2023 — civil penalty per review)

**Vertical trigger calibration:**
- All Vertical-Specific (lens #15) findings default to P3 / 
  triggered unless production data shows the trigger has fired 
  (e.g., a medical-vertical client is in `clients` table)

  ### Section G3 — Compliance Posture Matrix

| Regulation | Status | Evidence (file:line or "see F-NNN") | Notes |
|---|---|---|---|
| TCPA — consent capture | PASS / PARTIAL / FAIL | | |
| TCPA — "not a condition of purchase" clause present | | | |
| TCPA — consent enforcement on dispatch | | | |
| TCPA — STOP processing | | | |
| TCPA — sender identification in SMS | | | |
| TCPA — quiet hours by recipient TZ | | | |
| TCPA — marketing/transactional classification | | | |
| CAN-SPAM — physical address in marketing email | | | |
| CAN-SPAM — unsubscribe link functional | | | |
| CAN-SPAM — marketing/transactional classification | | | |
| FTC §5 — privacy policy matches code reality | | | |
| FTC §5 — testimonials are real (SB-2) | | | |
| FTC §5 — authority metrics verifiable (SB-3) | | | |
| Texas DTPA — public claims match capabilities | | | |
| Texas §521.053 — breach notification readiness | DOCS / N/A | | Policy, not code |
| HIPAA (vertical trigger) | TRIGGERED / NOT TRIGGERED | | Active only if medical clients in production |
| EPA RRP (vertical trigger) | TRIGGERED / NOT TRIGGERED | | Active only if pre-1978 building work logged |
| Texas Sales Tax | PASS / PARTIAL / FAIL / DEFERRED-TO-QB | | If QB owns calc, mark accordingly |

- Do NOT recommend SOC 2, ISO 27001, NIST CSF maturity uplift, OWASP 
  ASVS Level 2, or any framework whose activation trigger has not 
  fired (revenue >\$500K, institutional contracts, etc.). Note the 
  trigger and move on.
- Do NOT recommend HIPAA controls today. The platform serves no 
  medical clients in production. HIPAA is a triggered concern, not a 
  current finding.
- Do NOT recommend OSHA, EPA, FLSA, TWC, or I-9 implementations as 
  code findings. These are operational/business obligations and 
  should be flagged ONLY where the code creates exposure (e.g., 
  photo upload that could capture PHI under lens #15) — not as 
  general gaps.
- Do NOT recommend penetration testing, formal security policies, 
  cyber insurance, third-party vendor security assessments, or 
  privacy impact assessments. These are documented as deferred in 
  the addendum.
- Do reflect the FTC/DTPA exposure in privacy policy / public 
  claim drift. SB-2 and SB-3 should be tagged with FTC/DTPA 
  severity, not just "credibility" severity.

  6.7. After the OWASP sweep (step 6.5) and before the drift audit, 
     perform the Compliance sweep (lens #14 + #15). Three sub-passes:
     
     a) **TCPA/CAN-SPAM**: trace every outbound SMS and email 
        template to its dispatch site, verify consent enforcement, 
        verify consent-capture mechanism on the corresponding form, 
        verify the exact "not a condition of purchasing" clause is 
        present.
     
     b) **FTC/DTPA**: open `src/app/(public)/privacy/page.tsx` and 
        every page in `src/app/(public)/services/`. For each 
        affirmative claim (security/encryption/SLA/guarantee/metric), 
        find the code path that delivers it. If no such path exists, 
        that's a finding. SB-2 and SB-3 are part of this sub-pass.
     
     c) **Vertical triggers (lens #15)**: scan for any code path that 
        would activate HIPAA, EPA RRP, or Texas sales tax obligations 
        if exercised. Confirm whether the trigger has fired today 
        (check seed data and addendum context). If not fired, mark 
        TRIGGERED / NOT TRIGGERED accordingly. Default severity P3.

        High-value additions (worth adding as lenses)
1. Performance / Core Web Vitals lens
This is a major omission given conversion and SEO are both stated goals. Add a lens that checks:

LCP, INP, CLS targets (Google ranks on these; <2.5s LCP is a soft conversion floor)
next/image usage everywhere images appear (especially Hero, BeforeAfterSlider, TestimonialSection — these are LCP candidates)
Font loading strategy (next/font vs raw <link>, FOIT/FOUT)
Bundle size on the homepage route — flag any 'use client' component that pulls a heavy lib (Anthropic SDK, charting, etc.) into the public bundle
Dynamic imports for AIQuoteAssistant, ExitIntentOverlay, FloatingQuotePanel (heavy modals shouldn't ship in initial JS)
Severity calibration: P1 if homepage LCP > 2.5s on simulated mobile, P2 otherwise. This is the single biggest lens you're missing for a public marketing site.

2. Cost-control / abuse-economics lens
Your prompt covers TCPA exposure but not raw spend exposure. With a non-technical owner:

Does /api/ai-assistant have a per-session token cap and a daily/monthly spend cap? An attacker could rack up Anthropic/OpenAI bills fast.
Twilio: is there a daily SMS volume ceiling beyond the 5/hr per-IP rate limit? One bad actor with rotating IPs could trigger thousands of admin alerts.
Resend: same question.
Supabase Storage: photo upload size limits enforced server-side, and a per-employee daily upload cap so a compromised employee account can't fill the bucket.
Severity: P1 for any uncapped paid API route. The owner won't notice a $4K Anthropic bill until end of month.

3. Idempotency / concurrency lens (broader than A04)
You touched this under A04 but it deserves its own sweep:

Quote acceptance: if the client double-clicks "Accept," does it create two jobs? (idempotency key or DB unique constraint required)
Two admins editing the same lead simultaneously — last-write-wins or optimistic locking with updated_at?
Job status transitions: is assigned → en_route → in_progress → complete enforced as a state machine, or can an employee POST complete directly from assigned and skip checklist?
assignment-notify — if cron fires twice within a minute, does the dedup catch it?
4. Time-zone correctness lens
You mentioned recipient TZ for TCPA quiet hours but didn't extend it. Audit every place that does date math:

Scheduling module — is "today" computed in the job site's TZ, the admin's browser TZ, or UTC?
Authority bar metrics ("response within X hours") — UTC drift could make these wrong
Completion reports — timestamps in client's TZ or business TZ?
Cron scheduling — Vercel cron runs in UTC; does lead-followup use UTC math against created_at columns stored as timestamptz?
5. PWA / offline-claim validation
You list "offline photo queue" as a feature claim but no lens validates it. The employee portal claims offline-safe uploads — verify:

Service worker presence and caching strategy
IndexedDB or localStorage fallback for the photo queue
Network-loss UI states (does the employee see queued status?)
What happens if storage quota is exceeded mid-job?
This cascades into the employee-portal-as-leverage thesis (§3.4) — if offline doesn't actually work, the owner can't trust the field.

Medium-value additions
6. Next.js App Router hygiene
Missing from the prompt entirely:

error.tsx boundaries at each route group (admin, employee, public, auth)
not-found.tsx for 404s
loading.tsx for streaming fallbacks
metadata exports per route (separate from your SEO content gap)
Route-level revalidate or dynamic settings where they affect cache correctness
7. SEO technical (beyond content gap)
Your prompt acknowledges content gap but not technical SEO:

JSON-LD structured data: LocalBusiness, Service, FAQ, BreadcrumbList, Review schemas
sitemap.ts includes all dynamic routes (industries, service-area, services)
robots.ts correctly disallows /admin, /employee, /api
Open Graph + Twitter card images per route
Canonical URL correctness on parameterized URLs (attribution params shouldn't fragment canonical)
hreflang tags if Spanish content surfaces have their own URLs
8. Email render compatibility
Resend renders the HTML you give it — but that HTML has to survive Outlook, Gmail clipping (>102KB clip), dark mode inversion, and image-blocking. Verify:

Completion reports use table-based layout, not flexbox/grid
Inline CSS (or compatible email frameworks like react-email)
Plain-text fallback on every template
Quote tokens in URLs not breaking on Outlook's link rewriting
9. Cookie/consent + Meta Pixel readiness
You flagged Meta Pixel under OWASP but not under consent law:

If a CA visitor hits the site, is there CCPA "Do Not Sell/Share" handling? Pixel firing without consent = exposure.
Cookie banner pre-Pixel deployment — even Texas-targeted, you'll get out-of-state traffic.
GA4 absence is good; Meta Pixel adds the same compliance surface.
10. Feature kill-switches for non-technical owner
If AI assistant breaks, can the owner disable it without a deploy? If exit-intent overlay annoys mobile users, can it be turned off from admin config? You have a ConfigurationClient — verify which user-facing surfaces are admin-toggleable. Per §3.4 leverage thesis, the owner needs runtime control without calling you.

Smaller things worth a single line
Database backup posture: Supabase has PITR — confirm it's enabled on the production project (configuration check, not code, but worth noting in Section E)
Migration rollback: do migration files have down-paths or is it forward-only? (Stage 1 forward-only is fine, just note it)
Print stylesheets: quotes and completion reports get printed by clients — verify @media print rules exist
prefers-color-scheme: not required, but if dark mode is half-implemented anywhere it'll look broken
Form draft persistence: long forms (employment application, quote request) — does refresh nuke progress?
Twilio A2P 10DLC registration status: not a code finding, but if the Twilio number isn't registered for A2P, deliverability tanks. Worth a one-line check in Section E.
