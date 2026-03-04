import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Axolotl Mobile',
  slug: 'axolotl-mobile',
  scheme: 'axolotl',
  version: '0.1.0',
  orientation: 'portrait',
  plugins: ['expo-router'],
  experiments: {
    typedRoutes: true,
  },
  ios: {
    bundleIdentifier: 'com.aexol-studio.axolotl-mobile',
  },
});
