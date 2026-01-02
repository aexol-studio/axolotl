// Admin layout with sidebar navigation
import { Link, Outlet, useLocation, Navigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '\u{1F4CA}' },
  { path: '/admin/users', label: 'Users', icon: '\u{1F465}' },
  { path: '/admin/settings', label: 'Settings', icon: '\u2699\uFE0F' },
];

export default function AdminLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Redirect to landing if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <p className="text-sm text-slate-400">Logged in as {user?.username}</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-left"
          >
            Logout
          </button>
          <Link to="/app" className="block w-full px-4 py-2 text-slate-400 hover:text-white text-sm mt-2">
            &larr; Back to App
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
