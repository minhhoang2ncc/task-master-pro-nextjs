import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/card"
import { Progress } from "@/shared/components/progress"
import { CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { CARD_LAYOUTS, PROGRESS_BAR, TEXT_SIZES } from "@/shared/styles/tailwind-classes";
import { cn } from "@/shared/lib/utils"
import { SummaryCard } from "./summary-card";
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
export function SummaryTabs() {
    const taskList = useSelector((state: RootState) => state.tasks)
    const numPrioTasks = taskList.filter(task => task.priority.toLowerCase() === 'high' && task.status !== 'completed').length
    const avgTime = taskList.reduce((sum, task) => sum + (task.dueDate ? 1 : 0), 0) / Math.max(taskList.length, 1);
    const completionRate = taskList.length ? Math.round((taskList.filter(task => task.status === 'completed').length / taskList.length) * 100) : 0;

    const summaryList = [
        {
            title: "Priority Task",
            value: numPrioTasks,
            icon: 
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
        },
        {
            title: "Average Time",
            value: avgTime,
            icon:
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                <Clock className="w-5 h-5 text-blue-600" />
            </div> 
        }
    ]
    return (
        <div className="grid grid-cols-3 gap-3 w-full h-fit justify-evenly">
            <Card className={cn(CARD_LAYOUTS.highlighted, 'dark:bg-yellow-400')}>
            
                <CheckCircle2 
                className="absolute -right-6 -top-4 w-24 h-24 opacity-10 text-white" 
                strokeWidth={2}
                />
                
                <CardHeader className={CARD_LAYOUTS.header}>
                    <CardTitle className={cn(CARD_LAYOUTS.title, 'text-white')}>
                        Completion Rate
                    </CardTitle>
                </CardHeader>

                <CardContent className={cn(CARD_LAYOUTS.content, TEXT_SIZES.card_title_default)}>
                    <div className="">
                        {completionRate}%
                    </div>
                    
                    <Progress 
                        value={completionRate}
                        indicatorClassName="bg-white"
                        className={PROGRESS_BAR.default} 
                    />
                </CardContent>
            </Card>
            {summaryList.map((summary, index) => (
                <SummaryCard key={index} title={summary.title} value={summary.value} icon={summary.icon} />
            ))}
        </div>
    )
}