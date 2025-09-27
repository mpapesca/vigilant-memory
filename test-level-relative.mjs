// Test the level-relative difficulty scale
console.log('🎯 Level-Relative Difficulty Scale Test\n');

// Simulate the level-relative difficulty range calculation
function getLevelDifficultyRange(levelNumber) {
  const minRandomness = 0.9;
  const maxRandomness = 1.0;
  
  return {
    MIN: levelNumber * minRandomness,
    MAX: levelNumber * maxRandomness,
  };
}

function getDifficultyPosition(difficulty, levelNumber) {
  const range = getLevelDifficultyRange(levelNumber);
  return Math.max(0, Math.min(1, (difficulty - range.MIN) / (range.MAX - range.MIN)));
}

console.log('Level-Relative Difficulty Scale Examples:\n');

const testLevels = [1, 5, 10, 25, 50];

for (const level of testLevels) {
  const range = getLevelDifficultyRange(level);
  
  console.log(`📊 LEVEL ${level}:`);
  console.log(`   Range: ${range.MIN.toFixed(1)} - ${range.MAX.toFixed(1)}`);
  
  // Test different difficulty values within the level range
  const testDifficulties = [
    range.MIN,                           // Minimum (easiest layout)
    range.MIN + (range.MAX - range.MIN) * 0.5, // Middle (average layout)  
    range.MAX                            // Maximum (hardest layout)
  ];
  
  console.log('   Difficulty | Position | Meaning');
  console.log('   -----------|----------|--------');
  
  for (const diff of testDifficulties) {
    const position = getDifficultyPosition(diff, level);
    let meaning;
    if (position <= 0.33) meaning = 'Easy layout';
    else if (position <= 0.66) meaning = 'Average layout';  
    else meaning = 'Hard layout';
    
    console.log(`   ${diff.toFixed(1).padStart(10)} | ${position.toFixed(2).padStart(8)} | ${meaning}`);
  }
  console.log('');
}

console.log('🔍 KEY INSIGHTS:');
console.log('• Each level has its own difficulty range');
console.log('• Position 0.0 = easiest possible layout for that level');
console.log('• Position 1.0 = hardest possible layout for that level');
console.log('• Same position across levels = same relative difficulty');
console.log('• Level 1 at 50% ≈ Level 10 at 50% (same layout complexity)');

console.log('\n🎨 COLOR SYSTEM:');
console.log('• Green (0.0-0.5): Easy to moderate layouts for the level');
console.log('• Yellow-Red (0.5-1.0): Moderate to hard layouts for the level');
console.log('• Colors represent layout quality, not absolute difficulty');

console.log('\n✅ Level-relative scaling provides meaningful feedback!');