import { Link } from 'react-router';
import { useSettingsQuery, queryKeys } from '@/api/hooks';
import { getQueryClient } from '@/api/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, RefreshCw, Moon, Bell, Globe, Clock } from 'lucide-react';

export async function loader() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.settings,
    queryFn: async () => {
      return {
        updatedAt: new Date().toISOString(),
        theme: 'dark',
        notifications: true,
        language: 'en',
      };
    },
  });

  return null;
}

export default function SettingsPage() {
  const settingsQuery = useSettingsQuery();

  const handleRefresh = () => {
    settingsQuery.refetch();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">Settings</CardTitle>
          <CardDescription>Manage your preferences</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Query Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Status</span>
              <Badge variant={settingsQuery.isFetching ? 'outline' : 'default'}>
                {settingsQuery.isFetching ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Fetching
                  </>
                ) : (
                  '✓ Ready'
                )}
              </Badge>
            </div>
            <Button size="sm" variant="secondary" onClick={handleRefresh} disabled={settingsQuery.isFetching}>
              <RefreshCw className={`h-4 w-4 mr-1 ${settingsQuery.isFetching ? 'animate-spin' : ''}`} />
              Refetch
            </Button>
          </div>

          {/* Settings Grid */}
          {settingsQuery.isLoading ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : settingsQuery.error ? (
            <Alert variant="destructive">
              <AlertDescription>Error: {String(settingsQuery.error)}</AlertDescription>
            </Alert>
          ) : settingsQuery.data ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Moon className="h-4 w-4 text-muted-foreground" />
                    <span>Theme</span>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {settingsQuery.data.theme}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span>Notifications</span>
                  </div>
                  <Switch checked={settingsQuery.data.notifications} disabled />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>Language</span>
                  </div>
                  <Badge variant="outline" className="uppercase">
                    {settingsQuery.data.language}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Last Updated</span>
                  </div>
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    {new Date(settingsQuery.data.updatedAt).toLocaleTimeString()}
                  </code>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Data Freshness Info */}
          <Alert className="border-blue-500 bg-blue-500/10">
            <AlertTitle className="text-blue-600 dark:text-blue-400">React Query Cache</AlertTitle>
            <AlertDescription className="text-blue-600 dark:text-blue-400 text-sm">
              Data is automatically managed with stale/fresh states. Click "Refetch" to manually refresh settings.
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to="/profile">Profile</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
