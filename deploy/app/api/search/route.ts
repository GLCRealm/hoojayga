import { NextRequest, NextResponse } from "next/server";
import { searchTopics } from "@/lib/subjects";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }
  const results = searchTopics(q).slice(0, 50);
  return NextResponse.json({ results });
}

