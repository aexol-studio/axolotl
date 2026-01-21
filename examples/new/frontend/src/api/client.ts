import { Chain } from '../zeus/index';
import { useAuthStore } from '../stores/authStore';

// Get the GraphQL endpoint URL (handles SSR vs client)
const getGraphQLUrl = (): string => {
  // In SSR, use full URL. In browser, relative path works.
  if (typeof window === 'undefined') {
    return 'http://localhost:4103/graphql';
  }
  return '/graphql';
};

// Create authenticated chain dynamically
// Reads token from Zustand store on each call
export const createChain = () => {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['token'] = token;
  }
  return Chain(getGraphQLUrl(), { headers });
};
