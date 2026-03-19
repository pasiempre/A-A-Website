export function getSiteUrl(fallbackUrl?: string) {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  if (fallbackUrl) {
    const url = new URL(fallbackUrl);
    return `${url.protocol}//${url.host}`;
  }

  return "http://localhost:3000";
}
