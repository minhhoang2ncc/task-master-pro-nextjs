"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { Badge } from "@repo/ui"
import { Avatar, AvatarImage, AvatarFallback } from "@repo/ui"
import { stripHtml } from "@repo/ui"
import { Calendar, CheckCheck, Flag, Tag, ListChecks, GripVertical } from "lucide-react"
import dayjs from "dayjs"
import { BADGE, PRIORITY } from "@/shared/styles/tailwind-classes"
import { TASK_SAVE_REQUESTED } from "@/redux/saga/taskSaga"
import type { RootState } from "@/redux/store"
import type { Dayjs } from "dayjs"

interface BoardCardProps {
  id: string | number
  title: string
  priority: string
  dueDate: Dayjs
  status: string
  tags?: { name: string; color: string }[]
  subtasks?: { id: string | number; title: string; completed: boolean }[]
}

export function BoardCard({ id, title, priority, dueDate, status, tags, subtasks }: BoardCardProps) {
  const router = useRouter()
  const dispatch = useDispatch()
  const fullTask = useSelector((state: RootState) => state.tasks.find((t) => t.id === id))
  const [isDragging, setIsDragging] = useState(false)

  const isCompleted = status === "completed"
  const completedSubtasks = subtasks?.filter((s) => s.completed).length ?? 0
  const totalSubtasks = subtasks?.length ?? 0
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0

  const isOverdue =
    !isCompleted && dayjs(dueDate).isBefore(dayjs(), "day")

  const handleClick = () => {
    router.push(`/task/${id}`)
  }

  const handleCheckboxChange = () => {
    if (!fullTask) return
    dispatch({
      type: TASK_SAVE_REQUESTED,
      payload: {
        ...fullTask,
        status: isCompleted ? "pending" : "completed",
      },
    })
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", String(id))
    e.dataTransfer.effectAllowed = "move"
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div
      id={String(id)}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        group relative flex flex-col gap-3 p-4 rounded-xl bg-card border border-border
        shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing
        ${isDragging ? "opacity-40 scale-95 rotate-1" : "opacity-100"}
        ${isCompleted ? "opacity-75" : ""}
      `}
    >
      {/* Drag handle indicator */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-40 transition-opacity">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Priority + Tags row */}
      <div className="flex flex-wrap items-center gap-1.5 pr-6">
        <Badge
          variant="secondary"
          className={`
            ${BADGE.default}
            ${isCompleted ? BADGE.checked_mode : ""}
            ${!isCompleted && priority.toLowerCase() === "high" ? PRIORITY.high : ""}
            ${!isCompleted && priority.toLowerCase() === "medium" ? PRIORITY.medium : ""}
            ${!isCompleted && priority.toLowerCase() === "low" ? PRIORITY.low : ""}
          `}
        >
          <Flag className="w-2.5 h-2.5 mr-1" />
          {priority}
        </Badge>

        {tags?.slice(0, 2).map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-sm font-medium"
            style={{
              backgroundColor: tag.color + "22",
              color: tag.color,
              border: `1px solid ${tag.color}44`,
            }}
          >
            <Tag className="w-2.5 h-2.5" />
            {tag.name}
          </span>
        ))}
      </div>

      {/* Title */}
      <button
        onClick={handleClick}
        className={`text-left text-sm font-semibold leading-snug transition-colors hover:text-primary ${
          isCompleted ? "line-through text-muted-foreground" : "text-foreground"
        }`}
      >
        {stripHtml(title)}
      </button>

      {/* Subtask progress bar */}
      {totalSubtasks > 0 && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ListChecks className="w-3 h-3" />
              {completedSubtasks}/{totalSubtasks}
            </span>
            <span className="text-xs text-muted-foreground">{subtaskProgress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                subtaskProgress === 100
                  ? "bg-emerald-500"
                  : "bg-indigo-500"
              }`}
              style={{ width: `${subtaskProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer: due date + avatar */}
      <div className="flex items-center justify-between mt-1">
        <button
          onClick={handleCheckboxChange}
          className={`flex items-center gap-1.5 text-xs rounded-md px-2 py-1 transition-colors ${
            isCompleted
              ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
              : isOverdue
              ? "text-red-600 bg-red-50 dark:bg-red-950/40"
              : "text-muted-foreground bg-muted/50 hover:bg-muted"
          }`}
        >
          {isCompleted ? (
            <CheckCheck className="w-3 h-3" />
          ) : (
            <Calendar className="w-3 h-3" />
          )}
          <span>{dayjs(dueDate).format("MMM D, YYYY")}</span>
        </button>

        <Avatar className="h-7 w-7 border border-border">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${id}`}
            alt="Assignee"
          />
          <AvatarFallback className="text-xs">U</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
