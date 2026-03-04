import { render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { MixpanelTemplateProvider } from './provider';

describe('MixpanelTemplateProvider', () => {
  afterEach(() => {
    delete process.env.EXPO_PUBLIC_MIXPANEL_TOKEN;
    jest.clearAllMocks();
  });

  it('renders children and does not initialize client when token is missing', () => {
    const createClient = jest.fn(async () => ({ track: jest.fn() }));

    render(
      <MixpanelTemplateProvider createClient={createClient}>
        <Text>Mixpanel child</Text>
      </MixpanelTemplateProvider>,
    );

    expect(screen.getByText('Mixpanel child')).toBeTruthy();
    expect(createClient).not.toHaveBeenCalled();
  });

  it('initializes client when token is configured', async () => {
    process.env.EXPO_PUBLIC_MIXPANEL_TOKEN = 'mix-token';
    const createClient = jest.fn(async () => ({ track: jest.fn() }));

    render(
      <MixpanelTemplateProvider createClient={createClient}>
        <Text>Configured child</Text>
      </MixpanelTemplateProvider>,
    );

    await waitFor(() => expect(createClient).toHaveBeenCalledWith('mix-token'));
  });
});
