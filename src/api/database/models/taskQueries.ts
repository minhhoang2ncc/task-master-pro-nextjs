import { supabase as defaultClient } from '../client'
import type { TaskRecord, Subtask } from '@/shared/types/task'
import type { SupabaseClient } from '@supabase/supabase-js'
import dayjs from 'dayjs'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTaskPayloadForDb(task: TaskRecord, userId: string) {
  return {
    task: {
      id: task.id,
      title: task.title,
      description: task.description,
      due_date: dayjs(task.dueDate as any).format('YYYY-MM-DD'),
      priority: task.priority,
      tags: task.tags,
      creator_id: userId,
      status: task.status.toString()
    },
    subtasks: task.subtasks ?? []
  }
}

function formatSubTask(subtask: Subtask, taskId: string | number) {
  return {
    id: subtask.id,
    parent_task_id: taskId,
    title: subtask.title,
    is_completed: subtask.completed
  }
}

function parseDbSubtask(row: any): Subtask {
  return {
    id: row.id,
    title: row.title,
    completed: row.is_completed ?? false,
  }
}

export function parseDbRowToTask(task: any, subtasks: any[]): TaskRecord {
  return {
    id: task.id,
    creator_id: task.creator_id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: dayjs(task.due_date),
    status: task.status,
    tags: task.tags || [],
    subtasks: (subtasks || []).map(parseDbSubtask),
  }
}

// ─── Subtask helpers ──────────────────────────────────────────────────────────

async function fetchSubtasksForTask(
  taskId: string | number,
  client: SupabaseClient,
): Promise<Subtask[]> {
  const { data, error } = await client
    .from('subtasks')
    .select('*')
    .eq('parent_task_id', taskId)

  if (error) {
    console.error(`Failed to fetch subtasks for task ${taskId}:`, error)
    return []
  }
  return (data || []).map(parseDbSubtask)
}

async function fetchSubtasksForTasks(
  taskIds: (string | number)[],
  client: SupabaseClient,
): Promise<Record<string, Subtask[]>> {
  if (taskIds.length === 0) return {}

  const { data, error } = await client
    .from('subtasks')
    .select('*')
    .in('parent_task_id', taskIds)

  if (error) {
    console.error('Failed to fetch subtasks for tasks:', error)
    return {}
  }

  // Group subtasks by parent_task_id
  const grouped: Record<string, Subtask[]> = {}
  for (const row of data || []) {
    const key = String(row.parent_task_id)
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(parseDbSubtask(row))
  }
  return grouped
}

async function handleUpdateSubtasks(
  taskId: string | number,
  subtasks: Subtask[],
  client: SupabaseClient,
): Promise<void> {
  const { data, error: fetchError } = await client
    .from('subtasks')
    .select('id')
    .eq('parent_task_id', taskId)

  if (fetchError) {
    console.error('Error fetching existing subtasks:', fetchError)
    return
  }

  const existingIds = (data || []).map((st: any) => st.id)
  const incomingIds = subtasks.map((st) => st.id)

  const subtasksToInsert = subtasks
    .filter((st) => !existingIds.includes(st.id))
    .map((st) => formatSubTask(st, taskId))

  const subtasksToDelete = existingIds.filter((id: any) => !incomingIds.includes(id))

  const subtasksToUpdate = subtasks
    .filter((st) => existingIds.includes(st.id))
    .map((st) => formatSubTask(st, taskId))

  if (subtasksToDelete.length > 0) {
    const { error: deleteError } = await client
      .from('subtasks')
      .delete()
      .in('id', subtasksToDelete)
    if (deleteError) console.error('Failed to delete subtasks:', deleteError)
  }

  if (subtasksToInsert.length > 0) {
    const { error: insertError } = await client
      .from('subtasks')
      .insert(subtasksToInsert)
    if (insertError) console.error('Failed to insert subtasks:', insertError)
  }

  if (subtasksToUpdate.length > 0) {
    const { error: updateError } = await client
      .from('subtasks')
      .upsert(subtasksToUpdate)
    if (updateError) console.error('Failed to update subtasks:', updateError)
  }
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export async function createTaskInSupabase(
  task: TaskRecord,
  userId: string,
  client: SupabaseClient = defaultClient,
): Promise<{ data: TaskRecord | null; error: any }> {
  const { subtasks, ...dbPayload } = formatTaskPayloadForDb(task, userId)
  console.log('taskQueries', dbPayload.task)
  const { data, error } = await client
    .from('tasks')
    .insert(dbPayload.task)
    .select()
    .single()

  if (error) {
    console.error('Failed to execute task creation in the primary data source:', error)
    return { data: null, error }
  }

  // Insert subtasks if any were provided with the new task
  if (subtasks.length > 0) {
    await handleUpdateSubtasks(data.id, subtasks, client)
  }

  return { data: parseDbRowToTask(data, subtasks), error: null }
}

export async function updateTaskInSupabase(
  task: TaskRecord,
  userId: string,
  client: SupabaseClient = defaultClient,
): Promise<{ data: TaskRecord | null; error: any }> {
  const { subtasks, ...dbPayload } = formatTaskPayloadForDb(task, userId)

  const { data, error } = await client
    .from('tasks')
    .update(dbPayload.task)
    .eq('id', task.id)
    .eq('creator_id', userId) // authorization guard: only owner can edit
    .select()
    .single()

  if (error) {
    console.error(`Failed to execute task update for record ID ${task.id}:`, error)
    return { data: null, error }
  }

  // Await subtask sync so we return consistent data
  await handleUpdateSubtasks(task.id, subtasks, client)

  // Re-fetch the updated subtasks to return a consistent TaskRecord
  const updatedSubtasks = await fetchSubtasksForTask(data.id, client)
  return { data: parseDbRowToTask(data, updatedSubtasks), error: null }
}

export async function getTasksFromSupabase(
  userId: string,
  client: SupabaseClient = defaultClient,
): Promise<{ data: TaskRecord[] | null; error: any }> {
  const { data, error } = await client
    .from('tasks')
    .select('*')
    .eq('creator_id', userId)

  if (error) {
    console.error('Failed to retrieve task records from the primary data source:', error)
    return { data: null, error }
  }

  const tasks = data || []
  const taskIds = tasks.map((t: any) => t.id)

  // Fetch all subtasks in a single query and group by task id
  const subtasksByTaskId = await fetchSubtasksForTasks(taskIds, client)

  return {
    data: tasks.map((t: any) => parseDbRowToTask(t, subtasksByTaskId[String(t.id)] || [])),
    error: null,
  }
}

export async function getTaskByIdFromSupabase(
  id: string | number,
  userId: string,
  client: SupabaseClient = defaultClient,
): Promise<{ data: TaskRecord | null; error: any }> {
  const { data, error } = await client
    .from('tasks')
    .select('*')
    .eq('id', id)
    .eq('creator_id', userId) // authorization guard
    .single()

  if (error) {
    console.error(`Failed to retrieve task record for ID ${id}:`, error)
    return { data: null, error }
  }

  const subtasks = await fetchSubtasksForTask(data.id, client)
  return { data: parseDbRowToTask(data, subtasks), error: null }
}

export async function deleteTaskFromSupabase(
  id: string | number,
  userId: string,
  client: SupabaseClient = defaultClient,
): Promise<{ error: any }> {
  const { error } = await client
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('creator_id', userId) // authorization guard: only owner can delete

  if (error) {
    console.error(`Failed to execute task deletion for record ID ${id}:`, error)
  }
  return { error }
}
