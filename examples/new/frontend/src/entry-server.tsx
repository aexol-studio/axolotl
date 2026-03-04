import { StrictMode } from 'react';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { renderToPipeableStream } from 'react-dom/server';
import { QueryClientProvider } from '@tanstack/react-query';
import { type Writable } from 'node:stream';
import { routeConfig } from './routes/index';
import { buildMetaHead } from './routes/meta';
import { createQueryClient } from './lib/queryClient';
import { createSsrChain } from './api/client';
import { userSelector } from './api/selectors';
import { queryKeys } from './lib/queryKeys';
import { COOKIE_NAME } from '../../backend/src/config/cookies.js';

export const render = async (
  request: Request,
  options: { locale?: string },
): Promise<{
  pipe: (stream: Writable) => void;
  statusCode: number;
  redirectUrl?: string;
  head: string;
  locale: string;
  translations: Record<string, string>;
}> => {
  // Per-request isolation: fresh QueryClient per SSR request — never share state between concurrent requests
  const queryClient = createQueryClient();

  const locale = options.locale ?? 'en';

  const handler = createStaticHandler(routeConfig);

  // Add internal SSR headers so loaders can read locale from the request
  const requestWithHeaders = new Request(request.url, {
    method: request.method,
    headers: (() => {
      const headers = new Headers(request.headers);
      headers.set('x-locale', locale);
      return headers;
    })(),
    // Don't clone body for GET/HEAD requests (body may already be consumed)
    ...(request.method !== 'GET' && request.method !== 'HEAD' ? { body: request.body } : {}),
  });

  // Resolve auth state BEFORE any loader runs.
  // This seeds queryClient so every loader can read isAuthenticated() immediately.
  const cookieHeader = requestWithHeaders.headers.get('cookie') ?? '';
  const hasAuthCookie = cookieHeader.split(';').some((c) => c.trim().startsWith(`${COOKIE_NAME}=`));

  if (hasAuthCookie) {
    try {
      const ssrChain = createSsrChain(requestWithHeaders);
      const data = await ssrChain('query')({ user: { me: userSelector } });
      queryClient.setQueryData(queryKeys.me, data.user?.me ?? null);
    } catch {
      queryClient.setQueryData(queryKeys.me, null);
    }
  } else {
    queryClient.setQueryData(queryKeys.me, null);
  }

  const context = await handler.query(requestWithHeaders, {
    requestContext: { queryClient } as unknown as Record<string, unknown>,
  });

  // A loader returned a redirect Response — short-circuit without rendering
  if (context instanceof Response) {
    return {
      pipe: () => {},
      statusCode: context.status,
      redirectUrl: context.headers.get('Location') ?? '/',
      head: buildMetaHead([]),
      locale,
      translations: {},
    };
  }

  // Extract translations from rootLoader data so backend can inject window.__INITIAL_TRANSLATIONS__
  const rootLoaderData = (context as { loaderData?: Record<string, unknown> }).loaderData?.['root'];
  const translations = (rootLoaderData as { translations?: Record<string, string> } | undefined)?.translations ?? {};

  const staticRouter = createStaticRouter(handler.dataRoutes, context);

  const { pipe } = await new Promise<{ pipe: (s: Writable) => void }>((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <StaticRouterProvider router={staticRouter} context={context} />
        </QueryClientProvider>
      </StrictMode>,
      {
        onShellReady: () => {
          clearTimeout(timeoutId);
          resolve({ pipe });
        },
        onShellError: reject,
        onError: (err) => console.error('[SSR error]', err),
      },
    );

    // Abort streaming after 10 s to prevent hanging requests
    const timeoutId = setTimeout(abort, 10_000);
  });

  return {
    pipe,
    // context.statusCode is set by React Router based on matched routes / error boundaries
    statusCode: context.statusCode ?? 200,
    redirectUrl: undefined,
    head: buildMetaHead(
      context.matches.map((match) => ({
        data: context.loaderData[match.route.id],
      })),
    ),
    locale,
    translations,
  };
};
