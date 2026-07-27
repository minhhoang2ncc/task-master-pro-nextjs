import { TitleBar } from "@/libs/ui/components/src/titlebar";
import { Skeleton } from "@/libs/ui/components/src/shadcn/skeleton";
import { Card, CardContent } from "@/libs/ui/components/src/shadcn/card";

export default function AnalyticsLoading() {
  return (
    <section className="animate-in fade-in duration-300">
      <TitleBar>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-44 rounded-md" />
            <Skeleton className="h-4 w-60 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>
        </div>
      </TitleBar>

      <div className="m-4">
        {/* Summary Tabs Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-border/60 shadow-sm">
              <CardContent className="p-6 flex justify-between items-center">
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-8 w-16 rounded" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-full h-fit">
        {/* Charts Skeletons */}
        <Card className="border-border/60 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-8 w-24 rounded" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </Card>

        <Card className="border-border/60 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-8 w-24 rounded" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </Card>
      </div>

      <div className="m-4">
        {/* Performance Table Skeleton */}
        <Card className="border-border/60 shadow-sm p-6">
          <Skeleton className="h-6 w-56 rounded mb-6" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
