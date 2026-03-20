import { NextResponse } from "next/server";

import { dispatchSmsWithQuietHours, sendSms } from "@/lib/notifications";
import { checkRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

type QuoteRequestBody = {
  name?: string;
  companyName?: string;
  phone?: string;
  email?: string;
  serviceType?: string;
  description?: string;
  timeline?: string;
  website?: string;
};

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = checkRateLimit(`quote:${ip}`, {
    windowMs: 3_600_000,
    max: 5,
  });

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: QuoteRequestBody;

  try {
    body = (await request.json()) as QuoteRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ success: true, leadId: "ok" }, { status: 201 });
  }

  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";

  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
  }

  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    return NextResponse.json(
      { error: "Please provide a valid 10-digit phone number." },
      { status: 400 },
    );
  }

  const sanitize = (value: string) => value.replace(/[<>&"']/g, "");
  const safeName = sanitize(name);
  const safeCompany = sanitize(body.companyName?.trim() || "Unknown company");
  const safeServiceType = sanitize(body.serviceType?.trim() || "General inquiry");

  try {
    const supabase = createAdminClient();

    const { data: insertedLead, error: insertError } = await supabase
      .from("leads")
      .insert({
        name,
        company_name: body.companyName?.trim() || null,
        phone,
        email: body.email?.trim() || null,
        service_type: body.serviceType?.trim() || null,
        timeline: body.timeline?.trim() || null,
        description: body.description?.trim() || null,
        source: "website_form",
      })
      .select("id, name, company_name, phone, service_type")
      .single();

    if (insertError || !insertedLead) {
      return NextResponse.json({ error: insertError?.message ?? "Unable to create lead." }, { status: 500 });
    }

    const { data: adminProfiles } = await supabase
      .from("profiles")
      .select("id, phone, notification_preferences")
      .eq("role", "admin")
      .order("created_at", { ascending: true })
      .limit(1);

    const adminProfile = adminProfiles?.[0] ?? null;
    const adminAlertPhone = process.env.ADMIN_ALERT_PHONE || adminProfile?.phone;

    if (adminAlertPhone) {
      const message = `New lead: ${safeName} from ${safeCompany}. ${safeServiceType}. Call ${phone}.`;

      const smsResult = await dispatchSmsWithQuietHours({
        supabase,
        to: adminAlertPhone,
        body: message,
        profileId: adminProfile?.id,
        preferences: (adminProfile?.notification_preferences as Record<string, unknown> | null) ?? null,
        queuedReason: "lead_alert_quiet_hours",
        context: {
          type: "lead_alert",
          leadId: insertedLead.id,
        },
      });

      if (!smsResult.sent && !smsResult.queued) {
        console.warn("Lead created, but SMS alert failed:", smsResult.error);
      }
    }

    const leadAckText =
      "Thanks for contacting A&A Cleaning. We received your quote request and will call you within the hour during business hours.";
    const leadAckSms = await sendSms(phone, leadAckText);
    if (!leadAckSms.sent) {
      console.warn("Lead acknowledgment SMS failed:", leadAckSms.error);
    }

    const recipientEmail = body.email?.trim();
    if (recipientEmail && process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL,
          to: [recipientEmail],
          subject: "A&A Cleaning quote request received",
          html: `
            <p>Hi ${safeName},</p>
            <p>Thanks for requesting a quote from A&amp;A Cleaning.</p>
            <p>We will call you within the hour during business hours to confirm scope and next steps.</p>
            <p><strong>Request summary:</strong> ${safeServiceType}</p>
            <p>Best,<br />A&amp;A Cleaning</p>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.warn("Lead acknowledgment email failed:", errorText);
      }
    }

    return NextResponse.json({ success: true, leadId: insertedLead.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error." },
      { status: 500 },
    );
  }
}
