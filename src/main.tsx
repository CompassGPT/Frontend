import { createBrowserRouter, RouterProvider } from "react-router";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./main.css";

// Page imports
import { HomePage } from "./pages/home";
import { ModulesPage } from "./pages/modules";
import { ModulePage } from "./pages/module";
import { LoginPage } from "./pages/auth/login";
import ProfilePage from "./pages/profile";

// Rendering app
const root = document.getElementById("root")!;
if (!root) throw new Error("Root element not found!");

const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
    // loader: loadRootData,
    errorElement: <div>Er is een fout opgetreden</div>,
  },
  {
    path: "/modules",
    Component: ModulesPage,
    errorElement: (
      <div>Er is een fout opgetreden bij het laden van de modules</div>
    ),
  },
  {
    path: "/modules/:id",
    Component: ModulePage,
    errorElement: (
      <div>Er is een fout opgetreden bij het laden van de module</div>
    ),
  },
  {
    path: "/auth/login",
    Component: LoginPage,
    errorElement: <div>Fout bij inloggen</div>,
  },
  {
    path: "/profile",
    Component: ProfilePage,
    errorElement: <div>Er is een fout opgetreden bij het laden van het profiel</div>,
  },
]);

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
