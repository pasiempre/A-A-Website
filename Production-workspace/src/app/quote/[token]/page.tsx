import { notFound } from "next/navigation";

import { QuoteResponseClient } from "./QuoteResponseClient";
import { COMPANY_EMAIL, COMPANY_NAME, COMPANY_PHONE } from "@/lib/company";
import { createAdminClient } from "@/lib/supabase/admin";

type QuotePageProps = {
  params: Promise<{ token: string }>;
};

export default async function QuotePage({ params }: QuotePageProps) {
  const { token } = await params;
  const supabase = createAdminClient();

  const { data: quote, error } = await supabase
    .from("quotes")
    .select(
      "id, quote_number, status, subtotal, tax_amount, total, valid_until, site_address, scope_description, notes, viewed_at, created_at, leads(name, company_name, email, phone), quote_line_items(description, quantity, unit, unit_price, line_total, sort_order)",
    )
    .eq("public_token", token)
    .single();

  if (error || !quote) {
    notFound();
  }

  if (!quote.viewed_at) {
    await supabase.from("quotes").update({ viewed_at: new Date().toISOString() }).eq("id", quote.id);
  }

  const lead = quote.leads?.[0] ?? null;
  const lineItems = [...(quote.quote_line_items ?? [])].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.3fr_0.9fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{COMPANY_NAME}</p>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Quote {quote.quote_number}</h1>
              <p className="mt-2 text-sm text-slate-600">
                Prepared for {lead?.company_name || lead?.name || "Client"} on {new Date(quote.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Total</p>
              <p className="mt-1 text-3xl font-semibold text-slate-900">${Number(quote.total).toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 border-y border-slate-200 py-5 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Client</p>
              <p className="mt-1 text-sm text-slate-700">{lead?.name || "Not provided"}</p>
              <p className="text-sm text-slate-700">{lead?.company_name || "Not provided"}</p>
              <p className="text-sm text-slate-700">{lead?.email || "No email on file"}</p>
              <p className="text-sm text-slate-700">{lead?.phone || "No phone on file"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Project</p>
              <p className="mt-1 text-sm text-slate-700">{quote.site_address || "Address to be confirmed"}</p>
              <p className="text-sm text-slate-700">
                Valid until {quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : "open"}
              </p>
              <p className="text-sm text-slate-700">Questions: {COMPANY_PHONE}</p>
            </div>
          </div>

          {quote.scope_description ? (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-slate-900">Scope</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{quote.scope_description}</p>
            </div>
          ) : null}

          <div className="mt-8 overflow-hidden rounded border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-700">Description</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Qty</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Unit Price</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={`${item.description}-${item.sort_order}`} className="border-t border-slate-200">
                    <td className="px-4 py-3 text-slate-700">{item.description}</td>
                    <td className="px-4 py-3 text-slate-700">{Number(item.quantity).toFixed(2)} {item.unit}</td>
                    <td className="px-4 py-3 text-slate-700">${Number(item.unit_price).toFixed(2)}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">${Number(item.line_total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 ml-auto max-w-sm space-y-2 rounded border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>Subtotal</span>
              <span>${Number(quote.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>Tax</span>
              <span>${Number(quote.tax_amount).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
              <span>Total</span>
              <span>${Number(quote.total).toFixed(2)}</span>
            </div>
          </div>

          {quote.notes ? (
            <div className="mt-6 rounded border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Notes</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{quote.notes}</p>
            </div>
          ) : null}
        </section>

        <div className="space-y-6">
          <QuoteResponseClient token={token} initialStatus={quote.status} />
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Need to talk first?</h2>
            <p className="mt-2 text-sm text-slate-600">Call or email A&A Cleaning and we can confirm timing, scope, and scheduling.</p>
            <p className="mt-4 text-sm text-slate-700">{COMPANY_PHONE}</p>
            <p className="text-sm text-slate-700">{COMPANY_EMAIL}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
