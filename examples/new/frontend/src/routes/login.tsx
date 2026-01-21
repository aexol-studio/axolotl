import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock authentication - in real app would call API
    const mockUser = {
      id: 'user-' + Date.now(),
      name: email.split('@')[0] || 'Guest',
    };
    const mockToken = 'mock-jwt-token-' + Date.now();

    // Set auth state
    setUser(mockUser);
    setToken(mockToken);

    // Navigate to profile
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-md w-full border border-white/20">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Login</h1>
        <p className="text-purple-200 text-center mb-8">Sign in to your account</p>

        {/* Mock Auth Info */}
        <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <p className="text-yellow-200 text-sm text-center">
            ✨ Demo Mode: Enter any email/password to access protected routes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 flex gap-3">
          <Link
            to="/"
            className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors border border-white/20"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors border border-white/20"
          >
            About
          </Link>
        </div>
      </div>
    </div>
  );
}
