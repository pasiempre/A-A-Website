# Homepage Feedback Validation + Execution Gameplan

Date: 2026-03-19
Scope: `Production-workspace/src/components/public/variant-a/*`
Source feedback: `Master-Spec-2.0/Additional-homepage-feedback`

## Validation Summary

### 1) TimelineSection
File: `src/components/public/variant-a/TimelineSection.tsx`

- **Implemented (valid + done)**
  - Oversized step numbers reduced and zero-padded labels used.
  - Repetitive chips removed.
  - Image panel increased and visual noise removed.
  - Progress line simplified.
  - Dot glow removed.
  - Spacing tightened (`mb-14`) and transitions mostly moved to `duration-700`.
- **Open / optional**
  - Some remaining decorative background complexity could be simplified further.

### 2) AboutSection
File: `src/components/public/variant-a/AboutSection.tsx`

- **Implemented (valid + done)**
  - Floating image chips removed.
  - Bottom “Why it matters” image panel removed.
  - Quote converted to left-border statement style.
  - CTA promoted to primary.
  - `min-h` reduced from previous heavier layout.
- **Open / optional**
  - Chip-fatigue reduction still possible (convert standards chips to inline text treatment).
  - Transition duration consistency can be normalized (`duration-1000` → `duration-700`).

### 3) ServiceAreaSection
File: `src/components/public/variant-a/ServiceAreaSection.tsx`

- **Implemented (valid + done)**
  - Kicker switched to shared style.
  - Background standardized to `#FAFAF8`.
  - Non-interactive hover effects removed.
- **Open (high-priority)**
  - City hierarchy remains too large (`AUSTIN` still oversized).
  - Map readability and label overlap refinements not completed.
  - Redundancy remains (large city typography + labeled map + bottom tagline).
  - Outer map polygon still present.

### 4) TestimonialSection
File: `src/components/public/variant-a/TestimonialSection.tsx`

- **Implemented (valid + done)**
  - Grid noise removed.
  - Quote mark removed; quote style simplified.
  - Spacer hack removed; card returned to document flow.
  - Avatar simplified.
  - Chip count reduced to primary tag only.
  - Reduced-motion/mobile safeguards preserved.
- **Open / optional**
  - Arrow navigation controls not added.
  - Transition approach is still basic (no explicit enter/exit crossfade system).

### 5) OfferAndIndustrySection
File: `src/components/public/variant-a/OfferAndIndustrySection.tsx`

- **Open (high-priority)**
  - Card-within-card density still heavy.
  - Dual eyebrow hierarchy (`eyebrow` + `signal`) still present.
  - `min-h-[112px]` text lock still present.
  - Icon scale and hover refinement still pending.
  - Mixed background treatment still heavier than desired.

### 6) Cross-section / Global
Files: `src/styles/globals.css` + section files

- **Implemented (partial)**
  - Some background continuity improved.
- **Open**
  - Transition duration not fully standardized (`700/1000` mix remains).
  - Chip usage still high across homepage.
  - Heading-size discipline still inconsistent in Service Area.

---

## Priority Gameplan (Implementation Order)

## Phase 1 — High ROI, Low Risk (Start Here)
Goal: fix the largest remaining UX readability issues with minimal architecture changes.

1. **ServiceArea cleanup**
   - Flatten typography hierarchy.
   - Resolve map label overlap and readability.
   - Remove redundant city presentation layers and redundant bottom tagline.
   - Keep existing animation structure.

2. **Offer/Industry card simplification**
   - Collapse nested inner “Why it works” card into simpler footer.
   - Remove `signal` secondary eyebrow.
   - Remove `min-h` body lock.
   - Increase icon presence modestly.

Success criteria:
- Section readability improves on first scan.
- No new interactive complexity.
- Lint/build clean.

## Phase 2 — Consistency Pass
Goal: unify rhythm and visual rules.

1. Standardize transitions to `duration-700` in homepage sections.
2. Reduce chip usage by ~30–40% where chips are decorative.
3. Keep heading scale within agreed hierarchy outside hero.

Success criteria:
- Consistent motion cadence across sections.
- Reduced visual noise from repetitive pills.

## Phase 3 — Optional Polish (Only if needed)
Goal: add polish without risking performance.

1. Testimonial arrow controls + clearer state transitions.
2. Additional micro-polish in Timeline/About if UX still feels dense.

Success criteria:
- No measurable performance regression.
- Accessibility and keyboard behavior retained.

---

## First Execution Batch (Recommended Next Commit Scope)

- `src/components/public/variant-a/ServiceAreaSection.tsx`
- `src/components/public/variant-a/OfferAndIndustrySection.tsx`

Why this batch:
- Biggest remaining visual/clarity wins.
- Isolated components.
- Low coupling risk.

Validation gates:
- `npm run lint`
- `npm run build`
- Visual check at desktop + mobile widths.

---

## Deferred / Do-Not-Do-Now

- Premium/parallax/tooltip/counter systems from the later draft sections.
- Broad global CSS rewrites that change component primitives site-wide.
- Dynamic Tailwind class patterns that may not compile safely.

Reason: high complexity for lower immediate ROI and greater regression risk.
