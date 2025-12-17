import { useEffect, useState } from "react";
import { useBackend, BackendError } from "../hooks/useBackend";
import type { moduleDetail, ModuleResponse } from "../types/api.types";

export function useModule(id: string) {
  const backend = useBackend();
  const [module, setModule] = useState<moduleDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchModule = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await backend.get<ModuleResponse>(
          `/api/modules/${id}`
        );

        setModule(response.module); // ✅ correct
        console.log("Fetched module:", response.module);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof BackendError ? err.message : "Failed to fetch module"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchModule();
  }, [backend, id]);

  return { module, isLoading, error };
}
