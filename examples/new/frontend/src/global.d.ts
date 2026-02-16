interface InitialAuthData {
  isAuthenticated: boolean;
}

interface InitialTranslationsData {
  [key: string]: string;
}

interface Window {
  __INITIAL_AUTH__?: InitialAuthData;
  __INITIAL_TRANSLATIONS__?: InitialTranslationsData;
  __INITIAL_LOCALE__?: string;
}
