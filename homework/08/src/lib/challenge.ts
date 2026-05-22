export function getRange(level: number): number {
  return 1000 + 255 * (level - 1);
}

export function getMaxAttempts(difficulty: string, level: number): number {
  const range = getRange(level);
  const t = Math.ceil(Math.log2(range));
  if (difficulty === "easy") return t + Math.floor(level / 2) + 8;
  if (difficulty === "hard") return t + Math.floor(level / 3) + 2;
  return t + Math.floor(level / 5);
}
