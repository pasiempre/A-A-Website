"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { ConfigurationClient } from "@/components/admin/ConfigurationClient";
import { DispatchModule } from "@/components/admin/DispatchModule";
import { HiringInboxClient } from "@/components/admin/HiringInboxClient";
import { InventoryManagementClient } from "@/components/admin/InventoryManagementClient";
import { LeadPipelineClient } from "@/components/admin/LeadPipelineClient";
import { NotificationCenterClient } from "@/components/admin/NotificationCenterClient";
import { OperationsEnhancementsClient } from "@/components/admin/OperationsEnhancementsClient";
import { OverviewDashboard } from "@/components/admin/OverviewDashboard";
import { SchedulingAndAvailabilityClient } from "@/components/admin/SchedulingAndAvailabilityClient";
import { TicketManagementClient } from "@/components/admin/TicketManagementClient";
import { UnifiedInsightsClient } from "@/components/admin/UnifiedInsightsClient";
import { AuthSignOutButton } from "@/components/ui/AuthSignOutButton";

export type ModuleId =
  | "overview"
  | "wizard"
  | "leads"
  | "tickets"
  | "dispatch"
  | "operations"
  | "scheduling"
  | "inventory"
  | "insights"
  | "notifications"
  | "hiring";

interface ModuleMeta {
  id: ModuleId;
  title: string;
  subtitle: string;
}

const MODULE_META: Record<ModuleId, ModuleMeta> = {
  overview: {
    id: "overview",
    title: "Dashboard Overview",
    subtitle: "Quick glance at operations, pending items, and key metrics.",
  },
  wizard: {
    id: "wizard",
    title: "Configuration",
    subtitle: "Manage onboarding setup and quote templates.",
  },
  leads: {
    id: "leads",
    title: "Lead Pipeline",
    subtitle: "New → Contacted → Quoted → Won/Lost lifecycle and quote actions.",
  },
  tickets: {
    id: "tickets",
    title: "Job Management",
    subtitle: "Create, assign, duplicate, and track weekly cleaning tickets.",
  },
  dispatch: {
    id: "dispatch",
    title: "Dispatch & Bulk Actions",
    subtitle: "Filter, select, and perform bulk operations on jobs.",
  },
  operations: {
    id: "operations",
    title: "Operations & QA",
    subtitle: "Checklist templates, QA sign-off, and location-based workflows.",
  },
  scheduling: {
    id: "scheduling",
    title: "Scheduling & Availability",
    subtitle: "Crew availability, time grid, and assignment control.",
  },
  inventory: {
    id: "inventory",
    title: "Inventory Management",
    subtitle: "Stock levels, requests, and low-inventory review.",
  },
  insights: {
    id: "insights",
    title: "Unified Insights",
    subtitle: "Revenue, jobs, team, leads, and hiring analytics.",
  },
  notifications: {
    id: "notifications",
    title: "Notification Center",
    subtitle: "Preference controls, quiet hours, and queue monitoring.",
  },
  hiring: {
    id: "hiring",
    title: "Hiring Inbox",
    subtitle: "Employment intake review and applicant status updates.",
  },
};

const MODULE_IDS = Object.keys(MODULE_META) as ModuleId[];

function isModuleId(value: string | null | undefined): value is ModuleId {
  return !!value && MODULE_IDS.includes(value as ModuleId);
}

function resolveInitialModule(paramValue: string | null): ModuleId {
  if (isModuleId(paramValue)) {
    return paramValue;
  }
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("aa_admin_active_module");
    if (isModuleId(saved)) {
      return saved;
    }
  }
  return "overview";
}

export function AdminShell() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeModuleState, setActiveModuleState] = useState<ModuleId>(() =>
    resolveInitialModule(searchParams.get("module")),
  );
  const paramModule = searchParams.get("module");
  const activeModule = isModuleId(paramModule) ? paramModule : activeModuleState;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return localStorage.getItem("aa_admin_sidebar_collapsed") === "true";
  });

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("aa_admin_active_module", activeModule);
  }, [activeModule]);

  useEffect(() => {
    localStorage.setItem("aa_admin_sidebar_collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const navigateToModule = useCallback(
    (moduleId: string) => {
      if (!isModuleId(moduleId)) {
        return;
      }
      setActiveModuleState(moduleId);
      setMobileNavOpen(false);

      const params = new URLSearchParams(searchParams.toString());
      if (moduleId === "overview") {
        params.delete("module");
      } else {
        params.set("module", moduleId);
      }
      const query = params.toString();
      router.replace(`/admin${query ? `?${query}` : ""}`, {
        scroll: false,
      });
    },
    [searchParams, router],
  );

  const meta = MODULE_META[activeModule];

  return (
    <div className="flex min-h-screen">
      {mobileNavOpen && <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setMobileNavOpen(false)} aria-hidden />}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white
          transition-all duration-200 ease-in-out
          ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:z-auto md:translate-x-0
          ${sidebarCollapsed ? "md:w-16" : "md:w-64"}
        `}
      >
        <div
          className={`flex items-center border-b border-slate-100 px-4 py-4 ${
            sidebarCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!sidebarCollapsed && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">A&A Cleaning</p>
              <p className="text-sm font-medium text-slate-700">Admin</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="hidden rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 md:block"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            type="button"
          >
            <svg
              className={`h-4 w-4 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 md:hidden"
            aria-label="Close navigation"
            type="button"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <AdminSidebarNav activeModule={activeModule} collapsed={sidebarCollapsed} onSelect={navigateToModule} />

        <div className="mt-auto border-t border-slate-100 p-3">
          <AuthSignOutButton redirectTo="/auth/admin" />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-sm md:px-6">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 md:hidden"
            aria-label="Open navigation"
            type="button"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
            <span className="text-slate-400">Admin</span>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-700">{meta.title}</span>
          </nav>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">{meta.title}</h1>
            <p className="mt-1 text-sm text-slate-600">{meta.subtitle}</p>
          </div>

          <ModuleContent moduleId={activeModule} onModuleSelect={navigateToModule} />
        </main>
      </div>
    </div>
  );
}

function ModuleContent({ moduleId, onModuleSelect }: { moduleId: ModuleId; onModuleSelect: (moduleId: ModuleId) => void }) {
  switch (moduleId) {
    case "overview":
      return <OverviewDashboard onModuleSelect={onModuleSelect} />;
    case "wizard":
      return <ConfigurationClient />;
    case "leads":
      return <LeadPipelineClient />;
    case "tickets":
      return <TicketManagementClient />;
    case "dispatch":
      return <DispatchModule />;
    case "operations":
      return <OperationsEnhancementsClient />;
    case "scheduling":
      return <SchedulingAndAvailabilityClient />;
    case "inventory":
      return <InventoryManagementClient />;
    case "insights":
      return <UnifiedInsightsClient />;
    case "notifications":
      return <NotificationCenterClient />;
    case "hiring":
      return <HiringInboxClient />;
    default:
      return null;
  }
}