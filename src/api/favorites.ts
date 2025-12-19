const API_BASE = import.meta.env.VITE_BACKEND_URL;

if (!API_BASE) {
  throw new Error("VITE_BACKEND_URL is not defined");
}

export async function favoriteModule(moduleId: string) {
  const res = await fetch(`${API_BASE}/api/user/favorites/${moduleId}`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to favorite module");
  }
}

export async function unfavoriteModule(moduleId: string) {
  const res = await fetch(`${API_BASE}/api/user/favorites/${moduleId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to unfavorite module");
  }
}
