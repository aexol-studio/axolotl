import { useState, FormEvent } from 'react';
import type { AuthMode } from '../types';
import { ErrorMessage } from './ErrorMessage';

type AuthFormProps = {
  onSubmit: (mode: AuthMode, username: string, password: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
};

export function AuthForm({ onSubmit, isLoading, error }: AuthFormProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(authMode, username, password);
    if (success) {
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-md w-full border border-white/20">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Axolotl Todo</h1>
        <p className="text-emerald-200 text-center mb-8">Vite + React + GraphQL + Zeus</p>

        <ErrorMessage message={error} />

        <div className="flex mb-6">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 text-center rounded-l-lg transition-colors ${
              authMode === 'login' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2 text-center rounded-r-lg transition-colors ${
              authMode === 'register' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Loading...' : authMode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="text-white/40 text-xs text-center mt-8">
          GraphQL endpoint: <code className="text-emerald-300">/graphql</code>
        </p>
      </div>
    </div>
  );
}
