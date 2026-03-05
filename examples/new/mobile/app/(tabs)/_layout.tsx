import { Tabs } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { createNativeHeaderOptions } from '../../src/components/navigation/nativeHeaders'

export default function TabsLayout() {
  const { t } = useTranslation()

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={createNativeHeaderOptions({ title: t('common.home.title') })}
      />
      <Tabs.Screen
        name="todo"
        options={createNativeHeaderOptions({ title: t('common.todo.title') })}
      />
    </Tabs>
  )
}
