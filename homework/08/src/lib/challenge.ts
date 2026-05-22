export function getRange(level: number): number {
  return 1000 + 255 * (level - 1);
}

export function getMaxAttempts(_difficulty: string, _level: number): number {
  return 3;
}
