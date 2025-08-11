import React from 'react';
import { View, Switch, StyleSheet, Platform } from 'react-native';

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
}

export default function CustomSwitch({ value, onValueChange, disabled }: CustomSwitchProps) {
  return (
    <View style={styles.switchWrapper}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: '#E5E7EB', true: '#1877F2' }}
        thumbColor={Platform.OS === 'android' ? (value ? '#fff' : '#fff') : undefined}
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  switchWrapper: {
    // iOS 스타일에 맞게 여백 조정
    justifyContent: 'center',
    alignItems: 'center',
  },
});

