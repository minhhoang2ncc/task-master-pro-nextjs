import { TitleBar } from "@/libs/ui/components/src/titlebar";
import { Skeleton } from "@repo/ui";
import { Card, CardContent } from "@repo/ui";

export default function DashboardLoading() {
  return (
    <section className="animate-in fade-in duration-300">
      <TitleBar>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-48 rounded-md" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
      </TitleBar>

      <div className="flex flex-col gap-6 p-4 w-full h-fit">
        {/* Summary Tabs Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-border/60 shadow-sm">
              <CardContent className="p-6 flex justify-between items-center">
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-8 w-12 rounded" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Task List Card Skeleton */}
        <Card className="border-border/60 shadow-sm">
          <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-24 rounded" />
              <Skeleton className="h-5 w-8 rounded-full" />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Skeleton className="h-9 w-64 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
          <CardContent className="p-6 flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-card">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-5 w-5 rounded" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-48 rounded" />
                    <Skeleton className="h-3 w-32 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
