import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, Platform, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from './theme/theme';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SetupNameScreen from './screens/SetupNameScreen';
import IntroductionScreen from './screens/IntroductionScreen';
import TipsScreen from './screens/TipsScreen';
import SubscriptionComparisonScreen from './screens/SubscriptionComparisonScreen';
import GuidedExercisesScreen from './screens/GuidedExercisesScreen';
import ExerciseCategoryScreen from './screens/ExerciseCategoryScreen';
import ExercisePlayerScreen from './screens/ExercisePlayerScreen';
import StreakRewardsScreen from './screens/StreakRewardsScreen';
import MoodPredictionsScreen from './screens/MoodPredictionsScreen';
import AdvancedMoodAnalyticsScreen from './screens/AdvancedMoodAnalyticsScreen';
import TermsOfServiceScreen from './screens/TermsOfServiceScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import AboutScreen from './screens/AboutScreen';
import { isAuthenticated, signOut, getCurrentUser } from './services/authService';
import { supabase } from './utils/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  initializeNotifications, 
  requestNotificationPermissions,
  checkScheduledNotifications
} from './services/notificationService';
import * as Notifications from 'expo-notifications';

// Define navigation stack param list
type RootStackParamList = {
  Login: undefined;
  SetupName: undefined;
  Introduction: { userName: string };
  Tips: undefined;
  Home: undefined;
  SubscriptionComparison: { source: 'limit' | 'upgrade' | 'settings' | 'manage' };
  GuidedExercises: { isPremium: boolean };
  ExerciseCategory: { 
    category: 'meditation' | 'breathing' | 'mindfulness' | 'physical';
    isPremium: boolean;
  };
  ExercisePlayer: { exerciseId: string };
  StreakRewards: { isPremium: boolean };
  MoodPredictions: { isPremium: boolean };
  AdvancedMoodAnalytics: { isPremium: boolean };
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState<keyof RootStackParamList>('Login');
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  
  // Refs for navigation
  const navigationRef = useRef<any>(null);
  const notificationResponseRef = useRef<Notifications.NotificationResponse | null>(null);
  
  // Initialize notifications and check authentication status when app loads
  useEffect(() => {
    const setupApp = async () => {
      try {
        console.log('Setting up app and notifications...');
        
        // Request notification permissions early
        const permissionGranted = await requestNotificationPermissions();
        console.log('Notification permission granted:', permissionGranted);
        
        // Initialize notifications
        await initializeNotifications();
        
        // Check if notifications are scheduled
        await checkScheduledNotifications();
        
        // Set up notification received handler
        const subscription = Notifications.addNotificationReceivedListener(notification => {
          console.log('Notification received in foreground!', notification);
        });
        
        // Set up notification response handler (when user taps notification)
        const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
          console.log('Notification response received!', response);
          
          // Store the response to handle after navigation is ready
          notificationResponseRef.current = response;
          
          // If navigation is already initialized, handle the notification
          if (navigationRef.current && !isLoading) {
            handleNotificationResponse(response);
          }
        });
        
        // Clean up subscriptions when component unmounts
        return () => {
          subscription.remove();
          responseSubscription.remove();
        };
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };
    
    setupApp();
    checkAuth();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      console.log('Session:', session ? 'Present' : 'None');
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in, checking onboarding status');
        checkOnboardingStatus();
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        console.log('User signed out, updating UI');
        setInitialRouteName('Login');
        setIsLoading(false);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  // Handle notification response after navigation is ready
  useEffect(() => {
    if (navigationRef.current && !isLoading && notificationResponseRef.current) {
      handleNotificationResponse(notificationResponseRef.current);
      notificationResponseRef.current = null;
    }
  }, [isLoading, navigationRef.current]);
  
  // Handle notification response
  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    // Navigate to Home screen when notification is tapped
    if (initialRouteName === 'Home' && navigationRef.current) {
      navigationRef.current.navigate('Home');
    }
  };
  
  // Check if user is authenticated
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      console.log('Checking authentication status...');
      const authenticated = await isAuthenticated();
      console.log('Authentication check result:', authenticated);
      
      if (authenticated) {
        await checkOnboardingStatus();
      } else {
        setInitialRouteName('Login');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setInitialRouteName('Login');
      setIsLoading(false);
    }
  };
  
  // Check if user has completed onboarding
  const checkOnboardingStatus = async () => {
    try {
      console.log('Checking onboarding status...');
      // Check if user has completed onboarding
      const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
      console.log('Onboarding completed:', onboardingCompleted);
      
      if (onboardingCompleted === 'true') {
        console.log('User has completed onboarding, proceeding to home');
        // Get user name
        const storedName = await AsyncStorage.getItem('user_display_name');
        if (storedName) {
          setUserName(storedName);
          console.log('Using stored name:', storedName);
        } else {
          // Fall back to email-based name
          try {
            const user = await getCurrentUser();
            if (user?.email) {
              const emailName = user.email.split('@')[0];
              setUserName(emailName);
              console.log('Using email-based name:', emailName);
              // Save this name for future use
              await AsyncStorage.setItem('user_display_name', emailName);
            } else {
              console.log('No user email found, using default name');
              setUserName('User');
              await AsyncStorage.setItem('user_display_name', 'User');
            }
          } catch (error) {
            console.error('Error getting current user:', error);
            setUserName('User');
            await AsyncStorage.setItem('user_display_name', 'User');
          }
        }
        setInitialRouteName('Home');
      } else {
        // Check if this is a new user or returning user
        if (isNewUser) {
          // New user - show onboarding
          // Check if user has a name set but hasn't completed full onboarding
          const storedName = await AsyncStorage.getItem('user_display_name');
          
          if (storedName) {
            setUserName(storedName);
            setInitialRouteName('Introduction');
            console.log('User has name but needs to complete onboarding, going to Introduction');
          } else {
            // Get user email to extract name if available
            try {
              const user = await getCurrentUser();
              if (user?.email) {
                const emailName = user.email.split('@')[0];
                setUserName(emailName);
                console.log('Using email-based name for new user:', emailName);
              } else {
                console.log('No user email found for new user, using default name');
                setUserName('User');
              }
            } catch (error) {
              console.error('Error getting current user for new user:', error);
              setUserName('User');
            }
            
            console.log('User needs to complete onboarding, going to SetupName');
            setInitialRouteName('SetupName');
          }
        } else {
          // Returning user - skip onboarding and mark as completed
          console.log('Returning user, skipping onboarding');
          await AsyncStorage.setItem('onboarding_completed', 'true');
          
          // Get user name
          const storedName = await AsyncStorage.getItem('user_display_name');
          if (storedName) {
            setUserName(storedName);
            console.log('Using stored name for returning user:', storedName);
          } else {
            // Fall back to email-based name
            try {
              const user = await getCurrentUser();
              if (user?.email) {
                const emailName = user.email.split('@')[0];
                setUserName(emailName);
                console.log('Using email-based name for returning user:', emailName);
                // Save this name for future use
                await AsyncStorage.setItem('user_display_name', emailName);
              } else {
                console.log('No user email found for returning user, using default name');
                setUserName('User');
                await AsyncStorage.setItem('user_display_name', 'User');
              }
            } catch (error) {
              console.error('Error getting current user for returning user:', error);
              setUserName('User');
              await AsyncStorage.setItem('user_display_name', 'User');
            }
          }
          
          setInitialRouteName('Home');
        }
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setInitialRouteName('SetupName');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle login
  const handleLogin = (isSignUp: boolean) => {
    console.log('Login successful, isSignUp:', isSignUp);
    setIsNewUser(isSignUp);
    
    // Force navigation to Home screen directly
    console.log('Forcing navigation to Home screen');
    setInitialRouteName('Home');
    setIsLoading(false);
    
    // If navigation is already ready, navigate programmatically
    if (isNavigationReady && navigationRef.current) {
      console.log('Navigation is ready, navigating programmatically');
      navigationRef.current.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await signOut();
      console.log('Logout successful, updating UI');
      setInitialRouteName('Login');
      
      // Reset navigation stack
      if (navigationRef.current) {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };
  
  // Handle navigation ready
  const handleNavigationReady = () => {
    console.log('Navigation is ready');
    setIsNavigationReady(true);
  };
  
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer}>
          <StatusBar style="light" />
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading Mood Buddy...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
  
  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={handleNavigationReady}
      >
        <StatusBar style="light" />
        <Stack.Navigator 
          initialRouteName={initialRouteName}
          screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background }
          }}
        >
          <Stack.Screen name="Login">
            {props => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
          
          <Stack.Screen name="SetupName">
            {props => (
              <SetupNameScreen 
                {...props}
                onComplete={(name) => {
                  AsyncStorage.setItem('user_display_name', name).then(() => {
                    setUserName(name);
                    props.navigation.navigate('Introduction');
                  });
                }}
                onSkip={() => {
                  if (userName) {
                    AsyncStorage.setItem('user_display_name', userName).catch(err => 
                      console.error('Error saving default user name:', err)
                    );
                  }
                  props.navigation.navigate('Introduction');
                }}
              />
            )}
          </Stack.Screen>
          
          <Stack.Screen name="Introduction" initialParams={{ userName }}>
            {props => (
              <IntroductionScreen 
                {...props}
                onComplete={() => props.navigation.navigate('Tips')}
                userName={userName}
              />
            )}
          </Stack.Screen>
          
          <Stack.Screen name="Tips">
            {props => (
              <TipsScreen 
                {...props}
                onComplete={() => {
                  AsyncStorage.setItem('onboarding_completed', 'true').then(() => {
                    props.navigation.navigate('Home');
                  }).catch(error => {
                    console.error('Error saving onboarding status:', error);
                    props.navigation.navigate('Home');
                  });
                }}
              />
            )}
          </Stack.Screen>
          
          <Stack.Screen name="Home">
            {props => (
              <HomeScreen 
                {...props}
                onLogout={handleLogout}
              />
            )}
          </Stack.Screen>
          
          <Stack.Screen name="SubscriptionComparison">
            {props => (
              <SubscriptionComparisonScreen 
                onClose={() => props.navigation.goBack()}
                showCloseButton={true}
                source={props.route.params?.source || 'upgrade'}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="GuidedExercises">
            {props => (
              <GuidedExercisesScreen 
                {...props}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="ExerciseCategory">
            {props => (
              <ExerciseCategoryScreen 
                {...props}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="ExercisePlayer">
            {props => (
              <ExercisePlayerScreen 
                {...props}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="StreakRewards">
            {props => (
              <StreakRewardsScreen 
                {...props}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="MoodPredictions">
            {props => (
              <MoodPredictionsScreen 
                {...props}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="AdvancedMoodAnalytics">
            {props => (
              <AdvancedMoodAnalyticsScreen 
                {...props}
              />
            )}
          </Stack.Screen>
          
          <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
          
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          
          <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.subtext,
  },
});