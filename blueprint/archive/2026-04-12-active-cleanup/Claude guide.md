# Comprehensive Status Update and Navigation Map

Date: 2026-04-11
Scope: active-doc cleanup, implementation carry-over, route status map, admin/employee connectivity, major-pass file shortlist
Audience: deep audit and upgrade execution planning

## 1) Active Docs Cleanup (Canonical Set)

This pass cleaned and normalized the active-doc workspace so execution context is easier to navigate.

Actions completed:
- Removed empty stale file: [blueprint/active/feedback](blueprint/active/feedback)
- Kept lock-in docs synced to implementation state:
  - [blueprint/active/feedback3.0.md](blueprint/active/feedback3.0.md)
  - [blueprint/active/current-state-status-update-2026-04-10.md](blueprint/active/current-state-status-update-2026-04-10.md)
  - [blueprint/active/feedback3.0-validation-evidence-2026-04-11.md](blueprint/active/feedback3.0-validation-evidence-2026-04-11.md)

Recommended canonical docs to drive your major pass:
1. Current execution baseline: [blueprint/active/comprehensive-status-update-2026-04-11.md](blueprint/active/comprehensive-status-update-2026-04-11.md)
2. Conversion hardening lock: [blueprint/active/feedback3.0.md](blueprint/active/feedback3.0.md)
3. Validation evidence tracker: [blueprint/active/feedback3.0-validation-evidence-2026-04-11.md](blueprint/active/feedback3.0-validation-evidence-2026-04-11.md)
4. Public route and component map: [blueprint/active/PUBLIC-PAGES-REFERENCE.md](blueprint/active/PUBLIC-PAGES-REFERENCE.md)
5. Performance optimization map: [blueprint/active/chunk-performance-deep-dive-2026-04-04.md](blueprint/active/chunk-performance-deep-dive-2026-04-04.md)
6. Session 1-5 implementation provenance: [blueprint/active/solutioning-framework-v1.0.md](blueprint/active/solutioning-framework-v1.0.md)

Reference docs to mine, not drive:
- [blueprint/archive/2026-04-11-active-cleanup/current-changes.md](blueprint/archive/2026-04-11-active-cleanup/current-changes.md)
- [blueprint/archive/2026-04-11-active-cleanup/masterdoc-ux-ui.md](blueprint/archive/2026-04-11-active-cleanup/masterdoc-ux-ui.md)
- [blueprint/archive/2026-04-11-active-cleanup/feedback.md](blueprint/archive/2026-04-11-active-cleanup/feedback.md)
- [blueprint/archive/2026-04-11-active-cleanup/feedback2.0.md](blueprint/archive/2026-04-11-active-cleanup/feedback2.0.md)

## 2) Required Launch Validation Queue (Your Listed Items)

These are the highest-priority unresolved closure tasks.

### 2.1 Manual QA (Q1-Q24) in a real browser
- Status: Pending
- Primary evidence target: [blueprint/active/feedback3.0-validation-evidence-2026-04-11.md](blueprint/active/feedback3.0-validation-evidence-2026-04-11.md)
- Core files impacted:
  - [Production-workspace/src/components/public/variant-a/HeroSection.tsx](Production-workspace/src/components/public/variant-a/HeroSection.tsx)
  - [Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx](Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx)
  - [Production-workspace/src/components/public/variant-a/VariantAPublicPage.tsx](Production-workspace/src/components/public/variant-a/VariantAPublicPage.tsx)
  - [Production-workspace/src/app/quote/success/page.tsx](Production-workspace/src/app/quote/success/page.tsx)

### 2.2 Lighthouse and Core Web Vitals baseline on mobile
- Status: Pending
- Baseline and triage reference:
  - [blueprint/active/chunk-performance-deep-dive-2026-04-04.md](blueprint/active/chunk-performance-deep-dive-2026-04-04.md)
  - [Production-workspace/src/app/(public)/page.tsx](Production-workspace/src/app/(public)/page.tsx)
  - [Production-workspace/src/components/public/variant-a/VariantAPublicPage.tsx](Production-workspace/src/components/public/variant-a/VariantAPublicPage.tsx)

### 2.3 Analytics ingestion proof (events actually landing)
- Status: Pending live-environment proof
- Instrumentation files:
  - [Production-workspace/src/lib/analytics.ts](Production-workspace/src/lib/analytics.ts)
  - [Production-workspace/src/app/api/conversion-event/route.ts](Production-workspace/src/app/api/conversion-event/route.ts)
  - [Production-workspace/src/app/quote/success/page.tsx](Production-workspace/src/app/quote/success/page.tsx)
  - [Production-workspace/src/components/public/variant-a/useQuoteForm.ts](Production-workspace/src/components/public/variant-a/useQuoteForm.ts)
  - [Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx](Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx)

### 2.4 Owner content collection (real stats replacing placeholders)
- Status: Pending
- Intake and current-source references:
  - [blueprint/active/owner-info-checklist-for-mom.md](blueprint/active/owner-info-checklist-for-mom.md)
  - [Production-workspace/src/lib/company.ts](Production-workspace/src/lib/company.ts)
  - [Production-workspace/src/components/public/variant-a/AuthorityBar.tsx](Production-workspace/src/components/public/variant-a/AuthorityBar.tsx)
  - [Production-workspace/src/components/public/variant-a/AboutSection.tsx](Production-workspace/src/components/public/variant-a/AboutSection.tsx)
  - [Production-workspace/src/data/industries.ts](Production-workspace/src/data/industries.ts)
  - [Production-workspace/src/app/(public)/page.tsx](Production-workspace/src/app/(public)/page.tsx)

### 2.5 E2E operational flow validation (lead to job completion)
- Status: Pending
- End-to-end chain map:
  1. Lead intake: [Production-workspace/src/app/api/quote-request/route.ts](Production-workspace/src/app/api/quote-request/route.ts)
  2. Lead pipeline and quote send: [Production-workspace/src/components/admin/LeadPipelineClient.tsx](Production-workspace/src/components/admin/LeadPipelineClient.tsx), [Production-workspace/src/app/api/quote-send/route.ts](Production-workspace/src/app/api/quote-send/route.ts)
  3. Quote acceptance: [Production-workspace/src/app/api/quote-response/route.ts](Production-workspace/src/app/api/quote-response/route.ts)
  4. Job creation from quote: [Production-workspace/src/app/api/quote-create-job/route.ts](Production-workspace/src/app/api/quote-create-job/route.ts)
  5. Assignment notification: [Production-workspace/src/app/api/assignment-notify/route.ts](Production-workspace/src/app/api/assignment-notify/route.ts)
  6. Employee execution and completion: [Production-workspace/src/components/employee/EmployeeTicketsClient.tsx](Production-workspace/src/components/employee/EmployeeTicketsClient.tsx), [Production-workspace/src/app/api/completion-report/route.ts](Production-workspace/src/app/api/completion-report/route.ts)

### 2.6 Supabase RLS verification
- Status: Pending
- Security touchpoints:
  - [Production-workspace/src/lib/supabase/client.ts](Production-workspace/src/lib/supabase/client.ts)
  - [Production-workspace/src/lib/supabase/admin.ts](Production-workspace/src/lib/supabase/admin.ts)
  - [Production-workspace/middleware.ts](Production-workspace/middleware.ts)
  - [Production-workspace/supabase/migrations/0001_mvp_core.sql](Production-workspace/supabase/migrations/0001_mvp_core.sql)
  - [Production-workspace/supabase/migrations/0004_lead_pipeline_and_quotes.sql](Production-workspace/supabase/migrations/0004_lead_pipeline_and_quotes.sql)
  - [Production-workspace/supabase/migrations/0008_quote_delivery_and_hiring.sql](Production-workspace/supabase/migrations/0008_quote_delivery_and_hiring.sql)

### 2.7 Camera-spike route disposition
- Status: Pending product decision
- Route file: [Production-workspace/src/app/(public)/camera-spike/page.tsx](Production-workspace/src/app/(public)/camera-spike/page.tsx)
- Decision options:
  1. Keep and hide from public nav/sitemap indexing.
  2. Gate behind env flag/dev preview.
  3. Remove from production build.

## 3) Carry-Over Feature Backlog (Not Fully Closed)

This section collects major carry-over items from active docs that are still pending or partially validated.

### 3.1 Session 6 carry-over (component extraction and consolidation)
Status: Not started
Source: [blueprint/active/solutioning-framework-v1.0.md](blueprint/active/solutioning-framework-v1.0.md)

Target outcomes:
- extract repeated CTA-band and cross-link patterns
- extract repeated service/industry route blocks
- reduce duplication in public page templates

Likely files:
- [Production-workspace/src/components/public/variant-a/FooterSection.tsx](Production-workspace/src/components/public/variant-a/FooterSection.tsx)
- [Production-workspace/src/app/(public)/services/post-construction-cleaning/page.tsx](Production-workspace/src/app/(public)/services/post-construction-cleaning/page.tsx)
- [Production-workspace/src/app/(public)/services/final-clean/page.tsx](Production-workspace/src/app/(public)/services/final-clean/page.tsx)
- [Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx](Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx)
- [Production-workspace/src/app/(public)/services/move-in-move-out-cleaning/page.tsx](Production-workspace/src/app/(public)/services/move-in-move-out-cleaning/page.tsx)
- [Production-workspace/src/app/(public)/services/windows-power-wash/page.tsx](Production-workspace/src/app/(public)/services/windows-power-wash/page.tsx)

### 3.2 Session 7 carry-over (polish and deferred decisions)
Status: Not started
Source: [blueprint/active/solutioning-framework-v1.0.md](blueprint/active/solutioning-framework-v1.0.md)

High-value items:
- exit intent move and once-per-session behavior
- error-boundary strategy pass
- contact page mobile sequencing pass
- image quality/performance tuning pass

Likely files:
- [Production-workspace/src/components/public/variant-a/ExitIntentOverlay.tsx](Production-workspace/src/components/public/variant-a/ExitIntentOverlay.tsx)
- [Production-workspace/src/components/public/PublicChrome.tsx](Production-workspace/src/components/public/PublicChrome.tsx)
- [Production-workspace/src/components/ui/ErrorBoundary.tsx](Production-workspace/src/components/ui/ErrorBoundary.tsx)
- [Production-workspace/src/app/(public)/contact/page.tsx](Production-workspace/src/app/(public)/contact/page.tsx)

### 3.3 Remaining launch-gate items from v2.0 doc
Status: Open
Source: [blueprint/active/masterdoc-ux-ui-2.0.md](blueprint/active/masterdoc-ux-ui-2.0.md)

Open gates:
- Gate 1 manual QA (Q1-Q24)
- Gate 2 hero hydration verification
- Gate 3 schema parity verification for quote API field persistence

## 4) Non-Homepage Public Pages Status Map

This section summarizes all public routes except homepage, with practical upgrade focus.

### 4.1 About page
- File: [Production-workspace/src/app/(public)/about/page.tsx](Production-workspace/src/app/(public)/about/page.tsx)
- Current status: Structurally complete and consistent with public visual language.
- Upgrade opportunities: richer proof modules, stronger narrative differentiation, owner-backed trust data.

### 4.2 Contact page
- File: [Production-workspace/src/app/(public)/contact/page.tsx](Production-workspace/src/app/(public)/contact/page.tsx)
- Current status: Complete flow with form module and bilingual handoff support.
- Upgrade opportunities: tighten conversion hierarchy and ensure analytics proof for all key contact actions.

### 4.3 FAQ page
- File: [Production-workspace/src/app/(public)/faq/page.tsx](Production-workspace/src/app/(public)/faq/page.tsx)
- Current status: Complete with shared FAQ model and filtering patterns.
- Upgrade opportunities: tune content depth and optional empty-state/edge-case UX under heavy filter conditions.

### 4.4 Careers page
- File: [Production-workspace/src/app/(public)/careers/page.tsx](Production-workspace/src/app/(public)/careers/page.tsx)
- Current status: Complete and linked correctly from global nav/footer.
- Upgrade opportunities: improve proof depth and hiring CTA quality once real media/testimonials are available.

### 4.5 Privacy and Terms pages
- Files:
  - [Production-workspace/src/app/(public)/privacy/page.tsx](Production-workspace/src/app/(public)/privacy/page.tsx)
  - [Production-workspace/src/app/(public)/terms/page.tsx](Production-workspace/src/app/(public)/terms/page.tsx)
- Current status: Structurally complete legal pages.
- Upgrade opportunities: legal-content refresh cadence and policy-governance ownership.

### 4.6 Services index and service detail pages
- Files:
  - [Production-workspace/src/app/(public)/services/page.tsx](Production-workspace/src/app/(public)/services/page.tsx)
  - [Production-workspace/src/app/(public)/services/post-construction-cleaning/page.tsx](Production-workspace/src/app/(public)/services/post-construction-cleaning/page.tsx)
  - [Production-workspace/src/app/(public)/services/final-clean/page.tsx](Production-workspace/src/app/(public)/services/final-clean/page.tsx)
  - [Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx](Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx)
  - [Production-workspace/src/app/(public)/services/move-in-move-out-cleaning/page.tsx](Production-workspace/src/app/(public)/services/move-in-move-out-cleaning/page.tsx)
  - [Production-workspace/src/app/(public)/services/windows-power-wash/page.tsx](Production-workspace/src/app/(public)/services/windows-power-wash/page.tsx)
- Current status: Complete route family and consistent service data usage.
- Upgrade opportunities: reduce duplicate page scaffolding via shared extractors and add deeper project proof blocks.

### 4.7 Industries index and dynamic pages
- Files:
  - [Production-workspace/src/app/(public)/industries/page.tsx](Production-workspace/src/app/(public)/industries/page.tsx)
  - [Production-workspace/src/app/(public)/industries/[slug]/page.tsx](Production-workspace/src/app/(public)/industries/[slug]/page.tsx)
- Current status: Complete routing and metadata; persona mapping in place.
- Upgrade opportunities: deeper industry-specific proof and benchmark content; stronger visual differentiation across slugs.

### 4.8 Service area hub and city pages
- Files:
  - [Production-workspace/src/app/(public)/service-area/page.tsx](Production-workspace/src/app/(public)/service-area/page.tsx)
  - [Production-workspace/src/app/(public)/service-area/[slug]/page.tsx](Production-workspace/src/app/(public)/service-area/[slug]/page.tsx)
- Current status: Complete route architecture and city model coverage.
- Upgrade opportunities: map parity with homepage interactive map behavior and richer local proof modules.

### 4.9 Quote routes
- Files:
  - [Production-workspace/src/app/quote/success/page.tsx](Production-workspace/src/app/quote/success/page.tsx)
  - [Production-workspace/src/app/quote/[token]/page.tsx](Production-workspace/src/app/quote/[token]/page.tsx)
- Current status: Functional and integrated with quote flow.
- Upgrade opportunities: fix remaining success-page anchor inconsistency and complete paid-channel environment validation.

### 4.10 Camera spike route
- File: [Production-workspace/src/app/(public)/camera-spike/page.tsx](Production-workspace/src/app/(public)/camera-spike/page.tsx)
- Current status: present in public route space, disposition unresolved.
- Upgrade opportunities: classify as internal tool route or remove/gate for production.

## 5) Admin and Employee System Map

## 5.1 Admin page architecture

Entry route:
- [Production-workspace/src/app/(admin)/admin/page.tsx](Production-workspace/src/app/(admin)/admin/page.tsx)

Shell and module router:
- [Production-workspace/src/components/admin/AdminShell.tsx](Production-workspace/src/components/admin/AdminShell.tsx)
- [Production-workspace/src/components/admin/AdminSidebarNav.tsx](Production-workspace/src/components/admin/AdminSidebarNav.tsx)

Primary modules:
- [Production-workspace/src/components/admin/OverviewDashboard.tsx](Production-workspace/src/components/admin/OverviewDashboard.tsx)
- [Production-workspace/src/components/admin/LeadPipelineClient.tsx](Production-workspace/src/components/admin/LeadPipelineClient.tsx)
- [Production-workspace/src/components/admin/TicketManagementClient.tsx](Production-workspace/src/components/admin/TicketManagementClient.tsx)
- [Production-workspace/src/components/admin/DispatchModule.tsx](Production-workspace/src/components/admin/DispatchModule.tsx)
- [Production-workspace/src/components/admin/OperationsEnhancementsClient.tsx](Production-workspace/src/components/admin/OperationsEnhancementsClient.tsx)
- [Production-workspace/src/components/admin/SchedulingAndAvailabilityClient.tsx](Production-workspace/src/components/admin/SchedulingAndAvailabilityClient.tsx)
- [Production-workspace/src/components/admin/InventoryManagementClient.tsx](Production-workspace/src/components/admin/InventoryManagementClient.tsx)
- [Production-workspace/src/components/admin/UnifiedInsightsClient.tsx](Production-workspace/src/components/admin/UnifiedInsightsClient.tsx)
- [Production-workspace/src/components/admin/NotificationCenterClient.tsx](Production-workspace/src/components/admin/NotificationCenterClient.tsx)
- [Production-workspace/src/components/admin/HiringInboxClient.tsx](Production-workspace/src/components/admin/HiringInboxClient.tsx)

Admin API edges (selected):
- [Production-workspace/src/app/api/quote-send/route.ts](Production-workspace/src/app/api/quote-send/route.ts)
- [Production-workspace/src/app/api/quote-create-job/route.ts](Production-workspace/src/app/api/quote-create-job/route.ts)
- [Production-workspace/src/app/api/assignment-notify/route.ts](Production-workspace/src/app/api/assignment-notify/route.ts)
- [Production-workspace/src/app/api/completion-report/route.ts](Production-workspace/src/app/api/completion-report/route.ts)
- [Production-workspace/src/app/api/notification-dispatch/route.ts](Production-workspace/src/app/api/notification-dispatch/route.ts)
- [Production-workspace/src/app/api/post-job-settings/route.ts](Production-workspace/src/app/api/post-job-settings/route.ts)
- [Production-workspace/src/app/api/employment-application/route.ts](Production-workspace/src/app/api/employment-application/route.ts)

Admin status summary:
- Connected and functionally broad.
- Major-pass focus: IA simplification, module-level dynamic loading, and tighter operational runbooks.

## 5.2 Employee page architecture

Entry route:
- [Production-workspace/src/app/(employee)/employee/page.tsx](Production-workspace/src/app/(employee)/employee/page.tsx)

Shell and tabs:
- [Production-workspace/src/components/employee/EmployeePortalTabs.tsx](Production-workspace/src/components/employee/EmployeePortalTabs.tsx)

Primary modules:
- [Production-workspace/src/components/employee/EmployeeTicketsClient.tsx](Production-workspace/src/components/employee/EmployeeTicketsClient.tsx)
- [Production-workspace/src/components/employee/EmployeeInventoryClient.tsx](Production-workspace/src/components/employee/EmployeeInventoryClient.tsx)
- [Production-workspace/src/components/employee/EmployeePhotoUpload.tsx](Production-workspace/src/components/employee/EmployeePhotoUpload.tsx)
- [Production-workspace/src/components/employee/EmployeeChecklistView.tsx](Production-workspace/src/components/employee/EmployeeChecklistView.tsx)
- [Production-workspace/src/components/employee/EmployeeIssueReport.tsx](Production-workspace/src/components/employee/EmployeeIssueReport.tsx)
- [Production-workspace/src/components/employee/EmployeeMessageThread.tsx](Production-workspace/src/components/employee/EmployeeMessageThread.tsx)

Data model and client access:
- [Production-workspace/src/lib/supabase/client.ts](Production-workspace/src/lib/supabase/client.ts)
- [Production-workspace/src/lib/photo-upload-queue.ts](Production-workspace/src/lib/photo-upload-queue.ts)
- [Production-workspace/src/lib/client-photo.ts](Production-workspace/src/lib/client-photo.ts)

Employee status summary:
- Connected and usable for live operations.
- Major-pass focus: mobile one-tap action hierarchy, photo workflow confidence states, and assignment-card clarity.

## 6) Comprehensive Review Shortlist (50 files)

This list is your deep-pass navigation shortlist for refactor, optimization, bug hunting, and hardening.

### 6.1 Public route and page templates
1. [Production-workspace/src/app/(public)/services/page.tsx](Production-workspace/src/app/(public)/services/page.tsx)
2. [Production-workspace/src/app/(public)/services/post-construction-cleaning/page.tsx](Production-workspace/src/app/(public)/services/post-construction-cleaning/page.tsx)
3. [Production-workspace/src/app/(public)/services/final-clean/page.tsx](Production-workspace/src/app/(public)/services/final-clean/page.tsx)
4. [Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx](Production-workspace/src/app/(public)/services/commercial-cleaning/page.tsx)
5. [Production-workspace/src/app/(public)/services/move-in-move-out-cleaning/page.tsx](Production-workspace/src/app/(public)/services/move-in-move-out-cleaning/page.tsx)
6. [Production-workspace/src/app/(public)/services/windows-power-wash/page.tsx](Production-workspace/src/app/(public)/services/windows-power-wash/page.tsx)
7. [Production-workspace/src/app/(public)/industries/page.tsx](Production-workspace/src/app/(public)/industries/page.tsx)
8. [Production-workspace/src/app/(public)/industries/[slug]/page.tsx](Production-workspace/src/app/(public)/industries/[slug]/page.tsx)
9. [Production-workspace/src/app/(public)/service-area/page.tsx](Production-workspace/src/app/(public)/service-area/page.tsx)
10. [Production-workspace/src/app/(public)/service-area/[slug]/page.tsx](Production-workspace/src/app/(public)/service-area/[slug]/page.tsx)
11. [Production-workspace/src/app/(public)/about/page.tsx](Production-workspace/src/app/(public)/about/page.tsx)
12. [Production-workspace/src/app/(public)/contact/page.tsx](Production-workspace/src/app/(public)/contact/page.tsx)
13. [Production-workspace/src/app/(public)/faq/page.tsx](Production-workspace/src/app/(public)/faq/page.tsx)
14. [Production-workspace/src/app/(public)/careers/page.tsx](Production-workspace/src/app/(public)/careers/page.tsx)
15. [Production-workspace/src/app/(public)/privacy/page.tsx](Production-workspace/src/app/(public)/privacy/page.tsx)
16. [Production-workspace/src/app/(public)/terms/page.tsx](Production-workspace/src/app/(public)/terms/page.tsx)
17. [Production-workspace/src/app/(public)/camera-spike/page.tsx](Production-workspace/src/app/(public)/camera-spike/page.tsx)
18. [Production-workspace/src/app/quote/success/page.tsx](Production-workspace/src/app/quote/success/page.tsx)
19. [Production-workspace/src/app/quote/[token]/page.tsx](Production-workspace/src/app/quote/[token]/page.tsx)
20. [Production-workspace/src/app/(public)/page.tsx](Production-workspace/src/app/(public)/page.tsx)

### 6.2 Public shared components and UX primitives
21. [Production-workspace/src/components/public/PublicChrome.tsx](Production-workspace/src/components/public/PublicChrome.tsx)
22. [Production-workspace/src/components/public/variant-a/PublicHeader.tsx](Production-workspace/src/components/public/variant-a/PublicHeader.tsx)
23. [Production-workspace/src/components/public/variant-a/FooterSection.tsx](Production-workspace/src/components/public/variant-a/FooterSection.tsx)
24. [Production-workspace/src/components/public/variant-a/HeroSection.tsx](Production-workspace/src/components/public/variant-a/HeroSection.tsx)
25. [Production-workspace/src/components/public/variant-a/VariantAPublicPage.tsx](Production-workspace/src/components/public/variant-a/VariantAPublicPage.tsx)
26. [Production-workspace/src/components/public/variant-a/ServiceSpreadSection.tsx](Production-workspace/src/components/public/variant-a/ServiceSpreadSection.tsx)
27. [Production-workspace/src/components/public/variant-a/OfferAndIndustrySection.tsx](Production-workspace/src/components/public/variant-a/OfferAndIndustrySection.tsx)
28. [Production-workspace/src/components/public/variant-a/BeforeAfterSlider.tsx](Production-workspace/src/components/public/variant-a/BeforeAfterSlider.tsx)
29. [Production-workspace/src/components/public/variant-a/TestimonialSection.tsx](Production-workspace/src/components/public/variant-a/TestimonialSection.tsx)
30. [Production-workspace/src/components/public/variant-a/AuthorityBar.tsx](Production-workspace/src/components/public/variant-a/AuthorityBar.tsx)
31. [Production-workspace/src/components/public/variant-a/TimelineSection.tsx](Production-workspace/src/components/public/variant-a/TimelineSection.tsx)
32. [Production-workspace/src/components/public/variant-a/ServiceAreaSection.tsx](Production-workspace/src/components/public/variant-a/ServiceAreaSection.tsx)
33. [Production-workspace/src/components/public/variant-a/FAQSection.tsx](Production-workspace/src/components/public/variant-a/FAQSection.tsx)
34. [Production-workspace/src/components/public/variant-a/CTAButton.tsx](Production-workspace/src/components/public/variant-a/CTAButton.tsx)
35. [Production-workspace/src/components/public/variant-a/QuoteCTA.tsx](Production-workspace/src/components/public/variant-a/QuoteCTA.tsx)
36. [Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx](Production-workspace/src/components/public/variant-a/FloatingQuotePanel.tsx)
37. [Production-workspace/src/components/public/variant-a/useQuoteForm.ts](Production-workspace/src/components/public/variant-a/useQuoteForm.ts)
38. [Production-workspace/src/components/public/variant-a/AIQuoteAssistant.tsx](Production-workspace/src/components/public/variant-a/AIQuoteAssistant.tsx)
39. [Production-workspace/src/components/public/variant-a/ExitIntentOverlay.tsx](Production-workspace/src/components/public/variant-a/ExitIntentOverlay.tsx)
40. [Production-workspace/src/components/public/variant-a/ServicePageHardening.tsx](Production-workspace/src/components/public/variant-a/ServicePageHardening.tsx)

### 6.3 Admin, employee, and backend integration/hardening
41. [Production-workspace/src/components/admin/AdminShell.tsx](Production-workspace/src/components/admin/AdminShell.tsx)
42. [Production-workspace/src/components/admin/LeadPipelineClient.tsx](Production-workspace/src/components/admin/LeadPipelineClient.tsx)
43. [Production-workspace/src/components/admin/TicketManagementClient.tsx](Production-workspace/src/components/admin/TicketManagementClient.tsx)
44. [Production-workspace/src/components/admin/FirstRunWizardClient.tsx](Production-workspace/src/components/admin/FirstRunWizardClient.tsx)
45. [Production-workspace/src/components/admin/UnifiedInsightsClient.tsx](Production-workspace/src/components/admin/UnifiedInsightsClient.tsx)
46. [Production-workspace/src/components/employee/EmployeePortalTabs.tsx](Production-workspace/src/components/employee/EmployeePortalTabs.tsx)
47. [Production-workspace/src/components/employee/EmployeeTicketsClient.tsx](Production-workspace/src/components/employee/EmployeeTicketsClient.tsx)
48. [Production-workspace/src/app/api/quote-request/route.ts](Production-workspace/src/app/api/quote-request/route.ts)
49. [Production-workspace/src/app/api/quickbooks-sync/route.ts](Production-workspace/src/app/api/quickbooks-sync/route.ts)
50. [Production-workspace/src/lib/idempotency.ts](Production-workspace/src/lib/idempotency.ts)

## 7) Security and Integration Navigation Map

Security control path:
- edge auth/rate-limit headers: [Production-workspace/middleware.ts](Production-workspace/middleware.ts)
- environment safety checks: [Production-workspace/src/lib/env.ts](Production-workspace/src/lib/env.ts)
- browser/session client: [Production-workspace/src/lib/supabase/client.ts](Production-workspace/src/lib/supabase/client.ts)
- privileged admin client: [Production-workspace/src/lib/supabase/admin.ts](Production-workspace/src/lib/supabase/admin.ts)

Core integrations:
- QuickBooks: [Production-workspace/src/lib/quickbooks.ts](Production-workspace/src/lib/quickbooks.ts), [Production-workspace/src/app/api/quickbooks-sync/route.ts](Production-workspace/src/app/api/quickbooks-sync/route.ts), [Production-workspace/src/app/api/quickbooks-callback/route.ts](Production-workspace/src/app/api/quickbooks-callback/route.ts)
- Messaging and notifications: [Production-workspace/src/lib/notifications.ts](Production-workspace/src/lib/notifications.ts), [Production-workspace/src/app/api/notification-dispatch/route.ts](Production-workspace/src/app/api/notification-dispatch/route.ts)
- Email resilience: [Production-workspace/src/lib/resilient-email.ts](Production-workspace/src/lib/resilient-email.ts)
- Analytics ingestion: [Production-workspace/src/lib/analytics.ts](Production-workspace/src/lib/analytics.ts), [Production-workspace/src/app/api/conversion-event/route.ts](Production-workspace/src/app/api/conversion-event/route.ts)

## 8) Recommended Deep-Pass Workflow

1. Launch gate closure first
- Complete manual QA Q1-Q24 and log evidence.
- Run Lighthouse/CWV baseline pass.
- Validate analytics ingestion and paid-channel event payloads.

2. Security and data integrity pass
- RLS verification from migrations to live tables.
- API hardening pass over quote + quickbooks + post-job orchestration.
- camera-spike production disposition decision.

3. Public route upgrade pass
- Work through non-homepage routes in this order:
  1) services family
  2) industries family
  3) service-area family
  4) about/contact/faq/careers
  5) legal pages

4. Admin and employee system pass
- Admin IA/module simplification and stale module cleanup.
- Employee mobile action speed and photo workflow confidence improvements.

5. Performance and refactor pass
- Use the 50-file shortlist above as scoped refactor queue.
- Prioritize shared components and hot routes.

## 9) Current Readiness Snapshot

Implemented:
- feedback3.0 code backlog is implemented in source.
- active lock-in docs are synchronized.
- validation evidence file exists.

Not fully closed:
- manual QA, live analytics proof, paid-channel environment proof, RLS verification, and camera-spike disposition.

This file is intended to be your single navigation/control-plane document for the major comprehensive pass.
