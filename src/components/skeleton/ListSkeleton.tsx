import { Skeleton } from "./Skeleton";

interface ListSkeletonProps {
  count?: number;
  showAvatar?: boolean;
  className?: string;
}

export function ListSkeleton({
  count = 5,
  showAvatar = false,
  className,
}: ListSkeletonProps) {
  return (
    <div className={`space-y-3 ${className || ""}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {showAvatar && <Skeleton className="h-10 w-10" variant="circular" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" variant="text" />
            <Skeleton className="h-3 w-1/2" variant="text" />
          </div>
        </div>
      ))}
    </div>
  );
}
