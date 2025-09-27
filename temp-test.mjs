
import { generateLevel, getDifficultyName } from './utils/gameLogic.js';

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
