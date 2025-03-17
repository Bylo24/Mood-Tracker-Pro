// This file re-exports the Supabase client from utils/supabaseClient.ts
// to ensure we're using the same client instance throughout the app
import { supabase } from '../utils/supabaseClient';

export { supabase };