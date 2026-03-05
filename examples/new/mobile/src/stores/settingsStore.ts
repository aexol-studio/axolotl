import { create } from 'zustand';

import type { UiScale } from '../config/mainConfig';

type AppLanguage = 'en' | 'pl';

type ThemeMode = 'light' | 'dark';

type SettingsState = {
  language: AppLanguage;
  themeMode: ThemeMode;
  uiScale: UiScale;
  setLanguage: (language: AppLanguage) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
  setUiScale: (uiScale: UiScale) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  language: 'en',
  themeMode: 'light',
  uiScale: 'comfortable',
  setLanguage: (language) => set({ language }),
  setThemeMode: (themeMode) => set({ themeMode }),
  setUiScale: (uiScale) => set({ uiScale }),
}));

export function useAppLanguage() {
  return useSettingsStore((state) => state.language);
}

export function useUiScale() {
  return useSettingsStore((state) => state.uiScale);
}
