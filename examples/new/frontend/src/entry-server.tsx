import { StrictMode } from 'react';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { renderToPipeableStream } from 'react-dom/server';
import { type Writable } from 'node:stream';
import { routeConfig } from './routes/index';
import { buildMetaHead } from './routes/meta';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './contexts/AuthContext';

export const render = async (
  request: Request,
  options: { isAuthenticated: boolean; locale?: string },
): Promise<{
  pipe: (stream: Writable) => void;
  statusCode: number;
  redirectUrl?: string;
  head: string;
  locale: string;
  translations: Record<string, string>;
}> => {
  // Per-request isolation: clear any cached query data from a previous SSR render
  queryClient.clear();

  const locale = options.locale ?? 'en';

  const handler = createStaticHandler(routeConfig);

  // Add locale header so rootLoader can read it via request.headers.get('x-locale')
  const requestWithLocale = new Request(request.url, {
    method: request.method,
    headers: (() => {
      const headers = new Headers(request.headers);
      headers.set('x-locale', locale);
      return headers;
    })(),
    // Don't clone body for GET/HEAD requests (body may already be consumed)
    ...(request.method !== 'GET' && request.method !== 'HEAD' ? { body: request.body } : {}),
  });

  const context = await handler.query(requestWithLocale);

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
        <AuthProvider value={{ isAuthenticated: options.isAuthenticated }}>
          <StaticRouterProvider router={staticRouter} context={context} />
        </AuthProvider>
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
