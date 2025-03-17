import React from 'react';
import { StyleSheet, Text, Pressable, View, Animated } from 'react-native';
import { MoodRating } from '../types';
import { theme } from '../theme/theme';

interface MoodButtonProps {
  rating: MoodRating;
  label: string;
  emoji: string;
  selected?: boolean;
  onPress?: () => void;
}

export default function MoodButton({ 
  rating, 
  label, 
  emoji, 
  selected = false, 
  onPress 
}: MoodButtonProps) {
  // Get mood color based on rating
  const getMoodColor = (rating: MoodRating) => {
    switch(rating) {
      case 1: return theme.colors.mood1;
      case 2: return theme.colors.mood2;
      case 3: return theme.colors.mood3;
      case 4: return theme.colors.mood4;
      case 5: return theme.colors.mood5;
      default: return theme.colors.primary;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        selected && [styles.selected, { backgroundColor: getMoodColor(rating) }],
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.emoji,
        selected && styles.selectedEmoji,
        { transform: [{ scale: selected ? 1.2 : 1 }] }
      ]}>
        {emoji}
      </Text>
      <Text style={[
        styles.label,
        selected && styles.selectedLabel
      ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.card,
    width: 70,
    height: 90,
    margin: theme.spacing.xs,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border,
    transition: 'all 0.3s',
  },
  selected: {
    ...theme.shadows.medium,
    transform: [{ scale: 1.1 }],
    borderWidth: 0,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  emoji: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  selectedEmoji: {
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
    textAlign: 'center',
  },
  selectedLabel: {
    color: 'white',
    fontWeight: theme.fontWeights.bold,
  },
});