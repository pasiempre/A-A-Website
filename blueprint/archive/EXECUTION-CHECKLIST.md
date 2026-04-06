# Execution Checklist

Source of truth: Master-Spec-4.0 §4, §6, §13
Last updated: 2026-04-02

Rule: Complete each pass in order. Do not begin a later pass until all items in the current pass are closed with evidence.

---

## Pass 1 — Stability & Security Confirmation

| # | Item | Owner | Status | Evidence / Date |
|---|---|---|---|---|
| 1 | Revoke old Upstash token | Owner | ☐ | Upstash console screenshot |
| 2 | Set production env vars on Vercel | Owner | ☐ | Vercel dashboard confirmation |

**Exit gate:** Both rows marked ✅ with date and evidence.

---

## Pass 2 — Credential-Gated Validation (R-01 Runbook)

| # | Scenario | Provider | Status | Evidence / Date |
|---|---|---|---|---|
| 1 | SMS delivery + retry on real device | Twilio | ☐ | Delivery receipt + retry log |
| 2 | Offline photo queue sync under connectivity drop | Supabase Storage | ☐ | Photo appears after reconnect |
| 3 | QuickBooks OAuth callback + sync | Intuit | ☐ | Token exchange + invoice in sandbox |
| 4 | Sentry capture quality | Sentry | ☐ | Event with tags, metadata, runtime context |
| 5 | Rate-limit burst → deterministic 429 | Upstash | ☐ | Response headers + 429 on request 6 |

**Exit gate:** All five rows marked ✅ with timestamp, tester, environment, and evidence.

---

## Pass 3 — Release Policy Finalization

| # | Item | Status | Evidence / Date |
|---|---|---|---|
| 1 | `NEXT_PUBLIC_EMPLOYEE_INVENTORY=false` confirmed in code | ✅ | Added to lib/env.ts and filtered in EmployeePortalTabs.tsx (2026-03-22) |
| 2 | `/#industries` hash anchors confirmed (no dedicated routes) | ✅ | Verified in PublicHeader.tsx and OfferAndIndustrySection.tsx (2026-03-22) |
| 3 | User manual accuracy check against final build state | ⏸ | File not found in workspace (2026-03-22) |

**Exit gate:** All three rows marked ✅. Launch scope frozen.

---

## Priority Override — R-00 Homepage Mobile UX/UI/Functional Hardening

Source spec: `HOMEPAGE-MOBILE-UX-UI-FUNCTIONAL-HARDENING-SPEC.md`

| Batch | Scope | Status | Evidence / Date |
|---|---|---|---|
| A | Foundation layers (safe-area, z-index, sticky/mobile assistant coordination) | ✅ | Public chrome + assistant updates validated in code (2026-04-02) |
| B | Header + Hero structural mobile fixes | ✅ | Header/menu behavior and hero mobile restructuring validated in code (2026-04-02) |
| C | Heavy layout restructure set (Authority, ServiceSpread, Offer/Industry, Timeline) | ✅ | Responsive spacing and mobile composition validated in code (2026-04-02) |
| D | Content section mobile trims (Testimonials, About, Careers) | ✅ | Mobile density and readability updates validated in code (2026-04-02) |
| E | Remaining targeted fixes (ServiceArea, Footer, QuoteSection, FloatingQuotePanel) | ✅ | CTA ID, touch targets, and input ergonomics validated in code (2026-04-02) |
| F | QA + perceived performance polish | ✅ | Dynamic section skeleton fallbacks present in Variant A page (2026-04-02) |

**Exit gate:** All batches A-F marked ✅ and no mobile blockers at 320px/375px/430px.

---

## P0 Sprint — Operations Track

Start only after Passes 1-3 are closed.

Build in this order (see Master Spec §13 for rationale):

| Order | ID | Feature | Effort | Status | Ship Date |
|---|---|---|---|---|---|
| 1 | F-25 | CTA taxonomy + funnel instrumentation | M (1-2 days) | ✅ | 2026-03-22 |
| 2 | F-02 | Lead auto-acknowledgment | S (3-4 hrs) | ✅ | 2026-03-22 |
| 3 | F-03 | Lead aging alerts | M (1 day) | ✅ | 2026-03-22 |
| 4 | F-05 | Simplified sidebar grouping | S (2-3 hrs) | ✅ | 2026-03-22 |
| 5 | F-01 | Morning Briefing dashboard | L (2-3 days) | ✅ | 2026-03-22 |
| 6 | F-04 | Quick Quote templates | M (1-2 days) | ✅ | 2026-04-02 |
| 7 | F-11 | Map/navigation link (employee) | XS (30 min) | ✅ | 2026-03-22 |
| 8 | F-12 | Job-day summary (employee) | M (1 day) | ✅ | 2026-03-22 |

### Schema prerequisite

Migration 1 (Lead Lifecycle Fields) must land before F-01, F-03, and F-12 can be completed. See Master Spec §10.
**Status:** ✅ Migration 0020 applied (2026-03-22).

---

## P0 Sprint — Conversion Track (parallel)

| Order | ID | Feature | Effort | Content Needed | Status | Ship Date |
|---|---|---|---|---|---|---|
| 1 | F-17 | Confirmation page | S (2-3 hrs) | None | ✅ | 2026-03-22 |
| 2 | F-23 | Service-page objection modules | S (3-4 hrs) | 3-5 Q&As per service | ✅ | 2026-04-02 |
| 3 | F-24 | Pricing/SLA guidance | S (3-4 hrs) | Pricing ranges + SLAs | ✅ | 2026-04-02 |
| 4 | F-22 | Service-area route depth | L (2-3 days) | City descriptions + proof | ✅ | 2026-04-02 |

### Content prerequisite

F-22, F-23, and F-24 require content drafted before development begins. See Master Spec §8.0.2.

---

## P1 Sprint — Operations Track

Start after P0 ships.

| ID | Feature | Effort | Status | Ship Date |
|---|---|---|---|---|
| F-06 | One-tap dispatch | M | ✅ | 2026-04-03 |
| F-07 | Post-job automation chain | L | 🟡 | 2026-04-03 |
| F-08 | Simple revenue tracker | M | ☐ | |
| F-09 | Help tooltips + first-login tour | S | ☐ | |
| F-13 | Photo requirements (employee) | M | ☐ | |
| F-14 | Completion lockout (employee) | M | ☐ | |
| F-15 | Time logging visibility | M | ☐ | |
| F-29 | SLA performance dashboard | M | ☐ | |
| F-30 | Capacity throttle signal | M | ☐ | |

### Schema prerequisite

Migration 2 (Payment & Quote Templates) must land before F-04, F-07, F-08.
Migration 3 (Instrumentation & Onboarding) must land before F-09, F-25.
Migration 4 (Employee & Automation) must land before F-13, F-18, F-20, F-32.

F-07 progress evidence (2026-04-03):
- `post_job_sequence` schema landed via migration 0022.
- Auto-start wired from completion report route into `startPostJobSequence`.
- Manual admin trigger route added (`/api/post-job-sequence`).
- Scheduler route added (`/api/post-job-scheduler`) for due-step execution.
- Inbound rating route added (`/api/post-job-rating`) for 1-5 SMS parsing and branch logic.
- Runtime settings persistence added via migration 0023 (`automation_settings` row for `post_job`).
- Admin settings API added (`/api/post-job-settings`) with admin auth and normalized persistence.
- Admin configuration UI added (`PostJobAutomationSettingsClient`) and wired into Configuration module.
- Acceptance runbook added: [Production-workspace/docs/post-job-automation-acceptance-runbook.md](Production-workspace/docs/post-job-automation-acceptance-runbook.md).
- Preflight command added: `npm run preflight:f07` (env + DNS + HTTPS readiness).
- Automated precheck added: `npm run smoke:f07` (script: `src/lib/post-job-smoke-tests.ts`).
- Evidence template added: [Production-workspace/docs/evidence/f07-evidence-template.md](Production-workspace/docs/evidence/f07-evidence-template.md).

---

## P1 Sprint — Conversion + Automation Track (parallel)

| ID | Feature | Effort | Content Needed | Status | Ship Date |
|---|---|---|---|---|---|
| F-18 | Quote follow-up sequence | M | None | ☐ | |
| F-20 | Customer reactivation alerts | S-M | None | ☐ | |
| F-26 | Proof library / portfolio hub | L | 5-10 case studies | ☐ | |
| F-27 | Campaign landing templates | M-L | Campaign copy variants | ☐ | |
| F-28 | Recurring revenue emphasis | M | Calculator inputs + content | ☐ | |
| F-32 | Multi-touch lead nurture | M | None | ☐ | |
| F-33 | Review generation workflow | M | None | ☐ | |

---

## P2 Backlog

Not scheduled. Re-evaluate after P1 ships.

| ID | Feature | Surface |
|---|---|---|
| F-10 | Smart crew suggestions | Admin |
| F-16 | GPS-verified crew check-in | Employee |
| F-19 | Customer job status page | Public |
| F-21 | Weather-aware scheduling flags | Admin |
| F-31 | Referral tracking | Admin + Public |

---

## Post-Launch Tech Debt

Not scheduled. Re-evaluate after P0 ships and real traffic data exists.

| Item | Source |
|---|---|
| Extract `apiResponse()` helper | Code Health Audit §2A |
| Extract `useAsyncAction()` hook | Code Health Audit §2A |
| Extract `format.ts` utilities | Code Health Audit §2A |
| Extract `status-colors.ts` | Code Health Audit §2A |
| Consolidate auth patterns | Code Health Audit §2A |
| Decompose `UnifiedInsightsClient` | Code Health Audit §2B #1 |
| Bundle/chunk optimization | Master Spec R-04 |
| Client component ratio analysis | Code Health Audit §2C |

---

## Recalibration

| Frequency | Action |
|---|---|
| Weekly | Update pass/sprint status, note blockers |
| After each feature ships | Mark complete with date, update Master Spec §8 status |
| Monthly | Compare estimates vs actuals, re-rank if needed |

Rule: if a launch gate stays blocked for 5+ business days, escalate and document the blocker reason here.
