import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@repo/ui"
import { Task } from "./task"
import { ListFilter, SlidersHorizontal, PlusCircle, ChevronDown, Check } from "lucide-react"
import { Button } from "@repo/ui"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@repo/ui"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/redux/store"
import { useState, useMemo } from "react"
import { TASK_SAVE_REQUESTED } from "@/redux/saga/taskSaga"
import type { TaskRecord, Status } from "@repo/types"

const FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "todo", label: "To Do" },
  { value: "pending", label: "In Progress" },
  { value: "completed", label: "Completed" },
]

export function TaskList() {
  const taskList = useSelector((state: RootState) => state.tasks) || []
  const maxTasksToShow = 5
  const dispatch = useDispatch()

  const [filter, setFilter] = useState<string>("all")
  const [viewAll, setViewAll] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)
  const [filterOpen, setFilterOpen] = useState(false)

  const filteredTasks = useMemo(() => {
    return taskList.filter(task => {
      if (filter === 'all') return true
      return task.status === filter
    })
  }, [taskList, filter])

  const taskToDisplay = viewAll ? filteredTasks : filteredTasks.slice(0, maxTasksToShow)

  const activeFilterLabel = FILTER_OPTIONS.find(o => o.value === filter)?.label ?? "All"

  const openTaskDialog = () => {
    const dialog = document.getElementById('inputSecondDialog') as HTMLDialogElement
    dialog?.showModal()
  }

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
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragCounter(0)

    if (filter === 'all') return

    const draggedElementId = e.dataTransfer.getData("text/plain")
    const existingTask = taskList.find((task) => String(task.id) === draggedElementId)
    if (!existingTask) return

    if (existingTask.status === filter) return

    const merged: TaskRecord = {
      ...existingTask,
      status: filter as Status,
    }
    dispatch({ type: TASK_SAVE_REQUESTED, payload: merged })
  }

  const isDraggedOver = dragCounter > 0

  return (
    <Card
      className={`w-full h-fit mt-4 mb-4 transition-all duration-200 ${isDraggedOver
        ? "bg-indigo-50 border-2 border-indigo-400 border-dashed dark:bg-indigo-950/30"
        : "bg-card border-border"
        }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* To prevent children from interfering with drag events, we can make them ignore pointer events while dragging */}
      <div className={isDraggedOver ? "pointer-events-none" : ""}>
        <CardHeader className="flex items-center justify-between p-4">
          <CardTitle className="text-lg font-semibold pl-4">Task List</CardTitle>
          <span className="flex items-center gap-2 text-muted-foreground">
            {/* Filter dropdown */}
            <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer outline-none"
                  aria-label="Filter tasks"
                >
                  <ListFilter className="w-4 h-4" />
                  <span>{activeFilterLabel}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${filterOpen ? "rotate-180" : "rotate-0"}`}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-40">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {FILTER_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => {
                      setFilter(option.value)
                      setViewAll(false)
                    }}
                    className="flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span>{option.label}</span>
                    {filter === option.value && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div><SlidersHorizontal className="w-4 h-4" /></div>
          </span>
        </CardHeader>

        <CardContent>
          {taskToDisplay.map((task, index) => {
            return (
              <Task
                key={index}
                id={task.id}
                Title={task.title}
                Priority={task.priority}
                DueDate={task.dueDate}
                status={task.status}
              />
            )
          })}
          <div className="relative flex items-center justify-center mt-2 py-2">
            <div
              className="relative flex items-center justify-center gap-2 px-4 py-1.5 bg-background rounded-md group cursor-pointer text-muted-foreground hover:text-indigo-500 transition-colors"
              onClick={openTaskDialog}
            >
              <PlusCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Insert Task</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground flex justify-center">
          <Button variant="link" size="lg" onClick={() => setViewAll(!viewAll)}>
            {viewAll ? 'View Less' : 'View All Tasks'}
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}
