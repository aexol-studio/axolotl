import { createLayout, createShape, createShadows, createSpacing, createTextStyles, colors } from './tokens';
import type { ThemeProfile } from './tokens';

export type ThemeMode = 'light' | 'dark';

export type ThemeBase = {
  colors: typeof colors;
  spacing: ReturnType<typeof createSpacing>;
  shape: ReturnType<typeof createShape>;
  layout: ReturnType<typeof createLayout>;
  shadows: ReturnType<typeof createShadows>;
  textStyles: ReturnType<typeof createTextStyles>;
};

const darkOverrides: Partial<typeof colors> = {
  background: '#020617',
  backgroundSecondary: '#0b1120',
  surface: '#0f172a',
  surfaceAlt: '#1e1b4b',
  text: '#f8fafc',
  textMuted: '#cbd5e1',
  border: '#334155',
  borderStrong: '#475569',
  primary: '#818cf8',
  primaryPressed: '#6366f1',
  primaryDisabled: '#4338ca',
  focusRing: '#c4b5fd',
};

function mergeColors(mode: ThemeMode) {
  if (mode === 'dark') {
    return {
      ...colors,
      ...darkOverrides,
    };
  }

  return { ...colors };
}

export function createThemeBase(
  mode: ThemeMode,
  themeProfile: ThemeProfile = { uiScale: 'comfortable', screenProfile: 'phone' },
): ThemeBase {
  return {
    colors: mergeColors(mode),
    spacing: createSpacing(themeProfile),
    shape: createShape(themeProfile),
    layout: createLayout(),
    shadows: createShadows(),
    textStyles: createTextStyles(themeProfile),
  };
}

export function assertThemeBase(base: ThemeBase) {
  if (!base || !base.colors || !base.colors.background || !base.colors.text) {
    throw new Error('Theme base contract is invalid: colors are incomplete.');
  }

  if (
    !base.spacing ||
    !base.spacing.md ||
    !base.shape ||
    !base.shape.buttonHeight ||
    !base.layout ||
    !base.layout.justify ||
    !base.shadows ||
    !base.shadows.heroCard ||
    !base.textStyles ||
    !base.textStyles.body
  ) {
    throw new Error('Theme base contract is invalid: spacing/textStyles are incomplete.');
  }
}
