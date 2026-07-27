import { useState } from "react"
import { Checkbox } from "@/libs/ui/components/src/shadcn/checkbox"
import { Badge } from "@/libs/ui/components/src/shadcn/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/libs/ui/components/src/shadcn/avatar"
import { Calendar, CheckCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { BADGE, PRIORITY } from "@/shared/styles/tailwind-classes"
import { useDispatch, useSelector } from "react-redux"
import { modify } from '@/redux/slices/taskSlice';
import type { RootState } from "@/redux/store"
import type { Dayjs } from "dayjs"
import dayjs from "dayjs"

export function Task({ id, Title, Priority, DueDate, status }: { id: string | number; Title: string; Priority: string; DueDate: Dayjs; status: string }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const fullTask = useSelector((state: RootState) => state.tasks.find((t) => t.id === id))
  const [isHighlighted, setIsHighlighted] = useState(false)
  const isCompleted = status === 'completed'

  const handleTaskClick = () => {
    router.push(`/task/${id}`)
  }

  const handleCheckboxClick = (checked: boolean) => {
    if (!fullTask) return
    dispatch(modify({
      ...fullTask,
      status: checked ? 'completed' : 'pending'
    }))
  }

  return (
    <div className={`flex items-center gap-4 p-5 border-b last:border-b relative transition-colors ${isHighlighted ? "border-l-2 border-l-indigo-500 dark:border-l-yellow-400" : ""
      }`} onMouseEnter={() => setIsHighlighted(true)} onMouseLeave={() => setIsHighlighted(false)}>

      <Checkbox
        checked={isCompleted}
        onCheckedChange={handleCheckboxClick}
        className={`h-5 w-5 rounded border-slate-300 ${isCompleted ? "data-[state=checked]:bg-indigo-400 data-[state=checked]:border-indigo-400" : ""}`}
      />

      <section className="flex flex-col gap-1.5 flex-1 cursor-pointer" onClick={handleTaskClick}>
        <span className={`text-base dark:text-white font-medium ${isCompleted ? "text-slate-400 line-through" : "text-slate-900"}`}>
          {Title}
        </span>

        <div className="flex items-center gap-3">
          {/* Dynamic Badge Colors */}
          {!isCompleted && (
            <Badge
              variant="secondary"
              className={` ${BADGE.default} 
                      ${Priority.toLowerCase() === 'high' ? PRIORITY.high : ''}
                      ${Priority.toLowerCase() === 'medium' ? PRIORITY.medium : ''}
                      ${Priority.toLowerCase() === 'low' ? PRIORITY.low : ''}
                    `}
            >
              {Priority}
            </Badge>
          )}

          {/* Completed state badge override */}
          {isCompleted && (
            <Badge variant="secondary" className={`${BADGE.default} ${BADGE.checked_mode}`}>
              {Priority}
            </Badge>
          )}

          <div className="flex items-center text-sm text-slate-500 gap-1">
            {isCompleted ? <CheckCheck className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
            <span>{dayjs(DueDate).format("MMM D, YYYY")}</span>
          </div>
        </div>
      </section>

      {!isCompleted && (
        <Avatar className="h-8 w-8 ml-auto border">
          <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${id}`} alt="Assignee" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
