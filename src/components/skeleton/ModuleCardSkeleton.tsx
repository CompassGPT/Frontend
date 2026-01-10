import { Skeleton } from "./Skeleton";

export function ModuleCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 transition-colors">
      {/* Image skeleton */}
      <Skeleton
        className="w-full sm:w-36 h-48 sm:h-28 rounded-lg"
        variant="rectangular"
      />

      {/* Content skeleton */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Tags row */}
        <div className="flex gap-2 flex-wrap">
          <Skeleton className="h-6 w-16" variant="rectangular" />
          <Skeleton className="h-6 w-24" variant="rectangular" />
          <Skeleton className="h-6 w-20" variant="rectangular" />
        </div>

        {/* Title */}
        <Skeleton className="h-5 w-3/4" variant="text" />

        {/* Description lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" variant="text" />
          <Skeleton className="h-4 w-5/6" variant="text" />
        </div>
      </div>

      {/* Right side - location and actions */}
      <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0">
        <Skeleton className="h-5 w-32" variant="text" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" variant="rectangular" />
          <Skeleton className="h-9 w-9" variant="circular" />
        </div>
      </div>
    </div>
  );
}

export function ModuleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ModuleCardSkeleton key={index} />
      ))}
    </>
  );
}
