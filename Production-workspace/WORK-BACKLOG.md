# Comprehensive Work Backlog

**Date:** March 20, 2026  
**Scope:** Files requiring build-out, optimization, testing, or hardening  
**Total items:** 40+ files across components, APIs, and utilities  

---

## Quick Navigation

- [🔴 Critical (Blocking)](#critical--blocking)
- [🟡 High Priority (MVP+1 Phase)](#high-priority-mvp1-phase)
- [🟢 Polish & Optimization](#polish--optimization)
- [📽️ Scaffolding (Remove/Complete)](#scaffolding-removecomplete)
- [By Directory](#by-directory)
- [By Work Type](#by-work-type-estimates)

---

## 🔴 Critical (Blocking)

Push these first; they block Phase 4 and production readiness.

| File | Issue | Est. Effort | Notes |
|---|---|---|---|
| [src/app/api/quickbooks-sync/route.ts](src/app/api/quickbooks-sync/route.ts) | **0% implemented** — currently simulates revenue; no OAuth2 token exchange, no QB API sync, no vendor/customer lookup | 20h | Blocks financial dashboard; awaits QB credentials + token setup |
| [src/lib/notifications.ts](src/lib/notifications.ts) | Missing retry logic & exponential backoff; SMS can silently fail; no dedup guard | 5h | Impacts crew + admin reliability; no failure metrics |
| [src/lib/photo-upload-queue.ts](src/lib/photo-upload-queue.ts) | No cleanup policy; IndexedDB unbounded; no dedup; stale uploads not pruned | 3h | Could grow photo queue indefinitely on long-term crew use |

---

## 🟡 High Priority (MVP+1 Phase)

Complete these to unlock Phase 2 and improve admin/employee UX.

### Admin Components (40–60% Complete)

| Component | Status | Gap | Effort |
|---|---|---|---|
| [src/components/admin/OperationsEnhancementsClient.tsx](src/components/admin/OperationsEnhancementsClient.tsx) | **60%** | Checklist template creation works; auto-population on job missing; sign-off flow incomplete | 8h |
| [src/components/admin/SchedulingAndAvailabilityClient.tsx](src/components/admin/SchedulingAndAvailabilityClient.tsx) | **70%** | Desktop drag-drop works; mobile responsivity untested; no calendar time-grid view | 6h |
| [src/components/admin/UnifiedInsightsClient.tsx](src/components/admin/UnifiedInsightsClient.tsx) | **40%** | Chart UI ready; metrics aggregation incomplete; QB integration pending | 12h |
| [src/components/admin/HiringInboxClient.tsx](src/components/admin/HiringInboxClient.tsx) | **0%** | Entire component scaffold; no applicant list/detail; no email integration | 10h |

### API Endpoints (Partial)

| File | Gap | Effort |
|---|---|---|
| [src/app/api/quote-create-job/route.ts](src/app/api/quote-create-job/route.ts) | Assignment created but `notification_status: pending` — must verify queue triggers SMS | Test (1h) |
| [src/app/api/completion-report/route.ts](src/app/api/completion-report/route.ts) | PDF template ready; not auto-triggered on job approval; requires manual trigger | Wire (3h) |
| [src/app/api/employment-application/route.ts](src/app/api/employment-application/route.ts) | Rate limit works; email delivery not integrated; no applicant review queue in UI | Wire (5h) |
| [src/app/api/ai-assistant/route.ts](src/app/api/ai-assistant/route.ts) | Basic fallback only; no context retention; no lead extraction or intent | Build (15h) |

### Utilities

| File | Gap | Effort |
|---|---|---|
| [src/lib/assignment-notifications.ts](src/lib/assignment-notifications.ts) | Core works; missing: rescheduled job re-notify, crew substitution alerts | 2h |
| [src/app/api/notification-dispatch/route.ts](src/app/api/notification-dispatch/route.ts) | Queued dispatch works; missing: dedup logic, retry/backoff telemetry | 4h |

---

## 🟢 Polish & Optimization

Fix after MVP production validation.

### Admin UX

| Component | Issue | Effort |
|---|---|---|
| [src/components/admin/LeadPipelineClient.tsx](src/components/admin/LeadPipelineClient.tsx) | Kanban board works; untested on mobile (<640px); no bulk actions (mark won/lost in batch) | 4h |
| [src/components/admin/TicketManagementClient.tsx](src/components/admin/TicketManagementClient.tsx) | Status filter works; missing: job export (CSV), bulk reschedule, calendar view | 6h |
| [src/components/admin/NotificationCenterClient.tsx](src/components/admin/NotificationCenterClient.tsx) | Basic list works; no bulk retry UI, no filter by type/status, no dedup | 3h |
| [src/components/admin/NotificationDispatchClient.tsx](src/components/admin/NotificationDispatchClient.tsx) | Batch dispatch works; missing: delivery telemetry hooks, retry UI | 2h |

### Employee UX

| Component | Issue | Effort |
|---|---|---|
| [src/components/employee/EmployeeInventoryClient.tsx](src/components/employee/EmployeeInventoryClient.tsx) | Minimal scaffolding; not fully wired to supply request API | 3h |

### Public/Marketing

| File | Issue | Effort |
|---|---|---|
| [src/components/public/variant-a/PublicHeader.tsx](src/components/public/variant-a/PublicHeader.tsx) | Fine; could cache menu state to prevent re-renders | 1h |
| Public page CTAs (from Phase 3 audit) | Inconsistent CTA hierarchy across pages (homepage vs contact vs FAQ) | 2h |
| [src/app/(public)/page.tsx](src/app/(public)/page.tsx) (Homepage) | Mobile responsive; could add "See what's included" visual summary section | 3h |

### Libraries

| File | Issue | Effort |
|---|---|---|
| [src/lib/email.ts](src/lib/email.ts) | Configured; needs: test coverage for Resend failures | 2h |
| [src/lib/quote-pdf.ts](src/lib/quote-pdf.ts) | Works; could add: margin adjustment, logo placement control | 2h |
| [src/lib/client-photo.ts](src/lib/client-photo.ts) | Compression works; could add: EXIF stripping, better mobile preview | 2h |

---

## 📽️ Scaffolding (Remove/Complete)

These are environment-gated show-only layouts. Remove or finish before production.

| File | Status | Action |
|---|---|---|
| [src/components/admin/AdminPreviewModePanels.tsx](src/components/admin/AdminPreviewModePanels.tsx) | Show-only (behind `NEXT_PUBLIC_DEV_PREVIEW_MODE`) | Remove in prod or convert to full walkthrough |
| [src/components/employee/EmployeePreviewModePanels.tsx](src/components/employee/EmployeePreviewModePanels.tsx) | Show-only (behind dev-preview flag) | Remove in prod |
| [src/lib/dev-preview.ts](src/lib/dev-preview.ts) | Guard utility | Keep but audit for production leak vectors |

---

## By Directory

### Components

```
src/components/
├── admin/
│   ├── ✅ FirstRunWizardClient.tsx (MVP complete)
│   ├── ⚠️ LeadPipelineClient.tsx (mobile polish needed → 4h)
│   ├── ✅ TicketManagementClient.tsx (MVP complete; bulk actions → 6h)
│   ├── ⚠️ SchedulingAndAvailabilityClient.tsx (70% done → 6h)
│   ├── 🟡 OperationsEnhancementsClient.tsx (60% done → 8h)
│   ├── ⚠️ UnifiedInsightsClient.tsx (40% done, QB pending → 12h)
│   ├── ✅ NotificationCenterClient.tsx (Polish UI → 3h)
│   ├── ✅ NotificationDispatchClient.tsx (Telemetry hooks → 2h)
│   ├── 🔴 HiringInboxClient.tsx (NOT STARTED → 10h)
│   ├── ✅ InventoryManagementClient.tsx (complete)
│   ├── ✅ AdminPreviewModePanels.tsx (remove in prod)
│   └── ✅ FirstRunWizardClient.tsx (complete)
│
├── employee/
│   ├── ✅ EmployeeTicketsClient.tsx (complete; test offline queue)
│   ├── ⚠️ EmployeeInventoryClient.tsx (UI wiring → 3h)
│   └── 📽️ EmployeePreviewModePanels.tsx (remove in prod)
│
├── public/
│   ├── ✅ variant-a/PublicHeader.tsx (fine; minor optimization → 1h)
│   ├── ✅ variant-a/HeroSection.tsx (complete)
│   ├── ✅ variant-a/FAQSection.tsx (expanded; complete)
│   ├── ✅ variant-a/TestimonialSection.tsx (complete)
│   ├── ✅ variant-a/ServiceSpreadSection.tsx (complete)
│   ├── ✅ variant-a/AboutSection.tsx (complete)
│   ├── ✅ variant-a/ServiceAreaSection.tsx (complete)
│   ├── ✅ variant-a/TimelineSection.tsx (complete)
│   ├── ✅ variant-a/BeforeAfterSlider.tsx (complete)
│   ├── ✅ variant-a/QuoteSection.tsx (complete)
│   ├── ✅ variant-a/CareersSection.tsx (complete)
│   ├── ✅ variant-a/FooterSection.tsx (complete)
│   ├── ✅ EmploymentApplicationForm.tsx (complete)
│   └── ⚠️ CTA consistency across pages (polish → 2h)
│
└── ui/
    ├── ✅ AuthSignOutButton.tsx
    └── ✅ All base UI components (complete)
```

### App Routes

```
src/app/
├── (admin)/admin/
│   └── page.tsx — 10 components, needs nav IA reorganization (12h)
│
├── (employee)/employee/
│   └── page.tsx — 2 components, simple layout (complete)
│
├── (public)/
│   ├── page.tsx (homepage, mostly complete; minor visual polish → 3h)
│   ├── about/ ✅
│   ├── careers/ — EmploymentApplicationForm (complete but no admin review queue)
│   ├── contact/ (complete)
│   ├── faq/ (expanded; complete)
│   ├── privacy/ (complete; breadcrumb polish)
│   ├── services/ (5 detail pages + hub; code duplication noted → optimize 45 min)
│   ├── service-area/ (complete; city pages generic)
│   └── camera-spike/ (test page, can remove)
│
├── (auth)/auth/
│   ├── admin/ ✅ (AdminAuthClient.tsx, complete)
│   └── employee/ ✅ (EmployeeAuthClient.tsx, OTP complete)
│
├── api/
│   ├── ✅ assignment-notify/route.ts (complete)
│   ├── ✅ lead-followup/route.ts (complete)
│   ├── ✅ notification-dispatch/route.ts (functional; dedup missing → 4h)
│   ├── ✅ quote-request/route.ts (complete)
│   ├── ✅ quote-response/route.ts (complete)
│   ├── ✅ quote-send/route.ts (complete)
│   ├── ⚠️ quote-create-job/route.ts (works; verify SMS trigger → 1h test)
│   ├── ⚠️ completion-report/route.ts (template ready, not auto-triggered → 3h wire)
│   ├── ⚠️ employment-application/route.ts (rate-limited, no email delivery → 5h)
│   ├── ⚠️ ai-assistant/route.ts (fallback only → 15h build out)
│   ├── 🔴 quickbooks-sync/route.ts (simulated only → 20h implement)
│   └── conversion-event/route.ts ✅
│
├── quote/[token]/
│   ├── page.tsx ✅ (quote view, complete)
│   └── QuoteResponseClient.tsx ✅ (accept/decline, complete)
│
└── sitemap.ts, robots.ts ✅
```

### Libraries

```
src/lib/
├── ✅ analytics.ts (complete)
├── ✅ assignment-notifications.ts (core works; missing re-notify → 2h)
├── ✅ client-photo.ts (compression works; EXIF strip + preview → 2h)
├── ✅ company.ts (constants)
├── ✅ email.ts (Resend configured; needs test → 2h)
├── ⚠️ dev-preview.ts (guards preview; audit for prod leaks)
├── ✅ env.ts (config)
├── 🔴 notifications.ts (missing retry/backoff → 5h)
├── 🔴 photo-upload-queue.ts (no cleanup policy → 3h)
├── ✅ quote-email.ts (complete)
├── ✅ quote-pdf.ts (works; margin/logo control → 2h)
├── ✅ rate-limit.ts (in-memory; working)
├── ✅ site.ts (URL helpers)
├── ✅ ticketing.ts (constants/formatters)
├── supabase/
│   ├── ✅ admin.ts
│   ├── ✅ client.ts
│   └── ✅ server.ts
└── migrations/ — 8 migrations all applied ✅
```

---

## By Work Type (Estimates)

### Build From Scratch (0% → 100%)

| Item | Est. | Notes |
|---|---|---|
| [HiringInboxClient.tsx](src/components/admin/HiringInboxClient.tsx) | 10h | Employment application list → detail → auto-email feature |
| [QuickBooks OAuth flow](src/app/api/quickbooks-sync/route.ts) | 20h | Token exchange + query builder + invoice/vendor sync |
| AI Assistant chatbot context | [src/app/api/ai-assistant/route.ts](src/app/api/ai-assistant/route.ts) | 15h | Extract lead info, answer with company context |

**Subtotal: 45h**

### Complete (60–80% → 100%)

| Item | Gap | Est. | 
|---|---|---|
| QA review workflow UI | [OperationsEnhancementsClient.tsx](src/components/admin/OperationsEnhancementsClient.tsx) | 8h |
| Calendar with drag-drop mobile | [SchedulingAndAvailabilityClient.tsx](src/components/admin/SchedulingAndAvailabilityClient.tsx) | 6h |
| Analytics metrics engine | [UnifiedInsightsClient.tsx](src/components/admin/UnifiedInsightsClient.tsx) | 12h |
| Checklist auto-population | [OperationsEnhancementsClient.tsx](src/components/admin/OperationsEnhancementsClient.tsx) | Included in 8h above |
| Completion report auto-trigger | [completion-report/route.ts](src/app/api/completion-report/route.ts) | 3h |
| Employment app email delivery | [employment-application/route.ts](src/app/api/employment-application/route.ts) | 5h |

**Subtotal: 34h**

### Harden & Improve (Working → Production-Ready)

| Item | Issue | Est. |
|---|---|---|
| Notification retry logic | [notifications.ts](src/lib/notifications.ts) | 5h |
| Photo queue cleanup | [photo-upload-queue.ts](src/lib/photo-upload-queue.ts) | 3h |
| Notification dedup | [notification-dispatch/route.ts](src/app/api/notification-dispatch/route.ts) | 4h |
| Crew notification on job reschedule | [assignment-notifications.ts](src/lib/assignment-notifications.ts) | 2h |
| Service page template consolidation | 5x service-detail pages | 1h |

**Subtotal: 15h**

### Test & Verify

| Item | Type | Est. |
|---|---|---|
| Mobile Kanban responsivity | [LeadPipelineClient.tsx](src/components/admin/LeadPipelineClient.tsx) | 4h |
| Real-device photo queue offline sync | [EmployeeTicketsClient.tsx](src/components/employee/EmployeeTicketsClient.tsx) | 3h |
| SMS delivery verification (all flows) | Multiple API routes | 3h |
| Employment app form end-to-end | [EmploymentApplicationForm.tsx](src/components/public/EmploymentApplicationForm.tsx) | 2h |
| Email resend failures | [email.ts](src/lib/email.ts) | 2h |

**Subtotal: 14h**

### Polish & UX (Nice-to-have)

| Item | Type | Est. |
|---|---|---|
| Admin nav reorganization/IA | [src/app/(admin)/admin/page.tsx](src/app/(admin)/admin/page.tsx) | 12h |
| Bulk job actions (export, reschedule, assign) | [TicketManagementClient.tsx](src/components/admin/TicketManagementClient.tsx) | 6h |
| Employee inventory UI wiring | [EmployeeInventoryClient.tsx](src/components/employee/EmployeeInventoryClient.tsx) | 3h |
| Notification bulk retry/filter | Multiple components | 3h |
| Homepage visual summary section | [src/app/(public)/page.tsx](src/app/(public)/page.tsx) | 3h |
| Header cache optimization | [PublicHeader.tsx](src/components/public/variant-a/PublicHeader.tsx) | 1h |
| CTA hierarchy consistency | Public pages | 2h |

**Subtotal: 30h**

---

## Total Work Estimate

| Category | Hours | Status |
|---|---|---|
| 🔴 Critical (blocking) | 28h | Start immediately |
| 🟡 High Priority (MVP+1) | 34h + test (14h) | Start after critical |
| 🟢 Polish & UX | 30h | Post-MVP |
| **TOTAL** | **~106h** | Roadmap paced |

---

## Recommended Sequencing

### Week 1: Unblock Phase 4

1. [notifications.ts](src/lib/notifications.ts) retry logic (5h)
2. [photo-upload-queue.ts](src/lib/photo-upload-queue.ts) cleanup (3h)
3. [notification-dispatch/route.ts](src/app/api/notification-dispatch/route.ts) dedup (4h)
4. Real-device SMS verification (3h)

**Output:** Production-ready notification reliability

### Week 2-3: Admin Completeness

1. [OperationsEnhancementsClient.tsx](src/components/admin/OperationsEnhancementsClient.tsx) QA workflow (8h)
2. [SchedulingAndAvailabilityClient.tsx](src/components/admin/SchedulingAndAvailabilityClient.tsx) mobile + calendar (6h)
3. [completion-report/route.ts](src/app/api/completion-report/route.ts) auto-trigger (3h)
4. Mobile Kanban test (4h)

**Output:** Phase 2 operations complete

### Week 4: QB Integration Sprint

1. OAuth2 token exchange + realm binding (8h)
2. Vendor/customer sync (6h)
3. Invoice pull + financial snapshots (6h)

**Output:** Phase 4 financial dashboard foundation

### Week 5+: Polish & Phase 3

- Hiring inbox (10h)
- Analytics engine (12h)
- Admin IA reorganization (12h)
- Testing suite (14h)

---

## Links by Component for Quick Access

**Admin:**
- [LeadPipelineClient](src/components/admin/LeadPipelineClient.tsx)
- [TicketManagementClient](src/components/admin/TicketManagementClient.tsx)
- [OperationsEnhancementsClient](src/components/admin/OperationsEnhancementsClient.tsx)
- [SchedulingAndAvailabilityClient](src/components/admin/SchedulingAndAvailabilityClient.tsx)
- [UnifiedInsightsClient](src/components/admin/UnifiedInsightsClient.tsx)
- [HiringInboxClient](src/components/admin/HiringInboxClient.tsx)
- [NotificationCenterClient](src/components/admin/NotificationCenterClient.tsx)

**APIs:**
- [quickbooks-sync](src/app/api/quickbooks-sync/route.ts)
- [completion-report](src/app/api/completion-report/route.ts)
- [employment-application](src/app/api/employment-application/route.ts)
- [notification-dispatch](src/app/api/notification-dispatch/route.ts)
- [ai-assistant](src/app/api/ai-assistant/route.ts)

**Libraries:**
- [notifications](src/lib/notifications.ts)
- [photo-upload-queue](src/lib/photo-upload-queue.ts)
- [assignment-notifications](src/lib/assignment-notifications.ts)

**Pages:**
- [Admin dashboard](src/app/(admin)/admin/page.tsx)
- [Employee portal](src/app/(employee)/employee/page.tsx)
- [Homepage](src/app/(public)/page.tsx)
