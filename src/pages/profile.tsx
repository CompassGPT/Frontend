import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useFavoritesList } from "../hooks/useFavorites";
import { useBackend, BackendError } from "../hooks/useBackend";
import { ProfileSkeleton } from "../components/skeleton";

/**
 * Profile page with updated styling
 */
export function ProfilePage() {
  const { user, logout, isLoading } = useAuth();
  const backend = useBackend();
  const MAX_RECENT_RECOMMENDED = 5;

  const [recommendedIds, setRecommendedIds] = useState<number[]>([]);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true);
  const [recommendedError, setRecommendedError] = useState<string | null>(null);

  const {
    favoriteModules,
    modules,
    toggleFavorite,
    isLoading: loadingModules,
    error: favoritesError,
  } = useFavoritesList();

  useEffect(() => {
    const fetchRecommended = async () => {
      if (!user) return;

      setIsLoadingRecommended(true);
      setRecommendedError(null);

      try {
        const res = await backend.get<{
          recommended: { moduleId: number }[];
        }>("/user/recommended");
        const ids = res.recommended.map((r) => r.moduleId);
        setRecommendedIds(ids.slice(0, MAX_RECENT_RECOMMENDED));
      } catch (err) {
        setRecommendedIds([]);
        setRecommendedError(
          err instanceof BackendError
            ? err.message
            : "Failed to fetch recommended modules"
        );
      } finally {
        setIsLoadingRecommended(false);
      }
    };

    fetchRecommended();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const recommendedModules = useMemo(() => {
    if (!modules || modules.length === 0 || recommendedIds.length === 0) {
      return [];
    }

    const byId = new Map(modules.map((m) => [m.id, m]));
    return recommendedIds
      .map((id) => byId.get(id))
      .filter((m): m is NonNullable<typeof m> => Boolean(m));
  }, [modules, recommendedIds]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  if (isLoading || loadingModules) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-gray-900 dark:text-white">
        Not authenticated
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 pt-20 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          Profiel
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bekijken en bewerk hier je gebruikersgegevens
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Profile Picture Card */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 flex flex-col items-center text-center lg:col-span-1 transition-colors">
          <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 flex items-center justify-center ring-4 ring-gray-50 dark:ring-gray-600">
            <svg
              className="w-16 h-16 text-gray-400 dark:text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {user.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
            {user.role}
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 lg:col-span-2 relative flex flex-col transition-colors">
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Gegevens
            </h2>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors">
              Logout
            </button>
          </div>

          <div className="space-y-6 grow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 dark:border-gray-700 pb-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Gebruikersnaam
                </label>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 dark:border-gray-700 pb-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  E-mailadres
                </label>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 dark:border-gray-700 pb-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Rol
                </label>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {user.role}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 dark:border-gray-700 pb-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Lid sinds
                </label>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Favorite Modules */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-colors">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Favoriete Modules
          </h2>
          {favoritesError && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-800 dark:text-red-300 transition-colors">
              {favoritesError}
            </div>
          )}
          <div className="space-y-4">
            {loadingModules ? (
              <p className="text-gray-500 dark:text-gray-400">Laden...</p>
            ) : favoriteModules.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic">
                Geen favoriete modules gevonden.
              </p>
            ) : (
              favoriteModules.map((module) => (
                <div
                  key={module.id}
                  className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">
                          {module.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                            {module.studiepunten} EC
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                            {module.level}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/modules/${module.id}`}
                          className="px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs font-semibold rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors whitespace-nowrap">
                          Meer info
                        </Link>
                        <button
                          onClick={() => toggleFavorite(module.id)}
                          className="p-2 rounded-lg transition-colors bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50"
                          title="Verwijder uit favorieten">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            stroke="currentColor"
                            viewBox="0 0 20 20">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {module.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recommended Modules */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent aanbevolen modules
            </h2>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
              Aanpassen
            </button>
          </div>
          <div className="space-y-4">
            {recommendedError && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-800 dark:text-red-300 transition-colors">
                {recommendedError}
              </div>
            )}

            {isLoadingRecommended || loadingModules ? (
              <p className="text-gray-500 dark:text-gray-400">Laden...</p>
            ) : recommendedModules.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic">
                Geen aanbevolen modules gevonden.
              </p>
            ) : (
              recommendedModules.map((module) => (
                <div
                  key={module.id}
                  className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">
                          {module.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                            {module.studiepunten} EC
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                            {module.level}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/modules/${module.id}`}
                          className="px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs font-semibold rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors whitespace-nowrap">
                          Meer info
                        </Link>
                      </div>
                    </div>

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {module.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
