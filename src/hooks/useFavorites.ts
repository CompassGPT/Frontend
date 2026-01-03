// hooks/useFavorites.ts
import { useEffect, useState } from "react";
import { useBackend } from "./useBackend";

export function useFavorites() {
  const backend = useBackend();

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);

      const res = await backend.get<{ favorites: { moduleId: string }[] }>(
        "/api/user/favorites"
      );

      setFavoriteIds(res.favorites.map(f => f.moduleId));
      setIsLoading(false);
    };

    fetchFavorites();
  }, [backend]);

  const toggleFavorite = async (moduleId: string) => {
    if (favoriteIds.includes(moduleId)) {
      await backend.delete(`/api/user/favorites/${moduleId}`);
      setFavoriteIds(prev => prev.filter(id => id !== moduleId));
    } else {
      await backend.post(`/api/user/favorites/${moduleId}`);
      setFavoriteIds(prev => [...prev, moduleId]);
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
