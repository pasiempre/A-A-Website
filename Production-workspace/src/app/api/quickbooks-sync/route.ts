import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { authorizeAdmin } from "@/lib/auth";
import {
  getQBConnectionStatus,
  initQBOAuth,
  isQBConfigured,
  qbApiRequest,
  type QBApiError,
  revokeQBTokens,
} from "@/lib/quickbooks";
import {
  generateInvoicesFromReports,
  generateSingleInvoice,
  getInvoiceSyncSummary,
  getSyncStatus,
  syncCustomersToQB,
  syncVendorsToQB,
} from "@/lib/quickbooks-sync";
import {
  guardIdempotency,
  commitIdempotency,
  idempotencyKey,
} from "@/lib/idempotency";
import { createAdminClient } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// Simulated Sync (when QB not connected)
// ---------------------------------------------------------------------------

async function runSimulatedSync(userId: string) {
  const supabase = createAdminClient();

  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select("id, status, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (jobsError) {
    return NextResponse.json(
      { error: jobsError.message },
      { status: 500 },
    );
  }

  const completedJobs = (jobs ?? []).filter(
    (job) => job.status === "completed",
  ).length;
  const simulatedRevenue = completedJobs * 650;
  const simulatedOutstanding = Math.max(
    0,
    simulatedRevenue * 0.28,
  );
  const simulatedOverdue = Math.max(
    0,
    simulatedOutstanding * 0.3,
  );

  const periodEnd = new Date();
  const periodStart = new Date(
    periodEnd.getTime() - 30 * 24 * 60 * 60 * 1000,
  );

  const { error: snapshotError } = await supabase
    .from("financial_snapshots")
    .upsert(
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
          note: "QuickBooks credentials not configured. Using estimated data.",
          completedJobs,
          requestedBy: userId,
        },
      },
      { onConflict: "period_start,period_end,source" },
    );

  if (snapshotError) {
    return NextResponse.json(
      { error: snapshotError.message },
      { status: 500 },
    );
  }

  return {
    success: true,
    mode: "simulated" as const,
    completedJobs,
    revenue: simulatedRevenue,
    message:
      "QuickBooks not connected. Financial data is estimated from completed jobs.",
  };
}

// ---------------------------------------------------------------------------
// Live QB Sync
// ---------------------------------------------------------------------------

async function runQuickBooksSync(
  realmId: string,
  userId: string,
) {
  const supabase = createAdminClient();

  const now = new Date();
  const monthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  );
  const monthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  );

  const startDate = monthStart.toISOString().slice(0, 10);
  const endDate = monthEnd.toISOString().slice(0, 10);

  const plResult = await qbApiRequest<{
    Header?: {
      StartPeriod?: string;
      EndPeriod?: string;
    };
    Rows?: {
      Row?: Array<{
        Summary?: {
          ColData?: Array<{ value?: string }>;
        };
      }>;
    };
  }>(realmId, "/reports/ProfitAndLoss", {
    query: {
      start_date: startDate,
      end_date: endDate,
      minorversion: "65",
    },
  });

  const invoiceResult = await qbApiRequest<{
    QueryResponse?: {
      Invoice?: Array<{
        Id: string;
        Balance: number;
        DueDate: string;
        TotalAmt: number;
        TxnDate: string;
      }>;
    };
  }>(realmId, "/query", {
    query: {
      query: `SELECT * FROM Invoice WHERE TxnDate >= '${startDate}' AND TxnDate <= '${endDate}' MAXRESULTS 1000`,
      minorversion: "65",
    },
  });

  let totalRevenue = 0;
  let outstanding = 0;
  let overdue = 0;

  if (plResult.success && plResult.data?.Rows?.Row) {
    const rows = plResult.data.Rows.Row;
    for (const row of rows) {
      if (row.Summary?.ColData) {
        const value = parseFloat(
          row.Summary.ColData[1]?.value ?? "0",
        );
        if (!Number.isNaN(value)) {
          totalRevenue = value;
        }
      }
    }
  }

  if (
    invoiceResult.success &&
    invoiceResult.data?.QueryResponse?.Invoice
  ) {
    const invoices = invoiceResult.data.QueryResponse.Invoice;
    const today = now.toISOString().slice(0, 10);

    for (const invoice of invoices) {
      if (invoice.Balance > 0) {
        outstanding += invoice.Balance;
        if (invoice.DueDate && invoice.DueDate < today) {
          overdue += invoice.Balance;
        }
      }
    }
  }

  const paid = Math.max(0, totalRevenue - outstanding);

  const { error: snapshotError } = await supabase
    .from("financial_snapshots")
    .upsert(
      {
        period_start: startDate,
        period_end: endDate,
        total_revenue: totalRevenue,
        outstanding_invoices: outstanding,
        overdue_invoices: overdue,
        paid_invoices: paid,
        source: "quickbooks",
        source_payload: {
          mode: "live",
          realmId,
          requestedBy: userId,
          syncedAt: now.toISOString(),
          plSuccess: plResult.success,
          invoiceSuccess: invoiceResult.success,
          invoiceCount: invoiceResult.success
            ? (invoiceResult.data?.QueryResponse?.Invoice
                ?.length ?? 0)
            : 0,
          ...(!plResult.success
            ? { plError: (plResult as QBApiError).error }
            : {}),
          ...(!invoiceResult.success
            ? {
                invoiceError: (invoiceResult as QBApiError)
                  .error,
              }
            : {}),
        },
      },
      { onConflict: "period_start,period_end,source" },
    );

  if (snapshotError) {
    return NextResponse.json(
      { error: snapshotError.message },
      { status: 500 },
    );
  }

  await supabase
    .from("quickbooks_credentials")
    .update({
      last_sync_at: now.toISOString(),
      last_sync_error: null,
    })
    .eq("realm_id", realmId)
    .eq("is_active", true);

  return {
    success: true,
    mode: "live" as const,
    revenue: totalRevenue,
    outstanding,
    overdue,
    paid,
    period: { start: startDate, end: endDate },
    dataSources: {
      profitAndLoss: plResult.success ? "ok" : "error",
      invoices: invoiceResult.success ? "ok" : "error",
    },
  };
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const auth = await authorizeAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status },
    );
  }

  try {
    let body: {
      action?: string;
      confirm?: boolean;
      report_ids?: string[];
      report_id?: string;
    } = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const action = body.action ?? "sync";
    const confirm = body.confirm === true;

    switch (action) {
      case "connect": {
        if (!isQBConfigured()) {
          return NextResponse.json(
            {
              error:
                "QuickBooks integration is not configured. Required environment variables are missing.",
              hint: "Set QUICKBOOKS_CLIENT_ID, QUICKBOOKS_CLIENT_SECRET, QUICKBOOKS_REDIRECT_URI, and QUICKBOOKS_ENCRYPTION_KEY.",
            },
            { status: 503 },
          );
        }

        // Prevent duplicate OAuth initiations
        const connectDedup = guardIdempotency(
          idempotencyKey("qb-connect", auth.userId),
          { ttlMs: 30_000 },
        );
        if (connectDedup.isDuplicate) {
          return connectDedup.replay;
        }

        const { authUrl, state } = initQBOAuth();
        const cookieStore = await cookies();
        cookieStore.set("qb_oauth_state", state, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 600,
          path: "/",
        });

        const connectResponse = {
          success: true,
          authUrl,
          message:
            "Redirect the user to authUrl to begin QuickBooks authorization.",
        };

        commitIdempotency(
          idempotencyKey("qb-connect", auth.userId),
          200,
          connectResponse,
        );

        return NextResponse.json(connectResponse);
      }

      case "disconnect": {
        const status = await getQBConnectionStatus();
        if (!status.connected || !status.realmId) {
          return NextResponse.json({
            success: true,
            message: "QuickBooks is not connected.",
          });
        }

        const revokeResult = await revokeQBTokens(
          status.realmId,
        );
        if (!revokeResult.success) {
          return NextResponse.json(
            {
              error:
                revokeResult.error ??
                "Failed to disconnect QuickBooks.",
            },
            { status: 500 },
          );
        }

        return NextResponse.json({
          success: true,
          message: "QuickBooks disconnected successfully.",
        });
      }

      case "sync": {
        // Prevent duplicate syncs within 60s
        const syncKey = idempotencyKey(
          "qb-sync",
          auth.userId,
        );
        const syncDedup = guardIdempotency(syncKey);
        if (syncDedup.isDuplicate) {
          return syncDedup.replay;
        }

        const status = await getQBConnectionStatus();

        let result:
          | Awaited<ReturnType<typeof runSimulatedSync>>
          | Awaited<ReturnType<typeof runQuickBooksSync>>;

        if (!status.connected || !status.realmId) {
          result = await runSimulatedSync(auth.userId);
        } else {
          try {
            result = await runQuickBooksSync(
              status.realmId,
              auth.userId,
            );
          } catch (syncError) {
            const supabase = createAdminClient();
            await supabase
              .from("quickbooks_credentials")
              .update({
                last_sync_error:
                  syncError instanceof Error
                    ? syncError.message
                    : "Unknown sync error",
              })
              .eq("realm_id", status.realmId);

            result = await runSimulatedSync(auth.userId);
          }
        }

        // If runSimulatedSync or runQuickBooksSync returned a NextResponse
        // (error case), pass it through directly
        if (result instanceof NextResponse) {
          return result;
        }

        commitIdempotency(syncKey, 200, result);
        return NextResponse.json(result);
      }

      case "sync_customers": {
        const status = await getQBConnectionStatus();
        if (!status.connected || !status.realmId) {
          return NextResponse.json(
            {
              error:
                "QuickBooks is not connected. Connect first using the 'connect' action.",
              hint: "POST with { action: 'connect' } to begin OAuth flow.",
            },
            { status: 400 },
          );
        }

        if (!confirm) {
          const preview = await syncCustomersToQB(
            status.realmId,
            auth.userId,
            false,
          );
          return NextResponse.json({
            message:
              "This is a preview. No changes were made to QuickBooks. Send { confirm: true } to execute.",
            ...preview,
          });
        }

        const result = await syncCustomersToQB(
          status.realmId,
          auth.userId,
          true,
        );
        return NextResponse.json(result);
      }

      case "sync_vendors": {
        const status = await getQBConnectionStatus();
        if (!status.connected || !status.realmId) {
          return NextResponse.json(
            {
              error:
                "QuickBooks is not connected. Connect first using the 'connect' action.",
              hint: "POST with { action: 'connect' } to begin OAuth flow.",
            },
            { status: 400 },
          );
        }

        if (!confirm) {
          const preview = await syncVendorsToQB(
            status.realmId,
            auth.userId,
            false,
          );
          return NextResponse.json({
            message:
              "This is a preview. No changes were made to QuickBooks. Send { confirm: true } to execute.",
            ...preview,
          });
        }

        const result = await syncVendorsToQB(
          status.realmId,
          auth.userId,
          true,
        );
        return NextResponse.json(result);
      }

      case "generate_invoices": {
        const status = await getQBConnectionStatus();
        if (!status.connected || !status.realmId) {
          return NextResponse.json(
            {
              error:
                "QuickBooks is not connected. Connect first using the 'connect' action.",
              hint: "POST with { action: 'connect' } to begin OAuth flow.",
            },
            { status: 400 },
          );
        }

        const reportIds = body.report_ids;

        if (!confirm) {
          const preview =
            await generateInvoicesFromReports(
              status.realmId,
              auth.userId,
              false,
              reportIds,
            );
          return NextResponse.json({
            message:
              "This is a preview. No invoices were created in QuickBooks. Send { confirm: true } to execute.",
            ...preview,
          });
        }

        const result = await generateInvoicesFromReports(
          status.realmId,
          auth.userId,
          true,
          reportIds,
        );
        return NextResponse.json(result);
      }

      case "generate_invoice": {
        const status = await getQBConnectionStatus();
        if (!status.connected || !status.realmId) {
          return NextResponse.json(
            {
              error: "QuickBooks is not connected.",
              hint: "POST with { action: 'connect' } to begin OAuth flow.",
            },
            { status: 400 },
          );
        }

        const reportId = body.report_id;
        if (!reportId) {
          return NextResponse.json(
            {
              error:
                "Missing report_id. Specify the completion report to invoice.",
            },
            { status: 400 },
          );
        }

        if (!confirm) {
          const preview = await generateSingleInvoice(
            status.realmId,
            auth.userId,
            reportId,
            false,
          );
          return NextResponse.json({
            message:
              "Preview only. Send { confirm: true } to create the invoice.",
            ...preview,
          });
        }

        const result = await generateSingleInvoice(
          status.realmId,
          auth.userId,
          reportId,
          true,
        );
        return NextResponse.json(result);
      }

      case "invoice_summary": {
        const summary = await getInvoiceSyncSummary();
        return NextResponse.json({
          success: true,
          ...summary,
        });
      }

      case "sync_status": {
        const syncStatus = await getSyncStatus();
        return NextResponse.json({
          success: true,
          ...syncStatus,
        });
      }

      case "status": {
        const status = await getQBConnectionStatus();
        return NextResponse.json({
          success: true,
          ...status,
        });
      }

      default:
        return NextResponse.json(
          {
            error: `Unknown action: ${action}. Valid actions: connect, disconnect, sync, sync_customers, sync_vendors, generate_invoices, generate_invoice, invoice_summary, sync_status, status.`,
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("[quickbooks-sync] Unhandled error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error.",
      },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------

export async function GET() {
  const auth = await authorizeAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status },
    );
  }

  try {
    const [connectionStatus, syncStatus, invoiceSummary] =
      await Promise.all([
        getQBConnectionStatus(),
        getSyncStatus(),
        getInvoiceSyncSummary(),
      ]);
    return NextResponse.json({
      success: true,
      connection: connectionStatus,
      sync: syncStatus,
      invoices: invoiceSummary,
    });
  } catch (error) {
    console.error(
      "[quickbooks-sync] GET unhandled error:",
      error,
    );
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error.",
      },
      { status: 500 },
    );
  }
}
