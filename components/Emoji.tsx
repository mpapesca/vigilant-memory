import React from 'react';
import { Text, TextStyle } from 'react-native';

interface EmojiProps {
  emoji: string;
  size?: number;
  style?: TextStyle;
}

export const Emoji: React.FC<EmojiProps> = ({ emoji, size = 24, style }) => {
  return (
    <Text
      style={[
        {
          fontSize: size,
          fontFamily: 'System', // Use system emoji font
          textAlign: 'center',
          includeFontPadding: false,
          textAlignVertical: 'center',
        },
        style,
      ]}
    >
      {emoji}
    </Text>
  );
};

export default Emoji;
