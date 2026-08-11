import type { SupabaseClient } from '@supabase/supabase-js'
import type { ColumnConfig } from '@repo/types'

const DEFAULT_IDS = new Set(['todo', 'pending', 'completed'])

function toDbRow(col: ColumnConfig, userId: string, position: number) {
  return {
    id: col.id,
    user_id: userId,
    label: col.label,
    color_name: col.colorName,
    position,
  }
}

function fromDbRow(row: any): ColumnConfig {
  return {
    id: row.id,
    label: row.label,
    colorName: row.color_name,
  }
}

export async function getColumnsFromSupabase(
  userId: string,
  client: SupabaseClient,
): Promise<{ data: ColumnConfig[] | null; error: any }> {
  const { data, error } = await client
    .from('board_columns')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })

  if (error) {
    console.error('Failed to fetch board columns:', error)
    return { data: null, error }
  }

  return { data: (data ?? []).map(fromDbRow), error: null }
}

export async function createColumnInSupabase(
  col: ColumnConfig,
  userId: string,
  position: number,
  client: SupabaseClient,
): Promise<{ data: ColumnConfig | null; error: any }> {
  if (DEFAULT_IDS.has(col.id)) {
    return { data: col, error: null }
  }

  const { data, error } = await client
    .from('board_columns')
    .insert(toDbRow(col, userId, position))
    .select()
    .single()

  if (error) {
    console.error('Failed to create board column:', error)
    return { data: null, error }
  }

  return { data: fromDbRow(data), error: null }
}

export async function deleteColumnFromSupabase(
  id: string,
  userId: string,
  client: SupabaseClient,
): Promise<{ error: any }> {
  if (DEFAULT_IDS.has(id)) {
    return { error: null } // silently skip defaults
  }

  const { error } = await client
    .from('board_columns')
    .delete()
    .eq('id', id)
    .eq('user_id', userId) // authorization guard

  if (error) {
    console.error(`Failed to delete board column ${id}:`, error)
  }

  return { error }
}
