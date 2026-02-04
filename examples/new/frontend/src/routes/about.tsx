import { Link } from 'react-router';
import { toast } from 'sonner';
import { useItemsInfiniteQuery } from '@/api/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Loader2,
  Sparkles,
  Zap,
  Compass,
  RefreshCw,
  Palette,
  BarChart3,
  Shield,
  Moon,
  Component,
  FileCode,
  Bell,
} from 'lucide-react';

interface Item {
  id: number;
  title: string;
  description: string;
}

interface ItemsPage {
  items: Item[];
  nextCursor: number | null;
}

const stackFeatures = [
  { icon: Sparkles, label: 'React 19 with Server Components', color: 'text-pink-500', isNew: false },
  { icon: Zap, label: 'Vite SSR', color: 'text-yellow-500', isNew: false },
  { icon: Compass, label: 'React Router 7.12.0 Data Router', color: 'text-blue-500', isNew: false },
  { icon: RefreshCw, label: 'TanStack React Query v5', color: 'text-green-500', isNew: false },
  { icon: Palette, label: 'Tailwind CSS 4', color: 'text-cyan-500', isNew: false },
  { icon: BarChart3, label: 'GraphQL with Axolotl', color: 'text-purple-500', isNew: false },
  { icon: Shield, label: 'Protected routes with Zustand auth', color: 'text-orange-500', isNew: false },
  // New features after Zustand auth
  { icon: Component, label: 'shadcn/ui component library (50+ components)', color: 'text-foreground', isNew: true },
  { icon: Moon, label: 'Dark/Light/System theme with ThemeProvider', color: 'text-indigo-500', isNew: true },
  { icon: Palette, label: 'CSS variables theming (Tailwind v4 @theme inline)', color: 'text-teal-500', isNew: true },
  { icon: FileCode, label: 'react-hook-form + zod validation', color: 'text-rose-500', isNew: true },
  { icon: Sparkles, label: 'Sonner toast notifications', color: 'text-amber-500', isNew: true },
];

export default function AboutPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useItemsInfiniteQuery();

  const baseFeatures = stackFeatures.filter((f) => !f.isNew);
  const newFeatures = stackFeatures.filter((f) => f.isNew);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-20">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">About</CardTitle>
          <CardDescription>React Router 7.12 + Vite SSR + React Query v5</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tech Stack - All in one card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tech Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Base features */}
              {baseFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <feature.icon className={`h-4 w-4 ${feature.color}`} />
                  <span className="text-sm">{feature.label}</span>
                </div>
              ))}

              {/* Separator with label */}
              <div className="flex items-center gap-3 py-2">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">Added after Zustand auth</span>
                <Separator className="flex-1" />
              </div>

              {/* New features */}
              {newFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <feature.icon className={`h-4 w-4 ${feature.color}`} />
                  <span className="text-sm">{feature.label}</span>
                  <Badge variant="default" className="ml-auto bg-green-500 text-white text-xs">
                    new
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Toast Demo */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Toast Demo (Sonner)
              </CardTitle>
              <CardDescription>Test different toast notification variants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => toast.success('Success!', { description: 'Operation completed successfully.' })}
                  className="border-green-500 text-green-600 hover:bg-green-500/10"
                >
                  ✓ Success
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.info('Info', { description: 'Here is some useful information.' })}
                  className="border-blue-500 text-blue-600 hover:bg-blue-500/10"
                >
                  ℹ Info
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.warning('Warning', { description: 'Please review before continuing.' })}
                  className="border-yellow-500 text-yellow-600 hover:bg-yellow-500/10"
                >
                  ⚠ Warning
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.error('Error', { description: 'Something went wrong. Please try again.' })}
                  className="border-red-500 text-red-600 hover:bg-red-500/10"
                >
                  ✕ Error
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Click any button to trigger a toast notification
              </p>
            </CardContent>
          </Card>

          {/* Infinite Query Demo */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Infinite Query Demo</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading items...</span>
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertDescription>Error: {String(error)}</AlertDescription>
                </Alert>
              ) : (
                <>
                  <ScrollArea className="h-64 rounded-md border p-2">
                    {data?.pages.map((page: ItemsPage, pageIndex: number) => (
                      <div key={pageIndex} className="space-y-2">
                        {page.items.map((item: Item) => (
                          <Card key={item.id}>
                            <CardContent className="p-3">
                              <p className="font-medium text-sm">{item.title}</p>
                              <p className="text-muted-foreground text-xs">{item.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ))}
                  </ScrollArea>

                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                    className="w-full mt-4"
                    variant="secondary"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading more...
                      </>
                    ) : hasNextPage ? (
                      'Load More'
                    ) : (
                      'No more items'
                    )}
                  </Button>

                  <div className="mt-3 text-center text-xs text-muted-foreground">
                    Loaded {data?.pages.length || 0} page(s) ·{' '}
                    {data?.pages.reduce((acc: number, page: ItemsPage) => acc + page.items.length, 0) || 0} total items
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Info Note */}
          <Alert className="border-blue-500 bg-blue-500/10">
            <AlertTitle className="text-blue-600 dark:text-blue-400">useInfiniteQuery example</AlertTitle>
            <AlertDescription className="text-blue-600 dark:text-blue-400 text-sm">
              Protected route: Login → Profile requires authentication
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="gap-3">
          <Button asChild className="flex-1">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="secondary" className="flex-1">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to="/settings">Settings</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
