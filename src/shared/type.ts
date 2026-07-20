import type { Dayjs } from "dayjs"

export type Status = 'completed' | 'pending' | 'cancelled'

export interface Subtask {
  id: string | number
  title: string
  completed: boolean
}

export interface TaskRecord {
  id: string | number
  creator_id?: string
  title: string
  description?: string
  priority: string
  dueDate: Dayjs
  status: Status
  tags?: { name: string; color: string }[]
  subtasks?: Subtask[]
}

export interface User {
  id?: string
  displayName: string
  email: string
  role: string
}

export interface NotificationSettings {
  browserNotifications: boolean
  emailNotifications: boolean
}

export type AppLanguage = 'English' | 'Vietnamese' | 'Japanese' | string

export interface LanguageSettings {
  language: AppLanguage
}
