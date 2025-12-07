import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTodos } from './hooks/useTodos';
import { AuthForm, Header, TodoForm, TodoList, ErrorMessage } from './components';

export default function App() {
  const { token, user, isLoading: authLoading, error: authError, isAuthenticated, authenticate, logout } = useAuth();
  const {
    todos,
    isLoading: todosLoading,
    error: todosError,
    fetchTodos,
    createTodo,
    markDone,
    clearTodos,
  } = useTodos(token);

  // Fetch todos when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    } else {
      clearTodos();
    }
  }, [isAuthenticated]);

  const isLoading = authLoading || todosLoading;
  const error = authError || todosError;

  // Show auth form if not authenticated
  if (!isAuthenticated) {
    return <AuthForm onSubmit={authenticate} isLoading={authLoading} error={authError} />;
  }

  // Main app screen
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
