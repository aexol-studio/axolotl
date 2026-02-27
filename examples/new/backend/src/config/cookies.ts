export const COOKIE_NAME = 'auth-token';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// --- Locale cookie (NOT httpOnly — client JS needs to read/write it) ---

export const LOCALE_COOKIE_NAME = 'locale';

export const SUPPORTED_LOCALES = ['en', 'pl'] as const;
