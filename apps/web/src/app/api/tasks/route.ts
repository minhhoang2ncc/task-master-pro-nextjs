import { NextResponse } from 'next/server'
import { getSession } from '@/libs/utils/src/server-session'
import { createAuthedClient } from '@/api/database/authed-client'
import {
  createTaskInSupabase,
  getTasksFromSupabase,
} from '@/api/database/models/taskQueries'
import type { TaskRecord } from '@repo/types'


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

  const { data, error } = await getTasksFromSupabase(userId, client)

  if (error || !data) {
    console.warn('[api/tasks] GET - could not fetch tasks:', error)
    return NextResponse.json(
      { error: error?.message ?? 'Failed to fetch tasks' },
      { status: 500 },
    )
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { client, userId, unauthorized } = await getAuthedClientOrUnauthorized()
  if (!client || !userId) return unauthorized!

  let body: TaskRecord
  try {
    body = await req.json()
    console.log('routes', body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { data, error } = await createTaskInSupabase(body, userId, client)

  if (error || !data) {
    console.warn('[api/tasks] POST - could not create task:', error)
    return NextResponse.json(
      { error: error?.message ?? 'Failed to create task' },
      { status: 500 },
    )
  }

  return NextResponse.json(data, { status: 201 })
}
