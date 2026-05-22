const BONUS: Record<string, number> = {
  easy: 8,
  hard: 2,
  extreme: 0,
};

export function getRange(level: number): number {
  return 1000 + 255 * (level - 1);
}

export function getMaxAttempts(difficulty: string, level: number): number {
  const range = getRange(level);
  const t = Math.ceil(Math.log2(range));
  return t + (BONUS[difficulty] ?? 0);
}
