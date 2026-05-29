import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ALL_ACHIEVEMENTS, getUserAchievements } from "@/lib/achievements";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  if (!username || typeof username !== "string") {
    return NextResponse.json({ error: "username required" }, { status: 400 });
  }

  const earned = await getUserAchievements(username.trim());

  return NextResponse.json({
    earned,
    all: ALL_ACHIEVEMENTS.map((a) => ({
      ...a,
      earned: earned.includes(a.id),
    })),
  });
}
