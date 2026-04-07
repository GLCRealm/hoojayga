import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("MONGODB_URI env var is not set");
}

if (!dbName) {
  throw new Error("MONGODB_DB env var is not set");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDb(): Promise<Db> {
  if (cachedDb && cachedClient) {
    return cachedDb;
  }

  const client = new MongoClient(uri!);
  await client.connect();
  const db = client.db(dbName!);

  cachedClient = client;
  cachedDb = db;

  return db;
}

