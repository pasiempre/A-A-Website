# Solutioning Guide (Control Plane)

Date: 2026-04-12
Status: Active
Purpose: Keep planning, validation gating, and implementation targeting in one clean document without embedding transcript-sized code dumps.

## Canonical Documents
- Control plane: blueprint/active/solutioning-guide.md
- Implementation lock: blueprint/active/solutioning-implementation-lock-manifest.md
- Full historical transcript (archived): blueprint/archive/2026-04-12-active-cleanup/solutioning-guide-transcript-2026-04-12.md
- Validation control plane: blueprint/active/master-rework-doc-2.0.md
- Validation evidence log: blueprint/active/feedback3.0-validation-evidence-2026-04-11.md
- Upgrade roadmap (kept independent): blueprint/active/bring-it-to-an-a.md

## Scope Boundary (Fixes vs Upgrades)
- This guide remains the fix-first control plane for validated defects and closure evidence.
- Upgrade and net-new capability work is tracked independently in `blueprint/active/bring-it-to-an-a.md`.
- Cross-document rule: an upgrade that depends on an open defect must not be promoted ahead of the linked fix closure.

## Critical Baseline Finding
- Independent code validation confirms that multiple prior-session "resolved" claims were not present in the current working tree at validation time.
- Practical impact: prior handoff resolution totals are treated as proposal-level until matched to current-file evidence.
- Baseline interpretation for this guide: trust repo state + evidence artifacts over historical transcript claims.

## Migration Deployment Gate
- Gate status: NOT APPLIED (runtime target DB promotion still pending for migration-dependent closure paths).
- Items blocked from promotion to `Resolved (Runtime Verified)` until migration/runtime evidence is captured:
  - SB-6
  - C-40
  - C-41
  - C-42
  - C-73
  - #1047

## Working Agreement
1. Keep code implementations unchanged unless explicitly approved.
2. Validate first, implement second, verify third.
3. Do not paste large code blocks into this guide.
4. Store long implementation transcripts in archive and reference them.
5. Use the implementation lock manifest to prevent drift.

## Scope and Gating
- This guide tracks what to solve and how to validate.
- Implementation details live in code files, not here.
- Promotion to done requires:
  - issue-to-file mapping
  - runtime or SQL proof
  - verification note in validation evidence

## Coverage Reconciliation (Findings vs Targets)
- Raw findings corpus: ~1,060 issues (canonical count from master rework summary).
- Condensed actionable set: 166 tracked IDs (SB/C/XF patterns in master rework tables).
- Archived solutioning transcript: 21 session blocks and many fix directives (not a small list).
- Current implementation lock manifest: 11 symbol-level locks + 3 drift entries.

Hierarchy note:
- `~1,060` raw findings -> `166` condensed actionable IDs -> `129` canonical SB/C/XF IDs explicitly statused in this guide.
- The remaining non-canonical portion of the 166 set is covered through findings-dump reconciliation and numeric sub-finding inheritance (`#880-#980`).

Important: The lock manifest is phase-1 implementation protection for high-risk active surfaces, not the full solution inventory.

Targeting rule for this phase:
1. Keep the 11 active locks stable while validating.
2. Expand lock coverage batch-by-batch from the condensed master rework set.
3. Any finding confirmed valid must map to one of: existing lock, new lock, or explicit drift entry.
4. No valid finding should remain untracked.

Current status:
- Not all findings have been runtime-validated yet.
- More valid solutions are expected as validation progresses.
- The 14-item count reflects current lock coverage only, not total final scope.

## Current Priorities
### Priority A (Security and Data Integrity)
- SB-1: real business phone replacement across public CTAs (phone number to use: 5128252212)
- SB-6: signup role source hardening verification on target DB
- C-16: ticket create sequence resilience (no orphan state)
- C-24: QA rework safety and recovery behavior

### Priority B (Pipeline Reliability)
- C-36: latest quote selection correctness
- C-48: quote-to-job lead relation normalization
- C-46/C-47: employee assignment relation and schedule field alignment
- C-64: notification relations rendering correctness

### Priority C (Admin UX and Routing)
- C-10: sidebar module discoverability
- C-12: quote review confirmation before send
- C-13/C-39: overlap-aware availability checks
- C-25/C-26/C-27: mobile kanban and touch/input usability

### Priority D (Taxonomy and Consistency)
- C-5/C-17: canonical service type taxonomy and ingestion normalization
- C-18: lead status visibility parity
- C-20/C-21: client directory and lead activity log strategy

## Session Execution Template
For each issue batch:
1. Define target files.
2. State expected behavioral outcome.
3. Run validation checks before and after.
4. Record evidence in validation log.
5. Update implementation lock manifest if behavior is accepted.

## Validation Checklist (Per Batch)
- Compile/lint clean for touched files.
- No regression in related route or module.
- Runtime path tested where applicable.
- DB assumptions confirmed against real schema/policies.
- Evidence captured in feedback evidence doc.

## Validation Batch 1 (2026-04-12)
Scope:
- Automated baseline checks plus immediate blocker burn-down.

Checks run:
- `npx eslint . --max-warnings=0` -> pass
- `npx tsc --noEmit` -> pass
- `npx next build --webpack` -> pass (with third-party opentelemetry/sentry warnings)
- `npm run preflight:f07` -> pass
- `npm run smoke:f07` -> pass (8 passed, 0 failed)

Fixes applied in this batch:
- Removed accidental markdown payload from `src/lib/idempotency.ts` that broke parsing.
- Fixed TSX token issue in `src/app/(public)/industries/page.tsx` (`->` rendering).
- Replaced no-script internal anchors with `Link` usage in `src/components/public/variant-a/PublicHeader.tsx` to satisfy lint rule.
- Removed unused icon declaration in `src/app/quote/success/page.tsx` to keep strict lint clean.

Outcome:
- Build/lint/type baseline is now green for current tree.
- This validates code health baseline, not full closure of all ~1,060 findings.
- Remaining work is issue-by-issue validation and closure against the condensed 166-item set.

## Validation Batch 2 (Session 13 Solutioning Readiness)
Status: Pending execution after implementation approval.

Planned checks:
- `npx eslint . --max-warnings=0`
- `npx tsc --noEmit`
- `npx next build --webpack`
- `npm run preflight:f07`
- `npm run smoke:f07`

Promotion rule:
- Any item moved from `Verified Open`/`Partial` to `Resolved (Code)` or `Resolved (Runtime Verified)` in this phase must include direct before/after evidence and runtime artifact references where applicable.

## Validated Findings Ledger (Ship Blockers)
Status key: `Verified Open` | `Partial` | `Resolved (Code)` | `Resolved (Runtime Verified)`

| ID | Status | Validation Result | Evidence |
| --- | --- | --- | --- |
| SB-1 (fictional phone) | Verified Open | Placeholder number is still the canonical public number and propagates to call CTAs. | `src/lib/company.ts` (`(512) 555-0199`) and imports across public pages/components. |
| SB-2 (testimonial authenticity) | Verified Open | Testimonial quotes and identities are hardcoded in code with no attached provenance artifact in repo. | `src/components/public/variant-a/TestimonialSection.tsx`. |
| SB-3 (years consistency) | Verified Open | Years claims are inconsistent across surfaces (`6+` vs `15+`). | `src/components/public/variant-a/AboutSection.tsx` (`6+`), `src/components/public/variant-a/AuthorityBar.tsx` (`15+`), `src/lib/company.ts` (`15+`). | --- my mom has been in the cleaning business over 15 years so we can stilck to tha
| SB-4 (enrichment secret fallback chain) | Partial | Secret is now required in server env and production path hard-fails if missing; dev fallback string still exists for non-production. | `src/lib/env.ts` (`ENRICHMENT_TOKEN_SECRET` required), `src/app/api/quote-request/route.ts` (`getEnrichmentTokenSecret`). |
| SB-5 (env validation coverage) | Partial | Core required keys are validated; QuickBooks keys are not present in env validation set, and startup call-site wiring for `validateServerEnvironment()` is not found yet. | `src/lib/env.ts` plus repo-wide search for `validateServerEnvironment(` usage (no runtime invocation found). |
| SB-6 (signup role escalation) | Partial | Fix migration exists and uses `raw_app_meta_data`; baseline migration still shows old `raw_user_meta_data` role source. Runtime DB promotion still required. | `supabase/migrations/0024_fix_handle_new_user_role_source.sql` and `supabase/migrations/0018_core_schema_bootstrap.sql`. |

Validation coverage note:
- Ship-blocker ledger is now evidence-backed.
- Next phase is expanding this same validation format across the condensed 166-item set.

## Validated Findings Ledger (Priority B: Pipeline Reliability)

| ID | Status | Validation Result | Evidence |
| --- | --- | --- | --- |
| C-48 (quote->job lead relation) | Verified Open | Route still treats FK relation as array (`quote.leads?.[0]`), which is not safe for PostgREST many-to-one object shape. | `src/app/api/quote-create-job/route.ts`.
| C-36 (latest quote selection) | Verified Open | Lead pipeline still takes first quote entry (`lead.quotes?.[0]`) without explicit descending sort safeguard. | `src/components/admin/LeadPipelineClient.tsx`.
| C-46 (scheduled field source) | Verified Open | Employee tickets query reads `scheduled_start` from `job_assignments` select/order path. | `src/components/employee/EmployeeTicketsClient.tsx` query select + order.
| C-47 (employee relation normalization) | Verified Open | Employee tickets still reads joined job relation via first-element indexing (`assignment.jobs?.[0]`) rather than normalized relation helper. | `src/components/employee/EmployeeTicketsClient.tsx`.
| C-64 (notification relation normalization) | Verified Open | Notification center still reads joined relations via first-element indexing (`profiles?.[0]`, `jobs?.[0]`). | `src/components/admin/NotificationCenterClient.tsx`.

Coverage update at end of Priority B batch:
- Validated and explicitly tracked in this guide: 11 items (6 ship blockers + 5 pipeline-critical findings).
- Remaining condensed findings require the same validation pattern before closure.

## Validated Findings Ledger (Priority C: Admin UX and Routing)

| ID | Status | Validation Result | Evidence |
| --- | --- | --- | --- |
| C-10 (module discoverability) | Partial | Sidebar includes `Jobs & Dispatch` but does not expose dedicated direct nav entries for `dispatch` and `scheduling`; these modules still exist in shell routing and require module switch path. | `src/components/admin/AdminSidebarNav.tsx`, `src/components/admin/AdminShell.tsx`. |
| C-12 (quote review before send) | Verified Open | Lead pipeline action still sends quote directly from `Send Quote` to API without explicit review/confirm step. | `src/components/admin/LeadPipelineClient.tsx` (`createQuote`, `Send Quote` button), `src/app/api/quote-send/route.ts`. |
| C-13 (overlap-aware availability checks) | Partial | Scheduling module now includes overlap/conflict detection, but quote-create-job and lead quick checks still use exact `jobs.scheduled_start == scheduledStart` matching. | `src/components/admin/SchedulingAndAvailabilityClient.tsx`, `src/components/admin/LeadPipelineClient.tsx`, `src/app/api/quote-create-job/route.ts`. |
| C-39 (availability matching strategy) | Partial | `employee_availability` table is actively queried in scheduling module, but assignment conflict checks in job-create path remain exact timestamp based. | `src/components/admin/SchedulingAndAvailabilityClient.tsx`, `src/app/api/quote-create-job/route.ts`. |
| C-25 (mobile kanban stacking) | Verified Open | Lead pipeline uses `xl:grid-cols-5`, which collapses below xl and produces vertical stacking behavior. | `src/components/admin/LeadPipelineClient.tsx`. |
| C-26 (touch target risk) | Verified Open | Primary action buttons in lead cards remain compact (`px-2 py-1 text-xs`), below ideal mobile touch ergonomics. | `src/components/admin/LeadPipelineClient.tsx`. |
| C-27 (input sizing / mobile ergonomics) | Verified Open | Lead pipeline editing controls are heavily `text-xs`, indicating continued small-control density for mobile use. | `src/components/admin/LeadPipelineClient.tsx`. |

## Validated Findings Ledger (Priority D: Taxonomy and Consistency)

| ID | Status | Validation Result | Evidence |
| --- | --- | --- | --- |
| C-5 / C-17 (service taxonomy consistency) | Verified Open | Service-type values remain distributed across many files (contact constants, public form selects, CTA metadata, admin templates) without a single canonical module. | `src/app/(public)/contact/page.tsx`, `src/components/public/variant-a/QuoteSection.tsx`, `src/components/public/variant-a/useQuoteForm.ts`, `src/components/admin/QuoteTemplateManagerClient.tsx`. |
| C-18 (lead status visibility parity) | Verified Open | `qualified` exists in type/grouping state but is missing from displayed status columns and status selector options. | `src/components/admin/LeadPipelineClient.tsx` (`statusColumns`, status `<select>` options). |
| C-20 (client directory surface) | Verified Open | No dedicated admin client directory component/surface found; conversion writes to `clients` but no explicit client listing module is present. | admin client component inventory plus `src/components/admin/LeadPipelineClient.tsx` and `src/app/api/quote-create-job/route.ts`. |
| C-21 (lead activity log strategy) | Verified Open | Lead notes are appended into a single text blob (`leads.notes`) instead of structured activity records. | `src/app/api/lead-message/route.ts`, `src/components/admin/LeadPipelineClient.tsx`. |

Coverage update:
- Validated and explicitly tracked in this guide: 22 items (6 ship blockers + 5 pipeline + 7 admin UX/routing + 4 taxonomy/consistency).
- Remaining condensed findings still require batch validation and statusing.

## Validated Findings Ledger (Data Integrity and Stability)

| ID | Status | Validation Result | Evidence |
| --- | --- | --- | --- |
| C-16 (ticket create sequence resilience) | Verified Open | Ticket creation performs multi-step inserts (job, assignment, checklist) without a transactional boundary; partial-failure risk remains. | `src/components/admin/TicketManagementClient.tsx` (`createTicket`). |
| C-24 (QA rework safety) | Verified Open | `needs_rework` path still resets assignment/checklist progress fields to null/false, indicating destructive rollback behavior. | `src/components/admin/TicketManagementClient.tsx` (`saveQaReview`). |
| C-28 (mutation error handling) | Verified Open | Lead pipeline mutation flows still execute without local `catch` blocks, so thrown network/runtime errors are not centrally surfaced by those functions. | `src/components/admin/LeadPipelineClient.tsx` (`createQuote`, `updateLeadStatus`, `convertLeadToClient`, `createJobFromQuote`) and search for `catch (` in file. |
| C-30 (latest quote total null safety) | Verified Open | Quote card render still calls `latestQuote.total.toFixed(2)` directly, leaving null/undefined total as a crash risk. | `src/components/admin/LeadPipelineClient.tsx` quote card render. |
| C-38 (unknown lead status safety) | Verified Open | Grouping logic still writes via `grouped[lead.status]` without unknown-key guard, which can throw for unrecognized statuses. | `src/components/admin/LeadPipelineClient.tsx` grouping reducer. |
| C-31 (admin crash containment) | Verified Open | Admin shell renders module content directly without an explicit error boundary wrapper around module surfaces. | `src/components/admin/AdminShell.tsx` (`ModuleContent` render path). |

Coverage update:
- Validated and explicitly tracked in this guide: 28 items.
- Remaining condensed findings still require additional batch validation and statusing.

## Validated Findings Ledger (Security and Insights Integrity)

| ID | Status | Validation Result | Evidence |
| --- | --- | --- | --- |
| C-63 (employment rate-limit durability) | Verified Open | Employment application route still uses in-memory IP timestamp map, which is not durable/distributed for serverless multi-instance workloads. | `src/app/api/employment-application/route.ts` (`submissionTimestamps`, `isRateLimited`). |
| C-70 (dispatch run auth mismatch) | Verified Open | Admin notification center calls dispatch endpoint without cron auth header, while endpoint enforces cron authorization. | `src/components/admin/NotificationCenterClient.tsx` (`fetch('/api/notification-dispatch')`), `src/app/api/notification-dispatch/route.ts` (`authorizeCronRequest`). |
| C-11 / C-19 (dashboard KPI authenticity) | Verified Open | Overview dashboard still displays static Weekly Pulse values for conversion and QA pass metrics. | `src/components/admin/OverviewDashboard.tsx` (`Lead Conversion 28%`, `QA Pass Rate 94%`). |
| C-54 (revenue trend accuracy) | Verified Open | Unified insights trend currently computes revenue trend against zero previous value, producing skewed/placeholder trend behavior. | `src/components/admin/UnifiedInsightsClient.tsx` (`computeTrend(Number(latestSnapshot?.total_revenue ?? 0), 0)`). |

Coverage update:
- Validated and explicitly tracked in this guide: 32 items.
- Continue batch validation until the condensed 166-item set is fully statused.

## Validated Findings Ledger (DB and Runtime Artifacts)

Source:
- `blueprint/active/feedback3.0-validation-evidence-2026-04-11.md` (Section 5.1 promotion tracker and artifact notes).

| ID | Status | Validation Result | Evidence |
| --- | --- | --- | --- |
| C-44 (`quote_templates`) | Resolved (Runtime Verified) | Table/policy/runtime smoke evidence recorded and promoted. | `feedback3.0-validation-evidence-2026-04-11.md` Section 5.1 + 5.2 + 5.3. |
| C-66 (`automation_settings`) | Resolved (Runtime Verified) | Table/policy/runtime evidence recorded and promoted. | `feedback3.0-validation-evidence-2026-04-11.md` Section 5.1 + 5.2 + 5.4. |
| C-41 (`scheduled_date` / `scheduled_time`) | Partial | Column artifacts captured; admin runtime proof still pending. | `feedback3.0-validation-evidence-2026-04-11.md` Section 5.1 + 5.5. |
| C-42 (`checklist_completed_at`) | Partial | Column artifacts captured; completion write/read runtime proof still pending. | `feedback3.0-validation-evidence-2026-04-11.md` Section 5.1 + 5.5. |
| C-40 (multi-crew RLS visibility) | Partial | Policy artifacts confirm remaining gap; runtime proof still blocked/pending. | `feedback3.0-validation-evidence-2026-04-11.md` Section 5.1 + 5.2 + 5.6. |
| #1047 (`attempts` vs `attempt_count`) | Verified Open | Dual-column collision validated; dispatch retry runtime row proof pending. | `feedback3.0-validation-evidence-2026-04-11.md` Section 5.1 + 5.7. |

Coverage update:
- Validated and explicitly tracked in this guide: 38 unique items.
- Remaining condensed findings still require continuing batch validation.

## Validated Findings Ledger (Public Conversion and Accessibility)

| ID | Status | Validation Result | Evidence |
| --- | --- | --- | --- |
| C-1 (skip-link target correctness) | Verified Open | Root skip link still targets body-level id (`#site-main-content`) instead of page `<main id="main-content">`; only a subset of pages define `main-content`. | `src/app/layout.tsx` and `main-content` occurrences in select service pages. |
| C-6 (dedup step-2 continuity) | Verified Open | Quote-request dedup branch returns synthetic lead id (`deduped`) without enrichment token continuity for step-2 flow. | `src/app/api/quote-request/route.ts` dedup guard response. |
| C-2 (conversion event reliability) | Verified Open | Conversion endpoint inserts event without checking insert error and still returns `{ ok: true }`, masking ingestion failures. | `src/app/api/conversion-event/route.ts`. |

Coverage update:
- Validated and explicitly tracked in this guide: 41 unique items.
- Continue batch validation across remaining condensed findings.

## Validated Findings Ledger (Public Content and Map Rendering)

| ID | Status | Validation Result | Evidence |
| --- | --- | --- | --- |
| C-7 (FAQ schema alignment on service pages) | Resolved (Code) | Service pages currently include both FAQ schema (`FAQPage` + `mainEntity`) and visible FAQ UI via hardening component FAQ accordion. | `src/app/(public)/services/*/page.tsx`, `src/components/public/variant-a/ServicePageHardening.tsx`. |
| C-8 (service-area map geometry) | Verified Open | Service-area map SVG still uses square viewBox (`0 0 100 100`), preserving the original geometry-risk pattern. | `src/app/(public)/service-area/page.tsx`. |
| C-9 (map color parsing from class string) | Verified Open | Map dot color still derives by parsing Tailwind-like class text (`replace("bg-[", "")`), which is brittle to class-format changes. | `src/app/(public)/service-area/page.tsx`. |

Coverage update:
- Validated and explicitly tracked in this guide: 44 unique items.
- Remaining condensed findings still require additional batch passes.

## Full Canonical Coverage Completion (SB/C/XF)

Canonical denominator:
- `master-rework-doc-2.0` canonical IDs: 129
- Already explicitly ledgered in this guide before this section: 45
- Remaining canonical IDs mapped in this section: 84

Result:
- Canonical coverage now complete in this guide (all 129 SB/C/XF IDs are statused).

### Findings-Dump-Only Canonical IDs (16) Reconciled

These IDs appear in `findings-dump.md` but not in the 2.0 canonical set. They are now explicitly mapped for full findings-dump coverage.

| ID | Status | Reconciliation Note |
| --- | --- | --- |
| SB-7 | Verified Open | Alias/renumbering of `#1043` privilege-escalation ship-blocker; tracked in this guide under SB-6 lineage and remains highest-priority open until runtime regression proof is complete. |
| XF-36 | Resolved (Conditional) | Hiring schema-gap framing superseded by later migration-backed reconciliation in master (employment-app schema fixes). |
| XF-37 | Partial | Earlier cross-file symptom cluster for hiring/insights drift; reduced by schema fixes but still dependent on runtime/hiring-surface validation. |
| XF-38 | Partial | API-route + schema mismatch theme narrowed after migration coverage; keep partial until full hiring runtime pass. |
| XF-39 | Partial | Findings-dump explicitly marks schema layer resolved while noting possible remaining code-layer issues. |
| XF-40 | Verified Open | Duplicate employment email implementations remain a live architecture issue (`employment-application/route.ts` vs resilient-email path). |
| XF-41 | Verified Open | Notification queue retry semantics vs attempts-reset behavior remains an open queue-control issue. |
| XF-42 | Verified Open | NotificationCenter join normalization bug aligns with open relation `[0]` handling issues. |
| XF-43 | Resolved (Code) | `assignment_notification_log` table concern superseded by migration-backed existence evidence. |
| XF-44 | Verified Open | `normalizeRelation` reuse/refactor remains open and tied to unresolved relation-shape bugs. |
| XF-45 | Verified Open | Divergent auth strategy between middleware and API-route auth remains open and security-relevant. |
| XF-46 | Resolved (Runtime Verified) | `quote_templates` table availability concerns reconciled by runtime artifact promotion for C-44. |
| XF-47 | Verified Open | Inventory FK join normalization issue remains open in current cross-file framing. |
| XF-48 | Resolved (Runtime Verified) | Quote-template phantom-table framing reconciled by runtime artifact promotion for C-44/C-66 chain. |
| XF-49 | Resolved (Code) | Employee assignment maps-link path marked as resolved in findings reconciliation chain. |
| XF-50 | Verified Open | Duplicate email implementation finding duplicates XF-40 and remains open under that architecture issue. |

### Remaining C-ID Status Mapping (34)

Resolved or superseded from master appendix evidence:
- `C-14, C-29, C-32, C-33, C-34, C-37, C-43, C-45, C-50, C-51, C-52, C-53, C-55, C-56, C-57, C-59, C-60, C-61, C-62, C-65, C-67, C-68, C-69, C-72`

Partial (master/evidence indicates incomplete closure):
- `C-22, C-71`

Verified Open (active critical or unresolved in master + current pass context):
- `C-3, C-4, C-15, C-23, C-35, C-49, C-58, C-73`

### Remaining XF-ID Status Mapping (50)

Resolved or conditionally resolved by migration/artifact path:
- `XF-25, XF-26, XF-27, XF-52, XF-55, XF-56, XF-64, XF-65`

Partial (depends on related C-item closure or environment verification):
- `XF-24, XF-28, XF-58, XF-62`

Verified Open (unresolved systemic cross-file items):
- `XF-1, XF-2, XF-3, XF-4, XF-5, XF-6, XF-7, XF-8, XF-9, XF-10, XF-11, XF-12, XF-13, XF-14, XF-15, XF-16, XF-17, XF-18, XF-19, XF-20, XF-21, XF-22, XF-23, XF-29, XF-30, XF-31, XF-32, XF-33, XF-34, XF-35, XF-51, XF-53, XF-54, XF-57, XF-59, XF-60, XF-61, XF-63`

Validation boundary note:
- This completes full canonical coverage tracking.
- Runtime-only closures remain gated by environment artifacts (already called out in the DB/runtime ledger).

Findings-dump boundary note:
- With the reconciliation table above, findings-dump-only canonical IDs are now explicitly statused in this guide.

## Sub-Findings Validation Coverage (#880-#980)

Declared sub-findings in findings dump:
- Range: `#880-#980`
- Total declared: 101
- Represented in this validation pass: 101
- Missing sub-findings: 0

Bucket distribution from findings declarations:
- Critical issues: 12
- High issues: 24
- Medium issues: 31
- Low issues: 2
- Unlabeled/general issue bucket: 31

Sub-finding status rule used for end-to-end validation:
1. A sub-finding is considered covered when it is mapped to a parent canonical item and that parent has an explicit status in this guide.
2. If a sub-finding has no credible superseding evidence, it inherits `Verified Open` from its parent.
3. If migration/runtime evidence promoted the parent, sub-findings inherit that promoted status.
4. Runtime-only confirmations remain gated until artifacts are captured.

Audit result:
- No orphaned declared sub-finding IDs remain in the `#880-#980` set.
- Numeric sub-findings are now fully included in validation scope via parent-canonical inheritance.

## Partial-Item Closure Conditions

| ID | Current Status | Closure Condition to Promote |
| --- | --- | --- |
| SB-4 | Partial | Remove non-production fallback secret path and enforce single required secret source across all runtime environments. |
| SB-5 | Partial | Add missing required env keys (including QuickBooks set) to validation contract and invoke `validateServerEnvironment()` at startup/runtime entrypoints. |
| SB-6 | Partial | Apply role-source hardening migration to target DB and capture runtime proof that signup role reads from `raw_app_meta_data` only. |
| C-10 | Partial | Add direct nav affordances for `dispatch` and `scheduling` modules in sidebar IA and verify route/module parity in admin shell. |
| C-13 | Partial | Replace exact timestamp equality checks with overlap-window conflict detection in quote-to-job and lead quick-check paths. |
| C-39 | Partial | Align assignment conflict strategy to availability windows (not exact timestamp) across scheduling and job-create flows. |
| C-40 | Partial | Promote multi-crew RLS policy fix with runtime cross-crew visibility tests in target environment. |
| C-41 | Partial | Capture admin runtime write/read proof for `scheduled_date` and `scheduled_time` fields after migration deployment. |
| C-42 | Partial | Capture runtime proof that `checklist_completed_at` is written and read correctly through completion flow. |
| C-22 | Partial | Complete unresolved closure path documented in master/evidence appendix and attach file-level + runtime proof before status promotion. |
| C-71 | Partial | Complete unresolved closure path documented in master/evidence appendix and attach file-level + runtime proof before status promotion. |
| XF-24 | Partial | Resolve dependent C-item blockers and verify cross-file behavior with post-fix runtime pass. |
| XF-28 | Partial | Resolve dependent C-item blockers and verify cross-file behavior with post-fix runtime pass. |
| XF-37 | Partial | Complete hiring/insights runtime validation to confirm remaining drift has been removed. |
| XF-38 | Partial | Complete hiring API + schema runtime pass and remove residual mismatch evidence. |
| XF-39 | Partial | Verify code-layer parity for the previously schema-resolved issue and attach runtime proof. |
| XF-58 | Partial | Resolve linked canonical blockers and validate runtime behavior in affected module chain. |
| XF-62 | Partial | Resolve linked canonical blockers and validate runtime behavior in affected module chain. |

## Drift Control
If transcript claims and code differ:
1. Mark drift in the implementation lock manifest.
2. Treat codebase as current truth unless overridden.
3. Validate before applying transcript-proposed behavior.

## Change Log
- 2026-04-12: Converted this file from mixed transcript+planning to control-plane format.
- 2026-04-12: Archived full prior content to blueprint/archive/2026-04-12-active-cleanup/solutioning-guide-transcript-2026-04-12.md.
- 2026-04-12: Added implementation lock file at blueprint/active/solutioning-implementation-lock-manifest.md.
- 2026-04-12: Added findings-to-target coverage reconciliation to clarify that lock count is phase coverage, not total solution count.
- 2026-04-12: Added automated validation batch-1 evidence and blocker fix summary.
- 2026-04-12: Added ship-blocker validated findings ledger with evidence-backed statuses.
- 2026-04-12: Added priority-B pipeline validated findings ledger (C-36/C-46/C-47/C-48/C-64).
- 2026-04-12: Added priority-C and priority-D validated findings ledgers with evidence-backed statuses.
- 2026-04-12: Added data-integrity and stability validated findings ledger (C-16/C-24/C-28/C-30/C-31/C-38).
- 2026-04-12: Added security and insights-integrity validated findings ledger (C-11/C-19/C-54/C-63/C-70).
- 2026-04-12: Added DB/runtime artifact validated findings ledger (C-40/C-41/C-42/C-44/C-66/#1047).
- 2026-04-12: Added public conversion/accessibility validated findings ledger (C-1/C-2/C-6).
- 2026-04-12: Added public content/map validated findings ledger (C-7/C-8/C-9).
- 2026-04-12: Completed full canonical SB/C/XF coverage mapping for all remaining IDs.
- 2026-04-12: Added findings-dump-only canonical ID reconciliation (SB-7, XF-36..XF-50).
- 2026-04-12: Added full sub-findings coverage audit for declared `#880-#980` set.
- 2026-04-12: Added critical baseline finding that prior transcript resolutions are treated as proposal-level until evidenced in current repo state.
- 2026-04-12: Added migration deployment gate and explicit blocked-item list for runtime promotion.
- 2026-04-12: Added findings count hierarchy note (`~1060 -> 166 -> 129 + reconciled remainder`).
- 2026-04-12: Added Validation Batch 2 placeholder for Session 13 implementation verification.
- 2026-04-12: Added explicit closure conditions for all items currently marked `Partial`.
