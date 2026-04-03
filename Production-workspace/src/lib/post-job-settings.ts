import { createAdminClient } from "@/lib/supabase/admin";

type RawSettings = {
  review_url?: string | null;
  rating_request_delay_hours?: number;
  review_reminder_delay_hours?: number;
  payment_reminder_delay_hours?: number;
  low_rating_threshold?: number;
};

export type PostJobSettings = {
  reviewUrl: string;
  ratingRequestDelayHours: number;
  reviewReminderDelayHours: number;
  paymentReminderDelayHours: number;
  lowRatingThreshold: number;
};

const DEFAULTS: PostJobSettings = {
  reviewUrl:
    process.env.GOOGLE_REVIEW_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://example.com",
  ratingRequestDelayHours: 24,
  reviewReminderDelayHours: 48,
  paymentReminderDelayHours: 72,
  lowRatingThreshold: 3,
};

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, Math.round(parsed)));
}

function normalize(raw: RawSettings | null | undefined): PostJobSettings {
  const reviewUrl = raw?.review_url?.trim();

  return {
    reviewUrl: reviewUrl || DEFAULTS.reviewUrl,
    ratingRequestDelayHours: clampInt(raw?.rating_request_delay_hours, 1, 168, DEFAULTS.ratingRequestDelayHours),
    reviewReminderDelayHours: clampInt(raw?.review_reminder_delay_hours, 1, 336, DEFAULTS.reviewReminderDelayHours),
    paymentReminderDelayHours: clampInt(raw?.payment_reminder_delay_hours, 1, 336, DEFAULTS.paymentReminderDelayHours),
    lowRatingThreshold: clampInt(raw?.low_rating_threshold, 2, 5, DEFAULTS.lowRatingThreshold),
  };
}

export async function getPostJobSettings(): Promise<PostJobSettings> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("automation_settings")
    .select("value")
    .eq("key", "post_job")
    .maybeSingle();

  const raw = (data?.value ?? null) as RawSettings | null;
  return normalize(raw);
}

export function normalizePostJobSettingsInput(raw: RawSettings): RawSettings {
  const settings = normalize(raw);

  return {
    review_url: settings.reviewUrl,
    rating_request_delay_hours: settings.ratingRequestDelayHours,
    review_reminder_delay_hours: settings.reviewReminderDelayHours,
    payment_reminder_delay_hours: settings.paymentReminderDelayHours,
    low_rating_threshold: settings.lowRatingThreshold,
  };
}
