import { ReactNode } from 'react';

import { CardList } from './CardList';

type StaticCardListProps<TItem> = {
  data: readonly TItem[];
  keyExtractor: (item: TItem, index: number) => string;
  renderItem: (item: TItem, index: number) => ReactNode;
  testID: string;
  title?: string;
  subtitle?: string;
  orientation?: 'vertical' | 'horizontal';
  listTestID?: string;
};

export function StaticCardList<TItem>(props: StaticCardListProps<TItem>) {
  return <CardList {...props} strategy="scroll" />;
}
