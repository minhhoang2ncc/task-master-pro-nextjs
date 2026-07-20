import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/card"
import { Globe, ChevronRight, Lock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/dropdown-menu"
import { useState } from "react"
import { Button } from "@/shared/components/button"
import type { AppLanguage, LanguageSettings } from "@/shared/type"

export function LanguageSecurity({
    settings,
    onChange,
}: {
    settings: LanguageSettings
    onChange: (language: AppLanguage) => void
}) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Globe className="w-6 h-6 text-primary" />
                    <CardTitle className="text-xl font-semibold">Language & Security</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                    Language Display
                </p>
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild className="w-full">
                        <Button variant="outline" size="lg" className="flex justify-between w-full">
                            <span className="ml-2"> {settings.language}</span>
                            <ChevronRight className={`h-4 w-4 ml-2 transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                        <DropdownMenuItem onClick={() => onChange("English")}>
                            English
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onChange("Spanish")}>
                            Spanish
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onChange("Vietnamese")}>
                            Vietnamese
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center gap-2 mt-4">
                    <Lock className="w-4 h-4 text-primary" />
                    <Button variant="link" className="text-sm text-primary font-bold">
                        Change Password
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}