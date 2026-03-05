import type { Meta, StoryObj } from '@storybook/react'

import { TodoScreen } from './TodoScreen'

const meta: Meta<typeof TodoScreen> = {
  title: 'Flows/SpotlightFlow',
  component: TodoScreen,
}

export default meta

type Story = StoryObj<typeof TodoScreen>

export const Default: Story = {}
