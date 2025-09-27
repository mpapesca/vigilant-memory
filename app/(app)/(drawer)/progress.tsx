import { DifficultyScale } from '@/components/DifficultyScale';
import { Emoji } from '@/components/Emoji';
import ProgressionSelector from '@/components/ProgressionSelector';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface CompletedLevel {
  id: number;
  gridSize: { rows: number; cols: number };
  difficulty: number; // Numeric difficulty value
  isCompleted: boolean;
  moves: number;
  bestMoves?: number;
  timeSpent?: number;
  bestTime?: number;
  cards: any[][];
}

export default function ProgressScreen() {
  const { isDark } = useTheme();
  const { gameState, activeProgression, progressions } = useGame();
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<CompletedLevel | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showProgressionSelector, setShowProgressionSelector] = useState(false);

  const completedLevels = gameState.levels.filter((level) => level.isCompleted);

  const formatTime = (timeMs: number) => {
    const seconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  const handleLevelPress = (level: CompletedLevel) => {
    setSelectedLevel(level);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedLevel(null);
  };

  const renderLevelCard = ({ item }: { item: CompletedLevel }) => (
    <TouchableOpacity
      style={[styles.levelCard, { backgroundColor: isDark ? '#2c2c2e' : '#ffffff' }]}
      onPress={() => handleLevelPress(item)}
    >
      <View style={styles.levelHeader}>
        <Text style={[styles.levelTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          Level {item.id}
        </Text>
        <DifficultyScale
          difficulty={item.difficulty}
          levelNumber={item.id}
          width={80}
          height={12}
          showValue={false}
          showLabels={false}
        />
      </View>

      <Text style={[styles.gridInfo, { color: isDark ? '#8e8e93' : '#666666' }]}>
        {item.gridSize.rows}×{item.gridSize.cols} Grid (
        {(item.gridSize.rows * item.gridSize.cols) / 2} pairs)
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: isDark ? '#8e8e93' : '#666666' }]}>Moves</Text>
          <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#000000' }]}>
            {item.moves}
          </Text>
          {item.bestMoves && item.bestMoves !== item.moves && (
            <Text style={[styles.bestValue, { color: '#28a745' }]}>Best: {item.bestMoves}</Text>
          )}
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: isDark ? '#8e8e93' : '#666666' }]}>Time</Text>
          <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#000000' }]}>
            {item.timeSpent ? formatTime(item.timeSpent) : 'N/A'}
          </Text>
          {item.bestTime && item.bestTime !== item.timeSpent && (
            <Text style={[styles.bestValue, { color: '#28a745' }]}>
              Best: {formatTime(item.bestTime)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCompletedGrid = () => {
    if (!selectedLevel) return null;

    const cardSize = Math.min((screenWidth - 80) / selectedLevel.gridSize.cols, 60);

    return (
      <View style={styles.gridContainer}>
        {selectedLevel.cards.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {row.map((card, colIndex) => (
              <View
                key={colIndex}
                style={[
                  styles.completedCard,
                  {
                    width: cardSize,
                    height: cardSize,
                    backgroundColor: card.isMatched ? '#28a745' : '#dc3545',
                    borderColor: isDark ? '#48484a' : '#d1d1d6',
                  },
                ]}
              >
                <Emoji emoji={card.emoji} size={20} />
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const styles = getStyles(isDark);

  if (completedLevels.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>🎯</Text>
          <Text style={styles.emptyStateTitle}>No Completed Levels Yet</Text>
          <Text style={styles.emptyStateMessage}>
            Complete some levels to see your progress and achievements here!
          </Text>
          <TouchableOpacity style={styles.goHomeButton} onPress={() => router.push('/')}>
            <Text style={styles.goHomeButtonText}>🏠 Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progression Header */}
      <View style={styles.progressionHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { fontSize: 20 }]}>
            {activeProgression ? activeProgression.name : 'No Active Game'}
          </Text>
          {activeProgression && (
            <Text style={[styles.subtitle, { fontSize: 14, marginTop: 0 }]}>
              {completedLevels.length} level{completedLevels.length !== 1 ? 's' : ''} completed
            </Text>
          )}
        </View>
        {progressions.length > 1 && (
          <TouchableOpacity
            style={[styles.switchButton, { backgroundColor: isDark ? '#48484a' : '#e5e5e7' }]}
            onPress={() => setShowProgressionSelector(true)}
          >
            <Text style={{ color: isDark ? '#fff' : '#000', fontSize: 12 }}>Switch</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Progress & Achievements</Text>
      </View>

      <FlatList
        data={completedLevels}
        renderItem={renderLevelCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Progression Selector Modal */}
      <ProgressionSelector
        visible={showProgressionSelector}
        onClose={() => setShowProgressionSelector(false)}
      />

      {/* Modal for viewing completed level */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1c1c1e' : '#ffffff' }]}>
            {selectedLevel && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                      Level {selectedLevel.id} - Completed
                    </Text>
                    <DifficultyScale
                      difficulty={selectedLevel.difficulty}
                      levelNumber={selectedLevel.id}
                      width={100}
                      height={14}
                      showValue={true}
                      showLabels={false}
                    />
                  </View>
                  <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalStats}>
                  <View style={styles.modalStatItem}>
                    <Text
                      style={[styles.modalStatLabel, { color: isDark ? '#8e8e93' : '#666666' }]}
                    >
                      Grid Size
                    </Text>
                    <Text
                      style={[styles.modalStatValue, { color: isDark ? '#ffffff' : '#000000' }]}
                    >
                      {selectedLevel.gridSize.rows}×{selectedLevel.gridSize.cols}
                    </Text>
                  </View>

                  <View style={styles.modalStatItem}>
                    <Text
                      style={[styles.modalStatLabel, { color: isDark ? '#8e8e93' : '#666666' }]}
                    >
                      Moves
                    </Text>
                    <Text
                      style={[styles.modalStatValue, { color: isDark ? '#ffffff' : '#000000' }]}
                    >
                      {selectedLevel.moves}
                    </Text>
                    {selectedLevel.bestMoves && selectedLevel.bestMoves !== selectedLevel.moves && (
                      <Text style={[styles.bestValue, { color: '#28a745' }]}>
                        Best: {selectedLevel.bestMoves}
                      </Text>
                    )}
                  </View>

                  <View style={styles.modalStatItem}>
                    <Text
                      style={[styles.modalStatLabel, { color: isDark ? '#8e8e93' : '#666666' }]}
                    >
                      Time
                    </Text>
                    <Text
                      style={[styles.modalStatValue, { color: isDark ? '#ffffff' : '#000000' }]}
                    >
                      {selectedLevel.timeSpent ? formatTime(selectedLevel.timeSpent) : 'N/A'}
                    </Text>
                    {selectedLevel.bestTime &&
                      selectedLevel.bestTime !== selectedLevel.timeSpent && (
                        <Text style={[styles.bestValue, { color: '#28a745' }]}>
                          Best: {formatTime(selectedLevel.bestTime)}
                        </Text>
                      )}
                  </View>
                </View>

                <Text style={[styles.gridTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                  Completed Solution
                </Text>
                {renderCompletedGrid()}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#f8f9fa',
    },
    header: {
      padding: 20,
      paddingBottom: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? '#8e8e93' : '#666666',
    },
    listContainer: {
      padding: 20,
      paddingTop: 10,
    },
    levelCard: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    levelHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    levelTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    difficultyBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    difficultyText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    gridInfo: {
      fontSize: 14,
      marginBottom: 12,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statLabel: {
      fontSize: 12,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    bestValue: {
      fontSize: 12,
      fontWeight: '600',
      marginTop: 2,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyStateEmoji: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyStateTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 12,
      textAlign: 'center',
    },
    emptyStateMessage: {
      fontSize: 16,
      color: isDark ? '#8e8e93' : '#666666',
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 24,
    },
    goHomeButton: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    goHomeButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: screenWidth - 40,
      maxHeight: '80%',
      borderRadius: 16,
      padding: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDark ? '#48484a' : '#e5e5e7',
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: 16,
      color: isDark ? '#ffffff' : '#000000',
      fontWeight: 'bold',
    },
    modalStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 24,
      padding: 16,
      backgroundColor: isDark ? '#2c2c2e' : '#f8f9fa',
      borderRadius: 12,
    },
    modalStatItem: {
      alignItems: 'center',
      flex: 1,
    },
    modalStatLabel: {
      fontSize: 12,
      marginBottom: 4,
    },
    modalStatValue: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    gridTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
    },
    gridContainer: {
      alignItems: 'center',
    },
    gridRow: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    completedCard: {
      margin: 2,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
    },
    cardEmoji: {
      fontSize: 20,
    },
    // New multi-progression styles
    progressionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#48484a' : '#e5e5e7',
    },
    switchButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
  });
