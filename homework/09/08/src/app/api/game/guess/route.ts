import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { games, type ChallengeGame } from "@/lib/game-store";
import { getRange, getMaxAttempts } from "@/lib/challenge";
import { checkAchievements } from "@/lib/achievements";

function getTemperature(dist: number): { label: string; color: string } {
  if (dist <= 5) return { label: "超燙", color: "#f5222d" };
  if (dist <= 20) return { label: "很接近", color: "#fa8c16" };
  if (dist <= 50) return { label: "普通", color: "#1677ff" };
  return { label: "很遠", color: "#888" };
}

async function checkUnlocks(mode: string, attempts: number, playerName?: string): Promise<string[]> {
  if (!playerName || typeof playerName !== "string") return [];
  const name = playerName.trim();
  if (!name || name === "King") return [];
  const user = await prisma.user.findUnique({ where: { username: name } });
  if (!user) return [];
  const unlocks: string[] = [];
  if (mode === "challenge" && !user.challengerUnlocked) {
    await prisma.user.update({ where: { username: name }, data: { challengerUnlocked: true } });
    unlocks.push("挑戰者");
  }
  if (attempts <= 1 && !user.godlyUnlocked) {
    await prisma.user.update({ where: { username: name }, data: { godlyUnlocked: true } });
    unlocks.push("神之一筆");
  }
  return unlocks;
}

export async function POST(req: NextRequest) {
  const { gameId, guess, playerName } = await req.json();

  if (!gameId || !games.has(gameId)) {
    return NextResponse.json({ error: "Invalid or expired gameId" }, { status: 400 });
  }

  const game = games.get(gameId)!;

  const limitMs = game.mode === "challenge" ? 300000 : 600000;
  const limitSec = game.mode === "challenge" ? 300 : 600;
  const elapsed = Date.now() - game.startedAt;
  if (elapsed > limitMs) {
    const timeTaken = limitSec;
    if (game.mode === "challenge") {
      const cg = game as ChallengeGame;
      const unlocks = await checkUnlocks("challenge", cg.totalAttempts, playerName);
      games.delete(gameId);

      let evos: string[] = [];
      if (playerName && typeof playerName === "string") {
        const nn = playerName.trim();
        const hu = 3 - cg.hintsLeft;
        await prisma.score.create({
          data: {
            playerName: nn,
            mode: "challenge",
            attempts: cg.totalAttempts,
            levelsCleared: cg.level - 1,
            difficulty: cg.difficulty,
            timeTaken,
            hintsUsed: hu,
            won: false,
          },
        });
        evos = await checkAchievements(nn, "challenge", cg.totalAttempts, cg.level - 1, timeTaken, hu, false);
      }

      return NextResponse.json({
        result: "gameover",
        mode: "challenge",
        levelsCleared: cg.level - 1,
        totalAttempts: cg.totalAttempts,
        hintsLeft: cg.hintsLeft,
        difficulty: cg.difficulty,
        message: "⏰ 時間到！遊戲已結束。",
        unlocks,
        achievements: evos,
      });
    }

    const unlocks = await checkUnlocks("normal", game.attempts, playerName);
    games.delete(gameId);

    let evos: string[] = [];
    if (playerName && typeof playerName === "string") {
      const nn = playerName.trim();
      await prisma.score.create({
        data: {
          playerName: nn,
          mode: "normal",
          attempts: game.attempts,
          difficulty: game.difficulty,
          timeTaken,
          hintsUsed: 0,
          won: false,
        },
      });
      evos = await checkAchievements(nn, "normal", game.attempts, 0, timeTaken, 0, false);
    }

    return NextResponse.json({
      result: "gameover",
      mode: "normal",
      attempts: game.attempts,
      difficulty: game.difficulty,
      message: "⏰ 時間到！遊戲已結束。",
      unlocks,
      achievements: evos,
    });
  }

  const n = Number(guess);
  if (!Number.isInteger(n) || n < 0 || n > game.max) {
    return NextResponse.json({ error: `Guess must be an integer between 0 and ${game.max}` }, { status: 400 });
  }

  if (game.mode === "challenge") {
    const cg = game as ChallengeGame;
    cg.attemptsLeft -= 1;
    cg.totalAttempts += 1;

    if (n === cg.number) {
      if (cg.level >= 10) {
        games.delete(gameId);
        const unlocks = await checkUnlocks("challenge", cg.totalAttempts, playerName);

        let evos: string[] = [];
        if (playerName && typeof playerName === "string") {
          const nn = playerName.trim();
          const tt = Math.floor((Date.now() - cg.startedAt) / 1000);
          const hu = 3 - cg.hintsLeft;
          await prisma.score.create({
            data: {
              playerName: nn,
              mode: "challenge",
              attempts: cg.totalAttempts,
              levelsCleared: cg.level,
              difficulty: cg.difficulty,
              timeTaken: tt,
              hintsUsed: hu,
              won: true,
            },
          });
          evos = await checkAchievements(nn, "challenge", cg.totalAttempts, cg.level, tt, hu, true);
        }

        return NextResponse.json({
          result: "victory",
          mode: "challenge",
          levelsCleared: cg.level,
          totalAttempts: cg.totalAttempts,
          hintsLeft: cg.hintsLeft,
          difficulty: cg.difficulty,
          message: `🎉 恭喜通過全部 10 關！總共用了 ${cg.totalAttempts} 次猜測。`,
          unlocks,
          achievements: evos,
        });
      }

      const nextLevel = cg.level + 1;
      const nextMax = getRange(nextLevel);
      const nextMaxAttempts = getMaxAttempts(cg.difficulty, nextLevel);
      const nextNumber = Math.floor(Math.random() * (nextMax + 1));

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
        message: `Level ${cg.level} cleared! Now Level ${nextLevel} (0-${nextMax}). You have ${nextMaxAttempts} attempt(s).`,
      });
    }

    if (cg.attemptsLeft <= 0) {
      games.delete(gameId);

      const unlocks = await checkUnlocks("challenge", cg.totalAttempts, playerName);

      let evos: string[] = [];
      if (playerName && typeof playerName === "string") {
        const nn = playerName.trim();
        const tt = Math.floor((Date.now() - cg.startedAt) / 1000);
        const hu = 3 - cg.hintsLeft;
        await prisma.score.create({
          data: {
            playerName: nn,
            mode: "challenge",
            attempts: cg.totalAttempts,
            levelsCleared: cg.level - 1,
            difficulty: cg.difficulty,
            timeTaken: tt,
            hintsUsed: hu,
            won: false,
          },
        });
        evos = await checkAchievements(nn, "challenge", cg.totalAttempts, cg.level - 1, tt, hu, false);
      }

      return NextResponse.json({
        result: "gameover",
        mode: "challenge",
        levelsCleared: cg.level - 1,
        totalAttempts: cg.totalAttempts,
        hintsLeft: cg.hintsLeft,
        message: `Game Over! You cleared ${cg.level - 1} level(s) with ${cg.totalAttempts} total guess(es).`,
        unlocks,
        achievements: evos,
      });
    }

    const dist = Math.abs(n - cg.number);
    const temp = getTemperature(dist);
    const dir = n < cg.number ? "大" : "小";
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
      distance: dist,
      message: `${temp.label}！要再${dir}一些 ${n} (0-${cg.max})　剩 ${cg.attemptsLeft} 次`,
    });
  }

  game.attempts += 1;

  if (n === game.number) {
    games.delete(gameId);

    const unlocks = await checkUnlocks("normal", game.attempts, playerName);

    let evos: string[] = [];
    if (playerName && typeof playerName === "string") {
      const nn = playerName.trim();
      const tt = Math.floor((Date.now() - game.startedAt) / 1000);
      await prisma.score.create({
        data: {
          playerName: nn,
          mode: "normal",
          attempts: game.attempts,
          difficulty: game.difficulty,
          timeTaken: tt,
          hintsUsed: 0,
          won: true,
        },
      });
      evos = await checkAchievements(nn, "normal", game.attempts, 0, tt, 0, true);
    }

    return NextResponse.json({
      result: "correct",
      mode: "normal",
      attempts: game.attempts,
      difficulty: game.difficulty,
      message: `Correct! You guessed it in ${game.attempts} attempt(s)!`,
      unlocks,
      achievements: evos,
    });
  }

  const dist = Math.abs(n - game.number);
  const temp = getTemperature(dist);
  const dir = n < game.number ? "大" : "小";
  return NextResponse.json({
    result: n < game.number ? "higher" : "lower",
    mode: "normal",
    attempts: game.attempts,
    difficulty: game.difficulty,
    temperatureLabel: temp.label,
    temperatureColor: temp.color,
    distance: dist,
    message: `${temp.label}！要再${dir}一些 ${n} (0-${game.max})　第 ${game.attempts} 次`,
  });
}
