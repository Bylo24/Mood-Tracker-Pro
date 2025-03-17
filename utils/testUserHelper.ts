import { supabase } from './supabaseClient';

/**
 * Creates a test user account for development and testing purposes
 * @param email The email address for the test user
 * @param password The password for the test user
 * @returns An object containing the result of the operation
 */
export const createTestUser = async (email: string, password: string) => {
  try {
    console.log('Creating test user account:', email);
    
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined
      }
    });
    
    if (error) {
      console.error('Error creating test user:', error.message);
      return { success: false, error: error.message };
    }
    
    // If the user was created successfully
    if (data.user) {
      console.log('Test user created successfully:', data.user.id);
      
      // For test accounts, we'll automatically confirm the email
      // This is only for development purposes
      if (!data.session) {
        console.log('Attempting to auto-confirm test user email...');
        
        try {
          // Note: In a real app, you would never do this
          // This is just for testing purposes
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (signInError) {
            console.error('Error signing in test user:', signInError.message);
          } else {
            console.log('Test user signed in successfully');
          }
        } catch (signInError) {
          console.error('Error auto-confirming test user:', signInError);
        }
      }
      
      return { 
        success: true, 
        user: data.user,
        session: data.session,
        message: 'Test user created successfully. You can now log in with these credentials.'
      };
    }
    
    return { 
      success: false, 
      error: 'Unknown error creating test user' 
    };
  } catch (error) {
    console.error('Unexpected error creating test user:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};