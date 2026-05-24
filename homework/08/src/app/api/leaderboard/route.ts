import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("mode") || "normal";
  const difficulty = req.nextUrl.searchParams.get("difficulty");

  const where: Record<string, string> = { mode };
  if (difficulty) where.difficulty = difficulty;

  if (mode === "challenge") {
    const scores = await prisma.score.findMany({
      where,
      distinct: ["playerName", "difficulty"],
      orderBy: [{ levelsCleared: "desc" }, { attempts: "asc" }],
      take: 50,
    });
    return NextResponse.json(scores);
  }

  const scores = await prisma.score.findMany({
    where,
    distinct: ["playerName", "difficulty"],
    orderBy: { attempts: "asc" },
    take: 50,
  });
  return NextResponse.json(scores);
}
