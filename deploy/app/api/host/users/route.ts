import { NextRequest, NextResponse } from "next/server";
import { deleteUserById, listUsers, updateUserStatus } from "@/lib/auth";
import { verifyAuthToken } from "@/lib/jwt";

const AUTH_COOKIE_NAME = "auth_token";

function requireHostOrAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyAuthToken(token);
  if (!payload) return null;

  if (payload.role !== "host" && payload.role !== "admin") {
    return null;
  }

  return payload;
}

export async function GET(req: NextRequest) {
  const actor = requireHostOrAdmin(req);
  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await listUsers();
  const normalUsers = users.filter((u) => u.role === "approved");

  return NextResponse.json({
    users: normalUsers.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      active: u.status === "approved",
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt ?? null
    }))
  });
}

export async function POST(req: NextRequest) {
  const actor = requireHostOrAdmin(req);
  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, action } = await req.json();

  if (!userId || !action) {
    return NextResponse.json(
      { error: "userId and action are required" },
      { status: 400 }
    );
  }

  const users = await listUsers();
  const targetUser = users.find((u) => u._id.toString() === userId);

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (targetUser.role !== "approved") {
    return NextResponse.json(
      { error: "Only normal users can be managed from host panel" },
      { status: 400 }
    );
  }

  if (actor.userId === userId && action === "remove") {
    return NextResponse.json(
      { error: "You cannot remove your own account" },
      { status: 400 }
    );
  }

  if (action === "approve") {
    await updateUserStatus(userId, "approved", "approved");
  } else if (action === "reject") {
    await updateUserStatus(userId, "rejected");
  } else if (action === "remove") {
    await deleteUserById(userId);
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
