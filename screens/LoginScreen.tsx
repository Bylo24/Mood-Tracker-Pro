import React, { useState, useEffect } from 'react';
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
  Alert,
  Keyboard,
  Image,
  InputAccessoryView
} from 'react-native';
import { theme } from '../theme/theme';
import { signInWithEmail, signUpWithEmail, resetPassword, resendConfirmationEmail } from '../services/authService';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../utils/supabaseClient';

interface LoginScreenProps {
  onLogin: (isSignUp: boolean) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [confirmMode, setConfirmMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Function to create a test user if it doesn't exist (runs silently in the background)
  const createTestUserIfNeeded = async () => {
    try {
      console.log('Checking if test user exists...');
      
      // Try to sign up with the test credentials
      const { data, error } = await supabase.auth.signUp({
        email: 'apples123@gmail.com',
        password: 'apples123',
        options: {
          emailRedirectTo: undefined
        }
      });
      
      if (error) {
        if (error.message.includes('User already registered')) {
          console.log('Test user already exists');
        } else {
          console.error('Error creating test user:', error.message);
        }
      } else {
        console.log('Test user created successfully');
      }
    } catch (error) {
      console.error('Error in createTestUserIfNeeded:', error);
    }
  };
  
  // Create test user silently on component mount
  useEffect(() => {
    createTestUserIfNeeded();
  }, []);
  
  // Clear error message when form changes
  useEffect(() => {
    setErrorMessage(null);
  }, [email, password, isSignUp, resetMode, confirmMode]);
  
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password: string): boolean => {
    // At least 6 characters
    return password.length >= 6;
  };
  
  const handleAuth = async () => {
    Keyboard.dismiss();
    setErrorMessage(null);
    
    // Validate inputs
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }
    
    if (isSignUp && !validatePassword(password)) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        console.log('Starting sign up process...');
        const result = await signUpWithEmail(email, password);
        console.log('Sign up result:', result);
        
        // If we have a session, login was successful
        if (result.session) {
          console.log('Sign up successful with session, proceeding to app');
          onLogin(true); // Pass isSignUp=true to onLogin
        } else if (result.user) {
          // If user was created but email confirmation is required
          setConfirmMode(true);
          Alert.alert(
            'Email Confirmation Required',
            'Your account has been created. Please check your email for confirmation instructions.',
            [{ text: 'OK' }]
          );
        } else {
          setErrorMessage('Failed to create account. Please try again.');
        }
      } else {
        console.log('Starting sign in process...');
        
        // Special case for test user
        if (email === 'apples123@gmail.com' && password === 'apples123') {
          console.log('Using test user credentials - direct login');
          
          // Direct login for test user
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            console.error('Test user login error:', error.message);
            setErrorMessage(error.message || 'Authentication failed. Please try again.');
          } else if (data.session) {
            console.log('Test user login successful, proceeding to app');
            // Call onLogin directly
            onLogin(false);
          } else {
            setErrorMessage('Login failed. No session returned.');
          }
        } else {
          // Normal login flow for other users
          const result = await signInWithEmail(email, password);
          console.log('Sign in result:', result);
          
          if (result.session) {
            console.log('Sign in successful, proceeding to app');
            onLogin(false); // Pass isSignUp=false to onLogin
          } else {
            setErrorMessage('Login failed. Please try again.');
          }
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Handle specific error messages
      if (error.message?.includes('User already registered')) {
        setErrorMessage('An account with this email already exists. Please log in instead.');
        setIsSignUp(false);
      } else if (error.message?.includes('Invalid login credentials')) {
        setErrorMessage('Invalid email or password. Please try again.');
      } else if (error.message?.includes('Email confirmation required') || error.name === 'EmailConfirmationRequired') {
        setConfirmMode(true);
        setErrorMessage('Please confirm your email address before logging in.');
      } else if (error.message?.includes('Email not confirmed')) {
        setConfirmMode(true);
        setErrorMessage('Please confirm your email address before logging in.');
      } else if (error.message?.includes('network') || error.message?.includes('timeout') || error.message?.includes('abort')) {
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        setErrorMessage(error.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetPassword = async () => {
    Keyboard.dismiss();
    setErrorMessage(null);
    
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      Alert.alert(
        'Password Reset Email Sent',
        'Please check your email for instructions to reset your password.',
        [{ text: 'OK', onPress: () => setResetMode(false) }]
      );
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      if (error.message?.includes('network') || error.message?.includes('timeout') || error.message?.includes('abort')) {
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        setErrorMessage(error.message || 'Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendConfirmation = async () => {
    Keyboard.dismiss();
    setErrorMessage(null);
    
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await resendConfirmationEmail(email);
      Alert.alert(
        'Confirmation Email Sent',
        'Please check your email for confirmation instructions.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Resend confirmation error:', error);
      
      if (error.message?.includes('network') || error.message?.includes('timeout') || error.message?.includes('abort')) {
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        setErrorMessage(error.message || 'Failed to resend confirmation email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage(null);
    setPassword('');
    setConfirmMode(false);
  };
  
  const toggleResetMode = () => {
    setResetMode(!resetMode);
    setErrorMessage(null);
    setPassword('');
    setConfirmMode(false);
  };
  
  const toggleConfirmMode = () => {
    setConfirmMode(!confirmMode);
    setErrorMessage(null);
  };
  
  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/mood-buddy-logo.png')} 
            style={styles.logo} 
          />
          <Text style={styles.logoText}>Mood Buddy</Text>
          <Text style={styles.tagline}>Track your mood, improve your wellbeing</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {resetMode 
              ? 'Reset Password' 
              : confirmMode
                ? 'Email Confirmation'
                : isSignUp 
                  ? 'Create Account' 
                  : 'Welcome Back'}
          </Text>
          
          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={theme.colors.subtext} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={theme.colors.subtext}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              inputAccessoryViewID={null}
            />
          </View>
          
          {!resetMode && !confirmMode && (
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.subtext} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.colors.subtext}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete={isSignUp ? "new-password" : "password"}
                textContentType={isSignUp ? "newPassword" : "password"}
                inputAccessoryViewID={null}
              />
              <TouchableOpacity 
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={theme.colors.subtext} 
                />
              </TouchableOpacity>
            </View>
          )}
          
          {isSignUp && !confirmMode && (
            <Text style={styles.passwordHint}>
              Password must be at least 6 characters long
            </Text>
          )}
          
          {confirmMode ? (
            <>
              <Text style={styles.confirmText}>
                We've sent a confirmation email to your address. Please check your inbox and click the confirmation link.
              </Text>
              <TouchableOpacity 
                style={styles.button}
                onPress={handleResendConfirmation}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Resend Confirmation Email</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.switchButton}
                onPress={() => {
                  setConfirmMode(false);
                  setIsSignUp(false);
                }}
                disabled={isLoading}
              >
                <Text style={styles.switchButtonText}>
                  Already confirmed? Log In
                </Text>
              </TouchableOpacity>
            </>
          ) : resetMode ? (
            <TouchableOpacity 
              style={styles.button}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.button}
              onPress={handleAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Log In'}</Text>
              )}
            </TouchableOpacity>
          )}
          
          {!resetMode && !confirmMode && (
            <TouchableOpacity 
              style={styles.switchButton}
              onPress={switchMode}
              disabled={isLoading}
            >
              <Text style={styles.switchButtonText}>
                {isSignUp ? 'Already have an account? Log In' : 'New user? Create Account'}
              </Text>
            </TouchableOpacity>
          )}
          
          {!isSignUp && !resetMode && !confirmMode && (
            <TouchableOpacity 
              style={styles.forgotButton}
              onPress={toggleResetMode}
              disabled={isLoading}
            >
              <Text style={styles.forgotButtonText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}
          
          {(resetMode || confirmMode) && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={resetMode ? toggleResetMode : toggleConfirmMode}
              disabled={isLoading}
            >
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 20, // Add extra padding at the bottom for iOS
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: theme.colors.subtext,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: theme.colors.error + '20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
  },
  confirmText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginBottom: 16,
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
  passwordToggle: {
    padding: 8,
  },
  passwordHint: {
    fontSize: 12,
    color: theme.colors.subtext,
    marginTop: -8,
    marginBottom: 16,
    marginLeft: 4,
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
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  switchButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: theme.fontWeights.medium,
  },
  forgotButton: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  forgotButtonText: {
    color: theme.colors.subtext,
    fontSize: 14,
  },
  backButton: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: theme.fontWeights.medium,
  },
});