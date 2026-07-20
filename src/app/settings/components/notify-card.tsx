import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/card"
import { Bell } from "lucide-react"
import { Switch } from "@/shared/components/switch"
import { Label } from "@/shared/components/label"
import type { NotificationSettings } from "@/shared/type"

export function NotifyCard({
    settings,
    onChange,
}: {
    settings: NotificationSettings
    onChange: (field: keyof NotificationSettings, value: boolean) => void
}) {
    const notificationSettings = [
        {
            name: "Browser Notifications",
            description: "Get notified on your Desktop"
            ,
            field: "browserNotifications" as const,
        },
        {
            name: "Email Notifications",
            description: "Receive updates via email"
            ,
            field: "emailNotifications" as const,
        }
    ]
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Bell className="w-6 h-6 text-primary" />
                    <CardTitle className="text-xl font-semibold">Notification</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                {notificationSettings.map((setting) => {
                    const switchId = `notification-${setting.field}`

                    return (
                        <div key={setting.name} className="flex items-center justify-between gap-4 mb-4 last:mb-0">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor={switchId} className="text-lg font-medium cursor-pointer">
                                    {setting.name}
                                </Label>
                                <span className="text-sm text-muted-foreground">
                                    {setting.description}
                                </span>
                            </div>

                            <Switch
                                id={switchId}
                                size="lg"
                                checked={settings[setting.field]}
                                onCheckedChange={(checked) => onChange(setting.field, checked)}
                            />

                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}