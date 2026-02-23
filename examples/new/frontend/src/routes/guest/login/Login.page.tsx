import { useState } from 'react';
import { redirect } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDynamite } from '@aexol/dynamite';
import { useAuth } from '@/hooks/useAuth.js';
import { useAuthStore } from '@/stores';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/Form';
import type { AuthMode } from '@/hooks/useAuth.js';

export const loginLoader = ({ request }: LoaderFunctionArgs) => {
  const fromHeader = request.headers.get('x-authenticated') === 'true';
  const fromStore = typeof window !== 'undefined' ? useAuthStore.getState().isAuthenticated : false;
  if (fromHeader || fromStore) return redirect('/app');
  return { meta: { title: 'Sign In — Axolotl', description: '' } };
};

const createAuthFormSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t('Please enter a valid email')),
    password: z.string().min(6, t('Password must be at least 6 characters')),
  });

type AuthFormValues = z.infer<ReturnType<typeof createAuthFormSchema>>;

export const Login = () => {
  const { authenticate, isLoading, error } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const { t } = useDynamite();

  const authFormSchema = createAuthFormSchema(t);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmitHandler = async (values: AuthFormValues) => {
    const success = await authenticate(authMode, values.email, values.password);
    if (success) form.reset();
  };

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <section id="auth" className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">{t('Ready to Start?')}</h2>
            <p className="text-muted-foreground">{t('Create an account or sign in to get started.')}</p>
          </div>

          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">{t('Todo App')}</CardTitle>
              <CardDescription>{t('Manage your tasks efficiently')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorMessage message={error} />

              <div className="bg-muted rounded-xl p-1 flex mb-6">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 text-center rounded-lg transition-colors ${
                    authMode === 'login'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('Login')}
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2 text-center rounded-lg transition-colors ${
                    authMode === 'register'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('Register')}
                </button>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Email')}</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder={t('you@example.com')} autoComplete="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Password')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder={t('Password')}
                            autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full" disabled={isLoading || form.formState.isSubmitting}>
                    {isLoading ? t('Loading...') : authMode === 'login' ? t('Sign In') : t('Sign Up')}
                  </Button>
                </form>
              </Form>

              <p className="text-muted-foreground text-xs text-center mt-8">
                {t('GraphQL endpoint:')} <code className="text-primary">/graphql</code>
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};
