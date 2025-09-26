// Test script for dynamic level generation
const { generateLevelConfig } = require('./utils/gameLogic.ts');

console.log('Testing infinite level generation:');
console.log('=====================================');

// Test first 20 levels
for (let i = 1; i <= 20; i++) {
  try {
    const config = generateLevelConfig(i);
    const totalCards = config.rows * config.cols;
    const isEven = totalCards % 2 === 0;
    
    console.log(`Level ${i.toString().padStart(2)}: ${config.rows}x${config.cols} grid, ${config.pairs} pairs, ${config.difficulty.padEnd(8)} (${totalCards} cards ${isEven ? '✓' : '✗'})`);
  } catch (error) {
    console.log(`Level ${i}: ERROR - ${error.message}`);
  }
}

console.log('\nTesting higher levels:');
console.log('=====================');

// Test some higher levels
const testLevels = [25, 30, 50, 100, 200, 500];
for (const level of testLevels) {
  try {
    const config = generateLevelConfig(level);
    const totalCards = config.rows * config.cols;
    const isEven = totalCards % 2 === 0;
    
    console.log(`Level ${level.toString().padStart(3)}: ${config.rows}x${config.cols} grid, ${config.pairs} pairs, ${config.difficulty.padEnd(10)} (${totalCards} cards ${isEven ? '✓' : '✗'})`);
  } catch (error) {
    console.log(`Level ${level}: ERROR - ${error.message}`);
  }
}
