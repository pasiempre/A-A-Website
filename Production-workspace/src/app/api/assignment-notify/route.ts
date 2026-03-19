import { NextResponse } from "next/server";

import { dispatchAssignmentNotification } from "@/lib/assignment-notifications";
import { createClient } from "@/lib/supabase/server";

type AssignmentNotifyBody = {
  assignmentId?: string;
};

async function authorizeAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false as const, status: 401, error: authError?.message ?? "Unauthorized." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    return { ok: false as const, status: 403, error: profileError?.message ?? "Admin role required." };
  }

  return { ok: true as const };
}

export async function POST(request: Request) {
  const auth = await authorizeAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: AssignmentNotifyBody;
  try {
    body = (await request.json()) as AssignmentNotifyBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const assignmentId = body.assignmentId?.trim();
  if (!assignmentId) {
    return NextResponse.json({ error: "assignmentId is required." }, { status: 400 });
  }

  try {
    const result = await dispatchAssignmentNotification(assignmentId);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error." },
      { status: 500 },
    );
  }
}
