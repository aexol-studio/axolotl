import { render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { RealtimeTemplateProvider } from './provider';

describe('RealtimeTemplateProvider', () => {
  afterEach(() => {
    delete process.env.EXPO_PUBLIC_PUSHER_KEY;
    delete process.env.EXPO_PUBLIC_PUSHER_CLUSTER;
    jest.clearAllMocks();
  });

  it('renders children and does not initialize client when env is missing', () => {
    const createClient = jest.fn(async () => ({ subscribe: jest.fn() }));

    render(
      <RealtimeTemplateProvider createClient={createClient}>
        <Text>Realtime child</Text>
      </RealtimeTemplateProvider>,
    );

    expect(screen.getByText('Realtime child')).toBeTruthy();
    expect(createClient).not.toHaveBeenCalled();
  });

  it('initializes client when key and cluster are configured', async () => {
    process.env.EXPO_PUBLIC_PUSHER_KEY = 'pusher-key';
    process.env.EXPO_PUBLIC_PUSHER_CLUSTER = 'eu';
    const createClient = jest.fn(async () => ({ subscribe: jest.fn() }));

    render(
      <RealtimeTemplateProvider createClient={createClient}>
        <Text>Configured Realtime child</Text>
      </RealtimeTemplateProvider>,
    );

    await waitFor(() =>
      expect(createClient).toHaveBeenCalledWith({
        key: 'pusher-key',
        cluster: 'eu',
      }),
    );
  });
});
