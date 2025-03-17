import React from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import { Activity } from '../types';
import { theme } from '../theme/theme';
import PremiumFeatureBadge from './PremiumFeatureBadge';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

interface ActivityCardProps {
  activity: Activity;
  onPress?: () => void;
  isPremiumUser?: boolean;
}

export default function ActivityCard({ activity, onPress, isPremiumUser = false }: ActivityCardProps) {
  // Get icon based on activity category
  const getCategoryIcon = (category: Activity['category']) => {
    switch (category) {
      case 'mindfulness': return '🧘‍♀️';
      case 'exercise': return '🏃‍♂️';
      case 'social': return '👥';
      case 'creative': return '🎨';
      case 'relaxation': return '🛀';
      default: return '✨';
    }
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        activity.isPremium && !isPremiumUser && styles.premiumContainer,
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
      ]} 
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getCategoryIcon(activity.category)}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>{activity.title}</Text>
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>{activity.duration} min</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={3}>
          {activity.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={[styles.categoryBadge, getCategoryStyle(activity.category)]}>
            <Text style={styles.categoryText}>
              {capitalizeFirstLetter(activity.category)}
            </Text>
          </View>
          
          <View style={styles.impactContainer}>
            <Text style={styles.impactLabel}>Impact: </Text>
            <Text style={[styles.impactValue, getImpactStyle(activity.moodImpact)]}>
              {capitalizeFirstLetter(activity.moodImpact)}
            </Text>
          </View>
        </View>
        
        {/* Premium badge for premium activities */}
        {activity.isPremium && !isPremiumUser && (
          <View style={styles.premiumBadgeContainer}>
            <PremiumFeatureBadge
              featureName="Premium Activity"
              featureDescription="This activity is only available to premium users. Upgrade to access this and many more premium activities."
              onUpgrade={onPress || (() => {})}
              small
            />
          </View>
        )}
      </View>
    </Pressable>
  );
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCategoryStyle(category: Activity['category']) {
  switch (category) {
    case 'mindfulness':
      return { backgroundColor: '#1A3A40' }; // Dark cyan
    case 'exercise':
      return { backgroundColor: '#1A3B1E' }; // Dark green
    case 'social':
      return { backgroundColor: '#3A2E1A' }; // Dark orange
    case 'creative':
      return { backgroundColor: '#2E1A3A' }; // Dark purple
    case 'relaxation':
      return { backgroundColor: '#1A2E3A' }; // Dark blue
    default:
      return {};
  }
}

function getImpactStyle(impact: Activity['moodImpact']) {
  switch (impact) {
    case 'low':
      return { color: theme.colors.info };
    case 'medium':
      return { color: theme.colors.warning };
    case 'high':
      return { color: theme.colors.success };
    default:
      return {};
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    ...theme.shadows.medium,
    overflow: 'hidden',
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16, // Increased margin between cards
    minHeight: 160, // Added minimum height to make cards bigger
  },
  premiumContainer: {
    borderColor: theme.colors.premium,
    borderWidth: 1,
  },
  iconContainer: {
    width: 70, // Increased width for better visibility
    backgroundColor: theme.colors.primary + '33', // 20% opacity
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  icon: {
    fontSize: 32, // Increased size
  },
  content: {
    flex: 1,
    padding: 16, // Increased padding
    justifyContent: 'space-between', // Better spacing of content
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Changed to flex-start to align with top of title
    marginBottom: 10, // Increased margin
  },
  title: {
    fontSize: 18, // Increased font size
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    flex: 1,
    marginRight: 10,
    lineHeight: 24, // Added line height for better readability
  },
  durationContainer: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 2, // Added to align better with title
  },
  duration: {
    color: 'white',
    fontSize: 12,
    fontWeight: theme.fontWeights.medium,
  },
  description: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginBottom: 12, // Increased margin
    lineHeight: 20, // Increased line height
    flex: 1, // Allow description to take available space
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4, // Added margin top
    marginBottom: 8, // Increased margin
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4, // Increased padding
    borderRadius: 6, // Increased border radius
  },
  categoryText: {
    fontSize: 12,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
  },
  impactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactLabel: {
    fontSize: 12,
    color: theme.colors.subtext,
  },
  impactValue: {
    fontSize: 12,
    fontWeight: theme.fontWeights.semibold,
  },
  premiumBadgeContainer: {
    marginTop: 6,
  }
});