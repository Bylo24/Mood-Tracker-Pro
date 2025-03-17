import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { getCurrentSubscriptionTier, subscribeToPremium } from '../services/subscriptionService';

interface PremiumComparisonScreenProps {
  onClose: () => void;
  onSubscribe?: () => Promise<void>;
  showCloseButton?: boolean;
  source?: 'limit' | 'upgrade' | 'settings';
}

export default function PremiumComparisonScreen({ 
  onClose, 
  onSubscribe,
  showCloseButton = true,
  source = 'settings'
}: PremiumComparisonScreenProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentTier, setCurrentTier] = React.useState<'free' | 'premium'>('free');

  React.useEffect(() => {
    const loadSubscriptionStatus = async () => {
      try {
        const tier = await getCurrentSubscriptionTier();
        setCurrentTier(tier);
      } catch (error) {
        console.error('Error loading subscription status:', error);
      }
    };

    loadSubscriptionStatus();
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
        await subscribeToPremium();
        setCurrentTier('premium');
      }
    } catch (error) {
      console.error('Error subscribing to premium:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSourceMessage = () => {
    switch (source) {
      case 'limit':
        return "You've reached a limit of the free plan";
      case 'upgrade':
        return "Upgrade to unlock premium features";
      default:
        return "Compare our plans";
    }
  };

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
              <Text style={styles.planTitle}>🆓 Free Plan</Text>
              {currentTier === 'free' && (
                <View style={styles.currentPlanBadge}>
                  <Text style={styles.currentPlanText}>Current</Text>
                </View>
              )}
            </View>
            
            <View style={styles.featuresContainer}>
              <FeatureItem text="Daily Mood Tracking – Once per day" />
              <FeatureItem text="Basic Mood Summary" />
              <FeatureItem text="Simple Mood Trends Graph" />
              <FeatureItem text="Daily Mental Health Quote" />
              <FeatureItem text="Limited Activity Recommendations" />
              <FeatureItem text="Basic Streak Tracking" />
              <FeatureItem text="Light & Dark Mode" />
              <FeatureItem text="Basic Daily Notifications" />
            </View>
          </View>
          
          {/* Premium Plan */}
          <View style={[
            styles.planCard, 
            styles.premiumPlanCard,
            currentTier === 'premium' && styles.currentPlanCard
          ]}>
            <View style={styles.planHeader}>
              <Text style={[styles.planTitle, styles.premiumPlanTitle]}>💎 Premium Plan</Text>
              {currentTier === 'premium' && (
                <View style={styles.currentPlanBadge}>
                  <Text style={styles.currentPlanText}>Current</Text>
                </View>
              )}
            </View>
            
            <View style={styles.featuresContainer}>
              <FeatureItem text="Unlimited Mood Check-ins" isPremium />
              <FeatureItem text="Advanced Mood Analytics & Reports" isPremium />
              <FeatureItem text="AI-Driven Activity Recommendations" isPremium />
              <FeatureItem text="Customizable Mood Tracking" isPremium />
              <FeatureItem text="Guided Exercises & Meditations" isPremium />
              <FeatureItem text="Enhanced Streak Rewards" isPremium />
              <FeatureItem text="AI Mood Predictions" isPremium />
              <FeatureItem text="Ad-Free Experience" isPremium />
            </View>
          </View>
        </View>
        
        <View style={styles.ctaContainer}>
          <TouchableOpacity 
            style={[
              styles.subscribeButton,
              isLoading && styles.subscribeButtonDisabled,
              currentTier === 'premium' && styles.alreadySubscribedButton
            ]}
            onPress={handleSubscribe}
            disabled={isLoading}
          >
            <Text style={styles.subscribeButtonText}>
              {currentTier === 'premium' 
                ? 'You Already Have Premium' 
                : isLoading 
                  ? 'Processing...' 
                  : 'Upgrade to Premium'}
            </Text>
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
  subscribeButtonDisabled: {
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
});