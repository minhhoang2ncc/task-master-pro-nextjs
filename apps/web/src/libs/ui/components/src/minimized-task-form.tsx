"use no memo"
"use client"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import type { TaskRecord } from "@repo/types"
import { AlertCircle } from "lucide-react"
import { useDispatch } from "react-redux"
import { TASK_CREATE_REQUESTED } from "@/redux/saga/taskSaga"
import type { AppDispatch } from "@/redux/store"
import { taskSchema, type TaskFormValues } from "@repo/types/schemas"

export function MinimizedTaskForm({
  task,
  onSubmit,
}: {
  task: TaskRecord
  onSubmit?: (task: TaskRecord) => void
}) {
  const dispatch = useDispatch<AppDispatch>()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    mode: "onTouched",
    defaultValues: {
      title: task?.title ?? "",
      // Provide valid defaults so Zod doesn't block the submission
      description: "No description provided",
      priority: (task?.priority as TaskFormValues["priority"]) ?? "Low",
      // If dueDate is required by Zod, fallback to today's date instead of an empty string
      dueDate: task?.dueDate
        ? dayjs(task.dueDate as any).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD"),
    },
  })

  // Sync form when the task prop changes
  useEffect(() => {
    reset({
      title: task?.title ?? "",
      description: "No description provided",
      priority: (task?.priority as TaskFormValues["priority"]) ?? "Low",
      dueDate: task?.dueDate
        ? dayjs(task.dueDate as any).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD"),
    })
  }, [task, reset])

  const onValidSubmit = (data: TaskFormValues) => {
    const nextId = crypto.randomUUID()

    const nextTask: TaskRecord = {
      id: nextId,
      title: data.title,
      description: "No description provided",
      priority: data.priority,
      dueDate: dayjs(data.dueDate),
      status: task?.status ?? "Todo", // Added fallback just in case
      subtasks: task?.subtasks ?? [],
      tags: task?.tags ?? [],
    }

    console.log(nextTask)
    dispatch({ type: TASK_CREATE_REQUESTED, payload: nextTask })
    onSubmit?.(nextTask)
    handleCloseDialog()
    reset()
  }

  const handleCloseDialog = () => {
    const dialog = document.getElementById(
      "inputSecondDialog"
    ) as HTMLDialogElement | null
    if (dialog) dialog.close()
  }
  console.log("Form Errors:", errors);

  return (
    <dialog
      id="inputSecondDialog"
      className="fixed z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-white rounded-xl shadow-2xl backdrop:bg-black/50 open:animate-in open:fade-in open:zoom-in-95"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Create Task</h1>
        <button
          type="button"
          aria-label="Close dialog"
          className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
          onClick={handleCloseDialog}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Form */}
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onValidSubmit)}
        noValidate
      >
        {/* ── Title ── */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="title"
            className="text-sm font-semibold text-gray-700"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter task title"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
            className={`w-full px-3 py-2 text-sm text-gray-900 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:border-transparent ${errors.title
              ? "border-red-400 bg-red-50 focus:ring-red-400"
              : "border-gray-300 focus:ring-blue-500"
              }`}
            {...register("title")}
          />
          {errors.title && (
            <p
              id="title-error"
              role="alert"
              className="flex items-center gap-1 text-xs text-red-600"
            >
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.title.message}
            </p>
          )}
        </div>

        {/* ── Submit ── */}
        <div className="flex justify-end pt-4 mt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting…" : "Submit Task"}
          </button>
        </div>
      </form>
    </dialog>
  )
}
