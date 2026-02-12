import { createChain } from './client';

// Mutation client - modifies data
// Usage: const data = await mutation()({ login: [{ email, password }, true] })
export const mutation = () => createChain()('mutation');
