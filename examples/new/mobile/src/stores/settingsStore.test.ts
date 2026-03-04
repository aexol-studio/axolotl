import { useSettingsStore } from './settingsStore';

describe('settingsStore', () => {
  afterEach(() => {
    useSettingsStore.setState({ language: 'en', themeMode: 'light' });
  });

  it('updates language', () => {
    useSettingsStore.getState().setLanguage('pl');

    expect(useSettingsStore.getState().language).toBe('pl');
  });

  it('updates theme mode', () => {
    useSettingsStore.getState().setThemeMode('dark');

    expect(useSettingsStore.getState().themeMode).toBe('dark');
  });
});
