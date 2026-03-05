import { render, screen } from '@testing-library/react-native';

import TabsLayout from './_layout';

describe('app/(tabs)/_layout', () => {
  it('renders tabs navigator', () => {
    render(<TabsLayout />);

    expect(screen.getByTestId('mock.tabs')).toBeTruthy();
  });
});
