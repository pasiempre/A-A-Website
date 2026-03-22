/**
 * @deprecated Use `sendEmailResilient` from `@/lib/resilient-email` directly.
 *
 * This file is a backward-compatible wrapper that delegates to the resilient
 * email implementation. Existing consumers continue to work without changes.
 *
 * Migration guide:
 * 1. Replace: import { sendResendEmail } from "@/lib/email"
 *    With:    import { sendEmailResilient } from "@/lib/resilient-email"
 * 2. Update result handling: { ok: boolean } → { success: boolean }
 * 3. Add `tag` property for telemetry grouping
 *
 * This file will be removed once all consumers are migrated.
 */

import { sendEmailResilient } from "@/lib/resilient-email";

type Attachment = {
  filename: string;
  contentBase64: string;
};

type SendEmailOptions = {
  to: string[];
  subject: string;
  html: string;
  attachments?: Attachment[];
};

/**
 * @deprecated Use `sendEmailResilient` from `@/lib/resilient-email` instead.
 */
export async function sendResendEmail(
  options: SendEmailOptions,
): Promise<{ ok: boolean; error?: string }> {
  const result = await sendEmailResilient({
    to: options.to,
    subject: options.subject,
    html: options.html,
    attachments: options.attachments,
    tag: "legacy-email-wrapper",
  });

  return {
    ok: result.success,
    error: result.error ?? undefined,
  };
}
