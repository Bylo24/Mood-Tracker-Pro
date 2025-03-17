import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { getExerciseById } from '../data/exercisesData';
import { exerciseContent } from '../data/exerciseStepsData';
import { ExerciseStep } from '../types';

const { width: screenWidth } = Dimensions.get('window');

interface ExercisePlayerScreenProps {
  navigation: any;
  route: any;
}

export default function ExercisePlayerScreen({ navigation, route }: ExercisePlayerScreenProps) {
  const { exerciseId } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [exercise, setExercise] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exerciseSteps, setExerciseSteps] = useState<ExerciseStep[]>([]);
  const [currentStepTimeRemaining, setCurrentStepTimeRemaining] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadExercise = async () => {
      setIsLoading(true);
      try {
        const exerciseData = getExerciseById(exerciseId);
        if (exerciseData) {
          setExercise(exerciseData);
          
          // Get the specific steps for this exercise or use default
          const steps = exerciseContent[exerciseId] || exerciseContent.default;
          setExerciseSteps(steps);
          
          // Calculate total duration
          const total = steps.reduce((sum, step) => sum + step.duration, 0);
          setTotalDuration(total);
          setTimeRemaining(total);
          
          // Set initial step time remaining
          setCurrentStepTimeRemaining(steps[0].duration);
        }
      } catch (error) {
        console.error('Error loading exercise:', error);
        Alert.alert('Error', 'Failed to load exercise content. Please try again.');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };

    loadExercise();
    
    return () => {
      // Clean up timer on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [exerciseId]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = Math.max(0, prev - 1);
          
          // Update elapsed time
          setElapsedTime(totalDuration - newTime);
          
          // Calculate overall progress
          setProgress((totalDuration - newTime) / totalDuration);
          
          // Update current step time remaining
          setCurrentStepTimeRemaining(prevStepTime => {
            const newStepTime = Math.max(0, prevStepTime - 1);
            
            // If current step is complete, move to next step
            if (newStepTime === 0 && currentStep < exerciseSteps.length - 1) {
              setCurrentStep(prevStep => {
                const nextStep = prevStep + 1;
                // Set the time remaining for the new step
                setCurrentStepTimeRemaining(exerciseSteps[nextStep].duration);
                return nextStep;
              });
            }
            
            return newStepTime;
          });
          
          // If overall exercise is complete
          if (newTime === 0) {
            setIsPlaying(false);
            clearInterval(timerRef.current!);
            
            // Show completion alert
            setTimeout(() => {
              Alert.alert(
                'Exercise Complete',
                'Great job! You have completed this exercise.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            }, 500);
          }
          
          return newTime;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentStep, exerciseSteps, totalDuration]);

  // Handle manual step change
  const handleStepChange = (newStep: number) => {
    if (newStep < 0 || newStep >= exerciseSteps.length) return;
    
    // Calculate time adjustment
    let timeToAdjust = 0;
    
    if (newStep > currentStep) {
      // Moving forward - subtract time for skipped steps
      for (let i = currentStep; i < newStep; i++) {
        timeToAdjust += currentStepTimeRemaining;
        if (i + 1 < exerciseSteps.length) {
          timeToAdjust += exerciseSteps[i + 1].duration;
        }
      }
      setTimeRemaining(prev => Math.max(0, prev - timeToAdjust));
    } else {
      // Moving backward - add time for previous steps
      for (let i = currentStep - 1; i >= newStep; i--) {
        timeToAdjust += exerciseSteps[i].duration;
      }
      setTimeRemaining(prev => Math.min(totalDuration, prev + timeToAdjust));
    }
    
    // Update current step
    setCurrentStep(newStep);
    setCurrentStepTimeRemaining(exerciseSteps[newStep].duration);
    
    // Update elapsed time and progress
    const newElapsedTime = totalDuration - (timeRemaining + timeToAdjust);
    setElapsedTime(newElapsedTime);
    setProgress(newElapsedTime / totalDuration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleClose = () => {
    if (isPlaying) {
      Alert.alert(
        'Exit Exercise',
        'Are you sure you want to exit? Your progress will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

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

  if (isLoading || !exercise) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading exercise...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleClose}
        >
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
          {exercise.title}
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.exerciseInfoCard}>
          <View style={styles.exerciseInfoHeader}>
            <View style={[styles.exerciseIconContainer, { backgroundColor: getTypeColor(exercise.type) }]}>
              <Ionicons name={getTypeIcon(exercise.type)} size={28} color="#fff" />
            </View>
            <View style={styles.exerciseInfoContent}>
              <Text style={styles.exerciseTitle} numberOfLines={2} ellipsizeMode="tail">
                {exercise.title}
              </Text>
              <Text style={styles.exerciseType}>
                {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)} • {exercise.duration}
              </Text>
            </View>
          </View>
          <Text style={styles.exerciseDescription}>
            {exercise.description}
          </Text>
        </View>
        
        <View style={styles.instructionCard}>
          <View style={styles.stepProgress}>
            <Text style={styles.stepCounter}>
              Step {currentStep + 1} of {exerciseSteps.length}
            </Text>
            <Text style={styles.stepTimer}>
              {formatTime(currentStepTimeRemaining)}
            </Text>
          </View>
          <Text style={styles.stepTitle} numberOfLines={2} ellipsizeMode="tail">
            {exerciseSteps[currentStep].title}
          </Text>
          <Text style={styles.instruction}>
            {exerciseSteps[currentStep].instruction}
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress * 100}%`, backgroundColor: getTypeColor(exercise.type) }
              ]} 
            />
          </View>
          <View style={styles.timeDisplay}>
            <Text style={styles.timeElapsed}>{formatTime(elapsedTime)}</Text>
            <Text style={styles.timeRemaining}>{formatTime(timeRemaining)}</Text>
          </View>
        </View>
        
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={() => handleStepChange(currentStep - 1)}
            disabled={currentStep === 0}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={currentStep === 0 ? theme.colors.subtext : theme.colors.text} 
            />
            <Text 
              style={[
                styles.controlButtonText, 
                currentStep === 0 && { color: theme.colors.subtext }
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, styles.primaryButton, { backgroundColor: getTypeColor(exercise.type) }]}
            onPress={handlePlayPause}
          >
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={24} 
              color="#fff" 
            />
            <Text style={[styles.controlButtonText, { color: "#fff" }]}>
              {isPlaying ? "Pause" : "Play"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={() => handleStepChange(currentStep + 1)}
            disabled={currentStep === exerciseSteps.length - 1}
          >
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={currentStep === exerciseSteps.length - 1 ? theme.colors.subtext : theme.colors.text} 
            />
            <Text 
              style={[
                styles.controlButtonText, 
                currentStep === exerciseSteps.length - 1 && { color: theme.colors.subtext }
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>Exercise Steps</Text>
          {exerciseSteps.map((step, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.stepItem,
                currentStep === index && styles.activeStepItem
              ]}
              onPress={() => handleStepChange(index)}
            >
              <View style={[
                styles.stepNumberContainer,
                currentStep === index && { backgroundColor: getTypeColor(exercise.type) + '40' }
              ]}>
                <Text style={[
                  styles.stepNumber,
                  currentStep === index && { color: getTypeColor(exercise.type) }
                ]}>
                  {index + 1}
                </Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[
                  styles.stepItemTitle,
                  currentStep === index && { color: getTypeColor(exercise.type), fontWeight: theme.fontWeights.bold }
                ]} numberOfLines={1} ellipsizeMode="tail">
                  {step.title}
                </Text>
                <Text style={styles.stepDuration}>{formatTime(step.duration)}</Text>
              </View>
              {currentStep === index && (
                <Ionicons name="play-circle" size={20} color={getTypeColor(exercise.type)} />
              )}
              {index < currentStep && (
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
              )}
            </TouchableOpacity>
          ))}
        </View>
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
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    flex: 1, // Added to ensure title is centered
    textAlign: 'center', // Added to center text
    paddingHorizontal: 8, // Added to prevent text from being cut off
    lineHeight: 24, // Added for better text rendering
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.subtext,
    textAlign: 'center', // Added to center text
    lineHeight: 22, // Added for better text rendering
  },
  exerciseInfoCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...theme.shadows.medium,
  },
  exerciseInfoHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  exerciseIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  exerciseInfoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 4,
    lineHeight: 26, // Added for better text rendering
  },
  exerciseType: {
    fontSize: 14,
    color: theme.colors.subtext,
    lineHeight: 20, // Added for better text rendering
  },
  exerciseDescription: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22, // Added for better text rendering
  },
  instructionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...theme.shadows.medium,
  },
  stepProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepCounter: {
    fontSize: 14,
    color: theme.colors.subtext,
    lineHeight: 20, // Added for better text rendering
  },
  stepTimer: {
    fontSize: 14,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
    lineHeight: 20, // Added for better text rendering
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 28, // Added for better text rendering
    paddingHorizontal: 4, // Added to prevent text from being cut off
  },
  instruction: {
    fontSize: 17, // Reduced from 18 for better fit on mobile
    color: theme.colors.text,
    lineHeight: 24, // Adjusted from 26 for better text rendering
    textAlign: 'center',
    paddingHorizontal: 4, // Added to prevent text from being cut off
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  timeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeElapsed: {
    fontSize: 14,
    color: theme.colors.subtext,
    lineHeight: 20, // Added for better text rendering
  },
  timeRemaining: {
    fontSize: 14,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    lineHeight: 20, // Added for better text rendering
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  primaryButton: {
    ...theme.shadows.small,
  },
  secondaryButton: {
    backgroundColor: theme.colors.card,
    ...theme.shadows.small,
  },
  controlButtonText: {
    fontSize: 15, // Reduced from 16 for better fit on mobile
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginLeft: 4,
    lineHeight: 20, // Added for better text rendering
  },
  stepsContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    ...theme.shadows.medium,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 12,
    lineHeight: 24, // Added for better text rendering
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activeStepItem: {
    backgroundColor: theme.colors.background + '80',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  stepNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    lineHeight: 18, // Added for better text rendering
  },
  stepContent: {
    flex: 1,
    paddingRight: 8, // Added to prevent text from being cut off
  },
  stepItemTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: 2,
    lineHeight: 22, // Added for better text rendering
  },
  stepDuration: {
    fontSize: 14,
    color: theme.colors.subtext,
    lineHeight: 18, // Added for better text rendering
  },
});