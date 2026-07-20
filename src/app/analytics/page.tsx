"use client"

import { TitleBar } from "@/shared/layouts/titlebar";
import { TitleContent } from "./components/title-content";
import { SummaryTabs } from "./components/summary-tabs";
import { WeeklyProductivityChart } from "./components/productivity-chart";
import { TaskDistributionChart } from "./components/distribution-chart";
import { ProjectPerformanceTable } from "./components/performance-table";

import { useState, useEffect } from "react";

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <section>
      <TitleBar>
        <TitleContent />
      </TitleBar>
      <div className="m-4">
        <SummaryTabs />
      </div>
      <div className="grid grid-cols-2 gap-4 p-4 w-full h-fit">
        <WeeklyProductivityChart />
        <TaskDistributionChart />
      </div>
      <div className="m-4">
        <ProjectPerformanceTable />
      </div>
    </section>
  )
}
