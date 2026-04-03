/**
 * Focused smoke tests for F-07 Post-Job Automation foundations.
 *
 * Run: npx tsx src/lib/post-job-smoke-tests.ts
 *
 * Requires:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

function loadDotEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const idx = trimmed.indexOf("=");
    if (idx <= 0) {
      continue;
    }

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadDotEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type TestResult = { name: string; passed: boolean; error?: string; durationMs: number };
const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    results.push({ name, passed: true, durationMs });
    console.log(`  PASS ${name} (${durationMs}ms)`);
  } catch (error) {
    const durationMs = Date.now() - start;
    const message = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, error: message, durationMs });
    console.log(`  FAIL ${name}: ${message}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function addHours(isoString: string, hours: number) {
  const value = new Date(isoString).getTime() + hours * 60 * 60 * 1000;
  return new Date(value).toISOString();
}

async function run() {
  console.log("\nF-07 Post-Job Automation Smoke Tests\n");

  const nowIso = new Date().toISOString();
  const suffix = Date.now();

  let jobId: string | null = null;
  let sequenceId: string | null = null;

  await test("Table accessible: post_job_sequence", async () => {
    const { error } = await supabase.from("post_job_sequence").select("id").limit(0);
    assert(!error, `post_job_sequence inaccessible: ${error?.message}`);
  });

  await test("Table accessible: automation_settings", async () => {
    const { error } = await supabase.from("automation_settings").select("key").limit(0);
    assert(!error, `automation_settings inaccessible: ${error?.message}`);
  });

  await test("Settings row exists: post_job", async () => {
    const { data, error } = await supabase
      .from("automation_settings")
      .select("key, value")
      .eq("key", "post_job")
      .maybeSingle();

    assert(!error, `automation_settings read failed: ${error?.message}`);
    assert(!!data, "Missing automation_settings row for key 'post_job'");

    const value = (data?.value ?? {}) as Record<string, unknown>;
    const lowRatingThreshold = Number(value.low_rating_threshold);
    assert(Number.isFinite(lowRatingThreshold), "low_rating_threshold is not numeric");
    assert(lowRatingThreshold >= 2 && lowRatingThreshold <= 5, "low_rating_threshold out of expected range [2,5]");
  });

  await test("Create smoke job for sequence checks", async () => {
    const { data, error } = await supabase
      .from("jobs")
      .insert({
        title: `Smoke F07 Job ${suffix}`,
        address: "123 Smoke Test Ave, Austin TX",
        status: "completed",
        qa_status: "approved",
        customer_phone: "+15125550123",
      })
      .select("id")
      .single();

    assert(!error, `jobs insert failed: ${error?.message}`);
    assert(!!data?.id, "No job ID returned");
    jobId = data!.id;
  });

  await test("Create active post-job sequence", async () => {
    assert(!!jobId, "jobId missing");

    const { data, error } = await supabase
      .from("post_job_sequence")
      .insert({
        job_id: jobId,
        status: "active",
        next_step: "rating_request",
        approval_at: nowIso,
        rating_request_due_at: addHours(nowIso, -1),
        review_reminder_due_at: addHours(nowIso, 24),
        payment_reminder_due_at: addHours(nowIso, 48),
        context: { source: "f07_smoke", messageSid: `SMOKE_${suffix}` },
      })
      .select("id")
      .single();

    assert(!error, `post_job_sequence insert failed: ${error?.message}`);
    assert(!!data?.id, "No sequence ID returned");
    sequenceId = data!.id;
  });

  await test("Due-step query matches rating_request record", async () => {
    assert(!!sequenceId, "sequenceId missing");

    const { data, error } = await supabase
      .from("post_job_sequence")
      .select("id")
      .eq("id", sequenceId)
      .eq("status", "active")
      .eq("next_step", "rating_request")
      .lte("rating_request_due_at", nowIso);

    assert(!error, `due query failed: ${error?.message}`);
    assert((data?.length ?? 0) === 1, "Sequence did not match due rating_request filter");
  });

  await test("MessageSid idempotency contains() query returns record", async () => {
    const sid = `SMOKE_${suffix}`;
    const { data, error } = await supabase
      .from("post_job_sequence")
      .select("id")
      .contains("context", { messageSid: sid })
      .limit(1);

    assert(!error, `contains query failed: ${error?.message}`);
    assert((data?.length ?? 0) === 1, "Expected sequence row for messageSid contains() query");
  });

  await test("Cleanup smoke artifacts", async () => {
    if (sequenceId) {
      await supabase.from("post_job_sequence").delete().eq("id", sequenceId);
    }
    if (jobId) {
      await supabase.from("jobs").delete().eq("id", jobId);
    }
  });

  console.log("\n" + "-".repeat(52));
  const passed = results.filter((item) => item.passed).length;
  const failed = results.filter((item) => !item.passed).length;
  const totalMs = results.reduce((sum, item) => sum + item.durationMs, 0);
  console.log(`  ${passed} passed, ${failed} failed (${totalMs}ms total)`);

  if (failed > 0) {
    console.log("\n  Failed tests:");
    for (const item of results.filter((entry) => !entry.passed)) {
      console.log(`  - ${item.name}: ${item.error}`);
    }
    process.exit(1);
  }
}

void run();
