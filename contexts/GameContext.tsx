import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useReducer, type PropsWithChildren } from 'react';
import { Card, GameState, generateLevel, Level } from '../utils/gameLogic';

// Game Actions
type GameAction =
  | { type: 'LOAD_GAME_STATE'; payload: GameState }
  | { type: 'START_LEVEL'; payload: number }
  | { type: 'SELECT_CARD'; payload: Card }
  | { type: 'REVEAL_CARDS'; payload: Card[] }
  | { type: 'MATCH_CARDS'; payload: Card[] }
  | { type: 'HIDE_CARDS'; payload: Card[] }
  | { type: 'COMPLETE_LEVEL'; payload: { levelId: number; moves: number; timeSpent: number } }
  | { type: 'RESET_SELECTIONS' }
  | { type: 'INCREMENT_MOVES' };

// Game Context Type
interface GameContextType {
  gameState: GameState;
  currentLevel: Level | null;
  isLevelCompleted: boolean;
  selectedCards: Card[];
  startLevel: (levelNumber: number) => void;
  selectCard: (card: Card) => void;
  resetGame: () => void;
  getLevelProgress: () => { completed: number; total: number };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Initial game state
const initialGameState: GameState = {
  currentLevel: 1,
  levels: [],
  selectedCards: [],
  moves: 0,
  startTime: null,
};

// Game reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'LOAD_GAME_STATE':
      return { ...action.payload };

    case 'START_LEVEL': {
      const newLevel = generateLevel(action.payload);
      if (!newLevel) return state;

      const updatedLevels = [...state.levels];
      const existingLevelIndex = updatedLevels.findIndex(l => l.id === action.payload);
      
      if (existingLevelIndex >= 0) {
        // Reset existing level if not completed
        if (!updatedLevels[existingLevelIndex].isCompleted) {
          updatedLevels[existingLevelIndex] = newLevel;
        }
      } else {
        updatedLevels.push(newLevel);
      }

      return {
        ...state,
        currentLevel: action.payload,
        levels: updatedLevels,
        selectedCards: [],
        moves: 0,
        startTime: Date.now(),
      };
    }

    case 'SELECT_CARD': {
      const selectedCard = action.payload;
      
      // Don't select if already matched or revealed
      if (selectedCard.isMatched || selectedCard.isRevealed) {
        return state;
      }

      // Don't select if already in selectedCards
      if (state.selectedCards.find(c => c.id === selectedCard.id)) {
        return state;
      }

      // Don't select if we already have 2 cards selected
      if (state.selectedCards.length >= 2) {
        return state;
      }

      const newSelectedCards = [...state.selectedCards, selectedCard];
      return {
        ...state,
        selectedCards: newSelectedCards,
      };
    }

    case 'REVEAL_CARDS': {
      const cardsToReveal = action.payload;
      const updatedLevels = state.levels.map(level => {
        if (level.id === state.currentLevel) {
          const updatedCards = level.cards.map(row =>
            row.map(card => {
              const shouldReveal = cardsToReveal.find(c => c.id === card.id);
              return shouldReveal ? { ...card, isRevealed: true } : card;
            })
          );
          return { ...level, cards: updatedCards };
        }
        return level;
      });

      return {
        ...state,
        levels: updatedLevels,
      };
    }

    case 'MATCH_CARDS': {
      const cardsToMatch = action.payload;
      const updatedLevels = state.levels.map(level => {
        if (level.id === state.currentLevel) {
          const updatedCards = level.cards.map(row =>
            row.map(card => {
              const shouldMatch = cardsToMatch.find(c => c.id === card.id);
              return shouldMatch ? { ...card, isMatched: true } : card;
            })
          );
          return { ...level, cards: updatedCards };
        }
        return level;
      });

      return {
        ...state,
        levels: updatedLevels,
        selectedCards: [],
      };
    }

    case 'HIDE_CARDS': {
      const cardsToHide = action.payload;
      const updatedLevels = state.levels.map(level => {
        if (level.id === state.currentLevel) {
          const updatedCards = level.cards.map(row =>
            row.map(card => {
              const shouldHide = cardsToHide.find(c => c.id === card.id);
              return shouldHide ? { ...card, isRevealed: false } : card;
            })
          );
          return { ...level, cards: updatedCards };
        }
        return level;
      });

      return {
        ...state,
        levels: updatedLevels,
        selectedCards: [],
      };
    }

    case 'COMPLETE_LEVEL': {
      const { levelId, moves, timeSpent } = action.payload;
      const updatedLevels = state.levels.map(level => {
        if (level.id === levelId) {
          return {
            ...level,
            isCompleted: true,
            moves,
            timeSpent,
            bestMoves: level.bestMoves ? Math.min(level.bestMoves, moves) : moves,
            bestTime: level.bestTime ? Math.min(level.bestTime, timeSpent) : timeSpent,
          };
        }
        return level;
      });

      return {
        ...state,
        levels: updatedLevels,
      };
    }

    case 'RESET_SELECTIONS':
      return {
        ...state,
        selectedCards: [],
      };

    case 'INCREMENT_MOVES':
      return {
        ...state,
        moves: state.moves + 1,
      };

    default:
      return state;
  }
}

// Game Provider
export function GameProvider({ children }: PropsWithChildren) {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  // Load game state from storage on mount
  useEffect(() => {
    loadGameState();
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    const saveGameState = async () => {
      try {
        await AsyncStorage.setItem('gameState', JSON.stringify(gameState));
      } catch (error) {
        console.log('Error saving game state:', error);
      }
    };
    
    saveGameState();
  }, [gameState]);

  const loadGameState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('gameState');
      if (savedState) {
        dispatch({ type: 'LOAD_GAME_STATE', payload: JSON.parse(savedState) });
      }
    } catch (error) {
      console.log('Error loading game state:', error);
    }
  };

  const startLevel = (levelNumber: number) => {
    dispatch({ type: 'START_LEVEL', payload: levelNumber });
  };

  const selectCard = (card: Card) => {
    dispatch({ type: 'SELECT_CARD', payload: card });
    
    // Get updated selected cards after selection
    const newSelectedCards = gameState.selectedCards.find(c => c.id === card.id) 
      ? gameState.selectedCards 
      : [...gameState.selectedCards, card];

    // Reveal the selected card immediately
    dispatch({ type: 'REVEAL_CARDS', payload: [card] });

    // Check if we have 2 cards selected
    if (newSelectedCards.length === 2) {
      dispatch({ type: 'INCREMENT_MOVES' });
      
      const [firstCard, secondCard] = newSelectedCards;
      
      if (firstCard.emoji === secondCard.emoji) {
        // Cards match!
        setTimeout(() => {
          dispatch({ type: 'MATCH_CARDS', payload: [firstCard, secondCard] });
          
          // Check if level is completed
          const currentLevel = gameState.levels.find(l => l.id === gameState.currentLevel);
          if (currentLevel) {
            const totalCards = currentLevel.cards.flat().length;
            const matchedCards = currentLevel.cards.flat().filter(c => c.isMatched).length + 2; // +2 for the cards we just matched
            
            if (matchedCards >= totalCards) {
              const timeSpent = gameState.startTime ? Date.now() - gameState.startTime : 0;
              dispatch({ 
                type: 'COMPLETE_LEVEL', 
                payload: { 
                  levelId: gameState.currentLevel, 
                  moves: gameState.moves + 1, 
                  timeSpent 
                }
              });
            }
          }
        }, 500);
      } else {
        // Cards don't match, hide them after a delay
        setTimeout(() => {
          dispatch({ type: 'HIDE_CARDS', payload: [firstCard, secondCard] });
        }, 1000);
      }
    }
  };

  const resetGame = async () => {
    try {
      await AsyncStorage.removeItem('gameState');
      dispatch({ type: 'LOAD_GAME_STATE', payload: initialGameState });
    } catch (error) {
      console.log('Error resetting game:', error);
    }
  };

  const getLevelProgress = () => {
    const completed = gameState.levels.filter(l => l.isCompleted).length;
    const total = Math.max(gameState.currentLevel, gameState.levels.length);
    return { completed, total };
  };

  const currentLevel = gameState.levels.find(l => l.id === gameState.currentLevel) || null;
  const isLevelCompleted = currentLevel ? currentLevel.isCompleted : false;

  return (
    <GameContext.Provider
      value={{
        gameState,
        currentLevel,
        isLevelCompleted,
        selectedCards: gameState.selectedCards,
        startLevel,
        selectCard,
        resetGame,
        getLevelProgress,
      }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
