import type { Meta, StoryObj } from '@storybook/react';

import { CardList } from './CardList';
import { FlashCardList } from './FlashCardList';
import { StaticCardList } from './StaticCardList';
import { AppText } from '../primitives/AppText';

const meta: Meta<typeof CardList<string>> = {
  title: 'Lists/CardList',
  component: CardList,
  args: {
    testID: 'storybook-card-list',
    title: 'Starter list',
    subtitle: 'Reusable card rows',
    data: ['Tokens', 'Providers', 'Stories'],
    keyExtractor: (item: string) => item,
    renderItem: (item: string) => <AppText>{item}</AppText>,
  },
};

export default meta;

type Story = StoryObj<typeof CardList<string>>;

export const DefaultFlashStrategy: Story = {
  args: {
    testID: 'storybook-card-list-flash-default',
    title: 'FlashList strategy (default)',
    subtitle: 'Default path for heavier/reactive lists',
  },
};

export const FlashStrategyHorizontalDefault: Story = {
  args: {
    testID: 'storybook-card-list-horizontal',
    orientation: 'horizontal',
    title: 'FlashList horizontal (default)',
    subtitle: 'Default strategy in horizontal mode',
  },
};

export const FlashStrategyVertical: Story = {
  render: (args) => (
    <FlashCardList
      {...args}
      testID="storybook-flash-strategy-vertical"
      title="Flash list strategy"
      subtitle="For reactive/heavier lists"
    />
  ),
};

export const FlashStrategyHorizontal: Story = {
  render: (args) => (
    <FlashCardList
      {...args}
      testID="storybook-flash-strategy-horizontal"
      title="Flash horizontal"
      subtitle="Performance oriented horizontal list"
      orientation="horizontal"
    />
  ),
};

export const ScrollStrategyVertical: Story = {
  render: (args) => (
    <StaticCardList
      {...args}
      testID="storybook-scroll-strategy-vertical"
      title="ScrollView strategy"
      subtitle="For small hardcoded blocks"
    />
  ),
};

export const ScrollStrategyHorizontal: Story = {
  render: (args) => (
    <StaticCardList
      {...args}
      testID="storybook-scroll-strategy-horizontal"
      title="ScrollView horizontal"
      subtitle="Styled static horizontal list"
      orientation="horizontal"
    />
  ),
};
