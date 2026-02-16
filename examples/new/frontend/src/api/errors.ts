import { GraphQLError } from '@/zeus/index.js';

// NOTE: These error constants are used outside React context (e.g., in queryClient.ts).
// Translation should happen at the display/render site where useDynamite() is available.
// The keys are registered in public/locales/en/common.json for completeness.
const MASKED_ERROR = 'Unexpected error.';
const GENERIC_ERROR = 'An unexpected error occurred';

export const getGraphQLErrorMessage = (error: unknown): string => {
  if (error instanceof GraphQLError) {
    const message = error.response.errors?.[0]?.message;
    if (!message || message === MASKED_ERROR) return GENERIC_ERROR;
    return message;
  }
  if (error instanceof Error) {
    return error.message || GENERIC_ERROR;
  }
  return GENERIC_ERROR;
};

export const isAuthError = (error: unknown): boolean => {
  if (error instanceof GraphQLError) {
    const errors = error.response.errors ?? [];
    for (const err of errors) {
      // Check extensions.code (primary signal — most reliable)
      const ext = (err as any).extensions;
      const code = (ext?.code ?? '').toUpperCase();
      if (code === 'UNAUTHORIZED' || code === 'FORBIDDEN') {
        return true;
      }
      // Fallback: check message
      const msg = (err.message ?? '').toLowerCase();
      if (msg.includes('not authorized') || msg.includes('unauthorized')) {
        return true;
      }
    }
    return false;
  }
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return msg.includes('not authorized') || msg.includes('unauthorized');
  }
  return false;
};
