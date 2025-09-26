import { generateLevelConfig } from '../utils/gameLogic';

export function testLevelGeneration() {
  console.log('🎮 Testing Dynamic Level Generation System');
  console.log('==========================================');
  
  // Test first 15 levels to see progression
  for (let i = 1; i <= 15; i++) {
    const config = generateLevelConfig(i);
    const totalCards = config.rows * config.cols;
    const isEven = totalCards % 2 === 0;
    
    console.log(`Level ${i.toString().padStart(2, ' ')}: ${config.rows}×${config.cols} (${config.pairs} pairs) - ${config.difficulty} ${isEven ? '✅' : '❌'}`);
  }
  
  console.log('\n🚀 Testing Higher Levels:');
  console.log('=========================');
  
  // Test progression at key milestones
  const milestones = [20, 30, 50, 100];
  for (const level of milestones) {
    const config = generateLevelConfig(level);
    const totalCards = config.rows * config.cols;
    
    console.log(`Level ${level}: ${config.rows}×${config.cols} (${config.pairs} pairs) - ${config.difficulty} (${totalCards} cards)`);
  }
  
  console.log('\n✨ Infinite Level System Active!');
  return true;
}
