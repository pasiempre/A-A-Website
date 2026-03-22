# A&A CLEANING PLATFORM — IMPLEMENTATION BIBLE
## Consolidated Findings, Resolved Contradictions, and Definitive Build Plan

**Created:** March 2026
**Purpose:** Single source of truth for all remaining development work
**Scope:** Synthesized from 8 planning documents + cross-cutting analysis
**Rule:** If this document contradicts any previous spec, this document wins.

---

## TABLE OF CONTENTS

1. [Ground Truth: What Actually Exists](#1-ground-truth)
2. [Database Reality: The Actual Schema](#2-database-reality)
3. [Resolved Contradictions](#3-resolved-contradictions)
4. [Pre-Implementation Fixes (Do First, No Exceptions)](#4-pre-implementation-fixes)
5. [Implementation Phase 1: Admin Navigation Restructure](#5-phase-1-admin-navigation)
6. [Implementation Phase 2: QA Review System](#6-phase-2-qa-review)
7. [Implementation Phase 3: Workflow Completion & Polish](#7-phase-3-workflow-completion)
8. [Implementation Phase 4: Financial Integration & Analytics](#8-phase-4-financial)
9. [Deferred Scope (Do Not Build Yet)](#9-deferred-scope)
10. [Public Site Status & Actions](#10-public-site)
11. [Employee Portal Plan](#11-employee-portal)
12. [Database Changes Required](#12-database-changes)
13. [Notification Architecture](#13-notifications)
14. [GC Completion Report Specification](#14-gc-report)
15. [Testing Strategy](#15-testing)
16. [Risk Register](#16-risks)
17. [Definition of Done & Launch Gates](#17-launch-gates)
18. [Retired Documents & Decisions Log](#18-retired-documents)

---

## 1. GROUND TRUTH: WHAT ACTUALLY EXISTS {#1-ground-truth}

This section replaces every "current state" description in every previous document. If a previous spec says something different, it is wrong. This is the truth.

### 1.1 Technology Stack (Verified)
```
Framework:     Next.js 16.1.7 + React 19.2.4
Styling:       Tailwind CSS 3.4.17
Database:      Supabase PostgreSQL with RLS
Auth:          Supabase Auth with phone OTP via Twilio
Email:         Resend
SMS:           Twilio
PDF:           Exists in lib/quote-pdf.ts (library TBD — verify: jsPDF, pdf-lib, or @react-pdf)
AI:            AIQuoteAssistant component with streaming API endpoint
Hosting:       Vercel (assumed from Next.js + Turbopack configuration)
TypeScript:    Strict mode enabled
```

### 1.2 Application Routes (Verified)
```
PUBLIC ROUTES:
  /                          Home page (VariantAPublicPage — 15 sections)
  /about                     About page (static)
  /services                  Services page (static)
  /careers                   Careers page (static + EmploymentApplicationForm)
  /camera-spike              ⚠️ TEST PAGE — must be evaluated or removed
  /quote/[token]             Token-based quote viewing + accept/decline

AUTH ROUTES:
  /auth/admin                Admin login (phone OTP)
  /auth/employee             Employee login (phone OTP)

PROTECTED ROUTES:
  /admin                     Admin dashboard (single page, 10 components stacked)
  /employee                  Employee portal (2 components stacked)

API ROUTES (12 total — verify each):
  /api/quote-request         POST: Create lead + quote from public form
  /api/quote-response        POST: Accept/decline quote via token
  /api/quote-send            POST: Send quote PDF via email
  /api/quote-create-job      POST: Convert accepted quote to job
  /api/ai-assistant           POST: Stream AI chat response
  /api/assignment-notify      POST: SMS crew about job assignment
  /api/completion-report      POST: Submit job completion with photos
  /api/notification-dispatch  POST: Process SMS dispatch queue
  [4 more — verify by listing src/app/api/ directory]
```

### 1.3 Admin Components (10 — All Functional)

| # | Component | What It Does | Data Tables | Status |
|---|-----------|-------------|-------------|--------|
| 1 | FirstRunWizardClient | 4-step onboarding: create sample client → job → assignment | clients, jobs, job_assignments, profiles | ✅ Works — show only on first login |
| 2 | LeadPipelineClient | 7-column Kanban: new → contacted → quoted → won/lost/dormant | leads, quotes, quote_line_items, clients | ✅ Works desktop — ⚠️ broken on mobile |
| 3 | TicketManagementClient | Job creation form + job list with status filter + inline QA editing | jobs, job_assignments, checklist_templates, issue_reports | ✅ Works |
| 4 | SchedulingAndAvailabilityClient | Crew availability input + calendar + drag-drop job reassignment | employee_availability, job_reassignment_history, jobs, job_assignments | ⚠️ Drag-drop untested on mobile |
| 5 | OperationsEnhancementsClient | Checklist template editor + job messaging + completion reports | checklist_templates, checklist_template_items, job_messages | ✅ Works — needs splitting |
| 6 | UnifiedInsightsClient | 5-tab dashboard: overview, operations, quality, financials, inventory | jobs, leads, issue_reports, financial_snapshots, supplies, quickbooks_invoice_cache | ⚠️ Financial data is SIMULATED |
| 7 | NotificationCenterClient | Notification preferences (quiet hours, timezone) + SMS queue preview | profiles.notification_preferences, notification_dispatch_queue | ✅ Works |
| 8 | NotificationDispatchClient | SMS queue table with status, retry button, manual dispatch | notification_dispatch_queue | ✅ Works — overlaps with #7 |
| 9 | HiringInboxClient | Employment application list with status dropdown | employment_applications | ✅ Works |
| 10 | InventoryManagementClient | Supply tracking + low-stock alerts + request approval | supplies, supply_requests | ✅ Works — Phase 5 feature, premature |

### 1.4 Employee Components (2 — Functional)

| # | Component | What It Does | Data Tables | Status |
|---|-----------|-------------|-------------|--------|
| 1 | EmployeeTicketsClient | Accordion job cards with status buttons, photo upload (GPS + IndexedDB offline queue), issue reporting, Spanish labels | job_assignments, jobs, job_checklist_items, job_messages, issue_reports, job_photos | ⚠️ Works but no bottom nav, no upload progress indicator |
| 2 | EmployeeInventoryClient | Supply usage logging + request submission | supplies, supply_usage_logs, supply_requests, job_assignments | ✅ Works — Phase 5 feature, premature |

### 1.5 What ACTUALLY Works End-to-End (Verified by Phase 1 Audit)
```
✅ Public visitor submits quote form → lead + quote created in DB → PDF generated → email sent via Resend
✅ Customer clicks token link → views quote → accepts → job record created → admin notified
✅ Admin creates job → assigns crew → SMS sent to employee via Twilio
✅ Employee receives assignment → updates status → uploads photos (with GPS + timestamp + offline queue)
✅ Employee reports issues (photo + description)
✅ Admin can view job completion photos and edit qa_status inline
✅ Notification preferences with quiet hours work
✅ Phone OTP authentication works for both admin and employee
```

### 1.6 What Does NOT Work or Does Not Exist
```
❌ No admin navigation — 10 components on single scrolling page
❌ No dedicated QA review interface — just inline qa_status editing on job cards
❌ Checklist templates exist but DON'T auto-populate when job is created
❌ Completion reports exist as PDF template but DON'T auto-generate on QA approval
❌ No lead follow-up automation (no cron/scheduled reminders)
❌ No GC-facing completion report delivery mechanism
❌ Financial dashboard shows SIMULATED data (completed_jobs × $650), not real QuickBooks data
❌ No employee bottom navigation
❌ No admin hub/landing page with daily priorities
❌ Mobile Kanban is unusable (cards slide off screen)
❌ Error pages (404, 500) not created
❌ Auth role check inconsistency (middleware reads app_metadata.role, app reads profiles.role)
```

---

## 2. DATABASE REALITY: THE ACTUAL SCHEMA {#2-database-reality}

### 2.1 Existing Tables (28 Total)

**Operational Core (8 tables):**
1. `profiles` — users with roles + notification_preferences (JSON)
2. `clients` — GC/PM company records
3. `leads` — inbound inquiries before conversion
4. `quotes` — estimates with public_token for customer access
5. `quote_line_items` — detail lines within quotes
6. `jobs` — work orders with qa_status field
7. `job_assignments` — crew-to-job mapping with status workflow
8. `job_reassignment_history` — audit trail for reassignments

**Quality & Completion (6 tables):**
9. `job_checklist_items` — task checklist items per job
10. `checklist_templates` — reusable template definitions
11. `checklist_template_items` — items within templates
12. `issue_reports` — problems flagged during jobs (photo + description)
13. `job_photos` — completion photos with metadata
14. `job_messages` — location-based communication thread per job

**Notifications (2 tables):**
15. `notification_dispatch_queue` — SMS queue with status tracking
16. `notification_preferences` — user settings (may be JSON field on profiles)

**Scheduling (1 table):**
17. `employee_availability` — crew availability blocks

**Financial (2 tables):**
18. `financial_snapshots` — periodic revenue snapshots (SIMULATED)
19. `quickbooks_invoice_cache` — QB invoice data (SIMULATED)

**Inventory (3 tables):**
20. `supplies` — master supply list
21. `supply_requests` — crew request workflow
22. `supply_usage_logs` — per-job supply consumption

**Hiring (1 table):**
23. `employment_applications` — job applicant submissions

**Auth/System (2 managed by Supabase):**
24. `auth.users` — Supabase Auth
25. `sessions` — if implementing session management

**Storage Buckets:**
- `job-photos` — Supabase Storage for completion photos

### 2.2 Critical Schema Conflict: Phase 2C vs Reality

Phase 2C (QA Module spec) designed these tables from scratch, **not knowing they already exist:**

| Phase 2C Proposed | Already Exists As | Resolution |
|-------------------|-------------------|------------|
| `issues` (new table) | `issue_reports` | **USE `issue_reports`.** Add missing columns if needed (severity, resolution_notes, resolved_by, resolved_at). Do NOT create a duplicate table. |
| `issue_photos` (new table) | Photos stored in `issue_reports` or `job_photos` | **Verify current storage.** If issue_reports already has photo_url, no new table needed. If not, add photo_url column to issue_reports OR create issue_photos as a junction table. |
| `completion_photos` (new table) | `job_photos` | **USE `job_photos`.** Add missing columns if needed (gps_latitude, gps_longitude, caption). Do NOT create a duplicate table. |
| `job_completions` (new table) | Completion data lives on `jobs` (qa_status) + `job_assignments` (status) | **CREATE `job_completions` as NEW table** — but only for the submission/review audit trail. See Section 12 for exact schema. |
| `qa_reviews` (new table) | Does not exist | **CREATE as recommended.** This is genuinely new. |
| `job_checklists` (new table) | Partially exists as `job_checklist_items` | **ADD `job_checklists` as a parent table** linking a job to a template, with completion metadata. `job_checklist_items` becomes the child rows. |
| `checklist_templates` | Already exists | **USE existing.** |
| `checklist_items` (renamed) | Already exists as `checklist_template_items` | **USE existing name** `checklist_template_items`. |
| `resource_library` (new table) | Does not exist | **DEFER to Phase 5.** MVP resource library = external links only. |

---

## 3. RESOLVED CONTRADICTIONS {#3-resolved-contradictions}

Every contradiction identified across all 8 documents, with a definitive resolution.

### 3.1 Document Authority

| Document | Status | Use For |
|----------|--------|---------|
| Phase 1 Audit (admin/employee) | **PRIMARY AUTHORITY** for current state | All "what exists" questions |
| Phase 2A Doc 2 (codebase-aware nav spec) | **PRIMARY AUTHORITY** for admin navigation | Navigation structure, routing, wireframes |
| Phase 2A Doc 1 (theoretical IA) | **RETIRED** | Archive as long-term vision reference only |
| Phase 2B (component design) | **REFERENCE** | Visual tokens, component patterns — but reconcile with existing components |
| Phase 2C (QA module) | **REFERENCE with modifications** | QA workflow design is good; database schema must be reconciled per Section 2.2 |
| Phase 3 (roadmap) | **RETIRED — replaced by this document** | Archive; estimates and timelines are wrong |
| Phase 3A (public site audit) | **REFERENCE with caveats** | Public site structure — but behavior unverified |
| Phase 4A (UX review) | **REFERENCE with caveats** | Design patterns — but findings are speculative, not empirical |
| Master Spec 2.0 Gameplan | **RETIRED — this document is the deliverable** | The gameplan described what to create; this IS the creation |

### 3.2 Specific Contradictions Resolved

| Contradiction | Resolution |
|---------------|------------|
| Two Phase 2A documents with different navigation structures | **Use Document 2** (sidebar + hub, 6 sections, 16-hour estimate). Document 1 is retired. |
| Phase 2B lists QA components AND Phase 2C lists QA components | **Phase 2C owns QA component design.** Remove QA components from Phase 2B inventory. |
| Phase 3 Roadmap estimates 500+ hours; Phase 1 Audit estimates 80-120 hours | **80-120 hours is correct.** Roadmap designed from scratch; audit knows what exists. |
| Phase 2C creates duplicate database tables | **Use existing tables + targeted additions.** See Section 2.2 and Section 12. |
| Bottom nav items differ between documents (Crew/Schedule vs Schedule vs different orderings) | **Bottom nav is: Hub, Sales, Ops, Quality, More.** See Section 5.5. |
| Phase 2B specifies Framer Motion; codebase uses CSS + Intersection Observer | **Keep CSS + Intersection Observer for now.** Add Framer Motion only if specific animation needs arise. Do not introduce a new dependency preemptively. |
| Phase numbering collision (planning phases vs implementation phases) | **Planning documents use "Spec-" prefix. Implementation uses "Phase-" prefix.** All references in this document use "Phase" for implementation only. |
| AI Quote Assistant exists in code but vanishes from all planning docs | **It exists and works. Keep it.** Add to Phase 3 polish scope (verify streaming, test edge cases). Do not rebuild. |
| Financial dashboard shows simulated data | **Hide the Financials tab until QuickBooks integration is live.** Add a feature flag or conditional render. |
| Employee dashboard: undefined in Phase 2A Doc 1 vs partially described in Phase 2C vs actually existing | **Employee portal exists with 2 functional components.** Needs bottom nav + upload progress indicator. See Section 11. |
| FloatingQuotePanel: dismissible or not? Behavior on mobile? | **Keep current behavior. Verify by actually testing it.** If it's not dismissible, add dismiss with 5-min reappear. If it works, don't touch it. |
| `prefers-reduced-motion` compliance: mentioned but unverified | **Verify during Phase 3 polish.** If the CSS media query exists in globals.css, it works. If not, add it (5 minutes). |

---

## 4. PRE-IMPLEMENTATION FIXES (Do First, No Exceptions) {#4-pre-implementation-fixes}

These are blocking issues that must be resolved before any Phase 1 implementation work. Total: **6-10 hours.**

### 4.1 Fix Auth Role Inconsistency (2 hours) — SECURITY

**Problem:** Middleware reads `app_metadata.role`, application code reads `profiles.role`. If they desync, a demoted admin retains middleware-level access.

**Fix:**
```typescript
// OPTION A (recommended): Use profiles.role everywhere
// In middleware.ts, replace:
//   const role = user.app_metadata?.role
// With:
//   const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
//   const role = profile?.role

// Then add a trigger to sync profiles.role → app_metadata on any change:
// Supabase Edge Function or database trigger
```

**Acceptance criteria:**
- [ ] Middleware reads role from `profiles` table, not `app_metadata`
- [ ] Changing `profiles.role` immediately affects route access
- [ ] Test: change an admin to employee → verify /admin redirects to /auth

### 4.2 Hide Simulated Financial Data (30 minutes)

**Problem:** UnifiedInsightsClient's "Financials" tab shows `completed_jobs × $650` as if it's real revenue.

**Fix:**
```typescript
// In UnifiedInsightsClient, wrap the financials tab:
{QUICKBOOKS_CONNECTED ? (
  <FinancialsTab />
) : (
  <div className="p-8 text-center text-slate-500">
    <p className="font-semibold">Financial data unavailable</p>
    <p className="text-sm mt-2">Connect QuickBooks in Settings → Integrations to see real financial data.</p>
  </div>
)}
```

**Acceptance criteria:**
- [ ] Financials tab shows empty state message, not simulated numbers
- [ ] No fake revenue figures visible anywhere in the dashboard

### 4.3 Evaluate camera-spike Route (30 minutes)

**Problem:** `/camera-spike` is a public route with unknown purpose and potential security implications.

**Fix:**
- Open `src/app/(public)/camera-spike/page.tsx` and read it
- If it's a test/demo: delete the route entirely or move behind auth
- If it's a precursor to crew photo upload: rename to something meaningful and protect it
- Document what it does in a code comment

**Acceptance criteria:**
- [ ] camera-spike route is either removed, protected, or documented

### 4.4 Verify Public Site Flows End-to-End (3-4 hours)

**Problem:** Phase 3A audit cataloged files but never verified behavior. Phase 4A UX review was speculative.

**Actions (do this as a manual testing session, screen-record everything):**

```
QUOTE FLOW VERIFICATION:
  [ ] Go to homepage → click "Get Quote" → does form appear?
  [ ] Fill form with valid data → submit → what response?
  [ ] Check Supabase: lead record created? quote record created?
  [ ] Check email: was quote email sent? To correct address?
  [ ] Click token link in email → does /quote/[token] load?
  [ ] Does quote display correct data?
  [ ] Click "Accept" → does status update in Supabase?
  [ ] Submit with invalid data → what error appears?
  [ ] Visit /quote/invalid-token → what happens?

MOBILE VERIFICATION:
  [ ] Open homepage on phone (or Chrome DevTools 375px)
  [ ] Is there a hamburger menu? Screenshot it.
  [ ] Can you complete the quote form on mobile?
  [ ] Does the floating quote panel appear? Can you dismiss it?
  [ ] Does the before/after slider work with touch?

AI ASSISTANT VERIFICATION:
  [ ] Open AI chat → does it respond?
  [ ] Ask about services → relevant answer?
  [ ] Send empty message → graceful handling?

EMPLOYEE FLOW VERIFICATION:
  [ ] Log in as employee → does dashboard load?
  [ ] Are assigned jobs visible?
  [ ] Can you update job status?
  [ ] Can you upload a photo? Does GPS/timestamp attach?

ADMIN FLOW VERIFICATION:
  [ ] Log in as admin → does dashboard load (all 10 components)?
  [ ] Create a lead in pipeline → does it appear?
  [ ] Create a job → assign crew → does SMS send?
```

**Output:** A verification report with ✅/❌/⚠️ for each item. This replaces ALL "needs verification" notes across every previous spec.

### 4.5 Add Cascade/Soft Delete Protection (1-2 hours)

**Problem:** Deleting an employee leaves orphaned job_assignments and breaks UI components.

**Fix:**
```sql
-- Add soft delete to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deactivated_at TIMESTAMP DEFAULT NULL;

-- Update all employee queries to filter active only
-- Pattern: WHERE role = 'employee' → WHERE role = 'employee' AND is_active = TRUE
```

**Acceptance criteria:**
- [ ] `is_active` column exists on profiles
- [ ] Deactivating a user doesn't break any component
- [ ] Employee list queries filter by is_active = TRUE

### 4.6 Create Error Pages (1 hour)

**Fix:**
```
Create:
  src/app/not-found.tsx         — branded 404 page with "Go Home" button
  src/app/error.tsx             — branded 500 page with "Try Again" button  
  src/app/quote/[token]/not-found.tsx — "Quote not found or expired" page
```

**Acceptance criteria:**
- [ ] /nonexistent-page shows branded 404
- [ ] /quote/invalid-token shows quote-specific error
- [ ] Error page has navigation back to homepage

---

## 5. PHASE 1: ADMIN NAVIGATION RESTRUCTURE {#5-phase-1-admin-navigation}

**Estimate:** 16-20 hours
**Priority:** HIGHEST — this is the single most impactful change
**Source of truth:** Phase 2A Document 2 (codebase-aware nav spec)

### 5.1 Architecture

```
Admin Dashboard Architecture:
  Layout: Persistent sidebar (desktop) + bottom nav (mobile) + header bar
  Sections: 6 primary — Sales, Operations, Quality, Notifications, Analytics, Settings
  Default landing: /admin/dashboard (hub page with daily priorities)
  Pattern: Sidebar + Hub (Option A+C from Phase 1 Audit)
```

### 5.2 Route Structure (Implementation-Ready)

```
src/app/(admin)/admin/
├── layout.tsx                              ← AdminLayout (sidebar + header + bottom nav)
├── page.tsx                                ← Redirect to /admin/dashboard
├── dashboard/page.tsx                      ← NEW: AdminHubDashboard
├── leads/
│   ├── page.tsx                            ← REFACTOR: LeadPipelineClient
│   └── [id]/page.tsx                       ← NEW (Phase 2): LeadDetailPage
├── jobs/
│   ├── page.tsx                            ← REFACTOR: TicketManagementClient
│   └── [id]/page.tsx                       ← NEW (Phase 2): JobDetailPage
├── schedule/page.tsx                       ← REFACTOR: SchedulingAndAvailabilityClient
├── quality/
│   ├── page.tsx                            ← NEW: QAReviewQueue
│   └── [id]/page.tsx                       ← NEW: QADetailPage
├── notifications/page.tsx                  ← MERGE: NotificationCenter + Dispatch (tabs)
├── analytics/page.tsx                      ← REFACTOR: UnifiedInsightsClient
└── settings/
    ├── page.tsx                            ← Settings hub
    ├── templates/page.tsx                  ← EXTRACT: Template editor from OperationsEnhancements
    └── hiring/page.tsx                     ← MOVE: HiringInboxClient
```

### 5.3 Component Build List

**New components to create:**

| Component | File | Purpose | Estimate |
|-----------|------|---------|----------|
| AdminLayout | `src/components/admin/AdminLayout.tsx` | Wraps all admin pages with sidebar + header + bottom nav | 3 hours |
| Sidebar | `src/components/admin/Sidebar.tsx` | Desktop: 240px, tablet: 64px icons, mobile: hidden | Included in AdminLayout |
| BottomNav | `src/components/admin/BottomNav.tsx` | Mobile only: 5 items | Included in AdminLayout |
| Header | `src/components/admin/Header.tsx` | Logo, page title, notification bell, settings gear | Included in AdminLayout |
| AdminHubDashboard | `src/components/admin/pages/AdminHubDashboard.tsx` | Daily digest: uncalled leads, jobs to assign, pending QA, weekly snapshot | 4 hours |

**Existing components to refactor (move, not rewrite):**

| Component | From | To | Changes | Estimate |
|-----------|------|----|---------|----------|
| LeadPipelineClient | `/admin` page | `/admin/leads/page.tsx` | Import in new route file; add mobile card view alternative | 1 hour |
| TicketManagementClient | `/admin` page | `/admin/jobs/page.tsx` | Import in new route file | 30 min |
| SchedulingAndAvailabilityClient | `/admin` page | `/admin/schedule/page.tsx` | Import in new route file | 30 min |
| UnifiedInsightsClient | `/admin` page | `/admin/analytics/page.tsx` | Import; hide Financials tab per 4.2 | 30 min |
| NotificationCenterClient + NotificationDispatchClient | `/admin` page | `/admin/notifications/page.tsx` | Merge into single page with two tabs: Preferences and Queue | 2 hours |
| HiringInboxClient | `/admin` page | `/admin/settings/hiring/page.tsx` | Import in new route file | 30 min |
| OperationsEnhancementsClient | `/admin` page | Split into 3 destinations | See Section 5.4 | 3 hours |
| FirstRunWizardClient | `/admin` page | `/admin/dashboard` as conditional modal | Show only on first login; check localStorage or profile flag | 30 min |

**Components to HIDE (not delete):**

| Component | Reason | Action |
|-----------|--------|--------|
| InventoryManagementClient | Phase 5 feature, premature | Don't create a route for it. Component stays in codebase but is unreachable. |
| EmployeeInventoryClient | Phase 5 feature, premature | Don't render in employee portal. Keep component file. |

### 5.4 OperationsEnhancementsClient Split (Detailed)

This is the most complex refactoring task. Current component contains three features that belong in different places.

```
CURRENT: OperationsEnhancementsClient
├── Checklist template editor (left column)
├── Job messaging interface (right column, top)
└── Completion report generation (right column, bottom)

SPLIT INTO:

1. Checklist Template Editor
   New location: /admin/settings/templates/page.tsx
   New component: TemplatesSettingsPage.tsx
   Extracts: Template CRUD form + template list + template item management
   Data: checklist_templates, checklist_template_items
   Estimate: 1.5 hours

2. Job Messaging
   New location: /admin/jobs/[id]/page.tsx (section within job detail — Phase 2)
   For now: DEFER. Job messaging is not critical path.
   When built: Embed as a collapsible section in the job detail page
   Data: job_messages
   Estimate: Deferred

3. Completion Report Trigger
   New location: /admin/quality/[id]/page.tsx (triggered on QA approval)
   Integration: When admin clicks "Approve" on QA review, completion report auto-generates
   Data: jobs, job_photos, job_checklist_items
   Estimate: Part of Phase 2 QA work (Section 6)
```

### 5.5 Mobile Bottom Navigation (Final Spec)

```
┌──────────────────────────────────┐
│ 🏠 Hub  💰 Sales  🔧 Ops  ✅ QA  ⋯ More │
└──────────────────────────────────┘

Item 1: Hub → /admin/dashboard (daily digest, always the home base)
Item 2: Sales → /admin/leads (lead pipeline)
Item 3: Ops → /admin/jobs (job management)
Item 4: QA → /admin/quality (QA review queue)
Item 5: More → Slide-up sheet with: Notifications, Analytics, Settings, Schedule

Design specs:
  Height: 56px (iOS safe area respected)
  Background: bg-white border-t border-slate-200
  Active item: text-slate-900, others text-slate-500
  Icons: 24px, labels: 10px
  Tap targets: minimum 48x48px
```

### 5.6 Hub Dashboard Data Query

```sql
-- Single RPC function for hub dashboard (create in Supabase)
CREATE OR REPLACE FUNCTION get_admin_hub_metrics()
RETURNS JSON AS $$
  SELECT json_build_object(
    'uncalled_leads', (
      SELECT COUNT(*) FROM leads WHERE status = 'new'
    ),
    'uncalled_oldest_minutes', (
      SELECT EXTRACT(EPOCH FROM (NOW() - MIN(created_at)))/60 
      FROM leads WHERE status = 'new'
    ),
    'jobs_to_assign', (
      SELECT COUNT(*) FROM jobs 
      WHERE status IN ('draft', 'scheduled') 
      AND id NOT IN (SELECT DISTINCT job_id FROM job_assignments WHERE status != 'cancelled')
    ),
    'pending_qa', (
      SELECT COUNT(*) FROM jobs WHERE qa_status = 'pending_review'
    ),
    'completed_this_week', (
      SELECT COUNT(*) FROM jobs 
      WHERE qa_status = 'approved' 
      AND updated_at > NOW() - INTERVAL '7 days'
    ),
    'active_leads_total', (
      SELECT COUNT(*) FROM leads WHERE status NOT IN ('won', 'lost', 'dormant')
    ),
    'leads_by_status', (
      SELECT json_object_agg(status, cnt) 
      FROM (SELECT status, COUNT(*) as cnt FROM leads GROUP BY status) s
    )
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

### 5.7 Mobile Lead View (Kanban Alternative)

On screens < 1024px, the Kanban board is replaced with a filtered card list:

```
Default view: Cards filtered by "NEW" status (most actionable)
Filter dropdown: NEW | CONTACTED | QUOTED | WON | LOST | ALL
Sort: Newest first (default), Oldest first, Company name
Each card shows:
  - Status badge with color (🔴 UNCALLED if new + >1 hour old)
  - Lead name + company
  - Phone number (tappable tel: link)
  - Time since creation
  - Quick actions: 📞 CALL | +Quote | View Details
```

Kanban board is only rendered on screens ≥ 1024px.

### 5.8 Navigation Behavior Rules

```
Sidebar links: Navigate to section root (e.g., clicking "Jobs" goes to /admin/jobs)
Bottom nav taps: Same behavior as sidebar links
Detail pages: "← Back" goes one level up (e.g., /admin/quality/[id] → /admin/quality)
Hub quick actions: Navigate with filter (e.g., "Call Uncalled Leads" → /admin/leads?filter=new)
Browser back: Standard behavior
Active state: Current section highlighted in sidebar AND bottom nav
Breadcrumbs: NOT implemented in Phase 1. Add in Phase 3 if needed.
URL query params: Used for filters (filter=new, sort=created, date_range=this_week)
```

### 5.9 Phase 1 Acceptance Criteria

- [ ] All admin routes functional and navigable
- [ ] Sidebar visible on desktop (≥1024px) with 6 sections
- [ ] Sidebar collapses to icons on tablet (768-1023px)
- [ ] Bottom nav visible on mobile (<768px) with 5 items
- [ ] Hub dashboard shows live counts from `get_admin_hub_metrics()`
- [ ] Quick action cards navigate to correct filtered views
- [ ] Lead pipeline renders as Kanban on desktop, card list on mobile
- [ ] All existing component functionality preserved in new locations
- [ ] Notifications merged into single page with tabs
- [ ] OperationsEnhancements template editor extracted to settings
- [ ] FirstRunWizard shows only on first login
- [ ] InventoryManagement unreachable (no route)
- [ ] Old `/admin/page.tsx` with 10 stacked components is DELETED
- [ ] Mobile tested on real device or accurate emulator (375px, 768px)

---

## 6. PHASE 2: QA REVIEW SYSTEM {#6-phase-2-qa-review}

**Estimate:** 20-28 hours
**Priority:** HIGH — this is the critical missing business feature
**Depends on:** Phase 1 complete (admin navigation exists)

### 6.1 What Already Exists (Don't Rebuild)

```
EXISTS:
  ✅ jobs.qa_status field (pending_review, approved, flagged, needs_rework)
  ✅ job_photos table with Supabase Storage
  ✅ job_checklist_items table
  ✅ issue_reports table
  ✅ Employee photo upload with GPS + timestamp + offline IndexedDB queue
  ✅ Employee issue reporting with photo + description
  ✅ Completion report PDF template (lib/quote-pdf.ts or similar)
  ✅ Email delivery via Resend

DOES NOT EXIST (must build):
  ❌ QA review queue interface (admin sees list of jobs pending review)
  ❌ QA detail page (admin reviews photos + checklist + issues for one job)
  ❌ Approval/rejection workflow with notes
  ❌ Auto-generation of completion report on approval
  ❌ Delivery of completion report to GC
  ❌ Rework notification to crew
  ❌ qa_reviews audit table (who reviewed what, when, what decision)
  ❌ Checklist auto-population when job is created from template
```

### 6.2 Database Additions (Exact Schema)

```sql
-- 1. QA Reviews audit table (NEW)
CREATE TABLE qa_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id),
  reviewed_by UUID NOT NULL REFERENCES profiles(id),
  decision VARCHAR NOT NULL CHECK (decision IN ('approved', 'rework_requested', 'escalated', 'skipped')),
  notes TEXT,
  rework_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Job completions submission table (NEW - tracks crew submissions)
CREATE TABLE job_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id),
  completed_by UUID NOT NULL REFERENCES profiles(id),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submission_number INTEGER DEFAULT 1,
  checklist_completion_percent DECIMAL,
  photos_count INTEGER DEFAULT 0,
  notes TEXT
);

-- 3. Job checklists parent table (NEW - links job to template)
CREATE TABLE job_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id),
  template_id UUID REFERENCES checklist_templates(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 4. Add columns to existing job_checklist_items
ALTER TABLE job_checklist_items 
  ADD COLUMN IF NOT EXISTS job_checklist_id UUID REFERENCES job_checklists(id),
  ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'pending' 
    CHECK (status IN ('pending', 'completed', 'not_applicable', 'unable')),
  ADD COLUMN IF NOT EXISTS status_note TEXT,
  ADD COLUMN IF NOT EXISTS checked_at TIMESTAMP WITH TIME ZONE;

-- 5. Add columns to existing job_photos (if missing)
ALTER TABLE job_photos
  ADD COLUMN IF NOT EXISTS gps_latitude DECIMAL(10,7),
  ADD COLUMN IF NOT EXISTS gps_longitude DECIMAL(10,7),
  ADD COLUMN IF NOT EXISTS caption TEXT;

-- 6. Add columns to existing issue_reports (if missing)
ALTER TABLE issue_reports
  ADD COLUMN IF NOT EXISTS severity VARCHAR DEFAULT 'medium' 
    CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ADD COLUMN IF NOT EXISTS resolution_status VARCHAR DEFAULT 'open'
    CHECK (resolution_status IN ('open', 'under_review', 'resolved', 'disputed')),
  ADD COLUMN IF NOT EXISTS resolution_notes TEXT,
  ADD COLUMN IF NOT EXISTS resolved_by UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE;

-- 7. Completion reports table (NEW)
CREATE TABLE completion_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id),
  qa_review_id UUID REFERENCES qa_reviews(id),
  token VARCHAR UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_to_email VARCHAR,
  sent_at TIMESTAMP WITH TIME ZONE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  pdf_url VARCHAR,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '90 days')
);

-- 8. RLS Policies
-- Crew can only see their own completions
CREATE POLICY "crew_own_completions" ON job_completions
  FOR SELECT USING (completed_by = auth.uid());

-- Admin can see all completions  
CREATE POLICY "admin_all_completions" ON job_completions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- QA reviews: admin only
CREATE POLICY "admin_qa_reviews" ON qa_reviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

### 6.3 Checklist Auto-Population Fix (4-6 hours)

**Problem:** When a job is created with a template_id, checklist items don't auto-populate.

**Fix sequence:**
1. When TicketManagementClient creates a job with a template_id:
2. Create a `job_checklists` record linking job to template
3. Query `checklist_template_items` for that template
4. Insert into `job_checklist_items` for each template item
5. EmployeeTicketsClient renders items as interactive checkboxes with three states: Completed, N/A (with note), Unable to Complete (with note)
6. Required items must be Completed or have a valid status note before crew can submit

```typescript
// In job creation handler (TicketManagementClient or API route)
async function createJobWithChecklist(jobData: JobInput, templateId: string) {
  // 1. Create job
  const { data: job } = await supabase.from('jobs').insert(jobData).select().single()
  
  // 2. Create job_checklist linking job to template
  const { data: checklist } = await supabase.from('job_checklists').insert({
    job_id: job.id,
    template_id: templateId
  }).select().single()
  
  // 3. Get template items
  const { data: templateItems } = await supabase
    .from('checklist_template_items')
    .select('*')
    .eq('template_id', templateId)
    .order('sort_order')
  
  // 4. Create job checklist items from template
  const jobItems = templateItems.map(item => ({
    job_checklist_id: checklist.id,
    job_id: job.id,  // for backward compat
    item_text: item.item_text,
    sort_order: item.sort_order,
    status: 'pending'
  }))
  
  await supabase.from('job_checklist_items').insert(jobItems)
  
  return job
}
```

### 6.4 QA Review Queue Component (8-10 hours)

**Route:** `/admin/quality`
**Component:** `QAReviewQueue.tsx`

**Query:**
```typescript
const { data: pendingJobs } = await supabase
  .from('jobs')
  .select(`
    *,
    job_assignments(*, profiles(*)),
    job_photos(count),
    job_checklist_items(count, status),
    issue_reports(count),
    clients(*)
  `)
  .eq('qa_status', 'pending_review')
  .order('updated_at', { ascending: true }) // oldest first (FIFO)
```

**Card display (per job):**
```
┌─────────────────────────────────────────────────┐
│ 📍 [Job address/title]           [Client name]  │
│ 👷 Crew: [names]     📅 Completed: [date/time]  │
│ ✅ Checklist: [X/Y items] (Z%)                  │
│ 📷 Photos: [N]     ⚠️ Issues: [N]               │
│                                                  │
│ [📷 View Photos] [🔍 See Details] [✅ Approve]   │
└─────────────────────────────────────────────────┘
```

**Actions:**
- View Photos → opens photo gallery modal or navigates to detail page
- See Details → `/admin/quality/[id]`
- Quick Approve → approves without going to detail (for jobs with 100% checklist + 0 issues)
- Batch select → approve multiple "clean" jobs at once

### 6.5 QA Detail Page Component (6-8 hours)

**Route:** `/admin/quality/[id]`
**Component:** `QADetailPage.tsx`

**Layout:**
```
Desktop: Two columns
  Left: Job info + checklist + issues
  Right: Photo gallery (grid) + approval controls

Mobile: Single column, stacked
  Top: Job info summary
  Middle: Photo carousel (swipe)
  Below: Checklist items
  Below: Issues
  Bottom: Approval buttons (sticky)
```

**Approval flow:**
```
[Approve] clicked:
  1. Create qa_reviews record (decision: 'approved', notes from text field)
  2. Update jobs.qa_status = 'approved'
  3. Generate completion report (PDF) — store in Supabase Storage
  4. Create completion_reports record with token
  5. If GC email known: send completion report email with /report/[token] link
  6. Toast: "Job approved. Completion report generated."

[Request Rework] clicked:
  1. Create qa_reviews record (decision: 'rework_requested', rework_reason required)
  2. Update jobs.qa_status = 'needs_rework'
  3. Update job_assignments.status = 'rework_assigned' (or create new assignment)
  4. Send SMS to crew: "Rework needed at [address]: [reason]"
  5. Send in-app notification to crew
  6. Toast: "Rework requested. Crew notified."

[Flag Critical] clicked:
  1. Create qa_reviews record (decision: 'escalated', notes required)
  2. Create issue_reports record with severity = 'critical'
  3. Update jobs.qa_status = 'flagged'
  4. Send SMS + email to admin (self-notification for tracking)
  5. Toast: "Critical issue flagged."
```

### 6.6 Photo Gallery Behavior

```
Desktop (≥1024px): Grid of thumbnails (3 columns)
  Click thumbnail → modal lightbox with full-res image
  Lightbox shows: photo, timestamp, GPS coordinates, caption
  Navigate: left/right arrows, keyboard arrows, escape to close

Mobile (<1024px): Horizontal carousel (swipe)
  Tap photo → full-screen lightbox
  Swipe left/right in lightbox
  Shows: timestamp below photo

Photo constraints for crew upload:
  Max file size: 5MB per photo (compress client-side before upload)
  Max photos per job: 20
  Format: JPEG only
  Client-side compression: Required before upload
  Metadata: GPS captured at time of photo, timestamp from device clock
  Offline: Stored in IndexedDB, uploaded when connectivity restored (already implemented)

Missing feature to add:
  Upload progress indicator (show "3 of 10 photos uploaded" in employee portal)
```

### 6.7 Phase 2 Acceptance Criteria

- [ ] QA review queue shows all jobs with qa_status = 'pending_review'
- [ ] QA detail page shows photos, checklist, issues for selected job
- [ ] Admin can approve → completion report PDF generated and stored
- [ ] Admin can request rework → crew receives SMS notification
- [ ] Admin can flag critical → issue record created
- [ ] All decisions logged in qa_reviews table with timestamps
- [ ] Checklist auto-populates when job is created with template
- [ ] Employee checklist shows interactive items (completed/N-A/unable)
- [ ] Photo gallery works on both desktop (grid) and mobile (carousel)
- [ ] Completion report accessible via /report/[token] (token-based, like quotes)
- [ ] Rework resubmission creates new submission_number in job_completions
- [ ] Multiple review rounds are preserved (full audit trail)

---

## 7. PHASE 3: WORKFLOW COMPLETION & POLISH {#7-phase-3-workflow-completion}

**Estimate:** 20-30 hours
**Priority:** MEDIUM — completes remaining gaps after navigation + QA
**Depends on:** Phase 1 and Phase 2 complete

### 7.1 Lead Follow-Up Automation (8-12 hours)

**Implementation:** Supabase Edge Function (cron) or Vercel Cron Job

```
Runs every 30 minutes:

Check 1: Uncalled leads (leads.status = 'new')
  - If created > 1 hour ago → SMS to admin: "Uncalled lead: [Name] from [Company] (1h+ ago)"
  - If created > 4 hours ago → SMS to admin: "⚠️ URGENT uncalled lead: [Name] (4h+ ago)"
  
Check 2: Unresponded quotes (quotes.status = 'sent')
  - If sent > 3 days ago → Dashboard alert: "Quote to [Company] has no response (3 days)"
  - If sent > 7 days ago → SMS to admin: "Quote to [Company] expiring — follow up?"
  
Check 3: Overdue QA reviews (jobs.qa_status = 'pending_review')
  - If updated_at > 24 hours ago → Dashboard badge: "Overdue QA review"
  - If updated_at > 48 hours ago → SMS to admin: "2 QA reviews overdue"
```

**Database addition:**
```sql
CREATE TABLE lead_follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  follow_up_type VARCHAR NOT NULL, -- 'uncalled_1h', 'uncalled_4h', 'quote_no_response_3d', 'quote_no_response_7d'
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_via VARCHAR NOT NULL -- 'sms', 'dashboard', 'email'
);

-- Prevent duplicate alerts
-- Before sending, check: SELECT COUNT(*) FROM lead_follow_ups 
-- WHERE lead_id = X AND follow_up_type = Y AND sent_at > NOW() - INTERVAL '24 hours'
```

### 7.2 Detail Pages — Lead and Job (4-6 hours)

**Lead Detail (`/admin/leads/[id]`):**
```
Shows:
  - Lead info (name, company, phone, email, service type, timeline)
  - Quote history (all quotes sent to this lead with status)
  - Communication log (when called, notes)
  - Actions: Create Quote, Mark as Contacted, Convert to Client + Job

When a lead is "Won":
  - One-click: Convert to Client (creates client record) + Create Job (pre-fills from quote)
```

**Job Detail (`/admin/jobs/[id]`):**
```
Shows:
  - Job info (address, service type, scope, scheduled date)
  - Client info
  - Crew assignments (who, when assigned, status)
  - Checklist (linked template items + completion status)
  - Photos (if completed)
  - Issues (if reported)
  - QA status + review history
  - Messages (from job_messages — embed OperationsEnhancements messaging here)
  - Actions: Edit, Reassign Crew, View QA, Generate Report
```

### 7.3 Employee Portal Navigation (4-6 hours)

```
Add bottom navigation to employee portal:

┌──────────────────────────────┐
│ 📋 Jobs  📦 Inventory  👤 Me │
└──────────────────────────────┘

Jobs tab: EmployeeTicketsClient (existing)
Inventory tab: HIDDEN for now (Phase 5)
Me tab: Basic profile view (name, phone, notification preferences)

Additional changes:
  - Add photo upload progress indicator ("Uploading 3 of 10...")
  - Add status badges on job cards (color-coded by status)
  - Verify Spanish labels are complete
  - Test on actual Android phone
```

### 7.4 Public Site Polish (4-6 hours)

Based on verification results from Section 4.4:
- Fix any broken flows discovered during testing
- Verify SEO metadata on all pages (title, description, Open Graph)
- Verify mobile responsiveness (fix any layout issues found)
- Add `prefers-reduced-motion` CSS if not present
- Test AI Quote Assistant and fix any streaming issues
- Ensure form validation shows clear error messages

### 7.5 Error Handling Hardening (4-6 hours)

```
For every form in the application:
  - Required field validation (client-side, on blur)
  - Email format validation
  - Phone number format validation (10 digits)
  - Price/number validation (> 0 for quote line items)
  - Server-side validation in every API route
  - User-friendly error messages (not console.error)
  - Retry button on failed API calls
  - Loading states on all submit buttons (disable + spinner)
  - Toast notifications for success/error (use existing pattern or add sonner library)
  - Network disconnect handling (show banner)

For the admin dashboard:
  - Empty states for all list views ("No pending QA reviews" instead of blank)
  - Loading skeletons while data fetches
  - Error boundaries per section (one component error doesn't crash the whole page)
```

### 7.6 Phase 3 Acceptance Criteria

- [ ] Lead follow-up automation running on schedule
- [ ] Lead detail page shows complete lead context
- [ ] Job detail page shows complete job context with QA history
- [ ] Employee bottom nav functional
- [ ] Photo upload shows progress indicator
- [ ] Public site verified end-to-end on mobile and desktop
- [ ] All forms have validation with clear error messages
- [ ] All list views have empty states and loading states
- [ ] No unhandled console errors in production build

---

## 8. PHASE 4: FINANCIAL INTEGRATION & ANALYTICS {#8-phase-4-financial}

**Estimate:** 20-30 hours
**Priority:** LOW for launch — HIGH for post-launch
**Depends on:** Phases 1-3 complete

### 8.1 QuickBooks Integration (12-16 hours)

```
Scope:
  1. OAuth2 flow (admin connects QB account in /admin/settings/integrations)
  2. Invoice sync (pull invoices from QB → update financial dashboard)
  3. Quote-to-estimate mapping (optional: push quotes as QB estimates)
  4. Invoice status monitoring (paid, pending, overdue)

Implementation:
  - Use QB Node.js SDK
  - Store OAuth tokens in Supabase (encrypted)
  - Sync on demand (manual "Sync Now" button) + daily cron
  - Display sync status and last-sync timestamp

Database:
  - Update quickbooks_invoice_cache with real data
  - Add quickbooks_tokens table for OAuth storage
  - Add quickbooks_sync_log table for troubleshooting
```

### 8.2 Analytics Dashboard Enhancement (8-12 hours)

```
Once QB is live, enable the Financials tab in UnifiedInsightsClient:
  - Real revenue (from QB invoices)
  - Outstanding invoices with aging (0-30, 31-60, 61-90, 90+)
  - Revenue by client
  - Revenue by service type
  - Cash flow chart (monthly)

Add QA metrics (from qa_reviews table):
  - Approval rate by crew member
  - Rework rate by crew member
  - Average review turnaround time
  - Common issue types (from issue_reports)

Add Operations metrics:
  - Jobs completed per week (trend chart)
  - Crew utilization (jobs per crew member)
  - Lead conversion rate (leads won / total leads)
  - Average days from lead to job
```

---

## 9. DEFERRED SCOPE (Do Not Build Yet) {#9-deferred-scope}

These items exist in various planning documents but should NOT be built until Phases 1-3 are complete and launched.

| Feature | Why Defer | When to Reconsider |
|---------|-----------|-------------------|
| Resource Library CMS | Massive scope for minimal MVP impact. Use Google Docs links for now. | After crew onboarding pain points are validated post-launch |
| Advanced Scheduling (auto-assignment) | Manual assignment works for 6-10 crew. Algorithm is premature. | When crew exceeds 15-20 people |
| AI Damage Detection (photos) | Expensive, complex, low ROI at current scale | When photo volume exceeds human review capacity |
| Client Portal (/client login) | No validated demand from GCs. Completion reports via email are sufficient. | After interviewing 5+ GCs about portal interest |
| PWA / Offline-first app | Web app works. IndexedDB photo queue already handles offline photos. | If crew consistently lacks connectivity |
| Inventory Management | Already built (Phase 5 components exist). Not needed at current scale. | When supply management becomes a pain point |
| Advanced Scheduling with drag-drop | Component exists but untested on mobile. Low priority. | When scheduling becomes a bottleneck |
| Dark mode | Not requested. Zero business impact. | Never, unless explicitly requested |
| Internationalization (i18n) beyond Spanish | Employee portal already has Spanish labels. No other languages needed. | If workforce diversifies |
| Storybook | Nice-to-have for component documentation. Not blocking anything. | If team grows beyond 2 developers |
| A/B Testing infrastructure | Variant-A folder structure exists but no active testing. | When conversion optimization becomes a priority |
| Custom Report Builder | Export to CSV covers 90% of reporting needs. | When Areli asks for custom reports |

---

## 10. PUBLIC SITE STATUS & ACTIONS {#10-public-site}

### 10.1 What's Verified (from Phase 3A Audit)

```
STRUCTURE (verified — files exist):
  ✅ 5 public routes + 1 dynamic quote page
  ✅ 15-16 public components in variant-a folder
  ✅ robots.ts and sitemap.ts configured
  ✅ Tailwind design system with slate palette
  ✅ Scroll-triggered animations via useInViewOnce + Intersection Observer
  ✅ next/image configured with remote patterns

BEHAVIOR (UNVERIFIED — must test per Section 4.4):
  ⚠️ Quote form submission → email delivery
  ⚠️ Token-based quote viewing
  ⚠️ AI assistant streaming
  ⚠️ Mobile hamburger menu existence
  ⚠️ FloatingQuotePanel dismiss behavior
  ⚠️ Before/After slider touch support
  ⚠️ Form validation error display
```

### 10.2 Public Site Actions (After Verification)

Based on verification results, fix what's broken. Do NOT redesign the public site. It has 15 working sections and a functional quote flow. The priority is:

```
Fix if broken:
  1. Quote form → must work end-to-end
  2. Mobile responsiveness → must be usable on phone
  3. Error pages → must exist (Section 4.6)
  
Polish if time:
  4. SEO metadata verification
  5. Form validation UX improvement
  6. Loading states on buttons
  
Leave alone:
  7. Animation choreography (works fine as-is)
  8. Icon consistency (cosmetic)
  9. Shadow system (cosmetic)
  10. Homepage section count (14 sections is fine if they load fast)
```

---

## 11. EMPLOYEE PORTAL PLAN {#11-employee-portal}

### 11.1 Current State (Functional)

```
EXISTS:
  ✅ EmployeeTicketsClient — accordion job cards with:
     - Status workflow buttons (assigned → en_route → in_progress → complete)
     - Photo upload with GPS + timestamp + IndexedDB offline queue
     - Issue reporting with photo + description
     - Spanish labels throughout
     - Job checklist display (if items exist)
  ✅ EmployeeInventoryClient — supply usage logging + requests

MISSING:
  ❌ Bottom navigation (Jobs | Me)
  ❌ Photo upload progress indicator
  ❌ Interactive checklist checkboxes (currently display-only)
  ❌ Status badges on job cards (visual indicator)
```

### 11.2 Changes (Included in Phase 2 and Phase 3)

```
Phase 2 (with QA work):
  - Make checklist items interactive checkboxes
  - Add three states per item: Completed, N/A (with note), Unable (with note)
  - Required items block submission until all are completed or explained
  - On completion submit: create job_completions record + update jobs.qa_status

Phase 3 (polish):
  - Add bottom navigation (Jobs | Me)
  - Add photo upload progress indicator
  - Add status badges on job cards
  - Test on actual Android phone
  - Verify Spanish labels are complete
  - Hide EmployeeInventoryClient (don't render it)
```

---

## 12. DATABASE CHANGES REQUIRED {#12-database-changes}

### 12.1 Migration Sequence

Each migration is a separate file. Run in order.

```
Migration 001: profiles_soft_delete.sql
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deactivated_at TIMESTAMP;

Migration 002: job_completions.sql
  CREATE TABLE job_completions (...); -- see Section 6.2

Migration 003: qa_reviews.sql
  CREATE TABLE qa_reviews (...); -- see Section 6.2

Migration 004: job_checklists.sql
  CREATE TABLE job_checklists (...); -- see Section 6.2

Migration 005: job_checklist_items_enhance.sql
  ALTER TABLE job_checklist_items ADD COLUMN IF NOT EXISTS ...; -- see Section 6.2

Migration 006: job_photos_enhance.sql
  ALTER TABLE job_photos ADD COLUMN IF NOT EXISTS ...; -- see Section 6.2

Migration 007: issue_reports_enhance.sql
  ALTER TABLE issue_reports ADD COLUMN IF NOT EXISTS ...; -- see Section 6.2

Migration 008: completion_reports.sql
  CREATE TABLE completion_reports (...); -- see Section 6.2

Migration 009: lead_follow_ups.sql
  CREATE TABLE lead_follow_ups (...); -- see Section 7.1

Migration 010: rls_policies.sql
  CREATE POLICY ...; -- all RLS policies from Section 6.2

Migration 011: hub_metrics_function.sql
  CREATE OR REPLACE FUNCTION get_admin_hub_metrics() ...; -- see Section 5.6
```

### 12.2 Tables NOT to Create (Conflict Resolution)

```
DO NOT CREATE (already exists):
  ✗ issues → use issue_reports
  ✗ issue_photos → add photo columns to issue_reports if needed
  ✗ completion_photos → use job_photos
  ✗ checklist_items → use checklist_template_items
  ✗ checklist_templates → already exists
  ✗ resource_library → deferred to Phase 5+
```

---

## 13. NOTIFICATION ARCHITECTURE {#13-notifications}

### 13.1 QA Event Notifications

| Event | Recipient | Channel | Message |
|-------|-----------|---------|---------|
| Job submitted for QA | Admin | SMS + Dashboard badge | "Job at [address] ready for QA review" |
| Job approved | Crew member | In-app (on next load) | "Job at [address] approved ✓" |
| Rework requested | Crew member | SMS + In-app | "Rework needed at [address]: [reason]" |
| Critical issue flagged | Admin | SMS + Dashboard alert | "⚠️ Critical issue at [address]" |
| QA review overdue (>24h) | Admin | Dashboard badge | "X reviews overdue" |
| QA review overdue (>48h) | Admin | SMS |

# A&A Platform Implementation Bible — Enhancement Layer
## The Codex Execution Specification

**Purpose:** Everything the existing bible doesn't cover, plus hardened versions of what it does. Feed this alongside the original bible as the definitive execution guide.

---

## TABLE OF CONTENTS

1. [Type System & Code Generation](#1-type-system)
2. [API Route Architecture (Standardized)](#2-api-routes)
3. [Security Hardening](#3-security)
4. [Real-Time Architecture](#4-realtime)
5. [State Management & Data Fetching Patterns](#5-state-management)
6. [Admin Layout — Complete Implementation Spec](#6-admin-layout)
7. [Component Patterns & Conventions](#7-component-patterns)
8. [Mobile-First Execution Rules](#8-mobile-rules)
9. [Database Migration Safety](#9-migrations)
10. [Caching & Revalidation Strategy](#10-caching)
11. [Error Handling — Unified System](#11-error-handling)
12. [Logging & Observability](#12-logging)
13. [File Upload Pipeline (Hardened)](#13-file-upload)
14. [PDF Generation Pipeline](#14-pdf-generation)
15. [SMS & Email Delivery Patterns](#15-delivery)
16. [Testing Strategy (Complete)](#16-testing)
17. [CI/CD & Deployment Pipeline](#17-cicd)
18. [Performance Guardrails](#18-performance)
19. [Accessibility Rules (Admin + Employee)](#19-accessibility)
20. [Codex Task Prompts (Execution-Ready)](#20-codex-prompts)
21. [Dependency Audit & Lockfile](#21-dependencies)
22. [Launch Readiness Checklist](#22-launch)

---

## 1. TYPE SYSTEM & CODE GENERATION {#1-type-system}

The bible defines 28 database tables but never mentions type generation. Without this, every Supabase query is `any`-typed and bugs hide until runtime.

### 1.1 Generate Supabase Types

```bash
# Install the CLI
npx supabase login
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts

# Add to package.json scripts
"scripts": {
  "db:types": "supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/lib/database.types.ts",
  "db:types:watch": "nodemon --watch supabase/migrations --exec 'npm run db:types'"
}
```

### 1.2 Typed Supabase Client

```typescript
// lib/supabase/client.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

```typescript
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — ignore
          }
        },
      },
    }
  );
}
```

```typescript
// lib/supabase/admin.ts — for server-side operations that bypass RLS
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Never expose to client
  );
}
```

### 1.3 Shared Domain Types

```typescript
// types/domain.ts — Business logic types that don't come from the DB

export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost" | "dormant";

export type JobStatus = "draft" | "scheduled" | "in_progress" | "completed" | "cancelled";

export type QAStatus = "pending_review" | "approved" | "flagged" | "needs_rework";

export type QADecision = "approved" | "rework_requested" | "escalated" | "skipped";

export type AssignmentStatus =
  | "assigned"
  | "en_route"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "rework_assigned";

export type ChecklistItemStatus = "pending" | "completed" | "not_applicable" | "unable";

export type IssueSeverity = "low" | "medium" | "high" | "critical";

export type IssueResolutionStatus = "open" | "under_review" | "resolved" | "disputed";

export type NotificationChannel = "sms" | "email" | "dashboard" | "in_app";

export type UserRole = "admin" | "employee";

/** Hub dashboard metrics returned by get_admin_hub_metrics() */
export interface HubMetrics {
  uncalled_leads: number;
  uncalled_oldest_minutes: number | null;
  jobs_to_assign: number;
  pending_qa: number;
  completed_this_week: number;
  active_leads_total: number;
  leads_by_status: Record<LeadStatus, number>;
}

/** Pagination params used across all list views */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** Standard API response envelope */
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** Photo metadata captured during upload */
export interface PhotoMetadata {
  gpsLatitude: number | null;
  gpsLongitude: number | null;
  capturedAt: string; // ISO 8601
  deviceInfo?: string;
  caption?: string;
}
```

### 1.4 Zod Schemas for All Mutations

```typescript
// lib/schemas/lead.ts
import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(2).max(100),
  company_name: z.string().max(100).optional(),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone format"),
  email: z.union([z.literal(""), z.string().email()]).optional(),
  service_type: z.string().optional(),
  timeline: z.string().optional(),
  description: z.string().max(2000).optional(),
  source: z.string().default("website"),
});

export const updateLeadStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "quoted", "won", "lost", "dormant"]),
  notes: z.string().max(1000).optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
```

```typescript
// lib/schemas/job.ts
import { z } from "zod";

export const createJobSchema = z.object({
  client_id: z.string().uuid(),
  title: z.string().min(2).max(200),
  address: z.string().min(5).max(300),
  service_type: z.string(),
  scheduled_date: z.string().datetime().optional(),
  estimated_hours: z.number().positive().optional(),
  template_id: z.string().uuid().optional(),
  notes: z.string().max(2000).optional(),
  quote_id: z.string().uuid().optional(),
});

export const assignCrewSchema = z.object({
  job_id: z.string().uuid(),
  employee_id: z.string().uuid(),
  notes: z.string().max(500).optional(),
});

export const submitCompletionSchema = z.object({
  job_id: z.string().uuid(),
  checklist_completion_percent: z.number().min(0).max(100),
  photos_count: z.number().min(0),
  notes: z.string().max(2000).optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type AssignCrewInput = z.infer<typeof assignCrewSchema>;
export type SubmitCompletionInput = z.infer<typeof submitCompletionSchema>;
```

```typescript
// lib/schemas/qa.ts
import { z } from "zod";

export const qaDecisionSchema = z.object({
  job_id: z.string().uuid(),
  decision: z.enum(["approved", "rework_requested", "escalated", "skipped"]),
  notes: z.string().max(2000).optional(),
  rework_reason: z.string().max(1000).optional(),
}).refine(
  (data) => {
    if (data.decision === "rework_requested" && !data.rework_reason) {
      return false;
    }
    if (data.decision === "escalated" && !data.notes) {
      return false;
    }
    return true;
  },
  {
    message: "Rework requires a reason. Escalation requires notes.",
  }
);

export type QADecisionInput = z.infer<typeof qaDecisionSchema>;
```

```typescript
// lib/schemas/index.ts — barrel export
export * from "./lead";
export * from "./job";
export * from "./qa";
```

### 1.5 Codex Rule

```
RULE: Every API route MUST validate input with a Zod schema before 
touching the database. Every Supabase query MUST use the typed client. 
No `any` types. No unvalidated request bodies. No raw SQL strings 
in application code (use Supabase query builder or RPC functions).
```

---

## 2. API ROUTE ARCHITECTURE {#2-api-routes}

The bible lists 12 API routes but defines no consistent pattern. Every route currently has its own error handling, auth check, and response format.

### 2.1 Standard API Route Template

```typescript
// lib/api/helpers.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";
import type { ApiResponse } from "@/types/domain";

/** Standard success response */
export function ok<T>(data?: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data, message });
}

/** Standard error response */
export function fail(error: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error }, { status });
}

/** Get authenticated user or return 401 */
export async function requireAuth(request?: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, supabase, error: fail("Unauthorized", 401) };
  }

  return { user, supabase, error: null };
}

/** Get authenticated admin or return 403 */
export async function requireAdmin() {
  const { user, supabase, error } = await requireAuth();
  if (error) return { user: null, supabase, profile: null, error };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user!.id)
    .single();

  if (!profile || profile.role !== "admin" || !profile.is_active) {
    return {
      user: null,
      supabase,
      profile: null,
      error: fail("Forbidden", 403),
    };
  }

  return { user: user!, supabase, profile, error: null };
}

/** Get authenticated employee or return 403 */
export async function requireEmployee() {
  const { user, supabase, error } = await requireAuth();
  if (error) return { user: null, supabase, profile: null, error };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user!.id)
    .single();

  if (!profile || !profile.is_active) {
    return {
      user: null,
      supabase,
      profile: null,
      error: fail("Forbidden", 403),
    };
  }

  return { user: user!, supabase, profile, error: null };
}

/** Validate request body against a Zod schema */
export async function parseBody<T extends z.ZodType>(
  request: NextRequest,
  schema: T
): Promise<
  | { data: z.infer<T>; error: null }
  | { data: null; error: NextResponse<ApiResponse> }
> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return {
        data: null,
        error: fail(
          firstIssue?.message ?? "Validation failed",
          422
        ),
      };
    }

    return { data: result.data, error: null };
  } catch {
    return { data: null, error: fail("Invalid JSON body", 400) };
  }
}

/** Simple in-memory rate limiter */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  maxRequests = 10,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) return false;
  entry.count += 1;
  return true;
}
```

### 2.2 Every API Route Follows This Pattern

```typescript
// app/api/qa-decision/route.ts
import { NextRequest } from "next/server";
import { requireAdmin, parseBody, ok, fail } from "@/lib/api/helpers";
import { qaDecisionSchema } from "@/lib/schemas/qa";
import { processQADecision } from "@/lib/services/qa";
import { log } from "@/lib/logger";

export async function POST(request: NextRequest) {
  // 1. Auth
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  // 2. Validate
  const parsed = await parseBody(request, qaDecisionSchema);
  if (parsed.error) return parsed.error;

  // 3. Execute
  try {
    const result = await processQADecision(
      auth.supabase,
      auth.user.id,
      parsed.data
    );
    return ok(result, "QA decision recorded");
  } catch (err) {
    log.error("qa-decision", err, { userId: auth.user.id, input: parsed.data });
    return fail("Failed to process QA decision", 500);
  }
}
```

### 2.3 Service Layer (Business Logic Out of Routes)

```typescript
// lib/services/qa.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import type { QADecisionInput } from "@/lib/schemas/qa";
import { sendSMS } from "@/lib/sms";
import { sendEmail } from "@/lib/email";
import { generateCompletionReport } from "@/lib/pdf/completion-report";

export async function processQADecision(
  supabase: SupabaseClient<Database>,
  reviewerId: string,
  input: QADecisionInput
) {
  const { job_id, decision, notes, rework_reason } = input;

  // 1. Create qa_reviews record
  const { data: review, error: reviewError } = await supabase
    .from("qa_reviews")
    .insert({
      job_id,
      reviewed_by: reviewerId,
      decision,
      notes: notes ?? null,
      rework_reason: rework_reason ?? null,
    })
    .select()
    .single();

  if (reviewError) throw reviewError;

  // 2. Update job status
  const qaStatusMap: Record<string, string> = {
    approved: "approved",
    rework_requested: "needs_rework",
    escalated: "flagged",
    skipped: "pending_review",
  };

  const { error: jobError } = await supabase
    .from("jobs")
    .update({ qa_status: qaStatusMap[decision] })
    .eq("id", job_id);

  if (jobError) throw jobError;

  // 3. Side effects based on decision
  if (decision === "approved") {
    await handleApproval(supabase, job_id, review.id);
  } else if (decision === "rework_requested") {
    await handleRework(supabase, job_id, rework_reason!);
  } else if (decision === "escalated") {
    await handleEscalation(supabase, job_id, notes!);
  }

  return review;
}

async function handleApproval(
  supabase: SupabaseClient<Database>,
  jobId: string,
  reviewId: string
) {
  // Get job + client + photos for report
  const { data: job } = await supabase
    .from("jobs")
    .select(`
      *,
      clients(*),
      job_photos(*),
      job_checklist_items(*)
    `)
    .eq("id", jobId)
    .single();

  if (!job) return;

  // Generate PDF
  const pdfBuffer = await generateCompletionReport(job);

  // Upload to Supabase Storage
  const fileName = `reports/${jobId}-${Date.now()}.pdf`;
  const { data: upload } = await supabase.storage
    .from("completion-reports")
    .upload(fileName, pdfBuffer, { contentType: "application/pdf" });

  // Create completion_reports record
  const token = crypto.randomUUID();
  await supabase.from("completion_reports").insert({
    job_id: jobId,
    qa_review_id: reviewId,
    token,
    pdf_url: upload?.path ?? null,
    sent_to_email: job.clients?.email ?? null,
  });

  // Send to GC if email exists
  if (job.clients?.email) {
    await sendEmail({
      to: job.clients.email,
      subject: `Completion Report — ${job.title || job.address}`,
      template: "completion-report",
      data: {
        clientName: job.clients.name,
        jobAddress: job.address,
        reportUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/report/${token}`,
      },
    });

    await supabase
      .from("completion_reports")
      .update({ sent_at: new Date().toISOString() })
      .eq("token", token);
  }
}

async function handleRework(
  supabase: SupabaseClient<Database>,
  jobId: string,
  reason: string
) {
  // Get assigned crew
  const { data: assignments } = await supabase
    .from("job_assignments")
    .select("*, profiles(phone, full_name)")
    .eq("job_id", jobId)
    .in("status", ["completed", "in_progress"]);

  if (!assignments?.length) return;

  // Update assignments to rework status
  await supabase
    .from("job_assignments")
    .update({ status: "rework_assigned" })
    .eq("job_id", jobId)
    .in("status", ["completed", "in_progress"]);

  // Get job address for SMS
  const { data: job } = await supabase
    .from("jobs")
    .select("address, title")
    .eq("id", jobId)
    .single();

  // SMS each crew member
  for (const assignment of assignments) {
    if (assignment.profiles?.phone) {
      await sendSMS({
        to: assignment.profiles.phone,
        body: `Rework needed at ${job?.address ?? "job site"}: ${reason}`,
        jobId,
        type: "rework_notification",
      });
    }
  }
}

async function handleEscalation(
  supabase: SupabaseClient<Database>,
  jobId: string,
  notes: string
) {
  // Create critical issue report
  await supabase.from("issue_reports").insert({
    job_id: jobId,
    severity: "critical",
    description: `ESCALATED: ${notes}`,
    resolution_status: "open",
  });

  // Get admin phone for self-notification
  const { data: admins } = await supabase
    .from("profiles")
    .select("phone")
    .eq("role", "admin")
    .eq("is_active", true);

  for (const admin of admins ?? []) {
    if (admin.phone) {
      await sendSMS({
        to: admin.phone,
        body: `⚠️ CRITICAL issue flagged on job. Check dashboard immediately.`,
        jobId,
        type: "escalation_alert",
      });
    }
  }
}
```

### 2.4 Complete API Route Inventory

```
EXISTING (verify + standardize):
  POST /api/quote-request      → requirePublic + rateLimit
  POST /api/quote-response     → requirePublic (token-based auth)
  POST /api/quote-send         → requireAdmin
  POST /api/quote-create-job   → requireAdmin
  POST /api/ai-assistant       → requirePublic + rateLimit
  POST /api/assignment-notify  → requireAdmin
  POST /api/completion-report  → requireAdmin
  POST /api/notification-dispatch → requireAdmin (or cron secret)

NEW (build in phases):
  POST /api/qa-decision        → requireAdmin           Phase 2
  POST /api/job-completion     → requireEmployee        Phase 2
  GET  /api/hub-metrics        → requireAdmin           Phase 1
  POST /api/lead-follow-up     → requireCronSecret      Phase 3
  GET  /api/report/[token]     → requirePublic          Phase 2

PATTERN FOR CRON ROUTES:
  Verify with: Authorization: Bearer ${process.env.CRON_SECRET}
  Do NOT use user auth — cron has no session.
```

### 2.5 Codex Rule

```
RULE: No business logic in API route files. Routes are 10-20 lines max:
auth check → parse body → call service function → return response.
All business logic lives in /lib/services/. All validation lives in 
/lib/schemas/. All Supabase interactions are typed.
```

---

## 3. SECURITY HARDENING {#3-security}

### 3.1 RLS Policy Completeness

The bible defines RLS for `job_completions` and `qa_reviews` only. Every table needs policies.

```sql
-- ═══════════════════════════════════════
-- COMPLETE RLS POLICY SET
-- Run AFTER all migrations
-- ═══════════════════════════════════════

-- Helper function: is the current user an active admin?
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin' 
    AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: is the current user an active employee?
CREATE OR REPLACE FUNCTION is_employee() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'employee')
    AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: is user assigned to this job?
CREATE OR REPLACE FUNCTION is_assigned_to_job(target_job_id UUID) RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM job_assignments
    WHERE job_id = target_job_id
    AND employee_id = auth.uid()
    AND status != 'cancelled'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── PROFILES ──
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "admin_read_all" ON profiles
  FOR SELECT USING (is_admin());

CREATE POLICY "admin_update_all" ON profiles
  FOR UPDATE USING (is_admin());

CREATE POLICY "users_update_own_preferences" ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ── CLIENTS ──
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_clients" ON clients
  FOR ALL USING (is_admin());

CREATE POLICY "employee_read_assigned_clients" ON clients
  FOR SELECT USING (
    is_employee() AND id IN (
      SELECT client_id FROM jobs WHERE id IN (
        SELECT job_id FROM job_assignments 
        WHERE employee_id = auth.uid()
      )
    )
  );

-- ── LEADS ──
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_leads" ON leads
  FOR ALL USING (is_admin());

-- Leads are admin-only. Employees never see leads.

-- ── QUOTES + LINE ITEMS ──
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_quotes" ON quotes
  FOR ALL USING (is_admin());

CREATE POLICY "public_view_by_token" ON quotes
  FOR SELECT USING (
    public_token IS NOT NULL 
    AND status != 'draft'
  );
-- Note: the /quote/[token] page queries by token, not by user session

CREATE POLICY "admin_all_line_items" ON quote_line_items
  FOR ALL USING (is_admin());

-- ── JOBS ──
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_jobs" ON jobs
  FOR ALL USING (is_admin());

CREATE POLICY "employee_read_assigned_jobs" ON jobs
  FOR SELECT USING (
    is_employee() AND is_assigned_to_job(id)
  );

CREATE POLICY "employee_update_assigned_jobs" ON jobs
  FOR UPDATE USING (
    is_employee() AND is_assigned_to_job(id)
  ) WITH CHECK (
    is_employee() AND is_assigned_to_job(id)
  );

-- ── JOB_ASSIGNMENTS ──
ALTER TABLE job_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_assignments" ON job_assignments
  FOR ALL USING (is_admin());

CREATE POLICY "employee_read_own" ON job_assignments
  FOR SELECT USING (employee_id = auth.uid());

CREATE POLICY "employee_update_own_status" ON job_assignments
  FOR UPDATE USING (employee_id = auth.uid())
  WITH CHECK (employee_id = auth.uid());

-- ── JOB_PHOTOS ──
ALTER TABLE job_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_photos" ON job_photos
  FOR ALL USING (is_admin());

CREATE POLICY "employee_insert_assigned" ON job_photos
  FOR INSERT WITH CHECK (
    is_employee() AND is_assigned_to_job(job_id)
  );

CREATE POLICY "employee_read_assigned" ON job_photos
  FOR SELECT USING (
    is_employee() AND is_assigned_to_job(job_id)
  );

-- ── JOB_CHECKLIST_ITEMS ──
ALTER TABLE job_checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_checklist" ON job_checklist_items
  FOR ALL USING (is_admin());

CREATE POLICY "employee_read_assigned" ON job_checklist_items
  FOR SELECT USING (
    is_employee() AND is_assigned_to_job(job_id)
  );

CREATE POLICY "employee_update_assigned" ON job_checklist_items
  FOR UPDATE USING (
    is_employee() AND is_assigned_to_job(job_id)
  );

-- ── ISSUE_REPORTS ──
ALTER TABLE issue_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_issues" ON issue_reports
  FOR ALL USING (is_admin());

CREATE POLICY "employee_insert_assigned" ON issue_reports
  FOR INSERT WITH CHECK (
    is_employee() AND is_assigned_to_job(job_id)
  );

CREATE POLICY "employee_read_assigned" ON issue_reports
  FOR SELECT USING (
    is_employee() AND is_assigned_to_job(job_id)
  );

-- ── QA_REVIEWS ── (admin only)
ALTER TABLE qa_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all" ON qa_reviews
  FOR ALL USING (is_admin());

-- ── JOB_COMPLETIONS ──
ALTER TABLE job_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_all" ON job_completions
  FOR SELECT USING (is_admin());

CREATE POLICY "employee_insert_own" ON job_completions
  FOR INSERT WITH CHECK (completed_by = auth.uid());

CREATE POLICY "employee_read_own" ON job_completions
  FOR SELECT USING (completed_by = auth.uid());

-- ── COMPLETION_REPORTS ──
ALTER TABLE completion_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all" ON completion_reports
  FOR ALL USING (is_admin());

CREATE POLICY "public_view_by_token" ON completion_reports
  FOR SELECT USING (
    token IS NOT NULL 
    AND (expires_at IS NULL OR expires_at > NOW())
  );

-- ── NOTIFICATION_DISPATCH_QUEUE ──
ALTER TABLE notification_dispatch_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all" ON notification_dispatch_queue
  FOR ALL USING (is_admin());

-- ── EMPLOYMENT_APPLICATIONS ── (public insert, admin read)
ALTER TABLE employment_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert" ON employment_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admin_all" ON employment_applications
  FOR ALL USING (is_admin());
```

### 3.2 Middleware Hardening

```typescript
// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_ROUTES = ["/admin"];
const EMPLOYEE_ROUTES = ["/employee"];
const AUTH_ROUTES = ["/auth"];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Protect admin routes ──
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/admin", request.url));
    }

    // Check role from profiles table (NOT app_metadata)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin" || !profile.is_active) {
      return NextResponse.redirect(new URL("/auth/admin", request.url));
    }
  }

  // ── Protect employee routes ──
  if (EMPLOYEE_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/employee", request.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .single();

    if (!profile || !profile.is_active) {
      return NextResponse.redirect(new URL("/auth/employee", request.url));
    }
  }

  // ── Redirect logged-in users away from auth pages ──
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (profile?.role === "employee") {
      return NextResponse.redirect(new URL("/employee", request.url));
    }
  }

  // ── Security headers ──
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/employee/:path*", "/auth/:path*"],
};
```

### 3.3 Environment Variable Validation

```typescript
// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().startsWith("re_"),
  TWILIO_ACCOUNT_SID: z.string().startsWith("AC"),
  TWILIO_AUTH_TOKEN: z.string().min(1),
  TWILIO_PHONE_NUMBER: z.string().startsWith("+"),
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  CRON_SECRET: z.string().min(32),
  OPENAI_API_KEY: z.string().startsWith("sk-").optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
});

export const env = envSchema.parse(process.env);

// Call this at app startup:
// import "@/lib/env"; // Will throw if any var is missing
```

---

## 4. REAL-TIME ARCHITECTURE {#4-realtime}

The bible never mentions real-time updates. Without them, the admin must refresh the page to see new leads, QA submissions, or status changes.

### 4.1 Supabase Realtime Subscriptions

```typescript
// hooks/useRealtimeSubscription.ts
"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type SubscriptionConfig = {
  table: string;
  schema?: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string;
  onEvent: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void;
};

export function useRealtimeSubscription(config: SubscriptionConfig) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`${config.table}-changes`)
      .on(
        "postgres_changes",
        {
          event: config.event ?? "*",
          schema: config.schema ?? "public",
          table: config.table,
          filter: config.filter,
        },
        config.onEvent
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [config.table, config.filter, config.event, config.schema, config.onEvent]);
}
```

### 4.2 Where to Apply Real-Time

```typescript
// In AdminHubDashboard — live counter updates
useRealtimeSubscription({
  table: "leads",
  event: "INSERT",
  onEvent: () => refetchMetrics(),
});

useRealtimeSubscription({
  table: "jobs",
  filter: "qa_status=eq.pending_review",
  onEvent: () => refetchMetrics(),
});

// In LeadPipelineClient — new leads appear instantly
useRealtimeSubscription({
  table: "leads",
  event: "INSERT",
  onEvent: (payload) => {
    setLeads((prev) => [payload.new as Lead, ...prev]);
    toast.info("New lead received");
  },
});

// In QAReviewQueue — new submissions appear instantly
useRealtimeSubscription({
  table: "jobs",
  event: "UPDATE",
  filter: "qa_status=eq.pending_review",
  onEvent: () => refetchQueue(),
});

// In EmployeeTicketsClient — status changes from admin
useRealtimeSubscription({
  table: "job_assignments",
  filter: `employee_id=eq.${userId}`,
  event: "UPDATE",
  onEvent: () => refetchAssignments(),
});
```

### 4.3 Codex Rule

```
RULE: Hub dashboard and pipeline pages MUST subscribe to real-time 
updates. Do NOT poll with setInterval. Use Supabase Realtime channels 
and refetch queries on change events. Unsubscribe in useEffect cleanup.
```

---

## 5. STATE MANAGEMENT & DATA FETCHING {#5-state-management}

### 5.1 No Global State Library

The app doesn't need Redux, Zustand, or Jotai. Use:
- **Server Components** for initial data loads
- **React hooks + local state** for interactive components
- **URL search params** for filters and pagination (sharable, back-button friendly)
- **Supabase Realtime** for live updates

### 5.2 Data Fetching Pattern for Admin Pages

```typescript
// app/(admin)/admin/leads/page.tsx — Server Component
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LeadPipelineClient } from "@/components/admin/pages/LeadPipelineClient";
import { redirect } from "next/navigation";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();

  // Verify auth (belt + suspenders with middleware)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/admin");

  // Initial data load — rendered on server
  let query = supabase
    .from("leads")
    .select(`
      *,
      quotes(id, status, total_amount),
      clients(id, name)
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  if (params.filter && params.filter !== "all") {
    query = query.eq("status", params.filter);
  }

  const { data: leads, error } = await query;

  if (error) {
    throw new Error(`Failed to load leads: ${error.message}`);
  }

  return (
    <LeadPipelineClient
      initialLeads={leads ?? []}
      initialFilter={params.filter ?? "all"}
    />
  );
}
```

```typescript
// components/admin/pages/LeadPipelineClient.tsx — Client Component
"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import type { Database } from "@/lib/database.types";

type Lead = Database["public"]["Tables"]["leads"]["Row"] & {
  quotes: Array<{ id: string; status: string; total_amount: number }>;
  clients: { id: string; name: string } | null;
};

interface Props {
  initialLeads: Lead[];
  initialFilter: string;
}

export function LeadPipelineClient({ initialLeads, initialFilter }: Props) {
  const [leads, setLeads] = useState(initialLeads);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter changes update URL (server re-fetches on navigation)
  const setFilter = useCallback(
    (filter: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (filter === "all") {
        params.delete("filter");
      } else {
        params.set("filter", filter);
      }
      router.push(`/admin/leads?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Real-time: new leads appear instantly
  const handleNewLead = useCallback(() => {
    router.refresh(); // Re-runs server component data fetch
  }, [router]);

  useRealtimeSubscription({
    table: "leads",
    event: "INSERT",
    onEvent: handleNewLead,
  });

  // ... render pipeline
}
```

### 5.3 URL-Based Filter State

```
Every list view encodes its filter state in URL search params:

/admin/leads?filter=new&sort=created_at&order=desc
/admin/jobs?status=in_progress&crew=uuid-here
/admin/quality?sort=oldest

Benefits:
  - Shareable URLs (admin can send a colleague a filtered view)
  - Browser back button works correctly
  - Server component can pre-filter data before hydration
  - No state synchronization bugs
```

---

## 6. ADMIN LAYOUT — COMPLETE IMPLEMENTATION {#6-admin-layout}

### 6.1 Layout Component

```typescript
// components/admin/AdminLayout.tsx
"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  /** Bottom nav items — up to 4 primary + 1 "More" */
  bottomNav: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Hub",
    icon: <HomeIcon />,
    bottomNav: true,
  },
  {
    href: "/admin/leads",
    label: "Sales",
    icon: <DollarIcon />,
    bottomNav: true,
  },
  {
    href: "/admin/jobs",
    label: "Ops",
    icon: <WrenchIcon />,
    bottomNav: true,
  },
  {
    href: "/admin/quality",
    label: "QA",
    icon: <CheckCircleIcon />,
    bottomNav: true,
  },
  {
    href: "/admin/schedule",
    label: "Schedule",
    icon: <CalendarIcon />,
    bottomNav: false,
  },
  {
    href: "/admin/notifications",
    label: "Notifications",
    icon: <BellIcon />,
    bottomNav: false,
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: <ChartIcon />,
    bottomNav: false,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: <GearIcon />,
    bottomNav: false,
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname]
  );

  const bottomNavItems = NAV_ITEMS.filter((item) => item.bottomNav);
  const moreItems = NAV_ITEMS.filter((item) => !item.bottomNav);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ── Desktop Sidebar ── */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen flex-col border-r border-slate-200 bg-white transition-all duration-200 lg:flex",
          sidebarCollapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-slate-200 px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-dark font-serif text-sm text-white">
              A
            </span>
            {!sidebarCollapsed && (
              <span className="font-serif text-lg text-brand-dark">A&A</span>
            )}
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1 p-3" aria-label="Admin navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                isActive(item.href)
                  ? "bg-brand-dark text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <span className="h-5 w-5 shrink-0">{item.icon}</span>
              {!sidebarCollapsed && (
                <span className="flex-1">{item.label}</span>
              )}
              {!sidebarCollapsed && item.badge && item.badge > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setSidebarCollapsed((p) => !p)}
          className="border-t border-slate-200 p-4 text-slate-400 hover:text-slate-600"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronIcon direction={sidebarCollapsed ? "right" : "left"} />
        </button>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
          <h1 className="text-sm font-semibold text-slate-800">
            {NAV_ITEMS.find((item) => isActive(item.href))?.label ?? "Admin"}
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/notifications"
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Notifications"
            >
              <BellIcon className="h-5 w-5" />
              {/* Badge rendered conditionally */}
            </Link>
            <Link
              href="/admin/settings"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Settings"
            >
              <GearIcon className="h-5 w-5" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white lg:hidden"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0.25rem)",
        }}
        aria-label="Mobile navigation"
      >
        <div className="flex items-stretch">
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px]",
                isActive(item.href) ? "text-brand-dark" : "text-slate-500"
              )}
            >
              <span className="h-6 w-6">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1 right-1/4 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}

          {/* More button */}
          <button
            type="button"
            onClick={() => setMoreSheetOpen(true)}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px]",
              moreItems.some((i) => isActive(i.href))
                ? "text-brand-dark"
                : "text-slate-500"
            )}
          >
            <MoreIcon className="h-6 w-6" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* ── More Sheet (Mobile) ── */}
      {moreSheetOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setMoreSheetOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4 pb-8"
            onClick={(e) => e.stopPropagation()}
            style={{
              paddingBottom:
                "max(calc(env(safe-area-inset-bottom, 0px) + 2rem), 2rem)",
            }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-300" />
            <div className="space-y-1">
              {moreItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreSheetOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm",
                    isActive(item.href)
                      ? "bg-brand-dark text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <span className="h-5 w-5">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 6.2 Layout Route File

```typescript
// app/(admin)/admin/layout.tsx
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
```

---

## 7. COMPONENT PATTERNS & CONVENTIONS {#7-component-patterns}

### 7.1 Every Admin Page Component Follows This Shape

```typescript
// components/admin/pages/[PageName].tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner"; // standardize on sonner for toasts
import type { Database } from "@/lib/database.types";

interface Props {
  initialData: SomeType[];
  initialFilter?: string;
}

export function SomePageClient({ initialData, initialFilter }: Props) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAction = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/some-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ /* ... */ }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success(json.message ?? "Done");
      router.refresh(); // Re-run server component data fetch
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <div className="p-4 lg:p-6">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Page Title</h2>
          <p className="mt-1 text-sm text-slate-500">Description</p>
        </div>
        <button className="btn-primary" onClick={handleAction} disabled={loading}>
          {loading ? "Working..." : "Action"}
        </button>
      </div>

      {/* Content */}
      {data.length === 0 ? (
        <EmptyState message="Nothing here yet" />
      ) : (
        <div>{/* render data */}</div>
      )}
    </div>
  );
}
```

### 7.2 Shared Admin UI Primitives

```typescript
// components/admin/ui/EmptyState.tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, message, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
      {icon && <div className="mb-4 text-slate-400">{icon}</div>}
      <p className="text-sm font-medium text-slate-700">{message}</p>
      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-4 rounded-lg bg-brand-dark px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
```

```typescript
// components/admin/ui/StatusBadge.tsx
const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  new: { color: "bg-blue-100 text-blue-800", label: "New" },
  contacted: { color: "bg-yellow-100 text-yellow-800", label: "Contacted" },
  quoted: { color: "bg-purple-100 text-purple-800", label: "Quoted" },
  won: { color: "bg-emerald-100 text-emerald-800", label: "Won" },
  lost: { color: "bg-red-100 text-red-800", label: "Lost" },
  dormant: { color: "bg-slate-100 text-slate-600", label: "Dormant" },
  draft: { color: "bg-slate-100 text-slate-600", label: "Draft" },
  scheduled: { color: "bg-blue-100 text-blue-800", label: "Scheduled" },
  in_progress: { color: "bg-amber-100 text-amber-800", label: "In Progress" },
  completed: { color: "bg-emerald-100 text-emerald-800", label: "Completed" },
  pending_review: { color: "bg-orange-100 text-orange-800", label: "Pending QA" },
  approved: { color: "bg-emerald-100 text-emerald-800", label: "Approved" },
  flagged: { color: "bg-red-100 text-red-800", label: "Flagged" },
  needs_rework: { color: "bg-red-100 text-red-800", label: "Rework" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? {
    color: "bg-slate-100 text-slate-600",
    label: status,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        config.color
      )}
    >
      {config.label}
    </span>
  );
}
```

```typescript
// components/admin/ui/ConfirmDialog.tsx
"use client";

import { useCallback, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "danger" | "default";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  variant = "default",
  loading = false,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 id="confirm-title" className="text-lg font-semibold text-slate-900">
          {title}
        </h2>
        <p id="confirm-desc" className="mt-2 text-sm text-slate-600">
          {description}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60",
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-brand-dark hover:bg-brand-blue"
            )}
          >
            {loading ? "Processing..." : confirmLabel}
          
# A&A Platform Implementation Bible — Enhancement Layer (Continued)
## Sections 7–22

---

## 7. COMPONENT PATTERNS & CONVENTIONS (Continued) {#7-component-patterns}

### 7.2 Shared Admin UI Primitives (Continued)

```typescript
// components/admin/ui/ConfirmDialog.tsx (completed)
          </button>
        </div>
      </div>
    </div>
  );
}
```

```typescript
// components/admin/ui/DataTable.tsx
"use client";

import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  sortBy,
  sortOrder,
  onSort,
  loading,
  emptyMessage = "No data",
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="h-14 animate-pulse rounded-lg bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-200 py-12 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500",
                  col.sortable && "cursor-pointer select-none hover:text-slate-700",
                  col.className
                )}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortBy === col.key && (
                    <span className="text-[10px]">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "transition",
                onRowClick && "cursor-pointer hover:bg-slate-50"
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn("px-4 py-3", col.className)}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

```typescript
// components/admin/ui/PageHeader.tsx
interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: number;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, badge, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          {badge !== undefined && badge > 0 && (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
```

```typescript
// components/admin/ui/CardGrid.tsx
// Used for mobile-responsive alternative to DataTable

interface CardGridProps<T> {
  data: T[];
  keyExtractor: (item: T) => string;
  renderCard: (item: T) => React.ReactNode;
  emptyMessage?: string;
  loading?: boolean;
  columns?: 1 | 2 | 3;
}

export function CardGrid<T>({
  data,
  keyExtractor,
  renderCard,
  emptyMessage = "Nothing here",
  loading,
  columns = 1,
}: CardGridProps<T>) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`card-skel-${i}`}
            className="h-32 animate-pulse rounded-xl bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-200 py-12 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  }[columns];

  return (
    <div className={cn("grid gap-4", gridClass)}>
      {data.map((item) => (
        <div key={keyExtractor(item)}>{renderCard(item)}</div>
      ))}
    </div>
  );
}
```

### 7.3 Toast Notifications — Standardize on Sonner

```bash
npm install sonner
```

```typescript
// app/(admin)/admin/layout.tsx — add Toaster
import { Toaster } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 4000,
          className: "text-sm",
        }}
      />
    </AdminLayout>
  );
}

// Usage everywhere:
import { toast } from "sonner";

toast.success("Job approved");
toast.error("Failed to send SMS");
toast.info("New lead received");
toast.warning("QA review overdue");
```

### 7.4 Admin Button System

```css
/* Add to globals.css @layer components */

/* ── Admin Buttons ── */
.btn-primary {
  @apply inline-flex items-center justify-center gap-2 rounded-lg
         bg-brand-dark px-4 py-2 text-sm font-medium text-white
         shadow-sm transition hover:bg-brand-blue
         disabled:cursor-not-allowed disabled:opacity-60;
}

.btn-secondary {
  @apply inline-flex items-center justify-center gap-2 rounded-lg
         border border-slate-300 bg-white px-4 py-2 text-sm font-medium
         text-slate-700 shadow-sm transition hover:bg-slate-50
         disabled:cursor-not-allowed disabled:opacity-60;
}

.btn-danger {
  @apply inline-flex items-center justify-center gap-2 rounded-lg
         bg-red-600 px-4 py-2 text-sm font-medium text-white
         shadow-sm transition hover:bg-red-700
         disabled:cursor-not-allowed disabled:opacity-60;
}

.btn-ghost {
  @apply inline-flex items-center justify-center gap-2 rounded-lg
         px-4 py-2 text-sm font-medium text-slate-600 transition
         hover:bg-slate-100 hover:text-slate-900
         disabled:cursor-not-allowed disabled:opacity-60;
}

.btn-icon {
  @apply inline-flex h-9 w-9 items-center justify-center rounded-lg
         text-slate-500 transition hover:bg-slate-100 hover:text-slate-700;
}
```

### 7.5 Codex Rule

```
RULE: Every admin page must include:
  1. PageHeader with title + description + optional action buttons
  2. Loading skeleton while data fetches (never blank screen)
  3. Empty state when list is empty (never blank container)
  4. Toast feedback for all mutations (success AND error)
  5. ConfirmDialog before destructive actions (delete, cancel, reject)
  6. Mobile-responsive layout (CardGrid on mobile, DataTable on desktop where applicable)
```

---

## 8. MOBILE-FIRST EXECUTION RULES {#8-mobile-rules}

### 8.1 Breakpoint System

```
Mobile:     < 640px    → Single column, bottom nav, card layouts
Tablet:     640-1023px → Two columns, collapsed sidebar (icons only), card layouts  
Desktop:    ≥ 1024px   → Multi-column, expanded sidebar, table layouts
Wide:       ≥ 1280px   → Same as desktop with wider content area

RULE: Every component is designed mobile-first. Desktop enhancements 
are additive. Never build desktop-only and "fix mobile later."
```

### 8.2 Touch Target Rules

```
Minimum touch target: 44x44px (WCAG 2.1 Level AA)
Recommended touch target: 48x48px

Apply to:
  - All buttons in bottom nav
  - All action buttons on mobile cards
  - All filter dropdowns
  - All status change buttons in employee portal
  - Checkbox/radio inputs
  - Close buttons on modals and sheets

Implementation:
  - If the visual element is smaller, use padding to expand the touch target
  - Example: a 24px icon button gets p-3 to become 48px total
```

### 8.3 Mobile Card Pattern for Admin Lists

```typescript
// components/admin/ui/MobileCard.tsx
interface MobileCardProps {
  title: string;
  subtitle?: string;
  status?: string;
  metadata?: Array<{ label: string; value: string }>;
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: "primary" | "danger" | "ghost";
  }>;
  onClick?: () => void;
  urgent?: boolean;
}

export function MobileCard({
  title,
  subtitle,
  status,
  metadata,
  actions,
  onClick,
  urgent,
}: MobileCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-4 shadow-sm transition",
        urgent && "border-red-200 bg-red-50/50",
        !urgent && "border-slate-200",
        onClick && "cursor-pointer active:bg-slate-50"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {title}
          </p>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
        {status && <StatusBadge status={status} />}
      </div>

      {metadata && metadata.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {metadata.map((item) => (
            <div key={item.label} className="text-xs">
              <span className="text-slate-400">{item.label}: </span>
              <span className="font-medium text-slate-600">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {actions && actions.length > 0 && (
        <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              className={cn(
                "flex-1 rounded-lg py-2 text-center text-xs font-semibold transition",
                action.variant === "primary" &&
                  "bg-brand-dark text-white hover:bg-brand-blue",
                action.variant === "danger" &&
                  "bg-red-50 text-red-700 hover:bg-red-100",
                (!action.variant || action.variant === "ghost") &&
                  "bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 8.4 Responsive Strategy per Admin Page

| Page | Mobile (<1024px) | Desktop (≥1024px) |
|------|-----------------|-------------------|
| Hub Dashboard | Stacked metric cards + action list | 3-column grid of metric cards |
| Lead Pipeline | Filtered card list with status dropdown | Kanban board (7 columns) |
| Job Management | Card list with status filter tabs | DataTable with inline actions |
| QA Review Queue | Card list sorted by urgency | DataTable + side preview panel |
| QA Detail | Single column: photos carousel → checklist → actions (sticky bottom) | Two column: left = info/checklist, right = photo grid + actions |
| Schedule | Vertical day list | Calendar grid (week view) |
| Notifications | Single tab view with switch | Two-tab view (Preferences / Queue) |
| Analytics | Stacked chart cards | Grid chart layout |
| Settings | Section list → sub-pages | Same but wider form fields |

---

## 9. DATABASE MIGRATION SAFETY {#9-migrations}

### 9.1 Migration File Naming Convention

```
supabase/migrations/
├── 20260315000001_profiles_soft_delete.sql
├── 20260315000002_job_completions.sql
├── 20260315000003_qa_reviews.sql
├── 20260315000004_job_checklists.sql
├── 20260315000005_job_checklist_items_enhance.sql
├── 20260315000006_job_photos_enhance.sql
├── 20260315000007_issue_reports_enhance.sql
├── 20260315000008_completion_reports.sql
├── 20260315000009_lead_follow_ups.sql
├── 20260315000010_rls_policies.sql
├── 20260315000011_hub_metrics_function.sql
└── 20260315000012_helper_functions.sql
```

### 9.2 Migration Safety Rules

```sql
-- EVERY migration file starts with:
BEGIN;

-- EVERY column addition uses IF NOT EXISTS:
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- EVERY table creation uses IF NOT EXISTS:
CREATE TABLE IF NOT EXISTS qa_reviews ( ... );

-- NEVER drop a column without a 2-step migration:
-- Step 1 (this deploy): Stop reading the column in application code
-- Step 2 (next deploy): Drop the column
-- NEVER in one step.

-- EVERY migration file ends with:
COMMIT;
```

### 9.3 Rollback Strategy

```sql
-- For every migration, create a matching rollback file:
-- supabase/rollbacks/20260315000002_job_completions_rollback.sql

BEGIN;
DROP TABLE IF EXISTS job_completions;
COMMIT;

-- RULE: Test every migration against a local Supabase instance 
-- before running against production.
-- Command: supabase db reset (runs all migrations from scratch locally)
```

### 9.4 Pre-Migration Checklist

```
Before running ANY migration against production:

[ ] Migration tested locally with `supabase db reset`
[ ] Application code updated to handle both old AND new schema
    (new columns must have defaults; reads must handle null)
[ ] Rollback file written and tested
[ ] Backup taken: Supabase Dashboard → Database → Backups → Create
[ ] Run during low-traffic window (early morning or late night)
[ ] Verify after: run `SELECT COUNT(*) FROM [new_table]` to confirm creation
[ ] Verify after: test the application flow that depends on the change
```

---

## 10. CACHING & REVALIDATION STRATEGY {#10-caching}

### 10.1 Server Component Caching

```typescript
// Admin pages: No caching — always fresh data
// Use: export const dynamic = "force-dynamic"
// OR: use cookies()/headers() which auto-opt-out of caching

// app/(admin)/admin/dashboard/page.tsx
import { cookies } from "next/headers";

export default async function DashboardPage() {
  // cookies() usage ensures this is never cached
  const cookieStore = await cookies();
  // ... fetch fresh data
}
```

### 10.2 Public Pages: Revalidation

```typescript
// app/page.tsx (public homepage)
// Homepage content rarely changes — revalidate every hour
export const revalidate = 3600;

// app/quote/[token]/page.tsx
// Quote pages must always be fresh (customer may accept)
export const dynamic = "force-dynamic";

// app/careers/page.tsx
// Careers page changes rarely
export const revalidate = 86400; // 24 hours
```

### 10.3 API Route Caching

```typescript
// Static API responses (like service area data) can be cached:
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

// Mutation endpoints (POST/PUT/DELETE): NEVER cache
// They already aren't by default, but be explicit:
export async function POST(request: NextRequest) {
  // ... handle mutation
  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
```

### 10.4 Supabase Storage (Photos/PDFs)

```typescript
// When generating signed URLs for photos/PDFs:
const { data } = await supabase.storage
  .from("job-photos")
  .createSignedUrl(path, 3600); // 1 hour expiry

// For completion report PDFs (public via token):
const { data } = await supabase.storage
  .from("completion-reports")
  .createSignedUrl(path, 604800); // 7 day expiry
```

---

## 11. ERROR HANDLING — UNIFIED SYSTEM {#11-error-handling}

### 11.1 Error Boundary per Admin Section

```typescript
// app/(admin)/admin/leads/error.tsx
"use client";

import { useEffect } from "react";
import { log } from "@/lib/logger";

export default function LeadsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    log.error("leads-page", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 text-4xl">⚠️</div>
      <h2 className="text-lg font-semibold text-slate-900">
        Failed to load leads
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Something went wrong loading the lead pipeline. This has been logged.
      </p>
      <button type="button" onClick={reset} className="btn-primary mt-6">
        Try Again
      </button>
    </div>
  );
}
```

Create one per admin section: `leads/error.tsx`, `jobs/error.tsx`, `quality/error.tsx`, `schedule/error.tsx`, `notifications/error.tsx`, `analytics/error.tsx`, `settings/error.tsx`.

### 11.2 API Error Classification

```typescript
// lib/errors.ts

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = "INTERNAL_ERROR"
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 422, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "AUTH_ERROR");
    this.name = "AuthError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super("Too many requests", 429, "RATE_LIMIT");
    this.name = "RateLimitError";
  }
}
```

### 11.3 Client-Side Error Handling Pattern

```typescript
// lib/api/client.ts — typed fetch wrapper

import type { ApiResponse } from "@/types/domain";

export async function apiPost<T = void>(
  url: string,
  body: unknown
): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new Error(json.error ?? `Request failed (${res.status})`);
  }

  return json.data as T;
}

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new Error(json.error ?? `Request failed (${res.status})`);
  }

  return json.data as T;
}

// Usage:
try {
  const result = await apiPost("/api/qa-decision", { job_id, decision: "approved" });
  toast.success("Job approved");
} catch (err) {
  toast.error(err instanceof Error ? err.message : "Something went wrong");
}
```

---

## 12. LOGGING & OBSERVABILITY {#12-logging}

### 12.1 Structured Logger

```typescript
// lib/logger.ts

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  context: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

function formatEntry(entry: LogEntry): string {
  return JSON.stringify(entry);
}

function createLogger() {
  const write = (
    level: LogLevel,
    context: string,
    messageOrError: string | Error | unknown,
    data?: Record<string, unknown>
  ) => {
    const message =
      messageOrError instanceof Error
        ? messageOrError.message
        : String(messageOrError);

    const entry: LogEntry = {
      level,
      context,
      message,
      data: {
        ...data,
        ...(messageOrError instanceof Error
          ? { stack: messageOrError.stack }
          : {}),
      },
      timestamp: new Date().toISOString(),
    };

    const formatted = formatEntry(entry);

    switch (level) {
      case "error":
        console.error(formatted);
        break;
      case "warn":
        console.warn(formatted);
        break;
      case "debug":
        if (process.env.NODE_ENV === "development") {
          console.debug(formatted);
        }
        break;
      default:
        console.log(formatted);
    }
  };

  return {
    debug: (ctx: string, msg: string, data?: Record<string, unknown>) =>
      write("debug", ctx, msg, data),
    info: (ctx: string, msg: string, data?: Record<string, unknown>) =>
      write("info", ctx, msg, data),
    warn: (ctx: string, msg: string, data?: Record<string, unknown>) =>
      write("warn", ctx, msg, data),
    error: (
      ctx: string,
      err: unknown,
      data?: Record<string, unknown>
    ) => write("error", ctx, err, data),
  };
}

export const log = createLogger();

// Usage:
// log.info("qa-service", "Job approved", { jobId, reviewerId });
// log.error("sms-delivery", err, { phone, jobId });
```

### 12.2 API Route Timing

```typescript
// lib/api/helpers.ts — add to every route

export function withTiming<T>(
  handler: (request: NextRequest) => Promise<NextResponse<T>>
) {
  return async (request: NextRequest): Promise<NextResponse<T>> => {
    const start = performance.now();
    const response = await handler(request);
    const duration = Math.round(performance.now() - start);

    log.info("api", `${request.method} ${request.nextUrl.pathname}`, {
      status: response.status,
      durationMs: duration,
    });

    response.headers.set("X-Response-Time", `${duration}ms`);
    return response;
  };
}

// Usage:
export const POST = withTiming(async (request: NextRequest) => {
  // ... handler logic
});
```

---

## 13. FILE UPLOAD PIPELINE (Hardened) {#13-file-upload}

The bible mentions photo upload with GPS + IndexedDB but never defines the full pipeline or failure modes.

### 13.1 Client-Side Compression

```typescript
// lib/photo/compress.ts

const MAX_DIMENSION = 2048;
const JPEG_QUALITY = 0.82;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function compressPhoto(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Scale down if needed
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Compression failed"));
            return;
          }

          if (blob.size > MAX_FILE_SIZE) {
            reject(new Error("Photo too large even after compression"));
            return;
          }

          resolve(blob);
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}
```

### 13.2 GPS Capture

```typescript
// lib/photo/gps.ts

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export function captureGPS(timeoutMs = 10000): Promise<GPSCoordinates | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    const timer = setTimeout(() => resolve(null), timeoutMs);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timer);
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      () => {
        clearTimeout(timer);
        resolve(null); // GPS failure is non-blocking
      },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 60000 }
    );
  });
}
```

### 13.3 Offline Queue (IndexedDB)

```typescript
// lib/photo/offline-queue.ts

interface QueuedUpload {
  id: string;
  jobId: string;
  blob: Blob;
  metadata: {
    gpsLatitude: number | null;
    gpsLongitude: number | null;
    capturedAt: string;
    caption: string;
  };
  retries: number;
  createdAt: string;
}

const DB_NAME = "aa-photo-queue";
const STORE_NAME = "uploads";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function enqueueUpload(upload: QueuedUpload): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(upload);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function dequeueUpload(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllQueued(): Promise<QueuedUpload[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getQueueCount(): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).count();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
```

### 13.4 Upload Orchestrator with Progress

```typescript
// lib/photo/uploader.ts

import { createClient } from "@/lib/supabase/client";
import { compressPhoto } from "./compress";
import { captureGPS } from "./gps";
import { enqueueUpload, dequeueUpload, getAllQueued } from "./offline-queue";
import { log } from "@/lib/logger";

interface UploadProgress {
  total: number;
  completed: number;
  failed: number;
  current: string | null;
}

type ProgressCallback = (progress: UploadProgress) => void;

export async function uploadJobPhotos(
  jobId: string,
  files: File[],
  onProgress: ProgressCallback
): Promise<{ uploaded: number; queued: number }> {
  const supabase = createClient();
  let uploaded = 0;
  let queued = 0;

  const gps = await captureGPS();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    onProgress({
      total: files.length,
      completed: uploaded,
      failed: queued,
      current: file.name,
    });

    try {
      // 1. Compress
      const compressed = await compressPhoto(file);

      // 2. Generate unique path
      const fileName = `${jobId}/${Date.now()}-${i}.jpg`;

      // 3. Upload to Supabase Storage
      const { error: storageError } = await supabase.storage
        .from("job-photos")
        .upload(fileName, compressed, {
          contentType: "image/jpeg",
          cacheControl: "31536000",
        });

      if (storageError) throw storageError;

      // 4. Create database record
      const { error: dbError } = await supabase.from("job_photos").insert({
        job_id: jobId,
        storage_path: fileName,
        gps_latitude: gps?.latitude ?? null,
        gps_longitude: gps?.longitude ?? null,
        captured_at: new Date().toISOString(),
        uploaded_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (dbError) throw dbError;

      uploaded++;
    } catch (err) {
      log.warn("photo-upload", `Failed to upload ${file.name}, queuing`, {
        jobId,
        error: err instanceof Error ? err.message : String(err),
      });

      // Queue for retry
      await enqueueUpload({
        id: `${jobId}-${Date.now()}-${i}`,
        jobId,
        blob: await compressPhoto(file),
        metadata: {
          gpsLatitude: gps?.latitude ?? null,
          gpsLongitude: gps?.longitude ?? null,
          capturedAt: new Date().toISOString(),
          caption: "",
        },
        retries: 0,
        createdAt: new Date().toISOString(),
      });

      queued++;
    }
  }

  onProgress({
    total: files.length,
    completed: uploaded,
    failed: queued,
    current: null,
  });

  return { uploaded, queued };
}

/** Called on app startup or network reconnect to flush offline queue */
export async function flushOfflineQueue(
  onProgress?: ProgressCallback
): Promise<void> {
  const queued = await getAllQueued();
  if (queued.length === 0) return;

  const supabase = createClient();
  let completed = 0;

  for (const item of queued) {
    try {
      const fileName = `${item.jobId}/${Date.now()}-retry.jpg`;

      await supabase.storage
        .from("job-photos")
        .upload(fileName, item.blob, { contentType: "image/jpeg" });

      await supabase.from("job_photos").insert({
        job_id: item.jobId,
        storage_path: fileName,
        gps_latitude: item.metadata.gpsLatitude,
        gps_longitude: item.metadata.gpsLongitude,
        captured_at: item.metadata.capturedAt,
      });

      await dequeueUpload(item.id);
      completed++;

      onProgress?.({
        total: queued.length,
        completed,
        failed: 0,
        current: null,
      });
    } catch {
      // Leave in queue for next attempt
      log.warn("photo-queue-flush", `Retry failed for ${item.id}`);
    }
  }
}
```

### 13.5 Upload Progress UI Component

```typescript
// components/employee/PhotoUploadProgress.tsx
"use client";

interface Props {
  total: number;
  completed: number;
  failed: number;
  current: string | null;
}

export function PhotoUploadProgress({ total, completed, failed, current }: Props) {
  if (total === 0) return null;

  const percent = Math.round((completed / total) * 100);
  const isDone = completed + failed >= total;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">
          {isDone ? "Upload complete" : `Uploading ${completed + 1} of ${total}...`}
        </span>
        <span className="text-slate-500">{percent}%</span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-dark transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      {current && !isDone && (
        <p className="mt-1.5 truncate text-xs text-slate-400">{current}</p>
      )}

      {failed > 0 && (
        <p className="mt-2 text-xs text-amber-600">
          {failed} photo{failed > 1 ? "s" : ""} saved for upload when connection improves
        </p>
      )}
    </div>
  );
}
```

---

## 14. PDF GENERATION PIPELINE {#14-pdf-generation}

### 14.1 Completion Report PDF

```typescript
// lib/pdf/completion-report.ts
// Using @react-pdf/renderer for complex layouts
// Install: npm install @react-pdf/renderer

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { Database } from "@/lib/database.types";

type Job = Database["public"]["Tables"]["jobs"]["Row"];

interface ReportData {
  job: Job;
  client: { name: string; email?: string };
  photos: Array<{ url: string; capturedAt: string }>;
  checklistItems: Array<{ item_text: string; status: string }>;
  reviewNotes?: string;
  approvedAt: string;
  approvedBy: string;
}

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  logo: { fontSize: 24, fontWeight: "bold", color: "#0A1628" },
  subtitle: { fontSize: 8, color: "#64748b", marginTop: 4 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0A1628",
    marginBottom: 8,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 4,
  },
  row: { flexDirection: "row", marginBottom: 4 },
  label: { width: 120, color: "#64748b", fontSize: 9 },
  value: { flex: 1, color: "#0f172a" },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
    paddingVertical: 2,
  },
  checkBox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    marginRight: 8,
    borderRadius: 2,
  },
  checkBoxDone: {
    backgroundColor: "#0A1628",
    borderColor: "#0A1628",
  },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  photo: { width: 160, height: 120, objectFit: "cover", borderRadius: 4 },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
  },
});

function CompletionReportPDF({ data }: { data: ReportData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>A&A Cleaning Services</Text>
            <Text style={styles.subtitle}>Completion Report</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 9, color: "#64748b" }}>
              Report Date: {new Date(data.approvedAt).toLocaleDateString()}
            </Text>
            <Text style={{ fontSize: 9, color: "#64748b" }}>
              Approved by: {data.approvedBy}
            </Text>
          </View>
        </View>

        {/* Job Details */}
        <Text style={styles.sectionTitle}>Job Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Client:</Text>
          <Text style={styles.value}>{data.client.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{data.job.address}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Service Type:</Text>
          <Text style={styles.value}>{data.job.service_type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>✓ Approved — QA Passed</Text>
        </View>

        {/* Checklist */}
        {data.checklistItems.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Completion Checklist</Text>
            {data.checklistItems.map((item, i) => (
              <View key={`check-${i}`} style={styles.checkItem}>
                <View
                  style={[
                    styles.checkBox,
                    item.status === "completed" && styles.checkBoxDone,
                  ]}
                />
                <Text style={{ flex: 1 }}>{item.item_text}</Text>
                {item.status === "not_applicable" && (
                  <Text style={{ fontSize: 8, color: "#94a3b8" }}>N/A</Text>
                )}
              </View>
            ))}
          </>
        )}

        {/* Photos */}
        {data.photos.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Completion Photos ({data.photos.length})
            </Text>
            <View style={styles.photoGrid}>
              {data.photos.slice(0, 8).map((photo, i) => (
                <Image key={`photo-${i}`} src={photo.url} style={styles.photo} />
              ))}
            </View>
            {data.photos.length > 8 && (
              <Text style={{ fontSize: 8, color: "#94a3b8", marginTop: 4 }}>
                +{data.photos.length - 8} additional photos available
              </Text>
            )}
          </>
        )}

        {/* Review Notes */}
        {data.reviewNotes && (
          <>
            <Text style={styles.sectionTitle}>Review Notes</Text>
            <Text>{data.reviewNotes}</Text>
          </>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          A&A Cleaning Services • Licensed & Insured • Austin, TX Metro Area
          {"\n"}This report was generated automatically upon QA approval.
        </Text>
      </Page>
    </Document>
  );
}

export async function generateCompletionReport(
  data: ReportData
): Promise<Buffer> {
  return renderToBuffer(<CompletionReportPDF data={data} />);
}
```

---

## 15. SMS & EMAIL DELIVERY PATTERNS {#15-delivery}

### 15.1 SMS Service

```typescript
// lib/sms.ts
import twilio from "twilio";
import { log } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

interface SendSMSInput {
  to: string;
  body: string;
  jobId?: string;
  type: string;
}

export async function sendSMS(input: SendSMSInput): Promise<boolean> {
  const supabase = createAdminClient();

  // Queue the notification
  const { data: queued, error: queueError } = await supabase
    .from("notification_dispatch_queue")
    .insert({
      recipient_phone: input.to,
      message_body: input.body,
      notification_type: input.type,
      job_id: input.jobId ?? null,
      status: "pending",
    })
    .select()
    .single();

  if (queueError) {
    log.error("sms", queueError, { input });
    return false;
  }

  // Attempt immediate delivery
  try {
    // Check quiet hours
    const shouldDelay = await isQuietHours(supabase, input.to);
    if (shouldDelay) {
      log.info("sms", "Deferred due to quiet hours", {
        to: input.to,
        queueId: queued.id,
      });
      return true; // Queued for later
    }

    const message = await client.messages.create({
      body: input.body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: input.to,
    });

    // Update queue record
    await supabase
      .from("notification_dispatch_queue")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        external_id: message.sid,
      })
      .eq("id", queued.id);

    log.info("sms", "Sent successfully", {
      to: input.to,
      sid: message.sid,
    });

    return true;
  } catch (err) {
    log.error("sms", err, { to: input.to, queueId: queued.id });

    await supabase
      .from("notification_dispatch_queue")
      .update({
        status: "failed",
        error_message: err instanceof Error ? err.message : "Unknown error",
        retry_count: 1,
      })
      .eq("id", queued.id);

    return false;
  }
}

async function isQuietHours(
  supabase: ReturnType<typeof createAdminClient>,
  phone: string
): Promise<boolean> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("notification_preferences")
    .eq("phone", phone)
    .single();

  if (!profile?.notification_preferences) return false;

  const prefs = profile.notification_preferences as {
    quiet_start?: string;
    quiet_end?: string;
    timezone?: string;
  };

  if (!prefs.quiet_start || !prefs.quiet_end) return false;

  const tz = prefs.timezone ?? "America/Chicago";
  const now = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
  });

  return now >= prefs.quiet_start || now < prefs.quiet_end;
}
```

### 15.2 Email Service

```typescript
// lib/email.ts
import { Resend } from "resend";
import { log } from "@/lib/logger";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailInput {
  to: string;
  subject: string;
  template: string;
  data: Record<string, string>;
}

const TEMPLATES: Record<string, (data: Record<string, string>) => string> = {
  "quote-sent": (data) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0A1628;">Your Quote from A&A Cleaning</h2>
      <p>Hi ${data.clientName},</p>
      <p>Thank you for your interest. Please find your quote below:</p>
      <a href="${data.quoteUrl}" 
         style="display: inline-block; background: #0A1628; color: white; 
                padding: 12px 24px; border-radius: 6px; text-decoration: none;
                margin: 16px 0;">
        View Your Quote
      </a>
      <p style="color: #64748b; font-size: 14px;">
        This link is valid for 30 days. Questions? Call us at (512) 555-1234.
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 12px;">
        A&A Cleaning Services • Austin, TX Metro
      </p>
    </div>
  `,

  "completion-report": (data) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0A1628;">Job Completion Report</h2>
      <p>Hi ${data.clientName},</p>
      <p>The cleaning work at <strong>${data.jobAddress}</strong> has been 
         completed and approved by our quality team.</p>
      <a href="${data.reportUrl}" 
         style="display: inline-block; background: #0A1628; color: white; 
                padding: 12px 24px; border-radius: 6px; text-decoration: none;
                margin: 16px 0;">
        View Completion Report
      </a>
      <p style="color: #64748b; font-size: 14px;">
        The report includes completion photos and checklist verification.
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 12px;">
        A&A Cleaning Services • Licensed & Insured • Austin, TX
      </p>
    </div>
  `,

  "rework-notification": (data) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">Rework Requested</h2>
      <p>A rework has been requested for the job at <strong>${data.jobAddress}</strong>.</p>
      <p><strong>Reason:</strong> ${data.reason}</p>
      <p>Please coordinate with your crew to address the items above.</p>
    </div>
  `,
};

export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const templateFn = TEMPLATES[input.template];

  if (!templateFn) {
    log.error("email", `Unknown template: ${input.template}`);
    return false;
  }

  try {
    await resend.emails.send({
      from: "A&A Cleaning <noreply@aacleaningaustin.com>",
      to: [input.to],
      subject: input.subject,
      html: templateFn(input.data),
    });

    log.info("email", "Sent successfully", {
      to: input.to,
      template: input.template,
    });

    return true;
  } catch (err) {
    log.error("email", err, { to: input.to, template: input.template });
    return false;
  }
}
```

---

## 16. TESTING STRATEGY {#16-testing}

### 16.1 Setup

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jsdom @playwright/test msw
```

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    globals: true,
    include: ["src/**/*.test.{ts,tsx}", "test/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/lib/**", "src/hooks/**", "src/components/admin/ui/**"],
      exclude: ["src/lib/database.types.ts"],
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

```typescript
// test/setup.ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => cleanup());
```

### 16.2 Unit Tests — What to Test

```typescript
// test/lib/schemas.test.ts
import { describe, it, expect } from "vitest";
import { createLeadSchema, createJobSchema, qaDecisionSchema } from "@/lib/schemas";

describe("createLeadSchema", () => {
  it("accepts valid minimal lead", () => {
    const result = createLeadSchema.safeParse({
      name: "Jane Doe",
      phone: "(512) 555-1234",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = createLeadSchema.safeParse({
      name: "",
      phone: "(512) 555-1234",
    });
    expect(result.success).toBe(false);
  });

  it("rejects malformed phone", () => {
    const result = createLeadSchema.safeParse({
      name: "Jane",
      phone: "5125551234",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid email", () => {
    const result = createLeadSchema.safeParse({
      name: "Jane",
      phone: "(512) 555-1234",
      email: "jane@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = createLeadSchema.safeParse({
      name: "Jane",
      phone: "(512) 555-1234",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });
});

describe("qaDecisionSchema", () => {
  it("accepts approval without notes", () => {
    const result = qaDecisionSchema.safeParse({
      job_id: "550e8400-e29b-41d4-a716-446655440000",
      decision: "approved",
    });
    expect(result.success).toBe(true);
  });

  it("rejects rework without reason", () => {
    const result = qaDecisionSchema.safeParse({
      job_id: "550e8400-e29b-41d4-a716-446655440000",
      decision: "rework_requested",
    });
    expect(result.success).toBe(false);
  });

  it("accepts rework with reason", () => {
    const result = qaDecisionSchema.safeParse({
      job_id: "550e8400-e29b-41d4-a716-446655440000",
      decision: "rework_requested",
      rework_reason: "Floors not cleaned behind furniture",
    });
    expect(result.success).toBe(true);
  });

  it("rejects escalation without notes", () => {
    const result = qaDecisionSchema.safeParse({
      job_id: "550e8400-e29b-41d4-a716-446655440000",
      decision: "escalated",
    });
    expect(result.success).toBe(false);
  });
});
```

```typescript
// test/lib/photo-compress.test.ts
import { describe, it, expect, vi } from "vitest";

// Mock canvas and image APIs for compression tests
describe("compressPhoto", () => {
  it("rejects non-image files gracefully", async () => {
    const { compressPhoto } = await import("@/lib/photo/compress");
    const textFile = new File(["hello"], "test.txt", { type: "text/plain" });

    await expect(compressPhoto(textFile)).rejects.toThrow();
  });
});
```

```typescript
// test/hooks/useQuoteForm.test.ts (if using shared quote form from public site)
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useQuoteForm", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("initializes with empty fields", async () => {
    const { useQuoteForm } = await import("@/hooks/useQuoteForm");
    const { result } = renderHook(() => useQuoteForm("test"));

    expect(result.current.fields.name).toBe("");
    expect(result.current.fields.phone).toBe("");
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.feedback).toBeNull();
  });

  it("updates individual fields", async () => {
    const { useQuoteForm } = await import("@/hooks/useQuoteForm");
    const { result } = renderHook(() => useQuoteForm("test"));

    act(() => {
      result.current.setField("name", "Jane Doe");
    });

    expect(result.current.fields.name).toBe("Jane Doe");
  });
});
```

### 16.3 Component Tests

```typescript
// test/components/StatusBadge.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

describe("StatusBadge", () => {
  it("renders known status with correct label", () => {
    render(<StatusBadge status="pending_review" />);
    expect(screen.getByText("Pending QA")).toBeInTheDocument();
  });

  it("renders unknown status as raw text", () => {
    render(<StatusBadge status="unknown_thing" />);
    expect(screen.getByText("unknown_thing")).toBeInTheDocument();
  });
});
```

```typescript
// test/components/EmptyState.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { EmptyState } from "@/components/admin/ui/EmptyState";

describe("EmptyState", () => {
  it("renders message", () => {
    render(<EmptyState message="No leads yet" />);
    expect(screen.getByText("No leads yet")).toBeInTheDocument();
  });

  it("renders action button when provided", async () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        message="No jobs"
        action={{ label: "Create Job", onClick }}
      />
    );

    await userEvent.click(screen.getByText("Create Job"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

### 16.4 E2E Tests (Playwright)

```typescript
// e2e/admin-login.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Admin login", () => {
  test("redirects unauthenticated user to login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/auth\/admin/);
  });
});

// e2e/lead-pipeline.spec.ts
test.describe("Lead pipeline", () => {
  // Use a seeded test account
  test.use({ storageState: "e2e/.auth/admin.json" });

  test("displays lead cards on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/admin/leads");

    // Should show card layout, not kanban
    const cards = page.locator("[data-testid='lead-card']");
    await expect(cards.first()).toBeVisible();
  });

  test("displays kanban on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/admin/leads");

    const kanban = page.locator("[data
