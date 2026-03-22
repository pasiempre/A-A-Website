import type { SupabaseClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * Result from a single SMS send attempt.
 * Backward-compatible: original callers only checked `sent`, `sid`, `error`.
 * New fields (`errorCategory`, `attempts`) are additive.
 */
type SmsResult = {
  sent: boolean;
  sid?: string;
  error?: string;
  /** Classifies the failure to determine retry eligibility. */
  errorCategory?: "transient" | "permanent" | "config";
  /** How many send attempts were made (1 for sendSms, 1-N for sendSmsWithRetry). */
  attempts?: number;
};

export type NotificationPreferences = {
  quiet_hours_start: string;
  quiet_hours_end: string;
  batch_job_notifications: boolean;
  sms_enabled: boolean;
  email_enabled: boolean;
  notification_summary_time: string;
  timezone: string;
};

type QuietHoursDispatchResult = {
  sent: boolean;
  queued: boolean;
  sid?: string;
  error?: string;
  errorCategory?: "transient" | "permanent" | "config";
  scheduledFor?: string;
  attempts?: number;
  /** Hash key used for deduplication. Useful for debugging duplicate checks. */
  dedupKey?: string;
};

type RetryOptions = {
  /** Maximum number of send attempts. Default: 3. */
  maxAttempts?: number;
  /** Initial delay in ms before first retry. Default: 1000. */
  baseDelayMs?: number;
  /** Multiplier applied to delay for each subsequent retry. Default: 4. */
  backoffMultiplier?: number;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  quiet_hours_start: "21:00",
  quiet_hours_end: "07:00",
  batch_job_notifications: true,
  sms_enabled: true,
  email_enabled: false,
  notification_summary_time: "06:00",
  timezone: "America/Chicago",
};

/** Default retry: 3 attempts with delays of 1s, then 4s between retries. */
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  baseDelayMs: 1_000,
  backoffMultiplier: 4,
};

/** Messages with identical (recipient + body) within this window are deduped. */
const DEDUP_WINDOW_MS = 5 * 60 * 1_000; // 5 minutes

/**
 * Twilio HTTP status codes that indicate transient failures worth retrying.
 * 429 = rate limited, 5xx = server-side issues.
 */
const TRANSIENT_HTTP_CODES = new Set([429, 500, 502, 503, 504]);

/**
 * Twilio error codes that are permanently unrecoverable (never retry).
 * @see https://www.twilio.com/docs/api/errors
 */
const PERMANENT_TWILIO_CODES = new Set([
  21211, // Invalid "To" phone number
  21614, // Not a mobile number (can't receive SMS)
  21408, // Permission not enabled for region
  21610, // Recipient has unsubscribed
]);

// ─── Error Classification ────────────────────────────────────────────────────

/**
 * Classifies an SMS failure to determine retry eligibility.
 *
 * - "transient": Temporary issue (network, rate limit, server error) → retry
 * - "permanent": Invalid recipient or blocked number → do NOT retry
 * - "config": Missing environment variables → do NOT retry
 *
 * @param httpStatus - HTTP status code from Twilio response, or null if no response
 * @param errorBody - Raw response body text from Twilio
 */
function classifySmsError(
  httpStatus: number | null,
  errorBody: string | null,
): "transient" | "permanent" | "config" {
  if (httpStatus === null) {
    return "config";
  }

  // Check for known permanent Twilio error codes embedded in the JSON body
  if (errorBody) {
    try {
      const parsed = JSON.parse(errorBody) as { code?: number };
      if (typeof parsed.code === "number" && PERMANENT_TWILIO_CODES.has(parsed.code)) {
        return "permanent";
      }
    } catch {
      // Response wasn't JSON — fall through to HTTP status classification
    }
  }

  if (TRANSIENT_HTTP_CODES.has(httpStatus)) {
    return "transient";
  }

  // 4xx (except 429, already handled) are generally permanent client errors
  if (httpStatus >= 400 && httpStatus < 500) {
    return "permanent";
  }

  // Unknown status — default to transient (safer to retry than to drop)
  return "transient";
}

// ─── Dedup Key Generation ────────────────────────────────────────────────────

/**
 * Generates a dedup key from recipient phone + message body.
 * The time window is enforced by the database query in isDuplicate(),
 * not baked into the key — avoids edge-case misses at bucket boundaries.
 */
function generateDedupKey(to: string, body: string): string {
  const raw = `sms:${to}:${body}`;
  return createHash("sha256").update(raw).digest("hex").slice(0, 32);
}

// ─── Delay Utility ───────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Core SMS Sending (Single Attempt) ───────────────────────────────────────

/**
 * Sends a single SMS via Twilio. Returns a structured result with error
 * classification. This is the low-level function — most callers should
 * use {@link sendSmsWithRetry} or {@link dispatchSmsWithQuietHours} instead.
 *
 * Backward-compatible: original callers that only check `sent` and `error`
 * continue to work unchanged.
 */
export async function sendSms(to: string, body: string): Promise<SmsResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return {
      sent: false,
      error: "Twilio environment variables are not configured.",
      errorCategory: "config",
      attempts: 1,
    };
  }

  const payload = new URLSearchParams({
    To: to,
    From: fromNumber,
    Body: body,
  });

  let response: Response;
  try {
    response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload.toString(),
      },
    );
  } catch (networkError) {
    // Network-level failure (DNS, timeout, connection refused) — always transient
    return {
      sent: false,
      error: networkError instanceof Error
        ? networkError.message
        : "Network error sending SMS.",
      errorCategory: "transient",
      attempts: 1,
    };
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unable to read error response.");
    const category = classifySmsError(response.status, errorText);

    return {
      sent: false,
      error: errorText || `Twilio SMS request failed with status ${response.status}.`,
      errorCategory: category,
      attempts: 1,
    };
  }

  const data = (await response.json()) as { sid?: string };
  return {
    sent: true,
    sid: data.sid,
    attempts: 1,
  };
}

// ─── SMS Sending with Retry ─────────────────────────────────────────────────

/**
 * Sends an SMS with exponential backoff retry for transient failures.
 *
 * Default behavior: up to 3 attempts with delays of 1s, 4s between retries.
 * Permanent errors (invalid number, unsubscribed) and config errors (missing
 * env vars) are returned immediately without retry.
 *
 * @example
 * ```ts
 * const result = await sendSmsWithRetry("+15551234567", "Nuevo trabajo asignado");
 * if (!result.sent) {
 *   console.log(`Failed after ${result.attempts} attempts: ${result.error}`);
 * }
 * ```
 */
export async function sendSmsWithRetry(
  to: string,
  body: string,
  options?: RetryOptions,
): Promise<SmsResult> {
  const { maxAttempts, baseDelayMs, backoffMultiplier } = {
    ...DEFAULT_RETRY_OPTIONS,
    ...options,
  };

  let lastResult: SmsResult = {
    sent: false,
    error: "No send attempts made.",
    errorCategory: "transient",
    attempts: 0,
  };

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const result = await sendSms(to, body);
    result.attempts = attempt;

    // Success — return immediately
    if (result.sent) {
      return result;
    }

    lastResult = result;

    // Permanent or config error — do not retry, return immediately
    if (result.errorCategory !== "transient") {
      return result;
    }

    // Transient error with remaining attempts — wait before next try
    if (attempt < maxAttempts) {
      const delayMs = baseDelayMs * Math.pow(backoffMultiplier, attempt - 1);
      await delay(delayMs);
    }
  }

  // All retry attempts exhausted
  return {
    ...lastResult,
    attempts: maxAttempts,
    error: `All ${maxAttempts} attempts failed. Last error: ${lastResult.error}`,
  };
}

// ─── Quiet Hours Utilities ───────────────────────────────────────────────────

/**
 * Parses a "HH:MM" string into total minutes since midnight.
 * Returns 0 for malformed input (safe default — midnight).
 */
function parseClockToMinutes(value: string): number {
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return 0;
  }

  return hour * 60 + minute;
}

/**
 * Gets the current time-of-day in minutes for a given timezone.
 * Uses Intl.DateTimeFormat to correctly handle DST transitions.
 */
function getTimePartsByTimezone(now: Date, timezone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  }).formatToParts(now);

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

/**
 * Determines if the current time falls within the quiet hours window.
 * Handles overnight spans (e.g., 21:00 → 07:00) correctly.
 */
function isWithinQuietHours(
  now: Date,
  preferences: NotificationPreferences,
): boolean {
  const nowMinutes = getTimePartsByTimezone(now, preferences.timezone);
  const startMinutes = parseClockToMinutes(preferences.quiet_hours_start);
  const endMinutes = parseClockToMinutes(preferences.quiet_hours_end);

  // Same start and end = quiet hours disabled
  if (startMinutes === endMinutes) {
    return false;
  }

  // Same-day range (e.g., 08:00 → 17:00)
  if (startMinutes < endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  }

  // Overnight range (e.g., 21:00 → 07:00)
  return nowMinutes >= startMinutes || nowMinutes < endMinutes;
}

/**
 * Walks forward minute-by-minute to find the first time outside quiet hours.
 * Guaranteed to return within 24 hours; falls back to +1 hour if loop exhausts.
 */
function getNextAllowedTime(
  now: Date,
  preferences: NotificationPreferences,
): Date {
  if (!isWithinQuietHours(now, preferences)) {
    return now;
  }

  let candidate = new Date(now.getTime());
  for (let minute = 0; minute < 24 * 60; minute += 1) {
    candidate = new Date(candidate.getTime() + 60 * 1000);
    if (!isWithinQuietHours(candidate, preferences)) {
      return candidate;
    }
  }

  // Safety fallback — should never reach here with valid preferences
  return new Date(now.getTime() + 60 * 60 * 1000);
}

// ─── Preference Normalization ────────────────────────────────────────────────

/**
 * Merges partial or missing preferences with safe defaults.
 * Callers can pass `null`, `undefined`, or a partial object.
 */
export function normalizeNotificationPreferences(
  rawPreferences: Partial<NotificationPreferences> | null | undefined,
): NotificationPreferences {
  return {
    ...DEFAULT_NOTIFICATION_PREFERENCES,
    ...(rawPreferences ?? {}),
  };
}

// ─── Dedup Check ─────────────────────────────────────────────────────────────

/**
 * Checks if a message with the same dedup key was already sent or queued
 * within the dedup window (default: 5 minutes).
 *
 * Returns `true` if a duplicate exists and the new message should be skipped.
 *
 * We check for status IN ('sent', 'queued', 'pending') — failed messages
 * are NOT considered duplicates (they should be retried).
 */
async function isDuplicate(
  supabase: SupabaseClient,
  dedupKey: string,
): Promise<boolean> {
  const cutoff = new Date(Date.now() - DEDUP_WINDOW_MS).toISOString();

  const { data, error } = await supabase
    .from("notification_dispatch_queue")
    .select("id")
    .eq("dedup_key", dedupKey)
    .in("status", ["sent", "queued", "pending"])
    .gte("created_at", cutoff)
    .limit(1);

  if (error) {
    // If dedup check fails, allow the message through — better to send a
    // duplicate than to silently drop a message
    console.error("[notifications] Dedup check failed:", error.message);
    return false;
  }

  return (data?.length ?? 0) > 0;
}

// ─── Queue Helper ────────────────────────────────────────────────────────────

/**
 * Inserts a notification into the dispatch queue for later processing.
 * Used by both quiet-hours queueing and failure-fallback queueing.
 */
async function queueNotification(
  supabase: SupabaseClient,
  options: {
    to: string;
    body: string;
    profileId?: string | null;
    sendAfter: Date;
    reason: string;
    dedupKey: string;
    attempts: number;
    lastError?: string;
    context?: Record<string, unknown>;
  },
): Promise<{ queued: boolean; error?: string }> {
  const { error } = await supabase.from("notification_dispatch_queue").insert({
    profile_id: options.profileId ?? null,
    to_phone: options.to,
    body: options.body,
    send_after: options.sendAfter.toISOString(),
    status: "queued",
    queued_reason: options.reason,
    dedup_key: options.dedupKey,
    attempts: options.attempts,
    error_text: options.lastError ?? null,
    context: options.context ?? {},
  });

  if (error) {
    console.error("[notifications] Failed to queue notification:", error.message);
    return { queued: false, error: error.message };
  }

  return { queued: true };
}

// ─── Main Dispatch Function ──────────────────────────────────────────────────

/**
 * Primary SMS dispatch function with quiet hours, retry, dedup, and
 * queue-on-failure. This is the function most callers should use.
 *
 * ## Dispatch Flow
 *
 * 1. Check if SMS is enabled in preferences → skip if disabled
 * 2. Generate dedup key → skip if duplicate found within 5-min window
 * 3. If within quiet hours → queue for next allowed time
 * 4. Otherwise, attempt to send with retry (3 attempts, exponential backoff)
 * 5. If all retries fail with transient error → queue for retry (not dropped)
 * 6. If permanent/config error → return error (do NOT queue — would never succeed)
 *
 * ## Breaking Change: NONE
 * Signature is identical to the original. New fields in the return type are
 * additive. Existing callers (assignment-notifications.ts, quote-request, etc.)
 * continue to work without changes.
 *
 * @example
 * ```ts
 * const result = await dispatchSmsWithQuietHours({
 *   supabase,
 *   to: "+15551234567",
 *   body: "Nuevo trabajo asignado: Post-Reno Clean",
 *   profileId: "employee-uuid",
 *   preferences: employee.notification_preferences,
 *   context: { type: "job_assignment", jobId: "abc" },
 * });
 *
 * if (result.sent) {
 *   console.log("Delivered:", result.sid);
 * } else if (result.queued) {
 *   console.log("Queued for:", result.scheduledFor);
 * } else {
 *   console.error("Failed:", result.error, result.errorCategory);
 * }
 * ```
 */
export async function dispatchSmsWithQuietHours(options: {
  supabase: SupabaseClient;
  to: string;
  body: string;
  profileId?: string | null;
  preferences?: Partial<NotificationPreferences> | null;
  queuedReason?: string;
  context?: Record<string, unknown>;
  /** Override retry behavior. Defaults to 3 attempts with exponential backoff. */
  retry?: RetryOptions;
  /** Skip dedup check. Use sparingly — only for re-sends or manual overrides. */
  skipDedup?: boolean;
}): Promise<QuietHoursDispatchResult> {
  const preferences = normalizeNotificationPreferences(options.preferences);

  // ── Step 1: Check if SMS is enabled ──
  if (!preferences.sms_enabled) {
    return {
      sent: false,
      queued: false,
      error: "SMS disabled by notification preferences.",
      errorCategory: "config",
    };
  }

  // ── Step 2: Dedup check ──
  const dedupKey = generateDedupKey(options.to, options.body);

  if (!options.skipDedup) {
    const duplicate = await isDuplicate(options.supabase, dedupKey);
    if (duplicate) {
      return {
        sent: false,
        queued: false,
        error: "Duplicate message detected within dedup window. Skipped.",
        dedupKey,
      };
    }
  }

  // ── Step 3: Quiet hours → queue for later ──
  const now = new Date();
  if (isWithinQuietHours(now, preferences)) {
    const nextAllowedTime = getNextAllowedTime(now, preferences);

    const queueResult = await queueNotification(options.supabase, {
      to: options.to,
      body: options.body,
      profileId: options.profileId,
      sendAfter: nextAllowedTime,
      reason: options.queuedReason ?? "quiet_hours",
      dedupKey,
      attempts: 0,
      context: options.context,
    });

    if (!queueResult.queued) {
      return {
        sent: false,
        queued: false,
        error: `Quiet hours queueing failed: ${queueResult.error}`,
        dedupKey,
      };
    }

    return {
      sent: false,
      queued: true,
      scheduledFor: nextAllowedTime.toISOString(),
      dedupKey,
    };
  }

  // ── Step 4: Attempt send with retry ──
  const sendResult = await sendSmsWithRetry(options.to, options.body, options.retry);

  if (sendResult.sent) {
    return {
      sent: true,
      queued: false,
      sid: sendResult.sid,
      attempts: sendResult.attempts,
      dedupKey,
    };
  }

  // ── Step 5: Transient failure → queue for retry instead of dropping ──
  if (sendResult.errorCategory === "transient") {
    const retryDelay = new Date(Date.now() + 5 * 60 * 1_000); // Retry in 5 minutes

    const queueResult = await queueNotification(options.supabase, {
      to: options.to,
      body: options.body,
      profileId: options.profileId,
      sendAfter: retryDelay,
      reason: "send_failed_transient",
      dedupKey,
      attempts: sendResult.attempts ?? 0,
      lastError: sendResult.error,
      context: options.context,
    });

    if (queueResult.queued) {
      return {
        sent: false,
        queued: true,
        error: sendResult.error,
        errorCategory: "transient",
        scheduledFor: retryDelay.toISOString(),
        attempts: sendResult.attempts,
        dedupKey,
      };
    }

    // Even the queue insert failed — this is the worst case
    return {
      sent: false,
      queued: false,
      error: `Send failed and queue fallback also failed: ${queueResult.error}. Original: ${sendResult.error}`,
      errorCategory: "transient",
      attempts: sendResult.attempts,
      dedupKey,
    };
  }

  // ── Step 6: Permanent or config error → do NOT queue (would never succeed) ──
  return {
    sent: false,
    queued: false,
    error: sendResult.error,
    errorCategory: sendResult.errorCategory,
    attempts: sendResult.attempts,
    dedupKey,
  };
}
