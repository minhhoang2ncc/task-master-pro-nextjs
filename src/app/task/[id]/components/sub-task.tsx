import { Card, CardContent, CardHeader } from "@/shared/components/card"
import { Checkbox } from "@/shared/components/checkbox"
import { Button } from "@/shared/components/button"
import { GripVertical, Plus, Network, TrashIcon } from "lucide-react"
import type { Subtask, TaskRecord } from "@/shared/types/task"
import { useEffect, useState, useRef } from "react"



export function SubtasksCard({
  task,
  modifyRegister,
  addSubtaskRegister,
  onAddSubtask
}: {
  task: TaskRecord | undefined
  modifyRegister?: (getter: () => Subtask[] | undefined) => void
  deleteRegister?: (handler: () => void) => void
  addSubtaskRegister?: (handler: (title: string) => void) => void
  onAddSubtask?: () => void
}) {

  const subtasks = task?.subtasks || []

  const [draftSubTasks, setDraftSubTasks] = useState<Subtask[]>(subtasks)
  const draftSubTasksRef = useRef<Subtask[]>(subtasks)

  useEffect(() => {
    draftSubTasksRef.current = draftSubTasks
  }, [draftSubTasks])

  const handleSubtaskChange = (id: string | number, completed: boolean) => {
    const updatedSubtasks = draftSubTasks.map((t) =>
      t.id === id ? { ...t, completed } : t
    )
    setDraftSubTasks(updatedSubtasks)
  }

  const handleDeleteSubtask = (id: string | number) => {
    const updatedSubtasks = draftSubTasks.filter((t) => t.id !== id)
    setDraftSubTasks(updatedSubtasks)
  }

  const handleAddSubtask = (title: string) => {
    if (!task) return
    setDraftSubTasks((prev) => {
      const nextSubtaskId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 15)
      return [
        ...prev,
        {
          id: nextSubtaskId,
          title,
          completed: false,
        },
      ]
    })
  }

  useEffect(() => {
    if (!task) return
    modifyRegister?.(() => draftSubTasksRef.current)
  }, [])



  addSubtaskRegister?.(handleAddSubtask)

  return (
    <Card className="w-full shadow-sm">
      {/* Header Section */}
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-foreground" />
          <h2 className="text-xl font-bold text-foreground">
            Subtasks ({draftSubTasks.length})
          </h2>
        </div>
        <Button
          variant="ghost"
          className="text-indigo-700 font-semibold hover:text-indigo-800 hover:bg-indigo-50 px-2"
          onClick={onAddSubtask}
        >
          <Plus className="w-4 h-4 mr-1" strokeWidth={3} />
          Add subtask
        </Button>
      </CardHeader>

      {/* List Section */}
      <CardContent className="flex flex-col gap-3">
        {draftSubTasks.map((task) => (
          <div
            key={task.id}
            className="group flex items-center gap-4 p-4 border border-slate-200 rounded-md relative transition-colors cursor-pointer hover:bg-slate-50"
          >
            {/* Drag Handle */}
            <GripVertical className="w-5 h-5 text-slate-400 cursor-grab shrink-0" />

            {/* Checkbox */}
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => {
                handleSubtaskChange(task.id, !task.completed)
              }}
              className="w-5 h-5 rounded border-slate-300"
            />

            {/* Task Title with Dynamic Styling */}
            <span
              className={`text-base flex-1 ${task.completed
                ? "text-slate-500 line-through"
                : "text-slate-700"
                }`}
            >
              {task.title}
            </span>

            <button
              type="button"
              aria-label={`Remove ${task.title}`}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => {
                handleDeleteSubtask(task.id)
              }}
            >
              <TrashIcon className="h-4 w-4 text-red-500 hover:scale-125" />
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
