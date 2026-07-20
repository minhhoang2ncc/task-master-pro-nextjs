import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/card"
import { Button } from "@/shared/components/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { Save, TrashIcon, History } from "lucide-react"

export function ActionCard({ lastUpdated, onSave, onDelete }: { lastUpdated: string; onSave?: () => void; onDelete?: () => void }) {
  return (
    <Card className="flex flex-col bg-[#D3E4FE] dark:bg-background">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Actions
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <Button variant="default" className="flex-1 h-auto py-3" onClick={onSave} disabled={!onSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="destructive" className="flex-1 h-auto py-3 bg-white dark:bg-background border-red-600" onClick={onDelete} disabled={!onDelete}>
          <TrashIcon className="w-4 h-4 mr-2" />
          Delete Task
        </Button>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2 bg-[#D3E4FE] dark:bg-background pb-6">

        <div className="flex items-center text-sm text-muted-foreground">
          <History className="w-4 h-4 mr-2" />
          <span>Last updated: {lastUpdated}</span>
        </div>

        <div className="flex flex-col gap-1">

          <div className="flex items-center -space-x-3">

            <Avatar className="h-8 w-8 border-2 border-white dark:border-background">
              <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=1" alt="Follower" />
              <AvatarFallback>U1</AvatarFallback>
            </Avatar>

            <Avatar className="h-8 w-8 border-2 border-white dark:border-background">
              <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=2" alt="Follower" />
              <AvatarFallback>U2</AvatarFallback>
            </Avatar>


            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-500 text-xs font-medium text-white border-2 border-tabs-background dark:border-background z-10">
              +3
            </div>
          </div>

          <p className="text-xs italic text-muted-foreground">
            People following
          </p>
        </div>

      </CardFooter>
    </Card>
  )
}
