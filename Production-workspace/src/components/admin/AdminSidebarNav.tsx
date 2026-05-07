"use client";

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavItem {
  id: string;
  label: string;
  icon: NavIconKey;
  badge?: number;
}

type NavIconKey =
  | "home"
  | "clipboard"
  | "truck"
  | "compass"
  | "calendar"
  | "check"
  | "chart"
  | "users"
  | "bell"
  | "box"
  | "cog";

/**
 * F-05: Simplified Sidebar Grouping
 * Reduces cognitive load by grouping 11 modules into 3 logical tiers.
 */
const NAV_GROUPS: NavGroup[] = [
  {
    label: "Daily Work",
    items: [
      { id: "overview", label: "Home", icon: "home" },
      { id: "leads", label: "Leads & Quotes", icon: "clipboard" },
      { id: "tickets", label: "Jobs", icon: "truck" },
      { id: "dispatch", label: "Dispatch", icon: "compass" },
      { id: "scheduling", label: "Scheduling", icon: "calendar" },
      { id: "operations", label: "Review & Approve", icon: "check" },
    ],
  },
  {
    label: "Business",
    items: [
      { id: "insights", label: "Insights", icon: "chart" },
      { id: "hiring", label: "Hiring", icon: "users" },
    ],
  },
  {
    label: "Settings",
    items: [
      { id: "notifications", label: "Notifications", icon: "bell" },
      { id: "inventory", label: "Inventory", icon: "box" },
      { id: "wizard", label: "Configuration", icon: "cog" },
    ],
  },
];

function renderNavIcon(icon: NavIconKey) {
  const baseClass = "h-4 w-4";

  switch (icon) {
    case "home":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5.5 10.5V20h13V10.5" />
        </svg>
      );
    case "clipboard":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="7" y="4" width="10" height="16" rx="2" />
          <path d="M9 4.5h6" />
          <path d="M9 10h6M9 14h6" />
        </svg>
      );
    case "truck":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 7h12v8H3z" />
          <path d="M15 10h4l2 2v3h-6z" />
          <circle cx="7" cy="18" r="1.8" />
          <circle cx="18" cy="18" r="1.8" />
        </svg>
      );
    case "compass":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2.5 6-6 2.5 2.5-6z" />
        </svg>
      );
    case "calendar":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      );
    case "check":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12.5 2.3 2.3 4.7-5" />
        </svg>
      );
    case "chart":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19h16" />
          <path d="M7 15V9M12 15V6M17 15v-4" />
        </svg>
      );
    case "users":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="9" r="3" />
          <circle cx="17" cy="10" r="2.5" />
          <path d="M4 19c0-2.7 2.2-4.5 5-4.5s5 1.8 5 4.5" />
          <path d="M14.5 19c.2-1.8 1.7-3.1 3.7-3.1 1 0 1.8.2 2.4.7" />
        </svg>
      );
    case "bell":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 16h12l-1-2v-3a5 5 0 1 0-10 0v3z" />
          <path d="M10 18a2 2 0 0 0 4 0" />
        </svg>
      );
    case "box":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
          <path d="m4 7.5 8 4.5 8-4.5" />
        </svg>
      );
    case "cog":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1 1 0 1 1-1.4 1.4l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V19a1 1 0 1 1-2 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1 1 0 1 1-1.4-1.4l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H9a1 1 0 1 1 0-2h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1 1 0 1 1 1.4-1.4l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V5a1 1 0 1 1 2 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1 1 0 1 1 1.4 1.4l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a1 1 0 1 1 0 2h-.2a1 1 0 0 0-.9.6" />
        </svg>
      );
  }
}

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
                    <span className="flex-shrink-0" aria-hidden>{renderNavIcon(item.icon)}</span>
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