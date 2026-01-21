import { Link } from 'react-router';
import { useItemsInfiniteQuery } from '@/api/hooks';

interface Item {
  id: number;
  title: string;
  description: string;
}

interface ItemsPage {
  items: Item[];
  nextCursor: number | null;
}

export default function AboutPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useItemsInfiniteQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-2xl w-full border border-white/20">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">About</h1>
        <p className="text-purple-200 text-center mb-6">React Router 7.12 + Vite SSR + React Query v5</p>

        {/* Stack Info */}
        <div className="space-y-3 text-white/80 mb-6">
          <p>✨ React 19 with Server Components</p>
          <p>⚡ Vite SSR</p>
          <p>🧭 React Router 7.12.0 Data Router</p>
          <p>🔄 TanStack React Query v5</p>
          <p>🎨 Tailwind CSS 4</p>
          <p>📊 GraphQL with Axolotl</p>
          <p>🔐 Protected routes with Zustand auth</p>
        </div>

        {/* Infinite Query Demo */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Infinite Query Demo</h2>

          {isLoading ? (
            <p className="text-white/60 text-center">Loading items...</p>
          ) : error ? (
            <p className="text-red-300 text-center">Error: {String(error)}</p>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                {data?.pages.map((page: ItemsPage, pageIndex: number) => (
                  <div key={pageIndex} className="space-y-2">
                    {page.items.map((item: Item) => (
                      <div key={item.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <p className="text-white font-medium text-sm">{item.title}</p>
                        <p className="text-white/60 text-xs">{item.description}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              <button
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'No more items'}
              </button>

              {/* Stats */}
              <div className="mt-3 text-center text-xs text-white/60">
                Loaded {data?.pages.length || 0} page(s) ·{' '}
                {data?.pages.reduce((acc: number, page: ItemsPage) => acc + page.items.length, 0) || 0} total items
              </div>
            </>
          )}
        </div>

        {/* Info Note */}
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
          <p className="text-blue-200 text-sm text-center mb-2">useInfiniteQuery example with mock paginated data.</p>
          <p className="text-white text-xs text-center">Protected route: Login → Profile requires authentication</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Link
            to="/"
            className="flex-1 text-center bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Login
          </Link>
          <Link
            to="/settings"
            className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
