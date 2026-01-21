import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { routes } from './router';
import { createQueryClient } from './api/queryClient';

type RenderResult =
  | {
      html: string;
      head?: string;
    }
  | {
      redirect: string;
      status: number;
    };

export async function render(url: string): Promise<RenderResult> {
  // Create a new QueryClient for each SSR request (avoid data leaking between requests)
  const queryClient = createQueryClient();

  // Create static handler for SSR
  const handler = createStaticHandler(routes);

  // Create a fetch Request from the URL (must be a full URL, not just a path)
  const fetchRequest = new Request(new URL(url, 'http://localhost').href);

  // Query the handler to get route context
  const context = await handler.query(fetchRequest);

  // Handle redirects
  if (context instanceof Response) {
    const location = context.headers.get('Location');
    if (location) {
      return { redirect: location, status: context.status };
    }
    // If it's an error response, throw it
    throw new Error(`Unexpected response: ${context.status}`);
  }

  // Create static router with the context
  const router = createStaticRouter(handler.dataRoutes, context);

  // Render to string
  const html = renderToString(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StaticRouterProvider router={router} context={context} />
      </QueryClientProvider>
    </StrictMode>,
  );

  return { html };
}
