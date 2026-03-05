import { fireEvent, render, screen } from '@testing-library/react-native';

import { ListErrorFallback } from './ListErrorFallback';

describe('ListErrorFallback', () => {
  it('renders explicit refresh button flow', () => {
    const onRefresh = jest.fn();

    render(
      <ListErrorFallback
        title="Error"
        message="Cannot load"
        retryLabel="Refresh"
        onRefresh={onRefresh}
        refreshButtonTestID="home-list-error-refresh-btn"
      />,
    );

    fireEvent.press(screen.getByTestId('home-list-error-refresh-btn'));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('renders pull-to-refresh capable scroll fallback', () => {
    render(
      <ListErrorFallback
        title="Error"
        message="Cannot load"
        retryLabel="Refresh"
        onRefresh={() => undefined}
        usePullToRefresh
        scrollTestID="home-list-error-scroll"
      />,
    );

    expect(screen.getByTestId('home-list-error-scroll')).toBeTruthy();
    expect(screen.queryByTestId('list-error-refresh-btn')).toBeNull();
  });
});
