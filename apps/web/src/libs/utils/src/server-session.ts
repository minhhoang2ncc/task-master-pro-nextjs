import 'server-only'
import { cookies } from 'next/headers'
import { encrypt, decrypt, SESSION_COOKIE, SESSION_DURATION_MS } from './session'
import type { SessionPayload } from './session'

export type { SessionPayload }

export async function createSession(userId: string, accessToken?: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
  const token = await encrypt({ userId, expiresAt, accessToken })
  const cookieStore = await cookies()

  const isSecure = process.env.SECURE_COOKIES === 'true'
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isSecure,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return decrypt(token)
}
