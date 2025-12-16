import { Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path 
      ? "text-blue-600 dark:text-blue-400" 
      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white";

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="container mx-auto px-4 h-14 relative flex items-center justify-between">
        {/* Left: brand */}
        <div className="flex items-center">
          <Link to="/" className="font-bold text-lg text-gray-900 dark:text-white">CompassGPT</Link>
        </div>

        {/* Center: nav links */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-5 text-sm font-medium">
          <Link to="/" className={isActive("/")}>Home</Link>
          <Link to="/modules" className={isActive("/modules")}>Modules</Link>
          <Link to="/keuzehulp" className={isActive("/keuzehulp")}>Keuzehulp</Link>
          <Link to="/profile" className={isActive("/profile")}>Profiel</Link>
        </div>

        {/* Right: user + logout */}
        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden sm:block text-sm font-medium text-gray-900 dark:text-white">
              {user.name}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
