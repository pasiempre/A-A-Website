import { AuthSignOutButton } from "@/components/ui/AuthSignOutButton";
import { FirstRunWizardClient } from "@/components/admin/FirstRunWizardClient";
import { HiringInboxClient } from "@/components/admin/HiringInboxClient";
import { InventoryManagementClient } from "@/components/admin/InventoryManagementClient";
import { LeadPipelineClient } from "@/components/admin/LeadPipelineClient";
import { NotificationCenterClient } from "@/components/admin/NotificationCenterClient";
import { OperationsEnhancementsClient } from "@/components/admin/OperationsEnhancementsClient";
import { SchedulingAndAvailabilityClient } from "@/components/admin/SchedulingAndAvailabilityClient";
import { TicketManagementClient } from "@/components/admin/TicketManagementClient";
import { UnifiedInsightsClient } from "@/components/admin/UnifiedInsightsClient";

export default function AdminHomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-10 md:py-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Admin Ticketing</h1>
          <p className="mt-1 text-sm text-slate-600">Create, assign, duplicate, and track weekly cleaning tickets.</p>
        </div>
        <AuthSignOutButton redirectTo="/auth/admin" />
      </div>
      <FirstRunWizardClient />
      <LeadPipelineClient />
      <NotificationCenterClient />
      <TicketManagementClient />
      <OperationsEnhancementsClient />
      <UnifiedInsightsClient />
      <SchedulingAndAvailabilityClient />
      <InventoryManagementClient />
      <HiringInboxClient />
    </main>
  );
}
