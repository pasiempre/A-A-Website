"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type JobOps = {
  id: string;
  title: string;
  address: string;
  status: string;
  qa_status: string;
  scope: string | null;
  client_id: string | null;
  job_messages: { id: string; message_text: string; created_at: string }[] | null;
  job_checklist_items: { id: string; item_text: string; is_completed: boolean }[] | null;
  issue_reports: { id: string; description: string; status: string }[] | null;
};

type TemplateRow = {
  id: string;
  name: string;
  locale: string;
  description: string | null;
  checklist_template_items: { id: string; item_text: string; sort_order: number }[] | null;
};

export function OperationsEnhancementsClient() {
  const [jobs, setJobs] = useState<JobOps[]>([]);
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
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
          "id, title, address, status, qa_status, scope, client_id, job_messages(id, message_text, created_at), job_checklist_items(id, item_text, is_completed), issue_reports(id, description, status)",
        )
        .order("created_at", { ascending: false })
        .limit(25),
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

    setJobs((jobsResult.data as JobOps[]) ?? []);
    setTemplates((templatesResult.data as TemplateRow[]) ?? []);
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

  const sendCompletionReport = async (jobId: string) => {
    const recipientEmail = reportEmailByJob[jobId]?.trim() || undefined;
    setErrorText(null);
    setStatusText(null);
    setIsSendingReportForJob(jobId);

    const response = await fetch("/api/completion-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId,
        recipientEmail,
      }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setErrorText(body?.error ?? `Report request failed (${response.status}).`);
      setIsSendingReportForJob(null);
      return;
    }

    const payload = (await response.json()) as { emailed?: boolean };
    setStatusText(payload.emailed ? "Completion report generated and emailed." : "Completion report generated.");
    setIsSendingReportForJob(null);
  };

  const recentTemplates = useMemo(() => templates.slice(0, 8), [templates]);

  return (
    <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Checklist Templates</h2>
        <p className="mt-1 text-sm text-slate-600">Create reusable cleaning checklists for faster, consistent ticket setup.</p>

        <div className="mt-5 space-y-3">
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Template name"
            value={templateName}
            onChange={(event) => setTemplateName(event.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={templateLocale}
              onChange={(event) => setTemplateLocale(event.target.value)}
            >
              <option value="es">Spanish (es)</option>
              <option value="en">English (en)</option>
            </select>
            <input
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="Template description"
              value={templateDescription}
              onChange={(event) => setTemplateDescription(event.target.value)}
            />
          </div>

          <textarea
            rows={5}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="One item per line"
            value={templateItemsRaw}
            onChange={(event) => setTemplateItemsRaw(event.target.value)}
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
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recent Templates</p>
          {recentTemplates.map((template) => (
            <div key={template.id} className="rounded-md border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-900">{template.name}</p>
              <p className="mt-1 text-xs text-slate-500">{template.locale.toUpperCase()} • {(template.checklist_template_items ?? []).length} items</p>
            </div>
          ))}
          {recentTemplates.length === 0 ? <p className="text-xs text-slate-500">No templates yet.</p> : null}
        </div>
      </article>

      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">Completion + Messaging Ops</h2>
            <p className="mt-1 text-sm text-slate-600">Send completion reports, review checklist progress, and message by job location.</p>
          </div>
          <button type="button" className="text-sm font-medium text-slate-700 underline" onClick={() => void loadData()}>
            Refresh
          </button>
        </div>

        {statusText ? <p className="mt-3 text-sm text-green-700">{statusText}</p> : null}
        {errorText ? <p className="mt-3 text-sm text-red-600">{errorText}</p> : null}
        {isLoading ? <p className="mt-4 text-sm text-slate-500">Loading operations data...</p> : null}

        <div className="mt-4 space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-md border border-slate-200 p-4">
              <h3 className="text-base font-semibold text-slate-900">{job.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{job.address}</p>
              <p className="mt-1 text-xs text-slate-500">Status: {job.status} • QA: {job.qa_status}</p>

              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Checklist: {(job.job_checklist_items ?? []).filter((item) => item.is_completed).length}/
                {(job.job_checklist_items ?? []).length}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Issues: {(job.issue_reports ?? []).length} • Messages: {(job.job_messages ?? []).length}
              </p>

              <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                <input
                  className="rounded-md border border-slate-300 px-3 py-2 text-xs"
                  placeholder="GC email for completion report (optional)"
                  value={reportEmailByJob[job.id] ?? ""}
                  onChange={(event) => setReportEmailByJob((prev) => ({ ...prev, [job.id]: event.target.value }))}
                />
                <button
                  type="button"
                  className="rounded-md bg-[#0A1628] px-3 py-2 text-xs font-medium text-white hover:bg-[#1E293B] disabled:opacity-70"
                  disabled={isSendingReportForJob === job.id}
                  onClick={() => void sendCompletionReport(job.id)}
                >
                  {isSendingReportForJob === job.id ? "Sending..." : "Send Report"}
                </button>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                <input
                  className="rounded-md border border-slate-300 px-3 py-2 text-xs"
                  placeholder="Add job message for this site"
                  value={messageByJob[job.id] ?? ""}
                  onChange={(event) => setMessageByJob((prev) => ({ ...prev, [job.id]: event.target.value }))}
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
                  {(job.job_messages ?? []).slice(0, 3).map((message) => (
                    <li key={message.id} className="rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-600">
                      {message.message_text}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
          {!isLoading && jobs.length === 0 ? <p className="text-sm text-slate-500">No jobs found.</p> : null}
        </div>
      </article>
    </section>
  );
}
