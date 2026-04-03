import { NextResponse } from "next/server";

import { authorizeAdmin } from "@/lib/auth";
import { getPostJobSettings, normalizePostJobSettingsInput } from "@/lib/post-job-settings";
import { createAdminClient } from "@/lib/supabase/admin";

type RawSettings = {
  review_url?: string | null;
  rating_request_delay_hours?: number;
  review_reminder_delay_hours?: number;
  payment_reminder_delay_hours?: number;
  low_rating_threshold?: number;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toFiniteNumber(value: unknown): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parsePatchBody(body: unknown): RawSettings | null {
  if (!isObject(body)) {
    return null;
  }

  const next: RawSettings = {};

  if ("review_url" in body) {
    next.review_url = body.review_url === null ? null : String(body.review_url ?? "");
  }
  if ("rating_request_delay_hours" in body) {
    const parsed = toFiniteNumber(body.rating_request_delay_hours);
    if (parsed !== undefined) {
      next.rating_request_delay_hours = parsed;
    }
  }
  if ("review_reminder_delay_hours" in body) {
    const parsed = toFiniteNumber(body.review_reminder_delay_hours);
    if (parsed !== undefined) {
      next.review_reminder_delay_hours = parsed;
    }
  }
  if ("payment_reminder_delay_hours" in body) {
    const parsed = toFiniteNumber(body.payment_reminder_delay_hours);
    if (parsed !== undefined) {
      next.payment_reminder_delay_hours = parsed;
    }
  }
  if ("low_rating_threshold" in body) {
    const parsed = toFiniteNumber(body.low_rating_threshold);
    if (parsed !== undefined) {
      next.low_rating_threshold = parsed;
    }
  }

  return next;
}

export async function GET() {
  const auth = await authorizeAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const settings = await getPostJobSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  const auth = await authorizeAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const patch = parsePatchBody(body);
  if (!patch) {
    return NextResponse.json({ error: "Request body must be an object." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: existingRow, error: readError } = await supabase
    .from("automation_settings")
    .select("value")
    .eq("key", "post_job")
    .maybeSingle();

  if (readError) {
    return NextResponse.json({ error: readError.message }, { status: 500 });
  }

  const existingRaw = isObject(existingRow?.value) ? (existingRow.value as RawSettings) : {};
  const normalizedValue = normalizePostJobSettingsInput({ ...existingRaw, ...patch });

  const { error: upsertError } = await supabase
    .from("automation_settings")
    .upsert(
      {
        key: "post_job",
        value: normalizedValue,
        updated_by: auth.userId,
      },
      { onConflict: "key" },
    );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  const settings = await getPostJobSettings();
  return NextResponse.json({ success: true, settings });
}
