import type { TaskRecord } from "@/shared/type"
import {
  createTaskInSupabase,
  updateTaskInSupabase,
  getTasksFromSupabase,
  getTaskByIdFromSupabase,
  deleteTaskFromSupabase,
} from "@/api/database/models/taskQueries"

export async function postCreateTask(payload: TaskRecord): Promise<TaskRecord> {
  const { data, error } = await createTaskInSupabase(payload)
  if (error || !data) {
    console.error("Failed to create task in Supabase:", error)
    return payload
  }
  return data
}

export async function postSaveTask(payload: TaskRecord): Promise<TaskRecord> {
  const { data, error } = await updateTaskInSupabase(payload)
  if (error || !data) {
    console.error(`Failed to update task ${payload.id} in Supabase:`, error)
    return payload
  }
  return data
}

export async function getTasks(): Promise<TaskRecord[]> {
  const { data, error } = await getTasksFromSupabase()
  if (error || !data) {
    console.error("Failed to fetch tasks from Supabase:", error)
    return []
  }
  return data
}

export async function getTaskById(id: string | number): Promise<TaskRecord> {
  const { data, error } = await getTaskByIdFromSupabase(id)
  if (error || !data) {
    console.error(`Failed to fetch task ${id} from Supabase:`, error)
    throw new Error(`Task ${id} not found`)
  }
  return data
}

export async function deleteTask(id: string | number): Promise<void> {
  const { error } = await deleteTaskFromSupabase(id)
  if (error) {
    console.error(`Failed to delete task ${id} from Supabase:`, error)
  }
}
