// Import emoji utilities
import { EMOJI_SETS, getEmojiSetForLevel } from './emojiUtils';

// Game Types and Interfaces
export interface Card {
  id: string;
  row: number;
  col: number;
  emoji: string;
  isRevealed: boolean;
  isMatched: boolean;
}

export interface Level {
  id: number;
  gridSize: { rows: number; cols: number };
  difficulty: string;
  isCompleted: boolean;
  moves: number;
  bestMoves?: number;
  timeSpent?: number;
  bestTime?: number;
  cards: Card[][];
}

export interface GameState {
  currentLevel: number;
  levels: Level[];
  selectedCards: Card[];
  moves: number;
  startTime: number | null;
}

// Dynamic level configuration generator
export function generateLevelConfig(levelNumber: number) {
  // Define difficulty progression thresholds
  let difficulty: string;
  let maxGridSize: number;
  
  if (levelNumber <= 3) {
    difficulty = 'easy';
    maxGridSize = 3; // Up to 3x3
  } else if (levelNumber <= 6) {
    difficulty = 'medium';
    maxGridSize = 4; // Up to 4x4
  } else if (levelNumber <= 10) {
    difficulty = 'hard';
    maxGridSize = 5; // Up to 5x5
  } else if (levelNumber <= 15) {
    difficulty = 'expert';
    maxGridSize = 6; // Up to 6x6
  } else if (levelNumber <= 25) {
    difficulty = 'master';
    maxGridSize = 7; // Up to 7x7
  } else {
    difficulty = 'legendary';
    maxGridSize = 8; // Up to 8x8
  }

  // Generate grid dimensions based on level progression
  let rows: number, cols: number;
  
  if (levelNumber === 1) {
    rows = 2; cols = 2; // Start small
  } else if (levelNumber === 2) {
    rows = 2; cols = 3; // Introduce rectangular grids
  } else if (levelNumber === 3) {
    rows = 3; cols = 2; // Flip dimensions
  } else {
    // For levels 4+, use a progressive algorithm
    const progressionStep = Math.floor((levelNumber - 4) / 3) + 2; // Increases every 3 levels
    const baseSize = Math.min(2 + progressionStep, maxGridSize);
    
    // Alternate between square and rectangular grids
    if ((levelNumber - 4) % 3 === 0) {
      // Square grid
      rows = baseSize;
      cols = baseSize;
    } else if ((levelNumber - 4) % 3 === 1) {
      // Rectangular grid - wider
      rows = baseSize;
      cols = Math.min(baseSize + 1, maxGridSize);
    } else {
      // Rectangular grid - taller
      rows = Math.min(baseSize + 1, maxGridSize);
      cols = baseSize;
    }
  }

  // Calculate pairs (ensuring even number of cards)
  const totalCards = rows * cols;

  // Ensure we have an even number of cards
  if (totalCards % 2 !== 0) {
    // If odd, reduce by 1 to make even
    if (cols > rows) {
      cols--;
    } else {
      rows--;
    }
  }

  return {
    level: levelNumber,
    rows,
    cols,
    difficulty,
    pairs: (rows * cols) / 2
  };
}

// Helper function to get the maximum theoretical level
// In practice, levels are infinite but this helps with UI
export function getMaxAvailableLevel(): number {
  // Return a practical maximum for UI purposes
  // In reality, levels can go indefinitely
  return 999;
}

// Generate a new level
export function generateLevel(levelNumber: number): Level | null {
  const config = generateLevelConfig(levelNumber);
  
  const { rows, cols, difficulty, pairs } = config;
  
  // Use emoji-mart with level-based category cycling for variety
  let selectedEmojis: string[];
  try {
    selectedEmojis = getEmojiSetForLevel(levelNumber, pairs);
  } catch (error) {
    console.warn('Failed to get emojis from emoji-mart, using fallback:', error);
    const emojiSet = EMOJI_SETS[difficulty as keyof typeof EMOJI_SETS];
    selectedEmojis = getRandomEmojis(emojiSet, pairs);
  }
  
  // Create pairs of cards
  const cardValues: string[] = [];
  selectedEmojis.forEach(emoji => {
    cardValues.push(emoji, emoji); // Add each emoji twice for pairs
  });
  
  // Shuffle the card values
  const shuffledValues = shuffleArray(cardValues);
  
  // Create 2D grid of cards
  const cards: Card[][] = [];
  let valueIndex = 0;
  
  for (let row = 0; row < rows; row++) {
    cards[row] = [];
    for (let col = 0; col < cols; col++) {
      cards[row][col] = {
        id: `${row}-${col}`,
        row,
        col,
        emoji: shuffledValues[valueIndex],
        isRevealed: false,
        isMatched: false,
      };
      valueIndex++;
    }
  }

  return {
    id: levelNumber,
    gridSize: { rows, cols },
    difficulty,
    isCompleted: false,
    moves: 0,
    cards,
  };
}

// Utility functions
function getRandomEmojis(emojiSet: string[], count: number): string[] {
  const shuffled = shuffleArray([...emojiSet]);
  return shuffled.slice(0, count);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get difficulty color
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return '#34c759';
    case 'medium': return '#ff9500';
    case 'hard': return '#ff3b30';
    case 'expert': return '#5856d6';
    default: return '#007AFF';
  }
}

// Get difficulty display name
export function getDifficultyName(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'Easy';
    case 'medium': return 'Medium';
    case 'hard': return 'Hard';
    case 'expert': return 'Expert';
    default: return 'Unknown';
  }
}
