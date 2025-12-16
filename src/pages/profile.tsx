import { useAuth } from "../hooks/useAuth";

/**
 * Profile page with updated styling
 */
export function ProfilePage() {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-900 dark:text-white">
        Loading...
      </div>
    );
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

          <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm w-full max-w-xs">
            Profielfoto wijzigen
          </button>
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

          <div className="space-y-6 flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 dark:border-gray-700 pb-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Gebruikersnaam
                </label>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
              </div>
              <button className="mt-2 sm:mt-0 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 px-3 py-1 rounded text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                Verander Gebruikersnaam
              </button>
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
              <button className="mt-2 sm:mt-0 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 px-3 py-1 rounded text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                Verander E-mailadres
              </button>
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

          <div className="mt-8">
            <button className="border border-red-500 text-red-500 dark:text-red-400 dark:border-red-400 px-4 py-2 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
              Account verwijderen
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Favorite Modules */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-colors">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Favoriete Modules
          </h2>
          <div className="space-y-4">
            <p className="text-gray-500 dark:text-gray-400 italic">
              Geen favoriete modules gevonden.
            </p>
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
            <p className="text-gray-500 dark:text-gray-400 italic">
              Geen aanbevolen modules gevonden.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
