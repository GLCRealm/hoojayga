import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, verifyPassword } from "@/lib/auth";
import { signAuthToken } from "@/lib/jwt";

const AUTH_COOKIE_NAME = "auth_token";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (user.status !== "approved") {
      return NextResponse.json(
        { error: "Account not approved yet" },
        { status: 403 }
      );
    }

    const token = signAuthToken({
      userId: user._id.toString(),
      role: user.role,
      status: user.status
    });

    const res = NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        }
      },
      { status: 200 }
    );

    res.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
}

