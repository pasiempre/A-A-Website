# A&A Cleaning Admin Dashboard Guide

Status: DRAFT SKELETON
Audience: Owner / day-to-day admin user
Purpose: Plain-language operating guide for running the business from the admin dashboard.

## How To Use This Guide

This guide explains what each dashboard section is for, when to use it, and what to do step by step. It is written for a non-technical user.

Each section should eventually include:

- What this screen is for
- When to use it
- Step-by-step instructions
- What each button or status means
- Common mistakes to avoid
- What to do if something looks wrong

## Phase 1 — Dashboard Basics

Goal: Learn how to open the dashboard, move around, and understand the main screen.

Topics to document:

- How to log in
- How to sign out
- What the left menu is
- What the Home screen shows
- What "Action Needed" means
- What "Quick Tools" are for
- How to refresh a screen
- What to do if a page looks blank or wrong

Screens covered:

- Login
- Home
- Sidebar navigation

Friction notes to review:

- Confirm the dashboard always starts on the most useful page.
- Confirm Home clearly tells the owner what needs attention first.

## Phase 2 — Leads And Quotes

Goal: Understand how customer requests become quotes and then jobs.

Topics to document:

- What a lead is
- Where new leads appear
- What each lead status means:
  - New
  - Contacted
  - Quoted
  - Converted
  - Lost
  - Follow-up
- How to contact a lead
- How to create a quote
- How to use a quote template
- How to send or review a quote
- What to do when a customer accepts
- What to do when a customer says no
- What to do when a customer needs follow-up

Screens covered:

- Leads & Quotes
- Quote creation/review controls

Friction notes to review:

- Confirm all status names are easy to understand.
- Confirm quote creation is not visually overwhelming.
- Confirm "Converted" clearly means the lead became work.

## Phase 3 — Jobs

Goal: Understand how to create, assign, duplicate, and track work.

Topics to document:

- Difference between a lead, quote, and job
- How jobs are created
- How to create a job manually
- How to assign a worker
- How to add the job address
- How to set the clean type
- How to set priority
- How to attach a checklist
- How to duplicate a recurring job
- What each job status means
- How to save QA notes from the job screen

Screens covered:

- Jobs
- Job Management
- Ticket Board

Friction notes to review:

- Job cards should show a meaningful customer/site name, not only "Cleaning Job."
- The owner should understand when to use Jobs versus Scheduling versus Dispatch.
- Manual job creation should validate real addresses or provide Google Places autocomplete with a manual override.
- Job/ticket creation should return and display a human-readable reference number, such as "Job #4736".
- Ticket cards should show scheduled date/time or assigned week, not only status/type/priority.
- Ticket cards should show assigned worker names, not truncated ids.
- Duplicated tickets should have a clear duplicate badge or copied-from reference so the owner can distinguish them from originals.

## Phase 4 — Scheduling And Dispatch

Goal: Understand how to schedule work, check availability, avoid conflicts, and make bulk changes.

Topics to document:

- Difference between Scheduling and Dispatch
- How to view upcoming work
- How to add employee availability
- What availability statuses mean:
  - Available
  - Unavailable
  - Limited
- How to spot scheduling conflicts
- How to filter dispatch jobs
- How to assign selected jobs
- How to change selected job statuses
- When bulk actions should be used carefully

Screens covered:

- Scheduling
- Dispatch

Friction notes to review:

- Confirm scheduling date/time behavior is understandable.
- Confirm bulk actions are hard to trigger by accident.
- Confirm conflict warnings are obvious.

## Phase 5 — QA Review

Goal: Understand how to review completed work, approve it, send it back, and communicate about issues.

Topics to document:

- What QA review means
- What the checklist percentage means
- How to open checklist details
- How to review photos
- How to review issue reports
- How to read job messages
- How to approve a job
- How to flag a job
- How to mark a job as needing rework
- How to send a completion report
- How to send a message about a job

Screens covered:

- Review & Approve / QA Review
- Operations & QA Review

Friction notes to review:

- Rename "Review & Approve" to "QA Review" if that is clearer.
- Move checklist template creation out of this workflow if it distracts from job review.
- Clarify what "Send Report" does, who receives it, and whether it emails a client, stores a report, or triggers post-job automation.
- Clarify what "Send Message" does, who can see it, and whether it notifies employees or only stores an internal job note.
- Success messages should include the job reference number once job numbers exist.
- Checklist reset/clear actions should appear only when they are contextually valid and should clearly warn what will be reset.
- Success banners should auto-clear or be dismissible after the action is complete.
- Saving QA should show clear confirmation feedback, such as a success toast, saved state, or short animation.
- Approved, flagged, and needs-rework states should be visually distinct without relying on color alone.

## Phase 5A — Insights

Goal: Understand business performance and click from summary numbers into the underlying work.

Topics to document:

- What each insight card means
- How date range changes the numbers
- How to export CSV
- How to open the records behind a metric
- What "No financial snapshot" and QuickBooks sync warnings mean
- How to interpret QA approval rate, active jobs, open issues, low stock, and completion reports

Screens covered:

- Unified Insights Dashboard
- Operations, Quality, Financials, Hiring, and Inventory tabs

Friction notes to review:

- Insight cards should be clickable and open the records behind the number.
- Insights should include charts/trends, not only summary boxes.
- Drill-down views should reuse familiar job/ticket card layouts when showing related jobs or issues.
- Financial warnings should explain the next owner action, such as "Connect QuickBooks" or "Run sync."

## Phase 6 — Inventory

Goal: Understand how to track supplies and handle employee supply requests.

Topics to document:

- What inventory is for
- How to add a supply item
- What current stock means
- What low stock means
- What reorder threshold means
- How employee supply requests appear
- How to approve a request
- How to reject a request
- How to mark a request delivered
- When to update stock manually

Screens covered:

- Inventory
- Low Stock Alerts
- Supply Requests

Friction notes to review:

- Confirm supply request rows show the correct supply name.
- Confirm the flow is clear for both owner and employee.

## Phase 7 — Notifications

Goal: Understand how alerts and message delivery are controlled.

Topics to document:

- What notification preferences are
- What quiet hours mean
- What SMS enabled means
- What email enabled means
- What the dispatch queue is
- What queued, sent, and failed mean
- How to retry a failed notification
- When to avoid changing notification settings

Screens covered:

- Notifications
- Notification Preferences
- Notification Queue

Friction notes to review:

- Confirm failed notifications explain what happened.
- Confirm retry actions are safe and clear.
- Confirm queued, sent, and failed counts are visible at a glance.
- Confirm retry actions explain whether they respect quiet hours or send immediately.
- Confirm every notification row shows the related job/ticket reference number once job numbers exist.
- Confirm SMS enabled, Email enabled, and Batch job notifications are explained in plain language.
- Confirm the owner can verify which phone/email received each message.
- Confirm the screen supports a real-device test checklist for owner, operator/admin, and additional employee/customer test users.

## Phase 8 — Insights

Goal: Understand the business numbers without needing technical knowledge.

Topics to document:

- What each dashboard metric means
- Jobs
- Leads
- Revenue
- Completed jobs
- Active jobs
- QA approval rate
- Open issues
- Lead conversion
- Inventory warnings
- SMS queue numbers
- Schedule conflicts
- How to change the time range
- How to export CSV
- Why QuickBooks data may be missing

Screens covered:

- Insights
- Overview tab
- Operations tab
- Quality tab
- Financials tab
- Hiring tab
- Inventory tab

Friction notes to review:

- Confirm "No financial snapshot — QB sync needed" is understandable.
- Confirm the owner knows which numbers matter weekly.

## Phase 9 — Hiring

Goal: Understand how to review employment applications.

Topics to document:

- Where new applications appear
- What each applicant status means
- How to review applicant details
- How to update applicant status
- How to decide whether someone is ready for interview
- What information should be verified outside the dashboard

Screens covered:

- Hiring
- Hiring Inbox

Friction notes to review:

- Confirm hiring language is simple and not too technical.
- Confirm rejected/withdrawn statuses are hard to choose by accident.

## Phase 10 — Settings And Templates

Goal: Understand which setup areas can be edited safely and which should be changed carefully.

Topics to document:

- What Configuration is for
- What quote templates are
- How to create a quote template
- How to edit a quote template
- What checklist templates are
- How to create a checklist template
- How notification automation works
- What post-job automation means
- What settings should not be changed without help

Screens covered:

- Configuration
- Quote Templates
- Checklist Templates
- Post-job automation settings

Friction notes to review:

- Move checklist templates into this area if possible.
- Keep advanced settings separated from day-to-day work.

## Phase 11 — Common Problems

Goal: Give the owner a simple troubleshooting section.

Topics to document:

- I cannot log in
- A page is blank
- A lead is missing
- A job is missing
- A notification failed
- A worker cannot see a job
- A photo did not upload
- A supply request looks wrong
- The numbers look wrong
- When to call for help

## Phase 12 — Daily And Weekly Routine

Goal: Turn the dashboard into a repeatable habit.

Daily routine:

- Check Home
- Review new leads
- Check today's jobs
- Check QA/rework
- Check supply requests
- Check failed notifications

Weekly routine:

- Review Insights
- Check completed jobs
- Review lead conversion
- Review inventory
- Review employee issues/messages
- Update templates if needed

## Open Friction Log

Use this section while testing with the owner. Add anything that feels confusing, slow, too technical, or easy to misuse.

| Date | Screen | Friction Point | Severity | Proposed Fix |
| --- | --- | --- | --- | --- |
| 2026-05-11 | Jobs / Ticket Board | Manual address accepted `test address` with no validation. | High | Add Google Places autocomplete/address validation with manual override. |
| 2026-05-11 | Jobs / Ticket Board | Tickets/jobs do not expose a short human-readable reference number in creation confirmation or card display. | High | Add generated job/ticket number and display it everywhere: confirmation, Ticket Board, Scheduling, Dispatch, employee job detail. |
| 2026-05-11 | Jobs / Ticket Board | Ticket cards do not clearly show scheduled date/time or assigned week. | Medium | Add date/time row and sort/filter affordance. |
| 2026-05-11 | Jobs / Ticket Board | Assigned worker displays as truncated id instead of name. | Medium | Normalize relation display and show employee full name with id only as fallback. |
| 2026-05-11 | Jobs / Ticket Board | Duplicate tickets are hard to visually distinguish from original tickets. | Medium | Add duplicate badge, copied-from reference, and clearer status/color treatment. |
| 2026-05-11 | Jobs / QA Review | Saving QA approval has weak feedback; only last-reviewed timestamp changes. | Medium | Add success toast/saved animation and stronger approved/needs-rework visual state. |
| 2026-05-11 | Operations & QA Review | `Send Report` and `Send Message` need clearer purpose, recipients, and delivery behavior. | High | Add labels/help text and success messages that say what happened and for which job. |
| 2026-05-11 | Operations & QA Review | `Clear all checklist items` appeared again after refresh despite completed checklist state. | Medium | Review refresh hydration and show reset action only when contextually valid. |
| 2026-05-11 | Operations & QA Review | `Job message sent.` banner stayed visible and lacked job reference. | Medium | Auto-dismiss/dismiss success banners and include job number/reference. |
| 2026-05-11 | Insights | Metric cards are not clickable, so owner cannot inspect underlying records. | High | Add drill-down panels/lists for each metric, using job/ticket card layouts where relevant. |
| 2026-05-11 | Insights | Dashboard is mostly static boxes and lacks graphs/visual trends. | Medium | Add trend charts, distributions, and status/category breakdowns. |
| 2026-05-11 | Notification Center | Dispatch worked, but real SMS/email delivery still needs end-to-end testing on owner/admin and multiple test users. | High | Add delivery test checklist and verify Twilio/Resend credentials plus recipient preferences before launch. |
| 2026-05-11 | Notification Center | Queue rows need clearer operational details. | Medium | Show summary counts, last attempt, next retry, provider error, job/ticket reference, and recipient identity. |
| 2026-05-11 | Notification Center | Retry behavior and quiet-hours handling are not obvious. | Medium | Label retry actions with whether they respect quiet hours or send immediately. |
| 2026-05-11 | Notification Center | Notification preferences need more plain-language explanation. | Medium | Add short helper text for SMS enabled, Email enabled, and Batch job notifications. |
| 2026-05-11 | Admin Shell | Hydration mismatch occurred when saved admin module state differed from server-rendered default. | High | Apply saved module/sidebar localStorage state after hydration, not during initial render. |
| TBD | Review & Approve | Checklist templates appear inside QA review flow. | Medium | Move checklist templates to Configuration or Templates. |
| TBD | Jobs / Dispatch / QA | Job cards can show generic "Cleaning Job" names. | Medium | Prefer customer/site/address in job card titles. |
| TBD | Navigation | Jobs, Dispatch, Scheduling, and QA may overlap mentally. | Medium | Clarify labels, subtitles, and Home shortcuts. |
