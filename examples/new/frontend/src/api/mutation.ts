import { createChain } from './client';

// Mutation client - modifies data
// Usage: const data = await mutation()({ echo: [{ message: 'hello' }, true] })
export const mutation = () => createChain()('mutation');
