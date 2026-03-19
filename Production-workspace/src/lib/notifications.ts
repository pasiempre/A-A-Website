import type { SupabaseClient } from "@supabase/supabase-js";

type SmsResult = {
  sent: boolean;
  sid?: string;
  error?: string;
};

export type NotificationPreferences = {
  quiet_hours_start: string;
  quiet_hours_end: string;
  batch_job_notifications: boolean;
  sms_enabled: boolean;
  email_enabled: boolean;
  notification_summary_time: string;
  timezone: string;
};

type QuietHoursDispatchResult = {
  sent: boolean;
  queued: boolean;
  sid?: string;
  error?: string;
  scheduledFor?: string;
};

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  quiet_hours_start: "21:00",
  quiet_hours_end: "07:00",
  batch_job_notifications: true,
  sms_enabled: true,
  email_enabled: false,
  notification_summary_time: "06:00",
  timezone: "America/Chicago",
};

function parseClockToMinutes(value: string) {
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return 0;
  }

  return hour * 60 + minute;
}

function getTimePartsByTimezone(now: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  }).formatToParts(now);

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

function isWithinQuietHours(now: Date, preferences: NotificationPreferences) {
  const nowMinutes = getTimePartsByTimezone(now, preferences.timezone);
  const startMinutes = parseClockToMinutes(preferences.quiet_hours_start);
  const endMinutes = parseClockToMinutes(preferences.quiet_hours_end);

  if (startMinutes === endMinutes) {
    return false;
  }

  if (startMinutes < endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  }

  return nowMinutes >= startMinutes || nowMinutes < endMinutes;
}

function getNextAllowedTime(now: Date, preferences: NotificationPreferences) {
  if (!isWithinQuietHours(now, preferences)) {
    return now;
  }

  let candidate = new Date(now.getTime());
  for (let minute = 0; minute < 24 * 60; minute += 1) {
    candidate = new Date(candidate.getTime() + 60 * 1000);
    if (!isWithinQuietHours(candidate, preferences)) {
      return candidate;
    }
  }

  return new Date(now.getTime() + 60 * 60 * 1000);
}

export function normalizeNotificationPreferences(
  rawPreferences: Partial<NotificationPreferences> | null | undefined,
): NotificationPreferences {
  return {
    ...DEFAULT_NOTIFICATION_PREFERENCES,
    ...(rawPreferences ?? {}),
  };
}

export async function sendSms(to: string, body: string): Promise<SmsResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return {
      sent: false,
      error: "Twilio environment variables are not configured.",
    };
  }

  const payload = new URLSearchParams({
    To: to,
    From: fromNumber,
    Body: body,
  });

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      sent: false,
      error: errorText || `Twilio SMS request failed with status ${response.status}.`,
    };
  }

  const data = (await response.json()) as { sid?: string };
  return {
    sent: true,
    sid: data.sid,
  };
}

export async function dispatchSmsWithQuietHours(options: {
  supabase: SupabaseClient;
  to: string;
  body: string;
  profileId?: string | null;
  preferences?: Partial<NotificationPreferences> | null;
  queuedReason?: string;
  context?: Record<string, unknown>;
}): Promise<QuietHoursDispatchResult> {
  const preferences = normalizeNotificationPreferences(options.preferences);

  if (!preferences.sms_enabled) {
    return {
      sent: false,
      queued: false,
      error: "SMS disabled by notification preferences.",
    };
  }

  const now = new Date();
  if (isWithinQuietHours(now, preferences)) {
    const nextAllowedTime = getNextAllowedTime(now, preferences);
    const { error } = await options.supabase.from("notification_dispatch_queue").insert({
      profile_id: options.profileId ?? null,
      to_phone: options.to,
      body: options.body,
      send_after: nextAllowedTime.toISOString(),
      status: "queued",
      queued_reason: options.queuedReason ?? "quiet_hours",
      context: options.context ?? {},
    });

    if (error) {
      return {
        sent: false,
        queued: false,
        error: error.message,
      };
    }

    return {
      sent: false,
      queued: true,
      scheduledFor: nextAllowedTime.toISOString(),
    };
  }

  const sendResult = await sendSms(options.to, options.body);
  if (!sendResult.sent) {
    return {
      sent: false,
      queued: false,
      error: sendResult.error,
    };
  }

  return {
    sent: true,
    queued: false,
    sid: sendResult.sid,
  };
}
