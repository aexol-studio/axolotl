import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import {
  AppThemeProvider,
  THEME_BASE_MODE,
  initThemeBase,
  resetThemeBaseForTests,
  useAppTheme,
} from './theme';

const ThemeProbe = () => {
  const theme = useAppTheme();
  return (
    <>
      <Text testID="theme.mode">{theme.mode}</Text>
      <Text testID="theme.background">{theme.colors.background}</Text>
      <Text testID="theme.buttonHeight">{theme.shape.buttonHeight}</Text>
      <Text testID="theme.shadow.hero">{theme.shadows.heroCard}</Text>
      <Text testID="theme.layout.justify.center">{theme.layout.justify.center}</Text>
    </>
  );
};

describe('theme base init', () => {
  beforeEach(() => {
    resetThemeBaseForTests();
  });

  it('initializes and returns stable base theme contract', () => {
    const first = initThemeBase();
    const second = initThemeBase();

    expect(first).toBe(second);
    expect(first.mode).toBe(THEME_BASE_MODE);
    expect(first.colors.background).toBe('#eef2ff');
  });

  it('provides base theme by default', () => {
    render(
      <AppThemeProvider>
        <ThemeProbe />
      </AppThemeProvider>,
    );

    expect(screen.getByTestId('theme.mode').props.children).toBe('light');
    expect(screen.getByTestId('theme.background').props.children).toBe('#eef2ff');
    expect(screen.getByTestId('theme.buttonHeight').props.children).toBe(48);
    expect(screen.getByTestId('theme.shadow.hero').props.children).toContain('rgba(2, 6, 23');
    expect(screen.getByTestId('theme.layout.justify.center').props.children).toBe('center');
  });

  it('provides dark theme overrides when mode is dark', () => {
    render(
      <AppThemeProvider mode="dark" scale="large" screenProfile="tablet" viewportRatio={1.2}>
        <ThemeProbe />
      </AppThemeProvider>,
    );

    expect(screen.getByTestId('theme.mode').props.children).toBe('dark');
    expect(screen.getByTestId('theme.background').props.children).toBe('#020617');
    expect(screen.getByTestId('theme.buttonHeight').props.children).toBe(73);
  });

  it('falls back to fail-safe theme when base creation throws', () => {
    const theme = initThemeBase(() => {
      throw new Error('theme bootstrap failure');
    });

    expect(theme.mode).toBe('light');
    expect(theme.colors.background).toBe('#eef2ff');
  });
});
