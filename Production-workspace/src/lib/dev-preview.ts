export function isDevPreviewEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_DEV_PREVIEW_MODE === "true";
}
