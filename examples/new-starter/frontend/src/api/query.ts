import { createChain } from './client';

// Query client - reads data
// Usage: const data = await query()({ user: { todos: { _id: true, content: true } } })
export const query = () => createChain()('query');
