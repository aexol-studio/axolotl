import { fireEvent, render, screen } from '@testing-library/react-native';

import { EmptyStateTemplate } from './EmptyStateTemplate';

describe('EmptyStateTemplate', () => {
  it('renders content and action', () => {
    const onActionPress = jest.fn();

    render(
      <EmptyStateTemplate
        title="No data"
        description="Try again"
        actionLabel="Refresh"
        actionTestID="empty.action"
        onActionPress={onActionPress}
      />,
    );

    expect(screen.getByText('No data')).toBeTruthy();
    expect(screen.getByText('Try again')).toBeTruthy();

    fireEvent.press(screen.getByTestId('empty.action'));
    expect(onActionPress).toHaveBeenCalledTimes(1);
  });
});
