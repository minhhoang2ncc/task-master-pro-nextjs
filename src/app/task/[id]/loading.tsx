import { Skeleton } from "@/shared/components/skeleton";
import { Card } from "@/shared/components/card";
import { ChevronRight } from "lucide-react";

export default function TaskDetailLoading() {
  return (
    <section className="mx-auto max-w-6xl px-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-1 text-muted-foreground m-4">
        <p className="text-sm">My Task</p>
        <ChevronRight className="w-4 h-4 inline-block" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4 m-4">
        <div className="flex flex-col gap-4">
          {/* Detail Card Skeleton */}
          <Card className="border-border/60 shadow-sm p-6 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="h-8 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/4 rounded" />
              </div>
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </Card>

          {/* Subtasks Card Skeleton */}
          <Card className="border-border/60 shadow-sm p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-9 w-32 rounded-lg" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/40">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-48 rounded" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          {/* Action Card Skeleton */}
          <Card className="border-border/60 shadow-sm p-6 flex flex-col gap-4">
            <Skeleton className="h-6 w-28 rounded" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <div className="pt-2">
              <Skeleton className="h-3 w-36 rounded" />
            </div>
          </Card>

          {/* Progress Card Skeleton */}
          <Card className="border-border/60 shadow-sm p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-24 rounded" />
              <Skeleton className="h-6 w-12 rounded" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-4 w-40 rounded mt-1" />
          </Card>
        </div>
      </div>
    </section>
  );
}
