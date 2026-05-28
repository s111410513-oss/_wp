import { NextRequest, NextResponse } from "next/server";
import { games, type ChallengeGame } from "@/lib/game-store";

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

  if (!["oddEven", "halfRange", "lastDigit"].includes(hintType)) {
    return NextResponse.json({ error: "Invalid hint type" }, { status: 400 });
  }

  cg.hintsLeft -= 1;

  let hint = "";
  if (hintType === "oddEven") {
    hint = cg.number % 2 === 0 ? "偶數 (Even)" : "奇數 (Odd)";
  } else if (hintType === "halfRange") {
    const mid = Math.floor(cg.max / 2);
    hint = cg.number <= mid ? `0 ~ ${mid}（下半部）` : `${mid + 1} ~ ${cg.max}（上半部）`;
  } else if (hintType === "lastDigit") {
    hint = `個位數字是 ${cg.number % 10}`;
  }

  return NextResponse.json({
    hint,
    hintsLeft: cg.hintsLeft,
    message: `💡 ${hint} (剩餘 ${cg.hintsLeft} 次提示)`,
  });
}
