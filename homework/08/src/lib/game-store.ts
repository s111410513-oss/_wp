export interface NormalGame {
  mode: "normal";
  number: number;
  max: number;
  attempts: number;
  difficulty: string;
}

export interface ChallengeGame {
  mode: "challenge";
  number: number;
  max: number;
  level: number;
  attemptsLeft: number;
  maxAttempts: number;
  baseAttempts: number;
  bonusPerLevel: number;
  difficulty: string;
  totalAttempts: number;
}

export type GameState = NormalGame | ChallengeGame;

export const games = new Map<string, GameState>();
