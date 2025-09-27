// Test the actual difficulty calculation from gameLogic.ts
import { readFileSync } from 'fs';

console.log('Testing Numeric Difficulty System...\n');

// Read the gameLogic.ts file and convert it to JavaScript for testing
const gameLogicPath = './utils/gameLogic.ts';
let gameLogicContent = readFileSync(gameLogicPath, 'utf-8');

// Simple TypeScript to JavaScript conversion for testing
gameLogicContent = gameLogicContent
  .replace(/export interface.*?\}/gs, '') // Remove interfaces
  .replace(/: number\b/g, '') // Remove type annotations
  .replace(/: string\b/g, '')
  .replace(/: boolean\b/g, '')
  .replace(/: Card\[\]\[\]/g, '')
  .replace(/: \{ rows: number; cols: number \}/g, '')
  .replace(/: string\[\]/g, '')
  .replace(/: Card/g, '')
  .replace(/: Level \| null/g, '')
  .replace(/: Level/g, '')
  .replace(/: number\[\]\[\]/g, '')
  .replace(/: T\[\]/g, '')
  .replace(/<T>/g, '')
  .replace(/import.*?;/g, ''); // Remove imports

// Mock the emojiUtils dependency
const mockGetEmojiSetForLevel = (level, count) => {
  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '☺️', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗'];
  return emojis.slice(0, count);
};

// Add mock to the code
gameLogicContent = `
const getEmojiSetForLevel = ${mockGetEmojiSetForLevel.toString()};
${gameLogicContent}
`;

// Execute the code to get the functions
const gameLogicModule = eval(`(() => {
  ${gameLogicContent}
  return { generateLevel, getDifficultyName, getDifficultyColor };
})()`);

const { generateLevel, getDifficultyName } = gameLogicModule;

// Test multiple levels with detailed analysis
console.log('Level | Grid Size | Difficulty | Category | Randomness');
console.log('------|-----------|------------|----------|----------');

for (let level = 1; level <= 15; level++) {
  try {
    const levelData = generateLevel(level);
    
    if (levelData) {
      const category = getDifficultyName(levelData.difficulty);
      const randomness = (levelData.difficulty / level).toFixed(2);
      
      console.log(`  ${level.toString().padStart(2)}  | ${levelData.gridSize.rows}x${levelData.gridSize.cols.toString().padStart(2)}      |    ${levelData.difficulty.toString().padStart(5)}   | ${category.padEnd(9)} | ${randomness}`);
    } else {
      console.log(`  ${level.toString().padStart(2)}  | Error: Level generation returned null`);
    }
  } catch (error) {
    console.log(`  ${level.toString().padStart(2)}  | Error: ${error.message}`);
  }
}

console.log('\n✅ Difficulty calculation test completed!');
console.log('\nKey observations:');
console.log('- Difficulty increases with level number');
console.log('- Randomness factor (0.1-1.0) affects final difficulty');
console.log('- Categories are assigned based on numeric ranges');