import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be at most 1000 characters'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const settingsFormSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  notifications: z.boolean(),
  theme: z.enum(['light', 'dark', 'system']),
  bio: z.string().max(200, 'Bio must be at most 200 characters').optional().or(z.literal('')),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, 'Old password must be at least 6 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
