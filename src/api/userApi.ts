import type { User, UpdateUserPayload } from '@/shared/types/user'
import { UpdateUserPayloadSchema } from '@/shared/types/user'
// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Maps a raw Supabase database row to the application's `User` shape.
 * Handles both snake_case (from the DB) and camelCase (normalised) keys.
 */
function parseDbRowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    displayName: (row.display_name ?? row.displayName ?? '') as string,
    email: (row.email ?? '') as string,
    role: (row.role ?? '') as string,
  }
}

// ─── User CRUD ────────────────────────────────────────────────────────────────

/**
 * Fetches a user profile by ID.
 *
 * Delegates to the `/api/user/[id]` server-side Route Handler so the Supabase
 * access token is forwarded from the session cookie and `auth.uid()` resolves
 * correctly for RLS policies.
 */
export async function fetchUser(id: string | number): Promise<UpdateUserPayload> {
  try {
    const res = await fetch(`/api/user/${id}`, { credentials: 'include' })
    if (res.ok) {
      const row = await res.json()
      console.log('res', row)
      console.log('Schema', UpdateUserPayloadSchema.parse(row))

      return UpdateUserPayloadSchema.parse(row)
    }
    const err = await res.json().catch(() => ({}))
    console.warn(`Could not fetch user ${id}:`, err)
  } catch (err) {
    console.warn(`Unexpected error fetching user ${id}:`, err)
  }

  // Fallback — return a minimal placeholder so callers always get a User shape.
  return {
    id: String(id),
    displayName: 'User',
    email: '',
    role: '',
    browserNotifications: true,
    emailNotifications: true,
    languageDisplay: ''

  }
}

// ─── User Update Payload ──────────────────────────────────────────────────────

/**
 * Updates (upserts) a user profile.
 *
 * Delegates to the `/api/user/[id]` Route Handler via a PUT request so the
 * server-side session cookie is used and RLS policies are satisfied without
 * exposing the access token to client code.
 *
 * On failure, returns the original payload merged with the provided `id` so
 * callers always receive a User-shaped object.
 */
export async function updateUser(payload: UpdateUserPayload): Promise<User> {
  const { id, ...rest } = payload
  console.log(rest)
  try {
    const res = await fetch(`/api/user/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rest),
    })

    if (res.ok) {
      const row = await res.json()
      return parseDbRowToUser(row)
    }
    const err = await res.json().catch(() => ({}))
    console.warn(`Could not update user ${id}:`, err)
  } catch (err) {
    console.warn(`Unexpected error updating user ${id}:`, err)
  }

  // Fallback — return a best-effort User from the payload.
  return {
    id,
    displayName: payload.displayName ?? '',
    email: payload.email ?? '',
    role: payload.role ?? '',
  }
}
