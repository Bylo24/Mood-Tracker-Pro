import { supabase } from '../utils/supabaseClient';

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Auth session check:', session ? 'Authenticated' : 'Not authenticated');
    return !!session;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error.message);
      return null;
    }
    
    console.log('Current user:', user ? `${user.id} (${user.email})` : 'No user');
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Helper function to retry a function with exponential backoff
const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.log(`Attempt ${attempt + 1} failed:`, error.message || error);
      lastError = error;
      
      // If it's not a network error or timeout, don't retry
      if (error.message && !error.message.includes('network') && !error.message.includes('timeout') && !error.message.includes('abort')) {
        throw error;
      }
      
      // Wait before next retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }
  
  throw lastError;
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  console.log('Attempting to sign in with email:', email);
  
  // Special case for test user
  if (email === 'apples123@gmail.com' && password === 'apples123') {
    console.log('Using test user credentials');
    
    // Try to create the test user first if it doesn't exist
    try {
      const { data: checkData, error: checkError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (checkError) {
        console.log('Test user login failed, trying to create it first');
        
        // Try to create the test user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: undefined
          }
        });
        
        if (signUpError) {
          console.error('Error creating test user:', signUpError.message);
          throw signUpError;
        }
        
        // If user was created but needs confirmation, auto-confirm for test user
        if (signUpData.user && !signUpData.session) {
          console.log('Test user created but needs confirmation, trying to sign in again');
          
          // Try signing in again
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (retryError) {
            console.error('Test user sign in retry failed:', retryError.message);
            throw retryError;
          }
          
          return retryData;
        }
        
        return signUpData;
      }
      
      return checkData;
    } catch (error) {
      console.error('Test user handling error:', error);
      throw error;
    }
  }
  
  // Normal sign in for non-test users
  return retryOperation(async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error.message);
      throw error;
    }
    
    if (!data.session) {
      console.error('Sign in failed: No session returned');
      throw new Error('Authentication failed. Please try again.');
    }
    
    console.log('Sign in successful:', data.user?.id);
    return data;
  });
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string) => {
  console.log('Attempting to sign up with email:', email);
  
  return retryOperation(async () => {
    // Create a new account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Set this to undefined to use the default redirect URL
        emailRedirectTo: undefined
      }
    });
    
    if (error) {
      console.error('Sign up error:', error.message);
      
      // Check for user already exists errors
      if (
        error.message.includes('User already registered') || 
        error.message.includes('already exists') ||
        error.message.includes('already taken')
      ) {
        const customError = new Error('User already registered');
        customError.name = 'UserExistsError';
        throw customError;
      }
      
      throw error;
    }
    
    console.log('Sign up response:', data);
    
    // Check if email confirmation is required
    if (data.user && !data.session) {
      if (data.user.identities && data.user.identities.length === 0) {
        const customError = new Error('User already registered');
        customError.name = 'UserExistsError';
        throw customError;
      }
      
      if (data.user.email_confirmed_at === null) {
        console.log('Email confirmation required');
        // Create a custom error for email confirmation required
        const confirmationError = new Error('Email confirmation required');
        confirmationError.name = 'EmailConfirmationRequired';
        throw confirmationError;
      }
    }
    
    return data;
  });
};

// Sign out
export const signOut = async () => {
  console.log('Attempting to sign out');
  
  return retryOperation(async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error.message);
      throw error;
    }
    
    console.log('Sign out successful');
  });
};

// Reset password
export const resetPassword = async (email: string) => {
  console.log('Attempting to reset password for:', email);
  
  return retryOperation(async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      console.error('Password reset error:', error.message);
      throw error;
    }
    
    console.log('Password reset email sent');
  });
};

// Resend confirmation email
export const resendConfirmationEmail = async (email: string) => {
  console.log('Attempting to resend confirmation email for:', email);
  
  return retryOperation(async () => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    
    if (error) {
      console.error('Resend confirmation email error:', error.message);
      throw error;
    }
    
    console.log('Confirmation email resent');
  });
};