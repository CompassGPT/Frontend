import { Skeleton } from "./Skeleton";

interface TextSkeletonProps {
  lines?: number;
  className?: string;
}

export function TextSkeleton({ lines = 3, className }: TextSkeletonProps) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-4 mb-2 ${index === lines - 1 ? "w-3/4" : "w-full"}`}
          variant="text"
        />
      ))}
    </div>
  );
}
