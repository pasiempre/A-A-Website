# Solutioning Framework v1.0

## Status Snapshot

This document has been collapsed to reflect what is implemented through Sessions 1-5, validated against code and checkpoint commits.

Validation evidence:
- Session 1 commit: cb8b70d
- Session 2 commit: 0b40357
- Session 3 commit: faefac9
- Session 4 commit: f11d546
- Session 5 commit: 53146e7

Implementation status:
- Session 1: Complete
- Session 2: Complete
- Session 3: Complete
- Session 4: Complete
- Session 5: Complete
- Session 6: Not started
- Session 7: Not started

---

## Decision Resolutions (Active)

| ID | Decision | Resolution | Applied In |
|----|----------|------------|------------|
| D-01 | Create /industries index page | Yes | Session 5 |
| D-02 | Exit intent scope | Move to PublicChrome, defer | Session 7 |
| D-03 | Testimonial credibility | Role-only placeholder attribution | Session 5 |
| D-04 | Contact in primary nav | Defer, phone CTA is sufficient | N/A |
| D-05 | Deprecate #F1F0EE | Standardize on #FAFAF8 | Sessions 4-5 |
| D-07 | Hutto inclusion policy | Keep city page, exclude from featured/focused copy | Session 5 |
| D-10 | ErrorBoundary strategy | Defer | Session 7 |
| D-11 | Contact mobile sidebar order | Defer | Session 7 |
| D-12 | Image quality baseline | Keep quality 75 baseline | Session 7 tuning |

---

## Implemented Outline: Sessions 1-5

## Session 1 - Shell and Infrastructure Foundation

Outcome: Layout and chrome foundation standardized across public routes.

Implemented:
- Removed legacy page wrapper pattern and normalized page-level structure.
- Hardened header behavior for service routes so initial render is readable.
- Upgraded mobile navigation touch targets for accessibility.
- Added toolbar semantics to sticky mobile action region.
- Removed redundant page-level bottom padding where PublicChrome already provides safe-space.
- Replaced hardcoded year with dynamic current-year rendering.

Key files:
- Production-workspace/src/components/public/variant-a/PublicHeader.tsx
- Production-workspace/src/components/public/PublicChrome.tsx
- Production-workspace/src/app/(public)/faq/page.tsx
- Production-workspace/src/app/(public)/contact/page.tsx
- Production-workspace/src/app/(public)/service-area/page.tsx
- Production-workspace/src/app/(public)/privacy/page.tsx
- Production-workspace/src/app/(public)/terms/page.tsx

---

## Session 2 - Universal CTA Wiring

Outcome: Public-page quote and call CTAs use shared tracked components.

Implemented:
- Replaced quote-request hash links with QuoteCTA so modal/panel flow is consistent.
- Replaced direct tel anchor usage with CTAButton for event tracking consistency.
- Standardized CTA IDs across hero/section/closing placements.
- Preserved contextual styles while keeping interaction semantics unified.

Key files:
- Production-workspace/src/app/(public)/services/post-construction-cleaning/page.tsx
- Production-workspace/src/app/(public)/services/final-clean/page.tsx
- Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx
- Production-workspace/src/app/(public)/services/move-in-move-out-cleaning/page.tsx
- Production-workspace/src/app/(public)/services/windows-power-wash/page.tsx
- Production-workspace/src/app/(public)/industries/[slug]/page.tsx
- Production-workspace/src/app/(public)/service-area/[slug]/page.tsx
- Production-workspace/src/app/(public)/about/page.tsx
- Production-workspace/src/app/(public)/faq/page.tsx
- Production-workspace/src/app/(public)/careers/page.tsx

---

## Session 3 - Services Index Rebuild

Outcome: Services index rebuilt as a complete data-driven route with schema and stronger conversion flow.

Implemented:
- Extended service data model to include canonical href values.
- Rebuilt /services page around shared service data instead of partial hardcoded fragments.
- Improved internal linking and consistency with service detail routes.
- Added structured metadata/schema support aligned to page intent.

Key files:
- Production-workspace/src/data/services.ts
- Production-workspace/src/app/(public)/services/page.tsx

---

## Session 4 - Structural and Semantic Hardening

Outcome: Public pages improved for semantics, consistency, and technical trust signals.

Implemented:
- Introduced shared AccordionFAQ component and replaced duplicated native FAQ blocks.
- Added/updated schema and metadata alignment for Careers and related pages.
- Normalized selected section widths and heading hierarchy.
- Resolved heading level skip issues in ServicePageHardening.
- Maintained warm token standardization toward #FAFAF8.

Key files:
- Production-workspace/src/components/public/variant-a/AccordionFAQ.tsx
- Production-workspace/src/components/public/variant-a/FAQSection.tsx
- Production-workspace/src/components/public/variant-a/ServicePageHardening.tsx
- Production-workspace/src/app/(public)/careers/page.tsx
- Production-workspace/src/app/(public)/faq/page.tsx

---

## Session 5 - Navigation, Content, and Data Alignment

Outcome: Route architecture, public IA links, and city/industry/service relationships aligned.

Implemented:
- Updated header and footer links from homepage anchors to dedicated routes.
- Added /industries index route with metadata, schema, and cross-linking.
- Updated industries detail page breadcrumb, CTA styling, and service card linking via service.href.
- Applied testimonial anonymization to remove synthetic personal/company attribution.
- Updated contact page service-area chips to linked city targets and aligned coverage copy.
- Updated service-area hub and city templates to render all services from shared SERVICES data.
- Updated FAQ area and response-time phrasing for consistency.
- Added service-area comment documenting why featured city list excludes Hutto.
- Added related services section to all five service detail pages.
- Added shared company stats and hours constants for downstream reuse.

Key files:
- Production-workspace/src/components/public/variant-a/PublicHeader.tsx
- Production-workspace/src/components/public/variant-a/FooterSection.tsx
- Production-workspace/src/app/(public)/industries/page.tsx
- Production-workspace/src/app/(public)/industries/[slug]/page.tsx
- Production-workspace/src/app/(public)/contact/page.tsx
- Production-workspace/src/app/(public)/service-area/page.tsx
- Production-workspace/src/app/(public)/service-area/[slug]/page.tsx
- Production-workspace/src/components/public/variant-a/faq-items.ts
- Production-workspace/src/lib/service-areas.ts
- Production-workspace/src/lib/company.ts
- Production-workspace/src/app/(public)/services/post-construction-cleaning/page.tsx
- Production-workspace/src/app/(public)/services/final-clean/page.tsx
- Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx
- Production-workspace/src/app/(public)/services/move-in-move-out-cleaning/page.tsx
- Production-workspace/src/app/(public)/services/windows-power-wash/page.tsx

---

## Notes for Remaining Sections

## Session 6 - Component Extraction and DRY Consolidation

Goal:
- Reduce repeated hero, stat-card, CTA-band, and related-link patterns into reusable public primitives.

Recommended execution order:
1. Extract read-only presentational primitives first (stat block, kicker+heading block, CTA band shell).
2. Extract repeated service card/list patterns across service-area and industries pages.
3. Replace in pages incrementally, one route family at a time.
4. Run snapshot or visual checks after each family conversion.

Guardrails:
- Do not change route structure or CTA IDs.
- Keep existing CSS token usage and classes unless consolidation is required.
- Avoid behavior changes while extracting.

Definition of done:
- No duplicated pattern blocks above agreed threshold.
- No JSX regressions in public pages.
- Types remain strict and no new lint/type errors.

---

## Session 7 - Polish, Edge Cases, and Deferred Decisions

Goal:
- Close deferred decisions and quality gaps (D-02, D-10, D-11, D-12) with measured changes.

Recommended execution order:
1. Implement exit-intent placement in PublicChrome with once-per-session guard.
2. Review and refine ErrorBoundary strategy across public route groups.
3. Tune contact mobile sidebar order based on UX priorities.
4. Run image optimization pass using measured LCP/CLS and payload data.
5. Sweep for residual findings F-059-F-100 and validate on mobile-first breakpoints.

Guardrails:
- Any conversion or analytics changes require before/after verification.
- Avoid large stylistic refactors in this session; prioritize risk reduction and performance.
- Preserve SEO-critical metadata/schema behavior.

Definition of done:
- Deferred decision items are implemented or explicitly re-deferred with rationale.
- Public route smoke-test matrix passes.
- No unresolved critical findings remain open.

---

## Next Execution Checklist

Before starting Session 6:
- Confirm current branch baseline is clean.
- Tag or checkpoint current state.
- Freeze CTA ID naming and route conventions.

Before starting Session 7:
- Capture baseline performance and conversion instrumentation snapshots.
- Confirm acceptance criteria for each deferred decision.
- Plan small, reversible commits by concern area.
