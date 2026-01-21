import { redirect, useNavigate, Link } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import { useUserQuery } from '@/api/hooks';

// Loader function - checks auth and protects route
export async function loader() {
  // SSR: redirect to login (no access to store on server)
  if (typeof window === 'undefined') {
    return redirect('/login');
  }

  // Client: check auth state
  const { user, token } = useAuthStore.getState();
  if (!user || !token) {
    return redirect('/login');
  }

  return { user };
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser } = useAuthStore();

  // Use React Query to fetch user profile data
  const userQuery = useUserQuery(authUser?.id);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-md w-full border border-white/20">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Profile</h1>
        <p className="text-teal-200 text-center mb-8">Your account details</p>

        <div className="space-y-4">
          {/* Query Status */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-between">
            <span className="text-white/60 text-sm">React Query Status:</span>
            <span
              className={`text-sm font-medium ${userQuery.isFetching ? 'text-yellow-300' : userQuery.error ? 'text-red-300' : 'text-green-300'}`}
            >
              {userQuery.isFetching ? '⟳ Loading...' : userQuery.error ? '✗ Error' : '✓ Loaded'}
            </span>
          </div>

          {/* User Info Card */}
          {userQuery.isLoading ? (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-white/60 text-center">Loading profile...</p>
            </div>
          ) : userQuery.error ? (
            <div className="bg-red-900/30 rounded-xl p-6 border border-red-500/30">
              <p className="text-red-300 text-center">Error loading profile: {String(userQuery.error)}</p>
            </div>
          ) : userQuery.data ? (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="space-y-3">
                <div>
                  <p className="text-white/60 text-sm">Name</p>
                  <p className="text-white text-lg font-medium">{userQuery.data.name}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">User ID</p>
                  <p className="text-white text-sm font-mono">{userQuery.data.id}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-white/60 text-center">No user data available</p>
            </div>
          )}

          {/* Info Note */}
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-200 text-sm text-center">
              Protected route with React Query data fetching.
              <br />
              <span className="text-xs text-blue-300">useUserQuery manages loading, error & success states.</span>
            </p>
          </div>

          {/* Actions */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            to="/"
            className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors border border-white/20"
          >
            Home
          </Link>
          <Link
            to="/settings"
            className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors border border-white/20"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
