import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Alert, 
  Platform, 
  ToastAndroid
} from 'react-native';
import Slider from '@react-native-community/slider';
import { MoodRating } from '../types';
import { theme } from '../theme/theme';
import { supabase } from '../utils/supabaseClient';
import MoodDetailsInput from './MoodDetailsInput';
import { getCurrentSubscriptionTier } from '../services/subscriptionService';
import { getTodayMoodEntry, getTodayDetailedMoodEntries, saveMoodEntry, getRecentMoodEntries } from '../services/moodService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MoodSliderProps {
  value: MoodRating | null;
  onValueChange: (value: MoodRating | null) => void;
  onMoodSaved?: () => void;
  onMoodDetailsSubmitted?: (rating: MoodRating, details: string) => Promise<void>;
  disabled?: boolean;
  onGenerateRecommendations?: () => Promise<void>;
}

interface MoodOption {
  rating: MoodRating;
  label: string;
  emoji: string;
  color: string;
}

export default function MoodSlider({ 
  value, 
  onValueChange,
  onMoodSaved,
  onMoodDetailsSubmitted,
  disabled = false,
  onGenerateRecommendations
}: MoodSliderProps) {
  // Core state
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [freeLimitReached, setFreeLimitReached] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'premium'>('free');
  const [todayEntriesCount, setTodayEntriesCount] = useState(0);
  
  // Mood state - this is the single source of truth for the displayed mood
  const [displayedMood, setDisplayedMood] = useState<MoodRating | null>(null);
  const [isUserDragging, setIsUserDragging] = useState(false);
  const [hasLoadedInitialMood, setHasLoadedInitialMood] = useState(false);
  
  // Define mood options
  const moodOptions: MoodOption[] = [
    { rating: 1, label: "Terrible", emoji: "😢", color: theme.colors.mood1 },
    { rating: 2, label: "Not Good", emoji: "😕", color: theme.colors.mood2 },
    { rating: 3, label: "Okay", emoji: "😐", color: theme.colors.mood3 },
    { rating: 4, label: "Good", emoji: "🙂", color: theme.colors.mood4 },
    { rating: 5, label: "Great", emoji: "😄", color: theme.colors.mood5 },
  ];
  
  // Get current mood option
  const currentMood = displayedMood !== null 
    ? moodOptions.find(option => option.rating === displayedMood) 
    : undefined;
  
  // Show success message
  const showSuccessMessage = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      console.log(message);
      Alert.alert('Success', message, [{ text: 'OK' }], { cancelable: true });
    }
  };
  
  // Load mood data on initial mount
  useEffect(() => {
    const loadMoodData = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          console.error('Session error or no session:', sessionError);
          setIsLoading(false);
          setHasLoadedInitialMood(true);
          return;
        }
        
        // Get subscription tier
        const tier = await getCurrentSubscriptionTier();
        setSubscriptionTier(tier);
        
        // First try to get today's entry
        const todayEntry = await getTodayMoodEntry();
        
        if (todayEntry) {
          console.log('Found mood entry for today:', todayEntry);
          setDisplayedMood(todayEntry.rating);
          onValueChange(todayEntry.rating);
          setIsSaved(true);
          
          // If user is on free plan and already has a mood entry for today, disable the slider
          if (tier === 'free') {
            setFreeLimitReached(true);
            
            // Check if free user has already updated once
            const hasUpdated = await AsyncStorage.getItem('free_user_mood_updated');
            if (hasUpdated === 'true') {
              console.log('Free user has already updated once');
            }
          }
          
          // For premium users, get entry count
          if (tier === 'premium') {
            const detailedEntries = await getTodayDetailedMoodEntries();
            setTodayEntriesCount(detailedEntries.length);
          }
        } else {
          // If no mood for today, explicitly set to null (empty slider)
          console.log('No mood entry found for today, starting with empty slider');
          setDisplayedMood(null);
          onValueChange(null);
          setIsSaved(false);
        }
        
        setHasLoadedInitialMood(true);
      } catch (error) {
        console.error('Error loading mood data:', error);
        setIsLoading(false);
        setHasLoadedInitialMood(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMoodData();
  }, []);
  
  // Update from props when value changes, but only if not dragging
  useEffect(() => {
    if (hasLoadedInitialMood && !isUserDragging && value !== displayedMood) {
      console.log('Setting values from prop:', value);
      // setDisplayedMood(value);
    }
  }, [value, isUserDragging, hasLoadedInitialMood]);
  
  // Handle slider value change (while dragging)
  const handleSliderChange = (newValue: number) => {
    const moodRating = Math.round(newValue) as MoodRating;
    
    // Set that user is dragging
    setIsUserDragging(true);
    
    // Update displayed mood immediately
    setDisplayedMood(moodRating);
    
    // Update parent component
    onValueChange(moodRating);
  };
  
  // Handle slider release
  const handleSlidingComplete = async (newValue: number) => {
    console.log(newValue,'===================new')
    const moodRating = Math.round(newValue) as MoodRating;
    
    // Set that user is no longer dragging
    setIsUserDragging(false);
    
    // Ensure displayed mood is set to the final position
    setDisplayedMood(moodRating);
    
    // Save to database
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Session error or no session:', sessionError);
        Alert.alert('Error', 'You must be logged in to save your mood.');
        return;
      }
      
      // Check subscription tier
      const tier = await getCurrentSubscriptionTier();
      
      // For premium users, always allow new entries
      if (tier === 'premium') {
        // Use the moodService to save the entry
        const result = await saveMoodEntry(moodRating);
        
        if (!result) {
          Alert.alert('Error', 'Failed to save your mood. Please try again.');
          return;
        }
        
        // Get updated entry count
        const detailedEntries = await getTodayDetailedMoodEntries();
        setTodayEntriesCount(detailedEntries.length);
        
        setIsSaved(true);
        showSuccessMessage(`Mood saved! (Entry #${detailedEntries.length} today)`);
        
        // Call the onMoodSaved callback to refresh parent component data
        if (onMoodSaved) {
          onMoodSaved();
        }
      } else {
        // For free users, check if an entry already exists for today
        const todayEntry = await getTodayMoodEntry();
        
        // No entry exists, create a new one
        const result = await saveMoodEntry(moodRating);
        
        if (!result) {
          Alert.alert('Error', 'Failed to save your mood. Please try again.');
          return;
        }
        
        setIsSaved(true);
        showSuccessMessage("Mood saved for today!");
        setFreeLimitReached(true);
        
        // Reset the free user mood updated flag when saving a new mood
        await AsyncStorage.removeItem('free_user_mood_updated');
        
        // Call the onMoodSaved callback to refresh parent component data
        if (onMoodSaved) {
          onMoodSaved();
        }
      }
    } catch (error) {
      console.error('Error saving mood:', error);
      Alert.alert('Error', 'Failed to save your mood. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle mood details submission
  const handleMoodDetailsSubmit = async (details: string) => {
    if (!displayedMood) return;
    console.log(displayedMood,'=====')
    try {
      // Save the mood entry with details
      await saveMoodEntry(displayedMood, details);
      
      if (onMoodDetailsSubmitted) {
        await onMoodDetailsSubmitted(displayedMood, details);
      }
      
      showSuccessMessage("Thanks for sharing! We've updated your recommendations.");
    } catch (error) {
      console.error('Error submitting mood details:', error);
      Alert.alert('Error', 'Failed to process your input. Please try again.');
    }
  };
  
  // Handle generating recommendations without details
  const handleGenerateRecommendations = async () => {
    if (!displayedMood) return;
    
    try {
      if (onMoodDetailsSubmitted) {
        await onMoodDetailsSubmitted(displayedMood, "");
      }
      
      showSuccessMessage("Generating recommendations based on your mood!");
    } catch (error) {
      console.error('Error generating recommendations:', error);
      Alert.alert('Error', 'Failed to generate recommendations. Please try again.');
    }
  };
  
  // Determine if slider should be disabled
  const isSliderDisabled = disabled || isLoading || (subscriptionTier === 'free' && freeLimitReached);
  
  // Get message for free plan limit or premium entries
  const getStatusMessage = () => {
    if (subscriptionTier === 'free' && freeLimitReached) {
      return "Free plan limited to 1 mood log per day. Upgrade for unlimited logs.";
    } else if (subscriptionTier === 'premium' && todayEntriesCount > 0) {
      return `You've logged your mood ${todayEntriesCount} time${todayEntriesCount !== 1 ? 's' : ''} today.`;
    }
    return null;
  };
  
  return (
    <View style={styles.container}>
      {/* Mood display */}
      <View style={styles.moodDisplay}>
        {currentMood ? (
          <>
            <Text style={styles.emoji}>{currentMood.emoji}</Text>
            <Text style={[styles.moodLabel, { color: currentMood.color }]}>
              {currentMood.label}
            </Text>
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>How are you feeling today?</Text>
            <Text style={styles.emptyStateSubText}>Move the slider to select your mood</Text>
          </View>
        )}
      </View>
      
      {/* Simple Slider - with explicit undefined when no mood is selected */}
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={displayedMood !== null ? displayedMood : undefined}
        onValueChange={handleSliderChange}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor={currentMood?.color || theme.colors.border}
        maximumTrackTintColor={theme.colors.border}
        thumbTintColor={currentMood?.color || 'transparent'}
        disabled={isSliderDisabled}
        tapToSeek={true}
        thumbStyle={displayedMood === null ? styles.hiddenThumb : undefined}
      />
      
      {/* Slider labels */}
      <View style={styles.labelContainer}>
        {moodOptions.map((option) => (
          <View key={option.rating} style={styles.labelItem}>
            <Text style={styles.labelEmoji}>{option.emoji}</Text>
            <Text 
              style={[
                styles.sliderLabel,
                displayedMood === option.rating && 
                { color: option.color, fontWeight: theme.fontWeights.bold }
              ]}
            >
              {option.rating}
            </Text>
          </View>
        ))}
      </View>
      
      {/* Status messages */}
      <View style={styles.statusContainer}>
        {isUserDragging ? (
          <Text style={styles.interactingText}>Release to save this mood</Text>
        ) : isLoading ? (
          <Text style={styles.savingText}>Saving your mood...</Text>
        ) : isSaved ? (
          <Text style={styles.savedText}>
            {subscriptionTier === 'premium' 
              ? "Your mood is saved - you can update it anytime" 
              : "Today's mood is saved"}
          </Text>
        ) : null}
        
        {/* Free plan limit or premium entries count */}
        {getStatusMessage() && !isUserDragging && (
          <Text style={[
            styles.statusText,
            subscriptionTier === 'free' && freeLimitReached ? styles.freeLimitText : styles.premiumStatusText
          ]}>
            {getStatusMessage()}
          </Text>
        )}
      </View>
      
      {/* Mood details input */}
      {isSaved && displayedMood !== null && (
        <MoodDetailsInput 
          isVisible={true}
          onSubmit={handleMoodDetailsSubmit}
          moodRating={displayedMood}
          onGenerateRecommendations={onGenerateRecommendations || handleGenerateRecommendations}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    width: '100%',
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    ...theme.shadows.small,
  },
  moodDisplay: {
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 100, // Increased from 90 to ensure enough space
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 10, // Increased from 8 to provide more space
    lineHeight: 56, // Added to ensure proper emoji rendering
  },
  moodLabel: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    textAlign: 'center', // Added to ensure text is centered
    paddingHorizontal: 10, // Added to prevent text from being cut off
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 5, // Added to ensure space between slider and labels
  },
  hiddenThumb: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 20, // Increased from 16 to provide more space
  },
  labelItem: {
    alignItems: 'center',
    width: '18%', // Added to ensure equal spacing
  },
  labelEmoji: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center', // Added to ensure emoji is centered
  },
  sliderLabel: {
    fontSize: 14,
    color: theme.colors.subtext,
    fontWeight: theme.fontWeights.medium,
    textAlign: 'center', // Added to ensure text is centered
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 50, // Increased from 40 to ensure enough space for messages
  },
  interactingText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontStyle: 'italic',
    marginBottom: 6, // Increased from 4 to provide more space
    textAlign: 'center', // Added to ensure text is centered
  },
  savedText: {
    fontSize: 14,
    color: theme.colors.success,
    marginBottom: 6, // Increased from 4 to provide more space
    textAlign: 'center', // Added to ensure text is centered
    paddingHorizontal: 10, // Added to prevent text from being cut off
  },
  savingText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: 6, // Increased from 4 to provide more space
    textAlign: 'center', // Added to ensure text is centered
  },
  statusText: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: theme.fontWeights.medium,
    textAlign: 'center', // Added to ensure text is centered
    paddingHorizontal: 10, // Added to prevent text from being cut off
  },
  freeLimitText: {
    color: theme.colors.error,
  },
  premiumStatusText: {
    color: theme.colors.accent,
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: 10, // Added to ensure content doesn't get cut off
  },
  emptyStateText: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: theme.fontWeights.semibold,
    marginBottom: 8, // Increased from 4 to provide more space
    textAlign: 'center', // Added to ensure text is centered
  },
  emptyStateSubText: {
    fontSize: 14,
    color: theme.colors.subtext,
    fontStyle: 'italic',
    textAlign: 'center', // Added to ensure text is centered
    paddingHorizontal: 10, // Added to prevent text from being cut off
  },
});