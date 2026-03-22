"use client";

import { useCallback, useEffect, useState } from "react";

import { BulkJobActionsClient } from "@/components/admin/BulkJobActionsClient";
import {
  DispatchFiltersClient,
  type DispatchFiltersState,
} from "@/components/admin/DispatchFiltersClient";
import { Pagination } from "@/components/admin/Pagination";
import { createClient } from "@/lib/supabase/client";

const PAGE_SIZE = 25;

type DispatchJob = {
  id: string;
  title: string;
  address: string;
  status: string;
  priority: string;
  clean_type: string;
  assigned_to: string | null;
  assigned_week_start: string | null;
  created_at: string;
};

function statusColor(status: string) {
  switch (status) {
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-amber-100 text-amber-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "blocked":
      return "bg-red-100 text-red-800";
    case "en_route":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function priorityColor(priority: string) {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800";
    case "rush":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export function DispatchModule() {
  const [filters, setFilters] = useState<DispatchFiltersState>({
    status: "all",
    priority: "all",
    search: "",
  });

  const [jobs, setJobs] = useState<DispatchJob[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);

  const handleFiltersChange = useCallback((next: DispatchFiltersState) => {
    setFilters(next);
    setPage(0);
    setSelectedJobIds([]);
  }, []);

  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();
    let query = supabase
      .from("jobs")
      .select(
        "id, title, address, status, priority, clean_type, assigned_to, assigned_week_start, created_at",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (filters.status !== "all") {
      query = query.eq("status", filters.status);
    }
    if (filters.priority !== "all") {
      query = query.eq("priority", filters.priority);
    }
    if (filters.search.trim()) {
      const term = `%${filters.search.trim()}%`;
      query = query.or(`title.ilike.${term},address.ilike.${term}`);
    }

    const { data, error, count } = await query;
    if (!error) {
      setJobs((data as DispatchJob[]) ?? []);
      setTotalCount(count ?? 0);
    }
    setIsLoading(false);
  }, [filters, page]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadJobs();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadJobs]);

  const visibleJobIds = jobs.map((job) => job.id);

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobIds((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId],
    );
  };

  const selectAllVisible = () => {
    setSelectedJobIds(visibleJobIds);
  };

  const clearSelection = () => {
    setSelectedJobIds([]);
  };

  const handleActionComplete = () => {
    setSelectedJobIds([]);
    setSelectionMode(false);
    void loadJobs();
  };

  return (
    <div className="space-y-4">
      <DispatchFiltersClient
        value={filters}
        onChange={handleFiltersChange}
        resultCount={totalCount}
      />
      <BulkJobActionsClient
        selectionMode={selectionMode}
        onSelectionModeChange={setSelectionMode}
        selectedJobIds={selectedJobIds}
        visibleJobIds={visibleJobIds}
        onSelectAllVisible={selectAllVisible}
        onClearSelection={clearSelection}
        onActionComplete={handleActionComplete}
      />

      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              Dispatch Queue
              <span className="ml-2 text-xs font-normal text-slate-500">
                {totalCount} job{totalCount !== 1 ? "s" : ""} total
              </span>
            </h3>
            <button
              type="button"
              onClick={() => void loadJobs()}
              className="text-xs font-medium text-slate-600 underline hover:text-slate-900"
            >
              Refresh
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">
            No jobs match the current filters.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {jobs.map((job) => {
              const isSelected = selectedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  className={`flex items-start gap-3 px-4 py-3 transition ${
                    isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                  }`}
                >
                  {selectionMode && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleJobSelection(job.id)}
                      className="mt-1 h-5 w-5 rounded border-slate-300"
                      aria-label={`Select ${job.title}`}
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {job.title}
                      </p>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColor(job.status)}`}
                      >
                        {job.status.replace("_", " ")}
                      </span>
                      {job.priority !== "normal" && (
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityColor(job.priority)}`}
                        >
                          {job.priority}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {job.address}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-slate-400">
                      <span>{job.clean_type}</span>
                      {job.assigned_week_start && (
                        <span>
                          Week of{" "}
                          {new Date(
                            job.assigned_week_start,
                          ).toLocaleDateString()}
                        </span>
                      )}
                      <span>
                        Created{" "}
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {job.assigned_to ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Assigned
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                        Unassigned
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        totalCount={totalCount}
        onPageChange={(nextPage) => {
          setPage(nextPage);
          setSelectedJobIds([]);
        }}
      />
    </div>
  );
}