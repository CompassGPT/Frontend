import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave";
}

export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const baseClasses = "bg-gray-200 dark:bg-gray-700";

  const variantClasses = {
    text: "rounded",
    rectangular: "rounded-md",
    circular: "rounded-full",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]",
  };

  const widthStyle = width
    ? typeof width === "number"
      ? `${width}px`
      : width
    : undefined;

  const heightStyle = height
    ? typeof height === "number"
      ? `${height}px`
      : height
    : undefined;

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{
        width: widthStyle,
        height: heightStyle,
      }}
      aria-hidden="true"
    />
  );
}
