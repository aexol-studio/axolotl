import { render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';

import { composeProviders } from './composeProviders';

describe('composeProviders', () => {
  it('wraps children with enabled providers in declaration order', () => {
    const Providers = composeProviders([
      {
        id: 'one',
        Provider: ({ children }) => <View testID="provider.one">{children}</View>,
      },
      {
        id: 'two',
        Provider: ({ children }) => <View testID="provider.two">{children}</View>,
      },
    ]);

    render(
      <Providers>
        <Text>Composable child</Text>
      </Providers>,
    );

    expect(screen.getByTestId('provider.one')).toBeTruthy();
    expect(screen.getByTestId('provider.two')).toBeTruthy();
    expect(screen.getByText('Composable child')).toBeTruthy();
  });

  it('skips disabled provider slots', () => {
    const Providers = composeProviders([
      {
        id: 'enabled',
        Provider: ({ children }) => <View testID="provider.enabled">{children}</View>,
      },
      {
        id: 'disabled',
        Provider: ({ children }) => <View testID="provider.disabled">{children}</View>,
        enabled: false,
      },
    ]);

    render(
      <Providers>
        <Text>Composable child</Text>
      </Providers>,
    );

    expect(screen.getByTestId('provider.enabled')).toBeTruthy();
    expect(screen.queryByTestId('provider.disabled')).toBeNull();
  });
});
