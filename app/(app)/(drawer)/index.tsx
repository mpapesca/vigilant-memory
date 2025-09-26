import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getHomeStyles } from '@/styles/styles';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { gameState, currentLevel, isLevelCompleted, startLevel, getLevelProgress } = useGame();
  const styles = getHomeStyles(isDark);

  const progress = getLevelProgress();

  const handleStartNewGame = () => {
    startLevel(1);
    router.push('/(app)/(drawer)/game');
  };

  const handleContinueGame = () => {
    router.push('/(app)/(drawer)/game');
  };

  const getNextLevelNumber = () => {
    return isLevelCompleted ? gameState.currentLevel + 1 : gameState.currentLevel;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 Vigilant Memory</Text>

      <Text style={styles.subtitle}>
        Progressive card matching game that gets harder with each level!
      </Text>

      <View style={styles.card}>
        <Text style={styles.title}>📊 Progress</Text>
        <Text style={styles.instructionText}>
          Level: {gameState.currentLevel} • Completed: {progress.completed}/{progress.total}
        </Text>

        {currentLevel && !isLevelCompleted && (
          <Text style={styles.instructionText}>
            Current level in progress: {currentLevel.gridSize.rows}×{currentLevel.gridSize.cols}{' '}
            grid
          </Text>
        )}
      </View>

      {!currentLevel || isLevelCompleted ? (
        <TouchableOpacity style={styles.button} onPress={handleStartNewGame}>
          <Text style={styles.buttonText}>Start Level {getNextLevelNumber()}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleContinueGame}>
          <Text style={styles.buttonText}>Continue Level {gameState.currentLevel}</Text>
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
      </Text>
    </View>
  );
}
