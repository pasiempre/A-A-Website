import { COMPANY_EMAIL, COMPANY_NAME, COMPANY_PHONE } from "@/lib/company";

type QuoteEmailInput = {
  recipientName: string;
  quoteNumber: string;
  total: number;
  scopeDescription?: string | null;
  shareUrl: string;
  validUntil?: string | null;
};

export function buildQuoteEmailHtml(input: QuoteEmailInput) {
  const validUntil = input.validUntil ? new Date(input.validUntil).toLocaleDateString() : "Open";
  const total = `$${input.total.toFixed(2)}`;

  return `
    <div style="font-family: Arial, sans-serif; color: #0A1628; line-height: 1.6;">
      <h2 style="margin-bottom: 8px;">A&A Cleaning Quote</h2>
      <p>Hi ${input.recipientName},</p>
      <p>Your quote <strong>${input.quoteNumber}</strong> is ready.</p>
      <p><strong>Total:</strong> ${total}<br /><strong>Valid Until:</strong> ${validUntil}</p>
      ${input.scopeDescription ? `<p><strong>Scope:</strong> ${input.scopeDescription}</p>` : ""}
      <p>Review the full quote and respond online:</p>
      <p>
        <a href="${input.shareUrl}" style="display: inline-block; padding: 12px 18px; background: #0A1628; color: #ffffff; text-decoration: none; border-radius: 4px;">
          Review Quote
        </a>
      </p>
      <p>You can accept or decline directly from that page. The PDF version is attached for your records.</p>
      <p>Questions? Call ${COMPANY_PHONE} or reply to ${COMPANY_EMAIL}.</p>
      <p>Best,<br />${COMPANY_NAME}</p>
    </div>
  `;
}
