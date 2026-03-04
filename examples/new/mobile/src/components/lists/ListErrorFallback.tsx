import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { PrimaryButton } from '../primitives/PrimaryButton';
import { AppText } from '../primitives/AppText';
import { useAppTheme } from '../../theme';

type ListErrorFallbackProps = {
  title: string;
  message: string;
  retryLabel: string;
  onRefresh: () => void;
  isRefreshing?: boolean;
  usePullToRefresh?: boolean;
  scrollTestID?: string;
  refreshButtonTestID?: string;
};

export function ListErrorFallback({
  title,
  message,
  retryLabel,
  onRefresh,
  isRefreshing,
  usePullToRefresh = false,
  scrollTestID = 'list-error-scroll',
  refreshButtonTestID = 'list-error-refresh-btn',
}: ListErrorFallbackProps) {
  const { colors, spacing, shape } = useAppTheme();

  return (
    <ScrollView
      testID={scrollTestID}
      refreshControl={
        usePullToRefresh ? (
          <RefreshControl
            testID={`${scrollTestID}-refresh-control`}
            refreshing={Boolean(isRefreshing)}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
      contentContainerStyle={[
        styles.content,
        {
          padding: spacing.md,
        },
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.pastelPeach,
            borderColor: colors.danger,
            borderRadius: shape.radiusXl,
            gap: spacing.sm,
            padding: spacing.md,
          },
        ]}
      >
        <AppText variant="h3">{title}</AppText>
        <AppText variant="body">{message}</AppText>

        {!usePullToRefresh ? (
          <PrimaryButton
            testID={refreshButtonTestID}
            label={retryLabel}
            onPress={onRefresh}
            disabled={Boolean(isRefreshing)}
          />
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  card: {
    borderWidth: 1,
  },
});
