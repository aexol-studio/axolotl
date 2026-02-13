import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDynamite } from '@aexol/dynamite';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/Form';
import { useSettings } from '../Settings.hook';

const createChangePasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      oldPassword: z.string().min(1, t('Current password is required')),
      newPassword: z.string().min(6, t('New password must be at least 6 characters')),
      confirmPassword: z.string().min(1, t('Please confirm your new password')),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('Passwords do not match'),
      path: ['confirmPassword'],
    });

type ChangePasswordFormValues = z.infer<ReturnType<typeof createChangePasswordSchema>>;

export const ChangePasswordSection = () => {
  const { t } = useDynamite();
  const { changePassword } = useSettings();

  const changePasswordSchema = createChangePasswordSchema(t);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await changePassword.mutateAsync({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      form.reset();
    } catch {
      form.setError('root', {
        message: t('Failed to change password. Please check your current password.'),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('Change Password')}</CardTitle>
        <CardDescription>{t('Update your password to keep your account secure.')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Current Password')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" autoComplete="current-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('New Password')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" autoComplete="new-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Confirm New Password')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" autoComplete="new-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            )}
            <Button type="submit" disabled={changePassword.isPending || form.formState.isSubmitting}>
              {changePassword.isPending ? t('Changing...') : t('Change Password')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
