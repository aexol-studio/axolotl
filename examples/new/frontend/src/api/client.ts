import { Chain } from '../zeus/index';
import { useAuthStore } from '../stores/authStore';

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
  return Chain('/graphql', { headers });
};
