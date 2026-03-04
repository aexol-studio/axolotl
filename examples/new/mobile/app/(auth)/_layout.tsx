import { Stack } from 'expo-router';

import { createNativeHeaderOptions } from '../../src/components/navigation/nativeHeaders';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={createNativeHeaderOptions({
          title: 'Sign in',
          largeTitle: false,
        })}
      />
    </Stack>
  );
}
