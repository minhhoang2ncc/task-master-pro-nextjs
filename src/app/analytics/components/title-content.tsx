import { TimeRangeSelector } from "./time-range-selector";
import { Button } from "@/libs/ui/components/src/shadcn/button";
import { TEXT_SIZES } from "@/shared/styles/tailwind-classes";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";

export function TitleContent() {
  const [timeRange, setTimeRange] = useState("week");
  return (
    <>
      <div>
        <h1 className={`${TEXT_SIZES.card_title_default}`}>Report & Statistics</h1>
        <h2 className={`${TEXT_SIZES.title_secondary} text-muted-foreground`}>Analyze your task performance for the past {timeRange}</h2>
      </div>
      <div className="flex items-center gap-2">
        <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
        <Button variant="default" size="lg">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
    </>
  )
}
