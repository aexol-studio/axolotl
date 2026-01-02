import { createChain } from './client';

// Query client - reads data
// Usage: const data = await query()({ hello: true })
export const query = () => createChain()('query');
