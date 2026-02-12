export const COOKIE_NAME = 'auth-token';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

/**
 * Parses a raw Cookie header string into key-value pairs.
 * Splits by "; ", then splits each pair on the first "=" only,
 * trims whitespace, and URL-decodes values.
 */
export const parseCookies = (cookieHeader: string | null): Record<string, string> => {
  if (!cookieHeader) return {};

  return cookieHeader.split('; ').reduce<Record<string, string>>((cookies, pair) => {
    const eqIndex = pair.indexOf('=');
    if (eqIndex === -1) return cookies;

    const name = pair.slice(0, eqIndex).trim();
    const value = pair.slice(eqIndex + 1).trim();

    if (name) {
      cookies[name] = decodeURIComponent(value);
    }

    return cookies;
  }, {});
};

/** Returns the auth token from a Cookie header, or null if not present. */
export const getTokenFromCookies = (cookieHeader: string | null): string | null => {
  const cookies = parseCookies(cookieHeader);
  return cookies[COOKIE_NAME] ?? null;
};

/** Builds a Set-Cookie header value string for setting the auth cookie. */
export const serializeSetCookie = (token: string): string => {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    `Path=${COOKIE_OPTIONS.path}`,
    `HttpOnly`,
    `SameSite=${COOKIE_OPTIONS.sameSite}`,
    `Max-Age=${Math.floor(COOKIE_OPTIONS.maxAge / 1000)}`,
  ];

  if (COOKIE_OPTIONS.secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
};

/** Builds a Set-Cookie header value string that clears the auth cookie. */
export const serializeClearCookie = (): string => {
  const parts = [
    `${COOKIE_NAME}=`,
    `Path=${COOKIE_OPTIONS.path}`,
    `HttpOnly`,
    `SameSite=${COOKIE_OPTIONS.sameSite}`,
    `Max-Age=0`,
  ];

  if (COOKIE_OPTIONS.secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
};
