import { Skeleton } from "./Skeleton";

interface CardSkeletonProps {
  showImage?: boolean;
  showFooter?: boolean;
  className?: string;
}

export function CardSkeleton({
  showImage = true,
  showFooter = true,
  className,
}: CardSkeletonProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors ${className || ""}`}>
      {showImage && <Skeleton className="w-full h-48" variant="rectangular" />}

      <div className="p-6 space-y-4">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" variant="text" />

        {/* Description lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" variant="text" />
          <Skeleton className="h-4 w-5/6" variant="text" />
          <Skeleton className="h-4 w-4/5" variant="text" />
        </div>

        {showFooter && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <Skeleton className="h-10 w-24" variant="rectangular" />
            <Skeleton className="h-8 w-8" variant="circular" />
          </div>
        )}
      </div>
    </div>
  );
}
