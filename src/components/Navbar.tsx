import { Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "text-blue-600" : "text-gray-700 hover:text-gray-900";

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 h-14 relative flex items-center justify-between">
        {/* Left: brand */}
        <div className="flex items-center">
          <Link to="/" className="font-bold text-lg text-gray-900">CompassGPT</Link>
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
            <span className="hidden sm:block text-sm text-gray-600">
              Ingelogd als <span className="font-medium">{user.name}</span>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
