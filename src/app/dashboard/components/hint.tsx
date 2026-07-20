import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/card";
import { Lightbulb } from "lucide-react";
export function Hint(){
    return (
        <>
            <div className="relative">
                <Card className='bg-hint-background dark:bg-slate-800 dark:text-white'>
                    <CardHeader className="ml-4">
                        <CardTitle className="font-bold">Hint to Improve Productivity</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                        Try using the Pomodoro Technique: work for 25 minutes, then take a 5-minute break. This can help maintain focus and prevent burnout.
                    </CardContent>
                </Card>
                
            </div>
        </>
    )
}