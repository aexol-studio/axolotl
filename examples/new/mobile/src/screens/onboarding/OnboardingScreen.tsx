import { useRef, useState } from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { useTranslation } from 'react-i18next'

import { AppText } from '../../components/primitives/AppText'
import { PrimaryButton } from '../../components/primitives/PrimaryButton'
import { useOnboardingStore } from '../../stores/onboardingStore'
import { useAppTheme } from '../../theme'

const onboardingKeys = [
  {
    titleKey: 'common.onboarding.stepOneTitle',
    descriptionKey: 'common.onboarding.stepOneDescription',
  },
  {
    titleKey: 'common.onboarding.stepTwoTitle',
    descriptionKey: 'common.onboarding.stepTwoDescription',
  },
  {
    titleKey: 'common.onboarding.stepThreeTitle',
    descriptionKey: 'common.onboarding.stepThreeDescription',
  },
] as const

type OnboardingScreenProps = {
  onFinish: () => void
}

export const OnboardingScreen = ({ onFinish }: OnboardingScreenProps) => {
  const { t } = useTranslation()
  const { colors, spacing, shape, shadows } = useAppTheme()
  const completeOnboarding = useOnboardingStore(
    (state) => state.completeOnboarding,
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const [layoutWidth, setLayoutWidth] = useState(1)
  const pagerRef = useRef<ScrollView | null>(null)

  const progress = (activeIndex + 1) / onboardingKeys.length

  const goToIndex = (nextIndex: number) => {
    const clamped = Math.max(0, Math.min(nextIndex, onboardingKeys.length - 1))
    pagerRef.current?.scrollTo({ x: clamped * layoutWidth, animated: true })
    setActiveIndex(clamped)
  }

  const handleSkip = () => {
    completeOnboarding()
    onFinish()
  }

  const handleNext = () => {
    if (activeIndex >= onboardingKeys.length - 1) {
      completeOnboarding()
      onFinish()
      return
    }

    goToIndex(activeIndex + 1)
  }

  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / Math.max(layoutWidth, 1),
    )
    setActiveIndex(nextIndex)
  }

  return (
    <View
      testID="onboarding-screen"
      style={[styles.container, { backgroundColor: colors.background }]}
      onLayout={(event) => {
        setLayoutWidth(event.nativeEvent.layout.width)
      }}
    >
      <View style={{ gap: spacing.md }}>
        <View
          testID="onboarding-progress-track"
          style={[
            styles.progressTrack,
            {
              borderRadius: shape.radiusLg,
              backgroundColor: colors.surfaceAlt,
            },
          ]}
        >
          <View
            testID="onboarding-progress-fill"
            style={[
              styles.progressFill,
              {
                width: `${Math.round(progress * 100)}%`,
                borderRadius: shape.radiusLg,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>
        <AppText variant="body" style={{ color: colors.textMuted }}>
          {t('common.onboarding.progressLabel', {
            current: String(activeIndex + 1),
            total: String(onboardingKeys.length),
          })}
        </AppText>
      </View>

      <ScrollView
        ref={pagerRef}
        testID="onboarding-pager"
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
      >
        {onboardingKeys.map((step, index) => (
          <View
            key={step.titleKey}
            testID={`onboarding-step-${index}`}
            style={{
              width: layoutWidth,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
            }}
          >
            <View
              style={[
                styles.stepCard,
                {
                  borderRadius: shape.radiusXl,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  boxShadow: shadows.showcaseCard,
                  padding: spacing.lg,
                  gap: spacing.sm,
                },
              ]}
            >
              <AppText variant="h2">{t(step.titleKey)}</AppText>
              <AppText variant="body" style={{ color: colors.textMuted }}>
                {t(step.descriptionKey)}
              </AppText>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.actions, { gap: spacing.sm, padding: spacing.lg }]}>
        <Pressable
          testID="onboarding-skip-btn"
          accessibilityRole="button"
          onPress={handleSkip}
          style={styles.skipAction}
        >
          <AppText variant="body" style={{ color: colors.textMuted }}>
            {t('common.onboarding.skipAction')}
          </AppText>
        </Pressable>
        <PrimaryButton
          testID="onboarding-next-btn"
          label={
            activeIndex === onboardingKeys.length - 1
              ? t('common.onboarding.finishAction')
              : t('common.onboarding.nextAction')
          }
          onPress={handleNext}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 64,
  },
  progressTrack: {
    width: '100%',
    height: 8,
  },
  progressFill: {
    height: '100%',
  },
  stepCard: {
    borderWidth: 1,
  },
  actions: {
    width: '100%',
  },
  skipAction: {
    alignSelf: 'flex-start',
  },
})
