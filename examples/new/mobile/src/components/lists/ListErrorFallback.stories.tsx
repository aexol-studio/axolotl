import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-ondevice-actions';

import { ListErrorFallback } from './ListErrorFallback';

const meta: Meta<typeof ListErrorFallback> = {
  title: 'Lists/ListErrorFallback',
  component: ListErrorFallback,
  args: {
    title: 'List failed',
    message: 'Unable to load records',
    retryLabel: 'Refresh',
    onRefresh: action('list-refresh'),
    scrollTestID: 'storybook-list-error-scroll',
    refreshButtonTestID: 'storybook-list-error-refresh-btn',
  },
};

export default meta;

type Story = StoryObj<typeof ListErrorFallback>;

export const ButtonRecovery: Story = {};

export const PullToRefreshRecovery: Story = {
  args: {
    usePullToRefresh: true,
  },
};
