import { NextResponse } from "next/server";

import { authorizeAdmin } from "@/lib/auth";
import { dispatchAssignmentNotification } from "@/lib/assignment-notifications";
import {
  guardIdempotency,
  commitIdempotency,
  idempotencyKey,
} from "@/lib/idempotency";

type AssignmentNotifyBody = {
  assignmentId?: string;
};

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

  // --- Idempotency guard ---
  const key = idempotencyKey("assignment-notify", assignmentId);
  const dedup = guardIdempotency(key);
  if (dedup.isDuplicate) {
    return dedup.replay;
  }

  try {
    const result = await dispatchAssignmentNotification(assignmentId);
    const responseBody = { success: true, ...result };

    commitIdempotency(key, 200, responseBody);

    return NextResponse.json(responseBody);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error." },
      { status: 500 },
    );
  }
}
