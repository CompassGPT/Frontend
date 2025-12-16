import { useParams } from "react-router";

export function ModulePage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="p-8 pt-20">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Module {id}
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Module details will appear here
      </p>
    </div>
  );
}
