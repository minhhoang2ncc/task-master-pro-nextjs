import { Tab } from "./tab"
import { ClipboardList, CircleCheck, AlarmClockOff, TrendingUp } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
export function SummaryTabs() {
  const taskList = useSelector((state: RootState) => state.tasks) || []

  const summaryList = [
    {
      title: "Total Tasks",
      value: taskList.length,
      icon: <ClipboardList className="w-8 h-8 mb-6 text-blue-500 bg-blue-200 p-1 rounded-md" />,
      previousValue: 100, // Replace with actual previous value
      color: "blue"
    },
    {
      title: "Completed Tasks",
      value: taskList.filter(task => task.status === 'completed').length,
      icon: <CircleCheck className="w-8 h-8 mb-6 text-green-500 bg-green-200 p-1 rounded-md" />,
      previousValue: 80, // Replace with actual previous value
      color: "green"
    },
    {
      title: "Overdue Tasks",
      value: 12, // Replace with actual value
      icon: <AlarmClockOff className="w-8 h-8 mb-6 text-red-500 bg-red-200 p-1 rounded-md" />,
      previousValue: 15, // Replace with actual previous value
      color: "red"
    },
    {
      title: "Completion Rate",
      value: 75, // Replace with actual value
      icon: <TrendingUp className="w-8 h-8 mb-6 text-purple-500 bg-purple-200 p-1 rounded-md" />,
      previousValue: 70, // Replace with actual previous value
      color: "purple"
    }
  ]


  return (
    <div className="grid grid-cols-4 gap-3 w-full h-fit justify-evenly">
      {summaryList.map((summary, index) => (
        <Tab key={index} content={summary} />
      ))}
    </div>
  )
}
