"use client"

import { Detail } from "./components/detail"
import { SubtasksCard } from "./components/sub-task"
import { SubTaskForm } from "./components/subtask-form"
import { DropOverlay } from "./components/drop-overlay"
import { ChevronRight } from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"
import { ActionCard } from "./components/action-card"
import { ProgressCard } from "./components/progress-card"
import { useSelector, useDispatch } from "react-redux"
import { modify } from "@/redux/slices/taskSlice"
import type { Subtask, TaskRecord } from "@repo/types"
import { useParams } from "next/navigation"
import type { RootState } from "@/redux/store"
import { TASK_SAVE_REQUESTED } from "@/redux/saga/taskSaga"

export default function TaskDetailPage() {
  const [mounted, setMounted] = useState(false)
  const [lastUpdated, setLastUpdated] = useState("")

  useEffect(() => {
    setMounted(true)
    setLastUpdated(new Date().toLocaleString())
  }, [])

  const params = useParams()
  const taskIdParam = params?.id
  const taskId = Array.isArray(taskIdParam) ? taskIdParam[0] : taskIdParam
  const taskList = useSelector((state: RootState) => state.tasks) || []
  const task = taskList.find((item) => item.id === taskId)
  const subtasks = task?.subtasks || []
  const progress = subtasks.filter((subtask) => subtask.completed).length

  const dispatch = useDispatch()

  // ── File list ────────────────────────────────────────────────────────────
  const [files, setFiles] = useState<{ name: string; publicUrl: string; metadata?: { mimetype?: string } }[]>([])

  const fetchFiles = useCallback(() => {
    if (!taskId) return
    fetch(`/api/storage/files?taskId=${taskId}`)
      .then((res) => res.ok ? res.json() : null)
      .then((body) => { if (body?.files) setFiles(body.files) })
      .catch(() => { })
  }, [taskId])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const modifyTaskHandlerRef = useRef<(() => TaskRecord | undefined) | undefined>(undefined)
  const deleteTaskHandlerRef = useRef<(() => void) | undefined>(undefined)

  const modifySubTaskHandlerRef = useRef<(() => Subtask[] | undefined) | undefined>(undefined)
  const deleteSubTaskHandlerRef = useRef<(() => void) | undefined>(undefined)

  const saveHandler = async () => {
    const taskData = modifyTaskHandlerRef.current?.()
    const childSubtasks = modifySubTaskHandlerRef.current?.()
    if (!taskData) return
    const merged: TaskRecord = {
      ...taskData,
      subtasks: childSubtasks ?? taskData.subtasks ?? []
    }

    dispatch(modify(merged))
    dispatch({ type: TASK_SAVE_REQUESTED, payload: merged })
  }

  const handleAddSubtaskRef = useRef<((title: string) => void) | undefined>(undefined)
  const [isSubtaskFormOpen, setIsSubtaskFormOpen] = useState(false)

  if (!mounted) {
    return null
  }

  return (
    <section className="mx-auto max-w-6xl px-4 flex flex-col items-start justify-center">
      <div className="flex items-center gap-1 text-muted-foreground m-4">
        <p className="text-sm">My Task</p>
        <ChevronRight className="w-4 h-4 inline-block" />
        <p className="text-primary dark:text-foreground text-sm">Task Detail</p>
      </div>

      <div className="grid grid-cols-[3fr_1fr] gap-4 m-4">
        <div className="flex flex-col gap-4 row-span-2">
          <Detail
            task={task}
            files={files}
            onDeleteSuccess={fetchFiles}
            modifyRegister={(handler) => { modifyTaskHandlerRef.current = handler }}
            deleteRegister={(handler) => { deleteTaskHandlerRef.current = handler }}
          />
          <SubtasksCard
            task={task}
            modifyRegister={(handler) => { modifySubTaskHandlerRef.current = handler }}
            addSubtaskRegister={(handler) => { handleAddSubtaskRef.current = handler }}
            deleteRegister={(handler) => { deleteSubTaskHandlerRef.current = handler }}
            onAddSubtask={() => setIsSubtaskFormOpen(true)}
          />
        </div>

        <div className="flex flex-col gap-4">
          <ActionCard lastUpdated={lastUpdated} onSave={saveHandler} onDelete={() => deleteTaskHandlerRef.current?.()} />
          <ProgressCard progress={progress} subtasks={subtasks} />
        </div>
      </div>

      <SubTaskForm
        open={isSubtaskFormOpen}
        onOpenChange={setIsSubtaskFormOpen}
        onSubmit={(title) => handleAddSubtaskRef.current?.(title)}
      />

      {/* Global drag-and-drop overlay for file uploads */}
      <DropOverlay taskId={taskId ?? ''} onUploadSuccess={fetchFiles} />
    </section>
  )
}
