import { Link } from 'react-router';
import { Home } from 'lucide-react';
import { useDynamite } from '@aexol/dynamite';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export const NotFound = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useDynamite();

  return (
    <div className="min-h-full flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <p className="text-8xl font-bold text-muted-foreground/20">404</p>
        <h1 className="text-2xl font-semibold text-foreground">{t('Page Not Found')}</h1>
        <p className="text-muted-foreground">{t("The page you're looking for doesn't exist or has been moved.")}</p>
        <div className="pt-2">
          <Button asChild>
            <Link to={isAuthenticated ? '/app' : '/'}>
              <Home />
              {t('Back to Home')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
