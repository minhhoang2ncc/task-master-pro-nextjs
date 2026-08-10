"use client"

import { useSelector } from "react-redux"
import { Kanban, CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react"
import type { RootState } from "@/redux/store"

export function BoardHeader() {
  const tasks = useSelector((state: RootState) => state.tasks)
  const user = useSelector((state: RootState) => state.user)

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  }

  const statCards = [
    {
      id: "todo",
      icon: Clock,
      color: "slate",
      label: "To Do",
      value: stats.todo,
    },
    {
      id: "in-progress",
      icon: AlertCircle,
      color: "amber",
      label: "In Progress",
      value: stats.pending,
    },
    {
      id: "completed",
      icon: CheckCircle2,
      color: "emerald",
      label: "Completed",
      value: stats.completed,
    },
  ];

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0

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

        {/* Completion pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border">
          <div className="relative w-5 h-5">
            <svg viewBox="0 0 36 36" className="w-5 h-5 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="4" className="text-border" />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${completionRate * 0.942} 94.2`}
                className="text-indigo-500 transition-all duration-700"
              />
            </svg>
          </div>
          <span className="text-sm font-semibold text-foreground">{completionRate}%</span>
          <span className="text-xs text-muted-foreground">complete</span>
        </div>
      </div>

      {/* Quick stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card border border-border"
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg bg-${card.color}-100 dark:bg-${card.color}-900/30`}
              >
                <Icon className={`w-4 h-4 text-${card.color}-500`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
                <p className="text-lg font-bold text-foreground leading-tight">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
