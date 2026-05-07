import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";

export { ADMIN_SESSION_COOKIE };

const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Add it to your environment (for example .env.local)."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionJwt(): Promise<string> {
  const key = getSecretKey();
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SEC}s`)
    .sign(key);
}

export async function verifySessionJwt(token: string): Promise<boolean> {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET?.trim();
    if (!secret) {
      return false;
    }
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export function sessionCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  };
}

export function applySessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(ADMIN_SESSION_COOKIE, token, sessionCookieOptions());
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
}
