import { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'

import { AppText } from '../../../components/primitives/AppText'
import { useAppTheme } from '../../../theme'

type TodoSectionCardProps = PropsWithChildren<{
  title: string
  subtitle?: string
  testID: string
}>

export const TodoSectionCard = ({
  title,
  subtitle,
  testID,
  children,
}: TodoSectionCardProps) => {
  const { colors, shape, spacing, shadows } = useAppTheme()

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          borderColor: colors.border,
          borderRadius: shape.radiusXl,
          backgroundColor: colors.surface,
          boxShadow: shadows.listCard,
          padding: spacing.md,
          gap: spacing.sm,
        },
      ]}
    >
      <View style={{ gap: spacing.xs }}>
        <AppText variant="h3">{title}</AppText>
        {subtitle ? (
          <AppText variant="body" style={{ color: colors.textMuted }}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
})
