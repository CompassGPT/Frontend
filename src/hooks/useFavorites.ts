import { useEffect, useState, useMemo } from "react";
import { useBackend, BackendError } from "./useBackend";
import type { ModulesResponse } from "../types/api.types";

export interface TransformedModule {
  id: string;
  title: string;
  description: string;
  startDate: string;
  level: string;
  studiepunten: number;
  locatie: string;
  image: null;
  periode?: string;
}

export function useFavorites(moduleId?: string) {
  const backend = useBackend();

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [allModules, setAllModules] = useState<TransformedModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch favorites van backend
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const res = await backend.get<{ favorites: { choiceModuleId: string }[] }>(
          "/api/user/favorites"
        );

        // Gebruik de juiste property uit de API
        const ids = res.favorites.map(f => f.choiceModuleId);
        setFavoriteIds(ids);
        
        // Als er een specifieke moduleId is, check of deze in de lijst staat
        if (moduleId) {
          setIsFavorited(ids.includes(moduleId));
        }
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
        setFavoriteIds([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [backend, moduleId]);

  // Fetch all modules - alleen als er geen specifieke moduleId is
  useEffect(() => {
    if (moduleId) return; // Skip als we alleen een specifieke module checken

    const fetchModules = async () => {
      try {
        setIsLoadingModules(true);
        const response = await backend.get<ModulesResponse>("/api/modules");
        const transformed = response.modules.map((m) => ({
          id: m.id,
          title: m.name,
          description: m.shortdescription,
          startDate: m.startDate,
          level: m.level,
          studiepunten: m.studyCredits,
          locatie: m.location.length > 0 ? m.location.map((loc) => loc.name).join(", ") : "Onbekend",
          image: null,
        }));
        setAllModules(transformed);
      } catch (err) {
        console.error("Failed to fetch modules:", err);
      } finally {
        setIsLoadingModules(false);
      }
    };

    fetchModules();
  }, [backend, moduleId]);

  // Filter favorite modules
  const favoriteModules = useMemo(() => {
    return allModules.filter((m) => favoriteIds.includes(m.id));
  }, [allModules, favoriteIds]);

  const toggleFavorite = async (id: string | undefined = moduleId) => {
    const targetId = id;
    if (!targetId) return;

    try {
      if (favoriteIds.includes(targetId)) {
        await backend.delete(`/api/user/favorites/${targetId}`);
        setFavoriteIds(prev => prev.filter(fid => fid !== targetId));
        if (targetId === moduleId) setIsFavorited(false);
      } else {
        await backend.post(`/api/user/favorites/${targetId}`);
        setFavoriteIds(prev => [...prev, targetId]);
        if (targetId === moduleId) setIsFavorited(true);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      setError(
        err instanceof BackendError
          ? err.message
          : "Failed to toggle favorite"
      );
    }
  };

  const toggleShowOnlyFavorites = () => {
    setShowOnlyFavorites(prev => !prev);
  };

  return {
    favoriteIds,
    favoritesCount: favoriteIds.length,
    favoriteModules,
    showOnlyFavorites,
    toggleShowOnlyFavorites,
    toggleFavorite,
    isLoading: isLoading || isLoadingModules,
    // For single module page
    isFavorited,
    error,
  };
}
