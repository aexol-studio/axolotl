import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { AppProviders } from './AppProviders';
import type { ProviderSlot } from './composeProviders';

const mockInitI18n = jest.fn(async () => undefined);
const mockInitThemeBase = jest.fn();
const mockUseScreenProfile = jest.fn<
  { screenProfile: 'phone' | 'phoneCompact' | 'tablet'; viewportRatio: number },
  []
>(() => ({ screenProfile: 'phone', viewportRatio: 1 }));

jest.mock('../lib/i18n', () => ({
  initI18n: () => mockInitI18n(),
}));

jest.mock('../theme', () => {
  const actual = jest.requireActual('../theme');
  return {
    ...actual,
    initThemeBase: () => mockInitThemeBase(),
  };
});

jest.mock('../hooks/useScreenProfile', () => ({
  useScreenProfile: () => mockUseScreenProfile(),
}));

describe('AppProviders', () => {
  beforeEach(() => {
    mockInitI18n.mockClear();
    mockInitThemeBase.mockClear();
    mockUseScreenProfile.mockClear();
    mockUseScreenProfile.mockReturnValue({ screenProfile: 'phone', viewportRatio: 1 });
  });

  it('renders children with required providers', () => {
    render(
      <AppProviders>
        <Text>Providers child</Text>
      </AppProviders>,
    );

    expect(screen.getByTestId('safe-area-provider')).toBeTruthy();
    expect(screen.getByText('Providers child')).toBeTruthy();
    expect(screen.getByTestId('keyboard-provider')).toBeTruthy();
  });

  it('runs i18n and theme base initialization on mount', () => {
    render(
      <AppProviders>
        <Text>Init check</Text>
      </AppProviders>,
    );

    expect(mockInitI18n).toHaveBeenCalledTimes(1);
    expect(mockInitThemeBase).toHaveBeenCalledTimes(1);
  });

  it('composes optional integration slots between core theme and query providers', () => {
    const renderMarker = jest.fn();
    const integrationSlots: readonly ProviderSlot[] = [
      {
        id: 'integration.test',
        Provider: ({ children }) => {
          renderMarker();
          return <>{children}</>;
        },
      },
    ];

    render(
      <AppProviders integrationSlots={integrationSlots}>
        <Text>Slot child</Text>
      </AppProviders>,
    );

    expect(screen.getByText('Slot child')).toBeTruthy();
    expect(renderMarker).toHaveBeenCalledTimes(1);
  });

  it('resolves screen profile for theme provider composition', () => {
    mockUseScreenProfile.mockReturnValue({ screenProfile: 'tablet', viewportRatio: 1.2 });

    render(
      <AppProviders>
        <Text>Profile child</Text>
      </AppProviders>,
    );

    expect(mockUseScreenProfile).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Profile child')).toBeTruthy();
  });

  it('shows suspense fallback when a child suspends', () => {
    const pending = new Promise(() => undefined);
    const SuspendedProbe = () => {
      throw pending;
    };

    render(
      <AppProviders>
        <SuspendedProbe />
      </AppProviders>,
    );

    expect(screen.getByTestId('state-loading-indicator')).toBeTruthy();
    expect(screen.getByText('Loading...')).toBeTruthy();
  });
});
