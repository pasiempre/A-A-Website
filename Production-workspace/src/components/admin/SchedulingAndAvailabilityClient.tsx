"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";

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

type JobRow = {
  id: string;
  title: string;
  address: string;
  status: string;
  scheduled_start: string | null;
  job_assignments: {
    id: string;
    employee_id: string;
    role: string;
    status: string;
    profiles: { full_name: string | null }[] | null;
  }[];
};

const defaultAvailabilityForm = {
  employeeId: "",
  startsAt: "",
  endsAt: "",
  status: "available",
  notes: "",
};

export function SchedulingAndAvailabilityClient() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [availability, setAvailability] = useState<AvailabilityRow[]>([]);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [form, setForm] = useState(defaultAvailabilityForm);
  const [reassignToByJobId, setReassignToByJobId] = useState<Record<string, string>>({});
  const [reassignReasonByJobId, setReassignReasonByJobId] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);

  const employeeProfiles = useMemo(() => profiles.filter((profile) => profile.role === "employee"), [profiles]);

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
        supabase.from("profiles").select("id, full_name, role").in("role", ["admin", "employee"]).order("full_name", { ascending: true }),
        supabase
          .from("employee_availability")
          .select("id, employee_id, starts_at, ends_at, status, notes, profiles:employee_id(full_name)")
          .order("starts_at", { ascending: true })
          .limit(100),
        supabase
          .from("jobs")
          .select("id, title, address, status, scheduled_start, job_assignments(id, employee_id, role, status, profiles:employee_id(full_name))")
          .in("status", ["scheduled", "en_route", "in_progress"])
          .order("scheduled_start", { ascending: true, nullsFirst: false })
          .limit(100),
      ]);

      if (profilesResult.error || availabilityResult.error || jobsResult.error) {
        throw new Error(profilesResult.error?.message || availabilityResult.error?.message || jobsResult.error?.message || "Unable to load scheduling data.");
      }

      const profileRows = (profilesResult.data as ProfileRow[] | null) ?? [];
      setProfiles(profileRows);
      setAvailability((availabilityResult.data as AvailabilityRow[] | null) ?? []);
      setJobs((jobsResult.data as JobRow[] | null) ?? []);

      if (!form.employeeId) {
        const firstEmployee = profileRows.find((profile) => profile.role === "employee");
        if (firstEmployee) {
          setForm((prev) => ({ ...prev, employeeId: firstEmployee.id }));
        }
      }
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to load scheduling module.");
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

      if (error) {
        throw new Error(error.message);
      }

      setStatusText("Availability block added.");
      setForm(defaultAvailabilityForm);
      await loadData();
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to create availability block.");
    } finally {
      setIsSaving(false);
    }
  };

  const reassignLeadTo = async (job: JobRow, nextEmployeeId: string, reason?: string) => {
    if (!nextEmployeeId) {
      setErrorText("Select an employee to reassign.");
      return;
    }
    const currentLead = job.job_assignments.find((assignment) => assignment.role === "lead") ?? job.job_assignments[0] ?? null;
    if (!currentLead) {
      setErrorText("No assignment found for this job.");
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
        .update({ employee_id: nextEmployeeId, notification_status: "pending", notification_error: null, notified_at: null })
        .eq("id", currentLead.id);

      if (assignmentError) {
        throw new Error(assignmentError.message);
      }

      const { error: historyError } = await supabase.from("job_reassignment_history").insert({
        job_id: job.id,
        from_employee_id: currentLead.employee_id,
        to_employee_id: nextEmployeeId,
        reassigned_by: user?.id ?? null,
        reason: reason || null,
      });

      if (historyError) {
        throw new Error(historyError.message);
      }

      const notifyResponse = await fetch("/api/assignment-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId: currentLead.id }),
      });

      if (!notifyResponse.ok) {
        const payload = (await notifyResponse.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Reassignment saved, but SMS notification failed.");
      }

      setStatusText(`Reassigned ${job.title}.`);
      setReassignToByJobId((prev) => ({ ...prev, [job.id]: "" }));
      setReassignReasonByJobId((prev) => ({ ...prev, [job.id]: "" }));
      await loadData();
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to reassign job.");
    } finally {
      setIsSaving(false);
    }
  };

  const reassignLead = async (job: JobRow) => {
    const nextEmployeeId = reassignToByJobId[job.id];
    await reassignLeadTo(job, nextEmployeeId, reassignReasonByJobId[job.id]);
  };

  const handleDropOnEmployee = async (employeeId: string) => {
    if (!draggedJobId) {
      return;
    }

    const draggedJob = jobs.find((job) => job.id === draggedJobId);
    if (!draggedJob) {
      setDraggedJobId(null);
      return;
    }

    await reassignLeadTo(draggedJob, employeeId, "Drag-and-drop reassignment");
    setDraggedJobId(null);
  };

  return (
    <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-lg font-semibold text-slate-900 md:text-xl">Scheduling & Availability</h2>
      <p className="mb-4 text-sm text-slate-600">Track crew availability and reassign active jobs with a history trail.</p>

      {statusText ? <p className="mb-3 text-sm text-emerald-700">{statusText}</p> : null}
      {errorText ? <p className="mb-3 text-sm text-rose-600">{errorText}</p> : null}

      <div className="mb-6 grid gap-3 rounded border border-slate-200 bg-slate-50 p-4 md:grid-cols-5">
        <select
          value={form.employeeId}
          onChange={(event) => setForm((prev) => ({ ...prev, employeeId: event.target.value }))}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
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
          onChange={(event) => setForm((prev) => ({ ...prev, startsAt: event.target.value }))}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="datetime-local"
          value={form.endsAt}
          onChange={(event) => setForm((prev) => ({ ...prev, endsAt: event.target.value }))}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={form.status}
          onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="available">Available</option>
          <option value="limited">Limited</option>
          <option value="unavailable">Unavailable</option>
        </select>
        <button
          type="button"
          onClick={() => void createAvailability()}
          disabled={isSaving}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add Availability
        </button>
        <input
          type="text"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          className="md:col-span-5 rounded border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="mb-6 overflow-hidden rounded border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">Crew Availability Timeline</div>
        <table className="w-full text-left text-sm">
          <thead className="bg-white">
            <tr>
              <th className="border-b border-slate-200 px-3 py-2">Employee</th>
              <th className="border-b border-slate-200 px-3 py-2">Starts</th>
              <th className="border-b border-slate-200 px-3 py-2">Ends</th>
              <th className="border-b border-slate-200 px-3 py-2">Status</th>
              <th className="border-b border-slate-200 px-3 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={5}>
                  Loading availability...
                </td>
              </tr>
            ) : availability.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={5}>
                  No availability blocks yet.
                </td>
              </tr>
            ) : (
              availability.map((entry) => (
                <tr key={entry.id} className="odd:bg-white even:bg-slate-50">
                  <td className="px-3 py-2">{entry.profiles?.[0]?.full_name || "Employee"}</td>
                  <td className="px-3 py-2">{new Date(entry.starts_at).toLocaleString()}</td>
                  <td className="px-3 py-2">{new Date(entry.ends_at).toLocaleString()}</td>
                  <td className="px-3 py-2 capitalize">{entry.status}</td>
                  <td className="px-3 py-2">{entry.notes || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-hidden rounded border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">Active Job Reassignment</div>
        <div className="space-y-3 p-3">
          {jobs.length === 0 ? (
            <p className="text-sm text-slate-500">No active jobs available for reassignment.</p>
          ) : (
            jobs.map((job) => {
              const currentLead = job.job_assignments.find((assignment) => assignment.role === "lead") ?? job.job_assignments[0] ?? null;
              return (
                <article key={job.id} className="rounded border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                  <p className="text-xs text-slate-600">{job.address}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Current lead: {currentLead?.profiles?.[0]?.full_name || "Unassigned"}
                    {job.scheduled_start ? ` • ${new Date(job.scheduled_start).toLocaleString()}` : ""}
                  </p>
                  <div className="mt-2 grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                    <select
                      value={reassignToByJobId[job.id] || ""}
                      onChange={(event) =>
                        setReassignToByJobId((prev) => ({
                          ...prev,
                          [job.id]: event.target.value,
                        }))
                      }
                      className="rounded border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="">Select new lead</option>
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
                      onChange={(event) =>
                        setReassignReasonByJobId((prev) => ({
                          ...prev,
                          [job.id]: event.target.value,
                        }))
                      }
                      className="rounded border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => void reassignLead(job)}
                      disabled={isSaving}
                      className="rounded bg-[#1D4ED8] px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
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

      <div className="mt-6 overflow-hidden rounded border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">Drag-and-Drop Crew Board</div>
        <p className="px-3 pt-3 text-xs text-slate-500">Drag a job card and drop it on an employee lane to reassign the lead quickly.</p>

        <div className="grid gap-3 p-3 md:grid-cols-2 xl:grid-cols-3">
          {employeeProfiles.map((employee) => {
            const laneJobs = jobs.filter((job) => {
              const currentLead = job.job_assignments.find((assignment) => assignment.role === "lead") ?? job.job_assignments[0] ?? null;
              return currentLead?.employee_id === employee.id;
            });

            return (
              <section
                key={employee.id}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => void handleDropOnEmployee(employee.id)}
                className="min-h-40 rounded border border-slate-200 bg-slate-50 p-3"
              >
                <p className="mb-2 text-sm font-semibold text-slate-800">{employee.full_name || "Employee"}</p>
                <div className="space-y-2">
                  {laneJobs.length === 0 ? <p className="text-xs text-slate-500">No assigned active jobs.</p> : null}
                  {laneJobs.map((job) => (
                    <article
                      key={job.id}
                      draggable
                      onDragStart={() => setDraggedJobId(job.id)}
                      className="cursor-grab rounded border border-slate-300 bg-white px-2 py-2 text-xs text-slate-700 shadow-sm"
                    >
                      <p className="font-semibold text-slate-900">{job.title}</p>
                      <p className="mt-0.5 text-slate-500">{job.address}</p>
                      <p className="mt-0.5 uppercase tracking-wide text-slate-500">{job.status}</p>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
