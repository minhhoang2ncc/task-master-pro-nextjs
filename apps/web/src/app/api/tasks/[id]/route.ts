import { NextResponse } from 'next/server'
import { getSession } from '@/libs/utils/src/server-session'
import { createAuthedClient } from '@/api/database/authed-client'
import {
  updateTaskInSupabase,
  getTaskByIdFromSupabase,
  deleteTaskFromSupabase,
} from '@/api/database/models/taskQueries'
import type { TaskRecord } from '@repo/types'

// ─── Route Context ────────────────────────────────────────────────────────────

type RouteContext = { params: Promise<{ id: string }> }

// ─── Shared Auth Guard ────────────────────────────────────────────────────────

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

// ─── GET /api/tasks/[id] ──────────────────────────────────────────────────────

export async function GET(_req: Request, { params }: RouteContext) {
  const { id } = await params
  const { client, userId, unauthorized } = await getAuthedClientOrUnauthorized()
  if (!client || !userId) return unauthorized!

  const { data, error } = await getTaskByIdFromSupabase(id, userId, client)

  if (error || !data) {
    console.warn(`[api/tasks] GET [${id}] - could not fetch task:`, error)
    return NextResponse.json(
      { error: error?.message ?? 'Task not found' },
      { status: 404 },
    )
  }

  return NextResponse.json(data)
}

// ─── PUT /api/tasks/[id] ──────────────────────────────────────────────────────

export async function PUT(req: Request, { params }: RouteContext) {
  const { id } = await params
  const { client, userId, unauthorized } = await getAuthedClientOrUnauthorized()
  if (!client || !userId) return unauthorized!

  let body: TaskRecord
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { data, error } = await updateTaskInSupabase({ ...body, id }, userId, client)

  if (error || !data) {
    console.warn(`[api/tasks] PUT [${id}] - could not update task:`, error)
    return NextResponse.json(
      { error: error?.message ?? 'Failed to update task' },
      { status: 500 },
    )
  }

  return NextResponse.json(data)
}

// ─── DELETE /api/tasks/[id] ───────────────────────────────────────────────────

export async function DELETE(_req: Request, { params }: RouteContext) {
  const { id } = await params
  const { client, userId, unauthorized } = await getAuthedClientOrUnauthorized()
  if (!client || !userId) return unauthorized!

  const { error } = await deleteTaskFromSupabase(id, userId, client)

  if (error) {
    console.warn(`[api/tasks] DELETE [${id}] - could not delete task:`, error)
    return NextResponse.json(
      { error: error?.message ?? 'Failed to delete task' },
      { status: 500 },
    )
  }

  return new NextResponse(null, { status: 204 })
}
