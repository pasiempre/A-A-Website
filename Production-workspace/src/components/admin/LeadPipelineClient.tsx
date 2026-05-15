"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { announceStatus } from "@/lib/status-announcer";
import { createClient } from "@/lib/supabase/client";

type LeadStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "converted"
  | "lost"
  | "followup";

type EmployeeOption = {
  id: string;
  full_name: string | null;
  role: "admin" | "employee";
};

type LeadQuoteRow = {
  lead_id?: string;
  id: string;
  quote_number: string | null;
  status: string;
  delivery_status: string;
  delivery_error: string | null;
  total: number;
  valid_until: string | null;
  created_at: string;
};

type LeadRow = {
  id: string;
  name: string;
  company_name: string | null;
  phone: string;
  email: string | null;
  service_type: string | null;
  timeline: string | null;
  description: string | null;
  notes: string | null;
  status: LeadStatus;
  created_at: string;
  converted_client_id: string | null;
  quotes: LeadQuoteRow[] | null;
};

type QuoteDraft = {
  siteAddress: string;
  scopeDescription: string;
  lineDescription: string;
  quantity: string;
  unit: "flat" | "unit" | "sqft" | "hour";
  unitPrice: string;
  taxAmount: string;
  validUntil: string;
  notes: string;
};

type JobDraft = {
  title: string;
  scheduledStart: string;
  employeeId: string;
};

type DispatchPreset = {
  day: "today" | "tomorrow" | "next_business_day" | "custom";
  window: "morning" | "midday" | "afternoon" | "custom";
};

type QuoteTemplateLineItem = {
  description: string;
  quantity: number;
  unit: "flat" | "unit" | "sqft" | "hour";
  unit_price: number;
};

type QuoteTemplateRow = {
  id: string;
  name: string;
  service_type: string;
  default_line_items: QuoteTemplateLineItem[];
  base_price: number;
  pricing_model: "flat" | "per_sqft" | "per_unit" | "per_hour";
};

const statusColumns: { key: LeadStatus; label: string }[] = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "quoted", label: "Quoted" },
  { key: "converted", label: "Converted" },
  { key: "lost", label: "Lost" },
  { key: "followup", label: "Follow-up" },
];

const defaultQuoteDraft: QuoteDraft = {
  siteAddress: "",
  scopeDescription: "",
  lineDescription: "Cleaning scope",
  quantity: "1",
  unit: "flat",
  unitPrice: "0",
  taxAmount: "0",
  validUntil: "",
  notes: "",
};

const defaultJobDraft: JobDraft = {
  title: "",
  scheduledStart: "",
  employeeId: "",
};

const defaultDispatchPreset: DispatchPreset = {
  day: "tomorrow",
  window: "morning",
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function statusBadge(status: string) {
  if (status === "accepted") return "bg-emerald-100 text-emerald-800";
  if (status === "declined") return "bg-rose-100 text-rose-800";
  return "bg-slate-100 text-slate-700";
}

function humanizeServiceType(value: string | null | undefined) {
  if (!value) {
    return "General";
  }

  return value
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function humanizePricingModel(value: QuoteTemplateRow["pricing_model"]) {
  if (value === "per_sqft") return "Per Sq Ft";
  if (value === "per_unit") return "Per Unit";
  if (value === "per_hour") return "Per Hour";
  return "Flat";
}

function buildScheduledStartFromPreset(preset: DispatchPreset) {
  const now = new Date();
  const target = new Date(now);

  if (preset.day === "tomorrow") {
    target.setDate(target.getDate() + 1);
  } else if (preset.day === "next_business_day") {
    target.setDate(target.getDate() + 1);
    while (target.getDay() === 0 || target.getDay() === 6) {
      target.setDate(target.getDate() + 1);
    }
  }

  if (preset.window === "morning") {
    target.setHours(9, 0, 0, 0);
  } else if (preset.window === "midday") {
    target.setHours(12, 0, 0, 0);
  } else if (preset.window === "afternoon") {
    target.setHours(15, 0, 0, 0);
  }

  const local = new Date(target.getTime() - target.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function normalizeRelation<T>(relation: T[] | T | null | undefined): T | null {
  if (!relation) return null;
  return Array.isArray(relation) ? relation[0] ?? null : relation;
}

function buildAvailabilityWindow(scheduledStart: string): { startIso: string; endIso: string } | null {
  const parsed = new Date(scheduledStart);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const ninetyMinutes = 90 * 60 * 1000;
  return {
    startIso: new Date(parsed.getTime() - ninetyMinutes).toISOString(),
    endIso: new Date(parsed.getTime() + ninetyMinutes).toISOString(),
  };
}

export function LeadPipelineClient() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [quoteTemplates, setQuoteTemplates] = useState<QuoteTemplateRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [activeQuoteLeadId, setActiveQuoteLeadId] = useState<string | null>(null);
  const [reviewQuoteLeadId, setReviewQuoteLeadId] = useState<string | null>(null);
  const [activeJobLeadId, setActiveJobLeadId] = useState<string | null>(null);
  const [quoteDraftByLead, setQuoteDraftByLead] = useState<Record<string, QuoteDraft>>({});
  const [jobDraftByLead, setJobDraftByLead] = useState<Record<string, JobDraft>>({});
  const [dispatchPresetByLead, setDispatchPresetByLead] = useState<Record<string, DispatchPreset>>({});
  const [busyEmployeeIdsByLead, setBusyEmployeeIdsByLead] = useState<Record<string, string[]>>({});
  const [jobIdByQuoteId, setJobIdByQuoteId] = useState<Record<string, string>>({});
  const [isSavingQuoteForLead, setIsSavingQuoteForLead] = useState<string | null>(null);
  const [isConvertingLead, setIsConvertingLead] = useState<string | null>(null);
  const [isCreatingJobForLead, setIsCreatingJobForLead] = useState<string | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState<string | null>(null);
  const [isCheckingAvailabilityForLead, setIsCheckingAvailabilityForLead] = useState<string | null>(null);
  const [mobileActiveStatus, setMobileActiveStatus] = useState<LeadStatus>("new");

  const sendQuickResponse = async (leadId: string, templateId: string) => {
    if (!templateId) return;
    setIsSendingMessage(leadId);
    setErrorText(null);
    setStatusText(null);

    try {
      const response = await fetch("/api/lead-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, templateId }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: "Failed to send message." }));
        setErrorText(payload.error || "Failed to send message.");
        return;
      }

      setStatusText("Quick response sent via SMS and logged to notes.");
      announceStatus("Quick response sent via SMS and logged to notes.");
      await loadData();
    } catch {
      setErrorText("Error sending message.");
    } finally {
      setIsSendingMessage(null);
    }
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorText(null);

    const supabase = createClient();
    const [leadsResult, profilesResult, templatesResult] = await Promise.all([
      supabase
        .from("leads")
        .select(
          "id, name, phone, email, service_type, timeline, description, notes, status, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("profiles")
        .select("id, full_name, role")
        .in("role", ["admin", "employee"])
        .order("full_name", { ascending: true }),
      supabase
        .from("quote_templates")
        .select("id, name, service_type, default_line_items, base_price, pricing_model")
        .order("created_at", { ascending: false }),
    ]);

    if (leadsResult.error || profilesResult.error || templatesResult.error) {
      setErrorText(
        leadsResult.error?.message
          ?? profilesResult.error?.message
          ?? templatesResult.error?.message
          ?? "Unable to load lead data.",
      );
      setIsLoading(false);
      return;
    }

    const baseLeads: LeadRow[] = (
      (leadsResult.data as Array<
        Pick<
          LeadRow,
          "id" | "name" | "phone" | "email" | "service_type" | "timeline" | "description" | "notes" | "status" | "created_at"
        >
      >) ?? []
    ).map((lead) => ({
      ...lead,
      company_name: null,
      converted_client_id: null,
      quotes: null,
    }));

    // Quotes are loaded separately so lead loading still works when relation metadata is missing.
    const leadIds = baseLeads.map((lead) => lead.id);
    if (leadIds.length > 0) {
      const { data: quoteRows, error: quotesError } = await supabase
        .from("quotes")
        .select("id, lead_id, quote_number, status, delivery_status, delivery_error, total, valid_until, created_at")
        .in("lead_id", leadIds)
        .order("created_at", { ascending: false });

      if (!quotesError && quoteRows) {
        const quotesByLead = new Map<string, LeadRow["quotes"]>();
        for (const quote of quoteRows as LeadQuoteRow[]) {
          if (!quote.lead_id) continue;
          const existing = quotesByLead.get(quote.lead_id) ?? [];
          existing.push(quote);
          quotesByLead.set(quote.lead_id, existing);
        }

        for (const lead of baseLeads) {
          const quotes = quotesByLead.get(lead.id);
          if (quotes && quotes.length > 0) {
            lead.quotes = quotes;
          }
        }
      }
    }

    const normalizedLeads = baseLeads.map((lead) => ({
      ...lead,
      quotes: lead.quotes
        ? [...lead.quotes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        : null,
    }));

    setLeads(normalizedLeads);
    setEmployees((profilesResult.data as EmployeeOption[]) ?? []);
    setQuoteTemplates((templatesResult.data as QuoteTemplateRow[] | null) ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const leadsByStatus = useMemo(() => {
    const grouped: Record<LeadStatus, LeadRow[]> = {
      new: [],
      contacted: [],
      quoted: [],
      converted: [],
      lost: [],
      followup: [],
    };

    for (const lead of leads) {
      if (lead.status in grouped) {
        grouped[lead.status].push(lead);
      } else {
        grouped.followup.push(lead);
      }
    }

    return grouped;
  }, [leads]);

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    setErrorText(null);
    setStatusText(null);

    const patch: { status: LeadStatus; contacted_at?: string } = { status };
    if (status === "contacted") {
      patch.contacted_at = new Date().toISOString();
    }

    try {
      const { error } = await createClient().from("leads").update(patch).eq("id", leadId);
      if (error) {
        setErrorText(error.message);
        return;
      }

      setStatusText("Lead status updated.");
      announceStatus("Lead status updated.");
      await loadData();
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to update lead status.");
    }
  };

  const applyQuoteTemplate = (leadId: string, templateId: string) => {
    if (!templateId) {
      return;
    }

    const template = quoteTemplates.find((item) => item.id === templateId);
    if (!template) {
      return;
    }

    const line = template.default_line_items?.[0] ?? null;
    if (!line) {
      return;
    }

    setQuoteDraftByLead((prev) => ({
      ...prev,
      [leadId]: {
        ...(prev[leadId] ?? defaultQuoteDraft),
        scopeDescription:
          (prev[leadId]?.scopeDescription?.trim() || "")
          || `${template.name} template applied for ${template.service_type.replaceAll("_", " ")}.`,
        lineDescription: line.description,
        quantity: String(line.quantity),
        unit: line.unit,
        unitPrice: String(line.unit_price),
        taxAmount: prev[leadId]?.taxAmount ?? defaultQuoteDraft.taxAmount,
      },
    }));
  };

  const createQuote = async (lead: LeadRow) => {
    const quoteDraft = quoteDraftByLead[lead.id] ?? defaultQuoteDraft;
    const quantity = Number.parseFloat(quoteDraft.quantity || "0");
    const unitPrice = Number.parseFloat(quoteDraft.unitPrice || "0");
    const taxAmount = Number.parseFloat(quoteDraft.taxAmount || "0");

    if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) {
      setErrorText("Enter a valid quantity and unit price before sending quote.");
      return;
    }

    setErrorText(null);
    setStatusText(null);
    setIsSavingQuoteForLead(lead.id);

    try {
      const response = await fetch("/api/quote-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          siteAddress: quoteDraft.siteAddress,
          scopeDescription: quoteDraft.scopeDescription || lead.description,
          lineDescription: quoteDraft.lineDescription,
          quantity,
          unit: quoteDraft.unit,
          unitPrice,
          taxAmount,
          validUntil: quoteDraft.validUntil || null,
          notes: quoteDraft.notes,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            error?: string;
            quoteNumber?: string;
            emailed?: boolean;
            shareUrl?: string;
            deliveryStatus?: string;
            deliveryError?: string | null;
          }
        | null;

      if (!response.ok) {
        setErrorText(payload?.error ?? `Unable to send quote (${response.status}).`);
        return;
      }

      const successMessage = payload?.emailed
        ? `Quote ${payload.quoteNumber} emailed successfully.`
        : payload?.deliveryStatus === "failed" && payload.deliveryError
          ? `Quote ${payload?.quoteNumber} created, but email delivery failed: ${payload.deliveryError}. Share link: ${payload?.shareUrl}`
          : `Quote ${payload?.quoteNumber} created. Share link: ${payload?.shareUrl}`;
      setStatusText(successMessage);
      announceStatus(successMessage);
      setReviewQuoteLeadId(null);
      setActiveQuoteLeadId(null);
      setQuoteDraftByLead((prev) => ({ ...prev, [lead.id]: defaultQuoteDraft }));
      await loadData();
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to send quote.");
    } finally {
      setIsSavingQuoteForLead(null);
    }
  };

  const convertLeadToClient = async (lead: LeadRow) => {
    setErrorText(null);
    setStatusText(null);
    setIsConvertingLead(lead.id);

    const supabase = createClient();

    try {
      let convertedClientId = lead.converted_client_id;
      if (!convertedClientId) {
        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .insert({
            name: lead.company_name || lead.name,
            company_name: lead.company_name,
            phone: lead.phone,
            email: lead.email,
            notes: lead.notes || `Converted from lead ${lead.id}`,
          })
          .select("id")
          .single();

        if (clientError || !clientData) {
          setErrorText(clientError?.message ?? "Unable to create client from lead.");
          return;
        }

        convertedClientId = clientData.id;
      }

      const { error: leadUpdateError } = await supabase
        .from("leads")
        .update({ status: "converted", converted_client_id: convertedClientId })
        .eq("id", lead.id);

      if (leadUpdateError) {
        setErrorText(leadUpdateError.message);
        return;
      }

      setStatusText("Lead converted to client.");
      announceStatus("Lead converted to client.");
      await loadData();
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to convert lead.");
    } finally {
      setIsConvertingLead(null);
    }
  };

  const createJobFromQuote = async (lead: LeadRow, quoteId: string) => {
    const jobDraft = jobDraftByLead[lead.id] ?? defaultJobDraft;
    const busyIds = busyEmployeeIdsByLead[lead.id] ?? [];

    if (jobDraft.employeeId && busyIds.includes(jobDraft.employeeId)) {
      setErrorText("Selected crew member is currently unavailable at that time. Choose another time or crew member.");
      return;
    }

    setErrorText(null);
    setStatusText(null);
    setIsCreatingJobForLead(lead.id);

    try {
      const response = await fetch("/api/quote-create-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId,
          title: jobDraft.title || undefined,
          scheduledStart: jobDraft.scheduledStart || undefined,
          employeeId: jobDraft.employeeId || undefined,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string; existing?: boolean; jobId?: string } | null;
      if (!response.ok) {
        setErrorText(payload?.error ?? `Unable to create job (${response.status}).`);
        return;
      }

      if (payload?.jobId) {
        setJobIdByQuoteId((prev) => ({ ...prev, [quoteId]: payload.jobId! }));
      }

      const successMessage = payload?.existing
        ? `Job already exists for this quote (${payload?.jobId ?? "id unavailable"}).`
        : `Job created from accepted quote (${payload?.jobId ?? "id unavailable"}).`;
      setStatusText(successMessage);
      announceStatus(successMessage);
      setActiveJobLeadId(null);
      setJobDraftByLead((prev) => ({ ...prev, [lead.id]: defaultJobDraft }));
      await loadData();
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to create job from quote.");
    } finally {
      setIsCreatingJobForLead(null);
    }
  };

  const loadCrewAvailabilityForLead = async (leadId: string, scheduledStart: string) => {
    if (!scheduledStart) {
      setBusyEmployeeIdsByLead((prev) => ({ ...prev, [leadId]: [] }));
      return;
    }

    setIsCheckingAvailabilityForLead(leadId);

    const windowBounds = buildAvailabilityWindow(scheduledStart);
    if (!windowBounds) {
      setErrorText("Enter a valid start time.");
      setBusyEmployeeIdsByLead((prev) => ({ ...prev, [leadId]: [] }));
      setIsCheckingAvailabilityForLead(null);
      return;
    }

    const supabase = createClient();
    const [assignmentResult, availabilityResult] = await Promise.all([
      supabase
        .from("job_assignments")
        .select("employee_id, jobs!inner(scheduled_start, status)")
        .gte("jobs.scheduled_start", windowBounds.startIso)
        .lte("jobs.scheduled_start", windowBounds.endIso)
        .in("jobs.status", ["scheduled", "in_progress"]),
      supabase
        .from("employee_availability")
        .select("employee_id")
        .in("status", ["unavailable", "limited"])
        .lt("starts_at", windowBounds.endIso)
        .gt("ends_at", windowBounds.startIso),
    ]);

    if (assignmentResult.error || availabilityResult.error) {
      setErrorText(assignmentResult.error?.message ?? availabilityResult.error?.message ?? "Unable to check availability.");
      setBusyEmployeeIdsByLead((prev) => ({ ...prev, [leadId]: [] }));
      setIsCheckingAvailabilityForLead(null);
      return;
    }

    const assignmentBusyIds = ((assignmentResult.data as { employee_id: string }[] | null) ?? []).map((row) => row.employee_id);
    const unavailableBusyIds = ((availabilityResult.data as { employee_id: string }[] | null) ?? []).map((row) => row.employee_id);
    const busyIds = Array.from(new Set([...assignmentBusyIds, ...unavailableBusyIds]));
    setBusyEmployeeIdsByLead((prev) => ({ ...prev, [leadId]: busyIds }));
    setIsCheckingAvailabilityForLead(null);
  };

  return (
    <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Lead Pipeline</h2>
          <p className="mt-1 text-sm text-slate-600">Track inquiries, send branded quotes, and create jobs from accepted work.</p>
        </div>
        <button type="button" className="text-sm font-medium text-slate-700 underline" onClick={() => void loadData()}>
          Refresh
        </button>
      </div>

      {statusText ? <p className="mt-3 text-sm text-green-700">{statusText}</p> : null}
      {errorText ? <p className="mt-3 text-sm text-red-600">{errorText}</p> : null}
      {isLoading ? <p className="mt-4 text-sm text-slate-500">Loading leads...</p> : null}

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {statusColumns.map((column) => (
          <button
            key={column.key}
            type="button"
            onClick={() => setMobileActiveStatus(column.key)}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium ${
              mobileActiveStatus === column.key
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-700"
            }`}
          >
            {column.label} ({leadsByStatus[column.key]?.length ?? 0})
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
        {statusColumns.map((column) => (
          <article
            key={column.key}
            className={`rounded-md border border-slate-200 bg-slate-50 p-3 ${
              column.key !== mobileActiveStatus ? "hidden lg:block" : ""
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{column.label}</h3>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-600">{leadsByStatus[column.key]?.length ?? 0}</span>
            </div>

            <div className="space-y-3">
              {(leadsByStatus[column.key] ?? []).map((lead) => {
                const latestQuote = normalizeRelation(lead.quotes);
                const quoteDraft = quoteDraftByLead[lead.id] ?? defaultQuoteDraft;
                const jobDraft = jobDraftByLead[lead.id] ?? defaultJobDraft;
                const canCreateJob = latestQuote?.status === "accepted";
                const createdJobId = latestQuote ? jobIdByQuoteId[latestQuote.id] : undefined;
                const draftSubtotal = Number.parseFloat(quoteDraft.quantity || "0") * Number.parseFloat(quoteDraft.unitPrice || "0");
                const matchingTemplates = quoteTemplates.filter((template) => template.service_type === lead.service_type);
                const fallbackTemplates = quoteTemplates.filter((template) => template.service_type !== lead.service_type);
                const hasAnyTemplates = quoteTemplates.length > 0;
                const isSelectedEmployeeUnavailable =
                  Boolean(jobDraft.employeeId)
                  && (busyEmployeeIdsByLead[lead.id] ?? []).includes(jobDraft.employeeId);

                return (
                  <div key={lead.id} className="rounded-md border border-slate-200 bg-white p-3">
                    <p className="text-sm font-semibold text-slate-900">{lead.company_name || lead.name}</p>
                    <p className="mt-1 text-xs text-slate-600">{lead.name}</p>
                    <p className="mt-1 text-xs text-slate-600">Text: {lead.phone || "No phone on file"}</p>
                    {lead.email ? (
                      <p className="mt-1 break-all text-xs text-slate-600">Email: {lead.email}</p>
                    ) : (
                      <p className="mt-1 text-xs text-amber-700">No email on file. Quote will create a share link only.</p>
                    )}
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">
                      {lead.service_type || "general"} • {timeAgo(lead.created_at)}
                    </p>

                    {lead.description ? <p className="mt-2 text-xs text-slate-600">{lead.description}</p> : null}

                    {latestQuote ? (
                      <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                            {latestQuote.quote_number || "Quote"} • ${Number(latestQuote.total ?? 0).toFixed(2)}
                          </p>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${statusBadge(latestQuote.status)}`}>
                            {latestQuote.status}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500">Delivery: {latestQuote.delivery_status}</p>
                        {latestQuote.delivery_error ? <p className="mt-1 text-[11px] text-rose-600">{latestQuote.delivery_error}</p> : null}
                      </div>
                    ) : null}

                    <div className="mt-3 grid gap-2">
                      <select
                        className="rounded-md border border-blue-300 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-800 outline-none disabled:opacity-50"
                        value=""
                        disabled={isSendingMessage === lead.id}
                        onChange={(e) => void sendQuickResponse(lead.id, e.target.value)}
                      >
                        <option value="" disabled>
                          {isSendingMessage === lead.id ? "Sending text..." : "Text Response"}
                        </option>
                        <option value="awaiting_scope">Awaiting Scope</option>
                        <option value="quote_sent">Quote Sent</option>
                        <option value="follow_up">Follow-up</option>
                      </select>

                      <select
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                        value={lead.status}
                        onChange={(event) => void updateLeadStatus(lead.id, event.target.value as LeadStatus)}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                        <option value="followup">Follow-up</option>
                      </select>

                      <button
                        type="button"
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
                        onClick={() => {
                          setActiveQuoteLeadId((prev) => (prev === lead.id ? null : lead.id));
                          setReviewQuoteLeadId((prev) => (prev === lead.id ? null : prev));
                          setQuoteDraftByLead((prev) => ({ ...prev, [lead.id]: prev[lead.id] ?? defaultQuoteDraft }));
                        }}
                      >
                        {activeQuoteLeadId === lead.id ? "Hide Quote" : latestQuote ? "Send New Quote" : "Create Quote"}
                      </button>

                      <button
                        type="button"
                        className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-70"
                        disabled={isConvertingLead === lead.id}
                        onClick={() => void convertLeadToClient(lead)}
                      >
                        {isConvertingLead === lead.id ? "Converting..." : "Convert to Client"}
                      </button>

                      {createdJobId ? (
                        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                          Job created: {createdJobId.slice(0, 8)}
                        </div>
                      ) : canCreateJob ? (
                        <button
                          type="button"
                          className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800"
                          onClick={() => {
                            setActiveJobLeadId((prev) => (prev === lead.id ? null : lead.id));
                            const defaultPreset = dispatchPresetByLead[lead.id] ?? defaultDispatchPreset;
                            const defaultScheduledStart = buildScheduledStartFromPreset(defaultPreset);
                            setJobDraftByLead((prev) => ({
                              ...prev,
                              [lead.id]:
                                prev[lead.id] ??
                                {
                                  ...defaultJobDraft,
                                  title: `${lead.company_name || lead.name} ${lead.service_type ? `- ${lead.service_type}` : "- Cleaning Job"}`,
                                  scheduledStart: defaultScheduledStart,
                                },
                            }));
                            setDispatchPresetByLead((prev) => ({
                              ...prev,
                              [lead.id]: prev[lead.id] ?? defaultDispatchPreset,
                            }));
                            void loadCrewAvailabilityForLead(lead.id, defaultScheduledStart);
                          }}
                        >
                          {activeJobLeadId === lead.id ? "Hide Job Setup" : "Create Job from Quote"}
                        </button>
                      ) : null}
                    </div>

                    {activeQuoteLeadId === lead.id ? (
                      <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
                        <div>
                          <p className="mb-1 text-[11px] font-medium text-slate-600">
                            Template Suggestions for {humanizeServiceType(lead.service_type)}
                          </p>
                          <select
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                            defaultValue=""
                            onChange={(event) => applyQuoteTemplate(lead.id, event.target.value)}
                            disabled={!hasAnyTemplates}
                          >
                            <option value="" disabled>
                              {hasAnyTemplates ? "Apply quick template" : "No templates available"}
                            </option>
                            {matchingTemplates.length > 0 ? (
                              <optgroup label="Best Match">
                                {matchingTemplates.map((template) => (
                                  <option key={template.id} value={template.id}>
                                    {template.name} ({humanizePricingModel(template.pricing_model)})
                                  </option>
                                ))}
                              </optgroup>
                            ) : null}
                            {fallbackTemplates.length > 0 ? (
                              <optgroup label="Other Templates">
                                {fallbackTemplates.map((template) => (
                                  <option key={template.id} value={template.id}>
                                    {template.name} - {humanizeServiceType(template.service_type)} ({humanizePricingModel(template.pricing_model)})
                                  </option>
                                ))}
                              </optgroup>
                            ) : null}
                          </select>
                          {hasAnyTemplates && matchingTemplates.length === 0 ? (
                            <p className="mt-1 text-[11px] text-amber-700">
                              No exact service-type template yet. You can apply a general template, then adjust values.
                            </p>
                          ) : null}
                        </div>

                        <input
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          placeholder="Site address"
                          value={quoteDraft.siteAddress}
                          onChange={(event) =>
                            setQuoteDraftByLead((prev) => ({
                              ...prev,
                              [lead.id]: { ...quoteDraft, siteAddress: event.target.value },
                            }))
                          }
                        />
                        <textarea
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          rows={2}
                          placeholder="Scope description"
                          value={quoteDraft.scopeDescription}
                          onChange={(event) =>
                            setQuoteDraftByLead((prev) => ({
                              ...prev,
                              [lead.id]: { ...quoteDraft, scopeDescription: event.target.value },
                            }))
                          }
                        />
                        <input
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          placeholder="Line item description"
                          value={quoteDraft.lineDescription}
                          onChange={(event) =>
                            setQuoteDraftByLead((prev) => ({
                              ...prev,
                              [lead.id]: { ...quoteDraft, lineDescription: event.target.value },
                            }))
                          }
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                            placeholder="Qty"
                            value={quoteDraft.quantity}
                            onChange={(event) =>
                              setQuoteDraftByLead((prev) => ({
                                ...prev,
                                [lead.id]: { ...quoteDraft, quantity: event.target.value },
                              }))
                            }
                          />
                          <input
                            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                            placeholder="Unit price"
                            value={quoteDraft.unitPrice}
                            onChange={(event) =>
                              setQuoteDraftByLead((prev) => ({
                                ...prev,
                                [lead.id]: { ...quoteDraft, unitPrice: event.target.value },
                              }))
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                            value={quoteDraft.unit}
                            onChange={(event) =>
                              setQuoteDraftByLead((prev) => ({
                                ...prev,
                                [lead.id]: { ...quoteDraft, unit: event.target.value as QuoteDraft["unit"] },
                              }))
                            }
                          >
                            <option value="flat">flat</option>
                            <option value="unit">unit</option>
                            <option value="sqft">sqft</option>
                            <option value="hour">hour</option>
                          </select>
                          <input
                            type="date"
                            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                            value={quoteDraft.validUntil}
                            onChange={(event) =>
                              setQuoteDraftByLead((prev) => ({
                                ...prev,
                                [lead.id]: { ...quoteDraft, validUntil: event.target.value },
                              }))
                            }
                          />
                        </div>
                        <input
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          placeholder="Tax amount"
                          value={quoteDraft.taxAmount}
                          onChange={(event) =>
                            setQuoteDraftByLead((prev) => ({
                              ...prev,
                              [lead.id]: { ...quoteDraft, taxAmount: event.target.value },
                            }))
                          }
                        />
                        <textarea
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          rows={2}
                          placeholder="Quote notes"
                          value={quoteDraft.notes}
                          onChange={(event) =>
                            setQuoteDraftByLead((prev) => ({
                              ...prev,
                              [lead.id]: { ...quoteDraft, notes: event.target.value },
                            }))
                          }
                        />
                        <p className="text-[11px] text-slate-500">
                          Estimated subtotal: ${Number.isFinite(draftSubtotal) ? draftSubtotal.toFixed(2) : "0.00"}
                        </p>
                        {reviewQuoteLeadId === lead.id ? (
                          <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Review Before Sending</p>
                            <p className="mt-1 text-[11px] text-slate-600">Description: {quoteDraft.lineDescription || "Cleaning scope"}</p>
                            <p className="text-[11px] text-slate-600">
                              Quantity: {quoteDraft.quantity || "0"} {quoteDraft.unit} @ ${Number.parseFloat(quoteDraft.unitPrice || "0").toFixed(2)}
                            </p>
                            <p className="text-[11px] text-slate-600">Tax: ${Number.parseFloat(quoteDraft.taxAmount || "0").toFixed(2)}</p>
                            <p className="text-[11px] font-medium text-slate-700">Subtotal: ${Number.isFinite(draftSubtotal) ? draftSubtotal.toFixed(2) : "0.00"}</p>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                className="rounded-md border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-700"
                                onClick={() => setReviewQuoteLeadId(null)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="rounded-md bg-[#0A1628] px-2 py-1.5 text-xs font-medium text-white hover:bg-[#1E293B] disabled:opacity-70"
                                disabled={isSavingQuoteForLead === lead.id}
                                onClick={() => void createQuote(lead)}
                              >
                                {isSavingQuoteForLead === lead.id
                                  ? lead.email
                                    ? "Emailing..."
                                    : "Creating..."
                                  : lead.email
                                    ? "Create & Email Quote"
                                    : "Create Share Link"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="w-full rounded-md bg-[#0A1628] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1E293B]"
                            onClick={() => setReviewQuoteLeadId(lead.id)}
                          >
                            Review Quote
                          </button>
                        )}
                      </div>
                    ) : null}

                    {activeJobLeadId === lead.id && latestQuote ? (
                      <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
                        {(() => {
                          const busyIds = busyEmployeeIdsByLead[lead.id] ?? [];
                          const availableCount = employees.length - busyIds.length;

                          return (
                            <p className="text-[11px] text-slate-500">
                              {isCheckingAvailabilityForLead === lead.id
                                ? "Checking crew availability..."
                                : `${availableCount} of ${employees.length} crew members available at selected time.`}
                            </p>
                          );
                        })()}

                        <div className="grid grid-cols-2 gap-2">
                          <select
                            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                            value={(dispatchPresetByLead[lead.id] ?? defaultDispatchPreset).day}
                            onChange={(event) => {
                              const nextPreset: DispatchPreset = {
                                ...(dispatchPresetByLead[lead.id] ?? defaultDispatchPreset),
                                day: event.target.value as DispatchPreset["day"],
                              };

                              setDispatchPresetByLead((prev) => ({ ...prev, [lead.id]: nextPreset }));

                              if (nextPreset.day !== "custom" && nextPreset.window !== "custom") {
                                const nextScheduledStart = buildScheduledStartFromPreset(nextPreset);
                                setJobDraftByLead((prev) => ({
                                  ...prev,
                                  [lead.id]: {
                                    ...(prev[lead.id] ?? defaultJobDraft),
                                    scheduledStart: nextScheduledStart,
                                  },
                                }));
                                void loadCrewAvailabilityForLead(lead.id, nextScheduledStart);
                              }
                            }}
                          >
                            <option value="today">Today</option>
                            <option value="tomorrow">Tomorrow</option>
                            <option value="next_business_day">Next Business Day</option>
                            <option value="custom">Custom Day</option>
                          </select>

                          <select
                            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                            value={(dispatchPresetByLead[lead.id] ?? defaultDispatchPreset).window}
                            onChange={(event) => {
                              const nextPreset: DispatchPreset = {
                                ...(dispatchPresetByLead[lead.id] ?? defaultDispatchPreset),
                                window: event.target.value as DispatchPreset["window"],
                              };

                              setDispatchPresetByLead((prev) => ({ ...prev, [lead.id]: nextPreset }));

                              if (nextPreset.day !== "custom" && nextPreset.window !== "custom") {
                                const nextScheduledStart = buildScheduledStartFromPreset(nextPreset);
                                setJobDraftByLead((prev) => ({
                                  ...prev,
                                  [lead.id]: {
                                    ...(prev[lead.id] ?? defaultJobDraft),
                                    scheduledStart: nextScheduledStart,
                                  },
                                }));
                                void loadCrewAvailabilityForLead(lead.id, nextScheduledStart);
                              }
                            }}
                          >
                            <option value="morning">Morning</option>
                            <option value="midday">Midday</option>
                            <option value="afternoon">Afternoon</option>
                            <option value="custom">Custom Time</option>
                          </select>
                        </div>

                        <input
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          placeholder="Job title"
                          value={jobDraft.title}
                          onChange={(event) =>
                            setJobDraftByLead((prev) => ({
                              ...prev,
                              [lead.id]: { ...jobDraft, title: event.target.value },
                            }))
                          }
                        />
                        <input
                          type="datetime-local"
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          value={jobDraft.scheduledStart}
                            onChange={(event) => {
                              const nextScheduledStart = event.target.value;
                              setJobDraftByLead((prev) => ({
                                ...prev,
                                [lead.id]: { ...jobDraft, scheduledStart: nextScheduledStart },
                              }));
                              void loadCrewAvailabilityForLead(lead.id, nextScheduledStart);
                            }}
                        />
                        <select
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          value={jobDraft.employeeId}
                          onChange={(event) =>
                            setJobDraftByLead((prev) => ({
                              ...prev,
                              [lead.id]: { ...jobDraft, employeeId: event.target.value },
                            }))
                          }
                        >
                          <option value="">Assign later</option>
                          {employees.map((employee) => (
                              <option
                                key={employee.id}
                                value={employee.id}
                                disabled={(busyEmployeeIdsByLead[lead.id] ?? []).includes(employee.id) && employee.id !== jobDraft.employeeId}
                              >
                                {employee.full_name || employee.id.slice(0, 8)}
                                {(busyEmployeeIdsByLead[lead.id] ?? []).includes(employee.id) ? " (unavailable)" : ""}
                            </option>
                          ))}
                        </select>
                        {isSelectedEmployeeUnavailable ? (
                          <p className="text-[11px] text-rose-600">
                            Selected crew member is unavailable at this time.
                          </p>
                        ) : null}
                        <button
                          type="button"
                          className="w-full rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600 disabled:opacity-70"
                          disabled={isCreatingJobForLead === lead.id || isSelectedEmployeeUnavailable}
                          onClick={() => void createJobFromQuote(lead, latestQuote.id)}
                        >
                          {isCreatingJobForLead === lead.id ? "Scheduling..." : "Schedule & Notify Crew"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {(leadsByStatus[column.key] ?? []).length === 0 ? <p className="text-xs text-slate-500">No leads.</p> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
