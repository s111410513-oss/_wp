import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { games, type ChallengeGame } from "@/lib/game-store";
import { getRange, getMaxAttempts } from "@/lib/challenge";

function getTemperature(dist: number): { label: string; color: string } {
  if (dist <= 5) return { label: "超燙", color: "#f5222d" };
  if (dist <= 20) return { label: "很接近", color: "#fa8c16" };
  if (dist <= 50) return { label: "普通", color: "#1677ff" };
  return { label: "很遠", color: "#888" };
}

export async function POST(req: NextRequest) {
  const { gameId, guess, playerName } = await req.json();

  if (!gameId || !games.has(gameId)) {
    return NextResponse.json({ error: "Invalid or expired gameId" }, { status: 400 });
  }

  const game = games.get(gameId)!;

  const elapsed = Date.now() - game.startedAt;
  if (elapsed > 600000) {
    games.delete(gameId);
    if (game.mode === "challenge") {
      const cg = game as ChallengeGame;
      return NextResponse.json({
        result: "gameover",
        mode: "challenge",
        levelsCleared: cg.level - 1,
        totalAttempts: cg.totalAttempts,
        hintsLeft: cg.hintsLeft,
        difficulty: cg.difficulty,
        message: "⏰ 時間到！遊戲已結束。",
      });
    }
    return NextResponse.json({
      result: "gameover",
      mode: "normal",
      attempts: game.attempts,
      difficulty: game.difficulty,
      message: "⏰ 時間到！遊戲已結束。",
    });
  }

  const n = Number(guess);
  if (!Number.isInteger(n) || n < 1 || n > game.max) {
    return NextResponse.json({ error: `Guess must be an integer between 1 and ${game.max}` }, { status: 400 });
  }

  if (game.mode === "challenge") {
    const cg = game as ChallengeGame;
    cg.attemptsLeft -= 1;
    cg.totalAttempts += 1;

    if (n === cg.number) {
      const nextLevel = cg.level + 1;
      const nextMax = getRange(nextLevel);
      const nextMaxAttempts = getMaxAttempts(cg.difficulty, nextLevel);
      const nextNumber = Math.floor(Math.random() * nextMax) + 1;

      games.set(gameId, {
        ...cg,
        number: nextNumber,
        max: nextMax,
        level: nextLevel,
        maxAttempts: nextMaxAttempts,
        attemptsLeft: nextMaxAttempts,
      });

      return NextResponse.json({
        result: "levelup",
        mode: "challenge",
        level: nextLevel,
        max: nextMax,
        attemptsLeft: nextMaxAttempts,
        maxAttempts: nextMaxAttempts,
        hintsLeft: cg.hintsLeft,
        totalAttempts: cg.totalAttempts,
        cleared: cg.level,
        message: `Level ${cg.level} cleared! Now Level ${nextLevel} (1-${nextMax}). You have ${nextMaxAttempts} attempt(s).`,
      });
    }

    if (cg.attemptsLeft <= 0) {
      games.delete(gameId);

      if (playerName && typeof playerName === "string") {
        await prisma.score.create({
          data: {
            playerName: playerName.trim(),
            mode: "challenge",
            attempts: cg.totalAttempts,
            levelsCleared: cg.level - 1,
            difficulty: cg.difficulty,
          },
        });
      }

      return NextResponse.json({
        result: "gameover",
        mode: "challenge",
        levelsCleared: cg.level - 1,
        totalAttempts: cg.totalAttempts,
        hintsLeft: cg.hintsLeft,
        message: `Game Over! You cleared ${cg.level - 1} level(s) with ${cg.totalAttempts} total guess(es).`,
      });
    }

    const dist = Math.abs(n - cg.number);
    const temp = getTemperature(dist);
    const dir = n < cg.number ? "↑" : "↓";
    return NextResponse.json({
      result: n < cg.number ? "higher" : "lower",
      mode: "challenge",
      level: cg.level,
      max: cg.max,
      attemptsLeft: cg.attemptsLeft,
      hintsLeft: cg.hintsLeft,
      totalAttempts: cg.totalAttempts,
      temperatureLabel: temp.label,
      temperatureColor: temp.color,
      message: `${temp.label} ${dir} (1-${cg.max})　剩 ${cg.attemptsLeft} 次`,
    });
  }

  game.attempts += 1;

  if (n === game.number) {
    games.delete(gameId);

    if (playerName && typeof playerName === "string") {
      await prisma.score.create({
        data: {
          playerName: playerName.trim(),
          mode: "normal",
          attempts: game.attempts,
          difficulty: game.difficulty,
        },
      });
    }

    return NextResponse.json({
      result: "correct",
      mode: "normal",
      attempts: game.attempts,
      difficulty: game.difficulty,
      message: `Correct! You guessed it in ${game.attempts} attempt(s)!`,
    });
  }

  const dist = Math.abs(n - game.number);
  const temp = getTemperature(dist);
  const dir = n < game.number ? "↑" : "↓";
  return NextResponse.json({
    result: n < game.number ? "higher" : "lower",
    mode: "normal",
    attempts: game.attempts,
    difficulty: game.difficulty,
    temperatureLabel: temp.label,
    temperatureColor: temp.color,
    message: `${temp.label} ${dir} (1-${game.max})　第 ${game.attempts} 次`,
  });
}
