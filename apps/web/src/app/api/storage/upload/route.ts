import { NextResponse } from 'next/server'
import { getSession } from '@/libs/utils/src/server-session'
import { createAuthedClient } from '@/api/database/authed-client'
import { nativeFileSchema } from '@repo/types/schemas'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const raw = formData.get('file')
  const taskId = formData.get('taskId')

  if (!taskId || typeof taskId !== 'string') {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 })
  }

  if (!raw || !(raw instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Validate with Zod
  const result = nativeFileSchema.safeParse(raw)
  if (!result.success) {
    console.error('[api/storage/upload] Validation failed:', result.error.format())
    return NextResponse.json({ error: 'Validation failed' }, { status: 422 })
  }

  const parsedFile = result.data

  const client = createAuthedClient(session.accessToken)
  const { data, error } = await client.storage
    .from('task')
    .upload(`${taskId}/${parsedFile.name}`, parsedFile, { upsert: true })

  if (error) {
    console.error('[api/storage/upload] Supabase error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data }, { status: 200 })
}
