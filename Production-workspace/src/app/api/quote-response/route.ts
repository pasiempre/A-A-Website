import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

type QuoteResponseBody = {
  token?: string;
  response?: "accept" | "decline";
  contactName?: string;
  contactEmail?: string;
  notes?: string;
};

export async function POST(request: Request) {
  let body: QuoteResponseBody;
  try {
    body = (await request.json()) as QuoteResponseBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const token = body.token?.trim();
  const response = body.response;
  if (!token || (response !== "accept" && response !== "decline")) {
    return NextResponse.json({ error: "token and a valid response are required." }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("id, lead_id, status, viewed_at")
      .eq("public_token", token)
      .single();

    if (quoteError || !quote) {
      return NextResponse.json({ error: quoteError?.message ?? "Quote not found." }, { status: 404 });
    }

    if (quote.status === "accepted" || quote.status === "declined") {
      return NextResponse.json({ success: true, status: quote.status });
    }

    const now = new Date().toISOString();
    const nextStatus = response === "accept" ? "accepted" : "declined";

    const { error: updateError } = await supabase
      .from("quotes")
      .update({
        status: nextStatus,
        responded_at: now,
        viewed_at: quote.viewed_at ?? now,
        accepted_at: response === "accept" ? now : null,
        declined_at: response === "decline" ? now : null,
        accepted_by_name: body.contactName?.trim() || null,
        accepted_by_email: body.contactEmail?.trim() || null,
        response_notes: body.notes?.trim() || null,
      })
      .eq("id", quote.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    await supabase
      .from("leads")
      .update({ status: response === "accept" ? "won" : "lost" })
      .eq("id", quote.lead_id);

    return NextResponse.json({ success: true, status: nextStatus });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error." },
      { status: 500 },
    );
  }
}
