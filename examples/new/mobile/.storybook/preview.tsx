import type { Preview } from '@storybook/react';
import type { PropsWithChildren } from 'react';

import { AppProviders } from '../src/providers/AppProviders';

const StorybookProviders = ({ children }: PropsWithChildren) => <AppProviders>{children}</AppProviders>;

const preview: Preview = {
  decorators: [
    (Story) => (
      <StorybookProviders>
        <Story />
      </StorybookProviders>
    ),
  ],
  parameters: {
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    actions: {
      argTypesRegex: '^on.*',
    },
  },
};

export default preview;
