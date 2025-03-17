import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import PremiumFeatureModal from './PremiumFeatureModal';

interface PremiumFeaturePromoProps {
  onUpgrade: () => void;
}

export default function PremiumFeaturePromo({ onUpgrade }: PremiumFeaturePromoProps) {
  const [modalVisible, setModalVisible] = useState(false);
  
  const handlePress = () => {
    setModalVisible(true);
  };
  
  const handleClose = () => {
    setModalVisible(false);
  };
  
  const handleUpgrade = () => {
    setModalVisible(false);
    setTimeout(() => {
      onUpgrade();
    }, 300);
  };
  
  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        onPress={handlePress}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.premiumBadge}>
              <Ionicons name="diamond" size={16} color={theme.colors.primary} />
              <Text style={styles.premiumBadgeText}>PREMIUM</Text>
            </View>
          </View>
          
          <Text style={styles.title}>Unlock Premium Features</Text>
          <Text style={styles.description}>
            Get unlimited mood check-ins, advanced analytics, and personalized recommendations.
          </Text>
          
          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
              <Text style={styles.featureText}>Unlimited Check-ins</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
              <Text style={styles.featureText}>Advanced Analytics</Text>
            </View>
          </View>
          
          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
              <Text style={styles.featureText}>Smart Recommendations</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
              <Text style={styles.featureText}>No Ads</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={handlePress}
          >
            <Text style={styles.upgradeButtonText}>See Premium Plans</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      
      <PremiumFeatureModal
        visible={modalVisible}
        onClose={handleClose}
        onUpgrade={handleUpgrade}
        featureName="Unlock Premium Features"
        featureDescription="Take your mood tracking to the next level with premium features designed to help you understand and improve your mental wellbeing."
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
    marginLeft: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginBottom: 16,
    lineHeight: 20,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  featureText: {
    fontSize: 13,
    color: theme.colors.text,
    marginLeft: 6,
  },
  upgradeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: theme.fontWeights.semibold,
    color: 'white',
  },
});