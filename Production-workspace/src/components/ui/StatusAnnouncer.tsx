"use client";

import { useEffect, useState } from "react";

import { getStatusAnnouncerEventName } from "@/lib/status-announcer";

type StatusAnnouncementDetail = {
  message?: string;
};

export function StatusAnnouncer() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const eventName = getStatusAnnouncerEventName();

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<StatusAnnouncementDetail>;
      const nextMessage = customEvent.detail?.message?.trim() ?? "";
      if (!nextMessage) {
        return;
      }

      // Clear first so repeated messages are re-announced by assistive tech.
      setMessage("");
      window.setTimeout(() => setMessage(nextMessage), 0);
    };

    window.addEventListener(eventName, handler as EventListener);
    return () => window.removeEventListener(eventName, handler as EventListener);
  }, []);

  return (
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  );
}
