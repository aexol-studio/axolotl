import { ReactNode } from 'react'

import { CardList } from './CardList'

type FlashCardListProps<TItem> = {
  data: readonly TItem[]
  keyExtractor: (item: TItem, index: number) => string
  renderItem: (item: TItem, index: number) => ReactNode
  testID: string
  title?: string
  subtitle?: string
  orientation?: 'vertical' | 'horizontal'
  listTestID?: string
}

export function FlashCardList<TItem>({
  data,
  keyExtractor,
  renderItem,
  testID,
  title,
  subtitle,
  orientation,
  listTestID,
}: FlashCardListProps<TItem>) {
  return (
    <CardList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      testID={testID}
      title={title}
      subtitle={subtitle}
      orientation={orientation}
      listTestID={listTestID}
      strategy="flash"
    />
  )
}
