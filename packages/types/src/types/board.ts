import { Status } from "./task"

export type ColumnConfig = {
  id: Status | "cancelled"
  label: string
  colorName: string
}

export interface BoardFilters {
  dateRange: "all" | "today" | "week" | "overdue"
  priority: string[] // [] = no filter
}
