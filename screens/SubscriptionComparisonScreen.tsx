import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { getCurrentSubscriptionTier, subscribeToPremium, getSubscriptionDetails, cancelPremiumSubscription } from '../services/subscriptionService';

interface SubscriptionComparisonScreenProps {
  onClose: () => void;
  onSubscribe?: () => Promise<void>;
  showCloseButton?: boolean;
  source?: 'limit' | 'upgrade' | 'settings' | 'manage';
}

export default function SubscriptionComparisonScreen({ 
  onClose, 
  onSubscribe,
  showCloseButton = true,
  source = 'settings'
}: SubscriptionComparisonScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTier, setCurrentTier] = useState<'free' | 'premium'>('free');
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const loadSubscriptionData = async () => {
      try {
        const tier = await getCurrentSubscriptionTier();
        setCurrentTier(tier);
        
        if (tier === 'premium') {
          const details = await getSubscriptionDetails();
          setSubscriptionDetails(details);
        }
      } catch (error) {
        console.error('Error loading subscription data:', error);
      }
    };

    loadSubscriptionData();
  }, []);

  const handleSubscribe = async () => {
    if (currentTier === 'premium') {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      if (onSubscribe) {
        await onSubscribe();
      } else {
        const success = await subscribeToPremium();
        if (success) {
          setCurrentTier('premium');
          // Reload subscription details
          const details = await getSubscriptionDetails();
          setSubscriptionDetails(details);
        }
      }
    } catch (error) {
      console.error('Error subscribing to premium:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const success = await cancelPremiumSubscription();
      if (success) {
        setCurrentTier('free');
        setSubscriptionDetails(null);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const getSourceMessage = () => {
    switch (source) {
      case 'limit':
        return "Compare our plans"; // Changed from "You've reached a limit of the free plan"
      case 'upgrade':
        return "Compare our plans";
      case 'manage':
        return "Manage your subscription";
      default:
        return "Compare our plans";
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // If we're in "manage" mode and the user is premium, show the subscription management screen
  if ((source === 'manage' || currentTier === 'premium') && subscriptionDetails) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
        
        <View style={styles.header}>
          {showCloseButton && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Manage Subscription</Text>
        </View>
        
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <FontAwesome name="diamond" size={80} color={theme.colors.premium} />
            </View>
            <Text style={styles.heroTitle}>Premium Subscription</Text>
            <Text style={styles.heroSubtitle}>
              Thank you for being a premium member!
            </Text>
          </View>
          
          <View style={styles.subscriptionDetailsCard}>
            <Text style={styles.detailsTitle}>Subscription Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <View style={[
                styles.statusBadge,
                subscriptionDetails.status === 'active' ? styles.activeStatusBadge : styles.inactiveStatusBadge
              ]}>
                <Text style={styles.statusText}>
                  {subscriptionDetails.status === 'active' ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Plan:</Text>
              <Text style={styles.detailValue}>Premium</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Renewal Date:</Text>
              <Text style={styles.detailValue}>
                {subscriptionDetails.expires_at ? formatDate(subscriptionDetails.expires_at) : 'N/A'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Subscription ID:</Text>
              <Text style={styles.detailValue}>
                {subscriptionDetails.subscription_id || 'N/A'}
              </Text>
            </View>
          </View>
          
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsSectionTitle}>Your Premium Benefits</Text>
            
            <View style={styles.benefitsList}>
              <BenefitItem text="Unlimited Mood Check-ins" />
              <BenefitItem text="Advanced Mood Analytics" />
              <BenefitItem text="Smart Activity Recommendations" />
              <BenefitItem text="Customizable Mood Tracking" />
              <BenefitItem text="Guided Exercises & Meditations" />
              <BenefitItem text="Unlock More Streak Rewards" />
              <BenefitItem text="AI Mood Predictions" />
              <BenefitItem text="No Ads" />
            </View>
          </View>
          
          <View style={styles.ctaContainer}>
            <TouchableOpacity 
              style={[
                styles.cancelButton,
                isCancelling && styles.buttonDisabled
              ]}
              onPress={handleCancelSubscription}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onClose} style={styles.closeTextButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Otherwise, show the comparison screen
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <View style={styles.header}>
        {showCloseButton && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{getSourceMessage()}</Text>
      </View>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <FontAwesome name="diamond" size={80} color={theme.colors.premium} />
          </View>
          <Text style={styles.heroTitle}>Unlock the Full Experience</Text>
          <Text style={styles.heroSubtitle}>
            Get personalized insights, unlimited check-ins, and more with Premium
          </Text>
        </View>
        
        <View style={styles.plansContainer}>
          {/* Free Plan */}
          <View style={[
            styles.planCard, 
            currentTier === 'free' && styles.currentPlanCard
          ]}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>🆓 Free Version</Text>
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
              <Text style={[styles.planTitle, styles.premiumPlanTitle]}>💎 Premium Version</Text>
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
              <FeatureItem text="Guided Exercises & Meditations – Exclusive content tailored to user moods" isPremium />
              <FeatureItem text="Unlock More Streak Rewards – Special badges, streak recovery options" isPremium />
              <FeatureItem text="AI Mood Predictions – Get insights into future mood trends based on past data" isPremium />
              <FeatureItem text="No Ads – Completely ad-free experience" isPremium />
            </View>
          </View>
        </View>
        
        <View style={styles.ctaContainer}>
          <TouchableOpacity 
            style={[
              styles.subscribeButton,
              isLoading && styles.buttonDisabled,
              currentTier === 'premium' && styles.alreadySubscribedButton
            ]}
            onPress={handleSubscribe}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.subscribeButtonText}>
                {currentTier === 'premium' 
                  ? 'You Already Have Premium' 
                  : 'Upgrade to Premium'}
              </Text>
            )}
          </TouchableOpacity>
          
          {currentTier !== 'premium' && (
            <Text style={styles.pricingInfo}>
              $4.99/month or $49.99/year
            </Text>
          )}
          
          <TouchableOpacity onPress={onClose} style={styles.noThanksButton}>
            <Text style={styles.noThanksText}>
              {currentTier === 'premium' ? 'Close' : 'Not Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper component for feature items
function FeatureItem({ text, isPremium = false }: { text: string; isPremium?: boolean }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons 
        name="checkmark-circle" 
        size={20} 
        color={isPremium ? theme.colors.premium : theme.colors.success} 
      />
      <Text style={[
        styles.featureText,
        isPremium && styles.premiumFeatureText
      ]}>
        {text}
      </Text>
    </View>
  );
}

// Helper component for benefit items
function BenefitItem({ text }: { text: string }) {
  return (
    <View style={styles.benefitItem}>
      <Ionicons 
        name="star" 
        size={20} 
        color={theme.colors.premium} 
      />
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
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
  alreadySubscribedButton: {
    backgroundColor: theme.colors.success,
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
  noThanksButton: {
    paddingVertical: 12,
  },
  noThanksText: {
    fontSize: 16,
    color: theme.colors.subtext,
    fontWeight: theme.fontWeights.medium,
  },
  // Subscription details styles
  subscriptionDetailsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    ...theme.shadows.medium,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  detailLabel: {
    fontSize: 15,
    color: theme.colors.subtext,
  },
  detailValue: {
    fontSize: 15,
    color: theme.colors.text,
    fontWeight: theme.fontWeights.medium,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatusBadge: {
    backgroundColor: theme.colors.success,
  },
  inactiveStatusBadge: {
    backgroundColor: theme.colors.error,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: theme.fontWeights.semibold,
  },
  benefitsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  benefitsSectionTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 16,
  },
  benefitsList: {
    backgroundColor: theme.colors.cardAlt,
    borderRadius: 16,
    padding: 16,
    ...theme.shadows.small,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 15,
    color: theme.colors.text,
    marginLeft: 10,
    flex: 1,
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