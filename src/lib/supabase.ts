import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseInstance(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const isValid = (val: any) => 
    typeof val === 'string' && 
    val.trim().length > 0;

  if (!isValid(supabaseUrl) || !isValid(supabaseAnonKey)) {
    const errorMsg = 'Supabase credentials missing or invalid. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    throw err;
  }
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop, receiver) {
    const instance = getSupabaseInstance();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  }
});
