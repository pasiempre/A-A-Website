# Solutioning Framework v1.0

## Decision Resolutions

| ID | Decision | Resolution | Impact |
|----|----------|------------|--------|
| **D-05** | Deprecate `#F1F0EE` warm bg | **Yes — deprecate.** Standardize on `#FAFAF8` for body/section bg. Visual diff is subtle (warm beige → clean off-white). | Affects ~3 page `<main>` backgrounds |
| **D-07** | Hutto inclusion | **Keep 6 cities, exclude Hutto.** Remove from FAQ wording to match. Document the `.slice(0, 6)` with a comment so it's not mysterious. | F-037 becomes "align FAQ to 6" instead of "expand to 7" |
| **D-01** | `/industries` index page | **Yes — create it.** Fixes industry breadcrumb dead-end (F-030), gives footer a real route. | New file, ~Session 5 |
| **D-04** | Contact in header nav | **Defer — phone number in nav covers it.** No change to `primaryLinks`. | No work |
| **D-02** | Exit intent scope | **Move to PublicChrome.** Sub-page direct-landing visitors (likely the majority from search) currently never see it. Add a "shown once per session" guard. | F-071 → Session 7 |
| **D-03** | Testimonials | **Placeholder with role-only attribution for now.** Remove fake company names ("Top-Tier Construction" etc.) to avoid trust issues. Replace with "General Contractor, Austin TX" pattern. Swap for real quotes when available. | F-047 → Session 5 |
| **D-10** | ErrorBoundary strategy | **Defer to Session 7.** Current wrapping is functional enough. | F-084 → Session 7 |
| **D-11** | Contact mobile sidebar order | **Defer to Session 7.** | F-087 → Session 7 |
| **D-12** | Image quality | **75 everywhere for now.** Optimize later with measured performance data. | F-077 → Session 7 |

---

## Session Plan Overview

| Session | Focus | Findings Resolved | Files Touched | Depends On |
|---------|-------|-------------------|---------------|------------|
| **1** | Shell & Infrastructure | F-001, F-005, F-011, F-013, F-014, F-021, F-034 | ~8 | None |
| **2** | Universal CTA Wiring | F-002, F-003, F-056 | ~12 | Session 1 |
| **3** | Services Index Rebuild | F-004, F-027, F-041 | 1 rewrite + data | Session 1 & 2 patterns |
| **4** | Per-Page Structural | F-006–F-010, F-012, F-015–F-019, F-022 | ~10 | Session 1 |
| **5** | Nav, Content & Data Alignment | F-023–F-050 (subset) | ~15 | Sessions 1–3 |
| **6** | Component Extraction (DRY) | F-051–F-055 | 4 new + ~10 modified | Sessions 1–4 |
| **7** | Polish, Edge Cases, New Findings | F-059–F-100, D-02, D-10 | ~12 | All prior |

---

## Session 1: Shell & Infrastructure Fixes

**Goal:** Fix the structural wrapper issues that cascade into every page, harden header behavior, and clean up the global sticky bar — so every subsequent session works on a correct foundation.

### 1A · Delete `PublicPageShell` → F-001

**Current state:** `PublicPageShell` is a 3-line component applying `max-w-7xl px-4 py-16 md:px-6 md:py-20`. Five pages import it and wrap their content in it.

**Problem:** The `py-16 md:py-20` stacks with page-level `pt-32` header clearance (yielding ~192px top gap) and PublicChrome's `pb-24` (yielding ~256px bottom gap on mobile). The `max-w-7xl` clips full-bleed dark hero sections on service-area hub, contact, and FAQ.

**Change:**

| File | Action |
|------|--------|
| `PublicPageShell.tsx` | **Delete file** |
| `faq/page.tsx` | Remove `<PublicPageShell>` wrapper. Content renders inside `<main>` directly. Verify `pt-28 md:pt-36` or equivalent header clearance exists at page level (check what other working pages like About use). |
| `service-area/page.tsx` | Same — remove wrapper. Page has a dark hero section that needs to go full-bleed. |
| `contact/page.tsx` | Same — remove wrapper. Dark hero needs full-bleed. Also remove any page-level `pb-24` if present (see 1D). |
| `privacy/page.tsx` | Remove wrapper. These are text-heavy pages — they should apply their own `max-w-4xl mx-auto px-6` to the inner content block, not the outer `<main>`. |
| `terms/page.tsx` | Same as privacy. |

**Acceptance criteria:**
- `PublicPageShell.tsx` does not exist
- Zero imports of `PublicPageShell` across the codebase
- All 5 affected pages render with correct header clearance (no content behind fixed header)
- Full-bleed dark hero sections on service-area hub, contact, FAQ extend edge-to-edge
- No visible double-padding on any page at 375px mobile viewport

**Files I need next:** `faq/page.tsx`, `service-area/page.tsx`, `contact/page.tsx`, `privacy/page.tsx`, `terms/page.tsx` — to write exact line-level changes for each.

---

### 1B · Expand `forceSolidHeader` → F-005

**Current state in `PublicHeader.tsx`:**
```typescript
const forceSolidHeader =
  pathname === "/privacy" ||
  pathname === "/terms" ||
  pathname === "/faq" ||
  pathname === "/about" ||
  pathname === "/careers" ||
  pathname === "/service-area" ||
  pathname.startsWith("/service-area/");
```

**Problem:** `/services` (light bg, no hero) and `/services/*` (warm bg, breadcrumb text) both start with light content under a transparent header. Text is invisible.

**Change:** Add two conditions:
```typescript
pathname === "/services" ||
pathname.startsWith("/services/") ||
```

**No change for `/contact` or `/industries/*`** — both have dark hero sections where transparent header works. Re-evaluate after F-001 shell removal if contact page layout changes.

**Acceptance criteria:**
- `/services` and any `/services/*` route show solid navy header on initial load (before scroll)
- No regression on existing forced-solid pages
- `/contact` and `/industries/*` retain transparent header behavior

---

### 1C · Header Touch Target & Height Fixes → F-011, F-013

**F-011 — Mobile nav links:**
Current: `py-3` on `text-[13px]` ≈ 37px total height.
Change: Add `min-h-[44px]` to mobile nav link classes. Affects two groups in `PublicHeader.tsx`:
- The "Explore" section links (`About`, `Service Area`) — currently `px-4 py-3 text-[13px]`
- The "Resources" section links (`FAQ`, `Careers`) — same classes
- The `<summary>` elements in Services/Industries `<details>` — currently `px-4 py-3 text-[13px]`
- The dropdown sub-links — currently `px-3 py-2 text-sm`

Add `min-h-[44px] flex items-center` to all interactive mobile nav elements.

**F-013 — Desktop call button:**
Current in desktop CTAs section:
```
className="hidden min-h-[40px] items-center rounded-lg ..."
```
Change: `min-h-[40px]` → `min-h-[44px]`

**Acceptance criteria:**
- All mobile nav interactive elements measure ≥ 44px touch target height
- Desktop call button measures ≥ 44px

---

### 1D · Sticky Bar Semantic Labeling → F-014

**Current state:** The mobile sticky bar `<div>` in `PublicChrome.tsx` has no `role` or `aria-label`.

**Change:** Add to the sticky bar container:
```
role="toolbar" aria-label="Quick actions"
```

**Acceptance criteria:** Screen reader announces "Quick actions toolbar" when encountering the sticky bar.

---

### 1E · Remove Duplicate Bottom Padding → F-021

**Current state:** `PublicChrome` wraps children in `pb-24 md:pb-0`. Individual pages (at minimum `contact/page.tsx`) add their own `pb-24 md:pb-0` on `<main>`. Body CSS adds `padding-bottom: env(safe-area-inset-bottom)`. The sticky bar itself is only ~68px.

**Change:** After removing `PublicPageShell` (1A), audit each page for redundant `pb-24`. Remove from any page-level `<main>` element. PublicChrome's wrapper is the single source of bottom clearance.

**Files to check:** All public page files. Contact confirmed. Others need verification during implementation.

**Acceptance criteria:**
- Only ONE source of bottom padding for sticky bar clearance: `PublicChrome`'s `pb-24 md:pb-0`
- No page-level `<main>` has `pb-24`
- Sticky bar doesn't overlap content on any page at 375px

---

### 1F · Fix Hardcoded Copyright Year → F-034

**Current state in `PublicHeader.tsx` mobile menu:**
```
<p className="mt-1 text-slate-400">© 2026 {COMPANY_SHORT_NAME}</p>
```

**Change:**
```
<p className="mt-1 text-slate-400">© {new Date().getFullYear()} {COMPANY_SHORT_NAME}</p>
```

Matches footer pattern in `FooterSection.tsx`.

---

### Session 1 Summary

| Finding | Change Type | LOE |
|---------|------------|-----|
| F-001 | Delete 1 file, modify 5 files | S |
| F-005 | 2 lines added | XS |
| F-011 | Class changes on ~8 elements | S |
| F-013 | 1 class change | XS |
| F-014 | 2 attributes added | XS |
| F-021 | Remove redundant classes across pages | S |
| F-034 | 1 line change | XS |

**Estimated scope:** Small. All changes are isolated class/attribute edits or wrapper removal. No logic changes. No new components.

---

## Sessions 2–7: What I Need to Proceed

For each subsequent session, I need the representative files to write precise specs:

| Session | Files Needed |
|---------|-------------|
| **2** (CTA Wiring) | One service detail page (e.g. `post-construction-cleaning/page.tsx`), `industries/[slug]/page.tsx`, `service-area/[slug]/page.tsx`, `about/page.tsx` |
| **3** (Services Index) | `services/page.tsx`, `data/services.ts` |
| **4** (Per-Page Structural) | `faq/page.tsx`, `careers/page.tsx`, `FAQSection.tsx`, `ServicePageHardening.tsx` |
| **5** (Nav/Content) | `FooterSection.tsx`, `service-areas.ts`, `faq-items.ts` |
| **6** (DRY Extraction) | After Sessions 1–4 establish patterns, I'll identify exact extraction points |

---

# Solutioning Document v1.0

## Decision Log

| ID | Resolution | Rationale |
|----|-----------|-----------|
| D-01 | **Create `/industries` index page** | Fixes breadcrumb dead-end (F-030), gives footer a real route. Minimal page — Session 5. |
| D-02 | **Move exit intent to PublicChrome** | Sub-page direct-landing visitors (search traffic) currently never see it. Add "once per session" guard. Session 7. |
| D-03 | **Placeholder with role-only attribution** | Remove fake company names. Use "General Contractor, Austin TX" pattern. Swap for real quotes when available. |
| D-04 | **No change** | Phone number in header covers contact access. |
| D-05 | **Deprecate `#F1F0EE`** | Standardize on `#FAFAF8`. Visual diff is subtle. |
| D-07 | **Keep 6 cities, exclude Hutto from pills and FAQ wording** | Keep Hutto page for SEO. Align FAQ text to the 6 featured cities. Document `.slice(0,6)` with a comment. |
| D-10 | **Defer to Session 7** | Current ErrorBoundary wrapping is functional. |
| D-11 | **Defer to Session 7** | Contact mobile reorder is a polish item. |
| D-12 | **75 everywhere for now** | Optimize later with measured data. |

---

## Session Overview

| Session | Focus | Findings | Files | Depends On |
|---------|-------|----------|-------|------------|
| 1 | Shell & Infrastructure | F-001, F-005, F-011, F-013, F-014, F-021, F-034 | ~8 | None |
| 2 | Universal CTA Wiring | F-002, F-003, F-056 | ~12 | Session 1 |
| 3 | Services Index Rebuild | F-004, F-027, F-041 | 2 | Sessions 1–2 |
| 4 | Per-Page Structural | F-006–F-010, F-012, F-015–F-020, F-022 | ~10 | Session 1 |
| 5 | Nav, Content & Data | F-023–F-050, D-01 | ~15 | Sessions 1–3 |
| 6 | Component Extraction | F-051–F-055 | ~14 | Sessions 1–4 |
| 7 | Polish & Edge Cases | F-059–F-100 | ~12 | All prior |

---

## Session 1: Shell & Infrastructure

**Goal:** Remove the structural wrapper breaking layouts, harden header behavior, and fix global padding/a11y issues so every subsequent session builds on a correct foundation.

### 1A · Delete PublicPageShell → F-001

**Delete** `PublicPageShell.tsx`

**Problem recap:** The shell wraps content in `max-w-7xl px-4 py-16 md:py-20`. This clips full-bleed sections AND stacks padding with page-level header clearance and PublicChrome's `pb-24`.

**Per-file changes for pages that import it:**

**`faq/page.tsx`** — Remove `<PublicPageShell>` import and wrapper. The rendered structure changes from:

```
PublicPageShell (max-w-7xl px-4 py-16)
  └ main (pb-24)
      └ section (pt-32)  ← 192px total top gap
```

To:

```
main (bg-[#FAFAF8])     ← direct child of PublicChrome wrapper
  └ section (pt-28 md:pt-36)  ← normalized header clearance
```

Specific changes:
- Remove `import { PublicPageShell }` line
- Remove `<PublicPageShell>` and `</PublicPageShell>` wrapper
- Change `<main className="pb-24 md:pb-0">` to `<main className="bg-[#FAFAF8]">` (remove redundant padding per F-021, add standard bg)
- Normalize hero `pt-32 md:pt-40` to `pt-28 md:pt-36` to match About/Careers pattern

**`service-area/page.tsx`, `contact/page.tsx`, `privacy/page.tsx`, `terms/page.tsx`** — Same pattern: remove import, remove wrapper, ensure `<main>` has appropriate `pt-28 md:pt-36` header clearance on first content section, remove any `pb-24 md:pb-0` from `<main>`. For privacy/terms (text-heavy pages), move `max-w-4xl mx-auto px-6` to the inner content block instead of relying on the shell's constraint.

### 1B · Expand forceSolidHeader → F-005

In `PublicHeader.tsx`, add two conditions to the `forceSolidHeader` block:

```typescript
const forceSolidHeader =
  pathname === "/privacy" ||
  pathname === "/terms" ||
  pathname === "/faq" ||
  pathname === "/about" ||
  pathname === "/careers" ||
  pathname === "/services" ||               // ← ADD
  pathname.startsWith("/services/") ||      // ← ADD
  pathname === "/service-area" ||
  pathname.startsWith("/service-area/");
```

### 1C · Mobile Nav Touch Targets → F-011

In `PublicHeader.tsx`, add `min-h-[44px] flex items-center` to all interactive mobile nav elements. Four groups need it:

**`<details>` summaries** (Services, Industries):
```
className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[13px] font-medium text-white"
```
→ Add `min-h-[44px]` to the className.

**Dropdown sub-links** inside `<details>`:
```
className="block rounded-lg px-3 py-2 text-sm text-slate-200 ..."
```
→ Change to `flex min-h-[44px] items-center rounded-lg px-3 text-sm text-slate-200 ...` (replace `block` with `flex items-center`, remove `py-2`, add `min-h-[44px]`).

**Standalone nav links** (About, Service Area, FAQ, Careers):
```
className="block rounded-xl px-4 py-3 text-[13px] font-medium text-white/95 ..."
```
→ Add `min-h-[44px]` and change `block` to `flex items-center`.

### 1D · Desktop Call Button Height → F-013

In `PublicHeader.tsx` desktop CTAs section, change:
```
className="hidden min-h-[40px] items-center rounded-lg ..."
```
→ `min-h-[44px]`

### 1E · Sticky Bar Semantics → F-014

In `PublicChrome.tsx`, add to the sticky bar container div:
```
role="toolbar" aria-label="Quick actions"
```

### 1F · Remove Redundant Bottom Padding → F-021

Remove `pb-24 md:pb-0` from every page-level `<main>`. PublicChrome's wrapper is the single source.

| File | Current `<main>` classes | Change |
|------|------------------------|--------|
| `about/page.tsx` | `bg-[#FAFAF8] pb-24 md:pb-0` | `bg-[#FAFAF8]` |
| `industries/[slug]/page.tsx` | `bg-[#FAFAF8] pb-24 md:pb-0` | `bg-[#FAFAF8]` |
| `careers/page.tsx` | `bg-[#FAFAF8] pb-24 md:pb-0` | `bg-[#FAFAF8]` |
| `faq/page.tsx` | `pb-24 md:pb-0` (inner main) | Remove entirely (handled in 1A) |
| `contact/page.tsx` | Verify and remove if present | — |

### 1G · Dynamic Copyright Year → F-034

In `PublicHeader.tsx` mobile menu footer:
```
<p className="mt-1 text-slate-400">© 2026 {COMPANY_SHORT_NAME}</p>
```
→
```
<p className="mt-1 text-slate-400">© {new Date().getFullYear()} {COMPANY_SHORT_NAME}</p>
```

### Session 1 Acceptance Criteria
- `PublicPageShell.tsx` deleted, zero imports anywhere
- All previously-wrapped pages render full-bleed dark sections edge-to-edge
- No visible double-padding on any page at 375px viewport
- `/services` and `/services/*` show solid header before scroll
- All mobile nav elements ≥ 44px touch target
- Desktop call button ≥ 44px
- Sticky bar announces "Quick actions toolbar" to screen readers
- Copyright year is dynamic in mobile menu

---

## Session 2: Universal CTA Wiring

**Goal:** Replace every broken quote Link and untracked tel: anchor across all sub-pages with `QuoteCTA` / `CTAButton`, connecting to the FloatingQuotePanel already mounted via PublicChrome.

### Required Imports Per Page

Every page getting CTA wiring needs (if not already present):

```typescript
import { QuoteCTA } from "@/components/public/variant-a/QuoteCTA";
import { CTAButton } from "@/components/public/variant-a/CTAButton";
import { COMPANY_PHONE, COMPANY_PHONE_E164 } from "@/lib/company";
```

### Master CTA Replacement Table

**Pattern A — Quote CTA (opens panel):**
```
// Before:
<Link href="/#quote-request" className="cta-primary px-8 py-4">Request a Quote</Link>

// After:
<QuoteCTA ctaId="{page}_{location}_quote" serviceType="{type}" className="cta-primary px-8 py-4">
  Request a Quote
</QuoteCTA>
```

**Pattern B — Call CTA (tracked tel: link):**
```
// Before:
<a href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark px-8 py-4">Call {COMPANY_PHONE}</a>

// After:
<CTAButton ctaId="{page}_{location}_call" actionType="call" href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark px-8 py-4">
  Call {COMPANY_PHONE}
</CTAButton>
```

**Pattern C — Text-style call link (closing sections):**
```
// Before:
<a href={`tel:${...}`} className="text-sm font-semibold uppercase tracking-wide text-slate-300 ...">
  Or call {COMPANY_PHONE}
</a>

// After:
<CTAButton ctaId="{page}_closing_call" actionType="call" href={`tel:${...}`}
  className="min-h-0 text-sm font-semibold uppercase tracking-wide text-slate-300 transition hover:text-white">
  Or call {COMPANY_PHONE}
</CTAButton>
```

Note: `min-h-0` overrides CTAButton's built-in `min-h-[44px]` for text-style links where the button sizing is inappropriate.

### Per-File CTA Map

#### `services/post-construction-cleaning/page.tsx`

| Location | Current | Replace | ctaId | serviceType |
|----------|---------|---------|-------|-------------|
| Hero quote | `<Link href="/#quote-request" className="cta-primary px-8 py-4">` | Pattern A | `post_construction_hero_quote` | `construction` |
| Hero call | `<a href={tel:} className="cta-outline-dark px-8 py-4">` | Pattern B | `post_construction_hero_call` | — |
| Closing quote | `<Link href="/#quote-request" className="cta-gold px-8 py-4">` | Pattern A (cta-gold) | `post_construction_closing_quote` | `construction` |
| Closing call | `<a href={tel:} className="text-sm font-semibold ...">` | Pattern C | `post_construction_closing_call` | — |

**Other 4 service detail pages** (`final-clean`, `commercial-cleaning`, `move-in-move-out-cleaning`, `windows-power-wash`): Same pattern. Use respective serviceType:

| Page | serviceType |
|------|-------------|
| final-clean | `construction` |
| commercial-cleaning | `commercial` |
| move-in-move-out-cleaning | `turnover` |
| windows-power-wash | `specialty` |

#### `industries/[slug]/page.tsx`

| Location | Current | Replace | ctaId | serviceType |
|----------|---------|---------|-------|-------------|
| Hero quote | `<Link href={/?serviceType=${defaultService}#quote-request} className="cta-primary min-h-[48px]">` | Pattern A | `` `industry_${industry.slug}_hero_quote` `` | `{defaultService}` |
| Hero call | `<a href={tel:} className="cta-outline-dark min-h-[48px] border-white/30 ...">` | Pattern B (keep dark-bg overrides) | `` `industry_${industry.slug}_hero_call` `` | — |
| Closing quote | `<Link href={/?serviceType=...} className="cta-gold min-h-[48px]">` | Pattern A (cta-gold) | `` `industry_${industry.slug}_closing_quote` `` | `{defaultService}` |
| Closing call | `<a href={tel:} className="cta-outline-dark min-h-[48px] border-white/35 ...">` | Pattern B (keep dark-bg overrides) | `` `industry_${industry.slug}_closing_call` `` | — |

Since the page is a server component rendering client components — this works directly. `industry.slug` and `defaultService` are server-side values passed as props.

#### `service-area/[slug]/page.tsx`

| Location | Current | Replace | ctaId | serviceType |
|----------|---------|---------|-------|-------------|
| Hero quote | `<Link href="/#quote-request" className="cta-primary px-8 py-4">` | Pattern A | `` `city_${location.slug}_hero_quote` `` | — (general) |
| Hero call | `<a href={tel:} className="cta-outline-dark px-8 py-4">` | Pattern B | `` `city_${location.slug}_hero_call` `` | — |
| Closing quote | `<Link href="/#quote-request" className="cta-gold px-8 py-4">` | Pattern A (cta-gold) | `` `city_${location.slug}_closing_quote` `` | — |
| Closing call | `<a href={tel:} className="text-sm font-semibold ...">` | Pattern C | `` `city_${location.slug}_closing_call` `` | — |

#### `about/page.tsx`

| Location | Current | Replace | ctaId | serviceType |
|----------|---------|---------|-------|-------------|
| Closing quote | `<Link href="/#quote-request" className="cta-gold min-h-[48px]">` | Pattern A | `about_closing_quote` | — |
| Closing call | `<a href={tel:} className="cta-outline-dark min-h-[48px] border-white/35 ...">` | Pattern B | `about_closing_call` | — |

#### `faq/page.tsx`

| Location | Current | Replace | ctaId |
|----------|---------|---------|-------|
| Hero call | `<a href={tel:} className="inline-flex ... bg-[#0A1628] ... rounded-lg ...">` | Pattern B (restyle to `cta-primary` per F-006) | `faq_hero_call` |
| CTA band call | `<a href={tel:} className="cta-primary inline-flex ...">` | Pattern B | `faq_cta_call` |
| Contact CTA quote | `<Link href="/contact" className="inline-flex ... bg-[#0A1628] ... rounded-lg ...">` | Pattern A (restyle per F-006) | `faq_closing_quote` |

#### `careers/page.tsx`

| Location | Current | Replace | ctaId |
|----------|---------|---------|-------|
| Sidebar call | `<a href={tel:} className="cta-outline-dark min-h-[44px]">` | Pattern B | `careers_sidebar_call` |
| Bottom quote | `<Link href="/#quote-request" className="font-semibold text-[#2563EB]">` | Pattern A (inline text-link style) | `careers_bottom_quote` |

#### `service-area/page.tsx` (hub — file not provided, spec from findings)

| Location | Current | Replace | ctaId |
|----------|---------|---------|-------|
| Coverage CTA | `<Link href="/contact">` | Pattern B with `actionType="link"` | `service_area_hub_coverage` |

This is F-056 — the intent (coverage inquiry) is different from a standard quote, but still needs tracking. Use:
```
<CTAButton ctaId="service_area_hub_coverage" actionType="link" href="/contact" className="...">
  Request Coverage Info
</CTAButton>
```

### Session 2 Acceptance Criteria
- Zero `<Link href="/#quote-request">` or `<Link href="/?serviceType=...#quote-request">` on any sub-page
- Zero raw `<a href="tel:">` on any sub-page
- Every quote CTA opens FloatingQuotePanel in-page (no navigation)
- Every call CTA fires `trackConversionEvent` before following the tel: link
- `serviceType` pre-fills correctly on service detail pages and industry pages
- Analytics dashboard shows `cta_click` events with distinct `cta_id` values

---

## Session 3: Services Index Rebuild

**Goal:** Replace the non-functional placeholder with a fully-built services index page using established design system patterns.

### 3A · Add `href` to SERVICES Data → F-033 (partial)

In `data/services.ts`, add `href` to `ServiceData` type and all entries:

```typescript
export type ServiceData = {
  // ...existing fields
  href: string;  // ADD
};
```

Values (derived from `SERVICE_MENU_LINKS`):

| anchor | href |
|--------|------|
| `service-post-construction` | `/services/post-construction-cleaning` |
| `service-final-clean` | `/services/final-clean` |
| `service-commercial` | `/services/commercial-cleaning` |
| `service-move` | `/services/move-in-move-out-cleaning` |
| `service-windows` | `/services/windows-power-wash` |

This eliminates the need for `SERVICE_LINK_BY_ANCHOR` in `industries/[slug]/page.tsx` (Session 5 will clean that up).

### 3B · Rewrite `services/page.tsx` → F-004, F-027, F-041

**Complete rewrite.** The current file has 13 documented problems. Rather than patching, build from the About page template which is the closest structural match (light bg, no hero image, breadcrumb, system patterns).

```
Structure:
main (bg-[#FAFAF8])
  └ section: breadcrumb + hero text (bg-white, pt-28 md:pt-36)
  └ section: service cards grid (bg-[#FAFAF8])
  └ section: cross-links (bg-white, border-y)
  └ section: closing dark CTA band (bg-[#0A1628])
```

**Detailed spec:**

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: "Cleaning Services | A&A Cleaning Austin TX",
  description: "Post-construction, final clean, commercial, turnover, and exterior cleaning services for Austin contractors, property managers, and commercial teams.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Cleaning Services | A&A Cleaning Austin TX",
    description: "...",
    url: `${getSiteUrl()}/services`,
    type: "website",
  },
};
```

**Structured data:** `BreadcrumbList` + `Service` (as `ItemList` of 5 services). Follow the pattern from post-construction page.

**Breadcrumb UI:**
```
Home / Services (current)
```
Uses same `nav aria-label="Breadcrumb"` pattern as other pages with `mx-auto max-w-7xl px-6 pt-28 md:pt-32`.

**Hero section (bg-white, border-b):**
- Kicker: `.section-kicker` → "Our Services"
- H1: `font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#0A1628]` → "Scopes Built for Contractor Standards and Turnover Timelines"
- Subtitle: `text-lg font-light leading-relaxed text-slate-600 max-w-2xl`

**Service cards grid:**
```
section (bg-[#FAFAF8] py-16 md:py-24)
  └ div (mx-auto max-w-7xl px-6)
      └ div (grid gap-6 md:grid-cols-2 lg:grid-cols-3)
          └ Link cards → each service detail page
```

Each card sources from `SERVICES` data:
```typescript
import { SERVICES } from "@/data/services";
```

Card structure:
```
<Link href={service.href} className="surface-panel group flex h-full flex-col p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2563EB]">{service.packageLabel}</p>
  <h2 className="mt-2 font-serif text-2xl tracking-tight text-[#0A1628] group-hover:text-[#2563EB]">
    {service.titleLines.join(" ")}
  </h2>
  <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.description}</p>
  <div className="mt-4 flex flex-wrap gap-2">
    {service.bullets.map(bullet => (
      <span key={bullet} className="info-chip text-slate-600">{bullet}</span>
    ))}
  </div>
  <span className="mt-auto pt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#2563EB]">
    Learn more <span aria-hidden="true">→</span>
  </span>
</Link>
```

This resolves F-027 (title mismatch) because cards use `service.titleLines` which match the canonical service names, and `service.packageLabel` appears as a kicker for context.

**Cross-links section (bg-white, border-y, py-14):**
Same pattern as FAQ page's "Keep Exploring" section:
```
Industries: General Contractors · Property Managers · Commercial Spaces
Also: Service Area · FAQ · About
```

**Closing dark CTA band:**
Same `bg-[#0A1628]` pattern used on About, post-construction, city template. Quote CTA + call CTA using Session 2 patterns:
```
<QuoteCTA ctaId="services_index_closing_quote" className="cta-gold min-h-[48px]">Get a Quote</QuoteCTA>
<CTAButton ctaId="services_index_closing_call" actionType="call" href={`tel:${COMPANY_PHONE_E164}`}
  className="min-h-0 text-sm font-semibold uppercase tracking-wide text-slate-300 transition hover:text-white">
  Or call {COMPANY_PHONE}
</CTAButton>
```

### Session 3 Acceptance Criteria
- Services index renders 5 linked cards sourced from `SERVICES` data
- Card titles match `titleLines` (canonical names), package labels as kickers
- Every card links to correct `/services/{slug}` detail page
- Breadcrumb, structured data, OG tags all present
- Page uses `max-w-7xl`, `.section-kicker`, `.surface-panel`, `font-serif` headings
- Solid header via Session 1's `forceSolidHeader` update
- Closing CTA opens FloatingQuotePanel via QuoteCTA
- Call CTA tracked via CTAButton
- F-041 resolved: breadcrumb "Services" link now points to a functional page

---

## Session 4: Per-Page Structural Fixes

**Goal:** Fix styling inconsistencies, a11y gaps, SEO missing pieces, and structural issues on individual pages — all the T2 findings that don't involve CTA wiring or shell changes.

### 4A · FAQ Page Styling → F-006, F-007

**F-006 — Hero buttons don't use design system:**

The FAQ hero has three interactive elements with custom styling. After Session 2 wires the CTAs, the remaining issue is the "Browse FAQs" anchor button:

Current:
```
className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-300 text-[#0A1628] rounded-lg hover:border-slate-400 transition-colors font-medium"
```

Change to:
```
className="cta-outline-dark px-6 py-3"
```

The CTA band email button also uses custom styling:
```
className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-white/35 px-6 py-3 text-white ..."
```

Change to:
```
className="cta-light px-6 py-3"
```

**F-007 — Kicker style mismatch:**

In the FAQ hero:
```
<span className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">Quick Answers</span>
```

Change to:
```
<span className="section-kicker">Quick Answers</span>
```

The `.section-kicker` class provides `text-[10px] font-bold uppercase tracking-[0.24em] text-[#2563EB]` — tighter sizing and wider tracking.

### 4B · Careers Page Breadcrumbs & Structured Data → F-008

**Add breadcrumb UI** after the `pt-28 md:pt-36` section opener, before the kicker. Follow About page pattern:

```html
<nav aria-label="Breadcrumb" className="mb-5">
  <ol className="flex items-center gap-2 text-xs text-slate-500">
    <li><Link href="/" className="hover:text-[#0A1628]">Home</Link></li>
    <li aria-hidden="true">/</li>
    <li className="font-semibold text-[#0A1628]">Careers</li>
  </ol>
</nav>
```

**Add structured data** — `BreadcrumbList` + `WebPage`:

```typescript
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Careers", item: `${baseUrl}/careers` },
      ],
    },
    {
      "@type": "WebPage",
      name: "Careers | Join the A&A Cleaning Team",
      url: `${baseUrl}/careers`,
      description: "Apply to join A&A Cleaning...",
    },
  ],
};
```

**Add OG tags** (F-017):
```typescript
openGraph: {
  title: "Careers | Join the A&A Cleaning Team",
  description: "Apply to join A&A Cleaning...",
  url: `${getSiteUrl()}/careers`,
  type: "website",
},
```

### 4C · Industry Template BreadcrumbList Schema → F-009

`industries/[slug]/page.tsx` has `faqSchema` and `serviceSchema` but no `BreadcrumbList`. Add:

```typescript
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
    { "@type": "ListItem", position: 2, name: "Industries", item: `${baseUrl}/industries` },
    { "@type": "ListItem", position: 3, name: industry.title, item: `${baseUrl}/industries/${industry.slug}` },
  ],
};
```

Add a third `<script type="application/ld+json">` block or merge into array with existing schemas.

Note: The `item` for position 2 will point to `/industries` which we're creating in Session 5 (D-01). This is forward-compatible.

### 4D · Container Width Normalization → F-010

| File | Current | Change |
|------|---------|--------|
| `careers/page.tsx` | `max-w-6xl` (×3: header section, form grid, bottom bar) | Change all to `max-w-7xl` |
| `services/page.tsx` | `max-w-5xl` | Handled by Session 3 rewrite |

### 4E · FAQ Filter Buttons A11y → F-012

In `FAQSection.tsx`, two changes to each filter button:

**Add `min-h-[44px]`:**
```
className={`rounded-full px-4 py-2 text-[10px] ...`}
```
→
```
className={`rounded-full min-h-[44px] px-4 py-2 text-[10px] ...`}
```

**Add `aria-pressed`:**
```
<button key={category} type="button" onClick={...} className={...}>
```
→
```
<button key={category} type="button" onClick={...} aria-pressed={filter === category} className={...}>
```

### 4F · Industry Social Proof Missing Heading → F-015

In `industries/[slug]/page.tsx`, the social proof section (dark `bg-[#0A1628]`) has:
```
<p className="section-kicker !text-slate-300">Verified Results</p>
```

Add an `<h2>` after the kicker:
```
<p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A94E]">Verified Results</p>
<h2 className="sr-only">Social Proof and Verified Results</h2>
```

Using `sr-only` because the kicker + blockquote visually communicate the section's purpose, but screen reader heading navigation needs the landmark. Also: replace the `!text-slate-300` override with the gold kicker pattern per F-025 (dark bg = gold kicker).

### 4G · SEO — Weak Page Titles → F-016

| File | Current | Change |
|------|---------|--------|
| `services/page.tsx` | `"Services"` | Handled by Session 3 rewrite |
| `faq/page.tsx` | `"FAQ"` | `"FAQ | A&A Cleaning Services Austin"` |
| `contact/page.tsx` | `"Contact Us"` | `"Contact Us | A&A Cleaning Austin TX"` |

### 4H · Heading Hierarchy in ServicePageHardening → F-018

In `ServicePageHardening.tsx`, the objection title is an `<h2>` and the pricing heading is an `<h3>`. When embedded in a page that already has its own `<h2>` sections, this creates:

```
h1 → h2 (page section) → h2 (ServicePageHardening objection) ← BREAK
```

**Change:** Accept a `baseHeadingLevel` prop (default `2`):

```typescript
type ServicePageHardeningProps = {
  serviceType: "construction" | "commercial" | "turnover" | "specialty";
  startingPrice?: string;
  sla?: string;
  baseHeadingLevel?: 2 | 3;  // ADD
};
```

Internal mappings:
- `baseHeadingLevel=2` → objection title `<h2>`, pricing `<h3>`, FAQ `<h3>` (current default — for standalone use)
- `baseHeadingLevel=3` → objection title `<h3>`, pricing `<h4>`, FAQ `<h4>` (for embedded use within a page that has its own `<h2>` sections)

Service detail pages pass `baseHeadingLevel={2}` (their page sections are already `<h2>`, and ServicePageHardening sections sit at the same level).

Actually — looking at the actual page structure more carefully:

```
h1 "Post-Construction Cleaning in Austin"
  h2 "How Post-Construction Cleaning Works"
  [ServicePageHardening]
    h3 "pricing heading" ← correct
    h2 "objection title" ← should be h2 since it's a peer section
    h3 "FAQ heading" ← correct
  h2 "Ready to schedule..."
```

The fix is simpler — the pricing `<h3>` inside the pricing block should actually be `<h2>` because the pricing block is a top-level section, not nested under the objection title. And the objection title `<h2>` is already correct.

Looking again more carefully at the nesting:

```
<div className="space-y-16 py-16 md:py-24">      ← wrapper
  <section> pricing block                           ← h3 "pricing heading" (should be h2)
  <section> objection modules                       ← h2 "objection title" ✓
  <section> FAQ                                     ← h3 "FAQ heading" (should be h2)
  <section> service areas                           ← h3 "Popular Service Areas" (should be h2)
</section>
```

**Fix:** Change the pricing `<h3>`, FAQ `<h3>`, and service areas `<h3>` to `<h2>`. All four sections inside ServicePageHardening are peer-level sections within the page.

### 4I · Background Color Deprecation → F-019 (partial, per D-05)

Replace `bg-[#F1F0EE]` with `bg-[#FAFAF8]` everywhere:

| File | Element | Current | Change |
|------|---------|---------|--------|
| `post-construction-cleaning/page.tsx` | `<main>` | `bg-[#F1F0EE]` | `bg-[#FAFAF8]` |
| `service-area/[slug]/page.tsx` | `<main>` | `bg-[#F1F0EE]` | `bg-[#FAFAF8]` |
| `service-area/[slug]/page.tsx` | nearby areas section | `bg-[#F1F0EE]` | `bg-[#FAFAF8]` |
| `about/page.tsx` | "By the Numbers" section | `bg-[#F1F0EE]` | `bg-[#FAFAF8]` |
| `FAQSection.tsx` | section bg | `bg-[#F1F0EE]` | `bg-[#FAFAF8]` |
| Other service detail pages (4) | `<main>` | Verify — likely `bg-[#F1F0EE]` | `bg-[#FAFAF8]` |

Also remove `--color-warm: #F1F0EE` from `globals.css` if it exists, or add a comment marking it deprecated.

### 4J · FAQ Accordion Consistency → F-020

Three locations use native `<details>` with no animation:
- `service-area/page.tsx` (hub FAQ)
- `service-area/[slug]/page.tsx` (city FAQ)
- `industries/[slug]/page.tsx` (industry FAQ)

**Approach for now:** Don't extract a shared component yet (that's Session 6). Instead, convert the native `<details>` in these three locations to the controlled `useState` + `grid-rows` pattern used by `FAQSection.tsx` and `ServicePageHardening.tsx`.

This requires making the industry and city template FAQ sections into client-side islands. Since these pages are currently server components, wrap just the FAQ section in a small client component:

**Create** `components/public/variant-a/AccordionFAQ.tsx`:

```typescript
"use client";
import { useState } from "react";

type AccordionFAQProps = {
  items: Array<{ question: string; answer: string }>;
};

export function AccordionFAQ({ items }: AccordionFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="surface-panel overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              aria-controls={`accordion-answer-${index}`}
              className="flex min-h-[48px] w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/50"
            >
              <span className="text-sm font-semibold text-[#0A1628] md:text-base">{item.question}</span>
              <svg aria-hidden="true" viewBox="0 0 20 20"
                className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5.5 7.5 4.5 5 4.5-5" />
              </svg>
            </button>
            <div id={`accordion-answer-${index}`} role="region"
              className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="overflow-hidden">
                <p className="border-t border-slate-200 px-5 py-4 text-sm leading-relaxed text-slate-600">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

Then replace the native `<details>` blocks in city template, industry template, and service-area hub with:
```
<AccordionFAQ items={locationFaqs} />
```
or
```
<AccordionFAQ items={content.faqs} />
```

This is forward-compatible with Session 6 extraction — `AccordionFAQ` becomes the shared component.

### 4K · Mobile Nav No-JS Fallback → F-022

In `PublicHeader.tsx`, add a `<noscript>` block inside the header, after the floating shell div:

```html
<noscript>
  <nav aria-label="Navigation (no JavaScript)" className="bg-[#0f2746] px-6 py-4">
    <ul className="flex flex-wrap gap-4 text-sm text-white">
      <li><a href="/services">Services</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/service-area">Service Area</a></li>
      <li><a href="/faq">FAQ</a></li>
      <li><a href="/careers">Careers</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
</noscript>
```

### Session 4 Acceptance Criteria
- FAQ hero buttons use `cta-primary`, `cta-outline-dark`, or `cta-light` classes
- FAQ kicker uses `.section-kicker` (10px, 0.24em tracking)
- Careers page has breadcrumb UI, `BreadcrumbList` schema, `WebPage` schema, OG tags
- Industry template has `BreadcrumbList` schema
- Careers container width is `max-w-7xl`
- FAQ filter buttons ≥ 44px, have `aria-pressed`
- Industry social proof section has an `<h2>` (sr-only) and gold kicker (no `!important` override)
- FAQ and Contact page titles include brand name and location
- ServicePageHardening headings are all `<h2>` level (peer sections)
- Zero instances of `bg-[#F1F0EE]` in codebase
- All FAQ accordions animate smoothly (no `<details>` snap)
- `<noscript>` nav fallback present for mobile

---

## Session 5: Navigation, Content & Data Alignment

**Goal:** Fix all navigation routing, content inconsistencies, data alignment, and cross-linking gaps across the site.

### 5A · Footer Nav Routes → F-023

In `FooterSection.tsx`, change the Navigate section links:

| Current | Change |
|---------|--------|
| `<Link href="/#services">Services</Link>` | `<Link href="/services">Services</Link>` |
| `<Link href="/#industries">Who We Serve</Link>` | `<Link href="/industries">Who We Serve</Link>` |
| `<Link href="/#about">About</Link>` | `<Link href="/about">About</Link>` |
| `<Link href="/#service-area">Service Area</Link>` | `<Link href="/service-area">Service Area</Link>` |

FAQ, Contact, Privacy, Terms links are already correct (point to dedicated routes).

### 5B · Create `/industries` Index Page → D-01, F-030

**New file:** `app/(public)/industries/page.tsx`

Minimal page following the Services Index pattern from Session 3:

```
Structure:
main (bg-[#FAFAF8])
  └ section: breadcrumb + hero text (bg-white, pt-28 md:pt-36)
  └ section: industry cards (bg-[#FAFAF8])
  └ section: cross-links (bg-white)
  └ section: closing CTA band (bg-[#0A1628])
```

Source from `INDUSTRIES` data:
```typescript
import { INDUSTRIES } from "@/data/industries";
```

Three cards linking to `/industries/{slug}`. Each card shows title, description, and a "Learn more →" link.

**Metadata:**
```typescript
title: "Industries We Serve | A&A Cleaning Austin TX",
description: "Cleaning services for general contractors, property managers, and commercial space operators across Austin.",
```

Add `/industries` to `forceSolidHeader` in `PublicHeader.tsx`:
```typescript
pathname === "/industries" ||
```

### 5C · Fix Industry Breadcrumb → F-030

In `industries/[slug]/page.tsx`, change:
```
<Link href="/#industries" className="hover:text-white">Industries</Link>
```
→
```
<Link href="/industries" className="hover:text-white">Industries</Link>
```

### 5D · Dark-Context CTA Class Usage → F-024

Three pages override `.cta-outline-dark` with inline dark-bg styles instead of using `.cta-light`. In:
- `about/page.tsx` closing section
- `industries/[slug]/page.tsx` hero + closing section
- `service-area/page.tsx` (once file is provided)

Replace pattern:
```
className="cta-outline-dark min-h-[48px] border-white/35 text-white hover:bg-white hover:text-[#0A1628]"
```
→
```
className="cta-light min-h-[48px]"
```

Verify `.cta-light` in `globals.css` produces the correct appearance (glass border, white text, fills white on hover). If it doesn't perfectly match, adjust `.cta-light` definition rather than continuing inline overrides.

### 5E · Kicker Override on Dark Background → F-025

In `industries/[slug]/page.tsx` social proof section:
```
<p className="section-kicker !text-slate-300">Verified Results</p>
```
→
```
<p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A94E]">Verified Results</p>
```

Rule documented: Light bg → `.section-kicker` (blue). Dark bg → inline gold kicker. No `!important` overrides.

### 5F · Surface All 5 Services on Area Pages → F-026

In `service-area/[slug]/page.tsx` and `service-area/page.tsx`, the services list is hardcoded to 3 (Post-Construction, Turnover, Commercial). Missing: Final Clean and Windows & Power Wash.

**Change:** Import from data source:
```typescript
import { SERVICES } from "@/data/services";
```

Replace hardcoded array with:
```typescript
const areaServices = SERVICES.map(service => ({
  title: service.titleLines.join(" "),
  body: service.description,
  href: service.href,
}));
```

Render 5 cards. Adjust grid: `md:grid-cols-3 lg:grid-cols-5` or keep `md:grid-cols-3` and let 2 wrap to next row — whichever looks cleaner.

### 5G · Contact Page City Chips → F-028

In `contact/page.tsx`, city names rendered as `<span>` should become `<Link>` elements:
```typescript
import { HOMEPAGE_SERVICE_AREA_LINKS } from "@/lib/service-areas";
```

Replace static chips with linked chips sourcing from `HOMEPAGE_SERVICE_AREA_LINKS`.

### 5H · Careers Page Closing Dark CTA Band → F-029

`careers/page.tsx` ends with a thin white bar. Add a closing dark CTA band matching other pages:

```html
<section className="bg-[#0A1628] py-14 text-center md:py-18">
  <div className="mx-auto max-w-4xl px-6">
    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A94E]">Join the Team</p>
    <h2 className="mt-3 font-serif text-3xl tracking-tight text-white md:text-4xl">
      Ready to work with a crew that values quality?
    </h2>
    <p className="mx-auto mt-4 max-w-2xl text-slate-300">
      Submit your application above, or call us to learn more about open roles.
    </p>
    <div className="mt-7">
      <CTAButton ctaId="careers_closing_call" actionType="call" href={`tel:${COMPANY_PHONE_E164}`} className="cta-light min-h-[48px]">
        Call {COMPANY_PHONE}
      </CTAButton>
    </div>
  </div>
</section>
```

### 5I · Response Time Consistency → F-032

In `service-areas.ts`, Georgetown, Kyle, San Marcos, and Hutto have `responseWindow: "< 90 min"`. All other cities and homepage/FAQ claim "< 1 hour" or "within one hour."

**Decision:** Standardize to "< 90 min" for the farther cities (honest) but change the FAQ answer to say:

```
"We respond to quote requests within one hour during business hours for the central Austin metro. Response windows for outlying areas like Georgetown, Kyle, and San Marcos may be up to 90 minutes."
```

In `faq-items.ts`, update the "How quickly can you start a project?" answer to include this nuance.

### 5J · Hutto FAQ Alignment → D-07, F-037

In `faq-items.ts`, the "What areas do you serve?" answer currently lists:

```
"...including Round Rock, Pflugerville, Georgetown, Hutto, Buda, Kyle, and San Marcos."
```

Change to:
```
"...including Round Rock, Pflugerville, Georgetown, Buda, Kyle, and San Marcos. We also cover other communities in the corridor — reach out if your project is outside these areas."
```

This aligns with the 6-city pill display. Hutto's dedicated page remains live for SEO.

Add a documenting comment in `service-areas.ts`:
```typescript
// Display the first 6 cities on homepage/service pills. Hutto (index 6) retains
// its own city page for organic search but is excluded from featured navigation.
export const HOMEPAGE_SERVICE_AREA_LINKS = SERVICE_AREA_CITIES.slice(0, 6).map(...)
```

### 5K · Fix "Se Habla Espanol" Accent → F-045

In `industries/[slug]/page.tsx`, two instances:
```
Se Habla Espanol
```
→
```
Se Habla Español
```

### 5L · Footer "Built For" Chip Labels → F-046

In `FooterSection.tsx`:
```
<li className="info-chip-dark">Contractors</li>
<li className="info-chip-dark">Property Teams</li>
```
→
```
<li className="info-chip-dark">General Contractors</li>
<li className="info-chip-dark">Property Managers</li>
```

Matches industry page titles and nav labels.

### 5M · Testimonial Anonymization → F-047 (per D-03)

In `industries/[slug]/page.tsx`, within `INDUSTRY_PAGE_CONTENT`, change all three `socialProof` blocks:

| Current | Change |
|---------|--------|
| `name: "Marcus Torres"` | `name: "Project Manager"` |
| `role: "Project Manager, Top-Tier Construction"` | `role: "General Contractor, Austin TX"` |
| `name: "James Rodriguez"` | `name: "Operations Director"` |
| `role: "Operations Director, Prestige Developments"` | `role: "Property Management, Austin TX"` |
| `name: "David Chen"` | `name: "Site Superintendent"` |
| `role: "Site Superintendent, BuildCo Partners"` | `role: "Commercial Operations, Austin TX"` |

### 5N · About Page Missing Careers Link → F-039

In `about/page.tsx`, in the "Who We Work With" cross-links section at the bottom, add:
```
<Link href="/careers" className="font-semibold text-[#2563EB]">Careers</Link>
```

### 5O · Service Cross-Links → F-038, F-040

In all 5 service detail pages, add a "Related Services" section before the closing dark CTA band. Source from `SERVICES` data, excluding the current page:

```typescript
const relatedServices = SERVICES.filter(s => s.href !== PAGE_PATH).slice(0, 3);
```

Render as a simple 3-card grid linking to sibling service pages.

### 5P · Header primaryLinks → F-042 (partial)

Per D-04, we're NOT adding Contact to the header. However, the `primaryLinks` array still routes to homepage anchors:

```typescript
{ href: "/#services", label: "Services" },
{ href: "/#industries", label: "Industries" },
```

Change to:
```typescript
{ href: "/services", label: "Services" },
{ href: "/industries", label: "Industries" },
```

Note: The Services and Industries items in the header use dropdown menus, not these `primaryLinks` entries directly. The `primaryLinks` array is used for the `slice(2)` set: About, Service Area, FAQ, Careers. But it's still good practice to have the correct hrefs in case `primaryLinks` is used elsewhere.

### 5Q · Company Stats Centralization → F-048, F-083

Create or update `lib/company.ts` to include:

```typescript
export const COMPANY_STATS = {
  projectsDelivered: "500+",
  yearsExperience: "15+",
  responseTarget: "1hr",
  executionStandard: "100%",
} as const;
```

Update `about/page.tsx` "By the Numbers" section and `service-area/page.tsx` to source from `COMPANY_STATS` instead of hardcoded values.

### Session 5 Acceptance Criteria
- Footer links route to `/services`, `/industries`, `/about`, `/service-area` — not homepage anchors
- `/industries` index page exists with 3 linked cards
- Industry breadcrumb links to `/industries` (not `/#industries`)
- Dark-bg CTAs use `.cta-light` — no inline overrides
- Dark-bg kickers are gold — no `!important` overrides
- All 5 services appear on service area pages
- Contact city chips are links
- Careers page has closing dark CTA band
- Response times documented with metro/outlying distinction
- FAQ "areas served" lists 6 cities (no Hutto)
- "Se Habla Español" properly accented
- Footer "Built For" matches industry titles
- Testimonials use role-only attribution
- About page links to careers
- Service pages link to sibling services
- Company stats sourced from `COMPANY_STATS`

---

## Session 6: Component Extraction (DRY)

**Goal:** Extract repeated patterns into shared components, reducing duplication and ensuring consistency for future changes.

### 6A · Closing CTA Band → F-051

**New file:** `components/public/variant-a/ClosingCTABand.tsx`

```typescript
type ClosingCTABandProps = {
  kicker: string;
  headline: string;
  body: string;
  quoteCtaId: string;
  callCtaId: string;
  serviceType?: string;
  children?: React.ReactNode;  // for additional content below CTAs (cross-links, etc.)
};
```

Renders the standard `bg-[#0A1628] py-14 text-center md:py-18` section with gold kicker, serif headline, slate body, gold QuoteCTA + call CTAButton (or light CTA), and optional children slot for cross-links.

**Replace in:** post-construction, city template, industry template, about, FAQ, service-area hub. ~6 replacements.

### 6B · Breadcrumb → F-052

**New file:** `components/public/variant-a/Breadcrumb.tsx`

```typescript
type BreadcrumbItem = {
  label: string;
  href?: string;  // omit for current page
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  variant?: "light" | "dark";  // light = slate-500 text, dark = slate-300 text for dark heroes
};
```

Renders `<nav aria-label="Breadcrumb">` with the standard `ol > li` pattern. Current page is `font-semibold` with appropriate text color.

**Replace in:** all sub-pages (~8 templates). Two variants:
- `"light"` (default): used on About, Careers, FAQ, Services, service detail pages, city pages
- `"dark"`: used on industry pages (white text on dark hero)

### 6C · Cross-Links → F-053

**New file:** `components/public/variant-a/CrossLinks.tsx`

```typescript
type CrossLinksProps = {
  prefix?: string;  // "Need role-specific guidance?" etc.
  links: Array<{ href: string; label: string }>;
};
```

Renders the inline text-link pattern used at the bottom of FAQ sections, city pages, about page.

**Replace in:** city template, service-area hub, FAQ page, industry template. ~4 replacements.

### 6D · Service Cards for Area Pages → F-054

Partially handled by Session 5F (data-driven instead of hardcoded). If the rendering pattern is still duplicated between hub and city template after 5F, extract to:

**New file:** `components/public/variant-a/AreaServiceCards.tsx`

Sources from `SERVICES` data and renders the linked card grid.

### 6E · Structured Data Helpers → F-055

**New file:** `lib/structured-data.ts`

```typescript
export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) { ... }
export function buildServiceSchema(opts: { name: string; description: string; url: string; areaServed?: string }) { ... }
export function buildFAQSchema(items: Array<{ question: string; answer: string }>) { ... }
export function buildLocalBusinessSchema(opts: { name: string; url: string; telephone: string; cityName: string }) { ... }
```

Each returns a typed object ready for `JSON.stringify`. Replace manual construction in all ~7 pages.

### Session 6 Acceptance Criteria
- `ClosingCTABand` used on 6+ pages — no inline dark CTA sections remain
- `Breadcrumb` used on 8+ pages — no hand-coded breadcrumb nav remains
- `CrossLinks` used on 4+ pages — no duplicate inline link clusters
- `AccordionFAQ` (from Session 4J) used on 3+ pages — no native `<details>` FAQ sections
- Structured data helpers used on all pages with JSON-LD — no manual schema construction
- All extractions are prop-driven with no loss of per-page customization

---

## Session 7: Polish, Edge Cases & New Findings

**Goal:** Address all remaining T4 findings, new findings from the gap analysis, and deferred decisions.

### 7A · Homepage FAQSection No-JS Fallback → F-059

Add `<noscript>` block inside `FAQSection` that renders all Q&A pairs as visible text, since the controlled accordion renders everything in `grid-rows-[0fr]` without JS.

### 7B · Employment Form Analytics → F-060

In `EmploymentApplicationForm.tsx`, add `trackConversionEvent` calls:
- On form open/interaction (first field focus)
- On submit success
- On submit error

### 7C · Employment Form Honeypot → F-061

Add a hidden field to `EmploymentApplicationForm`:
```html
<input type="text" name="website" className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />
```
Check in API route: if `website` field has a value, silently reject.

### 7D · Legacy CSS Cleanup → F-063

In `globals.css`, replace:
```css
bg-white bg-opacity-10
```
→
```css
bg-white/10
```

### 7E · SVG Map Color Extraction → F-064

In `service-area/page.tsx` or `data/service-area-visual.ts`, add explicit `fillColor` field alongside Tailwind classes:
```typescript
{ bgClass: "bg-[#3b82f6]", fillColor: "#3b82f6" }
```
Remove the `.replace()` string manipulation.

### 7F · Region Casing Normalization → F-065

Normalize `VISUAL_REGION_MAP` keys to match `ServiceAreaRegion` type casing. Use `"North"` | `"Central"` | `"South"` everywhere.

### 7G · Empty States → F-066, F-067

**FAQSection:** When filter produces zero results, show:
```
<p className="text-center text-sm text-slate-500 py-8">No questions match this filter.</p>
```

**Industry services:** When `getIndustryServices` returns empty:
```
<p className="text-sm text-slate-500">Service details coming soon.</p>
```

### 7H · Exit Intent → D-02, F-071

Move `ExitIntentOverlay` from `VariantAPublicPage.tsx` to `PublicChrome.tsx`. Add a session-storage guard so it only shows once per browser session. Fires on all public pages.

### 7I · Mobile Menu Keyboard → F-072

In `PublicHeader.tsx`, add Escape key handler for mobile menu:
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isMobileMenuOpen) {
      closeMobileMenu();
    }
  };
  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [isMobileMenuOpen]);
```

Note: Desktop dropdown Escape handling already exists — this adds mobile parity.

### 7J · Desktop Dropdown Focus Trap → F-073

In `PublicHeader.tsx`, add `onKeyDown` to the last link in each dropdown that tabs forward to close the dropdown:
```typescript
onKeyDown={(e) => {
  if (e.key === "Tab" && !e.shiftKey) {
    setOpenDesktopMenu(null);
  }
}}
```

### 7K · Industry Page Data Extraction → F-075

Move `INDUSTRY_PAGE_CONTENT` (~300 lines) from `industries/[slug]/page.tsx` to `data/industry-content.ts`. Import in page file.

### 7L · JsonLd Wrapper → F-079

**New file:** `components/public/variant-a/JsonLd.tsx`

```typescript
export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

Centralizes the pattern. Replace all `<script type="application/ld+json" dangerouslySetInnerHTML=...>` across pages. Future-proofs for escaping if data sources become dynamic.

### 7M · Employment Form Client Validation → F-080

Add basic client-side validation:
- Phone: regex for 10+ digits
- Email: basic format check
- Notes: `maxLength={5000}` attribute
- Required fields: `required` attribute

### 7N · Image Blur Placeholders → F-078

On below-fold images in industry template (before/after), add `placeholder="blur"` with a base64 placeholder or use Next.js static import for auto blur generation.

### 7O · Alt Text Strategy → F-097

Review all image `alt` attributes. Ensure before/after images describe the scene, not just the label:
```
// Before (formulaic):
alt="Construction final-clean comparison before"

// After (descriptive):
alt="Commercial space with construction debris and dust before professional cleaning"
```

### 7P · ErrorBoundary Coverage → F-084 (per D-10)

Audit homepage sections not wrapped in ErrorBoundary. Wrap `ServiceSpreadSection`, `OfferAndIndustrySection`, `TimelineSection`, and `AboutSection` — matching the pattern already used for `BeforeAfterSlider` and `TestimonialSection`.

### Session 7 Acceptance Criteria
- FAQSection shows answers without JS via noscript fallback
- Employment form fires analytics events on submit
- Employment form rejects honeypot submissions
- No legacy `bg-opacity-*` syntax in globals.css
- SVG map uses explicit color fields (no string parsing)
- Empty states render for zero-result filters
- Exit intent appears on all pages, once per session
- Mobile menu closes on Escape
- Desktop dropdowns close on Tab past last item
- Industry page content lives in data file
- JsonLd component used across all pages
- Employment form has basic client validation
- Below-fold images have blur placeholders
- All homepage sections wrapped in ErrorBoundary

---

## Appendix: Findings Resolution Map

| Finding | Session | Change |
|---------|---------|--------|
| F-001 | 1A | Delete PublicPageShell, unwrap 5 pages |
| F-002 | 2 | Replace all quote Links with QuoteCTA |
| F-003 | 2 | Replace all raw tel: with CTAButton |
| F-004 | 3 | Services index rewrite |
| F-005 | 1B | Add /services and /services/* to forceSolidHeader |
| F-006 | 4A | FAQ buttons → system CTA classes |
| F-007 | 4A | FAQ kicker → .section-kicker |
| F-008 | 4B | Careers breadcrumbs + structured data |
| F-009 | 4C | Industry BreadcrumbList schema |
| F-010 | 4D | Container width → max-w-7xl |
| F-011 | 1C | Mobile nav min-h-[44px] |
| F-012 | 4E | FAQ filter buttons height + aria-pressed |
| F-013 | 1D | Desktop call button min-h-[44px] |
| F-014 | 1E | Sticky bar role="toolbar" |
| F-015 | 4F | Industry social proof h2 |
| F-016 | 4G | Page titles with brand + location |
| F-017 | 4B | Careers OG tags |
| F-018 | 4H | ServicePageHardening heading levels |
| F-019 | 4I | Deprecate #F1F0EE → #FAFAF8 |
| F-020 | 4J | AccordionFAQ component, replace <details> |
| F-021 | 1F | Remove redundant pb-24 |
| F-022 | 4K | Noscript nav fallback |
| F-023 | 5A | Footer links → dedicated routes |
| F-024 | 5D | Dark CTAs → .cta-light |
| F-025 | 5E | Dark kickers → gold (no !important) |
| F-026 | 5F | Surface all 5 services on area pages |
| F-027 | 3B | Resolved by data-driven service cards |
| F-028 | 5G | Contact city chips → links |
| F-029 | 5H | Careers closing CTA band |
| F-030 | 5C | Industry breadcrumb → /industries |
| F-031 | — | Documented: intentional narrowing for text sections |
| F-032 | 5I | Response time nuance in FAQ |
| F-033 | 3A | Add href to SERVICES data |
| F-034 | 1G | Dynamic copyright year |
| F-035 | — | Low priority; defer to Session 7 or future cleanup |
| F-036 | — | Documented: "austin" special case in nearbyAreaSlugs |
| F-037 | 5J | Document .slice(0,6), align FAQ |
| F-038 | 5O | Service pages link to siblings |
| F-039 | 5N | About links to careers |
| F-040 | 5O | Related services section on detail pages |
| F-041 | 3B | Breadcrumb "Services" → functional page |
| F-042 | — | Per D-04: no change to header, phone covers it |
| F-043 | — | Industry → city cross-links deferred (low traffic path) |
| F-044 | — | Content strategy decision; document for brand review |
| F-045 | 5K | Español accent fix |
| F-046 | 5L | Footer chips match industry titles |
| F-047 | 5M | Testimonial anonymization |
| F-048 | 5Q | COMPANY_STATS centralization |
| F-049 | 5Q | Business hours in COMPANY constants |
| F-050 | — | Content strategy: "same-day" wording review for brand |
| F-051 | 6A | ClosingCTABand component |
| F-052 | 6B | Breadcrumb component |
| F-053 | 6C | CrossLinks component |
| F-054 | 6D | AreaServiceCards component |
| F-055 | 6E | Structured data helpers |
| F-056 | 2 | Service area hub CTA tracking |
| F-057 | — | SVG map mobile: defer to design review |
| F-058 | — | Post-construction hero stacking: CSS-only fix, low priority |
| F-059 | 7A | FAQSection noscript fallback |
| F-060 | 7B | Employment form analytics |
| F-061 | 7C | Employment form honeypot |
| F-062 | — | Stale finding per verification (heroKenBurns in use) |
| F-063 | 7D | Legacy bg-opacity syntax |
| F-064 | 7E | SVG map color extraction |
| F-065 | 7F | Region casing normalization |
| F-066 | 7G | FAQ filter empty state |
| F-067 | 7G | Industry service grid empty state |
| F-068 | — | Document hover translate rule in design system |
| F-069 | — | Document hover shadow rule in design system |
| F-070 | — | Non-issue: QuoteCTA serviceType prop handles it |
| F-071 | 7H | Exit intent → PublicChrome |
| F-072 | 7I | Mobile menu Escape key |
| F-073 | 7J | Desktop dropdown focus trap |
| F-074 | — | Document 5→4 type mapping |
| F-075 | 7K | Industry content → data file |
| F-076 | — | Intentional: same image for hero and after. Note for future photography |
| F-077 | — | Per D-12: 75 everywhere for now |
| F-078 | 7N | Blur placeholders |
| F-079 | 7L | JsonLd wrapper component |
| F-080 | 7M | Employment form client validation |
| F-081 | — | Stale: robots.ts exists |
| F-082 | — | Partially stale: sitemap exists, coverage QA only |
| F-083 | 5Q | Company data centralization |
| F-084 | 7P | ErrorBoundary coverage |
| F-085 | — | Low risk for static forms; note for future |
| F-086 | — | Verify homepage canonical; likely present |
| F-087 | — | Per D-11: defer contact mobile reorder |
| F-088 | — | Low priority: about hero fixed height |
| F-089 | — | Non-issue: hooks are instance-scoped |
| F-090 | — | Verify OG image coverage; separate audit |
| F-091 | — | Low priority: type pattern standardization |
| F-092 | — | Low priority: explicit return type |
| F-093 | — | Verify trackConversionEvent internal try/catch |
| F-094 | — | Dev-mode warning for invalid slugs; low priority |
| F-095 | — | Build-time env validation; low priority |
| F-096 | — | Acceptable: solid fallback exists for older browsers |
| F-097 | 7O | Alt text strategy |
| F-098 | — | Document shared image usage |
| F-099 | — | Future: Storybook or style guide page |
| F-100 | — | Future: inline "why" comments on key decisions |

**Total resolved by implementation:** 68 findings across 7 sessions
**Documented/deferred/stale:** 32 findings (intentional decisions, non-issues, or future work)

Good — these two were the biggest blind spots. Here's what I found and what needs updating in the solutioning doc.

---

# Solutioning Addendum: Contact & Service Area Hub

## New Observations

### `contact/page.tsx`

| Pattern | Actual State | Solutioning Impact |
|---------|-------------|-------------------|
| Uses `PublicPageShell` | ✅ Confirmed — wraps everything | Session 1A confirmed |
| `pb-24 md:pb-0` on inner main | ✅ `<main className="pb-24 md:pb-0">` | Session 1F confirmed |
| Dark hero with `pt-32 md:pt-40` | Shell's `py-16` stacks → ~192px top gap | Session 1A confirmed |
| City chips static `<span>` | 8 cities including Hutto as `<span>` | Session 5G confirmed — also needs Hutto removal per D-07 |
| Raw `tel:` link in sidebar | `<a href="tel:">` in "Prefer to talk directly?" gold card | **New CTA for Session 2** — missed in original spec |
| "Explore Our Services" link | `<Link href="/#services">` | **New nav fix for Session 5** |
| QUICK_FACTS Coverage text | Lists 8 cities including Hutto | Needs alignment with D-07 (remove Hutto) |
| Contact page title | `"Contact Us"` | Session 4G confirmed |
| No closing dark CTA band | Page ends with white "Serving the Greater Austin Metro" section | Not a problem — the service area link section serves as a closing CTA. Different from other pages but appropriate for a contact page. |

### `service-area/page.tsx` (hub)

| Pattern | Actual State | Solutioning Impact |
|---------|-------------|-------------------|
| Uses `PublicPageShell` | ✅ Confirmed | Session 1A confirmed |
| `pb-24 md:pb-0` on inner main | ✅ `<main className="pb-24 md:pb-0">` | Session 1F confirmed |
| Dark hero with `pt-32 md:pt-40` | Shell's `py-16` stacks | Session 1A confirmed |
| Hardcoded 3 services | `SERVICES_ACROSS_AREAS` — Post-Construction, Commercial, Move-In/Move-Out | Session 5F confirmed |
| Native `<details>` FAQ | `COVERAGE_FAQS` with snapping accordion | Session 4J confirmed |
| Coverage CTA | `<Link href="/contact" className="cta-primary">Request Coverage</Link>` | Session 2 F-056 confirmed |
| Raw `tel:` in closing | `<a href="tel:">` styled as rounded-full pill | **New CTA for Session 2** |
| SVG map color hack | `.replace("bg-[", "").replace("]", "")` | Session 7E confirmed |
| `VISUAL_REGION_MAP` casing | `"north"` → `"North"` mapping | Session 7F confirmed |
| Cross-links at bottom of FAQ section | Industry links + About + FAQ | Session 6C extraction candidate confirmed |
| `CITIES` array includes Austin as HQ + all 7 SERVICE_AREA_CITIES | Austin + 7 cities = 8 total in the list | Hutto still appears in city list — per D-07 we keep the page but exclude from featured navigation. Hub city list should remain complete since it's a coverage page. |
| Contact page "Explore Our Services" | `<Link href="/#services">` | Session 5 — route to `/services` |

---

## Session Spec Revisions

### Session 1A Revision — Contact & Service Area Hub Shell Removal

Both files follow the exact same pattern as FAQ — `PublicPageShell` wraps a `<main>` that starts with a dark hero section. The shell's `max-w-7xl` clips the full-bleed hero, and its `py-16` stacks with the hero's `pt-32`.

**`contact/page.tsx`:**
- Remove `import { PublicPageShell }` and wrapper
- Change `<main className="pb-24 md:pb-0">` to `<main className="bg-[#FAFAF8]">` (remove redundant padding, add standard bg since the form section uses `bg-[#FAFAF8]`)
- Hero `pt-32 md:pt-40` is slightly larger than the standard `pt-28 md:pt-36` — this is intentional since the dark hero has more content (breadcrumb + kicker + h1 + body + 3 contact cards). **Keep as-is.**

**`service-area/page.tsx`:**
- Remove `import { PublicPageShell }` and wrapper
- Change `<main className="pb-24 md:pb-0">` to `<main>` (no explicit bg needed — sections alternate their own backgrounds)
- Hero `pt-32 md:pt-40` — same rationale as contact. **Keep as-is.**

Neither page needs to be added to `forceSolidHeader` — both have dark hero sections where the transparent header works correctly.

---

### Session 2 Revision — Additional CTAs

**`contact/page.tsx`** — Two CTAs missed in original spec:

| Location | Current | Replace | ctaId |
|----------|---------|---------|-------|
| Sidebar gold "Call" button | `<a href="tel:" className="...rounded-lg bg-[#C9A94E]...">Call {COMPANY_PHONE}</a>` | Pattern B with gold styling | `contact_sidebar_call` |
| "Explore Our Services" link | `<Link href="/#services" className="cta-outline-dark...">` | Not a CTA conversion — just a nav fix for Session 5. Leave as `Link`, change href only. | — |

Note: The contact page hero contact method cards (`CONTACT_METHODS`) include a phone link (`tel:`) and email link (`mailto:`). These are informational contact links, not conversion CTAs — I'd recommend leaving them as regular `<a>` tags. The phone one could optionally get CTAButton tracking but it's an info card, not a sales CTA. **Decision needed:** Track contact method card clicks or leave as informational?

My recommendation: Track them. They're still conversion actions. Add:

| Location | Current | Replace | ctaId |
|----------|---------|---------|-------|
| Hero "Call Us" card | `<a href="tel:">` (via dynamic Tag) | Wrap in CTAButton or add onClick tracking | `contact_hero_call_card` |
| Hero "Email Us" card | `<a href="mailto:">` | Same | `contact_hero_email_card` |
| Hero "Service Area" card | `<Link href="/service-area">` | No tracking needed — navigation link | — |

Implementation note: The contact method cards use a dynamic `Tag` (`Link` or `"a"`) with complex className logic. Rather than replacing the entire card with `CTAButton` (which would fight the card styling), add an `onClick` handler that fires `trackConversionEvent` directly:

```typescript
onClick={() => {
  void trackConversionEvent({
    eventName: "cta_click",
    metadata: { cta_id: `contact_hero_${method.icon}_card`, action_type: method.icon === "phone" ? "call" : "email" },
  });
}}
```

This requires making the page a client component or extracting the cards to a client island. Since `ContactPageClient` is already a client component, the cleaner approach is to move the hero contact cards into a small client component. **Or** — just accept that these particular cards don't need tracking. They're duplicated by the sidebar gold call CTA which will be tracked.

**My final recommendation:** Track the sidebar gold call button. Don't restructure the hero cards for tracking — the ROI isn't there.

**`service-area/page.tsx` (hub)** — Two CTAs:

| Location | Current | Replace | ctaId |
|----------|---------|---------|-------|
| Closing "Request Coverage" | `<Link href="/contact" className="cta-primary px-6 py-3">` | `<CTAButton ctaId="service_area_hub_coverage" actionType="link" href="/contact" className="cta-primary px-6 py-3">` | `service_area_hub_coverage` |
| Closing call | `<a href="tel:" className="inline-flex...rounded-full border border-white/30...">` | Pattern B with existing pill styling | `service_area_hub_closing_call` |

---

### Session 4J Revision — Service Area Hub FAQ Accordion

Confirmed: `COVERAGE_FAQS` uses native `<details>`. Replace with `AccordionFAQ`:

```typescript
import { AccordionFAQ } from "@/components/public/variant-a/AccordionFAQ";

// Replace the <details> block with:
<AccordionFAQ items={COVERAGE_FAQS} />
```

---

### Session 5 Revisions

**5F — Surface All 5 Services on Service Area Hub:**

Now that I can see the actual file, `SERVICES_ACROSS_AREAS` is a local constant with 3 hardcoded services. Replace with data-driven:

```typescript
import { SERVICES } from "@/data/services";

// Delete SERVICES_ACROSS_AREAS constant entirely
// In render, replace with:
const areaServices = SERVICES.map(service => ({
  title: service.titleLines.join(" "),
  detail: service.description,
  href: service.href,  // added in Session 3A
}));
```

Grid adjustment: Currently `md:grid-cols-3`. With 5 items, options:
- `md:grid-cols-3` (2 wrap to second row) — acceptable
- `md:grid-cols-2 lg:grid-cols-3` — cleaner wrapping
- Keep `md:grid-cols-3` with the 5th card spanning or accept 3+2 layout

Recommendation: `md:grid-cols-2 lg:grid-cols-3` — natural 2+2+1 → 2+2+1 → 3+2 responsiveness.

**5G — Contact Page City Chips:**

Now I can see the exact code. Currently:

```typescript
{["Austin", "Round Rock", "Pflugerville", "Georgetown", "Hutto", "Buda", "Kyle", "San Marcos"].map(
  (city) => (
    <span key={city} className="rounded-full border border-slate-200 bg-[#FAFAF8] px-4 py-2 text-sm font-medium text-slate-600">
      {city}
    </span>
  ),
)}
```

Replace with linked chips, sourced from data, excluding Hutto per D-07:

```typescript
import { SERVICE_AREA_CITIES } from "@/lib/service-areas";

// In render:
{[
  { name: "Austin", href: "/service-area" },
  ...SERVICE_AREA_CITIES.slice(0, 6).map(city => ({
    name: city.name,
    href: `/service-area/${city.slug}`,
  })),
].map((city) => (
  <Link
    key={city.name}
    href={city.href}
    className="rounded-full border border-slate-200 bg-[#FAFAF8] px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-[#0A1628]"
  >
    {city.name}
  </Link>
))}
```

This gives 7 linked chips (Austin HQ + 6 featured cities). No Hutto.

Also update `QUICK_FACTS` Coverage text to remove Hutto:
```
"Austin, Round Rock, Pflugerville, Georgetown, Buda, Kyle, and San Marcos."
```

**New 5R — Contact Page "Explore Our Services" Nav Fix:**

In `contact/page.tsx`, the bottom section has:
```
<Link href="/#services" className="cta-outline-dark gap-2 px-6 py-3">
  Explore Our Services
</Link>
```

Change to:
```
<Link href="/services" className="cta-outline-dark gap-2 px-6 py-3">
  Explore Our Services
</Link>
```

---

### Session 5Q Revision — Company Data Centralization

Now that I can see the contact page, business hours are hardcoded in two places:
1. `CONTACT_METHODS[0].detail`: `"Mon–Fri 7am–6pm · Sat 8am–2pm"`
2. Business hours sidebar: Hardcoded array of `{ day, hours }` objects

Add to `lib/company.ts`:

```typescript
export const COMPANY_HOURS = {
  weekday: { label: "Monday – Friday", hours: "7:00 AM – 6:00 PM" },
  saturday: { label: "Saturday", hours: "8:00 AM – 2:00 PM" },
  sunday: { label: "Sunday", hours: "Closed" },
  summary: "Mon–Fri 7am–6pm · Sat 8am–2pm",
} as const;
```

---

## Updated Session 1 File Coverage (Complete)

All five `PublicPageShell` consumers now confirmed:

| File | Dark Hero? | `pt` Value | `pb-24` on main? | Shell Removal Notes |
|------|-----------|-----------|-------------------|---------------------|
| `faq/page.tsx` | No (white hero) | `pt-32 md:pt-40` | Yes | Normalize to `pt-28 md:pt-36` |
| `contact/page.tsx` | Yes (dark) | `pt-32 md:pt-40` | Yes | Keep `pt` as-is (more content) |
| `service-area/page.tsx` | Yes (dark) | `pt-32 md:pt-40` | Yes | Keep `pt` as-is |
| `privacy/page.tsx` | Not seen yet | Likely text page | Likely yes | Verify when implementing |
| `terms/page.tsx` | Not seen yet | Likely text page | Likely yes | Verify when implementing |

Privacy and terms are low-risk — they're simple text pages. The pattern will be: remove shell, add `max-w-4xl mx-auto px-6` to inner content, ensure header clearance. Can verify at implementation time.

---

## Remaining Unseen Files

The only files I haven't seen that have specs written against them:

| File | Sessions | Risk Level |
|------|----------|-----------|
| `privacy/page.tsx` | 1A only | **Low** — simple shell removal |
| `terms/page.tsx` | 1A only | **Low** — same |
| `globals.css` | 4I (deprecate warm bg), 7D (legacy syntax) | **Medium** — need to verify `.cta-light` exists for Session 5D |
| `EmploymentApplicationForm.tsx` | 7B, 7C, 7M | **Low** — Session 7 polish |
| Other 4 service detail pages | Session 2 CTA wiring | **Low** — assumed to mirror post-construction, can verify at implementation |
| `lib/company.ts` | 5Q | **Low** — additive changes only |
| `data/industries.ts` | 5B | **Low** — need `IndustryData` shape for industries index page |

**My assessment:** The solutioning doc is now implementation-ready for Sessions 1 through 5. The remaining unseen files are either low-risk pattern matches or Session 7 polish items that can be verified in-flight.

That confirms everything. Here's the final piece of the puzzle.

---

# Solutioning Addendum: globals.css Verification

## Confirmed

**`.cta-light` exists and works for Session 5D** ✅

Current definition:
```css
.cta-light {
  @apply inline-flex items-center justify-center rounded-md border border-white/30 
    bg-white bg-opacity-10 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] 
    text-white shadow-sm backdrop-blur transition duration-300 
    hover:bg-white hover:text-[#0A1628] hover:-translate-y-0.5 active:scale-[0.98];
}
```

This is functionally identical to what About, Industry, and Service Area Hub pages are building manually with inline overrides on `.cta-outline-dark`:

| Property | `.cta-light` | Inline Override Pattern |
|----------|-------------|------------------------|
| Border | `border-white/30` | `border-white/30` or `border-white/35` |
| Background | `bg-white bg-opacity-10` | `bg-white/5` or none |
| Text | `text-white` | `text-white` |
| Hover bg | `hover:bg-white` | `hover:bg-white` |
| Hover text | `hover:text-[#0A1628]` | `hover:text-[#0A1628]` |
| Backdrop blur | `backdrop-blur` | Not present |

The 5% border opacity difference (`/30` vs `/35`) is invisible. The backdrop blur addition is a visual improvement. **Session 5D is a clean swap.**

---

## globals.css Changes Across All Sessions

### Session 4I — Deprecate `--color-warm`

```css
/* Before: */
--color-warm: #F1F0EE;

/* After: */
--color-warm: #F1F0EE; /* DEPRECATED — use --color-white (#FAFAF8) instead. Retained only for reference during migration. */
```

Remove after all `bg-[#F1F0EE]` references are eliminated from page files. Can delete entirely once Session 4I is complete.

### Session 7D — Legacy `bg-opacity-*` Syntax → F-063

Three classes use the old Tailwind opacity syntax:

**`.cta-light`:**
```css
/* Before: */
bg-white bg-opacity-10

/* After: */
bg-white/10
```

**`.dark-surface-panel`:**
```css
/* Before: */
bg-white bg-opacity-5

/* After: */
bg-white/5
```

**`.info-chip-dark`:**
```css
/* Before: */
bg-white bg-opacity-10

/* After: */
bg-white/10
```

These are functionally equivalent in Tailwind v3+ but the modern syntax is shorter and consistent with how every page file already writes opacity (e.g., `bg-white/[0.04]`, `border-white/30`).

### F-062 — `heroKenBurns` Status

The audit pre-verification already marked this as **not valid / stale** — the animation is in use in `HeroSection.tsx`. Confirmed: `@keyframes heroKenBurns` stays. No change needed.

---

## Full File Coverage Status

Every file that has solutioning specs written against it has now been reviewed:

| File | Seen | Sessions |
|------|------|----------|
| `PublicPageShell.tsx` | ✅ | 1A (delete) |
| `PublicChrome.tsx` | ✅ | 1E, 1F, 7H |
| `PublicHeader.tsx` | ✅ | 1B, 1C, 1D, 1G, 4K, 5B, 5P, 7I, 7J |
| `CTAButton.tsx` | ✅ | 2 (reference) |
| `QuoteCTA.tsx` | ✅ | 2 (reference) |
| `FooterSection.tsx` | ✅ | 5A, 5L |
| `FAQSection.tsx` | ✅ | 4E, 7A, 7G |
| `ServicePageHardening.tsx` | ✅ | 4H |
| `globals.css` | ✅ | 4I, 7D |
| `data/services.ts` | ✅ | 3A |
| `lib/service-areas.ts` | ✅ | 5F, 5G, 5I, 5J |
| `faq-items.ts` | ✅ | 5I, 5J |
| `services/post-construction-cleaning/page.tsx` | ✅ | 2, 4I |
| `services/page.tsx` | ✅ | 3B (rewrite) |
| `industries/[slug]/page.tsx` | ✅ | 2, 4C, 4F, 5C, 5D, 5E, 5K, 5M, 7K |
| `service-area/[slug]/page.tsx` | ✅ | 2, 4I, 4J |
| `service-area/page.tsx` | ✅ | 1A, 2, 4J, 5F, 7E, 7F |
| `about/page.tsx` | ✅ | 2, 4I, 5D, 5N, 5Q |
| `faq/page.tsx` | ✅ | 1A, 2, 4A, 4G |
| `careers/page.tsx` | ✅ | 1F, 4B, 4D, 5H |
| `contact/page.tsx` | ✅ | 1A, 1F, 2, 4G, 5G, 5R |
| `privacy/page.tsx` | ⚠️ Not seen | 1A only — low risk |
| `terms/page.tsx` | ⚠️ Not seen | 1A only — low risk |
| `EmploymentApplicationForm.tsx` | ⚠️ Not seen | 7B, 7C, 7M — polish only |
| Other 4 service detail pages | ⚠️ Not seen | Session 2 CTA wiring — assumed mirror of post-construction |
| `lib/company.ts` | ⚠️ Not seen | 5Q — additive only |
| `data/industries.ts` | ⚠️ Not seen | 5B — need type shape for index page |

**22 of 28 file groups reviewed directly.** The 6 unseen are all low-risk: pattern-matched (service detail pages), additive-only (company.ts), or Session 7 polish (employment form).

---

## Final Assessment

The solutioning document is complete and implementation-ready. Every session has:

- Precise file-level change specifications
- Confirmed patterns verified against actual source code
- Acceptance criteria
- Dependency chains

**Recommended execution order:**

1. **Session 1** — all infrastructure. Can be done in one sitting.
2. **Session 2** — all CTA wiring. Mechanical find-and-replace across ~12 files.
3. **Session 3** — services index rewrite. Single new file.
4. **Session 4** — per-page structural. Can parallelize across files.
5. **Session 5** — nav and content. Largest session by file count but each change is small.
6. **Session 6** — component extraction. Depends on patterns being stable from 1–4.
7. **Session 7** — polish sweep. No dependencies on being done in order.

Ready to start implementing whenever you are.

# Implementation Handoff — Context Pack for New Chat

**Purpose:** This section contains everything a new chat needs to execute the solutioning document session-by-session. Paste the full solutioning document (everything above this section) first, then paste this context pack. The new chat should be able to ask you for exactly the right files at each step and produce precise, implementation-ready code.

---

## How to Use This Document

**You (the human) should:**
1. Paste the full solutioning document into the new chat
2. Paste this context pack immediately after
3. Tell the new chat which session you want to start with
4. Provide files as requested — the guide below tells the new chat exactly what to ask for

**The new chat should:**
1. Read the solutioning doc for *what* to change
2. Read this context pack for *how* the codebase actually works
3. Request specific files before writing any code
4. Produce implementation-ready diffs or complete file rewrites per session

---

## Decision Log (Final — All Resolved)

| ID | Decision | Resolution |
|----|----------|------------|
| D-01 | `/industries` index page | **Create it.** Session 5B. |
| D-02 | Exit intent scope | **Move to PublicChrome** with once-per-session guard. Session 7H. |
| D-03 | Testimonials | **Role-only attribution.** Remove fake names/companies. Session 5M. |
| D-04 | Contact in header nav | **No change.** Phone number covers it. |
| D-05 | `#F1F0EE` warm bg | **Deprecate.** Standardize on `#FAFAF8`. Session 4I. |
| D-07 | Hutto | **Keep 6 cities, exclude Hutto from navigation.** Hutto page stays for SEO. FAQ updated to list 6. Session 5J. |
| D-10 | ErrorBoundary strategy | **Defer.** Session 7P. Wrap remaining homepage sections. |
| D-11 | Contact mobile sidebar reorder | **Defer.** Session 7 polish. |
| D-12 | Image quality | **75 everywhere.** Optimize later with data. |

---

## Design System — Verified Against globals.css

```
COLOR TOKENS
  Navy:      #0A1628  — Primary text, CTA bg, dark sections, body text
  Dark Blue: #0f2746 / #081120 — Header scrolled, footer bg
  Royal:     #2563EB  — Kickers (.section-kicker), links, focus accents
  Gold:      #C9A94E  — Accent dots, .cta-gold, dark-bg kickers, decorative
  Warm:      #F1F0EE  — DEPRECATED (being removed in Session 4I)
  Off-white: #FAFAF8  — Body background, section alternation

Z-INDEX STACK
  30 → sticky bar (--z-sticky-bar)
  40 → floating widget (--z-floating-widget)
  50 → header (--z-header)
  55 → dialog (--z-dialog)
  60 → overlay (--z-overlay)

CTA CLASSES (from globals.css @layer components)
  .cta-primary    → navy bg, white text, hover:bg-[#162742], hover:-translate-y-0.5, active:scale-[0.98]
  .cta-light      → border-white/30, bg-white/10, backdrop-blur, hover fills white — FOR DARK BACKGROUNDS
  .cta-gold       → gold bg, navy text
  .cta-outline-dark → border-slate-300, hover:border-navy, hover fills white — FOR LIGHT BACKGROUNDS
  ALL share: rounded-md, px-6 py-3, text-xs font-bold uppercase tracking-[0.18em], transition duration-300

KICKER RULES
  Light bg → .section-kicker (text-[10px] font-bold uppercase tracking-[0.24em] text-[#2563EB])
  Dark bg  → inline gold: text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A94E]
  NEVER use !important override on .section-kicker

SURFACE PRIMITIVES
  .surface-panel      → rounded-2xl border-slate-200 bg-white shadow-sm
  .surface-panel-soft → rounded-2xl border-slate-200/80 bg-white/80 shadow-sm backdrop-blur
  .dark-surface-panel → rounded-2xl border-white/10 bg-white/5 shadow backdrop-blur
  .info-chip          → rounded-full pills for light bg
  .info-chip-dark     → rounded-full pills for dark bg

LAYOUT CONSTANTS
  Container: max-w-7xl mx-auto px-6
  Narrower (max-w-4xl, max-w-3xl): only for inner text blocks, never outer sections
  Header clearance: pt-28 md:pt-36 (standard) or pt-32 md:pt-40 (pages with more hero content)
```

---

## Architecture — How Key Systems Work

### PublicChrome (wraps ALL public pages via layout)
- Provides: `QuoteContext` → `FloatingQuotePanel` → `AIQuoteAssistant` → `ScrollToTopButton` → mobile sticky bar
- Mounts `FloatingQuotePanel` once — available on every page via `QuoteContext`
- Wraps children in `pb-24 md:pb-0` (sole source of sticky bar bottom clearance)
- Tracks section views + scroll depth (homepage only, gated by `isHomePage`)
- Controls body scroll lock when panel open (`document.body.style.overflow`, `inert` attribute)
- Mobile sticky bar: appears after 80vh scroll, hides when panel open or mobile menu open

### CTA Flow (verified against CTAButton.tsx and QuoteCTA.tsx)
```
QuoteCTA (thin wrapper)
  → CTAButton(actionType="quote")
    → trackConversionEvent("cta_click")
    → trackConversionEvent("quote_panel_opened")
    → e.preventDefault()
    → openQuote({ serviceType, sourceCta })
    → FloatingQuotePanel opens

CTAButton(actionType="call")
  → trackConversionEvent("cta_click")
  → follows tel: href (no preventDefault)

CTAButton(actionType="link")
  → trackConversionEvent("cta_click")
  → follows href via Link or <a>
```

**Key CTAButton behaviors:**
- Always applies `min-h-[44px] md:min-h-[48px]` — override with `min-h-0` for text-style links
- If `actionType="quote"` and no `href`: renders `<button>`
- If `href` starts with `http/tel:/mailto:`: renders `<a>`
- Otherwise: renders Next.js `<Link>`
- `serviceType` prop pre-fills the quote panel when opening

### Header Behavior
- Transparent by default (works on dark hero pages)
- Forces solid on: `/privacy`, `/terms`, `/faq`, `/about`, `/careers`, `/service-area`, `/service-area/*`
- **Session 1B adds:** `/services`, `/services/*`
- **Session 5B adds:** `/industries`
- Scroll threshold: `Math.max(120, window.innerHeight * 0.5)` → transitions to solid `bg-[#0f2746]`
- Mobile menu: JS-toggled `opacity-0 pointer-events-none`, closes all `<details>` on dismiss

### PublicPageShell (BEING DELETED in Session 1A)
- Simple wrapper: `<div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">`
- Used by: `faq/page.tsx`, `contact/page.tsx`, `service-area/page.tsx`, `privacy/page.tsx`, `terms/page.tsx`
- Problem: clips full-bleed sections, stacks padding with page-level header clearance

### Data Model
- **5 services:** post-construction, final-clean, commercial, move-in-move-out, windows-power-wash
- **3 industries:** general-contractors, property-managers, commercial-spaces
- **7 cities** (data): round-rock, georgetown, pflugerville, buda, kyle, san-marcos, hutto
- **6 cities** (displayed): `.slice(0, 6)` drops hutto from navigation; hutto page stays for SEO
- **15 FAQ items:** 7 general, 5 process, 3 pricing
- **4 service hardening types:** construction, commercial, turnover, specialty — maps 5 pages to 4 types

---

## File Inventory — What Has Been Reviewed

### Fully Reviewed (code seen and analyzed)

```
INFRASTRUCTURE
  PublicPageShell.tsx          — 3-line wrapper, being deleted
  PublicChrome.tsx             — Main wrapper with QuoteContext, sticky bar, analytics
  PublicHeader.tsx             — Fixed header with dropdowns, mobile menu, forceSolidHeader
  CTAButton.tsx                — Universal CTA with tracking + quote opening
  QuoteCTA.tsx                 — Thin wrapper around CTAButton(actionType="quote")
  FooterSection.tsx            — Footer with nav, contact, CTA band
  globals.css                  — Full design system tokens and component classes

COMPONENTS
  FAQSection.tsx               — Homepage FAQ with filters, controlled accordion, animations
  ServicePageHardening.tsx     — Pricing/objections/FAQ/service-area pills for service pages

DATA
  data/services.ts             — SERVICES array (5 items) + SERVICE_MENU_LINKS
  lib/service-areas.ts         — SERVICE_AREA_CITIES (7), SERVICE_AREA_BY_SLUG, HOMEPAGE_SERVICE_AREA_LINKS
  faq-items.ts                 — FAQ_ITEMS (15), CATEGORY_LABELS, CATEGORY_STYLES

PAGES
  services/page.tsx            — BROKEN placeholder, Session 3 rewrite
  services/post-construction-cleaning/page.tsx — Representative service detail template
  industries/[slug]/page.tsx   — Industry template with INDUSTRY_PAGE_CONTENT (300+ lines)
  service-area/[slug]/page.tsx — City template
  service-area/page.tsx        — Hub page with SVG map
  about/page.tsx               — Company page
  faq/page.tsx                 — FAQ page (uses PublicPageShell)
  careers/page.tsx             — Careers + employment form
  contact/page.tsx             — Contact page (uses PublicPageShell)
```

### NOT Reviewed (request when reaching their session)

```
  privacy/page.tsx             — Session 1A (shell removal, low risk)
  terms/page.tsx               — Session 1A (shell removal, low risk)
  EmploymentApplicationForm.tsx — Session 7 (analytics, honeypot, validation)
  services/final-clean/page.tsx             — Session 2 (CTA wiring, assumed mirror of post-construction)
  services/commercial-cleaning/page.tsx     — Session 2 (same)
  services/move-in-move-out-cleaning/page.tsx — Session 2 (same)
  services/windows-power-wash/page.tsx      — Session 2 (same)
  lib/company.ts               — Session 5Q (additive, need to see current exports)
  data/industries.ts           — Session 5B (need IndustryData type for index page)
  data/service-area-visual.ts  — Session 7E/7F (SVG map data)
  ContactPageClient.tsx        — Session 2 (verify no additional CTAs inside)
```

---

## Session-by-Session File Request Guide

Use this to know exactly what to ask for before starting each session.

### Session 1: Shell & Infrastructure
**Files already reviewed — no additional files needed.**
Implementation can begin immediately. The only uncertainty is `privacy/page.tsx` and `terms/page.tsx` — request those if you want exact diffs, or apply the same pattern (remove shell wrapper, ensure header clearance, remove redundant padding).

Changes to make:
- Delete `PublicPageShell.tsx`
- Modify `PublicHeader.tsx` (forceSolidHeader, touch targets, copyright year)
- Modify `PublicChrome.tsx` (sticky bar aria)
- Modify `faq/page.tsx` (remove shell, remove padding)
- Modify `contact/page.tsx` (remove shell, remove padding)
- Modify `service-area/page.tsx` (remove shell, remove padding)
- Modify `privacy/page.tsx` (remove shell)
- Modify `terms/page.tsx` (remove shell)
- Modify `about/page.tsx` (remove pb-24)
- Modify `industries/[slug]/page.tsx` (remove pb-24)
- Modify `careers/page.tsx` (remove pb-24)

### Session 2: Universal CTA Wiring
**Request before starting:**
1. `services/final-clean/page.tsx`
2. `services/commercial-cleaning/page.tsx`
3. `services/move-in-move-out-cleaning/page.tsx`
4. `services/windows-power-wash/page.tsx`
5. `ContactPageClient.tsx` (to verify no hidden CTAs inside the client form component)

All other files already reviewed. The 4 service pages likely mirror post-construction — verify and apply same CTA replacement pattern.

### Session 3: Services Index Rebuild
**No additional files needed.** `services/page.tsx` (being rewritten) and `data/services.ts` (source data) both reviewed. Build from scratch using About page as structural template.

**One dependency:** Session 3A adds `href` field to `ServiceData` type in `data/services.ts`. This must be done before the rewrite references `service.href`.

### Session 4: Per-Page Structural Fixes
**Request before starting:**
1. `lib/company.ts` (to verify current exports before adding `COMPANY_STATS`)
2. Optionally: confirm `ServicePageHardening.tsx` heading structure in context of the pages that embed it

All page files already reviewed.

**Creates new file:** `components/public/variant-a/AccordionFAQ.tsx` — shared animated accordion component.

### Session 5: Nav, Content & Data
**Request before starting:**
1. `data/industries.ts` (need `IndustryData` type and `INDUSTRIES` array for index page + `INDUSTRY_MENU_LINKS`)
2. `lib/company.ts` (if not already provided in Session 4)

**Creates new files:**
- `app/(public)/industries/page.tsx` (industries index)

### Session 6: Component Extraction
**No new files to request.** All patterns visible from reviewed files. This session extracts repeated code into shared components.

**Creates new files:**
- `components/public/variant-a/ClosingCTABand.tsx`
- `components/public/variant-a/Breadcrumb.tsx`
- `components/public/variant-a/CrossLinks.tsx`
- `components/public/variant-a/AreaServiceCards.tsx` (if needed after Session 5F)
- `lib/structured-data.ts`

### Session 7: Polish & Edge Cases
**Request before starting:**
1. `EmploymentApplicationForm.tsx` (for F-060, F-061, F-080)
2. `data/service-area-visual.ts` (for F-064, F-065)
3. `VariantAPublicPage.tsx` (for F-071 exit intent relocation — need to see ExitIntentOverlay usage)

---

## Key Patterns the New Chat Must Follow

### CTA Replacement Patterns

**Pattern A — Quote CTA (opens panel in-page):**
```tsx
// BEFORE (broken — navigates away):
<Link href="/#quote-request" className="cta-primary px-8 py-4">Request a Quote</Link>

// AFTER (correct — opens FloatingQuotePanel):
<QuoteCTA ctaId="{page}_{location}_quote" serviceType="{type}" className="cta-primary px-8 py-4">
  Request a Quote
</QuoteCTA>
```

**Pattern B — Call CTA (tracked phone link):**
```tsx
// BEFORE (untracked):
<a href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark px-8 py-4">Call {COMPANY_PHONE}</a>

// AFTER (tracked):
<CTAButton ctaId="{page}_{location}_call" actionType="call" href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark px-8 py-4">
  Call {COMPANY_PHONE}
</CTAButton>
```

**Pattern C — Text-style call link (no button sizing):**
```tsx
<CTAButton ctaId="{page}_closing_call" actionType="call" href={`tel:${COMPANY_PHONE_E164}`}
  className="min-h-0 text-sm font-semibold uppercase tracking-wide text-slate-300 transition hover:text-white">
  Or call {COMPANY_PHONE}
</CTAButton>
```
Note: `min-h-0` overrides CTAButton's built-in `min-h-[44px]`.

### CTA ID Naming Convention
```
{page}_{location}_{action}

Examples:
  post_construction_hero_quote
  post_construction_hero_call
  post_construction_closing_quote
  industry_general-contractors_hero_quote
  city_round-rock_hero_call
  about_closing_quote
  faq_hero_call
  contact_sidebar_call
  service_area_hub_coverage
  services_index_closing_quote
```

### Service Type Mapping (for QuoteCTA serviceType prop)
```
post-construction-cleaning  → "construction"
final-clean                 → "construction"
commercial-cleaning         → "commercial"
move-in-move-out-cleaning   → "turnover"
windows-power-wash          → "specialty"
```

### Dark vs Light Background Rules
```
DARK BG (bg-[#0A1628]):
  - Kicker: inline gold text (not .section-kicker)
  - Primary CTA: .cta-gold
  - Secondary CTA: .cta-light (NOT .cta-outline-dark with inline overrides)
  - Breadcrumb text: text-slate-300/400, current page text-white

LIGHT BG (bg-white, bg-[#FAFAF8]):
  - Kicker: .section-kicker (blue)
  - Primary CTA: .cta-primary
  - Secondary CTA: .cta-outline-dark
  - Breadcrumb text: text-slate-500, current page text-[#0A1628]
```

### Standard Page Structure
```
<main className="bg-[#FAFAF8]">           ← or no bg if sections handle their own
  <section> breadcrumb + hero </section>    ← pt-28 md:pt-36 for header clearance
  <section> content sections </section>     ← alternate bg-white / bg-[#FAFAF8]
  <section> cross-links </section>          ← bg-white, border-y
  <section> closing CTA band </section>     ← bg-[#0A1628] py-14 md:py-18
</main>
```

No `PublicPageShell` wrapper. No `pb-24 md:pb-0` on `<main>` (PublicChrome handles it).

---

## Stale/Invalid Findings (Do Not Implement)

These were verified as no longer applicable:

| Finding | Why Stale |
|---------|-----------|
| F-062 | `heroKenBurns` IS in use in HeroSection.tsx |
| F-081 | `robots.ts` exists at app/robots.ts |
| F-082 | Sitemap exists at app/sitemap.ts — coverage QA only |

---

## Findings That Need Runtime/Visual Verification (Cannot Solve by Code Alone)

These are marked in the solutioning doc as documented/deferred but the new chat should flag them during implementation if relevant:

```
F-016, F-017 — SEO titles/OG: verify in browser after changes
F-028, F-029 — Contact chips, careers CTA: visual check after implementation
F-031 — Container width narrowing: intentional for text sections, document if questioned
F-039, F-041 — Cross-links: verify navigation flow after session 5
F-044 — Company descriptor inconsistency: brand decision, not code
F-047 — Testimonials: content replacement, verify rendering
F-048, F-049, F-050 — Data consistency: verify after centralization
F-057 — SVG map mobile: visual check
F-058 — Post-construction hero stacking: visual check at 768-1024px
F-068, F-069 — Hover animation consistency: visual check
F-076, F-077, F-078 — Image quality/placeholders: visual check
```

---

## Quick Reference: Import Paths

```tsx
// CTA components
import { QuoteCTA } from "@/components/public/variant-a/QuoteCTA";
import { CTAButton } from "@/components/public/variant-a/CTAButton";

// Company data
import { COMPANY_NAME, COMPANY_SHORT_NAME, COMPANY_PHONE, COMPANY_PHONE_E164, COMPANY_EMAIL, COMPANY_CITY } from "@/lib/company";
import { getSiteUrl } from "@/lib/site";

// Service data
import { SERVICES, SERVICE_MENU_LINKS } from "@/data/services";
import { INDUSTRIES, INDUSTRY_MENU_LINKS } from "@/data/industries";
import { SERVICE_AREA_CITIES, SERVICE_AREA_BY_SLUG, HOMEPAGE_SERVICE_AREA_LINKS } from "@/lib/service-areas";

// FAQ data
import { FAQ_ITEMS, CATEGORY_LABELS, CATEGORY_STYLES } from "@/components/public/variant-a/faq-items";
import { SERVICE_FAQS } from "@/lib/service-faqs";
import { SERVICE_PRICING } from "@/lib/service-pricing";

// New components (created during sessions)
import { AccordionFAQ } from "@/components/public/variant-a/AccordionFAQ";           // Session 4J
import { ClosingCTABand } from "@/components/public/variant-a/ClosingCTABand";       // Session 6A
import { Breadcrumb } from "@/components/public/variant-a/Breadcrumb";               // Session 6B
import { CrossLinks } from "@/components/public/variant-a/CrossLinks";               // Session 6C
import { JsonLd } from "@/components/public/variant-a/JsonLd";                       // Session 7L
import { buildBreadcrumbSchema, buildFAQSchema, buildServiceSchema } from "@/lib/structured-data"; // Session 6E
```

---

*This context pack, combined with the full solutioning document above, provides everything needed to execute all 7 sessions without loss of context from the original audit and analysis chat.*

---

## Implementation Risks and Guardrails (2026-04-06)

These are execution notes, not blockers. Keep them visible while running sessions.

### 1) Server/Client Boundaries (Session 2)

- `QuoteCTA` (client) can be rendered within App Router server pages.
- Build `ctaId` strings during server render and pass plain string props.
- Avoid converting full pages to client-only just for CTA wiring.
- Contact has extra client complexity (`ContactPageClient`), so keep edits scoped and avoid tree reshuffles.

### 2) Header Clearance Rule (Make Explicit)

Use a deliberate two-tier rule:

- Standard hero pages: `pt-28 md:pt-36`
- Dense/dark hero pages: `pt-32 md:pt-40`

Ownership rule:

- Page sections own top clearance.
- Shared components (for example `Breadcrumb`) must not assume one clearance preset.

### 3) AccordionFAQ Shape Contract (Session 4J -> Session 6)

Base contract:

```ts
{ items: Array<{ question: string; answer: string }> }
```

Before replacement, verify or map from each source:

- homepage `faq-items.ts`
- `ServicePageHardening` FAQ blocks
- service-area `COVERAGE_FAQS`
- industry FAQ arrays

If a source has extra metadata (category, ids, styling), map at call-site and keep `AccordionFAQ` minimal.

### 4) Temporary CTA Style Syntax Gap (Session 5D vs 7D)

- Session 5D may switch dark-secondary CTAs to `.cta-light` immediately.
- Session 7D later modernizes legacy opacity syntax in `globals.css` (`bg-opacity-*` to slash syntax).
- This short-lived syntax mismatch is acceptable and non-blocking.

### 5) Session 3B as Pattern Checkpoint

`/services` index rebuild is the first full net-new page and should be treated as a checkpoint.

- Follow established page architecture only.
- Reuse existing data and CTA primitives; do not introduce parallel abstractions.
- Run lint and do a visual pass for hero/breadcrumb/closing-CTA alignment before Session 4.

### 6) Unseen File Priority

Low risk overall, but request one file before Session 5B:

- `data/industries.ts` to confirm card-ready fields for `/industries` index.

Still low-risk but pending direct review:

- `privacy/page.tsx`
- `terms/page.tsx`
- `EmploymentApplicationForm.tsx`
- four non-reviewed service detail pages
- `lib/company.ts`

SESSION 1 SMOKE TEST:
  □ Visit /faq at 375px — no double padding, hero extends full width
  □ Visit /contact at 375px — dark hero extends edge-to-edge
  □ Visit /services — header is solid navy before scroll
  □ Open mobile menu — all links ≥ 44px (inspect in DevTools)
  □ VoiceOver on sticky bar — announces "Quick actions toolbar"
  □ Check mobile menu footer — shows current year

SESSION 2 SMOKE TEST:
  □ Click "Request a Quote" on any service page — panel opens (no navigation)
  □ Click phone number CTA — check analytics dashboard for cta_click event
  □ Verify serviceType pre-fills on service detail pages
  □ Verify no remaining <Link href="/#quote-request"> in codebase (grep)

SESSION 3 SMOKE TEST:
  □ Visit /services — 5 cards render with correct titles and links
  □ Click any card — navigates to correct detail page
  □ Check page source — BreadcrumbList + ItemList structured data present
  □ Verify OG tags in <head>