
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number;
  steps?: string[];
  currentStep?: number;
}

export default function ProgressBar({ progress, steps, currentStep }: ProgressBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      {steps && (
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={[
                styles.stepCircle,
                currentStep && index <= currentStep ? styles.stepCircleActive : styles.stepCircleInactive
              ]}>
                <Text style={[
                  styles.stepNumber,
                  currentStep && index <= currentStep ? styles.stepNumberActive : styles.stepNumberInactive
                ]}>
                  {index + 1}
                </Text>
              </View>
              <Text style={[
                styles.stepLabel,
                currentStep && index <= currentStep ? styles.stepLabelActive : styles.stepLabelInactive
              ]}>
                {step}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 36,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#F1F3F6',
    borderRadius: 5,
    marginBottom: 16,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#1976F7',
    borderRadius: 5,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepCircleActive: {
    backgroundColor: '#1976F7',
  },
  stepCircleInactive: {
    backgroundColor: '#E5E7EB',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepNumberInactive: {
    color: '#9CA3AF',
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#1976F7',
    fontWeight: '600',
  },
  stepLabelInactive: {
    color: '#9CA3AF',
  },
});
