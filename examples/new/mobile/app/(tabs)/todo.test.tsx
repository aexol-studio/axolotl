import { fireEvent, render, screen } from '@testing-library/react-native'

import TodoRoute from './todo'
import { SpotlightProvider } from '../../src/features/spotlight/SpotlightContext'
import type { TodoItem, TodoStats } from '../../src/screens/todo/types'

const mockUseAuthSession = jest.fn()
const mockUseTodoShowcaseState = jest.fn()

jest.mock('../../src/features/auth/useAuthSession', () => ({
  useAuthSession: () => mockUseAuthSession(),
}))

jest.mock('../../src/screens/todo/useTodoShowcaseState', () => ({
  useTodoShowcaseState: () => mockUseTodoShowcaseState(),
}))

const todoItems: readonly TodoItem[] = [
  {
    id: 'todo-1',
    title: 'Ship mobile todo flow',
    completed: false,
  },
]

const todoStats: TodoStats = {
  total: 1,
  active: 1,
  completed: 0,
}

const renderTodoRoute = () => {
  return render(
    <SpotlightProvider>
      <TodoRoute />
    </SpotlightProvider>,
  )
}

describe('app/(tabs)/todo', () => {
  beforeEach(() => {
    mockUseAuthSession.mockReturnValue({
      isAuthenticated: true,
    })

    mockUseTodoShowcaseState.mockReturnValue({
      composerValue: '',
      setComposerValue: jest.fn(),
      filter: 'all',
      setFilter: jest.fn(),
      filteredTodos: todoItems,
      stats: todoStats,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      isMutating: false,
      addTodo: jest.fn(async () => true),
      toggleTodo: jest.fn(async () => undefined),
      refetch: jest.fn(async () => undefined),
    })
  })

  it('supports add/toggle/filter actions for backend-backed flow', () => {
    renderTodoRoute()

    fireEvent.changeText(
      screen.getByTestId('todo-composer-input'),
      'Ship mobile todo flow',
    )
    fireEvent.press(screen.getByTestId('todo-composer-add-btn'))

    expect(screen.getByTestId('todo-list-section')).toBeTruthy()

    fireEvent.press(screen.getByTestId('todo-item-0-toggle-btn'))
    fireEvent.press(screen.getByTestId('todo-filter-completed-btn'))
    fireEvent.press(screen.getByTestId('todo-clear-completed-btn'))

    expect(screen.getByTestId('todo-clear-completed-btn')).toBeTruthy()
  })

  it('shows auth-required state when session is missing', () => {
    mockUseAuthSession.mockReturnValueOnce({
      isAuthenticated: false,
    })

    renderTodoRoute()

    expect(screen.getByTestId('todo-auth-required-card')).toBeTruthy()
  })

  it('supports spotlight flow and completion action', () => {
    renderTodoRoute()

    fireEvent.press(screen.getByTestId('todo-start-spotlight-btn'))

    expect(screen.getByTestId('spotlight-overlay')).toBeTruthy()
    expect(screen.getByTestId('spotlight-highlight')).toBeTruthy()

    fireEvent.press(screen.getByTestId('spotlight-next-btn'))
    fireEvent.press(screen.getByTestId('spotlight-next-btn'))
    fireEvent.press(screen.getByTestId('spotlight-next-btn'))

    expect(screen.queryByTestId('spotlight-overlay')).toBeNull()
  })
})
