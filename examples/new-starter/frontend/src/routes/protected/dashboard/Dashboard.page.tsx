// Dashboard page - the main app for authenticated users (SPA)
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks';
import { ErrorMessage } from '@/components';
import { useDashboard } from './Dashboard.hook';
import type { TodoType } from '@/api';

// --- Types ---

type TodoItemProps = {
  todo: TodoType;
  onMarkDone: (id: string) => void;
  isLoading: boolean;
};

type TodoFormProps = {
  onSubmit: (content: string) => Promise<boolean>;
  isLoading: boolean;
};

type TodoListProps = {
  todos: TodoType[];
  onMarkDone: (id: string) => void;
  isLoading: boolean;
};

// --- Form Schema ---

const todoFormSchema = z.object({
  content: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, 'Todo content is required').max(500, 'Todo content must be 500 characters or less')),
});

type TodoFormValues = z.infer<typeof todoFormSchema>;

// --- Sub-components (private to this file) ---

const TodoItem = ({ todo, onMarkDone, isLoading }: TodoItemProps) => {
  return (
    <li
      className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
        todo.done ? 'bg-primary/10' : 'bg-muted/50 hover:bg-accent'
      }`}
    >
      <button
        onClick={() => !todo.done && onMarkDone(todo._id)}
        disabled={!!todo.done || isLoading}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.done
            ? 'bg-primary border-primary text-primary-foreground'
            : 'border-muted-foreground hover:border-primary'
        }`}
      >
        {todo.done && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <span className={`flex-1 ${todo.done ? 'text-primary line-through' : 'text-foreground'}`}>{todo.content}</span>
      {todo.done && <span className="text-primary text-xs font-medium px-2 py-1 bg-primary/10 rounded">Done</span>}
    </li>
  );
};

const TodoList = ({ todos, onMarkDone, isLoading }: TodoListProps) => {
  return (
    <div className="bg-card backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-border">
      <h2 className="text-lg font-semibold text-card-foreground mb-4">Your Todos ({todos.length})</h2>

      {isLoading && todos.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No todos yet. Create one above!</p>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <TodoItem key={todo._id} todo={todo} onMarkDone={onMarkDone} isLoading={isLoading} />
          ))}
        </ul>
      )}
    </div>
  );
};

const TodoForm = ({ onSubmit, isLoading }: TodoFormProps) => {
  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: { content: '' },
  });

  const onSubmitHandler = async (values: TodoFormValues) => {
    const success = await onSubmit(values.content);
    if (success) form.reset();
  };

  return (
    <div className="bg-card backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-border mb-6">
      <h2 className="text-lg font-semibold text-card-foreground mb-4">Add New Todo</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitHandler)} className="flex gap-3">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="sr-only">Todo content</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="What needs to be done?" autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading || form.formState.isSubmitting}>
            Add
          </Button>
        </form>
      </Form>
    </div>
  );
};

// --- Page Component ---

export const Dashboard = () => {
  const { user, isLoading: authLoading, error: authError } = useAuth();
  const { todos, todosLoading, todosError, createTodo, markDone } = useDashboard({ ownerId: user?._id ?? null });

  const isLoading = authLoading || todosLoading;
  const error = authError || todosError;

  return (
    <div className="min-h-full bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">My Todos</h1>
          {user && <p className="text-muted-foreground text-sm">Welcome, {user.email}</p>}
        </div>

        <ErrorMessage message={error} />

        <TodoForm onSubmit={createTodo} isLoading={isLoading} />

        <TodoList todos={todos} onMarkDone={markDone} isLoading={isLoading} />

        <p className="text-muted-foreground text-xs text-center mt-6">Powered by Axolotl + GraphQL Yoga + Zeus</p>
      </div>
    </div>
  );
};
