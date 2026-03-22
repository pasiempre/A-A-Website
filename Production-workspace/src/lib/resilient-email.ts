/**
 * Resilient email delivery with timeout, retry, and dead-letter telemetry.
 *
 * Wraps the Resend API with:
 * - Configurable timeout per attempt (default 8s)
 * - Exponential backoff retry (default 2 attempts)
 * - Dead-letter logging on exhaustion
 * - Attachment support (base64-encoded)
 * - Graceful failure mode (returns result object, never throws)
 */

import { fetchWithTimeout } from "@/lib/fetch-with-timeout";
import { requireServerEnv } from "@/lib/env";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EmailAttachment {
  filename: string;
  contentBase64: string;
}

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
  /** Optional tag for telemetry grouping */
  tag?: string;
}

export interface EmailResult {
  success: boolean;
  messageId: string | null;
  attempts: number;
  error: string | null;
  deadLettered: boolean;
}

interface RetryConfig {
  /** Max total attempts (including first). Default: 2 */
  maxAttempts?: number;
  /** Timeout per attempt in ms. Default: 8_000 */
  timeoutMs?: number;
  /** Base delay between retries in ms. Default: 1_000 */
  baseDelayMs?: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_MAX_ATTEMPTS = 2;
const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_BASE_DELAY_MS = 1_000;
const RESEND_API_URL = "https://api.resend.com/emails";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isTransientError(status: number): boolean {
  return status === 429 || status >= 500;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function logDeadLetter(
  payload: EmailPayload,
  error: string,
  attempts: number,
): void {
  console.error("[Email Dead Letter]", {
    to: Array.isArray(payload.to) ? payload.to.join(", ") : payload.to,
    subject: payload.subject,
    tag: payload.tag ?? "untagged",
    error,
    attempts,
    timestamp: new Date().toISOString(),
  });
}

// ---------------------------------------------------------------------------
// Core
// ---------------------------------------------------------------------------

/**
 * Send an email with retry, timeout, and optional attachments.
 *
 * Never throws — always returns an `EmailResult` object.
 */
export async function sendEmailResilient(
  payload: EmailPayload,
  config?: RetryConfig,
): Promise<EmailResult> {
  const maxAttempts = config?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const timeoutMs = config?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const baseDelayMs = config?.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;

  const apiKey = requireServerEnv("RESEND_API_KEY");
  const fromAddress =
    payload.from ??
    requireServerEnv("RESEND_FROM_EMAIL");

  let lastError = "Unknown error";

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetchWithTimeout(RESEND_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: Array.isArray(payload.to) ? payload.to : [payload.to],
          subject: payload.subject,
          html: payload.html,
          reply_to: payload.replyTo ?? undefined,
          attachments: payload.attachments?.map((a) => ({
            filename: a.filename,
            content: a.contentBase64,
          })),
        }),
        timeoutMs,
      });

      if (response.ok) {
        const data = (await response.json()) as { id?: string };
        return {
          success: true,
          messageId: data.id ?? null,
          attempts: attempt,
          error: null,
          deadLettered: false,
        };
      }

      if (!isTransientError(response.status)) {
        const errorBody = await response.text().catch(() => "Unknown");
        lastError = `Resend ${response.status}: ${errorBody}`;
        break;
      }

      lastError = `Resend ${response.status}`;

      if (attempt < maxAttempts) {
        const backoff = baseDelayMs * Math.pow(2, attempt - 1);
        await delay(backoff);
      }
    } catch (error) {
      lastError =
        error instanceof Error ? error.message : "Network/timeout error";

      if (attempt < maxAttempts) {
        const backoff = baseDelayMs * Math.pow(2, attempt - 1);
        await delay(backoff);
      }
    }
  }

  logDeadLetter(payload, lastError, maxAttempts);

  return {
    success: false,
    messageId: null,
    attempts: maxAttempts,
    error: lastError,
    deadLettered: true,
  };
}

/**
 * Fire-and-forget email send. Logs failures but never throws.
 */
export function fireAndForgetEmail(
  payload: EmailPayload,
  config?: RetryConfig,
): void {
  void sendEmailResilient(payload, config).catch((error) => {
    console.error("[Email Fire-and-Forget Error]", error);
  });
}
