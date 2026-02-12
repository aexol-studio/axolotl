import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth.js';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/Form';
import type { AuthMode } from '@/hooks/useAuth.js';

const authFormSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type AuthFormValues = z.infer<typeof authFormSchema>;

export const Login = () => {
  const { authenticate, isLoading, error } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');

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
            <h2 className="text-3xl font-bold text-foreground">Ready to Start?</h2>
            <p className="text-muted-foreground">Create an account or sign in to get started.</p>
          </div>

          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Todo App</CardTitle>
              <CardDescription>Manage your tasks efficiently</CardDescription>
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
                  Login
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2 text-center rounded-lg transition-colors ${
                    authMode === 'register'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Register
                </button>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="you@example.com" autoComplete="email" />
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Password"
                            autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full" disabled={isLoading || form.formState.isSubmitting}>
                    {isLoading ? 'Loading...' : authMode === 'login' ? 'Sign In' : 'Sign Up'}
                  </Button>
                </form>
              </Form>

              <p className="text-muted-foreground text-xs text-center mt-8">
                GraphQL endpoint: <code className="text-primary">/graphql</code>
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};
