export const CLEAN_TYPE_OPTIONS = [
  { value: "post_construction", label: "Post-Construction" },
  { value: "final_clean", label: "Final Clean" },
  { value: "rough_clean", label: "Rough Clean" },
  { value: "move_in_out", label: "Move-In/Move-Out" },
  { value: "window", label: "Windows" },
  { value: "power_wash", label: "Power Wash" },
  { value: "commercial", label: "Commercial" },
  { value: "general", label: "General" },
  { value: "custom", label: "Custom" },
] as const;

export const PRIORITY_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "urgent", label: "Urgent" },
  { value: "rush", label: "Rush" },
] as const;

export const JOB_STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "en_route", label: "En Route" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "blocked", label: "Blocked" },
] as const;

export const ASSIGNMENT_STATUS_OPTIONS = [
  { value: "assigned", label: "Asignado" },
  { value: "en_route", label: "En camino" },
  { value: "in_progress", label: "En progreso" },
  { value: "complete", label: "Completado" },
] as const;

export function parseAreas(input: string) {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatCleanType(value: string | null | undefined) {
  const match = CLEAN_TYPE_OPTIONS.find((option) => option.value === value);
  return match?.label ?? "General";
}

export function formatPriority(value: string | null | undefined) {
  const match = PRIORITY_OPTIONS.find((option) => option.value === value);
  return match?.label ?? "Normal";
}
