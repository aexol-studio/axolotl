import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  contactFormSchema,
  settingsFormSchema,
  type ContactFormValues,
  type SettingsFormValues,
} from '../../Examples.schema';

export const useFormsShowcase = () => {
  // Contact form
  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onContactSubmit = (values: ContactFormValues) => {
    toast.success('Contact form submitted!', {
      description: `Name: ${values.name}, Email: ${values.email}`,
    });
    contactForm.reset();
  };

  // Settings form
  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      displayName: '',
      notifications: true,
      theme: 'system',
      bio: '',
    },
  });

  const onSettingsSubmit = (values: SettingsFormValues) => {
    toast.success('Settings saved!', {
      description: `Theme: ${values.theme}, Notifications: ${values.notifications ? 'On' : 'Off'}`,
    });
  };

  return { contactForm, onContactSubmit, settingsForm, onSettingsSubmit };
};
