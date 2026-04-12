import { NextResponse } from "next/server";

type CacheEntry = {
  expiresAt: number;
  status: number;
  body: unknown;
};

const TTL_MS = 60_000;
const store = new Map<string, CacheEntry>();

function prune(): void {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.expiresAt <= now) {
      store.delete(key);
    }
  }
}

export function idempotencyKey(...parts: Array<string | number | null | undefined>): string {
  return parts
    .map((part) => (part === null || part === undefined ? "" : String(part).trim()))
    .join("|");
}

export function guardIdempotency(key: string): {
  isDuplicate: boolean;
  replay: NextResponse;
}
export function guardIdempotency(
  key: string,
  options: { ttlMs?: number },
): {
  isDuplicate: boolean;
  replay: NextResponse;
}
export function guardIdempotency(
  key: string,
  options?: { ttlMs?: number },
): {
  isDuplicate: boolean;
  replay: NextResponse;
} {
  prune();

  const hit = store.get(key);
  if (!hit) {
    if (options?.ttlMs && options.ttlMs > 0) {
      store.set(key, {
        status: 202,
        body: {
          success: true,
          message: "Idempotency placeholder",
        },
        expiresAt: Date.now() + options.ttlMs,
      });
    }
    return {
      isDuplicate: false,
      replay: NextResponse.json({}, { status: 204 }),
    };
  }

  const replay = NextResponse.json(hit.body, { status: hit.status });
  replay.headers.set("X-Idempotency", "replay");
  return {
    isDuplicate: true,
    replay,
  };
}

export function commitIdempotency(
  key: string,
  status: number,
  body: unknown,
  ttlMs: number = TTL_MS,
): void {
  store.set(key, {
    status,
    body,
    expiresAt: Date.now() + ttlMs,
  });
}

# Session 9 — Batch 1: Infrastructure Files

## Files Reviewed This Batch

| # | File | Lines | Role |
|---|------|-------|------|
| 1 | `middleware.ts` | ~95 | Edge middleware — rate limiting, auth, security headers |
| 2 | `src/lib/env.ts` | ~130 | Environment variable validation |
| 3 | `src/lib/notifications.ts` | ~450 | SMS dispatch with retry, quiet hours, dedup, queue |
| 4 | `src/lib/idempotency.ts` | ~75 | API route idempotency guard |

---

## Key Status Updates on Existing Issues

Before new findings — here's what these files resolve, partially resolve, or confirm from Sessions 1–8:

| Existing Issue | Status | Evidence |
|---|---|---|
| **SB-4** #28 HMAC fallback | **NOT RESOLVED** — no webhook/HMAC secret in `SERVER_REQUIRED_KEYS` |  |
| **SB-5** #4 Env validation disabled | **PARTIALLY RESOLVED** — infrastructure exists, startup call unverified | `validateServerEnvironment()` documented but we can't confirm it's wired into `instrumentation.ts` |
| **C-30** #457 Notification chain unverifiable | **PARTIALLY RESOLVED** — mechanism is sophisticated | `dispatchSmsWithQuietHours` has retry + quiet hours + dedup + queue-on-failure. Still need to verify API routes call it. |
| **XF-12** Notify Crew no mechanism | **PARTIALLY RESOLVED** — mechanism exists | Same as above — need `/api/quote-create-job` and `/api/assignment-notify` server code |
| #420 No CSRF | **CONFIRMED** — middleware has no CSRF check | |
| #416 Employee phone not guaranteed | **CONFIRMED** — `sendSms` does no phone validation | |
| #334 No idempotency on createQuote | **Library exists** — `guardIdempotency` available | But see #653 below — it's architecturally broken on serverless |
| #462 Only 1/7 notification scenarios has mechanism | **MECHANISM IS MORE CAPABLE** than inferred | Full dispatch pipeline exists; question shifts to "which callers use it" |

---

## Positive Findings (Credit Where Due)

These files show genuinely strong engineering in several areas:

1. **`notifications.ts` is near-production-grade** — Error classification of Twilio responses (transient vs permanent vs config), exponential backoff retry, quiet hours with proper timezone/DST handling, dedup via database, queue-on-failure instead of drop. This is significantly more sophisticated than what we inferred from the client code alone.

2. **`env.ts` has proper tiering** — Public/Server/Optional separation, clear documentation, throws on missing required vars. The `requireServerEnv()` pattern is correct.

3. **Middleware ordering is correct** — Rate limiting before auth (prevents auth-based DoS), security headers applied to all responses including error responses.

4. **Twilio error code reference** — The permanent error codes (21211, 21614, 21408, 21610) are correct and save unnecessary retries on invalid numbers.

---

## New Issues: `middleware.ts`

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 626 | Medium | Public pages excluded from security headers | Matcher covers only `/admin`, `/employee`, `/auth`, `/api`. All public pages (`/`, `/about`, `/services/*`, `/contact`, `/faq`, `/careers`, etc.) receive no `applySecurityHeaders` call. If `next.config.js` headers aren't configured, public pages lack CSP, X-Frame-Options, X-Content-Type-Options, HSTS. |
| 627 | Medium | Quote acceptance pages excluded from middleware | `/quote/success` and `/quote/[token]` are not in the `(public)` route group and not in the matcher. Token-based quote acceptance gets no rate limiting and no security headers. An attacker could brute-force quote tokens. |
| 628 | Medium | No CSRF protection on state-changing requests | Middleware processes `POST`/`PATCH`/`DELETE` to `/api/*` without any CSRF token or origin check. Supabase cookies are sent automatically by the browser. A malicious page could trigger admin mutations if an admin visits it while logged in. (Extends #420) |
| 629 | Medium | `getClientIp` trusts proxy headers | `x-forwarded-for` is trusted directly. On Vercel this is safe (platform overwrites it), but on self-hosted or alternative deployments, attackers can spoof IP to bypass rate limiting by sending `x-forwarded-for: 1.2.3.4`. |
| 630 | Low | `durationMs` measures middleware time only | `buildLogEntry` calculates duration at log-entry creation, before the route handler executes. Logged `durationMs` of ~1–5ms is misleading — actual request may take 500ms+. |
| 631 | Low | No request ID for tracing | No `X-Request-ID` header generated. When debugging "notification didn't send" or "quote wasn't created," there's no correlation ID between middleware logs, API route logs, and external service calls. |
| 632 | Medium | Dev preview bypass disables ALL protections | `isDevPreviewEnabled()` skips both rate limiting AND auth evaluation. If enabled in a staging environment with real data (or accidentally deployed to a preview branch), all admin/employee routes are completely unprotected. |
| 633 | Low | Auth evaluation may pass without redirect | If `evaluateAuth` returns `authFailure: true` with no `redirect` (implementation-dependent), the request proceeds to the protected route. The success path runs regardless of `context.authFailure`. |
| 634 | Low | `startTime` leaks into `RequestLog` object | `buildLogEntry` spreads `overrides` (which includes `startTime`) after the defaults. `startTime` isn't a `RequestLog` field but persists on the runtime object. Appears in structured logging output as unexpected field. |

---

## New Issues: `src/lib/env.ts`

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 635 | Medium | `validateServerEnvironment()` not verified as wired to startup | JSDoc says "Call in instrumentation.ts." Without confirming the call exists, server env vars are only validated on first use — a missing `TWILIO_ACCOUNT_SID` isn't discovered until the first SMS send attempt, potentially days after deployment. (SB-5 status update) |
| 636 | Critical | `NEXT_PUBLIC_APP_URL` falls back to `localhost:3000` | `const appUrl = process.env.NEXT_PUBLIC_APP_URL \|\| "http://localhost:3000"`. If the env var is missing in production, every generated URL — quote email links, quote acceptance pages, callback URLs — points to localhost. Quotes become un-clickable, acceptance flow breaks entirely. |
| 637 | Critical | Dev preview in production only warns, doesn't throw | `validateServerEnvironment` detects `NEXT_PUBLIC_DEV_PREVIEW_MODE=true` in production but calls `console.warn`, not `throw`. Combined with middleware bypass (#632), this means a configuration error silently disables all auth in production with no hard failure. |
| 638 | Medium | No webhook/HMAC secret in `SERVER_REQUIRED_KEYS` | SB-4 (#28) identified HMAC fallback to a hardcoded string. `env.ts` doesn't include any webhook or HMAC secret in required server keys. The hardcoded fallback remains unguarded by startup validation. |
| 639 | Low | `ANTHROPIC_API_KEY` only "recommended" | The AI Quote Assistant UI is visible to all admin users. A missing key means the assistant silently fails — mom sees the chat interface but it doesn't work. Should be required if the feature is active, or the UI should be gated on key presence. |
| 640 | Medium | Upstash Redis optional even in production | Rate limiting degrades to "allow-all" if `UPSTASH_REDIS_REST_URL`/`TOKEN` are missing. In production this is only a warning. Deployment without Redis config = zero rate limiting on all API routes, making DoS and SMS abuse trivial. |
| 641 | Low | `validateServerEnvironment` skips public env vars | Missing `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` won't be caught by startup validation. Only caught when `getPublicEnv()` is called at runtime. |
| 642 | Low | `optionalServerEnv` uses `\|\|` not `??` | `process.env[key] \|\| null` treats empty string `""` as absent. Edge case: some env management tools set empty values. Intentional but potentially surprising. |

---

## New Issues: `src/lib/notifications.ts`

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 643 | Medium | Successfully sent messages not written to dedup store | `dispatchSmsWithQuietHours` only writes to `notification_dispatch_queue` on quiet-hours queue or transient-failure queue. Successfully sent messages are never recorded. Two rapid calls with identical (to + body) within 5 minutes both send — dedup check finds nothing because the first send was never written. **Fix:** Write a `status: 'sent'` record after successful send. |
| 644 | Medium | No phone number format validation before Twilio call | `sendSms` sends any string to Twilio. Each invalid-number API call costs $0.0075+ and wastes a retry cycle (3 attempts × 5s = wasted time). E.164 regex check (`/^\+[1-9]\d{1,14}$/`) before calling Twilio would prevent this. (Confirms #416) |
| 645 | Medium | No queue processor visible | Transient failures and quiet-hours messages are queued in `notification_dispatch_queue` with `send_after` timestamp, but no cron job, background worker, or Vercel cron configuration is referenced. If no processor exists, **queued messages are never sent**. A message queued at 21:00 for delivery at 07:00 stays in the queue permanently. |
| 646 | Medium | Retry blocking up to 5 seconds in API route | `sendSmsWithRetry` default: attempt 1 → fail → wait 1s → attempt 2 → fail → wait 4s → attempt 3 → fail. Total: 5+ seconds blocking the API response. Admin sees spinner for 5s+ on transient Twilio failure, then the message is queued anyway. Consider async fire-and-forget for non-critical notifications, or reduce retry to 2 attempts in API context. |
| 647 | Low | New table: `notification_dispatch_queue` | Table not in inferred schema. Columns discovered: `id`, `profile_id`, `to_phone`, `body`, `send_after`, `status`, `queued_reason`, `dedup_key`, `attempts`, `error_text`, `context` (JSONB), `created_at`. Needs index on `(dedup_key, status, created_at)` for the `isDuplicate` query to be efficient. |
| 648 | Medium | No phone number normalization for dedup | Different formats of the same number generate different dedup keys. `"+15551234567"` and `"5551234567"` and `"(555) 123-4567"` all hash to different keys. If admin enters a phone one way and the system formats it another way, dedup fails silently. |
| 649 | Low | `parseClockToMinutes` returns 0 for invalid input | Malformed quiet hours like `"abc:def"` silently default to minute 0 (midnight). If `quiet_hours_start` is corrupted, quiet hours silently shift to midnight instead of being disabled. A validation pass on preferences load would catch this. |
| 650 | Low | `getNextAllowedTime` walks minute-by-minute | For a 21:00→07:00 window, up to 600 iterations. Can be calculated directly: parse `quiet_hours_end`, compute next occurrence. Current approach is correct but O(n) where O(1) is possible. |
| 651 | Low | No `"use server"` directive on server-only module | File imports `createHash` from Node.js `crypto`. If accidentally imported by a client component (e.g., for type reuse), the build fails with a cryptic "crypto is not defined" error. A `"use server"` directive or a comment-level warning would prevent accidental client import. |
| 652 | Low | Default timezone `"America/Chicago"` hardcoded | Correct for Texas cleaning business today. If business expands or an employee moves timezone, the default silently applies wrong quiet hours. Should be documented and ideally sourced from a business-config setting. |

---

## New Issues: `src/lib/idempotency.ts`

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 653 | Critical | In-memory store non-functional on serverless | `store` is a module-level `Map` in process memory. On Vercel serverless: (a) each cold start gets an empty Map, (b) concurrent instances don't share state. The idempotency guard provides **false protection** — it gives callers confidence that duplicates are blocked, but on serverless, most duplicate requests pass through. A double-click from the same user MIGHT be caught (same warm instance), but any concurrent or cross-instance request is not. **Fix:** Replace with Redis-backed or Supabase-backed store (Upstash is already a project dependency for rate limiting). |
| 654 | Medium | No distributed state between instances | Even on a single-server deployment, if the process restarts between the original request and a retry (e.g., deployment mid-request), the Map is lost. The 60-second TTL provides no protection across restarts. |
| 655 | Medium | Placeholder response misleads callers | When `options.ttlMs` is provided, `guardIdempotency` writes a placeholder: `{ status: 202, body: { success: true, message: "Idempotency placeholder" } }`. A concurrent request hitting this placeholder gets a 202 with the placeholder body — not the actual operation result. No `Retry-After` header, no indication it's a placeholder. The caller (LeadPipeline, etc.) treats it as a success. |
| 656 | Low | Key collision between null and empty string | `idempotencyKey("quote", null, "abc")` → `"quote\|\|abc"`. `idempotencyKey("quote", "", "abc")` → `"quote\|\|abc"`. If an operation has a field that can be either `null` or `""`, these collide. Unlikely in practice but violates the principle that different inputs produce different keys. |
| 657 | Low | `prune()` iterates entire Map on every guard call | `O(n)` per `guardIdempotency` invocation. For a low-traffic cleaning business this is negligible, but it's an unusual pattern. A scheduled cleanup or lazy eviction (check TTL on read only) would be more efficient. |
| 658 | Low | Unnecessary function overloads | Two overload signatures where a single `guardIdempotency(key: string, options?: { ttlMs?: number })` would suffice. Adds complexity without utility. |

---

## Cross-File Interaction Bugs

| ID | Files | Issue |
|---|---|---|
| **XF-14** | `env.ts` + `middleware.ts` | **Dev preview bypass chain to production.** `env.ts` detects `NEXT_PUBLIC_DEV_PREVIEW_MODE=true` in production but only `console.warn`s (#637). `middleware.ts` checks `isDevPreviewEnabled()` and skips ALL rate limiting + auth (#632). The env check explicitly requires `NODE_ENV !== "production"`, so the middleware bypass shouldn't fire in production — BUT `NEXT_PUBLIC_DEV_PREVIEW_MODE` is a client-exposed env var (visible in browser bundle). If `NODE_ENV` is misconfigured in a preview/staging deployment with real data, the chain breaks open. The `console.warn` in `validateServerEnvironment` is the only safety net, and it doesn't throw. |
| **XF-15** | `idempotency.ts` + Vercel platform | **Idempotency guard non-functional in deployment environment.** The in-memory Map in `idempotency.ts` doesn't survive cold starts or span instances. The project already has Upstash Redis as a dependency (used for rate limiting per `env.ts`). The idempotency module should use the same Redis backend but doesn't. Any API route relying on `guardIdempotency` (quote-send, quote-create-job, assignment-notify) has NO effective duplicate protection. |
| **XF-16** | `notifications.ts` + `idempotency.ts` | **Double-send on rapid dispatch.** If an admin action triggers SMS notification twice in quick succession: (1) `dispatchSmsWithQuietHours` dedup misses immediately-sent messages (#643), (2) `guardIdempotency` in the API route is non-functional on serverless (#653). Both dedup layers fail → duplicate SMS sent → customer confusion, increased Twilio cost. |

---

## Updated Inferred Schema

Yes — got cut off mid-schema. Here's the completion:

## Updated Inferred Schema (continued)

**NEW TABLE — `notification_dispatch_queue`:**
```
notification_dispatch_queue:
  id               (uuid, PK)
  profile_id       (uuid, nullable, FK → profiles)
  to_phone         (text)
  body             (text)
  send_after       (timestamptz)
  status           (text: 'sent' | 'queued' | 'pending' | 'failed')
  queued_reason    (text: 'quiet_hours' | 'send_failed_transient')
  dedup_key        (text, needs index)
  attempts         (integer)
  error_text       (text, nullable)
  context          (jsonb)
  created_at       (timestamptz)

Needed indexes:
  - (dedup_key, status, created_at) for isDuplicate query
  - (status, send_after) for queue processor (if it exists)
```

---

## Session 9 Batch 1 — Running Totals

| Metric | Before | This Batch | Running |
|---|---|---|---|
| Issues | 625 | **33** (#626–#658) | **658** |
| Cross-file bugs | XF-13 | **3** (XF-14–XF-16) | **XF-16** |
| Ship-blockers | 5 | 0 new (SB-4, SB-5 status updated) | **5** |
| Critical | 40 | **+2** (#636, #637, #653) | **42** |
| Files reviewed | 56 | +4 | **60** |

### New Criticals Summary:
- **C-33 #636**: `NEXT_PUBLIC_APP_URL` falls back to `localhost:3000` — every quote email link broken if env var missing in production
- **C-34 #637**: Dev preview in production only warns, doesn't throw — silent auth bypass
- **C-35 #653**: Idempotency store is in-memory Map — non-functional on Vercel serverless, false duplicate protection

### Key Insight From This Batch:
The **notifications system is far more capable than we inferred from client code** — retry, quiet hours, dedup, queue-on-failure. But the **idempotency system is architecturally broken** on the deployment platform, and there's a critical gap where **successfully sent messages aren't recorded for dedup** (#643). The infrastructure quality is uneven: `notifications.ts` is near-production-grade while `idempotency.ts` needs a complete backend swap.

---



  