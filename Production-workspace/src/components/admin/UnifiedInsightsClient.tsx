"use client";

import { useCallback, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type DashboardTab = "overview" | "operations" | "quality" | "financials" | "inventory";

type RangeOption = "week" | "month" | "quarter" | "year";

type OverviewMetrics = {
  totalJobs: number;
  completedJobs: number;
  activeJobs: number;
  openIssues: number;
  qaApproved: number;
  qaFlagged: number;
  newLeads: number;
  wonLeads: number;
  quotedLeads: number;
  revenueTotal: number;
  outstandingTotal: number;
  overdueTotal: number;
  inventoryLowStockCount: number;
  supplyRequestsOpen: number;
};

const tabs: { key: DashboardTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "operations", label: "Operations" },
  { key: "quality", label: "Quality" },
  { key: "financials", label: "Financials" },
  { key: "inventory", label: "Inventory" },
];

const rangeOptions: { key: RangeOption; label: string; days: number }[] = [
  { key: "week", label: "This Week", days: 7 },
  { key: "month", label: "This Month", days: 30 },
  { key: "quarter", label: "This Quarter", days: 90 },
  { key: "year", label: "This Year", days: 365 },
];

function startIsoForRange(range: RangeOption) {
  const days = rangeOptions.find((option) => option.key === range)?.days ?? 30;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export function UnifiedInsightsClient() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [range, setRange] = useState<RangeOption>("month");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [jobsPerClient, setJobsPerClient] = useState<{ client: string; count: number }[]>([]);
  const [issuesByStatus, setIssuesByStatus] = useState<{ status: string; count: number }[]>([]);
  const [invoiceAging, setInvoiceAging] = useState<{ bucket: string; amount: number }[]>([]);
  const [supplyAlerts, setSupplyAlerts] = useState<{ name: string; current: number; threshold: number }[]>([]);

  const conversionRate = useMemo(() => {
    if (!metrics || metrics.newLeads === 0) {
      return 0;
    }
    return Math.round((metrics.wonLeads / metrics.newLeads) * 100);
  }, [metrics]);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setErrorText(null);

    try {
      const supabase = createClient();
      const startIso = startIsoForRange(range);

      const [
        jobsResult,
        leadsResult,
        issuesResult,
        snapshotsResult,
        invoicesResult,
        suppliesResult,
        requestsResult,
      ] = await Promise.all([
        supabase
          .from("jobs")
          .select("id, status, qa_status, client_id, clients:client_id(company_name), created_at")
          .gte("created_at", startIso),
        supabase.from("leads").select("id, status, created_at").gte("created_at", startIso),
        supabase.from("issue_reports").select("id, status, created_at").gte("created_at", startIso),
        supabase
          .from("financial_snapshots")
          .select("id, total_revenue, outstanding_invoices, overdue_invoices, created_at")
          .order("created_at", { ascending: false })
          .limit(1),
        supabase
          .from("quickbooks_invoice_cache")
          .select("id, amount_due, amount_total, status, due_date")
          .order("due_date", { ascending: true })
          .limit(500),
        supabase
          .from("supplies")
          .select("id, name, current_stock, reorder_threshold")
          .eq("is_active", true)
          .order("name", { ascending: true }),
        supabase
          .from("supply_requests")
          .select("id, status")
          .in("status", ["requested", "approved"]),
      ]);

      if (jobsResult.error || leadsResult.error || issuesResult.error || snapshotsResult.error || invoicesResult.error || suppliesResult.error || requestsResult.error) {
        throw new Error(
          jobsResult.error?.message ||
            leadsResult.error?.message ||
            issuesResult.error?.message ||
            snapshotsResult.error?.message ||
            invoicesResult.error?.message ||
            suppliesResult.error?.message ||
            requestsResult.error?.message ||
            "Failed loading dashboard metrics.",
        );
      }

      const jobs = jobsResult.data ?? [];
      const leads = leadsResult.data ?? [];
      const issues = issuesResult.data ?? [];
      const latestSnapshot = snapshotsResult.data?.[0] ?? null;
      const invoices = invoicesResult.data ?? [];
      const supplies = suppliesResult.data ?? [];
      const openRequests = requestsResult.data ?? [];

      const jobsPerClientMap = new Map<string, number>();
      for (const job of jobs) {
        const clientName = job.clients?.[0]?.company_name || "Unlinked client";
        jobsPerClientMap.set(clientName, (jobsPerClientMap.get(clientName) ?? 0) + 1);
      }

      const issuesByStatusMap = new Map<string, number>();
      for (const issue of issues) {
        issuesByStatusMap.set(issue.status, (issuesByStatusMap.get(issue.status) ?? 0) + 1);
      }

      const now = new Date();
      const aging = {
        "0-30 days": 0,
        "31-60 days": 0,
        "61-90 days": 0,
        "90+ days": 0,
      };

      for (const invoice of invoices) {
        if (invoice.amount_due <= 0 || !invoice.due_date) {
          continue;
        }

        const daysPastDue = Math.floor((now.getTime() - new Date(invoice.due_date).getTime()) / (1000 * 60 * 60 * 24));
        if (daysPastDue <= 30) {
          aging["0-30 days"] += Number(invoice.amount_due);
        } else if (daysPastDue <= 60) {
          aging["31-60 days"] += Number(invoice.amount_due);
        } else if (daysPastDue <= 90) {
          aging["61-90 days"] += Number(invoice.amount_due);
        } else {
          aging["90+ days"] += Number(invoice.amount_due);
        }
      }

      const lowStock = supplies.filter((supply) => Number(supply.current_stock) <= Number(supply.reorder_threshold));

      setMetrics({
        totalJobs: jobs.length,
        completedJobs: jobs.filter((job) => job.status === "completed").length,
        activeJobs: jobs.filter((job) => ["scheduled", "en_route", "in_progress"].includes(job.status)).length,
        openIssues: issues.filter((issue) => issue.status !== "resolved").length,
        qaApproved: jobs.filter((job) => job.qa_status === "approved").length,
        qaFlagged: jobs.filter((job) => ["flagged", "needs_rework"].includes(job.qa_status)).length,
        newLeads: leads.filter((lead) => lead.status === "new").length,
        wonLeads: leads.filter((lead) => lead.status === "won").length,
        quotedLeads: leads.filter((lead) => lead.status === "quoted").length,
        revenueTotal: Number(latestSnapshot?.total_revenue ?? 0),
        outstandingTotal: Number(latestSnapshot?.outstanding_invoices ?? 0),
        overdueTotal: Number(latestSnapshot?.overdue_invoices ?? 0),
        inventoryLowStockCount: lowStock.length,
        supplyRequestsOpen: openRequests.length,
      });

      setJobsPerClient([...jobsPerClientMap.entries()].map(([client, count]) => ({ client, count })).sort((a, b) => b.count - a.count));
      setIssuesByStatus([...issuesByStatusMap.entries()].map(([status, count]) => ({ status, count })));
      setInvoiceAging(Object.entries(aging).map(([bucket, amount]) => ({ bucket, amount })));
      setSupplyAlerts(lowStock.map((supply) => ({ name: supply.name, current: Number(supply.current_stock), threshold: Number(supply.reorder_threshold) })));
      setLastSyncedAt(latestSnapshot?.created_at ?? null);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed loading unified dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, [range]);

  const exportCurrentView = () => {
    if (!metrics) {
      return;
    }

    const rows: string[] = [];
    if (activeTab === "overview") {
      rows.push("metric,value");
      rows.push(`total_jobs,${metrics.totalJobs}`);
      rows.push(`completed_jobs,${metrics.completedJobs}`);
      rows.push(`active_jobs,${metrics.activeJobs}`);
      rows.push(`open_issues,${metrics.openIssues}`);
      rows.push(`new_leads,${metrics.newLeads}`);
      rows.push(`won_leads,${metrics.wonLeads}`);
      rows.push(`conversion_rate_percent,${conversionRate}`);
      rows.push(`revenue_total,${metrics.revenueTotal}`);
      rows.push(`outstanding_total,${metrics.outstandingTotal}`);
      rows.push(`overdue_total,${metrics.overdueTotal}`);
    } else if (activeTab === "operations") {
      rows.push("client,jobs");
      for (const row of jobsPerClient) {
        rows.push(`"${row.client.replaceAll('"', '""')}",${row.count}`);
      }
    } else if (activeTab === "quality") {
      rows.push("issue_status,count");
      for (const row of issuesByStatus) {
        rows.push(`${row.status},${row.count}`);
      }
    } else if (activeTab === "financials") {
      rows.push("aging_bucket,amount_due");
      for (const row of invoiceAging) {
        rows.push(`"${row.bucket}",${row.amount}`);
      }
    } else {
      rows.push("supply,current_stock,reorder_threshold");
      for (const row of supplyAlerts) {
        rows.push(`"${row.name.replaceAll('"', '""')}",${row.current},${row.threshold}`);
      }
    }

    const csvBlob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(csvBlob);
    link.download = `aa-dashboard-${activeTab}-${range}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 md:text-xl">Unified Insights Dashboard</h2>
          <p className="text-sm text-slate-600">Operations, quality, financial, and inventory insights in one view.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={range}
            onChange={(event) => setRange(event.target.value as RangeOption)}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            {rangeOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            disabled={isLoading}
            className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Loading..." : "Refresh"}
          </button>
          <button
            type="button"
            onClick={exportCurrentView}
            disabled={!metrics}
            className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded px-3 py-1.5 text-sm font-medium ${
              activeTab === tab.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {lastSyncedAt ? (
        <p className="mb-3 text-xs text-slate-500">Financial snapshot synced: {new Date(lastSyncedAt).toLocaleString()}</p>
      ) : (
        <p className="mb-3 text-xs text-amber-700">No financial snapshot yet. Use QuickBooks sync endpoint or manual snapshot inserts.</p>
      )}

      {errorText ? <p className="mb-3 text-sm text-rose-600">{errorText}</p> : null}

      {metrics ? (
        <>
          {activeTab === "overview" ? (
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
              <MetricCard label="Total Jobs" value={metrics.totalJobs} />
              <MetricCard label="Completed Jobs" value={metrics.completedJobs} />
              <MetricCard label="Active Jobs" value={metrics.activeJobs} />
              <MetricCard label="Open Issues" value={metrics.openIssues} />
              <MetricCard label="New Leads" value={metrics.newLeads} />
              <MetricCard label="Won Leads" value={metrics.wonLeads} />
              <MetricCard label="Conversion Rate" value={`${conversionRate}%`} />
              <MetricCard label="Revenue" value={`$${metrics.revenueTotal.toFixed(2)}`} />
              <MetricCard label="Outstanding" value={`$${metrics.outstandingTotal.toFixed(2)}`} />
              <MetricCard label="Overdue" value={`$${metrics.overdueTotal.toFixed(2)}`} />
              <MetricCard label="Low Stock Items" value={metrics.inventoryLowStockCount} />
              <MetricCard label="Open Supply Requests" value={metrics.supplyRequestsOpen} />
            </div>
          ) : null}

          {activeTab === "operations" ? (
            <SimpleTable
              title="Jobs by Client"
              headers={["Client", "Jobs"]}
              rows={jobsPerClient.map((row) => [row.client, String(row.count)])}
            />
          ) : null}

          {activeTab === "quality" ? (
            <SimpleTable
              title="Issue Distribution"
              headers={["Status", "Count"]}
              rows={issuesByStatus.map((row) => [row.status, String(row.count)])}
            />
          ) : null}

          {activeTab === "financials" ? (
            <SimpleTable
              title="Invoice Aging"
              headers={["Aging Bucket", "Amount Due"]}
              rows={invoiceAging.map((row) => [row.bucket, `$${row.amount.toFixed(2)}`])}
            />
          ) : null}

          {activeTab === "inventory" ? (
            <SimpleTable
              title="Low Stock Alerts"
              headers={["Supply", "Current", "Threshold"]}
              rows={supplyAlerts.map((row) => [row.name, String(row.current), String(row.threshold)])}
            />
          ) : null}
        </>
      ) : (
        <p className="text-sm text-slate-500">Click Refresh to load dashboard metrics.</p>
      )}
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="rounded border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
    </article>
  );
}

function SimpleTable({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded border border-slate-200">
      <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{title}</div>
      <table className="w-full text-left text-sm">
        <thead className="bg-white">
          <tr>
            {headers.map((header) => (
              <th key={header} className="border-b border-slate-200 px-3 py-2 font-medium text-slate-600">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-3 py-3 text-slate-500" colSpan={headers.length}>
                No rows in selected range.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={`${row.join("-")}-${index}`} className="odd:bg-white even:bg-slate-50">
                {row.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`} className="px-3 py-2 text-slate-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}