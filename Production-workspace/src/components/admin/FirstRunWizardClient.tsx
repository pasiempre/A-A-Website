"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type ProfileOption = {
  id: string;
  full_name: string | null;
  role: "admin" | "employee";
};

const initialClientForm = {
  name: "Example Construction Co",
  company_name: "Example Construction Co",
  phone: "",
  email: "",
  notes: "Sample client created during first-run wizard.",
};

const initialJobForm = {
  title: "Sample — Delete or edit me",
  address: "123 Sample Jobsite Ave, Austin, TX",
  scope: "Final clean for a sample unit to demonstrate onboarding workflow.",
};

export function FirstRunWizardClient() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<ProfileOption[]>([]);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>("");
  const [createdClientId, setCreatedClientId] = useState<string | null>(null);
  const [createdJobId, setCreatedJobId] = useState<string | null>(null);
  const [clientForm, setClientForm] = useState(initialClientForm);
  const [jobForm, setJobForm] = useState(initialJobForm);

  const assignableProfiles = useMemo(() => profiles.filter((profile) => profile.role === "employee" || profile.role === "admin"), [profiles]);

  const loadBootstrap = useCallback(async () => {
    setIsLoading(true);
    setErrorText(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error(authError?.message ?? "Unable to load current user.");
      }

      setCurrentUserId(user.id);
      setSelectedAssigneeId(user.id);

      const [clientsCountResult, jobsCountResult, profileOptionsResult] = await Promise.all([
        supabase.from("clients").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id, full_name, role").in("role", ["admin", "employee"]).order("full_name", { ascending: true }),
      ]);

      if (clientsCountResult.error) {
        throw new Error(clientsCountResult.error.message);
      }
      if (jobsCountResult.error) {
        throw new Error(jobsCountResult.error.message);
      }
      if (profileOptionsResult.error) {
        throw new Error(profileOptionsResult.error.message);
      }

      const clientCount = clientsCountResult.count ?? 0;
      const jobCount = jobsCountResult.count ?? 0;
      const { data: currentProfile, error: currentProfileError } = await supabase
        .from("profiles")
        .select("first_run_completed_at")
        .eq("id", user.id)
        .single();

      if (currentProfileError) {
        throw new Error(currentProfileError.message);
      }

      setIsVisible(clientCount === 0 && jobCount === 0 && !currentProfile?.first_run_completed_at);
      setProfiles((profileOptionsResult.data as ProfileOption[] | null) ?? []);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to load onboarding wizard.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBootstrap();
  }, [loadBootstrap]);

  const createFirstClient = async () => {
    if (!currentUserId) {
      setErrorText("Current user is not available.");
      return;
    }

    setIsSaving(true);
    setErrorText(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("clients")
        .insert({
          ...clientForm,
          created_by: currentUserId,
        })
        .select("id")
        .single();

      if (error || !data) {
        throw new Error(error?.message ?? "Unable to create first client.");
      }

      setCreatedClientId(data.id);
      setStep(2);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to create first client.");
    } finally {
      setIsSaving(false);
    }
  };

  const createSampleJob = async () => {
    if (!currentUserId || !createdClientId) {
      setErrorText("Client step must be completed first.");
      return;
    }

    setIsSaving(true);
    setErrorText(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("jobs")
        .insert({
          client_id: createdClientId,
          title: jobForm.title,
          address: jobForm.address,
          scope: jobForm.scope,
          clean_type: "general",
          priority: "normal",
          status: "scheduled",
          created_by: currentUserId,
        })
        .select("id")
        .single();

      if (error || !data) {
        throw new Error(error?.message ?? "Unable to create sample job.");
      }

      setCreatedJobId(data.id);
      setStep(3);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to create sample job.");
    } finally {
      setIsSaving(false);
    }
  };

  const createAssignment = async () => {
    if (!createdJobId || !selectedAssigneeId || !currentUserId) {
      setErrorText("Job and assignee are required.");
      return;
    }

    setIsSaving(true);
    setErrorText(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("job_assignments").insert({
        job_id: createdJobId,
        employee_id: selectedAssigneeId,
        assigned_by: currentUserId,
        role: "lead",
        status: "assigned",
        notification_status: "pending",
      });

      if (error) {
        throw new Error(error.message);
      }

      const { data: assignmentRow, error: assignmentLookupError } = await supabase
        .from("job_assignments")
        .select("id")
        .eq("job_id", createdJobId)
        .eq("employee_id", selectedAssigneeId)
        .single();

      if (assignmentLookupError || !assignmentRow) {
        throw new Error(assignmentLookupError?.message ?? "Unable to load assignment for notification.");
      }

      const notifyResponse = await fetch("/api/assignment-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId: assignmentRow.id }),
      });

      if (!notifyResponse.ok) {
        const payload = (await notifyResponse.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Assignment created, but SMS notification failed.");
      }

      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({ first_run_completed_at: new Date().toISOString() })
        .eq("id", currentUserId);

      if (profileUpdateError) {
        throw new Error(profileUpdateError.message);
      }

      setStep(4);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to create assignment.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !isVisible) {
    return null;
  }

  return (
    <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 md:text-xl">First-Run Setup Wizard</h2>
          <p className="text-sm text-slate-600">Complete your first client, first sample job, and first assignment in under 2 minutes.</p>
        </div>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">Step {step} of 4</span>
      </div>

      <div className="mb-4 rounded border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-900">
        Welcome video placeholder: add a 30-second onboarding clip URL when ready.
      </div>

      {errorText ? <p className="mb-3 text-sm text-rose-600">{errorText}</p> : null}

      {step === 1 ? (
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm text-slate-700">
            Client Name
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={clientForm.name}
              onChange={(event) => setClientForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>
          <label className="text-sm text-slate-700">
            Company
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={clientForm.company_name}
              onChange={(event) => setClientForm((prev) => ({ ...prev, company_name: event.target.value }))}
            />
          </label>
          <label className="text-sm text-slate-700">
            Phone
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={clientForm.phone}
              onChange={(event) => setClientForm((prev) => ({ ...prev, phone: event.target.value }))}
            />
          </label>
          <label className="text-sm text-slate-700">
            Email
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={clientForm.email}
              onChange={(event) => setClientForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="button"
              disabled={isSaving || !clientForm.name.trim()}
              onClick={createFirstClient}
              className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Creating..." : "Step 1 — Create First Client"}
            </button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm text-slate-700 md:col-span-2">
            Sample Job Title
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={jobForm.title}
              onChange={(event) => setJobForm((prev) => ({ ...prev, title: event.target.value }))}
            />
          </label>
          <label className="text-sm text-slate-700 md:col-span-2">
            Address
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={jobForm.address}
              onChange={(event) => setJobForm((prev) => ({ ...prev, address: event.target.value }))}
            />
          </label>
          <label className="text-sm text-slate-700 md:col-span-2">
            Scope
            <textarea
              rows={3}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={jobForm.scope}
              onChange={(event) => setJobForm((prev) => ({ ...prev, scope: event.target.value }))}
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="button"
              disabled={isSaving || !jobForm.title.trim() || !jobForm.address.trim()}
              onClick={createSampleJob}
              className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Creating..." : "Step 2 — Create Sample Job"}
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-3">
          <label className="block text-sm text-slate-700">
            Assign this job to:
            <select
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={selectedAssigneeId}
              onChange={(event) => setSelectedAssigneeId(event.target.value)}
            >
              {assignableProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {(profile.full_name || "Team member").trim()} ({profile.role})
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={isSaving || !selectedAssigneeId}
            onClick={createAssignment}
            className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Assigning..." : "Step 3 — Assign Job"}
          </button>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-900">
          Setup complete. Your dashboard now has real sample data you can edit or delete.
        </div>
      ) : null}
    </section>
  );
}
