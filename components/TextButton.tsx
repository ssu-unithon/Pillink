import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface TextButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function TextButton({
  title,
  onPress,
  color = '#6B7280',
  fontSize = 16,
  fontWeight = '500',
  style,
  textStyle
}: TextButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Text
        style={[
          styles.buttonText,
          {
            color: color,
            fontSize: fontSize,
            fontWeight: fontWeight,
          },
          textStyle
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
});
