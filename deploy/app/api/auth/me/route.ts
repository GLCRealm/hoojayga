import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/jwt";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

const AUTH_COOKIE_NAME = "auth_token";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const payload = verifyAuthToken(token);
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const db = await getDb();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(payload.userId) });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json(
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
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

