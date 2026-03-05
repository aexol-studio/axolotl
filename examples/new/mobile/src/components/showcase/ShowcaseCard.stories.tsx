import type { Meta, StoryObj } from '@storybook/react'

import { ShowcaseCard } from './ShowcaseCard'

const meta: Meta<typeof ShowcaseCard> = {
  title: 'Showcase/ShowcaseCard',
  component: ShowcaseCard,
  args: {
    testID: 'storybook-showcase-card-btn',
    tag: 'Design system',
    title: 'Token-first visual language',
    description:
      'Use spacing, shape, and color tokens for scalable card composition.',
    ctaLabel: 'Open design',
    meta: 'AI card · gradient · 4 quick chips',
    tone: 'darkAi',
    variant: 'elevated',
    onPress: () => undefined,
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['elevated', 'outlined', 'compact'],
    },
  },
}

export default meta

type Story = StoryObj<typeof ShowcaseCard>

export const Default: Story = {}

export const Travel: Story = {
  args: {
    testID: 'storybook-showcase-card-travel-btn',
    tag: 'Travel itinerary',
    title: 'Compact route card',
    description: 'Image-led card with compact metadata and dense details.',
    ctaLabel: 'Open trip',
    meta: 'Travel card · compact metadata · 2 routes',
    tone: 'travel',
  },
}

export const PastelInvoice: Story = {
  args: {
    testID: 'storybook-showcase-card-invoice-btn',
    tag: 'Invoice activity',
    title: 'Soft grouped actions',
    description:
      'Pastel invoice card with grouped chips and rounded hierarchy.',
    ctaLabel: 'Open invoice',
    meta: 'Invoice card · grouped chips · recent activity',
    tone: 'pastelInvoice',
  },
}

export const Outlined: Story = {
  args: {
    testID: 'storybook-showcase-card-outlined-btn',
    variant: 'outlined',
  },
}

export const Compact: Story = {
  args: {
    testID: 'storybook-showcase-card-compact-btn',
    variant: 'compact',
  },
}
