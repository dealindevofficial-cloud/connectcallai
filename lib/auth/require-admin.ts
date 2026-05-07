import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionJwt } from "@/lib/auth/session";

export async function requireAdminSession(
  request: NextRequest
): Promise<NextResponse | null> {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token || !(await verifySessionJwt(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
