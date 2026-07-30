import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey: string | undefined =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// Create a single Supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey as string, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
  },
})


