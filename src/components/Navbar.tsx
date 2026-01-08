import { Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut, User, ChevronDown, Compass } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for clean classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };
  // Determine if we're on a module detail page
  const isModuleDetail = location.pathname.match(/^\/modules\/[^/]+$/);
  const isHome = location.pathname === "/" || location.pathname === "/modules";

  const navLinks = [{ to: "/keuzehulp", label: "Keuzehulp" }];

  // Get current module name if on detail page
  const currentModuleName = isModuleDetail
    ? location.pathname.split("/modules/")[1]
    : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 dark:border-gray-800 transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* --- BRAND --- */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          onClick={() => setIsMenuOpen(false)}>
          <div className="p-1.5 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-200">
            <Compass size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
            Compass<span className="text-blue-600">GPT</span>
          </span>
        </Link>

        {/* --- DESKTOP NAV --- */}
        <div className="hidden sm:flex items-center gap-6 flex-1 justify-center px-8">
          {/* Contextual Navigation / Breadcrumbs */}
          {isModuleDetail ? (
            <div className="flex items-center gap-3 px-4 py-1.5 bg-gray-100/50 dark:bg-gray-800/50 rounded-full border border-gray-200 dark:border-gray-700/50">
              <Link
                to="/"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Dashboard
              </Link>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                {currentModuleName}
              </span>
            </div>
          ) : (
            <Link
              to="/"
              className={cn(
                "text-sm font-medium rounded-full px-4 py-1.5 transition-all duration-200",
                isHome
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "bg-gray-100/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50 hover:text-gray-900 dark:hover:text-white"
              )}>
              Dashboard
            </Link>
          )}

          {/* Keuzehulp Button */}
          <Link
            to="/keuzehulp"
            className={cn(
              "text-sm font-medium rounded-full px-4 py-1.5 transition-all duration-200",
              location.pathname === "/keuzehulp"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "bg-gray-100/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50 hover:text-gray-900 dark:hover:text-white"
            )}>
            Keuzehulp
          </Link>
        </div>

        {/* --- ACTIONS --- */}
        <div className="hidden sm:flex items-center gap-4">
          <ThemeToggle />
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />{" "}
          {/* Divider */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 border border-transparent focus:border-gray-200 dark:focus:border-gray-700 focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white dark:ring-gray-900">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-25 truncate">
                  {user.name}
                </span>
                <ChevronDown
                  size={14}
                  className={cn(
                    "text-gray-500 transition-transform duration-200",
                    isProfileOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Profile Dropdown */}
              <div
                className={cn(
                  "absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden ring-1 ring-black/5 py-1 transform transition-all duration-200 origin-top-right",
                  isProfileOpen
                    ? "opacity-100 scale-100 translate-y-0 visible"
                    : "opacity-0 scale-95 -translate-y-2 invisible"
                )}>
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Signed in as
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <User size={16} />
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              Login
            </button>
          )}
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <div className="flex items-center gap-4 sm:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
            aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <div
        className={cn(
          "sm:hidden overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
        )}>
        <div className="px-4 py-6 space-y-4">
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                isHome
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:pl-5"
              )}>
              Dashboard
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                  location.pathname === link.to
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:pl-5"
                )}>
                {link.label}
              </Link>
            ))}
          </div>

          {user && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 px-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">View Profile</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 rounded-xl font-medium transition-colors hover:bg-red-100 dark:hover:bg-red-900/20">
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
