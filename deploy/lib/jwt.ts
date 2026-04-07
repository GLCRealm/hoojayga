import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthTokenPayload {
  userId: string;
  role: "admin" | "host" | "approved";
  status: "pending" | "approved" | "rejected";
}

export function signAuthToken(payload: AuthTokenPayload): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET env var is not set");
  }
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d"
  });
}

export function verifyAuthToken(
  token: string
): AuthTokenPayload | null {
  try {
    if (!JWT_SECRET) {
      return null;
    }
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
}

