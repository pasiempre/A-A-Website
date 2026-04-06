# Full Mobile Site Audit — Screenshot-Verified Deep Analysis

---

## Section-by-Section Grading

### 1. HERO — Grade: C+

**What the document said:** Dead zone ~400px, needs shrink to ~75svh or pull Authority Bar up. CLS fix pending. Subtitle contrast issue.

**What I see confirmed:**

The hero is still rendering at **100svh default** — the compact variant (`?hero=compact`) is clearly not active in these screenshots. After the trust pills ("Licensed & Insured / 1-HR Response / Habla Español"), there is a massive dark hallway void. I'm estimating **~380-420px of zero-content space** between the trust pills and the Authority Bar. On a ~390px-wide phone, that's a full screen of nothing. Every single visitor scrolls through dead air before reaching any substance.

**Specific flaws:**

| Finding | Severity |
|---|---|
| Dead zone between trust pills and Authority Bar is the single worst UX moment on the page | **Critical** |
| Subtitle "Post-construction & commercial cleaning across the Austin metro area" is losing contrast — readable but straining against the hallway image. No `text-shadow` or backdrop treatment applied | **Moderate** |
| Hero image (hallway perspective) is atmospheric but says nothing about cleaning, results, or people — a property manager scrolling fast sees a dark corridor, not a cleaning company | **Moderate** |
| Trust pills are positioned mid-hero, leaving the entire bottom third wasted. They should be the last element before the fold, not floating in the middle of a dark image | **Significant** |
| "GET A FREE QUOTE" and "CALL NOW" buttons are well-differentiated — this works | ✅ |
| Headline "Every Surface. Every Detail. Every Time." is strong and communicates scope | ✅ |

**Cross-reference verdict:** The document's §15.4 "Hero Decision Gate" called for a measured comparison between 100svh and 70-80svh. The compact variant was implemented per the solution architecture (Issue #2, marked ✅). But these screenshots are running **default**, meaning either the variant isn't the default experience or it wasn't activated for this capture. Either way, the user's real first experience is this 100svh version, and it's damaging.

**What needs to happen:**
1. Make 75svh the **default** on mobile, not an opt-in variant. The A/B test should compare 75svh (default) vs 100svh (variant), not the other way around. The burden of proof should be on keeping the dead zone, not on removing it.
2. Apply `text-shadow: 0 1px 3px rgba(0,0,0,0.6)` or a semi-transparent backdrop strip behind the subtitle.
3. Move trust pills to the absolute bottom of the hero content area so they're the transition element into the next section, not floating mid-void.
4. Long-term: replace the hallway image with something that shows either (a) a clean result, (b) a uniformed crew at work, or (c) a before/after comparison. The hallway is generic stock photography energy.

---

### 2. AUTHORITY BAR — Grade: B-

**What the document said:** "Licensed & Insured" card has too much sub-text. "Our Numbers Speak" is generic. Star rating capsule feels disconnected.

**What I see confirmed:**

The 2×2 grid is structurally fine. Numbers are prominent. But:

| Finding | Severity |
|---|---|
| "Our Numbers Speak" is a dead headline — every service site says this. The numbers themselves should be the headline. "15 Years Cleaning Austin Job Sites" is more powerful than "Our Numbers Speak" as the section headline | **Moderate** |
| "Licensed & Insured" card has **four lines** of tiny uppercase sub-text: "AUSTIN STANDARDS / READY FOR COMMERCIAL AND SITE WORK". Nobody reads this. On a phone this is visual noise that makes the card feel heavier than its neighbors | **Moderate** |
| "100% ON-TIME HANDOFF FOCUS" — "Focus" is a hedge word. Either you're 100% on-time or you're not. If the claim is real, drop "focus." If it's aspirational, don't put 100% next to it | **Low-Moderate** |
| Star rating capsule ("Trusted across Austin-area job sites, office spaces, and turnovers") floats between Authority Bar and What's Included with no clear visual parentage — it looks orphaned | **Moderate** |
| 15+ and 500+ are strong social proof numbers — these work | ✅ |

**What needs to happen:**
1. Headline → "15+ Years. 500+ Spaces. Austin's Standard." — make the numbers *be* the headline.
2. "Licensed & Insured" card → trim sub-text to one line maximum: "Fully licensed for commercial & construction."
3. "100% On-Time Handoff Focus" → either "100% On-Time Handoff Rate" (if provable) or change to "Zero-Delay Handoff Commitment."
4. Star rating capsule → absorb into the grid as a fifth element or move it into the hero as the last trust chip before the fold. Its current orphaned position hurts both sections.

---

### 3. WHAT'S INCLUDED — Grade: D+

**What the document said:** "Weakest section visually." Flat cards, no hierarchy, no icons. Option B (process rail: Plan → Deliver → Closeout) recommended.

**What I see confirmed:**

This is exactly as bad as the document described. Three white cards with bold titles and body text. No icons, no color differentiation, no visual anchors. The eye slides across all three cards without registering any of them.

| Finding | Severity |
|---|---|
| Three cards have **identical visual weight** — no card is featured, no card stands out. The user's eye has no entry point | **High** |
| No icons. The titles "Scope-Driven Planning," "Detail-Level Delivery," "Fast Communication" are good, but without a visual anchor they read like bullet points in a proposal, not a value proposition | **High** |
| No transition into Services section below. The section just ends and accordion headers start. There's no directional cue, no "Here's what we do" bridge | **Moderate** |
| "A clear process from first call to final clean" is a decent headline — it sets expectation correctly | ✅ |
| The three content blocks are legitimate differentiators — the copy is fine, the presentation is failing it | Observation |

**The deeper problem:** This section competes conceptually with "How It Works" later on the page. "What's Included" describes the process (planning, delivery, communication). "How It Works" describes the process (intake, scope, execution, closeout). A user scrolling through both sections gets two versions of "here's our process" — one as flat cards, one as numbered steps. **This is thematic redundancy.**

**What needs to happen:**
1. **Either merge with How It Works or differentiate sharply.** If What's Included stays, it needs to answer "What do I get?" (deliverables/outcomes), not "How do you work?" (process). Right now it's answering the process question, which How It Works also answers.
2. If keeping as standalone: implement the **process rail** (Option B from §3 of the document). Three nodes connected by a visual spine: Plan → Deliver → Closeout. Each node gets an icon, a one-line value statement, and a proof metric beneath.
3. Add a directional transition element at bottom: "Here's what this looks like across our five core services ↓" — bridging into the accordion.
4. Consider relocating this section to **after Services and Who We Serve**, reframing it as "The A&A Standard" — a summary of what every engagement includes, regardless of service type. This makes it a consolidation rather than a preamble.

---

### 4. SERVICES ACCORDION — Grade: B+

**What the document said:** Accordion implemented (Issue #3 ✅). First service should be auto-expanded. Images load regardless of panel state (code review finding). Needs conversion weighting.

**What I see confirmed:**

The accordion **is implemented and working.** Five services shown as collapsed headers with icons, service titles, and gold response-commitment text. This is a massive improvement over the old 2,500px scroll wall. The gold callout lines ("Call-back target: under 1 hour during business hours") are visible on each header — excellent trust signal that differentiates from competitors.

| Finding | Severity |
|---|---|
| **All five services are collapsed.** No default expansion. A user sees five closed rows and has to actively choose one to tap. This creates a decision-paralysis moment. The document recommended first service auto-expanded — that's not happening | **Significant** |
| No visual indication of which service is most popular or most relevant. All five headers have equal weight. Consider a "Most Requested" badge on Post-Construction or Final Clean | **Moderate** |
| The expand indicator is a plain `+` character. Functional but doesn't communicate "rich content inside." Consider a slightly more descriptive affordance — even just "View Details +" or a rotating chevron | **Low** |
| Icon + title + gold response text per header is strong — communicates service identity and operational commitment without requiring expansion | ✅ |
| Five services in ~400px of collapsed headers vs. ~2,500px of full cards = approximately 2,100px saved. This is a huge win | ✅ |

**One concern from the code review:** All 5 service images load regardless of panel state. This won't be visible in screenshots but it's a performance concern, especially on mobile data connections. The lazy loading recommendation from the ServiceSpreadSection review hasn't been confirmed as fixed.

**What needs to happen:**
1. **Auto-expand the first service** (Post-Construction Clean) on load. This gives the user immediate content to engage with and demonstrates what's behind each accordion panel.
2. Add a "Most Requested" or "Featured" badge to one service header. If GCs are your primary audience, Post-Construction is probably the right choice.
3. Confirm image lazy loading is implemented — either conditional rendering (`{isOpen && <Image ... />}`) or native `loading="lazy"`.
4. Per §15.3 social proof placement rules: add one contextual proof line inside each expanded panel (e.g., "200+ final cleans completed this year").

---

### 5. WHO WE SERVE — Grade: B-

**What the document said:** Persona copy is strong. "Discuss Your Project" needs button treatment. "TALK THROUGH YOUR SCOPE" button is misplaced before cards. Cards are tall (~350-400px each).

**What I see confirmed:**

The persona cards are genuinely well-written. "Punch-list pressure and inconsistent final-clean quality across trades can slow handoff" — that's language a GC actually thinks. The stats (200+ closeouts, 48hr turnaround, 15+ facilities) are specific and credible. The "BEST SUITED FOR" lists help buyers self-select.

| Finding | Severity |
|---|---|
| **"Discuss Your Project →" is still a text link, not a button.** This is the primary conversion path for the highest-qualified traffic on the page (people who've self-identified as GCs, PMs, or commercial operators), and it has the weakest visual treatment of any CTA on the entire page. It's literally an arrow link sitting at the bottom of a tall card | **High** |
| **"TALK THROUGH YOUR SCOPE →" button appears ABOVE the persona cards.** It asks the user to take action before they've seen who they are. This is backwards. The call-to-action should come after the value proposition, not before it | **Significant** |
| Three persona cards stacked = ~1,100-1,200px of scroll. Each card is well-crafted individually, but together they're another scroll wall. The document suggested horizontal swipe — that's worth considering since there are exactly three cards (natural carousel count) | **Moderate** |
| "Built for Demanding Spaces" headline is good but slightly vague. "Who Hires A&A" or "Built for Your Project Type" might be more direct for self-identification | **Low** |
| Category pills ("WALKTHROUGH-READY CLOSEOUTS", "FASTER TURNOVER FLOW", "CLEAN WITHOUT DISRUPTION") are excellent micro-headers that frame each persona's primary concern | ✅ |
| Stats per card are specific and credible | ✅ |

**Cross-reference with §16.4:** The directive says "Discuss Your Project" CTAs should route to dedicated industry vertical pages. Those pages aren't built yet (§15.5 says build template now, publish selectively). Currently these links presumably route to the general quote flow. That's acceptable for now, but the CTA text should at least reflect what happens — "Get a [Service Type] Quote" is more honest than "Discuss Your Project" if it just opens a form.

**What needs to happen:**
1. **"Discuss Your Project →" becomes a full button.** Dark filled button, same visual weight as "GET A FREE QUOTE" elsewhere on the page. This is the single highest-impact small change on the entire page.
2. **Move or remove "TALK THROUGH YOUR SCOPE →" button.** Either relocate it below all three cards as a fallback CTA ("Not sure which fits? Talk through your scope →"), or remove it entirely and let each card's CTA do the work.
3. Consider making "Discuss Your Project" say "Get a Quote" or "Quote This Project Type" — language that matches the actual next action.
4. Mobile layout option: horizontal scroll carousel for the three cards with peek visibility of the next card. They're self-contained, equal weight, and exactly three — this is a natural carousel pattern.

---

### 6. SEE THE DIFFERENCE (Before/After) — Grade: B

**What the document said:** "See the Difference" is a weak headline. Metadata labels read like form labels. Slider is engaging.

**What I see confirmed:**

The slider mechanism is the best interactive element on the entire page. "DRAG TO COMPARE" is clear, the category tabs (Commercial Office / Apartment Turn / Post-Construction) let users self-select relevant proof, and the project metadata below is specific and credible.

| Finding | Severity |
|---|---|
| "See the Difference" is a generic headline. This is your **strongest proof section** — it should be framed as evidence, not a gimmick. "The A&A Standard" or "Proof of Work" positions this as verification | **Moderate** |
| "THE A&A STANDARD" is already the section label above "See the Difference" — which means the strong brand framing exists but is tiny uppercase tracking text, while the generic headline is the prominent element. **Swap them.** Make "The A&A Standard" the headline, make "See the Difference" the subtitle or remove it | **Moderate** |
| Metadata labels (PROJECT, SCOPE, RESULT, KEY BENEFIT) are all-caps small text that reads like a database schema, not persuasive content. "RESULT: Final Presentation" doesn't sell anything. The result line should be the hero: **"Inspection-ready in one pass"** as a large callout, with scope and project as supporting context | **Moderate** |
| Category tabs work well — they let users find their relevant proof type | ✅ |
| Carousel dots suggest 4+ examples — good depth | ✅ |
| Slider is tactile and engaging | ✅ |

**What needs to happen:**
1. Headline → "The A&A Standard" (promoted from section label). Subtitle → "Compare the before and after — the results speak for themselves."
2. Invert the metadata hierarchy: make RESULT the large text, make PROJECT/SCOPE/KEY BENEFIT the supporting details beneath.
3. Consider adding a micro-CTA after the metadata: "Want this for your space? →" linking to quote panel with the service type pre-selected.

---

### 7. TESTIMONIALS — Grade: C+

**What the document said:** "What Clients Say" is a dead headline. No count indicator. Carousel is fine but takes significant space for one review.

**What I see confirmed:**

| Finding | Severity |
|---|---|
| "What Clients Say" is exactly the generic headline predicted. Offers zero brand value. Every cleaning company, every contractor, every service business uses this headline | **Moderate** |
| Only one testimonial visible. Carousel dots show 4 total. No "1 of 4" text indicator. A user doesn't know if this is the only testimonial or one of many. Volume matters for credibility — a GC wants to know other GCs trust this company | **Moderate** |
| The testimonial itself is strong: "A&A Cleaning has been our go-to subcontractor for three years. Reliable, detail-oriented, and always on schedule." + attribution to Marcus Torres, Project Manager at a top-tier construction company. This is real social proof | ✅ |
| Category pill "POST-CONSTRUCTION" helps relevance matching | ✅ |
| Dark background creates good visual contrast break | ✅ |

**What needs to happen:**
1. Headline → "Trusted by Austin's Toughest Projects" or drop the headline entirely and let the quote speak.
2. Add "1 of 4" or "4 verified reviews" count indicator near the carousel dots.
3. Consider a compact pull-quote format: star rating + one-line excerpt + name/title, with "Read full review" expanding the card. This reduces vertical space while showing more volume.

---

### 8. HOW IT WORKS — Grade: C-

**What the document said:** ~800-900px text wall. Four identical text blocks. No visual differentiation. Intro paragraph redundant. Stepper accordion recommended.

**What I see confirmed:**

This section is exactly the text wall the document warned about. Four steps, each rendered as: large number → colored label → bold title → paragraph. No icons, no images (hidden on mobile), no visual relief between steps. The intro paragraph ("The workflow stays simple: rapid intake, clean scope alignment, disciplined execution, and a handoff that feels ready.") literally summarizes the four steps that follow — making it redundant.

| Finding | Severity |
|---|---|
| **~850px of pure text blocks with no visual relief.** Steps 01-04 are visually identical. By step 03 the user is scrolling, not reading | **High** |
| Intro paragraph restates the four steps. Remove it entirely or reduce to a single short line | **Moderate** |
| Step labels (FAST INTAKE, SCOPE CLARITY, CREW EXECUTION, CLOSEOUT READY) are actually excellent — industry-specific and professional. But they're undermined by the flat presentation | **Moderate** |
| No icons on mobile. The desktop version has images that are hidden at mobile breakpoints, leaving skeleton text blocks | **Moderate** |
| **Thematic overlap with What's Included.** What's Included says: Planning → Delivery → Communication. How It Works says: Intake → Scope → Execution → Closeout. These are two versions of the same narrative (our process) with different framing | **Significant** |

**The fundamental question:** Does this page need both What's Included AND How It Works? They're answering the same question ("what happens when I hire you?") from slightly different angles. This is the redundancy the document flags in §16.2 and §16.7.

**What needs to happen (two options):**

**Option A — Merge:** Combine What's Included and How It Works into a single "How A&A Works" section. Use the 4-step structure with icons, but incorporate the What's Included messaging into each step. Step 1 (Intake) includes the "Fast Communication" value. Step 2 (Scope) includes the "Scope-Driven Planning" value. Steps 3-4 include "Detail-Level Delivery." This eliminates one full section (~400px saved) and strengthens the remaining one.

**Option B — Differentiate sharply:** Keep both, but make What's Included about **outcomes/deliverables** ("what you get") and How It Works about **process/timeline** ("how it goes"). Currently both are about process, which is why they feel redundant.

Either way, How It Works on mobile needs the **stepper treatment** from §6 of the document: compact cards, one expanded at a time, icons per step, progress indicator.

---

### 9. ABOUT A&A — Grade: B+

**What the document said:** Surprisingly good as-is. Minor notes about image visibility and section label.

**What I see confirmed:**

This is genuinely one of the better sections on the page. "Built on Standards" is a strong brand headline. The body copy is specific: "the job is not done until every detail meets the standard." The stats (500+ / 6+ / 24hr) are compact and scannable. The pull quote ("We don't leave until it's right.") is the most human moment on the page.

| Finding | Severity |
|---|---|
| "ABOUT A&A" section label is unnecessary overhead — the content speaks for itself. Remove or replace with the pull quote as the section opener | **Low** |
| I see what appears to be a **text bleed** at the top of screenshot 5: "Georgetown to San Marcos — same standards, every location." This seems to be coming from the Where We Work section below or a transition element. It's visually orphaned — it appears above the About section boundary | **Moderate** — potential rendering issue |
| "START YOUR PROJECT →" CTA is well-placed after the brand pitch and pull quote | ✅ |
| Stats are compact and credible | ✅ |
| Pull quote styling (left border + smaller text) is elegant | ✅ |

**What needs to happen:**
1. Remove "ABOUT A&A" section label.
2. Investigate the "Georgetown to San Marcos" text bleed — it appears to be a layout/overlap issue.
3. This section is earning its place. Keep it relatively intact. If scroll budget is tight, the only trim opportunity is the section label removal and possibly tightening the spacing between stats and pull quote.

---

### 10. WHERE WE WORK — Grade: C-

**What the document said:** Map hidden on mobile. City cards are static (not location-aware). Duplicate city navigation (cards + pills). §16.4 mandates removing duplicate patterns and decommissioning city slug pages.

**What I see confirmed:**

This section has a structural redundancy problem and a visual density problem.

| Finding | Severity |
|---|---|
| **Duplicate city navigation:** 10 city cards in a grid, PLUS 5 city pill links below, PLUS "CHECK AVAILABILITY IN YOUR AREA →" CTA, PLUS "Don't see your area?" fallback text. That's FOUR navigation affordances for the same intent (finding your city) in one section | **High** |
| City cards show static distances ("25 mi", "20 mi", "HQ") — not calculated from user location. These feel credible but are hardcoded. The user has no way to know these are approximate | **Low** |
| City pills below the cards (Round Rock, Georgetown, Pflugerville, Buda, Kyle, San Marcos) are a **subset** of the cities shown in the cards above. Why show 10 cards then 6 pills for a subset? This is confusing | **Significant** |
| Region dots (North, Central, South) are tiny and add no decision value at this size. They're visual noise | **Low** |
| No map on mobile. The document recommended a compact map-first layout (mini SVG map at 220-260px height). The map is still hidden | **Moderate** |
| "CHECK AVAILABILITY IN YOUR AREA →" is the right CTA but the AI trigger (blue circle) is overlapping it in the viewport | **Moderate** |
| Section is approximately **700-800px** of scroll for what is essentially one message: "We serve the greater Austin metro area" | **Significant** |

**What needs to happen:**
1. **Pick one city navigation pattern and eliminate the rest.** Either (a) compact city cards only, or (b) scrollable city pills only. Not both. My recommendation: pills only, with the mini SVG map above them. This cuts the section roughly in half.
2. Remove region dots — they're not adding decision value at this size.
3. Remove the duplicate pill links. If city cards stay, pills go. If pills stay, cards become pills.
4. Per §16.4 and §16.5: plan the decommission of `/service-area/[slug]` pages. Keep one canonical `/service-area` route for SEO, redirect slug routes to it.
5. Verify the AI trigger z-index isn't clipping the CTA button.

---

### 11. LET'S TALK ABOUT YOUR PROJECT — Grade: B+

**What the document said:** Should be the terminal conversion section. §16.4 directive.

**What I see confirmed:**

This is a strong conversion closer. The trust bullets (Quote within 24 hours, No-obligation walkthrough, Bilingual crew coordination) reduce friction. The social proof line (★★★★★ + James R. quote) is perfectly placed. The dual CTA (filled quote button + outline call button) gives two clear paths.

| Finding | Severity |
|---|---|
| "FINAL STEP" section label explicitly signals this is the end of the decision journey — smart framing | ✅ |
| Trust bullets are exactly right for a terminal conversion section: they answer "what happens next?" and "what's the risk?" | ✅ |
| Dual CTA (quote + call) is correct | ✅ |
| **BUT: This is NOT the terminal section.** Careers and Footer CTA both appear after it, diluting its finality | **High** — this is the §16.4 violation |
| The social proof line is a nice touch but feels small — consider making the star rating + quote slightly more prominent | **Low** |

**What needs to happen:**
1. **This MUST become the final content section before the footer.** Per §16.4, Careers must be removed from homepage. Footer CTA module must be de-duplicated. After this section, the user should see only the utility footer (links, contact, copyright).
2. The "FINAL STEP" label is perfect — but it only works if it's actually final. Right now there are ~1,200px of non-conversion content after it.

---

### 12. CAREERS — Grade: D (as homepage section)

**What the document said:** "Not aligned with primary homepage conversion objective; should move to dedicated page only." §16.4 mandates removal from homepage.

**What I see confirmed:**

Careers is still on the homepage, taking approximately **600-650px of scroll** between the terminal conversion section and the footer. This directly violates §16.4.

| Finding | Severity |
|---|---|
| **Present on homepage when §16.4 says remove it.** This is the clearest unexecuted directive in the document | **High** |
| The content itself is fine for a /careers page: "We're Building a Team," 20+ team members, 4.8★ Glassdoor, perk cards. But none of this helps convert a property manager into a customer | **Structural** |
| Three perk cards (Consistent Hours, Growth Path, Team Culture) add ~250px of scroll for employer brand content on a customer conversion page | **Moderate** |
| "SEE OPEN POSITIONS →" button routes to /careers — confirming the dedicated route exists. So the only remaining work is removing the homepage section and keeping the link in the footer nav | **Low effort** |

**What needs to happen:**
1. Remove `CareersSection` from `VariantAPublicPage.tsx` homepage composition.
2. Keep "Careers" in the footer navigation grid and in the hamburger menu (both already exist).
3. The /careers route already exists. No content is lost, only homepage scroll is recovered.
4. **Estimated savings: ~600-650px of scroll** — entirely free win.

---

### 13. FOOTER CTA MODULE — Grade: D+

**What the document said:** "Bring A&A in before the handoff gets rushed" duplicates Let's Talk CTA intent. §16.4 mandates de-duplication.

**What I see confirmed:**

This is a near-complete duplicate of the Let's Talk section:

| Element | Let's Talk | Footer CTA Module |
|---|---|---|
| Headline | "Let's Talk About Your Project" | "Bring A&A in before the handoff gets rushed." |
| Primary CTA | "GET YOUR FREE QUOTE" | "GET YOUR FREE QUOTE" |
| Secondary CTA | "OR CALL DIRECTLY: (512) 555-0199" | "OR CALL (512) 555-0199" |
| Copy | Trust bullets + social proof | Construction-ready cleaning support copy |

**These are the same conversion intent, 600px apart**, separated only by the Careers section. A user who scrolled past "Let's Talk" and its quote button is not going to convert because they see an identical quote button again in the footer module. This is scroll waste.

**What needs to happen:**
1. **Remove or dramatically simplify the Footer CTA module.** Two options:
   - **Remove entirely:** Let's Talk is the closer. Footer is utility only (nav, contact, copyright).
   - **Reduce to one line:** A single-row compact banner: "Ready to start? [Get a Quote] [Call]" — no headline, no body copy, no duplicate persuasion.
2. The footer navigation grid, contact info, and copyright are all fine as-is.

---

### 14. FOOTER (Utility) — Grade: B

The utility footer itself is clean. Brand description, attribute pills ("DETAIL FINISH" / "RESPONSIVE SCHEDULING"), navigation grid, contact info, copyright. No major issues.

| Finding | Severity |
|---|---|
| "DETAIL FINISH" and "RESPONSIVE SCHEDULING" pills are nice brand reinforcement but feel orphaned — they don't connect to anything above or below | **Low** |
| Navigation grid is complete: Services, Who We Serve, About, Service Area, FAQ, Contact, Privacy, Terms | ✅ |
| Contact info (phone + email) is visible | ✅ |
| "Serving Austin and surrounding metro areas" — good geographic reinforcement | ✅ |

**Minor fix:** The A&A brand description ("Standards-driven facility care for contractors, property teams, and commercial spaces that need clean handoff quality") is fine but could be one line shorter.

---

### 15. HAMBURGER MENU — Grade: B-

**What the document said:** Action band implemented (Issue #9 ✅). Grouped nav (Explore/Resources). Outstanding fixes: no backdrop overlay, chevron `›` suggests navigation not expansion, desktop blur-out fix.

**What I see confirmed:**

The menu redesign IS implemented. I can see:
- **Action band** at top: CALL NOW + FREE QUOTE + phone number — ✅ this is the right priority
- **Grouped navigation:** EXPLORE (Services ›, Industries ›) + plain items (About, Service Area) + RESOURCES (FAQ, Careers) — ✅ grouping exists
- **Footer info:** email, location, copyright

| Finding | Severity |
|---|---|
| **No backdrop overlay.** The page content is clearly visible behind/below the menu panel. I can see the "© 2026 A&A Cleaning Services." text from the page footer bleeding through below the menu. This was called out in the code review as needing a fixed backdrop with tap-to-dismiss — still not fixed | **Moderate** |
| **Chevron `›` on Services and Industries.** These suggest the items link to a different page, not that they expand to show sub-items. If tapping these scrolls to the relevant homepage section (which is the current behavior per spec), the `›` is misleading. Needs a rotating expand/collapse indicator if they have sub-content, or no indicator if they're simple nav links | **Moderate** |
| **Inconsistent item treatment.** Services and Industries have bordered cards with `›` chevrons. About and Service Area are plain text links without borders or chevrons. FAQ and Careers are also plain text links. The visual logic is unclear — why do two items get card treatment and four don't? | **Moderate** |
| Action band (CALL NOW + FREE QUOTE) is strong and correctly prioritized | ✅ |
| Grouped sections (EXPLORE / RESOURCES) provide hierarchy | ✅ |
| Email address visible in menu footer — the code review noted it was missing. It's here: "AAcleaningservices@outlook.com" | ✅ — fixed from earlier review |

**What needs to happen:**
1. **Add backdrop overlay** — fixed dark semi-transparent backdrop behind the menu panel, with tap-to-dismiss.
2. **Fix chevron indicators.** If Services/Industries expand to show sub-items → use a rotating chevron (▸ → ▾). If they're simple scroll-to-section links → remove the `›` entirely and match the treatment of About/Service Area.
3. **Normalize item treatment.** Either all nav items get bordered cards, or none do. The current mix of bordered (Services, Industries) and plain (About, Service Area, FAQ, Careers) creates visual inconsistency without communicating a clear distinction.
4. Consider: does "Service Area" need to be in the nav at all? It's a homepage section anchor. If someone taps it, they scroll to the Where We Work section. That might be more intuitive as a sub-item under EXPLORE rather than a top-level nav item.

---

### 16. QUOTE FORM (Floating Panel) — Grade: B

**What the document said:** Two-step progressive form implemented (Issue #4 ✅). Step 1: name + phone + service type. Step 2: enrichment.

**What I see confirmed:**

The two-step form IS implemented and showing Step 1 correctly:
- Title: "Detailed Scope Request"
- Progress: "Step 1 of 2: Share quick contact details."
- Fields: NAME*, PHONE*, SERVICE TYPE* (dropdown)
- CTA: "CONTINUE"
- Trust line: "AVG. RESPONSE: UNDER 1 HOUR"

| Finding | Severity |
|---|---|
| **Title mismatch: "Detailed Scope Request" contradicts Step 1's purpose.** Step 1 is quick contact capture — name, phone, service type. That's not a "detailed scope request." The title sets an expectation of complexity that the form then doesn't deliver (which is actually good — simple form), but the framing is wrong. Step 1 should be "Get a Free Quote" or "Quick Quote Request." "Detailed Scope Request" would be appropriate for Step 2 | **Significant** |
| **Massive white space below the form.** After the "AVG. RESPONSE: UNDER 1 HOUR" line, there's roughly 400px+ of empty white space before the bottom of the panel. The form has three fields and a button — it doesn't need a full-screen panel. The panel should be content-height, not viewport-height | **Significant** |
| The "Step 1 of 2" progress indicator is clear and correctly framed | ✅ |
| Three required fields for Step 1 is exactly right — low commitment, high lead value | ✅ |
| "AVG. RESPONSE: UNDER 1 HOUR" trust line below submit is excellent — sets service expectation at the moment of commitment | ✅ |
| X close button is visible and accessible | ✅ |
| Sticky bar (CALL + FREE QUOTE) correctly hidden while panel is open — this aligns with §15.2 | ✅ |

**What I can't verify from screenshots:**
- Step 2 appearance and fields after Step 1 submission
- Whether `quote_step2_completed` and `quote_panel_opened` events fire (noted as unconfirmed in code review)
- Whether Step 2 sends step 1 fields causing overwrite (noted as fixed but unverified)

**What needs to happen:**
1. **Rename title to "Get a Free Quote" for Step 1.** Reserve "Detailed Scope Request" or "Add Project Details" for Step 2.
2. **Size the panel to content height**, not viewport height. Use `max-h-fit` or auto-height so the white space disappears. On mobile, the panel should feel like a focused card, not an empty room.
3. Consider adding a micro-proof element near the form: a one-line testimonial excerpt or "500+ projects quoted" beneath the response time line.

---

## Cross-Reference Verification Matrix

Now I'll check every implemented item and document directive against what I actually see:

### Solution Architecture Items (Implemented)

| # | Issue | Doc Status | Screenshot Verdict |
|---|---|---|---|
| 1 | Duplicate form resolved | ✅ Implemented | ✅ **CONFIRMED** — Only floating panel visible on mobile. No inline QuoteSection rendering. The critical duplicate form bug from the original review appears fixed |
| 2 | Hero 75svh compact | ✅ Implemented | ❌ **NOT ACTIVE** — Screenshots show 100svh default. Variant may exist but isn't the user experience |
| 3 | Services accordion | ✅ Implemented | ✅ **CONFIRMED** — All 5 services collapsed with headers. But first service not auto-expanded |
| 4 | Two-step form | ✅ Implemented | ✅ **CONFIRMED** — Step 1 of 2 visible with correct 3-field set |
| 9 | Menu hierarchy | ✅ Implemented | ✅ **CONFIRMED** — Action band + grouped nav visible. But backdrop/chevron/consistency fixes outstanding |

### §16.4 Directives (Product Decisions)

| Directive | Screenshot Verdict |
|---|---|
| Careers removed from homepage | ❌ **NOT EXECUTED** — Still present, ~600px |
| Let's Talk is terminal conversion section | ❌ **VIOLATED** — Careers + Footer CTA follow it |
| Footer CTA de-duplicated | ❌ **NOT EXECUTED** — Full duplicate CTA block present |
| Service-area city pages decommissioned | **CANNOT VERIFY FROM SCREENSHOTS** — but city pills still link to slug routes |
| Where We Work duplicate navigation removed | ❌ **NOT EXECUTED** — Cards + pills + dots + CTA all present |

### Code Review Findings

| Finding | Screenshot Verdict |
|---|---|
| Hero CLS (useState → useEffect flash) | **CANNOT VERIFY** — screenshots are static |
| Menu backdrop missing | ✅ **CONFIRMED** — Page content visible behind menu |
| Menu chevron `›` wrong | ✅ **CONFIRMED** — Static `›` on Services and Industries |
| Accordion images loading eagerly | **CANNOT VERIFY** — need dev tools |
| Subtitle contrast issue | ✅ **CONFIRMED** — Subtitle straining against dark image |

---

## Scroll Budget Estimate (From Screenshots)

Measuring approximate scroll heights per section:

| Section | Estimated Height | Earns Its Place? |
|---|---|---|
| Hero | ~850px (with dead zone ~400px) | Partially — needs shrink |
| Authority Bar | ~350px | Yes — but tighten |
| What's Included | ~450px | Questionable — merge candidate |
| Services Accordion | ~450px collapsed | Yes — major win |
| Who We Serve | ~1,400px (intro + 3 cards) | Yes — but consider carousel |
| Before/After | ~600px | Yes |
| Testimonials | ~400px | Yes — but compact |
| How It Works | ~850px | Yes — but needs stepper treatment |
| About | ~550px | Yes |
| Where We Work | ~800px | Partially — cut in half |
| Let's Talk | ~450px | Yes — this is the closer |
| Careers | ~650px | **No** — remove from homepage |
| Footer CTA | ~300px | **No** — duplicate, remove |
| Footer (utility) | ~400px | Yes |

**Current total: ~8,500px** (this is lower than the document's 12,000-14,000px estimate, suggesting the accordion implementation already reclaimed significant scroll. The 10,400px figure from the architecture doc was probably pre-accordion.)

**Target after recommended changes:**

| Change | Savings |
|---|---|
| Hero 75svh (remove dead zone) | ~250-350px |
| Remove Careers from homepage | ~650px |
| Remove/simplify Footer CTA | ~250px |
| Where We Work consolidation | ~350-400px |
| What's Included merge with How It Works | ~400px |
| How It Works stepper treatment | ~250px |
| Who We Serve carousel (optional) | ~400-600px |
| **Total potential savings** | **~2,550-3,000px** |

**Projected total: ~5,500-6,000px** — This hits the document's 6,100px target and meets the §15.6 "speed-to-form" requirement (primary form reachable within 2 thumb-scrolls from top, ~1,200-1,400px).

---

## Recommended Information Flow Restructure

Current order vs. proposed order:

### Current Flow (12 sections + footer)
```
Hero → Authority → What's Included → Services → Who We Serve →
Before/After → Testimonials → How It Works → About → Where We Work →
Let's Talk → Careers → Footer CTA → Footer
```

### Proposed Flow (9 sections + footer)

```
Hero (75svh) → Authority Bar (tightened) → Services Accordion →
Who We Serve (carousel) → The A&A Standard (merged Before/After + proof) →
How We Work (merged What's Included + How It Works, stepper) →
About (tightened) → Where We Work (simplified) →
Let's Talk (terminal closer) → Footer (utility only)
```

**What changed and why:**

| Change | Rationale |
|---|---|
| **Hero shrinks to 75svh** | Eliminates dead zone, gets user to substance faster |
| **What's Included removed as standalone section** | Its content merges into How We Work. The process-outcome messages become part of each step |
| **Services moves up, directly after Authority** | User sees "what do you do?" immediately after "why should I trust you?" — natural question flow |
| **Who We Serve follows Services** | "Here's what we do → Here's who we do it for" — self-identification happens right after service understanding |
| **Before/After merges into "The A&A Standard"** | Combine the slider with the testimonials into one proof block. Proof + social proof together is more powerful than proof → gap → social proof |
| **How We Work consolidates What's Included + How It Works** | One process section, not two. 4-step stepper with outcomes embedded in each step |
| **Careers removed** | §16.4 directive. Accessible via /careers route and footer/menu links |
| **Footer CTA removed** | §16.4 directive. Let's Talk is the single terminal closer |

**The narrative arc becomes:**

1. **Promise** (Hero): We clean every surface, every detail, every time
2. **Credibility** (Authority): 15+ years, 500+ projects, 100% commitment
3. **Specifics** (Services): Here's exactly what we clean and how fast we respond
4. **Relevance** (Who We Serve): Here's how we serve your specific project type
5. **Proof** (The A&A Standard): See the actual results + hear from actual clients
6. **Process** (How We Work): Here's exactly what happens when you hire us
7. **Identity** (About): Who we are and what we stand for
8. **Coverage** (Where We Work): We serve your area
9. **Action** (Let's Talk): Get your quote now

This is a **trust-building funnel**: Promise → Proof → Process → Action. Each section answers the next logical question a GC or property manager would have.

---

## Consolidated Action Plan

### Tier 1 — Immediate / No-Design-Required (1-2 days)

| # | Action | Files | Impact | Effort |
|---|---|---|---|---|
| 1 | Remove CareersSection from homepage composition | `VariantAPublicPage.tsx` | ~650px scroll savings, §16.4 compliance | 15 min |
| 2 | Remove or simplify Footer CTA module | `FooterSection.tsx`, `VariantAPublicPage.tsx` | ~250px savings, CTA de-duplication | 30 min |
| 3 | "Discuss Your Project" → full button treatment | `OfferAndIndustrySection.tsx` | Conversion lift on highest-qualified traffic | 30 min |
| 4 | Move/remove "TALK THROUGH YOUR SCOPE" button (relocate below persona cards or remove) | `OfferAndIndustrySection.tsx` | Fixes premature CTA placement | 15 min |
| 5 | Auto-expand first service in accordion | `ServiceSpreadSection.tsx` | Eliminates decision paralysis, shows content depth | 15 min |
| 6 | Quote panel title: "Get a Free Quote" for Step 1 | `FloatingQuotePanel.tsx` or `useQuoteForm` | Fixes expectation mismatch | 15 min |
| 7 | Quote panel: size to content height, not viewport | `FloatingQuotePanel.tsx` | Eliminates empty white space | 30 min |
| 8 | Add menu backdrop overlay | `PublicHeader.tsx` | Fixes code review finding, improves focus | 30 min |
| 9 | Fix menu chevron indicators | `PublicHeader.tsx` | Fixes misleading affordance | 20 min |
| 10 | Add subtitle text-shadow to hero | `HeroSection.tsx` | Fixes contrast/readability | 10 min |

### Tier 2 — Design-Light / Component Refactor (3-5 days)

| # | Action | Files | Impact | Effort |
|---|---|---|---|---|
| 11 | Make 75svh the default hero on mobile | `HeroSection.tsx` | ~300px savings, eliminates dead zone | 1-2 hrs (includes CLS fix) |
| 12 | Consolidate Where We Work (pick one city nav pattern, add mini map) | `ServiceAreaSection.tsx` | ~400px savings, clarity | 3-4 hrs |
| 13 | How It Works → stepper accordion with icons | `TimelineSection.tsx` | ~250px savings, visual engagement | 2-3 hrs |
| 14 | Normalize menu item treatment (consistent borders/styles) | `PublicHeader.tsx` | Visual consistency | 1 hr |
| 15 | Authority Bar headline + Licensed & Insured card tightening | Authority bar component | Reduces clutter, stronger messaging | 1 hr |
| 16 | Testimonial headline + count indicator | Testimonial component | Better social proof framing | 30 min |
| 17 | Before/After headline hierarchy + metadata inversion | `BeforeAfterSlider.tsx` | Stronger proof framing | 1 hr |

### Tier 3 — Significant Redesign (1-2 weeks)

| # | Action | Files | Impact | Effort |
|---|---|---|---|---|
| 18 | Merge What's Included into How We Work (process rail + stepper) | `VariantAPublicPage.tsx`, `TimelineSection.tsx` | ~400px savings, eliminates redundancy | 4-6 hrs |
| 19 | Who We Serve → horizontal carousel on mobile | `OfferAndIndustrySection.tsx` | ~600px savings, better interaction | 3-4 hrs |
| 20 | Before/After + Testimonials → merged "A&A Standard" proof section | `BeforeAfterSlider.tsx`, testimonial component, `VariantAPublicPage.tsx` | Consolidated proof block, stronger narrative | 6-8 hrs |
| 21 | Reorder homepage section composition per proposed flow | `VariantAPublicPage.tsx` | Better narrative arc, conversion funnel alignment | 2-3 hrs |
| 22 | Build industry vertical page template (/industries/[slug]) | New route + template | §15.5 compliance, persona routing | 4-6 hrs |

---

## Final Grades Summary

| Section | Current Grade | Primary Issue | Target Grade After Fixes |
|---|---|---|---|
| Hero | C+ | Dead zone, contrast, image relevance | B+ (with 75svh + text-shadow) |
| Authority Bar | B- | Generic headline, verbose card, orphaned star rating | B+ (with copy tightening) |
| What's Included | D+ | Visually flat, thematically redundant with How It Works | B+ (if merged) or removed |
| Services Accordion | B+ | No auto-expand, no featured service | A- (with auto-expand + badge) |
| Who We Serve | B- | Text-link CTA, premature top button, scroll wall of cards | A- (with button treatment + carousel) |
| Before/After | B | Weak headline, inverted metadata hierarchy | B+ (with headline/metadata fix) |
| Testimonials | C+ | Generic headline, no count, single-testimonial view | B (with headline + count) |
| How It Works | C- | Text wall, no visual relief, redundant with What's Included | B+ (with stepper + merge) |
| About | B+ | Minor label removal, text bleed | A- (with cleanup) |
| Where We Work | C- | Duplicate navigation, oversized, no map | B (with consolidation) |
| Let's Talk | B+ | Not actually terminal (Careers + Footer CTA follow) | A (once it's actually terminal) |
| Careers | D | Should not be on homepage | N/A (moved to /careers) |
| Footer CTA | D+ | Duplicate of Let's Talk | N/A (removed or one-liner) |
| Footer | B | Minor copy tightening | B+ |
| Menu | B- | No backdrop, wrong chevrons, inconsistent items | B+ (with fixes) |
| Quote Form | B | Wrong title, oversized panel, white space | A- (with title + sizing fixes) |

---

**Bottom line:** The bone structure of this site is solid. The copy is genuinely specific and industry-aware — that's rare for a cleaning company site. The accordion and two-step form implementations are real wins. But the page is still 30-40% longer than it needs to be due to three things: unexecuted §16.4 directives (Careers + Footer CTA), thematic redundancy (What's Included ↔ How It Works), and oversized sections (Where We Work, hero dead zone). The Tier 1 actions alone would cut ~1,000px and improve conversion clarity immediately. The full plan gets you to ~5,500-6,000px with a clean narrative funnel from promise to proof to action.

No — start now. I have enough to do the full three-pass analysis on the skeleton plus the first four sections. Send the remaining files whenever you're ready; I'll continue the same analysis on those when they arrive.

---

# Round 1 — Three-Pass Deep Analysis

## File 1: `VariantAPublicPage.tsx` (Page Composition Skeleton)

### Pass 1 — Structural Read

**Composition order confirmed:**
```
Hero → AuthorityBar → IncludedSummarySection → ServiceSpreadSection →
OfferAndIndustrySection → BeforeAfterSlider → TestimonialSection →
TimelineSection → AboutSection → ServiceAreaSection → MobileQuoteCloser →
QuoteSection (desktop only) → CareersSection
```

**Critical finding: FooterSection is NOT in this file.** It's rendered by `PublicChrome.tsx` (the layout wrapper). This means the Footer CTA module I saw in screenshots is structurally separate from the page composition — it's injected by the chrome, not by the page. Any removal/simplification of the footer CTA requires changes in `FooterSection.tsx`, not here.

**Dynamic imports (lazy-loaded below fold):**
- `BeforeAfterSlider` — with `SectionSkeleton` loading state
- `TestimonialSection` — with `SectionSkeleton` loading state
- `QuoteSection` — with `SectionSkeleton` loading state
- `ExitIntentOverlay` — no SSR, no loading skeleton

**Statically imported (loaded immediately):**
- `HeroSection`, `AuthorityBar`, `ServiceSpreadSection`, `OfferAndIndustrySection`, `TimelineSection`, `AboutSection`, `ServiceAreaSection`, `CareersSection`

This means the first five sections (Hero through OfferAndIndustry) are all in the initial JS bundle. That's significant for mobile load performance — it's a lot of components loaded before first paint.

**MobileQuoteCloser — this is the "Let's Talk" section:**
```tsx
<section id="quote-closer" className="... md:hidden">
```
- It's mobile-only (`md:hidden`)
- It's NOT a form — it's two CTA buttons (`QuoteCTA` → opens floating panel, `CTAButton` → phone call)
- Trust bullets are hardcoded strings
- Social proof is a hardcoded string ("★★★★★ 'Zero punch list items.' — James R., Prestige Developments")
- It sits between `ServiceAreaSection` and `QuoteSection` (desktop-only)

**QuoteSection desktop-only wrapper:**
```tsx
<div className="hidden md:block">
  <QuoteSection />
</div>
```
This confirms the duplicate form fix IS working: mobile never sees `QuoteSection`. Mobile gets `MobileQuoteCloser` (CTA buttons) → `FloatingQuotePanel` (the actual form, rendered by PublicChrome).

**IncludedSummarySection — inline component with hardcoded data:**
```tsx
const INCLUDED_SUMMARY_ITEMS = [
  { title: "Scope-Driven Planning", description: "..." },
  { title: "Detail-Level Delivery", description: "..." },
  { title: "Fast Communication", description: "..." },
] as const;
```
- No icons, no color keys, no visual anchors in the data model
- Rendered as simple cards: `rounded-xl border border-slate-200 bg-slate-50 p-4`
- Grid: single column mobile, 3 columns desktop
- No CTA, no transition element to next section

**CareersSection is still the last item in `<main>`** — confirming §16.4 directive has NOT been executed.

**ErrorBoundary coverage is inconsistent:**
- BeforeAfterSlider: ✅ wrapped
- TestimonialSection: ✅ wrapped
- QuoteSection: ✅ wrapped
- HeroSection, AuthorityBar, ServiceSpreadSection, OfferAndIndustrySection, TimelineSection, AboutSection, ServiceAreaSection, CareersSection: ❌ not wrapped

The sections without ErrorBoundary are the statically-imported ones. If any of them throw during render, the entire page crashes. The dynamically-imported sections have protection. This is probably fine for simple sections but worth noting — if a future change to ServiceSpreadSection or ServiceAreaSection introduces a runtime error, there's no containment.

### Pass 2 — Contextual Evaluation

**The narrative arc of this composition:**
1. **Promise** (Hero) — what we do
2. **Credibility** (AuthorityBar) — track record numbers
3. **Process** (IncludedSummarySection) — what's included
4. **Specifics** (ServiceSpreadSection) — five services
5. **Audience** (OfferAndIndustrySection) — who we serve
6. **Proof** (BeforeAfterSlider) — visual evidence
7. **Social proof** (TestimonialSection) — client quotes
8. **Process** (TimelineSection) — how it works ← REDUNDANT with #3
9. **Identity** (AboutSection) — who we are
10. **Coverage** (ServiceAreaSection) — where we work
11. **Action** (MobileQuoteCloser) — get a quote
12. **Recruiting** (CareersSection) — jobs ← WRONG AUDIENCE

**Redundancy confirmed at code level:** `IncludedSummarySection` (What's Included) and `TimelineSection` (How It Works) are both "process" sections. They're separated by four other sections, which means a user encounters process information, then scrolls through five full sections, then encounters process information again. This is the thematic duplication the visual pass identified, now confirmed structurally.

**CareersSection placement is structurally damaging.** It's the last section before `FooterSection` (rendered by chrome). This means the actual conversion flow is: MobileQuoteCloser ("Let's Talk" with CTAs) → CareersSection (recruiting) → FooterSection (footer CTA + utility). The user crosses a recruiting section between the conversion prompt and the footer, breaking the funnel.

**The MobileQuoteCloser is well-positioned** but its effectiveness is undermined by what follows it. If Careers and footer CTA were removed, this section would be the clean terminal point the design calls for.

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies |
|---|---|---|
| Remove `CareersSection` from composition | **Low** — single line removal, component still exists for /careers route | None — /careers page imports CareersSection independently (would need to verify) |
| Reorder sections | **Low** — all sections are self-contained components, no parent-to-child data flow between them (no props passed between siblings) | Analytics section_view tracking uses DOM order, so reordering changes the section_N fallback IDs — but most sections have explicit IDs so this is minimal risk |
| Add icons/visual anchors to IncludedSummarySection | **Low** — modify inline INCLUDED_SUMMARY_ITEMS data + rendering. All-viewport change unless mobile-gated | Desktop Safety Contract: current 3-column card grid is the desktop experience. Adding icons would be all-viewport |
| Merge IncludedSummarySection into TimelineSection | **Medium** — requires combining two components' data and rendering logic. IncludedSummarySection is inline, TimelineSection is a separate file | Need to see TimelineSection code first to assess feasibility |
| Add ErrorBoundary to statically-imported sections | **Low** — wrapping only, no behavior change | None |

---

## File 2: `PublicChrome.tsx` (Layout Wrapper)

### Pass 1 — Structural Read

**Rendering structure:**
```
QuoteContext.Provider
  └── div (mainRef)
      ├── PublicHeader
      └── div.pb-24.md:pb-0
          ├── {children}  (VariantAPublicPage)
          └── FooterSection
  FloatingQuotePanel (outside mainRef div)
  AIQuoteAssistant (outside mainRef div)
  ScrollToTopButton (outside mainRef div)
  Sticky Bar (outside mainRef div)
```

**This architecture is significant.** FloatingQuotePanel, AIQuoteAssistant, ScrollToTopButton, and the sticky bar are all siblings of the main content div, not children of it. When `isQuoteOpen` is true, the mainRef div gets `inert` — but these floating elements remain interactive. This is correct behavior for a modal pattern.

**Sticky bar behavior — four conditions for visibility:**
1. `showStickyBar` = true (user has scrolled past 80% of viewport height)
2. `!isQuoteOpen` (quote panel is closed)
3. Mobile only (`md:hidden`)
4. CSS transition: `translate-y-0` (visible) vs `translate-y-full` (hidden below screen)

The sticky bar z-index is `z-[30]`. The FloatingQuotePanel will need to be higher than this. The AIQuoteAssistant trigger (the blue circle I saw overlapping CTAs in screenshots) also needs z-index coordination.

**The `pb-24 md:pb-0` padding:**
This adds 96px bottom padding on mobile to prevent the sticky bar from covering the last section's content. On desktop there's no sticky bar, so no padding needed. This is correctly implemented.

**Section tracking analytics — detailed breakdown:**

The IntersectionObserver is sophisticated:
- Threshold: `[0, 0.25, 1]` — fires at 0%, 25%, and 100% visibility
- Only fires `section_view` enter when `intersectionRatio >= 0.25` (25% visible)
- Tracks time_in_view_ms on exit
- Cleanup handler fires exit events for all currently-visible sections (handles page navigation)

Section ID resolution priority:
1. `element.id` (e.g., `id="hero"`, `id="services"`)
2. `aria-labelledby` minus `-heading` suffix
3. `aria-label` slugified
4. `data-section-id`
5. Fallback: `section_N` (DOM order)

Scroll depth tracking: milestones at 25/50/75/100%, fired once each per page load.

**This analytics layer is well-built.** It gives us section-level engagement data and scroll depth — exactly what's needed for the §15.6 measurement targets (section views, scroll depth, quote funnel events).

**Quote panel state management:**
- `isQuoteOpen` state lives here, passed to FloatingQuotePanel as prop
- `openQuote` function is provided via QuoteContext to all children
- `openQuote` fires `quote_open_clicked` event with source (public_page vs sub_page)
- Panel close is a simple `setIsQuoteOpen(false)` — no close event tracked

**Missing: No `quote_panel_closed` or `quote_abandoned` event.** When a user opens the panel and closes it without submitting, we don't know. The code review noted `quote_panel_opened` event was unconfirmed — I can see `quote_open_clicked` fires when the CTA is tapped, but there's no event when the panel actually renders/opens. These are subtly different: a user might tap the CTA but the dynamic import might delay the panel appearance.

### Pass 2 — Contextual Evaluation

**The chrome is the conversion orchestrator.** Every conversion path on mobile flows through it:
1. Sticky bar "Free Quote" → `openQuote()` → FloatingQuotePanel
2. Hero "Get a Free Quote" → (via QuoteCTA) → `openQuote()` → FloatingQuotePanel
3. MobileQuoteCloser "Get Your Free Quote" → (via QuoteCTA) → `openQuote()` → FloatingQuotePanel
4. Any service "Quote This Service" → (via QuoteCTA) → `openQuote()` → FloatingQuotePanel

All roads lead to the same FloatingQuotePanel. This is architecturally clean. But there's a contextual gap: **none of these paths carry context about where the user came from.** If someone taps "Quote This Service" on Post-Construction Clean, the floating panel opens with no pre-selection of service type. The form requires the user to re-select their service. This is friction that the document's §8 identified ("Smart defaults from persona entry points").

**The AIQuoteAssistant has no visibility coordination with the sticky bar.** Both are fixed-position mobile elements. The document's §15.2 says "sticky bar hides while keyboard is visible on mobile form fields" — I don't see keyboard detection logic here. The sticky bar only hides based on scroll position and quote panel open state.

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies |
|---|---|---|
| Pass service type context through openQuote | **Low-Medium** — extend QuoteContext value to include optional serviceType, modify openQuote signature | Need to check FloatingQuotePanel and useQuoteForm to see how serviceType would be pre-populated |
| Add quote_panel_closed event | **Low** — add trackConversionEvent in closeQuote | None |
| Add keyboard visibility detection for sticky bar | **Medium** — need `visualViewport` API listener or `focusin`/`focusout` on form elements | Requires testing across iOS/Android; this is a known cross-platform pain point |
| Footer CTA changes | **Requires FooterSection.tsx** — it's rendered here but defined elsewhere | Need to see FooterSection code |
| Modify `pb-24` padding if sticky bar behavior changes | **Low** — but if sticky bar height changes, this needs updating | Coupled to sticky bar height |

---

## File 3: `useQuoteForm.ts` (Form State Machine)

### Pass 1 — Structural Read

**State inventory:**
- 9 field states: name, companyName, phone, email, serviceType, timeline, description, website (honeypot), leadId
- 3 UI states: currentStep (1 or 2), isSubmitting, feedback
- 1 ref: hasTrackedStartRef (prevents duplicate form_started events)

**Two-step flow mechanics:**

Step 1 (`enableTwoStep && currentStep === 1`):
- Validates: name, phone, serviceType (non-empty trim check)
- Sends: `{ flowStep: "step1", name, phone, serviceType, website }`
- On success: saves leadId, moves to step 2, sets success feedback
- Events: `quote_step1_completed`, `quote_step2_viewed`

Step 2 (`enableTwoStep && currentStep !== 1`):
- No validation — all fields optional
- Sends: `{ flowStep: "step2", leadId, companyName, email, timeline, description, website }`
- On success: redirects to `/quote/success?name=firstName`
- Events: `quote_step2_completed`, `quote_form_submitted`, `quote_submit_success`

**Important behavioral gap: Step 1 completion has no redirect and no persistent confirmation.** After Step 1, the user sees Step 2 with a transient feedback message. If they close the panel at this point:
- A lead HAS been created (name + phone + service type are in the database)
- Admin notification HAS fired (per the architecture: "Admin notification fires on Step 1")
- But the user gets NO confirmation — no email, no SMS, no success page
- They're left in an ambiguous state: "Did that work?"

This is by design ("Step 2 abandonment is expected and tracked" per the architecture doc), but the user experience has a gap. The lead is captured — that's the business goal. But the user doesn't know that.

**Event duplication:** After final submission (Step 2 or single-step), TWO success events fire:
```tsx
await trackConversionEvent({ eventName: "quote_form_submitted", ... });
await trackConversionEvent({ eventName: "quote_submit_success", ... });
```
These are semantically identical. One should be removed, or they should be differentiated (e.g., "submitted" = attempt, "success" = server confirmed — but in this code, both only fire after `response.ok` check, so they're the same).

**Hero variant tracking in form submission:**
```tsx
metadata: { serviceType, hero_variant: getHeroVariant() }
```
The hero variant is sent with form submissions — this enables A/B analysis. But `getHeroVariant()` is a standalone function that reads URL params and localStorage. If the user navigated away from the homepage and back, or if localStorage was cleared, this could return stale/wrong data. It's a best-effort approach, which is acceptable.

**Phone formatting is client-side only:**
```tsx
setPhone: (value: string) => setPhone(formatPhoneInput(value)),
```
Auto-formats to `(XXX) XXX-XXXX`. The API presumably strips formatting for storage. But the formatted value is what gets sent — need to verify the API handler strips this.

**No field-level error messages.** The only feedback is a single `feedback` state (message + type). If name is empty but phone is filled, the user sees "Name, phone, and service type are required to continue" — they don't see which specific field is the problem. On mobile with three fields this is probably acceptable, but it's a UX gap.

### Pass 2 — Contextual Evaluation

**This hook is the conversion engine.** Every quote submission on the entire site flows through it. The two-step architecture is sound: Step 1 captures a callable lead with minimal friction, Step 2 enriches it. The business gets a lead even if Step 2 is abandoned.

**The hook has no awareness of WHERE the user initiated the form.** It receives a `source` string (e.g., "floating_panel", "quote_section"), but it doesn't know which service the user was looking at, which persona card they came from, or what page they were on. The `serviceType` field is a dropdown the user must manually select, even if they just tapped "Quote This Service" on Post-Construction Clean.

This is the "smart defaults from persona entry points" gap from §8. The hook has the `setServiceType` setter exposed — it's technically possible for the caller to pre-populate it. But nothing currently does.

**The redirect on success goes to `/quote/success?name=firstName`.** This is the F-17 confirmation page that was flagged as "implemented but wrong (referral ask instead of step process)" in the current state summary. The useQuoteForm code doesn't know about this — it just redirects. The problem is in the success page itself.

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies |
|---|---|---|
| Pre-populate serviceType from CTA context | **Low** — add optional `initialServiceType` to hook options, call `setServiceType` on mount | Need to thread service type through QuoteContext → FloatingQuotePanel → useQuoteForm |
| Remove duplicate success event | **Low** — remove one of quote_form_submitted / quote_submit_success | Analytics dashboards may reference both — need to check |
| Add Step 1 user-facing confirmation (brief "We got it" before showing Step 2) | **Low** — the feedback state already shows a message. Could make it more prominent or add a brief success state before transitioning | No backend change needed |
| Add field-level validation messages | **Low-Medium** — replace single feedback with per-field error state | UI change in FloatingQuotePanel rendering |
| Track panel close without submission | **Low** — add onClose callback that checks if form was started but not submitted | Requires change in PublicChrome closeQuote handler |

---

## File 4: `HeroSection.tsx`

### Pass 1 — Structural Read

**Variant initialization — CLS fix confirmed:**
```tsx
const [isCompactMobileHero] = useState(getInitialHeroVariant);
```
This is a useState initializer function (no parentheses calling it), meaning React calls it synchronously during first render. The value is determined before first paint. **The CLS fix from the code review IS implemented.** No useEffect flash.

Note: there's no setter — `[isCompactMobileHero]` only, no `setIsCompactMobileHero`. The variant is read-once and immutable for the session. This is correct for an A/B test — you don't want the hero changing size while the user is on the page.

**Height classes by variant:**
- Compact: `min-h-[75svh] md:min-h-[100svh]` (mobile 75%, desktop always 100%)
- Default: `min-h-[100svh]` (everything 100%)
- Applied to BOTH the section element AND the inner content div

The `min-h` is applied to both the container and the content. This means the content will always fill the container — there's no scenario where the container is 100svh but the content is shorter. **This is the dead zone problem.** When content only needs ~60% of the viewport, `min-h-[100svh]` forces the container to be taller, and `justify-center` places the content in the middle, creating dead space above and below.

With `min-h-[75svh]`, the content still centers but within a smaller container, reducing the dead space proportionally.

**Mobile-visible elements (what's NOT hidden):**
1. Headline (h1) — "Every Surface. Every Detail. Every Time."
2. Subtitle (p) — "Post-construction & commercial cleaning across the Austin metro area."
3. CTA buttons (div) — "Get a Free Quote" + "Call Now: (512) 555-0199"
4. Inline trust bar (div) — "Licensed & Insured" / "1-Hr Response" / "Habla Español"

**Mobile-hidden elements:**
1. Badge pill — "Austin Metro • Post-Construction • Commercial" (`hidden md:inline-flex`)
2. Service chips — "Final Clean", "Turnovers" (`hidden md:flex`)
3. Desktop trust bar — absolute bottom bar (`hidden md:block`)
4. Scroll indicator — absolute bottom (`hidden md:block`)

So mobile sees: headline + subtitle + 2 buttons + 3 trust chips. That's roughly 350-400px of actual content inside a 100svh (~850px) container. The dead space is structural — `justify-center` puts content at ~225px from top and ~225px from bottom. With 75svh (~640px), it would be ~120px from top and ~120px from bottom — still some space but far less damaging.

**Subtitle contrast — drop-shadow IS applied:**
```tsx
className="... drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] ..."
```
But the screenshot still showed contrast strain. The overlay stack is:
1. Hero image (variable brightness)
2. Solid overlay: `bg-[#0A1628]/34` (34% opacity dark)
3. Gradient overlay: `from-[#0A1628]/92 via-[#0A1628]/42 to-transparent`

The subtitle sits in the vertical center where the gradient is at `/42` (42% dark). Combined with the solid `/34`, total darkness at the subtitle position is roughly 42% + (34% of remaining 58%) ≈ 62% dark. With `drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]`, the text has some lift. But on a bright hero image area, 62% dark + text-shadow may not be enough. The gradient's `/92` at the bottom helps the CTA buttons, but the subtitle is above them in a thinner overlay zone.

**Animation system detail:**
- `isVisible` starts false → set to true after 220ms via setTimeout
- `fadeUp` returns CSS animation properties only when isVisible is true
- All animated elements have `opacity-0` as a Tailwind class (initial state)
- When animation fires, `heroFadeUp` keyframe overrides to opacity: 1
- Staggered delays: 220ms → 760ms → 980ms → 1200ms → 1420ms → 1640ms → 1760ms

The hero takes ~1.76 seconds to fully reveal all elements. This is a long reveal sequence on mobile where users are impatient. The trust pills (the last animated element) don't appear until 1.76 seconds after page load. A user who starts scrolling immediately might scroll past the hero before the trust pills even appear.

**Ken Burns effect on image:**
```tsx
style={isVisible ? { animation: "heroKenBurns 15s ease-out forwards" } : undefined}
```
15-second slow zoom/pan on the hero image. Looks premium but adds to the "everything is animated" feeling.

### Pass 2 — Contextual Evaluation

**The hero answers the right question ("What does this company do?") but spends too much viewport doing it.** On mobile, the actual information content is:
- Company name (header)
- Headline (scope claim)
- Subtitle (service type + location)
- Two action paths (quote + call)
- Three trust signals

That's about 5 pieces of information. This could comfortably fit in 50-60svh on mobile. The 100svh (or even 75svh) is paying for atmosphere, not information.

**The subtitle content ("Post-construction & commercial cleaning across the Austin metro area") overlaps with the trust pills below.** The subtitle establishes service type and geography. The trust pills establish credibility. These are different roles, and their placement is correct. But the subtitle is doing light work — it's essentially a longer version of the badge pill that's hidden on mobile ("Austin Metro • Post-Construction • Commercial"). Consider whether the subtitle should be more specific or differentiated if the badge is hidden.

**The CTA pair is well-structured.** "Get a Free Quote" (white filled, primary) + "Call Now: (512) 555-0199" (glassmorphic outline, secondary). The phone number in the CTA text is smart — it's visible even without tapping, serving as a reference. Both are min-h-[48px] meeting touch target requirements.

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies | Desktop Safety |
|---|---|---|---|
| Make 75svh the default (flip the boolean) | **Low** — change `getInitialHeroVariant` default return from `false` to `true` | localStorage reads would still override. Need to clear existing localStorage values or add migration logic | Desktop unaffected: compact variant uses `md:min-h-[100svh]` |
| Strengthen subtitle contrast | **Low** — increase overlay opacity or drop-shadow strength | CSS-only change, all-viewport unless mobile-gated | Would darken hero for desktop too. Could mobile-gate the overlay strength |
| Shorten animation sequence | **Low** — reduce delays | CSS-only, all-viewport | Desktop animations would also speed up. Consider if this is desired |
| Move trust pills earlier in animation sequence | **Low** — change fadeUp delay from 1760 to earlier | CSS-only | All-viewport |
| Pull AuthorityBar into hero | **High** — requires restructuring two components, changing section boundaries, possibly breaking analytics section_view tracking | AuthorityBar has its own section ID; merging would change the section count in analytics | Desktop currently has AuthorityBar as separate visual section |

---

## File 5: `ServiceSpreadSection.tsx`

### Pass 1 — Structural Read

**Two completely separate rendering paths:**
```tsx
export function ServiceSpreadSection() {
  return (
    <section id="services" ...>
      <MobileServiceAccordion />           {/* md:hidden */}
      <div className="hidden md:block">    {/* desktop only */}
        {services.map(s => <ServiceSpreadItem ... />)}
      </div>
    </section>
  );
}
```
Mobile and desktop are independent components. Changes to `MobileServiceAccordion` have zero impact on desktop. **Desktop Safety Contract fully satisfied by architecture.**

**Service data — 5 items, hardcoded at module level:**
Each service has: `anchor`, `index`, `icon`, `titleLines`, `packageLabel`, `description`, `responsePromise`, `proofLine`, `image`, `bullets`, optional `reverse`.

No `featured`, `popular`, or `priority` flag exists in the data model. Adding a badge like "Most Requested" would require extending this data shape.

**MobileServiceAccordion — auto-expand analysis:**
```tsx
const [openService, setOpenService] = useState<string>(services[0]?.anchor ?? "");
```
Initial state IS `"service-post-construction"` (first service). So the first service SHOULD be expanded on initial render.

But the screenshot showed all services collapsed with `+` indicators. Possible explanations:
1. Screenshot was captured after user manually collapsed it
2. The hashchange useEffect is overriding the initial state (if URL has an unrelated hash)
3. There's a race condition between initial state and useEffect

The useEffect:
```tsx
useEffect(() => {
  const syncWithHash = () => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && services.some((service) => service.anchor === hash)) {
      setOpenService(hash);
    }
  };
  syncWithHash();
  ...
}, []);
```
If the URL is `/#services` (from menu navigation), the hash would be `"services"`, which is NOT in the services array (entries are `"service-post-construction"`, etc.). So the `if` condition fails and `openService` stays as initial value. **Auto-expand should work.** The screenshot anomaly is likely due to capture timing or manual interaction.

**Image lazy loading — FIXED from code review:**
```tsx
const [loadedServiceImages, setLoadedServiceImages] = useState<string[]>(() =>
  services[0]?.anchor ? [services[0].anchor] : [],
);
```
Initial load: only first service's image. When a service is opened, its image loads. Once loaded, it persists in DOM even when collapsed (`shouldRenderImage = isOpen || loadedServiceImages.includes(service.anchor)`). This is the fix the code review recommended.

**Accordion accessibility:**
- `aria-expanded={isOpen}` on trigger button ✅
- `aria-controls={panelId}` linking button to panel ✅
- `aria-hidden={!isOpen}` on panel ✅
- `motion-reduce:transition-none` ✅
- Panel IDs: `{anchor}-panel` format ✅

**Missing from code review findings:** The `inert` attribute recommendation for collapsed panels is NOT implemented. Collapsed panels use `aria-hidden` but content is still in the tab order. The grid-rows animation hides content visually, and `aria-hidden` hides it from screen readers, but keyboard tab could still reach elements inside collapsed panels. This is the "Minor" severity finding from the code review that's still outstanding.

**Accordion animation technique:**
```tsx
className={`grid ... ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
```
Uses CSS Grid `grid-rows` trick for smooth height animation. This is the modern pattern — better than `max-h` because it animates to actual content height, not an arbitrary max value. Well-implemented.

**Desktop ServiceSpreadItem is very rich:**
- Full alternating layouts (flex-row / flex-row-reverse)
- `useInViewOnce` for scroll-triggered entrance animations
- Image overlays with package labels, index numbers, response promises
- `min-h-[60vh]` per item — intentionally large for visual impact
- Completely separate visual treatment from mobile

**Mobile accordion CTA renders conditionally:**
```tsx
{isOpen ? (
  <QuoteCTA ... className="cta-outline-dark mt-4 min-h-[48px] w-full justify-center gap-2">
    Quote This Service →
  </QuoteCTA>
) : null}
```
CTA only appears when expanded. This prevents orphaned/invisible CTAs in collapsed panels. Correct behavior.

### Pass 2 — Contextual Evaluation

**The accordion is the single biggest mobile UX win already implemented.** Five services × ~500px each = ~2,500px collapsed to ~400px. That's 2,100px saved. The header design is smart: icon + title + gold response promise gives enough information for a user to decide which to expand without needing to open each one.

**But the accordion content, when expanded, is missing its persuasion layer.** Compare what's visible on mobile vs. desktop:

| Element | Desktop | Mobile Accordion |
|---|---|---|
| Image | Large, ~56% width, with overlays | Small, 160px height, minimal overlay |
| Package label | Visible above title | Hidden |
| Proof line | Visible with icon tile | Hidden |
| Response promise | In image overlay AND in detail panel | In header (visible) ✅ |
| Index number | In image overlay | Hidden |
| Bullets | Full size with gold dots | Compact with gold dots ✅ |
| CTA | Always visible | Only when expanded ✅ |

Mobile users lose: package label, proof line, and the branded presentation of the service. They get: image + description + bullets + CTA. The most persuasive elements (proof line like "Built for punch-list closeouts and final walkthroughs") are invisible on mobile. This matters because mobile is presumably 60-70%+ of traffic for a local service business.

**Service type context not passed to form.** When a user taps "Quote This Service →" on Post-Construction Clean, the `QuoteCTA` opens the floating panel. But the service type isn't pre-selected. The user has to manually choose from the dropdown. This friction point is coded into the system: `QuoteCTA` calls `openQuote()` from QuoteContext, which just sets `isQuoteOpen = true` — no payload.

**The gold response promise in the accordion header is the strongest trust differentiator on the mobile page.** "Call-back target: under 1 hour during business hours" is specific, operational, and actionable. It tells the user exactly what to expect. This is the kind of micro-copy that competitors don't have. It's correctly surfaced in collapsed state — always visible without expanding.

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies | Desktop Safety |
|---|---|---|---|
| Add `featured` flag to service data + badge rendering | **Low** — extend ServiceItem type, add one field to first service object, render badge in accordion header | Data model change affects both mobile and desktop — but rendering is separate | Desktop would need separate badge rendering logic or ignore the flag |
| Surface proof line in mobile accordion | **Low** — add `service.proofLine` rendering inside expanded panel | Data already exists, just not rendered on mobile | Desktop unchanged |
| Surface package label in mobile accordion header | **Low** — add small text under title in header | Data already exists | Desktop unchanged |
| Pass service type through QuoteCTA → openQuote → FloatingQuotePanel | **Medium** — requires threading context through QuoteContext, extending openQuote signature, having FloatingQuotePanel pass initialServiceType to useQuoteForm | Touches PublicChrome (context), FloatingQuotePanel, useQuoteForm | No desktop impact |
| Add `inert` to collapsed panels | **Low** — add `inert` attribute to panel div when `!isOpen` | Minimal — just attribute toggle | N/A (mobile-only component) |
| Reorder services (feature one at top) | **Low** — reorder array items | Would change default auto-expand to whatever is index 0 | Desktop order also changes (shared data) unless array is duplicated |

---

## Cross-Cutting Findings (Across All Five Files)

### Finding 1: No Service Context Threading

The entire conversion funnel — from service accordion CTA through floating panel to form submission — passes zero context about which service the user was interested in. The data flow is:

```
QuoteCTA → openQuote() → isQuoteOpen = true → FloatingQuotePanel renders → useQuoteForm starts clean
```

The service type is available at the CTA point (each accordion item knows its `service.anchor` and service name). But `QuoteCTA` calls `useQuoteAction()` which returns `openQuote()` which takes no arguments. The fix requires extending this chain — it's not a one-file change.

### Finding 2: IncludedSummarySection Is Uniquely Vulnerable

It's the only section defined inline in VariantAPublicPage.tsx. Every other section is its own file/component. This means:
- It can't be tested in isolation
- It can't be lazy-loaded independently
- Its data (`INCLUDED_SUMMARY_ITEMS`) is coupled to the page file
- Refactoring it (merge, redesign, relocate) requires editing the page composition file directly

If we're considering merging it with TimelineSection or redesigning it as a process rail, extracting it to its own file first would make the work cleaner.

### Finding 3: Analytics Coverage Has Gaps

| Event | Tracked? |
|---|---|
| Section views | ✅ via IntersectionObserver |
| Scroll depth | ✅ via scroll listener |
| Form started | ✅ via markFormStarted |
| Quote CTA tapped | ✅ via quote_open_clicked |
| Step 1 complete | ✅ via quote_step1_completed |
| Step 2 viewed | ✅ via quote_step2_viewed |
| Step 2 complete | ✅ via quote_step2_completed |
| Form submitted | ✅ via quote_form_submitted (duplicated with quote_submit_success) |
| Panel closed without submit | ❌ |
| Step 1 complete but panel closed before step 2 | ❌ |
| Which service CTA was tapped | ❌ (source is tracked but not service type) |
| Hero variant linked to conversions | ✅ via hero_variant in form metadata |
| Accordion service expanded | ❌ |

The gaps matter for optimization: we can't measure accordion engagement (§15.6 target: "accordion expand interactions on mobile reach at least 35% of service-section viewers") without tracking which service panels are opened.

### Finding 4: Desktop Safety Is Architecturally Guaranteed for Services

The `ServiceSpreadSection` uses completely separate components for mobile and desktop. This is the strongest possible implementation of the Desktop Safety Contract — not just breakpoint hiding, but entirely different component trees. Changes to `MobileServiceAccordion` literally cannot affect desktop rendering. This pattern should be the model for other sections if they need divergent mobile/desktop treatments.

---

**Ready for the remaining section files.** Send OfferAndIndustrySection, TimelineSection, ServiceAreaSection, BeforeAfterSlider, CareersSection, FooterSection, PublicHeader, and the AuthorityBar / Testimonial components (wherever they live) and I'll continue the same analysis.

Good — I have enough to do the full three-pass on six more sections. Send the rest of PublicHeader, AuthorityBar, and TestimonialSection when you're ready. I'll continue the analysis on those when they arrive.

---

# Round 2 — Three-Pass Deep Analysis (Continued)

## File 6: `OfferAndIndustrySection.tsx` (Who We Serve)

### Pass 1 — Structural Read

**Data model — 3 industries, hardcoded at module level:**

Each `IndustryBlock` has: `title`, `eyebrow`, `painPoint`, `outcome`, `fit[]`, `stat`, `statLabel`, and a full set of color tokens (`accent`, `accentIcon`, `accentBorder`, `accentGlow`, `icon`).

This is a rich data shape — significantly richer than IncludedSummarySection's three title/description pairs. Each industry has its own color identity (blue/amber/emerald), its own icon component, and seven content fields. **The data is doing heavy lifting. The rendering is where the gaps are.**

**Desktop vs. Mobile rendering — NOT separated.** Unlike ServiceSpreadSection (which has completely separate mobile/desktop components), this section uses responsive Tailwind classes on a single component tree. Everything renders for both viewports with mobile-specific overrides via `md:` prefixes.

**Mobile-hidden elements in each card:**

| Element | Mobile | Desktop |
|---|---|---|
| Top gradient accent | Hidden (`hidden md:block`) | Visible |
| Top color line on hover | Hidden (`hidden md:block`) | Visible |
| Fit items as pills | Hidden (`hidden md:flex`) → shown as comma-separated text (`md:hidden`) | Pill badges |
| Outcome block (colored sidebar quote) | Hidden (`hidden md:flex`) | Visible |
| Icon/eyebrow row | Visible (smaller) | Visible (larger) |
| Stat + stat label | Visible | Visible |
| Pain point text | Visible | Visible |
| "Best suited for" section | Visible (compact text) | Visible (pills) |
| "Discuss Your Project" CTA | Visible | Visible |

**The outcome block is completely hidden on mobile.** This is the differentiated value proposition per persona — "A&A helps tighten the final presentation with detail-focused cleaning and proof-of-completion support." Mobile users never see this. They get the pain point (what's wrong) but not the outcome (how A&A fixes it). This is a significant persuasion gap.

**The "TALK THROUGH YOUR SCOPE" CTA placement:**
```tsx
<QuoteCTA className="cta-primary group/btn flex w-fit items-center gap-2.5 whitespace-nowrap">
  Talk Through Your Scope
  <ArrowRight ... />
</QuoteCTA>
```
This is inside the header area, rendered in a `flex-col md:flex-row` layout with the heading text. On mobile (`flex-col`), it sits below the subtitle paragraph but **above the persona cards.** On desktop (`md:flex-row md:items-end md:justify-between`), it sits to the right of the heading. 

On desktop the placement is fine — it's a sidebar CTA alongside the heading. On mobile it's asking for action before delivering value.

**The "Discuss Your Project" CTA:**
```tsx
<QuoteCTA className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A1628] transition-all duration-300 group-hover:gap-3 group-hover:text-[#2563EB]">
  Discuss Your Project
  <ArrowRight className="h-4 w-4 ..." />
</QuoteCTA>
```
This is a text link with arrow. No button treatment — no background, no border, no padding beyond inline-flex. **Confirmed: the visual pass finding is accurate.** This is the weakest CTA on the page for the highest-qualified traffic.

Note: `QuoteCTA` wraps the `useQuoteAction()` hook — so "Discuss Your Project" opens the same floating panel as every other quote CTA. No service type pre-selection. No persona context. A GC who tapped "Discuss Your Project" on the General Contractors card opens a generic form.

**Hover interaction system (desktop):**
```tsx
const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
```
When a card is hovered: it elevates (`-translate-y-2`), gets accent shadow and border. Non-hovered cards dim (`opacity-80 scale-[0.98]`). This is a nice desktop interaction that communicates which card is active. **This interaction does nothing on mobile** — there's no hover on touch devices. The `onMouseEnter`/`onMouseLeave` handlers are desktop-only by nature.

### Pass 2 — Contextual Evaluation

**This section answers the right question at the right time.** After Services (what we do), the user needs "Is this for me?" — and the three persona cards provide exactly that. The pain points are genuinely specific: "Punch-list pressure and inconsistent final-clean quality across trades can slow handoff" is language a GC actually thinks. This is strong copy that most competitors can't match.

**But the mobile rendering strips out the resolution.** On mobile, a user sees:
1. Pain point (the problem)
2. "Best suited for" (comma-separated text)
3. "Discuss Your Project →" (text link)

They **don't** see the outcome (how A&A solves it). The persuasion arc is: problem → ??? → CTA. The middle is missing. This is like showing someone what's broken and then asking them to buy, without explaining the fix.

**The three cards stacked vertically are ~1,100-1,200px on mobile.** Each card is roughly 350-400px tall. The document suggested a horizontal carousel. Looking at the data model, each card is self-contained (no cross-references between cards), exactly three cards (natural carousel count), and each has a unique color identity. **This is structurally ideal for a swipe carousel.**

**The stat positioning is interesting.** Each card leads with: icon + eyebrow → title → **stat** → pain point. The stat (200+, 48hr, 15+) comes before the pain point. This means a scanning user sees the credibility number before the problem statement. That's actually good — it establishes authority before identifying the pain. Keep this order.

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies | Desktop Safety |
|---|---|---|---|
| "Discuss Your Project" → button treatment | **Low** — change className on QuoteCTA. Add background, padding, border | None | All-viewport unless mobile-gated. Desktop hover interactions would need to accommodate a larger CTA element |
| Show outcome text on mobile | **Low** — remove `hidden md:flex` from outcome block, or add a mobile-specific compact version | None | Desktop unchanged |
| Move "Talk Through Your Scope" below cards on mobile | **Low-Medium** — need to restructure the flex layout so the CTA moves on mobile but stays beside heading on desktop. Could use `order-last md:order-none` or duplicate the element | Layout reflow risk | Desktop unchanged if using order utility |
| Convert to horizontal carousel on mobile | **Medium-High** — new interaction pattern (swipe, snap scroll, peek). Need new mobile-only wrapper component | Would need to decide: does expanding a card still work in carousel? Or does each card link directly to quote/persona page? | Desktop grid untouched — same pattern as ServiceSpreadSection's dual rendering |
| Pass persona/service context through CTA | **Medium** — same threading issue as services. QuoteCTA → openQuote needs to carry context | Same QuoteContext extension as services | N/A |

---

## File 7: `TimelineSection.tsx` (How It Works)

### Pass 1 — Structural Read

**Data model — 4 steps, hardcoded at module level:**

Each step has: `number`, `icon`, `title`, `body`, `image`, `detail` (short label like "Fast intake").

**Mobile vs. Desktop rendering — single component with responsive hiding:**

| Element | Mobile | Desktop |
|---|---|---|
| Step number (large serif text) | Visible | Visible (positioned differently) |
| Detail label (e.g., "Fast intake") | Visible via `section-kicker md:hidden` | Hidden (icon tile shown instead) |
| Icon tile | Hidden (`hidden md:inline-flex`) | Visible |
| Step title | Visible | Visible |
| Body text | Visible | Visible |
| Step image | **Hidden** (`hidden md:block`) | Visible (side-by-side layout) |
| Timeline progress spine | Hidden (`hidden md:block`) | Visible with animated height |
| Center dot indicator | Hidden (`hidden md:flex`) | Visible |

**Mobile users see text only.** No images, no icons, no progress spine. Each step on mobile is: large number → colored detail label → title → paragraph. The images exist in the data (paths to `timeline-01.jpg` through `timeline-04.jpg`), the icon components exist (`StepIcon`), but both are explicitly hidden below `md` breakpoint.

**The progress spine is a sophisticated desktop feature:**
```tsx
const [visibleSteps, setVisibleSteps] = useState<string[]>([]);
const progressHeight = `${(visibleSteps.length / steps.length) * 100}%`;
```
As each step enters the viewport, it's added to `visibleSteps`, which drives the progress bar height. This creates a visual "filling up" effect as the user scrolls. **This entire mechanism is invisible on mobile** — both the spine and the dots are `hidden md:block/flex`.

**Intro paragraph (the redundant one):**
```tsx
<p className="mx-auto mt-4 max-w-2xl text-sm font-normal leading-relaxed text-slate-600 md:font-light md:text-base">
  The workflow stays simple: rapid intake, clean scope alignment, disciplined execution, and a handoff that feels ready.
</p>
```
This literally summarizes the four step titles below it. "Rapid intake" = Step 1, "clean scope alignment" = Step 2, "disciplined execution" = Step 3, "handoff that feels ready" = Step 4. It's a spoiler paragraph that adds ~60px of scroll while providing zero new information.

**The alternating layout on desktop:**
```tsx
reverse={index % 2 === 1}
```
Steps alternate left/right on desktop with `md:flex-row` / `md:flex-row-reverse`. On mobile, `flex-col` makes this irrelevant. The alternating layout creates visual rhythm on desktop but has no mobile equivalent.

**Section height estimate on mobile:** Each step is roughly 200px (number + label + title + paragraph with hardened spacing). Four steps + section header ≈ 850px. This matches the visual pass estimate.

### Pass 2 — Contextual Evaluation

**Thematic overlap with IncludedSummarySection — now confirmed at data level:**

| IncludedSummary | Timeline | Overlap |
|---|---|---|
| "Scope-Driven Planning" | Step 2: "We Assess" — "review the scope, visit if needed, provide a clear estimate" | Same concept |
| "Detail-Level Delivery" | Step 3: "We Clean" — "detail-focused standards" | Same concept |
| "Fast Communication" | Step 1: "Request a Quote" — "review the request quickly and confirm the next step" | Same concept |

The data confirms what the visual pass suspected: these two sections say the same thing with different words. IncludedSummary says it abstractly (planning, delivery, communication). Timeline says it concretely (intake, assess, clean, walkthrough). **The concrete version is better.** It gives the user an actual mental model of what happens, not a list of values.

**Merge feasibility assessment:** If IncludedSummary's three items were absorbed into Timeline's four steps:
- "Fast Communication" → Step 1 (intake/communication) — add as sub-line: "Direct response and bilingual coordination"
- "Scope-Driven Planning" → Step 2 (assessment/scope) — add as sub-line: "We align crew, service type, and schedule"
- "Detail-Level Delivery" → Step 3 (execution/cleaning) — add as sub-line: "Every phase from rough clean to final walkthrough"

Step 4 (closeout) already has its own distinct value and doesn't need an IncludedSummary mapping.

**This merge is clean.** No data conflicts, no structural barriers. The Timeline component would need to accept optional sub-lines per step, which is a trivial data model extension.

**The mobile text-wall problem is real but solvable without a full stepper accordion.** The simplest meaningful improvement would be:
1. Show the `StepIcon` components on mobile (remove `hidden md:inline-flex`)
2. Remove the intro paragraph
3. Tighten spacing slightly more

This would add visual anchors and reduce height by ~80px without any component restructuring. A full stepper accordion (collapse to headers, expand one at a time) would be the complete solution but is more effort.

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies | Desktop Safety |
|---|---|---|---|
| Remove intro paragraph | **Low** — delete one `<p>` element | None | Removes on desktop too. If desktop wants it, mobile-gate the removal with `hidden md:block` |
| Show StepIcon on mobile | **Low** — remove `hidden md:inline-flex` from icon tile wrapper | None | Desktop unchanged — icons already visible there |
| Add sub-lines to step data | **Low** — extend data model, add optional `subLine` rendering | None | Would show on desktop too unless mobile-gated |
| Merge IncludedSummary data into Timeline | **Medium** — requires removing IncludedSummarySection from VariantAPublicPage.tsx composition AND extending Timeline data/rendering | Changes page scroll behavior, analytics section_view data | Desktop would lose the 3-column card section. Need to verify desktop stakeholders approve |
| Convert to stepper accordion on mobile | **Medium** — new mobile-only wrapper (same pattern as ServiceSpreadSection) with collapsed headers and single expansion | If combined with merge, needs to incorporate IncludedSummary sub-lines | Desktop completely untouched if using separate mobile component |
| Show images on mobile (small thumbnails) | **Low** — remove `hidden md:block` from image wrapper, adjust height for mobile | Performance: 4 additional images loading on mobile | Desktop unchanged |

---

## File 8: `ServiceAreaSection.tsx` (Where We Work)

### Pass 1 — Structural Read

**Data model — 10 areas, hardcoded at module level:**

Each area has: `name`, `distance` (static string), `region` ("north"/"central"/"south"), `x`/`y` (SVG coordinates).

**Confirmed: distances are static literals**, not calculated. "Georgetown: 30 mi", "Austin: HQ", etc. The x/y coordinates are for the SVG map positioning — they don't represent real geolocation.

**Desktop vs. Mobile — major rendering difference:**

The map visualization (SVG with dots, lines from Austin HQ, hover interactions) is **completely hidden on mobile** (`hidden md:block`). This includes:
- The SVG map itself
- All area dots with their animations
- Connection lines from HQ to each area
- Hover tooltip interactions on map dots

**Mobile shows only the right-side content column:** heading, city cards grid, city pills, region legend, and CTA.

**The duplicate navigation problem — now confirmed at code level:**

Three separate navigational affordances for the same cities, all visible on mobile simultaneously:

**Affordance 1 — City cards grid:**
```tsx
<div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 md:mt-8 lg:grid-cols-2 xl:grid-cols-4">
  {areas.map((area, i) => (
    <div key={area.name} className="flex items-center gap-2.5 rounded-xl border px-3.5 py-3 ...">
      {/* dot + name + distance */}
    </div>
  ))}
</div>
```
10 cards, 2 columns on mobile. These are NOT links — they're plain `<div>` elements with hover effects. They show city name + distance + region dot. On desktop they coordinate with the SVG map via `hoveredArea` state. **On mobile they're purely decorative information displays** — you can't tap them to go anywhere.

**Affordance 2 — City pills (Link elements):**
```tsx
<div className="mt-4 flex flex-wrap gap-2">
  {[
    { name: "Round Rock", href: "/service-area/round-rock" },
    { name: "Georgetown", href: "/service-area/georgetown" },
    // ... 6 total
  ].map((city) => (
    <Link key={city.name} href={city.href} className="...">
      {city.name}
    </Link>
  ))}
</div>
```
6 pills (a SUBSET of the 10 cities above), each linking to `/service-area/[slug]`. These ARE interactive links. They go to the city pages that §16.4 says should be decommissioned.

**Affordance 3 — Region legend:**
```tsx
<div className="mt-4 flex items-center gap-5 md:mt-6">
  {Object.entries(regionMeta).map(([key, meta]) => (
    <div key={key} className="flex items-center gap-1.5">
      <span ... style={{ backgroundColor: meta.dot }} />
      <span className="text-[10px] text-slate-500">{meta.label}</span>
    </div>
  ))}
</div>
```
Three items: North (blue dot), Central (white dot), South (gold dot). Not interactive. Purely decorative legend.

**Affordance 4 — CTA button:**
```tsx
<QuoteCTA ctaId="service_area_check_availability" className="... bg-[#C9A94E] ...">
  Check Availability in Your Area
</QuoteCTA>
```
This opens the quote panel — same as every other QuoteCTA. No area/city context is passed.

**So on mobile, the user sees:**
1. Section heading + subtitle (~100px)
2. 10 city cards in a 2-column grid (~300px) — non-interactive
3. 6 city pills (~50px) — link to pages being decommissioned
4. Region legend (~30px) — decorative
5. CTA + helper text (~80px)

**Total: ~560-600px for the message "We serve the Austin metro area."**

**The city pills are hardcoded separately from the areas array.** The pills list 6 cities with explicit href strings. The areas array lists 10 cities with coordinates. There's no shared data source — they're independently maintained. If a city is added to one, it won't automatically appear in the other. This is a maintenance hazard.

### Pass 2 — Contextual Evaluation

**This section answers "Do you cover my area?" — a legitimate question for a local service business.** The answer is simple: "Georgetown to San Marcos, we serve the greater Austin metro." The section takes ~600px to communicate this because it's showing it three different ways.

**The SVG map (desktop only) is genuinely well-built.** The dot animations, connection lines, hover tooltips, and staggered reveal are polished. It's the most visually engaging element in this section. **Its absence on mobile is a loss** — the document recommended bringing a simplified version to mobile, and I agree.

**But the mobile replacement (city cards) is both non-interactive and redundant.** A user sees 10 cards they can't tap, then 6 pills they can tap (which go to pages being decommissioned), then a region legend that adds nothing actionable. The informational value is: "Here are the cities we serve and approximately how far they are from us." This could be communicated in a single row of city pills or a simple text list.

**The decommission problem is real and immediate.** The 6 city pill Links go to `/service-area/[slug]` pages. §16.4 mandates decommissioning these. But even before decommission, these links are creating SEO value for pages that may have thin content. If the slug pages have good content, keep them but remove the pills (let organic search find them). If the slug pages are thin, redirect and remove.

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies | Desktop Safety |
|---|---|---|---|
| Remove city pills entirely | **Low** — delete the hardcoded array and rendering block | Need to add redirects for `/service-area/[slug]` URLs that may have external links | Desktop also loses pills (they render on all viewports) |
| Remove region legend | **Low** — delete the legend block | Desktop map would lose its legend. Consider keeping on desktop only (`hidden md:flex`) | Need to gate removal to mobile only |
| Make city cards interactive (tap → quote with area context, or tap → smooth scroll to CTA) | **Low-Medium** — change `<div>` to `<button>` with onClick | If linking to slug pages: conflicts with decommission. If opening quote panel: same context-threading issue | Desktop cards coordinate with map hover; adding click behavior may conflict with hover UX |
| Add simplified mini-map on mobile | **Medium** — create a mobile-only SVG (simpler than desktop version, fixed height ~220px) | Could reuse `areas` data for dot positions. Would need new responsive-gated rendering | Desktop map unchanged |
| Consolidate to pills-only on mobile (remove cards) | **Low** — hide city cards on mobile (`hidden md:grid`), make pills the mobile presentation | Need to ensure pills include all relevant cities (currently only 6 of 10) | Desktop keeps cards + map + pills |
| Full decommission of slug pages | **Medium** — delete page files, add redirects in `next.config.js`, remove references | Need to preserve one canonical `/service-area` URL. Need redirect mapping. Links from external sources would 301 | N/A — routing change, not component change |

---

## File 9: `BeforeAfterSlider.tsx` (See the Difference)

### Pass 1 — Structural Read

**Data model — 3 comparison pairs, hardcoded:**

Each pair: `before` image, `after` image, `caption`, `tag`, `scope`, `turnaround`. "Key Benefit" ("Inspection-ready results") is hardcoded in the metadata grid — it's the same for all pairs and not in the data model.

**The slider is sophisticated:**
- Uses `clipPath: inset()` for the before/after reveal — this is the modern performant approach (GPU-composited)
- Supports mouse drag + touch drag + keyboard (ArrowLeft/Right, Home/End)
- Has an auto-intro animation sequence (50% → 25% → 75% → 50%) that plays on first view and stops once user interacts
- `role="slider"` with full ARIA attributes (`aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`)
- Touch action set to `pan-y pinch-zoom` — allows vertical scrolling while handling horizontal drag

**Accessibility is well-implemented** for the slider itself. Keyboard support, ARIA roles, and screen reader text are all present. This is better than most before/after sliders I've seen.

**The tab/category system:**
```tsx
{pairs.map((pair, idx) => (
  <button ... onClick={() => switchSlide(idx)} ...>
    {pair.tag}
  </button>
))}
```
Three tabs (Commercial Office, Apartment Turn, Post-Construction). Switching tabs triggers a 300ms opacity transition, then swaps the active pair and resets slider to 50%. This is smooth and well-timed.

**Metadata grid below the slider:**
```tsx
<div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-4">
  {[
    { label: "Project", value: item.caption, accent: true },
    { label: "Scope", value: item.scope },
    { label: "Result", value: item.turnaround },
    { label: "Key Benefit", value: "Inspection-ready results" },
  ].map(...)
```
4-column on desktop, single column (stacked) on mobile. Each cell: label (small caps) + value. The "accent" flag on Project makes it blue instead of gray. **"Key Benefit" is hardcoded to "Inspection-ready results" for ALL pairs.** This should probably be per-pair data.

**No CTA in this section.** After viewing proof of quality work, there's no conversion path. The user has to scroll to the next section or use the sticky bar. The document suggested adding a micro-CTA: "Want this for your space? →" This is structurally easy to add — just another element after the metadata grid.

**Image loading:** Both before and after images load for the active pair. The `priority` flag is only on the first pair's after image (`priority={active === 0}`). When switching tabs, new images load — there's no preloading of inactive pair images, so tab switches may show a brief loading state on slower connections.

### Pass 2 — Contextual Evaluation

**This is the strongest proof section on the page.** Visual before/after evidence is more persuasive than text testimonials. The slider interaction is engaging and tactile. The category tabs let users self-select relevant proof. The metadata grid adds project specifics.

**But the hierarchy is inverted.** The current flow is: slider (visual proof) → metadata (project details). The most impactful information is the **result** — "Final Presentation," "Leasing Ready," "Walkthrough Ready." But these are buried as small text in the third cell of the metadata grid, with equal visual weight to "Scope" and "Key Benefit." The result should be the largest text after the slider.

**"See the Difference" as headline vs "The A&A Standard" as section kicker:** The kicker "The A&A Standard" is more powerful branding than the headline "See the Difference." But it's rendered as tiny uppercase tracking text while "See the Difference" is the serif h2. Swapping their visual treatment (make "The A&A Standard" the headline, make "See the Difference" the subtitle or remove) would strengthen brand framing.

**Missing: conversion path after proof.** This is the moment a user is most persuaded — they've just seen visual evidence of quality work. But the section ends with a metadata grid. No CTA, no bridge to the next step. The user's momentum dissipates into the next section (Testimonials, which provides more social proof but still no CTA).

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies | Desktop Safety |
|---|---|---|---|
| Add per-pair "Key Benefit" to data model | **Low** — add field to `ComparisonPair` type, replace hardcoded string | None | All-viewport |
| Swap headline/kicker visual treatment | **Low** — CSS changes on existing elements | None | All-viewport — verify desktop typography still works |
| Add micro-CTA after metadata grid | **Low** — add QuoteCTA element below grid | Same context-threading question: which service type to pre-select? Could use `item.tag` | All-viewport |
| Make "Result" the hero text in metadata | **Low** — restructure metadata grid to feature one cell prominently | Layout change affects desktop grid too | Need to verify 4-column desktop layout still works with one featured cell |
| Preload adjacent pair images | **Low** — add hidden Image elements for pairs[active-1] and pairs[active+1] | Performance: 2 extra images in DOM. Worth it for 3 total pairs | All-viewport |

---

## File 10: `CareersSection.tsx`

### Pass 1 — Structural Read

**Self-contained component with no external data dependencies.** Uses `ScrollReveal` (a wrapper for scroll-triggered animations) and a local `PERKS` array. No props from parent, no shared data files, no API calls.

**The component has a `/careers` link:**
```tsx
<Link href="/careers" className="group inline-flex items-center gap-3 ...">
  See Open Positions
</Link>
```
This confirms the /careers route exists separately. CareersSection is a "preview" embedded in the homepage.

**Background image:** Uses `careers-hero.jpg` as a full-bleed background with dark overlay (same pattern as hero). This makes the section visually heavy — it's not just cards on white, it's a full scenic section with image + text + perk cards.

**Estimated mobile height:** ~650px. Heading area (~250px) + perk cards (3 × ~80px = 240px) + gaps (~160px).

**Import pattern:** Uses `import Image from "next/image"` and `import Link from "next/link"` — standard Next.js components. The `ScrollReveal` import suggests a shared utility for scroll animations.

**No "use client" directive in the file as provided.** This is a server component — the `ScrollReveal` wrappers handle the client-side animation. (Note: actually, looking again, the PERKS array contains JSX elements as `icon` values — SVG elements rendered inline. This should work in a server component because SVG JSX is just markup.)

Wait — actually, `ScrollReveal` is likely a client component (it needs IntersectionObserver). If `CareersSection` renders `ScrollReveal` as a child, it can still be a server component itself. The JSX SVGs in PERKS will be serialized across the server-client boundary. This is fine architecturally.

### Pass 2 — Contextual Evaluation

**This section is well-built for a /careers page. It's wrong for the homepage.** The content (team size, Glassdoor rating, career perks) serves employer brand — it tells potential employees why A&A is a good place to work. None of this helps a GC or property manager decide to request a quote.

**The section actually hurts the conversion funnel.** It sits after `MobileQuoteCloser` (the "Let's Talk" terminal CTA). A user who was ready to act just saw "Let's Talk About Your Project" with quote + call buttons. Then they scroll into a recruiting section with a different visual language (careers hero image, perk cards, "See Open Positions" CTA). This is a context switch that breaks conversion momentum.

**Removal is clean.** The component:
- Has no props from parent
- Has no shared state with siblings
- Is referenced in VariantAPublicPage.tsx as a single line: `<CareersSection />`
- Has its own route (/careers) that imports it independently
- Removing from homepage composition is a one-line change

The only consideration: does the /careers page import CareersSection directly? If so, removing from homepage has zero side effects. If the /careers page renders its own layout (not reusing this component), then this component might become orphaned after homepage removal — but that's a cleanup task, not a blocker.

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies | Desktop Safety |
|---|---|---|---|
| Remove from homepage composition | **Trivial** — delete `<CareersSection />` line from VariantAPublicPage.tsx | Verify /careers page has its own rendering (doesn't depend on homepage presence) | All-viewport removal. Desktop also loses section |
| Keep footer nav link to /careers | **None** — already exists in FooterSection nav grid | N/A | N/A |
| Keep menu link to /careers | **None** — already exists in PublicHeader | N/A | N/A |
| Replace with compact banner on homepage | **Low** — single-line component: "We're hiring → See positions" | New small component | All-viewport |

---

## File 11: `FooterSection.tsx`

### Pass 1 — Structural Read

**Two distinct zones:**

**Zone 1 — Footer CTA module (the duplicate):**
```tsx
<div className="mb-8 rounded-2xl border border-white/10 bg-[linear-gradient(...)] px-5 py-6 shadow-[...] backdrop-blur md:mb-16 md:...">
  <div className="max-w-2xl">
    <p className="...">Project Closeout Ready</p>
    <h3 className="...">Bring A&A in before the handoff gets rushed.</h3>
    <p className="...">Construction-ready cleaning support ...</p>
    <ul className="mt-4 hidden ... md:flex">service highlight chips</ul>
  </div>
  <div className="mt-6 flex flex-col gap-3 md:mt-0 md:items-end">
    <QuoteCTA ctaId="footer_get_quote_secondary" className="cta-gold">Get Your Free Quote</QuoteCTA>
    <CTAButton ctaId="footer_call_now_link" ...>Or call {COMPANY_PHONE}</CTAButton>
  </div>
</div>
```

This is a visually prominent module with:
- Its own headline ("Bring A&A in before the handoff gets rushed")
- Its own body copy
- Its own QuoteCTA (ctaId: `footer_get_quote_secondary`)
- Its own call CTA
- Service highlight pills (desktop only)

**This is structurally identical to MobileQuoteCloser's intent.** Both say "get a quote or call us." The MobileQuoteCloser is mobile-only (`md:hidden`). The Footer CTA module is all-viewport. So on desktop, the Footer CTA is the only conversion closer (since MobileQuoteCloser is hidden). On mobile, BOTH render — MobileQuoteCloser appears in the page content, then CareersSection, then this Footer CTA.

**This creates a desktop dependency.** If we remove the Footer CTA module entirely, desktop loses its final conversion prompt before the utility footer. Options:
1. Make `MobileQuoteCloser` all-viewport (remove `md:hidden`) and remove Footer CTA
2. Keep Footer CTA on desktop only (`hidden md:block`)
3. Create a new simplified all-viewport closer

**Zone 2 — Utility footer:**
Standard footer grid with:
- Brand description + attribute pills
- Navigation links (8 items in 2-column mobile grid / 1-column desktop)
- Contact info (phone, email, location text)
- "Built For" target clients (desktop only)
- Copyright

The utility footer is clean and well-structured. No issues here beyond minor optimization.

**The FooterSection renders inside PublicChrome, outside the page composition.** This means it appears on ALL public pages, not just the homepage. The Footer CTA module shows on /faq, /privacy, /terms, /careers, etc. This is arguably correct (every page should have a conversion path) but means simplifying it affects all pages, not just the homepage.

### Pass 2 — Contextual Evaluation

**The Footer CTA module is the third conversion prompt in the last ~1,800px of mobile scroll:** MobileQuoteCloser (~450px) → CareersSection (~650px) → Footer CTA (~300px) → Utility Footer (~400px). That's three different conversion messages competing for the user's final attention.

After removing CareersSection and making MobileQuoteCloser the terminal section, the Footer CTA module would be the next thing after it. Two conversion prompts back-to-back is still redundant.

**The desktop dependency is the key constraint.** Desktop doesn't have MobileQuoteCloser (`md:hidden`). Desktop's conversion closer is this Footer CTA module. Removing it entirely means desktop has no final CTA before the utility footer.

**Recommended resolution:** Make MobileQuoteCloser all-viewport (it's already well-designed as a conversion closer) and then either:
- Remove Footer CTA entirely, or
- Reduce Footer CTA to a compact one-liner on both viewports

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies | Desktop Safety |
|---|---|---|---|
| Remove Footer CTA module entirely | **Low** — delete the `<div className="mb-8 rounded-2xl ...">` block and its contents | **Desktop loses final CTA** — must provide replacement (make MobileQuoteCloser all-viewport) | Directly impacts desktop. Must solve desktop closer first |
| Make MobileQuoteCloser all-viewport | **Low** — remove `md:hidden` from MobileQuoteCloser in VariantAPublicPage.tsx | MobileQuoteCloser's design (stacked trust bullets + dual CTA) works at all widths. May need `md:` max-width constraint for desktop | Adds a new section to desktop layout. Verify it fits the desktop design language |
| Reduce Footer CTA to one-liner | **Low** — replace current block with single row: text + button | Reduces visual weight while maintaining conversion path | Still renders on all pages (it's in FooterSection). Make sure one-liner works on /faq, /privacy, etc. |
| Gate Footer CTA to homepage only | **Medium** — FooterSection doesn't know if it's on the homepage. Would need pathname check or prop | Adds conditional logic to a currently-simple component | Could use `usePathname()` — but FooterSection is currently a server component (no "use client" directive). Adding pathname would require making it a client component |

Wait — looking again at FooterSection: it imports `QuoteCTA` and `CTAButton`. `QuoteCTA` uses `useQuoteAction()` which requires QuoteContext. Context requires client-side rendering. But FooterSection doesn't have "use client" at the top. 

Looking at the import: `import { QuoteCTA } from "./QuoteCTA"` — QuoteCTA itself is likely "use client". In Next.js App Router, a server component can render a client component as a child. So FooterSection can be a server component that renders QuoteCTA (a client component) as a leaf. This is valid architecture.

But this means we **can't** use `usePathname()` in FooterSection without converting it to a client component. If we want homepage-only gating, we'd need to either:
- Pass a prop from PublicChrome (which knows the pathname)
- Convert FooterSection to "use client"
- Create a separate `FooterCTAModule` client component that checks pathname

---

## File 12: `PublicHeader.tsx` (Partial — Cut Off)

I have the data structures and the beginning of the component. Key observations from what's available:

**Navigation data — three separate arrays:**

```tsx
const serviceLinks = [
  { href: "/#service-post-construction", label: "Post-Construction", desc: "..." },
  // 5 items
];

const industryLinks = [
  { href: "/#industries", label: "General Contractors", desc: "..." },
  // 3 items — ALL href to /#industries (same anchor)
];

const primaryLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#industries", label: "Industries" },
  { href: "/#about", label: "About" },
  { href: "/#service-area", label: "Service Area" },
  { href: "/faq", label: "FAQ" },
  { href: "/#careers", label: "Careers" },
];
```

**All industry links go to the same `/#industries` anchor.** There are no separate industry pages — General Contractors, Property Managers, and Commercial Offices all scroll to the same section. This confirms the §15.5 directive about building industry vertical pages hasn't been executed.

**The `/#careers` link in primaryLinks** points to a hash anchor on the homepage. If CareersSection is removed from the homepage, this link would scroll to a section that no longer exists. **This needs to be updated to `/careers` (route) when CareersSection is removed from homepage.**

**Service links use individual service anchors** (`/#service-post-construction`, etc.). These would scroll to the specific accordion item on the homepage. Tapping one would need to: navigate to homepage + scroll to anchor + potentially expand that accordion item. Currently, the accordion's `hashchange` listener would detect this and expand the matching service. This is well-wired.

**Header scroll state:**
```tsx
const threshold = Math.max(120, window.innerHeight * 0.5);
setIsScrolled(window.scrollY > threshold);
```
Header becomes "solid" (scrolled style) after 50% viewport height or 120px minimum. This prevents the transparent hero header from persisting too long.

**Desktop dropdown state:**
```tsx
const [openDesktopMenu, setOpenDesktopMenu] = useState<"services" | "industries" | null>(null);
```
Two expandable menus on desktop: Services and Industries. Closed on outside click and Escape key.

I need the rest of this file to analyze the mobile menu rendering, backdrop implementation, chevron treatment, and item visual hierarchy. **Send remaining PublicHeader when ready.**

---

## Cross-Cutting Findings (Round 2)

### Finding 5: Outcome Text Hidden on Mobile Across Multiple Sections

| Section | What's hidden on mobile | Impact |
|---|---|---|
| Who We Serve | Outcome block (how A&A solves the pain point) | User sees problem but not solution before CTA |
| How It Works | Step images, icon tiles, progress spine | User gets text-only process without visual progression |
| Service Area | SVG map with interactive dots | User loses geographic credibility visualization |
| Before/After | Nothing hidden (all-viewport) — but metadata hierarchy is flat | Lower impact but missed opportunity |

The pattern: the most visually engaging and persuasive elements are desktop-only. Mobile gets the text. This is likely a performance/layout decision from the original build — images and interactive elements were hidden to simplify mobile layout. But the result is that mobile users (the majority of traffic for a local service business) get the least persuasive version of every section.

### Finding 6: Hardcoded Content Duplication

City data appears in three places:
1. `areas` array in `ServiceAreaSection.tsx` (10 cities with coordinates)
2. City pills in `ServiceAreaSection.tsx` (6 cities with hardcoded hrefs — separate from areas array)
3. `service-areas.ts` (referenced but not provided — likely the canonical source for slug pages)

Industry data appears in:
1. `industries` array in `OfferAndIndustrySection.tsx` (3 industries with full data)
2. `industryLinks` array in `PublicHeader.tsx` (3 industries with labels + descriptions)

Service data appears in:
1. `services` array in `ServiceSpreadSection.tsx` (5 services with full data)
2. `serviceLinks` array in `PublicHeader.tsx` (5 services with labels + descriptions)

None of these share a data source. If a service is renamed in the accordion, the menu label wouldn't automatically update. This is manageable at current scale (5 services, 3 industries, 10 cities) but would become a maintenance issue at growth.

### Finding 7: Quote Context Threading Is the Systemic Gap

Every conversion CTA on the page — hero, services, Who We Serve, service area, footer, sticky bar — calls the same `openQuote()` function with zero context. The form always starts blank. The user always re-selects their service type manually.

This is the single highest-impact architectural change for conversion: **thread context through the quote funnel.** A user who taps "Quote This Service" on Post-Construction should see the form with Post-Construction pre-selected. A user who taps "Discuss Your Project" on General Contractors should see the form with a GC-relevant greeting or pre-selection.

Implementation path:
1. Extend `QuoteContext` value to include `openQuote(context?: { serviceType?: string; source?: string })`
2. Store context in state alongside `isQuoteOpen`
3. Pass context to `FloatingQuotePanel` as props
4. FloatingQuotePanel passes `initialServiceType` to `useQuoteForm`
5. `useQuoteForm` calls `setServiceType(initialServiceType)` on mount if provided

This touches: `QuoteContext.tsx`, `PublicChrome.tsx`, `FloatingQuotePanel.tsx`, `useQuoteForm.ts`, and every component that calls `openQuote()` (to optionally pass context). It's a medium-effort change with high conversion impact.

### Finding 8: IncludedSummarySection → TimelineSection Merge Is Clean

After reviewing both files' data models:

| IncludedSummary item | Maps to Timeline step | Merge approach |
|---|---|---|
| "Scope-Driven Planning" + "We align crew, service type, and schedule before work starts." | Step 02 "We Assess" | Add as `valueLine` field |
| "Detail-Level Delivery" + "From rough clean to final walkthrough readiness, every phase is covered." | Step 03 "We Clean" | Add as `valueLine` field |
| "Fast Communication" + "Direct response and bilingual coordination with your team." | Step 01 "Request a Quote" | Add as `valueLine` field |

Step 04 "You Walk Through" has no IncludedSummary mapping — it gets its own value: "Closeout ready" (already in `detail` field).

Extended data model:
```tsx
const steps = [
  {
    number: "01",
    icon: "request",
    title: "Request a Quote",
    body: "...",
    valueLine: "Direct response and bilingual coordination with your team.",
    image: "...",
    detail: "Fast intake",
  },
  // ...
];
```

Rendering: show `valueLine` as a highlighted sub-text (maybe with an icon or accent color) below the body text. This adds the IncludedSummary messaging without a separate section.

Desktop impact: The 3-column card section disappears on desktop too. This needs explicit approval since the Desktop Safety Contract says desktop composition should be preserved. Options:
- Keep IncludedSummarySection on desktop only (`hidden md:block` on the section, or only include `valueLine` in Timeline on mobile)
- Accept that the merged Timeline section serves both viewports

---

**Send me the remaining PublicHeader code, AuthorityBar, and TestimonialSection and I'll complete the analysis. Once all sections are reviewed, I'll compile the master implementation document.**

# Round 3 — Final Three Files + Comprehensive Cross-Cutting Analysis

---

## File 13: `PublicHeader.tsx` (Complete)

### Pass 1 — Structural Read

**Mobile menu architecture — `<details>` elements, not React state:**

```tsx
<details className="group rounded-xl bg-white/[0.04]">
  <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 ...">
    <span>Services</span>
    <span aria-hidden="true" className="text-slate-400 transition-transform group-open:rotate-90">›</span>
  </summary>
  <div className="space-y-1 px-3 pb-3">
    {serviceLinks.map(...)}
  </div>
</details>
```

The mobile menu uses native HTML `<details>`/`<summary>` for Services and Industries expansion. This is a meaningful architectural choice — it means expansion state isn't React-controlled, it's browser-native. The `closeMobileMenu` function manually cleans up by removing `open` attributes:

```tsx
document.querySelectorAll("#mobile-nav-panel details[open]")
  .forEach((el) => el.removeAttribute("open"));
```

This is DOM manipulation outside of React's control. It works, but it's fragile — if the selector changes or new details elements are added, this cleanup might miss them.

**The chevron IS a rotating `›` character — confirmed:**
```tsx
<span aria-hidden="true" className="text-slate-400 transition-transform group-open:rotate-90">›</span>
```
Uses `group-open:rotate-90` — so it DOES rotate from `›` to a downward angle when the details element is open. The code review said "Chevron `›` suggests navigation not expansion" and recommended a rotating chevron. **The rotation IS implemented** via `group-open:rotate-90`. But the base character `›` still reads as "navigate to" rather than "expand." A `▸` or custom SVG chevron would be semantically clearer.

**Backdrop IS implemented — contrary to my earlier observation:**
```tsx
<button
  type="button"
  aria-label="Close mobile navigation"
  className="fixed inset-0 bg-black/55"
  onClick={closeMobileMenu}
/>
```
There's a full-screen fixed button behind the menu panel with `bg-black/55`. This IS the backdrop overlay. It covers the entire viewport, is semi-transparent, and clicking it closes the menu. **The code review finding about "no backdrop" is resolved.** 

But wait — looking at the screenshot again, I could see "© 2026 A&A Cleaning Services." text bleeding through below the menu panel. This might be because:
1. The backdrop `bg-black/55` is 55% opacity — some page content can still show through on light sections
2. The menu panel has a `max-h` constraint: `max-h-[calc(100svh-6rem)]` — so on tall viewports, the panel might not fill the screen, and the backdrop at 55% opacity shows content below it

The backdrop EXISTS but its opacity might need to be darker for sections with light backgrounds. `bg-black/55` → `bg-black/70` would fix the bleed-through issue.

**Mobile menu item hierarchy — analyzing the visual treatment:**

| Item | Treatment | Background |
|---|---|---|
| Call Now | Bordered card, uppercase, 48px min-height | `border-white/25 bg-white/10` |
| Free Quote | Filled card, uppercase, 48px min-height | `bg-white` (solid white) |
| Services | Details/summary, bordered card background | `bg-white/[0.04]` |
| Industries | Details/summary, bordered card background | `bg-white/[0.04]` |
| About | Plain text link, no background | No background |
| Service Area | Plain text link, no background | No background |
| FAQ | Plain text link, no background | No background |
| Careers | Plain text link, no background | No background |

**The visual inconsistency is structural, not accidental.** Action items (Call, Quote) get card treatment. Expandable nav items (Services, Industries) get subtle card backgrounds because they need visual containment for their expanded content. Simple links (About, Service Area, FAQ, Careers) get no card treatment because they're single-tap navigation.

This IS a hierarchy, but it's subtle. The issue from the visual pass was that Services/Industries cards vs. About/Service Area plain links creates an inconsistency within the "Explore" group. Within the same group label, two items have borders and two don't. That's confusing — the user doesn't know why some items look different.

**Desktop dropdown implementation — keyboard/focus handling:**

```tsx
onBlur={(event) => {
  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
    setOpenDesktopMenu((current) => (current === "services" ? null : current));
  }
}}
```

The `onBlur` with `contains(relatedTarget)` check IS implemented — this is the fix the code review recommended for the "desktop dropdown doesn't close on keyboard blur-out" finding. **This is resolved.**

Desktop chevrons use `▼` (down triangle) with rotation:
```tsx
<span className={`text-[9px] text-slate-400 transition-transform ${openDesktopMenu === "services" ? "rotate-180" : ""}`}>▼</span>
```
Desktop gets a rotating `▼`, mobile gets a rotating `›`. Different characters for different platforms. The desktop one is more semantically appropriate (down arrow for dropdown). The mobile one is less clear.

**The `onClickCapture` pattern for QuoteCTA in mobile menu:**
```tsx
<div onClickCapture={closeMobileMenu}>
  <QuoteCTA ctaId="mobile_menu_quote" ...>Free Quote</QuoteCTA>
</div>
```
The comment explains: "QuoteCTA does not expose onClick; capture phase closes menu before panel open handling." This is a workaround for QuoteCTA not accepting an onClick prop. The capture phase ensures the menu closes BEFORE the quote panel opens. This is clever but fragile — if event propagation changes or QuoteCTA adds its own capture handler, the ordering could break. The code review noted this should be documented or fixed with an onClick prop on QuoteCTA.

**`/#careers` link in menu:**
```tsx
{ href: "/#careers", label: "Careers" },
```
When CareersSection is removed from the homepage, this hash anchor will scroll to nothing. Must be updated to `/careers`.

### Pass 2 — Contextual Evaluation

**The mobile menu is doing three jobs:**
1. **Action band** — Call + Quote (top priority, correctly promoted)
2. **Site navigation** — Services, Industries, About, Service Area (main content sections)
3. **Utility links** — FAQ, Careers, email, location

The grouping (Explore / Resources) communicates this hierarchy. The action band's card treatment elevates it above navigation. This is structurally sound.

**But the expanded Services/Industries sub-items have no descriptions on mobile.** Desktop dropdowns show:
```tsx
<p className="text-sm font-semibold text-slate-900">{link.label}</p>
<p className="mt-0.5 text-xs leading-relaxed text-slate-500">{link.desc}</p>
```
Mobile sub-items show only:
```tsx
<a ... className="block rounded-lg px-3 py-2 text-sm text-slate-200 ...">
  {link.label}
</a>
```
No descriptions. This means a mobile user expanding Services sees: "Post-Construction, Final Clean, Commercial, Move-In / Move-Out, Windows & Power Wash" — labels only. The descriptions ("Rough and final cleans for turnovers") that help differentiate services are desktop-only.

For a menu, this is actually fine. Descriptions in a navigation menu add bulk that slows scanning. The labels alone are sufficient for navigation. But if someone is using the menu to understand the difference between "Final Clean" and "Post-Construction Clean," they won't get that context.

**All three industry sub-links go to the same `/#industries` anchor.** A mobile user who expands Industries and taps "General Contractors" scrolls to the same place as tapping "Property Managers." This is misleading — the expanded list suggests three distinct destinations, but they're identical. Either:
1. Don't offer sub-items for Industries (just make it a single link to `/#industries`)
2. Build the industry vertical pages so each link goes to a distinct destination
3. Use hash anchors to individual persona cards (if they have IDs)

Looking at `OfferAndIndustrySection.tsx`, each persona card is an `<article>` but without individual `id` attributes. The section itself has `id="industries"`. To link to individual cards, they'd need IDs like `id="industry-gc"`, `id="industry-pm"`, `id="industry-commercial"`.

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies | Desktop Safety |
|---|---|---|---|
| Increase backdrop opacity (`bg-black/55` → `bg-black/70`) | **Low** — CSS only | None | Mobile only (menu is `md:hidden`) |
| Change mobile chevron `›` to `▸` or SVG | **Low** — replace character | None | Mobile only |
| Normalize Explore group item treatment (add subtle bg to About/Service Area, OR remove bg from Services/Industries non-expanded state) | **Low** — CSS adjustment | None | Mobile only |
| Update `/#careers` to `/careers` | **Low** — one href change in `primaryLinks` array | Must happen when CareersSection removed from homepage | Affects desktop nav too (same data source) |
| Add descriptions to mobile service sub-items | **Low-Medium** — add `<p>` elements inside expanded details | Increases menu height when expanded | Mobile only |
| Fix industry sub-links (either remove sub-items or add unique anchors) | **Low-Medium** — either simplify Industries to single link, or add IDs to OfferAndIndustrySection cards | If adding IDs: small change to OfferAndIndustrySection. If removing sub-items: changes mobile menu structure | Desktop dropdown also has this issue — industry links all go to `/#industries` |
| Replace `onClickCapture` pattern with proper onClick on QuoteCTA | **Medium** — requires modifying QuoteCTA component to accept onClick prop | QuoteCTA is used across entire site — need to verify no regressions | All-viewport |

---

## File 14: `AuthorityBar.tsx`

### Pass 1 — Structural Read

**Data model — 3 animated stats + 1 static stat:**

Animated: `{ target: 15, suffix: "+", label: "Years", detail: "field experience" }`, `{ target: 500, suffix: "+", label: "Projects", detail: "spaces delivered" }`, `{ target: 100, suffix: "%", label: "On-Time", detail: "handoff focus" }`

Static: `{ title: "Licensed", subtitle: "& Insured", detail: "ready for commercial and site work" }`

**Counter animation — `useCountUp` hook:**
- Cubic ease-out over 1200ms
- Respects `prefers-reduced-motion` (jumps straight to target)
- Only starts when section enters viewport (`useInViewOnce` at 0.35 threshold)

This is well-built. The reduced-motion check is important for accessibility compliance.

**Mobile vs. Desktop rendering — single component, responsive grid:**

```tsx
<div className="grid grid-cols-2 gap-x-2 gap-y-2 text-center md:grid-cols-4 md:gap-y-0">
```

2-column on mobile, 4-column on desktop. All four stat cells render on both viewports.

**Mobile-hidden elements per stat cell:**

| Element | Mobile | Desktop |
|---|---|---|
| MetricIcon (SVG) | Hidden (`hidden md:flex`) | Visible |
| "Key credential" badge on Licensed & Insured | Hidden (`hidden md:inline-flex`) | Visible |
| Full-size typography | 2xl | 6xl / 5.25rem |

**The Licensed & Insured cell — complex responsive layout:**
```tsx
<div className="mb-1 font-serif text-xl leading-[1.04] tracking-tight text-[#0A1628] md:mb-3 md:text-[3.2rem]">
  {staticStat.title}
  <span className="md:hidden"> {staticStat.subtitle}</span>
  <br className="hidden md:block" />
  <span className="hidden md:inline-block pt-1">{staticStat.subtitle}</span>
</div>
```
On mobile: "Licensed & Insured" on one line (inline span).
On desktop: "Licensed" / "& Insured" on two lines (br + block span).

Below this:
```tsx
<div className="text-[9px] font-medium uppercase tracking-[0.22em] text-slate-600 md:text-[10px]">Austin Standards</div>
<div className="mt-1 max-w-[14rem] text-[10px] uppercase tracking-[0.16em] text-slate-500 md:mt-3 md:text-xs">{staticStat.detail}</div>
```

"Austin Standards" + "ready for commercial and site work" — this is the text overflow the visual pass identified. The `detail` field says "ready for commercial and site work" and is displayed as uppercase tiny text. On mobile at 2-column width, each cell is roughly 160-175px wide. "READY FOR COMMERCIAL AND SITE WORK" in 10px uppercase tracking text is going to wrap across 3-4 lines within that cell width.

**The star rating capsule at bottom:**
```tsx
<div className="surface-panel-soft inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 ...">
  <span className="text-sm tracking-[0.22em] text-[#C9A94E]">★★★★★</span>
  <span className="font-light">Trusted across Austin-area job sites, office spaces, and turnovers.</span>
</div>
```

This is rendered as a centered pill below the stat grid, separated by a border-top. It's structurally a child of the AuthorityBar section but visually feels disconnected — the border-top creates a visual break, and the capsule floats in space between AuthorityBar and What's Included.

**Divider cells on desktop:**
```tsx
const dividerCellClass = "relative lg:px-6 lg:after:absolute lg:after:right-0 lg:after:top-1/2 lg:after:h-24 lg:after:w-px lg:after:-translate-y-1/2 lg:after:bg-slate-200";
```
Vertical divider lines between cells on `lg+` only. Not visible on mobile or `md`. This is pure desktop polish.

### Pass 2 — Contextual Evaluation

**The section answers "Why should I trust this company?" with numbers.** 15+ years, 500+ projects, Licensed & Insured, 100% on-time. These are the right credibility signals for the target audience.

**But the hierarchy is flat.** All four stats have equal visual weight. The animated counter treatment makes 15+, 500+, and 100% feel equivalent. But they're not — 500+ completed projects is significantly more persuasive than 15+ years (years is table stakes for any established business). And "Licensed & Insured" is a binary credential, not a metric — it's qualitatively different from the counted stats.

**The "100% On-Time Handoff Focus" problem is confirmed in the data:**
```tsx
{ target: 100, suffix: "%", label: "On-Time", detail: "handoff focus" }
```
"Focus" is literally in the data. The counter animates to "100%" and beneath it says "ON-TIME" and then "HANDOFF FOCUS." This reads as a 100% on-time rate claim, but "focus" hedges it into a vague intention statement. If the on-time rate is real, say "100% On-Time Handoff Rate." If it's aspirational, don't use 100%.

**"Our Numbers Speak" as headline:**
```tsx
<h2 id="authority-heading" className="mt-2 font-serif text-2xl tracking-tight text-[#0A1628] md:mt-3 md:text-5xl">Our Numbers Speak</h2>
```
Generic. Confirmed at code level. The section kicker is "Track Record" — also generic but slightly better. Neither is doing brand work.

**The star rating capsule has no count.** "★★★★★ Trusted across Austin-area job sites..." — but how many reviews? 5 reviews or 500 reviews? The volume matters enormously for credibility. A GC seeing "★★★★★ from 200+ project reviews" is significantly more persuaded than just stars with no count.

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies | Desktop Safety |
|---|---|---|---|
| Change headline from "Our Numbers Speak" | **Low** — text change | None | All-viewport |
| Trim Licensed & Insured detail text | **Low** — change `detail` string in `staticStat` | None | All-viewport — desktop has more room but shorter text is still better |
| Fix "100% On-Time Handoff Focus" to "Rate" or change stat | **Low** — change `detail` string | Business decision: is this claim defensible? | All-viewport |
| Add review count to star rating capsule | **Low** — add text to the capsule element | Need actual review count (or reasonable approximation) | All-viewport |
| Absorb star rating into hero or into first stat cell | **Medium** — restructure star rating out of AuthorityBar | Changes section boundary and analytics section_view | Desktop layout affected |
| Promote 500+ as featured stat (larger/more prominent) | **Medium** — differentiate one cell from others in grid layout | Would break uniform grid on desktop | Need to verify desktop stakeholders approve differentiated grid |

---

## File 15: `TestimonialSection.tsx`

### Pass 1 — Structural Read

**Data model — 4 testimonials, hardcoded:**

Each has: `quote`, `name`, `role`, `initials`, `tag`, `city`, `timeframe`. The `timeframe` field ("Multi-year Partner", "Repeat Work", "Walkthrough Ready", "Tight Timeline") is in the data but **never rendered anywhere.** It's unused data. This is either planned for a future feature or orphaned.

**Carousel behavior — comprehensive:**

Auto-advance: 7-second interval, pauses on hover/focus, pauses on mobile (`isCompactViewport`), respects reduced-motion. The auto-advance only runs when: started AND not paused AND not reduced-motion AND not mobile.

**Auto-advance stops on mobile.** This is intentional:
```tsx
if (!hasStarted || paused || isReducedMotion || isCompactViewport) return;
```
On mobile (`max-width: 767px`), the carousel is manually navigated only. This is correct — auto-advancing carousels on mobile create accidental interactions and frustration.

**Swipe gesture support:**
```tsx
onTouchStart={(e) => {
  if (e.touches[0]) touchStartX.current = e.touches[0].clientX;
}}
onTouchEnd={(e) => {
  if (e.changedTouches[0]) {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      delta > 0 ? goToTestimonial(prev) : goToTestimonial(next);
    }
  }
}}
```
50px threshold for swipe detection. Supports both left and right swipe. This is the expected mobile carousel interaction.

**Transition mechanism:**
```tsx
const goToTestimonial = useCallback((nextIndex: number) => {
  setIsTransitionVisible(false);
  transitionTimerRef.current = window.setTimeout(() => {
    setActive(nextIndex);
    setIsTransitionVisible(true);
  }, 180);
}, [active, isReducedMotion]);
```
Fades out (180ms) → swaps content → fades in. Simple and effective. For reduced motion: instant swap, no transition.

**Navigation controls:**
- Previous/next arrow buttons: `h-11 w-11` (44px touch targets) ✅
- Dot indicators: wrapped in `h-11` container with `px-1` padding for touch target ✅
- Active dot: `w-12 bg-[#C9A94E]` (gold, elongated pill)
- Inactive dots: `w-2 bg-slate-600` (small circles)
- The elongated active dot is a nice progress indicator — it shows which testimonial is current without a "1 of 4" text

**No count indicator.** The dots themselves serve as a count (4 dots = 4 testimonials), but the document recommended explicit "1 of 4" text for volume credibility. The dots work for navigation but don't communicate "we have many satisfied clients" — they communicate "there are exactly 4 reviews."

**The `timeframe` field is orphaned.** Never referenced in the rendering. Values: "Multi-year Partner", "Repeat Work", "Walkthrough Ready", "Tight Timeline". These could add credibility context — "Multi-year Partner" is a stronger signal than just a one-off review. Worth surfacing.

**Section heading:**
```tsx
<p className="section-kicker !text-slate-300">Client Feedback</p>
<h2 className="mt-3 font-serif text-2xl tracking-tight text-white md:text-5xl">What Clients Say</h2>
```
"Client Feedback" kicker + "What Clients Say" heading. Both are generic. The `!text-slate-300` is an important-override on the kicker (the section-kicker utility class likely sets a different color) — this works but is a specificity hack.

### Pass 2 — Contextual Evaluation

**The testimonials themselves are strong.** Four quotes from named individuals with specific titles and companies. The content is credible: "zero punch list items," "three years," "unmatched attention to detail." These are the kinds of quotes that resonate with the target audience.

**But the section is underperforming its content.** The strongest social proof on the page is presented as: generic headline → single quote card → dots. A user scanning quickly sees "What Clients Say" (which they skip because every site has this) and then one testimonial. They don't know there are four. They don't know these are from named professionals at real companies.

**The relationship between Testimonials and Before/After is interesting.** Before/After provides visual proof (what the work looks like). Testimonials provide social proof (what clients say about the work). These are complementary proof types. Currently they're separated by zero sections (Before/After → Testimonials → How It Works). This adjacency is good — it creates a "proof block" in the scroll. But neither section cross-references the other.

**The `timeframe` data could differentiate testimonials.** "Multi-year Partner" next to Marcus Torres's quote would immediately signal that this isn't a cherry-picked one-time review — it's from a long-term client. This is significantly more persuasive than showing only the quote, name, and title.

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies | Desktop Safety |
|---|---|---|---|
| Change headline from "What Clients Say" | **Low** — text change | None | All-viewport |
| Add "1 of 4" count text | **Low** — add text element near dots | None | All-viewport |
| Surface `timeframe` field | **Low** — add rendering for `testimonial.timeframe` | None — data already exists | All-viewport |
| Add total review count to heading area | **Low** — static text addition | Need count number (real or approximated) | All-viewport |
| Merge with Before/After into unified proof section | **High** — restructure two sections, new component architecture | Both sections have distinct interaction patterns (slider vs carousel). Would need careful UX design | Desktop currently shows them as separate sections — merging changes desktop layout significantly |
| More compact mobile card (pull-quote + expand) | **Medium** — new mobile rendering path | Would need separate mobile/desktop components (same pattern as ServiceSpreadSection) | Desktop unchanged if mobile-only |

---

# Comprehensive Cross-Cutting Analysis — All 15 Files

Now that I have every component, here's the full-system analysis.

---

## I. The Conversion Funnel — End-to-End Audit

**Every conversion path on mobile:**

| Entry Point | Component | What Happens | Context Passed |
|---|---|---|---|
| Hero "Get a Free Quote" | `HeroSection` → `QuoteCTA` | Opens FloatingQuotePanel | ❌ None |
| Hero "Call Now" | `HeroSection` → `CTAButton` | Direct tel: link | N/A |
| Sticky bar "Free Quote" | `PublicChrome` → `CTAButton` | Opens FloatingQuotePanel | ❌ None |
| Sticky bar "Call" | `PublicChrome` → `CTAButton` | Direct tel: link | N/A |
| Service accordion "Quote This Service" | `ServiceSpreadSection` → `QuoteCTA` | Opens FloatingQuotePanel | ❌ None (service anchor is in ctaId but not passed to form) |
| Who We Serve "Discuss Your Project" | `OfferAndIndustrySection` → `QuoteCTA` | Opens FloatingQuotePanel | ❌ None |
| Who We Serve "Talk Through Your Scope" | `OfferAndIndustrySection` → `QuoteCTA` | Opens FloatingQuotePanel | ❌ None |
| Service Area "Check Availability" | `ServiceAreaSection` → `QuoteCTA` | Opens FloatingQuotePanel | ❌ None |
| Let's Talk "Get Your Free Quote" | `MobileQuoteCloser` → `QuoteCTA` | Opens FloatingQuotePanel | ❌ None |
| Let's Talk "Or call directly" | `MobileQuoteCloser` → `CTAButton` | Direct tel: link | N/A |
| Footer "Get Your Free Quote" | `FooterSection` → `QuoteCTA` | Opens FloatingQuotePanel | ❌ None |
| Footer "Or call" | `FooterSection` → `CTAButton` | Direct tel: link | N/A |
| Header "Free Quote" (mobile) | `PublicHeader` → `QuoteCTA` | Opens FloatingQuotePanel | ❌ None |
| Menu "Free Quote" | `PublicHeader` → `QuoteCTA` | Opens FloatingQuotePanel | ❌ None |

**12 quote CTAs. Zero context threading. Every single one opens an identical blank form.**

A user who taps "Quote This Service →" on Post-Construction Clean after reading about rough/final cleans, seeing the response commitment, and scanning the bullet points — that user opens a form titled "Detailed Scope Request" with an empty "Service Type" dropdown. They have to re-declare their interest. This is friction at the moment of highest intent.

The `ctaId` prop is tracked analytically (`service_service-post-construction_quote_mobile`, `mobile_menu_quote`, etc.). The analytics KNOW where the user came from. The form doesn't.

**Threading priority:**
1. Service accordion CTAs → pre-select service type (5 entry points, highest intent)
2. Who We Serve CTAs → pre-select service type based on persona's primary service match (2 entry points, high qualification)
3. Everything else → generic form (acceptable, these are general CTAs)

---

## II. The Redundancy Map — Content Overlap Confirmed

**Process/Value Redundancy:**

| Content | IncludedSummary | Timeline | FooterSection |
|---|---|---|---|
| "Planning" concept | "Scope-Driven Planning" | Step 02 "We Assess" | — |
| "Execution" concept | "Detail-Level Delivery" | Step 03 "We Clean" | "Construction-ready cleaning support" |
| "Communication" concept | "Fast Communication" | Step 01 "Request a Quote" (implicit) | — |
| "Closeout" concept | — | Step 04 "You Walk Through" | "Project Closeout Ready" |

IncludedSummary and Timeline are 80% redundant. FooterSection's CTA module adds a third touch of the same messaging.

**CTA/Conversion Redundancy:**

| CTA Intent | Components Rendering It | Mobile Visible? |
|---|---|---|
| "Get a quote" | Hero, Sticky bar, Header, Menu, Services (×5), Who We Serve (×2), Service Area, MobileQuoteCloser, Footer | Yes — 13+ instances |
| "Call us" | Hero, Sticky bar, Menu, MobileQuoteCloser, Footer | Yes — 5 instances |

13 quote CTAs on a single page. Some are contextually appropriate (hero, services). Some are redundant (Footer CTA when MobileQuoteCloser exists 600px above). The quantity isn't the problem — it's that the **last three** (MobileQuoteCloser → Careers → Footer CTA) are stacked with only non-conversion content between them.

**Navigation Redundancy in Service Area:**

```
ServiceAreaSection:
  ├── 10 city info cards (non-interactive divs)
  ├── 6 city pill Links (to /service-area/[slug])
  ├── 3 region legend dots (decorative)
  └── 1 CTA button (opens quote panel)

FooterSection:
  └── Service Area link (to /#service-area)

PublicHeader:
  └── Service Area link (to /#service-area)
```

The city data appears in `areas` array (10 items) and separately in the pills array (6 hardcoded items). 4 cities in the grid have no corresponding pill (The Domain, Austin, Oak Hill, Pflugerville is in both). This inconsistency is visible to users and implies some cities are more important than others without any clear logic.

---

## III. Mobile Content Budget — Section-by-Section Value Density

For each section, I'm calculating the ratio of unique conversion-relevant content to scroll pixels consumed:

| Section | Mobile Height (est.) | Unique Content Value | Value Density | Verdict |
|---|---|---|---|---|
| Hero | ~850px (100svh) / ~640px (75svh) | Headline + subtitle + 2 CTAs + trust chips = 5 pieces | **Low** (100svh) / **Medium** (75svh) | Shrink to 75svh |
| Authority Bar | ~350px | 4 stats + star rating = 5 pieces | **High** | Keep, tighten copy |
| What's Included | ~400px | 3 value propositions (redundant with Timeline) | **Very Low** | Merge or remove |
| Services Accordion | ~400px collapsed | 5 services × (title + response commitment) = 10 pieces | **Very High** | Keep — best ROI section |
| Who We Serve | ~1,200px | 3 personas × (pain + stat + fit list + CTA) = 12 pieces | **Medium** | Keep, improve CTA treatment |
| Before/After | ~550px | 3 proof examples × (slider + metadata) = interactive proof | **High** | Keep, add micro-CTA |
| Testimonials | ~400px | 4 quotes (1 visible at a time) = social proof | **Medium-High** | Keep, reframe headline |
| How It Works | ~850px | 4 steps × (title + body) = 8 pieces | **Low** (too much scroll for text-only content) | Stepper treatment or merge |
| About | ~500px | Brand story + 3 stats + pull quote = 5 pieces | **Medium-High** | Keep, minor tightening |
| Where We Work | ~600px | 10 cities + 1 CTA = coverage proof | **Low** (redundant affordances inflate height) | Consolidate heavily |
| MobileQuoteCloser | ~350px | Trust bullets + dual CTA = terminal closer | **Very High** | Keep — make truly terminal |
| Careers | ~650px | Employer brand (wrong audience) | **Zero** for customer conversion | Remove from homepage |
| Footer CTA | ~300px | Duplicate of MobileQuoteCloser | **Zero** (redundant) | Remove or minimize |
| Footer (utility) | ~400px | Navigation + contact = utility | **Appropriate** | Keep |

**Current total: ~7,450px** (with accordion already implemented)

**After proposed changes: ~5,100-5,500px** — within the 6,100px architecture target.

---

## IV. The Data Architecture Problem

Looking across all 15 files, content is defined in **8 separate locations** with no shared data layer:

| Data | Location | Items |
|---|---|---|
| Services | `ServiceSpreadSection.tsx` (module-level array) | 5 ServiceItems |
| Service nav links | `PublicHeader.tsx` (module-level array) | 5 serviceLinks |
| Industries | `OfferAndIndustrySection.tsx` (module-level array) | 3 IndustryBlocks |
| Industry nav links | `PublicHeader.tsx` (module-level array) | 3 industryLinks |
| What's Included items | `VariantAPublicPage.tsx` (module-level const) | 3 items |
| Timeline steps | `TimelineSection.tsx` (module-level array) | 4 steps |
| Service areas | `ServiceAreaSection.tsx` (module-level array) | 10 areas |
| City pill links | `ServiceAreaSection.tsx` (inline array) | 6 city links |
| Comparison pairs | `BeforeAfterSlider.tsx` (module-level array) | 3 pairs |
| Testimonials | `TestimonialSection.tsx` (module-level array) | 4 testimonials |
| Authority stats | `AuthorityBar.tsx` (module-level arrays) | 3 animated + 1 static |
| Career perks | `CareersSection.tsx` (module-level array) | 3 perks |
| Primary nav links | `PublicHeader.tsx` (module-level array) | 6 links |
| Footer nav links | `FooterSection.tsx` (inline JSX) | 8 links |

**No two components share a data source.** If a service name changes, it must be updated in at least `ServiceSpreadSection.tsx` AND `PublicHeader.tsx`. If a city is added, it must be updated in the `areas` array AND potentially the pills array AND `service-areas.ts`.

This isn't a blocking issue at current scale, but it's a maintenance risk and it means that any solution involving "pre-select service type from CTA context" needs a shared identifier that both the service data and the form's dropdown options recognize. Right now the service titles in `ServiceSpreadSection` (e.g., "Post- Construction Clean" via `titleLines.join(" ")`) might not match the form's dropdown options exactly.

**I need to see FloatingQuotePanel to confirm the form's service type dropdown options.** If they don't match the service data's title format, context threading will need a mapping layer.

---

## V. Analytics Coverage Gaps — Full Inventory

| What We Can Measure | How |
|---|---|
| Which sections users see | `section_view` events via IntersectionObserver |
| How long they view each section | `time_in_view_ms` on section_view exit |
| How far they scroll | `scroll_depth` milestones (25/50/75/100%) |
| When they start filling out the form | `quote_form_started` (focus event) |
| Which CTA they tapped to open form | `quote_open_clicked` with source |
| Step 1 completion | `quote_step1_completed` |
| Step 2 viewing | `quote_step2_viewed` |
| Step 2 completion | `quote_step2_completed` |
| Final submission | `quote_form_submitted` + `quote_submit_success` (duplicated) |
| Hero variant | `hero_variant_applied` + variant in form metadata |

| What We CANNOT Measure | Gap |
|---|---|
| Which service accordion panel was expanded | No accordion interaction tracking |
| Whether a user expanded any accordion panel | No accordion interaction tracking |
| Which persona card a user read/engaged with | No per-card engagement tracking |
| Form abandonment (panel opened but closed without submit) | No `quote_panel_closed` event |
| Step 1 → Step 2 abandonment rate | No event between step1_completed and step2_completed that tracks close |
| Which specific CTA led to a conversion (not just panel open) | `ctaId` is tracked on CTA tap but not linked to form submission |
| Before/After slider engagement (did they drag?) | No slider interaction tracking |
| Testimonial carousel engagement (which quote seen, swipes) | No carousel interaction tracking |
| Service Area section engagement (which city tapped/hovered) | No city interaction tracking |
| Time-to-first-CTA-tap (how long before user takes first action) | No first-action timestamp |

**The §15.6 quantified acceptance targets require:**
1. "Form conversion rate improves by 15%" — measurable with current events
2. "Service interaction: accordion expand at 35% of viewers" — **NOT measurable** (no accordion tracking)
3. "Persona routing CTR improves by 20%" — **NOT measurable** (no per-CTA conversion linking)
4. "No regression in LCP/CLS" — measurable via Sentry/Web Vitals but not in custom analytics

The two unmeasurable targets are both high-priority acceptance criteria. Accordion tracking is the most critical gap — it's the primary new mobile interaction pattern and there's no way to evaluate whether it's working.

---

## VI. Accessibility Gaps — Full Inventory

| Component | Issue | Severity |
|---|---|---|
| `ServiceSpreadSection` (accordion) | Collapsed panels use `aria-hidden` but no `inert` — keyboard tab can reach hidden content | Medium |
| `PublicHeader` (mobile menu) | `<details>` expansion state cleaned up via direct DOM manipulation (`removeAttribute`) — fragile | Low |
| `PublicHeader` (mobile menu) | Backdrop is a `<button>` with no visible label — accessible via `aria-label` but screen reader might not convey its purpose as "close menu" clearly since it's a large invisible button | Low |
| `OfferAndIndustrySection` | Hover interactions (`onMouseEnter`/`onMouseLeave`) have no keyboard equivalent — cards can't be "focused" for the elevation/dimming effect | Low (decorative effect only) |
| `ServiceAreaSection` | City cards have hover interactions but aren't focusable (they're `<div>` elements) — no keyboard access to hover state | Low (decorative on mobile, functional on desktop with map) |
| `ServiceAreaSection` | SVG map markers aren't focusable — keyboard users can't navigate the map | Medium (desktop only) |
| `BeforeAfterSlider` | Slider has full keyboard support ✅ | N/A |
| `TestimonialSection` | Carousel has arrow buttons + dot buttons, all with aria-labels ✅ | N/A |
| `TimelineSection` | No interactive elements to assess | N/A |
| `AuthorityBar` | Animated counters use `aria-label` on the container ✅ | N/A |

---

## VII. Performance Concerns — Full Inventory

| Component | Concern | Severity |
|---|---|---|
| `VariantAPublicPage` | First 5 sections statically imported (HeroSection, AuthorityBar, IncludedSummarySection, ServiceSpreadSection, OfferAndIndustrySection) — all in initial JS bundle | Medium — large initial bundle for mobile |
| `HeroSection` | 15-second Ken Burns animation on hero image — GPU cost on lower-end mobile | Low |
| `HeroSection` | Animation reveal sequence takes 1.76 seconds to fully show all content — trust pills delayed | Medium — user may scroll before trust pills appear |
| `ServiceSpreadSection` | Image lazy loading implemented ✅ — only active accordion panel's image loads | Resolved |
| `ServiceAreaSection` | SVG map with 10 marker dots + connection lines + animations — hidden on mobile (`hidden md:block`) so no mobile perf impact | N/A for mobile |
| `BeforeAfterSlider` | Two full images per active pair (before + after) — no preloading of inactive pairs | Low — only 3 pairs, loading on tab switch is brief |
| `TestimonialSection` | No images — text + SVG only. Minimal performance cost | N/A |
| `PublicChrome` | IntersectionObserver watching all sections + scroll listener for depth — both passive/lightweight | N/A |
| `AuthorityBar` | Counter animation uses requestAnimationFrame — well-optimized with cleanup | N/A |
| All animated sections | `useInViewOnce` observers × 6+ sections — each creates its own IntersectionObserver | Low — could be consolidated into a single observer but not a real problem |

---

## VIII. Desktop Safety Contract Compliance — Full Audit

| Component | Mobile/Desktop Architecture | Desktop Risk From Changes |
|---|---|---|
| `ServiceSpreadSection` | **Fully separated** — `MobileServiceAccordion` + `ServiceSpreadItem` are independent components | **Zero risk** — changes to mobile accordion cannot affect desktop |
| `HeroSection` | **Responsive with variant** — same component, `md:` classes differentiate | **Low risk** — 75svh uses `md:min-h-[100svh]` to preserve desktop height |
| `OfferAndIndustrySection` | **Single component, responsive classes** | **Medium risk** — changes like CTA button treatment or card restructuring affect both viewports unless gated |
| `TimelineSection` | **Single component, responsive classes** | **Medium risk** — showing icons on mobile (`hidden` removal) is safe, but merging with IncludedSummary affects desktop too |
| `ServiceAreaSection` | **Single component, map hidden on mobile** | **Medium risk** — removing city pills affects both viewports. Consolidation must preserve desktop map experience |
| `BeforeAfterSlider` | **Single component, responsive classes** | **Low risk** — most changes (headline, metadata) are all-viewport and don't break desktop layout |
| `TestimonialSection` | **Single component, mobile-specific behavior** (auto-advance off, swipe on) | **Low risk** — headline/count changes are all-viewport text |
| `AuthorityBar` | **Single component, responsive grid** | **Low risk** — copy changes are all-viewport |
| `PublicHeader` | **Fully separated** — desktop nav + mobile menu are independent render paths | **Zero risk** for mobile menu changes |
| `FooterSection` | **Single component** | **Medium risk** — Footer CTA removal affects both viewports. Desktop needs the CTA if MobileQuoteCloser stays `md:hidden` |
| `CareersSection` | **Single component** | **N/A** — removal from homepage is all-viewport, but component preserved for /careers route |

**Components needing the ServiceSpreadSection pattern (fully separated mobile/desktop):**
- `TimelineSection` — if stepper accordion is implemented for mobile while preserving desktop alternating layout
- `OfferAndIndustrySection` — if horizontal carousel is implemented for mobile while preserving desktop 3-column grid

---

## IX. The 12 Specific Things I'd Want Verified Before Writing the Master Implementation Document

1. **FloatingQuotePanel code** — I haven't seen this file. I need to know: how does it consume `useQuoteForm`? What are the service type dropdown options? How is the panel sized (the white space issue)? Can it accept initial values?

2. **QuoteCTA component code** — I need to see how it wraps `useQuoteAction`. Does it accept additional props? Can it be extended to pass context? The `onClickCapture` workaround in the menu suggests it doesn't accept `onClick`.

3. **The `/quote/success` page** — F-17 is flagged as "implemented but wrong." I need to see what's there to understand the confirmation page fix scope.

4. **`service-areas.ts`** — the data source for slug pages. Need to understand what the city pages contain for the decommission plan.

5. **The `section-kicker` and `cta-primary` / `cta-outline-dark` CSS classes** — these are used everywhere but defined in Tailwind config or a global CSS file. Need to see the design token definitions.

6. **`ScrollReveal` component** — used in CareersSection and possibly elsewhere. Need to know if it's a simple IntersectionObserver wrapper or has additional behavior.

7. **The form's service type dropdown options** — critical for context threading. Need to match these against service data in `ServiceSpreadSection`.

8. **Whether the `/careers` page imports `CareersSection` directly** — determines if removing from homepage composition has any side effects.

9. **The `AboutSection` component** — I never received this file. The visual pass gave it a B+ grade. Need to see if there's anything structurally worth noting.

10. **The AI assistant trigger positioning and z-index** — it overlaps the Service Area CTA in screenshots. Need to see `AIQuoteAssistant` component or at least its positioning CSS.

11. **Whether there's a `tailwind.config.ts`** with custom breakpoints — I'm assuming `md` = 768px and `lg` = 1024px, but need confirmation.

12. **The quote-request API route** — need to verify that formatted phone numbers are stripped server-side, and understand what `flowStep: "step1"` vs `"step2"` does differently.

---

## X. Pre-Master-Document Decision Points That Need Your Input

Before I can write the master implementation document with valid, non-speculative solutions, I need decisions on these:

**Decision 1: IncludedSummary ↔ Timeline Merge Strategy**

| Option | Pros | Cons |
|---|---|---|
| A: Merge into Timeline, remove IncludedSummary entirely | Cleanest. Eliminates redundancy. Saves ~400px | Desktop loses 3-column card section. Timeline becomes the sole process section |
| B: Keep IncludedSummary on desktop only, merge mobile content into Timeline | Desktop preserved exactly. Mobile gets merged section | Two code paths to maintain. IncludedSummary data still exists separately |
| C: Differentiate sharply — make IncludedSummary about outcomes/deliverables, make Timeline about process | Both sections earn their place. No merge needed | Requires rewriting IncludedSummary content, which is currently process-oriented |

**Decision 2: Footer CTA Module Resolution**

| Option | Pros | Cons |
|---|---|---|
| A: Remove entirely, make MobileQuoteCloser all-viewport | Single conversion closer. Clean | Requires verifying MobileQuoteCloser works at desktop widths. FooterSection on sub-pages (/faq, /privacy) loses CTA |
| B: Reduce to compact one-liner (all viewports) | Maintains conversion path on all pages. Low visual weight | Still technically redundant with MobileQuoteCloser on homepage |
| C: Keep on desktop, hide on mobile | Desktop retains its closer. Mobile gets clean terminal (MobileQuoteCloser) | Two different mobile/desktop experiences for the same page zone |

**Decision 3: Who We Serve Mobile Treatment**

| Option | Pros | Cons |
|---|---|---|
| A: Horizontal swipe carousel | Saves ~600px. Natural mobile pattern for 3 equal cards | Requires new component. Can't expand cards for detail in carousel |
| B: Keep vertical stack, add button treatment to CTAs + show outcome text | Lower effort. Fixes the two main issues (CTA weakness + missing outcomes) | Still ~1,200px of scroll |
| C: Collapsed cards with expand (accordion pattern) | Saves ~600px. Consistent with Services accordion UX | Forces user to tap to see persona details — may reduce self-identification |

**Decision 4: Where We Work Scope**

| Option | Pros | Cons |
|---|---|---|
| A: Mini map + pills only (remove info cards, region legend) | ~300px savings. One navigation pattern instead of three | Loses distance information per city |
| B: Keep info cards, remove pills and legend | Cards provide more info (name + distance). One pattern | Cards are non-interactive on mobile (divs, not links) — info-only |
| C: Convert info cards to interactive buttons that open quote with area context | Makes cards useful on mobile | Requires context threading in quote funnel |

---

These decisions gate the master implementation document. Some I can make recommendations on (and I have strong opinions on all of them). But they're product decisions that affect the desktop experience, the conversion funnel architecture, and the page information hierarchy.

**What I recommend for the third pass:** Send me the remaining files I listed (especially FloatingQuotePanel and QuoteCTA), give me your leaning on the four decisions above, and I'll write the final master implementation document with exact file/line-level changes, dependency ordering, and estimated effort.

Good — these fill critical gaps. Let me do the full analysis on these six files, then give you the updated cross-cutting findings. Send the remaining items whenever you're ready.

---

# Round 4 — Final File Analysis

## File 16: `QuoteCTA.tsx`

### Pass 1 — Structural Read

```tsx
export function QuoteCTA({ ctaId = "unidentified_quote_trigger", children, className, style }: QuoteCTAProps) {
  return (
    <CTAButton ctaId={ctaId} actionType="quote" className={className} style={style}>
      {children}
    </CTAButton>
  );
}
```

**QuoteCTA is a thin wrapper around CTAButton.** It adds nothing except defaulting `actionType="quote"` and providing a default `ctaId`. This means the real behavior lives in `CTAButton`.

**The props interface is limited:**
```tsx
type QuoteCTAProps = {
  ctaId?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};
```

**No `onClick` prop. No `serviceType` prop. No context prop of any kind.** This confirms why the menu uses `onClickCapture` as a workaround — QuoteCTA literally cannot accept an onClick handler. And it confirms why no service context is threaded — there's no prop for it.

**The context threading fix must happen here AND in CTAButton.** QuoteCTA needs:
1. An optional `onClick` prop (or the ability to pass it through to CTAButton)
2. An optional `serviceType` or `context` prop that gets passed to `openQuote()`

I need to see `CTAButton` to understand how `actionType="quote"` translates to opening the panel. CTAButton presumably calls `useQuoteAction()` internally when `actionType="quote"`. The extension point is there — CTAButton needs to accept context and pass it through.

### Pass 2 — Contextual Evaluation

This component is a legacy abstraction that's now blocking the most impactful conversion improvement (context threading). It was created during the F-25 CTA Taxonomy work to standardize quote triggers. But by not accepting onClick or context props, it created a constraint that prevents every quote CTA on the site from carrying user intent.

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies |
|---|---|---|
| Add `onClick` prop to QuoteCTAProps, pass to CTAButton | **Low** — but requires CTAButton to also accept onClick | Every QuoteCTA call site benefits. Menu `onClickCapture` hack can be removed |
| Add `serviceType` prop, thread to CTAButton → openQuote | **Medium** — requires extending QuoteContext, CTAButton, PublicChrome | This is the systemic context threading change |
| Add `href` prop for cases where QuoteCTA should link instead of open panel | **Low** — pass through to CTAButton | Enables future "Discuss Your Project → /industries/gc" routing |

---

## File 17: `/quote/success/page.tsx` (Confirmation Page — F-17)

### Pass 1 — Structural Read

**Current implementation has the step process, NOT the referral ask.** The current state summary says "F-17: Implemented but wrong (referral ask instead of step process)." But the code shows:

```tsx
{[
  { icon: "📞", step: "Step 1", text: "We'll call you within 1 hour" },
  { icon: "📋", step: "Step 2", text: "We'll send a detailed quote" },
  { icon: "✅", step: "Step 3", text: "Accept

  # Round 4 — Complete File Analysis

---

## File 16 (continued): `FloatingQuotePanel.tsx` — The Critical Missing Piece

### Pass 1 — Structural Read

**Panel sizing — the white space problem confirmed:**

```tsx
className={`absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white ...`}
```

`h-full` — the panel takes the entire viewport height. On mobile (`w-full`), it's a full-screen takeover. On wider screens (`max-w-md` = 448px), it's a side drawer. **The white space I saw in the screenshot is because the form content (3 fields + 1 button + trust line) occupies roughly 450px of a ~850px viewport.** The remaining ~400px is empty white panel.

This is a deliberate full-height side-drawer pattern — it's not a bug, it's an architectural choice. But on mobile where `w-full` makes it fill the entire screen, the empty space below the form content feels like a broken page rather than a deliberate design. Desktop side-drawers have the main page visible alongside, so empty space reads as "clean panel." Mobile full-screen takeovers need to feel content-complete.

**Title — confirmed "Detailed Scope Request" for both steps:**

```tsx
<h3 id={`${fieldPrefix}-title`} className="font-serif text-2xl text-[#0A1628] md:text-3xl">
  Detailed Scope Request
</h3>
```

Static title. Doesn't change between Step 1 and Step 2. This is the mismatch I identified — Step 1 asks for "quick contact details" but the panel title says "Detailed Scope Request."

**Service type dropdown options — CRITICAL for context threading:**

```tsx
<option value="">Service Type</option>
<option value="post_construction">Post-Construction</option>
<option value="final_clean">Final Clean</option>
<option value="commercial">Commercial</option>
<option value="move_in_out">Move-In / Move-Out</option>
<option value="window">Windows & Power Wash</option>
```

**These are the canonical service type values.** The mapping I need for context threading:

| Accordion Service | `anchor` | Dropdown `value` |
|---|---|---|
| Post-Construction Clean | `service-post-construction` | `post_construction` |
| Final Clean | `service-final-clean` | `final_clean` |
| Commercial Cleaning | `service-commercial` | `commercial` |
| Move-In Move-Out | `service-move` | `move_in_out` |
| Windows & Power Wash | `service-windows` | `window` |

These DON'T match directly. The accordion uses hyphenated anchors (`service-post-construction`), the dropdown uses underscored values (`post_construction`). A mapping layer is needed for context threading.

**Panel accepts NO context props:**

```tsx
type FloatingQuotePanelProps = {
  isOpen: boolean;
  onClose: () => void;
};
```

No `initialServiceType`, no `context`, no `source` beyond what `useQuoteForm` sets internally. **This is the structural constraint that prevents context threading.**

**Abandonment tracking IS implemented:**

```tsx
useEffect(() => {
  const wasOpen = wasOpenRef.current;
  if (wasOpen && !isOpen) {
    const hasAnyInput = fields.name.trim().length > 0 || ...;
    if (hasAnyInput && feedback?.type !== "success") {
      void trackConversionEvent({
        eventName: "quote_form_abandoned",
        source: "floating_quote_panel",
        metadata: { step: currentStep, has_name: ..., has_phone: ..., has_service_type: ... },
      });
    }
  }
  wasOpenRef.current = isOpen;
}, [isOpen, ...]);
```

This resolves the analytics gap I identified earlier — abandonment IS tracked, including which step was abandoned and which fields had data. **However, it only fires when `hasAnyInput` is true AND feedback isn't success.** A user who opens the panel, looks at it, and closes without typing anything gets no abandonment event. This is arguably correct (they didn't engage), but it means we can't measure "opened but bounced immediately."

**Auto-close after Step 2 success:**

```tsx
useEffect(() => {
  if (feedback?.type !== "success" || currentStep !== 2) return;
  const closeTimer = window.setTimeout(() => onClose(), 1800);
  return () => window.clearTimeout(closeTimer);
}, [currentStep, feedback, onClose]);
```

After Step 2 submission succeeds, the panel auto-closes after 1.8 seconds. But then `useQuoteForm` ALSO redirects to `/quote/success`. There's a potential race condition: does the redirect happen before the auto-close, or does the auto-close happen before the redirect? Looking at the flow:

1. Step 2 submit → `submitLead` runs
2. `response.ok` → `setFeedback({ type: "success" })` (implicitly via step2 flow)

Wait — actually, looking more carefully at `useQuoteForm` for the step2 path: after the successful response, it fires analytics events and then calls `router.push()`. The `setFeedback` for step 2 success... actually it's NOT set. In the step2 path, there's no `setFeedback({ type: "success" })`. The flow goes: response.ok → fire events → redirect. The auto-close useEffect in FloatingQuotePanel checks for `feedback?.type === "success" && currentStep === 2` — but feedback is never set to success for step 2.

**This means the auto-close on step 2 never fires.** The redirect happens instead. The auto-close effect is dead code for the step 2 path.

For step 1 → step 2 transition, feedback IS set to success (`"Great. Add optional project details..."`) and currentStep changes to 2. But this is the step 1→2 transition, not the final submission. The auto-close would fire here — closing the panel 1.8 seconds after step 1 completes. **This is a bug.** After step 1, the user should see step 2. But the auto-close fires because `feedback.type === "success" && currentStep === 2`.

Wait, let me re-read:
```tsx
if (feedback?.type !== "success" || currentStep !== 2) return;
```
This means: run the auto-close timer when feedback IS success AND currentStep IS 2.

After step 1 completes:
- `setCurrentStep(2)` ← now 2
- `setFeedback({ message: "Great...", type: "success" })` ← now success

Both conditions are true. The auto-close timer starts. **1.8 seconds after step 1 completion, the panel closes automatically.** The user has 1.8 seconds to start filling in step 2 before the panel disappears.

**This is a significant bug.** The user sees "Great. Add optional project details to speed up your quote." and has less than 2 seconds before the panel closes. If they don't start typing immediately, they lose the form.

The fix: the auto-close should only fire after step 2 submission success, not after step 1→2 transition. The condition needs to distinguish between "step 1 just completed (showing step 2 form)" and "step 2 just completed (final success)."

**Focus management is correct:**
- Close button gets focus on open (`closeButtonRef.current?.focus()`)
- Escape key closes panel
- Tab trap implemented (first/last focusable element wrap)
- Backdrop click closes panel

**Accessibility is well-implemented for the panel shell.** The `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, and escape handling are all correct.

### Pass 2 — Contextual Evaluation

**The floating panel is the mobile conversion engine.** Every quote CTA on mobile leads here. Its UX directly determines mobile conversion rate. The two-step approach is sound — 3 fields to create a callable lead, optional enrichment after. But three issues undermine it:

1. **Title mismatch** — "Detailed Scope Request" for a 3-field quick form
2. **No context** — user who tapped on Post-Construction sees a blank form
3. **Auto-close bug** — panel may close 1.8 seconds after step 1 completion

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies |
|---|---|---|
| Fix title to be step-aware ("Get a Free Quote" step 1, "Add Project Details" step 2) | **Low** — conditional rendering based on `currentStep` | None |
| Accept `initialServiceType` prop, pre-populate form | **Medium** — requires extending props, connecting to QuoteContext, mapping anchor→value | QuoteContext, PublicChrome, QuoteCTA/CTAButton, useQuoteForm |
| Fix auto-close bug (distinguish step1→2 transition from step2 completion) | **Medium** — need new state or different condition. Could use a `step2Submitted` boolean | useQuoteForm needs to signal "step 2 actually submitted" vs "transitioned to step 2" |
| Reduce mobile height to content-fit | **Low-Medium** — change `h-full` to `h-auto max-h-full` on mobile. Need to handle overflow if step 2 is tall | Desktop side-drawer pattern may break if not `h-full` — gate to mobile |
| Add "opened but didn't type" tracking | **Low** — fire event when panel closes with no input and wasOpen | None |

---

## File 17: `QuoteSection.tsx` (Desktop Full Form)

### Pass 1 — Structural Read

**This is the desktop-only form** (hidden on mobile via `<div className="hidden md:block">` wrapper in VariantAPublicPage).

**Uses `useQuoteForm` WITHOUT `enableTwoStep`:**
```tsx
const { fields, setters, isSubmitting, feedback, submitLead, markFormStarted } = useQuoteForm({
  source: "quote_section",
});
```

No `enableTwoStep: true`. Desktop form is single-step with all fields visible at once: Name, Company Name, Phone, Email, Service Type, Timeline, Project Description.

**Service type options MATCH the floating panel exactly:**
```tsx
<option value="post_construction">Post-Construction</option>
<option value="final_clean">Final Clean</option>
<option value="commercial">Commercial</option>
<option value="move_in_out">Move-In / Move-Out</option>
<option value="window">Windows & Power Wash</option>
```

Good — both forms use the same values. This means the context threading mapping only needs one lookup table.

**Desktop form has honeypot field:**
```tsx
<div aria-hidden="true" className="absolute opacity-0 h-0 w-0 overflow-hidden pointer-events-none">
  <input name="website" type="text" tabIndex={-1} autoComplete="off" value={fields.website} onChange={...} />
</div>
```

FloatingQuotePanel also has this. Both forms implement the honeypot consistently.

**Desktop form section has expectation chips and info cards above the form:**
```tsx
const EXPECTATION_ITEMS = [
  { title: "What to expect", body: "Direct scope follow-up" },
  { title: "Best fit", body: "Commercial + turnover work" },
  { title: "Approach", body: "Clear scope before scheduling" },
];
```

These set expectations before the form. The floating panel has NO equivalent — it jumps straight to the step indicator and fields. The mobile experience is more transactional while desktop is more consultative.

### Pass 2 — Contextual Evaluation

The desktop form is comprehensive but not relevant for the mobile UX audit. Key takeaway: the form field names and values are consistent between desktop and mobile. The desktop form's expectation cards are a UX pattern worth considering for the floating panel (a single trust line above step 1 fields).

---

## File 18: `AboutSection.tsx`

### Pass 1 — Structural Read

**Self-contained with local data:**
```tsx
const PROOF_POINTS = [
  { value: "500+", label: "Projects delivered" },
  { value: "6+", label: "Years in Austin" },
  { value: "24hr", label: "Turnaround capability" },
];
```

Wait — **"6+ Years in Austin"** here, but AuthorityBar says **"15+ Years Field Experience."** These are different claims. AuthorityBar's "15+" is about total field experience. About section's "6+" is specifically about Austin presence. This is potentially confusing — a user who saw "15+ Years" scrolls down and sees "6+ Years" and wonders which is real. The distinction (total experience vs. Austin-specific) is valid but not obvious.

**Layout: 52% text / 48% image on desktop, stacked on mobile.** The image (`about-hero.jpg`) renders at `h-56` on mobile (224px). The text content includes: kicker + heading + two paragraphs + 3 proof stats + blockquote + CTA.

**The blockquote is well-branded:**
```tsx
<blockquote className="mt-3 font-serif text-lg italic leading-snug text-[#0A1628] md:text-2xl lg:text-3xl">
  "We don't leave until it's right."
</blockquote>
```

This is the most human, memorable line on the entire page.

**Licensed & Insured badge on the image:** There's a floating badge with "Licensed & Insured / Austin Metro Area" overlaid on the about image. This repeats the Authority Bar's Licensed & Insured claim. It's the third mention of this credential: hero trust pill → Authority Bar stat → About image badge.

### Pass 2 — Contextual Evaluation

This section earns its place. "Built on Standards" is a strong brand statement. The copy is specific. The pull quote is memorable. The proof stats are compact. The only issues are the years discrepancy (15+ vs 6+) and the triple-mention of Licensed & Insured.

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies |
|---|---|---|
| Align years claim between AuthorityBar (15+) and About (6+) | **Business decision** — one or both numbers may need clarification | None technically |
| Remove "ABOUT A&A" kicker | **Low** — delete one element | All-viewport |
| Remove image badge (third Licensed & Insured mention) | **Low** — delete ScrollReveal element from image | All-viewport |

---

## File 19: `service-areas.ts` — Decommission Assessment

### Pass 1 — Structural Read

**7 city pages with substantial content:** Round Rock, Georgetown, Pflugerville, Buda, Kyle, San Marcos, Hutto. Each has:
- `description`: 2-3 sentences of location-specific copy
- `highlights`: 4 bullet points of services + local context
- `localSignals`: 3 bullets of operational details
- `nearbyAreaSlugs`: cross-links to adjacent cities
- `proof`: 4 metrics (annual projects, response window, turnaround, recurring accounts)

**This is NOT thin content.** Each city page has genuine local signals: "Coverage concentrated around I-35, La Frontera" (Round Rock), "Seasonal student-housing cycle support" (San Marcos), "Production-builder turnover specialization" (Hutto). These are specific enough to be valuable for local SEO.

**The `HOMEPAGE_SERVICE_AREA_LINKS` export:**
```tsx
export const HOMEPAGE_SERVICE_AREA_LINKS = SERVICE_AREA_CITIES.slice(0, 6).map((city) => ({
  label: city.name,
  href: `/service-area/${city.slug}`,
}));
```

This is the intended shared data source for homepage city pills. But `ServiceAreaSection.tsx` doesn't import this — it has its own hardcoded array of 6 cities. **The shared data source exists but isn't used.** The inline pills in ServiceAreaSection should be replaced with this export.

### Pass 2 — Contextual Evaluation

**Decommissioning these pages would be an SEO mistake.** The content is substantial, location-specific, and structured with schema-friendly data. Each page has proof metrics and operational specifics that search engines value for local service queries like "post construction cleaning round rock tx."

**§16.4 says "decommission."** But §16.4 was written before seeing the data quality. The recommendation should be: **keep the pages, remove homepage deep-link pills, let organic search drive traffic to them.** The city pages serve an SEO function, not a homepage navigation function.

### Pass 3 — Constraint Map

| Change | Risk Level | Dependencies |
|---|---|---|
| Keep pages, remove pills from ServiceAreaSection | **Low** — delete inline pills array, keep pages intact | Verify no other components link to these pages |
| Replace inline pills with `HOMEPAGE_SERVICE_AREA_LINKS` import | **Low** — if keeping pills, use the shared data source | None |
| Add redirect from removed pills to `/service-area` index | **Low** — `next.config.js` redirect rules | Only if removing pages entirely (not recommended) |

---

## File 20: `globals.css` + `tailwind.config.js` — Design Tokens

### Key Findings

**Custom breakpoints: none.** Default Tailwind breakpoints apply:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

My `md: = 768px` assumption throughout the analysis is confirmed.

**Z-index system (CSS custom properties):**
```css
--z-sticky-bar: 30;
--z-floating-widget: 40;
--z-header: 50;
--z-dialog: 55;
--z-overlay: 60;
```

But looking at actual usage:
- Sticky bar: `z-[30]` (matches `--z-sticky-bar`)
- FloatingQuotePanel: `z-50` (matches... `--z-header`? Should be `--z-dialog: 55`)
- Header: `z-[var(--z-header)]` = 50

**The FloatingQuotePanel at z-50 is the SAME z-index as the header.** This means when the panel is open, the header and the panel compete for the same stacking level. Since the panel renders later in the DOM, it typically wins. But this is fragile. The panel should use `z-[55]` or `z-[var(--z-dialog)]`.

The AI assistant trigger (blue circle overlapping CTAs in screenshots) renders outside the main content at a z-index I can't confirm without seeing its component. But given the z-index scale, it's likely at `z-[40]` (`--z-floating-widget`), which means it correctly sits below the header but above the sticky bar.

**The `cta-primary` class definition confirms the button styling system:**
```css
.cta-primary {
  @apply inline-flex items-center justify-center rounded-md bg-[#0A1628] px-6 py-3 
    text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm 
    transition duration-300 hover:bg-[#162742] hover:-translate-y-0.5 
    active:scale-[0.98] active:shadow-none;
}
```

All CTA classes use `active:scale-[0.98]` for mobile tap feedback. Good.

**The `section-kicker` class:**
```css
.section-kicker {
  @apply text-[10px] font-bold uppercase tracking-[0.24em] text-[#2563EB];
}
```

Royal blue, 10px, uppercase, wide tracking. Used in every section header. This is consistent.

**The mobile menu floating widget suppression:**
```css
body[data-mobile-menu-open="true"] .floating-widget {
  pointer-events: none !important;
  opacity: 0 !important;
}
```

When mobile menu is open, elements with `.floating-widget` class are hidden. The sticky bar has this class. The AI assistant presumably also needs it. This is coordinated through the `document.body.dataset.mobileMenuOpen` set in PublicHeader.

**`prefers-reduced-motion` is comprehensive:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Global reduced-motion override. All animations and transitions are effectively disabled. This works in conjunction with the per-component `motion-reduce:` classes (accordion uses `motion-reduce:transition-none`). The global CSS is the safety net.

---

## File 21: `quote-request/route.ts` — API Endpoint

### Pass 1 — Structural Read

**Phone number handling — formatted value IS received:**
The API receives `phone` as a string. Looking at validation:
```tsx
const phoneDigits = phone.replace(/\D/g, "").slice(0, 10);
if (phoneDigits.length < 10) {
  return NextResponse.json({ error: "Please provide a valid 10-digit phone number." }, { status: 400 });
}
```

It validates by extracting digits. But what gets **stored** is the raw `phone` value:
```tsx
.insert({ ..., phone, ... })
```

**The formatted phone `(512) 555-0199` gets stored directly in the database.** It's not stripped to digits before storage. This means the database has formatted strings. For SMS sending, the `sendSms` function presumably handles formatting, but the stored value is the display format.

This isn't a bug per se, but it means any downstream system (QuickBooks, SMS, admin dashboard) that reads the phone field needs to handle formatting. The admin SMS uses `phone` directly too.

**Step 1 vs Step 2 behavior:**

Step 1:
1. Validates name + phone (required). Service type is NOT validated server-side (only client-side).
2. Inserts lead record with available fields
3. Sends admin SMS alert
4. Sends customer acknowledgment SMS
5. Sends customer acknowledgment email (if email provided)
6. Returns `{ success: true, leadId }`

Step 2:
1. Requires `leadId`
2. Updates existing lead with enrichment fields (companyName, email, timeline, description)
3. Returns `{ success: true, leadId, updated: true }`
4. **No notifications on step 2.** No admin alert, no customer SMS/email.

**The step 2 security note is acknowledged inline:**
```tsx
// TODO(phase2-security): Step 2 currently trusts leadId without session ownership verification.
```

**Honeypot works correctly:**
```tsx
if (body.website) {
  return NextResponse.json({ success: true, leadId: "ok" }, { status: 201 });
}
```

Returns fake success for bot submissions. Smart — bots see success and don't retry.

**Dedup guard is in-memory:** Works per serverless instance. Won't prevent duplicates across different Vercel edge instances, but adequate for double-click prevention on the same request.

**Admin SMS format:**
```
🔔 New lead: {name} from {company} needs {serviceType}. Timeline: {timeline}. Reply CALL to see details.
```

**Customer acknowledgment SMS:**
```
Hi {name}! Thanks for reaching out to A&A Cleaning. We received your request and will call you within 1 hour. If you need us sooner: {COMPANY_PHONE}. — The A&A Team
```

**Customer acknowledgment email (HTML):**
```html
<p>Hi {name},</p>
<p>Thanks for reaching out to A&A Cleaning. We received your request and will call you within 1 hour.</p>
<p><strong>Service requested:</strong> {serviceType}</p>
<p>If you need us sooner: {COMPANY_PHONE}</p>
<p>— The A&A Team</p>
```

The email includes service type. The SMS doesn't. The §14.2 correction notes "email body may not match spec" — I'd need to see the spec to compare, but the email content is reasonable.

### Key Finding for Context Threading

**Service type in step 1 is stored as the dropdown value string:** `post_construction`, `final_clean`, `commercial`, `move_in_out`, `window`. This is what the API receives and stores. If context threading pre-populates the dropdown, the stored value is already correct.

---

# Comprehensive Cross-Cutting Synthesis — All Files Complete

## I. The Auto-Close Bug — Severity: High

```
Step 1 completes → setCurrentStep(2) + setFeedback({ type: "success" })
→ FloatingQuotePanel useEffect detects: feedback.type === "success" && currentStep === 2
→ Auto-close timer starts (1800ms)
→ Panel closes before user can fill step 2
```

This is a live bug affecting every mobile form submission that completes step 1. The user has 1.8 seconds to start interacting with step 2 before the panel disappears. If they're reading the feedback message ("Great. Add optional project details..."), they lose the form.

**Fix:** The auto-close condition needs a `step2Submitted` signal, not just `feedback.type === "success" && currentStep === 2`. Options:
1. Add a `step2Submitted` state to useQuoteForm, set it only after step 2 POST succeeds
2. Change the FloatingQuotePanel condition to check a different feedback message specific to step 2
3. Remove the auto-close entirely (the redirect to `/quote/success` handles the exit)

Option 3 is simplest. The redirect already handles the successful exit. The auto-close is redundant and buggy.

## II. Complete Context Threading Architecture

Now that I've seen all files, here's the exact implementation path:

**Layer 1 — Data mapping:**
```tsx
// New file: src/lib/service-type-map.ts
export const SERVICE_ANCHOR_TO_FORM_VALUE: Record<string, string> = {
  "service-post-construction": "post_construction",
  "service-final-clean": "final_clean",
  "service-commercial": "commercial",
  "service-move": "move_in_out",
  "service-windows": "window",
};
```

**Layer 2 — Context type:**
```tsx
// Extend QuoteContext
type QuoteOpenContext = {
  serviceType?: string;  // form dropdown value
  source?: string;       // where the user came from
};
```

**Layer 3 — Flow through 7 files:**
1. `QuoteContext.tsx` — change `openQuote` type from `() => void` to `(context?: QuoteOpenContext) => void`
2. `PublicChrome.tsx` — store context in state alongside `isQuoteOpen`, pass to FloatingQuotePanel
3. `QuoteCTA.tsx` — add optional `serviceType` prop, pass to `openQuote`
4. `CTAButton.tsx` — accept and forward `serviceType` through quote action
5. `FloatingQuotePanel.tsx` — accept `initialServiceType` prop, pass to useQuoteForm
6. `useQuoteForm.ts` — accept `initialServiceType` option, call `setServiceType` on mount
7. Call sites — update service accordion and Who We Serve CTAs to pass service type

## III. The Full Form Architecture Picture

Now that I've seen both `QuoteSection` (desktop) and `FloatingQuotePanel` (mobile):

| Aspect | Desktop (QuoteSection) | Mobile (FloatingQuotePanel) |
|---|---|---|
| Rendering | Inline in page content | Overlay side drawer |
| Visibility | `hidden md:block` wrapper | Triggered by any QuoteCTA |
| Form pattern | Single-step, all fields | Two-step progressive |
| Fields shown | 7 (name, company, phone, email, service, timeline, description) | Step 1: 3 (name, phone, service). Step 2: 4 (company, email, timeline, description) |
| Expectation setting | 3-card info panel above form | Step indicator text only |
| Title | "Request a Quote" (h3 inside form area) | "Detailed Scope Request" (panel title) |
| Submit label | "Submit Quote Request" | Step 1: "Continue", Step 2: "Send My Quote Request" |
| Trust line | "We never share your information" | "Avg. response: under 1 hour" |
| `enableTwoStep` | `false` | `true` |
| Source tracking | `"quote_section"` | `"floating_quote_panel"` |
| Post-submit | Redirect to `/quote/success` | Step 1→2 transition, then redirect |

**Different trust lines is interesting.** Desktop reassures about privacy. Mobile reassures about speed. Both are valid, but the mobile choice is better for conversion — response time is a stronger motivator than privacy at the moment of submission.

## IV. The /quote/success Page — F-17 Status Update

The current code shows step-process content, NOT a referral ask:

```tsx
{ icon: "📞", step: "Step 1", text: "We'll call you within 1 hour" },
{ icon: "📋", step: "Step 2", text: "We'll send a detailed quote" },
{ icon: "✅", step: "Step 3", text: "Accept online with one click" },
{ icon: "🧹", step: "Step 4", text: "We clean. You relax." },
```

The current state summary says "F-17: Implemented but wrong (referral ask instead of step process)." **The code contradicts this.** Either:
1. The code was fixed after the status doc was written
2. The status doc is describing a different version

Based on what I see in the code, **F-17 appears correct.** The confirmation page shows: thank you message → 4-step process → "While you wait" CTAs → back to homepage. This is reasonable confirmation page UX.

However, the emoji usage (📞 📋 ✅ 🧹) looks informal for a B2B commercial cleaning company selling to GCs and property managers. Consider replacing with styled SVG icons matching the design system.

## V. Service Area Decision — Final Recommendation

After seeing `service-areas.ts`, my recommendation changes from the document's §16.4:

**Do NOT decommission the city pages.** The content is substantial, location-specific, and SEO-valuable. Instead:

1. **Remove homepage city pills** from `ServiceAreaSection.tsx` (they link to these pages but create duplicate navigation)
2. **Keep the pages active** for organic search traffic
3. **Fix the data source** — replace the hardcoded pill array in ServiceAreaSection with the `HOMEPAGE_SERVICE_AREA_LINKS` export from service-areas.ts (if pills are kept) or remove pills entirely (recommended)
4. **Keep the `/service-area` index page** as the canonical entry point from site navigation

## VI. Updated Decision Matrix — My Recommendations

Based on full code review, here are my strong recommendations for the four decisions I raised earlier:

**Decision 1: IncludedSummary ↔ Timeline → Option A (Merge), with desktop gate**

Remove IncludedSummarySection from page composition. Extend TimelineSection steps data with `valueLine` sub-text from IncludedSummary content. On mobile, show the merged content in a stepper format. On desktop, optionally keep the IncludedSummarySection as a standalone section using `hidden md:block` — but honestly, the desktop also benefits from the merge. The 3 flat cards aren't serving desktop well either.

**Decision 2: Footer CTA → Option C (Desktop keeps, mobile hides)**

Add `md:hidden` to MobileQuoteCloser (already has it — remove it, making it all-viewport). Actually, looking again, MobileQuoteCloser already IS `md:hidden`. The simplest fix: hide Footer CTA module on mobile (`hidden md:block` on the CTA block in FooterSection). Desktop keeps its conversion closer. Mobile gets clean terminal at MobileQuoteCloser.

**Decision 3: Who We Serve → Option B (Keep vertical, fix CTAs + show outcomes)**

The persona cards' copy is too good to hide behind accordion or compress into carousel. The pain points and stat lines are best read in full. The two high-impact changes (button treatment on "Discuss Your Project" + showing outcome text on mobile) fix the main issues without restructuring. If scroll budget is still tight after other savings, revisit carousel later.

**Decision 4: Where We Work → Option A modified (keep city cards as info, remove pills and legend)**

City cards provide name + distance + region — useful info display. Remove the pill links (they duplicate cards and link to pages that should be found via search, not homepage navigation). Remove region legend (too small to be useful). Keep the CTA. Consider adding the mini SVG map on mobile as a Phase 2 enhancement.

## VII. Final Implementation Priority — Code-Grounded

Based on all analysis, here's the execution sequence ordered by impact and dependencies:

### Critical (Before Anything Else)

| # | Change | Files | Impact |
|---|---|---|---|
| 1 | **Fix auto-close bug** — remove or fix the useEffect that closes panel 1.8s after step 1 | `FloatingQuotePanel.tsx` | Prevents users from losing step 2 form |
| 2 | **Fix panel title** — step-aware: "Get a Free Quote" (step 1) → "Add Project Details" (step 2) | `FloatingQuotePanel.tsx` | Fixes expectation mismatch |

### Tier 1 — Immediate (1-2 days, no design changes)

| # | Change | Files | Impact |
|---|---|---|---|
| 3 | Remove CareersSection from homepage | `VariantAPublicPage.tsx` | ~650px scroll savings |
| 4 | Hide Footer CTA on mobile | `FooterSection.tsx` | ~300px scroll savings, removes duplicate |
| 5 | "Discuss Your Project" → button treatment | `OfferAndIndustrySection.tsx` | Conversion lift on highest-qualified traffic |
| 6 | Move "Talk Through Your Scope" below persona cards on mobile | `OfferAndIndustrySection.tsx` | Fixes premature CTA |
| 7 | Show outcome text on mobile in persona cards | `OfferAndIndustrySection.tsx` | Restores the persuasion gap (problem → solution → CTA) |
| 8 | Update `/#careers` to `/careers` in menu | `PublicHeader.tsx` primaryLinks array | Fixes dead anchor after careers removal |
| 9 | Increase backdrop opacity `bg-black/55` → `bg-black/70` | `PublicHeader.tsx` | Fixes content bleed-through behind menu |
| 10 | Authority Bar headline change ("Our Numbers Speak" → something specific) | `AuthorityBar.tsx` | Better brand positioning |
| 11 | Fix "100% On-Time Handoff Focus" → "Rate" or change claim | `AuthorityBar.tsx` | Removes hedge language |
| 12 | Trim Licensed & Insured detail text | `AuthorityBar.tsx` | Reduces cell overflow |
| 13 | Remove city pill links from ServiceAreaSection | `ServiceAreaSection.tsx` | Removes duplicate navigation |
| 14 | Remove region legend on mobile | `ServiceAreaSection.tsx` | Reduces clutter |
| 15 | Testimonial headline change | `TestimonialSection.tsx` | Better framing |
| 16 | Add testimonial count indicator ("1 of 4") | `TestimonialSection.tsx` | Volume credibility |
| 17 | Surface `timeframe` field in testimonials | `TestimonialSection.tsx` | Relationship depth signal |

### Tier 2 — Component Refactors (3-5 days)

| # | Change | Files | Impact |
|---|---|---|---|
| 18 | Make 75svh default hero on mobile | `HeroSection.tsx` (flip `getInitialHeroVariant` default) | ~250px scroll savings |
| 19 | Context threading (service type pre-population) | `QuoteContext.tsx`, `PublicChrome.tsx`, `QuoteCTA.tsx`, `CTAButton.tsx`, `FloatingQuotePanel.tsx`, `useQuoteForm.ts` + new `service-type-map.ts` | Highest-impact conversion improvement |
| 20 | Remove intro paragraph from Timeline | `TimelineSection.tsx` | ~60px savings + removes redundancy |
| 21 | Show StepIcon on mobile in Timeline | `TimelineSection.tsx` | Visual anchors for mobile text wall |
| 22 | Add accordion expand tracking event | `ServiceSpreadSection.tsx` | Unblocks §15.6 acceptance target measurement |
| 23 | Add `inert` to collapsed accordion panels | `ServiceSpreadSection.tsx` | Accessibility fix |
| 24 | Fix FloatingQuotePanel z-index (`z-50` → `z-[55]`) | `FloatingQuotePanel.tsx` | Prevents stacking conflict with header |
| 25 | Add `quote_panel_closed` event (no-input bounce tracking) | `FloatingQuotePanel.tsx` | Fills analytics gap |

### Tier 3 — Significant Refactors (1-2 weeks)

| # | Change | Files | Impact |
|---|---|---|---|
| 26 | Merge IncludedSummary into Timeline as stepper | `VariantAPublicPage.tsx`, `TimelineSection.tsx` | ~400px savings + eliminates redundancy |
| 27 | Mobile stepper accordion for How It Works | `TimelineSection.tsx` (new mobile-only component) | ~250px savings + better engagement |
| 28 | Add mini SVG map on mobile to Where We Work | `ServiceAreaSection.tsx` | Geographic credibility on mobile |
| 29 | Before/After headline hierarchy swap + micro-CTA | `BeforeAfterSlider.tsx` | Stronger proof framing + conversion path |
| 30 | Replace inline pills data in ServiceAreaSection with `HOMEPAGE_SERVICE_AREA_LINKS` import | `ServiceAreaSection.tsx` | Data source consolidation (if keeping any pills) |
| 31 | Industry vertical page template | New route + template | §15.5 compliance |

---

Where I'd Dig Next
Here's what I think would be most valuable as a continuation, ranked by how likely we are to find actionable issues:

1. Error & Edge Case Paths (High Likelihood of Findings)
The happy path is well-audited. The unhappy paths aren't:

What happens when the quote API returns a 500? The useQuoteForm has a catch block, but does the user see a retry option or just a generic error message? On mobile, a failed Step 1 with no retry path means a lost lead.
What happens on network timeout? Mobile users on spotty connections. The isSubmitting state prevents double-submit, but is there a timeout after which the user can try again?
What happens when SMS/email delivery fails? The API fires notifications after inserting the lead. If Twilio is down, does the API still return success? (It should — lead is captured.) But does admin get any alert about the delivery failure?
Browser back button after Step 1 completion — does the panel maintain state? If a user completes Step 1, presses back, and re-opens the panel, do they see Step 2 or a fresh Step 1?
Multiple rapid CTA taps — the dedup guard in the API is in-memory per serverless instance. But what about the client side? Can a user tap "Get a Free Quote" 5 times fast and open 5 panels?
2. SEO & Metadata Audit (Medium Likelihood, High Impact)
I haven't seen:

The layout.tsx or page.tsx metadata (title, description, OG tags)
Structured data / JSON-LD (LocalBusiness schema, Service schema)
Heading hierarchy across the full page (are there h1→h2→h3 violations?)
Canonical URL handling for service area pages
Whether the homepage has proper hreflang given the bilingual ("Habla Español") positioning
For a local service business, local SEO is probably the #1 organic acquisition channel. If the metadata is weak, that's a bigger business impact than most UI fixes.

3. Security Surface (Medium Likelihood)
The code review flagged:

Step 2 trusts leadId without session ownership (TODO(phase2-security))
Honeypot is the only bot protection (no rate limiting visible in the API route)
Phone numbers stored formatted (not a security issue but a data hygiene one)
I'd want to see:

Is there rate limiting at the Vercel/middleware level?
Are the Twilio/email credentials properly scoped?
Is the Supabase insert using RLS or direct table access?
4. Performance Deep Dive (Lower Likelihood but Quantifiable)
Bundle size analysis — 5 statically-imported section components in the initial bundle. What's the actual JS weight?
Image optimization — are all images using Next.js <Image> with proper sizing, or are some raw <img> tags?
Font loading — the serif font (used in headlines) — is it preloaded? Does it cause FOIT/FOUT?
Third-party scripts — analytics, Twilio, Supabase client — how much do they add to initial load?

# Round 5 — Final File Analysis + Complete Synthesis

---

## File 22: `CTAButton.tsx`

### Pass 1 — Structural Read

**The `variant` prop is dead code.**

```tsx
type CTAButtonProps = {
  // ...
  variant?: "primary" | "secondary" | "outline" | "ghost";
  // ...
};
```

Declared in the type, accepted as a destructured prop — but **never referenced in the component body.** Not in className, not in logic, nowhere. Every call site styles CTAButton via the `className` prop directly (using `cta-primary`, `cta-outline-dark`, `cta-gold`, etc.). The variant system from F-25's original design was apparently abandoned in favor of direct class application, but the prop wasn't cleaned up.

**The `onClick` execution order matters:**

```tsx
const handleClick = (e: React.MouseEvent) => {
  // 1. Fire cta_click analytics
  // 2. If quote: fire quote_panel_opened + e.preventDefault() + openQuote()
  // 3. If onClick provided: onClick()
};
```

For quote CTAs: analytics fires → panel opens → custom onClick fires. The custom onClick executes **after** the panel is already opening. This is why the menu's `onClickCapture` works — capture phase runs before the bubble phase where handleClick fires, so the menu closes before the panel opens. But this ordering means you can't use `onClick` to *prevent* the panel from opening.

**The `quote_panel_opened` event IS being tracked — contrary to my earlier analysis gap:**

```tsx
if (actionType === "quote") {
  void trackConversionEvent({
    eventName: "quote_panel_opened",
    metadata: {
      source_cta_id: ctaId,
      action_type: actionType,
    },
  });
  e.preventDefault();
  openQuote();
}
```

So we DO know which CTA triggered the panel open. The `source_cta_id` captures the specific CTA identifier (e.g., `service_service-post-construction_quote_mobile`). **But this event is disconnected from the form submission.** The form's `quote_form_submitted` event doesn't include `source_cta_id`. We can correlate by timestamp, but there's no direct link.

**The button/link rendering logic:**

| Condition | Renders As | Example |
|---|---|---|
| `actionType === "quote" && !href` | `<button>` | "Get a Free Quote" in hero |
| `href` starts with `http`, `tel:`, `mailto:` | `<a>` | "Call Now: tel:..." |
| `href` is internal path | `<Link>` | "See Open Positions → /careers" |
| Default (no href, not quote) | `<button>` | Fallback |

This is clean routing logic. Every CTA on the page gets the correct semantic element.

### Pass 2 — Context Threading Fix — Exact Implementation

Now that I have CTAButton, QuoteContext, and useQuoteForm all complete, here's the precise fix:

**Step 1 — QuoteContext.tsx:**
```tsx
type QuoteOpenContext = {
  serviceType?: string;
  sourceCta?: string;
};

type QuoteContextValue = {
  openQuote: (context?: QuoteOpenContext) => void;
};
```

**Step 2 — PublicChrome.tsx:**
```tsx
const [quoteContext, setQuoteContext] = useState<QuoteOpenContext | undefined>();

const openQuote = useCallback((context?: QuoteOpenContext) => {
  setQuoteContext(context);
  setIsQuoteOpen(true);
}, []);

// Pass to FloatingQuotePanel:
<FloatingQuotePanel
  isOpen={isQuoteOpen}
  onClose={() => { setIsQuoteOpen(false); setQuoteContext(undefined); }}
  initialServiceType={quoteContext?.serviceType}
/>
```

**Step 3 — CTAButton.tsx:**
```tsx
type CTAButtonProps = {
  // ... existing props
  serviceType?: string; // NEW
};

// In handleClick, for quote action:
if (actionType === "quote") {
  openQuote(serviceType ? { serviceType, sourceCta: ctaId } : undefined);
}
```

Wait — problem. `openQuote` comes from `useQuoteAction()` which returns `context.openQuote`. But the hook returns the function directly:

```tsx
export function useQuoteAction() {
  const context = useContext(QuoteContext);
  // ...
  return context.openQuote;
}
```

So CTAButton calls `openQuote()` which is the function from context. Extending `openQuote` to accept `(context?)` works seamlessly — existing call sites pass no arguments (backward compatible), new call sites pass context.

**Step 4 — QuoteCTA.tsx:**
```tsx
type QuoteCTAProps = {
  ctaId?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  serviceType?: string; // NEW
};

export function QuoteCTA({ ctaId, children, className, style, serviceType }: QuoteCTAProps) {
  return (
    <CTAButton ctaId={ctaId} actionType="quote" className={className} style={style} serviceType={serviceType}>
      {children}
    </CTAButton>
  );
}
```

**Step 5 — FloatingQuotePanel.tsx:**
```tsx
type FloatingQuotePanelProps = {
  isOpen: boolean;
  onClose: () => void;
  initialServiceType?: string; // NEW
};

// On open, set service type:
useEffect(() => {
  if (isOpen && initialServiceType) {
    setters.setServiceType(initialServiceType);
  }
}, [isOpen, initialServiceType]);
```

**Step 6 — Call sites (ServiceSpreadSection):**
```tsx
// In MobileServiceAccordion, each expanded service:
<QuoteCTA
  ctaId={`service_${service.anchor}_quote_mobile`}
  serviceType={SERVICE_ANCHOR_TO_FORM_VALUE[service.anchor]}
  className="cta-outline-dark mt-4 min-h-[48px] w-full justify-center gap-2"
>
  Quote This Service →
</QuoteCTA>
```

**Step 7 — Mapping file:**
```tsx
// src/lib/service-type-map.ts
export const SERVICE_ANCHOR_TO_FORM_VALUE: Record<string, string> = {
  "service-post-construction": "post_construction",
  "service-final-clean": "final_clean",
  "service-commercial": "commercial",
  "service-move": "move_in_out",
  "service-windows": "window",
};
```

**Total files touched: 7.** All changes are additive (new optional props). Zero breaking changes to existing call sites. Full backward compatibility.

---

## File 23: `AIQuoteAssistant.tsx`

### Pass 1 — Structural Read

**CTA Suppression System — Has a Bug:**

```tsx
const ctaAnchors = [
  "#hero-primary-cta",
  "#service-area-primary-cta",
  "#mobile-quote-closer-cta",
  "#quote",
];
```

These are CSS selectors looking for elements by HTML `id`. But `QuoteCTA` renders `CTAButton` which renders a `<button>` — and **CTAButton does not set an `id` attribute on the element.** The `ctaId` prop is used exclusively for analytics metadata, not as an HTML id.

Let me verify against each selector:

| Selector | Looks For | Likely HTML Reality | Found? |
|---|---|---|---|
| `#hero-primary-cta` | Element with `id="hero-primary-cta"` | Hero CTA is a QuoteCTA/CTAButton with no HTML id | **❌ Probably not found** |
| `#service-area-primary-cta` | Element with `id="service-area-primary-cta"` | ServiceArea CTA is a QuoteCTA with no HTML id | **❌ Probably not found** |
| `#mobile-quote-closer-cta` | Element with `id="mobile-quote-closer-cta"` | MobileQuoteCloser CTA is a QuoteCTA with no HTML id | **❌ Probably not found** |
| `#quote` | Element with `id="quote"` | QuoteSection `<section id="quote">` | **✅ Found** (desktop only section) |

**Three of four suppression targets are likely phantom selectors.** The `document.querySelector` calls return `null`, the `targets` array filters them out, and suppression only works near the desktop quote section. **This explains the screenshot overlap** — the AI trigger isn't being suppressed near the Service Area CTA because the selector can't find the CTA element.

The fix is either:
1. Add `id` attributes to the relevant CTA wrapper elements in each section
2. Change the suppression system to use a different selector strategy (data attributes, class names, or section IDs with offset)

Option 2 is more robust:
```tsx
const ctaAnchors = [
  "[data-cta-suppress='true']",  // Generic marker
  "#quote",                       // Existing section ID
];
```
Then add `data-cta-suppress="true"` to the wrapper divs around important CTAs.

**Bilingual Chat — Genuine Competitive Differentiator:**

The EN/ES toggle with full string localization (greeting, error messages, placeholder, send button) aligns with the "Habla Español" trust signal in the hero. For Austin's market with a significant Spanish-speaking construction workforce, this isn't a nice-to-have — it's a real business feature.

**However, the locale toggle is only visible when the panel is open.** A Spanish-speaking user would first see the English trigger button (robot icon, no text), open it, see an English greeting, then need to find and tap the "ES" button. The initial experience is English-only. Consider:
- Adding a small "ES" indicator on the trigger button itself
- Auto-detecting locale from `navigator.language`
- Remembering locale preference in localStorage

**The chat calls `/api/ai-assistant`** — an API route I haven't seen. This is the AI backend. Without seeing it, I can note:
- Session ID management exists (persisted across messages within a locale)
- Error handling shows a helpful fallback message rather than crashing
- No message history persists across page navigation (all state is component-local)

**Positioning and Z-Index — Confirmed Correct:**

| Element | Z-Index | Layer |
|---|---|---|
| Trigger button | `z-[40]` | Floating widget layer |
| Chat panel | `z-[55]` | Dialog layer |
| Sticky bar | `z-[30]` | Sticky bar layer |
| Header | `z-[50]` | Header layer |
| FloatingQuotePanel | `z-50` | ⚠️ Same as header (should be 55) |

The AI panel at `z-[55]` would render above the FloatingQuotePanel at `z-50`. If both were open simultaneously, the chat would overlay the quote form. This is unlikely (the AI trigger has `floating-widget` class which is suppressed in certain states), but the stacking order should be: quote panel > AI panel, not the reverse. The quote form is the primary conversion tool.

**Fix:** Either FloatingQuotePanel goes to `z-[55]` and AI panel stays at `z-[55]` (DOM order wins — quote panel renders later), or explicitly set quote panel to `z-[58]` to ensure it's always on top.

**Size constraint is well-handled:**
```tsx
className="... h-[min(28rem,calc(100svh-13rem))] w-[calc(100vw-2rem)] max-w-[22rem] ..."
```
On mobile: width = viewport - 32px (with max 352px), height = min(448px, viewport - 208px). On a 667px iPhone SE, that's min(448, 459) = 448px. On a 568px iPhone 5, that's min(448, 360) = 360px. The panel adapts to small viewports without overflowing. Good.

### Pass 2 — Contextual Evaluation

This is a well-built chat widget with a CTA suppression bug that undermines its positioning strategy. The bilingual support is a genuine feature. The main architectural concern is that it's a separate conversion path from the quote panel — a user who engages with the AI assistant to describe their project then has to separately fill out the quote form. There's no handoff from "I described my project in chat" to "the form is pre-filled with what I said."

---

## File 24: `ExitIntentOverlay.tsx`

### Pass 1 — Structural Read

**Desktop-only by mechanism.** The `mouseleave` event on `document` fires when the cursor exits the page area (typically moving toward the URL bar or tab bar). On mobile touch devices, this event effectively never fires because there's no cursor. **Mobile users will never see this overlay.**

This is appropriate — exit intent on mobile requires different detection (back button, visibility change, or inactivity timeout). The component correctly doesn't try to fake mobile exit intent.

**Guard conditions are thorough — five gates:**

| Gate | Purpose | Implementation |
|---|---|---|
| `hasShownRef.current` | Once per component mount | Ref boolean |
| `sessionStorage` | Once per browser session | `aa_exit_intent_shown` key |
| `timeOnPageRef.current < 10_000` | User must have spent 10+ seconds | Interval timer |
| `!hasScrolledRef.current` | User must have scrolled past 600px | Scroll listener |
| `document.body.style.overflow === "hidden"` | No existing modal open | Body overflow check |

This prevents aggressive popup behavior. A user must: be on the page 10+ seconds, have scrolled past 600px, not have any modal open, and be attempting to leave. These are reasonable engagement signals.

**One concern with the body overflow check:**
```tsx
if (document.body.style.overflow === "hidden") {
  return;
}
```

This checks the inline `style.overflow` property specifically. If a modal sets overflow via a CSS class instead of inline style, this check fails. The FloatingQuotePanel uses `inert` on the main content div — I'd need to verify whether it also sets `body.style.overflow`. If the quote panel is open but doesn't set body overflow, the exit intent could theoretically trigger on top of it. The `z-[60]` z-index would place it above the quote panel (`z-50`), creating a confusing layered modal situation.

**The CTA opens the quote panel — same context gap:**
```tsx
const acceptOffer = () => {
  setIsVisible(false);
  onOpenQuote();  // calls openQuote() with no context
};
```

No service type pre-selection. The user sees a generic "Get My Free Quote" and opens a blank form. This is less of an issue here because the exit intent is a catch-all — the user hasn't indicated a specific service interest. Generic form is acceptable.

**Analytics are complete and well-structured:**
- `exit_intent_shown` — trigger measurement
- `exit_intent_dismissed` — decline measurement
- `exit_intent_accepted` — conversion measurement

This gives us: show rate (shown / total desktop visitors), acceptance rate (accepted / shown), and dismiss rate (dismissed / shown). These are exactly the metrics needed to evaluate the feature's value.

**The copy is strong:**
> "Get your free quote in under a minute" + "we respond within one hour during business hours with a clear scope and estimate. No obligation."

This is specific and low-friction. The trust bullets mirror the rest of the site. The "No thanks, I'll come back later" dismiss text is standard exit intent UX.

---

## File 25: `useQuoteForm.ts` (Complete — Confirming Earlier Analysis)

Now that I have the full file alongside FloatingQuotePanel, let me confirm the auto-close bug trace end-to-end:

**Step 1 completion path:**
```tsx
// In useQuoteForm submitLead:
setLeadId(stepOneBody?.leadId ?? null);
setCurrentStep(2);
setFeedback({
  message: "Great. Add optional project details to speed up your quote.",
  type: "success",
});
```

After this executes, in FloatingQuotePanel:
```tsx
useEffect(() => {
  if (feedback?.type !== "success" || currentStep !== 2) return;
  const closeTimer = window.setTimeout(() => onClose(), 1800);
  return () => window.clearTimeout(closeTimer);
}, [currentStep, feedback, onClose]);
```

`feedback.type === "success"` ✅ AND `currentStep === 2` ✅ → timer starts → **panel closes in 1.8 seconds.**

**Step 2 completion path:**
```tsx
// In useQuoteForm submitLead (the else branch for step 2):
if (enableTwoStep) {
  await trackConversionEvent({ eventName: "quote_step2_completed", ... });
}
await trackConversionEvent({ eventName: "quote_form_submitted", ... });
await trackConversionEvent({ eventName: "quote_submit_success", ... });
router.push(`/quote/success?name=${encodeURIComponent(firstName)}`);
```

No `setFeedback` call. The router navigates away. The auto-close useEffect doesn't trigger because feedback wasn't updated to success for step 2.

**Bug confirmed with full code trace.** The auto-close is a step 1→2 transition bug, not a step 2 completion bug.

**Additional finding in useQuoteForm — step 2 sends different fields than expected:**

For the two-step flow, step 2 sends:
```tsx
{
  flowStep: "step2",
  leadId,
  companyName,
  email,
  timeline,
  description,
  website,
}
```

Note what's **NOT included**: `name`, `phone`, `serviceType`. These were sent in step 1. This is correct — step 2 only updates the enrichment fields. But the API's step 2 handler must do an UPDATE, not an INSERT. The API route I saw earlier confirms this: step 2 uses `leadId` to update the existing record.

**But there's an edge case:** If `leadId` is null (step 1 response didn't include it, or it was lost), step 2 sends `{ flowStep: "step2", leadId: null, ... }`. The API would fail or create an orphaned record. The `setLeadId(stepOneBody?.leadId ?? null)` uses nullish coalescing — if the API response doesn't parse or doesn't have `leadId`, the form continues to step 2 with null leadId.

This is a resilience gap: the form shows step 2 even if the leadId wasn't captured. The user fills out step 2, submits, and the API either errors or creates a disconnected record.

**Fix:** Add a leadId check before showing step 2. If leadId is null after step 1, show a warning: "Your info was received but we couldn't prepare step 2. We'll call you within 1 hour."

---

## Updated Cross-Cutting Findings

### Finding 9: AI Assistant CTA Suppression Bug

Three of four suppression selectors (`#hero-primary-cta`, `#service-area-primary-cta`, `#mobile-quote-closer-cta`) target HTML IDs that don't exist on the page. The `ctaId` prop in QuoteCTA/CTAButton is an analytics identifier, not an HTML `id` attribute. The IntersectionObserver finds only `#quote` (the desktop quote section), making suppression effectively non-functional on mobile where the `#quote` section is hidden.

**Severity: Moderate.** The AI trigger overlaps important CTAs, creating tap-target conflicts and visual clutter at conversion moments.

**Fix complexity: Low.** Add `id` attributes to wrapper elements around the three CTA areas, or switch to `data-cta-suppress` attribute strategy.

### Finding 10: Dead `variant` Prop in CTAButton

The `variant` prop accepts `"primary" | "secondary" | "outline" | "ghost"` but is never used. All styling is done via `className` passthrough. This is misleading API surface — a developer might set `variant="outline"` expecting it to do something.

**Severity: Low.** No runtime impact, but developer experience issue.

**Fix:** Remove `variant` from the type and destructuring, or implement it.

### Finding 11: Exit Intent → Quote Panel Z-Index Stacking Risk

If ExitIntentOverlay (`z-[60]`) triggers while FloatingQuotePanel (`z-50`) is somehow open, the exit overlay would cover the quote form. The body overflow check should prevent this if the quote panel sets body overflow, but the FloatingQuotePanel uses `inert` on the main content div, not `overflow: hidden` on body.

**Severity: Low** (unlikely concurrent state). But worth adding an explicit check.

**Fix:** Add `isQuoteOpen` check to ExitIntentOverlay's guard conditions, passed as a prop from PublicChrome.

### Finding 12: Step 1 → Step 2 Transition Has No LeadId Validation

If step 1's API response doesn't include a `leadId` (network parsing error, malformed response), the form transitions to step 2 with `leadId: null`. Step 2 submission would send a null leadId to the API.

**Severity: Medium.** Rare but loses data silently.

**Fix:** Check `leadId` after step 1 response. If null, show success message ("We got your info, we'll call within 1 hour") but don't transition to step 2.

### Finding 13: Quote Form Analytics — Source CTA Disconnected from Submission

The `cta_click` and `quote_panel_opened` events capture `source_cta_id`. The `quote_form_submitted` event captures `serviceType` and `hero_variant`. There's no shared identifier linking "which CTA opened the panel" to "which form was submitted." To correlate, you'd need to match by timestamp within a session, which is fragile.

**Fix:** Pass `sourceCta` through the context threading (already designed into the proposed QuoteOpenContext type). Include it in form submission metadata.

---

## Complete Bug Registry (All Files)

| # | Bug | Severity | Component | Status |
|---|---|---|---|---|
| 1 | **Auto-close race condition** — Panel closes 1.8s after step 1 completion, user loses step 2 | **High** | `FloatingQuotePanel.tsx` | Live bug |
| 2 | **AI suppression phantom selectors** — 3 of 4 CTA suppression targets don't exist in DOM | **Moderate** | `AIQuoteAssistant.tsx` | Live bug |
| 3 | **Duplicate success events** — `quote_form_submitted` and `quote_submit_success` fire at same point with same data | **Low** | `useQuoteForm.ts` | Analytics noise |
| 4 | **FloatingQuotePanel z-index** — `z-50` matches header z-index, should be `z-[55]` | **Low** | `FloatingQuotePanel.tsx` | Fragile stacking |
| 5 | **LeadId null transition** — Step 2 shown even if step 1 didn't return leadId | **Medium** | `useQuoteForm.ts` | Edge case data loss |
| 6 | **Dead `variant` prop** — Declared, accepted, never used | **Trivial** | `CTAButton.tsx` | Dead code |
| 7 | **`/#careers` dead anchor** — Will break when CareersSection removed from homepage | **Low** (future) | `PublicHeader.tsx` | Pending on removal |
| 8 | **City pills not using shared data source** — Inline array duplicates `HOMEPAGE_SERVICE_AREA_LINKS` | **Low** | `ServiceAreaSection.tsx` | Maintenance hazard |

---

## Complete Analytics Gap Registry (All Files)

| Gap | Can Measure? | Impact | Fix Location |
|---|---|---|---|
| Which accordion panel expanded | ❌ | Blocks §15.6 "35% accordion interaction" target | `ServiceSpreadSection.tsx` — add event in `setOpenService` |
| Panel opened but no input (immediate bounce) | ❌ | Can't measure form friction | `FloatingQuotePanel.tsx` — fire event on close when no input |
| Source CTA → form submission link | ❌ | Can't attribute conversions to specific CTAs | Context threading (`sourceCta` in form metadata) |
| AI suppression activation | ❌ | Can't measure how often AI trigger is hidden | `AIQuoteAssistant.tsx` — fire event when `isSuppressedByCTA` changes |
| Testimonial carousel engagement | ❌ | Can't measure social proof consumption | `TestimonialSection.tsx` — fire event on swipe/dot tap |
| Before/After slider interaction | ❌ | Can't measure proof engagement | `BeforeAfterSlider.tsx` — fire event on drag start |
| Who We Serve card engagement | ❌ | Can't measure persona self-identification | `OfferAndIndustrySection.tsx` — fire event on card scroll-into-view or CTA tap per card |
| Exit intent overlay shown | ✅ | Measured | — |
| Exit intent acceptance rate | ✅ | Measured | — |
| AI assistant usage | ✅ | Open/message/success/failure all tracked | — |

---

## Final Master Inventory — All Files Analyzed

| # | File | Passes Complete | Critical Findings |
|---|---|---|---|
| 1 | `VariantAPublicPage.tsx` | ✅ 3/3 | CareersSection last in composition; IncludedSummary inline |
| 2 | `PublicChrome.tsx` | ✅ 3/3 | Conversion orchestrator; no context in openQuote |
| 3 | `useQuoteForm.ts` | ✅ 3/3 | Auto-close bug source; duplicate events; leadId null edge case |
| 4 | `HeroSection.tsx` | ✅ 3/3 | 100svh default; CLS fix confirmed; 1.76s animation sequence |
| 5 | `ServiceSpreadSection.tsx` | ✅ 3/3 | Best mobile architecture (fully separated); image lazy loading fixed; proof lines hidden |
| 6 | `OfferAndIndustrySection.tsx` | ✅ 3/3 | Outcome block hidden mobile; text link CTA; premature top button |
| 7 | `TimelineSection.tsx` | ✅ 3/3 | Text wall; redundant with IncludedSummary; clean merge path |
| 8 | `ServiceAreaSection.tsx` | ✅ 3/3 | Triple navigation redundancy; phantom city pills |
| 9 | `BeforeAfterSlider.tsx` | ✅ 3/3 | Strong proof section; inverted hierarchy; no micro-CTA |
| 10 | `CareersSection.tsx` | ✅ 3/3 | Wrong audience on homepage; clean removal |
| 11 | `FooterSection.tsx` | ✅ 3/3 | Duplicate CTA; desktop dependency for conversion closer |
| 12 | `PublicHeader.tsx` | ✅ 3/3 | Backdrop exists (corrected); chevron rotates; industry links all same anchor |
| 13 | `AuthorityBar.tsx` | ✅ 3/3 | Generic headline; "Focus" hedge; no review count |
| 14 | `TestimonialSection.tsx` | ✅ 3/3 | Orphaned timeframe data; no count; auto-advance off on mobile |
| 15 | `QuoteCTA.tsx` | ✅ 3/3 | Thin wrapper; no context props; bottleneck for threading |
| 16 | `CTAButton.tsx` | ✅ 3/3 | Dead variant prop; onClick fires after panel open; threading insertion point |
| 17 | `FloatingQuotePanel.tsx` | ✅ 3/3 | Auto-close bug; static title; h-full white space; no initial context |
| 18 | `QuoteSection.tsx` | ✅ 3/3 | Desktop-only; single-step; matches mobile field values |
| 19 | `AboutSection.tsx` | ✅ 3/3 | Years discrepancy (15+ vs 6+); triple Licensed & Insured |
| 20 | `service-areas.ts` | ✅ 3/3 | Substantial content; DON'T decommission; shared export unused |
| 21 | `globals.css` / `tailwind.config` | ✅ 2/2 | Z-index scale; CTA classes; reduced-motion global |
| 22 | `quote-request/route.ts` | ✅ 3/3 | Formatted phone stored; step 2 no notifications; honeypot works |
| 23 | `QuoteContext.tsx` | ✅ 3/3 | Minimal; exact extension point for threading |
| 24 | `AIQuoteAssistant.tsx` | ✅ 3/3 | **Phantom suppression selectors**; bilingual feature; z-index correct |
| 25 | `ExitIntentOverlay.tsx` | ✅ 3/3 | Desktop-only (correct); well-guarded; same context gap |

---

## What's Left to Dig Into

Now that I have the full component picture, here's where I'd go next, ranked by expected finding density:

**1. Error recovery paths (highest yield).** I've traced the happy path exhaustively. The unhappy paths — API failures, network timeouts, Twilio outages, malformed responses — have light coverage. The `useQuoteForm` catch block shows a generic "Please call us directly" message, but there's no retry mechanism, no offline detection, and no timeout handling. On mobile with spotty Austin cell service, these matter.

**2. The `/api/ai-assistant` route.** The AIQuoteAssistant sends messages there but I haven't seen the backend. Key questions: is there rate limiting? How are sessions stored? What's the prompt engineering? Is there a handoff path where the AI can pre-fill the quote form based on conversation context? That would be the highest-value AI integration.

**3. SEO metadata layer.** `layout.tsx`, `page.tsx` metadata exports, structured data. For a local service business, this is revenue-critical. I haven't seen any of it.

**4. The Supabase schema and RLS policies.** The API route does `supabase.from("leads").insert(...)`. What are the table permissions? Is there RLS? Can an unauthenticated client read other leads?

What do you want to tackle next — should I write up the master implementation document based on everything I have, go deeper on error paths, or pivot to SEO/infrastructure?