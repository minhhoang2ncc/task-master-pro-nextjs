import { TEXT_SIZES } from "@/shared/styles/tailwind-classes";
import { cn } from "@repo/utils"

export function TitleContent({ name, numTask }: { name: string; numTask: number }) {
  return (
    <div>
      <h1 className={cn(TEXT_SIZES.card_title_default, 'text-foreground')}>Welcome, {name}</h1>
      <h2 className={cn(TEXT_SIZES.title_secondary, 'text-muted-foreground')}>You have {numTask} tasks to complete</h2>
    </div>
  )
}
