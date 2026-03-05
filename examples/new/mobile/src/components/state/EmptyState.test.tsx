import { fireEvent, render, screen } from '@testing-library/react-native';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders empty details and action button', () => {
    const onActionPress = jest.fn();

    render(
      <EmptyState
        title="No records"
        description="Add first"
        actionLabel="Create"
        actionTestID="empty-action-btn"
        onActionPress={onActionPress}
      />,
    );

    fireEvent.press(screen.getByTestId('empty-action-btn'));
    expect(screen.getByText('No records')).toBeTruthy();
    expect(onActionPress).toHaveBeenCalledTimes(1);
  });
});
