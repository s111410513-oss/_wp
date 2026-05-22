import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { games } from "@/lib/game-store";

export async function POST(req: NextRequest) {
  const { gameId, guess, playerName } = await req.json();

  if (!gameId || !games.has(gameId)) {
    return NextResponse.json({ error: "Invalid or expired gameId" }, { status: 400 });
  }

  const game = games.get(gameId)!;

  const n = Number(guess);
  if (!Number.isInteger(n) || n < 1 || n > game.max) {
    return NextResponse.json({ error: `Guess must be an integer between 1 and ${game.max}` }, { status: 400 });
  }

  game.attempts += 1;

  if (n === game.number) {
    games.delete(gameId);

    if (playerName && typeof playerName === "string") {
      await prisma.score.create({
        data: { playerName: playerName.trim(), attempts: game.attempts, difficulty: game.difficulty },
      });
    }

    return NextResponse.json({
      result: "correct",
      attempts: game.attempts,
      difficulty: game.difficulty,
      message: `Correct! You guessed it in ${game.attempts} attempt(s)!`,
    });
  }

  return NextResponse.json({
    result: n < game.number ? "higher" : "lower",
    attempts: game.attempts,
    difficulty: game.difficulty,
    message: n < game.number ? `Higher than ${n} (1-${game.max})` : `Lower than ${n} (1-${game.max})`,
  });
}
