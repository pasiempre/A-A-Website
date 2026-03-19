"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type LeadStatus =
  | "new"
  | "qualified"
  | "contacted"
  | "site_visit_scheduled"
  | "quoted"
  | "won"
  | "lost"
  | "dormant";

type EmployeeOption = {
  id: string;
  full_name: string | null;
  role: "admin" | "employee";
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
  quotes:
    | {
        id: string;
        quote_number: string | null;
        status: string;
        delivery_status: string;
        delivery_error: string | null;
        total: number;
        valid_until: string | null;
        created_at: string;
      }[]
    | null;
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

const statusColumns: { key: LeadStatus; label: string }[] = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "site_visit_scheduled", label: "Visit Scheduled" },
  { key: "quoted", label: "Quoted" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
  { key: "dormant", label: "Dormant" },
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

export function LeadPipelineClient() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [activeQuoteLeadId, setActiveQuoteLeadId] = useState<string | null>(null);
  const [activeJobLeadId, setActiveJobLeadId] = useState<string | null>(null);
  const [quoteDraftByLead, setQuoteDraftByLead] = useState<Record<string, QuoteDraft>>({});
  const [jobDraftByLead, setJobDraftByLead] = useState<Record<string, JobDraft>>({});
  const [isSavingQuoteForLead, setIsSavingQuoteForLead] = useState<string | null>(null);
  const [isConvertingLead, setIsConvertingLead] = useState<string | null>(null);
  const [isCreatingJobForLead, setIsCreatingJobForLead] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorText(null);

    const supabase = createClient();
    const [leadsResult, profilesResult] = await Promise.all([
      supabase
        .from("leads")
        .select(
          "id, name, company_name, phone, email, service_type, timeline, description, notes, status, created_at, converted_client_id, quotes(id, quote_number, status, delivery_status, delivery_error, total, valid_until, created_at)",
        )
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("profiles")
        .select("id, full_name, role")
        .in("role", ["admin", "employee"])
        .order("full_name", { ascending: true }),
    ]);

    if (leadsResult.error || profilesResult.error) {
      setErrorText(leadsResult.error?.message ?? profilesResult.error?.message ?? "Unable to load lead data.");
      setIsLoading(false);
      return;
    }

    setLeads((leadsResult.data as LeadRow[]) ?? []);
    setEmployees((profilesResult.data as EmployeeOption[]) ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const leadsByStatus = useMemo(() => {
    const grouped: Record<LeadStatus, LeadRow[]> = {
      new: [],
      qualified: [],
      contacted: [],
      site_visit_scheduled: [],
      quoted: [],
      won: [],
      lost: [],
      dormant: [],
    };

    for (const lead of leads) {
      grouped[lead.status] = [...grouped[lead.status], lead];
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

    const { error } = await createClient().from("leads").update(patch).eq("id", leadId);
    if (error) {
      setErrorText(error.message);
      return;
    }

    setStatusText("Lead status updated.");
    await loadData();
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

      setStatusText(
        payload?.emailed
          ? `Quote ${payload.quoteNumber} emailed successfully.`
          : `Quote ${payload?.quoteNumber} created. Share link: ${payload?.shareUrl}`,
      );
      setActiveQuoteLeadId(null);
      setQuoteDraftByLead((prev) => ({ ...prev, [lead.id]: defaultQuoteDraft }));
      await loadData();
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
        .update({ status: "won", converted_client_id: convertedClientId })
        .eq("id", lead.id);

      if (leadUpdateError) {
        setErrorText(leadUpdateError.message);
        return;
      }

      setStatusText("Lead converted to client and marked won.");
      await loadData();
    } finally {
      setIsConvertingLead(null);
    }
  };

  const createJobFromQuote = async (lead: LeadRow, quoteId: string) => {
    const jobDraft = jobDraftByLead[lead.id] ?? defaultJobDraft;
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

      setStatusText(payload?.existing ? "Job already existed for this quote." : "Job created from accepted quote.");
      setActiveJobLeadId(null);
      setJobDraftByLead((prev) => ({ ...prev, [lead.id]: defaultJobDraft }));
      await loadData();
    } finally {
      setIsCreatingJobForLead(null);
    }
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

      <div className="mt-5 grid gap-4 xl:grid-cols-5">
        {statusColumns.map((column) => (
          <article key={column.key} className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{column.label}</h3>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-600">{leadsByStatus[column.key]?.length ?? 0}</span>
            </div>

            <div className="space-y-3">
              {(leadsByStatus[column.key] ?? []).map((lead) => {
                const latestQuote = lead.quotes?.[0] ?? null;
                const quoteDraft = quoteDraftByLead[lead.id] ?? defaultQuoteDraft;
                const jobDraft = jobDraftByLead[lead.id] ?? defaultJobDraft;
                const canCreateJob = latestQuote?.status === "accepted";

                return (
                  <div key={lead.id} className="rounded-md border border-slate-200 bg-white p-3">
                    <p className="text-sm font-semibold text-slate-900">{lead.company_name || lead.name}</p>
                    <p className="mt-1 text-xs text-slate-600">{lead.name}</p>
                    <p className="mt-1 text-xs text-slate-600">{lead.phone}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">
                      {lead.service_type || "general"} • {timeAgo(lead.created_at)}
                    </p>

                    {lead.description ? <p className="mt-2 text-xs text-slate-600">{lead.description}</p> : null}

                    {latestQuote ? (
                      <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                            {latestQuote.quote_number || "Quote"} • ${latestQuote.total.toFixed(2)}
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
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                        value={lead.status}
                        onChange={(event) => void updateLeadStatus(lead.id, event.target.value as LeadStatus)}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="site_visit_scheduled">Site Visit Scheduled</option>
                        <option value="quoted">Quoted</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                        <option value="dormant">Dormant</option>
                      </select>

                      <button
                        type="button"
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700"
                        onClick={() => {
                          setActiveQuoteLeadId((prev) => (prev === lead.id ? null : lead.id));
                          setQuoteDraftByLead((prev) => ({ ...prev, [lead.id]: prev[lead.id] ?? defaultQuoteDraft }));
                        }}
                      >
                        {activeQuoteLeadId === lead.id ? "Hide Quote" : latestQuote ? "Send New Quote" : "Create Quote"}
                      </button>

                      <button
                        type="button"
                        className="rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-70"
                        disabled={isConvertingLead === lead.id}
                        onClick={() => void convertLeadToClient(lead)}
                      >
                        {isConvertingLead === lead.id ? "Converting..." : "Convert to Client"}
                      </button>

                      {canCreateJob ? (
                        <button
                          type="button"
                          className="rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800"
                          onClick={() => {
                            setActiveJobLeadId((prev) => (prev === lead.id ? null : lead.id));
                            setJobDraftByLead((prev) => ({
                              ...prev,
                              [lead.id]:
                                prev[lead.id] ??
                                {
                                  ...defaultJobDraft,
                                  title: `${lead.company_name || lead.name} ${lead.service_type ? `- ${lead.service_type}` : "- Cleaning Job"}`,
                                },
                            }));
                          }}
                        >
                          {activeJobLeadId === lead.id ? "Hide Job Setup" : "Create Job from Quote"}
                        </button>
                      ) : null}
                    </div>

                    {activeQuoteLeadId === lead.id ? (
                      <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
                        <input
                          className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
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
                          className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
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
                          className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
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
                            className="rounded-md border border-slate-300 px-2 py-1 text-xs"
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
                            className="rounded-md border border-slate-300 px-2 py-1 text-xs"
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
                            className="rounded-md border border-slate-300 px-2 py-1 text-xs"
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
                            className="rounded-md border border-slate-300 px-2 py-1 text-xs"
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
                          className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
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
                          className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
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
                        <button
                          type="button"
                          className="w-full rounded-md bg-[#0A1628] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1E293B] disabled:opacity-70"
                          disabled={isSavingQuoteForLead === lead.id}
                          onClick={() => void createQuote(lead)}
                        >
                          {isSavingQuoteForLead === lead.id ? "Sending..." : "Send Quote"}
                        </button>
                      </div>
                    ) : null}

                    {activeJobLeadId === lead.id && latestQuote ? (
                      <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
                        <input
                          className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
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
                          className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                          value={jobDraft.scheduledStart}
                          onChange={(event) =>
                            setJobDraftByLead((prev) => ({
                              ...prev,
                              [lead.id]: { ...jobDraft, scheduledStart: event.target.value },
                            }))
                          }
                        />
                        <select
                          className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
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
                            <option key={employee.id} value={employee.id}>
                              {employee.full_name || employee.id.slice(0, 8)}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="w-full rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600 disabled:opacity-70"
                          disabled={isCreatingJobForLead === lead.id}
                          onClick={() => void createJobFromQuote(lead, latestQuote.id)}
                        >
                          {isCreatingJobForLead === lead.id ? "Creating..." : "Create Job"}
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
