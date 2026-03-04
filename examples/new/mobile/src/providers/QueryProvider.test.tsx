import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { QueryProvider } from './QueryProvider';

describe('QueryProvider', () => {
  it('renders children', () => {
    render(
      <QueryProvider>
        <Text>Query child</Text>
      </QueryProvider>,
    );

    expect(screen.getByText('Query child')).toBeTruthy();
  });
});
