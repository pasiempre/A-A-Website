"use client";

type Message = {
  id: string;
  message_text: string;
  created_at: string;
};

type EmployeeMessageThreadProps = {
  messages: Message[];
  messageText: string;
  onMessageTextChange: (value: string) => void;
  onSend: () => void;
};

export function EmployeeMessageThread({
  messages,
  messageText,
  onMessageTextChange,
  onSend,
}: EmployeeMessageThreadProps) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Mensajes ({messages.length})
      </p>

      {messages.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {messages.slice(0, 5).map((message) => (
            <li
              key={message.id}
              className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600"
            >
              <span className="text-[10px] text-slate-400">
                {new Date(message.created_at).toLocaleString("es-MX", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <p className="mt-0.5">{message.message_text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-slate-400">No hay mensajes.</p>
      )}

      <div className="mt-2 flex gap-2">
        <input
          className="min-h-[44px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Mensaje para administración"
          value={messageText}
          onChange={(e) => onMessageTextChange(e.target.value)}
        />
        <button
          type="button"
          className="min-h-[44px] rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100"
          onClick={onSend}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
