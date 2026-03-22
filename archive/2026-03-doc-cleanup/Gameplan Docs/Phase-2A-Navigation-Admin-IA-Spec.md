# Phase 2A: NAVIGATION & ADMIN IA SPECIFICATION
## Information Architecture for Public Navigation + Admin Dashboard

**Status:** Planning Phase (Pre-Implementation)  
**Date:** March 19, 2026  
**Base References:** Phase 1 Codebase Audit + Phase 4A UX/UI Review + Master Spec Strategic Foundation

---

## TABLE OF CONTENTS
1. [Executive Summary](#executive-summary)
2. [Current Navigation Analysis](#current-navigation-analysis)
3. [Public Navigation Architecture](#public-navigation-architecture)
4. [Admin Dashboard IA](#admin-dashboard-ia)
5. [Admin Feature Hierarchy](#admin-feature-hierarchy)
6. [Navigation Interaction Patterns](#navigation-interaction-patterns)
7. [Mobile Navigation Strategy](#mobile-navigation-strategy)
8. [Information Architecture Flows](#information-architecture-flows)
9. [Accessibility Specifications](#accessibility-specifications)
10. [Implementation Readiness](#implementation-readiness)

---

## EXECUTIVE SUMMARY

### Current State
- Public site has 5 main routes + dynamic quote page
- Basic navigation structure with header
- **Status Unknown:** Admin dashboard navigation not yet reviewed
- **Status Unknown:** Employee dashboard navigation not yet reviewed

### Future State (Phase 2A Target)
- **Public Navigation:** Clear, scannable header with primary nav + CTA
- **Admin Dashboard:** Comprehensive, task-focused IA with role-based access
- **Employee Dashboard:** Simplified task-centric navigation
- **Mobile Navigation:** Hamburger menu with gesture support

### What This Spec Covers
✅ Complete public site navigation redesign  
✅ Admin dashboard information architecture  
✅ Admin feature organization by role/workflow  
✅ Navigation patterns across all user types  
✅ Mobile navigation strategy  
✅ Accessibility compliance (keyboard nav, screen reader)  

### What This Spec Does NOT Cover
❌ Component-level design (see Phase 2B)  
❌ Visual styling/colors (see Phase 2B)  
❌ QA module specific UI (see Phase 2C)  
❌ Detailed animations (see Phase 4A)  

---

## CURRENT NAVIGATION ANALYSIS

### Public Site Header (Current)
**File:** [src/components/public/variant-a/PublicHeader.tsx](src/components/public/variant-a/PublicHeader.tsx)

**Observed Structure:**
- Logo/Brand on left
- Navigation menu (center or right)
- Primary CTA button (right)
- Likely: Responsive hamburger on mobile

**Issues Identified (Phase 4A):**
- ⚠️ Mobile menu implementation not visible in codebase
- ⚠️ Navigation active state management unclear
- ⚠️ Dropdown patterns for complex menus not documented
- ⚠️ Scroll state morphing mentioned but not implemented

### Admin/Employee Dashboard (Current)
**Status:** Not yet audited in detail

**Known from Master Spec:**
- Areli needs dashboard with job overview, QA queue, financial data
- Crew needs simplified job assignment view
- Both need SMS fallback capability

---

## PUBLIC NAVIGATION ARCHITECTURE

### Primary Navigation Structure

```
www.aacleaning.com
├─ Logo (home link)
├─ Navigation Menu
│  ├─ Home
│  ├─ About
│  ├─ Services
│  ├─ Careers
│  └─ [Future: Blog / Resources]
├─ CTA Button
│  └─ "Request Quote" or "Get Quote"
└─ [Mobile: Hamburger Menu]
```

### Route Hierarchy (Grouped by Purpose)

#### **Discovery Routes** (Where prospects learn about the company)
```
/
  └─ Hero: Company positioning
  └─ Services overview
  └─ Trust/authority signals
  
/about
  └─ Company story
  └─ Team
  └─ Values/mission
  
/services
  └─ Detailed service descriptions
  └─ Case studies / portfolio
  └─ FAQ
```

#### **Action Routes** (Where prospects become leads)
```
/quote-request [Modal/Page]
  └─ Quote form
  └─ Immediate lead capture
  
/careers
  └─ Current openings
  └─ Company culture
  └─ Application form
```

#### **Protected Routes** (After quote token access)
```
/quote/[token]
  └─ View quote
  └─ Accept/decline
  └─ Contact with questions
```

#### **Authentication Routes**
```
/auth/admin
/auth/employee
```

#### **Protected Dashboards**
```
/admin [Protected: Admin role]
/employee [Protected: Employee role]
```

### Public Header Layout

#### **Desktop Layout (1024px+)**
```
┌─────────────────────────────────────────────────────────┐
│  🏢 A&A Cleaning  │  Home  About  Services  Careers  │  Get Quote  │
└─────────────────────────────────────────────────────────┘
```

**Specs:**
- Logo left-aligned, clickable home
- Nav items evenly spaced (center)
- Primary CTA button right-aligned
- **Hover state:** Underline on nav items, background color on CTA
- **Active state:** Bold or color indicator on current page
- **Scroll state:** Optional background color / shadow on scroll

#### **Tablet Layout (768px - 1023px)**
```
┌──────────────────────────────────────────────────┐
│  🏢 A&A  │  Home  About  Services  Careers  │  Quote  │
└──────────────────────────────────────────────────┘
```

**Changes:**
- Logo shorter text or icon-only
- Slightly compressed nav spacing
- CTA button text may truncate

#### **Mobile Layout (< 768px)**
```
┌──────────────────┐
│  ☰  🏢 A&A  🎯  │
└──────────────────┘
↓ [Menu Overlay]
Home
About
Services
Careers
Blog [Future]
───────────────
Request Quote
Call: (555) 123-4567
───────────────
Privacy  Terms
```

**Specs:**
- Hamburger menu icon (left or right)
- Logo center-aligned
- Primary CTA icon right-aligned (phone or quote)
- Menu slides from left, full width overlay
- Menu includes footer links (contact, legal)

### Navigation Labels & Microcopy

| Link | Label | Purpose |
|------|-------|---------|
| Home | "Home" | Return to hero section / refresh |
| About | "About" | Company story, team, values |
| Services | "Services" | Full service offerings + case studies |
| Careers | "Careers" | Hiring, culture, apply |
| Quote | "Request Quote" / "Get Quote" | Primary CTA |
| Contact | [In footer] | Email, phone, office address |

**Note:** Future phases may add:
- Blog / Resources / Knowledge Base
- FAQ section
- Testimonials page
- Referral program

---

## ADMIN DASHBOARD IA

### Admin User Profile (from Master Spec)
- **Name:** Areli (Founder/Owner)
- **Roles:** Administrator, Quality Director, Finance Manager
- **Primary Device:** Phone (on-site), laptop/computer (admin tasks)
- **Workflow:** Calls new leads → quotes → assigns crew → reviews QA → invoices
- **Pain Point:** Currently solo operator; platform must not add administrative burden

### Admin Dashboard Entry Point

```
/ (When logged in as admin)
  ↓
/admin (Dashboard home)
```

**First Load Experience:**
- Welcome banner (if first visit in 24 hours)
- Quick stats cards (jobs pending review, new leads, crew assignments)
- Upcoming schedule
- Notification alert center

### Admin Dashboard Main Navigation

#### **Left Sidebar (Desktop) / Primary Navigation**
```
Admin Dashboard
├─── OPERATIONS
│    ├─ Dashboard (Overview, quick stats, notifications)
│    ├─ Jobs (Create, assign, view status)
│    ├─ Schedule (Calendar view, crew availability)
│    ├─ Crew Management (Add crew, availability, performance)
│    └─ Clients (Client database, contact info, history)
│
├─── QUALITY & COMPLIANCE
│    ├─ QA Review Queue (Photos, checklists, flagged issues)
│    ├─ Checklist Templates (Create, edit, reuse templates)
│    ├─ Resource Library (Cleaning guides, SOPs, policies)
│    ├─ Issue Log (Flagged problems, resolutions)
│    └─ Audit Trail (Change log, user actions)
│
├─── SALES & LEADS
│    ├─ Leads Pipeline (New, contacted, quoted, won, lost)
│    ├─ Quotes (Create, send, track responses)
│    ├─ Quote Templates (Reusable quote structures)
│    └─ Follow-up Tasks (Automated reminders, overdue)
│
├─── FINANCIAL
│    ├─ Dashboard (Revenue overview, cash flow, metrics)
│    ├─ Jobs & Invoices (Job profitability, invoice status)
│    ├─ QuickBooks Sync (Sync status, manual trigger)
│    ├─ Expenses (Supply costs, equipment, overhead)
│    └─ Reports (Monthly, quarterly, custom exports)
│
├─── INVENTORY & SUPPLIES
│    ├─ Inventory (Stock levels, reorder status)
│    ├─ Supply Requests (Crew requests, approval workflow)
│    └─ Usage Log (Track per-job supply consumption)
│
├─── SETTINGS & ADMIN
│    ├─ Profile (Update name, phone, email)
│    ├─ Notifications (SMS alerts, email preferences)
│    ├─ Integrations (QuickBooks, Twilio, Stripe, etc.)
│    ├─ Team Management (Crew roles, permissions, access)
│    ├─ Workspace Settings (Company name, address, branding)
│    └─ API Keys (Developer access, webhooks)
│
└─── HELP & SUPPORT
     ├─ Documentation (Help articles, video tutorials)
     ├─ Feedback (Report issues, feature requests)
     └─ Support (Contact support, knowledge base)
```

### Admin Dashboard Section Detail

#### **OPERATIONS Cluster**
**Purpose:** Daily job management and crew coordination

**Dashboard (Home)**
- Quick stats: Jobs pending review, new leads today, crew assignments
- Today's schedule (what jobs are happening)
- New notifications (new leads, QA reviews waiting, overdue tasks)
- Shortcuts: "Create New Job", "Review Next QA", "Call New Lead"

**Jobs**
- Job list view (filterable by status, date, crew, client)
- Status states: Draft, Scheduled, In Progress, Completed, QA Review, Invoiced, Archived
- Quick actions: Edit, assign crew, view photos, create invoice
- Bulk actions: Assign multiple jobs, reschedule, create recurring

**Schedule**
- Calendar view (month, week, day)
- Drag-and-drop job reassignment
- Crew availability overlay
- Conflict detection (crew double-booked)
- One-click "send notification" for assignment changes

**Crew Management**
- Crew member list (name, phone, status, current job)
- Add/remove crew
- View crew performance (completion rate, QA issues, customer ratings)
- Crew availability calendar (vacation, training, unavailable)
- Training progress tracking

**Clients**
- Client/GC database (company name, contact, billing address)
- View client job history
- Service area coverage for each client
- Contract/pricing notes
- Quick call/email buttons

#### **QUALITY & COMPLIANCE Cluster**
**Purpose:** Quality assurance, documentation, training

**QA Review Queue**
- Jobs marked "Completed" by crew waiting for Areli's review
- Card layout:
  - Job address & scope
  - Completion photos gallery (with timestamps)
  - Checklist sign-off
  - Flagged issues from crew
  - Action buttons: "Approve", "Reject / Request Rework", "Mark Critical Issue"
- After approval → auto-generates completion report for GC

**Checklist Templates**
- Create checklist for each service type (post-construction, final clean, turnover, etc.)
- Reusable items: (Floors swept, Walls wiped, Fixtures polished, etc.)
- Each job references a template; crew checks off during completion

**Resource Library**
- Step-by-step guides per service/task (text + photos)
- Product lists (what chemicals, tools for each task)
- Policy documentation (safety, equipment, process)
- Photo examples (correct vs. incorrect)
- Associated trainings/videos

**Issue Log**
- All flagged problems from jobs (damage, unexpected conditions found by crew)
- Resolution tracking (noted, reported to GC, re-cleaned, etc.)
- Decision log (who made decision, when)

**Audit Trail**
- Change log (job edited, user assigned, status changed, etc.)
- User activity (who did what, when)
- Export capability (for dispute documentation)

#### **SALES & LEADS Cluster**
**Purpose:** Lead pipeline and quote management

**Leads Pipeline**
- Funnel view: New → Contacted → Quoted → Won → Lost
- Lead cards (name, company, phone, date added, last action)
- Status transitions (drag-to-move or dropdown)
- Follow-up badges (overdue, contacted today, quoting)
- Bulk actions: Send quotes to multiple leads, send follow-up message

**Quotes**
- Quote list (linked leads, status, response deadline)
- Create quote from template
- Edit and re-send quotes
- Track opens/replies
- Convert won quote → client + job (one click)

**Quote Templates**
- Reusable line items (service descriptions, standard pricing)
- Service-type templates (post-con pricing vs. turnover pricing)
- Easy merge-and-send workflow

**Follow-up Tasks**
- Overdue leads (quoted but no response in 3 days)
- Leads to contact (added > 24hrs ago)
- Today's follow-up list (chronological)
- One-click "contacted" marker

#### **FINANCIAL Cluster**
**Purpose:** Revenue visibility, cost tracking, invoicing

**Dashboard**
- MTD revenue (jobs invoiced this month)
- Pipeline revenue (quoted but not yet won)
- Cash flow by client
- Top customers (revenue ranking)
- Charts: Revenue growth, job volume, customer acquisition

**Jobs & Invoices**
- Job profitability (quote total vs. actual crew time cost)
- Invoice list (status: pending, paid, overdue)
- QuickBooks invoice sync status
- Time tracking per job (if recorded)

**QuickBooks Sync**
- Manual sync trigger
- Last sync status + timestamp
- Failed sync log (what errors occurred)
- Invoice reconciliation (match QB invoices to platform jobs)

**Expenses**
- Supply costs per job
- Equipment costs
- Overhead allocation
- Cost per job calculation

**Reports**
- Monthly summary export (CSV/PDF)
- Year-to-date revenue
- Customer profitability analysis
- Crew cost analysis (labor cost per job)

#### **INVENTORY & SUPPLIES Cluster**
**Purpose:** Supply chain management

**Inventory**
- Current stock levels (qty, reorder point)
- Low stock alerts
- Reorder history
- Usage trends

**Supply Requests**
- Crew request workflow (crew creates request from mobile)
- Admin approval/denial
- Fulfillment tracking (need stock in hand by X date)

**Usage Log**
- Log supply depletion per job (optional)
- Auto-calculate cost per job
- Trend analysis (which supplies used most)

#### **SETTINGS & ADMIN Cluster**
**Purpose:** System configuration, team access, integrations

**Profile**
- Name, phone, email
- Timezone, language
- Avatar/branding

**Notifications**
- SMS alert preferences (which events trigger texts)
- Email digest frequency
- Holiday/vacation mode (suppress notifications)

**Integrations**
- QuickBooks API status (connected, last sync)
- Twilio SMS account (connected)
- Stripe payment processing (optional future)
- Branding/white-label settings

**Team Management**
- Add/remove team members (admin, manager, crew lead)
- Role assignments (who can approve QA, who can invoice, etc.)
- Permissions matrix

**Workspace Settings**
- Company name, address, phone
- Service areas (coverage zones)
- Hours of operation
- Logo upload

**API Keys**
- Developer API key generation
- Webhook configuration (receive job events)
- Rate limit management

---

## ADMIN FEATURE HIERARCHY

### Role-Based Access Levels

#### **Admin (Areli)**
- Full access to all features
- Can manage team, settings, integrations
- Can approve QA, create/edit jobs, manage finances

#### **Manager (Future Phase)**
- Create/assign jobs
- Review QA
- View reports
- Cannot: Edit settings, manage payments, delete data

#### **Crew Lead (Future Phase)**
- Assign jobs to team
- View crew performance
- Cannot: Create quotes, manage finances, edit settings

#### **Crew Member**
- View assigned jobs
- Update job status
- Upload photos
- Cannot: View other jobs, see financial data, manage inventory

### Feature Rollout Timeline

**Phase 1 (MVP):**
- Dashboard (basic)
- Jobs (create, assign, view status)
- QA Review Queue
- Crew management (simple)
- Leads & Quotes (basic)

**Phase 2:**
- Detailed Dashboard (revenue charts, KPIs)
- Checklist Templates
- Resource Library
- Supply management
- QuickBooks integration

**Phase 3:**
- Advanced analytics
- Crew performance tracking
- Financial reporting
- Forecasting

---

## NAVIGATION INTERACTION PATTERNS

### Desktop Navigation (1024px+)

#### **Header Behavior**
```
On page load: Standard header with nav + CTA
On scroll down >100px: Add subtle shadow/background
On scroll up: Header remains visible (no hide/show)
```

#### **Dropdown Menus** (When Services / Resources have submenus)
```
On hover:
- Dropdown appears (no animation required, instant)
- Highlight changes background color
- Sub-items shown with small icons

On focus (keyboard):
- Tab to nav item → dropdown opens
- Arrow down to first sub-item
- Tab cycles through sub-items
- Escape closes dropdown
```

#### **Active Page Indicator**
```
Current page nav item:
- Bold text OR
- Underline OR
- Color change (primary accent)

Example: User on /about → "About" is bold
```

### Mobile Navigation (< 768px)

#### **Hamburger Menu Behavior**
```
Hamburger icon (top-left or top-right):
- Tap → Menu slides from side (usually left)
- Menu overlay has:
  - Full-width navigation items
  - Primary CTA (prominent button)
  - Footer links (contact, legal, language selector)
  - Close button (X or back arrow)

- Menu slides off-screen when:
  - User taps a link
  - User taps outside menu (close button)
  - Escape key pressed
```

#### **Touch Gestures** (Optional Enhancement)
```
Swipe right → open menu (if closed)
Swipe left → close menu (if open)
Tab navigation → cycles through focusable items
```

### Admin Dashboard Sidebar Behavior

#### **Desktop (1024px+)**
```
Sidebar always visible (left side):
- Width: 250px-300px
- Sections collapsible (click section header)
- One section expanded at a time (optional)
- Links highlight on hover
- Active link indication (highlight/bold)
```

#### **Tablet (768px - 1023px)**
```
Sidebar toggleable:
- Hamburger icon shows/hides sidebar
- Sidebar slides from left
- Content shifts or flows around sidebar
- Default: Collapsed (icons only)
```

#### **Mobile (< 768px)**
```
Sidebar as drawer:
- Hamburger icon shows/hides
- Full-screen overlay drawer
- Grouped by section with collapsible headers
- Tapping link navigates away (drawer closes automatically on route change)
```

---

## MOBILE NAVIGATION STRATEGY

### Mobile-First Principles for IA

1. **Progressive Disclosure:** Only show essential links at first, group secondary items in dropdowns
2. **Task Focus:** Mobile users come to complete one task (request quote, check job status) → prioritize that
3. **Reduced Scroll:** Navigation should not require excessive scrolling
4. **Touch-Friendly:** All interactive elements ≥ 44px touch target

### Public Site Mobile IA

#### **Priority-Ordered Links:**
```
Primary: Request Quote (always visible above fold)
Secondary: Home, Services, Careers
Tertiary: About, FAQs, Blog (in menu)
Footer: Contact, Privacy, Terms
```

#### **Floating CTA (Mobile Only)**
- Sticky "Get Quote" button at bottom of screen
- Always accessible while scrolling
- Dismissible for 5 minutes (reappears if user scrolls back down)

### Admin Dashboard Mobile IA

#### **Bottom Navigation Bar** (Common mobile pattern)
```
┌─────────────────────┐
│                     │
│     Main Content    │
│                     │
├─────────────────────┤
│ 🏠 📋 ⚙️ 👤 ⋯      │
│ Home Jobs Settings  │
└─────────────────────┘
```

**5-item bottom nav:**
- Home (Dashboard)
- Jobs (Job list)
- QA Review (Quick access to pending)
- Crew / Schedule (Task-specific)
- Menu (Everything else via hamburger)

#### **Advantages:**
- Always accessible
- Thumb-zone optimized
- Clearer than hamburger on mobile
- Popular pattern (users recognize)

#### **Navigation Fallback:**
If user opts for sidebar over bottom nav → hamburger icon in header still available

---

## INFORMATION ARCHITECTURE FLOWS

### User Flow 1: Prospect → Quote Request

```
START: User visits www.aacleaning.com
  ↓
[Hero Section - See "Get Quote" CTA]
  ├─ Option A: Click floating "Get Quote" button (mobile)
  ├─ Option B: Click header "Get Quote" CTA
  ├─ Option C: Scroll to "Request Quote" section
  └─ Option D: Navigate /about → click CTA → quote request
  ↓
[Quote Request Form Page]
  ├─ Fill form (name, email, phone, service type, description)
  ├─ Submit
  └─ Confirmation message + "expect contact within 24 hours"
  ↓
END: Lead captured in Areli's dashboard
```

### User Flow 2: Admin Workflow - New Lead to Job Assignment

```
START: Areli receives SMS "New lead: [Name]"
  ↓
[Login to /admin]
  ├─ Navigate: Sales & Leads → Leads Pipeline
  ├─ See new lead at top of "New" section
  └─ Click lead card
  ↓
[Lead Details View]
  ├─ Contact info displayed
  ├─ Action: "Call Lead" (opens phone)
  ├─ Action: "Create Quote" (jumps to quote form)
  └─ After call: Mark "Contacted" + notes
  ↓
[If Lead Interested]
  ├─ Create quote (pick template or custom)
  ├─ Send quote (email + SMS link)
  ├─ Mark status: "Quoted"
  └─ Get reminder in 3 days if no response
  ↓
[Lead Accepts]
  ├─ Click "Convert to Job" (one-button action)
  ├─ Pre-fills from quote: address, service type, total
  ├─ Add scheduling details (date/time, crew list)
  └─ Save job
  ↓
[Assign Crew]
  ├─ Navigate: Operations → Jobs → Find job
  ├─ Click "Assign Crew"
  ├─ Check availability calendar
  ├─ Select crew member(s)
  ├─ Add job-specific notes (site contact, special instructions)
  └─ Send notification (SMS to crew)
  ↓
END: Crew receives job assignment and sees in their mobile app
```

### User Flow 3: Crew - Complete Job with QA

```
START: Crew member receives SMS "You have a job assignment"
  ↓
[Open mobile app /employee]
  ├─ See "1 New Job" badge
  ├─ Tap job card
  └─ View: address, time, scope, special instructions
  ↓
[Navigate to Job]
  ├─ Tap "Navigate to Address" → Maps
  └─ En route to job
  ↓
[Arrive at Job]
  ├─ Tap "Start Work" → marks job status "In Progress"
  ├─ Begin cleaning per scope
  └─ Time tracking starts (optional)
  ↓
[Complete Job]
  ├─ Tap "Complete" → marks "Awaiting Review"
  ├─ Upload completion photos (multiple)
  ├─ Review checklist
  ├─ Flag any issues (damage, unexpected findings)
  └─ Submit
  ↓
[Photos Uploaded to QA Queue]
  ↓
END: Areli gets notification "Job ready for QA review"
```

### User Flow 4: Admin - QA Review

```
START: Areli sees notification "2 jobs pending QA review"
  ↓
[Navigate: Quality & Compliance → QA Review Queue]
  ├─ See queue of completed jobs
  ├─ Cards sorted by date (oldest first)
  └─ Click first job card
  ↓
[QA Review Card]
  ├─ Address, scope, crew member
  ├─ Photo gallery (swipe through, full-screen option)
  ├─ Checklist item-by-item (Show crew sign-off)
  ├─ Flagged issues (if any)
  ├─ Decision buttons:
  │  ├─ [Approve] → Generates GC completion report
  │  ├─ [Request Rework] → Crew gets notification
  │  └─ [Flag Critical Issue] → Escalates to issue log
  ↓
[After Approval]
  ├─ Completion report auto-generated with photos
  ├─ GC notified (email + SMS)
  ├─ Job marked "Complete"
  └─ Invoice ready to send or auto-sent to QB
  ↓
END: GC sees professional completion report on portal
```

---

## ACCESSIBILITY SPECIFICATIONS

### Keyboard Navigation

#### **Public Site Keyboard Flow**
```
Tab through order:
1. Skip to main content (invisible, shows on focus)
2. Logo (home link)
3. Nav items (Home, About, Services, Careers)
4. Primary CTA button (Get Quote)
5. Content links (mobile menu link if present)
6. Footer links (Privacy, Terms, Contact, Social)

Escape: Close mobile menu if open
Enter: Activate button/link
Arrow Down/Up: Navigate dropdowns (if present)
```

#### **Admin Dashboard Keyboard Flow**
```
Tab through order:
1. Sidebar section headers
2. Links within each section
3. Main content area (buttons, form fields, table rows)
4. Pagination / More results
5. Footer

Alt+Number: Shortcut to section (e.g., Alt+1 = Dashboard, Alt+2 = Jobs)
Escape: Close modals / sidebars
```

### Screen Reader Requirements

#### **Semantic HTML**
```html
<!-- Public header -->
<header>
  <nav aria-label="Main navigation">
    <a href="/" aria-label="A&A Cleaning home">...</a>
    <ul role="list">
      <li><a href="/" aria-current="page">Home</a></li>
      <li><a href="/about">About</a></li>
      <!-- ... -->
    </ul>
  </nav>
</header>

<!-- Admin sidebar -->
<aside aria-label="Admin navigation">
  <nav>
    <section>
      <h2>Operations</h2>
      <ul role="list">
        <li><a href="/admin">Dashboard</a></li>
        <!-- ... -->
      </ul>
    </section>
  </nav>
</aside>

<!-- Main content -->
<main id="main-content">
  {/* Page content */}
</main>
```

#### **ARIA Labels**
```
- Hamburger button: aria-label="Toggle navigation menu"
- Close button: aria-label="Close menu"
- Active link: aria-current="page"
- External links: aria-label="[name] (opens in new window)"
- Icon-only buttons: aria-label describing button purpose
```

#### **Status Updates**
```html
<!-- Async updates (e.g., job status changes) -->
<div role="status" aria-live="polite" aria-atomic="true">
  Job status updated to "In Progress"
</div>

<!-- Alerts (high priority) -->
<div role="alert" aria-live="assertive">
  2 jobs pending QA review
</div>
```

### Focus Indicators

All interactive elements must have visible focus indicator:
```css
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid #1e293b;
  outline-offset: 2px;
}

/* Skip link becomes visible on focus */
.skip-link:focus {
  top: 0;
  left: 0;
}
```

### Color Contrast

- **Navigation text on background:** 4.5:1 (WCAG AA)
- **Active/hover states:** Maintain 4.5:1 contrast
- **Do not rely on color alone:** Always include text or icon indicator of state

---

## IMPLEMENTATION READINESS

### What This Spec Enables

✅ Clear navigation structure for developers to implement  
✅ Role-based dashboard layout that scales  
✅ Accessibility compliance checklist  
✅ Mobile-first responsive strategy  
✅ User flow documentation for QA testing  

### What Still Needs Phase 2B & 2C

❌ Visual design of nav items (colors, fonts, icons)  
❌ Dashboard component design (button style, card layout)  
❌ Mobile component specs (hamburger icon, bottom nav bar)  
❌ QA module specific navigation (see Phase 2C)  

### Handoff to Development

**Files to Create (Phase 2B handles styling):**
1. `src/components/public/variant-a/PublicHeader.tsx` (desktop/mobile responsive nav)
2. `src/components/admin/AdminSidebar.tsx` (desktop/tablet/mobile variants)
3. `src/components/admin/AdminBottomNav.tsx` (mobile-only bottom navigation)
4. `src/app/admin/layout.tsx` (admin dashboard layout wrapper)
5. `src/app/(public)/layout.tsx` (public site layout wrapper)

**Test Cases for Navigation:**
- [ ] All links navigate to correct pages
- [ ] Active page indicator correct on refresh
- [ ] Mobile menu opens/closes
- [ ] Keyboard navigation works (Tab through all items)
- [ ] Screen reader announces all sections and links
- [ ] Focus indicator visible on all interactive elements
- [ ] Touch targets ≥ 44px on mobile
- [ ] No horizontal scroll on any viewport

---

**Status:** Ready for Phase 2B (Visual Design)  
**Next:** Phase 2B components design specs

