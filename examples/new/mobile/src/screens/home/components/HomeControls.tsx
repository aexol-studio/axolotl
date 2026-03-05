import { TFunction } from 'i18next'
import { Pressable, StyleSheet } from 'react-native'

import { AppText } from '../../../components/primitives/AppText'
import { useAppTheme } from '../../../theme'
import {
  HomeButtonVariant,
  HomeStateMode,
  ListFailureMode,
  ListOrientation,
  ListRecoveryMode,
  ShowcaseCardVariant,
} from '../types'

type HomeControlsProps = {
  t: TFunction
  listRecoveryMode: ListRecoveryMode
  listOrientation: ListOrientation
  setForcedMode: (mode: HomeStateMode) => void
  forceError: () => void
  handleTriggerListFailure: (mode: Exclude<ListFailureMode, 'success'>) => void
  handleSetListRecoveryMode: (mode: ListRecoveryMode) => void
  handleSetListOrientation: (orientation: ListOrientation) => void
  handleListRefresh: () => Promise<void>
  buttonVariant: HomeButtonVariant
  setButtonVariant: (variant: HomeButtonVariant) => void
  showcaseCardVariant: ShowcaseCardVariant
  setShowcaseCardVariant: (variant: ShowcaseCardVariant) => void
}

type HomeControlButtonProps = {
  testID: string
  label: string
  onPress: () => void
}

const HomeControlButton = ({
  testID,
  label,
  onPress,
}: HomeControlButtonProps) => {
  const { colors, shape, spacing } = useAppTheme()

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
  )
}

export const HomeControls = ({
  t,
  listRecoveryMode,
  listOrientation,
  setForcedMode,
  forceError,
  handleTriggerListFailure,
  handleSetListRecoveryMode,
  handleSetListOrientation,
  handleListRefresh,
  buttonVariant,
  setButtonVariant,
  showcaseCardVariant,
  setShowcaseCardVariant,
}: HomeControlsProps) => {
  return (
    <>
      <HomeControlButton
        testID="home-show-loading-btn"
        label={t('common.home.showcaseLoading')}
        onPress={() => setForcedMode('loading')}
      />
      <HomeControlButton
        testID="home-show-error-btn"
        label={t('common.home.showcaseError')}
        onPress={forceError}
      />
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
          setForcedMode('success')
          void handleListRefresh()
        }}
      />

      <HomeControlButton
        testID="home-button-variant-soft-btn"
        label={t('common.home.buttonVariantSoft', {
          selected: buttonVariant === 'soft' ? '✓' : '',
        })}
        onPress={() => setButtonVariant('soft')}
      />
      <HomeControlButton
        testID="home-button-variant-solid-btn"
        label={t('common.home.buttonVariantSolid', {
          selected: buttonVariant === 'solid' ? '✓' : '',
        })}
        onPress={() => setButtonVariant('solid')}
      />
      <HomeControlButton
        testID="home-button-variant-outline-btn"
        label={t('common.home.buttonVariantOutline', {
          selected: buttonVariant === 'outline' ? '✓' : '',
        })}
        onPress={() => setButtonVariant('outline')}
      />
      <HomeControlButton
        testID="home-button-variant-ghost-btn"
        label={t('common.home.buttonVariantGhost', {
          selected: buttonVariant === 'ghost' ? '✓' : '',
        })}
        onPress={() => setButtonVariant('ghost')}
      />
      <HomeControlButton
        testID="home-button-variant-danger-btn"
        label={t('common.home.buttonVariantDanger', {
          selected: buttonVariant === 'danger' ? '✓' : '',
        })}
        onPress={() => setButtonVariant('danger')}
      />

      <HomeControlButton
        testID="home-card-variant-elevated-btn"
        label={t('common.home.cardVariantElevated', {
          selected: showcaseCardVariant === 'elevated' ? '✓' : '',
        })}
        onPress={() => setShowcaseCardVariant('elevated')}
      />
      <HomeControlButton
        testID="home-card-variant-outlined-btn"
        label={t('common.home.cardVariantOutlined', {
          selected: showcaseCardVariant === 'outlined' ? '✓' : '',
        })}
        onPress={() => setShowcaseCardVariant('outlined')}
      />
      <HomeControlButton
        testID="home-card-variant-compact-btn"
        label={t('common.home.cardVariantCompact', {
          selected: showcaseCardVariant === 'compact' ? '✓' : '',
        })}
        onPress={() => setShowcaseCardVariant('compact')}
      />
    </>
  )
}

const styles = StyleSheet.create({
  miniAction: {
    borderWidth: 1,
  },
})
