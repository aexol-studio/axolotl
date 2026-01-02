// Dashboard page - the main app for authenticated users (SPA)
import { useEffect } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useTodos } from '../hooks/useTodos';
import { Header, TodoForm, TodoList, ErrorMessage } from '../components';

export default function Dashboard() {
  const { user, isLoading: authLoading, error: authError, isAuthenticated, logout } = useAuth();
  const {
    todos,
    isLoading: todosLoading,
    error: todosError,
    fetchTodos,
    createTodo,
    markDone,
    clearTodos,
  } = useTodos();

  // Fetch todos when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    } else {
      clearTodos();
    }
  }, [isAuthenticated]);

  // Redirect to landing if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const isLoading = authLoading || todosLoading;
  const error = authError || todosError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-4">
      <div className="max-w-2xl mx-auto">
        <Header user={user} onLogout={logout} />

        <ErrorMessage message={error} />

        <TodoForm onSubmit={createTodo} isLoading={isLoading} />

        <TodoList todos={todos} onMarkDone={markDone} isLoading={isLoading} />

        <p className="text-white/40 text-xs text-center mt-6">Powered by Axolotl + GraphQL Yoga + Zeus</p>
      </div>
    </div>
  );
}
