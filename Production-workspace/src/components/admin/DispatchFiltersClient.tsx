"use client";

export type DispatchFiltersState = {
  status: string;
  priority: string;
  search: string;
};

const STATUS_OPTIONS = ["all", "scheduled", "en_route", "in_progress", "completed", "blocked"];
const PRIORITY_OPTIONS = ["all", "normal", "urgent", "rush"];

type DispatchFiltersClientProps = {
  value: DispatchFiltersState;
  onChange: (next: DispatchFiltersState) => void;
  resultCount?: number;
};

export function DispatchFiltersClient({ value, onChange, resultCount }: DispatchFiltersClientProps) {
  const setStatus = (status: string) => onChange({ ...value, status });
  const setPriority = (priority: string) => onChange({ ...value, priority });
  const setSearch = (search: string) => onChange({ ...value, search });

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-800">Dispatch Filters</h2>
      {typeof resultCount === "number" ? (
        <p className="mt-1 text-xs text-slate-500">{resultCount} job(s) match current filters.</p>
      ) : null}
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <label className="text-xs font-medium text-slate-600">
          Status
          <select
            value={value.status}
            onChange={(event) => setStatus(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm text-slate-700"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-medium text-slate-600">
          Priority
          <select
            value={value.priority}
            onChange={(event) => setPriority(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm text-slate-700"
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-medium text-slate-600">
          Search
          <input
            value={value.search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Customer or address"
            className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm text-slate-700"
          />
        </label>
      </div>
      <p className="mt-2 text-xs text-slate-500">Filters apply directly to the dispatch job list and bulk actions scope.</p>
    </section>
  );
}