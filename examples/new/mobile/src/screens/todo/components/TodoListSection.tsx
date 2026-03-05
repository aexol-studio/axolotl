import { View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { AppText } from '../../../components/primitives/AppText'
import { useAppTheme } from '../../../theme'
import type { TodoItem } from '../types'
import { TodoListItem } from './TodoListItem'

type TodoListSectionProps = {
  items: readonly TodoItem[]
  onMarkDone: (id: string) => void
}

export const TodoListSection = ({
  items,
  onMarkDone,
}: TodoListSectionProps) => {
  const { t } = useTranslation()
  const { spacing } = useAppTheme()

  if (items.length === 0) {
    return (
      <View testID="todo-empty-state">
        <AppText>{t('common.todo.emptyState')}</AppText>
      </View>
    )
  }

  return (
    <View testID="todo-list-section" style={{ gap: spacing.xs }}>
      {items.map((item, index) => (
        <TodoListItem
          key={item.id}
          item={item}
          index={index}
          onMarkDone={onMarkDone}
        />
      ))}
    </View>
  )
}
