import { Tabs, TabsList, TabsTrigger } from "@/shared/components/tabs"
import { TABS_LAYOUT, TEXT_SIZES } from "@/shared/styles/tailwind-classes";
import { cn } from "@/shared/lib/utils"

export function TitleContent({ name, numTask, taskFilter, setTaskFilter }: { name: string; numTask: number; taskFilter: string; setTaskFilter: (value: string) => void }) {
    return (
        <>
            <div>
                <h1 className={cn(TEXT_SIZES.card_title_default, 'text-foreground')}>Welcome, {name}</h1>
                <h2 className={cn(TEXT_SIZES.title_secondary, 'text-muted-foreground')}>You have {numTask} tasks to complete</h2>
            </div>
            <Tabs value={taskFilter} onValueChange={setTaskFilter}>
                <TabsList className={TABS_LAYOUT.default}>
                    <TabsTrigger value="all" className={TABS_LAYOUT.trigger}>All</TabsTrigger>
                    <TabsTrigger value="pending" className={TABS_LAYOUT.trigger}>In Progress</TabsTrigger>
                    <TabsTrigger value="completed" className={TABS_LAYOUT.trigger}>Completed</TabsTrigger>
                </TabsList>
            </Tabs>
        </>
    )
}