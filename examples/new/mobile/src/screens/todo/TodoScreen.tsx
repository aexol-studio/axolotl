import { View } from 'react-native'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { useSpotlight } from '../../features/spotlight/SpotlightContext'
import { useAuthSession } from '../../features/auth/useAuthSession'
import { SpotlightOverlay } from '../../features/spotlight/SpotlightOverlay'
import { SpotlightTarget } from '../../features/spotlight/SpotlightTarget'
import type { SpotlightStep } from '../../features/spotlight/types'
import { AppScreen } from '../../components/primitives/AppScreen'
import { AppText } from '../../components/primitives/AppText'
import { PrimaryButton } from '../../components/primitives/PrimaryButton'
import { normalizeError } from '../../lib/errors/normalizeError'
import { useToast } from '../../providers/ToastProvider'
import { useOnboardingStore } from '../../stores/onboardingStore'
import { useAppTheme } from '../../theme'
import { TodoComposer } from './components/TodoComposer'
import { TodoFilterBar } from './components/TodoFilterBar'
import { TodoListSection } from './components/TodoListSection'
import { TodoSectionCard } from './components/TodoSectionCard'
import { useTodoShowcaseState } from './useTodoShowcaseState'

const todoSpotlightSteps: readonly SpotlightStep[] = [
  {
    targetId: 'todo-composer',
    titleKey: 'common.spotlight.todoComposerTitle',
    descriptionKey: 'common.spotlight.todoComposerDescription',
  },
  {
    targetId: 'todo-filters',
    titleKey: 'common.spotlight.todoFiltersTitle',
    descriptionKey: 'common.spotlight.todoFiltersDescription',
  },
  {
    targetId: 'todo-list',
    titleKey: 'common.spotlight.todoListTitle',
    descriptionKey: 'common.spotlight.todoListDescription',
  },
]

export const TodoScreen = () => {
  const { t } = useTranslation()
  const { spacing, colors } = useAppTheme()
  const { showToast } = useToast()
  const { start } = useSpotlight()
  const { isAuthenticated, logout } = useAuthSession()
  const completeSpotlightTour = useOnboardingStore(
    (state) => state.completeSpotlightTour,
  )
  const hasCompletedSpotlightTour = useOnboardingStore(
    (state) => state.hasCompletedSpotlightTour,
  )
  const resetSpotlightTour = useOnboardingStore(
    (state) => state.resetSpotlightTour,
  )
  const {
    composerValue,
    setComposerValue,
    filter,
    setFilter,
    filteredTodos,
    stats,
    isLoading,
    isFetching,
    isError,
    error,
    isMutating,
    queuedCount,
    deadLetterCount,
    isOfflineFallback,
    isSyncingQueue,
    addTodo,
    toggleTodo,
    refetch,
    flushQueue,
    retryDeadLetters,
  } = useTodoShowcaseState({ isEnabled: isAuthenticated })

  const handleAddTodo = () => {
    void addTodo().catch((caughtError) => {
      const normalized = normalizeError(caughtError)
      showToast({
        title: t('common.toast.errorTitle'),
        message: t(normalized.message),
        variant: 'error',
      })
    })
  }

  const handleMarkDone = (id: string) => {
    void toggleTodo(id).catch((caughtError) => {
      const normalized = normalizeError(caughtError)
      showToast({
        title: t('common.toast.errorTitle'),
        message: t(normalized.message),
        variant: 'error',
      })
    })
  }

  const handleRefreshTodos = () => {
    void refetch().catch((caughtError) => {
      const normalized = normalizeError(caughtError)
      showToast({
        title: t('common.toast.errorTitle'),
        message: t(normalized.message),
        variant: 'error',
      })
    })
  }

  const handleLogout = () => {
    void logout().then(() => {
      showToast({
        title: t('common.auth.logoutSuccess'),
        variant: 'success',
      })
      router.replace('./(auth)/sign-in')
    })
  }

  const handleRetryPendingSync = () => {
    void retryDeadLetters().then(() => {
      void flushQueue()
    })
  }

  if (!isAuthenticated) {
    return (
      <AppScreen>
        <TodoSectionCard
          testID="todo-auth-required-card"
          title={t('common.todo.authRequiredTitle')}
          subtitle={t('common.todo.authRequiredDescription')}
        >
          <PrimaryButton
            testID="todo-auth-go-sign-in-btn"
            label={t('common.auth.signInAction')}
            onPress={() => {
              router.replace('./(auth)/sign-in')
            }}
          />
        </TodoSectionCard>
      </AppScreen>
    )
  }

  if (isError) {
    const normalized = normalizeError(error)

    return (
      <AppScreen>
        <TodoSectionCard
          testID="todo-error-card"
          title={t('common.todo.errorTitle')}
          subtitle={t(normalized.message)}
        >
          <PrimaryButton
            testID="todo-error-retry-btn"
            label={t('common.actions.retry')}
            onPress={() => {
              void refetch()
            }}
          />
        </TodoSectionCard>

        <SpotlightOverlay onFinish={completeSpotlightTour} />
      </AppScreen>
    )
  }

  return (
    <AppScreen>
      <View style={{ gap: spacing.md }}>
        <TodoSectionCard
          testID="todo-overview-card"
          title={t('common.todo.title')}
          subtitle={t('common.todo.subtitle')}
        >
          <View testID="todo-stats-row" style={{ gap: spacing.xs }}>
            <AppText style={{ color: colors.textMuted }}>
              {t('common.todo.statsTotal', { count: stats.total })}
            </AppText>
            <AppText style={{ color: colors.textMuted }}>
              {t('common.todo.statsActive', { count: stats.active })}
            </AppText>
            <AppText style={{ color: colors.textMuted }}>
              {t('common.todo.statsCompleted', { count: stats.completed })}
            </AppText>
            <AppText style={{ color: colors.textMuted }}>
              {t('common.todo.pendingQueueCount', { count: queuedCount })}
            </AppText>
            <AppText style={{ color: colors.textMuted }}>
              {t('common.todo.deadLetterCount', { count: deadLetterCount })}
            </AppText>
          </View>
          {isOfflineFallback && (
            <AppText
              testID="todo-offline-badge"
              style={{ color: colors.textMuted }}
            >
              {t('common.todo.offlineFallbackActive')}
            </AppText>
          )}
          {isSyncingQueue && (
            <AppText
              testID="todo-syncing-copy"
              style={{ color: colors.textMuted }}
            >
              {t('common.todo.syncingQueue')}
            </AppText>
          )}
          <PrimaryButton
            testID="todo-retry-sync-btn"
            label={t('common.todo.retrySyncAction')}
            variant="outline"
            size="sm"
            onPress={handleRetryPendingSync}
            disabled={queuedCount === 0 && deadLetterCount === 0}
          />
          <PrimaryButton
            testID="todo-logout-btn"
            label={t('common.auth.logoutAction')}
            variant="ghost"
            size="sm"
            onPress={handleLogout}
          />
          <PrimaryButton
            testID="todo-start-spotlight-btn"
            label={
              hasCompletedSpotlightTour
                ? t('common.spotlight.restartAction')
                : t('common.spotlight.startAction')
            }
            variant="soft"
            size="sm"
            onPress={() => {
              if (hasCompletedSpotlightTour) {
                resetSpotlightTour()
              }
              start(todoSpotlightSteps)
            }}
          />
        </TodoSectionCard>

        <SpotlightTarget
          id="todo-composer"
          testID="todo-spotlight-target-composer"
        >
          <TodoSectionCard
            testID="todo-composer-card"
            title={t('common.todo.composerTitle')}
          >
            <TodoComposer
              value={composerValue}
              onChange={setComposerValue}
              onAdd={handleAddTodo}
              isSubmitting={isMutating}
            />
          </TodoSectionCard>
        </SpotlightTarget>

        <SpotlightTarget
          id="todo-filters"
          testID="todo-spotlight-target-filters"
        >
          <TodoSectionCard
            testID="todo-list-card"
            title={t('common.todo.listTitle')}
            subtitle={t('common.todo.listSubtitle')}
          >
            <TodoFilterBar filter={filter} onChangeFilter={setFilter} />
            <SpotlightTarget id="todo-list" testID="todo-spotlight-target-list">
              <TodoListSection
                items={filteredTodos}
                onMarkDone={handleMarkDone}
              />
            </SpotlightTarget>
            <PrimaryButton
              testID="todo-clear-completed-btn"
              label={t('common.todo.refreshAction')}
              variant="outline"
              onPress={handleRefreshTodos}
              disabled={isMutating}
            />
          </TodoSectionCard>
        </SpotlightTarget>

        {(isLoading || isFetching) && (
          <AppText
            testID="todo-loading-copy"
            style={{ color: colors.textMuted }}
          >
            {t('common.todo.loading')}
          </AppText>
        )}
      </View>

      <SpotlightOverlay onFinish={completeSpotlightTour} />
    </AppScreen>
  )
}
