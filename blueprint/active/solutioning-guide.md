# Solutioning Guide (Control Plane)

Date: 2026-04-12
Status: Active
Purpose: Keep planning, validation gating, and implementation targeting in one clean document without embedding transcript-sized code dumps.

## Canonical Documents
- Control plane: blueprint/active/solutioning-guide.md
- Implementation lock: blueprint/active/solutioning-implementation-lock-manifest.md
- Full historical transcript (archived): blueprint/archive/2026-04-12-active-cleanup/solutioning-guide-transcript-2026-04-12.md
- Validation control plane: blueprint/active/master-rework-doc-2.0.md
- Validation evidence log: blueprint/active/feedback3.0-validation-evidence-2026-04-11.md

## Working Agreement
1. Keep code implementations unchanged unless explicitly approved.
2. Validate first, implement second, verify third.
3. Do not paste large code blocks into this guide.
4. Store long implementation transcripts in archive and reference them.
5. Use the implementation lock manifest to prevent drift.

## Scope and Gating
- This guide tracks what to solve and how to validate.
- Implementation details live in code files, not here.
- Promotion to done requires:
  - issue-to-file mapping
  - runtime or SQL proof
  - verification note in validation evidence

## Coverage Reconciliation (Findings vs Targets)
- Raw findings corpus: ~1,060 issues (canonical count from master rework summary).
- Condensed actionable set: 166 tracked IDs (SB/C/XF patterns in master rework tables).
- Archived solutioning transcript: 21 session blocks and many fix directives (not a small list).
- Current implementation lock manifest: 11 symbol-level locks + 3 drift entries.

Important: The lock manifest is phase-1 implementation protection for high-risk active surfaces, not the full solution inventory.

Targeting rule for this phase:
1. Keep the 11 active locks stable while validating.
2. Expand lock coverage batch-by-batch from the condensed master rework set.
3. Any finding confirmed valid must map to one of: existing lock, new lock, or explicit drift entry.
4. No valid finding should remain untracked.

Current status:
- Not all findings have been runtime-validated yet.
- More valid solutions are expected as validation progresses.
- The 14-item count reflects current lock coverage only, not total final scope.

## Current Priorities
### Priority A (Security and Data Integrity)
- SB-1: real business phone replacement across public CTAs
- SB-6: signup role source hardening verification on target DB
- C-16: ticket create sequence resilience (no orphan state)
- C-24: QA rework safety and recovery behavior

### Priority B (Pipeline Reliability)
- C-36: latest quote selection correctness
- C-48: quote-to-job lead relation normalization
- C-46/C-47: employee assignment relation and schedule field alignment
- C-64: notification relations rendering correctness

### Priority C (Admin UX and Routing)
- C-10: sidebar module discoverability
- C-12: quote review confirmation before send
- C-13/C-39: overlap-aware availability checks
- C-25/C-26/C-27: mobile kanban and touch/input usability

### Priority D (Taxonomy and Consistency)
- C-5/C-17: canonical service type taxonomy and ingestion normalization
- C-18: lead status visibility parity
- C-20/C-21: client directory and lead activity log strategy

## Session Execution Template
For each issue batch:
1. Define target files.
2. State expected behavioral outcome.
3. Run validation checks before and after.
4. Record evidence in validation log.
5. Update implementation lock manifest if behavior is accepted.

## Validation Checklist (Per Batch)
- Compile/lint clean for touched files.
- No regression in related route or module.
- Runtime path tested where applicable.
- DB assumptions confirmed against real schema/policies.
- Evidence captured in feedback evidence doc.

## Drift Control
If transcript claims and code differ:
1. Mark drift in the implementation lock manifest.
2. Treat codebase as current truth unless overridden.
3. Validate before applying transcript-proposed behavior.

## Change Log
- 2026-04-12: Converted this file from mixed transcript+planning to control-plane format.
- 2026-04-12: Archived full prior content to blueprint/archive/2026-04-12-active-cleanup/solutioning-guide-transcript-2026-04-12.md.
- 2026-04-12: Added implementation lock file at blueprint/active/solutioning-implementation-lock-manifest.md.
- 2026-04-12: Added findings-to-target coverage reconciliation to clarify that lock count is phase coverage, not total solution count.
