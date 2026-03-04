import { TFunction } from 'i18next';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '../../../components/primitives/AppText';
import { useAppTheme } from '../../../theme';
import { HomeStateMode, ListFailureMode, ListOrientation, ListRecoveryMode } from '../types';

type HomeControlsProps = {
  t: TFunction;
  listRecoveryMode: ListRecoveryMode;
  listOrientation: ListOrientation;
  setForcedMode: (mode: HomeStateMode) => void;
  forceError: () => void;
  handleTriggerListFailure: (mode: Exclude<ListFailureMode, 'success'>) => void;
  handleSetListRecoveryMode: (mode: ListRecoveryMode) => void;
  handleSetListOrientation: (orientation: ListOrientation) => void;
  handleListRefresh: () => Promise<void>;
};

type HomeControlButtonProps = {
  testID: string;
  label: string;
  onPress: () => void;
};

function HomeControlButton({ testID, label, onPress }: HomeControlButtonProps) {
  const { colors, shape, spacing } = useAppTheme();

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.miniAction,
        {
          borderColor: colors.border,
          backgroundColor: colors.surfaceAlt,
          borderRadius: shape.radiusLg,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        },
      ]}
    >
      <AppText variant="body">{label}</AppText>
    </Pressable>
  );
}

export function HomeControls({
  t,
  listRecoveryMode,
  listOrientation,
  setForcedMode,
  forceError,
  handleTriggerListFailure,
  handleSetListRecoveryMode,
  handleSetListOrientation,
  handleListRefresh,
}: HomeControlsProps) {
  return (
    <>
      <HomeControlButton
        testID="home-show-loading-btn"
        label={t('common.home.showcaseLoading')}
        onPress={() => setForcedMode('loading')}
      />
      <HomeControlButton testID="home-show-error-btn" label={t('common.home.showcaseError')} onPress={forceError} />
      <HomeControlButton
        testID="home-show-empty-btn"
        label={t('common.home.showcaseEmpty')}
        onPress={() => setForcedMode('empty')}
      />
      <HomeControlButton
        testID="home-list-show-error-btn"
        label={t('common.home.showcaseListError')}
        onPress={() => handleTriggerListFailure('error')}
      />
      <HomeControlButton
        testID="home-list-show-suspense-failure-btn"
        label={t('common.home.showcaseListSuspenseFailure')}
        onPress={() => handleTriggerListFailure('suspense')}
      />
      <HomeControlButton
        testID="home-list-recovery-button-btn"
        label={t('common.home.listRecoveryButton', {
          selected: listRecoveryMode === 'button' ? '✓' : '',
        })}
        onPress={() => handleSetListRecoveryMode('button')}
      />
      <HomeControlButton
        testID="home-list-orientation-vertical-btn"
        label={t('common.home.listOrientationVertical', {
          selected: listOrientation === 'vertical' ? '✓' : '',
        })}
        onPress={() => handleSetListOrientation('vertical')}
      />
      <HomeControlButton
        testID="home-list-orientation-horizontal-btn"
        label={t('common.home.listOrientationHorizontal', {
          selected: listOrientation === 'horizontal' ? '✓' : '',
        })}
        onPress={() => handleSetListOrientation('horizontal')}
      />
      <HomeControlButton
        testID="home-list-recovery-pull-btn"
        label={t('common.home.listRecoveryPull', {
          selected: listRecoveryMode === 'pull' ? '✓' : '',
        })}
        onPress={() => handleSetListRecoveryMode('pull')}
      />
      <HomeControlButton
        testID="home-show-success-btn"
        label={t('common.home.showcaseSuccess')}
        onPress={() => {
          setForcedMode('success');
          void handleListRefresh();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  miniAction: {
    borderWidth: 1,
  },
});
