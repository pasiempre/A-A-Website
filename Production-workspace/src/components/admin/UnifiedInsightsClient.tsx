"use client";

import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type DashboardTab =
  | "overview"
  | "operations"
  | "quality"
  | "financials"
  | "hiring"
  | "inventory";

type RangeOption = "week" | "month" | "quarter" | "year";

type OverviewMetrics = {
  totalJobs: number;
  completedJobs: number;
  activeJobs: number;
  completionRate: number;
  qaApproved: number;
  qaFlagged: number;
  qaReworked: number;
  qaApprovalRate: number;
  openIssues: number;
  resolvedIssues: number;
  newLeads: number;
  wonLeads: number;
  quotedLeads: number;
  lostLeads: number;
  conversionRate: number;
  revenueTotal: number;
  outstandingTotal: number;
  overdueTotal: number;
  newApplications: number;
  inReviewApplications: number;
  interviewScheduled: number;
  hiredCount: number;
  inventoryLowStockCount: number;
  supplyRequestsOpen: number;
  notificationsSent: number;
  notificationsFailed: number;
  notificationsQueued: number;
  completionReportsGenerated: number;
  schedulingConflicts: number;
};

type TrendDirection = "up" | "down" | "flat";

type TrendMetric = {
  current: number;
  previous: number;
  direction: TrendDirection;
  percentChange: number;
};

type CrewUtilization = {
  employeeId: string;
  employeeName: string;
  jobCount: number;
  totalHours: number;
  conflictCount: number;
};

type JobsByClient = { client: string; count: number; revenue: number };
type IssuesByStatus = { status: string; count: number };
type InvoiceAging = { bucket: string; amount: number; count: number };
type SupplyAlert = {
  name: string;
  current: number;
  threshold: number;
  deficit: number;
};
type HiringFunnel = { status: string; label: string; count: number };

const TABS: { key: DashboardTab; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "operations", label: "Operations", icon: "🔧" },
  { key: "quality", label: "Quality", icon: "✅" },
  { key: "financials", label: "Financials", icon: "💰" },
  { key: "hiring", label: "Hiring", icon: "👥" },
  { key: "inventory", label: "Inventory", icon: "📦" },
];

const RANGE_OPTIONS: { key: RangeOption; label: string; days: number }[] = [
  { key: "week", label: "This Week", days: 7 },
  { key: "month", label: "This Month", days: 30 },
  { key: "quarter", label: "This Quarter", days: 90 },
  { key: "year", label: "This Year", days: 365 },
];

const HIRING_STATUS_ORDER: { key: string; label: string }[] = [
  { key: "new", label: "New" },
  { key: "reviewed", label: "Reviewed" },
  { key: "interview_scheduled", label: "Interview Scheduled" },
  { key: "interviewed", label: "Interviewed" },
  { key: "hired", label: "Hired" },
  { key: "rejected", label: "Rejected" },
  { key: "withdrawn", label: "Withdrawn" },
];

function startIsoForRange(range: RangeOption): string {
  const days = RANGE_OPTIONS.find((o) => o.key === range)?.days ?? 30;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function previousRangeIso(range: RangeOption): {
  start: string;
  end: string;
} {
  const days = RANGE_OPTIONS.find((o) => o.key === range)?.days ?? 30;
  return {
    start: new Date(Date.now() - days * 2 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
  };
}

function computeTrend(current: number, previous: number): TrendMetric {
  if (previous === 0 && current === 0) {
    return { current, previous, direction: "flat", percentChange: 0 };
  }
  if (previous === 0) {
    return { current, previous, direction: "up", percentChange: 100 };
  }

  const pct = Math.round(((current - previous) / previous) * 100);
  return {
    current,
    previous,
    direction: pct > 0 ? "up" : pct < 0 ? "down" : "flat",
    percentChange: Math.abs(pct),
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

function detectJobOverlaps(
  assignments: Array<{
    employee_id: string;
    jobs:
      | {
          scheduled_start: string | null;
          scheduled_end: string | null;
        }
      | Array<{
          scheduled_start: string | null;
          scheduled_end: string | null;
        }>
      | null;
  }>,
): Map<string, number> {
  const employeeTimeslots = new Map<string, Array<{ start: Date; end: Date }>>();

  for (const assignment of assignments) {
    const jobData = Array.isArray(assignment.jobs)
      ? (assignment.jobs[0] ?? null)
      : assignment.jobs;
    if (!jobData?.scheduled_start) continue;

    const start = new Date(jobData.scheduled_start);
    const end = jobData.scheduled_end
      ? new Date(jobData.scheduled_end)
      : new Date(start.getTime() + 4 * 60 * 60 * 1000);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) continue;

    const existing = employeeTimeslots.get(assignment.employee_id) ?? [];
    existing.push({ start, end });
    employeeTimeslots.set(assignment.employee_id, existing);
  }

  const conflictCounts = new Map<string, number>();

  for (const [employeeId, slots] of employeeTimeslots) {
    if (slots.length < 2) continue;

    const sorted = [...slots].sort((a, b) => a.start.getTime() - b.start.getTime());

    let overlaps = 0;
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].end > sorted[i + 1].start) {
        overlaps++;
      }
    }

    if (overlaps > 0) {
      conflictCounts.set(employeeId, overlaps);
    }
  }

  return conflictCounts;
}

export function UnifiedInsightsClient() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [range, setRange] = useState<RangeOption>("month");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [trends, setTrends] = useState<{
    jobs: TrendMetric;
    leads: TrendMetric;
    revenue: TrendMetric;
    applications: TrendMetric;
  } | null>(null);
  const [jobsByClient, setJobsByClient] = useState<JobsByClient[]>([]);
  const [crewUtilization, setCrewUtilization] = useState<CrewUtilization[]>([]);
  const [issuesByStatus, setIssuesByStatus] = useState<IssuesByStatus[]>([]);
  const [invoiceAging, setInvoiceAging] = useState<InvoiceAging[]>([]);
  const [supplyAlerts, setSupplyAlerts] = useState<SupplyAlert[]>([]);
  const [hiringFunnel, setHiringFunnel] = useState<HiringFunnel[]>([]);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setErrorText(null);

    try {
      const supabase = createClient();
      const startIso = startIsoForRange(range);
      const prev = previousRangeIso(range);

      const [
        jobsResult,
        prevJobsResult,
        leadsResult,
        prevLeadsResult,
        issuesResult,
        snapshotsResult,
        invoicesResult,
        suppliesResult,
        requestsResult,
        applicationsResult,
        prevApplicationsResult,
        assignmentsResult,
        notificationsResult,
        reportsResult,
      ] = await Promise.all([
        supabase
          .from("jobs")
          .select(
            "id, status, qa_status, client_id, scheduled_start, scheduled_end, clients:client_id(company_name), created_at",
          )
          .gte("created_at", startIso),
        supabase
          .from("jobs")
          .select("id, status, qa_status")
          .gte("created_at", prev.start)
          .lt("created_at", prev.end),
        supabase
          .from("leads")
          .select("id, status, created_at")
          .gte("created_at", startIso),
        supabase
          .from("leads")
          .select("id, status")
          .gte("created_at", prev.start)
          .lt("created_at", prev.end),
        supabase
          .from("issue_reports")
          .select("id, status, created_at")
          .gte("created_at", startIso),
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
        supabase.from("supply_requests").select("id, status").in("status", ["requested", "approved"]),
        supabase
          .from("employment_applications")
          .select("id, status, submitted_at")
          .gte("submitted_at", startIso),
        supabase
          .from("employment_applications")
          .select("id, status")
          .gte("submitted_at", prev.start)
          .lt("submitted_at", prev.end),
        supabase
          .from("job_assignments")
          .select(
            "id, employee_id, role, status, profiles:employee_id(full_name), jobs:job_id(scheduled_start, scheduled_end, created_at)",
          )
          .gte("created_at", startIso),
        supabase
          .from("notification_queue")
          .select("id, status")
          .gte("created_at", startIso),
        supabase
          .from("completion_reports")
          .select("id, status, auto_triggered")
          .gte("created_at", startIso),
      ]);

      const queryErrors: string[] = [];
      const results = [
        { name: "jobs", r: jobsResult },
        { name: "prevJobs", r: prevJobsResult },
        { name: "leads", r: leadsResult },
        { name: "prevLeads", r: prevLeadsResult },
        { name: "issues", r: issuesResult },
        { name: "snapshots", r: snapshotsResult },
        { name: "invoices", r: invoicesResult },
        { name: "supplies", r: suppliesResult },
        { name: "requests", r: requestsResult },
        { name: "applications", r: applicationsResult },
        { name: "prevApplications", r: prevApplicationsResult },
        { name: "assignments", r: assignmentsResult },
        { name: "notifications", r: notificationsResult },
        { name: "reports", r: reportsResult },
      ];

      for (const { name, r } of results) {
        if (r.error) queryErrors.push(`${name}: ${r.error.message}`);
      }

      if (jobsResult.error && leadsResult.error && issuesResult.error) {
        throw new Error(`Critical queries failed: ${queryErrors.join("; ")}`);
      }

      const jobs = (jobsResult.data ?? []) as unknown as Array<{
        id: string;
        status: string;
        qa_status: string;
        client_id: string | null;
        scheduled_start: string | null;
        scheduled_end: string | null;
        clients:
          | { company_name: string | null }
          | Array<{ company_name: string | null }>
          | null;
        created_at: string;
      }>;
      const prevJobs = (prevJobsResult.data ?? []) as Array<{
        id: string;
        status: string;
        qa_status: string;
      }>;
      const leads = (leadsResult.data ?? []) as Array<{
        id: string;
        status: string;
        created_at: string;
      }>;
      const prevLeads = (prevLeadsResult.data ?? []) as Array<{
        id: string;
        status: string;
      }>;
      const issues = (issuesResult.data ?? []) as Array<{
        id: string;
        status: string;
        created_at: string;
      }>;
      const latestSnapshot =
        (snapshotsResult.data?.[0] as {
          total_revenue: number;
          outstanding_invoices: number;
          overdue_invoices: number;
          created_at: string;
        } | null) ?? null;
      const invoices = (invoicesResult.data ?? []) as Array<{
        id: string;
        amount_due: number;
        amount_total: number;
        status: string;
        due_date: string | null;
      }>;
      const supplies = (suppliesResult.data ?? []) as Array<{
        id: string;
        name: string;
        current_stock: number;
        reorder_threshold: number;
      }>;
      const openRequests = requestsResult.data ?? [];
      const applications = (applicationsResult.data ?? []) as Array<{
        id: string;
        status: string;
        submitted_at: string;
      }>;
      const prevApplications = (prevApplicationsResult.data ?? []) as Array<{
        id: string;
        status: string;
      }>;
      const assignments = (assignmentsResult.data ?? []) as unknown as Array<{
        id: string;
        employee_id: string;
        role: string;
        status: string;
        profiles:
          | { full_name: string | null }
          | Array<{ full_name: string | null }>
          | null;
        jobs:
          | {
              scheduled_start: string | null;
              scheduled_end: string | null;
              created_at: string;
            }
          | Array<{
              scheduled_start: string | null;
              scheduled_end: string | null;
              created_at: string;
            }>
          | null;
      }>;
      const notifications = (notificationsResult.data ?? []) as Array<{
        id: string;
        status: string;
      }>;
      const reports = (reportsResult.data ?? []) as Array<{
        id: string;
        status: string;
        auto_triggered: boolean;
      }>;

      const completedJobs = jobs.filter((j) => j.status === "completed").length;
      const activeJobs = jobs.filter((j) => ["scheduled", "en_route", "in_progress"].includes(j.status)).length;
      const qaApproved = jobs.filter((j) => j.qa_status === "approved").length;
      const qaFlagged = jobs.filter((j) => ["flagged", "needs_rework"].includes(j.qa_status)).length;
      const qaReworked = jobs.filter((j) => j.qa_status === "needs_rework").length;
      const qaEligible = jobs.filter((j) => ["approved", "flagged", "needs_rework"].includes(j.qa_status)).length;
      const newLeads = leads.filter((l) => l.status === "new").length;
      const wonLeads = leads.filter((l) => l.status === "won").length;
      const quotedLeads = leads.filter((l) => l.status === "quoted").length;
      const lostLeads = leads.filter((l) => l.status === "lost").length;
      const resolvedIssues = issues.filter((i) => i.status === "resolved").length;
      const openIssues = issues.filter((i) => i.status !== "resolved").length;
      const newApps = applications.filter((a) => a.status === "new").length;
      const inReviewApps = applications.filter((a) => ["reviewed", "interview_scheduled", "interviewed"].includes(a.status)).length;
      const interviewApps = applications.filter((a) => a.status === "interview_scheduled").length;
      const hiredApps = applications.filter((a) => a.status === "hired").length;
      const lowStock = supplies.filter((s) => Number(s.current_stock) <= Number(s.reorder_threshold));

      const overlapCounts = detectJobOverlaps(assignments);
      let totalConflicts = 0;
      for (const count of overlapCounts.values()) {
        totalConflicts += count;
      }

      const crewMap = new Map<
        string,
        {
          name: string;
          jobCount: number;
          totalHours: number;
          conflictCount: number;
        }
      >();
      for (const assignment of assignments) {
        const profileData = Array.isArray(assignment.profiles)
          ? (assignment.profiles[0] ?? null)
          : assignment.profiles;
        const name = profileData?.full_name ?? "Unknown";
        const existing = crewMap.get(assignment.employee_id) ?? {
          name,
          jobCount: 0,
          totalHours: 0,
          conflictCount: overlapCounts.get(assignment.employee_id) ?? 0,
        };
        existing.jobCount++;

        const jobData = Array.isArray(assignment.jobs)
          ? (assignment.jobs[0] ?? null)
          : assignment.jobs;
        if (jobData?.scheduled_start && jobData?.scheduled_end) {
          const hours =
            (new Date(jobData.scheduled_end).getTime() -
              new Date(jobData.scheduled_start).getTime()) /
            (1000 * 60 * 60);
          if (hours > 0 && hours < 24) {
            existing.totalHours += hours;
          }
        }

        crewMap.set(assignment.employee_id, existing);
      }

      setMetrics({
        totalJobs: jobs.length,
        completedJobs,
        activeJobs,
        completionRate: jobs.length > 0 ? Math.round((completedJobs / jobs.length) * 100) : 0,
        qaApproved,
        qaFlagged,
        qaReworked,
        qaApprovalRate: qaEligible > 0 ? Math.round((qaApproved / qaEligible) * 100) : 0,
        openIssues,
        resolvedIssues,
        newLeads,
        wonLeads,
        quotedLeads,
        lostLeads,
        conversionRate: leads.length > 0 ? Math.round((wonLeads / leads.length) * 100) : 0,
        revenueTotal: Number(latestSnapshot?.total_revenue ?? 0),
        outstandingTotal: Number(latestSnapshot?.outstanding_invoices ?? 0),
        overdueTotal: Number(latestSnapshot?.overdue_invoices ?? 0),
        newApplications: newApps,
        inReviewApplications: inReviewApps,
        interviewScheduled: interviewApps,
        hiredCount: hiredApps,
        inventoryLowStockCount: lowStock.length,
        supplyRequestsOpen: openRequests.length,
        notificationsSent: notifications.filter((n) => n.status === "sent").length,
        notificationsFailed: notifications.filter((n) => ["failed", "permanently_failed"].includes(n.status)).length,
        notificationsQueued: notifications.filter((n) => n.status === "queued").length,
        completionReportsGenerated: reports.length,
        schedulingConflicts: totalConflicts,
      });

      setTrends({
        jobs: computeTrend(jobs.length, prevJobs.length),
        leads: computeTrend(leads.length, prevLeads.length),
        revenue: computeTrend(Number(latestSnapshot?.total_revenue ?? 0), 0),
        applications: computeTrend(applications.length, prevApplications.length),
      });

      const clientMap = new Map<string, { count: number; revenue: number }>();
      for (const job of jobs) {
        const clientData = Array.isArray(job.clients)
          ? (job.clients[0] ?? null)
          : job.clients;
        const clientName = clientData?.company_name ?? "Unlinked";
        const existing = clientMap.get(clientName) ?? { count: 0, revenue: 0 };
        existing.count++;
        clientMap.set(clientName, existing);
      }
      setJobsByClient(
        [...clientMap.entries()]
          .map(([client, data]) => ({
            client,
            count: data.count,
            revenue: data.revenue,
          }))
          .sort((a, b) => b.count - a.count),
      );

      setCrewUtilization(
        [...crewMap.entries()]
          .map(([employeeId, data]) => ({
            employeeId,
            employeeName: data.name,
            jobCount: data.jobCount,
            totalHours: Math.round(data.totalHours * 10) / 10,
            conflictCount: data.conflictCount,
          }))
          .sort((a, b) => b.totalHours - a.totalHours),
      );

      const issueMap = new Map<string, number>();
      for (const issue of issues) {
        issueMap.set(issue.status, (issueMap.get(issue.status) ?? 0) + 1);
      }
      setIssuesByStatus(
        [...issueMap.entries()]
          .map(([status, count]) => ({ status, count }))
          .sort((a, b) => b.count - a.count),
      );

      const now = new Date();
      const aging: Record<string, { amount: number; count: number }> = {
        Current: { amount: 0, count: 0 },
        "1-30 days": { amount: 0, count: 0 },
        "31-60 days": { amount: 0, count: 0 },
        "61-90 days": { amount: 0, count: 0 },
        "90+ days": { amount: 0, count: 0 },
      };

      for (const invoice of invoices) {
        if (Number(invoice.amount_due) <= 0 || !invoice.due_date) continue;
        const daysPastDue = Math.floor(
          (now.getTime() - new Date(invoice.due_date).getTime()) / (1000 * 60 * 60 * 24),
        );
        const bucket =
          daysPastDue <= 0
            ? "Current"
            : daysPastDue <= 30
              ? "1-30 days"
              : daysPastDue <= 60
                ? "31-60 days"
                : daysPastDue <= 90
                  ? "61-90 days"
                  : "90+ days";

        aging[bucket].amount += Number(invoice.amount_due);
        aging[bucket].count++;
      }
      setInvoiceAging(
        Object.entries(aging).map(([bucket, data]) => ({
          bucket,
          amount: data.amount,
          count: data.count,
        })),
      );

      setSupplyAlerts(
        lowStock
          .map((s) => ({
            name: s.name,
            current: Number(s.current_stock),
            threshold: Number(s.reorder_threshold),
            deficit: Number(s.reorder_threshold) - Number(s.current_stock),
          }))
          .sort((a, b) => b.deficit - a.deficit),
      );

      const hiringMap = new Map<string, number>();
      for (const app of applications) {
        hiringMap.set(app.status, (hiringMap.get(app.status) ?? 0) + 1);
      }
      setHiringFunnel(
        HIRING_STATUS_ORDER.map((s) => ({
          status: s.key,
          label: s.label,
          count: hiringMap.get(s.key) ?? 0,
        })),
      );

      setLastSyncedAt(latestSnapshot?.created_at ?? null);
      setLastRefreshedAt(new Date().toISOString());

      if (queryErrors.length > 0) {
        setErrorText(`Loaded with ${queryErrors.length} warning(s): ${queryErrors[0]}`);
      }
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Failed loading unified dashboard.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [range]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const exportCurrentView = () => {
    if (!metrics) return;

    const rows: string[] = [];

    switch (activeTab) {
      case "overview":
        rows.push("metric,value");
        rows.push(`total_jobs,${metrics.totalJobs}`);
        rows.push(`completed_jobs,${metrics.completedJobs}`);
        rows.push(`active_jobs,${metrics.activeJobs}`);
        rows.push(`completion_rate,${metrics.completionRate}%`);
        rows.push(`qa_approved,${metrics.qaApproved}`);
        rows.push(`qa_flagged,${metrics.qaFlagged}`);
        rows.push(`qa_approval_rate,${metrics.qaApprovalRate}%`);
        rows.push(`open_issues,${metrics.openIssues}`);
        rows.push(`new_leads,${metrics.newLeads}`);
        rows.push(`won_leads,${metrics.wonLeads}`);
        rows.push(`conversion_rate,${metrics.conversionRate}%`);
        rows.push(`revenue_total,${metrics.revenueTotal}`);
        rows.push(`outstanding_total,${metrics.outstandingTotal}`);
        rows.push(`overdue_total,${metrics.overdueTotal}`);
        rows.push(`new_applications,${metrics.newApplications}`);
        rows.push(`hired,${metrics.hiredCount}`);
        rows.push(`low_stock_items,${metrics.inventoryLowStockCount}`);
        rows.push(`notifications_sent,${metrics.notificationsSent}`);
        rows.push(`notifications_failed,${metrics.notificationsFailed}`);
        rows.push(`completion_reports,${metrics.completionReportsGenerated}`);
        rows.push(`scheduling_conflicts,${metrics.schedulingConflicts}`);
        break;
      case "operations":
        rows.push("client,jobs,revenue");
        for (const r of jobsByClient) {
          rows.push(`"${r.client.replaceAll('"', '""')}",${r.count},${r.revenue}`);
        }
        rows.push("");
        rows.push("employee,jobs,hours,conflicts");
        for (const c of crewUtilization) {
          rows.push(
            `"${c.employeeName.replaceAll('"', '""')}",${c.jobCount},${c.totalHours},${c.conflictCount}`,
          );
        }
        break;
      case "quality":
        rows.push("issue_status,count");
        for (const r of issuesByStatus) {
          rows.push(`${r.status},${r.count}`);
        }
        break;
      case "financials":
        rows.push("aging_bucket,amount_due,invoice_count");
        for (const r of invoiceAging) {
          rows.push(`"${r.bucket}",${r.amount.toFixed(2)},${r.count}`);
        }
        break;
      case "hiring":
        rows.push("pipeline_stage,count");
        for (const r of hiringFunnel) {
          rows.push(`"${r.label}",${r.count}`);
        }
        break;
      case "inventory":
        rows.push("supply,current_stock,reorder_threshold,deficit");
        for (const r of supplyAlerts) {
          rows.push(`"${r.name.replaceAll('"', '""')}",${r.current},${r.threshold},${r.deficit}`);
        }
        break;
    }

    const csvBlob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(csvBlob);
    link.download = `aa-insights-${activeTab}-${range}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <section className="mt-8 space-y-6">
      {/* ── Header ── */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 md:text-xl">
              Unified Insights Dashboard
            </h2>
            <p className="text-sm text-slate-600">
              Operations, quality, financial, hiring, and inventory insights in one view.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as RangeOption)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              {RANGE_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              disabled={isLoading}
              className="min-h-[36px] rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
            <button
              type="button"
              onClick={exportCurrentView}
              disabled={!metrics}
              className="min-h-[36px] rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
          {lastRefreshedAt && (
            <span>Refreshed: {new Date(lastRefreshedAt).toLocaleTimeString()}</span>
          )}
          {lastSyncedAt ? (
            <span>Financial sync: {new Date(lastSyncedAt).toLocaleString()}</span>
          ) : (
            <span className="text-amber-600">No financial snapshot — QB sync needed</span>
          )}
        </div>

        {errorText && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {errorText}
          </p>
        )}
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`min-h-[36px] rounded-full px-3 py-1.5 text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Loading State ── */}
      {isLoading && !metrics && (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">Loading dashboard...</p>
        </div>
      )}

      {/* ── Overview Tab ── */}
      {metrics && activeTab === "overview" && (
        <div className="space-y-6">
          {trends && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <TrendCard label="Jobs" value={String(metrics.totalJobs)} trend={trends.jobs} />
              <TrendCard
                label="Leads"
                value={String(leadsTotal(metrics))}
                trend={trends.leads}
              />
              <TrendCard
                label="Revenue"
                value={formatCurrency(metrics.revenueTotal)}
                trend={trends.revenue}
              />
              <TrendCard
                label="Applications"
                value={String(applicationsTotal(metrics))}
                trend={trends.applications}
              />
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <MetricCard
              label="Completed Jobs"
              value={metrics.completedJobs}
              subtitle={`${formatPercent(metrics.completionRate)} completion rate`}
            />
            <MetricCard label="Active Jobs" value={metrics.activeJobs} />
            <MetricCard
              label="QA Approval Rate"
              value={`${metrics.qaApprovalRate}%`}
              subtitle={`${metrics.qaApproved} approved, ${metrics.qaFlagged} flagged`}
              variant={metrics.qaApprovalRate >= 80 ? "success" : "warning"}
            />
            <MetricCard
              label="Open Issues"
              value={metrics.openIssues}
              subtitle={`${metrics.resolvedIssues} resolved`}
              variant={metrics.openIssues > 5 ? "warning" : "default"}
            />
            <MetricCard
              label="Lead Conversion"
              value={`${metrics.conversionRate}%`}
              subtitle={`${metrics.wonLeads} won / ${metrics.quotedLeads} quoted / ${metrics.lostLeads} lost`}
            />
            <MetricCard
              label="Outstanding"
              value={formatCurrency(metrics.outstandingTotal)}
              variant={metrics.overdueTotal > 0 ? "warning" : "default"}
            />
            <MetricCard
              label="Overdue"
              value={formatCurrency(metrics.overdueTotal)}
              variant={metrics.overdueTotal > 0 ? "danger" : "default"}
            />
            <MetricCard
              label="New Applications"
              value={metrics.newApplications}
              subtitle={`${metrics.hiredCount} hired`}
            />
            <MetricCard
              label="Low Stock Items"
              value={metrics.inventoryLowStockCount}
              subtitle={`${metrics.supplyRequestsOpen} open requests`}
              variant={metrics.inventoryLowStockCount > 0 ? "warning" : "default"}
            />
            <MetricCard
              label="SMS Sent"
              value={metrics.notificationsSent}
              subtitle={`${metrics.notificationsFailed} failed, ${metrics.notificationsQueued} queued`}
              variant={metrics.notificationsFailed > 0 ? "warning" : "default"}
            />
            <MetricCard
              label="Completion Reports"
              value={metrics.completionReportsGenerated}
            />
            <MetricCard
              label="Schedule Conflicts"
              value={metrics.schedulingConflicts}
              subtitle="Overlapping job assignments"
              variant={metrics.schedulingConflicts > 0 ? "danger" : "success"}
            />
          </div>
        </div>
      )}

      {/* ── Operations Tab ── */}
      {metrics && activeTab === "operations" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <DataTable
              title="Jobs by Client"
              headers={["Client", "Jobs"]}
              rows={jobsByClient.map((r) => [r.client, String(r.count)])}
              emptyText="No jobs in selected range."
            />
            <DataTable
              title="Crew Utilization"
              headers={["Employee", "Jobs", "Hours", "Conflicts"]}
              rows={crewUtilization.map((c) => [
                c.employeeName,
                String(c.jobCount),
                `${c.totalHours}h`,
                c.conflictCount > 0 ? `⚠ ${c.conflictCount}` : "—",
              ])}
              emptyText="No assignments in selected range."
            />
          </div>
        </div>
      )}

      {/* ── Quality Tab ── */}
      {metrics && activeTab === "quality" && (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="QA Approval Rate"
              value={`${metrics.qaApprovalRate}%`}
              variant={metrics.qaApprovalRate >= 80 ? "success" : "warning"}
            />
            <MetricCard label="Approved" value={metrics.qaApproved} variant="success" />
            <MetricCard
              label="Flagged / Rework"
              value={metrics.qaFlagged}
              subtitle={`${metrics.qaReworked} sent back for rework`}
              variant={metrics.qaFlagged > 0 ? "warning" : "default"}
            />
            <MetricCard
              label="Open Issues"
              value={metrics.openIssues}
              subtitle={`${metrics.resolvedIssues} resolved`}
              variant={metrics.openIssues > 5 ? "danger" : "default"}
            />
          </div>

          <DataTable
            title="Issues by Status"
            headers={["Status", "Count"]}
            rows={issuesByStatus.map((r) => [r.status, String(r.count)])}
            emptyText="No issues in selected range."
          />
        </div>
      )}

      {/* ── Financials Tab ── */}
      {metrics && activeTab === "financials" && (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label="Revenue" value={formatCurrency(metrics.revenueTotal)} />
            <MetricCard
              label="Outstanding"
              value={formatCurrency(metrics.outstandingTotal)}
              variant={metrics.outstandingTotal > 0 ? "warning" : "default"}
            />
            <MetricCard
              label="Overdue"
              value={formatCurrency(metrics.overdueTotal)}
              variant={metrics.overdueTotal > 0 ? "danger" : "default"}
            />
          </div>

          <DataTable
            title="Invoice Aging"
            headers={["Aging Bucket", "Amount Due", "Invoices"]}
            rows={invoiceAging.map((r) => [
              r.bucket,
              formatCurrency(r.amount),
              String(r.count),
            ])}
            emptyText="No invoice data available."
          />

          {!lastSyncedAt && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-sm text-amber-700">
                <strong>QuickBooks not connected.</strong> Financial data is from manual
                snapshots. Connect QuickBooks for real-time sync.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Hiring Tab ── */}
      {metrics && activeTab === "hiring" && (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="New Applications" value={metrics.newApplications} />
            <MetricCard label="In Review" value={metrics.inReviewApplications} />
            <MetricCard
              label="Interviews Scheduled"
              value={metrics.interviewScheduled}
            />
            <MetricCard label="Hired" value={metrics.hiredCount} variant="success" />
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-700">Hiring Pipeline</h3>
            </div>
            <div className="p-4">
              {hiringFunnel.length === 0 ? (
                <p className="text-sm text-slate-500">No applications in selected range.</p>
              ) : (
                <div className="space-y-2">
                  {hiringFunnel.map((stage) => {
                    const maxCount = Math.max(...hiringFunnel.map((s) => s.count), 1);
                    const widthPct = Math.max(
                      (stage.count / maxCount) * 100,
                      stage.count > 0 ? 8 : 0,
                    );

                    return (
                      <div key={stage.status} className="flex items-center gap-3">
                        <span className="w-36 shrink-0 text-right text-xs font-medium text-slate-600">
                          {stage.label}
                        </span>
                        <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-slate-100">
                          <div
                            className={`h-full rounded-md transition-all duration-500 ${
                              stage.status === "hired"
                                ? "bg-green-400"
                                : stage.status === "rejected" || stage.status === "withdrawn"
                                  ? "bg-red-300"
                                  : "bg-blue-400"
                            }`}
                            style={{ width: `${widthPct}%` }}
                          />
                          {stage.count > 0 && (
                            <span className="absolute inset-0 flex items-center px-2 text-xs font-semibold text-slate-800">
                              {stage.count}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3">
            <p className="text-sm text-blue-700">
              Manage applications in the{" "}
              <a href="/admin/hiring" className="font-medium underline hover:text-blue-900">
                Hiring Inbox
              </a>
              .
            </p>
          </div>
        </div>
      )}

      {/* ── Inventory Tab ── */}
      {metrics && activeTab === "inventory" && (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard
              label="Low Stock Items"
              value={metrics.inventoryLowStockCount}
              variant={metrics.inventoryLowStockCount > 0 ? "danger" : "success"}
            />
            <MetricCard
              label="Open Supply Requests"
              value={metrics.supplyRequestsOpen}
              variant={metrics.supplyRequestsOpen > 3 ? "warning" : "default"}
            />
            <MetricCard
              label="Total Alerts"
              value={supplyAlerts.length}
              subtitle="Items at or below reorder threshold"
            />
          </div>

          {supplyAlerts.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-700">Low Stock Alerts</h3>
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white">
                    <tr>
                      <th className="border-b border-slate-200 px-4 py-2 font-medium text-slate-600">
                        Supply
                      </th>
                      <th className="border-b border-slate-200 px-4 py-2 font-medium text-slate-600">
                        Current Stock
                      </th>
                      <th className="border-b border-slate-200 px-4 py-2 font-medium text-slate-600">
                        Reorder At
                      </th>
                      <th className="border-b border-slate-200 px-4 py-2 font-medium text-slate-600">
                        Deficit
                      </th>
                      <th className="border-b border-slate-200 px-4 py-2 font-medium text-slate-600">
                        Urgency
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplyAlerts.map((alert) => {
                      const urgency =
                        alert.current === 0
                          ? "critical"
                          : alert.deficit >= alert.threshold * 0.5
                            ? "high"
                            : "medium";

                      return (
                        <tr key={alert.name} className="odd:bg-white even:bg-slate-50">
                          <td className="px-4 py-2 font-medium text-slate-900">{alert.name}</td>
                          <td className="px-4 py-2 text-slate-700">{alert.current}</td>
                          <td className="px-4 py-2 text-slate-700">{alert.threshold}</td>
                          <td className="px-4 py-2 text-slate-700">
                            {alert.deficit > 0 ? `-${alert.deficit}` : "0"}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                urgency === "critical"
                                  ? "bg-red-100 text-red-800"
                                  : urgency === "high"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {urgency}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-2 p-4 md:hidden">
                {supplyAlerts.map((alert) => {
                  const urgency =
                    alert.current === 0
                      ? "critical"
                      : alert.deficit >= alert.threshold * 0.5
                        ? "high"
                        : "medium";

                  return (
                    <div
                      key={alert.name}
                      className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">{alert.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {alert.current} / {alert.threshold} (deficit: {alert.deficit > 0 ? alert.deficit : 0})
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          urgency === "critical"
                            ? "bg-red-100 text-red-800"
                            : urgency === "high"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {urgency}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
              <p className="text-sm font-medium text-green-700">
                ✅ All supplies are above reorder thresholds.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function leadsTotal(m: OverviewMetrics): number {
  return m.newLeads + m.wonLeads + m.quotedLeads + m.lostLeads;
}

function applicationsTotal(m: OverviewMetrics): number {
  return m.newApplications + m.inReviewApplications + m.hiredCount;
}

type MetricVariant = "default" | "success" | "warning" | "danger";

const VARIANT_STYLES: Record<MetricVariant, string> = {
  default: "border-slate-200 bg-slate-50",
  success: "border-green-200 bg-green-50",
  warning: "border-amber-200 bg-amber-50",
  danger: "border-red-200 bg-red-50",
};

const VARIANT_VALUE_STYLES: Record<MetricVariant, string> = {
  default: "text-slate-900",
  success: "text-green-800",
  warning: "text-amber-800",
  danger: "text-red-800",
};

function MetricCard({
  label,
  value,
  subtitle,
  variant = "default",
}: {
  label: string;
  value: string | number;
  subtitle?: string;
  variant?: MetricVariant;
}) {
  return (
    <article className={`rounded-lg border p-4 ${VARIANT_STYLES[variant]}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${VARIANT_VALUE_STYLES[variant]}`}>{value}</p>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </article>
  );
}

function TrendCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: TrendMetric;
}) {
  const arrow = trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→";
  const trendColor =
    trend.direction === "up"
      ? "text-green-600"
      : trend.direction === "down"
        ? "text-red-600"
        : "text-slate-400";

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      <div className="mt-2 flex items-center gap-1.5">
        <span className={`text-sm font-semibold ${trendColor}`}>
          {arrow} {trend.percentChange}%
        </span>
        <span className="text-xs text-slate-400">vs previous period</span>
      </div>
    </article>
  );
}

function DataTable({
  title,
  headers,
  rows,
  emptyText = "No data.",
}: {
  title: string;
  headers: string[];
  rows: string[][];
  emptyText?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-white">
            <tr>
              {headers.map((h) => (
                <th key={h} className="border-b border-slate-200 px-4 py-2 font-medium text-slate-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={headers.length}>
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={`row-${i}`} className="odd:bg-white even:bg-slate-50">
                  {row.map((cell, j) => (
                    <td
                      key={`cell-${i}-${j}`}
                      className={`px-4 py-2 text-slate-700 ${j === 0 ? "font-medium" : ""}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-2 p-4 md:hidden">
        {rows.length === 0 ? (
          <p className="text-xs text-slate-500">{emptyText}</p>
        ) : (
          rows.map((row, i) => (
            <div
              key={`mrow-${i}`}
              className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-3 py-2"
            >
              <span className="text-sm font-medium text-slate-800">{row[0]}</span>
              <div className="flex gap-3 text-xs text-slate-600">
                {row.slice(1).map((cell, j) => (
                  <span key={`mcell-${i}-${j}`}>
                    <span className="text-slate-400">{headers[j + 1]}: </span>
                    {cell}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}