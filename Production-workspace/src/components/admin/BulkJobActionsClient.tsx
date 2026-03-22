"use client";

import { useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  full_name: string | null;
  role: "admin" | "employee";
};

type BulkJobActionsClientProps = {
  selectionMode: boolean;
  onSelectionModeChange: (enabled: boolean) => void;
  selectedJobIds: string[];
  visibleJobIds: string[];
  onSelectAllVisible: () => void;
  onClearSelection: () => void;
  onActionComplete: () => void;
};

const STATUS_TARGETS = [
  { value: "scheduled", label: "Mark selected as scheduled" },
  { value: "in_progress", label: "Mark selected as in_progress" },
  { value: "completed", label: "Mark selected as completed" },
  { value: "blocked", label: "Mark selected as blocked" },
];

export function BulkJobActionsClient({
  selectionMode,
  onSelectionModeChange,
  selectedJobIds,
  visibleJobIds,
  onSelectAllVisible,
  onClearSelection,
  onActionComplete,
}: BulkJobActionsClientProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [assigneeId, setAssigneeId] = useState("");
  const [statusTarget, setStatusTarget] = useState("in_progress");
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const selectedCount = selectedJobIds.length;
  const canRunBulkActions = selectionMode && selectedCount > 0;

  const employeeOptions = useMemo(
    () => profiles.filter((profile) => profile.role === "employee"),
    [profiles],
  );

  useEffect(() => {
    const loadProfiles = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .order("full_name", { ascending: true });

      if (!error) {
        setProfiles((data as Profile[]) ?? []);
      }
    };

    void loadProfiles();
  }, []);

  const runWithGuard = async (
    runner: () => Promise<void>,
    successMessage: string,
  ) => {
    if (!canRunBulkActions) {
      setErrorText(
        "Enable selection mode and choose at least one job first.",
      );
      return;
    }

    setIsSaving(true);
    setStatusText(null);
    setErrorText(null);

    try {
      await runner();
      setStatusText(successMessage);
      onActionComplete();
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Bulk action failed.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const assignSelectedJobs = async () => {
    if (!assigneeId) {
      setErrorText("Select an employee before assigning selected jobs.");
      return;
    }

    await runWithGuard(async () => {
      const supabase = createClient();
      const { error: jobsError } = await supabase
        .from("jobs")
        .update({ assigned_to: assigneeId })
        .in("id", selectedJobIds);

      if (jobsError) {
        throw new Error(jobsError.message);
      }

      const { error: assignmentError } = await supabase
        .from("job_assignments")
        .upsert(
          selectedJobIds.map((jobId) => ({
            job_id: jobId,
            employee_id: assigneeId,
            role: "lead",
            status: "assigned",
          })),
          { onConflict: "job_id,employee_id" },
        );

      if (assignmentError) {
        throw new Error(assignmentError.message);
      }
    }, `Assigned ${selectedCount} selected job(s).`);
  };

  const updateSelectedStatus = async () => {
    await runWithGuard(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("jobs")
        .update({ status: statusTarget })
        .in("id", selectedJobIds);

      if (error) {
        throw new Error(error.message);
      }
    }, `Updated status for ${selectedCount} selected job(s).`);
  };

  const duplicateSelectedJobs = async () => {
    await runWithGuard(async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("jobs")
        .select(
          "id, title, address, clean_type, priority, scope, areas, assigned_week_start",
        )
        .in("id", selectedJobIds);

      if (error) {
        throw new Error(error.message);
      }

      const jobs = (data ?? []) as {
        id: string;
        title: string;
        address: string;
        clean_type: string;
        priority: string;
        scope: string | null;
        areas: string[] | null;
        assigned_week_start: string | null;
      }[];

      if (jobs.length === 0) {
        throw new Error("No selected jobs found to duplicate.");
      }

      const { error: insertError } = await supabase.from("jobs").insert(
        jobs.map((job) => ({
          title: `${job.title} (Copy)`,
          address: job.address,
          clean_type: job.clean_type,
          priority: job.priority,
          scope: job.scope,
          areas: job.areas ?? [],
          assigned_week_start: job.assigned_week_start,
          status: "scheduled",
          duplicate_source_job_id: job.id,
        })),
      );

      if (insertError) {
        throw new Error(insertError.message);
      }
    }, `Duplicated ${selectedCount} selected job(s).`);
  };

  const exportSelectedJobs = async () => {
    await runWithGuard(async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("jobs")
        .select(
          "id, title, address, clean_type, priority, status, created_at",
        )
        .in("id", selectedJobIds)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const rows = (data ?? []) as {
        id: string;
        title: string;
        address: string;
        clean_type: string;
        priority: string;
        status: string;
        created_at: string;
      }[];

      const csvLines = [
        "id,title,address,clean_type,priority,status,created_at",
        ...rows.map((row) =>
          [
            row.id,
            row.title,
            row.address,
            row.clean_type,
            row.priority,
            row.status,
            row.created_at,
          ]
            .map((value) => `\"${String(value).replaceAll("\"", "\"\"")}\"`)
            .join(","),
        ),
      ];

      const blob = new Blob([csvLines.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `dispatch-jobs-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, `Exported ${selectedCount} selected job(s) to CSV.`);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Bulk Job Actions</h2>
          <p className="mt-1 text-xs text-slate-500">
            {selectionMode
              ? `${selectedCount} selected of ${visibleJobIds.length} on this page.`
              : "Enable selection mode to operate on filtered jobs."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectionModeChange(!selectionMode)}
            className="min-h-[36px] rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          >
            {selectionMode ? "Exit selection" : "Enable selection"}
          </button>
          {selectionMode ? (
            <>
              <button
                type="button"
                onClick={onSelectAllVisible}
                className="min-h-[36px] rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Select all on page
              </button>
              <button
                type="button"
                onClick={onClearSelection}
                className="min-h-[36px] rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Clear
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <label className="text-xs font-medium text-slate-600">
          Assign selected jobs to
          <select
            value={assigneeId}
            onChange={(event) => setAssigneeId(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm text-slate-700"
          >
            <option value="">Choose employee</option>
            {employeeOptions.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name ?? employee.id.slice(0, 8)}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-medium text-slate-600">
          Status target
          <select
            value={statusTarget}
            onChange={(event) => setStatusTarget(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm text-slate-700"
          >
            {STATUS_TARGETS.map((target) => (
              <option key={target.value} value={target.value}>
                {target.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {statusText ? <p className="mt-2 text-xs text-emerald-700">{statusText}</p> : null}
      {errorText ? <p className="mt-2 text-xs text-rose-600">{errorText}</p> : null}

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          disabled={!canRunBulkActions || isSaving}
          onClick={() => void assignSelectedJobs()}
          className="min-h-[44px] rounded-md border border-slate-200 px-3 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Assign selected jobs
        </button>
        <button
          type="button"
          disabled={!canRunBulkActions || isSaving}
          onClick={() => void updateSelectedStatus()}
          className="min-h-[44px] rounded-md border border-slate-200 px-3 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Move selected to target status
        </button>
        <button
          type="button"
          disabled={!canRunBulkActions || isSaving}
          onClick={() => void duplicateSelectedJobs()}
          className="min-h-[44px] rounded-md border border-slate-200 px-3 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Duplicate selected jobs
        </button>
        <button
          type="button"
          disabled={!canRunBulkActions || isSaving}
          onClick={() => void exportSelectedJobs()}
          className="min-h-[44px] rounded-md border border-slate-200 px-3 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Export selected jobs
        </button>
      </div>
    </section>
  );
}