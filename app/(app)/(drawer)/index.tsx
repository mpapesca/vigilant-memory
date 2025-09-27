import ProgressionSelector from '@/components/ProgressionSelector';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getHomeStyles } from '@/styles/styles';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { isDark } = useTheme();
  const {
    gameState,
    currentLevel,
    isLevelCompleted,
    startLevel,
    getLevelProgress,
    progressions,
    activeProgression,
  } = useGame();
  const styles = getHomeStyles(isDark);
  const [showProgressionSelector, setShowProgressionSelector] = useState(false);

  const progress = getLevelProgress();

  const handleCreateNewProgression = () => {
    setShowProgressionSelector(true);
  };

  const handleContinueGame = () => {
    if (!activeProgression) {
      // If no active progression, show selector
      setShowProgressionSelector(true);
      return;
    }
    router.push('/(app)/(drawer)/game');
  };

  const handleStartLevel = () => {
    if (!activeProgression) {
      // If no active progression, show selector
      setShowProgressionSelector(true);
      return;
    }
    const nextLevel = getNextLevelNumber();
    startLevel(nextLevel);
    router.push('/(app)/(drawer)/game');
  };

  const handleProgressionSelected = () => {
    // Progression is already switched in context
    // Navigate to game screen
    router.push('/(app)/(drawer)/game');
  };

  const getNextLevelNumber = () => {
    return isLevelCompleted ? gameState.currentLevel + 1 : gameState.currentLevel;
  };

  const hasAnyProgressions = progressions.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 Vigilant Memory</Text>

      <Text style={styles.subtitle}>
        Progressive card matching game that gets harder with each level!
      </Text>

      {activeProgression ? (
        <View style={styles.card}>
          <Text style={styles.title}>📊 {activeProgression.name}</Text>
          <Text style={styles.instructionText}>
            Level: {gameState.currentLevel} • Completed: {progress.completed}/{progress.total}
          </Text>

          {currentLevel && !isLevelCompleted && (
            <Text style={styles.instructionText}>
              Current level in progress: {currentLevel.gridSize.rows}×{currentLevel.gridSize.cols}{' '}
              grid
            </Text>
          )}

          {progressions.length > 1 && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#6c757d', marginTop: 8 }]}
              onPress={() => setShowProgressionSelector(true)}
            >
              <Text style={styles.buttonText}>Switch Game Progression</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.title}>🎮 No Active Game</Text>
          <Text style={styles.instructionText}>
            Create a new game progression or continue an existing one.
          </Text>
        </View>
      )}

      {activeProgression ? (
        <>
          {!currentLevel || isLevelCompleted ? (
            <TouchableOpacity style={styles.button} onPress={handleStartLevel}>
              <Text style={styles.buttonText}>Start Level {getNextLevelNumber()}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleContinueGame}>
              <Text style={styles.buttonText}>Continue Level {gameState.currentLevel}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#34C759' }]}
            onPress={handleCreateNewProgression}
          >
            <Text style={styles.buttonText}>+ Start New Game Progression</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#34C759' }]}
          onPress={handleCreateNewProgression}
        >
          <Text style={styles.buttonText}>Create Your First Game</Text>
        </TouchableOpacity>
      )}

      {hasAnyProgressions && !activeProgression && (
        <TouchableOpacity style={styles.button} onPress={() => setShowProgressionSelector(true)}>
          <Text style={styles.buttonText}>Continue Existing Game</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#6c757d' }]}
        onPress={() => router.push('/(app)/(drawer)/settings')}
      >
        <Text style={styles.buttonText}>View Settings</Text>
      </TouchableOpacity>

      <Text style={styles.instructionText}>
        🎮 Match pairs of cards to complete each level!
        {'\n'}• Tap cards to reveal them
        {'\n'}• Find matching pairs
        {'\n'}• Complete levels to unlock new ones
        {'\n\n'}🎯 Multiple game progressions let you try different strategies!
      </Text>

      <ProgressionSelector
        visible={showProgressionSelector}
        onClose={() => setShowProgressionSelector(false)}
        onProgressionSelected={handleProgressionSelected}
      />
    </View>
  );
}
