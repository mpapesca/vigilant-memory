import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type PropsWithChildren,
} from 'react';
import { GameProgression, MultiProgressionData, ProgressionSummary } from '../types/progression';
import { Card, GameState, generateLevel, Level } from '../utils/gameLogic';

// Game Actions
type GameAction =
  | { type: 'LOAD_GAME_STATE'; payload: GameState }
  | { type: 'LOAD_PROGRESSIONS'; payload: MultiProgressionData }
  | { type: 'CREATE_PROGRESSION'; payload: { name: string } }
  | { type: 'SWITCH_PROGRESSION'; payload: string }
  | { type: 'DELETE_PROGRESSION'; payload: string }
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
  progressions: GameProgression[];
  activeProgression: GameProgression | null;
  startLevel: (levelNumber: number) => void;
  selectCard: (card: Card) => void;
  resetGame: () => void;
  createProgression: (name: string) => Promise<string>;
  switchProgression: (progressionId: string) => void;
  deleteProgression: (progressionId: string) => void;
  getProgressionSummaries: () => ProgressionSummary[];
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

// Initial multi-progression state
const initialProgressionData: MultiProgressionData = {
  progressions: [],
  activeProgressionId: null,
};

// Combined state for the reducer
interface GameContextState {
  gameState: GameState;
  progressionData: MultiProgressionData;
}

// Game reducer
function gameReducer(state: GameContextState, action: GameAction): GameContextState {
  switch (action.type) {
    case 'LOAD_GAME_STATE':
      return { 
        ...state, 
        gameState: action.payload 
      };

    case 'LOAD_PROGRESSIONS':
      return {
        ...state,
        progressionData: action.payload,
        gameState: action.payload.activeProgressionId 
          ? action.payload.progressions.find(p => p.id === action.payload.activeProgressionId)?.gameState || state.gameState
          : state.gameState
      };

    case 'CREATE_PROGRESSION': {
      const newProgression: GameProgression = {
        id: Date.now().toString(),
        name: action.payload.name,
        createdAt: Date.now(),
        lastPlayed: Date.now(),
        gameState: { ...initialGameState }
      };

      return {
        ...state,
        progressionData: {
          progressions: [...state.progressionData.progressions, newProgression],
          activeProgressionId: newProgression.id
        },
        gameState: newProgression.gameState
      };
    }

    case 'SWITCH_PROGRESSION': {
      const targetProgression = state.progressionData.progressions.find(p => p.id === action.payload);
      if (!targetProgression) return state;

      // Update lastPlayed for the switched-to progression
      const updatedProgressions = state.progressionData.progressions.map(p =>
        p.id === action.payload ? { ...p, lastPlayed: Date.now() } : p
      );

      return {
        ...state,
        progressionData: {
          ...state.progressionData,
          progressions: updatedProgressions,
          activeProgressionId: action.payload
        },
        gameState: targetProgression.gameState
      };
    }

    case 'DELETE_PROGRESSION': {
      const updatedProgressions = state.progressionData.progressions.filter(p => p.id !== action.payload);
      const wasActive = state.progressionData.activeProgressionId === action.payload;
      
      // If we deleted the active progression, switch to the most recently played one or null
      let newActiveId = state.progressionData.activeProgressionId;
      let newGameState = state.gameState;
      
      if (wasActive) {
        if (updatedProgressions.length > 0) {
          const mostRecent = updatedProgressions.reduce((a, b) => a.lastPlayed > b.lastPlayed ? a : b);
          newActiveId = mostRecent.id;
          newGameState = mostRecent.gameState;
        } else {
          newActiveId = null;
          newGameState = { ...initialGameState };
        }
      }

      return {
        ...state,
        progressionData: {
          progressions: updatedProgressions,
          activeProgressionId: newActiveId
        },
        gameState: newGameState
      };
    }

    case 'START_LEVEL': {
      const newLevel = generateLevel(action.payload);
      if (!newLevel) return state;

      const updatedLevels = [...state.gameState.levels];
      const existingLevelIndex = updatedLevels.findIndex(l => l.id === action.payload);
      
      if (existingLevelIndex >= 0) {
        // Reset existing level if not completed
        if (!updatedLevels[existingLevelIndex].isCompleted) {
          updatedLevels[existingLevelIndex] = newLevel;
        }
      } else {
        updatedLevels.push(newLevel);
      }

      const newGameState = {
        ...state.gameState,
        currentLevel: action.payload,
        levels: updatedLevels,
        selectedCards: [],
        moves: 0,
        startTime: Date.now(),
      };

      // Update the active progression with the new game state
      const updatedProgressions = state.progressionData.progressions.map(p =>
        p.id === state.progressionData.activeProgressionId 
          ? { ...p, gameState: newGameState, lastPlayed: Date.now() }
          : p
      );

      return {
        ...state,
        gameState: newGameState,
        progressionData: {
          ...state.progressionData,
          progressions: updatedProgressions
        }
      };
    }

    case 'SELECT_CARD': {
      const selectedCard = action.payload;
      
      // Don't select if already matched or revealed
      if (selectedCard.isMatched || selectedCard.isRevealed) {
        return state;
      }

      // Don't select if already in selectedCards
      if (state.gameState.selectedCards.find(c => c.id === selectedCard.id)) {
        return state;
      }

      // Don't select if we already have 2 cards selected
      if (state.gameState.selectedCards.length >= 2) {
        return state;
      }

      const newSelectedCards = [...state.gameState.selectedCards, selectedCard];
      const newGameState = {
        ...state.gameState,
        selectedCards: newSelectedCards,
      };

      // Update active progression
      const updatedProgressions = state.progressionData.progressions.map(p =>
        p.id === state.progressionData.activeProgressionId 
          ? { ...p, gameState: newGameState, lastPlayed: Date.now() }
          : p
      );

      return {
        ...state,
        gameState: newGameState,
        progressionData: {
          ...state.progressionData,
          progressions: updatedProgressions
        }
      };
    }

    case 'REVEAL_CARDS': {
      const cardsToReveal = action.payload;
      const updatedLevels = state.gameState.levels.map(level => {
        if (level.id === state.gameState.currentLevel) {
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

      const newGameState = {
        ...state.gameState,
        levels: updatedLevels,
      };

      // Update active progression
      const updatedProgressions = state.progressionData.progressions.map(p =>
        p.id === state.progressionData.activeProgressionId 
          ? { ...p, gameState: newGameState, lastPlayed: Date.now() }
          : p
      );

      return {
        ...state,
        gameState: newGameState,
        progressionData: {
          ...state.progressionData,
          progressions: updatedProgressions
        }
      };
    }

    case 'MATCH_CARDS': {
      const cardsToMatch = action.payload;
      const updatedLevels = state.gameState.levels.map(level => {
        if (level.id === state.gameState.currentLevel) {
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

      const newGameState = {
        ...state.gameState,
        levels: updatedLevels,
        selectedCards: [],
      };

      // Update active progression
      const updatedProgressions = state.progressionData.progressions.map(p =>
        p.id === state.progressionData.activeProgressionId 
          ? { ...p, gameState: newGameState, lastPlayed: Date.now() }
          : p
      );

      return {
        ...state,
        gameState: newGameState,
        progressionData: {
          ...state.progressionData,
          progressions: updatedProgressions
        }
      };
    }

    case 'HIDE_CARDS': {
      const cardsToHide = action.payload;
      const updatedLevels = state.gameState.levels.map(level => {
        if (level.id === state.gameState.currentLevel) {
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

      const newGameState = {
        ...state.gameState,
        levels: updatedLevels,
        selectedCards: [],
      };

      // Update active progression
      const updatedProgressions = state.progressionData.progressions.map(p =>
        p.id === state.progressionData.activeProgressionId 
          ? { ...p, gameState: newGameState, lastPlayed: Date.now() }
          : p
      );

      return {
        ...state,
        gameState: newGameState,
        progressionData: {
          ...state.progressionData,
          progressions: updatedProgressions
        }
      };
    }

    case 'COMPLETE_LEVEL': {
      const { levelId, moves, timeSpent } = action.payload;
      const updatedLevels = state.gameState.levels.map(level => {
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

      const newGameState = {
        ...state.gameState,
        levels: updatedLevels,
      };

      // Update active progression
      const updatedProgressions = state.progressionData.progressions.map(p =>
        p.id === state.progressionData.activeProgressionId 
          ? { ...p, gameState: newGameState, lastPlayed: Date.now() }
          : p
      );

      return {
        ...state,
        gameState: newGameState,
        progressionData: {
          ...state.progressionData,
          progressions: updatedProgressions
        }
      };
    }

    case 'RESET_SELECTIONS': {
      const newGameState = {
        ...state.gameState,
        selectedCards: [],
      };

      // Update active progression
      const updatedProgressions = state.progressionData.progressions.map(p =>
        p.id === state.progressionData.activeProgressionId 
          ? { ...p, gameState: newGameState, lastPlayed: Date.now() }
          : p
      );

      return {
        ...state,
        gameState: newGameState,
        progressionData: {
          ...state.progressionData,
          progressions: updatedProgressions
        }
      };
    }

    case 'INCREMENT_MOVES': {
      const newGameState = {
        ...state.gameState,
        moves: state.gameState.moves + 1,
      };

      // Update active progression
      const updatedProgressions = state.progressionData.progressions.map(p =>
        p.id === state.progressionData.activeProgressionId 
          ? { ...p, gameState: newGameState, lastPlayed: Date.now() }
          : p
      );

      return {
        ...state,
        gameState: newGameState,
        progressionData: {
          ...state.progressionData,
          progressions: updatedProgressions
        }
      };
    }

    default:
      return state;
  }
}

// Game Provider
export function GameProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(gameReducer, {
    gameState: initialGameState,
    progressionData: initialProgressionData
  });

  // Load progression data from storage on mount
  useEffect(() => {
    loadProgressionData();
  }, []);

  // Save progression data whenever it changes
  useEffect(() => {
    const saveProgressionData = async () => {
      try {
        await AsyncStorage.setItem('gameProgressions', JSON.stringify(state.progressionData));
      } catch (error) {
        console.log('Error saving progression data:', error);
      }
    };
    
    saveProgressionData();
  }, [state.progressionData]);

  const loadProgressionData = async () => {
    try {
      // First, try to load new multi-progression format
      const savedProgressions = await AsyncStorage.getItem('gameProgressions');
      
      if (savedProgressions) {
        dispatch({ type: 'LOAD_PROGRESSIONS', payload: JSON.parse(savedProgressions) });
        return;
      }

      // Migration: check for old single-progression format
      const oldGameState = await AsyncStorage.getItem('gameState');
      if (oldGameState) {
        const parsedOldState = JSON.parse(oldGameState);
        
        // Create first progression from old data
        const migrationProgression: GameProgression = {
          id: 'migrated-' + Date.now(),
          name: 'Main Game',
          createdAt: Date.now(),
          lastPlayed: Date.now(),
          gameState: parsedOldState
        };

        const migratedData: MultiProgressionData = {
          progressions: [migrationProgression],
          activeProgressionId: migrationProgression.id
        };

        dispatch({ type: 'LOAD_PROGRESSIONS', payload: migratedData });

        // Remove old storage
        await AsyncStorage.removeItem('gameState');
      }
    } catch (error) {
      console.log('Error loading progression data:', error);
    }
  };

  const createProgression = async (name: string): Promise<string> => {
    dispatch({ type: 'CREATE_PROGRESSION', payload: { name } });
    // Return the new progression ID (generated from timestamp)
    return Date.now().toString();
  };

  const switchProgression = (progressionId: string) => {
    dispatch({ type: 'SWITCH_PROGRESSION', payload: progressionId });
  };

  const deleteProgression = (progressionId: string) => {
    dispatch({ type: 'DELETE_PROGRESSION', payload: progressionId });
  };

  const getProgressionSummaries = (): ProgressionSummary[] => {
    return state.progressionData.progressions.map(progression => {
      const gameState = progression.gameState;
      const completedLevels = gameState.levels.filter(l => l.isCompleted).length;
      const totalMoves = gameState.levels.reduce((sum, level) => sum + (level.moves || 0), 0);
      const totalTime = gameState.levels.reduce((sum, level) => sum + (level.timeSpent || 0), 0);

      return {
        id: progression.id,
        name: progression.name,
        currentLevel: gameState.currentLevel,
        completedLevels,
        lastPlayed: progression.lastPlayed,
        totalMoves,
        totalTime
      };
    });
  };

  const startLevel = (levelNumber: number) => {
    dispatch({ type: 'START_LEVEL', payload: levelNumber });
  };

  const selectCard = (card: Card) => {
    dispatch({ type: 'SELECT_CARD', payload: card });
    
    // Get updated selected cards after selection
    const newSelectedCards = state.gameState.selectedCards.find(c => c.id === card.id) 
      ? state.gameState.selectedCards 
      : [...state.gameState.selectedCards, card];

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
          const currentLevel = state.gameState.levels.find(l => l.id === state.gameState.currentLevel);
          if (currentLevel) {
            const totalCards = currentLevel.cards.flat().length;
            const matchedCards = currentLevel.cards.flat().filter(c => c.isMatched).length + 2; // +2 for the cards we just matched
            
            if (matchedCards >= totalCards) {
              const timeSpent = state.gameState.startTime ? Date.now() - state.gameState.startTime : 0;
              dispatch({ 
                type: 'COMPLETE_LEVEL', 
                payload: { 
                  levelId: state.gameState.currentLevel, 
                  moves: state.gameState.moves + 1, 
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
      await AsyncStorage.removeItem('gameProgressions');
      await AsyncStorage.removeItem('gameState'); // Remove old format too
      dispatch({ type: 'LOAD_PROGRESSIONS', payload: initialProgressionData });
    } catch (error) {
      console.log('Error resetting game:', error);
    }
  };

  const getLevelProgress = () => {
    const completed = state.gameState.levels.filter(l => l.isCompleted).length;
    const total = Math.max(state.gameState.currentLevel, state.gameState.levels.length);
    return { completed, total };
  };

  const currentLevel = state.gameState.levels.find(l => l.id === state.gameState.currentLevel) || null;
  const isLevelCompleted = currentLevel ? currentLevel.isCompleted : false;
  const activeProgression = state.progressionData.progressions.find(p => p.id === state.progressionData.activeProgressionId) || null;

  return (
    <GameContext.Provider
      value={{
        gameState: state.gameState,
        currentLevel,
        isLevelCompleted,
        selectedCards: state.gameState.selectedCards,
        progressions: state.progressionData.progressions,
        activeProgression,
        startLevel,
        selectCard,
        resetGame,
        createProgression,
        switchProgression,
        deleteProgression,
        getProgressionSummaries,
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
