// Mood rating type (1-5 scale)
export type MoodRating = 1 | 2 | 3 | 4 | 5;

// Mood entry interface
export interface MoodEntry {
  id?: string;
  userId?: string;
  date: string;
  timestamp: number;
  rating: MoodRating;
  details?: string;
  activities?: string[];
}

// User profile interface
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
  lastActive?: string;
  notificationsEnabled?: boolean;
  notificationTime?: string;
  subscriptionTier: 'free' | 'premium';
  subscriptionExpiresAt?: string;
}

// Exercise step interface
export interface ExerciseStep {
  title: string;
  instruction: string;
  duration: number; // seconds
}