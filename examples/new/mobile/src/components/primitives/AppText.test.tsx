import { render, screen } from '@testing-library/react-native';

import { AppText } from './AppText';

describe('AppText', () => {
  it('renders provided content', () => {
    render(
      <AppText testID="app-text-probe" variant="h2">
        Probe
      </AppText>,
    );

    expect(screen.getByTestId('app-text-probe')).toBeTruthy();
    expect(screen.getByText('Probe')).toBeTruthy();
  });
});
