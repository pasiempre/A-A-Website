# Public Pages — Master Consistency & Quality Findings

**Version:** 1.0
**Date:** 2026-04-06
**Scope:** All public-facing pages, shared components, data files, and global styling
**Total Unique Findings:** 83

---

## Executive Summary

A comprehensive audit of all public pages revealed 83 unique issues across 13 analysis passes. The most critical findings center on three systemic problems:

1. **Broken conversion flow** — 43 CTA instances across all sub-pages either navigate away from the page instead of opening the quote panel, or bypass analytics tracking entirely.
2. **Layout shell breaking full-bleed sections** — `PublicPageShell` constrains 3 pages into `max-w-7xl`, clipping dark hero sections and stacking padding to ~256px on mobile.
3. **Services index is non-functional** — no links to detail pages, broken CTA, wrong styling, no SEO markup, content behind the fixed header.

Beyond these, the audit uncovered widespread but fixable inconsistency in styling tokens, navigation patterns, data alignment, accessibility, and component reuse.

---

## Pre-Audit Flags Verification (2026-04-06)

The five pre-audit flags were verified directly against current code.

| # | Flag | Status | Verification | Recommended Action |
|------|-------|--------|--------------|--------------------|
| 1 | Service area link count mismatch (`HOMEPAGE_SERVICE_AREA_LINKS.slice(0, 6)` vs FAQ listing 7 cities incl. Hutto) | Confirmed | [Production-workspace/src/lib/service-areas.ts](Production-workspace/src/lib/service-areas.ts) defines 7 cities but [Production-workspace/src/lib/service-areas.ts](Production-workspace/src/lib/service-areas.ts) exports `HOMEPAGE_SERVICE_AREA_LINKS` with `.slice(0, 6)`. [Production-workspace/src/components/public/variant-a/ServicePageHardening.tsx](Production-workspace/src/components/public/variant-a/ServicePageHardening.tsx) renders those 6 pills, while [Production-workspace/src/components/public/variant-a/faq-items.ts](Production-workspace/src/components/public/variant-a/faq-items.ts) includes all 7 cities including Hutto. | Align to one source of truth: either include all 7 in pills or update FAQ wording to match surfaced city pills. Prefer all 7 for consistency and coverage. |
| 2 | Kicker color inconsistency (homepage blue kicker vs ServicePageHardening gold kicker) | Confirmed | Global kicker token in [Production-workspace/src/styles/globals.css](Production-workspace/src/styles/globals.css) is blue (`.section-kicker` = `text-[#2563EB]`). Pricing block kicker in [Production-workspace/src/components/public/variant-a/ServicePageHardening.tsx](Production-workspace/src/components/public/variant-a/ServicePageHardening.tsx) is explicitly gold (`text-[#C9A94E]`). | Choose one rule: if pricing/module-specific emphasis is intentional, document as an exception; otherwise convert to `.section-kicker` for full parity. |
| 3 | `forceSolidHeader` route list incomplete | Partial (confirmed for `/services` and `/services/*`; not confirmed for `/industries/*` and `/contact`) | [Production-workspace/src/components/public/variant-a/PublicHeader.tsx](Production-workspace/src/components/public/variant-a/PublicHeader.tsx) includes `/privacy`, `/terms`, `/faq`, `/about`, `/careers`, `/service-area`, `/service-area/*` but omits `/services` and `/services/*`. Service pages such as [Production-workspace/src/app/(public)/services/page.tsx](Production-workspace/src/app/(public)/services/page.tsx) and [Production-workspace/src/app/(public)/services/post-construction-cleaning/page.tsx](Production-workspace/src/app/(public)/services/post-construction-cleaning/page.tsx) start on light/warm backgrounds under a fixed transparent header. However, [Production-workspace/src/app/(public)/industries/[slug]/page.tsx](Production-workspace/src/app/(public)/industries/[slug]/page.tsx) and [Production-workspace/src/app/(public)/contact/page.tsx](Production-workspace/src/app/(public)/contact/page.tsx) begin with dark hero sections and are less likely to suffer contrast issues. | Add `/services` and `pathname.startsWith("/services/")` to `forceSolidHeader` immediately. Re-test `/industries/*` and `/contact` visually before expanding the forced-solid list further. |
| 4 | Footer nav links using homepage anchors despite dedicated routes | Confirmed | [Production-workspace/src/components/public/variant-a/FooterSection.tsx](Production-workspace/src/components/public/variant-a/FooterSection.tsx) links Services to `/#services`, Who We Serve to `/#industries`, About to `/#about`, Service Area to `/#service-area`, while dedicated routes exist in [Production-workspace/src/app/(public)/services/page.tsx](Production-workspace/src/app/(public)/services/page.tsx), [Production-workspace/src/app/(public)/about/page.tsx](Production-workspace/src/app/(public)/about/page.tsx), and [Production-workspace/src/app/(public)/service-area/page.tsx](Production-workspace/src/app/(public)/service-area/page.tsx). | Route footer nav to dedicated pages for cross-page consistency, then keep homepage anchors only in homepage-local section navigation (if needed). |
| 5 | Missing `SERVICE_FAQS` and `SERVICE_PRICING` | Not an issue | Both files exist: [Production-workspace/src/lib/service-faqs.ts](Production-workspace/src/lib/service-faqs.ts) and [Production-workspace/src/lib/service-pricing.ts](Production-workspace/src/lib/service-pricing.ts). Imports in [Production-workspace/src/components/public/variant-a/ServicePageHardening.tsx](Production-workspace/src/components/public/variant-a/ServicePageHardening.tsx) are valid. | No action required for file existence. Keep alignment checks in content QA pass. |

---

## Most Relevant Findings — Live Code Cross-Reference Snapshot (No Solutioning)

This section verifies the highest-impact findings directly against the current codebase state.

| Finding ID | Status | Code Evidence |
|------|--------|---------------|
| F-001 (PublicPageShell clipping/padding) | Confirmed | [Production-workspace/src/components/public/PublicPageShell.tsx](Production-workspace/src/components/public/PublicPageShell.tsx) exists and is still used by [Production-workspace/src/app/(public)/faq/page.tsx](Production-workspace/src/app/(public)/faq/page.tsx#L65), [Production-workspace/src/app/(public)/service-area/page.tsx](Production-workspace/src/app/(public)/service-area/page.tsx#L170), [Production-workspace/src/app/(public)/contact/page.tsx](Production-workspace/src/app/(public)/contact/page.tsx#L239), [Production-workspace/src/app/(public)/privacy/page.tsx](Production-workspace/src/app/(public)/privacy/page.tsx#L146), [Production-workspace/src/app/(public)/terms/page.tsx](Production-workspace/src/app/(public)/terms/page.tsx#L150). |
| F-002 (sub-page quote CTA links navigate instead of opening panel) | Confirmed | Service detail pages still use homepage-hash links, e.g. [Production-workspace/src/app/(public)/services/final-clean/page.tsx](Production-workspace/src/app/(public)/services/final-clean/page.tsx#L115), [Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx](Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx#L115), [Production-workspace/src/app/(public)/services/move-in-move-out-cleaning/page.tsx](Production-workspace/src/app/(public)/services/move-in-move-out-cleaning/page.tsx#L115), [Production-workspace/src/app/(public)/services/windows-power-wash/page.tsx](Production-workspace/src/app/(public)/services/windows-power-wash/page.tsx#L115). |
| F-003 (raw tel links bypass CTA tracking) | Confirmed | Raw `tel:` anchors remain on public pages, e.g. [Production-workspace/src/app/(public)/services/final-clean/page.tsx](Production-workspace/src/app/(public)/services/final-clean/page.tsx#L116), [Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx](Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx#L116), [Production-workspace/src/app/(public)/services/windows-power-wash/page.tsx](Production-workspace/src/app/(public)/services/windows-power-wash/page.tsx#L116). |
| F-004 (services index non-functional) | Confirmed | Current [Production-workspace/src/app/(public)/services/page.tsx](Production-workspace/src/app/(public)/services/page.tsx) still renders static cards with no links to service detail routes and uses `Request a Quote` link to `/` at [Production-workspace/src/app/(public)/services/page.tsx](Production-workspace/src/app/(public)/services/page.tsx#L56). |
| F-005 (forceSolidHeader missing services routes) | Confirmed | [Production-workspace/src/components/public/variant-a/PublicHeader.tsx](Production-workspace/src/components/public/variant-a/PublicHeader.tsx) force-solid list includes privacy/terms/faq/about/careers/service-area but omits `/services` and `/services/*`. |
| F-021 (double/triple bottom padding risk) | Confirmed (context-specific) | Public wrapper adds bottom clearance in [Production-workspace/src/components/public/PublicChrome.tsx](Production-workspace/src/components/public/PublicChrome.tsx) while contact page still applies extra main padding at [Production-workspace/src/app/(public)/contact/page.tsx](Production-workspace/src/app/(public)/contact/page.tsx#L240). |
| F-023 (footer links to homepage anchors vs dedicated routes) | Confirmed | Footer still points to `/#services`, `/#industries`, `/#about`, `/#service-area` in [Production-workspace/src/components/public/variant-a/FooterSection.tsx](Production-workspace/src/components/public/variant-a/FooterSection.tsx#L62). |
| F-037 (Hutto dropped via slice) | Confirmed | City links are still sliced to 6 in [Production-workspace/src/lib/service-areas.ts](Production-workspace/src/lib/service-areas.ts#L208) while source city data includes 7 entries in [Production-workspace/src/lib/service-areas.ts](Production-workspace/src/lib/service-areas.ts). |
| F-034 (hardcoded mobile-menu year) | Confirmed | Hardcoded copyright line remains in [Production-workspace/src/components/public/variant-a/PublicHeader.tsx](Production-workspace/src/components/public/variant-a/PublicHeader.tsx#L367). |
| F-060 (employment form analytics not instrumented) | Confirmed | [Production-workspace/src/components/public/EmploymentApplicationForm.tsx](Production-workspace/src/components/public/EmploymentApplicationForm.tsx) uses direct `fetch` submit path and contains no CTA analytics/event instrumentation. |
| F-061 (employment form honeypot missing) | Confirmed | [Production-workspace/src/components/public/EmploymentApplicationForm.tsx](Production-workspace/src/components/public/EmploymentApplicationForm.tsx) includes no honeypot field and no honeypot payload key. |
| F-081 (robots missing) | Not valid anymore (stale finding) | Robots route exists at [Production-workspace/src/app/robots.ts](Production-workspace/src/app/robots.ts). |
| F-082 (sitemap coverage unknown) | Partially stale | Sitemap is present and includes static public pages, industries, and city slugs in [Production-workspace/src/app/sitemap.ts](Production-workspace/src/app/sitemap.ts). Coverage quality is now a QA concern, not an unknown/missing implementation concern. |

### Full-Document Cross-Reference Coverage (F-001 to F-083)

Cross-reference pass completed for the entire findings list.

#### A) Stale / No Longer Valid

- F-062: not valid as written; `heroKenBurns` is in use in [Production-workspace/src/components/public/variant-a/HeroSection.tsx](Production-workspace/src/components/public/variant-a/HeroSection.tsx).
- F-081: not valid as written; robots route exists at [Production-workspace/src/app/robots.ts](Production-workspace/src/app/robots.ts).

#### B) Partially Stale (Needs Rewording)

- F-082: sitemap is implemented in [Production-workspace/src/app/sitemap.ts](Production-workspace/src/app/sitemap.ts); this should be tracked as coverage QA, not unknown implementation.

#### C) Runtime / Visual / Policy Validation Needed (Not fully decidable by static read)

- F-016, F-017, F-028, F-029, F-031, F-039, F-041, F-044, F-047, F-048, F-049, F-050, F-057, F-058, F-068, F-069, F-076, F-077, F-078.

#### D) Remaining Findings

- All remaining findings not listed in A-C above are code-confirmed by static cross-reference and still applicable in current state.




---

## Severity Definitions

| Tier | Label | Criteria |
|------|-------|----------|
| **T1** | Critical | Breaks conversion, layout, or core functionality |
| **T2** | High | Visible inconsistency, broken patterns, SEO/a11y gaps |
| **T3** | Medium | Content drift, navigation gaps, DRY violations, minor UX |
| **T4** | Low | Polish, edge cases, future-proofing, documentation |

---

## Findings by Tier

### TIER 1 — Critical (4 findings)

#### F-001 · Layout · PublicPageShell Breaks Full-Width Sections
**Severity:** T1 · **Complexity:** S · **Files:** `PublicPageShell.tsx`, `service-area/page.tsx`, `faq/page.tsx`, `contact/page.tsx`

`PublicPageShell` wraps content in `max-w-7xl px-4 py-16 md:py-20`, which clips full-bleed dark hero sections on service-area hub, FAQ, and contact pages. Additionally, its `py-16` stacks with page-level `pt-32` header clearance (~128px top gap) and PublicChrome's `pb-24` (~256px bottom padding on mobile).

**Fix:** Delete `PublicPageShell` entirely. All pages render `<main>` directly, matching About, Post-construction, Careers, City template, and Industry template.

**Related:** F-026 (double bottom padding)

---

#### F-002 · Conversion · All Sub-Page Quote CTAs Navigate Away Instead of Opening Panel
**Severity:** T1 · **Complexity:** M · **Files:** All sub-page route files (~10 unique templates)

Every "Request a Quote" / "Get a Quote" button on sub-pages uses `<Link href="/#quote-request">` or `<Link href="/contact">`, which navigates the user away from the current page. The `FloatingQuotePanel` is already mounted on every page via `PublicChrome` and should be opened via `QuoteCTA`.

Industry pages additionally attempt URL-based service-type pre-fill (`/?serviceType=construction#quote-request`) which would be lost — the `QuoteCTA` component's `serviceType` prop handles this correctly.

| Page | Broken Quote CTAs | Pattern |
|------|------------------|---------|
| Services Index | 1 | `<Link href="/">` |
| Post-Construction | 2 | `<Link href="/#quote-request">` |
| City Template (×7) | 2 each | `<Link href="/#quote-request">` |
| Industry Template (×3) | 2 each | `<Link href="/?serviceType=...#quote-request">` |
| About | 1 | `<Link href="/#quote-request">` |
| FAQ | 1 | `<Link href="/contact">` |
| Careers | 1 | `<Link href="/#quote-request">` |
| Service Area Hub | 1 | `<Link href="/contact">` |
| **Total** | **~15 unique / ~43 rendered** | |

**Fix:** Replace all with `<QuoteCTA ctaId="[page]_[location]_quote" serviceType="..." className="cta-primary ...">`.

**Related:** F-003, F-056

---

#### F-003 · Conversion · All Sub-Page Call CTAs Bypass Analytics Tracking
**Severity:** T1 · **Complexity:** M · **Files:** All sub-page route files (~10 unique templates)

Every `<a href="tel:...">` on sub-pages is a raw anchor, bypassing `CTAButton`'s built-in `trackConversionEvent`. ~17 unique call CTAs across all pages have zero tracking.

**Fix:** Replace all with `<CTAButton ctaId="[page]_[location]_call" actionType="call" href={tel:...}>`.

**Related:** F-002

---

#### F-004 · Layout/SEO/UX · Services Index Page Is Non-Functional
**Severity:** T1 · **Complexity:** L · **Files:** `services/page.tsx`

The page has stacked critical problems:

| Problem | Detail |
|---------|--------|
| No links to service detail pages | Cards are dead-end `<article>` elements |
| CTA is `<Link href="/">` | Links to homepage root, not quote panel, no tracking |
| No header clearance | `py-12` — content behind fixed header |
| Not in `forceSolidHeader` | Transparent header on light content |
| Titles mismatch nav labels | "Builder Turnover" vs nav "Post-Construction" |
| No breadcrumbs | Every other sub-page has them |
| No structured data | Every other sub-page has JSON-LD |
| Wrong container width | `max-w-5xl` vs system `max-w-7xl` |
| Wrong kicker style | `text-xs tracking-[0.2em] text-slate-500` vs `.section-kicker` |
| Wrong card styling | `rounded-lg` vs `rounded-2xl` / `.surface-panel` |
| H1 missing `font-serif` | Uses `font-semibold` instead |
| No cross-links | No links to industries, FAQ, service area |
| Missing OG tags | No OpenGraph metadata |

**Fix:** Complete rebuild using system patterns.

**Related:** F-005, F-041, F-042, F-060

---

### TIER 2 — High (18 findings)

#### F-005 · Header · `forceSolidHeader` Missing Routes
**Severity:** T2 · **Complexity:** S · **Files:** `PublicHeader.tsx`

Header forces solid background for `/privacy`, `/terms`, `/faq`, `/about`, `/careers`, `/service-area`, `/service-area/*`. Missing:
- `/services` — light bg, no hero
- `/services/*` — `bg-[#F1F0EE]`, breadcrumb text invisible on glass
- `/contact` — has dark hero but `PublicPageShell` breaks it; after F-001 fix, transparent works

**Fix:** Add `/services` and `/services/*` to the condition. Re-evaluate `/contact` after F-001.

---

#### F-006 · Styling · FAQ Page CTAs Don't Use Design System
**Severity:** T2 · **Complexity:** S · **Files:** `faq/page.tsx`

Hero buttons use custom classes (`rounded-lg`, `font-medium`, no uppercase/tracking, no hover translate, no active scale) that visibly differ from system `.cta-primary` and `.cta-outline-dark`.

**Fix:** Replace ~3 button instances with system CTA classes and `CTAButton`/`QuoteCTA` components.

---

#### F-007 · Styling · FAQ Page Kicker Style Mismatch
**Severity:** T2 · **Complexity:** S · **Files:** `faq/page.tsx`

Kicker uses `text-xs tracking-[0.18em]` instead of system `.section-kicker` (`text-[10px] tracking-[0.24em]`). Visible size and spacing difference.

**Fix:** Replace with `.section-kicker` class.

---

#### F-008 · SEO · Careers Page Missing Breadcrumbs and Structured Data
**Severity:** T2 · **Complexity:** S · **Files:** `careers/page.tsx`

Only sub-page without `<nav aria-label="Breadcrumb">` or JSON-LD structured data.

**Fix:** Add breadcrumb UI and `BreadcrumbList` + `WebPage` schemas.

---

#### F-009 · SEO · Industry Template Missing BreadcrumbList Schema
**Severity:** T2 · **Complexity:** S · **Files:** `industries/[slug]/page.tsx`

Has `FAQPage` and `Service` schemas but no `BreadcrumbList`, despite having a breadcrumb UI.

**Fix:** Add `BreadcrumbList` to structured data array.

---

#### F-010 · Layout · Container Width Inconsistency
**Severity:** T2 · **Complexity:** S · **Files:** `careers/page.tsx`, `services/page.tsx`

| Page | Width | System Standard |
|------|-------|----------------|
| Careers | `max-w-6xl` | `max-w-7xl` |
| Services Index | `max-w-5xl` | `max-w-7xl` |

**Fix:** Align outer section containers to `max-w-7xl`. Narrower widths (`max-w-4xl`, `max-w-3xl`) acceptable only for inner text-heavy blocks.

---

#### F-011 · A11y · Mobile Nav Link Touch Targets Below 44px
**Severity:** T2 · **Complexity:** S · **Files:** `PublicHeader.tsx`

Mobile nav links at `py-3` on `text-[13px]` ≈ 37px total, below WCAG 44px recommendation.

**Fix:** Add `min-h-[44px]` or increase to `py-3.5`.

---

#### F-012 · A11y · FAQ Filter Buttons Below 44px and Missing `aria-pressed`
**Severity:** T2 · **Complexity:** S · **Files:** `FAQSection.tsx`

Filter buttons at `py-2` on `text-[10px]` ≈ 26px. No `aria-pressed` for active state.

**Fix:** Add `min-h-[44px]` and `aria-pressed={filter === category}`.

---

#### F-013 · A11y · Desktop Header Call Button at 40px
**Severity:** T2 · **Complexity:** S · **Files:** `PublicHeader.tsx`

Explicitly `min-h-[40px]`. Every other CTA uses 44–48px.

**Fix:** Change to `min-h-[44px]`.

---

#### F-014 · A11y · Sticky Bottom Bar Missing Semantic Labeling
**Severity:** T2 · **Complexity:** S · **Files:** `PublicChrome.tsx`

No `role` or `aria-label`. Screen readers encounter orphaned buttons.

**Fix:** Add `role="toolbar" aria-label="Quick actions"` or `<nav aria-label="Quick contact">`.

---

#### F-015 · A11y · Industry Social Proof Section Has No Heading
**Severity:** T2 · **Complexity:** S · **Files:** `industries/[slug]/page.tsx`

Uses kicker `<p>` + `<blockquote>` with no `<h2>`. Screen reader heading navigation skips this section.

**Fix:** Add an `<h2>` after the kicker.

---

#### F-016 · SEO · Weak Page Titles Missing Location and Brand
**Severity:** T2 · **Complexity:** S · **Files:** `services/page.tsx`, `faq/page.tsx`, `contact/page.tsx`

| Page | Current | Recommended |
|------|---------|-------------|
| Services | `"Services"` | `"Cleaning Services \| A&A Cleaning Austin TX"` |
| FAQ | `"FAQ"` | `"FAQ \| A&A Cleaning Services Austin"` |
| Contact | `"Contact Us"` | `"Contact Us \| A&A Cleaning Austin TX"` |

---

#### F-017 · SEO · Missing OpenGraph Tags
**Severity:** T2 · **Complexity:** S · **Files:** `services/page.tsx`, `careers/page.tsx`

Every other page has OG metadata. These two are missing.

---

#### F-018 · SEO · Heading Hierarchy Break in ServicePageHardening
**Severity:** T2 · **Complexity:** S · **Files:** `ServicePageHardening.tsx`

Objection title renders as `<h2>` inside parent page context where it should be `<h3>`. Creates `h1 → h2 → h3 → h2` hierarchy break.

**Fix:** Accept a `headingLevel` prop or default inner headings one level deeper.

---

#### F-019 · Styling · Background Color Rule Undefined
**Severity:** T2 · **Complexity:** M · **Files:** Multiple page files

`#F1F0EE` (`--color-warm`) used as `<main>` background on post-construction, city template, and one section of About. `#FAFAF8` (`--color-white`) used everywhere else. No documented rule.

**Recommendation:** Standardize `<main>` bg as `#FAFAF8`. Sections alternate white / `#FAFAF8`. Deprecate `#F1F0EE` as page-level background.

---

#### F-020 · UX · FAQ Accordion Pattern Differs Across Pages
**Severity:** T2 · **Complexity:** M · **Files:** `FAQSection.tsx`, `ServicePageHardening.tsx`, `service-area/page.tsx`, `service-area/[slug]/page.tsx`, `industries/[slug]/page.tsx`

| Location | Pattern | Animated? | A11y? |
|----------|---------|-----------|-------|
| Homepage FAQSection | Controlled `useState` + `grid-rows` | ✅ Smooth | ✅ Full ARIA |
| ServicePageHardening | Controlled `useState` + `grid-rows` | ✅ Smooth | ✅ Full ARIA |
| Service area hub/city/industry | Native `<details>` | ❌ Snaps | ⚠️ Partial |

**Recommendation:** Extract shared accordion from FAQSection pattern. Use everywhere for consistent animation and a11y.

---

#### F-021 · UX · Double/Triple Bottom Padding on Mobile
**Severity:** T2 · **Complexity:** S · **Files:** `PublicChrome.tsx`, multiple page files

PublicChrome wrapper: `pb-24 md:pb-0`. Individual pages also add `pb-24 md:pb-0` to `<main>`. Body CSS adds `padding-bottom: env(safe-area-inset-bottom)`. Total on notched phone: ~226px for ~68px sticky bar.

**Fix:** Remove `pb-24` from individual page `<main>` elements. PublicChrome's wrapper handles it.

**Related:** F-001

---

#### F-022 · A11y · Mobile Nav Inaccessible Without JavaScript
**Severity:** T2 · **Complexity:** M · **Files:** `PublicHeader.tsx`

Mobile menu content lives in `opacity-0 pointer-events-none` div, toggled by JS. No `<noscript>` fallback. Desktop nav is `hidden lg:flex` — visible on large screens regardless.

**Recommendation:** Add `<noscript>` block with basic nav links for mobile, or use CSS `:target` fallback.

---

### TIER 3 — Medium (36 findings)

#### F-023 · Nav · Footer Links Use Homepage Anchors Instead of Page Routes
**Files:** `FooterSection.tsx`

| Link | Current | Should Be |
|------|---------|-----------|
| Services | `/#services` | `/services` |
| About | `/#about` | `/about` |
| Service Area | `/#service-area` | `/service-area` |
| Who We Serve | `/#industries` | `/services` or keep |

---

#### F-024 · Styling · Dark-Context CTA Uses Overridden `.cta-outline-dark` Instead of `.cta-light`
**Files:** `about/page.tsx`, `industries/[slug]/page.tsx`, `service-area/page.tsx`

Three pages override `.cta-outline-dark` with inline `border-white/35 text-white hover:bg-white` for dark backgrounds. `.cta-light` exists for exactly this purpose but is never used on sub-pages.

---

#### F-025 · Styling · `.section-kicker` Force Override on Dark Backgrounds
**Files:** `industries/[slug]/page.tsx`

Uses `className="section-kicker !text-slate-300"`. Other dark-bg contexts use explicit gold kicker text.

**Rule:** Light bg → `.section-kicker` (blue). Dark bg → inline gold kicker. Don't `!important` override.

---

#### F-026 · Content · Service Area Pages Only Surface 3 of 5 Services
**Files:** `service-area/page.tsx`, `service-area/[slug]/page.tsx`

Both hardcode Post-Construction, Commercial, Move-In/Move-Out. Missing Final Clean and Windows & Power Wash. Should derive from `SERVICE_MENU_LINKS`.

---

#### F-027 · Content · Services Index Titles Don't Match Navigation Labels
**Files:** `services/page.tsx`, `data/services.ts`

| Nav Label | Index Title | SERVICES.titleLines |
|-----------|-------------|-------------------|
| Post-Construction | Builder Turnover | Post-Construction Clean |
| Commercial | Recurring Site Care | Commercial Cleaning |
| Move-In / Move-Out | Vacant Unit Turnover | Move-In Move-Out |
| Windows & Power Wash | Exterior Detail Upgrade | Windows & Power Wash |

**Note:** Subsumed by F-004 rebuild.

---

#### F-028 · Nav · Contact Page City Chips Are Non-Interactive
**Files:** `contact/page.tsx`

City names render as `<span>` instead of `<Link>` to city pages.

---

#### F-029 · Layout · Careers Page Has No Closing Dark CTA Section
**Files:** `careers/page.tsx`

Every other page ends with `bg-[#0A1628]` CTA band. Careers ends with a thin white bar.

---

#### F-030 · Nav · Industry Breadcrumb Links to Homepage Anchor
**Files:** `industries/[slug]/page.tsx`

`<Link href="/#industries">` navigates away. No `/industries` index page exists.

**Decision needed:** Create minimal `/industries` index or accept homepage anchor.

---

#### F-031 · Content · Industry Page Container Width Inconsistency
**Files:** `industries/[slug]/page.tsx`

Social proof uses `max-w-5xl`, FAQ uses `max-w-4xl`, closing CTA uses `max-w-4xl`. Other sections use `max-w-7xl`. Not broken but no documented narrowing rule.

---

#### F-032 · Data · Response Time Claims Inconsistent Across Pages
**Files:** `service-areas.ts`, `faq-items.ts`, multiple page files

Homepage/FAQ/Contact claim "1 hour." Georgetown/Kyle/San Marcos/Hutto city data says "< 90 min."

---

#### F-033 · Data · `SERVICE_LINK_BY_ANCHOR` Duplicates Derivable Data
**Files:** `industries/[slug]/page.tsx`

Hardcoded anchor→href mapping. Should derive from `SERVICES` + `SERVICE_MENU_LINKS` or add `href` to `SERVICES` data model.

---

#### F-034 · Data · Mobile Menu Copyright Year Hardcoded
**Files:** `PublicHeader.tsx`

Mobile menu: `© 2026`. Footer: `new Date().getFullYear()` (dynamic).

---

#### F-035 · Data · Service Area Hub Duplicates Type Definition
**Files:** `service-area/page.tsx`

Local `CityData` type partially mirrors `ServiceAreaCity`. Should extend or map from source type.

---

#### F-036 · Data · `nearbyAreaSlugs` Contains "austin" Without City Page
**Files:** `service-areas.ts`, `service-area/[slug]/page.tsx`

Special case handles it but is fragile. Should be documented or use explicit href.

---

#### F-037 · Data · `HOMEPAGE_SERVICE_AREA_LINKS` Excludes Hutto Silently
**Files:** `service-areas.ts`

`.slice(0, 6)` drops Hutto based on array position. If order changes, wrong city dropped.

---

#### F-038 · SEO · Service Detail Pages Missing Cross-Links to Industry Pages
**Files:** `services/post-construction-cleaning/page.tsx` (and other service pages)

Industry pages link TO service pages but service pages don't link back. Missed interlinking opportunity.

---

#### F-039 · Nav · About Page Missing Link to Careers
**Files:** `about/page.tsx`

Links to all 3 industries, service-area, FAQ. No careers link despite being a natural fit.

---

#### F-040 · Nav · No Way to Navigate Between Service Pages
**Files:** All service detail pages

No "Related Services" or "Other Services" section. Users must use header nav or breadcrumb to explore other services.

---

#### F-041 · Nav · Service Breadcrumb Parent Links to Broken Page
**Files:** Service detail pages

Breadcrumb "Services" links to `/services` which is currently F-004 (broken placeholder).

---

#### F-042 · Nav · Footer "Contact" Link Exists but Header Has No Contact Link
**Files:** `PublicHeader.tsx`, `FooterSection.tsx`

`/contact` is in footer nav but not in `primaryLinks` for header. Users can't find contact page from header.

---

#### F-043 · Nav · Industry Pages Don't Link to Service Area Pages
**Files:** `industries/[slug]/page.tsx`

No path from industry page to city-specific pages. Service-area pages link to industries but not vice versa.

---

#### F-044 · Content · Company Descriptor Varies Across Pages
**Files:** Multiple

"Construction-Ready Cleaning" (header) vs "Standards-driven facility care" (footer) vs "Post-construction, turnover, and commercial cleaning" (service-area). No consistent positioning statement.

---

#### F-045 · Content · "Se Habla Español" Missing Accent
**Files:** `industries/[slug]/page.tsx`

`Se Habla Espanol` — missing ñ accent. Inconsistent with "Bilingual coordination" used elsewhere.

---

#### F-046 · Content · Footer "Built For" Chips Don't Match Industry Titles
**Files:** `FooterSection.tsx`

"Contractors" / "Property Teams" vs "General Contractors" / "Property Managers" in industry data.

---

#### F-047 · Content · Testimonial Attribution May Be Fabricated
**Files:** `industries/[slug]/page.tsx`

Names and company names ("Top-Tier Construction", "Prestige Developments", "BuildCo Partners") appear generic. Legal and trust risk under Google testimonial guidelines.

**Recommendation:** Use real testimonials or anonymize to role-only attribution.

---

#### F-048 · Data · "500+ Projects" Duplicated Without Shared Constant
**Files:** `about/page.tsx`, `service-area/page.tsx`

Both independently claim "500+". Should be `COMPANY_STATS.projectsDelivered` in `lib/company.ts`.

---

#### F-049 · Content · Business Hours Only on Contact Page
**Files:** `contact/page.tsx`

FAQ references "business hours" without defining them. Footer doesn't include hours. Should be shared constant.

---

#### F-050 · Content · "Same-Day" Promise Inconsistency
**Files:** Multiple

"Same-day support" (doing work) vs "same-day response" (replying) vs "same-day quote review" (reviewing scope). Three different meanings using the same phrase.

---

#### F-051 · DRY · Dark Closing CTA Band Repeated 6+ Times
**Files:** Post-construction, city template, industry template, about, FAQ, service-area hub

Nearly identical ~15-line block. Should be extracted to `<ClosingCTABand>`.

---

#### F-052 · DRY · Breadcrumb Navigation Repeated on Every Sub-Page
**Files:** All sub-pages (~8 templates)

Hand-coded with variant styling (dark hero vs light). Should be `<Breadcrumb items={[...]} variant="light" | "dark">`.

---

#### F-053 · DRY · Cross-Links Block Repeated 4+ Times
**Files:** `service-area/page.tsx`, `service-area/[slug]/page.tsx`, `faq/page.tsx`, `industries/[slug]/page.tsx`

Same industry/about/FAQ link cluster with slight prefix text variations. Extract to `<CrossLinks>`.

---

#### F-054 · DRY · Service Cards on Area Pages Hardcoded
**Files:** `service-area/page.tsx`, `service-area/[slug]/page.tsx`

Both independently hardcode same 3 services. Should derive from shared constant based on `SERVICE_MENU_LINKS`.

---

#### F-055 · DRY · Structured Data Helpers Don't Exist
**Files:** All sub-pages

Every page manually constructs JSON-LD. Should extract: `buildBreadcrumbSchema()`, `buildServiceSchema()`, `buildFAQSchema()`, `buildLocalBusinessSchema()`.

---

#### F-056 · Nav · Service Area Hub "Request Coverage" Needs CTAButton Tracking
**Files:** `service-area/page.tsx`

`<Link href="/contact">` is appropriate intent (coverage inquiry ≠ standard quote) but bypasses analytics. Wrap in `CTAButton` with `actionType="link"`.

---

#### F-057 · Responsive · SVG Map Unreadable on Mobile
**Files:** `service-area/page.tsx`

City labels at `text-[3.6px]` in `h-[300px]`. On 375px phone, labels are ~2-3px tall. Map stacks above city list on mobile.

**Fix:** `hidden lg:block` on map, or reverse order so clickable list appears first.

---

#### F-058 · Responsive · Post-Construction Hero Layout Stacking
**Files:** `services/post-construction-cleaning/page.tsx`

Between 768–1024px, text block is `max-w-2xl` (672px) but image has `max-w-lg` (512px), creating ragged single-column layout.

---

### TIER 4 — Low / Polish (25 findings)

#### F-059 · A11y · Homepage FAQSection Non-Functional Without JS
**Files:** `FAQSection.tsx`

Controlled state accordion renders all answers in `grid-rows-[0fr]` when JS doesn't hydrate. `<details>` on other pages works without JS natively.

---

#### F-060 · Perf · Employment Form Has No Analytics Tracking
**Files:** `EmploymentApplicationForm.tsx`

Contact form uses `useQuoteForm` (presumably fires events). Employment form uses raw `fetch` with zero tracking.

---

#### F-061 · Security · Employment Form Has No Honeypot Field
**Files:** `EmploymentApplicationForm.tsx`

Contact form has honeypot. Employment form has only server-side rate limiting.

---

#### F-062 · Perf · Unused CSS Animation `heroKenBurns`
**Files:** `globals.css`

Defined but no component references it. Dead code.

---

#### F-063 · Styling · Legacy `bg-opacity-*` Syntax
**Files:** `globals.css`

`.info-chip-dark` and `.dark-surface-panel` use `bg-white bg-opacity-10` instead of modern `bg-white/10`.

---

#### F-064 · Data · SVG Map Extracts Color via String Manipulation
**Files:** `service-area/page.tsx`

Parses `"bg-[#3b82f6]"` → `"#3b82f6"` via `.replace()`. Breaks silently if class format changes.

**Fix:** Store fill colors as separate data field alongside Tailwind classes.

---

#### F-065 · Data · `VISUAL_REGION_MAP` Normalizes Casing
**Files:** `service-area/page.tsx`, `data/service-area-visual.ts`

Lowercase `"north"` vs capitalized `"North"` in two data sources. Normalize at the source.

---

#### F-066 · UX · No Empty State for FAQ Filter
**Files:** `FAQSection.tsx`

Renders empty container if filter produces zero results.

---

#### F-067 · UX · No Empty State for Industry Service Grid
**Files:** `industries/[slug]/page.tsx`

`getIndustryServices` could return empty array if anchors don't match. No fallback UI.

---

#### F-068 · Animation · Hover Translate Inconsistency
**Files:** Multiple

Cards use `-translate-y-0.5` (2px) in some places, `-translate-y-1` (4px) in others. Same interaction type, different lift.

---

#### F-069 · Animation · Hover Shadow Inconsistency
**Files:** Multiple

Same card hover pattern uses `shadow-lg`, `shadow-md`, or no shadow change across 5 different locations.

**Recommendation:** Define `.hoverable-card` utility.

---

#### F-070 · Interaction · Quote Panel serviceType Lost on Navigation
**Files:** `PublicChrome.tsx`

Local state resets on page change. Industry page URL-based approach would be lost when converting to `QuoteCTA`.

**Note:** `QuoteCTA`'s `serviceType` prop handles this correctly for in-page opens.

---

#### F-071 · Interaction · Exit Intent Only on Homepage
**Files:** `VariantAPublicPage.tsx`

`ExitIntentOverlay` is inside homepage component only. Direct-landing users on sub-pages never see it.

**Decision needed:** Intentional or should move to `PublicChrome`?

---

#### F-072 · Interaction · Mobile Menu Doesn't Close on Escape
**Files:** `PublicHeader.tsx`

Desktop dropdown handles Escape. Mobile menu has no keyboard close handler.

---

#### F-073 · Interaction · Desktop Dropdowns Don't Trap Focus
**Files:** `PublicHeader.tsx`

Focus can tab past last dropdown item without closing the dropdown.

---

#### F-074 · Type · `SERVICE_FAQS`/`SERVICE_PRICING` Keys Don't Match Service Slugs
**Files:** `lib/service-faqs.ts`, `lib/service-pricing.ts`, `ServicePageHardening.tsx`

5 service pages → 4 hardening types. `post-construction-cleaning` and `final-clean` likely share `"construction"` type. No room for differentiation.

---

#### F-075 · Type · `INDUSTRY_PAGE_CONTENT` 300+ Lines in Page File
**Files:** `industries/[slug]/page.tsx`

Large data constant mixed with component code. Should move to dedicated data file.

---

#### F-076 · Image · Industry Hero and Before/After Use Same Image
**Files:** `industries/[slug]/page.tsx`

Hero `image` and `beforeAfter.afterImage` reference the same file path. Users see identical image twice.

---

#### F-077 · Image · No Image Quality Standardization
**Files:** Multiple

Post-construction: 75. About: 78. Industry: 72. No documented rule. Hero images behind overlays can use 60-65.

---

#### F-078 · Image · No Blur Placeholder for Below-Fold Images
**Files:** `industries/[slug]/page.tsx`

Before/after images lack `placeholder="blur"`. Images pop in on slow connections.

---

#### F-079 · Security · `dangerouslySetInnerHTML` for JSON-LD
**Files:** All sub-pages (~7)

Safe today with static data. Risky if data sources become user-editable.

**Recommendation:** Create `<JsonLd data={...} />` wrapper that escapes.

---

#### F-080 · Security · Employment Form No Client-Side Validation
**Files:** `EmploymentApplicationForm.tsx`

No phone regex, email format check, or field length limits. 50k character `notes` would transmit before server rejects.

---

#### F-081 · Config · No Visible `robots.txt`
**Files:** App root

Sitemap exists but no robots.txt. Staging/preview deployments may be indexed.

---

#### F-082 · Config · Sitemap Coverage Unknown
**Files:** `app/sitemap.ts`

Needs to generate 20+ URLs from data files. Unknown if manually maintained or dynamic.

---

#### F-083 · Docs · Company Data Scattered Across Files
**Files:** `lib/company.ts`, `about/page.tsx`, `service-area/page.tsx`, `contact/page.tsx`

Business hours, stats ("500+", "15+ years"), response time claims duplicated across files. Should centralize in `lib/company.ts`.

---

## Appendix A: Files Touched Per Tier

### Tier 1 (4 findings, ~12 files)
```
DELETE  src/components/public/PublicPageShell.tsx
MODIFY  src/app/(public)/service-area/page.tsx         (remove shell, wire CTAs)
MODIFY  src/app/(public)/faq/page.tsx                  (remove shell, wire CTAs)
MODIFY  src/app/(public)/contact/page.tsx               (remove shell, wire CTAs)
REWRITE src/app/(public)/services/page.tsx              (complete rebuild)
MODIFY  src/app/(public)/services/post-construction-cleaning/page.tsx  (wire CTAs)
MODIFY  src/app/(public)/services/final-clean/page.tsx                 (wire CTAs)
MODIFY  src/app/(public)/services/commercial-cleaning/page.tsx         (wire CTAs)
MODIFY  src/app/(public)/services/move-in-move-out-cleaning/page.tsx   (wire CTAs)
MODIFY  src/app/(public)/services/windows-power-wash/page.tsx          (wire CTAs)
MODIFY  src/app/(public)/service-area/[slug]/page.tsx   (wire CTAs)
MODIFY  src/app/(public)/industries/[slug]/page.tsx     (wire CTAs)
MODIFY  src/app/(public)/about/page.tsx                 (wire CTAs)
MODIFY  src/app/(public)/careers/page.tsx               (wire CTAs)
```

### Tier 2 (18 findings, ~10 files)
```
MODIFY  src/components/public/variant-a/PublicHeader.tsx    (F-005, F-011, F-013, F-022)
MODIFY  src/app/(public)/faq/page.tsx                       (F-006, F-007)
MODIFY  src/app/(public)/careers/page.tsx                   (F-008, F-010)
MODIFY  src/app/(public)/industries/[slug]/page.tsx         (F-009, F-015)
MODIFY  src/components/public/variant-a/FAQSection.tsx      (F-012)
MODIFY  src/components/public/PublicChrome.tsx               (F-014)
MODIFY  src/components/public/variant-a/ServicePageHardening.tsx (F-018)
MODIFY  Multiple page files                                  (F-019, F-021)
CREATE  Shared FAQ accordion component                       (F-020)
```

### Tier 3 (36 findings, ~15 files)
```
MODIFY  src/components/public/variant-a/FooterSection.tsx   (F-023, F-046)
MODIFY  src/app/(public)/about/page.tsx                     (F-024, F-039)
MODIFY  src/app/(public)/industries/[slug]/page.tsx         (F-024, F-025, F-030, F-043, F-045, F-047)
MODIFY  src/app/(public)/service-area/page.tsx              (F-026, F-054, F-057)
MODIFY  src/app/(public)/service-area/[slug]/page.tsx       (F-026, F-054)
MODIFY  src/app/(public)/contact/page.tsx                   (F-028)
MODIFY  src/app/(public)/careers/page.tsx                   (F-029)
MODIFY  src/lib/service-areas.ts                            (F-032, F-036, F-037)
MODIFY  src/data/industries.ts or industry page             (F-033)
MODIFY  src/components/public/variant-a/PublicHeader.tsx    (F-034)
MODIFY  All service detail pages                             (F-038, F-040)
CREATE  src/lib/structured-data.ts                           (F-055)
CREATE  src/components/public/variant-a/ClosingCTABand.tsx  (F-051)
CREATE  src/components/public/variant-a/Breadcrumb.tsx      (F-052)
CREATE  src/components/public/variant-a/CrossLinks.tsx      (F-053)
```

### Tier 4 (25 findings, ~12 files)
```
MODIFY  src/components/public/variant-a/FAQSection.tsx      (F-059, F-066)
MODIFY  src/components/public/EmploymentApplicationForm.tsx  (F-060, F-061, F-080)
MODIFY  src/styles/globals.css                               (F-062, F-063, F-069)
MODIFY  src/data/service-area-visual.ts                     (F-064, F-065)
MODIFY  src/app/(public)/industries/[slug]/page.tsx         (F-067, F-075, F-076)
MODIFY  src/components/public/variant-a/PublicHeader.tsx    (F-072, F-073)
MODIFY  src/lib/company.ts                                   (F-083)
CREATE  src/components/public/variant-a/JsonLd.tsx          (F-079)
CREATE  src/app/robots.ts                                    (F-081)
REVIEW  src/app/sitemap.ts                                   (F-082)
MODIFY  Multiple page files                                  (F-068, F-077, F-078)
```

---

## Appendix B: Decision Points (Require Owner Input Before Solutioning)

| ID | Decision | Options |
|----|----------|---------|
| **D-01** | Create `/industries` index page? | A) Build minimal index. B) Accept homepage anchor in breadcrumb. |
| **D-02** | Exit intent: homepage-only or all pages? | A) Move to PublicChrome. B) Keep homepage-only, document why. |
| **D-03** | Testimonials: real or remove names? | A) Source real testimonials. B) Anonymize to role-only. |
| **D-04** | Add Contact to header nav? | A) Add to `primaryLinks`. B) Keep as CTA-only (Call/Quote). |
| **D-05** | `#F1F0EE` as page bg: deprecate? | A) Standardize on `#FAFAF8` everywhere. B) Document when warm is appropriate. |
| **D-06** | 404 page: does it exist? | Need to check `app/not-found.tsx`. Brand it if missing. |
| **D-07** | Hutto exclusion from homepage links: intentional? | A) Include all 7. B) Document design reasoning for 6. |
| **D-08** | Form styling: align Employment to Contact pattern? | A) Align both. B) Accept different contexts = different styling. |
| **D-09** | Service FAQ/Pricing 5→4 type mapping: expand? | A) Add `"final-clean"` type. B) Document shared `"construction"` type. |

---

*This document feeds directly into the Solutioning Doc, which will define implementation approach, session grouping, and file-level change specs for each finding.*

# Pre-Solutioning Review — Gaps & Context Pack

Good instinct to ask. After cross-referencing every deep-dive finding against the master doc, I found **two categories of gaps**: findings that didn't make it in, and critical context the new chat will need to be effective.

---

## A) Findings Missing from Master Doc

These were in the deep-dive passes but got dropped during consolidation. Most are T4 but some are T3:

### Should Add (T3 level)

**F-084 · Error · ErrorBoundary Usage Inconsistent on Homepage**
`PublicChrome` wraps `FloatingQuotePanel` and `AIQuoteAssistant` in ErrorBoundary. `VariantAPublicPage` wraps `BeforeAfterSlider` and `TestimonialSection` but NOT `ServiceSpreadSection`, `OfferAndIndustrySection`, `TimelineSection`, or `AboutSection`. If an unwrapped section throws, the entire homepage crashes.

**F-085 · Security · No CSRF Protection on Form Submissions**
Neither `ContactPageClient` nor `EmploymentApplicationForm` includes CSRF tokens. Next.js API routes accept any POST with correct JSON shape. Low risk for a cleaning company but worth noting.

**F-086 · SEO · Homepage Canonical URL Unknown**
Other pages use `alternates: { canonical: "/path" }`. Haven't confirmed the homepage has `canonical: "/"`. If missing, Google may index duplicate URLs.

**F-087 · Responsive · Contact Page Sidebar Buries Key Info on Mobile**
Below `lg`, form stacks above sidebar. Users on tablet see the full form before discovering phone number, hours, and call CTA. Most useful info is buried at the bottom.

**F-088 · Responsive · About Hero Fixed Height May Crop Poorly**
`h-[20rem]` on mobile with `object-cover`. On 320px screens this creates a nearly-square crop of what may be a landscape image.

**F-089 · Data · `useQuoteForm` Dual Instance Risk on Contact Page**
Both `FloatingQuotePanel` (always mounted via PublicChrome) and `ContactPageClient` use `useQuoteForm`. If the hook has any singleton behavior (global state, duplicate submission guards), the two instances could conflict. Likely fine since hooks are instance-scoped, but should verify.

**F-090 · Config · `opengraph-image.tsx` / `twitter-image.tsx` Coverage Unknown**
Listed in reference map but not reviewed. Unknown if they use the design system or generate page-specific images.

### Should Add (T4 level)

**F-091 · Type · Dynamic Page `params` Pattern Inconsistency**
Industry template inlines the type. City template extracts to named `LocationPageProps`. Should share a `DynamicPageProps<T>` utility type.

**F-092 · Type · `getLocation` Missing Explicit Return Type**
`SERVICE_AREA_BY_SLUG[slug]` returns `ServiceAreaCity | undefined` implicitly. No annotation. Could break silently if index signature changes.

**F-093 · Error · `trackConversionEvent` Errors Silently Swallowed**
`void trackConversionEvent(...)` discards the promise. If analytics throws, no catch or logging. Should ensure internal try/catch exists.

**F-094 · Error · City Template `nearbyAreas` Silently Drops Invalid Slugs**
A typo in `nearbyAreaSlugs` (e.g., `"roundrock"` vs `"round-rock"`) silently removes a city from the list. Should warn in dev mode.

**F-095 · Error · `getSiteUrl()` Has No Build-Time Validation**
If env var is missing or wrong, every page's canonical URL, OG URL, and structured data break silently.

**F-096 · Browser · Transparent Header Blur Fallback**
`bg-[#07101d]/22` with `backdrop-blur-xl` — if blur fails (older browsers), text readability against hero images degrades significantly. The solid-state fallback (`bg-[#0f2746]`) is fine.

**F-097 · Image · No Documented Alt Text Strategy**
Hero images have good descriptive alts. Before/after images use formulaic `${caption} before/after` which gives screen readers no visual context.

**F-098 · Image · Service Page Images Shared with Homepage**
`/images/variant-a/service-spread-01.jpg` used on both homepage `ServiceSpreadSection` and post-construction detail page. Intentional coupling or drift is undocumented.

**F-099 · Docs · No Living Style Guide or Component Documentation**
Design system exists in `globals.css` but no Storybook or `/dev/styleguide` page. New developers must reverse-engineer patterns.

**F-100 · Docs · Key Decisions Lack "Why" Comments**
`slice(0, 6)` on city links, image quality values, `forceSolidHeader` path list, exit-intent homepage-only — no documentation explaining reasoning.

---

## B) Updated Appendix B — Decision Points

Add these to the existing 9:

| ID | Decision | Options |
|----|----------|---------|
| **D-10** | ErrorBoundary strategy: wrap all sections or page-level? | A) Wrap every section. B) Page-level boundary in layout. C) Only wrap dynamic imports (current). |
| **D-11** | Contact page mobile: reorder sidebar above form? | A) Show condensed info bar above form on mobile. B) Keep current order. |
| **D-12** | Image quality standardization | A) 60-65 for overlayed heroes, 75-80 for detail images. B) 75 everywhere. |

---

## C) Context Pack for New Chat

This is the part that matters most. When you start the new chat, the LLM won't have any of my internalized understanding. I'd recommend pasting the following context in this order:

### 1. The Reference Map (you already have this)
Paste the Public Pages Reference Map doc as-is.

### 2. Design System Reference (NEW — paste this)

```markdown
## Design System — Quick Reference

### Color Tokens
| Token | Hex | Usage |
|-------|-----|-------|
| Navy | #0A1628 | Primary text, CTA bg, dark sections, body text |
| Dark Blue | #0f2746 / #081120 | Header scrolled, footer bg |
| Royal | #2563EB | Kickers (.section-kicker), links, focus accents |
| Gold | #C9A94E | Accent dots, .cta-gold, dark-bg kickers, decorative |
| Warm | #F1F0EE | Occasional section bg (being deprecated per audit) |
| Off-white | #FAFAF8 | Body background, section alternation |

### Z-Index Stack
30 → sticky bar | 40 → floating widget | 50 → header | 55 → dialog | 60 → overlay

### CTA Variants (globals.css @layer components)
- `.cta-primary` → navy bg, white text, rounded-md, hover:-translate-y-0.5, active:scale-[0.98]
- `.cta-light` → glass/border, fills white on hover (FOR DARK BACKGROUNDS)
- `.cta-gold` → gold bg, navy text
- `.cta-outline-dark` → slate border, hover fills white (FOR LIGHT BACKGROUNDS)
All share: text-xs font-bold uppercase tracking-[0.18em], transition duration-300

### Typography Patterns
- Kickers: text-[10px] font-bold uppercase tracking-[0.24em] — use .section-kicker (blue) on light, inline gold on dark
- Headings: font-serif + tracking-tight + text-[#0A1628]
- Body: text-sm, font-normal mobile / font-light md+

### Component Primitives
- .surface-panel → rounded-2xl border-slate-200 bg-white shadow-sm
- .surface-panel-soft → rounded-2xl border-slate-200/80 bg-white/80 shadow-sm backdrop-blur
- .dark-surface-panel → rounded-2xl border-white/10 bg-white/5 shadow backdrop-blur
- .info-chip / .info-chip-dark → rounded-full pills
- .signal-line → with gold→blue gradient ::before
- .ghost-index → decorative serif numbers

### Layout Constants
- Container: max-w-7xl mx-auto px-6
- Narrower containers (max-w-4xl, max-w-3xl) only for inner text blocks
- Header: fixed top, z-50, floating rounded-xl shell
- Footer: bg-[#081120], 4-col grid on md
- Mobile sticky bar: z-30, fixed bottom, after 80vh scroll, hidden when panel open
```

### 3. Architecture Reference (NEW — paste this)

```markdown
## Architecture — How Key Systems Work

### PublicChrome (wraps ALL public pages)
Provides: QuoteContext → FloatingQuotePanel → AIQuoteAssistant → ScrollToTopButton → mobile sticky bar
- Mounts FloatingQuotePanel once, available everywhere via QuoteContext
- Wraps children in pb-24 md:pb-0 (for sticky bar clearance)
- Tracks section views + scroll depth (homepage only)
- Controls body scroll lock when panel open
- Mobile sticky bar shows after 80vh scroll, hides when panel open or mobile menu open

### CTA Flow
QuoteCTA → CTAButton(actionType="quote") → trackConversionEvent → openQuote(context?) → FloatingQuotePanel opens
CTAButton(actionType="call") → trackConversionEvent → follows tel: href
CTAButton(actionType="link") → trackConversionEvent → follows href via Next.js Link or <a>

### Header Behavior
- Transparent by default (for dark hero pages)
- Forces solid bg on: /privacy, /terms, /faq, /about, /careers, /service-area, /service-area/*
- NEEDS to also force solid on: /services, /services/* (per audit)
- Scroll threshold: max(120px, 50vh) → transitions to solid

### Data Model Counts
- 5 services (post-construction, final-clean, commercial, move-in-move-out, windows-power-wash)
- 3 industries (general-contractors, property-managers, commercial-spaces)
- 7 cities (round-rock, georgetown, pflugerville, buda, kyle, san-marcos, hutto)
- 15 FAQ items (7 general, 5 process, 3 pricing)
- 4 service hardening types (construction, commercial, turnover, specialty) — maps 5 pages to 4 types

### Page Rendering Patterns
- Pages WITH dark hero: render <main> directly, transparent header works
- Pages WITHOUT dark hero: render <main> directly, need forceSolidHeader
- PublicPageShell: BEING DELETED per audit F-001
```

### 4. The Master Findings Doc (what you just built)
Paste the full doc including all appendices.

### 5. Key File Contents
For the solutioning phase, the new chat will need to see actual file contents when implementing. Most critical to have ready to paste:
- `PublicChrome.tsx`
- `PublicHeader.tsx`
- `CTAButton.tsx` / `QuoteCTA.tsx`
- `globals.css`
- The specific page file being worked on in each session

---

## D) Final Thought — Solutioning Doc Structure

When you start the new chat, I'd suggest structuring the solutioning doc around **implementation sessions**, not individual findings. Many findings share files and can be batched:

```
Session 1: Shell Fixes (F-001, F-005, F-014, F-021, F-022) → 3-4 files
Session 2: Universal CTA Wiring (F-002, F-003, F-056) → all page files  
Session 3: Services Index Rebuild (F-004) → 1 file rewrite
Session 4: Per-Page Structural (F-006-010, F-015-018) → targeted edits
Session 5: Navigation & Content Alignment (F-023-050) → many small changes
Session 6: Component Extraction (F-051-055) → new shared components
Session 7: Polish & Edge Cases (F-059-100) → lower priority sweep
```

Each session should specify: files touched, exact changes, acceptance criteria, and which findings it resolves.

---

That's everything. The master doc plus the context pack above should give the new chat complete situational awareness to build an effective solutioning doc. Ready when you are.