# PHASE 1: AUDIT REPORT
## Current State vs. Master Spec Intent Analysis

**Date:** March 2026  
**Scope:** Comprehensive code review of 12 admin/employee components against Master Spec v5 design intent  
**Deliverable:** Gap analysis + current-state inventory for Phase 2-3 architecture redesign

---

## EXECUTIVE SUMMARY

### Current State
- ✅ **MVP Core Operational Loop Implemented:** Lead → Quote → Job → Assignment → Completion Photo
- ✅ **10 Admin Components + 2 Employee Components:** All major functional areas have code
- ✅ **Supabase Backend Integrated:** Auth, real-time subscriptions, RLS policies in place
- ✅ **Notification System Partial:** SMS dispatches work for assignments; quiet hours + preferences implemented
- ⚠️ **Admin Dashboard Incoherent:** 10 components stacked vertically on single page `/admin` with no navigation architecture
- ⚠️ **Employee Portal Minimal:** 2 components, basic job task list, no cohesive mobile experience
- ⚠️ **Master Spec 2.0 Needed:** Current URL structure and component organization don't match intended admin workflow from spec

### Phases Needed (Before Full Implementation)
1. **Phase 1 → Phase 2 Bridge:** Audit Report (this document) ✓
2. **Phase 2A:** Information Architecture + Navigation Spec (3-4 hours)
3. **Phase 2B:** Admin Dashboard Modularization Spec (4-5 hours)
4. **Phase 2C:** Employee Portal Mobile UX Spec (2-3 hours)
5. **Phase 3:** Full Master Spec 2.0 (implementation-ready detail spec)

---

## SECTION 1: ADMIN DASHBOARD COHERENCE ANALYSIS

### Current Architecture
**Single Route:** `/app/(admin)/admin/page.tsx`  
**Components Stacked:** All 10 components rendered vertically on one page

```tsx
// Current /admin/page.tsx structure
export default function AdminPage() {
  return (
    <>
      <FirstRunWizardClient />            {/* 1 */}
      <LeadPipelineClient />              {/* 2 */}
      <TicketManagementClient />          {/* 3 */}
      <SchedulingAndAvailabilityClient /> {/* 4 */}
      <OperationsEnhancementsClient />    {/* 5 */}
      <UnifiedInsightsClient />           {/* 6 */}
      <NotificationCenterClient />        {/* 7 */}
      <NotificationDispatchClient />      {/* 8 */}
      <HiringInboxClient />               {/* 9 */}
      <InventoryManagementClient />       {/* 10 */}
    </>
  );
}
```

### Problems with This Organization

| Problem | Impact | Example |
|---------|--------|---------|
| No navigation → no hierarchy | User scrolls 10+ screens to find what they need | To check the lead pipeline, must scroll past first-run wizard, ticket mgmt, scheduling, ops, insights, notification center, dispatch, hiring, inventory |
| No role-based filtering | Areli sees features for roles that don't apply | If she only works with crew scheduling, she still sees the full hiring inbox and entire inventory system |
| No task-oriented entry points | No clear "today's mission" | User lands on page; unclear what to do first |
| No workflow continuity | Features are isolated; related tasks scattered | Lead creation (LeadPipeline) is 200px away from Job creation (TicketManagement) |
| Notification duplication | Two similar components doing similar things | NotificationCenterClient + NotificationDispatchClient both manage SMS dispatch with overlapping controls |
| Tab/search confusion | No search, no tabs, just infinite scroll | Feature discovery depends on scrolling or memorizing vertical position |
| Mobile crushing | All components are wide, side-by-side grids | On mobile, a 10-component page becomes 50+ scrolls with single-column layout |
| No analytics → no insights | Don't know which features are actually used | May be spending time on features Areli doesn't need |

### Master Spec Intent: Hub-and-Spoke Admin Workflow

From Section 1.3 of Master Spec, the admin should have **clear operational phases:**

```
Admin Workflow (Intended):
Phase 1: Leads & Sales (morning)
  ├── View new leads (sorted by recency)
  ├── Call leads back (target: 15 min from form submission)
  ├── Qualify leads (service type, site, timeline)
  └── Send quotes to qualified leads

Phase 2: Operations (mid-day)
  ├── View today's/this week's job queue
  ├── Create work orders from accepted quotes
  ├── Assign to crew + send SMS notifications
  └── Manage crew availability/reassignments

Phase 3: Quality & Completion (end of day)
  ├── Review completed jobs (photos + checklists)
  ├── Flag issues or approve for delivery to GC
  ├── Generate completion reports
  └── Close invoicing loop

Phase 4: Analytics & Reporting (weekly)
  ├── Check dashboards (operations, quality, financial)
  ├── Export data for analysis
  └── Review crew performance trends
```

---

## SECTION 2: COMPONENT INVENTORY & CURRENT STATE

### Admin Components (10 Total)

| # | Component | Primary Purpose | Data Model | Current UX State | Spec Phase | Status |
|---|-----------|---|---|---|---|---|
| 1 | **FirstRunWizardClient** | Onboarding: create sample client → job → assignment | Clients, Jobs, JobAssignments, Profiles | 4-step wizard with form inputs | Phase 1 (MVP) | ✅ Functional |
| 2 | **LeadPipelineClient** | Lead capture → qualification → quote workflow | Leads, Quotes, QuoteLineItems | 7-column Kanban board (new → contacted → quoted → won/lost/dormant) | Phase 1 (MVP) | ✅ Functional |
| 3 | **TicketManagementClient** | Create jobs, assign workers, set details | Jobs, JobAssignments, ChecklistTemplates | Form + job list with status filter + QA status inline editor | Phase 1 (MVP) | ✅ Functional |
| 4 | **SchedulingAndAvailabilityClient** | Crew availability tracking, job reassignment with history | EmployeeAvailability, JobReassignmentHistory | Availability input form + crew calendar + drag-drop job reassignment lanes | Phase 5 | ⚠️ Dragdrop untested |
| 5 | **OperationsEnhancementsClient** | Checklist template editor, job messaging, completion reports | ChecklistTemplates, ChecklistTemplateItems, JobMessages | Template UI (left col) + Recent templates list + Job messaging (right col) | Phase 2 | ✅ Functional |
| 6 | **UnifiedInsightsClient** | 5-tab dashboard: overview, operations, quality, financials, inventory | Jobs, Leads, IssueReports, FinancialSnapshots, Supplies, QuickBooksInvoiceCache | 5 tabs with metric cards, tables, CSV export | Phase 4 | ⚠️ QB data simulated |
| 7 | **NotificationCenterClient** | Admin notification preferences (quiet hours, timezone, SMS/email toggles) | profiles.notification_preferences, NotificationDispatchQueue, JobAssignments | Left: preference toggles + timezone picker. Right: queue status + assignment SMS list | Phase 2 | ✅ Functional |
| 8 | **NotificationDispatchClient** | Visibility into SMS queue (queued/sent/failed) with retry | NotificationDispatchQueue | Table view: to_phone, status, send_after, reason, retry button | Phase 1? | ✅ Functional |
| 9 | **HiringInboxClient** | Review employment application submissions | EmploymentApplications | List of applications with status dropdown (new → reviewing → contacted → archived) | Phase 2+ | ✅ Functional |
| 10 | **InventoryManagementClient** | Supply tracking, low-stock alerts, request approval workflow | Supplies, SupplyRequests | Split view: supply creation form + low-stock table (left), supply request approval table (right) | Phase 5 | ✅ Functional |

### Employee Components (2 Total)

| # | Component | Primary Purpose | Data Model | Current UX State | Spec Phase | Status |
|---|-----------|---|---|---|---|---|
| 1 | **EmployeeTicketsClient** | Job assignment list → status workflow → photo upload → issue report | JobAssignments, Jobs, JobChecklistItems, JobMessages, IssueReports, JobPhotos | Accordion-style job cards (expandable) with status buttons, photo upload buttons, issue form | Phase 1 (MVP) | ⚠️ Mobile-first layout but desktop unfriendly |
| 2 | **EmployeeInventoryClient** | Supply usage logging, supply request submission | Supplies, SupplyUsageLogs, SupplyRequests, JobAssignments | Two-column form layout: Usage tracking (left) + Request submission (right) | Phase 5 | ✅ Functional |

### Key Data Model Status
- ✅ **Core Operational:** clients, leads, jobs, job_assignments, profiles, quotes, notification_dispatch_queue
- ✅ **Quality/Completion:** job_checklist_items, issue_reports, job_photos, job_messages, qa_status on jobs
- ✅ **Notification:** notification_preferences, notification_dispatch_queue with quiet_hours logic
- ⚠️ **Financial:** financial_snapshots, quickbooks_invoice_cache (populated but not live QB API)
- ⚠️ **Scheduling:** employee_availability, job_reassignment_history (code present but UX untested on mobile)
- ✅ **Inventory:** supplies, supply_requests, supply_usage_logs
- ✅ **Hiring:** employment_applications

---

## SECTION 3: MASTER SPEC vs. ACTUAL IMPLEMENTATION GAPS

### Gap 1: No Admin Navigation Structure

**Master Spec Intent (Section 1.3):**
> "Admin should have clear operational phases: Leads & Sales → Operations → Quality & Completion → Analytics & Reporting"

**Current Reality:**
- Single page with 10 components in vertical scroll
- No navigation menu, tabs, or sidebar
- User must know what they're looking for or scroll exhaustively

**Impact:**
- Onboarding time: High (where is the lead pipeline? where do I create jobs?)
- Task switching: Slow (to go from lead review to job assignment, must scroll past 5 components)
- Mobile UX: Broken (all components render with full width, causing horrific scrolling on phone)

**What's Needed for Phase 2:**
- Sidebar navigation OR tab bar (design choice needed)
- Role-based view filtering (e.g., "Sales" users see leads/quotes; "Operations" users see jobs/scheduling)
- Task-oriented landing pages (e.g., "/admin/dashboard" shows overview; "/admin/leads" goes to lead pipeline)

---

### Gap 2: Notification System Redundancy & Confusion

**Current State:**
- `NotificationCenterClient` (left column: preferences; right column: SMS queue + assignment SMS)
- `NotificationDispatchClient` (entire utility page: SMS queue visibility + manual retry + dispatch button)

**Problem:**
- Unclear difference between the two
- Functions overlap: both show dispatch queue, both have retry buttons
- User confusion: where do I manage SMS notifications? Center or Dispatch?

**Master Spec Intent:**
- Notification preferences (quiet hours, timezone, channel selection) → one unified location
- Queue visibility (for troubleshooting) → secondary detail
- Retry capability → accessible but not primary

**What's Needed:**
- Merge these into a single, coherent Notification Management module
- Left side: Preferences (timezone, quiet hours, channels)
- Right side: Queue status + issues
- Decide: does admin manually "run dispatch" or is dispatch automatic/cron-based?

---

### Gap 3: QA Review Workflow Missing

**Master Spec Intent (Section 3.2-3.3):**
> "Areli reviews photos/checklist BEFORE GC walkthrough. Completion report auto-generated for GC portal."

**Current State:**
- Jobs table shows `qa_status` field (can edit directly: pending → approved → flagged → needs_rework)
- No dedicated QA interface
- No workflow: job completion → QA approval → completion report generation → GC notification
- Photos are uploaded but no review interface

**What's Missing:**
- Dedicated QA queue/module with:
  - Job cards showing completion photos + checklist (if Phase 2)
  - Side-by-side before/after photo comparisons
  - Inline annotation tools (mark specific areas as approved/flagged)
  - Status workflow: pending → approved/flagged
  - If flagged: automatic reassignment of job to "needs_rework" state + crew notification
  - Auto-generation of completion report
  - One-click send to GC (email + SMS with link)

**Impact:**
- Without this, QA is just an admin checking photos in their own time, manually
- Blueprint for Phase 2: QA Review Module (dedicated page with photo gallery, approval UI, report generation)

---

### Gap 4: Quote Creation & Delivery Incomplete

**Master Spec Intent (Section 3.2.2):**
> "Quote created in platform with line items → branded PDF. Quote emailed to GC."

**Actual Implementation:**
- Quotes table + quote_line_items table exist
- Quote creation form in LeadPipelineClient (inside lead card) with line item inputs
- Quote PDF generation endpoint exists (`/api/quote-send`)
- ✅ Branded PDF template designed
- ✅ Email delivery via Resend

**What Works:**
- Creating a quote with line items
- Sending quote as PDF email
- Quote status tracking (draft → sent → accepted → declined)
- Share link generation

**What's Missing:**
- Quote templates (for recurring GC types)
- Quote version history (if quote is modified after sending)
- Quote comparison UI (show previously sent quotes for this lead)
- Quote expiry auto-reminder (system tells admin to follow up if 3 days pass with no response)
- Integration with JobsQuote (spec calls for creating a job directly from an accepted quote)

**Current State Assessment:** 80% complete, polish phase needed

---

### Gap 5: Lead Follow-Up Automation Incomplete

**Master Spec Intent (Section 3.2.2):**
> "Automated Follow-Up Reminders: 1-hour and 4-hour uncalled lead alerts. Quote sent, no response in 3 days → nudge. Quote no response in 7 days → escalation."

**Current Implementation:**
- Lead statuses exist: new, contacted, quoted, won, lost, dormant
- Manual status updates only
- No automated reminders

**What's Missing:**
- Cron job / scheduled function to check:
  - Leads with status=`new` older than 1 hour → SMS to admin "Uncalled lead: [Name]"
  - Leads with status=`new` older than 4 hours → SMS to admin "URGENT uncalled lead"
  - Quotes sent 3 days ago with no response → dashboard alert
  - Quotes sent 7 days ago with no response → SMS to admin
- Data model additions needed:
  - `contacted_at` timestamp on leads
  - `quoted_at` timestamp on quotes
  - `last_follow_up_at` timestamp on leads

**Current State Assessment:** 20% complete, needs backend automation layer

---

### Gap 6: Employee Portal UX/Navigation

**Master Spec Intent:**
- Employee portal should be "ultra-simple": view jobs, update status, take photos, flag issues
- Entire interface in Spanish by default
- Target: 30-second job completion flow

**Actual Implementation:**
- EmployeeTicketsClient + EmployeeInventoryClient on single route `/app/(employee)/employee/page.tsx`
- Job cards (accordion-expandable)
- Status buttons (assigned → en_route → in_progress → complete)
- Photo upload with compression + GPS metadata + IndexedDB queue
- Issue reporting with photo + voice-to-text prep
- Spanish labels throughout
- Inventory supply view + request form (Phase 5 feature, not Phase 1)

**Current State Assessment:** 70% functionally complete, but:
- ⚠️ No bottom navigation bar (hard to jump between sections on mobile)
- ⚠️ EmployeeInventoryClient shouldn't be visible until Phase 5
- ⚠️ Jobs rendered as accordion cards (good) but lack status indicator badges (improvement needed)
- ⚠️ Photo upload flow doesn't show progress indicator (user doesn't know if upload is pending/complete)

---

### Gap 7: Financial Dashboard Simulated Only

**Master Spec Intent (Section 3.1, Phase 4):**
> "Financial visibility: revenue tracking per client, expense tracking per job, cash flow visibility, invoice status monitoring — all from live QuickBooks data"

**Current Implementation:**
- `UnifiedInsightsClient` has 5 tabs: overview, operations, quality, financials, inventory
- Finance tab shows:
  - Total revenue (from financial_snapshots table)
  - Outstanding invoices (from financial_snapshots)
  - Overdue invoices (from quickbooks_invoice_cache)
  - Invoice aging analysis (0-30 days, 31-60, 61-90, 90+)
- Data populated from simulated financial_snapshots (calculated as: completed_jobs × $650 per job)
- QuickBooks integration stubbed but not live

**Current State Assessment:** 40% complete
- Dashboard structure is good
- Need live QuickBooks OAuth2 token flow
- Need real invoice pulling from QB API
- Once live: fully functional Phase 4 feature

---

### Gap 8: Checklist System Partial

**Master Spec Intent (Section 3.2, Phase 2):**
> "Checklist templates created by admin. Jobs link to templates. Crew completes checklist during job. Areli reviews checklist + photos before approval."

**Current Implementation:**
- ChecklistTemplates table exists (name, locale, description)
- ChecklistTemplateItems table exists (item_text, sort_order)
- OperationsEnhancementsClient has template creation UI
- TicketManagementClient allows linking job to template on creation
- EmployeeTicketsClient can display job_checklist_items (if present on a job)
- BUT: No "auto-expand" checklist items from template when job is created

**Steps to Fix:**
1. When TicketManagementClient creates a job with a template link, auto-populate job_checklist_items from the template
2. EmployeeTicketsClient needs to show checklist as interactive checkboxes (not just display)
3. QA review UI (Gap 3) should show checklist status prominently

**Current State Assessment:** 60% complete, needs gluing together

---

### Gap 9: Admin Permissions/Role-Based Access

**Current Implementation:**
- Middleware checks `profiles.role` = 'admin' → allow access to `/admin`
- Middleware checks `profiles.role` = 'employee' → allow access to `/employee`
- No granular role-based feature access (e.g., can Lead user view Inventory?)

**Master Spec Intent:**
- Doesn't explicitly define roles, but assumes Areli has full access
- Crew members are "employees" with restricted view

**Recommendation:**
- For MVP: Keep simple (2 roles: admin, employee)
- For Phase 2+: Add role-based column visibility (e.g., "Areli-only dashboard" vs. "Team visibility")
- Document assumptions about who can do what

---

### Gap 10: Error Handling & Validation

**Current Implementation:**
- Components show inline error/status text on failures
- Validation exists on form inputs (e.g., required fields)
- Network errors surface as plain text error messages

**What's Missing:**
- Comprehensive error documentation (what errors are expected? what user actions help?)
- Validation patterns (e.g., phone number format, email validation)
- Retry logic for failed API calls (beyond SMS notifications)
- Data consistency checks (e.g., orphaned job assignments if employee deleted)

**Current State Assessment:** 50% complete, acceptable for MVP but needs hardening

---

## SECTION 4: WORKFLOW COHERENCE ASSESSMENT

### Ideal Admin Workflow (from Master Spec)

```
08:00 — CHECK OVERNIGHT LEADS
  → /admin/leads (filter: new)
  → See: 3 new leads from form submissions
  → Leads sorted by recency with "uncalled" badge
  → Click lead → call GC directly
  → Log call: "Qualified PM, site visit Friday"
  → Lead status → "contacted"

09:00 — CREATE QUOTE
  → Lead record → "Create Quote"
  → Form: service type, scope, line items, price
  → Preview PDF
  → Send via email + SMS link
  → Lead status → "quoted"

14:00 — CHECK ACCEPTED QUOTES & CREATE WORK ORDERS
  → /admin/leads (filter: won)
  → See: 1 accepted quote from yesterday
  → "Convert to job" → Team details, crew assignment, scheduled date
  → Job created → SMS notification sent to crew

16:00 — REVIEW TODAY'S COMPLETIONS
  → /admin/quality (filter: completed today)
  → See: 2 jobs marked "complete" with photos
  → Swipe through photos for each
  → Approve both → auto-generate completion reports
  → Reports emailed to respective GCs

17:00 — DASHBOARD REVIEW
  → /admin/dashboard (overview tab)
  → Visual: Today's jobs completed, leads in pipeline, crew utilization, revenue today
  → Export this week's operations report for client presentation
```

### Current Reality (With Existing Admin Page)

```
Lands on /admin/page.tsx
  → Sees: FirstRunWizard (scroll past if not first-time-user)
  → Sees: LeadPipeline (Kanban board with 7 columns)
    ✓ Good for pipeline visualization
  → Continues scrolling...
  → Sees: TicketManagement (form + job list)
    ✓ Can create jobs, but no direct link from Lead Pipeline
  → Continues scrolling...
  → Sees: Scheduling (availability + job reassignment)
  → Sees: Operations (messaging + checklist templates + reports)
  → Sees: Insights (5-tab dashboard)
  → Sees: NotificationCenter (preferences + queue hybrid)
  → Sees: NotificationDispatch (alternate queue view)
  → Sees: HiringInbox (applications)
  → Sees: Inventory (supplies + requests)
```

**Assessment:** Current layout forces user to scroll past 10 disparate interfaces to find what they need. Task execution time is high. Mental model is: "scroll through everything until I find what I need."

---

## SECTION 5: MOBILE & RESPONSIVITY ASSESSMENT

### Current State by Component

| Component | Desktop | Tablet | Mobile | Notes |
|-----------|---------|--------|--------|-------|
| FirstRunWizard | Grid 2-col | Grid 2-col | Stack 1-col | ✅ Responsive |
| LeadPipeline | 5-col Kanban | Horizontal scroll | Horizontal scroll | ⚠️ Kanban unscrollable on mobile; needs redesign |
| TicketManagement | 2-col (form + list) | Stack 1-col | Stack 1-col | ✅ Responsive |
| Scheduling | Multi-section grid | Degraded | Single col scroll | ⚠️ Drag-drop lanes collapse on mobile |
| Operations | 2-col (template + jobs) | Stack 1-col | Stack 1-col | ✅ Responsive |
| Insights | Tab-based cards | Grid 3-col → 2-col | Grid 1-col | ✅ Responsive |
| NotificationCenter | 2-col | Stack 1-col | Stack 1-col | ✅ Responsive |
| NotificationDispatch | Table | Horizontal scroll | Horizontal scroll | ⚠️ Table unreadable on mobile |
| HiringInbox | Cards 1-col | Cards 1-col | Cards 1-col | ✅ Responsive |
| Inventory | 2-col | Stack 1-col | Stack 1-col | ✅ Responsive |

**Mobile-Specific Issues:**
- LeadPipeline Kanban: Impossible to use on phone; cards slide off screen
- NotificationDispatch table: Column widths crush text on mobile phone
- Scheduling drag-drop: No touch support currently; desktop-only interaction
- **Overall:** 10 components on single scrolling page becomes 50+ vertical swipes on mobile

**Needed for Phase 2:**
- Navigation restructure (tab bar or sidebar) helps mobile by reducing vertical scroll
- Component-specific mobile optimization (e.g., Kanban → vertical stack on mobile)
- Touch gesture support for interactions (drag-drop, swipe navigation)

---

## SECTION 6: DATA CONSISTENCY & SCHEMA OBSERVATIONS

### Strengths
- ✅ Supabase RLS policies are scoped (employees can only see their own assignments)
- ✅ Foreign keys properly established (leads → quotes → jobs)
- ✅ Timestamps on all transactions (created_at, updated_at)
- ✅ JSON fields for flexible data (notification_preferences, custom metadata)

### Potential Issues

| Issue | Severity | Details | Fix |
|-------|----------|---------|-----|
| Auth role inconsistency | Medium | Middleware reads `app_metadata.role`, but app code reads `profiles.role`. Privilege drift possible if metadata not synced after role change | Consolidate to single source of truth; audit all role checks |
| Orphaned records | Medium | If an employee is deleted, their job_assignments remain (FK not cascading). Dangling references in job_reassignment_history | Add CASCADE DELETE on critical FKs or audit orphans regularly |
| No soft deletes | Low | Records are hard-deleted; no audit trail/recovery. OK for MVP, consider for Phase 2 |  |
| Quote-to-invoice mapping unclear | Medium | Quotes are created, but conversion to QuickBooks invoices requires manual QB API call. No tracking of quote → QB estimate sync | Add `quickbooks_estimate_id` field to quotes; implement QB OAuth2 token flow in Phase 4 |
| Financial snapshots stale | High | Financial data pulled from simulated snapshots, not live QB. Dashboard shows deceiving numbers | Implement live QB API sync before going production |

---

## SECTION 7: CURRENT IMPLEMENTATION STATUS BY PHASE

### Phase 1 (MVP) — Lead → Quote → Job → Assignment → Completion

| Feature | Spec Status | Code Status | Assessment |
|---------|-------------|-------------|-------------|
| Public lead capture form | In scope | ✅ Implemented | Functional; SMS notification to admin works |
| Lead pipeline with status tracking | In scope | ✅ Implemented | Kanban board works desktop; mobile UX needs redesign |
| Quote creation with line items | In scope | ✅ Implemented | Form works, PDF generated, email delivery works |
| Lead → Client conversion (one-click) | In scope | ✅ Implemented | Automatic client creation from lead; reduces re-entry |
| Job creation with crew assignment | In scope | ✅ Implemented | Form works, SMS notification to crew works |
| Employee photo upload (timestamped, GPS) | In scope | ✅ Implemented | IndexedDB queue handles offline; metadata captured |
| Issue reporting from field | In scope | ✅ Implemented | Photo + description; voice-to-text prep in place |
| Notification preferences (quiet hours) | In scope | ✅ Implemented | Quiet hours logic works; batching not yet implemented |
| Auth with phone OTP (Twilio) | In scope | ✅ Implemented | Middleware redirects to auth; OTP code verified |
| MVP Dashboard visibility | In scope | ⚠️ Partial | 10 components exist but no coherent navigation |

**MVP Phase Assessment:** Functionally complete but architecturally incoherent. Core operations loop (lead → quote → job → assignment → completion) works end-to-end. Admin dashboard needs IA redesign for usability.

---

### Phase 2 — QA, Checklists, Messaging, Templates

| Feature | Spec Status | Code Status | Assessment |
|---------|-------------|-------------|-------------|
| Checklist templates | Phase 2 | ⚠️ 60% done | Template creation works; auto-population on job creation missing |
| Checklist sign-off during job | Phase 2 | ⚠️ 60% done | Data model ready, employee UI partial (display only) |
| QA review queue with photo approval | Phase 2 | ✅ Data ready, ⚠️ UI missing | Jobs have qa_status field; no dedicated QA review interface |
| Location-based job messaging | Phase 2 | ✅ Infrastructure ready | job_messages table exists; UI not fully wired |
| Completion report auto-generation | Phase 2 | ⚠️ Template ready | PDF template designed; not auto-triggered on approval |
| Completion report email delivery | Phase 2 | ✅ Infrastructure ready | Resend configured; not integrated into approval flow |
| Read-and-sign acknowledgments | Phase 2 | ❌ Not started | Data model needed; UI needed |
| Enhanced follow-up system | Phase 2 | ❌ Not started | Automation layer needed for timed reminders |

**Phase 2 Assessment:** Data models 70% ready; UI/workflow integration 40% done. QA review flow is the critical missing piece.

---

### Phase 3 — Client Portal (If Validated)

| Feature | Spec Status | Code Status | Assessment |
|---------|-------------|-------------|-------------|
| Client portal access (login) | Phase 3 | ❌ Not started | Needs auth pathway design; role = "client" not implemented |
| Job status visibility for clients | Phase 3 | ❌ Not started | Data available, UI not built |
| Completion report viewing | Phase 3 | ❌ Not started | Report generated, but no portal delivery mechanism |
| Invoice history & payment status | Phase 3 | ❌ Partial | Simulated data only; no QB link |

**Phase 3 Assessment:** Blocked on demand validation. Spec recommends interviewing GCs first before building (Section 8.2 #7). Low priority for Areli's initial launch.

---

### Phase 4 — Financial Dashboard & Analytics

| Feature | Spec Status | Code Status | Assessment |
|---------|-------------|-------------|-------------|
| Live QuickBooks integration | Phase 4 | ❌ Not started | OAuth2 token flow needed; simulated data only |
| Revenue tracking per client | Phase 4 | ⚠️ Partial | Insights dashboard shows total; per-client breakdown missing |
| Expense tracking per job | Phase 4 | ❌ Not started | Cost data not captured or displayed |
| Cash flow dashboard | Phase 4 | ❌ Not started | RequireQB data + Time series visualization |
| Invoice status monitoring | Phase 4 | ✅ UI ready | Data structure ready, QB sync needed |

**Phase 4 Assessment:** UI scaffolding 40% done; backend integration 0% done. QB API work is substantial; estimate 20 hours for full integration.

---

### Phase 5 — Advanced Features (Scheduling, Inventory, Analytics)

| Feature | Spec Status | Code Status | Assessment |
|---------|-------------|-------------|-------------|
| Drag-and-drop calendar scheduling | Phase 5 | ⚠️ 70% done | Drag-drop untested on mobile; desktop layout works |
| Crew availability calendar view | Phase 5 | ✅ Implemented | Data and UI present; mobile responsivity question |
| Inventory management | Phase 5 | ✅ Implemented | Supply tracking + low-stock alerts + request approval |
| Supply usage logging | Phase 5 | ✅ Implemented | EmployeeInventory captures usage per job |
| Analytics & crew performance reporting | Phase 5 | ✅ Data ready | Dashboard structure exists; not actively populated |

**Phase 5 Assessment:** Fully implemented; may be premature for MVP given current team size (6–10 crew). These features shine at scale (50+ employees).

---

## SECTION 8: RECOMMENDATIONS FOR MASTER SPEC 2.0

### Recommendation 1: Admin Navigation Restructure (CRITICAL)

**Action:** Design a navigation architecture for admin dashboard to replace single-page scroll.

**Options:**
- **Option A: Sidebar Navigation** — Persistent left sidebar with section links (Leads, Jobs, Quality, Notifications, Analytics, Settings). Adapt Stripe, Vercel dashboard patterns.
- **Option B: Top Tab Bar** — Horizontal tabs for primary sections (Leads | Jobs | Quality | Notifications). Allows more screen real estate for content.
- **Option C: Hub Page** — Landing page shows "Today's Priorities" as cards (uncalled leads, jobs to assign, completions to review). Click to drill into section. More task-focused.

**Recommendation:** Combination of A + C. Sidebar for primary navigation; landing page shows daily digest.

**Effort:** 12–16 hours (includes design, component restructuring, responsive testing)

---

### Recommendation 2: Mobile-First Component Redesign (CRITICAL)

**Action:** Redesign components optimized for mobile first, then scale up.

**Specific Changes:**
- LeadPipeline Kanban → Vertical stack on mobile (keep Kanban on desktop)
- NotificationDispatch table → Card-based list on mobile
- Scheduling drag-drop → List view on mobile with "Reassign" button
- Bottom navigation bar for employee app (Jobs | Inventory | Messages)

**Effort:** 16–20 hours

---

### Recommendation 3: QA Review Module (CRITICAL)

**Action:** Build dedicated QA review interface (not just inline editing on job card).

**Scope:**
- Card-based job gallery (swipeable on mobile, grid on desktop)
- Photo carousel with timestamps + GPS metadata displayed
- Checklist item verification (if Phase 2 checklists live)
- Approval buttons (Approve | Flag | Needs Rework)
- Auto-trigger on: job.status = "completed"
- Auto-generate completion report + email on approval
- Store QA review metadata (qa_reviewed_at, qa_reviewed_by, qa_notes)

**Effort:** 20–24 hours

---

### Recommendation 4: Consolidate Notification Management (Cleanup)

**Action:** Merge NotificationCenterClient + NotificationDispatchClient into single coherent module.

**New Structure:**
- Left: Preferences (timezone, quiet hours, channels)
- Right: Queue status + issue logs
- Single truth: one place to manage and troubleshoot notifications

**Effort:** 4–6 hours

---

### Recommendation 5: Lead Follow-Up Automation (Enhancement)

**Action:** Build cron/scheduled automation for follow-up reminders.

**Implementation:**
- Edge Function (Supabase or Vercel) runs every 30 min
- Checks: new leads, quoted leads, cold leads
- Sends SMS/dashboard alerts based on age + status
- Stores follow-up log in new table: `lead_follow_ups (id, lead_id, follow_up_type, sent_at, sent_via)`

**Effort:** 8–12 hours

---

### Recommendation 6: Finalize Checklist → Job Flow (Bug Fix)

**Action:** Wire up checklist templates to automatic item population.

**Steps:**
1. When TicketManagementClient creates job with template_id, query checklist_template_items
2. Insert into job_checklist_items for that job
3. EmployeeTicketsClient displays items as interactive checkboxes (not just text)
4. QA review shows checklist completion status

**Effort:** 4–6 hours

---

### Recommendation 7: Admin Permission Model (Design)

**Action:** Document assumptions about who can do what; implement role-based feature visibility.

**Scope:**
- Simple for MVP: 2 roles (admin, employee)
- Document: What can admins do? What can employees do?
- Consider: future "Lead Manager" role (Areli's assistant) → access to leads + quotes, but not financials

**Effort:** 2–3 hours (documentation) + 4–6 hours (implementation) if role-based visibility needed

---

### Recommendation 8: Error Handling & Validation Audit (Polish)

**Action:** Document expected errors + add validation everywhere.

**Scope:**
- Phone number format validation (for leads + crew)
- Email format validation (for quotes)
- Price field validation (must be > 0)
- Required field checks (no blank quote line items)
- API error handling documentation
- User-facing error messages (replace console errors with helpful UI messages)

**Effort:** 8–10 hours

---

### Recommendation 9: Data Consistency Audit (Critical Before Production)

**Action:** Fix identified schema issues.

**Steps:**
1. Consolidate role checks: Use `profiles.role` everywhere (audit auth middleware)
2. Add CASCADE DELETE to critical foreign keys OR implement soft deletes
3. Test orphan handling: delete employee → verify no broken assignments
4. Add `quickbooks_estimate_id` to quotes table (prep for Phase 4)
5. Document financial data freshness (note: snapshots are simulated until QB API live)

**Effort:** 6–8 hours

---

### Recommendation 10: Proposal — Phase 2A Info Arch Specification (Before Building)

**Action:** Before implementing any component changes, create detailed IA/wireframe spec showing:
- Navigation structure (sidebar, tabs, or hub)
- URL routing (e.g., /admin/leads, /admin/jobs, /admin/quality)
- Component hierarchy (which components nest inside which pages)
- Responsive breakpoints (mobile vs. tablet vs. desktop layout differences)
- Mobile-first design for drag-drop, tables, Kanban, and other complex interactions

**Effort:** 8–12 hours (collaborative design work)

**Deliverable:** Wireframes + design spec ready for developer implementation.

---

## SECTION 9: SUCCESS CRITERIA FOR PHASE 2

Before moving to Phase 3 (Full Master Spec 2.0 Implementation), these gates must be cleared:

| Gate | Current Status | Target Status | Owner |
|------|---|---|---|
| Admin navigation architecture approved | Not designed | Design spec complete + wireframes | Design review |
| QA review module designed & scoped | Partial (data ready, UI missing) | Detailed UI spec + component breakdown | Product + Dev |
| Mobile responsivity baseline established | Component-level | End-to-end flow tested on 3 real Android phones | QA |
| Checklist workflow end-to-end | 60% | Template creation → job item population → employee checkbox → QA display | Dev |
| Data consistency issues resolved | Identified | Audit complete + fixes deployed | Dev |
| Lead follow-up automation specified | Not started | Cron/Edge Function spec + implementation plan | Dev + SRE |
| Phase 2 IA/Wireframes approved | Not started | Interactive prototype + dev-ready specs | Design review + Product |

---

## SECTION 10: TIMELINE PROPOSAL FOR PHASES 2–3

### Phase 2: Architecture & Design (1 week focused work)

**Week 1 (20–25 hours):**
- Mon–Tue: Admin IA design + wireframing (8 hours)
- Tue–Wed: Mobile component redesign scoping (6 hours)
- Wed–Thu: QA review module design (6 hours)
- Thu–Fri: Notification consolidation + data audit (4 hours)

**Deliverable:** Phase 2 Architecture & Navigation Spec (detailed, design-ready)

### Phase 3: Full Master Spec 2.0 (2–3 weeks implementation)

**Week 2–4 (60–80 hours):**
- Admin navigation implementation (16 hours)
- Component mobile optimization (20 hours)
- QA review module build (24 hours)
- Notification consolidation (6 hours)
- Data fixes + validation (8 hours)
- Testing & refinement (8 hours)

**Deliverable:** Master Spec 2.0 fully implemented + deployable to production

**Post-Implementation:**
- Areli UAT (week 4)
- Crew UAT (week 4)
- Production deployment (week 5)

---

## APPENDIX A: COMPONENT DEPENDENCY MAP

```
Admin Dashboard Components (Dependency Graph)

FirstRunWizardClient
  ├─ clients table
  ├─ jobs table
  ├─ job_assignments table
  └─ profiles table

LeadPipelineClient
  ├─ leads table
  ├─ quotes table
  ├─ quote_line_items table
  ├─ clients table (for conversion)
  └─ profiles table (for employee filtering)

TicketManagementClient
  ├─ jobs table
  ├─ job_assignments table
  ├─ profiles table (for employee list)
  ├─ checklist_templates table
  └─ issue_reports table (for display)

SchedulingAndAvailabilityClient
  ├─ employee_availability table
  ├─ job_reassignment_history table
  ├─ jobs table
  ├─ job_assignments table
  └─ profiles table

OperationsEnhancementsClient
  ├─ jobs table
  ├─ job_messages table
  ├─ job_checklist_items table
  ├─ issue_reports table
  ├─ checklist_templates table
  └─ checklist_template_items table

UnifiedInsightsClient
  ├─ jobs table
  ├─ leads table
  ├─ issue_reports table
  ├─ financial_snapshots table
  ├─ quickbooks_invoice_cache table
  ├─ supplies table
  └─ supply_requests table

NotificationCenterClient
  ├─ profiles table (notification_preferences)
  ├─ notification_dispatch_queue table
  └─ job_assignments table

NotificationDispatchClient
  └─ notification_dispatch_queue table

HiringInboxClient
  └─ employment_applications table

InventoryManagementClient
  ├─ supplies table
  └─ supply_requests table

Employee Portal Components (Dependency Graph)

EmployeeTicketsClient
  ├─ job_assignments table
  ├─ jobs table
  ├─ job_checklist_items table
  ├─ job_messages table
  ├─ issue_reports table
  └─ job_photos table

EmployeeInventoryClient
  ├─ supplies table
  ├─ supply_requests table
  ├─ supply_usage_logs table
  └─ job_assignments table
```

---

## APPENDIX B: DATABASE TABLES INVENTORY

**Total Tables:** 28

### Operational (Core)
1. `profiles` — User accounts with roles + settings
2. `clients` — GC/PM company records
3. `leads` — Inbound inquiries (before conversion to client)
4. `quotes` — Estimates created for leads
5. `quote_line_items` — Detail lines within quotes
6. `jobs` — Work order assignments
7. `job_assignments` — Crew-to-job mapping with status
8. `job_reassignment_history` — Audit trail for job reassignments

### Quality & Completion
9. `job_checklist_items` — Task checklist for each job
10. `checklist_templates` — Reusable checklist templates
11. `checklist_template_items` — Detail items in templates
12. `issue_reports` — Problems flagged during jobs
13. `job_photos` — Completion photos (metadata)
14. `job_messages` — Location-based communication thread

### Notifications
15. `notification_dispatch_queue` — SMS queue with status tracking
16. `notification_preferences` — User settings (quiet hours, channels)

### Scheduling
17. `employee_availability` — Crew availability blocks

### Financial
18. `financial_snapshots` — Periodic revenue/invoice snapshots (simulated)
19. `quickbooks_invoice_cache` — QB invoice data cache (simulated)

### Inventory
20. `supplies` — Master supply list
21. `supply_requests` — Crew request workflow
22. `supply_usage_logs` — Per-job supply consumption

### Hiring
23. `employment_applications` — Job applicant submissions

### Auth/System
24. `auth.users` — Supabase Auth user records (managed by Supabase)
25. `sessions` — Active sessions (if implementing session mgmt)

### Storage Buckets (Not tables)
- `job-photos` — Supabase Storage for completion photos

**Count by Phase:**
- Phase 1 (MVP): 16 tables
- Phase 2: +4 tables (checklist, issue, messages)
- Phase 3: +2 tables (if client portal: client_messages, portal_views)
- Phase 4: +2 tables (financial refinement)
- Phase 5: +2 tables (supply_usage_logs, advanced metrics)

---

## APPENDIX C: NEXT STEPS FOR PHASE 2

1. **Review this audit with Areli** — Confirm findings; ask: "Which parts do you use most? Which confuse you?"
2. **Schedule design session** — 2–3 hours to sketch admin navigation (whiteboard, Figma, or just paper)
3. **Create wireframes** — For new IA + mobile layouts
4. **Dev estimation** — Break Phase 2 work into 12–16 tasks; assign effort + priority
5. **Kick off Phase 2 architecture** — Detailed spec ready for implementation

---

## SIGN-OFF

**Audit Report Created:** March 2026  
**Report Status:** Ready for Design Review  
**Next Gate:** Phase 2A Architecture Design (3–4 hours) → Phase 2B Implementation Spec (4–6 hours) → Phase 3 Implementation (60–80 hours)

This audit confirms the MVP operational loop is functional. To achieve the Master Spec vision of a cohesive, modular, mobile-first admin interface and polished employee experience, Phase 2 architecture work is essential before proceeding to full-scale implementation.

