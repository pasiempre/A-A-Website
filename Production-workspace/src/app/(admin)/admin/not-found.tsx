import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md text-center">
        <p className="text-6xl font-bold text-slate-200">404</p>
        <h1 className="mt-4 text-xl font-semibold text-slate-900">
          Admin page not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          This admin section doesn&apos;t exist or may have been moved.
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
