import { TitleBar } from "@/shared/layouts/titlebar";
import { Skeleton } from "@/shared/components/skeleton";
import { Card, CardContent } from "@/shared/components/card";

export default function SettingsLoading() {
  return (
    <section className="animate-in fade-in duration-300">
      <TitleBar>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-56 rounded-md" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
      </TitleBar>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 w-full h-fit">
        {/* Profile Card Skeleton (takes 2 or 3 cols) */}
        <Card className="md:col-span-3 border-border/60 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-48 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </Card>

        {/* Theme Settings Card Skeleton */}
        <Card className="border-border/60 shadow-sm p-6 flex flex-col gap-4">
          <Skeleton className="h-6 w-32 rounded" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-full h-fit">
        {/* Notify Card Skeleton */}
        <Card className="border-border/60 shadow-sm p-6 flex flex-col gap-4">
          <Skeleton className="h-6 w-40 rounded mb-2" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-border/40">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-5 w-36 rounded" />
                <Skeleton className="h-3 w-48 rounded" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          ))}
        </Card>

        {/* Language & Security Card Skeleton */}
        <Card className="border-border/60 shadow-sm p-6 flex flex-col gap-4">
          <Skeleton className="h-6 w-44 rounded mb-2" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-border/40">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-5 w-36 rounded" />
                <Skeleton className="h-3 w-48 rounded" />
              </div>
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}
