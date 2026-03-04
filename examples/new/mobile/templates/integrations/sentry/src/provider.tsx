import { PropsWithChildren, useEffect } from 'react';

import { getSentryConfig, isSentryConfigured } from './config';
import { setupSentry, type SentryLike } from './setup';

type SentryTemplateProviderProps = PropsWithChildren<{
  sdk?: SentryLike;
}>;

let cachedSdk: SentryLike | null = null;

async function loadSdk() {
  if (cachedSdk) {
    return cachedSdk;
  }

  cachedSdk = {};
  return cachedSdk;
}

export function SentryTemplateProvider({ children, sdk }: SentryTemplateProviderProps) {
  useEffect(() => {
    let active = true;

    async function setup() {
      const config = getSentryConfig();
      if (!isSentryConfigured() || !config.dsn) {
        return;
      }

      try {
        const resolvedSdk = sdk ?? (await loadSdk());
        if (!active) {
          return;
        }

        setupSentry(resolvedSdk, {
          dsn: config.dsn,
          environment: config.environment,
        });
      } catch {
        // no-op blueprint behavior
      }
    }

    void setup();

    return () => {
      active = false;
    };
  }, [sdk]);

  return <>{children}</>;
}
