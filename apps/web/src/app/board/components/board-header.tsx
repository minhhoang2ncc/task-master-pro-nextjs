"use client"

import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import {
  Kanban, CheckCircle2, Clock, AlertCircle,
  SlidersHorizontal, X, ChevronDown, Plus, Columns3, Trash2,
} from "lucide-react"
import type { RootState } from "@/redux/store"
import type { BoardFilters, ColumnConfig } from "@repo/types"

const DATE_OPTIONS: { value: BoardFilters["dateRange"]; label: string; description: string }[] = [
  { value: "all", label: "All dates", description: "No date filter" },
  { value: "today", label: "Due today", description: "Deadline is today" },
  { value: "week", label: "Due this week", description: "Deadline within 7 days" },
  { value: "overdue", label: "Overdue", description: "Past the deadline" },
]

const PRIORITY_OPTIONS = ["Low", "Medium", "High"] as const

const PRIORITY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Low: { bg: "#f0fdf4", text: "#16a34a", dot: "#22c55e" },
  Medium: { bg: "#fffbeb", text: "#d97706", dot: "#f59e0b" },
  High: { bg: "#fef2f2", text: "#dc2626", dot: "#ef4444" },
}

const COLOR_PRESETS: { name: string; label: string; dot: string }[] = [
  { name: "violet", label: "Violet", dot: "#8b5cf6" },
  { name: "rose", label: "Rose", dot: "#f43f5e" },
  { name: "sky", label: "Sky", dot: "#0ea5e9" },
  { name: "orange", label: "Orange", dot: "#f97316" },
  { name: "teal", label: "Teal", dot: "#14b8a6" },
  { name: "pink", label: "Pink", dot: "#ec4899" },
  { name: "lime", label: "Lime", dot: "#84cc16" },
  { name: "indigo", label: "Indigo", dot: "#6366f1" },
]

const DEFAULT_IDS = new Set(['todo', 'pending', 'completed'])

interface BoardHeaderProps {
  filters: BoardFilters
  onFiltersChange: (f: BoardFilters) => void
  columns: ColumnConfig[]
  onAddColumn: (col: ColumnConfig) => void
  onDeleteColumn: (col: ColumnConfig) => void
}

export function BoardHeader({ filters, onFiltersChange, columns, onAddColumn, onDeleteColumn }: BoardHeaderProps) {
  const tasks = useSelector((state: RootState) => state.tasks)
  const user = useSelector((state: RootState) => state.user)

  const [filterOpen, setFilterOpen] = useState(false)
  const [colOpen, setColOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [colName, setColName] = useState("")
  const [colColor, setColColor] = useState(COLOR_PRESETS[0].name)

  const filterRef = useRef<HTMLDivElement>(null)
  const colRef = useRef<HTMLDivElement>(null)
  const deleteRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false)
      if (colRef.current && !colRef.current.contains(e.target as Node)) setColOpen(false)
      if (deleteRef.current && !deleteRef.current.contains(e.target as Node)) setDeleteOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Focus input when column dropdown opens
  useEffect(() => {
    if (colOpen) setTimeout(() => inputRef.current?.focus(), 50)
    else { setColName(""); setColColor(COLOR_PRESETS[0].name) }
  }, [colOpen])

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  }

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0

  const activeCount =
    (filters.dateRange !== "all" ? 1 : 0) +
    filters.priority.length

  const togglePriority = (p: string) => {
    const next = filters.priority.includes(p)
      ? filters.priority.filter((x) => x !== p)
      : [...filters.priority, p]
    onFiltersChange({ ...filters, priority: next })
  }

  const clearAll = () => onFiltersChange({ dateRange: "all", priority: [] })

  const slugify = (str: string) =>
    str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

  const existingColumnIds = columns.map((c) => c.id)
  const customColumns = columns.filter((c) => !DEFAULT_IDS.has(c.id))

  const columnId = slugify(colName) || ""
  const isDuplicate = !!columnId && existingColumnIds.includes(columnId as ColumnConfig["id"])
  const canCreate = !!colName.trim() && !isDuplicate

  const handleCreateColumn = () => {
    if (!canCreate) return
    onAddColumn({ id: columnId as ColumnConfig["id"], label: colName.trim(), colorName: colColor })
    setColOpen(false)
  }

  const statCards = [
    { id: "todo", icon: Clock, color: { bg: "#f1f5f9", icon: "#64748b" }, label: "To Do", value: stats.todo },
    { id: "in-progress", icon: AlertCircle, color: { bg: "#fef3c7", icon: "#d97706" }, label: "In Progress", value: stats.pending },
    { id: "completed", icon: CheckCircle2, color: { bg: "#d1fae5", icon: "#059669" }, label: "Completed", value: stats.completed },
  ]

  return (
    <div className="flex flex-col gap-5 px-6 pt-6 pb-4">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 shadow-md shadow-indigo-200 dark:shadow-indigo-900/40">
            <Kanban className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Board View</h1>
            <p className="text-sm text-muted-foreground">
              {user.displayName ? `${user.displayName}'s workspace` : "Your workspace"} · {stats.total} tasks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* ── Add Column dropdown ── */}
          <div className="relative" ref={colRef}>
            <button
              id="add-column-btn"
              onClick={() => { setColOpen((v) => !v); setFilterOpen(false); setDeleteOpen(false) }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all duration-150 ${colOpen
                ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-700 dark:text-indigo-300"
                : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-indigo-300"
                }`}
            >
              <Plus className="w-4 h-4" />
              Column
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${colOpen ? "rotate-180" : ""}`} />
            </button>

            {colOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 z-50 rounded-2xl border border-border bg-card shadow-xl shadow-black/10 overflow-hidden"
                style={{ animation: "slideDown 0.15s ease" }}
              >
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <Columns3 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">New column</span>
                </div>

                {/* Name input */}
                <div className="px-3 pt-3 pb-2">
                  <input
                    ref={inputRef}
                    value={colName}
                    onChange={(e) => setColName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleCreateColumn(); if (e.key === "Escape") setColOpen(false) }}
                    placeholder="Column name…"
                    className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-indigo-400 transition-colors"
                    aria-invalid={isDuplicate}
                  />
                  {isDuplicate && (
                    <p className="mt-1 text-[11px] text-destructive px-0.5">Name already exists.</p>
                  )}
                </div>

                {/* Color swatches */}
                <div className="px-3 pb-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Color</p>
                  <div className="grid grid-cols-8 gap-1.5">
                    {COLOR_PRESETS.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        title={c.label}
                        onClick={() => setColColor(c.name)}
                        className="w-5 h-5 rounded-full transition-transform hover:scale-110 focus:outline-none"
                        style={{
                          backgroundColor: c.dot,
                          outline: colColor === c.name ? `2px solid ${c.dot}` : "2px solid transparent",
                          outlineOffset: "2px",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Create button */}
                <div className="px-3 pb-3">
                  <button
                    id="create-column-submit-btn"
                    onClick={handleCreateColumn}
                    disabled={!canCreate}
                    className="w-full flex items-center justify-center gap-1.5 h-8 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create column
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Delete Column dropdown ── */}
          <div className="relative" ref={deleteRef}>
            <button
              id="delete-column-btn"
              onClick={() => { setDeleteOpen((v) => !v); setColOpen(false); setFilterOpen(false) }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all duration-150 ${
                deleteOpen
                  ? "bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/40 dark:border-rose-700 dark:text-rose-300"
                  : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-rose-300"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Delete
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${deleteOpen ? "rotate-180" : ""}`} />
            </button>

            {deleteOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 z-50 rounded-2xl border border-border bg-card shadow-xl shadow-black/10 overflow-hidden"
                style={{ animation: "slideDown 0.15s ease" }}
              >
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">Delete column</span>
                </div>

                {customColumns.length === 0 ? (
                  <p className="px-4 py-4 text-xs text-muted-foreground text-center">
                    No custom columns yet.
                  </p>
                ) : (
                  <div className="p-1.5 flex flex-col gap-0.5">
                    {customColumns.map((col) => {
                      const dot = COLOR_PRESETS.find((p) => p.name === col.colorName)?.dot ?? "#94a3b8"
                      return (
                        <button
                          key={col.id}
                          onClick={() => { onDeleteColumn(col); setDeleteOpen(false) }}
                          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-left text-sm text-foreground hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-700 dark:hover:text-rose-300 transition-colors group"
                        >
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                          <span className="flex-1 truncate font-medium">{col.label}</span>
                          <Trash2 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Filter dropdown ── */}
          <div className="relative" ref={filterRef}>
            <button
              id="board-filter-btn"
              onClick={() => { setFilterOpen((v) => !v); setColOpen(false); setDeleteOpen(false) }}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all duration-150 ${activeCount > 0
                ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-700 dark:text-indigo-300"
                : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-indigo-300"
                }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeCount > 0 && (
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                  {activeCount}
                </span>
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown panel */}
            {filterOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-64 z-50 rounded-2xl border border-border bg-card shadow-xl shadow-black/10 overflow-hidden"
                style={{ animation: "slideDown 0.15s ease" }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="text-sm font-semibold text-foreground">Filters</span>
                  {activeCount > 0 && (
                    <button
                      onClick={clearAll}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-3 h-3" />
                      Clear all
                    </button>
                  )}
                </div>

                {/* ── Date section ── */}
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2.5">
                    Deadline
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {DATE_OPTIONS.map((opt) => {
                      const active = filters.dateRange === opt.value
                      return (
                        <button
                          key={opt.value}
                          onClick={() => onFiltersChange({ ...filters, dateRange: opt.value })}
                          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left transition-colors duration-100 ${active
                            ? "bg-indigo-50 dark:bg-indigo-950/40"
                            : "hover:bg-muted/60"
                            }`}
                        >
                          <span
                            className={`flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${active ? "border-indigo-600" : "border-muted-foreground/40"
                              }`}
                          >
                            {active && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                            )}
                          </span>
                          <div>
                            <p className={`text-xs font-medium ${active ? "text-indigo-700 dark:text-indigo-300" : "text-foreground"}`}>
                              {opt.label}
                            </p>
                            <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* ── Priority section ── */}
                <div className="px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2.5">
                    Priority
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {PRIORITY_OPTIONS.map((p) => {
                      const active = filters.priority.includes(p)
                      const col = PRIORITY_COLORS[p]
                      return (
                        <button
                          key={p}
                          onClick={() => togglePriority(p)}
                          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left transition-colors duration-100 ${active ? "bg-muted/60" : "hover:bg-muted/40"
                            }`}
                        >
                          <span
                            className={`flex-shrink-0 w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all ${active ? "border-transparent" : "border-muted-foreground/40"
                              }`}
                            style={active ? { backgroundColor: col.dot } : {}}
                          >
                            {active && (
                              <svg className="w-2 h-2 text-white" viewBox="0 0 8 8" fill="none">
                                <path d="M1 4l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.dot }} />
                            <span className="text-xs font-medium text-foreground">{p}</span>
                          </span>
                          <span
                            className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                            style={{ backgroundColor: col.bg, color: col.text }}
                          >
                            {p}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Completion pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border">
            <div className="relative w-5 h-5">
              <svg viewBox="0 0 36 36" className="w-5 h-5 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="4" className="text-border" />
                <circle
                  cx="18" cy="18" r="15"
                  fill="none" stroke="currentColor" strokeWidth="4"
                  strokeDasharray={`${completionRate * 0.942} 94.2`}
                  className="text-indigo-500 transition-all duration-700"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-foreground">{completionRate}%</span>
            <span className="text-xs text-muted-foreground">complete</span>
          </div>
        </div>
      </div>

      {/* Quick stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.id} className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card border border-border">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ backgroundColor: card.color.bg }}
              >
                <Icon className="w-4 h-4" style={{ color: card.color.icon }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
                <p className="text-lg font-bold text-foreground leading-tight">{card.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.dateRange !== "all" && (
            <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800">
              {DATE_OPTIONS.find((d) => d.value === filters.dateRange)?.label}
              <button onClick={() => onFiltersChange({ ...filters, dateRange: "all" })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.priority.map((p) => (
            <span
              key={p}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border"
              style={{
                backgroundColor: PRIORITY_COLORS[p].bg,
                color: PRIORITY_COLORS[p].text,
                borderColor: PRIORITY_COLORS[p].dot + "44",
              }}
            >
              {p}
              <button onClick={() => togglePriority(p)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  )
}
