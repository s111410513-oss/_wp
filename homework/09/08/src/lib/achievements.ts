import { prisma } from "./prisma";

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: "first_win", name: "初次勝利", desc: "贏得第一場遊戲", icon: "🎯" },
  { id: "speed_demon", name: "閃電快手", desc: "10 秒內猜中答案", icon: "⚡" },
  { id: "marathon", name: "馬拉松選手", desc: "闖關模式通過 5 關（目標 10 關）", icon: "🏃" },
  { id: "hint_master", name: "提示大師", desc: "不使用任何提示贏得遊戲", icon: "💡" },
  { id: "persistent", name: "堅持不懈", desc: "完成 10 場遊戲", icon: "💪" },
];

export async function getUserAchievements(username: string): Promise<string[]> {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return [];
  try {
    return JSON.parse(user.achievements) as string[];
  } catch {
    return [];
  }
}

export async function checkAchievements(
  username: string,
  mode: string,
  attempts: number,
  levelsCleared: number,
  timeTaken: number,
  hintsUsed: number,
  won: boolean,
): Promise<string[]> {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return [];

  const earned: Set<string> = new Set(parseAchievements(user.achievements));
  const newly: string[] = [];

  const totalGames = await prisma.score.count({ where: { playerName: username } });

  if (!earned.has("first_win") && won) {
    const winCount = await prisma.score.count({ where: { playerName: username, won: true } });
    if (winCount === 1) {
      earned.add("first_win");
      newly.push("first_win");
    }
  }

  if (!earned.has("speed_demon") && mode === "normal" && won && timeTaken <= 10) {
    earned.add("speed_demon");
    newly.push("speed_demon");
  }

  if (!earned.has("marathon") && mode === "challenge" && levelsCleared >= 5) {
    earned.add("marathon");
    newly.push("marathon");
  }

  if (!earned.has("hint_master") && won && hintsUsed === 0) {
    earned.add("hint_master");
    newly.push("hint_master");
  }

  if (!earned.has("persistent") && totalGames >= 10) {
    earned.add("persistent");
    newly.push("persistent");
  }

  if (newly.length > 0) {
    await prisma.user.update({
      where: { username },
      data: { achievements: JSON.stringify([...earned]) },
    });
  }

  return newly;
}

function parseAchievements(json: string): string[] {
  try {
    return JSON.parse(json) as string[];
  } catch {
    return [];
  }
}
