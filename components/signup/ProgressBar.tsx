
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <View style={styles.progressBarBg}>
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  progressBarBg: {
    height: 10,
    backgroundColor: '#F1F3F6',
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 36,
    marginTop: 0,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#1976F7',
    borderRadius: 5,
  },
});
