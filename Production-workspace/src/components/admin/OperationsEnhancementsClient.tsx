"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type ChecklistItem = {
  id: string;
  item_text: string;
  sort_order: number;
  is_completed: boolean;
  completed_at: string | null;
  completed_by: string | null;
};

type JobMessage = {
  id: string;
  message_text: string;
  created_at: string;
};

type IssueReport = {
  id: string;
  description: string;
  status: string;
};

type JobPhoto = {
  id: string;
  storage_path: string;
  created_at: string;
};

type JobOps = {
  id: string;
  title: string;
  address: string;
  status: string;
  qa_status: "pending" | "approved" | "flagged" | "needs_rework";
  qa_notes: string | null;
  qa_reviewed_at: string | null;
  qa_reviewed_by: string | null;
  scope: string | null;
  client_id: string | null;
  checklist_template_id: string | null;
  job_messages: JobMessage[] | null;
  job_checklist_items: ChecklistItem[] | null;
  issue_reports: IssueReport[] | null;
  job_photos: JobPhoto[] | null;
};

type TemplateRow = {
  id: string;
  name: string;
  locale: string;
  description: string | null;
  checklist_template_items: { id: string; item_text: string; sort_order: number }[] | null;
};

type QaFilter = "all" | "pending" | "flagged" | "needs_rework" | "approved";

const QA_FILTERS: { value: QaFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "flagged", label: "Flagged" },
  { value: "needs_rework", label: "Rework" },
  { value: "approved", label: "Approved" },
];

const QA_STATUS_OPTIONS: {
  value: JobOps["qa_status"];
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "flagged", label: "Flagged" },
  { value: "needs_rework", label: "Needs Rework" },
];

export function OperationsEnhancementsClient() {
  const [jobs, setJobs] = useState<JobOps[]>([]);
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [qaFilter, setQaFilter] = useState<QaFilter>("all");

  const [expandedChecklist, setExpandedChecklist] = useState<Record<string, boolean>>({});
  const [expandedQa, setExpandedQa] = useState<Record<string, boolean>>({});

  const [selectedTemplateByJob, setSelectedTemplateByJob] = useState<Record<string, string>>({});
  const [isApplyingTemplateForJob, setIsApplyingTemplateForJob] = useState<string | null>(null);

  const [qaStatusByJob, setQaStatusByJob] = useState<Record<string, JobOps["qa_status"]>>({});
  const [qaNotesByJob, setQaNotesByJob] = useState<Record<string, string>>({});
  const [qaSigningJobId, setQaSigningJobId] = useState<string | null>(null);

  const [messageByJob, setMessageByJob] = useState<Record<string, string>>({});
  const [reportEmailByJob, setReportEmailByJob] = useState<Record<string, string>>({});
  const [isSendingReportForJob, setIsSendingReportForJob] = useState<string | null>(null);

  const [templateName, setTemplateName] = useState("");
  const [templateLocale, setTemplateLocale] = useState("es");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateItemsRaw, setTemplateItemsRaw] = useState("Limpiar ventanas\nLimpiar gabinetes\nRevisar baño final");
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorText(null);
    const supabase = createClient();

    const [jobsResult, templatesResult] = await Promise.all([
      supabase
        .from("jobs")
        .select(
          [
            "id",
            "title",
            "address",
            "status",
            "qa_status",
            "qa_notes",
            "qa_reviewed_at",
            "qa_reviewed_by",
            "scope",
            "client_id",
            "checklist_template_id",
            "job_messages(id, message_text, created_at)",
            "job_checklist_items(id, item_text, sort_order, is_completed, completed_at, completed_by)",
            "issue_reports(id, description, status)",
            "job_photos(id, storage_path, created_at)",
          ].join(", "),
        )
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("checklist_templates")
        .select("id, name, locale, description, checklist_template_items(id, item_text, sort_order)")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    if (jobsResult.error || templatesResult.error) {
      setErrorText(jobsResult.error?.message ?? templatesResult.error?.message ?? "Failed loading operations data.");
      setIsLoading(false);
      return;
    }

    const loadedJobs = (jobsResult.data as unknown as JobOps[]) ?? [];
    setJobs(loadedJobs);
    setTemplates((templatesResult.data as TemplateRow[]) ?? []);

    const nextQaStatus: Record<string, JobOps["qa_status"]> = {};
    const nextQaNotes: Record<string, string> = {};
    for (const job of loadedJobs) {
      nextQaStatus[job.id] = job.qa_status;
      nextQaNotes[job.id] = job.qa_notes ?? "";
    }
    setQaStatusByJob(nextQaStatus);
    setQaNotesByJob(nextQaNotes);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadData]);

  const filteredJobs = useMemo(() => {
    if (qaFilter === "all") {
      return jobs;
    }

    return jobs.filter((job) => job.qa_status === qaFilter);
  }, [jobs, qaFilter]);

  const qaCounts = useMemo(() => {
    const counts: Record<QaFilter, number> = {
      all: jobs.length,
      pending: 0,
      flagged: 0,
      needs_rework: 0,
      approved: 0,
    };

    for (const job of jobs) {
      if (job.qa_status in counts) {
        counts[job.qa_status as QaFilter] += 1;
      }
    }

    return counts;
  }, [jobs]);

  const sendMessage = async (jobId: string) => {
    const messageText = messageByJob[jobId]?.trim();
    if (!messageText) {
      setErrorText("Enter a message before sending.");
      return;
    }

    setErrorText(null);
    setStatusText(null);
    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setErrorText(authError?.message ?? "Unable to validate session.");
      return;
    }

    const { error } = await supabase.from("job_messages").insert({
      job_id: jobId,
      sender_id: user.id,
      message_text: messageText,
      is_internal: false,
    });

    if (error) {
      setErrorText(error.message);
      return;
    }

    setMessageByJob((prev) => ({ ...prev, [jobId]: "" }));
    setStatusText("Job message sent.");
    await loadData();
  };

  const createTemplate = async () => {
    const name = templateName.trim();
    const items = templateItemsRaw
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!name || items.length === 0) {
      setErrorText("Template name and at least one checklist item are required.");
      return;
    }

    setErrorText(null);
    setStatusText(null);
    setIsSavingTemplate(true);
    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setErrorText(authError?.message ?? "Unable to validate session.");
      setIsSavingTemplate(false);
      return;
    }

    const { data: template, error: templateError } = await supabase
      .from("checklist_templates")
      .insert({
        name,
        locale: templateLocale,
        description: templateDescription || null,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (templateError || !template) {
      setErrorText(templateError?.message ?? "Unable to create checklist template.");
      setIsSavingTemplate(false);
      return;
    }

    const { error: itemsError } = await supabase.from("checklist_template_items").insert(
      items.map((item, index) => ({
        template_id: template.id,
        item_text: item,
        sort_order: index,
      })),
    );

    if (itemsError) {
      setErrorText(itemsError.message);
      setIsSavingTemplate(false);
      return;
    }

    setTemplateName("");
    setTemplateDescription("");
    setTemplateItemsRaw("");
    setStatusText("Checklist template created.");
    setIsSavingTemplate(false);
    await loadData();
  };

  const deleteTemplate = async (templateId: string) => {
    setErrorText(null);
    setStatusText(null);
    const supabase = createClient();

    const { error } = await supabase.from("checklist_templates").delete().eq("id", templateId);

    if (error) {
      setErrorText(error.message);
      return;
    }

    setStatusText("Template deleted.");
    await loadData();
  };

  const applyTemplateToJob = async (jobId: string) => {
    const templateId = selectedTemplateByJob[jobId];
    if (!templateId) {
      setErrorText("Select a template to apply.");
      return;
    }

    setErrorText(null);
    setStatusText(null);
    setIsApplyingTemplateForJob(jobId);
    const supabase = createClient();

    const { data: templateItems, error: fetchError } = await supabase
      .from("checklist_template_items")
      .select("item_text, sort_order")
      .eq("template_id", templateId)
      .order("sort_order", { ascending: true });

    if (fetchError || !templateItems || templateItems.length === 0) {
      setErrorText(fetchError?.message ?? "Template has no items.");
      setIsApplyingTemplateForJob(null);
      return;
    }

    const { error: insertError } = await supabase
      .from("job_checklist_items")
      .insert(
        templateItems.map((item) => ({
          job_id: jobId,
          item_text: item.item_text,
          sort_order: item.sort_order,
        })),
      );

    if (insertError) {
      if (insertError.code === "23505") {
        setErrorText("Some checklist items already exist for this job. Clear existing items first.");
      } else {
        setErrorText(insertError.message);
      }
      setIsApplyingTemplateForJob(null);
      return;
    }

    await supabase.from("jobs").update({ checklist_template_id: templateId }).eq("id", jobId);

    setSelectedTemplateByJob((prev) => ({ ...prev, [jobId]: "" }));
    setStatusText("Checklist template applied to job.");
    setIsApplyingTemplateForJob(null);
    await loadData();
  };

  const clearJobChecklist = async (jobId: string) => {
    setErrorText(null);
    setStatusText(null);
    const supabase = createClient();

    const { error } = await supabase.from("job_checklist_items").delete().eq("job_id", jobId);

    if (error) {
      setErrorText(error.message);
      return;
    }

    await supabase.from("jobs").update({ checklist_template_id: null }).eq("id", jobId);

    setStatusText("Checklist cleared — ready for new template.");
    await loadData();
  };

  const toggleChecklistItem = async (itemId: string, currentlyCompleted: boolean) => {
    setErrorText(null);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const patch = currentlyCompleted
      ? { is_completed: false, completed_at: null, completed_by: null }
      : {
          is_completed: true,
          completed_at: new Date().toISOString(),
          completed_by: user?.id ?? null,
        };

    setJobs((prev) =>
      prev.map((job) => ({
        ...job,
        job_checklist_items: (job.job_checklist_items ?? []).map((item) =>
          item.id === itemId
            ? {
                ...item,
                is_completed: !currentlyCompleted,
                completed_at: patch.completed_at ?? null,
                completed_by: patch.completed_by ?? null,
              }
            : item,
        ),
      })),
    );

    const { error } = await supabase.from("job_checklist_items").update(patch).eq("id", itemId);

    if (error) {
      setErrorText(error.message);
      await loadData();
    }
  };

  const saveQaSignOff = async (job: JobOps) => {
    const selectedStatus = qaStatusByJob[job.id] ?? job.qa_status;
    const notes = qaNotesByJob[job.id]?.trim() || null;

    setErrorText(null);
    setStatusText(null);
    setQaSigningJobId(job.id);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const jobPatch: Record<string, unknown> = {
      qa_status: selectedStatus,
      qa_notes: notes,
      qa_reviewed_at: new Date().toISOString(),
      qa_reviewed_by: user?.id ?? null,
    };

    if (selectedStatus === "approved") {
      jobPatch.status = "completed";
    } else if (selectedStatus === "needs_rework") {
      jobPatch.status = "in_progress";
    }

    const { error: jobError } = await supabase.from("jobs").update(jobPatch).eq("id", job.id);

    if (jobError) {
      setErrorText(jobError.message);
      setQaSigningJobId(null);
      return;
    }

    if (selectedStatus === "needs_rework") {
      const [assignmentResult, checklistResult] = await Promise.all([
        supabase
          .from("job_assignments")
          .update({
            status: "assigned",
            started_at: null,
            completed_at: null,
          })
          .eq("job_id", job.id),
        supabase
          .from("job_checklist_items")
          .update({
            is_completed: false,
            completed_at: null,
            completed_by: null,
          })
          .eq("job_id", job.id),
      ]);

      if (assignmentResult.error || checklistResult.error) {
        setErrorText(
          assignmentResult.error?.message ??
            checklistResult.error?.message ??
            "Failed resetting assignments or checklist.",
        );
        setQaSigningJobId(null);
        return;
      }
    }

    let autoReportWarning: string | null = null;
    const shouldAutoTriggerReport =
      selectedStatus === "approved" && job.qa_status !== "approved";

    if (shouldAutoTriggerReport) {
      try {
        const response = await fetch("/api/completion-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId: job.id,
            autoTriggered: true,
          }),
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          autoReportWarning =
            body?.error ??
            `Completion report auto-trigger failed (${response.status}).`;
        }
      } catch (error) {
        autoReportWarning =
          error instanceof Error
            ? error.message
            : "Completion report auto-trigger failed.";
      }
    }

    const messageMap: Record<string, string> = {
      approved: "QA approved — job marked complete.",
      flagged: "QA flagged for review.",
      needs_rework: "Rework requested — assignments and checklist reset.",
      pending: "QA status reset to pending.",
    };

    const baseMessage = messageMap[selectedStatus] ?? "QA review saved.";
    setStatusText(
      autoReportWarning
        ? `${baseMessage} Report warning: ${autoReportWarning}`
        : baseMessage,
    );
    setQaSigningJobId(null);
    await loadData();
  };

  const sendCompletionReport = async (jobId: string) => {
    const recipientEmail = reportEmailByJob[jobId]?.trim() || undefined;
    setErrorText(null);
    setStatusText(null);
    setIsSendingReportForJob(jobId);

    try {
      const response = await fetch("/api/completion-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, recipientEmail }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setErrorText(
          body?.error ?? `Report request failed (${response.status}).`,
        );
        return;
      }

      const payload = (await response.json()) as { emailed?: boolean };
      setStatusText(
        payload.emailed
          ? "Completion report generated and emailed."
          : "Completion report generated.",
      );
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Report request failed.",
      );
    } finally {
      setIsSendingReportForJob(null);
    }
  };

  const toggleChecklistExpanded = (jobId: string) => {
    setExpandedChecklist((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const toggleQaExpanded = (jobId: string) => {
    setExpandedQa((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const getChecklistProgress = (
    items: ChecklistItem[] | null,
  ): { completed: number; total: number; percent: number } => {
    const all = items ?? [];
    const completed = all.filter((item) => item.is_completed).length;
    const total = all.length;
    return {
      completed,
      total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const recentTemplates = useMemo(() => templates.slice(0, 8), [templates]);

  return (
    <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.6fr]">
      <div className="space-y-6">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Checklist Templates
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Create reusable cleaning checklists for faster, consistent
            ticket setup.
          </p>

          <div className="mt-5 space-y-3">
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="Template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <select
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={templateLocale}
                onChange={(e) => setTemplateLocale(e.target.value)}
              >
                <option value="es">Spanish (es)</option>
                <option value="en">English (en)</option>
              </select>
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Description (optional)"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
              />
            </div>

            <textarea
              rows={5}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="One checklist item per line"
              value={templateItemsRaw}
              onChange={(e) => setTemplateItemsRaw(e.target.value)}
            />

            <button
              type="button"
              className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-70"
              disabled={isSavingTemplate}
              onClick={() => void createTemplate()}
            >
              {isSavingTemplate ? "Saving..." : "Create Template"}
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Recent Templates
            </p>

            {recentTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-start justify-between gap-2 rounded-md border border-slate-200 p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {template.name}
                  </p>
                  {template.description ? (
                    <p className="mt-0.5 text-xs text-slate-500 truncate">
                      {template.description}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs text-slate-500">
                    {template.locale.toUpperCase()} •{" "}
                    {(template.checklist_template_items ?? []).length} items
                  </p>
                  <ul className="mt-1.5 space-y-0.5">
                    {(template.checklist_template_items ?? [])
                      .slice(0, 3)
                      .map((item) => (
                        <li
                          key={item.id}
                          className="text-[11px] text-slate-400"
                        >
                          • {item.item_text}
                        </li>
                      ))}
                    {(template.checklist_template_items ?? []).length > 3 ? (
                      <li className="text-[11px] text-slate-400 italic">
                        +
                        {(template.checklist_template_items ?? []).length - 3}{" "}
                        more
                      </li>
                    ) : null}
                  </ul>
                </div>

                <button
                  type="button"
                  className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                  onClick={() => void deleteTemplate(template.id)}
                  title="Delete template"
                >
                  Delete
                </button>
              </div>
            ))}

            {recentTemplates.length === 0 ? (
              <p className="text-xs text-slate-500">No templates yet.</p>
            ) : null}
          </div>
        </article>
      </div>

      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Operations & QA Review
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Review checklists, sign off on quality, send completion
              reports, and message by job.
            </p>
          </div>
          <button
            type="button"
            className="text-sm font-medium text-slate-700 underline"
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

        <div className="mt-4 flex flex-wrap gap-2">
          {QA_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                qaFilter === filter.value
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              onClick={() => setQaFilter(filter.value)}
            >
              {filter.label}
              <span className="ml-1.5 opacity-70">
                {qaCounts[filter.value]}
              </span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="mt-4 text-sm text-slate-500">
            Loading operations data...
          </p>
        ) : null}

        <div className="mt-4 space-y-4">
          {filteredJobs.map((job) => {
            const progress = getChecklistProgress(job.job_checklist_items);
            const isChecklistOpen = expandedChecklist[job.id] ?? false;
            const isQaOpen = expandedQa[job.id] ?? false;
            const hasChecklist = progress.total > 0;

            return (
              <div
                key={job.id}
                className="rounded-md border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {job.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {job.address}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Status: {job.status} • QA:{" "}
                      <span
                        className={
                          job.qa_status === "approved"
                            ? "text-green-600 font-medium"
                            : job.qa_status === "needs_rework"
                              ? "text-red-600 font-medium"
                              : job.qa_status === "flagged"
                                ? "text-amber-600 font-medium"
                                : "text-slate-500"
                        }
                      >
                        {job.qa_status}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>
                      Issues: {(job.issue_reports ?? []).length}
                    </span>
                    <span>
                      Messages: {(job.job_messages ?? []).length}
                    </span>
                    <span>
                      Photos: {(job.job_photos ?? []).length}
                    </span>
                  </div>
                </div>

                {hasChecklist ? (
                  <div className="mt-3">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between text-left"
                      onClick={() => toggleChecklistExpanded(job.id)}
                    >
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Checklist: {progress.completed}/{progress.total} (
                        {progress.percent}%)
                      </span>
                      <span className="text-xs text-slate-400">
                        {isChecklistOpen ? "▲ Hide" : "▼ Show"}
                      </span>
                    </button>

                    <div className="mt-1.5 h-2 w-full rounded-full bg-slate-100">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          progress.percent === 100
                            ? "bg-green-500"
                            : progress.percent >= 50
                              ? "bg-blue-500"
                              : "bg-amber-500"
                        }`}
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>

                    {isChecklistOpen ? (
                      <div className="mt-2 space-y-1.5">
                        {(job.job_checklist_items ?? [])
                          .sort((a, b) => a.sort_order - b.sort_order)
                          .map((item) => (
                            <label
                              key={item.id}
                              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50"
                            >
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-300 text-slate-900"
                                checked={item.is_completed}
                                onChange={() =>
                                  void toggleChecklistItem(
                                    item.id,
                                    item.is_completed,
                                  )
                                }
                              />
                              <span
                                className={`text-sm ${
                                  item.is_completed
                                    ? "text-slate-400 line-through"
                                    : "text-slate-700"
                                }`}
                              >
                                {item.item_text}
                              </span>
                            </label>
                          ))}

                        <button
                          type="button"
                          className="mt-1 text-xs text-red-500 hover:text-red-700"
                          onClick={() => void clearJobChecklist(job.id)}
                        >
                          Clear all checklist items
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="mt-3 rounded-md border border-dashed border-slate-300 p-3">
                    <p className="text-xs text-slate-500">
                      No checklist items. Apply a template:
                    </p>
                    <div className="mt-2 flex gap-2">
                      <select
                        className="flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-xs"
                        value={selectedTemplateByJob[job.id] ?? ""}
                        onChange={(e) =>
                          setSelectedTemplateByJob((prev) => ({
                            ...prev,
                            [job.id]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select template...</option>
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.locale.toUpperCase()},{" "}
                            {(t.checklist_template_items ?? []).length} items)
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="shrink-0 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-70"
                        disabled={
                          isApplyingTemplateForJob === job.id ||
                          !selectedTemplateByJob[job.id]
                        }
                        onClick={() => void applyTemplateToJob(job.id)}
                      >
                        {isApplyingTemplateForJob === job.id
                          ? "Applying..."
                          : "Apply"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-3">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between text-left"
                    onClick={() => toggleQaExpanded(job.id)}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      QA Sign-Off
                    </span>
                    <span className="text-xs text-slate-400">
                      {isQaOpen ? "▲ Hide" : "▼ Show"}
                    </span>
                  </button>

                  {isQaOpen ? (
                    <div className="mt-2 rounded-md border border-slate-200 p-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="text-xs font-medium text-slate-700">
                          QA Status
                          <select
                            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs"
                            value={
                              qaStatusByJob[job.id] ?? job.qa_status
                            }
                            onChange={(e) =>
                              setQaStatusByJob((prev) => ({
                                ...prev,
                                [job.id]: e.target
                                  .value as JobOps["qa_status"],
                              }))
                            }
                          >
                            {QA_STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <button
                          type="button"
                          className="self-end rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-70"
                          disabled={qaSigningJobId === job.id}
                          onClick={() => void saveQaSignOff(job)}
                        >
                          {qaSigningJobId === job.id
                            ? "Saving..."
                            : "Sign Off"}
                        </button>
                      </div>

                      <label className="mt-3 block text-xs font-medium text-slate-700">
                        QA Notes
                        <textarea
                          rows={2}
                          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs"
                          value={qaNotesByJob[job.id] ?? ""}
                          onChange={(e) =>
                            setQaNotesByJob((prev) => ({
                              ...prev,
                              [job.id]: e.target.value,
                            }))
                          }
                          placeholder="Rework details, verification notes, completion criteria..."
                        />
                      </label>

                      {job.qa_reviewed_at ? (
                        <p className="mt-2 text-[11px] text-slate-400">
                          Last reviewed:{" "}
                          {new Date(job.qa_reviewed_at).toLocaleString()}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                  <input
                    className="rounded-md border border-slate-300 px-3 py-2 text-xs"
                    placeholder="GC email for completion report (optional)"
                    value={reportEmailByJob[job.id] ?? ""}
                    onChange={(e) =>
                      setReportEmailByJob((prev) => ({
                        ...prev,
                        [job.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    className="rounded-md bg-[#0A1628] px-3 py-2 text-xs font-medium text-white hover:bg-[#1E293B] disabled:opacity-70"
                    disabled={isSendingReportForJob === job.id}
                    onClick={() => void sendCompletionReport(job.id)}
                  >
                    {isSendingReportForJob === job.id
                      ? "Sending..."
                      : "Send Report"}
                  </button>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                  <input
                    className="rounded-md border border-slate-300 px-3 py-2 text-xs"
                    placeholder="Add job message for this site"
                    value={messageByJob[job.id] ?? ""}
                    onChange={(e) =>
                      setMessageByJob((prev) => ({
                        ...prev,
                        [job.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => void sendMessage(job.id)}
                  >
                    Send Message
                  </button>
                </div>

                {(job.job_messages ?? []).length > 0 ? (
                  <ul className="mt-3 space-y-1">
                    {(job.job_messages ?? []).slice(0, 3).map((msg) => (
                      <li
                        key={msg.id}
                        className="rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-600"
                      >
                        {msg.message_text}
                        <span className="ml-2 text-[11px] text-slate-400">
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {(job.issue_reports ?? []).length > 0 ? (
                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Issues ({(job.issue_reports ?? []).length})
                    </p>
                    <ul className="mt-1.5 space-y-1.5">
                      {(job.issue_reports ?? []).map((issue) => (
                        <li
                          key={issue.id}
                          className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
                        >
                          <p>{issue.description}</p>
                          <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">
                            {issue.status}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            );
          })}

          {!isLoading && filteredJobs.length === 0 ? (
            <p className="text-sm text-slate-500">
              {qaFilter === "all"
                ? "No jobs found."
                : `No jobs with QA status "${qaFilter}".`}
            </p>
          ) : null}
        </div>
      </article>
    </section>
  );
}
