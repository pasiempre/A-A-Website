"use client";

import type { ModuleId } from "@/components/admin/AdminShell";

interface OverviewDashboardProps {
  onModuleSelect: (moduleId: ModuleId) => void;
}

const CARDS: {
  module: ModuleId;
  label: string;
  icon: string;
  color: string;
}[] = [
  {
    module: "tickets",
    label: "Active Jobs",
    icon: "📋",
    color: "border-blue-200 bg-blue-50",
  },
  {
    module: "leads",
    label: "Open Leads",
    icon: "🎯",
    color: "border-green-200 bg-green-50",
  },
  {
    module: "scheduling",
    label: "Today's Schedule",
    icon: "📅",
    color: "border-purple-200 bg-purple-50",
  },
  {
    module: "hiring",
    label: "Pending Applicants",
    icon: "👥",
    color: "border-amber-200 bg-amber-50",
  },
  {
    module: "inventory",
    label: "Inventory Alerts",
    icon: "📦",
    color: "border-red-200 bg-red-50",
  },
  {
    module: "insights",
    label: "Analytics",
    icon: "📊",
    color: "border-slate-200 bg-slate-50",
  },
];

export function OverviewDashboard({ onModuleSelect }: OverviewDashboardProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CARDS.map((card) => (
        <button
          key={card.module}
          onClick={() => onModuleSelect(card.module)}
          className={`rounded-lg border p-5 text-left transition hover:shadow-md ${card.color}`}
          type="button"
        >
          <span className="text-2xl">{card.icon}</span>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {card.label}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Click to open module →
          </p>
        </button>
      ))}
    </div>
  );
}