import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { PrimaryButton } from '../../../components/primitives/PrimaryButton'
import { useAppTheme } from '../../../theme'
import type { TodoFilter } from '../types'

type TodoFilterBarProps = {
  filter: TodoFilter
  onChangeFilter: (filter: TodoFilter) => void
}

export const TodoFilterBar = ({
  filter,
  onChangeFilter,
}: TodoFilterBarProps) => {
  const { t } = useTranslation()
  const { spacing } = useAppTheme()

  const toSelected = (value: TodoFilter) => (filter === value ? '✓' : '')

  return (
    <View style={[styles.row, { gap: spacing.xs }]}>
      <PrimaryButton
        testID="todo-filter-all-btn"
        variant={filter === 'all' ? 'solid' : 'soft'}
        label={t('common.todo.filterAll', { selected: toSelected('all') })}
        onPress={() => onChangeFilter('all')}
        size="sm"
      />
      <PrimaryButton
        testID="todo-filter-active-btn"
        variant={filter === 'active' ? 'solid' : 'soft'}
        label={t('common.todo.filterActive', {
          selected: toSelected('active'),
        })}
        onPress={() => onChangeFilter('active')}
        size="sm"
      />
      <PrimaryButton
        testID="todo-filter-completed-btn"
        variant={filter === 'completed' ? 'solid' : 'soft'}
        label={t('common.todo.filterCompleted', {
          selected: toSelected('completed'),
        })}
        onPress={() => onChangeFilter('completed')}
        size="sm"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
