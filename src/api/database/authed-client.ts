import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client authenticated with the caller's own JWT so that
 * `auth.uid()` resolves correctly for Row Level Security (RLS) policies.
 *
 * Use this on the **server only** (Server Actions, Route Handlers) whenever
 * you need to perform an operation that must pass an RLS policy tied to the
 * authenticated user's identity.
 */
export function createAuthedClient(accessToken: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  )
}
