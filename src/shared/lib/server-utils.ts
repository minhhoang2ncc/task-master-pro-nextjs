import { getSession } from '@/shared/lib/server-session'
import { createAuthedClient } from '@/api/database/authed-client'
import { NextResponse } from 'next/server'

export async function getAuthedClientOrUnauthorized() {
  const session = await getSession()
  if (!session?.accessToken) {
    return { client: null, unauthorized: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { client: createAuthedClient(session.accessToken), unauthorized: null }
}
