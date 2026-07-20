import { Card, CardContent } from "@/shared/components/card"
import { CARD_LAYOUTS, TEXT_SIZES } from "@/shared/styles/tailwind-classes"
import { cn } from "@/shared/lib/utils"

export function SummaryCard({title, value, icon}: {title: string, value: number, icon: React.ReactNode}) {
    return (
        <Card className={cn(CARD_LAYOUTS.summary)}>
            <CardContent className={cn(CARD_LAYOUTS.content, 'flex-row justify-between items-center')}>
                <div className="flex flex-col justify-start gap-4">
                    <span className={CARD_LAYOUTS.title}>{title}</span>
                    <span className={TEXT_SIZES.card_title_default}>
                        {value < 10 ? `0${value}` : value}{title == "Average Time" ? 'm' : ''}
                    </span>
                </div>
                {icon}
            </CardContent>
        </Card>
    )
}