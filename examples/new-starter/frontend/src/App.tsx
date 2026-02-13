// Main App component - Router wrapper with theme support
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppRoutes } from './routes';
import { ThemeProvider } from '@/components/global/ThemeProvider';
import { TopNav } from '@/components/global/TopNav';
import { Toaster } from '@/components/ui/Sonner';
import { queryClient } from './lib/queryClient';

export const App = () => {
  console.log('API URL:', import.meta.env.VITE_API_URL); // Debug log for API URL
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
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
    </ThemeProvider>
  );
};
