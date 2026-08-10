import { Status } from "./task"

export type ColumnConfig = {
  id: Status | "cancelled"
  label: string
  color: string
  dotColor: string
  bgColor: string
  borderColor: string
}

