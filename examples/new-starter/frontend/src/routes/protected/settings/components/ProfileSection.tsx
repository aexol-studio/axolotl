import { User, Calendar } from 'lucide-react';
import { useDynamite } from '@aexol/dynamite';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks';

const getInitials = (email: string): string => {
  return email.slice(0, 2).toUpperCase();
};

export const ProfileSection = () => {
  const { t, locale } = useDynamite();
  const { user, isLoading } = useAuth();

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('Profile')}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ) : user ? (
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-semibold">
              {getInitials(user.email)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{user.email}</span>
              </div>
              {user.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {t('Member since {{date}}', { date: formatDate(user.createdAt) })}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t('Unable to load profile information.')}</p>
        )}
      </CardContent>
    </Card>
  );
};
