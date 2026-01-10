import { Skeleton } from "./Skeleton";

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Form sections */}
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <div
          key={sectionIndex}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          {/* Section title */}
          <Skeleton className="h-6 w-48 mb-4" variant="text" />

          {/* Form fields */}
          <div className="space-y-4">
            {/* Label + Input */}
            <div>
              <Skeleton className="h-4 w-32 mb-2" variant="text" />
              <Skeleton className="h-10 w-full" variant="rectangular" />
            </div>

            {/* Label + Input */}
            <div>
              <Skeleton className="h-4 w-40 mb-2" variant="text" />
              <Skeleton className="h-10 w-full" variant="rectangular" />
            </div>

            {/* Label + Textarea */}
            <div>
              <Skeleton className="h-4 w-36 mb-2" variant="text" />
              <Skeleton className="h-24 w-full" variant="rectangular" />
            </div>
          </div>
        </div>
      ))}

      {/* Submit button */}
      <div className="flex justify-end gap-4">
        <Skeleton className="h-10 w-24" variant="rectangular" />
        <Skeleton className="h-10 w-32" variant="rectangular" />
      </div>
    </div>
  );
}
