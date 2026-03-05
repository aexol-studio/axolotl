import { ReactNode } from 'react'

import { CardList } from './CardList'

type StaticCardListProps<TItem> = {
  data: readonly TItem[]
  keyExtractor: (item: TItem, index: number) => string
  renderItem: (item: TItem, index: number) => ReactNode
  testID: string
  title?: string
  subtitle?: string
  orientation?: 'vertical' | 'horizontal'
  listTestID?: string
}

export function StaticCardList<TItem>({
  data,
  keyExtractor,
  renderItem,
  testID,
  title,
  subtitle,
  orientation,
  listTestID,
}: StaticCardListProps<TItem>) {
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
      strategy="scroll"
    />
  )
}
