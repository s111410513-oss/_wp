import { NextRequest, NextResponse } from "next/server";
import { games, type ChallengeGame } from "@/lib/game-store";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

export async function POST(req: NextRequest) {
  const { gameId, hintType } = await req.json();

  if (!gameId || !games.has(gameId)) {
    return NextResponse.json({ error: "Invalid or expired gameId" }, { status: 400 });
  }

  const game = games.get(gameId)!;
  if (game.mode !== "challenge") {
    return NextResponse.json({ error: "Hints are only available in challenge mode" }, { status: 400 });
  }

  const cg = game as ChallengeGame;

  if (cg.hintsLeft <= 0) {
    return NextResponse.json({ error: "No hints remaining" }, { status: 400 });
  }

  if (!["oddEven", "prime", "range"].includes(hintType)) {
    return NextResponse.json({ error: "Invalid hint type" }, { status: 400 });
  }

  cg.hintsLeft -= 1;

  let hint = "";
  if (hintType === "oddEven") {
    hint = cg.number % 2 === 0 ? "偶數 (Even)" : "奇數 (Odd)";
  } else if (hintType === "prime") {
    hint = isPrime(cg.number) ? "是質數 (Prime)" : "不是質數 (Not Prime)";
  } else if (hintType === "range") {
    const third = Math.ceil(cg.max / 3);
    if (cg.number <= third) hint = `1 ~ ${third}`;
    else if (cg.number <= third * 2) hint = `${third + 1} ~ ${third * 2}`;
    else hint = `${third * 2 + 1} ~ ${cg.max}`;
  }

  return NextResponse.json({
    hint,
    hintsLeft: cg.hintsLeft,
    message: `💡 ${hint} (剩餘 ${cg.hintsLeft} 次提示)`,
  });
}
