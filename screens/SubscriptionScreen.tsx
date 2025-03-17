import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { getCurrentSubscriptionTier, subscribeToPremium, cancelPremiumSubscription } from '../services/subscriptionService';

interface SubscriptionScreenProps {
  onClose: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SubscriptionScreen({ onClose }: SubscriptionScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTier, setCurrentTier] = useState<'free' | 'premium'>('free');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Load subscription status
  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      try {
        const tier = await getCurrentSubscriptionTier();
        setCurrentTier(tier);
      } catch (error) {
        console.error('Error loading subscription status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSubscriptionStatus();
  }, []);

  // Handle subscription
  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      const success = await subscribeToPremium();
      if (success) {
        setCurrentTier('premium');
      }
    } catch (error) {
      console.error('Error subscribing to premium:', error);
    } finally {
      setIsSubscribing(false);
    }
  };

  // Handle cancellation
  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const success = await cancelPremiumSubscription();
      if (success) {
        setCurrentTier('free');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading subscription details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Semi-transparent overlay for the background */}
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1}
        onPress={onClose}
      />
      
      {/* Modal content */}
      <View style={styles.modalContainer}>
        {/* Close button positioned at the top-left */}
        <TouchableOpacity 
          onPress={onClose} 
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <ScrollView 
          style={styles.scrollContainer} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <FontAwesome name="diamond" size={80} color={theme.colors.premium} />
            </View>
            <Text style={styles.heroTitle}>
              {currentTier === 'premium' ? 'Premium Subscription' : 'Unlock the Full Experience'}
            </Text>
            <Text style={styles.heroSubtitle}>
              {currentTier === 'premium' 
                ? 'Thank you for being a premium member!' 
                : 'Get personalized insights, unlimited check-ins, and more with Premium'}
            </Text>
          </View>
          
          <View style={styles.plansContainer}>
            {/* Free Plan */}
            <View style={[
              styles.planCard, 
              currentTier === 'free' && styles.currentPlanCard
            ]}>
              <View style={styles.planHeader}>
                <View style={styles.planTitleContainer}>
                  <View style={styles.freeLabel}>
                    <Text style={styles.freeLabelText}>FREE</Text>
                  </View>
                  <Text style={styles.planTitle}>Free Version</Text>
                </View>
                {currentTier === 'free' && (
                  <View style={styles.currentPlanBadge}>
                    <Text style={styles.currentPlanText}>Current</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.featuresContainer}>
                <FeatureItem text="Daily Mood Tracking – Once per day" />
                <FeatureItem text="Mood Summary – Today, weekly average, streak" />
                <FeatureItem text="Basic Mood Trends – Simple graph of past moods" />
                <FeatureItem text="Daily Mental Health Quote" />
                <FeatureItem text="Limited Recommended Activities" />
                <FeatureItem text="Basic Streak Tracking" />
                <FeatureItem text="Light & Dark Mode" />
                <FeatureItem text="Basic Notifications" />
              </View>
            </View>
            
            {/* Premium Plan */}
            <View style={[
              styles.planCard, 
              styles.premiumPlanCard,
              currentTier === 'premium' && styles.currentPlanCard
            ]}>
              <View style={styles.planHeader}>
                <View style={styles.planTitleContainer}>
                  <View style={styles.premiumLabel}>
                    <FontAwesome name="diamond" size={14} color={theme.colors.background} />
                  </View>
                  <Text style={[styles.planTitle, styles.premiumPlanTitle]}>Premium Version</Text>
                </View>
                {currentTier === 'premium' && (
                  <View style={styles.currentPlanBadge}>
                    <Text style={styles.currentPlanText}>Current</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.featuresContainer}>
                <FeatureItem text="Unlimited Mood Check-ins – Multiple times a day" isPremium />
                <FeatureItem text="Advanced Mood Analytics – Detailed insights & reports" isPremium />
                <FeatureItem text="Smart Activity Recommendations – AI-driven suggestions" isPremium />
                <FeatureItem text="Customizable Mood Tracking – Add notes, tags, details" isPremium />
                <FeatureItem text="Guided Exercises & Meditations – Tailored content" isPremium />
                <FeatureItem text="Unlock More Streak Rewards – Badges, recovery options" isPremium />
                <FeatureItem text="AI Mood Predictions – Future mood trend insights" isPremium />
                <FeatureItem text="Personalized Themes – More color schemes" isPremium />
                <FeatureItem text="Journaling Feature – Add diary entries" isPremium />
                <FeatureItem text="No Ads – Completely ad-free experience" isPremium />
              </View>
            </View>
          </View>
          
          <View style={styles.ctaContainer}>
            {currentTier === 'premium' ? (
              <TouchableOpacity 
                style={[
                  styles.cancelButton,
                  isCancelling && styles.buttonDisabled
                ]}
                onPress={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
                )}
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity 
                  style={[
                    styles.subscribeButton,
                    isSubscribing && styles.buttonDisabled
                  ]}
                  onPress={handleSubscribe}
                  disabled={isSubscribing}
                >
                  {isSubscribing ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.subscribeButtonText}>Upgrade to Premium</Text>
                  )}
                </TouchableOpacity>
                
                <Text style={styles.pricingInfo}>
                  $4.99/month or $49.99/year
                </Text>
              </>
            )}
            
            <TouchableOpacity onPress={onClose} style={styles.closeTextButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

// Helper component for feature items
function FeatureItem({ text, isPremium = false }: { text: string; isPremium?: boolean }) {
  return (
    <View style={styles.featureItem}>
      <View style={[styles.checkCircle, isPremium && styles.premiumCheckCircle]}>
        <Ionicons 
          name="checkmark" 
          size={16} 
          color="white" 
        />
      </View>
      <Text style={[
        styles.featureText,
        isPremium && styles.premiumFeatureText
      ]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    height: '95%', // This makes the modal take up 95% of the screen height, showing 5% of the profile tab
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    ...theme.shadows.large,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 60, // Add padding to the top to avoid overlap with close button
  },
  contentContainer: {
    paddingBottom: 40,
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
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.cardAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...theme.shadows.medium,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: theme.colors.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },
  plansContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: '#444',
  },
  currentPlanCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  premiumPlanCard: {
    backgroundColor: theme.colors.cardAlt,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeLabel: {
    backgroundColor: '#5B9BD5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  freeLabelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: theme.fontWeights.bold,
  },
  premiumLabel: {
    backgroundColor: theme.colors.premium,
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  premiumPlanTitle: {
    color: theme.colors.premium,
  },
  currentPlanBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentPlanText: {
    color: 'white',
    fontSize: 12,
    fontWeight: theme.fontWeights.semibold,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumCheckCircle: {
    backgroundColor: theme.colors.premium,
  },
  featureText: {
    fontSize: 15,
    color: theme.colors.text,
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  premiumFeatureText: {
    fontWeight: theme.fontWeights.medium,
  },
  ctaContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  subscribeButton: {
    backgroundColor: theme.colors.premium,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    ...theme.shadows.small,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  subscribeButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
  },
  pricingInfo: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
  },
  closeTextButton: {
    paddingVertical: 12,
  },
  closeText: {
    fontSize: 16,
    color: theme.colors.subtext,
    fontWeight: theme.fontWeights.medium,
  },
});