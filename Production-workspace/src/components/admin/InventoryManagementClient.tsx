"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";

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

export function InventoryManagementClient() {
  const [supplies, setSupplies] = useState<SupplyRow[]>([]);
  const [requests, setRequests] = useState<SupplyRequestRow[]>([]);
  const [form, setForm] = useState(initialSupplyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const lowStockSupplies = useMemo(
    () => supplies.filter((supply) => Number(supply.current_stock) <= Number(supply.reorder_threshold) && supply.is_active),
    [supplies],
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorText(null);

    try {
      const supabase = createClient();
      const [suppliesResult, requestsResult] = await Promise.all([
        supabase.from("supplies").select("id, name, category, unit, current_stock, reorder_threshold, cost_per_unit, preferred_vendor, purchase_link, is_active").order("name", { ascending: true }).limit(300),
        supabase
          .from("supply_requests")
          .select("id, quantity_needed, site_address, urgency, status, notes, created_at, profiles:requested_by(full_name), supplies:supply_id(name)")
          .order("created_at", { ascending: false })
          .limit(200),
      ]);

      if (suppliesResult.error || requestsResult.error) {
        throw new Error(suppliesResult.error?.message || requestsResult.error?.message || "Unable to load inventory data.");
      }

      setSupplies((suppliesResult.data as SupplyRow[] | null) ?? []);
      setRequests((requestsResult.data as SupplyRequestRow[] | null) ?? []);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to load inventory module.");
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      setErrorText(error instanceof Error ? error.message : "Unable to create supply.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: SupplyRequestRow["status"]) => {
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
        .update({ status, reviewed_by: user?.id ?? null, reviewed_at: new Date().toISOString() })
        .eq("id", requestId);

      if (error) {
        throw new Error(error.message);
      }

      setStatusText(`Request marked as ${status}.`);
      await loadData();
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to update request status.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-lg font-semibold text-slate-900 md:text-xl">Inventory Management</h2>
      <p className="mb-4 text-sm text-slate-600">Track stock, low-inventory alerts, and crew supply requests.</p>

      {statusText ? <p className="mb-3 text-sm text-emerald-700">{statusText}</p> : null}
      {errorText ? <p className="mb-3 text-sm text-rose-600">{errorText}</p> : null}

      <div className="mb-6 grid gap-3 rounded border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">
        <input
          type="text"
          placeholder="Supply name"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={form.category}
          onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
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
          onChange={(event) => setForm((prev) => ({ ...prev, unit: event.target.value }))}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Current stock"
          value={form.currentStock}
          onChange={(event) => setForm((prev) => ({ ...prev, currentStock: event.target.value }))}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Reorder threshold"
          value={form.reorderThreshold}
          onChange={(event) => setForm((prev) => ({ ...prev, reorderThreshold: event.target.value }))}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Cost per unit"
          value={form.costPerUnit}
          onChange={(event) => setForm((prev) => ({ ...prev, costPerUnit: event.target.value }))}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Preferred vendor"
          value={form.preferredVendor}
          onChange={(event) => setForm((prev) => ({ ...prev, preferredVendor: event.target.value }))}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="url"
          placeholder="Purchase link"
          value={form.purchaseLink}
          onChange={(event) => setForm((prev) => ({ ...prev, purchaseLink: event.target.value }))}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => void createSupply()}
          disabled={isSaving}
          className="md:col-span-4 rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add Supply Item
        </button>
      </div>

      <div className="mb-6 overflow-hidden rounded border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">Low Stock Alerts</div>
        <table className="w-full text-left text-sm">
          <thead className="bg-white">
            <tr>
              <th className="border-b border-slate-200 px-3 py-2">Name</th>
              <th className="border-b border-slate-200 px-3 py-2">Category</th>
              <th className="border-b border-slate-200 px-3 py-2">Current</th>
              <th className="border-b border-slate-200 px-3 py-2">Threshold</th>
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
                <tr key={supply.id} className="odd:bg-white even:bg-slate-50">
                  <td className="px-3 py-2">{supply.name}</td>
                  <td className="px-3 py-2 capitalize">{supply.category}</td>
                  <td className="px-3 py-2">{Number(supply.current_stock).toFixed(2)}</td>
                  <td className="px-3 py-2">{Number(supply.reorder_threshold).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-hidden rounded border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">Supply Requests</div>
        <table className="w-full text-left text-sm">
          <thead className="bg-white">
            <tr>
              <th className="border-b border-slate-200 px-3 py-2">Requested By</th>
              <th className="border-b border-slate-200 px-3 py-2">Supply</th>
              <th className="border-b border-slate-200 px-3 py-2">Qty</th>
              <th className="border-b border-slate-200 px-3 py-2">Urgency</th>
              <th className="border-b border-slate-200 px-3 py-2">Status</th>
              <th className="border-b border-slate-200 px-3 py-2">Action</th>
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
                <tr key={request.id} className="odd:bg-white even:bg-slate-50">
                  <td className="px-3 py-2">{request.profiles?.[0]?.full_name || "Crew"}</td>
                  <td className="px-3 py-2">{request.supplies?.[0]?.name || "Unknown"}</td>
                  <td className="px-3 py-2">{Number(request.quantity_needed).toFixed(2)}</td>
                  <td className="px-3 py-2 capitalize">{request.urgency}</td>
                  <td className="px-3 py-2 capitalize">{request.status}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => void updateRequestStatus(request.id, "approved")}
                        className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => void updateRequestStatus(request.id, "delivered")}
                        className="rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800"
                      >
                        Delivered
                      </button>
                      <button
                        type="button"
                        onClick={() => void updateRequestStatus(request.id, "rejected")}
                        className="rounded bg-rose-100 px-2 py-1 text-xs font-medium text-rose-800"
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
    </section>
  );
}