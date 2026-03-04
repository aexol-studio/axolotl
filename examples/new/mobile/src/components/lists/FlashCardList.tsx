import { ReactNode } from 'react';

import { CardList } from './CardList';

type FlashCardListProps<TItem> = {
  data: readonly TItem[];
  keyExtractor: (item: TItem, index: number) => string;
  renderItem: (item: TItem, index: number) => ReactNode;
  testID: string;
  title?: string;
  subtitle?: string;
  orientation?: 'vertical' | 'horizontal';
  listTestID?: string;
};

export function FlashCardList<TItem>(props: FlashCardListProps<TItem>) {
  return <CardList {...props} strategy="flash" />;
}
