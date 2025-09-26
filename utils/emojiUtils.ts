import data from '@emoji-mart/data';

// Emoji categories in order for level progression
export const EMOJI_CATEGORY_ORDER = [
  'people',   // Level 1, 5, 9, 13...
  'foods',    // Level 2, 6, 10...
  'activity', // Level 3, 7, 11...
  'places',   // Level 4, 8, 12...
  'nature',   // Level 5, 9, 13... (will cycle back)
  'objects',  // Level 6, 10...
  'symbols',  // Level 7, 11...
  'flags'     // Level 8, 12...
];

// Get emoji category based on level number (cycles through categories)
export function getCategoryForLevel(levelNumber: number): string {
  const categoryIndex = (levelNumber - 1) % EMOJI_CATEGORY_ORDER.length;
  return EMOJI_CATEGORY_ORDER[categoryIndex];
}

// Get emojis from emoji-mart data by category
export function getEmojisFromCategory(category: string, count: number, levelNumber?: number): string[] {
  try {
    // Access the emoji-mart data structure
    const emojiMartData = data as any;
    
    if (emojiMartData.categories && emojiMartData.emojis) {
      // Find the category
      const categoryData = emojiMartData.categories.find((cat: any) => cat.id === category);
      
      if (categoryData && categoryData.emojis && Array.isArray(categoryData.emojis)) {
        const emojis: string[] = [];
        
        // Get emojis from this category
        for (let i = 0; i < categoryData.emojis.length && emojis.length < count; i++) {
          const emojiId = categoryData.emojis[i];
          const emojiData = emojiMartData.emojis[emojiId];
          
          if (emojiData && emojiData.skins && emojiData.skins[0] && emojiData.skins[0].native) {
            emojis.push(emojiData.skins[0].native);
          }
        }
        
        if (emojis.length >= count) {
          console.log(`✅ Level ${levelNumber || 'unknown'} using emoji-mart emojis from ${category}:`, emojis.slice(0, count));
          return shuffleArray(emojis).slice(0, count);
        }
      }
    }
  } catch (error) {
    console.warn('Error accessing emoji-mart data:', error);
  }

  // Fallback to our curated sets if emoji-mart fails
  console.log(`⚠️ Using fallback emojis for category: ${category}`);
  return getFallbackEmojis(category, count);
}

// Improved fallback emoji sets for all categories
const FALLBACK_EMOJI_SETS = {
  people: ['😀', '😊', '😍', '🤔', '😎', '🤩', '😴', '🤗', '🙂', '😉', '😋', '😌', '😏', '🤤', '😇', '🥰', '🤪', '🥳', '🤫', '🤭'],
  foods: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🥭', '🍑', '🥑', '🍆', '🥕', '🌽', '🥒', '🥬', '🥦', '🍄'],
  activity: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '⛳', '🪃', '🥏', '🏏', '🏑', '🥍', '🏒', '⛸️', '🥌'],
  places: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🚁', '✈️'],
  nature: ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🌵', '🌲', '🌳', '🌴', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
  objects: ['📱', '💻', '⌚', '📷', '🎧', '🎮', '🕹️', '📺', '📻', '📞', '💡', '🔋', '🔌', '💰', '💎', '⚽', '🎯', '🎲', '🧸', '🎪'],
  symbols: ['❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💖', '💗', '💘', '💝', '💞', '💟', '☮️', '✝️'],
  flags: ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏴‍☠️', '🏳️‍🌈', '🏳️‍⚧️', '🇺🇸', '🇬🇧', '🇫🇷', '🇩🇪', '🇮🇹', '🇪🇸', '🇯🇵', '🇰🇷', '🇨🇳', '🇮🇳', '🇧🇷', '🇨🇦']
};

function getFallbackEmojis(category: string, count: number): string[] {
  const fallbackSet = FALLBACK_EMOJI_SETS[category as keyof typeof FALLBACK_EMOJI_SETS] || FALLBACK_EMOJI_SETS.people;
  return shuffleArray([...fallbackSet]).slice(0, count);
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Main function to get emoji sets based on level number (replaces getEmojiSetForDifficulty)
export const getEmojiSetForLevel = (levelNumber: number, count: number): string[] => {
  const category = getCategoryForLevel(levelNumber);
  return getEmojisFromCategory(category, count, levelNumber);
};

// Legacy function for backward compatibility - now uses level-based logic
export const getEmojiSetForDifficulty = (difficulty: string, count: number): string[] => {
  // Map difficulty back to a representative level for category selection
  const levelMap = { easy: 1, medium: 2, hard: 3, expert: 4 };
  const level = levelMap[difficulty as keyof typeof levelMap] || 1;
  return getEmojiSetForLevel(level, count);
};

// Legacy emoji sets for backward compatibility (now using improved sets)
export const EMOJI_SETS = {
  easy: FALLBACK_EMOJI_SETS.people.slice(0, 8),
  medium: FALLBACK_EMOJI_SETS.foods.slice(0, 12),
  hard: FALLBACK_EMOJI_SETS.activity.slice(0, 16),
  expert: FALLBACK_EMOJI_SETS.places.slice(0, 20)
};
