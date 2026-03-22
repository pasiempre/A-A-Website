# Master Spec 3.0 — Current State

Last Updated: 2026-03-21
Audit Mode: Full-batch review with progressive check-ins
Scope Target: Entire repository (all files + lines) condensed into one operational source of truth

> Status Note (2026-03-21): `Master-Spec-4.0-Current-State.md` is now the active execution source of truth.
> This 3.0 file is retained as historical baseline/reference.

---

## 0) Method

This document is being built in sequential audit batches.

- Each batch has a fixed file scope.
- Each batch records: what was reviewed, what is implemented, what is partial/missing, and what is contradictory or stale.
- Findings are condensed, but every in-scope file is reviewed before closing that batch.
- Codebase and docs are treated as separate evidence layers; contradictions are explicitly resolved.

Batch status legend:

- ✅ complete and verified
- 🟡 partial or ambiguous
- ❌ missing / not implemented
- ⏸ deferred by decision

---

## 1) Batch Register

1. ✅ Batch 1 — Planning docs baseline (`blueprint`, `Gameplan Docs`, `Master-Spec-2.0`)
2. ✅ Batch 2 — App routing and layout surface (`src/app/**`, layout/error/navigation entry points)
3. ✅ Batch 3 — Public experience (`src/app/(public)/**`, `src/components/public/**`)
4. ✅ Batch 4 — Admin experience (`src/app/(admin)/**`, `src/components/admin/**`)
5. ✅ Batch 5 — Employee experience (`src/app/(employee)/**`, `src/components/employee/**`)
6. ✅ Batch 6 — API contracts vs implementation (`src/app/api/**`)
7. ✅ Batch 7 — Domain/lib layer (`src/lib/**`, analytics, notifications, queueing, env)
8. ✅ Batch 8 — Platform/config quality (`middleware.ts`, `next.config.ts`, lint/ts/tailwind/postcss, sentry)
9. ✅ Batch 9 — Data model and migrations (`supabase/migrations/**`, schema docs, RLS/policies)
10. ✅ Batch 10 — Consolidated readiness matrix + launch gates + sprint sequencing

---

## 2) Batch 1 (Complete): Planning Docs Baseline

### 2.1 Reviewed Scope

- Full planning baseline review completed across `blueprint/`, `Gameplan Docs/`, and `Master-Spec-2.0/`.
- Total planning artifacts reviewed in Batch 1: **30 files**.
- Detailed file-by-file inventory is archived in session logs and prior spec snapshots.

### 2.2 Canonical Requirement Baseline (from docs)

#### Public
- Lead capture and quote request flow with immediate operational follow-up.
- Branded quote delivery + acceptance flow.
- Conversion-focused public IA, mobile responsiveness, and strong trust proof.
- SEO/metadata/structured data as non-optional launch hygiene.

#### Admin
- Operationally segmented IA (sales, operations, quality, notifications, analytics, settings).
- Not just module existence: requires guided navigation and priority-based daily workflow.
- Lead pipeline discipline, job dispatch clarity, QA review gate, and financial visibility.

#### Employee
- Spanish-first, mobile-first execution with low cognitive load and fast completion.
- Offline-safe photo evidence flow + issue reporting.
- Clear state transitions and minimal-friction completion path.

#### API / Security / Data
- Rate-limited public endpoints and hardened input validation.
- Event-driven notification architecture with retry and dedup.
- Full RLS posture and migration hygiene.
- End-to-end observability and failure-mode fallback behavior.

#### QA / Launch / Ops
- Smoke + verification checklist coverage.
- Launch gates include real-device validation (SMS/photo flow), not only local lint/type passes.
- Deployment/cron/automation responsibilities must be explicit.

### 2.3 Cross-Doc Contradiction and Drift Findings

- Most conflicts are temporal (older spec snapshots vs newer implementation logs).
- Repeated drift class: “component exists” reported as success where IA/usability contract is still unmet.
  - **Evidence:** Planning checklists often mark modules complete when a foundational UI or API route is built, but operational use (like QA review or checklist completion) still lacks the necessary end-to-end UX cohesion.
- QA and resource-library expectations vary by phase in multiple docs; phase ownership is inconsistent.
  - **Evidence:** `Gameplan Docs/Phase-2C-QA-Module-Design.md` (e.g., L839-L928) heavily specs out a Resource Library with schema definitions for Phase 2, whereas `Gameplan Docs/Confirmed Context.md` (L37-L41) and `blueprint/MASTER-SPEC-STATUS.md` (L56) explicitly defer it to Phase 3 or later.
- Launch-readiness language in some docs appears stronger than supporting evidence (especially real-device and operational automation proof).
  - **Evidence:** `blueprint/SESSION-LOG.md` (L201) and `blueprint/WORK-BACKLOG.md` (L15) aggressively claim "✅ Phase 4: QuickBooks Integration (COMPLETE)", but `blueprint/TECH-STACK-SNAPSHOT.md` (L48) and `blueprint/API-CONTRACTS.md` (L27) admit the integration is actually "🔴 Simulated / Pending".

### 2.4 Stale or Ambiguous Assumptions to Eliminate in 3.0

- Assumption that module presence implies operational readiness.
  - **Context:** Admin UI tables or skeleton modules (like unified insights) are present, but the underlying data mutation logic, pagination, or mobile-friendly interaction is not yet production-safe.
- Assumption that automation exists wherever an endpoint exists (cron trigger ownership often unclear in docs).
  - **Evidence:** `blueprint/API-CONTRACTS.md` (L21) defines `/api/lead-followup` as a "cron" endpoint, and `blueprint/DB-SCHEMA-SUMMARY.md` (L239) assumes it "runs periodically (cron job)". However, `blueprint/MASTER-SPEC-STATUS.md` (L28) clarifies that while the logic exists, "cron scheduling/ops proof is remaining" (i.e., no external cron service is actually triggering it).
- Assumption that all crew/device constraints are already validated in production-like conditions.
  - **Context:** The offline photo queue is built theoretically, but real-world network degradation, device storage limits, and employee field testing haven't been systematically proven beyond local simulations.
- Assumption that financial integrations are complete when some surfaces are still simulation-oriented.
  - **Evidence:** Driven by completion checklists (`PICKUP-GUIDE.md` L70 declares it "COMPLETE"), the assumption is that finance sync is ready. Yet, `MASTER-SPEC-STATUS.md` (L58) accurately catches that `quickbooks-sync` is "currently simulated/queued" pending real credential configuration.

### 2.5 Normalization Rules Adopted for Master Spec 3.0

1. **Newest approved decision wins** over older planning text.
2. **Code evidence overrides aspirational wording** for current-state claims.
3. Every major feature must carry: `State`, `Evidence`, `Gaps`, `Acceptance Gate`.
4. Deferred features must include explicit `deferral reason`, `risk`, and `re-entry condition`.
5. Requirements are tracked by stable IDs to avoid wording drift across docs.

### 2.6 Batch 1 Outcome

- ✅ Planning/spec baseline established.
- ✅ Contradiction classes identified.
- ✅ Master Spec 3.0 structure initialized.
- 🟡 Remaining: code evidence batches (2–9) required before final status can be declared complete.

---

## 3) Current Global Snapshot (Provisional until code batches complete)

- Foundation appears strong in architecture/security direction.
- Highest risk lies in workflow completeness and UX coherence (especially admin/employee day-to-day operations), not in pure feature count.
- Public conversion surface is advanced, but enterprise trust/proof and decision-path clarity likely still under-specified relative to top competitors.
- Final confidence score is withheld until all code batches are reviewed.

---

## 4) Pending Batch Sections (to be filled)

### 4.1 Batch 2 — App Routing and Layouts

#### Scope Reviewed

- `src/app/**` excluding `src/app/api/**`
- Root app files (`layout.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts`)
- Route groups: `(public)`, `(admin)`, `(auth)`, `(employee)`, `quote/[token]`
- Route-level shell dependencies used by page composition:
	- `src/components/public/PublicPageShell.tsx`
	- `src/components/admin/AdminShell.tsx`
	- `src/components/admin/AdminSidebarNav.tsx`

#### Findings

1. **Route coverage is broad and present**, but layout/shell composition is inconsistent across public pages.
   - **Evidence:** Pages like `(public)/faq/page.tsx` and `(public)/contact/page.tsx` manually wrap their content in `<PublicPageShell>`, meaning layout composition is page-by-page instead of leveraging Next.js nested layout mechanics `layout.tsx`.
2. **Global error and not-found are implemented**, but **route-scoped** boundaries are missing for admin and employee surfaces.
   - **Evidence:** `src/app/` root has `error.tsx` and `not-found.tsx`, but `src/app/(admin)` and `src/app/(employee)` directories lack their own `error.tsx`, `not-found.tsx`, and `loading.tsx` boundary files.
3. **Auth guards are middleware-based and role-aware**; preview mode intentionally bypasses guards in dev.
   - **Evidence:** `middleware.ts` properly restricts `/admin` and `/employee` by role, but explicitly exits early via `if (isDevPreviewEnabled()) { return NextResponse.next(); }`, bypassing all checks.
4. **Admin navigation state is component-local**, not URL-driven; this limits deep-linking/bookmarking and predictable refresh behavior.
   - **Evidence:** `src/app/(admin)/admin/page.tsx` simply renders `<AdminShell />` without nested routes for sub-modules. Navigation happens via React state inside `AdminShell`, keeping the URL static at `/admin`.
5. **Employee surface is monolithic on one route**, limiting deep links for operational subflows.
   - **Evidence:** `src/app/(employee)/employee/page.tsx` vertically stacks `<EmployeeTicketsClient />` and `<EmployeeInventoryClient />` in a single route rather than defining sub-routes for discrete task flows.

#### Risk Assessment (Batch 2)

- 🟡 Medium: public shell inconsistency can create UX drift page-to-page.
- 🟡 Medium: no admin/employee route-scoped error boundaries increases blast radius of module faults.
- 🟡 Medium: admin module local-state routing weakens operational navigation persistence.
- 🟡 Medium: admin access to employee route is valid, but context signaling is weak (supervisor mode ambiguity).

#### Required Actions (to become spec-backed implementation work)

1. Add route-scoped error/loading boundaries for `(admin)` and `(employee)`.
2. Normalize public layout strategy (single route-group layout contract vs per-page shell usage).
3. Define admin module URL state policy (query param or nested route strategy).
4. Define employee route decomposition policy for deep-linkable tasks.
5. Document preview-mode routing/security behavior explicitly in this spec and verification checklist.

#### Batch 2 Outcome

- ✅ Routing/layout architecture fully inventoried for this batch scope.
- ✅ High-risk UX architecture gaps identified and normalized into action items.
- 🟡 Awaiting downstream batches before final implementation sequence is locked.

### 4.2 Batch 3 — Public Experience

#### Scope Reviewed

- Full review of `src/app/(public)/**` routes and route clients.
- Full review of `src/components/public/**` including `variant-a` stack and shell components.
- Public flow helpers that materially affect conversion behavior (quote context/hook and public UX utilities).

#### Public Architecture (Current)

- Homepage is composed through `VariantAPublicPage` with layered conversion sections (hero → trust proof → services/industry fit → visual proof → process → quote).
- Subpages rely on mixed composition patterns (some wrap in `PublicPageShell`, others render standalone).
- Conversion overlays exist and are active: floating quote panel, exit-intent capture, AI assistant, mobile sticky CTA.
- SEO surface is strong on core pages (metadata + schema patterns), especially homepage + service details + FAQ.

#### Implementation State

- ✅ **Strongly implemented**: core homepage funnel, service detail pages, contact funnel, FAQ content depth, trust/proof primitives, quote-entry pathways, event tracking touchpoints.
- 🟡 **Partially implemented**:
	- Service-area experience has interactive coverage UX but dynamic city depth is incomplete.
      - **Evidence:** `src/app/(public)/service-area/[slug]/page.tsx` is implemented using dynamic routing for location data, but these act mostly as localized landing pages rather than featuring deeply integrated localized content.
	- Industry positioning exists as narrative sections but not as dedicated deep-conversion pages.
      - **Evidence:** `src/components/public/variant-a/OfferAndIndustrySection.tsx` beautifully maps out "General Contractors", "Property Managers", and "Commercial Offices" as block targets, but these link to a hash (`/#industries`) instead of dedicated URLs.
	- CTA language/placement is abundant but not fully unified by a measured variant strategy.
	- FAQ breadth is high, but information presentation ergonomics still need tightening for faster scanability.
- ❌ **Missing / not yet delivered**:
	- Fully realized city-specific service-area route depth.
	- Industry route architecture that matches nav intent.
	- Public-facing pricing/SLA transparency layer for self-qualification.
      - **Evidence:** Terms of service and privacy pages explicitly mention "No automated pricing" and that the "AI assistant does not make binding decisions about pricing". Furthermore, no `faq` or `pricing` details exist directly within the `(public)/services` detail pages.
	- Service-specific objection handling (FAQ/proof) on each service page.
      - **Evidence:** `grep` on `(public)/services` yields 0 matches for `faq`, meaning the global FAQ (`src/app/(public)/faq/page.tsx`) handles all objections instead of bringing objections directly to the service point-of-sale.

#### Conversion / UX Risk Highlights

- 🟡 Nav intent mismatch risk: some top-level buyer-intent choices route as section jumps instead of page-level paths.
  - **Evidence:** In `src/components/public/variant-a/PublicHeader.tsx`, the `Industries` dropdown links exclusively point to `/#industries` anchor tags on the homepage, rather than deeply dedicated `/industries/property-managers` landing pages.
- 🟡 Mid/late-funnel friction risk: service pages do not consistently close with a strong, repeated conversion handoff.
- 🟡 Buyer qualification risk: limited public SLA and budget guidance may reduce enterprise decision confidence.
- 🟡 Differentiation risk: “why us vs alternatives” is mostly implicit rather than explicit.

#### Public Competitive Delta (Enterprise Buyer Lens)

- Existing strengths: specialized positioning, proof-first narrative, bilingual readiness, rapid-response messaging.
- Key gap versus stronger enterprise competitors: explicit procurement-confidence artifacts (SLA clarity, structured proof depth, vertical landing specificity, objection-handling blocks near CTAs).

#### Required Actions from Batch 3

**P0**
1. Complete service-area route depth and ensure city journey is non-stubbed.
2. Resolve industries navigation intent (clear route architecture vs explicit section-jump UX).
3. Normalize end-of-page conversion handoff on service detail pages.

**P1**
4. Add public self-qualification layer (SLA + pricing guidance model).
5. Add service-level objection modules (service-specific FAQ/proof snippets).
6. Standardize CTA taxonomy and track variant performance consistently.

**P2**
7. Expand portfolio/case-study proof surface for enterprise confidence.
8. Add structured industry landing pages if sales strategy requires persona-specific funnels.

#### Batch 3 Outcome

- ✅ Full public-surface review completed for this batch scope.
- ✅ Public strengths and conversion risks condensed into prioritized backlog.
- ✅ Findings integrated into Master Spec 3.0 with implementation-ready sequencing.

### 4.3 Batch 4 — Admin Experience

#### Scope Reviewed

- `src/app/(admin)/**`
- `src/components/admin/**`
- Admin-critical shared UI usage and directly consumed admin helpers/routes

#### Current Admin IA (Observed)

- Admin surface is sidebar-driven through `AdminShell` with grouped module navigation.
- Module selection is primarily local UI state (not robust URL-routed deep linking by module).
  - **Evidence:** `AdminShell.tsx` controls module visibility via `useState<ModuleId>` stored in `localStorage`, meaning navigation does not push to the browser history (`router.push`) and deep linking to specific admin views is impossible.
- Mobile behavior relies on sidebar toggle patterns; several complex modules still carry mobile execution risk.

#### Module Readiness Snapshot

- ✅ **Operationally strong modules**: first-run setup, lead pipeline core flow, ticket management/dispatch primitives, notifications/dispatch queue controls, inventory baseline.
- 🟡 **Partially complete modules**: scheduling, ops enhancements/checklist depth, unified insights/analytics depth, hiring inbox maturity.
- ❌ **Missing maturity areas**: full checklist interaction lifecycle consistency, hardened completion-report automation chain, production-grade financial sync confidence at admin UX layer.

#### Admin Workflow Reality (Lead → Dispatch → Review)

- Core intake-to-assignment lifecycle is present and largely usable.
- QA/completion closure path still has manual seams in places where docs imply end-to-end automation.
- Some analytics and finance surfaces are present but not yet a definitive operational source of truth.

#### Key Friction and Risk Signals

- 🟡 High complexity modules remain fragile on mobile/touch ergonomics.
  - **Evidence:** No mobile touch-specific optimizations (like swipe-to-action) exist in components like `BulkJobActionsClient.tsx` or `SchedulingAndAvailabilityClient.tsx`.
- 🟡 Table-heavy/admin-dense workflows still depend on long scrolling and reduced progressive disclosure.
  - **Evidence:** Components like `InventoryManagementClient.tsx` and `UnifiedInsightsClient.tsx` heavily rely on `<table className="w-full">` implementations that overflow standard viewports.
- 🟡 Module-state persistence works for continuity, but deep-link/share/bookmark admin state is still weak.
- 🟡 Permission/audit confidence at action granularity requires tighter explicit guarantees for sensitive bulk actions.
- 🟡 Pagination is inconsistently applied across lists.
  - **Evidence:** `HiringInboxClient.tsx` accurately implements `setPage` and `.range()` for pagination, but other dense lists like jobs or dispatch lists render massive arrays natively without pagination (e.g. `query.limit(200)` in `DispatchModule`).

#### Spec-vs-Code Contradiction Pattern (Admin)

- Documentation language often marks modules “complete” where code indicates “usable core + partial depth.”
- Dashboard intelligence expectations (priority-driven operational cockpit) exceed current practical data density in places.
- QA/checklist expectations in planning docs are stronger than current end-user completion mechanics in admin-crew loop.

#### Required Actions from Batch 4

**P0**
1. Close admin mobile/touch risk in critical operational modules.
2. Harden sensitive action guards and auditability at per-action level.
3. Remove manual seams in checklist/QA closure path that block deterministic completion flows.

**P1**
4. Improve admin workflow density: pagination, scanability, and high-volume list ergonomics.
5. Strengthen completion-report dispatch automation and escalation pathways.
6. Lift hiring/insights modules from partial to operationally dependable baselines.

**P2**
7. Upgrade admin cockpit to true “prioritized day view” with actionable KPIs.
8. Add deeper conflict-detection and exception-resolution UX in scheduling/ops.

#### Batch 4 Outcome

- ✅ Admin architecture and module readiness deeply reviewed.
- ✅ Core-vs-depth distinction documented to prevent false completion assumptions.
- ✅ Prioritized admin stabilization backlog captured for implementation sequencing.

### 4.4 Batch 5 — Employee Experience

#### Scope Reviewed

- `src/app/(employee)/**`
- `src/app/(auth)/auth/employee/**`
- `src/components/employee/**`
- Directly used workflow helpers for photo queue/upload and employee execution support

#### Workflow Reality (Field Execution)

- Employee authentication and protected entry flow is present and usable.
- Core execution loop is implemented: assignment visibility → status updates → completion evidence upload → issue reporting.
- Offline photo queue architecture is materially strong with retry behavior and recovery intent.

#### Implementation State

- ✅ **Strongly implemented**: OTP login flow, assignment interaction, status progression, issue capture, photo processing + offline-safe queueing, Spanish-first UX coverage.
  - **Evidence:** Offline retry behavior and automated queues are explicitly implemented in `EmployeeTicketsClient.tsx` via `enqueuePendingPhotoUpload` and the `PhotoInventoryModal` which displays queued images. Spanish UX is verified by hardcoded strings like "Subiendo...", "Subir foto", and "Portal Empleado".
- 🟡 **Partially implemented**: checklist interaction depth and edge-case visibility in queue/upload state communication.
- ❌ **Missing / not fully aligned to higher-phase expectations**:
	- employee navigation maturity (tab/depth structure),
      - **Evidence:** `src/app/(employee)/employee/page.tsx` stacks `<EmployeeTicketsClient />` and `<EmployeeInventoryClient />` continuously on one scrollable page instead of providing an isolated tab structure for navigation between them.
	- profile/self-management depth,
      - **Evidence:** Zero search results found for "profile" management or self-serve details within `(employee)` or `components/employee`.
	- richer upload progress feedback for multi-photo tasks,
      - **Evidence:** Uploading provides basic disabled states (`disabled={uploadingCompletionFor === assignment.id}`) with "Subiendo...", but does not provide granular multi-photo upload progress bars.
	- strict phase-gating of non-core surfaces where rollout docs expect deferral.
      - **Evidence:** Inventory tools like `EmployeeInventoryClient` are rendered to all employees despite Phase 3 documentation stating supply tracking should be deferred if field adoption is low.

#### Field UX / Reliability Risk Highlights

- 🟡 Connectivity resilience is good at queue layer, but user-facing clarity during degraded networks needs stronger guidance.
  - **Evidence:** Network drops trigger generic Supabase `throw new Error(...)` boundaries inside `EmployeeInventoryClient.tsx` rather than dedicated "You are currently offline, switches to local mode" banners outside of the upload queues.
- 🟡 Operational density in a single surface raises discoverability/priority risks for first-time or low-tech users.
  - **Evidence:** Combining assignment interaction forms, photo uploads, issue reporting textareas, and supply usage requests on a single un-tabbed mobile screen creates significant vertical scrolling.
- 🟡 Some higher-phase UX expectations are documented but not fully surfaced in current employee UI contract.

#### Security / Data Integrity Notes

- Permission model appears directionally correct for employee-scoped access patterns.
- Additional explicit denial-state UX and session cleanup semantics should be hardened for edge cases.

#### Required Actions from Batch 5

**P0**
1. Resolve employee navigation structure and phase-aligned visibility of modules.
2. Add clearer multi-photo upload progress and failure-state communication.
3. Close rollout mismatches where current UI exposes features outside intended phase gate.

**P1**
4. Upgrade checklist interaction model to match expected operational semantics.
5. Improve connectivity/error affordances and explicit access-denied handling.

**P2**
6. Add deeper field ergonomics (profile/self-service depth, richer media handling diagnostics).

#### Batch 5 Outcome

- ✅ Employee workflow deep review completed.
- ✅ Core field execution strength confirmed.
- ✅ Phase-alignment and UX maturity gaps translated into prioritized backlog.

### 4.5 Batch 6 — API Surface

#### Scope Reviewed

- Full route review across `src/app/api/**`.
- API-adjacent helper layer directly used by routes (notifications, email, env, quote/report helpers, rate limiting).
- Contract alignment cross-check against `blueprint/API-CONTRACTS.md`.

#### Endpoint State (Aggregate)

- API surface is broad and functional across lead intake, quote lifecycle, assignment notifications, completion reporting, analytics events, AI assistant, and QuickBooks sync/callback flows.
- Several endpoints are production-usable now; a few remain intentionally partial/simulated (notably finance integration depth and some automation seams).

#### Reliability / Security Posture

- ✅ Strengths:
	- Input validation exists across key routes.
	- Notification queue/retry patterns are present and materially robust for SMS dispatch workflows.
      - **Evidence:** `notification-dispatch/route.ts` implements dedicated `"sent" | "retry" | "dead_letter" | "deduped" | "failed"` statuses and explicitly tracks retries via `telemetry.retried` along with automatic error logging for exhausted attempts.
	- Admin-protected routes generally enforce role checks before sensitive operations.
      - **Evidence:** Multiple API endpoints (`quote-send`, `quickbooks-sync`, `quote-create-job`, `assignment-notify`) properly invoke `const auth = await authorizeAdmin(); if (!auth.ok) { return NextResponse... }` as a middleware-like check.
- 🟡 Gaps:
	- Some public endpoint protections and rate-limit definitions are split/duplicated, creating policy drift risk.
      - **Evidence:** `quote-request/route.ts` hardcodes a check for `{ windowMs: 3_600_000, max: 5 }` and `ai-assistant/route.ts` also independently imports `checkRateLimit` rather than routing through a unified middleware policy file.
	- Idempotency is inconsistent across quote/lead-adjacent operations.
      - **Evidence:** Grep analysis over `src/app/api/` finds 0 occurrences of "idempotency" or idempotency keys, meaning webhooks, lead forms, or quote submissions could potentially duplicate data if the client double-clicks.
	- Email reliability fallback (queue/dead-letter parity vs SMS) is less mature in places.
	- Contract docs and route behavior are not fully synchronized on select limits/expectations.

#### Contract Drift Pattern

- Multiple doc-vs-code mismatches were found in endpoint-level constraints and behavior claims.
- Highest operational risk is not missing endpoints, but **mismatch between documented guarantees and runtime behavior**.

#### Required Actions from Batch 6

**P0**
1. Close critical auth/fail-safe gaps on internal/cron-style routes.
2. Align high-impact public endpoint protections and rate-limit truth with one canonical policy.
3. Complete missing notification side-effects where business flow assumes they occur.

**P1**
4. Add/standardize idempotency guards for retry-prone write endpoints.
5. Raise email delivery resilience toward SMS-grade queue/retry behavior.
6. Reconcile `API-CONTRACTS.md` with live behavior for all drifted fields.

**P2**
7. Improve observability depth for fallback paths and silent degradations.
8. Move toward shared/distributed rate-limit state for scale-safe enforcement.

#### Batch 6 Outcome

- ✅ Full API batch reviewed and categorized by readiness.
- ✅ Reliability/security/drift risks condensed into action backlog.
- ✅ Backend is functionally strong but requires policy and resilience normalization before final “ready” designation.

### 4.6 Batch 7 — Lib/Domain Layer

#### Scope Reviewed

- Full review of `src/lib/**` including notification, assignment, quote, email, analytics, ticketing, upload, env/config, rate-limit, smoke-test utilities.
- Full review of `src/lib/supabase/**` client wrappers.

#### Domain Architecture Snapshot

- Domain layer is broad and functionally rich, with clear capability clusters:
	- Supabase client access,
	- env/config guards,
	- notifications + queueing,
	- quote/email/pdf utilities,
	- photo queue/upload helpers,
	- analytics + operational utilities,
	- finance sync helpers.
- Many workflows demonstrate production intent, especially around retry and failure classification in notification-oriented paths.

#### Quality / Reliability Assessment

- ✅ Strengths:
	- robust retry/dedup patterns in notification flows,
      - **Evidence:** `notifications.ts` fully specifies exponential backoff config via `DEFAULT_RETRY_OPTIONS` and maps transient/permanent failure statuses for accurate queue retention mapping.
	- strong defensive logic in several async pipeline helpers,
	- generally high documentation/readability in core operational utilities.
- 🟡 Gaps:
	- high central coupling to admin-client data access paths in server helpers,
      - **Evidence:** Found 14 identical imports across files inside `src/lib` using `createAdminClient()` tightly coupling those domain tools specifically to full elevated privileges, bypassing explicit injected clients.
	- inconsistent timeout/abort discipline across external-service calls,
      - **Evidence:** While `quickbooks.ts` has specific `setTimeout` and `retry` blocks, `email.ts` relies on an un-timeout-guarded basic `fetch()` call for the Resend API.
	- uneven testability due to direct service wiring and limited abstraction seams.

#### Security / Resilience Notes

- Security posture is directionally strong in sensitive integration areas.
- Biggest reliability risk is not missing logic, but inconsistent operational hardening parity across channels (e.g., queue/retry maturity differences by integration type).

#### Technical Debt Hotspots (Batch 7)

1. Cross-domain coupling to shared persistence clients reduces modular testability.
2. External-call timeout and fallback behavior is uneven.
3. Some observability pathways are operationally useful but still fragmented.
4. Rate-limit and anti-abuse strategy has scale/durability limitations if traffic grows.
   - **Evidence:** `rate-limit.ts` uses an ephemeral, in-memory `const store = new Map<string, RateLimitEntry>();`. This resets completely upon lambda execution restarts and has zero horizontal scaling durability.

#### Required Actions from Batch 7

**P0**
1. Introduce stronger abstraction seams around core persistence/integration clients for testability and fault isolation.
2. Enforce consistent timeout/cancellation policy for all outbound provider calls.
3. Normalize alerting/telemetry for critical integration failures.

**P1**
4. Increase retry/fallback parity across email/finance/auxiliary channels.
5. Improve shared validation/util contracts to reduce duplicate logic drift.
6. Expand automated coverage around retry/idempotency edge cases.

**P2**
7. Refine modular boundaries for cleaner domain ownership and easier phased refactors.
8. Evolve rate-limiting and abuse controls toward distributed durability.

#### Batch 7 Outcome

- ✅ Domain/lib layer fully assessed for architectural quality and resilience.
- ✅ High-value hardening opportunities captured without requiring broad rewrites.
- ✅ Backlog sequenced to stabilize reliability before further feature expansion.

### 4.7 Batch 8 — Platform and Config

#### Scope Reviewed

- `middleware.ts`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `tailwind.config.js`, `postcss.config.js`, `package.json`.
- `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`.
- `.env.example`, `README.md`, and relevant sprint/setup docs.

#### Platform Posture Snapshot

- ✅ Platform is materially production-oriented for MVP:
	- role-based middleware guards,
	- endpoint-tiered rate limiting,
	- security headers,
	- Sentry instrumentation across client/server/edge,
	- strict TypeScript and lint baselines,
	- well-structured design token configuration.
- 🟡 Primary constraints are operational hardening and maintainability, not foundational capability.

#### Key Risks (Config Layer)

1. Rate-limit storage durability/scalability risk under multi-instance scaling.
   - **Evidence:** `middleware.ts` implements rate limiting using an ephemeral `const rateLimitStore = new Map<string, number[]>();` which will completely wipe upon lambda cold starts and cannot sync state across multiple server instances or edge nodes.
2. Cron-style route protection and env-governance practices need explicit enforcement.
   - **Evidence:** While routes like `lead-followup` check `process.env.CRON_SECRET`, the `README.md` currently lists protecting this endpoint with `CRON_SECRET` as "(Optional)", which poses a risk if missed during deployment.
3. Middleware complexity concentration increases test/refactor risk.
   - **Evidence:** `middleware.ts` is currently a monolithic ~360-line file that simultaneously handles role-based routing (`getRole`), rate limiting logic, security header injection, and logging without delegating to testable sub-modules.
4. Runtime env safety relies too heavily on manual setup without stronger startup validation contracts.
   - **Evidence:** `src/lib/env.ts` currently only enforces two variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`), completely missing startup guards for critical secrets like Twilio, Resend, or QuickBooks credentials.

#### Drift / Documentation Gaps

- Most top-level platform docs align with code.
- Highest drift is in operational details (e.g., secret enforcement and policy rationale documentation), not in stack declarations.

#### Required Actions from Batch 8

**P0**
1. Enforce critical cron/internal-route secret checks consistently.
2. Add typed env validation and fail-fast startup contracts.
3. Extract and centralize rate-limit policy definitions.

**P1**
4. Refactor middleware into testable modules.
5. Add focused test coverage for auth/rate-limit/security-header behavior.
6. Normalize shared observability configuration across Sentry surfaces.

**P2**
7. Move toward distributed rate-limit durability and richer policy observability.
8. Improve configuration/runbook documentation for ops agility.

#### Batch 8 Outcome

- ✅ Config/platform layer audited end-to-end.
- ✅ MVP viability confirmed with targeted hardening backlog.
- ✅ Clear separation between immediate safety work and scale-oriented improvements.

### 4.8 Batch 9 — Database and Migrations

#### Scope Reviewed

- Full migration chain under `supabase/migrations/**`.
- Supabase client wrappers under `src/lib/supabase/**`.
- Cross-check against `blueprint/DB-SCHEMA-SUMMARY.md`, `blueprint/SESSION-LOG.md`, and `blueprint/MASTER-SPEC-STATUS.md`.

#### Data Layer Reality

- Schema is materially mature and broad, covering business core, operations, notifications, financial sync, hiring, analytics/event scaffolding, and inventory foundations.
- Migration chain is strongly defensive (idempotent/additive orientation), with late-stage hardening migrations closing key security and consistency gaps.
- RLS posture is significantly stronger now than earlier docs imply; table protection coverage is high and role-scoped patterns are present.

#### Migration Integrity Assessment

- ✅ Sequencing and re-runnability are strong overall.
- ✅ Additive migration style reduces destructive risk.
  - **Evidence:** Examined `0008`, `0011`, `0012`, `0018`, and `0019` `.sql` migrations; all extensively utilize `IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`, and `CREATE POLICY IF NOT EXISTS` semantics ensuring safe re-runnability.
- 🟡 Historical schema alignment signals exist (later bootstrap-style recovery migration), now stabilized but should be explicitly documented as resolved.
  - **Evidence:** `0018_core_schema_bootstrap.sql` explicitly states in its header that it is an "Idempotent bootstrap of all core tables missing from remote" meant to reconcile instances where early tables were lost or altered manually.
- 🟡 Rollback strategy is still operationally dependent (backup/restore discipline), not migration-native reversal playbooks.

#### RLS / Policy Notes

- Admin and employee access boundaries are directionally correct with row-scoped logic.
- Public insert pathways rely on app-layer abuse controls in addition to DB policy boundaries.
- Some forward-looking role preparation appears in schema evolution and needs final policy normalization before role expansion.
  - **Evidence:** `0019_rls_completion_reports_and_dispatch_queue.sql` acts as an explicit late-stage hardening patch `ALTER TABLE public.completion_reports ENABLE ROW LEVEL SECURITY`, confirming RLS was tightened reactively.

#### Doc Drift (Batch 9)

- Data-layer docs understate current breadth in select domains (financial sync, audit artifacts, evolved status models).
- Migration count and capability depth have moved beyond earlier status snapshots.

#### Required Actions from Batch 9

**P0**
1. Reconcile any remaining role enum/policy evolution drift into one canonical contract.
2. Validate production migration-state parity explicitly against expected chain.
3. Formalize credential rotation/expiry lifecycle for sensitive integrations at schema-process level.

**P1**
4. Add migration verification checks (RLS/FK/index assertions) to reduce silent drift risk.
5. Prepare policy extensions for deferred client-facing read models before portal activation.

**P2**
6. Plan long-horizon data lifecycle controls (growth/partition/audit-depth optimization).
7. Improve schema-doc auto-sync cadence so capability growth is reflected immediately.

#### Batch 9 Outcome

- ✅ Data model and migration layer reviewed end-to-end.
- ✅ Security posture and schema maturity confirmed as a major strength.
- ✅ Remaining risk is governance/documentation parity and forward-role normalization, not missing core foundations.

### 4.9 Batch 10 — Wide Bloat and Redundancy Overview + Final Synthesis

#### Wide Bloat / Redundancy Assessment (Cross-Stack)

This batch focuses on where the system is functionally rich but structurally repetitive, over-fragmented, or carrying duplicate logic/docs that increase maintenance cost and drift risk.

#### 10.1 Documentation Bloat

- Multiple status surfaces repeat overlapping truth (`MASTER-SPEC-STATUS`, `WORK-BACKLOG`, `SESSION-LOG`, grading docs, gameplan docs).
  - **Evidence:** Searching for "status" references returns over a dozen distinct docs (e.g., `PICKUP-GUIDE.md`, `WORK-BACKLOG.md`, `MASTER-SPEC-STATUS.md`, `SESSION-LOG.md`, `DB-SCHEMA-SUMMARY.md`, `VERIFICATION-CHECKLIST.md`, `API-CONTRACTS.md`) that all attempt to document current task status.
- Drift emerges because updates land in one artifact but not all derivatives.
- Net impact: decision latency, conflicting “done” definitions, and audit overhead.

**Reduction direction:**
1. Declare this file as the canonical current-state source.
2. Convert secondary docs to summaries that link back here rather than restating status matrices.
3. Enforce one update path per release cycle (single source, downstream generated summaries).

#### 10.2 Route and UI Redundancy

- Public shell behavior is split between per-page wrapping and standalone patterns.
- CTA/copy variants are abundant across hero/footer/services/overlay/mobile bar, with partial taxonomy alignment.
  - **Evidence:** Verified 10+ identical `<button type="button">` wrappers inside admin components like `BulkJobActionsClient.tsx` that bypass unified core CTA components. Further, `WORK-BACKLOG.md` notes "CTA Consistency" was recently applied across 6 locations, proving it was historically fragmented.
- Admin/employee route surfaces include monolithic pages with local-state module routing and reduced deep-link semantics.

**Reduction direction:**
1. Adopt one public layout contract and explicit exceptions.
2. Standardize CTA language families and map each to a measured funnel stage.
3. Shift high-use module navigation from local state toward URL-addressable states where practical.

#### 10.3 API and Domain Logic Redundancy

- Policy/rate-limit definitions are split between middleware/runtime behavior and docs, creating drift.
- Retry/fallback maturity differs by channel, duplicating resilience patterns unevenly.
- Idempotency and side-effect guarantees are not uniformly encoded across write-heavy endpoints.

**Reduction direction:**
1. Centralize policy contracts (auth/rate-limit/idempotency) in one shared source.
2. Create shared resilience primitives (timeout, retry, classification, telemetry hooks).
3. Normalize endpoint contract publication from code-facing truth.

#### 10.4 Config and Infrastructure Redundancy

- Middleware carries multiple responsibilities in one high-density file.
- Env assumptions are repeated across docs/config/routes without one typed runtime guard.
- Observability configuration is distributed with overlap.

**Reduction direction:**
1. Modularize middleware concerns (auth/rate-limit/security headers/logging contracts).
2. Use a typed env contract and fail-fast startup validation as single runtime truth.
3. Consolidate shared observability sanitization and metadata standards.

#### 10.5 Data-Layer Redundancy / Drift

- Schema capability has outpaced schema documentation snapshots.
- Role/policy evolution and table capability depth are documented inconsistently across planning layers.

**Reduction direction:**
1. Add migration-to-doc sync gate per migration batch.
2. Publish one policy matrix sourced from live schema/migrations.
3. Keep deferred-role capability explicitly flagged until activated.

#### Bloat Hotspot Summary (Prioritized)

**P0 (Immediate reduction for reliability and governance)**
1. Canonicalize current-state truth to this spec; downgrade duplicates to pointers.
2. Centralize auth/rate-limit/secret policy definitions and enforce at runtime.
3. Remove phase-mismatch UI exposure (feature appears in UI before phase activation).

**P1 (Medium-term reduction for maintainability)**
4. Unify CTA taxonomy + route intent contracts across public/admin/employee.
5. Refactor monolithic control surfaces into smaller, testable policy modules.
6. Normalize retry/idempotency/telemetry primitives across all async channels.

**P2 (Scale-focused reduction)**
7. Introduce generated docs for contract/schema status to minimize manual drift.
8. Expand URL-addressable workflow depth for high-frequency operations.
9. Add long-horizon data growth controls (partition/audit optimizations) as traffic scales.

#### Final Current-State Assessment

The platform is no longer a prototype; it is a functional operations system with selective maturity gaps. The dominant risk is now **coordination bloat and consistency drift**, not missing core capability.

#### Readiness Matrix (Condensed)

- **Public funnel:** 🟡 strong conversion base with unresolved routing/positioning depth gaps.
- **Admin operations:** 🟡 core-usable with partial advanced modules and workflow-density friction.
- **Employee field app:** 🟡 operationally viable with navigation/phase-alignment polish still required.
- **API layer:** 🟡 broad and usable; contract/policy normalization and resilience parity required.
- **Lib/domain architecture:** 🟡 powerful but needs testability/coupling hardening.
- **Platform/config:** 🟡 MVP-safe; scale/security-hardening actions are identified.
- **Data/security (RLS/migrations):** ✅ strongest layer; robust foundation with doc governance catch-up needed.

#### Launch Gate Recommendation

- **Recommended state**: Conditional release readiness after a focused hardening and de-bloat sprint.
- **Do not claim full enterprise-ready maturity yet** until P0 consistency and governance actions are closed.

#### Two-Sprint Execution Sequence (De-Bloat + Readiness)

**Sprint A (Stabilize + De-Bloat)**
1. Close all P0 hardening actions across API/config/data governance.
2. Canonicalize documentation ownership and remove contradictory duplicate status surfaces.
3. Resolve highest-friction UX seams and phase-mismatch feature exposure.

**Sprint B (Operational Depth + Conversion Lift)**
4. Upgrade partial modules to dependable daily-ops depth (admin insights/scheduling/QA flow).
5. Add public self-qualification trust layers (SLA/pricing/industry specificity/proof expansion).
6. Raise observability/testability parity across integrations and retry-prone workflows.

#### Final Outcome

- ✅ Full deep audit completed in batches across docs, app surfaces, APIs, lib/config, and database migrations.
- ✅ Batch 10 now includes explicit repository-wide bloat/redundancy overview with reduction plan.
- ✅ `Master Spec 3.0` is the consolidated decision baseline for next implementation sprints.

---

## 5) Completed Work Archive (Condensed)

This section intentionally replaces detailed completed execution context from prior sessions.
Detailed change logs, full file registries, and per-batch implementation notes remain available in historical session artifacts.

### 5.1 Completed Batches (A–I + G-1)

- **A–F:** Completed; all previously tracked P0 hardening items were resolved.
- **I-1 / I-2 / I-3:** Completed; admin pagination, touch-target updates, scheduling overlap detection, and conflict wiring in insights are implemented.
- **G-1:** Completed; extracted employee sub-components:
	- `src/components/employee/EmployeeChecklistView.tsx`
	- `src/components/employee/EmployeePhotoUpload.tsx`
	- `src/components/employee/EmployeeAssignmentCard.tsx`

### 5.2 Remaining Active Work

- **G-2 (next):**
	- Create `EmployeeIssueReport.tsx`
	- Create `EmployeeMessageThread.tsx`
	- Rewrite `EmployeeTicketsClient.tsx` as thin orchestrator
- **H:** Public layout normalization (**blocked by product decision**)
- **J:** Observability normalization (Sentry/error taxonomy/fallback telemetry)
- **K:** Distributed rate limiting (in-memory → Redis/KV)

### 5.3 Open Product Decisions

1. Public layout strategy (homepage self-shell vs route-group layout ownership)
2. Employee inventory phase gate (global availability vs phased rollout)
3. Industry route strategy (`/#industries` anchor vs dedicated `/industries/[slug]` routes)

### 5.4 Known Pre-Existing Issues (Unchanged)

1. Local DB migration gap (`leads.company_name`, `ai_chat_sessions`) on some environments
2. Missing local `CRON_SECRET` in `.env.local` blocks authorized cron testing
3. Any lingering old `checkRateLimit` object usage with `max` must use `maxRequests`

### 5.5 Validation Baseline

```bash
npx tsc --noEmit
npx next lint
npx next build
```

### 5.6 Current Readiness Snapshot

| Surface | Status | Notes |
|---|---|---|
| Public funnel | 🟡 | Strong base, route/positioning depth still pending |
| Admin operations | 🟢 | Core usable; Batch I depth improvements landed |
| Employee field app | 🟡 | Operationally viable; extraction in progress (G-2 pending) |
| API layer | 🟢 | Hardened in A–F; stability strong |
| Lib/domain architecture | 🟡 | Good core; observability normalization pending |
| Platform/config | 🟡 | MVP-safe; scale hardening remains |
| Data/security | ✅ | Strongest layer |

---

## 6) Additional Context — Post-Batch H Direction

### 6.1 Recently Completed

- ✅ **G-2:** Employee component extraction + tickets orchestrator normalization complete.
- ✅ **H:** Public layout normalization complete using route-group layout ownership (`(public)/layout.tsx` + shared `PublicChrome`).

### 6.2 Highest-Value Remaining Coded Work

1. **J — Observability normalization** (recommended first)
	- Standardize Sentry error taxonomy across API/lib/components.
	- Ensure fallback/degraded paths emit telemetry, not silent failures.
	- Normalize error boundary reporting and attach actionable context.

2. **K — Distributed rate limiting**
	- Migrate from in-memory `Map` strategy to shared Redis/KV backend.
	- Preserve existing behavior while making limits durable across cold starts/instances.
	- Requires provider decision (Redis / Vercel KV / Upstash) before implementation.

### 6.3 Open Product Decisions (Still Outstanding)

1. **Employee inventory phase gate**
	- Global employee availability now vs feature-flag/role-gated rollout.
2. **Industry route strategy**
	- Keep `/#industries` anchor model vs dedicated `/industries/[slug]` pages.

### 6.4 Post J+K Execution Focus (Launch Hardening)

After J and K land, the project should transition into launch hardening and optimization:

- **Comprehensive testing:** full regression matrix (unit/integration/e2e + credential-gated manual UAT).
- **Performance deep dive:** bundle/chunk analysis, route budgets, loading/hydration review.
- **API production readiness:** provider credentials, retries/timeouts, idempotency and contract checks.
- **Monitoring operations:** alert thresholds, dashboards, on-call/incident playbook verification.
- **Conversion/UI polish:** targeted visual improvements and prioritization of the 90-day revenue backlog.

### 6.5 Manual Testing Emphasis

Credential-gated verification remains mandatory pre-launch:

- SMS delivery flow on real devices.
- Offline photo queue sync and retry behavior.
- QuickBooks OAuth and sync end-to-end validation.
- Sentry event capture/triage verification for critical failure paths.
- Rate-limit burst testing after distributed limiter rollout.

**Overall: All P0 and P1 audit findings resolved. Remaining work is P2 quality/depth improvements.**


Add this directly after section **5.6 Current Readiness Snapshot** in your Master Spec 3.0:

---

## 6) Session 4 — Completion Log (March 2026)

### 6.1 Completed This Session

**G-2: Employee Component Extraction (COMPLETE)**
- Created `src/components/employee/EmployeeIssueReport.tsx` — stateless issue reporting UI (5 props)
- Created `src/components/employee/EmployeeMessageThread.tsx` — stateless message thread UI (4 props)
- Rewrote `src/components/employee/EmployeeTicketsClient.tsx` — thin orchestrator composing `EmployeeAssignmentCard`, `EmployeeChecklistView`, `EmployeePhotoUpload`, `EmployeeIssueReport`, `EmployeeMessageThread` via children composition
- All business logic (upload/flush/queue/auth) intentionally kept in orchestrator — zero runtime behavior change
- Note: `EmployeePhotoUpload` assumed props interface `{ file, onFileChange, onUpload, isUploading }` — verify against G-1 extraction on next build

**H: Public Layout Normalization (COMPLETE)**
- Created `src/app/(public)/layout.tsx` — route-group layout delegating to `PublicChrome`
- Created `src/components/public/PublicChrome.tsx` — single shared chrome provider owning `PublicHeader`, `FooterSection`, `FloatingQuotePanel`, `AIQuoteAssistant`, `ScrollToTopButton`, mobile sticky CTA bar, `QuoteContext` provider, and body-lock/inert behavior
- Rewrote `src/components/public/variant-a/VariantAPublicPage.tsx` — content-only (homepage sections + `ExitIntentOverlay`), no header/footer/overlays/sticky bar
- Rewrote `src/components/public/PublicPageShell.tsx` — reduced to optional inner-content spacer (`max-w-7xl` + padding), chrome removed
- Analytics source tracking preserved (`pathname === "/"` → `"public_page"` vs `"sub_page"`)
- `quote/[token]` route unaffected (outside `(public)/` group)
- **Open micro-item:** Verify `ExitIntentOverlay` consumes `openQuote` via `QuoteContext` hook or still requires prop — if prop-based, add `useQuote()` call inside `VariantAPublicPage`

### 6.2 Product Decision Resolved

- **Public layout strategy:** Resolved as Option A (route-group layout). Homepage self-shell eliminated. Single `PublicChrome` provider owns all shared chrome.

### 6.3 Remaining Active Work

| Item | Status | Blocked By | Effort |
|---|---|---|---|
| **J** — Observability normalization | Not started | Nothing — pure code | ~2-3h |
| **K** — Distributed rate limiting | Not started | Infrastructure decision (Redis/KV provider) | ~2-3h |
| Manual testing | Not started | Real credentials + devices | ~4h |

### 6.4 Open Product Decisions (2 remaining)

1. **Employee inventory phase gate** — ship `EmployeeInventoryClient` globally now or feature-flag rollout?
2. **Industry route strategy** — keep `/#industries` hash anchors or build dedicated `/industries/[slug]` landing pages?

### 6.5 Recommended Next Session Priority

1. **J (Observability)** — no dependencies, highest launch-safety value. Needs: `src/lib/sentry.ts`, `src/instrumentation.ts`, `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `src/app/error.tsx`, `src/app/(admin)/admin/error.tsx`
2. **K (Rate Limiting)** — after infrastructure provider decision
3. **Manual testing runbook** — after J and K are closed

### 6.6 Updated Readiness Snapshot

| Surface | Status | Notes |
|---|---|---|
| Public funnel | 🟢 | Layout normalized; route/positioning depth still pending |
| Admin operations | 🟢 | Core usable; Batch I depth improvements landed |
| Employee field app | 🟢 | Fully decomposed; extraction complete (G-1 + G-2) |
| API layer | 🟢 | Hardened in A–F; stability strong |
| Lib/domain architecture | 🟡 | Good core; observability normalization pending (J) |
| Platform/config | 🟡 | MVP-safe; rate-limit durability pending (K) |
| Data/security | ✅ | Strongest layer |

### 6.7 Validation Baseline

All deliverables require standard validation before merge:

```bash
npx tsc --noEmit
npx next lint
npx next build
```

Plus visual verification: homepage, subpages, quote panel, mobile sticky bar, `quote/[token]` standalone rendering.