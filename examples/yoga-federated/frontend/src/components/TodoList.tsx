import type { Todo } from '../types';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[];
  onMarkDone: (id: string) => void;
  isLoading: boolean;
};

export function TodoList({ todos, onMarkDone, isLoading }: TodoListProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
      <h2 className="text-lg font-semibold text-white mb-4">Your Todos ({todos.length})</h2>

      {isLoading && todos.length === 0 ? (
        <p className="text-white/50 text-center py-8">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="text-white/50 text-center py-8">No todos yet. Create one above!</p>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <TodoItem key={todo._id} todo={todo} onMarkDone={onMarkDone} isLoading={isLoading} />
          ))}
        </ul>
      )}
    </div>
  );
}
