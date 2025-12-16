import { BrowserRouter, Routes, Route } from "react-router";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./main.css";

// Page imports
import { HomePage } from "./pages/home";
import { ModulesPage } from "./pages/modules";
import { ModulePage } from "./pages/module";
import { ProfilePage } from "./pages/profile";
import { LoginPage } from "./pages/auth/login";

// Auth provider
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Rendering app
const root = document.getElementById("root")!;
if (!root) throw new Error("Root element not found!");

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/modules" element={<ModulesPage />} />
            <Route path="/modules/:id" element={<ModulePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Public routes */}
          <Route path="/auth/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
