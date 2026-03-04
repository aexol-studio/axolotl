import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '../primitives/PrimaryButton';
import { AppText } from '../primitives/AppText';
import { useAppTheme } from '../../theme';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  actionTestID: string;
  onActionPress: () => void;
};

export function EmptyState({ title, description, actionLabel, actionTestID, onActionPress }: EmptyStateProps) {
  const { colors, spacing, shape } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.border,
          backgroundColor: colors.surfaceAlt,
          borderRadius: shape.radiusMd,
          padding: spacing.md,
          gap: spacing.sm,
        },
      ]}
    >
      <AppText variant="h3">{title}</AppText>
      <AppText variant="body">{description}</AppText>
      <PrimaryButton testID={actionTestID} label={actionLabel} onPress={onActionPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
});
