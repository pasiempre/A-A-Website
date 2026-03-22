import { Suspense } from "react";
import { AdminPreviewModePanels } from "@/components/admin/AdminPreviewModePanels";
import { AdminShell } from "../../../components/admin/AdminShell";
import { isDevPreviewEnabled } from "@/lib/dev-preview";

function AdminShellLoadingFallback() {
  return (
    <div className="flex min-h-screen" aria-busy="true" aria-live="polite">
      <aside className="hidden w-64 border-r border-slate-200 bg-white md:block">
        <div className="animate-pulse space-y-4 p-4">
          <div className="h-8 w-32 rounded bg-slate-200" />
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-8 rounded bg-slate-100" />
            ))}
          </div>
        </div>
      </aside>
      <div className="flex-1 animate-pulse p-6 md:p-8">
        <div className="h-8 w-48 rounded bg-slate-200" />
        <div className="mt-2 h-4 w-72 rounded bg-slate-100" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminHomePage() {
  if (isDevPreviewEnabled()) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-10 md:py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Preview mode for admin dashboard layout and module structure.</p>
        </div>
        <AdminPreviewModePanels />
      </main>
    );
  }

  return (
    <Suspense fallback={<AdminShellLoadingFallback />}>
      <AdminShell />
    </Suspense>
  );
}
