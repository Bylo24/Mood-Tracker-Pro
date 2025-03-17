import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Keyboard,
  Alert
} from 'react-native';
import { theme } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import OnboardingProgress from '../components/OnboardingProgress';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SetupNameScreenProps {
  onComplete: (name: string) => void;
  onSkip: () => void;
}

export default function SetupNameScreen({ onComplete, onSkip }: SetupNameScreenProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleContinue = async () => {
    if (!name.trim()) {
      return;
    }
    
    Keyboard.dismiss();
    setIsLoading(true);
    
    try {
      // Save the name to AsyncStorage
      const trimmedName = name.trim();
      await AsyncStorage.setItem('user_display_name', trimmedName);
      console.log('Saved user name:', trimmedName);
      
      // Simulate a short loading state for better UX
      setTimeout(() => {
        setIsLoading(false);
        onComplete(trimmedName);
      }, 500);
    } catch (error) {
      console.error('Error saving name:', error);
      Alert.alert(
        'Error',
        'There was a problem saving your name. Please try again.',
        [{ text: 'OK' }]
      );
      setIsLoading(false);
    }
  };
  
  const handleSkip = async () => {
    // When skipping, we'll use a default name in the next screen
    setIsLoading(true);
    
    try {
      // Clear any existing name to ensure we use the default
      await AsyncStorage.removeItem('user_display_name');
      console.log('User skipped name setup');
      
      setTimeout(() => {
        setIsLoading(false);
        onSkip();
      }, 300);
    } catch (error) {
      console.error('Error during skip:', error);
      setIsLoading(false);
      onSkip();
    }
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <OnboardingProgress steps={3} currentStep={0} />
          <Text style={styles.title}>What should we call you?</Text>
          <Text style={styles.subtitle}>
            This is how you'll appear in the app. You can change this later.
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={theme.colors.subtext} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={theme.colors.subtext}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
            {name.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setName('')}
              >
                <Ionicons name="close-circle" size={20} color={theme.colors.subtext} />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.button, !name.trim() && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkip}
            disabled={isLoading}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.subtext,
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
    height: 56,
    ...theme.shadows.small,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: theme.colors.text,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...theme.shadows.medium,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.primary + '80', // 50% opacity
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  skipButtonText: {
    color: theme.colors.subtext,
    fontSize: 14,
  },
});