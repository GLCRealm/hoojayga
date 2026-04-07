import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "auth_token";

function clearAuthCookie(res: NextResponse) {
  res.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ message: "Logged out" }, { status: 200 });
  clearAuthCookie(res);
  return res;
}

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/login", req.url));
  clearAuthCookie(res);
  return res;
}

