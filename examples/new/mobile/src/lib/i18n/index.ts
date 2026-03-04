import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { useSettingsStore } from '../../stores/settingsStore';
import commonEn from './resources/en/common.json';
import commonPl from './resources/pl/common.json';

const resources = {
  en: { common: commonEn },
  pl: { common: commonPl },
} as const;

let initialized = false;

function createMissingKeyHandler() {
  return (lngs: readonly string[], ns: string, key: string) => {
    if (!__DEV__) {
      return;
    }
    const langs = lngs.join(',');
    console.warn(`[dev-translate] missing key ${ns}:${key} for ${langs}`);
  };
}

export async function initI18n() {
  if (initialized) {
    return i18n;
  }

  const language = useSettingsStore.getState().language;

  await i18n.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    saveMissing: __DEV__,
    missingKeyHandler: createMissingKeyHandler(),
  });

  initialized = true;
  return i18n;
}

export async function changeLanguage(language: 'en' | 'pl') {
  useSettingsStore.getState().setLanguage(language);

  if (!initialized) {
    await initI18n();
  }

  await i18n.changeLanguage(language);
}
