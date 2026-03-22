/**
 * End-to-end smoke test suite for A&A Cleaning Platform.
 *
 * Run: npx tsx src/lib/smoke-tests.ts
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
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
    results.push({ name, passed: true, durationMs: Date.now() - start });
    console.log(`  ✅ ${name} (${Date.now() - start}ms)`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, error: message, durationMs: Date.now() - start });
    console.log(`  ❌ ${name}: ${message}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

async function run() {
  console.log("\n🧪 A&A Cleaning Platform — Smoke Tests\n");

  await test("Database connectivity", async () => {
    const { data, error } = await supabase.from("profiles").select("id").limit(1);
    assert(!error, `Query failed: ${error?.message}`);
    assert(Array.isArray(data), "Expected array response");
  });

  const tables = [
    "profiles",
    "jobs",
    "leads",
    "job_assignments",
    "employee_availability",
    "checklist_templates",
    "job_photos",
    "tickets",
    "quote_requests",
    "completion_reports",
    "employment_applications",
    "notification_dispatch_queue",
    "assignment_notification_log",
    "financial_snapshots",
    "quickbooks_credentials",
    "quickbooks_sync_mappings",
    "quickbooks_sync_audit",
    "quickbooks_sync_queue",
  ];

  for (const table of tables) {
    await test(`Table accessible: ${table}`, async () => {
      const { error } = await supabase.from(table).select("*").limit(0);
      assert(!error, `${table}: ${error?.message}`);
    });
  }

  let quoteId: string | null = null;
  await test("Quote request: create", async () => {
    const { data, error } = await supabase
      .from("quote_requests")
      .insert({
        name: "Smoke Test User",
        phone: "5125551234",
        email: "smoke@test.dev",
        service_type: "post_construction",
        description: "Smoke test quote request",
        source: "smoke_test",
      })
      .select("id")
      .single();

    assert(!error, `Insert failed: ${error?.message}`);
    assert(!!data?.id, "No ID returned");
    quoteId = data!.id;
  });

  let leadId: string | null = null;
  await test("Lead: create from quote", async () => {
    const { data, error } = await supabase
      .from("leads")
      .insert({
        name: "Smoke Test Lead",
        phone: "5125551234",
        email: "smoke@test.dev",
        service_type: "post_construction",
        source: "smoke_test",
        status: "new",
      })
      .select("id")
      .single();

    assert(!error, `Insert failed: ${error?.message}`);
    assert(!!data?.id, "No ID returned");
    leadId = data!.id;
  });

  let jobId: string | null = null;
  await test("Job: create", async () => {
    const { data, error } = await supabase
      .from("jobs")
      .insert({
        title: "Smoke Test Job",
        address: "123 Test St, Austin TX",
        clean_type: "post_construction",
        priority: "normal",
        status: "scheduled",
        areas: ["kitchen", "bathroom"],
      })
      .select("id")
      .single();

    assert(!error, `Insert failed: ${error?.message}`);
    assert(!!data?.id, "No ID returned");
    jobId = data!.id;
  });

  await test("Notification queue: enqueue", async () => {
    const { error } = await supabase.from("notification_dispatch_queue").insert({
      to_phone: "+15125551234",
      body: "Smoke test notification",
      send_after: new Date().toISOString(),
      status: "queued",
      context: { source: "smoke_test" },
    });
    assert(!error, `Insert failed: ${error?.message}`);
  });

  await test("Notification queue: batch query", async () => {
    const { data, error } = await supabase
      .from("notification_dispatch_queue")
      .select("id, status, to_phone")
      .in("status", ["queued", "pending"])
      .limit(10);

    assert(!error, `Query failed: ${error?.message}`);
    assert(Array.isArray(data), "Expected array");
  });

  await test("Completion report: create", async () => {
    if (!jobId) {
      throw new Error("Skipped — no job ID from previous test");
    }

    const { error } = await supabase.from("completion_reports").insert({
      job_id: jobId,
      status: "generated",
      report_payload: { source: "smoke_test" },
    });
    assert(!error, `Insert failed: ${error?.message}`);
  });

  await test("RLS: service role can read completion_reports", async () => {
    const { data, error } = await supabase.from("completion_reports").select("id").limit(1);
    assert(!error, `Query failed: ${error?.message}`);
    assert(Array.isArray(data), "Expected array");
  });

  await test("RLS: service role can read notification_dispatch_queue", async () => {
    const { data, error } = await supabase.from("notification_dispatch_queue").select("id").limit(1);
    assert(!error, `Query failed: ${error?.message}`);
    assert(Array.isArray(data), "Expected array");
  });

  await test("Cleanup: remove smoke test data", async () => {
    if (quoteId) {
      await supabase.from("quote_requests").delete().eq("id", quoteId);
    }
    if (leadId) {
      await supabase.from("leads").delete().eq("id", leadId);
    }
    if (jobId) {
      await supabase.from("completion_reports").delete().eq("job_id", jobId);
      await supabase.from("jobs").delete().eq("id", jobId);
    }
    await supabase.from("notification_dispatch_queue").delete().eq("body", "Smoke test notification");
  });

  console.log("\n" + "─".repeat(50));
  const passed = results.filter((result) => result.passed).length;
  const failed = results.filter((result) => !result.passed).length;
  const totalMs = results.reduce((sum, result) => sum + result.durationMs, 0);

  console.log(`\n  ${passed} passed, ${failed} failed (${totalMs}ms total)\n`);

  if (failed > 0) {
    console.log("  Failed tests:");
    for (const result of results.filter((item) => !item.passed)) {
      console.log(`    ❌ ${result.name}: ${result.error}`);
    }
    console.log("");
    process.exit(1);
  }
}

void run();
