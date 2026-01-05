// hooks/useFavorites.ts
import { useEffect, useState } from "react";
import { useBackend } from "./useBackend";

export function useFavorites() {
  const backend = useBackend();

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

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
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
        setFavoriteIds([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [backend]);

  const toggleFavorite = async (moduleId: string) => {
    try {
      if (favoriteIds.includes(moduleId)) {
        await backend.delete(`/api/user/favorites/${moduleId}`);
        setFavoriteIds(prev => prev.filter(id => id !== moduleId));
      } else {
        await backend.post(`/api/user/favorites/${moduleId}`);
        setFavoriteIds(prev => [...prev, moduleId]);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const toggleShowOnlyFavorites = () => {
    setShowOnlyFavorites(prev => !prev);
  };

  return {
    favoriteIds,
    favoritesCount: favoriteIds.length,
    showOnlyFavorites,
    toggleShowOnlyFavorites,
    toggleFavorite,
    isLoading,
  };
}
