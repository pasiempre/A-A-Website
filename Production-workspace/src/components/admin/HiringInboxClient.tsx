"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type ApplicationRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  is_authorized_to_work: boolean;
  has_transportation: boolean;
  has_drivers_license: boolean;
  consent_to_background_check: boolean;
  years_experience: number;
  experience_description: string | null;
  specialties: string[];
  available_days: string[];
  preferred_start_date: string | null;
  is_full_time: boolean;
  references: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  how_did_you_hear: string | null;
  additional_notes: string | null;
  status: ApplicationStatus;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notified: boolean;
  confirmation_sent: boolean;
  submitted_at: string;
  created_at: string;
};

type ApplicationStatus =
  | "new"
  | "reviewed"
  | "interview_scheduled"
  | "interviewed"
  | "hired"
  | "rejected"
  | "withdrawn";

type StatusFilterTab = ApplicationStatus | "all";

type ViewMode = "list" | "detail";

type SortField = "submitted_at" | "full_name" | "years_experience";
type SortDir = "asc" | "desc";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; icon: string }
> = {
  new: {
    label: "New",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "📥",
  },
  reviewed: {
    label: "Reviewed",
    color: "bg-slate-100 text-slate-800 border-slate-200",
    icon: "👁",
  },
  interview_scheduled: {
    label: "Interview Scheduled",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "📅",
  },
  interviewed: {
    label: "Interviewed",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    icon: "💬",
  },
  hired: {
    label: "Hired",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "✅",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "❌",
  },
  withdrawn: {
    label: "Withdrawn",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "🔙",
  },
};

const FILTER_TABS: { key: StatusFilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "reviewed", label: "Reviewed" },
  { key: "interview_scheduled", label: "Interview" },
  { key: "interviewed", label: "Interviewed" },
  { key: "hired", label: "Hired" },
  { key: "rejected", label: "Rejected" },
  { key: "withdrawn", label: "Withdrawn" },
];

const STATUS_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  new: ["reviewed", "rejected", "withdrawn"],
  reviewed: ["interview_scheduled", "rejected", "withdrawn"],
  interview_scheduled: ["interviewed", "rejected", "withdrawn"],
  interviewed: ["hired", "rejected", "withdrawn"],
  hired: [],
  rejected: ["new"],
  withdrawn: ["new"],
};

const DAY_LABELS: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

const PAGE_SIZE = 25;

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

function normalizeApplication(row: Record<string, unknown>): ApplicationRow {
  return {
    id: String(row.id ?? ""),
    full_name: String(row.full_name ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    address: typeof row.address === "string" ? row.address : null,
    city: typeof row.city === "string" ? row.city : null,
    state: typeof row.state === "string" ? row.state : null,
    zip: typeof row.zip === "string" ? row.zip : null,
    is_authorized_to_work: Boolean(row.is_authorized_to_work),
    has_transportation: Boolean(row.has_transportation),
    has_drivers_license: Boolean(row.has_drivers_license),
    consent_to_background_check: Boolean(row.consent_to_background_check),
    years_experience:
      typeof row.years_experience === "number" ? row.years_experience : 0,
    experience_description:
      typeof row.experience_description === "string"
        ? row.experience_description
        : null,
    specialties: Array.isArray(row.specialties)
      ? row.specialties.map((value) => String(value))
      : [],
    available_days: Array.isArray(row.available_days)
      ? row.available_days.map((value) => String(value))
      : [],
    preferred_start_date:
      typeof row.preferred_start_date === "string"
        ? row.preferred_start_date
        : null,
    is_full_time: Boolean(row.is_full_time),
    references: Array.isArray(row.references)
      ? row.references
          .map((value) => {
            if (!value || typeof value !== "object") {
              return null;
            }
            const ref = value as Record<string, unknown>;
            return {
              name: String(ref.name ?? ""),
              phone: String(ref.phone ?? ""),
              relationship: String(ref.relationship ?? ""),
            };
          })
          .filter((value): value is { name: string; phone: string; relationship: string } => Boolean(value))
      : [],
    how_did_you_hear:
      typeof row.how_did_you_hear === "string" ? row.how_did_you_hear : null,
    additional_notes:
      typeof row.additional_notes === "string" ? row.additional_notes : null,
    status: (row.status as ApplicationStatus) ?? "new",
    admin_notes: typeof row.admin_notes === "string" ? row.admin_notes : null,
    reviewed_by: typeof row.reviewed_by === "string" ? row.reviewed_by : null,
    reviewed_at: typeof row.reviewed_at === "string" ? row.reviewed_at : null,
    admin_notified: Boolean(row.admin_notified),
    confirmation_sent: Boolean(row.confirmation_sent),
    submitted_at: String(row.submitted_at ?? row.created_at ?? new Date().toISOString()),
    created_at: String(row.created_at ?? new Date().toISOString()),
  };
}

export function HiringInboxClient() {
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<StatusFilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("submitted_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [adminNotesDraft, setAdminNotesDraft] = useState<Record<string, string>>(
    {},
  );

  const loadApplications = useCallback(async () => {
    setIsLoading(true);
    setErrorText(null);

    try {
      const supabase = createClient();
      let query = supabase
        .from("employment_applications")
        .select(
          "id, full_name, email, phone, address, city, state, zip, " +
            "is_authorized_to_work, has_transportation, has_drivers_license, consent_to_background_check, " +
            "years_experience, experience_description, specialties, available_days, preferred_start_date, is_full_time, " +
            "references, how_did_you_hear, additional_notes, " +
            "status, admin_notes, reviewed_by, reviewed_at, " +
            "admin_notified, confirmation_sent, " +
            "submitted_at, created_at",
          { count: "exact" },
        )
        .order(sortField, { ascending: sortDir === "asc" })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (activeFilter !== "all") {
        query = query.eq("status", activeFilter);
      }

      if (searchQuery.trim()) {
        query = query.or(
          `full_name.ilike.%${searchQuery.trim()}%,email.ilike.%${searchQuery.trim()}%,phone.ilike.%${searchQuery.trim()}%,city.ilike.%${searchQuery.trim()}%`,
        );
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      const rows = ((data as unknown as Record<string, unknown>[] | null) ?? []).map(
        normalizeApplication,
      );
      setApplications(rows);
      setTotalCount(count ?? 0);

      setAdminNotesDraft((prev) => {
        const next = { ...prev };
        for (const app of rows) {
          if (!(app.id in next)) {
            next[app.id] = app.admin_notes ?? "";
          }
        }
        return next;
      });
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Failed to load applications.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, searchQuery, sortField, sortDir, page]);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  useEffect(() => {
    setPage(0);
  }, [activeFilter, searchQuery]);

  const [statusCounts, setStatusCounts] = useState<Record<StatusFilterTab, number>>({
    all: 0,
    new: 0,
    reviewed: 0,
    interview_scheduled: 0,
    interviewed: 0,
    hired: 0,
    rejected: 0,
    withdrawn: 0,
  });

  const loadStatusCounts = useCallback(async () => {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("employment_applications")
        .select("status");

      if (error || !data) return;

      const counts: Record<string, number> = {};
      let total = 0;
      for (const row of data) {
        counts[row.status] = (counts[row.status] ?? 0) + 1;
        total += 1;
      }

      setStatusCounts({
        all: total,
        new: counts.new ?? 0,
        reviewed: counts.reviewed ?? 0,
        interview_scheduled: counts.interview_scheduled ?? 0,
        interviewed: counts.interviewed ?? 0,
        hired: counts.hired ?? 0,
        rejected: counts.rejected ?? 0,
        withdrawn: counts.withdrawn ?? 0,
      });
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    void loadStatusCounts();
  }, [loadStatusCounts, applications]);

  const updateApplicationStatus = async (
    appId: string,
    newStatus: ApplicationStatus,
  ) => {
    setIsSaving(true);
    setErrorText(null);
    setStatusText(null);

    try {
      const response = await fetch("/api/employment-application", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: appId,
          status: newStatus,
          adminNotes: adminNotesDraft[appId] ?? undefined,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(
          body?.error ?? `Status update failed (${response.status}).`,
        );
      }

      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId
            ? {
                ...app,
                status: newStatus,
                admin_notes: adminNotesDraft[appId] ?? app.admin_notes,
                reviewed_at: new Date().toISOString(),
              }
            : app,
        ),
      );

      const appName =
        applications.find((app) => app.id === appId)?.full_name ?? "Application";
      setStatusText(`${appName} → ${STATUS_CONFIG[newStatus].label}`);

      void loadStatusCounts();
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Failed to update status.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const saveAdminNotes = async (appId: string) => {
    setIsSaving(true);
    setErrorText(null);
    setStatusText(null);

    try {
      const app = applications.find((item) => item.id === appId);
      if (!app) {
        return;
      }

      const response = await fetch("/api/employment-application", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: appId,
          status: app.status,
          adminNotes: adminNotesDraft[appId] ?? "",
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? "Failed to save notes.");
      }

      setApplications((prev) =>
        prev.map((item) =>
          item.id === appId
            ? { ...item, admin_notes: adminNotesDraft[appId] ?? item.admin_notes }
            : item,
        ),
      );
      setStatusText("Notes saved.");
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Failed to save notes.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const selectedApp = useMemo(
    () => applications.find((app) => app.id === selectedAppId) ?? null,
    [applications, selectedAppId],
  );

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const openDetail = (appId: string) => {
    setSelectedAppId(appId);
    setViewMode("detail");
  };

  const closeDetail = () => {
    setSelectedAppId(null);
    setViewMode("list");
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "submitted_at" ? "desc" : "asc");
    }
  };

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return "";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  if (viewMode === "detail" && selectedApp) {
    const app = selectedApp;
    const transitions = STATUS_TRANSITIONS[app.status] ?? [];

    return (
      <section className="mt-8 space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <button
                type="button"
                className="mb-2 text-xs font-medium text-slate-500 hover:text-slate-700"
                onClick={closeDetail}
              >
                ← Back to Inbox
              </button>
              <h2 className="text-lg font-semibold text-slate-900 md:text-xl">
                {app.full_name}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Applied {formatDateTime(app.submitted_at)} ({timeAgo(app.submitted_at)})
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${STATUS_CONFIG[app.status].color}`}
            >
              {STATUS_CONFIG[app.status].icon} {STATUS_CONFIG[app.status].label}
            </span>
          </div>

          {statusText && (
            <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
              {statusText}
            </p>
          )}
          {errorText && (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {errorText}
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700">
              Contact Information
            </h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-slate-500">Phone</dt>
                <dd>
                  <a
                    href={`tel:${app.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {formatPhone(app.phone)}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-slate-500">Email</dt>
                <dd>
                  <a
                    href={`mailto:${app.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {app.email}
                  </a>
                </dd>
              </div>
              {(app.address || app.city) && (
                <div className="flex justify-between">
                  <dt className="font-medium text-slate-500">Location</dt>
                  <dd className="text-right text-slate-700">
                    {[app.address, app.city, app.state, app.zip]
                      .filter(Boolean)
                      .join(", ")}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700">Eligibility</h3>
            <dl className="mt-3 space-y-2 text-sm">
              {[
                {
                  label: "Authorized to Work",
                  value: app.is_authorized_to_work,
                },
                {
                  label: "Has Transportation",
                  value: app.has_transportation,
                },
                {
                  label: "Driver's License",
                  value: app.has_drivers_license,
                },
                {
                  label: "Background Check Consent",
                  value: app.consent_to_background_check,
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <dt className="font-medium text-slate-500">{label}</dt>
                  <dd>
                    {value ? (
                      <span className="text-green-700">✅ Yes</span>
                    ) : (
                      <span className="text-red-600">❌ No</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700">Experience</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-slate-500">Years</dt>
                <dd className="text-slate-700">
                  {app.years_experience} year
                  {app.years_experience !== 1 ? "s" : ""}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-slate-500">Type</dt>
                <dd className="text-slate-700">
                  {app.is_full_time ? "Full-time" : "Part-time"}
                </dd>
              </div>
            </dl>
            {app.specialties.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">Specialties</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {app.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {app.experience_description && (
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">Details</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                  {app.experience_description}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700">Availability</h3>
            {app.available_days.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {app.available_days.map((day) => (
                  <span
                    key={day}
                    className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                  >
                    {DAY_LABELS[day] ?? day}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                No specific days listed.
              </p>
            )}
            {app.preferred_start_date && (
              <p className="mt-3 text-sm text-slate-600">
                <span className="font-medium text-slate-500">Preferred start:</span>{" "}
                {formatDate(app.preferred_start_date)}
              </p>
            )}
            {app.how_did_you_hear && (
              <p className="mt-3 text-sm text-slate-600">
                <span className="font-medium text-slate-500">How they heard about us:</span>{" "}
                {app.how_did_you_hear}
              </p>
            )}
          </div>
        </div>

        {app.references.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700">
              References ({app.references.length})
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {app.references.map((ref, index) => (
                <div
                  key={`ref-${index}`}
                  className="rounded-md border border-slate-100 bg-slate-50 p-3"
                >
                  <p className="text-sm font-medium text-slate-800">{ref.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{ref.relationship}</p>
                  <a
                    href={`tel:${ref.phone}`}
                    className="mt-1 block text-xs text-blue-600 hover:underline"
                  >
                    {formatPhone(ref.phone)}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {app.additional_notes && (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700">Applicant Notes</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
              {app.additional_notes}
            </p>
          </div>
        )}

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h3 className="text-sm font-semibold text-slate-700">Admin Actions</h3>

          <div className="mt-4">
            <label className="block text-xs font-medium text-slate-500">
              Admin Notes
            </label>
            <textarea
              className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              rows={3}
              placeholder="Internal notes about this applicant..."
              value={adminNotesDraft[app.id] ?? ""}
              onChange={(event) =>
                setAdminNotesDraft((prev) => ({
                  ...prev,
                  [app.id]: event.target.value,
                }))
              }
            />
            <button
              type="button"
              className="mt-2 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              disabled={isSaving}
              onClick={() => void saveAdminNotes(app.id)}
            >
              {isSaving ? "Saving..." : "Save Notes"}
            </button>
          </div>

          {transitions.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-medium text-slate-500">Move to:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {transitions.map((nextStatus) => {
                  const config = STATUS_CONFIG[nextStatus];
                  const isDestructive =
                    nextStatus === "rejected" || nextStatus === "withdrawn";

                  return (
                    <button
                      key={nextStatus}
                      type="button"
                      disabled={isSaving}
                      className={`rounded-md border px-3 py-1.5 text-xs font-medium transition disabled:opacity-60 ${
                        isDestructive
                          ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                          : nextStatus === "hired"
                            ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                      onClick={() => void updateApplicationStatus(app.id, nextStatus)}
                    >
                      {config.icon} {config.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {transitions.length === 0 && (
            <p className="mt-4 text-xs italic text-slate-500">
              No further transitions available from “{STATUS_CONFIG[app.status].label}”.
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-500">
            <span>
              Admin notified:{" "}
              {app.admin_notified ? (
                <span className="text-green-600">✓</span>
              ) : (
                <span className="text-amber-600">✗</span>
              )}
            </span>
            <span>
              Confirmation sent:{" "}
              {app.confirmation_sent ? (
                <span className="text-green-600">✓</span>
              ) : (
                <span className="text-amber-600">✗</span>
              )}
            </span>
            {app.reviewed_at && (
              <span>Last reviewed: {formatDateTime(app.reviewed_at)}</span>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 md:text-xl">
              Hiring Inbox
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Review and manage employment applications.
            </p>
          </div>
          <button
            type="button"
            className="text-sm font-medium text-slate-700 underline"
            onClick={() => void loadApplications()}
          >
            Refresh
          </button>
        </div>

        {statusText && (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            {statusText}
          </p>
        )}
        {errorText && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {errorText}
          </p>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name, email, phone, or city..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FILTER_TABS.map((tab) => {
            const count = statusCounts[tab.key];
            const isActive = activeFilter === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`ml-1.5 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading && (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">Loading applications...</p>
        </div>
      )}

      {!isLoading && applications.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-400">📭</p>
          <p className="mt-2 text-sm text-slate-500">
            {activeFilter !== "all"
              ? `No ${STATUS_CONFIG[activeFilter as ApplicationStatus]?.label.toLowerCase() ?? ""} applications found.`
              : searchQuery
                ? "No applications match your search."
                : "No applications yet."}
          </p>
        </div>
      )}

      {!isLoading && applications.length > 0 && (
        <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th
                  className="cursor-pointer px-4 py-3 hover:text-slate-700"
                  onClick={() => toggleSort("full_name")}
                >
                  Applicant{sortIndicator("full_name")}
                </th>
                <th className="px-4 py-3">Contact</th>
                <th
                  className="cursor-pointer px-4 py-3 hover:text-slate-700"
                  onClick={() => toggleSort("years_experience")}
                >
                  Experience{sortIndicator("years_experience")}
                </th>
                <th className="px-4 py-3">Availability</th>
                <th className="px-4 py-3">Eligibility</th>
                <th className="px-4 py-3">Status</th>
                <th
                  className="cursor-pointer px-4 py-3 hover:text-slate-700"
                  onClick={() => toggleSort("submitted_at")}
                >
                  Submitted{sortIndicator("submitted_at")}
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const config = STATUS_CONFIG[app.status];
                const eligibilityFlags = [
                  app.is_authorized_to_work ? "✅ Work" : "❌ Work",
                  app.has_transportation ? "✅ Transport" : "❌ Transport",
                  app.has_drivers_license ? "✅ License" : null,
                ].filter(Boolean);

                return (
                  <tr
                    key={app.id}
                    className="cursor-pointer border-t border-slate-100 transition hover:bg-slate-50"
                    onClick={() => openDetail(app.id)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{app.full_name}</p>
                      {app.city && (
                        <p className="text-xs text-slate-500">
                          {app.city}
                          {app.state ? `, ${app.state}` : ""}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-700">{formatPhone(app.phone)}</p>
                      <p className="text-xs text-slate-500">{app.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-700">
                        {app.years_experience}yr
                        {app.is_full_time ? " • FT" : " • PT"}
                      </p>
                      {app.specialties.length > 0 && (
                        <p className="max-w-[140px] truncate text-xs text-slate-500">
                          {app.specialties.slice(0, 2).join(", ")}
                          {app.specialties.length > 2
                            ? ` +${app.specialties.length - 2}`
                            : ""}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {app.available_days.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {app.available_days.slice(0, 4).map((day) => (
                            <span
                              key={day}
                              className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600"
                            >
                              {DAY_LABELS[day] ?? day}
                            </span>
                          ))}
                          {app.available_days.length > 4 && (
                            <span className="text-[10px] text-slate-400">
                              +{app.available_days.length - 4}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5 text-[10px]">
                        {eligibilityFlags.map((flag) => (
                          <p key={flag}>{flag}</p>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.color}`}
                      >
                        {config.icon} {config.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {timeAgo(app.submitted_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-400">→</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && applications.length > 0 && (
        <div className="space-y-3 md:hidden">
          {applications.map((app) => {
            const config = STATUS_CONFIG[app.status];

            return (
              <article
                key={app.id}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm active:bg-slate-50"
                onClick={() => openDetail(app.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {app.full_name}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatPhone(app.phone)}
                      {app.city ? ` • ${app.city}` : ""}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${config.color}`}
                  >
                    {config.icon} {config.label}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span>
                    {app.years_experience}yr
                    {app.is_full_time ? " FT" : " PT"}
                  </span>
                  {app.is_authorized_to_work && (
                    <span className="text-green-600">✅ Authorized</span>
                  )}
                  {app.has_transportation && (
                    <span className="text-green-600">🚗 Transport</span>
                  )}
                  {app.available_days.length > 0 && (
                    <span>
                      {app.available_days
                        .slice(0, 3)
                        .map((day) => DAY_LABELS[day] ?? day)
                        .join(", ")}
                      {app.available_days.length > 3
                        ? ` +${app.available_days.length - 3}`
                        : ""}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {timeAgo(app.submitted_at)}
                  </span>
                  <span className="text-xs text-slate-400">View →</span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-5 py-3 shadow-sm">
          <p className="text-xs text-slate-500">
            Showing {page * PAGE_SIZE + 1}–
            {Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              ← Prev
            </button>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
