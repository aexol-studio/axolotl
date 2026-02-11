import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export const GuestLayout = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
};
