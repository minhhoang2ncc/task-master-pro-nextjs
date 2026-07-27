import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/libs/ui/components/src/shadcn/card"
import { Task } from "./task"

import { ListFilter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/libs/ui/components/src/shadcn/button"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { useState, useMemo } from "react"

export function TaskList({ filter = "all" }: { filter?: string }) {
  const taskList = useSelector((state: RootState) => state.tasks) || []
  const maxTasksToShow = 5
  const filteredTasks = useMemo(() => {
    return taskList.filter(task => {
      if (filter === 'completed') return task.status === 'completed'
      if (filter === 'pending') return task.status === 'pending'
      return true
    })
  }, [taskList, filter])
  const [viewAll, setViewAll] = useState(false)
  const taskToDisplay = viewAll ? filteredTasks : filteredTasks.slice(0, maxTasksToShow)

  return (
    <Card className="w-full h-fit mt-4 mb-4">
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
            <Task key={index} id={task.id} Title={task.title} Priority={task.priority} DueDate={task.dueDate} status={task.status} />
          )
        })}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground flex justify-center">
        <Button variant="link" size="lg" onClick={() => setViewAll(!viewAll)}>
          {viewAll ? 'View Less' : 'View All Tasks'}
        </Button>
      </CardFooter>
    </Card>
  )
}
