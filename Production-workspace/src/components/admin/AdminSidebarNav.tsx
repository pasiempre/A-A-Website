"use client";

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

/**
 * F-05: Simplified Sidebar Grouping
 * Reduces cognitive load by grouping 11 modules into 3 logical tiers.
 */
const NAV_GROUPS: NavGroup[] = [
  {
    label: "Daily Work",
    items: [
      { id: "overview", label: "Home", icon: "🏠" },
      { id: "leads", label: "Leads & Quotes", icon: "📋" },
      { id: "tickets", label: "Jobs & Dispatch", icon: "🚐" },
      { id: "operations", label: "Review & Approve", icon: "✅" },
    ],
  },
  {
    label: "Business",
    items: [
      { id: "insights", label: "Insights", icon: "📈" },
      { id: "hiring", label: "Hiring", icon: "👥" },
    ],
  },
  {
    label: "Settings",
    items: [
      { id: "notifications", label: "Notifications", icon: "🔔" },
      { id: "inventory", label: "Inventory", icon: "📦" },
      { id: "wizard", label: "Configuration", icon: "⚙️" },
    ],
  },
];

interface AdminSidebarNavProps {
  activeModule: string;
  collapsed: boolean;
  onSelect: (moduleId: string) => void;
}

export function AdminSidebarNav({ activeModule, collapsed, onSelect }: AdminSidebarNavProps) {
  return (
    <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Admin navigation">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mb-4">
          {!collapsed && (
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              {group.label}
            </p>
          )}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = item.id === activeModule;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onSelect(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`
                      flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors
                      ${
                        isActive
                          ? "bg-slate-900 font-medium text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }
                      ${collapsed ? "justify-center px-0" : ""}
                    `}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="flex-shrink-0 text-base leading-none">{item.icon}</span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}