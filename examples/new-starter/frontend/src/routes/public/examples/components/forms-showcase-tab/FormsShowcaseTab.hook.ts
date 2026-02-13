import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useDynamite } from '@aexol/dynamite';

import {
  createContactFormSchema,
  createSettingsFormSchema,
  type ContactFormValues,
  type SettingsFormValues,
} from '../../Examples.schema';

export const useFormsShowcase = () => {
  const { t } = useDynamite();

  // Contact form
  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(createContactFormSchema(t)),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onContactSubmit = (values: ContactFormValues) => {
    toast.success(t('Contact form submitted!'), {
      description: `${t('Name')}: ${values.name}, ${t('Email')}: ${values.email}`,
    });
    contactForm.reset();
  };

  // Settings form
  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(createSettingsFormSchema(t)),
    defaultValues: {
      displayName: '',
      notifications: true,
      theme: 'system',
      bio: '',
    },
  });

  const onSettingsSubmit = (values: SettingsFormValues) => {
    toast.success(t('Settings saved!'), {
      description: `${t('Theme')}: ${values.theme}, ${t('Notifications')}: ${values.notifications ? t('On') : t('Off')}`,
    });
  };

  return { contactForm, onContactSubmit, settingsForm, onSettingsSubmit };
};
