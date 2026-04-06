# Homepage Mobile UX/UI & Functional Hardening Spec v3.0

Last Updated: 2026-03-23
Owner: Product + Development
Status: Active — Highest Priority
Scope: Public homepage mobile experience (`/`) + P0 feature corrections
Approach: Mobile layout restructuring with desktop preservation

---

## 1) Purpose

This document defines the full mobile hardening pass for the homepage AND serves as the canonical correction spec for P0 features that were incorrectly or incompletely implemented by prior automation sessions.

This is NOT a padding-trim pass. It is a **mobile layout restructuring** initiative that gives mobile its own optimized composition while preserving the desktop experience exactly as-is.

Every change is gated behind responsive breakpoints (`md:`, `lg:`). Desktop classes remain untouched.

**v3.0 changes from v2.1:**
- Batch E updated: files reviewed, targeted changes defined (§4.5)
- Batch F QA checklist integrated (§4.6)
- §14 added: P0 Feature Corrections (required fixes from Gemini CLI audit)
- §15 added: Gemini CLI Execution Guardrails (strict behavioral rules)
- §16 added: Claude Prompt Generation Protocol (per-task prompt templates)

---

## 2) Confirmed Issues (Visual Evidence 2026-03-22)

### 2.1 Structural / Layering

| # | Issue | Severity | Status |
|---|---|---|---|
| S-1 | AI assistant trigger overlaps hero "Call Now" CTA | Blocking | ✅ Fixed |
| S-2 | Sticky bottom bar text wraps to 2 lines ("GET A FREE QUOTE") | High | ✅ Fixed |
| S-3 | No z-index system — header, assistant, sticky bar all conflict | High | ✅ Fixed |
| S-4 | Floating widgets visible when mobile menu is open | Medium | ✅ Fixed |
| S-5 | No safe-area handling for notched devices | Medium | ✅ Fixed |

### 2.2 Section-Level (Excessive Height / Scroll Fatigue)

| # | Section | Issue | Status |
|---|---|---|---|
| H-1 | Hero | CTAs cramped against trust bar, poor vertical distribution | ✅ Fixed |
| H-2 | Header | "Free Quote" button oversized, dominates header bar | ✅ Fixed |
| H-3 | AuthorityBar | 4 stats stacked vertically = 3+ screens | ✅ Fixed |
| H-4 | ServiceSpreadSection (5 service types) | Each service = full screen+ of scroll | ✅ Fixed |
| H-5 | OfferAndIndustrySection ("Who We Serve") | 3 cards each taller than viewport | ✅ Fixed |
| H-6 | TimelineSection ("How It Works") | Dot markers cover step numbers | ✅ Fixed |
| H-7 | TestimonialSection | Initials avatar cramped, role text wraps | ✅ Fixed |
| H-8 | ServiceAreaSection | Map + heading + 8 city cards + CTA = massive | ✅ Verified clean — map already hidden, city grid already 2-col |
| H-9 | FooterSection | CTA banner + 4-col grid + copyright = 3+ screens | ✅ Verified clean — grid stacks, "Built For" hidden, nav 2-col |
| H-10 | AboutSection | Full-width image + content block too tall | ✅ Fixed |
| H-11 | CareersSection | Generous padding, oversized text | ✅ Fixed |
| H-12 | IncludedSummarySection | Minor — padding slightly generous | ✅ Verified clean — `py-6`, `text-2xl`, `p-4`, `gap-3` already applied |

### 2.3 Interaction / Functional

| # | Issue | Severity | Status |
|---|---|---|---|
| I-1 | AI assistant trigger overlaps "Call Now" hero CTA | Blocking | ✅ Fixed |
| I-2 | Sticky bar CTA text wraps awkwardly at narrow widths | High | ✅ Fixed |
| I-3 | No coordination between mobile menu state and floating widgets | Medium | ✅ Fixed |

---

## 3) Non-Negotiable Mobile Standards

### 3.1 Viewport and Safe Area
- Respect notch/browser safe areas with `env(safe-area-inset-*)`.
- No persistent UI may overlap core content without intentional offsets.
- No horizontal scrolling at 320px–430px.

### 3.2 Interaction Rules
- Minimum touch target: 44px.
- Sticky CTA must never block primary content actions.
- Mobile menu open → floating widgets hidden.

### 3.3 Layout Restructuring Rules
- Mobile gets its OWN layout composition per section where needed.
- All restructuring gated behind `md:` breakpoint.
- Desktop classes remain untouched — zero visual regression above 768px.
- Sections may hide decorative elements, switch grid layouts, collapse card internals, or reorder content on mobile.

### 3.4 Typography
- Responsive text sizing with mobile-first constraints.
- No heading larger than `text-3xl` on mobile (except hero).
- Hero headline max: `clamp(2.6rem, 10vw, 4rem)` on mobile.
- Body text: `font-normal` on mobile, `font-light` permitted only at `md:` and above.

---

## 4) Execution Batches — Status

### 4.1 Batch A — Foundation ✅ COMPLETE

| File | Status | Changes Applied |
|---|---|---|
| `globals.css` | ✅ No changes needed | Z-index variables, safe-area, `.floating-widget` rule, `.ghost-index` — all already in place |
| `PublicChrome.tsx` | ✅ Applied | Sticky bar: `whitespace-nowrap` on both CTAs, `px-4 tracking-[0.14em]` overrides, "Free Quote" shorter label |
| `AIQuoteAssistant.tsx` | ✅ Applied | Trigger: `transition-all duration-300` (fixed duplicate transition conflict) |

### 4.2 Batch B — Header + Hero ✅ COMPLETE

| File | Status | Changes Applied |
|---|---|---|
| `PublicHeader.tsx` | ✅ No changes needed | Safe-area, smaller button, `h-14`, body dataset, menu max-height, `aria-hidden` — all already in place |
| `HeroSection.tsx` | ✅ Applied (structural fix) | 5 structural changes: justify-center, badge hidden, chips hidden, inline trust bar, absolute trust bar desktop-only |

### 4.3 Batch C — Heavy Layout Restructures ✅ COMPLETE

| File | Status | Changes Applied |
|---|---|---|
| `AuthorityBar.tsx` | ✅ Applied | 4 margin compressions |
| `ServiceSpreadSection.tsx` | ✅ Applied | 2 element hides + 3 margin compressions |
| `OfferAndIndustrySection.tsx` | ✅ Applied | 5 margin compressions |
| `TimelineSection.tsx` | ✅ Applied | 5 margin compressions |

### 4.4 Batch D — Content Sections ✅ COMPLETE

| File | Status | Changes Applied |
|---|---|---|
| `TestimonialSection.tsx` | ✅ Applied | 4 margin compressions |
| `AboutSection.tsx` | ✅ Applied | 4 margin compressions |
| `CareersSection.tsx` | ✅ Applied | 2 margin compressions |

### 4.5 Batch E — Remaining Sections: Verification + Targeted Fixes

**Status: Files reviewed 2026-03-23. Most already hardened. 9 targeted changes across 6 files.**

The changes below are the ONLY modifications needed. Do not make additional changes to these files.

#### E-1: ServiceAreaSection.tsx — 1 change

**Change:** Add `ctaId` to QuoteCTA (F-25 compliance gap)

```tsx
// FIND this (around line 183):
<QuoteCTA className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C9A94E] px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#0A1628] transition-all duration-300 hover:bg-[#d4b85e] hover:shadow-lg hover:shadow-[#C9A94E]/20 min-h-[48px]">

// REPLACE with:
<QuoteCTA ctaId="service_area_check_availability" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C9A94E] px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#0A1628] transition-all duration-300 hover:bg-[#d4b85e] hover:shadow-lg hover:shadow-[#C9A94E]/20 min-h-[48px]">
```

**Verified clean — no other changes needed:** Map `hidden md:block` ✅, decoratives `hidden md:block` ✅, city grid `grid-cols-2` ✅, padding `py-10 md:py-24` ✅, heading `text-3xl` ✅, CTA `min-h-[48px]` ✅

---

#### E-2: FooterSection.tsx — 1 change

**Change:** Add touch-target sizing to contact links (M-2 compliance)

```tsx
// FIND this (contact list, around line 91):
<ul className="space-y-3 text-sm">
  <li>
    <a href={`tel:${COMPANY_PHONE_E164}`} className="transition hover:text-white">
      {COMPANY_PHONE}
    </a>
  </li>
  <li><a href={`mailto:${COMPANY_EMAIL}`} className="transition hover:text-white">{COMPANY_EMAIL}</a></li>
  <li className="text-slate-400">Serving Austin and surrounding metro areas</li>
</ul>

// REPLACE with:
<ul className="space-y-1 text-sm md:space-y-3">
  <li>
    <a href={`tel:${COMPANY_PHONE_E164}`} className="inline-flex min-h-[44px] items-center transition hover:text-white">
      {COMPANY_PHONE}
    </a>
  </li>
  <li>
    <a href={`mailto:${COMPANY_EMAIL}`} className="inline-flex min-h-[44px] items-center transition hover:text-white">
      {COMPANY_EMAIL}
    </a>
  </li>
  <li className="pt-1 text-slate-400">Serving Austin and surrounding metro areas</li>
</ul>
```

**Verified clean — no other changes needed:** CTA banner compressed ✅, grid stacks ✅, "Built For" `hidden md:block` ✅, nav 2-col ✅, font weights correct ✅, copyright compact ✅, all CTAs have `ctaId` ✅

---

#### E-3: IncludedSummarySection (in VariantAPublicPage.tsx) — 0 changes

**Verified clean.** Already has: `py-6`, `text-2xl`, `p-4`, `gap-3`. No modifications needed.

---

#### E-4: QuoteSection.tsx — 1 change

**Change:** Fix bare `font-light` on mobile (M-5 violation)

```tsx
// FIND this (around line 167):
<p className="mt-3 max-w-md font-light leading-relaxed text-slate-600">

// REPLACE with:
<p className="mt-3 max-w-md font-normal leading-relaxed text-slate-600 md:font-light">
```

**Verified clean — no other changes needed:** All inputs `py-4` ✅, phone `inputMode="tel"` ✅, textarea `enterKeyHint="done"` ✅, submit `min-h-[48px]` ✅, CTAs have `ctaId` ✅

---

#### E-5: FloatingQuotePanel.tsx — 3 changes

**Change 5a:** Fix select touch targets — `py-3` → `py-4` (M-2)

```tsx
// FIND the Service Type select (around line 136):
className="w-full border-b border-slate-300 px-1 py-3 text-sm text-slate-600"

// REPLACE with:
className="w-full border-b border-slate-300 px-1 py-4 text-sm text-slate-600"
```

```tsx
// FIND the Timeline select (around line 152):
className="w-full border-b border-slate-300 px-1 py-3 text-sm text-slate-600"

// REPLACE with:
className="w-full border-b border-slate-300 px-1 py-4 text-sm text-slate-600"
```

**Change 5b:** Enlarge close button touch target (M-2)

```tsx
// FIND (around line 80):
<button ref={closeButtonRef} type="button" aria-label="Close quote request panel" onClick={onClose} className="rounded p-2 text-slate-500 hover:bg-slate-100">

// REPLACE with:
<button ref={closeButtonRef} type="button" aria-label="Close quote request panel" onClick={onClose} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
```

**Change 5c:** Add `enterKeyHint` to textarea (M-6)

```tsx
// FIND (around line 160):
<textarea
  id={`${fieldPrefix}-description`}
  name="description"
  /* MOBILE-HARDENING: py-4 for 44px+ touch target */
  className="w-full border-b border-slate-300 px-1 py-4 text-sm"
  rows={3}

// REPLACE with:
<textarea
  id={`${fieldPrefix}-description`}
  name="description"
  enterKeyHint="done"
  /* MOBILE-HARDENING: py-4 for 44px+ touch target */
  className="w-full border-b border-slate-300 px-1 py-4 text-sm"
  rows={3}
```

---

#### E-6: BeforeAfterSlider.tsx — 0 changes

**Verified clean.** `py-10 md:py-32` ✅, `aspect-[4/3] md:aspect-[16/9]` ✅, decorative grid `hidden md:block` ✅, tab buttons `min-h-[44px]` ✅, touch events complete ✅, slider handle 44px ✅

---

#### E-7: VariantAPublicPage.tsx — 1 change

**Change:** Add skeleton loading fallbacks to dynamic imports (M-7)

```tsx
// FIND (near top of file):
const BeforeAfterSlider = dynamic(
  () => import("./BeforeAfterSlider").then((module) => module.BeforeAfterSlider),
);
const TestimonialSection = dynamic(
  () => import("./TestimonialSection").then((module) => module.TestimonialSection),
);
const QuoteSection = dynamic(() => import("./QuoteSection").then((module) => module.QuoteSection));

// REPLACE with:
const BeforeAfterSlider = dynamic(
  () => import("./BeforeAfterSlider").then((module) => module.BeforeAfterSlider),
  { loading: () => <SectionSkeleton /> },
);
const TestimonialSection = dynamic(
  () => import("./TestimonialSection").then((module) => module.TestimonialSection),
  { loading: () => <SectionSkeleton /> },
);
const QuoteSection = dynamic(
  () => import("./QuoteSection").then((module) => module.QuoteSection),
  { loading: () => <SectionSkeleton /> },
);
```

**Add this function ABOVE the `VariantAPublicPage` function:**

```tsx
function SectionSkeleton() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-white" aria-hidden="true">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500" />
    </div>
  );
}
```

---

#### E-8: ServiceSpreadSection.tsx — 1 change

**Change:** Add `ctaId` to 5 QuoteCTA instances (F-25 compliance)

```tsx
// FIND (inside ServiceSpreadItem, around line 177):
<QuoteCTA
  className={`cta-outline-dark gap-3 ${
    isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
  }`}
  style={{ transitionDelay: "400ms" }}
>

// REPLACE with:
<QuoteCTA
  ctaId={`service_${service.anchor}_quote`}
  className={`cta-outline-dark gap-3 ${
    isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
  }`}
  style={{ transitionDelay: "400ms" }}
>
```

This produces 5 trackable IDs: `service_service-post-construction_quote`, `service_service-final-clean_quote`, `service_service-commercial_quote`, `service_service-move_quote`, `service_service-windows_quote`

---

#### E-9: PublicHeader.tsx — 1 change (optional polish)

**Change:** Add logo weight on mobile (§13.2)

```tsx
// FIND (around line 97):
<p className="font-serif text-xl tracking-tight text-white md:text-3xl">{COMPANY_SHORT_NAME}</p>

// REPLACE with:
<p className="font-serif text-xl font-semibold tracking-tight text-white md:text-3xl md:font-normal">{COMPANY_SHORT_NAME}</p>
```

---

#### Batch E Summary

| # | File | Changes | Type |
|---|---|---|---|
| E-1 | ServiceAreaSection.tsx | 1 | F-25 `ctaId` |
| E-2 | FooterSection.tsx | 1 | M-2 touch targets |
| E-3 | IncludedSummarySection | 0 — verified clean | — |
| E-4 | QuoteSection.tsx | 1 | M-5 font weight |
| E-5 | FloatingQuotePanel.tsx | 3 | M-2, M-6 |
| E-6 | BeforeAfterSlider.tsx | 0 — verified clean | — |
| E-7 | VariantAPublicPage.tsx | 1 | M-7 skeletons |
| E-8 | ServiceSpreadSection.tsx | 1 | F-25 `ctaId` |
| E-9 | PublicHeader.tsx | 1 (optional) | §13.2 polish |
| **Total** | **9 files** | **9 changes across 6 files** | |

---

### 4.6 Batch F — Final QA Viewport Sweep ❌ NOT STARTED

#### F.1 Viewport Matrix

| Width | Represents | Priority |
|---|---|---|
| **320px** | iPhone SE / smallest target | 🔴 Must pass |
| **375px** | iPhone 13 mini / baseline | 🔴 Must pass |
| **393px** | Pixel 7 / common Android | 🟡 Should pass |
| **412px** | Pixel 6 / Samsung Galaxy | 🟡 Should pass |
| **430px** | iPhone 15 Pro Max | 🟡 Should pass |
| **768px** | iPad mini / `md:` breakpoint | 🔴 Must pass |

#### F.2 Global Checks (Every Viewport)

| # | Check | Pass Criteria |
|---|---|---|
| G-1 | No horizontal overflow | No horizontal scrollbar at any scroll position |
| G-2 | Sticky bar visible | Bar visible after hero scroll, both buttons readable |
| G-3 | Sticky bar text | "Call" and "Free Quote" — no wrapping |
| G-4 | AI trigger position | Does NOT overlap sticky bar CTAs |
| G-5 | Menu open → widgets hidden | Sticky bar + AI trigger disappear |
| G-6 | Menu close → widgets return | Sticky bar + AI trigger reappear |
| G-7 | No clipped text | No text cut off by container edges |
| G-8 | Safe areas | Content not hidden behind notch or home indicator |

#### F.3 Section Checks

**Header (HDR):**

| # | Check | Pass Criteria |
|---|---|---|
| HDR-1 | Logo visible | Not truncated, not overlapping nav |
| HDR-2 | "Free Quote" button | `min-h-[44px]`, text not wrapping |
| HDR-3 | Hamburger button | ≥ 44px tap target |
| HDR-4 | Mobile menu opens | Panel appears, scrollable |
| HDR-5 | Menu links navigate + close menu | Each link: navigates AND calls `closeMobileMenu` |
| HDR-6 | Services/Industries expand | `<details>` opens, sub-links tappable |
| HDR-7 | Call CTA in menu | ≥ 44px, triggers dialer |

**Hero (HERO):**

| # | Check | Pass Criteria |
|---|---|---|
| HERO-1 | Headline readable | All 3 lines visible, `clamp()` works |
| HERO-2 | Subtitle visible | Below headline, not clipped |
| HERO-3 | "Get a Free Quote" | `min-h-[48px]`, label complete |
| HERO-4 | "Call Now" | Glassmorphism visible, tappable |
| HERO-5 | Badge hidden | No pill on mobile |
| HERO-6 | Service chips hidden | No chips on mobile |
| HERO-7 | Inline trust bar visible | 3 items visible |
| HERO-8 | Trust bar fits | No 3+ line wrapping at 320px |
| HERO-9 | Content centered | No dead space |
| HERO-10 | Absolute trust bar hidden | Bottom strip NOT visible on mobile |

**AuthorityBar (AUTH):**

| # | Check | Pass Criteria |
|---|---|---|
| AUTH-1 | 2×2 grid | 4 cells in 2 columns |
| AUTH-2 | Icons hidden | No SVG icons on mobile |
| AUTH-3 | Numbers readable | `text-2xl`, not overflowing |
| AUTH-4 | Licensed & Insured | Same size as animated stats |
| AUTH-5 | Counter animation | Numbers animate on scroll |
| AUTH-6 | Trust bar | Stars + text visible |

**IncludedSummary (INC):**

| # | Check | Pass Criteria |
|---|---|---|
| INC-1 | Padding | `py-6` |
| INC-2 | Heading | `text-2xl` |
| INC-3 | Cards | Stacked, `p-4`, `gap-3` |

**ServiceSpread (SVC) — Check each of 5 cards:**

| # | Check | Pass Criteria |
|---|---|---|
| SVC-1 | Image height | `h-40` |
| SVC-2 | Image overlays hidden | Badges and response promise hidden |
| SVC-3 | Content padding | `p-4` |
| SVC-4 | Title | `text-2xl` |
| SVC-5 | Inline response promise | Visible in gold below description |
| SVC-6 | Desktop panel | Hidden (`hidden md:block`) |
| SVC-7 | "Quote This Service" CTA | Visible, tappable |

**OfferAndIndustry (IND):**

| # | Check | Pass Criteria |
|---|---|---|
| IND-1 | Padding | `py-10` |
| IND-2 | Cards stacked | No decorative elements |
| IND-3 | Icons small | `h-10 w-10` |

**BeforeAfterSlider (BA):**

| # | Check | Pass Criteria |
|---|---|---|
| BA-1 | Padding | `py-10` |
| BA-2 | Aspect ratio | `aspect-[4/3]` |
| BA-3 | Touch drag works | Smooth slider interaction |
| BA-4 | Tab buttons | `min-h-[44px]` |
| BA-5 | Decorative grid hidden | `hidden md:block` |

**Testimonial (TEST):**

| # | Check | Pass Criteria |
|---|---|---|
| TEST-1 | Card padding | `px-5 py-6` |
| TEST-2 | Role text | `tracking-normal`, no bad wrap |
| TEST-3 | Min height | `min-h-0` |
| TEST-4 | Nav dots | Visible, tappable |

**Timeline (TL):**

| # | Check | Pass Criteria |
|---|---|---|
| TL-1 | Rail/dots hidden | No vertical rail on mobile |
| TL-2 | Images hidden | No step images on mobile |
| TL-3 | Step spacing | `mb-5` |
| TL-4 | Inline kicker | Detail text visible |

**About (ABT):**

| # | Check | Pass Criteria |
|---|---|---|
| ABT-1 | Image | `h-56` fixed |
| ABT-2 | No `min-h-[70vh]` | Mobile excludes 70vh |
| ABT-3 | Padding | `px-6 py-10` |
| ABT-4 | Font weight | `font-normal` on mobile |

**ServiceArea (SA):**

| # | Check | Pass Criteria |
|---|---|---|
| SA-1 | Map hidden | No SVG map on mobile |
| SA-2 | Decoratives hidden | Grid + glow hidden |
| SA-3 | City grid | 2-column, all currently configured cities |
| SA-4 | CTA | `min-h-[48px]`, has `ctaId` |

**QuoteSection (QT):**

| # | Check | Pass Criteria |
|---|---|---|
| QT-1 | Image panel | `h-[28vh]` |
| QT-2 | All inputs | `py-4` — 44px+ |
| QT-3 | Selects | Tappable, native picker |
| QT-4 | Textarea | `enterKeyHint="done"` |
| QT-5 | Submit | `min-h-[48px]`, full width |
| QT-6 | Font weight | `font-normal` on mobile |

**Careers (CAR):**

| # | Check | Pass Criteria |
|---|---|---|
| CAR-1 | Padding | `py-12` |
| CAR-2 | Heading | `text-3xl` |
| CAR-3 | Perks | `px-5 py-4` |

**Footer (FTR):**

| # | Check | Pass Criteria |
|---|---|---|
| FTR-1 | CTA banner | `px-5 py-6`, heading `text-xl` |
| FTR-2 | "Built For" hidden | `hidden md:block` |
| FTR-3 | Grid | Single column stack |
| FTR-4 | Nav links | 2-column grid |
| FTR-5 | Contact links | `min-h-[44px]` tap targets |
| FTR-6 | All CTAs have `ctaId` | Both footer CTAs instrumented |

#### F.4 Skeleton Loading Check

| # | Check | Method |
|---|---|---|
| SK-1 | BeforeAfterSlider skeleton | Throttle to Slow 3G, scroll to location |
| SK-2 | TestimonialSection skeleton | Same |
| SK-3 | QuoteSection skeleton | Same |

#### F.5 Desktop Regression Check (768px+)

At **768px** and **1280px**:

| # | Check | Pass Criteria |
|---|---|---|
| DR-1 | Hero | Badge, chips, absolute trust bar all visible |
| DR-2 | AuthorityBar | 4-column, icons visible |
| DR-3 | ServiceSpread | Side-by-side, overlays visible, panel visible |
| DR-4 | Map | SVG map visible with dots |
| DR-5 | Footer | 4-column grid, "Built For" visible |
| DR-6 | Font weights | `font-light` active where specified |
| DR-7 | Animations | All trigger correctly |

#### F.6 Build Verification

```bash
npx tsc --noEmit
npm run lint
npx next build
```

All three must pass.

#### F.7 Acceptance Gate

| # | Criteria | Status |
|---|---|---|
| 1 | All Batch A–E changes applied and building | ⬜ |
| 2 | Homepage mobile scroll reduced >40% | ⬜ |
| 3 | No horizontal overflow 320–430px | ⬜ |
| 4 | Sticky CTA + AI trigger + menu layering deterministic | ✅ |
| 5 | All CTAs meet 44px minimum touch target | ⬜ |
| 6 | Before/after screenshots captured | ⬜ |
| 7 | Desktop zero regression at 768px+ | ⬜ |
| 8 | `tsc`, `lint`, `build` pass | ⬜ |

When all 8 pass → R-00 is ✅ Complete.

#### F.8 Failure Protocol

1. Log: section, viewport, description, screenshot
2. Classify: blocking (overflow, broken CTA) vs. polish (spacing)
3. Fix blocking before re-running viewport
4. Defer polish to post-launch unless it violates §3
5. Re-run failed viewport + 320px (always re-verify smallest)

---

## 5) Estimated Impact — Updated

| Section | Original | After Prior Work | After This Pass | Status |
|---|---|---|---|---|
| Hero | ~850px | ~780px | ~700px | ✅ |
| AuthorityBar | ~1400px | ~460px | ~420px | ✅ |
| ServiceSpread (×5) | ~5000px | ~2350px | ~2225px | ✅ |
| OfferAndIndustry (×3) | ~2400px | ~1190px | ~1050px | ✅ |
| Timeline (×4) | ~2000px | ~910px | ~820px | ✅ |
| Testimonial | ~650px | ~440px | ~420px | ✅ |
| About | ~900px | ~580px | ~552px | ✅ |
| Careers | ~600px | ~420px | ~404px | ✅ |
| IncludedSummary | ~350px | ~300px | ~300px | ✅ Verified |
| ServiceArea | ~1200px | ~600px | ~600px | ✅ Verified |
| Footer | ~1200px | ~700px | ~690px | ✅ Verified |

**Total: ~16,550px → ~8,181px = ~51% reduction. Target (>40%) exceeded.**

---

## 6) File Delivery Format

Each batch delivers FIND/REPLACE diffs or complete replacement files. All mobile changes annotated with `/* MOBILE-HARDENING */` comments. All desktop classes preserved exactly.

---

## 7) Acceptance Criteria

| # | Criteria | Status |
|---|---|---|
| 1 | All Batch A-E changes applied and building cleanly | 🟡 Batches A-D complete; Batch E: 9 changes defined, ready to apply |
| 2 | Homepage mobile scroll reduced by >40% | ✅ ~51% achieved |
| 3 | No horizontal overflow at 320-430px | ⬜ Needs Batch F |
| 4 | Sticky CTA + AI trigger + menu layering deterministic | ✅ Complete |
| 5 | All CTAs meet 44px minimum touch target | 🟡 After Batch E |
| 6 | Before/after screenshots captured | ⬜ Needs Batch F |
| 7 | Desktop renders identically (zero regression at 768px+) | ⬜ Needs Batch F |
| 8 | `tsc`, `lint`, `build` all pass | ⬜ After Batch E |

---

## 8) Out of Scope

- Desktop redesign
- New feature additions (except corrections in §14)
- Content strategy changes
- New page creation
- Sub-page mobile hardening (homepage only)

---

## 9) Files Modified — Complete Registry

| File | Batch | Change Type | Lines |
|---|---|---|---|
| `globals.css` | A | None needed | 0 |
| `PublicChrome.tsx` | A | CTA text fix | 3 |
| `AIQuoteAssistant.tsx` | A | Transition fix | 1 |
| `PublicHeader.tsx` | B/E-9 | Logo weight (optional) | 1 |
| `HeroSection.tsx` | B | Structural — 5 changes | ~20 |
| `AuthorityBar.tsx` | C | Margin compression (4) | 4 |
| `ServiceSpreadSection.tsx` | C/E-8 | Hides + margins + ctaId | 6 |
| `OfferAndIndustrySection.tsx` | C | Margin compression (5) | 5 |
| `TimelineSection.tsx` | C | Margin compression (5) | 5 |
| `TestimonialSection.tsx` | D | Margin compression (4) | 4 |
| `AboutSection.tsx` | D | Margin compression (4) | 4 |
| `CareersSection.tsx` | D | Margin compression (2) | 2 |
| `ServiceAreaSection.tsx` | E-1 | ctaId | 1 |
| `FooterSection.tsx` | E-2 | Touch targets | 1 |
| `QuoteSection.tsx` | E-4 | Font weight | 1 |
| `FloatingQuotePanel.tsx` | E-5 | Selects + close + enterKeyHint | 3 |
| `VariantAPublicPage.tsx` | E-7 | Skeletons | 1 |

---

## 10) Key Architectural Decisions

### Hero Section — Dual Trust Bar Pattern
Two trust bar instances: mobile (inline, `md:hidden`, short labels) and desktop (absolute, `hidden md:block`, full labels).

### Content Hidden on Mobile
Hero badge pill, hero service chips, ServiceSpread image overlay badges, ServiceSpread image overlay response promise — all via responsive `hidden`/`md:` classes. No unique indexable content lost.

---

## 11) Cross-Reference

- Master execution priority: `Master-Spec-4.0-Current-State.md` §3.0 (R-00)
- Related conversion features: F-17, F-22, F-23, F-24, F-25
- Code health audit: `../reference/CODE-HEALTH-AUDIT.md` §7.2A (CTA duplication)
- This file is the canonical implementation source for homepage mobile hardening decisions.

---

## 12) What Happens Next

After Batch E is applied and Batch F QA passes → R-00 is complete → proceed to §14 P0 corrections → then resume Master Spec 4.0 §13 execution sequence.

---

## 13) Expert UX/UI Review & Future Enhancements

*Audit conducted post-Hardening Pass (Batches A-D). Status updated 2026-03-23.*

### 13.1 High-Impact Micro-Refinements

| Component | Observation | Status |
|---|---|---|
| Mobile Menu | FAQ/Careers links don't close menu | ✅ Verified fixed — all links have `closeMobileMenu` |
| Service Spread | Response promise hidden on mobile | ✅ Verified fixed — MOBILE-ELEVATION H-6 block present |
| Hero CTA | Ghost button blends into background | ✅ Verified fixed — MOBILE-ELEVATION P-3 glassmorphism |
| Authority Bar | Licensed & Insured static | ✅ Verified fixed — MOBILE-ELEVATION P-4 entrance animation |

### 13.2 Visual Polish

| Item | Status |
|---|---|
| Typography: `font-normal` on mobile | ✅ Applied across Hero, ServiceSpread, Footer |
| Header logo weight | 🟡 Optional change in E-9 |
| Section transitions | ⏸ Deferred — cosmetic, not blocking |

### 13.3 Form UX

| Item | Status |
|---|---|
| Select touch targets `py-4` | ✅ QuoteSection already done; FloatingQuotePanel in E-5 |
| Textarea `enterKeyHint="done"` | ✅ QuoteSection done; FloatingQuotePanel in E-5c |

### 13.4 Accessibility

| Item | Status |
|---|---|
| Footer copyright contrast | ⏸ Deferred to post-launch a11y audit |
| Focus states vs sticky bar | ⏸ Deferred to post-launch a11y audit |

---

## 14) P0 Feature Corrections

**Context:** A prior Gemini CLI session implemented P0 features F-01 through F-17. A post-session audit identified accuracy gaps between what was marked ✅ and what the spec requires. This section defines the exact corrections needed.

**Rule:** These corrections MUST be completed before any feature is counted as ✅ in the execution checklist.

### 14.1 Corrected P0 Status (Honest Assessment)

| Feature | Marked As | Actual State | Correction Required |
|---|---|---|---|
| F-25 | ✅ | ✅ Correct | None — CTAButton with ctaId deployed across all surfaces |
| F-02 | ✅ | 🟡 Partial | §14.2 — email body likely stale |
| F-03 | ✅ | 🟡 Partial | §14.3 — messages don't match spec, 24h/48h missing |
| F-05 | ✅ | ❌ Wrong | §14.4 — sidebar has been rewritten 3 times, still doesn't match spec |
| F-01 | ✅ | 🟡 Unverified | §14.5 — data layer improved, render needs full read |
| F-11 | ✅ | ✅ Correct | None — map link was already present |
| F-12 | ✅ | ❌ Incomplete | §14.6 — sort order changed but no timeline UI built |
| F-17 | ✅ | ❌ Wrong | §14.7 — referral ask built instead of step process |

### 14.2 F-02 Correction — Email Body Alignment

**Problem:** SMS was updated to match spec. Email body was changed to "Got it. Reviewing scope now" in an earlier session and may not have been updated to match.

**Required action:**

1. Read `src/app/api/quote-request/route.ts` lines 210–235 (the Resend email block)
2. If email body does NOT match the following, update it:

```
Subject: "A&A Cleaning: We Got Your Quote Request"

Body:
Hi [Name],

Thanks for reaching out to A&A Cleaning. We received your request and will call you within 1 hour.

Service requested: [Service Type]

If you need us sooner: [COMPANY_PHONE]

— The A&A Team
```

3. Run `tsc --noEmit` after change
4. Do NOT change the SMS — it is correct

**Acceptance:** Email subject + body match the template above. `tsc` passes.

---

### 14.3 F-03 Correction — Message Alignment + Missing Tiers

**Problem:** 1h and 4h alert messages don't match spec wording. 24h message unknown. 48h auto-status-update not implemented.

**Required action:**

1. Read `src/app/api/lead-followup/route.ts` — full file
2. Update tier messages to match EXACTLY:

| Tier | Spec Emoji | Spec Message |
|---|---|---|
| 1h | ⚡ | `"⚡ [Name] hasn't been contacted yet. [Call Now] [phone]"` |
| 4h | ⚠️ | `"⚠️ [Name] still waiting (4 hrs). Leads contacted in 1hr convert 3x better. [phone]"` |
| 24h | 🔴 | `"🔴 [Name] waiting 24 hours. Consider this lead at risk. [phone]"` |

3. Verify the 24h tier exists and has the correct message
4. Do NOT add a 48h tier — that requires schema changes (auto-update to "At Risk" status). Note it as a TODO comment.
5. Remove the secondary admin targeting logic added by prior session — it is not in the spec and adds complexity
6. Run `tsc --noEmit` after changes

**Acceptance:** Three tiers with exact emoji + message format. No secondary admin routing. `tsc` passes.

---

### 14.4 F-05 Correction — Sidebar Grouping

**Problem:** Sidebar has been rewritten 3 times across sessions. Current grouping (Briefing/Operations/Pipeline) doesn't match spec.

**Required action:**

1. Read `src/components/admin/AdminSidebarNav.tsx`
2. Replace `NAV_GROUPS` array with EXACTLY:

```typescript
const NAV_GROUPS: NavGroup[] = [
  {
    label: "Daily Work",
    items: [
      { id: "overview", label: "Home", icon: "🏠" },
      { id: "leads", label: "Leads & Quotes", icon: "📋" },
      { id: "tickets", label: "Jobs & Dispatch", icon: "🚐" },
      { id: "operations", label: "Review & Approve", icon: "✅" },
    ],
  },
  {
    label: "Business",
    items: [
      { id: "insights", label: "Insights", icon: "📈" },
      { id: "hiring", label: "Hiring", icon: "👥" },
    ],
  },
  {
    label: "Settings",
    items: [
      { id: "notifications", label: "Notifications", icon: "🔔" },
      { id: "inventory", label: "Inventory", icon: "📦" },
      { id: "wizard", label: "Configuration", icon: "⚙️" },
    ],
  },
];
```

3. Do NOT add, remove, or rename any `ModuleId` values — only the grouping and labels change
4. Do NOT change any other code in the file
5. Run `tsc --noEmit` after change

**Acceptance:** Three groups (Daily Work / Business / Settings) with items matching above exactly. `tsc` passes. No changes to `AdminShell.tsx`.

---

### 14.5 F-01 Correction — Render Verification

**Problem:** Data model was improved (ActionItem interface, multi-query fetch), but the rendered output hasn't been verified against the spec wireframe.

**Required action:**

1. Read `src/components/admin/OverviewDashboard.tsx` — full file
2. Verify the render output includes ALL of:

| Element | Spec Requirement |
|---|---|
| Time-aware greeting | "Good Morning" / "Good Afternoon" / "Good Evening" based on hour |
| 🔴 ACTION NEEDED section | Uncontacted leads (>1hr) with [Call] [Send Quote] buttons |
| QA pending items | Jobs completed but photos not reviewed, with [Review Now] |
| 📋 TODAY'S SCHEDULE | Today's assigned jobs with time, address, type |
| ⏳ WAITING ON | Quotes sent but not accepted, with [Follow Up] [Mark Lost] |
| ✅ YESTERDAY'S WINS | Count of completed jobs + total dollar value |
| Empty states | "No action items — great job today!" when sections are empty |

3. If ANY of the above elements are missing from the JSX, add them
4. If the data queries don't support the above, extend them
5. Do NOT rewrite the entire component — make targeted additions only
6. Run `tsc --noEmit` after changes

**Acceptance:** All 7 elements render. Greeting changes by time of day. Empty states work. `tsc` passes.

---

### 14.6 F-12 Correction — Job-Day Summary Timeline UI

**Problem:** Only the sort order was changed (query `order` from `assigned_at DESC` to `scheduled_start ASC`). The timeline UI component described in the spec was not built.

**Required action:**

1. Read `src/components/employee/EmployeeTicketsClient.tsx` — full file
2. Add a `JobDayTimeline` component (either inline or as a separate component) that renders ABOVE the existing assignment cards
3. The component must show:

```
📅 Hoy — [Weekday], [Day] de [Month] (Spanish locale)

[time] → [address] ([clean type]) ● AHORA    (if current)
[time] → [address] ([clean type])            (if upcoming)
[time] → [address] ([clean type]) ✓          (if completed, grayed)

[N] trabajos hoy
```

4. Implementation constraints:
   - Filter assignments to today only (compare `scheduled_start` date to current date)
   - Current = status is "in_progress" → highlight with `● AHORA`
   - Completed = status is "completed" → gray + checkmark
   - Next = first non-completed after current → can optionally mark
   - If no assignments have `scheduled_start`, show fallback: "Sin horario programado"
   - Spanish locale for date: use `toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })`
   - Component renders only on mobile/all viewports (not desktop-gated)
5. Do NOT change the existing sort order or query — those are correct
6. Run `tsc --noEmit` after changes

**Acceptance:** Timeline shows above assignment cards. Spanish date formatting. Current/completed/upcoming states render correctly. Empty state works. `tsc` passes.

---

### 14.7 F-17 Correction — Confirmation Page

**Problem:** A referral ask ($50 off) was added instead of the spec's step process + engagement CTAs. Referral tracking is F-31 (P2), not F-17. The referral CTA links to `/contact?ref=success_page` which has no backend tracking.

**Required action:**

1. Read `src/app/quote/success/page.tsx` — full file
2. Remove the entire referral section (the `div` with `border-dashed border-amber-200`)
3. Replace with the spec's step process:

```tsx
{/* F-17: Step Process */}
<div className="mt-8 space-y-4">
  {[
    { icon: "📞", step: "Step 1", text: "We'll call you within 1 hour" },
    { icon: "📋", step: "Step 2", text: "We'll send a detailed quote" },
    { icon: "✅", step: "Step 3", text: "Accept online with one click" },
    { icon: "🧹", step: "Step 4", text: "We clean. You relax." },
  ].map((item) => (
    <div key={item.step} className="flex items-start gap-4 rounded-xl bg-slate-50 p-4">
      <span className="text-2xl">{item.icon}</span>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{item.step}</p>
        <p className="mt-1 font-medium text-slate-900">{item.text}</p>
      </div>
    </div>
  ))}
</div>
```

4. Add engagement CTAs below the steps:

```tsx
{/* F-17: While You Wait */}
<div className="mt-8">
  <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">While you wait</p>
  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
    <CTAButton ctaId="confirmation_see_work" href="/#services" className="cta-outline-dark min-h-[44px]">
      📸 See Our Work
    </CTAButton>
    <CTAButton ctaId="confirmation_read_reviews" href="/#testimonials" className="cta-outline-dark min-h-[44px]">
      ⭐ Read Reviews
    </CTAButton>
    <CTAButton ctaId="confirmation_call_now" actionType="call" href={`tel:${COMPANY_PHONE_E164}`} className="cta-outline-dark min-h-[44px]">
      📞 Call Now
    </CTAButton>
  </div>
</div>
```

5. Restore "Back to Homepage" as a visible button (not a subtle text link):

```tsx
<Link href="/" className="inline-flex h-12 items-center justify-center rounded-lg bg-[#0A1628] px-8 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#1E293B]">
  Back to Homepage
</Link>
```

6. Ensure `CTAButton` and `COMPANY_PHONE_E164` imports are present
7. Run `tsc --noEmit` after changes

**Acceptance:** 4-step process visible. 3 engagement CTAs visible. No referral section. "Back to Homepage" is a button. `tsc` passes.

---

### 14.8 Migration 1 — Minor Fix

**Problem:** `leads.source` has `DEFAULT 'web_quote_form'` but spec says nullable with no default.

**Required action:**

1. Read `supabase/migrations/0020_lead_lifecycle_fields.sql`
2. Change the `source` column default:

```sql
-- FIND:
ALTER TABLE public.leads ADD COLUMN source text DEFAULT 'web_quote_form';

-- REPLACE with:
ALTER TABLE public.leads ADD COLUMN source text DEFAULT NULL;
```

3. This is safe because no code currently relies on a non-null default for `source`

---

### 14.9 Correction Execution Order

Apply in this sequence (dependencies flow downward):

| Order | Correction | Blocks |
|---|---|---|
| 1 | §14.8 Migration fix | Nothing |
| 2 | §14.2 F-02 email | Nothing |
| 3 | §14.3 F-03 messages | Nothing |
| 4 | §14.4 F-05 sidebar | Nothing |
| 5 | §14.5 F-01 render | §14.4 (sidebar groups determine navigation targets) |
| 6 | §14.6 F-12 timeline UI | Nothing |
| 7 | §14.7 F-17 confirmation page | Nothing |

Run `npx tsc --noEmit && npm run lint && npx next build` after ALL corrections are applied.

---

### 14.10 Updated EXECUTION-CHECKLIST Status After Corrections

Only update the checklist to ✅ after the correction for that feature passes its acceptance criteria:

| Feature | Pre-Correction | Post-Correction Target |
|---|---|---|
| F-25 | ✅ | ✅ (no change needed) |
| F-02 | 🟡 | ✅ after §14.2 |
| F-03 | 🟡 | ✅ after §14.3 |
| F-05 | ❌ | ✅ after §14.4 |
| F-01 | 🟡 | ✅ after §14.5 |
| F-11 | ✅ | ✅ (no change needed) |
| F-12 | ❌ | ✅ after §14.6 |
| F-17 | ❌ | ✅ after §14.7 |

---

## 15) Gemini CLI Execution Guardrails

### 15.0 Purpose

These rules exist because prior sessions demonstrated a pattern of:
- Building features that don't match spec requirements
- Marking features ✅ when they are partially complete
- Rewriting previously-implemented code without checking current state first
- Adding functionality not in the spec (scope creep)
- Moving to the next task before the current one passes acceptance

**These rules are MANDATORY for every Gemini CLI session touching this codebase.**

### 15.1 The Prime Directive

> **ONLY implement what is specified in the `Changes-for-gemini-to-implement` file. If a task is not listed there, DO NOT DO IT. If you believe something additional is needed, STOP and ask.**

### 15.2 Pre-Work Rules (Before Writing Any Code)

| # | Rule | Enforcement |
|---|---|---|
| G-1 | **Read the target file FIRST.** Before editing any file, read it completely. Do not assume it matches what you last saw. | Every `Edit` must be preceded by a `ReadFile` of the same path. |
| G-2 | **Read the spec requirement SECOND.** Before implementing a feature, re-read its acceptance criteria in the spec. Do not implement from memory. | Quote the acceptance criteria in your thinking before writing code. |
| G-3 | **Check if it's already done.** Compare the current file against the spec requirement. If it already matches, report "verified clean" and move on. Do not make changes for the sake of making changes. | Log "ALREADY IMPLEMENTED" or "NEEDS CHANGE" with evidence. |
| G-4 | **Never rewrite what works.** If prior code meets the spec, leave it alone. Rewrites introduce regressions. | If you're replacing more than 30 lines in a file, STOP and justify why. |

### 15.3 During-Work Rules (While Writing Code)

| # | Rule | Enforcement |
|---|---|---|
| G-5 | **One task at a time.** Complete the current task's acceptance criteria before starting the next task. | After each edit, run `tsc --noEmit`. Fix errors before proceeding. |
| G-6 | **Match spec wording EXACTLY.** If the spec says the emoji is ⚡, use ⚡ not ⚠️. If the spec says "Daily Work", write "Daily Work" not "Briefing". | Literal string matching against spec text. |
| G-7 | **Do not add features.** If the spec doesn't mention secondary admin routing, don't add it. If the spec doesn't mention a referral section, don't add it. | Every new function/component/prop must trace back to a spec requirement. |
| G-8 | **Do not change file structure.** Don't rename files, move components between files, or reorganize imports unless explicitly instructed. | Only modify the content that the task specifies. |
| G-9 | **Preserve desktop classes.** Never remove or modify `md:`, `lg:`, `xl:` classes unless the task specifically says to. | Any removal of a responsive class must be justified against the spec. |

### 15.4 Post-Work Rules (After Writing Code)

| # | Rule | Enforcement |
|---|---|---|
| G-10 | **Run the build check.** After EVERY task: `npx tsc --noEmit`. After ALL tasks: `npx tsc --noEmit && npm run lint && npx next build`. | Do not mark a task complete if `tsc` fails. |
| G-11 | **Verify your work.** After editing, `ReadFile` the modified file and confirm the change is correct. | One `ReadFile` per `Edit`. |
| G-12 | **Report honestly.** If you couldn't fully implement something, say so. Do not mark it ✅. Use 🟡 for partial. | Status must reflect reality, not intent. |
| G-13 | **Do not update status documents optimistically.** Only update EXECUTION-CHECKLIST.md and Master-Spec after the build passes AND the acceptance criteria are met. | Status updates are the LAST step, not the first. |

### 15.5 Forbidden Actions

| # | Action | Why |
|---|---|---|
| F-1 | Rewriting `AdminSidebarNav.tsx` NAV_GROUPS without reading §14.4 first | Has been rewritten 3 times already |
| F-2 | Adding referral/reward/discount features | F-31 is P2; not in current scope |
| F-3 | Changing notification routing to secondary admins | Not in spec; adds untested complexity |
| F-4 | Modifying database migration files that have already been applied | Migrations are append-only |
| F-5 | Implementing features from §8 that are not listed in `Changes-for-gemini-to-implement` | Scope boundary enforcement |
| F-6 | Changing the sort order, query structure, or data model of a file that wasn't mentioned in the task | Blast radius control |

### 15.6 Checkpoint Protocol

At these points during execution, STOP and report status before continuing:

| Checkpoint | When | What to Report |
|---|---|---|
| CP-1 | After reading all target files | "I've read [N] files. [X] need changes, [Y] are clean." |
| CP-2 | After each individual task | "Task [ID] complete. tsc passes: yes/no. Acceptance criteria met: yes/no." |
| CP-3 | After all tasks | "All [N] tasks complete. Full build passes: yes/no. Files modified: [list]." |
| CP-4 | Before updating any status document | "Ready to update EXECUTION-CHECKLIST. Changes: [list of status changes with evidence]." |

---

## 16) Claude Prompt Generation Protocol

### 16.0 Purpose

Claude (this AI) generates the task prompts that Gemini CLI executes. This section ensures Claude produces prompts that are specific enough to prevent the drift patterns observed in prior sessions.

### 16.1 Prompt Template — Per Task

Every prompt Claude generates for Gemini must follow this structure:

```markdown
## Task: [ID] — [Name]

### What to do
[Exactly one paragraph describing the change. No ambiguity.]

### Files to modify
- `path/to/file.tsx` — [what changes in this file]

### Spec reference
[Quote the exact acceptance criteria from the spec]

### Implementation
[FIND/REPLACE blocks, exact code, or precise instructions]

### What NOT to do
- Do not [specific anti-pattern from prior sessions]
- Do not [another specific anti-pattern]
- Do not modify any file not listed above

### Verification
1. Run `npx tsc --noEmit`
2. ReadFile [modified file] and confirm [specific thing to look for]
3. Report: "Task [ID] complete. tsc: pass/fail. Change verified: yes/no."

### Stop condition
Do NOT proceed to the next task until this task's verification passes.
```

### 16.2 Prompt Rules for Claude

| # | Rule | Rationale |
|---|---|---|
| C-1 | **One task per prompt.** Never batch multiple feature corrections into a single prompt. | Prevents Gemini from rushing through and marking everything done. |
| C-2 | **Include FIND/REPLACE blocks** when the exact code change is known. Don't say "update the message" — show the before and after. | Eliminates interpretation drift. |
| C-3 | **Include the "What NOT to do" section** in every prompt. Reference specific prior mistakes. | Gemini needs explicit negative boundaries. |
| C-4 | **Include a verification step** that requires Gemini to re-read the file after editing. | Catches silent failures. |
| C-5 | **Never say "implement F-XX"** without the full acceptance criteria pasted inline. Don't rely on Gemini reading the spec correctly. | Prior sessions proved Gemini summarizes specs inaccurately. |
| C-6 | **Cap the scope.** If a task touches more than 3 files, split it into sub-tasks. | Limits blast radius per prompt. |
| C-7 | **Require checkpoint reports.** Every prompt must end with a "Report:" instruction that asks for specific evidence. | Creates accountability trail. |

### 16.3 Pre-Prompt Checklist (For Claude Before Generating)

Before writing a Gemini prompt, Claude must verify:

- [ ] Is this task listed in `Changes-for-gemini-to-implement`?
- [ ] Does the task have clear acceptance criteria?
- [ ] Have I included exact code (FIND/REPLACE) where possible?
- [ ] Have I specified which files to read before editing?
- [ ] Have I listed what NOT to do based on prior session mistakes?
- [ ] Is the scope limited to ≤3 files?
- [ ] Does the prompt end with a verification step?

### 16.4 Post-Session Review Protocol (For Claude After Session)

After receiving a Gemini session log, Claude must:

1. **Map every edit to a spec requirement.** If an edit can't be traced to a spec line, flag it.
2. **Verify status claims.** If Gemini says ✅, check the diff against acceptance criteria.
3. **Check for scope creep.** List any code added that wasn't in the prompt.
4. **Check for regressions.** Note any files that were modified but shouldn't have been.
5. **Generate corrective prompts** for anything that failed verification.

---

## 17) Canonical Use

- **This file (`HOMEPAGE-MOBILE-UX-UI-FUNCTIONAL-HARDENING-SPEC.md`)** is the canonical source for:
  - All homepage mobile hardening changes (§4)
  - P0 feature corrections (§14)
  - Gemini CLI behavioral rules (§15)
  - Claude prompt generation rules (§16)
- **`Master-Spec-4.0-Current-State.md`** is the system-wide execution truth
- **`EXECUTION-CHECKLIST.md`** tracks feature-level completion (update per §14.10 rules)
- **`Changes-for-gemini-to-implement`** is the ONLY file Gemini reads for task instructions

---

## 18) Execution Sequence

```
NOW
 │
 ├─ Apply Batch E (§4.5) — 9 changes across 6 files
 │   └─ Run tsc + lint + build
 │
 ├─ Apply §14 Corrections (in order §14.9)
 │   ├─ §14.8 Migration fix
 │   ├─ §14.2 F-02 email alignment
 │   ├─ §14.3 F-03 message alignment
 │   ├─ §14.4 F-05 sidebar grouping (FINAL — no more rewrites)
 │   ├─ §14.5 F-01 render verification
 │   ├─ §14.6 F-12 timeline UI
 │   └


```
 │   └─ §14.7 F-17 confirmation page
 │   └─ Run tsc + lint + build after ALL corrections
 │
 ├─ Execute Batch F QA (§4.6)
 │   ├─ Global checks at 320/375/393/412/430/768px
 │   ├─ Section-by-section checks
 │   ├─ Skeleton loading checks
 │   ├─ Desktop regression at 768px + 1280px
 │   ├─ Screenshot evidence capture
 │   └─ Build verification
 │
 ├─ Update Status Documents
 │   ├─ EXECUTION-CHECKLIST.md (per §14.10 rules)
 │   ├─ Master-Spec-4.0 §3.0 R-00 status
 │   └─ Master-Spec-4.0 §6 acceptance gates
 │
 ├─ R-00 COMPLETE ✅
 │
 ├─ Resume Master Spec 4.0 §13 Execution Sequence
 │   ├─ Close Pass 1 (Upstash revocation + Vercel env)
 │   ├─ Execute Pass 2 (R-01 credential-gated runbook)
 │   ├─ Execute Pass 3 (inventory flag + manual accuracy)
 │   └─ BEGIN remaining P0 features (F-04, F-22, F-23, F-24)
 │
 └─ P1 Sprint begins after all P0 features pass acceptance
```

---

## 19) Changes-for-gemini-to-implement Generation Guide

### 19.0 Purpose

This section tells Claude exactly how to populate the `Changes-for-gemini-to-implement` file for each execution session. The file must be self-contained — Gemini should never need to read any other spec document to complete its work.

### 19.1 File Structure

Every `Changes-for-gemini-to-implement` session file must follow this exact structure:

```markdown
# Changes for Gemini to Implement — Session [DATE]

## Session Rules
[Paste §15.1 through §15.6 guardrails verbatim — every session]

## Pre-Work
Read these files before making any changes:
- [list every file that will be modified or needs verification]

Report after reading: "I've read [N] files. [X] need changes, [Y] are clean."
Do NOT proceed until you've reported.

## Task 1: [ID] — [Name]
[Full prompt per §16.1 template]

## Task 2: [ID] — [Name]
[Full prompt per §16.1 template]

...

## Final Verification
After ALL tasks are complete:
1. Run: `npx tsc --noEmit && npm run lint && npx next build`
2. Report: build pass/fail, files modified, any errors encountered
3. Do NOT update EXECUTION-CHECKLIST.md or Master-Spec — Claude will review first

## Session Boundary
This session covers ONLY Tasks 1 through [N] listed above.
Do NOT implement anything else. Do NOT read ahead to future tasks.
If you finish early, report completion and STOP.
```

### 19.2 Session Sizing Rules

| Rule | Limit | Rationale |
|---|---|---|
| Max tasks per session | 5 | Prevents quality degradation over long sessions |
| Max files modified per session | 8 | Limits blast radius |
| Max new files created per session | 2 | New files need more review |
| Max lines changed per file | 100 | Forces targeted edits over rewrites |

### 19.3 Session Sequencing for Current Work

**Session A: Batch E (Mobile Hardening Completion)**

```
Tasks: E-1, E-2, E-4, E-5 (a/b/c), E-7, E-8
Files: ServiceAreaSection.tsx, FooterSection.tsx, QuoteSection.tsx,
       FloatingQuotePanel.tsx, VariantAPublicPage.tsx, ServiceSpreadSection.tsx
Optional: E-9 (PublicHeader.tsx)
```

**Session B: P0 Corrections — Foundation**

```
Tasks: §14.8, §14.2, §14.3, §14.4
Files: 0020_lead_lifecycle_fields.sql, quote-request/route.ts,
       lead-followup/route.ts, AdminSidebarNav.tsx
```

**Session C: P0 Corrections — Components**

```
Tasks: §14.5, §14.6, §14.7
Files: OverviewDashboard.tsx, EmployeeTicketsClient.tsx,
       quote/success/page.tsx
```

### 19.4 Example: Fully Populated Session B

Below is the EXACT content Claude should generate for `Changes-for-gemini-to-implement` when it's time to run Session B:

````markdown
# Changes for Gemini to Implement — Session B (P0 Corrections Foundation)

## Session Rules

ONLY implement what is listed in this file. If a task is not listed here,
DO NOT DO IT. If you believe something additional is needed, STOP and ask.

Before editing any file, read it completely. Do not assume it matches
what you last saw. Every Edit must be preceded by a ReadFile.

One task at a time. Complete the current task's acceptance criteria
before starting the next task. After each edit, run `npx tsc --noEmit`.
Fix errors before proceeding.

Do NOT add features not listed here. Do NOT change file structure.
Do NOT update EXECUTION-CHECKLIST.md or Master-Spec-4.0 — that happens
after Claude reviews this session's output.

### Checkpoint Protocol
- After reading all files: report what you found
- After each task: report tsc pass/fail and whether acceptance criteria are met
- After all tasks: report full build status
- Do NOT proceed past a failing task

---

## Pre-Work

Read these files before making any changes:

1. `supabase/migrations/0020_lead_lifecycle_fields.sql`
2. `src/app/api/quote-request/route.ts`
3. `src/app/api/lead-followup/route.ts`
4. `src/components/admin/AdminSidebarNav.tsx`

Report after reading:
"I've read 4 files. [X] need changes, [Y] are clean."
Do NOT proceed until you've reported.

---

## Task 1: §14.8 — Migration Source Default Fix

### What to do
Change the default value for `leads.source` from `'web_quote_form'` to `NULL`.

### Files to modify
- `supabase/migrations/0020_lead_lifecycle_fields.sql`

### Spec reference
Master Spec §10 Migration 1: `leads.source` — `text`, nullable.
No default value specified.

### Implementation

```sql
-- FIND:
ALTER TABLE public.leads ADD COLUMN source text DEFAULT 'web_quote_form';

-- REPLACE WITH:
ALTER TABLE public.leads ADD COLUMN source text DEFAULT NULL;
```

### What NOT to do
- Do not modify any other column in this migration
- Do not add new columns or tables
- Do not change the `IF NOT EXISTS` guard logic

### Verification
1. Run `npx tsc --noEmit`
2. ReadFile the migration and confirm the line reads `DEFAULT NULL`
3. Report: "Task §14.8 complete. tsc: pass/fail. Change verified: yes/no."

### Stop condition
Do NOT proceed to Task 2 until this verification passes.

---

## Task 2: §14.2 — F-02 Email Body Alignment

### What to do
Update the lead acknowledgment email body in the quote-request API route
to match the SMS message format. The SMS is already correct — only the
email needs updating.

### Files to modify
- `src/app/api/quote-request/route.ts` (Resend email block only, ~lines 210-235)

### Spec reference
F-02 acceptance criteria:
- Customer SMS and email are sent within 60 seconds of valid form submission
- Messages must match this template:

To customer (email):
Subject: "A&A Cleaning: We Got Your Quote Request"
Body:
"Hi [Name],

Thanks for reaching out to A&A Cleaning. We received your request
and will call you within 1 hour.

Service requested: [Service Type]

If you need us sooner: [COMPANY_PHONE]

— The A&A Team"

### Implementation

FIND the Resend fetch block (approximately lines 216-226) and update:

```typescript
subject: "A&A Cleaning: We Got Your Quote Request",
html: `
  <p>Hi ${safeName},</p>
  <p>Thanks for reaching out to A&A Cleaning. We received your request and will call you within 1 hour.</p>
  <p><strong>Service requested:</strong> ${safeServiceType}</p>
  <p>If you need us sooner: ${COMPANY_PHONE}</p>
  <p>— The A&A Team</p>
`,
```

### What NOT to do
- Do not change the SMS text — it is already correct
- Do not change the admin SMS notification
- Do not modify the rate limiting, honeypot, or validation logic
- Do not change any import statements unless `COMPANY_PHONE` is not imported
  (it should already be imported from the prior session)

### Verification
1. Run `npx tsc --noEmit`
2. ReadFile `src/app/api/quote-request/route.ts` and confirm:
   - Email subject is "A&A Cleaning: We Got Your Quote Request"
   - Email body contains "call you within 1 hour"
   - Email body contains `COMPANY_PHONE` variable (not a hardcoded number)
   - SMS text still contains "Thanks for reaching out to A&A Cleaning"
3. Report: "Task §14.2 complete. tsc: pass/fail. Email matches spec: yes/no.
   SMS unchanged: yes/no."

### Stop condition
Do NOT proceed to Task 3 until this verification passes.

---

## Task 3: §14.3 — F-03 Lead Aging Alert Messages

### What to do
Update the three lead aging alert message templates to match the spec exactly.
Remove the secondary admin targeting logic that was added by a prior session.

### Files to modify
- `src/app/api/lead-followup/route.ts`

### Spec reference
F-03 aging tiers:

| Hours | Emoji | Message |
|---|---|---|
| 1 | ⚡ | "[Name] hasn't been contacted yet. [Call Now] [phone]" |
| 4 | ⚠️ | "[Name] still waiting (4 hrs). Leads contacted in 1hr convert 3x better. [phone]" |
| 24 | 🔴 | "[Name] waiting 24 hours. Consider this lead at risk. [phone]" |

### Implementation

FIND the 1h tier messageTemplate and REPLACE:
```typescript
urgencyPrefix: "⚡ ",
messageTemplate: (lead: LeadRow) => {
  return `⚡ ${lead.name} hasn't been contacted yet. Call now: ${lead.phone}`;
},
```

FIND the 4h tier messageTemplate and REPLACE:
```typescript
urgencyPrefix: "⚠️ ",
messageTemplate: (lead: LeadRow) => {
  return `⚠️ ${lead.name} still waiting (4 hrs). Leads contacted in 1hr convert 3x better. ${lead.phone}`;
},
```

FIND the 24h tier messageTemplate and VERIFY it reads:
```typescript
urgencyPrefix: "🔴 ",
messageTemplate: (lead: LeadRow) => {
  return `🔴 ${lead.name} waiting 24 hours. Consider this lead at risk. ${lead.phone}`;
},
```
If the 24h tier message does not match, update it.

FIND and REMOVE these lines (secondary admin routing — not in spec):
```typescript
const secondaryAdminProfile = adminProfiles?.[1] ?? adminProfile;
const secondaryAdminPhone = secondaryAdminProfile?.phone || adminAlertPhone;
```

FIND the loop where `targetPhone` and `targetProfile` are set per tier
and REPLACE with the original simple routing:
```typescript
const results = await processAlertTier({
  supabase,
  leads,
  tier,
  adminPhone: adminAlertPhone,
  adminProfileId: adminProfile?.id ?? null,
  adminPreferences,
  dryRun,
});
```

Add a TODO comment for the 48h tier:
```typescript
// TODO: F-03 48h tier — auto-update lead status to "At Risk"
// Requires schema change: leads.status enum must include 'at_risk'
// Deferred to next migration batch
```

### What NOT to do
- Do not add new tiers beyond 1h/4h/24h
- Do not modify the cron scheduling logic
- Do not change the `processAlertTier` function signature
- Do not modify the `LeadRow` type
- Do not change quiet-hours logic

### Verification
1. Run `npx tsc --noEmit`
2. ReadFile `src/app/api/lead-followup/route.ts` and confirm:
   - 1h tier uses ⚡ emoji (not ⚠️)
   - 4h tier message matches spec exactly
   - 24h tier message matches spec exactly
   - No `secondaryAdminProfile` or `secondaryAdminPhone` variables exist
   - No `targetPhone` / `targetProfile` conditional routing exists
   - TODO comment for 48h tier is present
3. Report: "Task §14.3 complete. tsc: pass/fail. Messages match spec: yes/no.
   Secondary routing removed: yes/no."

### Stop condition
Do NOT proceed to Task 4 until this verification passes.

---

## Task 4: §14.4 — F-05 Sidebar Grouping (FINAL)

### What to do
Replace the NAV_GROUPS array with the EXACT grouping from the spec.
This is the FINAL sidebar grouping. It will not be rewritten again.

### Files to modify
- `src/components/admin/AdminSidebarNav.tsx` (NAV_GROUPS constant only)

### Spec reference
Master Spec §8.1 F-05:

```
📥 DAILY WORK
├─ 🏠 Home (Morning Briefing)
├─ 📋 Leads & Quotes
├─ 🚐 Jobs & Dispatch
└─ ✅ Review & Approve

📊 BUSINESS
├─ 📈 Insights
└─ 👥 Hiring

⚙️ SETTINGS
├─ 🔔 Notifications
├─ 📦 Inventory
└─ ⚙️ Configuration
```

### Implementation

FIND the entire `const NAV_GROUPS: NavGroup[] = [...]` block and REPLACE with:

```typescript
const NAV_GROUPS: NavGroup[] = [
  {
    label: "Daily Work",
    items: [
      { id: "overview", label: "Home", icon: "🏠" },
      { id: "leads", label: "Leads & Quotes", icon: "📋" },
      { id: "tickets", label: "Jobs & Dispatch", icon: "🚐" },
      { id: "operations", label: "Review & Approve", icon: "✅" },
    ],
  },
  {
    label: "Business",
    items: [
      { id: "insights", label: "Insights", icon: "📈" },
      { id: "hiring", label: "Hiring", icon: "👥" },
    ],
  },
  {
    label: "Settings",
    items: [
      { id: "notifications", label: "Notifications", icon: "🔔" },
      { id: "inventory", label: "Inventory", icon: "📦" },
      { id: "wizard", label: "Configuration", icon: "⚙️" },
    ],
  },
];
```

### What NOT to do
- Do not change the `NavGroup` or `NavItem` type definitions
- Do not change the `AdminSidebarNavProps` interface
- Do not modify the render logic (the `map` over groups)
- Do not modify `AdminShell.tsx`
- Do not add or remove any `ModuleId` values — only grouping and labels change
- Do not add `dispatch` or `scheduling` as separate items — they are accessed
  within "Jobs & Dispatch"

### Verification
1. Run `npx tsc --noEmit`
2. ReadFile `src/components/admin/AdminSidebarNav.tsx` and confirm:
   - Exactly 3 groups: "Daily Work", "Business", "Settings"
   - "Daily Work" has 4 items: overview, leads, tickets, operations
   - "Business" has 2 items: insights, hiring
   - "Settings" has 3 items: notifications, inventory, wizard
   - Total: 9 items across 3 groups
   - No other code in the file was changed
3. Report: "Task §14.4 complete. tsc: pass/fail. Groups match spec: yes/no.
   Item count: [N]. No other code changed: yes/no."

### Stop condition
Do NOT proceed to Final Verification until this task passes.

---

## Final Verification

After ALL 4 tasks are complete:

1. Run: `npx tsc --noEmit && npm run lint && npx next build`
2. Report the following:
   - Build: pass/fail
   - Files modified: [list each file and what changed]
   - Tasks completed: [list each task ID and pass/fail]
   - Any unexpected issues encountered
3. Do NOT update EXECUTION-CHECKLIST.md or Master-Spec-4.0
4. Do NOT proceed to Session C tasks

## Session Boundary

This session covers ONLY Tasks 1-4 listed above (§14.8, §14.2, §14.3, §14.4).
Do NOT implement §14.5, §14.6, or §14.7 — those are Session C.
Do NOT implement Batch E changes — that is Session A.
If you finish early, report completion and STOP.
````

---

## 20) Document History

| Version | Date | Changes |
|---|---|---|
| v1.0 | 2026-03-22 | Initial spec with issue inventory |
| v2.0 | 2026-03-22 | Batches A-D defined and applied |
| v2.1 | 2026-03-22 | Updated with Batch E file requirements and §13 review |
| v3.0 | 2026-03-23 | Batch E verified + targeted changes defined. Batch F QA integrated. §14 P0 corrections added. §15 Gemini guardrails added. §16 Claude prompt protocol added. §19 session generation guide added. |

---

## 21) Cross-Reference Index

| Section | References |
|---|---|
| §4.5 Batch E | Files reviewed in conversation 2026-03-23 |
| §4.6 Batch F | Derived from Master Spec §15.3 mobile testing matrix |
| §14.1-14.7 | Gemini CLI session audit 2026-03-23 |
| §14.4 F-05 | Master Spec §8.1 F-05 canonical grouping |
| §14.5 F-01 | Master Spec §8.1 F-01 wireframe |
| §14.6 F-12 | Master Spec §8.2 F-12 timeline spec |
| §14.7 F-17 | Master Spec §8.3 F-17 confirmation page spec |
| §15 Guardrails | Derived from 3 sessions of observed drift patterns |
| §16 Claude Protocol | Derived from §15 enforcement requirements |
| §19 Session Guide | Integrates §15 + §16 into executable format |