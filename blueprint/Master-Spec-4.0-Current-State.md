# Master Spec 4.0 — Current State

Last Updated: 2026-03-21
Audit Mode: Post-3.0 deep normalization pass
Scope Target: Remaining work, execution plan, validated upgrade roadmap

---

## 0) Method

This 4.0 spec is a continuation of `Master-Spec-3.0-Current-State.md`, with two strict rules:

1. Track only what is still open, risky, or not yet verified in production-like conditions.
2. Define the feature roadmap that transforms this from a developer-built tool into an operator-friendly business system.

Treat 3.0 as historical baseline; treat 4.0 as active execution truth.

Status legend:

- ✅ complete and verified in code/build
- 🟢 implemented and stable at code level; awaiting production validation
- 🟡 implemented but not fully validated in real-world conditions
- ❌ not implemented
- ⏸ deferred intentionally

---

## 1) Delta From 3.0 (What Changed)

### 1.1 Landed Since 3.0 Snapshot

- ✅ **Batch G-2 complete** (employee decomposition finalized).
- ✅ **Batch H complete** (public route-group layout normalization with shared chrome ownership).
- ✅ **J complete in code** (observability normalization foundation landed):
  - `src/lib/sentry.ts`
  - `src/instrumentation.ts`
  - `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
  - `src/app/error.tsx`, `src/app/(admin)/admin/error.tsx`, `src/app/(employee)/employee/error.tsx`
  - `src/app/(admin)/admin/loading.tsx`, `src/app/(employee)/employee/loading.tsx`
- ✅ **K complete in code** (distributed rate limiting with Upstash):
  - `src/lib/rate-limit.ts`, `middleware.ts`, `.env.example`, `src/lib/env.ts`
  - Route upgrades in `src/app/api/quote-request/route.ts` and `src/app/api/ai-assistant/route.ts`
- ✅ **Product decisions resolved** (inventory gate + industry routes — see §3.2).
- ✅ **User manual delivered** (`A&A-Cleaning-Platform-User-Manual.md`).

### 1.2 Verified Build State

- ✅ `npx tsc --noEmit` passes.
- ✅ `npx next build` passes.
- ✅ `npm run lint` — 0 errors. 1 pre-existing warning in `src/lib/quickbooks.ts` (`networkError` unused). Fix: prefix with underscore or remove.

### 1.3 Drift Corrected by 4.0

3.0 still contains stale entries (e.g., G-2/J/K marked not started, H marked blocked, product decisions marked open). 4.0 supersedes all prior status lines.

---

## 2) Current System Readiness

### 2.1 Readiness Matrix

| Surface | Status | Notes |
|---|---|---|
| Public funnel | 🟢 | Layout normalized; core conversion stack stable |
| Admin operations | 🟢 | Core usable with improved resilience boundaries |
| Employee field app | 🟢 | Decomposition complete; Spanish-first boundary/loading added |
| API layer | 🟢 | Core paths hardened; distributed limiter active |
| Lib/domain architecture | 🟢 | Shared observability and fallback telemetry framework landed |
| Platform/config | 🟢 | Upstash-backed rate limiting integrated |
| Data/security | ✅ | Strongest layer remains migrations/RLS |

### 2.2 Important Caveat

🟢 at code level does not equal launch sign-off. Real credential/device validation remains mandatory before production declaration.

---

## 3) Remaining Work Register (Execution-Only)

### 3.1 R-01 — Credential-Gated Manual Validation

**State:** 🟡 Not yet executed

**Why it remains:** Cannot be proven by static build/lint.

**Required checks:**

| # | Scenario | Provider | Evidence Needed |
|---|---|---|---|
| 1 | SMS delivery + retry on real device | Twilio | Delivery receipt + retry log |
| 2 | Offline photo queue sync under connectivity drop | Supabase Storage | Photo appears after reconnect |
| 3 | QuickBooks OAuth callback + sync | Intuit | Token exchange + invoice creation in sandbox |
| 4 | Sentry capture quality | Sentry | Event with tags, metadata, runtime context |
| 5 | Rate-limit burst → deterministic 429 | Upstash | Response headers + 429 on request 6 |

**Acceptance gate:** End-to-end pass log with timestamp, tester, environment, and evidence per scenario.

---

### 3.2 R-02 — Product Decisions

**State:** ✅ Resolved

**Decision A: Employee inventory phase gate**
- **Choice:** Gate by environment flag. Hidden by default.
- **Implementation:** `NEXT_PUBLIC_EMPLOYEE_INVENTORY=false` in `.env`. Employee page conditionally renders `EmployeeInventoryClient`.
- **Re-entry condition:** Enable globally after 2+ weeks of stable core-loop adoption.

**Decision B: Industry route strategy**
- **Choice:** Keep `/#industries` hash anchors for launch.
- **Re-entry condition:** Build dedicated `/industries/[slug]` pages when 2+ unique proof artifacts exist per vertical.

---

### 3.3 R-03 — Secrets & Environment Hygiene

**State:** 🟡 Partially verified

**Required actions:**

| # | Action | Status |
|---|---|---|
| 1 | Revoke previously exposed Upstash token | ☐ Pending (Upstash console) |
| 2 | Set production env vars on hosting provider | ☐ Pending (Vercel dashboard) |
| 3 | Confirm `.env.local` untracked | ✅ `git ls-files '.env*'` → only `.env.example` |
| 4 | Verify no secrets in tracked files | ✅ Confirmed |

**Acceptance gate:** All four rows marked ✅ with owner + date.

---

### 3.4 R-04 — Performance Hardening Pass

**State:** ⏸ Deferred until post-validation

**Scope:** Bundle/chunk analysis, hydration/TTI review, cache and media optimization.

**Acceptance gate:** Route budgets defined + baseline metrics captured + top regressions addressed.

---

## 4) Multi-Pass Execution Plan

### Pass 1 — Stability & Security Confirmation

**Status: Substantially complete. Two owner-pending items remain.**

| Check | Owner | Date | Result | Evidence |
|---|---|---|---|---|
| `git ls-files '.env*'` shows only `.env.example` | In-session | 2026-03-21 | ✅ Pass | Output confirmed |
| Old Upstash token revoked | Owner | — | ☐ Pending | Requires Upstash console |
| New Upstash token active locally | In-session | 2026-03-21 | ✅ Pass | Health check SUCCESS |
| New Upstash token active in production | Owner | — | ☐ Pending | Requires Vercel dashboard |
| `npx tsc --noEmit` | In-session | 2026-03-21 | ✅ Pass | Clean |
| `npm run lint` | In-session | 2026-03-21 | ✅ Pass* | 1 pre-existing warning |
| `npx next build` | In-session | 2026-03-21 | ✅ Pass | All routes generated |
| Rate-limit headers returned | In-session | 2026-03-21 | ✅ Pass | `X-RateLimit-*` confirmed |
| Strict tier 429 on burst | In-session | 2026-03-21 | ✅ Pass | Request 6 returned 429 |

**Exit criteria:** Two pending items closed with evidence.

### Pass 2 — Functional Real-World Validation

- Execute R-01 credential/device-gated runbook (§3.1).
- Capture failure evidence and remediation items.
- Re-run smoke checks after each fix.

### Pass 3 — Release Policy Finalization

- Confirm R-02 decisions are implemented in code (inventory flag + anchor links).
- Freeze launch scope boundary.
- Confirm user manual accuracy against final state.

### Pass 4 — Feature Roadmap Execution (§8)

- Begin P0 feature sprint.
- Keep scope controlled to avoid destabilizing launch-critical flows.

---

## 5) High-Risk Items to Watch

| # | Risk | Mitigation |
|---|---|---|
| 1 | False confidence: code-level green without real-device proof | R-01 runbook is mandatory before launch declaration |
| 2 | Operational drift: production env mismatch vs local | R-03 env parity checklist |
| 3 | Scope creep: mixing feature roadmap with launch gates | Passes 1-3 must close before Pass 4 begins |
| 4 | Documentation drift: 3.0 vs 4.0 inconsistency | 4.0 is canonical; 3.0 is archive only |
| 5 | Conversion underweight: ops features ship without matching public conversion depth | P0 includes 4 public conversion features (F-22–F-25) with equal priority to ops features |

---

## 6) Acceptance Gates for Launch Readiness

4.0 launch sign-off requires all gates passed:

| # | Gate | Status |
|---|---|---|
| 1 | Code/build gates (`tsc`, `lint`, `build`) | ✅ Complete |
| 2 | Product decisions signed | ✅ Complete (§3.2) |
| 3 | Secrets hygiene signed (rotation + env parity) | 🟡 Two items pending (§3.3) |
| 4 | Credential-gated runbook executed with evidence | 🟡 Not yet executed (§3.1) |

When all four pass: system is launch-ready at operational level. Feature roadmap (§8) begins.

---

## 7) Code Health Audit

Audit Date: 2026-03-21
Full findings: See `CODE-HEALTH-AUDIT.md`

**Summary:** 15 hotspots identified across maintainability, developer velocity, CPU, bundle, reliability, and network categories. No launch-blocking issues. Two findings are resolved by P0 features (F-25 resolves CTA duplication, F-01 + F-05 resolve AdminShell concentration). Remaining items are mapped to post-launch tech debt sprints.

No action required before Pass 4.

---

## 8) Feature Roadmap — Usability, Automation & Operator Experience

### 8.0 Design Principle

The platform is currently built as a **tool collection** — modules for leads, dispatch, QA, notifications. But the target operator doesn't think in modules. She thinks in questions:

- *"Did anyone ask for a quote today?"*
- *"Is the crew at the job site yet?"*
- *"Did they finish? Did it look good?"*
- *"Did we get paid?"*

And the website must answer the buyer's questions before they leave:

- *"Are these people legit?"*
- *"How much will this cost me?"*
- *"What if I'm not satisfied?"*
- *"Why should I pick them over the other company?"*

Every feature below is oriented toward **answering those questions before anyone has to ask them.** Features are grouped by surface, then prioritized into P0 (pre-launch or immediate post-launch), P1 (first 30 days), and P2 (90-day horizon).

**Balance principle:** The roadmap is weighted equally across operations (admin/employee workflow) and conversion (public website selling power). One without the other fails — a great website with broken ops loses customers after the first job, and great ops with a weak website never gets the customers in the first place.

### 8.0.1 Feature Acceptance Criteria Standard

Each feature must define completion using the same structure before development starts:

```markdown
Acceptance criteria:
1. Observable behavior that proves it works
2. Required edge-case handling
3. Validation method (manual, query, telemetry, or automated check)
```

### 8.0.2 Content Dependencies

Several roadmap items depend on non-code content and cannot be treated as pure engineering tasks.

| Feature | Content Needed | Owner | Est. Time |
|---|---|---|---|
| F-22 | City-specific descriptions and local proof points (5-10 cities) | Content Lead | 1-2 days |
| F-23 | 3-5 objection Q&As per service type | Owner/GM | 1 day |
| F-24 | Pricing ranges + SLA commitments per service | Owner/GM | 2-3 hours |
| F-26 | 5-10 case-study write-ups with photo pairs | Content Lead | 2-3 days |
| F-27 | Campaign-specific headlines and copy variants | Growth Lead | 1 day |
| F-28 | Recurring-proof content + calculator inputs | Owner/GM | 2-3 hours |

Rule: content must be drafted before a feature enters active development; content review and code implementation can run in parallel.

### 8.0.3 Testing Strategy by Feature Type

| Feature Type | Test Method | When |
|---|---|---|
| UI/component (F-01, F-05, F-12) | Visual verification + responsive check | Before merge |
| Notification (F-02, F-03, F-07, F-18, F-32, F-33) | Simulated trigger, queue verification, and real-send validation | Mock first, real creds before launch |
| Schema-dependent (F-04, F-08, F-13) | Migration + seed + query verification | Before feature code begins |
| Public content (F-22, F-23, F-24) | Content review + visual verification + structured-data validation | Before merge |
| Analytics (F-25) | Click event → DB verification → dashboard verification | End-to-end after CTA migration |
| Automation chains (F-07, F-18, F-32) | Trigger each step + timing checks + stop-condition validation | With accelerated cron/time simulation |

All features must pass `tsc + lint + build` before merge.

---

### 8.1 Admin — "Don't Make Me Hunt For It"

#### F-01: Morning Briefing Dashboard (P0)

**Problem:** Dashboard shows metrics. Operator needs actions.

**Solution:** Replace default admin landing with a prioritized daily action feed.

```
☀️ Good Morning — Here's Your Day

🔴 ACTION NEEDED (2)
├─ New lead: Maria Gonzalez (3 hrs ago) → [Call Her] [Send Quote]
└─ Job #412 completed — photos need review → [Review Now]

📋 TODAY'S SCHEDULE (3 jobs)
├─ 8:00 AM — Team A → 123 Main St (Final Clean)
├─ 10:30 AM — Team B → 456 Oak Ave (Office)
└─ 1:00 PM — Team A → 789 Elm St (Post-Const)

⏳ WAITING ON (1)
└─ Quote sent to Jake's Construction (2 days) → [Follow Up] [Mark Lost]

✅ YESTERDAY'S WINS
├─ 2 jobs completed, both approved
└─ $1,850 in completed work
```

**Implementation:**
- Server component querying: uncontacted leads (>1hr), pending QA, today's assignments, yesterday's completions
- Default view inside `AdminShell`
- Action buttons deep-link into relevant modules
- Time-aware greeting: morning / afternoon / evening

**Resolves audit finding:** §7.2B #8 (AdminShell module concentration) — briefing becomes the primary surface, reducing reliance on monolithic shell navigation.

**Acceptance criteria:**
1. Dashboard action items render within 3 seconds under normal local/staging load.
2. Uncontacted leads older than 1 hour appear in the 🔴 action section.
3. Action buttons navigate to the correct module with relevant context preloaded.
4. Empty states render cleanly (e.g., “No action items — great job today!”).
5. Greeting state changes correctly by time window (morning/afternoon/evening).

---

#### F-02: Lead Auto-Acknowledgment (P0)

**Problem:** Customer submits quote request → silence. May submit again or call competitor.

**Solution:** Instant automated response on both channels.

**To customer (email + SMS, 24/7 — no quiet hours):**
> "Hi [Name]! Thanks for reaching out to A&A Cleaning. We received your request and will call you within 1 hour. If you need us sooner: [phone]. — The A&A Team"

**To admin (SMS, respects quiet hours):**
> "🔔 New lead: [Name] from [Company] needs [Service Type]. Timeline: [ASAP/This Week]. Reply CALL to see details."

**Implementation:**
- Trigger from `quote-request` API route after successful DB insert
- Two new notification templates: `lead_ack_customer`, `lead_ack_admin`
- Uses existing Twilio (SMS) and Resend (email) pipelines

**Acceptance criteria:**
1. Customer SMS and email are sent within 60 seconds of valid form submission.
2. Admin SMS is sent within 60 seconds or deferred to 7:00 AM when in quiet hours.
3. Duplicate submissions do not produce duplicate acknowledgments for the same request fingerprint.
4. Provider failure creates retry-ready queue evidence.
5. Integration failures are captured by observability with actionable context.

---

#### F-03: Lead Aging Alerts (P0)

**Problem:** Lead arrives, admin gets busy, 18 hours pass, customer hires competitor.

**Solution:** Escalating automated reminders.

| Hours Since Submission | Action |
|---|---|
| 1 | SMS: "⚡ [Name] hasn't been contacted yet. [Call Now]" |
| 4 | SMS: "⚠️ [Name] still waiting (4 hrs). Leads contacted in 1hr convert 3x better." |
| 24 | SMS: "🔴 [Name] waiting 24 hours. Consider this lead at risk." |
| 48 | Auto-update status to "At Risk" in pipeline + morning briefing |

**Implementation:**
- Extend existing `lead-followup` cron route
- Add `last_contacted_at` + `followup_reminder_count` to `leads` table
- Cron runs every 30 min; deduplicates via reminder count

---

#### F-04: Quick Quote Templates (P0)

**Problem:** Building quotes from scratch is slow and error-prone.

**Solution:** Pre-saved templates by service type.

```
Quick Quote Templates
├─ 📋 Standard Office Clean — $XXX/visit
├─ 🏗️ Post-Construction — $XX/sq ft
├─ 🏢 Commercial Deep Clean — $XXX-$XXX
├─ 🔄 Recurring Weekly — $XXX/week
└─ [+ Create Custom Quote]
```

Select template → pre-fills service type, description, line items → adjust quantity/sqft → price auto-calculates → review → send.

**Implementation:**
- New `quote_templates` table: `id`, `name`, `service_type`, `default_line_items` (JSONB), `base_price`, `pricing_model` (flat/per_sqft/per_unit), `created_by`, `created_at`
- Template selector in quote creation flow
- Admin creates/edits templates from Settings

---

#### F-05: Simplified Sidebar Grouping (P0)

**Problem:** 10+ sidebar items overwhelms non-technical user.

**Solution:** Three clear groups matching usage frequency.

```
📥 DAILY WORK
├─ 🏠 Home (Morning Briefing)
├─ 📋 Leads & Quotes
├─ 🚐 Jobs & Dispatch
└─ ✅ Review & Approve

📊 BUSINESS
├─ 💰 Revenue
├─ 📈 Insights
├─ ⏱️ SLA Performance
└─ 👥 Hiring

⚙️ SETTINGS
├─ 🔔 Notifications
├─ 📦 Inventory
└─ ⚙️ Configuration
```

**Resolves audit finding:** §7.2B #8 (AdminShell module concentration) — clearer IA reduces cognitive load.

---

#### F-06: One-Tap Job Dispatch (P1)

**Problem:** Quote accepted → multiple steps across modules to create + assign + notify.

**Solution:** Single composite action card.

```
✅ Quote Accepted! Schedule the Job:
📅 When? [Tomorrow ▼] [Morning ▼]
👥 Who?  [Team A ▼] (available ✅)
[🚀 Schedule & Notify Crew]
```

**Implementation:**
- Chains: `ticket.create` → `assignment.create` → `notification.dispatch`
- Availability check before showing crew options
- Quick-pick time selectors instead of full calendar

---

#### F-07: Post-Job Automation Chain (P1)

**Problem:** After completion, admin must manually: review photos → follow up with customer → track payment.

**Solution:** Automated sequence triggered by employee marking job complete.

| Timing | Action | Requires Admin? |
|---|---|---|
| Immediately | SMS to admin: "Job #412 done. [Review Photos]" | Link to QA |
| After approval | Email to customer: "Your cleaning is complete!" | Automatic |
| 24hr post-approval | SMS to customer: "Rate 1-5" | Automatic |
| Rating < 3 | Alert to admin: "⚠️ Low rating on #412" | Admin follows up |
| Rating ≥ 4 | SMS to customer: "Leave us a Google review? [Link]" | Automatic |
| 48hr post-review-request | If no review posted: gentle reminder SMS | Automatic |
| 3 days, unpaid | Reminder to admin: "💰 #412 — payment not recorded" | Admin marks paid |

**Implementation:**
- New `post_job_sequence` table tracking fired steps per job
- Inbound SMS webhook parses 1-5 rating replies
- Google review link configurable in Settings
- `paid_at` + `payment_method` fields on ticket record

---

#### F-08: Simple Revenue Tracker (P1)

**Problem:** No "how much money did we make?" answer without QuickBooks.

**Solution:** Lightweight built-in revenue view.

```
💰 This Week
├─ Completed Jobs: 8
├─ Total Value: $4,200
├─ Paid: $2,800 ✅
└─ Unpaid: $1,400 ⏳
    ├─ Jake's Construction — $800 (5 days overdue)
    └─ Sunrise Properties — $600 (sent yesterday)
```

**Implementation:**
- `payment_status` enum (`pending` / `invoiced` / `paid` / `overdue`) + `payment_amount` on ticket
- "Mark as Paid" button per unpaid job
- Weekly summary in Morning Briefing (F-01)
- Auto-mark overdue after configurable threshold

---

#### F-09: Inline Help Tooltips + First-Login Tour (P1)

**Problem:** User manual exists but won't be read.

**Solution:** Contextual help embedded in the UI.

- `(?)` icons on non-obvious elements with tap-to-show tooltips
- 5-step guided overlay on first admin login
- Skippable, replayable from Settings
- `has_completed_tour` flag on admin profile

---

#### F-10: Smart Crew Suggestions (P2)

**Problem:** Admin must remember which crew is good at what, who's available, who's closest.

**Solution:** Ranked suggestion on dispatch.

```
Suggested: Team A
├─ ✅ Available on this date
├─ ✅ 12 post-construction jobs (most experienced)
├─ ✅ Last job 3 miles away (closest)
└─ ⭐ 4.8 avg quality rating
```

Score: availability (binary) × service-type experience × proximity × quality rating.

---

#### F-29: SLA Performance Dashboard (P1)

**Problem:** Morning Briefing (F-01) shows what to do today. But there's no view that answers: "are we consistently fast enough to win?"

**Solution:** SLA scoreboard in the Business section of the sidebar.

```
⏱️ SLA Performance — This Week

Lead Response Time (median): 12 min ✅
├─ Monday: 8 min ✅
├─ Tuesday: 22 min ⚠️ (2 leads waited >30 min)
├─ Wednesday: 9 min ✅
└─ Missed SLA count: 2 of 14 leads

Quote Turnaround (median): 3.2 hours ✅
Close Rate (MTD): 28% ⚠️ (target: 30%)
```

**Implementation:**
- Derived from existing `leads` timestamps + `last_contacted_at` field (F-03)
- Weekly aggregation component in Insights or standalone module
- Color-coded against KPI thresholds from revenue plan §6

**Revenue plan alignment:** §12.4.1, §6

---

#### F-30: Capacity Throttle Signal (P1)

**Problem:** If all crews are booked and ads are still running, new leads are wasted spend. Admin doesn't know when to pause campaigns.

**Solution:** Capacity warning in Morning Briefing and dispatch view.

```
⚠️ Capacity Alert
├─ This week: 14/15 crew-slots booked (93%)
├─ Next week: 9/15 slots booked (60%)
└─ Recommendation: Consider pausing ads if no crew availability opens up
    [View Schedule] [Pause Lead Intake]
```

**Implementation:**
- Derived from assignment count vs crew availability data
- Configurable threshold (e.g., warn at 85%, critical at 95%)
- "Pause Lead Intake" toggles a maintenance flag on public quote form (shows "We're fully booked this week — call us for next-week availability")

**Revenue plan alignment:** §12.4.2, §11.5

---

#### F-31: Referral Tracking (P2)

**Problem:** Referrals are the highest-margin leads but there's no way to track where they come from or incentivize them.

**Solution:** Simple referral source field on lead intake + post-job referral ask.

- Add "How did you hear about us?" dropdown on quote form (options: Google, Referral, Nextdoor, Social Media, Other)
- Post-job email (F-07 chain) includes: "Know someone who needs cleaning? Send them our way → [Referral Link]"
- Referral-sourced leads tagged in pipeline for separate conversion tracking

**Implementation:**
- `leads.source` enum or text field (expand existing if present)
- Referral link generates a trackable URL (`?ref=[customer_id]`)
- Admin pipeline filter by lead source

**Revenue plan alignment:** §12.5.2, §13.3

---

### 8.2 Employee — "Make It Impossible to Do Wrong"

#### F-11: Map & Directions Link (P0)

**Problem:** Employee sees address but must copy-paste into maps app.

**Solution:** "📍 Navegación" button on every job card.

```tsx
<a
  href={`https://maps.google.com/?daddr=${encodeURIComponent(job.address)}`}
  target="_blank"
  rel="noopener noreferrer"
  className="w-full py-3 bg-green-600 text-white text-lg font-semibold rounded-xl text-center block"
>
  📍 Navegación
</a>
```

One tap → directions. No copy-paste, no wrong turns.

---

#### F-12: Job-Day Summary View (P0)

**Problem:** Employee sees job list with no sequencing. Must figure out "what's first?"

**Solution:** Daily timeline at top of "Mis Trabajos."

```
📅 Hoy — Martes, 21 de Marzo

8:00 AM  → 123 Main St (Final Clean) ● AHORA
10:30 AM → 456 Oak Ave (Oficina)
1:00 PM  → 789 Elm St (Post-Construcción)

3 trabajos hoy
```

Current = highlighted. Completed = grayed + checkmark. Next = clearly marked.

**Schema dependency:** Requires `assignments.scheduled_start` (`timestamptz`) or equivalent planned-start field. Without this field, ordering falls back to non-operational sorting and cannot represent intended execution time reliably.

**Acceptance criteria:**
1. Employee sees jobs in chronological order for the selected day.
2. Current, next, and completed states render correctly.
3. Empty-day state renders with clear guidance.
4. Timeline respects locale formatting and timezone.
5. Validation method: compare UI order against assignment query sorted by scheduled start.

---

#### F-13: Photo Requirements Made Explicit (P1)

**Problem:** System asks for photos but crew doesn't know how many or of what.

**Solution:** Photo checklist per job type with specific required shots.

```
📸 Fotos Requeridas (4 de 6)
✅ Entrada principal — antes
✅ Entrada principal — después
✅ Baños — después
✅ Pisos — después
☐  Ventanas — después
☐  Basura retirada
[📷 Tomar Foto]
```

"Completar" button disabled until all required photos captured.

**Implementation:**
- `photo_requirements` JSONB on ticket/job type template
- Each: `{ label_es, label_en, type: "before"|"after"|"evidence", required: boolean }`
- Upload associates file with specific requirement

---

#### F-14: Completion Lockout (P1)

**Problem:** Employee can tap "Completar" without finishing checklist or uploading photos.

**Solution:** Button active only when all gates pass.

Gates:
1. ✅ All required checklist items checked
2. ✅ All required photos uploaded
3. ✅ Job status = "In Progress"

If attempted early:
```
⚠️ No puedes completar todavía:
☐ 2 items del checklist sin terminar
☐ 1 foto requerida faltante (Ventanas)
[Ver lo que falta]
```

**Impact:** Single biggest operational quality improvement. Enforcement by system, not by trust.

---

#### F-15: Automatic Time Logging Visibility (P1)

**Problem:** Start/complete timestamps exist in DB but aren't surfaced.

**Solution:**

**Employee view:**
```
⏱️ Mis Horas — Esta Semana
Lunes:  6.5 horas (2 trabajos)
Martes: 4.0 horas (1 trabajo) ● HOY
Total:  10.5 horas
```

**Admin view:** Crew hours in Insights + alerts for anomalous duration (way longer or shorter than expected).

---

#### F-16: GPS-Verified Crew Check-In (P2)

**Problem:** Admin doesn't know if crew arrived until they tap "Iniciar."

**Solution:** On "Iniciar" tap, check device location against job address.

- Within 500m: ✅ "Checked in at location"
- Far away: ⚠️ "You appear to be far from the job site. Start anyway?" (logged)

Admin dispatch view shows: `📍 Checked in at location (8:02 AM)`

---

### 8.3 Public Website — "Close the Deal Faster"

#### F-17: Instant Confirmation Page (P0)

**Problem:** After quote submission, customer sees generic "thank you." Missed conversion reinforcement.

**Solution:** Dedicated confirmation page with next-steps and continued engagement.

```
✅ We Got Your Request!

📞 Step 1: We'll call you within 1 hour
📋 Step 2: We'll send a detailed quote
✅ Step 3: Accept online with one click
🧹 Step 4: We clean. You relax.

Your reference: #QR-2026-0847

While you wait:
[📸 See Our Work] [⭐ Read Reviews] [📞 Call Now]
```

---

#### F-22: Service-Area Route Depth (P0)

**Problem:** Service-area pages exist as dynamic routes but content is thin. Customers searching "cleaning services in [City]" land on pages without local proof, local CTAs, or local trust signals.

**Solution:** Fully populated city pages with:
- Localized hero headline ("Commercial Cleaning in [City]")
- Area-specific proof (jobs completed in that zone, if available)
- Local CTA with phone number and quote form
- Structured data / LocalBusiness schema per city

**Why P0:** This is how local service businesses win Google organic traffic. Thin pages are worse than no pages — they signal low quality to Google and to buyers.

**Implementation:**
- Content template system for `/service-area/[slug]` routes
- Admin-manageable content blocks (or static JSON seed for launch)
- Schema.org `LocalBusiness` + `Service` structured data per page
- Internal linking from homepage and service pages

**Revenue plan alignment:** §12.1.1, §13.5 P0 #2

---

#### F-23: Service-Page Objection Modules (P0)

**Problem:** All objections are handled on one FAQ page. Customers on a specific service page (e.g., post-construction) leave without seeing answers to their specific concerns.

**Solution:** 3-5 objection blocks embedded directly on each service detail page.

```
🤔 Common Questions About Post-Construction Cleaning

Q: "Do you handle hazardous debris?"
A: "We handle standard post-construction waste including
   drywall dust, paint overspray, and adhesive residue.
   For hazardous materials, we coordinate with licensed
   disposal services."

Q: "What if we're not satisfied?"
A: "We photograph everything before and after. If anything
   doesn't meet spec, we reclean within 24 hours at no
   additional charge."
```

**Why P0:** Objections near the CTA are the #1 conversion lever for service businesses. A customer with an unanswered concern doesn't submit the form — they leave.

**Implementation:**
- `service_faqs` data structure (static JSON or CMS-driven)
- Each service page pulls its own FAQ set
- Positioned above the final CTA block on service pages
- Schema.org `FAQPage` structured data per service page for rich snippet eligibility

**Revenue plan alignment:** §12.1.4

---

#### F-24: Public Pricing/SLA Guidance (P0)

**Problem:** No pricing signals anywhere on the site. Enterprise buyers (property managers, GCs) need budget confidence before requesting a quote. Without it, they assume you're either too expensive or not serious enough.

**Solution:** Pricing guidance blocks on service pages and a dedicated "How Pricing Works" section.

```
💰 Pricing Guidance — Post-Construction Cleaning

Starting from $X.XX per square foot
├─ Includes: debris removal, surface cleaning, window detail
├─ Add-ons: pressure washing, carpet extraction
└─ Final quote based on walkthrough or site photos

⏱️ Our Commitments
├─ Quote delivered within 24 hours of request
├─ Crew on-site within 48 hours for urgent jobs
└─ Not satisfied? We reclean within 24 hours, free
```

**Why P0:** Self-qualification reduces tire-kicker leads and increases the quality of inbound. Buyers who see ranges and SLAs feel confident enough to submit — buyers who see nothing feel uncertain and bounce.

**Implementation:**
- Pricing guidance component per service type
- SLA commitment component (response time, reclean guarantee)
- Positioned mid-page on service detail routes, above quote CTA
- Content is operator-managed (static config or admin settings)

**Revenue plan alignment:** §12.1.3, §13.5 P1 #5

---

#### F-25: CTA Taxonomy + Funnel Instrumentation (P0)

**Problem:** CTAs are abundant but inconsistently named, positioned, and tracked. Can't tell which CTA on which page drives the most conversions. Can't A/B test because there's no baseline.

**Solution:** Standardized CTA naming system + event schema.

**CTA naming convention:**
```
[location]_[action]_[variant]

Examples:
hero_get_quote_primary
service_page_get_quote_bottom
mobile_sticky_call_now
exit_intent_get_quote_overlay
footer_get_quote_secondary
```

**Event schema (per CTA interaction):**
```typescript
{
  event: "cta_click",
  cta_id: "hero_get_quote_primary",
  page: "/services/post-construction",
  source: "organic",
  device: "mobile",
  timestamp: "..."
}
```

**Why P0:** You cannot optimize conversion without measuring it. This is the foundation for every CRO test in the revenue plan.

**Implementation:**
- Shared `CTAButton` component with required `ctaId` prop
- Analytics event fired on every CTA interaction via existing `conversion-event` API
- Dashboard view showing CTA performance (clicks → form opens → submissions)
- Replace all existing ad-hoc CTA buttons with shared component

**Revenue plan alignment:** §12.1.5, §18

**Resolves audit finding:** §7.2A (10+ identical CTA button wrappers bypassing core components)

**Acceptance criteria:**
1. All trackable CTA interactions use shared `CTAButton` with required `ctaId`.
2. Every click emits `cta_click` with the complete event schema.
3. No remaining ad-hoc CTA wrappers in target surfaces after migration.
4. Funnel view exposes click → form-open → submission by CTA ID.
5. UTM source is captured and stored when available.

---

#### F-18: Automated Quote Follow-Up Sequence (P1)

**Problem:** Quote sent, customer doesn't respond. Admin must remember to follow up.

**Solution:** Automated drip sequence.

| Timing | Action |
|---|---|
| Immediately | Email with quote link (exists) |
| 24hr, if not opened | SMS: "Making sure you got our quote! [Link]" |
| 3 days, if not accepted | Email: "Questions about the quote? Happy to adjust." |
| 7 days, if not accepted | SMS to admin: "Quote for [Name] is 7 days old. [Follow Up] or [Close]" |

**Implementation:**
- `quote_followup_sequence` tracking table
- Open tracking via link-click event on quote page
- Sequence auto-stops if quote is accepted

---

#### F-26: Proof Library / Portfolio Hub (P1)

**Problem:** Before/after work exists in completion photos but isn't surfaced publicly. Enterprise buyers need to see volume and quality of work before engaging.

**Solution:** Public-facing portfolio page with filterable case studies.

```
📸 Our Work

Filter: [All] [Post-Construction] [Commercial] [Office]

┌──────────────┐ ┌──────────────┐
│ 🏗️ 12-Unit    │ │ 🏢 Corporate  │
│ Apartment     │ │ Office Tower  │
│ Post-Const    │ │ Weekly Clean  │
│ ⭐⭐⭐⭐⭐      │ │ ⭐⭐⭐⭐⭐      │
│ [View Details]│ │ [View Details]│
└──────────────┘ └──────────────┘
```

Each case study: before/after photos, service type, scope description, optional client testimonial.

**Implementation:**
- `portfolio_entries` table or static content collection
- Filterable grid component on `/portfolio` or `/our-work` route
- Individual case study pages with structured data
- Internal links from service pages ("See our post-construction work →")
- Admin can add entries from completed jobs (pull from completion photos)

**Revenue plan alignment:** §12.3.1

---

#### F-27: Campaign Landing Templates (P1)

**Problem:** Paid traffic from Google/Meta lands on generic pages. Message match is weak — the ad says one thing, the page says something slightly different. Bounce rate suffers.

**Solution:** Standardized landing page template system for campaign traffic.

**Google intent template:**
```
[Headline matching search query]
[Trust bar: Licensed, Insured, 1-Hour Response]
[3 proof points specific to service]
[Quote form — prominent, above fold on mobile]
[Social proof: reviews + before/after]
[FAQ: top 3 objections for this service]
```

**Meta retargeting template:**
```
[Headline: "Still looking for [service]?"]
[Reminder of what they saw before]
[Limited-time offer or urgency element]
[Quote form — simplified, 3 fields max]
[Trust proof: reviews]
```

**Implementation:**
- Reusable landing page component composition
- UTM-aware content blocks (optional: show different hero based on `utm_campaign`)
- Shared with service pages but optimized for single-action focus
- Optional: hide nav on campaign landing variants to reduce distraction

**Revenue plan alignment:** §12.3.3

---

#### F-28: Recurring Revenue Emphasis (P1)

**Problem:** The website treats every service as a one-time transaction. Recurring contracts are 10-20x more valuable but there's no dedicated conversion path for them.

**Solution:** Dedicated recurring-focused content and conversion path.

- Dedicated section or page: "Recurring Commercial Cleaning"
- Savings calculator: "Weekly vs. one-time cost comparison"
- Recurring-specific proof (case studies of long-term clients)
- Recurring-specific CTA: "Schedule a Walkthrough" (higher commitment than generic quote)
- Recurring pricing guidance: "Starting at $X/week for [scope]"

**Why this matters:** One recurring weekly client at $350/visit = $17,500/year. One one-time client = $900. The website should actively push toward recurring at every relevant touchpoint.

**Implementation:**
- `/services/recurring-commercial` route (or section on commercial page)
- Savings calculator component (inputs: sqft, frequency → estimated monthly cost)
- "Walkthrough" CTA variant that pre-fills quote form with "Recurring" service type
- Quote templates (F-04) include recurring options by default

**Revenue plan alignment:** §13.5 P1 #4, Customer LTV model §15

---

#### F-19: Customer Job Status Page (P2)

**Problem:** After job is scheduled, customer has no visibility. Calls to ask "when are they coming?"

**Solution:** Token-based status page (pizza-tracker pattern).

```
🧹 Your Cleaning — March 21
✅ Scheduled
✅ Crew On Their Way (8:15 AM)
● In Progress
○ Quality Check
○ Complete

Estimated completion: 11:00 AM
Questions? Call us: (555) 123-4567
```

Link sent via SMS morning-of. No login required.

---

### 8.4 Automation & Infrastructure

#### F-20: Customer Reactivation Alerts (P1)

**Problem:** One-time customer with good experience never hears from A&A again.

**Solution:**

| Days Since Last Job | Action |
|---|---|
| 60 | Admin nudge: "It's been 60 days since [Company]'s last clean. [Send Check-In]" |
| 90 | Auto-send (if enabled): "Ready for another clean? [Book Again]" |

---

#### F-32: Multi-Touch Lead Nurture Sequence (P1)

**Problem:** F-03 handles aging alerts (admin nudges for uncontacted leads). F-18 handles quote follow-up (for sent quotes). But there's no nurture for leads who were contacted but didn't convert — the "not now, maybe later" segment.

**Solution:** Long-tail nurture drip for non-converted leads.

| Day After Last Contact | Action |
|---|---|
| 7 | Email: "Thanks for considering A&A. Here's a recent project → [Portfolio Link]" |
| 14 | SMS: "Hi [Name], still thinking about cleaning? We'd love to help when ready. [Quote Link]" |
| 30 | Email: "Monthly update: our latest work + a special offer for first-time clients" |
| 60 | Final touch: "We're here when you need us. [One-tap rebooking link]" |
| After 60 | Move to dormant. Stop automated outreach. |

**Implementation:**
- `lead_nurture_sequence` table (same pattern as `post_job_sequence` and `quote_followup_sequence`)
- Triggers when lead status is "Contacted" or "Quoted" but not "Won" for 7+ days
- Auto-stops if lead re-engages or is marked "Lost"
- Unsubscribe link on every message

**Revenue plan alignment:** §13.5 P1 #6

---

#### F-33: Review Generation Workflow (P1)

**Problem:** F-07 includes a rating→review step, but it's one SMS in a chain. The revenue plan calls for review generation as a first-class systematic workflow with volume targets (4-8 reviews/month).

**Solution:** Expand F-07's review step into a standalone review engine.

- After positive rating (4-5): send Google review link with direct deep-link to review form
- 48 hours later if no review posted: gentle reminder SMS
- Admin dashboard: "Reviews This Month" counter with target indicator (Green: 4-8/mo, Yellow: 2-3/mo, Red: <2/mo)
- Monthly summary: "You received 3 new reviews this month (target: 4-8)"
- Admin can manually trigger review request for any completed job

**Implementation:**
- Extend `post_job_sequence` with review-specific steps
- Google Places review link stored in Settings (configurable)
- Review counter derived from Google Business Profile API (or manual tracking initially)
- Review velocity metric added to SLA dashboard (F-29)

**Revenue plan alignment:** §12.2.3, §13.1 (review velocity KPI), §13.5 P0 #1

---

#### F-34: Call Tracking Attribution (⏸ Deferred)

**Problem:** Phone calls from website and campaigns are not consistently attributable to source/campaign, creating a major blind spot for a call-heavy service business.

**Solution:** Add third-party call tracking (e.g., CallRail/CTM) with dynamic number insertion and campaign attribution into pipeline/reporting.

**Deferral reason:** Requires tool selection, recurring spend approval, DNS/number provisioning, and operations alignment. Not required to close launch gates.

**Re-entry condition:** Re-open after paid campaigns run for 2+ weeks with enough call volume to justify tracking investment.

**Revenue plan alignment:** 90-day plan §12.2.1

---

#### F-21: Weather-Aware Scheduling Flag (P2)

**Problem:** Outdoor/post-construction jobs affected by weather. Admin checks weather separately.

**Solution:** Weather icon on dispatch view for severe-weather days.

```
📅 Thursday, March 23
├─ ⛈️ Severe storm warning
├─ Job #415 — Outdoor post-construction clean
└─ ⚠️ Consider rescheduling [Move to Friday]
```

Free weather API (OpenWeatherMap), once-daily call per service area. Display only — no auto-reschedule.

---

## 9) Feature Roadmap — Priority Matrix

### P0 — Pre-Launch / Immediate Post-Launch (12 features)

| ID | Feature | Surface | Effort | Dependencies | Revenue Plan Alignment |
|---|---|---|---|---|---|
| F-25 | CTA taxonomy + instrumentation | Public | M (1-2 days) | None (build first) | §12.1.5, §18 |
| F-02 | Lead auto-acknowledgment | API/Notifications | S (3-4 hrs) | Twilio + Resend configured | §13.5 P0 #3 |
| F-03 | Lead aging alerts | API/Notifications | M (1 day) | F-02 + lead lifecycle migration | §13.1 |
| F-05 | Simplified sidebar grouping | Admin | S (2-3 hrs) | None | — |
| F-01 | Morning Briefing dashboard | Admin | L (2-3 days) | F-03 fields + data queries | — |
| F-04 | Quick Quote templates | Admin | M (1-2 days) | Quote template schema | — |
| F-17 | Confirmation page | Public | S (2-3 hrs) | F-25 event coverage | — |
| F-23 | Service-page objection modules | Public | S (3-4 hrs) | Content drafted | §12.1.4 |
| F-24 | Pricing/SLA guidance | Public | S (3-4 hrs) | Content drafted | §12.1.3, §13.5 |
| F-22 | Service-area route depth | Public | L (2-3 days) | Content + structured data | §12.1.1, §13.5 |
| F-11 | Map/navigation link | Employee | XS (30 min) | None | — |
| F-12 | Job-day summary | Employee | M (1 day) | Scheduled-start field | — |

Estimated P0 total: ~12-16 developer days (single-developer baseline, excluding content-production lead time).

### P1 — First 30 Days Post-Launch (16 features)

| ID | Feature | Surface | Effort | Dependencies | Revenue Plan Alignment |
|---|---|---|---|---|---|
| F-06 | One-tap dispatch | Admin | M | F-04 stable + assignment flows | — |
| F-07 | Post-job automation chain | API/Notifications | L | post-job sequence schema + webhook handling | §12.2.3 |
| F-08 | Simple revenue tracker | Admin | M | payment fields migration | — |
| F-09 | Help tooltips + tour | Admin | S | profile flag migration | — |
| F-13 | Photo requirements | Employee | M | photo requirements schema | — |
| F-14 | Completion lockout | Employee | M | F-13 complete | — |
| F-15 | Time logging visibility | Employee + Admin | M | accurate assignment/timestamp data | — |
| F-18 | Quote follow-up sequence | API/Notifications | M | quote follow-up table + event signals | — |
| F-20 | Customer reactivation | API/Notifications | S-M | customer last-job field | §13.6 #4 |
| F-26 | Proof library / portfolio | Public | L | portfolio table + content assets | §12.3.1 |
| F-27 | Campaign landing templates | Public | M-L | content variants + template scaffolding | §12.3.3 |
| F-28 | Recurring revenue emphasis | Public | M | recurring content + calculator inputs | §13.5, §15 |
| F-29 | SLA performance dashboard | Admin | M | lead timestamps + KPI thresholds | §12.4.1, §6 |
| F-30 | Capacity throttle signal | Admin | M | capacity threshold + dispatch availability data | §12.4.2 |
| F-32 | Multi-touch lead nurture | API/Notifications | M | nurture table + stop conditions | §13.5 |
| F-33 | Review generation workflow | API/Notifications | M | F-07 chain + review tracking | §12.2.3, §13.1 |

Estimated P1 total: ~18-26 developer days (single-developer baseline, excluding external API/tooling onboarding).

### P2 — 90-Day Horizon (5 features)

| ID | Feature | Surface | Revenue Plan Alignment |
|---|---|---|---|
| F-10 | Smart crew suggestions | Admin | — |
| F-16 | GPS-verified check-in | Employee | — |
| F-19 | Customer status page | Public | — |
| F-21 | Weather scheduling flags | Admin | — |
| **F-31** | **Referral tracking** | **Admin + Public** | **§12.5.2** |

### Feature Distribution Summary

| Surface | P0 | P1 | P2 | Total |
|---|---|---|---|---|
| Admin | 4 | 5 | 2 | **11** |
| Employee | 2 | 3 | 1 | **6** |
| Public | 5 | 4 | 2 | **11** (was 3, now balanced) |
| API/Notifications | 1 | 4 | 0 | **5** |
| **Total** | **12** | **16** | **5** | **33** |

---

## 10) Schema Changes — Migration Sequence

Migrations are grouped by sprint and sequenced by dependency. Each migration should be an idempotent SQL file in `supabase/migrations/`.

### Migration 1: Lead Lifecycle Fields (Blocks: F-01, F-03, F-12)

- `leads.last_contacted_at` (`timestamptz`, nullable)
- `leads.followup_reminder_count` (`integer`, default `0`)
- `leads.source` (`text`, nullable)
- `assignments.scheduled_start` (`timestamptz`, nullable) or equivalent planned start field

### Migration 2: Payment & Quote Templates (Blocks: F-04, F-07, F-08)

- New table: `quote_templates`
- `tickets.paid_at` (`timestamptz`, nullable)
- `tickets.payment_method` (`text`, nullable)
- `tickets.payment_status` (`enum`: `pending`/`invoiced`/`paid`/`overdue`)
- `tickets.payment_amount` (`numeric`, nullable)
- New table: `post_job_sequence`

### Migration 3: Instrumentation & Onboarding (Blocks: F-09, F-25)

- `admin_profiles.has_completed_tour` (`boolean`, default `false`)
- New table: `cta_events`

### Migration 4: Employee & Automation (Blocks: F-13, F-18, F-20, F-32)

- `tickets.photo_requirements` (`jsonb`, nullable)
- New table: `quote_followup_sequence`
- New table: `lead_nurture_sequence`
- `customers.last_job_completed_at` (`timestamptz`, nullable)

### Migration 5: Portfolio & Capacity (Blocks: F-26, F-30, F-31)

- New table: `portfolio_entries`
- `system_config.capacity_threshold` (`integer`, default `85`)
- `leads.referral_customer_id` (`uuid` FK, nullable)

### Migration Reference Matrix

### Existing Table Modifications

| Feature | Table.Column | Type | Migration Notes |
|---|---|---|---|
| F-03 | `leads.last_contacted_at` | `timestamptz` | Nullable, default null |
| F-03 | `leads.followup_reminder_count` | `integer` | Default 0 |
| F-07 | `tickets.paid_at` | `timestamptz` | Nullable |
| F-07 | `tickets.payment_method` | `text` | Nullable |
| F-08 | `tickets.payment_status` | `enum` | `pending` / `invoiced` / `paid` / `overdue` |
| F-08 | `tickets.payment_amount` | `numeric` | Nullable |
| F-09 | `admin_profiles.has_completed_tour` | `boolean` | Default false |
| F-13 | `tickets.photo_requirements` | `jsonb` | Nullable, template-derived |
| F-20 | `customers.last_job_completed_at` | `timestamptz` | Nullable, derived from ticket data |
| F-30 | `system_config.capacity_threshold` | `integer` | Default 85 (percent) |
| F-31 | `leads.source` | `text` | If not already present |
| F-31 | `leads.referral_customer_id` | `uuid` FK | Nullable |

### New Tables

| Feature | Table | Columns | Notes |
|---|---|---|---|
| F-04 | `quote_templates` | `id`, `name`, `service_type`, `default_line_items` JSONB, `base_price`, `pricing_model`, `created_by`, `created_at` | Admin-managed |
| F-07 | `post_job_sequence` | `id`, `ticket_id` FK, `step`, `fired_at`, `result` | Tracks automation chain state |
| F-18 | `quote_followup_sequence` | `id`, `quote_id` FK, `step`, `fired_at`, `result` | Same pattern as `post_job_sequence` |
| F-25 | `cta_events` | `id`, `cta_id`, `page`, `source`, `device`, `session_id`, `created_at` | Analytics event store |
| F-26 | `portfolio_entries` | `id`, `title`, `service_type`, `description`, `before_photos` JSONB, `after_photos` JSONB, `testimonial`, `created_at` | Public proof assets |
| F-32 | `lead_nurture_sequence` | `id`, `lead_id` FK, `step`, `fired_at`, `result` | Same pattern as `post_job_sequence` |

---

## 11) Notification Templates Required by Feature Roadmap

### Lead Lifecycle

| Feature | Template ID | Channel | Trigger |
|---|---|---|---|
| F-02 | `lead_ack_customer` | Email + SMS | Lead submitted (24/7, no quiet hours) |
| F-02 | `lead_ack_admin` | SMS | Lead submitted (quiet-hours aware) |
| F-03 | `lead_aging_1h` | SMS | 1hr uncontacted |
| F-03 | `lead_aging_4h` | SMS | 4hr uncontacted |
| F-03 | `lead_aging_24h` | SMS | 24hr uncontacted |

### Quote Lifecycle

| Feature | Template ID | Channel | Trigger |
|---|---|---|---|
| F-18 | `quote_followup_24h` | SMS | 24hr quote unopened |
| F-18 | `quote_followup_3d` | Email | 3 days unaccepted |
| F-18 | `quote_followup_7d_admin` | SMS | 7 days unaccepted (to admin) |

### Post-Job Lifecycle

| Feature | Template ID | Channel | Trigger |
|---|---|---|---|
| F-07 | `job_complete_admin` | SMS | Employee marks complete |
| F-07 | `job_complete_customer` | Email | Admin approves QA |
| F-07 | `job_rating_request` | SMS | 24hr post-approval |
| F-07 | `job_rating_low_alert` | SMS | Rating < 3 (to admin) |
| F-07 | `job_review_request` | SMS | Rating ≥ 4 |
| F-07 | `payment_reminder` | SMS | 3 days unpaid (to admin) |

### Review Generation

| Feature | Template ID | Channel | Trigger |
|---|---|---|---|
| F-33 | `review_reminder` | SMS | 48hr after initial review request |

### Lead Nurture (Non-Converted)

| Feature | Template ID | Channel | Trigger |
|---|---|---|---|
| F-32 | `nurture_day_7` | Email | 7 days post-contact, not converted |
| F-32 | `nurture_day_14` | SMS | 14 days post-contact |
| F-32 | `nurture_day_30` | Email | 30 days post-contact |
| F-32 | `nurture_day_60` | Email | 60 days, final touch |

### Customer Reactivation

| Feature | Template ID | Channel | Trigger |
|---|---|---|---|
| F-20 | `customer_reactivation_60d` | SMS (to admin) | 60 days since last job |
| F-20 | `customer_reactivation_90d` | SMS | 90 days since last job |

**Total notification templates: 22**

---

## 12) Canonical Use

- **`Master-Spec-4.0`** is the single source of truth for active execution and roadmap.
- **`Master-Spec-3.0`** is archive/reference only. Do not update.
- **`User-Manual.md`** is the operator-facing document. Update when features from §8 land.
- **`90-Day-Revenue-Plan.md`** is the business strategy companion. Cross-referenced in §8 and §9 via revenue plan section numbers.
- **`GLOSSARY.md`** is the shared terminology source for planning and execution docs.
- Update this spec at each pass completion and after each feature ships.

### Revenue Plan Cross-References

| Master Spec Feature | Revenue Plan Section |
|---|---|
| F-02 Lead auto-ack | §13.5 P0 #3 (speed-to-lead) |
| F-03 Lead aging | §13.1 (KPI calibration) |
| F-07 Post-job chain | §12.2.3 (review generation) |
| F-22 Service-area depth | §12.1.1, §13.5 P0 #2 |
| F-25 CTA taxonomy | §12.1.5, §18 (CRO program) |
| F-28 Recurring emphasis | §13.5 P1 #4, §15 (LTV model) |
| F-29 SLA dashboard | §12.4.1, §6 (KPI framework) |
| F-30 Capacity throttle | §12.4.2, §11.5 (capacity guardrails) |
| F-33 Review workflow | §12.2.3, §13.1 (review velocity) |

---

## 13) What Happens Next (Execution Sequence)

```
NOW
 │
 ├─ Close Pass 1 (2 pending items: Upstash revocation, Vercel env)
 │
 ├─ Execute Pass 2 (R-01 credential-gated runbook)
 │
 ├─ Execute Pass 3 (inventory flag in code, user manual accuracy check)
 │
 ├─ BEGIN FEATURE ROADMAP (Pass 4)
 │
 │   P0 Sprint — Operations Track
 │   ├─ F-01  Morning Briefing dashboard
 │   ├─ F-02  Lead auto-acknowledgment
 │   ├─ F-03  Lead aging alerts
 │   ├─ F-04  Quick Quote templates
 │   ├─ F-05  Simplified sidebar grouping
 │   ├─ F-11  Map/navigation link (employee)
 │   └─ F-12  Job-day summary (employee)
 │
 │   P0 Sprint — Conversion Track (parallel)
 │   ├─ F-17  Confirmation page
 │   ├─ F-22  Service-area route depth
 │   ├─ F-23  Service-page objection modules
 │   ├─ F-24  Pricing/SLA guidance
 │   └─ F-25  CTA taxonomy + funnel instrumentation
 │
 │   P1 Sprint — Operations Track
 │   ├─ F-06  One-tap dispatch
 │   ├─ F-07  Post-job automation chain
 │   ├─ F-08  Simple revenue tracker
 │   ├─ F-09  Help tooltips + first-login tour
 │   ├─ F-13  Photo requirements (employee)
 │   ├─ F-14  Completion lockout (employee)
 │   ├─ F-15  Time logging visibility (employee + admin)
 │   ├─ F-29  SLA performance dashboard
 │   └─ F-30  Capacity throttle signal
 │
 │   P1 Sprint — Conversion + Automation Track (parallel)
 │   ├─ F-18  Quote follow-up sequence
 │   ├─ F-20  Customer reactivation alerts
 │   ├─ F-26  Proof library / portfolio hub
 │   ├─ F-27  Campaign landing templates
 │   ├─ F-28  Recurring revenue emphasis
 │   ├─ F-32  Multi-touch lead nurture
 │   └─ F-33  Review generation workflow
 │
 │   P2 Backlog
 │   ├─ F-10  Smart crew suggestions
 │   ├─ F-16  GPS-verified crew check-in
 │   ├─ F-19  Customer job status page (pizza tracker)
 │   ├─ F-21  Weather-aware scheduling flags
 │   └─ F-31  Referral tracking
 │
 └─ Performance hardening (R-04) when launch window allows
```

### Recommended P0 Build Sequence (Within Sprint)

For maximum early impact within the P0 sprint, build in this order:

| Order | Feature | Rationale |
|---|---|---|
| 1 | F-25 (CTA taxonomy) | Foundation — everything else measures against this |
| 2 | F-02 (Lead auto-ack) | Immediate revenue protection — no more silent leads |
| 3 | F-03 (Lead aging) | Compounds F-02 — automated follow-up safety net |
| 4 | F-05 (Sidebar) | Low effort, high UX impact — admin instantly less intimidating |
| 5 | F-01 (Morning Briefing) | Depends on data from F-03 fields — build after schema lands |
| 6 | F-04 (Quote templates) | Needs Morning Briefing context to be most useful |
| 7 | F-17 (Confirmation page) | Quick public win after conversion instrumentation is live |
| 8 | F-23 (Objection modules) | Content work — can happen in parallel with code features |
| 9 | F-24 (Pricing/SLA) | Content work — same parallel track |
| 10 | F-22 (Service-area depth) | Largest scope P0 item — tackle last with most runway |
| 11 | F-11 (Map link) | 5-minute employee win — slot anywhere |
| 12 | F-12 (Job-day summary) | Employee UX — after admin P0s are stable |

---

## 14) Recalibration Schedule

| Frequency | What Gets Updated | Owner |
|---|---|---|
| Weekly | Pass progression notes, open blockers, and launch-gate status | Developer + Owner/GM |
| After each feature ships | §8 feature status, §2 readiness matrix, and dependency notes | Developer |
| Monthly | Priority matrix estimates/dependencies vs actuals and cross-doc alignment with revenue plan | Owner/GM + Growth Lead + Developer |
| Quarterly | Full spec review; archive stale assumptions and re-rank backlog | All |

Rule: if a KPI threshold in the revenue plan is missed for 3 consecutive weeks, trigger an out-of-cycle review of feature priority ordering and launch-vs-growth tradeoffs.