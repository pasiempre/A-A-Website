

# Website Blueprint — Expansion & Maturity Roadmap: Addendum

Date: 2026-04-13
Status: Active companion to `blueprint/active/expansion-maturity-roadmap.md`
Purpose: Covers industry-standard domains not addressed or only lightly touched in the primary expansion document — organized as net-new sections continuing the existing numbering.

---

## 15. Safety, Compliance & Risk Management

This is the single largest blind spot in the current platform relative to industry expectations. Commercial cleaning companies — especially those serving general contractors, property managers, and institutional clients — are expected to demonstrate safety infrastructure as a condition of bidding, not a nice-to-have.

### 15.1 Why this matters for A&A specifically

- Post-construction cleaning is one of the highest-risk commercial cleaning verticals (silica dust, debris, chemical exposure, elevation work, active construction zones)
- Austin GCs will require proof of safety programs before allowing crews on-site
- Workers' compensation insurance premiums are directly tied to incident history
- OSHA can audit any commercial cleaning operation without notice

### 15.2 Employee-facing safety requirements

| Capability | Where It Lives | Current State | Industry Standard |
|---|---|---|---|
| Job-specific hazard briefing | Employee portal, per assignment | Missing | Required. Pre-job safety briefing with hazard type (dust, chemical, height, electrical) displayed before status can move to "in progress" |
| PPE confirmation checklist | Employee portal, pre-job | Missing | Crew confirms required PPE before starting (gloves, respirator, eye protection, hard hat for construction sites) |
| Safety Data Sheet (SDS) access | Employee portal | Missing | Every chemical used must have its SDS accessible. Mobile-friendly PDF viewer or summary card per product |
| Incident/injury reporting | Employee portal → Admin | Missing (issue report exists but not safety-specific) | Dedicated safety incident form: injury type, body part, severity, witnesses, photos, timestamp. Separate from general issue reporting |
| Near-miss reporting | Employee portal | Missing | Encourages reporting of close calls. Critical for prevention culture |
| Safety training acknowledgment | Employee portal, onboarding | Missing | Employee confirms completion of safety orientation, chemical handling, equipment operation per job type |

### 15.3 Admin-facing safety management

| Capability | Current State | Industry Standard |
|---|---|---|
| OSHA 300 log tracking | Missing | Recordable incidents tracked in OSHA-required format. Annual summary generation |
| Incident investigation workflow | Missing | Admin reviews incident → root cause → corrective action → closure. Tracked with timeline |
| Safety training records | Missing | Per-employee log of completed training modules with expiration dates |
| Workers' comp claim tracking | Missing | Claim filed → status → return-to-work date. Linked to incident report |
| Equipment inspection logs | Missing | Scheduled inspection of ladders, scaffolding, pressure washers, etc. Pass/fail with notes |
| Chemical inventory with SDS links | Missing | Every chemical product in inventory linked to its SDS. Expiration tracking |
| Safety audit/inspection checklist | Missing | Periodic self-audit of safety practices with corrective action tracking |
| Subcontractor safety verification | Missing | If using subcontractors, verify their safety program and insurance before deployment |

### 15.4 Insurance certificate management (COI)

This is a **daily operational need** for commercial cleaning companies. Every GC, property manager, and building owner will request a Certificate of Insurance before work begins.

| Capability | Current State | Industry Standard |
|---|---|---|
| COI storage and retrieval | Missing | Upload current GL, WC, auto, and umbrella policies with expiration dates |
| Auto-expiration alerts | Missing | 30/60/90-day warnings before policy expiration |
| Client-specific COI generation | Missing | Many clients require additional insured endorsements. Track which clients need custom COIs |
| COI send from admin dashboard | Missing | One-click send of current COI to client email. Log delivery |
| COI request tracking | Missing | When a client or GC requests COI, track fulfillment time |

**Implementation note:** COI generation itself is typically handled by the insurance broker. The platform should store the current certificates, track expirations, and facilitate sending them to clients on demand.

### 15.5 Texas-specific regulatory requirements

| Requirement | Applicability | Current State |
|---|---|---|
| Texas sales tax collection on cleaning services | Required — cleaning services are taxable in Texas | Not addressed in platform. Should be visible in invoicing |
| HazCom/GHS compliance | Required for any business using hazardous chemicals | No SDS management, no training tracking |
| Texas Workforce Commission (TWC) compliance | Required for all employers | No I-9, W-4, or employment eligibility tracking |
| City of Austin business permits | May be required depending on service scope | No permit tracking |
| Vehicle registration and insurance for company vehicles | Required | No fleet management |
| EPA Lead Renovation, Repair, and Painting (RRP) rule | Required if cleaning pre-1978 buildings with lead paint disturbance | No certification tracking. Relevant for post-construction in older Austin buildings |

---

## 16. Customer Lifecycle & Relationship Depth

Section 3.9 of the primary doc identified the client directory addition. This section expands the full customer lifecycle management framework that a service-business CRM should cover.

### 16.1 Customer lifecycle stages

```
Prospect → Lead → Quoted → Won → Onboarding → Active → Repeat → At-Risk → Churned → Win-Back
```

**Current platform coverage:**

| Stage | Covered | Gap |
|---|---|---|
| Prospect | Partial (site visitor, no identity) | No lead magnet capture, no email list |
| Lead | Yes (quote request flow) | No lead scoring |
| Quoted | Yes (quote send + review) | No automated follow-up sequence |
| Won | Yes (quote accepted → job) | No formal onboarding |
| Onboarding | Missing | No welcome sequence, no expectation-setting |
| Active | Partial (jobs tracked) | No relationship health indicators |
| Repeat | Partial (client has multiple jobs visible) | No proactive rebooking, no recurring service proposals |
| At-Risk | Missing | No inactivity detection, no re-engagement triggers |
| Churned | Missing | No churn detection or win-back campaigns |
| Win-Back | Missing | No re-engagement automation |

### 16.2 Client onboarding workflow

When a quote is accepted and becomes the client's first job:

| Step | Trigger | Action | Owner |
|---|---|---|---|
| Welcome message | Quote accepted | Automated email/SMS: welcome, what to expect, day-of preparation, contact info | System |
| Access/key collection | Job scheduled | Prompt for access codes, gate codes, alarm info, parking instructions | Admin |
| Site-specific instructions | Pre-job | Any special requirements documented and attached to job | Admin |
| First-job quality escalation | First job for this client | Flag for admin QA review regardless of normal QA sampling | System |
| Post-first-job follow-up | Job completed + 24hrs | Personal check-in from owner/admin: satisfaction, issues, rebooking interest | Admin |
| Review request | Post-first-job + 3 days | Prompt for Google review if satisfaction confirmed | System |

### 16.3 Client health scoring

Simple model appropriate for this business scale:

| Factor | Weight | Measurement |
|---|---|---|
| Recency | 30% | Days since last completed job |
| Frequency | 25% | Jobs per quarter |
| Value | 20% | Trailing 12-month revenue |
| Satisfaction | 15% | Average post-job rating |
| Responsiveness | 10% | Quote acceptance rate, response time |

**Health categories:** Champion (top 20%), Healthy, Cooling (no job in 60 days), At-Risk (no job in 90 days), Churned (no job in 180 days)

**Admin dashboard addition:** Client health distribution chart in Overview Dashboard. At-risk client list with one-click re-engagement action.

### 16.4 Contract and service agreement tracking

| Capability | Current State | What's Needed |
|---|---|---|
| One-time project agreement | Implicit (quote acceptance) | Formalize with terms attached to quote |
| Recurring service agreement | Missing | Contract record: scope, frequency, rate, start date, auto-renewal, termination terms |
| Rate card per client | Missing | Client-specific pricing that auto-populates quotes |
| Service level agreement (SLA) | Missing | Response time, completion window, rework turnaround commitments per client tier |
| Contract renewal tracking | Missing | 30/60/90-day renewal alerts. Linked to recurring job templates |
| Scope change management | Missing | Change order workflow when client requests additions mid-contract |

### 16.5 Client communication history

**Industry standard:** Every interaction with a client — email, SMS, phone note, site visit, quote, job, complaint, compliment — is visible in a unified timeline on their client record.

**Current state:** Lead messages exist. Job-level messages exist. No unified client-level communication view.

**What's needed:**
- Client detail page with tabbed sections: Overview, Communication, Jobs, Quotes, Invoices, Documents, Notes
- Communication tab shows chronological feed from all sources
- "Log interaction" button for phone calls, in-person meetings, emails sent outside platform
- Communication templates for common messages (scheduling confirmation, post-job follow-up, review request, rebooking prompt)

---

## 17. Financial Operations & Job Economics

Section 8 of the primary doc laid out the revenue framework and unit economics template. This section expands the operational financial management that the admin dashboard should support.

### 17.1 Invoicing workflow

| Step | Current State | Industry Standard |
|---|---|---|
| Invoice creation | QuickBooks sync exists | One-click invoice generation from completed job. Pre-populated with job details, line items from quote, any change orders |
| Invoice review | Not in platform | Admin reviews draft invoice before sending. Adjust for scope changes, add/remove line items |
| Invoice delivery | Via QuickBooks | Send from platform (email + optional client portal). Track delivery and open status |
| Payment tracking | Via QuickBooks | Payment received date, method, partial payments, credits visible in platform |
| Past-due follow-up | Missing | Automated reminders at 7/14/30 days past due. Escalation workflow |
| Batch invoicing | Missing | Select multiple completed jobs → generate all invoices in one action |
| Deposit/retainer collection | Missing | For large projects, collect deposit at quote acceptance. Track against final invoice |
| Tax calculation | Missing | Texas sales tax (8.25% in Austin) applied to taxable services |

### 17.2 Job costing model

This is the foundation for understanding which services, clients, and crews are actually profitable.

**Per-job cost components:**

| Component | Data Source | Current State |
|---|---|---|
| Labor hours | Time tracking (clock in/out) | Missing — no time tracking |
| Labor rate | Employee pay rate × hours | Missing — no pay rates in system |
| Travel time | Clock-in location vs job site + drive time | Missing |
| Supply cost | Supply usage log × unit cost | Partial — usage logged but not costed |
| Equipment depreciation | Allocated per job type | Missing |
| Overhead allocation | Fixed costs / job count | Missing |
| Subcontractor cost | Subcontractor invoice | Missing — no subcontractor model |

**Minimum viable job costing (Phase 1):**
- Add labor hours (manual entry or time tracking)
- Add hourly labor rate per employee (stored in profile)
- Calculate: Revenue (quote total) − Labor cost (hours × rate) − Supply cost (usage × unit cost) = Gross margin
- Surface on job detail and in insights module

**Full job costing (Phase 2):**
- Travel time tracking
- Equipment allocation rules
- Overhead allocation by service type
- Profitability by: service type, client, crew, month, individual job

### 17.3 Accounts receivable management

| Metric | Current Visibility | Needed |
|---|---|---|
| Total outstanding AR | Not in platform | Card on overview dashboard |
| AR aging buckets (current, 30, 60, 90+) | Mentioned in insights | Verified working with real invoice data |
| Days sales outstanding (DSO) | Not tracked | Monthly trend in insights |
| Collection rate | Not tracked | Percentage of invoices collected within terms |
| Bad debt tracking | Not tracked | Write-off workflow and reporting |

### 17.4 Expense tracking

Beyond supply costs, a cleaning business has recurring operational expenses that affect profitability analysis:

| Expense Category | Tracking Method | Current State |
|---|---|---|
| Vehicle fuel | Manual entry or fuel card integration | Missing |
| Vehicle maintenance | Manual entry | Missing |
| Equipment purchases | Manual entry | Missing |
| Insurance premiums | Recurring scheduled entry | Missing |
| Marketing spend | Manual entry | Missing |
| Subcontractor payments | Linked to jobs | Missing |
| Uniform/PPE purchases | Manual entry or linked to inventory | Missing |

**Minimum viable:** Manual expense entry with category, amount, date, receipt photo upload. Monthly expense summary in insights. Not a full accounting system — that's QuickBooks' job — but enough to calculate true profitability within the platform.

### 17.5 Payroll data preparation

The platform should not be a payroll system, but it should produce the data payroll needs:

| Data Point | Source | Current State |
|---|---|---|
| Hours worked per employee per pay period | Time tracking | Missing |
| Regular vs overtime hours | Time tracking + calculation | Missing |
| Jobs worked per employee | Job assignments | Exists (but not in payroll-ready format) |
| Mileage for reimbursement | Route tracking or manual entry | Missing |
| Deductions/advances | Manual tracking | Missing |

**Export format:** CSV or direct integration with payroll provider (Gusto, ADP, or manual QuickBooks payroll). Weekly or bi-weekly generation.

---

## 18. Estimating, Bidding & Scope Management

For a commercial cleaning company targeting GC and PM clients, estimating is a core business function that directly impacts win rate and profitability.

### 18.1 Scope measurement and estimation

| Capability | Current State | Industry Standard |
|---|---|---|
| Square footage input on leads/quotes | Missing | Required. Primary driver of pricing |
| Room/area count | Missing | Needed for residential and multi-unit scopes |
| Floor count | Missing | Affects time estimate and equipment needs |
| Fixture count (for final clean) | Missing | Windows, bathrooms, kitchens drive labor hours |
| Surface type classification | Missing | Carpet vs hard floor vs tile affects method and time |
| Construction phase (for post-construction) | Missing | Rough clean vs final clean vs touch-up — different scope and price |
| Photo-based scope documentation | Missing | Admin attaches site visit photos to lead for estimation context |

### 18.2 Rate card system

| Element | Description |
|---|---|
| Base rates by service type | Per sqft rates for each service category |
| Complexity multipliers | New construction vs renovation, occupied vs vacant, multi-story |
| Urgency multipliers | Standard (3+ days), rush (24-48 hrs), emergency (same day) |
| Frequency discounts | Weekly, bi-weekly, monthly recurring service discounts |
| Volume discounts | Multi-unit, multi-building, portfolio pricing |
| Minimum job charge | Floor price regardless of scope size |

**Admin configuration:** Rate card editor in configuration module. Rates feed into quote builder to auto-calculate suggested pricing from scope inputs.

### 18.3 Quote builder enhancement

Current quote creation is in the lead pipeline. Enhanced flow:

```
Scope inputs (sqft, rooms, type, phase)
  → Rate card lookup
  → Auto-calculated suggested price
  → Admin adjusts (competitive pressure, relationship, complexity)
  → Line items generated (labor, supplies, equipment, margin)
  → Quote document generated with terms
  → Send to client
```

### 18.4 Bid management for GC RFPs

When pursuing general contractor work, formal bid processes are common:

| Capability | Description |
|---|---|
| Bid tracking | RFP received → bid prepared → submitted → won/lost/no-decision |
| Bid document generation | Scope, pricing, timeline, crew assignment plan, safety program, insurance, references |
| Bid follow-up reminders | Automated prompts to follow up on submitted bids |
| Win/loss analysis | Track win rate by GC, service type, price point. Learn from losses |
| Bid template library | Reusable bid sections (company overview, safety program, equipment list, insurance summary) |

---

## 19. Workforce Development: Training, Onboarding & Performance

### 19.1 Employee onboarding workflow

When a hiring inbox candidate is moved to "hired" status:

| Step | Timing | Content | Current State |
|---|---|---|---|
| Welcome and paperwork | Day 0 | Employment agreement, W-4, I-9, direct deposit, emergency contact | Missing |
| Safety orientation | Day 1 | Company safety policies, PPE requirements, incident reporting, chemical handling | Missing |
| Equipment training | Day 1-2 | Equipment operation, maintenance, damage reporting | Missing |
| Service procedure training | Day 1-5 | Cleaning procedures by service type (post-construction, commercial, turnover) | Missing |
| Shadow shifts | Week 1 | Paired with experienced crew member. Supervisor signs off on readiness | Missing |
| 30-day check-in | Day 30 | Performance review, feedback, questions, adjustment | Missing |
| Portal training | Day 1 | How to use employee portal: assignments, checklists, photos, messaging | Missing |
| Probation completion | Day 90 | Formal performance evaluation, rate adjustment eligibility | Missing |

**Platform support:** Onboarding checklist per employee in admin. Progress tracking. Document upload (signed agreements, ID copies, training acknowledgments). Employee sees their onboarding progress in portal.

### 19.2 Training module system

| Module | Content Type | Frequency | Tracking |
|---|---|---|---|
| Safety orientation | Video + quiz | Once (new hire) + annual refresh | Completion date, score, expiration |
| Chemical handling (HazCom) | Document + acknowledgment | Annual | Completion date, expiration |
| Equipment operation | Video per equipment type | Once per equipment type | Completion date |
| Service procedure: post-construction | Checklist + photo guide | Once + when updated | Version acknowledgment |
| Service procedure: commercial | Checklist + photo guide | Once + when updated | Version acknowledgment |
| Service procedure: turnover | Checklist + photo guide | Once + when updated | Version acknowledgment |
| Customer interaction | Guidelines document | Once + annual | Completion date |
| Emergency procedures | Document + acknowledgment | Annual | Completion date |

**Implementation:** Simple training module viewer in employee portal. Admin uploads content (PDF, video link, checklist). Employee marks complete. Quiz option for critical modules. Admin dashboard shows training compliance percentage per employee and overall.

### 19.3 Performance management

| Metric | Data Source | Visibility |
|---|---|---|
| QA pass rate per employee | QA review results | Admin: per-employee trend. Employee: personal score |
| On-time arrival rate | Time tracking (clock-in vs scheduled start) | Admin: reliability ranking. Employee: personal record |
| Checklist completion thoroughness | Checklist data | Admin: completion rate trend |
| Issue resolution speed | Issue reports → resolution timestamps | Admin: responsiveness metric |
| Client feedback per crew | Post-job ratings linked to assigned crew | Admin: crew-level satisfaction. Employee: anonymized feedback |
| Rework rate per employee | Rework assignments linked to original crew | Admin: quality trend |
| Attendance | Schedule vs actual presence | Admin: reliability metric |

**Employee-visible performance:** Personal dashboard card showing their QA score, on-time rate, and client satisfaction trend. Comparison to team average (anonymized). This creates positive accountability without adversarial surveillance.

### 19.4 Career progression framework

| Level | Title | Requirements | Pay Differential |
|---|---|---|---|
| 1 | Cleaning Technician | Hired, onboarding complete | Base rate |
| 2 | Senior Technician | 6 months, QA pass rate >90%, all training current | +$1-2/hr |
| 3 | Crew Lead | 12 months, leadership training complete, can manage 2-3 person crew | +$3-5/hr |
| 4 | Site Supervisor | 18+ months, manages multiple crews, can run client walkthroughs | +$5-8/hr |
| 5 | Operations Support | 24+ months, trained on admin portal, can assist with scheduling/dispatch | Salary consideration |

**Platform support:** Level tracked in employee profile. Promotion criteria checklist viewable by employee. Admin can promote with one action that updates pay rate, role permissions, and sends notification.

---

## 20. Quality Management System Expansion

Section 4.2.3 of the blueprint and the primary feedback doc cover QA review and rework. This section expands into a full quality management framework.

### 20.1 SLA definition and tracking

| SLA Type | Metric | Target | Tracking |
|---|---|---|---|
| Quote response time | Lead created → quote sent | <4 hours (business hours) | Pipeline timestamps |
| Job completion window | Scheduled date → completion | Same-day for standard, per-agreement for construction | Job timestamps |
| Rework turnaround | QA fail → rework completion | <24 hours | Ticket timestamps |
| Complaint resolution | Complaint received → resolved | <48 hours | Need complaint tracking |
| Invoice delivery | Job completion → invoice sent | <24 hours | Need invoice timestamps |

**Admin dashboard addition:** SLA compliance scorecard in overview or insights. Red/yellow/green indicators. Trend over time.

### 20.2 Complaint and issue management

Distinct from employee issue reports (which are field-to-admin). This is client-to-company complaints:

| Step | Action | Owner |
|---|---|---|
| Complaint received | Log in system with source (call, email, text, review), severity, category | Admin |
| Acknowledgment | Contact client within 2 hours confirming receipt and expected resolution timeline | Admin |
| Investigation | Review job records, photos, checklist, crew assignment, QA results | Admin |
| Root cause determination | Categorize: training gap, equipment issue, time pressure, scope misunderstanding, personnel | Admin |
| Corrective action | Rework, credit, apology, process change, training, personnel action | Admin |
| Client follow-up | Confirm resolution, check satisfaction, offer goodwill gesture if warranted | Admin/Owner |
| Record closure | Document resolution, update client health score, update crew performance records | System |
| Pattern analysis | Monthly review of complaint categories and root causes | Admin/Owner |

### 20.3 Inspection and walkthrough protocol

For post-construction and commercial cleaning, formal inspections are standard:

| Inspection Type | When | Participants | Documentation |
|---|---|---|---|
| Pre-job site assessment | Before quoting | Admin or crew lead + client | Photos, scope notes, hazard identification, access requirements |
| Mid-job progress check | Multi-day jobs, end of each day | Crew lead | Progress photos, checklist status, issues identified |
| Post-job crew self-inspection | Before marking job complete | Crew lead | Checklist walkthrough, deficiency identification |
| Admin QA inspection | Before delivery to client | Admin (remote via photos or on-site) | QA review with pass/fail/rework determination |
| Client walkthrough | After QA approval | Client + admin or crew lead | Punch list items, sign-off, satisfaction confirmation |

**Platform support:** Inspection records linked to jobs. Photo documentation per inspection stage. Punch list items generated from walkthrough that feed back into rework workflow.

### 20.4 Cleaning standard operating procedures (SOPs)

Every service type should have documented, version-controlled SOPs:

| SOP | Content |
|---|---|
| Post-construction rough clean | Debris removal sequence, dust control, floor protection, PPE requirements |
| Post-construction final clean | Room-by-room procedure, fixture cleaning methods, floor finishing, window cleaning |
| Commercial office cleaning | Workspace sanitization, restroom protocol, kitchen/break room, trash, floor care |
| Move-in/out turnover | Unit prep sequence, appliance cleaning, cabinet/drawer detail, floor restoration |
| Window cleaning | Interior/exterior methods by glass type, frame cleaning, screen cleaning, safety |
| Power washing | Surface preparation, pressure settings by material, chemical selection, runoff management |

**Platform integration:** SOPs linked to job templates. Crew sees relevant SOP in employee portal before starting job. SOP version tracking with acknowledgment when updated.

---

## 21. Document & Contract Management

### 21.1 Document types and lifecycle

| Document Type | Created By | Stored Where | Shared With | Current State |
|---|---|---|---|---|
| Quote/proposal | Admin (from platform) | Platform + client email | Client | Exists (token-based review) |
| Service agreement/contract | Admin | Platform | Client (e-sign) | Missing |
| Certificate of Insurance (COI) | Insurance broker | Platform (uploaded) | Client (on demand) | Missing |
| Change order | Admin | Platform | Client (approval needed) | Missing |
| Completion report | System (auto-generated) | Platform | Client | Exists |
| Invoice | QuickBooks / Platform | QuickBooks + Platform | Client | Partial (QuickBooks sync) |
| W-9 | Company | Platform | Client (on request) | Missing |
| Employee agreements | Admin | Platform | Employee | Missing |
| Training certificates | Admin / Employee | Platform | Regulatory (on audit) | Missing |
| Safety incident reports | Employee / Admin | Platform | Regulatory (on audit) | Missing |
| Site visit reports | Admin / Crew lead | Platform | Client (optional) | Missing |
| Capabilities package | System (auto-generated) | Platform | Prospect | Missing |

### 21.2 Capabilities package generator

For GC and PM sales meetings, a one-click generated PDF containing:

- Company overview (from about page content)
- Service descriptions (from service pages)
- Insurance summary with current COI
- Safety program overview
- Equipment list
- Key project references (from case studies)
- Team overview
- Quality assurance process description
- Contact information

**Admin action:** "Generate Capabilities Package" button in configuration or client directory. Produces branded PDF. Update when underlying content changes.

### 21.3 E-signature integration

For service agreements and change orders:

| Option | Effort | Cost |
|---|---|---|
| DocuSign integration | 1-2 weeks | $10-25/month |
| HelloSign (Dropbox Sign) API | 1-2 weeks | $15-20/month |
| Built-in simple signature capture | 3-5 days | Free (but less legally robust) |
| PDF + "I accept" checkbox flow | 1-2 days | Free (minimum viable) |

**Recommendation:** Start with "I accept" checkbox on quote review page (already has token-based auth). Add terms and conditions text. Upgrade to DocuSign/HelloSign when contract volume justifies it.

---

## 22. Communication Automation Hub

### 22.1 Automated message sequences

The feedback doc mentions automated lead follow-up (Tier 1, 2-3 days effort). This section defines the full communication automation framework.

**Sequence types:**

| Sequence | Trigger | Messages | Channel |
|---|---|---|---|
| Lead follow-up | Lead created, no response after X hours | 3-5 messages over 7 days: acknowledge → value prop → urgency → last chance → close | SMS + Email |
| Quote follow-up | Quote sent, no response after X hours | 3 messages over 5 days: reminder → address concerns → expiration warning | SMS + Email |
| Pre-job preparation | Job scheduled, 24-48 hours before | 1-2 messages: confirmation, access prep, what to expect | SMS + Email |
| Day-of notification | Job scheduled, morning of | ETA, crew info, contact number | SMS |
| Post-job follow-up | Job completed | Thank you + satisfaction check (24hrs) → Review request (72hrs) → Rebooking prompt (7 days) | SMS + Email |
| Re-engagement | No job in 60 days for active client | "We miss you" + seasonal offer or service reminder | Email |
| Win-back | No job in 120+ days | Special offer or "what could we do better" survey | Email |
| Anniversary | 1 year since first job | Loyalty appreciation, referral prompt | Email |

### 22.2 Template management

| Template Element | Capabilities Needed |
|---|---|
| Template library | Pre-built templates for each sequence and ad-hoc message types |
| Variable substitution | `{client_name}`, `{job_date}`, `{service_type}`, `{crew_lead}`, `{quote_amount}`, `{company_phone}` |
| Bilingual templates | English and Spanish versions of every template. Auto-select based on client `preferred_language` |
| A/B testing | Variant support for key templates (subject lines, CTA wording) |
| Approval workflow | New templates or edits reviewed before going live |
| Performance tracking | Open rates (email), response rates, conversion rates per template |

### 22.3 Communication preferences and compliance

| Requirement | Implementation |
|---|---|
| Opt-out handling | Every SMS includes opt-out instruction. Opt-out status stored per contact. System blocks sends to opted-out contacts |
| Quiet hours | Already referenced in notification center. Enforce across all automated sequences |
| Frequency caps | No more than 1 SMS per day, 2 emails per week per contact (configurable) |
| CAN-SPAM compliance | Unsubscribe link in all marketing emails. Physical address in footer |
| TCPA compliance | Record consent for SMS communications. Consent timestamp stored per contact |
| Communication log | Every message sent is logged with timestamp, channel, template, delivery status |

---

## 23. Green Cleaning & Sustainability Positioning

### 23.1 Why this matters

- Austin is one of the most environmentally conscious metros in Texas
- LEED-certified buildings (common in Austin's tech/office corridor) often require green cleaning programs
- GCs on LEED projects need cleaning contractors who can document green practices
- "Green" positioning commands 10-20% pricing premium in commercial cleaning
- Differentiates from commodity competitors

### 23.2 Public site additions

**New page: Green Cleaning Program**
- Route: `src/app/(public)/green-cleaning/page.tsx`
- Content:
  - Green cleaning philosophy and commitment
  - Approved product list (Green Seal, EPA Safer Choice, or equivalent)
  - LEED cleaning compliance capabilities
  - Indoor air quality (IAQ) practices
  - Waste reduction and recycling during post-construction cleanup
  - Chemical-free cleaning options available
  - Environmental certifications (if obtained: ISSA CIMS-GB, Green Seal GS-42)

**Existing page updates:**
- Service pages: Add "green cleaning option available" badge where applicable
- About page: Sustainability commitment section
- FAQ: Green cleaning questions (cost difference, effectiveness, product list availability)

### 23.3 Operational integration

| Capability | Description |
|---|---|
| Green product tracking in inventory | Flag products as green-certified. Track green vs conventional usage percentage |
| Green cleaning checklist variant | Service-type checklists with green-specific steps (product selection, dilution rates, IAQ practices) |
| LEED documentation support | Generate cleaning logs in LEED-required format for building certification |
| Client-facing green report | Completion report variant that highlights green practices used |

---

## 24. Customer Self-Service Portal

Mentioned in Tier 1 features (3-5 days, high impact). This section provides the full specification.

### 24.1 Portal scope

| Capability | Description | Priority |
|---|---|---|
| Quote review and acceptance | Already exists (token-based) | Exists |
| Job schedule visibility | See upcoming and past jobs with dates, times, crew | High |
| Completion report access | View photo-documented completion reports | High |
| Invoice and payment history | View invoices, payment status, make payments (if Stripe integrated) | High |
| Communication thread | View and respond to messages | Medium |
| Document access | Download COIs, contracts, proposals | Medium |
| Service request submission | Request additional or one-off services | Medium |
| Recurring service management | View recurring schedule, request changes, pause/resume | Medium |
| Satisfaction rating | Rate completed jobs (feeds post-job-rating flow) | Exists (via link) |
| Account management | Update contact info, access codes, billing info | Low |
| Refer a colleague | Referral form with tracking | Low |

### 24.2 Authentication

| Option | Complexity | Security |
|---|---|---|
| Magic link (email) | Low | Good — no password to manage |
| Token-per-session (extend current quote token approach) | Low | Moderate — already proven |
| Email + password | Medium | Standard but adds password management burden |
| SSO (Google) | Medium | Convenient for tech-sector clients |

**Recommendation:** Magic link authentication. Client enters email → receives link → authenticated for 30 days. Minimal friction. Matches the existing token-based paradigm.

### 24.3 Business impact

- Reduces "where's my invoice / when's my next cleaning / can I see the photos" calls by 60-80%
- Increases client stickiness (switching cost increases when they have a portal with history)
- Enables faster payment collection if integrated with Stripe
- Provides data for client health scoring (login frequency, document access, rating history)
- Differentiator: most Austin cleaning companies have zero client-facing technology

---

## 25. Role-Based Access & Permissions Expansion

### 25.1 Current model

Binary: Admin (full access) and Employee (assignment-level access).

### 25.2 Industry-standard role matrix

| Role | Description | Access Scope |
|---|---|---|
| Owner/Super Admin | Full system access, configuration, financial data, hiring | Everything |
| Operations Manager | Day-to-day operations: scheduling, dispatch, QA, inventory | All ops modules, no financial config |
| Sales/Account Manager | Lead pipeline, quotes, client directory, communication | Pipeline, quotes, clients. No employee management |
| Crew Lead | Own crew assignments + crew member assignments, limited admin functions | Employee portal + crew management overlay |
| Field Technician | Own assignments only | Employee portal (current) |
| Bookkeeper/Accountant | Financial data, invoicing, expense tracking, reporting | Financial modules, read-only ops data |
| Client (portal) | Own quotes, jobs, invoices, communication | Client portal only |

### 25.3 Permission model

| Permission | Owner | Ops Mgr | Sales | Crew Lead | Technician | Bookkeeper | Client |
|---|---|---|---|---|---|---|---|
| View all leads | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create/edit quotes | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View all jobs | ✅ | ✅ | Read | Crew only | Own only | Read | Own only |
| Create/edit jobs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage scheduling | ✅ | ✅ | ❌ | View crew | View own | ❌ | ❌ |
| Manage employees | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View financial data | ✅ | Summary | ❌ | ❌ | ❌ | ✅ | Own only |
| Manage invoices | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| System configuration | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Hiring management | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View insights | ✅ | ✅ | Sales metrics | ❌ | ❌ | Financial metrics | ❌ |

### 25.4 Implementation approach

- Add `role` column to profiles table (enum: owner, ops_manager, sales, crew_lead, technician, bookkeeper)
- Middleware checks role against route group permissions
- RLS policies reference role for row-level filtering
- UI conditionally renders modules and actions based on role
- Client portal is a separate authenticated surface (not admin/employee)

---

## 26. Mobile & Offline Strategy

### 26.1 Current state assessment

| Capability | Status |
|---|---|
| Responsive design | ✅ All three surfaces responsive |
| Mobile-optimized employee portal | ✅ Mobile-first design |
| Offline photo queue | ✅ Implemented with retry |
| Offline form submission | ❌ Other actions require connectivity |
| Push notifications | ❌ No web push or native push |
| Home screen installable (PWA) | ❌ Not configured |
| Native app | ❌ Not applicable currently |

### 26.2 Progressive Web App (PWA) specification

The employee portal is the highest-value PWA candidate. Field crews use it on phones with inconsistent connectivity at construction sites.

| PWA Feature | Value | Effort |
|---|---|---|
| Web app manifest + installability | Home screen icon, full-screen experience, instant launch | 1-2 hours |
| Service worker for asset caching | Faster load times, offline shell rendering | 1-2 days |
| Offline data caching (assignments, checklists) | View today's assignments without connectivity | 2-3 days |
| Background sync for form submissions | Queue status updates, checklist completions, issue reports for sync when online | 3-5 days |
| Push notifications | Assignment alerts, schedule changes, admin messages | 2-3 days |

**Recommended phasing:**
1. **Week 1:** Manifest + service worker + asset caching. Instant improvement to load time and installability
2. **Week 2:** Offline assignment caching. Crews can view today's work without signal
3. **Week 3:** Background sync for mutations. Status changes, checklist completions queue and sync automatically
4. **Week 4:** Push notifications. Real-time alerts for new assignments, schedule changes

### 26.3 Admin mobile experience

The admin dashboard is currently responsive but designed for desktop-first interaction. For an owner/operator who is frequently in the field:

| Enhancement | Description |
|---|---|
| Mobile command view | Simplified overview dashboard for phone: today's jobs, urgent items, quick actions |
| Quick-action patterns | Swipe to approve quotes, one-tap to call lead, quick-assign from phone |
| Notification-driven workflow | Push notification → tap → lands directly on relevant item (lead, job, QA review) |
| Voice note for activity log | Record voice note on lead or job, transcribed and stored |

---

## 27. Video & Rich Media Content Strategy

### 27.1 Video content types

| Content Type | Purpose | Used Where | Production |
|---|---|---|---|
| Company overview (60-90 sec) | Trust and credibility | Homepage hero, about page, sales meetings | Professional shoot |
| Service process videos (30-60 sec each) | Show methodology, not just describe it | Service pages | Phone or professional |
| Before/after timelapse | Visual proof of transformation | Homepage, service pages, social media, case studies | Phone with timelapse app |
| Client testimonial videos (30-60 sec) | Social proof with emotional weight | Homepage, about page, case studies | Phone or professional |
| Day-in-the-life (crew) | Recruiting and brand personality | Careers page, social media | Phone |
| Equipment and technique explainer | Technical credibility for GC/PM audience | Service pages, blog posts | Phone |
| Safety practices overview | Compliance demonstration | About page, capabilities package | Phone or professional |
| Owner introduction | Personal trust anchor | About page, homepage | Professional recommended |

### 27.2 Video implementation on site

| Element | Implementation |
|---|---|
| Hosting | YouTube (unlisted) or Vimeo for embedding. Cloudflare Stream for performance-critical embeds |
| Lazy loading | Video embeds load on scroll-into-view to preserve page speed |
| Thumbnails | Custom thumbnails with play button overlay. No auto-play |
| Mobile optimization | Responsive embed, bandwidth-conscious (don't autoload on mobile) |
| Structured data | VideoObject schema on pages with embedded videos |
| Accessibility | Captions on all videos (YouTube auto-generate + manual correction). Spanish subtitles on key videos |

### 27.3 Photo standards

Current before/after photos are placeholders. Real photo requirements:

| Photo Type | Specifications | Usage |
|---|---|---|
| Before/after pairs | Same angle, same lighting where possible. Wide shot + detail shot per area | Homepage slider, service pages, case studies |
| Crew at work | Action shots showing professionalism (uniforms, equipment, safety gear) | About, careers, homepage |
| Equipment showcase | Clean, well-maintained equipment | Service pages, capabilities package |
| Team portraits | Consistent backdrop or on-site. Uniform, professional | About page, employee portal |
| Completed work showcase | Final result photos from actual projects | Portfolio, case studies, Google Business Profile |

**Photo workflow integration:** Completion photos from employee portal (already captured) → Admin reviews → "Promote to Portfolio" action → Available for case studies, service pages, and social media.

---

## 28. Seasonal & Capacity Planning

### 28.1 Austin seasonal patterns for commercial cleaning

| Season | Market Dynamic | Impact on A&A |
|---|---|---|
| Jan-Mar | Post-holiday commercial cleanup. New year lease starts drive turnover cleaning. Construction starts for spring projects | High demand for commercial and turnover. Moderate construction cleaning |
| Apr-Jun | Peak construction season. Spring move-in/out season. End of school year office refreshes | Highest demand across all services. Capacity pressure |
| Jul-Aug | Continued construction but slower starts. Extreme heat limits outdoor work hours. Summer office deep cleans | Shift outdoor work to early morning. Focus on indoor services |
| Sep-Nov | Fall construction completion surge. Lease renewals and office moves. Pre-holiday deep cleaning requests | Second peak for post-construction and commercial. Build capacity in September |
| Dec | Holiday shutdown cleaning. Construction slowdown. Reduced demand overall | Lower volume. Use for equipment maintenance, training, planning |

### 28.2 Capacity planning model

| Input | Source | Calculation |
|---|---|---|
| Active crew members | Employee records | Count of active, trained employees |
| Hours per crew member per day | Standard: 8 hrs (6.5 productive after travel/breaks) | Fixed assumption, adjustable |
| Average job hours by service type | Historical job data or estimates | Post-construction: 16-40 hrs; commercial: 2-8 hrs; turnover: 4-12 hrs; windows: 2-6 hrs |
| Working days per month | Calendar minus holidays | ~22 days |
| Monthly capacity (hours) | Crew × productive hours × working days | Dynamic calculation |
| Monthly demand (hours) | Booked + pipeline jobs converted to hours | From scheduling data |
| Utilization rate | Demand hours / capacity hours | Target: 75-85% (leaves buffer for rush jobs and rework) |

**Admin dashboard addition:** Capacity utilization gauge in overview. Forward-looking capacity vs booked demand for next 2-4 weeks. Alert when utilization exceeds 85% (hire signal) or drops below 60% (sales signal).

### 28.3 Hiring trigger framework

| Signal | Threshold | Action |
|---|---|---|
| Utilization > 85% for 2+ weeks | Sustained over-capacity | Post hiring, activate referral program |
| Quote-to-job conversion declining due to scheduling | Losing jobs because no slots available | Immediate hiring priority |
| Average days to schedule > 5 | Clients waiting too long | Hire or activate subcontractor network |
| Seasonal peak approaching (April, September) | Calendar-based | Pre-hire 30-60 days before peak |
| Utilization < 60% for 2+ weeks | Under-capacity | Increase marketing, consider reducing hours before letting anyone go |

---

## 29. Subcontractor & Overflow Management

### 29.1 Why this matters

A cleaning company cannot always hire fast enough for demand spikes. Subcontractor relationships provide elastic capacity without permanent headcount commitment. This is especially relevant for:
- Construction cleaning with unpredictable GC schedules
- Multi-unit turnover cleaning with tight timelines
- Overflow during seasonal peaks
- Geographic expansion testing

### 29.2 Subcontractor management framework

| Capability | Description |
|---|---|
| Subcontractor directory | Company name, contact, services offered, service area, insurance expiry, rate |
| Qualification verification | COI on file, required insurance minimums met, references checked |
| Job assignment to subcontractor | Same assignment flow as employee, but flagged as subcontractor |
| Subcontractor portal | Limited version of employee portal: view assignment, upload completion photos, submit hours |
| Rate and billing management | Subcontractor rate per job type. Compare to internal crew cost for margin analysis |
| Performance tracking | QA results, on-time rate, client feedback for subcontracted jobs |
| 1099 reporting preparation | Annual earnings tracking per subcontractor for tax reporting |
| Insurance expiry monitoring | Alert when subcontractor insurance approaches expiration |

### 29.3 Risk management

| Risk | Mitigation |
|---|---|
| Quality inconsistency | Same QA checklist and photo requirements. Higher QA sampling rate for subcontractor jobs |
| Liability exposure | Require minimum GL and WC insurance. Subcontractor agreement with indemnification |
| Client relationship | A&A remains client-facing. Subcontractor operates under A&A brand and standards |
| Availability reliability | Maintain 3-5 qualified subcontractors per service type. Don't depend on any single sub |

---

## 30. Data Governance & Privacy

### 30.1 Data classification

| Data Category | Examples | Sensitivity | Retention |
|---|---|---|---|
| Client PII | Name, email, phone, address | High | Active + 3 years after last job |
| Employee PII | Name, SSN (if stored), address, phone, pay rate | Critical | Active + 7 years (tax/employment law) |
| Financial data | Invoices, payments, quotes, job costs | High | 7 years (tax) |
| Operational data | Jobs, schedules, checklists, photos | Medium | Indefinite (business value) |
| Marketing data | Lead source, conversion events, analytics | Low | 2 years rolling |
| Communication logs | SMS, email content, chat transcripts | Medium | 3 years |
| Safety records | Incident reports, training records, OSHA logs | High | 5 years (OSHA requirement) |
| Access credentials | Building codes, alarm codes, lockbox codes | Critical | Purge within 30 days of job completion |

### 30.2 Security controls by data category

| Control | Client PII | Employee PII | Access Credentials | Financial |
|---|---|---|---|---|
| RLS enforcement | ✅ Required | ✅ Required | ✅ Required | ✅ Required |
| Encryption at rest | Supabase default | Supabase default + consider column-level for SSN | Column-level encryption recommended | Supabase default |
| Encryption in transit | TLS (Vercel/Supabase default) | TLS | TLS | TLS |
| Access logging | Recommended | Required | Required | Required |
| Data export controls | Admin only | Owner only | Not exportable | Admin/Bookkeeper |
| Backup and recovery | Supabase tier-dependent | Supabase tier-dependent | Verify | Supabase tier-dependent |
| Right to deletion | Must support (privacy policy commitment) | Employment law constraints | Auto-purge policy | Tax retention constraints |

### 30.3 Access credential security

Building access codes, alarm codes, and lockbox codes are **the most sensitive operational data** in the system. A leak could result in property crime liability.

| Control | Implementation |
|---|---|
| Storage | Encrypted column, not plain text in notes field (current gap) |
| Visibility | Visible only to assigned crew on day of job. Hidden before/after |
| Audit logging | Log every access credential view with user, timestamp, IP |
| Auto-purge | Remove access credentials from system 30 days after job completion |
| Employee portal | Show access code only after "en route" or "in progress" status. Mask by default with "reveal" tap |
| Transmission | Never include in SMS or email. Only visible in authenticated portal |

---

## 31. Disaster Recovery & Business Continuity

### 31.1 Platform failure scenarios

| Scenario | Impact | Recovery |
|---|---|---|
| Vercel outage | Public site and all dashboards unavailable | Wait for Vercel recovery. Maintain static info page on separate host with phone number |
| Supabase outage | All data-dependent features unavailable | Wait for recovery. Maintain local backup of today's schedule (daily export) |
| Twilio outage | SMS notifications fail | Email fallback for critical notifications. Phone tree for day-of crew communication |
| Domain/DNS failure | Site unreachable | Maintain registrar access credentials separately. DNS propagation can take hours |
| Database corruption | Data loss | Restore from Supabase backup. Verify backup retention and test restore quarterly |
| Security breach | Data exposure, operational compromise | Incident response plan (below). Rotate all credentials. Notify affected parties |
| Owner incapacitation | Business operations halt | Documented access credentials for all systems. Designated backup operator |

### 31.2 Operational continuity plan (non-technical)

If the platform is completely unavailable:

| Function | Manual Fallback |
|---|---|
| Today's schedule | Daily schedule email auto-sent at 6 AM (implement as scheduled job) |
| Crew communication | Phone tree: Admin → crew leads → crew members. Maintain current phone list in Google Sheets |
| New lead intake | Google Voice number rings to admin phone. Leads manually logged |
| Quote delivery | Email quote from template. Track in spreadsheet |
| Client communication | Direct phone/email from personal accounts |
| Job completion documentation | Crew photos saved to shared Google Drive folder |

### 31.3 Backup and recovery protocol

| Item | Frequency | Storage | Tested |
|---|---|---|---|
| Supabase database backup | Per Supabase plan (daily for Pro) | Supabase managed | Needs quarterly restore test |
| Application code | Continuous (GitHub) | GitHub | N/A (always current) |
| Environment variables | Manual snapshot | Secure note (1Password/Bitwarden) | Document all env vars |
| DNS configuration | Manual snapshot | Secure note | Document registrar + records |
| Uploaded files (photos, documents) | Per Supabase storage backup | Supabase managed | Verify storage backup inclusion |
| Third-party credentials | Manual snapshot | Secure note | Document all API keys and accounts |

---

## 32. Analytics Implementation Detail

Section 10 of the primary feedback doc defines the measurement framework. This section specifies the technical implementation.

### 32.1 Event taxonomy

**Public site events (send to analytics + conversion_events table):**

| Event Name | Trigger | Properties |
|---|---|---|
| `page_view` | Route change | `path`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign` |
| `quote_form_start` | First field interaction in any quote form | `form_location` (hero, section, floating, exit-intent) |
| `quote_form_complete` | Successful quote submission | `form_location`, `service_type`, `timeline` |
| `quote_form_abandon` | Form started but page left without submission | `form_location`, `fields_completed`, `time_on_form` |
| `phone_cta_click` | Click on any phone number link | `cta_location`, `device_type` |
| `ai_chat_start` | AI assistant conversation initiated | `page`, `language` |
| `ai_chat_complete` | AI assistant captures lead info | `language`, `service_type` |
| `exit_intent_shown` | Exit intent overlay displayed | `time_on_page`, `scroll_depth` |
| `exit_intent_converted` | Quote submitted from exit intent | |
| `service_page_view` | Any service detail page loaded | `service_type` |
| `industry_page_view` | Any industry page loaded | `industry_slug` |
| `area_page_view` | Any service area page loaded | `city_slug` |
| `blog_post_view` | Blog post loaded (when implemented) | `post_slug`, `category` |
| `resource_download` | Gated resource downloaded (when implemented) | `resource_name`, `email_captured` |
| `careers_application_start` | Application form first interaction | |
| `careers_application_complete` | Application submitted | |

**Admin events (internal analytics only):**

| Event Name | Trigger | Properties |
|---|---|---|
| `lead_response_sent` | First message sent to lead | `lead_id`, `minutes_since_created` |
| `quote_sent` | Quote delivered to client | `lead_id`, `quote_value` |
| `quote_accepted` | Client accepts quote | `quote_id`, `quote_value`, `days_since_sent` |
| `job_created` | Job created from accepted quote | `job_id`, `service_type`, `scheduled_date` |
| `job_completed` | Job marked complete | `job_id`, `hours_actual` (when time tracking exists) |
| `qa_approved` | QA review passes job | `job_id`, `first_pass` (boolean) |
| `qa_rework_required` | QA review flags rework | `job_id`, `rework_reason` |
| `invoice_sent` | Invoice delivered | `job_id`, `invoice_amount` |
| `payment_received` | Payment recorded | `invoice_id`, `days_to_payment` |

### 32.2 Attribution model

**First-touch attribution (minimum viable):**

Every lead should carry:
- `utm_source` (google, facebook, direct, referral, yelp, etc.)
- `utm_medium` (organic, paid, social, email, referral)
- `utm_campaign` (specific campaign identifier)
- `landing_page` (first page visited in session)
- `referrer` (HTTP referrer)

Captured in session state by PublicChrome (already implemented per blueprint). Ensure these values persist to the `leads` table on quote request submission.

**Multi-touch attribution (Phase 2):**

Track all touchpoints per lead:
- First visit → return visits → quote form start → submission
- Each touchpoint: date, source, page, action
- Enables analysis of multi-session conversion paths

### 32.3 Dashboard implementation

**Marketing performance tab in UnifiedInsightsClient:**

| Metric | Visualization | Data Source |
|---|---|---|
| Visitors by source | Stacked bar chart (weekly) | Analytics platform (GA4/Plausible) |
| Conversion rate by source | Table with sparkline | conversion_events + analytics |
| Cost per lead by source (when ad spend tracked) | Table | Manual input + lead count |
| Quote form completion rate | Funnel visualization | conversion_events |
| Phone vs form vs AI chat split | Pie chart | conversion_events by type |
| Top landing pages by conversion | Ranked table | conversion_events + landing_page |
| Geographic distribution | Map or table by service area | leads by address/city |

---

## 33. Competitive Intelligence & Market Positioning

### 33.1 Competitor monitoring framework

| Competitor Type | What to Monitor | Frequency | Method |
|---|---|---|---|
| Direct Austin competitors | Pricing, services, Google reviews, website changes | Monthly | Manual review, Google Alerts |
| National franchise operations (ServiceMaster, ABM, Coverall) | Market entry, pricing, service offerings | Quarterly | Website review |
| Technology-forward competitors | Platform features, client portals, booking flows | Quarterly | Website + demo requests |
| New market entrants | Google Maps new listings, Yelp new businesses | Monthly | Search monitoring |

### 33.2 Review monitoring and response

| Platform | Priority | Action |
|---|---|---|
| Google Business Profile | Critical | Monitor daily. Respond to every review within 24 hours. Flag negative reviews for immediate action |
| Yelp | High | Monitor weekly. Respond to all reviews |
| Facebook | Medium | Monitor weekly |
Picking up exactly where it cut off:

---

| Platform | Priority | Action |
|---|---|---|
| Google Business Profile | Critical | Monitor daily. Respond to every review within 24 hours. Flag negative reviews for immediate action |
| Yelp | High | Monitor weekly. Respond to all reviews |
| Facebook | Medium | Monitor weekly |
| BBB | Medium | Maintain listing. Respond to any complaints within 48 hours |
| Thumbtack / HomeAdvisor | Medium (if listed) | Monitor reviews, maintain profile accuracy |
| Nextdoor | Low-Medium | Monitor business mentions |
| Indeed / Glassdoor (employer reviews) | Medium | Monitor for recruiting impact. Respond to negative employee reviews professionally |

**Admin dashboard integration:** Review alert card in overview dashboard. Pulls from Google Business Profile API (or manual entry). Shows new reviews requiring response, average rating trend, review velocity (reviews per month).

**Review response templates:**

| Review Type | Response Framework |
|---|---|
| 5-star positive | Thank by name, reference specific service, invite repeat booking |
| 4-star positive | Thank, acknowledge any noted issue, describe how it's been addressed |
| 3-star mixed | Thank, apologize for shortcomings, describe corrective action, offer to discuss offline |
| 1-2 star negative | Apologize, take accountability, provide direct contact (owner name + phone), do not argue publicly |
| Fake/spam review | Flag for removal through platform's dispute process. Do not engage publicly |

### 33.3 Pricing intelligence

| Data Point | How to Collect | Use |
|---|---|---|
| Competitor per-sqft rates by service type | Mystery shop (request quotes), industry forums, subcontractor network | Validate own pricing is competitive |
| Competitor minimum job charges | Quote requests | Set own minimums appropriately |
| Competitor response times | Track time from quote request to response | Benchmark own SLA |
| Market rate ranges by service | ISSA Cleaning Industry Management Standard, BSCAI benchmarks | Authority in sales conversations |
| Competitor technology offerings | Website review | Identify differentiation opportunities |

**Pricing page consideration:** Many commercial cleaning companies avoid publishing pricing. However, providing ranges or "starting from" indicators is an emerging best practice that pre-qualifies leads and reduces wasted quoting effort. Recommended approach:

| Service | Published Guidance | Notes |
|---|---|---|
| Post-construction cleaning | "$0.15–$0.45 per sqft depending on phase and scope" | Wide range communicates complexity |
| Final clean | "$0.20–$0.50 per sqft" | Reference walkthrough standards |
| Commercial recurring | "Starting from $X/visit for spaces under 5,000 sqft" | Emphasize custom quoting |
| Move-in/out turnover | "$X–$X per unit based on unit size and condition" | Per-unit framing matches PM mental model |
| Windows / power wash | "Starting from $X per pane / $X per sqft exterior" | Simple unit pricing |

---

## 34. Fleet & Equipment Management

### 34.1 Why this matters

A commercial cleaning company's fleet and equipment are among its highest capital expenditures after labor. For post-construction cleaning specifically, specialized equipment is a competitive requirement.

### 34.2 Vehicle fleet management

| Capability | Description | Current State |
|---|---|---|
| Vehicle registry | Year, make, model, VIN, license plate, assigned driver, insurance policy | Missing |
| Maintenance schedule | Oil changes, tire rotation, inspections. Mileage-based or time-based triggers | Missing |
| Maintenance log | Date, service performed, cost, vendor, mileage at service | Missing |
| Fuel tracking | Gallons, cost, mileage. Calculate MPG trends | Missing |
| Insurance tracking | Policy number, coverage amounts, expiration, premium cost per vehicle | Missing |
| Registration renewal | Expiration tracking with advance alerts | Missing |
| Incident reporting | Accidents, damage, traffic violations linked to vehicle and driver | Missing |
| GPS tracking (future) | Real-time vehicle location, route history, idle time | Missing — Tier 4 feature |
| Vehicle assignment | Which crew/employee has which vehicle on which days | Missing |

**Minimum viable implementation:** Vehicle registry with maintenance schedule alerts and insurance expiration tracking. 2-3 days effort. Prevents missed inspections, expired registrations, and insurance lapses.

### 34.3 Equipment management

| Capability | Description | Current State |
|---|---|---|
| Equipment registry | Type, brand, model, serial number, purchase date, cost, warranty expiration | Missing |
| Assignment tracking | Which equipment is assigned to which crew/vehicle | Missing |
| Maintenance schedule | Manufacturer-recommended service intervals | Missing |
| Inspection log | Pre-use inspection results (especially for safety-relevant equipment like scaffolding, ladders, pressure washers) | Missing |
| Calibration tracking | For equipment requiring calibration (pressure gauges, chemical dilution systems) | Missing |
| Replacement planning | Expected lifespan, replacement cost estimate, budget planning | Missing |
| Equipment checkout | Crew checks out specialized equipment for specific jobs, returns after | Missing |

**Equipment categories for commercial cleaning:**

| Category | Examples | Safety Relevance |
|---|---|---|
| Floor care | Auto-scrubbers, burnishers, carpet extractors, wet/dry vacuums | Electrical safety, ergonomic use |
| Pressure washing | Pressure washers (hot/cold), surface cleaners, extension wands | High — pressure injury, electrical, chemical |
| Elevation | Ladders, scaffolding, lifts | Critical — fall protection requirements |
| Construction cleanup | Industrial vacuums, debris removal equipment, dust containment | High — silica dust, debris hazards |
| Chemical application | Sprayers, dilution control systems, foamers | Chemical exposure, proper dilution |
| General | Mops, brooms, carts, microfiber systems, trash receptacles | Low — ergonomic |
| Safety | Hard hats, respirators, eye protection, gloves, first aid kits | Critical — PPE compliance |
| Transportation | Hand trucks, dollies, supply carts | Low — ergonomic |

### 34.4 Admin module addition

**Fleet & Equipment tab** (could be a sub-tab of Inventory or standalone module):

| View | Content |
|---|---|
| Vehicle list | All vehicles with status indicators (maintenance due, insurance expiring) |
| Equipment list | All equipment by category with condition and assignment status |
| Maintenance calendar | Upcoming maintenance due across all vehicles and equipment |
| Alert queue | Items requiring immediate attention (overdue maintenance, expired insurance, failed inspection) |
| Cost tracking | Monthly fleet and equipment costs for profitability analysis |

---

## 35. Emergency & After-Hours Service Model

### 35.1 Why this matters for Austin

- Construction projects often have tight deadlines requiring weekend or evening cleaning
- Property managers need emergency turnover cleaning for unexpected vacancies
- Water damage, vandalism, or break-in cleanup requires rapid response
- After-hours service commands premium pricing (1.5x–2x standard rates)

### 35.2 Emergency service framework

| Element | Description | Platform Impact |
|---|---|---|
| Emergency request intake | Separate quote form path or phone-first with "urgent" flag | Add urgency field to quote request: Standard / Rush (24-48hrs) / Emergency (same day) |
| After-hours routing | Calls/texts outside business hours routed to on-call person | Define on-call rotation in scheduling module. Notification routing based on current on-call |
| Emergency pricing | Automatic premium rate application | Rate card multiplier: 1.5x after-hours, 2x emergency/same-day |
| Rapid dispatch | Streamlined assignment flow for emergency jobs | "Emergency dispatch" action that bypasses normal scheduling queue |
| On-call crew roster | Designated crew available for after-hours calls on rotation | On-call schedule in scheduling module. Visible to employees in portal |
| Emergency supply kit | Pre-packed supply kits for common emergency scenarios | Inventory module: emergency kit tracking with re-stock alerts after use |

### 35.3 Public site additions

- Emergency banner or badge in header: "24/7 Emergency Cleaning Available — Call [number]"
- Emergency service section on relevant service pages (post-construction, commercial)
- Emergency FAQ entries: response time, pricing, scope limitations, how to request
- Emergency CTA in floating panel and AI assistant

### 35.4 After-hours communication protocol

| Time Window | Contact Method | Routing | Response Expectation |
|---|---|---|---|
| Business hours (7 AM - 6 PM CT) | Phone, form, AI chat, email | Normal intake flow | <1 hour acknowledgment |
| After hours (6 PM - 10 PM CT) | Phone, text | On-call admin | <30 min for emergencies, next morning for standard |
| Overnight (10 PM - 7 AM CT) | Text, voicemail | On-call admin notification; response next morning unless true emergency | Next morning unless emergency flagged |
| Weekends | Phone, text | On-call rotation | Same as after-hours weekday |

---

## 36. Warranty & Guarantee Framework

### 36.1 Service guarantee

Industry-standard commercial cleaning companies offer explicit guarantees. This is both a conversion tool and a quality commitment.

**Recommended guarantee structure:**

| Guarantee Element | Description | Platform Implementation |
|---|---|---|
| Satisfaction guarantee | "If you're not satisfied, we'll re-clean at no additional charge within 24 hours" | Rework workflow already exists. Formalize as guarantee in public-facing language |
| Response time guarantee | "Quote response within 4 business hours or your first cleaning is 10% off" | Track in lead pipeline. Auto-flag if SLA breached |
| Walkthrough guarantee | "We'll walk through every job with you before we call it done" | Client walkthrough step in QA workflow |
| Damage protection | "If our crew damages anything, we'll repair or replace it — backed by our $X million GL policy" | Incident reporting → claim workflow → insurance claim tracking |
| Schedule guarantee | "We show up on time or we'll credit $X toward your invoice" | Time tracking → schedule adherence → auto-credit workflow |

### 36.2 Public site integration

- Dedicated guarantee section on homepage (between testimonials and quote form)
- Guarantee callouts on each service page
- Guarantee details on about page (linked to insurance and credentials)
- Guarantee referenced in quote document sent to clients
- FAQ entries explaining guarantee terms and claim process

### 36.3 Guarantee claim workflow (Admin)

| Step | Action | Owner |
|---|---|---|
| Claim received | Client reports unsatisfactory work or damage | Admin logs claim |
| Assessment | Review completion photos, checklist, QA results | Admin |
| Resolution determination | Re-clean, partial credit, full credit, insurance claim | Admin/Owner |
| Execution | Schedule rework, issue credit, or file insurance claim | Admin |
| Client confirmation | Verify client is satisfied with resolution | Admin |
| Root cause and prevention | Update procedures, crew feedback, training if needed | Admin/Owner |
| Metrics update | Track guarantee claim rate, resolution cost, client retention post-claim | System |

---

## 37. Vendor & Supplier Relationship Management

### 37.1 Current state

Inventory module tracks supplies and stock levels. No vendor management exists.

### 37.2 Vendor management framework

| Capability | Description |
|---|---|
| Vendor directory | Company name, contact, products supplied, payment terms, account number |
| Preferred vendor designation | Primary vendor per product category. Backup vendor for supply chain resilience |
| Price tracking | Unit cost per product per vendor. Price history. Comparison across vendors |
| Order management | Purchase order creation → submission → receipt → reconciliation |
| Delivery tracking | Expected delivery date, actual receipt date, discrepancy logging |
| Spend analysis | Monthly/quarterly spend by vendor, by product category |
| Vendor performance | On-time delivery rate, order accuracy, price stability, issue resolution speed |
| Contract terms | Payment terms (Net 30, Net 60), volume discounts, minimum order quantities |
| Auto-reorder triggers | When stock hits par level, auto-generate PO for preferred vendor review |

### 37.3 Supply chain resilience

| Risk | Mitigation |
|---|---|
| Primary vendor stockout | Maintain backup vendor for all critical supplies |
| Price increase | Track pricing trends, negotiate annual contracts for high-volume items |
| Delivery delay | Maintain 2-week buffer stock on critical items. Emergency local source list |
| Product discontinuation | Monitor product availability. Identify substitutes proactively |
| Quality change | Track product effectiveness. Crew feedback on product quality |

### 37.4 Cleaning product standardization

| Category | Standardized Products | Why Standardization Matters |
|---|---|---|
| General purpose cleaner | 1-2 approved products | Consistent results, bulk pricing, simplified training |
| Glass cleaner | 1 approved product | |
| Disinfectant | 1-2 approved (EPA-registered) | Regulatory compliance |
| Floor cleaner (hard surface) | 1-2 by surface type | Prevents surface damage |
| Floor cleaner (carpet) | 1 approved product + pre-treatment | |
| Degreaser | 1 approved product | Chemical safety consistency |
| Restroom cleaner | 1-2 approved products | |
| Stainless steel cleaner | 1 approved product | |
| Post-construction specific | Concrete residue remover, adhesive remover, glass scrub | Specialized — important for quality |
| Green/LEED-compliant alternatives | 1 per category above | For green cleaning program clients |

---

## 38. Multi-Location & Scaling Architecture

### 38.1 When this becomes relevant

- When A&A expands beyond Austin metro (e.g., San Antonio, Dallas, Houston)
- When managing 10+ active crews with territory-based assignment
- When considering franchise or licensing model

### 38.2 Multi-location data model changes

| Entity | Current Model | Multi-Location Model |
|---|---|---|
| Company | Implicit (single) | `locations` table: id, name, address, phone, service_area, timezone |
| Employees | All in one pool | `location_id` on profile. Can be assigned to multiple locations |
| Jobs | No location concept | `location_id` on job. Determines which crews are eligible |
| Leads | No location routing | Auto-route based on service address to nearest location |
| Inventory | Single pool | Per-location inventory with transfer capability |
| Scheduling | Single calendar | Per-location calendars with cross-location visibility for owner |
| Insights | Single view | Per-location and aggregate reporting |
| Clients | Single pool | Clients can span locations. Primary location assignment |

### 38.3 Territory management

| Capability | Description |
|---|---|
| Service territory definition | Zip code or city boundaries per location/crew |
| Lead routing | Inbound leads auto-routed to correct location based on service address |
| Territory overlap rules | How to handle addresses in overlapping territories |
| Territory performance | Revenue, lead volume, conversion rate by territory |
| Expansion analysis | Identify high-demand areas outside current territory for expansion planning |

### 38.4 Franchise/licensing readiness (long-term)

If A&A ever licenses its platform to other cleaning businesses:

| Requirement | Description |
|---|---|
| Multi-tenant data isolation | Each franchise operates in isolated data space |
| Configurable branding | Company name, colors, logo, contact info per tenant |
| Centralized standards | SOPs, checklists, quality standards managed centrally, deployed to tenants |
| Royalty/fee tracking | Revenue reporting per tenant for franchise fee calculation |
| Performance benchmarking | Cross-tenant comparison (anonymized) for best practice identification |

**Note:** This is a Tier 4+ consideration. Mentioned for architectural awareness to avoid decisions now that would make it impossible later.

---

## 39. Accessibility Deep Dive (WCAG 2.1 AA Compliance)

### 39.1 Current infrastructure (from blueprint)

- Skip links ✅
- Focus trap hook ✅
- Status announcer ✅
- Focus-visible rings ✅
- Reduced motion support ✅

### 39.2 Full WCAG 2.1 AA audit checklist

| Criterion | Requirement | Status | Priority |
|---|---|---|---|
| 1.1.1 Non-text Content | All images have alt text | Partial — verify across all pages | High |
| 1.2.1 Audio/Video (prerecorded) | Captions for videos | N/A currently — required when video content added | Medium |
| 1.3.1 Info and Relationships | Semantic HTML structure, proper heading hierarchy | Needs audit | High |
| 1.3.2 Meaningful Sequence | Content order makes sense when linearized | Needs audit | Medium |
| 1.3.4 Orientation | Content not restricted to single orientation | Likely compliant — verify | Low |
| 1.3.5 Identify Input Purpose | Autocomplete attributes on form fields | Needs audit across all forms | Medium |
| 1.4.1 Use of Color | Information not conveyed by color alone | Needs audit (status indicators, alerts) | High |
| 1.4.3 Contrast (Minimum) | 4.5:1 text, 3:1 large text | Needs automated contrast audit | High |
| 1.4.4 Resize Text | Usable at 200% zoom | Needs testing | Medium |
| 1.4.10 Reflow | No horizontal scroll at 320px width | Needs testing | Medium |
| 1.4.11 Non-text Contrast | 3:1 for UI components and graphics | Needs audit (buttons, form fields, icons) | Medium |
| 1.4.12 Text Spacing | Content readable with increased letter/word/line spacing | Needs testing | Low |
| 2.1.1 Keyboard | All functionality keyboard-accessible | Partial — modals handled, verify all interactive elements | High |
| 2.1.2 No Keyboard Trap | Keyboard focus not trapped unexpectedly | Focus trap hook manages this — verify edge cases | High |
| 2.4.1 Bypass Blocks | Skip navigation link | ✅ Exists | Done |
| 2.4.2 Page Titled | Descriptive page titles | Needs audit across all routes | Medium |
| 2.4.3 Focus Order | Logical focus sequence | Needs audit | Medium |
| 2.4.6 Headings and Labels | Descriptive headings and labels | Needs audit | Medium |
| 2.4.7 Focus Visible | Visible focus indicator | ✅ Implemented globally | Done |
| 2.5.3 Label in Name | Accessible name matches visible label | Needs audit on icon-only buttons | Medium |
| 3.1.1 Language of Page | `lang` attribute set | Needs verification in layout.tsx | High (quick fix) |
| 3.1.2 Language of Parts | Language changes marked with `lang` attribute | Required when Spanish content added | Medium |
| 3.3.1 Error Identification | Form errors identified and described | Needs audit across all forms | High |
| 3.3.2 Labels or Instructions | Form fields have visible labels | Needs audit | High |
| 3.3.3 Error Suggestion | Error messages suggest correction | Needs audit | Medium |
| 4.1.1 Parsing | Valid HTML | Run HTML validator | Medium |
| 4.1.2 Name, Role, Value | Custom widgets have correct ARIA | Needs audit (custom selects, accordions, tabs) | High |
| 4.1.3 Status Messages | Status changes announced to screen readers | ✅ StatusAnnouncer implemented | Done |

### 39.3 Automated testing integration

| Tool | Purpose | Integration Point |
|---|---|---|
| axe-core | Automated accessibility rule checking | Add to CI pipeline, run on every PR |
| Lighthouse Accessibility audit | Scoring and catch-all | CI or scheduled runs against production |
| Pa11y | Page-level accessibility testing | CI integration for critical pages |
| eslint-plugin-jsx-a11y | Catch accessibility issues at code time | Add to ESLint config |
| Manual screen reader testing | Verify real assistive tech experience | Quarterly with NVDA (Windows) and VoiceOver (Mac/iOS) |

### 39.4 Accessibility statement page

**Route:** `src/app/(public)/accessibility/page.tsx`

**Content:**
- Commitment to WCAG 2.1 AA compliance
- Known limitations (if any)
- Contact information for accessibility issues
- Third-party audit date (when completed)
- Continuous improvement commitment

**Impact:** Legal protection, demonstrates seriousness about inclusion, increasingly expected by commercial and government clients.

---

## 40. Email Marketing & Nurture Pipeline

### 40.1 Why email matters for commercial cleaning

- Long sales cycles for GC relationships (weeks to months)
- Property managers evaluate multiple vendors before committing
- Repeat business is the revenue engine — email keeps the relationship warm
- Low cost per touch compared to SMS

### 40.2 Email list segmentation

| Segment | Source | Content Strategy |
|---|---|---|
| Quoted but not converted | Leads with sent quotes, no acceptance | Value reinforcement, case studies, limited-time offers |
| Active clients | Clients with jobs in last 90 days | Upsell additional services, seasonal prompts, loyalty |
| Lapsed clients | No job in 90-180 days | Re-engagement, "what's new" updates, special pricing |
| Churned clients | No job in 180+ days | Win-back offers, satisfaction survey |
| GC prospects | Leads identifying as general contractors | Construction-specific content, capability highlights |
| PM prospects | Leads identifying as property managers | Turnover and commercial content, portfolio pricing |
| Blog subscribers | Email captured from resource downloads | Educational content, company updates, soft CTA |
| Job applicants | Employment applications on file | Company culture updates, new opening announcements |

### 40.3 Email sequence definitions

**Sequence 1: New lead welcome (immediate)**
- Email 1 (immediate): Quote acknowledgment + what to expect + company differentiators
- Email 2 (24 hrs if no response): "Did you get our quote?" + value reinforcement
- Email 3 (72 hrs if no response): Case study relevant to their service type
- Email 4 (7 days if no response): "Last chance" + limited availability messaging

**Sequence 2: Post-first-job client nurture**
- Email 1 (24 hrs post-completion): Thank you + completion report link + review request
- Email 2 (7 days): Related service suggestion ("You used post-construction — did you know we also do...")
- Email 3 (30 days): Check-in + recurring service proposal
- Email 4 (60 days): Seasonal service prompt based on calendar

**Sequence 3: Monthly client newsletter**
- Company updates and new capabilities
- Seasonal cleaning tips relevant to their industry
- Featured case study or before/after
- Team spotlight (humanizes the brand)
- Referral program reminder
- Soft CTA for additional services

**Sequence 4: GC-specific nurture**
- Monthly construction market update (Austin permits, project activity)
- Post-construction cleaning best practices
- New project reference or case study
- Capability package link
- Direct owner contact CTA

### 40.4 Email infrastructure

| Component | Recommendation | Current State |
|---|---|---|
| Transactional email (receipts, quotes, notifications) | Resend or SendGrid | Exists |
| Marketing email (sequences, newsletters) | Resend, ConvertKit, or Mailchimp | Missing |
| Email template system | Branded HTML templates matching site design | Missing for marketing |
| List management and segmentation | Integrated with lead/client data in platform | Missing |
| Unsubscribe and preference management | CAN-SPAM compliant per-category opt-out | Missing |
| Deliverability monitoring | SPF, DKIM, DMARC verification + reputation monitoring | Unknown status |
| A/B testing | Subject line and send time testing | Missing |

**Minimum viable implementation:**
1. Add email opt-in checkbox to quote form and contact form
2. Set up Resend (already in stack) or ConvertKit for marketing sequences
3. Build 4 sequence templates above
4. Connect lead/client data for segmentation
5. Implement unsubscribe handling
6. Effort: 3-5 days

---

## 41. Referral Program Design

### 41.1 Program structure

| Element | Design |
|---|---|
| Who can refer | Any active client, any employee, GC partners |
| Referral reward (client) | $X credit toward next service or X% off next job |
| Referral reward (employee) | $X bonus per converted referral (paid on first job completion) |
| Referral reward (GC/PM partner) | Tiered: first referral = X, 5+ referrals = Y, 10+ = preferred pricing |
| Tracking | Unique referral code per referrer. Attributed to lead on intake |
| Payout trigger | Referred lead completes first paid job |
| Expiration | Referral credit valid for 12 months |

### 41.2 Platform implementation

| Component | Description | Location |
|---|---|---|
| Referral code generation | Auto-generated unique code per client/employee | Client directory, employee profile |
| Referral code input | Field on quote request form: "Were you referred? Enter code or name" | Quote form, floating panel, AI assistant |
| Referral tracking dashboard | Admin view: referrals by source, conversion status, rewards owed | New tab in insights or configuration |
| Referral status notification | Notify referrer when their referral books and completes | Automated SMS/email |
| Reward fulfillment | Track reward issuance and redemption | Admin action + client portal visibility |
| Client-facing referral page | Shareable page explaining program, personalized with referrer's code | `src/app/(public)/refer/[code]/page.tsx` |

### 41.3 Referral program public page

**Route:** `src/app/(public)/referral-program/page.tsx`

**Content:**
- How it works (3 steps: share → they book → you earn)
- Reward details
- Shareable link/code
- Social share buttons
- FAQ about referral terms
- CTA to get started (for existing clients: log into portal for your code)

---

## 42. Compliance Calendar & Regulatory Tracking

### 42.1 Annual compliance calendar for Austin commercial cleaning

| Month | Compliance Item | Owner | Platform Tracking |
|---|---|---|---|
| January | OSHA 300A log posting (Feb 1 - April 30) | Admin/Owner | Calendar alert |
| January | W-2 distribution to employees | Bookkeeper | Calendar alert |
| January | 1099 distribution to subcontractors | Bookkeeper | Calendar alert |
| February | OSHA 300A posting begins | Admin | Calendar alert |
| March | Texas Workforce Commission quarterly wage report | Bookkeeper | Calendar alert |
| Quarterly | Texas sales tax filing | Bookkeeper | Calendar alert |
| Quarterly | TWC quarterly wage report | Bookkeeper | Calendar alert |
| Annually | General liability insurance renewal | Owner | Insurance expiry tracking |
| Annually | Workers' compensation renewal | Owner | Insurance expiry tracking |
| Annually | Commercial auto insurance renewal | Owner | Insurance expiry tracking |
| Annually | Business license renewal (City of Austin) | Owner | Calendar alert |
| Annually | Safety training refresh (all employees) | Admin | Training module expiry tracking |
| Annually | HazCom/GHS training refresh | Admin | Training module expiry tracking |
| Annually | Employee handbook acknowledgment | Admin | Document acknowledgment tracking |
| Bi-annually | Fire extinguisher inspection (if in vehicles/office) | Admin | Equipment inspection schedule |
| As needed | New hire I-9 within 3 business days | Admin | Onboarding checklist |
| As needed | OSHA incident reporting (within 24 hrs for hospitalization) | Admin/Owner | Incident reporting workflow |

### 42.2 Admin dashboard integration

**Compliance calendar card** in overview dashboard or configuration module:

- Upcoming compliance deadlines (next 30 days)
- Overdue items highlighted in red
- One-click mark as complete with date and notes
- Annual view showing all recurring compliance items
- Filterable by owner (admin, bookkeeper, owner)

---

## 43. Client Feedback Loop & NPS System

### 43.1 Post-job feedback collection

**Current state:** Post-job rating API exists. Needs full implementation of collection and analysis.

**Enhanced feedback flow:**

| Step | Timing | Method | Content |
|---|---|---|---|
| Immediate satisfaction check | Job completion + 2 hours | SMS | "How did we do today? Reply 1-5" (quick pulse) |
| Detailed feedback request | Job completion + 24 hours | Email | Structured survey: overall rating, specific quality dimensions, NPS question, open comment |
| Review request | Job completion + 72 hours (only if rating ≥ 4) | SMS + Email | "Would you share your experience on Google?" with direct review link |
| Issue follow-up | If rating ≤ 3 | Phone call from owner/admin within 4 hours of rating receipt | Personal attention to dissatisfaction |

### 43.2 NPS (Net Promoter Score) implementation

**The question:** "On a scale of 0-10, how likely are you to recommend A&A to a colleague?"

| Score | Category | Action |
|---|---|---|
| 9-10 | Promoter | Auto-trigger review request + referral program invite |
| 7-8 | Passive | Thank you + ask what would make it a 10 |
| 0-6 | Detractor | Immediate alert to owner. Personal follow-up within 4 hours. Recovery protocol |

**NPS calculation:** (% Promoters − % Detractors) = NPS score

**Dashboard addition:** NPS trend chart in insights module. NPS by service type, by crew, by client segment. Monthly/quarterly trend with target.

**Industry benchmark:** Commercial cleaning NPS averages 20-30. Target 50+ as differentiator.

### 43.3 Quality dimension ratings

Beyond overall satisfaction, rate specific dimensions:

| Dimension | Question | Scale |
|---|---|---|
| Quality | "How would you rate the cleaning quality?" | 1-5 stars |
| Timeliness | "Did the crew arrive on time and complete on schedule?" | 1-5 stars |
| Communication | "How was communication before and during the job?" | 1-5 stars |
| Professionalism | "How professional was the crew?" | 1-5 stars |
| Value | "How would you rate the value for the price?" | 1-5 stars |

**Operational use:**
- Dimension scores below 4.0 trigger investigation and corrective action
- Dimension trends identify systemic issues (e.g., consistently low timeliness = scheduling problem)
- High-scoring dimensions become marketing talking points

### 43.4 Feedback-to-improvement loop

| Signal | Threshold | Action |
|---|---|---|
| Single job rating ≤ 2 | Any occurrence | Immediate owner notification, same-day client contact, crew debrief |
| Crew average rating < 4.0 | Rolling 10-job average | Performance review, additional training, potential reassignment |
| Service type average < 4.0 | Rolling 30 days | SOP review, process improvement, potential pricing adjustment |
| NPS drops below 30 | Quarterly measurement | Strategic review: operations, staffing, client communication |
| Specific dimension consistently low | 3+ months below 4.0 | Targeted improvement initiative for that dimension |

---

## 44. Insurance & Bonding Program Detail

### 44.1 Required insurance for Austin commercial cleaning

| Policy Type | Minimum Recommended | GC Typical Requirement | Why |
|---|---|---|---|
| Commercial General Liability (CGL) | $1M per occurrence / $2M aggregate | $1M/$2M minimum, some require $5M | Property damage, bodily injury to third parties |
| Workers' Compensation | Texas statutory limits | Required by most GCs | Employee injury coverage. Texas doesn't mandate WC but GCs do |
| Commercial Auto | $1M combined single limit | $1M minimum | Vehicle accidents during business operations |
| Umbrella/Excess | $1M-$5M | Often $2M-$5M for larger projects | Additional coverage above primary policy limits |
| Employee Dishonesty/Crime Bond | $25K-$100K | Sometimes required for office/commercial access | Theft by employees |
| Professional Liability (E&O) | $500K-$1M | Rarely required for cleaning | Errors in service delivery |
| Inland Marine / Equipment Floater | Replacement value of equipment | Rarely required | Covers equipment in transit or at job sites |

### 44.2 Platform insurance management features

| Feature | Description |
|---|---|
| Policy registry | All active policies with carrier, policy number, limits, premium, effective/expiry dates |
| Renewal alerts | 90/60/30-day alerts before expiration |
| Certificate of Insurance (COI) storage | Current COI PDF for each policy. One-click access |
| Additional insured tracking | Which clients require additional insured endorsement. Track endorsement issuance |
| Claims history | Log all claims with date, type, amount, status, resolution |
| Premium tracking | Annual premium by policy type. Trend over time for budgeting |
| Insurance spend in job costing | Allocate insurance cost as overhead in profitability analysis |
| Audit preparation | Compile payroll and revenue data needed for annual insurance audit |

### 44.3 Bonding

**Janitorial bond / employee dishonesty bond:**
- Protects clients against theft by cleaning crew
- Increasingly required for office, medical, and institutional cleaning
- Typical coverage: $25K-$100K
- Platform should display bond status on public site and include in capabilities package

---

## 45. Industry Association & Certification Roadmap

### 45.1 Relevant industry associations

| Association | Relevance | Benefits | Cost |
|---|---|---|---|
| ISSA (International Sanitary Supply Association) | Primary industry association for commercial cleaning | Training resources, certifications, industry data, networking, credibility | $500-1,500/year |
| BSCAI (Building Service Contractors Association International) | Specific to building service contractors | Best practices, benchmarking, management resources | Included with ISSA membership |
| Austin Chamber of Commerce | Local business networking and credibility | Referrals, events, directory listing, community trust | $300-1,000/year |
| Associated Builders and Contractors (ABC) Texas | GC networking | Direct access to GC relationships, bid opportunities, safety training | $500-2,000/year |
| Associated General Contractors (AGC) Austin | GC networking | Similar to ABC, more established GC network | $500-1,500/year |
| BBB (Better Business Bureau) | Consumer trust signal | BBB accreditation badge, complaint resolution process | $400-1,000/year |

### 45.2 Industry certifications

| Certification | Issuing Body | Relevance | Effort | Impact |
|---|---|---|---|---|
| ISSA CIMS (Cleaning Industry Management Standard) | ISSA | Gold standard for cleaning operations maturity | Significant (audit-based) | Major competitive differentiator for large contracts |
| ISSA CIMS-GB (Green Building) | ISSA | Green cleaning program certification | Additional to CIMS | Required for some LEED building contracts |
| GBAC STAR (Global Biorisk Advisory Council) | ISSA/GBAC | Facility accreditation for cleaning, disinfection, and infection prevention | Moderate | Post-COVID credibility for health-sensitive facilities |
| OSHA 10/30 Hour | OSHA | Safety training certification for crew | 10 or 30 hours per person | Required or strongly preferred for construction site access |
| CMI (Certified Maintenance & Reliability Technician) | Individual crew certification | Advanced cleaning techniques | Per individual | Premium service justification |

### 45.3 Public site integration

**Credentials section** (About page and footer):
- Association membership logos with verification links
- Certification badges with issue dates
- "Our team holds X combined hours of OSHA safety training"
- Insurance summary with coverage amounts (not policy numbers)
- Bond coverage confirmation

**Capabilities package:** Auto-include all current certifications and memberships with expiration tracking.

---

## 46. Notification & Alert Priority Framework

### 46.1 Alert severity classification

Not all notifications are equal. The system should route and present alerts based on business impact severity.

| Severity | Examples | Routing | Response Expectation |
|---|---|---|---|
| Critical (P0) | Safety incident, client emergency, system outage, insurance expiration today | SMS + Push + Email to owner immediately. Override quiet hours | Within 15 minutes |
| Urgent (P1) | New lead (SLA clock starts), QA failure, crew no-show, low-stock on critical supply | SMS + Push to assigned admin. Respect quiet hours unless override configured | Within 1 hour |
| Important (P2) | Quote expiring soon, job scheduled tomorrow needs confirmation, compliance deadline in 7 days | Push + Email to assigned admin | Within 4 hours |
| Standard (P3) | New application received, supply request submitted, job completed successfully | Email + in-app notification | Within 24 hours |
| Informational (P4) | Weekly digest, monthly report available, training reminder | Email only | No urgency |

### 46.2 Notification channel selection logic

| Channel | Best For | Limitations |
|---|---|---|
| SMS | Time-sensitive alerts, field crew communication, client confirmations | Cost per message, character limits, opt-out management |
| Push notification (web/PWA) | In-app alerts for active users, admin notifications | Requires notification permission, not guaranteed delivery |
| Email | Detailed information, documents, non-urgent communication | Slower response, inbox competition |
| In-app banner | Contextual alerts while user is active in platform | Only seen when user is in the app |
| Phone call (escalation) | True emergencies that require immediate human response | Manual or automated voice call. Highest urgency signal |

### 46.3 Escalation protocol

| Condition | Escalation |
|---|---|
| P0 alert not acknowledged in 15 minutes | Re-send to owner + backup contact via SMS and phone call |
| P1 alert not acknowledged in 1 hour | Escalate to owner via SMS |
| Lead not responded to in 4 hours | Alert in overview dashboard + SMS to admin |
| Quote not reviewed by client in 48 hours | Auto-trigger follow-up sequence |
| Job not started within 30 min of scheduled time | Alert admin + contact crew lead |
| Compliance item overdue | Daily reminder until completed or dismissed with reason |

---

## 47. Testing & Quality Assurance Strategy for the Platform Itself

### 47.1 Testing layers

| Layer | Purpose | Current State | Recommended |
|---|---|---|---|
| Unit tests | Individual function/component correctness | Unknown | Jest for utilities, API helpers, business logic |
| Component tests | UI component behavior in isolation | Unknown | React Testing Library for complex components |
| Integration tests | API route → database → response chain | Unknown | Supertest or similar for API routes |
| End-to-end tests | Full user flows across browser | E2E guide exists as manual runbook | Playwright for critical paths |
| Visual regression | Catch unintended UI changes | Missing | Chromatic or Percy on PR builds |
| Accessibility tests | Automated a11y rule checking | Missing | axe-core in CI |
| Performance tests | Load time, Core Web Vitals | Missing | Lighthouse CI |
| Security tests | Vulnerability scanning, dependency audit | Missing | `npm audit` in CI, Snyk or Socket |

### 47.2 Critical path test coverage (priority)

These are the flows where bugs have the highest business impact:

| Critical Path | Steps to Test | Priority |
|---|---|---|
| Quote request submission | Fill form → submit → lead created in DB → admin notification sent | P0 |
| Quote creation and send | Admin creates quote → sends → client receives email with token link | P0 |
| Quote acceptance | Client opens token link → reviews → accepts → job created | P0 |
| Employee assignment and execution | Job assigned → employee sees in portal → starts → completes checklist → uploads photos → marks complete | P0 |
| QA review and completion report | Admin reviews completed job → approves → completion report generated | P0 |
| Login and auth flows | Admin login → redirect to dashboard. Employee login → redirect to portal | P0 |
| Phone number display | Correct business phone renders on every page with `tel:` link | P0 (SB-1) |
| Payment flow (when Stripe added) | Invoice → pay → payment recorded | P0 |
| Lead follow-up sequence | Automated messages sent at correct intervals | P1 |
| Scheduling conflict detection | Overlapping job assignment blocked | P1 |
| Offline photo upload and sync | Take photo offline → queue → sync when online | P1 |
| RLS enforcement | Employee cannot access other employees' assignments. Client cannot access other clients' data | P0 (security) |

### 47.3 CI/CD pipeline additions

| Stage | Tool | Trigger |
|---|---|---|
| Lint | ESLint + eslint-plugin-jsx-a11y | Every PR |
| Type check | TypeScript compiler | Every PR |
| Unit + component tests | Jest + React Testing Library | Every PR |
| API integration tests | Jest + Supertest | Every PR |
| Accessibility audit | axe-core | Every PR |
| E2E critical paths | Playwright | Pre-deploy to production |
| Lighthouse performance | Lighthouse CI | Weekly scheduled + pre-deploy |
| Dependency vulnerability | `npm audit` + Snyk | Daily scheduled |
| Visual regression | Chromatic | Every PR with UI changes |

---

## 48. Incident Response Plan

### 48.1 Incident classification

| Severity | Definition | Examples |
|---|---|---|
| SEV-1 | Complete service outage or data breach | Platform fully down, database compromised, customer data exposed |
| SEV-2 | Major feature broken affecting revenue | Quote forms not submitting, employee portal inaccessible, payment processing failed |
| SEV-3 | Minor feature broken, workaround available | One admin module not loading, email notifications delayed, cosmetic issue |
| SEV-4 | Cosmetic or low-impact issue | Typo, minor styling issue, non-critical feature edge case |

### 48.2 Response protocol

**SEV-1: Complete outage or data breach**

| Step | Action | Timeline | Owner |
|---|---|---|---|
| Detection | Uptime monitor alert or user report | Immediate | Automated |
| Acknowledgment | Confirm incident, assess scope | Within 15 min | Developer/Owner |
| Containment | Stop the bleeding (take compromised service offline, rotate credentials if breach) | Within 30 min | Developer |
| Communication | Notify affected clients via backup communication (phone/personal email) | Within 1 hour | Owner |
| Resolution | Fix root cause, restore service | ASAP — target <4 hours | Developer |
| Verification | Confirm all functions operational, data integrity intact | Post-fix | Developer |
| Post-mortem | Document root cause, impact, timeline, prevention measures | Within 48 hours | Developer + Owner |

**SEV-2: Major feature broken**

| Step | Action | Timeline |
|---|---|---|
| Detection | User report or monitoring alert | ASAP |
| Assessment | Identify affected feature, impact scope, workaround | Within 30 min |
| Workaround communication | Inform affected users of temporary alternative | Within 1 hour |
| Fix | Deploy patch | Within 4-8 hours |
| Verification | Test fix in production | Post-deploy |

### 48.3 Data breach specific protocol

| Step | Action | Timeline |
|---|---|---|
| Confirm breach scope | What data was accessed? Which clients/employees affected? | Within 1 hour |
| Contain | Revoke compromised access, rotate all credentials | Immediate |
| Legal notification | Texas law requires breach notification within 60 days. Consult attorney | Within 24 hours |
| Client notification | Personal notification to affected clients with description of exposure and protective measures | Per legal counsel |
| Employee notification | Personal notification if employee data exposed | Per legal counsel |
| Insurance claim | Notify cyber insurance carrier if applicable | Within 48 hours |
| Remediation | Fix vulnerability, enhance controls, document changes | Within 1 week |

### 48.4 Runbook maintenance

All incident response procedures should be:
- Documented in a location accessible even if the platform is down (Google Drive, printed copy)
- Reviewed quarterly
- Tested annually (tabletop exercise)
- Updated after every actual incident

---

## 49. Growth Stage Readiness Checklist

### 49.1 Stage 1: Startup (0-20 jobs/month, 1-3 crews)

| Requirement | Status | Notes |
|---|---|---|
| Working public site with real content | Partial — needs identity content | Blocker |
| Real phone number on all pages | Missing | SB-1 blocker |
| Quote request → admin pipeline | ✅ | Working |
| Basic scheduling | ✅ | Working |
| Employee task execution | ✅ | Working |
| QuickBooks sync for invoicing | ✅ | Working |
| Google Business Profile | Missing | Critical for local discovery |
| 5+ Google reviews | Missing | Need review generation pipeline |
| Analytics tracking | Missing | Can't optimize what you can't measure |
| Owner doing most admin tasks personally | Expected at this stage | Platform reduces but doesn't eliminate admin time |

### 49.2 Stage 2: Growth (20-50 jobs/month, 3-8 crews)

| Requirement | Status | Notes |
|---|---|---|
| All Stage 1 items | See above | |
| Automated lead follow-up | Missing | Revenue directly left on table without this |
| Recurring job scheduling | Missing | Manual recreation is admin time drain |
| Time tracking for job costing | Missing | Can't calculate profitability |
| Client portal | Missing | Reduces admin call volume significantly |
| Full Spanish employee portal | Partial | Operational necessity at scale |
| Blog with 10+ posts | Missing | Organic traffic engine for sustainable leads |
| Review generation automated | Missing | Compounds over time |
| 25+ Google reviews | Depends on pipeline | Social proof threshold for trust |
| Dedicated ops manager role | Depends on hiring | Platform supports role-based access |
| Subcontractor relationships for overflow | Not in platform | Needed for demand spike handling |

### 49.3 Stage 3: Scale (50-100+ jobs/month, 8-15+ crews)

| Requirement | Status | Notes |
|---|---|---|
| All Stage 1 + 2 items | See above | |
| Job costing and profitability analysis | Missing | Required for strategic decisions at scale |
| Multi-day job support | Missing | Construction projects demand this |
| Punch list management | Missing | GC relationship table-stakes |
| Customer health scoring | Missing | Retention becomes critical revenue driver |
| Full role-based access | Missing | Owner can't review everything personally |
| Route optimization | Missing | Fuel and time savings compound at scale |
| NPS tracking | Missing | Quality culture maintenance at scale |
| Compliance calendar | Missing | Regulatory risk increases with employee count |
| SLA tracking and enforcement | Missing | Client expectations formalize at scale |
| 100+ Google reviews | Depends on pipeline | Market authority signal |
| Insurance program matured | Not tracked in platform | Larger contracts demand higher limits |
| ISSA CIMS certification | Not started | Competitive weapon for large contracts |

### 49.4 Stage 4: Market leadership (100+ jobs/month, 15+ crews)

| Requirement | Status | Notes |
|---|---|---|
| All previous stages | See above | |
| Multi-location support | Not in architecture | Needed for geographic expansion |
| Advanced analytics and forecasting | Missing | Predictive capacity planning |
| Integration with construction management (Procore) | Missing | Embedded in GC workflows |
| Integration with property management software | Missing | Embedded in PM workflows |
| Capabilities package auto-generation | Missing | Sales tool for enterprise contracts |
| White-label completion reports | Missing | Client-branded deliverables |
| AI scope estimation | Missing | Technology differentiator |
| Bid management system | Missing | Formal RFP process for large contracts |
| Platform as sales demo | Partially possible | Formalize demo environment and flow |
| Franchise/licensing readiness | Not in architecture | If expanding through partners |

---

## 50. Document Maintenance Protocol for This Addendum

This addendum follows the same maintenance rules as the primary expansion document:

**Update triggers:**
- New section added to the primary expansion document that warrants deeper specification here
- Industry regulation or standard changes affecting commercial cleaning in Texas
- Platform capabilities are implemented that resolve gaps identified in this addendum
- Business stage transition (startup → growth → scale) shifts priority weighting
- Competitive landscape changes requiring strategic response
- New integration or technology option becomes relevant

**Review cadence:** Quarterly at minimum. Monthly during active development sprints. After every significant platform deployment.

**Cross-reference integrity:** All section references to the primary blueprint (`website-blueprint.md`) and the primary expansion document (`expansion-maturity-roadmap.md`) must be verified on each review cycle.

---

## Change Log

- 2026-04-13: Initial addendum creation. Sections 15-50 covering safety/compliance, customer lifecycle, financial operations, estimating, workforce development, quality management, document management, communication automation, green cleaning, customer portal, role-based access, mobile/offline, video content, seasonal planning, subcontractor management, data governance, disaster recovery, analytics implementation, competitive intelligence, fleet/equipment, emergency services, warranty/guarantee, vendor management, multi-location, accessibility deep dive, email marketing, referral program, compliance calendar, NPS/feedback, insurance/bonding, industry associations, notification priority, platform testing, incident response, and growth stage readiness.

## Section 51: Strategic Recalibration — What Changes Given the Real Business

Everything written so far assumed a generic commercial cleaning company. Your answers reveal specific dynamics that shift priorities significantly.

---

### 51.1 The core strategic shift: Subcontractor → Prime contractor

This is the single most important thing the website needs to accomplish.

Right now, your mom gets work distributed to her by larger companies. She does the work, they take a margin. The website's job is to flip that: **property managers, GCs, building owners, restaurant groups, and facility managers find her directly, hire her directly, and she captures the full contract value.**

This changes what the website needs to communicate:

| Current positioning (implicit) | Required positioning |
|---|---|
| "We're a cleaning company" | "We're the operations-grade cleaning partner that the big companies send when quality matters" |
| Generic service list | "We handle the jobs that other companies can't get right the first time" |
| No proof of scale | "We manage X buildings across Austin with a dedicated team and real-time quality tracking" |
| Anonymous | "Founded by [Mom's name], who has [X] years of experience across commercial, construction, and facility cleaning" |

**What this means for the website:**
- The homepage hero should not sound like every other cleaning company. It should sound like a company that GCs and PMs already trust with their hardest projects — because they do
- The about page is the most important page for this transition. Decision-makers for $10K-$50K+ contracts will read it
- "How we work" content (timeline, employee portal screenshots, QA process) is the competitive weapon. No competitor in Austin has this

### 51.2 Service page recalibration

Your mom does NOT want residential/maid-style cleaning. The current service pages need reframing:

| Current Page | Keep/Reframe | Target Buyer | Adjusted Positioning |
|---|---|---|---|
| Post-construction cleaning | Keep — core service | GCs, developers | Emphasize: multi-phase capability, debris handling, timeline reliability |
| Final clean | Keep — core service | GCs, developers | Emphasize: walkthrough-ready standard, punch list integration |
| Commercial cleaning | Keep — growth target | Facility managers, business owners | Reframe toward: restaurants, medical, venues, corporate offices. NOT generic janitorial |
| Move-in/move-out | Reframe | Property managers ONLY | Remove any language that sounds residential. Frame as "unit turnover cleaning for property managers managing 50+ units" |
| Windows/power wash | Keep as add-on | PMs, building owners | Position as complement to other services, not standalone lead generator |

**New service framing opportunities based on her actual targets:**

| Target Vertical | What They Need | How to Frame It |
|---|---|---|
| Restaurants/food service | Health dept inspection readiness, kitchen deep clean, hood/exhaust areas | "Restaurant deep cleaning that passes health inspections the first time" |
| Medical/dental offices | Disinfection protocols, compliance documentation, after-hours scheduling | "Medical-grade facility cleaning with documented compliance" |
| Event venues | Pre/post-event turnaround, flexible scheduling, fast execution | "Event venue cleaning with same-day turnaround capability" |
| Corporate offices | After-hours service, consistent recurring quality, professional appearance | "Office environments that reflect your company's standards" |
| Apartment complexes (bulk) | Multi-unit turnover speed, consistent quality across units, PM reporting | "Portfolio-scale turnover cleaning for property management companies" |

Consider adding industry-specific landing pages for restaurants, medical, and event venues. These are high-value, less competitive keyword targets in Austin.

### 51.3 The proof problem — and how to solve it automatically

Your mom is great at the work but bad at marketing herself. This is extremely common with skilled operators. The platform needs to **build her marketing assets automatically** as a byproduct of doing the work:

| Asset Needed | How the Platform Builds It |
|---|---|
| Before/after photos | Employee portal already captures completion photos. Add "before" photo requirement at job start. These become portfolio assets |
| Project examples | Every completed job with QA approval + photos becomes a potential case study. Admin "promote to portfolio" button |
| Testimonials | Post-job rating flow asks for written feedback. High-rated responses auto-flagged as testimonial candidates |
| Verified metrics | Database already tracks: jobs completed, clients served, buildings cleaned. Authority bar pulls live numbers |
| Response time proof | Lead pipeline timestamps prove response speed. Display average on site |
| Quality proof | QA pass rate calculated from real data. Display on site |

**This is the most important insight for your situation:** The platform doesn't just run the business — it generates marketing evidence as a side effect of running the business. Every job completed through the system makes the website more credible.

### 51.4 The employee portal as your mom's proxy

Right now your mom is on-site every day ensuring quality. The goal is for her to manage, not execute. The employee portal is what makes that possible:

- **Checklists** = her quality standards, followed without her being there
- **Completion photos** = her eyes on the work, remotely
- **Issue reporting** = problems surface to her immediately instead of being discovered later
- **QA review** = she approves work from the dashboard, not the job site

This reframes the employee portal from "nice feature" to **"the thing that lets mom step back from the front lines."** Every gap in the employee portal is a reason she has to stay in the field.

---

## Section 52: Portfolio & Evidence Automation System

This fills a gap in all previous docs. The platform should systematically build a library of proof assets.

### 52.1 Photo evidence pipeline

```
Job created → "Before" photos required at check-in
  → Progress photos (optional, multi-day jobs)
  → "After" photos required at completion
  → QA review approves quality
  → Admin tags best photos as "portfolio-ready"
  → Portfolio photos available for:
     - Website (case studies, service pages, before/after slider)
     - Google Business Profile posts
     - Social media
     - Proposals/capabilities package
     - Client-facing completion reports
```

**Employee portal changes:**
- Add "before photo" capture step that activates when job status moves to "in progress"
- Require minimum 3 photos before job can be marked complete: 1 before, 2 after (different areas)
- Photo tagging: area/room type, before/during/after

**Admin additions:**
- Photo library view: all portfolio-ready photos, filterable by service type, date, client
- "Use on website" action that makes photo available for public pages
- Bulk photo export for social media or print materials

### 52.2 Testimonial collection automation

```
Job completed + QA approved
  → 24hr: satisfaction rating request (SMS)
  → If rating ≥ 4: "Would you mind sharing a brief comment about your experience?"
  → If comment received + rating = 5: auto-flag as testimonial candidate
  → Admin reviews, approves, assigns to relevant service page
  → 72hr: "Would you share this on Google?" with direct review link
```

This is how you solve the "mom won't collect testimonials" problem. The system does it for her, every single time.

### 52.3 Metrics automation

The authority bar and about page should pull from live data, not hardcoded numbers:

| Metric | Source | Update Frequency |
|---|---|---|
| Projects completed | `COUNT(jobs WHERE status = 'completed')` | Real-time |
| Buildings/facilities served | `COUNT(DISTINCT client_id FROM jobs WHERE status = 'completed')` | Real-time |
| Years in business | Hardcoded founding year, calculated | Real-time |
| Client satisfaction rate | `AVG(rating) FROM post_job_ratings` | Real-time |
| Average response time | `AVG(first_response_time) FROM leads` | Weekly |
| Repeat client rate | Calculated from client job frequency | Monthly |

Once this is live, the SB-3 (unverified metrics) issue resolves itself permanently — the numbers are always true because they come from real data.

---

## Section 53: Sales Enablement & Outbound Toolkit

Your mom's growth depends on winning direct contracts. The website should produce sales tools, not just be a passive lead catcher.

### 53.1 One-page leave-behind (PDF generator)

When mom meets a GC or PM at a job site, networking event, or bid meeting, she needs something to hand them. The website should generate a branded one-pager:

**Content:**
- Company name, logo, tagline
- Owner name and direct phone
- Top 3 services with one-line descriptions
- 2-3 proof points (projects completed, satisfaction rate, response time)
- QR code linking to the website
- "Scan for an instant quote" CTA

**Implementation:** Server-rendered PDF from company data. Generated from admin dashboard. Updated when data changes. Printable and email-attachable.

### 53.2 Digital proposal template

For contracts over $5K, a quote email isn't enough. The system should generate a professional proposal:

**Sections:**
1. Cover page with client name and project summary
2. Company overview (pulled from about page content)
3. Scope of work (from quote line items and scope fields)
4. Methodology (from service SOP content)
5. Timeline and scheduling
6. Team and quality assurance process (describe the employee portal, QA review, completion reports)
7. Pricing
8. Insurance and credentials summary
9. Terms and conditions
10. Acceptance signature block

**The QA process description is the sales weapon.** When a PM reads that your mom's company uses a digital platform with checklists, photo documentation, and formal QA review — and their current vendor just sends a crew and says "it's done" — that's the differentiator that wins the contract and justifies premium pricing.

### 53.3 QR code strategy

Simple but effective for a field-based business:

| Placement | QR Destination | Purpose |
|---|---|---|
| Business cards | Homepage | General credibility |
| Vehicle signage | Quote request page | Passive lead generation from vehicles at job sites |
| Leave-behind one-pager | Quote page with UTM params | Track offline-to-online conversion |
| Crew uniforms/badges (optional) | About page or careers | Recruiting and professionalism signal |
| Job site signage (if allowed by client) | Service page for that service type | Visibility at active projects |

---

## Section 54: Advertising & Paid Acquisition Framework

You mentioned money will need to go into advertising. Here's the framework.

### 54.1 Budget allocation by stage

**Months 1-3 after launch (proving the funnel works):**

| Channel | Monthly Budget | Purpose |
|---|---|---|
| Google Business Profile optimization | $0 (time only) | Foundation — must be done before spending money |
| Google Ads — Search | $500-$1,000 | Capture high-intent searches: "commercial cleaning Austin", "post construction cleaning Austin" |
| Google Ads — Local Services | $300-$500 | Pay-per-lead, Google Guaranteed badge |
| Meta (Facebook/Instagram) Ads | $200-$400 | Retargeting website visitors, before/after showcase |
| Total | $1,000-$1,900/month | |

**Months 4-6 (scaling what works):**
- Double budget on whichever channel has best cost-per-lead
- Add LinkedIn ads if targeting corporate/medical facilities ($300-$500/month)
- Begin organic content (blog posts) to reduce paid dependency over time

### 54.2 Google Ads specifics for commercial cleaning

**Campaign structure:**

| Campaign | Keywords | Landing Page | Expected CPC |
|---|---|---|---|
| Post-construction | "post construction cleaning Austin", "builder clean Austin", "construction cleanup near me" | Post-construction service page | $8-$15 |
| Commercial | "commercial cleaning Austin", "office cleaning Austin", "janitorial service Austin" | Commercial cleaning service page | $5-$12 |
| Turnover/apartment | "apartment turnover cleaning Austin", "move out cleaning property manager" | Move-in/move-out service page | $4-$10 |
| Brand | "A&A cleaning Austin", company name variations | Homepage | $1-$3 |

**Conversion tracking (critical):**
- Quote form submission → Google Ads conversion event
- Phone call from ad → Google call tracking or forwarding number
- AI chat initiation → Conversion event
- The conversion_events table in your database should feed this

### 54.3 Google Local Services Ads

This is potentially the highest-ROI channel for a local cleaning company:

- You only pay for actual leads (calls or messages), not clicks
- "Google Guaranteed" badge appears on your listing — massive trust signal
- Requires: background check on owner, insurance verification, license verification
- Cost per lead: $15-$40 depending on service type
- Leads appear above regular search results and above regular Google Ads

**Prerequisite:** Google Business Profile must be fully optimized first.

### 54.4 Website conversion tracking setup

Before spending any money on ads, the website needs:

| Tracking Element | Implementation | Effort |
|---|---|---|
| Google Analytics 4 (GA4) | Script in PublicChrome | 1 hour |
| Google Ads conversion tracking | Conversion event on quote submission + phone click | 2 hours |
| Google Tag Manager | Container for managing all tracking scripts | 1 hour |
| Facebook Pixel | For retargeting website visitors | 1 hour |
| Call tracking | Google forwarding number or CallRail ($45/month) | 1-2 hours |
| UTM parameter persistence | Already in PublicChrome — verify it writes to leads table | 1 hour |

**Total setup: 1 day of work. Must be done before spending any ad money.**

---

## Section 55: Job Board & Recruiting Pipeline

Your mom needs high-quality employees. The website + external job boards should work together.

### 55.1 Job posting distribution

| Platform | Relevance | Cost | Integration |
|---|---|---|---|
| Indeed | Primary for cleaning/labor roles | Free basic posting, $5-$15/day sponsored | Post manually, link application to website careers page |
| Facebook Jobs | Good for Austin local labor market | Free | Post from business page, link to careers page |
| Craigslist Austin | Still effective for hourly labor | $10-$25 per posting | Post manually, link to careers page |
| Google for Jobs | Aggregates from website | Free — requires JobPosting schema markup | Add structured data to careers page |
| LinkedIn | Better for crew lead/supervisor roles | Free basic, $30-$100/day sponsored | Post manually for senior roles |
| Glassdoor | Employer brand building | Free basic profile | Claim profile, encourage employee reviews |
| Nextdoor | Local community hiring | Free | Post in hiring section |

### 55.2 Careers page enhancements for recruiting

The current careers page has an application form but no employer value proposition. For a competitive Austin labor market, it needs:

**Must-have content (from your mom):**
- Pay range (even a range: "$16-$22/hr depending on experience and role")
- Schedule expectations (hours, days, full-time vs part-time options)
- "What makes this different from other cleaning jobs" — this is key
- Real team photos
- Spanish-language version or bilingual toggle

**Positioning for quality workers:**
- Emphasize training and skill development
- Mention the technology platform (employee portal) as a sign of a professional operation
- Growth path: cleaning tech → crew lead → site supervisor
- Consistent hours, professional equipment, organized operation
- "You're not just cleaning — you're part of a team that GCs and PMs specifically request"

### 55.3 Google for Jobs schema

Add `JobPosting` structured data to the careers page:

```json
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Commercial Cleaning Technician",
  "description": "...",
  "datePosted": "2025-04-13",
  "employmentType": "FULL_TIME",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "A&A Commercial Cleaning",
    "sameAs": "https://www.aandaservices.com"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Austin",
      "addressRegion": "TX"
    }
  },
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": {
      "@type": "QuantitativeValue",
      "minValue": 16,
      "maxValue": 22,
      "unitText": "HOUR"
    }
  }
}
```

This makes the job posting appear in Google search results for free. High-value, 30 minutes of work.

---

## Section 56: Google Business Profile as the #1 Lead Engine

For a local service business, Google Business Profile (GBP) is often more important than the website itself for the first 6-12 months. It deserves dedicated attention.

### 56.1 GBP optimization checklist

| Element | Status | Priority | Action |
|---|---|---|---|
| Business name matches website exactly | Unknown | Critical | Verify |
| Primary category: "Commercial Cleaning Service" | Unknown | Critical | Set correctly — this affects which searches you appear for |
| Secondary categories | Unknown | High | Add: "Post Construction Cleaning Service", "Janitorial Service", "Building Cleaning Service" |
| Business description (750 char) | Unknown | High | Write keyword-rich description matching website positioning |
| Service area (not physical address, since this is a service-area business) | Unknown | Critical | Set to Austin metro + surrounding cities |
| Services listed with descriptions | Unknown | High | Match website service pages |
| Business hours | Unknown | High | Set accurately |
| Phone number matches website | Unknown | Critical | Must match SB-1 fix

Picking up exactly where it cut off:

---

| Element | Status | Priority | Action |
|---|---|---|---|
| Phone number matches website | Unknown | Critical | Must match exactly — NAP consistency is a ranking factor |
| Website URL | Unknown | Critical | Link to homepage with UTM: `?utm_source=google&utm_medium=organic&utm_campaign=gbp` |
| Photos (exterior, interior, team, work) | Unknown | Critical | Upload 20-30 real photos. GBP listings with photos get 42% more direction requests and 35% more click-throughs |
| Logo | Unknown | High | Upload current logo, matches website |
| Cover photo | Unknown | High | Best before/after or crew-at-work photo |
| Google Posts (weekly updates) | Unknown | High | Weekly posts: completed projects, tips, offers. Keeps profile active in algorithm |
| Q&A section | Unknown | Medium | Pre-populate with common questions and answers (you can ask and answer your own) |
| Booking link | Unknown | High | Link to quote request page |
| Messaging enabled | Unknown | Medium | Enable if mom can respond within hours |
| Products/services with pricing | Unknown | Medium | Add service descriptions with "starting from" pricing |

### 56.2 Review generation strategy

This is the single highest-leverage marketing activity for the first 6 months after launch.

**The math:**
- Average Austin cleaning company has 15-40 reviews
- Getting to 25+ reviews with 4.8+ average puts you in the top tier for local search
- Each review improves local ranking AND conversion rate on the listing

**Systematic review collection:**

| Trigger | Method | Expected Response Rate |
|---|---|---|
| Post-job satisfaction rating ≥ 4 | Automated SMS: "Thanks for the great rating! Would you share your experience on Google? [direct review link]" | 15-25% |
| Verbal praise from client | Mom sends manual review request via platform | 30-40% (warm ask) |
| Long-term client relationship | Personal email from mom: "Your review would mean the world to us" | 40-50% |
| At contract renewal | "Before we renew, would you mind sharing your experience?" | 20-30% |

**Direct review link format:**
`https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID`

This skips the search step and goes directly to the review form. Get your Place ID from Google Maps.

**Monthly review targets:**

| Month | Target Reviews | Cumulative | Milestone |
|---|---|---|---|
| Month 1 | 5 (seed from existing clients) | 5 | Listing looks active |
| Month 2 | 3-4 | 8-9 | Crossing minimum credibility threshold |
| Month 3 | 3-4 | 11-13 | Starting to rank for local searches |
| Month 6 | 2-3/month ongoing | 20-25 | Competitive in local pack |
| Month 12 | 2-3/month ongoing | 35-40 | Market authority in Austin |

**Critical rule:** Never fake reviews. Google's detection is good and the penalty is profile suspension. All reviews must come from real clients about real work.

### 56.3 GBP posting strategy

Google Posts appear on your business profile and signal activity to the algorithm.

**Weekly post rotation:**

| Week | Post Type | Content |
|---|---|---|
| Week 1 | Completed project | Before/after photo + brief description + "Get a quote" CTA |
| Week 2 | Service highlight | Feature one service type + what makes your approach different |
| Week 3 | Team/behind-the-scenes | Crew photo, equipment, or process shot that humanizes the business |
| Week 4 | Tip or educational | Cleaning tip relevant to PMs or GCs + positions mom as expert |

**Post template:**
- 150-300 words
- 1-3 photos (real, not stock)
- CTA button: "Learn more" → relevant service page, or "Get offer" → quote page
- Include 1-2 keywords naturally: "post construction cleaning Austin", "commercial cleaning"

### 56.4 GBP integration with website

| Integration | Implementation | Effort |
|---|---|---|
| GBP link in website footer | Direct link to profile | 15 minutes |
| Review badge on homepage | Display current rating + review count. Static (update monthly) or dynamic (Google Places API) | 1-3 hours |
| Review link on completion report | "Rate us on Google" button at bottom of client-facing completion report | 30 minutes |
| GBP photo sync | When admin marks completion photos as "portfolio-ready," prompt to also upload to GBP (manual for now) | Process, not code |
| Local schema on homepage | `LocalBusiness` structured data with GBP-matching NAP | 1 hour |

---

## Section 57: Brand Identity System

You mentioned putting together a brand style guide and working with contractors on logo and ads. Here's what that needs to include.

### 57.1 Brand identity deliverables

| Deliverable | Purpose | Who Creates It |
|---|---|---|
| Logo (primary + icon + wordmark + reversed) | All touchpoints | Designer (contractor) |
| Color palette (with hex codes matching website) | Consistency across all materials | You (extract from Tailwind config) + designer |
| Typography (web + print fonts) | Consistent feel across digital and print | You (already in website) + designer for print equivalent |
| Business card design | In-person networking, job sites | Designer |
| Vehicle wrap or magnet design | Mobile billboard at every job site | Designer |
| Uniform specification | Crew professionalism, brand visibility | You + mom + vendor |
| One-page leave-behind template | Sales meetings, job site encounters | Designer + you (content from website) |
| Email signature template | Every email reinforces brand | You (30 min) |
| Social media profile templates | Consistent appearance across platforms | Designer |
| Proposal/quote document template | Professional presentation for large contracts | Designer + you |
| Letterhead | Formal correspondence, contracts | Designer |

### 57.2 Brand style guide contents

| Section | Content |
|---|---|
| Mission statement | One sentence. What the company does and for whom |
| Brand voice | Professional but approachable. Confident but not arrogant. Quality-focused. Direct. "We show our work, not just talk about it" |
| Logo usage rules | Minimum size, clear space, what backgrounds it can appear on, what NOT to do |
| Color definitions | Primary: Navy (hex, RGB, CMYK for print). Secondary: Gold. Accent: Royal blue. Neutrals. Map to Tailwind config tokens |
| Typography | Headings: [font from website]. Body: [font from website]. Print equivalent for non-web use |
| Photography style | Real photos only. Well-lit. Clean compositions. Show crew in action, finished results, equipment. Never stock photos |
| Iconography style | Match SVG icon system from website |
| Tone examples | How to write a social post, how to respond to a review, how to write a proposal introduction |
| What we don't do | No clip art, no generic stock photos, no Comic Sans (sounds obvious but explicit rules prevent mistakes from contractors) |

### 57.3 Vehicle branding

Your mom's vehicles are at job sites every day. They are free advertising.

**Minimum viable (magnets): $100-$300**
- Company name, phone, website, "Commercial & Construction Cleaning"
- QR code to quote page
- Removable magnets for personal vehicles used for work

**Full wrap: $2,000-$4,000 per vehicle**
- Professional design matching brand system
- Before/after photo on side panels
- Clear phone number and website URL
- "Licensed & Insured" badge
- Worth it when budget allows — essentially a mobile billboard parked at job sites

### 57.4 Uniform specification

| Item | Standard | Purpose |
|---|---|---|
| Polo or t-shirt | Company color (navy) with embroidered/printed logo | Professional appearance, brand visibility |
| ID badge | Name, photo, company logo, "Licensed & Insured" | Client trust, building access |
| Safety vest (construction sites) | Hi-vis with company logo | Safety compliance + branding |
| Hat (optional) | Company logo | Additional brand touchpoint |

**Cost:** $15-$25 per shirt (embroidered), $5-$10 per badge, $10-$15 per safety vest. For a 10-person crew, initial outfitting: $300-$500.

---

## Section 58: Offline Marketing Materials

### 58.1 Business cards

**Front:**
- Logo, owner name, title ("Owner & Operator"), phone, email, website
- Clean, minimal, premium feel (thick stock, matte finish)

**Back:**
- QR code to website
- 3 core services listed
- "Licensed & Insured | Bilingual"
- Tagline or positioning statement

**Cost:** $50-$100 for 500 premium cards (Moo, Vistaprint premium tier)

### 58.2 One-page capability sheet (leave-behind)

This is the physical version of what the website communicates. Given to GCs, PMs, and facility managers at job sites and meetings.

**Front side:**
- Company overview (2-3 sentences)
- Service list with icons
- 3 proof points (projects completed, satisfaction rate, response time)
- Owner photo + one-line credential

**Back side:**
- Before/after photo pair
- 2-3 client testimonials (once collected)
- Insurance/licensing badges
- QR code to quote page with tracking UTM
- Phone number prominent

**Cost:** $0.50-$1.50 per sheet for professional print (100-250 qty). Design cost: included if designer does it with brand package, or $100-$200 standalone.

### 58.3 Door hanger or job-site card

When crews complete a job in a multi-tenant building, leave a card at neighboring units/suites:

- "Your neighbor just got a professional deep clean."
- Before/after photo
- "Get 10% off your first service" (or similar)
- QR code to quote page with UTM: `?utm_source=door_hanger&utm_medium=offline`
- Phone number

**Cost:** $0.15-$0.30 each for 500+. Simple but effective for building-by-building expansion.

---

## Section 59: Partnership & Referral Network

### 59.1 Strategic partnership targets in Austin

These are not clients — these are partners who can send your mom a steady stream of work.

| Partner Type | Why They Refer | What You Offer Them | How to Find Them |
|---|---|---|---|
| General contractors | Need reliable post-construction cleanup to pass inspections | Consistent quality, documented results, schedule reliability | Austin GC associations, construction site visits, LinkedIn |
| Property management companies | Need fast, consistent turnover cleaning at scale | Speed, bulk pricing, portfolio-level reporting | PM association events, Austin Apartment Association |
| Real estate agents | Need move-out cleaning for listings, move-in cleaning for buyers | Referral fee or reciprocal referral | Local RE networking events, Realtor associations |
| Restoration companies | After water/fire damage restoration, need cleaning before rebuild | Complementary service, not competitive | Google "restoration Austin", direct outreach |
| Interior designers / stagers | Need deep clean before staging or after renovation | Complements their service | Instagram DM outreach, networking events |
| Commercial real estate brokers | Need spaces cleaned for showings, new tenant prep | Fast turnaround, professional result | CREW Austin, Austin CRE networking |
| Office buildout contractors | Similar to GC but specifically for office/retail tenant improvements | Post-construction cleanup for TI projects | LinkedIn, TI contractor associations |

### 59.2 Referral partnership program structure

| Element | Design |
|---|---|
| Referral fee | 5-10% of first job value, or flat $50-$200 depending on job size |
| Payment trigger | After referred client completes and pays for first job |
| Tracking | Unique referral code per partner, entered in lead intake |
| Communication | Quarterly update to partners on referral status and earnings |
| Formalization | Simple referral agreement (1 page) outlining terms |
| Reciprocal | Offer to refer your clients to their services where appropriate |

### 59.3 Association memberships to prioritize

Based on budget constraints and ROI:

| Association | Annual Cost | Expected ROI | Priority |
|---|---|---|---|
| Austin Apartment Association | $300-$500 | Direct PM networking, bid opportunities | High — if targeting apartment turnover |
| Austin Chamber of Commerce | $300-$1,000 | General networking, directory listing | Medium |
| Associated Builders and Contractors (ABC) Texas | $500-$1,500 | GC relationships, bid opportunities | High — if targeting construction cleaning |
| BBB Accreditation | $400-$800 | Trust badge for website, complaint resolution | Medium — good for commercial credibility |
| ISSA | $500-$1,500 | Training, certifications, industry data | Low now — High when pursuing CIMS certification |

**Recommendation:** Start with one: whichever aligns to the highest-value contract target. If GCs are the main revenue source, ABC Texas. If PMs/apartments, Austin Apartment Association.

---

## Section 60: Master Priority Ranking

Everything from the original blueprint, the expansion document, and this addendum — ranked by what matters right now for your mom's business at its current stage.

### Tier 0: Launch Blockers (Must complete before going live)

These items, if not addressed, will either create legal risk, destroy credibility with the target buyer, or make the website functionally useless.

| # | Item | Source | Effort | Why It Blocks Launch |
|---|---|---|---|---|
| 1 | Replace fabricated testimonials with real ones (SB-2) | Expansion §13 | Mom collects 3-5 testimonials (1-2 weeks), you implement (1 hour) | FTC compliance risk. Commercial buyers will verify. Destroys trust instantly if discovered |
| 2 | Verify authority bar metrics with mom (SB-3) | Expansion §13 | 1 hour conversation + 30 min code update | Contradictory or false numbers undermine every other trust signal |
| 3 | End-to-end admin dashboard testing | Blueprint §10 | 1-2 weeks depending on bugs found | Can't operate the business through the platform if it doesn't work |
| 4 | End-to-end employee portal testing | Blueprint §10 | 1 week | Mom can't step back from field work without a working employee portal |
| 5 | Database schema verification against all features | Your note | 3-5 days | Data integrity issues compound and become unfixable post-launch |
| 6 | Real business photos (minimum 10) | Expansion §1 | Mom takes photos over 2-3 weeks of jobs + you implement (2 hours) | Stock photos are immediately obvious to commercial buyers. A single real crew photo outweighs 10 stock images |
| 7 | About page with owner name, story, and photo | Expansion §2.2 | Mom provides content (2-3 hours interview/writing), you implement (3-4 hours) | GCs and PMs making $10K+ decisions will check this page. Anonymous = disqualified |
| 8 | Service page content depth and Austin specificity | Expansion §2.3, Addendum §51.2 | 2-3 days across all pages | Thin pages hurt SEO and signal "template website" to sophisticated buyers |
| 9 | Remove or reframe residential/maid-style language | Addendum §51.2 | 2-3 hours | Positioning confusion. The target buyer is commercial/construction, not homeowners |
| 10 | Google Analytics 4 + basic conversion tracking | Expansion §6.1, Addendum §54.4 | 3-4 hours total | Cannot measure anything. Cannot optimize ads. Flying blind |

### Tier 1: Launch Week (Complete within first week of going live)

| # | Item | Effort | Impact |
|---|---|---|---|
| 11 | Google Business Profile — fully optimized | 3-4 hours | For local service businesses, GBP drives more leads than the website in the first 6 months |
| 12 | Google Search Console verification | 30 minutes | See what Google thinks of your site. Catch indexing issues immediately |
| 13 | LocalBusiness + Organization structured data on homepage | 1-2 hours | Correct schema helps Google understand and display your business in local results |
| 14 | Review request to 5-10 existing clients | Mom sends personally, 30 min | Seed reviews are the foundation of local search visibility. Start immediately |
| 15 | Set up Plausible or verify GA4 is collecting data | 30-60 minutes | Confirm analytics are actually recording before making any decisions |
| 16 | Sitemap submitted to Google Search Console | 15 minutes | Accelerates indexing of all pages |
| 17 | Email signature with website link for mom and any staff who email clients | 30 minutes | Every email becomes a brand touchpoint with zero cost |
| 18 | Social profiles created: Google, Facebook, Instagram, LinkedIn company page | 2-3 hours | Claim handles, basic profile, link to website. Doesn't need content yet |

### Tier 2: First 30 Days (Establish the operational and marketing foundation)

| # | Item | Effort | Impact |
|---|---|---|---|
| 19 | Before photo requirement added to employee portal | 1-2 days | Starts building portfolio automatically. Every job = marketing assets |
| 20 | Post-job satisfaction rating automated (SMS) | 1-2 days | Starts collecting ratings and testimonials without mom doing anything |
| 21 | Google review request automation (post-job, rating ≥ 4) | 1 day | Compounds review count monthly without manual effort |
| 22 | Authority bar connected to live database metrics | 1 day | SB-3 permanently resolved. Numbers always truthful |
| 23 | Service pages updated with real project descriptions (even without photos yet) | 2-3 days | Better SEO, better conversion, less "template" feel |
| 24 | City/service-area pages given unique, substantial content | 3-5 days | You mentioned these exist but may be thin. Each needs real local context |
| 25 | Contact page: Google Maps embed, response time commitment | 2-3 hours | Basic trust and usability improvement |
| 26 | FAQ page expanded with pricing guidance per service type | 1 day | Pre-qualifies leads. Reduces tire-kicker volume |
| 27 | Careers page with pay range, benefits, value proposition | 1 day (content from mom) + 3-4 hours implementation | Starts recruiting pipeline |
| 28 | Google for Jobs schema on careers page | 30 minutes | Free job listing distribution |
| 29 | QuickBooks integration verified end-to-end | 2-5 days depending on current state | Critical for invoicing. Mom already uses QB — bridge the gap |
| 30 | Automated lead acknowledgment (instant email/SMS on quote request) | 1 day | Prospect knows their request was received. Huge for perceived professionalism |
| 31 | Lead follow-up automation (3-message sequence over 7 days) | 2-3 days | Recovers 15-30% of leads that would otherwise go cold |

### Tier 3: Days 30-90 (Grow the lead pipeline and operational maturity)

| # | Item | Effort | Impact |
|---|---|---|---|
| 32 | Blog: first 5 cornerstone posts targeting service + Austin keywords | 3-5 days writing + 1 day code for blog infrastructure | Organic traffic starts building. Compounds over months |
| 33 | Google Ads: search campaigns for top 2-3 service keywords | 1 day setup + ongoing management | Immediate lead flow while organic builds |
| 34 | Google Local Services Ads setup | 1-2 days (includes verification process) | Pay-per-lead with Google Guaranteed badge. Highest trust signal in search |
| 35 | One-page leave-behind PDF generated from admin | 1-2 days | Sales enablement for in-person networking and job site encounters |
| 36 | Recurring job support and auto-scheduling | 2-3 days | Mom's biggest admin time drain — recreating recurring jobs manually |
| 37 | Photo portfolio system (admin marks photos as portfolio-ready) | 1-2 days | Curated best-of photos feed into website, social, proposals |
| 38 | Client directory enhanced with communication history | 2-3 days | Single view of each client relationship for mom |
| 39 | Spanish employee portal (button labels, instructions, error messages) | 5-8 days | For a 10-person Austin cleaning crew, this is operational necessity |
| 40 | Facebook/Instagram retargeting pixel | 1 hour | Retarget website visitors with before/after showcase ads. Low cost, high recall |
| 41 | GBP weekly posts (establish cadence) | 30 min/week ongoing | Keeps profile active, signals to algorithm, showcases work |
| 42 | One strategic association membership (ABC Texas or Austin Apartment Assoc.) | $300-$1,500 + time for events | Direct access to GC/PM decision-makers |
| 43 | Vehicle magnets with company branding + QR code | $100-$300 | Every job site = passive advertising |
| 44 | Business cards for mom | $50-$100 | Required for any in-person networking |
| 45 | Pre-job checklist (what to bring, access info, special instructions) | 2-3 days | Reduces "crew showed up without the right equipment" incidents |

### Tier 4: Days 90-180 (Scale operations and deepen competitive moat)

| # | Item | Effort | Impact |
|---|---|---|---|
| 46 | Client portal (magic link auth, view jobs/quotes/invoices/reports) | 3-5 days | Reduces admin calls, increases stickiness, differentiator |
| 47 | Time tracking (employee clock in/out) | 3-5 days | Foundation for job costing, payroll data, labor compliance |
| 48 | Job costing (revenue − labor − supplies = margin) | 3-5 days after time tracking | Know which services/clients are actually profitable |
| 49 | Digital proposal generator for contracts over $5K | 3-5 days | Professional proposals with QA process description win contracts |
| 50 | Case study page infrastructure + first 3 case studies | 2-3 days code + content from completed projects | Mid-funnel credibility for larger contracts |
| 51 | Blog: next 5 posts (total 10) | 3-5 days | Approaching meaningful organic traffic volume |
| 52 | Completion report enhanced with branding + Google review link | 1-2 days | Every delivered report becomes a review collection touchpoint |
| 53 | Multi-day job support with daily progress tracking | 3-5 days | Required for construction cleaning contracts (2-5 day projects) |
| 54 | NPS tracking (post-job "would you recommend" question) | 1-2 days | Early warning system for quality issues, testimonial pipeline |
| 55 | Insurance certificate (COI) storage and one-click send | 1-2 days | Daily operational need — GCs request COI constantly |
| 56 | Punch list management | 4-6 days | Table-stakes for GC relationships on construction projects |
| 57 | Role-based access (at minimum: owner + ops manager) | 3-5 days | Required if mom hires an office/admin person |
| 58 | Online invoice payment (Stripe integration) | 2-3 days | Faster payment collection, reduced AR aging |
| 59 | Employee onboarding checklist in admin | 2-3 days | Structured new hire process as crew grows |
| 60 | Industry-specific landing pages (restaurants, medical, venues) | 2-3 days | High-value keyword targets with less competition than generic "commercial cleaning" |

### Tier 5: 6-12 Months (Market leadership and platform maturity)

| # | Item | Effort | Impact |
|---|---|---|---|
| 61 | PWA for employee portal (installable, offline caching) | 1-2 weeks | Better field experience, especially at construction sites with poor signal |
| 62 | Green cleaning program page and capability | 1-2 days content + 1-2 days operational | Premium positioning for LEED buildings and eco-conscious clients |
| 63 | Capabilities package PDF auto-generator | 2-3 days | One-click sales document for GC/PM meetings |
| 64 | Subcontractor management (directory, assignment, QA) | 1-2 weeks | Elastic capacity for demand spikes without permanent hires |
| 65 | SLA tracking and compliance scorecard | 2-3 days | Formalizes quality commitments, identifies operational gaps |
| 66 | Email marketing sequences (client nurture, re-engagement) | 3-5 days | Keeps existing clients warm, recovers lapsed clients |
| 67 | Referral program (client and partner) | 2-3 days | Lowest cost acquisition channel once established |
| 68 | Full capacity planning model in admin | 3-5 days | Hire/market signals based on utilization data |
| 69 | AI scope estimation from photos | 1-2 weeks | Technology differentiator for faster quoting |
| 70 | Training module system for employees | 1-2 weeks | Scales quality standards beyond what mom can personally teach |
| 71 | Compliance calendar in admin | 1-2 days | Prevents missed regulatory deadlines as business grows |
| 72 | White-label completion reports for PMs | 3-5 days | Becomes sticky infrastructure — PMs won't switch away |
| 73 | Bid management for GC RFPs | 2-3 weeks | Targets highest-value contract segment formally |
| 74 | Full WCAG 2.1 AA accessibility audit and remediation | 1-2 weeks | Legal protection, inclusive design, some commercial clients require it |

### Tier 6: 12+ Months (Only if business scale justifies)

| # | Item | Effort | Impact |
|---|---|---|---|
| 75 | Multi-location support | 2-4 weeks | Only if expanding beyond Austin |
| 76 | Route optimization for daily dispatch | 1-2 weeks | ROI only at high job volume |
| 77 | Procore / construction management integration | 2-3 weeks | Only if GC volume justifies deep integration |
| 78 | Property management software integration | 2-4 weeks | Only if PM volume justifies |
| 79 | Real-time crew GPS tracking | 3-5 days | Useful but not essential until 15+ crews |
| 80 | Fleet and equipment management module | 2-3 weeks | Matters when fleet grows beyond 3-4 vehicles |
| 81 | Full vendor management system | 1-2 weeks | Matters when supply spend exceeds $2-3K/month |
| 82 | Franchise/licensing architecture | Months | Only if considering expansion through partners |

---

## Section 61: Month-by-Month Execution Calendar

Given your situation (20+ hours/week, Codex/Claude assistance, June target launch, business already operating), here's a realistic calendar.

### April 14 - April 30: Launch preparation sprint

**You do:**
- Complete admin dashboard end-to-end testing (all 10 modules)
- Complete employee portal end-to-end testing
- Verify database schema alignment
- Implement GA4 + conversion tracking
- Rewrite service pages with Austin-specific content and commercial positioning
- Remove/reframe residential language
- Update authority bar to pull from database or prepare for live data connection

**Mom does:**
- Takes 10+ real photos over the next 2 weeks (before/after pairs, crew at work, completed projects)
- Collects 3-5 written testimonials from current clients (text message ask: "Would you write 2-3 sentences about working with us?")
- Provides verified metrics for authority bar
- Provides 300-500 word founding story for about page
- Provides headshot
- Confirms all service descriptions are accurate

### May 1 - May 15: Content and infrastructure hardening

**You do:**
- Implement real photos across site
- Write about page with mom's story and photo
- Deepen city/service-area pages
- Set up Google Business Profile completely
- Set up Google Search Console
- Implement lead acknowledgment automation
- Implement 3-message lead follow-up sequence
- Build blog infrastructure (route + first 2-3 posts)
- Careers page enhancement with value proposition
- Google for Jobs schema

**Mom does:**
- Reviews all website content for accuracy
- Requests Google reviews from 5 existing clients
- Gets business cards printed
- Gets vehicle magnets ordered

### May 16 - May 31: Operational polish and soft launch

**You do:**
- Fix any bugs found during testing
- QuickBooks integration verified
- Post-job satisfaction rating flow activated
- Google review request automation
- Before photo requirement in employee portal
- 2-3 more blog posts
- Prepare Google Ads campaigns (don't launch yet)
- Authority bar connected to live data

**Mom does:**
- Begins using admin dashboard for real jobs (soft launch)
- 1-2 crew members start using employee portal on real jobs
- Collects any remaining testimonials
- Reviews and approves all content

### June 1 - June 15: Launch

**You do:**
- Deploy to production with real domain
- Submit sitemap to Google
- Launch Google Ads (start with $500/month, one service category)
- Activate all automation sequences
- Monitor for bugs and issues daily
- Begin weekly GBP posts

**Mom does:**
- Full team on employee portal
- Responds to leads through admin pipeline
- Provides feedback on dashboard usability
- Continues collecting reviews (target: 5 by end of June)

### June 16 - June 30: Post-launch stabilization

**You do:**
- Fix any issues surfaced by real usage
- Review analytics data (are conversions tracking? what's the traffic pattern?)
- Optimize Google Ads based on first 2 weeks of data
- Begin implementing Tier 3 items (recurring jobs, Spanish portal, client directory)

---

## Section 62: Budget Summary for Launch

| Item | Cost | Timing |
|---|---|---|
| Domain (if not already owned) | $10-$15/year | Now |
| Vercel Pro | $20/month | At launch |
| Supabase Pro | $25/month | At launch |
| Google Ads (initial) | $500-$1,000/month | Launch month |
| Google Local Services Ads | $300-$500/month | Month 2 |
| Business cards | $50-$100 | Pre-launch |
| Vehicle magnets (2) | $100-$300 | Pre-launch |
| Twilio SMS | ~$20-$50/month (estimated at volume) | At launch |
| Resend email | $0-$20/month | At launch |
| OpenAI (AI assistant) | ~$10-$30/month | At launch |
| Association membership (1) | $300-$1,500/year | Month 2-3 |
| CallRail or call tracking (optional) | $45/month | If running ads |
| Logo redesign (contractor) | $300-$1,000 | When ready |
| Professional photo shoot (optional) | $500-$1,000 | When budget allows |
| **Monthly fixed (minimum)** | **~$100-$150** | |
| **Monthly with ads** | **~$700-$1,700** | |
| **One-time launch costs** | **~$200-$600** | |

---

## Section 63: Success Metrics and the $25K-$50K Target

### 63.1 Reverse-engineering the revenue target

**Conservative target: $25K in new revenue from website leads in 6 months**

| Metric | Assumption | Calculation |
|---|---|---|
| Average job value | $500-$2,000 (varies by service) | Midpoint: $1,000 |
| Jobs needed | 25 new jobs from website | $25K ÷ $1K average |
| Quote-to-job conversion | 30-40% | Industry average for qualified commercial leads |
| Quotes needed | 65-85 | 25 jobs ÷ 35% conversion |
| Lead-to-quote conversion | 50-60% | Assuming admin follows up promptly |
| Leads needed | 120-170 | ~85 quotes ÷ 55% |
| Leads per month needed | 20-28 | Over 6 months |
| Website conversion rate | 3-5% | For a well-optimized local service site |
| Monthly visitors needed | 500-900 | 24 leads ÷ 4% conversion |

**Is 500-900 monthly visitors realistic?**
- Google Ads at $500-$1,000/month: 100-300 visitors/month (commercial cleaning CPC is $5-$15)
- Google Local Services Ads: 15-30 leads/month directly (not click-based)
- Organic search (building over months): 50-200 visitors/month by month 4-6
- GBP discovery: 100-300 views/month translating to 20-50 website visits
- Direct/referral: 50-100/month from networking, cards, vehicle branding

**Total realistic monthly visitors by month 3-4: 400-800. By month 6: 600-1,200.**

The math works. The $25K target is conservative and achievable with consistent execution.

### 63.2 Aggressive target: $50K in new revenue from website leads in 6 months

This requires either:
- Higher average job value ($2,000+ → fewer jobs needed → focus on construction/commercial contracts)
- Higher volume (double the lead flow → more ad spend or better organic growth)
- Both

**The lever is average job value.** If mom lands 2-3 commercial contracts at $5K-$15K each from the website, plus steady smaller jobs, $50K is achievable. This is why the positioning toward GCs and PMs matters — one construction cleanup contract can be worth 10 small jobs.

### 63.3 KPIs to track weekly (starting at launch)

| KPI | Target (Month 1) | Target (Month 3) | Target (Month 6) | Where to Find |
|---|---|---|---|---|
| Website visitors | 200-400 | 400-700 | 600-1,200 | GA4/Plausible |
| Quote form submissions | 5-10 | 15-25 | 20-30 | Admin dashboard |
| Phone calls from website | 3-8 | 8-15 | 10-20 | Call tracking or manual log |
| Total leads | 8-18 | 23-40 | 30-50 | Admin lead pipeline |
| Quotes sent | 5-12 | 15-30 | 20-35 | Admin pipeline |
| Jobs won from website | 2-5 | 5-12 | 8-15 | Admin pipeline |
| Revenue from website leads | $1K-$5K | $3K-$10K | $5K-$15K | QuickBooks + pipeline |
| Google reviews (cumulative) | 5 | 12-15 | 20-25 | GBP |
| Lead response time (average) | <4 hours | <2 hours | <1 hour | Admin timestamps |
| Employee portal adoption | 50% of crew | 80% of crew | 100% of crew | Portal usage data |

### 63.4 Monthly review protocol

On the first Monday of each month, you and mom review:

1. **Leads:** How many came in, from where, how fast were they responded to
2. **Conversion:** How many became quotes, how many became jobs, what was the value
3. **Quality:** Any complaints, rework, QA issues
4. **Reviews:** How many new Google reviews, what's the average rating
5. **Ad spend vs return:** Cost per lead by channel, are we spending in the right places
6. **Employee portal:** Is the crew using it, what's broken or frustrating
7. **Content:** What blog posts or GBP updates were published, what's the traffic trend
8. **Next month priorities:** Based on data, what needs attention

This takes 30-60 minutes and prevents drift.

---

## Section 64: Things You Should Tell Your Mom This Week

Based on everything above, here's the concrete list of things that need a conversation:

### The ask list

1. **"I need 3-5 written testimonials from your best clients to launch the website."**
   - Give her a template text she can copy-paste to clients: "Hi [Name], I'm building a new website for A&A and would love to include a brief testimonial from you. Would you be willing to write 2-3 sentences about your experience working with us? It would mean a lot."
   - Deadline: End of April

2. **"I need you to take before and after photos on your next 5-10 jobs."**
   - Give her simple instructions: Take 3-5 photos before starting (wide shot of each room/area). Take matching photos from the same angles when done.
   - Phone camera is fine. Natural light preferred. Doesn't need to be professional.
   - Deadline: Running collection, first batch by end of April

3. **"I need 30 minutes with you to verify the numbers on the website."**
   - Go through the metrics file together
   - Projects completed, years in business, buildings served, crew size, satisfaction rate
   - Schedule a specific time

4. **"I need your founding story in your own words."**
   - Record her telling it on your phone. You'll write it up from the recording.
   - Better than asking her to write it — she'll never get to it

5. **"I need a headshot of you looking professional."**
   - Polo or company shirt, clean background, good lighting
   - Phone is fine if the lighting is good. Outside in shade works well.

6. **"We need to plan for $500-$1,000/month in advertising starting in June."**
   - Explain the math: that budget should return $3K-$10K+ in revenue if the funnel works
   - She can start with $500 and increase as results prove out

7. **"I need you to start using the admin dashboard in May."**
   - Soft launch: use it alongside however she's currently managing jobs
   - Her feedback during real use is what will surface the remaining bugs

---

## Document Maintenance Notes

This addendum (Sections 51-64) is calibrated to A&A's specific business reality as of April 2025: 10-person crew, Austin market, owner-operated, pre-launch with June target, subcontractor-to-prime transition strategy, commercial and construction focus with commercial growth targets.

**Recalibration triggers:**
- Business crosses 20 jobs/month from website leads (shift to Tier 4 priorities)
- Mom hires office/admin help (activate role-based access, Tier 4 #57)
- Construction market recovers in Austin (increase construction-specific investment)
- Ad spend exceeds $2K/month (add more sophisticated attribution and reporting)
- Crew exceeds 15 people (activate fleet management, route optimization, multi-crew features)

---

## Change Log

- 2026-04-13: Sections 51-64 added. Strategic recalibration based on actual business context. Master priority ranking across all documents. Month-by-month execution calendar through June launch. Revenue modeling against $25K-$50K target. Budget framework. Immediate action items for owner.

I have a few more thoughts — not questions, but documents that would genuinely help you move faster given your specific situation. Here's what I'd recommend and why.

---

## Documents Worth Creating

### 1. Page-by-Page Content Brief

**Why it matters right now:** You're in the phase where service pages need depth and Austin specificity. You mentioned city pages need weight. A content brief gives you (or Claude) exact instructions for every page: target keywords, word count, heading structure, what each section should say, tone guidance, and CTAs.

**What it would look like:**
- One entry per page (homepage, about, each service page, each city page, each industry page, contact, careers, FAQ)
- Target primary and secondary keywords per page
- Exact heading structure (H1, H2s, H3s)
- Section-by-section content guidance: "This section should cover X in 150-200 words, mentioning Y and Z"
- Internal linking targets (which pages should link to which)
- CTA placement and language per page
- Meta title and meta description pre-written

**Why this is high value for you specifically:** You can hand this document to Claude or Codex and say "write the content for this page following this brief" and get output that's SEO-optimized, on-brand, and commercially positioned — without you having to think through keyword strategy every time.

**Effort to create:** I could build this for you in one conversation. Probably the single highest-leverage document for your content depth problem.

---

### 2. Admin Dashboard User Guide (Written for Mom)

**Why it matters:** The platform only works if mom uses it. She's not technical. She's coming home late from job sites. If the dashboard feels confusing or the workflow isn't obvious, she'll fall back to texting and spreadsheets and the platform dies.

**What it would look like:**
- Written in plain language, no technical jargon
- Screenshot-based walkthrough of every daily workflow
- "When you wake up in the morning, do this first"
- "When a new lead comes in, here's what to do step by step"
- "When a job is done, here's how to review it"
- "When someone applies for a job, here's where to find it"
- Common troubleshooting: "If you see X, do Y"
- Printed or PDF version she can keep nearby

**Why this is high value for you specifically:** You won't always be available to walk her through things. This document is your proxy. It also forces you to think through the UX from her perspective, which may surface usability issues before launch.

---

### 3. Employee Portal Quick-Start Guide (Written for Crew)

**Why it matters:** Ten people need to adopt this tool. They're field workers, not office workers. Some primarily speak Spanish. The guide needs to be visual, minimal, and bilingual.

**What it would look like:**
- One-page visual guide (front: English, back: Spanish)
- Screenshots with numbered arrows: "1. Open app 2. Tap your job 3. Take before photos 4. Do checklist 5. Take after photos 6. Mark complete"
- Laminated card they can keep in their vehicle or pocket
- QR code that opens the employee portal
- "If you have a problem, text [admin number]"

**Why this is high value:** Adoption by the crew is what lets mom step back from the field. If even 2-3 crew members don't use it, she's still going to job sites to verify work personally.

---

### 4. End-to-End Testing Script

**Why it matters right now:** You said you're in the testing phase. A structured testing script means you don't miss anything and you can track what's been verified.

**What it would look like:**
- Every user flow listed as a numbered test case
- Preconditions, steps, expected results, actual results, pass/fail
- Organized by surface: public site flows, admin flows, employee flows, API flows
- Cross-surface flows: "lead submits quote → admin sees it → admin sends quote → client receives email → client accepts → job created → employee sees assignment → employee completes → admin reviews QA → completion report generated"
- Database verification checkpoints: "After step X, verify table Y has row with Z values"
- Edge cases: "What happens if the employee has no internet when uploading photos?"

**Why this is high value for you specifically:** You're one person testing a complex system. A script prevents you from accidentally declaring something "done" when a critical path is broken. You can also use Codex to write Playwright tests from this script later.

---

### 5. Launch Day Checklist

**Why it matters:** Launch involves a lot of one-time actions across multiple services. Missing one (like forgetting to update the robots.txt to allow crawling, or forgetting to set environment variables in production) can silently break things.

**What it would look like:**
- Pre-launch (week before): final content review, DNS preparation, environment variable setup, production database migration, backup verification
- Launch day: DNS cutover, SSL verification, smoke test all critical paths, analytics verification, submit sitemap, social media announcement
- Post-launch (24-48 hours): monitor error logs, verify Google indexing started, check analytics data flowing, first Google Ads campaign live, first GBP post
- Rollback plan: "If X is broken, do Y"

---

### 6. Codex/Claude Project Context Document

**Why it matters:** Every time you start a new session with Codex or Claude, you lose context. A concise project context document that you paste at the beginning of every session would dramatically improve output quality.

**What it would look like:**
- 1-2 page summary: tech stack, file structure conventions, database schema summary, design system tokens, business context
- "When writing code for this project, always: use these Tailwind classes, follow this component pattern, use Supabase client from this path, handle errors this way"
- Current state summary: "These modules are complete and tested. These are in progress. These are planned."
- Naming conventions, file organization rules, API route patterns
- Updated as the project evolves

**Why this is high value:** You're using AI to multiply your output. The quality of that output depends entirely on the context you provide. A standardized context document means every session starts from the same accurate baseline instead of you re-explaining the project each time.

---

## What I'd Recommend You Actually Do

Given your timeline and capacity, I'd create them in this order:

| Priority | Document | When | Why This Order |
|---|---|---|---|
| 1 | End-to-End Testing Script | This week | You're in the testing phase right now. This is immediately useful |
| 2 | Page-by-Page Content Brief | This week | Unblocks content work. You can use Claude to write pages from the brief while you test |
| 3 | Codex/Claude Project Context Doc | This week | Improves every future AI-assisted development session |
| 4 | Launch Day Checklist | Mid-May | Needed before launch but not urgent today |
| 5 | Admin Dashboard User Guide | Late May | Needed before mom starts using the system |
| 6 | Employee Portal Quick-Start | Late May | Needed before crew onboarding |

---

Good. I now have full ground truth on the codebase. Here's what I'd add to the end of the blueprint document — prioritized additions, a condensed action plan, and the pre-launch validation checklist. This is written to be appended directly.

---

## 13. Codebase Audit Findings (2026-04-13)

### 13.1 What the audit confirmed is stronger than documented

**Database architecture.** 26 tables with proper enums, comprehensive indexes on all high-traffic query paths, RLS policies enforcing role-based access on every sensitive table, and foreign key relationships mapping the full business lifecycle from lead through job completion. This is production-grade schema work.

**Admin modules are real, not shells.** All 10 modules execute real Supabase queries. The Overview Dashboard runs 8 distinct queries to populate its cards. The Lead Pipeline traces a complete lifecycle from INSERT through quote delivery, token-based client review, acceptance, and job creation. The Hiring Inbox is end-to-end: form submission writes to `employment_applications`, admin can triage through status workflow, both parties get email notifications.

**Notification system is sophisticated.** SMS dispatch includes quiet-hours queueing, exponential backoff retry (3 attempts max), deduplication, permanent vs transient error classification, and configurable preferences per profile. Lead alerts fire on a tiered schedule (1h, 4h, 24h) with escalating urgency language. This is not a basic notification setup.

**First-party analytics already works.** Conversion events POST to `/api/conversion-event` and write directly to Supabase `conversion_events` table. This captures quote form starts, completions, abandons, phone CTA clicks, AI chat interactions, and exit-intent conversions without needing GA4 or Plausible. The data is already flowing if the Supabase environment variables are set on the deployment.

**Spanish employee portal is comprehensive.** Assignment status labels, checklist instructions, issue report forms, message thread UI, photo upload validation messages, and empty state messaging all have Spanish translations. Checklist templates default to locale `es`. This is not a placeholder — it's a working bilingual employee experience.

**Employment pipeline is complete.** Bilingual application form collects 20+ fields including transportation, work authorization, specialties, available days, references, and background check consent. Submission triggers admin email notification and applicant confirmation. Admin module provides full triage workflow with 7 status values. Only gap: no resume upload and no dynamic job listing display on the careers page.

**API security posture is solid.** All public-facing routes have rate limiting (strict tier: 5/hr for quote request, AI assistant, and employment applications). All authenticated routes verify session and role. Environment validation runs on startup. Upstash rate limiting degrades gracefully to allow-all if not configured rather than crashing.

### 13.2 What the audit found that contradicts or gaps the blueprint

**Honeypot is documented but not implemented.** The blueprint (Section 3.2, item 8) states the quote section has "anti-spam honeypot." The codebase has no honeypot field in the quote request form or validation logic. Anti-spam is handled by rate limiting (5/hr) and 60-second deduplication on phone+email. This is functional but the blueprint should be corrected.

**Authority bar metrics are fully static.** The blueprint implies these are trust signals backed by operational data. They are hardcoded constants in `company.ts`: 15+ years, 500+ projects, 100% on-time rate. These numbers have not been verified against business reality and are not connected to any database query. This is the SB-3 issue and it remains unresolved.

**Service page content is generic.** All five service detail pages pull descriptions from `src/data/services.ts` with Austin mentioned only in metadata titles, not in main body copy. For SEO and conversion, these pages need substantial Austin-specific, industry-specific content in the body text.

**Before-photo capture does not exist.** The employee portal collects completion photos only. The portfolio automation system described in the expansion docs (Section 52) depends on before/after pairs. The photo upload infrastructure exists and works — this is an extension, not a new system.

**No seed data mechanism exists.** There is no seed script, fixture file, or test data generator anywhere in the codebase. Every admin module will render empty state on first load. Testing requires manual SQL inserts or building a seed script. This is the immediate blocker for the testing phase.

**Messaging is poll/refresh, not real-time.** Job messages between admin and employee use standard fetch/refetch patterns. No Supabase Realtime subscription or WebSocket connection. Functional but messages won't appear instantly for the other party.

**One TypeScript compilation error exists.** `src/app/layout.tsx` line 2 has a CSS import path resolution error. This is on the critical rendering path for every page.

### 13.3 Blueprint corrections required

| Blueprint Reference | Stated | Actual | Action |
|---|---|---|---|
| Section 3.2 item 8 (Quote section) | "anti-spam honeypot" | Rate limiting + dedup, no honeypot | Correct blueprint or implement honeypot |
| Section 3.2 item 8 (Authority bar) | Implies data-backed metrics | Hardcoded in company.ts | Note as static; plan for live data connection |
| Section 5.2 item 1 (Photo upload) | Implies completion evidence flow | Only after-photos, no before-photos | Note as gap; plan before-photo addition |
| Section 8 (Accessibility) | Focus trap and announcer coverage | Not verified that every modal/drawer actually uses them | Add audit verification to testing plan |

---

## 14. Condensed Priority Plan

### 14.1 Immediate blockers (this week)

These prevent testing and must be resolved before any other work.

| # | Item | Effort | Why it blocks |
|---|---|---|---|
| 1 | Fix TypeScript CSS import error in layout.tsx | 15 minutes | Every page depends on root layout rendering correctly |
| 2 | Build seed data script | 1 day | Cannot test any admin or employee module without data in the database. Script should create: 1 admin profile, 2 employee profiles, 5 leads across different statuses, 3 quotes (draft/sent/accepted), 4 jobs across statuses, job assignments linking employees to jobs, 1 checklist template with items and linked to a job, 2 employment applications, sample notification preferences |
| 3 | Verify Vercel environment variables are set for production | 1 hour | Twilio, Resend, Supabase, CRON_SECRET, ENRICHMENT_TOKEN_SECRET, ADMIN_ALERT_PHONE must all be configured. Missing any one silently disables a critical feature |
| 4 | Set ADMIN_ALERT_PHONE to mom's real phone number | 5 minutes | Without this, lead notifications go nowhere. This is the single most important configuration for launch |

### 14.2 Testing phase (next 2 weeks)

With seed data in place, validate these flows in order. Each one should be tested on the live Vercel deployment, not just locally.

| # | Flow | Test steps | Pass criteria |
|---|---|---|---|
| 5 | Quote request end-to-end | Submit form on public site → verify lead appears in admin pipeline → verify SMS arrives at admin phone within 60 seconds (or queues if quiet hours) → verify acknowledgment email reaches submitter | All 3 confirmations pass |
| 6 | Quote creation and delivery | Admin creates quote from lead → adds line items → sends to client email → client opens token link → reviews quote details → accepts | Client receives email, link works, acceptance creates job record |
| 7 | Job assignment and employee view | Admin assigns employee to job → employee receives SMS notification → employee logs into portal → sees assignment with correct job details, address, checklist | Employee sees only their assigned jobs, not others |
| 8 | Employee execution flow | Employee moves status to in_progress → completes checklist items → uploads completion photo → marks assignment complete | Photo appears in Supabase storage, checklist items show completed, job status reflects completion |
| 9 | QA and completion report | Admin reviews completed job → approves QA → generates completion report → sends to client email | Client receives completion report email |
| 10 | Employment application | Submit application from careers page → verify record in hiring inbox → change status to reviewed → add admin notes | Full cycle works, emails fire to both admin and applicant |
| 11 | Admin modules empty state | Load each admin module with zero relevant records → verify no JavaScript errors, no infinite spinners, no broken layouts | All 10 modules render gracefully when empty |
| 12 | Admin modules with data | Load each module with seed data → verify data displays correctly, filters work, actions execute | All modules functional with real data |
| 13 | Mobile testing | Run flows 5-8 entirely on a phone | All forms submit, all modules load, all actions complete on mobile |
| 14 | Authentication boundaries | Attempt to access admin routes as employee, employee routes as unauthenticated, other employee's assignments as an employee | All unauthorized access blocked |

### 14.3 Content phase (parallel with testing, weeks 2-4)

These depend on mom's input and cannot be done by code alone.

| # | Item | Who | Effort | Dependency |
|---|---|---|---|---|
| 15 | Verify authority bar numbers with mom | You + mom | 30 minutes | Mom's confirmation of years, project count, and any other claims |
| 16 | Replace hardcoded testimonials with real ones | Mom collects, you implement | Mom: 1-2 weeks to collect. You: 1 hour to update component | Mom texts clients for testimonial quotes and gets permission to use them |
| 17 | Record mom's founding story | You interview, you write | 30 minutes recording, 2 hours writing | Schedule a specific time with her |
| 18 | Get mom's professional headshot | Mom | 10 minutes | Natural light, company shirt, clean background |
| 19 | Collect 10-15 real job photos from mom's phone | Mom | 30 minutes to browse her camera roll and send you the best ones | She almost certainly has usable photos already |
| 20 | Rewrite service page body content with Austin specificity | You (using Claude for drafts, mom for accuracy review) | 3-5 days across all pages | Mom confirms each service description is accurate to what she actually does |
| 21 | Rewrite apartment turnover page as the flagship service page | You + mom | 1 day | This is her primary current service and should be the strongest page on the site |
| 22 | Remove or reframe any language that sounds residential or maid-service | You | 2-3 hours | Audit all service pages, homepage sections, and meta descriptions |
| 23 | Add Austin neighborhood and area references to service pages | You | 1 day | Reference real areas she works: downtown, Domain, East Austin, South Congress, Round Rock, Cedar Park, etc. |

### 14.4 Pre-launch infrastructure (weeks 3-5)

| # | Item | Effort | Notes |
|---|---|---|---|
| 24 | Purchase domain | 30 minutes | Check: `aacleaningaustin.com`, `aacleaningservices.com`, `aandaservices.com`, `aacleaningatx.com`. Buy whatever is available and under $20/year |
| 25 | Configure domain on Vercel | 1 hour | DNS setup, SSL auto-provisions |
| 26 | Create Google Business Profile | 2-3 hours | Business name matching website exactly. Primary category: Commercial Cleaning Service. Service area: Austin metro. Real phone number. Link to website with UTM parameters |
| 27 | Set up GA4 alongside first-party analytics | 1-2 hours | First-party Supabase events already work. GA4 adds audience insights, traffic source detail, and Google Ads conversion tracking when you start spending on ads |
| 28 | Verify robots.txt allows crawling, sitemap.xml generates correctly | 30 minutes | Both exist in codebase — verify output on production URL |
| 29 | Submit sitemap to Google Search Console | 30 minutes | Requires verified domain |
| 30 | Configure Sentry with production DSN | 30 minutes | Error monitoring for real traffic. Currently conditional on DSN being set |
| 31 | Verify Twilio is in production mode with real phone number | 30 minutes | Sandbox mode may silently fail. Confirm TWILIO_FROM_NUMBER is a real purchased number |
| 32 | Verify Resend domain authentication | 30 minutes | SPF and DKIM records for email deliverability. Without this, emails may land in spam |
| 33 | Test quiet-hours queue processing | 1 hour | Submit a quote request during quiet hours (after 9pm CT). Verify it queues. Trigger notification-dispatch manually or via cron. Verify SMS arrives |

### 14.5 High-impact additions (weeks 4-6, pre-launch or launch week)

| # | Item | Effort | Business impact |
|---|---|---|---|
| 34 | Add before-photo requirement to employee portal | 1 day | Extend existing photo upload to require 1+ photos when status moves to in_progress. This starts building portfolio assets from day one |
| 35 | Connect authority bar to live database queries | 1 day | `COUNT(jobs WHERE status='completed')`, `COUNT(DISTINCT client_id)`, calculated years from founding date. SB-3 permanently resolved |
| 36 | Implement automated Google review request | 1 day | After job completion + positive rating, send SMS with direct Google review link. Highest ROI marketing automation for first 6 months |
| 37 | Add lead follow-up cron job to Vercel | 2 hours | The `/api/lead-followup` route exists and has the 1h/4h/24h tier logic. It needs a Vercel Cron trigger configured in `vercel.json` |
| 38 | Add notification-dispatch cron job to Vercel | 2 hours | Same — route exists, needs cron trigger to process the quiet-hours queue |
| 39 | Google for Jobs schema on careers page | 30 minutes | Free job listing distribution. Schema template provided in expansion docs Section 55.3 |
| 40 | LocalBusiness structured data verified against GBP | 1 hour | Homepage already has LocalBusiness schema. Verify NAP (name, address, phone) matches GBP exactly |
| 41 | Implement honeypot on quote request form | 1 hour | Blueprint claims it exists but it doesn't. Add hidden field, validate on server. Simple addition to existing validation |

### 14.6 Post-launch first 30 days

| # | Item | Effort | Trigger |
|---|---|---|---|
| 42 | Mom starts using admin dashboard on real jobs | Ongoing | Soft launch: parallel with current workflow for 2 weeks |
| 43 | 2-3 crew members start using employee portal on real jobs | Ongoing | Start with most reliable crew members |
| 44 | Mom requests Google reviews from 5-10 existing clients | Mom: 30 minutes | Personal text message with direct review link |
| 45 | Weekly GBP posts begin | 30 min/week | Completed project photo + brief description |
| 46 | Blog infrastructure and first 3 posts | 3 days code + 2-3 days content | Target keywords: "post construction cleaning Austin", "apartment turnover cleaning Austin", "commercial cleaning Austin TX" |
| 47 | Google Ads search campaign for top service keyword | 1 day setup | Start at $500/month on highest-intent keyword. Conversion tracking must be working first |
| 48 | Indeed job posting linking to careers page | 1 hour | Free basic posting. Sponsored if budget allows |

### 14.7 Post-launch days 30-90

| # | Item | Effort |
|---|---|---|
| 49 | Recurring job scheduling automation | 2-3 days |
| 50 | Client directory with communication history | 2-3 days |
| 51 | Rate card system for self-serve quote pricing | 2-3 days |
| 52 | Digital proposal PDF generator for $5K+ contracts | 3-5 days |
| 53 | Portfolio photo library with admin "promote to website" action | 1-2 days |
| 54 | Automated post-job satisfaction rating and testimonial collection | 1-2 days |
| 55 | One-page leave-behind PDF generator | 1-2 days |
| 56 | Google Local Services Ads setup | 1-2 days |

---

## 15. Pre-Launch Validation Checklist

Every item below must have a verified "yes" with evidence (screenshot, database query result, or test confirmation) before the site goes live to real traffic. Items are grouped by category. Any single "no" in a Critical item blocks launch.

### 15.1 Identity and credibility — Critical

- [ ] The phone number displayed on the website is a real number that rings to a phone your mom checks daily
- [ ] The phone number in `company.ts` matches the phone number that will be on the Google Business Profile
- [ ] The email address in `company.ts` is a real, monitored inbox
- [ ] The business name on the website, in structured data, and on GBP are identical
- [ ] Every testimonial on the site is from a real client who gave explicit permission to be quoted
- [ ] Every statistic on the authority bar has been verified by your mom as truthful or is connected to a live database query
- [ ] The about page contains your mom's real name, a real photo, and an accurate founding story
- [ ] Every photo on the public site is either a real photo of her work/crew or has been removed and replaced with real content
- [ ] No page on the site contains lorem ipsum, TODO markers, placeholder company names, or obviously AI-generated filler text
- [ ] Service descriptions accurately reflect services she currently offers and will deliver

### 15.2 Core conversion pipeline — Critical

- [ ] Quote request form submits successfully from desktop and mobile
- [ ] Lead record appears in `leads` table within 5 seconds of submission
- [ ] Admin receives SMS notification within 60 seconds (or notification queues during quiet hours and delivers at configured time)
- [ ] Submitter receives acknowledgment email within 2 minutes
- [ ] Admin can open lead pipeline, see the new lead, and take action without errors
- [ ] Admin can create a quote with line items and preview it
- [ ] Admin can send quote to client's email
- [ ] Client receives quote email with a working token link
- [ ] Client can open token link, review quote details, and accept
- [ ] Quote acceptance creates a job record in the `jobs` table
- [ ] The full pipeline above has been tested with a real email address and real phone number, not just test values

### 15.3 Employment pipeline — Critical

- [ ] Employment application form submits successfully from desktop and mobile
- [ ] Application record appears in `employment_applications` table
- [ ] Admin receives email notification of new application
- [ ] Applicant receives confirmation email
- [ ] Admin can view application in hiring inbox, see all submitted fields, update status, and add notes
- [ ] Form validation prevents incomplete submissions and displays meaningful error messages

### 15.4 Admin dashboard — Critical

- [ ] Admin can log in via `/auth/admin` and reach the dashboard
- [ ] A non-admin user cannot access `/admin` routes (returns redirect or error, not dashboard content)
- [ ] Each of the 10 modules loads without JavaScript errors when database has zero relevant records
- [ ] Each of the 10 modules loads without JavaScript errors when database has seed data
- [ ] Overview Dashboard displays correct counts for unclaimed leads, QA pending, today's schedule, and waiting quotes
- [ ] Lead Pipeline correctly groups leads by status columns
- [ ] Ticket Management allows creating, viewing, and updating job status
- [ ] Scheduling module displays job assignments on the correct dates
- [ ] Hiring Inbox displays applications with correct status and allows updates
- [ ] Configuration module persists notification preference changes to the database

### 15.5 Employee portal — Critical

- [ ] Employee can log in via `/auth/employee` and reach their portal
- [ ] Employee sees only their own assigned jobs, not other employees' assignments
- [ ] Employee can update assignment status (assigned → en_route → in_progress → complete)
- [ ] Employee can view and complete checklist items, with completion state persisting on refresh
- [ ] Employee can upload a completion photo that appears in Supabase storage
- [ ] Employee can submit an issue report that admin can see
- [ ] Employee can send a message that admin can read in the job's message thread
- [ ] SMS notification reaches employee when they are assigned to a new job (or queues during quiet hours)
- [ ] All of the above works on a mobile phone

### 15.6 Technical infrastructure — Critical

- [ ] Production domain resolves correctly with SSL (green lock in browser)
- [ ] All required environment variables are set in Vercel production (verify against the 15 required variables from audit Group 7.3)
- [ ] The TypeScript CSS import error in layout.tsx is resolved
- [ ] `robots.txt` returns correct rules allowing public page crawling
- [ ] `sitemap.xml` generates and lists all public pages
- [ ] At least one page load on production writes a conversion event to the `conversion_events` table (verifying first-party analytics is active)
- [ ] Submitting a quote request on production triggers SMS delivery (verifying Twilio is live and configured)
- [ ] Submitting an employment application on production triggers email delivery (verifying Resend is live and configured)
- [ ] Rate limiting is functional: submitting more than 5 quote requests from the same IP within an hour returns a 429 response

### 15.7 Technical infrastructure — Important but not launch-blocking

- [ ] Sentry is capturing errors on production (verify at least one test error appears in Sentry dashboard)
- [ ] Upstash Redis is connected and rate limiting uses distributed store (not just in-memory)
- [ ] Lighthouse performance score on homepage is above 80 on mobile
- [ ] No console errors on any public page when loaded in Chrome DevTools
- [ ] QuickBooks OAuth flow completes successfully and syncs at least one data type
- [ ] Notification dispatch cron is configured in `vercel.json` and has fired at least once
- [ ] Lead follow-up cron is configured and has fired at least once
- [ ] Offline photo queue has been tested by disabling network during upload and verifying retry after reconnection

### 15.8 Legal and compliance — Critical

- [ ] Privacy policy accurately describes data collected (quote forms collect name, phone, email, service type, timeline — confirm this matches the policy text)
- [ ] Terms of service are appropriate for a cleaning services business
- [ ] Quote request form includes SMS consent language before collecting phone number (TCPA compliance)
- [ ] Automated SMS messages include opt-out instruction
- [ ] Employment application includes consent checkbox for background check (already implemented)
- [ ] No user-facing page exposes internal data, employee PII, or system configuration

### 15.9 Content quality — Important

- [ ] Every public page has been read by a human (you and mom) and approved for accuracy
- [ ] Every service page describes services she actually performs, in language that matches how her clients talk about those services
- [ ] Service area pages reference real geographic areas she actually serves
- [ ] Industry pages accurately describe the types of clients she works with
- [ ] FAQ answers are accurate and helpful
- [ ] No page has thin or obviously templated content that would undermine credibility with a GC or property manager evaluating her
- [ ] Meta titles and descriptions are accurate and compelling (all confirmed present in audit, but content quality should be human-reviewed)
- [ ] Structured data (LocalBusiness, Organization, Service, FAQ) contains accurate information matching the visible page content

### 15.10 External presence — Required for launch week, not day one

- [ ] Google Business Profile is created, verified, and optimized (all checklist items from expansion Section 56.1)
- [ ] Google Search Console is verified and sitemap submitted
- [ ] GA4 property created and tracking code installed
- [ ] At least one social profile created (Google or Facebook) with consistent business name
- [ ] Direct Google review link URL is known and tested (format: `https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID`)

---

## 16. Maintenance Rules for Sections 13-15

**Section 13 (Audit Findings):** Update when a subsequent codebase audit is performed or when a finding is resolved. Mark resolved findings with date and evidence.

**Section 14 (Priority Plan):** Check off completed items with date. Do not remove completed items — they serve as implementation history. Add new items at the bottom of the appropriate tier with the next sequential number.

**Section 15 (Pre-Launch Checklist):** Every checkbox must be checked with evidence before go-live. If an item is determined to be not applicable, note why. This checklist is the final gate. No item should be removed — only checked off or explicitly deferred with documented reasoning and risk acceptance.


You're right — there's more. Continuing from Section 16.

---

## 17. Audit-Informed Technical Recommendations

These are specific code-level actions derived from the audit findings, organized by effort and impact.

### 17.1 Quick wins (under 2 hours each)

**Fix the layout.tsx CSS import error.**
The audit confirmed this is the only TypeScript compilation error in the codebase. It's on the critical rendering path for every single page. Likely a path alias issue in `tsconfig.json` or a missing type declaration for CSS modules. Should take 15 minutes to diagnose and fix.

**Add honeypot field to quote request form.**
The blueprint documents it, the code doesn't have it. Add a hidden form field (e.g., `company_website` with `display: none`), check on server side in the quote-request route — if the field has a value, silently reject the submission. Bot-filled forms almost always populate hidden fields. This supplements the existing rate limiting and dedup.

**Set `ADMIN_ALERT_PHONE` in Vercel production environment.**
Without this, the entire lead notification system is silently disabled. The quote-request route checks for this value and skips SMS if it's missing. No error is thrown. No log makes this obvious. This is the most dangerous silent failure in the system.

**Configure Vercel Cron for lead-followup and notification-dispatch.**
Both API routes exist and are fully implemented. They need cron triggers in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/lead-followup",
      "schedule": "0 */1 * * *"
    },
    {
      "path": "/api/notification-dispatch", 
      "schedule": "*/15 * * * *"
    }
  ]
}
```

The lead-followup route already checks business hours internally. The notification-dispatch route processes the quiet-hours queue. Without these crons, the 1h/4h/24h lead alerts never fire and queued quiet-hours notifications never deliver.

**Add Google for Jobs structured data to careers page.**
The careers page exists, the application flow works end-to-end, but the page has zero structured data. Adding a `JobPosting` schema takes 30 minutes and gets free distribution to Google job search results. Use the template from expansion Section 55.3, fill with real values: "Commercial Cleaning Technician", $16-$22/hr, Austin TX, full-time.

### 17.2 Moderate effort (2-8 hours each)

**Build the seed data script.**
This is the testing phase blocker. Create `supabase/seed.sql` or a Node script that populates the minimum dataset the audit identified:

- 1 admin profile (linked to a real Supabase auth user)
- 2 employee profiles (linked to auth users, with Spanish locale preference)
- 5 leads: 1 new, 1 qualified, 1 quoted, 1 won, 1 lost
- 3 quotes: 1 draft with line items, 1 sent with public token, 1 accepted
- 4 jobs: 1 scheduled, 1 in_progress, 1 completed with QA pending, 1 completed with QA approved
- Job assignments linking employees to jobs with varying statuses
- 1 checklist template with 8-10 items (in Spanish, since default locale is 'es')
- Checklist items linked to at least one job
- 2 employment applications: 1 new, 1 reviewed with admin notes
- 1 issue report linked to an active job
- 3-5 job messages on one job showing admin-employee conversation
- Notification preferences set on admin profile with realistic quiet hours
- 1-2 entries in notification_dispatch_queue to test queue processing

The script should be idempotent — safe to run multiple times without creating duplicates. Include a cleanup function that removes all seed data by a marker (e.g., a `seed_data` flag or known email domain).

**Add before-photo capture step to employee portal.**
The photo upload infrastructure is complete: compression, geolocation metadata, Supabase storage, IndexedDB offline queue. Extending it to require before-photos means:

1. When assignment status moves to `in_progress`, show a before-photo prompt before the status change completes
2. Store photos with a `photo_type` field: `before`, `during`, `after` (may require a column addition to `job_photos` or a convention in the `notes` field)
3. On the completion flow, require at least 1 before-photo and 2 after-photos before allowing status to move to `complete`

This is 1 day of work on existing infrastructure. The payoff is immediate: every job through the system generates portfolio-quality before/after evidence.

**Connect authority bar to live database.**
Replace the static `COMPANY_STATS` with a server component or API call that queries:

- Projects completed: `SELECT COUNT(*) FROM jobs WHERE status = 'completed'`
- Clients served: `SELECT COUNT(DISTINCT client_id) FROM jobs WHERE status = 'completed'`
- Years in business: `EXTRACT(YEAR FROM NOW()) - founding_year` (founding year stored as a constant since it doesn't change)
- Satisfaction rate: `SELECT AVG(rating) FROM post_job_ratings` (when ratings exist; fall back to static until first rating is collected)

Cache the result for 24 hours (or use ISR revalidation). When the database has few records early on, you may want a minimum display threshold — don't show "3 projects completed" on the authority bar. Show the static numbers until the real count exceeds a credibility threshold (e.g., 20+ projects), then switch to live data.

**Implement automated Google review request.**
The post-job automation infrastructure exists (`post_job_sequence`, `post_job_scheduler`, `post_job_settings`). Wire a new sequence step:

1. Job completed + QA approved
2. 24 hours later: SMS to client — "Thanks for choosing A&A Cleaning! How was your experience? Reply 1-5."
3. If reply ≥ 4 (or after 72 hours with no negative response): SMS with direct Google review link
4. Track in `post_job_sequence` to prevent duplicate requests

The Google review link format is `https://search.google.com/local/writereview?placeid=PLACE_ID`. Get the Place ID after creating the GBP.

### 17.3 Significant effort (1-3 days each)

**Rewrite all service page content for Austin specificity and commercial positioning.**
The audit confirmed all five service pages pull from generic `services.ts` data. Each page needs:

- Body content that references Austin specifically (neighborhoods, building types, climate considerations, local GC/PM ecosystem)
- Language reframed for commercial buyers, not homeowners
- Specific outcomes and process descriptions that match how your mom actually delivers the service
- Apartment turnover page elevated to flagship status with the most depth and the strongest conversion path
- Post-construction page positioned as her established reputation service, referencing GC relationship language
- Commercial cleaning page positioned as the growth target with specific Austin verticals (restaurants, medical, tech offices, event venues)

This is 3-5 days of content work. Claude can draft from detailed briefs but your mom needs to review every page for accuracy. A content brief document (one of the six recommended docs I mentioned earlier) would make this dramatically faster.

**Build a comprehensive end-to-end test script.**
The audit revealed the system has 26 tables, 12+ API routes, 10 admin modules, and 6+ employee portal features. Manual testing without a script will miss things. The test script should cover:

- Every flow from the priority plan Section 14.2
- Every empty-state scenario for admin modules
- Every authentication boundary (admin can't see employee routes, employee can't see other employees' data, unauthenticated can't see either)
- Every notification trigger and verify delivery
- Mobile-specific testing for all form submissions and portal interactions
- Edge cases: What happens when Twilio is down? When Resend is down? When Supabase is slow? The graceful degradation paths the code has built in need verification

This can start as a markdown checklist and evolve into Playwright automation later.

---

## 18. Expansion Document Triage

Based on the audit findings and your mom's business reality, here is the definitive triage of the expansion document sections. This replaces any earlier verbal guidance.

### 18.1 Active — incorporate into working roadmap

| Section | Topic | Why it's active | When |
|---|---|---|---|
| 51 | Strategic recalibration (sub-to-prime) | Core strategic direction. Every content and positioning decision flows from this | Now — informs all content work |
| 52 | Portfolio and evidence automation | Before-photo addition is 1 day. Testimonial collection automates via post-job flow. Metrics connect to live DB. Low effort, compounds over time | Weeks 2-4 |
| 53 | Sales enablement toolkit | One-page leave-behind and digital proposal generator directly support how she gets work (in-person, job sites, meetings) | Weeks 4-8 |
| 55 | Recruiting pipeline | Turnover is her constraint. Careers page enhancement, Indeed posting, Google for Jobs schema are immediate | Weeks 1-4 |
| 56 | Google Business Profile | Highest ROI marketing action. Zero code required. Directly generates leads | Week 1 |
| 60 | Master priority ranking (Tiers 0-3 only) | Validated and refined by audit. Tiers 0-3 are the working plan | Now through month 3 |
| 61 | Month-by-month calendar | Realistic execution framework adjusted by audit findings | Now through launch |
| 62 | Budget summary | Accurate cost framework | Reference |
| 63 | Revenue math and KPIs | $25K target math is sound. KPI tracking framework is actionable | Launch onward |
| 64 | Tell mom this week | The most operationally urgent section in all 64 | This week |
| 57.2 | Brand style guide contents | Needed when engaging contractors for logo, cards, vehicle branding | Weeks 4-8 |

### 18.2 On deck — activate when triggered

| Section | Topic | Activation trigger |
|---|---|---|
| 16.2-16.5 | Client directory, health scoring, contracts | When she has 15+ active direct clients |
| 18 | Estimating, rate cards, quote builder | When the first direct lead comes in and she needs to set her own pricing |
| 20 | Quality management expansion (SLAs, complaint workflow) | When she has an ops manager or 20+ jobs/month |
| 22 | Communication automation (full sequences) | After lead follow-up is live and working. Expand to nurture and re-engagement sequences |
| 24 | Customer self-service portal | When admin call volume from clients becomes a time burden |
| 40 | Email marketing and nurture | Month 4-6, after the organic and paid channels are established |
| 41 | Referral program | Month 3-6, after she has enough direct clients to seed referrals |
| 54 | Advertising and paid acquisition | Launch month for Google Ads. Google Local Services month 2 |
| 58 | Offline marketing materials | When budget allows. Business cards first ($50-100), vehicle magnets second ($100-300) |
| 59 | Partnership and referral network | When she has capacity to pursue GC/PM relationships proactively |

### 18.3 Archive — valuable but wrong stage

| Section | Topic | Reactivation condition |
|---|---|---|
| 15 | Safety, compliance, OSHA management | When pursuing institutional contracts or CIMS certification. Or when crew exceeds 20 and regulatory exposure increases |
| 17 | Financial operations beyond QuickBooks | When job costing data (time tracking + supply costing) is in place and she needs profitability analysis the platform provides but QuickBooks doesn't |
| 19 | Workforce development (training modules, performance management, career progression) | When crew exceeds 15 and personal onboarding doesn't scale |
| 23 | Green cleaning program | When pursuing LEED building contracts or when Austin market research shows premium positioning opportunity |
| 25 | Role-based access (6-role matrix) | When she hires an ops manager, bookkeeper, or sales person. Until then, she's the only admin |
| 26 | Mobile and PWA strategy | Employee portal PWA after crew adoption is proven. Admin mobile optimization after she's using the dashboard daily |
| 27 | Video content strategy | When budget allows professional shoot or when she has enough completed project footage to edit |
| 28 | Seasonal and capacity planning | When she has 6+ months of platform data to model capacity utilization |
| 29 | Subcontractor management module | When subcontractor usage is frequent enough to need system tracking versus phone coordination |
| 30 | Data governance and privacy (column encryption, access credential security) | Before storing building access codes digitally. Before any sensitive PII beyond what's currently collected |
| 31 | Disaster recovery and business continuity | When the platform is the primary operational system (not a parallel tool) |
| 33 | Competitive intelligence framework | When marketing budget and strategy are mature enough to warrant structured competitive analysis |
| 34 | Fleet and equipment management | When fleet exceeds 3-4 vehicles |
| 35 | Emergency and after-hours service | When she decides to offer this as a service line |
| 36 | Warranty and guarantee framework | When formalizing service guarantees as part of commercial contract positioning |
| 37 | Vendor and supplier management | When supply spend exceeds $2-3K/month |
| 38 | Multi-location architecture | Only if expanding beyond Austin |
| 39 | Full WCAG 2.1 AA audit | When pursuing government or institutional contracts that require it, or as part of general maturity |
| 42 | Compliance calendar | When crew exceeds 15 and regulatory tracking becomes a real operational burden |
| 43 | NPS system | Month 6+, after basic satisfaction rating is working and she has enough data to calculate meaningful NPS |
| 44 | Insurance and bonding detail | When pursuing larger contracts that require higher coverage limits or specific bond types |
| 45 | Industry association roadmap | When budget and time allow. One membership first (ABC Texas or Austin Apartment Association) |
| 46 | Notification priority framework | When notification volume is high enough to need severity-based routing |
| 47 | Platform testing strategy (CI/CD, Playwright, visual regression) | When the platform is stable and you're doing regular feature development that needs regression protection |
| 48 | Incident response plan | When the platform is the primary operational system and downtime has direct business impact |

---

## 19. Questions That Must Be Answered Before Launch

These are not technical checklist items — those are in Section 15. These are business and strategic questions that need definitive answers to ensure the website accurately represents the business and effectively generates leads.

### 19.1 Business identity

1. What is the exact legal business name? Does it match what will be on the Google Business Profile, the website, invoices, and insurance certificates?
2. Is the phone number in `company.ts` (512-825-2212) the permanent business number? Will it be answered during business hours? What happens after hours — voicemail with professional greeting, or does it go unanswered?
3. Is the email address in `company.ts` (AAcleaningservices@outlook.com) the permanent business email? Is there a plan to move to a domain-based email (e.g., info@aacleaningaustin.com) once the domain is purchased? Domain email looks significantly more professional to GC and PM buyers.
4. What is the business address? Service-area businesses don't need to display a physical address on the website, but Google Business Profile verification may require one. Is there a registered business address?
5. What year was the business founded? The authority bar says "15+ years" — confirm the founding year so this can be calculated dynamically.

### 19.2 Service accuracy

6. Which of the five service types on the website does she actively perform today? Confirm each one:
   - Post-construction cleaning: active, reduced, or paused?
   - Final clean: is this separate from post-construction in her actual service delivery?
   - Commercial cleaning: does she have current commercial recurring clients, or is this aspirational?
   - Move-in/move-out (apartment turnover): confirmed as current primary service?
   - Windows and power wash: does she offer this standalone, only as an add-on, or not at all currently?

7. Are there services she performs that are NOT on the website? For example: restaurant kitchen deep cleaning, medical office cleaning, event venue cleaning, or other verticals she already serves?

8. What is her actual service area? The website lists 10 cities. Does she actively work in all of them, or are some aspirational? Are there cities she works in that aren't listed?

9. The industry pages target General Contractors, Property Managers, and Commercial Spaces. Are all three accurate targets? Which one represents the most current revenue? Which one is the most desired growth target?

### 19.3 Competitive positioning

10. What does she charge for her primary services? Even rough ranges are needed to validate whether pricing guidance on the website would be appropriate or whether she prefers to keep pricing fully custom/quote-based.

11. What does she believe her competitive advantage is? Speed? Quality? Reliability? Price? Bilingual crew? Willingness to take on difficult jobs? Her answer should directly inform the homepage hero messaging and service page positioning.

12. Who are the 2-3 competitors she's aware of? What do they do well? What do they do poorly? This doesn't need to be in the website but it informs how the content differentiates.

13. When she subcontracts through the major company, what percentage of the contract value does she receive versus what the middleman takes? This quantifies the financial case for direct client acquisition and helps frame the urgency of the transition.

### 19.4 Operational readiness

14. When a lead comes in from the website, who will respond and how quickly? If mom is on a job site until 6pm, will leads sit for 8+ hours? Is there someone else who can make first contact? The lead follow-up system sends escalating alerts at 1h, 4h, and 24h, but the alerts are useless if nobody acts on them.

15. What is her realistic capacity for new work right now? If the website generates 5 new leads this month, can she serve them? Or is she already at capacity with existing clients? This determines whether marketing spend makes sense at launch or whether hiring needs to come first.

16. Is she willing to use the admin dashboard as her primary job management tool, or will it always be a supplement to WhatsApp and Excel? The answer determines how much to invest in dashboard refinement versus keeping it simple and focusing on the public site.

17. Does her crew currently have smartphones with data plans? The employee portal requires internet access. If some crew members don't have reliable phone internet, the portal adoption strategy needs to account for that.

18. What language should admin-facing content be in? The employee portal is bilingual with Spanish as primary. Should the admin dashboard also have Spanish support, or does mom operate in English on the business side?

### 19.5 Content and marketing readiness

19. Does mom have a professional email signature? Every email she sends to a client or GC should include her name, title, phone, and website link. This is zero-cost marketing.

20. Does she have any existing relationships with GCs or PMs who would provide testimonials? Even 3 good ones changes the website from "unproven" to "trusted." Which clients does she have the strongest relationship with?

21. Are there any completed projects she's particularly proud of? Projects that represent her best work? These become case studies and before/after portfolio content. Get the story: who was the client, what was the scope, what was challenging, what was the result.

22. Is she open to being the face of the business on the website? Some business owners prefer anonymity. But for a company transitioning from subcontractor to prime contractor, the owner's credibility IS the company's credibility. Her name, face, and story on the about page is the single most important trust signal for commercial buyers evaluating whether to give a $20K contract to a company they found online.

23. What is her comfort level with advertising spend? The budget document says $500-$1,000/month for Google Ads. Has this been discussed and agreed to? Is there a maximum monthly spend she's comfortable with while the ROI is being proven?

---

## 20. Document Consolidation Recommendation

The current documentation set includes:

- `website-blueprint.md` (the base document, Sections 1-12)
- `expansion-maturity-roadmap.md` (Sections 15-50)
- Expansion addendum (Sections 51-64)
- `solutioning-guide.md`
- `bring-it-to-an-a.md`
- `feedback3.0-validation-evidence-2026-04-11.md`
- `admin-employee-e2e-test-guide.md`

With the additions from this conversation (Sections 13-19), the total documentation is approximately 50,000+ words across 7+ files. For a solo developer who needs to move fast, this is too much surface area to maintain and reference.

### 20.1 Recommended consolidated structure

**Document 1: `website-blueprint.md`** — keep as-is (Sections 1-12) with corrections noted in Section 13.3. This is the technical reference for what exists. Append Sections 13 (audit findings) and 17 (technical recommendations).

**Document 2: `launch-plan.md`** — new file combining:
- Section 14 (condensed priority plan) as the working task list
- Section 15 (pre-launch validation checklist) as the launch gate
- Section 19 (pre-launch questions) as the business readiness gate
- Relevant items from the existing E2E test guide consolidated into Section 14.2

This becomes the single document you open every day to know what to work on next.

**Document 3: `expansion-reference.md`** — the triage table from Section 18, plus the full text of all expansion sections (15-64). Organized with the triage table as the front matter so you can quickly see what's active versus archived without reading 40,000 words. You only dig into specific sections when their activation trigger fires.

**Document 4: `solutioning-guide.md`** — keep as-is. This tracks the specific technical issues (SB-*, C-*, XF-*) that need closure. Cross-reference from the launch plan where relevant.

**Archive everything else** that doesn't fit into these four documents. If a document isn't being opened at least weekly, it's not serving you — it's creating an illusion of progress.

### 20.2 Maintenance cadence

- `launch-plan.md`: Update every work session. Check off completed items. Add discoveries.
- `website-blueprint.md`: Update when code changes. Keep in sync with actual codebase.
- `expansion-reference.md`: Review monthly. Promote sections to active when triggers fire.
- `solutioning-guide.md`: Update when issues are resolved or new ones discovered.

---




### Today

**Task 1: Fix the layout.tsx CSS import error.**
Open the file, fix the path, confirm the build compiles clean. This is 15 minutes and it's blocking everything downstream.

**Task 2: Set every required environment variable in Vercel production.**
Go to Vercel dashboard → your project → Settings → Environment Variables. Add every single one from the audit list. The critical ones that silently break things if missing:

- `ADMIN_ALERT_PHONE` — set to your mom's real phone number
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `CRON_SECRET`
- `ENRICHMENT_TOKEN_SECRET`

If you don't have Twilio or Resend accounts set up yet, create them today. Twilio gives you trial credits. Resend has a free tier. This takes an hour.

**Task 3: Send this to Codex right now.**

```
Create a seed data SQL script at supabase/seed.sql that populates the database 
with realistic test data for a commercial cleaning company called A&A Cleaning 
Services based in Austin, TX. The script must be idempotent (safe to run 
multiple times).

Reference the existing migration files in supabase/migrations/ for exact table 
schemas, enum values, column types, and foreign key relationships.

The seed data should include:

1. Profiles (using Supabase auth.users - create placeholder UUIDs that will be 
   linked to real auth users later):
   - 1 admin profile: Maria Rodriguez, admin role, phone +15128252212, 
     notification_preferences with quiet_hours 21:00-07:00 CT
   - 3 employee profiles: Spanish locale, employee role, realistic Austin phone 
     numbers, names like Carlos Mendez, Sofia Ramirez, Diego Hernandez

2. Leads (5 total across different statuses):
   - 1 new lead: apartment complex property manager, 200-unit property in 
     Round Rock, service_type = move_in_out
   - 1 qualified lead: GC needing post-construction cleanup, 50,000 sqft 
     office building downtown Austin
   - 1 quoted lead: restaurant group needing commercial cleaning for 3 
     locations
   - 1 won lead: property management company, converted to client
   - 1 lost lead: competed on price and lost

3. Quotes (3 total):
   - 1 draft quote linked to the qualified lead with 4 line items 
     (labor, supplies, equipment, margin) totaling $8,500
   - 1 sent quote linked to the quoted lead with public_token generated, 
     totaling $3,200/month
   - 1 accepted quote linked to the won lead, accepted_at set to 5 days ago

4. Clients (2):
   - The won lead converted to a client
   - One existing recurring client: Apex Property Management

5. Jobs (4 across different statuses):
   - 1 scheduled for tomorrow: apartment turnover, 12 units, assigned to 
     Carlos and Sofia
   - 1 in_progress today: post-construction final clean, assigned to Diego
   - 1 completed yesterday with qa_status = pending: commercial office clean
   - 1 completed last week with qa_status = approved: apartment turnover, 
     8 units

6. Job assignments linking employees to the above jobs with appropriate 
   statuses (assigned, in_progress, complete)

7. Checklist template:
   - Name: "Apartment Turnover Standard" 
   - Locale: 'es'
   - 10 items in Spanish: Limpiar ventanas, Desinfectar baños, Limpiar 
     cocina y electrodomésticos, Aspirar y trapear pisos, Limpiar closets 
     y estantes, Limpiar puertas y marcos, Revisar y limpiar luces, 
     Limpiar balcón/patio, Inspección final de calidad, Tomar fotos de 
     finalización

8. Job checklist items linked to the in_progress job from the template

9. Employment applications (2):
   - 1 new: Ana Gutierrez, 3 years experience, has transportation, 
     authorized to work, prefers Spanish
   - 1 reviewed: Roberto Silva, 5 years experience, admin_notes = 
     "Strong references, schedule interview", status = interview_scheduled

10. Issue reports (1): linked to the in_progress job, reported by Diego, 
    description in Spanish about finding damaged drywall

11. Job messages (4): conversation on the in_progress job between admin 
    and Diego about the drywall issue, messages in Spanish

12. Notification dispatch queue entries (2):
    - 1 queued for morning delivery (quiet hours delayed)
    - 1 sent successfully yesterday

Important:
- Use realistic Austin addresses for all jobs
- All monetary values should reflect real commercial cleaning pricing 
  ($500-$20,000 range)
- Employee-facing content in Spanish
- Include comments in the SQL explaining each section
- Add a cleanup section at the end (commented out) that removes all seed 
  data by matching on known seed identifiers
- Do NOT create auth.users entries - those will be created manually through 
  Supabase dashboard. Use placeholder UUIDs with a comment noting they need 
  to be replaced after auth user creation.
```

This unblocks your entire testing phase. Once the seed script runs, every admin module and employee portal feature has data to display and act on.

### This week (after seed data exists)

**Test the five critical flows yourself. In order. On the live deployment. On your phone and your computer.**

Flow 1: Open the public site on your phone. Fill out the quote request form with your real email and phone number. Check that the lead appears in the admin dashboard. Check that you get an SMS (or that it queued if it's quiet hours). Check that you get an acknowledgment email.

Flow 2: In the admin dashboard, find that lead. Create a quote. Send it to your email. Open the email on your phone. Click the token link. Review the quote. Accept it. Go back to admin and verify a job was created.

Flow 3: Log in as an employee. Find an assigned job from the seed data. Move it to in_progress. Complete some checklist items. Upload a photo from your phone camera. Submit an issue report. Send a message. Verify all of it persists on refresh.

Flow 4: In admin, go to the hiring inbox. Verify the seed applications appear. Change a status. Add notes. Then go to the public careers page on your phone and submit a real application. Verify it shows up in admin.

Flow 5: In admin, check every other module loads correctly with seed data. Overview dashboard shows real numbers. Scheduling shows jobs on the calendar. Dispatch shows the queue. Configuration saves preferences.

**Write down every bug you find.** Don't fix them during the testing pass. Just document them. Then prioritize and fix in batches. This prevents the loop of "test one thing, fix it, break something else, never finish testing."

### Send this to Codex as a second task this week

```
Add Vercel Cron configuration to vercel.json for two existing API routes:

1. /api/lead-followup — should run every hour (the route already checks 
   business hours internally)
2. /api/notification-dispatch — should run every 15 minutes (processes 
   quiet-hours notification queue)

Both routes require CRON_SECRET header for authentication. Reference the 
existing route implementations to verify the exact header name and 
validation logic they expect.

Also verify that vercel.json exists and has correct configuration. If it 
doesn't exist, create it with the cron configuration plus any other 
standard Vercel configuration the project needs.
```

### Next week

**Content work starts.** This runs parallel to bug fixing from your testing pass.

Have the conversation with your mom. Not a big formal meeting — you need 30 minutes where you record her on your phone answering these questions:

- "Tell me how you started this business." (This becomes the about page.)
- "What makes your work different from other cleaning companies?" (This becomes the hero messaging.)
- "What kind of work are you doing the most right now?" (This validates the service page priority.)
- "What kind of work do you want to do more of?" (This validates the growth positioning.)
- "How many projects have you completed, roughly, over the years?" (This validates the authority bar.)
- "Which clients would say good things about you if I asked?" (These become your testimonial sources.)

Then ask her to send you photos from her phone. She has them. Every cleaning business owner has hundreds of job site photos they've never used for marketing.

### What about the 3,467-line blueprint?

**Do not sit down and read it end to end.** It's a reference document, not a novel. You use it when you need to know how something works or where something lives in code. The sections you'll actually reference this month:

- Section 13 (audit findings) — when fixing issues the audit surfaced
- Section 14 (priority plan) — your daily "what do I work on" reference
- Section 15 (pre-launch checklist) — your launch gate, checked weekly
- Section 19 (pre-launch questions) — your mom conversation guide

Everything else sits there until you need it.

### What about chunk optimization and performance?

**Not now.** The audit confirmed you're already using dynamic imports and code splitting. The build has an analyze script (`ANALYZE=true next build`). Run it once after you've fixed the layout.tsx error and the build is clean, look at the output, and note anything obviously wrong. But performance optimization before you have real traffic is premature optimization. Get the site live, check Lighthouse scores on the production URL, and optimize the specific things that score poorly. Don't guess.

### What about additional features?

**No new features until the five critical flows pass testing on production.** Every hour spent on a new feature right now is an hour not spent on making the existing features work reliably. The codebase has more features than the business needs for the next 6 months. The gap isn't functionality — it's verification, content, and go-live readiness.

### What files should you create?

One. The `launch-plan.md` I described in Section 20.1. Pull Section 14 (priority plan) and Section 15 (pre-launch checklist) into it. That's your daily working document. Everything else already exists.

### The honest summary of where you are

You've built something genuinely impressive in a month. The architecture is solid, the schema is production-grade, the notification system is sophisticated, the security model is correct. Most solo developers with AI assistance produce a pile of half-working features. You have a coherent, well-structured platform.

But you're at the point where building more feels productive and testing feels tedious. The next three weeks need to be testing, fixing, content, and environment configuration — not new features, not new documents, not expansion planning. The work that gets this live is less exciting than the work that built it, but it's the work that turns it from a project into a product.

Fix the TypeScript error. Set the environment variables. Run the seed script. Test the five flows. Talk to your mom. That's your week.

Good. Here's the full timeline from day 2 through launch, assuming day 1 knocks out the seed script, env vars, cron config, and layout fix.

---

## Day 2-3: Critical flow testing

You have seed data. You have environment variables set. Now you break things on purpose.

**Day 2 morning: Public site to admin pipeline.**

Test quote request submission from your phone and your computer. Use your real email and real phone number. Submit 3 different quote requests with different service types. After each one:

- Check the `leads` table in Supabase dashboard — verify the record exists with correct fields
- Check your phone — did SMS arrive? If it's quiet hours, check `notification_dispatch_queue` for a queued entry
- Check your email — did the acknowledgment arrive? Check spam folder
- Log into admin dashboard — does the lead appear in the pipeline in the correct status column?
- Check the conversion_events table — did the analytics event fire?

If SMS didn't arrive, the problem is one of: ADMIN_ALERT_PHONE not set, Twilio credentials wrong, Twilio still in sandbox mode (sandbox only sends to verified numbers), or quiet hours blocking delivery. Diagnose and fix before moving on.

**Day 2 afternoon: Quote lifecycle.**

From the admin dashboard, pick one of the leads you just created. Create a quote with line items. Send it to your email. Open the email. Click the token link. Verify the quote review page renders with correct details. Accept the quote. Go back to admin and verify a job was created with the correct client, address, and service type.

Then do it again but reject the quote. Verify the lead status updates correctly.

Then send a quote to a different email address you control (Gmail, etc.) to verify deliverability across providers.

**Day 3 morning: Employee portal.**

Log in as one of the seed employee accounts. You'll need to create the actual Supabase auth users first — go to Supabase dashboard → Authentication → Users → create users with the same UUIDs referenced in your seed data, or update the seed data profile IDs to match the auth users you create. This is the manual linking step the seed script noted.

Once logged in as an employee:

- Verify you see only your assigned jobs, not all jobs
- Open an assigned job. Check that address, scope, and checklist items display
- Move status from assigned to en_route to in_progress
- Complete 3-4 checklist items. Refresh the page. Verify they stayed completed
- Upload a photo from your phone camera. Verify it appears in Supabase Storage
- Submit an issue report with a description. Verify it persists
- Send a message. Log into admin in another browser. Verify the message appears on that job

**Day 3 afternoon: Everything else.**

- Log in as the second employee. Verify you cannot see the first employee's assignments
- Try to access `/admin` while logged in as an employee. Verify you get blocked
- Open every admin module with seed data loaded. Click through each one. Note any errors, broken layouts, or unexpected behavior
- Submit an employment application from the careers page on your phone. Check admin hiring inbox
- Load the public site on your phone and click through every page. Note broken layouts, overlapping elements, text that's hard to read, buttons that are too small to tap

**Write everything down in a single file: `bugs.md`.** Format:

```
## Critical (blocks launch)
- [ ] Description. Where it happens. Steps to reproduce.

## Important (should fix before launch)
- [ ] Description. Where it happens.

## Minor (fix when time allows)
- [ ] Description.
```

Don't fix anything during testing. Just document. You'll be tempted to fix things as you find them. Resist. Complete the full testing pass first so you have the complete picture before you start spending time on fixes.

---

## Day 4-5: Bug fix sprint

Prioritize from your bugs.md list. Critical items first. Feed them to Codex in batches grouped by surface area:

- All public site bugs as one batch
- All admin dashboard bugs as one batch
- All employee portal bugs as one batch
- All API/notification bugs as one batch

Codex is most effective when you give it related bugs together because it can see the pattern and fix shared root causes rather than patching symptoms individually.

After fixes deploy, re-test the specific flows that were broken. Don't re-test everything yet — you'll do a full regression pass later.

---

## Day 6: Mom conversation

This is the most important day in the entire timeline. Everything content-related depends on this conversation.

**Before the conversation, prepare a simple document with what you need from her.** Text it to her the night before so she can think about it:

```
Mom, I need about 30 minutes with you for the website. I'm going to 
record the conversation so I can write things up later. Here's what 
I need:

1. Your story — how you started the business, why, what drives you
2. What makes your work better than other companies
3. Roughly how many projects you've done over the years
4. What services you're doing the most right now
5. What services you want to grow into
6. Names of 3-5 clients who would say good things about you
7. Go through your phone and send me 15-20 photos from past jobs

That's it. 30 minutes and then I'll handle the rest.
```

**During the conversation, record on your phone.** Let her talk. Don't try to write things down while she's speaking. Ask follow-up questions when something is interesting. The best about-page content comes from her saying something genuine that you couldn't have scripted.

**After the conversation, you have:**

- Raw audio to transcribe (use Claude to help clean up a transcript into about-page prose)
- Verified metrics for the authority bar
- Client names to reach out to for testimonials
- Photos to sort through and implement
- Service priority confirmation
- Growth direction confirmation

**That same day, text or help her text 3-5 clients for testimonials.** Give her a message she can copy-paste:

```
Hi [name], this is [mom's name] from A&A Cleaning. I'm building a 
new website for the business and would love to include a brief 
testimonial from you. Would you be willing to write 2-3 sentences 
about your experience working with us? It would mean a lot. Thank you!
```

Testimonials take time. People forget. She may need to follow up. Start this now so they trickle in over the next 2 weeks.

---

## Days 7-10: Content rewrite sprint

This is where you and Claude do heavy work together. You have mom's verified information. Now rewrite every public page.

**Day 7: About page and homepage hero.**

Write the about page first because it forces you to articulate the brand story, which then informs everything else. Use mom's recorded story as the foundation. Include:

- Her real name and the photo she gave you
- Founding story in her words (cleaned up but authentic)
- Why quality matters to her specifically
- Years of experience, types of projects, team description
- Credentials (licensed, insured, bilingual)

Then rewrite the homepage hero section. The current hero is generic. After the about page work, you know exactly what makes her different. The hero should communicate that in one headline and one subheadline.

**Day 8: Service pages — apartment turnover and post-construction.**

These are her two strongest services. Each page needs:

- 800-1200 words of real content (not template filler)
- Austin-specific references: neighborhoods she works in, building types, local market context
- Process description that matches how she actually delivers the service
- Specific outcomes: "12-unit apartment complex turned over in 48 hours" type specificity
- FAQ section with questions her actual clients ask
- Strong CTA connecting to quote form

Feed Claude a detailed brief for each page. Include what mom told you about the service, the target buyer persona, keywords to target, and the tone. Review the output for accuracy. If it sounds like AI wrote it, rewrite the parts that sound generic.

**Day 9: Remaining service pages and industry pages.**

Commercial cleaning page — position as the growth service. Reference specific Austin verticals: restaurants, medical offices, tech company offices, event venues.

Windows/power wash — if she offers it, keep it brief and positioned as an add-on. If she doesn't actively offer it, consider removing the page entirely rather than having a weak page that dilutes the site.

Industry pages — verify the three industry targets (GC, PM, Commercial) match her reality. Rewrite with specifics from what she told you.

**Day 10: City pages, FAQ, careers, contact.**

City pages — the audit found these have unique per-city content which is good. Verify the proof metrics (annual projects, response window, etc.) against reality. If they're fabricated, either replace with real numbers or remove and replace with descriptive content about her experience in that area.

FAQ — rewrite with her actual answers to common questions. What do clients actually ask her?

Careers page — add the value proposition content. Pay range, what makes this job different, Spanish language support. Add the Google for Jobs schema (should already be done by Codex from the earlier task).

Contact page — verify all contact information matches reality.

---

## Days 11-12: Photo implementation and visual polish

By now you should have photos from mom's phone. Sort them:

- Best before/after pairs → homepage before/after slider
- Best completed work photos → service pages
- Crew at work photos → about page, careers page
- Any photos showing equipment, vehicles, uniformed crew → about page

Replace every placeholder or stock image on the site with real photos. If you don't have enough photos for every page, it's better to have fewer real photos than to keep stock images. A page with one real photo and text is more credible than a page with three stock photos.

Implement the photos. Check them on mobile — verify they look good at phone screen size, not just desktop.

---

## Days 13-14: Domain, GBP, and external setup

**Day 13: Domain and DNS.**

Search for available domains. Check these in order:

- `aacleaningaustin.com`
- `aacleaningservices.com`
- `aandaservices.com`
- `aacleaningatx.com`
- `aacommercialcleaning.com`

Buy whichever is available and reasonable. Configure DNS on Vercel. SSL will auto-provision. Update `NEXT_PUBLIC_APP_URL` environment variable. Update the canonical URL in `site.ts`. Redeploy.

If mom wants a domain-based email (she should — `info@aacleaningaustin.com` looks far more professional than an Outlook address for $20K contracts), set that up through the domain provider or Google Workspace ($6/month). Update `company.ts` with the new email.

**Day 14: Google Business Profile.**

Create the GBP. This is the single highest-leverage marketing setup for local leads. Fill out everything from the checklist in expansion Section 56.1:

- Business name exactly matching the website
- Primary category: Commercial Cleaning Service
- Secondary categories: Post Construction Cleaning Service, Janitorial Service
- Service area: Austin metro plus the cities from the service-area pages
- Phone number matching the website
- Website URL with UTM: `?utm_source=google&utm_medium=organic&utm_campaign=gbp`
- Business hours
- Business description: keyword-rich, 750 characters, matching website positioning
- Upload 10-15 of the real photos
- Services listed with descriptions matching service pages

Verification may take a few days (Google sends a postcard or offers phone/email verification). Start this now so it's verified by launch.

Set up Google Search Console at the same time. Verify ownership via DNS. Submit the sitemap.

Set up GA4. Create the property, get the measurement ID, add the tracking script. This supplements your first-party Supabase analytics with traffic source detail and audience insights that you'll need when evaluating ad performance.

---

## Days 15-17: Second testing pass and regression

You've changed a lot of content, added real photos, potentially updated company constants, configured a new domain. Things may have broken.

**Full regression test.** Run through all five critical flows again on the production deployment with the real domain. Test on your phone and computer. This time also test:

- Every public page loads without errors on the new domain
- Phone number links work (tap to call on mobile)
- Email links work
- Structured data is valid (use Google's Rich Results Test tool on each page type)
- Quote request form still works end-to-end
- Admin dashboard still functions
- Employee portal still functions

Fix any regressions. This should be a shorter cycle than the first bug fix sprint since you're catching breakage, not discovering baseline issues.

---

## Days 18-20: Pre-launch hardening

**Day 18: Implement the high-impact quick additions from Section 14.5.**

Send these to Codex as focused tasks:

Honeypot on quote form. Before-photo requirement in employee portal. Authority bar connected to live database (or set to verified static numbers if the live connection isn't ready). Verify Resend email domain authentication (SPF/DKIM records). Verify Twilio is in production mode.

**Day 19: Pre-launch checklist pass.**

Go through every item in Section 15 of the blueprint. Check each one. For any item you can't check off, decide: is it a launch blocker or can it wait? Be honest. The checklist distinguishes critical from important. Don't let important items delay launch.

**Day 20: Soft launch to mom.**

Show her the site. Walk her through the public pages. Then show her the admin dashboard. Let her click around. Watch what she does without guiding her. Note where she gets confused. Note what she tries to do that doesn't work how she expects.

Her feedback at this point is more valuable than another week of solo refinement. She's the user. If she can't figure out how to see a new lead and respond to it within 2 minutes of looking at the dashboard, that's a UX problem worth fixing before public launch.

---

## Days 21-25: Mom feedback fixes and launch prep

Fix whatever she surfaced. These are typically:

- Wording that doesn't match how she thinks about her business
- Flows that have too many steps for what she needs to do
- Information she wants to see that isn't prominent enough
- Things she doesn't care about that are taking up space

This is also when the first testimonials should be arriving from clients she texted. Implement them as they come in. Replace the hardcoded testimonials one by one.

**Prepare the first Google Business Profile post.** Take the best before/after photo pair, write a brief description of the project, add a CTA to get a quote. This will go live on launch day.

**Prepare the Indeed job posting.** Write the listing, link the application URL to the careers page. This goes live on launch day.

**Draft mom's email signature.** Name, title (Owner), company name, phone, email, website URL. She should start using this immediately.

---

## Days 26-28: Launch

**Day 26: Final checklist.**

One more pass through the pre-launch checklist. Everything critical must be checked. Deploy any final fixes.

**Day 27: Go live.**

- Confirm production site is running on the real domain with SSL
- Publish the first GBP post
- Post the Indeed job listing
- Submit sitemap to Google Search Console (if not already done)
- Mom starts using the admin dashboard for real jobs (parallel with her current workflow)
- Share the site URL with 2-3 trusted people (not clients yet) for a sanity check

**Day 28: Monitor.**

Watch for errors in Sentry. Check that analytics events are collecting in the conversion_events table. Verify the lead-followup cron is firing (check logs in Vercel dashboard). Check that notification-dispatch cron is processing the queue.

If a real quote request comes in (from the sanity check people or from organic traffic), treat it as the ultimate end-to-end test. Watch it flow through the entire pipeline.

---

## Days 29-35: Post-launch stabilization

**Week 1 post-launch goals:**

- Mom has used the admin dashboard on at least 3 real interactions (not test data)
- 1-2 crew members have used the employee portal on a real job
- 5 existing clients have been asked for Google reviews
- Any bugs from real usage are logged and prioritized
- Google has begun indexing the site (check Search Console for indexed pages)
- At least one GBP post has been published

**Fix real-usage bugs as they surface.** These are the most important bugs because they're blocking actual business operations, not theoretical test scenarios.

---

## Days 36-45: Growth activation

Now and only now do you start adding growth features and marketing spend.

**Set up Google Ads.** Start with one campaign targeting her strongest service keyword. If apartment turnover is her current bread and butter: "apartment turnover cleaning Austin" and close variants. $500/month budget. Conversion tracking pointing at the quote form submission event.

**Implement automated post-job review request.** The post-job-sequence infrastructure exists. Wire it to send the Google review request SMS 72 hours after job completion when the rating is positive.

**Write the first 3 blog posts.** Target keywords:

1. "Post construction cleaning Austin" — what to expect, how to choose a contractor, what it costs
2. "Apartment turnover cleaning for property managers" — speed, consistency, documentation
3. "How to prepare for a commercial cleaning service" — positions her as the expert, captures informational search intent

Blog infrastructure needs to be built (route, layout, MDX or CMS). This is a Codex task. The content is a Claude task.

**Build the one-page leave-behind PDF.** Mom needs something to hand to GCs and PMs she meets on job sites. Company name, services, proof points, QR code to the website, phone number. Clean, professional, one page. This is a quick Codex task using a server-rendered PDF approach.

---

## Days 46-60: Iterate based on data

By this point you have 2-4 weeks of real traffic data, real lead data, and real usage data. Decisions become data-driven instead of speculative:

- Which pages get the most traffic? Those need the most content investment
- Where do quote form visitors drop off? That's where UX needs improvement
- How fast is mom responding to leads? If slow, the notification system needs adjustment
- Is the crew using the employee portal? If not, find out why and fix it or accept it
- Are Google reviews accumulating? If not, the ask process needs refinement
- What's the cost per lead from Google Ads? Adjust budget and targeting accordingly

This is when you start pulling from the expansion reference document. The activation triggers will start firing based on real business signals:

- First direct client comes in → activate rate card and pricing tools
- Client count hits 15 → activate client directory depth
- Crew adoption proves out → invest in employee portal enhancements
- Ad spend crosses $1K/month → invest in attribution and analytics depth
- Mom hires office help → activate role-based access

---

## The calendar view

| Days | Focus | Output |
|---|---|---|
| 1 | Env vars, seed script, cron config, layout fix | Infrastructure ready for testing |
| 2-3 | Five critical flow testing | bugs.md with complete issue inventory |
| 4-5 | Bug fix sprint | Critical and important bugs resolved |
| 6 | Mom conversation | Story, photos, metrics, testimonial contacts |
| 7-10 | Content rewrite sprint | All public pages rewritten with real content |
| 11-12 | Photo implementation | Real photos replacing all placeholders |
| 13-14 | Domain, GBP, Search Console, GA4 | External infrastructure live |
| 15-17 | Second testing pass and regression | Production verified on real domain |
| 18-20 | Pre-launch hardening and soft launch to mom | Mom sees and approves the site |
| 21-25 | Mom feedback fixes, testimonials, launch prep | Final polish based on real user feedback |
| 26-28 | Launch | Site live, GBP posting, Indeed listing, monitoring |
| 29-35 | Post-launch stabilization | Real usage bugs fixed, crew onboarding started |
| 36-45 | Growth activation | Google Ads, blog content, review automation, sales tools |
| 46-60 | Data-driven iteration | Optimize based on real traffic and lead data |

That's 60 days. Puts you at mid-June launch with two weeks of post-launch stabilization before the end of June. Realistic at 20+ hours per week with Codex and Claude handling implementation while you direct, test, and manage the content pipeline.

This is a strong baseline. Significantly better than most sites at this stage. Here's the actionable breakdown.

## What's already solid — no work needed

The audit confirmed 25 out of 39 checks as fully passing. The foundational work is genuinely good:

- Semantic HTML structure throughout (correct elements, heading hierarchy, landmarks, lists)
- Form accessibility across all forms (labels, htmlFor pairing, autocomplete, validation with aria-live)
- Native form elements instead of custom widgets (eliminates the most common accessibility failure point)
- Focus management infrastructure (useFocusTrap on all modals, skip link, StatusAnnouncer, focus-visible rings)
- Proper ARIA usage with no conflicts, broken references, or deprecated roles
- Reduced motion fully implemented in both CSS and JavaScript
- Touch targets at 44px minimum across mobile surfaces
- Decorative vs informative content properly distinguished (aria-hidden on decorative SVGs, descriptive alt on meaningful images)
- Content hiding using correct techniques (sr-only, aria-hidden, no misuse of display:none)

This is not typical. Most AI-assisted codebases have serious semantic HTML problems and zero ARIA implementation. Yours has both done correctly.

## Issues to fix — organized by effort

### Fix now (under 30 minutes each)

**Gold color contrast failure.**
This is the only real WCAG AA violation the audit found. Gold (#C9A94E) on white is 3.2:1 — needs 4.5:1 for normal text. Gold on navy is 3.8:1 — same problem.

Send this to Codex:

```
The gold color (#C9A94E) fails WCAG 2.1 AA contrast requirements when 
used as text on white backgrounds (3.2:1, needs 4.5:1) and on navy 
backgrounds (3.8:1, needs 4.5:1).

Find every instance where gold is used as a text color or as a 
background with text on top. This includes the cta-gold button class, 
any text-gold utility usage, and any inline color references to the 
gold token.

For each instance, determine whether the text is "large text" (18px+ 
or 14px+ bold) which only needs 3:1 ratio, or normal text which needs 
4.5:1.

For normal text instances, darken the gold to #A8880A or similar that 
achieves 4.5:1 on both white (#FAFAF8) and navy (#0A1628) backgrounds. 
You may need two gold variants: gold-on-light and gold-on-dark.

Do not change the gold color for decorative/non-text uses (backgrounds, 
borders, accents where text is a different color). Only fix instances 
where gold IS the text color or where text sits on a gold background.

Update the CSS tokens in globals.css and any Tailwind config references. 
Verify the fix by listing every affected element and its new contrast 
ratio.
```

**Add lang="es" wrapping on Spanish content.**

```
Search the entire codebase for Spanish language text content. This 
includes:
- Employee portal UI strings in Spanish
- Bilingual form labels (e.g., "Nombre completo / Full name")  
- AI assistant Spanish responses
- Checklist template items in Spanish

For every element or section containing Spanish text, wrap it with 
lang="es" attribute. For bilingual labels where English and Spanish 
appear in the same element, split them into separate spans:
<span lang="en">Full name</span> / <span lang="es">Nombre completo</span>

For the employee portal where the entire interface is Spanish, add 
lang="es" to the outermost container element of the employee layout 
or portal tabs component.

Do not change the root html lang="en" — that stays as the document 
default language.
```

**Add aria-live to testimonial carousel.**

```
In TestimonialSection.tsx, add aria-live="polite" to the container 
element that displays the current testimonial content (the element 
that changes when the carousel rotates). This ensures screen readers 
announce the new testimonial when it changes.

Also add aria-roledescription="carousel" to the outer section and 
aria-label="Client testimonials" if not already present.

Verify the auto-rotation pause behavior: confirm that rotation stops 
when any element inside the carousel receives keyboard focus (not just 
hover). If it only pauses on hover, add an onFocus handler to the 
carousel container that pauses rotation, and onBlur that resumes it.
```

**Add aria-current to active navigation items.**

```
In AdminSidebarNav.tsx, add aria-current="page" to the currently active 
module navigation button. Remove it from all inactive buttons.

In the public site header navigation (PublicHeader.tsx), if the current 
page matches a nav link, add aria-current="page" to that link.

In EmployeePortalTabs.tsx, the audit confirmed aria-selected is already 
implemented on tabs, which is correct for the tab pattern. No change 
needed there.
```

### Fix this week (1-2 hours each)

**Before/after slider keyboard support.**

The audit found this is drag/touch only with no keyboard arrow key support. This is a WCAG 2.1.1 failure — all functionality must be keyboard accessible.

```
In BeforeAfterSlider.tsx, add keyboard support for the slider:

1. Make the slider thumb/handle focusable (tabindex="0")
2. Add role="slider" to the handle element
3. Add aria-valuemin="0", aria-valuemax="100", aria-valuenow={position} 
   where position is the current percentage
4. Add aria-label="Compare before and after images"
5. Handle keydown events:
   - ArrowLeft: decrease position by 5%
   - ArrowRight: increase position by 5%
   - Home: set to 0% (full "before" view)
   - End: set to 100% (full "after" view)
6. Update the visual slider position on each key press
7. Ensure the focus indicator is visible on the handle when focused

Test: a keyboard user should be able to Tab to the slider, then use 
arrow keys to reveal more or less of the before/after images.
```

**Skip link target needs tabindex="-1".**

The audit noted the skip link points to a `<div id="main-content">` which is a non-focusable element. When a screen reader user activates the skip link, focus should move to that element. Without tabindex="-1", some browsers won't actually move focus.

```
In layout.tsx, add tabindex="-1" to the div with id="main-content". 
This allows it to receive programmatic focus when the skip link is 
activated. It will not appear in the normal tab order because -1 
means "focusable via script/link only, not via Tab key."
```

**Disabled button contrast and state.**

The audit flagged that disabled buttons use `opacity-60` which may reduce contrast below requirements.

```
Audit every button component and form element that can be in a 
disabled state. For each one:

1. Check that the disabled state uses the disabled HTML attribute 
   (not just visual styling)
2. Instead of opacity-60 for disabled buttons, use explicit colors 
   that maintain at least 3:1 contrast ratio against the background. 
   For example: gray text on white background instead of reducing 
   opacity of the normal button colors.
3. Ensure disabled buttons have cursor-not-allowed
4. Ensure disabled buttons are excluded from tab order or clearly 
   announced as disabled by screen readers (the disabled attribute 
   handles this natively)
```

### Verify manually — cannot be done by Codex

These items from the audit came back as "partially confirmed" or "requires runtime testing." You need to do these yourself in a browser:

**Keyboard tab-through test.** Open the homepage in Chrome. Put your mouse away. Press Tab repeatedly through the entire page. Every interactive element should receive visible focus (gold outline). Focus should move in logical top-to-bottom, left-to-right order. Nothing should be skipped. Nothing should trap you unexpectedly. Do the same on the admin dashboard and employee portal.

**200% zoom test.** In Chrome, press Ctrl/Cmd + to zoom to 200%. Navigate through the homepage, a service page, the admin dashboard, and the employee portal. Nothing should require horizontal scrolling. No text should overflow its container. No elements should overlap. No content should be cut off.

**Screen reader spot check.** If you have a Mac, turn on VoiceOver (Cmd + F5). Navigate through the homepage with VoiceOver active. Listen to what it announces for: the hero section, the authority bar, a service card, a testimonial, the quote form, and the floating panel button. The announcements should make sense without seeing the screen. You don't need to test every page — just verify the main patterns sound right.

**Admin status indicators.** Open the admin dashboard with seed data. Look at every status badge, pipeline column, and QA indicator. For each one, ask: if I couldn't see color, would I still know the status? There should be text labels or icons alongside the colors. If any status is communicated by color alone, it needs a non-color indicator added.

**Admin table structure.** The audit couldn't determine if admin data displays use proper table markup. Open the dispatch module and any module that displays tabular data. Inspect the HTML. If the data is displayed in a grid/table format using divs instead of `<table>` elements, it's technically not a violation if it uses ARIA grid roles — but it's easier and more robust to use native table elements with `<th scope="col">` headers for any actual tabular data.

### Items that need Codex review (the audit couldn't access them)

**AI Quote Assistant deep dive.** The audit marked this as "Unknown — component not reviewed in detail." Send this:

```
Review AIQuoteAssistant.tsx for accessibility compliance:

1. Does the chat message history container have role="log" or 
   aria-live="polite"?
2. When a new message appears (user or assistant), is it announced 
   to screen readers?
3. Does the text input have a visible label or aria-label?
4. Can the entire chat interaction be completed via keyboard only?
5. When the component is open as a dialog, does it implement 
   role="dialog", aria-modal, focus trapping, and Escape to close?
6. When the assistant is suppressed near CTAs (per the blueprint), 
   is aria-hidden="true" toggled along with the visual hiding?
7. Is there a button to open the assistant, and does it have a 
   descriptive aria-label?

List every accessibility issue found and fix each one.
```

**Admin module tabs.** The audit found the employee portal tabs have proper ARIA tab pattern but couldn't verify the admin module navigation follows the same pattern. The admin uses module-based navigation rather than traditional tabs, so it may not need the tab ARIA pattern — but it should be verified:

```
In AdminShell.tsx and AdminSidebarNav.tsx, verify the navigation 
pattern used for module switching:

If modules are switched via a sidebar navigation (like a vertical 
nav menu), the correct pattern is:
- nav element with aria-label="Admin modules"
- Each item is a button or link
- Active item has aria-current="page"
- This is NOT a tab pattern; do not add role="tablist"

If any admin sub-module uses a horizontal tabbed interface (e.g., 
Unified Insights with its multi-tab reporting, or Configuration 
with its sub-modules), those should implement the full ARIA tab 
pattern:
- role="tablist" on container
- role="tab" on each tab button
- role="tabpanel" on each content panel
- aria-selected on active tab
- aria-controls linking tab to panel
- Arrow key navigation between tabs

Review and fix accordingly.
```

## What this means for the ADA legal risk you're concerned about

Based on the audit results, the site's accessibility posture is strong. Here's the honest assessment:

**What would protect you in an ADA lawsuit right now:**
- Proper semantic HTML throughout
- Keyboard navigability with visible focus indicators
- Skip navigation link
- ARIA live regions for dynamic content
- Focus management on all modals and dialogs
- Alt text on all images
- Form labels properly associated
- Reduced motion support
- Touch targets meeting minimum size
- Native form elements (no custom widget accessibility failures)

**What a plaintiff's attorney scanning tool would flag:**
- The gold color contrast issue (this is the most common automated finding)
- Potentially the before/after slider keyboard gap
- Missing lang="es" on Spanish content sections

**What you should do:**
1. Fix the gold contrast, the slider keyboard support, and the lang attributes. Those are the scannable, automatable violations that lawsuit-filing bots look for.
2. Do NOT add an accessibility overlay widget. The article you shared is exactly right — overlays signal broken code and attract lawsuits.
3. After the fixes, run axe-core on every public page and fix any remaining findings. Axe-core is what plaintiff attorneys use to scan. If axe reports zero violations, you've removed the automated attack surface.

```
Add @axe-core/react as a dev dependency. Create a utility that runs 
axe-core checks in development mode only (not production). Log any 
violations to the browser console with severity, element, and fix 
suggestion.

Also add eslint-plugin-jsx-a11y to the ESLint configuration. Enable 
all recommended rules. Run the linter and list any violations found 
across the codebase.
```

After those tools are integrated, any future code changes get automatic accessibility checking — which is exactly what the article recommends for AI-assisted development.

## Where this fits in the timeline

The accessibility fixes slot into your existing plan without disrupting it:

- **Gold contrast fix:** Send to Codex today alongside the seed script. It's a CSS token change. 15 minutes of Codex time.
- **Lang attributes, aria-live on carousel, aria-current on nav:** Send as a batch to Codex on day 2-3 during your testing phase. These are small targeted changes.
- **Slider keyboard support:** Send to Codex during days 4-5 bug fix sprint.
- **Manual testing (keyboard, zoom, screen reader):** Do during your day 2-3 testing pass. Add it to your five critical flows — after you tab through the quote form, you've tested keyboard accessibility on the most important conversion path.
- **axe-core and eslint-plugin-jsx-a11y integration:** Day 4-5. Once integrated, it catches regressions automatically.
- **Disabled button contrast:** Fix during bug fix sprint if you encounter disabled states during testing.

Rating the website — honest assessment by category
I'm going to rate on a 1-10 scale where 5 is "adequate for a small business website built by a solo developer" and 10 is "best-in-class professional production." I'm calibrating against what your mom's business actually needs, not against some theoretical enterprise standard.

Architecture and code structure: 8/10
What's strong: The Next.js route group organization is clean and logical. Public, admin, and employee surfaces are properly separated. Middleware handles auth gating. Environment validation runs on startup. The component hierarchy follows clear patterns. File naming and organization is consistent. Dynamic imports for code splitting are in place.

What's missing: No automated test suite. No CI/CD pipeline beyond Vercel's default. These matter for long-term maintenance but not for launch.

For context: Most small business websites are a WordPress theme with plugins. This is a custom-built Next.js application with proper separation of concerns. The architecture is significantly over-engineered for a cleaning company website — which in your case is actually a good thing because the admin and employee dashboards justify the complexity.

Database design: 9/10
What's strong: 26 tables with proper normalization. Comprehensive enums that match the UI. Foreign key relationships mapping the full business lifecycle. Indexes on every high-traffic query path. RLS policies enforcing role-based access on every sensitive table. Migration chain tells a clear evolution story.

What's missing: No seed script (you're about to fix this). Some tables referenced in code weren't fully examined in the audit. The attempts vs attempt_count collision from the solutioning guide is still open.

For context: This is genuinely production-grade database work. Most startups with funded engineering teams don't have RLS policies this comprehensive. Your SQL learning background probably contributed to good instincts here even if Claude wrote the actual migrations.

Security: 8/10
What's strong: RLS on all sensitive tables. Role verification through middleware and database layers. Rate limiting on all public endpoints with tiered severity. Deduplication on quote requests. Signed enrichment tokens. Encrypted QuickBooks credentials. No default access for new users — verified clean. Environment variables validated on startup.

What's missing: The SB-6 role escalation issue is still open. The C-40 multi-crew RLS validation is still pending. No automated security scanning in CI. No penetration testing.

What this means: For a small business website handling lead data and employee information, this security posture is more than adequate. The remaining open items (SB-6, C-40) are edge cases that matter for hardening but aren't likely exploit vectors at your traffic level. You're not storing credit cards or health records. The risk profile is appropriate.

Public site UX and conversion design: 7/10
What's strong: Multiple conversion paths (quote form, floating panel, AI assistant, phone CTA, exit intent). Service-qualified lead capture through the service type map. Attribution tracking through session state. Behavioral analytics on section visibility and scroll depth. Mobile-responsive across all pages.

What holds it back: All content is generic and placeholder-level. The testimonials are fabricated. The authority bar numbers are unverified. Photos are stock or placeholder. The about page doesn't have the owner's real story. Service pages lack Austin specificity. This is the single biggest gap between what exists and what would actually convert a GC or property manager into a client.

For context: The conversion infrastructure is genuinely sophisticated — exit intent overlays with behavioral triggers, floating quote panels with abandon analytics, AI assistant with bilingual support. But conversion infrastructure without credible content is like having a Formula 1 engine in a car with no paint, no badges, and a fake driver photo on the door. The mechanics are there. The trust signals are not. This is fixable — it's content work, not code work.

Admin dashboard: 7/10
What's strong: All 10 modules make real database queries. The lead pipeline covers the full lifecycle from intake through quote delivery and job creation. Scheduling has conflict detection. Notification center has dispatch queue visibility and retry controls. Hiring inbox is end-to-end. Configuration persists to database. Error boundary prevents module-level crashes from taking down the whole surface.

What holds it back: Untested with real usage. Your mom hasn't seen it. Empty states may not all be graceful. The QuickBooks integration is configured but unverified in production. No one has tried to use it under real operational pressure. The notification dispatch and lead follow-up crons aren't configured yet (you're about to fix this).

The real question: Does it match how your mom actually works? That's unknowable until she uses it. The interactive tutorial and first-run wizard are good adoption aids. But there will inevitably be friction points where the system assumes one workflow and she expects another. Those only surface through real use.

Employee portal: 8/10
What's strong: Mobile-first design. Spanish as the primary language throughout. Assignment fetch with proper employee-scoped filtering. Checklist execution with completion tracking. Photo upload with compression and geolocation. Issue reporting. Message thread. Offline photo queue with IndexedDB storage. The portal covers the core execution loop a field worker needs.

What holds it back: Offline queue is untested with real network disconnection. No before-photo capture step. Messaging is poll-based not real-time. The offline queue retry mechanism is documented but unverified.

For context: For a cleaning crew portal, this is well above industry standard. Most cleaning companies use WhatsApp groups. The fact that this exists at all with Spanish-first UI and offline capability is a meaningful competitive advantage — if the crew adopts it.

Accessibility: 8/10
What's strong: The audit confirmed proper semantic HTML, heading hierarchy, landmark elements, form labels, ARIA usage, focus management, reduced motion support, touch targets, and content hiding techniques. The infrastructure primitives (skip link, StatusAnnouncer, useFocusTrap, focus-visible rings) are shared and consistent. Native form elements instead of custom widgets eliminates the most common accessibility failure category.

What needs fixing: Gold color contrast failure on normal text (the one real WCAG AA violation). Before/after slider lacks keyboard support. Spanish content sections need lang="es" wrapping. Testimonial carousel needs aria-live. These are all fixable in a few hours.

For context: This is better than 90% of commercial websites. The fact that the accessibility infrastructure was built into the foundations rather than bolted on after the fact means fixes are small and isolated rather than requiring architectural changes. From an ADA legal risk perspective, fixing the gold contrast and the slider keyboard support removes the primary automated scan targets.

SEO readiness: 6/10
What's strong: Comprehensive structured data across all page types (LocalBusiness, Organization, Service, FAQ, BreadcrumbList). Proper meta titles and descriptions on every page — none missing or duplicated. Sitemap generation. Robots.txt. Clean URL structure. Service-area pages with per-city unique content. Industry pages with persona-specific content.

What holds it back: Service page body content is generic with no Austin-specific language in the main copy. City page proof metrics may be fabricated. No blog content for long-tail keyword capture. No Google Business Profile. No Google Search Console verification. No backlinks. The site hasn't been indexed yet.

For context: The technical SEO foundation is solid — schema markup, meta tags, sitemap, clean URLs. What's missing is content depth and off-site signals. Technical SEO without content is like having a perfectly tuned radio with nothing broadcasting. The content rewrite sprint in the timeline addresses this directly.

Notification and communication system: 8/10
What's strong: Tiered lead alert escalation (1h, 4h, 24h). SMS dispatch with quiet hours, exponential backoff retry, deduplication, and permanent vs transient error classification. Email delivery through Resend with retry logic. Configurable notification preferences per profile. Notification dispatch queue for delayed delivery.

What holds it back: The cron jobs that trigger the lead follow-up and queue dispatch aren't configured in Vercel yet (you're about to fix this). No fallback if Twilio or Resend are down — messages are dropped. No real-time messaging (poll/refresh only).

For context: This is surprisingly sophisticated for a small business platform. The quiet-hours queueing alone puts it ahead of most SaaS notification systems. Once the crons are configured, this should work reliably.

Integration quality: 6/10
What's strong: QuickBooks OAuth flow is built with token encryption and multiple sync directions (customers, vendors, invoices, financial snapshots). Twilio integration with error classification. Resend with resilient retry. Anthropic API with fallback to rule-based responses. Supabase client properly configured. Upstash rate limiting with graceful degradation.

What holds it back: QuickBooks has never completed an OAuth flow in production. Sentry may or may not be capturing errors. Upstash may or may not be connected. The integrations exist in code but haven't been verified as actually working with real credentials on the live deployment. This is entirely an environment configuration and testing gap, not a code quality gap.

Overall: 7.5/10
What that means: This is a well-architected, feature-rich platform with a solid technical foundation, strong security posture, and good accessibility baseline. It is held back by unverified integrations, untested real-world usage, and placeholder content. The gap to launch is not code quality — it's configuration, testing, content, and adoption.

What's genuinely impressive: You built this in a month with AI assistance while learning. The architecture decisions are sound. The security model is correct. The accessibility work is above average. The notification system is sophisticated. The database design is production-grade. Most professional agencies would charge $50K-$100K+ for a platform with this feature scope, and many would deliver worse architecture.

What's the honest risk: The biggest risk isn't bugs in the code. It's that this launches with placeholder content and your mom doesn't adopt the admin dashboard because it doesn't match her mental model of how she works. The second biggest risk is that integrations that look correct in code don't work in production because of environment misconfiguration. Both of these risks are addressed by the testing and content timeline already laid out.

The code is good enough to launch. The content is not. Fix the content, test the flows, configure the environment, and get it live.


## Section 65: Review Generation Engine

### 65.1 Google review cards — physical NFC and QR cards

Google review cards are physical cards (business card size or slightly larger) with either a QR code or an embedded NFC chip that takes the person directly to your Google review page with one tap or scan. No searching, no typing, no friction.

**What to buy:**

| Type | How it works | Cost | Where to buy |
|---|---|---|---|
| NFC tap cards | Client taps their phone on the card, review page opens instantly | $2-5 per card | Amazon, TapReview, Podium, ReviewBoost |
| QR code cards | Client scans QR code with phone camera | $0.50-1 per card (just printing) | Vistaprint, Canva Print, MOO |
| NFC + QR combo | Card has both NFC chip and printed QR code as fallback | $3-6 per card | TapReview, Google NFC cards on Amazon |
| Google review stand | Acrylic stand with NFC chip for an office or meeting location | $15-30 each | Amazon "Google review stand" |

**Recommendation:** Start with 20 NFC+QR combo cards at roughly $80-100 total. Mom carries 3-5 in her bag at all times. Each crew lead carries 2-3. After a completed job walkthrough, when the client says they're happy, hand them the card: "If you have 30 seconds, a Google review would mean the world to us. Just tap your phone here."

**The card should say:**

Front:
- A&A Cleaning Services logo
- "How did we do?"
- "Tap or scan to leave a quick review"
- NFC symbol + QR code
- Clean, branded design matching the website

Back:
- "Your feedback helps us grow and helps other businesses find reliable cleaning partners."
- Company phone and website URL
- "Thank you for your trust."

**When to hand them out:**

| Moment | Why it works | Expected conversion |
|---|---|---|
| End of job walkthrough when client expresses satisfaction | Emotional high point, satisfaction is fresh | 40-60% |
| After resolving a complaint successfully | Recovered clients often leave the most loyal reviews | 20-30% |
| At a recurring service check-in (quarterly) | Long-term clients forget to review unless asked | 15-25% |
| When delivering a completion report | Professional touchpoint, review is natural next step | 10-20% |

### 65.2 Digital review collection methods

Beyond physical cards, build multiple touchpoints into the business workflow:

**SMS review request (automated through the platform):**

This is already planned in the post-job sequence. The specific flow:

```
Job completed + QA approved
  → 24 hours: SMS satisfaction check
    "Hi [name], this is A&A Cleaning. How was your experience 
     with our team? Reply 1-5 (5 = excellent)"
  → If reply ≥ 4:
    72 hours: SMS with direct review link
    "Thank you! Your feedback means everything to us. Would you 
     share your experience on Google? Takes 30 seconds: [link]"
  → If reply ≤ 3:
    Immediate alert to mom for personal follow-up call
  → If no reply:
    7 days: Email follow-up with review link (softer ask)
```

**Email review request (in completion report):**

The completion report that gets emailed to clients after QA approval should include a review CTA at the bottom:

```
"Satisfied with our work? A quick Google review helps other 
businesses find reliable cleaning partners in Austin."
[Leave a Review] ← button linking to direct review URL
```

**QR code on completion report PDF:**

If completion reports are generated as PDFs or printable documents, include a small QR code in the footer that links to the Google review page. For clients who receive paper reports during walkthroughs, they can scan it on the spot.

**Invoice footer review request:**

Every invoice sent through QuickBooks or the platform should include a one-line review prompt:

```
"Happy with our service? Leave us a Google review: [short link]"
```

This catches clients at the payment moment, which is when they're reflecting on value received.

**WhatsApp review request:**

Since mom communicates with many clients via WhatsApp already, create a saved message template she can send after a completed job:

```
Hi [name]! Thank you for trusting A&A Cleaning with your 
[project type]. We're so glad everything turned out well. 

If you have a minute, a Google review would really help us 
grow: [direct review link]

Thank you for your support! 🙏
```

### 65.3 Testimonial collection methods beyond reviews

Google reviews are public and help with SEO and local rankings. Testimonials are curated quotes you control and display on your website. You need both.

**Video testimonials (highest value, hardest to get):**

| Method | How | When |
|---|---|---|
| Phone recording at walkthrough | Mom records a 30-second clip of client saying "they did a great job" | Immediately after a positive walkthrough |
| Zoom/FaceTime recording | Schedule a 5-minute call, record with permission | 1-2 weeks after project completion |
| Professional shoot | Hire a videographer for 2 hours, visit 3-4 clients | When budget allows (month 6+) |

Even one genuine 30-second video testimonial on the website is worth more than ten written quotes. Property managers and GCs are trained to be skeptical of written testimonials. Video is much harder to fake.

**Written testimonials with specificity:**

When mom asks clients for testimonials, give them a prompt that produces usable, specific content instead of generic "great job" responses:

```
"Would you mind answering one or two of these in a quick text 
or email? Whatever comes naturally:

- What type of project did we clean for you?
- What was the result — did it pass inspection, was the client 
  happy, were units ready on time?
- Would you hire us again?

Even 2-3 sentences would be amazing. Thank you!"
```

Specific testimonials like "A&A turned over 24 apartment units in 3 days and every single one passed the property manager's walkthrough inspection" convert far better than "Great cleaning company, highly recommend."

**LinkedIn recommendations:**

These serve a different purpose — they're visible on mom's LinkedIn profile when GCs and PMs look her up (which they will). More on this in the LinkedIn strategy section below.

**Case study development from testimonials:**

When a client gives a particularly strong testimonial, follow up and ask for permission to write a case study. The structure:

- Client name and company (with permission)
- The challenge (what they needed cleaned, the timeline, any constraints)
- What A&A did (scope, crew size, duration, approach)
- The result (passed inspection, on time, client feedback)
- Before/after photos

This becomes a page on the website, a PDF for proposals, and social media content.

### 65.4 Review management and response protocol

**Monitoring:**

Set up Google alerts for the business name. Check GBP weekly (until you have 25+ reviews, then bi-weekly). Respond to every single review within 24 hours.

**Response templates:**

| Review type | Response framework | Example |
|---|---|---|
| 5-star | Thank by name, reference specific service, invite them back | "Thank you [name]! We loved working on the [apartment turnover/post-construction] project. Your team made the coordination seamless. We look forward to the next one." |
| 4-star | Thank, acknowledge the gap, state what you've improved | "Thank you for the feedback, [name]. We're glad the cleaning met your standards. We've noted your comment about [specific thing] and have adjusted our process. We'd love to show you the improvement next time." |
| 3-star | Thank, apologize, take offline | "Thank you for sharing your experience, [name]. We're sorry we didn't fully meet your expectations. I'd love to discuss this personally — please call me at [mom's number]. We stand behind our work and want to make this right." |
| 1-2 star | Apologize, take accountability, offer direct contact, do not argue | "We're sorry to hear about your experience, [name]. This doesn't reflect our standards. I'm [mom's name], the owner, and I'd like to personally address this. Please call me at [number] at your convenience." |
| Fake/spam | Flag for removal through Google's dispute process, do not engage publicly | File removal request through GBP dashboard |

**Never:**
- Argue publicly with a reviewer
- Offer compensation in the public response (do that privately)
- Copy-paste the same response on every review (Google and readers notice)
- Ignore negative reviews (silence reads as guilt)

---

## Section 66: Physical Marketing Materials Expansion

### 66.1 Business card system

Mom needs two versions:

**Owner card (for mom):**

Front:
- Logo
- Maria [Last Name], Owner and Operator
- Phone (same as website)
- Email (domain-based once set up)
- Website URL
- "Licensed & Insured | Bilingual"

Back:
- Top 3 services: Post-Construction Cleanup, Apartment Turnovers, Commercial Cleaning
- "Operations-Grade Quality with Real-Time Documentation"
- QR code linking to website with UTM: `?utm_source=business_card&utm_medium=offline&utm_campaign=owner`

**Crew lead card (simpler):**

Front:
- Logo
- A&A Cleaning Services
- [Crew lead name], Crew Lead
- Company phone (not personal)
- Website URL

Back:
- Google review NFC/QR code
- "Scan to share your experience"

**Print specs:** 16pt matte stock with soft-touch finish. Not glossy — matte feels premium. MOO or Vistaprint premium tier. 250 cards for mom, 100 per crew lead. Total cost: $100-$200.

### 66.2 Job completion leave-behind card

After every completed job, crew leaves a small card on the counter or desk:

Front:
- "Your space was professionally cleaned by A&A Cleaning Services"
- Date of service
- Crew lead name
- "Questions? Call [phone] or visit [website]"

Back:
- Google review QR code: "How did we do? Scan to let us know"
- "Satisfaction guaranteed — if anything needs attention, call us within 24 hours"

**Why this matters:** For apartment turnovers, the property manager isn't always on-site when cleaning is done. This card is how they know A&A was there, who did the work, and how to leave feedback. It's a professional touch that most cleaning companies don't do.

**Cost:** $0.15-$0.30 each printed on cardstock. Order 500+. Crew carries a stack in their supply kit.

### 66.3 Vehicle branding expansion

**Phase 1 — Magnets ($100-$300):**
- Company name and logo
- Phone number (large, readable from 20 feet)
- Website URL
- "Commercial & Construction Cleaning"
- "Licensed & Insured"
- QR code to quote page

Removable magnets work for personal vehicles used for business. One set per vehicle that regularly goes to job sites.

**Phase 2 — Partial wrap ($800-$1,500):**
- Rear window and side panels
- Before/after photo on one panel
- Full contact information
- "Now Hiring — [website]/careers" on rear window
- QR code for quotes AND careers

The careers callout on the vehicle is smart because vehicles are parked at job sites in areas where potential employees live and work. Double-duty marketing.

**Phase 3 — Full wrap ($2,500-$4,000):**
- Only when budget and fleet justify it
- Professional design matching brand system
- Full portfolio showcase on panels
- Most effective on box trucks or vans that are highly visible

### 66.4 Job site signage (when permitted by client)

Some clients allow temporary signage at job sites during active work:

- Corrugated plastic yard sign: "Professional Cleaning by A&A Cleaning Services"
- Contact info and QR code
- "Licensed & Insured"
- Cost: $10-$20 each for 18x24" coroplast signs

Particularly valuable at apartment complexes during multi-day turnovers and at construction sites during final clean phases. Every person walking by sees the brand.

### 66.5 Branded supply and equipment labels

Small vinyl stickers on equipment, supply carts, and cases:

- Company logo
- Phone number
- "Property of A&A Cleaning Services"

Cost: $30-$50 for 100 stickers. Serves dual purpose: branding visibility on job sites and theft/loss deterrent for equipment.

### 66.6 Uniform program

Already touched on in the expansion docs. Practical expansion:

| Item | Description | Cost per unit | Quantity needed |
|---|---|---|---|
| Polo shirts (navy with embroidered logo) | Primary uniform for client-facing work | $18-$25 | 3 per employee |
| T-shirts (navy with printed logo) | For heavy labor days | $12-$15 | 3 per employee |
| Hi-vis safety vest with logo | For construction sites | $12-$18 | 1 per employee |
| ID badge with lanyard | Name, photo, company logo, "Licensed & Insured" | $5-$8 | 1 per employee |
| Hat (embroidered logo) | Optional, additional brand touchpoint | $10-$15 | 1 per employee |

For a 10-person crew: $600-$1,000 initial investment. Budget $200-$300 per new hire for uniform kit.

**The ID badge matters more than the shirt.** When a crew member walks into an office building, apartment complex, or construction site wearing a badge with their photo and the company logo, the on-site manager immediately knows they belong there. It's a security signal and a professionalism signal simultaneously.

---

## Section 67: Email Marketing Strategy

### 67.1 Email infrastructure

**Platform:** Resend is already in the tech stack for transactional email. For marketing email, you have two options:

| Option | Cost | Capability | Integration effort |
|---|---|---|---|
| Resend (expand existing) | Free up to 3,000/month, $20/month for 50,000 | Transactional + marketing from one platform. API-first. | Low — already integrated |
| ConvertKit (now Kit) | Free up to 10,000 subscribers | Purpose-built for sequences, segmentation, landing pages. Visual sequence builder. | Medium — new integration |
| Mailchimp | Free up to 500 contacts | Most features, but complex. | Medium — new integration |

**Recommendation:** Start with Resend since it's already in the stack. Build email templates as React components rendered server-side. When the contact list exceeds 500 or you need visual sequence builders, evaluate ConvertKit.

**Domain email authentication (critical before any marketing email):**

| Record | Purpose | Without it |
|---|---|---|
| SPF | Tells receiving servers that Resend is authorized to send on behalf of your domain | Emails land in spam |
| DKIM | Cryptographic signature proving the email wasn't tampered with | Emails land in spam |
| DMARC | Policy telling receivers what to do with unauthenticated email | Lower deliverability |

Set these up when you configure the domain. Resend provides the specific DNS records to add. This takes 15 minutes and is the difference between emails reaching inboxes and emails going to spam.

### 67.2 Email list building

**Where email addresses come from:**

| Source | How | Consent mechanism |
|---|---|---|
| Quote request form | Already collected | Add checkbox: "Send me cleaning tips and project updates" (default unchecked) |
| Contact form | Already collected | Same checkbox |
| Completion reports | Client email already in system | Implicit business relationship (can email about services; must include unsubscribe) |
| Google Business Profile messages | Collect email during conversation | Ask permission explicitly |
| Networking events and job sites | Business card exchange | Add manually with note about source |
| Blog content (future) | Email gate on downloadable resources | "Enter email to download our Post-Construction Cleaning Checklist" |
| Careers page applicants | Already collected | Can email about job openings; must include unsubscribe on marketing |

**Important legal requirements:**

- CAN-SPAM: Every marketing email must include physical business address, clear unsubscribe mechanism, and honest subject lines. Unsubscribe must be processed within 10 business days.
- TCPA: SMS marketing requires explicit written consent. The quote form SMS consent checkbox covers this.
- No purchased lists. Ever. Every email address must come from a real interaction.

### 67.3 Email sequences — detailed

**Sequence 1: New lead instant acknowledgment**

Trigger: Quote request submitted
Timing: Immediate (within seconds)
Purpose: Confirm receipt, set expectations, begin trust building

```
Subject: We received your request — here's what happens next

Hi [name],

Thank you for reaching out to A&A Cleaning Services. We've received 
your request for [service type] and we're reviewing the details now.

Here's what to expect:
• We'll reach out within [X hours] to discuss your project
• We'll ask a few questions to understand your scope
• You'll receive a detailed quote within [timeframe]

In the meantime, here's a bit about how we work:
[Brief paragraph about quality process — checklists, photo 
documentation, QA review]

If you need immediate assistance, call [mom's name] directly 
at [phone].

[Mom's name]
Owner, A&A Cleaning Services
[phone] | [website]
```

**Sequence 2: Lead follow-up (no response to initial contact)**

Trigger: Quote sent but no response after 48 hours
Messages: 3 over 10 days

Email 1 (48 hours after quote sent):
```
Subject: Your A&A Cleaning quote — any questions?

Hi [name],

Just following up on the quote we sent for [service type] at 
[address]. I want to make sure it covers everything you need.

If you have any questions about scope, timing, or pricing, 
I'm happy to walk through it. We can also adjust the quote if 
your needs have changed.

[Quote summary: service type, total, valid until date]

Reply to this email or call me at [phone].

[signature]
```

Email 2 (5 days after quote sent):
```
Subject: Still thinking about your cleaning project?

Hi [name],

I know choosing a cleaning partner is an important decision, 
especially for [commercial/construction/property management] work. 

Here's what our clients tell us makes the difference:
• [Specific differentiator — documented quality process]
• [Specific differentiator — bilingual crew, schedule reliability]
• [Testimonial quote from a similar client type]

Your quote is valid until [date]. Happy to adjust anything 
that would make this work for you.

[signature]
```

Email 3 (10 days after quote sent):
```
Subject: Closing out your request

Hi [name],

I'm following up one last time on your [service type] quote. 
If now isn't the right time, no worries at all — I'll keep 
your information on file so we can move quickly when you're ready.

If you've already found another provider, I'd appreciate any 
feedback on what influenced your decision. It helps us improve.

Whenever you need us: [phone] | [website]

[signature]
```

**Sequence 3: Post-first-job client nurture**

Trigger: First job completed for a new direct client
Purpose: Turn one-time client into recurring client

Email 1 (24 hours post-completion):
```
Subject: Your completion report from A&A Cleaning

Hi [name],

Thank you for trusting A&A Cleaning with your [project type]. 
Attached is your completion report with photos of the finished work.

If anything needs attention, please call me directly at [phone] 
within 24 hours and we'll take care of it at no charge.

It was a pleasure working with your team.

[signature]
```

Email 2 (7 days post-completion):
```
Subject: A quick question, [name]

Hi [name],

Now that you've had a week with the [cleaned space/turned units], 
I wanted to check — is everything still looking good? Any areas 
we should revisit on the next project?

By the way, we also handle [related service they didn't use]. 
If that's ever useful for your properties, just let me know and 
I'll put together a quote.

[signature]
```

Email 3 (30 days post-completion):
```
Subject: Recurring service options for [company name]

Hi [name],

Many of our property management clients find that a recurring 
cleaning schedule keeps their properties in top condition and 
simplifies their vendor management.

We offer weekly, bi-weekly, and monthly service plans with 
dedicated crews who learn your properties and standards.

Would it be worth a quick call to discuss what that might 
look like for your portfolio?

[signature]
```

**Sequence 4: Monthly client newsletter**

Trigger: First of each month
Audience: All active and past clients
Purpose: Stay top of mind, soft sell, demonstrate expertise

```
Subject line rotation:
- "What's happening at A&A Cleaning — [Month] update"
- "[Month] cleaning tip + a project we're proud of"
- "Quick update from A&A Cleaning"

Content blocks (rotate 3-4 per month):
1. Featured project (before/after + brief story)
2. Seasonal cleaning tip relevant to their industry
3. Team spotlight (humanize the brand)
4. Service highlight (educate on a service they may not know about)
5. Referral prompt ("Know someone who needs reliable cleaning?")
6. Hiring note ("We're growing — know any hard workers?")
7. Industry news relevant to PMs or GCs in Austin
```

Keep newsletters short. 300-500 words maximum. One clear CTA per email. Mobile-optimized.

### 67.4 Email metrics to track

| Metric | Target | What it tells you |
|---|---|---|
| Open rate | 25-35% | Subject line effectiveness and sender reputation |
| Click rate | 3-5% | Content relevance and CTA effectiveness |
| Reply rate | 1-3% for nurture sequences | Engagement depth |
| Unsubscribe rate | Under 0.5% per send | Content quality and frequency appropriateness |
| Bounce rate | Under 2% | List hygiene |
| Quote requests from email | Track via UTM | Direct revenue attribution |

---

## Section 68: LinkedIn Strategy

### 68.1 Why LinkedIn matters for this business

LinkedIn is where GCs, property managers, facility managers, commercial real estate professionals, and construction project managers spend professional time. These are exactly the decision-makers your mom needs to reach. LinkedIn is not where she finds cleaning crews — it's where she finds clients and partners.

### 68.2 Mom's personal LinkedIn profile setup

Her personal profile is the primary channel. Company pages get very little organic reach on LinkedIn. People connect with people.

**Profile photo:** Professional headshot. Same one from the website about page. Clean background, company shirt or professional attire.

**Banner image:** Custom branded banner (Canva template, 1584x396px):
- A&A Cleaning Services logo
- "Commercial & Construction Cleaning | Austin, TX"
- Subtle before/after or crew-at-work background image

**Headline (120 characters, most important text on the profile):**
```
Owner, A&A Cleaning Services | Commercial & Post-Construction 
Cleaning in Austin | Serving GCs & Property Managers for 15+ Years
```

Not just "Owner at A&A Cleaning." The headline should communicate who she serves and her experience level.

**About section (2,600 character limit):**

```
I've spent over 15 years in the commercial cleaning industry in 
Austin, building A&A Cleaning Services from the ground up. We 
specialize in the jobs that demand precision and reliability — 
post-construction cleanup for general contractors, apartment 
turnovers for property management companies, and commercial 
facility cleaning for businesses that take their spaces seriously.

What makes us different:

→ Operations-grade quality process: Every job is documented with 
  before/after photos, executed against a detailed checklist, and 
  reviewed through our quality assurance process before we call it 
  done.

→ Built for scale: We handle portfolio-level turnover cleaning 
  for property managers managing hundreds of units, and multi-phase 
  construction cleanup on projects up to [X] square feet.

→ Bilingual team: Our crew communicates fluently in English and 
  Spanish, which matters on construction sites and in diverse 
  property environments across Austin.

→ Reliable and insured: Licensed, bonded, and insured with 
  [coverage amounts]. We show up on time, every time.

I built this company because I saw too many cleaning contractors 
treat the work as disposable. For us, every surface matters. 
That's why GCs request us by name and property managers keep us 
on their preferred vendor lists.

If you're looking for a cleaning partner in Austin who treats your 
project like their reputation depends on it — because it does — 
let's talk.

📞 [phone]
🌐 [website]
📧 [email]
```

**Experience section:**
- Owner & Operator, A&A Cleaning Services | [Start year] - Present
- Description: 2-3 sentences about the company, services, and market focus
- Add media: link to the website, upload before/after photos, attach the capabilities one-pager when it's built

**Skills to add:** Commercial Cleaning, Post-Construction Cleaning, Janitorial Services, Property Management, Facilities Management, Project Management, Team Leadership, Quality Assurance, Vendor Management, Construction Cleanup

**Featured section:** Pin 2-3 items:
- Link to the website
- Best before/after photo carousel
- A case study or testimonial (when available)

### 68.3 Who to connect with on LinkedIn

**Direct connection targets in Austin (aim for 200-500 connections over 6 months):**

| Target role | Why | How to find them | Connection message |
|---|---|---|---|
| Property managers | Direct clients for turnover and commercial cleaning | Search "property manager Austin" | "Hi [name], I run A&A Cleaning Services here in Austin. We specialize in apartment turnover and commercial cleaning for property management companies. Would love to connect and learn about your portfolio." |
| General contractors | Direct clients for post-construction cleanup | Search "general contractor Austin", check ABC Texas member list | "Hi [name], A&A Cleaning has been doing post-construction cleanup in Austin for 15+ years. I'd love to connect — always good to know the GCs working in our market." |
| Facility managers | Commercial cleaning prospects | Search "facility manager Austin" or "facilities director Austin" | "Hi [name], I saw you manage facilities at [company]. We provide commercial cleaning services in Austin and I'd love to connect." |
| Commercial real estate brokers | Referral partners who need spaces cleaned for showings | Search "commercial real estate Austin" | Short introduction, mention cleaning for commercial spaces |
| Construction project managers | Day-to-day contacts who schedule cleanup on projects | Search "project manager construction Austin" | "We handle post-construction cleanup and work closely with project teams. Would love to connect." |
| Apartment association leaders | Industry networking | Search "Austin Apartment Association" | Professional introduction |
| Other cleaning company owners (non-competing markets) | Referral network, industry knowledge | Search by industry | "Always great to connect with others in the industry." |
| Restoration company owners | Referral partners | Search "restoration Austin" | Mention complementary services |

**Connection request rules:**
- Always personalize the message. Never send a blank connection request.
- Never pitch in the connection request. Just introduce and express interest in connecting.
- After they accept, wait 2-3 days before any follow-up. Don't immediately sell.
- The goal is relationship building, not cold selling. LinkedIn connections convert over months, not days.

### 68.4 LinkedIn content strategy

Mom doesn't need to write long thought leadership posts. Short, authentic content works best for a service business.

**Posting frequency:** 2-3 times per week. Can be batched and scheduled using LinkedIn's native scheduling or a free tool like Buffer.

**Content rotation:**

| Week | Post 1 | Post 2 | Post 3 (optional) |
|---|---|---|---|
| 1 | Before/after photo with brief project story | Industry tip or insight | Team photo or behind-the-scenes |
| 2 | Client testimonial quote (with permission) | Comment on a local construction or property news article | Service highlight |
| 3 | Hiring post if actively recruiting | Project milestone or company update | Engage with a GC or PM's post |
| 4 | Before/after photo from a different service type | Seasonal tip relevant to PMs or GCs | Thank a client or partner publicly |

**Post templates:**

Before/after project post:
```
Just wrapped a 24-unit apartment turnover in [neighborhood] 
for [client company, if permitted].

The property manager needed all units ready for new tenants 
in 72 hours. Our crew of [X] handled it in [X] days — every 
unit passed the walkthrough on the first check.

This is what operations-grade cleaning looks like.

#AustinCleaning #ApartmentTurnover #PropertyManagement 
#CommercialCleaning #PostConstructionCleaning

[Attach 2-4 photos]
```

Hiring post:
```
We're growing! A&A Cleaning Services is looking for experienced 
commercial cleaning technicians in Austin.

What we offer:
✅ $[X]-$[X]/hour depending on experience
✅ Consistent schedule (Mon-Sat)
✅ Professional equipment and training
✅ Growth path to crew lead and beyond

We need people who take pride in their work and want to be part 
of a team that GCs and property managers request by name.

Bilingual (English/Spanish) is a plus.

Apply: [website/careers link]

Know someone? Tag them below. 👇

#AustinJobs #NowHiring #CleaningJobs #AustinTX
```

**Engagement strategy (just as important as posting):**
- Comment on posts from GCs, PMs, and construction companies in Austin
- Share relevant Austin construction news with a brief opinion
- Congratulate connections on project completions, awards, or milestones
- This takes 10 minutes per day and builds visibility more than posting alone

### 68.5 LinkedIn company page

Create it but don't invest heavily in it. Organic reach on company pages is very low.

- Company name: A&A Cleaning Services
- Logo and banner matching personal profile
- About section: condensed version of the personal profile about section
- Services listed
- Website link with UTM
- Post automatically when you post from the personal profile (share to company page)

The company page exists so that when people click on "A&A Cleaning Services" from mom's profile, they land somewhere professional. It's a credibility placeholder, not a growth channel.

---

## Section 69: Meta (Facebook/Instagram) Strategy

### 69.1 Meta Pixel setup

The Meta Pixel tracks website visitors and enables retargeting ads. It tells Facebook "this person visited my quote page but didn't submit" so you can show them ads later.

**Implementation:**

```
Install the Meta Pixel on the website. The pixel base code should 
load on every page via PublicChrome or the root layout. 

Standard events to track:
- PageView: fires on every page load (automatic with base pixel)
- Lead: fires when quote request form is submitted successfully
- Contact: fires when contact form is submitted
- ViewContent: fires on service page views with content_name parameter
- Schedule: fires when a quote is accepted by a client

Custom events:
- QuoteFormStart: fires when user interacts with first field 
  in any quote form
- PhoneClick: fires when user clicks a tel: link
- AIChatStart: fires when AI assistant conversation begins

Implementation: Add the Meta Pixel base code and event triggers 
alongside the existing first-party analytics calls in the 
analytics.ts helper. Each trackConversionEvent call should also 
fire the corresponding Meta Pixel event.
```

**Cost:** The pixel itself is free. It just collects data. You only pay when you run ads.

**When to install:** Before launch. Let the pixel collect visitor data for 2-4 weeks before running ads. This gives Facebook's algorithm data to optimize against.

### 69.2 Facebook and Instagram organic strategy

**Facebook Business Page setup:**

- Page name: A&A Cleaning Services
- Category: Commercial Cleaning Service
- About: match website and GBP description
- Cover photo: best before/after or crew photo
- Contact info: phone, email, website (all matching)
- Services: listed with descriptions
- Call-to-action button: "Get Quote" → links to website quote page

**Instagram Business Account setup:**

- Handle: @aacleaningaustin or @aacleaningservices
- Bio: "Commercial & Post-Construction Cleaning | Austin TX | Licensed & Insured | Bilingual Crew | 15+ Years Experience"
- Link in bio: website URL with UTM
- Profile photo: logo

**Content strategy (same content across Facebook, Instagram, and LinkedIn with minor format adjustments):**

| Content type | Frequency | Platform format |
|---|---|---|
| Before/after photos | 2x per week | Instagram carousel (swipe to see after), Facebook album |
| Quick video of crew at work | 1x per week | Instagram Reel (15-30 sec), Facebook short video |
| Completed project showcase | 1x per week | All platforms, photo + caption |
| Hiring posts | 2x per month | All platforms, link to careers page |
| Client testimonial quote card | 2x per month | Designed graphic (Canva), all platforms |
| Behind the scenes | 1x per week | Instagram Story, Facebook Story |
| Seasonal tips | 1x per month | All platforms, educational content |

**Hashtag strategy for Instagram:**

```
Core (use on every post):
#AustinCleaning #CommercialCleaning #AustinTX #ATX 
#PostConstructionCleaning #ApartmentTurnover

Rotating (mix 5-10 per post):
#CleaningCompany #JanitorialServices #PropertyManagement 
#GeneralContractor #ConstructionCleanup #OfficeCleaning 
#DeepCleaning #FinalClean #AustinBusiness #AustinContractor
#CommercialCleaningServices #BuildingMaintenance #FacilityManagement
#ApartmentCleaning #MoveOutCleaning #AustinRealEstate
#WomenInBusiness #LatinaOwned #SmallBusinessAustin #SupportLocal
```

### 69.3 Meta paid advertising strategy

**Phase 1: Retargeting (start at launch, $200-$400/month)**

This is the highest ROI Meta advertising for a local service business. You're showing ads to people who already visited your website.

| Audience | Ad content | Objective |
|---|---|---|
| Visited website, didn't submit quote (last 30 days) | Before/after carousel + "Get Your Free Quote" CTA | Drive quote submissions |
| Visited specific service page (last 30 days) | Ad specific to that service + testimonial | Drive quote submissions |
| Visited careers page, didn't apply (last 30 days) | "We're hiring" + benefits + apply CTA | Drive applications |
| Submitted quote but didn't accept (last 60 days) | "Still thinking about it?" + value prop | Recover lost quotes |

**Phase 2: Lookalike audiences (month 3+, $300-$500/month)**

Once the pixel has enough conversion data (50+ quote submissions), Facebook can build a "lookalike audience" — people who resemble your converters but haven't visited your site yet.

| Audience | Ad content | Objective |
|---|---|---|
| Lookalike of quote submitters, Austin area, property management job titles | Portfolio showcase + "Trusted by Austin PMs" | Brand awareness → website traffic |
| Lookalike of quote submitters, Austin area, construction job titles | Post-construction showcase + "Your cleanup partner" | Brand awareness → website traffic |

**Phase 3: Direct targeting (month 4+, if budget allows)**

| Audience | Targeting | Ad content |
|---|---|---|
| Austin area, 25-65, job titles including "property manager," "facilities," "building manager" | Interest + job title targeting | Service-specific ads with CTA to quote page |
| Austin area, job titles including "general contractor," "project manager," "superintendent" | Interest + job title targeting | Post-construction focused ads |

**Ad creative guidelines:**
- Real photos only. Never stock.
- Before/after carousels perform best for cleaning companies
- Video clips of crew at work (15-30 seconds) get highest engagement
- Include social proof: "Trusted by [X] Austin businesses" or testimonial quote
- Clear CTA: "Get a Free Quote" or "Call Today"
- Mobile-first design (80%+ of Facebook/Instagram users are on mobile)

---

## Section 70: Google Business Profile Ongoing Strategy

### 70.1 Auto-posting completed jobs

The platform can automate GBP content creation as a byproduct of the normal job flow:

```
Job completed + QA approved + admin marks photos as "portfolio-ready"
  → System generates a GBP post draft:
    - Selects the best after-photo from the job
    - Generates caption from job metadata:
      "[Service type] completed in [neighborhood/city]. 
       [X] units turned over in [X] days for [client type]."
    - Adds CTA: "Get a Quote" → links to website
  → Admin reviews and approves (one-click publish or edit)
  → Post published to GBP via Google Business Profile API
```

**Google Business Profile API integration:**

| Capability | API endpoint | Effort |
|---|---|---|
| Create post | `accounts/{id}/locations/{id}/localPosts` | 2-3 days |
| Upload photo | `accounts/{id}/locations/{id}/media` | Included above |
| Read reviews | `accounts/{id}/locations/{id}/reviews` | 1 day additional |
| Reply to reviews | `accounts/{id}/locations/{id}/reviews/{id}/reply` | 1 day additional |

**Tier assessment:** This is a month 3-6 feature. For the first 3 months, manual GBP posting (30 minutes per week) is sufficient and ensures quality control while the process is being established.

### 70.2 GBP content calendar

| Week of month | Post type | Content |
|---|---|---|
| Week 1 | Completed project showcase | Best before/after from recent jobs |
| Week 2 | Service highlight | Feature one service with brief description and CTA |
| Week 3 | Team or equipment spotlight | Crew photo, new equipment, safety practice |
| Week 4 | Educational tip or seasonal prompt | "Spring is peak construction season — book your cleanup early" |
| Ongoing | Respond to every review | Within 24 hours |
| Monthly | Update photos | Add 3-5 new real photos from recent work |
| Quarterly | Update business description | Refresh with new proof points and any new services |

### 70.3 GBP Q&A section seeding

You can ask and answer your own questions on GBP. This pre-populates the Q&A section with useful information and prevents random people from posting inaccurate answers.

**Questions to seed:**

```
Q: What areas do you serve?
A: We serve the entire Austin metro area including Round Rock, 
   Cedar Park, Georgetown, Pflugerville, Buda, Kyle, and 
   surrounding communities. Contact us to confirm coverage 
   for your specific location.

Q: Are you licensed and insured?
A: Yes. A&A Cleaning Services is fully licensed and insured 
   with [coverage type]. We can provide a Certificate of 
   Insurance on request.

Q: Do you do residential cleaning?
A: We specialize in commercial and construction cleaning — 
   apartment turnovers for property managers, post-construction 
   cleanup for general contractors, and commercial facility 
   cleaning. We don't offer individual residential house cleaning.

Q: Do you speak Spanish?
A: Yes! Our team is fully bilingual (English and Spanish). 
   We communicate in whichever language works best for you 
   and your team.

Q: How quickly can you start a project?
A: For standard projects, we can typically begin within 3-5 
   business days. For rush or emergency cleaning, same-day 
   or next-day service may be available. Call us to discuss 
   your timeline.

Q: How do I get a quote?
A: Visit our website at [URL] to submit a quote request, or 
   call us directly at [phone]. We typically respond within 
   a few hours.
```

---

## Section 71: Hiring Platform Strategy and Tiered Employee Framework

### 71.1 Tiered employee structure

| Tier | Title | Experience | Requirements | Pay range | Role in crew |
|---|---|---|---|---|---|
| Tier 1 | Cleaning Technician | 1-3 years commercial cleaning experience | Reliable transportation, authorized to work, basic cleaning knowledge, physically capable of demanding work, able to follow checklists | $16-$19/hr | Crew member executing assigned tasks under crew lead direction |
| Tier 2 | Senior Cleaning Technician | 3-5 years commercial cleaning experience | All Tier 1 requirements plus: experience with post-construction cleanup, knowledge of commercial cleaning chemicals and equipment, ability to work independently, basic quality self-inspection skills | $19-$22/hr | Can work independently or lead small tasks within a larger crew |
| Tier 3 | Crew Lead | 5+ years commercial cleaning experience, 1+ year in a supervisory role | All Tier 2 requirements plus: ability to manage 3-5 person crew, client-facing communication skills, can conduct quality walkthrough, can train Tier 1 employees, can troubleshoot equipment and chemical issues, bilingual (English/Spanish) strongly preferred | $22-$28/hr | Leads crew on-site, manages job execution, communicates with admin, conducts self-inspection before marking complete |

**Promotion path:**
- Tier 1 → Tier 2: 6-12 months with consistent QA pass rates above 90%, all training completed, positive client feedback
- Tier 2 → Tier 3: 12-18 months at Tier 2, demonstrated leadership ability, can run a job independently, client-facing skills verified

**Platform support for tiers:**

Add a `tier` or `level` field to the `profiles` table for employees. Display on admin employee management view. Use for:
- Assignment logic: Tier 3 employees are auto-suggested as crew lead on new assignments
- Pay rate tracking: Tier determines base pay range
- Reporting: QA pass rates, productivity metrics, and client ratings segmented by tier
- Hiring inbox: Applicants tagged as Tier 1/2/3 candidates based on experience in application

### 71.2 Job posting strategy per tier

**Tier 1 (highest volume, broadest reach):**

| Platform | Why | Cost | Post frequency |
|---|---|---|---|
| Indeed | Primary platform for hourly cleaning jobs in Austin | Free basic, $5-15/day sponsored | Always active |
| Facebook Jobs | Strong for Austin local labor market, especially bilingual workers | Free | Always active |
| Craigslist Austin | Still effective for hourly labor in Austin | $10-25 per post | Monthly refresh |
| Google for Jobs | Aggregates from website careers page via schema | Free (requires JobPosting schema) | Always active via website |
| Nextdoor | Local community hiring in specific Austin neighborhoods | Free | When actively hiring |
| Community boards at laundromats, churches, community centers in Austin neighborhoods | Reaches workers who may not be on digital platforms | $0 (print flyers) | As needed |
| Word of mouth (current crew referrals) | Highest quality source. Existing employees know who works hard | $100-$200 referral bonus per hired person who stays 90 days | Always active |

**Tier 2 (moderate volume, more targeted):**

| Platform | Why | Cost |
|---|---|---|
| Indeed (sponsored) | Higher visibility for experienced candidates | $10-$20/day |
| LinkedIn | Better for experienced cleaning professionals who are building careers | Free basic post |
| Facebook Jobs | Still effective | Free |
| Industry contacts | Mom's network of people she's worked with over 15 years | $0 |
| Competitor employees | Experienced cleaners working for companies that pay less or treat them poorly | Organic (they find you through Indeed/LinkedIn/website) |

**Tier 3 (low volume, highly targeted):**

| Platform | Why | Cost |
|---|---|---|
| LinkedIn | Crew lead is a professional role. LinkedIn signals career opportunity | $30-100/day sponsored if urgently needed |
| Indeed (sponsored with premium placement) | Reach experienced supervisors actively looking | $15-25/day |
| Industry referrals | Mom knows experienced people in the Austin cleaning industry | $200-500 referral bonus |
| Internal promotion | Best crew leads come from within. Promote top Tier 2 employees | $0 (investment is in training and pay increase) |

### 71.3 Job listing content per tier

**Tier 1 listing — bilingual:**

```
English:
Commercial Cleaning Technician — A&A Cleaning Services (Austin, TX)

Pay: $16-$19/hour depending on experience
Schedule: Monday-Saturday, full-time (40 hours/week)
Start: Immediate

What you'll do:
• Clean commercial buildings, apartments, and construction sites 
  across Austin
• Follow detailed checklists to ensure quality standards
• Use professional cleaning equipment and products
• Take before and after photos of your work
• Communicate with your crew lead about progress and any issues

What you need:
• 1-3 years of commercial cleaning experience
• Reliable transportation to job sites across Austin
• Authorized to work in the United States
• Physically able to handle demanding cleaning work (lifting, 
  bending, standing for extended periods)
• Reliable and punctual

What we offer:
• Consistent full-time hours with a set schedule
• Professional equipment provided
• Paid training on our systems and standards
• Growth path to Senior Technician and Crew Lead
• Weekly pay via [payment method]
• A team that respects your work and your time

Apply: [website/careers link]
Questions: Call [phone]

---

Español:
Técnico de Limpieza Comercial — A&A Cleaning Services (Austin, TX)

Pago: $16-$19/hora según experiencia
Horario: Lunes-Sábado, tiempo completo (40 horas/semana)
Inicio: Inmediato

[Spanish translation of above]

Aplicar: [website/careers link]
Preguntas: Llamar [phone]
```

**Tier 3 listing:**

```
Crew Lead — A&A Cleaning Services (Austin, TX)

Pay: $22-$28/hour depending on experience
Schedule: Monday-Saturday, full-time
Start: [Date or "Immediate"]

About the role:
You'll lead a crew of 3-5 cleaning technicians on commercial 
and construction cleaning projects across Austin. This is a 
hands-on leadership role — you clean alongside your crew while 
managing the job execution, quality standards, and client 
communication.

What you'll do:
• Lead and manage crew members on daily job assignments
• Execute cleaning work alongside your team
• Conduct quality inspections before marking jobs complete
• Communicate with property managers and general contractors 
  on-site
• Train new Tier 1 technicians on procedures and standards
• Report issues, progress, and completion through our digital 
  platform (training provided)
• Manage equipment and supply inventory for your crew

What you need:
• 5+ years of commercial cleaning experience
• 1+ year in a supervisory or crew lead role
• Experience with post-construction cleanup AND commercial 
  facility cleaning
• Strong communication skills (client-facing)
• Bilingual English/Spanish strongly preferred
• Reliable transportation
• Ability to manage multiple priorities on active job sites
• Pride in quality work and attention to detail

What we offer:
• $22-$28/hour with performance-based raises
• Consistent full-time schedule
• Professional equipment and supplies provided
• Technology platform that makes your job easier (assignments, 
  checklists, photo documentation all on your phone)
• A company that's growing — leadership opportunities as we 
  expand
• Direct access to the owner — your input matters here

Apply: [website/careers link] or call [mom's name] directly 
at [phone]
```

### 71.4 Hiring pipeline integration with external platforms

**Current state:** Applications come in through the website careers page and land in the hiring inbox admin module. That works for candidates who find the website directly.

**The gap:** Most cleaning job candidates will find listings on Indeed, Facebook, or Craigslist — not on the company website. The hiring pipeline needs to capture candidates from these external sources.

**Integration approach by platform:**

| Platform | Integration method | Effort |
|---|---|---|
| Indeed | Link "Apply" button to website careers page (redirects candidate to your form). Or use Indeed's "Apply on Company Website" option which sends them to your URL | Zero code — configuration in Indeed posting |
| Facebook Jobs | Link application to website careers page URL | Zero code — link in Facebook job post |
| Craigslist | Include website careers page link in listing body | Zero code — link in listing |
| Google for Jobs | Automatically pulls from JobPosting schema on careers page | Already planned (schema implementation) |
| LinkedIn | Link to careers page or include direct application email | Zero code — link in LinkedIn post |
| Glassdoor | Claim employer profile, link to careers page | Free basic profile, 1 hour setup |

**For all platforms, the funnel is:**

```
External listing (Indeed, Facebook, Craigslist, LinkedIn)
  → Links to website careers page
  → Candidate submits application through your form
  → Application lands in hiring inbox admin module
  → Admin triages and updates status
  → All candidates managed in one place regardless of source
```

**Tracking source of hire:**

Add a "How did you hear about us?" field to the employment application form (already exists per the audit). Make the options:

- Indeed
- Facebook
- Craigslist
- Google search
- Referral from current employee
- Referral from someone else
- Saw our vehicle/sign
- Other

This lets you track which hiring channels actually produce quality hires, so you can invest more in what works.

### 71.5 Glassdoor employer strategy

**Why it matters:** When someone sees a job listing on Indeed and is considering applying, they often check Glassdoor next. If A&A has no Glassdoor presence, there's a gap in credibility. If there's a negative review from a disgruntled former employee, it could deter good candidates.

**Setup:**
- Claim the employer profile on Glassdoor (free)
- Add company description, photos, logo (match website)
- Add benefits information (pay range, schedule, growth path)
- Respond to any reviews professionally

**Encouraging positive reviews:**
- After an employee reaches 90 days (probation completion), ask: "Would you mind sharing your experience working here on Glassdoor? It helps us attract teammates who are a good fit."
- Never pressure. Never incentivize. Just ask genuinely and accept whatever they post.

---

## Section 72: Cross-Channel Content Efficiency

### 72.1 One job produces content for every channel

The key insight for a small business with limited time is that every completed job should generate content for multiple channels from a single set of assets:

```
Job completed with photos and positive client feedback
  │
  ├── Website: Before/after added to portfolio page
  ├── Google Business Profile: Post with photo + brief caption
  ├── Instagram: Before/after carousel with hashtags
  ├── Facebook: Same post adapted for Facebook format
  ├── LinkedIn: Project showcase post with business context
  ├── Email newsletter: Featured project of the month
  ├── Google Ads: Before/after as ad creative
  ├── Meta Ads: Before/after as retargeting creative
  ├── Capabilities package: Added to project examples
  ├── Proposal templates: Added to portfolio section
  └── Completion report: Sent to client with review request
```

One set of photos and one project description feeds ten marketing channels. Mom takes photos on the job. You distribute across channels. This is how a 10-person company markets like a 50-person company.

### 72.2 Monthly content production workflow

| Day of month | Action | Time required | Who |
|---|---|---|---|
| 1st | Review previous month's completed jobs. Select 4 best for content | 30 min | You |
| 2nd | Write 4 social posts, 1 blog post draft, newsletter draft | 2-3 hours | You (with Claude) |
| 3rd | Schedule social posts for the month (Buffer or native scheduling) | 30 min | You |
| 5th | Send newsletter | 15 min | You |
| 10th | GBP post #1 goes live | Auto-scheduled | System |
| Weekly | GBP post goes live | Auto-scheduled or 15 min manual | You |
| Ongoing | Respond to reviews, comments, messages within 24 hours | 10 min/day | Mom or you |

Total time investment: approximately 5-6 hours per month for content production and distribution across all channels. This is manageable for one person alongside development work.

---

## Section 73: Platform Integration Additions for Marketing Automation

### 73.1 Features to add to the admin dashboard (Tier 3-4 timeline)

**Review management card on Overview Dashboard:**

- Current Google rating and review count (manual entry until GBP API integrated)
- New reviews requiring response (manual tracking or API-fed)
- Review request sent count this month
- Next milestone: "3 more reviews to reach 25"

**Social post scheduler (simple version):**

When admin marks photos as "portfolio-ready" on a completed job, offer a one-click action: "Generate social post." System creates a draft post with:
- Before/after photos
- Auto-generated caption from job metadata (service type, area, scope)
- Hashtag suggestions
- Copy-to-clipboard for pasting into LinkedIn, Instagram, Facebook, GBP

This doesn't require API integration with social platforms. Just generating the content and making it easy to copy and paste saves 80% of the effort.

**Hiring analytics in Unified Insights:**

- Applications received by source (Indeed, Facebook, website direct, referral)
- Time from application to hire
- Conversion rate by source (applications → interviews → hires)
- Current pipeline: how many at each status stage
- Hire rate by tier (are we getting enough Tier 2+ candidates?)

### 73.2 Careers page dynamic content

The audit confirmed the careers page has no dynamic job listing display. Add:

```
Build a simple job listings section on the careers page that 
reads from a job_postings table (or a simpler config approach):

Option A (database-driven):
- Create job_postings table: id, title, tier, description, 
  requirements, pay_range, status (active/closed), created_at
- Careers page queries active postings and displays them
- Admin can create/edit/close postings from Configuration module

Option B (config-driven, simpler):
- Define active job postings in a config file or the existing 
  services/company data files
- Careers page reads from config
- You update the file when positions change

Either way, each listing should include:
- Job title with tier indicator
- Pay range
- Key requirements (3-5 bullets)
- "Apply Now" button that scrolls to or links to the application form
- JobPosting structured data for each active listing (Google for Jobs)
```

---

## Section 74: Metrics Dashboard for Marketing Channels

When the business reaches the point of spending on multiple channels, mom needs a simple way to see what's working. This doesn't need to be a separate platform — it can be a new tab in the existing Unified Insights admin module.

### 74.1 Marketing channel performance view

| Metric | Data source | Display |
|---|---|---|
| Website visitors by source | GA4 or first-party analytics | Bar chart: organic, paid, direct, social, referral |
| Leads by source | leads table, source field + UTM data | Bar chart matching above |
| Cost per lead by channel | Manual ad spend entry + lead count | Table with monthly trend |
| Quote-to-job conversion by source | quotes + jobs tables | Percentage per source |
| Revenue by lead source | jobs table + invoice data | Revenue attributed to each channel |
| Google review count and rating | Manual entry or GBP API | Single metric cards |
| Social followers | Manual entry | Single metric cards |
| Email list size and open rate | Resend or email platform metrics | Single metric cards |
| Hiring applications by source | employment_applications, how_did_you_hear field | Bar chart |

**Implementation timeline:** Month 4-6. Before this, the data is too sparse to be meaningful. Use a simple spreadsheet for the first 3 months.

---

## Section 75: Referral Incentive Programs Expanded

### 75.1 Client referral program

| Element | Design |
|---|---|
| Offer | "$100 credit toward your next service for every referral that becomes a paying client" |
| Tracking | Referrer name captured in lead intake ("How did you hear about us?" or referral code) |
| Payout trigger | Referred client completes and pays for first job |
| Communication | Thank-you SMS/email to referrer when credit is applied |
| Promotion | Mentioned in post-job email sequence, newsletter, and on website referral page |

### 75.2 Employee referral program

| Element | Design |
|---|---|
| Offer | "$150 cash bonus for referring a Tier 1 hire, $250 for Tier 2, $400 for Tier 3" |
| Payout trigger | Referred employee completes 90-day probation |
| Split payout option | $75 at hire, $75 at 90 days (reduces risk of quick quits) |
| Communication | Announced at team meetings, reminder in employee portal |
| Tracking | "Referred by" field in employment application |

### 75.3 Partner referral program

| Element | Design |
|---|---|
| For GCs, PMs, real estate agents, restoration companies | |
| Offer | 5-10% of first job value or flat rate ($100-$500 depending on job size) |
| Formalization | Simple one-page referral agreement |
| Tracking | Partner name in lead source field |
| Communication | Quarterly email update on referral status and earnings |
| Reciprocal | Mom refers her clients to partners for services she doesn't offer |

---

This covers everything you asked about and more. The sections are written to serve as long-term reference material that stays relevant as the business grows. The key principle throughout is that every piece of marketing infrastructure should either generate content automatically from normal business operations, or be simple enough that mom or you can execute it in under 30 minutes per week per channel.

# OWASP Analysis Against the Document Set

---

## Short Answer

The documents touch on security meaningfully but **never reference OWASP by name**, and they don't systematically address the OWASP framework. Security is covered in scattered pieces — RLS policies, rate limiting, input validation, auth boundaries, access credential encryption, data governance (Section 30), incident response (Section 48), and the codebase audit's security findings (Section 13). But there's no unified security section that maps to OWASP's Top 10 or OWASP's Application Security Verification Standard (ASVS).

For a platform that handles client PII, employee PII, building access codes, financial data, and authentication tokens, this is a gap worth closing.

---

## OWASP Top 10 (2021) Mapped Against What Exists

### A01: Broken Access Control — Coverage: B+

**What the documents/codebase address:**
- RLS policies on every sensitive table (audit confirmed)
- Middleware verifying session and role on all authenticated routes
- Employee portal scoped to only show assigned jobs (audit confirmed)
- Admin routes blocked for non-admin users (audit confirmed, pre-launch checklist item)
- Section 25 defines a full role-based permission matrix
- Section 30 covers data classification and access controls by category
- The pre-launch checklist (15.5) includes "Employee sees only their own assigned jobs" and "Attempt to access admin routes as employee → verify blocked"

**What's missing:**
- **No mention of Insecure Direct Object Reference (IDOR) testing.** Can a user manipulate a job ID, lead ID, or quote token in the URL to access another user's data? The RLS policies should prevent this at the database level, but this hasn't been explicitly tested. Example: if Employee A knows the UUID of a job assigned to Employee B, can they query it through the API? RLS should block it, but the testing script doesn't include this specific test case.
- **No discussion of horizontal privilege escalation.** The SB-6 role escalation issue is mentioned as open in the solutioning guide but the documents don't define what testing would verify it's resolved.
- **No CORS policy discussion.** The API routes should restrict cross-origin requests to the application's own domain. If CORS is permissive (or if Next.js API routes default to allowing all origins), an attacker could make API calls from a malicious site using a victim's session cookie.
- **No rate limiting on authenticated routes.** Rate limiting exists on public routes (5/hr strict tier). But authenticated admin routes — which can create jobs, modify leads, send quotes, and access financial data — have no rate limiting documented. A compromised admin session could exfiltrate data rapidly.

**What should be added:**

```
IDOR Testing Protocol:
1. Log in as Employee A
2. Capture the ID of a job assigned to Employee B (from seed data)
3. Attempt to fetch /api/jobs/[Employee-B-job-id] as Employee A
4. Expected: 403 Forbidden or empty result (RLS blocks access)
5. Repeat for: leads, quotes, client records, employee profiles, 
   job messages, issue reports, checklist items
6. Test with manipulated query parameters, not just URL paths

Horizontal Privilege Escalation Tests:
1. Log in as an employee
2. Attempt to call admin-only API routes (POST /api/quotes, 
   PATCH /api/leads/[id], POST /api/jobs)
3. Expected: 401 or 403 on every admin route
4. Test with the employee's valid session token — verify the 
   server checks role, not just authentication
```

---

### A02: Cryptographic Failures — Coverage: C+

**What the documents/codebase address:**
- TLS in transit via Vercel and Supabase defaults (Section 30)
- Encryption at rest via Supabase defaults (Section 30)
- QuickBooks credentials stored with encryption (audit confirmed)
- Access credentials (building codes, alarm codes) flagged for column-level encryption (Section 30.3)
- Enrichment tokens use signed tokens with expiration

**What's missing:**
- **No discussion of password hashing.** Supabase Auth handles this internally (bcrypt), but the documents should confirm this rather than assume it. If any custom auth mechanism exists, the hashing algorithm matters.
- **No discussion of token entropy.** The quote review tokens (public_token on quotes) enable unauthenticated access to quote details. How are these generated? If they're sequential, short, or predictable, an attacker could enumerate valid tokens and access client quotes. The token should be a cryptographically random string of sufficient length (minimum 32 characters, ideally UUID v4 or similar).
- **No secrets rotation policy.** Twilio auth tokens, Resend API keys, Supabase service role keys, OpenAI API keys — none of these have documented rotation schedules. If any key is compromised, how quickly can it be rotated and what breaks?
- **No discussion of sensitive data in logs or error messages.** If Sentry captures errors that include client phone numbers, access codes, or quote details in the stack trace, that's sensitive data leaking to a third-party service.
- **The access credential encryption recommended in Section 30.3 is not implemented.** The audit noted building access codes are likely stored in plain text in notes fields. This is a significant gap for a cleaning company that has keys and alarm codes to client properties.

**What should be added:**

```
Token Security Audit:
1. Examine public_token generation in quote creation
   - Is it cryptographically random? (crypto.randomUUID() or 
     crypto.randomBytes(32).toString('hex'))
   - What is the length? (minimum 32 chars)
   - Does it expire? (should have TTL or be revocable)
   - Can tokens be enumerated by brute force?

2. Examine enrichment_token generation
   - Same questions as above
   - Verify signed with ENRICHMENT_TOKEN_SECRET
   - Verify expiration is enforced server-side

Secrets Management Policy:
- All API keys rotated annually at minimum
- Rotation procedure documented per service
- No secrets in client-side code (verify no NEXT_PUBLIC_ 
  prefixed secrets that should be server-only)
- Sentry configured to scrub PII from error reports 
  (Sentry has built-in data scrubbing — verify it's enabled)
```

---

### A03: Injection — Coverage: B

**What the documents/codebase address:**
- Supabase client uses parameterized queries by default (the ORM prevents SQL injection in standard usage)
- Input validation exists on API routes (the audit confirmed validation on quote request, employment application)
- Rate limiting and dedup prevent automated injection attempts at volume

**What's missing:**
- **No explicit SQL injection testing.** Supabase's JavaScript client parameterizes queries, but if any raw SQL is used (via `supabase.rpc()` or direct database functions), injection is possible. The documents should confirm whether any raw SQL exists.
- **No XSS (Cross-Site Scripting) discussion anywhere.** React provides default XSS protection by escaping rendered content, but if any component uses `dangerouslySetInnerHTML`, unsanitized user input could execute scripts. The AI assistant responses, job messages, issue reports, and lead messages are all user-generated content that gets displayed in the admin dashboard and employee portal. If any of these render HTML rather than plain text, XSS is possible.
- **No discussion of Server-Side Request Forgery (SSRF).** If any API route fetches external URLs based on user input (unlikely in this codebase but should be confirmed), SSRF could allow an attacker to probe internal network resources.
- **No Content Security Policy (CSP) headers.** CSP tells the browser which sources of scripts, styles, and images are trusted. Without CSP, an XSS vulnerability becomes much more dangerous because the injected script can load external resources. The documents never mention CSP.

**What should be added:**

```
XSS Audit:
1. Search codebase for dangerouslySetInnerHTML — if found, 
   verify the content is sanitized with DOMPurify or equivalent
2. Search for any instance where user-generated content is 
   rendered as HTML rather than text
3. Test: submit a lead message containing <script>alert('xss')</script>
   Verify it renders as text in admin dashboard, not as executable HTML
4. Test: submit a job message with <img onerror="alert('xss')" src="x">
   Verify it renders as text in employee portal and admin view
5. Test: submit an employment application with script tags in 
   name and experience fields

Content Security Policy:
Add CSP headers via next.config.js or middleware:
- default-src 'self'
- script-src 'self' (add specific CDN domains if needed)
- style-src 'self' 'unsafe-inline' (needed for Tailwind)
- img-src 'self' [supabase-storage-domain] data:
- connect-src 'self' [supabase-domain] [twilio-domain] [resend-domain]
- frame-ancestors 'none' (prevents clickjacking)
```

---

### A04: Insecure Design — Coverage: B+

**What the documents address:**
- The overall architecture separates public, admin, and employee surfaces
- Authentication is handled at the middleware level
- Business logic validation exists (conflict detection in scheduling, dedup in lead intake)
- The threat model is implicitly understood (Section 30 data classification, Section 48 incident response)

**What's missing:**
- **No explicit threat model.** Who are the threat actors? What are they after? For this specific application:
  - **Competitor:** Could submit fake leads to waste admin time, scrape pricing information
  - **Disgruntled employee:** Could access other employees' data, modify job statuses maliciously, steal client access codes
  - **External attacker:** Could probe for exposed API endpoints, attempt to access client PII, deface the public site
  - **Client impersonator:** Could guess or steal a quote token to view/accept quotes on someone else's behalf
- **No abuse case analysis.** What happens if someone submits 100 fake employment applications? 50 fake quote requests from different IPs? Uses the AI assistant to extract company pricing strategies? Each abuse scenario should have a documented defense.

---

### A05: Security Misconfiguration — Coverage: C

**What the documents address:**
- Environment variable validation on startup (audit confirmed)
- The pre-launch checklist includes verifying env vars are set
- Sentry DSN conditional configuration

**What's missing — and this is a significant gap:**
- **No security headers audit.** Beyond CSP (covered above), the following headers should be set on all responses:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` (prevents clickjacking)
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains` (HSTS)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(self)` (restrict browser APIs — though camera and geolocation are needed for employee portal photo upload)
- **No discussion of Vercel deployment security settings.** Vercel has security-relevant configuration: branch protection, deployment protection, function region, serverless function timeout. None discussed.
- **No discussion of Supabase security configuration.** Supabase has settings that affect security: whether the service role key is exposed, whether RLS is enabled per table (it is, per audit), whether email confirmations are required for auth, whether signup is restricted. The documents should confirm these settings.
- **No `next.config.js` security audit.** Next.js configuration affects security: `poweredBy` header (should be disabled), `reactStrictMode`, redirect rules, header configuration. Not discussed.
- **Directory listing / source map exposure.** Are source maps deployed to production? They expose your entire codebase structure. Vercel may or may not include them by default.

**What should be added:**

```
Security Headers (add to next.config.js or middleware):

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '0' }, // Disabled per modern best practice; CSP replaces it
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(self)' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Content-Security-Policy', value: "default-src 'self'; ..." },
];

Supabase Configuration Verification:
- [ ] RLS enabled on ALL tables (not just some)
- [ ] anon key has minimal permissions (only what public routes need)
- [ ] service_role key is NEVER exposed to client-side code
- [ ] Email confirmation required for new signups
- [ ] Signup restricted (no open registration — employees and admins created by admin only)
- [ ] Database webhooks (if any) use authenticated endpoints
- [ ] Storage buckets have appropriate RLS policies (photos accessible only to assigned employees and admin)

Next.js Configuration:
- [ ] poweredBy: false (removes X-Powered-By: Next.js header)
- [ ] Source maps disabled for production builds
- [ ] reactStrictMode: true
```

---

### A06: Vulnerable and Outdated Components — Coverage: D

**Not addressed anywhere in the documents.** This is a real gap.

**What should exist:**
- `npm audit` run as part of any deployment pipeline
- Dependabot or Snyk configured on the GitHub repository for automated vulnerability alerts
- A policy for how quickly critical, high, medium, and low vulnerabilities are patched
- Lockfile (`package-lock.json` or `pnpm-lock.yaml`) committed to prevent supply chain attacks via dependency resolution changes
- Regular update cadence for major dependencies (Next.js, Supabase client, React)

**What should be added:**

```
Dependency Security Protocol:
1. Run `npm audit` today. Fix all critical and high vulnerabilities.
2. Enable Dependabot on the GitHub repository (Settings → Security → 
   Code security and analysis → Dependabot alerts + security updates)
3. Policy: Critical CVEs patched within 48 hours. High within 1 week. 
   Medium within 1 month. Low at next scheduled maintenance.
4. Verify lockfile is committed and matches node_modules
5. Add `npm audit --audit-level=high` to any CI/CD pipeline as a 
   blocking check
```

---

### A07: Identification and Authentication Failures — Coverage: B

**What exists:**
- Supabase Auth handles authentication (password hashing, session management, JWT tokens)
- Rate limiting on public auth-adjacent routes (quote request, employment application)
- Token-based quote review with signed enrichment tokens

**What's missing:**
- **No brute force protection on login.** The admin and employee login routes go through Supabase Auth, which has its own rate limiting, but the documents don't confirm this or document what happens after X failed attempts. Is the account locked? Is the IP throttled? Is there any alerting on repeated failed logins?
- **No session management discussion.** How long do sessions last? Are sessions invalidated on password change? Can a user have multiple active sessions? If an employee is terminated, is their session immediately invalidated?
- **No MFA discussion.** For the admin account that has access to client PII, employee PII, financial data, and building access codes, multi-factor authentication should be strongly considered. Supabase Auth supports TOTP MFA. The documents never mention it.
- **No account recovery flow.** What happens when mom forgets her password? When an employee can't log in? The documents don't describe the recovery process or its security implications (password reset links, email-based recovery, etc.)

**What should be added:**

```
Authentication Hardening:
1. Enable MFA for all admin accounts (Supabase Auth TOTP)
   - This is the single most impactful auth security improvement
   - A compromised admin password without MFA = full system access
2. Verify Supabase Auth rate limiting on failed logins
   - Default: Supabase throttles after repeated failures
   - Confirm this is not disabled in project settings
3. Session management policy:
   - Admin sessions: 8-hour expiry, require re-auth for 
     sensitive actions (config changes, employee management)
   - Employee sessions: 12-hour expiry (covers a full work day)
   - Client portal sessions: 30-day (magic link, low risk)
4. Account deactivation procedure:
   - When employee is terminated, immediately: disable Supabase 
     auth account, remove all active sessions, revoke any 
     outstanding tokens
   - Document this in the employee offboarding checklist
```

---

### A08: Software and Data Integrity Failures — Coverage: C-

**What exists:**
- Signed enrichment tokens (integrity verification)
- Database foreign key constraints (referential integrity)

**What's missing:**
- **No CI/CD pipeline integrity.** No discussion of branch protection, required reviews, or deployment approval workflows. If someone pushes directly to main, it deploys to production automatically via Vercel. For a solo developer this is acceptable, but the documents should acknowledge the risk.
- **No Subresource Integrity (SRI) for external scripts.** If GA4, Meta Pixel, or any other third-party script is loaded, SRI hashes ensure the script hasn't been tampered with.
- **No webhook signature verification.** If Supabase webhooks, Stripe webhooks (future), or any other incoming webhooks are used, they must verify the signature to prevent spoofed requests. The QuickBooks integration may receive webhooks — not discussed.
- **No data validation on incoming API data.** The audit confirmed validation exists on public routes, but do admin routes validate input types and ranges? Can an admin route receive a negative dollar amount, an impossibly large square footage, or a job date in 1970?

---

### A09: Security Logging and Monitoring Failures — Coverage: C

**What exists:**
- Sentry error monitoring (conditional on DSN being set)
- First-party analytics tracking conversion events
- Notification dispatch logging (attempts, errors, timestamps)
- Section 30.2 recommends access logging for sensitive data

**What's missing:**
- **No security-specific logging.** The system logs operational events (notifications sent, errors thrown) but doesn't log security events: failed login attempts, rate limit hits, blocked access attempts, admin actions on sensitive data, access credential views.
- **No alerting on suspicious activity.** If someone hits rate limits 50 times in an hour from different IPs, nobody is notified. If there are 20 failed login attempts on the admin account, nobody is notified. If an employee views 100 different job records in 5 minutes (possible data scraping), nobody is notified.
- **No audit trail for admin actions.** When admin changes a lead status, edits a quote amount, modifies an employee record, or views building access codes, there should be an audit log entry. This is both a security requirement and a business requirement (if mom hires an ops manager, she needs to see what they changed).

**What should be added:**

```
Security Event Logging:
Create a security_events table:
- id, event_type, user_id, ip_address, user_agent, details (jsonb), 
  created_at
- event_types: login_success, login_failure, rate_limit_hit, 
  unauthorized_access_attempt, admin_data_modification, 
  access_credential_viewed, employee_account_deactivated, 
  session_invalidated, api_key_rotated

Log these events:
1. Every failed login attempt (user_id if known, IP always)
2. Every rate limit trigger (IP, route, count)
3. Every 401/403 response (someone tried to access something 
   they shouldn't)
4. Every admin write action on leads, quotes, jobs, employees 
   (who changed what, when, from what IP)
5. Every view of building access codes (Section 30.3 requirement)
6. Every employee status change (hired, terminated, role changed)

Alerting:
- 5+ failed logins in 10 minutes from same IP → alert admin
- 10+ rate limit hits in 1 hour from same IP → alert admin
- Any access to admin routes from unrecognized IP 
  (after establishing baseline) → alert admin
- Any modification to admin user's own permissions → alert owner
```

---

### A10: Server-Side Request Forgery (SSRF) — Coverage: D

**Not addressed.** Likely low risk for this application since there are few scenarios where user input would drive server-side HTTP requests. However:

- The AI assistant may make requests to Anthropic's API with user-provided content. If the AI assistant's system prompt or user messages are crafted to include URLs that the server then fetches, SSRF could be possible. This is an indirect vector through the LLM.
- If the QuickBooks integration fetches data from URLs provided in OAuth callbacks, SSRF should be considered.
- If any future integration fetches client-provided URLs (e.g., importing data from a link), SSRF becomes relevant.

**Minimal action:** Confirm that no API route takes a URL from user input and fetches it server-side. If none do, document that SSRF is not a current risk vector but should be evaluated when adding integrations.

---

## Beyond OWASP Top 10 — Additional Security Considerations

### Security Protocol Set to Track

Use OWASP as the application-security baseline, but do not treat it as the only protocol relevant to this platform. For A&A's launch stage, the practical security set is:

| Protocol / Standard | Why it matters here | Launch posture |
|---|---|---|
| OWASP Top 10 | Baseline web-app risks for auth, access control, injection, crypto, file uploads, logging, and misconfiguration. | Pre-launch checklist item. |
| OWASP API Security Top 10 | The admin dashboard, employee portal, quote flows, notifications, AI assistant, and QuickBooks all depend on API routes. | Pre-launch for public/admin route auth and rate-limit checks; deeper authenticated abuse testing post-launch. |
| OWASP ASVS Level 1 | More structured verification checklist than the Top 10, useful for confirming launch controls without requiring enterprise overhead. | Post-launch month 2-3 checklist pass, with Level 2 items cherry-picked for sensitive data. |
| Supabase RLS best practices | Database access is enforced through Supabase Auth JWTs, Postgres RLS, and service-role API routes. | Pre-launch for all sensitive tables and employee/admin object access. |
| Least-privilege service-role usage | Service-role keys bypass RLS, so every API route using them must perform its own auth and input validation. | Pre-launch for service-role routes. |
| Admin MFA | Admin dashboard controls leads, employees, jobs, financial sync state, notifications, and client data. | Pre-launch for admin accounts. |
| File upload security | Job photos can expose client sites, access details, or regulated information accidentally captured in photos. | Pre-launch for MIME/size/storage policy checks; deeper photo-governance training post-launch. |
| Secrets management and rotation | Vercel, Supabase, Twilio, Resend, Anthropic, QuickBooks, Upstash, GitHub, and domain accounts all affect production. | Pre-launch account inventory; rotation cadence post-launch. |
| Audit/security event logging | Needed to detect misuse, failed auth patterns, rate-limit abuse, and sensitive admin changes. | Basic operational logs pre-launch; `security_events` table post-launch. |
| Backup and recovery verification | Supabase backups exist, but restore confidence matters once the platform becomes operationally important. | Document recovery before launch; test restore post-launch. |

### API Security (OWASP API Security Top 10)

The platform is API-driven (Next.js API routes serving admin, employee, and public clients). OWASP has a separate API Security Top 10 that's relevant:

| API Risk | Status | Gap |
|---|---|---|
| Broken Object Level Authorization | Partially addressed (RLS) | Needs IDOR testing |
| Broken Authentication | Partially addressed (Supabase Auth) | Needs brute force and session hardening |
| Excessive Data Exposure | Unknown | Do API responses return more fields than the client needs? If `/api/jobs/[id]` returns the full job record including internal notes to the employee portal, that's excessive exposure |
| Lack of Resources & Rate Limiting | Addressed on public routes | Missing on authenticated routes |
| Broken Function Level Authorization | Partially addressed (middleware role checks) | Needs systematic testing |
| Mass Assignment | Unknown | Can a user submit extra fields in a POST/PATCH request that modify fields they shouldn't? E.g., can an employee submit `{"status": "completed", "role": "admin"}` and get their role changed? |
| Security Misconfiguration | Partially addressed | Needs headers, CORS, and config audit |
| Injection | Low risk (parameterized queries) | Confirm no raw SQL |
| Improper Assets Management | Not addressed | Are there deprecated or undocumented API routes that still work? Shadow endpoints? |
| Insufficient Logging & Monitoring | Weak | Needs security event logging |

### Supply Chain Security

- **npm packages:** No discussion of vetting dependencies. The project likely has 500+ transitive dependencies, any of which could be compromised.
- **Vercel build environment:** Vercel runs `npm install` and `next build` on their servers. If a dependency is compromised between when you last built locally and when Vercel builds, malicious code runs in production.
- **Supabase edge functions (if used):** Same supply chain risk.

**Minimal action:** Enable Dependabot, run `npm audit`, commit lockfile, and consider adding Socket.dev for deeper supply chain analysis.

### Data Backup Security

Section 31 covers backup frequency but not backup security:

- Are Supabase backups encrypted?
- Who has access to the backup files?
- If you download a backup for local testing, is the local copy encrypted?
- Is the backup retention period sufficient for both business recovery and regulatory compliance?

---

## Recommended OWASP Section to Add to the Documents

Here's what I'd add as **Section 76: Application Security (OWASP Alignment)**:

### Structure

```
## 76. Application Security — OWASP Alignment

### 76.1 Threat Model
- Threat actors and motivations
- Asset inventory (what's worth protecting)
- Attack surface map (public routes, authenticated routes, 
  third-party integrations, data stores)

### 76.2 OWASP Top 10 Compliance Checklist
- One row per risk category
- Current control, gap, remediation action, priority, owner

### 76.3 Security Headers Configuration
- Exact headers to set in next.config.js or middleware
- CSP policy definition

### 76.4 Authentication and Session Hardening
- MFA for admin accounts
- Session expiry policies
- Account deactivation procedure
- Brute force protection verification

### 76.5 Input Validation and Output Encoding
- XSS prevention verification
- SQL injection prevention verification (confirm parameterized queries)
- Mass assignment prevention
- File upload security (photo uploads: type validation, size limits, 
  malware scanning consideration)

### 76.6 Security Logging and Monitoring
- Security events table schema
- Events to log
- Alerting thresholds
- Audit trail for admin actions

### 76.7 Dependency and Supply Chain Security
- npm audit policy
- Dependabot configuration
- Lockfile integrity
- Update cadence

### 76.8 Secrets Management
- Rotation schedule
- Storage (Vercel env vars, never in code)
- Verification that no secrets are in client-side bundles
- Emergency rotation procedure

### 76.9 Security Testing Protocol
- Pre-launch security checklist
- IDOR testing script
- XSS testing payloads
- Auth boundary testing
- Quarterly security review cadence

### 76.10 Incident Response (Security-Specific)
- Cross-reference Section 48 but add:
- Credential compromise response
- Data exfiltration detection and response
- Third-party breach notification handling 
  (what if Supabase or Twilio is breached?)
```

---

## Priority Actions — What to Do Right Now

If you want to bring security up to OWASP standards before launch, here's the minimum:

| Priority | Action | Effort | Impact |
|---|---|---|---|
| 1 | Add security headers to next.config.js | 30 minutes | Blocks clickjacking, MIME sniffing, missing HSTS |
| 2 | Run `npm audit` and fix critical/high vulnerabilities | 1-2 hours | Closes known dependency vulnerabilities |
| 3 | Enable Dependabot on GitHub repo | 15 minutes | Ongoing automated vulnerability alerts |
| 4 | Verify no `dangerouslySetInnerHTML` with user content | 30 minutes grep | Closes XSS vector |
| 5 | Verify quote public_token is cryptographically random and sufficient length | 30 minutes | Prevents token enumeration |
| 6 | Verify Supabase service_role key is never in client-side code | 30 minutes grep for the key or NEXT_PUBLIC_ prefix | Prevents full database access from browser |
| 7 | Add CSP header (even a basic one) | 1-2 hours | Major defense against XSS |
| 8 | IDOR testing on 5 critical routes | 2-3 hours | Verifies RLS actually works end-to-end |
| 9 | Enable MFA on admin Supabase account | 30 minutes | Single biggest auth improvement |
| 10 | Verify source maps are not deployed to production | 15 minutes | Prevents code structure exposure |

**Total: approximately 8-10 hours of security hardening.** This gets you to a strong OWASP-aligned posture for a small business application. It doesn't require a penetration test or a security audit firm — it requires systematic verification of the controls that should already exist.

The platform's security foundation is genuinely solid (RLS, rate limiting, role-based middleware, environment validation). What's missing is the verification layer and the hardening layer on top of that foundation. The walls are built well — you just need to check that every window is locked and add the deadbolts.

# Security, Compliance & Standards Alignment Addendum

Date: 2026-04-13
Status: Active companion to `website-blueprint.md`
Context: A&A Cleaning Services — Austin, TX. Commercial and post-construction cleaning. 10-person bilingual crew. Owner-operator (mom) transitioning from subcontractor to prime contractor. Platform: Next.js 14 / Supabase / Vercel / Twilio / Resend / Anthropic. Solo developer with AI assistance. Pre-launch targeting June 2026.

---

## 1. How This Document Is Organized

Every framework and standard is evaluated against five criteria specific to your situation:

| Criteria | What It Means |
|---|---|
| **Legal exposure** | Can non-compliance result in lawsuits, fines, or regulatory action? |
| **Business impact** | Does compliance (or non-compliance) directly affect your ability to win contracts, retain clients, or operate? |
| **Technical effort** | How much development work is required given what already exists in the codebase? |
| **Current coverage** | How much of this is already addressed in the roadmap documents and/or codebase? |
| **Stage relevance** | Does this matter at launch (10 jobs/month) or at scale (100+ jobs/month)? |

Frameworks are grouped into three tiers:

- **Tier 1: Pre-launch requirements** — Non-compliance creates immediate legal, operational, or credibility risk
- **Tier 2: First-year priorities** — Address as business grows and specific triggers fire
- **Tier 3: Growth-stage considerations** — Relevant when revenue, headcount, or client profile justifies the investment

---

## 2. Tier 1: Pre-Launch Requirements

These frameworks apply the day the website goes live and the platform begins handling real data. Gaps here create legal exposure or operational risk from day one.

---

### 2.1 OWASP Top 10 (2021) — Web Application Security

**What it is:** The Open Web Application Security Project's list of the ten most critical security risks to web applications. Updated periodically, the 2021 edition is current. It's the universal reference point for web application security — if a security professional audits your platform, they start here.

**Why it matters for A&A specifically:**

The platform handles five categories of data that attackers would target:

1. **Client PII** — names, phone numbers, email addresses, physical addresses. A breach exposes your clients' contact information and property addresses. For commercial clients, this includes their business locations and points of contact.

2. **Employee PII** — names, phone numbers, addresses, pay rates, work authorization status, background check consent. The employment application collects 20+ fields including sensitive information about legal work status. A breach here has employment law implications.

3. **Building access credentials** — alarm codes, gate codes, lockbox codes, parking instructions. This is the most dangerous data in the system. If an attacker obtains access codes for commercial buildings your mom's crew cleans, the liability exposure extends beyond data breach into potential property crime facilitation. A property manager who discovers their building codes leaked through your platform will terminate the contract immediately and may pursue legal action.

4. **Financial data** — quote amounts, invoice details, payment records, job costs. QuickBooks integration means financial data flows between systems. A breach exposes your pricing strategy to competitors and your clients' spending to unauthorized parties.

5. **Authentication tokens** — session cookies, quote review tokens, enrichment tokens. Compromised tokens allow impersonation of admin, employees, or clients.

**How it maps to the existing roadmap and codebase:**

| OWASP Risk | What Exists | What's Missing | Roadmap Reference |
|---|---|---|---|
| A01: Broken Access Control | RLS on all sensitive tables. Middleware role verification. Employee-scoped job visibility. Admin route protection. | No IDOR testing protocol. No CORS policy discussion. No rate limiting on authenticated routes. SB-6 role escalation still open. | Blueprint §13.1 confirms RLS. Pre-launch checklist §15.5 includes auth boundary testing. Solutioning guide tracks SB-6. |
| A02: Cryptographic Failures | TLS via Vercel/Supabase. QuickBooks credentials encrypted. Signed enrichment tokens with expiration. | Access credentials stored in plain text (Section 30.3 recommends encryption but not implemented). No token entropy verification on public_token. No secrets rotation policy. No verification that sensitive data is excluded from Sentry error reports. | Section 30 covers data classification. Section 30.3 specifically flags access credential encryption as a gap. |
| A03: Injection | Supabase client uses parameterized queries. Input validation on public API routes. Rate limiting prevents automated injection at volume. | No explicit XSS audit (dangerouslySetInnerHTML check). No Content Security Policy headers. No confirmation that all database queries are parameterized (any raw SQL via supabase.rpc?). | Blueprint §13 audit did not specifically test for injection. Section 47 mentions security tests as missing. |
| A04: Insecure Design | Three-surface architecture with proper separation. Auth at middleware level. Business logic validation (scheduling conflict detection, dedup). | No formal threat model. No abuse case analysis. No security requirements in feature development process. | Section 48 incident response exists but no proactive threat modeling. |
| A05: Security Misconfiguration | Environment variable validation on startup. Conditional Sentry configuration. | No security headers (X-Frame-Options, HSTS, CSP, X-Content-Type-Options). No Vercel deployment security review. No Supabase configuration audit. No verification that source maps aren't deployed to production. No confirmation that Next.js poweredBy header is disabled. | Not addressed anywhere in current documents. |
| A06: Vulnerable Components | Not addressed. | No npm audit process. No Dependabot. No dependency update policy. No lockfile integrity verification. | Section 47 mentions dependency audit as missing in CI/CD pipeline. No standalone discussion. |
| A07: Auth Failures | Supabase Auth handles password hashing and session management. Rate limiting on auth-adjacent public routes. | No brute force protection verification on login routes. No session management policy (expiry, invalidation on termination). No MFA on admin account. No account recovery flow documentation. | Section 25 defines RBAC but doesn't address auth hardening. |
| A08: Data Integrity Failures | Signed enrichment tokens. Database foreign key constraints. | No CI/CD pipeline integrity (branch protection, deployment approval). No webhook signature verification for QuickBooks or future Stripe integration. No Subresource Integrity for external scripts (GA4, Meta Pixel). No input validation audit on admin routes (mass assignment risk). | Section 47 discusses CI/CD as missing. No webhook security discussion. |
| A09: Logging/Monitoring Failures | Sentry for error monitoring. First-party analytics for conversion events. Notification dispatch logging with retry tracking. | No security-specific event logging (failed logins, rate limit hits, unauthorized access attempts, admin data modifications, access credential views). No alerting on suspicious activity. No admin action audit trail. | Section 30.2 recommends access logging for sensitive data but no implementation exists. Section 48 incident response assumes detection happens but doesn't specify how. |
| A10: SSRF | Low risk for current architecture. | No explicit confirmation that no API route fetches URLs from user input. AI assistant sends user content to Anthropic API — indirect SSRF vector through prompt injection is theoretically possible but low probability. | Not discussed. |

**Specific relevance to the subcontractor-to-prime transition:**

When mom subcontracts through a larger company, that company's security posture covers the client relationship. If building access codes leak, the prime contractor's insurance and legal team handle it. When mom IS the prime contractor, she owns that liability entirely. A property management company that gives A&A access codes to 200 apartment units is trusting that those codes are protected. The platform's security is directly tied to contract eligibility.

General contractors evaluating cleaning subcontractors increasingly ask about data handling practices, especially for projects involving sensitive facilities (medical offices, corporate campuses, government buildings). Having documented security practices — even at a basic level — differentiates A&A from competitors who don't think about it at all.

**Implementation plan weighted against the roadmap:**

| Action | Effort | When (per existing timeline) | Dependencies |
|---|---|---|---|
| Add security headers to next.config.js | 30 min | Day 1 alongside layout.tsx fix | None |
| Run npm audit, fix critical/high findings | 1-2 hours | Day 1 alongside env var setup | None |
| Enable Dependabot on GitHub | 15 min | Day 1 | GitHub access |
| Grep for dangerouslySetInnerHTML, verify no user content | 30 min | Day 2 during testing phase | None |
| Verify public_token uses crypto.randomUUID() or equivalent | 30 min | Day 2 during testing phase | Codebase access |
| Verify Supabase service_role key not in any NEXT_PUBLIC_ variable | 30 min | Day 1 during env var setup | Vercel dashboard access |
| Add CSP header (basic policy) | 1-2 hours | Day 4-5 bug fix sprint | Security headers already added |
| IDOR testing on 5 critical API routes | 2-3 hours | Day 2-3 during critical flow testing — add to test script | Seed data exists |
| Enable MFA on admin Supabase Auth account | 30 min | Day 1 | Supabase dashboard access |
| Verify source maps not in production build | 15 min | Day 18 pre-launch hardening | Production deployment exists |
| Implement access credential column encryption | 4-6 hours | Tier 4 (days 90-180) per expansion §30.3 | Not a launch blocker since few access codes exist initially |
| Security event logging table and triggers | 1-2 days | Post-launch month 2-3 | Platform stable and handling real traffic |
| Admin action audit trail | 1-2 days | Post-launch month 2-3 or when ops manager hired | Role-based access implemented |

**Total pre-launch OWASP effort: ~8-10 hours, distributed across existing timeline without adding new days.**

---

### 2.2 TCPA — Telephone Consumer Protection Act

**What it is:** Federal law governing telephone and SMS communications. Enforced by the FCC with a private right of action, meaning anyone who receives an unsolicited text can sue. Penalties range from $500 to $1,500 per message.

**Why this is critical for A&A specifically:**

The platform automates SMS communication at multiple points:

- Lead notifications to admin (ADMIN_ALERT_PHONE) — these go to mom's phone, which she controls, so no TCPA issue
- Acknowledgment SMS to lead submitters — TCPA applies
- Lead follow-up sequences (1h, 4h, 24h escalation) — TCPA applies
- Employee assignment notifications — TCPA applies (employment relationship provides some protection but best practice is explicit consent)
- Post-job satisfaction rating requests — TCPA applies
- Google review request automation — TCPA applies
- Quote sent notifications to clients — TCPA applies
- Pre-job preparation reminders — TCPA applies
- Re-engagement sequences ("we miss you") — TCPA applies and this is the highest-risk category

The expansion document (Section 22) outlines a sophisticated communication automation hub with sequences for lead follow-up, quote follow-up, pre-job prep, day-of notification, post-job follow-up, re-engagement, win-back, and anniversary. That's potentially 15-20 automated SMS touchpoints per client lifecycle. At $500-$1,500 per non-compliant message, the exposure is significant.

**The specific risk scenario:**

A property manager submits a quote request. They don't check a consent box (or there is no consent box). The platform sends an acknowledgment SMS, then a 1-hour follow-up, then a 4-hour escalation, then a 24-hour alert, then a quote delivery SMS, then a post-quote follow-up series. That's 6+ text messages to someone who never consented to receive them.

If that person is a serial TCPA plaintiff (they exist — people who submit forms to businesses specifically to generate TCPA violations and file lawsuits), you're looking at $3,000-$9,000 in exposure from a single fake lead.

TCPA class actions against small businesses are not theoretical. They happen regularly. The typical settlement for a small business is $10,000-$50,000 plus legal fees. For a company trying to reach $25K in revenue from website leads, a single TCPA lawsuit could wipe out an entire year of growth.

**How it maps to the existing roadmap:**

| Requirement | Roadmap Coverage | Gap |
|---|---|---|
| Prior express written consent for marketing SMS | Section 22.3 mentions TCPA compliance and consent timestamp storage | Not verified in code. The quote request form needs an explicit, unchecked-by-default consent checkbox. The audit did not specifically verify this exists |
| Clear and conspicuous disclosure | Not specifically discussed | The consent language must clearly state: who will text them, approximate frequency, that message and data rates apply, and how to opt out |
| Opt-out mechanism | Section 22.3 mentions opt-out handling. Every SMS includes opt-out instruction per the docs | Not verified that STOP processing actually works. Not verified that opted-out contacts are blocked from all future automated sends |
| Transactional vs marketing distinction | Not discussed anywhere | Job notifications and schedule confirmations are transactional (less restricted). "We miss you" re-engagement and review requests are marketing (requires consent). The system needs to classify each SMS type and enforce consent requirements accordingly |
| Record keeping | Section 22.3 mentions consent timestamp storage per contact | Not verified that the database has consent fields. If a lawsuit occurs, you must produce the consent record — timestamp, method, exact language shown |
| Sender identification | Not discussed | Every SMS must identify the business: "A&A Cleaning: ..." prefix |
| Quiet hours | Section 22.3 references quiet hours. Notification system has quiet-hours queueing | TCPA has specific quiet hours: no marketing texts before 8 AM or after 9 PM in the recipient's time zone. Verify your quiet hours configuration aligns. The current configuration may use CT (Central Time) but recipients could theoretically be in other time zones |
| Auto-dialer provisions | Not discussed | If Twilio sends SMS programmatically (it does), the platform is technically an automatic telephone dialing system (ATDS). This triggers the stricter consent requirements under TCPA |

**Implementation plan:**

| Action | Effort | When | Priority |
|---|---|---|---|
| Add explicit SMS consent checkbox to quote request form | 1-2 hours | Day 7-10 content rewrite sprint (when touching forms anyway) | **Critical — pre-launch** |
| Add explicit SMS consent checkbox to contact form if one exists | 30 min | Same sprint | **Critical** |
| Add consent_given, consent_timestamp, consent_method columns to leads table if not present | 30 min migration | Day 1-5 with other database work | **Critical** |
| Verify all automated SMS includes business name prefix and STOP instruction | 1-2 hours audit of all SMS templates | Day 4-5 bug fix sprint | **Critical** |
| Implement STOP processing: incoming STOP reply → flag contact → block future sends → send confirmation | 2-4 hours (Twilio webhook for incoming SMS + database update + send blocking logic) | Day 18-20 pre-launch hardening | **Critical** |
| Classify every automated SMS as transactional or marketing in code | 2-3 hours audit and code annotation | Day 18-20 | **High** |
| Block marketing SMS to contacts without consent record | 1-2 hours (add consent check to SMS send function) | Day 18-20 | **Critical** |
| Add consent language text visible next to checkbox: "I agree to receive text messages from A&A Cleaning Services about my request and related services. Message frequency varies. Reply STOP to opt out. Msg & data rates may apply." | 30 min | Day 7-10 with checkbox implementation | **Critical** |
| Employee SMS consent: add consent acknowledgment to employment application or onboarding | 1 hour | Post-launch month 1 (employment relationship provides some TCPA protection but explicit consent is best practice) | **High** |
| Document TCPA compliance posture | 1-2 hours | Pre-launch documentation | **High** |

**Total effort: ~10-14 hours. Some items overlap with existing timeline tasks.**

**Consent checkbox language (ready to implement):**

```
□ I agree to receive text messages from A&A Cleaning Services 
  regarding my service request and related updates. Message 
  frequency varies. Reply STOP to unsubscribe at any time. 
  Message and data rates may apply. This consent is not a 
  condition of purchasing any service.
```

The last sentence is legally important — TCPA requires that consent cannot be a condition of doing business. The checkbox must be unchecked by default.

---

### 2.3 CAN-SPAM Act — Commercial Email Compliance

**What it is:** Federal law governing commercial email messages. Enforced by the FTC. Penalties up to $51,744 per non-compliant email.

**Why it matters for A&A:**

The roadmap outlines extensive email automation:
- Lead acknowledgment emails (transactional — less restricted)
- Quote delivery emails (transactional)
- Lead follow-up sequences (marketing — fully regulated)
- Post-job follow-up and review requests (marketing)
- Client nurture sequences (marketing)
- Monthly newsletters (marketing)
- Re-engagement and win-back sequences (marketing)
- Hiring-related emails (not commercial — exempt)

The expansion document Section 40 defines four detailed email sequences and Section 67 provides complete email templates. The infrastructure uses Resend, which handles some compliance automatically (unsubscribe links in marketing emails) but the application must still meet requirements.

**How it maps to the existing roadmap:**

| Requirement | Roadmap Coverage | Gap |
|---|---|---|
| Don't use false or misleading header information | Covered by using real business email | Need to verify FROM address matches business identity |
| Don't use deceptive subject lines | Not specifically addressed | Review all automated email subject lines for accuracy |
| Identify the message as an ad | Not discussed | Marketing emails (newsletters, re-engagement, win-back) must be identifiable as commercial. Transactional emails about existing orders/services are exempt |
| Tell recipients where you're located | Not discussed | Every marketing email must include a physical postal address. P.O. Box is acceptable |
| Tell recipients how to opt out | Section 22.3 mentions unsubscribe in all marketing emails | Verify Resend templates include unsubscribe link. Verify the link works and actually unsubscribes |
| Honor opt-out requests promptly | Not verified | Must process within 10 business days. Verify the unsubscribe mechanism connects to the contact record and blocks future marketing sends |
| Monitor what others are doing on your behalf | Not applicable currently | Would apply if you use a marketing agency or email service that sends on your behalf |

**Specific risk for A&A's email sequences:**

The lead follow-up sequence (Section 67.3, Sequence 2) sends 3 emails over 10 days to someone who received a quote but didn't respond. The third email says "Closing out your request." This is commercial email — it's promoting the company's services. If that person didn't opt into marketing emails (they submitted a quote request, which is a business inquiry, not marketing consent), these follow-up emails could technically violate CAN-SPAM.

The distinction: the first email confirming their quote request is transactional. The subsequent "still thinking about it?" and "closing out" emails are marketing. The safest approach is to include the consent checkbox that covers both SMS and email, or to rely on the "existing business relationship" exception (they initiated a quote request, which creates a business relationship allowing follow-up for a reasonable period).

**Implementation plan:**

| Action | Effort | When |
|---|---|---|
| Verify all Resend email templates include physical address in footer | 1 hour | Day 7-10 content sprint |
| Verify unsubscribe link present and functional in all marketing email templates | 1-2 hours | Day 18-20 hardening |
| Add email consent alongside SMS consent on forms: "I agree to receive emails from A&A Cleaning Services about my request and related services. Unsubscribe at any time." | 30 min (add to same checkbox or separate checkbox) | Day 7-10 |
| Implement unsubscribe processing: link click → update contact record → block future marketing sends | 1-2 hours (if not handled by Resend automatically) | Day 18-20 |
| Review all automated email subject lines for accuracy | 30 min | Day 18-20 |
| Add marketing/transactional classification to all email templates | 1 hour | Day 18-20 |

**Total effort: ~4-6 hours, most overlapping with existing timeline.**

---

### 2.4 ADA Title III / WCAG 2.1 AA — Web Accessibility

**What it is:** ADA Title III prohibits discrimination based on disability in places of public accommodation. Federal courts have increasingly interpreted commercial websites as places of public accommodation. WCAG 2.1 AA is the technical standard that courts and the DOJ reference as the benchmark for web accessibility compliance.

**Why it matters for A&A specifically:**

This is covered extensively in the existing documents. Section 39 provides the full WCAG 2.1 AA checklist. The accessibility audit in the codebase review identified specific findings and remediation actions. I'm including it here for completeness in the framework map, but the existing coverage is strong.

**The specific risk that makes this Tier 1 rather than aspirational:**

ADA web accessibility lawsuits are filed at a rate of approximately 4,000 per year in the United States, with an increasing number targeting small businesses. Plaintiff law firms use automated scanning tools (commonly axe-core, the same tool recommended in your Section 39.3) to identify violations and file demand letters. The typical settlement for a small business is $5,000-$25,000 plus attorney fees and an agreement to remediate.

The three most commonly flagged automated violations are:
1. Insufficient color contrast — your gold color (#C9A94E) on white fails at 3.2:1 against the 4.5:1 requirement
2. Missing form labels — your forms are properly labeled (audit confirmed)
3. Missing alt text — your images have alt text (audit confirmed)

Fixing the gold contrast issue removes the primary automated scan target. The before/after slider keyboard support gap is the secondary finding. Together, these represent approximately 2-3 hours of remediation.

**How it maps to the existing roadmap:**

| Item | Status | Roadmap Reference |
|---|---|---|
| Semantic HTML | ✅ Complete | Audit confirmed throughout |
| Form accessibility | ✅ Complete | Audit confirmed labels, autocomplete, aria-live validation |
| Focus management | ✅ Complete | useFocusTrap, skip link, StatusAnnouncer, focus-visible |
| Color contrast | ❌ Gold color fails | Identified in accessibility audit, Codex prompt provided |
| Keyboard navigation | ⚠️ Mostly complete | Before/after slider lacks arrow key support. All other interactive elements keyboard-accessible |
| ARIA implementation | ✅ Complete | No conflicts, broken references, or deprecated roles |
| Reduced motion | ✅ Complete | CSS and JavaScript implementation |
| Screen reader compatibility | ⚠️ Needs spot-check | Infrastructure is correct, manual VoiceOver test recommended |
| Accessibility statement page | ❌ Missing | Section 39.4 specifies route and content |

**Implementation plan:**

Already integrated into the existing timeline:
- Gold contrast fix: Day 1 (Codex prompt provided in accessibility audit)
- Lang attributes, aria-live, aria-current: Days 2-3
- Slider keyboard support: Days 4-5
- axe-core and eslint-plugin-jsx-a11y integration: Days 4-5
- Manual keyboard/zoom/screen reader testing: Days 2-3
- Accessibility statement page: Day 7-10 content sprint

**Total effort: ~5-7 hours, already accounted for in timeline.**

---

### 2.5 Texas Data Breach Notification Law (Business and Commerce Code §521.053)

**What it is:** Texas state law requiring businesses to notify affected individuals within 60 days of discovering a breach involving sensitive personal information. If the breach affects 250+ Texas residents, the Texas Attorney General must also be notified.

**Why it matters for A&A specifically:**

The platform stores "sensitive personal information" as defined by Texas law: an individual's first name or initial and last name combined with any of the following: Social Security number, driver's license or government ID number, financial account numbers, or information that identifies an individual's physical or mental health condition or treatment.

Currently, the platform stores names + phone numbers + email addresses + physical addresses. This meets the threshold for breach notification. If the expansion roadmap's workforce development section (19) is implemented with I-9 and W-4 tracking (which includes SSN), the sensitivity level increases substantially.

Additionally, building access codes, while not explicitly listed in the statute, could create liability under other legal theories (negligence, breach of duty of care) if their exposure leads to property crime.

**How it maps to the existing roadmap:**

Section 48.3 covers data breach protocol and mentions the 60-day Texas notification requirement. This is solid coverage with one gap: the section doesn't reference the specific statute number, which matters if you ever need to actually execute the protocol. The AG notification threshold (250+ residents) isn't mentioned.

**Implementation plan:**

| Action | Effort | When |
|---|---|---|
| Add statute reference (§521.053) to Section 48.3 | 15 min | Documentation update |
| Add AG notification threshold (250+ Texas residents) | 15 min | Documentation update |
| Document what constitutes "sensitive personal information" under Texas law as it applies to data currently in the system | 30 min | Documentation update |
| Create a breach notification template letter that meets statutory requirements | 1 hour | Pre-launch documentation, not code |
| Determine whether cyber liability insurance is warranted (it covers breach notification costs, legal defense, and regulatory fines — typical cost for a small business: $500-$1,500/year) | Research | Discuss with mom and insurance broker within first 90 days |

**Total effort: ~2 hours of documentation. No code changes.**

---

### 2.6 CIS Controls v8 — Implementation Group 1

**What it is:** The Center for Internet Security's prioritized set of cybersecurity controls. Unlike OWASP (which focuses on application code), CIS covers the entire operational security posture: devices, accounts, software, data, configurations, access, logging, email, and recovery. Implementation Group 1 (IG1) is specifically designed for small businesses and organizations with limited IT resources. It contains 56 safeguards considered essential cyber hygiene.

**Why CIS IG1 is the most practically relevant framework after OWASP for your situation:**

OWASP tells you how to build the application securely. CIS tells you how to operate it securely. The distinction matters because the platform doesn't exist in isolation — it runs on services (Vercel, Supabase, Twilio, Resend, GitHub, Anthropic, Upstash), accessed from devices (mom's phone, your laptop, crew members' phones), managed through accounts (Vercel dashboard, Supabase dashboard, domain registrar, DNS provider), and integrated with external systems (QuickBooks, Google Business Profile API in the future).

A perfectly secure application deployed on a Vercel account with a weak password and no MFA is compromised as soon as someone guesses or phishes that password. A perfectly secure database accessed through a Supabase dashboard that your mom shares credentials for with a future office manager who leaves the company is compromised the day that person is terminated if the password isn't changed.

CIS IG1 addresses these operational security gaps that OWASP doesn't touch.

**How it maps to the existing roadmap and codebase:**

I'm selecting the CIS IG1 safeguards that are relevant to a cloud-hosted web application run by a small team. Some IG1 safeguards (like hardening enterprise firewalls or managing on-premises servers) don't apply because Vercel and Supabase handle that infrastructure.

| CIS Control | Safeguard | Current State | Relevance to A&A | Action |
|---|---|---|---|---|
| **1.1** Establish and maintain detailed enterprise asset inventory | Not documented | Medium — you need to know what devices access the system. Mom's phone, your laptop, crew phones accessing employee portal, any computer accessing admin dashboard | Document all devices that access the platform. Not a formal CMDB — a simple list. Include: device type, owner, what it accesses (admin, employee portal, public site admin functions), last known OS version |
| **2.1** Establish and maintain a software inventory | Implicitly known through package.json and services list | Low — the stack is well-documented in the blueprint | Run `npm list --depth=0` and save as reference. Document all SaaS services with account owner and access level |
| **2.7** Allowlist authorized software | Not applicable | N/A for cloud-hosted platform | Skip |
| **3.1** Establish and maintain a data management process | Section 30 covers data classification and retention | High — access credentials, employee PII, and client PII are in the system | Verify Section 30 retention policies are implemented in code (auto-purge of access credentials 30 days post-job is recommended but not implemented) |
| **3.4** Enforce data retention | Recommended in Section 30 | High — access codes should be auto-purged. Marketing data should roll off. OSHA records have 5-year retention requirement | Implement auto-purge for access credentials. Set up scheduled database cleanup for expired data categories |
| **3.6** Encrypt data on end-user devices | Supabase data encrypted at rest. Photos in Supabase Storage encrypted at rest. Offline photo queue uses IndexedDB on employee phones | Medium — if an employee's phone is stolen with the offline photo queue containing photos of a client's property, that data is accessible | IndexedDB is not encrypted by default. For the offline photo queue, this is acceptable risk — the photos are of cleaning work, not sensitive documents. If access codes are ever cached offline (they shouldn't be), encryption would be critical |
| **4.1** Establish and maintain a secure configuration process | Environment validation on startup. But no documentation of what "secure" looks like for each service | High — Vercel, Supabase, Twilio, Resend, GitHub all have security-relevant settings | Document the secure configuration for each service (see implementation table below) |
| **4.7** Manage default accounts on enterprise assets | Not discussed | Medium — does Supabase have a default admin account? Does the seeded data create any default credentials? | Verify no default or well-known credentials exist in any service. Change any default admin passwords |
| **5.1** Establish and maintain an inventory of accounts | Not documented | **High — this is a significant operational security gap.** When you count all accounts across all services, there are 10-15 accounts that can affect the platform. If mom's email is compromised, the attacker potentially has access to Vercel (deployment), Supabase (database), domain registrar (DNS), Google Workspace (email), QuickBooks (financial data), and more — especially if she uses the same password | Create a master account inventory (see below) |
| **5.2** Use unique passwords | Not discussed | **High** — same concern as above. One password reused across services means one breach compromises everything | Recommend password manager (1Password or Bitwarden — both have free tiers). Generate unique passwords for every service. Store Vercel, Supabase, domain, and all service credentials in the password manager |
| **5.3** Disable dormant accounts | Not discussed | Medium for now — becomes high when employees leave | Implement account deactivation procedure: when an employee is terminated, immediately disable their Supabase auth account, revoke active sessions. For subcontractor accounts (future): disable on contract end |
| **5.4** Restrict administrator privileges | Admin access is binary (admin role in profiles table) | Medium — only one admin now. Becomes high when ops manager or bookkeeper added | Section 25 RBAC model is well-designed but not implemented. When adding roles, ensure principle of least privilege: ops manager doesn't need system configuration access, bookkeeper doesn't need employee management |
| **6.3** Require MFA for externally-exposed applications | **Not implemented** | **High — this is the single most impactful security improvement available.** The admin dashboard is externally accessible and controls the entire business. A compromised admin password without MFA = full access to client data, employee data, financial data, and building access codes | Enable Supabase Auth MFA (TOTP) for admin accounts. This is a 30-minute configuration, not a development project. Also enable MFA on: Vercel account, GitHub account, Supabase dashboard account, domain registrar, QuickBooks, and any email account used for password resets |
| **6.5** Require MFA for remote management | Same as above for dashboard-level access | **High** | Same actions as 6.3 plus: enable MFA on any service dashboard that can modify the platform (Vercel, Supabase, Twilio, Resend, Upstash) |
| **7.1** Establish and maintain a vulnerability management process | Not implemented | Medium — npm audit and Dependabot | Enable Dependabot. Run npm audit before every deployment. Establish SLA: critical CVEs patched within 48 hours, high within 1 week |
| **8.2** Collect audit logs | Operational logging exists (notifications). No security audit logging | High — when the platform handles real data, you need to know who accessed what and when | Implement security_events table per OWASP A09 recommendations |
| **8.5** Collect detailed audit logs | Same gap | Medium for now, high when multiple admins exist | Admin action audit trail (who changed what lead/quote/job/employee record, when, from what IP) |
| **11.1** Establish and maintain a data recovery process | Section 31 covers backup frequency | High — but never tested | Test a Supabase backup restore. Verify the process works before you need it in an emergency. Document recovery steps |
| **11.2** Perform automated backups | Supabase Pro plan includes daily automated backups | Medium — verify this is actually happening on your Supabase plan tier | Log into Supabase dashboard, confirm backup is enabled and running. Check the most recent backup date |
| **11.4** Establish and maintain an isolated instance of recovery data | Not discussed | Low for now | Supabase backups are stored by Supabase. If Supabase itself has a catastrophic failure, those backups may be affected. For critical data, consider periodic manual export to a separate storage location. Not urgent — flag for when the platform is the primary business system |
| **14.1** Establish and maintain a security awareness program | Not discussed | **Medium — specifically for mom.** She's the admin with full access to everything. If she clicks a phishing link, uses a weak password, or shares credentials with a future employee without understanding the risk, the security investment in the platform is bypassed entirely | 15-minute conversation with mom covering: use a password manager, never share your login, recognize phishing (suspicious emails asking to log in), enable MFA on your phone. This isn't a formal training program — it's a family conversation about digital safety that happens to protect the business |

**Master account inventory to create:**

This is the CIS 5.1 safeguard — know what accounts exist and who has access. For A&A's platform:

| Service | Account Email | Who Has Access | MFA Enabled | What It Controls |
|---|---|---|---|---|
| Vercel | ? | You | ? | Deployment, environment variables, domains |
| Supabase | ? | You | ? | Database, storage, auth users, API keys |
| GitHub | ? | You | ? | Source code, CI/CD triggers |
| Domain registrar (Namecheap, GoDaddy, etc.) | ? | You / Mom | ? | DNS, domain ownership |
| Twilio | ? | You | ? | SMS sending, phone numbers |
| Resend | ? | You | ? | Email sending, domain authentication |
| Anthropic | ? | You | ? | AI assistant API access |
| Upstash | ? | You | ? | Rate limiting, Redis |
| Google (GBP, Analytics, Search Console, Ads) | ? | You / Mom | ? | Business listing, analytics, advertising |
| QuickBooks | ? | Mom | ? | Financial data, invoicing |
| OpenAI (if used) | ? | You | ? | API access |
| Meta (Facebook, Instagram) | ? | Mom | ? | Social media, advertising pixel |
| Indeed | ? | Mom / You | ? | Job listings |
| 1Password/Bitwarden | ? | You / Mom | ? | All other passwords |
| Email (Outlook / future domain email) | ? | Mom | ? | Password resets for everything above |

**Fill this out and store it in the password manager. Review it quarterly. When anyone who has access to any of these services leaves the organization (including future contractors, future office managers, even you if your involvement changes), rotate the credentials for every service they accessed.**

**Total CIS IG1 implementation effort:**

| Category | Effort | When |
|---|---|---|
| Documentation (account inventory, device inventory, configuration baselines) | 3-4 hours | Pre-launch week |
| MFA enablement across all services | 1-2 hours | Day 1 — highest ROI security action |
| Password manager setup and credential migration | 1-2 hours | Day 1 |
| Security conversation with mom | 15 min | Day 6 (during the mom conversation already planned) |
| Backup restore test | 1-2 hours | Day 18-20 pre-launch hardening |
| Dependency management (Dependabot, npm audit) | 30 min | Day 1 |

**Total: ~7-10 hours, partially overlapping with existing timeline.**

---

### 2.7 Texas Sales Tax Compliance

**What it is:** Texas imposes sales tax on cleaning services. The current combined rate in Austin is 8.25%. Cleaning companies must collect sales tax on taxable services and remit it to the Texas Comptroller quarterly (or monthly if collections exceed thresholds).

**Why it matters for A&A:**

Section 15.5 of the expansion roadmap flags this: "Texas sales tax collection on cleaning services — Required. Not addressed in platform." This is correct. Cleaning services are taxable in Texas with limited exceptions.

This isn't a security framework, but it's a compliance requirement that directly affects the platform's invoicing functionality and the QuickBooks integration. If the platform generates invoices or syncs invoice data to QuickBooks, the tax calculation needs to be correct.

**How it maps to the existing roadmap:**

| Item | Roadmap Coverage | Gap |
|---|---|---|
| Tax rate application on invoices | Section 17.1 mentions "Texas sales tax (8.25% in Austin) applied to taxable services" as missing | No tax calculation in quote builder or invoice generation. QuickBooks may handle this if invoices are created there, but if the platform generates invoice data that syncs to QB, the tax needs to be calculated correctly |
| Tax-exempt clients | Not discussed | Some institutional clients (government entities, certain nonprofits) may be tax-exempt. The client record should have a tax-exempt flag with certificate number |
| Filing schedule | Section 42 compliance calendar includes quarterly Texas sales tax filing | Calendar entry exists but no platform support for calculating the filing amount |
| Combined rate accuracy | Not discussed | The 8.25% rate is Austin-specific (6.25% state + 2% local). If mom works in Round Rock (8.25%), Cedar Park (8.25%), Georgetown (8.25%), Pflugerville (8.25%), the rates happen to be the same, but other Texas cities may differ. The rate should be configurable, not hardcoded |

**Implementation plan:**

| Action | Effort | When |
|---|---|---|
| Add tax_rate field to quote/invoice configuration (default 8.25%) | 30 min | When quote builder is enhanced (Tier 3, days 30-90) |
| Display tax as separate line item on quotes and invoices | 1-2 hours | Same timeframe |
| Add tax_exempt flag to client records | 30 min | When client directory is enhanced |
| Verify QuickBooks tax handling — does QB calculate tax, or does the platform need to? | 1-2 hours investigation | When QB integration is verified end-to-end (existing Tier 2 priority) |

**Total effort: ~3-5 hours, correctly deferred to post-launch.**

---

### 2.8 OSHA Compliance — Occupational Safety and Health

**What it is:** Federal workplace safety standards enforced by the Occupational Safety and Health Administration. OSHA can audit any commercial cleaning operation without notice. Violations carry penalties up to $16,131 per violation (serious) or $161,323 per violation (willful/repeat).

**Why this is uniquely relevant for post-construction cleaning:**

Section 15.1 of the expansion roadmap nails this: "Post-construction cleaning is one of the highest-risk commercial cleaning verticals (silica dust, debris, chemical exposure, elevation work, active construction zones)." When mom's crew works on a construction site, OSHA's construction standards (29 CFR 1926) apply, not just general industry standards.

General contractors are increasingly requiring subcontractors (including cleaning crews) to demonstrate OSHA compliance before allowing them on-site. This is both a safety requirement and an insurance requirement — the GC's workers' comp insurer may require all site workers to have OSHA training.

**How it maps to the existing roadmap:**

Section 15 is the most comprehensive treatment of safety compliance in the entire document set. It covers:
- Employee-facing safety requirements (hazard briefings, PPE checklists, SDS access, incident reporting, near-miss reporting, training acknowledgment) — all listed as missing
- Admin-facing safety management (OSHA 300 log, incident investigation, training records, workers' comp tracking, equipment inspection, chemical inventory, safety audit) — all listed as missing
- The entire section is triaged to "Archive — reactivate when pursuing institutional contracts or CIMS certification, or when crew exceeds 20"

**My assessment of that triage:**

The triage is partially wrong. The full safety management system described in Section 15 is correctly deferred — it's enterprise-grade. But three specific OSHA requirements apply from day one if she sends crews to construction sites:

1. **Hazard Communication (HazCom/GHS):** If the crew uses any hazardous chemicals (degreasers, adhesive removers, concrete residue removers — all standard for post-construction cleaning), the company must maintain Safety Data Sheets for every chemical, train employees on chemical hazards, and have a written HazCom program. This isn't optional. It's one of OSHA's most frequently cited violations.

2. **Personal Protective Equipment (PPE):** The employer must assess workplace hazards, determine required PPE, provide it, and train employees on its use. For construction site cleaning: hard hats (if required by the GC's site rules), safety glasses, gloves, respiratory protection for dust-generating activities. This is also non-optional.

3. **OSHA 300 Log:** Any employer with 11+ employees must maintain OSHA injury/illness records. With a 10-person crew, mom is right at the threshold. If she hires one more person, the logging requirement activates. Even below 11, if a serious injury occurs (hospitalization, amputation, loss of an eye), OSHA must be notified within 24 hours for hospitalization and 8 hours for fatality.

**Revised implementation plan:**

| Action | Effort | When | Priority |
|---|---|---|---|
| Confirm mom has SDS for every chemical currently in use | Mom does this — 1-2 hours to compile | Pre-launch (this is an existing legal requirement, not a platform feature) | **High — existing legal obligation** |
| Add SDS document storage to the platform (simple file upload linked to chemical inventory items) | 2-3 hours | Post-launch month 2-3, when inventory module is enhanced | Medium |
| Confirm PPE is provided for construction site work | Mom does this — verify with her | Pre-launch conversation (Day 6) | **High — existing legal obligation** |
| Add incident reporting form to employee portal (safety-specific, separate from general issue reporting) | 1-2 days | Post-launch month 2-3 | Medium |
| OSHA 300 log tracking in admin | 2-3 days | Activate when crew exceeds 10 or when pursuing CIMS | Low for now |
| OSHA training tracking (10-hour and 30-hour course completion per employee) | 1-2 days | Activate when GCs require it as condition of site access | Medium |

**Add to the "Tell Mom This Week" list (Section 64):**

```
8. "Do you have Safety Data Sheets for all the cleaning 
   chemicals your crew uses? OSHA requires it and a GC could 
   ask for them. If not, we need to compile them — most 
   manufacturers have SDS documents on their websites."

9. "Does the crew have hard hats and safety glasses for 
   construction sites? If a GC requires them and your crew 
   doesn't have them, they can't work that day."
```

---

## 3. Tier 2: First-Year Priorities

These frameworks become relevant as the business grows beyond launch stage. Each has a specific activation trigger.

---

### 3.1 PCI DSS — Payment Card Industry Data Security Standard

**What it is:** Security standard required for any organization that accepts, processes, stores, or transmits credit card data. Maintained by the PCI Security Standards Council (founded by Visa, Mastercard, Amex, Discover, JCB).

**Activation trigger:** Stripe integration goes live (expansion roadmap Tier 4, days 90-180).

**Why it matters for A&A:**

Section 17.1 identifies online invoice payment via Stripe as a Tier 4 feature. When this is implemented, PCI DSS applies. The good news: if implemented correctly using Stripe Checkout or Stripe Elements, A&A qualifies for PCI SAQ A (Self-Assessment Questionnaire A), which is the simplest compliance level because card data never touches your server.

**What SAQ A requires:**

| Requirement | How to Comply |
|---|---|
| Card data never stored, processed, or transmitted by your server | Use Stripe Checkout (hosted payment page) or Stripe Elements (client-side tokenization). Never build a custom form that handles raw card numbers |
| All pages that include a payment form are served over HTTPS | ✅ Vercel enforces HTTPS |
| Vulnerability management: keep systems patched | npm audit, Dependabot (already recommended) |
| Access control: restrict access to payment-related admin functions | Role-based access (Section 25) — bookkeeper role has invoice access |
| Incident response plan for payment data compromise | Section 48 covers this — add a specific payment data section |
| Annual self-assessment | 15-minute questionnaire completed annually. No audit required for SAQ A |

**What NOT to do:**

| Anti-Pattern | Risk |
|---|---|
| Build your own payment form that collects card numbers | Moves you from SAQ A to SAQ D — 329 requirements instead of 22 |
| Log any Stripe API responses that contain card data | PCI violation — card data in your logs means it's "stored" |
| Store card numbers in your database "for convenience" | Immediate PCI violation, potential fines from card networks |
| Use Stripe in test mode and forget to switch to live | Technically not a PCI issue but will result in failed real charges |

**Implementation plan:**

| Action | Effort | When |
|---|---|---|
| Use Stripe Checkout (redirect to Stripe-hosted page) for initial implementation — simplest and most secure | 2-3 days (per existing estimate) | Tier 4, days 90-180 |
| Verify no card data in server logs or Sentry after Stripe integration | 1 hour | Immediately after Stripe goes live |
| Complete SAQ A self-assessment | 1 hour | Within 30 days of Stripe going live |
| Add PCI compliance note to privacy policy | 30 min | When Stripe goes live |

---

### 3.2 OWASP API Security Top 10 (2023)

**What it is:** OWASP's specialized list of the top 10 security risks specific to APIs. Separate from the general OWASP Top 10 because APIs have different attack surfaces and patterns.

**Activation trigger:** When the platform has multiple API consumers (admin dashboard, employee portal, client portal, potentially mobile apps) and the API surface area grows beyond the current ~12 routes.

**Why it's relevant:**

The platform is fundamentally API-driven. Every action in the admin dashboard and employee portal makes API calls to Next.js API routes. The current architecture has approximately 12+ API routes handling lead creation, quote management, job management, employee assignments, notifications, QuickBooks sync, AI assistant, and employment applications.

As the platform grows (client portal, Stripe webhooks, GBP API integration, subcontractor portal), the API surface expands. Each new route is a potential attack vector.

**Key risks specific to A&A's API architecture:**

| API Risk | Relevance | Current State |
|---|---|---|
| **API1: Broken Object Level Authorization** | **High.** Can Employee A fetch Employee B's job assignment by guessing the ID? Can a client access another client's quote by manipulating the token? | RLS should prevent this at the database level, but no testing has confirmed it works end-to-end through the API |
| **API2: Broken Authentication** | **Medium.** APIs rely on Supabase session tokens. | If a token is stolen (XSS, network sniffing on non-HTTPS, etc.), the attacker has full session access. HTTPS is enforced (Vercel), so network sniffing isn't a risk. XSS is the primary token theft vector — CSP headers mitigate this |
| **API3: Broken Object Property Level Authorization** | **Medium.** Does the jobs API return internal notes visible to employees? Does the employee profile API return pay rates visible to other employees? | Need to audit each API route for over-exposure of fields |
| **API4: Unrestricted Resource Consumption** | **Addressed for public routes** (rate limiting). **Not addressed for authenticated routes.** | A compromised admin session could make thousands of API calls rapidly. Authenticated rate limiting should be added |
| **API5: Broken Function Level Authorization** | **Addressed by middleware.** | Role checking in middleware should prevent employees from calling admin routes. Needs explicit testing |
| **API6: Unrestricted Access to Sensitive Business Flows** | **Medium.** The quote acceptance flow is a sensitive business flow — accepting a quote creates a binding business commitment. | Token-based access with signed tokens. But what prevents someone from accepting a quote multiple times? What about replay attacks on the acceptance endpoint? |
| **API7: Server Side Request Forgery** | **Low.** Few scenarios where the API fetches external URLs from user input. | Anthropic API call with user content is the closest vector. Low probability |
| **API8: Security Misconfiguration** | **Addressed partially.** Env validation on startup. | Missing: CORS policy, API response headers, error message detail (do 500 errors expose stack traces?) |
| **API9: Improper Inventory Management** | **Low risk currently** (small API surface). | No deprecated or shadow API routes. Will become relevant as API grows |
| **API10: Unsafe Consumption of APIs** | **Medium.** The platform consumes: Supabase API, Twilio API, Resend API, Anthropic API, QuickBooks API. | If any of these return unexpected data, does the platform handle it safely? What if Anthropic returns malicious content through the AI assistant that gets rendered in the admin dashboard? |

**Implementation plan:**

| Action | Effort | When |
|---|---|---|
| IDOR testing on all API routes (API1) | 2-3 hours | Days 2-3 testing phase (already in plan) |
| Audit each API route for field over-exposure (API3) | 2-3 hours | Days 2-3 testing phase |
| Add authenticated rate limiting (API4) | 2-3 hours | Post-launch month 1-2 |
| Verify error responses don't expose stack traces in production (API8) | 1 hour | Day 18-20 pre-launch hardening |
| Verify CORS is restrictive (API8) | 30 min | Day 1 (configuration check) |
| Sanitize Anthropic API responses before rendering (API10) | 1-2 hours | Day 4-5 bug fix sprint (should be part of AI assistant review) |

---

### 3.3 NIST Cybersecurity Framework (CSF) 2.0

**What it is:** The National Institute of Standards and Technology's cybersecurity framework. Organized around six core functions: Govern, Identify, Protect, Detect, Respond, Recover. It's not a certification — it's a maturity model for assessing and improving cybersecurity posture.

**Activation trigger:** First security incident or near-miss. Or when pursuing contracts that require demonstrating cybersecurity practices.

**Why it's relevant:**

NIST CSF is the framework that institutional clients and sophisticated property management companies may reference when evaluating vendors. They probably won't ask "Are you NIST CSF compliant?" but they may ask questions that map to NIST functions: "How do you protect client data? What happens if there's a breach? How do you detect unauthorized access?"

More practically, NIST CSF is useful as a self-assessment framework for understanding where your security maturity actually is versus where you think it is.

**Current maturity assessment against NIST CSF functions:**

| Function | What It Asks | Current Maturity | Where to Improve |
|---|---|---|---|
| **Govern** | Do you have security policies, roles, and oversight? | **Level 1 (Partial)** — No formal security policies. No defined security roles. Security is implicit in architectural decisions, not explicitly governed. Owner (mom) is unaware of security practices beyond locking her phone. | Write a 1-page security policy covering: password requirements, MFA requirement for admin accounts, acceptable use of the platform, incident reporting procedure. Keep it simple enough that mom and future employees can understand it. This is a document, not a code change |
| **Identify** | Do you know what you need to protect and what threatens it? | **Level 2 (Risk-Informed)** — Data classification exists (Section 30). Asset inventory partially documented in blueprint. No formal threat model. No risk assessment. | Create the account inventory (CIS 5.1). Document the threat actors and their motivations (competitor, disgruntled employee, external attacker, serial litigant). This takes 1-2 hours and dramatically improves your security decision-making |
| **Protect** | Do you have controls to prevent security events? | **Level 3 (Repeatable)** — This is the strongest function. RLS, middleware auth, rate limiting, encryption in transit, input validation, role-based access design. Access credential encryption is recommended but not implemented. MFA not enabled. Security headers not set. | The OWASP and CIS remediation items address this. After those items, Protect will be at Level 3-4 |
| **Detect** | Can you identify security events when they occur? | **Level 1 (Partial)** — Sentry catches application errors but not security events. No security logging. No anomaly detection. No failed login alerting. If someone is slowly exfiltrating client data through the API, there's no mechanism to detect it. | Security event logging table (per OWASP A09 recommendations). Alert on failed login spikes and rate limit hits. This is a post-launch priority |
| **Respond** | Do you have a plan for security events? | **Level 2 (Risk-Informed)** — Section 48 covers incident response with severity classification, response protocol, and data breach procedures. Not tested. No tabletop exercises. No communication templates prepared. | Test the incident response plan with a tabletop exercise (30-minute conversation: "What do we do if X happens?"). Prepare draft notification email for breach scenario. Post-launch month 3-6 |
| **Recover** | Can you restore operations after a security event? | **Level 2 (Risk-Informed)** — Section 31 covers disaster recovery with manual fallbacks. Supabase backups exist but haven't been tested. Code is in GitHub (always recoverable). | Test backup restore. Document recovery procedure step-by-step. Post-launch month 1-2 |

**This assessment means:** The platform has strong protection controls but weak detection and governance. This is extremely common for small business applications built by developers — security effort goes into preventing breaches (Protect) but not into detecting them when they occur (Detect) or having organizational structures to manage security (Govern). The Protect investment is the right first priority, but Detect should be the next investment after launch stabilization.

---

### 3.4 Employment Law Compliance — FLSA, TWC, I-9

**What it is:** Federal and Texas state employment law requirements. The Fair Labor Standards Act (FLSA) governs minimum wage, overtime, and recordkeeping. The Texas Workforce Commission (TWC) administers state employment law including unemployment insurance and wage claims. I-9 verification confirms employment eligibility.

**Why it matters for A&A specifically:**

This isn't a technology framework — it's an employment compliance area that the platform directly supports (or fails to support). The expansion roadmap (Section 15.5) flags TWC compliance as required and I-9/W-4 tracking as missing. Section 19 covers workforce development including onboarding workflows. Section 42 includes TWC quarterly wage reports in the compliance calendar.

**The platform's role in employment compliance:**

The platform captures employment application data that includes work authorization status and consent for background checks. It tracks job assignments and hours (when time tracking is implemented). It will eventually prepare payroll data (Section 17.5). Each of these functions intersects with employment law:

| Requirement | Platform Relevance | Current State | Action |
|---|---|---|---|
| **I-9 completion within 3 business days of hire** | The hiring inbox moves applicants through statuses but doesn't track I-9 completion | Missing | Add I-9 status tracking to onboarding checklist (Section 19.1). Not an in-platform I-9 form — just a checklist item: "I-9 completed? Date: ___" |
| **FLSA overtime calculation** | When time tracking is implemented, the platform will calculate hours per employee per pay period. FLSA requires overtime (1.5x) for hours over 40/week for non-exempt employees. Cleaning technicians are non-exempt. | Time tracking is missing entirely (Tier 4 feature) | When time tracking is built, overtime calculation must be automatic. Display regular and OT hours separately. This is a core requirement of the time tracking feature, not an add-on |
| **TWC quarterly wage reporting** | TWC requires quarterly reports of wages paid to each employee. The platform should produce this data. | Missing — handled through QuickBooks/payroll provider currently | Flag as a requirement when payroll data preparation (Section 17.5) is implemented |
| **Employee classification** | If mom uses subcontractors (Section 29), misclassifying employees as independent contractors carries severe penalties. Texas and federal law have specific tests for employment vs contractor status. | The subcontractor management framework (Section 29) exists but doesn't address classification law | Add a note to Section 29: before using any subcontractor, verify they meet the IRS 20-factor test and Texas common-law test for independent contractor status. Misclassification penalties: back taxes + penalties + interest + potential FLSA violations for unpaid overtime. This is a legal determination, not a platform feature, but the platform should flag it |
| **Wage and hour recordkeeping** | FLSA requires employers to keep records of hours worked, wages paid, and overtime for 3 years. The platform should either produce these records or integrate with the system that does. | Missing — depends on time tracking and payroll integration | When time tracking is built, ensure records are exportable and retained for 3+ years |
| **Minimum wage compliance** | Texas minimum wage is $7.25/hr (federal floor). Austin has no local minimum wage ordinance. A&A's documented pay ranges ($16-$28/hr) are well above minimum wage. | Not a platform feature — but pay rates should be tracked in employee profiles | Section 19.4 career progression framework includes pay rates per tier. When implemented, the system could flag if any rate is set below minimum wage |

**Implementation plan:**

| Action | Effort | When |
|---|---|---|
| Add I-9 completion checkbox to onboarding checklist in admin | 30 min (when onboarding is built) | Post-launch month 2-3 (Section 19.1 implementation) |
| Include overtime logic in time tracking specification | Architecture decision (not separate effort) | When time tracking is built (Tier 4) |
| Add employment law classification note to subcontractor management spec | 30 min documentation | When Section 29 is activated |
| Discuss worker classification with mom | 15 min conversation | Day 6 mom conversation — add to question list: "Are any of your current workers paid as 1099 contractors? Do they set their own schedules and use their own equipment, or do you direct their work?" |

---

### 3.5 EPA and Texas Environmental Regulations

**What it is:** Environmental Protection Agency regulations and Texas Commission on Environmental Quality (TCEQ) rules governing chemical usage, waste disposal, and environmental impact.

**Activation trigger:** Already applicable if mom uses any chemicals regulated under EPA/TCEQ. Becomes more relevant for post-construction cleaning involving lead paint (EPA RRP Rule) and for power washing (stormwater discharge).

**Specific relevance to A&A's services:**

| Regulation | Applicability | Current Coverage | Gap |
|---|---|---|---|
| **EPA RRP Rule (Lead Renovation, Repair, and Painting)** | If cleaning pre-1978 buildings where lead paint is disturbed. Austin has many older buildings, especially in East Austin, downtown, and near UT campus. Post-construction renovation of these buildings may disturb lead paint, and the subsequent cleanup is regulated. | Section 15.5 flags this as applicable. Triaged to Archive. | If mom's crew does post-construction cleanup in pre-1978 buildings, the firm or at least one crew member needs EPA RRP certification. The platform should track this certification with expiration date. Add to the pre-launch mom conversation: "Do you ever clean in buildings built before 1978? After renovations?" |
| **Stormwater discharge (power washing)** | Power washing discharge enters storm drains. Many Austin areas have restrictions on what chemicals can enter stormwater. The City of Austin has specific stormwater quality regulations. | Not discussed anywhere in the documents | If power washing is an active service, mom needs to know: no untreated chemical discharge to storm drains. Use containment and recovery for chemical runoff. This is a crew training issue, not a platform feature |
| **Chemical waste disposal** | Concentrated cleaning chemicals cannot be dumped down regular drains. Containers must be disposed of properly. | Not discussed | Add to SDS management: disposal instructions per chemical. Crew training on proper disposal |

**Implementation plan:**

| Action | Effort | When |
|---|---|---|
| Ask mom about pre-1978 building work in Day 6 conversation | 5 min | Day 6 |
| If applicable, add EPA RRP certification tracking to employee/company credential management | 30 min (when credential tracking exists) | When Section 45 certifications are activated |
| Add stormwater note to power washing SOP | 15 min documentation | When SOPs are built (Section 20.4) |

---

## 4. Tier 3: Growth-Stage Considerations

These frameworks become relevant at specific business milestones. None require action before launch or in the first 6 months unless a specific trigger fires early.

---

### 4.1 SOC 2 Type I/II — Trust Services Criteria

**What it is:** An auditing framework by the AICPA evaluating controls across Security, Availability, Processing Integrity, Confidentiality, and Privacy. SOC 2 Type I assesses control design at a point in time. Type II assesses control effectiveness over a period (typically 6-12 months).

**Activation trigger:** Revenue exceeds $500K annually, or A&A pursues institutional contracts (hospitals, universities, government buildings, corporate campuses) where vendor security

### 4.1 SOC 2 Type I/II — Trust Services Criteria (continued)

**Activation trigger:** Revenue exceeds $500K annually, or A&A pursues institutional contracts (hospitals, universities, government buildings, corporate campuses) where vendor security assessments are part of the procurement process.

**Why it matters at that stage:**

Institutional clients don't just ask "do you clean well?" They ask "how do you handle our data, who has access to our building codes, what happens if your system is breached, and can you prove your controls work?" SOC 2 is the standard framework for answering those questions with third-party verification.

The cost of a SOC 2 audit ($20K-$50K for Type I, $30K-$75K for Type II annually) is only justified when the contracts it enables are large enough to absorb the cost. A single hospital system cleaning contract worth $100K+/year justifies the investment. A portfolio of $2K-$5K apartment turnover jobs does not.

**What the current architecture already provides toward SOC 2 readiness:**

| SOC 2 Trust Criteria | What Exists | What Would Be Needed |
|---|---|---|
| **Security** | RLS, middleware auth, rate limiting, encryption in transit, signed tokens, role-based access design | Formalized security policies (written documents, not just code). MFA enforced. Security event logging. Vulnerability management process. Annual penetration test. Documented access control procedures |
| **Availability** | Vercel and Supabase provide infrastructure availability SLAs. Disaster recovery plan exists (Section 31). Manual fallback procedures documented | Uptime monitoring with SLA tracking. Tested backup and recovery procedures. Capacity planning documentation. Incident response tested annually |
| **Processing Integrity** | Business logic validation (scheduling conflicts, dedup, quote lifecycle enforcement). QA workflow for job completion | Documented data processing procedures. Error handling and correction processes. Reconciliation between platform data and QuickBooks |
| **Confidentiality** | Data classification (Section 30). Access credential security recommendations. Employee-scoped data access | Confidentiality policies signed by all employees with system access. Encryption of confidential data at rest (access codes, financial data). Data retention enforcement (auto-purge) |
| **Privacy** | Privacy policy exists on website. Data collection disclosed in forms | Formal privacy impact assessment. Data subject access and deletion procedures. Privacy training for employees who handle PII |

**The architectural advantage:** Supabase and Vercel both maintain their own SOC 2 compliance. When A&A undergoes a SOC 2 audit, the infrastructure controls are covered by Supabase's and Vercel's SOC 2 reports (you include their reports as "complementary user entity controls"). This dramatically reduces the scope of your audit — you only need to demonstrate your application-level and organizational controls, not infrastructure controls.

**Implementation plan:**

This is a 6-12 month preparation project when the trigger fires. The roadmap doesn't need to change — but document this note:

```
SOC 2 Readiness Note:
When pursuing institutional contracts or when revenue exceeds 
$500K, begin SOC 2 preparation:

1. Engage a SOC 2 readiness assessment firm ($3K-$8K) to 
   identify gaps
2. Implement required organizational controls (policies, 
   training, procedures) — 3-6 months
3. Implement remaining technical controls (security logging, 
   vulnerability scanning, encryption enhancements) — 
   concurrent with organizational controls
4. Operate under new controls for observation period (Type I: 
   point-in-time, Type II: 6-12 months)
5. Engage audit firm for examination ($20K-$50K for Type I)

Timeline from decision to Type I report: 6-9 months
Timeline from decision to Type II report: 12-18 months

The current platform architecture is SOC 2-friendly. No 
architectural redesign would be needed. The gap is primarily 
organizational (policies, procedures, training) not technical.
```

---

### 4.2 ISO 27001 — Information Security Management System

**What it is:** International standard for establishing, implementing, maintaining, and continually improving an information security management system (ISMS). Certification requires a formal audit by an accredited certification body.

**Activation trigger:** Revenue exceeds $1M annually, or pursuing government or enterprise contracts where ISO 27001 is a procurement requirement, or considering the platform-as-product franchise model (Section 38).

**Why it's different from SOC 2:**

SOC 2 is a North American standard that evaluates whether your controls work. ISO 27001 is an international standard that evaluates whether you have a systematic process for managing information security. SOC 2 asks "are your controls effective?" ISO 27001 asks "do you have a management system for continuously improving your security posture?"

For A&A, ISO 27001 would only matter if the business expands into enterprise or government cleaning contracts where procurement teams specifically require it, or if the platform is commercialized as a product sold to other cleaning companies.

**Current relevance:** None. Mentioned for completeness and to prevent someone from telling your mom she needs it before she actually does. If a prospective client asks "are you ISO 27001 certified?" the honest answer for a 10-person cleaning company is "no, but here's what we do to protect your data" followed by a description of the actual controls in place (RLS, encryption, access controls, incident response plan). That answer is appropriate and credible at this business stage.

**What should exist in the documents:** A one-line note acknowledging ISO 27001 exists and specifying the trigger. Nothing more.

---

### 4.3 ISSA CIMS and CIMS-GB — Cleaning Industry Management Standard

**What it is:** The cleaning industry's own management standard, developed by ISSA (International Sanitary Supply Association). CIMS certification evaluates a cleaning organization's management practices across six areas: Quality Systems, Service Delivery, Human Resources, Health Safety and Environmental Stewardship, Management Commitment, and Green Building (for CIMS-GB).

**Already covered in Section 45.2 of the expansion roadmap.** Listed as significant effort (audit-based) with major competitive differentiator impact for large contracts.

**Why it belongs in this security and compliance document:**

CIMS includes security-adjacent requirements that overlap with the frameworks already discussed:

| CIMS Requirement Area | Overlap With |
|---|---|
| Key control and building access security | OWASP A02 (Cryptographic Failures), CIS data protection, Section 30.3 |
| Employee screening and background checks | CIS account management, employment law compliance |
| Chemical management and safety | OSHA HazCom, EPA regulations |
| Insurance and risk management | Section 44, Texas regulatory requirements |
| Data protection for client information | OWASP Top 10, CIS controls, Texas breach notification |
| Quality documentation and process control | Section 20 quality management system |

**The practical value of CIMS for A&A's growth story:**

CIMS certification is the one credential that directly translates to winning larger contracts. Property management companies managing 1,000+ units and facility management companies selecting cleaning vendors for corporate campuses use CIMS as a qualifying filter. If you have it, you're in the consideration set. If you don't, you may not make it past procurement's initial screen.

The security and compliance work described in this entire addendum directly feeds CIMS readiness. When the time comes for CIMS certification, having documented security policies, safety programs, quality systems, and environmental practices already in place reduces the CIMS preparation timeline from 12+ months to 3-6 months.

**Implementation plan:** Matches existing triage. Activate when pursuing contracts where CIMS is competitively required. Estimated investment: $5K-$15K for preparation and audit, 3-6 months timeline.

---

### 4.4 OWASP ASVS (Application Security Verification Standard)

**What it is:** OWASP's most granular security checklist for web applications. Three levels of increasing rigor with 286 total requirements across 14 categories. Level 1 maps closely to the OWASP Top 10. Level 2 is appropriate for applications handling sensitive data. Level 3 is for critical infrastructure.

**Activation trigger:** Platform is stable and in maintenance mode (approximately month 6+). Or before any significant new feature that expands the attack surface (client portal, Stripe integration, subcontractor portal).

**Why ASVS Level 2 is the appropriate target for this platform:**

The platform handles PII, financial data, and building access credentials. It has multiple user roles with different access levels. It integrates with external services that handle payments and communications. This profile aligns with ASVS Level 2, which is designed for "applications that contain sensitive data, which requires protection."

ASVS Level 1 (the 63 most critical requirements) is essentially a more structured version of the OWASP Top 10 analysis already completed. Most Level 1 requirements are addressed or have remediation planned.

ASVS Level 2 adds 126 additional requirements covering areas like:

- Session management depth (session fixation, concurrent session controls, idle timeout)
- Cryptographic controls (key management, algorithm selection, random number generation)
- File upload security (type validation, storage isolation, malware considerations)
- API security (response content types, CORS, error handling)
- Business logic security (anti-automation beyond rate limiting, workflow integrity)
- Data protection (field-level encryption, masking, data minimization)

**Implementation plan:**

| Action | Effort | When |
|---|---|---|
| Run through ASVS Level 1 checklist to confirm OWASP Top 10 coverage is complete | 2-3 hours | Post-launch month 2-3 |
| Cherry-pick Level 2 requirements relevant to the platform's specific data types and features | 4-6 hours of assessment | Post-launch month 4-6 |
| Implement findings from Level 2 assessment | Variable — likely 2-4 weeks of intermittent work | Month 6-12 |

---

### 4.5 GDPR — General Data Protection Regulation

**What it is:** European Union regulation governing the processing of personal data of EU residents.

**Applicability to A&A:** Not applicable. A&A operates in Austin, Texas, serving local commercial clients. There is no scenario in the current or planned business model where EU resident data would be processed.

**Why it's mentioned:** Because the roadmap documents are comprehensive enough that someone reading them might wonder. The explicit statement that GDPR is not applicable prevents unnecessary compliance work.

**When it would become applicable:** Only if the platform is commercialized as a SaaS product (Section 38 franchise model) and sold to cleaning companies in EU member states. This is a Tier 6+ consideration.

---

### 4.6 HIPAA — Health Insurance Portability and Accountability Act

**What it is:** Federal law governing the protection of health information. Applies to covered entities (healthcare providers, health plans, healthcare clearinghouses) and their business associates.

**Activation trigger:** If A&A cleans medical facilities (doctor's offices, dental offices, urgent care clinics, hospitals) and in doing so has access to areas where protected health information (PHI) is visible or accessible.

**Why this deserves a note even though it's not a software framework:**

Section 51.2 of the expansion roadmap identifies medical offices as a target vertical for commercial cleaning growth. The roadmap even provides the positioning: "Medical-grade facility cleaning with documented compliance."

If A&A cleans a medical office after hours and a crew member photographs the workspace for completion documentation, and a patient chart or computer screen with PHI is visible in the photo, A&A has potentially created a HIPAA violation. The medical office is the covered entity, but A&A's access to their facility means PHI exposure is possible.

More formally: if the medical office considers A&A a "business associate" (which some do for cleaning contractors who have unsupervised access to clinical areas), A&A would need to sign a Business Associate Agreement (BAA) and comply with HIPAA security and privacy requirements for any PHI they might encounter.

**Platform implications:**

| Scenario | Risk | Mitigation |
|---|---|---|
| Completion photos capture patient information visible on desks, screens, or walls | HIPAA violation — unauthorized disclosure of PHI | Train crew to never photograph areas where patient information is visible. Add a note to medical facility job templates: "Do not photograph desks, screens, or patient areas with visible documents. Photograph only cleaned surfaces, floors, and fixtures" |
| Crew accesses records storage or server rooms during cleaning | Physical access to PHI | Define restricted areas in job scope. Crew lead briefed on which areas are off-limits. Access codes should not grant access to restricted areas |
| Platform stores information about the medical client's facility that could identify patients | Unlikely but possible if notes include "cleaned Dr. Smith's exam rooms where they treat [conditions]" | Keep job notes focused on cleaning scope, not clinical activities |

**Implementation plan:**

| Action | Effort | When |
|---|---|---|
| Add medical facility safety note to cleaning SOPs when medical cleaning service is offered | 30 min documentation | When medical vertical is actively pursued |
| Add photo restriction guidance to medical facility job templates | 15 min | When medical-specific templates are created |
| Research BAA requirements if a medical client requests one | 2-3 hours | When the first medical client asks for it |
| Consult with attorney on BAA implications | $500-$1,000 | When medical cleaning becomes a significant revenue line |

---

### 4.7 FTC Act — Section 5 (Unfair or Deceptive Trade Practices)

**What it is:** The Federal Trade Commission Act prohibits unfair or deceptive acts or practices in commerce. Relevant to A&A in two ways: advertising claims and data security practices.

**Advertising claims:**

The SB-2 (fabricated testimonials) and SB-3 (unverified metrics) issues identified in the expansion roadmap are directly relevant here. The FTC has increasingly pursued enforcement actions against businesses that use fake reviews or unsubstantiated claims. In 2023, the FTC finalized rules allowing civil penalties up to $50,120 per fake review.

The existing roadmap correctly identifies these as launch blockers (Tier 0). The FTC context adds legal weight to what the roadmap treats as a credibility issue.

**Data security practices:**

The FTC has authority to pursue businesses whose data security practices are unfair or deceptive — specifically, if a business promises to protect consumer data (via a privacy policy) and then fails to implement reasonable security measures, the FTC can take action. Several small businesses have been subject to FTC consent orders for inadequate data security.

This means the privacy policy on the website creates a legal commitment. Whatever the privacy policy says about data protection, the platform must actually do. If the privacy policy says "we encrypt your information" and building access codes are stored in plain text, that's a deceptive practice.

**Implementation plan:**

| Action | Effort | When |
|---|---|---|
| Ensure testimonials are real (SB-2) — already Tier 0 priority | Per existing plan | Pre-launch |
| Ensure metrics are verified (SB-3) — already Tier 0 priority | Per existing plan | Pre-launch |
| Review privacy policy against actual platform practices — does the privacy policy promise anything the platform doesn't deliver? | 1-2 hours | Pre-launch, Day 18-20 hardening |
| When access credential encryption is implemented, update privacy policy to reflect it. Until then, don't claim encryption of data that isn't encrypted | 15 min | Ongoing |

---

### 4.8 Texas Deceptive Trade Practices Act (DTPA)

**What it is:** Texas state consumer protection law that provides a private right of action for consumers injured by false, misleading, or deceptive acts. Relevant alongside the FTC Act but with state-level enforcement and the ability for individual consumers to sue.

**Relevance to A&A:** Same advertising and claims concerns as FTC Section 5, but with Texas-specific remedies. Under DTPA, a consumer can recover actual damages, and if the conduct is found to be "knowingly" deceptive, up to three times actual damages plus attorney fees.

**Platform-specific risk:** If the website makes specific claims about response times ("We respond within 4 hours"), satisfaction guarantees ("100% satisfaction guaranteed"), or service quality ("Every job passes a formal QA inspection"), and the platform doesn't actually enforce or deliver on these claims, a dissatisfied client could bring a DTPA claim.

The warranty and guarantee framework (Section 36) creates commitments that the platform must actually deliver. The SLA tracking (Section 20.1) is the mechanism for verifying those commitments are met.

**Implementation plan:**

| Action | Effort | When |
|---|---|---|
| Audit all public-facing claims on the website against actual capabilities | 1 hour | Day 18-20 pre-launch hardening |
| Don't publish specific SLA commitments until the platform can track and enforce them | Content decision | Pre-launch content review |
| When satisfaction guarantee is published, ensure rework workflow actually functions end-to-end | Part of testing plan | Days 2-5 testing phase |

---

## 5. Framework Interaction Map

These frameworks don't exist in isolation. A single platform feature or business activity may be governed by multiple frameworks simultaneously. Understanding the interactions prevents compliance gaps.

| Business Activity | Frameworks That Apply |
|---|---|
| **Sending automated SMS to a lead** | TCPA (consent), OWASP (input validation on phone number), CIS (secure configuration of Twilio), CAN-SPAM (if email sent alongside) |
| **Storing building access codes** | OWASP A02 (encryption), CIS 3.1 (data protection), Texas Breach Law (notification if exposed), NIST CSF Protect (access control), potentially SOC 2 Confidentiality |
| **Employee submitting completion photos** | OWASP A03 (file upload validation), HIPAA (if medical facility photos capture PHI), OWASP A08 (file integrity), CIS 3.6 (data on employee device) |
| **Processing payment via Stripe** | PCI DSS (card data handling), OWASP (secure integration), Texas sales tax (correct calculation), CIS (secure configuration of payment integration) |
| **Hiring a new employee** | FLSA/TWC (employment law), I-9 (work authorization), OSHA (safety training), TCPA (SMS consent for job notifications), CIS 5.1 (account management for new system access) |
| **Cleaning a pre-1978 building** | EPA RRP (lead paint certification), OSHA (PPE, hazard communication), TCEQ (waste disposal) |
| **Publishing a testimonial on the website** | FTC Section 5 (truthful advertising), Texas DTPA (deceptive practices), ADA/WCAG (accessible display) |
| **Admin accessing the dashboard** | OWASP A01 (access control), CIS 6.3 (MFA), NIST CSF Protect (authentication), OWASP A09 (audit logging) |
| **A data breach occurs** | Texas §521.053 (notification), NIST CSF Respond (incident response), Section 48 (platform incident response), FTC Act (privacy policy commitments), potentially HIPAA (if medical client data) |

---

## 6. Consolidated Pre-Launch Compliance Checklist

This distills everything from Tier 1 into a single checklist that supplements the existing Pre-Launch Validation Checklist (Blueprint Section 15).

### 6.1 Application Security (OWASP)

- [ ] Security headers added to next.config.js (X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- [ ] Content Security Policy header configured (at minimum: default-src 'self', frame-ancestors 'none')
- [ ] OWASP API Security Top 10 spot-check completed for all public and service-role API routes
- [ ] OWASP ASVS Level 1 review scheduled as the post-launch verification checklist
- [ ] Supabase RLS policies verified for admin/employee/client-facing tables with object-level access tests
- [ ] Admin MFA enabled in Supabase Auth and required for externally exposed admin dashboard access
- [ ] npm audit shows zero critical and zero high vulnerabilities
- [ ] Dependabot enabled on GitHub repository
- [ ] No instance of dangerouslySetInnerHTML renders user-generated content without sanitization
- [ ] Quote public_token verified as cryptographically random (crypto.randomUUID() or equivalent) with sufficient length
- [ ] Supabase service_role key confirmed absent from any NEXT_PUBLIC_ environment variable
- [ ] Supabase service_role key confirmed absent from any client-side JavaScript bundle
- [ ] Service-role API routes independently authorize the caller before reading/writing protected data
- [ ] CORS policy restrictive to application domain only (or Next.js default which is same-origin)
- [ ] Production error responses do not expose stack traces, file paths, or internal system details
- [ ] Source maps confirmed not deployed to production
- [ ] Next.js poweredBy header disabled
- [ ] IDOR testing completed on at minimum: job fetch by employee, quote fetch by token, lead fetch by admin, employee profile fetch
- [ ] File upload validation confirms photo uploads are restricted to image MIME types and reasonable file sizes
- [ ] Account/secrets inventory exists for Vercel, Supabase, GitHub, domain/DNS, Twilio, Resend, Anthropic, Upstash, QuickBooks, and email accounts
- [ ] Backup/recovery procedure is documented, including who can access Supabase backups and how a restore would be tested
- [ ] Security event logging plan exists for failed auth spikes, rate-limit abuse, sensitive admin actions, and service-role route denials

### 6.2 Communication Compliance (TCPA/CAN-SPAM)

- [ ] Quote request form has explicit, unchecked-by-default SMS consent checkbox with TCPA-compliant language
- [ ] Contact form (if exists) has same consent checkbox
- [ ] Database has consent_given, consent_timestamp, and consent_method fields on contact/lead records
- [ ] All automated SMS messages include business name identification ("A&A Cleaning: ...")
- [ ] All automated SMS messages include opt-out instruction ("Reply STOP to unsubscribe")
- [ ] STOP reply processing implemented and tested: incoming STOP → contact flagged → future SMS blocked → confirmation sent
- [ ] Consent check enforced before sending marketing SMS (re-engagement, review requests, promotional messages)
- [ ] Transactional SMS (job notifications, schedule confirmations) distinguished from marketing SMS in code
- [ ] All marketing emails include physical postal address
- [ ] All marketing emails include functional unsubscribe link
- [ ] Unsubscribe processing tested: click → contact updated → future marketing emails blocked
- [ ] Email domain authentication (SPF, DKIM, DMARC) configured and verified

### 6.3 Accessibility (ADA/WCAG 2.1 AA)

- [ ] Gold color contrast fixed to meet 4.5:1 ratio for normal text
- [ ] Before/after slider keyboard accessible with arrow keys
- [ ] lang="es" attribute on all Spanish language content sections
- [ ] aria-live="polite" on testimonial carousel
- [ ] aria-current="page" on active navigation items
- [ ] axe-core integrated and zero violations on all public pages
- [ ] eslint-plugin-jsx-a11y configured and zero violations in codebase
- [ ] Manual keyboard tab-through completed on homepage and quote form
- [ ] 200% zoom tested on homepage, service page, admin dashboard, employee portal

### 6.4 Operational Security (CIS IG1)

- [ ] MFA enabled on admin Supabase Auth account
- [ ] MFA enabled on Vercel dashboard account
- [ ] MFA enabled on GitHub account
- [ ] MFA enabled on Supabase dashboard account
- [ ] MFA enabled on domain registrar account
- [ ] Password manager in use with unique passwords for every service
- [ ] Master account inventory documented (all services, who has access, MFA status)
- [ ] Supabase backup confirmed active and recent (check most recent backup date)
- [ ] 15-minute security conversation completed with mom (passwords, phishing, MFA)
- [ ] No shared credentials between services or people
- [ ] Employee account deactivation procedure documented

### 6.5 Business Compliance

- [ ] Privacy policy reviewed against actual platform data practices — no promises that exceed implementation
- [ ] All testimonials verified as real with explicit permission from quoted clients
- [ ] All authority bar metrics verified as truthful or connected to live database
- [ ] All public-facing service claims accurately reflect current capabilities
- [ ] Mom confirmed whether crew works in pre-1978 buildings (EPA RRP applicability)
- [ ] Mom confirmed SDS sheets exist for all chemicals in use (OSHA HazCom)
- [ ] Mom confirmed PPE provided for construction site work (OSHA PPE)

---

## 7. Final Review and Confidence Assessment

### 7.1 What This Addendum Accomplishes

This document maps 18 frameworks and standards against the specific context of A&A Cleaning Services, its platform, its business stage, and its growth trajectory. It distinguishes between what matters at launch, what matters in the first year, and what matters at scale — preventing the common failure mode of trying to comply with everything simultaneously and accomplishing nothing.

The frameworks are not treated as abstract checklists but as risk-management tools weighted against the actual threat landscape for a 10-person Austin commercial cleaning company transitioning from subcontractor to prime contractor. A TCPA violation from automated SMS is a more immediate and probable risk than a NIST CSF Govern deficiency. Building access code exposure is a more consequential breach than marketing email list exposure. These distinctions drive the prioritization.

### 7.2 Gaps This Addendum Does Not Cover

| Gap | Why It's Not Covered | When It Should Be Addressed |
|---|---|---|
| Penetration testing | Cost ($5K-$15K) and complexity unjustified at current stage. The OWASP and IDOR testing provides adequate coverage for launch | When revenue exceeds $250K or after a security incident |
| Formal security policies (written documents) | One-person "IT department" doesn't need formal policy documents yet. The controls exist in code and configuration | When a second person gets admin access (ops manager, contractor, bookkeeper) |
| Security awareness training beyond mom | Crew members access the employee portal, not sensitive admin functions. Their risk surface is limited | When any crew member gets elevated access or when the platform stores highly sensitive data accessible through the employee portal |
| Cyber liability insurance | A business decision, not a technical one. Recommended but not a platform feature | Discuss with insurance broker within first 90 days of launch |
| Privacy impact assessment | Formal PIAs are enterprise-level exercises. The data classification in Section 30 serves the same purpose at this scale | When pursuing SOC 2 or ISO 27001 |
| Third-party vendor security assessments | Supabase, Vercel, Twilio, and Resend all publish their own compliance reports. Formally assessing them is premature | When pursuing SOC 2 (their reports become part of your audit) |

---

### 7.3 Confidence Level Assessment — Full Blueprint and Document Set

This table assesses confidence across every major dimension of the project — how likely is it that each area will be successfully implemented given the current documentation, codebase, available tools (Claude, Codex), and the specific constraints of a solo developer working 20+ hours/week with an owner-operator who is not technical.

**Confidence Scale:**
- **95-100%:** Virtually certain. Clear path, tools are capable, low ambiguity
- **85-94%:** High confidence. Known approach, manageable complexity, minor unknowns
- **70-84%:** Moderate confidence. Achievable but depends on execution discipline, external inputs, or learning curves
- **50-69%:** Uncertain. Significant dependencies, unknowns, or risk factors
- **Below 50%:** Low confidence. Major blockers, unclear path, or depends heavily on factors outside your control

| Area | Confidence | Rationale |
|---|---|---|
| **Core Platform — Public Site** | | |
| Public site rendering and routing | 95% | Already built and working per audit. Next.js fundamentals are solid. Route groups properly organized |
| Service page content quality | 75% | Depends entirely on mom's input and your ability to translate her knowledge into compelling commercial copy. Claude can draft but accuracy requires human review. The content brief document (recommended doc #2) would raise this to 85% |
| About page with real owner story | 70% | Depends on mom sitting down for the conversation. The content itself is straightforward once she talks. Risk: she keeps delaying. Mitigation: record during a car ride, dinner, any casual moment |
| SEO technical foundation | 90% | Structured data, meta tags, sitemap, clean URLs all exist. Technical SEO is Claude/Codex territory — high confidence |
| SEO content depth (blog, city pages) | 65% | Blog infrastructure needs building (Codex can handle). Content production at scale requires sustained effort over months. Risk: initial posts get written, then production stalls as other priorities consume time |
| Conversion rate optimization | 85% | Multiple conversion paths exist (form, floating panel, AI assistant, phone, exit intent). The infrastructure is sophisticated. Actual conversion rate depends on content quality and trust signals — hence not 95% |
| **Core Platform — Admin Dashboard** | | |
| Admin dashboard functionality | 85% | All 10 modules exist with real queries. Testing will surface bugs but the foundation is strong. Codex can fix most bugs with targeted prompts |
| Admin dashboard usability for mom | 60% | This is the biggest uncertainty. Mom hasn't seen it. Her mental model of managing jobs may not match the dashboard's information architecture. Expect 2-4 rounds of "this isn't how I think about it" feedback requiring UI adjustments. Claude/Codex can adjust UI but knowing what to adjust requires observation |
| QuickBooks integration | 65% | OAuth flow is built but never completed in production. QuickBooks integrations are notoriously fragile — token refresh, API version changes, field mapping issues. Expect 3-5 days of debugging after the first real sync attempt. Codex can help with specific QB API issues but the debugging is iterative |
| Lead pipeline end-to-end | 90% | The flow from form submission through quote delivery and acceptance is the most complete feature chain. High confidence it works once env vars are set and tested |
| Scheduling and dispatch | 80% | Module exists with conflict detection. Real-world scheduling is messier than seed data — overlapping jobs, same-day changes, crew availability. Expect friction when real scheduling patterns meet the system's assumptions |
| **Core Platform — Employee Portal** | | |
| Employee portal functionality | 90% | Mobile-first, Spanish-first, photo upload with offline queue, checklist execution, messaging, issue reporting. Audit confirmed it's working. Codex prompts for remaining items (before-photos) are well-defined |
| Employee portal adoption by crew | 55% | The hardest prediction. Cleaning crews are not technology adopters by default. Some will embrace it, some will resist. Bilingual support and mobile-first design help enormously. The laminated quick-start card (recommended doc #6) is critical. Risk: if 40% of the crew doesn't use it, the data is incomplete and mom can't trust the system. Mitigation: start with 2-3 best crew members, let them champion it |
| Offline photo queue reliability | 75% | Infrastructure exists (IndexedDB, retry logic). Never tested with real network interruption on a real phone at a real construction site. Construction sites have genuinely poor connectivity. Expect edge cases: phone runs out of storage, photos fail to compress, retry gets stuck |
| **Security and Compliance** | | |
| OWASP Top 10 remediation | 90% | The specific actions are well-defined (security headers, npm audit, CSP, IDOR testing, MFA). Codex can implement security headers and CSP. IDOR testing requires manual execution but with clear test scripts. Most items are configuration, not complex development |
| TCPA compliance | 85% | The consent checkbox, STOP processing, and message classification are straightforward development tasks. Codex can implement the form changes and database columns. The Twilio webhook for STOP processing is well-documented. Risk: the distinction between transactional and marketing SMS requires judgment calls that can't be fully automated |
| CAN-SPAM compliance | 90% | Simpler than TCPA. Unsubscribe link, physical address, honest subject lines. Resend handles some of this automatically. Codex can add the remaining elements to email templates |
| ADA/WCAG 2.1 AA | 90% | The existing accessibility infrastructure is strong. The specific remediation items (gold contrast, slider keyboard, lang attributes) are well-defined and scoped. axe-core integration is a standard Codex task. Manual testing (keyboard, zoom, screen reader) requires you but is straightforward |
| CIS IG1 operational security | 85% | Primarily configuration and documentation, not code. MFA enablement, password manager setup, and account inventory are human tasks, not developer tasks. The security conversation with mom is a human interaction, not a technical deliverable. Risk: human tasks get deprioritized in favor of code tasks |
| Texas breach notification compliance | 95% | Documentation update only. No code changes. Clear statute reference |
| PCI DSS (when Stripe added) | 90% | Using Stripe Checkout keeps you in SAQ A (simplest level). Codex can implement Stripe Checkout following their well-documented guides. Risk: accidentally logging card data in error handlers or Sentry |
| OSHA basic compliance (HazCom, PPE) | 50% | This depends entirely on mom's existing practices, not on the platform. If she already has SDS sheets and PPE, compliance is confirmed. If she doesn't, it's a business operations task that you can't help with from a code perspective. The platform can eventually track these things but can't create them |
| Employment law compliance | 55% | Similar to OSHA — this is business operations, not platform features. I-9 tracking and overtime calculation depend on features that don't exist yet (onboarding module, time tracking). When those features are built, Codex can implement the compliance logic, but the features themselves are Tier 4 |
| **Marketing and Growth** | | |
| Google Business Profile setup and optimization | 90% | Well-documented process, no code required. Your mom provides the business information, you set it up. Risk: GBP verification delay (postal verification can take 2-3 weeks) |
| Google review generation | 75% | The automated pipeline (post-job SMS → rating → review request) is technically straightforward. Codex can build it. The human challenge: clients don't always respond, and the first 5-10 reviews depend on mom personally asking existing clients. Risk: review velocity is slower than projected because mom is busy and clients forget |
| Google Ads setup and management | 70% | Initial campaign setup is well-documented and Codex can help with conversion tracking implementation. Ongoing management (bid adjustment, keyword refinement, negative keywords, ad copy testing) requires weekly attention and learning. Risk: $500/month spent inefficiently in the first 2-3 months while learning what works. Mitigation: start with one campaign, one service keyword, tight geographic targeting |
| Blog content production | 60% | Claude can produce high-quality first drafts from detailed briefs. The content brief document would raise this to 75%. Risk: blog posts get written at launch then production stops because writing is less satisfying than coding. Consistency over 6-12 months is what drives organic traffic, and consistency is the hardest part |
| LinkedIn strategy execution | 45% | This depends entirely on mom. The profile setup and first few posts can be done for her. But ongoing engagement (commenting, connecting, posting 2-3x/week) requires her participation. She's coming home tired from job sites. LinkedIn is not where her mind goes. Risk: profile gets set up, 3 posts go out, then silence. Mitigation: batch and schedule posts monthly. Lower the expectation to 1x/week. Have her record voice memos that you turn into posts |
| Email marketing sequences | 80% | Resend is in the stack. Email templates are well-specified in Section 67. Codex can build the sequences. Automation handles delivery. Risk: list size is small initially (only quote submitters), so the impact is limited for the first 3-6 months. But the infrastructure compounds over time |
| Referral program | 70% | Simple to build technically (referral codes, tracking, credit). Codex handles it. Effectiveness depends on active promotion — mom mentioning it to clients, crew leads handing out cards, email sequence including referral prompts. Risk: the program exists but nobody uses it because it's not actively promoted |
| Physical marketing materials (cards, magnets, leave-behinds) | 85% | Well-specified with costs and vendors. This is a purchasing and design task, not a code task. Risk: design quality if using cheap/fast services. Mitigation: use Canva templates or spend $200-$500 on a designer for the initial set |
| **Data and Analytics** | | |
| First-party analytics (conversion events) | 90% | Already implemented per audit. Supabase conversion_events table collects data. Needs verification that events fire correctly on production |
| GA4 implementation | 90% | Standard script installation. Well-documented. 1-2 hours of work |
| Attribution tracking | 80% | UTM parameter persistence exists in PublicChrome. Needs verification that UTM data writes to the leads table on form submission. First-touch attribution is achievable. Multi-touch (Phase 2) adds complexity |
| Marketing performance dashboard | 65% | Requires pulling data from multiple sources (GA4, Supabase, manual ad spend entry). The Unified Insights module exists but doesn't have marketing-specific views yet. Codex can build the views but the data integration requires careful specification |
| **Operations and Scaling** | | |
| Recurring job scheduling | 85% | Well-defined feature with clear database model (job templates, recurrence rules). Codex can implement from a good specification. Risk: edge cases in recurrence (holidays, crew availability changes, scope modifications on individual instances) |
| Time tracking | 80% | Straightforward feature (clock in/out with geolocation). Codex can build from spec. Risk: adoption resistance from crew ("now they're tracking my every minute"). Mitigation: frame as "making sure you get paid for every hour" not "surveillance" |
| Job costing (revenue − labor − supplies) | 75% | Depends on time tracking being in place and supply cost data being entered. The math is simple. The data collection is the challenge — every job needs labor hours and supply usage logged accurately for the numbers to mean anything |
| Client portal | 85% | Magic link auth, job/quote/invoice visibility, communication thread. Well-specified. Codex can build from the spec in Section 24. Risk: scope creep — the temptation to add features before the core portal is proven |
| Role-based access control | 80% | Section 25 permission matrix is well-designed. Adding a role column, middleware checks, and conditional UI rendering is standard Codex work. Risk: getting the RLS policies right for new roles requires careful testing. One wrong policy could expose data or block legitimate access |
| Multi-day job support | 70% | Requires data model changes (job spanning multiple days, daily progress tracking, crew scheduling across days). More complex than single-day jobs. Codex can implement but the specification needs to be precise |
| Subcontractor management | 65% | New entity type, new portal surface, new assignment flow, new billing model. Significant feature scope. Codex can handle individual pieces but the overall design needs careful human specification |
| Multi-location support | 50% | Architectural change affecting almost every module. Correctly deferred to Tier 6. When the time comes, this is a major refactor regardless of how well the current architecture is designed |
| **Infrastructure and DevOps** | | |
| Vercel deployment and configuration | 95% | Already working. Env vars need verification. Standard deployment pipeline |
| Supabase database operations | 90% | Migrations exist. RLS policies exist. Backup is provider-managed. Risk: first production migration on live data — always test on a branch/staging database first |
| Twilio SMS reliability | 85% | Well-tested service with good documentation. Quiet-hours queueing and retry logic exist. Risk: Twilio sandbox vs production mode confusion. Verify the phone number is a purchased production number, not sandbox |
| Resend email deliverability | 80% | Depends on domain authentication (SPF/DKIM/DMARC). Without it, emails land in spam. With it, deliverability should be high. Codex can't help with DNS record configuration — that's a manual task in your domain provider |
| Error monitoring (Sentry) | 85% | Conditional on DSN being set. Standard integration. Risk: alert fatigue if not configured with appropriate severity thresholds |
| PWA (employee portal) | 80% | Well-specified phased rollout in Section 26. Manifest and service worker are standard Codex tasks. Offline caching adds complexity. Risk: service worker caching bugs are notoriously difficult to debug |
| **Documentation and Process** | | |
| Document consolidation to 4 working files | 90% | Clear specification in Section 20. This is an organizational task, not a technical one. Risk: you keep the 7+ files and add more instead of consolidating |
| Ongoing document maintenance | 50% | Every project starts with good documentation intentions. The maintenance cadence (weekly for launch-plan.md, monthly for expansion-reference.md) is realistic but depends on discipline. Risk: documents drift out of sync with reality within 3-6 months. Mitigation: update documents as part of the work, not as a separate task |
| Codex/Claude project context document | 95% | High-value, low-effort. Can be created in one session. Dramatically improves every subsequent AI interaction. Risk: not keeping it updated as the codebase evolves |
| **Business Outcomes** | | |
| $25K revenue from website leads in 6 months | 65% | The funnel math works (Section 63). The platform infrastructure supports it. The risk factors are: mom's lead response speed, content quality and trust signals at launch, Google review velocity, ad spend effectiveness during learning period, and whether the first few direct clients produce referrals. None of these are platform risks — they're execution and market risks |
| $50K revenue from website leads in 6 months | 40% | Requires either high average job value (landing 2-3 construction/commercial contracts at $5K-$15K) or higher lead volume than the conservative model projects. Achievable but depends on market timing, competitive dynamics, and whether the GC/PM positioning resonates quickly enough |
| Mom fully adopts admin dashboard | 45% | The biggest single risk to the entire project. If she partially adopts it, the platform generates partial data, which makes analytics unreliable and automation incomplete. Mitigation: start with one module (lead pipeline), prove its value, expand. Don't try to get her using all 10 modules simultaneously |
| Crew fully adopts employee portal | 40% | See rationale above. 10 people need to change their work habits. Some will, some won't. 70-80% adoption is a realistic best case for the first 6 months. 100% adoption takes 12+ months with consistent reinforcement from mom |
| Subcontractor-to-prime transition | 55% | The strategic direction is sound. The platform supports it. The risk is execution speed: landing direct clients takes 3-6 months of marketing, relationship building, and reputation establishment. During that period, she's running both business models simultaneously, which is operationally draining. If direct client acquisition is slower than expected, the financial pressure to maintain subcontractor work may prevent full commitment to the transition |

### 7.4 Summary Assessment

**Overall project confidence: 73%**

This means: the project has a strong probability of delivering a functional, well-designed platform that improves A&A's operations and generates some new direct business. The technical execution is high-confidence (85%+ across infrastructure and core features). The uncertainty lives in three areas:

1. **Human adoption (mom + crew):** 40-55% confidence. This is not a technology problem. It's a change management problem. The best platform in the world fails if the users don't use it.

2. **Content quality and marketing execution:** 60-75% confidence. Claude and Codex can draft content and build marketing infrastructure, but the authenticity, accuracy, and sustained effort depend on human input that can't be automated.

3. **Business outcome achievement ($25K-$50K targets):** 40-65% confidence. The math works and the infrastructure supports it, but market response, competitive dynamics, and mom's capacity to sell (not just deliver) are variables the platform can influence but not control.

**What raises overall confidence the most:**

The single highest-leverage action is not a security framework, a code fix, or a marketing campaign. It's **mom using the admin dashboard on 3 real jobs before launch.** If she uses it and provides feedback, the adoption confidence jumps from 45% to 70%, the content quality improves because she's engaged, and the business outcome probability increases because she sees the platform as her tool rather than her son's project.

The second highest-leverage action is **landing one direct client through the website in the first 60 days.** One real lead → one real quote → one real job → one real completion report → one real Google review creates the proof loop that makes everything else work. The entire document set — all 75+ sections, all 70,000+ words — ultimately exists to make that single first conversion happen and then repeat it.

---

### 7.5 Final Note on Framework Overload

This addendum covers 18 frameworks. The expansion roadmap covers 75 sections. The blueprint covers 20 sections. The total documentation now exceeds 80,000 words.

The honest risk is that the comprehensiveness becomes counterproductive. A solo developer spending 20 hours a week needs to write code, test features, create content, and talk to their mom — not read compliance frameworks.

Use this addendum the same way the expansion triage (Section 18) recommends using the expansion sections: **Tier 1 items are your pre-launch checklist additions. Tier 2 items activate at their specific triggers. Tier 3 items sit on a shelf until the business reaches a stage where they matter.** Don't read Tier 3 until a Tier 3 trigger fires.

The 15-22 hours of Tier 1 compliance work described in this document, combined with the 8-10 hours of OWASP hardening, brings the total security and compliance effort to approximately 25-32 hours. Spread across the existing 60-day timeline, that's roughly 3-4 hours per week dedicated to security and compliance — manageable alongside the development, testing, and content work already planned.

Ship the platform. Protect the data. Follow up with frameworks as the business grows into them.

---

## Change Log

- 2026-04-13: Initial creation. 18 frameworks assessed against A&A business context and existing roadmap. Three-tier prioritization with activation triggers. Consolidated pre-launch compliance checklist. Confidence assessment across all project dimensions.

# AI Implementation Confidence Assessment

Full evaluation of Claude and Codex capabilities against every major implementation area in the document set. Assessed against real-world performance patterns, not marketing claims.

---

## How This Assessment Works

Every implementation item is rated on two axes:

**AI Implementation Confidence:** Can Claude or Codex produce correct, production-ready code or content for this item with a well-written prompt and one or two revision cycles?

- **95-100%:** AI produces correct output first try. Copy-paste-deploy.
- **85-94%:** AI produces 90%+ correct output. Minor human review and adjustment needed.
- **70-84%:** AI produces a strong starting point. Human needs to verify logic, test edge cases, or adjust for project-specific context.
- **50-69%:** AI can scaffold the work but human judgment drives the outcome. Significant review, testing, or iteration required.
- **Below 50%:** AI assistance is marginal. The work is primarily human judgment, external action, or requires context AI doesn't have.

**Which AI tool is better suited:**

- **Codex:** Better for multi-file changes, refactoring across the codebase, understanding project structure, running tests, and implementing features that touch many files simultaneously. Works within the repository context.
- **Claude:** Better for single-file implementations, complex logic within a contained scope, content generation, document creation, architectural reasoning, and tasks where you paste in context and get back a complete artifact.
- **Either:** Tasks where both tools are equally capable.
- **Human only:** Tasks that require physical action, business decisions, external service configuration, or interpersonal interaction.

---

## 1. Security Implementation (OWASP, CIS, Headers)

### 1.1 Security Headers

| Item | AI Confidence | Best Tool | Rationale |
|---|---|---|---|
| Add X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy to next.config.js | **97%** | Either | This is a well-documented, deterministic configuration. Every AI model has seen thousands of Next.js security header configurations. The exact headers and values are specified in the addendum. Prompt includes the exact header names and values. AI outputs correct next.config.js modification first try |
| Content Security Policy header | **82%** | Claude | CSP is more nuanced because it needs to account for the specific external resources the platform loads: Supabase domain for API calls, Supabase storage domain for images, Twilio domain if any client-side calls, Google Analytics domain, Meta Pixel domain. AI can produce a correct CSP structure but you need to verify the domain allowlist matches your actual external connections. An overly restrictive CSP breaks functionality silently. An overly permissive CSP provides no protection. Human must test that the site still works after CSP is applied |
| Disable Next.js poweredBy header | **99%** | Either | One line in next.config.js: `poweredBy: false`. AI gets this right every time |
| Disable source maps in production | **95%** | Either | Standard Next.js configuration. `productionBrowserSourceMaps: false` in next.config.js. AI handles this correctly |

### 1.2 Dependency Security

| Item | AI Confidence | Best Tool | Rationale |
|---|---|---|---|
| Run npm audit and fix critical/high vulnerabilities | **70%** | Codex | Codex can run npm audit and attempt fixes. The challenge is that some vulnerability fixes require major version bumps that introduce breaking changes. Codex can attempt the fix, but if upgrading a dependency from v4 to v5 changes the API, Codex may or may not correctly update all call sites. Human review of the diff is essential. For simple semver patches (4.1.2 → 4.1.3), AI handles it perfectly. For major bumps, expect 60-70% success |
| Enable Dependabot on GitHub | **30%** | Human only | This is a GitHub UI configuration task, not a code task. Go to Settings → Security → Enable Dependabot alerts and security updates. AI can tell you exactly what to click but cannot do it for you |
| Create .github/dependabot.yml configuration | **95%** | Either | Deterministic YAML configuration. AI has seen thousands of these. Correct first try |
| Lockfile integrity verification | **90%** | Codex | Codex can verify package-lock.json exists and is committed, check for inconsistencies between package.json and lockfile, and add a CI step to verify. Straightforward |

### 1.3 Authentication and Access Control

| Item | AI Confidence | Best Tool | Rationale |
|---|---|---|---|
| Enable MFA on Supabase Auth for admin accounts | **40%** | Human mostly | Supabase MFA configuration involves both dashboard settings and code changes. The dashboard configuration (enabling TOTP MFA in Supabase Auth settings) is a human UI task. The code side — adding MFA enrollment flow and verification challenge to the admin login — Claude or Codex can implement, but the Supabase MFA API has specific flows (enroll → challenge → verify) that AI models sometimes get wrong because the API is newer and less represented in training data. Expect one revision cycle. AI confidence for the code portion: 75%. For the dashboard configuration: human only |
| IDOR testing on API routes | **60%** | Claude | Claude can write the test scripts — specific fetch calls with manipulated IDs using different user sessions. But executing those tests requires a running environment with authenticated sessions for multiple user roles. Claude produces the test code; you run it manually or feed it to a test runner. The test design is the valuable AI output. Execution and interpreting results is human work |
| Verify CORS policy | **85%** | Either | AI can check the current CORS configuration in next.config.js and middleware, identify if it's overly permissive, and tighten it. Next.js API routes default to same-origin, which is correct. AI can confirm this and flag any explicit CORS headers that widen access |
| Verify service_role key not in client bundle | **92%** | Codex | Codex can grep the entire codebase for the service_role key value or for any Supabase client initialization that uses it on the client side. It can also search for NEXT_PUBLIC_ prefixed variables that reference service role. This is a pattern-matching task that AI excels at |
| Session management policy (expiry, invalidation) | **70%** | Claude | Claude can implement session expiry configuration in Supabase Auth settings and write the code for session invalidation on employee termination. The logic is straightforward but the Supabase-specific implementation requires accurate API usage. Expect one revision cycle for edge cases |
| Account deactivation procedure on employee termination | **75%** | Claude | Claude can write an admin function that disables a Supabase auth user, revokes their sessions, and updates their profile status. The Supabase Admin API for user management is well-documented. Risk: Claude may use an outdated API method. Verify against current Supabase docs |
| Rate limiting on authenticated routes | **88%** | Claude | The rate limiting infrastructure already exists (Upstash). Claude can extend the existing rate limiting middleware to apply configurable limits to authenticated routes. The pattern is established in the codebase; this is extending it, not inventing it |

### 1.4 Input Validation and XSS Prevention

| Item | AI Confidence | Best Tool | Rationale |
|---|---|---|---|
| Grep for dangerouslySetInnerHTML | **98%** | Codex | Pure code search. Codex finds every instance, reports the file and context. Perfect AI task |
| Add DOMPurify sanitization where needed | **90%** | Either | If dangerouslySetInnerHTML instances exist, wrapping the content with DOMPurify.sanitize() is a mechanical transformation. AI handles this correctly. Risk: choosing the right DOMPurify configuration (which tags/attributes to allow) requires understanding what content is being rendered |
| Verify all database queries are parameterized | **85%** | Codex | Codex can search the entire codebase for supabase.rpc() calls, raw SQL strings, or any database interaction that doesn't use the Supabase client's built-in parameterization. Pattern matching task. May miss edge cases in dynamically constructed queries |
| Verify API error responses don't expose internals | **80%** | Codex | Codex can find all try/catch blocks in API routes and verify that error responses return generic messages rather than stack traces or internal details. The check is: does any catch block return `error.message` or `error.stack` directly to the client? AI identifies the pattern; human verifies the fix doesn't hide legitimate error information needed for debugging |

### 1.5 Security Logging

| Item | AI Confidence | Best Tool | Rationale |
|---|---|---|---|
| Create security_events table migration | **95%** | Either | Standard SQL migration with defined columns (event_type enum, user_id, ip_address, user_agent, details jsonb, created_at). AI produces correct migration first try given the schema specification |
| Implement security event logging in API routes | **78%** | Codex | Codex can add logging calls to existing API routes — log failed auth attempts, rate limit triggers, unauthorized access attempts. The challenge is inserting logging at the right points in 12+ API route files without breaking existing logic. Codex handles this well for individual files but may miss some routes or insert logging at suboptimal points. Review the diff carefully |
| Alerting on suspicious activity (failed login spikes, rate limit abuse) | **65%** | Claude | Claude can design and implement an alerting function that queries security_events for threshold breaches and sends notifications via the existing Twilio/Resend infrastructure. The logic is straightforward but the threshold tuning (how many failures before alerting?) requires business judgment. AI sets up the infrastructure; human tunes the thresholds after observing real traffic patterns |
| Admin action audit trail | **82%** | Codex | Codex can add middleware or function wrappers that log admin mutations (create, update, delete) on leads, quotes, jobs, and employee records. The pattern: intercept the Supabase call, capture before/after state, write to audit log. Codex can implement this systematically across admin API routes. Risk: performance impact if every admin action triggers an additional database write. Consider async logging |

### 1.6 Token and Credential Security

| Item | AI Confidence | Best Tool | Rationale |
|---|---|---|---|
| Verify public_token generation uses crypto.randomUUID() | **95%** | Codex | Find the quote creation code, verify the token generation method. If it's not cryptographically random, replace with crypto.randomUUID(). Simple search-and-verify task |
| Implement access credential column encryption | **72%** | Claude | Column-level encryption in Supabase requires either application-level encryption (encrypt before insert, decrypt after select) or Supabase Vault (if available on your plan). Claude can implement application-level encryption using Node.js crypto module (AES-256-GCM), but the implementation has nuances: key management (where does the encryption key live?), handling encrypted data in queries (you can't search encrypted columns), and migration of existing plain-text data. Expect 2-3 revision cycles. The encryption itself is straightforward; the key management and migration are where complexity lives |
| Secrets rotation procedure documentation | **85%** | Claude | Claude can write the step-by-step procedure for rotating each API key (Twilio, Resend, Supabase, etc.) including where the key is configured, what breaks during rotation, and how to verify the new key works. This is documentation, not code. Claude excels at this |
| Verify Sentry scrubs PII from error reports | **80%** | Claude | Claude can write the Sentry configuration that enables data scrubbing, defines which fields to scrub (phone, email, access_code), and implements beforeSend hooks that redact sensitive data. Sentry's SDK documentation is well-known to AI models. Risk: missing a field that contains PII in an unexpected format |

---

## 2. TCPA and Communication Compliance

| Item | AI Confidence | Best Tool | Rationale |
|---|---|---|---|
| Add SMS consent checkbox to quote form with TCPA-compliant language | **92%** | Either | Form field addition with specific label text. The consent language is provided verbatim in the addendum. AI adds the checkbox, wires it to form state, and includes it in the submission payload. Standard React form work |
| Add consent_given, consent_timestamp, consent_method columns to leads table | **97%** | Either | Standard SQL migration. Three columns, clear types. AI gets this right every time |
| Implement STOP processing via Twilio webhook | **75%** | Claude | This requires: (1) creating a webhook endpoint that Twilio calls when an incoming SMS contains STOP, (2) parsing the Twilio webhook payload, (3) finding the contact by phone number, (4) updating their opt-out status, (5) sending a confirmation reply. Claude knows the Twilio webhook format well. The complexity is in step 2-3: Twilio's webhook format has specific field names, and phone number matching requires normalization (E.164 format). Expect one revision cycle for phone number matching edge cases |
| Classify all SMS templates as transactional vs marketing | **55%** | Claude | Claude can flag likely classifications based on content analysis, but the legal distinction requires human judgment. A "your crew arrives tomorrow at 9am" is clearly transactional. A "we haven't heard from you in 60 days" is clearly marketing. But "how was your experience? Reply 1-5" sits in a gray area — it's service quality measurement (transactional-ish) but also leads to a review request (marketing-ish). A lawyer would give you a definitive answer. Claude gives you a reasonable starting point |
| Enforce consent check before marketing SMS sends | **88%** | Either | Add a database query before each SMS send: check if contact has consent_given = true. Block send if not. This is a guard clause added to the existing SMS send function. Clean, mechanical implementation |
| Add business name prefix to all SMS templates | **95%** | Codex | Search all SMS template strings in the codebase, prepend "A&A Cleaning: " to each one. Text manipulation across multiple files. Perfect Codex task |

---

## 3. Accessibility (WCAG 2.1 AA)

| Item | AI Confidence | Best Tool | Rationale |
|---|---|---|---|
| Fix gold color contrast | **95%** | Either | Darken gold hex value in CSS tokens to achieve 4.5:1 ratio. AI can calculate the required luminance and suggest a specific hex value. Apply across Tailwind config and globals.css. Mechanical change |
| Add keyboard support to before/after slider | **82%** | Claude | Adding role="slider", aria attributes, and keydown handlers for ArrowLeft/ArrowRight/Home/End. Claude understands the ARIA slider pattern well. Risk: the existing slider implementation may use a specific library or custom drag logic that Claude needs to integrate with. If it's a custom implementation, Claude can add keyboard handlers. If it's a third-party component, the approach depends on the component's API |
| Add lang="es" to Spanish content | **88%** | Codex | Codex can search for Spanish text patterns and wrap them with lang="es". The challenge is identifying which text is Spanish versus English in bilingual components. For employee portal components where the entire interface is Spanish, this is straightforward. For bilingual labels ("Full name / Nombre completo"), Codex needs to split them into separate spans. Expect 85-90% accuracy with manual review of edge cases |
| Add aria-live to testimonial carousel | **93%** | Either | Adding aria-live="polite" to the content container and aria-roledescription="carousel" to the section. Small, well-defined change. AI gets this right |
| Integrate axe-core for automated testing | **90%** | Either | Standard dev dependency installation and configuration. React + axe-core integration is well-documented. AI produces correct setup including console logging of violations in development mode |
| Integrate eslint-plugin-jsx-a11y | **95%** | Either | Standard ESLint plugin installation and configuration. AI adds the plugin to .eslintrc, enables recommended rules, and identifies any current violations. Deterministic output |
| Accessibility statement page | **88%** | Claude | Claude writes the page content (commitment, known limitations, contact info) and creates the Next.js page component. The content follows a standard template used by thousands of websites. Risk: the content should be reviewed by a human for accuracy — does it accurately describe what the site does and doesn't do? |
| Manual keyboard testing | **0%** | Human only | AI cannot press Tab on your keyboard and observe what happens on your screen. This is inherently human work |
| Manual screen reader testing | **0%** | Human only | Same — AI cannot run VoiceOver and listen to announcements |
| 200% zoom testing | **0%** | Human only | Same — AI cannot resize your browser and observe layout behavior |

---

## 4. Content Creation

This is where the human-AI partnership is most nuanced. AI can produce fluent, well-structured content, but content that converts commercial buyers requires authenticity, accuracy, and specificity that AI can only approximate.

| Item | AI Confidence | Best Tool | Rationale |
|---|---|---|---|
| Homepage hero headline and subheadline | **70%** | Claude | Claude can generate 10 variants based on the strategic positioning in Section 51. But the winning headline needs to resonate with how mom's actual clients think and talk about cleaning services. Claude generates options; mom and you pick the one that feels right. Risk: AI-generated headlines sound polished but generic. The best headline will come from something mom says in conversation that Claude refines |
| About page from recorded interview | **85%** | Claude | Claude excels at turning raw transcripts into polished narratives. Give it the audio transcript from the Day 6 conversation and say "turn this into a 600-word about page that positions the owner as a credible, experienced professional in commercial and construction cleaning in Austin." The output will be 85-90% usable. Human review for tone — does it sound like mom or like a marketing agency? |
| Service page body content (per page) | **75%** | Claude | Claude can produce 800-1200 words per service page with Austin-specific references, process descriptions, and FAQ sections. The content brief (recommended doc #2) raises this to 85%. Without the brief, Claude fills in plausible but potentially inaccurate details about how mom actually delivers the service. Risk: Claude writes confidently about processes that don't match mom's actual workflow. Every service page must be reviewed by mom |
| City/service area page content | **80%** | Claude | Claude can generate unique content for each city page incorporating real geographic details (neighborhoods, landmarks, building types). Austin-area knowledge is well-represented in AI training data. Risk: Claude may reference a neighborhood or building that doesn't exist, or associate a city with a characteristic that's outdated. Spot-check geographic claims |
| Blog posts (SEO-targeted) | **82%** | Claude | Claude produces excellent first-draft blog content for commercial cleaning topics. Keyword targeting, heading structure, and internal linking can be specified in the prompt. The content is factually solid for industry topics. Risk: blog posts lack the "practitioner voice" that makes content feel authoritative versus generic. Mitigation: include specific examples from mom's experience in the prompt |
| Email sequence templates (Section 67) | **90%** | Claude | The email templates in Section 67 are already well-written. Claude can adapt, refine, or generate variations with high accuracy. Email copywriting is one of Claude's strongest content capabilities. Variable substitution ({client_name}, {service_type}) is handled correctly. Risk: tone calibration — commercial cleaning clients expect professional but not corporate. Claude sometimes defaults to overly formal language |
| Google Business Profile description | **85%** | Claude | 750-character keyword-rich business description following the template in Section 56. Claude produces this effectively. Human review for keyword stuffing — Claude sometimes over-optimizes and the description reads like an SEO exercise rather than a business description |
| LinkedIn profile content (About section, headline) | **88%** | Claude | Professional positioning content is Claude's wheelhouse. The 2,600-character About section specified in Section 68.2 is a strong Claude output. Risk: the content may not match mom's voice. Read it aloud — does it sound like her or like a consultant? |
| Job listing content (per tier) | **90%** | Claude | Job listings follow predictable structures. The bilingual listings in Section 71.3 are well-specified. Claude produces these accurately including Spanish translations. Risk: pay ranges and specific requirements must be verified against mom's actual needs |
| FAQ content | **80%** | Claude | Claude generates comprehensive FAQ content for commercial cleaning. Risk: the best FAQ answers come from real questions clients actually ask, not from AI prediction of what they might ask. Start with AI-generated FAQs, then replace with real questions as they surface |
| Case study content | **70%** | Claude | Claude can structure a case study from inputs (client type, scope, challenge, outcome, photos). But the compelling details — the specific challenges, the timeline pressure, the client's reaction — come from mom's memory, not AI generation. AI structures; human provides the substance |
| Review response templates | **92%** | Claude | Review responses follow clear patterns by star rating. Claude produces appropriate, professional responses that don't sound robotic. This is one of the most reliable Claude content outputs |
| Capabilities package content | **80%** | Claude | Claude can assemble the sections (company overview, services, safety program, insurance, references) from existing website content. The PDF generation itself requires code (Codex territory). The content assembly is Claude territory. Risk: ensuring all content is current and accurate |
| Privacy policy review | **75%** | Claude | Claude can compare the existing privacy policy against actual data practices and flag discrepancies. But privacy policy legal language has specific implications that Claude may not fully appreciate. For a small business, Claude's review catches 80% of issues. For complete assurance, have a lawyer review the final version ($200-$500 one-time) |

---

## 5. Database and Backend Features

| Item | AI Confidence | Best Tool | Rationale |
|---|---|---|---|
| Seed data script | **88%** | Either (Codex preferred) | The prompt in Section 17.2 is detailed and specific. Codex or Claude produces a comprehensive seed script. Risk: UUID references between tables (profiles → jobs → assignments → checklists) must be consistent. AI sometimes generates UUIDs for one table that don't match foreign keys in another. Test by running the script and checking foreign key constraints |
| Database migrations (new columns, tables) | **93%** | Either | Adding columns, creating tables, adding indexes — these are deterministic SQL operations. AI produces correct migrations from clear specifications. Risk: destructive migrations on production data (ALTER TABLE with data loss potential). Always review migrations before running on production |
| RLS policy creation for new tables | **78%** | Claude | RLS policies require understanding the access control intent and translating it into PostgreSQL policy expressions. Claude can write RLS policies but the logic can be subtle — a policy that checks `auth.uid() = user_id` works differently from one that checks `auth.uid() IN (SELECT user_id FROM assignments WHERE job_id = jobs.id)`. Each policy needs manual verification with test queries. AI writes the policy; human tests it with different user contexts |
| API route creation (new endpoints) | **85%** | Either | Next.js API route handlers with Supabase queries, input validation, and error handling. AI produces clean route handlers following the established patterns in the codebase. Codex is better here because it can reference existing routes for pattern consistency. Risk: subtle auth checks or business logic that AI implements differently from existing routes |
| Supabase Edge Functions (if needed) | **70%** | Claude | Less common than API routes in AI training data. Supabase Edge Functions use Deno, not Node.js, which introduces runtime differences. Claude can write them but expect more revision cycles. Codex may have less Deno experience depending on training data |
| QuickBooks integration debugging | **55%** | Claude | QuickBooks API is complex, poorly documented compared to modern APIs, and has version-specific quirks. OAuth token refresh, API rate limits, field mapping inconsistencies, and error handling make this one of the hardest integration tasks. Claude can help with specific error messages and API call construction, but the iterative debugging cycle (try → fail → read error → adjust → try again) is inherently human-paced. AI is useful as a reference; human drives the debugging |
| Twilio webhook implementation | **82%** | Claude | Twilio webhook payloads are well-documented and widely represented in AI training data. Claude can implement incoming SMS handling (for STOP processing) with correct payload parsing and response formatting. Risk: webhook security (validating the request actually came from Twilio via signature verification) — Claude sometimes omits this step |
| Stripe Checkout integration | **85%** | Either | Stripe's API is extremely well-documented and heavily represented in AI training data. Creating a checkout session, handling webhooks, and recording payment status is a well-trodden path. AI produces correct implementations. Risk: webhook signature verification and handling edge cases (payment fails, customer disputes, partial refunds). These edge cases require specific handling that AI may not include in the initial implementation |
| Recurring job scheduling logic | **75%** | Claude | Recurrence rules (weekly, bi-weekly, monthly, custom) with exception handling (skip holidays, handle crew changes, modify individual instances) is algorithmically complex. Claude can implement basic recurrence but the edge cases are numerous. What happens when a recurring job falls on a holiday? When the assigned crew member quits? When the client pauses service for a month? Each edge case requires specification. AI implements the specification; human identifies the edge cases |
| Time tracking (clock in/out) | **85%** | Either | Straightforward feature: record timestamps and geolocations on status changes. Calculate hours from timestamps. Display in employee portal and admin. AI handles this well. Risk: timezone handling (all times in CT), crossing midnight on overnight shifts, and GPS accuracy on mobile devices |
| Job costing calculation | **88%** | Either | Revenue minus (labor hours × rate) minus (supply usage × unit cost) = gross margin. Simple arithmetic on well-defined inputs. AI implements the queries and calculations correctly. Risk: the calculation is only as good as the input data. If time tracking isn't accurate or supply usage isn't logged, the numbers are wrong regardless of correct code |

---

## 6. Frontend Features

| Item | AI Confidence | Best Tool | Rationale |
|---|---|---|---|
| Client portal (magic link auth, job/invoice views) | **80%** | Codex | Multiple pages, authentication flow, data fetching, and conditional rendering. Codex handles this well by referencing existing employee portal patterns. Magic link auth via Supabase is well-documented. Risk: the client portal touches data from multiple tables (jobs, quotes, invoices, messages, documents) and needs proper RLS to ensure clients only see their own data. The data access layer is where bugs hide |
| Admin dashboard UI adjustments based on mom's feedback | **65%** | Claude | Mom will say things like "I want to see today's jobs first" or "this is too many clicks to respond to a lead." Translating her feedback into specific UI changes requires human interpretation. Once you know the specific change (move this card up, add a quick-action button, collapse this section), Claude or Codex implements it at 90%+ confidence. The translation from feedback to specification is the human bottleneck |
| Employee portal before-photo requirement | **88%** | Either | Extend existing photo upload flow to require before-photos when status moves to in_progress. The photo infrastructure exists. This is adding a gate condition and a new photo_type field. AI handles the extension cleanly |
| Authority bar connected to live database | **90%** | Either | Replace static constants with server-side database queries (COUNT jobs, COUNT DISTINCT clients, AVG rating). Simple queries, simple component update. AI produces this correctly. Cache with ISR revalidation to avoid querying on every page load |
| Blog infrastructure (route, layout, MDX support) | **88%** | Codex | Next.js blog with MDX is extremely well-documented. Codex can set up the route group, layout, MDX configuration, and first post template. The App Router MDX setup has some specific configuration requirements that Codex handles correctly |
| Portfolio photo library in admin | **82%** | Either | New admin view: grid of photos with filtering (service type, date, client), "promote to website" action, "export" action. Standard CRUD interface. AI builds it following existing admin module patterns. Risk: image optimization and thumbnail generation — serving hundreds of full-resolution photos in a grid view will be slow without thumbnails |
| Digital proposal PDF generator | **72%** | Claude | Server-side PDF generation in Next.js has multiple approaches (react-pdf, Puppeteer, html-to-pdf). Each has tradeoffs. Claude can implement any of them but the layout precision required for a professional proposal (margins, page breaks, header/footer, branded styling) requires iteration. Expect 2-4 revision cycles to get the visual output right. AI generates functional PDF; human tunes the presentation |
| One-page leave-behind PDF | **75%** | Claude | Same PDF generation challenges as above but simpler layout (single page, fixed design). Once the PDF generation approach is established for proposals, this reuses the same infrastructure with different content |
| Social post draft generator from job data | **88%** | Claude | Generate caption text from structured data (service type, area, scope) and suggest hashtags. This is natural language generation from templates — Claude's core strength. The generated captions will be 90% usable with minor human touch for authenticity |
| PWA manifest and service worker | **85%** | Either | Web app manifest is a standard JSON file. Basic service worker for asset caching is well-documented. AI produces correct implementations. Risk: service worker caching strategies (cache-first vs network-first for different resource types) require understanding which resources are static and which are dynamic. Incorrect caching strategy serves stale data |
| Offline data caching for employee portal | **70%** | Claude | Caching today's assignments in IndexedDB for offline access. The IndexedDB infrastructure exists (photo queue). Extending it to structured data is more complex — syncing cached data when connectivity returns, handling conflicts (admin changed the schedule while employee was offline), invalidating stale cache. Claude can implement the basic pattern but conflict resolution requires careful specification |
| Push notifications | **78%** | Claude | Web Push API with service worker. The technical implementation is well-documented. Risk: browser permission UX (when and how to ask for notification permission without annoying the user), payload formatting, and handling notification clicks (deep-linking to the relevant page). AI implements the plumbing; human designs the permission flow and notification strategy |

---

## 7. External Service Configuration

These are tasks where AI provides guidance but a human must execute in external dashboards and service providers.

| Item | AI Confidence in Guidance | AI Can Execute? | Rationale |
|---|---|---|---|
| Vercel environment variables | 95% (tells you exactly what to set) | No — human clicks in Vercel dashboard | AI produces the exact list with correct variable names and descriptions. Human copy-pastes into Vercel |
| Supabase Auth configuration (MFA, signup restrictions) | 90% (tells you exactly what to configure) | No — human clicks in Supabase dashboard | Same pattern — AI guidance, human execution |
| Domain purchase and DNS configuration | 85% (tells you which records to set) | No — human interacts with registrar | AI can specify exact DNS records (A record, CNAME, SPF, DKIM, DMARC) but human must enter them in the registrar's interface |
| Google Business Profile setup | 80% (provides all content and configuration) | No — human creates profile in Google | AI writes the business description, suggests categories, prepares Q&A content. Human enters it in the GBP interface. Verification is entirely human |
| Google Analytics / Search Console setup | 85% (provides tracking ID, configuration) | No — human creates properties and verifies ownership | Standard setup with clear steps. AI provides the measurement ID to add to code |
| Twilio production number purchase | 70% (tells you what to buy) | No — human purchases in Twilio console | AI advises on number type (local Austin number, SMS-enabled). Human purchases and configures |
| Resend domain authentication | 85% (provides exact DNS records) | No — human adds records to DNS | Resend provides the specific SPF and DKIM records. AI can guide the process but human adds records to the domain provider |
| Google Ads campaign setup | 60% (provides strategy, keywords, structure) | No — human creates in Google Ads | AI can specify campaign structure, keywords, bid strategy, and ad copy. But Google Ads interface changes frequently and the campaign creation flow is entirely UI-driven. AI guidance is valuable; execution is human |
| Meta Pixel installation | 90% (provides exact code) | Partially — AI writes the code, human creates the Pixel in Meta Business Manager | The pixel base code and event triggers are code that AI writes and Codex implements. But creating the Pixel ID requires logging into Meta Business Manager |
| Indeed job posting | 85% (provides content) | No — human posts on Indeed | AI writes the complete job listing content (Section 71.3 provides templates). Human copy-pastes into Indeed's posting interface |
| Insurance certificate management | 20% (can describe what to track) | No — entirely human/broker interaction | Insurance is obtained from brokers, certificates are issued by carriers. AI can design the tracking system in the platform but cannot interact with insurance companies |

---

## 8. Business and Interpersonal Tasks

These are the items where AI assistance ranges from helpful to irrelevant.

| Item | AI Confidence | Rationale |
|---|---|---|
| Mom conversation (Day 6) | **15%** | AI can prepare the question list and help process the transcript afterward. But the conversation itself — getting mom to open up about her story, her pride in her work, her real competitive advantage — is entirely human. AI cannot build family trust or read emotional cues about which topics energize her |
| Testimonial collection from clients | **25%** | AI writes the request template (Section 64 provides it). But sending the text, following up when they don't respond, and maintaining the relationship that makes them willing to help is entirely human |
| Mom's adoption of admin dashboard | **10%** | AI can build tutorials, simplify UI, and create user guides. But whether mom actually uses the system depends on her comfort level, her daily routine, and her belief that it helps rather than hinders her work. This is change management, not technology |
| Crew adoption of employee portal | **15%** | Same dynamic. AI built the portal. AI can create the quick-start card. Whether crew members pull out their phones at 6 AM on a construction site and use the app depends on their habits, their crew lead's enforcement, and whether it feels useful or bureaucratic |
| Pricing strategy | **40%** | AI can research market rates, calculate cost-plus pricing, and model different pricing scenarios. But the final pricing decisions involve competitive intelligence (what does the GC actually pay?), relationship dynamics (is this a client worth discounting to land?), and gut-level market knowledge that mom has and AI doesn't |
| Contract negotiation with GCs/PMs | **20%** | AI can prepare proposal documents and suggest terms. But negotiating terms, reading the room, knowing when to push and when to concede — this is human judgment in a high-stakes interpersonal context |
| Association memberships and networking | **10%** | AI can tell you which associations to join and what to say at events. But showing up, shaking hands, and building relationships is entirely human |
| Google review requests (personal asks) | **30%** | AI automates the post-job SMS request pipeline. But the highest-converting review requests are personal — mom texting a PM she's worked with for years. AI handles the mass automation; humans handle the personal asks that get 40-50% conversion |
| Hiring decisions | **25%** | AI can screen applications (matching experience to requirements) and draft interview questions. But evaluating whether a person will be reliable, hard-working, and a good cultural fit is human judgment. Mom has 15+ years of pattern recognition about who will work out and who won't |

---

## 9. Consolidated Confidence Table — Full Document Set

This is the complete picture: every major implementation area across all 75+ sections of documentation, rated for AI implementation confidence.

| Category | Specific Area | AI Confidence | Best Tool | Human Effort Required |
|---|---|---|---|---|
| **Security** | Security headers (next.config.js) | 97% | Either | Review diff, test site works |
| | Content Security Policy | 82% | Claude | Test site functionality with CSP active |
| | npm audit and vulnerability fixes | 70% | Codex | Review breaking changes from major version bumps |
| | Dependabot configuration | 95% | Either | Enable in GitHub UI |
| | dangerouslySetInnerHTML audit | 98% | Codex | Verify findings |
| | IDOR testing scripts | 60% | Claude | Execute tests manually, interpret results |
| | MFA enablement | 40% | Human mostly | Dashboard configuration per service |
| | Security event logging | 78% | Codex | Review logging points, tune thresholds |
| | Admin audit trail | 82% | Codex | Review coverage, test completeness |
| | Token security verification | 95% | Codex | Verify findings |
| | Access credential encryption | 72% | Claude | Key management decisions, migration testing |
| | CORS verification | 85% | Either | Confirm against actual external connections |
| | Session management | 70% | Claude | Verify Supabase-specific implementation |
| | Rate limiting on auth routes | 88% | Claude | Tune rate limits for real usage patterns |
| **Compliance** | TCPA consent checkbox | 92% | Either | Verify legal language accuracy |
| | STOP processing (Twilio webhook) | 75% | Claude | Test with real phones, verify blocking works |
| | SMS classification (transactional/marketing) | 55% | Claude | Legal judgment on gray-area messages |
| | CAN-SPAM email compliance | 90% | Either | Verify physical address, test unsubscribe |
| | Privacy policy vs actual practices | 75% | Claude | Legal review recommended |
| | Texas sales tax calculation | 88% | Either | Verify rate, verify exemption logic |
| | OSHA HazCom SDS tracking | 80% | Either (for platform feature) | Mom must actually compile the SDS documents |
| **Accessibility** | Gold contrast fix | 95% | Either | Verify visually |
| | Slider keyboard support | 82% | Claude | Test with keyboard |
| | lang="es" attributes | 88% | Codex | Review edge cases in bilingual components |
| | aria-live on carousel | 93% | Either | Test with screen reader |
| | axe-core integration | 90% | Either | Review violation reports |
| | eslint-plugin-jsx-a11y | 95% | Either | Fix any violations found |
| | Accessibility statement page | 88% | Claude | Verify accuracy of claims |
| | Manual a11y testing (keyboard, zoom, screen reader) | 0% | Human only | Irreplaceable human testing |
| **Content** | Homepage hero | 70% | Claude | Mom and you select from options |
| | About page from interview | 85% | Claude | Verify tone matches mom's voice |
| | Service pages (5 total) | 75% | Claude | Mom verifies accuracy of every page |
| | City/area pages (10 total) | 80% | Claude | Spot-check geographic claims |
| | Blog posts (ongoing) | 82% | Claude | Review for practitioner authenticity |
| | Email sequence templates | 90% | Claude | Tone calibration |
| | Job listing content (bilingual) | 90% | Claude | Verify pay ranges and requirements |
| | Review response templates | 92% | Claude | Minor personalization per review |
| | Capabilities package content | 80% | Claude | Verify all sections current |
| | FAQ content | 80% | Claude | Replace with real questions over time |
| | GBP description and posts | 85% | Claude | Verify keyword density isn't unnatural |
| | LinkedIn profile content | 88% | Claude | Verify voice matches mom |
| **Database** | Seed data script | 88% | Codex | Verify FK consistency, run and debug |
| | New table migrations | 93% | Either | Review before running on production |
| | RLS policies | 78% | Claude | Test with multiple user contexts |
| | API route creation | 85% | Either | Test auth and validation edge cases |
| | QuickBooks integration | 55% | Claude | Iterative debugging cycle |
| | Stripe integration | 85% | Either | Webhook edge cases |
| | Recurring job scheduling | 75% | Claude | Specify and handle edge cases |
| | Time tracking | 85% | Either | Timezone and midnight-crossing edge cases |
| | Job costing | 88% | Either | Validate calculation against real numbers |
| **Frontend** | Client portal | 80% | Codex | RLS and data access verification |
| | Admin UI adjustments (from mom feedback) | 65% | Claude | Translate feedback to specification |
| | Employee portal before-photos | 88% | Either | Test on real phone |
| | Authority bar live data | 90% | Either | Set minimum display thresholds |
| | Blog infrastructure | 88% | Codex | Standard Next.js MDX setup |
| | Portfolio photo library | 82% | Either | Image optimization tuning |
| | PDF generators (proposal, leave-behind) | 72% | Claude | Visual layout iteration |
| | PWA manifest + service worker | 85% | Either | Caching strategy decisions |
| | Offline data caching | 70% | Claude | Conflict resolution specification |
| | Push notifications | 78% | Claude | Permission UX design |
| **External Config** | Vercel env vars | 95% guidance | Human executes | Copy-paste from AI output |
| | Domain + DNS | 85% guidance | Human executes | Follow AI instructions |
| | GBP setup | 80% guidance | Human executes | Enter AI-prepared content |
| | GA4 / Search Console | 85% guidance | Human executes | Standard setup |
| | Google Ads | 60% guidance | Human executes | Ongoing management is human |
| | Meta Pixel code | 90% | Codex writes code | Human creates Pixel ID |
| **Business** | Mom conversation | 15% | Human only | AI prepares questions, human has conversation |
| | Testimonial collection | 25% | Human mostly | AI writes template, human sends and follows up |
| | Dashboard adoption by mom | 10% | Human only | Change management, not technology |
| | Crew portal adoption | 15% | Human only | Habits and enforcement |
| | Pricing decisions | 40% | Claude assists | Market knowledge and judgment |
| | Contract negotiations | 20% | Claude prepares materials | Human negotiates |
| | Networking and partnerships | 10% | Human only | Relationship building |
| | Hiring decisions | 25% | Claude screens | Human evaluates fit |

---

## 10. What This Means Practically

### What you should send to AI without hesitation

- Security headers, CSP, dependency management
- Database migrations, seed scripts, new API routes
- TCPA consent checkbox and database columns
- Accessibility fixes (contrast, ARIA, keyboard support)
- Email and SMS templates
- Content drafts from detailed briefs
- Blog infrastructure, PWA setup, standard feature implementations
- Job listings, review responses, FAQ content
- Configuration files (Dependabot, Sentry, ESLint plugins)

These items are in the 80-97% confidence range. AI produces correct or near-correct output from clear specifications. Your role is review, testing, and deployment.

### What you should send to AI with detailed specification and expect revision

- RLS policies (test with multiple user contexts)
- Client portal data access layer
- Recurring scheduling logic (specify every edge case)
- PDF generation (expect visual iteration)
- Offline caching with sync (specify conflict resolution)
- QuickBooks integration debugging
- Security event logging placement across routes
- Push notification permission flow

These items are in the 65-80% range. AI produces a strong starting point but the output needs human judgment on edge cases, business logic, and integration points. Budget for 1-3 revision cycles.

### What AI cannot do for you

- Mom conversation and content verification
- Dashboard and portal adoption
- Manual accessibility testing
- External service dashboard configuration (MFA, GBP, Google Ads)
- Testimonial and review collection
- Pricing and contract decisions
- Networking and partnership building
- Hiring judgment

These items are below 40% AI confidence. AI provides preparation materials (question lists, templates, checklists) but the execution is entirely human.

### The compound effect

Across the entire document set, approximately:
- **40% of implementation work** can be handled by AI at 85%+ confidence (configuration, infrastructure, standard features, content drafts)
- **30% of implementation work** can be significantly accelerated by AI at 65-85% confidence (complex features, integration work, compliance implementation)
- **20% of implementation work** benefits from AI preparation but requires human execution (testing, configuration, business decisions)
- **10% of implementation work** is purely human (conversations, adoption, relationship building)

For a solo developer working 20 hours per week, AI assistance effectively multiplies that to 35-45 hours of output per week for the 70% of work where AI is productive. The remaining 30% — the testing, the mom conversations, the manual configuration, the adoption challenges — still takes 20 hours of human time. But without AI, the 70% of codeable and writable work would take 60-80 hours per week, making the project infeasible for one person.

The documents you've built are comprehensive enough that most AI prompts can reference specific sections for context, which is the single biggest factor in AI output quality. A prompt that says "implement the TCPA consent checkbox as specified in Section 2.2 of the compliance addendum with the exact consent language provided" produces dramatically better output than "add TCPA compliance to the quote form."

**Your documentation is the AI's instruction manual.** The more precise the documentation, the higher the AI confidence level. This is the real value of the 80,000+ words you've assembled — not that a human will read them all, but that they provide the specification precision that makes AI implementation reliable.
