/**
 * Canonical site origin for URLs (no trailing slash).
 * Prefer NEXT_PUBLIC_SITE_URL; fall back to Vercel preview/production host when set.
 */
export function getSiteOrigin(): string | undefined {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/\/$/, "")}`;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL must be set in production.");
  }
  return undefined;
}
