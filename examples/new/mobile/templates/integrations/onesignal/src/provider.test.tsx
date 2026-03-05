import { render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { OneSignalTemplateProvider } from './provider';

describe('OneSignalTemplateProvider', () => {
  afterEach(() => {
    delete process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;
    jest.clearAllMocks();
  });

  it('renders children and skips setup when app id is missing', async () => {
    const initialize = jest.fn();
    const login = jest.fn();
    const logout = jest.fn();

    render(
      <OneSignalTemplateProvider sdk={{ initialize, login, logout }}>
        <Text>OneSignal child</Text>
      </OneSignalTemplateProvider>,
    );

    expect(screen.getByText('OneSignal child')).toBeTruthy();
    await waitFor(() => expect(initialize).not.toHaveBeenCalled());
  });

  it('initializes setup and cleans up on unmount when app id exists', async () => {
    process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID = 'onesignal-app';
    const initialize = jest.fn();
    const login = jest.fn();
    const logout = jest.fn();

    const view = render(
      <OneSignalTemplateProvider userId="user-42" sdk={{ initialize, login, logout }}>
        <Text>Configured OneSignal child</Text>
      </OneSignalTemplateProvider>,
    );

    await waitFor(() => expect(initialize).toHaveBeenCalledWith('onesignal-app'));
    await waitFor(() => expect(login).toHaveBeenCalledWith('user-42'));

    view.unmount();
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
