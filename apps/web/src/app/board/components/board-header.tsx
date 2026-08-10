"use client"

import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import {
  Kanban, CheckCircle2, Clock, AlertCircle,
  SlidersHorizontal, X, ChevronDown,
} from "lucide-react"
import type { RootState } from "@/redux/store"
import type { BoardFilters } from "@repo/types"

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

interface BoardHeaderProps {
  filters: BoardFilters
  onFiltersChange: (f: BoardFilters) => void
}

export function BoardHeader({ filters, onFiltersChange }: BoardHeaderProps) {
  const tasks = useSelector((state: RootState) => state.tasks)
  const user = useSelector((state: RootState) => state.user)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  }

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0

  // Count active filters for the badge
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

        <div className="flex items-center gap-3">
          {/* Filter button + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="board-filter-btn"
              onClick={() => setOpen((v) => !v)}
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
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown panel */}
            {open && (
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
                          {/* Radio dot */}
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
                          {/* Checkbox */}
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
                          {/* Dot + label */}
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.dot }} />
                            <span className="text-xs font-medium text-foreground">{p}</span>
                          </span>
                          {/* Pill */}
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
