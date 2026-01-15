import { createChain } from './client';
import { scalars } from './scalars.ts';

// Mutation client - modifies data
// Usage: const data = await mutation()({ echo: [{ message: 'hello' }, true] })
export const mutation = () => createChain()('mutation', { scalars });
