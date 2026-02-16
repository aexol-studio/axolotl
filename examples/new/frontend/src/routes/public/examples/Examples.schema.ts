import { z } from 'zod';

export const createContactFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, t('Name must be at least 2 characters')),
    email: z.string().email(t('Please enter a valid email address')),
    message: z
      .string()
      .min(10, t('Message must be at least 10 characters'))
      .max(1000, t('Message must be at most 1000 characters')),
  });

export type ContactFormValues = z.infer<ReturnType<typeof createContactFormSchema>>;

export const createSettingsFormSchema = (t: (key: string) => string) =>
  z.object({
    displayName: z.string().min(2, t('Display name must be at least 2 characters')),
    notifications: z.boolean(),
    theme: z.enum(['light', 'dark', 'system']),
    bio: z.string().max(200, t('Bio must be at most 200 characters')).optional().or(z.literal('')),
  });

export type SettingsFormValues = z.infer<ReturnType<typeof createSettingsFormSchema>>;

export const createChangePasswordSchema = (t: (key: string) => string) =>
  z.object({
    oldPassword: z.string().min(6, t('Old password must be at least 6 characters')),
    password: z.string().min(6, t('Password must be at least 6 characters')),
  });

export type ChangePasswordValues = z.infer<ReturnType<typeof createChangePasswordSchema>>;
