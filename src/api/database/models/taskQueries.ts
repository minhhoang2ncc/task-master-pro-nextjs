import { supabase } from '../client'
import type { TaskRecord, Subtask } from '@/shared/type'
import dayjs from 'dayjs'

const TARGET_USER_ID = "b9c92921-8c4b-41ad-bc27-24bd96e17999"

function formatTaskPayloadForDb(task: TaskRecord) {
  return {
    task: {
      id: task.id,
      title: task.title,
      description: task.description,
      due_date: task.dueDate.format('YYYY-MM-DD'),
      priority: task.priority,
      tags: task.tags,
      creator_id: TARGET_USER_ID,
      status: task.status.toString()
    },
    subtasks: task.subtasks
  }
}

function formatSubTask(subtask: Subtask, task: TaskRecord) {
  return {
    id: subtask.id,
    parent_task_id: task.id,
    title: subtask.title,
    is_completed: subtask.completed
  }
}

export function parseDbRowToTask(task: any, subtask: any): TaskRecord {
  return {
    id: task.id,
    creator_id: TARGET_USER_ID,
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: dayjs(task.due_date),
    status: task.status,
    tags: task.tags || [],
    subtasks: subtask || []
  }
}

export async function createTaskInSupabase(task: TaskRecord): Promise<{ data: TaskRecord | null; error: any }> {
  const { subtasks, ...dbPayload } = formatTaskPayloadForDb(task)
  console.log('Task Object')
  console.log(dbPayload)
  const { data, error } = await supabase
    .from('tasks')
    .insert(dbPayload.task)
    .select()
    .single()

  if (error) {
    console.error('Failed to execute task creation in the primary data source:', error)
    return { data: null, error }
  }
  return { data: parseDbRowToTask(data, null), error: null }
}

async function handleUpdateSubtasks(task: any, subtasks: Subtask[] | undefined) {
  const { data, error: fetchError } = await supabase
    .from('subtasks')
    .select('id')
    .eq('parent_task_id', task.id)

  if (fetchError) {
    console.error("Error fetching existing subtasks:", fetchError);
    return;
  }

  const existingSubtasks = data?.map(st => st.id) || []
  const incomingSubtasks = subtasks?.map(st => st.id)

  const subtaksToInsert = subtasks?.filter(st => !existingSubtasks.includes(st.id))
    .map(st => formatSubTask(st, task)) //object
  const subtasksToDelete = existingSubtasks.filter(st => !incomingSubtasks!.includes(st)) //id
  const subtasksToUpdate = subtasks?.filter(st => existingSubtasks.includes(st.id))
    .map(st => formatSubTask(st, task))

  if (subtasksToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from('subtasks')
      .delete()
      .in('id', subtasksToDelete)

    if (deleteError) console.error("Failed to delete subtasks:", deleteError)
  }

  if (subtaksToInsert!.length > 0) {
    const { error: insertError } = await supabase
      .from('subtasks')
      .insert(subtaksToInsert!)

    if (insertError) console.error('Failed to insert subtasks:', insertError)
  }

  if (subtasksToUpdate && subtasksToUpdate.length > 0) {
    const { error: updateError } = await supabase
      .from('subtasks')
      .upsert(subtasksToUpdate) // Upsert uses the 'id' to overwrite existing data

    if (updateError) console.error('Failed to update subtasks:', updateError)
  }
}
export async function updateTaskInSupabase(task: TaskRecord): Promise<{ data: TaskRecord | null; error: any }> {
  const { subtasks, ...dbPayload } = formatTaskPayloadForDb(task)
  const { data, error } = await supabase
    .from('tasks')
    .update(dbPayload.task)
    .eq('id', task.id)
    .select()
    .single()
  handleUpdateSubtasks(task, subtasks)

  if (error) {
    console.error(`Failed to execute task update for record ID ${task.id} in the primary data source:`, error)
    return { data: null, error }
  }
  return { data: parseDbRowToTask(data, null), error: null }
}

export async function getTasksFromSupabase(): Promise<{ data: TaskRecord[] | null; error: any }> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('creator_id', TARGET_USER_ID)

  if (error) {
    console.error('Failed to retrieve task records from the primary data source:', error)
    return { data: null, error }
  }
  return { data: (data || []).map(parseDbRowToTask), error: null }
}

export async function getTaskByIdFromSupabase(id: string | number): Promise<{ data: TaskRecord | null; error: any }> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Failed to retrieve task record for ID ${id} from the primary data source:`, error)
    return { data: null, error }
  }
  return { data: parseDbRowToTask(data, null), error: null }
}

export async function deleteTaskFromSupabase(id: string | number): Promise<{ error: any }> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Failed to execute task deletion for record ID ${id} in the primary data source:`, error)
  }
  return { error }
}
