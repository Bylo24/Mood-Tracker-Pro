import { Activity } from '../types';
import { allActivities, premiumActivities } from '../data/mockData';
import { GEMINI_API_KEY, generateContentWithGemini } from '../utils/geminiApi';
import { getCurrentSubscriptionTier } from '../services/subscriptionService';
import { getRecentMoodEntries } from '../services/moodService';

export async function getActivityRecommendations(
  moodRating: number,
  moodDetails: string
): Promise<Activity[]> {
  try {
    console.log('Getting activity recommendations for:', { moodRating, moodDetails });
    
    // Determine if user has premium subscription
    const subscriptionTier = await getCurrentSubscriptionTier();
    const availableActivities = subscriptionTier === 'premium' ? premiumActivities : allActivities;
    
    console.log(`User has ${subscriptionTier} subscription with access to ${availableActivities.length} activities`);
    
    // Check if we have a Gemini API key
    const hasApiKey = GEMINI_API_KEY
    
    // If there's no text input, get recent mood entries to provide context
    let moodContext = '';
    if (!moodDetails || moodDetails.trim() === '') {
      try {
        const recentEntries = await getRecentMoodEntries(7);
        if (recentEntries && recentEntries.length > 0) {
          moodContext = `\nRecent mood pattern: ${recentEntries.map(entry => 
            `${entry.date}: ${entry.rating}/5`
          ).join(', ')}`;
          console.log('Added mood pattern context:', moodContext);
        }
      } catch (error) {
        console.error('Error getting recent mood entries for context:', error);
      }
    }
    
    if (hasApiKey) {
      // If we have an API key, try to use the Gemini API
      try {
        // Create a prompt for Gemini API that prioritizes mood details if available
        // Otherwise, use mood rating and recent pattern
        const prompt = `Based on the following user information, select the 3 most appropriate activities from the list below.
        
        ${moodDetails ? 
          `User's current input: "${moodDetails}"` : 
          `User's current mood rating: ${moodRating}/5 (1=Terrible, 2=Not Good, 3=Okay, 4=Good, 5=Great)${moodContext}`
        }
        
        IMPORTANT: If the user mentions hunger, food, eating, or being hungry, prioritize activities related to food, eating, or nutrition.
        
        Available activities:
        ${availableActivities.map((activity, index) => 
          `${index + 1}. ${activity.title} - ${activity.description} - Category: ${activity.category} - Tags: ${activity.tags?.join(', ')}`
        ).join('\n')}
        
        Return only the numbers of the 3 most appropriate activities as a JSON array, like this: [1, 5, 10]`;
        
        // Call Gemini API
        const response = await generateContentWithGemini(prompt);
        
        // Try to parse the response as a JSON array
        const jsonMatch = response.match(/\[[\d,\s]+\]/);
        if (jsonMatch) {
          const activityIndices = JSON.parse(jsonMatch[0]) as number[];
          
          // Convert 1-based indices to 0-based and get the activities
          const selectedActivities = activityIndices
            .map(index => availableActivities[index - 1])
            .filter(activity => activity !== undefined);
          
          if (selectedActivities.length > 0) {
            console.log('Selected activities based on Gemini response:', selectedActivities.map(a => a.title));
            return selectedActivities.slice(0, 3);
          }
        }
        
        // If we couldn't parse the response or got no valid activities, fall back to simulation
        console.log('Could not parse Gemini response, falling back to simulation');
      } catch (error) {
        console.error('Error using Gemini API:', error);
        console.log('Falling back to simulated recommendations');
      }
    } else {
      console.log('No Gemini API key available, using simulation 2');
    }
    
    // If we reach here, either the API key is not available, the API call failed, 
    // or we couldn't parse the response. Fall back to a smart simulation.
    return simulateActivityRecommendations(moodRating, moodDetails, availableActivities, moodContext);
  } catch (error) {
    console.error('Error getting activity recommendations:', error);
    // Fallback to simulation in case of any error
    const subscriptionTier = await getCurrentSubscriptionTier();
    const availableActivities = subscriptionTier === 'premium' ? premiumActivities : allActivities;
    return simulateActivityRecommendations(moodRating, moodDetails, availableActivities, '');
  }
}

// Function to simulate Gemini's activity selection based on mood and details
function simulateActivityRecommendations(
  moodRating: number, 
  moodDetails: string,
  availableActivities: Activity[],
  moodContext: string = ''
): Activity[] {
  console.log('Simulating activity recommendations for:', { moodRating, moodDetails, moodContext });
  
  // Check if the user didn't specify what they feel like
  // Look for empty details or generic phrases like "I don't know", "not sure", etc.
  const emptyOrGenericDetails = !moodDetails || 
    moodDetails.trim() === '' || 
    /^(i don'?t know|not sure|unsure|no idea|whatever|anything|nothing specific|don'?t care)$/i.test(moodDetails.trim());
  
  // If details are empty or generic, use mood rating and context to determine activities
  if (emptyOrGenericDetails) {
    console.log('User did not specify what they feel like. Using mood rating and pattern.');
    
    // Create a copy of the available activities array to avoid modifying the original
    const scoredActivities = availableActivities.map(activity => {
      let score = 0;
      
      // Score based on mood rating
      if (moodRating <= 2) {
        // For low mood, prioritize mindfulness and social activities
        if (activity.category === 'mindfulness') score += 3;
        if (activity.category === 'social') score += 2;
        if (activity.moodImpact === 'high') score += 2;
      } else if (moodRating === 3) {
        // For neutral mood, balanced approach
        if (activity.category === 'exercise') score += 2;
        if (activity.category === 'creative') score += 2;
        if (activity.duration <= 15) score += 1; // Quick activities
      } else {
        // For good mood, enhance it further
        if (activity.category === 'exercise') score += 3;
        if (activity.category === 'social') score += 3;
        if (activity.category === 'creative') score += 2;
      }
      
      // Add a small random factor to prevent the same recommendations every time
      score += Math.random() * 0.5;
      
      return { activity, score };
    });
    
    // Sort by score (highest first) and take the top 3
    const topActivities = scoredActivities
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.activity);
    
    console.log('Selected activities based on mood rating:', topActivities.map(a => a.title));
    return topActivities;
  }
  
  // If the user did specify details, continue with the existing logic
  // Convert details to lowercase for easier matching
  const details = moodDetails.toLowerCase();
  
  // Check for hunger-related keywords first
  if (details.includes('hungry') || details.includes('hunger') || details.includes('food') || 
      details.includes('eat') || details.includes('meal') || details.includes('snack')) {
    console.log('User mentioned hunger. Prioritizing food-related activities.');
    
    // Find food-related activities
    const foodRelatedActivities = availableActivities.filter(activity => {
      const title = activity.title.toLowerCase();
      const description = activity.description.toLowerCase();
      const tags = activity.tags ? activity.tags.join(' ').toLowerCase() : '';
      
      return title.includes('eat') || title.includes('food') || title.includes('snack') || title.includes('cook') ||
             description.includes('eat') || description.includes('food') || description.includes('snack') || 
             description.includes('meal') || description.includes('cook') || description.includes('nutrition') ||
             tags.includes('nutrition') || tags.includes('nourishment');
    });
    
    if (foodRelatedActivities.length > 0) {
      // If we found food-related activities, return up to 3 of them
      const selectedActivities = foodRelatedActivities.slice(0, 3);
      
      // If we have fewer than 3, add some random activities to fill
      if (selectedActivities.length < 3) {
        const otherActivities = availableActivities
          .filter(a => !selectedActivities.includes(a))
          .sort(() => 0.5 - Math.random())
          .slice(0, 3 - selectedActivities.length);
        
        return [...selectedActivities, ...otherActivities];
      }
      
      return selectedActivities;
    }
  }
  
  // Create a scoring system for activities based on mood and details
  const scoredActivities = availableActivities.map(activity => {
    let score = 0;
    
    // Score based on mood rating
    if (moodRating <= 2) {
      // For low mood, prioritize mindfulness and social activities
      if (activity.category === 'mindfulness') score += 3;
      if (activity.category === 'social') score += 2;
      if (activity.moodImpact === 'high') score += 2;
    } else if (moodRating === 3) {
      // For neutral mood, balanced approach
      if (activity.category === 'exercise') score += 2;
      if (activity.category === 'creative') score += 2;
      if (activity.duration <= 15) score += 1; // Quick activities
    } else {
      // For good mood, enhance it further
      if (activity.category === 'exercise') score += 3;
      if (activity.category === 'social') score += 3;
      if (activity.category === 'creative') score += 2;
    }
    
    // Score based on keywords in the details
    const keywords = {
      'stress': ['meditation', 'breathing', 'nature', 'relaxation'],
      'anxiety': ['breathing', 'meditation', 'progressive'],
      'sad': ['friend', 'music', 'gratitude'],
      'tired': ['stretching', 'workout', 'walk', 'nap'],
      'lonely': ['friend', 'letter', 'social'],
      'bored': ['creative', 'workout', 'declutter'],
      'angry': ['workout', 'breathing', 'nature'],
      'happy': ['friend', 'creative', 'music'],
      'energetic': ['workout', 'walk', 'creative'],
      'overwhelmed': ['meditation', 'breathing', 'detox'],
      'motivated': ['workout', 'declutter', 'creative'],
      'worried': ['meditation', 'breathing', 'friend'],
      'excited': ['creative', 'social', 'music'],
      'frustrated': ['workout', 'breathing', 'declutter'],
      'calm': ['meditation', 'tea', 'reading'],
      'distracted': ['meditation', 'focus', 'breathing'],
      'hungry': ['snack', 'eating', 'food', 'nutrition', 'cook']
    };
    
    // Check if any keywords from the user's details match our mapping
    for (const [keyword, relatedActivities] of Object.entries(keywords)) {
      if (details.includes(keyword)) {
        // If the activity title or description contains any related activity keyword
        for (const relatedActivity of relatedActivities) {
          if (
            activity.title.toLowerCase().includes(relatedActivity) || 
            activity.description.toLowerCase().includes(relatedActivity) ||
            activity.category.toLowerCase().includes(relatedActivity) ||
            activity.tags?.some(tag => tag.includes(relatedActivity))
          ) {
            score += 3;
          }
        }
      }
    }
    
    // Additional scoring based on specific words in the details
    const specificMatches = [
      { words: ['work', 'job', 'busy', 'deadline'], categories: ['mindfulness'], bonus: 2 },
      { words: ['sleep', 'tired', 'exhausted', 'insomnia'], activities: ['Progressive Muscle Relaxation', 'Deep Breathing', 'Power Nap'], bonus: 3 },
      { words: ['friend', 'social', 'people', 'family'], categories: ['social'], bonus: 3 },
      { words: ['creative', 'express', 'art'], categories: ['creative'], bonus: 3 },
      { words: ['exercise', 'workout', 'active'], categories: ['exercise'], bonus: 3 },
      { words: ['calm', 'peace', 'quiet'], categories: ['mindfulness', 'relaxation'], bonus: 2 },
      { words: ['focus', 'concentrate', 'distracted'], activities: ['5-Minute Meditation', 'Mindful Tea Ritual'], bonus: 2 },
      { words: ['happy', 'joy', 'excited'], activities: ['Dance Break', 'Call a Friend', 'Laugh Therapy'], bonus: 3 },
      { words: ['anxious', 'panic', 'worry'], activities: ['Deep Breathing', 'Progressive Muscle Relaxation', 'Mindful Walking'], bonus: 3 },
      { words: ['sad', 'down', 'depressed'], activities: ['Call a Friend', 'Gratitude Journaling', 'Listen to Uplifting Music'], bonus: 3 },
      { words: ['angry', 'frustrated', 'irritated'], activities: ['Quick Workout', 'Deep Breathing', 'Nature Walk'], bonus: 3 },
      { words: ['bored', 'restless', 'uninterested'], activities: ['Creative Drawing', 'Dance Break', 'Quick Workout'], bonus: 3 },
      { words: ['hungry', 'hunger', 'food', 'eat', 'meal', 'snack'], activities: ['Healthy Snack Break', 'Mindful Eating', 'Mindful Cooking', 'Mindful Eating Challenge'], bonus: 10 },
    ];
    
    for (const match of specificMatches) {
      if (match.words.some(word => details.includes(word))) {
        if (match.categories && match.categories.includes(activity.category)) {
          score += match.bonus;
        }
        if (match.activities && match.activities.includes(activity.title)) {
          score += match.bonus;
        }
      }
    }
    
    // Bonus for short activities if the user mentions being busy
    if ((details.includes('busy') || details.includes('no time')) && activity.duration <= 10) {
      score += 2;
    }
    
    // Bonus for longer activities if the user has time
    if ((details.includes('free time') || details.includes('weekend')) && activity.duration >= 20) {
      score += 2;
    }
    
    // Add a small random factor to prevent the same recommendations every time
    score += Math.random() * 0.5;
    
    return { activity, score };
  });
  
  // Sort by score (highest first) and take the top 3
  const topActivities = scoredActivities
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.activity);
  
  console.log('Selected activities based on simulation:', topActivities.map(a => a.title));
  return topActivities;
}

// New function to generate a prompt based on mood rating
export async function generateMoodBasedPrompt(moodRating: number): Promise<string> {
  try {
    console.log('Generating prompt based on mood rating:', moodRating);
    
    // Check if we have a Gemini API key
    const hasApiKey = !!process.env.EXPO_PUBLIC_GEMINI;
    
    if (hasApiKey) {
      // If we have an API key, try to use the Gemini API
      try {
        // Create a prompt for Gemini API
        const prompt = `Generate a thoughtful journaling prompt for someone who is feeling the following mood:
        
        Mood rating: ${moodRating}/5 (1=Terrible, 2=Not Good, 3=Okay, 4=Good, 5=Great)
        
        The prompt should:
        1. Be empathetic and appropriate for the mood level
        2. Encourage self-reflection
        3. Be 1-2 sentences long
        4. Not be too generic
        5. Not include "how are you feeling" since we already know their mood rating
        
        Return only the prompt text with no additional commentary or quotation marks.`;
        
        // Call Gemini API
        const response = await generateContentWithGemini(prompt);
        return response.trim();
      } catch (error) {
        console.error('Error using Gemini API for prompt generation:', error);
        console.log('Falling back to default prompts');
      }
    } else {
      console.log('No Gemini API key available, using default prompts');
    }
    
    // If we reach here, either the API key is not available or the API call failed
    // Fall back to predefined prompts based on mood
    return getDefaultPromptForMood(moodRating);
  } catch (error) {
    console.error('Error generating mood-based prompt:', error);
    // Fallback to default prompts in case of any error
    return getDefaultPromptForMood(moodRating);
  }
}

// Function to get default prompts based on mood rating
function getDefaultPromptForMood(moodRating: number): string {
  const defaultPrompts = {
    1: [
      "What small comfort could you give yourself today that might help you feel a little better?",
      "Reflect on a time when you overcame a difficult situation. What strengths did you use that you could apply now?",
      "What would you say to a friend who was feeling the way you are right now?",
      "Name one tiny thing that still brings you a moment of peace despite how you're feeling.",
      "What is one small step you could take today toward feeling better?"
    ],
    2: [
      "What's one thing that's weighing on your mind today, and what might help lighten that load?",
      "Think of something that made you smile recently, no matter how small. What was it about that moment?",
      "What's one area of your life where you could show yourself more compassion today?",
      "What activities usually help shift your mood, even slightly, when you're not feeling your best?",
      "If you could change one thing about today to make it better, what would it be?"
    ],
    3: [
      "What's one thing you could do today to move from 'okay' to 'good'?",
      "What are you looking forward to, even if it's something small?",
      "What's one thing you're grateful for in this neutral moment?",
      "What would make today more meaningful for you?",
      "What's something you've been putting off that might actually energize you if you tackled it today?"
    ],
    4: [
      "What contributed to your positive mood today, and how can you bring more of that into tomorrow?",
      "What's something you're excited about right now, and how can you build on that energy?",
      "How might you use this good energy to tackle something challenging you've been avoiding?",
      "What's one way you could spread some of your positive energy to someone else today?",
      "What are you most grateful for in this moment of feeling good?"
    ],
    5: [
      "What made today exceptional, and how can you create more moments like this?",
      "How might you channel this excellent mood into something creative or meaningful?",
      "What's something you've been wanting to try that you could use this positive energy for?",
      "Who in your life might benefit from connecting with you while you're feeling this positive energy?",
      "What does this great mood tell you about what truly matters to you?"
    ]
  };
  
  // Ensure the mood rating is within our range (1-5)
  const safeRating = Math.max(1, Math.min(5, Math.round(moodRating))) as 1 | 2 | 3 | 4 | 5;
  
  // Get the array of prompts for this mood rating
  const promptsForMood = defaultPrompts[safeRating];
  
  // Return a random prompt from the array
  return promptsForMood[Math.floor(Math.random() * promptsForMood.length)];
}