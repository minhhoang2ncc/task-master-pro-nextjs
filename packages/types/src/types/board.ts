import { Status } from "./task"

export type ColumnConfig = {
  id: Status | "cancelled"
  label: string
  colorName: string
}

