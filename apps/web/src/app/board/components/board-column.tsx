"use client"

import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { PlusCircle, X, Check } from "lucide-react"
import dayjs from "dayjs"
import { BoardCard } from "./board-card"
import { TASK_CREATE_REQUESTED, TASK_SAVE_REQUESTED } from "@/redux/saga/taskSaga"
import type { AppDispatch, RootState } from "@/redux/store"
import type { TaskRecord, Status, ColumnConfig } from "@repo/types"

const COLOR_STYLES = {
  slate: {
    bg: "rgba(248,250,252,0.6)",
    bgDark: "rgba(15,23,42,0.2)",
    dot: "#94a3b8",
    border: "#94a3b8",
    badgeBg: "#f1f5f9",
    badgeText: "#475569",
  },
  amber: {
    bg: "rgba(255,251,235,0.6)",
    bgDark: "rgba(120,53,15,0.2)",
    dot: "#fbbf24",
    border: "#fbbf24",
    badgeBg: "#fef3c7",
    badgeText: "#d97706",
  },
  emerald: {
    bg: "rgba(236,253,245,0.6)",
    bgDark: "rgba(6,78,59,0.2)",
    dot: "#34d399",
    border: "#34d399",
    badgeBg: "#d1fae5",
    badgeText: "#059669",
  },
} as const

type ColorName = keyof typeof COLOR_STYLES

interface BoardColumnProps {
  column: ColumnConfig
}

export function BoardColumn({ column }: BoardColumnProps) {
  const dispatch = useDispatch<AppDispatch>()
  const taskList = useSelector((state: RootState) => state.tasks)
  const [dragCounter, setDragCounter] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const c = COLOR_STYLES[column.colorName as ColorName] ?? COLOR_STYLES.slate
  const columnTasks = taskList.filter((task) => task.status === column.id)
  const isDraggedOver = dragCounter > 0

  // Auto-focus the textarea when the inline form opens
  useEffect(() => {
    if (isAdding) textareaRef.current?.focus()
  }, [isAdding])

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setDragCounter((prev) => prev + 1)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragCounter((prev) => prev - 1)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragCounter(0)
    const draggedId = e.dataTransfer.getData("text/plain")
    const existingTask = taskList.find((task) => String(task.id) === draggedId)
    if (!existingTask || existingTask.status === column.id) return
    const updated: TaskRecord = { ...existingTask, status: column.id as Status }
    dispatch({ type: TASK_SAVE_REQUESTED, payload: updated })
  }

  const handleSubmit = () => {
    const trimmed = title.trim()
    if (!trimmed) return
    const newTask: TaskRecord = {
      id: crypto.randomUUID(),
      title: trimmed,
      description: "",
      priority: "Low",
      dueDate: dayjs().add(7, "day"),
      status: column.id as Status,
      subtasks: [],
      tags: [],
    }
    dispatch({ type: TASK_CREATE_REQUESTED, payload: newTask })
    setTitle("")
    setIsAdding(false)
  }

  const handleCancel = () => {
    setTitle("")
    setIsAdding(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit() }
    if (e.key === "Escape") handleCancel()
  }

  return (
    <div
      className={`flex flex-col max-h-[70vh] rounded-2xl border transition-all duration-200 ${isDraggedOver ? "border-dashed border-2 scale-[1.01]" : "border-border"
        }`}
      style={{
        backgroundColor: c.bg,
        ...(isDraggedOver ? { borderColor: c.border } : {}),
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: c.dot }}
          />
          <h2 className="text-sm font-semibold text-foreground">{column.label}</h2>
          <span
            className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: c.badgeBg, color: c.badgeText }}
          >
            {columnTasks.length}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div
        className="mx-4 h-0.5 rounded-full opacity-30 mb-3"
        style={{ backgroundColor: c.dot }}
      />

      {/* Cards — only this region scrolls */}
      <div
        className={`flex flex-col gap-3 px-3 pb-3 flex-1 min-h-0 overflow-y-auto transition-all duration-200 ${isDraggedOver ? "pointer-events-none" : ""
          }`}
      >
        {columnTasks.length === 0 && !isAdding ? (
          <div
            className="flex flex-col items-center justify-center flex-1 min-h-[120px] rounded-xl border-2 border-dashed transition-colors duration-200"
            style={isDraggedOver ? { borderColor: c.border } : undefined}
          >
            <span className="text-xs text-muted-foreground/60">
              {isDraggedOver ? "Drop here" : "No tasks"}
            </span>
          </div>
        ) : (
          columnTasks.map((task) => (
            <BoardCard
              key={task.id}
              id={task.id}
              title={task.title}
              priority={task.priority}
              dueDate={task.dueDate}
              status={task.status}
              tags={task.tags}
              subtasks={task.subtasks}
            />
          ))
        )}

        {/* Inline quick-add form card */}
        {isAdding && (
          <div className="rounded-xl bg-card border border-border shadow-md p-3 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <textarea
              ref={textareaRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Task title…"
              rows={2}
              className="w-full resize-none text-sm text-foreground bg-transparent placeholder:text-muted-foreground/60 focus:outline-none leading-snug"
            />
            <div className="flex items-center gap-2 pt-1 border-t border-border">
              <button
                onClick={handleSubmit}
                disabled={!title.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Check className="w-3.5 h-3.5" />
                Add
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
              <span className="ml-auto text-[10px] text-muted-foreground/50 hidden sm:block">
                ↵ to add · Esc to cancel
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Add Task Button — hidden while form is open */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 mx-3 mb-3 px-3 py-2.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors group"
        >
          <PlusCircle className="w-4 h-4 group-hover:text-primary transition-colors" />
          Add task
        </button>
      )}
    </div>
  )
}
