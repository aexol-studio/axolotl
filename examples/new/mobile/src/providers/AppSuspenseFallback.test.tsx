import { render, screen } from '@testing-library/react-native';

import { AppSuspenseFallback } from './AppSuspenseFallback';

describe('AppSuspenseFallback', () => {
  it('renders loading state fallback for suspense boundaries', () => {
    render(<AppSuspenseFallback />);

    expect(screen.getByTestId('state-loading-indicator')).toBeTruthy();
    expect(screen.getByText('Loading...')).toBeTruthy();
  });
});
