const STATUS_ANNOUNCER_EVENT = "aa-status-announcement";

type StatusAnnouncementDetail = {
  message: string;
};

export function announceStatus(message: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const text = message.trim();
  if (!text) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<StatusAnnouncementDetail>(STATUS_ANNOUNCER_EVENT, {
      detail: { message: text },
    }),
  );
}

export function getStatusAnnouncerEventName(): string {
  return STATUS_ANNOUNCER_EVENT;
}
