# Feedback 3.0 - Locked Execution Spec

Date locked: 2026-04-11
Scope: Public conversion flow hardening, quote funnel reliability, launch-readiness signals
Status: Accepted for Session 6+ execution

## 0) Execution Status Snapshot (2026-04-11)

Implemented in code:
- Critical #1 Step 2 optional submit tolerance (client skip + server no-op success)
- Critical #2 service-type prefill reset behavior
- Critical #3 durable/stateless enrichment token verification
- Critical #4 success-route conversion instrumentation
- High #1 mobile keyboard ergonomics pass (input hints + focus centering)
- High #2 Step 2 back-navigation support
- High #3 bilingual conversion handoff in quote panel + contact page
- High #4 homepage metadata/OG hardening pass
- Strategic #1 defensive quote-panel close behavior on route change
- Strategic #2 confirmation view analytics event
- Strategic #3 star-rating attribution hardening in trust copy

In progress / requires launch validation:
- End-to-end analytics validation in target environments (single-fire and payload checks)
- Paid-channel conversion instrumentation verification against ad platform expectations
- Full journey QA evidence capture for launch checklist

## 1) Purpose

This document is the normalized, execution-ready version of Feedback 3.0.
It replaces narrative audit prose with a prioritized implementation backlog and validation criteria.

## 2) Corrections and Clarifications

1. F1 panel-persistence risk is downgraded from critical to defensive hardening.
- Rationale: current page composition mounts a fresh chrome instance on success route transitions.
- Action: keep a defensive close-on-navigation guard as low-cost future-proofing.

2. The Step 2 optional-submit failure remains critical.
- Rationale: user-facing contradiction (optional fields can still produce hard failure) affects core conversion path.

3. Dedup race concern is downgraded to low.
- Rationale: submit-disable timing generally prevents user-visible impact; still acceptable as defensive guard.

## 3) Locked Priority Backlog

### 3.1 Critical (Ship First)

1. Step 2 optional submit must not error.
- Client behavior: if Step 2 optional fields are all empty, skip enrichment POST and proceed to success.
- Server behavior: if Step 2 payload has no enrichment fields, return tolerant no-op success.
- Files:
  - Production-workspace/src/components/public/variant-a/useQuoteForm.ts
  - Production-workspace/src/app/api/quote-request/route.ts

2. Service-type prefill must reset correctly across panel sessions.
- Behavior: opening from a new CTA should apply the new service context, not stale prior value.
- File:
  - Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx

3. Enrichment token strategy must survive serverless lifecycle behavior.
- Replace in-memory-only reliance with durable verification (signed token or persistent store).
- File:
  - Production-workspace/src/app/api/quote-request/route.ts

4. Success route must emit paid-channel conversion signals.
- Add required conversion instrumentation for ad attribution.
- File:
  - Production-workspace/src/app/quote/success/page.tsx

### 3.2 High (This Week)

1. Mobile keyboard ergonomics pass on quote inputs.
- Add missing inputMode / enterKeyHint coverage and focus centering behavior.
- File:
  - Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx

2. Step 2 back-navigation support.
- Add explicit return path to edit Step 1 details without losing context.
- File:
  - Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx

3. Bilingual conversion parity.
- Add explicit Spanish handoff in quote/contact touchpoints.
- Files:
  - Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx
  - Production-workspace/src/app/(public)/contact/page.tsx

4. Metadata quality hardening.
- Improve page metadata quality and ensure OG/social consistency.
- File:
  - Production-workspace/src/app/(public)/page.tsx

### 3.3 Strategic (This Sprint)

1. Defensive close-on-route-change for quote panel.
- File:
  - Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx

2. Confirmation view analytics event.
- File:
  - Production-workspace/src/app/quote/success/page.tsx

3. Star-rating attribution hardening.
- File:
  - Production-workspace/src/components/public/variant-a/AuthorityBar.tsx

## 4) Verification Checklist (Required Before Launch)

1. Conversion path:
- hero/open quote -> Step 1 -> optional Step 2 (empty allowed) -> success

2. Analytics path:
- conversion events emitted once per successful journey
- success-page confirmation event observed
- paid-channel conversion instrumentation validated in environment

3. API resilience path:
- enrichment token flow works across realistic serverless lifecycle patterns
- no-op Step 2 payload returns success and does not regress data integrity

4. UX checks:
- service prefill reflects current CTA context on each open
- keyboard navigation and focus behavior are stable on mobile
- bilingual handoff path is visible and functional

## 5) Source-of-Truth Mapping

This spec is reflected in:
- blueprint/active/current-state-status-update-2026-04-10.md (Section 13)
- blueprint/active/feedback3.0-validation-evidence-2026-04-11.md

If conflicts appear between prior narrative notes and this file, this file wins.
