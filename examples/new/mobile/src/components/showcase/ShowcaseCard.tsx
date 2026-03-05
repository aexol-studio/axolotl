import { Pressable, StyleSheet, View } from 'react-native'

import { AppText } from '../primitives/AppText'
import { useAppTheme } from '../../theme'

type ShowcaseCardProps = {
  testID: string
  tag: string
  title: string
  description: string
  ctaLabel: string
  meta: string
  tone?: 'darkAi' | 'travel' | 'pastelInvoice'
  variant?: 'elevated' | 'outlined' | 'compact'
  onPress: () => void
}

export const ShowcaseCard = ({
  testID,
  tag,
  title,
  description,
  ctaLabel,
  meta,
  tone = 'darkAi',
  variant = 'elevated',
  onPress,
}: ShowcaseCardProps) => {
  const { colors, shape, spacing, shadows } = useAppTheme()
  const isDarkAi = tone === 'darkAi'
  const isTravel = tone === 'travel'
  const isOutlined = variant === 'outlined'
  const isCompact = variant === 'compact'

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: isDarkAi ? colors.cardDarkStart : colors.surface,
          borderColor: isOutlined
            ? colors.primary
            : isDarkAi
              ? colors.borderStrong
              : colors.border,
          borderRadius: shape.radiusXl,
          boxShadow: isOutlined ? shadows.listCard : shadows.showcaseCard,
          padding: spacing.md,
          gap: isCompact ? spacing.xs : spacing.sm,
        },
      ]}
    >
      <View
        testID={`${testID}-hero`}
        style={[
          styles.hero,
          isCompact && styles.heroCompact,
          {
            backgroundColor: isDarkAi
              ? colors.cardDarkEnd
              : isTravel
                ? colors.info
                : colors.pastelLavender,
            borderColor: isDarkAi ? colors.borderStrong : colors.border,
            borderRadius: shape.radiusLg,
          },
        ]}
      />

      <View
        testID={`${testID}-tag`}
        style={[
          styles.tag,
          {
            backgroundColor: isDarkAi ? colors.primary : colors.surfaceAlt,
            borderColor: colors.primaryPressed,
            borderRadius: shape.radiusLg,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
          },
        ]}
      >
        <AppText
          variant="body"
          style={{ color: isDarkAi ? colors.textInverse : colors.text }}
        >
          {tag}
        </AppText>
      </View>

      <AppText
        variant="h3"
        style={{ color: isDarkAi ? colors.textInverse : colors.text }}
      >
        {title}
      </AppText>
      <AppText
        variant="body"
        style={{ color: isDarkAi ? colors.textInverse : colors.textMuted }}
      >
        {description}
      </AppText>

      <View
        testID={`${testID}-meta`}
        style={[
          styles.meta,
          {
            backgroundColor: isDarkAi
              ? colors.cardDarkEnd
              : isTravel
                ? colors.pastelMint
                : colors.pastelPeach,
            borderRadius: shape.radiusLg,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
          },
        ]}
      >
        <AppText
          variant="body"
          style={{ color: isDarkAi ? colors.textInverse : colors.text }}
        >
          {meta}
        </AppText>
      </View>

      <View
        testID={`${testID}-cta`}
        style={[
          styles.cta,
          {
            backgroundColor: colors.surface,
            borderRadius: shape.radiusLg,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
          },
        ]}
      >
        <AppText variant="body">{ctaLabel}</AppText>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    minWidth: 240,
    overflow: 'hidden',
  },
  hero: {
    width: '100%',
    height: 112,
    borderWidth: 1,
  },
  heroCompact: {
    height: 84,
  },
  tag: {
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  cta: {
    alignSelf: 'flex-start',
  },
  meta: {
    alignSelf: 'flex-start',
  },
})
