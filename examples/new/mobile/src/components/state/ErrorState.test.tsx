import { fireEvent, render, screen } from '@testing-library/react-native';

import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('renders error details and retries', () => {
    const onRetry = jest.fn();

    render(
      <ErrorState
        title="Error"
        message="Details"
        retryLabel="Retry"
        retryTestID="error-retry-btn"
        onRetry={onRetry}
      />,
    );

    fireEvent.press(screen.getByTestId('error-retry-btn'));
    expect(screen.getByText('Error')).toBeTruthy();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
