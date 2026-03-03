import { useEffect } from 'react';
import { Link, redirect, useNavigate, useSearchParams } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDynamite } from '@aexol/dynamite';
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { mutation, getGraphQLErrorMessage } from '@/api';
import { isAuthenticated, type AppLoadContext } from '@/lib/queryClient.js';
import { queryKeys } from '@/lib/queryKeys.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const verifyEmailLoader = ({ context }: LoaderFunctionArgs) => {
  const qc = (context as AppLoadContext | undefined)?.queryClient;
  if (isAuthenticated(qc)) return redirect('/app');
  return { meta: { title: 'Verify Email — Axolotl', description: '' } };
};

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useDynamite();
  const rqClient = useQueryClient();
  const token = searchParams.get('token');

  const verifyMutation = useMutation({
    mutationFn: async (verificationToken: string) => {
      const data = await mutation()({
        verifyEmail: [{ token: verificationToken }, true],
      });
      return data.verifyEmail as string;
    },
    onSuccess: async () => {
      await rqClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });

  useEffect(() => {
    if (!token) return;
    if (verifyMutation.isIdle) {
      verifyMutation.mutate(token);
    }
  }, [token]);

  useEffect(() => {
    if (verifyMutation.isSuccess) {
      const timer = setTimeout(() => {
        navigate('/app', { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [verifyMutation.isSuccess, navigate]);

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t('Email Verification')}</CardTitle>
            <CardDescription>{t('Confirming your email address')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {!token && (
              <>
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <p className="text-muted-foreground text-center">
                  {t('No verification token found. Please check your email for the verification link.')}
                </p>
                <Button asChild className="w-full">
                  <Link to="/login">{t('Go to Login')}</Link>
                </Button>
              </>
            )}

            {token && verifyMutation.isPending && (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground text-center">{t('Verifying your email...')}</p>
              </>
            )}

            {token && verifyMutation.isSuccess && (
              <>
                <CheckCircle2 className="h-12 w-12 text-primary" />
                <p className="text-foreground text-center font-medium">
                  {t('Your email has been verified successfully!')}
                </p>
                <p className="text-muted-foreground text-sm text-center">{t('Redirecting to dashboard...')}</p>
              </>
            )}

            {token && verifyMutation.isError && (
              <>
                <XCircle className="h-12 w-12 text-destructive" />
                <p className="text-destructive text-center font-medium">
                  {getGraphQLErrorMessage(verifyMutation.error)}
                </p>
                <p className="text-muted-foreground text-sm text-center">
                  {t('The verification link may have expired or already been used.')}
                </p>
                <Button asChild className="w-full">
                  <Link to="/login">{t('Go to Login')}</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
