# Mobile UX/UI Refresh 2.0 — Solution Architecture

Each issue gets 2-3 approaches ranked by recommendation. Rank 1 is what I'd build.

---

## Execution Scope (Phase 1 vs Phase 2)

This plan is now explicitly mobile-first in Phase 1, with desktop preservation as a hard boundary.

### Phase 1 (Ship First)
- Optimize mobile conversion flow, scroll depth, and CTA clarity.
- Preserve current desktop conversion landmarks and section architecture.
- Reclassify screenshot-only defects as repro-required before assigning engineering priority.

### Phase 2 (After Baseline + Phase 1 Data)
- Evaluate mobile section-order experiments.
- Consider cross-viewport architecture changes only if data supports them.

---

## Desktop Safety Contract

1. No mobile optimization replaces desktop composition unless explicitly approved as all-viewports.
2. Every structural change declares viewport scope and uses explicit responsive gates.
3. Desktop conversion landmarks remain intact in Phase 1:
   - inline QuoteSection
   - desktop services spread layout
   - desktop timeline expanded layout
4. Use feature flags for interaction-model changes where practical.

### Measurement Clause (Required)

Capture baselines before shipping Phase 1 changes:

- Desktop:
  - inline quote form completion rate
  - hero CTA CTR
  - section-level scroll depth
  - bounce rate by section
- Mobile:
  - quote funnel starts/completions
  - section engagement depth
  - CTA -> quote panel open -> submission conversion

### Repro-Required Policy

Any defect claim based only on screenshots must be marked "Needs Repro" until confirmed in runtime with device + viewport + interaction steps.

---

## Issue 1: Duplicate Form Rendering

**The problem:** Mobile users can encounter two quote experiences (inline QuoteSection in scroll + FloatingQuotePanel from CTA triggers), creating funnel overlap and potential confusion.

### Approach A (Rank 1): Viewport-Specific Canonical Funnel (Mobile Floating, Desktop Inline)
Use a canonical quote path per viewport in Phase 1:

- Mobile: floating panel is the primary quote experience.
- Desktop: keep inline QuoteSection in-page.

Every quote CTA still opens the floating panel; desktop keeps the inline section available as a stable conversion block.

The space where `QuoteSection` currently lives becomes a **conversion closer section** — not a form, but a final persuasion block:

```
Let's Talk About Your Project

✅ Quote within 24 hours
✅ No obligation walkthrough available  
✅ Bilingual crew coordination

★★★★★ "Zero punch list items." — James R., Prestige Developments

[Get Your Free Quote →]     (opens FloatingQuotePanel)
Or call directly: (512) 555-0199
```

**Why Rank 1:** It fixes mobile funnel ambiguity without risking desktop regression. It also creates a measurable transition path before any all-viewports architecture decision.

### Approach B (Rank 2): Floating Panel Only (All Viewports)
Remove inline QuoteSection on both mobile and desktop so every CTA routes to one modal flow.

**Why Rank 2:** Cleanest architecture but higher desktop conversion risk without A/B validation.

### Approach C (Rank 3): Visibility Gate
Keep both components but use intersection observer to hide the floating panel trigger when the inline `QuoteSection` is in viewport, and hide the inline form's submit area when the floating panel is open.

**Why Rank 3:** This is a band-aid. Two forms still exist in the DOM. The user can still encounter both through various scroll/interaction paths. Technical complexity for a problem that's better solved by removing duplication.

**Recommendation: Approach A.** Mobile canonical floating funnel + desktop inline preservation in Phase 1.

### Validation Requirement

Explicitly test the overlap scenario: user is scrolled to inline QuoteSection, then opens FloatingQuotePanel from a CTA. Confirm no broken or misleading form-on-form state.

### Social Proof Requirement (Conversion Closer)

The mobile conversion-closer block must include one concise proof fragment (rating + short quote or stat) adjacent to the CTA, not only in the standalone testimonial section.

---

## Issue 2: Hero Dead Zone (~400px of Empty Space)

**The problem:** After trust pills, roughly 350-400px of dark hallway image with no content before the Authority Bar.

### Approach A (Rank 1): Reduce Hero to 75svh + Pull Authority Into Hero Bottom
Shrink the hero from `100svh` to `75svh` on mobile. Move the Authority Bar stats (or a compressed version) into the bottom 20% of the hero as an overlay, creating a natural visual closeout.

```
┌─────────────────────────┐
│  A&A Cleaning    [Quote]│  ← header
│                         │
│  Every Surface.         │
│  Every Detail.          │
│  Every Time.            │
│                         │
│  [Get a Free Quote]     │
│  [Call Now: 512...]     │
│  ● Licensed  ● 1-Hr    │
│                         │
│ ┌─────────┬────────────┐│  ← overlaid on hero bottom
│ │  15+    │   500+     ││
│ │ Years   │ Projects   ││
│ └─────────┴────────────┘│
└─────────────────────────┘
│  What's Included...     │  ← next section starts naturally
```

Mobile-only change: `min-h-[75svh]` replaces `min-h-[100svh]` behind a responsive gate. Desktop stays `100svh`. Authority Bar renders inline on mobile inside the hero container instead of as a separate section.

**Why Rank 1:** This eliminates the dead zone completely. The buyer sees proof stats without scrolling past emptiness. The hero still feels immersive but doesn't waste space. The Authority Bar disappearing as a standalone section also saves another ~200px of scroll below.

### Approach B (Rank 2): Keep 100svh But Fill the Bottom Third
Keep full-screen hero but add a semi-transparent content band in the lower third with a scroll-down indicator and a one-line proof statement:

```
│  ● Licensed  ● 1-Hr  ● Español │
│                                  │
│  ─── 500+ projects completed ─── │
│              ↓                   │
└──────────────────────────────────┘
```

**Why Rank 2:** Preserves the cinematic feel if that's a firm brand preference. Fills the dead zone with content rather than eliminating the space. But it's a cosmetic fix for a structural problem — you're still asking mobile users to scroll through a full viewport of hero before reaching substance.

### Approach C (Rank 3): Aggressive — 60svh With Stacked Proof
Hero becomes `60svh` on mobile. Headline, one CTA button (quote), phone number as text link, trust pills. No image below the content band. Authority Bar sits immediately below as its own compact section.

**Why Rank 3:** Most conversion-efficient but loses the brand presence that makes A&A look premium. For a company selling to GCs and property managers, looking like a serious operation matters. Too aggressive a shrink makes you look like a template site.

**Recommendation: Approach A.** 75svh with authority stats pulled into the hero bottom. Best balance of brand presence and conversion efficiency.

---

## Issue 3: Services Scroll Wall (2,500px)

**The problem:** Five full-bleed service cards in sequence with identical format. Massive scroll burden.

### Approach A (Rank 1): Accordion With Rich Headers + Single Expansion
Mobile-only accordion. Desktop keeps current layout untouched. Each service header shows: title, gold response commitment, and a compact service type indicator. One panel open at a time. First service auto-expanded on load.

**Collapsed header (~70px each):**
```
┌─────────────────────────────────────┐
│ 🏗️  Post-Construction Clean         │
│ ● Under 1 hour callback        [+] │
└─────────────────────────────────────┘
```

**Expanded panel (~400px):**
```
┌─────────────────────────────────────┐
│ 🏗️  Post-Construction Clean         │
│ ● Under 1 hour callback        [−] │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │         [Service Image]         │ │
│ │          h-40 rounded           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Rough and final clean for new       │
│ construction projects. We handle    │
│ debris, dust, and detail so spaces  │
│ are move-in ready.                  │
│                                     │
│ ● Multifamily buildings             │
│ ● Commercial offices                │
│ ● Schools & institutional           │
│                                     │
│ [■ QUOTE THIS SERVICE →]           │
└─────────────────────────────────────┘
```

**Default scroll cost:** 1 expanded (~400px) + 4 collapsed (~70px × 4) = **~680px** total, down from ~2,500px. That's a **73% reduction** in this section alone.

```tsx
// Mobile-only accordion wrapper
<div className="md:hidden">
  {services.map((service) => {
    const isOpen = openService === service.anchor;
    return (
      <article key={service.anchor} className="border-b border-slate-100">
        <button
          type="button"
          className="flex w-full items-center gap-3 px-5 py-4 text-left"
          onClick={() => setOpenService(isOpen ? "" : service.anchor)}
          aria-expanded={isOpen}
        >
          <span className="text-xl">{service.icon}</span>
          <div className="flex-1">
            <p className="font-semibold text-[#0A1628]">{service.titleLines.join(" ")}</p>
            <p className="text-xs text-[#C9A94E]">{service.responsePromise}</p>
          </div>
          <ChevronIcon className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
        
        <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden">
            {/* image, description, bullets, CTA */}
          </div>
        </div>
      </article>
    );
  })}
</div>

{/* Desktop: existing full layout, unchanged */}
<div className="hidden md:block">
  {/* current ServiceSpreadSection content */}
</div>
```

**Why Rank 1:** Maximum scroll reduction. All content preserved. User chooses what to explore. The gold response promise visible on every collapsed header means the trust differentiator isn't hidden. Desktop is completely untouched.

### Accessibility Requirement

1. Toggle controls expose `aria-expanded` and programmatic association to expanded content.
2. Motion respects `prefers-reduced-motion` (instant open/close when reduced motion is enabled).
3. Expanded content is keyboard reachable and focus order remains logical.
4. Screen readers announce state changes clearly.

### Approach B (Rank 2): Horizontal Swipe Carousel
Services become swipeable cards. One card visible at a time with peek of the next. Dot indicators below. Each card contains: image (top half), title, description, one gold bullet, CTA.

```
┌───────────────────────┬──┐
│  [Service Image]      │  │ ← peek of next card
│                       │  │
│  Post-Construction    │  │
│  Clean                │  │
│                       │  │
│  Rough and final...   │  │
│  ● Under 1hr callback │  │
│                       │  │
│  [QUOTE THIS →]       │  │
└───────────────────────┘  │
    ● ○ ○ ○ ○              │
```

**Why Rank 2:** Very mobile-native interaction. Looks premium. But hides 4 of 5 services completely — discovery depends on the user swiping. Some users won't. The accordion lets you see all five titles at once and choose. Also, carousels have known accessibility issues and require more careful touch handling.

### Approach C (Rank 3): Top 2 Featured + "See All Services" Link
Show only Post-Construction and Final Clean as full cards (your likely highest-demand services). Below them: a compact list of remaining three as linked text rows. "See all services →" links to a dedicated `/services` page.

**Why Rank 3:** Cleanest scroll reduction but buries three services. Only works if you have strong analytics showing which services drive the most inquiries. Risky without data.

**Recommendation: Approach A.** Accordion with rich headers. Best balance of discoverability, scroll reduction, and content preservation.

---

## Issue 4: Quote Form Too Long

**The problem:** Six fields plus textarea in a single long form on mobile. High abandonment risk.

### Approach A (Rank 1): Two-Step Progressive Form
Step 1 captures minimum viable contact info (3 fields). Step 2 appears inline after Step 1 validates, asking for enrichment details. Step 1 data is captured even if the user abandons Step 2.

**Step 1 (above the fold of the form section):**
```
┌─────────────────────────────────┐
│  Get Your Free Quote            │
│                                 │
│  Name *                         │
│  ─────────────────────────────  │
│  Phone *                        │
│  ─────────────────────────────  │
│  Service Type *                 │
│  [Select service          ▼]   │
│                                 │
│  [■ GET MY QUOTE →]            │
│                                 │
│  🔒 We'll call within 1 hour   │
└─────────────────────────────────┘
```

**Step 2 (slides in after Step 1 validates):**
```
┌─────────────────────────────────┐
│  ✓ Got it! Help us quote faster │
│                                 │
│  Company Name                   │
│  ─────────────────────────────  │
│  Email                          │
│  ─────────────────────────────  │
│  Timeline                       │
│  [Select timeline         ▼]   │
│                                 │
│  Project Description (optional) │
│  ─────────────────────────────  │
│  ─────────────────────────────  │
│                                 │
│  [■ SUBMIT DETAILS →]          │
│                                 │
│  Or we'll ask when we call.     │
└─────────────────────────────────┘
```

**Critical behavior:** Step 1 submission creates the lead record immediately with name + phone + service type. This is enough for the admin to call. Step 2 is enrichment — nice to have, not required. If the user closes after Step 1, you still have a callable lead.

### Backend/API Contract (Required)

This is not only a frontend change. Two-step capture requires an explicit API/data contract:

1. Step 1 creates a lead with partial payload (name, phone, service type).
2. Step 2 updates the same lead record with enrichment fields (company, email, timeline, description).
3. Admin acknowledgement/notification triggers on Step 1 creation, not Step 2 completion.
4. Existing anti-abuse logic (honeypot, rate limiting, validation) must accept partial Step 1 payloads without breakage.
5. Analytics must distinguish:
  - `quote_step1_started`
  - `quote_step1_completed`
  - `quote_step2_viewed`
  - `quote_step2_completed`
  - `quote_step2_abandoned`

### Architecture Note (Container-Agnostic Form Logic)

Two-step form behavior (state machine, validation, transitions, API calls, analytics) must live in a shared form component/hook that is container-agnostic. `FloatingQuotePanel` and `QuoteSection` consume that shared behavior; containers own layout/styling only.

**Why Rank 1:** This is the industry-proven pattern. The first step feels effortless (3 fields, one tap). The commitment escalation after initial validation is a known conversion driver. And you capture the lead even on partial completion.

### Approach B (Rank 2): Smart Single Form With Progressive Disclosure
Keep a single form but show only Name, Phone, and Service Type initially. After the user fills in Service Type, the remaining fields animate in below with a "Help us quote faster (optional)" label.

**Why Rank 2:** Feels lighter than the full form but doesn't create a true commitment step. The user sees additional fields appearing, which can feel like a bait-and-switch. Also, no partial capture — the form only submits once, at the end.

### Approach C (Rank 3): Conversational Form
Replace the traditional form with a chat-like step-through: one question per screen, slide transitions, progress bar. "What's your name?" → "Best phone number?" → "What service do you need?" → "Any details to share?"

**Why Rank 3:** Highest engagement when done well, but highest engineering cost and hardest to maintain. Also feels overly designed for a commercial cleaning inquiry — GCs and property managers want to fill out a form fast, not have a conversation with a UI.

**Recommendation: Approach A.** Two-step progressive form. Capture the lead on step 1. Enrich on step 2. Proven pattern, moderate build effort, highest conversion impact.

---

## Issue 5: "CHECK AVAILABILITY" CTA Clipped by AI Trigger

**The problem:** AI assistant floating trigger overlaps the service area CTA.

### Approach A (Rank 1): Scroll-Aware AI Trigger Visibility
The AI trigger only appears after the user has scrolled past the hero AND is not within 200px of any primary CTA. Use an intersection observer on key CTA elements to temporarily hide the trigger when they're in viewport.

```tsx
// Simplified concept
const ctaVisible = useIntersectionObserver([
  heroCtaRef, 
  serviceAreaCtaRef, 
  quoteFormRef
]);

<div className={`fixed bottom-20 right-4 transition-opacity ${
  ctaVisible ? "opacity-0 pointer-events-none" : "opacity-100"
}`}>
  <AIAssistantTrigger />
</div>
```

**Why Rank 1:** The AI trigger remains discoverable but never fights with conversion CTAs. Smart behavior that respects the user's current context.

### Approach B (Rank 2): Relocate AI Trigger to Menu
Remove the floating trigger entirely. Add "AI Assistant" as a menu item or a persistent small icon in the header bar. The assistant is available everywhere but never competes with page content.

**Why Rank 2:** Cleanest solution for layout, but significantly reduces AI assistant discovery and usage. If the assistant is a meaningful feature, burying it in navigation is a tradeoff.

**Recommendation: Approach A.** Context-aware visibility. Keep it accessible but respectful.

---

## Issue 6: What's Included — Visually Flat

**The problem:** Three white cards with bold titles and body text. No visual anchors, no hierarchy, looks like documentation.

### Approach A (Rank 1): Process Rail With Icons and Metrics
Replace cards with a horizontal visual flow on desktop, vertical compact tiles on mobile. Each tile gets: an icon, a strong title, a one-line outcome, and a proof metric.

**Mobile layout:**
```
WHAT'S INCLUDED
A clear process from first call to final clean

┌─ 📋 ──────────────────────────────┐
│  Scope-Driven Planning             │
│  Crew and schedule aligned before  │
│  first arrival.                    │
│                                    │
│  "Zero wasted site visits"         │
└────────────────────────────────────┘
         │  (connecting line)
┌─ 🎯 ──────────────────────────────┐
│  Detail-Level Delivery             │
│  Rough-to-final standards in one   │
│  workflow.                         │
│                                    │
│  "100% handoff focus"              │
└────────────────────────────────────┘
         │
┌─ 💬 ──────────────────────────────┐
│  Fast Communication                │
│  Bilingual updates, no handoff     │
│  blind spots.                      │
│                                    │
│  "Direct line to crew lead"        │
└────────────────────────────────────┘
```

The connecting lines create directional flow. The quoted metrics at the bottom of each tile give each card a unique proof point. The icons create immediate visual differentiation.

**Key differentiation from How It Works:** This section answers "what do you get?" (deliverables/standards). How It Works answers "what happens when you hire us?" (timeline/process). The process rail format for What's Included emphasizes *commitments*. The stepper format for How It Works emphasizes *sequence*.

**Why Rank 1:** Transforms the weakest section into a visually distinctive value proposition. The connecting flow creates narrative movement. Each card earns its space with a unique proof point.

### Approach B (Rank 2): Featured Center Card Pattern
Three cards, but the middle one ("Detail-Level Delivery") gets a contrasting background (dark navy or gold accent), slightly larger, with "THE A&A STANDARD" label. The flanking cards are lighter/smaller.

**Why Rank 2:** Less engineering effort. Creates hierarchy through contrast. But the section still reads as "three boxes" rather than a cohesive value narrative.

### Approach C (Rank 3): Merge Into Authority Bar
Eliminate What's Included as a standalone section. Move its content into the Authority Bar as additional context under each stat. "15+ Years" → "15+ Years of Scope-Driven Planning." "500+ Projects" → "500+ Detail-Level Deliveries."

**Why Rank 3:** Maximum scroll reduction (eliminates ~350px entirely). But you lose the section as a standalone storytelling moment. The Authority Bar becomes overloaded.

**Recommendation: Approach A.** Process rail with icons, outcomes, and proof metrics. Clear differentiation from How It Works through framing (commitments vs. sequence).

---

## Issue 7: How It Works — Text Wall on Mobile

**The problem:** Four identical text blocks (~800px total) with no visual relief.

### Approach A (Rank 1): Compact Stepper With Icons + Single Expansion
Four steps always visible as compact rows. Tapping one expands it with detail text. Untapped steps show only: step number, icon, title.

**Default state (~320px total):**
```
PROCESS
How It Works

┌──────────────────────────────────┐
│ 01  📞  Request a Quote      [−]│
│                                  │
│ Submit our form or call directly.│
│ We review the request quickly    │
│ and confirm the next step during │
│ business hours.                  │
└──────────────────────────────────┘
┌──────────────────────────────────┐
│ 02  🔍  We Assess            [+]│
└──────────────────────────────────┘
┌──────────────────────────────────┐
│ 03  🧹  We Clean             [+]│
└──────────────────────────────────┘
┌──────────────────────────────────┐
│ 04  ✅  You Walk Through     [+]│
└──────────────────────────────────┘
```

**Why Rank 1:** All four steps are visible and scannable at a glance (~320px vs ~800px). The user can expand any step for detail. Icons provide instant visual differentiation between steps. The colored step labels ("FAST INTAKE", "SCOPE CLARITY") stay visible in the collapsed row.

### Accessibility Requirement

1. Toggle controls expose `aria-expanded` and clear button semantics.
2. Motion respects `prefers-reduced-motion` for panel transitions.
3. Expanded step content remains keyboard accessible in natural tab order.
4. State changes are announced for assistive technology.

### Approach B (Rank 2): Horizontal Snap-Scroll Cards
Four cards in a horizontal scroll container. Each card is roughly 80% viewport width. Swipe to advance. Progress dots below.

**Why Rank 2:** Very mobile-native. Each step gets visual breathing room. But you lose the scanability of seeing all four steps at once — you have to swipe to discover. For a 4-step process that's meant to build confidence, seeing the full arc matters.

### Approach C (Rank 3): Remove Section, Merge Into Confirmation Page
Eliminate How It Works from the homepage entirely. This information is most relevant *after* someone submits a quote — tell them the process on the confirmation page (F-17) where it contextualizes what happens next.

**Why Rank 3:** Radical scroll reduction (~800px gone). But How It Works does serve a pre-conversion purpose: showing that your operation is organized and professional. Removing it from the homepage weakens the "we have our act together" signal.

**Recommendation: Approach A.** Stepper with icons and single expansion. Scannable, compact, still detailed on demand.

---

## Issue 8: "Discuss Your Project" Is a Text Link

**The problem:** The most valuable CTA on the Who We Serve cards (routing qualified persona traffic) is styled as a plain text link.

### Approach A (Rank 1): Full Button Treatment + Persona Page Routing
Replace text link with a styled button. Route to dedicated persona pages where content exists, or to the quote form with service-type pre-selected where it doesn't.

```tsx
const handlePersonaCTA = (persona: Persona) => {
  if (persona.hasPublishedPage) {
    router.push(`/industries/${persona.slug}`);
    return;
  }

  // Fallback path: open quote flow with persona-mapped default service type
  openQuote({
    presetServiceType: persona.defaultServiceType,
    source: `industry_${persona.slug}_fallback`,
  });
};
```

Personalize the CTA text per card: "Discuss Your Closeout Project", "Discuss Your Property Turns", "Discuss Your Facility Needs".

**Why Rank 1:** Button treatment makes the CTA visible. Personalized text makes it feel relevant. Conditional routing means you don't need all persona pages ready to ship the improvement.

### Approach B (Rank 2): Keep Text Link Style But Make It Larger
Increase font size, add underline, add arrow icon. Keep the lightweight visual feel of a link but ensure it meets touch targets and is visually obvious.

**Why Rank 2:** Lower effort but lower impact. Still looks like secondary navigation rather than a primary action.

**Recommendation: Approach A.** Full button, personalized text, conditional routing.

---

## Issue 9: Burger Menu — No Visual Hierarchy

**The problem:** All items have equal visual weight. No quote CTA in menu body. Dark-on-dark feels heavy.

### Approach A (Rank 1): Action Band + Grouped Navigation + Lighter Treatment
Restructure the menu into three zones: action band (top), navigation (middle), contact info (bottom).

```
┌──────────────────────────────────┐
│  A&A Cleaning         [FREE QUOTE] ✕  │
├──────────────────────────────────┤
│                                  │
│  ┌────────────┐ ┌─────────────┐  │
│  │ 📞 Call Now │ │ 💬 Quote    │  │
│  │ (512) 555  │ │ Request     │  │
│  └────────────┘ └─────────────┘  │
│                                  │
│  ─── EXPLORE ────────────────    │
│                                  │
│  Services                    ›   │
│  Industries                  ›   │
│  Service Area                    │
│  About                           │
│                                  │
│  ─── RESOURCES ──────────────    │
│                                  │
│  FAQ                             │
│  Careers                         │
│                                  │
├──────────────────────────────────┤
│  AAcleaningservices@outlook.com  │
│  Serving Austin metro area       │
│  © 2026 A&A Cleaning             │
└──────────────────────────────────┘
```

**Key changes:**
- Two action buttons at top (Call + Quote) as a distinct visual band with background contrast
- Navigation items are plain text without borders — cleaner, faster to scan
- Revenue-driving items (Services, Industries, Service Area) grouped under "EXPLORE"
- Support items (FAQ, Careers) grouped under "RESOURCES"
- Services and Industries get chevrons indicating expandable sub-menus
- Remove bordered pill treatment from all items — use spacing and typography for hierarchy
- Slightly lighter background or subtle gradient to reduce dark-on-dark heaviness

**Why Rank 1:** Clear action priority. Visual hierarchy through grouping and typography, not borders. The user can find "get a quote" within 1 second of opening the menu.

### Approach B (Rank 2): Minimal Menu — Actions Only + Smart Routing
Drastically simplify: the menu becomes just 4-5 tappable items. Call, Quote, Services (expands inline), and About. Everything else accessed from footer or dedicated pages.

**Why Rank 2:** Fastest scan time. But hides too many navigation paths. Users who want FAQ or Service Area are forced to scroll the full page to find them.

**Recommendation: Approach A.** Action band + grouped navigation. Gives the menu actual hierarchy.

---

## Issue 10: Careers Section Too Large for Homepage

**The problem:** ~600px of scroll dedicated to recruiting on a customer-conversion page.

### Approach A (Rank 1): Collapse to Compact Banner + Dedicated /careers Route
Replace the full careers section with a single compact banner (~120px) and move all detail to `/careers`.

```
┌──────────────────────────────────────┐
│  We're Building a Team               │
│  20+ members · 4.8★ Glassdoor       │
│  [See Open Positions →]              │
└──────────────────────────────────────┘
```

The `/careers` page gets the full content: perks, stats, team culture detail, application process.

**Why Rank 1:** Reduces scroll by ~480px. Keeps the employer brand signal present. Doesn't waste customer attention. The people who want to apply will click through — they don't need the pitch on the homepage.

### Approach B (Rank 2): Move Entirely to Footer
Remove the careers section from the page body. Add a "Careers" link in the footer navigation (already exists) and add a single line in the footer CTA block: "We're hiring — join our team →"

**Why Rank 2:** Maximum scroll savings. But completely removes the employer brand signal from the homepage. If you're actively recruiting (which the 20+ team size and Glassdoor rating suggest), having zero presence above the footer might hurt.

### Approach C (Rank 3): Keep but Compress
Keep in the homepage body but compress to the stats + one perk row. No full perk cards.

**Why Rank 3:** Partial improvement. Still takes ~350px for content that doesn't serve the primary conversion goal.

**Recommendation: Approach A.** Compact banner + dedicated route. Best balance of presence and efficiency.

---

## Issue 11: Testimonial Section — Generic Headline + Compact Opportunity

**The problem:** "What Clients Say" headline is generic. Section takes significant space for one visible review.

### Approach A (Rank 1): Reframe Headline + Add Count + Compact Card
Change headline. Add review volume. Tighten the card.

```
Trusted by Austin's Toughest Projects
────────────────────────────────────

★★★★★  TURNOVER SUPPORT  │ 1 of 7

"Fast turnaround, professional crew,
zero punch list items. A&A sets the
standard for construction cleaning."

— James Rodriguez
  Operations Director, Prestige Developments

          ‹  ● ● ● ● ● ● ●  ›
```

**Changes:** The headline earns attention. "1 of 7" communicates volume. The card itself is similar but the framing is stronger.

**Why Rank 1:** Small effort, meaningful impact. The headline does the heavy lifting.

### Approach B (Rank 2): Multi-Testimonial Preview
Show 2-3 testimonials in compact form simultaneously, with the full text on tap:

```
★★★★★ "Fast turnaround, professional crew..."
       — James R., Prestige Developments
       
★★★★★ "Best cleaning team we've worked with..."  
       — Sarah M., Horizon Properties

★★★★★ "On time, every time. Crew is excellent..."
       — David L., Summit Construction

[Read All Reviews →]
```

**Why Rank 2:** Stronger social proof through volume visibility. But requires enough strong testimonials to fill the space, and the compact format sacrifices the emotional impact of a full quote.

**Recommendation: Approach A.** Headline reframe + count indicator. Highest impact per effort.

---

## Issue 12: Footer CTA Block Too Wordy

### Single Approach (Simple Fix)
Cut to one line + CTA:

**Current (~200px):**
> Bring A&A in before the handoff gets rushed. Construction-ready cleaning support for final walkthroughs, active commercial spaces across the Austin metro. Standards-driven facility care for contractors, property teams, and commercial spaces that need clean handoff quality.

**Proposed (~100px):**
```
Ready to get started?
[Get Your Free Quote →]    [Call (512) 555-0199]
```

That's it. The user is at the bottom of the page. They either want to act or they're leaving. Give them the action, not more copy.

---

## Aggregate Scroll Impact Estimate

If all Rank 1 approaches are implemented:

| Section | Current | After | Savings |
|---|---|---|---|
| Hero | ~850px | ~600px (75svh) | ~250px |
| Authority Bar | ~420px | 0px (merged into hero) | ~420px |
| What's Included | ~350px | ~400px (process rail, slightly taller but richer) | -50px |
| Services | ~2,500px | ~680px (accordion) | ~1,820px |
| Who We Serve | ~1,200px | ~1,100px (button treatment, minor) | ~100px |
| Before/After | ~600px | ~600px (no change) | 0px |
| Testimonials | ~420px | ~380px (compact) | ~40px |
| How It Works | ~820px | ~320px (stepper) | ~500px |
| About | ~550px | ~500px (minor trim) | ~50px |
| Service Area | ~600px | ~550px (minor) | ~50px |
| Quote Form | ~800px | ~240px (mobile conversion closer + desktop inline retained) | ~560px |
| Careers | ~600px | ~120px (banner) | ~480px |
| Footer | ~700px | ~600px (copy trim) | ~100px |
| **Total** | **~10,410px** | **~6,090px** | **~4,320px (41% reduction)** |

That puts you near 6,000px on mobile while preserving desktop conversion architecture in Phase 1. Within 2-3 scrolls, the user hits services. Within 5-6 scrolls, they've seen proof, process, and persona content. The quote flow remains one tap away at any point.

---

## Build Sequence (If Starting Now)

| Order | Work | Why This Position | Est. Effort |
|---|---|---|---|
| **0** | Baseline instrumentation capture (desktop + mobile) | Required for valid pre/post decisions | 3-5 hours |
| **1** | Resolve quote funnel overlap (mobile canonical floating, desktop inline preserved) | Removes mobile ambiguity without desktop risk | 2-3 hours |
| **2** | Two-step progressive form (mobile first) + API contract update | Highest conversion impact and highest contract sensitivity | 6-8 hours |
| **3** | Services accordion | Biggest scroll reduction | 4-6 hours |
| **4** | Hero 75svh + authority merge | Every visitor sees this first | 3-4 hours |
| **5** | Menu hierarchy refresh | Fast conversion win from navigation | 2-3 hours |
| **6** | How It Works stepper | Scroll reduction + visual upgrade | 2-3 hours |
| **7** | What's Included process rail | Weakest section, biggest visual upgrade | 3-4 hours |
| **8** | Careers collapse + /careers route | Scroll reduction | 2-3 hours |
| **9** | Who We Serve button treatment | Missed conversions from qualified traffic | 1-2 hours |
| **10** | Testimonial reframe | Low effort, meaningful polish | 1 hour |
| **11** | Footer copy trim | Quick cleanup | 30 min |
| **12** | AI trigger scroll-awareness | Prevents CTA overlap in high-intent regions | 2-3 hours |

**Total estimated effort: ~32-46 hours / ~5-6 focused dev days**

### Step 0 Deliverable (Concrete)

Step 0 is complete only when an instrumentation patch is merged that captures:

1. Section-view events (intersection observer per homepage section):
  - `event`: `section_view`
  - `section_id`: string (hero, authority, services, etc.)
  - `viewport`: `mobile` | `desktop`
  - `action`: `enter` | `exit`
  - `time_in_view_ms`: number
2. Scroll-depth milestones:
  - `event`: `scroll_depth`
  - `depth`: `25` | `50` | `75` | `100`
  - `viewport`: `mobile` | `desktop`
3. Quote funnel events (extending existing CTA instrumentation):
  - `quote_panel_opened` (with source CTA id)
  - `quote_form_started` (first field focus)
  - `quote_form_submitted`
  - `quote_form_abandoned` (panel/flow closed with non-empty fields)

Baseline collection window: 5-7 days before Phase 1 behavior changes ship.

### Recommended Delivery Cut Line

If implementation must be split, use this cut:

- Wave A (Steps 0-5): highest conversion/scroll impact, architecture-critical changes.
- Wave B (Steps 6-12): polish, secondary conversion lifts, and refinement.

This allows parallel progress with other P0 spec corrections while still shipping the largest mobile UX gains early.

---

## Phase 2: Section-Order Experiment (Deferred)

After Phase 1 and baseline comparison, run controlled mobile IA experiments.

### Candidate A (Conversion-forward mobile order)
Hero -> Services (accordion) -> Before/After -> Testimonials -> Who We Serve -> How It Works (stepper) -> Service Area -> About (compact) -> Careers (banner) -> Footer

### Candidate B (Current order, compressed components only)
Keep current section order with only component-level compression from Phase 1.

### Decision Rule

Adopt reordered IA only if post-launch metrics show clear improvement in:

- mobile quote starts and completions
- services engagement depth
- drop-off reduction before primary conversion sections
- no meaningful desktop regression in baseline comparison window

Let me know which items you want full implementation specs for and I'll write them at the same FIND/REPLACE precision level as your hardening spec.