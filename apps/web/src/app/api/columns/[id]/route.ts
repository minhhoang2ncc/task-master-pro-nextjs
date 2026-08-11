import { NextResponse } from 'next/server'
import { getSession } from '@/libs/utils/src/server-session'
import { createAuthedClient } from '@/api/database/authed-client'
import { deleteColumnFromSupabase } from '@/api/database/models/columnQueries'

async function getAuthedClientOrUnauthorized() {
  const session = await getSession()
  if (!session?.accessToken || !session?.userId) {
    return {
      client: null,
      userId: null,
      unauthorized: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }
  return {
    client: createAuthedClient(session.accessToken),
    userId: session.userId,
    unauthorized: null,
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { client, userId, unauthorized } = await getAuthedClientOrUnauthorized()
  if (!client || !userId) return unauthorized!

  const { id } = await params

  const { error } = await deleteColumnFromSupabase(id, userId, client)

  if (error) {
    console.warn(`[api/columns/${id}] DELETE failed:`, error)
    return NextResponse.json(
      { error: error?.message ?? 'Failed to delete column' },
      { status: 500 },
    )
  }

  return new NextResponse(null, { status: 204 })
}
