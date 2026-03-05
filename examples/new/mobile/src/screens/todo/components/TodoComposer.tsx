import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { AppInput } from '../../../components/primitives/AppInput'
import { PrimaryButton } from '../../../components/primitives/PrimaryButton'
import { useAppTheme } from '../../../theme'

type TodoComposerProps = {
  value: string
  onChange: (value: string) => void
  onAdd: () => void
  isSubmitting?: boolean
}

export const TodoComposer = ({
  value,
  onChange,
  onAdd,
  isSubmitting = false,
}: TodoComposerProps) => {
  const { t } = useTranslation()
  const { spacing } = useAppTheme()

  return (
    <View style={[styles.container, { gap: spacing.sm }]}>
      <AppInput
        testID="todo-composer-input"
        value={value}
        onChangeText={onChange}
        placeholder={t('common.todo.composerPlaceholder')}
        returnKeyType="done"
        onSubmitEditing={onAdd}
      />
      <PrimaryButton
        testID="todo-composer-add-btn"
        label={t('common.todo.addAction')}
        onPress={onAdd}
        disabled={!value.trim() || isSubmitting}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
})
