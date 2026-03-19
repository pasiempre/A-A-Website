"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

export function AIQuoteAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState<"en" | "es">("en");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi — I can help you with a fast quote. Tell me your service type, project address, size, and target date.",
    },
  ]);
  const assistantRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }

      if (assistantRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }

      setIsOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const sendMessage = async () => {
    const prompt = input.trim();
    if (!prompt || isSending) {
      return;
    }

    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          locale,
          sessionId,
        }),
      });

      const data = (await response.json()) as { reply?: string; sessionId?: string; error?: string };
      if (!response.ok || !data.reply) {
        throw new Error(data.error ?? "Unable to send message.");
      }

      setSessionId(data.sessionId ?? sessionId);
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply as string }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            locale === "es"
              ? "No pude procesar eso ahora. Comparte tipo de servicio, dirección, tamaño y fecha para ayudarte con la cotización."
              : "I could not process that right now. Share service type, address, project size, and timeline and I’ll help structure your quote request.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-8 right-6 z-50 hidden rounded-full bg-[#1D4ED8] px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-white shadow-lg md:inline-flex"
      >
        {isOpen ? "Close Assistant" : "AI Quote Assist"}
      </button>

      {isOpen ? (
        <aside ref={assistantRef} role="dialog" aria-label="AI quote assistant" className="fixed bottom-20 right-6 z-50 hidden h-[28rem] w-[22rem] flex-col overflow-hidden rounded border border-slate-300 bg-white shadow-xl md:flex">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-sm font-semibold text-slate-800">Quote Assistant</p>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`rounded px-2 py-1 text-xs ${locale === "en" ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700"}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale("es")}
                className={`rounded px-2 py-1 text-xs ${locale === "es" ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700"}`}
              >
                ES
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto bg-white px-3 py-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded px-3 py-2 text-sm ${
                  message.role === "assistant" ? "bg-slate-100 text-slate-800" : "ml-auto bg-[#1D4ED8] text-white"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 p-3">
            <textarea
              rows={2}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={locale === "es" ? "Escribe tu mensaje..." : "Type your message..."}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={isSending}
              className="mt-2 w-full rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? (locale === "es" ? "Enviando..." : "Sending...") : locale === "es" ? "Enviar" : "Send"}
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
