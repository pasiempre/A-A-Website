"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import {
  CLEAN_TYPE_OPTIONS,
  JOB_STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  formatCleanType,
  formatPriority,
  parseAreas,
} from "@/lib/ticketing";

type Profile = {
  id: string;
  full_name: string | null;
  role: "admin" | "employee";
};

type ChecklistTemplate = {
  id: string;
  name: string;
  locale: string;
};

type JobRow = {
  id: string;
  title: string;
  address: string;
  clean_type: string;
  priority: string;
  status: string;
  qa_status: "pending" | "approved" | "flagged" | "needs_rework";
  qa_notes: string | null;
  scope: string | null;
  areas: string[] | null;
  assigned_week_start: string | null;
  created_at: string;
  duplicate_source_job_id: string | null;
  job_assignments: {
    employee_id: string;
    role: string;
    status: string;
    profiles: { full_name: string | null }[] | null;
  }[];
  issue_reports: {
    id: string;
    description: string;
    status: "open" | "acknowledged" | "resolved";
    created_at: string;
  }[] | null;
};

const initialForm = {
  title: "",
  address: "",
  cleanType: "post_construction",
  priority: "normal",
  scope: "",
  areasCsv: "cabinets, windows",
  assignedWeekStart: "",
  workerId: "",
  checklistTemplateId: "",
};

export function TicketManagementClient() {
  const getSupabase = () => createClient();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [checklistTemplates, setChecklistTemplates] = useState<ChecklistTemplate[]>([]);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [qaStatusByJob, setQaStatusByJob] = useState<Record<string, JobRow["qa_status"]>>({});
  const [qaNotesByJob, setQaNotesByJob] = useState<Record<string, string>>({});
  const [qaSavingJobId, setQaSavingJobId] = useState<string | null>(null);

  const employeeOptions = useMemo(() => profiles.filter((profile) => profile.role === "employee"), [profiles]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const supabase = getSupabase();

    const [
      { data: profileData, error: profileError },
      { data: jobsData, error: jobsError },
      { data: templatesData, error: templatesError },
    ] = await Promise.all([
      supabase.from("profiles").select("id, full_name, role").order("full_name", { ascending: true }),
      supabase
        .from("jobs")
        .select(
          "id, title, address, clean_type, priority, status, qa_status, qa_notes, scope, areas, assigned_week_start, created_at, duplicate_source_job_id, job_assignments(employee_id, role, status, profiles:employee_id(full_name)), issue_reports(id, description, status, created_at)",
        )
        .order("created_at", { ascending: false })
        .limit(100),
      supabase.from("checklist_templates").select("id, name, locale").order("created_at", { ascending: false }).limit(100),
    ]);

    if (profileError) {
      setFormError(profileError.message);
    } else {
      setProfiles((profileData as Profile[]) ?? []);
    }

    if (jobsError) {
      setFormError(jobsError.message);
    } else {
      const nextJobs = (jobsData as JobRow[]) ?? [];
      setJobs(nextJobs);
      setQaStatusByJob(
        nextJobs.reduce<Record<string, JobRow["qa_status"]>>((acc, job) => {
          acc[job.id] = job.qa_status;
          return acc;
        }, {}),
      );
      setQaNotesByJob(
        nextJobs.reduce<Record<string, string>>((acc, job) => {
          acc[job.id] = job.qa_notes ?? "";
          return acc;
        }, {}),
      );
    }

    if (templatesError) {
      setFormError(templatesError.message);
    } else {
      setChecklistTemplates((templatesData as ChecklistTemplate[]) ?? []);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const createTicket = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError(null);
    setStatusText(null);

    try {
      const supabase = getSupabase();
      const areas = parseAreas(form.areasCsv);

      const { data: createdJob, error: createError } = await supabase
        .from("jobs")
        .insert({
          title: form.title,
          address: form.address,
          clean_type: form.cleanType,
          priority: form.priority,
          scope: form.scope || null,
          areas,
          assigned_week_start: form.assignedWeekStart || null,
          checklist_template_id: form.checklistTemplateId || null,
          status: "scheduled",
        })
        .select("id")
        .single();

      if (createError) {
        throw createError;
      }

      if (createdJob && form.workerId) {
        const { data: assignmentRow, error: assignmentError } = await supabase
          .from("job_assignments")
          .insert({
          job_id: createdJob.id,
          employee_id: form.workerId,
          role: "lead",
          status: "assigned",
          notification_status: "pending",
        })
          .select("id")
          .single();

        if (assignmentError || !assignmentRow) {
          throw assignmentError;
        }

        const notifyResponse = await fetch("/api/assignment-notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assignmentId: assignmentRow.id }),
        });

        if (!notifyResponse.ok) {
          const payload = (await notifyResponse.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error ?? "Assignment SMS notification failed.");
        }
      }

      if (createdJob && form.checklistTemplateId) {
        const { data: templateItems, error: templateItemsError } = await supabase
          .from("checklist_template_items")
          .select("item_text, sort_order")
          .eq("template_id", form.checklistTemplateId)
          .order("sort_order", { ascending: true });

        if (templateItemsError) {
          throw templateItemsError;
        }

        if (templateItems && templateItems.length > 0) {
          const { error: checklistInsertError } = await supabase.from("job_checklist_items").insert(
            templateItems.map((item) => ({
              job_id: createdJob.id,
              item_text: item.item_text,
              sort_order: item.sort_order,
            })),
          );

          if (checklistInsertError) {
            throw checklistInsertError;
          }
        }
      }

      setStatusText("Ticket created successfully.");
      setForm(initialForm);
      await loadData();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to create ticket.");
    } finally {
      setIsSaving(false);
    }
  };

  const duplicateTicket = async (job: JobRow) => {
    setFormError(null);
    setStatusText(null);
    setIsSaving(true);

    try {
      const supabase = getSupabase();
      const { data: clonedJob, error: cloneError } = await supabase
        .from("jobs")
        .insert({
          title: `${job.title} (Copy)`,
          address: job.address,
          clean_type: job.clean_type,
          priority: job.priority,
          scope: job.scope,
          areas: job.areas ?? [],
          assigned_week_start: job.assigned_week_start,
          status: "scheduled",
          duplicate_source_job_id: job.id,
        })
        .select("id")
        .single();

      if (cloneError) {
        throw cloneError;
      }

      if (clonedJob && job.job_assignments.length > 0) {
        const cloneAssignments = job.job_assignments.map((assignment) => ({
          job_id: clonedJob.id,
          employee_id: assignment.employee_id,
          role: assignment.role,
          status: "assigned",
        }));

        const { error: assignmentError } = await supabase.from("job_assignments").insert(cloneAssignments);
        if (assignmentError) {
          throw assignmentError;
        }
      }

      setStatusText("Ticket duplicated.");
      await loadData();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to duplicate ticket.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateStatus = async (jobId: string, status: string) => {
    setFormError(null);
    setStatusText(null);
    const supabase = getSupabase();

    const { error } = await supabase.from("jobs").update({ status }).eq("id", jobId);

    if (error) {
      setFormError(error.message);
      return;
    }

    setStatusText("Ticket status updated.");
    await loadData();
  };

  const saveQaReview = async (job: JobRow) => {
    const selectedQaStatus = qaStatusByJob[job.id] ?? job.qa_status;
    const notes = qaNotesByJob[job.id]?.trim() || null;

    setFormError(null);
    setStatusText(null);
    setQaSavingJobId(job.id);

    const supabase = getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const jobPatch: {
      qa_status: JobRow["qa_status"];
      qa_notes: string | null;
      qa_reviewed_at: string;
      qa_reviewed_by: string | null;
      status?: string;
    } = {
      qa_status: selectedQaStatus,
      qa_notes: notes,
      qa_reviewed_at: new Date().toISOString(),
      qa_reviewed_by: user?.id ?? null,
    };

    if (selectedQaStatus === "needs_rework") {
      jobPatch.status = "in_progress";
    }

    if (selectedQaStatus === "approved") {
      jobPatch.status = "completed";
    }

    const { error: jobUpdateError } = await supabase.from("jobs").update(jobPatch).eq("id", job.id);
    if (jobUpdateError) {
      setFormError(jobUpdateError.message);
      setQaSavingJobId(null);
      return;
    }

    if (selectedQaStatus === "needs_rework") {
      const { error: assignmentResetError } = await supabase
        .from("job_assignments")
        .update({ status: "assigned", started_at: null, completed_at: null })
        .eq("job_id", job.id);

      if (assignmentResetError) {
        setFormError(assignmentResetError.message);
        setQaSavingJobId(null);
        return;
      }
    }

    setStatusText(selectedQaStatus === "needs_rework" ? "Rework requested and assignments reset." : "QA review saved.");
    setQaSavingJobId(null);
    await loadData();
  };

  return (
    <section className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1.4fr]">
      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Create Weekly Ticket</h2>
        <p className="mt-2 text-sm text-slate-600">Assign tickets by clean type, worker, and exact areas (cabinets, windows, etc.).</p>

        <form className="mt-6 space-y-4" onSubmit={createTicket}>
          <label className="block text-sm font-medium text-slate-700">
            Ticket Title
            <input
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Address
            <input
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Clean Type
              <select
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={form.cleanType}
                onChange={(event) => setForm((prev) => ({ ...prev, cleanType: event.target.value }))}
              >
                {CLEAN_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Priority
              <select
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={form.priority}
                onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Week Start
              <input
                type="date"
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={form.assignedWeekStart}
                onChange={(event) => setForm((prev) => ({ ...prev, assignedWeekStart: event.target.value }))}
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Lead Worker
              <select
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={form.workerId}
                onChange={(event) => setForm((prev) => ({ ...prev, workerId: event.target.value }))}
              >
                <option value="">Unassigned</option>
                {employeeOptions.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.full_name ?? employee.id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Checklist Template (optional)
            <select
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={form.checklistTemplateId}
              onChange={(event) => setForm((prev) => ({ ...prev, checklistTemplateId: event.target.value }))}
            >
              <option value="">No template</option>
              {checklistTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} ({template.locale})
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Areas to Clean (comma separated)
            <input
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={form.areasCsv}
              onChange={(event) => setForm((prev) => ({ ...prev, areasCsv: event.target.value }))}
              placeholder="cabinets, windows, baseboards"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Scope Notes
            <textarea
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              rows={3}
              value={form.scope}
              onChange={(event) => setForm((prev) => ({ ...prev, scope: event.target.value }))}
              placeholder="Special instructions, lockbox, materials left by previous trades..."
            />
          </label>

          {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
          {statusText ? <p className="text-sm text-green-700">{statusText}</p> : null}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-70"
          >
            {isSaving ? "Saving..." : "Create Ticket"}
          </button>
        </form>
      </article>

      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Ticket Board</h2>
          <button className="text-sm font-medium text-slate-700 underline" onClick={() => void loadData()} type="button">
            Refresh
          </button>
        </div>

        {isLoading ? <p className="mt-4 text-sm text-slate-500">Loading tickets...</p> : null}

        <div className="mt-4 space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-md border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{job.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{job.address}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatCleanType(job.clean_type)} • {formatPriority(job.priority)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                    value={job.status}
                    onChange={(event) => void updateStatus(job.id, event.target.value)}
                  >
                    {JOB_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700"
                    onClick={() => void duplicateTicket(job)}
                  >
                    Duplicate
                  </button>
                </div>
              </div>

              {job.areas && job.areas.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.areas.map((area) => (
                    <span key={area} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                      {area}
                    </span>
                  ))}
                </div>
              ) : null}

              <p className="mt-3 text-sm text-slate-600">{job.scope || "No scope notes."}</p>

              <div className="mt-3 text-xs text-slate-500">
                {job.job_assignments.length > 0
                  ? `Assigned: ${job.job_assignments
                      .map(
                        (assignment) => assignment.profiles?.[0]?.full_name ?? assignment.employee_id.slice(0, 8),
                      )
                      .join(", ")}`
                  : "Unassigned"}
                {job.duplicate_source_job_id ? " • Duplicated ticket" : ""}
              </div>

              <div className="mt-4 rounded-md border border-slate-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">QA Review</p>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-medium text-slate-700">
                    QA Status
                    <select
                      className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs"
                      value={qaStatusByJob[job.id] ?? job.qa_status}
                      onChange={(event) =>
                        setQaStatusByJob((prev) => ({
                          ...prev,
                          [job.id]: event.target.value as JobRow["qa_status"],
                        }))
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="flagged">Flagged</option>
                      <option value="needs_rework">Needs Rework</option>
                    </select>
                  </label>

                  <button
                    type="button"
                    className="self-end rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-70"
                    disabled={qaSavingJobId === job.id}
                    onClick={() => void saveQaReview(job)}
                  >
                    {qaSavingJobId === job.id ? "Saving..." : "Save QA"}
                  </button>
                </div>

                <label className="mt-3 block text-xs font-medium text-slate-700">
                  QA Notes
                  <textarea
                    rows={2}
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs"
                    value={qaNotesByJob[job.id] ?? ""}
                    onChange={(event) =>
                      setQaNotesByJob((prev) => ({
                        ...prev,
                        [job.id]: event.target.value,
                      }))
                    }
                    placeholder="Rework details, verification notes, and completion criteria"
                  />
                </label>
              </div>

              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Issue Reports</p>
                {job.issue_reports && job.issue_reports.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {job.issue_reports.map((issue) => (
                      <li key={issue.id} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                        <p>{issue.description}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">{issue.status}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">No issues reported.</p>
                )}
              </div>
            </div>
          ))}

          {!isLoading && jobs.length === 0 ? <p className="text-sm text-slate-500">No tickets yet.</p> : null}
        </div>
      </article>
    </section>
  );
}
