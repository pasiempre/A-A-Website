"use client";

type ChecklistItem = {
  id: string;
  item_text: string;
  is_completed: boolean;
};

type EmployeeChecklistViewProps = {
  items: ChecklistItem[];
  onToggle: (itemId: string, checked: boolean) => void;
};

export function EmployeeChecklistView({
  items,
  onToggle,
}: EmployeeChecklistViewProps) {
  if (items.length === 0) return null;

  const completedCount = items.filter((item) => item.is_completed).length;

  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Checklist ({completedCount}/{items.length})
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={item.is_completed}
              onChange={(e) => onToggle(item.id, e.target.checked)}
              className="h-5 w-5 rounded border-slate-300"
            />
            <span
              className={`text-sm ${
                item.is_completed
                  ? "text-slate-400 line-through"
                  : "text-slate-700"
              }`}
            >
              {item.item_text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
