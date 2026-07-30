"use no memo"
import { useEffect, useRef, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import { AlertCircle, Plus, X } from "lucide-react"

// Shadcn UI Imports
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui"
import { Badge } from "@repo/ui"
import { Input } from "@repo/ui"
import { Textarea } from "@repo/ui"
import { Label } from "@repo/ui"
import { Button } from "@repo/ui"

import { useDispatch } from "react-redux"
import { TASK_DELETE_REQUESTED } from "@/redux/saga/taskSaga"
import { useRouter } from "next/navigation"
import type { TaskRecord } from "@repo/types"
import type { AppDispatch } from "@/redux/store"
import { taskSchema, type TaskFormValues } from "@repo/types/schemas"

// ─── Constants ────────────────────────────────────────────────────────────────

const TAG_LIST = [
  { name: "UI", color: "bg-blue-500" },
  { name: "Backend", color: "bg-green-500" },
  { name: "API", color: "bg-purple-500" },
  { name: "Database", color: "bg-yellow-500" },
  { name: "Testing", color: "bg-red-500" },
  { name: "Deployment", color: "bg-indigo-500" },
  { name: "Design", color: "bg-pink-500" },
  { name: "Research", color: "bg-teal-500" },
  { name: "Documentation", color: "bg-orange-500" },
  { name: "Performance", color: "bg-cyan-500" },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function Detail({
  task,
  modifyRegister,
  deleteRegister,
}: {
  task: TaskRecord | undefined
  modifyRegister?: (getter: () => TaskRecord | undefined) => void
  deleteRegister?: (handler: () => void) => void
}) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const [tags, setTags] = useState<{ name: string; color: string }[]>(task?.tags ?? [])
  const tagsRef = useRef(tags)
  tagsRef.current = tags

  const {
    register,
    control,
    getValues,
    trigger,
    watch,
    formState: { errors },
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

  // Keep the priority badge in the card header in sync with form state
  const watchedPriority = watch("priority")

  useEffect(() => {
    if (!modifyRegister) return
    modifyRegister(() => {
      if (!task) return undefined
      trigger()
      const values = getValues()
      const validationResult = taskSchema.safeParse(values)
      if (!validationResult.success) {
        return undefined
      }
      return {
        ...task,
        title: values.title,
        description: values.description,
        priority: values.priority,
        dueDate: dayjs(values.dueDate),
        tags: tagsRef.current,
      }
    })
  }, [modifyRegister, task, getValues, trigger])

  useEffect(() => {
    if (!deleteRegister) return
    deleteRegister(() => {
      if (!task) return
      dispatch({ type: TASK_DELETE_REQUESTED, payload: task })
      router.push("/dashboard")
    })
  }, [])

  const handleTagToggle = (tag: { name: string; color: string }) => {
    setTags((prev) =>
      prev.some((t) => t.name === tag.name)
        ? prev.filter((t) => t.name !== tag.name)
        : [...prev, tag]
    )
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4 mb-6">
        <CardTitle className="text-xl font-bold text-foreground">Update Task</CardTitle>
        <Badge
          variant="secondary"
          className={
            watchedPriority === "High"
              ? "bg-red-100 text-red-700 hover:bg-red-100"
              : watchedPriority === "Medium"
                ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                : "bg-green-100 text-green-700 hover:bg-green-100"
          }
        >
          {watchedPriority || "Unassigned"}
        </Badge>
      </CardHeader>

      {/* noValidate: Zod + RHF owns all validation feedback */}
      <CardContent>
        <form
          noValidate
          onSubmit={(e) => e.preventDefault()}
          className="space-y-6"
          aria-label="Edit task form"
        >
          {/* ── Title ── */}
          <div className="space-y-1.5">
            <Label htmlFor="detail-title">Title</Label>
            <Input
              id="detail-title"
              type="text"
              placeholder="Enter task title"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "detail-title-error" : undefined}
              className={errors.title ? "border-red-400 bg-red-50 focus-visible:ring-red-400" : ""}
              {...register("title")}
            />
            {errors.title && (
              <p id="detail-title-error" role="alert" className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* ── Description ── */}
          <div className="space-y-1.5">
            <Label htmlFor="detail-description">Description</Label>
            <Textarea
              id="detail-description"
              placeholder="Provide details about this task..."
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "detail-description-error" : undefined}
              className={`resize-none h-24 ${errors.description ? "border-red-400 bg-red-50 focus-visible:ring-red-400" : ""}`}
              {...register("description")}
            />
            {errors.description && (
              <p id="detail-description-error" role="alert" className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* ── Due Date + Priority (2-col grid) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Due Date */}
            <div className="space-y-1.5">
              <Label htmlFor="detail-dueDate">Due Date</Label>
              <Input
                id="detail-dueDate"
                type="date"
                aria-invalid={!!errors.dueDate}
                aria-describedby={errors.dueDate ? "detail-dueDate-error" : undefined}
                className={errors.dueDate ? "border-red-400 bg-red-50 focus-visible:ring-red-400" : ""}
                {...register("dueDate")}
              />
              {errors.dueDate && (
                <p id="detail-dueDate-error" role="alert" className="flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.dueDate.message}
                </p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      aria-invalid={!!errors.priority}
                      className={errors.priority ? "border-red-400 bg-red-50" : ""}
                    >
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && (
                <p role="alert" className="flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          {/* ── Tags ── */}
          <div className="space-y-3 pt-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={`${tag.name}-${index}`}
                  variant="secondary"
                  className={`${tag.color} text-white flex items-center gap-1 pr-1`}
                >
                  {tag.name}
                  <div
                    className="hover:bg-black/20 rounded-full p-0.5 cursor-pointer transition-colors"
                    onClick={() => handleTagToggle(tag)}
                  >
                    <X className="w-3 h-3" />
                  </div>
                </Badge>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 border-dashed gap-1 text-xs">
                    <Plus className="w-3 h-3" /> Add Tag
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {TAG_LIST.filter((tag) => !tags.some((t) => t.name === tag.name)).map((tag) => (
                    <DropdownMenuItem
                      key={tag.name}
                      onClick={() => handleTagToggle(tag)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${tag.color}`} />
                      {tag.name}
                    </DropdownMenuItem>
                  ))}
                  {tags.length === TAG_LIST.length && (
                    <div className="p-2 text-xs text-muted-foreground text-center">All tags added</div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
