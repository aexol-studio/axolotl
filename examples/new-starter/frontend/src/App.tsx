// Main App component - Router wrapper with theme, i18n, and data fetching support
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { DynamiteProvider } from '@aexol/dynamite';
import type { TranslationMap } from '@aexol/dynamite';
import { AppRoutes } from './routes';
import { ThemeProvider } from '@/components/global/ThemeProvider';
import { TopNav } from '@/components/global/TopNav';
import { Toaster } from '@/components/ui/Sonner';
import { queryClient } from './lib/queryClient';

interface AppProps {
  /** Pre-loaded translations for SSR — avoids fetch waterfall on first render */
  initialTranslations?: TranslationMap;
  /** Initial locale matching the pre-loaded translations */
  initialLocale?: string;
}

export const App = ({ initialTranslations = {}, initialLocale = 'en' }: AppProps) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <DynamiteProvider translations={initialTranslations} locale={initialLocale}>
        <QueryClientProvider client={queryClient}>
          <div className="flex min-h-full flex-col">
            <TopNav />
            <main className="flex-1">
              <AppRoutes />
            </main>
          </div>
          <Toaster richColors position="top-right" />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </DynamiteProvider>
    </ThemeProvider>
  );
};
