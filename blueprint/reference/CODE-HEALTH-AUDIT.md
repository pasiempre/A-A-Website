# Code Health Audit

Audit Date: 2026-03-21
Source: Master Spec 4.0 §7 (extracted for separation of concerns)
Mode: Read-only analysis only (no remediation changes applied)
Status: Reference document — no action required before Pass 4

---

## 1) Pass Coverage

1. Duplicate and redundant logic scan.
2. Modularity and coupling scan.
3. Performance and size signal scan.

---

## 2) Quantified Evidence

### A) Duplicate / Redundant Logic

| Pattern | Count | Locations |
|---|---|---|
| API error response boilerplate (`NextResponse.json({ error })`) | 42 matches | 7 route files |
| Admin loading boilerplate (`useCallback` + `setIsLoading` + `setErrorText`) | 61 matches | 12 admin components |
| `timeAgo` / `formatTimeAgo` helpers | 3 definitions | `LeadPipelineClient`, `HiringInboxClient`, `lead-followup/route` |
| `escapeHtml` function | 2 definitions | `completion-report/route`, `employment-application/route` |
| `formatPhone` function | 2 definitions | `employment-application/route`, `HiringInboxClient` |
| Status/badge color mappers | 5 definitions | Multiple admin components |
| Auth pattern (`authorizeAdmin` / `authorizeCronRequest`) | 14 occurrences | Across libs/routes |
| Inline phone digit-strip | 1 additional | `about/page.tsx` |
| CTA button wrappers (ad-hoc, no shared component) | 10+ identical patterns | Admin + public components |

### B) Modularity / Coupling Hotspots

| Rank | Hotspot | Score |
|---|---|---|
| 1 | `UnifiedInsightsClient.tsx` | 9/10 |
| 2 | `SchedulingAndAvailabilityClient.tsx` | 8/10 |
| 3 | `HiringInboxClient.tsx` | 8/10 |
| 4 | `quickbooks-sync/route.ts` | 8/10 |
| 5 | Cross-route auth/response pattern spread | 7/10 |
| 6 | Notification retry logic spread | 7/10 |
| 7 | `employment-application/route.ts` | 7/10 |
| 8 | `AdminShell.tsx` (bundle concentration) | 6/10 |
| 9 | `photo-upload-queue.ts` | 6/10 |
| 10 | `LeadPipelineClient.tsx` | 6/10 |

### C) Performance / Size Signals

| Metric | Value |
|---|---|
| Source files | 142 |
| Total lines | 30,612 |
| Client components (of 93 TSX) | 58 (~62%) |
| `dynamic(...)` lazy-load usage | 7 across 2 files |
| Local `.next` build size | ~573 MB (includes dev artifacts) |

---

## 3) Waste Category Distribution (Top 15 Hotspots)

| Category | Count |
|---|---|
| Maintainability | 14/15 |
| Developer velocity | 10/15 |
| CPU | 7/15 |
| Bundle | 5/15 |
| Reliability | 3/15 |
| Network | 1/15 |

---

## 4) Scope Guardrail

This document records findings only. No solutioning or refactor implementation included. Remediation is addressed as part of the feature roadmap (Master Spec §8) where overlap exists, or deferred to post-launch technical debt sprints.

---

## 5) Remediation Mapping

| Finding | Resolved By | How | When |
|---|---|---|---|
| CTA button duplication (§2A) | F-25 | Shared `CTAButton` replaces ad-hoc wrappers | P0 Sprint |
| AdminShell concentration (§2B #8) | F-01 + F-05 | Briefing becomes primary work surface and navigation is simplified | P0 Sprint |
| API error boilerplate (§2A) | Post-launch tech debt | Extract shared `apiResponse()` helper | Post-launch |
| Admin loading boilerplate (§2A) | Post-launch tech debt | Extract shared `useAsyncAction()` hook | Post-launch |
| `timeAgo` duplication (§2A) | Post-launch tech debt | Extract to `src/lib/format.ts` | Post-launch |
| `escapeHtml` duplication (§2A) | Post-launch tech debt | Extract to `src/lib/format.ts` | Post-launch |
| `formatPhone` duplication (§2A) | Post-launch tech debt | Extract to `src/lib/format.ts` | Post-launch |
| Status/badge mapper duplication (§2A) | Post-launch tech debt | Extract to `src/lib/status-colors.ts` | Post-launch |
| Auth pattern spread (§2A) | Post-launch tech debt | Consolidate route adoption around existing centralized auth helpers | Post-launch |
| `UnifiedInsightsClient.tsx` monolith (§2B #1) | Post-launch refactor | Decompose into focused sub-modules after P1 | Post-P1 |

---

## 6) Canonical Use

- This file is reference-only. Do not action items from this file outside of their mapped resolution path.
- Master Spec 4.0 §7 points here. Feature roadmap §8 cross-references specific findings by section number.
- Update this file only when new audit passes are conducted or when remediation items are completed.
