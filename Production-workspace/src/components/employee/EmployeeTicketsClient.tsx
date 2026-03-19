"use client";

import { useCallback, useEffect, useState } from "react";

import { compressPhoto, getCurrentPosition, validatePhoto } from "@/lib/client-photo";
import { enqueuePendingPhotoUpload, listPendingPhotoUploads, removePendingPhotoUpload, type PendingPhotoUpload } from "@/lib/photo-upload-queue";
import { createClient } from "@/lib/supabase/client";
import { ASSIGNMENT_STATUS_OPTIONS, formatCleanType } from "@/lib/ticketing";

type AssignmentRow = {
  id: string;
  job_id: string;
  employee_id: string;
  role: string;
  status: string;
  jobs: {
    title: string;
    address: string;
    clean_type: string;
    scope: string | null;
    areas: string[] | null;
    priority: string;
    job_checklist_items:
      | {
          id: string;
          item_text: string;
          is_completed: boolean;
        }[]
      | null;
    job_messages:
      | {
          id: string;
          message_text: string;
          created_at: string;
        }[]
      | null;
  }[] | null;
};

async function uploadCompletionAsset(options: {
  supabase: ReturnType<typeof createClient>;
  assignmentId: string;
  jobId: string;
  userId: string;
  file: File;
}) {
  const { blob, metadata } = await compressPhoto(options.file);
  const position = await getCurrentPosition();
  const baseName = options.file.name.replace(/\.[^.]+$/, "").replace(/\s+/g, "-") || "completion-photo";
  const filePath = `completion/${options.jobId}/${Date.now()}-${baseName}.jpg`;

  const { error: uploadError } = await options.supabase.storage.from("job-photos").upload(filePath, blob, {
    cacheControl: "3600",
    upsert: false,
    contentType: "image/jpeg",
    metadata: {
      capturedAt: new Date().toISOString(),
      latitude: position?.coords.latitude ?? null,
      longitude: position?.coords.longitude ?? null,
      ...metadata,
    },
  });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { error: insertError } = await options.supabase.from("job_photos").insert({
    job_id: options.jobId,
    employee_id: options.userId,
    storage_path: filePath,
    photo_type: "completion",
    notes: "Completion photo uploaded from employee portal",
    taken_at: new Date().toISOString(),
    latitude: position?.coords.latitude ?? null,
    longitude: position?.coords.longitude ?? null,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  return options.assignmentId;
}

async function uploadIssueAsset(options: {
  supabase: ReturnType<typeof createClient>;
  jobId: string;
  userId: string;
  description: string;
  file: File | null;
}) {
  let photoPath: string | null = null;

  if (options.file) {
    const { blob, metadata } = await compressPhoto(options.file);
    const position = await getCurrentPosition();
    const baseName = options.file.name.replace(/\.[^.]+$/, "").replace(/\s+/g, "-") || "issue-photo";
    photoPath = `issue-reports/${options.jobId}/${Date.now()}-${baseName}.jpg`;

    const { error: uploadError } = await options.supabase.storage.from("job-photos").upload(photoPath, blob, {
      cacheControl: "3600",
      upsert: false,
      contentType: "image/jpeg",
      metadata: {
        capturedAt: new Date().toISOString(),
        latitude: position?.coords.latitude ?? null,
        longitude: position?.coords.longitude ?? null,
        ...metadata,
      },
    });

    if (uploadError) {
      throw new Error(uploadError.message);
    }
  }

  const { error: issueError } = await options.supabase.from("issue_reports").insert({
    job_id: options.jobId,
    reported_by: options.userId,
    description: options.description,
    photo_path: photoPath,
  });

  if (issueError) {
    throw new Error(issueError.message);
  }
}

export function EmployeeTicketsClient() {
  const getSupabase = () => createClient();

  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [issueByAssignment, setIssueByAssignment] = useState<Record<string, string>>({});
  const [issueFileByAssignment, setIssueFileByAssignment] = useState<Record<string, File | null>>({});
  const [completionFileByAssignment, setCompletionFileByAssignment] = useState<Record<string, File | null>>({});
  const [uploadingCompletionFor, setUploadingCompletionFor] = useState<string | null>(null);
  const [messageByAssignment, setMessageByAssignment] = useState<Record<string, string>>({});
  const [pendingUploadCount, setPendingUploadCount] = useState(0);

  const refreshPendingCount = useCallback(async () => {
    try {
      const pending = await listPendingPhotoUploads();
      setPendingUploadCount(pending.length);
    } catch {
      setPendingUploadCount(0);
    }
  }, []);

  const loadAssignments = useCallback(async (options?: { setLoading?: boolean }) => {
    const supabase = getSupabase();
    if (options?.setLoading !== false) {
      setIsLoading(true);
    }
    setFormError(null);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setFormError(authError?.message ?? "Unable to load user session.");
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("job_assignments")
      .select(
        "id, job_id, employee_id, role, status, jobs(title, address, clean_type, scope, areas, priority, job_checklist_items(id, item_text, is_completed), job_messages(id, message_text, created_at))",
      )
      .eq("employee_id", user.id)
      .order("assigned_at", { ascending: false });

    if (error) {
      setFormError(error.message);
    } else {
      setAssignments((data as AssignmentRow[]) ?? []);
    }

    setIsLoading(false);
  }, []);

  const flushPendingUploads = useCallback(async () => {
    const supabase = getSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return;
    }

    let flushed = 0;
    const pending = await listPendingPhotoUploads();

    for (const queuedUpload of pending) {
      try {
        const file = new File([queuedUpload.file], queuedUpload.fileName, {
          type: queuedUpload.file.type || "image/jpeg",
        });

        if (queuedUpload.type === "completion") {
          await uploadCompletionAsset({
            supabase,
            assignmentId: queuedUpload.assignmentId,
            jobId: queuedUpload.jobId,
            userId: user.id,
            file,
          });
        } else {
          await uploadIssueAsset({
            supabase,
            jobId: queuedUpload.jobId,
            userId: user.id,
            description: queuedUpload.description || "Issue reported from offline queue.",
            file,
          });
        }

        await removePendingPhotoUpload(queuedUpload.id);
        flushed += 1;
      } catch {
        // Keep queued for the next retry window.
      }
    }

    if (flushed > 0) {
      setStatusText(`Se sincronizaron ${flushed} carga(s) pendientes.`);
      await loadAssignments({ setLoading: false });
    }

    await refreshPendingCount();
  }, [loadAssignments, refreshPendingCount]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAssignments({ setLoading: false });
      void refreshPendingCount();
      void flushPendingUploads();
    }, 0);

    const onOnline = () => {
      void flushPendingUploads();
    };

    window.addEventListener("online", onOnline);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("online", onOnline);
    };
  }, [flushPendingUploads, loadAssignments, refreshPendingCount]);

  const queueUpload = async (upload: PendingPhotoUpload, successMessage: string) => {
    await enqueuePendingPhotoUpload(upload);
    setStatusText(successMessage);
    await refreshPendingCount();
  };

  const updateAssignmentStatus = async (assignmentId: string, nextStatus: string) => {
    setFormError(null);
    setStatusText(null);

    const patch: { status: string; started_at?: string; completed_at?: string } = { status: nextStatus };
    if (nextStatus === "in_progress") {
      patch.started_at = new Date().toISOString();
    }
    if (nextStatus === "complete") {
      patch.completed_at = new Date().toISOString();
    }

    const supabase = getSupabase();
    const { error } = await supabase.from("job_assignments").update(patch).eq("id", assignmentId);
    if (error) {
      setFormError(error.message);
      return;
    }

    setStatusText("Estado actualizado.");
    await loadAssignments();
  };

  const toggleChecklistItem = async (itemId: string, checked: boolean) => {
    setFormError(null);
    const supabase = getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("job_checklist_items")
      .update({
        is_completed: checked,
        completed_at: checked ? new Date().toISOString() : null,
        completed_by: checked ? user?.id ?? null : null,
      })
      .eq("id", itemId);

    if (error) {
      setFormError(error.message);
      return;
    }

    await loadAssignments({ setLoading: false });
  };

  const sendJobMessage = async (assignment: AssignmentRow) => {
    const messageText = messageByAssignment[assignment.id]?.trim();
    if (!messageText) {
      setFormError("Escribe un mensaje antes de enviar.");
      return;
    }

    const supabase = getSupabase();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setFormError(authError?.message ?? "No se pudo validar la sesión.");
      return;
    }

    const { error } = await supabase.from("job_messages").insert({
      job_id: assignment.job_id,
      sender_id: user.id,
      message_text: messageText,
      is_internal: false,
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    setMessageByAssignment((prev) => ({ ...prev, [assignment.id]: "" }));
    setStatusText("Mensaje enviado.");
    await loadAssignments({ setLoading: false });
  };

  const submitIssue = async (assignment: AssignmentRow) => {
    const supabase = getSupabase();
    const description = issueByAssignment[assignment.id]?.trim();
    const issueFile = issueFileByAssignment[assignment.id] ?? null;

    if (!description) {
      setFormError("Agrega una descripción del problema antes de enviar.");
      return;
    }

    if (issueFile) {
      try {
        validatePhoto(issueFile);
      } catch (error) {
        setFormError(error instanceof Error ? error.message : "Foto inválida.");
        return;
      }
    }

    setFormError(null);
    setStatusText(null);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setFormError(authError?.message ?? "No se pudo validar la sesión.");
      return;
    }

    try {
      await uploadIssueAsset({
        supabase,
        jobId: assignment.job_id,
        userId: user.id,
        description,
        file: issueFile,
      });

      setIssueByAssignment((prev) => ({ ...prev, [assignment.id]: "" }));
      setIssueFileByAssignment((prev) => ({ ...prev, [assignment.id]: null }));
      setStatusText("Problema enviado. La administración lo revisará.");
    } catch (error) {
      if (issueFile) {
        await queueUpload(
          {
            id: `${assignment.id}-${Date.now()}`,
            type: "issue",
            assignmentId: assignment.id,
            jobId: assignment.job_id,
            file: issueFile,
            fileName: issueFile.name,
            description,
            createdAt: new Date().toISOString(),
          },
          "Sin señal. El problema con foto quedó guardado para reintento automático.",
        );
        return;
      }

      setFormError(error instanceof Error ? error.message : "No se pudo enviar el problema.");
    }
  };

  const uploadCompletionPhoto = async (assignment: AssignmentRow) => {
    const completionFile = completionFileByAssignment[assignment.id] ?? null;

    if (!completionFile) {
      setFormError("Selecciona una foto de finalización antes de subir.");
      return;
    }

    try {
      validatePhoto(completionFile);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Foto inválida.");
      return;
    }

    setFormError(null);
    setStatusText(null);
    setUploadingCompletionFor(assignment.id);

    const supabase = getSupabase();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setFormError(authError?.message ?? "No se pudo validar la sesión.");
      setUploadingCompletionFor(null);
      return;
    }

    try {
      await uploadCompletionAsset({
        supabase,
        assignmentId: assignment.id,
        jobId: assignment.job_id,
        userId: user.id,
        file: completionFile,
      });

      setCompletionFileByAssignment((prev) => ({ ...prev, [assignment.id]: null }));
      setStatusText("Foto final subida con ubicación y compresión optimizada.");
      await loadAssignments({ setLoading: false });
    } catch {
      await queueUpload(
        {
          id: `${assignment.id}-${Date.now()}`,
          type: "completion",
          assignmentId: assignment.id,
          jobId: assignment.job_id,
          file: completionFile,
          fileName: completionFile.name,
          createdAt: new Date().toISOString(),
        },
        "Sin señal. La foto quedó guardada y se volverá a subir cuando regrese la conexión.",
      );
    } finally {
      setUploadingCompletionFor(null);
    }
  };

  return (
    <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Mis Trabajos</h2>
          {pendingUploadCount > 0 ? <p className="mt-1 text-xs text-amber-700">{pendingUploadCount} carga(s) pendiente(s) para reintento.</p> : null}
        </div>
        <button type="button" className="text-sm font-medium text-slate-700 underline" onClick={() => void loadAssignments()}>
          Actualizar
        </button>
      </div>

      {statusText ? <p className="mt-3 text-sm text-green-700">{statusText}</p> : null}
      {formError ? <p className="mt-3 text-sm text-red-600">{formError}</p> : null}

      {isLoading ? <p className="mt-4 text-sm text-slate-500">Cargando trabajos...</p> : null}

      <div className="mt-4 space-y-4">
        {assignments.map((assignment) => {
          const job = assignment.jobs?.[0] ?? null;
          return (
            <article key={assignment.id} className="rounded-md border border-slate-200 p-4">
              <h3 className="text-lg font-semibold text-slate-900">{job?.title ?? "Trabajo"}</h3>
              <p className="mt-1 text-sm text-slate-600">{job?.address}</p>
              <p className="mt-1 text-xs text-slate-500">
                {formatCleanType(job?.clean_type)} • {assignment.role === "lead" ? "Líder" : "Miembro"}
              </p>

              {job?.areas && job.areas.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.areas.map((area) => (
                    <span key={area} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                      {area}
                    </span>
                  ))}
                </div>
              ) : null}

              <p className="mt-3 text-sm text-slate-600">{job?.scope ?? "Sin notas adicionales."}</p>

              {job?.job_checklist_items && job.job_checklist_items.length > 0 ? (
                <div className="mt-3 rounded-md border border-slate-200 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Checklist</p>
                  <ul className="mt-2 space-y-2">
                    {job.job_checklist_items.map((item) => (
                      <li key={item.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item.is_completed}
                          onChange={(event) => void toggleChecklistItem(item.id, event.target.checked)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                        <span className="text-sm text-slate-700">{item.item_text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  Estado
                  <select
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    value={assignment.status}
                    onChange={(event) => void updateAssignmentStatus(assignment.id, event.target.value)}
                  >
                    {ASSIGNMENT_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Foto de problema (opcional)
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setIssueFileByAssignment((prev) => ({ ...prev, [assignment.id]: file }));
                    }}
                  />
                </label>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <label className="text-sm font-medium text-slate-700">
                  Foto de finalización
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setCompletionFileByAssignment((prev) => ({ ...prev, [assignment.id]: file }));
                    }}
                  />
                </label>

                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-70"
                  disabled={uploadingCompletionFor === assignment.id}
                  onClick={() => void uploadCompletionPhoto(assignment)}
                >
                  {uploadingCompletionFor === assignment.id ? "Subiendo..." : "Subir foto final"}
                </button>
              </div>

              <p className="mt-2 text-[11px] text-slate-500">JPG/PNG/WebP, máximo 10 MB. La app comprime la foto y guarda reintentos si falla la señal.</p>

              <label className="mt-3 block text-sm font-medium text-slate-700">
                Reportar problema (basura, pintura en superficies, retrabajo, etc.)
                <textarea
                  rows={2}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={issueByAssignment[assignment.id] ?? ""}
                  onChange={(event) => setIssueByAssignment((prev) => ({ ...prev, [assignment.id]: event.target.value }))}
                />
              </label>

              <button
                type="button"
                className="mt-3 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                onClick={() => void submitIssue(assignment)}
              >
                Enviar problema
              </button>

              <div className="mt-4 rounded-md border border-slate-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mensajes del trabajo</p>
                {job?.job_messages && job.job_messages.length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {job.job_messages.slice(0, 3).map((message) => (
                      <li key={message.id} className="rounded bg-slate-50 px-2 py-1 text-xs text-slate-600">
                        {message.message_text}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-slate-500">No hay mensajes todavía.</p>
                )}

                <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
                  <input
                    className="rounded-md border border-slate-300 px-2 py-1.5 text-xs"
                    placeholder="Mensaje para administración"
                    value={messageByAssignment[assignment.id] ?? ""}
                    onChange={(event) =>
                      setMessageByAssignment((prev) => ({
                        ...prev,
                        [assignment.id]: event.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => void sendJobMessage(assignment)}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {!isLoading && assignments.length === 0 ? <p className="text-sm text-slate-500">No hay trabajos asignados.</p> : null}
      </div>
    </section>
  );
}
