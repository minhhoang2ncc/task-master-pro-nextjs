import type { ColumnConfig } from '@repo/types'

export async function getColumns(): Promise<ColumnConfig[]> {
  const res = await fetch('/api/columns', { credentials: 'include' })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? `Failed to fetch columns (${res.status})`)
  }

  return res.json()
}

export async function postCreateColumn(
  column: ColumnConfig,
  position: number,
): Promise<ColumnConfig> {
  const res = await fetch('/api/columns', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ column, position }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? `Failed to create column (${res.status})`)
  }

  return res.json()
}

export async function deleteColumn(id: string): Promise<void> {
  const res = await fetch(`/api/columns/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? `Failed to delete column (${res.status})`)
  }
}


