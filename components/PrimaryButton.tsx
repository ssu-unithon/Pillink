import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, DimensionValue } from 'react-native';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  width?: DimensionValue;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function PrimaryButton({
  title,
  onPress,
  backgroundColor = '#6366F1',
  textColor = '#FFFFFF',
  width = '100%',
  disabled = false,
  style,
  textStyle
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled ? '#E5E7EB' : backgroundColor,
          width: width,
        },
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.buttonText,
          {
            color: disabled ? '#9CA3AF' : textColor,
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
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
