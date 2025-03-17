import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Profile: undefined;
  Tips: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Introduction: undefined;
  SetupName: undefined;
  Login: undefined;
  Main: NavigatorScreenParams<TabParamList>;
  Subscription: undefined;
  SubscriptionComparison: { source?: string };
  PremiumComparison: undefined;
  GuidedExercises: { isPremium?: boolean };
  ExerciseCategory: { 
    category: 'meditation' | 'breathing' | 'mindfulness' | 'physical';
    isPremium?: boolean;
  };
  ExerciseDetail: { 
    exerciseId: string;
    isPremium?: boolean;
  };
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
  About: undefined;
};

export type MoodEntry = {
  id: string;
  date: string;
  mood: number;
  notes?: string;
  activities?: string[];
};

export type UserProfile = {
  name: string;
  email?: string;
  isPremium: boolean;
  joinDate: string;
};