"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { listPendingPhotoUploads } from "@/lib/photo-upload-queue";

type Supply = {
  id: string;
  name: string;
  unit: string;
  current_stock: number;
  reorder_threshold: number;
};

type Assignment = {
  id: string;
  job_id: string;
  jobs: { title: string }[] | null;
};

const initialUsageForm = {
  supplyId: "",
  assignmentId: "",
  quantity: "1",
  notes: "",
};

const initialRequestForm = {
  supplyId: "",
  quantityNeeded: "1",
  urgency: "normal",
  siteAddress: "",
  notes: "",
};

export function EmployeeInventoryClient() {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [usageForm, setUsageForm] = useState(initialUsageForm);
  const [requestForm, setRequestForm] = useState(initialRequestForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [pendingPhotoUploads, setPendingPhotoUploads] = useState(0);

  const lowStockSupplies = useMemo(
    () => supplies.filter((supply) => Number(supply.current_stock) <= Number(supply.reorder_threshold)),
    [supplies],
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorText(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error(authError?.message ?? "No se pudo validar la sesión.");
      }

      const [suppliesResult, assignmentsResult] = await Promise.all([
        supabase
          .from("supplies")
          .select("id, name, unit, current_stock, reorder_threshold")
          .eq("is_active", true)
          .order("name", { ascending: true })
          .limit(150),
        supabase
          .from("job_assignments")
          .select("id, job_id, jobs(title)")
          .eq("employee_id", user.id)
          .order("assigned_at", { ascending: false })
          .limit(100),
      ]);

      if (suppliesResult.error || assignmentsResult.error) {
        throw new Error(suppliesResult.error?.message || assignmentsResult.error?.message || "No se pudo cargar inventario.");
      }

      const nextSupplies = (suppliesResult.data as Supply[] | null) ?? [];
      const nextAssignments = (assignmentsResult.data as Assignment[] | null) ?? [];

      setSupplies(nextSupplies);
      setAssignments(nextAssignments);

      if (!usageForm.supplyId && nextSupplies[0]) {
        setUsageForm((prev) => ({ ...prev, supplyId: nextSupplies[0].id }));
      }
      if (!requestForm.supplyId && nextSupplies[0]) {
        setRequestForm((prev) => ({ ...prev, supplyId: nextSupplies[0].id }));
      }
      if (!usageForm.assignmentId && nextAssignments[0]) {
        setUsageForm((prev) => ({ ...prev, assignmentId: nextAssignments[0].id }));
      }

      const pending = await listPendingPhotoUploads().catch(() => []);
      setPendingPhotoUploads(pending.length);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "No se pudo cargar inventario.");
    } finally {
      setIsLoading(false);
    }
  }, [requestForm.supplyId, usageForm.assignmentId, usageForm.supplyId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const submitUsage = async () => {
    if (!usageForm.supplyId || !usageForm.assignmentId || Number(usageForm.quantity) <= 0) {
      setErrorText("Selecciona trabajo, suministro, y cantidad válida.");
      return;
    }

    setIsSaving(true);
    setStatusText(null);
    setErrorText(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error(authError?.message ?? "No se pudo validar la sesión.");
      }

      const assignment = assignments.find((item) => item.id === usageForm.assignmentId);
      if (!assignment) {
        throw new Error("Trabajo no encontrado.");
      }

      const { error: insertError } = await supabase.from("supply_usage_logs").insert({
        job_id: assignment.job_id,
        supply_id: usageForm.supplyId,
        quantity_used: Number(usageForm.quantity),
        logged_by: user.id,
        notes: usageForm.notes.trim() || null,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setStatusText("Uso de suministro registrado.");
      setUsageForm((prev) => ({ ...prev, quantity: "1", notes: "" }));
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "No se pudo guardar uso de suministro.");
    } finally {
      setIsSaving(false);
    }
  };

  const submitRequest = async () => {
    if (!requestForm.supplyId || Number(requestForm.quantityNeeded) <= 0) {
      setErrorText("Selecciona suministro y cantidad válida.");
      return;
    }

    setIsSaving(true);
    setStatusText(null);
    setErrorText(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error(authError?.message ?? "No se pudo validar la sesión.");
      }

      const { error: requestError } = await supabase.from("supply_requests").insert({
        requested_by: user.id,
        supply_id: requestForm.supplyId,
        quantity_needed: Number(requestForm.quantityNeeded),
        urgency: requestForm.urgency,
        site_address: requestForm.siteAddress.trim() || null,
        notes: requestForm.notes.trim() || null,
      });

      if (requestError) {
        throw new Error(requestError.message);
      }

      setStatusText("Solicitud de suministro enviada.");
      setRequestForm((prev) => ({ ...prev, quantityNeeded: "1", notes: "", siteAddress: "" }));
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "No se pudo enviar solicitud.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Suministros</h2>
          <p className="text-sm text-slate-600">Registrar consumo y solicitar inventario cuando haga falta.</p>
        </div>
        <button type="button" onClick={() => void loadData()} className="text-sm font-medium text-slate-700 underline">
          Actualizar
        </button>
      </div>

      {statusText ? <p className="mb-3 text-sm text-emerald-700">{statusText}</p> : null}
      {errorText ? <p className="mb-3 text-sm text-rose-600">{errorText}</p> : null}

      <div className="mb-4 rounded border border-sky-200 bg-sky-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">Carga de fotos</p>
        <p className="mt-1 text-xs text-sky-700">
          {pendingPhotoUploads > 0
            ? `${pendingPhotoUploads} foto(s) pendientes en cola offline. Se sincronizan automáticamente al recuperar conexión.`
            : "Sin fotos pendientes en cola offline."}
        </p>
      </div>

      <div className="mb-5 rounded border border-amber-200 bg-amber-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Alertas de stock bajo</p>
        {isLoading ? (
          <p className="mt-1 text-xs text-amber-700">Cargando...</p>
        ) : lowStockSupplies.length === 0 ? (
          <p className="mt-1 text-xs text-amber-700">Sin alertas de stock bajo.</p>
        ) : (
          <ul className="mt-1 space-y-1 text-xs text-amber-800">
            {lowStockSupplies.map((supply) => (
              <li key={supply.id}>
                {supply.name}: {Number(supply.current_stock).toFixed(2)} {supply.unit} (mínimo {Number(supply.reorder_threshold).toFixed(2)})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Registrar uso</h3>
          <div className="mt-3 space-y-2">
            <select
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              value={usageForm.assignmentId}
              onChange={(event) => setUsageForm((prev) => ({ ...prev, assignmentId: event.target.value }))}
            >
              <option value="">Selecciona trabajo</option>
              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.jobs?.[0]?.title || "Trabajo"}
                </option>
              ))}
            </select>
            <select
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              value={usageForm.supplyId}
              onChange={(event) => setUsageForm((prev) => ({ ...prev, supplyId: event.target.value }))}
            >
              <option value="">Selecciona suministro</option>
              {supplies.map((supply) => (
                <option key={supply.id} value={supply.id}>
                  {supply.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              value={usageForm.quantity}
              onChange={(event) => setUsageForm((prev) => ({ ...prev, quantity: event.target.value }))}
            />
            <input
              type="text"
              placeholder="Notas (opcional)"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              value={usageForm.notes}
              onChange={(event) => setUsageForm((prev) => ({ ...prev, notes: event.target.value }))}
            />
            <button
              type="button"
              onClick={() => void submitUsage()}
              disabled={isSaving}
              className="w-full rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Guardar uso
            </button>
          </div>
        </article>

        <article className="rounded border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Solicitar suministro</h3>
          <div className="mt-3 space-y-2">
            <select
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              value={requestForm.supplyId}
              onChange={(event) => setRequestForm((prev) => ({ ...prev, supplyId: event.target.value }))}
            >
              <option value="">Selecciona suministro</option>
              {supplies.map((supply) => (
                <option key={supply.id} value={supply.id}>
                  {supply.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              value={requestForm.quantityNeeded}
              onChange={(event) => setRequestForm((prev) => ({ ...prev, quantityNeeded: event.target.value }))}
            />
            <select
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              value={requestForm.urgency}
              onChange={(event) => setRequestForm((prev) => ({ ...prev, urgency: event.target.value }))}
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgente</option>
            </select>
            <input
              type="text"
              placeholder="Dirección del sitio (opcional)"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              value={requestForm.siteAddress}
              onChange={(event) => setRequestForm((prev) => ({ ...prev, siteAddress: event.target.value }))}
            />
            <input
              type="text"
              placeholder="Notas (opcional)"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              value={requestForm.notes}
              onChange={(event) => setRequestForm((prev) => ({ ...prev, notes: event.target.value }))}
            />
            <button
              type="button"
              onClick={() => void submitRequest()}
              disabled={isSaving}
              className="w-full rounded bg-[#1D4ED8] px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Enviar solicitud
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}