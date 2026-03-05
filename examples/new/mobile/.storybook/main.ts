import type { StorybookConfig } from '@storybook/react-native'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.?(ts|tsx)'],
  addons: ['@storybook/addon-ondevice-actions'],
}

export default config
