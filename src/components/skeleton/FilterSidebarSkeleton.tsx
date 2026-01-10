import { Skeleton } from "./Skeleton";

export function FilterSidebarSkeleton() {
  return (
    <div className="lg:w-64 xl:w-72 shrink-0 hidden lg:block">
      <div className="space-y-4">
        {/* Reset button skeleton */}
        <Skeleton className="h-10 w-full rounded-lg" variant="rectangular" />

        {/* Filter sections */}
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
            {/* Filter header */}
            <div className="p-4">
              <Skeleton className="h-5 w-24" variant="text" />
            </div>

            {/* Filter options */}
            <div className="px-4 pb-4 space-y-2 border-t border-gray-100 dark:border-gray-700">
              {Array.from({ length: 3 }).map((_, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-3 p-2">
                  <Skeleton className="h-4 w-4 rounded" variant="rectangular" />
                  <Skeleton className="h-4 w-20" variant="text" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
