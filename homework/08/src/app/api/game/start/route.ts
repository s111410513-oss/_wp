import { NextRequest, NextResponse } from "next/server";
import { games } from "@/lib/game-store";
import { getRange, getMaxAttempts } from "@/lib/challenge";

const NORMAL_DIFFICULTIES: Record<string, number> = {
  easy: 100,
  hard: 500,
  extreme: 2000,
};

export async function POST(req: NextRequest) {
  const { playerName, mode = "normal", difficulty = "easy" } = await req.json();

  if (!playerName || typeof playerName !== "string" || playerName.trim().length === 0) {
    return NextResponse.json({ error: "playerName is required" }, { status: 400 });
  }

  const gameId = crypto.randomUUID();

  if (mode === "challenge") {
    if (!["easy", "hard", "extreme"].includes(difficulty)) {
      return NextResponse.json({ error: "Invalid difficulty. Choose: easy, hard, extreme" }, { status: 400 });
    }

    const level = 1;
    const max = getRange(level);
    const maxAttempts = getMaxAttempts(difficulty, level);
    const number = Math.floor(Math.random() * max) + 1;

    const now = Date.now();

    games.set(gameId, {
      mode: "challenge",
      number,
      max,
      level,
      attemptsLeft: maxAttempts,
      maxAttempts,
      difficulty,
      totalAttempts: 0,
      hintsLeft: 3,
      startedAt: now,
    });

    return NextResponse.json({
      gameId,
      mode: "challenge",
      level,
      max,
      attemptsLeft: maxAttempts,
      maxAttempts,
      difficulty,
      hintsLeft: 3,
      startedAt: now,
      message: `Level 1: Guess a number between 1 and ${max}. You have ${maxAttempts} attempt(s).`,
    });
  }

  const max = NORMAL_DIFFICULTIES[difficulty];
  if (!max) {
    return NextResponse.json({ error: "Invalid difficulty. Choose: easy, hard, extreme" }, { status: 400 });
  }

  const now = Date.now();
  const number = Math.floor(Math.random() * max) + 1;

  games.set(gameId, {
    mode: "normal",
    number,
    max,
    attempts: 0,
    difficulty,
    startedAt: now,
  });

  return NextResponse.json({
    gameId,
    mode: "normal",
    max,
    difficulty,
    startedAt: now,
    message: `[${difficulty.toUpperCase()}] Guess a number between 1 and ${max}, ${playerName}!`,
  });
}
