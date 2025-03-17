// This is a simple script to create a test user
// You can run it with: node scripts/createTestUser.js

const { createClient } = require('@supabase/supabase-js');

// Test user credentials
const TEST_EMAIL = 'testuser@example.com';
const TEST_PASSWORD = 'password123';

// Create Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
  console.log(`Creating test user: ${TEST_EMAIL}`);
  
  try {
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    
    if (error) {
      console.error('Error creating test user:', error.message);
      return;
    }
    
    console.log('Test user created successfully!');
    console.log('User ID:', data.user.id);
    console.log('\nYou can now log in with:');
    console.log('Email:', TEST_EMAIL);
    console.log('Password:', TEST_PASSWORD);
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

createTestUser();