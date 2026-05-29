import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "username required" }, { status: 400 });
  }

  const name = username.trim();

  const [
    totalGames,
    wins,
    bestNormal,
    bestChallenge,
    totalAttemptsAgg,
    totalTimeAgg,
  ] = await Promise.all([
    prisma.score.count({ where: { playerName: name } }),
    prisma.score.count({ where: { playerName: name, won: true } }),
    prisma.score.findFirst({
      where: { playerName: name, mode: "normal", won: true },
      orderBy: { attempts: "asc" },
      select: { attempts: true, difficulty: true },
    }),
    prisma.score.findFirst({
      where: { playerName: name, mode: "challenge" },
      orderBy: [{ levelsCleared: "desc" }, { attempts: "asc" }],
      select: { levelsCleared: true, attempts: true },
    }),
    prisma.score.aggregate({
      where: { playerName: name },
      _sum: { attempts: true },
    }),
    prisma.score.aggregate({
      where: { playerName: name },
      _sum: { timeTaken: true },
    }),
  ]);

  const totalAttempts = totalAttemptsAgg._sum.attempts ?? 0;
  const totalTime = totalTimeAgg._sum.timeTaken ?? 0;

  return NextResponse.json({
    totalGames,
    wins,
    winRate: totalGames > 0 ? wins / totalGames : 0,
    totalAttempts,
    avgAttempts: totalGames > 0 ? totalAttempts / totalGames : 0,
    bestNormal,
    bestChallenge,
    totalTime,
  });
}
