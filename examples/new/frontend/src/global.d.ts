interface InitialTranslationsData {
  [key: string]: string;
}

interface Window {
  __INITIAL_TRANSLATIONS__?: InitialTranslationsData;
  __INITIAL_LOCALE__?: string;
}
