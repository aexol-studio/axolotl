import { Outlet, useLoaderData } from 'react-router';
import { QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { DynamiteProvider } from '@aexol/dynamite';
import { queryClient } from '@/lib/queryClient';
import { TopNav, ThemeProvider } from '@/components/global';
import { Toaster } from '@/components/ui/Sonner';
import { MetaUpdater } from './MetaUpdater';
import type { RootLoaderData } from './index';

export const RootLayout = () => {
  const { locale, translations, dehydratedState } = useLoaderData() as RootLoaderData;
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <DynamiteProvider translations={translations} locale={locale}>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydratedState}>
            <div className="flex min-h-full flex-col">
              <TopNav />
              <main className="flex-1">
                <MetaUpdater />
                <Outlet />
              </main>
            </div>
            <Toaster richColors position="top-right" />
          </HydrationBoundary>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </DynamiteProvider>
    </ThemeProvider>
  );
};
