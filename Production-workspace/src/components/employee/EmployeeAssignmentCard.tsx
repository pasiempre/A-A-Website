"use client";

import type { ReactNode } from "react";

import { ASSIGNMENT_STATUS_OPTIONS, formatCleanType } from "@/lib/ticketing";

type EmployeeAssignmentCardProps = {
  assignmentId: string;
  title: string;
  address: string;
  cleanType: string;
  priority: string;
  status: string;
  role: string;
  areas: string[] | null;
  scope: string | null;
  checklistTotal: number;
  checklistCompleted: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onStatusChange: (nextStatus: string) => void;
  children: ReactNode;
};

function statusBadge(status: string) {
  switch (status) {
    case "assigned":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-amber-100 text-amber-800";
    case "complete":
      return "bg-green-100 text-green-800";
    case "blocked":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function priorityIndicator(priority: string) {
  switch (priority) {
    case "urgent":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          Urgente
        </span>
      );
    case "rush":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-800">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
          Rush
        </span>
      );
    default:
      return null;
  }
}

export function EmployeeAssignmentCard({
  title,
  address,
  cleanType,
  priority,
  status,
  role,
  areas,
  scope,
  checklistTotal,
  checklistCompleted,
  expanded,
  onToggleExpand,
  onStatusChange,
  children,
}: EmployeeAssignmentCardProps) {
  return (
    <article className="px-4 py-4 sm:px-5">
      <button
        type="button"
        onClick={onToggleExpand}
        className="flex min-h-[44px] w-full items-start justify-between gap-3 text-left"
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            {priorityIndicator(priority)}
          </div>
          <p className="mt-0.5 truncate text-sm text-slate-500">{address}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusBadge(status)}`}
            >
              {status.replaceAll("_", " ")}
            </span>
            <span className="text-xs text-slate-400">
              {formatCleanType(cleanType)} · {role === "lead" ? "Líder" : "Miembro"}
            </span>
            {checklistTotal > 0 && (
              <span className="text-xs text-slate-400">
                ✓ {checklistCompleted}/{checklistTotal}
              </span>
            )}
          </div>
        </div>

        <svg
          className={`mt-1 h-5 w-5 flex-shrink-0 text-slate-400 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {areas && areas.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {areas.map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
                >
                  {area}
                </span>
              ))}
            </div>
          )}

          {scope && <p className="text-sm text-slate-600">{scope}</p>}

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Actualizar estado
              <select
                className="mt-1.5 min-h-[44px] w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
              >
                {ASSIGNMENT_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {children}
        </div>
      )}
    </article>
  );
}
