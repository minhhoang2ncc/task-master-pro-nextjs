import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/chart"

import type { ChartConfig } from "@/shared/components/chart"
const chartData = [
  { day: "Mon", newTasks: 30, completed: 20 },
  { day: "Tue", newTasks: 45, completed: 25 },
  { day: "Wed", newTasks: 25, completed: 20 },
  { day: "Thu", newTasks: 60, completed: 40 },
  { day: "Fri", newTasks: 40, completed: 35 },
  { day: "Sat", newTasks: 75, completed: 50 },
  { day: "Sun", newTasks: 55, completed: 45 },
]

const chartConfig = {
  newTasks: {
    label: "New Tasks",
    color: "#4f46e5", // Indigo-600
  },
  completed: {
    label: "Completed",
    color: "#22c55e", // Green-500
  },
} satisfies ChartConfig

export function WeeklyProductivityChart() {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <CardTitle className="text-xl font-bold text-foreground">Weekly Productivity</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
              className="text-slate-500 text-sm"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} verticalAlign="top" align="right" wrapperStyle={{ top: -70, right: -120 }} />

            <Line
              dataKey="newTasks"
              type="monotone"
              stroke="var(--color-newTasks)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--color-newTasks)" }}
              activeDot={{ r: 6 }}
            />
            <Line
              dataKey="completed"
              type="monotone"
              stroke="var(--color-completed)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--color-completed)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
