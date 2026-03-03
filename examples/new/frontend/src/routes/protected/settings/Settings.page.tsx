import { useLoaderData } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Settings as SettingsIcon } from 'lucide-react';
import { useDynamite } from '@aexol/dynamite';
import { queryClient, type AppLoadContext } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys.js';
import { loaderQuery, sessionSelector } from '@/api';
import { ProfileSection, ChangePasswordSection, SessionsSection, DeleteAccountSection } from './components';

// --- Loader ---

export const settingsLoader = async ({ request, context }: LoaderFunctionArgs) => {
  const qc = (context as AppLoadContext | undefined)?.queryClient ?? queryClient;
  await qc.fetchQuery({
    queryKey: queryKeys.sessions,
    queryFn: async () => {
      const q = loaderQuery(request);
      const data = await q({ user: { sessions: sessionSelector } });
      return data.user?.sessions ?? [];
    },
  });

  return {
    meta: { title: 'Settings — Axolotl', description: '' },
    dehydratedState: dehydrate(qc),
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
