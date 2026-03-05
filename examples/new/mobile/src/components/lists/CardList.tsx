import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { AppListItem } from '../primitives/AppListItem';
import { AppText } from '../primitives/AppText';
import { useAppTheme } from '../../theme';

type CardListProps<TItem> = {
  data: readonly TItem[];
  keyExtractor: (item: TItem, index: number) => string;
  renderItem: (item: TItem, index: number) => ReactNode;
  testID: string;
  strategy?: 'flash' | 'scroll';
  title?: string;
  subtitle?: string;
  orientation?: 'vertical' | 'horizontal';
  listTestID?: string;
};

export function CardList<TItem>({
  data,
  keyExtractor,
  renderItem,
  testID,
  strategy = 'flash',
  title,
  subtitle,
  orientation = 'vertical',
  listTestID,
}: CardListProps<TItem>) {
  const { colors, shape, spacing, shadows } = useAppTheme();
  const isHorizontal = orientation === 'horizontal';
  const resolvedListTestID = listTestID ?? `${testID}-${orientation}-list`;

  const items = data.map((item, index) => (
    <AppListItem key={keyExtractor(item, index)} testID={`${testID}-item-${index}`}>
      {renderItem(item, index)}
    </AppListItem>
  ));

  return (
    <View
      testID={testID}
      style={[
        styles.card,
        {
          borderColor: colors.border,
          backgroundColor: colors.surface,
          borderRadius: shape.radiusXl,
          boxShadow: shadows.listCard,
          padding: spacing.md,
          gap: spacing.sm,
        },
      ]}
    >
      {title ? <AppText variant="h3">{title}</AppText> : null}
      {subtitle ? <AppText variant="body">{subtitle}</AppText> : null}

      {strategy === 'flash' ? (
        <FlashList
          testID={resolvedListTestID}
          data={data}
          horizontal={isHorizontal}
          keyExtractor={keyExtractor}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: spacing.xs }}
          ItemSeparatorComponent={() => <View style={isHorizontal ? { width: spacing.sm } : { height: spacing.sm }} />}
          renderItem={({ item, index }) => (
            <AppListItem testID={`${testID}-item-${index}`}>{renderItem(item, index)}</AppListItem>
          )}
        />
      ) : (
        <ScrollView
          testID={resolvedListTestID}
          horizontal={isHorizontal}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            isHorizontal ? { flexDirection: 'row', gap: spacing.sm } : { gap: spacing.sm },
          ]}
        >
          {items}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
