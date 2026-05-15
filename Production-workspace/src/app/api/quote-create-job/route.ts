import { NextResponse } from "next/server";

import { authorizeAdmin } from "@/lib/auth";
import { dispatchAssignmentNotification } from "@/lib/assignment-notifications";
import {
  guardIdempotency,
  commitIdempotency,
  idempotencyKey,
} from "@/lib/idempotency";
import { createAdminClient } from "@/lib/supabase/admin";

type QuoteCreateJobBody = {
  quoteId?: string;
  title?: string;
  scheduledStart?: string;
  employeeId?: string;
};

function normalizeRelation<T>(relation: T[] | T | null | undefined): T | null {
  if (!relation) return null;
  return Array.isArray(relation) ? relation[0] ?? null : relation;
}

function getAvailabilityWindow(scheduledStart: string): { startIso: string; endIso: string } | null {
  const parsed = new Date(scheduledStart);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const ninetyMinutes = 90 * 60 * 1000;
  return {
    startIso: new Date(parsed.getTime() - ninetyMinutes).toISOString(),
    endIso: new Date(parsed.getTime() + ninetyMinutes).toISOString(),
  };
}

async function hasScheduleConflict(options: {
  supabase: ReturnType<typeof createAdminClient>;
  employeeId: string;
  scheduledStart: string;
}): Promise<{ conflict: boolean; reason?: string; status?: number; error?: string }> {
  const availabilityWindow = getAvailabilityWindow(options.scheduledStart);
  if (!availabilityWindow) {
    return { conflict: true, reason: "Invalid scheduled start value.", status: 400 };
  }

  const { data: conflictAssignment, error: conflictError } = await options.supabase
    .from("job_assignments")
    .select("id, jobs!inner(id, title, scheduled_start, status)")
    .eq("employee_id", options.employeeId)
    .gte("jobs.scheduled_start", availabilityWindow.startIso)
    .lte("jobs.scheduled_start", availabilityWindow.endIso)
    .in("jobs.status", ["scheduled", "in_progress"])
    .maybeSingle();

  if (conflictError) {
    return { conflict: true, error: conflictError.message, status: 500 };
  }

  if (conflictAssignment) {
    return {
      conflict: true,
      reason: "Selected crew member is already assigned at that time. Choose another start time or crew member.",
      status: 409,
    };
  }

  const { data: unavailableBlock, error: availabilityError } = await options.supabase
    .from("employee_availability")
    .select("id")
    .eq("employee_id", options.employeeId)
    .in("status", ["unavailable", "limited"])
    .lt("starts_at", availabilityWindow.endIso)
    .gt("ends_at", availabilityWindow.startIso)
    .limit(1)
    .maybeSingle();

  if (availabilityError) {
    return { conflict: true, error: availabilityError.message, status: 500 };
  }

  if (unavailableBlock) {
    return {
      conflict: true,
      reason: "Selected crew member is unavailable during that time window.",
      status: 409,
    };
  }

  return { conflict: false };
}

export async function POST(request: Request) {
  const auth = await authorizeAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: QuoteCreateJobBody;
  try {
    body = (await request.json()) as QuoteCreateJobBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const quoteId = body.quoteId?.trim();
  if (!quoteId) {
    return NextResponse.json({ error: "quoteId is required." }, { status: 400 });
  }

  // --- Idempotency guard (race-condition protection) ---
  const key = idempotencyKey("quote-create-job", quoteId);
  const dedup = guardIdempotency(key);
  if (dedup.isDuplicate) {
    return dedup.replay;
  }

  try {
    const supabase = createAdminClient();

    // DB-level dedup check (existing behavior preserved)
    const { data: existingJob } = await supabase
      .from("jobs")
      .select("id")
      .eq("quote_id", quoteId)
      .maybeSingle();

    if (existingJob) {
      const responseBody = {
        success: true,
        jobId: existingJob.id,
        existing: true,
      };
      commitIdempotency(key, 200, responseBody);
      return NextResponse.json(responseBody);
    }

    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select(
        "id, client_id, lead_id, site_address, scope_description, status, leads(id, name, company_name, phone, email, service_type, converted_client_id)",
      )
      .eq("id", quoteId)
      .single();

    if (quoteError || !quote) {
      return NextResponse.json({ error: quoteError?.message ?? "Quote not found." }, { status: 404 });
    }

    const lead = normalizeRelation(quote.leads);
    if (!lead) {
      return NextResponse.json({ error: "Lead details are required to create the job." }, { status: 400 });
    }

    let clientId = quote.client_id || lead.converted_client_id;
    if (!clientId) {
      const { data: createdClient, error: clientError } = await supabase
        .from("clients")
        .insert({
          name: lead.company_name || lead.name,
          company_name: lead.company_name,
          phone: lead.phone,
          email: lead.email,
          notes: `Converted from accepted quote ${quote.id}`,
          created_by: auth.userId,
        })
        .select("id")
        .single();

      if (clientError || !createdClient) {
        return NextResponse.json({ error: clientError?.message ?? "Unable to create client." }, { status: 500 });
      }

      clientId = createdClient.id;
    }

    const title =
      body.title?.trim() ||
      `${lead.company_name || lead.name} ${lead.service_type ? `- ${lead.service_type}` : "- Cleaning Job"}`;
    const scheduledStart = body.scheduledStart?.trim() || null;
    const employeeId = body.employeeId?.trim() || null;

    if (employeeId && scheduledStart) {
      const conflictResult = await hasScheduleConflict({
        supabase,
        employeeId,
        scheduledStart,
      });

      if (conflictResult.conflict) {
        if (conflictResult.error) {
          return NextResponse.json({ error: conflictResult.error }, { status: conflictResult.status ?? 500 });
        }
        return NextResponse.json({ error: conflictResult.reason }, { status: conflictResult.status ?? 409 });
      }
    }

    const { data: createdJob, error: jobError } = await supabase
      .from("jobs")
      .insert({
        client_id: clientId,
        quote_id: quote.id,
        title,
        customer_name: lead.company_name || lead.name,
        address: quote.site_address || "Address pending",
        contact_name: lead.name,
        contact_phone: lead.phone,
        scope: quote.scope_description,
        scheduled_start: scheduledStart || null,
        status: "scheduled",
        created_by: auth.userId,
      })
      .select("id")
      .single();

    if (jobError || !createdJob) {
      return NextResponse.json({ error: jobError?.message ?? "Unable to create job." }, { status: 500 });
    }

    let assignmentId: string | null = null;
    if (employeeId) {
      const { data: assignment, error: assignmentError } = await supabase
        .from("job_assignments")
        .insert({
          job_id: createdJob.id,
          employee_id: employeeId,
          assigned_by: auth.userId,
          role: "lead",
          status: "assigned",
          notification_status: "pending",
        })
        .select("id")
        .single();

      if (assignmentError) {
        return NextResponse.json({ error: assignmentError.message }, { status: 500 });
      }

      assignmentId = assignment?.id ?? null;
    }

    await supabase
      .from("quotes")
      .update({ client_id: clientId, status: quote.status === "declined" ? "declined" : "accepted" })
      .eq("id", quote.id);

    await supabase
      .from("leads")
      .update({ status: "converted", converted_client_id: clientId })
      .eq("id", lead.id);

    if (assignmentId) {
      await dispatchAssignmentNotification(assignmentId);
    }

    const responseBody = {
      success: true,
      jobId: createdJob.id,
      assignmentId,
    };

    commitIdempotency(key, 200, responseBody);

    return NextResponse.json(responseBody);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error." },
      { status: 500 },
    );
  }
}
