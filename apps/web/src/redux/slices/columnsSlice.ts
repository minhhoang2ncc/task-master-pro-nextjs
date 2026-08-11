import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { ColumnConfig } from "@repo/types"

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: "todo",      label: "To Do",       colorName: "slate"   },
  { id: "pending",   label: "In Progress", colorName: "amber"   },
  { id: "completed", label: "Completed",   colorName: "emerald" },
]

const columnsSlice = createSlice({
  name: "columns",
  initialState: DEFAULT_COLUMNS,
  reducers: {
    // Hydrate from DB: merges fetched custom columns after the 3 defaults
    setCustomColumns: (_state, action: PayloadAction<ColumnConfig[]>) => {
      return [...DEFAULT_COLUMNS, ...action.payload]
    },
    addColumn: (state, action: PayloadAction<ColumnConfig>) => {
      const exists = state.some((c) => c.id === action.payload.id)
      if (!exists) state.push(action.payload)
    },
    removeColumn: (state, action: PayloadAction<{ id: string }>) => {
      return state.filter((c) => c.id !== action.payload.id)
    },
    resetColumns: () => DEFAULT_COLUMNS,
  },
})

export const { setCustomColumns, addColumn, removeColumn, resetColumns } = columnsSlice.actions
export default columnsSlice.reducer
