import { render, screen } from '@testing-library/react-native';

import RootLayout from './_layout';

describe('app/_layout', () => {
  it('renders root stack inside providers', () => {
    render(<RootLayout />);

    expect(screen.getByTestId('safe-area-provider')).toBeTruthy();
    expect(screen.getByTestId('mock.stack')).toBeTruthy();
  });
});
