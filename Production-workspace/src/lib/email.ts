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

export async function sendResendEmail(options: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return {
      ok: false,
      error: "Resend is not configured.",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.contentBase64,
      })),
    }),
  });

  if (!response.ok) {
    return {
      ok: false,
      error: await response.text(),
    };
  }

  return { ok: true };
}
