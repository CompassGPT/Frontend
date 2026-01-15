// This file loads environment variables at runtime
// It will be injected BEFORE the app starts
window.__ENV__ = {
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000",
};
