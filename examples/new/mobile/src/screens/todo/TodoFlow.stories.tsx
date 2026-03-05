import { useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { SpotlightProvider } from '../../features/spotlight/SpotlightContext'
import { useAuthStore } from '../../stores/authStore'
import {
  clearTodoOfflineState,
  enqueueTodoOperation,
  saveTodoSnapshot,
} from '../../features/todo/offlinePersistence'
import { TodoScreen } from './TodoScreen'

const DemoOfflineStateSeed = () => {
  useEffect(() => {
    useAuthStore.getState().setAccessToken('storybook-token')

    const seed = async () => {
      await clearTodoOfflineState()
      await saveTodoSnapshot([
        {
          id: 'story-1',
          title: 'Seeded offline snapshot todo',
          completed: false,
        },
      ])
      await enqueueTodoOperation({
        type: 'create',
        payload: {
          content: 'Queued offline create from story',
        },
      })
      await enqueueTodoOperation({
        type: 'markDone',
        payload: {
          todoId: 'story-1',
        },
      })
    }

    void seed()

    return () => {
      void clearTodoOfflineState()
      useAuthStore.getState().clearSession()
    }
  }, [])

  return null
}

const StoryWrapper = ({
  children,
  offlineSeed = false,
}: {
  children: ReactNode
  offlineSeed?: boolean
}) => (
  <SpotlightProvider>
    {offlineSeed ? <DemoOfflineStateSeed /> : null}
    {children}
  </SpotlightProvider>
)

const meta: Meta<typeof TodoScreen> = {
  title: 'Flows/TodoFlow',
  render: () => (
    <StoryWrapper>
      <TodoScreen />
    </StoryWrapper>
  ),
}

export default meta

type Story = StoryObj<typeof TodoScreen>

export const Default: Story = {}

export const OfflinePendingState: Story = {
  render: () => (
    <StoryWrapper offlineSeed>
      <TodoScreen />
    </StoryWrapper>
  ),
}
