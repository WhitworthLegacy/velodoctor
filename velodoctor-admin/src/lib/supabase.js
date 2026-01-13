import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

const sessionStorageRef = typeof window !== 'undefined' ? window.sessionStorage : undefined;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: sessionStorageRef,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
