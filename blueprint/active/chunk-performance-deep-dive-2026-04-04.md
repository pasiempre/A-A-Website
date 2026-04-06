# Chunk Performance Deep Dive (2026-04-04)

## Scope

This analysis uses:
- Current analyzer outputs shared in chat (client and server chunk treemaps/lists)
- Code inspection of bundling-sensitive files
- Existing build status (green)

Primary goal: identify practical opportunities to reduce shipped JavaScript and improve runtime performance, without destabilizing current conversion and ops flows.

## Executive Summary

The current bundle profile is functional and build-stable, but there are three clear red-flag concentration zones:

1. Client bundle concentration around browser polyfills and Supabase browser SDK.
2. Admin route over-bundling due to eager imports of many client modules.
3. Server bundle inflation from Sentry + OpenTelemetry dependency trees.

None of these are immediate blockers to shipping, but they are meaningful performance and maintainability opportunities.

## Evidence Snapshot

### Client (All ~1.76 MB)

Largest chunks from provided list:
- static/chunks/aaea2bcf-7140d49c33f53aa9.js (~317.77 KB)
- static/chunks/6622-843924a60897c5ad.js (~199.15 KB)
- static/chunks/app/(admin)/admin/page-1a6614e715452b40.js (~195.51 KB)
- static/chunks/4bd1b696-bf5e0dbacfa5baef.js (~193.83 KB)
- static/chunks/framework-98ded4341da66877.js (~185.24 KB)

Observed treemap indicators:
- Large block from next/dist/compiled/crypto-browserify in the top client chunk.
- Large block from @supabase/ssr in another top client chunk.
- Admin page chunk includes AdminShell.tsx plus many concatenated modules.

### Server (All ~5.16 MB)

Largest chunks from provided list:
- 648.js (~1.19 MB)
- 5349.js (~945.32 KB)
- 3650.js (~926.56 KB)

Observed treemap indicators:
- Sentry and OpenTelemetry dominate the largest server chunks.
- Admin route entry chunk remains comparatively large.

## Root-Cause Analysis

### 1) Admin route eager-loads too much client code

File evidence:
- src/components/admin/AdminShell.tsx imports all major admin modules at top-level.

Impact:
- The admin entry bundle pays for modules that are not immediately used.
- Initial admin page load and hydration costs increase.

Why this matters:
- Even if users only open one admin tab/module, they download parse/eval for many.

### 2) Browser Supabase SDK appears broadly distributed in client components

File evidence:
- src/lib/supabase/client.ts is imported across many admin and employee client components.

Impact:
- Supabase browser stack contributes significant shared chunk weight.
- Likely contributor to crypto-browserify footprint in client chunks.

Why this matters:
- Shared chunk growth increases cost for every route using that chunk.

### 3) Sentry runtime setup is feature-rich and heavy

File evidence:
- sentry.client.config.ts enables Replay and Browser Tracing integrations.
- src/lib/sentry.ts imports @sentry/nextjs and is reused broadly.
- server/edge configs initialize Sentry in runtime registration.

Impact:
- High server chunk concentration in Sentry/OpenTelemetry modules.
- Analyzer warnings in prior run align with instrumentation dependency graph size.

Why this matters:
- Higher cold start memory/load overhead for serverless/edge contexts.

### 4) Public homepage is already partially code-split, but not maximally

File evidence:
- src/components/public/variant-a/VariantAPublicPage.tsx dynamically imports some heavy sections (Before/After, Testimonials, QuoteSection), but several large sections remain static imports.

Impact:
- Good progress already made.
- Additional below-the-fold split opportunities remain.

## Red Flags

1. Admin route architecture is monolithic at module import level.
2. Supabase browser client usage pattern is broad and likely over-used for read/write that could be proxied through API routes.
3. Sentry integration defaults are tuned for rich observability, not lean bundle/runtime cost.
4. Crypto-browserify presence in top client chunk is a high-signal optimization target.

## Opportunities (Prioritized)

### P1 (High ROI, lower product risk)

1. Admin module-level dynamic imports
- Convert AdminShell module imports to per-module dynamic loading.
- Only hydrate/load the active module panel.

2. Keep homepage split strategy moving below the fold
- Consider dynamic import for additional below-the-fold sections once UX priority is preserved.

3. Sentry integration right-sizing
- Re-evaluate Replay and BrowserTracing sampling/config by environment.
- Keep critical error capture, reduce optional telemetry cost where feasible.

### P2 (High ROI, medium implementation cost)

4. Shift data-heavy client interactions behind API boundaries
- Use server/API handlers for data mutations and reads where possible.
- Retain browser Supabase primarily for auth/session where necessary.

5. Route architecture refinement for admin
- Move from single module-switching shell to route-level splits where practical.
- Benefit: natural Next.js route chunking.

### P3 (Strategic)

6. Server observability footprint optimization
- Evaluate Sentry/OpenTelemetry config paths per runtime (node vs edge).
- Keep guardrails for incident triage while trimming optional integrations.

## Recommended 2-Phase Plan

### Phase A (1-2 sprints, low destabilization)

1. Implement dynamic imports in AdminShell for module content.
2. Add bundle budgets and CI warning thresholds for top client/admin chunks.
3. Tune Sentry client integrations/sampling by environment.
4. Re-run analyzer and compare:
- Admin page entry size
- Top shared client chunks
- Server top-3 chunks

### Phase B (2-4 sprints, architecture improvements)

1. Move selected admin/employee data paths to server/API boundaries.
2. Introduce route-level admin splitting where it does not hurt workflow.
3. Reassess Supabase browser usage surface area.

## Success Metrics

Track deltas after each phase:

1. static/chunks/app/(admin)/admin/page-*.js size
- Target: meaningful reduction (first goal: -25% to -40%).

2. Top two shared client chunks
- Target: reduce supabase/polyfill concentration.

3. Largest server chunk (currently ~1.19 MB)
- Target: reduce Sentry/OpenTelemetry concentration while maintaining error capture requirements.

4. Runtime UX metrics
- Admin initial load and interactivity
- Public homepage LCP/JS execution time

## Risks and Safeguards

### Risks

1. Over-splitting can introduce loading jank if not paired with good skeleton/fallback states.
2. Moving client data calls server-side can change latency/error behavior.
3. Reducing observability too aggressively can hurt incident response.

### Safeguards

1. Keep current skeleton/fallback conventions when adding dynamic imports.
2. Roll out one module/path at a time with benchmark snapshots.
3. Preserve critical Sentry error capture and production alerts while tuning optional telemetry.

## Immediate Next Step Recommendation

Start with AdminShell module dynamic imports first. It is the clearest high-impact opportunity with limited user-facing behavioral risk, and it directly targets one of the largest route chunks.
