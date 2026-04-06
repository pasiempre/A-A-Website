# Master Implementation Document
## A&A Cleaning Services — Mobile UX Hardening & Conversion Optimization

---

# Document Overview

**Scope:** 31 implementation items derived from full code review of 25 files, screenshot-verified visual audit, and cross-cutting architectural analysis.

**Organization:** 7 batches ordered by dependency chain and risk. Each batch can be shipped independently. Later batches depend on earlier batches where noted.

**Conventions used throughout:**

- **Desktop Safety** — Every item is annotated with its desktop impact. Items marked `🟢 SAFE` have zero desktop risk. Items marked `🟡 VERIFY` need desktop QA. Items marked `🔴 CHANGES DESKTOP` intentionally modify desktop.
- **Acceptance Criteria** — Every item has testable pass/fail conditions.
- **Rollback** — Every item describes how to revert if something goes wrong.

---

# Current Status Tags (Section-Level)

Status tag legend:
- `VERIFIED-OPEN` = confirmed in current code and still needs work
- `VERIFIED-FIXED` = previously flagged issue is now implemented/fixed
- `PARTIAL` = improvement shipped, but section still needs optimization pass
- `DECISION-REQUIRED` = implementation depends on product decision first

| Section | Status Tag | Notes |
|---|---|---|
| Hero | `VERIFIED-OPEN` | Compact variant exists, but default mobile experience still carries dead-zone risk |
| Authority Bar | `VERIFIED-OPEN` | Messaging hierarchy and density still need refinement |
| What&apos;s Included | `VERIFIED-OPEN` | Visually plain and overlaps conceptually with How It Works |
| Services Accordion | `PARTIAL` | Accordion shipped; needs conversion weighting and final content hierarchy pass |
| Who We Serve | `VERIFIED-OPEN` | CTA treatment and intent alignment still below target |
| See the Difference | `VERIFIED-OPEN` | Strong interaction, but proof framing hierarchy needs upgrade |
| Testimonials | `VERIFIED-OPEN` | Social proof is solid; headline/count framing needs improvement |
| How It Works | `VERIFIED-OPEN` | Mobile presentation remains text-heavy; stepper treatment pending |
| About | `PARTIAL` | Structurally good; minor optimization and copy hierarchy cleanup |
| Where We Work | `VERIFIED-OPEN` | Duplicate city affordances and section density remain unresolved |
| Let&apos;s Talk About Your Project | `PARTIAL` | Strong closer, but currently not terminal in live composition |
| Careers (Homepage Presence) | `VERIFIED-OPEN` | Still in homepage composition; removal to dedicated route pending |
| Footer CTA Module | `VERIFIED-OPEN` | Still duplicates Let&apos;s Talk conversion intent |
| Footer Utility | `PARTIAL` | Mostly good; can be copy-tightened after CTA dedup |
| Hamburger Menu | `PARTIAL` | Action hierarchy improved; final visual consistency pass still needed |
| Floating Quote Form | `PARTIAL` | Two-step flow shipped; title/frame/panel-height polish remains |

Previously flagged items now confirmed fixed in code:
- `VERIFIED-FIXED` Mobile menu backdrop exists
- `VERIFIED-FIXED` Desktop dropdown blur-out close behavior implemented
- `VERIFIED-FIXED` Service accordion image rendering is conditional/lazy

---

# Feasibility And Expected Outcome

## Feasibility

This document is highly feasible to execute. The work is mostly component-level and already modularized by section. The highest-impact changes are low-to-medium complexity and do not require backend redesign.

Execution confidence by batch:
- Batch 1: Very high confidence, low risk, immediate UX/conversion improvements
- Batch 2: High confidence, medium effort, mainly presentation and hierarchy refactors
- Batch 3: Medium confidence, requires stronger product decisions and tighter QA loops

## Why This Document Is Helpful For Implementation

1. It is already dependency-aware and ordered by risk.
2. It separates bug fixes from design/system refactors.
3. It gives clear acceptance and rollback framing, which reduces delivery risk.
4. It maps to concrete files, so implementation can proceed without discovery overhead.

## Expected Outcome If Executed As Written

1. Mobile conversion path becomes clearer and faster to act on.
2. Redundancy and scroll fatigue drop materially, improving section completion.
3. Intent hierarchy improves: trust -> relevance -> proof -> action.
4. The page should feel more premium and less repetitive while preserving core architecture.

Projected practical outcome:
- Higher quote-start and quote-complete rate on mobile
- Reduced abandonment in mid-page sections
- Cleaner handoff from content sections into terminal CTA

---

# Line-Item Validation Matrix

Validation status legend:
- `READY` = implement now; no blocking decision required
- `DECISION-REQUIRED` = product/architecture decision needed before implementation
- `ALREADY-IMPLEMENTED` = item objective is already present in current code

| Item | Status | Validation Note |
|---|---|---|
| 1.1 | VERIFIED-FIXED | Step 1→2 auto-close race removed; panel remains open for optional enrichment |
| 1.2 | VERIFIED-FIXED | Step-aware panel headings/subcopy now align with Step 1 and Step 2 intent |
| 1.3 | ALREADY-IMPLEMENTED | CTA suppression selectors now have matching DOM IDs and active observer wiring |
| 1.4 | VERIFIED-FIXED | Floating quote panel/dialog layering raised above page overlays for reliable visibility |
| 1.5 | VERIFIED-FIXED | Step 1 response now enforces `leadId` presence before progressing to Step 2 |
| 1.6 | VERIFIED-FIXED | Duplicate success instrumentation removed; consolidated submit success tracking |
| 2.1 | VERIFIED-FIXED | Homepage `CareersSection` removed from public page composition |
| 2.2 | VERIFIED-FIXED | Footer conversion CTA block hidden on mobile to avoid closer duplication |
| 2.3 | VERIFIED-FIXED | Who We Serve card CTA promoted to primary button treatment on mobile |
| 2.4 | PARTIAL | Top CTA remains relocated, but lower mobile fallback CTA was removed in UX rollback |
| 2.5 | VERIFIED-FIXED | Persona outcome content now visible on mobile instead of `md`-only |
| 2.6 | ALREADY-IMPLEMENTED | Accordion default state already opens first service in current code |
| 2.7 | VERIFIED-FIXED | Mobile accordion now emits `accordion_service_expanded` on expand only, with service metadata |
| 2.8 | VERIFIED-FIXED | Authority kicker/headline updated to brand-specific Austin proof statement |
| 2.9 | VERIFIED-FIXED | On-Time metric detail updated to `handoff rate` (hedge language removed) |
| 2.10 | VERIFIED-FIXED | Licensed/Insured detail condensed and mid-card `Austin Standards` line removed |
| 2.11 | VERIFIED-FIXED | Trust capsule copy now includes explicit count framing (`200+ completed projects`) |
| 2.12 | VERIFIED-FIXED | Redundant city pill links removed; city cards remain as primary coverage affordance |
| 2.13 | VERIFIED-FIXED | Testimonial kicker/headline updated to explicit credibility framing |
| 2.14 | PARTIAL | Timeframe badge and review count indicator remain intentionally removed to keep testimonial focus uncluttered |
| 2.15 | VERIFIED-FIXED | Mobile menu backdrop opacity increased to `bg-black/70` for stronger focus |
| 2.16 | ALREADY-IMPLEMENTED | Hero subtitle text shadow already applied |
| 3.1 | VERIFIED-FIXED | Hero now defaults to compact mobile height (75svh) with query/localStorage overrides preserved |
| 3.2 | VERIFIED-FIXED | Quote CTA context threading implemented (serviceType mapped, panel prefill, analytics metadata wired) |
| 3.3 | VERIFIED-FIXED | Timeline heading block now omits redundant intro paragraph |
| 3.4 | VERIFIED-FIXED | Mobile timeline icon tiles restored with tightened sizing and spacing |
| 3.5 | VERIFIED-FIXED | Collapsed service accordion panels now apply `inert` alongside `aria-hidden` |
| 3.6 | VERIFIED-FIXED | Panel close now distinguishes no-input bounce (`quote_panel_bounced`) vs started-form abandonment |
| 3.7 | VERIFIED-FIXED | Mobile panel uses content-fit height (`min-h-[50svh] max-h-full`) with desktop `md:h-full` preserved |
| 3.9 | VERIFIED-OPEN | Mobile hero still shows excess top/bottom flex free-space (purple overlay in responsive QA); alignment tightening pass required |
| 4.1 | VERIFIED-FIXED | Included content fully merged into Timeline with value callouts; desktop/mobile consolidation shipped |
| 4.2 | PARTIAL | Option C selected: keep current stripped proof treatment now and schedule a dedicated redesign pass later |
| 4.3 | VERIFIED-FIXED | Mobile Where We Work now uses compact pills + mini map while desktop map/cards stay intact |
| 4.4 | VERIFIED-FIXED | Full homepage reorder shipped to the approved narrative sequence |
| 4.5 | VERIFIED-FIXED | Option C applied: proof line + package label retained with cleaner mobile typography and layout treatment |
| 5.1 | VERIFIED-FIXED | Who We Serve mobile layout converted to swipe carousel with snap behavior |
| 5.2 | VERIFIED-FIXED | Industry vertical route template shipped with standard SEO metadata and internal linking |
| 5.3 | PARTIAL | Deferred by decision; timeline remains animation-hardened with current merged layout |
| 5.4 | VERIFIED-FIXED | Services, industries, and service-area visual map data now use shared data modules |
| 5.5 | VERIFIED-FIXED | Dead `variant` prop removed from `CTAButton` interface |
| 5.6 | VERIFIED-FIXED | Industry menu sub-links now target distinct card anchors with matching section IDs |
| 6.1 | VERIFIED-FIXED | Client quote flow now retries transient failures; server lead acknowledgments use resilient retry + dead-letter escalation |
| 6.2 | VERIFIED-FIXED | Added language alternates and first-party Open Graph/Twitter image routes on top of metadata/schema baseline |
| 6.3 | PARTIAL | Step2 enrichment now enforces token + identifier format validation; broader API/RLS review still pending |
| 6.4 | PARTIAL | Lint/build/analyze rerun captured (reports generated); Lighthouse/Web Vitals and bundle hotspot triage still open |
| 6.5 | PARTIAL | Deferred implementation; accepted as planned discovery stream for form-prefill handoff design |
| 6.6 | VERIFIED-OPEN | Hero SSR/client variant mismatch still observed in dev hydration logs; enforce deterministic first paint and key migration validation |
| 6.7 | VERIFIED-FIXED | Quote form phone `pattern` updated to compatibility-safe syntax for modern browser regex parsing (`/v`) |
| 6.8 | PARTIAL | `/api/quote-request` local 500 reproduced as schema drift (`leads.company_name` missing in schema cache); compatibility fallback added, migration/env parity verification still pending |
| 6.9 | VERIFIED-OPEN | `proxy.js` disconnected-port / "Receiving end does not exist" console errors appear extension-injected; classify as external runtime noise and verify in clean profile |
| 7.1 | PARTIAL | Automated validation rerun completed (lint/build/analyze); manual mobile/desktop interaction pass pending |
| 7.2 | READY | Batch QA supplements are executable now |
| 7.3 | READY | Risk matrix is actionable now |
| 7.4 | READY | Post-ship monitoring plan is actionable now |
| 7.5 | READY | Deployment strategy is actionable now |
| 7.6 | READY | Success criteria remain valid for execution tracking |
| 7.7 | READY | Source-of-truth reference section remains valid |

Summary counts:
- READY: 42
- DECISION-REQUIRED: 7
- ALREADY-IMPLEMENTED: 4

Execution guidance:
1. Implement all `READY` items in dependency order (Batch 1 -> Batch 2 -> Batch 3-ready subset).
2. Resolve `DECISION-REQUIRED` items as a single product checkpoint before Batch 4+ work.
3. Remove or archive `ALREADY-IMPLEMENTED` items from active sprint scope to prevent rework.

---

# Decision Packet (Approve/Reject)

Purpose: fast approval surface for all `DECISION-REQUIRED` items so execution can proceed without ambiguity.

How to use:
1. Review each item below.
2. Mark `Approved` or `Rejected`.
3. If rejected, provide replacement direction in one sentence.

---

## DP-1 — Item 4.1 (Merge Included + Timeline)

Reference: [4.1 section](masterdoc-ux-ui.md#L2923)

Decision needed:
- Merge `What&apos;s Included` into `How It Works`, or keep separate with stronger differentiation.

Recommended default:
- `Approve merge for mobile only` in this phase.
- Keep desktop structure unchanged for safety.

Why:
- Removes thematic redundancy where mobile users currently see process framing twice.
- Preserves desktop while shipping high-value mobile simplification quickly.

Decision:
- [x] Approved
- [ ] Rejected
- Approved for desktop and mobile. Consolidation should remove redundancy across both viewports.

---

## DP-2 — Item 4.3 (Where We Work Consolidation)

Reference: [4.3 section](masterdoc-ux-ui.md#L3325)

Decision needed:
- Pick one city navigation pattern on homepage and decide route strategy for city pages.

Recommended default:
- `Approve homepage simplification now`: remove duplicate city pill links on homepage.
- Keep `/service-area` and existing slug pages for now (no decommission in this sprint).

Why:
- Delivers immediate UX clarity without SEO risk.
- Defers route removals/redirect complexity until a dedicated SEO pass.

Decision:
- [x] Approved
- [ ] Rejected

- Follow recommendation: compact mobile representation with mini-map retained for geographic credibility.

---

## DP-3 — Item 4.4 (Homepage Section Reordering)

Reference: [4.4 section](masterdoc-ux-ui.md#L3494)

Decision needed:
- Whether to reorder major homepage sections in this phase.

Recommended default:
- `Approve limited reorder`: move Careers out, keep core order stable otherwise.
- Defer full IA reorder until post-Batch-2 metrics review.

Why:
- Reduces risk while still fixing the largest conversion-path conflict.
- Avoids wide regression surface during active optimization.

Decision:
- [x] Approved
- [ ] Rejected

- Approved as full section reorder per §4.4 implementation sequence.

---

## DP-4 — Item 5.1 (Who We Serve Carousel on Mobile)

Reference: [5.1 section](masterdoc-ux-ui.md#L3770)

Decision needed:
- Convert stacked persona cards to mobile carousel now, or keep stacked layout.

Recommended default:
- `Reject for current sprint` (defer).
- Keep stacked cards and upgrade CTA prominence first.

Why:
- CTA and copy hierarchy fixes are lower risk and likely deliver most gains first.
- Carousel introduces higher interaction/test complexity.

Decision:
- [x] Approved
- [ ] Rejected

- Implement now. Vertical stack is too long; mobile carousel is preferred.

---

## DP-5 — Item 5.2 (Industry Vertical Page Template)

Reference: [5.2 section](masterdoc-ux-ui.md#L3788)

Decision needed:
- Build/publish industry vertical pages now vs. later.

Recommended default:
- `Approve template build only`, `defer publication` until content-proof depth is ready.

Why:
- Keeps architecture momentum without shipping thin pages.
- Aligns with quality gate expectations and avoids SEO cannibalization risk.

Decision:
- [x] Approved
- [ ] Rejected

- Publish standard versions now for SEO. Persona-depth expansion will follow additional research.

## DP-6 — Item 5.3 (Mobile Stepper Accordion)

Reference: [5.3 section](masterdoc-ux-ui.md#L3805)

Decision needed:
- Rebuild timeline as stepper accordion now vs. incremental visual hardening.

Recommended default:
- `Approve incremental first`: remove intro redundancy + show icons on mobile now.
- Defer full stepper accordion until after merge decision outcome (DP-1).

Why:
- Delivers immediate improvement with low risk.
- Avoids rework if merge strategy changes component boundaries.

Decision:
- [ ] Approved
- [x] Rejected

- Defer full stepper accordion. Revisit with stronger mobile visual direction.

---

## DP-7 — Item 6.5 (AI Assistant Handoff Integration)

Reference: [6.5 section](masterdoc-ux-ui.md#L3935)

Decision needed:
- Scope and privacy boundary for AI assistant to quote handoff.

Recommended default:
- `Reject in current sprint` (defer).
- Keep assistant suppression/positioning polish only in this phase.

Why:
- Requires product policy, data handling, and consent decisions.
- Not required to deliver core conversion-path fixes.

Decision:
- [ ] Approved
- [x] Rejected

- Defer implementation now. Add as end-of-sprint planning/discovery item focused on form-prefill handoff.

---

## Decision Summary (To Fill)

Approved items:
- DP-1 (4.1) — Merge Included + Timeline approved across desktop and mobile
- DP-2 (4.3) — Where We Work consolidation approved with compact mobile layout and mini-map
- DP-3 (4.4) — Homepage reorder approved exactly as §4.4 sequence
- DP-4 (5.1) — Who We Serve mobile carousel approved for implementation
- DP-5 (5.2) — Industry vertical template approved and published in standard form

Rejected items:
- DP-6 (5.3) — Mobile stepper accordion deferred for later visual redesign pass
- DP-7 (6.5) — AI handoff implementation deferred to scoped planning/discovery

Pending clarification items:
- None

Blocked implementation impact:
- If DP-1 is rejected, keep 4.1 out of scope and proceed with 3.3 + 3.4 only.
- If DP-2 is rejected, keep homepage Where We Work as-is and continue with non-route items.
- If DP-3 is rejected, do not reorder sections beyond removing Careers.

Current execution scope state:
- Confirmed in-scope now: 4.1, 4.3, 4.4, 5.1, 5.2, plus non-decision `READY` items.
- Deferred: 5.3 implementation and 6.5 implementation (planning retained).
- Awaiting final decision: none in this packet.

---

---

# BATCH 1: Critical Bug Fixes

**Ship these before any other work. These are live bugs affecting real users.**

---

## 1.1 — Fix Auto-Close Race Condition on Step 1→2 Transition

**Bug ID:** BUG-001
**Severity:** High — Users lose the Step 2 form 1.8 seconds after completing Step 1
**File:** `FloatingQuotePanel.tsx`
**Desktop Safety:** 🟢 SAFE — FloatingQuotePanel only renders on mobile (`md:hidden` wrapper on `MobileQuoteCloser` triggers it; desktop uses `QuoteSection`)

### Root Cause

The FloatingQuotePanel has a `useEffect` that auto-closes the panel when it detects `feedback.type === "success"` AND `currentStep === 2`:

```tsx
useEffect(() => {
  if (feedback?.type !== "success" || currentStep !== 2) return;
  const closeTimer = window.setTimeout(() => onClose(), 1800);
  return () => window.clearTimeout(closeTimer);
}, [currentStep, feedback, onClose]);
```

After Step 1 completes, `useQuoteForm` sets both `currentStep = 2` and `feedback = { type: "success", message: "Great. Add optional project details..." }`. Both conditions become true simultaneously. The timer starts. The panel closes in 1.8 seconds — before the user can meaningfully interact with Step 2.

Step 2 completion never triggers this effect because `useQuoteForm` doesn't call `setFeedback` after Step 2 — it calls `router.push()` directly.

### The Fix

**Option A (Recommended): Remove the auto-close effect entirely.**

The auto-close serves no valid purpose in the current flow:
- After Step 1 → Step 2 transition: it's harmful (closes too early)
- After Step 2 submission: it never fires (redirect handles exit)
- There's no third state where auto-close would be useful

```tsx
// DELETE this entire useEffect block:

// useEffect(() => {
//   if (feedback?.type !== "success" || currentStep !== 2) return;
//   const closeTimer = window.setTimeout(() => onClose(), 1800);
//   return () => window.clearTimeout(closeTimer);
// }, [currentStep, feedback, onClose]);
```

**Option B (If auto-close is desired for a future flow):** Add a `step2Submitted` signal.

In `useQuoteForm.ts`, add a new state:
```tsx
const [step2Submitted, setStep2Submitted] = useState(false);
```

Set it after Step 2 API success:
```tsx
if (enableTwoStep) {
  setStep2Submitted(true); // ADD THIS
  await trackConversionEvent({ eventName: "quote_step2_completed", ... });
}
```

Return it from the hook:
```tsx
return {
  // ... existing returns
  step2Submitted,
};
```

In `FloatingQuotePanel.tsx`, change the condition:
```tsx
useEffect(() => {
  if (!step2Submitted) return; // Changed condition
  const closeTimer = window.setTimeout(() => onClose(), 1800);
  return () => window.clearTimeout(closeTimer);
}, [step2Submitted, onClose]);
```

### Why Option A is recommended

The redirect to `/quote/success` already handles the exit after final submission. The auto-close is redundant even when it works correctly. Removing it eliminates the bug and removes dead code. If a future flow needs auto-close behavior, it should be designed explicitly with the correct trigger condition rather than relying on the current ambiguous feedback+step state combination.

### Acceptance Criteria

1. Open floating quote panel on mobile
2. Fill in Name, Phone, select Service Type
3. Tap "Continue" (Step 1 submission)
4. Verify: Panel shows Step 2 fields with "Great. Add optional project details..." message
5. Wait 5 seconds without interacting
6. **PASS:** Panel remains open. Step 2 fields are still visible and editable
7. **FAIL:** Panel closes automatically

### Rollback

Re-add the deleted `useEffect` block. (This re-introduces the bug, but the bug was the existing behavior, so it's a known state.)

### Estimated Effort: 15 minutes

---

## 1.2 — Fix Panel Title Mismatch (Step-Aware Title)

**Bug ID:** BUG-002
**Severity:** Moderate — Sets wrong expectation for form complexity
**File:** `FloatingQuotePanel.tsx`
**Desktop Safety:** 🟢 SAFE — FloatingQuotePanel is mobile-only

### Root Cause

The panel title is static:
```tsx
<h3 id={`${fieldPrefix}-title`} className="font-serif text-2xl text-[#0A1628] md:text-3xl">
  Detailed Scope Request
</h3>
```

Step 1 asks for "quick contact details" (name, phone, service type) — three fields. "Detailed Scope Request" creates a complexity expectation that contradicts the simple form. This mismatch can increase form abandonment because users anticipate a longer process than what's actually required.

### The Fix

Replace the static title with a step-aware conditional:

```tsx
<h3 id={`${fieldPrefix}-title`} className="font-serif text-2xl text-[#0A1628] md:text-3xl">
  {currentStep === 1 ? "Get a Free Quote" : "Add Project Details"}
</h3>
```

`currentStep` is already available in the component via `useQuoteForm`'s return value (it's destructured as part of the form state).

If the component doesn't currently destructure `currentStep`, it needs to be added to the destructuring of the `useQuoteForm` return:

```tsx
const {
  fields,
  setters,
  isSubmitting,
  feedback,
  currentStep, // Ensure this is destructured
  submitLead,
  markFormStarted,
} = useQuoteForm({ source: "floating_quote_panel", enableTwoStep: true });
```

### Also update the step indicator text for consistency

Currently the step indicator likely says something like:
```
Step 1 of 2: Share quick contact details.
```

Update to align with the new title:

```tsx
{currentStep === 1 ? (
  <p className="mt-1 text-sm text-slate-500">Step 1 of 2 — Just three fields to get started.</p>
) : (
  <p className="mt-1 text-sm text-slate-500">Step 2 of 2 — Optional details to speed up your quote.</p>
)}
```

The "Optional" framing on Step 2 is critical — it tells the user they can close the panel without guilt. Their lead is already captured (Step 1 sent it to the API). This aligns with the architecture's intention that Step 2 abandonment is expected and acceptable.

### Acceptance Criteria

1. Open floating quote panel on mobile
2. **PASS:** Title reads "Get a Free Quote." Subtitle mentions Step 1 of 2
3. Complete Step 1 (name, phone, service type → Continue)
4. **PASS:** Title changes to "Add Project Details." Subtitle mentions Step 2 of 2 and "Optional"
5. **FAIL:** Title remains "Detailed Scope Request" at any step

### Rollback

Revert the `<h3>` content to the static string `"Detailed Scope Request"`.

### Dependencies

None — but if shipping with 1.1 (auto-close fix), test them together since both affect the Step 1→2 transition experience.

### Estimated Effort: 20 minutes

---

## 1.3 — Fix AI Assistant CTA Suppression Phantom Selectors

**Bug ID:** BUG-003
**Severity:** Moderate — AI trigger overlaps important CTAs, creating tap-target conflicts
**File:** `AIQuoteAssistant.tsx` + 3 section files for ID attributes
**Desktop Safety:** 🟢 SAFE — AI trigger positioning is the same on both viewports, but the overlap issue is primarily a mobile problem due to smaller viewport

### Root Cause

The suppression system uses CSS `id` selectors to find CTA elements:

```tsx
const ctaAnchors = [
  "#hero-primary-cta",
  "#service-area-primary-cta",
  "#mobile-quote-closer-cta",
  "#quote",
];
```

Three of these (`#hero-primary-cta`, `#service-area-primary-cta`, `#mobile-quote-closer-cta`) target HTML `id` attributes that **don't exist on any DOM element**. The `ctaId` prop on QuoteCTA/CTAButton is used exclusively for analytics metadata — it's never rendered as an HTML attribute. The `document.querySelector` calls return `null`, these are filtered out, and the IntersectionObserver only watches `#quote` (the desktop quote section, which is `hidden` on mobile).

**Result:** On mobile, the suppression system effectively monitors zero elements. The AI trigger is never suppressed, and it overlaps CTAs throughout the page.

### The Fix

**Approach: Add `id` attributes to wrapper elements around the target CTA areas.**

We don't add `id` to the CTAButton component itself (that would require changing a shared component for a specific consumer's need). Instead, we add `id` to the parent wrapper elements in each section that already contain the relevant CTAs.

**File 1: `HeroSection.tsx`**

Find the CTA button container (the div wrapping "Get a Free Quote" and "Call Now"):
```tsx
// Before:
<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4 md:mt-10 ...">
  <QuoteCTA ...>Get a Free Quote</QuoteCTA>
  <CTAButton ...>Call Now: ...</CTAButton>
</div>

// After:
<div id="hero-primary-cta" className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4 md:mt-10 ...">
  <QuoteCTA ...>Get a Free Quote</QuoteCTA>
  <CTAButton ...>Call Now: ...</CTAButton>
</div>
```

**File 2: `ServiceAreaSection.tsx`**

Find the CTA wrapper in the service area section:
```tsx
// Before:
<div className="mt-6 ...">
  <QuoteCTA ctaId="service_area_check_availability" ...>
    Check Availability in Your Area
  </QuoteCTA>
</div>

// After:
<div id="service-area-primary-cta" className="mt-6 ...">
  <QuoteCTA ctaId="service_area_check_availability" ...>
    Check Availability in Your Area
  </QuoteCTA>
</div>
```

**File 3: `VariantAPublicPage.tsx`**

The MobileQuoteCloser section:
```tsx
// Before:
<section id="quote-closer" className="... md:hidden">

// After:
<section id="mobile-quote-closer-cta" className="... md:hidden">
```

Note: This changes the section's `id` from `quote-closer` to `mobile-quote-closer-cta`. Check whether `quote-closer` is referenced anywhere else:
- Analytics section_view tracking uses element `id` — the tracked section name would change from `quote-closer` to `mobile-quote-closer-cta`. This is acceptable and arguably more descriptive.
- Any `href="/#quote-closer"` links would need updating. Search the codebase for `quote-closer` references.

**Alternative if changing `id` is risky:** Keep the section `id="quote-closer"` and add a wrapper div inside:
```tsx
<section id="quote-closer" className="... md:hidden">
  <div id="mobile-quote-closer-cta" className="...">
    {/* existing content */}
  </div>
</section>
```

### Acceptance Criteria

1. On mobile, scroll to the hero CTA buttons area
2. **PASS:** AI trigger (blue circle) fades out / becomes non-interactive when hero CTAs are visible
3. Scroll to the Service Area CTA
4. **PASS:** AI trigger fades out when "Check Availability" button is visible
5. Scroll to the Let's Talk section (MobileQuoteCloser)
6. **PASS:** AI trigger fades out when the quote closer CTAs are visible
7. Scroll to a section with no CTAs (e.g., About)
8. **PASS:** AI trigger is fully visible and interactive

### Rollback

Remove the added `id` attributes from the three files. The suppression system returns to monitoring only `#quote`.

### Estimated Effort: 30 minutes (including codebase search for `quote-closer` references)

---

## 1.4 — Fix FloatingQuotePanel Z-Index Stacking Conflict

**Bug ID:** BUG-004
**Severity:** Low — Fragile stacking, not currently causing visible issues but will break under concurrent state
**File:** `FloatingQuotePanel.tsx`
**Desktop Safety:** 🟢 SAFE — Panel is mobile-only

### Root Cause

FloatingQuotePanel uses `z-50`, which matches the header's `z-[var(--z-header)]` = 50. The design token system defines:

```css
--z-sticky-bar: 30;
--z-floating-widget: 40;
--z-header: 50;
--z-dialog: 55;
--z-overlay: 60;
```

The panel is a dialog. It should use the dialog z-index (55), not the header z-index (50). Currently it works because the panel renders later in DOM order than the header (same z-index → later DOM wins). But this is position-dependent, not explicit.

The AIQuoteAssistant panel uses `z-[55]` correctly. The ExitIntentOverlay uses `z-[60]` correctly. FloatingQuotePanel is the outlier.

### The Fix

In `FloatingQuotePanel.tsx`, find the panel container's className and change `z-50` to `z-[55]`:

```tsx
// Before:
className={`absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white z-50 ...`}

// After:
className={`absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white z-[55] ...`}
```

Also check the backdrop element (if there's a semi-transparent overlay behind the panel). It should use the same z-index or one below:

```tsx
// Backdrop (if exists):
// z-[54] or z-[55] — should be at or just below the panel
```

### Verify the full stacking order is correct after fix:

| Element | Z-Index | Correct? |
|---|---|---|
| Sticky bar | 30 | ✅ Bottom of floating elements |
| AI trigger button | 40 | ✅ Above sticky bar, below header |
| Header | 50 | ✅ Above widgets, below dialogs |
| FloatingQuotePanel | 55 (was 50) | ✅ Dialog layer |
| AI chat panel | 55 | ⚠️ Same as quote panel — acceptable since they shouldn't both be open. If quote panel opens, AI trigger gets `floating-widget` suppression |
| ExitIntentOverlay | 60 | ✅ Highest overlay |

### Acceptance Criteria

1. Open FloatingQuotePanel on mobile
2. Verify the panel renders above the sticky header (no header elements bleeding through)
3. Open AI chat → then trigger quote panel (if possible from chat context): quote panel should be on top
4. **PASS:** No z-index conflicts visible in any combination
5. **FAIL:** Header elements visible through/above the quote panel

### Rollback

Change `z-[55]` back to `z-50`.

### Estimated Effort: 10 minutes

---

## 1.5 — Add LeadId Validation Before Step 2 Transition

**Bug ID:** BUG-005
**Severity:** Medium — Edge case where Step 1 API response doesn't include leadId, causing Step 2 to submit with null reference
**File:** `useQuoteForm.ts`
**Desktop Safety:** 🟢 SAFE — useQuoteForm is shared, but the two-step flow only runs on mobile (desktop uses single-step). However, the fix is in the hook itself, which is consumed by both. The conditional only affects the `enableTwoStep` path, so desktop single-step is unaffected.

### Root Cause

After Step 1 API success:
```tsx
const stepOneBody = (await stepOneResponse.json().catch(() => null)) as { leadId?: string } | null;
setLeadId(stepOneBody?.leadId ?? null);
setCurrentStep(2);
```

If `stepOneResponse.json()` throws (malformed JSON), `stepOneBody` is `null`. `stepOneBody?.leadId` is `undefined`. `undefined ?? null` is `null`. The form transitions to Step 2 with `leadId = null`.

When Step 2 submits:
```tsx
body: JSON.stringify({
  flowStep: "step2",
  leadId,        // null
  companyName,
  email,
  timeline,
  description,
  website,
}),
```

The API receives `leadId: null`. Depending on the API's handling, this either:
- Returns an error (best case — user sees error message)
- Creates an orphaned enrichment record (worst case — data loss)
- Silently ignores the update (bad — user thinks they submitted but nothing happened)

### The Fix

After the Step 1 API call succeeds, validate the leadId before transitioning:

```tsx
const stepOneBody = (await stepOneResponse.json().catch(() => null)) as { leadId?: string } | null;
const receivedLeadId = stepOneBody?.leadId ?? null;
setLeadId(receivedLeadId);

if (!receivedLeadId) {
  // Lead was created (API returned 200) but we didn't get the ID back.
  // The lead exists in the database. Admin got the SMS. Customer got acknowledgment.
  // We just can't do Step 2 enrichment without the ID.
  setFeedback({
    message: "Thanks! We received your request and will call within 1 hour.",
    type: "success",
  });
  
  await trackConversionEvent({
    eventName: "quote_step1_completed",
    source,
    metadata: { serviceType, lead_id_missing: true },
  });
  
  // DON'T transition to Step 2. Stay on Step 1 with success message.
  // The user sees confirmation. The lead is captured. Admin will follow up.
  return;
}

// Normal flow — leadId received, transition to Step 2
setCurrentStep(2);
setFeedback({
  message: "Great. Add optional project details to speed up your quote.",
  type: "success",
});

await trackConversionEvent({
  eventName: "quote_step1_completed",
  source,
  metadata: { serviceType },
});

await trackConversionEvent({
  eventName: "quote_step2_viewed",
  source,
  metadata: { lead_id: receivedLeadId },
});
```

**Note on interaction with Bug 1.1 (auto-close):** If the auto-close useEffect is removed (recommended), this fix works cleanly — the panel stays open showing the success message, and the user can close it manually or use the sticky bar to call. If the auto-close is kept with the `step2Submitted` condition, this also works because `currentStep` stays at 1, so the auto-close condition (`currentStep === 2`) never becomes true.

### Acceptance Criteria

This is difficult to test in normal conditions because the API normally returns a leadId. To test:

1. Temporarily modify the API to return `{ success: true }` without `leadId` (or use network interception tools to strip the field)
2. Complete Step 1 on mobile
3. **PASS:** Panel shows "Thanks! We received your request and will call within 1 hour." Step 2 fields do NOT appear. Panel remains on Step 1 display.
4. **FAIL:** Panel transitions to Step 2 with blank enrichment fields

Normal-path test:
5. Complete Step 1 with working API
6. **PASS:** Normal Step 2 transition occurs with "Great. Add optional project details..." message

### Rollback

Remove the `if (!receivedLeadId)` block. Restore the original flow where `setCurrentStep(2)` always fires after a successful Step 1 response.

### Estimated Effort: 25 minutes

---

## 1.6 — Remove Duplicate Success Analytics Events

**Bug ID:** BUG-003 (analytics)
**Severity:** Low — Inflates success event counts, complicates analytics
**File:** `useQuoteForm.ts`
**Desktop Safety:** 🟢 SAFE — Analytics-only change, no UI impact

### Root Cause

After successful form submission (both single-step and Step 2):

```tsx
await trackConversionEvent({
  eventName: "quote_form_submitted",
  source,
  metadata: { serviceType, hero_variant: getHeroVariant() },
});

await trackConversionEvent({
  eventName: "quote_submit_success",
  source,
  metadata: { serviceType, hero_variant: getHeroVariant() },
});
```

Both events fire at the same point, after the same `response.ok` check, with the same metadata. They're semantically identical. "Submitted" and "success" are the same thing in this code path — there's no scenario where "submitted" fires but "success" doesn't.

### The Fix

Remove `quote_submit_success`. Keep `quote_form_submitted` as the canonical success event.

```tsx
// Keep this:
await trackConversionEvent({
  eventName: "quote_form_submitted",
  source,
  metadata: { serviceType, hero_variant: getHeroVariant() },
});

// DELETE this:
// await trackConversionEvent({
//   eventName: "quote_submit_success",
//   source,
//   metadata: { serviceType, hero_variant: getHeroVariant() },
// });
```

### Pre-Removal Check

Before removing, search analytics dashboards/reporting for references to `quote_submit_success`. If any dashboard, funnel report, or alert uses this event name, either:
- Update the dashboard to use `quote_form_submitted` first, then remove the duplicate event
- Or keep both events temporarily with a `// DEPRECATED: use quote_form_submitted` comment, and remove after dashboard migration

### Acceptance Criteria

1. Submit a quote form successfully
2. Check analytics events fired
3. **PASS:** Only `quote_form_submitted` fires. No `quote_submit_success`.
4. **FAIL:** Both events still fire

### Rollback

Re-add the `quote_submit_success` trackConversionEvent call.

### Estimated Effort: 10 minutes (plus dashboard audit)

---

## Batch 1 Summary

| Item | Bug | Effort | Risk |
|---|---|---|---|
| 1.1 | Auto-close race condition | 15 min | Low — removing dead code |
| 1.2 | Panel title mismatch | 20 min | Low — text change |
| 1.3 | AI suppression phantom selectors | 30 min | Low — adding HTML ids |
| 1.4 | Z-index stacking conflict | 10 min | Low — CSS value change |
| 1.5 | LeadId null transition | 25 min | Low — adding validation guard |
| 1.6 | Duplicate success events | 10 min | Low — removing one event (check dashboards first) |

**Total Batch 1 effort: ~2 hours**
**Total Batch 1 risk: Low across all items**
**Batch 1 has zero dependencies on other batches**

**Recommended shipping order within Batch 1:** 1.1 and 1.2 together (both affect Step 1→2 transition), then 1.3, then 1.4, 1.5, 1.6 in any order.

---



# BATCH 2: Tier 1 Immediate Wins — No Design Changes Required

**These are copy changes, class changes, element removals, and small structural adjustments. Every item is a single-file change (or two at most). None require new components, new layouts, or design review. All can ship independently within this batch.**

---

## 2.1 — Remove CareersSection from Homepage Composition

**Priority:** Highest in this batch — unblocks the §16.4 terminal conversion section directive
**File:** `VariantAPublicPage.tsx`
**Desktop Safety:** 🔴 CHANGES DESKTOP — CareersSection also appears on desktop homepage. Removal affects both viewports. This is intentional per §16.4.
**Scroll Savings:** ~650px mobile

### Context

CareersSection is the last content section before FooterSection. It sits between MobileQuoteCloser ("Let's Talk" — the intended terminal conversion section) and FooterSection (which contains its own duplicate CTA). This placement:

1. Breaks the conversion funnel — a user who just saw "Let's Talk About Your Project" scrolls into a recruiting section
2. Adds ~650px of content targeted at job seekers, not customers (the homepage's audience)
3. Violates §16.4 which explicitly directs: "Remove Careers from homepage"

The /careers route exists independently. The CareersSection component is imported and rendered on that page. Footer navigation already includes a "Careers" link. The hamburger menu already includes "Careers" under Resources.

### The Fix

In `VariantAPublicPage.tsx`, locate and remove (or comment out) the CareersSection import and rendering:

```tsx
// REMOVE this import:
// import { CareersSection } from "@/components/CareersSection";

// REMOVE this from the JSX composition (inside <main>):
// <CareersSection />
```

The component file `CareersSection.tsx` stays intact — it's still used by the /careers route.

### Cascading Changes Required

**Change 1: Update `/#careers` to `/careers` in navigation**

File: `PublicHeader.tsx`

In the `primaryLinks` array:
```tsx
// Before:
{ href: "/#careers", label: "Careers" },

// After:
{ href: "/careers", label: "Careers" },
```

The current `/#careers` is a hash anchor that scrolls to the CareersSection on the homepage. Once the section is removed, this anchor points to nothing. Changing to `/careers` routes to the dedicated careers page.

**Change 2: Verify FooterSection careers link**

File: `FooterSection.tsx`

Check whether the footer's "Careers" link uses `/#careers` or `/careers`. If it uses the hash anchor, update to the route:

```tsx
// If found as /#careers, change to:
<Link href="/careers">Careers</Link>
```

### What to verify before shipping

1. **Does the /careers page import CareersSection directly?** If yes, removal from homepage has zero side effects. If the /careers page uses a different layout that happens to reference the homepage section, there could be an issue. Search for: `import.*CareersSection` across the codebase.

2. **Are there any scroll-to-careers triggers elsewhere?** Search for: `#careers`, `scrollTo.*careers`, `getElementById.*careers`. Any references need updating.

3. **Analytics section_view tracking:** The `CareersSection` presumably has a section `id` that generates `section_view` events. Removing it means this section will no longer appear in section analytics for the homepage. This is expected and correct — the section shouldn't be on the homepage.

### Acceptance Criteria

1. Load homepage on mobile
2. Scroll to the "Let's Talk About Your Project" section (MobileQuoteCloser)
3. Continue scrolling
4. **PASS:** Next content is the footer (FooterSection utility area). No careers content, no "We're Building a Team," no perk cards.
5. Navigate to hamburger menu → tap "Careers"
6. **PASS:** Routes to /careers page (not a blank scroll or 404)
7. On footer, tap "Careers" link
8. **PASS:** Routes to /careers page
9. **FAIL:** Any of: careers content still on homepage, /careers link is dead, menu link scrolls to nonexistent section

### Rollback

Re-add `<CareersSection />` to the VariantAPublicPage composition and revert the primaryLinks href change.

### Estimated Effort: 20 minutes (including link verification sweep)

---

## 2.2 — Hide Footer CTA Module on Mobile

**Priority:** High — eliminates the duplicate conversion CTA below the terminal closer
**File:** `FooterSection.tsx`
**Desktop Safety:** 🟢 SAFE — Footer CTA remains visible on desktop where it serves as the primary conversion closer (MobileQuoteCloser is `md:hidden`)
**Scroll Savings:** ~300px mobile

### Context

The Footer CTA module ("Bring A&A in before the handoff gets rushed" + "Get Your Free Quote" + "Or Call") is structurally identical in intent to MobileQuoteCloser ("Let's Talk About Your Project" + "Get Your Free Quote" + "Or Call Directly"). On mobile, both render. After removing CareersSection (2.1), they would be directly adjacent — two conversion blocks back-to-back with nearly identical messaging and identical CTAs.

On desktop, MobileQuoteCloser is hidden (`md:hidden`). The Footer CTA module is the only conversion closer before the utility footer. **Desktop needs this section. Mobile doesn't.**

### The Fix

In `FooterSection.tsx`, find the Footer CTA module container. It's the `<div>` with the gradient background, headline, body copy, and two CTA buttons:

```tsx
// Find the outer container (approximately):
<div className="mb-8 rounded-2xl border border-white/10 bg-[linear-gradient(...)] px-5 py-6 shadow-[...] backdrop-blur md:mb-16 md:...">
```

Add `hidden md:block` to this container:

```tsx
// After:
<div className="hidden md:block mb-8 rounded-2xl border border-white/10 bg-[linear-gradient(...)] px-5 py-6 shadow-[...] backdrop-blur md:mb-16 md:...">
```

This hides the Footer CTA module on mobile (below `md` breakpoint) while preserving it on desktop.

### Important: This only works correctly AFTER 2.1 (CareersSection removal)

The dependency chain is:
1. Remove CareersSection → MobileQuoteCloser becomes the last content section on mobile
2. Hide Footer CTA on mobile → The utility footer (nav grid, contact, copyright) follows directly after MobileQuoteCloser

If you ship 2.2 without 2.1, the mobile flow becomes: MobileQuoteCloser → CareersSection → utility footer. CareersSection would be the last thing before the footer, which is worse than the current state.

**Ship 2.1 first, or ship 2.1 and 2.2 together.**

### Acceptance Criteria

1. Load homepage on mobile
2. Scroll past MobileQuoteCloser ("Let's Talk About Your Project")
3. **PASS:** Next visible content is the utility footer (brand description, navigation grid, contact info, copyright). No "Bring A&A in before the handoff gets rushed" block.
4. Load homepage on desktop (or resize to desktop width)
5. Scroll to footer area
6. **PASS:** "Bring A&A in before the handoff gets rushed" block IS visible above the utility footer
7. **FAIL:** Footer CTA visible on mobile, or Footer CTA missing on desktop

### Sub-page consideration

FooterSection renders on ALL public pages (it's in `PublicChrome.tsx`). Hiding the Footer CTA on mobile means /faq, /privacy, /terms, and /careers pages also lose their mobile footer CTA. These pages don't have MobileQuoteCloser (that's homepage-only). So sub-pages on mobile would have NO conversion CTA before the utility footer.

**Options:**
- **Accept this for now.** Sub-pages have the sticky bar (which appears after 80% viewport scroll) as their mobile conversion path. The sticky bar has "Free Quote" and "Call" buttons. This is sufficient.
- **Add a compact mobile CTA to sub-pages later (Tier 3).** A single-line banner: "Ready to start? [Get a Quote]" — lighter than the full Footer CTA module.
- **Gate the hiding to homepage only.** This requires FooterSection to know which page it's on (pathname check). Since FooterSection is a server component, this would require either converting to client component (to use `usePathname()`) or passing a prop from PublicChrome. This is more complex than the current fix.

**Recommendation:** Accept the sub-page CTA gap for now. The sticky bar covers mobile conversion on all pages. Add the compact sub-page CTA as a Tier 3 item.

### Rollback

Remove `hidden md:block` from the Footer CTA module container.

### Estimated Effort: 15 minutes

---

## 2.3 — "Discuss Your Project" → Full Button Treatment

**Priority:** High — single highest-impact small change for conversion on qualified traffic
**File:** `OfferAndIndustrySection.tsx`
**Desktop Safety:** 🟡 VERIFY — Change affects both viewports. The current text link style works on desktop as part of the hover interaction. A button might look different within the card hover state. Needs visual check.

### Context

"Discuss Your Project →" is the primary CTA for users who have self-identified as General Contractors, Property Managers, or Commercial Operators. These are the highest-qualified visitors on the page — they've scrolled through services, reached the persona section, found their specific card, read the pain point and fit criteria, and are now looking at the action step.

The current treatment is a text link with an arrow:

```tsx
<QuoteCTA className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A1628] transition-all duration-300 group-hover:gap-3 group-hover:text-[#2563EB]">
  Discuss Your Project
  <ArrowRight className="h-4 w-4 ..." />
</QuoteCTA>
```

This is the weakest CTA treatment on the entire page. It has no background, no border, no padding, no visual weight. A user scanning the card might not recognize it as clickable.

### The Fix

Replace the inline text-link styling with button styling. Use `cta-primary` (the dark filled button class used elsewhere) to match the "Get a Free Quote" buttons:

```tsx
// Before:
<QuoteCTA className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A1628] transition-all duration-300 group-hover:gap-3 group-hover:text-[#2563EB]">
  Discuss Your Project
  <ArrowRight className="h-4 w-4 ..." />
</QuoteCTA>

// After:
<QuoteCTA
  ctaId={`industry_${industry.title.toLowerCase().replace(/\s+/g, '_')}_discuss_project`}
  className="cta-primary mt-4 w-full justify-center gap-2 text-xs md:w-auto"
>
  Discuss Your Project
  <ArrowRight className="h-4 w-4" />
</QuoteCTA>
```

Breaking down the class choices:
- `cta-primary` — dark filled button (bg-[#0A1628], white text, uppercase tracking, rounded, shadow). Matches hero CTA, footer CTA, etc.
- `mt-4` — spacing from the content above (best-suited-for list)
- `w-full` on mobile — full-width button fills the card width, creating a strong tap target
- `md:w-auto` on desktop — button sizes to content, not full-width, which works better in the card layout
- `justify-center` — centers button text
- `gap-2` — space between text and arrow icon
- `text-xs` — `cta-primary` already sets text-xs, but being explicit ensures consistency

Also add a `ctaId` for analytics attribution. Each industry card should have a unique CTA identifier so we can track which persona drives the most quote requests.

### Verify the ArrowRight icon renders well at button scale

The current ArrowRight is `h-4 w-4` and styled for inline text link context. Inside `cta-primary`, the text is uppercase, bold, and tracked. Verify the arrow isn't too small. If it looks light, increase to `h-4.5 w-4.5` or add `stroke-[2]`.

### Desktop hover interaction consideration

Currently, when a card is hovered on desktop, the text link changes color (`group-hover:text-[#2563EB]`). With a `cta-primary` button, the hover effect would be the button's own hover (`hover:bg-[#162742] hover:-translate-y-0.5`). This should look fine — the card elevates, the button darkens. But verify visually that the button doesn't create too much visual weight within the card's hover state.

### Acceptance Criteria

1. Load homepage on mobile, scroll to Who We Serve section
2. View any persona card (General Contractors, Property Managers, Commercial)
3. **PASS:** "Discuss Your Project" appears as a dark filled button with white text, full-width on mobile
4. Button has minimum 44px touch height (inherited from `cta-primary`'s `min-h-[44px]`)
5. Tap the button
6. **PASS:** FloatingQuotePanel opens
7. **FAIL:** CTA still appears as a blue text link with arrow

Desktop check:
8. Hover over a persona card on desktop
9. **PASS:** Button is visible within the card, sized to content (`w-auto`), and has its own hover darkening effect
10. **PASS:** Card elevation/dimming effect still works with the button present

### Rollback

Revert the `className` to the original text-link styling.

### Estimated Effort: 20 minutes

---

## 2.4 — Relocate "Talk Through Your Scope" Below Persona Cards on Mobile

**Priority:** High — fixes premature CTA placement
**File:** `OfferAndIndustrySection.tsx`
**Desktop Safety:** 🟢 SAFE — Using CSS order utility means desktop layout (where the CTA sits beside the heading) is unaffected

### Context

"TALK THROUGH YOUR SCOPE →" appears in the section header area, in a `flex-col md:flex-row` layout with the heading. On desktop (`md:flex-row md:items-end md:justify-between`), it sits to the right of the heading — this works as a sidebar CTA that's always visible. On mobile (`flex-col`), it stacks below the subtitle but **above the three persona cards**.

On mobile, this asks the user to take action before they've seen the value proposition (the persona cards). The correct mobile flow is: heading → cards → CTA.

### The Fix

Use CSS `order` utilities to push the CTA to the end of the section on mobile while keeping it beside the heading on desktop.

**Option A: CSS Order (Recommended — least code change)**

Find the CTA wrapper in the header area:
```tsx
// Current structure (simplified):
<div className="flex flex-col md:flex-row md:items-end md:justify-between">
  <div> {/* Heading + subtitle */} </div>
  <QuoteCTA ...>Talk Through Your Scope →</QuoteCTA>  {/* This CTA */}
</div>
<div> {/* Three persona cards grid */} </div>
```

The problem is that the CTA and the cards are in different parent containers, so `order` within the header flex won't move the CTA below the cards.

**Better approach: Duplicate the CTA, show different instances per viewport.**

```tsx
// In the header area — desktop only:
<div className="hidden md:block">
  <QuoteCTA ctaId="industry_scope_cta_desktop" className="cta-primary ...">
    Talk Through Your Scope →
  </QuoteCTA>
</div>

// After the three persona cards — mobile only:
<div className="mt-8 text-center md:hidden">
  <p className="mb-3 text-sm text-slate-500">Not sure which fits your project?</p>
  <QuoteCTA ctaId="industry_scope_cta_mobile" className="cta-primary w-full justify-center gap-2">
    Talk Through Your Scope
    <ArrowRight className="h-4 w-4" />
  </QuoteCTA>
</div>
```

This approach:
- Desktop: CTA stays beside heading (current behavior, no change)
- Mobile: CTA appears after all three cards with a contextual intro line ("Not sure which fits?")
- The mobile version gets its own `ctaId` for analytics separation
- The intro line reframes the CTA as a fallback for users who didn't find their persona in the cards

**Why duplication over reordering:** The CTA is inside a flex header that also contains the heading and subtitle. The cards are siblings of this header. CSS `order` only works within the same flex container. To move the CTA below the cards, either:
1. Restructure the entire section layout (high risk, affects desktop)
2. Duplicate with viewport gating (low risk, clean separation)

Option 2 is preferred for safety.

### Acceptance Criteria

1. Load homepage on mobile, scroll to Who We Serve section
2. **PASS:** Section heading and subtitle appear. NO button between heading and first persona card.
3. Scroll past all three persona cards
4. **PASS:** Below the third card, "Not sure which fits your project?" text appears, followed by "Talk Through Your Scope" as a full-width dark button
5. Tap the button
6. **PASS:** FloatingQuotePanel opens
7. Load homepage on desktop
8. **PASS:** "Talk Through Your Scope" appears to the right of the section heading (current desktop position)
9. **FAIL:** CTA visible between heading and cards on mobile, or missing from desktop header area

### Rollback

Remove the duplicate mobile CTA block. Remove `hidden md:block` from the original CTA wrapper.

### Estimated Effort: 25 minutes

---

## 2.5 — Show Outcome Text on Mobile in Persona Cards

**Priority:** High — restores the persuasion arc (problem → solution → CTA)
**File:** `OfferAndIndustrySection.tsx`
**Desktop Safety:** 🟢 SAFE — removing `hidden md:flex` makes the element visible on all viewports, but desktop already shows it

### Context

Each persona card has an `outcome` block that describes how A&A solves the persona's pain point. For example:
- GC card pain: "Punch-list pressure and inconsistent final-clean quality across trades can slow handoff"
- GC card outcome: "A&A helps tighten the final presentation with detail-focused cleaning and proof-of-completion support"

The outcome block is hidden on mobile:
```tsx
<div className="hidden md:flex items-start gap-3 rounded-xl border-l-4 ... p-4">
  {/* outcome text */}
</div>
```

Mobile users see the pain point (what's wrong) but not the outcome (how A&A fixes it). The persuasion arc is: Problem → ??? → CTA. The solution step is missing.

### The Fix

Remove `hidden md:flex` and replace with `flex`:

```tsx
// Before:
<div className="hidden md:flex items-start gap-3 rounded-xl border-l-4 ... p-4">

// After:
<div className="flex items-start gap-3 rounded-xl border-l-4 ... p-4">
```

### Mobile sizing consideration

On desktop, the outcome block has ample horizontal space within the card. On mobile, the card is full-width (~350-370px usable). The outcome block has `border-l-4` + `p-4` + internal text. At mobile width, this should render fine — the text will wrap naturally within the card's width. But verify that the accent border color + background color combination is readable at mobile contrast levels.

The outcome text itself may be 2-3 lines on desktop but 4-5 lines on mobile due to narrower width. This adds approximately **60-80px per card** (3 cards × ~70px = ~210px total). This is scroll cost, but it's justified — these 210px restore the most persuasive element missing from the mobile persona cards. The persuasion arc (problem → solution → CTA) is worth the scroll.

### Verify the outcome block's internal structure works at mobile width

The outcome block likely contains:
- An accent icon or quote mark on the left
- The outcome text paragraph on the right

At mobile width with `p-4` padding, the content area is approximately 320px. If there's a left-aligned icon, it takes ~24px + gap, leaving ~280px for text. This is sufficient for readable text wrapping.

If the icon makes the layout feel cramped at mobile width, consider hiding only the icon on mobile:
```tsx
<div className="hidden md:block"> {/* icon */} </div>
```

This keeps the outcome text visible while simplifying the mobile layout.

### Acceptance Criteria

1. Load homepage on mobile, scroll to Who We Serve section
2. View the General Contractors card
3. **PASS:** Below the pain point text, an outcome block is visible with colored left border accent. Text describes how A&A solves the GC's problem.
4. Check all three cards — each should show its outcome text
5. **PASS:** All three cards show outcome text on mobile
6. **FAIL:** Outcome block still hidden on mobile (only visible on desktop)

### Estimated Height Impact

Before: ~1,200px for three cards (without outcomes)
After: ~1,410px for three cards (with outcomes)
Net cost: ~210px — justified by completing the persuasion arc on every card.

### Rollback

Re-add `hidden md:flex` to replace `flex` on the outcome block.

### Estimated Effort: 15 minutes

---

## 2.6 — Auto-Expand First Service in Accordion

**Priority:** Significant — eliminates decision paralysis on the most important content section
**File:** `ServiceSpreadSection.tsx`
**Desktop Safety:** 🟢 SAFE — `MobileServiceAccordion` is a completely separate component from the desktop `ServiceSpreadItem` rendering. The mobile accordion is wrapped in `md:hidden`. Zero desktop impact.

### Context

The accordion code initializes with the first service expanded:

```tsx
const [openService, setOpenService] = useState<string>(services[0]?.anchor ?? "");
```

This should auto-expand Post-Construction Clean on load. However, the screenshots showed all services collapsed. Possible causes:

1. The `hashchange` useEffect runs on mount and resets the state if the URL hash doesn't match a service anchor
2. A parent re-render causes the component to re-mount with a different initial state
3. The screenshot was captured after user interaction

Looking at the useEffect:
```tsx
useEffect(() => {
  const syncWithHash = () => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && services.some((service) => service.anchor === hash)) {
      setOpenService(hash);
    }
  };
  syncWithHash();
  window.addEventListener("hashchange", syncWithHash);
  return () => window.removeEventListener("hashchange", syncWithHash);
}, []);
```

The `if` condition requires the hash to exist AND match a service anchor. If the URL has no hash or a non-matching hash (like `#services` from menu navigation), the condition fails and `openService` remains at its initial value (`services[0]?.anchor`). **The initial state should be correct.**

### The Verification Fix

The auto-expand may already work. But to guarantee it and make the intent explicit, add a defensive check:

```tsx
const [openService, setOpenService] = useState<string>(services[0]?.anchor ?? "");

// Add this effect to ensure first service is expanded after mount,
// even if some other effect temporarily clears the state:
useEffect(() => {
  // Only set default if nothing is currently open and no hash override exists
  if (!openService && !window.location.hash.replace(/^#/, "")) {
    setOpenService(services[0]?.anchor ?? "");
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Run once on mount
```

Actually, this adds unnecessary complexity. The `useState` initializer should be sufficient. The real fix is to **verify and document** the expected behavior, not add more code.

### The Real Fix: Verify and Add Analytics

Instead of adding defensive code, let's:

1. **Confirm the initial state works** by testing on a clean URL (no hash)
2. **Add accordion expand tracking** (this also serves item 2.7 below)

If testing confirms the auto-expand doesn't work on a clean URL, then we need to investigate the component lifecycle more deeply (parent re-mounting, Suspense boundaries, etc.).

### Acceptance Criteria

1. Navigate to the homepage via direct URL (no hash fragment): `https://site.com/`
2. Scroll to the Services section
3. **PASS:** The first service (Post-Construction Clean) is expanded, showing its image, description, bullet points, and "Quote This Service" CTA
4. The remaining four services are collapsed, showing only their headers
5. Navigate via menu: tap hamburger → tap "Services" (which links to `/#services`)
6. Scroll to the Services section
7. **PASS:** First service is still expanded (the hash `#services` doesn't match any individual service anchor, so the default applies)
8. Navigate via menu service sub-item: tap "Post-Construction" (which links to `/#service-post-construction`)
9. **PASS:** Post-Construction is expanded (hash match)
10. **FAIL:** All five services collapsed on any of the above scenarios

### Rollback

N/A — this is a verification item. If the auto-expand is broken, a deeper investigation is needed.

### Estimated Effort: 30 minutes (testing across navigation paths)

---

## 2.7 — Add Accordion Expand Tracking Event

**Priority:** Significant — unblocks the §15.6 acceptance target "accordion expand interactions on mobile reach at least 35% of service-section viewers"
**File:** `ServiceSpreadSection.tsx`
**Desktop Safety:** 🟢 SAFE — `MobileServiceAccordion` is mobile-only

### Context

The Services accordion is the primary new mobile interaction pattern. §15.6 requires measuring whether at least 35% of users who view the services section interact with the accordion. Currently, there's no event tracking for accordion expansion.

### The Fix

In `MobileServiceAccordion`, the expand/collapse handler is the `setOpenService` call triggered by button clicks. Add tracking at this interaction point:

```tsx
// Find the accordion header button's onClick handler.
// Currently something like:
<button
  onClick={() => setOpenService(isOpen ? "" : service.anchor)}
  aria-expanded={isOpen}
  aria-controls={panelId}
  // ...
>
```

Wrap the state change with an analytics event:

```tsx
<button
  onClick={() => {
    const willOpen = !isOpen;
    setOpenService(willOpen ? service.anchor : "");
    
    if (willOpen) {
      void trackConversionEvent({
        eventName: "accordion_service_expanded",
        source: "mobile_service_accordion",
        metadata: {
          service_anchor: service.anchor,
          service_title: service.titleLines.join(" "),
          position: service.index,
        },
      });
    }
  }}
  aria-expanded={isOpen}
  aria-controls={panelId}
>
```

**Only track expansions, not collapses.** Collapse events add noise without insight. The valuable signal is "which services do users want to learn more about?"

### Import requirement

If `trackConversionEvent` isn't already imported in this file, add:

```tsx
import { trackConversionEvent } from "@/lib/analytics";
```

Since `MobileServiceAccordion` is defined inside `ServiceSpreadSection.tsx`, the import goes at the top of the file. It may already be imported if other tracking exists in the desktop component.

### Measuring the §15.6 target

With this event plus the existing `section_view` event for the services section, we can calculate:

```
Accordion interaction rate = 
  (Unique users who fired accordion_service_expanded) / 
  (Unique users who fired section_view for #services)
```

Target: ≥ 35%

If the rate is below 35%, possible interventions:
- Auto-expand first service (2.6) draws attention to the accordion pattern
- Add a visual hint ("Tap to explore ↓") near collapsed headers
- Featured badge on one service creates a target for tap

### Acceptance Criteria

1. On mobile, expand any accordion service
2. Check analytics events
3. **PASS:** `accordion_service_expanded` event fires with correct `service_anchor`, `service_title`, and `position`
4. Collapse the same service
5. **PASS:** No event fires on collapse
6. Expand a different service
7. **PASS:** New `accordion_service_expanded` event fires with the new service's data
8. **FAIL:** No events fire on expand, or events fire on collapse

### Rollback

Remove the `trackConversionEvent` call from the onClick handler.

### Estimated Effort: 15 minutes

---

## 2.8 — Authority Bar Headline Change

**Priority:** Moderate — replaces generic copy with specific brand positioning
**File:** `AuthorityBar.tsx`
**Desktop Safety:** 🔴 CHANGES DESKTOP — headline is shared across viewports. Intentional copy improvement.

### Context

Current headline:
```tsx
<h2 id="authority-heading" className="...">Our Numbers Speak</h2>
```

"Our Numbers Speak" is generic — every service business with a stats section uses this or similar ("By the Numbers," "Our Track Record," etc.). It says nothing about A&A, Austin, or cleaning. The numbers themselves are the headline.

### The Fix

```tsx
// Before:
<h2 id="authority-heading" className="mt-2 font-serif text-2xl tracking-tight text-[#0A1628] md:mt-3 md:text-5xl">
  Our Numbers Speak
</h2>

// After:
<h2 id="authority-heading" className="mt-2 font-serif text-2xl tracking-tight text-[#0A1628] md:mt-3 md:text-5xl">
  15+ Years. 500+ Spaces. Austin&apos;s Standard.
</h2>
```

This headline:
- **Contains the proof** — the numbers ARE the headline, not introduced by a generic phrase
- **Names the market** — "Austin" grounds the claim geographically
- **Asserts position** — "Standard" is a brand claim, not a description
- **Matches the brand line** — "The A&A Standard" is used in Before/After section; "Austin's Standard" reinforces it

### Also update the section kicker

```tsx
// Before:
<p className="section-kicker">Track Record</p>

// After:
<p className="section-kicker">The A&A Standard</p>
```

This creates brand consistency: the Before/After section already uses "The A&A Standard" as its kicker. Using it here too creates a recurring brand motif.

### Acceptance Criteria

1. Load homepage, scroll to Authority Bar
2. **PASS:** Headline reads "15+ Years. 500+ Spaces. Austin's Standard."
3. **PASS:** Kicker reads "The A&A Standard"
4. **FAIL:** "Our Numbers Speak" or "Track Record" still visible

### Rollback

Revert both text strings.

### Estimated Effort: 5 minutes

---

## 2.9 — Fix "100% On-Time Handoff Focus" Hedge Language

**Priority:** Moderate — removes language that undermines a credibility claim
**File:** `AuthorityBar.tsx`
**Desktop Safety:** 🔴 CHANGES DESKTOP — shared data. Intentional copy fix.

### Context

```tsx
{ target: 100, suffix: "%", label: "On-Time", detail: "handoff focus" }
```

"100% On-Time Handoff Focus" claims 100% while hedging with "focus." This reads as either dishonest (claiming 100% but admitting it's aspirational) or confusing (what does "100% focus" mean?). The counter animates to "100%" which is a strong visual claim — "focus" as the qualifier undermines it.

### The Fix — Two Options

**Option A: If the 100% on-time rate is real and defensible:**
```tsx
{ target: 100, suffix: "%", label: "On-Time", detail: "handoff rate" }
```

"100% On-Time Handoff Rate" is a concrete, verifiable claim. If A&A has data showing 100% on-time completion (or close enough to round), this is the strongest version.

**Option B: If 100% is aspirational, not actual:**
```tsx
{ target: 0, suffix: "", label: "Zero-Delay", detail: "handoff commitment" }
```

Remove the misleading percentage entirely. "Zero-Delay Handoff Commitment" is a promise, not a statistic. The counter would need to be replaced with a static text display since animating to "0" isn't meaningful.

Actually, Option B requires changing the rendering logic (the counter component expects a number to animate to). Simpler alternative for Option B:

```tsx
{ target: 100, suffix: "%", label: "Committed", detail: "to on-time handoffs" }
```

"100% Committed to On-Time Handoffs" reads as a promise, not a fake statistic.

**Recommendation:** Ask the business owner — is 100% on-time real? If yes, Option A. If not, Option B.

### Acceptance Criteria

1. Load homepage, scroll to Authority Bar
2. View the third stat (currently "100% On-Time Handoff Focus")
3. **PASS:** Text reads either "100% On-Time Handoff Rate" (Option A) or "100% Committed to On-Time Handoffs" (Option B). No "focus" hedge word.
4. **FAIL:** "Focus" still present

### Rollback

Revert the `detail` string value.

### Estimated Effort: 5 minutes

---

## 2.10 — Trim Licensed & Insured Card Detail Text

**Priority:** Low-Moderate — reduces visual overflow on mobile
**File:** `AuthorityBar.tsx`
**Desktop Safety:** 🔴 CHANGES DESKTOP — shared data. Desktop has more room so shorter text is also fine.

### Context

The Licensed & Insured stat card has:
```
Licensed & Insured
AUSTIN STANDARDS
READY FOR COMMERCIAL AND SITE WORK
```

On mobile at 2-column grid width (~170px per cell), "READY FOR COMMERCIAL AND SITE WORK" in 10px uppercase tracked text wraps across 3-4 lines. This makes the Licensed & Insured cell visually heavier than its numeric neighbors, creating an imbalanced grid.

### The Fix

```tsx
// Before:
const staticStat = { title: "Licensed", subtitle: "& Insured", detail: "ready for commercial and site work" };

// After:
const staticStat = { title: "Licensed", subtitle: "& Insured", detail: "fully credentialed for commercial sites" };
```

"Fully credentialed for commercial sites" is shorter (fewer characters), communicates the same idea, and uses "credentialed" (which is more professional than "ready for").

Alternatively, even shorter:
```tsx
detail: "commercial & construction certified"
```

### Also consider removing the "AUSTIN STANDARDS" line

The "AUSTIN STANDARDS" text that sits between "Licensed & Insured" and the detail line is an additional descriptor that adds no information. Austin is already mentioned in the headline (per 2.8) and in the hero subtitle. This line can be removed:

```tsx
// Find and remove or hide the Austin Standards text:
// <div className="text-[9px] font-medium uppercase tracking-[0.22em] text-slate-600 md:text-[10px]">Austin Standards</div>

// Either delete the element or hide on mobile:
<div className="hidden md:block text-[9px] font-medium uppercase tracking-[0.22em] text-slate-600 md:text-[10px]">Austin Standards</div>
```

### Acceptance Criteria

1. Load homepage on mobile, scroll to Authority Bar
2. View the Licensed & Insured card in the 2×2 grid
3. **PASS:** Detail text is shorter, fits within 1-2 lines at mobile cell width. Card height is roughly equal to its neighboring stat cells.
4. **FAIL:** Multi-line overflow still present, card significantly taller than neighbors

### Rollback

Revert the `detail` string and restore "Austin Standards" visibility.

### Estimated Effort: 10 minutes

---

## 2.11 — Add Star Rating Count to Authority Bar Capsule

**Priority:** Moderate — volume credibility signal
**File:** `AuthorityBar.tsx`
**Desktop Safety:** 🔴 CHANGES DESKTOP — shared element. Improvement is all-viewport.

### Context

Current:
```tsx
<span className="text-sm tracking-[0.22em] text-[#C9A94E]">★★★★★</span>
<span className="font-light">Trusted across Austin-area job sites, office spaces, and turnovers.</span>
```

Stars without a count could mean 5 reviews or 500. A GC who's evaluating cleaning subcontractors wants to know volume. "★★★★★ from 200+ project reviews" is significantly more persuasive.

### The Fix

```tsx
// Before:
<span className="font-light">Trusted across Austin-area job sites, office spaces, and turnovers.</span>

// After:
<span className="font-light">
  Rated 5 stars across 200+ completed projects
</span>
```

The number (200+) should be defensible — if A&A has 500+ projects (per the stat above), "200+ reviews" is conservative and credible. If the actual review count is different, use the real number.

**Alternative if review count is unknown or low:**
```tsx
<span className="font-light">
  5-star rated by Austin contractors and property teams
</span>
```

This removes the count but adds audience specificity. Less powerful than a count, but better than the current generic "trusted across..." language.

### Acceptance Criteria

1. Load homepage, scroll to Authority Bar
2. View the star rating capsule below the stat grid
3. **PASS:** Stars are accompanied by a count or specific audience. Not "Trusted across Austin-area job sites, office spaces, and turnovers."
4. **FAIL:** Generic trust language still present

### Rollback

Revert the span text content.

### Estimated Effort: 5 minutes

---

## 2.12 — Remove City Pill Links from Service Area Section

**Priority:** Moderate — eliminates duplicate navigation and removes links to decommission-target pages
**File:** `ServiceAreaSection.tsx`
**Desktop Safety:** 🟡 VERIFY — Pills render on all viewports. Removal affects desktop too. Desktop has the SVG map + city cards as the primary affordance, so pills are redundant there as well.

### Context

The Service Area section has three navigation affordances for cities on mobile:
1. 10 city info cards (2-column grid) — non-interactive divs showing name + distance
2. 6 city pill links — `<Link>` elements to `/service-area/[slug]`
3. Region legend (3 colored dots) — decorative

The pills are a subset of the city cards (6 of 10 cities). They link to `/service-area/[slug]` pages which §16.4 originally said to decommission. After reviewing the actual content in `service-areas.ts`, those pages have substantial local SEO content and should be kept — but the homepage pills that deep-link to them are redundant when the city cards already display the same information.

Additionally, the pills array is hardcoded inline, duplicating data that exists in the `HOMEPAGE_SERVICE_AREA_LINKS` export from `service-areas.ts`.

### The Fix

Remove the city pills section from the JSX. Find the block that renders the pill links:

```tsx
// REMOVE this entire block:
<div className="mt-4 flex flex-wrap gap-2">
  {[
    { name: "Round Rock", href: "/service-area/round-rock" },
    { name: "Georgetown", href: "/service-area/georgetown" },
    { name: "Pflugerville", href: "/service-area/pflugerville" },
    { name: "Buda", href: "/service-area/buda" },
    { name: "Kyle", href: "/service-area/kyle" },
    { name: "San Marcos", href: "/service-area/san-marcos" },
  ].map((city) => (
    <Link key={city.name} href={city.href} className="...">
      {city.name}
    </Link>
  ))}
</div>
```

### Also remove the region legend on mobile

The three colored dots (North/Central/South) at 10px text are decorative and add no decision value at mobile size. They're useful on desktop where they correspond to the SVG map's color coding.

```tsx
// Before:
<div className="mt-4 flex items-center gap-5 md:mt-6">
  {Object.entries(regionMeta).map(...)}
</div>

// After:
<div className="mt-4 hidden items-center gap-5 md:mt-6 md:flex">
  {Object.entries(regionMeta).map(...)}
</div>
```

Changed `flex` to `hidden` and added `md:flex` — visible on desktop, hidden on mobile.

### Scroll Savings

- Pills removal: ~50px
- Legend hide on mobile: ~30px
- Total: ~80px

Small savings, but the clarity gain is more important than the scroll savings. One navigation pattern instead of three.

### Acceptance Criteria

1. Load homepage on mobile, scroll to Where We Work section
2. **PASS:** City info cards are visible in a 2-column grid (names + distances). No pill-style links below them. No colored dot legend.
3. Load homepage on desktop
4. **PASS:** SVG map is visible. City cards are visible. Region legend dots are visible. No pill links.
5. Navigate to `/service-area/round-rock` directly
6. **PASS:** Page loads correctly (we're NOT removing the pages, just the homepage links to them)
7. **FAIL:** Pills still visible on mobile, or legend still visible on mobile, or /service-area/[slug] pages are broken

### Rollback

Re-add the pills JSX block. Change legend `hidden md:flex` back to `flex`.

### Estimated Effort: 15 minutes

---

## 2.13 — Testimonial Section Headline Change

**Priority:** Moderate — better social proof framing
**File:** `TestimonialSection.tsx`
**Desktop Safety:** 🔴 CHANGES DESKTOP — shared text. Intentional improvement.

### The Fix

```tsx
// Before:
<p className="section-kicker !text-slate-300">Client Feedback</p>
<h2 className="mt-3 font-serif text-2xl tracking-tight text-white md:text-5xl">
  What Clients Say
</h2>

// After:
<p className="section-kicker !text-slate-300">Verified Results</p>
<h2 className="mt-3 font-serif text-2xl tracking-tight text-white md:text-5xl">
  Trusted by Austin&apos;s Toughest Projects
</h2>
```

"Trusted by Austin's Toughest Projects" does three things:
1. Names the market (Austin)
2. Implies the clients are demanding (toughest projects)
3. Positions A&A as the company that passes high standards

The kicker "Verified Results" connects this section to the Before/After section above, creating a thematic through-line of proof.

### Acceptance Criteria

1. Scroll to testimonials section
2. **PASS:** Headline reads "Trusted by Austin's Toughest Projects," kicker reads "Verified Results"
3. **FAIL:** "What Clients Say" or "Client Feedback" still present

### Rollback

Revert both text strings.

### Estimated Effort: 5 minutes

---

## 2.14 — Add Testimonial Count Indicator

**Priority:** Moderate — volume credibility
**File:** `TestimonialSection.tsx`
**Desktop Safety:** 🔴 CHANGES DESKTOP — shared element

### The Fix

Near the dot indicators, add a text count:

```tsx
// Find the navigation dots area. After or near the dots, add:
<p className="mt-2 text-center text-xs text-slate-400">
  {active + 1} of {testimonials.length} reviews
</p>
```

This tells users:
- "1 of 4 reviews" — there are more than one
- The dots already serve as navigation, but the text confirms volume explicitly

### Also surface the orphaned `timeframe` field

Each testimonial has a `timeframe` field that's never rendered:
```tsx
{ timeframe: "Multi-year Partner" }  // Marcus Torres
{ timeframe: "Repeat Work" }          // etc.
```

Add this as a badge or qualifier near the attribution:

```tsx
// In the testimonial card, near the name/role:
{testimonial.timeframe && (
  <span className="mt-1 inline-block rounded-full bg-white/10 px-3 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300">
    {testimonial.timeframe}
  </span>
)}
```

"Multi-year Partner" next to Marcus Torres's name transforms the quote from a one-off review into evidence of a sustained professional relationship. This is significantly more persuasive for GCs evaluating a subcontractor.

### Acceptance Criteria

1. Scroll to testimonials section
2. **PASS:** "1 of 4 reviews" text visible below navigation dots
3. **PASS:** Testimonial card shows a timeframe badge (e.g., "Multi-year Partner")
4. Swipe to next testimonial
5. **PASS:** Count updates to "2 of 4 reviews." New testimonial shows its timeframe badge.
6. **FAIL:** No count text, or timeframe badges missing

### Rollback

Remove the `<p>` count element and the timeframe `<span>`.

### Estimated Effort: 20 minutes

---

## 2.15 — Increase Mobile Menu Backdrop Opacity

**Priority:** Low-Moderate — fixes content bleed-through behind menu
**File:** `PublicHeader.tsx`
**Desktop Safety:** 🟢 SAFE — mobile menu is `md:hidden`

### Context

The menu backdrop uses `bg-black/55` (55% opacity). On sections with light backgrounds, page content is visible through the backdrop, creating visual noise and reducing focus on the menu content.

### The Fix

```tsx
// Before:
<button
  type="button"
  aria-label="Close mobile navigation"
  className="fixed inset-0 bg-black/55"
  onClick={closeMobileMenu}
/>

// After:
<button
  type="button"
  aria-label="Close mobile navigation"
  className="fixed inset-0 bg-black/70"
  onClick={closeMobileMenu}
/>
```

`bg-black/70` (70% opacity) is dark enough to obscure page content while still being visually distinguishable from a solid black background. This is the standard range for modal backdrops (60-75%).

### Acceptance Criteria

1. Open hamburger menu on mobile while viewing a light-background section (e.g., What's Included)
2. **PASS:** Backdrop is dark enough that underlying page text is not readable through it
3. **PASS:** Backdrop is not fully opaque — slight transparency creates depth
4. Tap the backdrop
5. **PASS:** Menu closes
6. **FAIL:** Page content clearly readable through backdrop

### Rollback

Change `bg-black/70` back to `bg-black/55`.

### Estimated Effort: 5 minutes

---

## 2.16 — Add Subtitle Text Shadow to Hero

**Priority:** Low-Moderate — fixes contrast readability
**File:** `HeroSection.tsx`
**Desktop Safety:** 🟡 VERIFY — Change affects all viewports. Desktop hero also shows the subtitle, so the text shadow applies everywhere. Should look fine or better on desktop.

### Context

The subtitle already has a drop-shadow:
```tsx
className="... drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] ..."
```

But screenshots show contrast strain against the dark hallway image, particularly in the mid-hero zone where the gradient overlay is at ~42% opacity. The current shadow is light (`0.5` opacity, `3px` blur). A stronger shadow is needed.

### The Fix

```tsx
// Before:
drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]

// After:
drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]
```

Changes:
- Offset: `1px` → `2px` (slightly more lift)
- Blur: `3px` → `6px` (wider shadow spread)
- Opacity: `0.5` → `0.7` (darker shadow)

This creates a stronger text-background separation without adding a heavy visual effect.

### Alternative: Semi-transparent backdrop strip

If the text shadow isn't enough, add a semi-transparent dark strip behind the subtitle:

```tsx
<p className="relative inline-block rounded-md bg-black/20 px-3 py-1 ... drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
  Post-construction & commercial cleaning across the Austin metro area.
</p>
```

`bg-black/20` (20% black) + `rounded-md` + `px-3 py-1` creates a subtle dark pill behind the text. This is more reliable than shadow alone because it creates a consistent background regardless of the image content behind it.

**Recommendation:** Try the stronger shadow first. If insufficient, add the backdrop strip.

### Acceptance Criteria

1. Load homepage on mobile
2. View the hero subtitle ("Post-construction & commercial cleaning across the Austin metro area")
3. **PASS:** Text is clearly legible without straining, even against the brightest areas of the hero image
4. **PASS:** Shadow/backdrop doesn't look heavy or out of place with the hero's visual style
5. **FAIL:** Text still straining against image background

### Rollback

Revert the `drop-shadow` value to the original.

### Estimated Effort: 10 minutes

---

## Batch 2 Summary

| Item | Change | Effort | Desktop Impact |
|---|---|---|---|
| 2.1 | Remove CareersSection from homepage | 20 min | 🔴 Intentional |
| 2.2 | Hide Footer CTA on mobile | 15 min | 🟢 Safe |
| 2.3 | "Discuss Your Project" → button | 20 min | 🟡 Verify |
| 2.4 | Relocate "Talk Through Your Scope" on mobile | 25 min | 🟢 Safe |
| 2.5 | Show outcome text on mobile | 15 min | 🟢 Safe |
| 2.6 | Verify/confirm auto-expand first service | 30 min | 🟢 Safe |
| 2.7 | Add accordion expand tracking | 15 min | 🟢 Safe |
| 2.8 | Authority Bar headline change | 5 min | 🔴 Intentional |
| 2.9 | Fix "On-Time Handoff Focus" | 5 min | 🔴 Intentional |
| 2.10 | Trim Licensed & Insured detail text | 10 min | 🔴 Intentional |
| 2.11 | Add star rating count | 5 min | 🔴 Intentional |
| 2.12 | Remove city pills + hide legend on mobile | 15 min | 🟡 Verify |
| 2.13 | Testimonial headline change | 5 min | 🔴 Intentional |
| 2.14 | Add testimonial count + surface timeframe | 20 min | 🔴 Intentional |
| 2.15 | Increase menu backdrop opacity | 5 min | 🟢 Safe |
| 2.16 | Hero subtitle text shadow | 10 min | 🟡 Verify |

**Total Batch 2 effort: ~3.5 hours**
**Scroll savings from Batch 2: ~1,030px** (650 from careers + 300 from footer CTA hide + 80 from pills/legend)

### Dependencies within Batch 2

- **2.2 depends on 2.1** — hiding footer CTA only makes sense after removing careers. Ship together or 2.1 first.
- **2.4 depends on 2.3** — the relocated CTA should use the same button treatment as the "Discuss Your Project" fix. Ship together.
- **All others are independent** — can ship in any order.

### Recommended shipping order

1. **2.1 + 2.2** together (homepage composition cleanup — biggest scroll savings)
2. **2.3 + 2.4 + 2.5** together (Who We Serve fixes — three changes in one file)
3. **2.6 + 2.7** together (accordion verification + tracking — same file)
4. **2.8 + 2.9 + 2.10 + 2.11** together (Authority Bar text fixes — same file)
5. **2.13 + 2.14** together (Testimonial improvements — same file)
6. **2.12** standalone (Service Area cleanup)
7. **2.15 + 2.16** together (minor visual fixes)

---

Ready for Batch 3 (Hero Default, Context Threading, and Component Refactors)?

# BATCH 3: Component Refactors — Hero, Context Threading, Timeline, Accessibility

**These items require changes across multiple files or meaningful component logic changes. Each is still a bounded task (2-4 hours), but they touch interaction patterns, state management, or cross-component data flow. More careful QA than Batch 2.**

---

## 3.1 — Make 75svh the Default Hero Height on Mobile

**Priority:** High — eliminates ~250px of dead zone, the single worst UX moment on the page
**Files:** `HeroSection.tsx`
**Desktop Safety:** 🟢 SAFE — Compact variant already uses `md:min-h-[100svh]` for desktop. Desktop is always 100svh regardless of mobile variant.
**Scroll Savings:** ~200-300px mobile (depending on device viewport height)

### Context

The hero height system works via `getInitialHeroVariant()`:

```tsx
function getInitialHeroVariant(): boolean {
  if (typeof window === "undefined") return false; // SSR default: NOT compact
  
  const params = new URLSearchParams(window.location.search);
  const query = params.get("hero");
  if (query === "compact" || query === "75") return true;
  if (query === "default" || query === "100") return false;
  
  const stored = localStorage.getItem("hero_mobile_variant");
  if (stored === "compact") return true;
  if (stored === "default") return false;
  
  return false; // Final default: NOT compact
}
```

The function returns `false` (100svh) by default. Compact (75svh) only activates via `?hero=compact` URL parameter or `localStorage` override. This means 100% of organic traffic gets 100svh with its ~400px dead zone.

The hero content (headline + subtitle + 2 CTAs + trust pills) occupies roughly 350-400px. Inside a 100svh container (~850px on an average phone), `justify-center` places this content in the middle, creating ~225px of dead space above and below. With 75svh (~640px), the dead space shrinks to ~120px above and below — still breathing room, but not a wasteland.

### The Fix

Change the default return value from `false` to `true`:

```tsx
function getInitialHeroVariant(): boolean {
  if (typeof window === "undefined") return true; // SSR default: compact ← CHANGED
  
  const params = new URLSearchParams(window.location.search);
  const query = params.get("hero");
  if (query === "compact" || query === "75") return true;
  if (query === "default" || query === "100") return false;
  
  const stored = localStorage.getItem("hero_mobile_variant");
  if (stored === "compact") return true;
  if (stored === "default") return false;
  
  return true; // Final default: compact ← CHANGED
}
```

Two changes:
1. SSR default: `false` → `true` (prevents hydration mismatch — SSR and client both default to compact)
2. Final fallback: `false` → `true`

### Handling existing localStorage values

Users who previously visited the site may have `hero_mobile_variant: "default"` in localStorage (set by the A/B tracking). This would override the new default and keep them on 100svh.

**Options:**
- **Accept this.** Existing users keep their assigned variant. New users get 75svh. Over time, as localStorage expires or clears, everyone migrates to 75svh.
- **Clear the key.** Add a one-time migration that removes the localStorage key, forcing everyone to the new default. This breaks the A/B test for returning users.
- **Change the key name.** Instead of reading `hero_mobile_variant`, read `hero_mobile_variant_v2`. No one has this key, so everyone falls through to the new default. Old key data is ignored.

**Recommendation:** Option 3 (new key name). Cleanest migration, no data loss, no stale overrides:

```tsx
// Change these two lines:
const stored = localStorage.getItem("hero_mobile_variant_v2"); // was "hero_mobile_variant"

// And in the tracking code that SETS the variant:
localStorage.setItem("hero_mobile_variant_v2", variant); // was "hero_mobile_variant"
```

Also update `getHeroVariant()` in `useQuoteForm.ts` which reads this key for form metadata:

```tsx
// In useQuoteForm.ts getHeroVariant():
return window.localStorage.getItem("hero_mobile_variant_v2") ?? "compact"; // was "hero_mobile_variant" ?? "default"
```

Note the default also changes from `"default"` to `"compact"` to match the new baseline.

### Verify the height classes

The compact variant applies:
```tsx
min-h-[75svh] md:min-h-[100svh]
```

Mobile gets 75svh. Desktop gets 100svh. This is correct. The `md:min-h-[100svh]` override ensures desktop is never affected by the compact variant.

### A/B test inversion

Previously: default = 100svh, variant = 75svh. The test measured "does shrinking help?"

Now: default = 75svh, variant = 100svh (via `?hero=default` or `?hero=100`). The test measures "does expanding hurt?"

This inversion is intentional. The burden of proof should be on keeping the dead zone, not on removing it. If 100svh performs better in some metric, the URL parameter still allows testing it.

### Verify CLS is maintained

The `useState(getInitialHeroVariant)` pattern (synchronous initializer) was the CLS fix. Changing the return value doesn't affect the pattern — the value is still determined synchronously before first paint. No CLS regression expected.

But verify: if the SSR default (`true`) disagrees with the client default for some users (those with `hero_mobile_variant: "default"` in old localStorage), there's a brief flash where SSR renders compact, then client hydration switches to 100svh. **This is the exact CLS issue the original fix addressed.** With the key name change (Option 3), old localStorage values are ignored, so SSR and client agree on `true`. No flash.

### Acceptance Criteria

1. Navigate to homepage on mobile with clean browser state (no localStorage, no URL params)
2. **PASS:** Hero height is visibly shorter than full viewport. Trust pills are visible without scrolling past them (or close to fold). Dead zone below trust pills is minimal (~100-120px, not ~400px).
3. Navigate with `?hero=default` URL parameter
4. **PASS:** Hero expands to full viewport height (100svh). Dead zone returns.
5. Navigate with `?hero=compact` URL parameter
6. **PASS:** Hero is compact (75svh). Same as clean state.
7. Load on desktop (any state)
8. **PASS:** Hero is always full viewport height regardless of variant.
9. Open DevTools → Application → Local Storage
10. **PASS:** Key is `hero_mobile_variant_v2`, not `hero_mobile_variant`

### CLS verification:

11. Run Lighthouse on mobile
12. **PASS:** CLS score is not regressed from current baseline. Hero does not flash/resize during load.
13. **FAIL:** Visible layout shift during hero rendering

### Rollback

Revert both default returns to `false`. Revert localStorage key to `hero_mobile_variant`. Revert `useQuoteForm.ts` default to `"default"`.

### Estimated Effort: 1-1.5 hours (including localStorage migration and CLS verification)

---

## 3.2 — Service Type Context Threading Through Quote Funnel

**Priority:** Highest in this batch — single most impactful conversion architecture improvement
**Files:** 7 files + 1 new file
**Desktop Safety:** 🟢 SAFE — All changes are additive optional props. Desktop quote form (`QuoteSection`) uses `useQuoteForm` without `enableTwoStep` and is not triggered by QuoteCTA (it's an inline form). The context threading only flows through the floating panel path.

### Context

12 quote CTAs on the page. Zero context threading. Every CTA opens an identical blank form. A user who taps "Quote This Service →" on Post-Construction Clean after reading about the service opens a form with an empty "Service Type" dropdown and must re-declare their interest.

The analytics KNOW where the user came from (`ctaId` is tracked in `quote_panel_opened`). The form doesn't.

### Architecture Overview

The threading path:

```
User taps CTA on Post-Construction service
  → QuoteCTA receives serviceType="post_construction"
    → CTAButton calls openQuote({ serviceType: "post_construction" })
      → PublicChrome stores context in state, passes to FloatingQuotePanel
        → FloatingQuotePanel passes initialServiceType to useQuoteForm
          → useQuoteForm pre-selects "Post-Construction" in dropdown
            → User sees form with service already selected
```

### File 1 (New): `src/lib/service-type-map.ts`

Create this new file:

```tsx
/**
 * Maps service section anchors to quote form dropdown values.
 * 
 * Service data (ServiceSpreadSection) uses hyphenated anchors: "service-post-construction"
 * Form dropdowns use underscored values: "post_construction"
 * 
 * This map bridges the two naming conventions.
 */
export const SERVICE_ANCHOR_TO_FORM_VALUE: Record<string, string> = {
  "service-post-construction": "post_construction",
  "service-final-clean": "final_clean",
  "service-commercial": "commercial",
  "service-move": "move_in_out",
  "service-windows": "window",
};

/**
 * Maps industry card identifiers to their primary service type.
 * Used when a user clicks "Discuss Your Project" on a persona card.
 */
export const INDUSTRY_TO_SERVICE_TYPE: Record<string, string> = {
  "general-contractors": "post_construction",
  "property-managers": "final_clean",
  "commercial-operators": "commercial",
};
```

The second map (`INDUSTRY_TO_SERVICE_TYPE`) is a best-guess default. When a GC clicks "Discuss Your Project," we pre-select Post-Construction because that's the most common GC need. This can be refined based on analytics data showing which service each persona actually requests most.

### File 2: `QuoteContext.tsx`

```tsx
"use client";

import { createContext, useContext } from "react";

// NEW: Context payload type
export type QuoteOpenContext = {
  serviceType?: string;
  sourceCta?: string;
};

type QuoteContextValue = {
  openQuote: (context?: QuoteOpenContext) => void; // CHANGED: optional context parameter
};

export const QuoteContext = createContext<QuoteContextValue | null>(null);

export function useQuoteAction() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error("useQuoteAction must be used within a QuoteContext provider");
  }

  return context.openQuote; // Return type now includes optional context parameter
}
```

**Backward compatibility:** `openQuote()` with no arguments still works. All existing call sites continue to function without modification. Only call sites that want to pass context need updating.

### File 3: `PublicChrome.tsx`

Add state for quote context and thread it through:

```tsx
// Add import:
import { type QuoteOpenContext } from "./QuoteContext";

// In the component body, alongside existing isQuoteOpen state:
const [isQuoteOpen, setIsQuoteOpen] = useState(false);
const [quoteOpenContext, setQuoteOpenContext] = useState<QuoteOpenContext | undefined>(); // NEW

// Update the openQuote callback:
const openQuote = useCallback((context?: QuoteOpenContext) => {
  setQuoteOpenContext(context); // NEW: store context
  setIsQuoteOpen(true);

  void trackConversionEvent({
    eventName: "quote_open_clicked",
    metadata: {
      source: isSubPage ? "sub_page" : "public_page",
      service_type: context?.serviceType ?? undefined, // NEW: include in event
      source_cta: context?.sourceCta ?? undefined,     // NEW: include in event
    },
  });
}, [isSubPage]);

// Update the close handler to clear context:
const closeQuote = useCallback(() => {
  setIsQuoteOpen(false);
  setQuoteOpenContext(undefined); // NEW: clear context on close
}, []);

// Update the context provider value:
<QuoteContext.Provider value={{ openQuote }}>

// Update FloatingQuotePanel props:
<FloatingQuotePanel
  isOpen={isQuoteOpen}
  onClose={closeQuote}          // was: () => setIsQuoteOpen(false)
  initialServiceType={quoteOpenContext?.serviceType}  // NEW prop
/>
```

### File 4: `CTAButton.tsx`

Add optional `serviceType` prop and thread through to `openQuote`:

```tsx
type CTAButtonProps = {
  ctaId: string;
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  // variant?: "primary" | "secondary" | "outline" | "ghost"; // REMOVE dead prop (optional cleanup)
  actionType?: "quote" | "link" | "call" | "custom";
  style?: React.CSSProperties;
  serviceType?: string; // NEW
};

export function CTAButton({
  ctaId,
  children,
  className = "",
  href,
  onClick,
  actionType = "link",
  style,
  serviceType, // NEW: destructure
}: CTAButtonProps) {
  const openQuote = useQuoteAction();

  const handleClick = (e: React.MouseEvent) => {
    // 1. Fire analytics event
    void trackConversionEvent({
      eventName: "cta_click",
      metadata: {
        cta_id: ctaId,
        action_type: actionType,
        href: href || undefined,
        service_type: serviceType || undefined, // NEW: include in analytics
      },
    });

    // 2. Perform action
    if (actionType === "quote") {
      void trackConversionEvent({
        eventName: "quote_panel_opened",
        metadata: {
          source_cta_id: ctaId,
          action_type: actionType,
          service_type: serviceType || undefined, // NEW
        },
      });
      e.preventDefault();
      openQuote(serviceType ? { serviceType, sourceCta: ctaId } : undefined); // CHANGED: pass context
    }

    // 3. Call custom onClick if provided
    if (onClick) {
      onClick();
    }
  };

  // ... rest of component unchanged
}
```

### File 5: `QuoteCTA.tsx`

Add `serviceType` passthrough:

```tsx
type QuoteCTAProps = {
  ctaId?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  serviceType?: string; // NEW
};

export function QuoteCTA({
  ctaId = "unidentified_quote_trigger",
  children,
  className,
  style,
  serviceType, // NEW
}: QuoteCTAProps) {
  return (
    <CTAButton
      ctaId={ctaId}
      actionType="quote"
      className={className}
      style={style}
      serviceType={serviceType} // NEW: pass through
    >
      {children}
    </CTAButton>
  );
}
```

### File 6: `FloatingQuotePanel.tsx`

Accept and apply `initialServiceType`:

```tsx
type FloatingQuotePanelProps = {
  isOpen: boolean;
  onClose: () => void;
  initialServiceType?: string; // NEW
};

export function FloatingQuotePanel({
  isOpen,
  onClose,
  initialServiceType, // NEW
}: FloatingQuotePanelProps) {
  const {
    fields,
    setters,
    // ... other destructured values
  } = useQuoteForm({ source: "floating_quote_panel", enableTwoStep: true });

  // NEW: Pre-populate service type when panel opens with context
  useEffect(() => {
    if (isOpen && initialServiceType && !fields.serviceType) {
      setters.setServiceType(initialServiceType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialServiceType]);
  // Intentionally excluding fields.serviceType and setters from deps:
  // - fields.serviceType: we only want to set on open, not re-set when user changes it
  // - setters: stable reference from useState, but ESLint doesn't know that

  // ... rest of component unchanged
}
```

**Critical detail in the useEffect:** The condition `!fields.serviceType` ensures we only pre-populate if the field is currently empty. If a user closes the panel, changes their mind, and opens it from a different CTA, the new serviceType will apply because `onClose` resets the form (or the component remounts). But if they open, manually change the dropdown, close, and re-open from the same service — the manual selection should persist within the session.

Wait — does the form state reset when the panel closes? Looking at `useQuoteForm`: the state is local to the hook, which is local to the component. If FloatingQuotePanel unmounts on close, all state resets. If it stays mounted but hidden, state persists.

Looking at `PublicChrome.tsx`, the panel renders conditionally:
```tsx
{isQuoteOpen && <FloatingQuotePanel ... />}
```

If this pattern uses conditional rendering (component unmounts when closed), state resets on every close/open cycle. The `initialServiceType` will always apply on re-open because `fields.serviceType` starts empty.

If this pattern keeps the component mounted (CSS hidden), state persists and the `!fields.serviceType` guard prevents overwriting a user's selection.

**Either pattern works correctly with the guard condition.** The `!fields.serviceType` check handles both cases.

### File 7: `ServiceSpreadSection.tsx` — Call Site Updates

In `MobileServiceAccordion`, update each service's CTA:

```tsx
// Import the mapping:
import { SERVICE_ANCHOR_TO_FORM_VALUE } from "@/lib/service-type-map";

// In the accordion expanded content, where each service's QuoteCTA renders:
// Before:
<QuoteCTA
  ctaId={`service_${service.anchor}_quote_mobile`}
  className="cta-outline-dark mt-4 min-h-[48px] w-full justify-center gap-2"
>
  Quote This Service →
</QuoteCTA>

// After:
<QuoteCTA
  ctaId={`service_${service.anchor}_quote_mobile`}
  serviceType={SERVICE_ANCHOR_TO_FORM_VALUE[service.anchor]}
  className="cta-outline-dark mt-4 min-h-[48px] w-full justify-center gap-2"
>
  Quote This Service →
</QuoteCTA>
```

The only change is adding `serviceType={SERVICE_ANCHOR_TO_FORM_VALUE[service.anchor]}`. The mapping resolves `"service-post-construction"` → `"post_construction"`, which matches the `<option value="post_construction">` in the form dropdown.

### File 8: `OfferAndIndustrySection.tsx` — Call Site Updates

Update the "Discuss Your Project" CTAs on persona cards:

```tsx
// Import the mapping:
import { INDUSTRY_TO_SERVICE_TYPE } from "@/lib/service-type-map";

// Each persona card needs an identifier that maps to the INDUSTRY_TO_SERVICE_TYPE keys.
// If the industry data doesn't have a slug field, derive one from the title:
const industrySlug = industry.title.toLowerCase().replace(/\s+/g, "-");
// "General Contractors" → "general-contractors"
// "Property Managers" → "property-managers"
// "Commercial Operators" → "commercial-operators"

// Update the CTA:
// Before:
<QuoteCTA className="inline-flex items-center gap-2 ...">
  Discuss Your Project
  <ArrowRight ... />
</QuoteCTA>

// After (already has button treatment from 2.3):
<QuoteCTA
  ctaId={`industry_${industrySlug}_discuss_project`}
  serviceType={INDUSTRY_TO_SERVICE_TYPE[industrySlug]}
  className="cta-primary mt-4 w-full justify-center gap-2 text-xs md:w-auto"
>
  Discuss Your Project
  <ArrowRight className="h-4 w-4" />
</QuoteCTA>
```

Also update the "Talk Through Your Scope" CTA (both desktop and mobile versions from 2.4). This CTA is generic (not tied to a specific persona), so it passes no serviceType:

```tsx
// "Talk Through Your Scope" — no serviceType (generic fallback CTA)
<QuoteCTA ctaId="industry_scope_cta_mobile" className="cta-primary w-full justify-center gap-2">
  Talk Through Your Scope
  <ArrowRight className="h-4 w-4" />
</QuoteCTA>
```

### Files NOT Changed (Backward Compatible)

These QuoteCTA call sites don't pass `serviceType` and continue to open a blank form. This is correct — they're generic conversion CTAs, not service-specific:

| Call Site | Why No Context |
|---|---|
| Hero "Get a Free Quote" | User hasn't expressed service preference yet |
| Sticky bar "Free Quote" | Generic always-available CTA |
| Header menu "Free Quote" | Generic navigation CTA |
| Service Area "Check Availability" | Geographic interest, not service-specific |
| MobileQuoteCloser "Get Your Free Quote" | Terminal catch-all CTA |
| Footer "Get Your Free Quote" (desktop) | Terminal catch-all CTA |
| ExitIntentOverlay "Get My Free Quote" | Catch-all retention CTA |

### End-to-End Test Scenario

1. Navigate to homepage on mobile
2. Scroll to Services accordion
3. Expand "Post-Construction Clean"
4. Tap "Quote This Service →"
5. **PASS:** FloatingQuotePanel opens. Service Type dropdown shows "Post-Construction" pre-selected.
6. Verify Step 1 fields: Name (empty), Phone (empty), Service Type (pre-selected to "Post-Construction")
7. **PASS:** User only needs to fill Name and Phone, then tap Continue
8. Close the panel without submitting
9. Scroll to Who We Serve → General Contractors card
10. Tap "Discuss Your Project"
11. **PASS:** FloatingQuotePanel opens. Service Type dropdown shows "Post-Construction" pre-selected (GC's default service).
12. Close the panel
13. Tap hero "Get a Free Quote"
14. **PASS:** FloatingQuotePanel opens. Service Type dropdown shows placeholder "Service Type" (no pre-selection — generic CTA).

### Analytics Verification

15. Check `quote_panel_opened` events
16. **PASS:** Events from service accordion include `service_type: "post_construction"` (or relevant value) and `source_cta_id: "service_service-post-construction_quote_mobile"`
17. **PASS:** Events from hero CTA include `service_type: undefined` and `source_cta_id: "hero_get_quote"`

### Regression Check

18. Complete a full form submission from a service CTA (Step 1 → Step 2 → success)
19. **PASS:** Form submits successfully. Redirect to /quote/success works. Service type is captured in the lead record.
20. Complete a full form submission from the hero CTA (no pre-selection)
21. **PASS:** Form submits successfully. User must manually select service type.

### Rollback

This is a multi-file change. Rollback by reverting all 7 changed files:
1. `QuoteContext.tsx` — remove `QuoteOpenContext` type, revert `openQuote` signature
2. `PublicChrome.tsx` — remove `quoteOpenContext` state, revert `openQuote` callback, remove `initialServiceType` prop from FloatingQuotePanel
3. `CTAButton.tsx` — remove `serviceType` prop and all references
4. `QuoteCTA.tsx` — remove `serviceType` prop and passthrough
5. `FloatingQuotePanel.tsx` — remove `initialServiceType` prop and useEffect
6. `ServiceSpreadSection.tsx` — remove `serviceType` from QuoteCTA calls, remove import
7. `OfferAndIndustrySection.tsx` — remove `serviceType` from QuoteCTA calls, remove import

Also delete `src/lib/service-type-map.ts`.

The `QuoteOpenContext` type export can stay if other files in future batches reference it, but for clean rollback, remove it.

### Estimated Effort: 3-4 hours (including testing across all CTA paths)

---

## 3.3 — Remove Timeline Intro Paragraph

**Priority:** Moderate — removes redundant content that restates the four steps
**File:** `TimelineSection.tsx`
**Desktop Safety:** 🔴 CHANGES DESKTOP — paragraph renders on both viewports. If desktop wants to keep it, gate removal with `hidden md:block`.
**Scroll Savings:** ~60px mobile

### Context

The intro paragraph:
```tsx
<p className="mx-auto mt-4 max-w-2xl text-sm font-normal leading-relaxed text-slate-600 md:font-light md:text-base">
  The workflow stays simple: rapid intake, clean scope alignment, disciplined execution, and a handoff that feels ready.
</p>
```

This literally summarizes the four step titles below:
- "rapid intake" = Step 1 "Request a Quote"
- "clean scope alignment" = Step 2 "We Assess"
- "disciplined execution" = Step 3 "We Clean"
- "handoff that feels ready" = Step 4 "You Walk Through"

It's a spoiler paragraph. The user reads a summary, then reads the full version. The full version is the valuable content. The summary adds nothing.

### The Fix

**Option A: Remove entirely (recommended for mobile, acceptable for desktop)**

```tsx
// DELETE the <p> element entirely
```

**Option B: Hide on mobile only (if desktop stakeholders want to keep it)**

```tsx
// Before:
<p className="mx-auto mt-4 max-w-2xl text-sm font-normal leading-relaxed text-slate-600 md:font-light md:text-base">

// After:
<p className="mx-auto mt-4 hidden max-w-2xl text-sm font-normal leading-relaxed text-slate-600 md:block md:font-light md:text-base">
```

Added `hidden` and `md:block` — invisible on mobile, visible on desktop.

**Recommendation:** Option A. The paragraph is equally redundant on desktop. Removing it on both viewports is cleaner.

### Acceptance Criteria

1. Load homepage, scroll to How It Works section
2. **PASS:** Section shows heading "How It Works" followed directly by Step 01. No summary paragraph between heading and first step.
3. **FAIL:** "The workflow stays simple..." paragraph still visible

### Rollback

Re-add the `<p>` element.

### Estimated Effort: 5 minutes

---

## 3.4 — Show Step Icons on Mobile in Timeline

**Priority:** Moderate — adds visual anchors to the mobile text wall
**File:** `TimelineSection.tsx`
**Desktop Safety:** 🟢 SAFE — icons are already visible on desktop. Removing the `hidden` class makes them visible on both, which is the desired state.

### Context

Each step has an icon component (`StepIcon`) that's hidden on mobile:

```tsx
<div className="hidden md:inline-flex items-center justify-center ...">
  <StepIcon ... />
</div>
```

On mobile, steps are pure text: large number → colored label → title → paragraph. Four identical text blocks create a wall with no visual relief. Adding icons gives each step a visual anchor and creates differentiation between blocks.

### The Fix

Remove `hidden md:inline-flex` and replace with `inline-flex`:

```tsx
// Before:
<div className="hidden md:inline-flex items-center justify-center h-12 w-12 rounded-xl bg-slate-100 text-slate-600">

// After:
<div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-slate-100 text-slate-600 md:h-12 md:w-12">
```

Changes:
- `hidden md:inline-flex` → `inline-flex` (visible on all viewports)
- `h-12 w-12` → `h-10 w-10 md:h-12 md:w-12` (slightly smaller on mobile to fit the narrower layout)

### Mobile layout consideration

Currently on mobile, each step renders as a vertical stack:

```
[Large Number]
[Colored Detail Label]
[Step Title]
[Body Paragraph]
```

With the icon, it should render as:

```
[Icon] [Large Number]
[Colored Detail Label]
[Step Title]
[Body Paragraph]
```

Or:

```
[Large Number]
[Icon] [Step Title]
[Body Paragraph]
```

The exact placement depends on the existing mobile flex/grid structure. The icon wrapper needs to be in a position that makes visual sense on mobile. If the desktop layout puts the icon in a side column that doesn't exist on mobile, simply showing it might cause layout issues.

**Check the step's mobile layout structure.** If each step is `flex-col` on mobile, the icon might need to be in the same row as the number or the title. If the icon is in a separate column that's `hidden md:flex`, then just removing `hidden` would place it as a block-level element above or below the text content.

**The safest approach:** Place the icon inline with the step number on mobile:

```tsx
<div className="flex items-center gap-3">
  <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-slate-100 text-slate-600 md:h-12 md:w-12">
    <StepIcon ... />
  </div>
  <span className="font-serif text-4xl ...">{step.number}</span>
</div>
```

This creates a compact icon + number row as the step header, followed by the detail label, title, and body. This adds ~8px of height (the icon is 40px, the number text is probably similar height) but provides a strong visual anchor.

### Acceptance Criteria

1. Load homepage on mobile, scroll to How It Works section
2. **PASS:** Each step has a visible icon (rounded square with SVG icon inside) alongside or near the step number
3. Icons are correctly sized for mobile (~40px)
4. **PASS:** Icons don't overflow the mobile width or cause horizontal scrolling
5. Load on desktop
6. **PASS:** Desktop icons remain in their current position and size (no regression)
7. **FAIL:** Icons still hidden on mobile, or icons break mobile layout

### Rollback

Re-add `hidden md:inline-flex` to replace `inline-flex` on the icon wrapper.

### Estimated Effort: 45 minutes (including layout verification)

---

## 3.5 — Add `inert` Attribute to Collapsed Accordion Panels

**Priority:** Moderate — accessibility fix preventing keyboard tab from reaching hidden content
**File:** `ServiceSpreadSection.tsx`
**Desktop Safety:** 🟢 SAFE — `MobileServiceAccordion` is mobile-only component

### Context

Collapsed accordion panels use CSS Grid animation (`grid-rows-[0fr]` + `opacity-0`) to visually hide content, and `aria-hidden="true"` to hide from screen readers. But keyboard tab navigation can still reach focusable elements (links, buttons) inside collapsed panels. This means a keyboard user tabbing through the page would tab into invisible content.

The `inert` attribute is the modern solution: it makes an element and all its children non-interactive and invisible to assistive technology. It's a single attribute that replaces `aria-hidden` + `tabIndex=-1` on all children.

### The Fix

Find the panel container element for each accordion item:

```tsx
// Before:
<div
  id={panelId}
  role="region"
  aria-labelledby={headerId}
  aria-hidden={!isOpen}
  className={`grid ... ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
>

// After:
<div
  id={panelId}
  role="region"
  aria-labelledby={headerId}
  aria-hidden={!isOpen}
  inert={!isOpen ? true : undefined} // NEW: add inert when collapsed
  className={`grid ... ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
>
```

**TypeScript note:** The `inert` attribute may not be in React's type definitions for older versions. If TypeScript complains:

```tsx
// Option 1: Use the attribute directly (React 19+ supports inert natively)
inert={!isOpen ? true : undefined}

// Option 2: If using older React, use a ref to set the attribute:
const panelRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (panelRef.current) {
    if (!isOpen) {
      panelRef.current.setAttribute("inert", "");
    } else {
      panelRef.current.removeAttribute("inert");
    }
  }
}, [isOpen]);
```

Option 1 is cleaner if the TypeScript version supports it. Option 2 is the fallback.

### Keep `aria-hidden` alongside `inert`

`inert` handles everything `aria-hidden` does and more. But keeping both provides backward compatibility for assistive technologies that might not fully support `inert` yet. The redundancy is harmless.

### Browser support consideration

`inert` is supported in all modern browsers (Chrome 102+, Firefox 112+, Safari 15.5+). For the Austin contractor/property manager audience on modern phones, this is well within support range. No polyfill needed.

### Acceptance Criteria

1. On mobile, use keyboard navigation (or connect a Bluetooth keyboard to a phone, or test in desktop responsive mode with keyboard)
2. Tab through the page to the Services section
3. **PASS:** Tab focuses the expanded service's content (CTA button, links). Tab does NOT focus elements inside collapsed services.
4. Expand a different service (click its header)
5. **PASS:** Tab now reaches the newly expanded service's content. Previously expanded service's content is no longer tab-reachable.
6. **FAIL:** Tab reaches focusable elements (buttons, links) inside collapsed panels

### Accessibility tool verification:

7. Run axe-core or a screen reader on the services section
8. **PASS:** Collapsed panels are not announced by screen reader. Expanded panel content is announced.
9. **FAIL:** Screen reader announces content from collapsed panels

### Rollback

Remove the `inert` attribute (or `useEffect` that sets it).

### Estimated Effort: 30 minutes

---

## 3.6 — Add Quote Panel Close/Bounce Analytics Events

**Priority:** Moderate — fills the analytics gap for form friction measurement
**File:** `FloatingQuotePanel.tsx`
**Desktop Safety:** 🟢 SAFE — FloatingQuotePanel is mobile-only

### Context

Current tracking: abandonment IS tracked when the user has typed something and closes the panel. But there's no tracking for the "bounce" case — user opens the panel, looks at it, and closes without typing anything. This is a different signal: abandonment = "I started but gave up" (friction/form issue), bounce = "I wasn't ready" or "the form didn't match my expectation" (timing/context issue).

### The Fix

The existing abandonment tracking:

```tsx
useEffect(() => {
  const wasOpen = wasOpenRef.current;
  if (wasOpen && !isOpen) {
    const hasAnyInput = fields.name.trim().length > 0 || /* ... other fields */;
    if (hasAnyInput && feedback?.type !== "success") {
      void trackConversionEvent({
        eventName: "quote_form_abandoned",
        source: "floating_quote_panel",
        metadata: { step: currentStep, has_name: ..., has_phone: ..., has_service_type: ... },
      });
    }
  }
  wasOpenRef.current = isOpen;
}, [isOpen, /* ... */]);
```

Add the bounce case:

```tsx
useEffect(() => {
  const wasOpen = wasOpenRef.current;
  if (wasOpen && !isOpen) {
    const hasAnyInput = fields.name.trim().length > 0 ||
      fields.phone.trim().length > 0 ||
      fields.serviceType.trim().length > 0 ||
      fields.companyName.trim().length > 0 ||
      fields.email.trim().length > 0 ||
      fields.description.trim().length > 0;

    if (feedback?.type === "success") {
      // Closed after successful submission — not an abandonment or bounce
      // No event needed (success events already fired in useQuoteForm)
    } else if (hasAnyInput) {
      // Had input but didn't submit — abandonment (existing behavior)
      void trackConversionEvent({
        eventName: "quote_form_abandoned",
        source: "floating_quote_panel",
        metadata: {
          step: currentStep,
          has_name: fields.name.trim().length > 0,
          has_phone: fields.phone.trim().length > 0,
          has_service_type: fields.serviceType.trim().length > 0,
        },
      });
    } else {
      // No input at all — bounce (NEW)
      void trackConversionEvent({
        eventName: "quote_panel_bounced",
        source: "floating_quote_panel",
        metadata: {
          step: currentStep,
          had_initial_service_type: Boolean(initialServiceType), // Did context threading pre-fill?
        },
      });
    }
  }
  wasOpenRef.current = isOpen;
}, [isOpen, fields, feedback, currentStep, initialServiceType]);
```

### What these events enable

| Metric | Formula | Insight |
|---|---|---|
| Panel bounce rate | `quote_panel_bounced` / `quote_panel_opened` | Are we opening the panel too aggressively? |
| Panel abandonment rate | `quote_form_abandoned` / (`quote_panel_opened` - `quote_panel_bounced`) | Among users who started, how many gave up? |
| Context threading impact | Compare bounce rate when `had_initial_service_type: true` vs `false` | Does pre-selection reduce bounces? |
| Step 1→2 dropoff | `quote_step1_completed` - `quote_step2_completed` | How many complete step 1 but not step 2? |

### Acceptance Criteria

1. Open FloatingQuotePanel on mobile. Close it immediately without typing.
2. Check analytics events.
3. **PASS:** `quote_panel_bounced` event fires with `step: 1`, `had_initial_service_type: false`
4. Open panel from a service CTA (with context threading from 3.2). Close without typing.
5. **PASS:** `quote_panel_bounced` event fires with `had_initial_service_type: true`
6. Open panel. Type a name. Close without submitting.
7. **PASS:** `quote_form_abandoned` event fires. NO `quote_panel_bounced` event.
8. Open panel. Complete Step 1 → Step 2 → Submit → Success.
9. **PASS:** Neither `quote_panel_bounced` nor `quote_form_abandoned` fires.
10. **FAIL:** No events on bounce, or wrong event type fires

### Dependencies

If shipping with 3.2 (context threading), the `initialServiceType` reference in the bounce metadata will have a value. If shipping before 3.2, `initialServiceType` won't exist as a prop yet — remove that metadata field or hardcode to `false`.

### Rollback

Remove the `else` block that fires `quote_panel_bounced`.

### Estimated Effort: 30 minutes

---

## 3.7 — Fix FloatingQuotePanel Mobile Height (Content-Fit)

**Priority:** Moderate — eliminates the ~400px white space below form content
**File:** `FloatingQuotePanel.tsx`
**Desktop Safety:** 🟡 VERIFY — Panel is the same component on all viewports (rendered by PublicChrome). Changes to height affect desktop side-drawer too. Must gate mobile-specific sizing.

### Context

The panel uses `h-full` which makes it take the full viewport height. On mobile where the panel is full-width (`w-full`), this creates a full-screen takeover. Step 1 has three fields + one button + one trust line ≈ 400px of content inside ~850px of panel height. The remaining ~450px is empty white space.

On desktop, `h-full` is correct — the side drawer (capped at `max-w-md` = 448px) fills the viewport height alongside the main content. Full height makes sense as a side panel. On mobile, it makes the form feel broken.

### The Fix

Change the panel height to be content-responsive on mobile but full-height on desktop:

```tsx
// Before:
className={`absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white ...`}

// After:
className={`absolute right-0 top-0 w-full max-w-md overflow-y-auto bg-white
  min-h-[50svh] max-h-full
  md:h-full
  ...`}
```

Breaking this down:
- `min-h-[50svh]` — panel is always at least half the viewport height (prevents it from being too small if content is minimal)
- `max-h-full` — panel can't exceed viewport height (scroll within if content is long, e.g., Step 2 with all fields)
- Removed `h-full` (mobile) — panel height is determined by content, between 50svh and 100%
- `md:h-full` — desktop keeps the full-height side-drawer behavior

**Alternative approach if the panel's parent container has constraints:**

The panel is `absolute` positioned within a container. If the container is `fixed inset-0` (full viewport overlay), then `h-full` means viewport height. With the fix above, removing `h-full` on mobile means the panel shrinks to content. But `absolute right-0 top-0` without `h-full` means the panel starts at the top and extends downward to content height. The bottom portion of the viewport would show the backdrop.

This is actually a better mobile UX — the form sits at the top of the screen (near the thumb) with the backdrop visible below. The user can see that this is an overlay, not a new page.

**If bottom-anchoring is preferred instead:**

```tsx
className={`absolute right-0 bottom-0 w-full max-w-md overflow-y-auto bg-white
  max-h-[85svh]
  md:top-0 md:bottom-auto md:h-full
  ...`}
```

This anchors the panel to the bottom of the screen on mobile (a "bottom sheet" pattern). `max-h-[85svh]` prevents it from covering the status bar. On desktop, `md:top-0 md:bottom-auto md:h-full` restores the top-anchored side drawer.

**Recommendation:** Top-anchored with content height (`min-h-[50svh]`). This is simpler and works well for a 3-field form.

### Step 2 height consideration

Step 2 has more fields (company, email, timeline, description). On mobile, this could be 500-600px of content. With `max-h-full`, the panel would scroll internally if needed. The `overflow-y-auto` already handles this.

### Acceptance Criteria

1. Open FloatingQuotePanel on mobile (Step 1)
2. **PASS:** Panel shows form content with minimal white space below. Panel does NOT extend to the full bottom of the viewport if content doesn't require it.
3. **PASS:** Backdrop is visible below the panel (if top-anchored) or above the panel (if bottom-anchored)
4. Complete Step 1 → view Step 2
5. **PASS:** Panel expands to accommodate Step 2 fields. If content exceeds viewport, panel scrolls internally.
6. Open FloatingQuotePanel on desktop
7. **PASS:** Panel is a full-height side drawer (same as current behavior). No height regression.
8. **FAIL:** Desktop panel is shorter than viewport, or mobile panel has large empty white space

### Rollback

Revert to `h-full w-full` on the panel container.

### Estimated Effort: 45 minutes (including Step 2 height testing)

---

## 3.9 — Tighten Residual Mobile Hero Free-Space (Purple Overlay Gap)

**Priority:** High — first-screen density still underperforms despite 75svh default
**Files:** `HeroSection.tsx`
**Desktop Safety:** 🟢 SAFE — mobile-only alignment and spacing adjustments can be gated below `md`

### Context

Recent responsive QA shows a large remaining flex free-space zone (purple overlay) above and below hero content on 400x797 mobile viewport. The hero container is still centered (`justify-center`) inside a tall viewport region, so content does not visually anchor tightly to intent/action.

This is now a separate issue from item 3.1:

1. 3.1 reduced gross hero height from full viewport default.
2. 3.9 addresses residual vertical slack still visible after the 3.1 change.

### Proposed fix direction

Apply mobile-only content anchoring and spacing compression in the hero content wrapper:

1. Replace `justify-center` with a mobile-first alignment that reduces dead zones (`justify-end` or a calibrated `justify-between` with explicit padding).
2. Add mobile-specific vertical rhythm (`pt-*` / `pb-*`) tuned for CTA + trust-pill visibility without excessive top void.
3. Keep desktop centered composition unchanged using `md:justify-center` and existing desktop spacing.

Example intent (not final classes):

```tsx
className="... flex-col items-center justify-end pt-20 pb-8 md:justify-center md:pt-0 md:pb-0 ..."
```

### Acceptance Criteria

1. On 390-430px width mobile viewports, hero headline + CTA cluster sits visually denser with reduced top/bottom void.
2. Purple flex free-space overlay is materially reduced versus current baseline.
3. Primary CTA and trust pills remain visible without introducing crowding/cutoff.
4. Desktop hero composition remains unchanged.
5. No CLS regression on initial load.

### Rollback

Revert hero wrapper alignment/spacing classes to the current centered mobile configuration.

### Estimated Effort: 30-60 minutes (including responsive QA across 3 device heights)

---

## Batch 3 Summary

| Item | Change | Effort | Desktop Impact | Dependencies |
|---|---|---|---|---|
| 3.1 | 75svh default hero | 1-1.5 hrs | 🟢 Safe | None |
| 3.2 | Context threading (7 files + 1 new) | 3-4 hrs | 🟢 Safe | None (but enriched by Batch 2's CTA changes) |
| 3.3 | Remove Timeline intro paragraph | 5 min | 🔴 Intentional | None |
| 3.4 | Show Timeline step icons on mobile | 45 min | 🟢 Safe | None |
| 3.5 | Add `inert` to collapsed accordion panels | 30 min | 🟢 Safe | None |
| 3.6 | Quote panel bounce analytics | 30 min | 🟢 Safe | Enhanced by 3.2 (context data in events) |
| 3.7 | Panel content-fit height | 45 min | 🟡 Verify | None |
| 3.9 | Tighten residual hero free-space | 30-60 min | 🟢 Safe | Follows 3.1 baseline |

**Total Batch 3 effort: ~7.5-9 hours**
**Total Batch 3 scroll savings: ~260-360px** (hero shrink + intro paragraph)

### Dependencies between Batch 3 items

- **3.6 references 3.2's `initialServiceType` prop.** If shipping 3.6 before 3.2, remove the `initialServiceType` metadata reference.
- **All other items are independent.**

### Dependencies on Batch 1 and 2

- **3.2 (context threading) benefits from 2.3 (button treatment on "Discuss Your Project")** — the button CTA needs a `serviceType` prop. If 2.3 hasn't been applied yet, 3.2 still works but the CTA will have the old text-link styling with the new serviceType prop. Purely cosmetic.
- **3.7 (panel height) depends on 1.1 (auto-close fix).** If the auto-close bug is still present, the panel would close 1.8s after Step 1 regardless of height. Fix 1.1 first.
- **3.1 (hero height) is independent of everything.** Can ship first in this batch.

### Recommended shipping order within Batch 3

1. **3.1** (hero height — standalone, high-impact)
2. **3.2** (context threading — largest item, ship early for maximum testing time)
3. **3.3 + 3.4** together (Timeline fixes — same file)
4. **3.5** (accordion accessibility — standalone)
5. **3.6** (analytics — ship after 3.2 for full metadata)
6. **3.7** (panel height — ship after 1.1 for correct interaction)

---

Ready for Batch 4 (the significant redesigns — IncludedSummary/Timeline merge, Before/After improvements, section reordering)?

# BATCH 4: Structural Redesigns — Section Merges, Proof Consolidation, Information Architecture

**These items involve creating new component variants, merging sections, and restructuring the page composition. Each requires more design consideration and cross-component coordination than previous batches. QA surface is larger. Ship each item individually with full regression testing.**

---

## 4.1 — Merge IncludedSummarySection into TimelineSection

**Priority:** High — eliminates the most significant thematic redundancy on the page
**Files:** `VariantAPublicPage.tsx`, `TimelineSection.tsx`
**Desktop Safety:** 🔴 CHANGES DESKTOP — removes the 3-column card section from desktop. See desktop mitigation options below.
**Scroll Savings:** ~400px mobile (entire IncludedSummary section removed)

### Context

Two sections tell the same story with different words:

| IncludedSummary | Timeline | Overlap |
|---|---|---|
| "Scope-Driven Planning" — "We align crew, service type, and schedule before work starts." | Step 02 "We Assess" — "review the scope, visit if needed, provide a clear estimate" | Same concept: planning/scoping |
| "Detail-Level Delivery" — "From rough clean to final walkthrough readiness, every phase is covered." | Step 03 "We Clean" — "detail-focused standards" | Same concept: execution/delivery |
| "Fast Communication" — "Direct response and bilingual coordination with your team." | Step 01 "Request a Quote" — "review the request quickly and confirm the next step" | Same concept: communication/response |

IncludedSummary sits at position 3 in the page flow (after Authority Bar, before Services). Timeline sits at position 8 (after Testimonials, before About). A user encounters "here's our process" early, scrolls through five other sections, then encounters "here's our process" again. This repetition dilutes both sections.

The Timeline version is stronger because it's concrete (specific steps with specific actions) rather than abstract (value propositions). The IncludedSummary messaging should be absorbed into Timeline as value sub-lines, and the standalone section removed.

### The Data Merge

Extend the Timeline step data model with a `valueLine` field:

In `TimelineSection.tsx`, update the steps array:

```tsx
const steps = [
  {
    number: "01",
    icon: RequestIcon, // or whatever the icon component is
    title: "Request a Quote",
    body: "Submit a request through our form or call directly. We review the request quickly and confirm the next step — usually within one hour.",
    detail: "Fast intake",
    image: "/images/timeline-01.jpg",
    // NEW:
    valueLine: "Direct response and bilingual coordination with your team.",
    valueIcon: "communication", // optional: for a small icon next to the value line
  },
  {
    number: "02",
    icon: AssessIcon,
    title: "We Assess",
    body: "We review the scope, visit if needed, and provide a clear estimate based on project needs.",
    detail: "Scope clarity",
    image: "/images/timeline-02.jpg",
    // NEW:
    valueLine: "We align crew, service type, and schedule before work starts.",
    valueIcon: "planning",
  },
  {
    number: "03",
    icon: CleanIcon,
    title: "We Clean",
    body: "Our crew follows detail-focused standards with clear task lists for every service visit.",
    detail: "Crew execution",
    image: "/images/timeline-03.jpg",
    // NEW:
    valueLine: "From rough clean to final walkthrough readiness, every phase is covered.",
    valueIcon: "delivery",
  },
  {
    number: "04",
    icon: WalkthroughIcon,
    title: "You Walk Through",
    body: "When the job wraps, we walk through the results with you. If anything needs attention, we handle it on the spot.",
    detail: "Closeout ready",
    image: "/images/timeline-04.jpg",
    // NEW:
    valueLine: "Zero punch-list items left behind.",
    valueIcon: "closeout",
  },
];
```

Step 04 doesn't have a direct IncludedSummary mapping. Its `valueLine` is a new addition that reinforces the closeout value — "Zero punch-list items left behind" is a direct hook for GCs who care about clean handoffs.

### The Rendering Change

In the mobile step rendering within TimelineSection, add the `valueLine` display after the body text:

```tsx
{/* Existing: step body paragraph */}
<p className="mt-2 text-sm leading-relaxed text-slate-600">
  {step.body}
</p>

{/* NEW: value line — the merged IncludedSummary content */}
{step.valueLine && (
  <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#C9A94E]/5 px-3 py-2">
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A94E]"
    >
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="text-sm font-medium text-slate-700">
      {step.valueLine}
    </span>
  </div>
)}
```

This renders the value line as a highlighted callout with:
- Gold check icon (using the brand accent color `#C9A94E`)
- Light gold background tint (`bg-[#C9A94E]/5`)
- Slightly heavier font weight than body text
- Rounded container that visually separates it from the body paragraph

The visual treatment communicates "this is a commitment/guarantee" rather than "this is more description." It's the What's Included value proposition embedded within the process step context.

### Desktop rendering of the value line

The same `valueLine` renders on desktop within each step's content area. Since the desktop step layout is richer (side-by-side with image, alternating layout), the value line adds a nice accent block within each step's text column. No special desktop treatment needed — the gold callout works at any width.

### Remove IncludedSummarySection from page composition

In `VariantAPublicPage.tsx`:

```tsx
// REMOVE the entire IncludedSummarySection inline component definition:
// const INCLUDED_SUMMARY_ITEMS = [...];
// function IncludedSummarySection() { ... }

// REMOVE from JSX composition:
// <IncludedSummarySection />
```

Since IncludedSummarySection is defined inline in `VariantAPublicPage.tsx` (not a separate file), removing it means deleting both the data constant and the component function from the page file.

### Desktop mitigation: Do we need to keep the 3-column cards on desktop?

The 3-column card layout on desktop (three white cards with titles and descriptions) is visually lightweight and quick to scan. The Timeline section on desktop is heavier (alternating image+text blocks). Losing the cards means desktop users go from Authority Bar directly to Services accordion (desktop renders full service cards, not accordion) without a "process overview" interstitial.

**Argument for removing on desktop too:** The desktop cards are equally flat and redundant. They add ~350px of scroll on desktop with no icons, no visual interest, and content that's repeated in How It Works. Desktop users also benefit from the merge.

**Argument for keeping on desktop:** The cards provide a quick-scan summary before the detailed services. Desktop has more scroll tolerance (larger viewport, mouse wheel). The visual cost is lower on desktop.

**Recommendation:** Remove on desktop too. The merged Timeline section (now with value lines) provides a richer version of the same content. If desktop stakeholders strongly object, gate the removal:

```tsx
// In VariantAPublicPage.tsx, if keeping on desktop:
<div className="hidden md:block">
  <IncludedSummarySection />
</div>
```

But this defeats the purpose of the merge — maintaining a redundant section for one viewport. I recommend clean removal on both.

### Also update the Timeline section heading

With the merge, the Timeline section now carries both "process" and "value" content. The heading should reflect this:

```tsx
// Before:
<p className="section-kicker">Our Process</p>
<h2 className="...">How It Works</h2>

// After:
<p className="section-kicker">The A&A Process</p>
<h2 className="...">How We Deliver</h2>
```

"How We Deliver" subtly shifts from describing a process to promising an outcome. "The A&A Process" brands the methodology.

### Acceptance Criteria

1. Load homepage on mobile
2. Scroll past Authority Bar
3. **PASS:** Next section is Services accordion. No "What's Included" cards between Authority Bar and Services.
4. Scroll to How It Works (now "How We Deliver") section
5. **PASS:** Each step shows its title, body text, AND a gold-tinted value line callout below the body
6. Step 01 value line reads: "Direct response and bilingual coordination with your team."
7. Step 02 value line reads: "We align crew, service type, and schedule before work starts."
8. Step 03 value line reads: "From rough clean to final walkthrough readiness, every phase is covered."
9. Step 04 value line reads: "Zero punch-list items left behind."
10. Load homepage on desktop
11. **PASS:** No 3-column "What's Included" cards visible (if removing on desktop). Same value lines visible within each Timeline step.
12. **FAIL:** "What's Included" section still visible on either viewport, or value lines missing from Timeline steps

### Scroll budget verification

Before merge:
- IncludedSummarySection: ~400px
- TimelineSection: ~850px
- Combined: ~1,250px

After merge:
- TimelineSection (with value lines): ~950px (each step gains ~25px from the value callout)
- IncludedSummarySection: 0px (removed)
- Combined: ~950px

**Net savings: ~300-400px** (depending on value line text wrapping)

### Rollback

1. Re-add the `INCLUDED_SUMMARY_ITEMS` constant and `IncludedSummarySection` component to `VariantAPublicPage.tsx`
2. Re-add `<IncludedSummarySection />` to the JSX composition
3. Remove `valueLine` and `valueIcon` from Timeline steps data
4. Remove the value line rendering block from TimelineSection
5. Revert heading text changes

### Estimated Effort: 3-4 hours

---

## 4.2 — Before/After Section: Headline Hierarchy Swap + Metadata Inversion + Micro-CTA

**Priority:** Moderate-High — strengthens the strongest proof section on the page
**File:** `BeforeAfterSlider.tsx`
**Desktop Safety:** 🔴 CHANGES DESKTOP — headline, metadata, and CTA changes are all-viewport. These are improvements on both viewports.

### Context — Three issues, one file

**Issue A: Headline hierarchy is inverted.** The section kicker "The A&A Standard" is the stronger brand phrase. The headline "See the Difference" is generic. The strong phrase is tiny; the weak phrase is prominent.

**Issue B: Metadata hierarchy is flat.** All four metadata fields (Project, Scope, Result, Key Benefit) have equal visual weight. "Result" should be the hero text — it's the answer to "what happened?" which is the entire point of a before/after comparison.

**Issue C: No conversion path after proof.** The user sees visual evidence of quality work, then the section ends. No CTA. The user's persuasion momentum dissipates.

### Fix A: Headline Hierarchy Swap

```tsx
// Before:
<p className="section-kicker">The A&A Standard</p>
<h2 className="mt-3 font-serif text-2xl tracking-tight text-[#0A1628] md:text-5xl">
  See the Difference
</h2>

// After:
<p className="section-kicker">Proof of Work</p>
<h2 className="mt-3 font-serif text-2xl tracking-tight text-[#0A1628] md:text-5xl">
  The A&A Standard
</h2>
<p className="mt-2 text-sm text-slate-500 md:text-base">
  Drag to compare — real projects, real results.
</p>
```

Changes:
- Kicker: "The A&A Standard" → "Proof of Work" (the kicker now frames the section's purpose — evidence)
- Headline: "See the Difference" → "The A&A Standard" (the headline is now the brand claim)
- Added subtitle that gives the interaction instruction and credibility signal ("real projects")

### Fix B: Metadata Hierarchy — Feature "Result" as Hero Text

The metadata grid currently renders all four cells identically:

```tsx
{[
  { label: "Project", value: item.caption, accent: true },
  { label: "Scope", value: item.scope },
  { label: "Result", value: item.turnaround },
  { label: "Key Benefit", value: "Inspection-ready results" },
].map((meta) => (
  <div className="bg-white px-4 py-3">
    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{meta.label}</div>
    <div className="mt-1 text-sm font-medium text-slate-700">{meta.value}</div>
  </div>
))}
```

Restructure to feature the Result:

```tsx
{/* Featured result — large, above the detail grid */}
<div className="mt-4 rounded-xl bg-[#0A1628] px-4 py-3 text-center md:px-6 md:py-4">
  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A94E]">
    Result
  </div>
  <div className="mt-1 text-lg font-semibold text-white md:text-xl">
    {item.turnaround}
  </div>
</div>

{/* Supporting details — compact grid */}
<div className="mt-2 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200">
  {[
    { label: "Project", value: item.caption },
    { label: "Scope", value: item.scope },
    { label: "Key Benefit", value: item.keyBenefit || "Inspection-ready results" },
  ].map((meta) => (
    <div key={meta.label} className="bg-white px-3 py-2.5">
      <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
        {meta.label}
      </div>
      <div className="mt-0.5 text-xs font-medium text-slate-600">
        {meta.value}
      </div>
    </div>
  ))}
</div>
```

This creates a two-tier hierarchy:
1. **Top tier (dark block):** Result value in large white text on dark background. This is the answer — "Final Presentation," "Leasing Ready," "Walkthrough Ready."
2. **Bottom tier (3-column grid):** Supporting context (project name, scope, key benefit) in smaller text. These provide details but don't compete with the result.

**Data model change:** Move "Key Benefit" from hardcoded to per-pair data:

```tsx
// Before (in comparison pairs data):
{ before: "...", after: "...", caption: "...", tag: "...", scope: "...", turnaround: "..." }

// After:
{ before: "...", after: "...", caption: "...", tag: "...", scope: "...", turnaround: "...", keyBenefit: "Inspection-ready in one pass" }
```

Each pair gets its own key benefit instead of sharing the same hardcoded string. Example values:
- Commercial Office: `keyBenefit: "Inspection-ready presentation"`
- Apartment Turn: `keyBenefit: "Leasing-ready in 48 hours"`
- Post-Construction: `keyBenefit: "Zero punch-list callbacks"`

### Fix C: Micro-CTA After Metadata

Add a conversion path after the proof:

```tsx
{/* After the metadata grid */}
<div className="mt-4 text-center">
  <QuoteCTA
    ctaId="before_after_quote_cta"
    serviceType={TAG_TO_SERVICE_TYPE[item.tag]} // Map the active tab's tag to a service type
    className="cta-outline-dark inline-flex items-center gap-2 text-xs"
  >
    Want this for your space?
    <ArrowRight className="h-3.5 w-3.5" />
  </QuoteCTA>
</div>
```

The CTA uses context threading (from 3.2) to pre-select the relevant service type based on which tab is active. Need a small mapping:

```tsx
const TAG_TO_SERVICE_TYPE: Record<string, string> = {
  "Commercial Office": "commercial",
  "Apartment Turn": "move_in_out",
  "Post-Construction": "post_construction",
};
```

This can live at the module level in `BeforeAfterSlider.tsx` or be imported from `service-type-map.ts` (extend that file with this mapping).

**Import required:** QuoteCTA needs to be imported. Also ArrowRight if not already available.

```tsx
import { QuoteCTA } from "./QuoteCTA";
import { ArrowRight } from "lucide-react"; // or wherever the icon comes from
```

### Mobile-specific consideration for metadata

The featured result block + 3-column supporting grid might be tight on mobile. At ~350px usable width, three columns give ~110px each for the supporting details. With 9px text and short labels, this should work. But verify:

- "Post-Construction Rough Clean" as a Project value would need 2-3 lines in a 110px column
- If values are too long, switch to `grid-cols-1` on mobile: `grid-cols-1 md:grid-cols-3`

Actually, looking at the current implementation, it's already `md:grid-cols-4` with single-column stacking on mobile. The restructured version uses `grid-cols-3` (one fewer column since Result is pulled out). For mobile, stacking might still be better:

```tsx
<div className="mt-2 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 md:grid-cols-3">
```

### Acceptance Criteria

1. Scroll to Before/After section on mobile
2. **PASS:** Headline reads "The A&A Standard." Kicker reads "Proof of Work." Subtitle mentions "real projects, real results."
3. View any comparison (drag the slider)
4. **PASS:** Below the slider, a dark block shows the Result value in large white text (e.g., "Final Presentation")
5. **PASS:** Below the result block, supporting details show Project, Scope, and Key Benefit in smaller text
6. **PASS:** Below the metadata, "Want this for your space?" CTA link is visible
7. Tap the CTA
8. **PASS:** FloatingQuotePanel opens with the relevant service type pre-selected (if context threading from 3.2 is deployed)
9. Switch tabs (e.g., from "Commercial Office" to "Post-Construction")
10. **PASS:** Result, supporting details, AND the CTA's pre-selection all update to match the new tab's data
11. **FAIL:** Old headline "See the Difference" visible, or flat metadata grid with equal-weight cells, or no CTA

### Rollback

Revert all three changes:
- Headline/kicker text → original strings
- Metadata rendering → original flat grid with 4 equal cells
- Remove micro-CTA block and imports

### Dependencies

- **Context threading (3.2):** The micro-CTA uses `serviceType` prop on QuoteCTA. If 3.2 isn't deployed yet, the CTA still works — it just opens a blank form (same as every other CTA before 3.2).
- **Per-pair keyBenefit data:** The data model change (adding `keyBenefit` to each pair) should be done regardless of the rendering change. It replaces a hardcoded string with accurate per-pair data.

### Estimated Effort: 3-4 hours

---

## 4.3 — Where We Work Section Consolidation

**Priority:** Moderate — reduces a ~600px section to ~350px while improving clarity
**File:** `ServiceAreaSection.tsx`
**Desktop Safety:** 🟡 VERIFY — some changes affect desktop too. The SVG map (desktop-only) is preserved. City cards receive mobile-specific compaction.
**Scroll Savings:** ~250-300px mobile

### Context

After Batch 2 item 2.12 (remove city pills and hide region legend on mobile), the mobile Where We Work section contains:
- Section heading + subtitle (~100px)
- 10 city info cards in 2-column grid (~300px)
- CTA button + helper text (~80px)
- Total: ~480px

The city cards are non-interactive `<div>` elements showing city name + distance. They're informational but bulky — 10 cards × 2 columns = 5 rows of cards, each ~60px tall.

### The Consolidation Plan

Replace the 2-column card grid with a more compact representation on mobile:

**New mobile layout: Compact city pills with distance tooltips**

```tsx
{/* Mobile-only compact city display */}
<div className="mt-6 md:hidden">
  <div className="flex flex-wrap gap-2">
    {areas.map((area) => (
      <div
        key={area.name}
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm"
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: regionMeta[area.region].dot }}
          aria-hidden="true"
        />
        <span className="font-medium text-slate-700">{area.name}</span>
        <span className="text-xs text-slate-400">{area.distance}</span>
      </div>
    ))}
  </div>
</div>

{/* Desktop card grid — unchanged */}
<div className="mt-6 hidden grid-cols-2 gap-2 sm:grid-cols-4 md:mt-8 md:grid lg:grid-cols-2 xl:grid-cols-4">
  {areas.map((area, i) => (
    // ... existing desktop card rendering
  ))}
</div>
```

This replaces the 2-column grid with a flowing pill layout. Each pill is one line: `[colored dot] [city name] [distance]`. 10 pills in a flex-wrap container take approximately 3-4 rows at mobile width, or ~150px total — saving ~150px from the card grid.

The colored dots (North/Central/South) are embedded in each pill, so the separate region legend becomes unnecessary on mobile (it was already hidden in 2.12).

### Add a compact mobile-specific heading

The current heading ("Where We Work" or "Coverage You Can Count On") plus a subtitle paragraph takes ~100px. Tighten for mobile:

```tsx
{/* Mobile heading — more compact */}
<div className="md:hidden">
  <p className="section-kicker">Coverage Area</p>
  <h2 className="mt-2 font-serif text-2xl tracking-tight text-[#0A1628]">
    Georgetown to San Marcos
  </h2>
  <p className="mt-1 text-sm text-slate-500">
    Same standards at every location across the Austin metro.
  </p>
</div>

{/* Desktop heading — unchanged */}
<div className="hidden md:block">
  {/* ... existing desktop heading */}
</div>
```

"Georgetown to San Marcos" is more specific than a generic coverage headline. It names the geographic range, which is immediately meaningful to anyone in the Austin metro. The subtitle reinforces consistency.

### Optional: Add mini SVG map on mobile

This is the document's recommendation from §16.4. A simplified version of the desktop SVG map rendered at fixed height on mobile:

```tsx
{/* Mobile mini map — simplified version of desktop SVG */}
<div className="mt-4 flex justify-center md:hidden">
  <svg
    viewBox="0 0 300 200"
    className="h-[180px] w-full max-w-[280px]"
    aria-label="Service area map showing coverage from Georgetown to San Marcos"
    role="img"
  >
    {/* Simplified: just the area dots, the HQ marker, and a bounding shape */}
    {/* No hover interactions, no connection lines, no animations */}
    {areas.map((area) => (
      <circle
        key={area.name}
        cx={area.x * 0.75} // Scale coordinates to mini map viewport
        cy={area.y * 0.75}
        r={area.name === "Austin" ? 6 : 4}
        fill={regionMeta[area.region].dot}
        opacity={0.8}
      />
    ))}
    {/* Optional: city labels for major cities only */}
    {areas
      .filter((a) => ["Austin", "Round Rock", "Georgetown", "San Marcos"].includes(a.name))
      .map((area) => (
        <text
          key={`label-${area.name}`}
          x={area.x * 0.75}
          y={area.y * 0.75 + 12}
          textAnchor="middle"
          className="fill-slate-500 text-[8px]"
        >
          {area.name}
        </text>
      ))}
  </svg>
</div>
```

This is a static, non-interactive mini map. It uses the same coordinate data as the desktop map but scaled down. No hover effects, no animations, no connection lines — just dots showing geographic spread.

**Whether to include the mini map is optional.** The compact pills already communicate coverage. The mini map adds geographic visualization but also adds ~180px of height. Include it if the visual value justifies the scroll cost. If scroll budget is tight, skip it.

**Recommendation:** Include the mini map. Geographic credibility is important for a service business. The map communicates "we cover a real area" better than a list of city names. The ~180px cost is worth it because it replaces the trust signal that the (now hidden) desktop map provided.

### Section height after consolidation

| Component | Before | After |
|---|---|---|
| Heading + subtitle | ~100px | ~80px (tighter mobile heading) |
| City display | ~300px (2-column card grid) | ~150px (flowing pills) |
| Mini map | 0px | ~180px (new) |
| CTA + helper | ~80px | ~80px (unchanged) |
| **Total** | **~480px** (post Batch 2) | **~490px with map / ~310px without map** |

With the mini map, the section is roughly the same height but significantly better content. Without the mini map, we save ~170px.

The real win isn't height — it's clarity. One geographic representation instead of three, with a specific headline instead of a generic one.

### Acceptance Criteria

1. Load homepage on mobile, scroll to Where We Work
2. **PASS:** Heading reads "Georgetown to San Marcos" with "Coverage Area" kicker
3. **PASS:** Cities displayed as flowing pills with colored dots and distances. No 2-column card grid.
4. **PASS:** (If mini map included) Static SVG map showing dots for all 10 cities, with labels on major cities
5. **PASS:** "Check Availability in Your Area" CTA button visible below
6. **PASS:** No pill links to `/service-area/[slug]` (removed in 2.12)
7. **PASS:** No region legend as separate element (integrated into pills via dots)
8. Load on desktop
9. **PASS:** Desktop layout unchanged — SVG interactive map, city cards in grid, full heading
10. **FAIL:** 2-column card grid still visible on mobile, or desktop map missing

### Rollback

Revert `ServiceAreaSection.tsx` to pre-change state. The section returns to: card grid + pills (if 2.12 was applied, pills are already gone — restore those too if rolling back both).

### Dependencies

- **Depends on 2.12** (pill removal + legend hide). This item builds on those removals by replacing the remaining card grid with a more compact treatment.
- **If 2.12 hasn't been shipped,** this item can be done as a standalone that replaces all three mobile affordances at once. Just ensure the pills and legend are also removed as part of this change.

### Estimated Effort: 4-5 hours (including mini SVG map)

---

## 4.4 — Homepage Section Reordering

**Priority:** Moderate — improves the narrative funnel arc
**File:** `VariantAPublicPage.tsx`
**Desktop Safety:** 🔴 CHANGES DESKTOP — section order is shared across viewports. The reordering improves the narrative on both viewports.

### Context

Current order (after Batches 1-3):

```
Hero → Authority Bar → [IncludedSummary removed] → Services Accordion →
Who We Serve → Before/After → Testimonials →
How It Works (now "How We Deliver") → About →
Where We Work → Let's Talk (MobileQuoteCloser) → Footer
```

The current flow has a structural issue: **proof is separated from the ask.** The user sees evidence (Before/After + Testimonials) at positions 5-6, but the process explanation (How We Deliver) comes at position 7, pushing the conversion closer (Let's Talk) to position 9. The user has to scroll through process + about + coverage between seeing proof and being asked to act.

### Proposed Order

```
Hero → Authority Bar → Services Accordion →
Who We Serve → How We Deliver → The A&A Standard (Before/After) →
Testimonials → About → Where We Work →
Let's Talk (MobileQuoteCloser) → Footer
```

### What Changed and Why

| Move | Rationale |
|---|---|
| **Services moves to position 3** (was 4, but IncludedSummary removed) | Already in this position after IncludedSummary removal. No change needed. |
| **How We Deliver moves to position 5** (was 7) | Process explanation comes right after "who we serve" — natural question flow: "What do you do? → Who do you do it for? → How do you do it?" |
| **Before/After moves to position 6** (was 5) | Proof comes after process explanation. The user now understands what A&A does, who they serve, and how they work — THEN sees evidence. This is a trust-building sequence: understand → believe. |
| **Testimonials stays at position 7** (was 6) | Social proof follows visual proof. Two forms of evidence back-to-back create a "proof block." |
| **About stays at position 8** | Brand identity after proof — "now that you've seen what we do and heard from our clients, here's who we are." |
| **Where We Work stays at position 9** | Coverage confirmation before the conversion ask. |
| **Let's Talk stays as terminal** | Unchanged. The single conversion closer. |

### The Narrative Arc

1. **Promise** (Hero): We clean every surface, every detail, every time
2. **Credibility** (Authority): 15+ years, 500+ projects, Austin's standard
3. **Specifics** (Services): Here's exactly what we clean and how fast we respond
4. **Relevance** (Who We Serve): Here's how we serve your specific project type
5. **Process** (How We Deliver): Here's exactly what happens when you hire us
6. **Visual Proof** (The A&A Standard): See the actual before/after results
7. **Social Proof** (Testimonials): Hear from actual clients
8. **Identity** (About): Who we are and what we stand for
9. **Coverage** (Where We Work): We serve your area
10. **Action** (Let's Talk): Get your quote now

This follows a **trust funnel**: Promise → Specifics → Process → Proof → Action. Each section answers the natural next question a decision-maker would have.

### Implementation

In `VariantAPublicPage.tsx`, the JSX composition within `<main>` changes order:

```tsx
<main>
  {/* 1. Promise */}
  <HeroSection />
  
  {/* 2. Credibility */}
  <AuthorityBar />
  
  {/* 3. Specifics */}
  <ServiceSpreadSection />
  
  {/* 4. Relevance */}
  <OfferAndIndustrySection />
  
  {/* 5. Process — MOVED UP from position 7 */}
  <TimelineSection />
  
  {/* 6. Visual Proof — MOVED DOWN from position 5 */}
  <ErrorBoundary fallback={<SectionSkeleton />}>
    <Suspense fallback={<SectionSkeleton />}>
      <BeforeAfterSlider />
    </Suspense>
  </ErrorBoundary>
  
  {/* 7. Social Proof — MOVED DOWN from position 6 */}
  <ErrorBoundary fallback={<SectionSkeleton />}>
    <Suspense fallback={<SectionSkeleton />}>
      <TestimonialSection />
    </Suspense>
  </ErrorBoundary>
  
  {/* 8. Identity */}
  <AboutSection />
  
  {/* 9. Coverage */}
  <ServiceAreaSection />
  
  {/* 10. Action */}
  <section id="quote-closer" className="... md:hidden">
    {/* MobileQuoteCloser content */}
  </section>
  
  {/* Desktop form */}
  <div className="hidden md:block">
    <QuoteSection />
  </div>
</main>
```

### Analytics Impact

The `section_view` tracking uses element `id` attributes, not DOM order. Section IDs (`#services`, `#industries`, `#about`, etc.) don't change. The scroll depth milestones (25/50/75/100%) will fire at different section positions since the page layout changed, but the milestones themselves are percentage-based and still valid.

The `section_N` fallback IDs (used when a section has no explicit `id`) would shift. But looking at the code, all major sections have explicit IDs, so fallback IDs are unlikely to be in use.

**One impact:** Time-in-view metrics for sections that moved will show different patterns post-change. This is expected and is the whole point — we want to measure whether the new order improves engagement.

### Lazy-loading impact

`BeforeAfterSlider` and `TestimonialSection` are dynamically imported with `Suspense` boundaries. Moving them lower in the page means they're further from the initial viewport, which is actually BETTER for lazy loading — they'll load later when the user is more likely to actually reach them, saving initial load resources.

`TimelineSection` is statically imported. Moving it higher means its code is still in the initial bundle (no change), but it renders earlier in the page. Since it was already statically imported, this doesn't change the bundle.

### Acceptance Criteria

1. Load homepage on mobile
2. Scroll through the entire page, noting section order
3. **PASS:** Order is: Hero → Authority Bar → Services → Who We Serve → How We Deliver → Before/After → Testimonials → About → Where We Work → Let's Talk → Footer
4. Each section renders correctly in its new position (no broken layouts or missing content)
5. **PASS:** All section IDs are accessible via hash navigation (e.g., `/#services`, `/#about`)
6. Check analytics events
7. **PASS:** `section_view` events fire with correct section IDs as user scrolls through the new order

### Regression checks

8. Navigate via menu "Services" link (`/#services`)
9. **PASS:** Scrolls to Services section (position 3)
10. Navigate via menu "About" link (`/#about`)
11. **PASS:** Scrolls to About section (position 8)
12. All menu links and footer links scroll/navigate correctly
13. **PASS:** No dead anchors

### Rollback

Revert the JSX order in `VariantAPublicPage.tsx` to the original sequence.

### Estimated Effort: 1-2 hours (mostly testing and verification)

---

## 4.5 — Surface Proof Lines in Mobile Service Accordion

**Priority:** Moderate — restores persuasive content hidden on mobile
**File:** `ServiceSpreadSection.tsx`
**Desktop Safety:** 🟢 SAFE — `MobileServiceAccordion` is completely separate from desktop rendering

### Context

Each service has a `proofLine` in its data:
- Post-Construction: "Built for punch-list closeouts and final walkthroughs"
- Final Clean: "Presentation-ready cleaning for move-in, listing, or turnover deadlines"
- Commercial: (similar specifics)
- etc.

These render on desktop in the rich service cards but are hidden on mobile. The `proofLine` is the service's positioning statement — it tells the user WHY this service exists and WHO it's for. On mobile, users get the description and bullets but miss this framing.

### The Fix

In the expanded accordion panel content, add the proofLine after the description and before the bullets:

```tsx
{/* Existing: service image */}
<div className="...">
  <Image src={service.image} ... />
</div>

{/* Existing: service description */}
<p className="mt-3 text-sm leading-relaxed text-slate-600">
  {service.description}
</p>

{/* NEW: proof line */}
{service.proofLine && (
  <p className="mt-2 text-sm font-semibold italic text-[#0A1628]">
    {service.proofLine}
  </p>
)}

{/* Existing: bullet list */}
<ul className="mt-3 space-y-2">
  {service.bullets.map(...)}
</ul>

{/* Existing: CTA */}
<QuoteCTA ...>Quote This Service →</QuoteCTA>
```

The proofLine is styled as italic semibold — visually distinct from the regular-weight description above and the bulleted list below. It reads as a positioning statement or tagline for the service.

### Also surface the package label

Each service has a `packageLabel` (e.g., "Site Cleanup", "Property Ready", "Facility Care") that appears on desktop image overlays but is hidden on mobile. This is a one-word service category that helps users quickly identify the service type.

Add it to the accordion header, next to the title:

```tsx
{/* In the accordion header button, after the title */}
<div className="flex flex-col">
  <span className="text-base font-bold text-[#0A1628]">
    {service.titleLines.join(" ")}
  </span>
  {service.packageLabel && (
    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
      {service.packageLabel}
    </span>
  )}
</div>
```

This adds a tiny category label beneath the service title in the collapsed header. "Post-Construction Clean" + "SITE CLEANUP" gives additional context without requiring expansion.

### Acceptance Criteria

1. On mobile, expand any accordion service
2. **PASS:** Below the description paragraph, a proof line appears in italic semibold (e.g., "Built for punch-list closeouts and final walkthroughs" for Post-Construction)
3. Verify all five services show their proof lines when expanded
4. View collapsed accordion headers
5. **PASS:** Each header shows the service title AND a small uppercase package label beneath it
6. **FAIL:** Proof lines missing from expanded view, or package labels missing from collapsed headers

### Rollback

Remove the proof line `<p>` element and the package label `<span>` element.

### Estimated Effort: 30 minutes

---

## Batch 4 Summary

| Item | Change | Effort | Desktop Impact | Scroll Savings |
|---|---|---|---|---|
| 4.1 | Merge IncludedSummary into Timeline | 3-4 hrs | 🔴 Intentional | ~300-400px |
| 4.2 | Before/After headline + metadata + CTA | 3-4 hrs | 🔴 Intentional | 0px (adds CTA, reframes existing content) |
| 4.3 | Where We Work consolidation | 4-5 hrs | 🟡 Verify | ~170-250px |
| 4.4 | Section reordering | 1-2 hrs | 🔴 Intentional | 0px (same sections, better order) |
| 4.5 | Surface proof lines + package labels in accordion | 30 min | 🟢 Safe | 0px (adds ~30px per expanded service) |

**Total Batch 4 effort: ~12-16 hours**
**Total Batch 4 scroll savings: ~470-650px**

### Dependencies

| Item | Depends On |
|---|---|
| 4.1 (merge) | Batch 2 complete (IncludedSummary changes in 2.x don't conflict, but the section is being removed here) |
| 4.2 (Before/After) | 3.2 (context threading) for micro-CTA serviceType — works without it, but CTA is generic |
| 4.3 (Where We Work) | 2.12 (pill removal) — this builds on that simplification |
| 4.4 (reordering) | 4.1 (merge) — the reorder assumes IncludedSummary is gone. If it's not, the order still works but has the redundancy |
| 4.5 (proof lines) | None — standalone |

### Recommended shipping order within Batch 4

1. **4.5** (proof lines — smallest, standalone, immediate value)
2. **4.1** (merge — the big structural change, needs time for testing)
3. **4.4** (reordering — depends on 4.1, relatively quick once merge is done)
4. **4.2** (Before/After — independent, can ship anytime)
5. **4.3** (Where We Work — most design-heavy, can ship last)

---

# BATCH 5: Stretch Goals & Deferred Improvements

**These items are valuable but not urgent. They represent optimization beyond the core conversion funnel fixes. Ship when capacity allows, after Batches 1-4 are stable.**

---

## 5.1 — Who We Serve Horizontal Carousel on Mobile (Optional)

**Priority:** Low-Moderate — saves scroll but changes interaction pattern
**File:** `OfferAndIndustrySection.tsx`
**Desktop Safety:** 🟢 SAFE if using separate mobile component (ServiceSpreadSection pattern)
**Scroll Savings:** ~400-600px mobile
**Estimated Effort:** 4-6 hours

### Summary

Three persona cards stacked vertically = ~1,400px (with outcome text from 2.5). A horizontal swipe carousel with peek visibility would show one full card + edge of the next card, taking ~450px. Natural for exactly three self-contained, equal-weight cards.

**Why this is deferred, not Batch 4:** The current vertical stack works. The cards' copy is strong and benefits from full reading. After 2.3 (button CTA), 2.4 (relocated top CTA), and 2.5 (outcome text), the section is significantly improved. Carousel adds complexity and changes the interaction model from "scroll and read all" to "swipe to discover." This is a tradeoff, not a clear win.

**If implemented:** Create a `MobileIndustryCarousel` component (like `MobileServiceAccordion` — completely separate from desktop). Use CSS scroll-snap for native-feeling swipe. Show card indicator dots. First card auto-visible, second card peeking.

---

## 5.2 — Industry Vertical Page Template

**Priority:** Low-Moderate — enables persona-specific landing pages for §15.5 compliance
**Files:** New route `app/industries/[slug]/page.tsx` + template component
**Desktop Safety:** 🟢 SAFE — new pages, no changes to existing pages
**Estimated Effort:** 6-8 hours

### Summary

§15.5 directs: "Build industry vertical page template now, publish selectively." Currently, all three "Discuss Your Project" CTAs on persona cards open the same generic quote form. With industry pages, each CTA could route to `/industries/general-contractors`, `/industries/property-managers`, or `/industries/commercial-operators` — pages tailored to each persona's specific needs, proof, and service emphasis.

**Template should include:** persona-specific hero, relevant services (subset of 5), relevant testimonials (filtered by tag), relevant before/after examples (filtered by tag), and a quote form with service type pre-selected.

**Why deferred:** The current flow (persona card → quote form) works. Industry pages are a conversion optimization, not a fix. The context threading from 3.2 already pre-selects service type, which captures most of the persona-routing value.

---

## 5.3 — Mobile Stepper Accordion for How We Deliver

**Priority:** Low — further scroll optimization on an already-improved section
**File:** `TimelineSection.tsx`
**Desktop Safety:** 🟢 SAFE if using separate mobile component
**Scroll Savings:** ~200-300px
**Estimated Effort:** 3-4 hours

### Summary

After 3.3 (remove intro), 3.4 (show icons), and 4.1 (merge with value lines), the Timeline section on mobile is already significantly improved. A stepper accordion would further compact it: four collapsed headers (icon + number + title), expanding one at a time. Similar pattern to the services accordion.

**Why deferred:** The Timeline is now ~950px after the merge. With icons and value lines, it has visual variety. The full stepper treatment would save ~200-300px but adds another accordion interaction that might fatigue users who just interacted with the services accordion. Monitor the scroll depth data after Batches 1-4 to see if users are reaching the Timeline section. If they are, the section is working. If not, the stepper might help.

---

## 5.4 — Shared Data Layer for Services/Industries/Cities

**Priority:** Low — maintenance improvement, no user-facing impact
**Files:** New shared data files + refactoring imports across 4+ components
**Desktop Safety:** 🟢 SAFE — data refactoring, no rendering changes
**Estimated Effort:** 4-6 hours

### Summary

Service data exists in `ServiceSpreadSection.tsx` and `PublicHeader.tsx`. Industry data exists in `OfferAndIndustrySection.tsx` and `PublicHeader.tsx`. City data exists in `ServiceAreaSection.tsx` (two separate arrays) and `service-areas.ts`. None share a source.

Create canonical data files:
- `src/data/services.ts` — single source for all service data
- `src/data/industries.ts` — single source for all industry data
- `src/data/service-areas.ts` — already exists, but `ServiceAreaSection.tsx` should import from it instead of hardcoding inline

**Why deferred:** The current duplication is manageable at 5 services, 3 industries, 10 cities. It becomes a problem at scale (adding a 6th service, adding a new city). The data rarely changes for a cleaning company, so the maintenance cost is low.

---

## 5.5 — Remove Dead `variant` Prop from CTAButton

**Priority:** Trivial — code hygiene
**File:** `CTAButton.tsx`
**Estimated Effort:** 5 minutes

Remove `variant` from `CTAButtonProps` type and from the destructured parameters. Search codebase for any call sites passing `variant` prop — none expected based on analysis showing all styling via className.

---

## 5.6 — Fix Menu Industry Sub-Links (All Point to Same Anchor)

**Priority:** Low — UX clarity improvement
**File:** `PublicHeader.tsx`
**Estimated Effort:** 30 minutes (add IDs to persona cards) or 15 minutes (remove sub-items)

### Summary

All three industry sub-links in the mobile menu go to `/#industries`. A user expanding "Industries" sees "General Contractors," "Property Managers," "Commercial Operators" — suggesting three distinct destinations. They're identical.

**Option A:** Add `id` attributes to each persona card in `OfferAndIndustrySection.tsx` and update links to `/#industry-gc`, `/#industry-pm`, `/#industry-commercial`. This gives each link a unique scroll target.

**Option B:** Remove industry sub-items from the mobile menu. Make "Industries" a single link to `/#industries` (no expand, same treatment as "About"). Simpler, removes the misleading sub-items.

**Recommendation:** Option B (simpler). The persona cards are vertically stacked — scrolling to `/#industries` already shows the first card, and the user scrolls naturally through all three.

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