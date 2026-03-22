# Master Spec 2.0 Creation Gameplan
**Date:** 2026-03-19  
**Objective:** Produce an authoritative, implementation-ready Master Spec 2.0 that incorporates current state analysis, identifies all architectural gaps, and structures admin/employee experiences as modular, CRM-like workflows.

---

## Executive Context
- **Current Reality:** Admin dashboard is a single monolithic page with 9 components stacked vertically. Employee portal is bare-bones task list + inventory. Both lack coherent information architecture and navigation strategy.
- **Strategic Gap:** Master Spec v1 focused on MVP feature checklist but did not deeply specify UI/UX flows, navigation patterns, data visibility rules, or operational workflows.
- **Mandate:** Master Spec 2.0 must be implementation-ready for both backend and frontend teams, with explicit flows, role-based access, and wireframe-level UI structure.

---

## Part A: Gameplan Phases (High Level)

## Phase 1: Audit + Gap Mapping (Read-only, ~4-6 hours)
**Goal:** Deep understanding of current implementation, spec intent, and delta.

### Audit Scope
1. **Admin Dashboard Deep Dive**
   - Map all 10 components: FirstRunWizard, LeadPipeline, NotificationCenter, TicketManagement, OperationsEnhancements, UnifiedInsights, SchedulingAndAvailability, InventoryManagement, HiringInbox, NotificationDispatchQueue.
   - Identify each component's data model, user interactions, and interdependencies.
   - Note current UX patterns (modal, inline, card, filters, sorting).
   - Identify information conflicts (e.g., what if lead appears in pipeline AND in notification queue?).

2. **Employee Portal Deep Dive**
   - Map EmployeeTicketsClient and EmployeeInventoryClient.
   - Identify current job statuses, action patterns, and data flows.
   - Note mobile-first constraints and offline considerations.

3. **Master Spec v1 Intent Analysis**
   - Extract all narrative sections that describe admin/employee workflows.
   - Identify phased features and deferral justifications.
   - Note success metrics and user profiles.

4. **Navigate Spec Gap Analysis**
   - Create matrix: master spec intent vs current implementation vs what's missing.
   - Identify CRM-like workflows that should exist but don't.
   - Flag navigation/IA gaps.

### Deliverable: Audit Report
- 3-4 page markdown with component-by-component grid.
- Flow diagrams for current vs ideal admin/employee paths.
- **Requires your approval before Phase 2 starts.**

---

## Phase 2: Architecture + Navigation Design (Conceptual Design, ~3-4 hours)
**Goal:** Specify admin and employee information architecture as modular, coherent systems.

### Admin Dashboard Redesign
1. **Navigation Model**
   - Evaluate options:
     - Option A: Left sidebar with 6-8 modules, main content area.
     - Option B: Top nav tabs + left module shortcuts.
     - Option C: Hub-and-spoke (dashboard home + drill-into module pages).
   - **Recommendation will be based on:** operational workflow sequence, frequency/recency of access, role-based permission model.

2. **Module Organization**
   - Group 10 components into logical operational domains (e.g., **Revenue**, **Operations**, **Quality**, **Logistics**, **People**, **System**).
   - Define entry points and inter-module navigation.
   - Specify "default landing" by user type/permission.

3. **Role-Based Access**
   - Define permission tiers (e.g., full admin, operations lead, quality reviewer, finance only).
   - Map which modules are visible/editable per role.

4. **Flow Patterns**
   - Lead ingestion → qualification → quote → conversion → job dispatch → completion → invoicing.
   - Visualize this as a state machine, not a checklist.
   - Identify branch points and decision gates.

### Employee Portal Redesign
1. **Mobile-First Structure**
   - Bottom nav or top menu pattern for clarity.
   - Minimize scrolling; maximize one-touch actions.

2. **Job Lifecycle Flow**
   - Assigned → Arrival check-in → In-progress status → Completion pane → Photo/issue submission → Send.
   - Clear progress indicators and next-step cues.

3. **Data Visibility**
   - What can an employee see? (assignments, historical work, inventory, messages).
   - What can they do? (status update, photo, issue, supply request).
   - Offline capability requirements.

### Deliverable: Architecture + Navigation Spec
- Visual diagrams for admin navigation model.
- Module grouping rationale.
- Employee flow wireframe.
- Permission matrix.
- **Requires your approval before Phase 3 starts.**

---

## Phase 3: Detailed Feature Specifications (Deep Spec Writing, ~6-8 hours)
**Goal:** Produce the full Master Spec 2.0 with implementation-grade detail.

### For Admin Dashboard
1. **Per-Module Specification**
   - Module name, purpose, users, access control.
   - Data entities (tables/fields queried).
   - User actions (create, read, update, archive, bulk operations).
   - Workflow steps and decision points.
   - Success criteria and edge cases.
   - UI components (form patterns, filters, tables, modals).
   - Sorting, pagination, search behavior.
   - Error handling and validation.

2. **Cross-Module Workflows**
   - Lead lifecycle with all touchpoints.
   - Job lifecycle with all touchpoints.
   - QA workflow end-to-end.
   - Financial reconciliation workflow.
   - Inventory request workflow.

3. **Navigation and Routing**
   - URL structure for each module.
   - Breadcrumb/context cues.
   - Back/forward behavior.

4. **Permissions and Data Visibility**
   - Per-role access matrix.
   - Field-level read/write rules.
   - Data filtering rules (e.g., "ops lead sees only assigned jobs").

### For Employee Portal
1. **Mobile-Optimized Layout Spec**
   - Bottom nav vs top nav decision with rationale.
   - Screen-by-screen breakdown (job list, job detail, photo capture, issue report, inventory).

2. **Job Status Workflow**
   - States: assigned, en_route, in_progress, complete, verification_pending, verified, archived.
   - Transitions and guards (can crew move backward?).
   - Visual indicators per state.

3. **Photo + Completion Workflow**
   - Capture requirements (timestamp, geolocation, metadata).
   - Upload queuing and retry behavior.
   - Photo gallery/evidence pane layout.

4. **Issue Reporting**
   - Trigger conditions (photo, damage, missing scope, etc.).
   - Issue form structure.
   - Escalation to admin notification.

5. **Inventory Integration**
   - Supply usage logging interface.
   - Supply request submission flow.
   - Request status visibility.

6. **Offline Capability**
   - What works offline? (status update, photo queue, message draft).
   - Sync strategy on reconnect.

### For System Integration
1. **Notification Architecture v2**
   - Event types per workflow step.
   - Delivery rules (SMS, email, in-app, quiet hours).
   - Retry and failure handling.

2. **Analytics & Reporting**
   - Metrics tracked per workflow.
   - Dashboard views (daily ops, weekly reconciliation, monthly reporting).

3. **Third-Party Integration Specs**
   - QuickBooks sync workflow.
   - Twilio SMS orchestration.
   - Resend email delivery.

### Deliverable: Master Spec 2.0 Document
- Full document (20-30 pages) with all sections below.
- Comprehensive enough that a junior dev can build from it without questions.
- **You'll review for completeness, correctness, and alignment before implementation.**

---

## Part B: Master Spec 2.0 Structure (Table of Contents)

```
1. Executive Summary
   - Current state snapshot
   - Key improvements vs v1
   - Launch readiness gate criteria

2. Product Vision & Users (unchanged from v1 but refreshed context)
   - Areli (admin)
   - Crew (employee)
   - GCs (client portal - Phase 3+)

3. Admin Dashboard Specification
   3.1 Navigation & Information Architecture
    - IA diagram
    - Module mapping
    - URL structure
   3.2 Role-Based Access Control
    - Permission matrix
   3.3 Core Modules (detailed per module)
    - Lead Pipeline
    - Quote Management
    - Job Ticketing
    - QA Review Workflow
    - Crew Assignment & Scheduling
    - Notifications Center
    - Financial Dashboard
    - Inventory Management
    - Hiring Inbox
    - Settings & System
    - Analytics & Reporting
   3.4 Cross-Module Workflows
    - Lead → Quote → Job → Completion → Invoice
    - QA workflow with rework branching
    - Inventory request lifecycle
   3.5 Data Visibility & Filtering Rules
    - Role-based data access
    - Date range filtering
    - Status filters

4. Employee Portal Specification
   4.1 Mobile-First Navigation
    - Bottom nav vs top nav justification
    - Responsive breakpoints
   4.2 Job Lifecycle View
    - Job list screen (filters, sorting)
    - Job detail screen (address, scope, checklist)
    - In-progress status update pane
   4.3 Completion Workflow
    - Photo capture + upload + retry
    - Issue reporting trigger & form
    - Completion submit & verification
   4.4 Inventory Integration
    - Supply usage logging
    - Supply requests
   4.5 Offline Capability
    - Offline data model
    - Sync strategy

5. Notification Architecture v2
   5.1 Event types
   5.2 Delivery rules
   5.3 Queue management

6. Integration Specifications
   6.1 QuickBooks sync
   6.2 Twilio SMS
   6.3 Resend email

7. Analytics & Financial Reporting

8. Security, Access Control & Audit

9. Fallback & Degradation Plan

10. Phase-by-Phase Delivery Roadmap
    - Which features land in Phase 1 vs 2 vs 3
    - Dependency sequence

11. Success Metrics & Launch Gate
    - Criteria for production readiness
```

---

## Part C: Execution Timeline (Estimates)

| Phase | Deliverable | Estimated Duration | Dependencies |
|-------|-------------|-------------------|--------------|
| 1 | Audit Report | 4-6 hours | None |
| User Review & Approval | - | 1-2 hours | Audit Report |
| 2 | Architecture + Nav Spec | 3-4 hours | Audit Report approval |
| User Review & Approval | - | 1-2 hours | Arch Spec |
| 3 | Master Spec 2.0 (full) | 6-8 hours | Arch Spec approval |
| User Review & Approval | - | 2-3 hours | Spec 2.0 |
| **Total** | **Master Spec 2.0 complete** | **17-25 hours** | - |

---

## Part D: Success Criteria for Each Phase

### Phase 1 Audit Report Success
- ✅ Current state mapped with no ambiguity (every component understood).
- ✅ Master Spec v1 intent captured and compared to reality.
- ✅ All gaps identified (missing components, missing flows, UX issues).
- ✅ Clear, reviewable format (you can scan and say yes/no to accuracy).

### Phase 2 Architecture Spec Success
- ✅ Navigation model is clear and CRM-like.
- ✅ Module grouping makes intuitive sense.
- ✅ Role-based access is specified.
- ✅ Admin and employee flows are wireframe-ready.
- ✅ You feel these solve the current "incoherence" problem.

### Phase 3 Master Spec 2.0 Success
- ✅ A junior developer could build features from this without asking questions.
- ✅ Every UI screen is specified with fields, actions, and validation.
- ✅ Every workflow is a state machine with entry/exit conditions.
- ✅ Permissions, notifications, and integrations are crystal clear.
- ✅ Launch readiness gate is defined and measurable.
- ✅ You feel this is the single source of truth going forward.

---

## Part E: What You'll Review at Each Gate

### After Phase 1: You Review Audit Report
**Questions to answer:**
1. Is the current state accurately represented?
2. Are the gaps I identified the ones you see?
3. Any gaps I missed?
4. Any current components that are actually working well (keep as-is)?

### After Phase 2: You Review Architecture + Navigation Spec
**Questions to answer:**
1. Does this navigation model feel CRM-like and coherent to you?
2. Does the module grouping make sense for Areli's daily workflow?
3. Should we add/remove/rename any modules?
4. Is the employee portal flow logical and mobile-friendly?
5. Are the role definitions clean?

### After Phase 3: You Review Master Spec 2.0
**Questions to answer:**
1. Is this complete and clear enough to build from?
2. Any workflows that don't match your vision?
3. Any missing features or integrations?
4. Does the phasing strategy make sense (what lands in Phase 1 vs later)?

---

## Approach Rationale

**Why this sequence?**
- Audit first (read-only) so we have facts before designing.
- Architecture second (design choices) so you can validate the vision before we write 30 pages.
- Spec third (implementation detail) so we only detail what you've approved.

**Why include user review gates?**
- Master Spec 2.0 is a big document. Breaking it into reviewable chunks prevents expensive end-of-phase changes.
- You provide directional feedback early, not late.

**Why this scope?**
- Phase 1 audit is narrow (what exists?) so you get quick feedback.
- Phase 2 architecture is medium (how should it be organized?) so you validate direction.
- Phase 3 full spec is wide (all implementation detail) but you've already approved the direction.

---

## Next Step
**Review this gameplan and approve/modify:**
1. Do you want Phases 1-3 in this order?
2. Any phases you want to skip or modify?
3. Any specific constraints or must-haves I should know before starting?

Once approved, I'll start Phase 1 (Audit Report) immediately.

