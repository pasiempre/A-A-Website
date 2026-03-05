# A&A Cleaning — Website UX/UI Architecture
## Section Modules, Layouts, Interaction Patterns & Page Flow
### March 2026

---

# 1. DESIGN PHILOSOPHY

This document defines the UX/UI architecture for the A&A Cleaning website — the modules, layouts, scroll flows, interactive patterns, and narrative structures that shape how users experience the site. This is not a styling guide. Colors, fonts, and CSS are applied separately.

### Design North Star

The site should feel like walking through a freshly completed luxury building — clean surfaces, intentional space, nothing wasted. Every element earns its place. The visual language borrows from editorial luxury brands (Prada, Versace, Acne Studios) but serves a B2B construction audience.

**Core Principles:**
- **Space is the luxury.** Generous whitespace between elements communicates confidence and quality. Cramped layouts signal commodity services.
- **Photography leads.** Full-bleed images of high-end offices, modern apartment interiors, and contemporary commercial spaces dominate the visual hierarchy. These are aspirational backdrops — the kind of spaces A&A cleans.
- **Typography as design.** Large, bold headlines function as visual elements, not just text. A single word at 120px carries more weight than a paragraph at 16px.
- **Progressive revelation.** Don't show everything at once. Use scroll-driven reveals, hover expansions, and interaction patterns that reward engagement.
- **Every section converts.** The site is a lead capture machine. CTAs are woven into the narrative, not isolated in a "contact" section.

### Reference Points

| Reference | What to Borrow |
|---|---|
| Prada.com | Use of space, typography scale, photography dominance, minimal navigation |
| Versace.com | Full-bleed hero treatments, editorial section pacing, bold type + image pairing |
| Aman Resorts | Photography-driven storytelling, atmospheric backdrops, sense of premium calm |
| Foster + Partners | Clean B2B presentation, project showcases as trust signals, sophisticated layouts |
| Apple Product Pages | Scroll-driven reveals, section transitions, feature storytelling |

---

# 2. PHOTOGRAPHY DIRECTION

Photography is the primary visual element. The site does NOT use stock photos of people pretending to clean. It uses architectural/interior photography of the spaces A&A serves.

### Subject Matter

| Category | Description | Usage |
|---|---|---|
| **Modern Office Interiors** | Open floor plans, glass walls, contemporary furniture, clean desks, concrete + wood finishes | Hero backgrounds, service section backdrops, quote form backgrounds |
| **Luxury Apartment Buildings** | Lobby areas, freshly turned units, modern kitchens, marble bathrooms, rooftop amenity spaces | Before/after content, service showcases |
| **Commercial Spaces** | Retail interiors, conference rooms, co-working spaces, reception areas with designer furniture | Commercial cleaning service sections |
| **Construction Completions** | Just-finished construction sites showing the transition from rough to polished | Post-construction service showcases, process sections |
| **Detail Shots** | Close-ups of gleaming surfaces, spotless glass, pristine flooring, architectural details | Texture backgrounds, section accents |

### Photography Treatment

- **Full-bleed usage** — Photos extend edge to edge, not contained in frames
- **Overlay text** — Content layered over photos with gradient overlays for readability
- **Desaturation** — Photos slightly desaturated or tinted to unify with the brand palette
- **Parallax depth** — Background photos scroll at different speeds than foreground content
- **Scale contrast** — Alternate between full-viewport photos and small detail crops

---

# 3. COLOR REFERENCE

Retained from design system. Applied at the styling layer, not in this document.

| Token | Value | Role |
|---|---|---|
| Navy | #0A1628 | Primary dark, authority |
| Slate | #1E293B | Secondary dark |
| Royal Blue | #2563EB | Brand accent |
| Steel Blue | #1D4ED8 | CTA/action |
| Gold | #C9A94E | Luxury accent |
| Warm Gray | #F1F0EE | Soft backgrounds |
| White | #FAFAF8 | Clean base |

---

# 4. SECTION MODULE LIBRARY

Each module below is a unique section design. Variants select and sequence these modules differently. No two modules in a single variant serve the same purpose.

---

## 4.1 HERO MODULES

### Module H1 — "Cinematic Immersion"

**Layout:** Full-viewport (100vh). Single background image/video fills the entire screen. Content is minimal and centered in the lower third.

**Content:**
- One headline in oversized display font (80-120px desktop) — functions as a visual element, not paragraph text
- One sentence of supporting copy
- Two CTAs side by side (Request a Quote + Call Now)
- Trust strip anchored to the bottom edge (Licensed & Insured • Austin Metro • Bilingual Crew)

**Interaction:**
- Background: Ken Burns slow zoom on a photo of a pristine modern office interior, or slow-motion video of light moving through a freshly completed space
- Content fades in on load (0.8s delay, upward motion)
- On scroll, background image parallax — moves slower than content
- Trust strip uses a subtle entrance animation (slide up)

**Photography:** A single hero image — something like a gleaming modern lobby with floor-to-ceiling glass, contemporary furniture, and immaculate surfaces. The space should feel aspirational.

**Mobile Adaptation:** Photo crops to center-focus. Headline scales down but remains proportionally large (40-48px). CTAs stack vertically. Trust strip wraps to 2 lines.

---

### Module H2 — "Split Statement"

**Layout:** Two-column split — left 45% content, right 55% photography. Full viewport height.

**Content (left panel):**
- Small category label above headline ("Construction Cleaning Specialists" in tracked uppercase sans-serif)
- Headline in large display font, stacked across 2-3 lines
- Short paragraph (2 sentences max)
- Two CTAs stacked vertically with breathing room between them
- Trust badges as a horizontal row at the bottom of the panel

**Photography (right panel):**
- Full-height image of a modern high-rise apartment interior — clean lines, warm wood, floor-to-ceiling windows
- Image bleeds to the right edge of the viewport, no padding
- Subtle dark gradient overlay on the left edge where photo meets content

**Interaction:**
- Content panel slides in from left on load
- Photo has a reveal animation — expands from center outward
- On hover over the photo panel, a subtle zoom effect (102% scale, 0.6s)

**Mobile Adaptation:** Stacks — photo becomes a landscape band (50vh) above the content. Content gets full width below.

---

### Module H3 — "Typographic Statement"

**Layout:** Predominantly empty space. The headline IS the design. Minimal elements on a clean background.

**Content:**
- Massive headline spanning nearly the full width (one or two words per line, 100-140px desktop)
- Below: a thin gold accent line (60px wide)
- Below that: one line of supporting copy
- Two small, refined CTAs
- No background image in the hero itself — the typography commands the viewport

**Interaction:**
- Letters of the headline animate in sequentially (staggered reveal, left to right, 0.05s per character)
- Below the fold, a large photo peeks in — the top 20% is visible, inviting the scroll
- Gold line draws itself (width animates from 0 to 60px)

**Mobile Adaptation:** Headline scales to 48-56px. Fewer words per line — the vertical stack gets taller. CTAs at thumb-reach height (lower third of screen).

---

## 4.2 SERVICE MODULES

### Module S1 — "Editorial Spreads"

**Layout:** Each service gets a full-width section. Photo occupies 60-70% width, content column occupies 30-40%. Services alternate sides (photo left/content right, then photo right/content left).

**Content per spread:**
- Service name in oversized display font (48-64px), used as a visual element
- 2-3 sentence description
- Bulleted scope items (what's included)
- "Request a Quote for This Service" CTA
- Small detail photo or icon element as accent

**Photography:** Each service has a relevant backdrop:
- Post-Construction → freshly completed commercial space, scaffolding just removed
- Final Clean → pristine apartment unit, sunlight on hardwood floors
- Commercial → modern office with designer furniture, glass partitions
- Move-In/Move-Out → empty luxury apartment, dramatic natural light
- Windows & Power Wash → gleaming storefront or glass curtain wall

**Interaction:**
- Each spread enters the viewport with a staggered reveal — photo slides in from one side, content fades up from the other
- Photo has a slight parallax offset on scroll
- Service name has a subtle text-shadow or outline treatment that makes it feel architectural

**Mobile Adaptation:** Stacks to single column — photo as landscape band (40vh), content below. Service name still large (32-36px). All services stack vertically.

---

### Module S2 — "Gallery Cards with Hover Depth"

**Layout:** Staggered grid — NOT equal columns. Two large cards on top (60/40 split), three cards below (33/33/33). Cards are photo-dominant with text overlay.

**Content per card:**
- Background photo of a relevant high-end space
- Service name overlaid in display font at bottom-left
- Dark gradient overlay from bottom (0% to 60% opacity) for text readability
- On hover: description panel slides up from bottom covering the lower 40% of the card

**Hover state reveals:**
- Service description (2 sentences)
- Scope highlights (3 bullet points)
- "Get a Quote →" link

**Interaction:**
- Cards have a 2-4px elevation on hover (translateY + shadow increase)
- The overlay panel slides up with a smooth 0.3s ease
- On mobile (no hover): cards are tappable, tap toggles the description panel
- Subtle image zoom on hover (103%, 0.5s transition)

**Mobile Adaptation:** Single column stack. Cards become landscape-oriented (16:9 ratio). Tap to expand description. No hover dependency.

---

### Module S3 — "Expandable Service List"

**Layout:** Vertical list of service names, each in large display font. Each name is a row, separated by thin horizontal lines. The list takes up the full width.

**Content per row:**
- Service name in display font (36-48px)
- Small label to the right indicating work type ("New Construction" / "Vacant Properties" / etc.)
- Arrow indicator (→) at far right

**Interaction:**
- On click/hover, the row expands vertically to reveal:
  - A landscape photo of a relevant space (slides in from left)
  - Service description paragraph
  - 3-4 scope bullet points
  - "Request a Quote" CTA
- Accordion behavior — opening one closes the previously open row
- Row expansion is smooth (0.4s ease, height animation)
- The expanded photo has a subtle Ken Burns zoom while visible

**Mobile Adaptation:** Full width. Service names scale down to 28-32px. Expand/collapse is tap-driven. Photo becomes a full-width band above the description text.

---

## 4.3 TRUST & CREDIBILITY MODULES

### Module T1 — "Authority Bar"

**Layout:** A single horizontal strip spanning full width. NOT cards in a grid. One continuous band.

**Content:**
- 3-4 key stats displayed as oversized numbers (72-96px display font) with small labels beneath
- Stats separated by thin vertical dividers or generous spacing
- Examples: "15+ Years" / "500+ Projects" / "Licensed & Insured" / "100% Satisfaction"

**Interaction:**
- Numbers count up from 0 when the section scrolls into view (counter animation, 1.5s duration)
- Each number staggers its count-up start by 0.2s

**Mobile Adaptation:** Two stats per row, 2x2 grid. Numbers scale to 48-56px.

---

### Module T2 — "Editorial Testimonial"

**Layout:** Full-width section. A single large testimonial takes center stage. Quote text in oversized italic display font (28-36px). Minimal supporting elements.

**Content:**
- Large decorative quote marks (gold, 80-100px)
- Testimonial text centered, max-width 800px
- Attribution line: name, title, company
- Optional: small company logo or project photo
- Below the quote: a thin gold accent line

**Interaction:**
- Quote text fades in on scroll-enter, word by word or line by line (typewriter-style reveal)
- After the text is fully revealed, the attribution fades in
- If multiple testimonials: auto-rotate every 6 seconds with crossfade, or use horizontal swipe/arrow navigation

**Mobile Adaptation:** Quote text scales to 22-26px. Still centered. Quote marks scale proportionally.

---

### Module T3 — "Stacked Social Proof"

**Layout:** Two-part section. Top half: a grid of 2-3 testimonial cards. Bottom half: trust badges/stats in a horizontal strip.

**Content — Testimonial cards:**
- Each card: quote text (18-20px), 5-star rating, attribution
- Cards have a slight rotation/overlap (fanned card effect, 1-2 degree rotation)
- Background: subtle photo of a completed space at very low opacity

**Content — Trust strip:**
- Horizontal row of badges: "Licensed & Insured" / "Background Checked" / "Bilingual Teams" / "Austin Metro Coverage"
- Each badge: icon + label, generous spacing between items

**Interaction:**
- Cards enter viewport with a staggered cascade (first card, then second offset by 0.2s, then third)
- On hover, individual card lifts slightly and comes to full opacity
- Trust badges slide in from below as a row

**Mobile Adaptation:** Testimonial cards stack vertically (no rotation). Trust badges wrap to 2x2 grid.

---

## 4.4 PROCESS MODULES

### Module P1 — "Vertical Scroll Timeline"

**Layout:** A vertical timeline running down the center of the page. Steps alternate left and right of the timeline axis.

**Content per step:**
- Step number in oversized display font (64-80px)
- Step title in bold sans-serif
- 2-sentence description
- Small supporting photo or icon
- Thin connecting line between steps

**Interaction:**
- As the user scrolls, each step animates into view — slides in from its respective side (left or right)
- The connecting line "draws" downward as the user scrolls through the section
- The active step (currently in viewport center) is highlighted; others are slightly faded
- The entire section has a subtle background color transition as you progress through steps

**Photography per step:**
1. Request a Quote → Photo of a phone/laptop showing a contact form
2. We Assess → Photo of a professional surveying a commercial space
3. We Clean → Photo of a pristine office being detailed
4. You Walk Through → Photo of a finished, gleaming space

**Mobile Adaptation:** All steps align left. Timeline line runs along the left edge. Steps stack vertically. Photos scale to full-width thumbnails.

---

### Module P2 — "Horizontal Panel Slider"

**Layout:** A horizontally scrolling row of 4 panels. Each panel occupies 80% of the viewport width. Navigation dots or arrows below.

**Content per panel:**
- Large step number (top-left, display font, 96px)
- Step title below the number
- Description paragraph
- Background photo (70% opacity, dark overlay) of the relevant stage

**Interaction:**
- Scroll-snap on each panel — panels snap to center alignment
- Swipe on mobile, drag on desktop, arrow keys for keyboard navigation
- Active panel indicator (dots below, or a progress bar)
- Panels that aren't centered are slightly scaled down (95%) and dimmed

**Mobile Adaptation:** Panels become full-width. Swipe to navigate. Dots remain. Same snap behavior.

---

### Module P3 — "Sparse Grid"

**Layout:** 4-column grid with extreme whitespace between columns. Each column is a step. No connecting lines, circles, or decorative elements — the alignment and spacing creates the visual relationship.

**Content per column:**
- Step number in large display font (80px)
- Step title (bold, 20px)
- One sentence of description (body text)
- Nothing else

**Interaction:**
- Columns fade in sequentially on scroll-enter (0.15s stagger)
- No hover effects — the simplicity IS the design

**Mobile Adaptation:** 2x2 grid. Step numbers scale to 48px.

---

## 4.5 QUOTE FORM MODULES

### Module Q1 — "Split Conversation"

**Layout:** Full-width section, split 50/50. Left: dramatic photo of a completed luxury space. Right: the quote form.

**Content (left panel):**
- Full-height photo — a modern lobby or apartment interior, professionally lit
- Overlaid text at bottom: "Let's Talk About Your Project" in display font
- Phone number displayed prominently: "Or call now: (512) XXX-XXXX" (click-to-call)

**Content (right panel):**
- Form heading: "Request a Quote"
- Subhead: "Tell us about your project. We call back within the hour."
- Fields: Name, Company, Phone, Email, Service Type (dropdown), Timeline (dropdown), Project Description (textarea)
- Submit CTA: prominent, full-width within form column
- Below form: small privacy note ("We never share your information")

**Interaction:**
- Form validates inline — green checkmarks appear as fields are completed correctly
- Submit button has a loading state (spinner) → success state (checkmark + "We'll call you soon")
- On mobile: phone number has a prominent tap-to-call button above the form

**Mobile Adaptation:** Stacks — photo becomes a band (30vh) above the form. Form gets full width with comfortable padding.

---

### Module Q2 — "Floating Form Panel"

**Layout:** Not a section — triggered by CTA clicks throughout the page. A slide-in panel from the right edge of the viewport.

**Content:**
- Semi-transparent backdrop dims the page behind
- Panel width: 480px desktop, full-width mobile
- Form heading, fields, and submit (same fields as Q1)
- "X" close button top-right
- Phone number as alternative CTA at the bottom of the panel

**Interaction:**
- Slides in from right with a 0.3s ease
- Backdrop fades in simultaneously
- Escape key or backdrop click closes
- Focus trapped within the panel while open (accessibility)
- Form submission shows inline success message, then auto-closes after 3 seconds

**Mobile Adaptation:** Full-screen takeover. Close button becomes a "← Back" at top-left.

---

### Module Q3 — "Minimal Inline Form"

**Layout:** Centered on the page within a full-width section. Form is narrow (max 520px) with extreme whitespace around it. The emptiness is the design.

**Content:**
- Oversized heading: "Ready?" or "Let's Get Started" (48-64px display font)
- Thin gold accent line below heading
- Minimal fields: Name, Phone, Service Type, Brief Description
- Full-width submit button
- Below: phone number as text link

**Interaction:**
- None beyond standard form behavior — the simplicity signals sophistication
- Input fields have a subtle bottom-border-only style (no box borders)
- Focus state: border color change + label float animation

**Mobile Adaptation:** Full width with side padding. Fields stack naturally. Heading scales to 32-36px.

---

## 4.6 ABOUT / STORY MODULES

### Module A1 — "Company Narrative Split"

**Layout:** Split section — 55% content, 45% photo. Photo is an environmental portrait-style shot (or a photo of the crew at a high-end job site).

**Content:**
- Section label: "About A&A" in small tracked uppercase
- Headline: "Built on Standards" or similar in display font (40-48px)
- 2-3 paragraphs telling the company story — Areli's background, the standards commitment, the team
- A pull-quote highlighted in display italic ("We don't leave until it's right.")
- CTA: "Learn More About Us" or "Meet the Team"

**Interaction:**
- Content fades up on scroll-enter
- Photo has subtle parallax
- Pull-quote appears with a delayed fade-in after the surrounding text

**Mobile Adaptation:** Stacks — photo first (40vh), content below.

---

### Module A2 — "Oversized Quote Block"

**Layout:** Full-width section with a founder's statement. No photo. Typography IS the content.

**Content:**
- A single statement from Areli in large display italic (32-40px), centered
- Gold quote marks
- Below: "— Areli, Founder" as attribution
- Below that: a single paragraph about the company's standards and history in body text (centered, max 640px)

**Interaction:**
- Statement text reveals line by line on scroll
- Attribution fades in after text completes

**Mobile Adaptation:** Quote text scales to 24-28px. Paragraph text stays at 16px. All still centered.

---

## 4.7 SERVICE AREA MODULES

### Module SA1 — "Typographic Territory"

**Layout:** Full-width section. City names displayed in large display font at varying sizes, arranged in a clean horizontal flow. Largest city (Austin) at center in the biggest size, surrounding cities progressively smaller.

**Content:**
- City names: Austin, San Marcos, Kyle, Buda, Georgetown, Round Rock, Pflugerville, Hutto
- Section heading: "Where We Work" in tracked uppercase
- Supporting text: one line ("Serving the greater Austin metropolitan area")

**Interaction:**
- City names fade in with stagger on scroll-enter
- Hover on a city name: it subtly scales up (105%) and highlights in brand blue

**Mobile Adaptation:** City names arrange in a centered vertical list, each on its own line. Still in display font but scaled down.

---

### Module SA2 — "Minimal Map"

**Layout:** Split — stylized map on one side (60%), content on the other (40%).

**Content:**
- Custom-styled map (desaturated, brand-tinted) with pins at served cities
- Text side: heading, city list, and coverage note
- CTA: "Request a Quote in Your Area"

**Interaction:**
- Map pins drop in with a subtle bounce animation on scroll-enter (staggered)
- Hover on a pin: tooltip with city name

**Mobile Adaptation:** Map as full-width band (50vh) above, city list below.

---

## 4.8 EMPLOYMENT MODULES

### Module E1 — "Join the Team — Editorial Band"

**Layout:** Full-width horizontal band. Background photo of a professional crew at a job site (or a pristine workspace). Content overlaid.

**Content:**
- Headline: "We're Building a Team" in display font (40-48px)
- One sentence of supporting copy
- CTA: "See Open Positions →"

**Interaction:**
- Background photo has subtle parallax
- Content enters with a fade-up on scroll
- CTA has an arrow that animates right on hover

**Mobile Adaptation:** Photo height reduces to 40vh. Content centered over it. CTA full-width button.

---

### Module E2 — "Career Highlight Cards"

**Layout:** Two or three horizontal cards in a row, each highlighting a reason to work at A&A.

**Content per card:**
- Bold headline: "Steady Work" / "Professional Team" / "Growth Opportunities"
- 1-2 sentence description
- Background: subtle photo or solid color

**Interaction:**
- Cards stagger-enter on scroll
- Hover: card lifts with shadow increase

**Below the cards:** A single "Apply Now" CTA centered.

**Mobile Adaptation:** Cards stack vertically. Full width.

---

## 4.9 NAVIGATION MODULES

### Module N1 — "Minimal Fixed Bar"

**Layout:** Thin top bar with logo left, nav links center, CTA right. Fixed to top on scroll.

**Content:**
- Logo (wordmark or monogram)
- Nav links: Services, About, Careers (3 max — clean)
- Phone number (visible desktop, icon-only mobile)
- CTA button: "Get a Quote"

**Interaction:**
- On scroll: bar gains a subtle background fill and shadow (transparent → solid transition)
- Active page indicated by underline or weight change
- Mobile: hamburger icon → full-screen or slide-out nav panel

**Mobile nav panel:** Full-screen overlay with large, tappable nav items. Phone number prominent. "Get a Quote" as a full-width button.

---

### Module N2 — "Disappearing Nav"

**Layout:** Same as N1 but hides on scroll-down, reappears on scroll-up.

**Behavior:**
- Scrolling down (into content): nav slides up and disappears
- Scrolling up (seeking navigation): nav slides back down
- Always visible at page top
- This maximizes viewport for immersive photography sections

---

## 4.10 FOOTER MODULES

### Module F1 — "Functional Dark Footer"

**Layout:** Dark background. Three columns: branding, navigation, contact.

**Content:**
- Column 1: Logo + one-line company description
- Column 2: Quick links (Services, About, Careers, Privacy, Terms)
- Column 3: Phone (click-to-call), email, service area summary
- Bottom bar: copyright + legal links

**Interaction:** Links highlight on hover. Phone number has click-to-call.

**Mobile Adaptation:** Columns stack. Phone and email get prominent placement at top.

---

### Module F2 — "Minimal Signature Footer"

**Layout:** Ultra-minimal. Single centered block.

**Content:**
- Logo
- Phone • Email • Location (one line)
- Copyright line
- Nothing else

**The constraint is the design.** This footer says: we don't need to over-explain.

**Mobile Adaptation:** Same layout, naturally centered. Phone and email are tappable.

---

## 4.11 TRANSITIONAL MODULES

These are interstitial elements placed between major sections to break rhythm and create visual storytelling moments.

### Module X1 — "Full-Bleed Photo Break"

**Layout:** A full-width, full-viewport (or 60-70vh) photo with no text. Just a photograph of a pristine space. Acts as visual breathing room between content-heavy sections.

**Interaction:**
- Parallax scroll — image moves slower than the page
- Optional: very subtle text at bottom edge ("Post-construction detail, Austin TX" — like a photo caption)

---

### Module X2 — "Pull Quote Interstitial"

**Layout:** Full-width section with a single centered line of text in oversized display italic. No other elements.

**Content:** A brand statement or client quote. Example: *"Every surface. Every detail. Every time."*

**Interaction:** Text fades in on scroll-enter. Gold accent line draws beneath it.

---

### Module X3 — "Stat Callout"

**Layout:** A single stat displayed at massive scale (120-160px number) with a small label. Centered on the page with generous vertical padding.

**Content:** Example: "500+" with label "Projects Completed" — or "15+" with "Years in Austin"

**Interaction:** Number counts up from 0 on scroll-enter.

---

## 4.12 BEFORE/AFTER MODULE

### Module BA1 — "Comparison Slider"

**Layout:** Full-width section with a before/after photo pair. A vertical divider line separates the two images. User drags the divider to reveal more of either side.

**Content:**
- Section heading: "See the Difference" or "The A&A Standard"
- Before photo (left): a rough construction space, dust, debris
- After photo (right): the same space, immaculate, gleaming
- Draggable divider with a handle icon
- Below: project details (location, service type, timeline)

**Interaction:**
- Click and drag the divider handle horizontally
- Touch-drag on mobile
- Labels "Before" and "After" anchored to their respective sides
- Optional: below the slider, thumbnail row to switch between different project comparisons

**Mobile Adaptation:** Full width. Touch-optimized drag. Thumbnails become a horizontal scroll strip.

---

# 5. INTERACTION PATTERN GLOSSARY

These patterns are referenced throughout the variant definitions. They define HOW things move and respond, not what they look like.

| Pattern | Description | When to Use |
|---|---|---|
| **Fade-Up Reveal** | Element fades in (opacity 0→1) while translating up 20-30px. Duration 0.6s ease-out. | Default entrance animation for text and content blocks |
| **Slide-In** | Element slides in from a specified direction (left, right, bottom). Duration 0.5s ease. | Photo panels, split-screen content, nav panels |
| **Parallax Scroll** | Background element moves at 60-70% of scroll speed, creating depth. | Full-bleed photos, hero backgrounds |
| **Counter Animation** | Number counts from 0 to target value. Duration 1.5-2s, ease-out. | Stats, numbers, authority metrics |
| **Stagger Cascade** | Multiple sibling elements animate in sequentially with 0.1-0.2s delay between each. | Card grids, list items, timeline steps |
| **Accordion Expand** | Section expands vertically to reveal hidden content. Duration 0.4s ease. | Service lists, FAQ-style content |
| **Hover Lift** | Element translates up 2-4px and shadow increases on hover. Duration 0.2s. | Cards, buttons, interactive elements |
| **Scroll-Snap** | Sections snap to viewport boundaries as user scrolls. | Horizontal sliders, full-viewport sections |
| **Draw Line** | An SVG line or border animates its stroke from 0% to 100%. | Accent lines, timeline connectors, dividers |
| **Ken Burns** | Slow zoom (100→105%) on a photo over 8-15 seconds. | Hero backgrounds, testimonial photos |
| **Text Reveal** | Text appears word-by-word or line-by-line with stagger. | Headlines, testimonial quotes |
| **Panel Slide** | A panel slides in from the edge of the viewport. Duration 0.3s. | Quote form overlay, mobile nav |

---

# 6. FEATURE-TO-SECTION INTEGRATION MAP

Every feature from the master spec must have a home in the website. This map ensures nothing is orphaned.

| Master Spec Feature | Website Integration | Module(s) |
|---|---|---|
| **Quote Request Form** | Inline form section + floating panel trigger from every CTA | Q1, Q2, or Q3 |
| **Immediate SMS to Areli** | Backend — form submission triggers Twilio SMS. User sees success confirmation. | Part of quote form submit flow |
| **Click-to-Call** | Phone number in nav, hero, quote section, and footer. All click-to-call on mobile. | N1/N2, all hero modules, Q1/Q3, F1/F2 |
| **Services (5 types)** | Dedicated showcase sections with editorial presentation | S1, S2, or S3 |
| **Post-Construction Cleaning** | Featured as primary/largest service in service modules | S1/S2/S3 |
| **Final Clean** | Individual service entry | S1/S2/S3 |
| **Commercial Cleaning** | Individual service entry | S1/S2/S3 |
| **Move-In/Move-Out** | Individual service entry | S1/S2/S3 |
| **Windows & Power Wash** | Individual service entry | S1/S2/S3 |
| **Licensed & Insured** | Trust strip in hero + authority bar + footer | T1, hero modules, F1 |
| **Bilingual Crew** | Trust strip mention + about section detail | T1, hero modules, A1 |
| **Years of Experience** | Authority bar stat | T1, X3 |
| **Project Count** | Authority bar stat | T1, X3 |
| **Testimonials (GC quotes)** | Editorial testimonial or stacked proof section | T2, T3, X2 |
| **Before/After Photos** | Interactive comparison slider | BA1 |
| **How It Works (4 steps)** | Process module showing the engagement journey | P1, P2, or P3 |
| **Company Story / Areli** | About/narrative section | A1 or A2 |
| **Service Area (Austin metro)** | Geographic coverage display | SA1 or SA2 |
| **Employment / Hiring** | Career recruitment section with CTA to application | E1 or E2 |
| **Lead Pipeline Integration** | Form → pipeline is backend. Site shows: form + confirmation + phone CTA. | Q1/Q2/Q3 |
| **GC/PM as Primary Audience** | Entire tone, content, and UX speaks to construction professionals | All modules |
| **Fast Response Promise** | Copy element: "We call back within the hour" in form sections | Q1, Q3 |
| **Austin Metro Coverage** | Service area module + footer + trust strip | SA1/SA2, F1, hero trust strip |


---

# 7. VARIANT A — "THE ARCHITECTURAL NARRATIVE"
## Full-viewport editorial storytelling with immersive photography

### Concept

The page unfolds like walking through a pristine, just-completed luxury building. Each section fills the viewport. Photography dominates — big, atmospheric, immersive. Content is sparse and intentional. The user scrolls through a curated story: who A&A is, what they do, how they do it, and why they're the best. Every scroll feels like entering a new room.

### Narrative Arc

The user journey follows a deliberate emotional sequence:
1. **Awe** (Hero) — Full-screen immersive photo. A single bold statement.
2. **Credibility** (Authority) — Numbers that signal scale and reliability.
3. **Exploration** (Services) — Each service is an editorial spread they scroll through.
4. **Proof** (Before/After) — Interactive visual proof of quality.
5. **Voice** (Testimonial) — A real client validates everything above.
6. **Understanding** (Process) — The 4-step engagement journey, revealed on scroll.
7. **Connection** (About) — Areli's story and the standards commitment.
8. **Reach** (Service Area) — Where they work.
9. **Action** (Quote Form) — The conversion moment.
10. **Opportunity** (Employment) — A recruitment beat before the footer.

### Section Flow & Module Selection

```
┌─────────────────────────────────────────────────────────┐
│ MODULE N2 — Disappearing Nav                            │
│ Hides on scroll-down, returns on scroll-up.             │
│ Maximizes immersive photography experience.             │
│ Logo (left) • Services / About / Careers (center)       │
│ Phone icon + "Get a Quote" button (right)               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE H1 — Cinematic Immersion                         │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ ░░░░░  Full-viewport background video/photo  ░░░░░░░░  │
│ ░░░░░  (Modern glass-walled office lobby,    ░░░░░░░░  │
│ ░░░░░   natural light, contemporary          ░░░░░░░░  │
│ ░░░░░   furniture, immaculate surfaces)      ░░░░░░░░  │
│ ░░░░░                                        ░░░░░░░░  │
│ ░░░░░                                        ░░░░░░░░  │
│ ░░░░░                                        ░░░░░░░░  │
│ ░░░░░     Every Surface.                     ░░░░░░░░  │
│ ░░░░░     Every Detail.                      ░░░░░░░░  │
│ ░░░░░     Every Time.                        ░░░░░░░░  │
│ ░░░░░            [ 80-120px display font ]   ░░░░░░░░  │
│ ░░░░░                                        ░░░░░░░░  │
│ ░░░░░  Post-construction & commercial        ░░░░░░░░  │
│ ░░░░░  cleaning across the Austin metro.     ░░░░░░░░  │
│ ░░░░░                                        ░░░░░░░░  │
│ ░░░░░  [Request a Quote]   Call: (512)...    ░░░░░░░░  │
│ ░░░░░                                        ░░░░░░░░  │
│ ░░░░░ Licensed & Insured • Austin Metro •    ░░░░░░░░  │
│ ░░░░░ Bilingual Crew                         ░░░░░░░░  │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                         │
│ Ken Burns slow zoom on background image.                │
│ Content fades up on load. Parallax on scroll.           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE T1 — Authority Bar                               │
│                                                         │
│   15+            500+          Licensed        100%     │
│   Years        Projects       & Insured       On-Time   │
│                                                         │
│ Full-width strip. Numbers at 72-96px. Count-up          │
│ animation on scroll-enter. Staggered 0.2s.              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE S1 — Editorial Spreads (×5 services)             │
│                                                         │
│ SPREAD 1: Post-Construction                             │
│ ┌──────────────────────┬──────────────────────────┐     │
│ │                      │                          │     │
│ │   POST-              │  ░░░░░░░░░░░░░░░░░░░░░  │     │
│ │   CONSTRUCTION       │  ░░ Photo: freshly     ░░│     │
│ │   CLEAN              │  ░░ completed          ░░│     │
│ │   [48-64px display]  │  ░░ commercial space   ░░│     │
│ │                      │  ░░ with exposed       ░░│     │
│ │   Rough and final    │  ░░ concrete and       ░░│     │
│ │   clean for new      │  ░░ modern fixtures    ░░│     │
│ │   construction...    │  ░░░░░░░░░░░░░░░░░░░░░  │     │
│ │                      │                          │     │
│ │   • Multifamily      │                          │     │
│ │   • Commercial       │       [photo 60-70%      │     │
│ │   • Schools/offices  │        of width]         │     │
│ │                      │                          │     │
│ │   [Get a Quote →]    │                          │     │
│ │   [content 30-40%]   │                          │     │
│ └──────────────────────┴──────────────────────────┘     │
│                                                         │
│ SPREAD 2: Final Clean (ALTERNATES — photo LEFT)         │
│ ┌──────────────────────────┬──────────────────────┐     │
│ │  ░░░░░░░░░░░░░░░░░░░░░  │                      │     │
│ │  ░░ Photo: pristine   ░░ │   FINAL              │     │
│ │  ░░ apartment unit,   ░░ │   CLEAN              │     │
│ │  ░░ sunlight on       ░░ │                      │     │
│ │  ░░ hardwood floors   ░░ │   Detail-level       │     │
│ │  ░░░░░░░░░░░░░░░░░░░░░  │   cleaning for...    │     │
│ │                          │                      │     │
│ │                          │   [Get a Quote →]    │     │
│ └──────────────────────────┴──────────────────────┘     │
│                                                         │
│ SPREAD 3: Commercial (photo RIGHT)                      │
│ SPREAD 4: Move-In/Move-Out (photo LEFT)                 │
│ SPREAD 5: Windows & Power Wash (photo RIGHT)            │
│                                                         │
│ Each spread scroll-reveals: photo slides in from        │
│ its side, content fades up from opposite side.          │
│ Photos have slight parallax offset.                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE X1 — Full-Bleed Photo Break                      │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ ░░░░░ A stunning, full-viewport photo of a ░░░░░░░░░  │
│ ░░░░░ gleaming modern apartment lobby with ░░░░░░░░░  │
│ ░░░░░ marble floors and designer furniture ░░░░░░░░░  │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ Parallax. No text. Visual breathing room.               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE BA1 — Before/After Comparison Slider             │
│                                                         │
│  "See the Difference"                                   │
│                                                         │
│ ┌─────────────────────┼─────────────────────┐           │
│ │                     │                     │           │
│ │   BEFORE            │|        AFTER        │           │
│ │   (rough            │| (same space,        │           │
│ │    construction     [drag]  pristine,      │           │
│ │    space, dust,      │|    gleaming)        │           │
│ │    debris)           │|                     │           │
│ │                     │|                     │           │
│ └─────────────────────┼─────────────────────┘           │
│                                                         │
│ Draggable divider. Thumbnails below to switch           │
│ between project examples. Touch-optimized.              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE T2 — Editorial Testimonial                       │
│                                                         │
│             ❝                                           │
│   "A&A Cleaning has been our go-to subcontractor        │
│    for three years. Reliable, detail-oriented,          │
│    and always on schedule."                             │
│             [28-36px display italic, centered]          │
│                                                         │
│    — Project Manager, [Construction Company]            │
│             ── gold line ──                              │
│                                                         │
│ Text reveals line by line on scroll-enter.              │
│ Auto-rotates between 2-3 quotes (crossfade, 6s).       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE P1 — Vertical Scroll Timeline                    │
│                                                         │
│        "How It Works"                                   │
│                                                         │
│            │                                            │
│     ┌──────┤  ① Request a Quote                        │
│     │ Photo│  Submit our quick form or call             │
│     │      │  us directly.                             │
│     └──────┤                                            │
│            │                                            │
│            ├──────┐ ② We Assess                        │
│            │ Photo│ We review the scope and provide     │
│            │      │ a detailed estimate.                │
│            ├──────┘                                     │
│            │                                            │
│     ┌──────┤  ③ We Clean                               │
│     │ Photo│  Our insured crew handles every            │
│     │      │  detail with proven standards.             │
│     └──────┤                                            │
│            │                                            │
│            ├──────┐ ④ You Walk Through                  │
│            │ Photo│ Final QA review before we            │
│            │      │ hand off the finished space.         │
│            ├──────┘                                     │
│            │                                            │
│                                                         │
│ Steps alternate left/right of central axis.             │
│ Line draws downward as user scrolls.                    │
│ Active step highlighted; others slightly faded.         │
│ Each step slides in from its side on scroll-enter.      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE A1 — Company Narrative Split                     │
│                                                         │
│ ┌──────────────────────────┬────────────────────┐       │
│ │                          │                    │       │
│ │  ABOUT A&A               │  ░░░░░░░░░░░░░░░  │       │
│ │  [small tracked caps]    │  ░░ Photo of     ░░│       │
│ │                          │  ░░ Areli or     ░░│       │
│ │  Built on Standards      │  ░░ the crew at  ░░│       │
│ │  [40-48px display]       │  ░░ a high-end   ░░│       │
│ │                          │  ░░ job site     ░░│       │
│ │  A&A Cleaning was built  │  ░░░░░░░░░░░░░░░  │       │
│ │  on one principle: the   │                    │       │
│ │  job isn't done until    │    [45% width]     │       │
│ │  every detail meets the  │                    │       │
│ │  standard...             │                    │       │
│ │                          │                    │       │
│ │  "We don't leave until   │                    │       │
│ │   it's right."           │                    │       │
│ │   [display italic pull   │                    │       │
│ │    quote, highlighted]   │                    │       │
│ │                          │                    │       │
│ │  [Learn More About Us →] │                    │       │
│ │  [55% width]             │                    │       │
│ └──────────────────────────┴────────────────────┘       │
│                                                         │
│ Content fades up. Photo has subtle parallax.            │
│ Pull-quote appears with delayed fade-in.                │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE SA1 — Typographic Territory                      │
│                                                         │
│          WHERE WE WORK                                  │
│                                                         │
│              AUSTIN                                     │
│         Round Rock    Georgetown                        │
│       Kyle   Buda   Pflugerville   Hutto                │
│              San Marcos                                 │
│                                                         │
│  City names in display font at varying sizes.           │
│  Austin largest/centered. Others radiate outward.       │
│  Stagger fade-in on scroll. Hover highlights in blue.   │
│                                                         │
│  "Serving the greater Austin metropolitan area"         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE Q1 — Split Conversation (Quote Form)             │
│                                                         │
│ ┌──────────────────────────┬────────────────────┐       │
│ │                          │                    │       │
│ │  ░░░░░░░░░░░░░░░░░░░░░  │  Request a Quote   │       │
│ │  ░░ Photo: completed  ░░ │                    │       │
│ │  ░░ luxury apartment  ░░ │  Tell us about     │       │
│ │  ░░ interior with     ░░ │  your project.     │       │
│ │  ░░ modern furniture  ░░ │  We call back      │       │
│ │  ░░ and clean lines   ░░ │  within the hour.  │       │
│ │  ░░░░░░░░░░░░░░░░░░░░░  │                    │       │
│ │                          │  [Name          ]  │       │
│ │  "Let's Talk About       │  [Company       ]  │       │
│ │   Your Project"          │  [Phone         ]  │       │
│ │   [display font overlay] │  [Email         ]  │       │
│ │                          │  [Service Type ▾]  │       │
│ │  Or call now:            │  [Timeline     ▾]  │       │
│ │  (512) XXX-XXXX          │  [Description    ]  │       │
│ │  [click-to-call]         │                    │       │
│ │                          │  [Request a Quote] │       │
│ │                          │  [full-width btn]  │       │
│ │                          │                    │       │
│ │  [50% width]             │  [50% width]       │       │
│ └──────────────────────────┴────────────────────┘       │
│                                                         │
│ Inline validation. Submit → loading → success message.  │
│ Mobile: photo band above, form below full-width.        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE E1 — Join the Team (Editorial Band)              │
│                                                         │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ ░░░  Background: crew at a high-end job site  ░░░░░░  │
│ ░░░                                            ░░░░░  │
│ ░░░     We're Building a Team                  ░░░░░  │
│ ░░░     [40-48px display]                      ░░░░░  │
│ ░░░                                            ░░░░░  │
│ ░░░     Professional cleaning careers in       ░░░░░  │
│ ░░░     the Austin metro area.                 ░░░░░  │
│ ░░░                                            ░░░░░  │
│ ░░░     [See Open Positions →]                 ░░░░░  │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                         │
│ Background photo parallax. Content fades up.            │
│ CTA arrow animates right on hover.                      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE F1 — Functional Dark Footer                      │
│                                                         │
│ Three columns: Brand | Navigation | Contact             │
│ Phone (click-to-call) + email + coverage                │
│ Copyright bar at bottom                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Variant A — Key UX Characteristics

| Aspect | Approach |
|---|---|
| **Scroll feel** | Long, cinematic, immersive. Each section feels like a new "room." |
| **Photography density** | Very high — photos in hero, every service spread, photo breaks, B/A slider, about, employment, quote form |
| **Typography scale** | Oversized headlines (80-120px hero, 48-64px services) as visual anchors |
| **Whitespace** | Generous within sections. Tight between sections (full-bleed photos create natural separation). |
| **CTA strategy** | Hero dual CTA → each service spread has its own CTA → testimonial builds desire → quote form converts. Floating panel (Q2) triggered by nav "Get a Quote" button at any point. |
| **Interaction density** | High — parallax, scroll-triggered reveals, Ken Burns, counter animations, line-draw, text reveals |
| **Page length** | Long (15+ scroll-heights) — this is a scroll-story experience |
| **Best for** | Audiences who want to be impressed. When photography assets are strong. Maximum editorial impact. |
| **Conversion path** | Multiple touchpoints: hero CTA, 5 service CTAs, nav button (triggers Q2 floating panel), inline quote form (Q1), click-to-call in nav + hero + quote section + footer |

### Persistent CTA Layer

In Variant A, the "Get a Quote" button in the nav bar triggers Module Q2 (Floating Form Panel) rather than scrolling to the inline form. This means the quote form is accessible from ANY point on the page without losing scroll position. The inline Q1 form at the bottom serves users who scroll the full journey.

---

# 8. VARIANT B — "THE GALLERY EXPERIENCE"
## Photography-first with interactive exploration and portfolio energy

### Concept

The page is structured like a curated portfolio. Photography dominates with interactive elements that invite exploration — hover to reveal, drag to compare, swipe to discover. The experience feels like browsing a luxury showroom. Content is discovered, not presented. This variant rewards engagement and curiosity.

### Narrative Arc

1. **Statement** (Hero) — A bold split-screen declaration. Typography vs. photography.
2. **Discovery** (Services) — Hoverable gallery cards that reveal depth on interaction.
3. **Evidence** (Before/After) — Interactive proof of transformation.
4. **Scale** (Stats) — Oversized typographic numbers communicating track record.
5. **Validation** (Testimonials) — Stacked, layered client voices.
6. **Journey** (Process) — Sliding horizontal panels showing the engagement flow.
7. **Story** (About) — Founder's statement as a typographic moment.
8. **Territory** (Service Area) — Stylized map with animated pins.
9. **Action** (Quote Form) — Minimal, focused conversion point.
10. **Recruitment** (Employment) — Career cards with reasons to join.

### Section Flow & Module Selection

```
┌─────────────────────────────────────────────────────────┐
│ MODULE N1 — Minimal Fixed Bar                           │
│ Stays visible at all times. Gains background fill       │
│ and shadow on scroll (transparent → solid).             │
│ Logo (left) • Services / About / Careers (center)       │
│ Phone number (desktop) + "Get a Quote" (right)          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE H2 — Split Statement                             │
│                                                         │
│ ┌──────────────────────┬────────────────────────────┐   │
│ │                      │                            │   │
│ │ CONSTRUCTION         │  ░░░░░░░░░░░░░░░░░░░░░░░  │   │
│ │ CLEANING             │  ░░                     ░░ │   │
│ │ SPECIALISTS          │  ░░  Photo: modern      ░░ │   │
│ │ [small tracked caps] │  ░░  high-rise          ░░ │   │
│ │                      │  ░░  apartment          ░░ │   │
│ │ Standards-           │  ░░  interior —         ░░ │   │
│ │ Driven               │  ░░  floor-to-ceiling   ░░ │   │
│ │ Facility             │  ░░  windows, warm      ░░ │   │
│ │ Care.                │  ░░  wood, clean lines   ░░ │   │
│ │ [large display,      │  ░░                     ░░ │   │
│ │  stacked 2-3 lines]  │  ░░  (bleeds to right   ░░ │   │
│ │                      │  ░░   edge, no padding)  ░░ │   │
│ │ Post-construction    │  ░░                     ░░ │   │
│ │ & commercial...      │  ░░░░░░░░░░░░░░░░░░░░░░░  │   │
│ │                      │                            │   │
│ │ [Request a Quote]    │         [55% width]        │   │
│ │ [Call: (512)...]     │                            │   │
│ │                      │                            │   │
│ │ ✓Licensed ✓Insured   │                            │   │
│ │ ✓Bilingual           │                            │   │
│ │                      │                            │   │
│ │    [45% width]       │                            │   │
│ └──────────────────────┴────────────────────────────┘   │
│                                                         │
│ Content slides in from left. Photo reveals from center. │
│ Photo zooms subtly (102%) on hover.                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE S2 — Gallery Cards with Hover Depth              │
│                                                         │
│  "Our Services"                                         │
│  [section heading, 40px display]                        │
│                                                         │
│ ┌──────────────────────────┬───────────────────┐        │
│ │                          │                   │        │
│ │ ░░░░░░░░░░░░░░░░░░░░░░  │ ░░░░░░░░░░░░░░░░ │        │
│ │ ░░  POST-             ░░ │ ░░  FINAL      ░░ │        │
│ │ ░░  CONSTRUCTION      ░░ │ ░░  CLEAN      ░░ │        │
│ │ ░░  CLEAN             ░░ │ ░░             ░░ │        │
│ │ ░░                    ░░ │ ░░  [gradient   ░░ │        │
│ │ ░░  [gradient overlay ░░ │ ░░   overlay +  ░░ │        │
│ │ ░░   + service name]  ░░ │ ░░   name]     ░░ │        │
│ │ ░░░░░░░░░░░░░░░░░░░░░░  │ ░░░░░░░░░░░░░░░░ │        │
│ │   [60% of row width]    │  [40% of row]     │        │
│ └──────────────────────────┴───────────────────┘        │
│ ┌────────────────┬────────────────┬────────────────┐    │
│ │ ░░░░░░░░░░░░░  │ ░░░░░░░░░░░░░  │ ░░░░░░░░░░░░░  │    │
│ │ ░░COMMERCIAL░░ │ ░░ MOVE-IN/ ░░ │ ░░ WINDOWS  ░░ │    │
│ │ ░░  CLEANING░░ │ ░░ MOVE-OUT ░░ │ ░░ & POWER  ░░ │    │
│ │ ░░░░░░░░░░░░░  │ ░░░░░░░░░░░░░  │ ░░ WASH     ░░ │    │
│ │   [33% each]   │               │ ░░░░░░░░░░░░░  │    │
│ └────────────────┴────────────────┴────────────────┘    │
│                                                         │
│ STAGGERED GRID — not equal columns.                     │
│ Top row: 60/40 split (post-construction is primary).    │
│ Bottom row: 3 equal.                                    │
│                                                         │
│ Each card is photo-dominant. Service name in display     │
│ font overlaid at bottom with gradient.                  │
│                                                         │
│ HOVER STATE (desktop):                                  │
│ ┌──────────────────────────┐                            │
│ │ ░░░░░░░░░░░░░░░░░░░░░░  │                            │
│ │ ░░  Photo (zooms to   ░░ │                            │
│ │ ░░  103%)             ░░ │                            │
│ │ ┌────────────────────────┤  ← panel slides up         │
│ │ │ POST-CONSTRUCTION      │                            │
│ │ │ CLEAN                  │                            │
│ │ │                        │                            │
│ │ │ Rough and final clean  │                            │
│ │ │ for new construction   │                            │
│ │ │ • Multifamily          │                            │
│ │ │ • Commercial           │                            │
│ │ │ • Schools              │                            │
│ │ │                        │                            │
│ │ │ [Get a Quote →]        │                            │
│ │ └────────────────────────┘                            │
│ └──────────────────────────┘                            │
│                                                         │
│ Mobile: single column stack, tap to toggle panel.       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE BA1 — Before/After Comparison Slider             │
│                                                         │
│ Same implementation as Variant A.                       │
│ Full-width. Drag divider. Project thumbnails below.     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE X3 — Stat Callout (×3, sequential)               │
│                                                         │
│ Three stat callouts displayed as sequential scroll       │
│ moments, NOT a grid. Each takes significant vertical     │
│ space with one massive number centered:                  │
│                                                         │
│               15+                                       │
│         Years of Experience                             │
│         [number at 120-160px display font]              │
│                                                         │
│ — scroll —                                              │
│                                                         │
│               500+                                      │
│          Projects Completed                             │
│                                                         │
│ — scroll —                                              │
│                                                         │
│              100%                                       │
│         Licensed & Insured                              │
│                                                         │
│ Each number counts up on scroll-enter.                  │
│ Generous vertical padding. The scale IS the statement.  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE T3 — Stacked Social Proof                        │
│                                                         │
│ Top: 2-3 testimonial cards with fanned/overlapping      │
│ layout (1-2° rotation on each)                          │
│                                                         │
│  ┌───────────────────┐                                  │
│  │ ★★★★★             │                                  │
│  │ "Reliable, detail │ ┌───────────────────┐            │
│  │  oriented, always │ │ ★★★★★             │            │
│  │  on schedule."    │ │ "Best cleaning    │            │
│  │  — PM, ABC Const. │ │  sub we've worked ├──┐         │
│  └───────────────────┘ │  with."           │  │         │
│                        │  — Mgr, XYZ Dev   │  │         │
│                        └───────────────────┘  │         │
│                                               │         │
│ Cards cascade in on scroll (stagger 0.2s).    │         │
│ Hover: card lifts, comes to full opacity.     │         │
│                                                         │
│ Bottom: Trust badge strip                               │
│ Licensed & Insured • Background Checked •               │
│ Bilingual Teams • Austin Metro Coverage                 │
│ [badges slide in from below as a row]                   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE P2 — Horizontal Panel Slider                     │
│                                                         │
│  "How It Works"                                         │
│                                                         │
│ ◀ ┌─────────────────────────────────────────┐ ▶         │
│   │                                         │           │
│   │  ①                                      │           │
│   │  [96px display font, top-left]          │           │
│   │                                         │           │
│   │  Request a Quote                        │           │
│   │  [step title, bold]                     │           │
│   │                                         │           │
│   │  Submit our quick form or call us       │           │
│   │  directly. We respond within the hour.  │           │
│   │                                         │           │
│   │  ░░░ background photo at 70% opacity ░░░│           │
│   │  ░░░ (laptop with contact form)      ░░░│           │
│   │                                         │           │
│   └─────────────────────────────────────────┘           │
│                     ● ○ ○ ○                             │
│                                                         │
│ Each panel: 80% viewport width. Scroll-snap.            │
│ Swipe on mobile, arrows + keyboard on desktop.          │
│ Off-center panels scaled to 95% and dimmed.             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE A2 — Oversized Quote Block                       │
│                                                         │
│                                                         │
│                  ❝                                      │
│   "We don't leave until every surface meets             │
│    the standard. That's not a slogan —                  │
│    that's how we built this company."                   │
│    [32-40px display italic, centered]                   │
│                                                         │
│    — Areli, Founder                                     │
│                                                         │
│    A&A Cleaning was built on one principle:             │
│    the job isn't done until every detail                │
│    meets the standard. [body text, max 640px]           │
│                                                         │
│                                                         │
│ Statement reveals line by line. Attribution              │
│ fades in after. No photo — typography IS it.             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE SA2 — Minimal Map                                │
│                                                         │
│ ┌────────────────────────────┬──────────────────┐       │
│ │                            │                  │       │
│ │  ░░░░░░░░░░░░░░░░░░░░░░   │  WHERE WE WORK   │       │
│ │  ░░ Desaturated,        ░░ │                  │       │
│ │  ░░ brand-tinted map    ░░ │  • Austin        │       │
│ │  ░░ with pins at each   ░░ │  • Round Rock    │       │
│ │  ░░ served city         ░░ │  • Georgetown    │       │
│ │  ░░                     ░░ │  • Kyle          │       │
│ │  ░░ Pins drop in with   ░░ │  • Buda          │       │
│ │  ░░ subtle bounce       ░░ │  • Pflugerville  │       │
│ │  ░░ (staggered)         ░░ │  • Hutto         │       │
│ │  ░░░░░░░░░░░░░░░░░░░░░░   │  • San Marcos    │       │
│ │                            │                  │       │
│ │    [60% width]             │  [Request a Quote│       │
│ │                            │   in Your Area]  │       │
│ └────────────────────────────┴──────────────────┘       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE Q3 — Minimal Inline Form                         │
│                                                         │
│                                                         │
│                                                         │
│              Ready?                                     │
│              [48-64px display font]                     │
│                                                         │
│              ── gold line ──                             │
│                                                         │
│              [Name                     ]                │
│              [Phone                    ]                │
│              [Service Type           ▾ ]                │
│              [Brief Description        ]                │
│              [                          ]               │
│                                                         │
│              [Request a Quote]                          │
│              [full-width, prominent]                    │
│                                                         │
│              Or call: (512) XXX-XXXX                    │
│                                                         │
│                                                         │
│                                                         │
│ Max-width 520px. Centered. Extreme whitespace           │
│ around the form IS the design. Bottom-border-only       │
│ inputs. Label float animation on focus.                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE E2 — Career Highlight Cards                      │
│                                                         │
│ ┌──────────────────┬──────────────────┬─────────────┐   │
│ │                  │                  │             │   │
│ │  Steady          │  Professional    │  Growth     │   │
│ │  Work            │  Team            │             │   │
│ │                  │                  │  Room to    │   │
│ │  Consistent      │  Work alongside  │  advance    │   │
│ │  projects across │  experienced     │  within a   │   │
│ │  the Austin      │  professionals   │  growing    │   │
│ │  metro area.     │  who care about  │  company.   │   │
│ │                  │  quality.        │             │   │
│ └──────────────────┴──────────────────┴─────────────┘   │
│                                                         │
│              [Apply Now →]                              │
│                                                         │
│ Cards stagger-enter. Hover lift with shadow.            │
│ Mobile: stack vertically.                               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE F1 — Functional Dark Footer                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Variant B — Key UX Characteristics

| Aspect | Approach |
|---|---|
| **Scroll feel** | Varied rhythm. Dense gallery sections → spacious stat moments → interactive sliders. Keeps the user engaged through variety. |
| **Photography density** | High in service gallery cards + B/A slider + hero. Lower in stats/process/form sections. |
| **Typography scale** | Massive stat numbers (120-160px). Bold hero stacking. Service names as overlays. Typography does heavy lifting. |
| **Whitespace** | Strategic contrast — tight in gallery grid, extreme around stats and form. The contrast creates rhythm. |
| **CTA strategy** | Hero CTA → hover-reveal CTAs on each service card → inline quote form at bottom. Nav "Get a Quote" scrolls to Q3 section. |
| **Interaction density** | High — hover reveals on cards, drag slider, horizontal panel swipe, counter animations, map pin drops, card cascades |
| **Page length** | Medium-long. Stat callouts add vertical space but the gallery grid and horizontal slider compress content. |
| **Best for** | Audiences who want to explore. When you want an interactive, portfolio-like feel. Visual sophistication + engagement. |
| **Conversion path** | Hero CTA, service card CTAs (hover-revealed), service area CTA, inline form (Q3), click-to-call in nav + hero + form + footer |

### Interaction Highlight: Service Cards

The gallery cards are the signature interaction in Variant B. The staggered grid layout (60/40 top, thirds bottom) breaks the monotony of equal-column grids. Post-Construction gets the largest card (60% width) because it's the primary service — this is intentional visual hierarchy. The hover-reveal pattern creates a sense of discovery: you see beautiful spaces, then interact to learn what A&A does in those spaces.

---

# 9. VARIANT C — "PRECISION & SPACE"
## Maximum whitespace, typography-driven, minimalist sophistication

### Concept

Every element breathes. Whitespace is the primary design material. Typography carries the entire visual weight — large, confident, architectural. Photography is used sparingly but with maximum impact when it appears. The page whispers rather than shouts, and the restraint communicates: this company is precise, intentional, and in control. This variant signals sophistication through what it *doesn't* show.

### Narrative Arc

1. **Confidence** (Hero) — A massive typographic statement. No image. The words ARE the design.
2. **Precision** (Services) — An expandable list. Clean, structured, sophisticated.
3. **Interruption** (Photo Break) — One stunning photo. Full-bleed. Stops the scroll.
4. **Evidence** (Before/After) — A single curated comparison. Not a gallery — a moment.
5. **Voice** (Pull Quote) — A testimonial woven into the flow, not isolated.
6. **Process** — Sparse 4-column grid. No decoration. Alignment IS the design.
7. **Authority** (Stats) — One massive stat. Then another. Scroll-triggered.
8. **Story** (About) — Founder's statement as typography.
9. **Territory** — A single line of text listing cities. The simplicity IS the statement.
10. **Action** (Form) — Minimal, centered, surrounded by nothing.
11. **Recruitment** — One line. One CTA. Done.

### Section Flow & Module Selection

```
┌─────────────────────────────────────────────────────────┐
│ MODULE N2 — Disappearing Nav                            │
│ Hides on scroll-down. Clean and unobtrusive.            │
│ When visible: ultra-minimal. Logo, 3 links, CTA.        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE H3 — Typographic Statement                       │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│        Every                                            │
│        Surface.                                         │
│        Every                                            │
│        Detail.                                          │
│        [100-140px display font]                         │
│        [One or two words per line]                      │
│        [Letters stagger-reveal on load]                 │
│                                                         │
│        ── gold line (60px) ──                            │
│                                                         │
│        Post-construction & commercial cleaning          │
│        across the Austin metro area.                    │
│        [body text, 18px, single line]                   │
│                                                         │
│        [Request a Quote]   (512) XXX-XXXX               │
│        [small, refined CTAs]                            │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│ No background image. The typography commands the        │
│ viewport. The emptiness communicates confidence.        │
│                                                         │
│ Below the fold: top 20% of a large photo peeks in,     │
│ inviting the scroll.                                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE S3 — Expandable Service List                     │
│                                                         │
│  OUR SERVICES                                           │
│  [tracked caps label]                                   │
│                                                         │
│  ────────────────────────────────────────────────       │
│  Post-Construction Clean          New Construction  →   │
│  [36-48px display font]                                 │
│  ────────────────────────────────────────────────       │
│  Final Clean                    Vacant Properties   →   │
│  ────────────────────────────────────────────────       │
│  Commercial Cleaning              Office/Retail     →   │
│  ────────────────────────────────────────────────       │
│  Move-In / Move-Out                 Unit Turnover   →   │
│  ────────────────────────────────────────────────       │
│  Windows & Power Wash                  Exteriors    →   │
│  ────────────────────────────────────────────────       │
│                                                         │
│ ON CLICK/EXPAND (accordion):                            │
│  ────────────────────────────────────────────────       │
│  Post-Construction Clean          New Construction  →   │
│                                                         │
│  ┌────────────────────────────────────────────────┐     │
│  │                                                │     │
│  │  ░░░░░░░░░░░░░░░░  Rough and final clean for  │     │
│  │  ░░ Photo:      ░░  new construction projects. │     │
│  │  ░░ completed   ░░                             │     │
│  │  ░░ commercial  ░░  • Multifamily buildings    │     │
│  │  ░░ space       ░░  • Commercial offices       │     │
│  │  ░░             ░░  • Schools & institutional  │     │
│  │  ░░ (slides in  ░░                             │     │
│  │  ░░  from left) ░░  [Request a Quote →]        │     │
│  │  ░░░░░░░░░░░░░░░░                              │     │
│  │                                                │     │
│  └────────────────────────────────────────────────┘     │
│  ────────────────────────────────────────────────       │
│  Final Clean                    Vacant Properties   →   │
│  ────────────────────────────────────────────────       │
│                                                         │
│ Accordion behavior. Opening one closes the last.        │
│ Smooth height animation (0.4s). Photo Ken Burns         │
│ while expanded.                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE X1 — Full-Bleed Photo Break                      │
│                                                         │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ ░░░░░ A single stunning photograph: modern        ░░░  │
│ ░░░░░ apartment building lobby, polished marble,  ░░░  │
│ ░░░░░ floor-to-ceiling glass, designer seating    ░░░  │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                         │
│ 60-70vh. No text. Parallax. The photo is the content.   │
│ This is the ONLY major photo outside of the service     │
│ accordion — its rarity gives it maximum impact.         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE BA1 — Before/After (Curated Single Moment)       │
│                                                         │
│  "The A&A Standard"                                     │
│  [section heading, display font]                        │
│                                                         │
│ ┌─────────────────────┼─────────────────────┐           │
│ │                     │                     │           │
│ │   BEFORE            │|      AFTER          │           │
│ │                    [drag]                  │           │
│ │                     │|                     │           │
│ └─────────────────────┼─────────────────────┘           │
│                                                         │
│ ONE before/after pair. Not a gallery. Curated.          │
│ Choose the most dramatic transformation.                │
│ The restraint says: we don't need to oversell.          │
│                                                         │
│ Below: project type + location in small caption text.   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE X2 — Pull Quote Interstitial                     │
│                                                         │
│                                                         │
│        "Reliable, detail-oriented,                      │
│         and always on schedule."                        │
│                                                         │
│         — Project Manager, [Company]                    │
│                                                         │
│         ── gold line ──                                  │
│                                                         │
│                                                         │
│ One line. Centered. Oversized display italic.           │
│ Fades in on scroll-enter. No card, no section           │
│ decoration — just words in space. Woven into            │
│ the flow between other content.                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE P3 — Sparse Grid (Process)                       │
│                                                         │
│  HOW IT WORKS                                           │
│  [tracked caps label]                                   │
│                                                         │
│    1               2               3               4    │
│   [80px]          [80px]          [80px]          [80px] │
│                                                         │
│   Request         We              We              You   │
│   a Quote         Assess          Clean           Walk  │
│                                                   Thru  │
│   Submit our      We review       Our crew        Final │
│   form or call.   the scope.      handles it.     QA.   │
│                                                         │
│ No connecting lines. No circles. No decoration.         │
│ The alignment and whitespace CREATE the relationship.   │
│ Columns fade in sequentially (0.15s stagger).           │
│ Mobile: 2×2 grid.                                       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE X3 — Stat Callout (×2, sequential)               │
│                                                         │
│                                                         │
│                                                         │
│                   15+                                   │
│             Years in Austin                             │
│             [120-160px number, centered]                 │
│                                                         │
│                                                         │
│                                                         │
│ — generous scroll space —                               │
│                                                         │
│                                                         │
│                                                         │
│                   500+                                  │
│           Projects Completed                            │
│                                                         │
│                                                         │
│                                                         │
│ Only two stats. The restraint makes each one            │
│ more powerful. Counter animation on scroll-enter.       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE A2 — Oversized Quote Block                       │
│                                                         │
│                                                         │
│              ❝                                          │
│                                                         │
│   "We don't leave until every surface                   │
│    meets the standard."                                 │
│    [32-40px display italic, centered]                   │
│                                                         │
│    — Areli, Founder                                     │
│                                                         │
│    A&A Cleaning was built on one principle:             │
│    the job isn't done until every detail is             │
│    accounted for. From rough cleans on active           │
│    construction sites to final walk-throughs on         │
│    luxury apartments, the standard is the same.         │
│    [body text, centered, max 640px]                     │
│                                                         │
│                                                         │
│ Reveals line by line on scroll. No photo needed.        │
│ The words carry their own weight in this variant.       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ SERVICE AREA — Single Typographic Line                  │
│                                                         │
│                                                         │
│   Serving Austin • Round Rock • Georgetown •            │
│   Kyle • Buda • Pflugerville • Hutto • San Marcos       │
│   [display font, 24-28px, centered]                     │
│                                                         │
│                                                         │
│ That's it. One line. The simplicity is the statement.   │
│ It says: we don't need a map or a flashy graphic.       │
│ We serve these areas. Period.                           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE Q3 — Minimal Inline Form                         │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│               Let's Get Started.                        │
│               [48-64px display]                         │
│                                                         │
│               ── gold line ──                            │
│                                                         │
│               [Name                       ]             │
│               [Phone                      ]             │
│               [Service Type             ▾ ]             │
│               [Brief Description          ]             │
│               [                            ]            │
│                                                         │
│               [Request a Quote]                         │
│                                                         │
│               Or call: (512) XXX-XXXX                   │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│ The whitespace surrounding the form IS the design.      │
│ Max-width 480px. Centered. The form is an island        │
│ of interaction in an ocean of space.                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ EMPLOYMENT — Minimal Line                               │
│                                                         │
│                                                         │
│   We're building a team of professionals.               │
│   [body text, centered]                                 │
│                                                         │
│   [See Open Positions →]                                │
│                                                         │
│                                                         │
│ One sentence. One CTA. That's it.                       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MODULE F2 — Minimal Signature Footer                    │
│                                                         │
│              [A&A Logo]                                 │
│   (512) XXX-XXXX • AAcleaningservices@outlook.com       │
│              Austin, TX                                 │
│                                                         │
│   © 2026 A&A Cleaning Services                          │
│                                                         │
│ Ultra-minimal. Centered. Phone = click-to-call.         │
│ Email = mailto. Nothing else needed.                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Variant C — Key UX Characteristics

| Aspect | Approach |
|---|---|
| **Scroll feel** | Calm, measured, considered. Large amounts of whitespace between sections create a meditative pace. |
| **Photography density** | Low on purpose. One photo break, photos inside service accordion, one B/A pair. Scarcity = impact. |
| **Typography scale** | Extreme — 100-140px hero headline, 80px process numbers, 120-160px stat numbers. Type IS the visual design. |
| **Whitespace** | Maximum. The defining characteristic. Every section is surrounded by generous empty space. |
| **CTA strategy** | Hero CTA → service accordion CTAs → inline form (Q3). Fewer CTAs, but each is more prominent due to surrounding space. Nav "Get a Quote" scrolls to the Q3 form. |
| **Interaction density** | Low-medium — accordion expand, counter animations, fade reveals, B/A slider. No parallax, no cascades. Restraint. |
| **Page length** | Medium. Fewer sections, but generous vertical padding means significant scroll depth. |
| **Best for** | Audiences who appreciate restraint and sophistication. When you want the site to signal "we don't need to try hard — the work speaks for itself." Maximum editorial sophistication. |
| **Conversion path** | Hero CTA, service accordion CTAs, inline form (Q3), click-to-call in hero + form + footer. The nav button scrolls to form. |

### The Philosophy of Restraint

Variant C works because of what it removes. No parallax — it's unnecessary when your typography is this strong. No stacked testimonial cards — one pull quote woven into the flow is more powerful. No photo gallery — one before/after is more curated than ten. No stats grid — two massive numbers scrolled past slowly are more memorable than four in a row. This variant bets on the idea that in a market full of cluttered cleaning websites, the most sophisticated thing is to show less.

---

# 10. VARIANT COMPARISON MATRIX

| Dimension | A: Architectural Narrative | B: Gallery Experience | C: Precision & Space |
|---|---|---|---|
| **Hero approach** | Full-viewport cinematic photo | Split-screen (text vs photo) | Pure typography, no image |
| **Service presentation** | Editorial spreads (alternating) | Hover-reveal gallery cards | Expandable accordion list |
| **Process visualization** | Vertical scroll timeline | Horizontal sliding panels | Sparse 4-column grid |
| **Testimonial treatment** | Single editorial quote (auto-rotate) | Stacked fanned cards | Pull quote woven into flow |
| **Trust/stats** | Horizontal authority bar | Sequential massive numbers (×3) | Sequential massive numbers (×2) |
| **Quote form** | Split (photo + form) + floating panel | Minimal centered inline | Minimal centered inline |
| **About** | Narrative split (text + photo) | Founder quote block (text only) | Founder quote block (text only) |
| **Service area** | Typographic word display | Stylized map + city list | Single line of text |
| **Employment** | Photo band with CTA | Career highlight cards | One sentence + CTA |
| **Footer** | Full 3-column dark | Full 3-column dark | Ultra-minimal centered |
| **Photo density** | Very high | High (mainly in gallery) | Very low (intentional scarcity) |
| **Interaction density** | High (parallax, reveals, timeline) | High (hover, swipe, drag) | Low-medium (accordion, counters) |
| **Whitespace** | Moderate (photos fill space) | Variable (tight grid → spacious) | Maximum (defining trait) |
| **Scroll length** | Long | Medium-long | Medium |
| **Feel** | Cinematic, immersive, editorial | Interactive, explorable, portfolio | Minimal, typographic, architectural |
| **B2B suitability** | Excellent | Excellent | Excellent |
| **Complexity to build** | High | Medium-high | Medium |
| **Best when** | Strong photo assets available | Want maximum interactivity | Want maximum sophistication |

---

# 11. RESPONSIVE BEHAVIOR STRATEGY

This section defines HOW modules structurally adapt across devices — not CSS breakpoints, but architectural decisions.

### Universal Principles

- **Touch targets:** All interactive elements minimum 44×44px on mobile
- **Stack, don't shrink:** Multi-column layouts stack to single column on mobile rather than cramming into smaller columns
- **Photography adapts:** Full-bleed photos crop to center-focus on mobile, maintain aspect ratios
- **CTAs at thumb reach:** Primary CTAs should live in the lower 60% of the mobile viewport
- **Sticky mobile CTA:** A persistent "Get a Quote" bar fixed to bottom of mobile viewport (all variants)

### Module-Specific Adaptations

| Module | Desktop | Tablet | Mobile |
|---|---|---|---|
| Split layouts (H2, Q1, A1) | Side by side | Side by side (50/50) | Stack — photo above, content below |
| Gallery cards (S2) | Staggered grid (60/40 + 3×33) | 2-column grid | Single column, full-width cards |
| Editorial spreads (S1) | Alternating photo/content sides | Same (60/40) | Stack — photo band above, content below |
| Expandable list (S3) | Full width, large type | Full width, slightly smaller type | Full width, 28-32px service names |
| Horizontal slider (P2) | 80% viewport panels | 90% viewport panels | Full-width panels, swipe navigation |
| Vertical timeline (P1) | Alternating left/right of center | Same | Left-aligned, all steps same side |
| Authority bar (T1) | 4 stats in one row | 4 stats in one row | 2×2 grid |
| Stat callouts (X3) | Centered, massive numbers | Same | Same, numbers scale to 80-100px |
| Before/after slider (BA1) | Full width | Full width | Full width, larger drag handle |
| Minimal form (Q3) | Centered, max-width 480-520px | Same | Full width with side padding |

### Mobile-Specific CTA Bar

All three variants include a fixed bottom bar on mobile viewports:

```
┌──────────────────────────────────────┐
│  📞 Call Now    |    📝 Get a Quote   │
│  [tap-to-call]  |  [scrolls to form] │
└──────────────────────────────────────┘
```

This bar is persistent, disappears briefly while the quote form section is in view (to avoid redundancy), and returns when the user scrolls away from the form.

---

# 12. SEO & CONTENT FRAMEWORK

---

## 12.1 Target Keywords

### Primary (Homepage + Service Pages)

| Keyword | Target Page |
|---|---|
| post construction cleaning Austin | Home + Post-Construction Service |
| construction cleaning subcontractor Texas | Home |
| commercial cleaning services Austin TX | Home + Commercial Service |
| final clean subcontractor Austin | Home + Final Clean Service |
| move out cleaning Austin | Home + Move-In/Move-Out Service |
| power washing services Austin | Windows & Power Wash Service |
| post construction cleaning company near me | Home (local intent) |

### Long-Tail (Future Content)

- "how to prepare for post construction final clean"
- "what does a construction final clean include"
- "commercial cleaning checklist for offices"
- "rough clean vs final clean construction"

## 12.2 Page-Level SEO

### Homepage

```html
<title>A&A Cleaning | Post-Construction & Commercial Cleaning — Austin, TX</title>
<meta name="description" content="Standards-driven post-construction, commercial, and vacant property cleaning across the Austin metro. Licensed, insured, and bilingual crew. Request a quote today.">
<h1>Standards-Driven Facility Care for Construction Professionals</h1>
```

### Service Pages

```html
<!-- Post-Construction -->
<title>Post-Construction Cleaning Services — Austin, TX | A&A Cleaning</title>
<meta name="description" content="Professional rough and final clean for new construction — multifamily, commercial, offices, and schools. Serving Austin, Round Rock, Georgetown, and surrounding areas.">

<!-- Commercial -->
<title>Commercial Cleaning Services — Austin Metro | A&A Cleaning</title>
<meta name="description" content="Reliable commercial cleaning for offices, retail, and facilities across the Austin metro area. Licensed, insured, bilingual crew.">

<!-- Move-In/Move-Out -->
<title>Move-In & Move-Out Cleaning — Austin, TX | A&A Cleaning</title>
<meta name="description" content="Vacant unit and apartment turnover cleaning. Fast turnaround for property managers and general contractors in the Austin area.">

<!-- Windows & Power Wash -->
<title>Window Cleaning & Power Washing — Austin, TX | A&A Cleaning</title>
<meta name="description" content="Professional window cleaning and power wash services for construction and commercial properties. Serving the Austin metro area.">
```

### About / Employment / Contact

```html
<title>About A&A Cleaning — Austin's Trusted Cleaning Subcontractor</title>
<title>Careers at A&A Cleaning — Join Our Team | Austin, TX</title>
```

## 12.3 Schema Markup

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "A&A Cleaning Services",
  "description": "Standards-driven post-construction, commercial, and vacant property cleaning.",
  "email": "AAcleaningservices@outlook.com",
  "areaServed": ["Austin", "San Marcos", "Kyle", "Buda", "Georgetown", "Round Rock", "Pflugerville", "Hutto"]
}
```

---

# 13. CONTENT BLOCKS

---

## 13.1 Hero Headlines (Options)

> Every Surface. Every Detail. Every Time.

> Standards-Driven Facility Care for Construction Pros.

> Your Standards, Delivered — On Time and On Budget.

## 13.2 Service Descriptions

**Post-Construction:** Rough and final clean for new construction projects — multifamily buildings, commercial spaces, offices, and schools. We handle the debris, dust, and detail work so the space is move-in ready.

**Final Clean:** Detail-level cleaning for move-in readiness. First final and second final cleans — bathtubs, walls, floors, windows, and every surface inspected to standard.

**Commercial:** Ongoing and one-time cleaning for offices, retail spaces, and commercial facilities. Consistent quality and scheduling that works around your operations.

**Move-In / Move-Out:** Vacant unit turnover cleaning for property managers. Fast turnaround — same-day available. Every unit left inspection-ready.

**Windows & Power Wash:** Interior and exterior window cleaning, plus power washing for building exteriors, walkways, and parking structures. Equipment included.

## 13.3 How It Works

1. **Request a Quote** — Submit our quick form or call us directly. We respond within the hour.
2. **We Assess & Quote** — We review the scope, visit if needed, and provide a detailed estimate.
3. **We Clean** — Our insured, bilingual crew handles every detail with proven standards.
4. **You Walk Through** — Final QA review before handoff with photos and completion report.

## 13.4 CTA Variations

- "Request a Quote" (primary)
- "Call Now" / "Call (512) XXX-XXXX" (click-to-call)
- "Get a Free Estimate"
- "Tell Us About Your Project"
- "Let's Talk About Your Project"

---

# 14. PAGE INVENTORY

| Page | Priority | Purpose | Primary CTA |
|---|---|---|---|
| **Home** | MVP | Lead capture, brand positioning | Request a Quote + Call |
| **Post-Construction** | MVP | SEO landing page | Request a Quote |
| **Commercial Cleaning** | MVP | SEO landing page | Request a Quote |
| **Move-In/Move-Out** | MVP | SEO landing page | Request a Quote |
| **Windows & Power Wash** | MVP | SEO landing page | Request a Quote |
| **About** | MVP | Trust, company story | Call or Quote |
| **Employment / Careers** | MVP | Hiring pipeline | Apply Now |
| **Contact** | MVP | Direct contact + form | Call + Form |
| **Privacy Policy** | Pre-launch | Legal requirement | — |
| **Terms of Service** | Pre-launch | Legal requirement | — |

---

# 15. ACCESSIBILITY & PERFORMANCE

## 15.1 Accessibility Requirements

- All body text meets WCAG AA contrast (4.5:1). Large text meets 3:1.
- All interactive elements minimum 44×44px tap targets
- Visible focus states on all focusable elements
- Semantic HTML throughout (`<nav>`, `<main>`, `<section>`, `<article>`, `<button>`)
- All meaningful images have descriptive alt text
- Every form input has an associated `<label>` element
- Heading hierarchy maintained (one H1 per page, no skipped levels)
- Animations respect `prefers-reduced-motion` — disable parallax, reveals, and counter animations
- Before/after slider is keyboard accessible (arrow keys move divider)
- Horizontal slider (P2) is keyboard navigable with arrow keys
- Accordion (S3) follows WAI-ARIA accordion pattern

## 15.2 Performance Targets

- Lighthouse Performance: > 90
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Total page weight: < 500KB (excluding images)

## 15.3 Performance Strategy

- `font-display: swap` on all custom fonts. Preload display font for hero.
- Images: WebP format, lazy load below the fold, provide width/height to prevent CLS
- Single stylesheet, minified. Minimal JS — only what's needed for interactions.
- Intersection Observer for scroll-triggered animations (no scroll event listeners)
- Before/after slider and accordion use CSS transitions where possible, JS only for drag interaction

---

*Document version: 2.0*
*Reworked: March 2026*
*Focus: UX/UI Architecture (modules, layouts, interactions, flow)*
*Companion to: AA-Cleaning-Master-Spec.md (v5)*
