if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === '1') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { registerRootComponent } = require('expo');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const StorybookUIRoot = require('./.storybook').default;

  registerRootComponent(StorybookUIRoot);
} else {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('expo-router/entry');
}
