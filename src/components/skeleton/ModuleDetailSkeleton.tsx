import { Skeleton } from "./Skeleton";

export function ModuleDetailSkeleton() {
  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Main card */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* Title */}
          <Skeleton className="h-8 w-2/3 mb-4" variant="text" />

          {/* Learning outcomes section */}
          <div className="mt-4">
            <Skeleton className="h-6 w-48 mb-2" variant="text" />
            <Skeleton className="h-4 w-full mb-2" variant="text" />
            <Skeleton className="h-4 w-5/6" variant="text" />
          </div>

          {/* Action buttons */}
          <div className="flex flex-nowrap gap-2 mt-4 p-4 items-center">
            <Skeleton className="h-10 w-40" variant="rectangular" />
            <Skeleton className="h-10 w-10" variant="circular" />
          </div>

          {/* Image */}
          <Skeleton
            className="w-full h-64 mt-4 rounded-lg"
            variant="rectangular"
          />
        </div>

        {/* Module details card */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4">
          <Skeleton className="h-6 w-40 mb-4" variant="text" />

          {/* Detail rows */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" variant="text" />
            <Skeleton className="h-4 w-full" variant="text" />
            <Skeleton className="h-4 w-3/4" variant="text" />
            <Skeleton className="h-4 w-full" variant="text" />
            <Skeleton className="h-4 w-2/3" variant="text" />
          </div>
        </div>

        {/* Description card */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4">
          <Skeleton className="h-6 w-32 mb-4" variant="text" />
          <Skeleton className="h-4 w-full" variant="text" />
          <Skeleton className="h-4 w-full" variant="text" />
          <Skeleton className="h-4 w-5/6" variant="text" />
          <Skeleton className="h-4 w-full" variant="text" />
          <Skeleton className="h-4 w-4/5" variant="text" />
        </div>
      </div>
    </div>
  );
}
