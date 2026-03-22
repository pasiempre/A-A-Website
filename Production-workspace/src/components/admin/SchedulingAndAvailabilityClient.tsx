"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Pagination } from "@/components/admin/Pagination";
import { createClient } from "@/lib/supabase/client";

const AVAILABILITY_PAGE_SIZE = 15;

type ProfileRow = {
  id: string;
  full_name: string | null;
  role: "admin" | "employee";
};

type AvailabilityRow = {
  id: string;
  employee_id: string;
  starts_at: string;
  ends_at: string;
  status: "available" | "unavailable" | "limited";
  notes: string | null;
  profiles: { full_name: string | null }[] | null;
};

type AvailabilityStatus = AvailabilityRow["status"];

type AvailabilityFormState = {
  employeeId: string;
  startsAt: string;
  endsAt: string;
  status: AvailabilityStatus;
  notes: string;
};

type JobAssignment = {
  id: string;
  employee_id: string;
  role: string;
  status: string;
  profiles: { full_name: string | null }[] | null;
};

type JobRow = {
  id: string;
  title: string;
  address: string;
  status: string;
  scheduled_start: string | null;
  scheduled_end: string | null;
  job_assignments: JobAssignment[];
};

type ViewMode = "week" | "day";

type DayColumn = {
  date: Date;
  label: string;
  shortLabel: string;
  iso: string;
};

const HOUR_START = 6;
const HOUR_END = 20;
const HOURS = Array.from(
  { length: HOUR_END - HOUR_START },
  (_, index) => HOUR_START + index,
);

const AVAILABILITY_STATUS_COLORS: Record<string, string> = {
  available: "bg-green-100 border-green-300 text-green-800",
  limited: "bg-amber-100 border-amber-300 text-amber-800",
  unavailable: "bg-red-100 border-red-300 text-red-800",
};

const JOB_STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 border-blue-300 text-blue-800",
  en_route: "bg-indigo-100 border-indigo-300 text-indigo-800",
  in_progress: "bg-violet-100 border-violet-300 text-violet-800",
};

const defaultAvailabilityForm = {
  employeeId: "",
  startsAt: "",
  endsAt: "",
  status: "available" as AvailabilityStatus,
  notes: "",
} satisfies AvailabilityFormState;

function getMonday(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day + (day === 0 ? -6 : 1);
  result.setDate(diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatWeekRange(monday: Date): string {
  const sunday = addDays(monday, 6);
  return `${formatShortDate(monday)} – ${formatShortDate(sunday)}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function buildDayColumns(
  monday: Date,
  mode: ViewMode,
  selectedDay: Date,
): DayColumn[] {
  if (mode === "day") {
    return [
      {
        date: selectedDay,
        label: formatDayLabel(selectedDay),
        shortLabel: formatShortDate(selectedDay),
        iso: selectedDay.toISOString().split("T")[0],
      },
    ];
  }

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(monday, index);
    return {
      date,
      label: formatDayLabel(date),
      shortLabel: formatShortDate(date),
      iso: date.toISOString().split("T")[0],
    };
  });
}

function getTimeBlockPosition(
  startIso: string,
  endIso: string,
  dayDate: Date,
): { topPercent: number; heightPercent: number } | null {
  const start = new Date(startIso);
  const end = new Date(endIso);

  const dayStart = new Date(dayDate);
  dayStart.setHours(HOUR_START, 0, 0, 0);
  const dayEnd = new Date(dayDate);
  dayEnd.setHours(HOUR_END, 0, 0, 0);

  if (end <= dayStart || start >= dayEnd) return null;

  const clampedStart = new Date(Math.max(start.getTime(), dayStart.getTime()));
  const clampedEnd = new Date(Math.min(end.getTime(), dayEnd.getTime()));

  const totalMinutes = (HOUR_END - HOUR_START) * 60;
  const startMinutes =
    (clampedStart.getHours() - HOUR_START) * 60 + clampedStart.getMinutes();
  const endMinutes =
    (clampedEnd.getHours() - HOUR_START) * 60 + clampedEnd.getMinutes();

  return {
    topPercent: (startMinutes / totalMinutes) * 100,
    heightPercent: Math.max(
      ((endMinutes - startMinutes) / totalMinutes) * 100,
      2,
    ),
  };
}

export function SchedulingAndAvailabilityClient() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [availability, setAvailability] = useState<AvailabilityRow[]>([]);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [form, setForm] = useState<AvailabilityFormState>(
    defaultAvailabilityForm,
  );

  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedDay, setSelectedDay] = useState<Date>(() => new Date());

  const [availabilityPage, setAvailabilityPage] = useState(0);

  const [reassignToByJobId, setReassignToByJobId] = useState<
    Record<string, string>
  >({});
  const [reassignReasonByJobId, setReassignReasonByJobId] = useState<
    Record<string, string>
  >({});

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  );

  const employeeProfiles = useMemo(
    () => profiles.filter((profile) => profile.role === "employee"),
    [profiles],
  );

  const dayColumns = useMemo(
    () => buildDayColumns(weekStart, viewMode, selectedDay),
    [weekStart, viewMode, selectedDay],
  );

  const visibleAvailability = useMemo(() => {
    const rangeStart = dayColumns[0]?.date ?? weekStart;
    const rangeEnd = addDays(dayColumns[dayColumns.length - 1]?.date ?? weekStart, 1);

    return availability.filter((entry) => {
      const start = new Date(entry.starts_at);
      const end = new Date(entry.ends_at);
      return end > rangeStart && start < rangeEnd;
    });
  }, [availability, dayColumns, weekStart]);

  const visibleJobs = useMemo(() => {
    const rangeStart = dayColumns[0]?.date ?? weekStart;
    const rangeEnd = addDays(dayColumns[dayColumns.length - 1]?.date ?? weekStart, 1);

    return jobs.filter((job) => {
      if (!job.scheduled_start) return false;
      const start = new Date(job.scheduled_start);
      return start >= rangeStart && start < rangeEnd;
    });
  }, [jobs, dayColumns, weekStart]);

  // ── Conflict detection: unavailability + job-to-job overlap ──
  const conflicts = useMemo(() => {
    const result: { jobId: string; employeeId: string; reason: string }[] = [];

    // 1) Job vs unavailability (original logic)
    for (const job of visibleJobs) {
      if (!job.scheduled_start) continue;
      const jobStart = new Date(job.scheduled_start);
      const jobEnd = job.scheduled_end
        ? new Date(job.scheduled_end)
        : new Date(jobStart.getTime() + 4 * 60 * 60 * 1000);

      for (const assignment of job.job_assignments) {
        const unavailable = visibleAvailability.filter(
          (entry) =>
            entry.employee_id === assignment.employee_id &&
            entry.status === "unavailable",
        );

        for (const block of unavailable) {
          const blockStart = new Date(block.starts_at);
          const blockEnd = new Date(block.ends_at);

          if (jobStart < blockEnd && jobEnd > blockStart) {
            const employeeName =
              assignment.profiles?.[0]?.full_name ??
              assignment.employee_id.slice(0, 8);
            result.push({
              jobId: job.id,
              employeeId: assignment.employee_id,
              reason: `${employeeName} is unavailable during this time`,
            });
          }
        }
      }
    }

    // 2) Job-to-job overlap detection (new)
    const employeeJobMap = new Map<string, JobRow[]>();
    for (const job of visibleJobs) {
      if (!job.scheduled_start) continue;
      for (const assignment of job.job_assignments) {
        const existing = employeeJobMap.get(assignment.employee_id) ?? [];
        existing.push(job);
        employeeJobMap.set(assignment.employee_id, existing);
      }
    }

    for (const [employeeId, employeeJobs] of employeeJobMap) {
      if (employeeJobs.length < 2) continue;

      const sorted = [...employeeJobs].sort(
        (a, b) =>
          new Date(a.scheduled_start!).getTime() -
          new Date(b.scheduled_start!).getTime(),
      );

      const firstAssignment = sorted[0].job_assignments.find(
        (a) => a.employee_id === employeeId,
      );
      const employeeName =
        firstAssignment?.profiles?.[0]?.full_name ?? employeeId.slice(0, 8);

      const flaggedPairs = new Set<string>();

      for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const jobA = sorted[i];
          const jobB = sorted[j];
          const pairKey = [jobA.id, jobB.id].sort().join("-");

          if (flaggedPairs.has(pairKey)) continue;

          const startA = new Date(jobA.scheduled_start!);
          const endA = jobA.scheduled_end
            ? new Date(jobA.scheduled_end)
            : new Date(startA.getTime() + 4 * 60 * 60 * 1000);
          const startB = new Date(jobB.scheduled_start!);
          const endB = jobB.scheduled_end
            ? new Date(jobB.scheduled_end)
            : new Date(startB.getTime() + 4 * 60 * 60 * 1000);

          if (startA < endB && startB < endA) {
            flaggedPairs.add(pairKey);
            result.push({
              jobId: jobA.id,
              employeeId,
              reason: `${employeeName} has overlapping jobs: "${jobA.title}" and "${jobB.title}"`,
            });
            result.push({
              jobId: jobB.id,
              employeeId,
              reason: `${employeeName} has overlapping jobs: "${jobA.title}" and "${jobB.title}"`,
            });
          }
        }
      }
    }

    return result;
  }, [visibleJobs, visibleAvailability]);

  // ── Client-side pagination for availability list ──
  const paginatedAvailability = useMemo(
    () =>
      availability.slice(
        availabilityPage * AVAILABILITY_PAGE_SIZE,
        (availabilityPage + 1) * AVAILABILITY_PAGE_SIZE,
      ),
    [availability, availabilityPage],
  );

  useEffect(() => {
    setAvailabilityPage(0);
  }, [availability]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorText(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(userError?.message ?? "Unable to load user.");
      }

      const [profilesResult, availabilityResult, jobsResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, role")
          .in("role", ["admin", "employee"])
          .order("full_name", { ascending: true }),
        supabase
          .from("employee_availability")
          .select(
            "id, employee_id, starts_at, ends_at, status, notes, profiles:employee_id(full_name)",
          )
          .order("starts_at", { ascending: true })
          .limit(200),
        supabase
          .from("jobs")
          .select(
            "id, title, address, status, scheduled_start, scheduled_end, job_assignments(id, employee_id, role, status, profiles:employee_id(full_name))",
          )
          .in("status", ["scheduled", "en_route", "in_progress"])
          .order("scheduled_start", {
            ascending: true,
            nullsFirst: false,
          })
          .limit(200),
      ]);

      if (profilesResult.error || availabilityResult.error || jobsResult.error) {
        throw new Error(
          profilesResult.error?.message ||
            availabilityResult.error?.message ||
            jobsResult.error?.message ||
            "Unable to load scheduling data.",
        );
      }

      const profileRows =
        (profilesResult.data as unknown as ProfileRow[] | null) ?? [];
      setProfiles(profileRows);
      setAvailability(
        (availabilityResult.data as unknown as AvailabilityRow[] | null) ?? [],
      );
      setJobs((jobsResult.data as unknown as JobRow[] | null) ?? []);

      if (!form.employeeId) {
        const firstEmployee = profileRows.find(
          (profile) => profile.role === "employee",
        );
        if (firstEmployee) {
          setForm((prev) => ({ ...prev, employeeId: firstEmployee.id }));
        }
      }
    } catch (error) {
      setErrorText(
        error instanceof Error
          ? error.message
          : "Unable to load scheduling module.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [form.employeeId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const createAvailability = async () => {
    if (!form.employeeId || !form.startsAt || !form.endsAt) {
      setErrorText("Employee, start, and end time are required.");
      return;
    }

    if (new Date(form.endsAt) <= new Date(form.startsAt)) {
      setErrorText("End time must be after start time.");
      return;
    }

    setIsSaving(true);
    setErrorText(null);
    setStatusText(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("employee_availability").insert({
        employee_id: form.employeeId,
        starts_at: new Date(form.startsAt).toISOString(),
        ends_at: new Date(form.endsAt).toISOString(),
        status: form.status,
        notes: form.notes || null,
        created_by: user?.id ?? null,
      });

      if (error) throw new Error(error.message);

      setStatusText("Availability block added.");
      setForm((prev) => ({
        ...defaultAvailabilityForm,
        employeeId: prev.employeeId,
      }));
      await loadData();
    } catch (error) {
      setErrorText(
        error instanceof Error
          ? error.message
          : "Unable to create availability block.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAvailability = async (id: string) => {
    setErrorText(null);
    setStatusText(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("employee_availability")
      .delete()
      .eq("id", id);

    if (error) {
      setErrorText(error.message);
      return;
    }

    setStatusText("Availability block removed.");
    await loadData();
  };

  const reassignLeadTo = async (
    job: JobRow,
    nextEmployeeId: string,
    reason?: string,
  ) => {
    if (!nextEmployeeId) {
      setErrorText("Select an employee to reassign.");
      return;
    }

    const currentLead =
      job.job_assignments.find((a) => a.role === "lead") ??
      job.job_assignments[0] ??
      null;

    if (!currentLead) {
      setErrorText("No assignment found for this job.");
      return;
    }

    if (currentLead.employee_id === nextEmployeeId) {
      setErrorText("Job is already assigned to this employee.");
      return;
    }

    setIsSaving(true);
    setErrorText(null);
    setStatusText(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error: assignmentError } = await supabase
        .from("job_assignments")
        .update({
          employee_id: nextEmployeeId,
          notification_status: "pending",
          notification_error: null,
          notified_at: null,
        })
        .eq("id", currentLead.id);

      if (assignmentError) throw new Error(assignmentError.message);

      const { error: historyError } = await supabase
        .from("job_reassignment_history")
        .insert({
          job_id: job.id,
          from_employee_id: currentLead.employee_id,
          to_employee_id: nextEmployeeId,
          reassigned_by: user?.id ?? null,
          reason: reason || null,
        });

      if (historyError) throw new Error(historyError.message);

      const notifyResponse = await fetch("/api/assignment-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId: currentLead.id }),
      });

      if (!notifyResponse.ok) {
        const payload = (await notifyResponse
          .json()
          .catch(() => null)) as { error?: string } | null;
        throw new Error(
          payload?.error ?? "Reassignment saved, but SMS notification failed.",
        );
      }

      setStatusText(`Reassigned ${job.title}.`);
      setReassignToByJobId((prev) => ({ ...prev, [job.id]: "" }));
      setReassignReasonByJobId((prev) => ({ ...prev, [job.id]: "" }));
      setSelectedJobId(null);
      await loadData();
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Unable to reassign job.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDropOnEmployee = async (employeeId: string) => {
    if (!draggedJobId) return;
    const job = jobs.find((e) => e.id === draggedJobId);
    if (!job) {
      setDraggedJobId(null);
      return;
    }
    await reassignLeadTo(job, employeeId, "Drag-and-drop reassignment");
    setDraggedJobId(null);
  };

  const handleTapAssignToEmployee = async (employeeId: string) => {
    if (!selectedJobId) return;
    const job = jobs.find((e) => e.id === selectedJobId);
    if (!job) {
      setSelectedJobId(null);
      return;
    }
    await reassignLeadTo(job, employeeId, "Tap-to-assign reassignment");
  };

  const goToPreviousWeek = () => setWeekStart((prev) => addDays(prev, -7));
  const goToNextWeek = () => setWeekStart((prev) => addDays(prev, 7));
  const goToThisWeek = () => {
    setWeekStart(getMonday(new Date()));
    setSelectedDay(new Date());
  };
  const goToPreviousDay = () => setSelectedDay((prev) => addDays(prev, -1));
  const goToNextDay = () => setSelectedDay((prev) => addDays(prev, 1));

  const getConflictsForJob = (jobId: string) =>
    conflicts.filter((c) => c.jobId === jobId);

  const getAvailabilityForEmployeeOnDay = (
    employeeId: string,
    day: DayColumn,
  ) => {
    return visibleAvailability.filter((entry) => {
      if (entry.employee_id !== employeeId) return false;
      const start = new Date(entry.starts_at);
      const end = new Date(entry.ends_at);
      const dayStart = new Date(day.date);
      dayStart.setHours(HOUR_START, 0, 0, 0);
      const dayEnd = new Date(day.date);
      dayEnd.setHours(HOUR_END, 0, 0, 0);
      return end > dayStart && start < dayEnd;
    });
  };

  const getJobsForEmployeeOnDay = (employeeId: string, day: DayColumn) => {
    return visibleJobs.filter((job) => {
      if (!job.scheduled_start) return false;
      const start = new Date(job.scheduled_start);
      if (!isSameDay(start, day.date)) return false;
      const lead =
        job.job_assignments.find((a) => a.role === "lead") ??
        job.job_assignments[0];
      return lead?.employee_id === employeeId;
    });
  };

  const displayedEmployees = useMemo(() => {
    if (selectedEmployeeId) {
      return employeeProfiles.filter((e) => e.id === selectedEmployeeId);
    }
    return employeeProfiles;
  }, [employeeProfiles, selectedEmployeeId]);

  return (
    <section className="mt-8 space-y-6">
      {/* ── Header + Conflict Summary ── */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 md:text-xl">
              Scheduling & Availability
            </h2>
            <p className="text-sm text-slate-600">
              Track crew availability, view schedule, and reassign jobs.
            </p>
          </div>
          <button
            type="button"
            className="min-h-[36px] rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => void loadData()}
          >
            Refresh
          </button>
        </div>

        {statusText ? (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            {statusText}
          </p>
        ) : null}
        {errorText ? (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {errorText}
          </p>
        ) : null}

        {conflicts.length > 0 ? (
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
              ⚠ Scheduling Conflicts ({conflicts.length})
            </p>
            <ul className="mt-1 space-y-0.5">
              {conflicts.slice(0, 5).map((conflict, index) => (
                <li
                  key={`${conflict.jobId}-${conflict.employeeId}-${index}`}
                  className="text-xs text-amber-600"
                >
                  {conflict.reason}
                </li>
              ))}
              {conflicts.length > 5 ? (
                <li className="text-xs italic text-amber-500">
                  +{conflicts.length - 5} more
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>

      {/* ── Add Availability Form ── */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <p className="mb-3 text-sm font-semibold text-slate-700">
          Add Availability Block
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <select
            value={form.employeeId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, employeeId: e.target.value }))
            }
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Select employee</option>
            {employeeProfiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.full_name || "Employee"}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={form.startsAt}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, startsAt: e.target.value }))
            }
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Start"
          />

          <input
            type="datetime-local"
            value={form.endsAt}
            onChange={(e) => setForm((prev) => ({ ...prev, endsAt: e.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="End"
          />

          <select
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                status: e.target.value as AvailabilityStatus,
              }))
            }
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="available">Available</option>
            <option value="limited">Limited</option>
            <option value="unavailable">Unavailable</option>
          </select>

          <input
            type="text"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />

          <button
            type="button"
            onClick={() => void createAvailability()}
            disabled={isSaving}
            className="min-h-[44px] rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Add Block"}
          </button>
        </div>
      </div>

      {/* ── Calendar View ── */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex rounded-md border border-slate-300">
            <button
              type="button"
              className={`min-h-[36px] px-3 py-2 text-xs font-medium ${
                viewMode === "week"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setViewMode("week")}
            >
              Week
            </button>
            <button
              type="button"
              className={`min-h-[36px] px-3 py-2 text-xs font-medium ${
                viewMode === "day"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setViewMode("day")}
            >
              Day
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="min-h-[36px] rounded-md border border-slate-300 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
              onClick={viewMode === "week" ? goToPreviousWeek : goToPreviousDay}
            >
              ← Prev
            </button>
            <button
              type="button"
              className="min-h-[36px] rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              onClick={goToThisWeek}
            >
              Today
            </button>
            <button
              type="button"
              className="min-h-[36px] rounded-md border border-slate-300 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
              onClick={viewMode === "week" ? goToNextWeek : goToNextDay}
            >
              Next →
            </button>
          </div>

          <select
            className="min-h-[36px] rounded-md border border-slate-300 px-3 py-2 text-xs"
            value={selectedEmployeeId ?? ""}
            onChange={(e) => setSelectedEmployeeId(e.target.value || null)}
          >
            <option value="">All Employees</option>
            {employeeProfiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.full_name || "Employee"}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-3 text-sm font-medium text-slate-700">
          {viewMode === "week"
            ? formatWeekRange(weekStart)
            : formatDayLabel(selectedDay)}
        </p>

        {isLoading ? <p className="mt-4 text-sm text-slate-500">Loading schedule...</p> : null}

        {!isLoading ? (
          <div className="mt-4 overflow-x-auto">
            <div
              className="grid min-w-[600px]"
              style={{
                gridTemplateColumns: `80px repeat(${dayColumns.length}, 1fr)`,
              }}
            >
              {/* Header row */}
              <div className="border-b border-slate-200 px-2 py-2 text-xs font-medium text-slate-500">
                Time
              </div>
              {dayColumns.map((column) => (
                <div
                  key={column.iso}
                  className={`border-b border-l border-slate-200 px-2 py-2 text-center text-xs font-medium ${
                    isToday(column.date) ? "bg-blue-50 text-blue-700" : "text-slate-700"
                  }`}
                >
                  <span className="hidden sm:inline">{column.label}</span>
                  <span className="sm:hidden">{column.shortLabel}</span>
                </div>
              ))}

              {/* Employee rows */}
              {displayedEmployees.map((employee) => (
                <div key={employee.id} className="contents">
                  {/* Time column */}
                  <div className="border-b border-slate-200 px-2 py-1">
                    <p className="truncate text-xs font-semibold text-slate-800">
                      {employee.full_name || "Employee"}
                    </p>
                    <div className="relative mt-1">
                      {HOURS.map((hour) => (
                        <div
                          key={`${employee.id}-${hour}`}
                          className="text-[10px] text-slate-400"
                          style={{
                            height: `${100 / HOURS.length}%`,
                            minHeight: "28px",
                          }}
                        >
                          {hour}:00
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Day cells */}
                  {dayColumns.map((column) => {
                    const dayAvailability = getAvailabilityForEmployeeOnDay(employee.id, column);
                    const dayJobs = getJobsForEmployeeOnDay(employee.id, column);

                    return (
                      <div
                        key={`${employee.id}-${column.iso}`}
                        className={`relative border-b border-l border-slate-200 ${
                          isToday(column.date) ? "bg-blue-50/30" : ""
                        }`}
                        style={{ minHeight: `${HOURS.length * 28}px` }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => void handleDropOnEmployee(employee.id)}
                        onClick={() => {
                          if (selectedJobId) {
                            void handleTapAssignToEmployee(employee.id);
                          }
                        }}
                      >
                        {/* Hour grid lines */}
                        {HOURS.map((hour) => (
                          <div
                            key={`${employee.id}-${column.iso}-${hour}`}
                            className="border-b border-slate-100"
                            style={{
                              height: `${100 / HOURS.length}%`,
                              minHeight: "28px",
                            }}
                          />
                        ))}

                        {/* Availability blocks */}
                        {dayAvailability.map((entry) => {
                          const position = getTimeBlockPosition(
                            entry.starts_at,
                            entry.ends_at,
                            column.date,
                          );
                          if (!position) return null;

                          return (
                            <div
                              key={entry.id}
                              className={`absolute inset-x-0.5 overflow-hidden rounded border px-1 text-[11px] ${
                                AVAILABILITY_STATUS_COLORS[entry.status] ??
                                "bg-slate-100 border-slate-300"
                              }`}
                              style={{
                                top: `${position.topPercent}%`,
                                height: `${position.heightPercent}%`,
                                minHeight: "22px",
                                zIndex: 1,
                                opacity: 0.7,
                              }}
                              title={`${entry.status}: ${entry.notes ?? ""}`}
                            >
                              <span className="truncate">{entry.status}</span>
                            </div>
                          );
                        })}

                        {/* Job blocks */}
                        {dayJobs.map((job) => {
                          const start = job.scheduled_start!;
                          const end =
                            job.scheduled_end ??
                            new Date(new Date(start).getTime() + 4 * 60 * 60 * 1000).toISOString();
                          const position = getTimeBlockPosition(start, end, column.date);
                          if (!position) return null;

                          const jobConflicts = getConflictsForJob(job.id);
                          const hasConflict = jobConflicts.length > 0;

                          return (
                            <div
                              key={job.id}
                              className={`absolute inset-x-0.5 cursor-pointer overflow-hidden rounded border px-1.5 py-0.5 text-[11px] ${
                                hasConflict
                                  ? "border-red-400 bg-red-100 text-red-800"
                                  : JOB_STATUS_COLORS[job.status] ??
                                    "border-slate-300 bg-slate-100 text-slate-700"
                              } ${selectedJobId === job.id ? "ring-2 ring-blue-500" : ""}`}
                              style={{
                                top: `${position.topPercent}%`,
                                height: `${position.heightPercent}%`,
                                minHeight: "28px",
                                zIndex: 2,
                              }}
                              title={`${job.title} — ${job.address}${
                                hasConflict ? ` ⚠ ${jobConflicts[0].reason}` : ""
                              }`}
                              draggable
                              onDragStart={() => setDraggedJobId(job.id)}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedJobId(selectedJobId === job.id ? null : job.id);
                              }}
                            >
                              <p className="truncate font-semibold">{job.title}</p>
                              {hasConflict && (
                                <p className="truncate text-[10px] font-medium text-red-600">
                                  ⚠ Conflict
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Mobile tap-to-assign hint */}
            {selectedJobId ? (
              <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700 md:hidden">
                <p className="font-medium">
                  Tap an employee column to reassign:{" "}
                  <span className="font-semibold">
                    {jobs.find((j) => j.id === selectedJobId)?.title ?? "Selected job"}
                  </span>
                </p>
                <button
                  type="button"
                  className="mt-1 min-h-[36px] text-xs underline"
                  onClick={() => setSelectedJobId(null)}
                >
                  Cancel
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {!isLoading && displayedEmployees.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No employees found.</p>
        ) : null}
      </div>

      {/* ── Availability Blocks List ── */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Availability Blocks</h3>
          <span className="text-xs text-slate-500">{availability.length} total</span>
        </div>

        {/* Desktop table */}
        <div className="mt-3 hidden overflow-x-auto rounded border border-slate-200 md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="border-b border-slate-200 px-3 py-2">Employee</th>
                <th className="border-b border-slate-200 px-3 py-2">Starts</th>
                <th className="border-b border-slate-200 px-3 py-2">Ends</th>
                <th className="border-b border-slate-200 px-3 py-2">Status</th>
                <th className="border-b border-slate-200 px-3 py-2">Notes</th>
                <th className="border-b border-slate-200 px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {paginatedAvailability.length === 0 ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={6}>
                    No availability blocks yet.
                  </td>
                </tr>
              ) : (
                paginatedAvailability.map((entry) => (
                  <tr key={entry.id} className="odd:bg-white even:bg-slate-50">
                    <td className="px-3 py-2">{entry.profiles?.[0]?.full_name || "Employee"}</td>
                    <td className="px-3 py-2">{new Date(entry.starts_at).toLocaleString()}</td>
                    <td className="px-3 py-2">{new Date(entry.ends_at).toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          AVAILABILITY_STATUS_COLORS[entry.status] ?? "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">{entry.notes || "—"}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        className="min-h-[36px] rounded-md px-2 py-1.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-700"
                        onClick={() => void deleteAvailability(entry.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="mt-3 space-y-2 md:hidden">
          {paginatedAvailability.length === 0 ? (
            <p className="text-xs text-slate-500">No availability blocks yet.</p>
          ) : (
            paginatedAvailability.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start justify-between rounded-md border border-slate-200 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {entry.profiles?.[0]?.full_name || "Employee"}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {new Date(entry.starts_at).toLocaleString()} →{" "}
                    {new Date(entry.ends_at).toLocaleString()}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      AVAILABILITY_STATUS_COLORS[entry.status] ?? "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {entry.status}
                  </span>
                  {entry.notes ? (
                    <p className="mt-1 text-xs text-slate-500">{entry.notes}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="min-h-[44px] shrink-0 rounded-md px-3 py-2 text-xs text-red-500 hover:bg-red-50 hover:text-red-700"
                  onClick={() => void deleteAvailability(entry.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* Availability pagination */}
        <div className="mt-3">
          <Pagination
            page={availabilityPage}
            pageSize={AVAILABILITY_PAGE_SIZE}
            totalCount={availability.length}
            onPageChange={setAvailabilityPage}
          />
        </div>
      </div>

      {/* ── Active Job Reassignment ── */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-sm font-semibold text-slate-700">Active Job Reassignment</h3>

        <div className="mt-3 space-y-3">
          {visibleJobs.length === 0 ? (
            <p className="text-sm text-slate-500">No active jobs in the current view range.</p>
          ) : (
            visibleJobs.map((job) => {
              const currentLead =
                job.job_assignments.find((a) => a.role === "lead") ??
                job.job_assignments[0] ??
                null;
              const jobConflicts = getConflictsForJob(job.id);

              return (
                <article
                  key={job.id}
                  className={`rounded-md border p-3 ${
                    jobConflicts.length > 0 ? "border-red-200 bg-red-50" : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                      <p className="text-xs text-slate-600">{job.address}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Lead: {currentLead?.profiles?.[0]?.full_name ?? "Unassigned"}
                        {job.scheduled_start
                          ? ` • ${new Date(job.scheduled_start).toLocaleString()}`
                          : ""}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        JOB_STATUS_COLORS[job.status] ?? "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  {jobConflicts.length > 0 ? (
                    <div className="mt-2 space-y-0.5">
                      {jobConflicts.map((conflict, idx) => (
                        <p key={`${conflict.employeeId}-${idx}`} className="text-xs font-medium text-red-600">
                          ⚠ {conflict.reason}
                        </p>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                    <select
                      value={reassignToByJobId[job.id] || ""}
                      onChange={(e) =>
                        setReassignToByJobId((prev) => ({
                          ...prev,
                          [job.id]: e.target.value,
                        }))
                      }
                      className="min-h-[44px] rounded-md border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="">New lead...</option>
                      {employeeProfiles.map((profile) => (
                        <option key={profile.id} value={profile.id}>
                          {profile.full_name || "Employee"}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Reason"
                      value={reassignReasonByJobId[job.id] || ""}
                      onChange={(e) =>
                        setReassignReasonByJobId((prev) => ({
                          ...prev,
                          [job.id]: e.target.value,
                        }))
                      }
                      className="min-h-[44px] rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const employeeId = reassignToByJobId[job.id];
                        if (employeeId) {
                          void reassignLeadTo(job, employeeId, reassignReasonByJobId[job.id]);
                        }
                      }}
                      disabled={isSaving || !reassignToByJobId[job.id]}
                      className="min-h-[44px] rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
                    >
                      Reassign
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}