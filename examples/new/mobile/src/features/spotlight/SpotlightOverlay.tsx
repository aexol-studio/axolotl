import { StyleSheet, View } from 'react-native'
import { BlurView } from 'expo-blur'
import { useTranslation } from 'react-i18next'

import { AppText } from '../../components/primitives/AppText'
import { PrimaryButton } from '../../components/primitives/PrimaryButton'
import { useAppTheme } from '../../theme'
import { useSpotlight } from './SpotlightContext'

type SpotlightOverlayProps = {
  onFinish: () => void
}

const overlayFallbackStyles = StyleSheet.create({
  overlayFill: {
    ...StyleSheet.absoluteFillObject,
  },
})

export const SpotlightOverlay = ({ onFinish }: SpotlightOverlayProps) => {
  const { t } = useTranslation()
  const { colors, spacing, shape } = useAppTheme()
  const {
    isVisible,
    currentRect,
    currentStep,
    currentStepIndex,
    steps,
    isFirstStep,
    isLastStep,
    next,
    previous,
    close,
  } = useSpotlight()

  if (!isVisible || !currentStep) {
    return null
  }

  const overlayTop = currentRect ? Math.max(currentRect.y - spacing.sm, 0) : 80
  const overlayLeft = currentRect
    ? Math.max(currentRect.x - spacing.sm, spacing.sm)
    : spacing.sm
  const overlayWidth = currentRect
    ? Math.max(currentRect.width + spacing.md, 80)
    : 180
  const overlayHeight = currentRect
    ? Math.max(currentRect.height + spacing.md, 44)
    : 80

  return (
    <View
      testID="spotlight-overlay"
      style={styles.container}
      pointerEvents="box-none"
    >
      <View style={[styles.maskContainer, overlayFallbackStyles.overlayFill]}>
        <BlurView
          testID="spotlight-overlay-blur"
          intensity={42}
          tint="dark"
          style={overlayFallbackStyles.overlayFill}
        />
        <View
          testID="spotlight-overlay-dim"
          style={[
            overlayFallbackStyles.overlayFill,
            { backgroundColor: 'rgba(5, 8, 20, 0.62)' },
          ]}
        />
      </View>

      <View
        testID="spotlight-highlight"
        style={[
          styles.highlight,
          {
            top: overlayTop,
            left: overlayLeft,
            width: overlayWidth,
            height: overlayHeight,
            borderColor: colors.primary,
            borderRadius: shape.radiusLg,
          },
        ]}
      />

      <View
        testID="spotlight-panel"
        style={[
          styles.panel,
          {
            borderColor: colors.border,
            borderRadius: shape.radiusXl,
            backgroundColor: colors.surface,
            padding: spacing.md,
            gap: spacing.sm,
          },
        ]}
      >
        <AppText variant="h3">{t(currentStep.titleKey)}</AppText>
        <AppText variant="body" style={{ color: colors.textMuted }}>
          {t(currentStep.descriptionKey)}
        </AppText>
        <AppText variant="body" style={{ color: colors.textMuted }}>
          {t('common.spotlight.progress', {
            current: String(currentStepIndex + 1),
            total: String(steps.length),
          })}
        </AppText>

        <View style={[styles.actions, { gap: spacing.xs }]}>
          <PrimaryButton
            testID="spotlight-close-btn"
            variant="ghost"
            size="sm"
            label={t('common.spotlight.skipAction')}
            onPress={close}
          />
          <PrimaryButton
            testID="spotlight-back-btn"
            variant="soft"
            size="sm"
            label={t('common.spotlight.backAction')}
            onPress={previous}
            disabled={isFirstStep}
          />
          <PrimaryButton
            testID="spotlight-next-btn"
            size="sm"
            label={
              isLastStep
                ? t('common.spotlight.finishAction')
                : t('common.spotlight.nextAction')
            }
            onPress={() => {
              if (isLastStep) {
                onFinish()
                close()
                return
              }
              next()
            }}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
  },
  maskContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  highlight: {
    position: 'absolute',
    borderWidth: 2,
  },
  panel: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    borderWidth: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
