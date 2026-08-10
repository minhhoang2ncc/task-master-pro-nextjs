"use client"

import { useEffect, useState } from "react"
import { BoardHeader } from "./components/board-header"
import { BoardColumn } from "./components/board-column"
import type { ColumnConfig, BoardFilters } from "@repo/types"



const DEFAULT_FILTERS: BoardFilters = { dateRange: "all", priority: [] }

const COLUMNS: ColumnConfig[] = [
  { id: "todo", label: "To Do", colorName: "slate" },
  { id: "pending", label: "In Progress", colorName: "amber" },
  { id: "completed", label: "Completed", colorName: "emerald" },
]

export default function BoardPage() {
  const [mounted, setMounted] = useState(false)
  const [filters, setFilters] = useState<BoardFilters>(DEFAULT_FILTERS)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <section className="flex flex-col min-h-screen bg-background">
      {/* Board header with stats + filter */}
      <BoardHeader filters={filters} onFiltersChange={setFilters} />

      {/* Subtle divider */}
      <div className="mx-6 h-px bg-border mb-4" />

      {/* Kanban board */}
      <div className="flex-1 px-6 pb-8 overflow-x-auto">
        <div className="grid grid-cols-3 gap-4 min-w-[900px] items-start">
          {COLUMNS.map((column) => (
            <BoardColumn key={column.id} column={column} filters={filters} />
          ))}
        </div>
      </div>
    </section>
  )
}
