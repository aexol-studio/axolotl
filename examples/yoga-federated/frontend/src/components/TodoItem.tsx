import type { Todo } from '../types';

type TodoItemProps = {
  todo: Todo;
  onMarkDone: (id: string) => void;
  isLoading: boolean;
};

export function TodoItem({ todo, onMarkDone, isLoading }: TodoItemProps) {
  return (
    <li
      className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
        todo.done ? 'bg-emerald-500/20' : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      <button
        onClick={() => !todo.done && onMarkDone(todo._id)}
        disabled={!!todo.done || isLoading}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/30 hover:border-emerald-500'
        }`}
      >
        {todo.done && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <span className={`flex-1 ${todo.done ? 'text-emerald-300 line-through' : 'text-white'}`}>{todo.content}</span>
      {todo.done && (
        <span className="text-emerald-400 text-xs font-medium px-2 py-1 bg-emerald-500/20 rounded">Done</span>
      )}
    </li>
  );
}
