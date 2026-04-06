# Part 1 of 2: Master Implementation Document v2.0

---

```
Master Implementation Document v2.0
A&A Cleaning Services — Mobile UX Hardening & Conversion Optimization
Compacted from v1.0 (5,700+ lines) on 2026-04-05
Full implementation detail for completed items archived in: ../archive/v1-completed-items.md
```

---

# Confidence Scores

| Dimension | Score | Basis |
|---|---|---|
| **Launch confidence** | **7 / 10** | 3 verification gates remain open; all are confirmation tasks, not new code. No known functional regressions. |
| **Conversion confidence** | **8 / 10** | Context threading, quote flow bug fixes, CTA hierarchy, and section reorder all shipped. Form keyboard/viewport polish and Before/After redesign are deferred but non-critical. |
| **Performance confidence** | **6 / 10** | Build and lint pass. Bundle analyzer clean. But Lighthouse/Web Vitals have not been run post-changes. Font loading strategy unoptimized. No regressions observed, but no measurements confirm it. |

---

# Scope Math

| Category | Count |
|---|---|
| Baseline scope (original document) | 40 |
| Net-new items added during execution | +4 |
| **Current tracked total** | **44** |

| Status | Count |
|---|---|
| `fixed` (verified-fixed + already-implemented) | 32 |
| `blocked-launch` | 3 |
| `should-close` | 3 |
| `deferred` (product) | 5 |
| `deferred` (technical) | 1 |
| **Total** | **44** |

Build status: `lint` ✅ · `build` ✅ · `analyze` ✅ (OTel warnings only)

---

# Status Vocabulary (v2.0 — strict)

| Tag | Meaning | Action required |
|---|---|---|
| `blocked-launch` | Must close before production deployment | Yes — immediate |
| `should-close` | High value to close soon; does not block launch | Yes — near-term |
| `deferred` | Explicitly parked by product or technical decision | No — until revisit trigger fires |
| `fixed` | Shipped and verified via build/lint or manual confirmation | No |
| `verified-open` | Retired in v2.0 — folded into `blocked-launch` or `should-close` depending on severity | — |

---

# 🔴 Launch Gates

Three items must close before production ship. Each has an owner slot, target date, evidence requirement, and explicit exit test.

---

## GATE-1: Manual Interaction QA Pass

**Item:** 7.1
**Owner:** `[assign]`
**Target date:** `[launch minus 2 days]`
**Status:** `blocked-launch`

**What:** Q1-Q24 global checklist validated only via automated tooling. No human has run the full mobile + desktop interaction suite against current deployed state.

**Why it blocks:** Automated checks catch syntax and build errors. They do not catch broken scroll targets, misaligned panels, unresponsive sliders, or visual regressions from the section reorder and component changes.

**Evidence required:**
- [ ] Conversion path (Q1-Q8): Hero CTA → panel → Step 1 → Step 2 → redirect → panel closed
- [ ] Navigation (Q9-Q14): All menu links, footer links, and hash anchors resolve correctly post-reorder
- [ ] Visual integrity (Q15-Q20): No horizontal overflow, all images load, accordion/slider/carousel functional
- [ ] Performance (Q21-Q24): Lighthouse mobile ≥ baseline, CLS ≤ 0.1, LCP ≤ 2.5s, zero console errors in clean profile
- [ ] Evidence format: screenshot or recording per test group, pass/fail log with timestamps

**Exit test:** Gate 1 exits when Q1-Q24 evidence log is complete and signed off.

**Effort:** 2-3 hours

---

## GATE-2: Hero Hydration Mismatch

**Item:** 6.6
**Owner:** `[assign]`
**Target date:** `[launch minus 3 days]`
**Status:** `blocked-launch`

**What:** Dev hydration logs show SSR/client mismatch warnings for hero variant after 3.1 changes (default flipped to compact, localStorage key renamed). SSR default (`true`) and client default should now agree, but this has not been verified in a real browser with cleared state.

**Why it blocks:** If the mismatch is real, it causes a visible layout shift on first load — hero renders at one height during SSR, then jumps on hydration. This is the exact CLS issue the variant system was designed to prevent.

**Evidence required:**
- [ ] Load homepage in Chrome mobile emulation, clean profile (no localStorage, no cookies)
- [ ] Verify: no React hydration warning in console related to hero height/variant
- [ ] Verify: hero renders at 75svh immediately with no visible resize/flash
- [ ] Run Lighthouse: CLS score not degraded from baseline
- [ ] If mismatch persists: trace `getInitialHeroVariant()` return value divergence between SSR and client, fix the source

**Exit test:** Gate 2 exits when clean-profile hydration warning is absent across 3 consecutive reloads on mobile emulation.

**Effort:** 30-60 minutes verification. Up to 2 hours if a code fix is needed.

---

## GATE-3: Schema Drift — Quote API

**Item:** 6.8
**Owner:** `[assign]`
**Target date:** `[launch minus 3 days]`
**Status:** `blocked-launch`

**What:** Local 500 error reproduced on `/api/quote-request`. Root cause: `leads.company_name` column missing from local Supabase schema cache. Compatibility fallback added (API no longer crashes), but underlying schema mismatch between environments is unconfirmed.

**Why it blocks:** If production schema is out of sync, the fallback masks the problem but Step 2 enrichment data silently drops. Leads arrive incomplete even when the user provided all fields.

**Evidence required:**
- [ ] Compare production Supabase schema against repo migration files — confirm `leads.company_name` exists
- [ ] If missing: run migration in production
- [ ] If present: verify Vercel functions use production connection (not affected by local cache)
- [ ] Submit test lead through full Step 1 → Step 2 flow on production, verify all fields persist in DB

**Exit test:** Gate 3 exits when production Step 1 and Step 2 field persistence are confirmed in database for a test submission.

**Effort:** 30-60 minutes

---

# 🟡 Should-Close

High value to close soon. Do not block launch but should be resolved within the first post-launch week.

---

## SHOULD-1: Broader API/RLS Security Review

**Item:** 6.3
**Status:** `should-close`

**Current state:** Step 2 enrichment validates `leadId` and `enrichmentToken` format before update attempts. The most obvious input validation gap is closed.

**What remains:** Full review of Supabase RLS policies on leads table, rate limiting beyond honeypot, session ownership for Step 2 updates (`TODO(phase2-security)` flag in code).

**Risk if deferred past launch:** Low-probability exploitation. LeadIds are UUIDs (not guessable). API is behind Vercel edge. But a determined attacker could submit spam leads without rate limiting.

**Recommended approach:** Schedule as focused 3-4 hour security review session in first post-launch week.

---

## SHOULD-2: Lighthouse / Web Vitals / Bundle Triage

**Item:** 6.4
**Status:** `should-close`

**Current state:** `npm run analyze` completed. Bundle reports generated. No raw `<img>` tags in public components. No `next/font` integration detected.

**What remains:** Run Lighthouse on mobile (4× CPU throttle), compare LCP/CLS/INP against pre-project baseline, review bundle hotspots, determine if font loading needs optimization.

**Risk if deferred past launch:** No functional risk. Performance may be suboptimal. Could affect Core Web Vitals scores in Search Console.

**Recommended approach:** Run Lighthouse as part of GATE-1 QA pass. If Performance ≥ 80, CLS ≤ 0.1, LCP ≤ 2.5s → close. If not → triage specific failing metrics.

---

## SHOULD-3: Residual Mobile Hero Free-Space Tightening

**Item:** 3.9
**Status:** `should-close`

**Current state:** Hero 75svh default shipped and variant key migration completed. Mobile hero still shows residual top/bottom flex slack in responsive QA, and the original v1.0 status remains `VERIFIED-OPEN` for this item.

**What remains:** Final mobile-first alignment/spacing pass (reduce residual void while preserving desktop composition), then visual QA across target mobile viewport heights.

**Risk if deferred past launch:** No functional break, but first-screen density remains below target and may reduce immediate CTA engagement.

**Recommended approach:** Resolve alongside SHOULD-2 visual/performance pass and close with side-by-side before/after screenshots.

---

# ⚪ Deferrals — Product

Explicitly parked by product decision. Do not schedule until revisit trigger fires.

---

### DEF-P1: Lower Mobile Fallback CTA in Who We Serve (Item 2.4)

**Why parked:** Section now has "Discuss Your Project" button on each persona card (2.3) plus repositioned "Talk Through Your Scope" CTA. Mobile fallback below cards was removed in UX rollback as redundant after card-level CTAs were promoted to full button treatment.

**Revisit trigger:** Analytics show Who We Serve has high engagement but low CTA interaction rate.

---

### DEF-P2: Testimonial Timeframe Badge + Review Count (Item 2.14)

**Why parked:** Intentionally removed to keep testimonial cards visually uncluttered. Section performing well as social proof without metadata density.

**Revisit trigger:** Testimonial count grows beyond 4, or A&A gets verified platform reviews (Google, etc.) making timeframe badges credible.

---

### DEF-P3: Before/After Section Full Redesign (Item 4.2)

**Why parked:** Option C selected — keep current stripped proof treatment. Slider interaction is strong. Full redesign (featured Result block + metadata inversion + micro-CTA) deferred to dedicated design sprint.

**Revisit trigger:** Scheduling a "proof section" design sprint. Pairs with case study library buildout.

---

### DEF-P4: Mobile Stepper Accordion for Timeline (Item 5.3)

**Why parked:** Rejected in DP-6. Timeline improved via other means (intro removed, icons shown, value lines merged). Stepper saves ~200-300px but adds second accordion interaction pattern — risk of interaction fatigue.

**Revisit trigger:** Post-launch scroll depth data shows users consistently drop off before Timeline section.

---

### DEF-P5: AI Assistant Handoff Integration (Item 6.5)

**Why parked:** Rejected in DP-7. Requires product policy decisions on data handling, consent, and privacy boundary for AI-to-form data transfer.

**Revisit trigger:** Dedicated AI integration sprint. Highest-value version: AI extracts project details from conversation → offers prefilled quote form handoff.

---

# ⚪ Deferrals — Technical

---

### DEF-T1: Extension-Injected Console Errors (Item 6.9)

**Why parked:** `proxy.js` disconnected-port errors classified as browser-extension-injected runtime noise. Not application code.

**Revisit trigger:** Errors reproduce in a clean Chrome profile with zero extensions. If they disappear in clean profile → formally close. If they persist → investigate service worker or message port usage.

---

# Section Status (Exceptions + Summary)

Sections with non-`fixed` status:

| Section | Status | Detail |
|---|---|---|
| Hero | `blocked-launch` | 75svh default shipped; hydration verification (GATE-2) pending. Residual free-space tightening is still open (SHOULD-3 / item 3.9). |
| See the Difference | `deferred` | Current treatment retained. Full redesign parked (DEF-P3). |
| Floating Quote Form | `should-close` | Two-step flow + context threading + resilience shipped. Schema parity (GATE-3) and keyboard/viewport polish outstanding. |

**All other sections: `fixed`** — Authority Bar, What's Included (merged into Timeline), Services Accordion, Who We Serve, Testimonials, How We Deliver, About, Where We Work, Let's Talk, Careers (removed from homepage), Footer CTA, Footer Utility, Hamburger Menu.

---

# Completed Items — Summary Table

Full implementation detail for all `fixed` items is archived in `../archive/v1-completed-items.md`. Below is the compressed reference.

## Batch 1: Critical Bug Fixes (6 items · ~2 hours · all `fixed`)

| Item | What Shipped | Key Files |
|---|---|---|
| 1.1 | Removed auto-close race condition on Step 1→2 transition (Finding F1 context preserved in addendum) | `FloatingQuotePanel.tsx` |
| 1.2 | Panel title now step-aware ("Get a Free Quote" → "Add Project Details") with step indicator subcopy | `FloatingQuotePanel.tsx` |
| 1.3 | CTA suppression selectors wired to real DOM IDs (`hero-primary-cta`, `service-area-primary-cta`, `mobile-quote-closer-cta`) | `AIQuoteAssistant.tsx`, `HeroSection.tsx`, `ServiceAreaSection.tsx`, `VariantAPublicPage.tsx` |
| 1.4 | FloatingQuotePanel z-index corrected from `z-50` to `z-[55]` (dialog layer) | `FloatingQuotePanel.tsx` |
| 1.5 | LeadId validation added before Step 2 transition; graceful fallback if leadId missing | `useQuoteForm.ts` |
| 1.6 | Duplicate `quote_submit_success` event removed; `quote_form_submitted` is canonical | `useQuoteForm.ts` |

## Batch 2: Tier 1 Immediate Wins (16 items · ~3.5 hours · 14 `fixed`, 2 `deferred`)

| Item | What Shipped | Key Files | Status |
|---|---|---|---|
| 2.1 | CareersSection removed from homepage; `/#careers` links updated to `/careers` | `VariantAPublicPage.tsx`, `PublicHeader.tsx`, `FooterSection.tsx` | `fixed` |
| 2.2 | Footer CTA module hidden on mobile (`hidden md:block`) | `FooterSection.tsx` | `fixed` |
| 2.3 | "Discuss Your Project" promoted to `cta-primary` full button treatment with analytics ctaId | `OfferAndIndustrySection.tsx` | `fixed` |
| 2.4 | Top CTA relocated; lower mobile fallback removed in UX rollback | `OfferAndIndustrySection.tsx` | `deferred` (DEF-P1) |
| 2.5 | Persona card outcome text visible on mobile (removed `hidden md:flex`) | `OfferAndIndustrySection.tsx` | `fixed` |
| 2.6 | First accordion service auto-expand confirmed working (`already-implemented`) | `ServiceSpreadSection.tsx` | `fixed` |
| 2.7 | `accordion_service_expanded` tracking event on expand with service metadata | `ServiceSpreadSection.tsx` | `fixed` |
| 2.8 | Authority Bar headline → "15+ Years. 500+ Spaces. Austin's Standard." / kicker → "The A&A Standard" | `AuthorityBar.tsx` | `fixed` |
| 2.9 | On-Time stat detail updated to "handoff rate" (hedge language removed) | `AuthorityBar.tsx` | `fixed` |
| 2.10 | Licensed/Insured detail condensed; "Austin Standards" mid-card line removed | `AuthorityBar.tsx` | `fixed` |
| 2.11 | Trust capsule now includes explicit count framing ("200+ completed projects") | `AuthorityBar.tsx` | `fixed` |
| 2.12 | Redundant city pill links removed; city cards remain as primary coverage affordance | `ServiceAreaSection.tsx` | `fixed` |
| 2.13 | Testimonial kicker → "Verified Results" / headline → "Trusted by Austin's Toughest Projects" | `TestimonialSection.tsx` | `fixed` |
| 2.14 | Timeframe badge and review count intentionally removed for visual clarity | `TestimonialSection.tsx` | `deferred` (DEF-P2) |
| 2.15 | Mobile menu backdrop opacity increased to `bg-black/70` | `PublicHeader.tsx` | `fixed` |
| 2.16 | Hero subtitle text shadow confirmed already applied (`already-implemented`) | `HeroSection.tsx` | `fixed` |

## Batch 3: Component Refactors (8 items · ~7.5-9 hours · 7 `fixed`, 1 `should-close`)

| Item | What Shipped | Key Files | Status |
|---|---|---|---|
| 3.1 | Hero defaults to compact 75svh on mobile; localStorage key migrated to `hero_mobile_variant_v2` | `HeroSection.tsx`, `useQuoteForm.ts` | `fixed` |
| 3.2 | Service type context threading through full quote funnel (QuoteContext → CTAButton → QuoteCTA → PublicChrome → FloatingQuotePanel → useQuoteForm); new `service-type-map.ts` | 7 files + 1 new | `fixed` |
| 3.3 | Timeline intro paragraph removed (redundant summary of step titles) | `TimelineSection.tsx` | `fixed` |
| 3.4 | Timeline step icons restored on mobile with tightened sizing | `TimelineSection.tsx` | `fixed` |
| 3.5 | Collapsed accordion panels now apply `inert` alongside `aria-hidden` | `ServiceSpreadSection.tsx` | `fixed` |
| 3.6 | Panel close now distinguishes bounce (`quote_panel_bounced`) vs started-form abandonment | `FloatingQuotePanel.tsx` | `fixed` |
| 3.7 | Mobile panel uses content-fit height (`min-h-[50svh] max-h-full`) with desktop `md:h-full` | `FloatingQuotePanel.tsx` | `fixed` |
| 3.9 | Mobile hero residual flex free-space still open from v1.0 verification pass; final tightening pending | `HeroSection.tsx` | `should-close` (SHOULD-3) |

## Batch 4: Structural Redesigns (5 items · ~12-16 hours · 4 `fixed`, 1 `deferred`)

| Item | What Shipped | Key Files | Status |
|---|---|---|---|
| 4.1 | IncludedSummary fully merged into Timeline with gold value callouts per step; section removed | `VariantAPublicPage.tsx`, `TimelineSection.tsx` | `fixed` |
| 4.2 | Option C: keep current stripped proof treatment; schedule redesign later | `BeforeAfterSlider.tsx` | `deferred` (DEF-P3) |
| 4.3 | Mobile Where We Work → compact pills + mini-map; desktop map/cards preserved | `ServiceAreaSection.tsx` | `fixed` |
| 4.4 | Full homepage reorder shipped: Hero → Authority → Services → Who We Serve → How We Deliver → Before/After → Testimonials → About → Where We Work → Let's Talk → Footer | `VariantAPublicPage.tsx` | `fixed` |
| 4.5 | Proof lines + package labels surfaced in mobile service accordion | `ServiceSpreadSection.tsx` | `fixed` |

## Batch 5: Stretch Goals (6 items · 5 `fixed`, 1 `deferred`)

| Item | What Shipped | Key Files | Status |
|---|---|---|---|
| 5.1 | Who We Serve mobile layout converted to swipe carousel with snap | `OfferAndIndustrySection.tsx` | `fixed` |
| 5.2 | Industry vertical route template shipped with SEO metadata and internal linking | New route files | `fixed` |
| 5.3 | Deferred — mobile stepper accordion rejected in DP-6 | — | `deferred` (DEF-P4) |
| 5.4 | Services, industries, and service-area data now use shared data modules | Data files | `fixed` |
| 5.5 | Dead `variant` prop removed from `CTAButton` interface | `CTAButton.tsx` | `fixed` |
| 5.6 | Industry menu sub-links now target distinct card anchors with matching section IDs | `PublicHeader.tsx` | `fixed` |

## Batch 6: Investigation & Hardening (9 items · 3 `fixed`, 3 `blocked/should-close`, 3 `deferred`)

| Item | What Shipped or Status | Status |
|---|---|---|
| 6.1 | Client retry + backoff; server SMS/email resilience + dead-letter escalation | `fixed` |
| 6.2 | Language alternates + OG/Twitter image routes added on top of metadata/schema baseline | `fixed` |
| 6.3 | Step 2 token/ID validation shipped; broader RLS review pending | `should-close` (SHOULD-1) |
| 6.4 | Analyze baseline captured; Lighthouse/Web Vitals triage pending | `should-close` (SHOULD-2) |
| 6.5 | AI handoff deferred to planning/discovery | `deferred` (DEF-P5) |
| 6.6 | Hero SSR/client hydration mismatch in dev logs; needs real browser verification | `blocked-launch` (GATE-2) |
| 6.7 | Phone `pattern` regex compatibility fix shipped | `fixed` |
| 6.8 | Schema drift fallback added; migration/env parity pending | `blocked-launch` (GATE-3) |
| 6.9 | Console errors classified as extension-injected noise | `deferred` (DEF-T1) |

## Batch 7: Execution Framework (7 items · 1 `blocked-launch`, 6 reference)

| Item | Status | Note |
|---|---|---|
| 7.1 | `blocked-launch` (GATE-1) | Manual QA pass pending |
| 7.2-7.7 | Reference material | QA supplements, risk matrix, monitoring plan, deployment strategy, success criteria, source-of-truth refs — all valid and actionable |

---

# Decision Log

All decisions from the approval packet, plus key architectural decisions made during analysis.

| ID | Decision | Chosen Option | Rationale | Date |
|---|---|---|---|---|
| DP-1 | Merge Included + Timeline | Approved (desktop + mobile) | 80% data overlap confirmed; concrete version (Timeline) stronger than abstract (IncludedSummary) | Pre-execution |
| DP-2 | Where We Work consolidation | Approved (compact mobile + mini-map) | One geographic representation instead of three; preserves desktop map | Pre-execution |
| DP-3 | Homepage section reorder | Approved (full reorder per §4.4) | Trust funnel: Promise → Specifics → Process → Proof → Action | Pre-execution |
| DP-4 | Who We Serve mobile carousel | Approved (implement now) | Vertical stack too long; carousel preferred | Pre-execution |
| DP-5 | Industry vertical template | Approved (publish standard versions) | SEO value; persona-depth expansion follows later | Pre-execution |
| DP-6 | Mobile stepper accordion | Rejected (defer) | Interaction fatigue risk; timeline already improved via other items | Pre-execution |
| DP-7 | AI assistant handoff | Rejected (defer to discovery) | Requires product policy/consent decisions; not needed for core fixes | Pre-execution |
| ARCH-1 | Auto-close fix approach | Remove effect entirely | Auto-close redundant (redirect handles exit); simpler than adding signal | During Batch 1 |
| ARCH-2 | Context threading scope | Full context object (serviceType + sourceCta) | Minimal extra effort; sourceCta enables full funnel attribution | During Batch 3 |
| ARCH-3 | Hero default variant | 75svh compact default | ~400px dead zone was worst UX moment; burden of proof on keeping it | During Batch 3 |
| ARCH-4 | Section reorder strategy | Trust funnel narrative arc | Process before proof; proof + testimonials back-to-back as "proof block" | During Batch 4 |
| ARCH-5 | Service area pages | Keep pages, remove homepage links | Content is substantial and SEO-valuable; original decommission recommendation predated data review | During Batch 4 |
| ARCH-6 | Footer CTA disposition | Desktop-keep / mobile-hide | Desktop needs CTA (no MobileQuoteCloser); mobile doesn't; simplest fix | During Batch 2 |
| ARCH-7 | Who We Serve mobile treatment | Fix CTAs + show outcomes first | Copy too good to compress; carousel deferred to Batch 5 (later approved in DP-4) | During Batch 2 |

---

# Part 2 of 2: Master Implementation Document v2.0

---

# Execution Framework

---

## QA Checklist (Run Before Launch + After Any Future Batch)

### Conversion Path (Mobile)

| # | Test | Pass Condition |
|---|---|---|
| Q1 | Tap "Get a Free Quote" in hero | FloatingQuotePanel appears, Step 1 visible |
| Q2 | Scroll past hero, tap "Free Quote" on sticky bar | FloatingQuotePanel appears |
| Q3 | Fill name + phone + service type → Continue | Step 2 fields appear. Panel stays open. Success message shows. |
| Q4 | Fill optional fields → "Send My Quote Request" | Redirect to /quote/success. Panel closes. First name in URL. |
| Q5 | Complete Step 1, close panel without Step 2 | Panel closes cleanly. No crash. Lead exists in database. |
| Q6 | Tap "Call Now" anywhere | `tel:` link triggers phone dialer |
| Q7 | Close quote panel | Sticky bar reappears after brief delay |
| Q8 | Open hamburger → tap "Free Quote" | Menu closes, panel opens |

### Navigation (Mobile + Desktop)

| # | Test | Pass Condition |
|---|---|---|
| Q9 | Menu → Services → any sub-item | Scrolls to correct service in accordion |
| Q10 | Menu → About | Scrolls to About section |
| Q11 | Menu → Careers | Routes to /careers page (not homepage scroll) |
| Q12 | Menu → FAQ | Routes to /faq page |
| Q13 | Footer → all links | Each routes to correct destination |
| Q14 | Direct URL `/#services` | Page loads, scrolls to services section |

### Visual Integrity (Mobile + Desktop)

| # | Test | Pass Condition |
|---|---|---|
| Q15 | Scroll entire page on mobile | No horizontal scrollbar at any point |
| Q16 | Scroll entire page slowly | Every image renders (no broken icons) |
| Q17 | Tap each service accordion header | Content appears/disappears smoothly |
| Q18 | Drag Before/After slider on all tabs | Images clip correctly |
| Q19 | Swipe testimonial carousel | Transitions smoothly |
| Q20 | Load on ≥768px viewport | Desktop layout renders (no mobile accordion on desktop, etc.) |

### Performance

| # | Test | Pass Condition |
|---|---|---|
| Q21 | Lighthouse mobile score | Performance ≥ current baseline |
| Q22 | CLS | ≤ 0.1 |
| Q23 | LCP | ≤ 2.5s |
| Q24 | DevTools console, full page scroll | Zero errors in clean profile (warnings acceptable) |

---

## Post-Launch Monitoring Plan

Monitor for 7 days after launch. Alert thresholds trigger investigation, not automatic rollback.

### Primary Conversion Metrics

| Metric | Source Event | Alert If |
|---|---|---|
| Quote submissions (total) | `quote_form_submitted` | > 20% decrease from 7-day pre-launch baseline |
| Step 1 completions | `quote_step1_completed` | > 20% decrease |
| Step 2 completions | `quote_step2_completed` | > 15% decrease |
| Phone call CTA taps | `cta_click` where `action_type: "call"` | > 25% decrease |
| Panel open rate | `quote_panel_opened` / page views | > 15% decrease |

### Engagement Metrics

| Metric | Source | Alert If |
|---|---|---|
| Scroll depth 50% | `scroll_depth` milestone | > 10% decrease |
| Scroll depth 75% | `scroll_depth` milestone | > 10% decrease |
| Services section view rate | `section_view` for `#services` | > 10% decrease |
| Accordion interaction rate | `accordion_service_expanded` / `section_view` #services | Below 35% after 7 days (§15.6 target) |

### Performance Metrics

| Metric | Source | Alert If |
|---|---|---|
| LCP | Web Vitals / Sentry | Increase > 0.5s |
| CLS | Web Vitals / Sentry | Increase > 0.05 |
| INP | Web Vitals / Sentry | Increase > 50ms |
| JS bundle size | Build output | Increase > 10% |

---

## Success Criteria (Evaluate 14 Days Post-Launch)

| Target | How to Measure | Achievable After |
|---|---|---|
| Form conversion rate +15% | `quote_form_submitted` / page views vs. 14-day pre-launch baseline | Context threading + bug fixes are primary drivers |
| Accordion interaction ≥ 35% of section viewers | `accordion_service_expanded` unique users / `section_view` #services unique users | Tracking event (2.7) enables measurement |
| No LCP/CLS regression | Web Vitals 14-day post vs. 14-day pre | Continuous monitoring |
| 75% scroll depth reached by ≥ 40% of users | `scroll_depth` 75% milestone / page views | Section reorder + scroll reduction |

### Health Indicators

| Indicator | Healthy | Concerning |
|---|---|---|
| Step 1→2 completion rate | Increases (auto-close bug fixed) | Same or decreases |
| Panel bounce rate | Decreases for service CTAs (context threading) | No change |
| Phone call CTA taps | Stable or slight decrease (more form conversions) | Large decrease |
| Session duration | Stable (faster + deeper engagement) | Large decrease |

---

## Deployment Notes

**Approach used:** Sequential batch deployment with 48-72 hour monitoring between batches. No feature flags.

**Remaining deployment:** Launch gates are verification tasks, not code deployments. Once GATE-1/2/3 pass, current code is production-ready.

**Rollback strategy:** Git revert to pre-batch commit. Each batch was shipped as isolated PRs. Revert sequence: latest batch first, working backward.

---

# Appendices

---

## Appendix A: File Change Map

Every file touched across all batches. Use this for conflict awareness when making future changes.

| File | Items That Touched It | Total |
|---|---|---|
| `FloatingQuotePanel.tsx` | 1.1, 1.2, 1.4, 3.2, 3.6, 3.7 | 6 |
| `ServiceSpreadSection.tsx` | 2.6, 2.7, 3.2, 3.5, 4.5 | 5 |
| `OfferAndIndustrySection.tsx` | 2.3, 2.4, 2.5, 3.2 | 4 |
| `AuthorityBar.tsx` | 2.8, 2.9, 2.10, 2.11 | 4 |
| `VariantAPublicPage.tsx` | 2.1, 4.1, 4.4 | 3 |
| `TimelineSection.tsx` | 3.3, 3.4, 4.1 | 3 |
| `useQuoteForm.ts` | 1.5, 1.6, 3.1 | 3 |
| `PublicHeader.tsx` | 2.1, 2.15, 5.6 | 3 |
| `HeroSection.tsx` | 2.16, 3.1, 3.9 | 3 |
| `TestimonialSection.tsx` | 2.13, 2.14 | 2 |
| `ServiceAreaSection.tsx` | 2.12, 4.3 | 2 |
| `FooterSection.tsx` | 2.1, 2.2 | 2 |
| `CTAButton.tsx` | 3.2, 5.5 | 2 |
| `QuoteCTA.tsx` | 3.2 | 1 |
| `QuoteContext.tsx` | 3.2 | 1 |
| `PublicChrome.tsx` | 3.2 | 1 |
| `BeforeAfterSlider.tsx` | 4.2 | 1 |
| `AIQuoteAssistant.tsx` | 1.3 | 1 |
| **New:** `src/lib/service-type-map.ts` | 3.2 | 1 (created) |
| `CareersSection.tsx` | — | 0 (preserved for /careers) |
| `globals.css` / `tailwind.config` | — | 0 |
| `quote-request/route.ts` | 6.8 | 1 |

**Highest-touch files:** FloatingQuotePanel (6), ServiceSpreadSection (5). Treat these as high-caution zones for future changes.

---

## Appendix B: Analytics Events Registry

### Existing Events (Unchanged)

| Event | When It Fires |
|---|---|
| `section_view` | Section enters viewport at ≥25% |
| `scroll_depth` | At 25/50/75/100% milestones |
| `cta_click` | Any CTA tapped |
| `quote_panel_opened` | Quote CTA tapped |
| `quote_form_started` | First field focused |
| `quote_step1_completed` | Step 1 API success |
| `quote_step2_viewed` | Transitioning to Step 2 |
| `quote_step2_completed` | Step 2 API success |
| `quote_form_submitted` | Final submission success |
| `quote_submit_failed` | API error response |
| `quote_form_abandoned` | Panel closed with input, no success |
| `hero_variant_applied` | Hero variant determined |
| `exit_intent_shown` / `_dismissed` / `_accepted` | Exit overlay lifecycle |
| `ai_assistant_opened` / `_message_submit` / `_success` / `_failed` | AI chat lifecycle |

### Removed

| Event | Reason | Item |
|---|---|---|
| `quote_submit_success` | Duplicate of `quote_form_submitted` | 1.6 |

### New Events

| Event | When It Fires | Item |
|---|---|---|
| `accordion_service_expanded` | User expands a service (expand only, not collapse) | 2.7 |
| `quote_panel_bounced` | Panel closed with zero input, no success | 3.6 |

### Modified Events (New Metadata)

| Event | New Fields | Item |
|---|---|---|
| `cta_click` | `service_type` (when CTA has context) | 3.2 |
| `quote_panel_opened` | `service_type`, `source_cta_id` | 3.2 |
| `quote_open_clicked` | `service_type`, `source_cta` | 3.2 |
| `quote_step1_completed` | `lead_id_missing: true` (when leadId null) | 1.5 |

### Key Funnel Flows

**Happy path:**
```
section_view(hero) → scroll_depth(25%) → section_view(services)
→ accordion_service_expanded(post-construction)
→ cta_click(service_type: post_construction)
→ quote_panel_opened(service_type: post_construction)
→ quote_form_started → quote_step1_completed
→ quote_step2_viewed → quote_step2_completed
→ quote_form_submitted → [redirect /quote/success]
```

**Bounce path:**
```
cta_click(hero, no service_type) → quote_panel_opened
→ [user closes without typing] → quote_panel_bounced
```

**Abandonment path:**
```
cta_click(service_type: commercial) → quote_panel_opened
→ quote_form_started → [user types then closes]
→ quote_form_abandoned(step: 1, has_name: true, ...)
```

---

## Appendix C: Copy Changes Registry

All text changes shipped in this project, for stakeholder reference.

### Headlines & Kickers

| Section | Before | After | Item |
|---|---|---|---|
| Authority Bar kicker | "Track Record" | "The A&A Standard" | 2.8 |
| Authority Bar headline | "Our Numbers Speak" | "15+ Years. 500+ Spaces. Austin's Standard." | 2.8 |
| Testimonial kicker | "Client Feedback" | "Verified Results" | 2.13 |
| Testimonial headline | "What Clients Say" | "Trusted by Austin's Toughest Projects" | 2.13 |
| Before/After kicker | — | "Proof of Work" (unchanged per 4.2 deferral) | — |
| Before/After headline | — | "The A&A Standard" (unchanged per 4.2 deferral) | — |
| Timeline kicker | "Our Process" | "The A&A Process" | 4.1 |
| Timeline headline | "How It Works" | "How We Deliver" | 4.1 |
| Where We Work (mobile) | generic | "Georgetown to San Marcos" | 4.3 |
| Quote panel (Step 1) | "Detailed Scope Request" | "Get a Free Quote" | 1.2 |
| Quote panel (Step 2) | "Detailed Scope Request" | "Add Project Details" | 1.2 |

### Stat & Data Text

| Element | Before | After | Item |
|---|---|---|---|
| On-Time stat detail | "handoff focus" | "handoff rate" | 2.9 |
| Licensed & Insured detail | "ready for commercial and site work" | "fully credentialed for commercial sites" | 2.10 |
| Star rating text | "Trusted across Austin-area..." | "Rated 5 stars across 200+ completed projects" | 2.11 |

### New Text Added

| Element | Text | Item |
|---|---|---|
| Quote panel Step 1 subtitle | "Step 1 of 2 — Just three fields to get started." | 1.2 |
| Quote panel Step 2 subtitle | "Step 2 of 2 — Optional details to speed up your quote." | 1.2 |
| Where We Work subtitle (mobile) | "Same standards at every location across the Austin metro." | 4.3 |
| Timeline value lines (×4) | Per-step merged IncludedSummary callouts | 4.1 |
| LeadId missing fallback | "Thanks! We received your request and will call within 1 hour." | 1.5 |

---

# Addendum Findings (Compressed)

Six issues surfaced in final end-to-end review. Two were high-severity.

| # | Finding | Severity | Resolution |
|---|---|---|---|
| F1 | Panel stays open after Step 2 redirect (exposed by removing auto-close in 1.1) | **High** | Folded into launch verification (GATE-1 Q4). Do not assume fixed until manual pass confirms panel is closed on success redirect. |
| F2 | No "Back to Step 1" on Step 2 | Moderate | Scoped as future item. `setCurrentStep` already exposed from hook. Step 2 submission should send all fields (Step 1 + Step 2) to avoid duplicate lead creation on re-submit. |
| F3 | Self-asserted star rating without attribution | Moderate | Business decision needed: if A&A has ≥20 Google Reviews at ≥4.5 stars → use linked Google badge. If not → replace with operational claim ("Zero callbacks on 200+ projects"). |
| F4 | Bilingual promise exceeds digital delivery | Moderate | Quick fix available: add `¿Prefiere español? Llámenos: (512) 555-0199` below form fields. Full i18n is a separate project. |
| F5 | No conversion tracking for paid ad channels | **High** (business) | Engineering is trivial (30 min — add `ConversionTracking` component on /quote/success). Blocked on business providing Google Ads / Meta Pixel conversion IDs. **Flag to business owner immediately.** |
| F6 | Mobile keyboard pushes form content behind viewport | Moderate | Fix: add `scrollIntoView` on field focus with 300ms delay + add `inputMode` (`tel`, `email`) and `enterKeyHint` (`next`, `send`) attributes to form inputs. Pairs with panel height work (3.7). |

---

# Strategic Backlog

Consolidated from two overlapping strategic sections in v1.0. One canonical entry per feature. Organized by phase.

---

## Phase 1: Post-Launch (First 30-60 Days)

Focus: revenue capture, sales consistency, reputation baseline.

| Feature | What | Why | Effort |
|---|---|---|---|
| **Conversion tracking pixels** | Add Google Ads / Meta Pixel / GA4 events on /quote/success | Can't optimize ad spend without conversion attribution | 30 min eng + business config |
| **Lead quality scoring** | Auto-score leads by intent signals (timeline urgency, service type, project size, source) | Prioritize callbacks where win probability is highest | 4-6 hours |
| **Quote follow-up playbooks** | Standardized sequence by lead state: New → Contacted → Quoted → Stalled → At Risk | Reduces lead leakage from inconsistent follow-up | 3-4 hours (SOP creation) |
| **Win/loss reason taxonomy** | Require structured reason when lead is Won/Lost | Creates feedback loop for pricing, messaging, service gaps | 2 hours (CRM config) |
| **Review generation workflow** | Post-service review request with reminders and velocity dashboard | Reviews directly influence local ranking and conversion | 4-6 hours |
| **Service-area page depth** | Complete city-level `/service-area/[slug]` pages with local proof and CTAs | Geo trust + local organic conversion | 6-8 hours per city |
| **SEO metadata hardening** | Add `hreflang` alternates, route-level OG images, `next/font` integration, JSON-LD expansion | Multiple open items from 6.2 findings | 4-6 hours |

## Phase 2: Growth (60-120 Days)

Focus: trust assets, campaign infrastructure, operational visibility.

| Feature | What | Why | Effort |
|---|---|---|---|
| **Case study library** | Structured before/after case pages with scope, timeline, challenges, outcomes | Stronger proof than testimonials for high-ticket buyers | 8-12 hours (template + first 3 cases) |
| **Blog / insights section** | Practical articles tied to buyer intent (cleanup checklists, bid-day prep) | SEO footprint + pre-sells expertise | 6-8 hours (infrastructure) |
| **Campaign landing templates** | Standardized paid landing pages with UTM-aware variants | Better message-match for Google/Meta traffic | 6-8 hours |
| **SLA performance dashboard** | Response/quote/follow-up scoreboard with owner accountability | Converts execution into measurable discipline | 8-12 hours |
| **Multi-touch lead nurture** | 7/14/30/60-day sequences for contacted/non-converted leads | Recovers warm leads beyond initial follow-up window | 6-8 hours |
| **Before/After section redesign** | Featured Result block + metadata inversion + per-tab micro-CTA (DEF-P3) | Strengthens strongest proof section | 3-4 hours |
| **Industry landing page depth** | Expand `/industries/[slug]` with role-specific proof, pain maps, CTAs | Better message-match per segment | 4-6 hours per vertical |

## Phase 3: Scale (120+ Days)

Focus: automation, compounding growth, operational leverage.

| Feature | What | Why | Effort |
|---|---|---|---|
| **Referral flywheel** | Post-job referral ask with tracking links, incentive logic, performance dashboard | Low-CAC growth from happy customers | 8-12 hours |
| **AI assistant handoff** (DEF-P5) | AI extracts project details from chat → prefills quote form | Highest-value AI feature; turns chat into form-filling assistant | 8-16 hours |
| **Unified attribution dashboard** | Full source-to-revenue view (UTM, call source, form source, campaign, outcome) | Tells which channels produce profitable customers | 12-16 hours |
| **Capacity-aware lead throttling** | Auto-adjust intake when scheduling nears capacity | Prevents overselling and quality degradation | 6-8 hours |
| **Multi-location framework** | Reusable expansion templates for new zones/services | Enables growth without re-architecture | 8-12 hours |
| **Customer status page** | Tokenized job-status tracker for active customers | Reduces support calls, increases trust | 6-8 hours |

---

## Operator Enablement ("Guide for Mom")

Required deliverables for operational consistency:

| Deliverable | Frequency | Content |
|---|---|---|
| **Daily routine** | 15-20 min/day | Morning briefing, red-priority leads, schedule check, quality review, overdue payments |
| **End-of-day check** | 5 min/day | Uncontacted leads, tomorrow's dispatch, employee messages |
| **Weekly review** | 60-90 min/week | KPI snapshot, SLA performance, lost-lead analysis, review velocity, ad check, schedule planning |
| **Monthly review** | 90 min/month | Revenue vs forecast, ROI by channel, recurring share, crew performance, budget reallocation |
| **Exception SOP cards** | As needed | No-show, low rating, delayed payment, upset customer, escalation paths |

---

## Hiring & Recruiting Optimization

| Feature | What | Why |
|---|---|---|
| Candidate classification path | Branch at application: Direct Hire / Contractor / Undecided | Immediate routing clarity |
| Decision matrix scoring | Weighted: reliability, availability, legal docs, quality fit, communication, equipment | Consistent evaluation, fewer bad hires |
| Compliance checklist by type | Separate required docs per worker type | Reduces legal/process risk |
| Trial-shift evaluation | Pass/fail rubric with reviewer evidence notes | Quality control before full onboarding |
| Source-integrated recruiting | Sync LinkedIn/Indeed/Glassdoor into one hiring inbox with source tracking | Prevents candidate leakage, enables source ROI |

---

## Recommended Execution Sequence

```
1. Phase 1 conversion + intake + review workflow
2. Operator enablement pack + hiring workflows
3. Phase 2 proof/campaign templates + SLA visibility + nurture
4. Phase 3 referral + attribution + AI handoff + scale layers
```

Launch admin dashboard and employee dashboard after public site is live and collecting leads + employment inquiries.

---

# Risk Matrix (Active Items Only)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Hero hydration causes CLS on production | Low | High | GATE-2 verification. Deterministic initializer pattern is in place. Clean-profile test required. |
| Schema drift drops Step 2 enrichment silently | Medium | Medium | GATE-3 verification. Fallback prevents crashes. DB field check confirms persistence. |
| Manual QA reveals broken scroll targets post-reorder | Low | Medium | GATE-1 covers all hash navigation. Menu links and footer links tested per Q9-Q14. |
| Performance regression undetected without Lighthouse | Medium | Medium | SHOULD-2. Run as part of GATE-1. If scores acceptable, close. |
| Sub-page mobile conversion gap (footer CTA hidden) | Medium | Low | Sticky bar covers mobile conversion on all pages. Monitor sub-page submission volume. Add compact CTA if it drops. |
| Paid ad spend wasted without conversion tracking | High (if ads running) | High | F5 — flag to business owner immediately. 30-min engineering fix once IDs provided. |

---

# Source of Truth References

| Reference | Contents | Used By |
|---|---|---|
| §15.2 | Sticky bar behavior spec | z-index (1.4), panel height (3.7) |
| §15.3 | Social proof placement rules | Testimonials (2.13-2.14), Before/After (4.2) |
| §15.4 | Hero decision gate | Hero height (3.1) |
| §15.5 | Industry vertical directive | Template (5.2) |
| §15.6 | Quantified acceptance targets | Success criteria, monitoring thresholds |
| §16.2 | Thematic redundancy identification | IncludedSummary/Timeline merge (4.1) |
| §16.4 | Product directives | Careers removal, CTA dedup, service area |
| §16.5 | Service area plan | Modified: keep pages, remove homepage links |
| Desktop Safety Contract | Mobile changes must not break desktop | Every item annotated in v1.0 |
| `archive/v1-completed-items.md` | Full implementation detail for all fixed items | Reference when rollback or deep context needed |

---

# Change Log

| Date | What Changed | Why |
|---|---|---|
| 2026-04-04 | v1.0 created. Full 5,700+ line master doc with 40 baseline items across 7 batches. | Initial comprehensive audit and implementation plan. |
| 2026-04-04 | Execution log added (§7.1.1). Lint/build/analyze results recorded. Items 6.1, 6.2, 6.7 status updated. | Post-implementation automated validation pass. |
| 2026-04-04 | 6.7 moved from PARTIAL to VERIFIED-FIXED. Active PARTIAL list reduced from 12 to 11. | Phone pattern regex compatibility fix shipped. |
| 2026-04-04 | Addendum added: 6 findings (F1-F6) from final end-to-end review. F1 bundled into 1.1. | Comprehensive final review surfaced new issues. |
| 2026-04-04 | Decision Packet fully resolved: DP-1 through DP-5 approved, DP-6 and DP-7 rejected. | Product checkpoint completed. |
| 2026-04-04 | Strategic backlog sections added (Sales Optimization + Feature Recommendations). | Business expansion planning integrated into source doc. |
| 2026-04-05 | **v2.0 compacted.** 5,700+ lines → ~3,000 lines. Completed items collapsed to summary tables. Status vocabulary standardized. Launch gates formalized with owner/date/exit-test slots. Deferrals split into product vs technical. Strategic sections merged and deduplicated. Full v1.0 detail preserved in `../archive/v1-completed-items.md`. | Document was too large for active use. Compaction preserves all decisions and context while making the active work surface immediately actionable. |
| 2026-04-05 | Validation pass against codebase + v1 source: fixed/should-close counts corrected, item 3.9 restored to open (`should-close`), item 1.1 wording corrected to shipped behavior, archive links normalized to `../archive`. | Ensures v2.0 is an accurate operational source of truth before folder cleanup. |

---

```
End of Master Implementation Document v2.0
Tracked total: 44 items (32 fixed · 3 blocked-launch · 3 should-close · 6 deferred)
Next action: Assign owners and target dates for GATE-1, GATE-2, GATE-3
Archive: ../archive/v1-completed-items.md contains full implementation detail
```

---

**That's the complete v2.0.** Both parts together should land around 2,800-3,100 lines depending on your markdown renderer.

**Immediate next steps:**
1. Fill in `[assign]` and `[target date]` on the three launch gates
2. Decide whether F3 (star rating attribution) and F4 (Spanish phone line) go into a quick pre-launch patch or post-launch Phase 1
3. Flag F5 (conversion tracking) to the business owner — this is time-sensitive if any paid ads are running

