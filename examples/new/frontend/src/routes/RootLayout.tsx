import { Outlet, useLoaderData } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { DynamiteProvider } from '@aexol/dynamite';
import { queryClient } from '@/lib/queryClient';
import { TopNav, ThemeProvider } from '@/components/global';
import { Toaster } from '@/components/ui/Sonner';
import { MetaUpdater } from './MetaUpdater';
import type { rootLoader } from './index';

export const RootLayout = () => {
  const { locale, translations } = useLoaderData<typeof rootLoader>();
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <DynamiteProvider translations={translations} locale={locale}>
        <QueryClientProvider client={queryClient}>
          <div className="flex min-h-full flex-col">
            <TopNav />
            <main className="flex-1">
              <MetaUpdater />
              <Outlet />
            </main>
          </div>
          <Toaster richColors position="top-right" />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </DynamiteProvider>
    </ThemeProvider>
  );
};
