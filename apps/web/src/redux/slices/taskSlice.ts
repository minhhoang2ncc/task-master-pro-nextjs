import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TaskRecord } from "@repo/types";
import dayjs from "dayjs";

// ─── Normalizer ───────────────────────────────────────────────────────────────
function normalizeTask(raw: any): TaskRecord {
  return {
    ...raw,
    dueDate: dayjs.isDayjs(raw.dueDate) ? raw.dueDate : dayjs(raw.dueDate),
  }
}

// ─── Slice ───────────────────────────────────────────────────────────────────

const initialState: TaskRecord[] = []

export const TaskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    // Used by taskSaga after a successful fetchAll
    setTasks: (_taskList, action: PayloadAction<TaskRecord[]>) => {
      return action.payload.map(normalizeTask)
    },

    // Used by taskSaga after a successful fetchById
    upsertTask: (taskList, action: PayloadAction<TaskRecord>) => {
      const normalized = normalizeTask(action.payload)
      const index = taskList.findIndex(t => t.id === normalized.id)
      if (index !== -1) {
        taskList[index] = normalized
      } else {
        taskList.push(normalized)
      }
    },

    // Used by taskSaga for optimistic create
    append: (taskList, action: PayloadAction<TaskRecord>) => {
      taskList.push(normalizeTask(action.payload))
    },

    // Used by taskSaga for optimistic delete (and rollback of create)
    remove: (taskList, action: PayloadAction<{ id: string | number }>) => {
      const index = taskList.findIndex(task => task.id === action.payload.id)
      if (index !== -1) {
        taskList.splice(index, 1)
      }
    },

    // Used by TaskDetailPage save handler
    modify: (taskList, action: PayloadAction<TaskRecord>) => {
      const index = taskList.findIndex(task => task.id === action.payload.id)
      if (index !== -1) {
        taskList[index] = normalizeTask(action.payload)
      }
    },
  },
})

export const { setTasks, upsertTask, append, remove, modify } = TaskSlice.actions
export default TaskSlice.reducer
