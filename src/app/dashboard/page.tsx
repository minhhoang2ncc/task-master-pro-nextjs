"use client"

import { TitleBar } from "@/libs/ui/components/src/titlebar"
import { SummaryTabs } from "./components/summary-tabs"
import { TaskList } from "./components/task-list"
import { TitleContent } from "./components/title-content"
import { Hint } from "./components/hint"
import { Button } from "@/libs/ui/components/src/shadcn/button"
import { Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const user = useSelector((state: RootState) => state.user)
  const tasks = useSelector((state: RootState) => state.tasks)
  const [taskFilter, setTaskFilter] = useState<string>("all")

  if (!mounted) {
    return null
  }

  return (
    <section>
      <TitleBar>
        <TitleContent name={user.displayName || "Assignee"} numTask={tasks.length} taskFilter={taskFilter} setTaskFilter={setTaskFilter} />
      </TitleBar>
      <div className="flex flex-col gap-4 p-4 w-full h-fit">
        <SummaryTabs />
        <TaskList filter={taskFilter} />
        <Hint />
      </div>

      <Button
        size="icon"
        onClick={() => (document.getElementById('inputDialog') as HTMLDialogElement)?.showModal()}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-indigo-700 hover:bg-indigo-800 shadow-lg cursor-pointer z-50"
      >
        <Plus className="w-8 h-8 text-white" strokeWidth={3} />
      </Button>
    </section>
  )
}
