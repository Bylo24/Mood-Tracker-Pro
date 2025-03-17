import { Exercise, mockExercises } from '../data/exercisesData';
import { MoodEntry, getTodayMoodEntry } from './moodService';
import { getCurrentSubscriptionTier } from './subscriptionService';
import { generateContentWithGemini } from '../utils/geminiApi';

// Get exercise recommendations based on mood and user input
export async function getExerciseRecommendations(): Promise<Exercise[]> {
  try {
    // Get today's mood entry
    const todayMood = await getTodayMoodEntry();
    
    // Determine if user has premium subscription
    const subscriptionTier = await getCurrentSubscriptionTier();
    const isPremium = subscriptionTier === 'premium';
    
    // Filter available exercises based on premium status
    const availableExercises = isPremium 
      ? mockExercises 
      : mockExercises.filter(ex => !ex.isPremium);
    
    // If no mood entry for today, return a balanced mix of exercises
    if (!todayMood) {
      console.log('No mood entry for today, returning balanced mix of exercises');
      return getBalancedExerciseMix(availableExercises);
    }
    
    // Check if we have a Gemini API key
    const hasApiKey = !!process.env.EXPO_PUBLIC_GEMINI;
    
    if (hasApiKey) {
      try {
        // Create a prompt for Gemini API
        const prompt = createExerciseRecommendationPrompt(todayMood, availableExercises);
        
        // Call Gemini API
        const response = await generateContentWithGemini(prompt);
        
        // Try to parse the response as a JSON array
        const jsonMatch = response.match(/\[[\d,\s]+\]/);
        if (jsonMatch) {
          const exerciseIndices = JSON.parse(jsonMatch[0]) as number[];
          
          // Convert 1-based indices to 0-based and get the exercises
          const selectedExercises = exerciseIndices
            .map(index => availableExercises[index - 1])
            .filter(exercise => exercise !== undefined);
          
          if (selectedExercises.length > 0) {
            console.log('Selected exercises based on Gemini response:', selectedExercises.map(e => e.title));
            return selectedExercises.slice(0, 6); // Return up to 6 exercises
          }
        }
        
        // If we couldn't parse the response or got no valid exercises, fall back to simulation
        console.log('Could not parse Gemini response, falling back to simulation');
      } catch (error) {
        console.error('Error using Gemini API for exercise recommendations:', error);
        console.log('Falling back to simulated recommendations');
      }
    } else {
      console.log('No Gemini API key available, using simulation 1');
    }
    
    // If we reach here, either the API key is not available, the API call failed, 
    // or we couldn't parse the response. Fall back to a smart simulation.
    return simulateExerciseRecommendations(todayMood, availableExercises);
  } catch (error) {
    console.error('Error getting exercise recommendations:', error);
    
    // Fallback to a balanced mix in case of any error
    const subscriptionTier = await getCurrentSubscriptionTier();
    const isPremium = subscriptionTier === 'premium';
    const availableExercises = isPremium 
      ? mockExercises 
      : mockExercises.filter(ex => !ex.isPremium);
    
    return getBalancedExerciseMix(availableExercises);
  }
}

// Create a prompt for Gemini API to recommend exercises
function createExerciseRecommendationPrompt(
  moodEntry: MoodEntry,
  availableExercises: Exercise[]
): string {
  const moodRating = moodEntry.rating;
  const moodDetails = moodEntry.details || '';
  
  return `Based on the following user's mood information, select the 6 most appropriate guided exercises from the list below.

User's mood rating: ${moodRating}/5 (1=Terrible, 2=Not Good, 3=Okay, 4=Good, 5=Great)
${moodDetails ? `User's mood details: "${moodDetails}"` : ''}

Consider the following when making your recommendations:
- For low mood ratings (1-2), prioritize calming and soothing exercises
- For neutral mood (3), prioritize balancing and grounding exercises
- For high mood ratings (4-5), prioritize exercises that maintain or enhance the positive state
- Consider the user's specific emotions or needs mentioned in their mood details
- Include a diverse mix of exercise types (meditation, breathing, mindfulness, physical)
- Prioritize exercises that specifically target the user's current mood state

Available exercises:
${availableExercises.map((exercise, index) => 
  `${index + 1}. ${exercise.title} - ${exercise.description} - Type: ${exercise.type} - Duration: ${exercise.duration} - Target Moods: ${exercise.moodTarget.join(', ')} - ${exercise.isPremium ? 'Premium' : 'Free'}`
).join('\n')}

Return only the numbers of the 6 most appropriate exercises as a JSON array, like this: [1, 5, 10, 15, 20, 24]`;
}

// Simulate exercise recommendations based on mood and details
function simulateExerciseRecommendations(
  moodEntry: MoodEntry,
  availableExercises: Exercise[]
): Exercise[] {
  console.log('Simulating exercise recommendations for mood:', moodEntry.rating);
  
  const moodRating = moodEntry.rating;
  const moodDetails = (moodEntry.details || '').toLowerCase();
  
  // Score each exercise based on relevance to the current mood
  const scoredExercises = availableExercises.map(exercise => {
    let score = 0;
    
    // Score based on mood target match
    if (exercise.moodTarget.includes(moodRating)) {
      score += 5; // Strong bonus for exact mood match
    } else {
      // Give partial points for close mood matches
      exercise.moodTarget.forEach(targetMood => {
        const moodDifference = Math.abs(targetMood - moodRating);
        if (moodDifference === 1) score += 2; // Adjacent mood
        else if (moodDifference === 2) score += 1; // Two steps away
      });
    }
    
    // Score based on exercise type appropriateness for the mood
    if (moodRating <= 2) {
      // For low moods, prioritize calming exercises
      if (exercise.type === 'meditation') score += 3;
      if (exercise.type === 'breathing') score += 3;
      if (exercise.type === 'mindfulness') score += 2;
      if (exercise.type === 'physical') score += 1; // Still helpful but less priority
    } else if (moodRating === 3) {
      // For neutral mood, balanced approach
      if (exercise.type === 'meditation') score += 2;
      if (exercise.type === 'breathing') score += 2;
      if (exercise.type === 'mindfulness') score += 2;
      if (exercise.type === 'physical') score += 2;
    } else {
      // For good moods, prioritize maintaining/enhancing exercises
      if (exercise.type === 'meditation') score += 2;
      if (exercise.type === 'breathing') score += 1;
      if (exercise.type === 'mindfulness') score += 2;
      if (exercise.type === 'physical') score += 3; // More energetic activities
    }
    
    // Score based on keywords in the mood details
    const keywords = {
      'anxiety': ['breathing', 'meditation', 'calm', 'relax'],
      'stress': ['breathing', 'meditation', 'relax', 'tension'],
      'sad': ['joy', 'compassion', 'kindness', 'gratitude'],
      'tired': ['energy', 'energizing', 'morning', 'boost'],
      'angry': ['calm', 'breathing', 'release', 'tension'],
      'happy': ['joy', 'gratitude', 'loving', 'kindness'],
      'overwhelmed': ['breathing', 'calm', 'release', 'tension'],
      'focus': ['awareness', 'mindful', 'attention', 'present'],
      'sleep': ['relaxation', 'calm', 'breathing', 'body scan'],
      'pain': ['body', 'scan', 'release', 'tension'],
      'energy': ['energizing', 'boost', 'fire', 'movement']
    };
    
    // Check if any keywords from the user's details match our mapping
    for (const [keyword, relatedTerms] of Object.entries(keywords)) {
      if (moodDetails.includes(keyword)) {
        // If the exercise title or description contains any related term
        for (const term of relatedTerms) {
          if (
            exercise.title.toLowerCase().includes(term) || 
            exercise.description.toLowerCase().includes(term) ||
            exercise.type.toLowerCase().includes(term)
          ) {
            score += 3;
          }
        }
      }
    }
    
    // Add a small random factor to prevent the same recommendations every time
    score += Math.random() * 0.5;
    
    return { exercise, score };
  });
  
  // Sort by score (highest first)
  const sortedExercises = scoredExercises.sort((a, b) => b.score - a.score);
  
  // Ensure diversity in exercise types
  const selectedExercises: Exercise[] = [];
  const typeCounts: Record<string, number> = {
    meditation: 0,
    breathing: 0,
    mindfulness: 0,
    physical: 0
  };
  
  // First, add the highest scoring exercise of each type
  for (const type of Object.keys(typeCounts)) {
    const bestOfType = sortedExercises.find(item => 
      item.exercise.type === type && !selectedExercises.includes(item.exercise)
    );
    
    if (bestOfType) {
      selectedExercises.push(bestOfType.exercise);
      typeCounts[bestOfType.exercise.type]++;
    }
  }
  
  // Then fill remaining slots with highest scoring exercises not yet selected
  for (const item of sortedExercises) {
    if (selectedExercises.length >= 6) break;
    if (!selectedExercises.includes(item.exercise)) {
      selectedExercises.push(item.exercise);
      typeCounts[item.exercise.type]++;
    }
  }
  
  console.log('Selected exercises based on simulation:', selectedExercises.map(e => e.title));
  console.log('Exercise type distribution:', typeCounts);
  
  return selectedExercises;
}

// Get a balanced mix of exercises (when no mood data is available)
function getBalancedExerciseMix(availableExercises: Exercise[]): Exercise[] {
  // Create a map to group exercises by type
  const exercisesByType: Record<string, Exercise[]> = {
    meditation: [],
    breathing: [],
    mindfulness: [],
    physical: []
  };
  
  // Group exercises by type
  availableExercises.forEach(exercise => {
    exercisesByType[exercise.type].push(exercise);
  });
  
  // Shuffle each type group
  Object.keys(exercisesByType).forEach(type => {
    exercisesByType[type] = shuffleArray(exercisesByType[type]);
  });
  
  // Take up to 2 exercises from each type
  const selectedExercises: Exercise[] = [];
  
  Object.keys(exercisesByType).forEach(type => {
    const exercisesOfType = exercisesByType[type];
    const count = Math.min(2, exercisesOfType.length);
    selectedExercises.push(...exercisesOfType.slice(0, count));
  });
  
  // If we have more than 6, trim to 6
  if (selectedExercises.length > 6) {
    return selectedExercises.slice(0, 6);
  }
  
  // If we have less than 6, add more from the most populated types
  if (selectedExercises.length < 6) {
    const remainingCount = 6 - selectedExercises.length;
    const allRemainingExercises = availableExercises.filter(
      exercise => !selectedExercises.includes(exercise)
    );
    
    // Shuffle the remaining exercises
    const shuffledRemaining = shuffleArray(allRemainingExercises);
    
    // Add up to the remaining count
    selectedExercises.push(...shuffledRemaining.slice(0, remainingCount));
  }
  
  return selectedExercises;
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}