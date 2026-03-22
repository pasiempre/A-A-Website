"use client";

import { useCallback, useState } from "react";

import { EmployeeInventoryClient } from "@/components/employee/EmployeeInventoryClient";
import { EmployeeTicketsClient } from "@/components/employee/EmployeeTicketsClient";

type TabId = "tickets" | "inventory";

interface TabMeta {
  id: TabId;
  label: string;
  icon: string;
}

const TABS: TabMeta[] = [
  { id: "tickets", label: "Mis Trabajos", icon: "📋" },
  { id: "inventory", label: "Suministros", icon: "📦" },
];

function isTabId(value: string | null): value is TabId {
  return value === "tickets" || value === "inventory";
}

function resolveInitialTab(): TabId {
  if (typeof window === "undefined") {
    return "tickets";
  }
  const saved = localStorage.getItem("aa_employee_active_tab");
  return isTabId(saved) ? saved : "tickets";
}

export function EmployeePortalTabs() {
  const [activeTab, setActiveTab] = useState<TabId>(resolveInitialTab);

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
        {TABS.map((tab) => {
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
              <span className="text-base leading-none">{tab.icon}</span>
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

      <div
        id="panel-inventory"
        role="tabpanel"
        aria-labelledby="tab-inventory"
        hidden={activeTab !== "inventory"}
      >
        {activeTab === "inventory" && <EmployeeInventoryClient />}
      </div>
    </div>
  );
}