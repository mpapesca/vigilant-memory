// Simple test script to verify difficulty calculation
import { generateLevel, getDifficultyName } from './utils/gameLogic.js';

console.log('Testing numeric difficulty calculation...\n');

// Generate a few levels and show their difficulties
for (let level = 1; level <= 5; level++) {
  try {
    const levelData = generateLevel(level);
    if (levelData) {
      const difficultyName = getDifficultyName(levelData.difficulty);
      console.log(`Level ${level}:`);
      console.log(`  Grid: ${levelData.gridSize.rows}x${levelData.gridSize.cols}`);
      console.log(`  Difficulty: ${levelData.difficulty} (${difficultyName})`);
      console.log('');
    }
  } catch (error) {
    console.log(`Level ${level}: Error - ${error.message}`);
  }
}

console.log('Difficulty calculation test completed!');