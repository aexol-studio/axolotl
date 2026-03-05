import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { createNativeHeaderOptions } from '../../src/components/navigation/nativeHeaders'

export default function AuthLayout() {
  const { t } = useTranslation()

  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={createNativeHeaderOptions({
          title: t('common.auth.signInTitle'),
          largeTitle: false,
        })}
      />
      <Stack.Screen
        name="sign-up"
        options={createNativeHeaderOptions({
          title: t('common.auth.signUpTitle'),
          largeTitle: false,
        })}
      />
    </Stack>
  )
}
