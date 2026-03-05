import type { Meta, StoryObj } from '@storybook/react'

import { OnboardingScreen } from './OnboardingScreen'

const meta: Meta<typeof OnboardingScreen> = {
  title: 'Flows/OnboardingFlow',
  component: OnboardingScreen,
  args: {
    onFinish: () => undefined,
  },
}

export default meta

type Story = StoryObj<typeof OnboardingScreen>

export const Default: Story = {}
