import { NextResponse } from "next/server";

import type { SupabaseClient } from "@supabase/supabase-js";

import { authorizeCronRequest } from "@/lib/cron-auth";
import { sendSmsWithRetry } from "@/lib/notifications";
import { createAdminClient } from "@/lib/supabase/admin";

// ============================================================
// Types
// ============================================================

type QueueRow = {
  id: string;
  to_phone: string;
  body: string;
  status: string;
  dedup_key: string | null;
  attempts: number;
  error_text: string | null;
  context: Record<string, unknown> | null;
};

type ProcessResult = {
  id: string;
  outcome: "sent" | "retry" | "dead_letter" | "deduped" | "failed";
  sid?: string;
  error?: string;
  attempts: number;
  nextRetryAt?: string;
};

type DispatchTelemetry = {
  processed: number;
  sent: number;
  retried: number;
  deadLettered: number;
  deduped: number;
  failed: number;
};

type RequestBody = {
  batch_size?: number;
  retry_failed?: boolean;
};

// ============================================================
// Constants
// ============================================================

const MAX_ATTEMPTS = 5;
const DEFAULT_BATCH_SIZE = 50;
const MAX_BATCH_SIZE = 200;
const RETRY_BASE_DELAY_MS = 5 * 60 * 1_000;
const DEDUP_WINDOW_MS = 5 * 60 * 1_000;

// ============================================================
// Queue processing helpers
// ============================================================

async function isDuplicateInQueue(
  supabase: SupabaseClient,
  dedupKey: string | null,
): Promise<boolean> {
  if (!dedupKey) {
    return false;
  }

  const cutoff = new Date(Date.now() - DEDUP_WINDOW_MS).toISOString();
  const { data, error } = await supabase
    .from("notification_dispatch_queue")
    .select("id")
    .eq("dedup_key", dedupKey)
    .eq("status", "sent")
    .gte("sent_at", cutoff)
    .limit(1);

  if (error) {
    console.error(
      "[notification-dispatch] Dedup query failed:",
      error.message,
    );
    return false;
  }

  return (data?.length ?? 0) > 0;
}

function calculateNextRetryTime(currentAttempts: number): Date {
  const delayMs = RETRY_BASE_DELAY_MS * Math.pow(2, currentAttempts);
  return new Date(Date.now() + delayMs);
}

async function processQueueItem(
  supabase: SupabaseClient,
  row: QueueRow,
): Promise<ProcessResult> {
  const currentAttempts = row.attempts ?? 0;

  const isDupe = await isDuplicateInQueue(supabase, row.dedup_key);
  if (isDupe) {
    return {
      id: row.id,
      outcome: "deduped",
      attempts: currentAttempts,
    };
  }

  const result = await sendSmsWithRetry(row.to_phone, row.body, {
    maxAttempts: 2,
    baseDelayMs: 500,
    backoffMultiplier: 2,
  });

  const totalAttempts = currentAttempts + (result.attempts ?? 1);

  if (result.sent) {
    return {
      id: row.id,
      outcome: "sent",
      sid: result.sid,
      attempts: totalAttempts,
    };
  }

  if (result.errorCategory === "transient") {
    if (totalAttempts >= MAX_ATTEMPTS) {
      return {
        id: row.id,
        outcome: "dead_letter",
        error: `Exhausted ${MAX_ATTEMPTS} attempts. Last: ${result.error}`,
        attempts: totalAttempts,
      };
    }

    const nextRetry = calculateNextRetryTime(totalAttempts);
    return {
      id: row.id,
      outcome: "retry",
      error: result.error,
      attempts: totalAttempts,
      nextRetryAt: nextRetry.toISOString(),
    };
  }

  return {
    id: row.id,
    outcome: "failed",
    error: result.error ?? "Permanent send failure.",
    attempts: totalAttempts,
  };
}

async function applyResults(
  supabase: SupabaseClient,
  results: ProcessResult[],
): Promise<void> {
  const now = new Date().toISOString();
  const updateTasks = results.map(async (result) => {
    switch (result.outcome) {
      case "sent":
        await supabase
          .from("notification_dispatch_queue")
          .update({
            status: "sent",
            sent_at: now,
            provider_sid: result.sid ?? null,
            error_text: null,
            attempts: result.attempts,
          })
          .eq("id", result.id);
        return;
      case "retry":
        await supabase
          .from("notification_dispatch_queue")
          .update({
            status: "queued",
            send_after: result.nextRetryAt,
            error_text: result.error ?? null,
            attempts: result.attempts,
          })
          .eq("id", result.id);
        return;
      case "dead_letter":
        await supabase
          .from("notification_dispatch_queue")
          .update({
            status: "permanently_failed",
            error_text:
              result.error ?? "Exceeded maximum retry attempts.",
            attempts: result.attempts,
          })
          .eq("id", result.id);
        return;
      case "deduped":
        await supabase
          .from("notification_dispatch_queue")
          .update({
            status: "deduped",
            error_text:
              "Skipped — duplicate already sent within dedup window.",
            attempts: result.attempts,
          })
          .eq("id", result.id);
        return;
      case "failed":
        await supabase
          .from("notification_dispatch_queue")
          .update({
            status: "failed",
            error_text: result.error ?? "Permanent send failure.",
            attempts: result.attempts,
          })
          .eq("id", result.id);
        return;
    }
  });

  await Promise.all(updateTasks);
}

function aggregateTelemetry(
  results: ProcessResult[],
): DispatchTelemetry {
  const telemetry: DispatchTelemetry = {
    processed: results.length,
    sent: 0,
    retried: 0,
    deadLettered: 0,
    deduped: 0,
    failed: 0,
  };

  for (const result of results) {
    switch (result.outcome) {
      case "sent":
        telemetry.sent += 1;
        break;
      case "retry":
        telemetry.retried += 1;
        break;
      case "dead_letter":
        telemetry.deadLettered += 1;
        break;
      case "deduped":
        telemetry.deduped += 1;
        break;
      case "failed":
        telemetry.failed += 1;
        break;
    }
  }

  return telemetry;
}

function parseRequestBody(body: unknown): {
  batchSize: number;
  retryFailed: boolean;
} {
  const parsed = (body ?? {}) as RequestBody;

  let batchSize = DEFAULT_BATCH_SIZE;
  if (typeof parsed.batch_size === "number" && parsed.batch_size > 0) {
    batchSize = Math.min(parsed.batch_size, MAX_BATCH_SIZE);
  }

  const retryFailed =
    typeof parsed.retry_failed === "boolean"
      ? parsed.retry_failed
      : false;

  return { batchSize, retryFailed };
}

// ============================================================
// POST handler (main dispatch)
// ============================================================

export async function POST(request: Request) {
  // --- Auth (fail-closed) ---
  const auth = authorizeCronRequest(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error ?? "Unauthorized." },
      { status: 401 },
    );
  }

  try {
    let rawBody: unknown = {};
    try {
      rawBody = await request.json();
    } catch {
      rawBody = {};
    }

    const { batchSize, retryFailed } = parseRequestBody(rawBody);
    const supabase = createAdminClient();

    const eligibleStatuses = ["queued"];
    if (retryFailed) {
      eligibleStatuses.push("failed");
    }

    const { data: queuedRows, error: queryError } = await supabase
      .from("notification_dispatch_queue")
      .select(
        "id, to_phone, body, status, dedup_key, attempts, error_text, context",
      )
      .in("status", eligibleStatuses)
      .lte("send_after", new Date().toISOString())
      .order("send_after", { ascending: true })
      .limit(batchSize);

    if (queryError) {
      return NextResponse.json(
        {
          success: false,
          error: `Queue query failed: ${queryError.message}`,
          error_code: "QUEUE_QUERY_ERROR",
        },
        { status: 500 },
      );
    }

    const rows = (queuedRows ?? []) as QueueRow[];

    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        queuedCount: 0,
        sent: 0,
        failed: 0,
        telemetry: {
          processed: 0,
          sent: 0,
          retried: 0,
          deadLettered: 0,
          deduped: 0,
          failed: 0,
        },
        message: "No pending notifications to dispatch.",
      });
    }

    const results: ProcessResult[] = [];

    for (const row of rows) {
      const result = await processQueueItem(supabase, row);
      results.push(result);
    }

    await applyResults(supabase, results);
    const telemetry = aggregateTelemetry(results);

    const messageParts: string[] = [];
    if (telemetry.sent > 0) messageParts.push(`${telemetry.sent} sent`);
    if (telemetry.retried > 0)
      messageParts.push(`${telemetry.retried} retrying`);
    if (telemetry.deduped > 0)
      messageParts.push(`${telemetry.deduped} deduped`);
    if (telemetry.deadLettered > 0)
      messageParts.push(`${telemetry.deadLettered} dead-lettered`);
    if (telemetry.failed > 0)
      messageParts.push(`${telemetry.failed} failed`);
    const summary =
      messageParts.length > 0
        ? messageParts.join(", ")
        : "no actions taken";

    return NextResponse.json({
      success: true,
      queuedCount: telemetry.processed,
      sent: telemetry.sent,
      failed: telemetry.failed + telemetry.deadLettered,
      telemetry,
      message: `Dispatched ${telemetry.processed} notifications: ${summary}.`,
    });
  } catch (error) {
    console.error(
      "[notification-dispatch] Unexpected error:",
      error instanceof Error ? error.message : error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error.",
        error_code: "DISPATCH_UNEXPECTED_ERROR",
      },
      { status: 500 },
    );
  }
}
