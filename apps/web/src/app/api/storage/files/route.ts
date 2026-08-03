import { NextResponse } from 'next/server'
import { getSession } from '@/libs/utils/src/server-session'
import { createAuthedClient } from '@/api/database/authed-client'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const taskId = searchParams.get('taskId')

  if (!taskId) {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 })
  }
  const session = await getSession()
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = createAuthedClient(session.accessToken)

  const { data, error } = await client.storage.from('task').list(taskId, {
    limit: 100,
    sortBy: { column: 'created_at', order: 'desc' },
  })

  if (error) {
    console.error('[api/storage/files] Supabase error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Attach a public URL to each file
  const files = (data ?? []).map((file) => {
    const { data: urlData } = client.storage.from('task').getPublicUrl(`${taskId}/${file.name}`)
    return { ...file, publicUrl: urlData.publicUrl }
  })

  return NextResponse.json({ files })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const taskId = searchParams.get('taskId')
  const fileName = searchParams.get('fileName')

  if (!taskId || !fileName) {
    return NextResponse.json({ error: 'taskId and fileName are required' }, { status: 400 })
  }

  const session = await getSession()
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = createAuthedClient(session.accessToken)

  const { error } = await client.storage
    .from('task')
    .remove([`${taskId}/${fileName}`])

  if (error) {
    console.error('[api/storage/files] DELETE error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
