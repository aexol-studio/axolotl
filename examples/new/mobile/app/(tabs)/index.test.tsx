import { act, fireEvent, render, screen } from '@testing-library/react-native';

import HomeScreen from './index';

jest.mock('../../src/providers/ToastProvider', () => ({
  useToast: () => ({
    showToast: jest.fn(),
    hideToast: jest.fn(),
  }),
}));

describe('app/(tabs)/index', () => {
  it('renders starter blocks and testIDs', () => {
    render(<HomeScreen />);

    expect(screen.getByTestId('home-toggle-language-btn')).toBeTruthy();
    expect(screen.getByTestId('home-show-loading-btn')).toBeTruthy();
    expect(screen.getByTestId('home-show-error-btn')).toBeTruthy();
    expect(screen.getByTestId('home-show-empty-btn')).toBeTruthy();
    expect(screen.getByTestId('home-show-success-btn')).toBeTruthy();
    expect(screen.getByTestId('home-list-show-error-btn')).toBeTruthy();
    expect(screen.getByTestId('home-list-show-suspense-failure-btn')).toBeTruthy();
    expect(screen.getByTestId('home-list-orientation-vertical-btn')).toBeTruthy();
    expect(screen.getByTestId('home-list-orientation-horizontal-btn')).toBeTruthy();
    expect(screen.getByTestId('home-list-recovery-button-btn')).toBeTruthy();
    expect(screen.getByTestId('home-list-recovery-pull-btn')).toBeTruthy();
  });

  it('switches list orientation to horizontal', () => {
    render(<HomeScreen />);

    fireEvent.press(screen.getByTestId('home-list-orientation-horizontal-btn'));

    expect(screen.getByTestId('home-card-list-horizontal-list')).toBeTruthy();
    expect(screen.getByTestId('home-showcase-horizontal-list')).toBeTruthy();
  });

  it('switches to loading state view', () => {
    render(<HomeScreen />);

    fireEvent.press(screen.getByTestId('home-show-loading-btn'));
    expect(screen.getByTestId('state-loading-indicator')).toBeTruthy();
  });

  it('shows list error fallback with explicit refresh button', () => {
    render(<HomeScreen />);

    fireEvent.press(screen.getByTestId('home-list-recovery-button-btn'));
    fireEvent.press(screen.getByTestId('home-list-show-error-btn'));

    expect(screen.getByTestId('home-list-error-scroll')).toBeTruthy();
    expect(screen.getByTestId('home-list-refresh-btn')).toBeTruthy();
  });

  it('shows list error fallback with pull-to-refresh mode', () => {
    render(<HomeScreen />);

    fireEvent.press(screen.getByTestId('home-list-recovery-pull-btn'));
    fireEvent.press(screen.getByTestId('home-list-show-suspense-failure-btn'));

    expect(screen.getByTestId('home-list-error-scroll')).toBeTruthy();
    expect(screen.queryByTestId('home-list-refresh-btn')).toBeNull();
  });

  it('recovers from suspense failure back to tabs list flow', async () => {
    jest.useFakeTimers();
    try {
      render(<HomeScreen />);

      fireEvent.press(screen.getByTestId('home-list-recovery-button-btn'));
      fireEvent.press(screen.getByTestId('home-list-show-suspense-failure-btn'));

      expect(screen.getByTestId('home-list-error-scroll')).toBeTruthy();
      fireEvent.press(screen.getByTestId('home-show-success-btn'));

      await act(async () => {
        jest.advanceTimersByTime(200);
      });

      expect(screen.queryByTestId('home-list-error-scroll')).toBeNull();
      expect(screen.getByTestId('home-card-list')).toBeTruthy();
      expect(screen.getByTestId('home-showcase-card-list')).toBeTruthy();
    } finally {
      jest.useRealTimers();
    }
  });
});
