import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '../primitives/AppText';
import { useAppTheme } from '../../theme';

type LoadingStateProps = {
  label: string;
};

export function LoadingState({ label }: LoadingStateProps) {
  const { colors, layout, spacing } = useAppTheme();

  return (
    <View style={[styles.container, { padding: spacing.lg, gap: spacing.sm, justifyContent: layout.justify.center }]}>
      <ActivityIndicator testID="state-loading-indicator" color={colors.primary} size="small" />
      <AppText variant="body">{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
