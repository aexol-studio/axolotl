import { Tabs } from 'expo-router';

import { createNativeHeaderOptions } from '../../src/components/navigation/nativeHeaders';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={createNativeHeaderOptions({ title: 'Axolotl' })} />
    </Tabs>
  );
}
