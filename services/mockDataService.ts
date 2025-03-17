import { MoodEntry, DetailedMoodEntry } from './moodService';
import { MoodRating } from '../types';

// Mock mood entries for testing and fallback
export const mockMoodEntries: MoodEntry[] = [
  {
    id: '1',
    user_id: 'mock-user',
    date: new Date().toISOString().split('T')[0],
    rating: 4 as MoodRating,
    details: 'Feeling pretty good today!',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'mock-user',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    rating: 3 as MoodRating,
    details: 'Average day, nothing special',
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    user_id: 'mock-user',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 days ago
    rating: 5 as MoodRating,
    details: 'Had a great day!',
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: '4',
    user_id: 'mock-user',
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0], // 3 days ago
    rating: 2 as MoodRating,
    details: 'Not feeling great today',
    created_at: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: '5',
    user_id: 'mock-user',
    date: new Date(Date.now() - 345600000).toISOString().split('T')[0], // 4 days ago
    rating: 4 as MoodRating,
    details: 'Pretty good day overall',
    created_at: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: '6',
    user_id: 'mock-user',
    date: new Date(Date.now() - 432000000).toISOString().split('T')[0], // 5 days ago
    rating: 3 as MoodRating,
    details: 'Just an ordinary day',
    created_at: new Date(Date.now() - 432000000).toISOString()
  },
  {
    id: '7',
    user_id: 'mock-user',
    date: new Date(Date.now() - 518400000).toISOString().split('T')[0], // 6 days ago
    rating: 4 as MoodRating,
    details: 'Good day with friends',
    created_at: new Date(Date.now() - 518400000).toISOString()
  }
];

// Mock detailed mood entries
export const mockDetailedMoodEntries: DetailedMoodEntry[] = [
  {
    id: '1',
    user_id: 'mock-user',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toISOString().split('T')[1],
    rating: 4 as MoodRating,
    note: 'Morning check-in, feeling good',
    emotion_details: 'Calm, content, optimistic',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'mock-user',
    date: new Date().toISOString().split('T')[0],
    time: new Date(Date.now() - 21600000).toISOString().split('T')[1], // 6 hours ago
    rating: 3 as MoodRating,
    note: 'Afternoon check-in, feeling a bit tired',
    emotion_details: 'Tired, but still positive',
    created_at: new Date(Date.now() - 21600000).toISOString()
  }
];

// Mock subscription status
export const mockSubscription = {
  id: 'mock-subscription',
  user_id: 'mock-user',
  tier: 'premium',
  expires_at: new Date(Date.now() + 31536000000).toISOString(), // 1 year from now
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  status: 'active',
  subscription_id: 'mock-sub-123',
  provider: 'demo'
};

// Helper function to get today's date in YYYY-MM-DD format
export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Get today's mock mood entry
export function getMockTodayMoodEntry(): MoodEntry {
  return mockMoodEntries.find(entry => entry.date === getTodayDateString()) || mockMoodEntries[0];
}

// Get mock recent mood entries
export function getMockRecentMoodEntries(days: number = 7): MoodEntry[] {
  return mockMoodEntries.slice(0, days);
}

// Get mock detailed mood entries for today
export function getMockTodayDetailedMoodEntries(): DetailedMoodEntry[] {
  return mockDetailedMoodEntries;
}

// Calculate mock streak
export function getMockMoodStreak(): number {
  return 7; // Mock a 7-day streak
}