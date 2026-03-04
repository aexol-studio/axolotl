import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme';

export function AppScreen({ children }: PropsWithChildren) {
  const { colors, spacing, shape } = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg }]}
    >
      <View style={[styles.inner, { gap: spacing.md, minHeight: shape.listItemHeight }]}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {},
  inner: {
    width: '100%',
  },
});
