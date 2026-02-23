import { type RouteObject, type LoaderFunctionArgs } from 'react-router';
import { RootLayout } from './RootLayout';
import { GuestLayout } from './guest/index.js';
import { ProtectedLayout } from './protected/index.js';
import { Landing, landingLoader } from './guest/landing/Landing.page.js';
import { Login, loginLoader } from './guest/login/Login.page.js';
import { Dashboard, dashboardLoader } from './protected/dashboard/Dashboard.page.js';
import { Settings, settingsLoader } from './protected/settings/Settings.page.js';
import { ExamplesPage as Examples, examplesLoader } from './public/examples/Examples.page.js';
import { NotFound } from './not-found/index.js';
import { ErrorPage } from './ErrorPage.js';

export const rootLoader = async ({
  request,
}: LoaderFunctionArgs): Promise<{ locale: string; translations: Record<string, string> }> => {
  const locale = request.headers.get('x-locale') ?? 'en';

  if (import.meta.env.SSR) {
    // Server-side: load translation file from file system
    // Use dynamic imports so they're excluded from client bundle
    try {
      const { default: fs } = await import('node:fs/promises');
      const { default: path } = await import('node:path');
      const { fileURLToPath } = await import('node:url');
      const __dirname = path.dirname(fileURLToPath(import.meta.url));

      // Sanitize locale to prevent path traversal (allow only "xx" or "xx-XX" format)
      const safeLocale = /^[a-z]{2}(-[A-Z]{2})?$/.test(locale) ? locale : 'en';

      // Try multiple candidate paths (the frontend src locales folder)
      const candidates = [
        path.resolve(__dirname, `../locales/${safeLocale}/common.json`),
        path.resolve(__dirname, `../../locales/${safeLocale}/common.json`),
        path.resolve(process.cwd(), `src/locales/${safeLocale}/common.json`),
        path.resolve(process.cwd(), `frontend/src/locales/${safeLocale}/common.json`),
      ];

      for (const candidate of candidates) {
        try {
          const content = await fs.readFile(candidate, 'utf-8');
          return { locale: safeLocale, translations: JSON.parse(content) as Record<string, string> };
        } catch {
          // try next
        }
      }
      return { locale: safeLocale, translations: {} };
    } catch {
      return { locale: 'en', translations: {} };
    }
  }

  // Client-side: use window.__INITIAL_TRANSLATIONS__ (injected by server)
  return {
    locale: window.__INITIAL_LOCALE__ ?? locale,
    translations: window.__INITIAL_TRANSLATIONS__ ?? {},
  };
};

export const routeConfig: RouteObject[] = [
  {
    id: 'root',
    element: <RootLayout />,
    loader: rootLoader,
    children: [
      // guest routes for non authenticated users
      {
        element: <GuestLayout />,
        children: [
          { path: '/', element: <Landing />, loader: landingLoader, errorElement: <ErrorPage /> },
          { path: '/login', element: <Login />, loader: loginLoader, errorElement: <ErrorPage /> },
        ],
      },
      // public routes accessible to all users
      {
        path: '/examples',
        element: <Examples />,
        loader: examplesLoader,
        errorElement: <ErrorPage />,
      },
      // protected routes for authenticated users
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: '/app',
            element: <Dashboard />,
            loader: dashboardLoader,
            errorElement: <ErrorPage />,
          },
          {
            path: '/settings',
            element: <Settings />,
            loader: settingsLoader,
            errorElement: <ErrorPage />,
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
];
