import Link from "next/link";

export default function EmployeeNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md text-center">
        <p className="text-6xl font-bold text-slate-200">404</p>
        <h1 className="mt-4 text-xl font-semibold text-slate-900">
          Página no encontrada
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Esta sección no existe o fue movida.
        </p>
        <Link
          href="/employee"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          Volver al portal
        </Link>
      </div>
    </div>
  );
}
