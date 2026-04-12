# Solutioning Implementation Lock Manifest

Date: 2026-04-12
Scope: Preserve accepted implementation intent while cleaning the active guide.

## Canonical Rule
The active guide is a control-plane document. Long code snippets and transcript blocks are archived, not deleted. Implementation fidelity is enforced from real code files plus this manifest.

## Locked Artifacts
- Archived full transcript: blueprint/archive/2026-04-12-active-cleanup/solutioning-guide-transcript-2026-04-12.md
- Active control-plane guide: blueprint/active/solutioning-guide.md

## Current Code Snapshot (Working Tree)
Modified files currently present in the workspace snapshot:
- Production-workspace/src/app/(public)/contact/page.tsx
- Production-workspace/src/app/(public)/page.tsx
- Production-workspace/src/app/api/quote-request/route.ts
- Production-workspace/src/app/quote/success/page.tsx
- Production-workspace/src/components/admin/SchedulingAndAvailabilityClient.tsx
- Production-workspace/src/components/admin/TicketManagementClient.tsx
- Production-workspace/src/components/public/PublicChrome.tsx
- Production-workspace/src/components/public/variant-a/AuthorityBar.tsx
- Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx
- Production-workspace/src/components/public/variant-a/HeroSection.tsx
- Production-workspace/src/components/public/variant-a/useQuoteForm.ts
- Production-workspace/src/lib/env.ts
- Production-workspace/src/lib/idempotency.ts
- Production-workspace/src/lib/middleware/auth.ts

Untracked files currently present in the workspace snapshot:
- Production-workspace/supabase/migrations/0024_fix_handle_new_user_role_source.sql
- blueprint/active/bring-it-to-an-a.md
- blueprint/active/feedback3.0-validation-evidence-2026-04-11.md
- blueprint/active/findings-dump.md
- blueprint/active/master-rework-doc-2.0.md
- blueprint/active/solutioning-guide.md

## Transcript-Referenced New Files (Not Found in Current Codebase)
These were referenced in the transcript and should be treated as pending until actually created in code:
- Production-workspace/src/lib/supabase/relation-helpers.ts
- Production-workspace/src/components/admin/ClientsClient.tsx
- Production-workspace/src/lib/service-types.ts

## Symbol-Level Implementation Locks
Use these as the source of truth for implementation fidelity during rework.

| Lock ID | Issue Area | File | Symbol / Section | Locked Behavior | Validation Proof |
| --- | --- | --- | --- | --- | --- |
| LOCK-001 | Middleware auth gating | Production-workspace/src/lib/middleware/auth.ts | evaluateAuth | Preserve admin/employee route gating, login redirects, and authenticated-user bounce-away behavior. | Middleware route smoke check for /admin, /employee, /auth/admin, /auth/employee with admin/employee/anon users. |
| LOCK-002 | Env contract enforcement | Production-workspace/src/lib/env.ts | getPublicEnv, requireServerEnv, validateServerEnvironment | Preserve required env throws, optional warnings, and production safeguards for preview and rate-limit config. | Boot/startup env validation output plus API boot test in prod-like env. |
| LOCK-003 | Quote request token + dedup flow | Production-workspace/src/app/api/quote-request/route.ts | POST, issueEnrichmentToken, validateEnrichmentToken, buildDedupKey, isDuplicateSubmission | Preserve step1/step2 behavior, enrichment token issuance/verification, dedup window, and rate-limit entry point. | API integration tests covering valid step1/step2, invalid token, duplicate submit, and malformed payloads. |
| LOCK-004 | Quote create job idempotency | Production-workspace/src/app/api/quote-create-job/route.ts | POST | Preserve idempotency guard + replay, existing-job dedup check, lead/client conversion fallback, and assignment conflict handling. | API tests for duplicate calls, existing job case, assignment conflict, and successful job creation. |
| LOCK-005 | Lead pipeline admin workflow | Production-workspace/src/components/admin/LeadPipelineClient.tsx | LeadPipelineClient, updateLeadStatus, createQuote, convertLeadToClient, createJobFromQuote, loadCrewAvailabilityForLead | Preserve lead board orchestration: status transitions, quote creation, conversion to client, job creation from accepted quote, and crew availability checks. | Admin UI workflow test from new lead -> quoted -> won -> job created. |
| LOCK-006 | Ticket operations + QA loop | Production-workspace/src/components/admin/TicketManagementClient.tsx | TicketManagementClient, createTicket, duplicateTicket, updateStatus, saveQaReview | Preserve ticket create/duplicate/status flows and QA semantics (approved -> completed, needs_rework -> in_progress + checklist/assignment reset). | Admin QA regression test with both approved and needs_rework paths. |
| LOCK-007 | Scheduling assignment board | Production-workspace/src/components/admin/SchedulingAndAvailabilityClient.tsx | SchedulingAndAvailabilityClient, createAvailability, deleteAvailability, reassignLeadTo, handleDropOnEmployee, handleTapAssignToEmployee | Preserve drag/tap assignment behavior, availability CRUD, and reassignment semantics. | Scheduling interaction test for create, reassign, and delete availability blocks. |
| LOCK-008 | Public shell + quote panel behavior | Production-workspace/src/components/public/PublicChrome.tsx | PublicChrome | Preserve global public-site chrome composition and variant integration assumptions used by variant-a sections. | Public route visual smoke test across home/contact/quote flow. |
| LOCK-009 | Floating quote entrypoint | Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx | FloatingQuotePanel | Preserve modal open/close state behavior and initial service-type handoff into quote form flow. | UI interaction test for panel toggling and prefilled service type. |
| LOCK-010 | Quote form formatting + resilience | Production-workspace/src/components/public/variant-a/useQuoteForm.ts | useQuoteForm, formatPhoneInput, submitLead | Preserve phone normalization, attribution capture, retryable-error handling, and two-step submission flow contract. | Form submission test matrix for formatting, retry, and step1/step2 paths. |
| LOCK-011 | Authority metrics rendering | Production-workspace/src/components/public/variant-a/AuthorityBar.tsx | AuthorityBar, useCountUp | Preserve animated stat rendering and count-up trigger behavior without changing displayed metric intent. | Visual regression snapshot of authority section in hydrated client render. |

## Drift Entries (Transcript vs Code Reality)
- Issue ID: DRIFT-001
- File: Production-workspace/src/lib/supabase/relation-helpers.ts
- Transcript Claim: Helper exists and exports normalizeRelation for imports.
- Code Reality: File not present in current workspace snapshot.
- Decision: Treat as pending implementation; do not assume helper exists during active refactors.
- Validation Evidence: Current filesystem listing + grep search in Production-workspace/src/lib.

- Issue ID: DRIFT-002
- File: Production-workspace/src/components/admin/ClientsClient.tsx
- Transcript Claim: Admin clients surface exists as implementation target.
- Code Reality: File not present in current workspace snapshot.
- Decision: Keep as planned artifact only; no lockable symbol until created.
- Validation Evidence: Current filesystem listing for Production-workspace/src/components/admin.

- Issue ID: DRIFT-003
- File: Production-workspace/src/lib/service-types.ts
- Transcript Claim: Canonical service-type module exists.
- Code Reality: File not present in current workspace snapshot.
- Decision: Preserve current in-file service-type handling until canonical module is implemented and validated.
- Validation Evidence: Current filesystem listing + grep search in Production-workspace/src/lib.

## Enforcement Rules
1. If a behavior is accepted as valid, preserve it exactly unless explicitly approved to change.
2. Resolve truth from code files first, transcript second.
3. Any new implementation must be logged here with: issue ID, file path, symbol/section, and validation proof.
4. If transcript and code conflict, mark as "drift" and validate before implementation.

## Drift Log Template
- Issue ID:
- File:
- Transcript Claim:
- Code Reality:
- Decision:
- Validation Evidence:
