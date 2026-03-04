export type UiScale = 'compact' | 'comfortable' | 'large';
export type ScreenProfile = 'phoneCompact' | 'phone' | 'tablet';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ShadowPreset = 'heroCard' | 'showcaseCard' | 'listCard' | 'listItem';

const screenBreakpoints = {
  compactPhoneMax: 359,
  tabletMin: 768,
} as const;

const baseViewport = {
  width: 390,
  height: 844,
} as const;

const viewportRatioClamp = {
  min: 0.9,
  max: 1.2,
} as const;

const screenProfileMultipliers = {
  phoneCompact: {
    spacingMultiplier: 0.92,
    textMultiplier: 0.94,
    componentMultiplier: 0.94,
  },
  phone: {
    spacingMultiplier: 1,
    textMultiplier: 1,
    componentMultiplier: 1,
  },
  tablet: {
    spacingMultiplier: 1.15,
    textMultiplier: 1.1,
    componentMultiplier: 1.12,
  },
} as const;

const uiScaleProfiles = {
  compact: {
    spacingMultiplier: 0.9,
    textMultiplier: 0.94,
  },
  comfortable: {
    spacingMultiplier: 1,
    textMultiplier: 1,
  },
  large: {
    spacingMultiplier: 1.15,
    textMultiplier: 1.08,
  },
} as const;

const componentMetricsByScale = {
  compact: {
    buttonHeight: 44,
    inputHeight: 44,
    listItemHeight: 48,
    radiusSm: 10,
    radiusMd: 12,
    radiusLg: 16,
    radiusXl: 22,
  },
  comfortable: {
    buttonHeight: 48,
    inputHeight: 48,
    listItemHeight: 52,
    radiusSm: 12,
    radiusMd: 14,
    radiusLg: 18,
    radiusXl: 26,
  },
  large: {
    buttonHeight: 54,
    inputHeight: 54,
    listItemHeight: 58,
    radiusSm: 14,
    radiusMd: 16,
    radiusLg: 20,
    radiusXl: 30,
  },
} as const;

const buttonMetricsByScale = {
  compact: {
    sm: {
      height: 40,
      horizontalPadding: 14,
      borderRadius: 10,
    },
    md: {
      height: 44,
      horizontalPadding: 18,
      borderRadius: 10,
    },
    lg: {
      height: 48,
      horizontalPadding: 20,
      borderRadius: 12,
    },
  },
  comfortable: {
    sm: {
      height: 44,
      horizontalPadding: 16,
      borderRadius: 12,
    },
    md: {
      height: 48,
      horizontalPadding: 18,
      borderRadius: 12,
    },
    lg: {
      height: 54,
      horizontalPadding: 22,
      borderRadius: 14,
    },
  },
  large: {
    sm: {
      height: 50,
      horizontalPadding: 18,
      borderRadius: 14,
    },
    md: {
      height: 54,
      horizontalPadding: 22,
      borderRadius: 16,
    },
    lg: {
      height: 60,
      horizontalPadding: 24,
      borderRadius: 18,
    },
  },
} as const;

const layoutRules = {
  justify: {
    start: 'flex-start',
    center: 'center',
    between: 'space-between',
  },
} as const;

const typographyBase = {
  h1: { fontSize: 28, lineHeight: 34 },
  h2: { fontSize: 22, lineHeight: 28 },
  h3: { fontSize: 18, lineHeight: 24 },
  body: { fontSize: 16, lineHeight: 22 },
  button: { fontSize: 16, lineHeight: 20 },
} as const;

const shadowPresets = {
  heroCard: '0px 10px 20px rgba(2, 6, 23, 0.18)',
  showcaseCard: '0px 8px 20px rgba(2, 6, 23, 0.22)',
  listCard: '0px 8px 18px rgba(15, 23, 42, 0.07)',
  listItem: '0px 6px 14px rgba(30, 41, 59, 0.08)',
} as const;

export const mainConfig = {
  ui: {
    defaultScale: 'comfortable' as UiScale,
    scales: uiScaleProfiles,
    screenProfiles: screenProfileMultipliers,
    breakpoints: screenBreakpoints,
    baseViewport,
    viewportRatioClamp,
  },
  components: {
    metrics: componentMetricsByScale,
    buttonMetrics: buttonMetricsByScale,
    text: typographyBase,
    layout: layoutRules,
    shadowPresets,
  },
} as const;

export function clampViewportRatio(value: number) {
  return Math.max(mainConfig.ui.viewportRatioClamp.min, Math.min(mainConfig.ui.viewportRatioClamp.max, value));
}

export function getRawViewportRatio(width: number, height: number) {
  const widthRatio = width / mainConfig.ui.baseViewport.width;
  const heightRatio = height / mainConfig.ui.baseViewport.height;
  return Math.min(widthRatio, heightRatio);
}

export function getViewportRatio(width: number, height: number) {
  return clampViewportRatio(getRawViewportRatio(width, height));
}

export function getScaleProfile(scale: UiScale = mainConfig.ui.defaultScale) {
  return mainConfig.ui.scales[scale];
}

export function resolveScreenProfile(width: number, height: number): ScreenProfile {
  const shortestSide = Math.min(width, height);

  if (shortestSide >= mainConfig.ui.breakpoints.tabletMin) {
    return 'tablet';
  }

  if (shortestSide <= mainConfig.ui.breakpoints.compactPhoneMax) {
    return 'phoneCompact';
  }

  return 'phone';
}

function getResponsiveMultipliers(
  scale: UiScale = mainConfig.ui.defaultScale,
  screenProfile: ScreenProfile = 'phone',
  viewportRatio = 1,
) {
  const scaleProfile = getScaleProfile(scale);
  const profile = mainConfig.ui.screenProfiles[screenProfile];
  const normalizedViewportRatio = clampViewportRatio(viewportRatio);

  return {
    spacingMultiplier: scaleProfile.spacingMultiplier * profile.spacingMultiplier * normalizedViewportRatio,
    textMultiplier: scaleProfile.textMultiplier * profile.textMultiplier * normalizedViewportRatio,
    componentMultiplier: profile.componentMultiplier * normalizedViewportRatio,
  };
}

export function getComponentMetrics(
  scale: UiScale = mainConfig.ui.defaultScale,
  screenProfile: ScreenProfile = 'phone',
  viewportRatio = 1,
) {
  const metrics = mainConfig.components.metrics[scale];
  const { componentMultiplier } = getResponsiveMultipliers(scale, screenProfile, viewportRatio);
  const scaleValue = (value: number) => Math.round(value * componentMultiplier);

  return {
    buttonHeight: scaleValue(metrics.buttonHeight),
    inputHeight: scaleValue(metrics.inputHeight),
    listItemHeight: scaleValue(metrics.listItemHeight),
    radiusSm: scaleValue(metrics.radiusSm),
    radiusMd: scaleValue(metrics.radiusMd),
    radiusLg: scaleValue(metrics.radiusLg),
    radiusXl: scaleValue(metrics.radiusXl),
  };
}

export function getButtonMetrics(
  scale: UiScale = mainConfig.ui.defaultScale,
  screenProfile: ScreenProfile = 'phone',
  viewportRatio = 1,
) {
  const metrics = mainConfig.components.buttonMetrics[scale];
  const { componentMultiplier } = getResponsiveMultipliers(scale, screenProfile, viewportRatio);
  const scaleValue = (value: number) => Math.round(value * componentMultiplier);

  return {
    sm: {
      height: scaleValue(metrics.sm.height),
      horizontalPadding: scaleValue(metrics.sm.horizontalPadding),
      borderRadius: scaleValue(metrics.sm.borderRadius),
    },
    md: {
      height: scaleValue(metrics.md.height),
      horizontalPadding: scaleValue(metrics.md.horizontalPadding),
      borderRadius: scaleValue(metrics.md.borderRadius),
    },
    lg: {
      height: scaleValue(metrics.lg.height),
      horizontalPadding: scaleValue(metrics.lg.horizontalPadding),
      borderRadius: scaleValue(metrics.lg.borderRadius),
    },
  };
}

export function getTypographyMetrics(
  scale: UiScale = mainConfig.ui.defaultScale,
  screenProfile: ScreenProfile = 'phone',
  viewportRatio = 1,
) {
  const responsive = getResponsiveMultipliers(scale, screenProfile, viewportRatio);
  const scaleText = (value: number) => Math.round(value * responsive.textMultiplier);

  return {
    h1: {
      fontSize: scaleText(mainConfig.components.text.h1.fontSize),
      lineHeight: scaleText(mainConfig.components.text.h1.lineHeight),
    },
    h2: {
      fontSize: scaleText(mainConfig.components.text.h2.fontSize),
      lineHeight: scaleText(mainConfig.components.text.h2.lineHeight),
    },
    h3: {
      fontSize: scaleText(mainConfig.components.text.h3.fontSize),
      lineHeight: scaleText(mainConfig.components.text.h3.lineHeight),
    },
    body: {
      fontSize: scaleText(mainConfig.components.text.body.fontSize),
      lineHeight: scaleText(mainConfig.components.text.body.lineHeight),
    },
    button: {
      fontSize: scaleText(mainConfig.components.text.button.fontSize),
      lineHeight: scaleText(mainConfig.components.text.button.lineHeight),
    },
  };
}

export function getSpacingMultiplier(
  scale: UiScale = mainConfig.ui.defaultScale,
  screenProfile: ScreenProfile = 'phone',
  viewportRatio = 1,
) {
  return getResponsiveMultipliers(scale, screenProfile, viewportRatio).spacingMultiplier;
}

export function getLayoutMetrics() {
  return mainConfig.components.layout;
}

export function getShadowPresets() {
  return mainConfig.components.shadowPresets;
}
