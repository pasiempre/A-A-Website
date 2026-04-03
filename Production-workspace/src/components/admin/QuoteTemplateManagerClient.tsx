"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type PricingModel = "flat" | "per_sqft" | "per_unit" | "per_hour";

type TemplateLineItem = {
  description: string;
  quantity: number;
  unit: "flat" | "unit" | "sqft" | "hour";
  unit_price: number;
};

type QuoteTemplateRow = {
  id: string;
  name: string;
  service_type: string;
  default_line_items: TemplateLineItem[];
  base_price: number;
  pricing_model: PricingModel;
  created_at: string;
};

type TemplateFormState = {
  id: string | null;
  name: string;
  serviceType: string;
  lineDescription: string;
  lineQuantity: string;
  lineUnit: "flat" | "unit" | "sqft" | "hour";
  lineUnitPrice: string;
  basePrice: string;
  pricingModel: PricingModel;
};

const INITIAL_FORM: TemplateFormState = {
  id: null,
  name: "",
  serviceType: "commercial_cleaning",
  lineDescription: "Cleaning scope",
  lineQuantity: "1",
  lineUnit: "flat",
  lineUnitPrice: "0",
  basePrice: "0",
  pricingModel: "flat",
};

function toFormState(template: QuoteTemplateRow): TemplateFormState {
  const line = template.default_line_items?.[0] ?? {
    description: "Cleaning scope",
    quantity: 1,
    unit: "flat",
    unit_price: Number(template.base_price || 0),
  };

  return {
    id: template.id,
    name: template.name,
    serviceType: template.service_type,
    lineDescription: line.description,
    lineQuantity: String(line.quantity),
    lineUnit: line.unit,
    lineUnitPrice: String(line.unit_price),
    basePrice: String(template.base_price),
    pricingModel: template.pricing_model,
  };
}

export function QuoteTemplateManagerClient() {
  const [templates, setTemplates] = useState<QuoteTemplateRow[]>([]);
  const [form, setForm] = useState<TemplateFormState>(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const estimatedTotal = useMemo(() => {
    const qty = Number.parseFloat(form.lineQuantity || "0");
    const unitPrice = Number.parseFloat(form.lineUnitPrice || "0");
    if (!Number.isFinite(qty) || !Number.isFinite(unitPrice)) return "0.00";
    return (qty * unitPrice).toFixed(2);
  }, [form.lineQuantity, form.lineUnitPrice]);

  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    setErrorText(null);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("quote_templates")
      .select("id, name, service_type, default_line_items, base_price, pricing_model, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorText(error.message);
      setIsLoading(false);
      return;
    }

    setTemplates((data as QuoteTemplateRow[] | null) ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTemplates();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadTemplates]);

  const clearForm = () => {
    setForm(INITIAL_FORM);
  };

  const saveTemplate = async () => {
    setErrorText(null);
    setStatusText(null);

    const quantity = Number.parseFloat(form.lineQuantity || "0");
    const unitPrice = Number.parseFloat(form.lineUnitPrice || "0");
    const basePrice = Number.parseFloat(form.basePrice || "0");

    if (!form.name.trim()) {
      setErrorText("Template name is required.");
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) {
      setErrorText("Line item quantity and unit price must be valid numbers.");
      return;
    }

    if (!Number.isFinite(basePrice) || basePrice < 0) {
      setErrorText("Base price must be a valid number.");
      return;
    }

    setIsSaving(true);

    const payload = {
      name: form.name.trim(),
      service_type: form.serviceType,
      pricing_model: form.pricingModel,
      base_price: basePrice,
      default_line_items: [
        {
          description: form.lineDescription.trim() || "Cleaning scope",
          quantity,
          unit: form.lineUnit,
          unit_price: unitPrice,
        },
      ],
      updated_at: new Date().toISOString(),
    };

    const supabase = createClient();

    const result = form.id
      ? await supabase.from("quote_templates").update(payload).eq("id", form.id)
      : await supabase.from("quote_templates").insert(payload);

    if (result.error) {
      setErrorText(result.error.message);
      setIsSaving(false);
      return;
    }

    setStatusText(form.id ? "Template updated." : "Template created.");
    setIsSaving(false);
    clearForm();
    await loadTemplates();
  };

  const deleteTemplate = async (id: string) => {
    setErrorText(null);
    setStatusText(null);

    const supabase = createClient();
    const { error } = await supabase.from("quote_templates").delete().eq("id", id);
    if (error) {
      setErrorText(error.message);
      return;
    }

    setStatusText("Template deleted.");
    if (form.id === id) {
      clearForm();
    }
    await loadTemplates();
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 md:text-xl">Quick Quote Templates</h2>
          <p className="mt-1 text-sm text-slate-600">
            Create templates by service type to prefill quote drafts and reduce manual re-entry.
          </p>
        </div>
        <button
          type="button"
          className="rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700"
          onClick={() => void loadTemplates()}
        >
          Refresh
        </button>
      </div>

      {statusText ? <p className="mt-3 text-sm text-emerald-700">{statusText}</p> : null}
      {errorText ? <p className="mt-3 text-sm text-rose-600">{errorText}</p> : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-md border border-slate-200 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            {form.id ? "Edit template" : "Create template"}
          </h3>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="text-xs text-slate-700 md:col-span-2">
              Template Name
              <input
                className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </label>

            <label className="text-xs text-slate-700">
              Service Type
              <select
                className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm"
                value={form.serviceType}
                onChange={(event) => setForm((prev) => ({ ...prev, serviceType: event.target.value }))}
              >
                <option value="post_construction_cleaning">post_construction_cleaning</option>
                <option value="commercial_cleaning">commercial_cleaning</option>
                <option value="move_in_move_out_cleaning">move_in_move_out_cleaning</option>
                <option value="windows_power_washing">windows_power_washing</option>
                <option value="final_clean">final_clean</option>
              </select>
            </label>

            <label className="text-xs text-slate-700">
              Pricing Model
              <select
                className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm"
                value={form.pricingModel}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, pricingModel: event.target.value as PricingModel }))
                }
              >
                <option value="flat">flat</option>
                <option value="per_sqft">per_sqft</option>
                <option value="per_unit">per_unit</option>
                <option value="per_hour">per_hour</option>
              </select>
            </label>

            <label className="text-xs text-slate-700 md:col-span-2">
              Line Description
              <input
                className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm"
                value={form.lineDescription}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, lineDescription: event.target.value }))
                }
              />
            </label>

            <label className="text-xs text-slate-700">
              Quantity
              <input
                className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm"
                value={form.lineQuantity}
                onChange={(event) => setForm((prev) => ({ ...prev, lineQuantity: event.target.value }))}
              />
            </label>

            <label className="text-xs text-slate-700">
              Unit
              <select
                className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm"
                value={form.lineUnit}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, lineUnit: event.target.value as TemplateFormState["lineUnit"] }))
                }
              >
                <option value="flat">flat</option>
                <option value="unit">unit</option>
                <option value="sqft">sqft</option>
                <option value="hour">hour</option>
              </select>
            </label>

            <label className="text-xs text-slate-700">
              Unit Price
              <input
                className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm"
                value={form.lineUnitPrice}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, lineUnitPrice: event.target.value }))
                }
              />
            </label>

            <label className="text-xs text-slate-700">
              Base Price
              <input
                className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm"
                value={form.basePrice}
                onChange={(event) => setForm((prev) => ({ ...prev, basePrice: event.target.value }))}
              />
            </label>
          </div>

          <p className="mt-3 text-xs text-slate-500">Estimated subtotal from line item: ${estimatedTotal}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => void saveTemplate()}
              className="rounded bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : form.id ? "Update Template" : "Create Template"}
            </button>
            {form.id ? (
              <button
                type="button"
                onClick={clearForm}
                className="rounded border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </div>

        <div className="rounded-md border border-slate-200 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Existing Templates</h3>
          {isLoading ? <p className="mt-3 text-xs text-slate-500">Loading templates...</p> : null}

          {!isLoading && templates.length === 0 ? (
            <p className="mt-3 text-xs text-slate-500">No templates yet. Create your first template.</p>
          ) : null}

          <div className="mt-3 space-y-2">
            {templates.map((template) => {
              const lineItem = template.default_line_items?.[0] ?? null;
              return (
                <article key={template.id} className="rounded border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-900">{template.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">
                    {template.service_type} • {template.pricing_model}
                  </p>
                  {lineItem ? (
                    <p className="mt-1 text-xs text-slate-600">
                      {lineItem.quantity} {lineItem.unit} x ${lineItem.unit_price.toFixed(2)}
                    </p>
                  ) : null}

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      className="rounded border border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                      onClick={() => setForm(toFormState(template))}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded border border-rose-300 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700"
                      onClick={() => void deleteTemplate(template.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
