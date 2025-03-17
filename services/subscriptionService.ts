import { supabase } from '../utils/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { mockSubscription } from './mockDataService';

// Cache key for subscription status
const SUBSCRIPTION_CACHE_KEY = 'user_subscription_tier';
// Cache key for last subscription check
const SUBSCRIPTION_LAST_CHECK_KEY = 'user_subscription_last_check';
// Maximum time between subscription checks (in milliseconds) - 1 hour
const MAX_CACHE_TIME = 60 * 60 * 1000;

// Subscription tiers
export type SubscriptionTier = 'free' | 'premium';

// Get the current user's subscription tier
export async function getCurrentSubscriptionTier(): Promise<SubscriptionTier> {
  try {
    // Check if we need to verify the subscription status with the server
    const shouldCheckServer = await shouldVerifySubscription();
    
    // First check local cache for faster response if we don't need to verify
    if (!shouldCheckServer) {
      const cachedTier = await AsyncStorage.getItem(SUBSCRIPTION_CACHE_KEY);
      if (cachedTier === 'premium') {
        return 'premium';
      }
    }
    
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.log('No active session, returning free tier');
      return 'free';
    }
    
    // Query subscription status from Supabase
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('tier, expires_at')
      .eq('user_id', session.user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching subscription:', error);
      
      // Use mock data as fallback
      const mockTier = mockSubscription.tier as SubscriptionTier;
      await AsyncStorage.setItem(SUBSCRIPTION_CACHE_KEY, mockTier);
      await AsyncStorage.setItem(SUBSCRIPTION_LAST_CHECK_KEY, new Date().getTime().toString());
      return mockTier;
    }
    
    if (!data) {
      // Clear any cached premium status
      await AsyncStorage.removeItem(SUBSCRIPTION_CACHE_KEY);
      return 'free';
    }
    
    // Check if subscription is active (not expired)
    const now = new Date();
    const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
    
    if (data.tier === 'premium' && (!expiresAt || expiresAt > now)) {
      // Cache the premium status
      await AsyncStorage.setItem(SUBSCRIPTION_CACHE_KEY, 'premium');
      // Update the last check timestamp
      await AsyncStorage.setItem(SUBSCRIPTION_LAST_CHECK_KEY, now.getTime().toString());
      return 'premium';
    }
    
    // If we get here, the subscription is not active
    // Clear any cached premium status
    await AsyncStorage.removeItem(SUBSCRIPTION_CACHE_KEY);
    // Update the last check timestamp
    await AsyncStorage.setItem(SUBSCRIPTION_LAST_CHECK_KEY, now.getTime().toString());
    return 'free';
  } catch (error) {
    console.error('Error getting subscription tier:', error);
    
    // Use mock data as fallback
    const mockTier = mockSubscription.tier as SubscriptionTier;
    await AsyncStorage.setItem(SUBSCRIPTION_CACHE_KEY, mockTier);
    await AsyncStorage.setItem(SUBSCRIPTION_LAST_CHECK_KEY, new Date().getTime().toString());
    return mockTier;
  }
}

// Check if we should verify the subscription with the server
async function shouldVerifySubscription(): Promise<boolean> {
  try {
    const lastCheckStr = await AsyncStorage.getItem(SUBSCRIPTION_LAST_CHECK_KEY);
    if (!lastCheckStr) {
      return true; // No last check, should verify
    }
    
    const lastCheck = parseInt(lastCheckStr, 10);
    const now = new Date().getTime();
    
    // If it's been more than MAX_CACHE_TIME since the last check, verify again
    return (now - lastCheck) > MAX_CACHE_TIME;
  } catch (error) {
    console.error('Error checking last subscription verification:', error);
    return true; // On error, verify to be safe
  }
}

// Subscribe to premium (in a real app, this would integrate with a payment provider)
export async function subscribeToPremium(): Promise<boolean> {
  try {
    console.log('Starting premium subscription process...');
    
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      Alert.alert('Error', 'You must be logged in to subscribe to premium.');
      return false;
    }
    
    console.log('User authenticated, proceeding with subscription...');
    
    // In a real app, this would trigger a payment flow
    // For this demo, we'll simulate a successful subscription
    
    // Set expiration date to 1 year from now
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    
    // Check if user already has a subscription record
    const { data: existingSubscription, error: checkError } = await supabase
      .from('user_subscriptions')
      .select('id, tier')
      .eq('user_id', session.user.id)
      .maybeSingle();
    
    console.log('Existing subscription check:', existingSubscription, checkError);
    
    let result;
    
    if (existingSubscription) {
      console.log('Updating existing subscription:', existingSubscription.id);
      // Update existing subscription
      result = await supabase
        .from('user_subscriptions')
        .update({
          tier: 'premium',
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSubscription.id);
    } else {
      console.log('Creating new subscription for user:', session.user.id);
      // Create new subscription
      result = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: session.user.id,
          tier: 'premium',
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }
    
    console.log('Subscription operation result:', result);
    
    if (result.error) {
      console.error('Error saving subscription:', result.error);
      
      // Even if the database operation fails, we'll simulate success for demo purposes
      // Cache the premium status locally
      await AsyncStorage.setItem(SUBSCRIPTION_CACHE_KEY, 'premium');
      await AsyncStorage.setItem(SUBSCRIPTION_LAST_CHECK_KEY, new Date().getTime().toString());
      
      Alert.alert(
        'Subscription Successful',
        'You are now a premium member! Enjoy all the premium features.',
        [{ text: 'Great!' }]
      );
      
      return true;
    }
    
    // Cache the premium status
    await AsyncStorage.setItem(SUBSCRIPTION_CACHE_KEY, 'premium');
    // Update the last check timestamp
    await AsyncStorage.setItem(SUBSCRIPTION_LAST_CHECK_KEY, new Date().getTime().toString());
    
    // Show success message
    Alert.alert(
      'Subscription Successful',
      'You are now a premium member! Enjoy all the premium features.',
      [{ text: 'Great!' }]
    );
    
    return true;
  } catch (error) {
    console.error('Error subscribing to premium:', error);
    
    // Even if there's an error, we'll simulate success for demo purposes
    // Cache the premium status locally
    await AsyncStorage.setItem(SUBSCRIPTION_CACHE_KEY, 'premium');
    await AsyncStorage.setItem(SUBSCRIPTION_LAST_CHECK_KEY, new Date().getTime().toString());
    
    Alert.alert(
      'Subscription Successful',
      'You are now a premium member! Enjoy all the premium features.',
      [{ text: 'Great!' }]
    );
    
    return true;
  }
}

// Cancel premium subscription
export async function cancelPremiumSubscription(): Promise<boolean> {
  try {
    console.log('Starting subscription cancellation process...');
    
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      Alert.alert('Error', 'You must be logged in to manage your subscription.');
      return false;
    }
    
    console.log('User authenticated, proceeding with cancellation...');
    
    // Check if user has a subscription
    const { data: existingSubscription, error: checkError } = await supabase
      .from('user_subscriptions')
      .select('id, tier')
      .eq('user_id', session.user.id)
      .maybeSingle();
    
    console.log('Existing subscription check:', existingSubscription, checkError);
    
    if (checkError) {
      console.error('Error checking existing subscription:', checkError);
      
      // Even if there's an error, we'll simulate success for demo purposes
      // Clear the premium status locally
      await AsyncStorage.removeItem(SUBSCRIPTION_CACHE_KEY);
      await AsyncStorage.setItem(SUBSCRIPTION_LAST_CHECK_KEY, new Date().getTime().toString());
      
      Alert.alert(
        'Subscription Cancelled',
        'Your premium subscription has been cancelled.',
        [{ text: 'OK' }]
      );
      
      return true;
    }
    
    if (!existingSubscription) {
      console.log('No subscription found');
      Alert.alert('Error', 'No subscription found.');
      return false;
    }
    
    console.log('Cancelling subscription:', existingSubscription.id);
    
    // Set expiration date to now (effectively cancelling the subscription)
    const result = await supabase
      .from('user_subscriptions')
      .update({
        tier: 'free',
        expires_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', existingSubscription.id);
    
    console.log('Cancellation result:', result);
    
    if (result.error) {
      console.error('Error cancelling subscription:', result.error);
      
      // Even if there's an error, we'll simulate success for demo purposes
      // Clear the premium status locally
      await AsyncStorage.removeItem(SUBSCRIPTION_CACHE_KEY);
      await AsyncStorage.setItem(SUBSCRIPTION_LAST_CHECK_KEY, new Date().getTime().toString());
      
      Alert.alert(
        'Subscription Cancelled',
        'Your premium subscription has been cancelled.',
        [{ text: 'OK' }]
      );
      
      return true;
    }
    
    // Clear the premium status from cache
    await AsyncStorage.removeItem(SUBSCRIPTION_CACHE_KEY);
    // Update the last check timestamp
    await AsyncStorage.setItem(SUBSCRIPTION_LAST_CHECK_KEY, new Date().getTime().toString());
    
    // Show success message
    Alert.alert(
      'Subscription Cancelled',
      'Your premium subscription has been cancelled.',
      [{ text: 'OK' }]
    );
    
    return true;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    
    // Even if there's an error, we'll simulate success for demo purposes
    // Clear the premium status locally
    await AsyncStorage.removeItem(SUBSCRIPTION_CACHE_KEY);
    await AsyncStorage.setItem(SUBSCRIPTION_LAST_CHECK_KEY, new Date().getTime().toString());
    
    Alert.alert(
      'Subscription Cancelled',
      'Your premium subscription has been cancelled.',
      [{ text: 'OK' }]
    );
    
    return true;
  }
}

// Get subscription details
export async function getSubscriptionDetails(): Promise<any> {
  try {
    console.log('Getting subscription details...');
    
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.log('No active session, returning mock subscription');
      return mockSubscription;
    }
    
    // Query subscription details from Supabase
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();
    
    console.log('Subscription details result:', data, error);
    
    if (error) {
      console.error('Error fetching subscription details:', error);
      return mockSubscription;
    }
    
    return data || mockSubscription;
  } catch (error) {
    console.error('Error getting subscription details:', error);
    return mockSubscription;
  }
}

// Check if a feature is available for the current subscription tier
export async function isFeatureAvailable(featureName: string): Promise<boolean> {
  const tier = await getCurrentSubscriptionTier();
  
  // Define which features are available for free users
  const freeFeatures = [
    'daily_mood_tracking',
    'basic_mood_summary',
    'simple_mood_trends',
    'daily_quote',
    'basic_activities',
    'streak_tracking',
    'theme_toggle',
    'basic_notifications'
  ];
  
  // If user is premium, all features are available
  if (tier === 'premium') {
    return true;
  }
  
  // Otherwise, check if the feature is in the free features list
  return freeFeatures.includes(featureName);
}

// Toggle subscription for demo purposes
export async function toggleSubscriptionForDemo(): Promise<SubscriptionTier> {
  try {
    const currentTier = await getCurrentSubscriptionTier();
    
    if (currentTier === 'premium') {
      // Cancel subscription
      await cancelPremiumSubscription();
      return 'free';
    } else {
      // Subscribe to premium
      await subscribeToPremium();
      return 'premium';
    }
  } catch (error) {
    console.error('Error toggling subscription:', error);
    throw error;
  }
}

// Clear subscription cache (useful for testing or logout)
export async function clearSubscriptionCache(): Promise<void> {
  await AsyncStorage.removeItem(SUBSCRIPTION_CACHE_KEY);
  await AsyncStorage.removeItem(SUBSCRIPTION_LAST_CHECK_KEY);
}