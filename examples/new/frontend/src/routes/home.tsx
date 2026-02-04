import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { useHelloQuery, useEchoMutation, queryKeys } from '@/api/hooks';
import { getQueryClient } from '@/api/queryClient';
import { gql } from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export async function loader() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.hello,
    queryFn: async () => {
      const data = await gql.query.hello();
      return data.hello;
    },
  });

  const initialData = queryClient.getQueryData(queryKeys.hello);
  return { initialData };
}

export default function HomePage() {
  const loaderData = useLoaderData<typeof loader>();
  const [echoInput, setEchoInput] = useState('');

  const helloQuery = useHelloQuery();
  const echoMutation = useEchoMutation();

  const handleEcho = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!echoInput.trim()) return;

    try {
      await echoMutation.mutateAsync(echoInput);
      setEchoInput('');
    } catch (error) {
      console.error('Echo failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">Axolotl</CardTitle>
          <CardDescription>React Query + GraphQL + React Router</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Hello Query */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                Query: hello
                {helloQuery.isFetching && (
                  <Badge variant="outline">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    refetching
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {helloQuery.isLoading ? (
                <Alert>
                  <AlertDescription>Loading...</AlertDescription>
                </Alert>
              ) : helloQuery.error ? (
                <Alert variant="destructive">
                  <AlertDescription>Error: {String(helloQuery.error)}</AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-green-500 bg-green-500/10">
                  <AlertDescription className="text-green-600 dark:text-green-400">{helloQuery.data}</AlertDescription>
                </Alert>
              )}
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Status:{' '}
                  <Badge variant="secondary" className="ml-1">
                    {helloQuery.status}
                  </Badge>
                </span>
                <span>
                  Data:{' '}
                  <Badge variant="outline" className="ml-1">
                    {helloQuery.dataUpdatedAt ? 'fresh' : loaderData.initialData ? 'from loader' : 'none'}
                  </Badge>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Echo Mutation */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                Mutation: echo
                {echoMutation.isPending && (
                  <Badge variant="outline">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    sending
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEcho} className="flex gap-2">
                <Input
                  type="text"
                  value={echoInput}
                  onChange={(e) => setEchoInput(e.target.value)}
                  placeholder="Enter a message..."
                  disabled={echoMutation.isPending}
                />
                <Button type="submit" disabled={echoMutation.isPending || !echoInput.trim()}>
                  {echoMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Echo'}
                </Button>
              </form>
              {echoMutation.data && (
                <Alert className="mt-3 border-blue-500 bg-blue-500/10">
                  <AlertDescription className="text-blue-600 dark:text-blue-400">{echoMutation.data}</AlertDescription>
                </Alert>
              )}
              {!!echoMutation.error && (
                <Alert variant="destructive" className="mt-3">
                  <AlertDescription>Error: {String(echoMutation.error)}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Alert className="border-purple-500 bg-purple-500/10">
            <AlertDescription className="text-purple-600 dark:text-purple-400 text-xs text-center">
              ✨ Hybrid approach: Loader prefetches → React Query manages state
              <br />
              🔄 Echo mutation auto-invalidates hello query
            </AlertDescription>
          </Alert>
          <p className="text-muted-foreground text-xs">
            GraphQL endpoint: <code className="text-primary bg-muted px-1.5 py-0.5 rounded">/graphql</code>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
