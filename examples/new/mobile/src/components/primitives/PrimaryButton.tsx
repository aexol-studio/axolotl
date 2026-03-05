import { Pressable, StyleSheet } from 'react-native'

import { useAppTheme } from '../../theme'
import type { ButtonSize } from '../../config/mainConfig'
import { AppText } from './AppText'

type PrimaryButtonProps = {
  label: string
  onPress: () => void
  disabled?: boolean
  testID: string
  size?: ButtonSize
  variant?: 'solid' | 'soft' | 'outline' | 'ghost' | 'danger'
}

export const PrimaryButton = ({
  label,
  onPress,
  disabled,
  testID,
  size = 'md',
  variant = 'solid',
}: PrimaryButtonProps) => {
  const { colors, layout, shape, spacing } = useAppTheme()
  const metrics = shape.buttonSizes[size]
  const isSoft = variant === 'soft'
  const isOutline = variant === 'outline'
  const isGhost = variant === 'ghost'
  const isDanger = variant === 'danger'

  const backgroundColor = (() => {
    if (disabled) {
      return colors.primaryDisabled
    }

    if (isDanger) {
      return colors.danger
    }

    if (isSoft) {
      return colors.surfaceAlt
    }

    if (isGhost || isOutline) {
      return 'transparent'
    }

    return colors.primary
  })()

  const textColor = (() => {
    if (isSoft || isOutline || isGhost) {
      return colors.text
    }

    return colors.textInverse
  })()

  const borderWidth = isSoft || isOutline ? 1 : 0
  const borderColor = isDanger ? colors.danger : colors.border

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          minHeight: metrics.height,
          borderRadius: Math.max(metrics.borderRadius, shape.radiusMd),
          backgroundColor,
          paddingHorizontal: metrics.horizontalPadding,
          paddingVertical: spacing.xs,
          justifyContent: layout.justify.center,
          borderWidth,
          borderColor,
        },
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <AppText variant="button" style={{ color: textColor }}>
        {label}
      </AppText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
})
