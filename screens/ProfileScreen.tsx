import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  ScrollView, 
  Modal, 
  TextInput, 
  Switch,
  FlatList,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { getCurrentUser } from '../services/authService';
import { getMoodStreak, getAverageMood } from '../services/moodService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabaseClient';
import { MoodRating } from '../types';
import { getCurrentSubscriptionTier, SubscriptionTier, toggleSubscriptionForDemo } from '../services/subscriptionService';
import PremiumFeatureModal from '../components/PremiumFeatureModal';
import SubscriptionComparisonScreen from './SubscriptionComparisonScreen';
import DateTimePicker from '@react-native-community/datetimepicker';
import { 
  getNotificationsEnabled, 
  setNotificationsEnabled, 
  getNotificationTime,
  setNotificationTime,
  scheduleDailyReminder
} from '../services/notificationService';
import AppIconSelector from '../components/AppIconSelector';
import { useNavigation } from '@react-navigation/native';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

interface ProfileScreenProps {
  onClose: () => void;
  onLogout: () => void;
}

// Hours for time picker
const hours = Array.from({ length: 12 }, (_, i) => ({ 
  value: i === 0 ? 12 : i, 
  label: i === 0 ? '12' : i.toString().padStart(2, '0'),
  actualHour: i === 0 ? 0 : i // 12 AM is hour 0 in 24-hour format
}));

// Minutes for time picker
const minutes = Array.from({ length: 60 }, (_, i) => ({ 
  value: i, 
  label: i.toString().padStart(2, '0') 
}));

// AM/PM options
const ampm = [
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' }
];

export default function ProfileScreen({ onClose, onLogout }: ProfileScreenProps) {
  const navigation = useNavigation();
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [streak, setStreak] = useState(0);
  const [averageMood, setAverageMood] = useState<number | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);
  const [isUpdatingSubscription, setIsUpdatingSubscription] = useState(false);
  const [subscriptionComparisonVisible, setSubscriptionComparisonVisible] = useState(false);
  
  // Notification time states
  const [notificationTime, setNotificationTimeState] = useState(new Date());
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(8);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [selectedAmPm, setSelectedAmPm] = useState<string>('AM');
  
  // Edit profile states
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  // App icon selector state
  const [appIconSelectorVisible, setAppIconSelectorVisible] = useState(false);
  
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Try to get stored display name first
        const storedName = await AsyncStorage.getItem('user_display_name');
        
        // Load notification preference
        const notifications = await getNotificationsEnabled();
        setNotificationsEnabled(notifications);
        
        // Load notification time
        const { hour, minute } = await getNotificationTime();
        const date = new Date();
        date.setHours(hour, minute, 0);
        setNotificationTimeState(date);
        
        // Set the hour, minute, and AM/PM values
        const isPm = hour >= 12;
        const hour12 = hour % 12 || 12; // Convert 24-hour to 12-hour format
        
        setSelectedHour(hour12);
        setSelectedMinute(minute);
        setSelectedAmPm(isPm ? 'PM' : 'AM');
        
        // Load subscription tier
        const tier = await getCurrentSubscriptionTier();
        setSubscriptionTier(tier);
        
        const user = await getCurrentUser();
        if (user) {
          // Use stored name if available, otherwise use a generic name
          if (storedName) {
            setUserName(storedName);
          } else {
            // Use a generic name instead of email
            setUserName('Friend');
            // Store the generic name for future use
            await AsyncStorage.setItem('user_display_name', 'Friend');
          }
          
          setEmail(user.email || '');
          
          // Load streak
          const currentStreak = await getMoodStreak();
          setStreak(currentStreak);
          
          // Load average mood
          const avgMood = await getAverageMood(30); // Last 30 days
          setAverageMood(avgMood);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  // Function to convert mood rating to emoji
  function getMoodEmoji(rating: number | null): string {
    if (rating === null) return '–';
    const roundedRating = Math.round(rating) as MoodRating;
    switch (roundedRating) {
      case 1: return '😢';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '🙂';
      case 5: return '😄';
      default: return '–';
    }
  }
  
  // Function to get mood color based on rating
  function getMoodColor(rating: number | null): string {
    if (rating === null) return theme.colors.text;
    const roundedRating = Math.round(rating) as MoodRating;
    switch (roundedRating) {
      case 1: return theme.colors.mood1 || '#E53935';
      case 2: return theme.colors.mood2 || '#FB8C00';
      case 3: return theme.colors.mood3 || '#FDD835';
      case 4: return theme.colors.mood4 || '#7CB342';
      case 5: return theme.colors.mood5 || '#43A047';
      default: return theme.colors.text;
    }
  }
  
  // Direct sign out function with minimal steps
  const handleDirectSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Show loading state
              setIsSigningOut(true);
              console.log('User confirmed direct sign out');
              
              // Close the modal first
              onClose();
              
              // Short delay to let modal close
              setTimeout(async () => {
                try {
                  // Clear all storage
                  console.log('Clearing AsyncStorage');
                  await AsyncStorage.clear();
                  
                  // Sign out from Supabase
                  console.log('Signing out from Supabase');
                  await supabase.auth.signOut();
                  
                  // Call the logout callback
                  console.log('Calling onLogout callback');
                  onLogout();
                } catch (error) {
                  console.error('Error during direct sign out:', error);
                  Alert.alert('Error', 'Failed to sign out. Please try again.');
                }
              }, 300);
            } catch (error) {
              console.error('Error in direct sign out:', error);
              setIsSigningOut(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  // Open edit profile modal
  const handleEditProfile = () => {
    setNewName(userName);
    setEditProfileModalVisible(true);
  };
  
  // Save profile changes
  const handleSaveProfile = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    
    setIsSavingProfile(true);
    
    try {
      // Save the new name to AsyncStorage
      await AsyncStorage.setItem('user_display_name', newName.trim());
      
      // Update the state
      setUserName(newName.trim());
      
      // Close the modal
      setEditProfileModalVisible(false);
      
      // Show success message
      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };
  
  // Handle notifications toggle
  const handleNotificationsToggle = async (value: boolean) => {
    try {
      setNotificationsEnabled(value);
      await setNotificationsEnabled(value);
      
      // Show confirmation to the user
      if (value) {
        // Schedule notifications immediately when enabled
        await scheduleDailyReminder();
        
        Alert.alert(
          'Notifications Enabled',
          `You will receive daily reminders at ${formatTime()} to check in with your mood.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Notifications Disabled',
          'You will no longer receive daily reminders.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      // Revert UI state if there was an error
      setNotificationsEnabled(!value);
      Alert.alert(
        'Error',
        'There was a problem updating your notification settings. Please try again.'
      );
    }
  };
  
  // Open time picker modal
  const handleOpenTimePicker = () => {
    setShowTimePickerModal(true);
  };
  
  // Handle hour selection
  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour);
  };
  
  // Handle minute selection
  const handleMinuteSelect = (minute: number) => {
    setSelectedMinute(minute);
  };
  
  // Handle AM/PM selection
  const handleAmPmSelect = (value: string) => {
    setSelectedAmPm(value);
  };
  
  // Save time selection
  const handleSaveTime = async () => {
    try {
      // Convert to 24-hour format
      let hour24 = selectedHour;
      
      // Adjust for 12-hour to 24-hour conversion
      if (selectedAmPm === 'PM' && selectedHour !== 12) {
        hour24 += 12;
      } else if (selectedAmPm === 'AM' && selectedHour === 12) {
        hour24 = 0;
      }
      
      // Save the time
      await setNotificationTime(hour24, selectedMinute);
      
      // Update the notification time state
      const newDate = new Date();
      newDate.setHours(hour24, selectedMinute, 0);
      setNotificationTimeState(newDate);
      
      // Reschedule notifications with the new time if enabled
      if (notificationsEnabled) {
        await scheduleDailyReminder();
      }
      
      // Close the modal
      setShowTimePickerModal(false);
      
      // Show confirmation
      Alert.alert(
        'Notification Time Updated',
        `You will now receive daily reminders at ${formatTime()}.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving notification time:', error);
      Alert.alert(
        'Error',
        'There was a problem updating your notification time. Please try again.'
      );
    }
  };
  
  // Format time to readable string
  const formatTime = (): string => {
    const hour12 = selectedHour;
    const minuteStr = selectedMinute.toString().padStart(2, '0');
    return `${hour12}:${minuteStr} ${selectedAmPm}`;
  };
  
  // Handle subscription upgrade/downgrade
  const handleSubscriptionToggle = async () => {
    try {
      setIsUpdatingSubscription(true);
      
      // For demo purposes, we'll just toggle between free and premium
      const newTier = await toggleSubscriptionForDemo();
      setSubscriptionTier(newTier);
      
      Alert.alert(
        newTier === 'premium' ? 'Premium Activated' : 'Subscription Cancelled',
        newTier === 'premium' 
          ? 'You now have access to all premium features!' 
          : 'Your subscription has been cancelled. You can still use the free features.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error toggling subscription:', error);
      Alert.alert('Error', 'Failed to update subscription. Please try again.');
    } finally {
      setIsUpdatingSubscription(false);
    }
  };
  
  // Open subscription comparison screen
  const handleOpenSubscriptionComparison = () => {
    setSubscriptionComparisonVisible(true);
  };
  
  // Close subscription comparison screen
  const handleCloseSubscriptionComparison = async () => {
    setSubscriptionComparisonVisible(false);
    // Refresh subscription tier after closing
    const tier = await getCurrentSubscriptionTier();
    setSubscriptionTier(tier);
  };
  
  // Open premium modal
  const handleOpenPremiumModal = () => {
    if (subscriptionTier === 'premium') {
      // If already premium, show information about managing subscriptions
      Alert.alert(
        'Premium Subscription',
        Platform.OS === 'ios' 
          ? 'You currently have an active premium subscription. To manage or cancel your subscription, please go to Settings > Apple ID > Subscriptions on your iOS device.'
          : 'You currently have an active premium subscription. To manage or cancel your subscription, please go to Google Play Store > Account > Subscriptions on your Android device.',
        [{ text: 'OK' }]
      );
    } else {
      // If free, show subscription comparison screen
      handleOpenSubscriptionComparison();
    }
  };
  
  // Open app icon selector
  const handleOpenAppIconSelector = () => {
    setAppIconSelectorVisible(true);
  };
  
  // Navigate to Terms of Service screen
  const handleOpenTermsOfService = () => {
    onClose(); // Close the profile modal first
    // Navigate to the Terms of Service screen
    navigation.navigate('TermsOfService' as never);
  };
  
  // Navigate to Privacy Policy screen
  const handleOpenPrivacyPolicy = () => {
    onClose(); // Close the profile modal first
    // Navigate to the Privacy Policy screen
    navigation.navigate('PrivacyPolicy' as never);
  };
  
  // Navigate to About screen
  const handleOpenAbout = () => {
    onClose(); // Close the profile modal first
    // Navigate to the About screen
    navigation.navigate('About' as never);
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }
  
  if (subscriptionComparisonVisible) {
    return (
      <SubscriptionComparisonScreen 
        onClose={handleCloseSubscriptionComparison}
        onSubscribe={handleSubscriptionToggle}
        showCloseButton={true}
        source="upgrade"
      />
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
          disabled={isSigningOut}
        >
          <Ionicons name="close" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
            {userName}
          </Text>
          <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">
            {email}
          </Text>
          
          <TouchableOpacity
            onPress={handleOpenPremiumModal}
            style={[
              styles.subscriptionBadge,
              subscriptionTier === 'premium' ? styles.premiumBadge : styles.freeBadge
            ]}
          >
            <Ionicons 
              name={subscriptionTier === 'premium' ? 'diamond' : 'star'} 
              size={16} 
              color={subscriptionTier === 'premium' ? theme.colors.primary : theme.colors.accent} 
            />
            <Text style={[
              styles.subscriptionBadgeText,
              subscriptionTier === 'premium' ? styles.premiumBadgeText : styles.freeBadgeText
            ]}>
              {subscriptionTier === 'premium' ? 'PREMIUM' : 'FREE'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={[
              styles.statValue, 
              { color: getMoodColor(averageMood) }
            ]}>
              {getMoodEmoji(averageMood)}
            </Text>
            <Text style={styles.statLabel}>Avg Mood</Text>
          </View>
        </View>
        
        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionHeader}>
              <Text style={styles.subscriptionTitle}>
                {subscriptionTier === 'premium' ? 'Premium Plan' : 'Free Plan'}
              </Text>
              <View style={[
                styles.subscriptionStatusBadge,
                subscriptionTier === 'premium' ? styles.premiumStatusBadge : styles.freeStatusBadge
              ]}>
                <Text style={[
                  styles.subscriptionStatusText,
                  subscriptionTier === 'premium' ? styles.premiumStatusText : styles.freeStatusText
                ]}>
                  {subscriptionTier === 'premium' ? 'ACTIVE' : 'BASIC'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.subscriptionDescription}>
              {subscriptionTier === 'premium' 
                ? `You have access to all premium features including unlimited mood check-ins, advanced analytics, and more.`
                : 'Free plan allows only one mood check-in per day. Upgrade to Premium for unlimited check-ins, advanced analytics, and more premium features.'}
            </Text>
            
            {subscriptionTier === 'premium' && (
              <Text style={styles.subscriptionManageText}>
                {Platform.OS === 'ios' 
                  ? 'To manage your subscription, go to Settings > Apple ID > Subscriptions.' 
                  : 'To manage your subscription, go to Google Play Store > Account > Subscriptions.'}
              </Text>
            )}
            
            {subscriptionTier !== 'premium' && (
              <TouchableOpacity 
                style={[
                  styles.subscriptionButton,
                  styles.upgradeButton,
                  isUpdatingSubscription && styles.disabledButton
                ]}
                onPress={handleOpenSubscriptionComparison}
                disabled={isUpdatingSubscription}
              >
                {isUpdatingSubscription ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={[
                    styles.subscriptionButtonText,
                    styles.upgradeButtonText
                  ]}>
                    Upgrade to Premium
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleEditProfile}
          >
            <Ionicons name="person-outline" size={24} color={theme.colors.text} />
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
          
          {/* Language selector removed as requested */}
          
          {/* App Icon Selector Option */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleOpenAppIconSelector}
          >
            <Ionicons name="apps-outline" size={24} color={theme.colors.text} />
            <Text style={styles.menuItemText}>App Icon</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>Customize</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
              <Text style={styles.settingText}>Daily Reminders</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: '#767577', true: theme.colors.primary + '80' }}
              thumbColor={notificationsEnabled ? theme.colors.primary : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          
          {notificationsEnabled && (
            <>
              <Text style={styles.settingSubtitle}>Notification Time</Text>
              
              <TouchableOpacity 
                style={styles.timeSelector}
                onPress={handleOpenTimePicker}
                activeOpacity={0.7}
              >
                <View style={styles.selectedTimeContainer}>
                  <Ionicons name="time-outline" size={24} color={theme.colors.text} />
                  <Text style={styles.selectedTimeText}>{formatTime()}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
              </TouchableOpacity>
              
              <Text style={styles.settingDescription}>
                You will receive a daily reminder at {formatTime()} to check in with your mood.
              </Text>
            </>
          )}
          
          {!notificationsEnabled && (
            <Text style={styles.settingDescription}>
              Enable notifications to receive daily reminders to check in with your mood.
            </Text>
          )}
        </View>
        
        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleOpenAbout}
          >
            <Ionicons name="information-circle-outline" size={24} color={theme.colors.text} />
            <Text style={styles.menuItemText}>About</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>v1.0.0</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleOpenTermsOfService}
          >
            <Ionicons name="document-text-outline" size={24} color={theme.colors.text} />
            <Text style={styles.menuItemText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleOpenPrivacyPolicy}
          >
            <Ionicons name="shield-outline" size={24} color={theme.colors.text} />
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
          
          <Text style={styles.helpText}>
            <Text style={styles.helpTextEmphasis}>Psst, need help? </Text>
            Email us at support@newday.dev
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleDirectSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <ActivityIndicator size="small" color={theme.colors.error} />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
      
      {/* Edit Profile Modal */}
      <Modal
        visible={editProfileModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setEditProfileModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Display Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Enter your name"
                  placeholderTextColor={theme.colors.subtext}
                  autoCapitalize="words"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <View style={styles.disabledInput}>
                  <Text style={styles.disabledInputText} numberOfLines={1} ellipsizeMode="tail">
                    {email}
                  </Text>
                </View>
                <Text style={styles.formHint}>Email cannot be changed</Text>
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.saveButton,
                  (!newName.trim() || isSavingProfile) && styles.saveButtonDisabled
                ]}
                onPress={handleSaveProfile}
                disabled={!newName.trim() || isSavingProfile}
              >
                {isSavingProfile ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Time Picker Modal */}
      <Modal
        visible={showTimePickerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimePickerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.timePickerContainer}>
            <View style={styles.timePickerHeader}>
              <TouchableOpacity onPress={() => setShowTimePickerModal(false)}>
                <Text style={styles.timePickerCancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.timePickerTitle}>Set Notification Time</Text>
              <TouchableOpacity onPress={handleSaveTime}>
                <Text style={styles.timePickerSaveButton}>Save</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.timePickerContent}>
              <View style={styles.timePickerRow}>
                {/* Hour Selector */}
                <View style={styles.timePickerColumn}>
                  <Text style={styles.timePickerLabel}>Hour</Text>
                  <ScrollView 
                    style={styles.timePickerScrollView}
                    showsVerticalScrollIndicator={false}
                  >
                    {hours.map((hour) => (
                      <TouchableOpacity
                        key={`hour-${hour.value}`}
                        style={[
                          styles.timePickerItem,
                          selectedHour === hour.value && styles.timePickerItemSelected
                        ]}
                        onPress={() => handleHourSelect(hour.value)}
                      >
                        <Text style={[
                          styles.timePickerItemText,
                          selectedHour === hour.value && styles.timePickerItemTextSelected
                        ]}>
                          {hour.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                {/* Minute Selector */}
                <View style={styles.timePickerColumn}>
                  <Text style={styles.timePickerLabel}>Minute</Text>
                  <ScrollView 
                    style={styles.timePickerScrollView}
                    showsVerticalScrollIndicator={false}
                  >
                    {minutes.map((minute) => (
                      <TouchableOpacity
                        key={`minute-${minute.value}`}
                        style={[
                          styles.timePickerItem,
                          selectedMinute === minute.value && styles.timePickerItemSelected
                        ]}
                        onPress={() => handleMinuteSelect(minute.value)}
                      >
                        <Text style={[
                          styles.timePickerItemText,
                          selectedMinute === minute.value && styles.timePickerItemTextSelected
                        ]}>
                          {minute.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                {/* AM/PM Selector */}
                <View style={styles.timePickerColumn}>
                  <Text style={styles.timePickerLabel}>AM/PM</Text>
                  <View style={styles.ampmContainer}>
                    {ampm.map((period) => (
                      <TouchableOpacity
                        key={`ampm-${period.value}`}
                        style={[
                          styles.ampmButton,
                          selectedAmPm === period.value && styles.ampmButtonSelected
                        ]}
                        onPress={() => handleAmPmSelect(period.value)}
                      >
                        <Text style={[
                          styles.ampmButtonText,
                          selectedAmPm === period.value && styles.ampmButtonTextSelected
                        ]}>
                          {period.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              
              <View style={styles.timePreview}>
                <Text style={styles.timePreviewLabel}>Selected Time:</Text>
                <Text style={styles.timePreviewValue}>{formatTime()}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* App Icon Selector Modal */}
      <AppIconSelector
        visible={appIconSelectorVisible}
        onClose={() => setAppIconSelectorVisible(false)}
        onUpgrade={handleOpenSubscriptionComparison}
        isPremium={subscriptionTier === 'premium'}
      />
      
      {/* Premium Feature Modal */}
      <PremiumFeatureModal
        visible={premiumModalVisible}
        onClose={() => setPremiumModalVisible(false)}
        onUpgrade={handleOpenSubscriptionComparison}
        featureName="Unlock Premium Features"
        featureDescription="Take your mood tracking to the next level with premium features designed to help you understand and improve your mental wellbeing."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  closeButton: {
    padding: 8,
    marginLeft: 4,
  },
  placeholder: {
    width: 40, // Same width as close button for balance
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: theme.fontWeights.bold,
    color: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 4,
    maxWidth: screenWidth - 64, // Ensure text doesn't overflow
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: theme.colors.subtext,
    marginBottom: 8,
    maxWidth: screenWidth - 64, // Ensure text doesn't overflow
    textAlign: 'center',
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  freeBadge: {
    backgroundColor: theme.colors.accent + '20',
  },
  premiumBadge: {
    backgroundColor: theme.colors.primary + '20',
  },
  subscriptionBadgeText: {
    fontSize: 12,
    fontWeight: theme.fontWeights.bold,
    marginLeft: 4,
  },
  freeBadgeText: {
    color: theme.colors.accent,
  },
  premiumBadgeText: {
    color: theme.colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  statCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '45%',
    ...theme.shadows.small,
  },
  statValue: {
    fontSize: 24,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.subtext,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingSubtitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 4,
  },
  helpText: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginTop: 8,
    marginLeft: 4,
    marginBottom: 8,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  helpTextEmphasis: {
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.primary,
  },
  subscriptionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    ...theme.shadows.medium,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginRight: 8,
  },
  subscriptionStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeStatusBadge: {
    backgroundColor: theme.colors.accent + '20',
  },
  premiumStatusBadge: {
    backgroundColor: theme.colors.primary + '20',
  },
  subscriptionStatusText: {
    fontSize: 12,
    fontWeight: theme.fontWeights.bold,
  },
  freeStatusText: {
    color: theme.colors.accent,
  },
  premiumStatusText: {
    color: theme.colors.primary,
  },
  subscriptionDescription: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginBottom: 12,
    lineHeight: 20,
  },
  subscriptionManageText: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginBottom: 16,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  subscriptionButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  upgradeButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  disabledButton: {
    opacity: 0.7,
  },
  subscriptionButtonText: {
    fontSize: 16,
    fontWeight: theme.fontWeights.semibold,
  },
  upgradeButtonText: {
    color: 'white',
  },
  cancelButtonText: {
    color: theme.colors.error,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    ...theme.shadows.small,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '40%',
  },
  menuItemValue: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginRight: 8,
    flexShrink: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    ...theme.shadows.small,
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 12,
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    ...theme.shadows.small,
  },
  selectedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedTimeText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '500',
    marginLeft: 12,
  },
  settingDescription: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginLeft: 4,
    marginBottom: 16,
    lineHeight: 20,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 32,
    ...theme.shadows.small,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.error,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.subtext,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    ...theme.shadows.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  // Form styles
  modalContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  disabledInput: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    opacity: 0.7,
  },
  disabledInputText: {
    fontSize: 16,
    color: theme.colors.subtext,
  },
  formHint: {
    fontSize: 12,
    color: theme.colors.subtext,
    marginTop: 4,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.primary + '80',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: theme.fontWeights.semibold,
  },
  // Time picker styles
  timePickerContainer: {
    width: '90%',
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    ...theme.shadows.large,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  timePickerCancelButton: {
    fontSize: 16,
    color: theme.colors.subtext,
    padding: 4,
  },
  timePickerSaveButton: {
    fontSize: 16,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.primary,
    padding: 4,
  },
  timePickerContent: {
    padding: 16,
  },
  timePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timePickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  timePickerLabel: {
    fontSize: 16,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: 8,
  },
  timePickerScrollView: {
    height: 200,
    width: '100%',
  },
  timePickerItem: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  timePickerItemSelected: {
    backgroundColor: theme.colors.primary + '20',
  },
  timePickerItemText: {
    fontSize: 18,
    color: theme.colors.text,
  },
  timePickerItemTextSelected: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.bold,
  },
  ampmContainer: {
    marginTop: 20,
  },
  ampmButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  ampmButtonSelected: {
    backgroundColor: theme.colors.primary,
  },
  ampmButtonText: {
    fontSize: 18,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
  },
  ampmButtonTextSelected: {
    color: 'white',
  },
  timePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  timePreviewLabel: {
    fontSize: 16,
    color: theme.colors.text,
    marginRight: 8,
  },
  timePreviewValue: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
  },
});