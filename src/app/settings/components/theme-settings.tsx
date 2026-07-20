import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/card"
import { Button } from "@/shared/components/button"
import { useTheme } from "@/app/providers"
import { Sun, Moon, CheckCircle, Palette } from "lucide-react"
import { cn } from "@/shared/lib/utils"

export function ThemeSettings() {
    const { theme, setTheme } = useTheme()

    return (
        <Card className="w-full h-full flex flex-col gap-0">
            <CardHeader className="flex items-center gap-2">
                <Palette className="w-6 h-6 mr-2 text-primary" />
                <CardTitle className="text-xl">Theme Setting</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 flex-1 p-10">
                <Button 
                    onClick={() => setTheme("light")}
                    className={cn('w-full flex-1 rounded-[8px]', {
                        'bg-secondary border-2 border-primary text-foreground hover:bg-indigo-400': theme === "light",
                        'bg-primary text-background hover:bg-indigo-400': theme !== "light"
                    })}
                >
                    <Sun className="w-4 h-4 mr-2" />
                    Light Mode
                    <CheckCircle className={`w-4 h-4 ml-2 ${theme === "light" ? "opacity-100" : "opacity-0"}`} />
                </Button>
                <Button 
                    onClick={() => setTheme("dark")}
                    className={cn('w-full flex-1 rounded-[8px]', {
                        'bg-slate-700 text-white hover:bg-slate-800 border-2 border-foreground': theme === "dark",
                        'bg-tabs-background text-black hover:bg-slate-600': theme !== "dark"
                    })}
                >
                    <Moon className="w-4 h-4 mr-2" />
                    Dark Mode
                    <CheckCircle className={`w-4 h-4 ml-2 ${theme === "dark" ? "opacity-100" : "opacity-0"}`} />
                </Button>
            </CardContent>
        </Card>
    )
}