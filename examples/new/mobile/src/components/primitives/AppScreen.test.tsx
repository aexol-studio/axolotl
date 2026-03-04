import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { AppScreen } from './AppScreen';

describe('AppScreen', () => {
  it('renders children inside scaffold', () => {
    render(
      <AppScreen>
        <Text>Content</Text>
      </AppScreen>,
    );

    expect(screen.getByText('Content')).toBeTruthy();
  });
});
