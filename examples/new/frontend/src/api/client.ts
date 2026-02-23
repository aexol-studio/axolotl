import { Chain } from '../zeus/index';

export const createChain = (graphqlUrl = '/graphql', extraHeaders: Record<string, string> = {}) =>
  Chain(graphqlUrl, {
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    credentials: 'same-origin',
  });

// SSR-safe chain — uses absolute URL derived from the incoming request + forwards cookies
export const createSsrChain = (request: Request) => {
  const cookie = request.headers.get('cookie');
  return Chain(`${new URL(request.url).origin}/graphql`, {
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { cookie } : {}),
    },
  });
};
