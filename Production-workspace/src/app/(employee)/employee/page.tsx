import { EmployeePreviewModePanels } from "@/components/employee/EmployeePreviewModePanels";
import { EmployeePortalTabs } from "@/components/employee/EmployeePortalTabs";
import { AuthSignOutButton } from "@/components/ui/AuthSignOutButton";
import { isDevPreviewEnabled } from "@/lib/dev-preview";

export default function EmployeeHomePage() {
  if (isDevPreviewEnabled()) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-10 md:py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Portal Empleado</h1>
          <p className="mt-1 text-sm text-slate-600">Preview mode for employee portal layout and module structure.</p>
        </div>
        <EmployeePreviewModePanels />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-10 md:py-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Portal Empleado</h1>
          <p className="mt-1 text-sm text-slate-600">Mis trabajos, estados, y reporte de problemas desde el teléfono.</p>
        </div>
        <AuthSignOutButton redirectTo="/auth/employee" />
      </div>
      <EmployeePortalTabs />
    </main>
  );
}
