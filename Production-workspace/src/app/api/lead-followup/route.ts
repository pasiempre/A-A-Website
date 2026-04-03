import { NextResponse } from "next/server";

import { authorizeCronRequest } from "@/lib/cron-auth";
import { dispatchSmsWithQuietHours } from "@/lib/notifications";
import { createAdminClient } from "@/lib/supabase/admin";

// ============================================================
// Types
// ============================================================

type LeadRow = {
  id: string;
  name: string;
  company_name: string | null;
  phone: string;
  email: string | null;
  created_at: string;
};

type AlertResult = {
  leadId: string;
  leadName: string;
  tier: "1h" | "4h" | "24h";
  sent: boolean;
  queued: boolean;
  error?: string;
};

type FollowupTelemetry = {
  startedAt: string;
  durationMs: number;
  businessHoursCheck: boolean;
  adminPhone: string | null;
  tiers: {
    "1h": { candidates: number; sent: number; queued: number; failed: number };
    "4h": { candidates: number; sent: number; queued: number; failed: number };
    "24h": {
      candidates: number;
      sent: number;
      queued: number;
      failed: number;
    };
  };
  errors: string[];
};

type RequestBody = {
  forceRun?: boolean;
  dryRun?: boolean;
};

// ============================================================
// Constants
// ============================================================

const BUSINESS_HOUR_START = 7;
const BUSINESS_HOUR_END = 21;
const BUSINESS_DAYS = [1, 2, 3, 4, 5, 6];
const MAX_PER_TIER = 50;

// ============================================================
// Alert tier definitions
// ============================================================

const ALERT_TIERS = [
  {
    key: "1h" as const,
    hoursThreshold: 1,
    sentAtColumn: "first_alert_sent_at",
    messageTemplate: (lead: LeadRow) => {
      return `⚡ ${lead.name} hasn't been contacted yet. [Call Now] ${lead.phone}`;
    },
    contextType: "lead_followup_1h",
  },
  {
    key: "4h" as const,
    hoursThreshold: 4,
    sentAtColumn: "second_alert_sent_at",
    messageTemplate: (lead: LeadRow) => {
      return `⚠️ ${lead.name} still waiting (4 hrs). Leads contacted in 1hr convert 3x better. ${lead.phone}`;
    },
    contextType: "lead_followup_4h",
  },
  {
    key: "24h" as const,
    hoursThreshold: 24,
    sentAtColumn: "third_alert_sent_at",
    messageTemplate: (lead: LeadRow) => {
      return `🔴 ${lead.name} waiting 24 hours. Consider this lead at risk. ${lead.phone}`;
    },
    contextType: "lead_followup_24h",
  },
] as const;

// ============================================================
// Helpers
// ============================================================

function isoHoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function isWithinBusinessHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  return (
    BUSINESS_DAYS.includes(day) &&
    hour >= BUSINESS_HOUR_START &&
    hour < BUSINESS_HOUR_END
  );
}

// ============================================================
// Tier processing
// ============================================================

async function processAlertTier(params: {
  supabase: ReturnType<typeof createAdminClient>;
  leads: LeadRow[];
  tier: (typeof ALERT_TIERS)[number];
  adminPhone: string;
  adminProfileId: string | null;
  adminPreferences: Record<string, unknown> | null;
  dryRun: boolean;
}): Promise<AlertResult[]> {
  const {
    supabase,
    leads,
    tier,
    adminPhone,
    adminProfileId,
    adminPreferences,
    dryRun,
  } = params;
  const results: AlertResult[] = [];

  for (const lead of leads) {
    if (dryRun) {
      results.push({
        leadId: lead.id,
        leadName: lead.name,
        tier: tier.key,
        sent: false,
        queued: false,
        error: "dry_run",
      });
      continue;
    }

    try {
      const { data: freshLead } = await supabase
        .from("leads")
        .select(`id, ${tier.sentAtColumn}`)
        .eq("id", lead.id)
        .single();

      if (
        freshLead &&
        freshLead[tier.sentAtColumn as keyof typeof freshLead] !== null
      ) {
        results.push({
          leadId: lead.id,
          leadName: lead.name,
          tier: tier.key,
          sent: false,
          queued: false,
          error: "already_sent",
        });
        continue;
      }

      const message = tier.messageTemplate(lead);

      const result = await dispatchSmsWithQuietHours({
        supabase,
        to: adminPhone,
        body: message,
        profileId: adminProfileId,
        preferences: adminPreferences,
        queuedReason: "lead_followup_quiet_hours",
        context: {
          type: tier.contextType,
          leadId: lead.id,
        },
      });

      if (result.sent || result.queued) {
        const { error: updateError } = await supabase
          .from("leads")
          .update({ [tier.sentAtColumn]: new Date().toISOString() })
          .eq("id", lead.id)
          .is(tier.sentAtColumn, null);

        if (updateError) {
          results.push({
            leadId: lead.id,
            leadName: lead.name,
            tier: tier.key,
            sent: result.sent,
            queued: result.queued,
            error: `SMS dispatched but DB update failed: ${updateError.message}`,
          });
          continue;
        }
      }

      results.push({
        leadId: lead.id,
        leadName: lead.name,
        tier: tier.key,
        sent: result.sent,
        queued: result.queued,
      });
    } catch (err) {
      results.push({
        leadId: lead.id,
        leadName: lead.name,
        tier: tier.key,
        sent: false,
        queued: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return results;
}

// ============================================================
// POST handler (main dispatch)
// ============================================================

export async function POST(request: Request) {
  const startTime = Date.now();
  const errors: string[] = [];

  // --- Auth (fail-closed) ---
  const auth = authorizeCronRequest(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.error ?? "Unauthorized." },
      { status: 401 },
    );
  }

  let body: RequestBody = {};
  try {
    const text = await request.text();
    if (text.trim()) {
      body = JSON.parse(text) as RequestBody;
    }
  } catch {
    // Empty body is fine for cron calls.
  }

  const dryRun = body.dryRun === true;
  const forceRun = body.forceRun === true;
  const withinBusinessHours = isWithinBusinessHours();

  if (!withinBusinessHours && !forceRun) {
    const telemetry: FollowupTelemetry = {
      startedAt: new Date(startTime).toISOString(),
      durationMs: Date.now() - startTime,
      businessHoursCheck: false,
      adminPhone: null,
      tiers: {
        "1h": { candidates: 0, sent: 0, queued: 0, failed: 0 },
        "4h": { candidates: 0, sent: 0, queued: 0, failed: 0 },
        "24h": { candidates: 0, sent: 0, queued: 0, failed: 0 },
      },
      errors: [],
    };

    console.info(
      "[lead-followup] Skipped: outside business hours",
      JSON.stringify(telemetry),
    );

    return NextResponse.json({
      success: true,
      skipped: true,
      reason:
        "Outside business hours (Mon-Sat 7AM-9PM). Use forceRun to override.",
      telemetry,
    });
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
    const adminAlertPhone =
      process.env.ADMIN_ALERT_PHONE || adminProfile?.phone;

    if (!adminAlertPhone) {
      return NextResponse.json({
        success: true,
        skipped: true,
        reason:
          "No admin phone configured (ADMIN_ALERT_PHONE env or admin profile phone).",
      });
    }

    const adminPreferences =
      (adminProfile?.notification_preferences as Record<
        string,
        unknown
      > | null) ?? null;

    const [oneHourResult, fourHourResult, twentyFourHourResult] =
      await Promise.all([
        supabase
          .from("leads")
          .select("id, name, company_name, phone, email, created_at")
          .eq("status", "new")
          .is("first_alert_sent_at", null)
          .lte("created_at", isoHoursAgo(1))
          .order("created_at", { ascending: true })
          .limit(MAX_PER_TIER),
        supabase
          .from("leads")
          .select("id, name, company_name, phone, email, created_at")
          .eq("status", "new")
          .is("second_alert_sent_at", null)
          .not("first_alert_sent_at", "is", null)
          .lte("created_at", isoHoursAgo(4))
          .order("created_at", { ascending: true })
          .limit(MAX_PER_TIER),
        supabase
          .from("leads")
          .select("id, name, company_name, phone, email, created_at")
          .eq("status", "new")
          .is("third_alert_sent_at", null)
          .not("second_alert_sent_at", "is", null)
          .lte("created_at", isoHoursAgo(24))
          .order("created_at", { ascending: true })
          .limit(MAX_PER_TIER),
      ]);

    if (oneHourResult.error) {
      errors.push(`1h query: ${oneHourResult.error.message}`);
    }
    if (fourHourResult.error) {
      errors.push(`4h query: ${fourHourResult.error.message}`);
    }
    if (twentyFourHourResult.error) {
      errors.push(`24h query: ${twentyFourHourResult.error.message}`);
    }

    if (
      oneHourResult.error &&
      fourHourResult.error &&
      twentyFourHourResult.error
    ) {
      return NextResponse.json(
        { error: "All lead queries failed.", details: errors },
        { status: 500 },
      );
    }

    const tierData: Array<{
      tier: (typeof ALERT_TIERS)[number];
      leads: LeadRow[];
    }> = [
      {
        tier: ALERT_TIERS[0],
        leads: (oneHourResult.data as LeadRow[]) ?? [],
      },
      {
        tier: ALERT_TIERS[1],
        leads: (fourHourResult.data as LeadRow[]) ?? [],
      },
      {
        tier: ALERT_TIERS[2],
        leads: (twentyFourHourResult.data as LeadRow[]) ?? [],
      },
    ];

    const allResults: AlertResult[] = [];

    for (const { tier, leads } of tierData) {
      if (leads.length === 0) continue;

      const results = await processAlertTier({
        supabase,
        leads,
        tier,
        adminPhone: adminAlertPhone,
        adminProfileId: adminProfile?.id ?? null,
        adminPreferences,
        dryRun,
      });

      allResults.push(...results);
    }

    const tierStats = {
      "1h": { candidates: 0, sent: 0, queued: 0, failed: 0 },
      "4h": { candidates: 0, sent: 0, queued: 0, failed: 0 },
      "24h": { candidates: 0, sent: 0, queued: 0, failed: 0 },
    };

    for (const { tier, leads } of tierData) {
      tierStats[tier.key].candidates = leads.length;
    }

    for (const result of allResults) {
      if (result.sent) tierStats[result.tier].sent++;
      else if (result.queued) tierStats[result.tier].queued++;
      else if (
        result.error &&
        result.error !== "dry_run" &&
        result.error !== "already_sent"
      ) {
        tierStats[result.tier].failed++;
      }
    }

    for (const result of allResults) {
      if (
        result.error &&
        result.error !== "dry_run" &&
        result.error !== "already_sent"
      ) {
        errors.push(`${result.tier} ${result.leadName}: ${result.error}`);
      }
    }

    const telemetry: FollowupTelemetry = {
      startedAt: new Date(startTime).toISOString(),
      durationMs: Date.now() - startTime,
      businessHoursCheck: withinBusinessHours,
      adminPhone: adminAlertPhone.slice(0, 6) + "****",
      tiers: tierStats,
      errors,
    };

    if (errors.length > 0) {
      console.warn(
        "[lead-followup] Completed with warnings:",
        JSON.stringify(telemetry),
      );
    } else {
      console.info(
        "[lead-followup] Success:",
        JSON.stringify(telemetry),
      );
    }

    return NextResponse.json({
      success: true,
      dryRun,
      tiers: tierStats,
      totalCandidates:
        tierStats["1h"].candidates +
        tierStats["4h"].candidates +
        tierStats["24h"].candidates,
      totalSent:
        tierStats["1h"].sent +
        tierStats["4h"].sent +
        tierStats["24h"].sent,
      totalQueued:
        tierStats["1h"].queued +
        tierStats["4h"].queued +
        tierStats["24h"].queued,
      warnings: errors.length > 0 ? errors : undefined,
      telemetry,
      // TODO(F-03): 48h auto-status update to "At Risk" requires schema and workflow support.
    });
  } catch (error) {
    const telemetry = {
      startedAt: new Date(startTime).toISOString(),
      durationMs: Date.now() - startTime,
      error:
        error instanceof Error ? error.message : "Unexpected error",
    };

    console.error(
      "[lead-followup] Fatal error:",
      JSON.stringify(telemetry),
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error.",
        telemetry,
      },
      { status: 500 },
    );
  }
}

// ============================================================
// GET handler (health check)
// ============================================================

export async function GET(request: Request) {
  const auth = authorizeCronRequest(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.error ?? "Unauthorized." },
      { status: 401 },
    );
  }

  try {
    const supabase = createAdminClient();

    const [newLeadsResult, pendingAlertsResult] = await Promise.all([
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("status", "new")
        .is("first_alert_sent_at", null)
        .lte("created_at", isoHoursAgo(1)),
    ]);

    return NextResponse.json({
      healthy: true,
      withinBusinessHours: isWithinBusinessHours(),
      newLeadsTotal: newLeadsResult.count ?? 0,
      pendingFirstAlerts: pendingAlertsResult.count ?? 0,
      cronSecretConfigured: !!process.env.CRON_SECRET,
      adminPhoneConfigured: !!(
        process.env.ADMIN_ALERT_PHONE ||
        process.env.ADMIN_NOTIFICATION_EMAIL
      ),
    });
  } catch (error) {
    return NextResponse.json(
      {
        healthy: false,
        error:
          error instanceof Error
            ? error.message
            : "Health check failed",
      },
      { status: 500 },
    );
  }
}
