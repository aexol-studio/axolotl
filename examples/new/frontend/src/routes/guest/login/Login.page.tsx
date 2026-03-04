import { useState } from 'react';
import { redirect, useNavigate } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDynamite } from '@aexol/dynamite';
import { Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.js';
import { isAuthenticated, type AppLoadContext } from '@/lib/queryClient.js';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/Form';
import type { AuthMode, AuthResult } from '@/hooks/useAuth.js';

export const loginLoader = ({ context }: LoaderFunctionArgs) => {
  const qc = (context as AppLoadContext | undefined)?.queryClient;
  if (isAuthenticated(qc)) return redirect('/app');
  return { meta: { title: 'Sign In — Axolotl', description: '' } };
};

const createAuthFormSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t('Please enter a valid email')),
    password: z.string().min(6, t('Password must be at least 6 characters')),
  });

type AuthFormValues = z.infer<ReturnType<typeof createAuthFormSchema>>;

export const Login = () => {
  const { authenticate, isLoading, error, isEmailNotVerified } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);
  const { t } = useDynamite();
  const navigate = useNavigate();

  const authFormSchema = createAuthFormSchema(t);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmitHandler = async (values: AuthFormValues) => {
    const result: AuthResult = await authenticate(authMode, values.email, values.password);
    switch (result.status) {
      case 'authenticated':
        form.reset();
        navigate('/app');
        break;
      case 'verification_required':
        setRegistrationMessage(result.message);
        break;
      case 'error':
        // Error is already captured by mutation state in useAuth
        break;
    }
  };

  const handleBackToLogin = () => {
    setRegistrationMessage(null);
    setAuthMode('login');
  };

  // Show "check your email" card after registration when email verification is required
  if (registrationMessage) {
    return (
      <div className="min-h-full flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">{t('Check your email')}</CardTitle>
              <CardDescription>{registrationMessage}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full" onClick={handleBackToLogin}>
                {t('Back to login')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
              {isEmailNotVerified ? (
                <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p>
                      {t('Please verify your email before signing in. Check your inbox for the verification link.')}
                    </p>
                  </div>
                </div>
              ) : (
                <ErrorMessage message={error} />
              )}

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
