import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView, 
  StatusBar,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { MoodRating } from '../types';
import { getTodayMoodEntry } from '../services/moodService';
import { Exercise, mockExercises, getExercisesByCategory } from '../data/exercisesData';
import { getExerciseRecommendations } from '../services/geminiExerciseService';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

interface GuidedExercisesScreenProps {
  navigation: any;
  route: any;
}

export default function GuidedExercisesScreen({ navigation, route }: GuidedExercisesScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentMood, setCurrentMood] = useState<MoodRating | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isPremium, setIsPremium] = useState(route.params?.isPremium || false);
  const [moodDetails, setMoodDetails] = useState<string>('');

  useEffect(() => {
    const loadExercises = async () => {
      setIsLoading(true);
      try {
        // Get today's mood entry
        const todayMood = await getTodayMoodEntry();
        if (todayMood) {
          setCurrentMood(todayMood.rating);
          setMoodDetails(todayMood.details || '');
        }

        // Get Gemini-powered exercise recommendations
        const recommendedExercises = await getExerciseRecommendations();
        
        // Filter out premium exercises if user is not premium
        const filteredExercises = isPremium 
          ? recommendedExercises 
          : recommendedExercises.filter(ex => !ex.isPremium);
        
        setExercises(filteredExercises);
      } catch (error) {
        console.error('Error loading exercises:', error);
        // Fallback to default exercises
        setExercises(mockExercises.filter(ex => !ex.isPremium || isPremium).slice(0, 6));
      } finally {
        setIsLoading(false);
      }
    };

    loadExercises();
  }, [isPremium]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meditation':
        return 'flower-outline';
      case 'breathing':
        return 'water-outline';``
      case 'mindfulness':
        return 'leaf-outline';
      case 'physical':
        return 'body-outline';
      default:
        return 'flower-outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meditation':
        return theme.colors.primary;
      case 'breathing':
        return '#4FC3F7';
      case 'mindfulness':
        return '#66BB6A';
      case 'physical':
        return '#FF7043';
      default:
        return theme.colors.primary;
    }
  };

  const handleExercisePress = (exercise: Exercise) => {
    console.log('Exercise pressed:', exercise.title);
    
    if (exercise.isPremium && !isPremium) {
      navigation.navigate('SubscriptionComparison', { source: 'upgrade' });
    } else {
      // Navigate to the exercise player screen
      navigation.navigate('ExercisePlayer', { exerciseId: exercise.id });
    }
  };

  const handleCategoryPress = (category: 'meditation' | 'breathing' | 'mindfulness' | 'physical') => {
    // Navigate to the category screen
    navigation.navigate('ExerciseCategory', { 
      category, 
      isPremium 
    });
  };

  const getMoodMessage = () => {
    if (!currentMood) return "Explore our guided exercises";
    
    switch (currentMood) {
      case 1:
        return "Exercises to help lift your mood";
      case 2:
        return "Practices to ease your mind";
      case 3:
        return "Mindfulness for your balanced state";
      case 4:
        return "Exercises to maintain your positive energy";
      case 5:
        return "Practices to celebrate your great mood";
      default:
        return "Explore our guided exercises";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guided Exercises</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introSection}>
          <Text style={styles.greeting}>{getMoodMessage()}</Text>
          <Text style={styles.subGreeting}>
            {currentMood 
              ? "These exercises are tailored to how you're feeling today."
              : "Check in with your mood to get personalized recommendations."}
          </Text>
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading exercises for you...</Text>
          </View>
        ) : (
          <>
            <View style={styles.categoriesContainer}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.categoriesGrid}>
                {['meditation', 'breathing', 'mindfulness', 'physical'].map((type) => (
                  <TouchableOpacity 
                    key={type} 
                    style={styles.categoryButton}
                    onPress={() => handleCategoryPress(type as 'meditation' | 'breathing' | 'mindfulness' | 'physical')}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: getTypeColor(type) }]}>
                      <Ionicons name={getTypeIcon(type)} size={20} color="#fff" />
                    </View>
                    <Text style={styles.categoryText}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                    <View style={styles.viewAllContainer}>
                      <Text style={styles.viewAllText}>View All</Text>
                      <Ionicons name="chevron-forward" size={12} color={theme.colors.subtext} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.exercisesContainer}>
              <Text style={styles.sectionTitle}>Recommended for You</Text>
              
              {exercises.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No exercises found for your current mood. Try checking in with your mood first.
                  </Text>
                </View>
              ) : (
                exercises.map((exercise) => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={styles.exerciseCard}
                    onPress={() => handleExercisePress(exercise)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.exerciseContent}>
                      <View style={[styles.exerciseIconContainer, { backgroundColor: getTypeColor(exercise.type) }]}>
                        <Ionicons name={getTypeIcon(exercise.type)} size={24} color="#fff" />
                      </View>
                      <View style={styles.exerciseDetails}>
                        <View style={styles.exerciseHeader}>
                          <Text style={styles.exerciseTitle} numberOfLines={1} ellipsizeMode="tail">
                            {exercise.title}
                          </Text>
                          {exercise.isPremium && !isPremium && (
                            <View style={styles.premiumBadge}>
                              <Text style={styles.premiumText}>PREMIUM</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.exerciseDescription} numberOfLines={2} ellipsizeMode="tail">
                          {exercise.description}
                        </Text>
                        <View style={styles.exerciseFooter}>
                          <Text style={styles.exerciseDuration}>
                            <Ionicons name="time-outline" size={14} color={theme.colors.subtext} /> {exercise.duration}
                          </Text>
                          <Text style={styles.exerciseType}>
                            {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
            
            {!isPremium && (
              <TouchableOpacity 
                style={styles.upgradeButton}
                onPress={() => navigation.navigate('SubscriptionComparison', { source: 'upgrade' })}
              >
                <Text style={styles.upgradeButtonText}>Upgrade to Premium for More Exercises</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingHorizontal: screenWidth * 0.05,
    paddingTop: 16,
    paddingBottom: 32,
  },
  introSection: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22, // Reduced from 24 for better mobile fit
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 8,
    lineHeight: 28, // Added for better text rendering
  },
  subGreeting: {
    fontSize: 16,
    color: theme.colors.subtext,
    lineHeight: 22, // Added for better text rendering
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 16,
    lineHeight: 24, // Added for better text rendering
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    alignItems: 'center',
    width: '48%', // Changed from 22% to 48% for a 2x2 grid instead of a row
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12, // Increased from 10 for better touch targets
    marginBottom: 12, // Added to create space between rows
    ...theme.shadows.small,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14, // Increased from 12 for better readability
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 20, // Added for better text rendering
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllText: {
    fontSize: 12, // Increased from 10 for better readability
    color: theme.colors.subtext,
    marginRight: 2,
    lineHeight: 16, // Added for better text rendering
  },
  exercisesContainer: {
    marginBottom: 24,
  },
  exerciseCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    marginBottom: 16,
    ...theme.shadows.medium,
  },
  exerciseContent: {
    flexDirection: 'row',
    padding: 16,
  },
  exerciseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 22, // Added for better text rendering
    paddingRight: 4, // Added to prevent text from being cut off
  },
  premiumBadge: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: theme.fontWeights.bold,
    color: '#fff',
    lineHeight: 14, // Added for better text rendering
  },
  exerciseDescription: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginBottom: 8,
    lineHeight: 20, // Added for better text rendering
  },
  exerciseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseDuration: {
    fontSize: 12,
    color: theme.colors.subtext,
    lineHeight: 16, // Added for better text rendering
  },
  exerciseType: {
    fontSize: 12,
    color: theme.colors.subtext,
    lineHeight: 16, // Added for better text rendering
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.subtext,
    textAlign: 'center', // Added for better text alignment
    lineHeight: 22, // Added for better text rendering
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.subtext,
    textAlign: 'center',
    lineHeight: 22, // Added for better text rendering
  },
  upgradeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: '#fff',
    lineHeight: 22, // Added for better text rendering
  },
});