import { NextRequest, NextResponse } from "next/server";
import { games } from "@/lib/game-store";

const DIFFICULTIES: Record<string, number> = {
  easy: 100,
  hard: 500,
  extreme: 2000,
};

export async function POST(req: NextRequest) {
  const { playerName, difficulty = "easy" } = await req.json();

  if (!playerName || typeof playerName !== "string" || playerName.trim().length === 0) {
    return NextResponse.json({ error: "playerName is required" }, { status: 400 });
  }

  const max = DIFFICULTIES[difficulty];
  if (!max) {
    return NextResponse.json({ error: "Invalid difficulty. Choose: easy, hard, extreme" }, { status: 400 });
  }

  const gameId = crypto.randomUUID();
  const number = Math.floor(Math.random() * max) + 1;

  games.set(gameId, { number, max, attempts: 0, difficulty });

  return NextResponse.json({
    gameId,
    max,
    difficulty,
    message: `[${difficulty.toUpperCase()}] Guess a number between 1 and ${max}, ${playerName}!`,
  });
}
