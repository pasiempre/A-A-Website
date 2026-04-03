# Master Spec 4.0 — Current State

Last Updated: 2026-04-03
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
- 🟡 **F-07 implementation advanced** (post-job sequence foundations + execution routes):
  - `src/lib/post-job-sequence.ts`
  - `src/lib/post-job-settings.ts`
  - `src/app/api/post-job-sequence/route.ts`
  - `src/app/api/post-job-scheduler/route.ts`
  - `src/app/api/post-job-rating/route.ts`
  - `src/app/api/post-job-settings/route.ts`
  - `src/components/admin/PostJobAutomationSettingsClient.tsx`
  - `src/app/api/completion-report/route.ts` (auto-trigger integration)
  - `supabase/migrations/0022_post_job_sequence_and_payments.sql`
  - `supabase/migrations/0023_post_job_automation_settings.sql`
- ✅ **F-07 schema/runtime validation progressed**:
  - Applied remote migrations: `0021_quote_templates.sql`, `0022_post_job_sequence_and_payments.sql`, `0023_post_job_automation_settings.sql`, `0024_jobs_title_compatibility.sql`
  - `npm run preflight:f07` passes (env + DNS + HTTPS)
  - `npm run smoke:f07` passes (8/8)
  - Added runtime hardening in `src/app/api/post-job-rating/route.ts`, `src/app/api/post-job-settings/route.ts`, `src/lib/post-job-settings.ts`

### 1.2 Verified Build State

- ✅ `npx tsc --noEmit` passes.
- ✅ `npx next build` passes.
- ✅ `npm run lint` passes.

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

### 3.0 R-00 — Homepage Mobile UX/UI/Functional Hardening (Highest Priority)

**State:** 🟡 Implemented in code (Batches A-E complete); Batch F evidence pack pending

**Priority directive:** This is the top execution priority before normal roadmap progression.

**Implementation detail source:** `HOMEPAGE-MOBILE-UX-UI-FUNCTIONAL-HARDENING-SPEC.md`

**Scope boundary:** Public homepage mobile experience (`/`) only.

**Acceptance gate:** All mobile acceptance criteria in the hardening spec pass across the required device matrix with before/after evidence (Batch F). Batch E completed 2026-03-22; Batch F evidence is still an open documentation task.

---

### 3.1 R-01 — Credential-Gated Manual Validation

**State:** 🟡 Partially executed

**Why it remains:** Cannot be proven by static build/lint.

**Required checks:**

| # | Scenario | Provider | Evidence Needed |
|---|---|---|---|
| 1 | SMS delivery + retry on real device | Twilio | Delivery receipt + retry log |
| 2 | Offline photo queue sync under connectivity drop | Supabase Storage | Photo appears after reconnect |
| 3 | QuickBooks OAuth callback + sync | Intuit | Token exchange + invoice creation in sandbox |
| 4 | Sentry capture quality | Sentry | Event with tags, metadata, runtime context |
| 5 | Rate-limit burst → deterministic 429 | Upstash | Response headers + 429 on request 6 |

**Progress update (2026-04-03):**
- ✅ Preflight baseline completed: env + DNS + HTTPS reachability.
- ✅ F-07 foundation smoke completed: 8/8 passing after schema reconciliation.
- 🟡 Remaining items are provider/device evidence scenarios in the table above.

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

### Priority Override — Must Execute First

- Complete R-00 (homepage mobile hardening) before continuing the standard pass flow.
- Treat R-00 completion evidence as a launch-quality gate for public conversion readiness.

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

**Progress update (2026-04-03):**
- Preflight + focused smoke are complete.
- Provider/device evidence scenarios remain open (Twilio/Sentry/QuickBooks/Upstash live proofs).

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
| 6 | Sequence collision: same contact receives overlapping automations from F-07/F-18/F-20/F-32/F-33 | Enforce global orchestration policy in §11 (single active customer sequence; newest intent wins) |

---

## 6) Acceptance Gates for Launch Readiness

4.0 launch sign-off requires all gates passed:

| # | Gate | Status |
|---|---|---|
| 1 | Code/build gates (`tsc`, `lint`, `build`) | ✅ Complete |
| 2 | Product decisions signed | ✅ Complete (§3.2) |
| 3 | Secrets hygiene signed (rotation + env parity) | 🟡 Two items pending (§3.3) |
| 4 | Credential-gated runbook executed with evidence | 🟡 Partial — preflight + F-07 smoke complete; provider/device proofs pending (§3.1) |

When all four pass: system is launch-ready at operational level. Feature roadmap (§8) begins.

---

## 7) Code Health Audit

Audit Date: 2026-03-21
Full findings: See `../reference/CODE-HEALTH-AUDIT.md`

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
**Status:** 🟢 Implemented (2026-03-22)

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

**Implementation note (2026-04-02):**
- The “Yesterday’s Wins” dollar metric may use an interim proxy until a finalized completed-job revenue source is wired.
- Treat strict completed-work revenue semantics as a follow-up enhancement (align with F-08 revenue tracker scope), not a blocker for F-01 usability delivery.

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

**Acceptance criteria:**
1. Lead reminders fire at 1h, 4h, and 24h only once per threshold for each lead.
2. 48h transition marks lead `At Risk` and surfaces in Morning Briefing.
3. If `last_contacted_at` is updated before a threshold, pending reminders for that threshold do not fire.
4. Quiet-hours policy is respected for admin-facing SMS messages.
5. Validation method: cron simulation + reminder-count query + notification log verification.

---

#### F-04: Quick Quote Templates (P0)

**Status:** 🟢 Implemented (2026-04-02)

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

**Acceptance criteria:**
1. Sidebar renders only the three top-level groups (Daily Work, Business, Settings).
2. Existing destination routes remain reachable without deep-link regressions.
3. Mobile/tablet navigation remains usable with no horizontal overflow at 320px.
4. First-click access time to top tasks (Leads, Jobs, Review) is reduced versus baseline navigation.
5. Validation method: visual regression pass + route click-through checklist.

---

#### F-06: One-Tap Job Dispatch (P1)

**Status:** ✅ Implemented (2026-04-03)

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

**Status:** 🟡 In progress (2026-04-03)

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

**Implementation snapshot (2026-04-03):**
- Sequence bootstrap implemented and auto-triggered from QA-approved completion flow.
- Admin immediate notification + customer completion email implemented.
- Scheduler route implemented for due-step processing.
- Inbound rating reply route implemented with low-rating/admin-alert and high-rating/review-invite branching.
- Settings-backed runtime controls implemented across chain (DB-backed config + admin API + admin UI module).

**Open gaps before marking complete:**
- Run credential-gated end-to-end validation with evidence (real SMS delivery, parse, branch, and reminders).
- Note: foundational validation is now green (`preflight:f07` and `smoke:f07` pass after migration alignment).

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

**Acceptance criteria:**
1. Weekly totals match underlying ticket aggregates for completed, paid, and unpaid values.
2. Mark-as-paid action updates `payment_status`, `paid_at`, and reflects immediately in UI totals.
3. Overdue status transition runs deterministically from configured threshold.
4. Empty-state weeks render with clear zero-value messaging.
5. Validation method: seeded ticket set + aggregate query comparison + UI verification.

---

#### F-09: Inline Help Tooltips + First-Login Tour (P1)

**Problem:** User manual exists but won't be read.

**Solution:** Contextual help embedded in the UI.

- `(?)` icons on non-obvious elements with tap-to-show tooltips
- 5-step guided overlay on first admin login
- Skippable, replayable from Settings
- `has_completed_tour` flag on admin profile

**Acceptance criteria:**
1. First-login tour auto-starts once per profile when `has_completed_tour=false`.
2. Skip action persists state and does not re-open tour on next login unless user replays manually.
3. Replay control from Settings launches tour reliably.
4. Tooltip content is accessible by keyboard and touch with proper focus behavior.
5. Validation method: profile-flag toggling + interaction test on desktop and tablet.

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

**Status:** 🟢 Implemented (2026-04-03 verification)

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

**Status:** 🟡 Implemented with dependency caveat (2026-04-03 verification)

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

**Current limitation note:** Until Migration 1 is applied end-to-end, F-12 should be treated as functionally degraded (timeline UI present, operational ordering not yet guaranteed).

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

**Status:** 🟢 Implemented (2026-04-03 verification)

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

**Status:** 🟢 Implemented (2026-04-02)

**Content status:** 🟡 Implementation framework is live; owner/content sign-off is still required to confirm city-level copy and proof density are not placeholder-thin.

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

**Status:** 🟢 Implemented (2026-04-02)

**Content status:** 🟡 Module system is live; owner/content sign-off is still required to confirm service-specific objections are production-final.

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

**Status:** 🟢 Implemented (2026-04-02)

**Content status:** 🟡 Component framework is live; owner/content sign-off is still required to confirm pricing ranges and SLA commitments are approved for public publication.

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

**Status:** 🟢 Implemented in public conversion surface (2026-04-03 verification)

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

### 9.0 P0 Completion Snapshot (Reconciled 2026-04-03)

| Bucket | Count | Features |
|---|---|---|
| ✅/🟢 Implemented | 9 | F-01, F-04, F-11, F-12, F-17, F-22, F-23, F-24, F-25 |
| 🟡 Implemented with caveat | 1 | F-12 (depends on `assignments.scheduled_start` for operational ordering) |
| ❌ Remaining P0 build work | 3 | F-02, F-03, F-05 |

Estimated remaining P0 delivery: ~2-3 developer days (excluding provider-credential validation and owner-run content sign-off).

### P0 — Pre-Launch / Immediate Post-Launch (12 features)

| ID | Feature | Status | Surface | Remaining Effort | Dependencies | Revenue Plan Alignment |
|---|---|---|---|---|---|---|
| F-25 | CTA taxonomy + instrumentation | 🟢 Implemented | Public | — | None | §12.1.5, §18 |
| F-02 | Lead auto-acknowledgment | ❌ Not implemented | API/Notifications | S (3-4 hrs) | Twilio + Resend configured | §13.5 P0 #3 |
| F-03 | Lead aging alerts | ❌ Not implemented | API/Notifications | M (1 day) | F-02 + lead lifecycle migration | §13.1 |
| F-05 | Simplified sidebar grouping | ❌ Not implemented | Admin | S (2-3 hrs) | None | — |
| F-01 | Morning Briefing dashboard | 🟢 Implemented | Admin | — | Lead lifecycle fields improve data quality | — |
| F-04 | Quick Quote templates | 🟢 Implemented | Admin | — | Quote template schema landed | — |
| F-17 | Confirmation page | 🟢 Implemented | Public | — | F-25 event coverage | — |
| F-23 | Service-page objection modules | 🟢 Implemented | Public | Content sign-off pending | Content finalized for production | §12.1.4 |
| F-24 | Pricing/SLA guidance | 🟢 Implemented | Public | Content sign-off pending | Content finalized for production | §12.1.3, §13.5 |
| F-22 | Service-area route depth | 🟢 Implemented | Public | Content sign-off pending | Structured data + city content quality check | §12.1.1, §13.5 |
| F-11 | Map/navigation link | 🟢 Implemented | Employee | — | None | — |
| F-12 | Job-day summary | 🟡 Implemented with caveat | Employee | Migration 1 dependency | `assignments.scheduled_start` | — |

### P1 — First 30 Days Post-Launch (16 features)

| ID | Feature | Status | Surface | Effort | Dependencies | Revenue Plan Alignment |
|---|---|---|---|---|---|---|
| F-06 | One-tap dispatch | ✅ Implemented | Admin | — | F-04 stable + assignment flows | — |
| F-07 | Post-job automation chain | 🟡 In progress | API/Notifications | L | post-job sequence schema + webhook handling | §12.2.3 |
| F-08 | Simple revenue tracker | ❌ Not implemented | Admin | M | payment fields migration | — |
| F-09 | Help tooltips + tour | ❌ Not implemented | Admin | S | profile flag migration | — |
| F-13 | Photo requirements | ❌ Not implemented | Employee | M | photo requirements schema | — |
| F-14 | Completion lockout | ❌ Not implemented | Employee | M | F-13 complete | — |
| F-15 | Time logging visibility | ❌ Not implemented | Employee + Admin | M | accurate assignment/timestamp data | — |
| F-18 | Quote follow-up sequence | ❌ Not implemented | API/Notifications | M | quote follow-up table + event signals | — |
| F-20 | Customer reactivation | ❌ Not implemented | API/Notifications | S-M | customer last-job field | §13.6 #4 |
| F-26 | Proof library / portfolio | ❌ Not implemented | Public | L | portfolio table + content assets | §12.3.1 |
| F-27 | Campaign landing templates | ❌ Not implemented | Public | M-L | content variants + template scaffolding | §12.3.3 |
| F-28 | Recurring revenue emphasis | ❌ Not implemented | Public | M | recurring content + calculator inputs | §13.5, §15 |
| F-29 | SLA performance dashboard | ❌ Not implemented | Admin | M | lead timestamps + KPI thresholds | §12.4.1, §6 |
| F-30 | Capacity throttle signal | ❌ Not implemented | Admin | M | capacity threshold + dispatch availability data | §12.4.2 |
| F-32 | Multi-touch lead nurture | ❌ Not implemented | API/Notifications | M | nurture table + stop conditions | §13.5 |
| F-33 | Review generation workflow | ❌ Not implemented | API/Notifications | M | F-07 chain + review tracking | §12.2.3, §13.1 |

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

### 10.0 Applied Remote Migrations (Shipped)

- ✅ `0021_quote_templates.sql`
- ✅ `0022_post_job_sequence_and_payments.sql`
- ✅ `0023_post_job_automation_settings.sql`
- ✅ `0024_jobs_title_compatibility.sql`

These are already applied remotely and should not be treated as pending creation work.

### 10.1 Remaining Migration Work (Execution Queue)

### Migration 1: Lead Lifecycle Fields (Blocks: F-01, F-03, F-12)

- `leads.last_contacted_at` (`timestamptz`, nullable)
- `leads.followup_reminder_count` (`integer`, default `0`)
- `leads.source` (`text`, nullable)
- `assignments.scheduled_start` (`timestamptz`, nullable) or equivalent planned start field

**Priority note:** Migration 1 is now the highest-impact schema item because it unblocks full operational correctness for F-12 and supports F-03/F-01 data quality.

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

### 11.0 Global Delivery and Orchestration Rules

- Quiet hours window: 9:00 PM to 7:00 AM in the business operating timezone until per-contact timezone support is introduced.
- Quiet-hours scope: mandatory for admin-facing SMS; customer-facing SMS uses quiet hours by default unless explicitly marked transactional-immediate.
- Sequence orchestration policy: one active customer-facing automation sequence per contact at a time; newest intent wins and older overlapping sequences are paused.
- Sequence precedence when overlaps occur: F-07/F-33 (post-job experience) > F-18 (quote follow-up) > F-32 (lead nurture) > F-20 (reactivation).
- All deferred sends must preserve audit metadata showing original due time, defer reason, and delivered time.

### Dispatch Lifecycle

| Feature | Template ID | Channel | Trigger |
|---|---|---|---|
| F-06 | `crew_dispatch_notice` | SMS | One-tap dispatch creates assignment and notifies crew |

If implementation uses an existing assignment-dispatch template ID, map it explicitly to `crew_dispatch_notice` in this registry to prevent naming drift.

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

**Total notification templates: 23**

---

## 12) Canonical Use

- **`Master-Spec-4.0`** is the single source of truth for active execution and roadmap.
- **`HOMEPAGE-MOBILE-UX-UI-FUNCTIONAL-HARDENING-SPEC.md`** is the implementation source for R-00 and the canonical mobile homepage hardening checklist.
- **`Master-Spec-3.0`** is archive/reference only. Do not update.
- **`User-Manual.md`** is the operator-facing document. Update when features from §8 land.
- **`90-Day-Revenue-Plan.md`** is the business strategy companion. Cross-referenced in §8 and §9 via revenue plan section numbers.
- **`../reference/GLOSSARY.md`** is the shared terminology source for planning and execution docs.
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
 ├─ Close R-00 evidence gate
 │   └─ Complete Batch F before/after evidence across device matrix
 │
 ├─ Close Pass 1 (2 pending items: Upstash revocation, Vercel env)
 │
 ├─ Execute Pass 2 (R-01 credential-gated runbook)
 │
 ├─ Execute Pass 3 (inventory flag in code, user manual accuracy check)
 │
 ├─ BEGIN FEATURE ROADMAP (Pass 4) — Remaining P0 only
 │
 │   Immediate P0 Remaining
 │   ├─ F-02  Lead auto-acknowledgment
 │   ├─ F-03  Lead aging alerts
 │   ├─ F-05  Simplified sidebar grouping
 │   └─ Migration 1 (`assignments.scheduled_start`, lead lifecycle fields)
 │
 │   Then continue P1 queue
 │   ├─ F-07  Post-job automation chain completion + evidence
 │   ├─ F-08  Revenue tracker
 │   ├─ F-09  Tooltips + tour
 │   ├─ F-13/F-14/F-15 employee quality loop
 │   ├─ F-18/F-20/F-32/F-33 automation stack
 │   └─ F-26/F-27/F-28 conversion growth items
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

### Recommended Remaining P0 Build Sequence

For maximum impact with current reality (most P0 already shipped), execute in this order:

| Order | Feature | Rationale |
|---|---|---|
| 1 | Migration 1 | Unlocks operational ordering for F-12 and data support for F-03/F-01 |
| 2 | F-02 (Lead auto-ack) | Immediate revenue protection — no more silent leads |
| 3 | F-03 (Lead aging) | Compounds F-02 — automated follow-up safety net |
| 4 | F-05 (Sidebar) | Low effort, high UX impact — admin instantly less intimidating |

---

## 14) Recalibration Schedule

| Frequency | What Gets Updated | Owner |
|---|---|---|
| Weekly | Pass progression notes, open blockers, and launch-gate status | Developer + Owner/GM |
| After each feature ships | §8 feature status, §2 readiness matrix, and dependency notes | Developer |
| Monthly | Priority matrix estimates/dependencies vs actuals and cross-doc alignment with revenue plan | Owner/GM + Growth Lead + Developer |
| Quarterly | Full spec review; archive stale assumptions and re-rank backlog | All |

Rule: if a KPI threshold in the revenue plan is missed for 3 consecutive weeks, trigger an out-of-cycle review of feature priority ordering and launch-vs-growth tradeoffs.

## 15) Mobile Standards (Cross-Feature)

### 15.0 Purpose
The homepage mobile hardening (R-00) established the baseline. This section ensures every new feature — public pages, admin views accessed on tablets, employee field app, and any new public routes — is built to the same mobile standard from day one. Retrofitting is 3-5x more expensive than building mobile-first.

15.1 Mandatory Build Rules (All Features)
Every feature in §8 that touches a user-facing surface must satisfy these before merge:

| # | Rule | Verification |
|---|---|---|
| M-1 | No horizontal overflow at 320px viewport width | Manual check or automated viewport test |
| M-2 | All interactive elements ≥ 44px touch target (buttons, links, form controls) | Measure in devtools |
| M-3 | All text meets WCAG AA contrast (4.5:1 body, 3:1 large text) | Contrast checker on all bg/fg pairs |
| M-4 | No heading larger than text-3xl on mobile (hero pages exempt at clamp()) | Class audit |
| M-5 | Body text uses font-normal on mobile, font-light permitted only at md: and above | Class audit |
| M-6 | Form inputs include appropriate inputMode, autoComplete, and enterKeyHint attributes | Code review |
| M-7 | Dynamic/lazy-loaded sections include skeleton loading fallbacks | Code review |
| M-8 | Mobile layout changes gated behind responsive breakpoints (`md:`, `lg:`) — desktop unaffected | Visual regression check |
| M-9 | Sticky/fixed elements respect `env(safe-area-inset-*)` and `--z-*` CSS variable system | Code review |
| M-10 | Carousel/card-set patterns support touch swipe gestures on mobile | Manual device test |
15.2 Feature-Specific Mobile Guidance
These notes apply to specific upcoming features and should be referenced when those features enter development:

| Feature | Mobile Consideration |
|---|---|
| F-17 (Confirmation page) | This page receives traffic immediately after form submit and is often viewed on mobile. It must load fast (no heavy images above fold), display the reference number prominently, and keep all "while you wait" CTAs thumb-reachable. Prefer a single-column layout with no horizontal elements. |
| F-22 (Service-area city pages) | Each city page is a potential Google organic landing page. Mobile-first is mandatory: hero, CTA, and local proof should be above the fold on a 375px viewport. Structured data must render on the server (not client-side). |
| F-23 (Objection modules) | FAQ blocks on service pages must use an accordion/disclosure pattern on mobile. Do not render all Q&As expanded, to avoid scroll fatigue. |
| F-24 (Pricing/SLA guidance) | Pricing tables must not require horizontal scroll on mobile. Stack columns vertically or use card-based layout. SLA commitments should be scannable with icon plus short text. |
| F-25 (CTA taxonomy) | The shared CTAButton component must include `active:scale-[0.98]` tactile feedback, `min-h-[44px]` or `min-h-[48px]`, and `whitespace-nowrap` by default. Test labels at 320px to prevent wrapping. |
| F-26 (Portfolio/proof library) | Image-heavy gallery should use blur placeholders (`placeholder="blur"`), lazy loading below fold, and a mobile grid (2 columns, not 3 or 4). Filter tabs should be horizontally scrollable, not wrapping. |
| F-27 (Campaign landing pages) | These are the highest-conversion mobile pages. Keep the quote form above the fold, minimize or hide navigation, and avoid decorative elements that push the form down. Target: form visible within one scroll on iPhone SE. |
| F-28 (Recurring calculator) | Numeric fields should use `inputMode="numeric"`. Results should update live without requiring submit. Savings comparison must remain clear at 320px (prefer simple before/after display over multi-column table). |
| F-19 (Customer status page) | This page is opened from SMS on phones and must remain functional without JavaScript (SSR status steps). No login means no app shell: keep it as a lightweight content page for smallest viewport. |
15.3 Mobile Testing Matrix (All Features)
Before any public-facing feature merges:

| Viewport | Represents | Required Check |
|---|---|---|
| 320px | iPhone SE / small Android | No overflow, no clipped text, CTAs visible |
| 375px | iPhone 13 mini / standard | Primary layout verification |
| 393px | Pixel 7 / common Android | Android-specific rendering |
| 430px | iPhone 15 Pro Max | Large phone edge case |
| 768px | iPad mini / breakpoint boundary | Verify `md:` breakpoint transitions cleanly |
15.4 Mobile Performance Budgets
| Metric | Target | Tool |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s on 4G | Lighthouse mobile audit |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse mobile audit |
| FID (First Input Delay) | < 100ms | Web Vitals |
| Total JS shipped to mobile | < 200KB gzipped (initial load) | next build analysis |
| Hero image mobile size | < 80KB | Next.js Image optimization |
15.5 Component Patterns — Mobile Reference
When building new mobile UI, prefer these established patterns:

| Pattern | Use When | Reference Implementation |
|---|---|---|
| Scroll-snap carousel | Multiple similar cards (services, portfolio, case studies) | ServiceSpreadSection (post-elevation) |
| Accordion/disclosure | Multi-item content that is too tall when expanded (FAQ, timeline, specs) | TimelineSection (post-elevation) |
| Tap-to-expand card | Cards with hidden detail content on mobile | OfferAndIndustrySection (post-elevation) |
| Horizontal scroll tabs | Filter/category selection with 3+ options | BeforeAfterSlider tabs (post-elevation) |
| Inline trust strip | Trust signals that should flow with content (not absolute-positioned) | HeroSection mobile trust bar |
| Dual-layout component | When mobile and desktop need fundamentally different compositions | HeroSection (inline vs. absolute trust bar) |
| Skeleton loader | Any dynamically imported section | VariantAPublicPage dynamic imports |
15.6 Cross-References
| This Section | References |
|---|---|
| §15.1 M-1 through M-10 | Derived from HOMEPAGE-MOBILE-UX-UI-FUNCTIONAL-HARDENING-SPEC.md §3 |
| §15.2 Feature guidance | Maps to §8 feature definitions |
| §15.4 Performance budgets | Feeds into R-04 (Performance Hardening Pass) |
| §15.5 Component patterns | Established by MOBILE-ELEVATION-AUDIT.md recommendations |

## 16) 2026-04-03 Deep Reconciliation Addendum (Codebase vs 4.0)

### 16.1 Full Analysis Findings (Current Codebase)

This pass reconciled Master Spec 4.0 claims against active code and migrations.

| Area | Finding | Evidence |
|---|---|---|
| F-01 Morning Briefing | Implemented and active in admin overview module with greeting, action feed, schedule, and waiting quotes. | `src/components/admin/OverviewDashboard.tsx` |
| F-25 CTA taxonomy/instrumentation | Implemented for public surface via shared CTA component requiring `ctaId` and firing `cta_click` analytics metadata. | `src/components/public/variant-a/CTAButton.tsx`, `src/components/public/variant-a/QuoteCTA.tsx` |
| F-11 Map & directions | Implemented in employee assignment card with direct Google Maps launch. | `src/components/employee/EmployeeAssignmentCard.tsx` |
| F-12 Job-day summary | Implemented (`JobDayTimeline`) with day grouping and current/completed markers; currently degraded until `assignments.scheduled_start` is fully landed. | `src/components/employee/EmployeeTicketsClient.tsx` |
| F-17 Confirmation page | Route present and generated in build output. | `src/app/(public)/quote/success/page.tsx` |
| F-22/F-23/F-24 public conversion set | Implemented with dynamic service-area routes + service FAQ/pricing content modules + LocalBusiness/FAQ schema usage. | `src/app/(public)/service-area/[slug]/page.tsx`, `src/lib/service-faqs.ts`, `src/lib/service-pricing.ts`, service detail routes |
| F-07 post-job chain foundations | Implemented and validated at foundation level; schema/runtime now aligned after migrations 0021-0024. | `src/lib/post-job-sequence.ts`, `src/lib/post-job-settings.ts`, `src/app/api/post-job-*/route.ts`, `supabase/migrations/0022_*.sql`, `0023_*.sql`, `0024_*.sql` |
| R-00 mobile hardening | Implemented in code with explicit annotations across public components and global styles; Batch F evidence pack still pending. | Multiple `MOBILE-HARDENING` / `MOBILE-ELEVATION` markers in `src/components/public/**` and `src/styles/globals.css` |

### 16.2 In-Session Completion Checklist (Checked + Context)

This checklist tracks the concrete changes completed in the current execution cycle and verifies they are reflected in active truth.

- [x] **Post-job settings PATCH hardening**
  - Indicator: invalid numeric payloads no longer silently coerce and reset settings.
  - Context: finite-number parsing guard added before merge/normalize path.
  - Evidence: `src/app/api/post-job-settings/route.ts`

- [x] **Post-job settings default URL alignment**
  - Indicator: default review URL now prefers `NEXT_PUBLIC_SITE_URL` before legacy fallback.
  - Context: prevents inconsistent environment fallback behavior.
  - Evidence: `src/lib/post-job-settings.ts`

- [x] **Webhook signature enforcement hardening**
  - Indicator: fail-closed verification path when unsigned mode is not explicitly enabled.
  - Context: rejects missing signature/missing auth token configuration mismatch.
  - Evidence: `src/app/api/post-job-rating/route.ts`

- [x] **Deterministic matching for inbound ratings**
  - Indicator: matching now resolves to the most recent pending rating request for shared customer phone scenarios.
  - Context: reduces accidental routing when multiple jobs share a phone number.
  - Evidence: `src/app/api/post-job-rating/route.ts`

- [x] **Schema reconciliation for post-job execution**
  - Indicator: remote DB now includes required post-job and settings tables.
  - Context: pushed migrations after compatibility fixes for helper-function dependencies.
  - Evidence: `supabase/migrations/0021_quote_templates.sql`, `supabase/migrations/0022_post_job_sequence_and_payments.sql`, `supabase/migrations/0023_post_job_automation_settings.sql`

- [x] **Compatibility migration for jobs title parity**
  - Indicator: runtime and smoke tests no longer fail on missing `jobs.title`.
  - Context: legacy/partial remote schema normalized.
  - Evidence: `supabase/migrations/0024_jobs_title_compatibility.sql`

- [x] **F-07 preflight verification passed**
  - Indicator: env + DNS + HTTPS checks passed for Supabase target host.
  - Context: resolved prior connectivity blocker.
  - Evidence: `npm run preflight:f07` execution log

- [x] **F-07 smoke verification passed (8/8)**
  - Indicator: post-job sequence/settings foundations validated with cleanup.
  - Context: confirms scheduler/rating/idempotency foundational readiness.
  - Evidence: `npm run smoke:f07` execution log, `src/lib/post-job-smoke-tests.ts`

- [x] **Evidence artifact updated**
  - Indicator: template now records 2026-04-03 preflight/smoke outcomes.
  - Context: active closure documentation kept in sync with executed validation.
  - Evidence: `docs/evidence/f07-evidence-template.md`

- [x] **Regression checks passed after all changes**
  - Indicator: lint + build remain green after runtime and migration updates.
  - Context: no new compile/lint regressions introduced.
  - Evidence: `npm run lint`, `npm run build`

### 16.3 Remaining Items After This Addendum

The remaining launch-gate work is now concentrated in provider/device evidence and owner-run secret operations.

- Upstash token rotation closure in production controls.
- Production environment parity confirmation (hosting provider dashboard).
- Credential/device evidence for Twilio, Sentry, and QuickBooks end-to-end scenarios.