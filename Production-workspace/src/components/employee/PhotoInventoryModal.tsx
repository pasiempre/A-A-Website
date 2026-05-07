"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { listPendingPhotoUploads, removePendingPhotoUpload, type PendingPhotoUpload } from "@/lib/photo-upload-queue";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface PhotoInventoryModalProps {
  open: boolean;
  onClose: () => void;
  onFlush: () => void;
}

export function PhotoInventoryModal({ open, onClose, onFlush }: PhotoInventoryModalProps) {
  const [pending, setPending] = useState<PendingPhotoUpload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement | null>(null);

  useFocusTrap(modalRef, open);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await listPendingPhotoUploads();
      setPending(items);
    } catch {
      setPending([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => {
        void refresh();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [open, refresh]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await removePendingPhotoUpload(id);
      setPending((prev) => prev.filter((photo) => photo.id !== id));
    } catch {
      // Silently fail; stale entries are pruned during retry.
    }
    setRemovingId(null);
  };

  const handleRetryAll = () => {
    onFlush();
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />

      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-lg rounded-t-xl bg-white shadow-xl sm:m-4 sm:rounded-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
          <div>
            <h2 id={titleId} className="text-base font-semibold text-slate-900">Fotos Pendientes</h2>
            <p className="text-xs text-slate-500">
              {pending.length} foto{pending.length !== 1 ? "s" : ""} esperando conexión
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Cerrar"
            type="button"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-4 py-3 sm:px-5">
          {isLoading ? (
            <p className="py-8 text-center text-sm text-slate-500">Cargando...</p>
          ) : pending.length === 0 ? (
            <div className="py-8 text-center">
              <span
                className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                aria-hidden
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <p className="mt-2 text-sm text-slate-600">No hay fotos pendientes. Todo sincronizado.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {pending.map((item) => (
                <li key={item.id} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-slate-100">
                    {item.type === "completion" ? (
                      <svg className="h-5 w-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 7a2 2 0 012-2h3l1-1h6l1 1h3a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10a3 3 0 100 6 3 3 0 000-6z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86L1.82 18A2 2 0 003.55 21h16.9a2 2 0 001.73-3l-8.47-14.14a2 2 0 00-3.46 0z" />
                      </svg>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{item.fileName}</p>
                    <div className="mt-0.5 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          item.type === "completion" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.type === "completion" ? "Finalización" : "Problema"}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Guardada{" "}
                      {new Date(item.createdAt).toLocaleString("es-MX", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {item.description && <p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.description}</p>}
                  </div>

                  <button
                    onClick={() => void handleRemove(item.id)}
                    disabled={removingId === item.id}
                    className="flex-shrink-0 rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    aria-label={`Eliminar ${item.fileName}`}
                    type="button"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {pending.length > 0 && (
          <div className="border-t border-slate-100 px-4 py-3 sm:px-5">
            <div className="flex gap-2">
              <button
                onClick={handleRetryAll}
                className="flex-1 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
                type="button"
              >
                Reintentar todas ({pending.length})
              </button>
              <button
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                type="button"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}