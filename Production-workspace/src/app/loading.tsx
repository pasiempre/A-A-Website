export default function Loading() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] px-6 py-12 md:px-10 md:py-16" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-6xl animate-pulse space-y-8">
        <div className="h-8 w-48 rounded bg-slate-200" />
        <div className="h-24 w-full rounded-2xl bg-slate-200" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 rounded-2xl bg-slate-200" />
          <div className="h-64 rounded-2xl bg-slate-200" />
        </div>
      </div>
    </main>
  );
}
