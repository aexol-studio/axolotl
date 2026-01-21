import { Outlet, Link } from 'react-router';
import type { RouteObject } from 'react-router';
import HomePage, { loader as homeLoader } from './routes/home';
import AboutPage from './routes/about';
import LoginPage from './routes/login';
import ProfilePage, { loader as profileLoader } from './routes/profile';
import SettingsPage, { loader as settingsLoader } from './routes/settings';

// Root layout component with navigation
function RootLayout() {
  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex space-x-8">
              <Link to="/" className="text-white hover:text-purple-300 transition-colors font-medium">
                Home
              </Link>
              <Link to="/about" className="text-white hover:text-purple-300 transition-colors font-medium">
                About
              </Link>
              <Link to="/profile" className="text-white hover:text-purple-300 transition-colors font-medium">
                Profile
              </Link>
              <Link to="/settings" className="text-white hover:text-purple-300 transition-colors font-medium">
                Settings
              </Link>
              <Link to="/login" className="text-white hover:text-purple-300 transition-colors font-medium">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

// Error boundary component
function ErrorBoundary() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-md w-full border border-white/20">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Oops!</h1>
        <p className="text-white/80 text-center mb-6">Something went wrong.</p>
        <Link
          to="/"
          className="block text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
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
