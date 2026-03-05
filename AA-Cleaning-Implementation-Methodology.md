# A&A Cleaning Platform — Implementation Methodology
## From Spec to Tickets: A Structured Approach

---

# 1. PURPOSE

This document bridges the Master Spec (what to build) and actual development (how to build it). It provides:

- A tiered framework for breaking down spec sections
- Templates for extracting requirements
- A worked example showing the full flow
- Structures for decision logging and traceability
- Guidance on sequencing work

**Philosophy:** Apply full rigor to what you're building now. Lighter treatment for future phases. The goal is clarity, not bureaucracy.

---

# 2. TIERED FRAMEWORK

Not every spec section needs the same treatment. Apply methodology depth based on section type.

## 2.1 Tier Definitions

| Tier | Treatment | When to Use | Output |
|------|-----------|-------------|--------|
| **Tier 1: Full** | Complete capability extraction, requirements, tickets | Feature sections being built in current phase | Requirement cards, ticket breakdown |
| **Tier 2: Structural** | Capabilities + data requirements + key rules | Technical sections, data model | Schema definitions, rule documentation |
| **Tier 3: Light** | Intent + key decisions + acceptance criteria | Strategic sections, future phases | Summary cards |
| **Tier 4: Reference** | Checklist format | Operational sections, open questions | Action checklists |

## 2.2 Section-to-Tier Mapping

| Spec Section | Tier | Rationale |
|--------------|------|-----------|
| Part 1: Strategic Foundation | Tier 3 | Context, not buildable features |
| Part 2: Friction Analysis | Tier 3 | Problem framing, informs features |
| Part 3: Features to Build | **Tier 1** | Core feature definitions — needs full breakdown |
| Part 4: Visual Identity | **Tier 2** | Contains build-critical constraints (see 2.2.1) |
| Part 5: Technical Architecture | **Tier 2** | Data model and technical rules |
| Part 6: Build Plan | Tier 4 | Timeline reference, already structured |
| Part 7: Budget & Social Media | Tier 4 | Operational checklist |
| Part 8: Open Questions | Tier 4 | Decision tracking |
| Part 9: Validation & Business Case | Tier 3 | Strategic context |
| Part 10: Risk Management | **Tier 2** | Contains build-critical security/privacy rules (see 2.2.2) |

### 2.2.1 Part 4 (Visual Identity) — Why Tier 2

Part 4 is NOT just "design guidance." It contains hard constraints that affect implementation:

| Item | Build Impact |
|------|--------------|
| **Locked fonts** (Cormorant Garamond, Satoshi, system fonts) | CSS setup, font loading strategy |
| **Color system** (exact hex codes) | Tailwind config, CSS variables |
| **Performance budget** (<3s load on 3G) | Image optimization, lazy loading, bundle size |
| **Accessibility requirements** (WCAG 2.1 AA) | Component implementation, testing |
| **Component inventory** | UI component library scope |
| **Mobile-first responsive rules** | CSS breakpoint strategy |

**Required extraction from Part 4:**
- Tailwind config values
- CSS variable definitions
- Component prop interfaces
- Performance test thresholds

**Phase 1 UI Foundation Tickets:** The master spec's Part 4 now contains a concrete component inventory (buttons, badges, cards, form elements, navigation patterns), specific accessibility constraints, and surface mapping. These should be broken into Phase 1 tickets as a "UI Foundation" work package:
- `UI: Configure Tailwind theme (colors, typography, spacing from 4.2/4.3)`
- `UI: Build core button variants (Primary, Secondary, Destructive, Ghost, Large Employee)`
- `UI: Build status badge components (job workflow status + QA status per 4.5)`
- `UI: Build card components (Job, Client, Notification)`
- `UI: Configure font loading (Cormorant Garamond, Satoshi, system fallbacks per 4.3)`
- `UI: Validate accessibility contrast ratios for all surface mappings (4.2 Accessibility)`
- `TEST: Lighthouse audit baseline for performance budget (10.5)`

### 2.2.2 Part 10 (Risk Management) — Why Tier 2

Part 10 contains security and operational constraints that must be built into the system:

| Item | Build Impact |
|------|--------------|
| **RLS policy requirements** | Every table needs policies |
| **Input sanitization rules** | Every form needs validation |
| **File upload restrictions** | Storage bucket config, server validation |
| **Backup requirements** | Cron job setup, storage retention |
| **Error logging requirements** | Error handler implementation |
| **Audit trail requirements** | Audit log table, triggers |

**Required extraction from Part 10:**
- Security ticket checklist per feature
- Backup cron job specification
- Error logging schema
- Audit log triggers

## 2.3 Phase-Based Application

**Apply Tier 1 (Full) only to the current build phase.** Don't over-invest in detailed requirements for Phase 4 features while building Phase 1.

| Phase | Sections to Fully Break Down |
|-------|------------------------------|
| Phase 1 (MVP) | 3.0 MVP Scope, 3.2 Work Order System (partial), Public Site, Auth & User Provisioning (5.1 Auth Strategy, 5.2 User Provisioning) |
| Phase 2 | 3.2.1 Notifications, 3.3.1 Completion Reports, QA System, Checklist Templates |
| Phase 3 | Client Portal (if validated), 3.4 Resource Library, Onboarding |
| Phase 4 | 3.5 Financial Dashboard, 3.6 Analytics |
| Phase 5 | Inventory, Chatbot, Automation |

---

# 3. TEMPLATES

## 3.1 Tier 1: Full Capability Breakdown

Use this template for feature sections in the current build phase.

```markdown
## Section: [Section Name]

### 3.1.1 Intent
What problem this solves. One paragraph max.

### 3.1.2 Actors
Who interacts with this feature.
- Actor 1: [role] — [what they do here]
- Actor 2: [role] — [what they do here]

### 3.1.3 Capabilities
Discrete actions. Format: [Actor] can [action] to [outcome].

- C1: [capability]
- C2: [capability]
- C3: [capability]

### 3.1.4 Functional Requirements
What the system must do. Derived from capabilities.

| ID | Requirement | Capability | Priority |
|----|-------------|------------|----------|
| FR1 | | C1 | Must |
| FR2 | | C1 | Must |
| FR3 | | C2 | Should |

### 3.1.5 UI Requirements
Screen/component needs.

| ID | Requirement | Platform | Notes |
|----|-------------|----------|-------|
| UI1 | | Admin | |
| UI2 | | Employee Mobile | |

### 3.1.6 Data Requirements
What data is created, read, updated, deleted.

| ID | Entity | Operation | Fields | Capability |
|----|--------|-----------|--------|------------|
| DR1 | jobs | CREATE | title, client_id, site_address, ... | C1 |
| DR2 | job_assignments | CREATE | job_id, user_id, role | C2 |

### 3.1.7 Business Rules
Logic that governs behavior.

| ID | Rule | Enforcement |
|----|------|-------------|
| BR1 | A job cannot be assigned without a site address | Form validation + DB constraint |
| BR2 | Only admin can create jobs | RLS policy |

### 3.1.8 State Machine (if applicable)

For features involving status transitions, define the formal state machine. This is REQUIRED for any entity with a `status` field.

**State Definition:**
| State | Description | Entry Criteria | Exit Criteria |
|-------|-------------|----------------|---------------|
| state_1 | What this state means | How you get here | How you leave |
| state_2 | | | |

**Transition Table:**
| Current State | Event | Actor | Next State | Side Effects | Invalid Transition Behavior |
|---------------|-------|-------|------------|--------------|----------------------------|
| state_1 | event_name | who can trigger | state_2 | What happens (notifications, logs, etc.) | What to return/show if attempted |
| state_2 | event_name | who can trigger | state_3 | | |

**Invariants:**
- Rules that must ALWAYS be true regardless of state
- Example: "A job cannot have qa_status=approved if status != complete"

**Concurrency Rules:**
- What happens if two actors try to transition simultaneously?
- Example: "Last write wins" or "Optimistic locking with version field"

### 3.1.9 Edge Cases
What happens when things go wrong or are unusual.

| ID | Scenario | Expected Behavior |
|----|----------|-------------------|
| EC1 | Admin creates job with past date | Allow with warning |
| EC2 | Assigned crew member is deactivated | Show alert, allow reassignment |

### 3.1.9 Permissions (RLS)
Who can do what.

| Actor | Can Create | Can Read | Can Update | Can Delete |
|-------|------------|----------|------------|------------|
| Admin | Yes | All | All | Yes |
| Employee | No | Own assignments | Own status | No |
| Client | No | Own jobs | No | No |

### 3.1.10 Integrations
External systems touched.

| ID | System | Trigger | Data Flow |
|----|--------|---------|-----------|
| I1 | Twilio | Job assigned | Send SMS to crew |
| I2 | Supabase Storage | Photo uploaded | Store file, return URL |

### 3.1.11 API Contracts

For each backend endpoint/action, define the contract explicitly. This enables reliable implementation by both humans and AI agents.

**Endpoint:** `[METHOD] /api/[path]` or `[server action name]`

```typescript
// Input Schema (Zod)
const InputSchema = z.object({
  field1: z.string().min(1).max(255),
  field2: z.number().int().positive(),
  // ...
});

// Output Schema (Success)
const OutputSchema = z.object({
  id: z.string().uuid(),
  // ...
});

// Error Codes
| Code | HTTP Status | When | Response Body |
|------|-------------|------|---------------|
| VALIDATION_ERROR | 400 | Input fails schema | { error: "VALIDATION_ERROR", details: [...] } |
| UNAUTHORIZED | 401 | No valid session | { error: "UNAUTHORIZED" } |
| FORBIDDEN | 403 | Valid session, no permission | { error: "FORBIDDEN", reason: "..." } |
| NOT_FOUND | 404 | Referenced entity doesn't exist | { error: "NOT_FOUND", entity: "..." } |
| CONFLICT | 409 | Business rule violation | { error: "CONFLICT", rule: "..." } |

// Side Effects
- What gets created/updated/deleted
- What notifications are sent
- What gets logged

// Idempotency
- Is this operation idempotent?
- If not, what prevents duplicate submissions?
```

### 3.1.12 Observability
How to know it's working.

| ID | What to Track | How |
|----|---------------|-----|
| O1 | Job creation success/failure | audit_log entry |
| O2 | SMS delivery status | Twilio webhook → notifications table |

### 3.1.13 Acceptance Criteria
How to verify the feature works. Written as testable statements.

| ID | Criterion | Type |
|----|-----------|------|
| AC1 | Admin can create a job with required fields and see it in the job list | Happy path |
| AC2 | Employee cannot access create job form | Permission |
| AC3 | Job creation fails gracefully if Supabase is unreachable | Failure |
| AC4 | Create job form works on mobile viewport | Mobile |
| AC5 | All form labels display in Spanish when locale is /es/ | Bilingual |

### 3.1.14 Nonfunctional Requirements

Constraints that apply to this feature from Master Spec Parts 4, 5, and 10.

**Performance:**
| Metric | Target | How to Verify |
|--------|--------|---------------|
| Page load | < 3s on 3G | Lighthouse throttled test |
| API response | < 500ms p95 | Load test or monitoring |
| Time to interactive | < 5s | Lighthouse |

**Accessibility:**
| Requirement | Standard | How to Verify |
|-------------|----------|---------------|
| Keyboard navigation | WCAG 2.1 AA | Manual test all interactive elements |
| Screen reader | Announce form fields | VoiceOver/NVDA test |
| Color contrast | 4.5:1 minimum | Lighthouse or contrast checker |

**Bilingual:**
| Requirement | How to Verify |
|-------------|---------------|
| All UI text in translation files | No hardcoded strings in components |
| Spanish is primary for crew views | Default locale check |
| Date/number formatting locale-aware | Manual verification |

**Security:**
| Requirement | How to Verify |
|-------------|---------------|
| Input sanitization | Unit tests for XSS vectors |
| Auth required | E2E test unauthenticated access blocked |
| RLS enforced | Integration test cross-user access blocked |

**Observability:**
| Requirement | How to Verify |
|-------------|---------------|
| Errors logged with context | Check error_logs after failure test |
| Audit trail for mutations | Check audit_log after create/update |

### 3.1.15 Tickets
Implementation units. Format: [Type] [Title]

**Epic:** [Section Name]

**Features:**
- F1: [Feature name]
- F2: [Feature name]

**Tasks:**
| ID | Title | Feature | Type | Estimate |
|----|-------|---------|------|----------|
| T1 | | F1 | Migration | |
| T2 | | F1 | Backend | |
| T3 | | F1 | Frontend | |
| T4 | | F1 | Test | |

### 3.1.16 Open Questions
Unresolved issues that need answers before or during build.

| ID | Question | Impact | Status |
|----|----------|--------|--------|
| Q1 | | Blocks T3 | Open |
| Q2 | | Nice to know | Open |

### 3.1.17 System Surface Map
Where implementation touches.

| Ticket | Frontend | Backend | Database | Auth/RLS | Notifications | 3rd Party | Analytics |
|--------|----------|---------|----------|----------|---------------|-----------|-----------|
| T1 | | | ✓ | ✓ | | | |
| T2 | | ✓ | ✓ | | | | |
| T3 | ✓ | | | | | | |
| T4 | | | | | ✓ | Twilio | |

### 3.1.18 Definition of Done

A feature is DONE when ALL of the following are true:

**Code:**
- [ ] All tickets in "Done" status
- [ ] Code merged to main branch
- [ ] No TypeScript errors
- [ ] No ESLint warnings (or explicitly suppressed with justification)

**Database:**
- [ ] Migrations applied and tested (up and down)
- [ ] RLS policies verified with test users
- [ ] Indexes added for query patterns

**Testing:**
- [ ] All acceptance criteria have passing tests
- [ ] E2E tests pass in CI
- [ ] Manual smoke test completed

**Security:**
- [ ] Input validation implemented server-side
- [ ] No secrets in code or logs
- [ ] RLS prevents cross-user data access

**Observability:**
- [ ] Error logging in place
- [ ] Audit log entries for mutations
- [ ] No console.log statements left in code

**Localization:**
- [ ] All strings in translation files
- [ ] Spanish translations complete
- [ ] Tested in both /en/ and /es/ routes

**Documentation:**
- [ ] Traceability matrix updated
- [ ] Decision log updated (if decisions were made)
- [ ] Open questions resolved or escalated

**Stakeholder:**
- [ ] Demo'd to stakeholder (if applicable)
- [ ] No blocking feedback
```

---

## 3.2 Tier 2: Structural Breakdown

Use for technical/data sections.

```markdown
## Section: [Section Name]

### Intent
What this technical component enables.

### Schema Definition
```sql
-- Table definition with comments
```

### Field Specifications
| Field | Type | Required | Default | Validation | Notes |
|-------|------|----------|---------|------------|-------|
| | | | | | |

### Relationships
| From | To | Type | Constraint |
|------|-----|------|------------|
| jobs | clients | Many-to-One | FK, ON DELETE CASCADE |

### Indexes
| Name | Fields | Purpose |
|------|--------|---------|
| | | |

### RLS Policies
| Policy Name | Operation | Using Clause | Purpose |
|-------------|-----------|--------------|---------|
| | | | |

### Business Rules
| ID | Rule | Enforcement |
|----|------|-------------|
| | | |

### State Machine (if entity has status field)

**States:**
| State | Description | Entry Criteria |
|-------|-------------|----------------|
| | | |

**Transitions:**
| From | Event | Actor | To | Side Effects |
|------|-------|-------|----|--------------|
| | | | | |

**Invariants:**
- Rule that must always hold

### Migration Sequence
1. Create table X
2. Create table Y (depends on X)
3. Add indexes
4. Add RLS policies
```

---

## 3.3 Tier 3: Light Breakdown

Use for strategic/context sections.

```markdown
## Section: [Section Name]

### Intent
One paragraph: what this section establishes.

### Key Decisions
| Decision | Rationale | Impact |
|----------|-----------|--------|
| | | |

### Constraints
- Constraint 1
- Constraint 2

### Success Criteria
- How we know this section's goals are met

### Dependencies
- What this section depends on
- What depends on this section
```

---

## 3.4 Tier 4: Reference Checklist

Use for operational sections.

```markdown
## Section: [Section Name]

### Purpose
One sentence.

### Checklist
- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

### Owner
Who is responsible.

### Timeline
When this needs to be done.

### Status
Current state.
```

---

# 4. WORKED EXAMPLE: CREATE JOB

This demonstrates Tier 1 (Full) treatment for a core MVP capability.

---

## Section: Work Order System — Create Job

### 4.1 Intent

Enable Areli to create structured work orders that replace text-message job dispatch. A job record captures everything crew needs to complete work: location, scope, contact, and schedule.

### 4.2 Actors

- **Admin (Areli):** Creates and configures jobs
- **System:** Validates data, triggers notifications

### 4.3 Capabilities

- **C1:** Admin can create a new job with required details
- **C2:** Admin can save a job as draft without assigning
- **C3:** Admin can attach site photos to a job
- **C4:** Admin can duplicate an existing job (for recurring work)
- **C5:** System validates required fields before saving

### 4.4 Functional Requirements

| ID | Requirement | Capability | Priority |
|----|-------------|------------|----------|
| FR1 | System shall provide a form to create a new job | C1 | Must |
| FR2 | Form shall require: title, client, site address, scheduled date | C1 | Must |
| FR3 | Form shall allow optional: scope description, on-site contact, time window, notes | C1 | Must |
| FR4 | System shall save job with status=draft if not assigned | C2 | Must |
| FR5 | System shall allow uploading 1-10 site photos per job | C3 | Should |
| FR6 | System shall provide "Duplicate" action on existing jobs | C4 | Should |
| FR7 | Duplicate shall copy all fields except: scheduled_date, status, photos | C4 | Should |
| FR8 | System shall validate address format (non-empty string) | C5 | Must |
| FR9 | System shall prevent saving if required fields are missing | C5 | Must |

### 4.5 UI Requirements

| ID | Requirement | Platform | Notes |
|----|-------------|----------|-------|
| UI1 | Create Job form accessible from admin dashboard | Admin Web | Primary action button |
| UI2 | Form uses single-column layout on mobile | Admin Mobile | Responsive |
| UI3 | Client selector shows recent clients first | Admin | UX optimization |
| UI4 | Address field includes Google Places autocomplete | Admin | Phase 2 — use plain text for MVP |
| UI5 | Photo upload shows thumbnails with delete option | Admin | Max 10 photos |
| UI6 | Save button disabled until required fields valid | Admin | Inline validation |
| UI7 | Success state shows "Job created" toast + redirect to job detail | Admin | |

### 4.6 Data Requirements

| ID | Entity | Operation | Fields | Capability |
|----|--------|-----------|--------|------------|
| DR1 | jobs | CREATE | id, client_id, title, job_type, priority, status, site_address, scope_description, notes_internal, onsite_contact_name, onsite_contact_phone, scheduled_date, scheduled_time_start, scheduled_time_end, created_at | C1, C2 |
| DR2 | job_photos | CREATE | id, job_id, photo_url, photo_type='site_visit', uploaded_by, created_at | C3 |
| DR3 | audit_log | CREATE | entity_type='job', entity_id, action='created', performed_by, performed_at | C1 |

### 4.7 Business Rules

| ID | Rule | Enforcement |
|----|------|-------------|
| BR1 | Only users with role=admin can create jobs | RLS policy + UI route guard |
| BR2 | Job must have a client_id that exists in clients table | FK constraint |
| BR3 | scheduled_date can be in the past (for logging completed work) | No constraint, allow with warning |
| BR4 | Job status defaults to 'draft' on creation | DB default |
| BR5 | Job priority defaults to 'normal' on creation | DB default |
| BR6 | job_type defaults to 'general' if not specified | DB default |

### 4.8 Edge Cases

| ID | Scenario | Expected Behavior |
|----|----------|-------------------|
| EC1 | Admin creates job with past scheduled_date | Allow with yellow warning: "This date is in the past" |
| EC2 | Admin tries to create job for deactivated client | Prevent: "This client is inactive. Reactivate to create jobs." |
| EC3 | Photo upload fails mid-way (3 of 5 uploaded) | Keep successfully uploaded photos, show retry for failed ones |
| EC4 | Network disconnects during form submission | Show error, preserve form state, allow retry |
| EC5 | Admin creates duplicate while original job is assigned | Duplicate gets status=draft regardless of original status |

### 4.9 Permissions (RLS)

| Actor | Can Create | Can Read | Can Update | Can Delete |
|-------|------------|----------|------------|------------|
| Admin | Yes | All jobs | All jobs | Yes (soft delete) |
| Employee | No | Only assigned jobs | Only own assignment status | No |
| Client | No | Only own client's jobs | No | No |

**RLS Policy (jobs table):**
```sql
-- Admin full access
CREATE POLICY "admin_all" ON jobs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Employee read own assignments
CREATE POLICY "employee_read_assigned" ON jobs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM job_assignments
      WHERE job_id = jobs.id AND user_id = auth.uid()
    )
  );

-- Client read own jobs
CREATE POLICY "client_read_own" ON jobs
  FOR SELECT USING (
    client_id IN (
      SELECT id FROM clients
      WHERE primary_contact_user_id = auth.uid()
    )
  );
```

### 4.10 Integrations

| ID | System | Trigger | Data Flow | Phase |
|----|--------|---------|-----------|-------|
| I1 | Supabase Storage | Photo upload | File → Storage → URL returned → job_photos.photo_url | MVP |
| I2 | Audit Log | Job created | Job data → audit_log table | MVP |

**Note:** SMS notification is triggered on job assignment, not job creation. That's a separate capability.

### 4.11 API Contract

**Endpoint:** `POST /api/jobs`

**Authentication:** Required. Admin role only.

**Input Schema (Zod):**
```typescript
import { z } from 'zod';

export const CreateJobInput = z.object({
  title: z.string().min(1, "Title is required").max(255),
  client_id: z.string().uuid("Invalid client ID"),
  site_address: z.string().min(1, "Site address is required").max(500),
  scheduled_date: z.string().date("Invalid date format"),

  // Optional fields
  job_type: z.enum(['general', 'deep_clean', 'post_construction', 'recurring']).default('general'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  scope_description: z.string().max(2000).optional(),
  notes_internal: z.string().max(2000).optional(),
  onsite_contact_name: z.string().max(100).optional(),
  onsite_contact_phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
  scheduled_time_start: z.string().time().optional(),
  scheduled_time_end: z.string().time().optional(),
});

export type CreateJobInput = z.infer<typeof CreateJobInput>;
```

**Output Schema (Success - 201):**
```typescript
export const CreateJobOutput = z.object({
  id: z.string().uuid(),
  title: z.string(),
  client_id: z.string().uuid(),
  status: z.literal('draft'),
  job_type: z.string(),
  priority: z.string(),
  site_address: z.string(),
  scheduled_date: z.string(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid(),
});

export type CreateJobOutput = z.infer<typeof CreateJobOutput>;
```

**Error Responses:**

| Condition | Status | Response Body |
|-----------|--------|---------------|
| Missing/invalid fields | 400 | `{ error: "VALIDATION_ERROR", code: "VALIDATION_ERROR", details: [{ field: "title", message: "Title is required" }] }` |
| No session | 401 | `{ error: "UNAUTHORIZED", code: "UNAUTHORIZED", message: "Authentication required" }` |
| Not admin role | 403 | `{ error: "FORBIDDEN", code: "FORBIDDEN", message: "Admin access required" }` |
| Client doesn't exist | 404 | `{ error: "NOT_FOUND", code: "CLIENT_NOT_FOUND", message: "Client not found", entity: "client" }` |
| Client is deactivated | 409 | `{ error: "CONFLICT", code: "CLIENT_INACTIVE", message: "Cannot create job for inactive client" }` |
| Database error | 500 | `{ error: "INTERNAL_ERROR", code: "DB_ERROR", message: "Failed to create job" }` |

**Side Effects:**
- Creates row in `jobs` table with status='draft'
- Creates row in `audit_log` with action='job.created'

**Idempotency:** Not idempotent. Multiple calls create multiple jobs. Client should disable submit button on click.

**Route Guard (middleware):**
```typescript
// src/app/api/jobs/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Auth check
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", code: "UNAUTHORIZED", message: "Authentication required" },
      { status: 401 }
    );
  }

  // Role check
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (user?.role !== 'admin') {
    return NextResponse.json(
      { error: "FORBIDDEN", code: "FORBIDDEN", message: "Admin access required" },
      { status: 403 }
    );
  }

  // Parse and validate input
  const body = await request.json();
  const parsed = CreateJobInput.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        code: "VALIDATION_ERROR",
        details: parsed.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      },
      { status: 400 }
    );
  }

  // Business logic continues...
}
```

### 4.12 Observability

| ID | What to Track | How | Alert Threshold |
|----|---------------|-----|-----------------|
| O1 | Job creation count | audit_log query | None (metric only) |
| O2 | Job creation errors | error_logs table | >5 failures/hour |
| O3 | Photo upload failures | error_logs table | >10% failure rate |

### 4.13 Acceptance Criteria

| ID | Criterion | Type |
|----|-----------|------|
| AC1 | Admin can create a job with title, client, address, and date, then see it in job list | Happy path |
| AC2 | Admin can save a draft job without assigning crew | Happy path |
| AC3 | Admin can upload 3 site photos and see thumbnails | Happy path |
| AC4 | Admin can duplicate an existing job and edit the duplicate | Happy path |
| AC5 | Employee navigating to /admin/jobs/new is redirected to their portal | Permission |
| AC6 | Unauthenticated user navigating to /admin/jobs/new is redirected to login | Permission |
| AC7 | Form shows validation errors for missing required fields | Validation |
| AC8 | Form preserves entered data if submission fails due to network error | Failure |
| AC9 | Create job form is fully usable on iPhone SE viewport (375px) | Mobile |
| AC10 | All form labels and buttons display in English on /en/ route | Bilingual |
| AC11 | All form labels and buttons display in Spanish on /es/ route | Bilingual |

### 4.14 Tickets

**Epic:** Work Order System (MVP)

**Feature:** F1 — Create Job

| ID | Title | Type | Depends On | Estimate | Status |
|----|-------|------|------------|----------|--------|
| T1.1 | Create jobs table migration | DB | — | 1h | |
| T1.2 | Create job_photos table migration | DB | T1.1 | 30m | |
| T1.3 | Add RLS policies for jobs table | DB/Auth | T1.1 | 1h | |
| T1.4 | Create job API route (POST /api/jobs) | Backend | T1.1, T1.3 | 2h | |
| T1.5 | Create job form component | Frontend | T1.4 | 3h | |
| T1.6 | Add client selector to job form | Frontend | T1.5 | 1h | |
| T1.7 | Add photo upload to job form | Frontend | T1.5, T1.2 | 2h | |
| T1.8 | Add job to dashboard job list | Frontend | T1.4 | 1h | |
| T1.9 | Add audit log entry on job creation | Backend | T1.4 | 30m | |
| T1.10 | E2E test: create job happy path | Test | T1.8 | 1h | |
| T1.11 | E2E test: create job permission denied | Test | T1.8 | 30m | |

**Feature:** F2 — Duplicate Job

| ID | Title | Type | Depends On | Estimate | Status |
|----|-------|------|------------|----------|--------|
| T2.1 | Add duplicate action to job detail page | Frontend | F1 | 1h | |
| T2.2 | Create duplicate job API route | Backend | F1 | 1h | |
| T2.3 | E2E test: duplicate job | Test | T2.1 | 30m | |

### 4.15 Open Questions

| ID | Question | Impact | Status | Resolution |
|----|----------|--------|--------|------------|
| Q1 | Should draft jobs appear in the main job list or a separate "Drafts" tab? | UI design | Open | |
| Q2 | Can a job have multiple scheduled dates (multi-day)? | Data model | Resolved | Use project grouping for multi-day; each day is a separate job |
| Q3 | Should we auto-save draft jobs while editing? | UX | Open | |

### 4.16 System Surface Map

| Ticket | Frontend | Backend | Database | Auth/RLS | Notifications | 3rd Party | Logging |
|--------|----------|---------|----------|----------|---------------|-----------|---------|
| T1.1 | | | ✓ | | | | |
| T1.2 | | | ✓ | | | | |
| T1.3 | | | ✓ | ✓ | | | |
| T1.4 | | ✓ | ✓ | | | | ✓ |
| T1.5 | ✓ | | | | | | |
| T1.6 | ✓ | ✓ | | | | | |
| T1.7 | ✓ | ✓ | ✓ | | | Supabase Storage | |
| T1.8 | ✓ | ✓ | | | | | |
| T1.9 | | ✓ | ✓ | | | | ✓ |
| T1.10 | ✓ | ✓ | ✓ | ✓ | | | |
| T1.11 | ✓ | ✓ | | ✓ | | | |

---

# 5. DECISION LOG

Record every product/technical decision made during implementation.

## 5.1 Template

| ID | Date | Issue | Decision | Rationale | Impact | Decided By |
|----|------|-------|----------|-----------|--------|------------|
| D001 | | | | | | |

## 5.2 Example Entries

| ID | Date | Issue | Decision | Rationale | Impact | Decided By |
|----|------|-------|----------|-----------|--------|------------|
| D001 | 2026-03-02 | Should checklists be in MVP? | No — defer to Phase 2 | MVP tests core hypothesis (dispatch + photos). Checklists add complexity without validating the core. | Simpler MVP, free-text scope for now | Spec review |
| D002 | 2026-03-02 | How to handle multi-day jobs? | Use project grouping, each day is a separate job | Simpler data model, avoids complex scheduling UI | Added projects table, job.project_id FK | Audit recommendation |
| D003 | 2026-03-02 | QA status as part of job status or separate field? | Separate qa_status field | Job status tracks workflow stage; QA status tracks review outcome. Cleaner separation. | Added qa_status, qa_reviewed_by, qa_reviewed_at, qa_notes to jobs table | Audit recommendation |

---

# 6. TRACEABILITY MATRIX

Track spec → requirements → implementation → testing → release readiness.

## 6.1 Template

| Spec Section | Requirement ID | Capability | Ticket(s) | External Dependencies | Dependency Status | Impl Status | Test Status | Release Ready |
|--------------|----------------|------------|-----------|----------------------|-------------------|-------------|-------------|---------------|
| | | | | Real-world blockers | Resolved/Pending/Blocked | Not Started/In Progress/Done | Not Written/Written/Passing | Yes/No + reason |

**External Dependencies** are non-code blockers that must be resolved before work can proceed:
- Business decisions (e.g., "Which QuickBooks version does Areli use?")
- Access/credentials (e.g., "Twilio account credentials")
- Real-world validation (e.g., "Crew phone compatibility tested")
- Stakeholder approval (e.g., "GC confirms interest in portal")

**Dependency Status:**
- **Resolved:** Answer obtained, documented in Decision Log
- **Pending:** Question asked, awaiting response
- **Blocked:** Cannot proceed until resolved — escalate

**Rule:** A ticket cannot move to "In Progress" if it has a Pending or Blocked external dependency.

## 6.2 Example (Phase 1 MVP)

| Spec Section | Requirement ID | Capability | Ticket(s) | External Deps | Dep Status | Impl Status | Test Status | Release Ready |
|--------------|----------------|------------|-----------|---------------|------------|-------------|-------------|---------------|
| 3.2 Work Orders | FR1-FR9 | C1: Create Job | T1.1-T1.11 | — | — | Not Started | Not Written | No |
| 3.2 Work Orders | — | C4: Duplicate Job | T2.1-T2.3 | — | — | Not Started | Not Written | No |
| 3.2 Work Orders | — | C6: Assign Crew | — | Twilio credentials | Pending | Not Started | Not Written | No |
| 6.1 Phase 1 | — | Camera/Photo Spike | SPIKE-1 | Crew phone models identified | Resolved | Not Started | Not Written | No |
| 6.1 Phase 1 | — | Public Site | — | — | — | Not Started | Not Written | No |
| 6.1 Phase 1 | — | Lead Intake Form | — | — | — | Not Started | Not Written | No |
| 3.5 Financial Dashboard | — | QuickBooks Integration | — | QB version confirmed | **Blocked** | Not Started | Not Written | No |

## 6.3 External Dependency Register

Track all external dependencies in one place:

| ID | Dependency | Owner | Asked Date | Status | Resolution | Resolved Date | Blocks |
|----|------------|-------|------------|--------|------------|---------------|--------|
| ED1 | QuickBooks Online vs Desktop? | Areli | 2026-03-01 | Blocked | — | — | All Phase 4 |
| ED2 | Twilio account credentials | Dev | 2026-03-01 | Pending | — | — | SMS notifications |
| ED3 | Crew phone models for testing | Areli | 2026-03-01 | Resolved | Samsung A12, Moto G, Pixel 4a | 2026-03-02 | Camera spike |
| ED4 | GC interest in portal validated? | Areli | — | Pending | — | — | Phase 3 |
| ED5 | Areli's primary device (desktop/tablet/phone)? | Areli | 2026-03-01 | Pending | — | — | Admin UI optimization |

---

# 7. IMPLEMENTATION SEQUENCE

## 7.1 Standard Order

For any feature, implement in this sequence:

1. **Data Model** — Tables, relationships, constraints
2. **Auth/Permissions** — RLS policies, route guards
3. **Validation & Security** — Input schemas, sanitization, output encoding (see 7.1.1)
4. **Backend** — API routes, server actions, business logic
5. **Frontend** — UI components, forms, pages
6. **Integrations** — Notifications, third-party APIs
7. **Tests** — E2E for critical paths, unit for complex logic
8. **Polish** — Error states, loading states, edge cases

**Why this order?**
- UI built on unstable data model = rework
- Backend built without permissions = security holes
- Backend built without validation = injection vulnerabilities
- Integrations before core works = debugging nightmares

## 7.1.1 Validation & Security Step

**Every feature that accepts user input MUST have explicit validation tickets.**

This step is often skipped in "happy path" development, leading to security vulnerabilities. Make it explicit.

**What to validate:**
| Input Type | Validation Required |
|------------|---------------------|
| Text fields | Max length, allowed characters, XSS sanitization |
| Numbers | Min/max range, integer vs decimal |
| Dates | Valid format, reasonable range (not year 3000) |
| Files | Type whitelist, max size, malware scan consideration |
| URLs | Protocol whitelist (https only), domain validation |
| Foreign keys | Existence check, permission to reference |

**Validation layers:**
```
┌─────────────────────────────────────────────────────────┐
│ 1. CLIENT-SIDE (UX only — never trust)                  │
│    - Zod schema for form validation                     │
│    - Immediate feedback to user                         │
│    - Can be bypassed — NOT a security boundary          │
├─────────────────────────────────────────────────────────┤
│ 2. SERVER-SIDE (Security boundary)                      │
│    - Same Zod schema, re-validated                      │
│    - Sanitize HTML/script content (DOMPurify or strip)  │
│    - Reject malformed input with 400 error              │
├─────────────────────────────────────────────────────────┤
│ 3. DATABASE (Integrity)                                 │
│    - CHECK constraints for enums/ranges                 │
│    - NOT NULL for required fields                       │
│    - FK constraints for relationships                   │
│    - RLS for row-level access control                   │
└─────────────────────────────────────────────────────────┘
```

**Security ticket checklist for each feature:**
- [ ] Input validation schema defined (Zod)
- [ ] Server-side validation implemented (never trust client)
- [ ] XSS prevention for any user-generated content displayed
- [ ] SQL injection prevented (parameterized queries / ORM)
- [ ] File upload validation (type, size, content inspection)
- [ ] Rate limiting on public endpoints
- [ ] Sensitive data not logged

## 7.2 Phase 1 MVP Sequence

```
Week 1-2: Foundation
├── Supabase project setup
├── Database migrations (users, clients, jobs, job_assignments, job_photos, audit_log)
├── RLS policies for all tables
├── Next.js scaffold + Tailwind + shadcn/ui
├── Auth flow (admin email/password, crew Phone OTP via Twilio)
├── Camera/photo technical spike (BLOCKING)
└── Basic admin layout

Week 3-4: Work Orders + Employee Portal
├── Admin: Create job (T1.1-T1.11)
├── Admin: Job list with filters
├── Admin: Assign crew to job
├── Employee: View assigned jobs ("Mis Trabajos")
├── Employee: Update status (3 buttons)
├── Employee: Upload completion photos
├── Employee: Report issue
├── SMS notification on assignment
└── E2E tests for job lifecycle

Week 5-6: Public Site + Leads
├── Landing page
├── Intake form → leads table
├── Employment application form
├── About/services pages
├── Email deliverability setup
└── SEO basics

Week 7-8: Polish + Soft Launch
├── Bug fixes
├── Mobile QA
├── Data import (clients, crew)
├── First-run wizard
├── Areli training
└── Soft launch
```

---

# 8. TICKET GRANULARITY GUIDE

## 8.1 Three Levels

| Level | Definition | Example | Typical Size |
|-------|------------|---------|--------------|
| **Epic** | One spec section or major workflow | Work Order System | 2-4 weeks |
| **Feature** | One user capability | Create Job | 3-5 days |
| **Task** | One implementable unit | jobs table migration | 0.5-4 hours |

## 8.2 Task Sizing Rules

- A task should be completable in one sitting (< 4 hours)
- If a task spans multiple system surfaces, split it
- If a task requires multiple PRs, split it
- If you can't describe what "done" means in one sentence, split it

## 8.3 Task Naming Convention

```
[Type]: [Brief description]

Types:
- DB: Database migration, schema change
- RLS: Row-level security policy
- API: Backend route or server action
- UI: Frontend component or page
- INT: Integration with external service
- TEST: Test implementation
- DOC: Documentation
- FIX: Bug fix
- REFACTOR: Code improvement without behavior change
- SPIKE: Technical proof-of-concept (see 8.4)
- SECURITY: Input validation, sanitization, security hardening
```

Examples:
- `DB: Create jobs table migration`
- `RLS: Add admin full access policy to jobs`
- `API: POST /api/jobs endpoint`
- `UI: Create job form component`
- `INT: Twilio SMS on job assignment`
- `TEST: E2E create job happy path`
- `SPIKE: Camera/photo PWA integration proof-of-concept`
- `SECURITY: Sanitize user input on job creation`

## 8.4 Technical Spikes

**When to use a SPIKE ticket:**
When a feature contains high technical risk that cannot be confidently estimated or designed without hands-on experimentation. Common triggers:
- Hardware APIs (camera, GPS, filesystem)
- Complex third-party integrations (OAuth flows, unfamiliar APIs)
- Performance-critical paths with unknown characteristics
- Cross-browser/cross-device compatibility concerns

**SPIKE ticket structure:**
```
SPIKE: [What you're proving]

Hypothesis: [What you believe will work]
Success Criteria: [How you'll know it worked]
Time Box: [Max hours to spend — typically 2-8 hours]
Devices/Environments: [What to test on]
Deliverables:
  - Working proof-of-concept (standalone, not integrated)
  - Written findings (what worked, what didn't, gotchas)
  - Go/No-Go recommendation
  - If Go: Implementation approach for real tickets
  - If No-Go: Alternative approaches to consider

Blocking: [Yes/No — does this block other work?]
```

**Example: Camera/Photo SPIKE**
```
SPIKE: PWA camera capture on Android

Hypothesis: We can reliably capture, compress, and upload photos
from crew Android phones via PWA without native app.

Success Criteria:
  - Opens camera on Chrome Android (3 different phone models)
  - Captures photo at acceptable quality
  - Compresses to <500KB client-side
  - Extracts GPS metadata (if available)
  - Uploads to Supabase Storage successfully
  - Photo displays correctly (no rotation issues)

Time Box: 8 hours
Devices: Samsung A12, Motorola G Power, Google Pixel 4a
Deliverables: Standalone test page + findings document

Blocking: Yes — if this fails, entire completion flow needs redesign
```

**Rule:** Write a SPIKE ticket before writing standard UI/API tickets for any feature with high technical uncertainty. The SPIKE must complete with a Go decision before dependent tickets can be pulled into "In Progress."

---

# 9. ACCEPTANCE-FIRST DEVELOPMENT

Before building any feature, write acceptance tests for:

## 9.1 Required Test Categories

| Category | What it Tests | Example |
|----------|---------------|---------|
| **Happy Path** | Core functionality works | Admin creates job, sees it in list |
| **Permission Boundary** | Unauthorized access blocked | Employee cannot access create form |
| **Validation** | Invalid input rejected | Missing required field shows error |
| **Failure Case** | System handles errors gracefully | Network error preserves form state |
| **Mobile** | Works on small viewports | Form usable on 375px width |
| **Bilingual** | Both languages work | Labels correct in /es/ route |

## 9.2 Test Writing Template

```typescript
describe('Feature: [Feature Name]', () => {
  describe('Happy Path', () => {
    it('should [expected behavior] when [trigger]', async () => {
      // Arrange
      // Act
      // Assert
    });
  });

  describe('Permission Boundary', () => {
    it('should [block/redirect] when [unauthorized actor] tries to [action]', async () => {
      // ...
    });
  });

  describe('Validation', () => {
    it('should show error when [invalid input condition]', async () => {
      // ...
    });
  });

  describe('Failure Case', () => {
    it('should [graceful behavior] when [failure condition]', async () => {
      // ...
    });
  });

  describe('Mobile', () => {
    it('should [expected behavior] on [viewport size]', async () => {
      // ...
    });
  });

  describe('Bilingual', () => {
    it('should display [Spanish text] when locale is es', async () => {
      // ...
    });
  });
});
```

---

# 10. APPLYING THIS METHODOLOGY

## 10.1 When Starting a New Phase

1. Identify which spec sections are in scope
2. Apply Tier 1 breakdown to feature sections
3. Apply Tier 2 breakdown to any new data models
4. Update traceability matrix
5. Create tickets in your task tracker
6. Write acceptance tests before coding

## 10.2 During Development

1. Check off tasks as completed
2. Update traceability matrix
3. Log decisions in decision log
4. Handle ambiguity according to type (see 10.2.1 below)
5. If you discover missing requirements, add them to the breakdown

### 10.2.1 Ambiguity Resolution Rules

**Not all ambiguity is equal.** Some questions MUST be answered before proceeding; others can be decided locally.

| Ambiguity Type | Action | Example |
|----------------|--------|---------|
| **Blocking Business Question** | STOP. Escalate to stakeholder. Do not guess. | "Which QuickBooks version?" "Does Areli primarily use desktop or mobile?" "Do GCs want a portal?" |
| **Blocking Technical Question** | STOP. Run a spike or research. Do not proceed on assumption. | "Does PWA camera work on Android?" "Will this approach scale?" |
| **Bounded Implementation Choice** | Decide, log in Decision Log, continue. | "Should this be a modal or a page?" "Use tabs or accordion?" |
| **Pragmatic Default** | Choose common/simple approach, log, continue. | "Date format: ISO 8601" "Default page size: 20" |

**How to identify blocking questions:**
- If getting this wrong would require significant rework → BLOCKING
- If this affects architecture or data model design → BLOCKING
- If this is listed in Master Spec Part 8 (Open Questions) → BLOCKING
- If a stakeholder specifically needs to answer this → BLOCKING

**For AI agents (Claude Code):**
When encountering ambiguity:
1. First, check if it's listed in the External Dependency Register or Open Questions
2. If yes → STOP and report the blocker
3. If no → classify as Bounded Implementation Choice or Pragmatic Default
4. Make a decision, document in Decision Log with clear rationale
5. Continue implementation

**Decision Log entry for ambiguity resolution:**
```
| ID | Date | Issue | Type | Decision | Rationale | Impact | Decided By |
| D004 | 2026-03-05 | Should draft jobs appear in main list or drafts tab? | Bounded Choice | Main list with "Draft" badge | Simpler UI, one list to check | Minor — easy to change later | Developer |
```

## 10.3 When Completing a Feature

1. Verify all acceptance criteria pass
2. Update traceability matrix (test status)
3. Review for any open questions that got resolved
4. Update decision log if needed

## 10.4 When Completing a Phase

1. Full traceability matrix review
2. Decision log review — any decisions to reconsider?
3. Prep Tier 1 breakdowns for next phase
4. Retrospective: What worked? What to change?

---

# 11. QUICK REFERENCE

## 11.1 Capability Statement Format
```
[Actor] can [action] to [outcome]
```

## 11.2 Requirement Statement Format
```
System shall [behavior] when [condition]
```

## 11.3 Acceptance Criterion Format
```
[Actor] can [action] and [observable result]
```

## 11.4 Ticket Title Format
```
[Type]: [Brief description]
```

## 11.5 Decision Log Entry
```
Issue → Decision → Rationale → Impact
```

---

# 12. AGENT EXECUTION PACK

When delegating a feature to an AI coding agent (Claude Code, etc.), provide a structured "execution pack" that minimizes drift and clarifies boundaries.

## 12.1 Execution Pack Template

```markdown
# Agent Execution Pack: [Feature Name]

## Context
- **Spec Sections:** [List relevant Master Spec section numbers]
- **Phase:** [Current build phase]
- **Epic:** [Parent epic name]
- **Prerequisites:** [What must be done before this]

## Scope
**In Scope:**
- [Specific capability 1]
- [Specific capability 2]

**Out of Scope:**
- [What NOT to build]
- [Related features to avoid]

## Locked Decisions
These have been decided. Do not revisit.

| Decision | Value | Source |
|----------|-------|--------|
| Auth mechanism for crew | Phone OTP via Twilio | Master Spec 5.1 |
| Database | Supabase PostgreSQL | Master Spec 5.0 |
| UI framework | shadcn/ui + Tailwind | Master Spec 5.0 |

## Allowed Assumptions
You MAY make reasonable choices about these without escalating:

- [ ] Component internal structure
- [ ] Variable naming
- [ ] File organization within established patterns
- [ ] UI micro-interactions
- [ ] [Other bounded choices]

## Blocking Questions
If you encounter these, STOP and report:

- [ ] [Question 1 from External Dependency Register]
- [ ] [Question 2]
- [ ] Any architectural change not listed in Locked Decisions

## Files Expected to Change

| File/Pattern | Action | Notes |
|--------------|--------|-------|
| `src/app/api/[route]/route.ts` | Create | New API endpoint |
| `src/components/[component].tsx` | Create | New component |
| `supabase/migrations/[timestamp]_[name].sql` | Create | DB migration |
| `src/lib/validations/[schema].ts` | Create | Zod schemas |

## Deliverables

- [ ] Database migration(s)
- [ ] RLS policies
- [ ] Zod validation schema (shared client/server)
- [ ] API route or server action
- [ ] React component(s)
- [ ] E2E test for happy path
- [ ] E2E test for permission boundary
- [ ] Updated traceability matrix entry

## API Contract

### Endpoint: `[METHOD] /api/[path]`

**Input Schema:**
```typescript
const CreateJobInput = z.object({
  title: z.string().min(1).max(255),
  client_id: z.string().uuid(),
  site_address: z.string().min(1),
  scheduled_date: z.string().date(),
  // ...
});
```

**Output Schema (Success):**
```typescript
const CreateJobOutput = z.object({
  id: z.string().uuid(),
  status: z.enum(['draft']),
  created_at: z.string().datetime(),
});
```

**Error Responses:**
| Condition | Status | Body |
|-----------|--------|------|
| Invalid input | 400 | `{ error: "VALIDATION_ERROR", details: [...] }` |
| Not authenticated | 401 | `{ error: "UNAUTHORIZED" }` |
| Not admin | 403 | `{ error: "FORBIDDEN" }` |
| Client not found | 404 | `{ error: "NOT_FOUND", entity: "client" }` |

## State Machine (if applicable)

| Current | Event | Actor | Next | Side Effects |
|---------|-------|-------|------|--------------|
| — | create | admin | draft | audit_log entry |

## Tests to Write

```typescript
describe('Feature: [Feature Name]', () => {
  it('should [happy path behavior]');
  it('should reject when [validation failure]');
  it('should block when [permission boundary]');
  it('should [failure case behavior]');
});
```

## Stop Conditions

STOP and report if:
- [ ] You need to modify a file not in "Files Expected to Change"
- [ ] You encounter a blocking question
- [ ] A test fails that you cannot fix
- [ ] You need to change a locked decision
- [ ] Estimated work exceeds [X hours]

## Verification Protocol

Before marking complete:
1. [ ] All deliverables checked off
2. [ ] `npm run typecheck` passes
3. [ ] `npm run lint` passes
4. [ ] `npm run test` passes
5. [ ] Manual smoke test of happy path
6. [ ] RLS test: verify cross-user access blocked
```

## 12.2 Example: Create Job Execution Pack

```markdown
# Agent Execution Pack: Create Job

## Context
- **Spec Sections:** 3.2, 5.2.1
- **Phase:** Phase 1 (MVP)
- **Epic:** Work Order System
- **Prerequisites:** Database setup, Auth flow, Client management

## Scope
**In Scope:**
- Create job form (admin only)
- Save job with required fields
- Save as draft (no assignment)
- Basic photo upload (1-10 photos)

**Out of Scope:**
- Assign crew (separate feature)
- Duplicate job (separate feature)
- Google Places autocomplete (Phase 2)
- Job scheduling/calendar view (Phase 5)

## Locked Decisions
| Decision | Value | Source |
|----------|-------|--------|
| Job status on create | 'draft' | Master Spec 3.2 |
| Required fields | title, client_id, site_address, scheduled_date | Master Spec 3.2 |
| Photo storage | Supabase Storage | Master Spec 5.0 |
| Max photos | 10 | Master Spec 3.2 |

## Allowed Assumptions
- [ ] Form layout (single column vs two column)
- [ ] Toast message wording
- [ ] Loading spinner placement
- [ ] Client selector UX (dropdown vs combobox)

## Blocking Questions
- [ ] None for this feature

## Files Expected to Change
| File | Action |
|------|--------|
| `supabase/migrations/001_create_jobs.sql` | Create |
| `src/lib/validations/job.ts` | Create |
| `src/app/api/jobs/route.ts` | Create |
| `src/components/jobs/create-job-form.tsx` | Create |
| `src/app/(admin)/jobs/new/page.tsx` | Create |
| `tests/e2e/jobs.spec.ts` | Create |

## API Contract
[As specified in 12.1 template]

## Stop Conditions
- Estimated work exceeds 8 hours
- Need to modify auth system
- Need to change jobs table schema beyond what's specified
```

---

# 13. NEXT STEPS

To apply this methodology to the A&A Cleaning project:

1. **Immediately:** Complete Tier 1 breakdown for Phase 1 MVP features:
   - Auth & User Provisioning (Admin email/password, Crew Phone OTP, user creation flows per Master Spec 5.1-5.2)
   - Work Order System (Create Job, Assign Crew, Update Status)
   - Employee Portal (View Jobs, Upload Photos, Report Issues)
   - Public Site (Landing, Intake Form, Employment Application)
   - UI Foundation (Tailwind theme, core components, font loading per Master Spec Part 4)

2. **Before Phase 2:** Complete Tier 1 breakdown for:
   - Checklist System
   - QA Review + Completion Reports
   - Job Messaging

3. **Maintain throughout:** Decision log and traceability matrix

---

*Document Version: 2.0*
*Created: March 2026*
*Companion to: AA-Cleaning-Master-Spec.md (v5)*
*Audit applied: March 2026 — Fixed phase drift (completion reports → Phase 2), auth drift (magic link → Phone OTP), traceability reference (7.1 → 3.5), font references (Inter → Cormorant Garamond/Satoshi), added auth/provisioning and UI foundation to Phase 1 Next Steps, added Phase 1 UI Foundation ticket breakdown to Part 4 guidance.*

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | March 2026 | Initial methodology document |
| v2.0 | March 2026 | Major enhancements based on methodology audit: Added SPIKE ticket type (8.4), External Dependencies tracking (6.3), Security/Validation implementation step (7.1.1), State Machine sections in Tier 1/2 templates, API Contracts section (3.1.11), Blocking vs Non-Blocking ambiguity rules (10.2.1), Nonfunctional Requirements section (3.1.14), Definition of Done checklist (3.1.18), Agent Execution Pack template (Section 12), upgraded worked example with concrete Zod schemas and route guards, elevated Part 4 and Part 10 to Tier 2 with extraction guidance (2.2.1, 2.2.2). |
