"use client";

import { useCallback, useMemo, useState } from "react";

import { EmployeeInventoryClient } from "@/components/employee/EmployeeInventoryClient";
import { EmployeeTicketsClient } from "@/components/employee/EmployeeTicketsClient";
import { getPublicEnv } from "@/lib/env";

type TabId = "tickets" | "inventory";

interface TabMeta {
  id: TabId;
  label: string;
  icon: "clipboard" | "box";
}

const ALL_TABS: TabMeta[] = [
  { id: "tickets", label: "Mis Trabajos", icon: "clipboard" },
  { id: "inventory", label: "Suministros", icon: "box" },
];

function renderTabIcon(icon: TabMeta["icon"]) {
  if (icon === "clipboard") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="7" y="4" width="10" height="16" rx="2" />
        <path d="M9 4.5h6" />
        <path d="M9 10h6M9 14h6" />
      </svg>
    );
  }

  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="m4 7.5 8 4.5 8-4.5" />
    </svg>
  );
}

function isTabId(value: string | null): value is TabId {
  return value === "tickets" || value === "inventory";
}

function resolveInitialTab(availableTabs: TabMeta[]): TabId {
  if (typeof window === "undefined") {
    return availableTabs[0]?.id || "tickets";
  }
  const saved = localStorage.getItem("aa_employee_active_tab");
  if (isTabId(saved) && availableTabs.some((t) => t.id === saved)) {
    return saved;
  }
  return availableTabs[0]?.id || "tickets";
}

export function EmployeePortalTabs() {
  const availableTabs = useMemo(() => {
    const { employeeInventoryEnabled } = getPublicEnv();
    if (employeeInventoryEnabled) return ALL_TABS;
    return ALL_TABS.filter((t) => t.id !== "inventory");
  }, []);

  const [activeTab, setActiveTab] = useState<TabId>(() =>
    resolveInitialTab(availableTabs),
  );

  const switchTab = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
    localStorage.setItem("aa_employee_active_tab", tabId);
  }, []);

  return (
    <div>
      <nav
        className="mb-4 flex gap-2"
        aria-label="Secciones del portal"
        role="tablist"
      >
        {availableTabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => switchTab(tab.id)}
              className={`
                flex min-h-[44px] flex-1 items-center justify-center gap-2
                rounded-lg border px-4 py-2.5 text-sm font-medium
                transition-colors
                ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 active:bg-slate-100"
                }
              `}
            >
              <span className="flex-shrink-0">{renderTabIcon(tab.icon)}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div
        id="panel-tickets"
        role="tabpanel"
        aria-labelledby="tab-tickets"
        hidden={activeTab !== "tickets"}
      >
        {activeTab === "tickets" && <EmployeeTicketsClient />}
      </div>

      {availableTabs.some((t) => t.id === "inventory") && (
        <div
          id="panel-inventory"
          role="tabpanel"
          aria-labelledby="tab-inventory"
          hidden={activeTab !== "inventory"}
        >
          {activeTab === "inventory" && <EmployeeInventoryClient />}
        </div>
      )}
    </div>
  );
}