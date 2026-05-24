export interface NormalGame {
  mode: "normal";
  number: number;
  max: number;
  attempts: number;
  difficulty: string;
  startedAt: number;
}

export interface ChallengeGame {
  mode: "challenge";
  number: number;
  max: number;
  level: number;
  attemptsLeft: number;
  maxAttempts: number;
  difficulty: string;
  totalAttempts: number;
  hintsLeft: number;
  startedAt: number;
}

export type GameState = NormalGame | ChallengeGame;

const globalForGames = globalThis as unknown as { games: Map<string, GameState> };
export const games = globalForGames.games ?? new Map<string, GameState>();
if (process.env.NODE_ENV !== "production") globalForGames.games = games;
