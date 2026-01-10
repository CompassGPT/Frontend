import { useEffect, useState, useMemo } from "react";
import { useBackend, BackendError } from "./useBackend";
import type { ModulesResponse, UserFavorite } from "../types/api.types";
import type { TransformedModule } from "../types/api.types";

// Hook for single module favorite state
export function useFavoriteModule(moduleId?: number) {
  const backend = useBackend();
  const validModuleId =
    typeof moduleId === "number" && !isNaN(moduleId) ? moduleId : undefined;

  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await backend.get<{
          favorites: { choiceModuleId: number }[];
        }>("/user");
        const ids = res.favorites.map((f) => f.choiceModuleId);
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
  }, [backend, validModuleId]);

  const toggleFavorite = async () => {
    if (!validModuleId) return;
    try {
      setError(null);
      if (isFavorited) {
        await backend.delete(`/api/user/${validModuleId}`);
        setIsFavorited(false);
      } else {
        await backend.post(`/api/user/${validModuleId}`);
        setIsFavorited(true);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      setError(
        err instanceof BackendError ? err.message : "Failed to toggle favorite"
      );
    }
  };

  return { isFavorited, toggleFavorite, isLoading, error };
}

// Hook for favorites in list contexts (modules page, profile page)
export function useFavoritesList() {
  const backend = useBackend();

  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [allModules, setAllModules] = useState<TransformedModule[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoadingFavorites(true);
      setError(null);
      try {
        const res = await backend.get<{
          favorites: UserFavorite[];
        }>("/api/user");
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
  }, [backend]);

  // Fetch all modules for profile/list views
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setError(null);
        setIsLoadingModules(true);
        const response = await backend.get<ModulesResponse>("/api/modules");
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
  }, [backend]);

  const favoriteModules = useMemo(() => {
    return allModules.filter((m) => favoriteIds.includes(m.id));
  }, [allModules, favoriteIds]);

  const toggleFavorite = async (id: number) => {
    if (id == null || isNaN(id)) return;
    const targetId = id;
    try {
      setError(null);
      if (favoriteIds.includes(targetId)) {
        await backend.delete(`/api/user/${targetId}`);
        setFavoriteIds((prev) => prev.filter((fid) => fid !== targetId));
      } else {
        await backend.post(`/api/user/${targetId}`);
        setFavoriteIds((prev) => [...prev, targetId]);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      setError(
        err instanceof BackendError ? err.message : "Failed to toggle favorite"
      );
    }
  };

  const toggleShowOnlyFavorites = () => {
    setShowOnlyFavorites((prev) => !prev);
  };

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
