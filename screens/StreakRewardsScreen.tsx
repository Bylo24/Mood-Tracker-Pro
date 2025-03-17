import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView, 
  StatusBar,
  Dimensions,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { getMoodStreak } from '../services/moodService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

interface StreakRewardsScreenProps {
  navigation: any;
  route: any;
}

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredStreak: number;
  isPremium: boolean;
  unlocked: boolean;
}

interface AppIcon {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  requiredStreak: number;
  claimed: boolean;
}

export default function StreakRewardsScreen({ navigation, route }: StreakRewardsScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [appIcons, setAppIcons] = useState<AppIcon[]>([]);
  const [isPremium, setIsPremium] = useState(route.params?.isPremium || false);
  const [streakRecoveryAvailable, setStreakRecoveryAvailable] = useState(false);
  const [userName, setUserName] = useState('');

  // Mock badges data
  const mockBadges: Badge[] = [
    {
      id: '1',
      title: 'First Check-in',
      description: 'You logged your mood for the first time!',
      icon: 'checkmark-circle',
      requiredStreak: 1,
      isPremium: false,
      unlocked: false
    },
    {
      id: '2',
      title: 'Consistency Starter',
      description: 'You logged your mood for 3 days in a row!',
      icon: 'calendar',
      requiredStreak: 3,
      isPremium: false,
      unlocked: false
    },
    {
      id: '3',
      title: 'Week Warrior',
      description: 'You logged your mood for 7 days in a row!',
      icon: 'star',
      requiredStreak: 7,
      isPremium: false,
      unlocked: false
    },
    {
      id: '4',
      title: 'Fortnight Focus',
      description: 'You logged your mood for 14 days in a row!',
      icon: 'flame',
      requiredStreak: 14,
      isPremium: false,
      unlocked: false
    },
    {
      id: '5',
      title: 'Monthly Master',
      description: 'You logged your mood for 30 days in a row!',
      icon: 'trophy',
      requiredStreak: 30,
      isPremium: false,
      unlocked: false
    },
    {
      id: '6',
      title: 'Quarterly Champion',
      description: 'You logged your mood for 90 days in a row!',
      icon: 'ribbon',
      requiredStreak: 90,
      isPremium: true,
      unlocked: false
    },
    {
      id: '7',
      title: 'Half-Year Hero',
      description: 'You logged your mood for 180 days in a row!',
      icon: 'medal',
      requiredStreak: 180,
      isPremium: true,
      unlocked: false
    },
    {
      id: '8',
      title: 'Year-Long Legend',
      description: 'You logged your mood for 365 days in a row!',
      icon: 'planet',
      requiredStreak: 365,
      isPremium: true,
      unlocked: false
    }
  ];

  // App icons data using the alt-icons from assets in the specified order
  const altAppIcons: AppIcon[] = [
    {
      id: '1',
      title: 'Inverted Icon',
      description: 'A sleek inverted app icon',
      imagePath: require('../assets/alt-icons/Inverted.png'),
      requiredStreak: 7,
      claimed: false
    },
    {
      id: '2',
      title: 'Red Icon',
      description: 'A vibrant red app icon',
      imagePath: require('../assets/alt-icons/Red.png'),
      requiredStreak: 14,
      claimed: false
    },
    {
      id: '3',
      title: 'Green Icon',
      description: 'A peaceful green app icon',
      imagePath: require('../assets/alt-icons/Green.png'),
      requiredStreak: 30,
      claimed: false
    },
    {
      id: '4',
      title: 'Blue Icon',
      description: 'A calming blue app icon',
      imagePath: require('../assets/alt-icons/Blue.png'),
      requiredStreak: 60,
      claimed: false
    },
    {
      id: '5',
      title: 'Rainbow Icon',
      description: 'A colorful rainbow app icon',
      imagePath: require('../assets/alt-icons/Rainbow.png'),
      requiredStreak: 90,
      claimed: false
    },
    {
      id: '6',
      title: 'Diamond Icon',
      description: 'An exclusive diamond app icon',
      imagePath: require('../assets/alt-icons/Diamond.png'),
      requiredStreak: 120,
      claimed: false
    }
  ];

  useEffect(() => {
    const loadStreakData = async () => {
      setIsLoading(true);
      try {
        // Get user name
        const storedName = await AsyncStorage.getItem('user_display_name');
        if (storedName) {
          setUserName(storedName);
        }

        // Get current streak
        const streak = await getMoodStreak();
        setCurrentStreak(streak);

        // Get longest streak from storage
        const storedLongestStreak = await AsyncStorage.getItem('longest_streak');
        const longestStreakValue = storedLongestStreak ? parseInt(storedLongestStreak) : 0;
        
        // Update longest streak if current streak is longer
        if (streak > longestStreakValue) {
          await AsyncStorage.setItem('longest_streak', streak.toString());
          setLongestStreak(streak);
        } else {
          setLongestStreak(longestStreakValue);
        }

        // Check if streak recovery is available (for premium users)
        const lastRecoveryDate = await AsyncStorage.getItem('last_streak_recovery_date');
        const recoveryAvailable = !lastRecoveryDate || 
          (new Date().getTime() - new Date(lastRecoveryDate).getTime() > 30 * 24 * 60 * 60 * 1000); // 30 days
        
        setStreakRecoveryAvailable(isPremium && recoveryAvailable);

        // Update badges based on streak
        const updatedBadges = mockBadges.map(badge => ({
          ...badge,
          unlocked: streak >= badge.requiredStreak && (!badge.isPremium || isPremium)
        }));
        setBadges(updatedBadges);

        // Update app icons based on streak
        const updatedAppIcons = await Promise.all(altAppIcons.map(async icon => {
          const claimedKey = `app_icon_claimed_${icon.id}`;
          const claimed = await AsyncStorage.getItem(claimedKey) === 'true';
          return {
            ...icon,
            claimed
          };
        }));
        setAppIcons(updatedAppIcons);

      } catch (error) {
        console.error('Error loading streak data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStreakData();
  }, [isPremium]);

  const handleClaimAppIcon = async (icon: AppIcon) => {
    if (currentStreak < icon.requiredStreak) {
      alert(`You need a ${icon.requiredStreak}-day streak to claim this app icon.`);
      return;
    }

    try {
      // Mark app icon as claimed
      await AsyncStorage.setItem(`app_icon_claimed_${icon.id}`, 'true');
      
      // Update app icons list
      setAppIcons(appIcons.map(i => 
        i.id === icon.id ? { ...i, claimed: true } : i
      ));

      // Simulate applying the app icon
      await AsyncStorage.setItem('current_app_icon', icon.id);

      // Show success message
      alert(`Congratulations! You've unlocked the ${icon.title}. It has been applied to your app.`);
    } catch (error) {
      console.error('Error claiming app icon:', error);
      alert('There was an error claiming your app icon. Please try again.');
    }
  };

  const handleRecoverStreak = async () => {
    if (!isPremium) {
      navigation.navigate('SubscriptionComparison', { source: 'upgrade' });
      return;
    }

    if (!streakRecoveryAvailable) {
      alert('Streak recovery is not available yet. You can use it once every 30 days.');
      return;
    }

    try {
      // Record the recovery date
      await AsyncStorage.setItem('last_streak_recovery_date', new Date().toISOString());
      
      // Increment streak by 1 (simulating recovery of a missed day)
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      
      // Update longest streak if needed
      if (newStreak > longestStreak) {
        await AsyncStorage.setItem('longest_streak', newStreak.toString());
        setLongestStreak(newStreak);
      }
      
      // Disable recovery option
      setStreakRecoveryAvailable(false);
      
      // Update badges
      const updatedBadges = badges.map(badge => ({
        ...badge,
        unlocked: newStreak >= badge.requiredStreak && (!badge.isPremium || isPremium)
      }));
      setBadges(updatedBadges);
      
      alert('Streak recovered successfully! Your streak is now ' + newStreak + ' days.');
    } catch (error) {
      console.error('Error recovering streak:', error);
      alert('There was an error recovering your streak. Please try again.');
    }
  };

  const getStreakMessage = () => {
    if (currentStreak === 0) return "Start tracking your mood to build a streak!";
    if (currentStreak < 3) return "You're just getting started. Keep it up!";
    if (currentStreak < 7) return "You're building momentum!";
    if (currentStreak < 14) return "Great consistency! You're on a roll!";
    if (currentStreak < 30) return "Impressive dedication to your wellbeing!";
    if (currentStreak < 90) return "Amazing commitment! You're a mood tracking pro!";
    if (currentStreak < 180) return "Extraordinary discipline! You're an inspiration!";
    return "Legendary consistency! You've achieved something remarkable!";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Streak Rewards</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading your streak data...</Text>
          </View>
        ) : (
          <>
            <View style={styles.streakSummaryContainer}>
              <View style={styles.streakCard}>
                <View style={styles.streakHeader}>
                  <Ionicons name="flame" size={32} color={theme.colors.accent} />
                  <Text style={styles.streakTitle}>Current Streak</Text>
                </View>
                <Text style={styles.streakCount} numberOfLines={1}>
                  {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
                </Text>
                <Text style={styles.streakMessage}>{getStreakMessage()}</Text>
                
                {isPremium && (
                  <TouchableOpacity 
                    style={[
                      styles.recoveryButton, 
                      !streakRecoveryAvailable && styles.recoveryButtonDisabled
                    ]}
                    onPress={handleRecoverStreak}
                    disabled={!streakRecoveryAvailable}
                  >
                    <Ionicons name="refresh-circle" size={20} color="#fff" />
                    <Text style={styles.recoveryButtonText}>
                      {streakRecoveryAvailable ? 'Recover Missed Day' : 'Recovery Unavailable'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Longest Streak</Text>
                  <Text style={styles.statValue} numberOfLines={1}>
                    {longestStreak} {longestStreak === 1 ? 'day' : 'days'}
                  </Text>
                </View>
                
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Next Badge</Text>
                  <Text style={styles.statValue}>
                    {badges.find(b => !b.unlocked && (!b.isPremium || isPremium))?.requiredStreak || 'All earned!'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.badgesContainer}>
              <Text style={styles.sectionTitle}>Your Badges</Text>
              <Text style={styles.sectionSubtitle}>Achievements you've earned through consistent tracking</Text>
              
              {/* Changed from grid to rows for better text display */}
              <View style={styles.badgesRows}>
                {badges.map(badge => (
                  <View 
                    key={badge.id} 
                    style={[
                      styles.badgeItem,
                      (!badge.unlocked || (badge.isPremium && !isPremium)) && styles.badgeItemLocked
                    ]}
                  >
                    <View style={styles.badgeContent}>
                      <View style={styles.badgeIconContainer}>
                        <Ionicons 
                          name={badge.icon as any} 
                          size={32} 
                          color={badge.unlocked && (!badge.isPremium || isPremium) ? theme.colors.accent : theme.colors.subtext} 
                        />
                        {badge.isPremium && !isPremium && (
                          <View style={styles.premiumBadgeOverlay}>
                            <Ionicons name="lock-closed" size={16} color="#fff" />
                          </View>
                        )}
                      </View>
                      <View style={styles.badgeTextContainer}>
                        <Text 
                          style={[
                            styles.badgeTitle,
                            (!badge.unlocked || (badge.isPremium && !isPremium)) && styles.badgeTitleLocked
                          ]}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {badge.title}
                        </Text>
                        <Text style={styles.badgeRequirement} numberOfLines={1}>
                          {badge.requiredStreak} {badge.requiredStreak === 1 ? 'day' : 'days'}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.appIconsContainer}>
              <Text style={styles.sectionTitle}>App Icons</Text>
              <Text style={styles.sectionSubtitle}>Unlock custom app icons with your streak</Text>
              
              <View style={styles.appIconsGrid}>
                {appIcons.map(icon => (
                  <TouchableOpacity 
                    key={icon.id} 
                    style={[
                      styles.appIconItem,
                      currentStreak < icon.requiredStreak && styles.appIconItemLocked
                    ]}
                    onPress={() => handleClaimAppIcon(icon)}
                    disabled={currentStreak < icon.requiredStreak || icon.claimed}
                  >
                    <View style={[
                      styles.appIconContainer,
                      icon.claimed && styles.appIconContainerClaimed
                    ]}>
                      <Image 
                        source={icon.imagePath}
                        style={styles.iconImage}
                        resizeMode="contain"
                      />
                      {icon.claimed && (
                        <View style={styles.checkmarkOverlay}>
                          <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                        </View>
                      )}
                      {currentStreak < icon.requiredStreak && (
                        <View style={styles.lockOverlay}>
                          <Ionicons name="lock-closed" size={20} color="#fff" />
                        </View>
                      )}
                    </View>
                    <View style={styles.appIconTitleContainer}>
                      <Text 
                        style={[
                          styles.appIconTitle,
                          currentStreak < icon.requiredStreak && styles.appIconTitleLocked
                        ]}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {icon.title}
                      </Text>
                    </View>
                    <View style={styles.appIconRequirementContainer}>
                      <Text style={styles.appIconRequirement} numberOfLines={1}>
                        {icon.requiredStreak} day streak
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {!isPremium && (
              <TouchableOpacity 
                style={styles.upgradeButton}
                onPress={() => navigation.navigate('SubscriptionComparison', { source: 'upgrade' })}
              >
                <Text style={styles.upgradeButtonText}>Upgrade to Premium for More Rewards</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingHorizontal: screenWidth * 0.05,
    paddingTop: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },
  streakSummaryContainer: {
    marginBottom: 24,
  },
  streakCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    ...theme.shadows.medium,
    marginBottom: 16,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginLeft: 8,
    lineHeight: 24,
  },
  streakCount: {
    fontSize: 42,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.accent,
    marginVertical: 8,
    lineHeight: 48,
    textAlign: 'center',
  },
  streakMessage: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  recoveryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  recoveryButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  recoveryButtonText: {
    color: '#fff',
    fontWeight: theme.fontWeights.semibold,
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    ...theme.shadows.medium,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 8,
    lineHeight: 26,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginBottom: 16,
    lineHeight: 20,
  },
  badgesContainer: {
    marginBottom: 24,
  },
  // Changed from grid to rows for better text display
  badgesRows: {
    flexDirection: 'column',
  },
  badgeItem: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    ...theme.shadows.small,
  },
  badgeItemLocked: {
    opacity: 0.6,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 12,
  },
  premiumBadgeOverlay: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: theme.colors.accent,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeTextContainer: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  badgeTitleLocked: {
    color: theme.colors.subtext,
  },
  badgeRequirement: {
    fontSize: 12,
    color: theme.colors.subtext,
    lineHeight: 16,
  },
  appIconsContainer: {
    marginBottom: 24,
  },
  appIconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  appIconItem: {
    width: '31%',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginBottom: 16,
    ...theme.shadows.small,
    height: 140,
    justifyContent: 'space-between',
  },
  appIconItemLocked: {
    opacity: 0.6,
  },
  appIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    position: 'relative',
    backgroundColor: theme.colors.cardAlt,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  iconImage: {
    width: 56,
    height: 56,
  },
  appIconContainerClaimed: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  checkmarkOverlay: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIconTitleContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIconTitle: {
    fontSize: 12,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 16,
  },
  appIconTitleLocked: {
    color: theme.colors.subtext,
  },
  appIconRequirementContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  appIconRequirement: {
    fontSize: 10,
    color: theme.colors.subtext,
    textAlign: 'center',
    lineHeight: 14,
  },
  upgradeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: '#fff',
    lineHeight: 22,
  },
});