import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";
import { verifySessionJwt } from "@/lib/auth/session";

function isPublicAdminPath(pathname: string): boolean {
  if (pathname === "/ccai-admin/login" || pathname.startsWith("/ccai-admin/login/")) {
    return true;
  }
  if (
    pathname === "/api/admin/auth/login" ||
    pathname.startsWith("/api/admin/auth/login/")
  ) {
    return true;
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token || !(await verifySessionJwt(token))) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/ccai-admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ccai-admin/:path*", "/api/admin/:path*"],
};
