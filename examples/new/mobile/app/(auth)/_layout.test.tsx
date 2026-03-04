import { render, screen } from '@testing-library/react-native';

import AuthLayout from './_layout';

describe('app/(auth)/_layout', () => {
  it('renders auth stack', () => {
    render(<AuthLayout />);

    expect(screen.getByTestId('mock.stack')).toBeTruthy();
  });
});
