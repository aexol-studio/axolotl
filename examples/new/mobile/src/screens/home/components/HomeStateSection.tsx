import { TFunction } from 'i18next';

import { CardList, ListErrorFallback, ListSuspenseBoundary } from '../../../components/lists';
import { AppText } from '../../../components/primitives/AppText';
import { ShowcaseCard } from '../../../components/showcase';
import { EmptyState, ErrorState, LoadingState } from '../../../components/state';
import { HomeStateMode, ListFailureMode, ListOrientation, ListRecoveryMode, ShowcaseCardItem } from '../types';

type HomeStateSectionProps = {
  t: TFunction;
  stateMode: HomeStateMode;
  setForcedMode: (mode: HomeStateMode) => void;
  listFailureMode: ListFailureMode;
  listRecoveryMode: ListRecoveryMode;
  listOrientation: ListOrientation;
  homeListErrorMessage: string;
  isListRefreshing: boolean;
  handleListRefresh: () => Promise<void>;
  demoItems: readonly string[];
  showcaseCards: readonly ShowcaseCardItem[];
};

export function HomeStateSection({
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
}: HomeStateSectionProps) {
  if (stateMode === 'loading') {
    return <LoadingState label={t('common.states.loading')} />;
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
    );
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
    );
  }

  if (listFailureMode !== 'success') {
    return (
      <ListErrorFallback
        title={t('common.home.listErrorTitle')}
        message={homeListErrorMessage}
        retryLabel={t('common.home.listRefresh')}
        onRefresh={() => {
          void handleListRefresh();
        }}
        isRefreshing={isListRefreshing}
        usePullToRefresh={listRecoveryMode === 'pull'}
        scrollTestID="home-list-error-scroll"
        refreshButtonTestID="home-list-refresh-btn"
      />
    );
  }

  return (
    <ListSuspenseBoundary loadingLabel={t('common.home.listLoading')}>
      <CardList
        testID="home-card-list"
        strategy="scroll"
        title={t('common.home.listTitle')}
        subtitle={t('common.home.listSubtitle')}
        data={demoItems}
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
            onPress={() => undefined}
          />
        )}
      />
    </ListSuspenseBoundary>
  );
}
