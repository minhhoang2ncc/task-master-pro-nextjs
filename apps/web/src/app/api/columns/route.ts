import { NextResponse } from 'next/server'
import { getSession } from '@/libs/utils/src/server-session'
import { createAuthedClient } from '@/api/database/authed-client'
import { getColumnsFromSupabase, createColumnInSupabase } from '@/api/database/models/columnQueries'
import type { ColumnConfig } from '@repo/types'

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

export async function GET() {
  const { client, userId, unauthorized } = await getAuthedClientOrUnauthorized()
  if (!client || !userId) return unauthorized!

  const { data, error } = await getColumnsFromSupabase(userId, client)

  if (error || !data) {
    console.warn('[api/columns] GET - could not fetch columns:', error)
    return NextResponse.json(
      { error: error?.message ?? 'Failed to fetch columns' },
      { status: 500 },
    )
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { client, userId, unauthorized } = await getAuthedClientOrUnauthorized()
  if (!client || !userId) return unauthorized!

  let body: { column: ColumnConfig; position: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { data, error } = await createColumnInSupabase(
    body.column,
    userId,
    body.position,
    client,
  )

  if (error || !data) {
    console.warn('[api/columns] POST - could not create column:', error)
    return NextResponse.json(
      { error: error?.message ?? 'Failed to create column' },
      { status: 500 },
    )
  }

  return NextResponse.json(data, { status: 201 })
}
