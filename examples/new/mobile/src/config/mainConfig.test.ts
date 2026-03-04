import {
  clampViewportRatio,
  getButtonMetrics,
  getComponentMetrics,
  getRawViewportRatio,
  getScaleProfile,
  getShadowPresets,
  getSpacingMultiplier,
  getTypographyMetrics,
  getViewportRatio,
  mainConfig,
  resolveScreenProfile,
} from './mainConfig';

describe('mainConfig', () => {
  it('returns scale-aware metrics', () => {
    expect(mainConfig.ui.defaultScale).toBe('comfortable');
    expect(getComponentMetrics('compact').buttonHeight).toBe(44);
    expect(getComponentMetrics('large').inputHeight).toBe(54);
    expect(getScaleProfile('large').spacingMultiplier).toBeGreaterThan(1);
  });

  it('resolves screen profile from viewport', () => {
    expect(resolveScreenProfile(320, 640)).toBe('phoneCompact');
    expect(resolveScreenProfile(390, 844)).toBe('phone');
    expect(resolveScreenProfile(834, 1194)).toBe('tablet');
  });

  it('applies profile-aware responsive multipliers to dimensions', () => {
    const compactPhoneButton = getComponentMetrics('comfortable', 'phoneCompact').buttonHeight;
    const phoneButton = getComponentMetrics('comfortable', 'phone').buttonHeight;
    const tabletButton = getComponentMetrics('comfortable', 'tablet').buttonHeight;

    expect(compactPhoneButton).toBeLessThan(phoneButton);
    expect(tabletButton).toBeGreaterThan(phoneButton);
    expect(getSpacingMultiplier('comfortable', 'tablet')).toBeGreaterThan(getSpacingMultiplier('comfortable', 'phone'));
  });

  it('returns typography sizes per scale', () => {
    const comfortable = getTypographyMetrics('comfortable', 'phone');
    const large = getTypographyMetrics('large', 'phone');
    const tabletComfortable = getTypographyMetrics('comfortable', 'tablet');

    expect(comfortable.body.fontSize).toBe(16);
    expect(large.body.fontSize).toBeGreaterThan(comfortable.body.fontSize);
    expect(tabletComfortable.body.fontSize).toBeGreaterThan(comfortable.body.fontSize);
  });

  it('computes viewport ratio from base viewport and clamps', () => {
    expect(mainConfig.ui.baseViewport.width).toBe(390);
    expect(mainConfig.ui.baseViewport.height).toBe(844);

    expect(getRawViewportRatio(390, 844)).toBe(1);
    expect(clampViewportRatio(0.4)).toBe(mainConfig.ui.viewportRatioClamp.min);
    expect(clampViewportRatio(2)).toBe(mainConfig.ui.viewportRatioClamp.max);

    expect(getViewportRatio(320, 640)).toBeCloseTo(mainConfig.ui.viewportRatioClamp.min);
    expect(getViewportRatio(1200, 2400)).toBeCloseTo(mainConfig.ui.viewportRatioClamp.max);
  });

  it('requires explicit button size metrics with height and scales by ratio', () => {
    const mdPhone = getButtonMetrics('comfortable', 'phone', 1).md;
    const mdTablet = getButtonMetrics('comfortable', 'tablet', 1.2).md;

    expect(mdPhone.height).toBeGreaterThan(0);
    expect(mdPhone.horizontalPadding).toBeGreaterThan(0);
    expect(mdPhone.borderRadius).toBeGreaterThan(0);

    expect(mdTablet.height).toBeGreaterThan(mdPhone.height);
    expect(mdTablet.horizontalPadding).toBeGreaterThan(mdPhone.horizontalPadding);
  });

  it('exposes shared boxShadow presets for runtime cards', () => {
    const presets = getShadowPresets();

    expect(presets.heroCard).toBe('0px 10px 20px rgba(2, 6, 23, 0.18)');
    expect(presets.showcaseCard).toContain('rgba(2, 6, 23');
    expect(presets.listCard).toContain('rgba(15, 23, 42');
    expect(presets.listItem).toContain('rgba(30, 41, 59');
  });
});
