import { getDifficultyColor, getDifficultyPosition, getLevelDifficultyRange } from '@/utils/gameLogic';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DifficultyScaleProps {
  difficulty: number;
  levelNumber: number; // Now required for level-relative scaling
  width?: number;
  height?: number;
  showValue?: boolean;
  showLabels?: boolean;
}

export function DifficultyScale({ 
  difficulty, 
  levelNumber,
  width = 120, 
  height = 20, 
  showValue = true,
  showLabels = true 
}: DifficultyScaleProps) {
  // Handle undefined or invalid difficulty values
  const safeDifficulty = typeof difficulty === 'number' && !isNaN(difficulty) ? difficulty : levelNumber * 0.9;
  
  const position = getDifficultyPosition(safeDifficulty, levelNumber);
  const color = getDifficultyColor(safeDifficulty, levelNumber);
  
  // Get the level-specific difficulty range
  const difficultyRange = getLevelDifficultyRange(levelNumber);
  
  return (
    <View style={styles.container}>
      {showLabels && (
        <View style={[styles.labelsContainer, { width }]}>
          <Text style={styles.labelText}>{difficultyRange.MIN.toFixed(1)}</Text>
          <Text style={styles.labelText}>{difficultyRange.MAX.toFixed(1)}</Text>
        </View>
      )}
      
      <View style={[styles.scaleContainer, { width, height }]}>
        {/* Background gradient bar */}
        <View style={[styles.scaleBackground, { width, height }]}>
          {/* Create gradient segments */}
          {Array.from({ length: 20 }, (_, i) => {
            const segmentPosition = i / 19;
            const segmentDifficulty = difficultyRange.MIN + segmentPosition * (difficultyRange.MAX - difficultyRange.MIN);
            const segmentColor = getDifficultyColor(segmentDifficulty, levelNumber);
            return (
              <View
                key={i}
                style={[
                  styles.gradientSegment,
                  {
                    backgroundColor: segmentColor,
                    width: width / 20,
                    height,
                  },
                ]}
              />
            );
          })}
        </View>
        
        {/* Difficulty indicator */}
        <View
          style={[
            styles.indicator,
            {
              left: position * (width - 8), // -8 for indicator width
              backgroundColor: color,
            },
          ]}
        />
      </View>
      
      {showValue && (
        <Text style={styles.valueText}>{safeDifficulty.toFixed(1)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  labelText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  scaleContainer: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  scaleBackground: {
    flexDirection: 'row',
  },
  gradientSegment: {
    // Individual gradient segments
  },
  indicator: {
    position: 'absolute',
    top: -2,
    width: 8,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  valueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
});