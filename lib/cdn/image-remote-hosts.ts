/**
 * Hostnames allowed for `next/image` when loading arbitrary HTTPS URLs from markdown/CMS.
 * Must stay in sync with `remotePatterns` in `next.config.ts` (same env var).
 */
export function parseImageRemoteHostsFromEnv(): string[] {
  const raw = process.env.NEXT_PUBLIC_IMAGE_REMOTE_HOSTS;
  if (typeof raw === "string" && raw.trim().length > 0) {
    return raw
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);
  }
  return ["res.cloudinary.com", "media.istockphoto.com"];
}
