import { Pressable, StyleSheet, Text } from 'react-native'

import { useAppTheme } from '../../theme'
import type { ButtonSize } from '../../config/mainConfig'

type PrimaryButtonProps = {
  label: string
  onPress: () => void
  disabled?: boolean
  testID: string
  size?: ButtonSize
  variant?: 'solid' | 'soft'
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  testID,
  size = 'md',
  variant = 'solid',
}: PrimaryButtonProps) {
  const { colors, layout, shape, spacing, textStyles } = useAppTheme()
  const metrics = shape.buttonSizes[size]
  const isSoft = variant === 'soft'

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
          backgroundColor: disabled ? colors.primaryDisabled : isSoft ? colors.surfaceAlt : colors.primary,
          paddingHorizontal: metrics.horizontalPadding,
          paddingVertical: spacing.xs,
          justifyContent: layout.justify.center,
          borderWidth: isSoft ? 1 : 0,
          borderColor: colors.border,
        },
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Text style={[textStyles.button, isSoft && { color: colors.text }]}>{label}</Text>
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
