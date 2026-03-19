import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

type AssistantBody = {
  message?: string;
  locale?: "en" | "es";
  sessionId?: string;
};

function basicFallbackAnswer(message: string, locale: "en" | "es") {
  const lower = message.toLowerCase();

  if (locale === "es") {
    if (lower.includes("precio") || lower.includes("cotiza") || lower.includes("cotización")) {
      return "Podemos ayudarte con una cotización rápida. Compártenos tipo de servicio, dirección, tamaño del proyecto y fecha ideal, y te llamamos dentro de horario laboral.";
    }
    if (lower.includes("servicio") || lower.includes("limpieza")) {
      return "Ofrecemos limpieza post-construcción, limpieza final, comercial, mudanza, ventanas y power wash. ¿Qué tipo de proyecto necesitas?";
    }
    if (lower.includes("tiempo") || lower.includes("cuando") || lower.includes("cuándo")) {
      return "Normalmente respondemos el mismo día y podemos coordinar servicios urgentes según disponibilidad.";
    }
    return "Gracias por contactarnos. Para avanzar con tu cotización, comparte: tipo de servicio, dirección del sitio, tamaño aproximado y fecha objetivo.";
  }

  if (lower.includes("price") || lower.includes("quote") || lower.includes("estimate")) {
    return "We can prepare a fast quote. Share service type, site address, project size, and target date, and we will follow up during business hours.";
  }
  if (lower.includes("service") || lower.includes("clean")) {
    return "We handle post-construction, final clean, commercial, move-in/out, windows, and power wash scopes. Which project type do you need?";
  }
  if (lower.includes("when") || lower.includes("timeline") || lower.includes("urgent")) {
    return "We typically respond same-day and can support urgent turnaround based on schedule availability.";
  }

  return "Thanks for reaching out. To speed up your quote, please share service type, project address, approximate size, and desired timeline.";
}

async function callAnthropic(message: string, locale: "en" | "es") {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return null;
  }

  const systemPrompt =
    locale === "es"
      ? "Eres un asistente de A&A Cleaning. Responde breve, profesional, y enfocado en calificar leads B2B de limpieza de construcción."
      : "You are A&A Cleaning assistant. Respond briefly, professionally, and focus on qualifying B2B construction cleaning leads.";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 220,
      system: systemPrompt,
      messages: [{ role: "user", content: message }],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };

  const text = payload.content?.find((item) => item.type === "text")?.text?.trim();
  return text || null;
}

export async function POST(request: Request) {
  let body: AssistantBody;
  try {
    body = (await request.json()) as AssistantBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const message = body.message?.trim();
  const locale = body.locale === "es" ? "es" : "en";

  if (!message) {
    return NextResponse.json({ error: "message is required." }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    let sessionId = body.sessionId;

    if (!sessionId) {
      const { data: createdSession, error: sessionError } = await supabase
        .from("ai_chat_sessions")
        .insert({ user_type: "public", locale })
        .select("id")
        .single();

      if (sessionError || !createdSession) {
        return NextResponse.json({ error: sessionError?.message ?? "Unable to create chat session." }, { status: 500 });
      }

      sessionId = createdSession.id;
    }

    const { error: userMessageError } = await supabase.from("ai_chat_messages").insert({
      session_id: sessionId,
      role: "user",
      content: message,
      metadata: { locale },
    });

    if (userMessageError) {
      return NextResponse.json({ error: userMessageError.message }, { status: 500 });
    }

    const anthropicAnswer = await callAnthropic(message, locale);
    const reply = anthropicAnswer || basicFallbackAnswer(message, locale);

    const { error: assistantMessageError } = await supabase.from("ai_chat_messages").insert({
      session_id: sessionId,
      role: "assistant",
      content: reply,
      metadata: { locale, provider: anthropicAnswer ? "anthropic" : "fallback" },
    });

    if (assistantMessageError) {
      return NextResponse.json({ error: assistantMessageError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      sessionId,
      reply,
      provider: anthropicAnswer ? "anthropic" : "fallback",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error." },
      { status: 500 },
    );
  }
}