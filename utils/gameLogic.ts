// Import emoji utilities
import { getEmojiSetForLevel } from './emojiUtils';

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
  difficulty: number; // Numeric difficulty value (level * randomness factor)
  isCompleted: boolean;
  moves: number;
  bestMoves?: number;
  timeSpent?: number;
  bestTime?: number;
  cards: Card[][];
  board?: number[][]; // Integer mapping of emojis for completed levels
}

// Optimized storage for completed levels
export interface CompletedLevel {
  id: number;
  gridSize: { rows: number; cols: number };
  difficulty: number; // Numeric difficulty value
  moves: number;
  timeSpent: number;
  completedAt: number; // timestamp
  board: number[][]; // 2D array of integers mapping to emoji positions
}

export interface GameState {
  currentLevel: number;
  levels: Level[];
  selectedCards: Card[];
  moves: number;
  startTime: number | null;
}

// Dynamic level configuration generator
// Calculate numeric difficulty based on level randomness
function calculateDifficulty(levelNumber: number, cards: Card[][], gridSize: { rows: number; cols: number }): number {
  // Calculate randomness factor (0-1) based on how scattered matching pairs are
  const { rows, cols } = gridSize;
  let totalDistance = 0;
  const pairs: { [emoji: string]: { row: number; col: number }[] } = {};
  
  // Group cards by emoji
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const emoji = cards[row][col].emoji;
      if (!pairs[emoji]) {
        pairs[emoji] = [];
      }
      pairs[emoji].push({ row, col });
    }
  }
  
  // Calculate average distance between pairs
  const pairEmojis = Object.keys(pairs);
  for (const emoji of pairEmojis) {
    const positions = pairs[emoji];
    if (positions.length === 2) {
      // Manhattan distance between the two cards
      const distance = Math.abs(positions[0].row - positions[1].row) + Math.abs(positions[0].col - positions[1].col);
      const maxPossibleDistance = (rows - 1) + (cols - 1); // Maximum manhattan distance in grid
      const normalizedDistance = distance / maxPossibleDistance;
      totalDistance += normalizedDistance;
    }
  }
  
  const randomnessFactor = (totalDistance / pairEmojis.length / 10) + 0.9;
  const clampedRandomness = Math.max(0.9, Math.min(1.0, randomnessFactor)); // Ensure 0.1-1.0 range

  // console.log(`Level ${levelNumber} - Avg Pair Distance: ${(totalDistance / pairEmojis.length).toFixed(2)}, Randomness Factor: ${randomnessFactor.toFixed(2)}, Clamped: ${clampedRandomness.toFixed(2)}`);
  
  // Multiply by level number for final difficulty
  return parseFloat((levelNumber * clampedRandomness).toFixed(2));
}

export function generateLevelConfig(levelNumber: number) {
  // Define difficulty progression thresholds
  let difficulty: string = 'unknown';
  // let maxGridSize: number;


  let rows = Math.floor((levelNumber - 1) / 2) + 2;
  let cols = Math.ceil((levelNumber - 1) / 2) + 2;
  // if (levelNumber <= 3) {
  //   difficulty = 'easy';
  //   maxGridSize = 3; // Up to 3x3
  // } else if (levelNumber <= 6) {
  //   difficulty = 'medium';
  //   maxGridSize = 4; // Up to 4x4
  // } else if (levelNumber <= 10) {
  //   difficulty = 'hard';
  //   maxGridSize = 5; // Up to 5x5
  // } else if (levelNumber <= 15) {
  //   difficulty = 'expert';
  //   maxGridSize = 6; // Up to 6x6
  // } else if (levelNumber <= 25) {
  //   difficulty = 'master';
  //   maxGridSize = 7; // Up to 7x7
  // } else {
  //   difficulty = 'legendary';
  //   maxGridSize = 8; // Up to 8x8
  // }

  // // Generate grid dimensions based on level progression
  // let rows: number, cols: number;
  
  // if (levelNumber === 1) {
  //   rows = 2; cols = 2; // Start small
  // } else if (levelNumber === 2) {
  //   rows = 2; cols = 3; // Introduce rectangular grids
  // } else if (levelNumber === 3) {
  //   rows = 3; cols = 2; // Flip dimensions
  // } else {
  //   // For levels 4+, use a progressive algorithm
  //   const progressionStep = Math.floor((levelNumber - 4) / 3) + 2; // Increases every 3 levels
  //   const baseSize = Math.min(2 + progressionStep, maxGridSize);
    
  //   // Alternate between square and rectangular grids
  //   if ((levelNumber - 4) % 3 === 0) {
  //     // Square grid
  //     rows = baseSize;
  //     cols = baseSize;
  //   } else if ((levelNumber - 4) % 3 === 1) {
  //     // Rectangular grid - wider
  //     rows = baseSize;
  //     cols = Math.min(baseSize + 1, maxGridSize);
  //   } else {
  //     // Rectangular grid - taller
  //     rows = Math.min(baseSize + 1, maxGridSize);
  //     cols = baseSize;
  //   }
  // }

  // Calculate pairs (ensuring even number of cards)
  const totalCards = rows * cols;

  // Ensure we have an even number of cards
  if (totalCards % 2 !== 0) {
    // If odd, reduce by 1 to make even
    if (cols > rows) {
      rows++;
    } else {
      cols++;
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
  
  const { rows, cols, pairs } = config;
  
  // Use emoji-mart with level-based category cycling for variety
  let selectedEmojis: string[];
  try {
    selectedEmojis = getEmojiSetForLevel(levelNumber, pairs);
  } catch (error) {
    console.warn('Failed to get emojis from emoji-mart, using fallback:', error);
    // Use a default emoji set for fallback
    const fallbackEmojis = ['😀', '😂', '🥰', '😎', '🤔', '🎉', '🔥', '💯', '🚀', '⭐', '🎨', '🎵', '🍕', '🎮', '📱'];
    selectedEmojis = getRandomEmojis(fallbackEmojis, pairs);
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

  // Calculate numeric difficulty based on card layout
  const difficulty = calculateDifficulty(levelNumber, cards, { rows, cols });

  // console.log(`Generated Level ${levelNumber} with ${rows}x${cols} grid and difficulty ${difficulty}\n emojis: ${selectedEmojis.join(', ')}\ncards: ${JSON.stringify(cards, null, 2)}`);

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

// Create board mapping from level cards
export function createBoardFromLevel(level: Level): number[][] {
  const emojiToIndex = new Map<string, number>();
  let nextIndex = 0;
  
  // Build emoji mapping
  level.cards.flat().forEach(card => {
    if (!emojiToIndex.has(card.emoji)) {
      emojiToIndex.set(card.emoji, nextIndex++);
    }
  });
  
  // Create board with integer mappings
  return level.cards.map(row => 
    row.map(card => emojiToIndex.get(card.emoji)!)
  );
}

// Regenerate level cards from board and emoji set
export function regenerateLevelFromBoard(
  levelId: number, 
  gridSize: { rows: number; cols: number },
  board: number[][],
  difficulty?: number // Make optional since we can calculate it
): Level {
  const uniqueIndices = Array.from(new Set(board.flat()));
  const emojiCount = uniqueIndices.length;
  const emojiSet = getEmojiSetForLevel(levelId, emojiCount);
  
  // Create cards from board mapping
  const cards: Card[][] = board.map((row, rowIndex) =>
    row.map((emojiIndex, colIndex) => ({
      id: `${rowIndex}-${colIndex}`,
      row: rowIndex,
      col: colIndex,
      emoji: emojiSet[emojiIndex],
      isRevealed: true, // Show all cards for completed level view
      isMatched: true,  // Mark as matched for completed level view
    }))
  );

  // Calculate difficulty if not provided
  const calculatedDifficulty = difficulty ?? calculateDifficulty(levelId, cards, gridSize);

  return {
    id: levelId,
    gridSize,
    difficulty: calculatedDifficulty,
    isCompleted: true,
    moves: 0,
    cards,
    board
  };
}

// Legacy difficulty scale configuration (for backwards compatibility)
export const DIFFICULTY_SCALE = {
  MIN: 0.1,  // Minimum possible difficulty (level 1 with minimum randomness)
  MAX: 100,  // Maximum reasonable difficulty for display purposes (level 100 with max randomness)
} as const;

// Calculate level-specific difficulty range
export function getLevelDifficultyRange(levelNumber: number) {
  // For any level, randomness factor ranges from 0.9 to 1.0
  const minRandomness = 0.9;
  const maxRandomness = 1.0;
  
  return {
    MIN: levelNumber * minRandomness,
    MAX: levelNumber * maxRandomness,
  };
}

// Get difficulty color using gradient from green to yellow to red (level-relative)
export function getDifficultyColor(difficulty: number, levelNumber?: number): string {
  let MIN: number, MAX: number;
  
  if (levelNumber !== undefined) {
    // Use level-specific range
    const range = getLevelDifficultyRange(levelNumber);
    MIN = range.MIN;
    MAX = range.MAX;
  } else {
    // Fallback to global range for backwards compatibility
    MIN = DIFFICULTY_SCALE.MIN;
    MAX = DIFFICULTY_SCALE.MAX;
  }
  
  const normalizedDifficulty = Math.max(0, Math.min(1, (difficulty - MIN) / (MAX - MIN)));
  
  // Create gradient: green -> yellow -> red
  let r: number, g: number, b: number;
  
  if (normalizedDifficulty < 0.5) {
    // Green to Yellow (0.0 to 0.5)
    const t = normalizedDifficulty * 2; // 0 to 1
    r = Math.round(255 * t);
    g = 255;
    b = 0;
  } else {
    // Yellow to Red (0.5 to 1.0)
    const t = (normalizedDifficulty - 0.5) * 2; // 0 to 1
    r = 255;
    g = Math.round(255 * (1 - t));
    b = 0;
  }
  
  return `rgb(${r}, ${g}, ${b})`;
}

// Get difficulty position on scale (0.0 to 1.0) - level-relative
export function getDifficultyPosition(difficulty: number, levelNumber?: number): number {
  let MIN: number, MAX: number;
  
  if (levelNumber !== undefined) {
    // Use level-specific range
    const range = getLevelDifficultyRange(levelNumber);
    MIN = range.MIN;
    MAX = range.MAX;
  } else {
    // Fallback to global range for backwards compatibility
    MIN = DIFFICULTY_SCALE.MIN;
    MAX = DIFFICULTY_SCALE.MAX;
  }
  
  return Math.max(0, Math.min(1, (difficulty - MIN) / (MAX - MIN)));
}

// Get difficulty display name based on numeric difficulty (deprecated but kept for compatibility)
export function getDifficultyName(difficulty: number): string {
  if (difficulty <= 3) return 'Easy';
  if (difficulty <= 6) return 'Medium';
  if (difficulty <= 10) return 'Hard';
  if (difficulty <= 15) return 'Expert';
  return 'Legendary';
}
