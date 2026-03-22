"use client";

type EmployeeIssueReportProps = {
  description: string;
  onDescriptionChange: (value: string) => void;
  file: File | null;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
};

export function EmployeeIssueReport({
  description,
  onDescriptionChange,
  onFileChange,
  onSubmit,
}: EmployeeIssueReportProps) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Reportar problema
      </p>
      <textarea
        rows={2}
        className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
        placeholder="Describe el problema..."
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="text-xs text-slate-500">Foto (opcional)</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-medium"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />
        </label>
        <button
          type="button"
          className="min-h-[44px] rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-500 active:bg-red-700"
          onClick={onSubmit}
        >
          Enviar problema
        </button>
      </div>
    </div>
  );
}
