# PHASE 2A: ADMIN DASHBOARD NAVIGATION SPECIFICATION
## Information Architecture + Navigation Design

**Date:** March 2026  
**Scope:** Complete redesign of admin dashboard from monolithic single-page to modular, navigable interface  
**Deliverable:** Implementation-ready navigation spec with wireframes + URL routing + component hierarchy  
**Estimated Effort:** 16 hours implementation (after spec approval)

---

## EXECUTIVE SUMMARY

### Problem (From Phase 1 Audit)
Current `/admin/page.tsx` stacks 10 components vertically. Users scroll 50+ times on mobile to find features. No navigation. No task clarity.

### Proposed Solution
**Sidebar navigation + task-focused hub landing page.** Implements:
- Persistent left sidebar (persistent 240px on desktop, collapsible on mobile)
- 6 primary sections: Sales, Operations, Quality, Notifications, Analytics, Settings
- Hub dashboard showing "Today's Priorities" (daily digest of key task counts)
- URL routing to feature-specific pages (e.g., `/admin/leads`, `/admin/jobs`, `/admin/quality`)
- Responsive collapsing: sidebar collapses to icon-only on tablet, bottom nav on mobile

### Key Benefits
✅ Clear mental model (user knows where to go for each task)  
✅ Mobile-first design (bottom nav on phone, top priority tasks visible)  
✅ Scalable (adding features doesn't break layout)  
✅ Workflow-aligned (Sales → Operations → Quality mirrors Areli's daily cycle)

---

## SECTION 1: NAVIGATION ARCHITECTURE

### Option Analysis (From Phase 1 Audit)

| Option | Pros | Cons | Recommendation |
|--------|------|------|---|
| A: Sidebar Nav | Scalable, persistent context, desktop-friendly | Takes screen space on mobile | ✅ CHOOSE THIS |
| B: Top Tab Bar | Clean, minimal | Limited tabs before overflow, less context | Consider as secondary (mobile fallback) |
| C: Hub Landing | Task-focused, reduces cognitive load | Requires back-navigation to hub | ✅ COMBINE WITH A |

### Recommended Approach: Sidebar + Hub (Hybrid)

```
Desktop (1024px+):
┌─────────────────────────────────────────────────────┐
│ Header: A&A Logo | Areli | Notifications | Settings │
├──────────────────┬───────────────────────────────────┤
│                  │                                   │
│ Sidebar (240px)  │ Main Content Area                 │
│ - Sales          │ (Full width)                      │
│ - Operations     │ Routes:                            │
│ - Quality        │ /admin/dashboard (default)        │
│ - Notifications  │ /admin/leads                      │
│ - Analytics      │ /admin/jobs                       │
│ - Settings       │ /admin/quality                    │
│                  │ /admin/notifications              │
│                  │ /admin/analytics                  │
│                  │ /admin/settings                   │
│                  │                                   │
└──────────────────┴───────────────────────────────────┘

Tablet (768px–1023px):
┌─────────────────────────────────────────────────────┐
│ Header: A&A Logo | ☰ Menu | Notifications | Settings │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Main Content Area (responsive to 100% width)       │
│ Sidebar collapses to drawer (opens on menu tap)    │
│                                                     │
└─────────────────────────────────────────────────────┘

Mobile (<768px):
┌─────────────────────────────────────────────────────┐
│ A&A Logo | ☰ Menu | Notifications                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Main Content Area (full width, scrollable)         │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Sales | Ops | Quality | Notif. | Analytics        │ ← Bottom Nav
└─────────────────────────────────────────────────────┘

Note: Bottom nav shows icons + labels on mobile;
tap icons to navigate directly to sections.
```

---

## SECTION 2: INFORMATION ARCHITECTURE

### Primary Sections & Pages

```
Sales (Lead-to-Quote Pipeline)
├── /admin/leads (Default: pipeline Kanban view)
│   ├── Subpage: /admin/leads/[id] (Lead detail + quote history)
│   └── Action: Create quote inline or navigate to quote editor
├── /admin/quotes (Quote list + status tracking)
│   └── Subpage: /admin/quotes/[id] (Quote detail + delivery history)
└── Task: Daily 08:00 prompt — "Check new leads (X uncalled)"

Operations (Job Creation & Crew Management)
├── /admin/jobs (Job list + batch assignment + status filters)
│   └── Subpage: /admin/jobs/[id] (Job detail + assignment history)
├── /admin/schedule (Crew calendar + availability + drag-drop reassign)
│   └── Subpage: /admin/schedule/crew/[employee_id] (Individual crew schedule)
├── /admin/teams (Crew list + status + metrics by person)  [Phase 2 new]
└── Task: Daily 09:00 prompt — "Jobs to assign today (X pending)"

Quality (Completion Review & QA Approval)
├── /admin/quality (QA review queue — newly completed jobs awaiting approval)
│   └── Subpage: /admin/quality/[job_id] (Full photo gallery + checklist + approval UI)
├── /admin/completion-reports (Historical completed jobs + archived reports)
└── Task: Daily 16:00 prompt — "Completions to review (X pending QA)"

Notifications (SMS Dispatch & Preferences)
├── /admin/notifications/preferences (Admin personal settings: timezone, quiet hours, channels)
├── /admin/notifications/queue (Dispatch queue visibility + retry + manual dispatch trigger)
└── Task: Not a daily task; triggered as-needed or weekly audit

Analytics (Dashboard & Reporting)
├── /admin/dashboard (Hub landing page — daily digest + key metrics)
├── /admin/analytics/operations (Tab: jobs by client, crew utilization)
├── /admin/analytics/quality (Tab: QA approval rates, issue trends)
├── /admin/analytics/financials (Tab: revenue, outstanding invoices, aging)
├── /admin/analytics/inventory (Tab: low-stock alerts + usage trends)
└── Task: Weekly review + export for client presentations

Settings (Config & Admin)
├── /admin/settings/team (Manage crew accounts, roles, permissions)  [Phase 2 new]
├── /admin/settings/templates (Checklist templates, process templates)
├── /admin/settings/integrations (QuickBooks setup, Twilio config)  [Phase 4]
├── /admin/settings/hiring (Employment applications inbox)
└── Task: As-needed management

```

### URL Routing Summary

| Route | Component | Purpose | Phase |
|-------|-----------|---------|-------|
| `/admin` | Redirect to `/admin/dashboard` | Admin entry point | MVP |
| `/admin/dashboard` | NEW: AdminHubDashboard | Daily digest + key metrics + task counts | Phase 2A |
| `/admin/leads` | LeadPipelineClient (refactored) | Pipeline Kanban view | MVP+Phase2A |
| `/admin/leads/[id]` | NEW: LeadDetailPage | Single lead detail + quote history | Phase 2B |
| `/admin/quotes` | NEW: QuoteListPage | All quotes with status + filters | Phase 2B |
| `/admin/quotes/[id]` | NEW: QuoteDetailPage | Single quote + delivery logs | Phase 2B |
| `/admin/jobs` | TicketManagementClient (refactored) | Job list + batch create + assign | MVP+Phase2A |
| `/admin/jobs/[id]` | NEW: JobDetailPage | Single job detail + assignment history | Phase 2B |
| `/admin/schedule` | SchedulingAndAvailabilityClient (refactored) | Crew calendar view | Phase 2A+Phase5 |
| `/admin/schedule/crew/[id]` | NEW: CrewSchedulePage | Individual crew availability + assignments | Phase 5 |
| `/admin/teams` | NEW: TeamsListPage | Crew roster + per-person metrics | Phase 2 |
| `/admin/quality` | NEW: QAReviewQueue | Novel component — QA approval workflow | Phase 2C |
| `/admin/quality/[id]` | NEW: QADetailPage | Single job QA review (photos + checklist + approve/flag) | Phase 2C |
| `/admin/completion-reports` | NEW: CompletionReportsArchive | Historical completed jobs + report gallery | Phase 2 |
| `/admin/notifications/preferences` | NotificationCenterClient (preferences section only) | Personal notification settings | MVP+Phase2A |
| `/admin/notifications/queue` | NotificationDispatchClient | SMS queue visibility + retry + dispatch trigger | MVP+Phase2A |
| `/admin/analytics/dashboard` | UnifiedInsightsClient (existing) | Multi-tab dashboard | Phase 4 |
| `/admin/settings/team` | NEW: TeamSettingsPage | Crew account management | Phase 2 |
| `/admin/settings/templates` | OperationsEnhancementsClient (refactored) | Checklist templates + process templates | Phase 2 |
| `/admin/settings/integrations` | NEW: IntegrationsPage | QB OAuth, Twilio config, etc. | Phase 4 |
| `/admin/settings/hiring` | HiringInboxClient | Employment applications | MVP |

---

## SECTION 3: DESKTOP LAYOUT WIREFRAME

### Hub Dashboard (`/admin/dashboard`) — Daily Digest Landing Page

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ [A&A Logo]                                                Areli | 🔔 Notif | ⚙️  │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│ ┌──────────────┐  ┌────────────────────────────────────────────────────────┐ │
│ │  SALES       │  │ TODAY'S PRIORITIES                                     │ │
│ │ ▪ Leads      │  ├────────────────────────────────────────────────────────┤ │
│ │ ▪ Quotes     │  │ 🔴 URGENT: 3 Uncalled Leads (oldest: 2 hrs ago)       │ │
│ │              │  │  → [Smith Const. | 2h] [Davis Builders | 45min] [...]  │ │
│ │ OPERATIONS   │  │                                                        │ │
│ │ ▪ Jobs       │  │ 🟡 3 Jobs to Assign Today                            │ │
│ │ ▪ Schedule   │  │  → [Unit 4A @ Turner GC] [Paint cleanup @ Oak Creek]... │
│ │ ▪ Teams      │  │                                                        │ │
│ │              │  │ 🟢 2 Jobs Completed Today (awaiting QA review)         │ │
│ │ QUALITY      │  │  → [Building X, Unit 2B] [Office park final clean]     │
│ │ ▪ QA Review  │  │                                                        │ │
│ │ ▪ Reports    │  │ 📊 This Week's Snapshot                               │ │
│ │              │  │  • 12 leads in pipeline (3 new, 2 quoted, 2 won)      │ │
│ │ NOTIFICATIONS│  │  • 18 jobs completed (16 approved, 2 flagged)         │ │
│ │ ▪ Prefs      │  │  • Revenue YTD: $18,450 (7 clients active)            │
│ │ ▪ Queue      │  │                                                        │ │
│ │              │  │ [→ View Full Analytics] [→ Export Report]             │ │
│ │ ANALYTICS    │  └────────────────────────────────────────────────────────┘ │
│ │ ▪ Dashboard  │                                                            │
│ │ ▪ Reports    │                                                            │
│ │              │  Quick Action Cards (2-column grid below):                 │
│ │ SETTINGS     │  ┌──────────────────┐ ┌──────────────────┐               │
│ │ ▪ Team       │  │ 📞 Call Uncalled  │ │ ✏️  Create Quote  │               │
│ │ ▪ Templates  │  │ Leads             │ │                  │               │
│ │ ▪ Integr.   │  │ [→ Go to Sales]   │ │ [→ Go to Sales]  │               │
│ │              │  └──────────────────┘ └──────────────────┘               │
│ └──────────────┘  ┌──────────────────┐ ┌──────────────────┐               │
│                   │ 📋 Assign Jobs    │ │ ✅ Review QA     │               │
│                   │                  │ │                  │               │
│                   │ [→ Go to Ops]    │ │ [→ Go to Quality]│               │
│                   └──────────────────┘ └──────────────────┘               │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Sales Section (`/admin/leads`) — Kanban Pipeline

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ [A&A Logo]                                                Areli | 🔔 Notif | ⚙️  │
├────────────────────────────────────────────────────────────────────────────────┤
│  ← Back to Hub                                                                 │
│                                                                                │
│ ┌──────────────┐  ┌────────────────────────────────────────────────────────┐ │
│ │  SALES       │  │ LEAD PIPELINE (5 columns: new, contacted, quoted, won, lost) │
│ │ ▪ [Leads]    │  ├────────────────────────────────────────────────────────┤ │
│ │ ▪ Quotes     │  │                                                        │ │
│ │              │  │ [NEW]         [CONTACTED]  [QUOTED]  [WON]  [LOST]   │ │
│ │ OPERATIONS   │  │ (3)           (2)          (4)       (1)    (0)      │ │
│ │ ▪ Jobs       │  │                                                        │ │
│ │ ▪ Schedule   │  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │ │
│ │ ▪ Teams      │  │ Smith Const│ Reyes Bros│ Turner GC  Apex Build   │  │ │
│ │              │  │ 2h ago     │ Called 3/1│ $4,200     Signed 3/1  │  │ │
│ │ [...]        │  │ 📞UNCALLED │ Site visit│ Sent 2/28            │  │ │
│ │              │  │ [+Quote]   │ [+Quote]  │ [-Follow up] [+2 more...] │ │
│ └──────────────┘  └──────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Operations Section (`/admin/jobs`) — Job Management

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ [A&A Logo]                                                Areli | 🔔 Notif | ⚙️  │
├────────────────────────────────────────────────────────────────────────────────┤
│  ← Back to Hub                                                                 │
│                                                                                │
│ ┌──────────────┐  ┌────────────────────────────────────────────────────────┐ │
│ │  OPERATIONS  │  │ JOBS (This Week)                                       │ │
│ │ ▪ [Jobs]     │  │ Filter: [All ▼] [Assigned ▼] [Date ▼]                │ │
│ │ ▪ Schedule   │  ├────────────────────────────────────────────────────────┤ │
│ │ ▪ Teams      │  │ Job Title            | Client     | Crew     | Status │ │
│ │              │  │──────────────────────┼────────────┼──────────┼────────│ │
│ │ [...]        │  │ Unit 4A (Turner GC)  | Turner GC  | Diego    | Assigned
│ │              │  │ Office Paint Cleanup | Oak Creek  | Unassigned| Draft│ │
│ │              │  │ Building X Final Clp │ Apex Build | Maria+2  | In Progress
│ │              │  │ [⋮ Show More...]     │            │          │      │ │
│ │              │  │                                                        │ │
│ │              │  │ [+Create Job]  [⚙️ Batch Assign 2 Selected] [Export] │ │
│ └──────────────┘  └────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Quality Section (`/admin/quality`) — QA Review Queue (Novel)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ [A&A Logo]                                                Areli | 🔔 Notif | ⚙️  │
├────────────────────────────────────────────────────────────────────────────────┤
│  ← Back to Hub                                                                 │
│                                                                                │
│ ┌──────────────┐  ┌────────────────────────────────────────────────────────┐ │
│ │    QUALITY   │  │ QA REVIEW QUEUE (2 jobs pending approval)              │ │
│ │ ▪ [QA Revw]  │  ├────────────────────────────────────────────────────────┤ │
│ │ ▪ Reports    │  │                                                        │ │
│ │              │  │  ┌─ Building X Unit 2B (Turner GC)                    │ │
│ │ [...]        │  │  │ Completed: 3/1 14:30 by Diego + Maria             │ │
│ │              │  │  │ Status: 2/2 checklist items ✓                     │ │
│ │              │  │  │ [📷 View Photos (5)] [🔍 See Issues (1)]         │ │
│ │              │  │  │ [✅ Approve] [🚩 Flag for Rework] [💬 Notes]      │ │
│ │              │  │  └─────────────────────────────────────────────────  │ │
│ │              │  │                                                        │ │
│ │              │  │  ┌─ Office Paint Cleanup (Oak Creek)                 │ │
│ │              │  │  │ Completed: 3/1 12:15 by Jesus                    │ │
│ │              │  │  │ Status: 1/3 checklist items ✓ (1 pending)        │ │
│ │              │  │  │ [📷 View Photos (7)] [🔍 See Issues (0)]         │ │
│ │              │  │  │ [✅ Approve] [🚩 Flag for Rework] [💬 Notes]      │ │
│ │              │  │  └─────────────────────────────────────────────────  │ │
│ └──────────────┘  └────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Detailed QA Job View (`/admin/quality/[job_id]`)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ [A&A Logo]                                                Areli | 🔔 Notif | ⚙️  │
├────────────────────────────────────────────────────────────────────────────────┤
│  ← Back to QA Queue                                                            │
│                                                                                │
│ ┌──────────────────────────┐  ┌────────────────────────────────────────────┐ │
│ │ Building X Unit 2B       │  │ COMPLETION PHOTOS (5 total)                │ │
│ │ Turner GC                │  │ ┌──────┐ ┌──────┐ ┌──────┐               │ │
│ │                          │  │ │Photo1│ │Photo2│ │Photo3│               │ │
│ │ Completed: 3/1 14:30     │  │ │14:31 │ │14:32 │ │14:33 │               │ │
│ │ Crew: Diego + Maria      │  │ └──────┘ └──────┘ └──────┘               │ │
│ │                          │  │ ┌──────┐ ┌──────┐                        │ │
│ │ ── CHECKLIST ──          │  │ │Photo4│ │Photo5│                        │ │
│ │ ✓ Vacuumed all areas     │  │ │14:34 │ │14:35 │                        │ │
│ │ ✓ Windows cleaned        │  │ └──────┘ └──────┘                        │ │
│ │ ⊘ Final walkthrough      │  │                                            │ │
│ │   (not checked)          │  │ Click photo to expand / view full res     │ │
│ │                          │  │                                            │ │
│ │ ── ISSUES REPORTED ──    │  │ APPROVAL CONTROLS (right column)          │ │
│ │ ∙ Paint smudge in unit 2B│  │ ┌────────────────────────────────────────┐ │
│ │   → FIXED                │  │ │ QA STATUS: PENDING                     │ │
│ │   Photo of fix: Photo3   │  │ │                                        │ │
│ │                          │  │ │ Resolution Notes:                      │ │
│ │ [← Previous] [Next →]    │  │ │ ┌────────────────────────────────────┐ │ │
│ │                          │  │ │ │                                    │ │ │
│ │                          │  │ │ └────────────────────────────────────┘ │ │
│ │                          │  │ │ [✅ APPROVE] [🚩 FLAG FOR REWORK]     │ │
│ │                          │  │ │ [📧 EMAIL COMPLETION REPORT TO GC]     │ │
│ │                          │  │ └────────────────────────────────────────┘ │
│ └──────────────────────────┘  └────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## SECTION 4: MOBILE LAYOUT WIREFRAME

### Mobile Hub (`/admin/dashboard` on <768px)

```
┌─────────────────────────────────────┐
│ A&A Logo | ☰ | 🔔 1 | ⚙️           │
├─────────────────────────────────────┤
│                                     │
│ TODAY'S PRIORITIES                  │
│                                     │
│ 🔴 3 Uncalled Leads                │
│    #1: Smith Const (2h ago)        │
│    [→ Call Now]                    │
│                                     │
│ 🟡 3 Jobs to Assign                │
│    #1: Unit 4A @ Turner GC        │
│    [→ Assign Now]                  │
│                                     │
│ 🟢 2 Jobs Completed (QA pending)   │
│    #1: Building X Unit 2B          │
│    [→ Review QA]                   │
│                                     │
│ 📊 This Week: 12 leads, 18 jobs    │
│                                     │
├─────────────────────────────────────┤
│ Sales | Ops | Quality | Notif | ... │  ← Bottom Nav (swipeable)
└─────────────────────────────────────┘
```

### Mobile Sales Section (`/admin/leads` on <768px)

```
┌─────────────────────────────────────┐
│ A&A Logo | ← | 🔔 | ⚙️              │
├─────────────────────────────────────┤
│ LEADS (Showing: NEW)                │
│ Filter: [NEW ▼] [Sort ▼]            │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔴 UNCALLED — 2h ago           │ │
│ │ Smith Construction              │ │
│ │ (512) XXX-XXXX                  │ │
│ │ Post-construct clean, 12 units  │ │
│ │ [📞 CALL] [+Quote] [View Details]│ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ⚪ UNCALLED — 45m ago           │ │
│ │ Davis Builders                  │ │
│ │ (512) YYY-YYYY                  │ │
│ │ Final clean, office building    │ │
│ │ [📞 CALL] [+Quote] [View Details]│ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Load More...]                      │
│                                     │
├─────────────────────────────────────┤
│ Sales | Ops | Quality | Notif | ... │
└─────────────────────────────────────┘
```

### Mobile QA Review (`/admin/quality/[id]` on <768px)

```
┌─────────────────────────────────────┐
│ ← Back | 🔔 | ⚙️                    │
├─────────────────────────────────────┤
│ QA REVIEW: Building X Unit 2B       │
│                                     │
│ Crew: Diego + Maria | 3/1 14:30    │
│                                     │
│ ── CHECKLIST ──                     │
│ ✓ Vacuumed all areas               │
│ ✓ Windows cleaned                  │
│ ⊘ Final walkthrough (pending)      │
│                                     │
│ ── PHOTOS (5 total) ──              │
│ [Large Photo Carousel]              │
│ ┌─────────────────────────────┐    │
│ │                             │    │
│ │       [Photo 1 of 5]        │    │
│ │                             │    │
│ │   (14:31) Full room view    │    │
│ │                             │    │
│ └─────────────────────────────┘    │
│ [← Prev] [Next →]                  │
│                                     │
│ ── ISSUES ──                        │
│ ∙ Paint smudge in unit
│   Status: FIXED (Photo 3)          │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ Notes:                      │    │
│ │ ┌─────────────────────────┐ │    │
│ │ │ Looks good to go!      │ │    │
│ │ └─────────────────────────┘ │    │
│ └─────────────────────────────┘    │
│                                     │
│ [✅ APPROVE] [🚩 FLAG]              │
│ [📧 EMAIL GC]                       │
│                                     │
└─────────────────────────────────────┘
```

---

## SECTION 5: COMPONENT PLACEMENT & REFACTORING

### Component → New Pages Mapping

| Current Component | Current Location | New Home | Changes | Phase |
|---|---|---|---|---|
| FirstRunWizardClient | `/admin` | `/admin/dashboard` (modal/conditional) | Appears on first login only; moved to overlay | Phase 2A |
| LeadPipelineClient | `/admin` | `/admin/leads` | Extract Kanban view; optimize for desktop + mobile | Phase 2A |
| TicketManagementClient | `/admin` | `/admin/jobs` | Keep form + list; add batch assignment UI | Phase 2A |
| SchedulingAndAvailabilityClient | `/admin` | `/admin/schedule` | Refactor drag-drop for mobile; add touch support | Phase 2A/Phase5 |
| OperationsEnhancementsClient | `/admin` | `/admin/settings/templates` | Split: messaging → quality/[id], templates → settings | Phase 2B |
| UnifiedInsightsClient | `/admin` | `/admin/analytics/dashboard` | Keep 5-tab structure; rename route | Phase 2A |
| NotificationCenterClient | `/admin` | `/admin/notifications/preferences` | Extract prefs section only; keep in single location | Phase 2A |
| NotificationDispatchClient | `/admin` | `/admin/notifications/queue` | Keep as-is; may merge with above in future | Phase 2A |
| HiringInboxClient | `/admin` | `/admin/settings/hiring` | Move to settings section | Phase 2A |
| InventoryManagementClient | `/admin` | `/admin/settings/inventory` (Phase 5) or separate | Hide from Phase 1-4; separate section for Phase 5 | Phase 5 |
| (New) AdminHubDashboard | N/A | `/admin/dashboard` | Create landing page with daily digest + quick actions | Phase 2A |
| (New) QAReviewQueue | N/A | `/admin/quality` | Novel component for QA workflow | Phase 2C |
| (New) JobDetailPage | N/A | `/admin/jobs/[id]` | Single-job deep-dive | Phase 2B |
| (New) LeadDetailPage | N/A | `/admin/leads/[id]` | Single-lead deep-dive | Phase 2B |

---

## SECTION 6: RESPONSIVE BREAKPOINTS & BEHAVIOR

### Breakpoints

```
Mobile: < 768px
  - Sidebar hidden (collapsible via hamburger menu or swipeable drawer)
  - Bottom navigation bar visible (5 primary sections as icons + labels)
  - Single-column layout for all content
  - Full-width content area
  - Touch-friendly spacing (min 44px tap targets)
  - Kanban → vertical stack
  - Tables → cards or horizontal scroll with fixed left columns
  - Modals and drawers for sub-actions

Tablet: 768px – 1023px
  - Sidebar collapses to icon-only (240px → 64px)
  - Content area expands to fill
  - Bottom nav hidden (sidebar icons sufficient)
  - 2-col grid layouts where appropriate
  - Drag-drop works (but may be clunky)

Desktop: ≥1024px
  - Full sidebar (240px, expanded)
  - Full content area
  - Multi-col layouts
  - Kanban board fully visible
  - Drag-drop smooth and reliable
```

### Component Responsive Rules

| Component | Desktop | Tablet | Mobile |
|-----------|---------|--------|--------|
| Sidebar | 240px fixed | 64px icons only | Hidden (drawer) |
| Admin Hub (dashboard) | Card grid 3-col | Card grid 2-col | Stack 1-col |
| LeadPipeline Kanban | 5-col visible | 3-col with scroll | Vertical stack |
| JobList Table | Full table | Horizontal scroll | Card view |
| Notifications Queue Table | Full table | Horizontal scroll | Card view |
| QA Photo Gallery | Grid 3-col | Grid 2-col | Carousel 1-col |
| Scheduling Drag-Drop | Full lanes | Limited lanes | List + reassign button |

---

## SECTION 7: DAILY WORKFLOW PATHS (Task-Oriented)

### Morning: Check Leads (08:00–09:00)

**Desktop Path:**
1. Login → `/admin/dashboard` (hub shows "3 uncalled leads")
2. Click "Call Uncalled Leads" card → `/admin/leads?filter=new`
3. Kanban board shows NEW column with 3 leads
4. Click a lead card → side drawer or `/admin/leads/[id]` detail
5. Call GC (phone outside app)
6. Update lead status: "contacted"
7. Click "+Quote" → quote creation modal

**Mobile Path:**
1. Login → `/admin/dashboard` (hub shows "3 uncalled leads")
2. Tap "Uncalled Leads (3)" or tap "Sales" in bottom nav → `/admin/leads?filter=new`
3. See card-based lead list with "📞 CALL" button
4. Tap "📞 CALL" → initiates phone call (click-to-dial)
5. Return to app after call, update status
6. Tap "+Quote" → modal opens for quick quote entry

### Mid-Day: Create & Assign Jobs (09:00–14:00)

**Desktop Path:**
1. Hub → "3 Jobs to Assign Today" card
2. Go to `/admin/jobs?filter=draft`
3. See job list with status filter
4. Select 1–3 jobs with checkboxes
5. Click "Batch Assign 2 Selected" → drawer with crew selector
6. Select crew, confirm → SMS sent automatically

**Mobile Path:**
1. Hub → "3 Jobs to Assign Today"
2. Tap "Jobs" in bottom nav → `/admin/jobs?filter=draft`
3. See card list of jobs
4. Tap job card → detail view
5. Scroll down to "Assign" section, select crew, save
6. SMS sent; back to list

### End of Day: Review Completions (16:00–17:00)

**Desktop Path:**
1. Hub → "2 Jobs Completed (QA pending)"
2. Click card → `/admin/quality`
3. See queue of jobs awaiting QA approval
4. Click first job → `/admin/quality/[id]`
5. Swipe through photos (carousel or gallery)
6. Review checklist, read issue notes
7. Click "✅ APPROVE" → auto-generate report, email GC
8. Back to queue, next job

**Mobile Path:**
1. Hub → "2 Jobs Completed"
2. Tap "Quality" in bottom nav → `/admin/quality`
3. See card list of pending QA jobs
4. Tap first card → `/admin/quality/[id]`
5. Swipe through photo carousel
6. Scroll down to checklist + issues
7. Tap "✅ APPROVE"
8. Back to queue, next job

---

## SECTION 8: NAVIGATION COMPONENT CODE STRUCTURE

### New Components to Create

```
src/components/admin/
├── AdminLayout.tsx (wraps all /admin/* pages)
│   ├── Sidebar.tsx (desktop + tablet)
│   ├── BottomNav.tsx (mobile only)
│   ├── Header.tsx (persistent top bar)
│   └── NotificationBell.tsx (global notifications)
│
├── pages/
│   ├── AdminHubDashboard.tsx (NEW landing page)
│   ├── QAReviewQueue.tsx (NEW QA list)
│   ├── QADetailPage.tsx (NEW single QA job with photo gallery)
│   ├── JobDetailPage.tsx (NEW single job detail)
│   ├── LeadDetailPage.tsx (NEW single lead detail)
│   │
│   └── (Refactored existing components as route-specific pages)
│       ├── LeadPipelinePage.tsx (refactored LeadPipelineClient)
│       ├── JobsPage.tsx (refactored TicketManagementClient)
│       ├── SchedulePage.tsx (refactored SchedulingAndAvailabilityClient)
│       ├── NotificationsPrefsPage.tsx (NotificationCenterClient prefs section)
│       ├── NotificationsQueuePage.tsx (NotificationDispatchClient)
│       ├── AnalyticsDashboard.tsx (UnifiedInsightsClient)
│       ├── TemplatesSettingsPage.tsx (OperationsEnhancementsClient templates section)
│       ├── HiringPage.tsx (HiringInboxClient)
│       └── InventoryPage.tsx (InventoryManagementClient) [Phase 5]
```

### App Router Structure

```
src/app/(admin)/
├── admin/
│   ├── layout.tsx (AdminLayout wrapper — sidebar + bottom nav + header)
│   ├── page.tsx (redirect to /admin/dashboard)
│   │
│   ├── dashboard/
│   │   └── page.tsx (AdminHubDashboard)
│   │
│   ├── leads/
│   │   ├── page.tsx (LeadPipelinePage)
│   │   └── [id]/
│   │       └── page.tsx (LeadDetailPage)
│   │
│   ├── quotes/
│   │   ├── page.tsx (QuoteListPage) [Phase 2B]
│   │   └── [id]/
│   │       └── page.tsx (QuoteDetailPage) [Phase 2B]
│   │
│   ├── jobs/
│   │   ├── page.tsx (JobsPage)
│   │   └── [id]/
│   │       └── page.tsx (JobDetailPage)
│   │
│   ├── schedule/
│   │   ├── page.tsx (SchedulePage)
│   │   └── crew/
│   │       └── [id]/
│   │           └── page.tsx (CrewSchedulePage) [Phase 5]
│   │
│   ├── quality/
│   │   ├── page.tsx (QAReviewQueue)
│   │   └── [id]/
│   │       └── page.tsx (QADetailPage)
│   │
│   ├── notifications/
│   │   ├── preferences/
│   │   │   └── page.tsx (NotificationsPrefsPage)
│   │   └── queue/
│   │       └── page.tsx (NotificationsQueuePage)
│   │
│   ├── analytics/
│   │   ├── page.tsx (redirect to /admin/analytics/dashboard)
│   │   └── dashboard/
│   │       └── page.tsx (AnalyticsDashboard)
│   │
│   └── settings/
│       ├── page.tsx (SettingsHub) [NEW]
│       ├── team/
│       │   └── page.tsx (TeamSettingsPage) [Phase 2]
│       ├── templates/
│       │   └── page.tsx (TemplatesSettingsPage)
│       ├── integrations/
│       │   └── page.tsx (IntegrationsPage) [Phase 4]
│       └── hiring/
│           └── page.tsx (HiringPage)
```

---

## SECTION 9: STATE MANAGEMENT CONSIDERATIONS

### Route-Based State vs. Global State

**Recommendation:** Use URL query parameters for filters/views; Zustand/Jotai for global state (user context, notifications, selected items).

Example:
- `/admin/leads?filter=new&sort=created` → URL carries filter state
- `/admin/jobs?assigned_today=true` → URL carries filter state
- Global state: current user profile, auth token, real-time notification counter

---

## SECTION 10: IMPLEMENTATION CHECKLIST FOR PHASE 2A

### Week 1–2 Tasks (16 hours total)

#### Task 1: Create AdminLayout Component (3 hours)
- [ ] Sidebar component (desktop, icon-only tablet, hidden mobile)
- [ ] BottomNav component (mobile only, 5 primary sections)
- [ ] Header component (logo, title, notifications, settings menu)
- [ ] Responsive hooks/context to manage sidebar state on mobile
- [ ] Tailwind styling for all three breakpoints

#### Task 2: Create AdminHubDashboard Component (4 hours)
- [ ] Hub page layout (daily digest, priority cards, quick action cards)
- [ ] Wire data queries to show: uncalled leads count, jobs to assign, completions pending, weekly metrics
- [ ] Responsive grid (3-col desktop, 2-col tablet, 1-col mobile)
- [ ] Quick action button handlers → navigate to relevant pages

#### Task 3: Refactor Existing Components → Pages (6 hours)
- [ ] Move LeadPipelineClient → /admin/leads/page.tsx
- [ ] Move TicketManagementClient → /admin/jobs/page.tsx
- [ ] Move SchedulingAndAvailabilityClient → /admin/schedule/page.tsx
- [ ] Move UnifiedInsightsClient → /admin/analytics/dashboard/page.tsx
- [ ] Move NotificationCenterClient (prefs section) → /admin/notifications/preferences/page.tsx
- [ ] Move NotificationDispatchClient → /admin/notifications/queue/page.tsx
- [ ] Move HiringInboxClient → /admin/settings/hiring/page.tsx
- [ ] Remove componentsfrom old /admin/page.tsx
- [ ] Test all routes with back navigation

#### Task 4: App Router Setup (2 hours)
- [ ] Create folder structure under `/admin/`
- [ ] Create layout.tsx wrapper with AdminLayout
- [ ] Create page.tsx files in each folder
- [ ] Add redirects where appropriate (e.g., `/admin` → `/admin/dashboard`)
- [ ] Test all navigation paths

#### Task 5: Mobile Responsivity Testing (1 hour)
- [ ] Test on 3 real Android phones (or emulators)
- [ ] Verify sidebar collapse/bottom nav appearance
- [ ] Verify touch targets (min 44px)
- [ ] Test scroll behavior at each breakpoint
- [ ] Screenshot all key routes on mobile

### Success Criteria for Phase 2A Completion

✅ All routes functional and navigable  
✅ Desktop navigation working (sidebar links, navigation within sections)  
✅ Mobile navigation working (bottom nav, back navigation, inside-page scrolling)  
✅ Hub dashboard shows unexecutable daily digest (uncalled lead count, jobs to assign count, completions pending count)  
✅ Existing components functional in new pages (no broke functionality)  
✅ Mobile responsivity tested on real devices  
✅ All routes have back navigation  

---

## SECTION 11: KNOWN UNKNOWNS & DESIGN DECISIONS PENDING APPROVAL

### Design Decision 1: Hub Landing Page vs. Direct Section Access

**Option A:** User logs in → lands on `/admin/dashboard` (hub with digest + quick actions)
- **Pro:** Clear daily priorities; reduced overwhelm
- **Con:** Extra page load; power users may find it redundant

**Option B:** User logs in → lands on `/admin/leads` or `/admin/jobs` based on role/preference
- **Pro:** Direct access to primary task
- **Con:** Daily digest becomes secondary; easy to miss context

**Recommendation:** **Go with Option A (hub landing).** Mirrors Vercel, Stripe, GitHub dashboards. Provides strategic entry point for daily decision-making.

**Decision:** ✅ Option A approved / ⚠️ Pending review

---

### Design Decision 2: Sidebar Icon Style on Tablet

**Option A:** Icons only, no labels (64px width, icon + tooltip)
- **Pro:** Minimal, space-efficient
- **Con:** Icons may be ambiguous without labels

**Option B:** Icons + inline labels, smaller text (120px width instead of 240px)
- **Pro:** Always clear what each section is
- **Con:** Takes more space; may not fit on all tablets

**Recommendation:** **Go with Option A + tooltips.** Tooltips on hover provide clarity without taking permanent space.

**Decision:** ✅ Option A approved / ⚠️ Pending review

---

### Design Decision 3: QA Photo Gallery Interaction

**Option A:** Carousel (swipe left/right to navigate) with centralized photo viewer
- **Pro:** Mobile-native feeling; one photo at a time; clean focus
- **Con:** Need to click back to see thumbnails; less overview

**Option B:** Grid gallery (all photos visible at once) with click-to-expand modal
- **Pro:** See all photos at once; visual overview
- **Con:** Can feel cluttered on small screens; zoom-in/out needed

**Recommendation:** **Go with Option A for mobile, Option B for desktop.** Use responsive detection to swap views at 768px breakpoint.

**Decision:** ✅ Option A+B approved / ⚠️ Pending review

---

## SIGN-OFF

**Phase 2A Specification Document:** Ready for Implementation  
**Estimated Dev Effort:** 16 hours  
**Timeline:** 1–2 weeks (depending on parallel work)  

**Pre-Implementation Questions for Areli:**
1. Do you prefer landing on a daily digest (hub) or jumping straight to leads/jobs?
2. On the hub dashboard, what metrics matter most to you? (e.g., revenue, crew utilization, overdue quotes)
3. For the QA review flow, would you want the ability to annotate/mark specific areas of photos, or just approve/flag?
4. Should the "Teams" section show per-crew metrics (jobs completed, issues, ratings)? Or is a simple roster sufficient for MVP?

**Next Step:** Approval → Proceed to Phase 2A Implementation (component building & routing)

