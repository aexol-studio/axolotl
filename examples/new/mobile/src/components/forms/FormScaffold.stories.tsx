import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-ondevice-actions';

import { FormScaffold } from './FormScaffold';
import { AppInput } from '../primitives/AppInput';

const meta: Meta<typeof FormScaffold> = {
  title: 'Forms/FormScaffold',
  component: FormScaffold,
  args: {
    testID: 'storybook-auth-form-scaffold',
    ctaVariant: 'sticky',
    ctaLabel: 'Continue',
    ctaTestID: 'storybook-auth-submit-btn',
    onCtaPress: action('form-cta-press'),
  },
  render: (args) => (
    <FormScaffold {...args}>
      <AppInput testID="storybook-auth-email-input" placeholder="Email" value="" onChangeText={() => undefined} />
    </FormScaffold>
  ),
};

export default meta;

type Story = StoryObj<typeof FormScaffold>;

export const StickyCta: Story = {};

export const TopCta: Story = {
  args: {
    ctaVariant: 'top',
    ctaTestID: 'storybook-auth-top-submit-btn',
  },
};
