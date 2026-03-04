import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { ToastProvider, useToast } from './ToastProvider';

const Probe = () => {
  const { showToast } = useToast();
  return (
    <Text
      testID="toast-trigger-btn"
      onPress={() =>
        showToast({
          title: 'Done',
          message: 'Saved',
          variant: 'success',
        })
      }
    >
      Trigger
    </Text>
  );
};

describe('ToastProvider', () => {
  it('shows and dismisses toast', () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );

    fireEvent.press(screen.getByTestId('toast-trigger-btn'));
    expect(screen.getByTestId('toast-banner')).toBeTruthy();

    fireEvent.press(screen.getByTestId('toast-dismiss-btn'));
    expect(screen.queryByTestId('toast-banner')).toBeNull();
  });
});
