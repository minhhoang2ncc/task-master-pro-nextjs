"use no memo"
"use client"
import { useEffect, useRef, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import type { TaskRecord } from "@/shared/types/task"
import { Button } from "@/libs/ui/components/src/shadcn/button"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
import { ChevronRight, AlertCircle } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { TASK_CREATE_REQUESTED } from "@/redux/saga/taskSaga"
import type { AppDispatch, RootState } from "@/redux/store"
import { taskSchema, type TaskFormValues } from "@/libs/zod/schema/schema"

export function TaskForm({
  task,
  onSubmit,
}: {
  task: TaskRecord
  onSubmit?: (task: TaskRecord) => void
}) {
  const dispatch = useDispatch<AppDispatch>()
  const tasks = useSelector((state: RootState) => state.tasks)
  const priorityMenuRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    mode: "onTouched",
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: (task?.priority as TaskFormValues["priority"]) ?? "Low",
      dueDate: task?.dueDate ? dayjs(task.dueDate as any).format("YYYY-MM-DD") : "",
    },
  })

  useEffect(() => {
    reset({
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: (task?.priority as TaskFormValues["priority"]) ?? "Low",
      dueDate: task?.dueDate ? dayjs(task.dueDate as any).format("YYYY-MM-DD") : "",
    })
  }, [task, reset])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        priorityMenuRef.current &&
        !priorityMenuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  const onValidSubmit = (data: TaskFormValues) => {
    const nextId = crypto.randomUUID()

    const nextTask: TaskRecord = {
      id: nextId,
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: dayjs(data.dueDate),
      status: task.status,
      subtasks: task.subtasks ?? [],
      tags: task.tags ?? [],
    }

    console.log(nextTask)
    dispatch({ type: TASK_CREATE_REQUESTED, payload: nextTask })
    onSubmit?.(nextTask)
    handleCloseDialog()
    reset()
  }

  const handleCloseDialog = () => {
    const dialog = document.getElementById(
      "inputDialog"
    ) as HTMLDialogElement | null
    if (dialog) dialog.close()
  }

  return (
    <dialog
      id="inputDialog"
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

        {/* ── Description ── */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="description"
            className="text-sm font-semibold text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="Add details about this task..."
            aria-invalid={!!errors.description}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
            className={`w-full px-3 py-2 text-sm text-gray-900 border rounded-lg resize-none transition-colors focus:outline-none focus:ring-2 focus:border-transparent ${errors.description
              ? "border-red-400 bg-red-50 focus:ring-red-400"
              : "border-gray-300 focus:ring-blue-500"
              }`}
            {...register("description")}
          />
          {errors.description && (
            <p
              id="description-error"
              role="alert"
              className="flex items-center gap-1 text-xs text-red-600"
            >
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.description.message}
            </p>
          )}
        </div>

        {/* ── Priority ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Priority
          </label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <div className="relative" ref={priorityMenuRef}>
                <DropdownMenuPrimitive.Root
                  open={isOpen}
                  onOpenChange={setIsOpen}
                >
                  <DropdownMenuPrimitive.Trigger
                    asChild
                    className={`min-w-40 border ${errors.priority
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white"
                      }`}
                  >
                    <Button
                      type="button"
                      variant="secondary"
                      size="lg"
                      className="flex justify-between w-full"
                      aria-invalid={!!errors.priority}
                    >
                      <span
                        className={
                          !field.value
                            ? "text-gray-500"
                            : "text-gray-900"
                        }
                      >
                        {field.value || "Select priority"}
                      </span>
                      <ChevronRight
                        className={`h-4 w-4 ml-2 transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"
                          }`}
                      />
                    </Button>
                  </DropdownMenuPrimitive.Trigger>

                  <DropdownMenuPrimitive.Content
                    style={{
                      width: "var(--radix-dropdown-menu-trigger-width)",
                    }}
                    className="z-50 mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg p-1"
                  >
                    {(["Low", "Medium", "High"] as const).map((level) => (
                      <DropdownMenuPrimitive.Item
                        key={level}
                        className="w-full rounded-md px-3 py-2 text-left text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
                        onSelect={() => {
                          field.onChange(level)
                          setIsOpen(false)
                        }}
                      >
                        {level}
                      </DropdownMenuPrimitive.Item>
                    ))}
                  </DropdownMenuPrimitive.Content>
                </DropdownMenuPrimitive.Root>
              </div>
            )}
          />
          {errors.priority && (
            <p
              role="alert"
              className="flex items-center gap-1 text-xs text-red-600"
            >
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.priority.message}
            </p>
          )}
        </div>

        {/* ── Due Date ── */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="dueDate"
            className="text-sm font-semibold text-gray-700"
          >
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            aria-invalid={!!errors.dueDate}
            aria-describedby={errors.dueDate ? "dueDate-error" : undefined}
            className={`w-full px-3 py-2 text-sm text-gray-900 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:border-transparent ${errors.dueDate
              ? "border-red-400 bg-red-50 focus:ring-red-400"
              : "border-gray-300 focus:ring-blue-500"
              }`}
            {...register("dueDate")}
          />
          {errors.dueDate && (
            <p
              id="dueDate-error"
              role="alert"
              className="flex items-center gap-1 text-xs text-red-600"
            >
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.dueDate.message}
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

