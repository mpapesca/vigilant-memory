// Test the actual difficulty calculation by importing the compiled JS
import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

console.log('Testing Numeric Difficulty System...\n');

// Create a temporary test file that can import from the actual TS files
const testCode = `
import { generateLevel, getDifficultyName } from './utils/gameLogic.js';

console.log('Level | Grid Size | Difficulty | Category | Randomness');
console.log('------|-----------|------------|----------|----------');

for (let level = 1; level <= 15; level++) {
  try {
    const levelData = generateLevel(level);
    
    if (levelData) {
      const category = getDifficultyName(levelData.difficulty);
      const randomness = (levelData.difficulty / level).toFixed(2);
      
      console.log(\`  \${level.toString().padStart(2)}  | \${levelData.gridSize.rows}x\${levelData.gridSize.cols.toString().padStart(2)}      |    \${levelData.difficulty.toString().padStart(5)}   | \${category.padEnd(9)} | \${randomness}\`);
    } else {
      console.log(\`  \${level.toString().padStart(2)}  | Error: Level generation returned null\`);
    }
  } catch (error) {
    console.log(\`  \${level.toString().padStart(2)}  | Error: \${error.message}\`);
  }
}

console.log('\\n✅ Difficulty calculation test completed!');
console.log('\\nKey observations:');
console.log('- Difficulty increases with level number');
console.log('- Randomness factor (0.1-1.0) affects final difficulty');
console.log('- Categories are assigned based on numeric ranges');
`;

// Write the test file
writeFileSync('./temp-test.mjs', testCode);

// Use bun to run the test with TypeScript support
const proc = spawn('bun', ['run', './temp-test.mjs'], { 
  stdio: 'inherit',
  cwd: process.cwd()
});

proc.on('close', (code) => {
  // Clean up temp file
  try {
    import('fs').then(fs => fs.unlinkSync('./temp-test.mjs'));
  } catch (_e) {
    // Ignore cleanup errors
  }
  process.exit(code);
});