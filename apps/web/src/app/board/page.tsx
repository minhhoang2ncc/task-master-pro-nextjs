"use client"

import { useEffect, useState } from "react"
import { BoardHeader } from "./components/board-header"
import { BoardColumn } from "./components/board-column"
import { ColumnConfig } from "@repo/types"
import { Status } from "@repo/types"


const columnList = [
  {
    id: "todo",
    label: "To Do",
    color: "slate"
  },
  {
    id: "pending",
    label: "In Progress",
    color: "amber"
  },
  {
    id: "completed",
    label: "Completed",
    color: "emerald"
  },
]

const COLUMNS: ColumnConfig[] = columnList.map((e: { id: string; label: string; color: string }) => ({
  id: e.id as Status,
  label: e.label,
  color: `bg-${e.color}-100 text-${e.color}-600 dark:bg-${e.color}-800 dark:text-${e.color}-300`,
  dotColor: `bg-${e.color}-400`,
  bgColor: `bg-${e.color}-50/60 dark:bg-${e.color}-900/20`,
  borderColor: `border-${e.color}-400`
}))


export default function BoardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="flex flex-col min-h-screen bg-background">
      {/* Board header with stats */}
      <BoardHeader />

      {/* Subtle divider */}
      <div className="mx-6 h-px bg-border mb-4" />

      {/* Kanban board: horizontally scrollable columns */}
      <div className="flex-1 px-6 pb-8 overflow-x-auto">
        <div className="grid grid-cols-3 gap-4 min-w-[900px]">
          {COLUMNS.map((column) => (
            <BoardColumn key={column.id} column={column} />
          ))}
        </div>
      </div>
    </section>
  )
}
