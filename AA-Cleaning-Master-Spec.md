# A&A Cleaning — Complete Platform Specification
## Consolidated Master Document (v5)
### Updated with Audit & Meta-Audit Recommendations

---

# PART 1: STRATEGIC FOUNDATION

---

## 1.1 What We're Building

This is an operations platform with a professional public face — designed for a B2B subcontractor who has recurring GC relationships, a Spanish-speaking crew of 6–10, and a quality standard that lives entirely in one person's head right now.

The platform does four things:

1. Makes Areli look like a premium vendor to new and existing GCs
2. Replaces text-message job dispatch with a structured work order system
3. Creates a QA layer that lets Areli review work before the GC ever walks through
4. Gives Areli financial visibility and operational control from a single dashboard

---

## 1.2 The Three Users

### Areli (Admin / Quality Director)
- Creates and assigns work orders
- Reviews completion photos and QA checklists
- Manages crew, clients, job history, and finances
- Generates invoices through QuickBooks API integration
- Controls the cleaning resource library and training content
- Onboards new employees through the platform
- Sees the full dashboard: operations, quality, and financial data

### Crew Members (Spanish-first)
- Receive work orders with everything they need
- Update job status (en route → in progress → complete)
- Upload timestamped completion photos
- Flag unexpected site conditions with photo + voice-to-text
- Access step-by-step cleaning guides
- Complete onboarding training and sign-off on SOPs
- Request supplies when running low
- Entire interface is in Spanish by default

### GC / PM Clients (English-first)
- Request new jobs through the portal
- Track job status in real time
- View completion reports with photos and checklists
- See service history across projects
- View invoice status and payment history (pulled from QuickBooks)
- Communicate through location-based job messaging
- This replaces the "text me when it's done" handoff

---

## 1.3 The Job Lifecycle

### Today
```
GC calls/texts Areli
  → She visits the site
    → Sends written estimate (QuickBooks/Excel)
      → Texts crew: address + date + what to clean
        → Crew shows up and does the work
          → GC inspects alone afterward
            → Areli finds out about issues reactively
```

### With the Platform
```
GC submits quote request (website form or phone → Areli enters manually)
  → Lead captured in pipeline, Areli gets immediate SMS: "New lead: [Name] from [Company]. Call [Phone]."
  → Areli calls back within 15 minutes, qualifies the job
  → Areli visits site (if needed) or quotes from description
  → Quote created in platform with line items → branded PDF
  → Quote emailed to GC (+ optional text with link)
  → Follow-up reminders if no response in 3 days
  → GC accepts → Lead converted to client + job created from quote (one click)
  → Areli adds scheduling details, creates work order with:
      - Address, date/time, scope (pre-filled from quote)
      - Site photos
      - On-site contact (super/PM name + number)
      - Specific checklist items
      - Linked cleaning guides for the task types
  → Work order assigned to crew (SMS notification)
  → Crew sees everything in one place (Spanish)
  → Crew marks status updates as they work
  → Crew uploads timestamped completion photos + checklist sign-off
  → Crew flags any unexpected conditions (paint in tub, damage, etc.)
  → Areli reviews photos/checklist BEFORE GC walkthrough
  → Completion report auto-generated for GC portal
  → GC sees: photos, checklist status, any flagged issues + how they were handled
  → Job closes → Invoice auto-generated and pushed to QuickBooks
  → Job goes into service history, financial data updates dashboard
```

The key shift: Areli goes from reactive to proactive. The GC never finds a surprise she didn't already know about. And Areli sees her financial picture in real time without switching between tools.

---

## 1.4 User Tech Profiles

### Areli (Admin)
- **Primary device:** Uses phone at job sites. TBD whether heavier admin tasks (job setup, review, invoicing) are done on phone or laptop.
- **Current tools:** Phone calls, text messages, QuickBooks Online (subscription active), email (AAcleaningservices@outlook.com)
- **Tech comfort level:** Manages current workflow via phone/text efficiently. Web dashboard experience unknown.
- **Key constraint:** Already running the entire business solo. Platform must save time, not add administrative burden.
- **Critical insight:** If the platform creates more work than it saves in the first 2 weeks, she will revert to texting.
- **Lead workflow:** Prefers to call potential clients first — can provide additional info, scope the work, discuss timelines and pricing, and offer to visit the job site.
- **Invoicing cadence:** Weekly — whatever work is done by that week gets invoiced. Monthly billing cycles for some clients. Construction invoicing sometimes goes through GC portals/websites.

### Crew Members
- **Primary device:** Android smartphones (verify models/age of devices)
- **Data plans:** TBD — Confirm all crew have data plans with sufficient coverage at job sites
- **Tech comfort level:** Comfortable with texting, WhatsApp, basic phone camera
- **Language:** Spanish-first. English toggle available but Spanish is default.
- **Key constraint:** High-paced work environment. Any verification process must take <30 seconds.
- **Critical insight:** They currently receive a text with an address and show up. Asking them to use an app is a behavioral change. Some will resist.

### GC / PM Clients
- **Primary device:** Mix of phone and desktop
- **Current interaction:** Phone calls and texts to Areli
- **Tech comfort level:** Varies. Many PMs use construction management software; some prefer phone calls.
- **Key constraint:** They are not the end customer — A&A serves them, not the other way around.
- **Critical insight:** There is no evidence GCs want or would use a portal. This must be validated before building.

---

## 1.5 Success Metrics & Launch Criteria

### MVP Launch Criteria (Phase 1)
The MVP is "done" when:
- Areli can create a work order in under 2 minutes
- Work order is assigned to a crew member who receives an SMS notification
- Crew member can view job details, update status, and upload timestamped photos from their phone
- Areli can view completed job with photos in her dashboard
- Public site is live with working quote request form (every page has CTA)
- New leads trigger immediate SMS to Areli with contact info
- Areli can view leads in a pipeline, create and send branded quotes, and convert won leads to clients + jobs

### Success Signals by User (30/60/90 Day Reviews)

**For Areli:**
- Creates work orders through platform (not reverting to texts)
- Reviews completed work without visiting the site
- Finds issues before GCs do (proactive vs. reactive)
- Spends less total time on admin after initial learning curve
- Checks the dashboard regularly
- Calls back new leads within 15 minutes during business hours
- Creates and sends quotes through the platform (not Excel/email)
- Converts leads to jobs without re-entering information

**For Crew:**
- Opens the app on job day without reminder
- Updates status without being prompted
- Takes photos voluntarily (not only when forced)
- Uses issue reporting when needed
- Completion takes <60 seconds (target: 30 seconds)

**For GCs:**
- (If portal built) Logs in and views completion reports
- Mentions the professionalism/technology positively
- Refers other GCs partly because of the technology
- If no portal: Opens completion report emails, provides positive feedback

---

## 1.6 First-Run Experience Design

When Areli logs in for the first time, the dashboard should not show empty charts and a blank interface. It should provide guided onboarding:

```
First-Run Wizard (MVP):
├── Welcome screen with 30-second video overview
├── Step 1: Add your first client (form with minimal required fields)
├── Step 2: Create your first job (pre-populated sample she can edit)
├── Step 3: Assign it to herself or a crew member (shows SMS preview)
└── Done: Dashboard now has real data to display
```

**Pre-populated sample data:**
- One sample client ("Example Construction Co")
- One sample job (marked as "Sample — Delete or edit me")

**Note:** Checklist templates are Phase 2. For MVP, jobs use free-text scope descriptions. The first-run wizard will be extended in Phase 2 to include "Create a checklist template" step.

This ensures Areli's first interaction shows her the platform working, not an empty shell.

---

## 1.7 Fallback & Degradation Plan

If the platform is down, Areli's business must continue. The platform replaces her text-message workflow, but she needs a fallback.

### Critical Principle
The platform should never be a single point of failure. Areli must always be able to fall back to her pre-platform workflow (phone calls and texts) if the system is down.

### Architecture Note on Notifications
SMS dispatch is triggered by API routes hosted on Vercel. If Vercel is down, **new SMS notifications will not be sent** until service is restored. This is a known limitation of the current architecture.

**Mitigation options for future consideration:**
- Decouple notification dispatch to a separate service (e.g., Supabase Edge Functions with Twilio)
- Use a queue service (e.g., Inngest, QStash) that can retry independently of Vercel

For MVP, accept this limitation and rely on manual fallback.

### Fallback Procedures

| Scenario | Impact | Fallback |
|---|---|---|
| Supabase database outage | Cannot create jobs or view data | Areli texts crew directly as before. Resume platform use when restored. |
| Vercel deployment down | Web app inaccessible, **no new SMS sent** | Areli texts or calls crew directly. Existing job data is still in Supabase (accessible when Vercel recovers). |
| Twilio SMS failure | Crew doesn't receive job notifications | Admin dashboard shows "SMS failed" alert. Areli calls or texts manually. |
| Photo upload fails (bad signal) | Completion verification delayed | App stores photo locally (IndexedDB), retries automatically. "Pending upload" indicator visible. |
| QuickBooks API unreachable | Invoice generation fails | Job workflow continues. Invoices queued and pushed when API recovers. |

### Data Export
Areli should always be able to export her data:
- One-click export of all jobs (CSV/Excel)
- One-click export of client list
- Photo storage accessible via direct Supabase Storage URLs

---

# PART 2: FRICTION ANALYSIS

---

## 2.1 Friction Points from Discovery Context

**F1: Areli is the only quality standard**
Her detail-oriented approach is the product, but it lives entirely in her head. If she's not on-site, quality is unpredictable. Every new hire learns by shadowing her — there's no system.
→ Solves with: Cleaning Resource Library (documented SOPs), Checklist Templates, QA Review Queue, Onboarding/Training Modules

**F2: No feedback loop with crew**
Workers complete a job and move on. She has no way to know if something went wrong unless the GC complains. Workers may notice issues (paint in a tub, damage from other trades) but have no structured way to report them.
→ Solves with: Issue Reporting (photo + description), Completion Checklists, Status Updates, Location-Based Job Messaging

**F3: Blind handoff to GCs**
The GC inspects alone. If there's a problem, Areli finds out after the fact — as a complaint. She can't get ahead of it.
→ Solves with: QA Review (Areli reviews before GC sees), Completion Reports with timestamped photos, Proactive issue documentation

**F4: No intake process for new leads — and no follow-up pipeline**
When a new GC or PM reaches out, there's no structured way to capture what they need. It's a phone call, maybe a text. Info gets lost, follow-up is inconsistent. Worse, there's no system to track which leads have been called back, which have been quoted, and which went cold. In construction, the first sub to return the call usually gets the job — a 24-hour response window means the lead is already gone.
→ Solves with: Quote Request Form (public site), Immediate SMS Alert to Areli, Lead Pipeline with status tracking (admin dashboard), Quote Creation with PDF delivery, Follow-up Reminders (automated nudges to call/follow up), One-click Lead-to-Client-to-Job Conversion

**F5: Knowledge transfer bottleneck**
She can't step back into a Quality Director role if every new hire needs her physically present to learn the standards. Training is 1:1, verbal, and time-consuming.
→ Solves with: Resource Library with step-by-step guides, photo examples (correct/incorrect), video walkthroughs, product lists, structured onboarding flow

**F6: No visibility into crew performance over time**
She doesn't know which workers are consistently thorough vs. which ones cut corners — unless she's there watching.
→ Solves with: Analytics (completion rates, checklist adherence, issue flags per worker, visualizations with export)

**F7: Scheduling is manual and fragile**
Job assignments happen via text. If someone is sick or unavailable, there's scrambling. No calendar view, no conflict detection, no reassignment history.
→ Solves with: Calendar/Scheduling View, Crew Availability Tracking, Drag-and-drop Reassignment

**F8: No documentation trail for disputes**
If a GC disputes work quality or claims something wasn't done, Areli has no proof. It's her word against theirs.
→ Solves with: Timestamped completion photos, Signed-off checklists, Issue logs with resolution notes

**F9: Inventory blind spots**
She doesn't track cleaning supply usage per job or per site. Workers may run out of product mid-job, or she may be over-buying without realizing it.
→ Solves with: Inventory Management Module (supply requests, usage logging, stock alerts)

**F10: Financial opacity**
Areli manages finances through QuickBooks separately from operations. She can't easily see which clients are most profitable, which jobs are costing more than expected, what her cash flow looks like, or whether invoices are getting paid on time — all without switching between tools and doing mental math.
→ Solves with: Financial Dashboard (QuickBooks API integration), Revenue tracking per client, Expense tracking per job, Cash flow visibility, Invoice status monitoring

**F11: Poor client communication**
GCs don't know when work is happening, when it's done, or what was done. They have to call or text to find out. This creates unnecessary back-and-forth and makes Areli look less professional than she is.
→ Solves with: Client Portal (status visibility), Location-Based Job Messaging, Automated completion notifications, Weekly summary emails

**F12: Worker classification risk**
The original discovery notes mention needing documentation for independent contractor status. If the platform treats workers as "employees" without proper legal structure, there's liability exposure.
→ Solves with: Legal consultation (outside the platform — shelved for now), platform designed to be flexible for either relationship

**F13: Platform adoption overhead**
The platform adds a new set of tasks for Areli: creating work orders in the system, reviewing QA photos, managing the resource library, responding to job messages, reviewing analytics. If the platform creates more work than it saves in the early days, adoption will fail. She already runs the entire business solo — visits sites, assigns crew, handles client calls, does the work herself sometimes, manages finances. Adding administrative overhead without immediate time savings will cause her to revert to texting.
→ Solves with:
- Batch operations (assign multiple crew, create recurring jobs)
- Templates that minimize data entry
- "Quick mode" for job creation with only 3-4 required fields
- Phased adoption plan that doesn't require using all features on day one
- Explicit measurement of time spent in platform vs. previous workflow
- First 30 days: only use job creation + assignment + photo review
- Days 31-60: add checklists, QA review, resource library
- Days 61+: add financial features, analytics, advanced features

**F14: Crew adoption friction**
Construction cleaning crews who currently receive a text with an address and show up — asking them to log into an app, update statuses, take specific photos, and fill checklists is a behavioral change. Some will resist. Some may not have reliable smartphones. Some will forget passwords or struggle with the interface.
→ Solves with:
- Phone OTP authentication (no passwords to remember — crew enters phone, receives code, taps to verify)
- Ultra-simple onboarding flow (single walkthrough, <5 minutes)
- Admin override option (Areli can update job status on behalf of crew if needed)
- SMS fallback for crew who won't/can't use the app
- Gradual feature rollout:
  - Week 1-2: Status updates only (3 big buttons)
  - Week 3-4: Add photo upload
  - Week 5+: Add checklists, issue reporting
- Identify 1-2 tech-comfortable crew members as early adopters/champions
- Crew smartphone audit before launch (verify devices, data plans)

---

## 2.2 Industry-Standard Friction Points

These are problems the SaaS research consistently surfaces across cleaning businesses. Included here for reference — several overlap with the above and are already being addressed.

- Scheduling chaos / double-booking (addressed by F7)
- No-shows and clock-in verification (future expansion: geofenced clock-in)
- Language barriers with multilingual crews (addressed by bilingual-first design)
- Supply management / stockouts (addressed by F9)
- Quality inconsistency across sites (addressed by F1, F2, F3)
- Slow invoicing and payment collection (addressed by F10)
- Poor client communication (addressed by F11)
- High turnover / training costs (addressed by F5, onboarding module)
- No data for contract renewals (addressed by analytics + financial dashboard)
- Fragmented tools (addressed by the platform itself — consolidation)

---

# PART 3: FEATURES TO BUILD

---

## 3.0 MVP Scope Definition

### The Core Problem with the Original Scope
The original spec describes a platform that competes functionally with Swept, Connecteam, Jobber, and JanitorialManager — products built by teams of 20-50+ engineers over years. A solo developer building admin + employee + client portals with QA workflows, financial dashboards, resource CMS, inventory tracking, location-based messaging, analytics, a bilingual AI chatbot, and QuickBooks OAuth2 integration is not a timeline problem. It is a scope problem.

### The MVP Principle
A platform that does 5 things at 95% quality will earn more trust than one that does 25 things at 60% quality.

### True MVP Scope (Weeks 1-8)
Ship a platform that Areli uses every day within 8 weeks. Everything else is a later phase.

**In Scope for MVP:**
- Public website (landing page, quote request form, employment application, about page)
- Booking & quote pipeline (lead capture → SMS notification → lead list → quote creation → PDF delivery → lead-to-client conversion)
- Admin dashboard (create jobs, assign crew, view job list with status filters, lead pipeline, notification center)
- Employee portal (view jobs in Spanish, status updates, timestamped photo upload, issue reporting)
- SMS notifications for job assignment AND new lead alerts (Twilio)
- Auth with Phone OTP for crew (via Twilio — see Auth Strategy in 5.1)
- Follow-up reminders for uncalled leads (1-hour and 4-hour SMS alerts)

**Explicitly NOT in Scope for MVP:**

This table is the **authoritative phasing reference**. All other phase mentions in this document should align with these assignments.

| Feature | Why Deferred | Phase |
|---|---|---|
| QA review queue | Areli reviews by looking at photos in admin dashboard — same function, less code | Phase 2 |
| Checklist templates | Use free-text scope description for now | Phase 2 |
| Location-based messaging | Simple notes field on job for now | Phase 2 |
| Client portal | Validate demand first with GC interviews (see 8.2 #7) | Phase 3 (if validated) |
| Resource library CMS | Launch with shared Google Doc of guides linked from platform | Phase 3 |
| Onboarding module | Existing crew doesn't need it — they know the work | Phase 3 |
| Financial dashboard | Use QuickBooks directly for now | Phase 4 |
| Analytics dashboard | Not enough data yet — need 60-90 days of operations | Phase 4 |
| Calendar with drag-and-drop | Admin list view with filters is sufficient for early phases | Phase 5 |
| Inventory management | Nice-to-have, not blocking for core workflow | Phase 5 |
| AI chatbot | Polish feature, not core operations | Phase 5 |

This MVP tests the core hypothesis: **Does structured job dispatch and photo-based completion reporting make Areli's operation visibly better than text messages?**

---

## 3.1 Confirmed Features (Full Vision)

### From SaaS Cross-Reference

**Note:** Phase assignments below align with the authoritative MVP Scope table in Section 3.0.

| Feature | Source Inspiration | Phase |
|---|---|---|
| Timestamped photo capture during job completion | Swept | Phase 1 (MVP) |
| Problem reporting from the field | Swept | Phase 1 (MVP) |
| Client-ready inspection/completion reports (PDF/email/link) | Swept, Jobber | Phase 2 |
| Location-based job messaging | Swept | Phase 2 |
| Read-and-sign forms (SOPs, safety acknowledgments) | Connecteam | Phase 2 |
| Checklist templates | Swept, Connecteam | Phase 2 |
| Client portal (status, reports, history, invoices) | Jobber | Phase 3 (if demand validated) |
| Training modules for onboarding | Connecteam | Phase 3 |
| Supply management (request, track, reorder) | Swept, JanitorialManager | Phase 5 |
| Quote creation + PDF delivery | Jobber | Phase 1 (MVP) |
| Lead pipeline with follow-up reminders | Custom | Phase 1 (MVP) |
| Lead-to-client-to-job conversion | Custom | Phase 1 (MVP) |
| Automated quote-to-invoice flow | Jobber + QuickBooks API | Phase 4 |

### Future Expansion (Not in v1 Scope)

| Feature | Notes |
|---|---|
| Geofenced clock-in/out | Interesting but not needed now — add when crew grows |
| Inspection scoring with level-based ratings | Could layer onto QA system later |
| Batch invoicing | Useful at scale, QuickBooks handles this natively |
| Contract management with renewal tracking | Phase 4+ when she has more GC accounts |
| Offline mobile app mode | Worth revisiting based on crew feedback about cell signal at sites |

---

## 3.2 Ticketing / Work Order System

### Projects vs. Jobs Architecture

Construction cleaning jobs aren't always single-visit. A large post-construction project might span 3 days across 12 units. The data model needs to support this reality.

**Projects:** The GC's overall scope (e.g., "Building X Final Clean — 12 units")
**Jobs:** Individual work assignments within that project (e.g., "Unit 4A — Day 1")

This hierarchy enables:
- Project-level profitability tracking
- Multi-day job groupings
- Per-unit assignment for large builds
- Cleaner GC communication ("Your project is 75% complete" vs. "Job #47 is done")

**Simpler Alternative for MVP:** A "group" or "tag" field on jobs that lets Areli link related jobs together informally. This gives 80% of organizational benefit with 20% of implementation cost. Formal project entity can come in Phase 2 if grouping proves useful.

### The "30-Second Completion" Target

The crew should be able to mark a job complete with verification in under 30 seconds. The flow differs by phase:

**Phase 1 (MVP) — Photo-Based Completion:**
```
Job screen → Tap "Completado"
  → Camera opens → Take 3-5 photos (tap-tap-tap, no captions required)
  → Any issues? → "No" (single tap) or "Sí" → quick photo + voice-to-text note
  → Submit → Done
```
No checklists in MVP. Areli reviews photos directly in admin dashboard.

**Phase 2+ — Checklist-Based Completion:**
```
Job screen → Tap "Completado"
  → Camera opens → Take 3-5 photos (tap-tap-tap, no captions required)
  → Checklist appears → Tap checkmarks (pre-populated from template)
  → Any issues? → "No" (single tap) or "Sí" → quick photo + voice-to-text note
  → Submit → Done
```
Checklist items are pre-loaded from the job template. Areli reviews via QA queue.

### Design Principles
- Swipe-based navigation between steps (no scrolling through long forms)
- Camera is the primary input — minimize typing
- Voice-to-text for issue descriptions (faster than typing in Spanish on a phone)
- One-tap status transitions (big, color-coded buttons)
- No mandatory fields that aren't strictly necessary
- Auto-save progress — if the app crashes, nothing is lost
- All photos are automatically timestamped with date, time, and GPS coordinates

### For Areli's Side (Assigning Work Orders)

**Phase 1 (MVP):**
- Quick-mode job creation (title, client, address, date — 4 fields)
- Duplicate previous job (for recurring GC sites — one tap to create a new instance)
- Batch assignment (assign multiple crew members to the same job simultaneously)
- Job list with filters (by status, date, client)

**Phase 2+:**
- Template-based job creation (select a template → auto-populates checklist, guides, estimated time)

**Phase 5:**
- Quick-edit mode for weekly adjustments (drag-and-drop on calendar view)

### The ticket system must be intuitive and free-flowing. Workers can't spend 5-10 minutes on verification — this is a high-paced industry. The process needs to be cost-effective in terms of time spent. Start with the base structure, then expand categories based on Areli's direct experience after she sees it in action.

### Camera/Photo Technical Spike (Required Before Building)

PWA camera access on Android is inconsistent across devices and browsers. Photo compression, GPS metadata extraction, and upload-on-spotty-signal are each individually complex. Combined, on an older Android phone over a construction-site cell connection, this is the single most technically challenging feature in the platform.

**Week 1-2 Requirement:** Build a standalone test page that:
1. Opens the camera via PWA
2. Captures a photo
3. Compresses it client-side (browser-image-compression library)
4. Extracts GPS and timestamp metadata
5. Uploads to Supabase Storage

**Test this on at least 3 actual Android phones that crew members use.** If it doesn't work reliably, the entire 30-second completion flow collapses and the UX needs to be redesigned before building anything else.

**EXIF Rotation Testing (Critical):**
Many Android phones store photos in landscape orientation with EXIF rotation metadata telling viewers how to display them. If the upload pipeline strips EXIF data or the display code ignores it, photos will appear sideways or upside-down. The camera spike MUST test:
- Take a photo in portrait orientation
- Upload it
- Display it in the completion report preview
- Verify it renders right-side-up
If rotation is broken, either: (a) rotate the image server-side before storage using the EXIF orientation tag, or (b) apply CSS transforms based on stored EXIF data. Test on both iOS and Android devices.

---

## 3.2.1 Notification Preferences

### The Problem
If Areli creates 5 work orders at 10 PM on Sunday for Monday morning, her crew gets 5 text messages at 10 PM. No one wants that.

### Notification Settings Per User

```
notification_preferences (JSONB field on users table)
  - quiet_hours_start: "21:00"
  - quiet_hours_end: "07:00"
  - batch_job_notifications: true  // "You have 3 new jobs" instead of 3 separate SMS
  - sms_enabled: true
  - email_enabled: false  // Crew typically doesn't use email
  - notification_summary_time: "06:00"  // When to send batched notifications
```

### Implementation

**For MVP:** Implement quiet hours only. Messages queued during quiet hours are sent at 7 AM.

**For Phase 2:** Add batch notifications and per-channel toggles.

### Admin Controls
Areli can:
- Override quiet hours for urgent jobs ("Send SMS now regardless of time")
- See notification delivery status in admin dashboard
- Manually trigger re-send if SMS fails

---

## 3.2.2 Booking & Quote Pipeline

### The Problem

The spec describes a leads table and an intake form, but there is no defined process between "a lead comes in" and "Areli creates a work order." Today, a GC calls or texts Areli, she visits the site, sends a quote from QuickBooks or Excel, and eventually the job either happens or doesn't. Nothing is tracked. Follow-up is ad hoc. There is no quote history, no conversion tracking, and no structured way to close.

This section defines the full pipeline from website inquiry to booked job — designed for Areli's real workflow where **phone calls close deals, not email threads.**

### The Pipeline

```
Website visitor submits quote request (or calls directly)
  → Lead captured in system (leads table)
  → Areli gets IMMEDIATE notification (SMS + dashboard alert)
  → Areli calls the lead back (target: within 15 minutes during business hours)
  → During the call, Areli qualifies:
      - What kind of job? (post-construction, final clean, etc.)
      - Where? (address or general area)
      - When? (timeline / urgency)
      - How big? (units, square footage, or general scope)
      - Who's the contact on-site?
  → Areli decides: site visit needed, or can quote from description?
  → Quote created in platform (linked to lead record)
  → Quote delivered: email with PDF + optional text with link
  → Lead follows up or Areli follows up (system tracks follow-up status)
  → Lead accepts → Areli converts to client + creates first job (one click)
  → Lead declines or goes cold → marked accordingly, stays in history
```

### Why Phone-First

Construction cleaning is a relationship business. GCs don't want to fill out a form and wait for an email. They want to talk to someone who sounds like they know what they're doing. Areli is that person. The website's job is to get her the phone call — everything else is support.

**The form doesn't close the deal. Areli's voice closes the deal.**

The platform's role is:
1. Capture the inquiry so nothing falls through the cracks
2. Alert Areli instantly so she can call back before the GC calls someone else
3. Track the pipeline so she knows who she's talked to and what was quoted
4. Make quote creation fast so she's not spending 30 minutes on a spreadsheet

### Website Quote Request Flow

The public website intake form is the primary digital entry point. It should feel quick and low-friction — not like filling out a government application.

**Form Fields (MVP):**

| Field | Required | Why |
|---|---|---|
| Name | Yes | Who to call back |
| Company | Yes | Identifies the GC |
| Phone | Yes | Primary follow-up channel |
| Email | No | For sending the quote PDF later |
| Type of service needed | Yes | Dropdown: Post-Construction, Final Clean, Rough Clean, Window Cleaning, Floor Care, Other |
| Brief description | No | Free text — "12-unit apartment, 3 floors, new build" |
| Timeline | No | Dropdown: ASAP, This week, Next 2 weeks, Next month, Just getting quotes |
| How did you hear about us? | No | Referral tracking |

**Form Behavior:**
- Submit → Thank you message: "We'll call you within the hour during business hours."
- Submit triggers immediate SMS to Areli: "New lead: [Name] from [Company] — [Service Type]. Call [Phone]."
- Submit also triggers dashboard notification with full details
- If submitted outside business hours (before 7 AM or after 7 PM), SMS still sent but message says: "New lead received — will follow up first thing in the morning."
- Lead auto-created in leads table with status = `new`

**CTA Placement on Website:**
- Every page has a persistent "Get a Quote" button in the header/nav
- Hero section CTA: "Request a Quote" (form) + "Call Now: [phone number]" (click-to-call on mobile)
- Services pages: CTA after each service description
- Footer: Phone number prominently displayed + quick form link

### Lead Notification & Response Targets

| Scenario | Notification | Response Target |
|---|---|---|
| Form submitted during business hours (7 AM–7 PM) | SMS + dashboard alert immediately | Call back within 15 minutes |
| Form submitted outside business hours | SMS immediately, queued dashboard alert | Call back by 8 AM next business day |
| Phone call comes in directly (no form) | Areli answers live or returns call | Immediate or within 30 minutes |
| Referral from existing GC | Areli enters lead manually | Call same day |

**Why immediate matters:** In construction, the GC is often calling 2-3 subs at once. The first one who picks up or calls back gets the conversation. A 24-hour email response loses to a 10-minute callback every time.

### Lead Pipeline (Admin Dashboard)

Areli sees a pipeline view in her dashboard — not a CRM, just a clear list of where every lead stands:

```
Lead Pipeline View:
┌──────────────────────────────────────────────────────────────┐
│  NEW (3)  │  CONTACTED (2)  │  QUOTED (4)  │  WON (1)  │  LOST (0)  │
├───────────┼─────────────────┼──────────────┼───────────┼────────────┤
│ ● Smith   │ ● Reyes Bros    │ ● Turner GC  │ ● Apex    │            │
│   Const.  │   Called 3/1    │   $4,200     │   Build   │            │
│   2 hrs   │   Site visit    │   Sent 2/28  │   Signed  │            │
│   ago     │   scheduled     │   Follow up  │   3/1     │            │
│           │                 │   tomorrow   │           │            │
│ ● Davis   │ ● Hill PM       │ ● Oak Creek  │           │            │
│   Builders│   Voicemail     │   $1,800     │           │            │
│   45 min  │   2/28 — call   │   Sent 3/1   │           │            │
│   ago     │   back tomorrow │   Waiting    │           │            │
└───────────┴─────────────────┴──────────────┴───────────┴────────────┘
```

**Lead Statuses (updated from data model):**

| Status | Meaning | Next Action |
|---|---|---|
| `new` | Just came in, hasn't been touched | Call them NOW |
| `contacted` | Areli has spoken to them | Schedule site visit or create quote |
| `site_visit_scheduled` | Site visit on the calendar | Visit, assess, create quote |
| `quoted` | Quote sent, waiting for response | Follow up if no response in 2-3 days |
| `won` | They said yes | Convert to client + create job |
| `lost` | They went with someone else or project cancelled | Log reason, move on |
| `dormant` | No response after multiple follow-ups | Check back in 30 days |

### Quote Creation Flow

When Areli is ready to quote (either from a phone call assessment or after a site visit):

**Phase 1 (MVP) — Simple Quote:**
```
Admin Dashboard → Lead record → "Create Quote"
  → Pre-filled from lead info (company, contact, service type)
  → Areli adds:
      - Job scope description
      - Line items (description + price per item)
      - Total price
      - Notes / conditions
      - Validity period (default: 30 days)
  → Preview → Send
  → Quote emailed as branded PDF to lead's email
  → Optional: Text lead a link to view quote online
  → Lead status auto-updates to "quoted"
  → Follow-up reminder auto-set for 3 days later
```

**Quote Data Model Addition:**

```sql
-- QUOTES (links leads to potential jobs)
quotes
  - id
  - lead_id (FK to leads)
  - client_id (FK to clients, nullable — set if lead already converted)
  - quote_number (auto-generated: Q-2026-001)
  - status (draft | sent | viewed | accepted | declined | expired)
  - site_address
  - scope_description
  - valid_until (date)
  - subtotal, tax_amount, total
  - notes
  - quickbooks_estimate_id (nullable — for QB sync in Phase 4)
  - sent_at, viewed_at, responded_at
  - created_by, created_at, updated_at

quote_line_items
  - id
  - quote_id (FK to quotes)
  - description
  - quantity (decimal)
  - unit (unit | sqft | hour | flat)
  - unit_price (decimal)
  - line_total (computed: quantity × unit_price)
  - sort_order
```

**Quote PDF Template:**
```
┌─────────────────────────────────────────────────────────────┐
│ [A&A Logo]                                    ESTIMATE      │
│ ═══════════════════════════════════════════════════════════│
│                                                             │
│ Quote #: Q-2026-001                                         │
│ Date: March 2, 2026                                         │
│ Valid Until: April 1, 2026                                  │
│                                                             │
│ Prepared For:                                               │
│ [Company Name]                                              │
│ [Contact Name]                                              │
│ [Email] | [Phone]                                           │
│                                                             │
│ ─── SCOPE OF WORK ──────────────────────────────────────── │
│ [Description of work to be performed]                       │
│                                                             │
│ ─── LINE ITEMS ─────────────────────────────────────────── │
│ Description              Qty    Unit    Price     Total     │
│ Post-construction clean  12     unit    $350      $4,200    │
│ Window detail            12     unit    $75       $900      │
│ Floor polish             12     unit    $125      $1,500    │
│                                                             │
│                                        Subtotal: $6,600    │
│                                        Tax:      $0        │
│                                        TOTAL:    $6,600    │
│                                                             │
│ ─── NOTES ──────────────────────────────────────────────── │
│ [Any conditions, timeline commitments, or special terms]    │
│                                                             │
│ ═══════════════════════════════════════════════════════════│
│ A&A Cleaning | [phone] | [email] | [website]               │
│ Licensed & Insured                                          │
└─────────────────────────────────────────────────────────────┘
```

### Quote → Job Conversion (One Click)

When a lead accepts a quote:

```
Lead Pipeline → Lead card → "Won — Convert to Client"
  → System checks: Does this company already exist in clients table?
      - Yes → Link to existing client
      - No → Create new client record (pre-filled from lead data)
  → "Create Job from Quote" button appears
      - Job pre-populated with: client, address, scope, line items → estimated_cost
      - Areli adds: scheduled date, crew assignment
      - Job created with status = "draft" or "assigned"
  → Lead status → "won", converted_to_client_id set
  → Quote status → "accepted"
```

This eliminates double data entry. The lead's info flows into the client record, the quote's scope flows into the job, and nothing gets re-typed.

### Follow-Up System

The biggest leak in any service business is leads that go quiet. The platform should prevent this:

**Automated Follow-Up Reminders:**

| Trigger | Reminder | Channel |
|---|---|---|
| Lead status = `new` for > 1 hour (business hours) | "You have an uncalled lead: [Name]" | SMS to Areli |
| Lead status = `new` for > 4 hours (business hours) | "URGENT: Lead [Name] still uncalled" | SMS to Areli |
| Quote sent, no response in 3 days | "Follow up on quote for [Company]" | Dashboard alert |
| Quote sent, no response in 7 days | "Quote for [Company] may be going cold" | SMS to Areli |
| Lead status = `contacted`, no update in 5 days | "Update status on [Company] lead" | Dashboard alert |
| Lead marked `dormant` for 30 days | "Check back on [Company]?" | Dashboard alert |

**These are nudges, not automations.** The system doesn't email the lead automatically — it reminds Areli to make the call herself. She is the closer.

### MVP Scope for Booking Pipeline

**In MVP (Phase 1):**
- Quote request form on public website
- Lead notification (SMS to Areli on form submit)
- Lead list in admin dashboard with status tracking
- Basic lead detail view (contact info, message, status, notes)
- Manual status updates (new → contacted → quoted → won/lost)
- Simple quote creation with line items and PDF generation
- Quote delivery via email
- One-click lead → client conversion
- Follow-up reminders (1-hour and 4-hour uncalled lead alerts)

**Phase 2:**
- Quote viewed tracking (email open / link click)
- Enhanced pipeline view (kanban-style board)
- Quote templates for common job types
- Follow-up reminder customization
- QuickBooks estimate sync

**Phase 4:**
- Full quote-to-invoice automation via QuickBooks API
- Lead source analytics (which channels produce the most revenue)
- Conversion rate tracking
- Revenue attribution per lead source

### How This Fits Into the Website

The website is not a brochure — it's a lead capture machine. Every page funnels toward two actions:

1. **Call Areli directly** (click-to-call on mobile, phone number on desktop)
2. **Submit a quote request** (form that triggers the pipeline above)

```
Website Architecture (Lead-Focused):
┌──────────────────────────────────────────────────────────────┐
│ Header: Logo | Services | About | Employment | GET A QUOTE  │
├──────────────────────────────────────────────────────────────┤
│ Hero Section                                                 │
│ "Standards-driven facility care for construction pros."      │
│ [Request a Quote]  [Call Now: (512) XXX-XXXX]               │
├──────────────────────────────────────────────────────────────┤
│ Services Overview (cards for each service type)              │
│ Each card → individual service page with CTA                 │
├──────────────────────────────────────────────────────────────┤
│ Social Proof (testimonials, GC logos if permitted)           │
├──────────────────────────────────────────────────────────────┤
│ Process Section: "How It Works"                              │
│ 1. Request a quote  2. We assess  3. We clean  4. You walk  │
├──────────────────────────────────────────────────────────────┤
│ Quote Request Form (inline or modal)                         │
├──────────────────────────────────────────────────────────────┤
│ Footer: Phone | Email | Address | Instagram | LinkedIn      │
└──────────────────────────────────────────────────────────────┘
```

The website exists to make Areli's phone ring and her lead pipeline fill up.

---

## 3.3 Location-Based Job Messaging

### What This Means
All communication is tied to a specific job/site rather than floating in a general text thread. When Areli, a crew member, or a GC sends a message, it's attached to the job record. Anyone involved in that job can see the full conversation history.

### How Difficult Is This to Build?

Not very difficult technically — it's essentially a chat thread scoped to a job ID. The data model is straightforward:

```
job_messages
  - id, job_id, sender_id, message_text
  - photo_url (optional — for sending photos in-thread)
  - created_at
  - read_by (array of user IDs who have seen it)
```

The UI is a simple message thread inside each job's detail page. Crew sees it in Spanish, GC sees it in English, Areli sees everything.

### Should You Use an API?

For v1, building a simple messaging system in-house is the right call. It's just database writes + Supabase real-time subscriptions for live updates. No external API needed.

If communication volume grows significantly, or if you want features like read receipts, typing indicators, file sharing, and threaded replies, you could integrate a service like:
- **Stream Chat** (~$0 for <25 MAU, scales from there) — purpose-built chat API
- **Twilio Conversations** — if you want SMS + in-app messaging unified

But for a crew of 6-10 and a handful of GC clients, a custom-built solution is simpler and cheaper. Plan the data model now, and the messaging API can be swapped in later without changing the UX.

### Notifications
When a message is posted to a job thread:
- Crew members assigned to that job get an SMS (Twilio)
- Areli gets a push notification / dashboard alert
- GC gets an email notification with a link to the portal

### Email Deliverability (Critical for GC Communications)

If emails to GCs land in spam, they never see completion reports, which undermines the entire client communication value proposition.

**Phase 1 Checklist:**
- Configure SPF record on domain DNS
- Configure DKIM signing via Resend
- Configure DMARC policy
- Send test emails to Gmail, Outlook, and Yahoo addresses — verify inbox delivery, not spam
- Use Resend's sending infrastructure with proper authentication

**Ongoing:**
- Monitor bounce and complaint rates in Resend dashboard
- Maintain low complaint rate (<0.1%) to preserve sender reputation

**New Domain Reputation Warning:**
New domains (or domains that have never sent bulk email) start with zero reputation. Spam filters are aggressive with unknown senders. Expect the first 30-60 days to be rocky. Mitigations:
- Send initial emails slowly (not 50 at once on day one)
- Start with engaged recipients who are likely to open/click
- Consider using a subdomain (e.g., `app.aacleaningny.com`) for transactional email so any reputation issues don't taint the main domain
- Have Areli personally email GCs first to establish the relationship, then transition to automated reports
- If emails consistently land in spam, consider dedicated IP warming (Resend can advise)

---

## 3.3.1 Completion Report Template

The completion report is the most client-facing deliverable the platform produces. It must be polished and professional from day one.

### Report Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [A&A Logo]                              COMPLETION REPORT   │
│ ═══════════════════════════════════════════════════════════│
│                                                             │
│ Client: [GC Company Name]                                   │
│ Project: [Project Name] (if applicable)                     │
│ Site: [Full Address]                                        │
│ Date Completed: [Date]                                      │
│ Crew: [Names]                                               │
│ Reviewed by: Areli [Last Name] — [Timestamp]               │
│                                                             │
│ ─── SCOPE ──────────────────────────────────────────────── │
│ [Job scope description as entered]                          │
│                                                             │
│ ─── CHECKLIST RESULTS ──────────────────────────────────── │
│ ✓ [Item 1] — Completed [timestamp]                         │
│ ✓ [Item 2] — Completed [timestamp]                         │
│ ⚠ [Item 3] — Issue noted and resolved (see below)          │
│                                                             │
│ ─── COMPLETION PHOTOS ──────────────────────────────────── │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                        │
│ │ Photo 1 │ │ Photo 2 │ │ Photo 3 │                        │
│ │ [time]  │ │ [time]  │ │ [time]  │                        │
│ └─────────┘ └─────────┘ └─────────┘                        │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                        │
│ │ Photo 4 │ │ Photo 5 │ │ Photo 6 │                        │
│ │ [time]  │ │ [time]  │ │ [time]  │                        │
│ └─────────┘ └─────────┘ └─────────┘                        │
│                                                             │
│ ─── ISSUES & RESOLUTIONS ───────────────────────────────── │
│ Issue: [Description]                                        │
│ [Photo of issue]                                            │
│ Resolution: [What was done]                                 │
│ [Photo of resolution]                                       │
│                                                             │
│ ─── QUALITY ASSURANCE ──────────────────────────────────── │
│ "This job was reviewed and approved by Areli [Last Name],  │
│  Quality Director, A&A Cleaning."                          │
│                                                             │
│ [Digital signature or QA stamp]                             │
│                                                             │
│ ═══════════════════════════════════════════════════════════│
│ A&A Cleaning | [phone] | [email] | [website]               │
└─────────────────────────────────────────────────────────────┘
```

### Report Delivery Options
- Email with PDF attached (default)
- Link to view in client portal (if portal is built)
- Direct PDF download from admin dashboard

---

## 3.4 Cleaning Resource Library & Onboarding

### Content Structure per Guide

```
Guide: "Limpieza de Ventanas Post-Construcción"
├── Overview (1-2 sentences: what this task involves)
├── Estimated Time: 45 min per unit
├── Difficulty Level: ★★★☆☆
├── Required Products & Tools
│   ├── Product: [Name] — [Brand if preferred] — [Where to get it]
│   ├── Tool: [Name] — [Photo]
│   └── Safety Gear: [If applicable]
├── Step-by-Step Instructions
│   ├── Step 1: [Text + Photo of correct execution]
│   ├── Step 2: [Text + Photo]
│   └── Step N: [Text + Photo]
├── Common Mistakes Gallery
│   ├── ❌ [Photo of incorrect result + Why it's wrong]
│   ├── ❌ [Photo of incorrect result + Why it's wrong]
│   └── ✅ [Photo of correct result for comparison]
├── Pro Tips (from Areli's experience)
├── Related Guides (links to complementary tasks)
└── Version History (last updated, by whom)
```

### Additional Features
- Article / blog section within the library — longer-form content that doubles as SEO material when published on the public site
- Search and filter — by task type, difficulty, room type, or product
- Favorites — crew can bookmark guides they use often
- Completion tracking — Areli can see which guides each crew member has read/acknowledged
- Read-and-sign acknowledgment — for critical content (chemical safety, site protocols), crew confirms they've read and understood. No quizzes, just a digital signature/confirmation tap

**Post-Launch:** Video support — short walkthrough videos embedded in guides

### Employee Onboarding Section

A structured flow for new hires that lives within the employee portal:

```
New Employee Onboarding
├── Welcome & Company Overview (who A&A is, what we do, our standards)
├── Required Reading
│   ├── Safety Protocols (read-and-sign)
│   ├── Chemical Handling Guide (read-and-sign)
│   ├── Professional Conduct on Job Sites (read-and-sign)
│   └── How to Use the Platform (walkthrough guide)
├── Core Training Modules
│   ├── Module 1: Post-Construction Cleaning Fundamentals
│   ├── Module 2: Window and Glass Cleaning
│   ├── Module 3: Floor Care Basics
│   ├── Module 4: Bathroom and Kitchen Deep Clean
│   └── Module N: [Areli adds as needed]
├── Equipment & Product Training
│   ├── Approved Products List (with photos and usage instructions)
│   └── Equipment Care Guide
├── Platform Training
│   ├── How to View Your Jobs
│   ├── How to Update Job Status
│   ├── How to Take Completion Photos
│   ├── How to Report Issues
│   └── How to Request Supplies
└── Onboarding Completion
    └── All required items read/signed → Employee marked as "onboarded"
```

Areli can see onboarding progress per employee on her dashboard: who has completed training, who still has outstanding items, and which modules are pending.

### Content Bootstrap Plan

An empty resource library is worse than no library at all. The library is useless if it launches empty.

**Before Launch (During Phase 3):**
Create 5-8 core guides covering the most common job types:
1. Post-Construction General Clean
2. Window and Glass Cleaning
3. Bathroom Deep Clean
4. Floor Polishing
5. Kitchen/Appliance Cleaning
6. Dust and Debris Removal
7. Paint Overspray Removal
8. Final Walkthrough Checklist

**Content Creation Process:**
1. Developer interviews Areli on camera/audio for each task
2. She demonstrates or describes her standards
3. Developer writes it up, Areli reviews
4. Photos come from real job sites
5. Claude API can help draft guides from Areli's verbal descriptions — she talks, transcription happens, Claude structures it into the guide template, she reviews

**Post-Launch:**
- New guides added incrementally
- When a new job type comes up that doesn't have a guide, that triggers creation
- Track which guides crew actually opens — prioritize expanding high-use guides

**MVP Alternative:**
For the MVP phase, the resource library can be a linked Google Doc. Full CMS comes in Phase 3.

---

## 3.5 Financial Dashboard & QuickBooks Integration

### The Goal
Areli should be able to see her entire financial picture without leaving the platform. QuickBooks stays the accounting system of record, but the platform pulls data in and pushes invoices out through the API.

### Important Note: QuickBooks Desktop vs. Online
QuickBooks Desktop has a different (and more limited) API than QuickBooks Online. The Desktop API (via the Web Connector or SDK) is older and harder to integrate with a modern web app. QuickBooks Online has a modern REST API that works well with Next.js API routes.

**Recommendation:** If she's on Desktop, the strongest move is migrating to QuickBooks Online. Intuit offers migration tools, and it unlocks the full API. If she stays on Desktop, the integration will be more limited and may require a middleware service.

### RESOLVED: QuickBooks Version

**QuickBooks Online confirmed.** Subscription is active. No migration needed. The full REST API is available for Phase 4 integration.

### QuickBooks API Integration Plan

**What gets pushed TO QuickBooks:**
- New customer records (from client creation in the platform)
- Invoices (auto-generated from jobs where qa_status = approved or flagged)
- Estimates (generated during the quoting process)

**What gets pulled FROM QuickBooks:**
- Invoice status (sent, viewed, paid, overdue, partially paid)
- Payment records (date paid, amount, method)
- Customer balance / outstanding amounts
- Revenue totals by date range
- Expense data (if she tracks expenses in QuickBooks)

### Sync Strategy

**Sync Frequency:**
- Pull from QuickBooks every 15-30 minutes via Vercel Cron or Supabase Edge Function
- Cache financial data in a local `financial_snapshots` table to avoid hitting QB API on every dashboard load

**Dashboard Display:**
- Show "Last synced: [timestamp]" on all financial views
- "Refresh now" button for manual sync
- If data is >1 hour old, show subtle "Data may be outdated" indicator

**Error Handling:**
- If QB API is unreachable, show cached data with indicator
- Never block job workflow because QB is down — invoice generation queues and retries
- Log all sync failures for debugging

**QB API Rate Limits:**
- 500 requests per minute for QuickBooks Online — more than sufficient at this scale
- Implement exponential backoff if rate limited

### Pricing Model (Confirmed)

Areli uses a mixed pricing model:

| Job Type | Pricing Method | Notes |
|---|---|---|
| Standard cleaning | Per square foot + margin | Base rate by sqft, then adds her percentage |
| Unit-based work | Per unit (known pricing) | Apartments/units have established pricing |
| Exterior windows | Per project | Her biggest revenue item |
| Offices/commercial | Scope-dependent | Requires site walk — depends on rooms, contents |
| Equipment rentals | Line item add-on | E.g., midlift rental included in some bids |
| Bundled projects | Total flat fee | Some bids are one total amount for everything |

**Invoice logic must support:** Square-foot based line items, per-unit pricing, flat fees, and additional line items for equipment/extras. The quote system already supports this via the `quote_line_items` model with `unit` types (unit | sqft | hour | flat).

### Financial Dashboard for Areli

**Cash Flow Overview**
- Total revenue this month / this quarter / this year
- Outstanding invoices (total amount unpaid)
- Overdue invoices (past due date, highlighted)
- Average days to payment (overall and per client)
- Cash flow trend chart (revenue in vs. expenses out, over time)

**Revenue by Client**
- Bar chart: which GCs are generating the most revenue
- Revenue per client over time (line chart)
- Job count vs. revenue per client (identifies high-volume vs. high-value clients)

**Job Profitability**
- Revenue per job type (which services are most profitable)
- Supply cost per job (from inventory tracking)
- Estimated labor cost per job (if hourly rates are entered)
- Profit margin by job type and by client

**Invoice Management**
- List of all invoices with status indicators (paid, pending, overdue)
- Quick actions: resend invoice, mark as paid manually, add late fee
- Aging report: invoices grouped by 0-30, 31-60, 61-90, 90+ days
- One-click invoice generation from jobs where qa_status = approved or flagged

**Expense Tracking**
- Supply costs (from inventory module)
- Recurring expenses (QuickBooks data)
- Expense categorization
- Month-over-month expense comparison

**All dashboard views include:**
- Date range selector (this week, this month, this quarter, this year, custom)
- Chart visualizations (bar, line, pie as appropriate) using Recharts
- Export to Excel functionality (one-click .xlsx download of any data view)
- Print-ready PDF export for financial summaries

---

## 3.6 Unified Analytics & Insights Dashboard

### Dashboard Architecture

Rather than separate Financial and Analytics dashboards (which have overlapping metrics and would require building two separate UIs), consolidate into a single dashboard with tabs/views:

```
Unified Dashboard
├── Overview (key metrics from all categories on one screen)
├── Operations (jobs, crew, scheduling)
├── Quality (QA pass rates, issues, trends)
├── Financials (revenue, invoicing, cash flow, profitability)
└── Inventory (supplies, usage, costs)
```

This is cleaner architecturally and reduces the number of pages to build.

### Timing Note
These features should NOT be built until the platform has 60-90 days of real operational data. Building charts before there's data to display is premature. During the first 90 days, basic database queries and simple spreadsheet exports serve Areli's needs.

### Operational Analytics
- Jobs completed per week/month (total and per crew member)
- Average completion time per job type
- Jobs completed on time vs. late
- Checklist completion rate (% of items checked per job)
- Photos uploaded per job (proxy for verification compliance)
- Issues flagged per job / per crew member / per site
- Issue resolution time (flagged → resolved)

### Quality Analytics
- QA review pass rate (% of jobs Areli approves without flags)
- Most common issue types (missing detail, surface streaks, debris left, etc.)
- Quality trend per crew member over time
- Client satisfaction signals (if simple rating is added to completion reports)

### Business Analytics
- Jobs per client (which GCs send the most work)
- Revenue per client (from QuickBooks data)
- Lead conversion rate (leads submitted → jobs won)
- Average time from lead to first job
- Crew utilization (% of available hours assigned)
- Seasonal patterns (busier months, slower periods)

### Inventory Analytics
- Supply usage per job type
- Cost per job (supplies consumed)
- Reorder alerts (when stock drops below threshold)
- Waste tracking (over-ordering patterns)

### Visualization & Export
- All analytics views rendered as interactive charts (Recharts library)
- Date range selectors on every view
- Drill-down capability (click a bar in "jobs per client" → see those jobs)
- Export any view to Excel (.xlsx) with one click
- Export any view to PDF for reporting

---

## 3.7 Inventory Management

### Data Model

```
supplies
  - id, name, category (chemical, tool, consumable)
  - unit (bottle, roll, box, each)
  - current_stock, reorder_threshold
  - cost_per_unit
  - preferred_vendor, purchase_link

supply_usage_logs
  - id, job_id, supply_id, quantity_used
  - logged_by, logged_at

supply_requests
  - id, requested_by, supply_id, quantity_needed
  - site_address, urgency (normal, urgent)
  - status (requested, approved, delivered)
  - notes
```

**Crew-facing:** When completing a job, optional step to log supplies used (quick select from list, enter quantity). Also, a "Solicitar Suministros" button if they're running low.

**Admin-facing:** Stock levels dashboard, pending supply requests, usage reports per job type, reorder alerts, cost tracking that feeds into the financial dashboard.

---

## 3.8 QA Photo System & Storage

### Addressing the Streaks/Dust Problem

Photos don't always capture subtle quality issues. Multi-layered approach:

1. **Angle/lighting guidance** — Include a guide in the resource library on "How to Take QA Photos" showing the right angles and lighting to reveal streaks and residue
2. **Multiple photos from different angles** — Require 3-5 photos per job, encourage variety (wide shot, close-up, window at angle to light)
3. **Checklist as the primary QA layer** (Phase 2+) — Photos are supporting evidence, but the checklist is the accountability mechanism
4. **Inspection review by Areli** — She reviews based on photos + her knowledge of the worker. Over time, data shows patterns
5. **GC feedback loop** — Simple mechanism on completion reports for GC to flag issues, linking back to the specific job, worker, and checklist

**Post-Launch Enhancement:** Short video clips (10-30 seconds) can reveal more than still photos. This requires additional PWA complexity and storage. Defer to post-launch based on whether photos prove insufficient.

### Storage Cost Analysis

**Photos:** ~280 photos/month at current scale → 3-7 GB/year
**Supabase Free tier includes 1 GB storage.** Sufficient for MVP (3-6 months).
**Supabase Pro includes 100 GB storage.** Overage is $0.021/GB/month.

At this scale, storage is negligible. Compress photos client-side (browser-image-compression library) and generate thumbnails for dashboard views.

---

# PART 4: VISUAL IDENTITY

---

## 4.1 The Concept: Luxury Meets Texas Grit

Versace, Burberry, Coach — but with an Austin/Texas identity. Not cowboy kitsch. Think: the materiality of Texas — iron, leather, concrete, live oak — meets the confidence and restraint of a luxury house.

### What "Luxury" Means Here
- Clean, confident typography (not decorative — authoritative)
- Restrained color palette with one bold accent
- Generous whitespace
- Premium textures (subtle grain, embossed effects)
- Photography style: high-contrast, editorial, intentional
- No clip art, no cartoon cleaning icons, no stock photos of smiling maids

### What "Texas/Austin" Means Here
- NOT cowboy hats and longhorns
- The materiality of Texas — iron, concrete, limestone
- The warmth of Austin — golden hour light, live oak texture
- A sense of earned confidence — not flashy, not trying too hard
- Subtle nods to Texas iconography (lone star as a geometric element, skyline as a watermark)

---

## 4.2 Color Palette

```
Primary:     Deep Navy       #0A1628   — authority, premium, depth
Secondary:   Slate Blue      #1E293B   — depth, backgrounds
Accent:      Royal Blue      #2563EB   — company color, trust, professionalism, clean
Highlight:   Aged Gold       #C9A94E   — luxury detail, secondary accent
Neutral:     Warm Gray       #F1F0EE   — clean off-white, modern neutral
Clean:       Bright White    #FAFAF8   — clarity, space
CTA:         Steel Blue      #1D4ED8   — action, reliability (buttons/actions)
```

### Why This Palette Works
- Black shirts (which she already likes) become the brand uniform
- Royal blue is the company's signature color — it communicates trust, cleanliness, and professionalism instantly. Against deep navy and slate, it has a regal, authoritative presence that elevates the brand beyond typical cleaning companies
- The gold accent provides a second layer of richness for details, borders, and highlights — pairing blue with gold creates a classic luxury combination that feels both modern and timeless
- The cool neutral tones feel clean and modern, reinforcing the core promise of the business
- Steel blue provides contrast for interactive elements without competing with the royal blue accent

### How the Palette Maps to the Platform

| Surface | Background | Text | Accent |
|---|---|---|---|
| Public website | Navy/Slate | White/Gray | Blue + Gold details |
| Admin dashboard | White/Gray | Slate/Navy | Blue for status, Steel Blue for actions |
| Employee portal | White | Slate | Blue status indicators, big colored buttons |
| Client portal | White/Light | Slate | Blue + Steel Blue for actions |
| Completion reports (PDF) | White | Navy | Blue header bar, Gold logo accent |
| Business cards | Matte Navy | White | Blue foil accent |
| Uniforms | Black fabric | — | Embroidered A&A monogram in Blue/Gold |

### Accessibility Requirements

**Contrast Ratios (WCAG AA Compliance):**
- All body text must meet 4.5:1 contrast ratio
- Large text (18px+ bold, 24px+ regular) must meet 3:1 ratio
- Interactive elements must have visible focus states

**Color Usage Cautions:**
- Royal Blue (#2563EB) on Deep Navy (#0A1628): **Will fail for body text.** Use blue for accents and decorative elements only, not body copy on dark backgrounds.
- Gold (#C9A94E) on Warm Gray (#F1F0EE): **May fail.** Test before using for text.
- Status indicators: Don't rely on color alone. Add icons or text labels.

**Admin Dashboard Exception:**
The admin dashboard should use light backgrounds with dark text for extended reading. The dark theme is for the public site aesthetic, not for the tool Areli uses 8 hours a day. Prolonged dark mode reading causes eye strain.

**Employee Portal Priorities:**
- Big tap targets (minimum 44x44px)
- High contrast text
- Large font sizes (16px minimum body text)
- System fonts for fast loading
- Focus on usability over aesthetics — construction workers on dusty phones in bright sunlight

**Pragmatic Approach:**
Full WCAG compliance auditing is unrealistic for a solo developer on deadline. Focus on these wins that cost nothing extra:
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
- Ensure sufficient contrast on text (not decorative elements)
- Make buttons large enough to tap
- Use alt text on meaningful images

---

## 4.3 Typography Specification

### Locked Font Choices

To avoid decision fatigue during build, these fonts are specified now:

**Display/Headings:**
- **Cormorant Garamond** (Bold/SemiBold)
- Available on Google Fonts (free)
- Beautiful serif with luxury character
- Use for: H1, H2, hero text, section headers

**Body Text:**
- **Satoshi** (from Fontshare, free)
- Warm, modern sans-serif that pairs well with serifs
- Use for: Paragraphs, form labels, table content, navigation

**Monospace/Data:**
- **JetBrains Mono** or **IBM Plex Mono**
- Use for: Dashboard data tables, code-like elements, timestamps

**Mobile/Performance Fallback:**
- System fonts for employee portal to maximize loading speed on slow connections
- `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

### Font Loading Strategy
- Use `font-display: swap` to prevent invisible text during load
- Preload display font for above-the-fold content
- Subset fonts to reduce file size (Latin characters only)

**Monogram/Logo:** Custom letterform for "A&A" — geometric, could incorporate subtle angles that reference Texas/construction geometry. The ampersand becomes a design element.

---

## 4.4 Photography & Brand Voice

**Photography Style:**
- Dark, moody backgrounds with warm accent lighting (blue-tinted highlights)
- Close-up details of pristine surfaces (the result of the work, not the workers)
- Architectural photography of the kinds of spaces she cleans
- Nothing cheesy, nothing stock. Real or editorial-style.

**Brand Voice:**
- Confident but not arrogant
- Direct — no fluff, no filler (aligned with her "straight to the point" value)
- Professional — speaks the language of GCs and PMs, not consumers
- Specific — uses concrete language about what the service delivers

**Example copy:**
Instead of: "We provide quality cleaning services for your home or office!"
Write: "Standards-driven facility care for construction professionals. Every surface. Every detail. Every time."

### Where the Brand Appears
- Website (dark theme, editorial layout)
- Business cards (matte navy with blue foil accent)
- Crew uniforms (black shirts with embroidered A&A monogram in blue/gold)
- Vehicle wrap (if applicable — black base, minimal branding)
- Hard hat stickers / site signage
- Completion report PDFs (branded headers, professional layout)
- LinkedIn and Facebook profiles (consistent visual language)

---

## 4.5 Component Inventory

To ensure consistent UI from the start (rather than ad-hoc styling), here are the core components needed:

### Buttons
| Type | Style | Usage |
|---|---|---|
| Primary | Royal Blue bg, white text | Main actions (Save, Submit, Create) |
| Secondary | Outline, royal blue border | Secondary actions (Cancel, Back) |
| Destructive | Red bg, white text | Delete, Remove |
| Ghost | Text only, royal blue | Tertiary actions, links |
| Large (Employee) | 56px+ height, full-width | Status updates on mobile |

### Status Badges (Job Workflow)
| Status | Color | Icon |
|---|---|---|
| Draft | Gray (#6B7280) | Circle outline |
| Quoted | Gray (#6B7280) | Document icon |
| Assigned | Blue (#3B82F6) | User icon |
| En Route | Amber (#F59E0B) | Arrow icon |
| In Progress | Royal Blue (#2563EB) | Clock icon |
| Complete | Steel Blue (#1D4ED8) | Checkmark |
| Invoiced | Gray (#6B7280) | Dollar icon |
| Overdue | Red (#EF4444) | Exclamation |

### QA Status Badges (Review Outcome)
| QA Status | Color | Icon | Meaning |
|---|---|---|---|
| Pending | Amber (#F59E0B) | Clock | Awaiting Areli's review |
| Approved | Royal Blue (#2563EB) | Shield/checkmark | Passed QA, ready for report |
| Flagged | Amber (#F59E0B) | Warning triangle | Issues noted, report sent with notes |
| Needs Rework | Red (#EF4444) | X circle | Rejected, crew must redo |

### Cards
- **Job Card:** Title, address, date, status badge, assigned crew, action button
- **Client Card:** Company name, contact, phone, recent jobs count
- **Guide Card:** Title, difficulty stars, estimated time, thumbnail
- **Notification Card:** Icon, message, timestamp, read/unread state

### Form Elements
- Input (text, email, phone, number)
- Select / Dropdown
- Textarea
- Checkbox
- Radio buttons
- File Upload (documents)
- Photo Upload (camera integration, preview, compression)
- Date Picker
- Time Picker

### Navigation
- **Sidebar** (Admin dashboard — desktop)
- **Bottom Nav Bar** (Employee portal — mobile)
- **Top Bar** (Client portal, public site)

### Data Display
- Table (sortable, filterable)
- Chart container (Recharts wrapper)
- Stat card (number + label + trend indicator)
- Progress bar
- Empty state (illustration + message + action)

### Using shadcn/ui
The recommended approach is using **shadcn/ui** components with Tailwind CSS. This provides:
- Pre-built, accessible components
- Full source code ownership (no npm dependency lock-in)
- Easy customization to match the brand palette
- Consistent patterns across the platform

---

# PART 5: TECHNICAL ARCHITECTURE

---

## 5.1 Tech Stack

### Core Stack (MVP — Phase 1)

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Full-stack in one repo. SSR for public site (SEO). API routes for backend logic. React for dashboards. |
| Database | Supabase (PostgreSQL) | Auth, file storage, row-level security, real-time subscriptions in one service. |
| Auth | Supabase Auth | See Auth Strategy below. |
| File Storage | Supabase Storage | Completion photos, site photos, issue photos. Start with free tier (1 GB). |
| i18n | next-intl | Bilingual routing: /en/ and /es/. Crew defaults to Spanish. |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent, mobile-first. Accessible components. |
| Deployment | Vercel | Zero-config for Next.js. Free tier sufficient for MVP. |
| SMS Notifications | Twilio | SMS for crew job alerts and OTP codes. |

### Auth Strategy (Locked Down)

| User Type | Auth Method | Rationale |
|---|---|---|
| **Admin (Areli)** | Email + password | Standard secure login. Single admin user. |
| **Crew (Employees)** | Phone OTP via Twilio | Crew may not use email regularly. Phone is their primary contact. Same Twilio account used for notifications. |
| **GC Clients** | Email + password | Business contacts use email. Portal access is Phase 3. |

**Why Phone OTP for Crew:**
- No passwords to forget
- Phone is always with them at job sites
- SMS already in stack for job notifications
- Works better for Spanish-speaking users who may not have business email
- Supabase Auth supports phone OTP natively

**OTP Flow:**
1. Crew enters phone number
2. System sends 6-digit code via Twilio
3. Crew enters code
4. Session created, redirected to employee portal

**Session Duration:** 30 days. Crew shouldn't need to re-auth frequently.

### Phase 2+ Additions

| Layer | Choice | Phase | Why |
|---|---|---|---|
| Email Notifications | Resend | Phase 2 | Email completion reports to GCs. |
| PDF Generation | @react-pdf/renderer or jsPDF | Phase 2 | Branded completion reports. |
| Charts | Recharts | Phase 4 | Analytics visualizations, financial charts. |
| Export | SheetJS (xlsx) | Phase 4 | Excel export for analytics/financial data. |
| Invoicing | QuickBooks Online API | Phase 4 | Push invoices, pull payment status. **Requires QB Online — verify version first.** |
| AI Chatbot | Anthropic API (Claude) | Phase 5 | Public-facing FAQ/lead qualification bot. Bilingual. |
| App Conversion | Capacitor | Post-launch | Wraps Next.js into native iOS/Android shell. |

### Why Supabase Over MongoDB

Row-Level Security alone saves weeks of building permissions logic. Three user roles need different data access — with RLS, security policies live at the database level. Real-time subscriptions mean Areli's dashboard updates live when a crew member marks a job complete. File storage is built in. Auth is built in. For a solo dev building a multi-role platform, this is the most efficient choice.

### Starting Tier: Supabase Free
For the MVP and first 3-6 months, Supabase's free tier is sufficient:
- 500 MB database
- 1 GB storage
- 50K monthly active users
- 500K Edge Function invocations

Upgrade to Pro ($25/month) when hitting concrete limits (likely storage for photos after 3-6 months). This reduces launch risk and avoids monthly costs during build phase.

---

## 5.1.1 Security Architecture

### Row-Level Security (RLS) Policies

Each table needs explicit policies defining who can access what data.

**Example Policies:**

```sql
-- Employees can only see jobs assigned to them
CREATE POLICY "Employees see own jobs" ON jobs
  FOR SELECT
  USING (
    id IN (
      SELECT job_id FROM job_assignments
      WHERE user_id = auth.uid()
    )
  );

-- Employees can only update job_assignments for themselves
CREATE POLICY "Employees update own assignments" ON job_assignments
  FOR UPDATE
  USING (user_id = auth.uid());

-- Clients can only see their own jobs and clients record
CREATE POLICY "Clients see own data" ON jobs
  FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM clients
      WHERE primary_contact_user_id = auth.uid()
    )
  );

-- Admin (Areli) can see and modify everything
CREATE POLICY "Admin full access" ON jobs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

**Tables Requiring RLS:**
- users, clients, jobs, job_assignments, job_photos
- job_checklist_items, issue_reports, job_messages
- leads, job_applications, supplies, supply_requests

### API Route Protection

All API routes must:
1. Validate session exists and is not expired
2. Verify user role matches required permission
3. Validate all input parameters (type, length, format)
4. Return appropriate error codes (401 unauthorized, 403 forbidden)

```typescript
// Example middleware pattern
export async function validateRequest(req, requiredRole) {
  const session = await getServerSession();
  if (!session) return { error: 'Unauthorized', status: 401 };

  const user = await getUserById(session.user.id);
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return { error: 'Forbidden', status: 403 };
  }

  return { user };
}
```

### File Upload Security

| Check | Implementation |
|---|---|
| MIME type validation | Only allow image/jpeg, image/png, image/webp (video/mp4 post-launch only) |
| File size limits | Photos: 10 MB max |
| Filename sanitization | Strip special characters, generate UUID-based names |
| Storage bucket policies | Private buckets with signed URLs for access |

### OAuth Token Storage
QuickBooks OAuth2 refresh tokens must be stored encrypted:
```sql
integrations
  - id, user_id, provider (quickbooks)
  - access_token_encrypted
  - refresh_token_encrypted
  - token_expires_at
  - created_at, updated_at
```
Never store tokens in the main users table or in plain text.

### Rate Limiting (Phase 2+)
At 15-25 users, this isn't urgent. Implement in Phase 2:
- Public endpoints (quote request form, job application, chatbot): 10 requests/minute/IP
- Authenticated endpoints: 100 requests/minute/user
- Use Vercel's built-in rate limiting or implement via Supabase Edge Functions

### Input Sanitization
All user-submitted text (job messages, issue descriptions, notes) must be sanitized to prevent XSS. Use a library like DOMPurify for any content rendered as HTML.

---

## 5.1.2 Error Handling Strategy

### Photo Uploads (Most Critical)
```
If upload fails:
  1. Store photo in IndexedDB locally
  2. Show "Pending upload" indicator
  3. Retry with exponential backoff (1s, 2s, 4s, 8s, 16s)
  4. When connection returns, sync automatically
  5. Never lose a photo due to bad signal
```

### QuickBooks API
```
If QB API fails:
  1. Queue the request (store in pending_integrations table)
  2. Continue normal job workflow — never block operations
  3. Retry via background job every 15 minutes
  4. After 24 hours of failures, alert admin dashboard
  5. Invoice generation is async, not blocking
```

### SMS Delivery (Twilio)
```
If SMS fails:
  1. Log delivery status via Twilio webhooks
  2. Mark notification as "failed" in notifications table
  3. Fall back to email if available
  4. Show "Notification failed" alert in admin dashboard
  5. Provide manual "Resend" button
```

### Real-time Subscriptions
```
If Supabase real-time drops:
  1. Auto-reconnect with exponential backoff
  2. While disconnected, poll for updates every 30 seconds
  3. Show subtle "Reconnecting..." indicator
  4. On reconnect, sync any missed updates
```

### General Error Handling
- Global error boundary in React catches unhandled exceptions
- User-facing errors show friendly Spanish/English messages, not stack traces
- All errors logged with context (user ID, action, timestamp)
- Admin dashboard shows recent error count

---

## 5.1.3 Monitoring & Observability

### For MVP Scale (15-25 users)
At this scale, Areli calling you is the monitoring system. Heavy monitoring infrastructure is overkill. Implement:

**Basic Health Checks:**
- Dashboard widget showing system status
- "Last SMS sent successfully" timestamp
- "Last QuickBooks sync" timestamp
- Storage usage percentage

**Error Tracking (Phase 2+):**
- Vercel Analytics (free) for web performance
- Optional: Sentry free tier (5K errors/month) for error monitoring
- Custom error logging to a simple `error_logs` table

**Weekly Review:**
- Check Supabase dashboard for database performance
- Review Twilio delivery rates
- Scan error_logs for patterns

### Metrics to Track (When Analytics Dashboard is Built)
- API response times (p50, p95)
- Photo upload success rate
- SMS delivery rate
- QuickBooks sync success rate
- User activity (DAU, actions per session)

---

## 5.2 Data Model

```sql
-- USERS & AUTH
users
  - id (uuid, from Supabase Auth)
  - email, phone, full_name
  - role (admin | employee | client)
  - preferred_language (es | en)
  - avatar_url
  - is_active (boolean)
  - onboarding_complete (boolean)  -- for employees
  - notification_preferences (JSONB)  -- quiet_hours, batch settings, channel toggles
  - created_by, created_at, updated_at

-- NOTIFICATION PREFERENCES JSONB STRUCTURE:
-- {
--   "quiet_hours_start": "21:00",
--   "quiet_hours_end": "07:00",
--   "batch_job_notifications": true,
--   "sms_enabled": true,
--   "email_enabled": false,
--   "summary_time": "06:00"
-- }

-- USER PROVISIONING FLOWS:
--
-- CREW (Employee) Account Creation:
-- 1. Areli goes to Admin > Team > Add Employee
-- 2. Enters: full_name, phone (required), email (optional), preferred_language
-- 3. System creates user record with role='employee', is_active=true
-- 4. System sends SMS: "Areli te ha agregado al equipo A&A Cleaning. Abre [link] para acceder."
-- 5. Crew clicks link → enters phone → receives OTP → verifies → session created
-- 6. Supabase Auth identity linked to users record via phone number
-- Note: Account exists in users table before auth identity is created. Link happens on first login.
--
-- ADMIN Account:
-- 1. Created manually during initial setup (you + Areli)
-- 2. Standard email/password via Supabase Auth
-- 3. Single admin account for MVP
--
-- CLIENT (GC) Account Creation (Phase 3):
-- 1. Areli goes to Admin > Clients > [Client] > Invite to Portal
-- 2. Enters email for the GC contact
-- 3. System creates user record with role='client', links to clients.primary_contact_user_id
-- 4. System sends email invitation with signup link
-- 5. GC clicks link → creates password → account activated
--
-- DEACTIVATION:
-- 1. Areli sets is_active=false on user record
-- 2. User can still log in but sees "Account deactivated" message
-- 3. RLS policies exclude inactive users from job assignments
-- 4. Keeps audit trail intact (don't delete users)

-- CLIENTS (GC Companies)
clients
  - id, company_name, primary_contact_name
  - email, phone, address
  - quickbooks_customer_id  -- for API sync
  - primary_contact_user_id  -- references users, for portal access
  - relationship_status (prospect | active | inactive | churned)
  - payment_terms (net_30 | net_60 | due_on_receipt | custom)
  - contract_notes
  - notes, created_at

-- PROJECTS (for multi-day/multi-unit jobs) — Phase 2+
projects
  - id, client_id, name
  - site_address
  - status (active | complete | cancelled)
  - start_date, end_date
  - total_estimated_cost, total_actual_cost
  - quickbooks_estimate_id
  - notes, created_at, updated_at

-- JOBS
jobs
  - id, client_id, title
  - project_id (nullable FK to projects)  -- for grouping related jobs
  - job_type (post_construction | final_clean | rough_clean | floor_polish | window | general | custom)
  - priority (normal | urgent | rush)
  - status (draft | quoted | assigned | in_progress | complete | invoiced)
  - qa_status (pending | approved | flagged | needs_rework)  -- separate from workflow status
  - qa_reviewed_by (user_id, nullable)
  - qa_reviewed_at (timestamp, nullable)
  - qa_notes (text, nullable)  -- Areli's review comments
  - site_address, site_lat, site_lng
  - scope_description
  - notes_internal  -- private notes Areli sees, crew and clients do not
  - onsite_contact_name, onsite_contact_phone
  - scheduled_date, scheduled_time_start, scheduled_time_end
  - checklist_template_id
  - estimated_cost, actual_cost
  - quickbooks_invoice_id  -- for API sync
  - quickbooks_estimate_id
  - created_at, updated_at

-- QA STATUS EXPLANATION:
-- Job 'status' tracks workflow: draft → quoted → assigned → in_progress → complete → invoiced
-- Job 'qa_status' tracks review outcome (only relevant when status = complete):
--   - pending: Crew marked complete, awaiting Areli's review
--   - approved: Areli reviewed and approved, ready for completion report
--   - flagged: Areli found issues, documented in qa_notes (may still send report with notes)
--   - needs_rework: Areli rejected, crew must redo work (status reverts to in_progress)

-- CANONICAL QA WORKFLOW (Phase 2+):
-- 1. Crew completes work and taps "Completado" → job.status = complete, job.qa_status = pending
-- 2. Job appears in Areli's QA review queue (filter: status=complete AND qa_status=pending)
-- 3. Areli reviews photos, checklist, and notes
-- 4. Areli takes one of three actions:
--    a. APPROVE → qa_status = approved → Can send completion report, can generate invoice
--    b. FLAG → qa_status = flagged + qa_notes → Can send report WITH notes, can invoice
--    c. REJECT → qa_status = needs_rework, status reverts to in_progress → Crew notified to redo
-- 5. Completion reports ONLY sent for approved or flagged jobs
-- 6. Invoices ONLY generated for approved or flagged jobs (never pending or needs_rework)

-- JOB ASSIGNMENTS
job_assignments
  - id, job_id, user_id (crew member)
  - role (lead | member)  -- lead is primary contact, completes checklist, accountability anchor
  - status (assigned | en_route | in_progress | complete)
  - started_at, completed_at

-- STATE MACHINE RULES (jobs.status ↔ job_assignments.status):
--
-- RULE 1: Job becomes in_progress when FIRST assignment starts
--   Trigger: Any crew member taps "En camino" or "En progreso"
--   Action: job.status → in_progress (if was 'assigned')
--
-- RULE 2: Only the LEAD can mark the job complete
--   Trigger: Lead taps "Completado" and uploads required photos
--   Action: job.status → complete, job.qa_status → pending
--   All member assignments also marked complete automatically
--   Rationale: One person accountable, prevents partial completion confusion
--
-- RULE 3: Members update their own assignment status only
--   Members can: assigned → en_route → in_progress → complete (their own record)
--   Members cannot: mark the parent job complete or upload final photos
--   Members CAN: upload photos, report issues (attributed to them)
--
-- RULE 4: QA rejection affects all assignments
--   Trigger: Areli sets qa_status → needs_rework
--   Action: job.status → in_progress, ALL job_assignments.status → in_progress
--   Lead receives SMS: "El trabajo necesita correcciones. Ver notas en la app."
--
-- RULE 5: Job cannot be invoiced until qa_status is approved or flagged
--   invoice generation blocked if qa_status = pending or needs_rework
--
-- SINGLE-CREW JOBS:
--   When only one person assigned, they are automatically the lead
--   Same rules apply, just simpler (no members)

-- JOB PHOTOS (timestamped)
job_photos
  - id, job_id, uploaded_by
  - photo_url, thumbnail_url
  - photo_type (site_visit | completion | issue)
  - captured_at (timestamp from device)
  - lat, lng (GPS from device)
  - caption, created_at

-- JOB CHECKLIST ITEMS
job_checklist_items
  - id, job_id, checklist_template_item_id
  - checked (boolean), checked_by, checked_at
  - photo_url (if photo required for this item)

-- ISSUE REPORTS
issue_reports
  - id, job_id, reported_by
  - description, photo_url
  - status (open | acknowledged | resolved)
  - resolution_notes, resolved_by, resolved_at
  - created_at

-- JOB MESSAGES (Location-Based Messaging)
job_messages
  - id, job_id, sender_id
  - message_text, photo_url
  - created_at
  - read_by (uuid array)

-- CHECKLIST TEMPLATES
checklist_templates
  - id, name, description
  - job_type_category
  - created_by, updated_at

checklist_template_items
  - id, template_id, sort_order
  - description_es, description_en
  - photo_required (boolean)

-- CLEANING GUIDES & ARTICLES
cleaning_guides
  - id, title_es, title_en
  - content_es, content_en  -- rich text / markdown
  - category, difficulty_level
  - estimated_minutes
  - type (guide | article)  -- guides are step-by-step, articles are long-form
  - is_published (boolean)
  - is_public (boolean)  -- if true, also appears on public blog for SEO
  - created_by, updated_at

cleaning_guide_media
  - id, guide_id, media_url
  - media_type (photo)  -- video support post-launch
  - step_number (nullable — for step-specific media)
  - is_correct_example (boolean)  -- true = correct, false = mistake example
  - caption_es, caption_en

-- ONBOARDING & TRAINING
onboarding_modules
  - id, title_es, title_en
  - content_es, content_en
  - sort_order, is_required (boolean)
  - requires_sign_off (boolean)  -- read-and-sign items
  - linked_guide_id (nullable — links to a cleaning guide)

employee_onboarding_progress
  - id, user_id, module_id
  - status (not_started | in_progress | completed | signed)
  - completed_at, signed_at

employee_guide_reads
  - id, user_id, guide_id
  - read_at, acknowledged (boolean)

-- INVENTORY / SUPPLIES
supplies
  - id, name, category (chemical | tool | consumable)
  - unit (bottle | roll | box | each)
  - current_stock, reorder_threshold
  - cost_per_unit
  - preferred_vendor, purchase_link

supply_usage_logs
  - id, job_id, supply_id, quantity_used
  - logged_by, logged_at

supply_requests
  - id, requested_by, supply_id, quantity_needed
  - site_address, urgency (normal | urgent)
  - status (requested | approved | delivered)
  - notes, created_at

-- LEADS
leads
  - id, company_name, contact_name
  - email, phone
  - project_type, location, timeline, message
  - source (website_form | phone_call | referral | walk_in | other)
  - referral_source (text, nullable — "heard about us from...")
  - status (new | contacted | site_visit_scheduled | quoted | won | lost | dormant)
  - lost_reason (text, nullable — why they didn't convert)
  - follow_up_date (date, nullable — next scheduled follow-up)
  - last_contacted_at (timestamp, nullable)
  - notes (text — Areli's notes from calls)
  - converted_to_client_id (nullable)
  - created_at

-- QUOTES (links leads to potential jobs)
quotes
  - id
  - lead_id (FK to leads, nullable)
  - client_id (FK to clients, nullable — set if lead already converted)
  - quote_number (auto-generated: Q-2026-001)
  - status (draft | sent | viewed | accepted | declined | expired)
  - site_address
  - scope_description
  - valid_until (date)
  - subtotal, tax_amount, total
  - notes
  - quickbooks_estimate_id (nullable — for QB sync in Phase 4)
  - sent_at, viewed_at, responded_at
  - created_by, created_at, updated_at

quote_line_items
  - id
  - quote_id (FK to quotes)
  - description
  - quantity (decimal)
  - unit (unit | sqft | hour | flat)
  - unit_price (decimal)
  - line_total (computed: quantity × unit_price)
  - sort_order

-- JOB APPLICATIONS
job_applications
  - id, full_name, phone, email
  - experience_description, availability
  - has_transportation (boolean)
  - resume_url (nullable)  -- optional document upload
  - status (new | reviewed | contacted | hired | rejected)
  - notes, created_at

-- AUDIT LOG (for accountability and debugging)
audit_log
  - id
  - entity_type (job | user | client | invoice | assignment)
  - entity_id
  - action (created | updated | deleted | status_changed | assigned | reviewed)
  - old_value (JSONB, nullable)
  - new_value (JSONB, nullable)
  - performed_by (user_id)
  - performed_at (timestamp)
  - ip_address (nullable)
  - user_agent (nullable)

-- NOTIFICATIONS (track what was sent)
notifications
  - id
  - recipient_id (user_id)
  - channel (sms | email | push)
  - notification_type (job_assigned | job_completed | message_received | issue_flagged | etc.)
  - reference_type (job | message | issue_report)
  - reference_id
  - content_preview (first 100 chars)
  - status (queued | sent | delivered | failed | read)
  - queued_at
  - sent_at (nullable)
  - delivered_at (nullable)
  - failed_reason (nullable)
  - external_id (Twilio SID, Resend ID, etc.)

-- INTEGRATIONS (OAuth tokens)
integrations
  - id
  - user_id (typically admin)
  - provider (quickbooks | google | etc.)
  - access_token_encrypted
  - refresh_token_encrypted
  - token_expires_at
  - scope
  - metadata (JSONB)
  - created_at, updated_at

-- FINANCIAL CACHE (QuickBooks sync)
financial_snapshots
  - id
  - snapshot_date
  - data_type (revenue | invoices | payments | expenses)
  - data (JSONB)
  - synced_at
```

---

## 5.2.1 Database Indexing Strategy

For a platform with 15-25 users and hundreds of jobs, PostgreSQL performs well without custom indexes. However, defining indexes for common query patterns prevents performance issues as data grows.

**Indexes to Create:**

```sql
-- Jobs (most queried table)
CREATE INDEX idx_jobs_client_status ON jobs(client_id, status);
CREATE INDEX idx_jobs_scheduled_date ON jobs(scheduled_date);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_project ON jobs(project_id) WHERE project_id IS NOT NULL;

-- Job Assignments
CREATE INDEX idx_job_assignments_user_status ON job_assignments(user_id, status);
CREATE INDEX idx_job_assignments_job ON job_assignments(job_id);

-- Job Photos
CREATE INDEX idx_job_photos_job ON job_photos(job_id);

-- Job Messages
CREATE INDEX idx_job_messages_job_created ON job_messages(job_id, created_at);

-- Leads
CREATE INDEX idx_leads_status_created ON leads(status, created_at);
CREATE INDEX idx_leads_follow_up ON leads(follow_up_date) WHERE follow_up_date IS NOT NULL;

-- Quotes
CREATE INDEX idx_quotes_lead ON quotes(lead_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_client ON quotes(client_id) WHERE client_id IS NOT NULL;

-- Audit Log (grows largest)
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_performed_at ON audit_log(performed_at);

-- Notifications
CREATE INDEX idx_notifications_recipient_status ON notifications(recipient_id, status);
```

**When to Add More:** Monitor query performance in Supabase dashboard. Add indexes when specific queries consistently exceed 100ms.

---

## 5.3 Bilingual Strategy

| Surface | Primary Language | Secondary |
|---|---|---|
| Public website | English (GCs are English-speaking) | Spanish toggle available |
| Lead intake form | English | Spanish version available |
| Quote PDFs | English | Spanish version available |
| Employment application | Spanish | English version available |
| Admin dashboard | English (for you and Areli) | Spanish toggle |
| Employee portal | Spanish default | English toggle |
| Employee onboarding | Spanish default | English toggle |
| Client portal | English | — |
| Cleaning guides | Spanish first | English versions later |
| Notifications to crew | Spanish | — |
| Notifications to GCs | English | — |
| Job messages | Sent in sender's language | — |

---

## 5.4 Mobile-First Priority

The crew uses this on phones at job sites:
- Mobile-first responsive (not an afterthought)
- Big tap targets for status buttons and photo upload
- Works on spotty cell signal — optimistic UI updates, auto-save
- Camera integration as fast as texting a photo
- Minimal text input — checklists, buttons, and voice-to-text over typing
- PWA with "Add to Home Screen" for v1 (Capacitor native wrapper in Phase 4)

---

# PART 6: BUILD PLAN

---

## 6.0 Development Cadence & Sustainability

### Define Before Starting

The 18-20 week timeline assumes consistent development capacity. This must be defined explicitly:

| Cadence | Hours/Week | Calendar Time | Realistic? |
|---|---|---|---|
| Full-time | 35-40 hrs | 18-20 weeks | Intense but feasible |
| Part-time (with other work) | 15-20 hrs | 36-40 weeks | More realistic for most situations |
| Evenings/weekends only | 10-15 hrs | 45-60 weeks | Requires extreme patience |

**Action Required:** Determine the actual development cadence. All timeline estimates below assume ~30 hours/week of focused development time.

### Sustainability Practices

- **Buffer weeks:** Every 4th week is "catchup and polish" — not a new feature sprint
- **Early win:** Something must be live and being used by Week 8. This early win sustains motivation through the longer build.
- **Scope discipline:** When a feature takes longer than expected, cut scope from later phases — don't just extend the timeline
- **Burnout signals:** If motivation dips at Week 10, that's normal. Take a 3-day break, not a 3-week spiral.

### i18n Complexity Multiplier

Building a bilingual application adds 20-30% to frontend development time. Every user-facing string needs a Spanish equivalent. Every UI layout needs to accommodate Spanish text (which runs 15-25% longer than English).

**Phase 1 Strategy:** Only the employee portal needs to be Spanish-first. Admin dashboard and public site can launch English-only and add Spanish incrementally.

**Translation Workflow:**
1. Developer writes English strings
2. First-pass translation via DeepL or Claude
3. Areli reviews and corrects Spanish
4. Store in next-intl message files

---

## 6.1 Phase 1 — MVP (Weeks 1-8)

**Goal:** Ship a platform Areli uses every day. Test the core hypothesis: Does structured job dispatch and photo-based completion make operations visibly better than text messages?

### Week 1-2: Foundation + Camera Spike

**Critical First: Camera/Photo Technical Spike**
Before building anything else, build a standalone test page that:
1. Opens camera via PWA on Android
2. Captures and compresses a photo
3. Extracts GPS and timestamp
4. Uploads to Supabase Storage

**Test on 3+ actual crew Android phones.** If this doesn't work reliably, stop and redesign before proceeding.

**Other Week 1-2 Work:**
- Supabase project setup (database schema, auth, storage buckets)
- Next.js project scaffold with next-intl and Tailwind
- Auth flow: login, role-based redirects, Phone OTP for crew (via Twilio)
- Database migration (core tables only — users, clients, jobs, job_assignments, job_photos)
- Basic admin layout + navigation with brand styling
- First-run experience wizard (Section 1.6)

### Week 3-4: Work Orders + Employee Portal

- Admin: create job (quick mode: 4 required fields), assign crew, add site photos
- Employee portal: view "Mis Trabajos" in Spanish
- Job cards with address (tappable maps link), scope, on-site contact
- Status buttons: "En camino" → "En progreso" → "Completado"
- Timestamped completion photo upload (with GPS metadata)
- Issue reporting: photo + voice-to-text description
- SMS notification on job assignment (Twilio)
- Quiet hours implementation (notifications queued until 7 AM)

### Week 5-6: Public Site + Booking Pipeline

- Landing page (dark theme, editorial layout, CTA-focused)
- Quote request form → leads table → immediate SMS to Areli
- Lead pipeline view in admin dashboard (status list: new → contacted → quoted → won/lost)
- Lead detail view with notes and status management
- Simple quote creation (line items, scope, total) with branded PDF generation
- Quote delivery via email (PDF attachment + link)
- One-click lead → client conversion (+ create job from quote)
- Follow-up reminder system (1-hour and 4-hour uncalled lead SMS alerts)
- Employment application form (Spanish default)
- About page, services page
- Click-to-call CTA on every page (mobile) + phone number prominent (desktop)
- Email deliverability setup (SPF, DKIM, DMARC)
- SEO basics (meta tags, Open Graph, sitemap)

### Week 7-8: Polish + Soft Launch

- Bug fixes from internal testing
- Mobile QA on actual devices
- Admin dashboard refinements
- Import existing client list and crew contacts
- Create sample data for first-run experience
- Areli training session
- Soft launch: Platform live, Areli uses it alongside texting as backup

**Phase 1 Launch Criteria:**
- Areli can create a job in <2 minutes
- Crew receives SMS and can view job details
- Crew can update status and upload photos
- Areli can view completed jobs with photos
- Public site is live with working quote request form
- New leads trigger immediate SMS to Areli
- Areli can view lead pipeline, create quotes, and send branded PDF estimates
- Areli can convert a won lead to a client + job in one click

---

## 6.2 Phase 2 — QA System + Job Messaging (Weeks 9-12)

**Goal:** Add the quality assurance layer. Areli reviews work before GCs see it.

### Week 9-10: Checklist System + QA Review

- Checklist templates (admin creates, bilingual)
- Job checklists (crew completes with tap-to-check)
- Photo requirements per checklist item (optional)
- QA review queue showing jobs with `status = complete` and `qa_status = pending`
- QA actions: Approve (qa_status → approved), Flag (qa_status → flagged + qa_notes), Reject (qa_status → needs_rework, status → in_progress)
- Completion report generation (branded PDF per template in 3.3.1) — only for approved/flagged jobs
- Email completion reports to GCs (test deliverability)

### Week 11-12: Job Messaging + Read-and-Sign

- Location-based job messaging (simple chat scoped to job)
- Notifications when messages posted
- Read-and-sign forms (safety protocols, SOP acknowledgments)
- Job grouping/tagging (lightweight alternative to full Projects)
- Notification preferences UI (quiet hours, batch settings)

**Phase 2 Launch Criteria:**
- Crew completes checklists on every job
- Areli reviews jobs in QA queue after crew marks complete (qa_status workflow)
- Completion reports only sent for approved/flagged jobs (not pending or needs_rework)
- GCs receive branded completion reports via email
- Basic messaging works for job-specific questions

---

## 6.3 Phase 3 — Client Portal + Resource Library (Weeks 13-16)

**Goal:** Give GCs visibility (if validated), give crew training resources.

### Week 13-14: Client Portal (If Demand Validated)

**Pre-requisite:** GC interview validation from Open Questions #7. If demand is lukewarm, skip portal and enhance completion report emails instead.

If building portal:
- GC login + dashboard (clean, professional)
- View completion reports with photos and checklist status
- Service history searchable by site/date
- Job request submission (optional — may still prefer phone)

If skipping portal:
- Enhanced completion report emails with inline photos
- Service history PDF generation
- Job request via email link

### Week 15-16: Resource Library + Onboarding

- Cleaning Resource Library CMS (guides with media)
- Guide viewer in employee portal (step-by-step)
- 5-8 core guides created (Content Bootstrap Plan)
- Employee onboarding module (structured flow)
- Progress tracking (who has completed what)
- Article publishing capability (internal or public for SEO)

**Phase 3 Launch Criteria:**
- GCs can view completion reports (via portal or email)
- 5+ cleaning guides available in Spanish
- New employees can complete onboarding flow
- Areli can see onboarding progress

---

## 6.4 Phase 4 — Financial Dashboard + Analytics (Weeks 17-20)

**Goal:** Connect to QuickBooks, provide financial visibility, add operational analytics.

**Pre-requisite:** QuickBooks Online confirmed (or migration complete).

### Week 17-18: QuickBooks Integration

- OAuth2 connection flow
- Push invoices from jobs where qa_status = approved or flagged
- Pull invoice status and payment data
- Sync strategy implementation (cache, refresh, error handling)
- Invoice management view (list, status, actions)

### Week 19-20: Unified Dashboard + Analytics

- Unified dashboard with tabs (Overview, Operations, Quality, Financials)
- Cash flow overview, revenue by client, aging report
- Operational analytics (jobs completed, completion times, crew performance)
- Quality analytics (QA pass rates, issue trends)
- Excel export on all views
- PDF export for financial summaries
- Date range selectors

**Phase 4 Launch Criteria:**
- Invoices auto-generate and sync to QuickBooks
- Areli can see financial overview without opening QuickBooks
- Analytics show meaningful trends (requires 60-90 days of data)

---

## 6.5 Phase 5 — Automation + Polish (Weeks 21-24)

- Calendar/scheduling view with drag-and-drop
- Inventory tracking (supply list, usage logging, requests)
- Notification automation (reminders, overdue alerts, weekly summaries)
- Public site AI chatbot (bilingual lead qualification)
- Performance optimization
- Advanced mobile QA
- Full launch

---

## 6.6 Post-Launch / Future Expansion

| Feature | Notes |
|---|---|
| Native mobile app | Capacitor wrapper for App Store / Google Play |
| Geofenced clock-in/out | When crew grows beyond 10 |
| Inspection scoring | Layer onto existing QA system |
| Contract management | When she has 15+ GC accounts |
| Offline mode | Based on crew feedback about cell signal |
| Advanced inventory | Full reorder workflow |
| Batch invoicing | Useful at scale |

---

## 6.7 Testing Strategy

### Test Levels

| Level | What | Tools | When |
|---|---|---|---|
| Unit | Core business logic (status transitions, invoice generation, checklist scoring) | Vitest | During development |
| Integration | API routes, RLS verification, auth flows | Vitest + Supabase test helpers | Before each phase launch |
| E2E | Critical user flows | Playwright | Before Phase 1 launch, then weekly |
| Mobile | Camera, upload, UI on real phones | Manual on 3+ devices | Before each phase launch |
| Bilingual | Every string has Spanish translation | Automated check | Before each phase launch |

### Non-Negotiable Minimum

Before Phase 1 launch, E2E tests must cover:
1. **Job lifecycle:** Create job → Assign → Crew updates status → Upload photos → Areli reviews
2. **Lead capture:** Submit quote request form → Lead appears in admin pipeline → SMS notification sent to Areli → Quote created and sent
3. **Auth:** Admin login, crew Phone OTP, password reset

### Mobile Testing Protocol

Do not rely on browser dev tools. Test on actual devices:
- 2 Android phones (different ages/brands crew actually uses)
- 1 iPhone (Areli if she uses iOS)
- Test with 3G throttling enabled
- Test camera/upload flow specifically

### Load Testing (Phase 4)

Simulate 10 concurrent crew members uploading photos simultaneously. Verify:
- Upload queue handles concurrency
- No race conditions in status updates
- Database doesn't slow down

---

## 6.8 Adoption & Migration Plan

### Pre-Build (This Week — Before Any Code)

These tasks are **blocking dependencies**. Do not start development until resolved.

| Task | Owner | When | Blocks |
|---|---|---|---|
| Verify QuickBooks version (Online or Desktop?) | Areli | This week | All financial integration (Phase 4) |
| Determine Areli's primary device (phone or laptop?) | Areli | This week | Admin dashboard design approach |
| Audit crew smartphones (models, data plans) | Areli | This week | Employee portal design, fallback planning |
| Determine development cadence (hours/week) | Developer | This week | All timeline estimates |
| Determine pricing model (per unit, flat fee, hourly, mixed?) | Areli | This week | Invoice generation logic (Phase 4) |
| **Validate GC portal demand** — Ask 2-3 current GC contacts: "Would you use an online portal to view completion reports and job status?" | Areli | Before Phase 3 | Whether to build client portal at all |

### Pre-Launch (Weeks Before Phase 1 Launch)

| Task | Owner | When |
|---|---|---|
| Collect current client list | Areli | Week 6 |
| Collect crew contact info (phone, email) | Areli | Week 6 |
| Import client and crew data into platform | Developer | Week 7 |

### Soft Launch (Weeks 7-8)

- Import client list and crew contacts into platform
- Areli creates a real upcoming job in the platform AND texts crew as usual
- Compare the experience — what's faster? What's confusing?
- Crew introduced to app, encouraged (not required) to try it
- Fix blockers before mandating use

### Transition Period (Weeks 9-12)

**Weeks 9-10:**
- Areli uses platform for ALL job creation and assignment
- Still texts crew as backup confirmation
- Crew expected to view jobs in app
- Status updates optional (Areli can update on their behalf if needed)

**Weeks 11-12:**
- Crew expected to update status AND upload photos through platform
- Areli stops texting job details — platform is source of truth
- Track: Who's using it? Who's resisting? Why?

### Full Adoption (Weeks 13+)

- QA review process begins (Areli reviews before marking complete)
- Completion reports sent to GCs
- Client portal invitations sent (if built)
- Weekly review: What's working? What's friction?

### Handling Resistance

If a crew member refuses to use the app:
1. One-on-one walkthrough with Areli or developer
2. Simplify their workflow (status updates only, no photos yet)
3. Admin override capability (Areli updates on their behalf)
4. If persistent: SMS-only fallback for that person
5. Document pattern — is it one person or systemic?

- Capacitor wrapper for native app (App Store / Google Play)
- Geofenced clock-in/out
- Inspection scoring with level-based ratings
- Advanced inventory management
- Video support in QA photos
- GC satisfaction surveys
- Contract/bid preparation tools
- Batch invoicing
- Offline mode for crew app
- LinkedIn and Facebook page setup + optimization
- SEO content strategy execution

---

# PART 7: BUDGET & SOCIAL MEDIA

---

## 7.1 Monthly Budget

| Service | Monthly Cost | Notes |
|---|---|---|
| Supabase Pro | $25 | Database, auth, storage, real-time |
| Vercel | $0-20 | Free tier likely sufficient initially |
| QuickBooks Online Simple Start | ~$30 | Invoicing + accounting + API access |
| Twilio (SMS) | ~$5-10 | Crew notifications + messaging alerts |
| Resend (Email) | $0 | Free tier: 3,000 emails/month |
| Anthropic API (Chatbot) | ~$5-10 | Low volume FAQ bot on public site |
| Domain | ~$1 | ~$12/year |
| **Total** | **~$65-95/month** | **Within $100 budget** |

### MVP Phase Cost Reduction
During build and early launch, start on free tiers:
- **Supabase Free** (not Pro): 500 MB database, 1 GB storage — sufficient for first 3-6 months
- **Skip Anthropic API** until Phase 5 (chatbot is not MVP)
- **MVP monthly cost: ~$35-45/month**

Upgrade to Pro tiers when hitting concrete limits, not preemptively.

---

## 7.1.1 One-Time Setup Costs

| Item | Cost Range | Notes |
|---|---|---|
| Domain registration | $12-15/year | .com preferred |
| Professional photography | $0-500 | Optional: editorial-style shots for website |
| Component library | $0 | shadcn/ui is free |
| Logo design | $0-300 | Free if developer creates, $150-300 for freelancer |
| QuickBooks migration (if from Desktop) | $0-200 | Self-service free, Intuit-assisted $100-200 |
| SSL certificate | $0 | Free via Vercel/Let's Encrypt |
| Email domain (optional) | $0-6/month | Google Workspace if branded email needed |
| **Total one-time** | **$12-1,000** | **Depends on choices** |

---

## 7.2 Social Media & Lead Generation

**LinkedIn (Primary for B2B)**
- Company page for A&A Cleaning
- Areli's personal profile positioned as Quality Director / Founder
- Content: before/after project photos, behind-the-scenes of QA process, industry insights
- Connect with local GCs, superintendents, PMs, property managers
- Join Austin construction and real estate groups

**Facebook (Local Trust)**
- Business page with reviews and portfolio
- Join local Austin business and construction groups
- Targeted ads to construction company decision-makers in Austin metro

**Google Business Profile**
- Critical for local SEO
- Encourage GC partners to leave reviews
- Post project photos regularly

**Website's Role in Lead Gen**
- Quote request form captures GC/PM inquiries with immediate SMS alert
- Click-to-call CTA on every page drives phone leads
- SEO-optimized service pages ("post-construction cleaning Austin," "commercial cleaning subcontractor Texas")
- Portfolio/case study pages showcasing completed projects
- Blog/resource section provides SEO-rich content that ranks over time

### Social Media Capacity Reality Check

Who actually posts to social media? Areli already runs the entire business solo. If she's running jobs, managing crew, and learning a new platform, social media will not happen consistently.

**Options:**
1. Developer manages social media as separate responsibility
2. Defer social media entirely until platform reduces Areli's workload
3. Minimal cadence that's actually sustainable

A dormant LinkedIn page with one post from 6 months ago is worse than no page.

### Minimum Sustainable Cadence

| Platform | Frequency | Content Type |
|---|---|---|
| LinkedIn | 1-2 posts/week | Project photo, industry insight, or behind-the-scenes |
| Facebook | 1 post/week | Same content, adapted for format |
| Google Business Profile | 1 post/week + respond to all reviews within 24 hours | Project photos, service highlights |

### Template Posts (for Areli to fill in)

```
LinkedIn/Facebook:
"Just completed [job type] at [location type]. [X] units, [Y] hours, zero callbacks.

When your superintendent walks through and doesn't find a single issue — that's the standard.

#AustinConstruction #PostConstructionCleaning #QualityMatters"
```

```
Google Business:
"[Job type] completed this week in [area]. [Brief description of scope].
Ready for your final walkthrough."
```

---

## 7.3 SEO Keyword Strategy

### Primary Keywords (Service Pages)

Each service page targets 1-2 primary keywords:

| Page | Primary Keyword | Secondary Keywords |
|---|---|---|
| Homepage | post construction cleaning Austin | construction cleaning services Austin |
| Services | commercial cleaning subcontractor Texas | post construction cleaning company |
| Final Clean | final clean subcontractor Austin | construction final cleaning Austin TX |
| Post-Construction | post construction cleaning services | new construction cleaning Austin |

### Long-Tail Keywords (Blog/Resource Articles)

These attract GCs researching before they hire:

- "how to prepare for post construction final clean"
- "post construction cleaning checklist"
- "what does post construction cleaning include"
- "how much does post construction cleaning cost"
- "final clean vs rough clean construction"
- "construction cleaning before occupancy permit"

### Local SEO Tactics

- Include "Austin, TX" in page titles and meta descriptions
- Create location-specific pages if expanding to other cities
- Embed Google Map on contact page
- Consistent NAP (Name, Address, Phone) across all profiles
- Encourage Google reviews from satisfied GC contacts

### Content Strategy (Phase 3+)

1. Publish 1-2 blog articles per month targeting long-tail keywords
2. Convert popular cleaning guides to public articles (dual-purpose content)
3. Case studies: "How we cleaned [Project Type] in [Timeline]"
4. Guest posts on local construction industry sites (link building)

---

# PART 8: OPEN QUESTIONS & BLOCKING DEPENDENCIES

---

## 8.1 Blocking Dependencies (Must Resolve This Week)

These questions block significant portions of the build. They must be answered before writing code for affected features.

| # | Question | Blocks | Status |
|---|---|---|---|
| 1 | **QuickBooks version** — Is it Online or Desktop? | All financial integration (Phase 4) | **RESOLVED:** QuickBooks Online, subscription active. No migration needed. |
| 2 | **Areli's primary device** — Phone or laptop/desktop? | Admin dashboard design (mobile-first vs desktop-first) | **OPEN:** She uses phone at job sites. Still confirm whether heavier admin tasks (job setup/review/invoicing) will be done on phone or laptop. |
| 3 | **Crew smartphone audit** — Do all crew have smartphones with cameras and data plans? Any exceptions? | Employee portal design, fallback planning | **PARTIALLY RESOLVED:** Previous answer identified Samsung A12, Moto G, Pixel 4a as crew phones. Needs final confirmation that this covers everyone. |
| 4 | **Development cadence** — Full-time, part-time, or evenings/weekends? How many hours/week realistically? | All timeline estimates | **OPEN:** Developer determines and commits. |

---

## 8.2 High Priority Questions (Resolve Before Phase 2)

| # | Question | Impact | Notes |
|---|---|---|---|
| 5 | **Pricing model** — Per unit, per square foot, flat fee, hourly, or mixed? | Invoice generation logic | **RESOLVED:** Primarily square-foot based plus margin. Some bids include extras (e.g., equipment rental like a midlift). Some are bundled totals. Invoice logic must support multiple pricing modes. |
| 6 | **Payment terms** — Net 30? Net 60? Due on receipt? | Invoice aging reports, cash flow projections | **RESOLVED:** Construction is net 30. New construction homes: weekly or biweekly. Non-construction: monthly or bimonthly. HUD/government projects: extended timelines. Invoicing is done weekly — whatever work is completed by that week gets sent out. |
| 7 | **GC portal demand validation** — Have any GCs been asked if they would use a portal? | Whether to build client portal at all | **OPEN:** Still needs validation. GCs expect work done by deadline; Areli communicates if behind. |
| 8 | **Multi-crew job logistics** — When 3-4 crew work the same job, is there a lead? Who completes the checklist? | Job assignment UX, accountability model | **OPEN:** Determines whether "lead/member" roles are needed. |
| 9 | **Content creation ownership** — Who writes the cleaning guides? When? What's the process? | Resource library launch | **RESOLVED:** Deferred. Building out full resource/training library is not realistic right now due to time constraints. SOP knowledge should be captured later for scaling. |

---

## 8.3 Medium Priority Questions (Resolve Before Phase 3)

| # | Question | Impact | Notes |
|---|---|---|---|
| 10 | **Brand name** — Keep "A&A Cleaning" or rename for premium positioning? | Domain, branding, all marketing materials | **RESOLVED:** Keeping "A&A Cleaning." |
| 11 | **Portfolio photos** — Does Areli have before/after photos from past projects? | Website content, social media | **RESOLVED:** She has before/after photos available. |
| 12 | **GC testimonials** — Would current GC contacts provide testimonials? | Website credibility, case studies | **PARTIALLY RESOLVED:** There are a couple of GC relationships that could provide testimonials. Needs to be followed up on. |
| 13 | **Insurance and bonding** — Does she have general liability insurance? | Website credibility (display on site) | **RESOLVED:** Yes. Has liability insurance (wide-ranging cleaning insurance), workers comp, and general liability. It is a requirement for her work. Display on website. |
| 14 | **Social media ownership** — Who manages social media long-term? | Marketing sustainability | **OPEN:** No social profiles live yet. Need to determine who will manage. |

---

## 8.4 Lower Priority / Future Questions

| # | Question | When Relevant |
|---|---|---|
| 15 | **Independent contractor classification** — Legal structure for crew | Before scaling beyond 10 crew |
| 16 | **Service area expansion** — Other cities beyond Austin? | When demand exceeds capacity |
| 17 | **Vehicle branding** — Wrap company vehicles? | When budget allows |
| 18 | **Uniforms** — Order branded shirts? | After brand identity finalized |
| 19 | **Native app** — iOS/Android App Store presence? | Phase 5+ based on crew feedback |

---

## 8.5 Questions the Spec Doesn't Answer Yet

These emerged from the audit process and need explicit decisions:

| Question | Options | Recommendation |
|---|---|---|
| Should the admin dashboard be dark theme or light theme? | Dark (matches brand) vs Light (better for extended use) | Light theme for admin — she uses it 8 hours/day. Dark for public site only. |
| What happens to photos after 1 year? | Keep forever, archive, delete | Keep forever in Supabase Storage — storage is cheap. Archive to cold storage if >100GB. |
| How long are job messages retained? | Forever, 90 days, 1 year | Keep forever — useful for disputes. |
| Can crew see each other's performance? | Yes (competition) vs No (privacy) | No — only Areli sees comparative analytics. |
| Can GCs see which specific crew worked their job? | Yes (transparency) vs No (privacy) | Yes — crew names on completion report builds trust. |

---

# PART 9: VALIDATION & BUSINESS CASE

---

## 9.1 Why Build Custom vs. Use Existing Tools?

The meta-audit correctly asks: Is building a custom platform the right approach?

### Alternatives Considered

| Option | Monthly Cost | Pros | Cons |
|---|---|---|---|
| **A: Squarespace + Swept** | $70-180 | Zero dev time, works today | Swept has reported stability issues, not bilingual-first, no premium brand control |
| **B: Custom website + Google Workspace** | $12-25 | Simple, low cost | No operations features, manual everything, doesn't scale |
| **C: Custom website + Jobber** | $50-100 | Proven ops software | Residential-focused, not construction-specific, limited customization |
| **D: Full custom platform (this spec)** | $35-95 | Complete control, bilingual-first, premium brand, exact workflow fit | 4-5 months dev time, maintenance responsibility |

### Why Option D

1. **Bilingual-first is non-negotiable.** Existing tools treat Spanish as an afterthought. This platform is Spanish-first for crew.
2. **Premium brand positioning.** Swept and Jobber have their own branding. A custom platform lets the A&A brand shine.
3. **Exact workflow fit.** The QA-before-GC-sees model is specific to Areli's differentiation. Off-the-shelf tools don't support it natively.
4. **Long-term ownership.** No vendor lock-in. No monthly fees to a SaaS company. Platform grows with the business.
5. **Learning investment.** Building this creates transferable skills and a potential product if others want similar.

### When to Reconsider

If after Phase 1 (8 weeks), Areli is not using the platform daily, seriously consider pivoting to Option A or C. Don't sink 20 weeks into something that doesn't get adopted.

---

## 9.2 ROI Framework

### Investment

| Category | Estimate |
|---|---|
| Developer time (18-20 weeks × 30 hrs/week × $50-100/hr equivalent) | $27,000-60,000 opportunity cost |
| Monthly operating cost (first year) | $420-1,140 |
| One-time setup | $12-500 |
| **Total first-year investment** | $27,500-62,000 equivalent |

### Expected Returns

| Benefit | Estimated Value | How |
|---|---|---|
| Time saved on job dispatch | 5-10 hrs/week × $50/hr = $250-500/week | Work orders vs. individual texts |
| Fewer callbacks/rework | 1-2 jobs/month × $200 avg = $200-400/month | QA review catches issues before GC does |
| Professional image → new clients | 2-4 new GCs/year × $5,000 avg = $10,000-20,000/year | Website + completion reports differentiate |
| Reduced admin overhead | 3-5 hrs/week × $50/hr = $150-250/week | Dashboard vs. switching between tools |

### Break-Even Analysis

If the platform saves 8 hours/week ($400/week equivalent) and enables 2 new GC relationships/year ($10,000), break-even is approximately:

- **Optimistic:** 6-8 months after full adoption
- **Conservative:** 12-18 months after full adoption

### Non-Financial Value

- Areli transitions from "doing all the work" to "Quality Director" — the original strategic goal
- Documented processes enable scaling without Areli being physically present
- Professional operations become a competitive moat
- Data enables smarter business decisions (which clients are profitable, which crew are reliable)

---

## 9.3 Validation Milestones

### Before Committing to Full Build

- [ ] Areli confirms she will use a web-based dashboard (not just her phone)
- [ ] At least 2 crew members have smartphones that pass the camera spike test
- [ ] QuickBooks version confirmed (Online, or migration plan in place)
- [ ] At least 1 GC expresses interest in seeing completion reports
- [ ] Database pre-filled with real data for soft launch (see below)

**Pre-Fill Database for Soft Launch:**
Do NOT launch with an empty database. Before day one:
- Import all existing GC clients (names, contacts, addresses)
- Import all existing properties/job sites (addresses, parking notes, access instructions)
- Import all crew members with their phone numbers
- Create draft jobs for known upcoming work

This means Areli's first day using the platform involves *working* not *data entry*. An empty platform on day one creates a bad first impression and increases friction precisely when adoption is most fragile. Spend 2-4 hours before launch populating the system with real data from her current records.

### After Phase 1 (8 Weeks)

- [ ] Areli creates jobs through platform (not reverting to texts)
- [ ] At least 50% of crew uses the app for status updates
- [ ] At least 10 jobs have been tracked end-to-end
- [ ] Areli reports time savings (even if small)

### After Phase 2 (12 Weeks)

- [ ] Crew consistently uploads photos and completes checklists
- [ ] Areli catches at least 1 issue via QA review before GC sees it
- [ ] At least 1 GC views a completion report (email or portal)

### Go/No-Go Decision Points

**After Week 8:** If Areli is not using the platform, pause development. Diagnose why. Either fix the adoption blockers or consider pivoting to simpler tools.

**After Week 12:** If crew adoption is below 50%, simplify the crew-facing features radically. Consider SMS-only interface for resistant crew members.

**After Week 16:** If no GC has engaged with completion reports, abandon the client portal and focus resources elsewhere.

---

# PART 10: RISK MANAGEMENT

---

## 10.1 Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Areli doesn't adopt the platform | High | Fatal | First-run wizard, phased rollout, measure time savings explicitly |
| Crew refuses to use the app | High | High | Phone OTP auth (no passwords), gradual feature rollout, SMS fallback, admin override |
| GCs don't care about portal | Medium-High | Medium | Validate demand before building; email PDFs as alternative |
| Developer burnout / timeline slips | High | High | Buffer weeks, early win at Week 8, defined cadence, scope discipline |
| Camera/photo doesn't work on crew phones | Medium | High | Technical spike in Week 1-2; redesign before proceeding if fails |
| QuickBooks Desktop blocks financial features | Medium | High | Verify version this week; migrate if needed before Phase 4 |
| Platform creates more work for Areli initially | Medium-High | Medium | Quick mode job creation, batch operations, explicit time tracking |
| Security vulnerability | Low | Medium | RLS policies, input sanitization, file validation (see 5.1.1) |
| Supabase/Vercel outage | Low | Medium | Fallback plan (1.7), SMS as primary notification channel |
| Data loss | Very Low | High | Automated backups, separate photo backup, export capability |

---

## 10.2 Backup & Data Recovery

### Supabase Automatic Backups
- Supabase Pro includes daily backups with 7-day retention
- Point-in-time recovery available for Pro tier

### Additional Backup Strategy

**Weekly Data Export (Automated):**
- JSON export of all tables to separate storage (Google Drive or S3)
- Runs via Supabase Edge Function on Sunday nights
- Keeps 4 weeks of exports

**Photo Storage Backup:**
- Supabase Storage objects are NOT included in database backups
- Configure Storage bucket replication or periodic sync to secondary storage
- At minimum: enable versioning on the storage bucket

### Recovery Procedure

| Scenario | Recovery Steps | Estimated Downtime |
|---|---|---|
| Accidental data deletion | Restore from Supabase backup | 1-2 hours |
| Database corruption | Point-in-time recovery | 2-4 hours |
| Complete Supabase failure | Restore from weekly JSON export to new project | 4-8 hours |
| Photo storage failure | Restore from secondary backup | 2-4 hours |

### Data Export for Users
Areli can always export her data:
- One-click CSV export of jobs, clients, crew
- Photo URLs accessible directly
- Financial data exportable to Excel

---

## 10.3 Privacy Policy & Legal Requirements

### Data Collected

| Data Type | From Whom | Purpose | Retention |
|---|---|---|---|
| Name, phone, email | Crew, Clients, Leads | Account, communication | Until account deleted |
| GPS coordinates | Crew (via photos) | Verify job location | Indefinite |
| Photos | Crew | QA verification, completion reports | Indefinite |
| Job messages | All users | Communication record | Indefinite |
| Device info | All users | Debugging, security | 90 days |

### Legal Requirements

**Privacy Policy (Required Before Launch):**
- Must be linked from website footer
- Must be linked during account creation
- Required for Google Business Profile
- Required if ever publishing mobile app

**Key Disclosures:**
- GPS metadata is captured in completion photos
- Photos may be shared with clients in completion reports
- Messages are visible to all parties on a job

**Terms of Service:**
- Define acceptable use
- Limit liability
- Establish data ownership (Areli owns business data)

**Cookie Notice:**
- Required if using analytics (Vercel Analytics, Google Analytics)
- Simple banner: "We use cookies to improve your experience"

### Data Retention Policy

| Data | Retention | Reason |
|---|---|---|
| Job records | Indefinite | Business records, dispute resolution |
| Photos | Indefinite | QA evidence, dispute resolution |
| Messages | Indefinite | Communication record |
| Audit logs | 2 years | Compliance, debugging |
| Error logs | 90 days | Debugging |
| Lead data (unconverted) | 1 year | Then archived or deleted |

---

## 10.4 Disaster Recovery & Bus Factor

### Bus Factor Mitigation

You are a solo developer building a platform your mom's business will depend on. What happens if you're unavailable?

**Documentation Requirements:**
- README with setup instructions
- Environment variables documented
- Database schema migrations in version control
- Deployment process documented
- Access credentials stored securely (not just in your head)

**Code Maintainability:**
- Use standard patterns (Next.js conventions, Supabase best practices)
- Comment complex business logic
- Avoid clever/obscure code
- Another developer should be able to understand the codebase in 1-2 days

**Access Redundancy:**
- Areli should have emergency access credentials (stored securely)
- Vercel, Supabase, domain registrar — Areli listed as backup owner
- Document the "if something breaks and I'm unavailable" procedure

### Disaster Scenarios

| Scenario | Mitigation |
|---|---|
| Developer unavailable for 1 week | Platform runs autonomously; minor issues wait |
| Developer unavailable for 1 month | Areli has documented fallback procedures; critical fixes hired out |
| Developer permanently unavailable | Codebase documented enough for another developer to take over |

---

## 10.5 Performance Budget

### Employee Portal (Most Constrained Environment)
The crew uses this on construction sites with spotty signal and older phones.

| Metric | Target | Why |
|---|---|---|
| First Contentful Paint | < 2 seconds on 3G | Must load fast on slow connections |
| Time to Interactive | < 3 seconds on 3G | Must be usable quickly |
| JavaScript bundle | < 200 KB gzipped | Reduces load time on slow connections |
| Photo upload | < 3 seconds per photo on 4G | Must feel instant |
| Offline capability | Graceful degradation | Show cached data, queue uploads |

### Admin Dashboard
| Metric | Target |
|---|---|
| Initial page load | < 3 seconds |
| Dashboard data load | < 2 seconds |
| Chart rendering | < 1 second |

### Public Website
| Metric | Target |
|---|---|
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 90 |
| Lighthouse SEO | > 90 |
| First Contentful Paint | < 1.5 seconds |

### How to Achieve

- Use Next.js App Router with server components (reduces client JS)
- Compress images client-side before upload (browser-image-compression)
- Generate thumbnails for dashboard views
- Lazy load non-critical components
- Use system fonts for employee portal (no font download)
- Implement proper caching headers
- Use Supabase edge functions for proximity

---

## 10.6 Versioning & Change Management

### Semantic Versioning
- **Major (1.0 → 2.0):** Breaking changes, major feature releases
- **Minor (1.0 → 1.1):** New features, non-breaking
- **Patch (1.0.0 → 1.0.1):** Bug fixes, minor improvements

### Changelog
Maintain a CHANGELOG.md in the repository:
```
## [1.2.0] - 2026-04-15
### Added
- Checklist template duplication
- Batch job assignment

### Fixed
- Photo upload retry on connection loss
- Spanish translation for error messages
```

### User Communication

**For Significant UX Changes:**
- In-app "What's New" modal after update
- Update relevant training guides
- Brief Areli directly on major changes

**For Crew:**
- Keep changes minimal and intuitive
- If completion flow changes, in-app walkthrough on first use
- SMS announcement for major updates: "La app tiene nuevas funciones. Abre la app para ver."

---

# PART 11: DOCUMENT CHANGELOG

---

## Version History

| Version | Date | Changes |
|---|---|---|
| v1 | — | Initial spec |
| v2 | — | Added financial dashboard, resource library |
| v3 | — | Consolidated from multiple documents |
| v4 | March 2026 | Major revision based on Spec Audit and Meta-Audit. Added: MVP scope definition, user tech profiles, success metrics, launch criteria, fallback plan, F13/F14 friction points, projects entity, notification preferences, completion report template, content bootstrap plan, security architecture, error handling, monitoring, data model updates, 5-phase timeline restructure, testing strategy, adoption plan, one-time costs, SEO strategy, expanded open questions, validation framework, risk management, performance budget. |
| v5 | March 2026 | Consistency fixes: Moved calendar to Phase 5, rewrote completion flow to show Phase 1 vs 2 distinction, removed all video references (post-launch only), added canonical QA workflow comment block, locked auth to Phone OTP via Twilio, added user provisioning flows, defined explicit state machine rules for jobs/assignments, unified invoice eligibility rule (qa_status = approved or flagged). Added recommendations: email deliverability warning for new domains, pre-fill database requirement for soft launch, EXIF rotation testing in camera spike. |

---

*End of Specification Document*
