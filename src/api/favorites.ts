const API_BASE = "http://localhost:4000/api";

export async function favoriteModule(moduleId: string) {
  const res = await fetch(`${API_BASE}/user/favorites/${moduleId}`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to favorite module");
  }
}

export async function unfavoriteModule(moduleId: string) {
  const res = await fetch(`${API_BASE}/user/favorites/${moduleId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to unfavorite module");
  }
}
