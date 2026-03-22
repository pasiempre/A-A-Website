const modules = [
  {
    title: "My Assignments",
    detail: "Assigned jobs list with status progression (assigned → en route → in progress → complete).",
    status: "Daily Work",
  },
  {
    title: "Photo Upload + Completion",
    detail: "Completion photos with upload queue behavior and timestamped evidence.",
    status: "Proof of Work",
  },
  {
    title: "Issue Reporting",
    detail: "Field condition reporting with notes and optional photo attachment.",
    status: "Quality",
  },
  {
    title: "Supply Usage",
    detail: "Log product usage tied to active jobs and usage quantity.",
    status: "Inventory",
  },
  {
    title: "Supply Requests",
    detail: "Submit supply requests by urgency and see request statuses.",
    status: "Inventory",
  },
];

export function EmployeePreviewModePanels() {
  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Dev Preview Mode</p>
        <p className="mt-1">This is a layout preview of employee modules. Login, assigned job data, and uploads are disabled in preview mode.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <article key={module.title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-700">
              {module.status}
            </p>
            <h2 className="text-base font-semibold text-slate-900">{module.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{module.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
