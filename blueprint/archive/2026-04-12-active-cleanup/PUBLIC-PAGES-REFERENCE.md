# Public Pages Reference Map

Last updated: 2026-04-06
Purpose: quick navigation for homepage structure/styling/components and all public pages, with consistency touchpoints so updates stay aligned across the site.

---

## 1) Core Shell + Global Styling (Start Here)

These files control the shared experience across public pages:

- Public route layout wrapper: [Production-workspace/src/app/(public)/layout.tsx](Production-workspace/src/app/(public)/layout.tsx)
- Shared public chrome (header/footer/sticky/panel wiring): [Production-workspace/src/components/public/PublicChrome.tsx](Production-workspace/src/components/public/PublicChrome.tsx)
- App-wide layout/meta shell: [Production-workspace/src/app/layout.tsx](Production-workspace/src/app/layout.tsx)
- Global styles/tokens/utilities: [Production-workspace/src/styles/globals.css](Production-workspace/src/styles/globals.css)
- Sitemap generation: [Production-workspace/src/app/sitemap.ts](Production-workspace/src/app/sitemap.ts)
- Social image routes: [Production-workspace/src/app/opengraph-image.tsx](Production-workspace/src/app/opengraph-image.tsx), [Production-workspace/src/app/twitter-image.tsx](Production-workspace/src/app/twitter-image.tsx)

---

## 2) Homepage Architecture (Structure + Components)

### Entry + Composition

- Homepage route entry: [Production-workspace/src/app/(public)/page.tsx](Production-workspace/src/app/(public)/page.tsx)
- Variant export barrel: [Production-workspace/src/components/public/variant-a/index.ts](Production-workspace/src/components/public/variant-a/index.ts)
- Homepage section composition/order: [Production-workspace/src/components/public/variant-a/VariantAPublicPage.tsx](Production-workspace/src/components/public/variant-a/VariantAPublicPage.tsx)

### Homepage Section Components

- Header/nav: [Production-workspace/src/components/public/variant-a/PublicHeader.tsx](Production-workspace/src/components/public/variant-a/PublicHeader.tsx)
- Hero: [Production-workspace/src/components/public/variant-a/HeroSection.tsx](Production-workspace/src/components/public/variant-a/HeroSection.tsx)
- Authority bar: [Production-workspace/src/components/public/variant-a/AuthorityBar.tsx](Production-workspace/src/components/public/variant-a/AuthorityBar.tsx)
- Services spread/accordion: [Production-workspace/src/components/public/variant-a/ServiceSpreadSection.tsx](Production-workspace/src/components/public/variant-a/ServiceSpreadSection.tsx)
- Who we work with (industries/personas): [Production-workspace/src/components/public/variant-a/OfferAndIndustrySection.tsx](Production-workspace/src/components/public/variant-a/OfferAndIndustrySection.tsx)
- Before/after: [Production-workspace/src/components/public/variant-a/BeforeAfterSlider.tsx](Production-workspace/src/components/public/variant-a/BeforeAfterSlider.tsx)
- Testimonials: [Production-workspace/src/components/public/variant-a/TestimonialSection.tsx](Production-workspace/src/components/public/variant-a/TestimonialSection.tsx)
- Process timeline: [Production-workspace/src/components/public/variant-a/TimelineSection.tsx](Production-workspace/src/components/public/variant-a/TimelineSection.tsx)
- About section block: [Production-workspace/src/components/public/variant-a/AboutSection.tsx](Production-workspace/src/components/public/variant-a/AboutSection.tsx)
- Where we work section block: [Production-workspace/src/components/public/variant-a/ServiceAreaSection.tsx](Production-workspace/src/components/public/variant-a/ServiceAreaSection.tsx)
- FAQ section block: [Production-workspace/src/components/public/variant-a/FAQSection.tsx](Production-workspace/src/components/public/variant-a/FAQSection.tsx)
- Footer: [Production-workspace/src/components/public/variant-a/FooterSection.tsx](Production-workspace/src/components/public/variant-a/FooterSection.tsx)

### Homepage Interaction/UX Components

- CTA primitive: [Production-workspace/src/components/public/variant-a/CTAButton.tsx](Production-workspace/src/components/public/variant-a/CTAButton.tsx)
- Quote CTA wrapper: [Production-workspace/src/components/public/variant-a/QuoteCTA.tsx](Production-workspace/src/components/public/variant-a/QuoteCTA.tsx)
- Quote context: [Production-workspace/src/components/public/variant-a/QuoteContext.tsx](Production-workspace/src/components/public/variant-a/QuoteContext.tsx)
- Floating quote panel: [Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx](Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx)
- Inline quote section: [Production-workspace/src/components/public/variant-a/QuoteSection.tsx](Production-workspace/src/components/public/variant-a/QuoteSection.tsx)
- Shared quote form logic: [Production-workspace/src/components/public/variant-a/useQuoteForm.ts](Production-workspace/src/components/public/variant-a/useQuoteForm.ts)
- AI assistant: [Production-workspace/src/components/public/variant-a/AIQuoteAssistant.tsx](Production-workspace/src/components/public/variant-a/AIQuoteAssistant.tsx)
- Exit intent: [Production-workspace/src/components/public/variant-a/ExitIntentOverlay.tsx](Production-workspace/src/components/public/variant-a/ExitIntentOverlay.tsx)
- Scroll reveal helper: [Production-workspace/src/components/public/variant-a/ScrollReveal.tsx](Production-workspace/src/components/public/variant-a/ScrollReveal.tsx)
- Scroll-to-top helper: [Production-workspace/src/components/public/variant-a/ScrollToTopButton.tsx](Production-workspace/src/components/public/variant-a/ScrollToTopButton.tsx)

---

## 3) Shared Data Sources (Keep Cross-Page Consistency)

When these files change, multiple pages/sections can shift.

- Services data model: [Production-workspace/src/data/services.ts](Production-workspace/src/data/services.ts)
- Industry/persona data model: [Production-workspace/src/data/industries.ts](Production-workspace/src/data/industries.ts)
- Persona-to-service mapping: [Production-workspace/src/data/industry-persona-mapping.ts](Production-workspace/src/data/industry-persona-mapping.ts)
- Service-area visual map points: [Production-workspace/src/data/service-area-visual.ts](Production-workspace/src/data/service-area-visual.ts)
- Service-area city content/slugs/source of truth: [Production-workspace/src/lib/service-areas.ts](Production-workspace/src/lib/service-areas.ts)
- Quote service-type map: [Production-workspace/src/lib/service-type-map.ts](Production-workspace/src/lib/service-type-map.ts)
- FAQ shared content source: [Production-workspace/src/components/public/variant-a/faq-items.ts](Production-workspace/src/components/public/variant-a/faq-items.ts)

---

## 4) Public Route Map (All Built Pages)

### Core Pages

- Homepage: [Production-workspace/src/app/(public)/page.tsx](Production-workspace/src/app/(public)/page.tsx)
- About us: [Production-workspace/src/app/(public)/about/page.tsx](Production-workspace/src/app/(public)/about/page.tsx)
- FAQ: [Production-workspace/src/app/(public)/faq/page.tsx](Production-workspace/src/app/(public)/faq/page.tsx)
- Careers: [Production-workspace/src/app/(public)/careers/page.tsx](Production-workspace/src/app/(public)/careers/page.tsx)
- Contact: [Production-workspace/src/app/(public)/contact/page.tsx](Production-workspace/src/app/(public)/contact/page.tsx)
- Privacy: [Production-workspace/src/app/(public)/privacy/page.tsx](Production-workspace/src/app/(public)/privacy/page.tsx)
- Terms: [Production-workspace/src/app/(public)/terms/page.tsx](Production-workspace/src/app/(public)/terms/page.tsx)

### Where We Work + City Pages

- Service-area hub page (Where We Work): [Production-workspace/src/app/(public)/service-area/page.tsx](Production-workspace/src/app/(public)/service-area/page.tsx)
- Service-area city template (all cities): [Production-workspace/src/app/(public)/service-area/[slug]/page.tsx](Production-workspace/src/app/(public)/service-area/[slug]/page.tsx)

Current city slugs come from: [Production-workspace/src/lib/service-areas.ts](Production-workspace/src/lib/service-areas.ts)

- round-rock
- georgetown
- pflugerville
- buda
- kyle
- san-marcos
- hutto

### Services Pages

- Services index: [Production-workspace/src/app/(public)/services/page.tsx](Production-workspace/src/app/(public)/services/page.tsx)
- Post-construction cleaning: [Production-workspace/src/app/(public)/services/post-construction-cleaning/page.tsx](Production-workspace/src/app/(public)/services/post-construction-cleaning/page.tsx)
- Final clean: [Production-workspace/src/app/(public)/services/final-clean/page.tsx](Production-workspace/src/app/(public)/services/final-clean/page.tsx)
- Commercial cleaning: [Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx](Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx)
- Move-in/move-out cleaning: [Production-workspace/src/app/(public)/services/move-in-move-out-cleaning/page.tsx](Production-workspace/src/app/(public)/services/move-in-move-out-cleaning/page.tsx)
- Windows/power-wash: [Production-workspace/src/app/(public)/services/windows-power-wash/page.tsx](Production-workspace/src/app/(public)/services/windows-power-wash/page.tsx)

Shared hardening component used across service pages:
- [Production-workspace/src/components/public/variant-a/ServicePageHardening.tsx](Production-workspace/src/components/public/variant-a/ServicePageHardening.tsx)

### Industries / Who We Work With Pages

- Industry dynamic template: [Production-workspace/src/app/(public)/industries/[slug]/page.tsx](Production-workspace/src/app/(public)/industries/[slug]/page.tsx)

Industry source + mappings:
- [Production-workspace/src/data/industries.ts](Production-workspace/src/data/industries.ts)
- [Production-workspace/src/data/industry-persona-mapping.ts](Production-workspace/src/data/industry-persona-mapping.ts)

### Other Public Route

- Camera spike: [Production-workspace/src/app/(public)/camera-spike/page.tsx](Production-workspace/src/app/(public)/camera-spike/page.tsx)

---

## 5) Consistency Matrix (What To Update Together)

Use this to keep homepage + all other pages aligned.

### A) Global Look/Feel

Primary files:
- [Production-workspace/src/styles/globals.css](Production-workspace/src/styles/globals.css)
- [Production-workspace/src/components/public/PublicChrome.tsx](Production-workspace/src/components/public/PublicChrome.tsx)
- [Production-workspace/src/components/public/variant-a/PublicHeader.tsx](Production-workspace/src/components/public/variant-a/PublicHeader.tsx)
- [Production-workspace/src/components/public/variant-a/FooterSection.tsx](Production-workspace/src/components/public/variant-a/FooterSection.tsx)

Impact:
- Affects homepage and all public pages under [Production-workspace/src/app/(public)](Production-workspace/src/app/(public))

### B) CTA Style/Behavior + Tracking

Primary files:
- [Production-workspace/src/components/public/variant-a/CTAButton.tsx](Production-workspace/src/components/public/variant-a/CTAButton.tsx)
- [Production-workspace/src/components/public/variant-a/QuoteCTA.tsx](Production-workspace/src/components/public/variant-a/QuoteCTA.tsx)
- [Production-workspace/src/components/public/variant-a/QuoteContext.tsx](Production-workspace/src/components/public/variant-a/QuoteContext.tsx)
- [Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx](Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx)
- [Production-workspace/src/components/public/variant-a/useQuoteForm.ts](Production-workspace/src/components/public/variant-a/useQuoteForm.ts)
- [Production-workspace/src/app/api/quote-request/route.ts](Production-workspace/src/app/api/quote-request/route.ts)

Impact:
- Any button/form conversion path on homepage and other public pages

### C) Services Content Consistency (Homepage vs Service Detail Pages)

Primary files:
- [Production-workspace/src/data/services.ts](Production-workspace/src/data/services.ts)
- [Production-workspace/src/components/public/variant-a/ServiceSpreadSection.tsx](Production-workspace/src/components/public/variant-a/ServiceSpreadSection.tsx)
- [Production-workspace/src/app/(public)/services/page.tsx](Production-workspace/src/app/(public)/services/page.tsx)
- [Production-workspace/src/app/(public)/services/post-construction-cleaning/page.tsx](Production-workspace/src/app/(public)/services/post-construction-cleaning/page.tsx)
- [Production-workspace/src/app/(public)/services/final-clean/page.tsx](Production-workspace/src/app/(public)/services/final-clean/page.tsx)
- [Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx](Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx)
- [Production-workspace/src/app/(public)/services/move-in-move-out-cleaning/page.tsx](Production-workspace/src/app/(public)/services/move-in-move-out-cleaning/page.tsx)
- [Production-workspace/src/app/(public)/services/windows-power-wash/page.tsx](Production-workspace/src/app/(public)/services/windows-power-wash/page.tsx)

### D) Who We Work With Consistency (Homepage vs Industries)

Primary files:
- [Production-workspace/src/components/public/variant-a/OfferAndIndustrySection.tsx](Production-workspace/src/components/public/variant-a/OfferAndIndustrySection.tsx)
- [Production-workspace/src/app/(public)/industries/[slug]/page.tsx](Production-workspace/src/app/(public)/industries/[slug]/page.tsx)
- [Production-workspace/src/data/industries.ts](Production-workspace/src/data/industries.ts)
- [Production-workspace/src/data/industry-persona-mapping.ts](Production-workspace/src/data/industry-persona-mapping.ts)

### E) Where We Work Consistency (Homepage vs Service-Area Hub vs City Pages)

Primary files:
- [Production-workspace/src/components/public/variant-a/ServiceAreaSection.tsx](Production-workspace/src/components/public/variant-a/ServiceAreaSection.tsx)
- [Production-workspace/src/app/(public)/service-area/page.tsx](Production-workspace/src/app/(public)/service-area/page.tsx)
- [Production-workspace/src/app/(public)/service-area/[slug]/page.tsx](Production-workspace/src/app/(public)/service-area/[slug]/page.tsx)
- [Production-workspace/src/lib/service-areas.ts](Production-workspace/src/lib/service-areas.ts)
- [Production-workspace/src/data/service-area-visual.ts](Production-workspace/src/data/service-area-visual.ts)

### F) FAQ Consistency (Homepage FAQ Block vs Full FAQ Page)

Primary files:
- [Production-workspace/src/components/public/variant-a/FAQSection.tsx](Production-workspace/src/components/public/variant-a/FAQSection.tsx)
- [Production-workspace/src/app/(public)/faq/page.tsx](Production-workspace/src/app/(public)/faq/page.tsx)
- [Production-workspace/src/components/public/variant-a/faq-items.ts](Production-workspace/src/components/public/variant-a/faq-items.ts)

### G) About/Careers Consistency (Homepage Sections vs Full Pages)

Primary files:
- About section component: [Production-workspace/src/components/public/variant-a/AboutSection.tsx](Production-workspace/src/components/public/variant-a/AboutSection.tsx)
- About page: [Production-workspace/src/app/(public)/about/page.tsx](Production-workspace/src/app/(public)/about/page.tsx)
- Careers section component: [Production-workspace/src/components/public/variant-a/CareersSection.tsx](Production-workspace/src/components/public/variant-a/CareersSection.tsx)
- Careers page: [Production-workspace/src/app/(public)/careers/page.tsx](Production-workspace/src/app/(public)/careers/page.tsx)

---

## 6) Fast Workflow (Recommended)

1. Start with global tokens/chrome/header/footer.
2. Update homepage sections.
3. Sync service data-driven content.
4. Sync industries/persona pages.
5. Sync service-area hub + city templates.
6. Sync FAQ, About, Careers page-level polish.
7. Do one final consistency pass using Section 5 matrix.

---

## 7) Related Planning Docs (Blueprint Active)

- Current implementation feedback thread: [blueprint/archive/2026-04-11-active-cleanup/feedback.md](blueprint/archive/2026-04-11-active-cleanup/feedback.md)
- UX masterdoc: [blueprint/archive/2026-04-11-active-cleanup/masterdoc-ux-ui.md](blueprint/archive/2026-04-11-active-cleanup/masterdoc-ux-ui.md)
- UX masterdoc 2.0: [blueprint/active/masterdoc-ux-ui-2.0.md](blueprint/active/masterdoc-ux-ui-2.0.md)
- Chunk/performance deep dive: [blueprint/active/chunk-performance-deep-dive-2026-04-04.md](blueprint/active/chunk-performance-deep-dive-2026-04-04.md)


# Consistency Audit — Let's Do This Right

Great instinct to systematize this. Here's exactly how I'd attack it:

---

## Phase 1: Establish the "Source of Truth" (Feed Me These First)

I need to see the files that **everything else should conform to**. These are the foundation — once I internalize these, I can spot every inconsistency in the child pages.

### Batch 1A — Global Shell (3 files)
These control what every page shares:
1. **`PublicChrome.tsx`** — header/footer/sticky wiring
2. **`PublicHeader.tsx`** — nav structure, links, CTA in header
3. **`FooterSection.tsx`** — footer links, layout, contact info

### Batch 1B — Design Language from Homepage (2 files)
These establish the patterns the other pages should echo:
4. **`VariantAPublicPage.tsx`** — section order/composition (so I know the rhythm)
5. **`globals.css`** — tokens, utilities, spacing scale, color variables

### Batch 1C — Shared Data (the stuff that must match everywhere)
6. **`services.ts`** — service names, slugs, descriptions
7. **`industries.ts`** — industry names, slugs
8. **`service-areas.ts`** (lib) — city names, slugs, content
9. **`faq-items.ts`** — shared FAQ content

### Batch 1D — Shared UX Patterns (so CTAs/forms are consistent)
10. **`CTAButton.tsx`** — button primitive
11. **`QuoteCTA.tsx`** — quote wrapper
12. **`ServicePageHardening.tsx`** — shared service page component

---

## Phase 2: Pages One-by-One (Feed Me After Phase 1)

Once I have the source of truth loaded, we go page by page. I'd recommend this order (highest cross-reference risk → lowest):

| Priority | Page | Why |
|----------|------|-----|
| 1 | **Services index** (`/services/page.tsx`) | Must match `services.ts` data exactly |
| 2 | **One service detail page** (e.g. post-construction) | Establishes the template pattern — once right, we replicate |
| 3 | **Remaining service pages** (4 more) | Batch against the template |
| 4 | **Service-area hub** (`/service-area/page.tsx`) | Must match `service-areas.ts` |
| 5 | **One city page** (`/service-area/[slug]/page.tsx`) | Template — all 7 cities use it |
| 6 | **Industry template** (`/industries/[slug]/page.tsx`) | Must match `industries.ts` + persona mapping |
| 7 | **About page** | Check against `AboutSection.tsx` homepage block |
| 8 | **FAQ page** | Check against `faq-items.ts` + homepage FAQ block |
| 9 | **Careers page** | Check against homepage careers section |
| 10 | **Contact page** | CTA/form consistency |
| 11 | **Privacy / Terms** | Usually just layout/chrome consistency |

---

## What I'll Check on Every Page

For each page you feed me, I'll audit against:

- ✅ **Layout structure** — uses same section spacing, container widths, responsive patterns
- ✅ **Header/footer** — inherits from PublicChrome correctly
- ✅ **Typography** — heading hierarchy, font weights, colors match homepage
- ✅ **CTA consistency** — same button component, same quote flow, same tracking
- ✅ **Data alignment** — names/slugs/descriptions match the shared data files
- ✅ **Internal linking** — cross-links use correct slugs, no dead ends
- ✅ **SEO/meta** — consistent metadata pattern, structured data
- ✅ **Mobile/responsive** — same breakpoint behavior as homepage

---

## TL;DR — Next Step

**Send me Batch 1A–1D (the ~12 source-of-truth files).** You can dump them all at once or in chunks — I'll hold context across messages.

Once I've absorbed those, say "ready for pages" and start feeding me pages in the priority order above. I'll give you a consistency report + specific fixes for each one.

