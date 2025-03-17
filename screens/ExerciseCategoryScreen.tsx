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
import { Exercise, getExercisesByCategory } from '../data/exercisesData';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

interface ExerciseCategoryScreenProps {
  navigation: any;
  route: any;
}

export default function ExerciseCategoryScreen({ navigation, route }: ExerciseCategoryScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const { category, isPremium = false } = route.params;

  useEffect(() => {
    const loadExercises = async () => {
      setIsLoading(true);
      try {
        // Get exercises for this category
        const categoryExercises = getExercisesByCategory(category, isPremium);
        setExercises(categoryExercises);
      } catch (error) {
        console.error('Error loading exercises:', error);
        setExercises([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadExercises();
  }, [category, isPremium]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meditation':
        return 'flower-outline';
      case 'breathing':
        return 'water-outline';
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

  const getCategoryTitle = () => {
    return category.charAt(0).toUpperCase() + category.slice(1) + ' Exercises';
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
        <Text style={styles.headerTitle}>{getCategoryTitle()}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introSection}>
          <Text style={styles.greeting}>{getCategoryTitle()}</Text>
          <Text style={styles.subGreeting}>
            Explore our collection of {category.toLowerCase()} exercises designed to help you feel better.
          </Text>
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading exercises for you...</Text>
          </View>
        ) : (
          <>
            <View style={styles.exercisesContainer}>
              {exercises.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No {category} exercises found. Try checking out other categories.
                  </Text>
                </View>
              ) : (
                exercises.map((exercise) => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={styles.exerciseCard}
                    onPress={() => handleExercisePress(exercise)}
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
    flex: 1, // Added to ensure title is centered
    paddingHorizontal: 8, // Added to prevent text from being cut off
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