import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { useDynamite } from '@aexol/dynamite';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { useSettings } from '../Settings.hook';
import { useAuth } from '@/hooks';

export const DeleteAccountSection = () => {
  const { t } = useDynamite();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const { deleteAccount } = useSettings();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!password.trim()) return;

    try {
      await deleteAccount.mutateAsync(password);
      setOpen(false);
      toast.info(t('Account deleted'));
      await logout();
      navigate('/');
    } catch {
      // Error toast is handled by global error handler or we show inline
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setPassword('');
      deleteAccount.reset();
    }
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-lg text-destructive-foreground">{t('Danger Zone')}</CardTitle>
        <CardDescription>
          {t('Permanently delete your account and all associated data. This action cannot be undone.')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              {t('Delete Account')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('Are you absolutely sure?')}</DialogTitle>
              <DialogDescription>
                {t(
                  'This will permanently delete your account, all your data, and revoke all active sessions. This action cannot be undone.',
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <label htmlFor="delete-password" className="text-sm font-medium text-foreground">
                {t('Enter your password to confirm')}
              </label>
              <Input
                id="delete-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('Your password')}
                autoComplete="current-password"
              />
              {deleteAccount.isError && (
                <p className="text-sm text-destructive">
                  {t('Deletion failed. Please check your password and try again.')}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                {t('Cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={!password.trim() || deleteAccount.isPending}
              >
                {deleteAccount.isPending ? t('Deleting...') : t('Delete Permanently')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
