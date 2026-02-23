import { redirect } from 'react-router';
import { useLoaderData } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Settings as SettingsIcon } from 'lucide-react';
import { useDynamite } from '@aexol/dynamite';
import { useAuthStore } from '@/stores';
import { queryClient } from '@/lib/queryClient';
import { loaderQuery, sessionSelector } from '@/api';
import { ProfileSection, ChangePasswordSection, SessionsSection, DeleteAccountSection } from './components';

// --- Loader ---

export const settingsLoader = async ({ request }: LoaderFunctionArgs) => {
  const isAuthenticated =
    request.headers.get('x-authenticated') === 'true' ||
    (typeof window !== 'undefined' && useAuthStore.getState().isAuthenticated);
  if (!isAuthenticated) throw redirect('/login');

  // Pre-fetch queries that Settings actually uses (matching exact queryKeys)
  await queryClient.fetchQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const q = loaderQuery(request);
      const data = await q({ user: { me: { _id: true, email: true, createdAt: true } } });
      return data.user?.me ?? null;
    },
  });

  await queryClient.fetchQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const q = loaderQuery(request);
      const data = await q({ user: { sessions: sessionSelector } });
      return data.user?.sessions ?? [];
    },
  });

  return {
    meta: { title: 'Settings — Axolotl', description: '' },
    dehydratedState: dehydrate(queryClient),
  };
};

// --- Inner content (uses hooks that benefit from HydrationBoundary) ---

const SettingsContent = () => {
  const { t } = useDynamite();

  return (
    <div className="min-h-full bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('Settings')}</h1>
            <p className="text-sm text-muted-foreground">{t('Manage your account settings and preferences.')}</p>
          </div>
        </div>

        <ProfileSection />
        <ChangePasswordSection />
        <SessionsSection />
        <DeleteAccountSection />
      </div>
    </div>
  );
};

// --- Page Component ---

export const Settings = () => {
  const { dehydratedState } = useLoaderData<typeof settingsLoader>();
  return (
    <HydrationBoundary state={dehydratedState}>
      <SettingsContent />
    </HydrationBoundary>
  );
};
