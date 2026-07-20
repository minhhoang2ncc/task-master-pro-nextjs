// src/modules/dashboard/components/TaskDistributionChart.tsx
import { Label, Pie, PieChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/components/chart"
import type { ChartConfig } from "@/shared/components/chart"

const chartData = [
  { category: "technical", value: 45, fill: "var(--color-technical)" },
  { category: "meetings", value: 30, fill: "var(--color-meetings)" },
  { category: "personal", value: 25, fill: "var(--color-personal)" },
]

const chartConfig = {
  technical: { label: "Technical", color: "#4f46e5" }, // Indigo
  meetings: { label: "Meetings", color: "#f97316" }, // Orange
  personal: { label: "Personal", color: "#22c55e" }, // Green
} satisfies ChartConfig

export function TaskDistributionChart() {
  return (
    <Card className="w-full flex flex-col shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-bold text-foreground">Work Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              innerRadius={65}
              outerRadius={90}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-bold">
                          128
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-slate-500 text-sm">
                          Total
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Custom Legend to match your image exactly */}
        <div className="mt-4 flex flex-col gap-3 pb-6">
          {Object.entries(chartConfig).map(([key, config]) => {
            const dataPoint = chartData.find((d) => d.category === key)
            return (
              <div key={key} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: config.color }} />
                  <span className="text-foreground">{config.label}</span>
                </div>
                <span className="font-bold text-foreground">{dataPoint?.value}%</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}