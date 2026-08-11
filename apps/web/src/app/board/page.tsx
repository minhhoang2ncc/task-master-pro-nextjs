"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BoardHeader } from "./components/board-header"
import { BoardColumn } from "./components/board-column"
import { addColumn } from "@/redux/slices/columnsSlice"
import {
  COLUMN_FETCH_REQUESTED,
  COLUMN_CREATE_REQUESTED,
  COLUMN_DELETE_REQUESTED,
} from "@/redux/saga/columnSaga"
import type { AppDispatch, RootState } from "@/redux/store"
import type { ColumnConfig, BoardFilters } from "@repo/types"

const DEFAULT_FILTERS: BoardFilters = { dateRange: "all", priority: [] }

export default function BoardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const columns = useSelector((state: RootState) => state.columns)
  const userId = useSelector((state: RootState) => state.user.id)
  const [mounted, setMounted] = useState(false)
  const [filters, setFilters] = useState<BoardFilters>(DEFAULT_FILTERS)

  useEffect(() => { setMounted(true) }, [])

  // Fetch custom columns from DB once we know who the user is
  useEffect(() => {
    if (userId) dispatch({ type: COLUMN_FETCH_REQUESTED })
  }, [userId, dispatch])

  if (!mounted) return null

  const handleAddColumn = (newColumn: ColumnConfig) => {
    dispatch(addColumn(newColumn))
    dispatch({ type: COLUMN_CREATE_REQUESTED, payload: newColumn })
  }

  const handleDeleteColumn = (col: ColumnConfig) => {
    dispatch({ type: COLUMN_DELETE_REQUESTED, payload: col })
  }

  return (
    <section className="flex flex-col min-h-screen bg-background">
      <BoardHeader
        filters={filters}
        onFiltersChange={setFilters}
        columns={columns}
        onAddColumn={handleAddColumn}
        onDeleteColumn={handleDeleteColumn}
      />

      {/* Subtle divider */}
      <div className="mx-6 h-px bg-border mb-4" />

      {/* Kanban board */}
      <div className="flex-1 px-6 pb-8 overflow-x-auto">
        <div
          className="flex gap-4 items-start"
          style={{ minWidth: `${Math.max(900, columns.length * 284)}px` }}
        >
          {columns.map((column) => (
            <div key={column.id} className="w-[280px] flex-shrink-0">
              <BoardColumn column={column} filters={filters} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
