"use client";

type EmployeePhotoUploadProps = {
  file: File | null;
  isUploading: boolean;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
};

export function EmployeePhotoUpload({
  file,
  isUploading,
  onFileChange,
  onUpload,
}: EmployeePhotoUploadProps) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Foto de finalización
      </p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="flex-1">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-medium"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />
        </label>
        <button
          type="button"
          className="min-h-[44px] rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700 active:bg-slate-800 disabled:opacity-60"
          disabled={isUploading || !file}
          onClick={onUpload}
        >
          {isUploading ? "Subiendo..." : "Subir foto"}
        </button>
      </div>
      <p className="mt-1.5 text-[11px] text-slate-400">
        JPG/PNG/WebP, máx 10 MB. Compresión automática + reintento offline.
      </p>
    </div>
  );
}
