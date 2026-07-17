import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug: Check if environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables check:', {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? 'set' : 'missing',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? 'set' : 'missing',
  });
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file or Vercel environment settings.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
