/**
 * In-memory failed-login rate limiting by client IP.
 * Resets on successful login. Suitable for single-instance or best-effort on serverless.
 */

function windowMs(): number {
  const raw = process.env.ADMIN_LOGIN_RATE_WINDOW_MS;
  const n = raw != null && raw !== "" ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 900_000;
}

function maxFails(): number {
  const raw = process.env.ADMIN_LOGIN_MAX_ATTEMPTS_PER_WINDOW;
  const n = raw != null && raw !== "" ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 10;
}

type Bucket = { count: number; windowEnd: number };

const buckets = new Map<string, Bucket>();

function prune(ip: string, now: number): Bucket {
  let b = buckets.get(ip);
  if (!b || now >= b.windowEnd) {
    b = { count: 0, windowEnd: now + windowMs() };
    buckets.set(ip, b);
  }
  return b;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

export type LoginRateLimitState =
  | { limited: false }
  | { limited: true; retryAfterSec: number };

/** Call at the start of POST /login; blocks if this IP already exceeded failures in the window. */
export function checkLoginRateLimit(ip: string): LoginRateLimitState {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now >= b.windowEnd) {
    return { limited: false };
  }
  if (b.count >= maxFails()) {
    return {
      limited: true,
      retryAfterSec: Math.max(1, Math.ceil((b.windowEnd - now) / 1000)),
    };
  }
  return { limited: false };
}

/** Call after a failed password check; may push the IP over the limit for the rest of the window. */
export function recordLoginFailure(ip: string): LoginRateLimitState {
  const now = Date.now();
  const b = prune(ip, now);
  b.count += 1;
  if (b.count > maxFails()) {
    return {
      limited: true,
      retryAfterSec: Math.max(1, Math.ceil((b.windowEnd - now) / 1000)),
    };
  }
  return { limited: false };
}

/** Clears failure counts on successful login. */
export function clearLoginFailures(ip: string): void {
  buckets.delete(ip);
}
