import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getSettingsStyles } from '@/styles/styles';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Settings() {
  const { themeMode, isDark, setThemeMode } = useTheme();
  const { resetGame, getLevelProgress, startLevel, currentLevel } = useGame();
  const styles = getSettingsStyles(isDark);

  const progress = getLevelProgress();
  const [levelInput, setLevelInput] = useState(currentLevel?.id?.toString() || '1');

  const handleLevelChange = (text: string) => {
    setLevelInput(text.replace(/[^0-9]/g, ''));
  };

  const handleLevelSelect = () => {
    const levelNum = parseInt(levelInput, 10);
    if (!isNaN(levelNum) && levelNum > 0) {
      startLevel(levelNum);
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      `Are you sure you want to reset all your progress? This will delete:\n\n• All completed levels (${progress.completed})\n• All saved game data\n• Current level progress\n\nThis action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset Progress',
          style: 'destructive',
          onPress: () => {
            resetGame();
            Alert.alert('Progress Reset', 'Your game progress has been reset successfully.', [
              { text: 'OK' },
            ]);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingSection}>
        <Text style={styles.settingText}>Jump to Level</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 8,
              width: 80,
              marginRight: 10,
              color: isDark ? '#fff' : '#222',
              backgroundColor: isDark ? '#222' : '#fff',
            }}
            keyboardType='numeric'
            value={levelInput}
            onChangeText={handleLevelChange}
            onSubmitEditing={handleLevelSelect}
            returnKeyType='done'
            placeholder='Level #'
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#007AFF',
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 8,
            }}
            onPress={handleLevelSelect}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Go</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.themeButtonText, { opacity: 0.7, fontSize: 12 }]}>
          Current: Level {currentLevel?.id}
        </Text>
        <Text style={styles.settingText}>Theme Mode</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.themeButton, themeMode === 'system' && styles.themeButtonActive]}
            onPress={() => setThemeMode('system')}
          >
            <Text
              style={[
                styles.themeButtonText,
                themeMode === 'system' && styles.themeButtonTextActive,
              ]}
            >
              System
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.themeButton, themeMode === 'light' && styles.themeButtonActive]}
            onPress={() => setThemeMode('light')}
          >
            <Text
              style={[
                styles.themeButtonText,
                themeMode === 'light' && styles.themeButtonTextActive,
              ]}
            >
              Light
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.themeButton, themeMode === 'dark' && styles.themeButtonActive]}
            onPress={() => setThemeMode('dark')}
          >
            <Text
              style={[styles.themeButtonText, themeMode === 'dark' && styles.themeButtonTextActive]}
            >
              Dark
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingSection}>
        <Text style={styles.settingText}>Game Progress</Text>
        <Text style={[styles.themeButtonText, { marginBottom: 15, opacity: 0.7 }]}>
          Current Progress: {progress.completed} levels completed
        </Text>
        <TouchableOpacity
          style={[
            styles.themeButton,
            {
              backgroundColor: '#dc3545',
              borderColor: '#dc3545',
              borderWidth: 1,
              flex: 0,
              width: '100%',
            },
          ]}
          onPress={handleResetProgress}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#ffffff',
              textAlign: 'center',
            }}
          >
            🗑️ Reset All Progress
          </Text>
        </TouchableOpacity>
        <Text style={[styles.themeButtonText, { marginTop: 8, opacity: 0.6, fontSize: 12 }]}>
          This will permanently delete all your game progress
        </Text>
      </View>
    </View>
  );
}