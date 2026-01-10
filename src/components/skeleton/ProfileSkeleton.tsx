import { Skeleton } from "./Skeleton";

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24" variant="circular" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-64" variant="text" />
              <Skeleton className="h-5 w-48" variant="text" />
              <Skeleton className="h-5 w-56" variant="text" />
            </div>
            <Skeleton className="h-10 w-24" variant="rectangular" />
          </div>
        </div>

        {/* Favorites Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <Skeleton className="h-7 w-48 mb-6" variant="text" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton
                  className="h-40 w-full rounded-lg"
                  variant="rectangular"
                />
                <Skeleton className="h-5 w-3/4" variant="text" />
                <Skeleton className="h-4 w-full" variant="text" />
                <Skeleton className="h-4 w-5/6" variant="text" />
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <Skeleton className="h-7 w-56 mb-6" variant="text" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton
                  className="h-40 w-full rounded-lg"
                  variant="rectangular"
                />
                <Skeleton className="h-5 w-3/4" variant="text" />
                <Skeleton className="h-4 w-full" variant="text" />
                <Skeleton className="h-4 w-5/6" variant="text" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
