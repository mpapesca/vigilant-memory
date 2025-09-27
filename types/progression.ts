import { GameState } from '../utils/gameLogic';

export interface GameProgression {
  id: string;
  name: string;
  createdAt: number;
  lastPlayed: number;
  gameState: GameState;
}

export interface MultiProgressionData {
  progressions: GameProgression[];
  activeProgressionId: string | null;
}

export interface ProgressionSummary {
  id: string;
  name: string;
  currentLevel: number;
  completedLevels: number;
  lastPlayed: number;
  totalMoves: number;
  totalTime: number;
}