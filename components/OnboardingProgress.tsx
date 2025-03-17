import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface OnboardingProgressProps {
  steps: number;
  currentStep: number;
}

export default function OnboardingProgress({ steps, currentStep }: OnboardingProgressProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: steps }).map((_, index) => (
        <View 
          key={index} 
          style={[
            styles.step,
            index < currentStep ? styles.completedStep : 
            index === currentStep ? styles.activeStep : styles.inactiveStep
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  step: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 4,
    flex: 1,
  },
  activeStep: {
    backgroundColor: theme.colors.primary,
  },
  completedStep: {
    backgroundColor: theme.colors.primary,
  },
  inactiveStep: {
    backgroundColor: theme.colors.border,
  },
});