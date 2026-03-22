"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Pagination } from "@/components/admin/Pagination";
import { createClient } from "@/lib/supabase/client";

const PAGE_SIZE = 25;

type SupplyRow = {
  id: string;
  name: string;
  category: "chemical" | "tool" | "consumable";
  unit: string;
  current_stock: number;
  reorder_threshold: number;
  cost_per_unit: number;
  preferred_vendor: string | null;
  purchase_link: string | null;
  is_active: boolean;
};

type SupplyRequestRow = {
  id: string;
  quantity_needed: number;
  site_address: string | null;
  urgency: "normal" | "urgent";
  status: "requested" | "approved" | "delivered" | "rejected";
  notes: string | null;
  created_at: string;
  profiles: { full_name: string | null }[] | null;
  supplies: { name: string }[] | null;
};

const initialSupplyForm = {
  name: "",
  category: "consumable",
  unit: "each",
  currentStock: "0",
  reorderThreshold: "0",
  costPerUnit: "0",
  preferredVendor: "",
  purchaseLink: "",
};

function requestStatusColor(status: string): string {
  switch (status) {
    case "requested":
      return "bg-blue-100 text-blue-800";
    case "approved":
      return "bg-green-100 text-green-800";
    case "delivered":
      return "bg-emerald-100 text-emerald-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function urgencyColor(urgency: string): string {
  return urgency === "urgent"
    ? "bg-red-100 text-red-800"
    : "bg-slate-100 text-slate-600";
}

export function InventoryManagementClient() {
  const [supplies, setSupplies] = useState<SupplyRow[]>([]);
  const [requests, setRequests] = useState<SupplyRequestRow[]>([]);
  const [requestsTotalCount, setRequestsTotalCount] = useState(0);
  const [requestsPage, setRequestsPage] = useState(0);
  const [form, setForm] = useState(initialSupplyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const lowStockSupplies = useMemo(
    () =>
      supplies.filter(
        (supply) =>
          Number(supply.current_stock) <= Number(supply.reorder_threshold) &&
          supply.is_active,
      ),
    [supplies],
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorText(null);

    try {
      const supabase = createClient();
      const [suppliesResult, requestsResult] = await Promise.all([
        supabase
          .from("supplies")
          .select(
            "id, name, category, unit, current_stock, reorder_threshold, cost_per_unit, preferred_vendor, purchase_link, is_active",
          )
          .order("name", { ascending: true })
          .limit(300),
        supabase
          .from("supply_requests")
          .select(
            "id, quantity_needed, site_address, urgency, status, notes, created_at, profiles:requested_by(full_name), supplies:supply_id(name)",
            { count: "exact" },
          )
          .order("created_at", { ascending: false })
          .range(
            requestsPage * PAGE_SIZE,
            (requestsPage + 1) * PAGE_SIZE - 1,
          ),
      ]);

      if (suppliesResult.error || requestsResult.error) {
        throw new Error(
          suppliesResult.error?.message ||
            requestsResult.error?.message ||
            "Unable to load inventory data.",
        );
      }

      setSupplies((suppliesResult.data as SupplyRow[] | null) ?? []);
      setRequests((requestsResult.data as SupplyRequestRow[] | null) ?? []);
      setRequestsTotalCount(requestsResult.count ?? 0);
    } catch (error) {
      setErrorText(
        error instanceof Error
          ? error.message
          : "Unable to load inventory module.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [requestsPage]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const createSupply = async () => {
    if (!form.name.trim()) {
      setErrorText("Supply name is required.");
      return;
    }

    setIsSaving(true);
    setStatusText(null);
    setErrorText(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("supplies").insert({
        name: form.name.trim(),
        category: form.category,
        unit: form.unit.trim(),
        current_stock: Number(form.currentStock),
        reorder_threshold: Number(form.reorderThreshold),
        cost_per_unit: Number(form.costPerUnit),
        preferred_vendor: form.preferredVendor.trim() || null,
        purchase_link: form.purchaseLink.trim() || null,
        created_by: user?.id ?? null,
      });

      if (error) {
        throw new Error(error.message);
      }

      setForm(initialSupplyForm);
      setStatusText("Supply item created.");
      await loadData();
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Unable to create supply.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const updateRequestStatus = async (
    requestId: string,
    status: SupplyRequestRow["status"],
  ) => {
    setIsSaving(true);
    setStatusText(null);
    setErrorText(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("supply_requests")
        .update({
          status,
          reviewed_by: user?.id ?? null,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (error) {
        throw new Error(error.message);
      }

      setStatusText(`Request marked as ${status}.`);
      await loadData();
    } catch (error) {
      setErrorText(
        error instanceof Error
          ? error.message
          : "Unable to update request status.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-lg font-semibold text-slate-900 md:text-xl">
        Inventory Management
      </h2>
      <p className="mb-4 text-sm text-slate-600">
        Track stock, low-inventory alerts, and crew supply requests.
      </p>

      {statusText ? (
        <p className="mb-3 text-sm text-emerald-700">{statusText}</p>
      ) : null}
      {errorText ? (
        <p className="mb-3 text-sm text-rose-600">{errorText}</p>
      ) : null}

      {/* ── Add Supply Form ── */}
      <div className="mb-6 grid gap-3 rounded border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">
        <input
          type="text"
          placeholder="Supply name"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={form.category}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, category: e.target.value }))
          }
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="chemical">Chemical</option>
          <option value="tool">Tool</option>
          <option value="consumable">Consumable</option>
        </select>
        <input
          type="text"
          placeholder="Unit (bottle, roll, each)"
          value={form.unit}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, unit: e.target.value }))
          }
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Current stock"
          value={form.currentStock}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, currentStock: e.target.value }))
          }
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Reorder threshold"
          value={form.reorderThreshold}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              reorderThreshold: e.target.value,
            }))
          }
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Cost per unit"
          value={form.costPerUnit}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, costPerUnit: e.target.value }))
          }
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Preferred vendor"
          value={form.preferredVendor}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              preferredVendor: e.target.value,
            }))
          }
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="url"
          placeholder="Purchase link"
          value={form.purchaseLink}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, purchaseLink: e.target.value }))
          }
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => void createSupply()}
          disabled={isSaving}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 md:col-span-4"
        >
          Add Supply Item
        </button>
      </div>

      {/* ── Low Stock Alerts ── */}
      <div className="mb-6 overflow-hidden rounded border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
          Low Stock Alerts
          {lowStockSupplies.length > 0 && (
            <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
              {lowStockSupplies.length}
            </span>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white">
              <tr>
                <th className="border-b border-slate-200 px-3 py-2">Name</th>
                <th className="border-b border-slate-200 px-3 py-2">
                  Category
                </th>
                <th className="border-b border-slate-200 px-3 py-2">
                  Current
                </th>
                <th className="border-b border-slate-200 px-3 py-2">
                  Threshold
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={4}>
                    Loading inventory...
                  </td>
                </tr>
              ) : lowStockSupplies.length === 0 ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={4}>
                    No low-stock alerts right now.
                  </td>
                </tr>
              ) : (
                lowStockSupplies.map((supply) => (
                  <tr
                    key={supply.id}
                    className="odd:bg-white even:bg-slate-50"
                  >
                    <td className="px-3 py-2 font-medium text-slate-900">
                      {supply.name}
                    </td>
                    <td className="px-3 py-2 capitalize">{supply.category}</td>
                    <td className="px-3 py-2">
                      {Number(supply.current_stock).toFixed(2)}
                    </td>
                    <td className="px-3 py-2">
                      {Number(supply.reorder_threshold).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-2 p-3 md:hidden">
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading inventory...</p>
          ) : lowStockSupplies.length === 0 ? (
            <p className="text-sm text-slate-500">
              No low-stock alerts right now.
            </p>
          ) : (
            lowStockSupplies.map((supply) => (
              <div
                key={supply.id}
                className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {supply.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 capitalize">
                    {supply.category} ·{" "}
                    {Number(supply.current_stock).toFixed(1)} /{" "}
                    {Number(supply.reorder_threshold).toFixed(1)}
                  </p>
                </div>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                  Low
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Supply Requests ── */}
      <div className="overflow-hidden rounded border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
          <span className="text-sm font-medium text-slate-700">
            Supply Requests
          </span>
          <span className="text-xs text-slate-500">
            {requestsTotalCount} total
          </span>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white">
              <tr>
                <th className="border-b border-slate-200 px-3 py-2">
                  Requested By
                </th>
                <th className="border-b border-slate-200 px-3 py-2">
                  Supply
                </th>
                <th className="border-b border-slate-200 px-3 py-2">Qty</th>
                <th className="border-b border-slate-200 px-3 py-2">
                  Urgency
                </th>
                <th className="border-b border-slate-200 px-3 py-2">
                  Status
                </th>
                <th className="border-b border-slate-200 px-3 py-2">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={6}>
                    No supply requests yet.
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr
                    key={request.id}
                    className="odd:bg-white even:bg-slate-50"
                  >
                    <td className="px-3 py-2">
                      {request.profiles?.[0]?.full_name || "Crew"}
                    </td>
                    <td className="px-3 py-2">
                      {request.supplies?.[0]?.name || "Unknown"}
                    </td>
                    <td className="px-3 py-2">
                      {Number(request.quantity_needed).toFixed(2)}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${urgencyColor(request.urgency)}`}
                      >
                        {request.urgency}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${requestStatusColor(request.status)}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() =>
                            void updateRequestStatus(request.id, "approved")
                          }
                          className="min-h-[36px] rounded bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800 hover:bg-blue-200 disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() =>
                            void updateRequestStatus(request.id, "delivered")
                          }
                          className="min-h-[36px] rounded bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-200 disabled:opacity-60"
                        >
                          Delivered
                        </button>
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() =>
                            void updateRequestStatus(request.id, "rejected")
                          }
                          className="min-h-[36px] rounded bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-800 hover:bg-rose-200 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-2 p-3 md:hidden">
          {requests.length === 0 ? (
            <p className="text-sm text-slate-500">No supply requests yet.</p>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="rounded-md border border-slate-200 bg-white p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {request.supplies?.[0]?.name || "Unknown"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {request.profiles?.[0]?.full_name || "Crew"} ·{" "}
                      Qty {Number(request.quantity_needed).toFixed(1)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${requestStatusColor(request.status)}`}
                    >
                      {request.status}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${urgencyColor(request.urgency)}`}
                    >
                      {request.urgency}
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() =>
                      void updateRequestStatus(request.id, "approved")
                    }
                    className="min-h-[40px] flex-1 rounded bg-blue-100 px-3 py-2 text-xs font-medium text-blue-800 active:bg-blue-200 disabled:opacity-60"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() =>
                      void updateRequestStatus(request.id, "delivered")
                    }
                    className="min-h-[40px] flex-1 rounded bg-emerald-100 px-3 py-2 text-xs font-medium text-emerald-800 active:bg-emerald-200 disabled:opacity-60"
                  >
                    Delivered
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() =>
                      void updateRequestStatus(request.id, "rejected")
                    }
                    className="min-h-[40px] flex-1 rounded bg-rose-100 px-3 py-2 text-xs font-medium text-rose-800 active:bg-rose-200 disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Requests Pagination ── */}
      <div className="mt-4">
        <Pagination
          page={requestsPage}
          pageSize={PAGE_SIZE}
          totalCount={requestsTotalCount}
          onPageChange={setRequestsPage}
        />
      </div>
    </section>
  );
}
