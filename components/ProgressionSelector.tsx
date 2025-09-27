import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ProgressionSummary } from '@/types/progression';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ProgressionSelectorProps {
  visible: boolean;
  onClose: () => void;
  onProgressionSelected?: (progressionId: string) => void;
}

export default function ProgressionSelector({
  visible,
  onClose,
  onProgressionSelected,
}: ProgressionSelectorProps) {
  const { isDark } = useTheme();
  const {
    progressions,
    activeProgression,
    createProgression,
    switchProgression,
    deleteProgression,
    getProgressionSummaries,
  } = useGame();
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newProgressionName, setNewProgressionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const progressionSummaries = getProgressionSummaries();

  const handleCreateProgression = async () => {
    if (!newProgressionName.trim()) {
      Alert.alert('Error', 'Please enter a name for the new game progression.');
      return;
    }

    if (progressions.some((p) => p.name === newProgressionName.trim())) {
      Alert.alert('Error', 'A game progression with this name already exists.');
      return;
    }

    setIsCreating(true);
    try {
      const newProgressionId = await createProgression(newProgressionName.trim());
      setNewProgressionName('');
      setShowCreateNew(false);
      onProgressionSelected?.(newProgressionId);
      onClose();
    } catch {
      Alert.alert('Error', 'Failed to create new game progression.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectProgression = (progressionId: string) => {
    if (progressionId !== activeProgression?.id) {
      switchProgression(progressionId);
    }
    onProgressionSelected?.(progressionId);
    onClose();
  };

  const handleDeleteProgression = (progressionId: string, progressionName: string) => {
    Alert.alert(
      'Delete Game Progression',
      `Are you sure you want to delete "${progressionName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProgression(progressionId),
        },
      ],
    );
  };

  const formatTime = (ms: number) => {
    if (ms === 0) return '0s';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatLastPlayed = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const renderProgressionItem = ({ item }: { item: ProgressionSummary }) => (
    <View
      style={[
        {
          padding: 16,
          marginVertical: 4,
          backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
          borderRadius: 8,
          borderWidth: activeProgression?.id === item.id ? 2 : 0,
          borderColor: activeProgression?.id === item.id ? '#007AFF' : 'transparent',
        },
      ]}
    >
      <TouchableOpacity onPress={() => handleSelectProgression(item.id)}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: isDark ? '#fff' : '#000',
                marginBottom: 4,
              }}
            >
              {item.name}
              {activeProgression?.id === item.id && (
                <Text style={{ color: '#007AFF', fontWeight: 'normal' }}> (Active)</Text>
              )}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: isDark ? '#ccc' : '#666',
                marginBottom: 2,
              }}
            >
              Level {item.currentLevel} • {item.completedLevels} completed
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: isDark ? '#aaa' : '#888',
              }}
            >
              {item.totalMoves} moves • {formatTime(item.totalTime)} •{' '}
              {formatLastPlayed(item.lastPlayed)}
            </Text>
          </View>
          {progressions.length > 1 && (
            <TouchableOpacity
              style={{
                padding: 8,
                marginLeft: 8,
              }}
              onPress={() => handleDeleteProgression(item.id, item.name)}
            >
              <Text style={{ color: '#FF3B30', fontSize: 16 }}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} animationType='slide' transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: isDark ? '#1a1a1a' : '#fff',
            borderRadius: 12,
            padding: 20,
            maxHeight: '80%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: isDark ? '#fff' : '#000',
              }}
            >
              Game Progressions
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ fontSize: 18, color: '#007AFF' }}>Done</Text>
            </TouchableOpacity>
          </View>

          {showCreateNew ? (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: isDark ? '#fff' : '#000',
                  marginBottom: 8,
                }}
              >
                Create New Game Progression
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: isDark ? '#444' : '#ddd',
                  backgroundColor: isDark ? '#2a2a2a' : '#fff',
                  color: isDark ? '#fff' : '#000',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                  marginBottom: 12,
                }}
                placeholder='Enter progression name'
                placeholderTextColor={isDark ? '#888' : '#666'}
                value={newProgressionName}
                onChangeText={setNewProgressionName}
                maxLength={50}
              />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#007AFF',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    opacity: isCreating ? 0.6 : 1,
                  }}
                  onPress={handleCreateProgression}
                  disabled={isCreating}
                >
                  <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
                    {isCreating ? 'Creating...' : 'Create'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: isDark ? '#444' : '#f0f0f0',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                  }}
                  onPress={() => {
                    setShowCreateNew(false);
                    setNewProgressionName('');
                  }}
                >
                  <Text
                    style={{
                      color: isDark ? '#fff' : '#000',
                      textAlign: 'center',
                      fontWeight: '600',
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: '#34C759',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                marginBottom: 20,
              }}
              onPress={() => setShowCreateNew(true)}
            >
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
                + Create New Game Progression
              </Text>
            </TouchableOpacity>
          )}

          <FlatList
            data={progressionSummaries}
            keyExtractor={(item) => item.id}
            renderItem={renderProgressionItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text
                style={{
                  color: isDark ? '#888' : '#666',
                  textAlign: 'center',
                  fontStyle: 'italic',
                  marginTop: 20,
                }}
              >
                No game progressions yet. Create one to get started!
              </Text>
            }
          />
        </View>
      </View>
    </Modal>
  );
}
