import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { ThemeToggle } from "./ThemeToggle";

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
