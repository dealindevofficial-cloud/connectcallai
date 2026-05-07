import bcrypt from "bcryptjs";
import { timingSafeEqual } from "node:crypto";

/**
 * Verifies the submitted password against `ADMIN_PASSWORD_HASH` (bcrypt) or
 * plain `ADMIN_PASSWORD` (development-only fallback). At least one must be set.
 */
export async function verifyAdminPassword(plain: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const plainSecret = process.env.ADMIN_PASSWORD?.trim();

  if (hash) {
    try {
      return await bcrypt.compare(plain, hash);
    } catch {
      return false;
    }
  }

  if (plainSecret) {
    const a = Buffer.from(plain, "utf8");
    const b = Buffer.from(plainSecret, "utf8");
    if (a.length !== b.length) {
      return false;
    }
    return timingSafeEqual(a, b);
  }

  return false;
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_PASSWORD_HASH?.trim() || process.env.ADMIN_PASSWORD?.trim()
  );
}
