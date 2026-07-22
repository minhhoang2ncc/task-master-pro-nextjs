import type { TaskRecord } from "@/shared/types/task"
import dayjs from 'dayjs'

// NOTE: taskApi is called from browser-side Redux sagas.
// All operations are delegated to Next.js Route Handlers (/api/tasks/...)
// so the server can read the encrypted session cookie, attach the Supabase
// JWT as an Authorization header, and satisfy Row Level Security (RLS).
// All functions throw on error so the calling saga can catch and roll back.

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Serializes a TaskRecord for transport over HTTP.
 * `dueDate` is a dayjs object which must be converted to a string for JSON.
 */
function serializeTask(task: TaskRecord): Record<string, unknown> {
  return {
    ...task,
    dueDate: task.dueDate.toISOString(),
  }
}

/**
 * Deserializes a raw JSON task response from the Route Handler back into a
 * proper `TaskRecord`, converting the `dueDate` string to a dayjs object.
 */
function deserializeTask(raw: any): TaskRecord {
  return {
    ...raw,
    dueDate: dayjs(raw.dueDate),
  }
}

// ─── Task API ─────────────────────────────────────────────────────────────────

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
