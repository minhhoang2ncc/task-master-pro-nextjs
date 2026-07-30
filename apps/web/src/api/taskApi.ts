import type { TaskRecord } from "@repo/types"
import dayjs from 'dayjs'

function serializeTask(task: TaskRecord): Record<string, unknown> {
  return {
    ...task,
    dueDate: task.dueDate.toISOString(),
  }
}

function deserializeTask(raw: any): TaskRecord {
  return {
    ...raw,
    dueDate: dayjs(raw.dueDate),
  }
}
export async function postCreateTask(payload: TaskRecord, _userId: string): Promise<TaskRecord> {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      creator_id: _userId
    }),
  })
  console.log(payload)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const message = err?.error ?? `Failed to create task (${res.status})`
    console.error('Failed to create task in Supabase:', err)
    throw new Error(message)
  }

  return deserializeTask(await res.json())
}

export async function postSaveTask(payload: TaskRecord, _userId: string): Promise<TaskRecord> {
  const res = await fetch(`/api/tasks/${payload.id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      creator_id: _userId
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const message = err?.error ?? `Failed to update task ${payload.id} (${res.status})`
    console.error(`Failed to update task ${payload.id} in Supabase:`, err)
    throw new Error(message)
  }

  return deserializeTask(await res.json())
}

export async function getTasks(_userId: string): Promise<TaskRecord[]> {
  const res = await fetch('/api/tasks', {
    credentials: 'include',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const message = err?.error ?? `Failed to fetch tasks (${res.status})`
    console.error('Failed to fetch tasks from Supabase:', err)
    throw new Error(message)
  }

  const raw: any[] = await res.json()
  return raw.map(deserializeTask)
}

export async function getTaskById(id: string | number, _userId: string): Promise<TaskRecord> {
  const res = await fetch(`/api/tasks/${id}`, {
    credentials: 'include',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const message = err?.error ?? `Task ${id} not found (${res.status})`
    console.error(`Failed to fetch task ${id} from Supabase:`, err)
    throw new Error(message)
  }

  return deserializeTask(await res.json())
}

export async function deleteTask(id: string | number, _userId: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const message = err?.error ?? `Failed to delete task ${id} (${res.status})`
    console.error(`Failed to delete task ${id} in Supabase:`, err)
    throw new Error(message)
  }
}
