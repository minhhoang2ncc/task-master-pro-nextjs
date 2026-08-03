export async function uploadFile(file: File, taskId: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('taskId', taskId)

  const res = await fetch('/api/storage/upload', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error ?? `Upload failed with status ${res.status}`)
  }

  return res.json() as Promise<{ success: true; data: unknown }>
}

export async function deleteFile(fileName: string, taskId: string) {
  const params = new URLSearchParams({ taskId, fileName })
  const res = await fetch(`/api/storage/files?${params}`, { method: 'DELETE' })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error ?? `Delete failed with status ${res.status}`)
  }

  return res.json() as Promise<{ success: true }>
}
