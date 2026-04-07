import { NextRequest, NextResponse } from "next/server";
import { listUsers, updateUserStatus } from "@/lib/auth";
import { verifyAuthToken } from "@/lib/jwt";

const AUTH_COOKIE_NAME = "auth_token";

function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyAuthToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await listUsers();
  return NextResponse.json({
    users: users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt ?? null
    }))
  });
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, action } = await req.json();

  if (!userId || !action) {
    return NextResponse.json(
      { error: "userId and action are required" },
      { status: 400 }
    );
  }

  if (action === "approve") {
    await updateUserStatus(userId, "approved", "approved");
  } else if (action === "reject") {
    await updateUserStatus(userId, "rejected");
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

