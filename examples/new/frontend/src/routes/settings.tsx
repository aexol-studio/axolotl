import { Link } from 'react-router';
import { useSettingsQuery, queryKeys } from '@/api/hooks';
import { getQueryClient } from '@/api/queryClient';

// Loader function - prefetches settings into React Query cache
export async function loader() {
  const queryClient = getQueryClient();

  // Prefetch settings query
  await queryClient.prefetchQuery({
    queryKey: queryKeys.settings,
    queryFn: async () => {
      // Mock settings data (matches hook implementation)
      return {
        updatedAt: new Date().toISOString(),
        theme: 'dark',
        notifications: true,
        language: 'en',
      };
    },
  });

  return null;
}

export default function SettingsPage() {
  const settingsQuery = useSettingsQuery();

  const handleRefresh = () => {
    settingsQuery.refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-md w-full border border-white/20">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Settings</h1>
        <p className="text-orange-200 text-center mb-8">Manage your preferences</p>

        <div className="space-y-4">
          {/* Query Status */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">Status:</span>
              <span
                className={`text-sm font-medium ${settingsQuery.isFetching ? 'text-yellow-300' : 'text-green-300'}`}
              >
                {settingsQuery.isFetching ? '⟳ Fetching...' : '✓ Ready'}
              </span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={settingsQuery.isFetching}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white text-xs font-medium py-1 px-3 rounded transition-colors disabled:cursor-not-allowed"
            >
              Refetch
            </button>
          </div>

          {/* Settings Grid */}
          {settingsQuery.isLoading ? (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-white/60 text-center">Loading settings...</p>
            </div>
          ) : settingsQuery.error ? (
            <div className="bg-red-900/30 rounded-xl p-6 border border-red-500/30">
              <p className="text-red-300 text-center">Error: {String(settingsQuery.error)}</p>
            </div>
          ) : settingsQuery.data ? (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-white/60">Theme</span>
                <span className="text-white font-medium capitalize">{settingsQuery.data.theme}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-white/60">Notifications</span>
                <span className="text-white font-medium">{settingsQuery.data.notifications ? 'On' : 'Off'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-white/60">Language</span>
                <span className="text-white font-medium uppercase">{settingsQuery.data.language}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Last Updated</span>
                <span className="text-white text-xs font-mono">
                  {new Date(settingsQuery.data.updatedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ) : null}

          {/* Data Freshness Info */}
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-200 text-sm text-center">
              React Query manages stale/fresh data automatically.
              <br />
              <span className="text-xs text-blue-300">Click "Refetch" to manually refresh settings.</span>
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            to="/"
            className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors border border-white/20"
          >
            Home
          </Link>
          <Link
            to="/profile"
            className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors border border-white/20"
          >
            Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
