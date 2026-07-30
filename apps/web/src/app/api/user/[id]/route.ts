import { NextResponse } from 'next/server'
import { getAuthedClientOrUnauthorized } from '@/libs/utils/src/server-utils'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: RouteContext) {
  const { id } = await params
  const { client, unauthorized } = await getAuthedClientOrUnauthorized()
  if (!client) return unauthorized!

  const { data, error } = await client.from('users').select('*').eq('id', id).single()

  if (error || !data) {
    console.warn(`[api/user] GET - could not fetch user ${id}:`, error)
    return NextResponse.json({ error: error?.message ?? 'Not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PUT(req: Request, { params }: RouteContext) {
  const { id } = await params
  const { client, unauthorized } = await getAuthedClientOrUnauthorized()
  if (!client) return unauthorized!

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const dbPayload: Record<string, unknown> = {}
  if (body.displayName !== undefined) dbPayload.display_name = body.displayName
  if (body.email !== undefined) dbPayload.email = body.email
  if (body.role !== undefined) dbPayload.role = body.role
  if (body.browserNotifications !== undefined) dbPayload.browser_notifications = body.browserNotifications
  if (body.emailNotifications !== undefined) dbPayload.email_notifications = body.emailNotifications
  if (body.languageDisplay !== undefined) dbPayload.language_display = body.languageDisplay

  if (Object.keys(dbPayload).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const { data, error } = await client
    .from('users')
    .update(dbPayload)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) {
    console.warn(`[api/user] PUT - could not update user ${id}:`, error)
    return NextResponse.json({ error: error?.message ?? 'Update failed' }, { status: 500 })
  }

  return NextResponse.json(data)
}
