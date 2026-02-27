import { useRouteError } from 'react-router';

export const ErrorPage = () => {
  const error = useRouteError();
  const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
};
