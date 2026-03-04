export function getSentryConfig() {
  return {
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    environment: process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT ?? 'development',
  };
}

export function isSentryConfigured() {
  return Boolean(getSentryConfig().dsn);
}
