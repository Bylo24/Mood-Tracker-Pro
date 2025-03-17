import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface PremiumFeatureModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureName: string;
  featureDescription?: string;
}

export default function PremiumFeatureModal({
  visible,
  onClose,
  onUpgrade,
  featureName,
  featureDescription
}: PremiumFeatureModalProps) {
  // Handle upgrade button press
  const handleUpgradePress = () => {
    // Close the modal first
    onClose();
    
    // Then navigate to subscription screen after a short delay
    // to ensure the modal is fully closed
    setTimeout(() => {
      onUpgrade();
    }, 300);
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          <View style={styles.iconContainer}>
            <FontAwesome name="diamond" size={60} color={theme.colors.premium} />
          </View>
          
          <Text style={styles.premiumLabel}>Premium Feature</Text>
          
          <Text style={styles.featureTitle}>{featureName}</Text>
          
          {featureDescription && (
            <Text style={styles.featureDescription}>{featureDescription}</Text>
          )}
          
          <TouchableOpacity 
            style={styles.upgradeButton} 
            onPress={handleUpgradePress}
          >
            <Text style={styles.upgradeButtonText}>See Premium Plans</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.notNowButton} onPress={onClose}>
            <Text style={styles.notNowText}>Not Now</Text>
          </TouchableOpacity>
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
    padding: 20,
  },
  modalContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    ...theme.shadows.large,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.cardAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...theme.shadows.small,
  },
  premiumLabel: {
    fontSize: 14,
    color: theme.colors.premium,
    fontWeight: theme.fontWeights.semibold,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 16,
    color: theme.colors.subtext,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  upgradeButton: {
    backgroundColor: theme.colors.premium,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  upgradeButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
  },
  notNowButton: {
    paddingVertical: 12,
  },
  notNowText: {
    fontSize: 16,
    color: theme.colors.subtext,
    fontWeight: theme.fontWeights.medium,
  },
});