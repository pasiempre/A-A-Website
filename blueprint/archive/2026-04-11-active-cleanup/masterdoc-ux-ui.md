# Master Implementation Document
## A&A Cleaning Services — Mobile UX Hardening & Conversion Optimization

---

# Document Overview

This document has been collapsed for active use.

Scope intent remains the same:
- Sections 1-5 are implementation history (now summarized).
- Sections 6-7 remain active investigation/execution framework.
- Appendices remain as detailed reference material.

---

# Sections 1-5 (Collapsed Implementation Record)

Status summary:
- Sections 1-5 are implemented at production-workspace level.
- Remaining post-implementation risk lives in validation/hardening, tracked in Sections 6-7.

## Section 1 — Critical Bug Fixes (Implemented)

Implemented outcomes:
1. Quote panel Step 1→2 auto-close race fixed.
2. Quote panel step-aware title/subcopy flow fixed.
3. AI assistant CTA suppression wired to real DOM targets.
4. Quote panel z-index normalized to dialog layer.
5. Step 2 lead reference guardrails added.
6. Duplicate success analytics event stream removed.

Primary files:
- `FloatingQuotePanel.tsx`
- `useQuoteForm.ts`
- `AIQuoteAssistant.tsx`
- `HeroSection.tsx`
- `ServiceAreaSection.tsx`
- `VariantAPublicPage.tsx`

## Section 2 — Tier 1 Immediate Wins (Implemented)

Implemented outcomes:
1. Homepage careers duplication removed; route-level careers retained.
2. Mobile footer top-CTA duplication reduced.
3. Who We Serve CTA hierarchy improved.
4. Persona outcomes surfaced for mobile readability.
5. Services accordion behavior/instrumentation aligned.
6. AuthorityBar trust framing and stat language tightened.
7. Service-area affordance redundancy reduced.
8. Testimonial framing updated.
9. Mobile nav backdrop visibility strengthened.
10. Hero subtitle contrast/readability confirmed.

Primary files:
- `VariantAPublicPage.tsx`
- `FooterSection.tsx`
- `OfferAndIndustrySection.tsx`
- `ServiceSpreadSection.tsx`
- `AuthorityBar.tsx`
- `ServiceAreaSection.tsx`
- `TestimonialSection.tsx`
- `PublicHeader.tsx`
- `HeroSection.tsx`

## Section 3 — Component Refactors (Implemented with Remaining Validation)

Implemented outcomes:
1. Mobile hero compact default shipped with override controls.
2. Service-type context threading shipped through quote funnel.
3. Timeline intro/scanability refinements shipped.
4. Accordion interaction accessibility hardened.
5. Quote panel bounce/close analytics instrumentation added.
6. Mobile quote panel viewport/height behavior improved.

Primary files:
- `HeroSection.tsx`
- `QuoteContext.tsx`
- `PublicChrome.tsx`
- `CTAButton.tsx`
- `QuoteCTA.tsx`
- `FloatingQuotePanel.tsx`
- `useQuoteForm.ts`
- `ServiceSpreadSection.tsx`
- `OfferAndIndustrySection.tsx`
- `TimelineSection.tsx`
- `src/lib/service-type-map.ts`

Note:
- Residual hero spacing/hydration validation remains tracked in Sections 6-7.

## Section 4 — Structural Redesigns (Implemented with One Intentional Deferral)

Implemented outcomes:
1. IncludedSummary merged into Timeline and duplicate section removed.
2. Homepage section order refactored to trust-funnel sequence.
3. Where We Work representations consolidated by breakpoint.
4. Mobile service proof/package lines surfaced.

Intentional deferral:
- Full Before/After redesign retained for later design sprint.

Primary files:
- `VariantAPublicPage.tsx`
- `TimelineSection.tsx`
- `ServiceAreaSection.tsx`
- `ServiceSpreadSection.tsx`
- `BeforeAfterSlider.tsx`

## Section 5 — Stretch Goals & Deferred Improvements (Substantially Implemented)

Implemented outcomes:
1. Who We Serve mobile carousel shipped.
2. Industry vertical route/template shipped.
3. Shared data alignment for services/industries/service-area shipped.
4. CTAButton dead-prop cleanup completed.
5. Industry menu sub-link targeting corrected.

Intentional deferral:
- Mobile timeline stepper accordion concept deferred.

Primary files:
- `OfferAndIndustrySection.tsx`
- `PublicHeader.tsx`
- `CTAButton.tsx`
- `src/data/services.ts`
- `src/data/industries.ts`
- `src/lib/service-areas.ts`
- `src/app/(public)/industries/page.tsx`
- `src/app/(public)/industries/[slug]/page.tsx`

---
# BATCH 6: Future Investigation Areas

**These are not implementation items — they're areas that would benefit from deeper analysis. Listed for future sprint planning.**

---

## 6.1 — Error Recovery & Network Resilience Audit

**What to investigate:**
- What happens when the quote API returns 500? User sees "Unable to submit right now. Please call us directly." — but there's no retry button. Add a retry mechanism.
- What happens on network timeout? No timeout handling in `useQuoteForm`'s fetch calls. Mobile users on spotty Austin cell connections could hang indefinitely on the submit button.
- What happens when SMS/email delivery fails after lead creation? The API returns success (lead is captured), but admin notification fails silently. Add dead-letter alerting.
- Browser back button after Step 1 — does the panel maintain state?
- Multiple rapid CTA taps — can the user open multiple panels?

**Estimated investigation: 4-6 hours**
**Estimated fixes: 4-8 hours depending on findings**

---

## 6.2 — SEO & Metadata Audit

**What to investigate:**
- `layout.tsx` and `page.tsx` metadata exports (title, description, OG tags)
- Structured data / JSON-LD (LocalBusiness schema, Service schema, Review schema)
- Heading hierarchy across the full page (h1 in hero, h2 per section — any violations?)
- Canonical URL handling for service area pages
- `hreflang` tags given bilingual positioning ("Habla Español")
- Image alt text completeness across all sections
- Core Web Vitals impact of changes in Batches 1-4

**Why this matters:** For a local service business, local SEO is likely the #1 organic acquisition channel. Metadata quality directly affects "post construction cleaning austin" search visibility.

**Estimated investigation: 3-4 hours**
**Estimated fixes: 4-8 hours depending on findings**

---

## 6.3 — Security Surface Review

**What to investigate:**
- Step 2 trusts `leadId` without session ownership (`TODO(phase2-security)`)
- No visible rate limiting on the quote API (honeypot is the only bot protection)
- Supabase RLS policies on the leads table
- Twilio/email credential scoping
- Phone numbers stored in formatted display format (not digits)

**Estimated investigation: 3-4 hours**
**Estimated fixes: 4-12 hours depending on severity**

---

## 6.4 — Performance Deep Dive

**What to investigate:**
- Initial JS bundle size (5 statically-imported section components)
- Image optimization audit (are all images using Next.js `<Image>` with proper sizing?)
- Font loading strategy (serif font — preloaded? FOIT/FOUT?)
- Third-party script impact (analytics, Supabase client, Twilio)
- Hero animation performance on low-end devices (Ken Burns + 1.76s fade sequence)

**Estimated investigation: 2-3 hours**
**Estimated fixes: 2-6 hours depending on findings**

---

## 6.5 — AI Assistant Handoff Integration

**What to investigate:**
- The `/api/ai-assistant` route — prompt engineering, session management, rate limiting
- Can the AI extract service type, project size, and timeline from conversation and pre-fill the quote form?
- Handoff path: "Based on our conversation, I've prepared a quote request for you →" button that opens FloatingQuotePanel with fields pre-populated
- Conversation persistence across page navigation (currently lost)

**This is the highest-value AI feature:** transforming the chat from a separate conversion path into a form-filling assistant that reduces friction on the primary path.

**Estimated investigation: 4-6 hours**
**Estimated implementation: 8-16 hours (full handoff integration)**

---

# Final Metrics Summary

## Total Implementation Scope

| Batch | Items | Effort | Scroll Savings |
|---|---|---|---|
| 1: Critical Bugs | 6 | ~2 hours | 0px (bug fixes, not layout) |
| 2: Immediate Wins | 16 | ~3.5 hours | ~1,030px |
| 3: Component Refactors | 7 | ~7-8 hours | ~260-360px |
| 4: Structural Redesigns | 5 | ~12-16 hours | ~470-650px |
| 5: Stretch Goals | 6 | ~18-30 hours | ~400-600px (if carousel) |
| **Batches 1-4 Total** | **34** | **~25-30 hours** | **~1,760-2,040px** |
| **All Batches Total** | **40** | **~43-60 hours** | **~2,160-2,640px** |

## Projected Page Height

| State | Estimated Height |
|---|---|
| Current (post-accordion, pre-changes) | ~7,450px |
| After Batches 1-2 | ~6,420px |
| After Batches 1-3 | ~6,060-6,160px |
| After Batches 1-4 | ~5,410-5,690px |
| After all batches (including carousel) | ~4,810-5,290px |

**The §15.6 target of ~6,100px is achievable after Batches 1-3.** Batches 4-5 push further toward the optimal range.

## Conversion Funnel Improvements

| Improvement | Batch | Mechanism |
|---|---|---|
| Form pre-populated with service type | 3.2 | Context threading eliminates re-selection |
| "Discuss Your Project" as real button | 2.3 | Visual weight matches conversion intent |
| Outcome text visible on mobile | 2.5 | Complete persuasion arc before CTA |
| Dead zone eliminated | 3.1 | Users reach substance faster |
| Proof section has CTA | 4.2 | Conversion path at peak persuasion moment |
| Auto-close bug fixed | 1.1 | Users can actually complete Step 2 |
| Better trust framing | 2.8-2.11, 2.13-2.14 | Specific credibility signals replace generic ones |
| Section order follows trust funnel | 4.4 | Promise → Specifics → Process → Proof → Action |

## Analytics Improvements

| New Event | Batch | Enables |
|---|---|---|
| `accordion_service_expanded` | 2.7 | §15.6 "35% accordion interaction" measurement |
| `quote_panel_bounced` | 3.6 | Form friction vs. timing analysis |
| Service type in `quote_panel_opened` | 3.2 | CTA → conversion attribution |
| `source_cta` in form metadata | 3.2 | Full funnel attribution |

# BATCH 7: Execution Framework

**This section covers how to actually ship Batches 1-6 safely — QA strategy, risk matrix, monitoring plan, and the investigation appendices referenced throughout.**

---

## 7.1 — Global QA Checklist (Run After Every Batch)

Every batch ships with this regression checklist. These are the critical paths that must work regardless of which specific items were changed.

### Conversion Path Integrity (Run on Mobile)

| # | Test | How | Pass Condition |
|---|---|---|---|
| Q1 | Hero quote CTA opens panel | Tap "Get a Free Quote" in hero | FloatingQuotePanel appears, Step 1 visible |
| Q2 | Sticky bar quote CTA opens panel | Scroll past hero, tap "Free Quote" on sticky bar | FloatingQuotePanel appears |
| Q3 | Step 1 → Step 2 transition | Fill name + phone + service type, tap Continue | Step 2 fields appear. Panel stays open. Success message shows. |
| Q4 | Step 2 submission → redirect | Fill optional fields, tap "Send My Quote Request" | Redirect to /quote/success with first name in URL |
| Q5 | Step 1 only → close panel | Complete Step 1, close panel without Step 2 | Panel closes cleanly. No crash. Lead exists in database. |
| Q6 | Phone call CTA | Tap "Call Now" anywhere | `tel:` link triggers phone dialer |
| Q7 | Panel close → sticky bar returns | Close quote panel | Sticky bar reappears after brief delay |
| Q8 | Menu → quote CTA | Open hamburger → tap "Free Quote" | Menu closes, panel opens |

### Navigation Integrity (Run on Mobile)

| # | Test | How | Pass Condition |
|---|---|---|---|
| Q9 | Menu → Services | Hamburger → Services → any sub-item | Page scrolls to correct service in accordion |
| Q10 | Menu → About | Hamburger → About | Page scrolls to About section |
| Q11 | Menu → Careers | Hamburger → Careers | Routes to /careers page (not homepage scroll) |
| Q12 | Menu → FAQ | Hamburger → FAQ | Routes to /faq page |
| Q13 | Footer → all links | Tap each footer nav link | Each routes to correct destination |
| Q14 | Hash navigation | Direct URL `/#services` | Page loads, scrolls to services section |

### Visual Integrity (Run on Mobile + Desktop)

| # | Test | How | Pass Condition |
|---|---|---|---|
| Q15 | No horizontal overflow | Scroll entire page on mobile | No horizontal scrollbar at any point |
| Q16 | All images load | Scroll entire page slowly | Every image renders (no broken image icons) |
| Q17 | Accordion expands/collapses | Tap each service header | Content appears/disappears smoothly |
| Q18 | Before/After slider works | Drag slider on all three tabs | Before/after images clip correctly |
| Q19 | Testimonial carousel works | Swipe left/right | Testimonials transition smoothly |
| Q20 | Desktop layout intact | Load on ≥768px viewport | All sections render in desktop layout (no mobile accordion on desktop, etc.) |

### Performance (Run After Each Batch)

| # | Test | How | Pass Condition |
|---|---|---|---|
| Q21 | Lighthouse mobile score | Run Lighthouse in Chrome DevTools, mobile preset | Performance score ≥ current baseline (document the baseline before starting) |
| Q22 | CLS | Lighthouse or Web Vitals | CLS ≤ 0.1 (good threshold) |
| Q23 | LCP | Lighthouse or Web Vitals | LCP ≤ 2.5s (good threshold) |
| Q24 | No console errors | Open DevTools console, scroll entire page | Zero errors (warnings acceptable) |

### 7.1.1 — Execution Log (2026-04-04)

Automated validation was executed after the latest implementation batches.

#### Automated QA run

- `npm run lint` (initial): **FAILED**
  - `PublicHeader.tsx`: `react-hooks/set-state-in-effect` on route-change menu close effect
  - `VariantAPublicPage.tsx`: `react/no-unescaped-entities` in mobile closer testimonial line
- Fixes applied immediately:
  - Removed synchronous `setState` pathname effect from `PublicHeader.tsx`
  - Escaped quote entities in `VariantAPublicPage.tsx`
- `npm run lint` (re-run): **PASSED**
- `npm run build`: **PASSED**

#### Automated QA rerun (6.1-6.4 hardening)

- `npm run lint`: **PASSED**
- `npm run build`: **PASSED**
- `npm run analyze`: **PASSED with warnings**
  - Analyzer reports generated at:
    - `.next/analyze/client.html`
    - `.next/analyze/nodejs.html`
    - `.next/analyze/edge.html`
  - Known warning class: OpenTelemetry dynamic dependency expression warnings from Sentry instrumentation imports.

#### Resilience/security findings update (6.1, 6.3)

- **PASS (6.1):** Client quote submit path now retries transient `429/5xx` and network/timeout errors with backoff before surfacing failure.
- **PASS (6.1):** Lead acknowledgment SMS now uses retry-capable delivery utility (`sendSmsWithRetry`).
- **PASS (6.1):** Lead acknowledgment email now uses resilient send utility with timeout/retry/dead-letter telemetry.
- **PASS (6.1):** Dead-letter escalation path added to alert ops via `ADMIN_ALERT_EMAIL` when acknowledgments fail after retries.
- **PASS (6.3):** Step2 enrichment input now validates identifier format (`leadId`, `enrichmentToken`) before update attempts.
- **OPEN (6.3):** End-to-end RLS policy verification and non-quote API security review remain pending external QA/audit pass.

#### SEO/metadata findings (6.2)

- **PASS:** Canonical coverage present for root and public routes (including dynamic service-area slug pages).
- **PASS:** Open Graph/Twitter metadata present on core public pages.
- **PASS:** JSON-LD structured data implemented on homepage and key public pages (LocalBusiness/Service/Review/Breadcrumb variants).
- **PASS:** Homepage heading hierarchy has a single `h1` in hero and section-level `h2` pattern.
- **OPEN:** No `hreflang` alternates detected despite bilingual positioning copy.
- **OPEN:** No dedicated route-level social image files detected (`opengraph-image.*`, `twitter-image.*`).
- **OPEN:** Root document language remains `en`; no localized metadata variants configured.

#### Performance findings (6.4)

- `npm run analyze`: **PASSED with warnings**
  - Warnings from OpenTelemetry dynamic dependency expressions via Sentry instrumentation chain.
  - Bundle analyzer reports generated at:
    - `.next/analyze/client.html`
    - `.next/analyze/nodejs.html`
    - `.next/analyze/edge.html`
- **PASS:** Build remains stable with recent UI/interaction changes.
- **PASS:** Public-facing components use Next.js `Image` patterns; no raw `<img>` tags detected in public component path scan.
- **OPEN:** No explicit `next/font` integration detected in source scan (font loading strategy can be optimized).
- **OPEN:** Lighthouse/Web Vitals validation (`Q21-Q23`) not yet executed in this run.

#### Remaining manual validation required

- Execute interaction checks `Q1-Q20` on mobile and desktop (menu flows, slider interactions, CTA routes, accordion behavior).
- Execute browser-console and Lighthouse checks for `Q21-Q24`.

---

## 7.2 — Batch-Specific QA Supplements

In addition to the global checklist, each batch has specific tests outlined in individual items. Here's a consolidated view of what to verify per batch beyond the global checklist:

### After Batch 1 (Bug Fixes)

| Test | Item | Critical? |
|---|---|---|
| Step 1→2 panel stays open for 30+ seconds | 1.1 | **Yes** — this is the primary bug fix |
| Panel title changes between steps | 1.2 | Yes |
| AI trigger hides near hero CTA | 1.3 | Yes |
| AI trigger hides near Service Area CTA | 1.3 | Yes |
| AI trigger hides near Let's Talk CTA | 1.3 | Yes |
| AI trigger visible on About section (no nearby CTA) | 1.3 | Yes |
| Panel renders above header (z-index) | 1.4 | Moderate |
| Step 1 with malformed API response shows success message, not Step 2 | 1.5 | Edge case — test if feasible |

### After Batch 2 (Immediate Wins)

| Test | Item | Critical? |
|---|---|---|
| No careers content on homepage | 2.1 | **Yes** |
| /careers page loads independently | 2.1 | **Yes** |
| No footer CTA module visible on mobile | 2.2 | Yes |
| Footer CTA module visible on desktop | 2.2 | Yes |
| "Discuss Your Project" is a dark filled button on every persona card | 2.3 | Yes |
| "Talk Through Your Scope" appears BELOW all three cards on mobile | 2.4 | Yes |
| "Talk Through Your Scope" appears beside heading on desktop | 2.4 | Yes |
| Outcome text visible on all three persona cards on mobile | 2.5 | Yes |
| First accordion service expanded on page load (clean URL) | 2.6 | Yes |
| `accordion_service_expanded` analytics event fires | 2.7 | Moderate — requires analytics tool |
| Authority Bar headline updated, no "Our Numbers Speak" | 2.8 | Visual check |
| No "focus" in On-Time stat | 2.9 | Visual check |
| Licensed & Insured detail text is shorter | 2.10 | Visual check |
| Star rating has count or specific audience text | 2.11 | Visual check |
| No city pill links on any viewport | 2.12 | Yes |
| No region legend on mobile | 2.12 | Yes |
| Testimonial headline updated | 2.13 | Visual check |
| "1 of 4 reviews" count visible | 2.14 | Visual check |
| Timeframe badge on testimonial cards | 2.14 | Visual check |
| Menu backdrop dark enough to obscure page content | 2.15 | Visual check |
| Hero subtitle readable against all image areas | 2.16 | Visual check |

### After Batch 3 (Component Refactors)

| Test | Item | Critical? |
|---|---|---|
| Hero is shorter on mobile (75svh) | 3.1 | **Yes** — verify on 3+ device sizes |
| Hero is full height on desktop | 3.1 | **Yes** |
| No CLS on hero load | 3.1 | **Yes** — run Lighthouse |
| Service CTA pre-selects service type in form | 3.2 | **Yes** — test all 5 services |
| Persona CTA pre-selects service type in form | 3.2 | Yes — test all 3 personas |
| Generic CTAs (hero, sticky, footer) do NOT pre-select | 3.2 | Yes |
| No Timeline intro paragraph | 3.3 | Visual check |
| Timeline step icons visible on mobile | 3.4 | Visual check |
| Tab key doesn't reach collapsed accordion content | 3.5 | **Yes** — keyboard test |
| `quote_panel_bounced` fires on close without input | 3.6 | Moderate — requires analytics |
| `quote_form_abandoned` fires on close WITH input | 3.6 | Moderate |
| No large white space below form in panel | 3.7 | Visual check on mobile |
| Panel scrolls if Step 2 content is tall | 3.7 | Functional test |

### After Batch 4 (Structural Redesigns)

| Test | Item | Critical? |
|---|---|---|
| No "What's Included" section on page | 4.1 | **Yes** |
| Gold value lines visible in each Timeline step | 4.1 | Yes |
| Before/After headline reads "The A&A Standard" | 4.2 | Visual check |
| Result is featured in dark block above metadata | 4.2 | Yes |
| "Want this for your space?" CTA visible below metadata | 4.2 | Yes |
| Micro-CTA opens form with correct service pre-selected | 4.2 | Yes — test all 3 tabs |
| Where We Work shows compact pills on mobile | 4.3 | Yes |
| Where We Work shows interactive map on desktop | 4.3 | Yes |
| Section order follows proposed narrative arc | 4.4 | **Yes** — verify full scroll order |
| All hash navigation still works after reorder | 4.4 | **Yes** |
| Proof lines visible in expanded accordion services | 4.5 | Visual check |
| Package labels visible in collapsed accordion headers | 4.5 | Visual check |

---

## 7.3 — Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Context threading breaks existing CTA behavior | Low | High | All props are optional with backward-compatible defaults. Existing call sites pass nothing and work as before. |
| Hero height change causes CLS regression | Low | High | `useState(initializer)` pattern is synchronous. localStorage key change prevents stale values. Run Lighthouse CLS check. |
| Section reordering breaks analytics tracking | Low | Medium | All sections have explicit `id` attributes. section_view events use `id`, not DOM position. Verify events fire correctly. |
| IncludedSummary removal causes desktop stakeholder pushback | Medium | Medium | Prepare desktop-only preservation option (`hidden md:block`). Show the merged Timeline with value lines as the better alternative. |
| FloatingQuotePanel height change breaks Step 2 layout | Medium | Medium | Step 2 has more fields. Test with all fields filled to maximum content height. `overflow-y-auto` handles overflow. |
| Accordion `inert` attribute not supported on old browsers | Low | Low | `inert` supported since Chrome 102, Firefox 112, Safari 15.5. Target audience (contractors with modern phones) is well within support. `aria-hidden` still present as fallback. |
| City pills removal affects SEO (inbound links to /service-area/[slug]) | Low | Medium | Pages stay live. Only homepage links removed. External links and organic search continue to reach the pages. |
| Menu backdrop opacity too dark on some devices | Low | Low | 70% is well within standard range. If too dark, reduce to 65%. Pure CSS change. |
| AI suppression ID attributes conflict with existing IDs | Very Low | Low | Search codebase for `hero-primary-cta`, `service-area-primary-cta`, `mobile-quote-closer-cta` before adding. No conflicts expected (these are new IDs). |
| Footer CTA removal affects sub-page conversion on mobile | Medium | Medium | Sticky bar provides mobile conversion path on all pages. Monitor sub-page quote submission volume post-change. If it drops, add compact sub-page CTA (Batch 5 item). |

---

## 7.4 — Monitoring Plan (Post-Ship)

After each batch, monitor these metrics for 7 days before shipping the next batch:

### Primary Conversion Metrics

| Metric | Source | Alert Threshold |
|---|---|---|
| Quote form submissions (total) | `quote_form_submitted` events | > 20% decrease from 7-day pre-change baseline |
| Step 1 completions | `quote_step1_completed` events | > 20% decrease |
| Step 2 completions | `quote_step2_completed` events | > 15% decrease |
| Phone call CTA taps | `cta_click` where `action_type: "call"` | > 25% decrease |
| Quote panel open rate | `quote_panel_opened` / total page views | > 15% decrease |

### Engagement Metrics

| Metric | Source | Alert Threshold |
|---|---|---|
| Scroll depth 50% | `scroll_depth` milestone events | > 10% decrease |
| Scroll depth 75% | `scroll_depth` milestone events | > 10% decrease |
| Services section view rate | `section_view` for `#services` | > 10% decrease |
| Average time on services section | `time_in_view_ms` for `#services` | > 20% decrease |
| Accordion interaction rate (after 2.7) | `accordion_service_expanded` / `section_view` for `#services` | Baseline: establish first. Target: ≥ 35% |

### Performance Metrics

| Metric | Source | Alert Threshold |
|---|---|---|
| LCP | Web Vitals / Sentry | Increase > 0.5s |
| CLS | Web Vitals / Sentry | Increase > 0.05 |
| FID/INP | Web Vitals / Sentry | Increase > 50ms |
| JS bundle size | Build output | Increase > 10% |

### New Metrics Enabled by Changes

| Metric | Available After | Purpose |
|---|---|---|
| Accordion interaction rate | Batch 2 (item 2.7) | §15.6 acceptance target |
| Panel bounce rate | Batch 3 (item 3.6) | Form friction measurement |
| Context threading effectiveness | Batch 3 (item 3.2) | Compare bounce rates: pre-selected vs. blank |
| Source CTA → conversion attribution | Batch 3 (item 3.2) | Which CTAs drive actual submissions |
| Before/After CTA engagement | Batch 4 (item 4.2) | Does proof-point CTA convert? |

---

## 7.5 — Deployment Strategy

### Recommended Approach: Feature Flags Per Batch

Each batch should be deployable behind a feature flag (URL parameter, cookie, or server-side flag) so it can be:
1. Tested in production by the team before public rollout
2. Rolled back instantly without a code deployment
3. A/B tested against the current version if desired

**Simple implementation:** Use the same URL parameter pattern as the hero variant:

```
?batch=2     → Enables Batch 2 changes
?batch=2,3   → Enables Batches 2 and 3
?batch=all   → Enables all batches
```

For server components, the parameter would need to be read in middleware and passed down. For client components, each gated section checks the parameter.

**Simpler alternative:** Ship each batch as a normal deployment, monitor for 48-72 hours, then ship the next. Rollback via git revert if metrics degrade. This is faster and works well for a small team.

**Recommendation:** The simpler alternative. Feature flags add development overhead. The changes in Batches 1-3 are low-risk (bug fixes, copy changes, additive props). Batch 4 is higher-risk (section removal, reordering) and might benefit from a staging deployment with stakeholder review before production.

### Deployment Timeline

| Week | Batch | Focus |
|---|---|---|
| Week 1, Days 1-2 | **Batch 1** | Bug fixes. Ship immediately. These are active bugs. |
| Week 1, Days 3-5 | **Batch 2** | Immediate wins. Ship in 2-3 PRs grouped by file (see Batch 2 shipping order). |
| Week 2 | **Batch 3** | Component refactors. Ship 3.1 (hero) and 3.2 (context threading) as separate PRs. Bundle 3.3-3.7. |
| Week 3 | **Batch 4** | Structural redesigns. Ship 4.5 first (smallest). Then 4.1 + 4.4 together (merge + reorder). Then 4.2 and 4.3 separately. |
| Week 4+ | **Batch 5** | Stretch goals. Prioritize based on Batch 1-4 metrics. |

### PR Structure

Each PR should include:
1. **Title:** Batch number + item number + one-line description
   - Example: `[Batch 1.1] Fix auto-close race condition on Step 1→2 transition`
2. **Description:** Copy the relevant item from this document (context, fix, acceptance criteria)
3. **Testing notes:** Which tests from the QA checklist are relevant
4. **Desktop safety annotation:** The 🟢/🟡/🔴 rating from this document
5. **Screenshots/recordings:** Before and after on mobile (required for all visual changes)

---

## 7.6 — Success Criteria for the Full Project

After all Batches 1-4 are deployed and stable for 14 days, evaluate against these targets:

### §15.6 Quantified Acceptance Targets

| Target | Measurement | Status |
|---|---|---|
| Form conversion rate improves by 15% | `quote_form_submitted` / total page views, compared to 14-day pre-project baseline | Measurable after Batch 3 (context threading + bug fixes are the primary drivers) |
| Accordion expand interactions reach 35% of service-section viewers | `accordion_service_expanded` unique users / `section_view` #services unique users | Measurable after Batch 2 (item 2.7 enables tracking) |
| No regression in LCP/CLS | Web Vitals comparison: 14-day post vs. 14-day pre | Measurable continuously |
| Mobile scroll depth 75% reached by ≥ 40% of users | `scroll_depth` 75% milestone / total page views | Measurable after Batch 4 (section reordering + scroll reduction are the primary drivers) |

### Additional Success Indicators

| Indicator | Healthy Signal | Concerning Signal |
|---|---|---|
| Step 1→2 completion rate | Increases (auto-close bug fixed) | Stays same or decreases |
| Panel bounce rate | Decreases for service CTAs (context threading reduces bounces) | No change (threading not working) |
| Quote submissions per session | Increases slightly (more conversion paths, less friction) | Decreases (something broken) |
| Phone call CTA taps | Stable or slight decrease (more users converting via form instead) | Large decrease (CTA visibility issue) |
| Scroll depth 50% | Stable or increases (less dead space, better content) | Decreases (something pushing users away earlier) |
| Average session duration | Stable (users finding what they need faster, but engaging more deeply) | Large decrease (users bouncing earlier) |

---

## 7.7 — Source of Truth Reference

This document references several other documents and code artifacts. For the team's reference:

| Reference | What It Contains | Where It's Used |
|---|---|---|
| §15.2 | Sticky bar behavior spec | Batch 1 (z-index), Batch 3 (panel height) |
| §15.3 | Social proof placement rules | Batch 2 (testimonial improvements), Batch 4 (Before/After CTA) |
| §15.4 | Hero decision gate | Batch 3 (hero height default) |
| §15.5 | Industry vertical page directive | Batch 5 (deferred template) |
| §15.6 | Quantified acceptance targets | Throughout (measurement gates) |
| §16.2 | Thematic redundancy identification | Batch 4 (IncludedSummary/Timeline merge) |
| §16.4 | Product directives (Careers removal, CTA de-duplication, service area) | Batches 2, 4 |
| §16.5 | Service area decommission plan | Modified: keep pages, remove homepage links |
| §16.7 | Section redundancy flags | Batch 4 (merge, reorder) |
| Desktop Safety Contract | Mobile changes must not break desktop | Every item annotated with 🟢🟡🔴 |
| Code Review Findings | CLS fix, lazy loading, backdrop, chevrons | Batch 1 confirmations, Batch 2 fixes |

---

# APPENDIX A: Complete File Change Map

Every file touched across all batches, with the specific items affecting it:

| File | Batch Items | Total Touches |
|---|---|---|
| `FloatingQuotePanel.tsx` | 1.1, 1.2, 1.4, 3.2, 3.6, 3.7 | 6 |
| `OfferAndIndustrySection.tsx` | 2.3, 2.4, 2.5, 3.2 | 4 |
| `ServiceSpreadSection.tsx` | 2.6, 2.7, 3.2, 3.5, 4.5 | 5 |
| `AuthorityBar.tsx` | 2.8, 2.9, 2.10, 2.11 | 4 |
| `TestimonialSection.tsx` | 2.13, 2.14 | 2 |
| `PublicHeader.tsx` | 2.1 (link fix), 2.15, 5.6 | 3 |
| `VariantAPublicPage.tsx` | 2.1 (remove careers), 4.1 (remove IncludedSummary), 4.4 (reorder) | 3 |
| `TimelineSection.tsx` | 3.3, 3.4, 4.1 (add value lines) | 3 |
| `HeroSection.tsx` | 2.16, 3.1 | 2 |
| `ServiceAreaSection.tsx` | 2.12, 4.3 | 2 |
| `BeforeAfterSlider.tsx` | 4.2 | 1 |
| `CTAButton.tsx` | 3.2, 5.5 | 2 |
| `QuoteCTA.tsx` | 3.2 | 1 |
| `QuoteContext.tsx` | 3.2 | 1 |
| `PublicChrome.tsx` | 3.2 | 1 |
| `useQuoteForm.ts` | 1.5, 1.6, 3.1 (key name) | 3 |
| `FooterSection.tsx` | 2.1 (verify link), 2.2 | 2 |
| `AIQuoteAssistant.tsx` | 1.3 | 1 |
| `CareersSection.tsx` | (no changes — file preserved for /careers route) | 0 |
| `globals.css` / `tailwind.config` | (no changes needed) | 0 |
| `quote-request/route.ts` | (no changes needed in Batches 1-4) | 0 |
| **New:** `src/lib/service-type-map.ts` | 3.2 | 1 (created) |

**Most-touched files:** FloatingQuotePanel (6), ServiceSpreadSection (5), AuthorityBar (4), OfferAndIndustrySection (4). These are the files with the most cross-batch changes. When reviewing PRs that touch these files, check for conflicts with items from other batches.

---

# APPENDIX B: Copy Changes Registry

All text/copy changes in one place, for stakeholder review before implementation:

### Headlines & Kickers Changed

| Section | Before | After | Item |
|---|---|---|---|
| Authority Bar kicker | "Track Record" | "The A&A Standard" | 2.8 |
| Authority Bar headline | "Our Numbers Speak" | "15+ Years. 500+ Spaces. Austin's Standard." | 2.8 |
| Testimonial kicker | "Client Feedback" | "Verified Results" | 2.13 |
| Testimonial headline | "What Clients Say" | "Trusted by Austin's Toughest Projects" | 2.13 |
| Before/After kicker | "The A&A Standard" | "Proof of Work" | 4.2 |
| Before/After headline | "See the Difference" | "The A&A Standard" | 4.2 |
| Before/After subtitle | (none) | "Drag to compare — real projects, real results." | 4.2 |
| Timeline kicker | "Our Process" | "The A&A Process" | 4.1 |
| Timeline headline | "How It Works" | "How We Deliver" | 4.1 |
| Where We Work headline (mobile) | (existing generic) | "Georgetown to San Marcos" | 4.3 |
| Where We Work kicker (mobile) | (existing) | "Coverage Area" | 4.3 |
| Quote panel title (Step 1) | "Detailed Scope Request" | "Get a Free Quote" | 1.2 |
| Quote panel title (Step 2) | "Detailed Scope Request" | "Add Project Details" | 1.2 |

### Stat/Data Text Changed

| Element | Before | After | Item |
|---|---|---|---|
| On-Time stat detail | "handoff focus" | "handoff rate" (if provable) or "to on-time handoffs" | 2.9 |
| Licensed & Insured detail | "ready for commercial and site work" | "fully credentialed for commercial sites" | 2.10 |
| Star rating text | "Trusted across Austin-area job sites, office spaces, and turnovers." | "Rated 5 stars across 200+ completed projects" | 2.11 |

### New Text Added

| Element | Text | Item |
|---|---|---|
| Testimonial count | "{N} of 4 reviews" | 2.14 |
| Who We Serve mobile fallback CTA intro | "Not sure which fits your project?" | 2.4 |
| Quote panel Step 1 subtitle | "Step 1 of 2 — Just three fields to get started." | 1.2 |
| Quote panel Step 2 subtitle | "Step 2 of 2 — Optional details to speed up your quote." | 1.2 |
| Before/After micro-CTA | "Want this for your space?" | 4.2 |
| Where We Work subtitle (mobile) | "Same standards at every location across the Austin metro." | 4.3 |
| Timeline value lines (4 new sub-texts) | See item 4.1 for full text per step | 4.1 |
| LeadId missing fallback message | "Thanks! We received your request and will call within 1 hour." | 1.5 |

---

# APPENDIX C: Analytics Events Registry

All analytics events — existing, modified, and new — in one place:

### Existing Events (Unchanged)

| Event | Source | When It Fires |
|---|---|---|
| `section_view` | PublicChrome IntersectionObserver | Section enters viewport at ≥25% |
| `scroll_depth` | PublicChrome scroll listener | At 25/50/75/100% milestones |
| `cta_click` | CTAButton handleClick | Any CTA tapped |
| `quote_panel_opened` | CTAButton handleClick (quote type) | Quote CTA tapped |
| `quote_form_started` | useQuoteForm markFormStarted | First field focused |
| `quote_step1_completed` | useQuoteForm submitLead | Step 1 API success |
| `quote_step2_viewed` | useQuoteForm submitLead | After Step 1, transitioning to Step 2 |
| `quote_step2_completed` | useQuoteForm submitLead | Step 2 API success |
| `quote_form_submitted` | useQuoteForm submitLead | Final submission success |
| `quote_submit_failed` | useQuoteForm submitLead | API error response |
| `quote_form_abandoned` | FloatingQuotePanel close effect | Panel closed with input, no success |
| `hero_variant_applied` | HeroSection | Hero variant determined |
| `exit_intent_shown` | ExitIntentOverlay | Overlay displayed |
| `exit_intent_dismissed` | ExitIntentOverlay | User dismissed overlay |
| `exit_intent_accepted` | ExitIntentOverlay | User clicked quote CTA in overlay |
| `ai_assistant_opened` | AIQuoteAssistant | Chat panel opened |
| `ai_assistant_message_submit` | AIQuoteAssistant sendMessage | User sent message |
| `ai_assistant_message_success` | AIQuoteAssistant sendMessage | AI responded |
| `ai_assistant_message_failed` | AIQuoteAssistant sendMessage | AI response failed |

### Removed Events

| Event | Reason | Item |
|---|---|---|
| `quote_submit_success` | Duplicate of `quote_form_submitted` | 1.6 |

### Modified Events (New Metadata)

| Event | New Metadata Fields | Item |
|---|---|---|
| `cta_click` | `service_type` (when CTA has service context) | 3.2 |
| `quote_panel_opened` | `service_type`, improved `source_cta_id` | 3.2 |
| `quote_open_clicked` | `service_type`, `source_cta` | 3.2 |
| `quote_step1_completed` | `lead_id_missing: true` (when leadId null) | 1.5 |

### New Events

| Event | Source | When It Fires | Item |
|---|---|---|---|
| `accordion_service_expanded` | ServiceSpreadSection | User taps to expand a service | 2.7 |
| `quote_panel_bounced` | FloatingQuotePanel | Panel closed with zero input, no success | 3.6 |

### Event Flow Diagram (Happy Path)

```
User lands on page
  → section_view (hero)
  → scroll_depth (25%)
  → section_view (authority-bar)
  → section_view (services)
  → accordion_service_expanded (post-construction)      ← NEW
  → cta_click (service CTA, service_type: post_construction)  ← ENHANCED
  → quote_panel_opened (service_type: post_construction)       ← ENHANCED
  → quote_form_started (focus on name field)
  → quote_step1_completed (serviceType: post_construction)
  → quote_step2_viewed (lead_id: abc123)
  → quote_step2_completed (serviceType: post_construction)
  → quote_form_submitted (serviceType: post_construction, hero_variant: compact)
  → [redirect to /quote/success]
```

### Event Flow Diagram (Bounce Path)

```
User lands on page
  → section_view (hero)
  → cta_click (hero CTA, no service_type)
  → quote_panel_opened (no service_type)
  → [user looks at form, closes without typing]
  → quote_panel_bounced (step: 1, had_initial_service_type: false)  ← NEW
```

### Event Flow Diagram (Abandonment Path)

```
User lands on page
  → section_view (services)
  → accordion_service_expanded (commercial)               ← NEW
  → cta_click (service CTA, service_type: commercial)     ← ENHANCED
  → quote_panel_opened (service_type: commercial)          ← ENHANCED
  → quote_form_started
  → [user types name, selects service, types phone]
  → [user closes panel without submitting]
  → quote_form_abandoned (step: 1, has_name: true, has_phone: true, has_service_type: true)
```

---

# APPENDIX D: Investigation Backlog (Detailed)

These are the future investigation areas referenced in Batch 6, expanded with specific questions and suggested approaches.

---

## D.1 — Error Recovery & Network Resilience

### Questions to Answer

1. **What does the user see when the quote API returns 500?**
   - Current: "Unable to submit right now. Please call us directly."
   - Problem: No retry button. User has to close panel, scroll to find a phone number, or use sticky bar.
   - Suggested fix: Add "Try Again" button below error message. On second failure, show phone number inline.

2. **What happens with a network timeout?**
   - Current: `fetch()` has no timeout. On mobile with poor connectivity, the "Continue" button spins indefinitely.
   - Suggested fix: Add `AbortController` with 15-second timeout. Show "Taking longer than usual... [Try Again] [Call Instead: (512) 555-0199]"
   - Implementation sketch:
     ```tsx
     const controller = new AbortController();
     const timeoutId = setTimeout(() => controller.abort(), 15000);
     const response = await fetch(url, { signal: controller.signal });
     clearTimeout(timeoutId);
     ```

3. **What happens when SMS/email delivery fails?**
   - Current: API catches delivery errors but still returns success (lead is in database).
   - Problem: Admin doesn't know to follow up if they didn't get the SMS alert.
   - Suggested fix: Dead-letter queue or fallback notification (email admin if SMS fails, log to monitoring if both fail).

4. **Browser back button behavior:**
   - If quote panel is open and user taps Android back button: does the panel close, or does the page navigate away?
   - If it navigates away, the user loses their partially-filled form.
   - Suggested fix: Push a history entry when panel opens, listen for `popstate` to close panel instead of navigating.

5. **Rapid CTA taps:**
   - Can a user tap "Free Quote" 5 times in 100ms? Does `openQuote()` fire 5 times?
   - Current: `isQuoteOpen` state prevents multiple panels (second call sets `true` when it's already `true` — no-op).
   - Probably fine, but verify there aren't 5 analytics events fired.

### Approach

- Spend 2 hours reproducing each scenario manually (throttle network in DevTools, return error codes from API)
- Document actual behavior vs. expected behavior
- Estimate fix effort per issue
- Prioritize by frequency × impact

---

## D.2 — SEO & Metadata

### Questions to Answer

1. **Does the homepage have proper `<title>` and `<meta name="description">`?**
   - Expected: "A&A Cleaning Services — Post-Construction & Commercial Cleaning in Austin, TX"
   - Check: `app/page.tsx` or `app/layout.tsx` metadata export

2. **Is there JSON-LD structured data?**
   - Expected: LocalBusiness schema with name, address, phone, service area, aggregate rating
   - Check: Look for `<script type="application/ld+json">` in layout or page
   - If missing: high-priority addition for local search

3. **Heading hierarchy:**
   - Hero `<h1>`: "Every Surface. Every Detail. Every Time."
   - Each section should use `<h2>` for its heading
   - Check: are there any `<h1>` elements besides the hero? Any `<h3>` used without a parent `<h2>`?

4. **Image alt text:**
   - Hero image: does it have descriptive alt text?
   - Service images: do they describe what's shown?
   - Before/After images: do they have "Before" and "After" context?

5. **Service area pages canonical URLs:**
   - Each `/service-area/[slug]` page should have `<link rel="canonical">` pointing to itself
   - The homepage should NOT have canonical pointing to a service area page

6. **Bilingual considerations:**
   - "Habla Español" is a trust signal, but the site is English
   - Are there `hreflang` tags?
   - Is there a Spanish version of any page?
   - If not, consider adding `<html lang="en">` explicitly

### Approach

- Run Screaming Frog or similar crawler on the site
- Run Google's Structured Data Testing Tool
- Manual audit of metadata exports in Next.js files
- Check Google Search Console for any existing issues

---

## D.3 — Security Surface

### Questions to Answer

1. **Step 2 leadId trust issue:**
   - Anyone who knows a leadId can send a Step 2 update with arbitrary data
   - Is this exploitable? An attacker would need a valid leadId
   - LeadIds are UUIDs (if using Supabase default) — not guessable
   - Risk: Low but documented as TODO

2. **Rate limiting:**
   - Can someone spam the quote API?
   - Honeypot catches bots that fill the hidden field
   - But a targeted attacker could submit thousands of valid-looking leads
   - Check: Vercel Edge middleware, Supabase RLS, any rate limiting headers

3. **Data access:**
   - Can the Supabase client used in the API route read all leads?
   - Is it using a service role key (full access) or an anon key (RLS-restricted)?
   - If service role: the API route is the only access point, so it's contained
   - If anon key: RLS policies must prevent read access to other leads

4. **PII handling:**
   - Phone numbers stored in formatted display format
   - Names, emails, descriptions stored as submitted
   - Is the Supabase instance encrypted at rest?
   - Are there any logging endpoints that might log PII?

### Approach

- Review Supabase dashboard for RLS policies on leads table
- Check API route for authentication/authorization middleware
- Review Vercel project settings for rate limiting configuration
- Attempt to read leads via Supabase client from browser console (should fail)

---

## D.4 — Performance Deep Dive

### Questions to Answer

1. **Initial bundle size:**
   - 5 statically imported section components: HeroSection, AuthorityBar, ServiceSpreadSection, OfferAndIndustrySection, TimelineSection (+ AboutSection, ServiceAreaSection, CareersSection)
   - What's the total JS weight?
   - Run `next build` and check the output size report

2. **Image optimization:**
   - Are all images using `<Image>` from `next/image`?
   - Are they serving WebP/AVIF formats?
   - Do they have explicit `width` and `height` (prevents CLS)?
   - Hero image: is it using `priority` prop (preloaded)?

3. **Font loading:**
   - The serif font (used in headlines) — how is it loaded?
   - Is it preloaded via `next/font`?
   - Does it cause FOIT (Flash of Invisible Text) or FOUT (Flash of Unstyled Text)?

4. **Third-party scripts:**
   - Analytics library weight
   - Supabase client library weight
   - Any other third-party scripts?

5. **Animation performance:**
   - Hero Ken Burns (15s CSS animation) — GPU cost on low-end devices?
   - Counter animation (requestAnimationFrame) in AuthorityBar
   - Multiple IntersectionObservers (one per section for scroll-reveal, one in PublicChrome for analytics)
   - Could observers be consolidated?

### Approach

- Run `next build` and analyze bundle
- Run Lighthouse performance audit on mobile with 4× CPU throttling
- Test on a real low-end Android device (if available)
- Profile with Chrome DevTools Performance tab during scroll

---

## D.5 — AI Assistant Integration

### Questions to Answer

1. **What's the AI's prompt engineering?**
   - Does it know about A&A's services, pricing, coverage area?
   - Can it handle off-topic questions gracefully?
   - Does it know when to recommend the quote form vs. a phone call?

2. **Can the AI extract structured data from conversation?**
   - If a user says "I need a post-construction clean for a 5,000 sq ft office in Round Rock, ready by Friday"
   - Can the AI extract: service type (post-construction), size (5,000 sq ft), location (Round Rock), timeline (Friday)?
   - This data could pre-fill the quote form

3. **Handoff UX:**
   - After gathering project details, the AI could say: "I've got what I need. Let me prepare your quote request →"
   - Button opens FloatingQuotePanel with fields pre-populated from conversation
   - This is the highest-value AI feature — turning the chat into a form-filling assistant

4. **Session persistence:**
   - Currently, conversation is lost on page navigation
   - Should sessions persist in localStorage?
   - Should there be a "conversation transcript" sent with the lead?

5. **Rate limiting and cost:**
   - Each message = one API call to the AI backend
   - Is there per-session or per-IP rate limiting?
   - What's the cost per conversation?
   - Is there a graceful degradation if the AI service is down?

### Approach

- Review `/api/ai-assistant` route code (not yet provided)
- Test conversation quality with various prompts
- Design the handoff UX (mockup → implementation)
- Estimate API costs at projected traffic volume

---

# APPENDIX E: Decision Log

Documenting the key decisions made during this analysis, with rationale, for future reference.

| Decision | Options Considered | Chosen | Rationale |
|---|---|---|---|
| IncludedSummary disposition | A: Merge into Timeline, B: Keep desktop-only, C: Differentiate sharply | A: Merge | Data-level overlap confirmed at 80%. Concrete version (Timeline) is better than abstract version (IncludedSummary). Merge is clean. |
| Footer CTA disposition | A: Remove entirely, B: Compact one-liner, C: Desktop-keep/mobile-hide | C: Desktop-keep/mobile-hide | Desktop needs the CTA (no MobileQuoteCloser). Mobile doesn't (MobileQuoteCloser is terminal). Simplest fix. |
| Who We Serve mobile treatment | A: Carousel, B: Fix CTAs + show outcomes, C: Accordion | B: Fix CTAs + show outcomes | Copy is too good to compress. Two targeted fixes (button + outcome text) solve the main issues. Carousel deferred to Batch 5. |
| Where We Work scope | A: Mini map + pills, B: Keep cards only, C: Interactive cards | Modified A: Compact pills + optional mini map | Cards are non-interactive on mobile (divs). Pills are more honest — they display info without implying interactivity. Mini map adds geographic credibility. |
| Service area pages | Decommission (per §16.4) vs. Keep | Keep pages, remove homepage links | Content is substantial and SEO-valuable. Decommission recommendation was made before seeing data quality. |
| Hero default variant | 100svh (current) vs. 75svh | 75svh default | ~400px dead zone is the worst UX moment on the page. Burden of proof should be on keeping the dead zone. |
| Auto-close fix approach | A: Remove effect, B: Add step2Submitted signal | A: Remove effect | Auto-close is redundant (redirect handles exit). Removing is simpler and eliminates dead code. |
| Context threading scope | Thread service type only vs. full context object | Full context object (serviceType + sourceCta) | Minimal additional effort. sourceCta enables full funnel attribution in analytics. |
| Section reorder | Keep current vs. proposed trust funnel order | Proposed order | Process before proof creates better narrative arc. Proof + testimonials back-to-back creates a stronger "proof block." |

---

**End of Master Implementation Document.**

**Total items across all batches: 40 implementation items + 5 investigation areas**
**Estimated total effort for Batches 1-4: 25-30 hours**
**Projected outcome: ~5,400-5,700px mobile page height (from ~7,450px), improved conversion funnel with context threading, 8 bugs fixed, 6 analytics gaps filled, and a clean narrative arc from promise to proof to action.**

# ADDENDUM: Final Review Findings

**After walking through the entire document end-to-end against the full codebase context, I found six issues that are high-impact enough to warrant inclusion. Two are bugs (one created by our own Batch 1 fix), three are strategic gaps the document doesn't address, and one is a UX concern that could undermine the form conversion improvements we're building.**

---

## FINDING 1: Batch 1.1 Creates a New Bug — Panel Stays Open After Step 2 Redirect

**Severity: High — This must ship WITH Batch 1.1, not after it**

Our fix in 1.1 removes the auto-close `useEffect` from FloatingQuotePanel. This is correct — the auto-close fires prematurely on Step 1→2 transition. But removing it exposes a second problem: **nothing else closes the panel after Step 2 submission.**

Trace the Step 2 completion path:

```
Step 2 submit → useQuoteForm.submitLead:
  → await fetch('/api/quote-request', { flowStep: "step2", ... })
  → response.ok
  → await trackConversionEvent("quote_step2_completed")
  → await trackConversionEvent("quote_form_submitted")
  → router.push('/quote/success?name=...')
```

`router.push` navigates the page. But `isQuoteOpen` in PublicChrome remains `true`. PublicChrome is a layout wrapper — in Next.js App Router, layout state persists across page navigations within the same layout. The user arrives at `/quote/success` with the FloatingQuotePanel still open on top of the success page.

Today, the buggy auto-close accidentally masks this — the panel closes 1.8 seconds after Step 1 (wrong timing), but by the time Step 2 submits and redirects, the auto-close may have already fired. With our fix removing the auto-close entirely, the panel never closes.

### Required Addition to Item 1.1

Add an explicit `onClose()` call before the redirect in `useQuoteForm.ts`. But `useQuoteForm` doesn't have access to `onClose` — that's a FloatingQuotePanel prop from PublicChrome.

**Two approaches:**

**Approach A: Close panel in FloatingQuotePanel when redirect is detected**

In `FloatingQuotePanel.tsx`, add a pathname-watching effect:

```tsx
import { usePathname } from "next/navigation";

const pathname = usePathname();

// Close panel when navigating away from homepage
useEffect(() => {
  if (isOpen && pathname !== "/") {
    onClose();
  }
}, [pathname, isOpen, onClose]);
```

When `router.push('/quote/success')` fires, the pathname changes to `/quote/success`. The effect detects the navigation and closes the panel. This also handles any other navigation-while-panel-open edge case.

**Approach B: Call onClose before redirect in useQuoteForm**

This requires passing `onClose` through to the hook, which changes the hook's interface. More invasive.

**Recommendation: Approach A.** It's defensive (handles all navigation cases), self-contained within FloatingQuotePanel, and doesn't change the useQuoteForm interface.

**Add this to the Batch 1.1 implementation.** This is not optional — without it, removing the auto-close creates a visible regression.

### Acceptance Criteria Addition for 1.1

Add to the existing test list:

```
10. Complete Step 1 → Step 2 → Submit Step 2 successfully
11. PASS: Page navigates to /quote/success. Panel is NOT visible on the success page.
12. FAIL: Panel remains open overlaying the success page content.
```

---

## FINDING 2: No "Back to Step 1" Option on Step 2

**Severity: Moderate — UX gap in the form that context threading (3.2) makes more visible**

After Step 1 completes, the user sees Step 2 fields. If they realize they selected the wrong service type (or want to change their phone number), there's no way back. No "← Back" button. No "Edit previous step" link. They'd have to close the panel entirely and re-open it, which resets the form to Step 1 with empty fields (since the panel unmounts on close).

Context threading (3.2) makes this more visible because users will now see a pre-selected service type. If the pre-selection is wrong (e.g., they navigated from the Post-Construction accordion but actually need a Final Clean), they need to correct it. But on Step 2, the service type dropdown isn't shown — it was part of Step 1.

### Recommended Fix

Add a "← Back" button on Step 2 that returns to Step 1 with fields preserved:

In `FloatingQuotePanel.tsx`, add above the Step 2 form fields:

```tsx
{currentStep === 2 && (
  <button
    type="button"
    onClick={() => {
      setters.setCurrentStep?.(1);
      // Note: feedback message should clear
      // setFeedback(null) would need to be exposed from useQuoteForm
    }}
    className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
  >
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M10 4L6 8l4 4" />
    </svg>
    Edit contact details
  </button>
)}
```

This requires `setCurrentStep` to be exposed from `useQuoteForm`. Looking at the hook's return:

```tsx
return {
  // ... existing
  setCurrentStep, // Already exposed!
};
```

`setCurrentStep` IS already in the return object. So the FloatingQuotePanel just needs to call it:

```tsx
const { setters, currentStep, setCurrentStep, ... } = useQuoteForm(...);
```

**Important:** When going back to Step 1, the previously entered values (name, phone, serviceType) should still be there. Since `useQuoteForm` state is local to the component and Step 1 didn't clear these values when transitioning to Step 2, they persist. The user goes back, sees their filled-in fields, corrects what they need, and taps Continue again.

**Step 1 re-submission concern:** Tapping Continue on Step 1 again would call the API with `flowStep: "step1"`. This creates a duplicate lead or updates the existing one depending on API behavior. The API currently does an INSERT, not an UPSERT. Going back and re-submitting Step 1 would create a second lead record.

**Fix for duplicate:** When going back from Step 2 to Step 1, the form already has a `leadId` from the first Step 1 submission. Modify the Step 1 submission path to send an UPDATE if `leadId` exists:

```tsx
// In useQuoteForm submitLead, Step 1 branch:
if (enableTwoStep && currentStep === 1) {
  // ... validation ...
  
  const stepOneResponse = await fetch("/api/quote-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      flowStep: leadId ? "step1_update" : "step1",  // NEW: distinguish initial vs. edit
      leadId: leadId || undefined,                    // NEW: pass existing ID if editing
      name,
      phone,
      serviceType,
      website,
    }),
  });
```

The API route would need a new `step1_update` flow that updates the existing lead instead of creating a new one. This is a small backend addition.

**Alternative (simpler):** Don't re-submit Step 1 when going back. Just let the user edit the fields locally. The edits are only saved when Step 2 submits (which could include the updated Step 1 fields). This requires sending all fields in Step 2:

```tsx
// Step 2 submission includes Step 1 fields for update:
body: JSON.stringify({
  flowStep: "step2",
  leadId,
  name,        // Include Step 1 fields
  phone,       // Include Step 1 fields
  serviceType, // Include Step 1 fields
  companyName,
  email,
  timeline,
  description,
  website,
}),
```

And the API's Step 2 handler updates ALL fields, not just the enrichment fields. This is the simpler fix — no new API flow, just send everything on Step 2.

### Recommended Placement

**Batch 3, as item 3.8.** It pairs with context threading (3.2) since wrong pre-selections are the primary trigger for needing to go back.

### Estimated Effort: 1-1.5 hours

---

## FINDING 3: Self-Asserted Star Rating Undermines Credibility

**Severity: Moderate — affects trust signal quality across the page**

The Authority Bar capsule displays "★★★★★" with no attribution source. Our improvement in 2.11 changes the text to "Rated 5 stars across 200+ completed projects" — but rated by whom? On what platform?

For the target audience (GCs and PMs who evaluate subcontractors), unattributed star ratings are meaningless. Every business gives themselves 5 stars. The credibility comes from the SOURCE of the rating:
- "★★★★★ on Google (47 reviews)" — verifiable, third-party
- "★★★★★ client satisfaction score (200+ projects)" — self-reported but specific methodology
- "★★★★★" with nothing else — marketing decoration

### Recommended Approach

**If A&A has Google Reviews:** Replace the star capsule with a linked Google Reviews badge:

```tsx
<a
  href="https://g.page/r/[A&A_GOOGLE_PLACE_ID]/review"
  target="_blank"
  rel="noopener noreferrer"
  className="surface-panel-soft inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 ..."
>
  <svg className="h-4 w-4" /* Google "G" icon */ />
  <span className="text-sm tracking-[0.22em] text-[#C9A94E]">★★★★★</span>
  <span className="font-light">
    4.9 on Google · {reviewCount} reviews
  </span>
</a>
```

This is verifiable, clickable, and builds trust through a known third-party platform. The link also encourages satisfied visitors to leave their own review.

**If A&A doesn't have enough Google Reviews:** Don't fake it. Replace the star capsule with a different trust signal that IS verifiable:

```tsx
<div className="surface-panel-soft inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 ...">
  <span className="text-sm font-semibold text-[#0A1628]">
    Zero callbacks on 200+ projects
  </span>
  <span className="font-light text-slate-500">—</span>
  <span className="font-light text-slate-500">
    independently verified by project closeout records
  </span>
</div>
```

"Zero callbacks" is a specific, operational claim that a GC can verify through their own experience working with A&A. It's more credible than unattributed stars.

**Third option: Embed actual Google Reviews widget.** Several lightweight libraries render Google Reviews with attribution. This replaces the static capsule with live, verified data. But it adds a third-party dependency and potential performance cost.

### Recommendation

This is a business decision: check A&A's actual Google Reviews status. If they have ≥20 reviews with ≥4.5 stars, use the linked badge approach. If not, use the "zero callbacks" operational claim. Either way, remove the unattributed generic stars — they're credibility neutral at best, credibility negative for a sophisticated B2B audience.

### Placement: Add to Batch 2 as item 2.11b (amendment to the star rating text change)

---

## FINDING 4: Bilingual Promise Exceeds Digital Delivery

**Severity: Moderate — trust gap between hero messaging and actual user experience**

Three places on the page reference Spanish language capability:
1. Hero trust pill: "Habla Español"
2. AI Assistant: EN/ES toggle with full bilingual support
3. Quote form: nowhere — English only

A Spanish-speaking user who sees "Habla Español" in the hero, taps "Get a Free Quote," and encounters an English-only form with English-only labels, English-only placeholder text, and an English-only success page experiences a trust breach. The promise was bilingual service. The delivery is English with a footnote.

The AI assistant handles Spanish well — but the assistant is a secondary conversion path (triggered by a small blue circle). The primary path (quote form) doesn't.

### Recommended Approach (Two Tiers)

**Tier 1 (Low effort — labels only):**

Add Spanish translations for form labels and the success message. Detect language preference from the AI assistant's locale state or from `navigator.language`:

```tsx
// In FloatingQuotePanel, add locale awareness:
const isSpanish = navigator.language.startsWith("es");

// Use translated labels:
<label>{isSpanish ? "Nombre" : "Name"}</label>
<label>{isSpanish ? "Teléfono" : "Phone"}</label>
<label>{isSpanish ? "Tipo de servicio" : "Service Type"}</label>
<button>{isSpanish ? "Continuar" : "Continue"}</button>
```

This is a rough approach — proper i18n would use a translation file. But for three form fields and a button, inline conditionals are practical.

The confirmation SMS already goes out in English. The customer acknowledgment email is English. These would also need Spanish variants if the lead was captured in Spanish. The API route would need to accept a `locale` field and branch notification templates.

**Tier 2 (Medium effort — full bilingual form flow):**

Create a `locale` context that's shared between the AI assistant and the quote form. When a user interacts with the AI in Spanish, the quote form automatically renders in Spanish. The success page, SMS, and email all respect the locale.

This is a proper i18n implementation that affects: FloatingQuotePanel, useQuoteForm, quote-request API route, /quote/success page, and notification templates.

### What to Do Now

For the current project scope, neither tier is in the critical path. But add a visible note:

**In the quote form (both Step 1 and Step 2), add a small line below the form:**

```tsx
<p className="mt-3 text-center text-xs text-slate-400">
  ¿Prefiere español? Llámenos: <a href="tel:+15125550199" className="underline">(512) 555-0199</a>
</p>
```

This acknowledges Spanish speakers, directs them to the phone (where a bilingual team member can help), and bridges the gap between the "Habla Español" promise and the English-only form. It's a one-line addition that respects the promise without requiring full i18n.

### Placement: Batch 5, or add the phone line to Batch 2 as a quick win alongside 1.2 (panel title fix)

---

## FINDING 5: No Conversion Tracking for Paid Advertising Channels

**Severity: High for business impact — invisible in the codebase but critical for ROI measurement**

The entire analytics system uses a custom `trackConversionEvent` function that feeds into a proprietary analytics pipeline. This works for measuring on-site behavior. But if A&A runs Google Ads, Facebook Ads, or any paid acquisition channel, those platforms need their own conversion signals.

The `/quote/success` page is the natural conversion endpoint. Currently it contains:
- A thank-you message
- A 4-step process explanation
- "While you wait" CTAs
- A link back to homepage

It does NOT contain:
- A Google Ads conversion tag (`gtag('event', 'conversion', {...})`)
- A Facebook/Meta pixel event (`fbq('track', 'Lead')`)
- A Google Analytics 4 event (`gtag('event', 'generate_lead')`)
- Any third-party conversion pixel

### Why This Matters

If A&A spends $500/month on Google Ads for "post construction cleaning austin" and can't measure which clicks convert to leads, they're flying blind on ad spend. The cost-per-lead is unknowable. Campaign optimization is impossible. They might be spending on keywords that never convert and underspending on keywords that do.

### Recommended Approach

**On the `/quote/success` page, add a conversion tracking component:**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export function ConversionTracking() {
  const hasFired = useRef(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    const name = searchParams.get("name") || "Unknown";

    // Google Ads conversion (if gtag is loaded)
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "conversion", {
        send_to: "AW-XXXXXXXXXX/XXXXXXXXXXXXX", // Replace with actual conversion ID
        value: 1.0,
        currency: "USD",
      });
    }

    // Google Analytics 4 (if gtag is loaded)
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "generate_lead", {
        event_category: "quote_form",
        event_label: "step2_completed",
      });
    }

    // Facebook/Meta Pixel (if fbq is loaded)
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead");
    }
  }, [searchParams]);

  return null; // No visual output
}
```

Render this component on the success page:

```tsx
// In /quote/success/page.tsx:
<ConversionTracking />
```

**The third-party scripts (gtag, fbq) would be loaded in the root layout** only if A&A is running those ad platforms. This component is defensive — it checks for the existence of each function before calling, so it doesn't error if the scripts aren't loaded.

### Placement: Batch 6 investigation item, but flag for the business owner NOW

The business owner should know: if they're running any paid ads, conversion tracking needs to be set up before the ads can be optimized. This is a revenue issue, not just a technical one. The engineering effort is small (30 minutes to add the component). The business configuration (getting conversion IDs from Google/Facebook) is the gating factor.

---

## FINDING 6: Mobile Keyboard Viewport Interaction With Panel

**Severity: Moderate — could undermine all form conversion improvements**

The FloatingQuotePanel is positioned `absolute right-0 top-0` within a fixed overlay. When a user taps on a form field (Name, Phone, or Service Type dropdown), the mobile keyboard appears. On iOS and Android, the keyboard behavior differs:

**iOS (Safari):** The `visualViewport` shrinks. The browser may scroll the page behind the panel to keep the focused input visible. But since the panel is `absolute` within a `fixed` overlay, the browser's scroll adjustment might not reach the panel's content. The input field could be hidden behind the keyboard.

**Android (Chrome):** The viewport resizes. The `fixed` overlay adjusts. The input is generally kept visible. But if the panel has `h-full` (which we're addressing in 3.7), the resized viewport means less visible panel area above the keyboard.

### The Specific Risk

After 3.7 (panel content-fit height), the panel is shorter. When the keyboard appears on a ~390px phone:
- Available viewport: ~390px (height) minus ~260px (keyboard) = ~130px visible above keyboard
- Panel header (title + step indicator): ~80px
- First visible field: ~50px

That's barely enough to see the active field. The submit button and trust line are completely below the keyboard. The user might not know the form is scrollable, or might not be able to see the "Continue" button without dismissing the keyboard first.

### Recommended Approach

**Add `scrollIntoView` on field focus:**

```tsx
// In FloatingQuotePanel, for each input field:
<input
  name="name"
  onFocus={(e) => {
    // Wait for keyboard to finish appearing
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  }}
  // ...existing props
/>
```

The 300ms delay gives the keyboard time to finish its entrance animation. `block: "center"` positions the focused input in the vertical center of the visible area (above the keyboard), giving the user context above and below the field.

**Also add `inputMode` attributes for better mobile keyboards:**

```tsx
<input name="name" inputMode="text" autoComplete="name" ... />
<input name="phone" inputMode="tel" autoComplete="tel" ... />
<input name="email" inputMode="email" autoComplete="email" ... />
```

`inputMode="tel"` shows the numeric phone pad on mobile, which is faster for phone entry. `autoComplete` hints help the browser pre-fill from saved data, reducing typing on mobile.

**Check if these are already present.** The code review didn't show the input rendering in detail (FloatingQuotePanel was partially cut off). If `inputMode` and `autoComplete` are missing, adding them is a high-ROI accessibility and UX improvement.

### The `enterKeyHint` Pattern

The AI assistant already uses `enterKeyHint="send"` on its textarea. The quote form should use:

```tsx
// Step 1 fields:
<input name="name" enterKeyHint="next" ... />      // "Next" on keyboard → focuses phone field
<input name="phone" enterKeyHint="next" ... />      // "Next" → focuses service type
<select name="serviceType" ... />                     // Dropdown doesn't use enterKeyHint
// Step 1 submit button: no enterKeyHint needed (it's a button, not an input)

// Step 2 fields:
<input name="companyName" enterKeyHint="next" ... />
<input name="email" enterKeyHint="next" ... />
<select name="timeline" ... />
<textarea name="description" enterKeyHint="send" ... />  // "Send" → submits form
```

`enterKeyHint="next"` shows a "Next" button on the mobile keyboard, telling the user there are more fields. `enterKeyHint="send"` on the last field shows "Send," telling the user they can submit directly from the keyboard. This is a small detail that significantly improves the mobile form feel.

### Placement: Add to Batch 3 as item 3.8 (alongside panel height fix 3.7, since both affect form usability)

### Estimated Effort: 45 minutes

---

## Summary of Addendum Items

| # | Finding | Severity | Placement | Effort |
|---|---|---|---|---|
| F1 | Panel stays open after Step 2 redirect (exposed by 1.1 fix) | **High** | **Add to Batch 1.1 — mandatory** | 20 min |
| F2 | No "Back to Step 1" on Step 2 | Moderate | Batch 3 as 3.8 | 1-1.5 hrs |
| F3 | Self-asserted star rating without attribution source | Moderate | Batch 2 as 2.11b (amendment) | 30 min (engineering) + business decision |
| F4 | Bilingual promise exceeds digital delivery | Moderate | Quick fix (phone line): Batch 2. Full i18n: Batch 5+ | 15 min (phone line) |
| F5 | No conversion tracking for paid ad channels | **High** (business impact) | Batch 6 investigation, flag for business owner immediately | 30 min (engineering) + business setup |
| F6 | Mobile keyboard viewport interaction with form | Moderate | Batch 3 alongside 3.7 | 45 min |

**Finding 1 is critical.** It must be bundled into Batch 1.1 or the auto-close removal creates a visible regression. The pathname-watching `useEffect` in FloatingQuotePanel is the simplest fix. This changes the Batch 1.1 effort from 15 minutes to 35 minutes.

**Finding 5 should be communicated to the business owner regardless of engineering timeline.** If they're spending money on ads without conversion tracking, every day that passes is wasted ad spend. The engineering work is trivial once the business provides their platform conversion IDs.

The remaining four findings (F2, F3, F4, F6) slot cleanly into existing batches and collectively improve form completion rate, trust signal quality, inclusivity, and mobile usability — all supporting the primary project goal of mobile conversion optimization.

---

## Current Status Update (2026-04-04)

This section is the current execution snapshot for homepage UX/UI and adjacent conversion architecture updates.

### Overall completion state

- Most high-impact homepage execution work is complete and validated in build/lint.
- Desktop and mobile experience are now materially improved, with core narrative/order, CTA hierarchy, and visual consistency largely stabilized.
- Remaining open items are primarily deferred design decisions, manual verification work, or broader security/performance validation tasks.

### Confirmed complete highlights

- Homepage structural reorder and major section improvements are implemented.
- Mobile quote flow resilience and retry behavior are implemented.
- Industry vertical template routing is implemented with separate pages per persona slug.
- Sitemap inclusion for industry pages is implemented.
- Build and lint checks are currently passing after the latest changes.

### Current status of previously open 6.x/7.x items

- 6.1: VERIFIED-FIXED
  - Client quote retry + backoff and server acknowledgment resilience/dead-letter escalation are in place.
- 6.3: PARTIAL
  - Step2 enrichment token + identifier-format validation is in place.
  - Broader API/RLS review remains open.
- 6.4: PARTIAL
  - Analyze baseline captured and reports generated.
  - Lighthouse/Web Vitals and manual hotspot triage remain open.
- 7.1: PARTIAL
  - Automated checks rerun.
  - Manual mobile/desktop interaction pass remains open.

### Remaining PARTIAL list (active)

1. 2.4
2. 2.14
3. 4.2
4. 5.3
5. 6.3
6. 6.4
7. 6.5
8. 6.6
9. 6.8
10. 6.9
11. 7.1

### Why these are still partial

- Deferred-by-choice items: 4.2, 5.3, 6.5.
- Manual/external verification required: 6.3, 6.4, 6.6, 6.8, 7.1.
- Lower-priority UX cleanup still pending: 2.4, 2.14.
- Runtime/dev compatibility cleanup pending: 6.6, 6.9.

### Near-term close plan

1. Run manual interaction QA pass and record evidence to close 7.1.
2. Run Lighthouse/Web Vitals pass and update performance notes for 6.4.
3. Complete broader API/RLS review pass to determine close criteria for 6.3.
4. Decide whether to execute or defer-finalize 2.4 and 2.14 in the current sprint.

### Current confidence

- Homepage (desktop + mobile): high confidence for current iteration quality.
- Conversion flow robustness: medium-high confidence (automated checks strong; manual pass still pending).
- Final launch readiness for this stream: contingent on completion of remaining manual/external checks above.

---

## Sales Optimization & High-Value Additions (Strategic Addendum)

This addendum captures high-leverage additions that can increase lead quality, close rate, operational consistency, and hiring throughput.

### Priority framing

- Tier 1: Revenue and close-rate impact in the next 30-60 days.
- Tier 2: Trust/authority growth and pipeline compounding in 60-120 days.
- Tier 3: Automation and integration scale-up once baseline workflows are stable.

### Tier 1 — Immediate Revenue and Sales Lift

| Item | What to add | Why it matters | Expected impact |
|---|---|---|---|
| Lead quality scoring | Auto-score leads by intent (timeline urgency, service type fit, project size signals, source quality) | Helps prioritize callbacks and quote effort where win probability is highest | Higher close rate and faster response on best opportunities |
| Quote follow-up playbooks | Standardized follow-up sequence by lead state: New, Contacted, Quoted, Stalled, At Risk | Reduces lead leakage from inconsistent follow-up behavior | More recovered deals and better pipeline hygiene |
| Call script + objection SOP in CRM | Add contextual scripts in lead detail view (GC, PM, Commercial persona versions) | Improves consistency and confidence during calls, especially for non-sales operators | Better conversion from call to walkthrough/quote acceptance |
| Win/loss reason taxonomy | Require structured reason when a lead is Won/Lost | Creates feedback loop for pricing, messaging, and service gaps | Faster optimization of offer and messaging |
| "Mom mode" operations guide | Single-screen workflow guide with daily checklist, escalation rules, and "what to do next" logic | Reduces operator friction and dependency on memory | Fewer missed tasks and smoother daily execution |

### Tier 2 — Compounding Growth and Trust Assets

| Item | What to add | Why it matters | Expected impact |
|---|---|---|---|
| Blog / Insights section | Publish practical articles tied to buyer intent (post-construction cleanup checklist, turnover readiness, bid-day prep) | Builds SEO footprint and pre-sells expertise before contact | More qualified organic traffic and better trust at first touch |
| Case study library | Structured before/after case pages with scope, timeline, challenges, outcomes | Stronger proof than generic testimonials | Improved conversion for higher-ticket buyers |
| Vertical landing pages expansion | Expand persona pages with role-specific pain map, proof blocks, and CTA pathways | Better message-market fit per segment | Higher conversion rate on niche traffic |
| Referral flywheel module | Post-job referral ask with trackable source, incentive logic, and performance dashboard | Leverages existing happy customers for low-CAC growth | Lower acquisition cost and stronger local network effects |
| Reputation system | Review request automation + monthly review velocity goals + source tracking (Google/other) | Reviews directly influence local conversion and ranking | Stronger social proof and local visibility |

### Tier 3 — Automation and Integrations at Scale

| Item | What to add | Why it matters | Expected impact |
|---|---|---|---|
| Unified attribution dashboard | Full source-to-revenue view (UTM, call source, form source, campaign, close outcome) | Tells which channels produce profitable customers | Smarter budget allocation and improved ROI |
| Call intelligence layer | Call recording/transcription + disposition capture + next-step automation | Turns calls into auditable sales process data | Better coaching and fewer missed follow-ups |
| SLA watchdog automations | Automatic alerts when response-time and quote-time SLAs are missed by threshold | Protects speed-to-lead advantage | Better lead experience and reduced drop-off |
| Pipeline forecasting | Weekly projection based on current stage counts and conversion probabilities | Gives forward visibility for staffing and ad spend | Better planning and fewer demand/supply mismatches |
| Capacity-aware lead throttling | Auto-adjust intake messaging or campaign pace when scheduling capacity is constrained | Prevents overselling and service quality degradation | Protects reputation and operational margin |

### Hiring Optimization Additions (Contractor vs Direct Hire)

| Item | What to add | Why it matters | Expected impact |
|---|---|---|---|
| Candidate classification path | Required applicant branch: Direct Hire, Contractor, Undecided | Creates operational clarity early | Faster routing and less admin ambiguity |
| Decision matrix scoring | Weighted scoring dimensions: reliability, availability, legal docs, quality standard fit, communication, equipment ownership | Objective comparison between candidate types | Better hiring consistency and lower bad-hire risk |
| Compliance checklist by type | Separate required documents and policy acknowledgments for contractor vs employee paths | Reduces legal/process errors | Safer onboarding and cleaner records |
| Role-fit assessment | Short practical scenario test and quality-photo review challenge | Screens for real-world execution quality | Better quality outcomes in field assignments |
| Trial-shift evaluation workflow | Structured trial assignment rubric with pass/fail thresholds and reviewer notes | Standardizes go/no-go decisions | Higher confidence before full onboarding |

### Recruiting Integrations (LinkedIn / Indeed / Glassdoor + Website Funnel)

| Integration | Recommended implementation | Justification |
|---|---|---|
| LinkedIn | Enable job posting sync + UTM-tagged apply links back to careers landing flow | Captures source performance and keeps application data centralized |
| Indeed | Feed jobs via ATS connector/API or scheduled export, route applications into hiring inbox with source metadata | High volume channel; critical for local applicant flow |
| Glassdoor | Employer brand optimization + review cadence + posting synchronization where available | Trust signal for quality candidates; improves apply intent |
| Website careers conversion pipeline | Unified application form + source tracking + stage automation + rejection/next-step templates | Prevents fragmented inboxes and lost candidates |
| Candidate CRM | Deduplicate applicants, auto-tag by source, and trigger nurture for promising candidates not yet hired | Builds reusable talent pipeline over time |

### "Guide for Mom" Enablement Pack (Operator Success)

Recommended deliverables:

1. Daily operations playbook
  - Morning, midday, end-of-day checklist with explicit systems screens.
2. Lead response SOP cards
  - Exact first-response templates and follow-up schedule by lead stage.
3. Hiring triage SOP
  - Contractor vs direct-hire decision tree and required documentation list.
4. Exception handling guide
  - What to do when no-show, low rating, delayed payment, or upset customer occurs.
5. Weekly review template
  - Pipeline health, SLA compliance, wins/losses, and hiring funnel metrics.

Why this is high value:
- It converts the platform from "tooling" into a repeatable operating system.
- It lowers dependence on one person remembering complex process details.
- It increases execution reliability as lead volume grows.

### Suggested rollout order

1. Lead quality scoring + follow-up playbooks + win/loss taxonomy.
2. Mom-mode guide and daily operational SOP pack.
3. Hiring decision matrix + compliance checklists + trial workflow.
4. Careers funnel instrumentation + LinkedIn/Indeed source capture.
5. Case study library + blog rollout + referral/reputation loop.

### Strategic justification

The highest-value next step is not only adding more features. It is tightening the full system loop:

- Generate better leads.
- Respond with consistency and speed.
- Close with a repeatable process.
- Deliver quality with enforceable field standards.
- Convert fulfillment outcomes into reputation and referral growth.

---

## Comprehensive Feature Recommendations Expansion (2026-04-04)

This section consolidates all additional feature opportunities surfaced in blueprint analysis and appends them to the active implementation source-of-truth.

### Priority legend

- P0 = near-term, highest business impact
- P1 = high-value expansion after P0 stabilizes
- P2 = scale and optimization layers

### P0 — Conversion and Sales Foundations

| Feature | Recommendation | Why it matters | Status guidance |
|---|---|---|---|
| Service-area detail depth | Complete city-level `/service-area/[slug]` pages with local proof, service nuances, and local CTAs | Improves geo trust and local organic conversion | Build now with content sign-off gate |
| Industry landing page depth | Expand `/industries/[slug]` with role-specific proof, pain maps, and CTA pathways | Improves message-match for paid and direct segment traffic | Continue current implementation track |
| Public pricing guidance + SLA blocks | Publish price ranges, response/quote SLAs, and pricing-factor explainers on service pages | Self-qualifies leads and reduces low-fit inquiries | Keep updating live modules with approved ranges |
| Service-specific objection modules | Add 3-6 objections and proof-backed answers per service route | Removes friction before quote submission | Extend current modules with loss-reason-informed objections |
| Unified CTA taxonomy + funnel instrumentation | Enforce one CTA naming/event schema across hero/footer/modal/mobile/industry surfaces | Enables clean CRO testing and source-level optimization | Continue normalization and dashboard reporting |
| Lead intake consistency hardening | Keep call/form/follow-up intake fields and statuses standardized | Prevents lead leakage from fragmented capture | Tighten field parity across all entry points |

### P0 — Revenue Ops Integrations

| Feature | Recommendation | Why it matters | Status guidance |
|---|---|---|---|
| Call tracking attribution | Add source-level call attribution and campaign mapping into reporting | Calls are core conversion channel; blind spots hurt spend efficiency | Keep as deferred re-entry after sustained paid call volume |
| CRM/pipeline sync discipline | Standardize source tags, stage timestamps, and follow-up statuses | Makes weekly KPI and SLA reporting trustworthy | Implement strict stage/data hygiene now |
| Review generation workflow | Trigger post-service review requests with optional reminders and dashboard counter | Review velocity directly affects local trust and close rates | Promote to first-class workflow priority |

### P1 — Conversion Lift and Buyer Confidence

| Feature | Recommendation | Why it matters | Status guidance |
|---|---|---|---|
| Proof library / case-study hub | Launch filterable before/after case studies by service, locality, and outcome | Stronger trust for larger contracts and higher-ticket buyers | Build `/portfolio` with reusable case templates |
| Dynamic offer blocks by persona | Serve GC/PM/commercial-tailored offers and value props | Increases relevance at decision point | Drive from persona mapping data modules |
| Campaign landing templates | Standardize paid landing templates for Google intent and retargeting traffic | Better message match and conversion consistency | Add template library with UTM-aware variants |
| Sales enablement collateral | Publish downloadable one-pagers/capability sheets for outreach and social selling | Supports off-site nurturing and account-level sales | Add collateral library and track assisted conversion impact |
| Recurring revenue conversion path | Add dedicated recurring-commercial route, calculator, and walkthrough CTA | Recurring contracts multiply LTV and stabilize revenue | Prioritize after core P0 conversion hardening |

### P1 — Operational Visibility and Control

| Feature | Recommendation | Why it matters | Status guidance |
|---|---|---|---|
| SLA performance dashboard | Show response/quote/follow-up SLA scoreboard with owner accountability | Converts daily execution into measurable discipline | Implement in admin insights/business area |
| Capacity throttle signal | Alert when scheduling nears capacity and trigger intake/campaign guardrails | Prevents overselling and service failures | Implement thresholds (warn/critical) with intake controls |
| Multi-touch lead nurture | Add 7/14/30/60-day nurture for contacted/non-converted leads | Recovers warm leads not captured by quote-only follow-up | Build sequence table and auto-stop rules |
| Quote follow-up automation | Run post-quote reminder cadence until accepted/lost | Reduces quote stagnation and manual dependency | Implement as P1 automation chain |

### P2 — Scale and Compounding Growth

| Feature | Recommendation | Why it matters | Status guidance |
|---|---|---|---|
| Content performance intelligence | Report which assets/case studies drive qualified leads and closes | Improves content budget efficiency | Add event-level content attribution layer |
| Referral experience layer | Add referral CTA flow, tracking links, and referral reporting | Builds lower-CAC growth engine | Implement after review and nurture systems stabilize |
| Multi-location scaling framework | Standardize expansion templates for new zones/services | Enables growth without re-architecture | Prepare reusable IA/content schema |
| Customer status page | Add tokenized job-status tracker for active customers | Reduces support calls and increases trust | Keep as P2 convenience/experience layer |
| GPS check-in + weather flags | Add field-verification and scheduling risk signals | Improves dispatch confidence and service reliability | P2 after core assignment data maturity |

### Austin Market and Channel Additions

1. Add explicit channel strategy tracks for Nextdoor, Yelp, optional marketplace channels, and partnership outreach.
2. Build recurring weekly outbound relationship routine for property managers and realtor offices.
3. Treat first-channel spend as data-acquisition phase; tie budget tiers to risk framing and capacity.
4. Expand micro-local neighborhood content and local proof collection as a durable moat.

### Operator Simplification (Guide for Mom) — Required Deliverables

1. Daily routine (15-20 min): morning briefing, red-priority handling, schedule check, quality review, overdue payment glance.
2. End-of-day check (5 min): uncontacted leads, tomorrow dispatch sanity check, employee messages.
3. Weekly review (60-90 min): KPI snapshot, SLA performance, lost-lead analysis, review velocity, ad check, schedule planning, content freshness.
4. Monthly review (90 min): revenue vs forecast, ROI by channel, recurring share, crew performance, market/competitor check, budget reallocation.
5. Exception SOP cards: no-show, low rating, delayed payment, upset customer, escalation path.

### Hiring and Recruiting Differentiation Additions

| Feature | Recommendation | Why it matters |
|---|---|---|
| Candidate classification path | Require branch: Direct Hire / Contractor / Undecided at application start | Creates immediate routing clarity |
| Decision matrix scoring | Score reliability, availability, legal readiness, quality fit, communication, equipment ownership | Improves consistency and reduces bad hires |
| Compliance checklist by type | Maintain separate required docs and acknowledgments by worker type | Reduces legal/process risk |
| Trial-shift evaluation workflow | Standard pass/fail rubric with reviewer evidence notes | Improves onboarding quality control |
| Source-integrated recruiting | Sync/track LinkedIn, Indeed, Glassdoor sources into one hiring inbox | Prevents candidate leakage and enables source ROI review |

### Revenue Forecasting and KPI Operating Layer

Recommended operating model:

1. Maintain a simple forecast formula in admin reporting: Leads x Lead-to-Quote x Quote-to-Close x Avg Job Value.
2. Split KPI expectations by source quality (referral/organic vs paid cold) to avoid blended distortion.
3. Track recurring metrics explicitly: retention, one-time to recurring conversion, recurring revenue share, recurring lifespan.
4. Keep forecast tracker updated weekly to support staffing, dispatch, and spend planning.

### Feature Recommendation Merge Rule (with existing strategic addendum)

To keep this document coherent, use this merge policy:

1. Keep the original "Sales Optimization & High-Value Additions" section as strategic context.
2. Treat this expansion section as the tactical master backlog source.
3. When a feature appears in both sections, preserve one canonical row in implementation tracking and reference both strategic/tactical rationale.
4. Update status tags here first (`NOT-STARTED`, `PARTIAL`, `VERIFIED-FIXED`, `DEFERRED`) before cascading into sprint checklists.

### Recommended Execution Sequence (Consolidated)

1. P0 conversion + intake + instrumentation + review workflow.
2. P1 proof/campaign templates + SLA/capacity visibility + follow-up/nurture automations.
3. Operator enablement pack and hiring differentiation workflows.
4. P2 referral/content intelligence/multi-location scaling and advanced field telemetry.

This sequence preserves the same strategic direction as the existing recommendation section while incorporating all newly sourced feature additions into one end-of-document implementation roadmap.

That loop compounds business value more than isolated feature additions.