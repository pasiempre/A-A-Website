import { NextResponse } from "next/server";

import { dispatchSmsWithQuietHours } from "@/lib/notifications";
import { createAdminClient } from "@/lib/supabase/admin";

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return true;
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

function isoHoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const { data: adminProfiles } = await supabase
      .from("profiles")
      .select("id, phone, notification_preferences")
      .eq("role", "admin")
      .order("created_at", { ascending: true })
      .limit(1);

    const adminProfile = adminProfiles?.[0] ?? null;
    const adminAlertPhone = process.env.ADMIN_ALERT_PHONE || adminProfile?.phone;

    if (!adminAlertPhone) {
      return NextResponse.json({ success: true, skipped: true, reason: "ADMIN_ALERT_PHONE or admin profile phone not configured." });
    }

    const [{ data: oneHourLeads, error: oneHourError }, { data: fourHourLeads, error: fourHourError }] =
      await Promise.all([
        supabase
          .from("leads")
          .select("id, name, company_name, phone")
          .eq("status", "new")
          .is("first_alert_sent_at", null)
          .lte("created_at", isoHoursAgo(1))
          .order("created_at", { ascending: true })
          .limit(50),
        supabase
          .from("leads")
          .select("id, name, company_name, phone")
          .eq("status", "new")
          .is("second_alert_sent_at", null)
          .lte("created_at", isoHoursAgo(4))
          .order("created_at", { ascending: true })
          .limit(50),
      ]);

    if (oneHourError || fourHourError) {
      return NextResponse.json(
        {
          error: oneHourError?.message ?? fourHourError?.message ?? "Failed loading leads for follow-up.",
        },
        { status: 500 },
      );
    }

    let firstAlertSent = 0;
    let secondAlertSent = 0;

    for (const lead of oneHourLeads ?? []) {
      const company = lead.company_name ?? "Unknown company";
      const message = `You have an uncalled lead: ${lead.name} (${company}) — ${lead.phone}.`;
      const result = await dispatchSmsWithQuietHours({
        supabase,
        to: adminAlertPhone,
        body: message,
        profileId: adminProfile?.id,
        preferences: (adminProfile?.notification_preferences as Record<string, unknown> | null) ?? null,
        queuedReason: "lead_followup_quiet_hours",
        context: {
          type: "lead_followup_1h",
          leadId: lead.id,
        },
      });

      if (result.sent || result.queued) {
        firstAlertSent += 1;
        await supabase.from("leads").update({ first_alert_sent_at: new Date().toISOString() }).eq("id", lead.id);
      }
    }

    for (const lead of fourHourLeads ?? []) {
      const company = lead.company_name ?? "Unknown company";
      const message = `URGENT: Lead ${lead.name} (${company}) is still uncalled — ${lead.phone}.`;
      const result = await dispatchSmsWithQuietHours({
        supabase,
        to: adminAlertPhone,
        body: message,
        profileId: adminProfile?.id,
        preferences: (adminProfile?.notification_preferences as Record<string, unknown> | null) ?? null,
        queuedReason: "lead_followup_quiet_hours",
        context: {
          type: "lead_followup_4h",
          leadId: lead.id,
        },
      });

      if (result.sent || result.queued) {
        secondAlertSent += 1;
        await supabase.from("leads").update({ second_alert_sent_at: new Date().toISOString() }).eq("id", lead.id);
      }
    }

    return NextResponse.json({
      success: true,
      oneHourCandidates: oneHourLeads?.length ?? 0,
      fourHourCandidates: fourHourLeads?.length ?? 0,
      firstAlertSent,
      secondAlertSent,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error." },
      { status: 500 },
    );
  }
}
