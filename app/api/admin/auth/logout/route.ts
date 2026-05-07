import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { clearSessionCookie } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res);
  return res;
}
