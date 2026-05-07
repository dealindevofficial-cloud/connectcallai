import { NextResponse } from "next/server";
import { z } from "zod";
import {
  checkLoginRateLimit,
  clearLoginFailures,
  getClientIp,
  recordLoginFailure,
} from "@/lib/auth/login-rate-limit";
import { isAdminAuthConfigured, verifyAdminPassword } from "@/lib/auth/password";
import { applySessionCookie, createSessionJwt } from "@/lib/auth/session";

export const runtime = "nodejs";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required."),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = checkLoginRateLimit(ip);
  if (limited.limited) {
    const res = NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429 }
    );
    res.headers.set("Retry-After", String(limited.retryAfterSec));
    return res;
  }

  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { error: "Admin login is not configured." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const ok = await verifyAdminPassword(parsed.data.password);
  if (!ok) {
    const st = recordLoginFailure(ip);
    if (st.limited) {
      const res = NextResponse.json(
        { error: "Too many login attempts. Try again later." },
        { status: 429 }
      );
      res.headers.set("Retry-After", String(st.retryAfterSec));
      return res;
    }
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  clearLoginFailures(ip);

  let token: string;
  try {
    token = await createSessionJwt();
  } catch {
    return NextResponse.json(
      { error: "Session configuration error." },
      { status: 500 }
    );
  }

  const res = NextResponse.json({ ok: true });
  applySessionCookie(res, token);
  return res;
}
