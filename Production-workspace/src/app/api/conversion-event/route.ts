import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ConversionBody = {
  eventName?: string;
  source?: string;
  metadata?: Record<string, unknown>;
};

export async function POST(request: Request) {
  let body: ConversionBody;
  try {
    body = (await request.json()) as ConversionBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.eventName) {
    return NextResponse.json({ error: "eventName is required" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { error } = await supabase.from("conversion_events").insert({
    event_name: body.eventName,
    page_path: typeof body.metadata?.pagePath === "string" ? body.metadata.pagePath : null,
    source: body.source ?? null,
    metadata: body.metadata ?? {},
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
