# Phase 2C: QA MODULE DESIGN SPECIFICATION
## Quality Assurance System Architecture & Workflow Design

**Status:** Planning Phase (Pre-Implementation)  
**Date:** March 19, 2026  
**Base References:** Master Spec (Friction F1, F3, F8) + Phase 1 Codebase Audit + Phase 2A IA + Phase 2B Components

---

## TABLE OF CONTENTS
1. [Executive Summary](#executive-summary)
2. [QA Problem Framing](#qa-problem-framing)
3. [QA Module Architecture](#qa-module-architecture)
4. [Checklist Template System](#checklist-template-system)
5. [Resource Library System](#resource-library-system)
6. [QA Review Queue Workflow](#qa-review-queue-workflow)
7. [Issue Reporting & Tracking](#issue-reporting--tracking)
8. [Admin QA Dashboard](#admin-qa-dashboard)
9. [Crew Interface (Mobile)](crew-interface-mobile)
10. [Data Model & Storage](#data-model--storage)
11. [Implementation Readiness](#implementation-readiness)

---

## EXECUTIVE SUMMARY

### The QA Challenge (From Master Spec)
- **F1:** Areli is the only quality standard (lives in her head)
- **F3:** Blind handoff to GCs (quality issues discovered reactively)
- **F8:** No documentation trail (disputes about work quality)

### Solution: QA Module
The module systematizes quality control by:
1. **Documenting Standards** (Checklist templates per service type)
2. **Capturing Evidence** (Timestamped photos + GPS from crew)
3. **Creating Review Process** (Areli reviews before GC sees it)
4. **Providing Training** (Resource library with guides + examples)
5. **Tracking Issues** (Log all problems for dispute resolution)

### Target Outcomes
✅ Crew knows exactly what "done" looks like (via checklists)  
✅ Areli finds issues before GCs do (proactive QA)  
✅ GCs see professional completion reports (photo evidence)  
✅ Disputes resolved with timestamped documentation  
✅ Performance data drives training (see who needs help)  

### Scope
**What's Included in Phase 2C:**
- Checklist template design (structure, reusability)
- Resource library organization (hierarchy, content types)
- QA review queue (card design, workflow)
- Issue logging & tracking (workflow, resolution)
- Crew mobile interface (photo upload, checklist completion)
- Photo evidence system (storage, GPS, timestamps)
- Admin QA dashboard (pending reviews, issue log, analytics)

**What's NOT in Phase 2C:**
- Photo recognition AI (future)
- Automated QA scoring (future)
- Advanced analytics (Phase 3+)
- Crew training/onboarding module (future)

---

## QA PROBLEM FRAMING

### Current State: Manual, Inconsistent QA

**Today's Workflow:**
```
Crew completes job
  → Crew leaves site
  → Areli visits site (maybe)
  → Areli inspects work (visual, subjective)
  → Issues noted mentally (no log)
  → GC walks through (discovers issues Areli missed)
  → GC complains to Areli
  → Areli re-cleans or disputes
  → No documentation of what went wrong
```

**Problems:**
- ❌ Crew doesn't know standards (trained 1:1 by Areli)
- ❌ Areli can't be on every job site
- ❌ Quality highly variable (depends who Areli trained)
- ❌ GC finds issues first impression (looks unprofessional)
- ❌ No evidence trail (he-said-she-said)
- ❌ New hires take weeks to get up to speed

### Future State: Digital, Documented QA

**Platform Workflow:**
```
Crew completes job
  → Crew uploads timestamped photos + GPS
  → Crew checks off checklist items
  → Crew flags any issues (photo + description)
  → System creates QA review card
  → Areli gets notification "1 job pending QA"
  → Areli reviews photos + checklist + flags
  → Decision: Approve, Request Rework, or Escalate
  → If approved → Completion report auto-generated
  → GC sees professional report with evidence
  → Job history preserved (dispute resolution)
```

**Benefits:**
- ✅ Crew has documented checklist (knows standards)
- ✅ Evidence captured automatically (photos with metadata)
- ✅ Areli reviews without visiting site (time saver)
- ✅ GC sees quality confirmed before walk-through (professional)
- ✅ Full audit trail (timestamps, GPS, photos, decisions)
- ✅ Training pain points visible (who struggles with what checklists)

---

## QA MODULE ARCHITECTURE

### Component Ecosystem

```
QA Module
├─ Checklist Template System
│  ├─ Templates per service type (post-construction, final clean, etc.)
│  ├─ Reusable checklist items
│  └─ Item libraries (grouped by topic)
│
├─ Resource Library
│  ├─ Step-by-step guides (text + photos)
│  ├─ Product lists (chemicals, tools per task)
│  ├─ Photo examples (correct vs. incorrect)
│  ├─ Policy documentation (safety, standards)
│  └─ Video tutorials (optional)
│
├─ Crew Mobile Interface
│  ├─ Photo upload interface
│  ├─ Checklist completion
│  ├─ Issue reporting (photo + description)
│  ├─ Access to resource library
│  └─ GPS/timestamp capture
│
├─ QA Review Queue
│  ├─ Pending review cards (one per completed job)
│  ├─ Photo gallery with full-screen view
│  ├─ Checklist item-by-item review
│  ├─ Issue flag review
│  ├─ Decision buttons (Approve / Rework / Escalate)
│  └─ Notes field for Areli to add comments
│
├─ Issue Logger
│  ├─ Log all flagged issues
│  ├─ Track resolution (noted, reported, re-cleaned, etc.)
│  ├─ Decision audit trail
│  └─ Photo evidence per issue
│
└─ Admin QA Dashboard
   ├─ Pending reviews count
   ├─ Issue log (open/closed)
   ├─ Performance analytics (crew adherence rate)
   ├─ Reports (monthly QA summary)
   └─ Resource library management
```

### User Roles in QA

| Role | Capabilities | Constraints |
|------|---|---|
| **Admin (Areli)** | Create checklist templates, manage resource library, review QA queue, make approval decisions, view all issues | Full access |
| **Manager** (Future) | Review QA queue, approve jobs, manage resource library | Cannot create templates, cannot delete data |
| **Crew Member** | Complete checklists, upload photos, report issues, access guides | Cannot approve, cannot edit templates |

---

## CHECKLIST TEMPLATE SYSTEM

### Checklist Template Structure

#### **Template Metadata**
```
Name:              "Post-Construction Final Clean"
Service Type:      post_construction
Version:           1.0 (supports versioning for updates)
Created Date:      2024-01-15
Last Updated:      2026-03-19
Created By:        Areli (admin)
Description:       "Complete checklist for post-construction final cleaning before GC walkthrough"
Rooms/Areas:       Multi-room template (specify areas: Floor, Walls, Fixtures, etc.)
Estimated Time:    2-4 hours (guidance for crew)
```

#### **Checklist Items**
```
Item 1:
  Title:           "Vacuum all floors"
  Category:        Floors
  Details:         "Include closets, under furniture, baseboards"
  Examples:        [Link to resource: "Proper vacuuming technique"]
  Photo reference: [Photo of correctly vacuumed floor]
  Required:        true
  Point value:     1 (for scoring, optional)

Item 2:
  Title:           "Wipe all light switches and door handles"
  Category:        Fixtures
  Details:         "Use cleaning cloth, ensure no streaks"
  Examples:        [Link to resource: "Fixture cleaning guide"]
  Photo reference: [Photo of clean light switch]
  Required:        true
  Point value:     1
```

### Checklist Item Library (Reusable Inventory)

**Organized by Category:**
```
FLOORS
├─ Vacuum all carpeted areas
├─ Sweep hard floors
├─ Mop hard floors (tool + solution type)
├─ Check for debris patterns
└─ Baseboards cleaned

SURFACES
├─ Wipe down countertops
├─ Wipe kitchen backsplash
├─ Dust shelving
├─ Wipe cabinet faces
└─ Clean window sills

FIXTURES & FEATURES
├─ Wipe light switches (every one)
├─ Wipe door handles/knobs
├─ Wipe outlet covers
├─ Wipe thermostat
├─ Clean faucets / fixtures
└─ Toilet cleaned and flushed (if present)

WALLS & WINDOWS
├─ Sweep walls for cobwebs
├─ Wipe splatters (paint, dust)
├─ Check corners for debris
├─ Wipe window glass (interior)
└─ Clean window sills

FINAL INSPECTION
├─ Trash removed from all rooms
├─ No tools or equipment left behind
├─ Doors/windows locked (if applicable)
├─ Lights off / adjusted per plan
└─ Photos taken of completed areas
```

### Service Type Variations

Different service types have different checklists:

| Service Type | Checklist Focus |
|---|---|
| **Post-Construction** | Heavy debris removal, dust wiping, fixtures cleaning, final polish |
| **Final Clean** | Move-in ready, all surfaces gleaming, no residue |
| **Turnover** | Quick reset between tenants, focus on high-touch areas |
| **Detail Clean** | Deep cleaning of specific area (kitchen, bathroom) |
| **Window Cleaning** | Interior/exterior windows, frames, sills |
| **Power Wash** | Exterior surfaces (deck, patio, siding) |

### Template Customization

**Admin can:**
- [ ] Create new templates from scratch
- [ ] Clone existing template as base
- [ ] Add/remove/reorder items
- [ ] Mark items as required vs. optional
- [ ] Set point values (for optional scoring)
- [ ] Add notes/instructions per item
- [ ] Attach reference photos per item
- [ ] Set estimated time
- [ ] Archive old versions (keep history)

---

## RESOURCE LIBRARY SYSTEM

### Library Organization

```
Resource Library
├─ SERVICE GUIDES
│  ├─ Post-Construction Cleaning
│  │  ├─ Process Overview (video)
│  │  ├─ Equipment Setup (text + photo guide)
│  │  ├─ Debris Management (steps, tools, safety)
│  │  ├─ Dusting Technique (video demo)
│  │  ├─ Fixture Cleaning (photos: correct, incorrect)
│  │  └─ Final Inspection (checklist + tips)
│  │
│  ├─ Final Clean (similar structure)
│  └─ Turnover Clean (similar structure)
│
├─ PRODUCT GUIDES
│  ├─ Chemicals
│  │  ├─ All-Purpose Cleaner (what to use for, dilution ratio, safety)
│  │  ├─ Glass Cleaner (surfaces, technique, disposal)
│  │  ├─ Degraser (application, safety, ventilation)
│  │  └─ [Per product]
│  │
│  └─ Equipment
│     ├─ Mop Types (when to use which)
│     ├─ Vacuum (operation, maintenance, troubleshooting)
│     ├─ Pressure Washer (setup, technique, safety)
│     └─ [Per tool]
│
├─ SAFETY & COMPLIANCE
│  ├─ Personal Protective Equipment (PPE required)
│  ├─ Chemical Safety (MSDS, storage, spills)
│  ├─ Accident Reporting (what to do, who to contact)
│  └─ Site Safety (locked doors, restricted areas)
│
├─ POLICIES & PROCEDURES
│  ├─ Code of Conduct (professional standards)
│  ├─ Client Communication (how to interact)
│  ├─ Photo Documentation (what to photograph, how)
│  ├─ Issue Reporting (when/what to escalate)
│  └─ Time Tracking (clocking in/out)
│
└─ PHOTO EXAMPLES
   ├─ Correct Work (before/after galleries)
   ├─ Common Mistakes (what not to do + correction)
   ├─ Edge Cases (unusual situations + solutions)
   └─ [Organized by service type]
```

### Content Types in Library

| Type | Format | Purpose | Example |
|------|--------|---------|---------|
| **Text Guide** | Markdown / rich text | Step-by-step instructions | "How to clean hard floors" |
| **Photo Gallery** | Images + captions | Show correct technique + results | Before/after gallery |
| **Video Tutorial** | Embedded video | Demonstrate technique | "Proper vacuuming form" |
| **Product Sheet** | Reference card | Product specs and usage | "All-purpose cleaner dilution ratios" |
| **Safety Checklist** | Checklist | Pre-work safety verification | "PPE before job start" |
| **Decision Tree** | Flowchart | When to use what product | "Choosing the right cleaner" |

### Resource Accessibility

**On Mobile (Crew):**
- Accessible from within job context (swipe to "Resources" tab)
- Search/filter by keyword ("How do I clean grout?")
- Bookmarks (crew can save favorites)
- Offline cache (some resources cached on device)

**On Desktop (Admin + Managers):**
- Full library management interface
- Upload new resources
- Edit/update content
- Track resource usage (which guides accessed from which jobs)
- Version control (keep history of guide updates)

---

## QA REVIEW QUEUE WORKFLOW

### Flow Overview

```
Crew completes job and submits completion
  ↓
System creates QA Review card
  ↓
Areli gets notification: "1 job ready for QA"
  ↓
Areli opens QA Review Queue
  ↓
[Review Card] displays:
  ├─ Job details (address, crew, date)
  ├─ Photo gallery (thumbnails + full-screen)
  ├─ Checklist items (each with crew's checkoff)
  ├─ Crew notes (any text they added)
  ├─ Issues flagged (with photos + descriptions)
  └─ Decision buttons
  ↓
Areli makes decision:
  ├─ [Approve] → Job marked complete, generates GC report
  ├─ [Request Rework] → Crew gets notification + reason
  └─ [Flag Critical] → Escalates to issue log + notification
  ↓
Decision logged with timestamp + Areli's notes
```

### QA Review Card Design

#### **Card Structure** (Desktop)
```
┌─────────────────────────────────────────────────────────┐
│ STATUS: Pending Review                    Close icon ✕  │
├─────────────────────────────────────────────────────────┤
│ ADDRESS: 123 Main St, Austin, TX                         │
│ CREW: John Doe                    DATE: 2026-03-19       │
│ SERVICE TYPE: Post-Construction    ESTIMATED TIME: 3hrs  │
├─────────────────────────────────────────────────────────┤
│ PHOTO GALLERY                                            │
│ [Thumbnail 1] [Thumbnail 2] [Thumbnail 3] [Thumbnail 4] │
│ [Thumbnail 5] [Thumbnail 6] [+3 more]                   │
│                                                          │
│ [Click to view full-screen gallery]                     │
├─────────────────────────────────────────────────────────┤
│ CHECKLIST REVIEW                                         │
│ ✓ Vacuum all floors          ← crew checked off         │
│ ✓ Wipe light switches                                    │
│ ✗ Wipe door handles          ← missed / unchecked        │
│ ✓ Clean fixtures                                         │
│ ✓ Final inspection                                       │
│                                                          │
│ Completion: 4/5 items (80%)                             │
├─────────────────────────────────────────────────────────┤
│ CREW NOTES                                               │
│ "Paint spatter on window found. Noted for rework."       │
│ [Photo of spatter] [Timestamp: 14:32]                   │
├─────────────────────────────────────────────────────────┤
│ FLAGGED ISSUES                                           │
│ ⚠️  Paint damage (wall): [Photo] [Photo]                │
│    "Found paint splatter from other trade"              │
│    Status: Noted → Reported to GC → To fix              │
├─────────────────────────────────────────────────────────┤
│ ARELI'S NOTES (optional)                                 │
│ [Text field: "Looks good overall. Hanks for flagging...] │
├─────────────────────────────────────────────────────────┤
│ [Approve] [Request Rework] [Flag Critical] [Skip for now]│
└─────────────────────────────────────────────────────────┘
```

#### **Card Structure** (Mobile)
```
┌─────────────────────────────┐
│ 123 Main St, Austin, TX     │
│ John Doe • 2026-03-19       │
├─────────────────────────────┤
│ PHOTOS [6 inline]            │
│ [Swipe gallery]             │
├─────────────────────────────┤
│ CHECKLIST: 4/5 (80%)        │
│ ✓ Vacuum all floors         │
│ ✓ Wipe light switches       │
│ ✗ Wipe door handles         │
│ ✓ Clean fixtures            │
│ ✓ Final inspection          │
├─────────────────────────────┤
│ ISSUES: 1                   │
│ ⚠️  Paint damage             │
├─────────────────────────────┤
│ [Approve]                   │
│ [Request Rework]            │
│ [Flag Critical]             │
│ [Skip for now]              │
└─────────────────────────────┘
```

### QA Review Actions

#### **1. Approve**
```
Action:      Mark job as "Complete" and "Approved"
Automatic:   
  - Generate GC completion report (with all photos)
  - Send email to GC with completion report
  - Mark job ready for invoicing
  - Log decision: "Approved by Areli at 14:45 on 2026-03-19"
  - Create analytics data point (job approved on first review)
GC sees:     Professional completion report (photos + checklist status)
Next:        Move to invoicing workflow
```

#### **2. Request Rework**
```
Action:      Mark job as "Rework Requested"
Automatic:
  - Notification sent to crew: "Rework needed: [Reason]"
  - SMS to crew lead: "Job [address] needs rework. Check app."
  - Log decision with reason
  - Job moved back to "In Progress" status
Crew sees:   Job marked with rework needed + Areli's notes
Areli notes: Field for specific feedback ("Wipe door handles again", etc.)
Next:        Crew completes rework, re-submits for QA
Recovery:    Rework can be approved on 2nd review or flagged for escalation
```

#### **3. Flag Critical Issue**
```
Action:      Escalate to issue logger for tracking
Automatic:
  - Create issue record with full context
  - Log decision with detailed notes
  - Send notification to Areli (email + SMS): "Critical issue flagged"
  - Add to admin dashboard alert
Areli sees:  Issue appears in Issue Log
Next:        Decide resolution (rework, GC communication, dispute)
Escalation:  May require GC communication or legal documentation
```

#### **4. Skip for Now** (Tomorrow)
```
Action:      Leave card in queue, move to next job
Reason:      Areli wants to review later (batch with manager, etc.)
Card:        Stays in queue with "Pending" status
Reminder:    Optional: "Check back on" date (default: 24h)
Next:        Card remains visible in queue
```

### Photo Gallery Full-Screen View

```
┌─────────────────────────────────────────────────────┐
│  ← Back    [Photo count: 3 of 8]   ✕ Close          │
├─────────────────────────────────────────────────────┤
│                                                     │
│                  [Large photo view]                 │
│                  [Can pan/zoom]                     │
│                                                     │
│ Photo 3: Floors - Cleaned (Timestamp 14:32 UTC)    │
│ GPS: 30.2672°N, 97.7431°W                          │
│                                                     │
├─────────────────────────────────────────────────────┤
│ ← Prev      [Thumbnail strip]     Next →           │
└─────────────────────────────────────────────────────┘
```

---

## ISSUE REPORTING & TRACKING

### Issue Types

| Type | Severity | Example | Impact |
|------|----------|---------|--------|
| **Missed Checklist** | Medium | "Door handle not wiped" | Rework, minor delay |
| **Damage Found** | High | "Paint damage on wall" | Report to GC, rework, potential dispute |
| **Safety Issue** | Critical | "Chemical spill not contained" | Immediate escalation |
| **Site Condition** | Medium | "Client left debris on floor" | Note for GC, rework or customer responsibility |
| **Equipment Issue** | Low | "Vacuum not working properly" | Equipment note for next crew |

### Issue Reporting from Crew (Mobile)

**Crew can flag issues during job:**
```
1. Crew sees unexpected issue (damage, debris)
2. Crew taps "Report Issue" button in mobile app
3. Form appears:
   - Issue type (dropdown)
   - Description (text area)
   - Photo(s) (required - at least 1)
   - GPS location (auto-captured)
   - Timestamp (auto-captured)
4. Crew submits
5. Issue added to job context → appears in QA review card
```

**Issue Card** (What Areli sees in QA queue):
```
⚠️  Paint damage (wall)
Photo: [thumbnail]
Crew note: "Found paint splatter from other trade, not our work"
Location: 30.2672°N, 97.7431°W
Time: 14:32 UTC (March 19, 2026)
Status: Pending decision
```

### Admin Issue Tracking

#### **Issue Log Dashboard**
```
Filters:
  - Status: Open, Resolved, Disputed, Archived
  - Type: Damage, Safety, Site Condition, etc.
  - Date range
  - Crew member
  - Client

View:
  List of all issues with:
  - Issue type + description
  - Job address + date
  - Crew who reported
  - Current status
  - Photos
  - Resolution notes
  - Created/Updated dates

Actions:
  - [Resolve] Mark issue as handled
  - [Add notes] Add decision record
  - [Associate with dispute] Link to GC complaint
  - [Print/Export] For documentation
```

#### **Issue Resolution Workflow**
```
Issue logged:
  Status = "Open"
  ↓
Areli reviews issue:
  Status = "Under Review"
  ↓
Areli makes decision:
  - "Crew reworks" → Job goes back for rework
  - "Noted for GC" → Completion report includes issue context
  - "Documented dispute" → Photo evidence preserved
  - "No action needed" → Resolved
  ↓
Status = "Resolved" + decision documentation
  ↓
Keep in log for future reference
```

### Dispute Documentation

**If GC disputes work quality later:**
```
1. Areli opens QA/Issue log
2. Finds original photos + timestamps + checklist status
3. Evidence shows:
   - What crew submitted (before QA review)
   - What Areli decided (approval or rework)
   - Timestamps (proves work was done on specific date)
   - GPS location (proves crew was at site)
   - Issue flags (if crew reported problem themselves)
4. Areli can respond to dispute with documented proof
```

---

## ADMIN QA DASHBOARD

### Dashboard Views

#### **QA Overview Tab** (First view when admin goes to QA section)
```
Quick Stats:
  - Pending QA reviews: 3
  - Approved today: 7
  - Rework requested: 1
  - Critical issues: 0

Pending Reviews (Queue preview):
  [Card 1: 123 Main St - 4 hours ago]
  [Card 2: 456 Oak Ave - 2 days ago - OVERDUE]
  [Card 3: 789 Pine Dr - 1 hour ago]
  
  [View Full Queue button]

Recent Issues (Last 7 days):
  - "Paint damage found" (March 19) - Resolved
  - "Missed window sill" (March 18) - Resolved
  - "Equipment issue" (March 17) - Resolved
```

#### **QA Review Queue Tab** (Full queue)
```
Queue list (sorted by oldest first - FIFO):
  [Card 1: 456 Oak Ave - OVERDUE (2 days) - Flagged red]
  [Card 2: 123 Main St - 4 hours]
  [Card 3: 789 Pine Dr - 1 hour]

[Start Review] button → Opens full review card
```

#### **Issue Log Tab**
```
Filters:
  - Status (Open, Resolved, Disputed)
  - Type (Damage, Safety, Site, Equipment)
  - Date range
  - Crew member

List of issues:
  [Issue 1: Paint damage - Resolved]
  [Issue 2: Window sill missed - Resolved]
  [Issue 3: Chemical spill - Critical]

Click issue → Full details view with photos + timeline
```

#### **Performance Analytics Tab** (Optional - Phase 3 future)
```
Charts:
  - Approval rate by crew member (%)
  - Rework rate by crew member (%)
  - Average checklist completion rate (%)
  - Common issue types (bar chart)
  - QA review time (average turnaround)

Data export options (CSV for analysis)
```

---

## CREW INTERFACE (MOBILE)

### Job Completion Flow (Crew Mobile)

```
Crew marks job "Complete" (from job status screen)
  ↓
[Completion Submission Form appears]
  ├─ Section 1: CHECKLIST
  │  ├─ Checklist items from job (pre-populated)
  │  ├─ Checkboxes for each item
  │  ├─ Required items must be checked to submit
  │  └─ Notes field (optional)
  │
  ├─ Section 2: PHOTO UPLOAD
  │  ├─ "Take photos" button (opens camera)
  │  ├─ Uploaded photos show with thumbnails
  │  ├─ Can delete individual photos
  │  ├─ Can add captions per photo
  │  └─ GPS + timestamp auto-added to each
  │
  ├─ Section 3: ISSUE REPORTING (optional)
  │  ├─ "Report any issues found"
  │  ├─ Issue type dropdown
  │  ├─ Description field
  │  ├─ Upload issue photo(s)
  │  └─ GPS + timestamp auto-captured
  │
  └─ Section 4: SIGN-OFF
     ├─ Review all above (checklist, photos, issues)
     ├─ Digital signature (or checkbox)
     ├─ Timestamp of submission
     └─ [Submit Completion button]
  ↓
Completion submitted to system
  ↓
QA review card created in Areli's dashboard
  ↓
Crew sees: "Job submitted for review. Check back in 24hrs."
```

### Checklist Completion UI (Mobile)

```
┌─────────────────────────────┐
│ COMPLETION CHECKLIST        │
├─────────────────────────────┤
│ ☐ Vacuum all floors         │
│ ☑ Wipe light switches       │
│ ☐ Clean fixtures            │
│ ☑ Wipe door handles         │
│ ☐ Final inspection          │
├─────────────────────────────┤
│ Progress: 2/5 (40%)         │
│                             │
│ Can't submit until all      │
│ required items checked      │
│                             │
│ [Continue to Photos →]      │
└─────────────────────────────┘
```

### Photo Capture UI (Mobile)

```
┌─────────────────────────────┐
│ PHOTO DOCUMENTATION        │
│ [Take Photo] [Choose File] │
├─────────────────────────────┤
│ Uploaded: 3 photos          │
│                             │
│ [Thumbnail 1] [X delete]    │
│ Floor - kitchen area        │
│ [Timestamp auto]            │
│ [GPS auto]                  │
│                             │
│ [Thumbnail 2] [X delete]    │
│ Fixtures - bathroom         │
│ [Timestamp auto]            │
│ [GPS auto]                  │
│                             │
│ [Thumbnail 3] [X delete]    │
│ Windows - main room         │
│ [Timestamp auto]            │
│ [GPS auto]                  │
│                             │
│ [Add more photos ↓]         │
│ [Continue to Issues →]      │
└─────────────────────────────┘
```

### Issue Reporting UI (Mobile)

```
┌─────────────────────────────┐
│ REPORT ANY ISSUES           │
├─────────────────────────────┤
│ Issue type:                 │
│ [Select: Damage ▼]          │
│                             │
│ Description:                │
│ [Paint splatter on wall...] │
│                             │
│ [Take photo] [Choose file]  │
│ [Photo 1 - Paint damage]    │
│                             │
│ ☐ Skip issues (none found)  │
│                             │
│ [Review and Submit →]       │
└─────────────────────────────┘
```

---

## DATA MODEL & STORAGE

### Database Tables (Supabase)

#### **Checklist Templates**
```sql
CREATE TABLE checklist_templates (
  id UUID PRIMARY KEY,
  name VARCHAR,
  service_type VARCHAR (post_construction, final_clean, etc.),
  version INTEGER,
  created_by UUID (FK to profiles),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  is_archived BOOLEAN,
  description TEXT,
  estimated_time_minutes INTEGER
);
```

#### **Checklist Items**
```sql
CREATE TABLE checklist_items (
  id UUID PRIMARY KEY,
  template_id UUID (FK to checklist_templates),
  title VARCHAR,
  category VARCHAR,
  details TEXT,
  is_required BOOLEAN,
  point_value INTEGER,
  reference_guide_id UUID (FK to resource_library),
  sort_order INTEGER
);
```

#### **Job Checklists** (Crew's completion checklist)
```sql
CREATE TABLE job_checklists (
  id UUID PRIMARY KEY,
  job_id UUID (FK to jobs),
  template_id UUID (FK to checklist_templates),
  created_at TIMESTAMP,
  completed_at TIMESTAMP,
  completed_by UUID (FK to profiles - crew member),
  notes TEXT
);
```

#### **Job Checklist Responses** (Each item checked off by crew)
```sql
CREATE TABLE job_checklist_items (
  id UUID PRIMARY KEY,
  job_checklist_id UUID (FK to job_checklists),
  checklist_item_id UUID (FK to checklist_items),
  is_checked BOOLEAN,
  checked_at TIMESTAMP,
  notes TEXT
);
```

#### **Job Completions** (Photo upload + metadata)
```sql
CREATE TABLE job_completions (
  id UUID PRIMARY KEY,
  job_id UUID (FK to jobs),
  completed_by UUID (FK to profiles - crew member),
  completed_at TIMESTAMP,
  photos_count INTEGER,
  checklist_percent_complete DECIMAL,
  qa_status VARCHAR (pending_review, approved, rework_requested, escalated),
  qa_reviewed_by UUID (FK to profiles - admin),
  qa_reviewed_at TIMESTAMP,
  qa_notes TEXT
);
```

#### **Completion Photos** (Timestamped, GPS-tagged)
```sql
CREATE TABLE completion_photos (
  id UUID PRIMARY KEY,
  job_completion_id UUID (FK to job_completions),
  photo_url VARCHAR (Supabase Storage URL),
  caption TEXT,
  taken_at TIMESTAMP,
  gps_latitude DECIMAL,
  gps_longitude DECIMAL,
  sort_order INTEGER
);
```

#### **Issues** (Flagged problems)
```sql
CREATE TABLE issues (
  id UUID PRIMARY KEY,
  job_id UUID (FK to jobs),
  issue_type VARCHAR (damage, safety, site_condition, equipment),
  severity VARCHAR (low, medium, high, critical),
  description TEXT,
  reported_by UUID (FK to profiles - crew member),
  reported_at TIMESTAMP,
  status VARCHAR (open, under_review, resolved, disputed),
  resolution_notes TEXT,
  resolved_by UUID (FK to profiles - admin),
  resolved_at TIMESTAMP
);
```

#### **Issue Photos**
```sql
CREATE TABLE issue_photos (
  id UUID PRIMARY KEY,
  issue_id UUID (FK to issues),
  photo_url VARCHAR (Supabase Storage URL),
  taken_at TIMESTAMP,
  gps_latitude DECIMAL,
  gps_longitude DECIMAL
);
```

#### **Resource Library**
```sql
CREATE TABLE resource_library (
  id UUID PRIMARY KEY,
  title VARCHAR,
  category VARCHAR (guides, products, safety, policies, examples),
  subcategory VARCHAR,
  content_type VARCHAR (text, photos, video, checklist),
  content TEXT or URL,
  created_by UUID (FK to profiles - admin),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  version INTEGER
);
```

### Storage Buckets (Supabase Storage)

```
Buckets:
├─ completion-photos/
│  ├─ {job_id}/photo_{timestamp}.jpg
│  └─ (Accessible via signed URL)
│
├─ issue-photos/
│  ├─ {issue_id}/photo_{timestamp}.jpg
│  └─ (Accessible via signed URL)
│
├─ resource-library/
│  ├─ guides/{category}/guide_{name}.md or pdf
│  ├─ photos/{category}/photo_{name}.jpg
│  └─ videos/{name}.mp4 (via external CDN preferred)
│
└─ checklist-templates/
   ├─ templates_{id}.json (backup of template structure)
   └─ (Primarily stored in database)
```

### Row Level Security (RLS)

#### **Crew Access**
- Can view only their assigned jobs + checklists
- Can upload photos for their jobs
- Can view resource library (read-only)
- Cannot see other crew's jobs or photos
- Cannot see admin QA decisions or issue logs

#### **Admin/Manager Access**
- Can view all jobs, checklists, photos, issues
- Can view completed crew submissions
- Can create QA decisions
- Full resource library access
- Cannot accidentally delete critical data (soft deletes)

---

## IMPLEMENTATION READINESS

### What Phase 2C Enables

✅ Clear QA workflow (crew → submission → review → approval)  
✅ Checklist template system (reusable, service-specific)  
✅ Resource library organization (guides, examples, policies)  
✅ Issue tracking (documentation trail for disputes)  
✅ Photo evidence capture (GPS, timestamp, metadata)  
✅ Admin review workflow (approve/rework/escalate)  

### Handoff to Phase 3

**Phase 3 will:**
- [ ] Integrate QA module with job lifecycle
- [ ] Create API routes for photo upload/processing
- [ ] Build crew mobile interfaces (form UI components)
- [ ] Build admin QA dashboard pages
- [ ] Connect all workflows end-to-end
- [ ] Set up GPS/timestamp capture mechanisms
- [ ] Configure storage permissions (Supabase RLS)
- [ ] Create completion report generation
- [ ] Set up notifications (crew submission, admin alerts)

### Testing Strategy

**Functional Tests:**
- [ ] Crew completes job → photos upload with metadata
- [ ] Photos appear in Areli's QA queue
- [ ] Checklist shows crew's responses
- [ ] Approval flow works (QA card moves out of queue)
- [ ] Rework request triggers crew notification
- [ ] Issue log persists and is queryable
- [ ] Resource library links work

**Integration Tests:**
- [ ] Crew photo upload → Supabase Storage → QA card display
- [ ] Job completion → QA card creation → admin notification
- [ ] Approval → Completion report generation → GC email
- [ ] Issue reported → Appears in admin issue log → Queryable

**Security Tests:**
- [ ] Crew cannot see other crew's photos
- [ ] Crew cannot mark QA decisions
- [ ] Admin can view all data
- [ ] Photos are served over secure HTTPS

---

**Status:** Ready for Phase 3 (Full Master Spec 2.0 Implementation)  
**Next:** Phase 3 combines Phase 1, 2A, 2B, 2C into comprehensive implementation roadmap with prioritized feature list, timeline, and success metrics

