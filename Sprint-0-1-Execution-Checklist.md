# A&A Cleaning — Sprint 0 + Sprint 1 Execution Checklist

## Scope Lock
- Build direction: **Variant A** as canonical public site UX/UI.
- Platform target: **Next.js 14+ App Router + Supabase**.
- Phase target: **Phase 1 MVP only** from Master Spec.

---

## Sprint 0 (Pre-Build, 3-5 days)

### 0.1 Blocking Decisions (Must resolve before feature work)
- [x] Confirm Areli primary admin device for heavy tasks (phone vs laptop)
- [x] Context captured: phone at job sites; Mac mini / iPad Pro for invoicing and heavier admin tasks.
- [ ] Confirm full crew smartphone audit (models + data plans for all active crew)
- [ ] Confirm development cadence (hours/week baseline)
- [ ] Confirm GC portal demand validation interviews are scheduled (Phase 3 discovery gate; not a Phase 1 blocker)
- [x] Confirm pricing model implementation shape (sq-ft + extras + bundled)

### 0.2 Technical Foundation
- [x] Create Next.js 14+ TypeScript repo with App Router
- [x] Configure Tailwind + global design tokens (Navy/Royal Blue/Gold)
- [ ] Initialize `shadcn/ui` for admin/employee interface components
- [x] Add Supabase project/env wiring (auth, db, storage)
- [ ] Add `next-intl` baseline (employee portal Spanish-first planning)
- [x] Add linting/formatting/test baseline (ESLint, Playwright scaffolding)

### 0.2A Website Conversion Lock-In (Current Priority)
- [x] Finalize phone-first conversion UX (call CTA + quote CTA hierarchy)
- [x] Ensure mobile-first layout quality across Hero, Services, BA slider, Quote, Footer
- [x] Remove/avoid non-essential visual effects that reduce mobile readability/performance
- [x] Add conversion instrumentation baseline (form submit, call click, CTA clicks)
- [ ] Validate trust/authority content placement (proof, service area, credibility, response-time cues)

### 0.3 Camera Spike (Critical Gate)
- [x] Build standalone capture/upload test page
- [x] Verify Android camera open + capture
- [x] Compress image client-side
- [x] Capture timestamp + GPS metadata
- [x] Upload to Supabase Storage
- [ ] Test on at least 3 real crew devices
- [ ] Gate decision: proceed / redesign if unstable

### 0.4 Public Site Extraction (Variant A)
- [x] Break Variant A into components:
  - [x] `HeroSection`
  - [x] `AuthorityBar`
  - [x] `ServiceSpreadSection`
  - [x] `BeforeAfterSlider`
  - [x] `TestimonialSection`
  - [x] `TimelineSection`
  - [x] `AboutSection`
  - [x] `ServiceAreaSection`
  - [x] `QuoteSection`
  - [x] `CareersSection`
  - [x] `FooterSection`
- [x] Move floating quote form to global state-controlled component
- [x] Preserve completed fixes (reduced motion, focus-visible, BA slider aria/keyboard, testimonial hover pause)

### Sprint 0 Exit Criteria
- [ ] Camera spike passed on real devices
- [x] App scaffold runs locally
- [x] Variant A components render in Next.js with no regression in key interactions

---

## Sprint 1 (Weeks 1-2 equivalent implementation)

### 1.1 Data + Auth Core
- [x] Create MVP schema migrations for:
  - [x] `profiles`
  - [x] `clients`
  - [x] `jobs`
  - [x] `job_assignments`
  - [x] `job_photos`
  - [x] `leads`
  - [x] `quotes`
- [x] Add Supabase RLS policies for admin + employee roles
- [x] Implement auth flows:
  - [x] Admin login
  - [x] Crew Phone OTP flow (Twilio-compatible path)

### 1.2 Admin Baseline
- [x] Build base admin shell/navigation
- [ ] Implement first-run wizard with sample data insertion
- [x] Implement quick-create job flow (minimum required fields)
- [x] Implement assignment flow to crew user

### 1.3 Employee Baseline
- [x] Build Spanish-first “Mis Trabajos” view
- [x] Job detail view with address/contact/scope
- [x] Status update flow: en route → in progress → complete
- [x] Completion photo upload from mobile
- [x] Issue report capture (photo + text)
- [x] Rework ticket flow: admin marks return-required items with notes + assigned worker follow-up

### 1.4 Notification Baseline
- [ ] SMS on assignment trigger
- [ ] Quiet-hours queue behavior (send after 7 AM)

### Sprint 1 Exit Criteria
- [ ] Areli can create + assign job in under 2 minutes
- [ ] Crew receives assignment and updates status
- [ ] Crew uploads completion photo successfully
- [ ] Areli can review completed job/photos in admin

---

## QA / Verification (During Sprint 0 + 1)
- [ ] In-person QA is source of truth for dust/streak quality (photos are documentation only)
- [ ] Mobile functional validation only: capture/upload/status/ticket notes on real devices
- [ ] 3G-throttled upload sanity checks for reliability (functional, not cleaning-quality QA)
- [ ] Minimal smoke checks for critical functionality:
  - [ ] Auth flow
  - [ ] Job lifecycle
  - [ ] Lead capture path (stub if backend not finished)
  - [ ] Rework ticket creation + resolution loop

---

## Immediate Next Action Order
1. Apply and verify migration: `0003_ops_and_conversion.sql` in target Supabase project
2. Validate trust/authority content placement against conversion goals
3. Execute real-device camera + upload validation on at least 3 crew devices
4. Add Sprint 1 smoke checks for auth lifecycle, lead capture, and rework resolution loop
