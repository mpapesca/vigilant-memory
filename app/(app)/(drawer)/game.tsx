import { DifficultyScale } from '@/components/DifficultyScale';
import { Emoji } from '@/components/Emoji';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function GameScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { currentLevel, gameState, selectCard, startLevel } = useGame();
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    if (!currentLevel) {
      // If no current level, start level 1
      startLevel(1);
      setStartTime(Date.now());
    }
  }, [currentLevel, startLevel]);

  useEffect(() => {
    setMoves(gameState.moves);
  }, [gameState.moves]);

  useEffect(() => {
    if (currentLevel?.isCompleted) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      Alert.alert(
        '🎉 Level Complete!',
        `Congratulations! You completed Level ${currentLevel.id} in ${moves} moves and ${timeSpent} seconds.`,
        [
          {
            text: 'Next Level',
            onPress: () => {
              startLevel(currentLevel.id + 1);
              setStartTime(Date.now());
              setMoves(0);
            },
          },
          {
            text: 'Home',
            onPress: () => router.push('/'),
          },
        ],
      );
    }
  }, [currentLevel?.isCompleted, currentLevel?.id, moves, startTime, router, startLevel]);

  if (!currentLevel) {
    return (
      <View style={getStyles(isDark).container}>
        <Text style={getStyles(isDark).title}>Loading...</Text>
      </View>
    );
  }

  const styles = getStyles(isDark);
  const cardSize = 80; // Fixed card size, no shrinking

  // Calculate grid dimensions
  const gridWidth = cardSize * currentLevel.gridSize.cols + 20;
  const gridHeight = cardSize * currentLevel.gridSize.rows + 20;

  // Estimate available height for game area (screen - header - footer - padding)
  const availableHeight = screenHeight - 200; // Rough estimate for header/footer/padding

  // Determine if horizontal/vertical scrolling is needed
  const needsHorizontalScroll = gridWidth > screenWidth;
  const needsVerticalScroll = gridHeight > availableHeight;

  const handleCardPress = (card: any) => {
    if (!card.isMatched && !card.isRevealed && gameState.selectedCards.length < 2) {
      selectCard(card);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Level {currentLevel.id}</Text>
          <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
            <Text style={styles.homeButtonText}>🏠 Home</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <DifficultyScale
            difficulty={currentLevel.difficulty}
            levelNumber={currentLevel.id}
            width={120}
            height={16}
            showValue={true}
            showLabels={false}
          />
          <Text style={styles.movesText}>Moves: {moves}</Text>
        </View>

        <Text style={styles.gridInfo}>
          {currentLevel.gridSize.rows} × {currentLevel.gridSize.cols} Grid
        </Text>
      </View>

      <View style={styles.gameContainer}>
        <ScrollView
          horizontal={needsHorizontalScroll}
          scrollEnabled={needsHorizontalScroll || needsVerticalScroll}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: needsHorizontalScroll ? gridWidth : '100%',
            minHeight: needsVerticalScroll ? gridHeight : '100%',
          }}
        >
          <View
            style={[
              styles.grid,
              {
                width: gridWidth,
                height: gridHeight,
              },
            ]}
          >
            {currentLevel.cards.map((row, rowIndex) =>
              row.map((card, colIndex) => (
                <TouchableOpacity
                  key={card.id}
                  style={[
                    styles.card,
                    {
                      width: cardSize - 10,
                      height: cardSize - 10,
                      backgroundColor:
                        card.isRevealed || card.isMatched
                          ? isDark
                            ? '#2c2c2e'
                            : '#ffffff'
                          : isDark
                          ? '#1c1c1e'
                          : '#f0f0f0',
                      borderColor: card.isMatched ? '#34c759' : isDark ? '#444' : '#ddd',
                      borderWidth: card.isMatched ? 2 : 1,
                    },
                  ]}
                  onPress={() => handleCardPress(card)}
                  disabled={card.isMatched}
                >
                  {card.isRevealed || card.isMatched ? (
                    <Emoji emoji={card.emoji} size={cardSize * 0.4} />
                  ) : (
                    <Text style={[styles.cardText, { fontSize: cardSize * 0.4 }]}>?</Text>
                  )}
                </TouchableOpacity>
              )),
            )}
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={() => {
            startLevel(currentLevel.id);
            setMoves(0);
            setStartTime(Date.now());
          }}
        >
          <Text style={styles.buttonText}>🔄 Reset Level</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#f5f5f5',
      padding: 20,
    },
    header: {
      marginBottom: 30,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#333333',
    },
    homeButton: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    homeButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    difficultyBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    difficultyText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
    },
    movesText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#333333',
    },
    gridInfo: {
      fontSize: 14,
      color: isDark ? '#cccccc' : '#666666',
      textAlign: 'center',
    },
    gameContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
    },
    card: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
    },
    cardText: {
      fontWeight: 'bold',
      textAlign: 'center',
      color: isDark ? '#ffffff' : '#333333',
    },
    footer: {
      marginTop: 20,
    },
    button: {
      backgroundColor: '#007AFF',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
    },
    resetButton: {
      backgroundColor: '#ff9500',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  });
