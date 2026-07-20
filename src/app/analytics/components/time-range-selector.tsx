import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import { Calendar, ChevronRight } from "lucide-react"
import { Button } from "@/shared/components/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/shared/components/dropdown-menu"


interface TimeRangeSelectorProps {
  timeRange: string;
  setTimeRange: Dispatch<SetStateAction<string>>;
}

export function TimeRangeSelector({ timeRange, setTimeRange }: TimeRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild className="min-w-40 bg-white border-[1px] border-gray-300">
        <Button variant="secondary" size="lg">
          <Calendar className="h-4 w-4" />
          <span className="ml-2">Past {timeRange}</span>
          <ChevronRight className={`h-4 w-4 ml-2 transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent >
        <DropdownMenuItem onClick={() => setTimeRange("day")}>
          Past Day
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTimeRange("week")}>
          Past Week
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTimeRange("month")}>
          Past Month
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
