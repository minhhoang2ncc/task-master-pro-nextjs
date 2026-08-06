import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@repo/ui"
import { Task } from "./task"
import { ListFilter, SlidersHorizontal, PlusCircle } from "lucide-react"
import { Button } from "@repo/ui"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/redux/store"
import { useState, useMemo } from "react"
import { TASK_SAVE_REQUESTED } from "@/redux/saga/taskSaga"
import { modify } from "@/redux/slices/taskSlice"
import type { TaskRecord, Status } from "@repo/types"



export function TaskList({ filter = "all" }: { filter?: string }) {
  const taskList = useSelector((state: RootState) => state.tasks) || []
  const maxTasksToShow = 5
  const dispatch = useDispatch()

  const filteredTasks = useMemo(() => {
    return taskList.filter(task => {
      if (filter === 'all') return true
      return task.status === filter
    })
  }, [taskList, filter])

  const [viewAll, setViewAll] = useState(false)

  const [dragCounter, setDragCounter] = useState(0)

  const taskToDisplay = viewAll ? filteredTasks : filteredTasks.slice(0, maxTasksToShow)

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
            <div><ListFilter className="w-4 h-4" /></div>
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
