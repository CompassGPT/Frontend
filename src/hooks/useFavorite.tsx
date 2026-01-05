import { useEffect, useState } from "react";
import { useBackend, BackendError } from "../hooks/useBackend";

interface IsFavoritedResponse {
  isFavorited: boolean;
}

export function useFavorite(moduleId: string) {
  const backend = useBackend();

  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Check if module is favorited
  useEffect(() => {
    if (!moduleId) return;

    const fetchIsFavorited = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await backend.get<IsFavoritedResponse>(
          `/api/user/favorites/${moduleId}`
        );

        setIsFavorited(response.isFavorited);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof BackendError
            ? err.message
            : "Failed to fetch favorite status"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchIsFavorited();
  }, [backend, moduleId]);

  // 🔹 Favorite module
  const favorite = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await backend.post(`/api/user/favorites/${moduleId}`);
      setIsFavorited(true);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof BackendError
          ? err.message
          : "Failed to favorite module"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Unfavorite module
  const unfavorite = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await backend.delete(`/api/user/favorites/${moduleId}`);
      setIsFavorited(false);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof BackendError
          ? err.message
          : "Failed to unfavorite module"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Toggle helper
  const toggleFavorite = async () => {
    if (isFavorited) {
      await unfavorite();
    } else {
      await favorite();
    }
  };

  return {
    isFavorited,
    isLoading,
    error,
    favorite,
    unfavorite,
    toggleFavorite,
  };
}
