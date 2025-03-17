import React from 'react';
import { Modal, StyleSheet, View, Animated, Dimensions } from 'react-native';
import ProfileScreen from '../screens/ProfileScreen';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const { height } = Dimensions.get('window');

export default function ProfileModal({ visible, onClose, onLogout }: ProfileModalProps) {
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  
  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 70,
        friction: 12,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);
  
  // Create a direct logout handler
  const handleLogout = () => {
    console.log('Logout triggered in ProfileModal');
    // Close the modal first
    onClose();
    // Then call the onLogout callback with a delay to allow animations to complete
    setTimeout(() => {
      console.log('Calling onLogout from ProfileModal');
      onLogout();
    }, 500);
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <ProfileScreen 
            onClose={onClose} 
            onLogout={handleLogout} 
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '95%',
    backgroundColor: 'transparent',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
});