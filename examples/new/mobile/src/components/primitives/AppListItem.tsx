import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme';

type AppListItemProps = PropsWithChildren<{
  testID?: string;
}>;

export function AppListItem({ children, testID }: AppListItemProps) {
  const { colors, layout, shape, shadows, spacing } = useAppTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.item,
        {
          minHeight: shape.listItemHeight,
          borderColor: colors.border,
          borderRadius: shape.radiusLg,
          backgroundColor: colors.surface,
          boxShadow: shadows.listItem,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          justifyContent: layout.justify.center,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
  },
});
