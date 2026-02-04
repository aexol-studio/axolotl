import { redirect, useNavigate, Link } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import { useUserQuery } from '@/api/hooks';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, LogOut, User, Hash } from 'lucide-react';

export async function loader() {
  if (typeof window === 'undefined') {
    return redirect('/login');
  }

  const { user, token } = useAuthStore.getState();
  if (!user || !token) {
    return redirect('/login');
  }

  return { user };
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser } = useAuthStore();

  const userQuery = useUserQuery(authUser?.id);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">Profile</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Query Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <span className="text-muted-foreground text-sm">React Query Status</span>
            <Badge variant={userQuery.isFetching ? 'outline' : userQuery.error ? 'destructive' : 'default'}>
              {userQuery.isFetching ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Loading
                </>
              ) : userQuery.error ? (
                '✗ Error'
              ) : (
                '✓ Loaded'
              )}
            </Badge>
          </div>

          {/* User Info Card */}
          {userQuery.isLoading ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : userQuery.error ? (
            <Alert variant="destructive">
              <AlertDescription>Error loading profile: {String(userQuery.error)}</AlertDescription>
            </Alert>
          ) : userQuery.data ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {userQuery.data.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{userQuery.data.name}</h3>
                    <p className="text-muted-foreground text-sm">Member</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">Name</span>
                    <span className="ml-auto font-medium">{userQuery.data.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">User ID</span>
                    <code className="ml-auto text-xs font-mono bg-muted px-2 py-1 rounded">{userQuery.data.id}</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">No user data available</p>
              </CardContent>
            </Card>
          )}

          {/* Info Note */}
          <Alert className="border-blue-500 bg-blue-500/10">
            <AlertDescription className="text-blue-600 dark:text-blue-400 text-sm text-center">
              Protected route with React Query data fetching.
              <br />
              <span className="text-xs">useUserQuery manages loading, error & success states.</span>
            </AlertDescription>
          </Alert>

          {/* Logout Button */}
          <Button onClick={handleLogout} variant="destructive" className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </CardContent>

        <CardFooter className="gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to="/settings">Settings</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
