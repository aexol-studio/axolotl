import { createChain } from './client';
import { scalars } from './scalars.ts';

// Query client - reads data
// Usage: const data = await query()({ hello: true })
export const query = () => createChain()('query', { scalars });
