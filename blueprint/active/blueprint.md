# Website Blueprint (Current State)

Date: 2026-04-13
Status: Active reference
Purpose: This is the operating blueprint for the website as-built: what each area does, how it works, why it matters, and where it lives in code.

## 1. Executive Summary

The platform has three major product surfaces:
1. Public marketing and quote-conversion site
2. Admin operations dashboard
3. Employee execution portal

The current implementation is mature in feature breadth, with strong conversion, operations, and field-execution coverage. Most remaining program work is no longer about missing UI features; it is about runtime verification and closure evidence for the final security/RLS/retry-path items tracked in:
- [blueprint/active/solutioning-guide.md](./solutioning-guide.md)
- [blueprint/active/bring-it-to-an-a.md](./bring-it-to-an-a.md)

## 2. Architecture Blueprint

### 2.1 Route and app shell structure

The application is organized by route groups in Next.js:
- Root shell and metadata: [Production-workspace/src/app/layout.tsx](../../Production-workspace/src/app/layout.tsx)
- Public layout wrapper: [Production-workspace/src/app/(public)/layout.tsx](../../Production-workspace/src/app/%28public%29/layout.tsx)
- Admin route: [Production-workspace/src/app/(admin)/admin/page.tsx](../../Production-workspace/src/app/%28admin%29/admin/page.tsx)
- Employee route: [Production-workspace/src/app/(employee)/employee/page.tsx](../../Production-workspace/src/app/%28employee%29/employee/page.tsx)
- Admin auth route: [Production-workspace/src/app/(auth)/auth/admin/page.tsx](../../Production-workspace/src/app/%28auth%29/auth/admin/page.tsx)
- Employee auth route: [Production-workspace/src/app/(auth)/auth/employee/page.tsx](../../Production-workspace/src/app/%28auth%29/auth/employee/page.tsx)

### 2.2 Core platform contracts

- Global middleware and request gating: [Production-workspace/middleware.ts](../../Production-workspace/middleware.ts)
- Environment contracts: [Production-workspace/src/lib/env.ts](../../Production-workspace/src/lib/env.ts)
- Canonical site URL helpers: [Production-workspace/src/lib/site.ts](../../Production-workspace/src/lib/site.ts)
- Canonical company constants: [Production-workspace/src/lib/company.ts](../../Production-workspace/src/lib/company.ts)
- Robots rules: [Production-workspace/src/app/robots.ts](../../Production-workspace/src/app/robots.ts)
- Sitemap generation: [Production-workspace/src/app/sitemap.ts](../../Production-workspace/src/app/sitemap.ts)

Impact:
1. Keeps metadata/canonical hygiene consistent across all pages.
2. Centralizes environmental safety checks.
3. Establishes the base for SEO, analytics attribution, and route-level UX behavior.

## 3. Public Site Blueprint

### 3.1 Public shell and orchestration layer

Primary shell:
- [Production-workspace/src/components/public/PublicChrome.tsx](../../Production-workspace/src/components/public/PublicChrome.tsx)

What it does:
1. Wraps all public pages with shared header/footer and conversion surfaces.
2. Mounts floating quote panel and AI assistant.
3. Captures attribution params into session state.
4. Tracks section visibility and scroll depth analytics.
5. Manages modal/page inerting to reduce interaction conflicts.

Business impact:
1. Improves conversion reliability by keeping quote access persistent.
2. Preserves campaign attribution continuity across navigation.
3. Enables behavioral analytics for section-level optimization.

### 3.2 Homepage blueprint (/)

Entry route:
- [Production-workspace/src/app/(public)/page.tsx](../../Production-workspace/src/app/%28public%29/page.tsx)

Composition:
- [Production-workspace/src/components/public/variant-a/VariantAPublicPage.tsx](../../Production-workspace/src/components/public/variant-a/VariantAPublicPage.tsx)

#### Homepage section-by-section

1. Hero section
- File: [Production-workspace/src/components/public/variant-a/HeroSection.tsx](../../Production-workspace/src/components/public/variant-a/HeroSection.tsx)
- Functionality:
  - Dynamic mobile hero variant memory/query override
  - Two primary conversion CTAs (quote + direct call)
  - Trust signal bands (licensed, response, bilingual)
  - Hero animation orchestration and variant tracking event
- Impact:
  - Defines first-impression conversion direction
  - Supports mobile-specific optimization experiments
  - Anchors trust and urgency within first viewport

2. Authority bar
- File: [Production-workspace/src/components/public/variant-a/AuthorityBar.tsx](../../Production-workspace/src/components/public/variant-a/AuthorityBar.tsx)
- Functionality:
  - In-view counter animations for proof metrics
  - Credential tile and trust-rating strip
- Impact:
  - Converts abstract claims into measurable proof
  - Increases confidence for high-friction service decisions

3. Service spread section
- File: [Production-workspace/src/components/public/variant-a/ServiceSpreadSection.tsx](../../Production-workspace/src/components/public/variant-a/ServiceSpreadSection.tsx)
- Functionality:
  - Desktop showcase + mobile accordion service exploration
  - Service-specific quote CTA mapping via service type map
  - Analytics on service expansion interactions
- Impact:
  - Drives service-qualified lead capture instead of generic leads
  - Reduces friction for mobile users with compact accordion flow

4. Offer and industry section
- File: [Production-workspace/src/components/public/variant-a/OfferAndIndustrySection.tsx](../../Production-workspace/src/components/public/variant-a/OfferAndIndustrySection.tsx)
- Functionality:
  - Industry segmentation cards with fit/pain/outcome framing
  - Industry-specific CTA routing and links to industry pages
- Impact:
  - Improves message-match by audience segment
  - Increases likelihood that leads self-identify the correct scope

5. Timeline section
- File: [Production-workspace/src/components/public/variant-a/TimelineSection.tsx](../../Production-workspace/src/components/public/variant-a/TimelineSection.tsx)
- Functionality:
  - Four-step process explanation with in-view reveals
  - Visual narrative from request to walkthrough handoff
- Impact:
  - Reduces uncertainty about delivery process
  - Improves trust for operations-heavy buyers (GC/PM audiences)

6. Before/after proof section
- File: [Production-workspace/src/components/public/variant-a/BeforeAfterSlider.tsx](../../Production-workspace/src/components/public/variant-a/BeforeAfterSlider.tsx)
- Functionality:
  - Interactive image comparison slider with keyboard support
  - Multi-project tabs (office/turnover/post-construction)
  - Auto-intro and manual drag/swipe interaction
- Impact:
  - Visual evidence of quality standards
  - Strengthens buyer confidence in outcomes, not just promises

7. Testimonial section
- File: [Production-workspace/src/components/public/variant-a/TestimonialSection.tsx](../../Production-workspace/src/components/public/variant-a/TestimonialSection.tsx)
- Functionality:
  - Rotating social proof carousel with controls/swipe support
  - Pause-on-focus/hover behavior
- Impact:
  - Adds third-party trust validation
  - Supports credibility for higher-ticket project cleaning work

8. Quote section
- File: [Production-workspace/src/components/public/variant-a/QuoteSection.tsx](../../Production-workspace/src/components/public/variant-a/QuoteSection.tsx)
- Functionality:
  - Form-led quote intake with validation and anti-spam honeypot
  - Service/timeline structured fields
  - Parallel call CTA path
- Impact:
  - Core conversion endpoint for marketing funnel
  - Improves lead qualification quality before admin handling

9. Exit-intent overlay
- File: [Production-workspace/src/components/public/variant-a/ExitIntentOverlay.tsx](../../Production-workspace/src/components/public/variant-a/ExitIntentOverlay.tsx)
- Functionality:
  - Behavioral trigger (time + scroll + mouse leave)
  - Quote re-engagement offer with dismiss/accept telemetry
  - Focus-trapped dialog behavior
- Impact:
  - Recovers abandoning visitors
  - Adds a final conversion checkpoint before drop-off

10. Floating quote panel
- File: [Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx](../../Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx)
- Functionality:
  - Two-step compact quote flow
  - Abandon/bounce analytics
  - Focus-trapped modal drawer with safe-area handling
- Impact:
  - Persistent conversion path across browsing depth
  - Better mobile completion than full-page form-only strategy

11. AI quote assistant
- File: [Production-workspace/src/components/public/variant-a/AIQuoteAssistant.tsx](../../Production-workspace/src/components/public/variant-a/AIQuoteAssistant.tsx)
- Functionality:
  - Bilingual chat UI
  - API-backed conversational intake via ai-assistant route
  - Suppression near key CTAs to reduce visual conflict
  - Focus-trapped dialog behavior
- Impact:
  - Captures users preferring conversational onboarding
  - Increases conversion opportunities for uncertain or early-stage prospects

### 3.3 Individual page coverage and detail depth

#### About page
- Route: [Production-workspace/src/app/(public)/about/page.tsx](../../Production-workspace/src/app/%28public%29/about/page.tsx)
- Covers:
  - Origin story and operating philosophy
  - Standards framework and credentials
  - Numeric proof points and trust reinforcement
- Impact:
  - Supports credibility checks from decision-makers
  - Reduces risk perception for larger contracts

#### Services index
- Route: [Production-workspace/src/app/(public)/services/page.tsx](../../Production-workspace/src/app/%28public%29/services/page.tsx)
- Covers:
  - Service catalog and package framing
  - Deep links to detailed service pages
- Impact:
  - Helps prospects self-route to relevant scope pages
  - Improves qualification quality before quote request

#### Service detail pages
- Routes:
  - [Production-workspace/src/app/(public)/services/post-construction-cleaning/page.tsx](../../Production-workspace/src/app/%28public%29/services/post-construction-cleaning/page.tsx)
  - [Production-workspace/src/app/(public)/services/final-clean/page.tsx](../../Production-workspace/src/app/%28public%29/services/final-clean/page.tsx)
  - [Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx](../../Production-workspace/src/app/%28public%29/services/commercial-cleaning/page.tsx)
  - [Production-workspace/src/app/(public)/services/move-in-move-out-cleaning/page.tsx](../../Production-workspace/src/app/%28public%29/services/move-in-move-out-cleaning/page.tsx)
  - [Production-workspace/src/app/(public)/services/windows-power-wash/page.tsx](../../Production-workspace/src/app/%28public%29/services/windows-power-wash/page.tsx)
- Shared hardening component:
  - [Production-workspace/src/components/public/variant-a/ServicePageHardening.tsx](../../Production-workspace/src/components/public/variant-a/ServicePageHardening.tsx)
- Covers:
  - Service-specific positioning, outcomes, and FAQ schema patterns
  - Tailored CTA and contact pathways
- Impact:
  - Strengthens SEO depth and intent match
  - Increases conversion quality by narrowing ambiguity

#### Industries pages
- Routes:
  - Index: [Production-workspace/src/app/(public)/industries/page.tsx](../../Production-workspace/src/app/%28public%29/industries/page.tsx)
  - Detail: [Production-workspace/src/app/(public)/industries/[slug]/page.tsx](../../Production-workspace/src/app/%28public%29/industries/%5Bslug%5D/page.tsx)
- Covers:
  - Segment-specific pains, outcomes, social proof, and FAQ
- Impact:
  - Improves persona resonance for GC/property/commercial buyers

#### Service area pages
- Routes:
  - Metro index: [Production-workspace/src/app/(public)/service-area/page.tsx](../../Production-workspace/src/app/%28public%29/service-area/page.tsx)
  - City detail: [Production-workspace/src/app/(public)/service-area/[slug]/page.tsx](../../Production-workspace/src/app/%28public%29/service-area/%5Bslug%5D/page.tsx)
- Covers:
  - Coverage geography, city-level context, nearby-area links
- Impact:
  - Supports local intent conversion and geo trust

#### Contact page
- Route: [Production-workspace/src/app/(public)/contact/page.tsx](../../Production-workspace/src/app/%28public%29/contact/page.tsx)
- Covers:
  - Contact modalities, response expectations, service-type framing
  - Contact form flow via contact page client
- Impact:
  - Captures users who prefer direct contact over quote form flow

#### Careers page
- Route: [Production-workspace/src/app/(public)/careers/page.tsx](../../Production-workspace/src/app/%28public%29/careers/page.tsx)
- Form component: [Production-workspace/src/components/public/EmploymentApplicationForm.tsx](../../Production-workspace/src/components/public/EmploymentApplicationForm.tsx)
- Covers:
  - Hiring expectations and process
  - Structured employment application intake
- Impact:
  - Builds staffing pipeline directly from web traffic

#### FAQ page
- Route: [Production-workspace/src/app/(public)/faq/page.tsx](../../Production-workspace/src/app/%28public%29/faq/page.tsx)
- FAQ component: [Production-workspace/src/components/public/variant-a/FAQSection.tsx](../../Production-workspace/src/components/public/variant-a/FAQSection.tsx)
- Covers:
  - Objection handling, service expectations, and readiness CTAs
- Impact:
  - Reduces pre-sales friction and repetitive inquiry load

#### Legal pages
- Privacy: [Production-workspace/src/app/(public)/privacy/page.tsx](../../Production-workspace/src/app/%28public%29/privacy/page.tsx)
- Terms: [Production-workspace/src/app/(public)/terms/page.tsx](../../Production-workspace/src/app/%28public%29/terms/page.tsx)
- Impact:
  - Compliance and trust posture for commercial clients

#### Quote lifecycle pages
- Quote review/respond page: [Production-workspace/src/app/quote/[token]/page.tsx](../../Production-workspace/src/app/quote/%5Btoken%5D/page.tsx)
- Quote success page: [Production-workspace/src/app/quote/success/page.tsx](../../Production-workspace/src/app/quote/success/page.tsx)
- Covers:
  - Customer-facing quote acceptance/rejection
  - Confirmation flow and post-submit guidance
- Impact:
  - Closes the loop from lead intake to commercial acceptance

## 4. Admin Dashboard Blueprint

### 4.1 Admin shell

- Page entry: [Production-workspace/src/app/(admin)/admin/page.tsx](../../Production-workspace/src/app/%28admin%29/admin/page.tsx)
- Shell orchestration: [Production-workspace/src/components/admin/AdminShell.tsx](../../Production-workspace/src/components/admin/AdminShell.tsx)
- Nav: [Production-workspace/src/components/admin/AdminSidebarNav.tsx](../../Production-workspace/src/components/admin/AdminSidebarNav.tsx)
- Error boundary: [Production-workspace/src/components/admin/AdminModuleErrorBoundary.tsx](../../Production-workspace/src/components/admin/AdminModuleErrorBoundary.tsx)

Functional role:
1. Module routing and persistence
2. Mobile drawer and responsive admin frame
3. Accessibility baseline (skip link, focus target, focus trap)
4. Global status announcements

Operational impact:
1. Reduces module-switch friction
2. Prevents module-level crashes from taking down full admin surface
3. Improves operator speed and accessibility compliance

### 4.2 Admin module deep breakdown

1. Overview dashboard
- File: [Production-workspace/src/components/admin/OverviewDashboard.tsx](../../Production-workspace/src/components/admin/OverviewDashboard.tsx)
- Functional scope:
  - Morning-briefing style operational snapshot
  - Unclaimed leads, QA pending, today schedule, waiting quotes
  - Weekly lead conversion and QA pass-rate calculations
- Data dependencies:
  - leads, jobs, job_assignments, quotes
- Impact:
  - Creates a daily command center for what needs attention first

2. Lead pipeline
- File: [Production-workspace/src/components/admin/LeadPipelineClient.tsx](../../Production-workspace/src/components/admin/LeadPipelineClient.tsx)
- Functional scope:
  - Kanban-like lead progression through full lifecycle
  - Quick response messaging
  - Quote drafting, review, send
  - Lead conversion and quote-to-job creation
  - Overlap-aware scheduling checks
- Data and APIs:
  - /api/lead-message, /api/quote-send, /api/quote-create-job, profile and quote templates
- Impact:
  - Primary revenue pipeline control surface
  - Converts inbound demand into scheduled work

3. Ticket management
- File: [Production-workspace/src/components/admin/TicketManagementClient.tsx](../../Production-workspace/src/components/admin/TicketManagementClient.tsx)
- Functional scope:
  - Ticket creation flow
  - Ticket duplication and status updates
  - QA review states including rework and approval
  - Completion-report auto-trigger path after QA approval
- APIs and tables:
  - /api/ticket-create, /api/completion-report, jobs/job_assignments/checklists
- Impact:
  - Core execution control for operations and quality integrity

4. Dispatch module
- File: [Production-workspace/src/components/admin/DispatchModule.tsx](../../Production-workspace/src/components/admin/DispatchModule.tsx)
- Supporting files:
  - [Production-workspace/src/components/admin/DispatchFiltersClient.tsx](../../Production-workspace/src/components/admin/DispatchFiltersClient.tsx)
  - [Production-workspace/src/components/admin/BulkJobActionsClient.tsx](../../Production-workspace/src/components/admin/BulkJobActionsClient.tsx)
- Functional scope:
  - Dispatch queue visibility with filtering and paging
  - Selection mode and bulk-action workflow
- Impact:
  - Speeds up high-volume job coordination
  - Reduces repetitive single-row admin actions

5. Scheduling and availability
- File: [Production-workspace/src/components/admin/SchedulingAndAvailabilityClient.tsx](../../Production-workspace/src/components/admin/SchedulingAndAvailabilityClient.tsx)
- Functional scope:
  - Week/day scheduler visualization
  - Availability window management
  - Conflict detection:
    - job vs unavailability
    - job vs job overlap
  - Reassignment controls
- Impact:
  - Prevents double-booking and staffing blind spots
  - Improves on-time execution confidence

6. Inventory management
- File: [Production-workspace/src/components/admin/InventoryManagementClient.tsx](../../Production-workspace/src/components/admin/InventoryManagementClient.tsx)
- Functional scope:
  - Supply item creation and stock metadata
  - Low-stock alerts
  - Supply request review and status changes
- Impact:
  - Keeps crews supplied
  - Reduces service disruption from inventory gaps

7. Unified insights
- File: [Production-workspace/src/components/admin/UnifiedInsightsClient.tsx](../../Production-workspace/src/components/admin/UnifiedInsightsClient.tsx)
- Functional scope:
  - Multi-tab executive reporting (overview, operations, quality, financials, hiring, inventory)
  - Range-based trend computation
  - Crew utilization and overlap detection
  - Invoice-aging and funnel/queue metrics
- Impact:
  - Consolidates cross-functional metrics in one analytical surface
  - Supports decision-making for resourcing and growth

8. Notification center
- File: [Production-workspace/src/components/admin/NotificationCenterClient.tsx](../../Production-workspace/src/components/admin/NotificationCenterClient.tsx)
- Functional scope:
  - Notification preference management
  - Dispatch queue visibility and retries
  - Assignment-notification resend controls
  - Manual dispatch run trigger
- APIs:
  - /api/notification-dispatch, /api/assignment-notify
- Impact:
  - Improves communication reliability with crew and customers
  - Provides recovery controls for failed notification paths

9. Hiring inbox
- File: [Production-workspace/src/components/admin/HiringInboxClient.tsx](../../Production-workspace/src/components/admin/HiringInboxClient.tsx)
- Functional scope:
  - Employment application triage with status workflow
  - Search, sort, filtering, paging
  - Detail view with admin notes and transition controls
- Impact:
  - Gives recruiting operations a structured funnel inside admin
  - Reduces dependency on external tooling for candidate lifecycle

10. Configuration stack
- Container: [Production-workspace/src/components/admin/ConfigurationClient.tsx](../../Production-workspace/src/components/admin/ConfigurationClient.tsx)
- Submodules:
  - Quote templates: [Production-workspace/src/components/admin/QuoteTemplateManagerClient.tsx](../../Production-workspace/src/components/admin/QuoteTemplateManagerClient.tsx)
  - Post-job automation settings: [Production-workspace/src/components/admin/PostJobAutomationSettingsClient.tsx](../../Production-workspace/src/components/admin/PostJobAutomationSettingsClient.tsx)
  - First-run wizard: [Production-workspace/src/components/admin/FirstRunWizardClient.tsx](../../Production-workspace/src/components/admin/FirstRunWizardClient.tsx)
- Impact:
  - Centralizes system behavior tuning without direct SQL/code edits

## 5. Employee Dashboard Blueprint

### 5.1 Employee shell and navigation

- Entry route: [Production-workspace/src/app/(employee)/employee/page.tsx](../../Production-workspace/src/app/%28employee%29/employee/page.tsx)
- Tab orchestration: [Production-workspace/src/components/employee/EmployeePortalTabs.tsx](../../Production-workspace/src/components/employee/EmployeePortalTabs.tsx)

Functional role:
1. Fast mobile-first execution surface for field staff
2. Job and supply workflows in a simplified interaction model

### 5.2 Employee feature breakdown

1. Assignment and job center
- File: [Production-workspace/src/components/employee/EmployeeTicketsClient.tsx](../../Production-workspace/src/components/employee/EmployeeTicketsClient.tsx)
- Functional scope:
  - Assignment fetch and timeline grouping
  - Status progression and completion flow
  - Checklist, issue reporting, messaging, photo workflows
  - Offline-safe photo queue integration and retry path
- Impact:
  - Turns schedule into executable task flow for crews
  - Preserves completion evidence even under unstable connectivity

2. Assignment card and status controls
- File: [Production-workspace/src/components/employee/EmployeeAssignmentCard.tsx](../../Production-workspace/src/components/employee/EmployeeAssignmentCard.tsx)
- Functional scope:
  - Expandable card pattern
  - Status select, progress markers, maps link
- Impact:
  - Reduces cognitive load while keeping key controls accessible

3. Checklist execution
- File: [Production-workspace/src/components/employee/EmployeeChecklistView.tsx](../../Production-workspace/src/components/employee/EmployeeChecklistView.tsx)
- Functional scope:
  - Item-level completion toggles and progress count
- Impact:
  - Improves quality adherence and completion traceability

4. Issue reporting
- File: [Production-workspace/src/components/employee/EmployeeIssueReport.tsx](../../Production-workspace/src/components/employee/EmployeeIssueReport.tsx)
- Functional scope:
  - Description + optional photo report submission
- Impact:
  - Escalates site blockers quickly with context

5. Message thread
- File: [Production-workspace/src/components/employee/EmployeeMessageThread.tsx](../../Production-workspace/src/components/employee/EmployeeMessageThread.tsx)
- Functional scope:
  - Admin/field communication stream per assignment
- Impact:
  - Reduces out-of-band coordination failures

6. Completion photo upload
- File: [Production-workspace/src/components/employee/EmployeePhotoUpload.tsx](../../Production-workspace/src/components/employee/EmployeePhotoUpload.tsx)
- Functional scope:
  - Camera-friendly upload control with status handling
- Impact:
  - Provides visual proof-of-completion artifact

7. Pending photo modal
- File: [Production-workspace/src/components/employee/PhotoInventoryModal.tsx](../../Production-workspace/src/components/employee/PhotoInventoryModal.tsx)
- Functional scope:
  - Review/remove/retry queued uploads
  - Modal dialog semantics and focus trap
- Impact:
  - Operational transparency for offline/queued media

8. Employee inventory flow
- File: [Production-workspace/src/components/employee/EmployeeInventoryClient.tsx](../../Production-workspace/src/components/employee/EmployeeInventoryClient.tsx)
- Functional scope:
  - Log supply usage
  - Submit supply requests with urgency
  - Surface low-stock alerts
- Impact:
  - Creates direct feedback loop from field consumption to admin replenishment

## 6. API and Data Blueprint

### 6.1 API capability map

Lead and quote lifecycle:
- [Production-workspace/src/app/api/quote-request/route.ts](../../Production-workspace/src/app/api/quote-request/route.ts)
- [Production-workspace/src/app/api/quote-send/route.ts](../../Production-workspace/src/app/api/quote-send/route.ts)
- [Production-workspace/src/app/api/quote-response/route.ts](../../Production-workspace/src/app/api/quote-response/route.ts)
- [Production-workspace/src/app/api/quote-create-job/route.ts](../../Production-workspace/src/app/api/quote-create-job/route.ts)
- [Production-workspace/src/app/api/conversion-event/route.ts](../../Production-workspace/src/app/api/conversion-event/route.ts)
- [Production-workspace/src/app/api/lead-message/route.ts](../../Production-workspace/src/app/api/lead-message/route.ts)

Operations and execution:
- [Production-workspace/src/app/api/ticket-create/route.ts](../../Production-workspace/src/app/api/ticket-create/route.ts)
- [Production-workspace/src/app/api/completion-report/route.ts](../../Production-workspace/src/app/api/completion-report/route.ts)
- [Production-workspace/src/app/api/assignment-notify/route.ts](../../Production-workspace/src/app/api/assignment-notify/route.ts)
- [Production-workspace/src/app/api/notification-dispatch/route.ts](../../Production-workspace/src/app/api/notification-dispatch/route.ts)

Automation and post-job:
- [Production-workspace/src/app/api/post-job-settings/route.ts](../../Production-workspace/src/app/api/post-job-settings/route.ts)
- [Production-workspace/src/app/api/post-job-sequence/route.ts](../../Production-workspace/src/app/api/post-job-sequence/route.ts)
- [Production-workspace/src/app/api/post-job-scheduler/route.ts](../../Production-workspace/src/app/api/post-job-scheduler/route.ts)
- [Production-workspace/src/app/api/post-job-rating/route.ts](../../Production-workspace/src/app/api/post-job-rating/route.ts)

Assistant, hiring, integrations:
- [Production-workspace/src/app/api/ai-assistant/route.ts](../../Production-workspace/src/app/api/ai-assistant/route.ts)
- [Production-workspace/src/app/api/employment-application/route.ts](../../Production-workspace/src/app/api/employment-application/route.ts)
- [Production-workspace/src/app/api/quickbooks-sync/route.ts](../../Production-workspace/src/app/api/quickbooks-sync/route.ts)
- [Production-workspace/src/app/api/quickbooks-callback/route.ts](../../Production-workspace/src/app/api/quickbooks-callback/route.ts)

### 6.2 Supabase schema and migrations

Migration root:
- [Production-workspace/supabase/migrations](../../Production-workspace/supabase/migrations)

This is the authoritative evolution chain for tables, RLS, and runtime behavior assumptions. Runtime closure evidence should be recorded in:
- [blueprint/active/feedback3.0-validation-evidence-2026-04-11.md](./feedback3.0-validation-evidence-2026-04-11.md)

## 7. Styling System Blueprint

Primary styling files:
- Global styles and tokens: [Production-workspace/src/styles/globals.css](../../Production-workspace/src/styles/globals.css)
- Tailwind config extension: [Production-workspace/tailwind.config.js](../../Production-workspace/tailwind.config.js)

### 7.1 Design language

Visual direction:
1. Navy-led primary surfaces
2. Gold accents for premium/trust signals
3. Royal blue for guidance/interaction accents
4. Warm neutral background for contrast and readability

### 7.2 Component-level design primitives

Shared classes encode consistent behavior:
1. CTA system: cta-primary, cta-light, cta-gold, cta-outline-dark
2. Surface hierarchy: surface-panel, surface-panel-soft, dark-surface-panel
3. Micro-information styles: section-kicker, info-chip, signal-line, icon-tile

### 7.3 Motion and interaction baseline

1. Purposeful reveal and hero motion keyframes in global CSS
2. Reduced-motion fallback via prefers-reduced-motion block
3. Focus-visible ring standards across UI
4. Safe-area handling for modern mobile devices

Impact:
1. Preserves brand consistency across public/admin/employee surfaces
2. Improves mobile ergonomics and interaction confidence
3. Maintains accessibility while still providing visual polish

## 8. Accessibility and UX Infrastructure

Core infrastructure files:
- Root skip-link and main target: [Production-workspace/src/app/layout.tsx](../../Production-workspace/src/app/layout.tsx)
- Shared status announcer: [Production-workspace/src/components/ui/StatusAnnouncer.tsx](../../Production-workspace/src/components/ui/StatusAnnouncer.tsx)
- Status event utility: [Production-workspace/src/lib/status-announcer.ts](../../Production-workspace/src/lib/status-announcer.ts)
- Shared focus trap hook: [Production-workspace/src/hooks/useFocusTrap.ts](../../Production-workspace/src/hooks/useFocusTrap.ts)

Where it is actively used:
- Admin shell nav drawer: [Production-workspace/src/components/admin/AdminShell.tsx](../../Production-workspace/src/components/admin/AdminShell.tsx)
- Employee photo modal: [Production-workspace/src/components/employee/PhotoInventoryModal.tsx](../../Production-workspace/src/components/employee/PhotoInventoryModal.tsx)
- Public overlays/dialogs:
  - [Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx](../../Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx)
  - [Production-workspace/src/components/public/variant-a/ExitIntentOverlay.tsx](../../Production-workspace/src/components/public/variant-a/ExitIntentOverlay.tsx)
  - [Production-workspace/src/components/public/variant-a/AIQuoteAssistant.tsx](../../Production-workspace/src/components/public/variant-a/AIQuoteAssistant.tsx)

Impact:
1. Better keyboard/screen-reader flow and modal containment
2. More reliable interaction patterns across desktop/mobile
3. Reduced accessibility regressions from one-off implementations

## 9. Latest Effort Deep-Dive

This latest implementation wave focused on practical accessibility, usability, and execution clarity rather than net-new feature surface.

### 9.1 What was upgraded

1. Focus management standardization
- Consolidated modal/drawer focus trapping into one reusable hook
- Deployed across admin, employee, and public overlay experiences

2. Mutation feedback accessibility
- Rolled out announcement events for critical admin operations so updates are audible to assistive tech users

3. Iconography modernization
- Replaced emoji-based UI markers with consistent SVG iconography across primary dashboard and employee surfaces

4. Mobile ergonomics pass
- Increased touch targets and control readability in high-traffic admin modules

### 9.2 Why it matters

1. Accessibility improvements now scale through shared primitives instead of isolated fixes.
2. Operations-heavy users (admin/employee) get clearer state feedback and fewer interaction misses.
3. Public conversion overlays now align with the same interaction quality bar as internal dashboards.

## 10. Validation and Ops Runbook Alignment

Execution docs:
- E2E runbook: [blueprint/active/admin-employee-e2e-test-guide.md](./admin-employee-e2e-test-guide.md)
- Solutioning closure plane: [blueprint/active/solutioning-guide.md](./solutioning-guide.md)
- Roadmap closure and grading: [blueprint/active/bring-it-to-an-a.md](./bring-it-to-an-a.md)

Operational usage:
1. Use this blueprint for system understanding and implementation mapping.
2. Use E2E guide for runtime execution and evidence capture.
3. Use solutioning and roadmap docs for status promotion and closure decisions.

## 11. Current Open Program Risks

The remaining high-priority unresolved area is runtime evidence, not baseline UI capability.

Primary open blockers are tracked in:
- [blueprint/active/solutioning-guide.md](./solutioning-guide.md)
- [blueprint/active/bring-it-to-an-a.md](./bring-it-to-an-a.md)

Notable open runtime closures include:
1. SB-6 runtime exploit-regression validation
2. C-40 multi-crew RLS runtime validation
3. #1047 retry-path runtime proof and attempts-column reconciliation

## 12. Maintenance Rules for This Blueprint

When any feature/module/page behavior changes, update this file in the same change set.

Required update checklist:
1. Update functionality and impact notes for changed sections.
2. Add links for any new implementation files.
3. Update latest effort section with implementation deltas.
4. Keep open-risk section synchronized with solutioning and roadmap status docs.
