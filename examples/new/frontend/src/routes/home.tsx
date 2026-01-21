import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { useHelloQuery, useEchoMutation, queryKeys } from '@/api/hooks';
import { getQueryClient } from '@/api/queryClient';
import { gql } from '@/api';

// Loader function - prefetches data into React Query cache
export async function loader() {
  const queryClient = getQueryClient();

  // Prefetch hello query
  await queryClient.prefetchQuery({
    queryKey: queryKeys.hello,
    queryFn: async () => {
      const data = await gql.query.hello();
      return data.hello;
    },
  });

  // Return initial data for SSR hydration
  const initialData = queryClient.getQueryData(queryKeys.hello);
  return { initialData };
}

export default function HomePage() {
  const loaderData = useLoaderData<typeof loader>();
  const [echoInput, setEchoInput] = useState('');

  // Use React Query hook with initial data from loader
  const helloQuery = useHelloQuery();

  // Use mutation hook with automatic invalidation
  const echoMutation = useEchoMutation();

  const handleEcho = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!echoInput.trim()) return;

    try {
      await echoMutation.mutateAsync(echoInput);
      setEchoInput(''); // Clear input on success
    } catch (error) {
      console.error('Echo failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-md w-full border border-white/20">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Axolotl</h1>
        <p className="text-purple-200 text-center mb-8">React Query + GraphQL + React Router</p>

        <div className="space-y-6">
          {/* Hello Query - from React Query with prefetching */}
          <div className="bg-white/5 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-white mb-3">
              Query: hello (React Query)
              {helloQuery.isFetching && <span className="text-xs ml-2 text-yellow-300">⟳ refetching...</span>}
            </h2>
            {helloQuery.isLoading ? (
              <p className="text-gray-300 bg-gray-900/30 rounded-lg p-3 text-center">Loading...</p>
            ) : helloQuery.error ? (
              <p className="text-red-300 bg-red-900/30 rounded-lg p-3 text-center">Error: {String(helloQuery.error)}</p>
            ) : (
              <p className="text-green-300 bg-green-900/30 rounded-lg p-3 text-center">{helloQuery.data}</p>
            )}
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-white/40">
                Status:{' '}
                <span className={helloQuery.isFetching ? 'text-yellow-300' : 'text-green-300'}>
                  {helloQuery.status}
                </span>
              </span>
              <span className="text-white/40">
                Data age:{' '}
                <span className="text-purple-300">
                  {helloQuery.dataUpdatedAt ? 'fresh' : loaderData.initialData ? 'from loader' : 'none'}
                </span>
              </span>
            </div>
          </div>

          {/* Echo Mutation - via React Query */}
          <div className="bg-white/5 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-white mb-3">
              Mutation: echo (React Query)
              {echoMutation.isPending && <span className="text-xs ml-2 text-yellow-300">⟳ sending...</span>}
            </h2>
            <form onSubmit={handleEcho} className="flex gap-2">
              <input
                type="text"
                value={echoInput}
                onChange={(e) => setEchoInput(e.target.value)}
                placeholder="Enter a message..."
                disabled={echoMutation.isPending}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={echoMutation.isPending || !echoInput.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {echoMutation.isPending ? 'Sending...' : 'Echo'}
              </button>
            </form>
            {echoMutation.data && (
              <p className="mt-3 text-blue-300 bg-blue-900/30 rounded-lg p-3 text-center">{echoMutation.data}</p>
            )}
            {!!echoMutation.error && (
              <p className="mt-3 text-red-300 bg-red-900/30 rounded-lg p-3 text-center">
                Error: {String(echoMutation.error)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
          <p className="text-purple-200 text-xs text-center">
            ✨ Hybrid approach: Loader prefetches → React Query manages state
            <br />
            🔄 Echo mutation auto-invalidates hello query
          </p>
        </div>

        <p className="text-white/40 text-xs text-center mt-8">
          GraphQL endpoint: <code className="text-purple-300">/graphql</code>
        </p>
      </div>
    </div>
  );
}
