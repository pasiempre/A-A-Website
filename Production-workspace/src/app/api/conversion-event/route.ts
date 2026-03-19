import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ConversionBody = {
  eventName?: string;
  source?: string;
  metadata?: Record<string, unknown>;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ConversionBody;

  if (!body.eventName) {
    return NextResponse.json({ error: "eventName is required" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  await supabase.from("conversion_events").insert({
    event_name: body.eventName,
    page_path: typeof body.metadata?.pagePath === "string" ? body.metadata.pagePath : null,
    source: body.source ?? null,
    metadata: body.metadata ?? {},
  });

  return NextResponse.json({ ok: true });
}
