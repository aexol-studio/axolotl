import { Pressable, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { AppListItem } from '../../../components/primitives/AppListItem'
import { AppText } from '../../../components/primitives/AppText'
import { PrimaryButton } from '../../../components/primitives/PrimaryButton'
import { useAppTheme } from '../../../theme'
import type { TodoItem } from '../types'

type TodoListItemProps = {
  item: TodoItem
  index: number
  onMarkDone: (id: string) => void
}

export const TodoListItem = ({
  item,
  index,
  onMarkDone,
}: TodoListItemProps) => {
  const { t } = useTranslation()
  const { colors, spacing } = useAppTheme()

  return (
    <AppListItem testID={`todo-item-${index}`}>
      <View style={[styles.row, { gap: spacing.sm }]}>
        <Pressable
          testID={`todo-item-${index}-toggle-btn`}
          accessibilityRole="button"
          onPress={() => onMarkDone(item.id)}
          style={styles.content}
        >
          <AppText
            variant="body"
            style={{
              color: item.completed ? colors.textMuted : colors.text,
              textDecorationLine: item.completed ? 'line-through' : 'none',
            }}
          >
            {item.title}
          </AppText>
          <AppText variant="body" style={{ color: colors.textMuted }}>
            {item.completed
              ? t('common.todo.statusCompleted')
              : t('common.todo.statusActive')}
          </AppText>
          {item.pendingSync && (
            <AppText
              testID={`todo-item-${index}-pending-sync-copy`}
              variant="body"
              style={{ color: colors.textMuted }}
            >
              {t('common.todo.pendingSyncLabel')}
            </AppText>
          )}
        </Pressable>
        <PrimaryButton
          testID={`todo-item-${index}-status-btn`}
          label={
            item.completed
              ? t('common.todo.doneStatusAction')
              : t('common.todo.markDoneAction')
          }
          variant="ghost"
          size="sm"
          onPress={() => onMarkDone(item.id)}
          disabled={item.completed}
        />
      </View>
    </AppListItem>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
})
