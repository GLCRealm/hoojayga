import bcrypt from "bcryptjs";
import { getDb } from "./db";
import { ObjectId } from "mongodb";

export type UserRole = "admin" | "host" | "approved";
export type UserStatus = "pending" | "approved" | "rejected";

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

let ensuredUserIndexes = false;

async function ensureUserIndexes() {
  if (ensuredUserIndexes) {
    return;
  }

  const db = await getDb();
  await db.collection<User>("users").createIndex({ email: 1 }, { unique: true });
  ensuredUserIndexes = true;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  const user = await db.collection<User>("users").findOne({ email });
  return user;
}

export async function createUser(params: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
}): Promise<User> {
  await ensureUserIndexes();
  const db = await getDb();

  const existing = await db
    .collection<User>("users")
    .findOne({ email: params.email });
  if (existing) {
    throw new Error("User with this email already exists");
  }

  const passwordHash = await hashPassword(params.password);
  const now = new Date();

  const doc = {
    name: params.name,
    email: params.email,
    passwordHash,
    role: params.role ?? "host",
    status: params.status ?? "pending",
    createdAt: now,
    updatedAt: now
  } as Omit<User, "_id">;

  const result = await db.collection<User>("users").insertOne(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    doc as any
  );

  return {
    _id: result.insertedId,
    ...doc
  };
}

export async function updateUserStatus(
  userId: string,
  status: UserStatus,
  role?: UserRole
): Promise<void> {
  const db = await getDb();
  const _id = new ObjectId(userId);

  const update: Partial<User> = {
    status,
    updatedAt: new Date()
  };

  if (role) {
    update.role = role;
  }

  await db.collection<User>("users").updateOne({ _id }, { $set: update });
}

export async function deleteUserById(userId: string): Promise<void> {
  const db = await getDb();
  const _id = new ObjectId(userId);
  await db.collection<User>("users").deleteOne({ _id });
}

export async function listUsers(): Promise<User[]> {
  const db = await getDb();
  const users = await db
    .collection<User>("users")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return users;
}

