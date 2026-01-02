// Landing page - rendered with SSR
// Shows the auth form for unauthenticated users
import { AuthForm } from '../components';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router';

export default function Landing() {
  const { isAuthenticated, authenticate, isLoading, error } = useAuth();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Axolotl Starter</h1>
          <p className="text-white/60">GraphQL Yoga + Zeus + Vite</p>
        </div>
        <AuthForm onSubmit={authenticate} isLoading={isLoading} error={error} />
        <p className="text-white/40 text-xs text-center mt-6">Powered by Axolotl + GraphQL Yoga + Zeus</p>
      </div>
    </div>
  );
}
