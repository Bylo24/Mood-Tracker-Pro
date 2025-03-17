import { MoodRating } from '../types';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'meditation' | 'breathing' | 'mindfulness' | 'physical';
  moodTarget: MoodRating[];
  isPremium: boolean;
}

// Mock data for exercises
export const mockExercises: Exercise[] = [
  // Meditation exercises
  {
    id: '1',
    title: 'Calm Mind Meditation',
    description: 'A gentle meditation to calm your mind and reduce anxiety.',
    duration: '10 min',
    type: 'meditation',
    moodTarget: [1, 2],
    isPremium: false
  },
  {
    id: '4',
    title: 'Joy Visualization',
    description: 'Guided visualization to connect with feelings of joy and happiness.',
    duration: '15 min',
    type: 'meditation',
    moodTarget: [3, 4, 5],
    isPremium: true
  },
  {
    id: '8',
    title: 'Morning Meditation',
    description: 'Start your day with clarity and intention.',
    duration: '10 min',
    type: 'meditation',
    moodTarget: [2, 3, 4],
    isPremium: false
  },
  {
    id: '12',
    title: 'Loving Kindness Meditation',
    description: 'Cultivate compassion for yourself and others.',
    duration: '12 min',
    type: 'meditation',
    moodTarget: [2, 3, 4, 5],
    isPremium: true
  },
  {
    id: '13',
    title: 'Body Scan Meditation',
    description: 'A progressive relaxation technique to release tension throughout your body.',
    duration: '15 min',
    type: 'meditation',
    moodTarget: [1, 2, 3],
    isPremium: false
  },
  {
    id: '14',
    title: 'Mindful Awareness Meditation',
    description: 'Develop present moment awareness and acceptance.',
    duration: '10 min',
    type: 'meditation',
    moodTarget: [2, 3, 4],
    isPremium: false
  },
  
  // Breathing exercises
  {
    id: '2',
    title: 'Energizing Breath Work',
    description: 'Breathing exercises to boost your energy and mood.',
    duration: '5 min',
    type: 'breathing',
    moodTarget: [2, 3],
    isPremium: false
  },
  {
    id: '7',
    title: 'Deep Breathing Technique',
    description: 'Learn to breathe deeply to reduce stress and anxiety.',
    duration: '6 min',
    type: 'breathing',
    moodTarget: [1, 2, 3],
    isPremium: false
  },
  {
    id: '11',
    title: 'Box Breathing',
    description: 'A structured breathing technique to calm your nervous system.',
    duration: '5 min',
    type: 'breathing',
    moodTarget: [1, 2, 3],
    isPremium: false
  },
  {
    id: '15',
    title: '4-7-8 Breathing',
    description: 'A breathing pattern that promotes relaxation and helps with sleep.',
    duration: '8 min',
    type: 'breathing',
    moodTarget: [1, 2],
    isPremium: false
  },
  {
    id: '16',
    title: 'Alternate Nostril Breathing',
    description: 'Balance your energy and calm your mind with this yogic breathing technique.',
    duration: '7 min',
    type: 'breathing',
    moodTarget: [2, 3],
    isPremium: true
  },
  {
    id: '17',
    title: 'Breath of Fire',
    description: 'An energizing breathing technique to increase alertness and energy.',
    duration: '5 min',
    type: 'breathing',
    moodTarget: [2, 3, 4],
    isPremium: true
  },
  
  // Mindfulness exercises
  {
    id: '3',
    title: 'Gratitude Practice',
    description: 'Focus on the positive aspects of your life to improve your outlook.',
    duration: '7 min',
    type: 'mindfulness',
    moodTarget: [2, 3, 4],
    isPremium: false
  },
  {
    id: '5',
    title: 'Stress Release Body Scan',
    description: 'Progressive relaxation to release tension from your body.',
    duration: '12 min',
    type: 'mindfulness',
    moodTarget: [1, 2, 3],
    isPremium: true
  },
  {
    id: '9',
    title: 'Body Awareness Scan',
    description: 'Connect with your body and release tension.',
    duration: '15 min',
    type: 'mindfulness',
    moodTarget: [1, 2, 3, 4],
    isPremium: true
  },
  {
    id: '18',
    title: 'Mindful Eating Practice',
    description: 'Learn to eat with full awareness and appreciation.',
    duration: '10 min',
    type: 'mindfulness',
    moodTarget: [3, 4],
    isPremium: false
  },
  {
    id: '19',
    title: 'Mindful Walking',
    description: 'Practice mindfulness while walking to reduce stress and increase awareness.',
    duration: '15 min',
    type: 'mindfulness',
    moodTarget: [2, 3, 4],
    isPremium: false
  },
  {
    id: '20',
    title: 'Thought Observation',
    description: 'Learn to observe your thoughts without judgment or attachment.',
    duration: '8 min',
    type: 'mindfulness',
    moodTarget: [1, 2, 3],
    isPremium: true
  },
  
  // Physical exercises
  {
    id: '6',
    title: 'Gentle Movement Flow',
    description: 'Simple stretches and movements to release physical tension.',
    duration: '8 min',
    type: 'physical',
    moodTarget: [1, 2, 3, 4, 5],
    isPremium: true
  },
  {
    id: '10',
    title: 'Yoga Flow',
    description: 'A gentle yoga sequence to energize your body.',
    duration: '20 min',
    type: 'physical',
    moodTarget: [2, 3, 4, 5],
    isPremium: true
  },
  {
    id: '21',
    title: 'Desk Stretches',
    description: 'Quick stretches you can do at your desk to relieve tension.',
    duration: '5 min',
    type: 'physical',
    moodTarget: [2, 3],
    isPremium: false
  },
  {
    id: '22',
    title: 'Mood-Boosting Movement',
    description: 'Simple movements designed to boost your mood and energy.',
    duration: '10 min',
    type: 'physical',
    moodTarget: [1, 2, 3],
    isPremium: false
  },
  {
    id: '23',
    title: 'Tension Release Exercises',
    description: 'Physical exercises specifically designed to release body tension.',
    duration: '12 min',
    type: 'physical',
    moodTarget: [1, 2, 3],
    isPremium: false
  },
  {
    id: '24',
    title: 'Energy Flow Sequence',
    description: 'A sequence of movements to increase energy and improve mood.',
    duration: '15 min',
    type: 'physical',
    moodTarget: [2, 3, 4],
    isPremium: true
  }
];

// Helper functions for exercises
export const getExercisesByCategory = (category: string, isPremium: boolean = false): Exercise[] => {
  let filteredExercises = mockExercises.filter(
    exercise => exercise.type === category
  );
  
  // If not premium user, filter out premium exercises
  if (!isPremium) {
    filteredExercises = filteredExercises.filter(exercise => !exercise.isPremium);
  }
  
  return filteredExercises;
};

export const getExercisesByMood = (mood: MoodRating, isPremium: boolean = false): Exercise[] => {
  let filteredExercises = mockExercises.filter(
    exercise => exercise.moodTarget.includes(mood)
  );
  
  // If not premium user, filter out premium exercises
  if (!isPremium) {
    filteredExercises = filteredExercises.filter(exercise => !exercise.isPremium);
  }
  
  return filteredExercises;
};

export const getExerciseById = (id: string): Exercise | undefined => {
  return mockExercises.find(exercise => exercise.id === id);
};