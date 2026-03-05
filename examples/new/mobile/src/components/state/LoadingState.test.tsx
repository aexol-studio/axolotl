import { render, screen } from '@testing-library/react-native';

import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
  it('renders loading indicator and label', () => {
    render(<LoadingState label="Loading" />);

    expect(screen.getByTestId('state-loading-indicator')).toBeTruthy();
    expect(screen.getByText('Loading')).toBeTruthy();
  });
});
