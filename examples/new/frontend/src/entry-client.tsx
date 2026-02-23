import './index.css';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { routeConfig } from './routes';

const browserRouter = createBrowserRouter(routeConfig);

// Read SSR-injected initial auth state (typed via global.d.ts Window interface)
const initialAuth = window.__INITIAL_AUTH__ ?? { isAuthenticated: false };

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <AuthProvider value={initialAuth}>
      <RouterProvider router={browserRouter} />
    </AuthProvider>
  </StrictMode>,
);
