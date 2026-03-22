import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { authorizeAdmin } from "@/lib/auth";
import { buildQuoteEmailHtml } from "@/lib/quote-email";
import { buildQuotePdf } from "@/lib/quote-pdf";
import { sendEmailResilient } from "@/lib/resilient-email";
import { getSiteUrl } from "@/lib/site";
import {
  guardIdempotency,
  commitIdempotency,
  idempotencyKey,
} from "@/lib/idempotency";
import { createAdminClient } from "@/lib/supabase/admin";

type QuoteSendBody = {
  leadId?: string;
  siteAddress?: string;
  scopeDescription?: string;
  lineDescription?: string;
  quantity?: number;
  unit?: "flat" | "unit" | "sqft" | "hour";
  unitPrice?: number;
  taxAmount?: number;
  validUntil?: string;
  notes?: string;
};

function nextQuoteNumber() {
  const year = new Date().getFullYear();
  return `Q-${year}-${`${Date.now()}`.slice(-6)}`;
}

export async function POST(request: Request) {
  const auth = await authorizeAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: QuoteSendBody;
  try {
    body = (await request.json()) as QuoteSendBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const leadId = body.leadId?.trim();
  if (!leadId) {
    return NextResponse.json({ error: "leadId is required." }, { status: 400 });
  }

  const quantity = Number(body.quantity ?? 0);
  const unitPrice = Number(body.unitPrice ?? 0);
  const taxAmount = Number(body.taxAmount ?? 0);
  if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) {
    return NextResponse.json({ error: "Valid quantity and unit price are required." }, { status: 400 });
  }

  const subtotal = Number((quantity * unitPrice).toFixed(2));
  const total = Number((subtotal + (Number.isFinite(taxAmount) ? taxAmount : 0)).toFixed(2));

  // --- Idempotency guard ---
  const dedup = guardIdempotency(
    idempotencyKey("quote-send", leadId, subtotal, taxAmount),
  );
  if (dedup.isDuplicate) {
    return dedup.replay;
  }

  const siteAddress = body.siteAddress?.trim() || null;
  const scopeDescription = body.scopeDescription?.trim() || null;
  const lineDescription = body.lineDescription?.trim() || "Cleaning scope";
  const validUntil = body.validUntil?.trim() || null;
  const notes = body.notes?.trim() || null;

  try {
    const supabase = createAdminClient();
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("id, name, company_name, phone, email, description, converted_client_id, status")
      .eq("id", leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: leadError?.message ?? "Lead not found." }, { status: 404 });
    }

    const quoteNumber = nextQuoteNumber();
    const publicToken = randomUUID().replaceAll("-", "");
    const now = new Date().toISOString();

    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .insert({
        lead_id: lead.id,
        client_id: lead.converted_client_id,
        quote_number: quoteNumber,
        status: "sent",
        site_address: siteAddress,
        scope_description: scopeDescription || lead.description || null,
        subtotal,
        tax_amount: Number.isFinite(taxAmount) ? taxAmount : 0,
        total,
        valid_until: validUntil,
        notes,
        public_token: publicToken,
        recipient_email: lead.email,
        sent_at: now,
        created_by: auth.userId,
      })
      .select("id")
      .single();

    if (quoteError || !quote) {
      return NextResponse.json({ error: quoteError?.message ?? "Unable to create quote." }, { status: 500 });
    }

    const { error: lineItemError } = await supabase.from("quote_line_items").insert({
      quote_id: quote.id,
      description: lineDescription,
      quantity,
      unit: body.unit || "flat",
      unit_price: unitPrice,
      line_total: subtotal,
      sort_order: 0,
    });

    if (lineItemError) {
      return NextResponse.json({ error: lineItemError.message }, { status: 500 });
    }

    await supabase.from("leads").update({ status: "quoted" }).eq("id", lead.id);

    const shareUrl = `${getSiteUrl(request.url)}/quote/${publicToken}`;
    const pdfBuffer = buildQuotePdf({
      quoteNumber,
      createdAt: now,
      validUntil,
      clientName: lead.name,
      companyName: lead.company_name,
      address: siteAddress,
      contactEmail: lead.email,
      contactPhone: lead.phone,
      scopeDescription: scopeDescription || lead.description || null,
      lineItems: [
        {
          description: lineDescription,
          quantity,
          unit: body.unit || "flat",
          unitPrice,
          lineTotal: subtotal,
        },
      ],
      subtotal,
      taxAmount,
      total,
      notes,
    });

    let deliveryStatus: "sent" | "share_link_only" | "failed" = "share_link_only";
    let deliveryError: string | null = null;
    let emailed = false;

    if (lead.email) {
      const emailResult = await sendEmailResilient({
        to: lead.email,
        subject: `${quoteNumber} from A&A Cleaning`,
        html: buildQuoteEmailHtml({
          recipientName: lead.name,
          quoteNumber,
          total,
          scopeDescription: scopeDescription || lead.description || null,
          shareUrl,
          validUntil,
        }),
        attachments: [
          {
            filename: `${quoteNumber}.pdf`,
            contentBase64: pdfBuffer.toString("base64"),
          },
        ],
        tag: "quote-send",
      });

      emailed = emailResult.success;
      deliveryStatus = emailResult.success ? "sent" : "failed";
      deliveryError = emailResult.success ? null : emailResult.error ?? "Quote email failed.";
    }

    await supabase
      .from("quotes")
      .update({
        delivery_status: deliveryStatus,
        delivery_error: deliveryError,
        pdf_generated_at: now,
      })
      .eq("id", quote.id);

    const responseBody = {
      success: true,
      quoteId: quote.id,
      quoteNumber,
      emailed,
      shareUrl,
      deliveryStatus,
      deliveryError,
    };

    // Record for idempotency replay
    commitIdempotency(
      idempotencyKey("quote-send", leadId, subtotal, taxAmount),
      200,
      responseBody,
    );

    return NextResponse.json(responseBody);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error." },
      { status: 500 },
    );
  }
}
