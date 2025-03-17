import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import PremiumFeatureModal from './PremiumFeatureModal';

interface PremiumFeatureBadgeProps {
  featureName: string;
  featureDescription: string;
  onUpgrade: () => void;
  small?: boolean;
}

export default function PremiumFeatureBadge({
  featureName,
  featureDescription,
  onUpgrade,
  small = false
}: PremiumFeatureBadgeProps) {
  const [modalVisible, setModalVisible] = useState(false);
  
  const handlePress = () => {
    setModalVisible(true);
  };
  
  const handleClose = () => {
    setModalVisible(false);
  };
  
  return (
    <>
      <TouchableOpacity 
        style={[styles.container, small && styles.smallContainer]}
        onPress={handlePress}
      >
        <Ionicons name="diamond" size={small ? 12 : 16} color={theme.colors.primary} />
        <Text style={[styles.text, small && styles.smallText]}>PREMIUM</Text>
      </TouchableOpacity>
      
      <PremiumFeatureModal
        visible={modalVisible}
        onClose={handleClose}
        onUpgrade={onUpgrade}
        featureName={featureName}
        featureDescription={featureDescription}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  smallContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
    marginLeft: 4,
  },
  smallText: {
    fontSize: 10,
    marginLeft: 2,
  },
});