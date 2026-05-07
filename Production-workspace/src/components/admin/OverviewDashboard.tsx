"use client";

import { useEffect, useState } from "react";
import type { ModuleId } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/client";

interface OverviewDashboardProps {
  onModuleSelect: (moduleId: ModuleId) => void;
}

interface LeadAlertItem {
  id: string;
  name: string;
  phone: string | null;
  createdAt: string;
}

interface QAPendingItem {
  id: string;
  jobId: string;
}

interface ScheduleItem {
  id: string;
  title: string;
  address: string;
  cleanType: string;
  scheduledDate: string | null;
  scheduledTime: string | null;
}

interface WaitingQuoteItem {
  id: string;
  name: string;
  companyName: string | null;
  updatedAt: string;
}

interface DashboardData {
  stats: {
    activeJobs: number;
    completedYesterday: number;
    unclaimedLeads: number;
    yesterdayValue: number;
    weeklyLeadConversion: number;
    weeklyQaPassRate: number;
  };
  leadAlerts: LeadAlertItem[];
  qaPending: QAPendingItem[];
  todaySchedule: ScheduleItem[];
  waitingQuotes: WaitingQuoteItem[];
  loading: boolean;
}

function DashboardSparkIcon() {
  return (
    <svg className="h-5 w-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.2 2.2M16.9 16.9l2.2 2.2M4.9 19.1l2.2-2.2M16.9 7.1l2.2-2.2" />
    </svg>
  );
}

function QuickToolIcon({ kind }: { kind: "job" | "quote" | "inventory" }) {
  if (kind === "job") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="7" y="4" width="10" height="16" rx="2" />
        <path d="M9 4.5h6" />
        <path d="M9 10h6M9 14h6" />
      </svg>
    );
  }

  if (kind === "quote") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    );
  }

  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="m4 7.5 8 4.5 8-4.5" />
    </svg>
  );
}

/**
 * F-01: Morning Briefing Dashboard
 * Replaces generic navigation with a prioritized daily action feed.
 */
export function OverviewDashboard({ onModuleSelect }: OverviewDashboardProps) {
  const [data, setData] = useState<DashboardData>({
    stats: {
      activeJobs: 0,
      completedYesterday: 0,
      unclaimedLeads: 0,
      yesterdayValue: 0,
      weeklyLeadConversion: 0,
      weeklyQaPassRate: 0,
    },
    leadAlerts: [],
    qaPending: [],
    todaySchedule: [],
    waitingQuotes: [],
    loading: true,
  });

  useEffect(() => {
    async function fetchMorningBriefing() {
      const supabase = createClient();
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - 7);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [
        leadsResult,
        jobsTodayResult,
        jobsYesterdayResult,
        qaPendingResult,
        todayScheduleResult,
        waitingQuotesResult,
        weeklyLeadsResult,
        weeklyQaJobsResult,
      ] = await Promise.all([
        // 1. Unclaimed Leads
        supabase
          .from("leads")
          .select("id, name, phone, created_at, status")
          .eq("status", "new")
          .order("created_at", { ascending: true }),

        // 2. Jobs Today
        supabase
          .from("jobs")
          .select("id", { count: "exact", head: true })
          .gte("scheduled_date", today.toISOString().split("T")[0])
          .lt("scheduled_date", tomorrow.toISOString().split("T")[0]),

        // 3. Completed Yesterday
        supabase
          .from("jobs")
          .select("id", { count: "exact", head: true })
          .eq("status", "completed")
          .gte("updated_at", yesterday.toISOString())
          .lt("updated_at", today.toISOString()),

        // 4. QA Pending (Jobs marked as completed but missing final QA)
        // Using job_assignments for checklist status
        supabase
          .from("job_assignments")
          .select("id, job_id, checklist_completed_at, status")
          .eq("status", "completed")
          .is("checklist_completed_at", null)
          .limit(10),

        // 5. Today's schedule
        supabase
          .from("jobs")
          .select("id, title, address, clean_type, scheduled_date, scheduled_time")
          .gte("scheduled_date", today.toISOString().split("T")[0])
          .lt("scheduled_date", tomorrow.toISOString().split("T")[0])
          .order("scheduled_time", { ascending: true }),

        // 6. Waiting on quote responses
        supabase
          .from("leads")
          .select("id, name, updated_at")
          .eq("status", "quoted")
          .order("updated_at", { ascending: true })
          .limit(10),

        // 7. Weekly lead conversion basis
        supabase
          .from("leads")
          .select("id, status")
          .gte("created_at", weekStart.toISOString()),

        // 8. Weekly QA pass-rate basis
        supabase
          .from("jobs")
          .select("id, qa_status")
          .gte("created_at", weekStart.toISOString()),
      ]);

      let activeJobs = jobsTodayResult.count || 0;
      if (jobsTodayResult.error) {
        const { count } = await supabase
          .from("jobs")
          .select("id", { count: "exact", head: true })
          .gte("scheduled_start", today.toISOString())
          .lt("scheduled_start", tomorrow.toISOString());
        activeJobs = count || 0;
      }

      let scheduleRows = (todayScheduleResult.data || []) as Array<{
        id: string;
        title: string;
        address: string;
        clean_type: string;
        scheduled_date: string | null;
        scheduled_time: string | null;
      }>;
      if (todayScheduleResult.error) {
        const fallbackSchedule = await supabase
          .from("jobs")
          .select("id, title, address, clean_type, scheduled_start")
          .gte("scheduled_start", today.toISOString())
          .lt("scheduled_start", tomorrow.toISOString())
          .order("scheduled_start", { ascending: true });

        scheduleRows = ((fallbackSchedule.data || []) as Array<{
          id: string;
          title: string;
          address: string;
          clean_type: string;
          scheduled_start: string | null;
        }>).map((job) => {
          const parsed = job.scheduled_start ? new Date(job.scheduled_start) : null;
          return {
            id: job.id,
            title: job.title,
            address: job.address,
            clean_type: job.clean_type,
            scheduled_date: parsed ? parsed.toISOString().slice(0, 10) : null,
            scheduled_time: parsed ? parsed.toISOString().slice(11, 16) : null,
          };
        });
      }

      const leadAlerts = ((leadsResult.data || []) as Array<{ id: string; name: string; phone: string | null; created_at: string }>)
        .filter((lead) => new Date(lead.created_at) < oneHourAgo)
        .map((lead) => ({
          id: lead.id,
          name: lead.name,
          phone: lead.phone,
          createdAt: lead.created_at,
        }));

      const qaPending = ((qaPendingResult.data || []) as Array<{ id: string; job_id: string }>).map((assignment) => ({
        id: assignment.id,
        jobId: assignment.job_id,
      }));

      const todaySchedule = (scheduleRows as Array<{
        id: string;
        title: string;
        address: string;
        clean_type: string;
        scheduled_date: string | null;
        scheduled_time: string | null;
      }>).map((job) => ({
        id: job.id,
        title: job.title,
        address: job.address,
        cleanType: job.clean_type,
        scheduledDate: job.scheduled_date,
        scheduledTime: job.scheduled_time,
      }));

      const waitingQuotes = ((waitingQuotesResult.data || []) as Array<{
        id: string;
        name: string;
        updated_at: string;
      }>).map((lead) => ({
        id: lead.id,
        name: lead.name,
        companyName: null,
        updatedAt: lead.updated_at,
      }));

      const yesterdayValue = 0;

      const weeklyLeads = ((weeklyLeadsResult.data || []) as Array<{ status: string }>);
      const weeklyWonLeads = weeklyLeads.filter((lead) => lead.status === "won").length;
      const weeklyLeadConversion = weeklyLeads.length
        ? Math.round((weeklyWonLeads / weeklyLeads.length) * 100)
        : 0;

      const weeklyQaJobs = ((weeklyQaJobsResult.data || []) as Array<{ qa_status: string | null }>);
      const weeklyQaEligible = weeklyQaJobs.filter((job) => ["approved", "flagged", "needs_rework"].includes(job.qa_status ?? "")).length;
      const weeklyQaApproved = weeklyQaJobs.filter((job) => job.qa_status === "approved").length;
      const weeklyQaPassRate = weeklyQaEligible
        ? Math.round((weeklyQaApproved / weeklyQaEligible) * 100)
        : 0;

      setData({
        stats: {
          activeJobs,
          completedYesterday: jobsYesterdayResult.count || 0,
          unclaimedLeads: (leadsResult.data || []).length,
          yesterdayValue,
          weeklyLeadConversion,
          weeklyQaPassRate,
        },
        leadAlerts,
        qaPending,
        todaySchedule,
        waitingQuotes,
        loading: false,
      });
    }

    void fetchMorningBriefing();
  }, []);

  if (data.loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-slate-50" />
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
          <DashboardSparkIcon />
          {greeting} — Here&apos;s Your Day
        </h2>
        <p className="mt-2 text-sm text-slate-600">No action items — great job today! appears automatically when a section is clear.</p>
      </section>

      {/* KPI Ribbon */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Today&apos;s Active Jobs</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{data.stats.activeJobs}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Yesterday&apos;s Wins</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{data.stats.completedYesterday} <span className="text-xs font-normal text-slate-400">Completed</span></p>
          <p className="mt-1 text-xs text-slate-500">${data.stats.yesterdayValue.toLocaleString()} booked</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Open Pipeline</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{data.stats.unclaimedLeads} <span className="text-xs font-normal text-slate-400">Leads</span></p>
        </div>
      </div>

      {/* Action Feed */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900">
              <span className="flex h-2 w-2 rounded-full bg-red-500" />
              Action Needed
            </h2>
            <div className="mt-4 space-y-3">
              {data.leadAlerts.length > 0 ? (
                data.leadAlerts.map((lead) => (
                  <div key={lead.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">New lead: {lead.name}</p>
                    <p className="mt-1 text-xs text-slate-500">Waiting over 1 hour</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex min-h-[36px] items-center rounded-md border border-slate-300 px-3 text-xs font-semibold text-slate-700"
                        >
                          Call
                        </a>
                      ) : null}
                      <button
                        onClick={() => onModuleSelect("leads")}
                        className="inline-flex min-h-[36px] items-center rounded-md bg-slate-900 px-3 text-xs font-semibold text-white"
                      >
                        Send Quote
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                  <p className="text-sm text-slate-500">No action items — great job today!</p>
                </div>
              )}

              {data.qaPending.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">QA pending for job #{item.jobId.slice(0, 8)}</p>
                  <div className="mt-3">
                    <button
                      onClick={() => onModuleSelect("operations")}
                      className="inline-flex min-h-[36px] items-center rounded-md bg-slate-900 px-3 text-xs font-semibold text-white"
                    >
                      Review Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Today&apos;s Schedule</h2>
            <div className="mt-4 space-y-3">
              {data.todaySchedule.map((job) => (
                <div key={job.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {job.scheduledTime ? `${job.scheduledTime} — ` : ""}{job.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{job.address} · {job.cleanType}</p>
                </div>
              ))}
              {data.todaySchedule.length === 0 && (
                <p className="text-sm italic text-slate-400">No jobs scheduled for today.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Waiting On</h2>
            <div className="mt-4 space-y-3">
              {data.waitingQuotes.map((lead) => (
                <div key={lead.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">Quote sent: {lead.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{lead.companyName || "No company"}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => onModuleSelect("leads")}
                      className="inline-flex min-h-[36px] items-center rounded-md border border-slate-300 px-3 text-xs font-semibold text-slate-700"
                    >
                      Follow Up
                    </button>
                    <button
                      onClick={() => onModuleSelect("leads")}
                      className="inline-flex min-h-[36px] items-center rounded-md bg-slate-900 px-3 text-xs font-semibold text-white"
                    >
                      Mark Lost
                    </button>
                  </div>
                </div>
              ))}
              {data.waitingQuotes.length === 0 && (
                <p className="text-sm italic text-slate-400">No open quotes waiting on response.</p>
              )}
            </div>
          </section>
        </div>

        {/* Quick Access Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-[#0A1628] p-6 text-white shadow-xl shadow-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Quick Tools</h3>
            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={() => onModuleSelect("tickets")}
                className="flex items-center gap-3 rounded-lg bg-white/5 p-3 transition hover:bg-white/10"
              >
                <span className="text-slate-200"><QuickToolIcon kind="job" /></span>
                <div className="text-left">
                  <p className="text-sm font-medium">Create Job</p>
                  <p className="text-[10px] text-slate-400">Add to weekly schedule</p>
                </div>
              </button>
              <button
                onClick={() => onModuleSelect("leads")}
                className="flex items-center gap-3 rounded-lg bg-white/5 p-3 transition hover:bg-white/10"
              >
                <span className="text-slate-200"><QuickToolIcon kind="quote" /></span>
                <div className="text-left">
                  <p className="text-sm font-medium">New Quote</p>
                  <p className="text-[10px] text-slate-400">Convert a lead manually</p>
                </div>
              </button>
              <button
                onClick={() => onModuleSelect("inventory")}
                className="flex items-center gap-3 rounded-lg bg-white/5 p-3 transition hover:bg-white/10"
              >
                <span className="text-slate-200"><QuickToolIcon kind="inventory" /></span>
                <div className="text-left">
                  <p className="text-sm font-medium">Stock Count</p>
                  <p className="text-[10px] text-slate-400">Update supply levels</p>
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Weekly Pulse</h3>
            <div className="mt-4 space-y-4">
               {/* Simplified pulse metrics */}
               <div className="flex items-center justify-between">
                 <span className="text-sm text-slate-600">Lead Conversion</span>
                 <span className="text-sm font-semibold">{data.stats.weeklyLeadConversion}%</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-sm text-slate-600">QA Pass Rate</span>
                 <span className="text-sm font-semibold text-emerald-600">{data.stats.weeklyQaPassRate}%</span>
               </div>
            </div>
            <button
              onClick={() => onModuleSelect("insights")}
              className="mt-6 w-full rounded-lg bg-slate-50 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              View Full Insights →
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}