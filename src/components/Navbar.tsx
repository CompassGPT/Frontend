import { Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

export function Navbar() {
	const { user, logout } = useAuth();
	const location = useLocation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const isActive = (path: string) => (location.pathname === path ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white");

	const handleLogout = async () => {
		await logout();
		setIsMenuOpen(false);
	};

	const navLinks = [
		{ to: "/", label: "Home" },
		{ to: "/modules", label: "Modules" },
		{ to: "/keuzehulp", label: "Keuzehulp" },
		{ to: "/profile", label: "Profiel" },
	];

	return (
		<nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
			<div className="container mx-auto px-4 h-14 relative flex items-center justify-between">
				{/* Left: brand */}
				<div className="flex items-center">
					<Link to="/" className="font-bold text-lg text-gray-900 dark:text-white">
						CompassGPT
					</Link>
				</div>

				{/* Center: nav links (desktop) */}
				<div className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-5 text-sm font-medium">
					{navLinks.map((link) => (
						<Link key={link.to} to={link.to} className={isActive(link.to)}>
							{link.label}
						</Link>
					))}
				</div>

				{/* Right: desktop nav */}
				<div className="hidden sm:flex items-center gap-3">
					<ThemeToggle />
					{user && <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>}
					<button onClick={handleLogout} className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors" type="button">
						{user ? "Logout" : "Login"}
					</button>
				</div>

				{/* Right: mobile menu button */}
				<div className="sm:hidden flex items-center gap-2">
					<ThemeToggle />
					<button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors" type="button" aria-label="Toggle menu">
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
						</svg>
					</button>
				</div>
			</div>

			{/* Mobile menu */}
			{isMenuOpen && (
				<div className="sm:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
					<div className="px-4 py-3 space-y-2">
						{navLinks.map((link) => (
							<Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.to) ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
								{link.label}
							</Link>
						))}

						{user && <div className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">{user.name}</div>}

						<button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" type="button">
							{user ? "Logout" : "Login"}
						</button>
					</div>
				</div>
			)}
		</nav>
	);
}
