import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { games } from "@/lib/game-store";

export async function POST(req: NextRequest) {
  const { gameId, guess, playerName } = await req.json();

  if (!gameId || !games.has(gameId)) {
    return NextResponse.json({ error: "Invalid or expired gameId" }, { status: 400 });
  }

  const n = Number(guess);
  if (!Number.isInteger(n) || n < 1 || n > 100) {
    return NextResponse.json({ error: "Guess must be an integer between 1 and 100" }, { status: 400 });
  }

  const game = games.get(gameId)!;
  game.attempts += 1;

  if (n === game.number) {
    games.delete(gameId);

    if (playerName && typeof playerName === "string") {
      await prisma.score.create({
        data: { playerName: playerName.trim(), attempts: game.attempts },
      });
    }

    return NextResponse.json({
      result: "correct",
      attempts: game.attempts,
      message: `Correct! You guessed it in ${game.attempts} attempt(s)!`,
    });
  }

  return NextResponse.json({
    result: n < game.number ? "higher" : "lower",
    attempts: game.attempts,
    message: n < game.number ? `Higher than ${n}` : `Lower than ${n}`,
  });
}
