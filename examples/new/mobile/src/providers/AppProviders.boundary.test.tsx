import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { AppProviders } from './AppProviders';

const mockUseScreenProfile = jest.fn<
  { screenProfile: 'phone' | 'phoneCompact' | 'tablet'; viewportRatio: number },
  []
>(() => ({ screenProfile: 'phone', viewportRatio: 1 }));

jest.mock('../hooks/useScreenProfile', () => ({
  useScreenProfile: () => mockUseScreenProfile(),
}));

describe('runtime boundary between src and templates', () => {
  beforeEach(() => {
    mockUseScreenProfile.mockClear();
    mockUseScreenProfile.mockReturnValue({ screenProfile: 'phone', viewportRatio: 1 });
  });

  it('renders app runtime without template env flags', () => {
    delete process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;
    delete process.env.EXPO_PUBLIC_MIXPANEL_TOKEN;
    delete process.env.EXPO_PUBLIC_ENABLE_STARTER_TEMPLATES;

    render(
      <AppProviders>
        <Text>Boundary child</Text>
      </AppProviders>,
    );

    expect(screen.getByText('Boundary child')).toBeTruthy();
    expect(mockUseScreenProfile).toHaveBeenCalledTimes(1);
  });
});
