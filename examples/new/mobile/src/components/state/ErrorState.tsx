import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '../primitives/PrimaryButton';
import { AppText } from '../primitives/AppText';
import { useAppTheme } from '../../theme';

type ErrorStateProps = {
  title: string;
  message: string;
  retryLabel: string;
  onRetry: () => void;
  retryTestID: string;
};

export function ErrorState({ title, message, retryLabel, onRetry, retryTestID }: ErrorStateProps) {
  const { colors, spacing, shape } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.danger,
          borderRadius: shape.radiusMd,
          padding: spacing.md,
          gap: spacing.sm,
        },
      ]}
    >
      <AppText variant="h3">{title}</AppText>
      <AppText variant="body">{message}</AppText>
      <PrimaryButton testID={retryTestID} label={retryLabel} onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
});
