import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppIcon {
  id: string;
  title: string;
  description: string;
  imagePath: any; // React Native image source
  requiredStreak: number;
  claimed: boolean;
}

interface AppIconSelectorProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  isPremium: boolean;
}

export default function AppIconSelector({ visible, onClose, onUpgrade, isPremium }: AppIconSelectorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [appIcons, setAppIcons] = useState<AppIcon[]>([]);
  const [currentIconId, setCurrentIconId] = useState<string>('default');
  const [isChanging, setIsChanging] = useState(false);

  // App icons data using the alt-icons from assets
  const altAppIcons: AppIcon[] = [
    {
      id: 'default',
      title: 'Default Icon',
      description: 'The original app icon',
      imagePath: require('../assets/icon.png'),
      requiredStreak: 0,
      claimed: true
    },
    {
      id: 'inverted',
      title: 'Inverted Icon',
      description: 'A sleek inverted app icon',
      imagePath: require('../assets/alt-icons/Inverted.png'),
      requiredStreak: 7,
      claimed: false
    },
    {
      id: 'red',
      title: 'Red Icon',
      description: 'A vibrant red app icon',
      imagePath: require('../assets/alt-icons/Red.png'),
      requiredStreak: 14,
      claimed: false
    },
    {
      id: 'green',
      title: 'Green Icon',
      description: 'A peaceful green app icon',
      imagePath: require('../assets/alt-icons/Green.png'),
      requiredStreak: 30,
      claimed: false
    },
    {
      id: 'blue',
      title: 'Blue Icon',
      description: 'A calming blue app icon',
      imagePath: require('../assets/alt-icons/Blue.png'),
      requiredStreak: 60,
      claimed: false
    },
    {
      id: 'rainbow',
      title: 'Rainbow Icon',
      description: 'A colorful rainbow app icon',
      imagePath: require('../assets/alt-icons/Rainbow.png'),
      requiredStreak: 90,
      claimed: false
    },
    {
      id: 'diamond',
      title: 'Diamond Icon',
      description: 'An exclusive diamond app icon',
      imagePath: require('../assets/alt-icons/Diamond.png'),
      requiredStreak: 120,
      claimed: false
    }
  ];

  useEffect(() => {
    if (visible) {
      loadAppIconData();
    }
  }, [visible]);

  const loadAppIconData = async () => {
    setIsLoading(true);
    try {
      // Get current streak
      const streakStr = await AsyncStorage.getItem('current_streak');
      const streak = streakStr ? parseInt(streakStr) : 0;

      // Get current app icon
      const currentIcon = await AsyncStorage.getItem('current_app_icon') || 'default';
      setCurrentIconId(currentIcon);

      // Update app icons based on streak and claimed status
      const updatedAppIcons = await Promise.all(altAppIcons.map(async icon => {
        // Default icon is always claimed
        if (icon.id === 'default') {
          return { ...icon, claimed: true };
        }
        
        const claimedKey = `app_icon_claimed_${icon.id}`;
        const claimed = await AsyncStorage.getItem(claimedKey) === 'true';
        
        // Check if the icon should be unlocked based on streak
        const unlocked = streak >= icon.requiredStreak;
        
        return {
          ...icon,
          claimed: claimed || unlocked
        };
      }));
      
      setAppIcons(updatedAppIcons);
    } catch (error) {
      console.error('Error loading app icon data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectIcon = async (icon: AppIcon) => {
    if (!icon.claimed) {
      if (isPremium) {
        Alert.alert(
          'Icon Locked',
          `This icon requires a ${icon.requiredStreak}-day streak to unlock. Continue your streak to earn it!`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Premium Feature',
          'Unlock all app icons instantly with Premium!',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Upgrade to Premium', onPress: () => {
              onClose();
              onUpgrade();
            }}
          ]
        );
      }
      return;
    }

    if (icon.id === currentIconId) {
      return; // Already using this icon
    }

    try {
      setIsChanging(true);
      
      // In a real app, you would use a native module to change the app icon
      // For this demo, we'll just store the selection
      await AsyncStorage.setItem('current_app_icon', icon.id);
      setCurrentIconId(icon.id);
      
      // Simulate a delay for the icon change
      setTimeout(() => {
        setIsChanging(false);
        Alert.alert(
          'App Icon Changed',
          `Your app icon has been changed to ${icon.title}. This change may take a moment to appear on your home screen.`,
          [{ text: 'OK' }]
        );
      }, 1000);
    } catch (error) {
      console.error('Error changing app icon:', error);
      setIsChanging(false);
      Alert.alert('Error', 'Failed to change app icon. Please try again.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose App Icon</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading app icons...</Text>
            </View>
          ) : (
            <>
              <ScrollView style={styles.iconList}>
                {appIcons.map((icon) => (
                  <TouchableOpacity
                    key={icon.id}
                    style={[
                      styles.iconItem,
                      currentIconId === icon.id && styles.iconItemSelected,
                      !icon.claimed && styles.iconItemLocked
                    ]}
                    onPress={() => handleSelectIcon(icon)}
                    disabled={isChanging}
                  >
                    <View style={[
                      styles.iconImageContainer,
                      currentIconId === icon.id && styles.iconImageContainerSelected
                    ]}>
                      <Image 
                        source={icon.imagePath}
                        style={styles.iconImage}
                        resizeMode="contain"
                      />
                      {!icon.claimed && (
                        <View style={styles.lockOverlay}>
                          <Ionicons name="lock-closed" size={20} color="#fff" />
                        </View>
                      )}
                    </View>
                    <View style={styles.iconInfo}>
                      <Text style={styles.iconTitle}>{icon.title}</Text>
                      <Text style={styles.iconDescription}>{icon.description}</Text>
                      {!icon.claimed && (
                        <Text style={styles.streakRequirement}>
                          Requires {icon.requiredStreak}-day streak
                        </Text>
                      )}
                    </View>
                    {currentIconId === icon.id && (
                      <View style={styles.currentIconBadge}>
                        <Text style={styles.currentIconText}>Current</Text>
                      </View>
                    )}
                    {!icon.claimed && isPremium && (
                      <View style={styles.streakBadge}>
                        <Ionicons name="flame" size={14} color={theme.colors.accent} />
                        <Text style={styles.streakBadgeText}>{icon.requiredStreak}</Text>
                      </View>
                    )}
                    {!icon.claimed && !isPremium && (
                      <View style={styles.premiumBadge}>
                        <Ionicons name="diamond" size={14} color={theme.colors.primary} />
                        <Text style={styles.premiumBadgeText}>Premium</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              {isChanging && (
                <View style={styles.changingOverlay}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                  <Text style={styles.changingText}>Changing app icon...</Text>
                </View>
              )}
              
              {!isPremium && (
                <View style={styles.premiumPromo}>
                  <Text style={styles.premiumPromoText}>
                    Upgrade to Premium to unlock all app icons instantly!
                  </Text>
                  <TouchableOpacity 
                    style={styles.upgradeButton}
                    onPress={() => {
                      onClose();
                      onUpgrade();
                    }}
                  >
                    <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.subtext,
  },
  iconList: {
    padding: 16,
  },
  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    ...theme.shadows.small,
    position: 'relative',
  },
  iconItemSelected: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  iconItemLocked: {
    opacity: 0.7,
  },
  iconImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: theme.colors.cardAlt,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 12,
  },
  iconImageContainerSelected: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  iconImage: {
    width: 50,
    height: 50,
  },
  lockOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInfo: {
    flex: 1,
  },
  iconTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  iconDescription: {
    fontSize: 14,
    color: theme.colors.subtext,
  },
  streakRequirement: {
    fontSize: 12,
    color: theme.colors.accent,
    marginTop: 4,
  },
  currentIconBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentIconText: {
    fontSize: 12,
    fontWeight: theme.fontWeights.bold,
    color: 'white',
  },
  streakBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.colors.accent + '20',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  streakBadgeText: {
    fontSize: 12,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.accent,
    marginLeft: 4,
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.colors.primary + '20',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
    marginLeft: 4,
  },
  changingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  changingText: {
    marginTop: 16,
    fontSize: 16,
    color: 'white',
    fontWeight: theme.fontWeights.semibold,
  },
  premiumPromo: {
    padding: 16,
    backgroundColor: theme.colors.cardAlt,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  premiumPromoText: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  upgradeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: theme.fontWeights.semibold,
    color: 'white',
  },
});