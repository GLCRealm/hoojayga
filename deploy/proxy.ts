import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/jwt";

const AUTH_COOKIE_NAME = "auth_token";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/api/auth/"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) =>
    p.endsWith("/")
      ? pathname === p || pathname.startsWith(p)
      : pathname === p
  );
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    isPublicPath(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? verifyAuthToken(token) : null;

  if (!payload) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (payload.status !== "approved") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Not approved" }, { status: 403 });
    }
    const pendingUrl = req.nextUrl.clone();
    pendingUrl.pathname = "/pending-approval";
    return NextResponse.redirect(pendingUrl);
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (payload.role !== "admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const dashboardUrl = req.nextUrl.clone();
      dashboardUrl.pathname = "/dashboard";
      return NextResponse.redirect(dashboardUrl);
    }
  }

  if (pathname.startsWith("/host") || pathname.startsWith("/api/host")) {
    if (payload.role !== "host" && payload.role !== "admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const dashboardUrl = req.nextUrl.clone();
      dashboardUrl.pathname = "/dashboard";
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};