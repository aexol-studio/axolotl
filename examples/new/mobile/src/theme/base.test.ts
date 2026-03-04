import { assertThemeBase, createThemeBase } from './base';

describe('theme base contract', () => {
  it('creates light and dark bases with required keys', () => {
    const light = createThemeBase('light');
    const dark = createThemeBase('dark');

    expect(light.colors.background).toBe('#eef2ff');
    expect(dark.colors.background).toBe('#020617');
    expect(light.spacing.md).toBeGreaterThan(0);
    expect(light.shape.buttonHeight).toBeGreaterThan(0);
    expect(light.shadows.heroCard).toContain('rgba(2, 6, 23');
    expect(dark.textStyles.body).toBeTruthy();
  });

  it('throws for invalid theme base object', () => {
    expect(() => assertThemeBase({} as never)).toThrow('Theme base contract is invalid');
  });
});
