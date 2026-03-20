const modules = [
  {
    title: "First-Run Wizard",
    detail: "Guided setup for first client, sample job, and assignment.",
    status: "Setup Flow",
  },
  {
    title: "Lead Pipeline",
    detail: "New → Contacted → Quoted → Won/Lost lifecycle board and quote actions.",
    status: "Revenue Ops",
  },
  {
    title: "Notification Center",
    detail: "Preference controls, quiet hours, and queue monitoring.",
    status: "Comms",
  },
  {
    title: "Ticket Management",
    detail: "Create jobs, assign crew, clone jobs, and track execution status.",
    status: "Core Ops",
  },
  {
    title: "Operations Enhancements",
    detail: "Checklist templates and location-based job message workflows.",
    status: "QA + Process",
  },
  {
    title: "Unified Insights",
    detail: "Overview, operations, quality, financial, and inventory snapshots.",
    status: "Reporting",
  },
  {
    title: "Scheduling & Availability",
    detail: "Crew availability and reassignment control lanes.",
    status: "Dispatch",
  },
  {
    title: "Inventory Management",
    detail: "Stock levels, requests, and low-inventory review.",
    status: "Supplies",
  },
  {
    title: "Hiring Inbox",
    detail: "Employment intake review and applicant status updates.",
    status: "Hiring",
  },
];

export function AdminPreviewModePanels() {
  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Dev Preview Mode</p>
        <p className="mt-1">
          This is a layout preview of admin modules. Live data, auth state, and write actions are disabled until Supabase is configured.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
