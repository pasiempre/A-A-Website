"use client";

import { useEffect, useId, useRef, useState } from "react";
import { trackConversionEvent } from "@/lib/analytics";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type Locale = "en" | "es";

const GREETING: Record<Locale, string> = {
  en: "Hi — I can help you with a fast quote. Tell me your service type, project address, size, and target date.",
  es: "Hola — puedo ayudarte con una cotización rápida. Dime el tipo de servicio, dirección, tamaño y fecha deseada.",
};

const ERROR_MESSAGE: Record<Locale, string> = {
  en: "I could not process that right now. Share service type, address, project size, and timeline and I’ll help structure your quote request.",
  es: "No pude procesar eso ahora. Comparte tipo de servicio, dirección, tamaño y fecha para ayudarte con la cotización.",
};

const INPUT_PLACEHOLDER: Record<Locale, string> = {
  en: "Type your message...",
  es: "Escribe tu mensaje...",
};

const SEND_LABEL: Record<Locale, { idle: string; busy: string }> = {
  en: { idle: "Send", busy: "Sending..." },
  es: { idle: "Enviar", busy: "Enviando..." },
};

function createMessageId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `chat-${crypto.randomUUID()}`;
  }
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AIQuoteAssistant() {
  const dialogLabelId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createMessageId(),
      role: "assistant",
      text: GREETING.en,
    },
  ]);
  const assistantRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  useEffect(() => {
    if (!isOpen) {
      triggerRef.current?.focus();
      return;
    }

    inputRef.current?.focus();

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

  useEffect(() => {
    setMessages([{ id: createMessageId(), role: "assistant", text: GREETING[locale] }]);
    setSessionId(null);
  }, [locale]);

  const sendMessage = async () => {
    const prompt = input.trim();
    if (!prompt || isSending) {
      return;
    }

    const hasSession = Boolean(sessionId);

    void trackConversionEvent({
      eventName: "ai_assistant_message_submit",
      source: "ai_quote_assistant",
      metadata: { locale, hasSession },
    });

    setMessages((prev) => [...prev, { id: createMessageId(), role: "user", text: prompt }]);
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
      setMessages((prev) => [...prev, { id: createMessageId(), role: "assistant", text: data.reply as string }]);

      void trackConversionEvent({
        eventName: "ai_assistant_message_success",
        source: "ai_quote_assistant",
        metadata: { locale, hasSession },
      });
    } catch (error) {
      console.error("[AIQuoteAssistant]", error);

      void trackConversionEvent({
        eventName: "ai_assistant_message_failed",
        source: "ai_quote_assistant",
        metadata: { locale, hasSession },
      });

      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          text: ERROR_MESSAGE[locale],
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setIsOpen((prev) => {
            const next = !prev;
            if (next) {
              void trackConversionEvent({ eventName: "ai_assistant_opened", source: "ai_quote_assistant" });
            }
            return next;
          });
        }}
        aria-label={isOpen ? "Close quote assistant" : "Open quote assistant"}
        aria-expanded={isOpen}
        aria-controls="ai-quote-assistant-panel"
        className="fixed bottom-24 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/18 bg-[#1D4ED8] text-white shadow-[0_18px_50px_rgba(29,78,216,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1948ca] md:bottom-8"
      >
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border border-white/40 bg-[#C9A94E]" />
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
          <path d="M8 10V9a4 4 0 1 1 8 0v1M7.5 16.5V13a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v3.5M6 14h1.5M16.5 14H18M9.5 18h5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
      </button>

      {isOpen ? (
        <aside
          id="ai-quote-assistant-panel"
          ref={assistantRef}
          role="dialog"
          aria-labelledby={dialogLabelId}
          aria-modal="true"
          className="fixed bottom-24 right-4 z-50 flex h-[28rem] w-[calc(100vw-2rem)] max-w-[22rem] flex-col overflow-hidden rounded border border-slate-300 bg-white shadow-xl md:bottom-20 md:right-6"
        >
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
            <p id={dialogLabelId} className="text-sm font-semibold text-slate-800">Quote Assistant</p>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setLocale("en")}
                aria-pressed={locale === "en"}
                className={`rounded px-2 py-1 text-xs ${locale === "en" ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700"}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale("es")}
                aria-pressed={locale === "es"}
                className={`rounded px-2 py-1 text-xs ${locale === "es" ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700"}`}
              >
                ES
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto bg-white px-3 py-3" role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded px-3 py-2 text-sm ${
                  message.role === "assistant" ? "bg-slate-100 text-slate-800" : "ml-auto bg-[#1D4ED8] text-white"
                }`}
              >
                {message.text}
              </div>
            ))}
            {isSending ? (
              <div className="flex items-center gap-1 px-1 py-2" aria-label="Assistant is typing">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
              </div>
            ) : null}
            <div ref={scrollAnchorRef} />
          </div>

          <form
            className="border-t border-slate-200 p-3"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
          >
            <textarea
              ref={inputRef}
              rows={2}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={INPUT_PLACEHOLDER[locale]}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="mt-2 w-full rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? SEND_LABEL[locale].busy : SEND_LABEL[locale].idle}
            </button>
          </form>
        </aside>
      ) : null}
    </>
  );
}
