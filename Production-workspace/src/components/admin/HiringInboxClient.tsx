"use client";

import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type ApplicationRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  preferred_language: string;
  city: string | null;
  experience_years: number | null;
  has_transportation: boolean | null;
  is_eligible_to_work: boolean | null;
  availability_text: string | null;
  notes: string | null;
  status: "new" | "reviewing" | "contacted" | "archived";
  created_at: string;
};

export function HiringInboxClient() {
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    setIsLoading(true);
    setErrorText(null);

    const { data, error } = await createClient()
      .from("employment_applications")
      .select("id, full_name, phone, email, preferred_language, city, experience_years, has_transportation, is_eligible_to_work, availability_text, notes, status, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      setErrorText(error.message);
      setIsLoading(false);
      return;
    }

    setApplications((data as ApplicationRow[]) ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadApplications();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadApplications]);

  const updateStatus = async (id: string, status: ApplicationRow["status"]) => {
    setStatusText(null);
    setErrorText(null);

    const { error } = await createClient().from("employment_applications").update({ status }).eq("id", id);
    if (error) {
      setErrorText(error.message);
      return;
    }

    setStatusText("Application status updated.");
    await loadApplications();
  };

  return (
    <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 md:text-xl">Hiring Inbox</h2>
          <p className="mt-1 text-sm text-slate-600">Review employment applications submitted from the public site.</p>
        </div>
        <button type="button" className="text-sm font-medium text-slate-700 underline" onClick={() => void loadApplications()}>
          Refresh
        </button>
      </div>

      {statusText ? <p className="mt-3 text-sm text-emerald-700">{statusText}</p> : null}
      {errorText ? <p className="mt-3 text-sm text-rose-600">{errorText}</p> : null}
      {isLoading ? <p className="mt-4 text-sm text-slate-500">Loading applications...</p> : null}

      <div className="mt-5 space-y-4">
        {applications.map((application) => (
          <article key={application.id} className="rounded border border-slate-200 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{application.full_name}</h3>
                <p className="mt-1 text-sm text-slate-600">{application.phone}</p>
                <p className="text-sm text-slate-600">{application.email || "No email provided"}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">
                  {application.preferred_language} • {application.city || "City not provided"} • {new Date(application.created_at).toLocaleDateString()}
                </p>
              </div>
              <select
                className="rounded border border-slate-300 px-3 py-2 text-sm"
                value={application.status}
                onChange={(event) => void updateStatus(application.id, event.target.value as ApplicationRow["status"])}
              >
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="contacted">Contacted</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              <p>Experience: {application.experience_years ?? "Not provided"} years</p>
              <p>Transportation: {application.has_transportation === null ? "Not provided" : application.has_transportation ? "Yes" : "No"}</p>
              <p>Eligible to work: {application.is_eligible_to_work === null ? "Not provided" : application.is_eligible_to_work ? "Yes" : "No"}</p>
              <p>Availability: {application.availability_text || "Not provided"}</p>
            </div>

            {application.notes ? <p className="mt-3 text-sm text-slate-600">{application.notes}</p> : null}
          </article>
        ))}

        {!isLoading && applications.length === 0 ? <p className="text-sm text-slate-500">No applications yet.</p> : null}
      </div>
    </section>
  );
}
