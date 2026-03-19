import { NextResponse } from "next/server";

import { sendSms } from "@/lib/notifications";
import { createAdminClient } from "@/lib/supabase/admin";

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return true;
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const { data: queuedRows, error: queuedError } = await supabase
      .from("notification_dispatch_queue")
      .select("id, to_phone, body")
      .eq("status", "queued")
      .lte("send_after", new Date().toISOString())
      .order("send_after", { ascending: true })
      .limit(100);

    if (queuedError) {
      return NextResponse.json({ error: queuedError.message }, { status: 500 });
    }

    let sent = 0;
    let failed = 0;

    for (const row of queuedRows ?? []) {
      const smsResult = await sendSms(row.to_phone, row.body);

      if (smsResult.sent) {
        sent += 1;
        await supabase
          .from("notification_dispatch_queue")
          .update({ status: "sent", sent_at: new Date().toISOString(), provider_sid: smsResult.sid ?? null, error_text: null })
          .eq("id", row.id);
      } else {
        failed += 1;
        await supabase
          .from("notification_dispatch_queue")
          .update({ status: "failed", error_text: smsResult.error ?? "Unknown dispatch failure." })
          .eq("id", row.id);
      }
    }

    return NextResponse.json({
      success: true,
      queuedCount: queuedRows?.length ?? 0,
      sent,
      failed,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error." },
      { status: 500 },
    );
  }
}