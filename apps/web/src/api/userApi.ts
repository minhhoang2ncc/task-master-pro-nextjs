import type { User, UpdateUserPayload } from '@repo/types'
import { UpdateUserPayloadSchema } from '@repo/types'

function parseDbRowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    displayName: (row.display_name ?? row.displayName ?? '') as string,
    email: (row.email ?? '') as string,
    role: (row.role ?? '') as string,
  }
}

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
