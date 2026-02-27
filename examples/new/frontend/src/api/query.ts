import { createChain, createSsrChain } from './client';

// Query client - reads data
// Usage: const data = await query()({ user: { todos: { _id: true, content: true } } })
export const query = () => createChain()('query');

// SSR-safe query — use inside loaders during server-side rendering.
// Resolves an absolute URL from the request origin and forwards cookies for auth.
export const ssrQuery = (request: Request) => createSsrChain(request)('query');

// Loader-aware query — automatically selects ssrQuery on the server, query on the client.
// Use this inside route loaders instead of manually branching on import.meta.env.SSR.
// Usage: const q = loaderQuery(request)
export const loaderQuery = (request: Request) => (import.meta.env.SSR ? ssrQuery(request) : query());
