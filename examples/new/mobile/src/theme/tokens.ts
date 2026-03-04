import { TextStyle } from 'react-native';

import {
  getButtonMetrics,
  getComponentMetrics,
  getLayoutMetrics,
  getShadowPresets,
  getSpacingMultiplier,
  getTypographyMetrics,
  type ScreenProfile,
  type UiScale,
} from '../config/mainConfig';

export const colors = {
  background: '#eef2ff',
  backgroundSecondary: '#e2e8f0',
  surface: '#ffffff',
  surfaceAlt: '#f5f7ff',
  text: '#0f172a',
  textMuted: '#64748b',
  textInverse: '#f8fafc',
  primary: '#4f46e5',
  primaryPressed: '#4338ca',
  primaryDisabled: '#c7d2fe',
  success: '#15803d',
  warning: '#a16207',
  danger: '#dc2626',
  info: '#2563eb',
  border: '#cbd5e1',
  borderStrong: '#94a3b8',
  focusRing: '#818cf8',
  cardDarkStart: '#0f172a',
  cardDarkEnd: '#312e81',
  pastelPeach: '#ffe4d6',
  pastelMint: '#d1fae5',
  pastelLavender: '#ede9fe',
};

export type ThemeProfile = {
  uiScale: UiScale;
  screenProfile: ScreenProfile;
  viewportRatio?: number;
};

const baseSpacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
} as const;

const scaleValue = (value: number, multiplier: number) => Math.round(value * multiplier);

export function createSpacing(themeProfile: ThemeProfile = { uiScale: 'comfortable', screenProfile: 'phone' }) {
  const spacingMultiplier = getSpacingMultiplier(themeProfile.uiScale, themeProfile.screenProfile, themeProfile.viewportRatio);
  return {
    xs: scaleValue(baseSpacing.xs, spacingMultiplier),
    sm: scaleValue(baseSpacing.sm, spacingMultiplier),
    md: scaleValue(baseSpacing.md, spacingMultiplier),
    lg: scaleValue(baseSpacing.lg, spacingMultiplier),
    xl: scaleValue(baseSpacing.xl, spacingMultiplier),
    xxl: scaleValue(baseSpacing.xxl, spacingMultiplier),
  };
}

export function createShape(themeProfile: ThemeProfile = { uiScale: 'comfortable', screenProfile: 'phone' }) {
  const metrics = getComponentMetrics(themeProfile.uiScale, themeProfile.screenProfile, themeProfile.viewportRatio);
  const buttonMetrics = getButtonMetrics(themeProfile.uiScale, themeProfile.screenProfile, themeProfile.viewportRatio);

  return {
    radiusSm: metrics.radiusSm,
    radiusMd: metrics.radiusMd,
    radiusLg: metrics.radiusLg,
    radiusXl: metrics.radiusXl,
    inputHeight: metrics.inputHeight,
    buttonHeight: buttonMetrics.md.height,
    listItemHeight: metrics.listItemHeight,
    buttonSizes: buttonMetrics,
  };
}

export const createTextStyles = (themeProfile: ThemeProfile = { uiScale: 'comfortable', screenProfile: 'phone' }) => {
  const typeScale = getTypographyMetrics(themeProfile.uiScale, themeProfile.screenProfile, themeProfile.viewportRatio);
  return {
    h1: {
      fontSize: typeScale.h1.fontSize,
      lineHeight: typeScale.h1.lineHeight,
      color: colors.text,
      fontWeight: '700',
    } as TextStyle,
    h2: {
      fontSize: typeScale.h2.fontSize,
      lineHeight: typeScale.h2.lineHeight,
      color: colors.text,
      fontWeight: '700',
    } as TextStyle,
    h3: {
      fontSize: typeScale.h3.fontSize,
      lineHeight: typeScale.h3.lineHeight,
      color: colors.text,
      fontWeight: '700',
    } as TextStyle,
    body: {
      color: colors.textMuted,
      fontSize: typeScale.body.fontSize,
      lineHeight: typeScale.body.lineHeight,
    } as TextStyle,
    button: {
      color: colors.textInverse,
      fontSize: typeScale.button.fontSize,
      lineHeight: typeScale.button.lineHeight,
      fontWeight: '600',
    } as TextStyle,
  };
};

export function createLayout() {
  const layout = getLayoutMetrics();

  return {
    justify: layout.justify,
  };
}

export function createShadows() {
  const shadowPresets = getShadowPresets();

  return {
    ...shadowPresets,
  };
}

export const spacing = createSpacing();
export const shape = createShape();
export const layout = createLayout();
export const shadows = createShadows();

export const textStyles = createTextStyles();
