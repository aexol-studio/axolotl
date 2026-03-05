import { useMemo } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { useAppTheme } from '../../theme'
import { AppText } from './AppText'

type AppSliderProps = {
  testID: string
  label?: string
  valueLabel?: string
  min?: number
  max?: number
  step?: number
  value: number
  onValueChange: (next: number) => void
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

const normalize = (value: number, min: number, max: number) => {
  if (max === min) {
    return 0
  }

  return (value - min) / (max - min)
}

export const AppSlider = ({
  testID,
  label,
  valueLabel,
  min = 0,
  max = 100,
  step = 5,
  value,
  onValueChange,
}: AppSliderProps) => {
  const { colors, spacing, shape } = useAppTheme()

  const safeValue = clamp(value, min, max)
  const progress = normalize(safeValue, min, max)
  const progressPct = `${Math.round(progress * 100)}%`

  const progressShared = useSharedValue(progress)
  progressShared.value = withTiming(progress, { duration: 150 })

  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progressShared.value }],
  }))

  const stepValue = useMemo(() => (step > 0 ? step : 1), [step])

  const updateValue = (next: number) => {
    const clamped = clamp(next, min, max)
    onValueChange(clamped)
  }

  const decrement = () => {
    updateValue(safeValue - stepValue)
  }

  const increment = () => {
    updateValue(safeValue + stepValue)
  }

  const handleTrackPress = () => {
    if (safeValue >= max) {
      updateValue(min)
      return
    }

    updateValue(safeValue + stepValue)
  }

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          gap: spacing.xs,
        },
      ]}
    >
      {label ? <AppText variant="body">{label}</AppText> : null}
      {valueLabel ? <AppText variant="body">{valueLabel}</AppText> : null}

      <View style={[styles.controls, { gap: spacing.sm }]}>
        <Pressable
          testID={`${testID}-decrement-btn`}
          accessibilityRole="button"
          onPress={decrement}
          style={[
            styles.stepButton,
            {
              borderColor: colors.border,
              borderRadius: shape.radiusMd,
              backgroundColor: colors.surface,
            },
          ]}
        />

        <Pressable
          testID={`${testID}-track-btn`}
          accessibilityRole="button"
          onPress={handleTrackPress}
          style={[
            styles.track,
            {
              borderColor: colors.border,
              borderRadius: shape.radiusMd,
              backgroundColor: colors.surfaceAlt,
            },
          ]}
        >
          <Animated.View
            testID={`${testID}-fill`}
            style={[
              styles.fill,
              {
                backgroundColor: colors.primary,
                borderRadius: shape.radiusMd,
              },
              fillStyle,
            ]}
          />
          <View
            testID={`${testID}-thumb`}
            style={[
              styles.thumb,
              {
                borderColor: colors.primaryPressed,
                backgroundColor: colors.surface,
              },
            ]}
          />
          <View testID={`${testID}-progress-${progressPct}`} />
        </Pressable>

        <Pressable
          testID={`${testID}-increment-btn`}
          accessibilityRole="button"
          onPress={increment}
          style={[
            styles.stepButton,
            {
              borderColor: colors.border,
              borderRadius: shape.radiusMd,
              backgroundColor: colors.surface,
            },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  controls: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepButton: {
    width: 28,
    height: 28,
    borderWidth: 1,
  },
  track: {
    flex: 1,
    height: 14,
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
    height: '100%',
    transformOrigin: 'left',
  },
  thumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    marginLeft: -8,
    borderRadius: 999,
    borderWidth: 1,
  },
})
