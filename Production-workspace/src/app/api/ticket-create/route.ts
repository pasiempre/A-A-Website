import { NextResponse } from "next/server";

import { authorizeAdmin } from "@/lib/auth";
import { dispatchAssignmentNotification } from "@/lib/assignment-notifications";
import { parseAreas } from "@/lib/ticketing";
import { createAdminClient } from "@/lib/supabase/admin";

type TicketCreateBody = {
  title?: string;
  address?: string;
  cleanType?: string;
  priority?: string;
  scope?: string;
  areasCsv?: string;
  assignedWeekStart?: string;
  workerId?: string;
  checklistTemplateId?: string;
};

export async function POST(request: Request) {
  const auth = await authorizeAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: TicketCreateBody;
  try {
    body = (await request.json()) as TicketCreateBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const title = body.title?.trim() ?? "";
  const address = body.address?.trim() ?? "";
  if (!title || !address) {
    return NextResponse.json({ error: "Title and address are required." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const areas = parseAreas(body.areasCsv ?? "");

  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc("admin_create_ticket_atomic", {
      p_title: title,
      p_address: address,
      p_clean_type: body.cleanType ?? "post_construction",
      p_priority: body.priority ?? "normal",
      p_scope: body.scope?.trim() || null,
      p_areas: areas,
      p_assigned_week_start: body.assignedWeekStart?.trim() || null,
      p_worker_id: body.workerId?.trim() || null,
      p_checklist_template_id: body.checklistTemplateId?.trim() || null,
      p_created_by: auth.userId,
    });

    if (rpcError) {
      return NextResponse.json({ error: rpcError.message }, { status: 500 });
    }

    const result = Array.isArray(rpcData) ? rpcData[0] : rpcData;
    const jobId = result?.job_id as string | undefined;
    const assignmentId = (result?.assignment_id as string | null | undefined) ?? null;

    if (!jobId) {
      return NextResponse.json({ error: "Failed to create job." }, { status: 500 });
    }

    // Dispatch failures should not roll back created jobs/assignments.
    if (assignmentId) {
      try {
        await dispatchAssignmentNotification(assignmentId);
      } catch {
        // Best-effort notification. Queue-based follow-up can retry out-of-band.
      }
    }

    return NextResponse.json({ success: true, jobId, assignmentId });
  } catch (error) {

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error." },
      { status: 500 },
    );
  }
}
