import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail, updateUserStatus } from "@/lib/auth";

// One-time helper endpoint to create a default approved user
// from env vars DEFAULT_HOST_EMAIL and DEFAULT_HOST_PASSWORD.
//
// This route is gated by the DEFAULT_HOST_SEED_ENABLED env var so it can be
// safely disabled in production once the user has been created.

export async function POST(_req: NextRequest) {
  if (process.env.DEFAULT_HOST_SEED_ENABLED !== "true") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const email = process.env.DEFAULT_HOST_EMAIL;
  const password = process.env.DEFAULT_HOST_PASSWORD;
  const name = process.env.DEFAULT_HOST_NAME ?? "Default Host";

  if (!email || !password) {
    return NextResponse.json(
      {
        error:
          "DEFAULT_HOST_EMAIL and DEFAULT_HOST_PASSWORD must be set when DEFAULT_HOST_SEED_ENABLED=true"
      },
      { status: 500 }
    );
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    if (existing.status !== "approved" || existing.role !== "host") {
      await updateUserStatus(existing._id.toString(), "approved", "host");
      return NextResponse.json(
        { message: "Default host user approved and ready to login" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Default host user already exists" },
      { status: 200 }
    );
  }

  const user = await createUser({
    name,
    email,
    password,
    role: "host",
    status: "approved"
  });

  return NextResponse.json(
    {
      message: "Default host user created",
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        status: user.status
      }
    },
    { status: 201 }
  );
}

