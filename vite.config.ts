import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' allows loading variables without the VITE_ prefix if needed.
  const env = loadEnv(mode, process.cwd(), "");

  const port = env.VITE_PORT ? parseInt(env.VITE_PORT) : 5173;

  return {
    // server handles 'npm run dev'
    server: {
      port: port,
      strictPort: true, // Optional: prevents Vite from trying 5174 if 3000 is busy
    },
    // preview handles 'npm run preview'
    preview: {
      port: port,
      strictPort: true,
    },
    plugins: [
      tailwindcss(),
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
    ],
  };
});