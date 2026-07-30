import { SignJWT, jwtVerify } from 'jose'

export interface SessionPayload {
  userId: string
  expiresAt: Date
  accessToken?: string
}

export const SESSION_COOKIE = 'session'
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

function getEncodedKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET environment variable is not set')
  return new TextEncoder().encode(secret)
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    expiresAt: payload.expiresAt.toISOString(),
    accessToken: payload.accessToken,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getEncodedKey())
}

export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getEncodedKey(), {
      algorithms: ['HS256'],
    })
    return {
      userId: payload.userId as string,
      expiresAt: new Date(payload.expiresAt as string),
      accessToken: payload.accessToken as string | undefined,
    }
  } catch {
    return null
  }
}
