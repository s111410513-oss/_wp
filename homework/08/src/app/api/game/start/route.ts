import { NextRequest, NextResponse } from "next/server";
import { games } from "@/lib/game-store";

const NORMAL_DIFFICULTIES: Record<string, number> = {
  easy: 100,
  hard: 500,
  extreme: 2000,
};

const CHALLENGE_CONFIG: Record<string, { base: number; bonus: number }> = {
  easy: { base: 20, bonus: 1 },
  hard: { base: 10, bonus: 2 },
  extreme: { base: 5, bonus: 3 },
};

export async function POST(req: NextRequest) {
  const { playerName, mode = "normal", difficulty = "easy" } = await req.json();

  if (!playerName || typeof playerName !== "string" || playerName.trim().length === 0) {
    return NextResponse.json({ error: "playerName is required" }, { status: 400 });
  }

  const gameId = crypto.randomUUID();

  if (mode === "challenge") {
    const config = CHALLENGE_CONFIG[difficulty];
    if (!config) {
      return NextResponse.json({ error: "Invalid difficulty. Choose: easy, hard, extreme" }, { status: 400 });
    }

    const initialMax = 1000;
    const number = Math.floor(Math.random() * initialMax) + 1;

    games.set(gameId, {
      mode: "challenge",
      number,
      max: initialMax,
      level: 1,
      attemptsLeft: config.base,
      maxAttempts: config.base,
      baseAttempts: config.base,
      bonusPerLevel: config.bonus,
      difficulty,
      totalAttempts: 0,
    });

    return NextResponse.json({
      gameId,
      mode: "challenge",
      level: 1,
      max: initialMax,
      attemptsLeft: config.base,
      maxAttempts: config.base,
      difficulty,
      message: `Level 1: Guess a number between 1 and ${initialMax}. You have ${config.base} attempt(s).`,
    });
  }

  const max = NORMAL_DIFFICULTIES[difficulty];
  if (!max) {
    return NextResponse.json({ error: "Invalid difficulty. Choose: easy, hard, extreme" }, { status: 400 });
  }

  const number = Math.floor(Math.random() * max) + 1;

  games.set(gameId, {
    mode: "normal",
    number,
    max,
    attempts: 0,
    difficulty,
  });

  return NextResponse.json({
    gameId,
    mode: "normal",
    max,
    difficulty,
    message: `[${difficulty.toUpperCase()}] Guess a number between 1 and ${max}, ${playerName}!`,
  });
}
