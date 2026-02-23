// Dashboard page - the main app for authenticated users (SPA)
import { redirect } from 'react-router';
import { useLoaderData } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDynamite } from '@aexol/dynamite';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks';
import { ErrorMessage } from '@/components';
import { useAuthStore } from '@/stores';
import { queryClient } from '@/lib/queryClient';
import { cn } from '@/lib/utils';
import { loaderQuery, todoSelector } from '@/api';
import { useDashboard } from './Dashboard.hook';
import type { TodoType } from '@/api';

// --- Loader ---

export const dashboardLoader = async ({ request }: LoaderFunctionArgs) => {
  const isAuthenticated =
    request.headers.get('x-authenticated') === 'true' ||
    (typeof window !== 'undefined' && useAuthStore.getState().isAuthenticated);
  if (!isAuthenticated) throw redirect('/login');

  await queryClient.fetchQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const q = loaderQuery(request);
      const data = await q({ user: { me: { _id: true, email: true, createdAt: true } } });
      return data.user?.me ?? null;
    },
  });

  await queryClient.fetchQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const q = loaderQuery(request);
      const data = await q({ user: { todos: todoSelector } });
      return data.user?.todos ?? [];
    },
  });

  return {
    meta: { title: 'Dashboard — Axolotl', description: '' },
    dehydratedState: dehydrate(queryClient),
  };
};

// --- Form Schema ---

const createTodoFormSchema = (t: (key: string) => string) =>
  z.object({
    content: z
      .string()
      .transform((val) => val.trim())
      .pipe(
        z.string().min(1, t('Todo content is required')).max(500, t('Todo content must be 500 characters or less')),
      ),
  });

type TodoFormValues = z.infer<ReturnType<typeof createTodoFormSchema>>;

// --- Page Component ---

export const Dashboard = () => {
  const { dehydratedState } = useLoaderData<typeof dashboardLoader>();
  const { t } = useDynamite();
  const { user, isLoading: authLoading, error: authError } = useAuth();
  const { todos, todosLoading, todosError, createTodo, markDone } = useDashboard({ ownerId: user?._id ?? null });

  const isLoading = authLoading || todosLoading;
  const error = authError || todosError;

  const todoFormSchema = createTodoFormSchema(t);
  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: { content: '' },
  });

  const onSubmitHandler = async (values: TodoFormValues) => {
    const success = await createTodo(values.content);
    if (success) form.reset();
  };

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="min-h-full bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">{t('My Todos')}</h1>
            {user && <p className="text-muted-foreground text-sm">{t('Welcome, {{email}}', { email: user.email })}</p>}
          </div>

          <ErrorMessage message={error} />

          {/* Add Todo Form */}
          <div className="bg-card backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-border mb-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">{t('Add New Todo')}</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitHandler)} className="flex gap-3">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="sr-only">{t('Todo content')}</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" placeholder={t('What needs to be done?')} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || form.formState.isSubmitting}>
                  {t('Add')}
                </Button>
              </form>
            </Form>
          </div>

          {/* Todo List */}
          <div className="bg-card backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-border">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">
              {t('Your Todos ({{count}})', { count: todos.length })}
            </h2>
            {isLoading && todos.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">{t('Loading...')}</p>
            ) : todos.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">{t('No todos yet. Create one above!')}</p>
            ) : (
              <ul className="space-y-3">
                {todos.map((todo: TodoType) => (
                  <li
                    key={todo._id}
                    className={cn('flex items-center gap-3 p-4 rounded-xl transition-colors', {
                      'bg-primary/10': todo.done,
                      'bg-muted/50 hover:bg-accent': !todo.done,
                    })}
                  >
                    <button
                      onClick={() => !todo.done && markDone(todo._id)}
                      disabled={!!todo.done || isLoading}
                      className={cn(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                        {
                          'bg-primary border-primary text-primary-foreground': todo.done,
                          'border-muted-foreground hover:border-primary': !todo.done,
                        },
                      )}
                    >
                      {todo.done && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span
                      className={cn('flex-1', {
                        'text-primary line-through': todo.done,
                        'text-foreground': !todo.done,
                      })}
                    >
                      {todo.content}
                    </span>
                    {todo.done && (
                      <span className="text-primary text-xs font-medium px-2 py-1 bg-primary/10 rounded">
                        {t('Done')}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="text-muted-foreground text-xs text-center mt-6">
            {t('Powered by Axolotl + GraphQL Yoga + Zeus')}
          </p>
        </div>
      </div>
    </HydrationBoundary>
  );
};
