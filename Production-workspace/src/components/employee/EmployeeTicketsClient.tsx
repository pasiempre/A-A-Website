"use client";

import { useCallback, useEffect, useState } from "react";

import { EmployeeAssignmentCard } from "@/components/employee/EmployeeAssignmentCard";
import { EmployeeChecklistView } from "@/components/employee/EmployeeChecklistView";
import { EmployeeIssueReport } from "@/components/employee/EmployeeIssueReport";
import { EmployeeMessageThread } from "@/components/employee/EmployeeMessageThread";
import { EmployeePhotoUpload } from "@/components/employee/EmployeePhotoUpload";
import { PhotoInventoryModal } from "@/components/employee/PhotoInventoryModal";
import {
  compressPhoto,
  getCurrentPosition,
  validatePhoto,
} from "@/lib/client-photo";
import {
  enqueuePendingPhotoUpload,
  listPendingPhotoUploads,
  removePendingPhotoUpload,
  type PendingPhotoUpload,
} from "@/lib/photo-upload-queue";
import { createClient } from "@/lib/supabase/client";

type AssignmentRow = {
  id: string;
  job_id: string;
  employee_id: string;
  role: string;
  status: string;
  jobs:
    | {
        title: string;
        address: string;
        clean_type: string;
        scope: string | null;
        areas: string[] | null;
        priority: string;
        job_checklist_items:
          | { id: string; item_text: string; is_completed: boolean }[]
          | null;
        job_messages:
          | { id: string; message_text: string; created_at: string }[]
          | null;
      }[]
    | null;
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
  const baseName =
    options.file.name.replace(/\.[^.]+$/, "").replace(/\s+/g, "-") ||
    "completion-photo";
  const filePath = `completion/${options.jobId}/${Date.now()}-${baseName}.jpg`;

  const { error: uploadError } = await options.supabase.storage
    .from("job-photos")
    .upload(filePath, blob, {
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
  if (uploadError) throw new Error(uploadError.message);

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
  if (insertError) throw new Error(insertError.message);

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
    const baseName =
      options.file.name.replace(/\.[^.]+$/, "").replace(/\s+/g, "-") ||
      "issue-photo";
    photoPath = `issue-reports/${options.jobId}/${Date.now()}-${baseName}.jpg`;

    const { error: uploadError } = await options.supabase.storage
      .from("job-photos")
      .upload(photoPath, blob, {
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
    if (uploadError) throw new Error(uploadError.message);
  }

  const { error: issueError } = await options.supabase.from("issue_reports").insert({
    job_id: options.jobId,
    reported_by: options.userId,
    description: options.description,
    photo_path: photoPath,
  });
  if (issueError) throw new Error(issueError.message);
}

export function EmployeeTicketsClient() {
  const getSupabase = () => createClient();

  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const [completionFileByAssignment, setCompletionFileByAssignment] = useState<
    Record<string, File | null>
  >({});
  const [uploadingCompletionFor, setUploadingCompletionFor] = useState<string | null>(
    null,
  );
  const [issueByAssignment, setIssueByAssignment] = useState<Record<string, string>>({});
  const [issueFileByAssignment, setIssueFileByAssignment] = useState<
    Record<string, File | null>
  >({});
  const [messageByAssignment, setMessageByAssignment] = useState<Record<string, string>>({});

  const [pendingUploadCount, setPendingUploadCount] = useState(0);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

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
    if (options?.setLoading !== false) setIsLoading(true);
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
    if (userError || !user) return;

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

    const onOnline = () => void flushPendingUploads();
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

    const patch: { status: string; started_at?: string; completed_at?: string } = {
      status: nextStatus,
    };
    if (nextStatus === "in_progress") patch.started_at = new Date().toISOString();
    if (nextStatus === "complete") patch.completed_at = new Date().toISOString();

    const { error } = await getSupabase().from("job_assignments").update(patch).eq("id", assignmentId);

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
    const text = messageByAssignment[assignment.id]?.trim();
    if (!text) {
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
      message_text: text,
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
    const description = issueByAssignment[assignment.id]?.trim();
    const issueFile = issueFileByAssignment[assignment.id] ?? null;

    if (!description) {
      setFormError("Agrega una descripción del problema antes de enviar.");
      return;
    }

    if (issueFile) {
      try {
        validatePhoto(issueFile);
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Foto inválida.");
        return;
      }
    }

    setFormError(null);
    setStatusText(null);

    const supabase = getSupabase();
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
    } catch (err) {
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
      setFormError(err instanceof Error ? err.message : "No se pudo enviar el problema.");
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
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Foto inválida.");
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
    <>
      <PhotoInventoryModal
        open={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        onFlush={() => void flushPendingUploads()}
      />

      <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
              Mis Trabajos
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {assignments.length} asignación{assignments.length !== 1 ? "es" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pendingUploadCount > 0 && (
              <button
                type="button"
                onClick={() => setPhotoModalOpen(true)}
                className="relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-amber-200 bg-amber-50 px-3 text-sm font-medium text-amber-800 hover:bg-amber-100"
                aria-label={`${pendingUploadCount} fotos pendientes`}
              >
                📸
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-bold text-white">
                  {pendingUploadCount}
                </span>
              </button>
            )}
            <button
              type="button"
              className="min-h-[44px] rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100"
              onClick={() => void loadAssignments()}
            >
              Actualizar
            </button>
          </div>
        </div>

        {statusText && (
          <div className="border-b border-green-100 bg-green-50 px-4 py-2.5 text-sm text-green-800 sm:px-5">
            {statusText}
          </div>
        )}
        {formError && (
          <div className="border-b border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-800 sm:px-5">
            {formError}
          </div>
        )}

        {isLoading && (
          <div className="px-4 py-10 text-center text-sm text-slate-500">Cargando trabajos...</div>
        )}

        <div className="divide-y divide-slate-100">
          {assignments.map((assignment) => {
            const job = assignment.jobs?.[0] ?? null;
            const checklistItems = job?.job_checklist_items ?? [];
            const completedItems = checklistItems.filter((i) => i.is_completed).length;
            const messages = job?.job_messages ?? [];
            const expanded = expandedCard === assignment.id;

            return (
              <EmployeeAssignmentCard
                key={assignment.id}
                assignmentId={assignment.id}
                title={job?.title ?? "Trabajo"}
                address={job?.address ?? ""}
                cleanType={job?.clean_type ?? ""}
                priority={job?.priority ?? "normal"}
                status={assignment.status}
                role={assignment.role}
                areas={job?.areas ?? null}
                scope={job?.scope ?? null}
                checklistTotal={checklistItems.length}
                checklistCompleted={completedItems}
                expanded={expanded}
                onToggleExpand={() =>
                  setExpandedCard((prev) => (prev === assignment.id ? null : assignment.id))
                }
                onStatusChange={(next) => void updateAssignmentStatus(assignment.id, next)}
              >
                <EmployeeChecklistView
                  items={checklistItems}
                  onToggle={(itemId, checked) => void toggleChecklistItem(itemId, checked)}
                />

                <EmployeePhotoUpload
                  file={completionFileByAssignment[assignment.id] ?? null}
                  onFileChange={(file) =>
                    setCompletionFileByAssignment((prev) => ({
                      ...prev,
                      [assignment.id]: file,
                    }))
                  }
                  onUpload={() => void uploadCompletionPhoto(assignment)}
                  isUploading={uploadingCompletionFor === assignment.id}
                />

                <EmployeeIssueReport
                  description={issueByAssignment[assignment.id] ?? ""}
                  onDescriptionChange={(val) =>
                    setIssueByAssignment((prev) => ({
                      ...prev,
                      [assignment.id]: val,
                    }))
                  }
                  file={issueFileByAssignment[assignment.id] ?? null}
                  onFileChange={(file) =>
                    setIssueFileByAssignment((prev) => ({
                      ...prev,
                      [assignment.id]: file,
                    }))
                  }
                  onSubmit={() => void submitIssue(assignment)}
                />

                <EmployeeMessageThread
                  messages={messages}
                  messageText={messageByAssignment[assignment.id] ?? ""}
                  onMessageTextChange={(val) =>
                    setMessageByAssignment((prev) => ({
                      ...prev,
                      [assignment.id]: val,
                    }))
                  }
                  onSend={() => void sendJobMessage(assignment)}
                />
              </EmployeeAssignmentCard>
            );
          })}

          {!isLoading && assignments.length === 0 && (
            <div className="px-4 py-10 text-center">
              <p className="text-2xl">📋</p>
              <p className="mt-2 text-sm text-slate-500">No hay trabajos asignados.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}