import { useEffect, useState, useMemo, useCallback } from "react";
import { useBackend, BackendError } from "./useBackend";
import { useAuth } from "./useAuth";
import type { ModulesResponse, UserFavorite } from "../types/api.types";
import type { TransformedModule } from "../types/api.types";

// Hook for single module favorite state
export function useFavoriteModule(moduleId?: number) {
  const backend = useBackend();
  const { user } = useAuth();
  const validModuleId =
    typeof moduleId === "number" && !isNaN(moduleId) ? moduleId : undefined;

  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip favorites for non-students
    if (user?.role !== "STUDENT") {
      setIsLoading(false);
      setIsFavorited(false);
      return;
    }

    const fetchFavorites = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Backend returns { favorites: [{ id, userId, moduleId, createdAt }, ...] }
        // See Backend/src/domain/usermodule/userfavorite.model.ts
        const res = await backend.get<{
          favorites: { moduleId: number }[];
        }>("/user");
        const ids = res.favorites.map((f) => f.moduleId);
        if (validModuleId) {
          setIsFavorited(ids.includes(validModuleId));
        } else {
          setIsFavorited(false);
        }
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
        setError(
          err instanceof BackendError
            ? err.message
            : "Failed to fetch favorites"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // NOTE: backend is excluded because useBackend returns a stable memoized object
  }, [validModuleId, user?.role]);

  const toggleFavorite = useCallback(async () => {
    if (!validModuleId) return;
    try {
      setError(null);
      if (isFavorited) {
        await backend.delete(`/user/${validModuleId}`);
        setIsFavorited(false);
      } else {
        await backend.post(`/user/${validModuleId}`);
        setIsFavorited(true);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      setError(
        err instanceof BackendError ? err.message : "Failed to toggle favorite"
      );
    }
  }, [validModuleId, isFavorited, backend]);

  return { isFavorited, toggleFavorite, isLoading, error };
}

// Hook for favorites in list contexts (modules page, profile page)
export function useFavoritesList() {
  const backend = useBackend();
  const { user } = useAuth();

  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [allModules, setAllModules] = useState<TransformedModule[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch favorites
  useEffect(() => {
    // Skip favorites for non-students
    if (user?.role !== "STUDENT") {
      setIsLoadingFavorites(false);
      setFavoriteIds([]);
      return;
    }

    const fetchFavorites = async () => {
      setIsLoadingFavorites(true);
      setError(null);
      try {
        const res = await backend.get<{
          favorites: UserFavorite[];
        }>("/user");
        const ids = res.favorites.map((f) => f.moduleId);
        setFavoriteIds(ids);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
        setFavoriteIds([]);
        setError(
          err instanceof BackendError
            ? err.message
            : "Failed to fetch favorites"
        );
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // NOTE: backend is excluded because useBackend returns a stable memoized object
  }, [user?.role]);

  // Fetch all modules for profile/list views
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setError(null);
        setIsLoadingModules(true);
        const response = await backend.get<ModulesResponse>("/modules");
        const transformed = response.modules.map((m) => ({
          id: m.id,
          title: m.name,
          description: m.shortdescription,
          startDate: m.startDate,
          level: m.level,
          studiepunten: m.studyCredits,
          locatie:
            m.location.length > 0
              ? m.location.map((loc) => loc.name).join(", ")
              : "Onbekend",
        }));
        setAllModules(transformed);
      } catch (err) {
        console.error("Failed to fetch modules:", err);
        setError(
          err instanceof BackendError ? err.message : "Failed to fetch modules"
        );
      } finally {
        setIsLoadingModules(false);
      }
    };

    fetchModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // NOTE: backend is excluded because useBackend returns a stable memoized object
  }, []);

  const favoriteModules = useMemo(() => {
    return allModules.filter((m) => favoriteIds.includes(m.id));
  }, [allModules, favoriteIds]);

  const toggleFavorite = useCallback(
    async (id: number) => {
      if (id == null || isNaN(id)) return;
      const targetId = id;
      try {
        setError(null);
        if (favoriteIds.includes(targetId)) {
          await backend.delete(`/user/${targetId}`);
          setFavoriteIds((prev) => prev.filter((fid) => fid !== targetId));
        } else {
          await backend.post(`/user/${targetId}`);
          setFavoriteIds((prev) => [...prev, targetId]);
        }
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
        setError(
          err instanceof BackendError
            ? err.message
            : "Failed to toggle favorite"
        );
      }
    },
    [favoriteIds, backend]
  );

  const toggleShowOnlyFavorites = useCallback(() => {
    setShowOnlyFavorites((prev) => !prev);
  }, []);

  return {
    favoriteIds,
    favoritesCount: favoriteIds.length,
    favoriteModules,
    modules: allModules,
    showOnlyFavorites,
    toggleShowOnlyFavorites,
    toggleFavorite,
    isLoading: isLoadingFavorites || isLoadingModules,
    error,
  };
}
