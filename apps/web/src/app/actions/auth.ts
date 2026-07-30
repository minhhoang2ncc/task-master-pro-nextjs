'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { supabase } from '@/api/database/client'
import { createAuthedClient } from '@/api/database/authed-client'
import { createSession, deleteSession } from '@/libs/utils/src/server-session'
import {
  SignupSchema,
  LoginSchema,
  type SignupFormState,
  type LoginFormState,
} from '@repo/types/schemas'

// Re-export form state types so that pages can import them from one place.
// export type { SignupFormState, LoginFormState }

// ─── Server Actions ──────────────────────────────────────────────────────────

export async function signup(
  _state: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {

  // 1. Validate fields
  const result = SignupSchema.safeParse({
    displayName: formData.get('displayName'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
  })
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { displayName, email, password, role } = result.data

  // 2. Hash password before storing in the profile table
  const passwordHash = await bcrypt.hash(password, 12)

  // 3. Create auth user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, role },
    },
  })

  if (authError || !authData.user) {
    return { message: authError?.message ?? 'Failed to create account. Please try again.' }
  }

  const userId = authData.user.id
  const accessToken = authData.session?.access_token

  // 4. Insert profile row in users table.
  // accessToken is null when email confirmation is enabled in Supabase.
  // In that case auth.uid() cannot be resolved server-side, so we cannot
  // satisfy the RLS policy (auth.uid() = id) — tell the user to confirm.
  if (!accessToken) {
    return {
      message:
        'Account created! Please check your email to confirm your address, then sign in.',
    }
  }

  // Use the user's own JWT so auth.uid() resolves and RLS passes.
  const authedClient = createAuthedClient(accessToken)

  const { error: profileError } = await authedClient.from('users').insert({
    id: userId,
    display_name: displayName,
    email,
    role,
    password_hash: passwordHash,
  })

  if (profileError) {
    console.error('Could not create user profile row:', profileError)
    return { message: 'Account created but profile setup failed. Please contact support.' }
  }

  // 5. Create session cookie
  try {
    await createSession(userId, accessToken)
  } catch (err) {
    console.error('Failed to create session:', err)
    return { message: 'Account created but could not start session. Please log in.' }
  }

  // 6. Redirect to dashboard
  redirect('/dashboard')
}

export async function login(
  _state: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  // 1. Validate fields
  const result = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { email, password } = result.data

  // 2. Sign in with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError || !authData.user) {
    return { message: 'Invalid email or password.' }
  }

  // 3. Create session cookie
  await createSession(authData.user.id, authData.session?.access_token)

  // 4. Redirect to dashboard
  redirect('/dashboard')
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut()
  await deleteSession()
  redirect('/login')
}
