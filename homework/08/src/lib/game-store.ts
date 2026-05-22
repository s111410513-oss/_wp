export interface GameState {
  number: number;
  max: number;
  attempts: number;
  difficulty: string;
}

export const games = new Map<string, GameState>();
