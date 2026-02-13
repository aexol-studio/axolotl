import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, User, LogOut, Home, ListTodo, Blocks, LogIn, Settings as SettingsIcon } from 'lucide-react';
import { useDynamite } from '@aexol/dynamite';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from '../atoms/ThemeToggle';
import { LanguageSwitcher } from '../atoms/LanguageSwitcher';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Separator } from '@/components/ui/Separator';

type NavItem = {
  path: string;
  label: string;
  icon: typeof Home;
  authRequired?: boolean;
};

const getNavItems = (isAuthenticated: boolean, t: (key: string) => string): NavItem[] => [
  ...(isAuthenticated ? [] : [{ path: '/', label: t('Home'), icon: Home } as const satisfies NavItem]),
  { path: '/app', label: t('My Todos'), icon: ListTodo, authRequired: true },
  { path: '/examples', label: t('Examples'), icon: Blocks },
];

const isLinkActive = (pathname: string, itemPath: string): boolean => pathname === itemPath;

const getVisibleNavItems = (items: NavItem[], isAuthenticated: boolean): NavItem[] =>
  items.filter((item) => !item.authRequired || isAuthenticated);

const getUserInitial = (email: string | undefined): string => (email ? email.charAt(0).toUpperCase() : '?');

export const TopNav = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { t } = useDynamite();

  const visibleItems = getVisibleNavItems(getNavItems(isAuthenticated, t), isAuthenticated);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        {/* Mobile: hamburger + logo + theme toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSheetOpen(true)} aria-label={t('Open menu')}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link to={isAuthenticated ? '/app' : '/'} className="text-lg font-bold text-foreground">
            Axolotl
          </Link>
        </div>

        {/* Desktop: logo */}
        <div className="hidden md:flex">
          <Link to={isAuthenticated ? '/app' : '/'} className="text-lg font-bold text-foreground">
            Axolotl
          </Link>
        </div>

        {/* Desktop: center nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {visibleItems.map((item) => {
            const active = isLinkActive(location.pathname, item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop: right section */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {!isAuthenticated && (
            <Button variant="default" size="sm" asChild>
              <Link to="/login">
                <LogIn />
                {t('Sign In')}
              </Link>
            </Button>
          )}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getUserInitial(user?.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user?.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/settings">
                    <SettingsIcon className="h-4 w-4" />
                    <span>{t('Settings')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  <span>{t('Logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile: theme toggle and language switcher (always visible) */}
        <div className="flex items-center gap-1 md:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile: Sheet drawer */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="p-6 pb-2">
            <SheetTitle className="text-lg font-bold">Axolotl</SheetTitle>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">
            <nav className="flex flex-col gap-1 px-4 py-2">
              {visibleItems.map((item) => {
                const active = isLinkActive(location.pathname, item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setSheetOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      active
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="px-4 py-2">
              <Separator />
            </div>

            <div className="px-4 py-2 mt-auto">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                  >
                    <SettingsIcon className="h-4 w-4" />
                    <span>{t('Settings')}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setSheetOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('Logout')}</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>{t('Login')}</span>
                </Link>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};
