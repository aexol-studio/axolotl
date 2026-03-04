import { PropsWithChildren, createContext, useContext, useMemo } from 'react';

import type { ScreenProfile, UiScale } from '../config/mainConfig';
import { assertThemeBase, createThemeBase, type ThemeMode } from './base';
import { colors, createLayout, createShadows, createShape, createSpacing, createTextStyles } from './tokens';

export type { ThemeMode } from './base';

export type AppTheme = {
  mode: ThemeMode;
  colors: ReturnType<typeof createThemeBase>['colors'];
  spacing: ReturnType<typeof createThemeBase>['spacing'];
  shape: ReturnType<typeof createThemeBase>['shape'];
  layout: ReturnType<typeof createThemeBase>['layout'];
  shadows: ReturnType<typeof createThemeBase>['shadows'];
  textStyles: ReturnType<typeof createThemeBase>['textStyles'];
};

export const THEME_BASE_MODE: ThemeMode = 'light';

let baseTheme: AppTheme | null = null;

function createFailSafeTheme(): AppTheme {
  return {
    mode: THEME_BASE_MODE,
    colors: { ...colors },
    spacing: createSpacing({ uiScale: 'comfortable', screenProfile: 'phone' }),
    shape: createShape({ uiScale: 'comfortable', screenProfile: 'phone' }),
    layout: createLayout(),
    shadows: createShadows(),
    textStyles: createTextStyles({ uiScale: 'comfortable', screenProfile: 'phone' }),
  };
}

function createTheme(mode: ThemeMode, scale: UiScale = 'comfortable', screenProfile: ScreenProfile = 'phone', viewportRatio = 1): AppTheme {
  const base = createThemeBase(mode, { uiScale: scale, screenProfile, viewportRatio });
  assertThemeBase(base);
  return {
    mode,
    ...base,
  };
}

export function initThemeBase(
  factory: (mode: ThemeMode) => AppTheme = (mode) => createTheme(mode, 'comfortable', 'phone'),
) {
  if (baseTheme) {
    return baseTheme;
  }

  try {
    baseTheme = factory(THEME_BASE_MODE);
  } catch {
    baseTheme = createFailSafeTheme();
  }

  return baseTheme;
}

export function resetThemeBaseForTests() {
  baseTheme = null;
}

const ThemeContext = createContext<AppTheme>(initThemeBase());

type AppThemeProviderProps = PropsWithChildren<{
  mode?: ThemeMode;
  scale?: UiScale;
  screenProfile?: ScreenProfile;
  viewportRatio?: number;
}>;

export function AppThemeProvider({ children, mode = 'light', scale = 'comfortable', screenProfile = 'phone', viewportRatio = 1 }: AppThemeProviderProps) {
  const theme = useMemo(() => createTheme(mode, scale, screenProfile, viewportRatio), [mode, scale, screenProfile, viewportRatio]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
