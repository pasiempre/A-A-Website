# Phase 3: MASTER SPEC 2.0 IMPLEMENTATION ROADMAP
## Comprehensive Development Strategy & Phased Delivery Plan

**Status:** Planning Phase (Pre-Implementation)  
**Date:** March 19, 2026  
**Base References:** Phase 1 (Audit) + Phase 4A (UX/UI) + Phase 2A (IA) + Phase 2B (Components) + Phase 2C (QA)

---

## TABLE OF CONTENTS
1. [Executive Summary](#executive-summary)
2. [Master Feature Inventory](#master-feature-inventory)
3. [Implementation Phases](#implementation-phases)
4. [MVP Phase (Phase 1)](#mvp-phase-phase-1)
5. [Phase 2: IA & Components Implementation](#phase-2-ia--components-implementation)
6. [Phase 3: QA Module & Workflows](#phase-3-qa-module--workflows)
7. [Phase 4: Admin Dashboard & Analytics](#phase-4-admin-dashboard--analytics)
8. [Phase 5+: Advanced Features](#phase-5-advanced-features)
9. [Technical Dependencies](#technical-dependencies)
10. [Timeline & Capacity Planning](#timeline--capacity-planning)
11. [Risk Assessment](#risk-assessment)
12. [Success Metrics](#success-metrics)
13. [Developer Handoff Checklist](#developer-handoff-checklist)

---

## EXECUTIVE SUMMARY

### What We're Building (From Phases 1-2C)

**Current State (Phase 1 Audit):**
- 5 public routes (home, about, services, careers, quote)
- 17 public components (hero, authority bar, before/after, quote section, etc.)
- 12 API routes (quote-request, assignments, notifications, etc.)
- Supabase backend with 30+ tables
- Basic design system (no formalized tokens)
- Mobile nav missing, loading/error states undefined

**Problem Statement (Master Spec Frictions):**
- F1: Areli is the only quality standard (needs systematization)
- F2: Crew doesn't know system (poor onboarding + training)
- F3: GC blind handoff (reactive quality issues)
- F4: Manual scheduling (labor-intensive, error-prone)
- F5: No visibility into crew performance (can't identify training needs)
- F6: Conversion funnel opaque (lead source tracking missing)
- F7: Ticketing incomplete (need full JIRA-like system)
- F8: No documentation (disputes unresolvable)
- F9: Admin workflow manual (high touch)

### Solution Architecture

```
PHASE-1 MVP:
├─ Public website redesigned (new components + design system)
├─ Quote flow integrated with new UI
├─ Admin dashboard bootstrap (basic operations)
└─ Basic notification system

PHASE-2 IMPLEMENTATION:
├─ Navigation IA (public header, admin sidebar)
├─ Design system components (full Tailwind library)
├─ Mobile-optimized experiences
└─ Animation system

PHASE-3 QA AUTOMATION:
├─ Checklist template system
├─ Photo documentation (crew mobile)
├─ QA review workflow (Areli dashboard)
└─ Issue tracking (dispute documentation)

PHASE-4 ADMIN INTELLIGENCE:
├─ Full admin dashboard (operations, analytics)
├─ Reporting (performance, financials)
├─ Crew management & training
└─ Analytics (conversion, quality, revenue)

PHASE-5+ ADVANCED:
├─ AI quote assistant improvements
├─ Advanced scheduling (auto-assignment)
├─ Photo recognition (damage detection)
└─ Mobile crew app (full suite)
```

---

## MASTER FEATURE INVENTORY

### Phase 1 MVP Features (Current Codebase)

| Feature | Status | Component(s) | Comments |
|---------|--------|---|---|
| Quote Request Form | Partial | QuoteSection, QuoteModal | Form built but needs UX polish + validation states |
| Quote Email Response | Exists | API route | Integration with Twilio needs verification |
| Quote PDF Generation | Exists | quote-pdf.ts lib | May need template redesign |
| AI Quote Assistant | Exists | AIQuoteAssistant | Needs context integration |
| Before/After Slider | Exists | BeforeAfterSlider | Gallery feature, working |
| Photo Upload Gallery | Exists | various | Ad-hoc implementation, needs unification |
| Services Page | Partial | services/page.tsx | Content-only, no filtering/search |
| Careers Page | Template | careers/page.tsx | Stub implementation |
| Admin Dashboard | Skeleton | (admin)/*.tsx | FirstRunWizard, HiringInbox exist but incomplete |

### Features Identified in Phase 2A/2B/2C (To Build)

| Feature | Priority | Phase | Complexity | Est. Size |
|---------|----------|-------|-----------|-----------|
| **Navigation IA Implementation** | P0 | 2 | Medium | 15-20 tickets |
| Public Header Navigation (Responsive) | P0 | 2 | Medium | 6-8 tickets |
| Admin Sidebar Navigation | P0 | 2 | Medium | 6-8 tickets |
| Mobile Bottom Navigation | P1 | 2 | Low | 2-3 tickets |
| **Design System Components** | P0 | 2 | High | 50+ tickets |
| Button component library (8 variants) | P0 | 2 | Low | 2-3 tickets |
| Form inputs (text, select, checkbox, radio) | P0 | 2 | Medium | 4-5 tickets |
| Card component system | P0 | 2 | Low | 2-3 tickets |
| Modal/dialog system | P0 | 2 | Medium | 3-4 tickets |
| Data table component | P0 | 2 | High | 4-6 tickets |
| Notification/toast system | P0 | 2 | Low | 2-3 tickets |
| Loading skeleton system | P0 | 2 | Low | 2-3 tickets |
| Animation system (transitions, entrance) | P1 | 2 | Medium | 4-5 tickets |
| Accessibility audit + fixes (WCAG 2.1 AA) | P0 | 2 | High | 8-12 tickets |
| Mobile-responsive refinements | P1 | 2 | Medium | 6-8 tickets |
| Error page system (404, 500, etc.) | P1 | 2 | Low | 2-3 tickets |
| **QA Module** | P1 | 3 | High | 25-30 tickets |
| Checklist template system (admin) | P1 | 3 | Medium | 6-8 tickets |
| Crew job completion form (mobile) | P1 | 3 | Medium | 6-8 tickets |
| Photo upload + GPS/timestamp | P1 | 3 | Medium | 5-7 tickets |
| QA review queue (Areli dashboard) | P1 | 3 | High | 8-10 tickets |
| Issue tracking system | P1 | 3 | Medium | 5-7 tickets |
| Completion report generation | P2 | 3 | Medium | 4-6 tickets |
| **Admin Dashboard** | P1 | 4 | Very High | 40-50 tickets |
| Operations overview (pending jobs, alerts) | P1 | 4 | Medium | 4-6 tickets |
| Financial dashboard (revenue, profitability) | P1 | 4 | High | 6-8 tickets |
| Crew management (performance, assignments) | P1 | 4 | Medium | 5-7 tickets |
| Lead pipeline visualization | P2 | 4 | High | 6-8 tickets |
| Reporting & exports (PDF, CSV) | P2 | 4 | Medium | 4-6 tickets |
| Audit logging (system-wide) | P2 | 4 | Low | 2-3 tickets |
| **Advanced Features (Phase 5+)** | P3+ | 5+ | Very High | 100+ tickets |
| Mobile crew app (full suite) | P3 | 5 | Very High | 30-40 tickets |
| Advanced scheduling (auto-assign) | P3 | 5 | Very High | 20-25 tickets |
| AI improvements (quote, damage detection) | P3 | 5 | Very High | 15-20 tickets |
| PWA implementation | P3 | 5 | Medium | 5-8 tickets |

### Total Build Scope

```
MVP Phase 1:        Polish existing features
Phase 2:            ~55-65 tickets (design system + IA + mobile)
Phase 3:            ~25-30 tickets (QA module)
Phase 4:            ~40-50 tickets (admin dashboard)
Phase 5+:           100+ tickets (advanced)

TOTAL (Phases 1-4): 120-145 tickets
```

---

## IMPLEMENTATION PHASES

### Phase Structure

```
PHASE-1 (CURRENT):  Current codebase + polish
  ↓
PHASE-2:            Navigation + Components + Mobile
  ↓
PHASE-3:            QA Module + Workflows
  ↓
PHASE-4:            Admin Dashboard + Analytics
  ↓
PHASE-5+:           Advanced features + future
```

Each phase has:
- Feature breakdown into tickets
- Dependencies (what must be done first)
- Effort estimates
- Risk areas
- Success criteria

---

## MVP PHASE (PHASE 1)
### Polish & Stabilize Existing Features

**Objective:** Make current working features production-ready with UX improvements and bug fixes

### Phase 1 Ticket Breakdown

#### **1.1 Quote Request Form Polish** (3-5 days)
```
TICKET 1.1.1: Form validation & error states
  Description: Implement form validation per Phase 2B spec
  Components: QuoteSection, Form inputs
  Changes:
    - Add required field indicators
    - Client-side validation (email, phone format)
    - Error state styling (red border, error message)
    - Server-side validation response handling
  Acceptance:
    - Invalid email shows error
    - Required fields highlight if empty
    - Submit disabled until valid
  Estimate: 1-2 days
  Risk: Previously not designed, needs design review

TICKET 1.1.2: Loading states for quote submission
  Description: Show loading indicator while quote processing
  Components: QuoteModal submit button
  Changes:
    - Button shows [Loading...] state
    - Spinner icon visible
    - Button disabled during submission
    - Success/error toast appears
  Estimate: 1 day
  Risk: Low

TICKET 1.1.3: Success confirmation flow
  Description: After successful submission, redirect or modal confirmation
  Components: QuoteModal, redirect
  Changes:
    - Show success message
    - Clear form or close modal
    - Redirect to pending quote status page
    - Send confirmation email
  Estimate: 1-2 days
  Risk: Email delivery verification needed

TICKET 1.1.4: Mobile responsiveness testing & fixes
  Description: Test form on all breakpoints, fix responsive issues
  Components: QuoteSection, form inputs
  Changes:
    - Fix form layout below 768px
    - Button sizing on mobile
    - Modal sizing on mobile
    - Input field sizing
  Acceptance: Form usable on iPhone, iPad, desktop
  Estimate: 1 day
  Risk: May discover hidden layout issues
```

#### **1.2 Page Polish & Completeness** (4-6 days)
```
TICKET 1.2.1: Homepage hero section refinement
  Description: Polish HeroSection component per Phase 2B specs
  Components: HeroSection
  Changes:
    - Verify color contrast (WCAG AA)
    - Fix button sizing/spacing
    - Ensure responsive layout
    - Add missing accessibility attributes
  Estimate: 1-2 days

TICKET 1.2.2: Before/After slider mobile experience
  Description: BeforeAfterSlider works on mobile
  Components: BeforeAfterSlider
  Changes:
    - Touch support (swipe or tap handler)
    - Slider controls visibility on small screens
    - Ensure images load correctly
  Estimate: 1 day

TICKET 1.2.3: Services page enhance (filtering + search)
  Description: Add search box and category filtering
  Components: services/page
  Changes:
    - Search bar (real-time filter)
    - Category buttons (all, residential, commercial)
    - Results update dynamically
    - Responsive layout
  Estimate: 1-2 days

TICKET 1.2.4: Create 404 and 500 error pages
  Description: Build error page components per Phase 2B spec
  Files:
    - app/not-found.tsx (404)
    - app/error.tsx (500)
  Changes:
    - Branded error page design
    - Helpful message + home button
    - Feedback form (optional)
  Estimate: 1 day
```

#### **1.3 Notification System Polish** (3-4 days)
```
TICKET 1.3.1: Toast notification system
  Description: Standardize toast components per Phase 2B spec
  Components: New lib/toast.ts + Toast component
  Changes:
    - Create toast context provider
    - Toast component (success, error, info, warning)
    - Auto-dismiss timers
    - Stack multiple toasts
    - Replace all ad-hoc alerts
  Estimate: 1-2 days

TICKET 1.3.2: Email notification reliability
  Description: Verify email sending works reliably
  Components: Email service (Twilio/SendGrid)
  Changes:
    - Test email delivery (quote requests, confirmations)
    - Verify email templates render correctly
    - Add email logs for debugging
    - Set up retry logic for failures
  Estimate: 1 day

TICKET 1.3.3: In-app notifications (dashboard alerts)
  Description: Build notification center for admin dashboard
  Components: NotificationCenter component, notifications table
  Changes:
    - Notification badge on header
    - Notification list dropdown
    - Mark as read/unread
    - Clear notifications
  Estimate: 1-2 days
```

#### **1.4 Security & Compliance** (2-3 days)
```
TICKET 1.4.1: Quote token security review
  Description: Verify quote token implementation is secure
  Files: middleware.ts, quote API routes
  Changes:
    - Verify token expiration (7 days default)
    - Single-use token validation
    - Rate limiting on quote endpoint
    - Log security events (unauthorized access attempts)
  Estimate: 1-2 days
  Risk: May uncover security gaps

TICKET 1.4.2: SEO metadata verification
  Description: Audit and fix SEO tags on all pages
  Files: All layout.tsx and page.tsx files
  Changes:
    - Verify meta titles (50-60 chars)
    - Meta descriptions (150-160 chars)
    - Open graph tags (social sharing)
    - Structured data (schema.org)
    - Verify sitemap.ts is complete
    - Robots.ts is correct
  Estimate: 1 day
  Risk: May need content team input
```

#### **1.5 Testing & Documentation** (2-3 days)
```
TICKET 1.5.1: End-to-end test (happy path)
  Description: Create E2E test for quote flow
  Files: e2e/quote-flow.spec.ts (Playwright)
  Changes:
    - Visitor lands on home
    - Clicks "Get Quote"
    - Fills form (name, email, phone, address)
    - Submits form
    - Sees success message
    - Receives confirmation email
  Estimate: 1-2 days

TICKET 1.5.2: Accessibility audit & reported fixes
  Description: Run WCAG 2.1 AA audit tools
  Changes:
    - Fix keyboard navigation (Tab through inputs)
    - Verify screen reader text (aria-labels)
    - Fix color contrast issues
    - Proper heading hierarchy
  Estimate: 1 day

TICKET 1.5.3: Phase 1 release documentation
  Description: Document Phase 1 changes for team
  Files: docs/PHASE-1-RELEASE.md
  Changes:
    - What's new + improvements
    - Breaking changes (if any)
    - Manual testing checklist
    - Known issues (if any)
  Estimate: 0.5 days
```

### Phase 1 Summary

**Total Effort:** 18-25 days (3-5 weeks for 1 full-time dev)  
**Deliverables:** 
- ✅ Quote form fully functional + validated
- ✅ Error pages (404, 500)
- ✅ Notification system polished
- ✅ Mobile responsiveness tested
- ✅ Security reviewed
- ✅ SEO verified
- ✅ E2E tests passing

**Success Criteria:**
- Quote request form has <5% error rate
- All pages responsive on mobile
- E2E tests passing
- Accessibility audit score ≥90%
- No critical security issues

---

## PHASE 2: IA & COMPONENTS IMPLEMENTATION
### Navigation System + Design System Component Library

**Objective:** Implement complete design system component library (50+ components) + responsive navigation (header/admin sidebar) per Phase 2A/2B specs

**Duration:** 4-6 weeks (full-time developer)

### Phase 2A: Navigation Implementation (Week 1-2)

```
TICKET 2A.1: Public header navigation (responsive)
  Description: Implement responsive header with desktop, tablet, mobile
  Components: Header.tsx component + nav routes
  Changes:
    - Desktop nav (horizontal menu: Home, About, Services, Careers)
    - Logo + branding
    - CTA button (Get Quote)
    - Sticky header on scroll
    - Mobile hamburger menu (hamburger icon visible <768px)
    - Touch-friendly mobile nav
  Estimate: 3-4 days
  
TICKET 2A.2: Admin sidebar navigation
  Description: Implement 7-cluster admin sidebar per 2A spec
  Components: AdminSidebar.tsx + route configuration
  Changes:
    - Operations cluster (dashboard, jobs, crew)
    - Quality Compliance cluster (QA queue, issues, templates)
    - Sales/Leads cluster (leads, quotes, conversions)
    - Financial cluster (invoices, reports, profitability)
    - Inventory cluster (materials, equipment)
    - Settings cluster (company, users, integrations)
    - Help cluster (support, docs, feedback)
    - Collapsible subnav items
    - Responsive (visible desktop, collapsed mobile)
  Estimate: 4-5 days

TICKET 2A.3: Mobile navigation refinement
  Description: Mobile-optimized nav + bottom navigation option
  Components: MobileNav.tsx + BottomNav.tsx
  Changes:
    - Hamburger menu slide-out (from left)
    - Bottom navigation bar (5 main sections)
    - Swipe support (close menu on outside swipe)
    - Safe area consideration (notches, home bars)
  Estimate: 2-3 days

TICKET 2A.4: Navigation routing + active state
  Description: React Router integration + active link highlighting
  Files: app layout structure
  Changes:
    - Active route highlighting in nav
    - Breadcrumb navigation (secondary nav)
    - Route transitions (loading states)
    - Back button where needed
  Estimate: 2 days

Total Phase 2A: 3-4 weeks
```

### Phase 2B: Design System Components Implementation (Week 2-5)

```
TICKET 2B.1-2B.8: Base components (8-10 days)

2B.1: Button component library (8 variants)
  - Primary, secondary, tertiary, ghost buttons
  - Hover/active/disabled states
  - Sizes (sm, md, lg)
  - Loading state with spinner
  - Icon support
  Estimate: 1.5 days

2B.2: Form components (text, email, select, etc.)
  - TextInput, EmailInput, PasswordInput
  - Select dropdown
  - Checkbox, Radio
  - Textarea (large text input)
  - File upload
  - Each with error states + labels
  Estimate: 2 days

2B.3: Card component (container)
  - Elevated/flat variants
  - Padding options
  - Header/footer slots
  - Image support
  Estimate: 1 day

2B.4: Modal/Dialog system
  - Overlay + top-layer stacking
  - Close button
  - Header, body, footer sections
  - Fullscreen modal option
  - Animation entrance/exit
  Estimate: 1.5 days

2B.5: Data table component
  - Header row with sort indicators
  - Multiple rows with alternating background
  - Sticky header on scroll
  - Column sizing
  - Responsive (stacked rows on mobile)
  Estimate: 2-3 days

2B.6: Alert/notification component
  - 4 types (success, error, warning, info)
  - Icon + message
  - Dismissible option
  - Stacking multiple alerts
  Estimate: 1 day

2B.7: Loading skeleton / placeholder
  - Shimmer animation
  - Skeleton versions of cards, tables, forms
  - Configurable width/height
  Estimate: 1.5 days

2B.8: Other elements (badges, pills, tags)
  - Small inline components
  - Variants and colors
  Estimate: 1 day

Subtotal 2B.1-2B.8: 8-10 days

TICKET 2B.9-2B.15: Complex components (8-12 days)

2B.9: Photo gallery component
  - Thumbnail strip
  - Main image display
  - Lightbox full-screen view
  - Next/prev navigation
  - Caption display
  Estimate: 2 days

2B.10: Form builder / wizard
  - Multi-step form
  - Step indicators
  - Progress bar
  - Previous/Next buttons
  - Form state management
  Estimate: 2.5 days

2B.11: Rich text editor (optional)
  - For admin content creation
  - Markdown or WYSIWYG
  Estimate: 2 days (or defer to Phase 3+)

2B.12: Date/time picker
  - Date input with calendar
  - Time select
  - Date range picker
  Estimate: 1.5 days

2B.13: Search/autocomplete
  - Search input with suggestions
  - Debouncing
  - API integration
  Estimate: 1.5 days

2B.14: Breadcrumb navigation
  - Hierarchical navigation trail
  - Clickable items
  Estimate: 0.5 days

2B.15: Empty state / no results
  -Illustration + message + action
  Estimate: 0.5-1 day

Subtotal 2B.9-2B.15: 8-12 days

TICKET 2B.16: CSS-in-JS / Animation system
  Description: Implement Tailwind animations + Framer Motion setup
  Changes:
    - Tailwind animation utilities
    - Entrance animations (fade-in, slide-up, scale)
    - Micro-interactions (button hover, hover effects)
    - Reduced-motion compliance (prefers-reduced-motion)
    - Framer Motion for complex sequences
  Estimate: 1-2 days

TICKET 2B.17: Accessibility enhancements
  Description: Cross-component accessibility audit + fixes
  Changes:
    - Keyboard navigation (Tab, Enter, Escape)
    - ARIA attributes (roles, labels, descriptions)
    - Screen reader announcements (live regions)
    - Focus indicators (visible focus outline)
    - Color contrast verification
  Estimate: 2-3 days
  
Total Phase 2B: 2-3 weeks
```

### Phase 2 Integration & Testing (Week 4-5)

```
TICKET 2-Integration: Storybook setup + component documentation
  Description: Document all components with interactive examples
  Files: storybook/ directory
  Changes:
    - Storybook config (next.js integration)
    - Story files for each component (50+)
    - Props documentation
    - Usage examples + edge cases
  Estimate: 2-3 days

TICKET 2-Mobile-Test: Mobile responsiveness end-to-end
  Description: Test all components on real devices
  Changes:
    - iPhone SE, iPhone 14, iPad, Android tablet
    - Verify touch interactions
    - Verify font sizes readable
    - Verify buttons click-able (48px min)
    - Verify images scale properly
  Estimate: 1.5 days

TICKET 2-Accessibility: WCAG 2.1 AA audit + fixes
  Description: Comprehensive accessibility audit
  Changes:
    - Automated tools (axe DevTools, Lighthouse)
    - Manual keyboard navigation testing
    - Screen reader testing (NVDA, JAWS on Windows; VoiceOver on Mac)
    - Fix all issues found
  Estimate: 2-3 days
  
Total Integration & Testing: 1 week
```

### Phase 2 Summary

**Total Effort:** 4-6 weeks (1 full-time frontend developer)

**Deliverables:**
- ✅ Responsive public header navigation
- ✅ Admin sidebar (7 feature clusters)
- ✅ 50+ component library items
- ✅ Storybook documentation
- ✅ Accessibility audit complete
- ✅ Mobile testing complete
- ✅ Animation system established

**Success Criteria:**
- All 50+ components have passing Storybook stories
- All components responsive on mobile/tablet/desktop
- WCAG 2.1 AA compliance ≥95%
- Mobile testing passed (iOS + Android)
- Zero accessibility violations (critical)

---

## PHASE 3: QA MODULE & WORKFLOWS
### Checklist System + Photo Documentation + Review Queue

**Objective:** Implement complete QA system per Phase 2C spec - checklist templates, crew photo upload, QA review queue, issue tracking

**Duration:** 3-4 weeks (1-2 developers)

### Phase 3 Ticket Breakdown

```
TICKET 3.1: Checklist Template System (Admin)
  3.1.1: Database schema + migrations
    - checklist_templates, checklist_items tables
    - RLS policies (admin only)
    Estimate: 1 day

  3.1.2: Admin template management UI
    - Create new template form
    - Edit template (add/remove/reorder items)
    - Template versioning
    - Archive old versions
    Estimate: 2-3 days

  3.1.3: Template item library
    - Reusable item definitions
    - Item organization by category
    - Search + filter items
    - Add items to template
    Estimate: 1-2 days

Total 3.1: 4-6 days

TICKET 3.2: Crew Job Completion Interface (Mobile)
  3.2.1: Photo upload interface
    - Camera + file picker
    - Multiple photo upload
    - Photo preview
    - GPS + timestamp capture
    - Remove individual photos
    Estimate: 2-3 days

  3.2.2: Checklist completion form
    - Display template items
    - Checkboxes per item
    - Optional notes field
    - Progress indicator
    - Required field validation
    Estimate: 2 days

  3.2.3: Issue reporting form
    - Issue type dropdown
    - Description text area
    - Photo attachment
    - GPS + timestamp auto-capture
    Estimate: 1-2 days

  3.2.4: Form submission & signing
    - Review all fields (checklist, photos, issues)
    - Digital signature or checkbox
    - Submit completion
    - Show success message + status
    Estimate: 1 day

Total 3.2: 6-8 days

TICKET 3.3: Photo Upload & Storage
  3.3.1: Supabase Storage configuration
    - Buckets for completion photos
    - RLS policies (crew write, admin read)
    - Signed URLs for secure access
    Estimate: 1 day

  3.3.2: Photo upload handler (API route)
    - Handle multipart/form-data
    - Save to Supabase Storage
    - Extract EXIF data (timestamp, GPS)
    - Return photo URLs
    Estimate: 1.5 days

  3.3.3: Photo metadata capture
    - Extract or request GPS data
    - Capture timestamp
    - Store in database
    Estimate: 1 day

Total 3.3: 3-4 days

TICKET 3.4: QA Review Queue (Admin Dashboard)
  3.4.1: QA review card component
    - Job details display
    - Checklist review (items + crew responses)
    - Photo gallery (thumbnails + full-screen)
    - Crew notes display
    - Issue flags display
    Estimate: 2-3 days

  3.4.2: QA dashboard page
    - List of pending reviews (FIFO)
    - Card selection / fullscreen view
    - Filters (status, date range)
    - Count of pending
    Estimate: 2 days

  3.4.3: Admin decision flow
    - Approve button
    - Request Rework button (with reason)
    - Flag Critical button
    - Skip for now option
    - Notes field for Areli
    Estimate: 1.5 days

  3.4.4: Approval side effects
    - Generate completion report (PDF)
    - Send email to GC with photos + checklist
    - Mark job as complete/ready for invoicing
    - Log decision with timestamp
    Estimate: 2-3 days

Total 3.4: 7.5-9 days

TICKET 3.5: Issue Tracking System
  3.5.1: Issue log page
    - List all issues (open, resolved, disputed)
    - Filters (type, status, date, crew)
    - Sort options
    - Search by description
    Estimate: 1.5 days

  3.5.2: Issue detail view
    - Full issue information
    - Photos attached
    - Resolution notes
    - Timeline (created, updated, resolved)
    Estimate: 1 day

  3.5.3: Issue resolution workflow
    - Update issue status (open → reviewing → resolved)
    - Add resolution notes
    - Attach additional photos
    - Link to disputes (if applicable)
    Estimate: 1-2 days

Total 3.5: 3.5-4 days

TICKET 3.6: Completion Report Generation
  3.6.1: Report template design
    - Header (company branding, job info)
    - Checklist summary (items checked %)
    - Photo gallery (all submitted photos)
    - Issue summary (if any)
    - QA sign-off (Areli approval + date)
    Estimate: 1.5 days

  3.6.2: PDF generation API
    - Generate PDF from template
    - Include all photos
    - Attach to email
    - Store in Supabase Storage
    Estimate: 1.5 days

Total 3.6: 3 days

TICKET 3.7: Notifications & Alerts
  3.7.1: Crew notifications
    - SMS/push: "Rework requested for [address]"
    - App notification: "Rework details: [link]"
    - Email: Formal rework request with details
    Estimate: 1.5 days

  3.7.2: Admin alerts
    - Toast notification: "New QA review ready"
    - Badge count update
    - Optional: Daily digest email (pending reviews)
    Estimate: 1 day

Total 3.7: 2.5 days

TICKET 3.8: Testing & Documentation
  3.8.1: E2E test: Crew completion → QA approval
    - Crew uploads photos + checks checklist
    - Photos appear in Areli's queue
    - Checklist shows crew's responses
    - Areli approves
    - Report generated + email sent
    Estimate: 2 days

  3.8.2: Phase 3 documentation
    - User guides (crew mobile guide, admin QA guide)
    - Setup instructions
    - Release notes
    Estimate: 1 day

Total 3.8: 3 days

Phase 3 Total: 22-30 days (3-4 weeks, 1-2 developers)
```

### Phase 3 Summary

**Total Effort:** 3-4 weeks (1-2 developers)

**Deliverables:**
- ✅ Checklist template system (admin)
- ✅ Crew mobile job completion interface
- ✅ Photo upload + metadata capture
- ✅ QA review queue (admin dashboard)
- ✅ Issue tracking system
- ✅ Completion report generation + email
- ✅ Crew + admin notifications

**Success Criteria:**
- Crew can complete job with photos + checklist in <10 minutes
- Photos appear in Areli's queue within 30 seconds
- Areli can approve/rework job from QA card
- Issue flags are tracked in issue log
- Completion reports are generated + emailed
- E2E test passing

---

## PHASE 4: ADMIN DASHBOARD & ANALYTICS
### Full Administrative Intelligence System

**Objective:** Build comprehensive admin dashboard with operations, financial, crew performance, and reporting sections

**Duration:** 5-7 weeks (1-2 developers)

### Phase 4 Ticket Breakdown

```
TICKET 4.1: Operations Dashboard (Week 1-2)
  4.1.1: Dashboard overview page
    - Stats cards (active jobs, pending QA, alerts)
    - Quick action buttons (New job, New lead)
    - Recent activity feed
    Estimate: 2 days

  4.1.2: Active jobs board
    - Kanban-style (Scheduled, In Progress, Complete, Ready for QA)
    - Job cards with address, crew, ETA
    - Drag-to-update status
    - Click for job detail modal
    Estimate: 2.5 days (Kanban library needed)

  4.1.3: Crew assignment interface
    - View available crew for upcoming jobs
    - Drag-drop assign crew to jobs
    - Reassign crew if needed
    - Capacity calculation (hours scheduled)
    Estimate: 2 days

  4.1.4: Equipment/inventory tracking
    - Inventory list (mops, vacuums, chemicals)
    - Stock levels
    - Reorder alerts
    - Usage history
    Estimate: 2 days

Total 4.1: 8-9 days

TICKET 4.2: Financial Dashboard (Week 2-3)
  4.2.1: Revenue overview
    - Total revenue (this month, YTD, custom range)
    - Revenue by service type (bar chart)
    - Revenue by crew (leaderboard)
    - Profit vs revenue
    Estimate: 2-3 days

  4.2.2: Profitability analysis
    - Net profit calculation
    - Profit margin by job
    - Profit by crew member
    - Cost analysis (materials, labor)
    Estimate: 2 days

  4.2.3: Invoice management
    - List of invoices (pending, sent, paid)
    - Invoice detail view
    - Generate invoice from completed job
    - Email invoice to customer
    Estimate: 2.5 days

  4.2.4: Payment tracking
    - Payment status (unpaid, partial, paid)
    - Days outstanding / aging report
    - Late payment alerts
    Estimate: 1.5 days

Total 4.2: 8-9 days

TICKET 4.3: Crew Performance & Management (Week 2-4)
  4.3.1: Crew directory
    - List of crew members
    - Details (phone, email, hire date, status)
    - Search + filter
    - Add new crew member form
    Estimate: 1.5 days

  4.3.2: Crew performance dashboard
    - Jobs completed count
    - QA approval rate (%)
    - Rework rate (%)
    - Average rating/feedback
    - Common issues (histogram)
    Estimate: 2.5 days

  4.3.3: Individual crew profile page
    - Performance metrics
    - Job history
    - Issue history
    - Feedback/notes from Areli
    - Training recommendations
    Estimate: 2 days

  4.3.4: Crew scheduling
    - Calendar view (who's on which days)
    - Availability management
    - PTO / vacation management
    Estimate: 2 days

Total 4.3: 8 days

TICKET 4.4: Lead Pipeline & Conversion (Week 3-4)
  4.4.1: Lead pipeline board
    - Kanban: New, Quote Sent, Negotiating, Won, Lost
    - Lead cards with company, contact, value
    - Drag-to-update status
    - Click for lead detail
    Estimate: 2.5 days

  4.4.2: Lead tracking metrics
    - Conversion rate (leads → jobs)
    - Average deal value
    - Sales cycle length (days from lead to job)
    - Lead source attribution (how did we find them?)
    Estimate: 2 days

  4.4.3: Quote history
    - All quotes sent
    - Acceptance rate (quote → job)
    - Average quote value
    - Quote by crew member / sales rep
    Estimate: 1.5 days

  4.4.4: Lead detail page
    - Company info + contact info
    - Quote history
    - Job history
    - Communication log
    - Next action / follow-up date
    Estimate: 2 days

Total 4.4: 8 days

TICKET 4.5: Quality & Compliance Reporting (Week 4-5)
  4.5.1: QA metrics dashboard
    - Overall approval rate (%)
    - Rework rate (%)
    - Common issues (tally)
    - Crew quality ranking (approval % by crew)
    - Trend over time (chart)
    Estimate: 2 days

  4.5.2: Monthly QA report
    - Summary of jobs reviewed
    - Top performers (highest approval rate)
    - Improvement areas (common issues)
    - Recommended training topics
    Estimate: 1.5 days

  4.5.3: Issue trend analysis
    - Issue count by type over time
    - Issue resolution time (avg days open)
    - Crew member issue correlation (who has most issues)
    Estimate: 1.5 days

Total 4.5: 5 days

TICKET 4.6: Reporting & Exports (Week 5-6)
  4.6.1: Monthly business report
    - Revenue, profit, margins
    - Jobs completed, crew hours
    - Lead metrics (count, conversion)
    - QA summary (approval rate, issues)
    - P&L statement format
    Estimate: 2 days

  4.6.2: Export to PDF/CSV
    - Dashboards exportable as PDF
    - Data tables exportable as CSV
    - Scheduled report delivery (email)
    Estimate: 1.5 days

  4.6.3: Custom report builder (optional)
    - Select metrics to include
    - Select date range
    - Group by (crew, service type, location)
    - Export results
    Estimate: 2 days (defer if time-constrained)

Total 4.6: 3.5-5 days

TICKET 4.7: Admin Settings & Integrations (Week 5-6)
  4.7.1: Company settings
    - Company name, address, phone
    - Logo + branding
    - Currency, timezone
    - Payment settings
    Estimate: 1 day

  4.7.2: User management
    - Invite new admin/manager users
    - User roles + permissions
    - Two-factor authentication setup
    - Audit log (who did what, when)
    Estimate: 2 days

  4.7.3: Integration management
    - QuickBooks sync status
    - Calendar (job scheduling)
    - SMS/email provider settings
    - Twilio API configuration
    Estimate: 1.5 days

Total 4.7: 4.5 days

TICKET 4.8: Mobile Admin App (Optional, Week 6-7)
  Description: Admin-specific mobile interface (dashboard, quick checklist review)
  Estimate: 3-5 days (can defer to Phase 5)

TICKET 4.9: Testing, Performance & Documentation (Week 7)
  4.9.1: Performance optimization
    - Dashboard query optimization (avoid N+1)
    - Chart rendering performance
    - Data loading optimization
    Estimate: 2 days

  4.9.2: E2E tests for critical flows
    - Create job → assign crew → complete → approve
    - Create lead → send quote → convert to job
    - Generate monthly report
    Estimate: 2-3 days

  4.9.3: Documentation
    - Admin user guide
    - Release notes
    - API documentation updates
    Estimate: 1.5 days

Total 4.9: 5-6.5 days

Phase 4 Total: 35-45 days (5-6.5 weeks, 1-2 developers)
```

### Phase 4 Summary

**Total Effort:** 5-7 weeks (1-2 developers)

**Deliverables:**
- ✅ Operations dashboard (active jobs, crew assignment)
- ✅ Financial dashboard (revenue, profitability, invoicing)
- ✅ Crew management (directory, performance metrics, scheduling)
- ✅ Lead pipeline tracking (conversion metrics)
- ✅ Quality reporting (QA metrics, trend analysis)
- ✅ Exports & monthly reports (PDF, CSV)
- ✅ Admin settings & user management
- ✅ Comprehensive documentation

**Success Criteria:**
- Dashboard loads in <2 seconds
- All visualizations render smoothly
- Reports generate and export in <10 seconds
- E2E tests passing
- Admin can make all operational decisions from dashboard
- Mobile responsiveness maintained (tablet view)

---

## PHASE 5+: ADVANCED FEATURES
### AI, Automation, Mobile App

**Scope (Not Phase 1-4):**

### 5.1 Mobile Crew App
```
- Full crew interface on mobile
- Job details + directions / map navigation
- Real-time crew location tracking
- Job completion workflow (integrated with Phase 3)
- Timecard / clock in-out
- Communication (SMS, in-app messaging)
- Training module (video guide access)
- Performance feedback
Estimated effort: 30-40 days
Priority: Medium (crews can use web app initially)
```

### 5.2 Advanced Scheduling
```
- Automatic crew assignment (algorithm)
- Route optimization (minimize travel time)
- Load balancing (even distribution of work)
- Skill-based matching (crew → job type)
- Capacity planning (prevent overload)
Estimated effort: 20-25 days
Priority: Medium (manual assignment works initially)
```

### 5.3 AI Enhancements
```
- Damage detection from photos (image recognition)
- Automated quote suggestions (ML-based pricing)
- Lead scoring (predict conversion likelihood)
- Predictive maintenance (equipment failure alerts)
Estimated effort: 30-40 days
Priority: Low (MVP works with manual system)
```

### 5.4 PWA & Offline Support
```
- Offline functionality (crew app works without internet)
- Push notifications
- App shell caching
- Sync queue (background sync of photos, etc.)
Estimated effort: 10-15 days
Priority: Low (can start with web app)
```

### 5.5 Advanced Analytics
```
- Cohort analysis (customer lifetime value)
- Churn prediction
- Customer segmentation
- Marketing ROI tracking
- Advanced dashboards (drill-down, pivots)
Estimated effort: 20-25 days
Priority: Low (Phase 4 reporting sufficient initially)
```

---

## TECHNICAL DEPENDENCIES

### Database Schema Expansion

```
TABLES TO CREATE (Phases 1-4):

Phase 1:
├─ profiles (users)
├─ jobs (enhanced)
├─ API logs

Phase 2:
├─ design_tokens (if storing as data)
└─ feature_flags

Phase 3:
├─ checklist_templates
├─ checklist_items
├─ job_checklists
├─ job_checklist_items
├─ job_completions
├─ completion_photos
├─ issues
├─ issue_photos
└─ resource_library

Phase 4:
├─ invoices
├─ revenue_items (line items per invoice)
├─ crew_performance (denormalized for analytics)
├─ lead_pipeline_stages
├─ conversion_funnels
└─ audit_logs

Total new tables: 20-25
Migration strategy: 1 migration per phase
```

### API Routes to Create

```
Phase 1:
├─ /api/quote-request (existing - potentially enhance)
├─ /api/quote-email (existing)
└─ /api/notifications

Phase 2:
├─ /api/navigation (if needed)
└─ /api/components (component metadata)

Phase 3:
├─ /api/checklists/templates
├─ /api/jobs/{id}/complete
├─ /api/photos/upload
├─ /api/qa/queue
├─ /api/qa/{id}/approve
├─ /api/qa/{id}/rework
├─ /api/issues
└─ /api/reports/completion-pdf

Phase 4:
├─ /api/admin/dashboard
├─ /api/admin/financials
├─ /api/admin/crew-performance
├─ /api/admin/lead-pipeline
├─ /api/admin/exports
└─ /api/admin/reports

Total new routes: 20-25
```

### External Integrations

#### **Required:**
- Supabase (database + storage) - existing
- Twilio (SMS) - existing
- Email service (SendGrid, AWS SES) - existing
- AWS or Vercel (hosting) - existing

#### **Phase 3-4 (New):**
- GPS service (Mapbox or Google Maps - for photo location)
- PDF generation library (pdf-lib, jsPDF)
- Date library (date-fns, Day.js)
- Chart library (Recharts, Chart.js)
- Kanban library (react-beautiful-dnd, TanStack Solid)

#### **Optional Phase 5+:**
- AI/ML (Claude API for quote suggestions, image detection)
- Scheduling service (Bull, RabbitMQ for background jobs)
- Analytics (Mixpanel, Amplitude)

### Feature Flags & A/B Testing

```
Recommend implementing feature flags before Phase 2:
- Phase 2 navigation behind flag (rollout gradually)
- QA module behind flag (only for Areli initially)
- Admin dashboard features behind flags (role-based)

Libraries: LaunchDarkly, DevCycle, or custom solution
```

---

## TIMELINE & CAPACITY PLANNING

### Ideal Scenario (2 Full-Time Developers)

```
WEEK 1-3:     Phase 1 (Polish existing)       Dev 1
              ├─ Quote form + validation
              ├─ Error pages
              ├─ Notification system
              ├─ Security + SEO
              └─ E2E tests

WEEK 4-9:     Phase 2 (Navigation + Components)  Dev 1 + Dev 2
              ├─ Navigation impl (Dev 1)
              └─ Component library (Dev 1 + 2)

WEEK 10-13:   Phase 3 (QA Module)        Dev 1 + Dev 2
              ├─ Crew interface (Dev 1)
              ├─ Photo system (Dev 2)
              ├─ Admin QA review (Dev 1)
              ├─ Issue tracking (Dev 2)
              └─ Completion reports (Dev 1 + 2)

WEEK 14-20:   Phase 4 (Admin Dashboard)  Dev 1 + Dev 2
              ├─ Operations + crew (Dev 1)
              ├─ Financial + analytics (Dev 2)
              └─ Reports + exports (Dev 1 + 2)

TOTAL:        20 weeks (~5 months)
```

### Lean Scenario (1 Full-Time Developer)

```
WEEK 1-3:     Phase 1
WEEK 4-11:    Phase 2 (extended timeline)
WEEK 12-16:   Phase 3
WEEK 17-30:   Phase 4 (extended timeline)

TOTAL:        30 weeks (~7 months)
```

### Risk Buffer

- Add 20-30% buffer for:
  - Design review cycles
  - Testing & bug fixes
  - Scope creep
  - Technical debt
  - Unplanned issues

**Conservative estimate: 6-9 months for Phases 1-4**

---

## RISK ASSESSMENT

### Critical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Photo GPS data unreliable | Medium | High | Mock data in dev, test with real devices early |
| Crew adoption slow (Phase 3) | Medium | High | Early user testing, iterative feedback, training materials |
| Photo upload errors at scale | Low | High | Load testing, retry logic, error handling |
| Admin dashboard performance | Low | High | Query optimization, database indexing, caching |

### High Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Scope creep (Phase 4) | High | Medium | Strict ticket management, clear MVP definition |
| Integration issues (Twilio, SMS) | Medium | Medium | Early integration testing, backup providers |
| Mobile browser compatibility | Medium | Medium | Test on real devices, progressive enhancement |
| Timeline delays (holidays, illness) | Medium | Medium | 20-30% buffer built in, parallel workstreams |

### Medium Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Design iterations needed | High | Low | Front-load design review in Phase 1-2 |
| Database migration issues | Low | Medium | Dry-run migrations, backup strategy |
| Third-party API rate limits | Low | Low | Monitor usage, implement backoff |

---

## SUCCESS METRICS

### Phase 1 Success
- ✅ Quote form validation working (error rate < 5%)
- ✅ Mobile responsiveness verified
- ✅ No critical security issues
- ✅ SEO metadata complete
- ✅ E2E tests passing

### Phase 2 Success
- ✅ All 50+ components documented in Storybook
- ✅ Navigation tested on mobile/tablet/desktop
- ✅ WCAG 2.1 AA compliance ≥95%
- ✅ Component adoption across codebase (no old styles)

### Phase 3 Success
- ✅ Crew can complete job with photos in <10 minutes
- ✅ Photos in QA queue within 30 seconds
- ✅ Issue tracking covers 100% of job completions
- ✅ Completion reports generated + emailed reliably

### Phase 4 Success
- ✅ Admin can run business from dashboard
- ✅ All reports export in <10 seconds
- ✅ Dashboard queries complete in <2 seconds
- ✅ Crew performance visible (data-driven decisions)

### Overall Success
- ✅ **Code Quality:** Test coverage ≥80%, ESLint 0 errors
- ✅ **Performance:** Core Web Vitals: LCP<2.5s, FID<100ms, CLS<0.1
- ✅ **Accessibility:** WCAG 2.1 AA ≥95%
- ✅ **Documentation:** User guides + API docs complete
- ✅ **Reliability:** Uptime ≥99.9%, error rate <1%

---

## DEVELOPER HANDOFF CHECKLIST

### Pre-Implementation

- [ ] Design system finalized (Phase 2B approved)
- [ ] All requirements documented (this spec)
- [ ] Database schema reviewed
- [ ] API route list documented
- [ ] Testing strategy agreed
- [ ] DevOps setup complete (CI/CD, staging environment)

### During Implementation

- [ ] Weekly sync with stakeholder (Areli)
- [ ] Design review at each phase end
- [ ] Code review process established
- [ ] Testing checklist for each ticket
- [ ] Progress tracking (burndown chart)

### Pre-Launch

- [ ] All Phase 1-4 tickets completed
- [ ] Test coverage ≥80%
- [ ] Security audit passed
- [ ] Performance audit passed
- [ ] Accessibility audit passed
- [ ] UAT completed (end-user validation)
- [ ] Documentation complete + screenshots
- [ ] Crew + admin training materials prepared
- [ ] Launch checklist reviewed

### Post-Launch

- [ ] Monitor error rates (< 1%)
- [ ] Monitor performance (LCP < 2.5s)
- [ ] Crew + admin feedback collection
- [ ] Bug triage process (hotfix vs. backlog)
- [ ] Plan Phase 5 features
- [ ] Keep documentation updated

---

## APPENDIX: TICKET ESTIMATION METHODOLOGY

### Estimation Scale
```
1/2 day  = Quick fix / minor component
1 day    = Single feature, low complexity
1.5-2 days = Feature with integration, medium complexity
2-3 days = Complex feature, multiple integrations
3-5 days = Large feature, high uncertainty
5+ days  = Decompose into smaller tickets
```

### Buffer Policy
```
Actual effort = estimate + 20-30% buffer
E.g. "2 days" = plan for 2.4-2.6 days

Unknown unknowns get 30% buffer
Known risks get specific mitigation task
```

---

## APPENDIX: TESTING STRATEGY

### Unit Tests
- Core utilities (validation, formatting)
- Component props + rendering
- API response handling

### Integration Tests
- Crew photo upload → database → admin view
- Job completion → QA card creation → approval
- Lead creation → quote → job conversion

### E2E Tests
- User journey: Quote request form → email received
- Crew journey: Complete job → photos in QA → approval
- Admin journey: View dashboard → export report

### Performance Tests
- Dashboard load time (<2s)
- Photo gallery scroll (60 FPS)
- Report generation (<10s)

### Accessibility Tests
- Keyboard navigation (Tab through all fields)
- Screen reader (VoiceOver, NVDA)
- Color contrast (automated tools)
- Focus indicators (visible)

---

## APPENDIX: COMMUNICATION PLAN

### Stakeholder Updates
- Weekly 15-min sync (progress, blockers)
- Bi-weekly design review
- Monthly all-hands (milestones, roadmap)

### User Feedback
- Monthly crew + admin feedback surveys
- In-app feedback button
- Support ticket tracking (what's broken)

### Documentation
- Storybook for components (living documentation)
- User guides (how to use QA module, dashboard, etc.)
- API documentation (Swagger/OpenAPI)
- README updates (architecture decisions)

---

## NEXT STEPS

1. **Approve this Phase 3 specification** ← You are here
2. **Finalize scope + timeline** with stakeholders
3. **Allocate development resources** (1-2 developers)
4. **Set up development environment** (CI/CD, staging)
5. **Create Jira/Linear tickets** from this spec
6. **Begin Phase 1 implementation**

---

**Status:** ✅ Complete - Ready for development kickoff  
**Created:** March 19, 2026  
**Version:** 1.0 (Master Spec 2.0)

