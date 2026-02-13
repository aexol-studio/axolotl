import { Send, Settings } from 'lucide-react';
import { useDynamite } from '@aexol/dynamite';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Separator } from '@/components/ui/Separator';
import { Switch } from '@/components/ui/Switch';
import { Textarea } from '@/components/ui/Textarea';

import { useFormsShowcase } from './FormsShowcaseTab.hook';

export const FormsShowcaseTab = () => {
  const { t } = useDynamite();
  const { contactForm, onContactSubmit, settingsForm, onSettingsSubmit } = useFormsShowcase();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">React Hook Form + Zod</h3>
        <p className="text-sm text-muted-foreground">
          {t(
            'These forms demonstrate the integration of react-hook-form with zod validation and shadcn/ui form components. Try submitting with invalid data to see the validation messages.',
          )}
        </p>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Send className="h-5 w-5" />
              {t('Contact Form')}
            </CardTitle>
            <CardDescription>
              {t('A simple form with text inputs and validation using react-hook-form + zod.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...contactForm}>
              <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                <FormField
                  control={contactForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('Your name')} autoComplete="name" {...field} />
                      </FormControl>
                      <FormDescription>{t('Enter your full name.')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={contactForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Email')}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" autoComplete="email" {...field} />
                      </FormControl>
                      <FormDescription>{t('We will never share your email.')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={contactForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Message')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('Tell us what you think...')} className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormDescription>{t('Between 10 and 1000 characters.')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={contactForm.formState.isSubmitting}>
                  <Send className="h-4 w-4" />
                  {t('Send Message')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Settings Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              {t('Settings Form')}
            </CardTitle>
            <CardDescription>
              {t('A complex form showcasing switches, selects, and textareas inside FormField components.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...settingsForm}>
              <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-6">
                <FormField
                  control={settingsForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Display Name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('How others see you')} autoComplete="nickname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={settingsForm.control}
                  name="notifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">{t('Push Notifications')}</FormLabel>
                        <FormDescription>{t('Receive notifications about account activity.')}</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={settingsForm.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Theme')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('Select a theme')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="light">{t('Light')}</SelectItem>
                          <SelectItem value="dark">{t('Dark')}</SelectItem>
                          <SelectItem value="system">{t('System')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>{t('Choose your preferred color scheme.')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={settingsForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Bio')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('Tell us about yourself (optional)')}
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>{t('Maximum 200 characters. This is optional.')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={settingsForm.formState.isSubmitting}>
                  <Settings className="h-4 w-4" />
                  {t('Save Settings')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
