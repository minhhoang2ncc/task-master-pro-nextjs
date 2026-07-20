import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/table"
import { Avatar, AvatarFallback } from "@/shared/components/avatar"
import { Progress } from "@/shared/components/progress"
import { Badge } from "@/shared/components/badge"
import { Button } from "@/shared/components/button"
import { MoreVertical } from "lucide-react"

// Mock data with translated English text
const projects = [
  {
    id: "1",
    initials: "FE",
    title: "E-commerce Website",
    team: "Team Frontend",
    progressValue: 75, // (34/45 is roughly 75%)
    completedText: "34/45",
    status: "ON TIME",
    avatarBg: "bg-blue-100 text-blue-700",
  },
  {
    id: "2",
    initials: "UX",
    title: "Mobile App Optimization",
    team: "Team Product",
    progressValue: 40, // (12/30 is 40%)
    completedText: "12/30",
    status: "DELAYED",
    avatarBg: "bg-purple-100 text-purple-700",
  },
  {
    id: "3",
    initials: "AI",
    title: "Smart Chatbot",
    team: "R&D Lab",
    progressValue: 90, // (45/50 is 90%)
    completedText: "45/50",
    status: "ON TIME",
    avatarBg: "bg-indigo-100 text-indigo-700",
  },
]

export function ProjectPerformanceTable() {
  return (
    <Card className="w-full shadow-sm p-0 gap-0">
      {/* Header section with the title and "See all" button */}
      <CardHeader className="flex flex-row items-center justify-between py-5 border-b bg-background border-slate-200 dark:border-slate-800">
        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Project Performance</CardTitle>
        <Button variant="link" className="text-indigo-600 dark:text-yellow-400 font-semibold p-0 h-auto">
          See all
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <Table className="m-0">
          <TableHeader className="bg-background dark:bg-slate-900/20">
            <TableRow className="border-b border-slate-200 dark:border-slate-800">
              <TableHead className="px-4 py-5 font-semibold text-slate-600 dark:text-slate-400">PROJECT NAME</TableHead>
              <TableHead className="px-4 py-5 font-semibold text-slate-600 dark:text-slate-400">PROGRESS</TableHead>
              <TableHead className="px-4 py-5 font-semibold text-slate-600 dark:text-slate-400">COMPLETED</TableHead>
              <TableHead className="px-4 py-5 font-semibold text-slate-600 dark:text-slate-400">STATUS</TableHead>
              <TableHead className="px-4 py-5 text-right font-semibold text-slate-600 dark:text-slate-400">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                {/* Project Name & Avatar Column */}
                <TableCell className="py-5 px-4">
                  <div className="flex items-center gap-3">
                    {/* Note: Using rounded-md on Avatar to make it square like your image */}
                    <Avatar className={`h-10 w-10 rounded-md flex-shrink-0 ${project.avatarBg}`}>
                      <AvatarFallback className="rounded-md font-bold text-sm bg-transparent">
                        {project.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">{project.title}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{project.team}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Progress Bar Column */}
                <TableCell className="px-4 py-5">
                  <div className="flex items-center">
                    <Progress 
                      value={project.progressValue} 
                      className="h-2 w-24 bg-slate-200 dark:bg-slate-700" 
                      indicatorClassName="bg-primary dark:bg-yellow-400"
                    />
                  </div>
                </TableCell>

                {/* Completed Fraction Column */}
                <TableCell className="px-4 py-5">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">{project.completedText}</span>
                </TableCell>

                {/* Status Badge Column */}
                <TableCell className="px-4 py-5">
                  <Badge 
                    variant="secondary" 
                    className={`font-semibold rounded-sm px-2.5 py-1 text-xs
                      ${project.status === 'ON TIME' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30' : ''}
                      ${project.status === 'DELAYED' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30' : ''}
                    `}
                  >
                    {project.status}
                  </Badge>
                </TableCell>

                {/* Action Menu Column */}
                <TableCell className="px-4 py-5 text-right">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 h-auto p-1">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}