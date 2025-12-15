import { useAuth } from "../hooks/useAuth";

/**
 * Example profile page demonstrating useAuth hook usage
 */
export function ProfilePage() {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <p className="text-lg font-medium">{user.name}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <p className="text-lg font-medium">{user.email}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">Role</label>
            <p className="text-lg font-medium">{user.role}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">Member since</label>
            <p className="text-lg font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
        Logout
      </button>
    </div>
  );
}
