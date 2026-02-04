import { Outlet, Link } from 'react-router';
import type { RouteObject } from 'react-router';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { Toaster } from '@/components/ui/sonner';
import HomePage, { loader as homeLoader } from './routes/home';
import AboutPage from './routes/about';
import LoginPage from './routes/login';
import ProfilePage, { loader as profileLoader } from './routes/profile';
import SettingsPage, { loader as settingsLoader } from './routes/settings';

// Root layout component with navigation
function RootLayout() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="axolotl-theme">
      <div>
        <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex space-x-8">
                <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
                  Home
                </Link>
                <Link to="/about" className="text-foreground hover:text-primary transition-colors font-medium">
                  About
                </Link>
                <Link to="/profile" className="text-foreground hover:text-primary transition-colors font-medium">
                  Profile
                </Link>
                <Link to="/settings" className="text-foreground hover:text-primary transition-colors font-medium">
                  Settings
                </Link>
                <Link to="/login" className="text-foreground hover:text-primary transition-colors font-medium">
                  Login
                </Link>
              </div>
              <div className="flex items-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>
        <Outlet />
        <Toaster richColors position="top-right" />
      </div>
    </ThemeProvider>
  );
}

// Error boundary component
function ErrorBoundary() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="axolotl-theme">
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card text-card-foreground rounded-2xl p-8 shadow-2xl max-w-md w-full border border-border">
          <h1 className="text-4xl font-bold mb-4 text-center">Oops!</h1>
          <p className="text-muted-foreground text-center mb-6">Something went wrong.</p>
          <Link
            to="/"
            className="block text-center bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </ThemeProvider>
  );
}

// Define routes using Data Router route objects
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homeLoader,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
        loader: profileLoader,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
        loader: settingsLoader,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
];
