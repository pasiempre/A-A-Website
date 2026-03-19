import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function authorizeAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false as const, status: 401, error: authError?.message ?? "Unauthorized." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    return { ok: false as const, status: 403, error: profileError?.message ?? "Admin role required." };
  }

  return { ok: true as const, userId: user.id };
}

export async function POST() {
  const auth = await authorizeAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const supabase = createAdminClient();
    const hasQuickBooksEnv =
      !!process.env.QUICKBOOKS_CLIENT_ID &&
      !!process.env.QUICKBOOKS_CLIENT_SECRET &&
      !!process.env.QUICKBOOKS_REALM_ID;

    if (!hasQuickBooksEnv) {
      const { data: jobs, error: jobsError } = await supabase
        .from("jobs")
        .select("id, status, created_at")
        .order("created_at", { ascending: false })
        .limit(500);

      if (jobsError) {
        return NextResponse.json({ error: jobsError.message }, { status: 500 });
      }

      const completedJobs = (jobs ?? []).filter((job) => job.status === "completed").length;
      const simulatedRevenue = completedJobs * 650;
      const simulatedOutstanding = Math.max(0, simulatedRevenue * 0.28);
      const simulatedOverdue = Math.max(0, simulatedOutstanding * 0.3);

      const periodEnd = new Date();
      const periodStart = new Date(periodEnd.getTime() - 30 * 24 * 60 * 60 * 1000);

      const { error: snapshotError } = await supabase.from("financial_snapshots").upsert(
        {
          period_start: periodStart.toISOString().slice(0, 10),
          period_end: periodEnd.toISOString().slice(0, 10),
          total_revenue: simulatedRevenue,
          outstanding_invoices: simulatedOutstanding,
          overdue_invoices: simulatedOverdue,
          paid_invoices: simulatedRevenue - simulatedOutstanding,
          source: "manual",
          source_payload: {
            mode: "simulated",
            note: "QuickBooks credentials are not configured yet.",
            completedJobs,
          },
        },
        { onConflict: "period_start,period_end,source" },
      );

      if (snapshotError) {
        return NextResponse.json({ error: snapshotError.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        mode: "simulated",
        completedJobs,
        revenue: simulatedRevenue,
      });
    }

    const { error: queueError } = await supabase.from("quickbooks_sync_queue").insert({
      entity_type: "financial_snapshot",
      action: "sync_pull",
      payload: {
        requestedBy: auth.userId,
        requestedAt: new Date().toISOString(),
      },
      status: "queued",
      next_retry_at: new Date().toISOString(),
    });

    if (queueError) {
      return NextResponse.json({ error: queueError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      mode: "queued",
      message: "QuickBooks sync queued. Implement token exchange + pull process when credentials are connected.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error." },
      { status: 500 },
    );
  }
}