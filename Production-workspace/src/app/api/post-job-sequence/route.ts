import { NextResponse } from "next/server";

import { authorizeAdmin } from "@/lib/auth";
import { startPostJobSequence } from "@/lib/post-job-sequence";

type PostJobSequenceBody = {
  jobId?: string;
};

export async function POST(request: Request) {
  const auth = await authorizeAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: PostJobSequenceBody;
  try {
    body = (await request.json()) as PostJobSequenceBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const jobId = body.jobId?.trim();
  if (!jobId) {
    return NextResponse.json({ error: "jobId is required." }, { status: 400 });
  }

  const result = await startPostJobSequence({ jobId });
  if (!result.started) {
    return NextResponse.json(
      {
        success: false,
        warnings: result.warnings,
      },
      { status: 409 },
    );
  }

  return NextResponse.json({
    success: true,
    sequenceId: result.sequenceId,
    adminNotified: result.adminNotified,
    customerEmailed: result.customerEmailed,
    warnings: result.warnings,
  });
}
