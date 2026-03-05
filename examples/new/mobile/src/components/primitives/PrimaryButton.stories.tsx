import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-ondevice-actions'

import { PrimaryButton } from './PrimaryButton'

const meta: Meta<typeof PrimaryButton> = {
  title: 'Primitives/PrimaryButton',
  component: PrimaryButton,
  args: {
    label: 'Continue',
    testID: 'storybook-primary-button-btn',
    onPress: action('primary-button-press'),
    disabled: false,
    size: 'md',
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'radio',
      options: ['solid', 'soft', 'outline', 'ghost', 'danger'],
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta

type Story = StoryObj<typeof PrimaryButton>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
    testID: 'storybook-primary-button-disabled-btn',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    testID: 'storybook-primary-button-small-btn',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    testID: 'storybook-primary-button-large-btn',
  },
}

export const Soft: Story = {
  args: {
    variant: 'soft',
    testID: 'storybook-primary-button-soft-btn',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    testID: 'storybook-primary-button-outline-btn',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    testID: 'storybook-primary-button-ghost-btn',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    testID: 'storybook-primary-button-danger-btn',
  },
}
