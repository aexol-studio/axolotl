import { TFunction } from 'i18next'

import { CardList, ListErrorFallback } from '../../../components/lists'
import { ListSuspenseBoundary } from '../../../components/lists/ListSuspenseBoundary'
import { AppText } from '../../../components/primitives/AppText'
import { ShowcaseCard } from '../../../components/showcase/ShowcaseCard'
import { EmptyState } from '../../../components/state/EmptyState'
import { ErrorState } from '../../../components/state/ErrorState'
import { LoadingState } from '../../../components/state/LoadingState'
import {
  HomeStateMode,
  ListFailureMode,
  ListOrientation,
  ListRecoveryMode,
  ShowcaseCardItem,
  ShowcaseCardVariant,
} from '../types'

type HomeStateSectionProps = {
  t: TFunction
  stateMode: HomeStateMode
  setForcedMode: (mode: HomeStateMode) => void
  listFailureMode: ListFailureMode
  listRecoveryMode: ListRecoveryMode
  listOrientation: ListOrientation
  homeListErrorMessage: string
  isListRefreshing: boolean
  handleListRefresh: () => Promise<void>
  demoItems: readonly string[]
  showcaseCards: readonly ShowcaseCardItem[]
  showcaseCardVariant: ShowcaseCardVariant
  listDensity: number
}

export const HomeStateSection = ({
  t,
  stateMode,
  setForcedMode,
  listFailureMode,
  listRecoveryMode,
  listOrientation,
  homeListErrorMessage,
  isListRefreshing,
  handleListRefresh,
  demoItems,
  showcaseCards,
  showcaseCardVariant,
  listDensity,
}: HomeStateSectionProps) => {
  const baseItems =
    demoItems.length > 0 ? demoItems : [t('common.states.emptyTitle')]
  const repeatedItems = Array.from(
    { length: Math.max(1, Math.round(listDensity / 20)) },
    (_, index) => `${baseItems[index % baseItems.length]} ${index + 1}`,
  )

  if (stateMode === 'loading') {
    return <LoadingState label={t('common.states.loading')} />
  }

  if (stateMode === 'error') {
    return (
      <ErrorState
        title={t('common.states.errorTitle')}
        message={t('common.errors.network')}
        retryLabel={t('common.actions.retry')}
        retryTestID="home-state-retry-btn"
        onRetry={() => setForcedMode('success')}
      />
    )
  }

  if (stateMode === 'empty') {
    return (
      <EmptyState
        title={t('common.states.emptyTitle')}
        description={t('common.states.emptyDescription')}
        actionLabel={t('common.actions.primary')}
        actionTestID="home-state-empty-action-btn"
        onActionPress={() => setForcedMode('success')}
      />
    )
  }

  if (listFailureMode !== 'success') {
    return (
      <ListErrorFallback
        title={t('common.home.listErrorTitle')}
        message={homeListErrorMessage}
        retryLabel={t('common.home.listRefresh')}
        onRefresh={() => {
          void handleListRefresh()
        }}
        isRefreshing={isListRefreshing}
        usePullToRefresh={listRecoveryMode === 'pull'}
        scrollTestID="home-list-error-scroll"
        refreshButtonTestID="home-list-refresh-btn"
      />
    )
  }

  return (
    <ListSuspenseBoundary loadingLabel={t('common.home.listLoading')}>
      <CardList
        testID="home-card-list"
        strategy="scroll"
        title={t('common.home.listTitle')}
        subtitle={t('common.home.listSubtitle')}
        data={repeatedItems}
        orientation={listOrientation}
        keyExtractor={(item) => item}
        renderItem={(item) => <AppText variant="body">{item}</AppText>}
      />

      <CardList
        testID="home-showcase-card-list"
        strategy="flash"
        listTestID={`home-showcase-${listOrientation}-list`}
        title={t('common.home.showcaseCardListTitle')}
        subtitle={t('common.home.showcaseCardListSubtitle')}
        data={showcaseCards}
        orientation={listOrientation}
        keyExtractor={(item) => item.id}
        renderItem={(item, index) => (
          <ShowcaseCard
            testID={`home-showcase-card-${index}-btn`}
            tag={t(item.tagKey)}
            title={t(item.titleKey)}
            description={t(item.descriptionKey)}
            ctaLabel={t(item.ctaKey)}
            meta={t(item.metaKey)}
            tone={item.tone}
            variant={showcaseCardVariant}
            onPress={() => undefined}
          />
        )}
      />
    </ListSuspenseBoundary>
  )
}
