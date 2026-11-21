import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
  throw new Error('Falta SUPABASE_URL en el archivo .env');
}

if (!supabaseAnonKey) {
  throw new Error('Falta SUPABASE_ANON_KEY en el archivo .env');
}

if (!supabaseSecretKey) {
  throw new Error('Falta SUPABASE_SECRET_KEY en el archivo .env');
}

// Cliente utilizado para autenticación normal
export const supabaseAuth = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

// Cliente administrativo.
// IMPORTANTE: este cliente debe existir solamente en el backend.
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseSecretKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);