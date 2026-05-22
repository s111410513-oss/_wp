import { NextRequest, NextResponse } from "next/server";
import { games } from "@/lib/game-store";

export async function POST(req: NextRequest) {
  const { playerName } = await req.json();

  if (!playerName || typeof playerName !== "string" || playerName.trim().length === 0) {
    return NextResponse.json({ error: "playerName is required" }, { status: 400 });
  }

  const gameId = crypto.randomUUID();
  const number = Math.floor(Math.random() * 100) + 1;

  games.set(gameId, { number, attempts: 0 });

  return NextResponse.json({ gameId, message: `Guess a number between 1 and 100, ${playerName}!` });
}
