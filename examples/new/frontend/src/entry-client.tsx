import './index.css';
import { StrictMode, useState, useEffect, lazy, Suspense } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { routes } from './router';
import { getQueryClient } from './api/queryClient';

// Lazy load DevTools (only imported in dev)
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((mod) => ({
        default: mod.ReactQueryDevtools,
      })),
    )
  : null;

// Get or create query client for client-side
const queryClient = getQueryClient();

// Create browser router for client-side navigation
const router = createBrowserRouter(routes);

// App wrapper to handle client-only DevTools after hydration
function App() {
  const [showDevtools, setShowDevtools] = useState(false);

  // Show DevTools only after hydration is complete
  useEffect(() => {
    if (import.meta.env.DEV) {
      setShowDevtools(true);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {showDevtools && ReactQueryDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <App />
  </StrictMode>,
);
